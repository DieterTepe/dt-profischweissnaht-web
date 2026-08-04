/* ============================================================================
 * DT-ProfiSchweissnaht · solver.js  (DTNSolver)
 * Baustein N3 — SPANNUNGEN UND BEIDE BEMESSUNGSWELTEN.
 *
 * WAS DIESES MODUL TUT (Schweissnaht-1.md 2.1, 2.3, 5.1):
 *   Schnittgroessen N, Q_y, Q_z, M_y, M_z, T am Nahtbild
 *     -> Spannungen sigma_senkrecht, tau_senkrecht, tau_parallel an JEDEM
 *        Randpunkt, der massgebende Punkt wird benannt
 *     -> Welt A (EN 1993-1-8 / EN 1993-1-4 / EN 1999-1-1) ODER
 *        Welt B (klassischer Maschinenbau, Roloff/Matek + Decker)
 *     -> Nachweis (a gegeben) ODER Auslegung (a gesucht)
 *
 * DIE BEIDEN WELTEN WERDEN NIE VERMISCHT (2.8). Das ist hier BAULICH
 * erzwungen, nicht nur durch Text: es gibt zwei getrennte Widerstandsbauer
 * (widerstandA / widerstandB), jeder liefert ein Objekt mit AUSSCHLIESSLICH
 * den Feldern seiner Welt. Ein Welt-A-Ergebnis kennt kein S und kein nu,
 * ein Welt-B-Ergebnis kennt kein beta_w und kein gamma_M2. Wer die falsche
 * Zahl sucht, findet sie nicht — statt sie stillschweigend zu bekommen.
 *
 * DAS SPANNUNGSMODELL — "Umklappen der Naht" (R1, Abschnitt 1.1):
 *   Am Randpunkt entstehen aus den Schnittgroessen drei Anteile, bezogen auf
 *   die in die Anschlussebene geklappte Nahtflaeche A_w = SUM(a*l):
 *     sigma_x = Normalspannung senkrecht zur Anschlussebene (aus N, M_y, M_z)
 *     tau_n   = Schub in der Ebene, QUER zur Nahtachse   (aus Q, T)
 *     tau_t   = Schub in der Ebene, LAENGS der Nahtachse (aus Q, T)
 *   Bei der gleichschenkligen 45-Grad-Kehlnaht liegt die wirksame Nahtebene
 *   um 45 Grad geneigt. Die quer wirkende Resultierende
 *     q_senk = sqrt(sigma_x^2 + tau_n^2)
 *   teilt sich deshalb auf in
 *     sigma_senk = tau_senk = q_senk / sqrt(2)    (Roloff/Matek Nr. 30)
 *   und laengs bleibt   tau_par = |tau_t|.
 *
 *   PROBE (beide in R1 belegt, im Harness S26 nachgerechnet):
 *     - reine Querzugkraft: sigma_v = sqrt(2)*q_senk, das Verhaeltnis zum
 *       vereinfachten Verfahren ist sqrt(3/2) = 1,2247 (Wald/CESTRUCO Q&A 3.4)
 *     - reine Laengsbeanspruchung: beide Verfahren liefern dasselbe
 *
 *   Die DURCHGESCHWEISSTE Stumpfnaht wird NICHT umgeklappt — dort ist die
 *   Nahtebene die Anschlussebene. Die TEILWEISE durchgeschweisste Naht
 *   (HV/HY/DHY) wird wie eine Kehlnaht gerechnet, mit a_wirksam = a - 2 mm
 *   (Wald/CESTRUCO Q&A 3.5, Roloff/Matek Nr. 20).
 *
 * WAS DIESES MODUL BEWUSST NICHT TUT:
 *   - keine Querschnittswerte (das ist naht.js), keine Profile (profil.js),
 *   - keine Ermuedung (N13) — Lastfall und Ermuedung werden NIE multipliziert,
 *   - keinen Grundwerkstoff-Nachweis (Liste 2.4) — auch nicht fuer die
 *     Alu-WEZ: die Abminderung wird ausgewiesen, aber ehrlich als NICHT
 *     Teil des Nahtnachweises beschriftet,
 *   - keine Texte: alles sind sprachneutrale Codes.
 *
 * DOM-frei · UMD/IIFE · deterministisch · mutiert seine Eingaben nicht.
 * ========================================================================== */
(function (root, factory) {
  var hatReq = (typeof require === 'function' && typeof module === 'object');
  var api = factory(
    hatReq ? require('./daten.js') : root.DTNData,
    hatReq ? require('./naht.js') : root.DTNNaht,
    hatReq ? require('./profil.js') : root.DTNProfil
  );
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNSolver = api;
}(typeof self !== 'undefined' ? self : this, function (Data, Naht, Profil) {
  'use strict';

  var VERSION = '0.1.0-N3';

  var W2 = Math.sqrt(2);
  var W3 = Math.sqrt(3);

  /* Kreisnaehte werden fuer die Spannungssuche verdichtet: naht.js liefert
     8 Randpunkte (fuer die Querschnittswerte genug), fuer das Spannungsmaximum
     ist das zu grob. 72 Punkte = 5 Grad, Restfehler unter 0,1 %. */
  var KREIS_SCHRITTE = 72;

  /* Ampel: gruen bis 90 % Ausnutzung, gelb bis 100 %, darueber rot. */
  var AMPEL_GRENZE_GRUEN = 0.90;

  /* Aufrundung des a-Masses (2.3, bindend) */
  var RUNDUNG = { ganze_mm: 1, halbe_mm: 0.5 };
  var RUNDUNG_STD = 'ganze_mm';
  var RUND_EPS = 1e-9;

  /* Auslegung: sigma ~ 1/a ist im duennwandigen Modell exakt, im Modell
     'exakt' wegen der a^3-Glieder nur fast. Deshalb direkt aufloesen und
     danach nachiterieren (2.3). */
  var ITER_MAX = 60;
  var ITER_TOL = 1e-12;

  /* AUSLEGUNG OHNE EINGETRAGENES a (N7): Im Auslegungsfall ist 'a' kein
     Pflichtfeld — es wird ja gesucht. profil.baue() verlangt aber eins, um
     ueberhaupt Segmente bauen zu koennen. Deshalb wird hier ein BEZUGSMASS
     eingesetzt, von dem aus die Iteration startet. Es ist ein reiner
     Rechenanfang und steht in KEINEM Ergebnis: die Iteration loest nach
     eta = 1 auf, das Bezugsmass kuerzt sich dabei heraus. Eine Assertion
     haelt fest, dass verschiedene Bezugsmasse dasselbe a_erf liefern. */
  var A_BEZUG_AUSLEGUNG = 5;

  var VERFAHREN_A = ['richtungsbezogen', 'vereinfacht'];
  var RICHTUNGEN = ['nachweis', 'auslegung'];
  var WELTEN = ['A', 'B'];

  var CODES = {
    fehler: [
      'msg_sv_welt_fehlt', 'msg_sv_richtung_unbekannt', 'msg_sv_nahtbild_fehlt',
      'msg_sv_werkstoff_fehlt', 'msg_sv_werkstoff_unbekannt', 'msg_sv_kennwerte_fehlen',
      'msg_sv_keine_last', 'msg_sv_last_doppelt', 'msg_sv_verfahren_unpassend',
      'msg_sv_alu_nur_weltA', 'msg_sv_kein_fw', 'msg_sv_kein_betaw', 'msg_sv_kein_nu',
      'msg_sv_a_fehlt', 'msg_sv_dicke_fehlt', 'msg_sv_iteration_erfolglos',
      'msg_sv_a_wirksam_null'
    ],
    warnungen: [
      'msg_sv_a_ueber_amax', 'msg_sv_a_unter_amin', 'msg_sv_l_eff_zu_kurz',
      'msg_sv_lange_naht', 'msg_sv_nicht_erfuellt'
    ],
    hinweise: [
      'msg_sv_umklappen', 'msg_sv_stumpf_voll_kein_nachweis', 'msg_sv_teil_abzug',
      'msg_sv_querkraft_mittelwert', 'msg_sv_lastfall_nur_weltB',
      'msg_sv_weltb_ohne_faktor3', 'msg_sv_weltb_tabelle', 'msg_sv_weltb_formelweg',
      'msg_sv_weltb_lastfall_ohne_wirkung', 'msg_sv_alu_wez', 'msg_sv_alu_wez_nicht_geprueft',
      'msg_sv_kreis_verdichtet', 'msg_sv_a_aufgerundet', 'msg_sv_a_je_segment_gerundet',
      'msg_sv_beta_lw_angewendet', 'msg_sv_beta_lw_nicht_angewendet',
      'msg_sv_umlaufend_aus_profil', 'msg_sv_sigma_senk_zusatz', 'msg_sv_schiefe_biegung',
      'msg_sv_l_eff_je_zug', 'msg_sv_a_grenzen_stumpf_voll',
      'msg_sv_a_bezug_auslegung', 'msg_sv_auslegung_geometrie'
    ]
  };

  /* Ergebnisgroessen mit Einheit — Futter fuer den Rechenweg (N4) und die
     Ergebniskacheln (N5). Beschriftung: sv_<code>. */
  var GROESSEN = [
    { code: 'sigma_x',    einheit: 'unit_Nmm2' },
    { code: 'tau_n',      einheit: 'unit_Nmm2' },
    { code: 'tau_t',      einheit: 'unit_Nmm2' },
    { code: 'q_senk',     einheit: 'unit_Nmm2' },
    { code: 'sigma_senk', einheit: 'unit_Nmm2' },
    { code: 'tau_senk',   einheit: 'unit_Nmm2' },
    { code: 'tau_par',    einheit: 'unit_Nmm2' },
    { code: 'sigma_v',    einheit: 'unit_Nmm2' },
    { code: 'sigma_res',  einheit: 'unit_Nmm2' },
    { code: 'R_d',        einheit: 'unit_Nmm2' },
    { code: 'eta',        einheit: 'unit_dimensionslos' },
    { code: 'a_erf',      einheit: 'unit_mm' },
    { code: 'a_gewaehlt', einheit: 'unit_mm' },
    { code: 'a_max',      einheit: 'unit_mm' },
    { code: 'a_min',      einheit: 'unit_mm' },
    { code: 'beta_Lw',    einheit: 'unit_dimensionslos' }
  ];

  /* --------------------------------------------------------------------- */
  /* Kleine Helfer                                                          */
  /* --------------------------------------------------------------------- */
  function zahl(x) {
    return (typeof x === 'number' && isFinite(x)) ? x : null;
  }
  function oder(x, standard) {
    var v = zahl(x);
    return v === null ? standard : v;
  }
  function fehlerObj(code, feld) {
    var o = { code: code };
    if (feld) o.feld = feld;
    return o;
  }
  function schiebe(liste, code, feld) {
    for (var i = 0; i < liste.length; i++) if (liste[i].code === code) return;
    liste.push(fehlerObj(code, feld));
  }
  function abbruch(fehler, warnungen, hinweise) {
    return {
      ok: false, version: VERSION,
      fehler: fehler, warnungen: warnungen || [], hinweise: hinweise || []
    };
  }

  /* Nahtart -> Rechenweg. Quelle ist daten.js, damit es nur EINE Liste gibt. */
  function nahtTyp(code) {
    if (!code) return null;
    for (var i = 0; i < Data.NAHTARTEN.length; i++) {
      var n = Data.NAHTARTEN[i];
      if (n.code !== code) continue;
      if (n.typ === 'kehl') return 'kehl';
      return n.durchgeschweisst ? 'stumpf_voll' : 'stumpf_teil';
    }
    return null;
  }

  /* Neue Segmentliste mit veraendertem a — die Eingabe bleibt unberuehrt. */
  function segmenteMitA(segmente, fn) {
    var out = [], i, s, k, n;
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i]; n = {};
      for (k in s) if (Object.prototype.hasOwnProperty.call(s, k)) n[k] = s[k];
      n.a = fn(s.a, i, s);
      out.push(n);
    }
    return out;
  }

  function aufrunden(x, stufe) {
    return Math.ceil(x / stufe - RUND_EPS) * stufe;
  }

  /* Massgebende kleinste Bauteildicke: ausdrueckliches t_min gewinnt, sonst
     das Kleinere von t1 und t2. Ohne jede Angabe: null (a_max bleibt offen
     und wird ehrlich als nicht pruefbar gemeldet). */
  function tMin(ein) {
    var t = zahl(ein.t_min);
    if (t !== null) return t;
    var t1 = zahl(ein.t1), t2 = zahl(ein.t2);
    if (t1 !== null && t2 !== null) return Math.min(t1, t2);
    if (t1 !== null) return t1;
    if (t2 !== null) return t2;
    return null;
  }

  /* --------------------------------------------------------------------- */
  /* 1) Auswertepunkte                                                      */
  /*    Gerade Segmente: die Randpunkte aus naht.js (die Spannung ist dort  */
  /*    linear, das Maximum liegt also am Ende). Kreisnaehte: verdichtet.   */
  /* --------------------------------------------------------------------- */
  function punkteBauen(segmente, nb, duenn) {
    var out = [], i, j, s, w, r, verdichtet = false;
    for (i = 0; i < nb.punkte.length; i++) {
      s = segmente[nb.punkte[i].seg];
      if (s && s.typ === 'kreis') continue;             /* kommt unten dichter */
      out.push({ y: nb.punkte[i].y, z: nb.punkte[i].z, r: nb.punkte[i].r,
                 seg: nb.punkte[i].seg, code: s ? (s.code || null) : null });
    }
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (!s || s.typ !== 'kreis') continue;
      verdichtet = true;
      /* Randradius genau wie in naht.js: duennwandig die Mittellinie,
         im Modell 'exakt' die Aussenkante (d + a)/2. Nur so passen die
         Spannungen zu W_t = I_p / r_max aus naht.js zusammen. */
      r = duenn ? s.d / 2 : (s.d + s.a) / 2;
      for (j = 0; j < KREIS_SCHRITTE; j++) {
        w = j * 2 * Math.PI / KREIS_SCHRITTE;
        out.push({ y: s.y + r * Math.cos(w) - nb.ys,
                   z: s.z + r * Math.sin(w) - nb.zs,
                   r: null, seg: i, code: s.code || null, winkel: w });
      }
    }
    for (i = 0; i < out.length; i++) {
      out[i].r = Math.sqrt(out[i].y * out[i].y + out[i].z * out[i].z);
    }
    return { punkte: out, verdichtet: verdichtet };
  }

  /* Richtung der Nahtachse am Punkt: e = laengs, n = quer (beides in der
     Anschlussebene). Beim Kreis ist die Achse die Tangente. */
  function achse(seg, p) {
    var dy, dz, l;
    if (seg.typ === 'kreis') {
      var w = (typeof p.winkel === 'number') ? p.winkel : Math.atan2(p.z, p.y);
      return { ey: -Math.sin(w), ez: Math.cos(w), ny: Math.cos(w), nz: Math.sin(w) };
    }
    dy = seg.y2 - seg.y1; dz = seg.z2 - seg.z1;
    l = Math.sqrt(dy * dy + dz * dz);
    if (l <= 0) return { ey: 1, ez: 0, ny: 0, nz: 1 };
    dy /= l; dz /= l;
    return { ey: dy, ez: dz, ny: -dz, nz: dy };
  }

  /* --------------------------------------------------------------------- */
  /* 2) Spannungen an einem Punkt                                           */
  /*    Allgemeine (schiefe) Biegung — deckt auch I_yz != 0 ab:             */
  /*      sigma = N/A + [(M_y*I_z + M_z*I_yz)*z - (M_z*I_y + M_y*I_yz)*y]   */
  /*                     / (I_y*I_z - I_yz^2)                               */
  /*    Bei I_yz = 0 wird daraus wieder N/A + M_y*z/I_y - M_z*y/I_z.        */
  /* --------------------------------------------------------------------- */
  function spannungAmPunkt(p, seg, nb, L, umklappen) {
    var nenner = nb.Iy * nb.Iz - nb.Iyz * nb.Iyz;
    var sx = (nb.A > 0) ? L.N / nb.A : 0;
    if (Math.abs(nenner) > 1e-12) {
      sx += ((L.My * nb.Iz + L.Mz * nb.Iyz) * p.z -
             (L.Mz * nb.Iy + L.My * nb.Iyz) * p.y) / nenner;
    }

    var ty = (nb.A > 0) ? L.Qy / nb.A : 0;
    var tz = (nb.A > 0) ? L.Qz / nb.A : 0;
    if (nb.Ip > 0 && L.T !== 0) {
      ty += -L.T * p.z / nb.Ip;
      tz += L.T * p.y / nb.Ip;
    }

    var ax = achse(seg, p);
    var tau_t = ty * ax.ey + tz * ax.ez;      /* laengs der Naht */
    var tau_n = ty * ax.ny + tz * ax.nz;      /* quer zur Naht   */

    var q_senk = Math.sqrt(sx * sx + tau_n * tau_n);
    var sigma_senk, tau_senk, tau_par;
    if (umklappen) {
      sigma_senk = q_senk / W2;
      tau_senk = q_senk / W2;
      tau_par = Math.abs(tau_t);
    } else {
      sigma_senk = Math.abs(sx);
      tau_senk = Math.abs(tau_n);
      tau_par = Math.abs(tau_t);
    }

    return {
      y: p.y, z: p.z, r: p.r, seg: p.seg, code: p.code,
      sigma_x: sx, tau_n: tau_n, tau_t: tau_t,
      q_senk: q_senk,
      sigma_senk: sigma_senk, tau_senk: tau_senk, tau_par: tau_par,
      /* Welt A, richtungsbezogen (EN 1993-1-8 / EN 1993-1-4 / EN 1999-1-1) */
      sigma_v: Math.sqrt(sigma_senk * sigma_senk +
                         3 * (tau_senk * tau_senk + tau_par * tau_par)),
      /* Vereinfachtes Verfahren und Welt B: Resultierende ohne Faktor 3 */
      sigma_res: Math.sqrt(sx * sx + tau_n * tau_n + tau_t * tau_t)
    };
  }

  /* --------------------------------------------------------------------- */
  /* 3) Widerstand — WELT A. Kennt weder S noch nu.                         */
  /* --------------------------------------------------------------------- */
  function widerstandA(ein, kw, w, fehler, hinweise) {
    var R = { welt: 'A' };
    if (w.gruppe === 'alu') {
      R.pfad = 'alu';
      R.gammaMw = oder(ein.gammaMw, Data.BEIWERTE.gamma_Mw.wert);
      var fw = zahl(ein.fw);
      if (fw === null) {
        var f = Data.fwSchweissgut(w.code, ein.zusatzwerkstoff);
        if (!f.ok) { schiebe(fehler, 'msg_sv_kein_fw', 'zusatzwerkstoff'); return null; }
        fw = f.wert; R.quelle_fw = 'tabelle'; R.q = f.q;
      } else { R.quelle_fw = 'eigener_wert'; }
      R.fw = fw;
      R.R_d = fw / R.gammaMw;
      R.formel = 'sv_formel_alu';
      R.R_d_sigma_senk = null;                 /* EN 1999 kennt den Zusatznachweis nicht */
      R.R_d_vereinfacht = null;
      R.wez = {
        rho_o: kw.rho_o, rho_u: kw.rho_u,
        f_o: kw.fo, f_u: kw.fu,
        f_o_haz: kw.rho_o * kw.fo, f_u_haz: kw.rho_u * kw.fu,
        zustand: kw.zustand, band_rho_o: kw.band_rho_o, band_rho_u: kw.band_rho_u
      };
      var bh = Data.bHaz(ein.schweissverfahren === 'wig' ? 'wig' : 'mig',
                         (tMin(ein) === null ? 10 : tMin(ein)));
      R.wez.b_haz = bh.ok ? bh.wert : null;
      R.wez.luecke = bh.ok ? (kw.luecke || null) : (bh.luecke || null);
      schiebe(hinweise, 'msg_sv_alu_wez');
      schiebe(hinweise, 'msg_sv_alu_wez_nicht_geprueft');
      schiebe(hinweise, 'lk_alu_kein_beta_w');
      return R;
    }

    R.pfad = (w.gruppe === 'edelstahl') ? 'edelstahl' : 'stahl';
    R.gammaM2 = oder(ein.gammaM2, Data.BEIWERTE.gamma_M2.wert);
    R.fu = oder(ein.fu, kw.fu);
    R.quelle_fu = (zahl(ein.fu) === null) ? 'tabelle' : 'eigener_wert';
    var bw = zahl(ein.betaW);
    if (bw === null) {
      var b = Data.betaW(w.code, ein.bw_regelsatz);
      if (!b.ok) { schiebe(fehler, 'msg_sv_kein_betaw', 'betaW'); return null; }
      bw = b.wert; R.bw_regelsatz = b.regelsatz; R.quelle_betaW = 'tabelle'; R.q = b.q;
    } else { R.quelle_betaW = 'eigener_wert'; R.bw_regelsatz = null; }
    R.betaW = bw;
    R.R_d = R.fu / (R.betaW * R.gammaM2);
    R.R_d_vereinfacht = (R.fu / W3) / (R.betaW * R.gammaM2);
    R.R_d_sigma_senk = Data.BEIWERTE.faktor_sigma_senkrecht.wert * R.fu / R.gammaM2;
    R.formel = 'sv_formel_ec3';
    return R;
  }

  /* --------------------------------------------------------------------- */
  /* 4) Widerstand — WELT B. Kennt weder beta_w noch gamma_M2.              */
  /*    Tabellenwerte sind massgeblich (stehende Regel), der Formelweg ist  */
  /*    die ehrlich gekennzeichnete Ausweichloesung.                        */
  /* --------------------------------------------------------------------- */
  function widerstandB(ein, kw, w, fehler, hinweise) {
    if (w.gruppe === 'alu') {
      schiebe(fehler, 'msg_sv_alu_nur_weltA', 'welt');
      return null;
    }
    var R = { welt: 'B', lastfall: ein.lastfall || 'ruhend' };
    schiebe(hinweise, 'msg_sv_weltb_ohne_faktor3');
    schiebe(hinweise, 'lk_weltb_kein_verbindliches_regelwerk');

    /* 4a) Tabellenweg */
    if (ein.weltb_nahtgruppe) {
      var tn = Data.weltBTabelle(w.code, ein.weltb_nahtgruppe, 'normal', R.lastfall);
      var ts = Data.weltBTabelle(w.code, ein.weltb_nahtgruppe, 'schub', R.lastfall);
      if (tn.ok && ts.ok) {
        R.pfad = 'tabelle';
        R.nahtgruppe = ein.weltb_nahtgruppe;
        R.sigma_zul = tn.wert;
        R.tau_zul = ts.wert;
        R.bewertungsgruppe = tn.bewertungsgruppe;
        R.q = tn.q;
        R.R_d = R.sigma_zul;
        R.formel = 'sv_formel_weltb_tabelle';
        schiebe(hinweise, 'msg_sv_weltb_tabelle');
        return R;
      }
      R.tabelle_luecke = tn.luecke || ts.luecke || tn.grund || ts.grund;
    }

    /* 4b) Formelweg sigma_zul = R_e / S * nu */
    R.pfad = 'formel';
    R.Re = oder(ein.Re, kw.fy);
    R.quelle_Re = (zahl(ein.Re) === null) ? 'tabelle' : 'eigener_wert';
    R.S = oder(ein.S, Data.WELTB_FORMEL.sicherheit.veraenderlich.S);
    var nu = zahl(ein.nu);
    if (nu === null) {
      var g = Data.WELTB_FORMEL.nahtguete[ein.nahtguete];
      if (!g) { schiebe(fehler, 'msg_sv_kein_nu', 'nu'); return null; }
      nu = (w.code === 'S355' && typeof g.nu_S355 === 'number') ? g.nu_S355 : g.nu;
      R.nahtguete = ein.nahtguete;
      R.quelle_nu = 'tabelle';
      R.q = g.q;
      if (g.luecke) R.nu_luecke = g.luecke;
    } else { R.quelle_nu = 'eigener_wert'; }
    R.nu = nu;
    R.sigma_zul = R.Re / R.S * R.nu;
    R.tau_zul = null;
    R.R_d = R.sigma_zul;
    R.formel = 'sv_formel_weltb_formel';
    schiebe(hinweise, 'msg_sv_weltb_formelweg');
    if (R.lastfall !== 'ruhend') schiebe(hinweise, 'msg_sv_weltb_lastfall_ohne_wirkung');
    if (w.code === 'S235' || w.code === 'S355') schiebe(hinweise, 'msg_sv_weltb_tabelle');
    return R;
  }

  /* --------------------------------------------------------------------- */
  /* 5) Eine vollstaendige Auswertung fuer EINEN Satz Segmente.             */
  /*    Wird beim Nachweis einmal, bei der Auslegung mehrfach gerufen.      */
  /* --------------------------------------------------------------------- */
  function auswerten(segmente, ctx) {
    var nb = Naht.rechne(segmente, { modell: ctx.modell });
    if (!nb.ok) return { ok: false, nb: nb };

    var pb = punkteBauen(segmente, nb, ctx.modell === 'duennwandig');
    var liste = [], i, s, sp, best = null, bestRes = null;
    for (i = 0; i < pb.punkte.length; i++) {
      s = segmente[pb.punkte[i].seg];
      if (!s) continue;
      sp = spannungAmPunkt(pb.punkte[i], s, nb, ctx.L, ctx.umklappen);
      liste.push(sp);
      if (best === null || sp.sigma_v > best.sigma_v) best = sp;
      if (bestRes === null || sp.sigma_res > bestRes.sigma_res) bestRes = sp;
    }
    if (!best) return { ok: false, nb: nb };

    return {
      ok: true, nb: nb, punkte: liste, verdichtet: pb.verdichtet,
      max_sigma_v: best.sigma_v, max_sigma_res: bestRes.sigma_res,
      max_sigma_senk: (function () {
        var m = 0;
        for (var k = 0; k < liste.length; k++) if (liste[k].sigma_senk > m) m = liste[k].sigma_senk;
        return m;
      }()),
      max_tau_res: (function () {
        var m = 0, t;
        for (var k = 0; k < liste.length; k++) {
          t = Math.sqrt(liste[k].tau_n * liste[k].tau_n + liste[k].tau_t * liste[k].tau_t);
          if (t > m) m = t;
        }
        return m;
      }()),
      massgebend: best, massgebend_res: bestRes
    };
  }

  /* Ausnutzung aus einer Auswertung — je Welt und Verfahren. */
  function ausnutzung(aus, R, verfahren) {
    var n = [];
    if (R.welt === 'A') {
      if (verfahren === 'vereinfacht') {
        n.push({ code: 'sv_nw_vereinfacht', ist: aus.max_sigma_res, grenze: R.R_d_vereinfacht });
      } else {
        n.push({ code: 'sv_nw_haupt', ist: aus.max_sigma_v, grenze: R.R_d });
        if (R.R_d_sigma_senk !== null) {
          n.push({ code: 'sv_nw_sigma_senk', ist: aus.max_sigma_senk, grenze: R.R_d_sigma_senk });
        }
      }
    } else {
      n.push({ code: 'sv_nw_weltb', ist: aus.max_sigma_res, grenze: R.sigma_zul });
      if (typeof R.tau_zul === 'number' && R.tau_zul > 0) {
        n.push({ code: 'sv_nw_weltb_schub', ist: aus.max_tau_res, grenze: R.tau_zul });
      }
    }
    var eta = 0;
    for (var i = 0; i < n.length; i++) {
      n[i].eta = (n[i].grenze > 0) ? n[i].ist / n[i].grenze : Infinity;
      n[i].erfuellt = n[i].eta <= 1 + 1e-12;
      if (n[i].eta > eta) eta = n[i].eta;
    }
    return { nachweise: n, eta: eta };
  }

  function ampel(eta) {
    if (eta <= AMPEL_GRENZE_GRUEN) return 'gruen';
    if (eta <= 1 + 1e-12) return 'gelb';
    return 'rot';
  }

  /* --------------------------------------------------------------------- */
  /* 6) Geometrische Grenzen je Segment (a_min, a_max, l_eff, lange Naht)   */
  /* --------------------------------------------------------------------- */
  /* NAHTZUEGE — die Ebene, auf die die Laengenpruefung gehoert (Plan 5.1-0).
     EN 1993-1-8 §4.5.1(2) spricht von EINER Kehlnaht, deren wirksame Laenge zu
     klein ist: gemeint sind kurze, freistehende Naehte. Eine umlaufend
     geschweisste Naht ist EIN Zug von z. B. 1182 mm — sie geht nur um Ecken.
     Ein 15-mm-Stueck mittendrin (die Flanschkante eines I-Profils) ist keine
     15-mm-Naht. Frueher lief die Pruefung je Segment; dadurch fiel JEDES I- und
     U-Profil mit umlaufender Naht durch, weil t_f nie 30 mm erreicht.
     profil.js gibt die Zugehoerigkeit als info[i].raupe bereits heraus.
     FEHLT sie (freier Segmentmodus), ist jedes Segment ein eigener Zug — das
     ist die strengere Annahme und genau das bisherige Verhalten. */
  function nahtzuege(segmente, info) {
    var zuege = [], nach = {}, i, key, z, a;
    for (i = 0; i < segmente.length; i++) {
      key = (info && info[i] && zahl(info[i].raupe) !== null)
          ? ('r' + info[i].raupe)
          : ('s' + i);
      z = nach[key];
      if (!z) {
        z = { index: zuege.length, segmente: [], l: 0, a: 0,
              geschlossen: !!(info && info[i] && info[i].geschlossen) };
        nach[key] = z;
        zuege.push(z);
      }
      a = segmente[i].a;
      z.segmente.push(i);
      z.l += Naht.laenge(segmente[i]);
      if (a > z.a) z.a = a;         /* strengste Grenze im Zug ist massgebend */
    }
    return zuege;
  }

  function grenzenPruefen(segmente, info, ein, warnungen, hinweise, typ) {
    var G = Data.GEOMETRIE;
    /* DIE a-GRENZEN SIND KEHLNAHT-REGELN (N7, Dieters Entscheidung 2026-08-04).
       Bei der DURCHGESCHWEISSTEN Stumpfnaht ist a = t die Definition — dort
       waere a <= 0,7*t rechnerisch IMMER verletzt, und a >= 3 mm wuerde jedes
       duenne Blech falsch anzeigen. Beide Grenzen gelten deshalb nur fuer die
       Kehlnaht UND die teilweise durchgeschweisste Naht (HV/HY/DHY), wo eine
       Kehlnahtlage vorliegt. Ausgenommen ist ausschliesslich 'stumpf_voll'.
       Vorher meldete der Solver gruene Ampel und der Rechenweg zugleich
       'a_max nicht erfuellt' — genau der Widerspruch aus Plan 9.2. */
    var aGrenzenGelten = (typ !== 'stumpf_voll');
    var a_min = oder(ein.a_min, G.a_min_ec3.wert);
    var out = { a_min: aGrenzenGelten ? a_min : null,
                a_grenzen_gelten: aGrenzenGelten,
                verletzt: [], je_segment: [], je_zug: [],
                n_zuege: 0, mehrsegmentig: false, beta_Lw: null, lange_naht: false };
    if (!aGrenzenGelten) schiebe(hinweise, 'msg_sv_a_grenzen_stumpf_voll');
    var zuege = nahtzuege(segmente, info);
    var zugVon = {}, i, j, s, t, amax, l, lang, zg, leffmin, kurz;
    for (i = 0; i < zuege.length; i++) {
      for (j = 0; j < zuege[i].segmente.length; j++) zugVon[zuege[i].segmente[j]] = i;
      if (zuege[i].segmente.length > 1) out.mehrsegmentig = true;
    }
    out.n_zuege = zuege.length;

    /* --- je Segment: a_min, a_max und die lange Naht ---------------------
       Die Langnaht-Abminderung beta_Lw bleibt BEWUSST je Segment. Sie zielt
       auf lange Laschenanschluesse; ein umlaufender Zug von 1182 mm wuerde
       sie sonst faelschlich ausloesen (benannte Entscheidung, Plan 9.2). */
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      t = null;
      if (info && info[i] && zahl(info[i].t) !== null) t = info[i].t;
      if (t === null) t = tMin(ein);
      amax = (t === null || !aGrenzenGelten) ? null : 0.7 * t;
      l = Naht.laenge(s);
      lang = l > 150 * s.a;
      if (lang) out.lange_naht = true;
      out.je_segment.push({
        index: i, code: s.code || null, a: s.a, t: t,
        a_max: amax, l: l, zug: zugVon[i], lang: lang
      });
      if (aGrenzenGelten && amax !== null && s.a > amax + 1e-9) {
        out.verletzt.push({ code: 'msg_sv_a_ueber_amax', index: i, ist: s.a, grenze: amax });
      }
      if (aGrenzenGelten && s.a < a_min - 1e-9) {
        out.verletzt.push({ code: 'msg_sv_a_unter_amin', index: i, ist: s.a, grenze: a_min });
      }
    }

    /* --- je NAHTZUG: die Mindestlaenge ---------------------------------- */
    for (i = 0; i < zuege.length; i++) {
      zg = zuege[i];
      leffmin = Math.max(6 * zg.a, 30);
      kurz = zg.l < leffmin - 1e-9;
      out.je_zug.push({
        index: i, n_seg: zg.segmente.length, segmente: zg.segmente.slice(0),
        l: zg.l, a: zg.a, l_eff_min: leffmin,
        geschlossen: zg.geschlossen, zu_kurz: kurz
      });
      if (kurz) {
        out.verletzt.push({ code: 'msg_sv_l_eff_zu_kurz', zug: i, ist: zg.l, grenze: leffmin });
      }
    }
    if (out.mehrsegmentig) schiebe(hinweise, 'msg_sv_l_eff_je_zug');
    for (i = 0; i < out.verletzt.length; i++) schiebe(warnungen, out.verletzt[i].code);

    if (out.lange_naht) {
      var lmax = 0, amax2 = 0;
      for (i = 0; i < out.je_segment.length; i++) {
        if (out.je_segment[i].lang && out.je_segment[i].l > lmax) {
          lmax = out.je_segment[i].l; amax2 = out.je_segment[i].a;
        }
      }
      out.beta_Lw = Math.min(1.0, 1.2 - 0.2 * lmax / (150 * amax2));
      out.lj = lmax;
      schiebe(warnungen, 'msg_sv_lange_naht');
      schiebe(hinweise, ein.beta_lw_anwenden ? 'msg_sv_beta_lw_angewendet'
                                             : 'msg_sv_beta_lw_nicht_angewendet');
    }
    return out;
  }

  /* --------------------------------------------------------------------- */
  /* 7) HAUPTFUNKTION                                                       */
  /* --------------------------------------------------------------------- */
  /* DIE GEOMETRIE HAENGT SELBST AM a-MASS (N7-Befund, 2026-08-04).
     Der Endkraterabzug betraegt 2*a je offener Raupe und wird GEOMETRISCH
     abgezogen (profil.js). Bei der Auslegung wird das Nahtbild also mit
     einem Bezugsmass gebaut, waehrend gesucht erst noch wird — mit einem
     anderen Bezugsmass kam ein anderes a_erf heraus (gemessen: 1,6931 bei
     Bezug 3 gegen 1,8628 bei Bezug 10, rund 10 % Unterschied). Ein
     Ergebnis, das vom Rechenanfang abhaengt, ist kein Ergebnis.
     Abhilfe: die ganze Kette wird mit dem gefundenen a erneut durchlaufen,
     bis sich das Nahtbild nicht mehr bewegt. Bei umlaufender Naht gibt es
     keinen Endkraterabzug — dort haelt die Schleife sofort.
     Der Aufwand ist klein, weil die Abhaengigkeit schwach ist. */
  var AUS_ITER_MAX = 12;
  var AUS_ITER_TOL = 1e-9;

  function rechne(ein) {
    ein = ein || {};
    var erg = rechneEinmal(ein);
    if (!erg.ok || erg.rechenrichtung !== 'auslegung' ||
        !ein.profil_eingabe || !erg.auslegung) return erg;
    /* Ohne Endkraterabzug ist das Nahtbild vom a-Mass unabhaengig. */
    if (!(erg.nahtbild && erg.nahtbild.endkrater_abzug > 0)) return erg;

    var runden = 0, aVor = erg.auslegung.a_bezug, aNeu = erg.auslegung.a_erf, ein2, kopie, pk;
    while (runden < AUS_ITER_MAX && Math.abs(aNeu - aVor) > AUS_ITER_TOL) {
      kopie = {};
      for (pk in ein.profil_eingabe) {
        if (Object.prototype.hasOwnProperty.call(ein.profil_eingabe, pk)) {
          kopie[pk] = ein.profil_eingabe[pk];
        }
      }
      kopie.a = aNeu;
      ein2 = {};
      for (pk in ein) if (Object.prototype.hasOwnProperty.call(ein, pk)) ein2[pk] = ein[pk];
      ein2.profil_eingabe = kopie;
      ein2.a = undefined;
      var erg2 = rechneEinmal(ein2);
      if (!erg2.ok || !erg2.auslegung) return erg;
      erg = erg2;
      aVor = aNeu;
      aNeu = erg2.auslegung.a_erf;
      runden++;
    }
    erg.auslegung.geometrie_runden = runden;
    if (runden > 0) schiebe(erg.hinweise, 'msg_sv_auslegung_geometrie');
    return erg;
  }

  function rechneEinmal(ein) {
    ein = ein || {};
    var fehler = [], warnungen = [], hinweise = [], i;

    /* 7.1 Welt und Rechenrichtung -------------------------------------- */
    var welt = ein.welt;
    if (WELTEN.indexOf(welt) < 0) {
      schiebe(fehler, 'msg_sv_welt_fehlt', 'welt');
      return abbruch(fehler, warnungen, hinweise);
    }
    var richtung = ein.rechenrichtung || 'nachweis';
    if (RICHTUNGEN.indexOf(richtung) < 0) {
      schiebe(fehler, 'msg_sv_richtung_unbekannt', 'rechenrichtung');
      return abbruch(fehler, warnungen, hinweise);
    }
    var verfahren = (welt === 'A') ? (ein.nachweisverfahren || 'richtungsbezogen') : null;
    if (welt === 'A' && VERFAHREN_A.indexOf(verfahren) < 0) verfahren = 'richtungsbezogen';

    /* 7.2 Nahtbild besorgen -------------------------------------------- */
    var segEin = null, info = null, umlaufend = null, profil = null, pEin = null;
    if (ein.profil_eingabe) {
      /* AUSLEGUNG OHNE a (N7-Befund): 'a' ist im Auslegungsfall kein
         Pflichtfeld, profil.baue() verlangt aber eins. Ohne Bezugsmass
         scheiterte JEDE Auslegung ueber das Formular an
         'msg_profil_a_fehlt' — die halbe Rechenrichtung des Programms war
         damit unerreichbar. Aufgefallen ist es erst, als N7 den ersten
         Auslegungsfall als Beispiel bauen wollte. */
      pEin = ein.profil_eingabe;
      if (richtung === 'auslegung' && zahl(pEin.a) === null) {
        var kopie = {};
        for (var pk in pEin) {
          if (Object.prototype.hasOwnProperty.call(pEin, pk)) kopie[pk] = pEin[pk];
        }
        kopie.a = A_BEZUG_AUSLEGUNG;
        pEin = kopie;
        schiebe(hinweise, 'msg_sv_a_bezug_auslegung');
      }
      profil = Profil.baue(pEin);
      if (!profil.ok) {
        for (i = 0; i < profil.fehler.length; i++) fehler.push(profil.fehler[i]);
        return abbruch(fehler, warnungen, hinweise);
      }
      segEin = profil.segmente; info = profil.info; umlaufend = profil.umlaufend;
      for (i = 0; i < profil.hinweise.length; i++) schiebe(hinweise, profil.hinweise[i].code);
    } else if (ein.segmente && ein.segmente.length) {
      segEin = ein.segmente;
      info = ein.info || null;
      umlaufend = (typeof ein.umlaufend === 'boolean') ? ein.umlaufend : null;
    } else {
      schiebe(fehler, 'msg_sv_nahtbild_fehlt', 'profil');
      return abbruch(fehler, warnungen, hinweise);
    }

    /* 7.3 Nahtart und wirksames a -------------------------------------- */
    var typ = nahtTyp(ein.nahtart);
    var umklappen = (typ !== 'stumpf_voll');
    /* Teilweise durchgeschweisst (HV/HY/DHY): a_wirksam = a_nenn - 2 mm
       (daten.js GEOMETRIE.a_teilweise_durchgeschweisst, Wald/CESTRUCO Q&A 3.5
       und Roloff/Matek Nr. 20). */
    var aAbzug = (typ === 'stumpf_teil') ? 2 : 0;
    if (typ === 'stumpf_voll') schiebe(hinweise, 'msg_sv_stumpf_voll_kein_nachweis');
    if (typ === 'stumpf_teil') schiebe(hinweise, 'msg_sv_teil_abzug');
    if (umklappen) schiebe(hinweise, 'msg_sv_umklappen');
    if (welt === 'A' && verfahren === 'vereinfacht' && typ === 'stumpf_voll') {
      schiebe(fehler, 'msg_sv_verfahren_unpassend', 'nachweisverfahren');
      return abbruch(fehler, warnungen, hinweise);
    }

    function wirksam(segmente) {
      if (!aAbzug) return segmente;
      return segmenteMitA(segmente, function (a) { return a - aAbzug; });
    }

    /* 7.4 Werkstoff und Kennwerte -------------------------------------- */
    if (!ein.werkstoff) {
      schiebe(fehler, 'msg_sv_werkstoff_fehlt', 'werkstoff');
      return abbruch(fehler, warnungen, hinweise);
    }
    var w = Data.werkstoff(ein.werkstoff);
    if (!w) {
      schiebe(fehler, 'msg_sv_werkstoff_unbekannt', 'werkstoff');
      return abbruch(fehler, warnungen, hinweise);
    }
    /* Massgebende Dicke: t_min, sonst das Kleinere von t1 und t2 — so muss
       der Anwender t_min nicht doppelt eintippen (Leitziel: wenige Eingaben). */
    var tKenn = tMin(ein);
    var kw = Data.kennwerte(w.code, tKenn, ein.zustand);
    if (!kw.ok) {
      schiebe(fehler, 'msg_sv_kennwerte_fehlen', 'werkstoff');
      if (kw.grund) schiebe(hinweise, 'lk_' + kw.grund);
      return abbruch(fehler, warnungen, hinweise);
    }
    if (kw.luecke) schiebe(hinweise, 'lk_' + kw.luecke);

    /* 7.5 Widerstand — GETRENNTE WEGE, nie vermischt (2.8) -------------- */
    var R = (welt === 'A')
      ? widerstandA(ein, kw, w, fehler, hinweise)
      : widerstandB(ein, kw, w, fehler, hinweise);
    if (!R || fehler.length) return abbruch(fehler, warnungen, hinweise);
    if (welt === 'A' && ein.lastfall) schiebe(hinweise, 'msg_sv_lastfall_nur_weltB');

    /* 7.6 Schnittgroessen ---------------------------------------------- */
    var L = { N: 0, Qy: 0, Qz: 0, My: 0, Mz: 0, T: 0 };
    function nimm(langName, kurzName, faktor) {
      var lang = zahl(ein[langName]), kurz = (kurzName ? zahl(ein[kurzName]) : null);
      if (lang !== null && kurz !== null && Math.abs(lang - kurz) > 1e-12) {
        schiebe(fehler, 'msg_sv_last_doppelt', kurzName);
        return 0;
      }
      var v = (lang !== null) ? lang : (kurz !== null ? kurz : 0);
      return v * faktor;
    }
    L.N = nimm('N', null, 1);
    L.Qy = nimm('Qy', null, 1);
    L.Qz = nimm('Qz', 'Q', 1);
    L.My = nimm('My', 'M', 1000);        /* Nm -> Nmm */
    L.Mz = nimm('Mz', null, 1000);
    L.T = nimm('T', null, 1000);
    if (fehler.length) return abbruch(fehler, warnungen, hinweise);
    if (!L.N && !L.Qy && !L.Qz && !L.My && !L.Mz && !L.T) {
      schiebe(fehler, 'msg_sv_keine_last', 'N');
      return abbruch(fehler, warnungen, hinweise);
    }
    if (L.Qy || L.Qz) schiebe(hinweise, 'msg_sv_querkraft_mittelwert');

    var ctx = { modell: ein.modell || 'exakt', L: L, umklappen: umklappen };

    /* 7.7 Erste Auswertung mit dem eingegebenen a ----------------------- */
    var segIst = wirksam(segEin);
    for (i = 0; i < segIst.length; i++) {
      if (segIst[i].a <= 0) {
        schiebe(fehler, 'msg_sv_a_wirksam_null', 'a');
        return abbruch(fehler, warnungen, hinweise);
      }
    }
    var aus = auswerten(segIst, ctx);
    if (!aus.ok) {
      if (aus.nb && aus.nb.fehler) {
        for (i = 0; i < aus.nb.fehler.length; i++) fehler.push(aus.nb.fehler[i]);
      }
      if (!fehler.length) schiebe(fehler, 'msg_sv_nahtbild_fehlt', 'profil');
      return abbruch(fehler, warnungen, hinweise);
    }

    var A0 = ausnutzung(aus, R, verfahren);

    /* 7.8 Auslegung ----------------------------------------------------- */
    var auslegung = null;
    if (richtung === 'auslegung') {
      auslegung = auslegen(segEin, wirksam, ctx, R, verfahren, ein, aus, A0,
                           fehler, warnungen, hinweise);
      if (fehler.length) return abbruch(fehler, warnungen, hinweise);
      if (auslegung && auslegung.auswertung) {
        aus = auslegung.auswertung;
        A0 = auslegung.ausnutzung;
      }
    }

    /* 7.8b Meldungen aus naht.js — ERST JETZT, damit die a-abhaengigen
       Meldungen (a zu gross, Duennwandigkeit) zum ENDgueltigen a-Mass
       passen und nicht zum Startwert der Auslegung. Dazu die Korrektur
       aus 4.6: fuer "umlaufend oder nicht" gilt profil.js, NICHT naht.js. */
    for (i = 0; i < aus.nb.hinweise.length; i++) {
      var hc = aus.nb.hinweise[i].code;
      if (hc === 'msg_torsion_offenes_nahtbild' && umlaufend === true) {
        schiebe(hinweise, 'msg_sv_umlaufend_aus_profil');
        continue;
      }
      schiebe(hinweise, hc);
    }
    for (i = 0; i < aus.nb.warnungen.length; i++) schiebe(warnungen, aus.nb.warnungen[i].code);
    if (aus.nb.schiefe_biegung) schiebe(hinweise, 'msg_sv_schiefe_biegung');
    if (aus.verdichtet) schiebe(hinweise, 'msg_sv_kreis_verdichtet');
    if (welt === 'A' && verfahren === 'richtungsbezogen' && R.R_d_sigma_senk !== null) {
      schiebe(hinweise, 'msg_sv_sigma_senk_zusatz');
    }

    /* 7.9 Geometrische Grenzen ----------------------------------------- */
    var segGrenz = (richtung === 'auslegung' && auslegung) ? auslegung.segmente : segEin;
    var grenzen = grenzenPruefen(segGrenz, info, ein, warnungen, hinweise, typ);
    if (A0.eta > 1 + 1e-12) schiebe(warnungen, 'msg_sv_nicht_erfuellt');

    /* 7.10 Ergebnis ----------------------------------------------------- */
    var erg = {
      ok: true, version: VERSION,
      welt: welt, rechenrichtung: richtung, verfahren: verfahren,
      modell: aus.nb.modell, nahtart: ein.nahtart || null, nahttyp: typ,
      umklappen: umklappen, a_abzug: aAbzug,
      werkstoff: {
        code: w.code, gruppe: w.gruppe, norm: w.norm,
        fy: (typeof kw.fy === 'number') ? kw.fy : null,
        fu: (typeof kw.fu === 'number') ? kw.fu : null,
        fo: (typeof kw.fo === 'number') ? kw.fo : null,
        zustand: kw.zustand || null, luecke: kw.luecke || null, q: kw.q || null
      },
      widerstand: R,
      schnittgroessen: { N: L.N, Qy: L.Qy, Qz: L.Qz, My: L.My, Mz: L.Mz, T: L.T },
      nahtbild: {
        n_seg: aus.nb.n_seg, l_ges: aus.nb.l_ges, A: aus.nb.A,
        ys: aus.nb.ys, zs: aus.nb.zs,
        Iy: aus.nb.Iy, Iz: aus.nb.Iz, Iyz: aus.nb.Iyz, Ip: aus.nb.Ip,
        Wy: aus.nb.Wy, Wz: aus.nb.Wz, Wt: aus.nb.Wt,
        rmax: aus.nb.rmax, geschlossen: aus.nb.geschlossen,
        offene_enden: aus.nb.offene_enden, umlaufend: umlaufend,
        endkrater_abzug: profil ? profil.endkrater_abzug : 0,
        /* DIE EINGABE, MIT DER WIRKLICH GERECHNET WURDE (N7). Im
           Auslegungsfall traegt sie das gefundene a-Mass, nicht das leere
           Feld des Formulars. Wer das Nahtbild zeichnet, muss dieselbe
           Geometrie zeichnen, die gerechnet wurde — sonst zeigt das Bild
           etwas anderes als die Zahlen, oder es bleibt (wie vor N7 im
           Auslegungsfall) ganz leer. */
        profil_eingabe: ein.profil_eingabe ? pEin : null,
        kontrolle: aus.nb.kontrolle
      },
      punkte: aus.punkte,
      massgebend: aus.massgebend,
      nachweise: A0.nachweise,
      eta: A0.eta,
      ampel: ampel(A0.eta),
      erfuellt: A0.eta <= 1 + 1e-12,
      auslegung: auslegung ? {
        a_erf: auslegung.a_erf, a_gewaehlt: auslegung.a_gewaehlt,
        a_bezug: auslegung.a_bezug, faktor: auslegung.faktor,
        stufe: auslegung.stufe, rundung: auslegung.rundung,
        iterationen: auslegung.iterationen,
        je_segment: auslegung.je_segment,
        eta_mit_gewaehlt: auslegung.ausnutzung.eta
      } : null,
      grenzen: grenzen,
      nicht_geprueft: Data.NICHT_GEPRUEFT.slice(0),
      fehler: fehler, warnungen: warnungen, hinweise: hinweise
    };
    return erg;
  }

  /* --------------------------------------------------------------------- */
  /* 8) Auslegung: a gesucht (2.3)                                          */
  /*    Direkt aufloesen (sigma ~ 1/a), danach nachiterieren, dann nach der */
  /*    bindenden Regel AUFrunden — je Segment, denn a ist ein Fertigungs-  */
  /*    mass. Im Ergebnis stehen a_erf UND a_gewaehlt.                      */
  /* --------------------------------------------------------------------- */
  function auslegen(segEin, wirksam, ctx, R, verfahren, ein, aus0, A0,
                    fehler, warnungen, hinweise) {
    var i, k, aus, Ax;

    /* Bezugs-a: das a des massgebenden Segments (dort entscheidet sich der
       Nachweis), sonst das groesste a im Nahtbild. */
    var aBezug = zahl(ein.a);
    if (aBezug === null) {
      var segM = segEin[aus0.massgebend.seg];
      if (segM) {
        aBezug = segM.a;
      } else {
        aBezug = 0;
        for (i = 0; i < segEin.length; i++) if (segEin[i].a > aBezug) aBezug = segEin[i].a;
      }
    }
    if (!(aBezug > 0)) { schiebe(fehler, 'msg_sv_a_fehlt', 'a'); return null; }

    function etaBei(faktor) {
      var s = segmenteMitA(segEin, function (a) { return a * faktor; });
      var sw = wirksam(s);
      for (var j = 0; j < sw.length; j++) if (sw[j].a <= 0) return { eta: Infinity };
      var a2 = auswerten(sw, ctx);
      if (!a2.ok) return { eta: Infinity };
      var u = ausnutzung(a2, R, verfahren);
      return { eta: u.eta, aus: a2, u: u, seg: s, segw: sw };
    }

    /* Startwert direkt aus der Proportionalitaet sigma ~ 1/a */
    var f = (A0.eta > 0 && isFinite(A0.eta)) ? A0.eta : 1;
    if (!(f > 0)) f = 1;
    var schritte = 0, letzte = null;
    for (k = 0; k < ITER_MAX; k++) {
      letzte = etaBei(f);
      schritte++;
      if (!isFinite(letzte.eta)) { f = f * 2; continue; }
      if (Math.abs(letzte.eta - 1) <= ITER_TOL) break;
      f = f * letzte.eta;
      if (!(f > 0) || !isFinite(f)) { schiebe(fehler, 'msg_sv_iteration_erfolglos', 'a'); return null; }
    }
    if (!letzte || !isFinite(letzte.eta) || Math.abs(letzte.eta - 1) > 1e-6) {
      schiebe(fehler, 'msg_sv_iteration_erfolglos', 'a');
      return null;
    }

    var aErf = aBezug * f;

    /* Aufrunden — bindende Regel 2.3 */
    var rundung = (ein.a_rundung && RUNDUNG[ein.a_rundung]) ? ein.a_rundung : RUNDUNG_STD;
    var stufe = RUNDUNG[rundung];
    var aGew = aufrunden(aErf, stufe);

    /* je Segment aufrunden: jedes Segment bekommt ein echtes Fertigungsmass */
    var segErf = segmenteMitA(segEin, function (a) { return a * f; });
    var segGew = segmenteMitA(segErf, function (a) { return aufrunden(a, stufe); });
    var jeSeg = [];
    for (i = 0; i < segEin.length; i++) {
      jeSeg.push({
        index: i, code: segEin[i].code || null,
        a_start: segEin[i].a, a_erf: segErf[i].a, a_gewaehlt: segGew[i].a
      });
    }
    var mehrfach = false;
    for (i = 1; i < jeSeg.length; i++) if (jeSeg[i].a_gewaehlt !== jeSeg[0].a_gewaehlt) mehrfach = true;

    var segGewW = wirksam(segGew);
    aus = auswerten(segGewW, ctx);
    if (!aus.ok) { schiebe(fehler, 'msg_sv_iteration_erfolglos', 'a'); return null; }
    Ax = ausnutzung(aus, R, verfahren);

    schiebe(hinweise, 'msg_sv_a_aufgerundet');
    if (mehrfach) schiebe(hinweise, 'msg_sv_a_je_segment_gerundet');

    return {
      a_bezug: aBezug, faktor: f, a_erf: aErf, a_gewaehlt: aGew,
      stufe: stufe, rundung: rundung, iterationen: schritte,
      je_segment: jeSeg,
      segmente: segGew, segmente_wirksam: segGewW,
      auswertung: aus, ausnutzung: Ax,
      /* fuer die Pflicht-Assertion "Auslegung und Nachweis sind invers" */
      eta_bei_a_erf: letzte.eta
    };
  }

  /* --------------------------------------------------------------------- */
  /* 9) Kleine oeffentliche Helfer (Rechenweg N4, UI N5)                    */
  /* --------------------------------------------------------------------- */

  /* a-Mass aufrunden nach der bindenden Regel — auch einzeln nutzbar. */
  function rundeA(a_erf, rundungCode) {
    var r = (rundungCode && RUNDUNG[rundungCode]) ? rundungCode : RUNDUNG_STD;
    return { a_erf: a_erf, a_gewaehlt: aufrunden(a_erf, RUNDUNG[r]),
             stufe: RUNDUNG[r], rundung: r };
  }

  /* a_max = 0,7 * t_min (Roloff/Matek, DSW — Praxisrichtwert, nicht EC3). */
  function aMax(t_min) {
    var t = zahl(t_min);
    return (t === null) ? null : 0.7 * t;
  }

  /* Schnittgroessen aus Kraft und Hebelarm (2.12, geometrischer Weg). */
  function schnittgroessen(F, e, richtung) {
    var f = oder(F, 0), a = oder(e, 0);
    if (richtung === 'quer') return { Qz: f, My: f * a / 1000, N: 0, T: 0 };
    if (richtung === 'torsion') return { T: f * a / 1000, N: 0, Qz: 0, My: 0 };
    return { N: f, My: f * a / 1000, Qz: 0, T: 0 };
  }

  return {
    VERSION: VERSION,
    CODES: CODES,
    GROESSEN: GROESSEN,
    RUNDUNG: RUNDUNG,
    RUNDUNG_STD: RUNDUNG_STD,
    VERFAHREN: VERFAHREN_A,
    RICHTUNGEN: RICHTUNGEN,
    WELTEN: WELTEN,
    AMPEL_GRENZE_GRUEN: AMPEL_GRENZE_GRUEN,
    KREIS_SCHRITTE: KREIS_SCHRITTE,
    rechne: rechne,
    nahtTyp: nahtTyp,
    rundeA: rundeA,
    aMax: aMax,
    ampel: ampel,
    schnittgroessen: schnittgroessen
  };
}));
