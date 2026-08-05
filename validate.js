/* ============================================================================
 * DT-ProfiSchweissnaht · validate.js  (DTNValidate)
 * Baustein N1 — Feldschema + ZWEISTUFIGE Pruefung.
 *
 *   Stufe 1 (formal)   : Pflichtfeld da? Zahl? im erlaubten Bereich?
 *   Stufe 2 (fachlich) : Konstruktionsregeln (a >= 3 mm, a <= 0,7*t, l_eff …)
 *
 * WICHTIG: validate liefert ausschliesslich sprachneutrale MELDUNGSCODES.
 * Die Uebersetzung erfolgt in ui.js ueber DTNI18nKern — nie hier.
 * DOM-frei · UMD/IIFE · nutzt DTNData, wenn vorhanden (sonst Fallback).
 * ========================================================================== */
(function (root, factory) {
  var api = factory(
    (typeof require === 'function' && typeof module === 'object') ? require('./daten.js') : root.DTNData,
    (typeof require === 'function' && typeof module === 'object') ? require('./optionen.js') : root.DTNOptions
  );
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNValidate = api;
}(typeof self !== 'undefined' ? self : this, function (Data, Options) {
  'use strict';

  var VERSION = '0.6.0-N10b';

  /* --------------------------------------------------------------------- */
  /* Feldschema — eine Quelle fuer Formular, Assistent und Pruefung         */
  /*   code       sprachneutral                                             */
  /*   typ        'zahl' | 'auswahl'                                        */
  /*   label/hilfe i18n-Schluessel                                          */
  /*   pflicht_wenn wie optionen.js: {schluessel:[werte]} — leer = immer    */
  /*   bereich    Zugehoerigkeit (N8a) — siehe unten                        */
  /*                                                                        */
  /* FELD -> BEREICH (N8a, 2026-08-04): Der Assistent buendelt die Eingabe-  */
  /* felder nach Bereichen (Dieters Festlegung) und darf dafuer NICHT auf    */
  /* ui.js zugreifen — die Oberflaeche ist die oberste Schicht, kein Modul   */
  /* haengt an ihr. Die Zuordnung steht deshalb hier am Feld selbst.         */
  /* ui.js fuehrt in ZUORDNUNG weiterhin die ANORDNUNG (Reihenfolge der      */
  /* Bereiche und der Felder darin); eine beidseitige Assertion haelt beide  */
  /* Listen deckungsgleich — dasselbe Muster wie bei den Symbolcodes in N6b. */
  /* Wer ein Feld verschiebt und nur eine Seite aendert, bekommt Rot.        */
  /* --------------------------------------------------------------------- */
  var SCHEMA = [
    { code: 'a', bereich: 'naht',  typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 50,   dez: 1,
      label: 'fld_a',  hilfe: 'fld_a',  pflicht_wenn: { rechenrichtung: ['nachweis'] } },
    { code: 'z', bereich: 'naht',  typ: 'zahl', einheit: 'unit_mm',   min: 0.7,  max: 71,   dez: 1,
      label: 'fld_z',  hilfe: 'fld_z',  pflicht: false },
    /* ---- FELDBEREINIGUNG N5c-1 (Plan 5.1) -----------------------------
       Das Feld 'l' ist ENTFALLEN. Die Nahtlaenge ergibt sich aus Profil und
       Kantenauswahl (profil.js liefert Segmente samt Laenge und Dicke); die
       Pruefungen l_eff >= max(6a; 30) und l <= 150*a fuehrt solver.js JE
       SEGMENT an der echten Geometrie. Eine zweite, groebere Fassung
       derselben Pruefung waere genau die Doppelquelle, die Plan 3.4
       verhindern soll.  Ehrlich benannter Preis: eine Naht, die kuerzer ist
       als das Bauteil, wird ueber das nahtrelevante Mass eingegeben.

       t1 ist NUR dort Pflicht, wo das gewaehlte Profil es braucht
       (Blech-, Wand- bzw. Schenkeldicke). Bei I- und U-Profil treten tw/tf
       an seine Stelle.
       t2 ist FREIWILLIG: die Dicke des angeschlossenen Bauteils. Bleibt es
       leer, arbeitet solver.js mit der Dicke je Segment aus profil.js. ---- */
    { code: 't1', bereich: 'geometrie', typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 200,  dez: 1,
      label: 'fld_t1', hilfe: 'fld_t1',
      pflicht_wenn: { profil: ['blech', 'rohr_rechteck', 'rohr_rund', 'winkel'] } },
    { code: 't2', bereich: 'geometrie', typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 200,  dez: 1,
      label: 'fld_t2', hilfe: 'fld_t2', pflicht: false },

    /* ---- Profilmasse (N2b, 2.2b) — Pflicht genau dort, wo das gewaehlte
           Profil den Wert braucht. t1 dient zugleich als Blech-, Wand- bzw.
           Schenkeldicke, damit kein Mass doppelt abgefragt wird. ---------- */
    { code: 'b', bereich: 'geometrie',  typ: 'zahl', einheit: 'unit_mm',   min: 2,    max: 5000, dez: 1,
      label: 'fld_b',  hilfe: 'fld_b',
      pflicht_wenn: { profil: ['blech', 'rohr_rechteck', 'i_profil', 'u_profil', 'winkel'] } },
    { code: 'h', bereich: 'geometrie',  typ: 'zahl', einheit: 'unit_mm',   min: 2,    max: 5000, dez: 1,
      label: 'fld_h',  hilfe: 'fld_h',
      pflicht_wenn: { profil: ['rohr_rechteck', 'i_profil', 'u_profil', 'winkel'] } },
    { code: 'd', bereich: 'geometrie',  typ: 'zahl', einheit: 'unit_mm',   min: 2,    max: 5000, dez: 1,
      label: 'fld_d',  hilfe: 'fld_d',
      pflicht_wenn: { profil: ['rohr_rund', 'vollrund'] } },
    { code: 'tw', bereich: 'geometrie', typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 200,  dez: 1,
      label: 'fld_tw', hilfe: 'fld_tw', pflicht_wenn: { profil: ['i_profil', 'u_profil'] } },
    { code: 'tf', bereich: 'geometrie', typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 200,  dez: 1,
      label: 'fld_tf', hilfe: 'fld_tf', pflicht_wenn: { profil: ['i_profil', 'u_profil'] } },
    { code: 'r_ecke', bereich: 'geometrie', typ: 'zahl', einheit: 'unit_mm', min: 0,  max: 200,  dez: 1,
      standard: 0, label: 'fld_r_ecke', hilfe: 'fld_r_ecke', pflicht: false, ueberschreibbar: true },
    { code: 'a_steg', bereich: 'naht',    typ: 'zahl', einheit: 'unit_mm', min: 0.5, max: 50, dez: 1,
      label: 'fld_a_steg',    hilfe: 'fld_a_steg',    pflicht: false, ueberschreibbar: true },
    { code: 'a_flansch', bereich: 'naht', typ: 'zahl', einheit: 'unit_mm', min: 0.5, max: 50, dez: 1,
      label: 'fld_a_flansch', hilfe: 'fld_a_flansch', pflicht: false, ueberschreibbar: true },

    { code: 'N', bereich: 'lasten',  typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_N',  hilfe: 'fld_N',  pflicht_wenn: { lasteingabe: ['direkt'] } },
    { code: 'Q', bereich: 'lasten',  typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_Q',  hilfe: 'fld_Q',  pflicht_wenn: { lasteingabe: ['direkt'] } },
    { code: 'M', bereich: 'lasten',  typ: 'zahl', einheit: 'unit_Nm',   min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_M',  hilfe: 'fld_M',  pflicht: false },
    { code: 'T', bereich: 'lasten',  typ: 'zahl', einheit: 'unit_Nm',   min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_T',  hilfe: 'fld_T',  pflicht: false },

    /* ---- N3: ausfuehrliche Schnittgroessen. Q und M oben sind die
           Kurzform (Q = Q_z, M = M_y) fuer den haeufigen Fall — wer schraeg
           oder zweiachsig belastet, nutzt diese Felder. solver.js meldet es
           ehrlich als Fehler, wenn Kurzform und ausfuehrliche Form mit
           VERSCHIEDENEN Werten gefuellt sind (msg_sv_last_doppelt). ------ */
    { code: 'Qy', bereich: 'lasten', typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_Qy', hilfe: 'fld_Qy', pflicht: false },
    { code: 'Qz', bereich: 'lasten', typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_Qz', hilfe: 'fld_Qz', pflicht: false },
    { code: 'My', bereich: 'lasten', typ: 'zahl', einheit: 'unit_Nm',   min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_My', hilfe: 'fld_My', pflicht: false },
    { code: 'Mz', bereich: 'lasten', typ: 'zahl', einheit: 'unit_Nm',   min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_Mz', hilfe: 'fld_Mz', pflicht: false },

    { code: 'F', bereich: 'lasten',  typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_F',  hilfe: 'fld_F',  pflicht_wenn: { lasteingabe: ['geometrisch'] } },
    { code: 'e', bereich: 'lasten',  typ: 'zahl', einheit: 'unit_mm',   min: 0,    max: 100000, dez: 1,
      label: 'fld_e',  hilfe: 'fld_e',  pflicht_wenn: { lasteingabe: ['geometrisch'] } },

    { code: 'gammaM2', bereich: 'beiwerte', typ: 'zahl', einheit: 'unit_dimensionslos', min: 1.0, max: 2.0, dez: 2,
      standard: 1.25, label: 'fld_gammaM2', hilfe: 'fld_gammaM2',
      pflicht_wenn: { welt: ['A'] }, ueberschreibbar: true },
    { code: 'gammaMw', bereich: 'beiwerte', typ: 'zahl', einheit: 'unit_dimensionslos', min: 1.0, max: 2.0, dez: 2,
      standard: 1.25, label: 'fld_gammaMw', hilfe: 'fld_gammaMw',
      pflicht_wenn: { welt: ['A'], werkstoffgruppe: ['alu'] }, ueberschreibbar: true },
    { code: 'betaW', bereich: 'beiwerte',   typ: 'zahl', einheit: 'unit_dimensionslos', min: 0.5, max: 1.5, dez: 2,
      label: 'fld_betaW', hilfe: 'fld_betaW', pflicht: false, ueberschreibbar: true },

    { code: 'S', bereich: 'beiwerte',  typ: 'zahl', einheit: 'unit_dimensionslos', min: 1.0, max: 4.0, dez: 2,
      standard: 1.5, label: 'fld_S', hilfe: 'fld_S',
      pflicht_wenn: { welt: ['B'] }, ueberschreibbar: true },
    { code: 'nu', bereich: 'beiwerte', typ: 'zahl', einheit: 'unit_dimensionslos', min: 0.3, max: 1.0, dez: 2,
      label: 'fld_nu', hilfe: 'fld_nu', pflicht: false, ueberschreibbar: true },

    /* R_e wird aus der Werkstofftabelle vorbelegt und ist per Haken
       ueberschreibbar (Regel 3.1) — nur Welt B rechnet mit der Streckgrenze. */
    { code: 'Re', bereich: 'beiwerte', typ: 'zahl', einheit: 'unit_Nmm2', min: 100, max: 1000, dez: 0,
      label: 'fld_Re', hilfe: 'fld_Re', pflicht: false, ueberschreibbar: true },

    /* ---- Wärmeführung (N9b) — alle nur bei zugeschaltetem Bereich ------
       Die Schmelzenanalyse steht im Abnahmezeugnis. Wer sie nicht hat,
       trägt das CET direkt ein — deshalb ist keine einzelne Analysezahl
       Pflicht, wohl aber am Ende ein CET (das prüft thermik.js). */
    { code: 'an_C',  bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 2, dez: 3, label: 'fld_an_C',  hilfe: 'fld_an_C',  pflicht: false },
    { code: 'an_Si', bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 2, dez: 3, label: 'fld_an_Si', hilfe: 'fld_an_Si', pflicht: false },
    { code: 'an_Mn', bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 3, dez: 3, label: 'fld_an_Mn', hilfe: 'fld_an_Mn', pflicht: false },
    { code: 'an_Cr', bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 3, dez: 3, label: 'fld_an_Cr', hilfe: 'fld_an_Cr', pflicht: false },
    { code: 'an_Mo', bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 2, dez: 3, label: 'fld_an_Mo', hilfe: 'fld_an_Mo', pflicht: false },
    { code: 'an_V',  bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 1, dez: 3, label: 'fld_an_V',  hilfe: 'fld_an_V',  pflicht: false },
    { code: 'an_Cu', bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 2, dez: 3, label: 'fld_an_Cu', hilfe: 'fld_an_Cu', pflicht: false },
    { code: 'an_Ni', bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 5, dez: 3, label: 'fld_an_Ni', hilfe: 'fld_an_Ni', pflicht: false },
    { code: 'd_komb', bereich: 'thermik', typ: 'zahl', einheit: 'unit_mm', min: 5, max: 200, dez: 0, label: 'fld_d_komb', hilfe: 'fld_d_komb', pflicht: false, ueberschreibbar: true },
    { code: 'CET',   bereich: 'thermik', typ: 'zahl', einheit: 'unit_prozent', min: 0.10, max: 0.80, dez: 3, label: 'fld_CET', hilfe: 'fld_CET', pflicht: false, ueberschreibbar: true },
    { code: 'HD',    bereich: 'thermik', typ: 'zahl', einheit: 'unit_ml100g', min: 0.5, max: 30, dez: 1, label: 'fld_HD', hilfe: 'fld_HD', standard: 5, ueberschreibbar: true,
      pflicht_wenn: { thermik_aktiv: [true] } },
    /* ANHALTSWERTE, KEINE TABELLENWERTE (N9d, Dieters Wunsch 2026-08-05).
       Schweissspannung, Strom und Geschwindigkeit stehen in keiner Norm —
       die Praxis kennt nur Bereiche. Sie werden trotzdem vorbelegt, damit
       ein Laie ueberhaupt weiterkommt, aber sie tragen `anhalt: true` und
       werden dadurch SICHTBAR ANDERS gekennzeichnet als ein Normwert.
       Ein Erfahrungswert, der aussieht wie eine Vorschrift, waere genau die
       stille Behauptung, die dieses Programm sonst ueberall vermeidet.
       Die Werte entsprechen MAG in mittlerer Lage — dem geläufigsten
       Verfahren (Dieter). Die Bereiche je Verfahren nennt der Laien-ⓘ. */
    { code: 'sp_U',  bereich: 'prozess', typ: 'zahl', einheit: 'unit_volt', min: 5, max: 60, dez: 1, label: 'fld_sp_U', hilfe: 'fld_sp_U',
      standard: 28, anhalt: true, ueberschreibbar: true,
      pflicht_wenn: [{ thermik_aktiv: [true] }, { kosten_aktiv: [true] }] },
    { code: 'sp_I',  bereich: 'prozess', typ: 'zahl', einheit: 'unit_ampere', min: 20, max: 1200, dez: 0, label: 'fld_sp_I', hilfe: 'fld_sp_I',
      standard: 250, anhalt: true, ueberschreibbar: true,
      pflicht_wenn: [{ thermik_aktiv: [true] }, { kosten_aktiv: [true] }] },
    { code: 'sp_v',  bereich: 'prozess', typ: 'zahl', einheit: 'unit_mm_s', min: 0.5, max: 50, dez: 2, label: 'fld_sp_v', hilfe: 'fld_sp_v',
      standard: 4, anhalt: true, ueberschreibbar: true,
      pflicht_wenn: [{ thermik_aktiv: [true] }, { kosten_aktiv: [true] }] },
    { code: 'T0',    bereich: 'thermik', typ: 'zahl', einheit: 'unit_grad', min: -20, max: 400, dez: 0, label: 'fld_T0', hilfe: 'fld_T0', pflicht: false, ueberschreibbar: true },
    { code: 't85_min', bereich: 'thermik', typ: 'zahl', einheit: 'unit_s', min: 1, max: 100, dez: 1, label: 'fld_t85_min', hilfe: 'fld_t85_min', pflicht: false, ueberschreibbar: true },
    { code: 't85_max', bereich: 'thermik', typ: 'zahl', einheit: 'unit_s', min: 1, max: 200, dez: 1, label: 'fld_t85_max', hilfe: 'fld_t85_max', pflicht: false, ueberschreibbar: true },
    { code: 'F2',    bereich: 'thermik', typ: 'zahl', einheit: null, min: 0.3, max: 1.2, dez: 2, label: 'fld_F2', hilfe: 'fld_F2', standard: 1, pflicht: false, ueberschreibbar: true },
    { code: 'F3',    bereich: 'thermik', typ: 'zahl', einheit: null, min: 0.3, max: 1.2, dez: 2, label: 'fld_F3', hilfe: 'fld_F3', standard: 1, pflicht: false, ueberschreibbar: true },

    /* ---- Geteilte Prozessgroessen (N10b) --------------------------------
       Drahtdurchmesser und Quellenwirkungsgrad braucht die Kostenrechnung,
       die Schweissparameter brauchen beide Bereiche. */
    { code: 'drahtdm', bereich: 'prozess', typ: 'zahl', einheit: 'unit_mm', min: 0.6, max: 4, dez: 1, label: 'fld_drahtdm', hilfe: 'fld_drahtdm',
      standard: 1.2, anhalt: true, ueberschreibbar: true,
      pflicht_wenn: [{ kosten_aktiv: [true] }] },
    { code: 'eta_quelle', bereich: 'prozess', typ: 'zahl', einheit: null, min: 0.5, max: 1, dez: 2, label: 'fld_eta_quelle', hilfe: 'fld_eta_quelle',
      standard: 0.85, anhalt: true, ueberschreibbar: true, pflicht: false },

    /* ---- Kosten, Zeit und Drahtbedarf (N10b) ----------------------------
       Drei Sorten Wert in einem Bereich: berechnet (nichts davon steht
       hier), Anhaltswerte aus der Praxis und Preisannahmen mit Jahr. */
    { code: 'A_fuge',   bereich: 'kosten', typ: 'zahl', einheit: 'unit_mm2', min: 1, max: 5000, dez: 1, label: 'fld_A_fuge', hilfe: 'fld_A_fuge', pflicht: false, ueberschreibbar: true },
    { code: 'ueberhoehung', bereich: 'kosten', typ: 'zahl', einheit: 'unit_prozent', min: 0, max: 50, dez: 0, label: 'fld_ueberhoehung', hilfe: 'fld_ueberhoehung',
      standard: 15, anhalt: true, ueberschreibbar: true, pflicht: false },
    { code: 'ausbringung', bereich: 'kosten', typ: 'zahl', einheit: 'unit_prozent', min: 40, max: 100, dez: 0, label: 'fld_ausbringung', hilfe: 'fld_ausbringung',
      standard: 95, anhalt: true, ueberschreibbar: true, pflicht: false },
    { code: 'abschmelz', bereich: 'kosten', typ: 'zahl', einheit: 'unit_kg_h', min: 0.2, max: 30, dez: 1, label: 'fld_abschmelz', hilfe: 'fld_abschmelz',
      standard: 3, anhalt: true, ueberschreibbar: true,
      pflicht_wenn: [{ kosten_aktiv: [true] }] },
    { code: 'brennzeit', bereich: 'kosten', typ: 'zahl', einheit: 'unit_prozent', min: 5, max: 100, dez: 0, label: 'fld_brennzeit', hilfe: 'fld_brennzeit',
      standard: 40, anhalt: true, ueberschreibbar: true,
      pflicht_wenn: [{ kosten_aktiv: [true] }] },
    { code: 'gasfluss', bereich: 'kosten', typ: 'zahl', einheit: 'unit_l_min', min: 0, max: 40, dez: 1, label: 'fld_gasfluss', hilfe: 'fld_gasfluss', pflicht: false, ueberschreibbar: true },

    /* PREISANNAHMEN — sie altern. Jede traegt ihr Jahr im Laien-ⓘ. */
    { code: 'preis_lohn',    bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur_h',   min: 0, max: 500, dez: 2, label: 'fld_preis_lohn',    hilfe: 'fld_preis_lohn',    standard: 35,   preis: true, jahr: 2019, ueberschreibbar: true, pflicht_wenn: [{ kosten_aktiv: [true] }] },
    { code: 'preis_draht',   bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur_kg',  min: 0, max: 200, dez: 2, label: 'fld_preis_draht',   hilfe: 'fld_preis_draht',   standard: 2.5,  preis: true, jahr: 2025, ueberschreibbar: true, pflicht_wenn: [{ kosten_aktiv: [true] }] },
    { code: 'preis_gas',     bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur_l',   min: 0, max: 5,   dez: 3, label: 'fld_preis_gas',     hilfe: 'fld_preis_gas',     standard: 0.01, preis: true, jahr: 2025, ueberschreibbar: true, pflicht_wenn: [{ kosten_aktiv: [true] }] },
    { code: 'preis_energie', bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur_kwh', min: 0, max: 5,   dez: 3, label: 'fld_preis_energie', hilfe: 'fld_preis_energie', standard: 0.16, preis: true, jahr: 2025, ueberschreibbar: true, pflicht_wenn: [{ kosten_aktiv: [true] }] },

    /* DIE SECHS POSITIONEN, DIE DAS PROGRAMM NICHT HERLEITEN KANN.
       Sie stehen auf null, bis jemand einen Wert eintraegt — und die Summe
       sagt, welche leer sind. */
    { code: 'kosten_maschine',     bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur', min: 0, max: 100000, dez: 2, label: 'fld_kosten_maschine',     hilfe: 'fld_kosten_maschine',     pflicht: false },
    { code: 'kosten_vorbereitung', bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur', min: 0, max: 100000, dez: 2, label: 'fld_kosten_vorbereitung', hilfe: 'fld_kosten_vorbereitung', pflicht: false },
    { code: 'kosten_vorwaermen',   bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur', min: 0, max: 100000, dez: 2, label: 'fld_kosten_vorwaermen',   hilfe: 'fld_kosten_vorwaermen',   pflicht: false },
    { code: 'kosten_nacharbeit',   bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur', min: 0, max: 100000, dez: 2, label: 'fld_kosten_nacharbeit',   hilfe: 'fld_kosten_nacharbeit',   pflicht: false },
    { code: 'kosten_pruefung',     bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur', min: 0, max: 100000, dez: 2, label: 'fld_kosten_pruefung',     hilfe: 'fld_kosten_pruefung',     pflicht: false },
    { code: 'kosten_gemeinkosten', bereich: 'kosten', typ: 'zahl', einheit: 'unit_eur', min: 0, max: 100000, dez: 2, label: 'fld_kosten_gemeinkosten', hilfe: 'fld_kosten_gemeinkosten', pflicht: false }
  ];

  function feld(code) {
    for (var i = 0; i < SCHEMA.length; i++) if (SCHEMA[i].code === code) return SCHEMA[i];
    return null;
  }

  function istLeer(v) { return v === undefined || v === null || v === '' ||
                               (typeof v === 'number' && !isFinite(v)); }

  /* Eine Bedingung ist ein Objekt {schluessel: [werte]} und wirkt als UND
     ueber alle Schluessel. EIN ARRAY VON BEDINGUNGEN WIRKT ALS ODER (N10b):
     Die Schweissparameter U, I und v werden von der Waermefuehrung UND von
     der Kostenrechnung gebraucht — ein Anwender, der nur kalkulieren will,
     soll nicht die Waermefuehrung zuschalten muessen, nur um an sie
     heranzukommen. Ohne diese Erweiterung haette dasselbe Feld zweimal
     existieren muessen, und zwei Felder fuer dieselbe Zahl sind zwei
     Gelegenheiten, sie verschieden anzugeben. */
  function bedingung(bed, zustand) {
    if (!bed) return true;
    if (Object.prototype.toString.call(bed) === '[object Array]') {
      for (var oi = 0; oi < bed.length; oi++) {
        if (bedingung(bed[oi], zustand)) return true;
      }
      return false;
    }
    for (var k in bed) {
      if (!Object.prototype.hasOwnProperty.call(bed, k)) continue;
      var ist = zustand ? zustand[k] : undefined;
      if (istLeer(ist)) return false;               /* noch nicht entschieden */
      if (bed[k].indexOf(ist) < 0) return false;
    }
    return true;
  }

  function istPflicht(f, zustand) {
    if (f.pflicht === true) return true;
    if (f.pflicht === false && !f.pflicht_wenn) return false;
    if (f.pflicht_wenn) return bedingung(f.pflicht_wenn, zustand);
    return false;
  }

  /* Zahl robust lesen: akzeptiert Komma und Punkt, verweigert alles andere. */
  function zahl(v) {
    if (typeof v === 'number') return isFinite(v) ? v : NaN;
    if (typeof v !== 'string') return NaN;
    var s = v.trim().replace(/\s/g, '').replace(',', '.');
    if (s === '') return NaN;
    if (!/^[-+]?\d*\.?\d+([eE][-+]?\d+)?$/.test(s)) return NaN;
    return parseFloat(s);
  }

  function meldung(feldCode, code, extra) {
    var m = { feld: feldCode, code: code };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) m[k] = extra[k];
    return m;
  }

  /* --------------------------------------------------------------------- */
  /* STUFE 1 — formale Pruefung                                             */
  /* --------------------------------------------------------------------- */
  function stufe1(werte, zustand) {
    var fehler = [], zahlen = {};
    for (var i = 0; i < SCHEMA.length; i++) {
      var f = SCHEMA[i], roh = werte ? werte[f.code] : undefined;
      var pflicht = istPflicht(f, zustand);

      if (istLeer(roh)) {
        if (pflicht) fehler.push(meldung(f.code, 'msg_pflicht'));
        continue;
      }
      if (f.typ === 'zahl') {
        var v = zahl(roh);
        if (isNaN(v)) { fehler.push(meldung(f.code, 'msg_zahl')); continue; }
        if (typeof f.min === 'number' && v < f.min) { fehler.push(meldung(f.code, 'msg_min', { grenze: f.min })); continue; }
        if (typeof f.max === 'number' && v > f.max) { fehler.push(meldung(f.code, 'msg_max', { grenze: f.max })); continue; }
        zahlen[f.code] = v;
      } else {
        zahlen[f.code] = roh;
      }
    }
    return { ok: fehler.length === 0, fehler: fehler, zahlen: zahlen };
  }

  /* --------------------------------------------------------------------- */
  /* STUFE 2 — fachliche Pruefung (Konstruktionsregeln)                     */
  /*   fehler   = Nachweis so nicht fuehrbar                                */
  /*   warnungen= rechenbar, aber ausserhalb der Regel/Empfehlung           */
  /*   hinweise = Pflichtinformationen (z. B. Alu-WEZ)                      */
  /* --------------------------------------------------------------------- */
  function stufe2(zahlen, zustand) {
    var fehler = [], warnungen = [], hinweise = [];
    var z = zustand || {}, v = zahlen || {};

    var a  = v.a;
    var t1 = v.t1, t2 = v.t2;
    var tmin = (typeof t1 === 'number' && typeof t2 === 'number') ? Math.min(t1, t2) : (t1 || t2);
    var tmax = (typeof t1 === 'number' && typeof t2 === 'number') ? Math.max(t1, t2) : (t1 || t2);

    /* a-Mass aus z ableiten, wenn a fehlt (gleichschenklige Kehlnaht) */
    if (typeof a !== 'number' && typeof v.z === 'number') a = v.z / Math.SQRT2;

    var istKehl = z.nahtart && (z.nahtart.indexOf('kehl_') === 0);
    var istTeilDurch = z.nahtart && (['stumpf_hv', 'stumpf_hy', 'stumpf_dhy'].indexOf(z.nahtart) >= 0);

    if (typeof a === 'number' && (istKehl || istTeilDurch)) {
      if (a < 3) fehler.push(meldung('a', 'msg_a_min_ec3'));
      if (typeof tmax === 'number' && tmax > 0) {
        var aPraxis = (tmax >= 30) ? 5 : (Math.sqrt(tmax) - 0.5);
        if (a < aPraxis - 1e-9) warnungen.push(meldung('a', 'msg_a_min_praxis', { grenze: Math.round(aPraxis * 100) / 100 }));
      }
      if (typeof tmin === 'number' && tmin > 0 && a > 0.7 * tmin + 1e-9) {
        warnungen.push(meldung('a', 'msg_a_max', { grenze: Math.round(0.7 * tmin * 100) / 100 }));
      }
    }

    if (typeof tmin === 'number' && tmin < 4 && z.welt === 'A') {
      warnungen.push(meldung('t1', 'msg_t_min_ec3'));
    }

    /* Die Laengenpruefungen (l_eff >= max(6a; 30) und l <= 150*a) stehen
       nicht mehr hier: solver.js fuehrt sie JE SEGMENT an der Geometrie aus
       profil.js — dieselben Grenzen, aber an der echten Nahtlaenge statt an
       einem zweiten, von Hand eingegebenen Mass (Plan 5.1, N5c-1). */

    /* Dickenstufe gegen die Werkstofftabelle */
    if (Data && z.werkstoff && typeof tmax === 'number') {
      var kw = Data.kennwerte(z.werkstoff, tmax, z.zustand);
      if (kw && kw.ok === false) warnungen.push(meldung('t1', 'msg_dicke_stufe', { grund: kw.grund }));
      if (kw && kw.luecke) hinweise.push(meldung('werkstoff', 'lk_' + kw.luecke));
    }

    /* Aluminium: WEZ-Entfestigung ist Pflichtinformation */
    if (z.werkstoffgruppe === 'alu') hinweise.push(meldung('werkstoff', 'msg_alu_wez'));

    /* Trennung der Welten und Trennung Lastfall <-> Ermuedung */
    if (z.welt) hinweise.push(meldung('welt', 'msg_welt_getrennt'));
    if (z.welt === 'B' && z.ermuedung_aktiv) hinweise.push(meldung('lastfall', 'msg_lastfall_ermuedung'));

    return { ok: fehler.length === 0, fehler: fehler, warnungen: warnungen, hinweise: hinweise };
  }

  /* --------------------------------------------------------------------- */
  /* Gesamtpruefung: Auswahl (optionen.js) + Stufe 1 + Stufe 2              */
  /* --------------------------------------------------------------------- */
  function pruefe(werte, zustand) {
    var auswahl = Options ? Options.pruefe(zustand) : { ok: true, fehlend: [], ungueltig: [] };
    var s1 = stufe1(werte, zustand);

    var fehler = [];
    var i;
    for (i = 0; i < auswahl.fehlend.length; i++)   fehler.push(meldung(auswahl.fehlend[i], 'msg_auswahl'));
    for (i = 0; i < auswahl.ungueltig.length; i++) fehler.push(meldung(auswahl.ungueltig[i], 'msg_ungueltig'));
    for (i = 0; i < s1.fehler.length; i++)         fehler.push(s1.fehler[i]);

    /* Stufe 2 laeuft nur auf formal sauberen Zahlen. */
    var s2 = { ok: true, fehler: [], warnungen: [], hinweise: [] };
    if (s1.ok) s2 = stufe2(s1.zahlen, zustand);
    for (i = 0; i < s2.fehler.length; i++) fehler.push(s2.fehler[i]);

    return {
      ok: fehler.length === 0,
      stufe1_ok: s1.ok && auswahl.ok,
      fehler: fehler,
      warnungen: s2.warnungen,
      hinweise: s2.hinweise,
      werte: s1.zahlen
    };
  }

  /* --------------------------------------------------------------------- */
  /* N5c-1 (Plan 5.1): UEBERSETZUNG FORMULAR -> RECHENKERN                  */
  /*                                                                        */
  /* Das Formular liefert flache Zeichenketten, der Rechenkern erwartet      */
  /* Zahlen und ein verschachteltes profil_eingabe. Beides wird HIER         */
  /* zusammengesetzt und nicht in ui.js — aus zwei Gruenden:                 */
  /*   1. Das a-Mass wird aus dem z-Mass abgeleitet (a = z / sqrt(2)). Diese */
  /*      Umrechnung stand ohnehin schon hier (Stufe 2); ui.js darf nicht    */
  /*      rechnen (Plan 4.10).                                              */
  /*   2. Welches Feld eine Abmessung ist und welches eine Last, weiss das   */
  /*      Feldschema — ui.js soll es nicht ein zweites Mal wissen.           */
  /* --------------------------------------------------------------------- */

  /* Reine Geometrie: wandert in profil_eingabe. 'a' und 't1' stehen dort UND
     flach, weil der Rechenkern beide Stellen auswertet (a-Mass je Segment
     bzw. t_min als Rueckfallebene). */
  var PROFIL_FELDER = ['b', 'h', 'd', 'tw', 'tf', 'r_ecke', 't1', 'a', 'a_steg', 'a_flansch'];
  var NUR_PROFIL    = ['b', 'h', 'd', 'tw', 'tf', 'r_ecke', 'a_steg', 'a_flansch'];

  /* Geprueft und normiert: Zahlen als Zahlen, a aus z abgeleitet, wenn noetig. */
  function normiert(werte, zustand) {
    var s1 = stufe1(werte, zustand);
    var w = {}, k;
    for (k in s1.zahlen) if (Object.prototype.hasOwnProperty.call(s1.zahlen, k)) w[k] = s1.zahlen[k];

    var ausZ = false;
    if (typeof w.a !== 'number' && typeof w.z === 'number') {
      w.a = w.z / Math.SQRT2;
      ausZ = true;
    }
    return { ok: s1.ok, fehler: s1.fehler, werte: w, a_aus_z: ausZ };
  }

  /* Fertige Eingabe fuer den Rechenkern. Sprachneutral, ohne DOM, ohne
     Kenntnis des Solvers — es entsteht nur ein einfaches Objekt. */
  function rechenEingabe(werte, zustand) {
    var n = normiert(werte, zustand);
    var w = n.werte, z = zustand || {}, ein = {}, pe = {}, k, i;

    for (k in z) if (Object.prototype.hasOwnProperty.call(z, k)) ein[k] = z[k];

    pe.profil = z.profil;
    pe.kanten = z.kanten;
    /* ENDKRATERABZUG (N9b): waehlbar, Voreinstellung ist der Abzug. Nur
       ein ausdrueckliches 'ohne' schaltet ihn ab — jede andere Lage,
       auch eine leere, laesst ihn an. Die unsichere Seite darf nie durch
       Weglassen entstehen. */
    pe.endkrater = (z.endkrater !== 'ohne');
    for (i = 0; i < PROFIL_FELDER.length; i++) {
      if (typeof w[PROFIL_FELDER[i]] === 'number') pe[PROFIL_FELDER[i]] = w[PROFIL_FELDER[i]];
    }
    ein.profil_eingabe = pe;

    /* Alles Uebrige flach: Lasten, Beiwerte, a, t1, t2. Die reinen
       Abmessungen bleiben aussen vor — sie stehen schon in profil_eingabe,
       und der Rechenkern kennt sie dort. 'z' entfaellt: daraus ist a
       geworden, und zwei Wege zum selben Mass waeren eine Doppelquelle. */
    for (k in w) {
      if (!Object.prototype.hasOwnProperty.call(w, k)) continue;
      if (k === 'z' || NUR_PROFIL.indexOf(k) >= 0) continue;
      ein[k] = w[k];
    }

    return { ok: n.ok, fehler: n.fehler, eingabe: ein, a_aus_z: n.a_aus_z };
  }

  /* Standardwerte fuer die Vorbelegung des Formulars (nie ueberschreibend). */
  function standardwerte(zustand) {
    var o = {};
    for (var i = 0; i < SCHEMA.length; i++) {
      var f = SCHEMA[i];
      if (typeof f.standard !== 'undefined' && istPflicht(f, zustand)) o[f.code] = f.standard;
    }
    return o;
  }

  /* Alle Felder, die im gegebenen Zustand sichtbar sein sollen. */
  function sichtbareFelder(zustand) {
    var r = [];
    for (var i = 0; i < SCHEMA.length; i++) {
      var f = SCHEMA[i];
      if (f.pflicht === true || istPflicht(f, zustand)) { r.push(f); continue; }
      if (f.pflicht === false) { r.push(f); continue; }   /* optionale Felder immer zeigen */
    }
    return r;
  }

  /* Leerer Datensatz — Grundlage fuer "Leeren leert wirklich ALLES". */
  function leer() {
    var o = {};
    for (var i = 0; i < SCHEMA.length; i++) o[SCHEMA[i].code] = '';
    return o;
  }

  return {
    VERSION: VERSION,
    SCHEMA: SCHEMA,
    feld: feld,
    zahl: zahl,
    istPflicht: istPflicht,
    stufe1: stufe1,
    stufe2: stufe2,
    pruefe: pruefe,
    PROFIL_FELDER: PROFIL_FELDER,
    normiert: normiert,
    rechenEingabe: rechenEingabe,
    standardwerte: standardwerte,
    sichtbareFelder: sichtbareFelder,
    leer: leer
  };
}));
