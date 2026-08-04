/* ============================================================================
 * DT-ProfiSchweissnaht · rechenweg.js  (DTNRechenweg)
 * Baustein N4 — DER SELBSTPRUEFENDE RECHENWEG.
 *
 * WAS DIESES MODUL TUT (Schweissnaht-1.md, stehende Regel 8 und Auftrag 5.1):
 *   Es macht aus dem, was naht.js, profil.js und solver.js GERECHNET haben,
 *   eine nachvollziehbare SCHRITTLISTE:
 *     je Schritt  code (i18n-Schluessel) · formel (Klartext, Symbole
 *     sprachneutral) · eingesetzt (dieselbe Formel mit den echten Zahlen) ·
 *     ergebnis + einheit · quelle (Norm/Regelwerk) · haken (bestanden ja/nein)
 *     und optional ein hinweis.
 *
 * DIE SCHRITTLISTE IST DATEN, KEIN TEXT. Die Zahlen stehen als Zahlen da,
 * die Vorlagen tragen Platzhalter {0} {1} …. Erst rendere(rw, sprache) setzt
 * Texte und Zahlformat zusammen — damit ist derselbe Rechenweg in DE/EN/PT
 * dieselbe Datenstruktur, und die Oberflaeche (N5) und die Ausgaben (N11)
 * RENDERN nur noch.
 *
 * SELBSTPRUEFEND heisst hier woertlich: fast jeder Schritt traegt einen
 * ZWEITEN RECHENPFAD, der aus dem Ergebnis unabhaengig nachgerechnet wird
 * (A_w gegen SUM a*l, I_p gegen I_y+I_z, sigma_x aus der schiefen Biegung neu
 * gebildet, tau ueber die Invarianz der Projektion, R_d aus f_u/(beta_w*gamma),
 * eta aus ist/grenze, a_gewaehlt aus dem Aufrunden von a_erf). Stimmt eine
 * Zahl im Ergebnis nicht, KIPPT EIN HAEKCHEN. Das ist die Pflicht-Assertion
 * fuer N4 (Negativkontrolle, Harness-Sektion S28).
 *
 * WAS DIESES MODUL BEWUSST NICHT TUT:
 *   - es rechnet den Nachweis NICHT noch einmal: die massgebenden Zahlen
 *     kommen aus solver.js. Nachgerechnet wird nur zur PROBE,
 *   - es entscheidet nichts (keine Ampel, keine Auslegung, keine Grenzen) —
 *     es beschriftet und prueft,
 *   - es kennt keine Oberflaeche und kein DOM,
 *   - es erfindet keine Zahl: fehlt ein Wert, bleibt der Schritt ohne Zahl
 *     und ohne Haken statt mit einem stillen Ersatzwert.
 *
 * DOM-frei · UMD/IIFE · deterministisch · mutiert seine Eingaben nicht.
 * Laedt NACH naht.js, profil.js, solver.js und i18n_kern.js.
 * ========================================================================== */
(function (root, factory) {
  var hatReq = (typeof require === 'function' && typeof module === 'object');
  var api = factory(
    hatReq ? require('./naht.js') : root.DTNNaht,
    hatReq ? require('./profil.js') : root.DTNProfil,
    hatReq ? require('./solver.js') : root.DTNSolver,
    hatReq ? require('./i18n_kern.js') : root.DTNI18nKern
  );
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNRechenweg = api;
}(typeof self !== 'undefined' ? self : this, function (Naht, Profil, Solver, Kern) {
  'use strict';

  var VERSION = '0.1.0-N4';

  /* Toleranz der Proben. Grosszuegig genug fuer Gleitkomma-Rundung,
     eng genug, dass eine verfaelschte Zahl auffaellt. */
  var TOL = 1e-9;

  var W2 = Math.sqrt(2);

  /* ---------------------------------------------------------------------- */
  /* 1) Verzeichnisse — jeder Code hat einen Text (durch Assertion gesichert) */
  /* ---------------------------------------------------------------------- */

  var ABSCHNITTE = [
    'rw_ab_eingaben', 'rw_ab_nahtbild', 'rw_ab_schnittgroessen',
    'rw_ab_spannungen', 'rw_ab_widerstand', 'rw_ab_nachweis',
    'rw_ab_auslegung', 'rw_ab_grenzen', 'rw_ab_selbstpruefung',
    'rw_ab_nicht_geprueft', 'rw_ab_hinweise'
  ];

  var SCHRITTE = [
    'rw_s_welt', 'rw_s_verfahren', 'rw_s_werkstoff', 'rw_s_nahtart',
    'rw_s_modell', 'rw_s_profil', 'rw_s_endkrater',
    'rw_s_segmente', 'rw_s_flaeche', 'rw_s_schwerpunkt', 'rw_s_iy', 'rw_s_iz',
    'rw_s_ip', 'rw_s_hauptachsen', 'rw_s_widerstandsmomente',
    'rw_s_lasten', 'rw_s_lasten_umrechnung',
    'rw_s_massgebender_punkt', 'rw_s_sigma_x', 'rw_s_tau', 'rw_s_umklappen',
    'rw_s_sigma_v', 'rw_s_sigma_res',
    'rw_s_widerstand', 'rw_s_widerstand_zusatz', 'rw_s_wez',
    'rw_s_nachweis', 'rw_s_ausnutzung',
    'rw_s_a_erf', 'rw_s_a_gewaehlt', 'rw_s_a_kontrolle',
    'rw_s_a_min', 'rw_s_a_max', 'rw_s_l_eff', 'rw_s_beta_lw',
    'rw_s_kontrolle_schwerpunkt', 'rw_s_kontrolle_polar',
    'rw_s_kontrolle_haupt', 'rw_s_kontrolle_gesamt',
    'rw_s_nicht_geprueft', 'rw_s_warnungen', 'rw_s_hinweise'
  ];

  /* Beschreibung des zweiten Rechenpfads je Schritt. */
  var PROBEN = [
    'rw_p_laenge', 'rw_p_flaeche', 'rw_p_schwerpunkt', 'rw_p_steiner',
    'rw_p_polar', 'rw_p_hauptachsen', 'rw_p_widerstandsmoment',
    'rw_p_endkrater', 'rw_p_sigma_x', 'rw_p_tau', 'rw_p_umklappen',
    'rw_p_sigma_v', 'rw_p_widerstand', 'rw_p_eta', 'rw_p_a_erf',
    'rw_p_a_gewaehlt', 'rw_p_grenze', 'rw_p_gesamt'
  ];

  /* Benannte Grundlage je Schritt — nie eine Formel ohne Herkunft. */
  var QUELLEN = [
    'qu_ec3_1_8', 'qu_ec3_1_4', 'qu_ec9_1_1', 'qu_roloff_decker',
    'qu_mechanik', 'qu_eingabe', 'qu_geometrie', 'qu_praxis'
  ];

  /* Nachkommastellen je Einheit — einheitlich im ganzen Rechenweg. */
  var NK = {
    unit_mm: 2, unit_mm2: 1, unit_mm3: 0, unit_mm4: 0,
    unit_N: 0, unit_Nm: 1, unit_Nmm2: 2, unit_grad: 2,
    unit_dimensionslos: 4
  };
  function nkFuer(einheit) {
    return Object.prototype.hasOwnProperty.call(NK, einheit) ? NK[einheit] : 2;
  }

  /* ---------------------------------------------------------------------- */
  /* 2) Kleine Helfer                                                        */
  /* ---------------------------------------------------------------------- */

  function istZahl(x) { return typeof x === 'number' && isFinite(x); }

  /* Relative Naehe — die Grundlage jeder Probe. */
  function nahe(a, b, rel) {
    if (!istZahl(a) || !istZahl(b)) return false;
    var s = Math.max(1, Math.abs(a), Math.abs(b));
    return Math.abs(a - b) <= (rel || TOL) * s;
  }

  /* Zahlformat: DE und PT mit Komma, EN mit Punkt. Minuszeichen U+2212. */
  function zahl(x, nk, lang) {
    if (!istZahl(x)) return '\u2013';
    if (nk === undefined || nk === null) nk = 2;
    var en = (lang === 'en');
    var neg = x < 0, s = Math.abs(x).toFixed(nk).split('.');
    var g = s[0], out = '', c = 0, k;
    for (k = g.length - 1; k >= 0; k--) {
      out = g.charAt(k) + out; c++;
      if (c % 3 === 0 && k > 0) out = (en ? ',' : '.') + out;
    }
    if (s[1]) out += (en ? '.' : ',') + s[1];
    return (neg ? '\u2212' : '') + out;
  }

  /* Vorlage mit {0} {1} … fuellen. */
  function fuellen(vorlage, werte, lang) {
    if (!vorlage) return '';
    werte = werte || [];
    return String(vorlage).replace(/\{(\d+)\}/g, function (all, i) {
      var w = werte[Number(i)];
      if (!w) return all;
      if (typeof w.text === 'string') return w.text;
      return zahl(w.v, (w.nk === undefined ? 2 : w.nk), lang);
    });
  }

  /* Segmentliste mit neuem a-Mass — mutiert die Eingabe nicht. */
  function mitA(segmente, fn) {
    var r = [], i, s;
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (s.typ === 'kreis') r.push(Naht.kreis(s.y, s.z, s.d, fn(s.a, i), s.code));
      else r.push(Naht.linie(s.y1, s.z1, s.y2, s.z2, fn(s.a, i), s.code));
    }
    return r;
  }

  /* ---------------------------------------------------------------------- */
  /* 3) Der Schrittsammler                                                   */
  /* ---------------------------------------------------------------------- */

  function Sammler() {
    this.schritte = [];
    this.abschnitt = ABSCHNITTE[0];
  }
  Sammler.prototype.ab = function (code) { this.abschnitt = code; return this; };
  Sammler.prototype.add = function (s) {
    s = s || {};
    this.schritte.push({
      nr: this.schritte.length + 1,
      abschnitt: this.abschnitt,
      code: s.code,
      formel: (typeof s.formel === 'string') ? s.formel : null,
      vorlage: (typeof s.vorlage === 'string') ? s.vorlage : null,
      werte: s.werte || [],
      ergebnis: istZahl(s.ergebnis) ? s.ergebnis : null,
      nk: istZahl(s.nk) ? s.nk : (s.einheit ? nkFuer(s.einheit) : 2),
      einheit: s.einheit || null,
      text: s.text || null,            /* Ergebnis, das selbst ein Code ist */
      liste: s.liste || null,          /* Liste von Codes (2.4, Hinweise)   */
      quelle: s.quelle || null,
      haken: (s.haken === true || s.haken === false) ? s.haken : null,
      erfuellt: (s.erfuellt === true || s.erfuellt === false) ? s.erfuellt : null,
      probe: s.probe || null,
      hinweis: s.hinweis || null
    });
    return this;
  };

  /* ---------------------------------------------------------------------- */
  /* 4) Nahtbild rekonstruieren — Grundlage der Proben                       */
  /*    Die Segmente, auf die sich das ERGEBNIS bezieht: bei der Auslegung   */
  /*    das gewaehlte a je Segment, bei teilweise durchgeschweisster Naht    */
  /*    zusaetzlich der Abzug von 2 mm.                                      */
  /* ---------------------------------------------------------------------- */

  function segmenteAus(erg, ein, profilErg) {
    var roh = null, i;
    if (profilErg && profilErg.ok) roh = profilErg.segmente;
    else if (ein && ein.segmente && ein.segmente.length) roh = ein.segmente;
    if (!roh) return null;

    /* Auslegung: das je Segment aufgerundete a ist das Ergebnis-a. */
    if (erg.rechenrichtung === 'auslegung' && erg.auslegung &&
        erg.auslegung.je_segment && erg.auslegung.je_segment.length === roh.length) {
      var js = erg.auslegung.je_segment;
      roh = mitA(roh, function (a, k) { return js[k].a_gewaehlt; });
    }
    var abzug = istZahl(erg.a_abzug) ? erg.a_abzug : 0;
    var wirksam = abzug ? mitA(roh, function (a) { return a - abzug; }) : roh;

    /* Zweiter Rechenpfad fuer Laenge, Flaeche UND Schwerpunkt: unabhaengig
       aus der Segmentgeometrie gebildet, ohne einen Wert aus naht.js. */
    var laengen = [], summeAl = 0, summeL = 0, sy = 0, sz = 0, sg;
    for (i = 0; i < wirksam.length; i++) {
      sg = wirksam[i];
      var l = Naht.laenge(sg);
      var a = sg.a * l;
      laengen.push(l);
      summeL += l;
      summeAl += a;
      if (sg.typ === 'kreis') { sy += a * sg.y; sz += a * sg.z; }
      else { sy += a * (sg.y1 + sg.y2) / 2; sz += a * (sg.z1 + sg.z2) / 2; }
    }
    return { roh: roh, wirksam: wirksam, laengen: laengen,
             summe_al: summeAl, summe_l: summeL, abzug: abzug,
             ys: (summeAl > 0) ? sy / summeAl : null,
             zs: (summeAl > 0) ? sz / summeAl : null };
  }

  /* ---------------------------------------------------------------------- */
  /* 5) HAUPTWEG: aus einem fertigen Solver-Ergebnis den Rechenweg bauen     */
  /* ---------------------------------------------------------------------- */

  function ausErgebnis(erg, ein) {
    ein = ein || {};
    if (!erg || !erg.ok) {
      return {
        ok: false, version: VERSION,
        abschnitte: [], schritte: [], n_schritte: 0,
        n_haken: 0, n_haken_ok: 0, n_nachweise: 0, n_nachweise_ok: 0,
        selbstpruefung_ok: false, nachweis_ok: false,
        nicht_geprueft: [],
        fehler: (erg && erg.fehler) ? erg.fehler.slice(0) : [],
        warnungen: (erg && erg.warnungen) ? erg.warnungen.slice(0) : [],
        hinweise: (erg && erg.hinweise) ? erg.hinweise.slice(0) : [],
        ergebnis: erg || null
      };
    }

    var S = new Sammler(), i, k;
    var nb = erg.nahtbild, R = erg.widerstand, L = erg.schnittgroessen;
    var mp = erg.massgebend;

    var profilErg = null;
    if (ein.profil_eingabe && Profil) {
      profilErg = Profil.baue(ein.profil_eingabe);
      if (!profilErg.ok) profilErg = null;
    }
    var G = segmenteAus(erg, ein, profilErg);

    /* Quelle des Widerstands — benannte Grundlage, nie namenlos. */
    var quelleWid = 'qu_ec3_1_8';
    if (erg.welt === 'B') quelleWid = 'qu_roloff_decker';
    else if (R.pfad === 'alu') quelleWid = 'qu_ec9_1_1';
    else if (R.pfad === 'edelstahl') quelleWid = 'qu_ec3_1_4';

    /* ================= A · Eingaben ==================================== */
    S.ab('rw_ab_eingaben');

    S.add({ code: 'rw_s_welt', text: 'opt_welt_' + erg.welt,
            quelle: quelleWid,
            hinweis: 'sv_getrennt' });

    if (erg.welt === 'A' && erg.verfahren) {
      S.add({ code: 'rw_s_verfahren',
              text: 'opt_nachweisverfahren_' + erg.verfahren,
              quelle: 'qu_ec3_1_8' });
    }

    var wSt = [];
    if (istZahl(erg.werkstoff.fu)) wSt.push({ v: erg.werkstoff.fu, nk: 0 });
    if (istZahl(erg.werkstoff.fy)) wSt.push({ v: erg.werkstoff.fy, nk: 0 });
    S.add({ code: 'rw_s_werkstoff',
            text: 'opt_werkstoff_' + erg.werkstoff.code,
            formel: (wSt.length === 2) ? 'f_u ; f_y' : (wSt.length ? 'f_u' : null),
            vorlage: (wSt.length === 2) ? 'f_u = {0} N/mm\u00b2 ; f_y = {1} N/mm\u00b2'
                                        : (wSt.length ? 'f_u = {0} N/mm\u00b2' : null),
            werte: wSt,
            quelle: quelleWid,
            hinweis: erg.werkstoff.luecke ? ('lk_' + erg.werkstoff.luecke) : null });

    S.add({ code: 'rw_s_nahtart',
            text: erg.nahtart ? ('opt_nahtart_' + erg.nahtart) : null,
            formel: erg.a_abzug ? 'a_wirksam = a_nenn \u2212 2 mm' : null,
            vorlage: erg.a_abzug ? 'a_wirksam = a_nenn \u2212 {0} mm' : null,
            werte: erg.a_abzug ? [{ v: erg.a_abzug, nk: 0 }] : [],
            quelle: 'qu_ec3_1_8',
            hinweis: erg.umklappen ? 'msg_sv_umklappen' : 'msg_sv_stumpf_voll_kein_nachweis' });

    S.add({ code: 'rw_s_modell', text: 'nb_modell_' + erg.modell,
            quelle: 'qu_mechanik' });

    /* Profileingabe — nur wenn das Nahtbild aus profil.js kommt. */
    if (profilErg) {
      S.add({ code: 'rw_s_profil',
              text: 'opt_profil_' + profilErg.profil,
              liste: ['opt_kanten_' + profilErg.kanten],
              formel: 'l_brutto = \u03a3 l_i',
              vorlage: 'l_brutto = {0} mm  (n = {1})',
              werte: [{ v: profilErg.l_brutto, nk: 1 },
                      { v: profilErg.n_seg, nk: 0 }],
              ergebnis: profilErg.l_brutto, einheit: 'unit_mm', nk: 1,
              quelle: 'qu_geometrie' });

      S.add({ code: 'rw_s_endkrater',
              formel: 'l_netto = l_brutto \u2212 2\u00b7a je offener Raupe',
              vorlage: '{0} \u2212 {1} = {2} mm  ({3} \u00d7 2\u00b7a)',
              werte: [{ v: profilErg.l_brutto, nk: 1 },
                      { v: profilErg.endkrater_abzug, nk: 1 },
                      { v: profilErg.l_netto, nk: 1 },
                      { v: profilErg.offene_raupen, nk: 0 }],
              ergebnis: profilErg.l_netto, einheit: 'unit_mm', nk: 1,
              quelle: 'qu_geometrie',
              probe: 'rw_p_endkrater',
              haken: nahe(profilErg.l_netto,
                          profilErg.l_brutto - profilErg.endkrater_abzug),
              hinweis: profilErg.umlaufend ? 'msg_endkrater_umlaufend' : 'msg_endkrater_abzug' });
    }

    /* ================= B · Nahtbild ==================================== */
    S.ab('rw_ab_nahtbild');

    S.add({ code: 'rw_s_segmente',
            formel: 'l_ges = \u03a3 l_i',
            vorlage: 'n = {0} \u2192 l_ges = {1} mm',
            werte: [{ v: nb.n_seg, nk: 0 }, { v: nb.l_ges, nk: 1 }],
            ergebnis: nb.l_ges, einheit: 'unit_mm', nk: 1,
            quelle: 'qu_geometrie',
            probe: 'rw_p_laenge',
            haken: G ? nahe(nb.l_ges, G.summe_l) : null });

    S.add({ code: 'rw_s_flaeche',
            formel: 'A_w = \u03a3 (a_i \u00b7 l_i)',
            vorlage: 'A_w = {0} mm\u00b2',
            werte: [{ v: nb.A, nk: 1 }],
            ergebnis: nb.A, einheit: 'unit_mm2',
            quelle: 'qu_geometrie',
            probe: 'rw_p_flaeche',
            haken: G ? nahe(nb.A, G.summe_al) : null });

    S.add({ code: 'rw_s_schwerpunkt',
            formel: 'y_s = \u03a3(A_i\u00b7y_i)/A_w ; z_s = \u03a3(A_i\u00b7z_i)/A_w',
            vorlage: 'y_s = {0} mm ; z_s = {1} mm',
            werte: [{ v: nb.ys, nk: 2 }, { v: nb.zs, nk: 2 }],
            ergebnis: nb.zs, einheit: 'unit_mm',
            quelle: 'qu_mechanik',
            probe: 'rw_p_schwerpunkt',
            haken: (nb.kontrolle ? nb.kontrolle.schwerpunkt_ok : true) &&
                   (G && istZahl(G.ys) ? (nahe(nb.ys, G.ys, 1e-9) &&
                                          nahe(nb.zs, G.zs, 1e-9)) : true) });

    S.add({ code: 'rw_s_iy',
            formel: 'I_y = \u03a3 (I_y,eigen + A_i \u00b7 \u0394z_i\u00b2)',
            vorlage: 'I_y = {0} mm\u2074',
            werte: [{ v: nb.Iy, nk: 0 }],
            ergebnis: nb.Iy, einheit: 'unit_mm4',
            quelle: 'qu_mechanik', probe: 'rw_p_steiner' });

    S.add({ code: 'rw_s_iz',
            formel: 'I_z = \u03a3 (I_z,eigen + A_i \u00b7 \u0394y_i\u00b2)',
            vorlage: 'I_z = {0} mm\u2074 ; I_yz = {1} mm\u2074',
            werte: [{ v: nb.Iz, nk: 0 }, { v: nb.Iyz, nk: 0 }],
            ergebnis: nb.Iz, einheit: 'unit_mm4',
            quelle: 'qu_mechanik', probe: 'rw_p_steiner' });

    S.add({ code: 'rw_s_ip',
            formel: 'I_p = I_y + I_z',
            vorlage: '{0} + {1} = {2} mm\u2074',
            werte: [{ v: nb.Iy, nk: 0 }, { v: nb.Iz, nk: 0 }, { v: nb.Ip, nk: 0 }],
            ergebnis: nb.Ip, einheit: 'unit_mm4',
            quelle: 'qu_mechanik',
            probe: 'rw_p_polar',
            haken: nahe(nb.Ip, nb.Iy + nb.Iz) &&
                   (nb.kontrolle ? nb.kontrolle.polar_ok : true) });

    S.add({ code: 'rw_s_hauptachsen',
            formel: 'I_1 + I_2 = I_y + I_z',
            vorlage: 'I_yz = {0} mm\u2074',
            werte: [{ v: nb.Iyz, nk: 0 }],
            quelle: 'qu_mechanik',
            probe: 'rw_p_hauptachsen',
            haken: nb.kontrolle ? nb.kontrolle.hauptachsen_ok : null,
            hinweis: (Math.abs(nb.Iyz) > 1e-9 * Math.max(1, Math.abs(nb.Iy), Math.abs(nb.Iz)))
                     ? 'msg_hauptachsen_gedreht' : null });

    S.add({ code: 'rw_s_widerstandsmomente',
            formel: 'W_y = I_y / z_rand ; W_t = I_p / r_max',
            vorlage: 'W_y = {0} mm\u00b3 ; W_t = {1} mm\u00b3 (r_max = {2} mm)',
            werte: [{ v: nb.Wy, nk: 0 }, { v: nb.Wt, nk: 0 }, { v: nb.rmax, nk: 2 }],
            ergebnis: nb.Wt, einheit: 'unit_mm3',
            quelle: 'qu_mechanik',
            probe: 'rw_p_widerstandsmoment',
            haken: (nb.rmax > 0) ? nahe(nb.Wt, nb.Ip / nb.rmax) : null });

    /* ================= C · Schnittgroessen ============================= */
    S.ab('rw_ab_schnittgroessen');

    /* Probe: die Schnittgroessen im Ergebnis muessen genau das sein, was
       eingegeben wurde — Kraefte unveraendert, Momente mit 1000. */
    function ausEingabe(lang, kurz) {
      var a = istZahl(ein[lang]) ? ein[lang] : null;
      var b = (kurz && istZahl(ein[kurz])) ? ein[kurz] : null;
      return (a !== null) ? a : (b !== null ? b : 0);
    }
    S.add({ code: 'rw_s_lasten',
            formel: 'N ; Q_y ; Q_z',
            vorlage: 'N = {0} N ; Q_y = {1} N ; Q_z = {2} N',
            werte: [{ v: L.N, nk: 0 }, { v: L.Qy, nk: 0 }, { v: L.Qz, nk: 0 }],
            quelle: 'qu_eingabe',
            probe: 'rw_p_grenze',
            haken: nahe(L.N, ausEingabe('N', null), 1e-12) &&
                   nahe(L.Qy, ausEingabe('Qy', null), 1e-12) &&
                   nahe(L.Qz, ausEingabe('Qz', 'Q'), 1e-12),
            hinweis: (L.Qy || L.Qz) ? 'msg_sv_querkraft_mittelwert' : null });

    S.add({ code: 'rw_s_lasten_umrechnung',
            formel: 'M [Nmm] = M [Nm] \u00b7 1000',
            vorlage: 'M_y = {0} Nmm ; M_z = {1} Nmm ; T = {2} Nmm',
            werte: [{ v: L.My, nk: 0 }, { v: L.Mz, nk: 0 }, { v: L.T, nk: 0 }],
            quelle: 'qu_eingabe',
            probe: 'rw_p_grenze',
            haken: nahe(L.My, 1000 * ausEingabe('My', 'M'), 1e-9) &&
                   nahe(L.Mz, 1000 * ausEingabe('Mz', null), 1e-9) &&
                   nahe(L.T, 1000 * ausEingabe('T', null), 1e-9) });

    /* ================= D · Spannungen ================================== */
    S.ab('rw_ab_spannungen');

    S.add({ code: 'rw_s_massgebender_punkt',
            formel: 'y ; z ; #Seg',
            vorlage: 'y = {0} mm ; z = {1} mm ; #{2}',
            werte: [{ v: mp.y, nk: 2 }, { v: mp.z, nk: 2 }, { v: mp.seg + 1, nk: 0 }],
            quelle: 'qu_geometrie',
            hinweis: erg.hinweise && codeDrin(erg.hinweise, 'msg_sv_kreis_verdichtet')
                     ? 'msg_sv_kreis_verdichtet' : null });

    /* Zweiter Rechenpfad fuer sigma_x: allgemeine schiefe Biegung neu gebildet. */
    var nenner = nb.Iy * nb.Iz - nb.Iyz * nb.Iyz;
    var sxProbe = (nb.A > 0) ? L.N / nb.A : 0;
    if (Math.abs(nenner) > 1e-12) {
      sxProbe += ((L.My * nb.Iz + L.Mz * nb.Iyz) * mp.z -
                  (L.Mz * nb.Iy + L.My * nb.Iyz) * mp.y) / nenner;
    }
    S.add({ code: 'rw_s_sigma_x',
            formel: '\u03c3_x = N/A_w + [(M_y\u00b7I_z + M_z\u00b7I_yz)\u00b7z ' +
                    '\u2212 (M_z\u00b7I_y + M_y\u00b7I_yz)\u00b7y] / (I_y\u00b7I_z \u2212 I_yz\u00b2)',
            vorlage: '\u03c3_x = {0} N/mm\u00b2',
            werte: [{ v: mp.sigma_x, nk: 2 }],
            ergebnis: mp.sigma_x, einheit: 'unit_Nmm2',
            quelle: 'qu_mechanik',
            probe: 'rw_p_sigma_x',
            haken: nahe(mp.sigma_x, sxProbe, 1e-9),
            hinweis: nb.Iyz && Math.abs(nb.Iyz) > 1e-9 * Math.max(1, nb.Iy, nb.Iz)
                     ? 'msg_sv_schiefe_biegung' : null });

    /* tau: die Projektion auf Laengs/Quer ist orthonormal — der Betrag
       der Resultierenden muss deshalb gleich bleiben. Genau das ist die
       Probe, und sie ist von der Projektionsrichtung unabhaengig. */
    var tyProbe = (nb.A > 0) ? L.Qy / nb.A : 0;
    var tzProbe = (nb.A > 0) ? L.Qz / nb.A : 0;
    if (nb.Ip > 0 && L.T !== 0) {
      tyProbe += -L.T * mp.z / nb.Ip;
      tzProbe += L.T * mp.y / nb.Ip;
    }
    var tauResProbe = Math.sqrt(tyProbe * tyProbe + tzProbe * tzProbe);
    var tauResIst = Math.sqrt(mp.tau_n * mp.tau_n + mp.tau_t * mp.tau_t);
    S.add({ code: 'rw_s_tau',
            formel: '\u03c4_y = Q_y/A_w \u2212 T\u00b7z/I_p ; \u03c4_z = Q_z/A_w + T\u00b7y/I_p',
            vorlage: '\u03c4_n = {0} N/mm\u00b2 ; \u03c4_t = {1} N/mm\u00b2',
            werte: [{ v: mp.tau_n, nk: 2 }, { v: mp.tau_t, nk: 2 }],
            ergebnis: tauResIst, einheit: 'unit_Nmm2',
            quelle: 'qu_mechanik',
            probe: 'rw_p_tau',
            haken: nahe(tauResIst, tauResProbe, 1e-9) });

    if (erg.umklappen) {
      S.add({ code: 'rw_s_umklappen',
              formel: 'q\u22a5 = \u221a(\u03c3_x\u00b2 + \u03c4_n\u00b2) ; ' +
                      '\u03c3\u22a5 = \u03c4\u22a5 = q\u22a5/\u221a2 ; \u03c4\u2225 = |\u03c4_t|',
              vorlage: 'q\u22a5 = {0} \u2192 \u03c3\u22a5 = \u03c4\u22a5 = {1} ; \u03c4\u2225 = {2} N/mm\u00b2',
              werte: [{ v: mp.q_senk, nk: 2 }, { v: mp.sigma_senk, nk: 2 },
                      { v: mp.tau_par, nk: 2 }],
              ergebnis: mp.sigma_senk, einheit: 'unit_Nmm2',
              quelle: 'qu_roloff_decker',
              probe: 'rw_p_umklappen',
              haken: nahe(mp.q_senk, Math.sqrt(mp.sigma_x * mp.sigma_x +
                                               mp.tau_n * mp.tau_n), 1e-9) &&
                     nahe(mp.sigma_senk, mp.q_senk / W2, 1e-9) &&
                     nahe(mp.tau_senk, mp.q_senk / W2, 1e-9),
              hinweis: 'msg_sv_umklappen' });
    }

    var svProbe = Math.sqrt(mp.sigma_senk * mp.sigma_senk +
                            3 * (mp.tau_senk * mp.tau_senk + mp.tau_par * mp.tau_par));
    var resProbe = Math.sqrt(mp.sigma_x * mp.sigma_x + mp.tau_n * mp.tau_n +
                             mp.tau_t * mp.tau_t);

    if (erg.welt === 'A' && erg.verfahren === 'richtungsbezogen') {
      S.add({ code: 'rw_s_sigma_v',
              formel: '\u03c3_v = \u221a(\u03c3\u22a5\u00b2 + 3\u00b7(\u03c4\u22a5\u00b2 + \u03c4\u2225\u00b2))',
              vorlage: '\u03c3_v = {0} N/mm\u00b2',
              werte: [{ v: mp.sigma_v, nk: 2 }],
              ergebnis: mp.sigma_v, einheit: 'unit_Nmm2',
              quelle: 'qu_ec3_1_8',
              probe: 'rw_p_sigma_v',
              haken: nahe(mp.sigma_v, svProbe, 1e-9) });
    } else {
      S.add({ code: 'rw_s_sigma_res',
              formel: '\u03c3_res = \u221a(\u03c3_x\u00b2 + \u03c4_n\u00b2 + \u03c4_t\u00b2)',
              vorlage: '\u03c3_res = {0} N/mm\u00b2',
              werte: [{ v: mp.sigma_res, nk: 2 }],
              ergebnis: mp.sigma_res, einheit: 'unit_Nmm2',
              quelle: (erg.welt === 'B') ? 'qu_roloff_decker' : 'qu_ec3_1_8',
              probe: 'rw_p_sigma_v',
              haken: nahe(mp.sigma_res, resProbe, 1e-9),
              hinweis: (erg.welt === 'B') ? 'msg_sv_weltb_ohne_faktor3' : null });
    }

    /* ================= E · Widerstand ================================== */
    S.ab('rw_ab_widerstand');

    var wForm = null, wVor = null, wWerte = [], wProbe = null;
    if (erg.welt === 'A' && R.pfad === 'alu') {
      wForm = 'R_d = f_w / \u03b3_Mw';
      wVor = '{0} / {1} = {2} N/mm\u00b2';
      wWerte = [{ v: R.fw, nk: 0 }, { v: R.gammaMw, nk: 2 }, { v: R.R_d, nk: 2 }];
      wProbe = nahe(R.R_d, R.fw / R.gammaMw);
    } else if (erg.welt === 'A') {
      wForm = 'R_d = f_u / (\u03b2_w \u00b7 \u03b3_M2)';
      wVor = '{0} / ({1} \u00b7 {2}) = {3} N/mm\u00b2';
      wWerte = [{ v: R.fu, nk: 0 }, { v: R.betaW, nk: 2 },
                { v: R.gammaM2, nk: 2 }, { v: R.R_d, nk: 2 }];
      wProbe = nahe(R.R_d, R.fu / (R.betaW * R.gammaM2));
      if (erg.verfahren === 'vereinfacht') {
        wForm = 'f_vw,d = (f_u/\u221a3) / (\u03b2_w \u00b7 \u03b3_M2)';
        wVor = '({0}/\u221a3) / ({1} \u00b7 {2}) = {3} N/mm\u00b2';
        wWerte = [{ v: R.fu, nk: 0 }, { v: R.betaW, nk: 2 },
                  { v: R.gammaM2, nk: 2 }, { v: R.R_d_vereinfacht, nk: 2 }];
        wProbe = nahe(R.R_d_vereinfacht,
                      (R.fu / Math.sqrt(3)) / (R.betaW * R.gammaM2));
      }
    } else if (R.pfad === 'tabelle') {
      wForm = '\u03c3_zul (Tabelle)';
      wVor = '\u03c3_zul = {0} N/mm\u00b2 ; \u03c4_zul = {1} N/mm\u00b2';
      wWerte = [{ v: R.sigma_zul, nk: 0 }, { v: R.tau_zul, nk: 0 }];
      wProbe = nahe(R.R_d, R.sigma_zul);
    } else {
      wForm = '\u03c3_zul = R_e / S \u00b7 \u03bd';
      wVor = '{0} / {1} \u00b7 {2} = {3} N/mm\u00b2';
      wWerte = [{ v: R.Re, nk: 0 }, { v: R.S, nk: 2 },
                { v: R.nu, nk: 2 }, { v: R.sigma_zul, nk: 2 }];
      wProbe = nahe(R.sigma_zul, R.Re / R.S * R.nu, 1e-9);
    }

    S.add({ code: 'rw_s_widerstand',
            formel: wForm, vorlage: wVor, werte: wWerte,
            ergebnis: istZahl(R.R_d) ? R.R_d : null, einheit: 'unit_Nmm2',
            text: R.formel || null,
            quelle: quelleWid,
            probe: 'rw_p_widerstand',
            haken: wProbe,
            hinweis: (erg.welt === 'B')
                     ? (R.pfad === 'tabelle' ? 'msg_sv_weltb_tabelle' : 'msg_sv_weltb_formelweg')
                     : null });

    if (erg.welt === 'A' && erg.verfahren === 'richtungsbezogen' &&
        istZahl(R.R_d_sigma_senk)) {
      S.add({ code: 'rw_s_widerstand_zusatz',
              formel: '\u03c3\u22a5 \u2264 0,9 \u00b7 f_u / \u03b3_M2',
              vorlage: '0,9 \u00b7 {0} / {1} = {2} N/mm\u00b2',
              werte: [{ v: R.fu, nk: 0 }, { v: R.gammaM2, nk: 2 },
                      { v: R.R_d_sigma_senk, nk: 2 }],
              ergebnis: R.R_d_sigma_senk, einheit: 'unit_Nmm2',
              quelle: 'qu_ec3_1_8',
              probe: 'rw_p_widerstand',
              haken: nahe(R.R_d_sigma_senk, 0.9 * R.fu / R.gammaM2),
              hinweis: 'msg_sv_sigma_senk_zusatz' });
    }

    if (R.wez) {
      S.add({ code: 'rw_s_wez',
              formel: 'f_o,haz = \u03c1_o \u00b7 f_o ; f_u,haz = \u03c1_u \u00b7 f_u',
              vorlage: '\u03c1_o = {0} \u2192 f_o,haz = {1} N/mm\u00b2 ; ' +
                       '\u03c1_u = {2} \u2192 f_u,haz = {3} N/mm\u00b2',
              werte: [{ v: R.wez.rho_o, nk: 2 }, { v: R.wez.f_o_haz, nk: 1 },
                      { v: R.wez.rho_u, nk: 2 }, { v: R.wez.f_u_haz, nk: 1 }],
              quelle: 'qu_ec9_1_1',
              probe: 'rw_p_widerstand',
              haken: nahe(R.wez.f_o_haz, R.wez.rho_o * R.wez.f_o, 1e-9) &&
                     nahe(R.wez.f_u_haz, R.wez.rho_u * R.wez.f_u, 1e-9),
              hinweis: 'msg_sv_alu_wez_nicht_geprueft' });
    }

    /* ================= F · Nachweis ==================================== */
    S.ab('rw_ab_nachweis');

    var alleEta = 0;
    for (i = 0; i < erg.nachweise.length; i++) {
      var nw = erg.nachweise[i];
      if (nw.eta > alleEta) alleEta = nw.eta;
      S.add({ code: 'rw_s_nachweis',
              text: nw.code,
              formel: '\u03b7 = \u03c3_ist / R_d \u2264 1',
              vorlage: '{0} / {1} = {2}',
              werte: [{ v: nw.ist, nk: 2 }, { v: nw.grenze, nk: 2 },
                      { v: nw.eta, nk: 4 }],
              ergebnis: nw.eta, einheit: 'unit_dimensionslos',
              quelle: quelleWid,
              probe: 'rw_p_eta',
              haken: (nw.grenze > 0) ? nahe(nw.eta, nw.ist / nw.grenze, 1e-9) : null,
              erfuellt: nw.erfuellt,
              hinweis: nw.erfuellt ? null : 'msg_sv_nicht_erfuellt' });
    }

    S.add({ code: 'rw_s_ausnutzung',
            formel: '\u03b7_max = max(\u03b7_i)',
            vorlage: '\u03b7 = {0} = {1} %',
            werte: [{ v: erg.eta, nk: 4 }, { v: 100 * erg.eta, nk: 1 }],
            ergebnis: erg.eta, einheit: 'unit_dimensionslos',
            text: 'amp_' + erg.ampel,
            quelle: quelleWid,
            probe: 'rw_p_eta',
            haken: nahe(erg.eta, alleEta, 1e-12),
            erfuellt: erg.erfuellt });

    /* ================= G · Auslegung =================================== */
    if (erg.rechenrichtung === 'auslegung' && erg.auslegung) {
      S.ab('rw_ab_auslegung');
      var A = erg.auslegung;

      S.add({ code: 'rw_s_a_erf',
              formel: 'a_erf = a_bezug \u00b7 \u03b7(a_bezug)   (\u03c3 \u221d 1/a)',
              vorlage: '{0} \u00b7 {1} = {2} mm  (n = {3})',
              werte: [{ v: A.a_bezug, nk: 2 }, { v: A.faktor, nk: 6 },
                      { v: A.a_erf, nk: 3 }, { v: A.iterationen, nk: 0 }],
              ergebnis: A.a_erf, einheit: 'unit_mm', nk: 3,
              quelle: 'qu_mechanik',
              probe: 'rw_p_a_erf',
              haken: nahe(A.a_erf, A.a_bezug * A.faktor, 1e-9) });

      S.add({ code: 'rw_s_a_gewaehlt',
              formel: 'a_gew = \u2308a_erf / \u0394a\u2309 \u00b7 \u0394a',
              vorlage: '{0} \u2192 {1} mm  (\u0394a = {2} mm)',
              werte: [{ v: A.a_erf, nk: 3 }, { v: A.a_gewaehlt, nk: 1 },
                      { v: A.stufe, nk: 1 }],
              ergebnis: A.a_gewaehlt, einheit: 'unit_mm', nk: 1,
              text: 'opt_a_rundung_' + A.rundung,
              quelle: 'qu_praxis',
              probe: 'rw_p_a_gewaehlt',
              haken: (A.a_gewaehlt >= A.a_erf - 1e-9) &&
                     (A.a_gewaehlt - A.a_erf < A.stufe + 1e-9) &&
                     nahe(A.a_gewaehlt / A.stufe, Math.round(A.a_gewaehlt / A.stufe), 1e-9),
              hinweis: 'msg_sv_a_aufgerundet' });

      S.add({ code: 'rw_s_a_kontrolle',
              formel: '\u03b7(a_gew) \u2264 1',
              vorlage: '\u03b7 = {0} = {1} %',
              werte: [{ v: A.eta_mit_gewaehlt, nk: 4 },
                      { v: 100 * A.eta_mit_gewaehlt, nk: 1 }],
              ergebnis: A.eta_mit_gewaehlt, einheit: 'unit_dimensionslos',
              quelle: quelleWid,
              erfuellt: A.eta_mit_gewaehlt <= 1 + 1e-12 });
    }

    /* ================= H · Grenzen ===================================== */
    S.ab('rw_ab_grenzen');
    var GR = erg.grenzen, js2 = GR.je_segment || [];
    var aKlein = null, aGross = null, aMaxKlein = null;
    for (i = 0; i < js2.length; i++) {
      if (aKlein === null || js2[i].a < aKlein) aKlein = js2[i].a;
      if (aGross === null || js2[i].a > aGross) aGross = js2[i].a;
      if (istZahl(js2[i].a_max) && (aMaxKlein === null || js2[i].a_max < aMaxKlein)) aMaxKlein = js2[i].a_max;
    }

    /* Die Mindestlaenge gehoert je NAHTZUG, nicht je Segment (Plan 5.1-0).
       Gezeigt wird der Zug mit dem KLEINSTEN Abstand zu seiner Grenze — der
       entscheidet. */
    var jz = GR.je_zug || [], zugEng = null, zugKurz = false;
    for (i = 0; i < jz.length; i++) {
      if (jz[i].zu_kurz) zugKurz = true;
      if (zugEng === null ||
          (jz[i].l - jz[i].l_eff_min) < (zugEng.l - zugEng.l_eff_min)) zugEng = jz[i];
    }

    /* DIE a-GRENZEN SIND KEHLNAHT-REGELN (N7, 2026-08-04). Bei der
       durchgeschweissten Stumpfnaht gelten sie nicht — dann liefert der
       Solver a_min = null und a_max = null, und hier darf KEIN Haken
       stehen. Ein gruener Haken auf eine Regel, die gar nicht greift,
       behauptet eine Pruefung, die nicht stattgefunden hat; ein roter
       waere der Widerspruch aus Plan 9.2 (gruene Ampel, roter Nachweis). */
    var aGrenzen = (GR.a_grenzen_gelten !== false);

    S.add({ code: 'rw_s_a_min',
            formel: 'a \u2265 a_min',
            vorlage: '{0} \u2265 {1} mm',
            werte: [{ v: aKlein, nk: 2 }, { v: GR.a_min, nk: 1 }],
            ergebnis: GR.a_min, einheit: 'unit_mm', nk: 1,
            quelle: 'qu_ec3_1_8',
            erfuellt: (aGrenzen && istZahl(aKlein) && istZahl(GR.a_min))
                   ? (aKlein >= GR.a_min - 1e-9) : null,
            hinweis: !aGrenzen ? 'msg_sv_a_grenzen_stumpf_voll'
                   : ((istZahl(aKlein) && istZahl(GR.a_min) && aKlein < GR.a_min - 1e-9)
                     ? 'msg_sv_a_unter_amin' : null) });

    S.add({ code: 'rw_s_a_max',
            formel: 'a \u2264 a_max = 0,7 \u00b7 t_min',
            vorlage: '{0} \u2264 {1} mm',
            werte: [{ v: aGross, nk: 2 }, { v: aMaxKlein, nk: 2 }],
            ergebnis: aMaxKlein, einheit: 'unit_mm',
            quelle: 'qu_praxis',
            erfuellt: (aGrenzen && istZahl(aGross) && istZahl(aMaxKlein))
                   ? (aGross <= aMaxKlein + 1e-9) : null,
            hinweis: !aGrenzen ? 'msg_sv_a_grenzen_stumpf_voll'
                   : ((istZahl(aGross) && istZahl(aMaxKlein) && aGross > aMaxKlein + 1e-9)
                     ? 'msg_sv_a_ueber_amax' : null) });

    /* BEWUSST KEIN Nachweis-Haken (erfuellt bleibt null), sondern eine
       WARNUNG — Dieters fachliche Entscheidung vom 2026-08-03, Plan 5.1-0.
       Grund fuer die Festlegung ueberhaupt: vorher sagte die Ampel gruen und
       diese Zeile gleichzeitig "Nachweis nicht erfuellt". Zwei Antworten auf
       dieselbe Frage. Wer hier einen Haken nachruestet, holt den Widerspruch
       zurueck (Plan 9.2). Der Warntext traegt die volle Aussage. */
    S.add({ code: 'rw_s_l_eff',
            formel: 'l_Zug \u2265 max(6\u00b7a ; 30 mm)',
            vorlage: '{0} \u2265 {1} mm',
            werte: [{ v: zugEng ? zugEng.l : null, nk: 1 },
                    { v: zugEng ? zugEng.l_eff_min : null, nk: 1 }],
            ergebnis: zugEng ? zugEng.l_eff_min : null, einheit: 'unit_mm', nk: 1,
            quelle: 'qu_ec3_1_8',
            erfuellt: null,
            hinweis: zugKurz ? 'msg_sv_l_eff_zu_kurz' : 'msg_sv_l_eff_je_zug' });

    if (GR.lange_naht && istZahl(GR.beta_Lw)) {
      S.add({ code: 'rw_s_beta_lw',
              formel: '\u03b2_Lw = 1,2 \u2212 0,2\u00b7L_j/(150\u00b7a) \u2264 1,0',
              vorlage: '\u03b2_Lw = {0}',
              werte: [{ v: GR.beta_Lw, nk: 4 }],
              ergebnis: GR.beta_Lw, einheit: 'unit_dimensionslos',
              quelle: 'qu_ec3_1_8',
              erfuellt: GR.beta_Lw <= 1 + 1e-12,
              hinweis: ein.beta_lw_anwenden ? 'msg_sv_beta_lw_angewendet'
                                            : 'msg_sv_beta_lw_nicht_angewendet' });
    }

    /* ================= I · Selbstpruefung ============================== */
    S.ab('rw_ab_selbstpruefung');
    var KO = nb.kontrolle || {};

    S.add({ code: 'rw_s_kontrolle_schwerpunkt',
            formel: '\u03a3 A_i \u00b7 \u0394y_i = 0 ; \u03a3 A_i \u00b7 \u0394z_i = 0',
            vorlage: 'Rest = {0} ; {1} mm\u00b3',
            werte: [{ v: KO.rest_Sy, nk: 6 }, { v: KO.rest_Sz, nk: 6 }],
            quelle: 'qu_mechanik', probe: 'rw_p_schwerpunkt',
            haken: (KO.schwerpunkt_ok === true || KO.schwerpunkt_ok === false)
                   ? KO.schwerpunkt_ok : null });

    S.add({ code: 'rw_s_kontrolle_polar',
            formel: 'I_p \u2212 (I_y + I_z) = 0',
            vorlage: '{0} \u2212 ({1} + {2}) = {3} mm\u2074',
            werte: [{ v: nb.Ip, nk: 0 }, { v: nb.Iy, nk: 0 },
                    { v: nb.Iz, nk: 0 }, { v: nb.Ip - nb.Iy - nb.Iz, nk: 6 }],
            quelle: 'qu_mechanik', probe: 'rw_p_polar',
            haken: (KO.polar_ok === true || KO.polar_ok === false) ? KO.polar_ok : null });

    S.add({ code: 'rw_s_kontrolle_haupt',
            formel: '(I_1 + I_2) \u2212 (I_y + I_z) = 0',
            quelle: 'qu_mechanik', probe: 'rw_p_hauptachsen',
            haken: (KO.hauptachsen_ok === true || KO.hauptachsen_ok === false)
                   ? KO.hauptachsen_ok : null });

    /* ================= J · Was NICHT geprueft wird (2.4) =============== */
    S.ab('rw_ab_nicht_geprueft');
    var ngListe = [];
    for (i = 0; i < erg.nicht_geprueft.length; i++) ngListe.push('ng_' + erg.nicht_geprueft[i]);
    S.add({ code: 'rw_s_nicht_geprueft', liste: ngListe, quelle: 'qu_praxis' });

    /* ================= K · Warnungen und Hinweise ====================== */
    S.ab('rw_ab_hinweise');
    var wListe = [], hListe = [], gesehen = {};
    for (i = 0; i < erg.warnungen.length; i++) {
      k = erg.warnungen[i].code;
      if (!gesehen['w' + k]) { gesehen['w' + k] = 1; wListe.push(k); }
    }
    for (i = 0; i < erg.hinweise.length; i++) {
      k = erg.hinweise[i].code;
      if (!gesehen['h' + k]) { gesehen['h' + k] = 1; hListe.push(k); }
    }
    if (wListe.length) S.add({ code: 'rw_s_warnungen', liste: wListe });
    S.add({ code: 'rw_s_hinweise', liste: hListe });

    /* ================= Gesamt-Haekchen ================================= */
    var nHaken = 0, nOk = 0, nNw = 0, nNwOk = 0;
    for (i = 0; i < S.schritte.length; i++) {
      if (S.schritte[i].haken === true) { nHaken++; nOk++; }
      else if (S.schritte[i].haken === false) { nHaken++; }
      if (S.schritte[i].erfuellt === true) { nNw++; nNwOk++; }
      else if (S.schritte[i].erfuellt === false) { nNw++; }
    }
    var alles = (nHaken > 0) && (nOk === nHaken);
    var nwOk = (nNw === 0) || (nNwOk === nNw);
    /* Die Gesamtzeile gehoert in den Abschnitt Selbstpruefung, wird aber
       erst jetzt gebildet — sie zaehlt sich selbst nicht mit. */
    S.schritte.push({
      nr: S.schritte.length + 1, abschnitt: 'rw_ab_selbstpruefung',
      code: 'rw_s_kontrolle_gesamt',
      formel: null,
      vorlage: '{0} / {1}',
      werte: [{ v: nOk, nk: 0 }, { v: nHaken, nk: 0 }],
      ergebnis: nOk, nk: 0, einheit: null, text: null, liste: null,
      quelle: 'qu_geometrie', haken: alles, erfuellt: null,
      probe: 'rw_p_gesamt', hinweis: null
    });

    /* Abschnitte in fester Reihenfolge zusammenstellen. */
    var abs = [], nachAb = {};
    for (i = 0; i < S.schritte.length; i++) {
      k = S.schritte[i].abschnitt;
      if (!nachAb[k]) nachAb[k] = [];
      nachAb[k].push(S.schritte[i]);
    }
    for (i = 0; i < ABSCHNITTE.length; i++) {
      if (nachAb[ABSCHNITTE[i]]) {
        abs.push({ code: ABSCHNITTE[i], schritte: nachAb[ABSCHNITTE[i]] });
      }
    }

    return {
      ok: true, version: VERSION,
      welt: erg.welt, rechenrichtung: erg.rechenrichtung,
      verfahren: erg.verfahren, modell: erg.modell,
      abschnitte: abs, schritte: S.schritte,
      n_schritte: S.schritte.length,
      n_haken: nHaken, n_haken_ok: nOk,
      n_nachweise: nNw, n_nachweise_ok: nNwOk,
      selbstpruefung_ok: alles, nachweis_ok: nwOk,
      nicht_geprueft: ngListe,
      fehler: [], warnungen: erg.warnungen.slice(0), hinweise: erg.hinweise.slice(0),
      ergebnis: erg
    };
  }

  function codeDrin(liste, code) {
    for (var i = 0; i < liste.length; i++) if (liste[i].code === code) return true;
    return false;
  }

  /* Bequemer Ein-Aufruf-Weg fuer die Oberflaeche: rechnen UND beschriften. */
  function baue(ein) {
    var erg = Solver.rechne(ein);
    return ausErgebnis(erg, ein);
  }

  /* ---------------------------------------------------------------------- */
  /* 6) Rendern — hier und NUR hier treffen Zahlen auf Sprache               */
  /* ---------------------------------------------------------------------- */

  function rendere(rw, lang) {
    lang = lang || 'de';
    function T(k) { return (k && Kern) ? Kern.t(k, lang) : (k || ''); }

    var out = { ok: rw.ok, lang: lang, abschnitte: [], schritte: [] }, i, j;
    if (!rw.ok) return out;

    function eineZeile(s) {
      var z = {
        nr: s.nr,
        abschnitt: s.abschnitt,
        abschnitt_text: T(s.abschnitt),
        titel: T(s.code),
        formel: s.formel || '',
        eingesetzt: fuellen(s.vorlage, s.werte, lang),
        ergebnis: istZahl(s.ergebnis)
          ? (zahl(s.ergebnis, s.nk, lang) +
             ((s.einheit && s.einheit !== 'unit_dimensionslos') ? ' ' + T(s.einheit) : ''))
          : '',
        wert_text: s.text ? T(s.text) : '',
        quelle: s.quelle ? T(s.quelle) : '',
        haken: s.haken,
        haken_zeichen: (s.haken === true) ? '\u2713' : (s.haken === false ? '\u2717' : ''),
        erfuellt: s.erfuellt,
        erfuellt_zeichen: (s.erfuellt === true) ? '\u2713' : (s.erfuellt === false ? '\u2717' : ''),
        erfuellt_text: (s.erfuellt === true) ? T('sv_erfuellt')
                     : (s.erfuellt === false ? T('sv_nicht_erfuellt') : ''),
        probe: s.probe ? T(s.probe) : '',
        hinweis: s.hinweis ? T(s.hinweis) : '',
        liste: []
      };
      if (s.liste) for (var m = 0; m < s.liste.length; m++) z.liste.push(T(s.liste[m]));
      return z;
    }

    for (i = 0; i < rw.abschnitte.length; i++) {
      var a = { code: rw.abschnitte[i].code, titel: T(rw.abschnitte[i].code), schritte: [] };
      for (j = 0; j < rw.abschnitte[i].schritte.length; j++) {
        var z2 = eineZeile(rw.abschnitte[i].schritte[j]);
        a.schritte.push(z2);
        out.schritte.push(z2);
      }
      out.abschnitte.push(a);
    }
    out.titel = T('rw_titel');
    out.selbstpruefung_ok = rw.selbstpruefung_ok;
    out.nachweis_ok = rw.nachweis_ok;
    out.n_haken = rw.n_haken;
    out.n_haken_ok = rw.n_haken_ok;
    out.n_nachweise = rw.n_nachweise;
    out.n_nachweise_ok = rw.n_nachweise_ok;
    return out;
  }

  /* Alle Texte eines gerenderten Rechenwegs in EINEM String — damit der
     Harness und der DOM-Smoke auf Platzhalter [xyz] pruefen koennen. */
  function alleTexte(gerendert) {
    var s = '', i, j, z;
    for (i = 0; i < gerendert.schritte.length; i++) {
      z = gerendert.schritte[i];
      s += ' ' + z.abschnitt_text + ' ' + z.titel + ' ' + z.formel + ' ' +
           z.eingesetzt + ' ' + z.ergebnis + ' ' + z.wert_text + ' ' +
           z.quelle + ' ' + z.probe + ' ' + z.hinweis + ' ' + z.erfuellt_text;
      for (j = 0; j < z.liste.length; j++) s += ' ' + z.liste[j];
    }
    return s + ' ' + (gerendert.titel || '');
  }

  /* Nachtraegliche Gesamtpruefung — fuer Oberflaeche und Ausgaben. */
  function pruefe(rw) {
    var n = 0, ok = 0, fehlgeschlagen = [], nn = 0, nnOk = 0, nichtErfuellt = [], i;
    if (!rw || !rw.ok) {
      return { ok: false, n: 0, ok_anzahl: 0, fehlgeschlagen: [],
               nachweis_ok: false, n_nachweise: 0, nicht_erfuellt: [] };
    }
    for (i = 0; i < rw.schritte.length; i++) {
      if (rw.schritte[i].haken === true) { n++; ok++; }
      else if (rw.schritte[i].haken === false) { n++; fehlgeschlagen.push(rw.schritte[i].code); }
      if (rw.schritte[i].erfuellt === true) { nn++; nnOk++; }
      else if (rw.schritte[i].erfuellt === false) { nn++; nichtErfuellt.push(rw.schritte[i].code); }
    }
    return { ok: n > 0 && ok === n, n: n, ok_anzahl: ok, fehlgeschlagen: fehlgeschlagen,
             nachweis_ok: (nn === 0) || (nnOk === nn), n_nachweise: nn,
             nicht_erfuellt: nichtErfuellt };
  }

  return {
    VERSION: VERSION,
    TOL: TOL,
    ABSCHNITTE: ABSCHNITTE,
    SCHRITTE: SCHRITTE,
    PROBEN: PROBEN,
    QUELLEN: QUELLEN,
    NK: NK,
    baue: baue,
    ausErgebnis: ausErgebnis,
    rendere: rendere,
    alleTexte: alleTexte,
    pruefe: pruefe,
    zahl: zahl,
    fuellen: fuellen
  };
}));
