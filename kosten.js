/* ============================================================================
 * DT-ProfiSchweissnaht · kosten.js  (DTNKosten)
 * Baustein N10 — MENGE, ZEIT UND KOSTEN (Etappe N10a von 2).
 *
 * ETAPPE 1 VON 2: NUR DER RECHENKERN. Kein DOM, kein Panel — das kommt mit
 * N10b. Alles hier ist in Node pruefbar.
 *
 * DIE LEITENDE ENTSCHEIDUNG: MENGEN OHNE PREISE.
 * Das Modul rechnet IMMER aus, wie viel Schweissgut, wie viel Draht, wie
 * viel Gas, wie viele Minuten und wie viele Kilowattstunden. Das sind
 * ehrliche Zahlen: Sie folgen aus Geometrie und Physik und altern nie.
 * KOSTEN entstehen erst, wenn Preise dazukommen — und die altern sehr wohl.
 * Deshalb traegt jeder Preis ein Jahr, und jede Kostenangabe sagt, aus
 * welchem Stand sie stammt. Die Recherche R6 verlangt das woertlich:
 * "Das Programm muss Preise als editierbare Eingabefelder mit Datumsstempel
 * fuehren, keine fest verdrahteten Werte."
 *
 * DREI SORTEN WERT — die dritte ist neu in N10:
 *   BERECHNET     Nahtvolumen, Masse, Gasmenge, Zeit. Aus Geometrie.
 *   ANHALTSWERT   Ausbringungsgrad, Abschmelzleistung, Brennzeitanteil.
 *                 Veroeffentlichte Bereiche, keine Norm (wie in N9d).
 *   PREISANNAHME  EUR je Stunde, Kilo, Liter, Kilowattstunde. Volatil und
 *                 regional — mit Jahr versehen und zum Ersetzen gedacht.
 *
 * ZEHN KOSTENPOSITIONEN, ABER NUR VIER RECHENBAR (Dieters Festlegung
 * 2026-08-05: alle zehn fuehren). Lohn, Zusatzwerkstoff, Gas und Energie
 * ergeben sich aus der Rechnung. Maschine, Vorbereitung, Vorwaermen,
 * Nacharbeit, Pruefung und Gemeinkosten kann dieses Programm NICHT
 * herleiten — es gibt keine belastbare Grundlage dafuer. Sie werden
 * entgegengenommen, stehen sonst auf null, UND DIE SUMME SAGT, WELCHE
 * DAVON LEER SIND. Eine Gesamtsumme, die stillschweigend die Pruefkosten
 * weglaesst, ist zu niedrig, und niemand sieht es.
 *
 * DOM-frei · UMD/IIFE · haengt an nichts.
 * ========================================================================== */
(function (root, factory) {
  var api;
  if (typeof module === 'object' && module.exports) {
    api = factory();
    module.exports = api;
  } else {
    api = factory();
  }
  root.DTNKosten = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NAME = 'kosten';
  var VERSION = '0.1.0-N10a';

  /* --------------------------------------------------------------------- */
  /* Tabellen                                                               */
  /* --------------------------------------------------------------------- */

  /* Dichte in g/cm3. Baustahl 7,85 ist der Ankerwert der Recherche. */
  var DICHTE = { stahl: 7.85, edelstahl: 7.90, alu: 2.70 };

  /* Prozesskennzahlen EN ISO 4063 zu den Gruppencodes des Programms. */
  var VERFAHREN_NR = { mag: '135', mig: '131', wig: '141', ehand: '111', up: '121' };

  /* AUSBRINGUNGSGRAD (deposition efficiency) — Anteil des Zusatzwerkstoffs,
     der als Schweissgut in der Naht bleibt. Alle Werte sind Mitten der in
     R6 zweifach belegten Baender; das Band selbst steht im Laien-ⓘ.
       111 SMAW  65 %        121 SAW   99 %
       131 MIG   92–98 → 95  135 MAG   92–98 → 95
       136 FCAW  80–90 → 85  138 MCAW  85–95 → 90
       141 GTAW  95–99 → 97
     Bei 136 und 138 nennt R6 einen WIDERSPRUCH zwischen zwei Quellen; die
     Mitte des gemeinsamen Bandes ist die vorsichtige Wahl. */
  var AUSBRINGUNG = {
    '111': 0.65, '121': 0.99, '131': 0.95, '135': 0.95,
    '136': 0.85, '138': 0.90, '141': 0.97
  };

  /* ABSCHMELZLEISTUNG in kg/h, bezogen auf 100 % Einschaltdauer.
     Richtwerte aus R6, Tabelle A1-2. Fuer MAG ist 3,0 gewaehlt, weil das
     durchgerechnete Beispiel in A4 mit diesem Wert arbeitet. */
  var ABSCHMELZ = {
    '111': 1.5, '121': 15.0, '131': 3.0, '135': 3.0,
    '136': 4.0, '138': 4.0, '141': 0.6
  };

  /* SCHUTZGASDURCHFLUSS in l/min. Fuer MIG/MAG Stahl gilt die
     Faustformel Drahtdurchmesser x 10, fuer Aluminium x 15 (R6, A3-1).
     WIG haengt am Strom: 7 l/min bis 250 A, 9 darueber. Verfahren ohne
     Schutzgas (E-Hand, UP) fuehren null — das ist kein fehlender Wert,
     sondern die richtige Zahl. */
  var GAS_FAKTOR = { '131': 15, '135': 10, '136': 10, '138': 10 };
  var GAS_OHNE = ['111', '121'];

  /* LICHTBOGENBRENNZEIT (Operating Factor) — Anteil der reinen Lichtbogen-
     zeit an der Gesamtzeit. R6, A2-1: Industriedurchschnitt 20 %,
     Einzelfertigung 20–35 %, getaktetes Finish-Schweissen 40 %,
     mechanisiert 60–80 %, UP vollautomatisch nahe 100 %.
     Voreinstellung 40 % — der Wert des durchgerechneten Beispiels. */
  var BRENNZEIT_STD = 0.40;

  /* NAHTUEBERHOEHUNG: ~15 % Zuschlag auf den theoretischen Querschnitt,
     bei Zwangslagen und vielen kurzen Naehten mehr (R6, A1). */
  var UEBERHOEHUNG_STD = 0.15;

  /* Wirkungsgrad der Stromquelle (Inverter, R6 A3, Lincoln-Kalkulation). */
  var ETA_QUELLE_STD = 0.85;

  /* PREISANNAHMEN — VOLATIL. Jede traegt ihr Jahr. Sie sind zum Ersetzen
     gedacht, nicht zum Verlassen. Der Drahtpreis liess sich in R6
     ausdruecklich NICHT zweifach belegen und ist deshalb als reine Annahme
     gekennzeichnet. */
  var PREISE = {
    lohn:    { wert: 35.00, einheit: 'unit_eur_h',   jahr: 2019, belegt: true },
    draht:   { wert: 2.50,  einheit: 'unit_eur_kg',  jahr: 2025, belegt: false },
    gas:     { wert: 0.01,  einheit: 'unit_eur_l',   jahr: 2025, belegt: true },
    energie: { wert: 0.16,  einheit: 'unit_eur_kwh', jahr: 2025, belegt: true }
  };

  /* DIE ZEHN KOSTENPOSITIONEN. `rechenbar` sagt, ob dieses Programm die
     Menge dahinter selbst ermitteln kann. */
  var POSTEN = [
    { code: 'lohn',         rechenbar: true },
    { code: 'zusatz',       rechenbar: true },
    { code: 'gas',          rechenbar: true },
    { code: 'energie',      rechenbar: true },
    { code: 'maschine',     rechenbar: false },
    { code: 'vorbereitung', rechenbar: false },
    { code: 'vorwaermen',   rechenbar: false },
    { code: 'nacharbeit',   rechenbar: false },
    { code: 'pruefung',     rechenbar: false },
    { code: 'gemeinkosten', rechenbar: false }
  ];

  var CODES = [
    'msg_ko_kein_verfahren', 'msg_ko_keine_naht', 'msg_ko_ueberhoehung',
    'msg_ko_brennzeit_anhalt', 'msg_ko_preise_alt', 'msg_ko_preis_ungebelegt',
    'msg_ko_posten_leer', 'msg_ko_kein_gas', 'msg_ko_lohnanteil',
    'msg_ko_stumpfnaht_geschaetzt', 'msg_ko_zeit_zwei_wege',
    'msg_ko_position_zwangslage'
  ];

  /* --------------------------------------------------------------------- */
  /* Kleinkram                                                              */
  /* --------------------------------------------------------------------- */

  function zahl(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = (typeof v === 'number') ? v : parseFloat(String(v).replace(',', '.'));
    return (typeof n === 'number' && isFinite(n)) ? n : null;
  }
  function oder(v, ers) { var z = zahl(v); return z === null ? ers : z; }
  function schiebe(liste, code, zusatz) {
    for (var i = 0; i < liste.length; i++) if (liste[i].code === code) return;
    var e = { code: code }, k;
    if (zusatz) for (k in zusatz) {
      if (Object.prototype.hasOwnProperty.call(zusatz, k)) e[k] = zusatz[k];
    }
    liste.push(e);
  }
  function nummer(verfahren) {
    if (!verfahren) return null;
    var v = String(verfahren);
    if (Object.prototype.hasOwnProperty.call(AUSBRINGUNG, v)) return v;
    if (Object.prototype.hasOwnProperty.call(VERFAHREN_NR, v)) return VERFAHREN_NR[v];
    return null;
  }
  function drin(liste, wert) {
    for (var i = 0; i < liste.length; i++) if (liste[i] === wert) return true;
    return false;
  }

  /* --------------------------------------------------------------------- */
  /* 1 · Mengengeruest                                                      */
  /* --------------------------------------------------------------------- */

  /* NAHTQUERSCHNITT je Naht in mm2.
     KEHLNAHT: das einschreibbare Dreieck hat die Schenkellaenge z = a*sqrt2,
     seine Flaeche ist z^2/2 = a^2. Der Ankerfall aus R6 A4 bestaetigt das:
     a = 5 gibt 25 mm2.
     STUMPFNAHT: der Querschnitt haengt an der Fugenvorbereitung — Oeffnungs-
     winkel, Spalt, Steghoehe. Die stehen NICHT im statischen Modell. Das
     Programm schaetzt deshalb aus Anhaltswerten (60 Grad, 2 mm Spalt, 2 mm
     Steg) und SAGT, dass es schaetzt. Wer den Querschnitt aus Zeichnung
     oder WPS kennt, traegt ihn ein. */
  function querschnitt(ein) {
    ein = ein || {};
    var eigen = zahl(ein.A_fuge);
    if (eigen !== null) return { A: eigen, art: 'eigen', geschaetzt: false };

    var a = zahl(ein.a), t = zahl(ein.t);
    if (ein.nahttyp === 'kehl') {
      if (a === null) return null;
      return { A: a * a, art: 'kehl', geschaetzt: false };
    }
    /* Stumpfnaht — geschaetzt. */
    if (t === null) return null;
    var winkel = oder(ein.oeffnungswinkel, 60);
    var spalt = oder(ein.spalt, 2);
    var steg = oder(ein.steghoehe, 2);
    var h = Math.max(t - steg, 0);
    var halb = (winkel / 2) * Math.PI / 180;
    /* V-Naht: Dreieck ueber der Steghoehe plus Spaltrechteck. */
    var A = h * h * Math.tan(halb) + spalt * t;
    if (ein.doppelt === true) A = A / 2 + spalt * t / 2;   /* X-Naht: halbes Volumen je Seite */
    return { A: A, art: 'stumpf', geschaetzt: true,
             winkel: winkel, spalt: spalt, steghoehe: steg };
  }

  /* SCHWEISSGUTMASSE und DRAHTBEDARF. */
  function menge(ein) {
    ein = ein || {};
    var fehler = [], hinweise = [];
    var nr = nummer(ein.verfahren);
    if (nr === null) { schiebe(fehler, 'msg_ko_kein_verfahren'); return { ok: false, fehler: fehler }; }

    var q = querschnitt(ein);
    var l = zahl(ein.l_ges);
    if (q === null || l === null || l <= 0) {
      schiebe(fehler, 'msg_ko_keine_naht');
      return { ok: false, fehler: fehler };
    }
    if (q.geschaetzt) schiebe(hinweise, 'msg_ko_stumpfnaht_geschaetzt', q);

    var zuschlag = oder(ein.ueberhoehung, UEBERHOEHUNG_STD);
    schiebe(hinweise, 'msg_ko_ueberhoehung', { anteil: zuschlag });

    var rho = oder(ein.dichte, DICHTE[ein.werkstoffgruppe] || DICHTE.stahl);
    var eta = oder(ein.ausbringung, AUSBRINGUNG[nr]);

    var A_mit = q.A * (1 + zuschlag);
    var V = A_mit * l;                      /* mm3 */
    var m_gut = V * rho / 1000;             /* g  (mm3 * g/cm3 / 1000) */
    var m_draht = (eta > 0) ? m_gut / eta : null;

    return {
      ok: true, verfahren: nr,
      A_theoretisch: q.A, A_mit_ueberhoehung: A_mit, art: q.art,
      geschaetzt: q.geschaetzt, ueberhoehung: zuschlag,
      l_ges: l, volumen: V, dichte: rho, ausbringung: eta,
      m_schweissgut: m_gut, m_draht: m_draht,
      fehler: [], hinweise: hinweise
    };
  }

  /* --------------------------------------------------------------------- */
  /* 2 · Zeit                                                              */
  /* --------------------------------------------------------------------- */

  /* ZWEI WEGE ZUR LICHTBOGENZEIT (R6, A2):
       ueber die Masse  t = m_Schweissgut / Abschmelzleistung
       ueber die Laenge t = Nahtlaenge / Schweissgeschwindigkeit
     Der Massenweg ist bei Mehrlagennaehten genauer, der Laengenweg bei
     einlagigen mit bekanntem Vorschub. BEIDE werden gerechnet und BEIDE
     herausgegeben — sie gegeneinander zu halten sagt mehr als jeder
     einzelne. Massgebend ist der Massenweg, weil er die Volumenrechnung
     fortsetzt; weichen sie stark ab, wird es gesagt. */
  function zeit(ein) {
    ein = ein || {};
    var fehler = [], hinweise = [];
    var nr = nummer(ein.verfahren);
    if (nr === null) { schiebe(fehler, 'msg_ko_kein_verfahren'); return { ok: false, fehler: fehler }; }

    var m = zahl(ein.m_schweissgut);
    if (m === null) { schiebe(fehler, 'msg_ko_keine_naht'); return { ok: false, fehler: fehler }; }

    var dr = oder(ein.abschmelzleistung, ABSCHMELZ[nr]);          /* kg/h */
    var t_masse = (dr > 0) ? (m / 1000) / dr * 60 : null;         /* min */

    var l = zahl(ein.l_ges), v = zahl(ein.v_schweiss);            /* mm, mm/s */
    var t_laenge = (l !== null && v !== null && v > 0) ? (l / v) / 60 : null;

    var t_lb = t_masse;
    if (t_masse !== null && t_laenge !== null) {
      schiebe(hinweise, 'msg_ko_zeit_zwei_wege',
              { masse: t_masse, laenge: t_laenge });
    }

    var bz = oder(ein.brennzeit, BRENNZEIT_STD);
    schiebe(hinweise, 'msg_ko_brennzeit_anhalt', { anteil: bz });
    var t_gesamt = (t_lb !== null && bz > 0) ? t_lb / bz : null;

    return {
      ok: true, verfahren: nr,
      abschmelzleistung: dr, t_lichtbogen: t_lb,
      t_ueber_masse: t_masse, t_ueber_laenge: t_laenge,
      brennzeit: bz, t_gesamt: t_gesamt,
      fehler: [], hinweise: hinweise
    };
  }

  /* --------------------------------------------------------------------- */
  /* 3 · Gas und Energie                                                    */
  /* --------------------------------------------------------------------- */

  function gas(ein) {
    ein = ein || {};
    var nr = nummer(ein.verfahren), hinweise = [];
    if (nr === null) return { ok: false, fehler: [{ code: 'msg_ko_kein_verfahren' }] };

    /* Kein Schutzgas ist kein fehlender Wert, sondern die richtige Zahl. */
    if (drin(GAS_OHNE, nr)) {
      schiebe(hinweise, 'msg_ko_kein_gas');
      return { ok: true, verfahren: nr, durchfluss: 0, V_gas: 0, hinweise: hinweise, fehler: [] };
    }

    var q = zahl(ein.gasdurchfluss);
    if (q === null) {
      if (nr === '141') {
        var I = oder(ein.I, 0);
        q = (I > 250) ? 9 : 7;
      } else {
        q = oder(ein.drahtdurchmesser, 1.2) * (GAS_FAKTOR[nr] || 10);
      }
    }
    var t = zahl(ein.t_lichtbogen);
    var V = (t === null) ? null : q * t;
    return { ok: true, verfahren: nr, durchfluss: q, V_gas: V, hinweise: hinweise, fehler: [] };
  }

  /* E = U*I / eta_Quelle * t / 1000  [kWh], t in Stunden. */
  function energie(ein) {
    ein = ein || {};
    var U = zahl(ein.U), I = zahl(ein.I), t = zahl(ein.t_lichtbogen);
    var eta = oder(ein.eta_quelle, ETA_QUELLE_STD);
    if (U === null || I === null || t === null || eta <= 0) {
      return { ok: false, fehler: [{ code: 'msg_ko_keine_naht' }] };
    }
    var leistung = U * I / eta;                 /* W */
    return { ok: true, leistung: leistung, eta_quelle: eta,
             E: leistung * (t / 60) / 1000, fehler: [], hinweise: [] };
  }

  /* --------------------------------------------------------------------- */
  /* 4 · Kosten                                                             */
  /* --------------------------------------------------------------------- */

  /* DIE SUMME SAGT, WAS IN IHR STECKT. Sechs der zehn Positionen kann
     dieses Programm nicht herleiten; sie stehen auf null, bis jemand einen
     Wert eintraegt. Waere das still, waere jede Summe zu niedrig. */
  function kosten(ein) {
    ein = ein || {};
    var hinweise = [], leer = [], i, p, wert;
    var preise = {}, k;
    for (k in PREISE) {
      if (!Object.prototype.hasOwnProperty.call(PREISE, k)) continue;
      preise[k] = oder(ein['preis_' + k], PREISE[k].wert);
    }

    var t_h = (zahl(ein.t_gesamt) === null) ? null : zahl(ein.t_gesamt) / 60;
    var einzel = {};
    einzel.lohn = (t_h === null) ? 0 : t_h * preise.lohn;
    einzel.zusatz = (zahl(ein.m_draht) === null) ? 0 : (zahl(ein.m_draht) / 1000) * preise.draht;
    einzel.gas = (zahl(ein.V_gas) === null) ? 0 : zahl(ein.V_gas) * preise.gas;
    einzel.energie = (zahl(ein.E) === null) ? 0 : zahl(ein.E) * preise.energie;

    for (i = 0; i < POSTEN.length; i++) {
      p = POSTEN[i];
      if (p.rechenbar) continue;
      wert = oder(ein['kosten_' + p.code], 0);
      einzel[p.code] = wert;
      if (wert === 0) leer.push(p.code);
    }

    var summe = 0;
    for (i = 0; i < POSTEN.length; i++) summe += einzel[POSTEN[i].code] || 0;

    if (leer.length) schiebe(hinweise, 'msg_ko_posten_leer', { posten: leer.slice() });

    /* Preise altern. Das aelteste Jahr entscheidet, wie deutlich der
       Hinweis ausfaellt — und er steht IMMER da, nicht nur ab einem
       Schwellenjahr. */
    var jahre = [];
    for (k in PREISE) {
      if (Object.prototype.hasOwnProperty.call(PREISE, k)) jahre.push(PREISE[k].jahr);
    }
    schiebe(hinweise, 'msg_ko_preise_alt', { aeltestes: Math.min.apply(null, jahre) });
    if (PREISE.draht.belegt === false) schiebe(hinweise, 'msg_ko_preis_ungebelegt', { posten: 'draht' });

    var lohnanteil = (summe > 0) ? einzel.lohn / summe : null;
    if (lohnanteil !== null && lohnanteil > 0.6) {
      schiebe(hinweise, 'msg_ko_lohnanteil', { anteil: lohnanteil });
    }

    return {
      ok: true, einzel: einzel, summe: summe, preise: preise,
      leer: leer, lohnanteil: lohnanteil,
      fehler: [], hinweise: hinweise
    };
  }

  /* --------------------------------------------------------------------- */
  /* 5 · Bericht — alles zusammen, in Schritten                             */
  /* --------------------------------------------------------------------- */

  function bericht(ein) {
    ein = ein || {};
    var schritte = [], hin = [], fehler = [], i;
    var raus = { ok: false, version: VERSION, schritte: schritte,
                 fehler: fehler, warnungen: [], hinweise: hin };

    var m = menge(ein);
    if (!m.ok) { for (i = 0; i < m.fehler.length; i++) fehler.push(m.fehler[i]); return raus; }
    for (i = 0; i < m.hinweise.length; i++) hin.push(m.hinweise[i]);
    schritte.push({ code: 'ko_s_menge', A: m.A_theoretisch, A_mit: m.A_mit_ueberhoehung,
                    ueberhoehung: m.ueberhoehung, l: m.l_ges, volumen: m.volumen,
                    dichte: m.dichte, m_schweissgut: m.m_schweissgut,
                    ausbringung: m.ausbringung, m_draht: m.m_draht,
                    geschaetzt: m.geschaetzt });

    var z = zeit({ verfahren: ein.verfahren, m_schweissgut: m.m_schweissgut,
                   abschmelzleistung: ein.abschmelzleistung, l_ges: m.l_ges,
                   v_schweiss: ein.v_schweiss, brennzeit: ein.brennzeit });
    if (!z.ok) { for (i = 0; i < z.fehler.length; i++) fehler.push(z.fehler[i]); return raus; }
    for (i = 0; i < z.hinweise.length; i++) hin.push(z.hinweise[i]);
    schritte.push({ code: 'ko_s_zeit', abschmelzleistung: z.abschmelzleistung,
                    t_lichtbogen: z.t_lichtbogen, t_ueber_masse: z.t_ueber_masse,
                    t_ueber_laenge: z.t_ueber_laenge, brennzeit: z.brennzeit,
                    t_gesamt: z.t_gesamt });

    var g = gas({ verfahren: ein.verfahren, gasdurchfluss: ein.gasdurchfluss,
                  drahtdurchmesser: ein.drahtdurchmesser, I: ein.I,
                  t_lichtbogen: z.t_lichtbogen });
    for (i = 0; i < (g.hinweise || []).length; i++) hin.push(g.hinweise[i]);
    schritte.push({ code: 'ko_s_gas', durchfluss: g.durchfluss, V_gas: g.V_gas });

    var e = energie({ U: ein.U, I: ein.I, t_lichtbogen: z.t_lichtbogen,
                      eta_quelle: ein.eta_quelle });
    if (e.ok) {
      schritte.push({ code: 'ko_s_energie', leistung: e.leistung,
                      eta_quelle: e.eta_quelle, E: e.E });
    }

    var kEin = { t_gesamt: z.t_gesamt, m_draht: m.m_draht,
                 V_gas: g.V_gas, E: e.ok ? e.E : null };
    for (var kk in ein) {
      if (Object.prototype.hasOwnProperty.call(ein, kk) &&
          (/^preis_/.test(kk) || /^kosten_/.test(kk))) kEin[kk] = ein[kk];
    }
    var k = kosten(kEin);
    for (i = 0; i < k.hinweise.length; i++) hin.push(k.hinweise[i]);
    schritte.push({ code: 'ko_s_kosten', einzel: k.einzel, summe: k.summe,
                    preise: k.preise, leer: k.leer, lohnanteil: k.lohnanteil });

    raus.ok = true;
    raus.m_schweissgut = m.m_schweissgut;
    raus.m_draht = m.m_draht;
    raus.t_lichtbogen = z.t_lichtbogen;
    raus.t_gesamt = z.t_gesamt;
    raus.V_gas = g.V_gas;
    raus.E = e.ok ? e.E : null;
    raus.summe = k.summe;
    raus.einzel = k.einzel;
    raus.leer = k.leer;
    raus.lohnanteil = k.lohnanteil;
    return raus;
  }

  return {
    NAME: NAME, VERSION: VERSION,
    DICHTE: DICHTE, AUSBRINGUNG: AUSBRINGUNG, ABSCHMELZ: ABSCHMELZ,
    GAS_FAKTOR: GAS_FAKTOR, GAS_OHNE: GAS_OHNE, PREISE: PREISE, POSTEN: POSTEN,
    BRENNZEIT_STD: BRENNZEIT_STD, UEBERHOEHUNG_STD: UEBERHOEHUNG_STD,
    ETA_QUELLE_STD: ETA_QUELLE_STD, VERFAHREN_NR: VERFAHREN_NR, CODES: CODES,
    nummer: nummer, querschnitt: querschnitt, menge: menge, zeit: zeit,
    gas: gas, energie: energie, kosten: kosten, bericht: bericht
  };
}));
