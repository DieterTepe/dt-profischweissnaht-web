/* ============================================================================
 * DT-ProfiSchweissnaht · daten.js  (DTNData)
 * Baustein N1 — Fundament: Werkstoffe, Beiwerte, Geometriegrenzen,
 *               Welt-B-Tabellen, Verfahrensdaten, Fugenformen, ISO 5817, EXC.
 * DOM-frei · UMD/IIFE · keine Abhängigkeiten.
 *
 * REGELN (Schweissnaht-1.md, Abschnitt 8):
 *  - Tabellenwerte sind massgeblich, nicht Formeln.
 *  - Jeder Zahlenwert traegt Quellenangaben (q: [..]) — Ziel >= 2 unabhaengige.
 *  - Fehlt eine zweite Quelle oder streut der Wert, steht luecke:'...' dabei.
 *    Solche Werte muessen in der Oberflaeche sichtbar als Luecke erscheinen.
 *  - Alle Codes sind sprachneutral. Texte ausschliesslich im i18n-Woerterbuch.
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNData = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.1.0-N1';

  /* --------------------------------------------------------------------- */
  /* 0) Quellenverzeichnis (Kurzcodes -> Klartext; erscheint im Rechenweg)  */
  /* --------------------------------------------------------------------- */
  var QUELLEN = {
    EC3_18:   'EN 1993-1-8:2005 (+AC:2009) — Anschluesse, Schweissnaehte',
    EC3_11:   'EN 1993-1-1:2005/AC:2009 — Grundlagen, Werkstoffkennwerte',
    EC3_14:   'EN 1993-1-4 — Nichtrostende Staehle',
    EC3_19:   'EN 1993-1-9 — Ermuedung Stahl',
    EC9_11:   'EN 1999-1-1 — Aluminium, Bemessung',
    EC9_13:   'EN 1999-1-3 — Aluminium, Ermuedung',
    EN1011_1: 'EN 1011-1 — Lichtbogenschweissen, thermische Wirkungsgrade',
    EN1011_2: 'EN 1011-2 — Waermefuehrung ferritische Staehle',
    EN1090:   'EN 1090-2 — Ausfuehrung, Ausfuehrungsklassen EXC',
    ISO5817:  'EN ISO 5817 — Bewertungsgruppen B/C/D',
    ISO2553:  'EN ISO 2553 — Zeichnungssymbole',
    ISO4063:  'EN ISO 4063 — Prozesskennzahlen',
    ISO9692:  'EN ISO 9692-1 — Schweissnahtvorbereitung, Lichtbogenschweissen Stahl',
    CESTRUCO: 'Wald et al., CESTRUCO "Welding", TU Prag (Sekundaerquelle)',
    NA_DE:    'Deutscher Nationaler Anhang / Stahlbau-Kalender (Ungermann/Schneider)',
    BFS:      'bauforumstahl, Arbeitshilfen A.1.1 / B.9.3',
    ECAPP:    'eurocodeapplied.com — Werkstofftabellen EN 1993-1-1',
    RM:       'Roloff/Matek Maschinenelemente + Formelsammlung',
    DECKER:   'Decker Maschinenelemente, Werte via schweizer-fn.de',
    SFN:      'schweizer-fn.de — Schweissnahtverbindung',
    HSA:      'Voigt, HS Anhalt — Lehrunterlagen Schweissverbindungen',
    SCI413:   'SCI P413 / P291 — Design Manual Structural Stainless Steel',
    TYLEK:    'Tylek, Politechnika Krakowska — Kennwerte EN 10088',
    TALAT:    'TALAT 2301/2302 — Aluminium Design / Werkstoffe',
    DGEC9:    'Designers\u2019 Guide to Eurocode 9 (Hoeglund/Tindall)',
    CVUT:     'CVUT Prag — Aluminium Connections (Leonardo/CESTRUCO)',
    DVS1612:  'DVS 1612 — Kerbfaelle Schienenfahrzeugbau',
    ERL:      'ERL GmbH — Erklaerungen zur Abkuehlzeit t8/5',
    AZS:      'anleitung-zum-schweissen.de — Fachwissen t8/5',
    FAB:      'thefabricator.com (R. Koltz, ESAB) — Ausbringungsgrade',
    MATW:     'materialwelding.com — Ausbringung/Abschmelzleistung',
    DSW:      'dswerk.de — Schweissnahtberechnung',
    IDEA:     'IDEA StatiCa — Weld check EN 1993-1-8',
    SDC:      'SDC Verifier — Benchmark EN 1999-1-1 Weld'
  };

  /* --------------------------------------------------------------------- */
  /* 1) Bemessungswelten                                                    */
  /* --------------------------------------------------------------------- */
  var WELTEN = {
    A: { code: 'A', norm: 'EN 1993-1-8 / EN 1993-1-4 / EN 1999-1-1',
         bezug: 'fu', konzept: 'grenzzustand', q: ['EC3_18'] },
    B: { code: 'B', norm: 'klassischer Maschinenbau (Roloff/Matek, Decker, DVS 1612)',
         bezug: 're',  konzept: 'zulaessige_spannung', q: ['RM', 'DECKER'] }
  };

  /* --------------------------------------------------------------------- */
  /* 2) Teilsicherheitsbeiwerte                                             */
  /* --------------------------------------------------------------------- */
  var BEIWERTE = {
    gamma_M2:  { wert: 1.25, ueberschreibbar: true, q: ['EC3_18', 'NA_DE'] },
    gamma_M1:  { wert: 1.10, ueberschreibbar: true, q: ['EC3_11', 'NA_DE'] },
    gamma_M0:  { wert: 1.00, ueberschreibbar: true, q: ['EC3_11', 'NA_DE'] },
    gamma_Mw:  { wert: 1.25, ueberschreibbar: true, q: ['EC9_11', 'SDC'] },  // Alu-Naht
    gamma_M_B: { wert: 1.10, ueberschreibbar: true, q: ['DECKER', 'SFN'] },  // Welt B Materialbeiwert
    faktor_sigma_senkrecht: { wert: 0.9, q: ['EC3_18', 'CESTRUCO'] }         // sigma_senkr <= 0,9*fu/gM2
  };

  /* --------------------------------------------------------------------- */
  /* 3) beta_w — Regelsaetze (Welt A, Stahl)                                */
  /*    WIDERSPRUCH S420/S460: CEN-2005 = 1,0 ; deutscher NA = 0,88 / 0,85  */
  /*    Beide Regelsaetze anbieten, Auswahl im Rechenweg ausweisen.         */
  /* --------------------------------------------------------------------- */
  var BW_REGELSATZ = {
    cen2005: { code: 'cen2005', q: ['EC3_18', 'CESTRUCO'],
               werte: { S235: 0.80, S275: 0.85, S355: 0.90, S420: 1.00, S460: 1.00 } },
    na_de:   { code: 'na_de',   q: ['NA_DE', 'BFS'],
               werte: { S235: 0.80, S275: 0.85, S355: 0.90, S420: 0.88, S460: 0.85 } }
  };

  /* --------------------------------------------------------------------- */
  /* 4) Werkstoffe — 11 Sorten in V1                                        */
  /*    Kennwerte in N/mm², Dicken in mm.                                   */
  /* --------------------------------------------------------------------- */

  var PHYSIK = {
    stahl:     { E: 210000, G: 81000, nu: 0.30, rho: 7850, alpha: 12e-6, q: ['ECAPP', 'BFS'] },
    edelstahl: { E: 200000, G: 76900, nu: 0.30, rho: 7900, alpha: 16e-6, q: ['SCI413', 'TYLEK'] },
    alu:       { E:  70000, G: 27000, nu: 0.30, rho: 2700, alpha: 23e-6, q: ['DGEC9', 'TALAT'] }
  };

  /* Baustahl: zwei Dickenstufen nach EN 1993-1-1 Tab. 3.1 (vereinfacht).
     S355 fu = 490 (Berichtigung AC:2009 — 510 nur als dokumentierte Alt-Option). */
  var STAHL = [
    { code: 'S235', gruppe: 'stahl', norm: 'EN 10025-2',
      stufen: [ { tmax: 40, fy: 235, fu: 360 }, { tmax: 80, fy: 215, fu: 360 } ],
      q: ['ECAPP', 'BFS'] },
    { code: 'S275', gruppe: 'stahl', norm: 'EN 10025-2',
      stufen: [ { tmax: 40, fy: 275, fu: 430 }, { tmax: 80, fy: 255, fu: 410 } ],
      q: ['ECAPP', 'BFS'] },
    { code: 'S355', gruppe: 'stahl', norm: 'EN 10025-2',
      stufen: [ { tmax: 40, fy: 355, fu: 490 }, { tmax: 80, fy: 335, fu: 470 } ],
      alt_fu: { wert: 510, hinweis: 'ec3_11_2005_vor_ac2009' },
      q: ['ECAPP', 'BFS'] },
    { code: 'S420', gruppe: 'stahl', norm: 'EN 10025-3/-4 (N/M)',
      stufen: [ { tmax: 40, fy: 420, fu: 520 }, { tmax: 80, fy: 390, fu: 520 } ],
      q: ['ECAPP', 'BFS'] },
    { code: 'S460', gruppe: 'stahl', norm: 'EN 10025-3/-4/-6',
      stufen: [ { tmax: 40, fy: 460, fu: 540 }, { tmax: 80, fy: 430, fu: 540 } ],
      q: ['ECAPP', 'BFS'] }
  ];

  /* Edelstahl: beta_w = 1,0 fuer ALLE Sorten. Rm-Baender aus EN 10088 —
     konservativ der untere Bandwert als Default (Blech/Band). */
  var EDELSTAHL = [
    { code: '1.4301', gruppe: 'edelstahl', norm: 'EN 10088-2', kurz: '304',
      stufen: [ { tmax: 999, fy: 215, fu: 500 } ], band_fu: [500, 700],
      beta_w: 1.00, q: ['SCI413', 'TYLEK'] },
    { code: '1.4404', gruppe: 'edelstahl', norm: 'EN 10088-2', kurz: '316L',
      stufen: [ { tmax: 999, fy: 220, fu: 520 } ], band_fu: [520, 670],
      beta_w: 1.00, q: ['SCI413', 'TYLEK'] },
    { code: '1.4571', gruppe: 'edelstahl', norm: 'EN 10088-2', kurz: '316Ti',
      stufen: [ { tmax: 999, fy: 220, fu: 520 } ], band_fu: [520, 670],
      beta_w: 1.00, q: ['SCI413', 'TYLEK'] }
  ];

  /* Aluminium: eigener Nachweis ueber f_w (Schweissgut), KEIN beta_w.
     WEZ-Entfestigung ist zwingend auszuweisen.
     rho_haz: EN 1999-1-1 Tab. 3.2 ist geschuetzt — freie Sekundaerquellen
     liefern nur Baender. Default = konservativer (unterer) Bandwert,
     luecke-Flag gesetzt, "eigener Wert" moeglich. */
  var ALU = [
    { code: 'AW5083', gruppe: 'alu', norm: 'EN AW-5083 (AlMg4,5Mn0,7)',
      zustaende: [
        { code: 'O_H111', form: 'blech', tmax: 50, fo: 125, fu: 275,
          rho_o: 1.00, rho_u: 1.00, q: ['TALAT', 'DGEC9'] },
        { code: 'F_H112', form: 'strang', tmax: 200, fo: 110, fu: 270,
          rho_o: 1.00, rho_u: 1.00, q: ['TALAT'], luecke: 'nur_eine_quelle' },
        { code: 'H24_H34', form: 'blech', tmax: 25, fo: 250, fu: 340,
          rho_o: 0.40, rho_u: 0.69, band_rho_o: [0.40, 0.63], band_rho_u: [0.69, 0.81],
          q: ['TALAT', 'CVUT'], luecke: 'rho_haz_nur_band' }
      ],
      fw: { '5356': 240 }, q: ['TALAT', 'CVUT'] },
    { code: 'AW6060', gruppe: 'alu', norm: 'EN AW-6060 (AlMgSi)',
      zustaende: [
        { code: 'T6', form: 'strang', tmax: 999, fo: 160, fu: 215,
          rho_o: 0.41, rho_u: 0.56, band_rho_o: [0.41, 0.58], band_rho_u: [0.56, 0.67],
          q: ['DGEC9', 'TALAT'], luecke: 'rho_haz_nur_band' },
        { code: 'T4', form: 'strang', tmax: 999, fo: 120, fu: 180,
          rho_o: 0.86, rho_u: 0.73, band_rho_o: [0.86, 0.91], band_rho_u: [0.73, 0.83],
          q: ['TALAT'], luecke: 'fo_fu_und_rho_nur_band' }
      ],
      fw: { '5356': 160, '4043A': 150 }, q: ['CVUT'] },
    { code: 'AW6082', gruppe: 'alu', norm: 'EN AW-6082 (AlSi1MgMn)',
      zustaende: [
        { code: 'T6', form: 'blech', tmax: 12.5, fo: 255, fu: 300,
          rho_o: 0.41, rho_u: 0.56, band_rho_o: [0.41, 0.58], band_rho_u: [0.56, 0.67],
          q: ['TALAT', 'DGEC9'], luecke: 'rho_haz_nur_band' },
        { code: 'T6_strang', form: 'strang', tmax: 15, fo: 260, fu: 310,
          rho_o: 0.41, rho_u: 0.56, band_rho_o: [0.41, 0.58], band_rho_u: [0.56, 0.67],
          q: ['TALAT', 'DGEC9'], luecke: 'rho_haz_nur_band' },
        { code: 'T4', form: 'blech', tmax: 12.5, fo: 110, fu: 205,
          rho_o: 0.86, rho_u: 0.73, band_rho_o: [0.86, 0.91], band_rho_u: [0.73, 0.83],
          q: ['TALAT'], luecke: 'rho_haz_nur_band' }
      ],
      fw: { '5356': 210, '4043A': 190 }, q: ['CVUT'] }
  ];

  var WERKSTOFFE = [].concat(STAHL, EDELSTAHL, ALU);

  /* WEZ-Breite b_haz [mm] nach Blechdicke (EN 1999-1-1 §6.1.6.3) */
  var B_HAZ = {
    mig: [ { tmax: 6, b: 20 }, { tmax: 12, b: 30 }, { tmax: 25, b: 35 }, { tmax: 9999, b: 40 } ],
    wig: [ { tmax: 6, b: 30 } ],
    wig_luecke: 'b_haz_wig_nur_bis_6mm',
    faktor_zwischenlage: { basis: 60, teiler_5xxx_6xxx: 120, teiler_7xxx: 80 },
    faktor_waermepfade: { standard: 3 },
    q: ['DGEC9', 'CVUT']
  };

  /* --------------------------------------------------------------------- */
  /* 5) Welt B — klassischer Maschinenbau                                   */
  /* --------------------------------------------------------------------- */

  /* 5a) TABELLENWERTE (massgeblich): zulaessige Spannungen [N/mm²],
         Bewertungsgruppe B, Lastfall ruhend/schwellend/wechselnd.
         Quelle: Decker via schweizer-fn; bestaetigt bei Voigt (HS Anhalt).
         Verfuegbar nur fuer S235 und S355 -> fuer andere Werkstoffe greift
         der Formelweg (5b) mit sichtbarem Luecken-Hinweis.               */
  var WELTB_TABELLE = {
    bewertungsgruppe: 'B',
    lastfaelle: ['ruhend', 'schwellend', 'wechselnd'],
    q: ['DECKER', 'SFN', 'HSA'],
    werte: {
      S235: {
        stumpf_mit_gegenlage:  { normal: [160, 110, 55], schub: [100, 70, 35] },
        stumpf_ohne_gegenlage: { normal: [140,  95, 45], schub: [ 90, 60, 30] },
        kehl_flach:            { normal: [ 90,  60, 30], schub: [ 90, 60, 30] },
        kehl_hohl:             { normal: [120,  75, 40], schub: [120, 75, 40] },
        kehl_doppel_umlaufend: { normal: [140,  90, 50], schub: [140, 90, 50] }
      },
      S355: {
        stumpf_mit_gegenlage:  { normal: [220, 130, 65], schub: [140, 80, 40] },
        stumpf_ohne_gegenlage: { normal: [180, 100, 50], schub: [110, 70, 35] },
        kehl_flach:            { normal: [110,  70, 35], schub: [110, 70, 35] },
        kehl_hohl:             { normal: [150,  90, 45], schub: [150, 90, 45] },
        kehl_doppel_umlaufend: { normal: [190, 120, 55], schub: [190, 120, 55] }
      }
    },
    luecke: 'weltb_tabelle_nur_S235_S355_gruppe_B'
  };

  /* 5b) FORMELWEG: sigma_zul = Re / S * nu
         nu = Nahtguetefaktor (alpha_w nach DIN 18800, Decker) */
  var WELTB_FORMEL = {
    nahtguete: {
      durchgeschweisst_druck:          { nu: 1.00, q: ['DECKER', 'SFN'] },
      durchgeschweisst_zug_geprueft:   { nu: 1.00, q: ['DECKER', 'SFN'] },
      durchgeschweisst_zug_ungeprueft: { nu: 0.95, nu_S355: 0.80, q: ['DECKER', 'SFN'] },
      kehlnaht_allgemein:              { nu: 0.65, q: ['DECKER'], luecke: 'nu_kehl_nur_eine_quelle' }
    },
    sicherheit: {
      staendig:     { S: 1.30, q: ['SFN'] },
      veraenderlich:{ S: 1.50, q: ['SFN', 'HSA'] },
      bereich:      [2.0, 4.0], bereich_q: ['HSA']
    },
    /* Vergleichsspannung Welt B: OHNE Faktor 3 (Maschinenbau-Konvention) */
    vergleichsspannung: { form: 'sqrt(sn^2 + ts^2 + tp^2)', q: ['SFN', 'DSW', 'HSA'] },
    /* Spannungsverhaeltnis R je Lastfall */
    lastfall_R: { ruhend: 1, schwellend: 0, wechselnd: -1, q: ['HSA'] },
    hinweis: 'weltb_kein_verbindliches_regelwerk'
  };

  /* --------------------------------------------------------------------- */
  /* 6) Geometrische Grenzen und Konstruktionsregeln (Kehl-/Stumpfnaht)     */
  /* --------------------------------------------------------------------- */
  var GEOMETRIE = {
    a_min_ec3:        { wert: 3.0, einheit: 'mm', q: ['EC3_18', 'IDEA'] },
    t_min_ec3:        { wert: 4.0, hohlprofil: 2.5, einheit: 'mm', q: ['EC3_18', 'IDEA'] },
    a_min_praxis:     { formel: 'sqrt(t_max) - 0.5', min_ab_t30: 5.0, q: ['BFS', 'DSW'],
                        hinweis: 'nicht_normativ_in_ec3' },
    a_max:            { formel: '0.7 * t_min', q: ['RM', 'DSW'], hinweis: 'nicht_normativ_in_ec3' },
    l_eff:            { formel: 'l - 2*a', q: ['RM', 'SFN'] },
    l_eff_min:        { formel: 'max(6*a, 30)', einheit: 'mm', q: ['RM', 'SFN'] },
    l_voll_wirksam:   { formel: '150 * a', q: ['RM', 'CESTRUCO'] },
    beta_Lw1:         { formel: '1.2 - 0.2*Lj/(150*a)', max: 1.0, q: ['RM', 'CESTRUCO'] },
    beta_Lw2:         { formel: '1.1 - Lw/17', min: 0.6, max: 1.0, q: ['CESTRUCO'],
                        luecke: 'beta_Lw2_nur_eine_quelle' },
    oeffnungswinkel:  { min: 60, max: 120, einheit: 'grad', q: ['RM'],
                        unter_min: 'wie_nicht_durchgeschweisste_stumpfnaht',
                        ueber_max: 'versuchsgestuetzt' },
    a_aus_z:          { formel: 'z / sqrt(2)', q: ['RM', 'DSW'] },
    z_aus_a:          { formel: 'a * sqrt(2)', q: ['RM', 'DSW'] },
    a_ungleichschenklig: { formel: '0.5*sqrt(2)*z_klein', q: ['HSA', 'SFN'] },
    a_teilweise_durchgeschweisst: { formel: 'a_nenn - 2', einheit: 'mm', q: ['CESTRUCO', 'RM'] },
    t_stoss_voll:     { bedingung: 'a1 + a2 >= t UND c <= min(t/5; 3)', q: ['CESTRUCO', 'RM'] },
    einbrand:         { formel: 'a_eff = a + e', bedingung: 'nur_mit_verfahrenspruefung',
                        q: ['RM'], luecke: 'einbrand_nur_eine_quelle' }
  };

  /* --------------------------------------------------------------------- */
  /* 7) Nahtarten und Fugenformen                                           */
  /* --------------------------------------------------------------------- */
  var NAHTARTEN = [
    { code: 'kehl_einseitig',  typ: 'kehl',   durchgeschweisst: false },
    { code: 'kehl_doppel',     typ: 'kehl',   durchgeschweisst: false },
    { code: 'kehl_flanke',     typ: 'kehl',   durchgeschweisst: false },
    { code: 'kehl_stirn',      typ: 'kehl',   durchgeschweisst: false },
    { code: 'kehl_umlaufend',  typ: 'kehl',   durchgeschweisst: false },
    { code: 'stumpf_i',        typ: 'stumpf', durchgeschweisst: true  },
    { code: 'stumpf_v',        typ: 'stumpf', durchgeschweisst: true  },
    { code: 'stumpf_dv',       typ: 'stumpf', durchgeschweisst: true  },
    { code: 'stumpf_hv',       typ: 'stumpf', durchgeschweisst: false },
    { code: 'stumpf_dhv',      typ: 'stumpf', durchgeschweisst: true  },
    { code: 'stumpf_hy',       typ: 'stumpf', durchgeschweisst: false },
    { code: 'stumpf_dhy',      typ: 'stumpf', durchgeschweisst: false }
  ];

  /* --------------------------------------------------------------------- */
  /* Nahtvorbereitung nach EN ISO 9692-1 (N6b)                              */
  /*                                                                        */
  /* winkel / steg / spalt sind die RICHTWERTE und stehen unveraendert wie  */
  /* vor N6b — daran haengt die Volumenrechnung ab N10. Neu sind daneben    */
  /* die BAENDER (…_band = [von, bis]), der Blechdickenbereich, der         */
  /* Ausrundungsradius bei U/J, die Zugaenglichkeit und die empfohlenen     */
  /* Verfahren. Eine Groesse, eine Quelle: der Richtwert steht NICHT ein    */
  /* zweites Mal im Band, er liegt darin.                                   */
  /*                                                                        */
  /* winkel_art: 'alpha' = Oeffnungswinkel der ganzen Fuge (V, X, U),       */
  /*             'beta'  = Flankenwinkel EINER Flanke (HV, K, J, HY),       */
  /*             null    = kein Fugenwinkel (I-Naht, Kehlnaht)              */
  /* seiten:     von wie vielen Seiten geschweisst wird                     */
  /*                                                                        */
  /* Die Werte sind Richtwerte der Norm, KEINE Zusage: die WPS entscheidet. */
  /* --------------------------------------------------------------------- */
  var FUGENFORMEN = {
    stumpf_i:   { winkel: 0,  steg: 0, spalt: 2, t_bis: 4,
                  winkel_art: null, spalt_band: [0, 4], steg_band: null, radius: null,
                  seiten: 1, verfahren: ['ehand', 'mag', 'wig'],
                  q: ['ISO9692', 'ERL'], luecke: 'spalt_richtwert' },
    stumpf_v:   { winkel: 60, steg: 2, spalt: 2, t_von: 3, t_bis: 20,
                  winkel_art: 'alpha', winkel_band: [40, 60], spalt_band: [1, 4],
                  steg_band: [0, 3], radius: null,
                  seiten: 1, verfahren: ['ehand', 'mag', 'wig', 'up'],
                  q: ['ISO9692', 'ERL', 'AZS'] },
    stumpf_dv:  { winkel: 50, steg: 3, spalt: 2, t_von: 12,
                  winkel_art: 'alpha', winkel_band: [40, 60], spalt_band: [1, 4],
                  steg_band: [0, 3], radius: null,
                  seiten: 2, verfahren: ['ehand', 'mag', 'up'],
                  q: ['ISO9692', 'ERL', 'AZS'] },
    stumpf_hv:  { winkel: 50, steg: 2, spalt: 2, t_von: 3, t_bis: 20,
                  winkel_art: 'beta', winkel_band: [35, 60], spalt_band: [1, 4],
                  steg_band: [0, 3], radius: null,
                  seiten: 1, verfahren: ['ehand', 'mag'],
                  q: ['ISO9692', 'ERL'], luecke: 'nur_eine_quelle' },
    stumpf_dhv: { winkel: 50, steg: 2, spalt: 2, t_von: 12,
                  winkel_art: 'beta', winkel_band: [35, 60], spalt_band: [1, 4],
                  steg_band: [0, 3], radius: null,
                  seiten: 2, verfahren: ['ehand', 'mag'],
                  q: ['ISO9692', 'ERL'], luecke: 'nur_eine_quelle' },
    stumpf_y:   { winkel: 60, steg: 3, spalt: 2, t_von: 5, t_bis: 40,
                  winkel_art: 'alpha', winkel_band: [40, 60], spalt_band: [1, 3],
                  steg_band: [2, 4], radius: null,
                  seiten: 1, verfahren: ['ehand', 'mag', 'up'],
                  q: ['ISO9692'] },
    stumpf_dy:  { winkel: 50, steg: 3, spalt: 2, t_von: 16,
                  winkel_art: 'alpha', winkel_band: [40, 60], spalt_band: [1, 3],
                  steg_band: [2, 4], radius: null,
                  seiten: 2, verfahren: ['ehand', 'mag', 'up'],
                  q: ['ISO9692'] },
    stumpf_hy:  { winkel: 50, steg: 3, spalt: 0, t_von: 5, t_bis: 40,
                  winkel_art: 'beta', winkel_band: [35, 60], spalt_band: [0, 3],
                  steg_band: [2, 4], radius: null,
                  seiten: 1, verfahren: ['ehand', 'mag'],
                  q: ['ISO9692', 'ERL'], luecke: 'nur_eine_quelle' },
    stumpf_dhy: { winkel: 50, steg: 3, spalt: 0, t_von: 16,
                  winkel_art: 'beta', winkel_band: [35, 60], spalt_band: [0, 3],
                  steg_band: [2, 4], radius: null,
                  seiten: 2, verfahren: ['ehand', 'mag'],
                  q: ['ISO9692', 'ERL'], luecke: 'nur_eine_quelle' },
    stumpf_u:   { winkel: 10, steg: 2, spalt: 1, t_von: 12,
                  winkel_art: 'beta', winkel_band: [8, 12], spalt_band: [0, 3],
                  steg_band: [1, 3], radius: 6, radius_band: [4, 8],
                  seiten: 1, verfahren: ['ehand', 'mag', 'wig', 'up'],
                  q: ['ISO9692'] },
    stumpf_du:  { winkel: 10, steg: 2, spalt: 1, t_von: 30,
                  winkel_art: 'beta', winkel_band: [8, 12], spalt_band: [0, 3],
                  steg_band: [1, 3], radius: 6, radius_band: [4, 8],
                  seiten: 2, verfahren: ['ehand', 'mag', 'up'],
                  q: ['ISO9692'] },
    stumpf_j:   { winkel: 15, steg: 2, spalt: 1, t_von: 16,
                  winkel_art: 'beta', winkel_band: [10, 20], spalt_band: [0, 3],
                  steg_band: [1, 3], radius: 6, radius_band: [4, 8],
                  seiten: 1, verfahren: ['ehand', 'mag', 'up'],
                  q: ['ISO9692'] },
    stumpf_dj:  { winkel: 15, steg: 2, spalt: 1, t_von: 30,
                  winkel_art: 'beta', winkel_band: [10, 20], spalt_band: [0, 3],
                  steg_band: [1, 3], radius: 6, radius_band: [4, 8],
                  seiten: 2, verfahren: ['ehand', 'mag', 'up'],
                  q: ['ISO9692'] },
    steilflanke_v:  { winkel: 10, steg: 1, spalt: 8, t_von: 12,
                  winkel_art: 'alpha', winkel_band: [6, 15], spalt_band: [6, 12],
                  steg_band: [0, 2], radius: null,
                  seiten: 1, verfahren: ['mag', 'up'],
                  q: ['ISO9692'], luecke: 'nur_eine_quelle' },
    steilflanke_hv: { winkel: 5, steg: 1, spalt: 8, t_von: 12,
                  winkel_art: 'beta', winkel_band: [3, 8], spalt_band: [6, 12],
                  steg_band: [0, 2], radius: null,
                  seiten: 1, verfahren: ['mag', 'up'],
                  q: ['ISO9692'], luecke: 'nur_eine_quelle' },
    kehl:       { winkel: 90, steg: 0, spalt: 0,
                  winkel_art: null, winkel_band: [70, 100], spalt_band: [0, 2],
                  steg_band: null, radius: null,
                  seiten: 1, verfahren: ['ehand', 'mag', 'mig', 'wig', 'up'],
                  q: ['ISO9692', 'EC3_18'] }
  };

  var STOSSARTEN = [
    { code: 'stumpfstoss' }, { code: 't_stoss' }, { code: 'kreuzstoss' },
    { code: 'eckstoss' },    { code: 'ueberlappstoss' }
  ];

  /* --------------------------------------------------------------------- */
  /* 8) Schweissverfahren (Prozesskennzahl EN ISO 4063)                     */
  /*    k  = thermischer Wirkungsgrad (EN 1011-1)                           */
  /*    eta_A = Ausbringungsgrad · DR = Abschmelzleistung [kg/h]            */
  /* --------------------------------------------------------------------- */
  var VERFAHREN = [
    { code: 'mag',   nr: 135, k: 0.80, k_q: ['EN1011_1', 'AZS'],
      eta_A: 0.95, eta_band: [0.92, 0.98], eta_q: ['FAB', 'MATW'],
      dr: 4.0, dr_band: [1.0, 6.0], dr_q: ['FAB', 'MATW'],
      werkstoffe: ['stahl', 'edelstahl'] },
    { code: 'mig',   nr: 131, k: 0.80, k_q: ['EN1011_1', 'AZS'],
      eta_A: 0.96, eta_band: [0.92, 0.98], eta_q: ['FAB', 'MATW'],
      dr: 3.5, dr_band: [1.0, 6.0], dr_q: ['FAB', 'MATW'],
      werkstoffe: ['alu', 'edelstahl'] },
    { code: 'wig',   nr: 141, k: 0.60, k_q: ['EN1011_1', 'AZS'],
      eta_A: 0.97, eta_band: [0.95, 0.99], eta_q: ['FAB', 'MATW'],
      dr: 0.6, dr_band: [0.3, 1.4], dr_q: ['FAB', 'MATW'],
      werkstoffe: ['stahl', 'edelstahl', 'alu'] },
    { code: 'ehand', nr: 111, k: 0.80, k_q: ['EN1011_1', 'AZS'],
      eta_A: 0.65, eta_band: [0.60, 0.70], eta_q: ['FAB', 'MATW'],
      dr: 1.5, dr_band: [0.4, 2.5], dr_q: ['FAB', 'MATW'],
      werkstoffe: ['stahl', 'edelstahl'] },
    { code: 'up',    nr: 121, k: 1.00, k_q: ['EN1011_1', 'AZS'],
      eta_A: 0.99, eta_band: [0.98, 1.00], eta_q: ['FAB', 'MATW'],
      dr: 12.0, dr_band: [10.0, 20.0], dr_q: ['FAB', 'MATW'],
      werkstoffe: ['stahl'] }
  ];

  /* Nahtfaktoren F2/F3 fuer t8/5 (Daten fuer N9 — hier nur abgelegt) */
  var NAHTFAKTOREN = {
    auftragraupe:       { F3: 1.00, F2: 1.00, q: ['ERL', 'AZS'] },
    kehl_t_kreuz_1_2:   { F3: 0.67, F2: 0.55, band_F2: [0.45, 0.67], q: ['ERL', 'AZS'] },
    kehl_t_kreuz_3_4:   { F3: 0.67, F2: 0.50, band_F2: [0.30, 0.67], q: ['ERL', 'AZS'] },
    kehl_eckstoss:      { F3: 0.67, F2: 0.90, q: ['ERL', 'AZS'] },
    kehl_ueberlapp:     { F3: 0.67, F2: 0.70, q: ['ERL', 'AZS'] },
    v_wurzel:           { F3: 1.10, band_F3: [1.00, 1.20], F2: 1.00, q: ['ERL', 'AZS'] },
    dv_wurzel:          { F3: 0.70, F2: 1.00, q: ['ERL', 'AZS'] },
    v_dv_mittellagen:   { F3: 0.90, band_F3: [0.80, 1.00], F2: 1.00, q: ['ERL', 'AZS'] },
    v_dv_decklagen:     { F3: 0.95, band_F3: [0.90, 1.00], F2: 1.00, q: ['ERL', 'AZS'] },
    i_naht_gegenlage:   { F2: 1.00, q: ['ERL', 'AZS'], luecke: 'F3_nicht_definiert' }
  };

  /* --------------------------------------------------------------------- */
  /* 9) Ausfuehrung & Dokumentation — NICHT rechenwirksam                   */
  /* --------------------------------------------------------------------- */
  var ISO5817 = [
    { code: 'B', rang: 3, rechenwirksam: false, ermuedungsrelevant: true, q: ['ISO5817', 'SFN'] },
    { code: 'C', rang: 2, rechenwirksam: false, ermuedungsrelevant: true, q: ['ISO5817', 'SFN'] },
    { code: 'D', rang: 1, rechenwirksam: false, ermuedungsrelevant: true, q: ['ISO5817', 'SFN'] }
  ];

  var EXC = [
    { code: 'EXC1', rang: 1, rechenwirksam: false, q: ['EN1090'] },
    { code: 'EXC2', rang: 2, rechenwirksam: false, q: ['EN1090'] },
    { code: 'EXC3', rang: 3, rechenwirksam: false, q: ['EN1090'] },
    { code: 'EXC4', rang: 4, rechenwirksam: false, q: ['EN1090'] }
  ];

  /* --------------------------------------------------------------------- */
  /* 10) Was der Rechner NICHT prueft (Pflichtausgabe, Abschnitt 2.4)       */
  /* --------------------------------------------------------------------- */
  var NICHT_GEPRUEFT = [
    'grundwerkstoff', 'beulen_stabilitaet', 'verbindungsmittel', 'steifigkeit_verformung',
    'ausfuehrung_aufsicht', 'werkstoffzulassung', 'lastannahmen', 'sproedbruch',
    'anschlusssteifigkeit', 'terrassenbruch',
    /* N5d (Plan 5.1-1): bewusst NICHT aufgenommen, weil es gepflegt werden
       muesste — das Programm ist ein Nachweisprogramm, keine Qualitaets-
       sicherung. Was draussen bleibt, wird BENANNT statt verschwiegen. */
    /* 'nahtvorbereitung' ist mit N6b HERAUSGEFALLEN — nicht umbenannt,
       sondern geschlossen: die Fugenformen nach EN ISO 9692-1 stehen jetzt
       als Tabelle in diesem Modul. Eine Luecke verschwindet nur, wenn sie
       wirklich gefuellt ist. */
    'pruefumfang_zfp', 'toleranzen', 'herstellerqualifikation'
  ];

  /* --------------------------------------------------------------------- */
  /* 11) Zugriffsfunktionen (DOM-frei, mutieren nichts)                     */
  /* --------------------------------------------------------------------- */

  function werkstoff(code) {
    for (var i = 0; i < WERKSTOFFE.length; i++) if (WERKSTOFFE[i].code === code) return WERKSTOFFE[i];
    return null;
  }

  function werkstoffeDerGruppe(gruppe) {
    var r = [];
    for (var i = 0; i < WERKSTOFFE.length; i++) if (WERKSTOFFE[i].gruppe === gruppe) r.push(WERKSTOFFE[i]);
    return r;
  }

  /* Kennwerte je Dicke. Rueckgabe: {fy,fu,stufe,ok,grund} — nie Exception. */
  function kennwerte(code, t, zustandCode) {
    var w = werkstoff(code);
    if (!w) return { ok: false, grund: 'werkstoff_unbekannt' };
    var dicke = (typeof t === 'number' && isFinite(t) && t > 0) ? t : null;

    if (w.gruppe === 'alu') {
      var zs = w.zustaende, z = null, i;
      for (i = 0; i < zs.length; i++) if (zs[i].code === zustandCode) { z = zs[i]; break; }
      if (!z) z = zs[0];
      var ok = (dicke === null) ? true : (dicke <= z.tmax);
      return {
        ok: ok, grund: ok ? null : 'dicke_ausserhalb_zustand',
        gruppe: 'alu', werkstoff: w.code, zustand: z.code,
        fo: z.fo, fu: z.fu, rho_o: z.rho_o, rho_u: z.rho_u,
        band_rho_o: z.band_rho_o || null, band_rho_u: z.band_rho_u || null,
        luecke: z.luecke || null, q: z.q || w.q
      };
    }

    var st = w.stufen, s = null, k;
    for (k = 0; k < st.length; k++) { if (dicke === null || dicke <= st[k].tmax) { s = st[k]; break; } }
    if (!s) return { ok: false, grund: 'dicke_ausserhalb_tabelle', gruppe: w.gruppe, werkstoff: w.code };
    return {
      ok: true, grund: null, gruppe: w.gruppe, werkstoff: w.code,
      fy: s.fy, fu: s.fu, stufe_tmax: s.tmax,
      alt_fu: w.alt_fu || null, band_fu: w.band_fu || null, q: w.q
    };
  }

  /* beta_w — nur Welt A. Alu liefert bewusst null (dort gilt f_w). */
  function betaW(code, regelsatz) {
    var w = werkstoff(code);
    if (!w) return { ok: false, grund: 'werkstoff_unbekannt' };
    if (w.gruppe === 'alu') return { ok: false, grund: 'alu_kein_beta_w', hinweis: 'alu_nachweis_ueber_fw' };
    if (w.gruppe === 'edelstahl') return { ok: true, wert: 1.00, regelsatz: 'ec3_1_4', q: ['EC3_14', 'SCI413'] };
    var rs = BW_REGELSATZ[regelsatz] || BW_REGELSATZ.na_de;
    var v = rs.werte[code];
    if (typeof v !== 'number') return { ok: false, grund: 'kein_beta_w_wert' };
    return { ok: true, wert: v, regelsatz: rs.code, q: rs.q };
  }

  /* f_w Schweissgut (Alu) */
  function fwSchweissgut(code, zusatz) {
    var w = werkstoff(code);
    if (!w || w.gruppe !== 'alu') return { ok: false, grund: 'nur_alu' };
    var v = w.fw ? w.fw[zusatz] : undefined;
    if (typeof v !== 'number') return { ok: false, grund: 'kein_fw_wert', hinweis: 'luecke_fw_kombination' };
    return { ok: true, wert: v, zusatz: zusatz, q: w.q };
  }

  /* b_haz je Verfahren und Dicke */
  function bHaz(verfahren, t) {
    var tab = (verfahren === 'wig') ? B_HAZ.wig : B_HAZ.mig;
    for (var i = 0; i < tab.length; i++) if (t <= tab[i].tmax) return { ok: true, wert: tab[i].b, q: B_HAZ.q };
    if (verfahren === 'wig') return { ok: false, grund: 'b_haz_wig_luecke', luecke: B_HAZ.wig_luecke };
    return { ok: false, grund: 'b_haz_unbestimmt' };
  }

  /* Welt-B-Tabellenwert; liefert ok:false + luecke, wenn nicht tabelliert. */
  function weltBTabelle(code, nahtgruppe, spannungsart, lastfall) {
    var m = WELTB_TABELLE.werte[code];
    if (!m) return { ok: false, grund: 'werkstoff_nicht_tabelliert', luecke: WELTB_TABELLE.luecke };
    var n = m[nahtgruppe];
    if (!n) return { ok: false, grund: 'nahtgruppe_nicht_tabelliert', luecke: WELTB_TABELLE.luecke };
    var idx = WELTB_TABELLE.lastfaelle.indexOf(lastfall);
    var reihe = n[spannungsart];
    if (idx < 0 || !reihe) return { ok: false, grund: 'lastfall_oder_spannungsart_unbekannt' };
    return { ok: true, wert: reihe[idx], bewertungsgruppe: WELTB_TABELLE.bewertungsgruppe, q: WELTB_TABELLE.q };
  }

  /* Nahtvorbereitung zu einer Fugenform. Ist t angegeben, sagt die Antwort
     zusaetzlich, ob die Dicke im Anwendungsbereich der Norm liegt — sie
     rechnet aber nichts nach und verbietet nichts. */
  function nahtvorbereitung(code, t) {
    var f = FUGENFORMEN[code];
    if (!f) return { ok: false, grund: 'fugenform_unbekannt', code: code || null };
    var dicke = (typeof t === 'number' && isFinite(t) && t > 0) ? t : null;
    var unten = (typeof f.t_von === 'number') ? f.t_von : null;
    var oben = (typeof f.t_bis === 'number') ? f.t_bis : null;
    var drin = null;
    if (dicke !== null) {
      drin = true;
      if (unten !== null && dicke < unten) drin = false;
      if (oben !== null && dicke > oben) drin = false;
    }
    return {
      ok: true, grund: null, code: code,
      winkel: f.winkel, winkel_art: f.winkel_art || null,
      winkel_band: f.winkel_band ? f.winkel_band.slice() : null,
      spalt: f.spalt, spalt_band: f.spalt_band ? f.spalt_band.slice() : null,
      steg: f.steg, steg_band: f.steg_band ? f.steg_band.slice() : null,
      radius: (typeof f.radius === 'number') ? f.radius : null,
      radius_band: f.radius_band ? f.radius_band.slice() : null,
      t_von: unten, t_bis: oben, t: dicke, im_bereich: drin,
      seiten: f.seiten, verfahren: f.verfahren.slice(),
      q: f.q.slice(), luecke: f.luecke || null
    };
  }

  function fugenformen() {
    var r = [], k;
    for (k in FUGENFORMEN) if (Object.prototype.hasOwnProperty.call(FUGENFORMEN, k)) r.push(k);
    return r;
  }

  function verfahren(code) {
    for (var i = 0; i < VERFAHREN.length; i++) if (VERFAHREN[i].code === code) return VERFAHREN[i];
    return null;
  }

  /* Alle Codes einer Kategorie — Grundlage fuer i18n-Paritaetstest */
  function alleCodes() {
    var c = { werkstoff: [], nahtart: [], stossart: [], verfahren: [], iso5817: [], exc: [], zustand: [] };
    var i;
    for (i = 0; i < WERKSTOFFE.length; i++) {
      c.werkstoff.push(WERKSTOFFE[i].code);
      if (WERKSTOFFE[i].zustaende) {
        for (var j = 0; j < WERKSTOFFE[i].zustaende.length; j++) {
          var zc = WERKSTOFFE[i].zustaende[j].code;
          if (c.zustand.indexOf(zc) < 0) c.zustand.push(zc);
        }
      }
    }
    for (i = 0; i < NAHTARTEN.length; i++)  c.nahtart.push(NAHTARTEN[i].code);
    for (i = 0; i < STOSSARTEN.length; i++) c.stossart.push(STOSSARTEN[i].code);
    for (i = 0; i < VERFAHREN.length; i++)  c.verfahren.push(VERFAHREN[i].code);
    for (i = 0; i < ISO5817.length; i++)    c.iso5817.push(ISO5817[i].code);
    for (i = 0; i < EXC.length; i++)        c.exc.push(EXC[i].code);
    return c;
  }

  /* Sammelt alle Werte mit luecke-Flag — fuer die ehrliche Luecken-Anzeige. */
  function luecken() {
    var out = [];
    function scan(obj, pfad) {
      if (!obj || typeof obj !== 'object') return;
      if (Object.prototype.hasOwnProperty.call(obj, 'luecke') && obj.luecke) {
        out.push({ pfad: pfad, code: obj.luecke });
      }
      for (var k in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        if (k === 'luecke') continue;
        var v = obj[k];
        if (v && typeof v === 'object') scan(v, pfad ? pfad + '.' + k : k);
      }
    }
    scan({ werkstoffe: WERKSTOFFE, geometrie: GEOMETRIE, weltB_tabelle: WELTB_TABELLE,
           weltB_formel: WELTB_FORMEL, fugenformen: FUGENFORMEN, nahtfaktoren: NAHTFAKTOREN,
           b_haz: B_HAZ }, '');
    return out;
  }

  return {
    VERSION: VERSION,
    QUELLEN: QUELLEN,
    WELTEN: WELTEN,
    BEIWERTE: BEIWERTE,
    BW_REGELSATZ: BW_REGELSATZ,
    PHYSIK: PHYSIK,
    WERKSTOFFE: WERKSTOFFE,
    B_HAZ: B_HAZ,
    WELTB_TABELLE: WELTB_TABELLE,
    WELTB_FORMEL: WELTB_FORMEL,
    GEOMETRIE: GEOMETRIE,
    NAHTARTEN: NAHTARTEN,
    FUGENFORMEN: FUGENFORMEN,
    STOSSARTEN: STOSSARTEN,
    VERFAHREN: VERFAHREN,
    NAHTFAKTOREN: NAHTFAKTOREN,
    ISO5817: ISO5817,
    EXC: EXC,
    NICHT_GEPRUEFT: NICHT_GEPRUEFT,
    werkstoff: werkstoff,
    werkstoffeDerGruppe: werkstoffeDerGruppe,
    kennwerte: kennwerte,
    betaW: betaW,
    fwSchweissgut: fwSchweissgut,
    bHaz: bHaz,
    weltBTabelle: weltBTabelle,
    verfahren: verfahren,
    nahtvorbereitung: nahtvorbereitung,
    fugenformen: fugenformen,
    alleCodes: alleCodes,
    luecken: luecken
  };
}));
