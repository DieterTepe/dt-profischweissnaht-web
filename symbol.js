/* ============================================================================
 * DT-ProfiSchweissnaht · symbol.js  (DTNSymbol)
 * Baustein N6b — ZEICHNUNGSSYMBOLE NACH EN ISO 2553 (Schweissnaht-1.md 5.1-2).
 *
 * ETAPPE 1 VON 3: Hier steht bis jetzt NUR DER KATALOG. Gezeichnet wird in
 * Etappe 2 (auf svglib.js aus N2c, die dabei unveraendert bleibt), angebunden
 * in Etappe 3.
 *
 * DIE EHRLICHE KERNAUSSAGE DIESES MODULS:
 * Der Katalog kann MEHR ZEICHNEN, ALS DAS PROGRAMM RECHNEN KANN. Punkt-,
 * Rollen-, Loch- und Boerdelnaht, Auftragschweissung, U- und J-Fugen — sie
 * gehoeren auf jede Zeichnung, aber sie haben in diesem Programm keinen
 * Nachweis. Jeder Eintrag traegt deshalb `naht`: entweder die Kennung der
 * rechenbaren Nahtart aus daten.js — oder ausdruecklich `null`. Ein Symbol
 * ohne Rechenpartner wird gezeichnet UND DABEI BENANNT: zeichenbar, nicht
 * nachweisbar. Ein Symbol, das aussieht, als wuerde es mitgerechnet, waere
 * genau die stille Luege, die dieses Programm nicht baut.
 *
 * KEIN TEXT IM SVG (4.3) — auch hier nicht: der Katalog fuehrt sprachneutrale
 * Codes, beschriftet wird ueber i18n_kern.js (`sym_*`, `fug_*`, `mass_*`).
 *
 * DOM-frei · UMD/IIFE · keine Abhaengigkeiten · deterministisch.
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNSymbol = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NAME = 'symbol';
  var VERSION = '0.1.0-N6b';

  /* --------------------------------------------------------------------- */
  /* FELDER JE EINTRAG                                                      */
  /*                                                                        */
  /* code         sprachneutrale Kennung (i18n-Schluessel `sym_<code>`)     */
  /* art          'grund'  = Grundsymbol (die Naht selbst)                  */
  /*              'zusatz' = Zusatzzeichen (Oberflaeche, Wurzel, Sicherung) */
  /*              'lage'   = Angabe an der Pfeillinie (Rundum, Baustelle,   */
  /*                         Gabel)                                          */
  /* seite        'pfeil' = einseitig · 'beide' = symmetrisch (Doppelnaht)  */
  /*              null    = seitenlos (Zusatzzeichen, Lageangaben)          */
  /* vorbereitung Kennung in DTNData.FUGENFORMEN — oder null, wenn die Naht */
  /*              keine Fugenvorbereitung hat (Punkt, Rollen, Loch, Auftrag) */
  /* naht         Kennung in DTNData.NAHTARTEN — oder null: DANN IST SIE    */
  /*              ZEICHENBAR, ABER NICHT NACHWEISBAR                        */
  /* naht_auch    weitere rechenbare Nahtarten, die DASSELBE Symbol tragen  */
  /*              (Flanken-, Stirn- und umlaufende Kehlnaht sind zeichnerisch */
  /*              dieselbe Kehlnaht — die Lage steckt in der Zeichnung, nicht */
  /*              im Symbol)                                                 */
  /* masse        welche Bemassung an diesem Symbol ueberhaupt sinnvoll ist */
  /* q            Quellen                                                    */
  /* --------------------------------------------------------------------- */

  var MASSE = ['a', 'z', 's', 'l', 'n', 'e', 'd', 'b'];

  var KATALOG = [
    /* ---- Grundsymbole: Stumpfnaehte ohne Steg --------------------------- */
    { code: 'i_naht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'stumpf_i', naht: 'stumpf_i', naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'v_naht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'stumpf_v', naht: 'stumpf_v', naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'x_naht', art: 'grund', seite: 'beide',
      vorbereitung: 'stumpf_dv', naht: 'stumpf_dv', naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'hv_naht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'stumpf_hv', naht: 'stumpf_hv', naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'k_naht', art: 'grund', seite: 'beide',
      vorbereitung: 'stumpf_dhv', naht: 'stumpf_dhv', naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },

    /* ---- Grundsymbole: Stumpfnaehte mit Steg ---------------------------- */
    /* Y und DY haben in diesem Programm KEINEN Nachweis — sie sind nicht
       durchgeschweisst und stehen nicht in NAHTARTEN. Zeichenbar, nicht
       nachweisbar. */
    { code: 'y_naht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'stumpf_y', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'dy_naht', art: 'grund', seite: 'beide',
      vorbereitung: 'stumpf_dy', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'hy_naht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'stumpf_hy', naht: 'stumpf_hy', naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'dhy_naht', art: 'grund', seite: 'beide',
      vorbereitung: 'stumpf_dhy', naht: 'stumpf_dhy', naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },

    /* ---- Grundsymbole: U- und J-Fugen ----------------------------------- */
    { code: 'u_naht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'stumpf_u', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'du_naht', art: 'grund', seite: 'beide',
      vorbereitung: 'stumpf_du', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'j_naht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'stumpf_j', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'dj_naht', art: 'grund', seite: 'beide',
      vorbereitung: 'stumpf_dj', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },

    /* ---- Grundsymbole: Steilflankennaehte ------------------------------- */
    { code: 'steilflanke_v', art: 'grund', seite: 'pfeil',
      vorbereitung: 'steilflanke_v', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },
    { code: 'steilflanke_hv', art: 'grund', seite: 'pfeil',
      vorbereitung: 'steilflanke_hv', naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553', 'ISO9692'] },

    /* ---- Grundsymbole: Kehlnaehte --------------------------------------- */
    /* Flanken-, Stirn- und umlaufende Kehlnaht sind ZEICHNERISCH dieselbe
       Kehlnaht — die Lage steckt in der Zeichnung, die Umlaufigkeit im
       Zusatzzeichen 'rundum'. Deshalb naht_auch statt eigener Eintraege. */
    { code: 'kehlnaht', art: 'grund', seite: 'pfeil',
      vorbereitung: 'kehl', naht: 'kehl_einseitig',
      naht_auch: ['kehl_flanke', 'kehl_stirn', 'kehl_umlaufend'],
      masse: ['a', 'z', 'l', 'n', 'e'], q: ['ISO2553', 'EC3_18'] },
    { code: 'doppelkehlnaht', art: 'grund', seite: 'beide',
      vorbereitung: 'kehl', naht: 'kehl_doppel', naht_auch: [],
      masse: ['a', 'z', 'l', 'n', 'e'], q: ['ISO2553', 'EC3_18'] },

    /* ---- Grundsymbole ohne Nachweis in diesem Programm ------------------ */
    { code: 'lochnaht', art: 'grund', seite: 'pfeil',
      vorbereitung: null, naht: null, naht_auch: [],
      masse: ['l', 'b', 'n', 'e'], q: ['ISO2553'] },
    { code: 'punktnaht', art: 'grund', seite: 'pfeil',
      vorbereitung: null, naht: null, naht_auch: [],
      masse: ['d', 'n', 'e'], q: ['ISO2553'] },
    { code: 'rollennaht', art: 'grund', seite: 'pfeil',
      vorbereitung: null, naht: null, naht_auch: [],
      masse: ['l', 'b', 'n', 'e'], q: ['ISO2553'] },
    { code: 'boerdelnaht', art: 'grund', seite: 'pfeil',
      vorbereitung: null, naht: null, naht_auch: [],
      masse: ['s', 'l'], q: ['ISO2553'] },
    { code: 'auftragschweissung', art: 'grund', seite: 'pfeil',
      vorbereitung: null, naht: null, naht_auch: [],
      masse: ['l', 'b'], q: ['ISO2553'] },
    { code: 'gegenlage', art: 'grund', seite: 'gegen',
      vorbereitung: null, naht: null, naht_auch: [],
      masse: ['s'], q: ['ISO2553'] },

    /* ---- Zusatzzeichen: Oberflaeche und Wurzel -------------------------- */
    { code: 'flach', art: 'zusatz', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553'] },
    { code: 'gewoelbt', art: 'zusatz', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553'] },
    { code: 'hohl', art: 'zusatz', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553'] },
    { code: 'kerbfrei', art: 'zusatz', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553', 'EC3_19'] },
    { code: 'badsicherung_bleibend', art: 'zusatz', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553'] },
    { code: 'badsicherung_entfernbar', art: 'zusatz', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553'] },

    /* ---- Angaben an der Pfeillinie -------------------------------------- */
    { code: 'rundum', art: 'lage', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553'] },
    { code: 'baustelle', art: 'lage', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553'] },
    { code: 'gabel', art: 'lage', seite: null,
      vorbereitung: null, naht: null, naht_auch: [], masse: [], q: ['ISO2553', 'ISO4063'] }
  ];

  /* --------------------------------------------------------------------- */
  /* Zugriff                                                                */
  /* --------------------------------------------------------------------- */

  function kopie(e) {
    return {
      code: e.code, art: e.art, seite: e.seite,
      vorbereitung: e.vorbereitung, naht: e.naht,
      naht_auch: e.naht_auch.slice(),
      masse: e.masse.slice(), q: e.q.slice(),
      nachweisbar: e.naht !== null
    };
  }

  function eintrag(code) {
    for (var i = 0; i < KATALOG.length; i++) {
      if (KATALOG[i].code === code) return kopie(KATALOG[i]);
    }
    return null;
  }

  /* Alle Eintraege einer Art ('grund', 'zusatz', 'lage') oder alle. */
  function katalog(art) {
    var r = [];
    for (var i = 0; i < KATALOG.length; i++) {
      if (!art || KATALOG[i].art === art) r.push(kopie(KATALOG[i]));
    }
    return r;
  }

  function codes(art) {
    var r = [], k = katalog(art);
    for (var i = 0; i < k.length; i++) r.push(k[i].code);
    return r;
  }

  /* Welches Symbol gehoert zu einer rechenbaren Nahtart? */
  function fuerNahtart(nahtCode) {
    if (!nahtCode) return null;
    for (var i = 0; i < KATALOG.length; i++) {
      var e = KATALOG[i];
      if (e.naht === nahtCode) return kopie(e);
      for (var j = 0; j < e.naht_auch.length; j++) {
        if (e.naht_auch[j] === nahtCode) return kopie(e);
      }
    }
    return null;
  }

  /* Die ehrliche Liste: Grundsymbole, die gezeichnet, aber nicht
     nachgewiesen werden koennen. */
  function ohneNachweis() {
    var r = [];
    for (var i = 0; i < KATALOG.length; i++) {
      if (KATALOG[i].art === 'grund' && KATALOG[i].naht === null) r.push(KATALOG[i].code);
    }
    return r;
  }

  function hatMass(code, mass) {
    var e = eintrag(code);
    if (!e) return false;
    for (var i = 0; i < e.masse.length; i++) if (e.masse[i] === mass) return true;
    return false;
  }

  /* ===================================================================== */
  /* ZEICHNEN (Etappe 2)                                                    */
  /*                                                                        */
  /* AUFBAU DER ANGABE nach EN ISO 2553:                                    */
  /*   Pfeillinie -> Knick -> waagerechte Bezugslinie.                      */
  /*   Das Symbol der PFEILSEITE sitzt an der durchgezogenen Bezugslinie    */
  /*   (hier nach UNTEN gezeichnet), das Symbol der GEGENSEITE an der       */
  /*   gestrichelten Identifikationslinie (nach OBEN). Bei symmetrischen    */
  /*   Naehten (X, K, DY, DHY, DU, DJ, Doppelkehlnaht) entfaellt die        */
  /*   gestrichelte Linie und dasselbe Symbol steht auf beiden Seiten.      */
  /*   Diese Festlegung wird als Legendencode ausgegeben, damit sie nicht   */
  /*   stillschweigend gilt.                                                */
  /*                                                                        */
  /* KEIN TEXT IM SVG: Zahlen (a, z, s, l, n, e) und Buchstaben (M, MR,     */
  /*   Verfahren an der Gabel) stehen NICHT im Bild. Sie kommen als         */
  /*   `bemassung[]` bzw. `legende[]` heraus und werden in der HTML         */
  /*   gesetzt — sonst waeren sie nicht uebersetzbar.                       */
  /* ===================================================================== */

  var CODES = [
    'msg_symbol_leer', 'msg_symbol_keine_svglib', 'msg_symbol_kein_grundsymbol',
    'msg_symbol_nicht_nachweisbar', 'msg_symbol_mass_ungueltig',
    'msg_symbol_buchstaben_in_legende', 'msg_symbol_seitenregel',
    'msg_symbol_gegenseite_symmetrisch'
  ];

  /* Bauplatz in Symboleinheiten (nicht mm des Bauteils!) */
  var L_PFEIL_Y = 0, L_PFEIL_Z = 0;      /* Pfeilspitze          */
  var L_KNICK_Y = 16, L_LINIE_Z = 12;    /* Knick / Bezugslinie  */
  var L_ENDE_Y = 80;                     /* Ende der Bezugslinie */
  var L_MITTE_Y = 40;                    /* Mitte fuer Symbole   */
  var L_STRICH_Z = 3.0;                  /* Abstand der gestrichelten Linie */

  /* --------------------------------------------------------------------- */
  /* FORMEN — jede in oertlichen Einheiten: Fusslinie bei z = 0, Aufbau     */
  /* nach +z. Gespiegelt wird beim Setzen, nicht hier.                      */
  /* Nur einseitige Formen: die Doppelnaehte entstehen durch Spiegeln.      */
  /* --------------------------------------------------------------------- */
  function P(y, z) { return { y: y, z: z }; }

  var FORMEN = {
    i_naht:          [{ t: 'poly', p: [P(-2, 0), P(-2, 8)] }, { t: 'poly', p: [P(2, 0), P(2, 8)] }],
    v_naht:          [{ t: 'poly', p: [P(-4, 8), P(0, 0), P(4, 8)] }],
    hv_naht:         [{ t: 'poly', p: [P(-2, 0), P(-2, 8)] }, { t: 'poly', p: [P(-2, 0), P(2, 8)] }],
    y_naht:          [{ t: 'poly', p: [P(-4, 8), P(0, 2.5), P(4, 8)] }, { t: 'poly', p: [P(0, 2.5), P(0, 0)] }],
    hy_naht:         [{ t: 'poly', p: [P(-2, 0), P(-2, 8)] }, { t: 'poly', p: [P(-2, 2.5), P(2, 8)] }],
    u_naht:          [{ t: 'poly', p: [P(-4, 8), P(-4, 4), P(-3.2, 1.6), P(-1.8, 0.6), P(0, 0.4),
                                        P(1.8, 0.6), P(3.2, 1.6), P(4, 4), P(4, 8)] }],
    j_naht:          [{ t: 'poly', p: [P(-2, 0), P(-2, 8)] },
                      { t: 'poly', p: [P(-2, 0.6), P(0, 0.4), P(1.6, 1.2), P(2.6, 3.4), P(2.8, 8)] }],
    steilflanke_v:   [{ t: 'poly', p: [P(-1.6, 8), P(0, 0), P(1.6, 8)] }],
    steilflanke_hv:  [{ t: 'poly', p: [P(-1, 0), P(-1, 8)] }, { t: 'poly', p: [P(-1, 0), P(1, 8)] }],
    kehlnaht:        [{ t: 'poly', p: [P(-4, 0), P(-4, 8), P(4, 0)], zu: true }],
    lochnaht:        [{ t: 'rect', y: -5, z: 0, b: 10, h: 5.5 }],
    punktnaht:       [{ t: 'kreis', y: 0, z: 3.4, d: 6.8 }],
    rollennaht:      [{ t: 'rect', y: -5, z: 0, b: 10, h: 5.5 },
                      { t: 'poly', p: [P(-5, 2.75), P(5, 2.75)] }],
    boerdelnaht:     [{ t: 'poly', p: [P(-2, 0), P(-2, 5.5), P(-3.6, 8)] },
                      { t: 'poly', p: [P(2, 0), P(2, 5.5), P(3.6, 8)] }],
    auftragschweissung: [{ t: 'poly', p: [P(-5, 0), P(-4.4, 2.4), P(-3, 3.8), P(-1.4, 4.2),
                                          P(0.2, 3.8), P(1.6, 2.4), P(2.2, 0)] },
                         { t: 'poly', p: [P(2.2, 0), P(2.8, 2.4), P(4.2, 3.8), P(5.8, 4.2),
                                          P(7.4, 3.8), P(8.8, 2.4), P(9.4, 0)] }],
    gegenlage:       [{ t: 'poly', p: [P(-4, 0), P(-3.6, 2.2), P(-2.4, 3.6), P(-0.8, 4.2), P(0.8, 4.2),
                                        P(2.4, 3.6), P(3.6, 2.2), P(4, 0)] }],

    /* Zusatzzeichen — sitzen AUF dem Grundsymbol, Fusslinie bei dessen Kopf */
    flach:           [{ t: 'poly', p: [P(-5, 0), P(5, 0)] }],
    gewoelbt:        [{ t: 'poly', p: [P(-5, 0), P(-3.4, 1.6), P(-1.2, 2.4), P(1.2, 2.4),
                                        P(3.4, 1.6), P(5, 0)] }],
    hohl:            [{ t: 'poly', p: [P(-5, 2.4), P(-3.4, 0.8), P(-1.2, 0), P(1.2, 0),
                                        P(3.4, 0.8), P(5, 2.4)] }],
    kerbfrei:        [{ t: 'poly', p: [P(-5, 2.6), P(-3.6, 0.6), P(-1.6, 0), P(1.6, 0),
                                        P(3.6, 0.6), P(5, 2.6)] },
                      { t: 'poly', p: [P(-5, 0), P(5, 0)] }],
    badsicherung_bleibend:   [{ t: 'rect', y: -5, z: 0.6, b: 10, h: 4.4 }],
    badsicherung_entfernbar: [{ t: 'rect', y: -5, z: 0.6, b: 10, h: 4.4 }],

    /* Angaben an der Pfeillinie — oertlich um den Knick bzw. das Linienende */
    rundum:          [{ t: 'kreis', y: 0, z: 0, d: 6 }],
    baustelle:       [{ t: 'poly', p: [P(0, 0), P(0, 11)] },
                      { t: 'poly', p: [P(0, 11), P(6.5, 8.6), P(0, 6.2)], zu: true }],
    gabel:           [{ t: 'poly', p: [P(0, 0), P(7, 3.4)] }, { t: 'poly', p: [P(0, 0), P(7, -3.4)] }]
  };

  /* Die Doppelnaehte haben KEINE eigene Form: sie sind dieselbe Form, nur
     auf beiden Seiten der Bezugslinie. Eine Form, eine Quelle — wer die
     V-Naht aendert, aendert die X-Naht mit. */
  var DOPPEL = {
    x_naht: 'v_naht', k_naht: 'hv_naht', dy_naht: 'y_naht', dhy_naht: 'hy_naht',
    du_naht: 'u_naht', dj_naht: 'j_naht', doppelkehlnaht: 'kehlnaht'
  };

  function formCode(code) { return DOPPEL[code] || code; }
  function form(code) { return FORMEN[formCode(code)] || null; }

  function istLeer(x) { return x === null || x === undefined || x === ''; }
  function zahl(x) { return typeof x === 'number' && isFinite(x); }

  /* Punkte einer gesetzten Form einsammeln — fuer Rahmen und Sicht. */
  function setze(striche, oy, oz, spiegel, punkte) {
    var r = [], i, j, st, p, pp;
    for (i = 0; i < striche.length; i++) {
      st = striche[i];
      if (st.t === 'poly') {
        pp = [];
        for (j = 0; j < st.p.length; j++) {
          p = { y: oy + st.p[j].y, z: oz + spiegel * st.p[j].z };
          pp.push(p); punkte.push(p);
        }
        r.push({ t: 'poly', p: pp, zu: !!st.zu });
      } else if (st.t === 'kreis') {
        p = { y: oy + st.y, z: oz + spiegel * st.z };
        r.push({ t: 'kreis', y: p.y, z: p.z, d: st.d });
        punkte.push({ y: p.y - st.d / 2, z: p.z - st.d / 2 });
        punkte.push({ y: p.y + st.d / 2, z: p.z + st.d / 2 });
      } else if (st.t === 'rect') {
        var z0 = oz + spiegel * st.z, z1 = oz + spiegel * (st.z + st.h);
        var zu = Math.min(z0, z1), zo = Math.max(z0, z1);
        r.push({ t: 'rect', y: oy + st.y, z: zu, b: st.b, h: zo - zu });
        punkte.push({ y: oy + st.y, z: zu });
        punkte.push({ y: oy + st.y + st.b, z: zo });
      }
    }
    return r;
  }

  function male(Svg, v, striche, o) {
    var out = '', i, st;
    for (i = 0; i < striche.length; i++) {
      st = striche[i];
      /* strich = Strichelmuster fuer die Identifikationslinie der Gegenseite */
      if (st.t === 'poly') out += Svg.polylinie(v, st.p, { farbe: o.farbe, breite: o.breite, code: o.code, strich: o.strich, geschlossen: st.zu, fuellung: st.zu ? o.farbe : 'none' });
      else if (st.t === 'kreis') out += Svg.kreis(v, st.y, st.z, st.d, { farbe: o.farbe, breite: o.breite, code: o.code, strich: o.strich, fuellung: 'none' });
      else if (st.t === 'rect') out += Svg.rechteck(v, st.y, st.z, st.b, st.h, { farbe: o.farbe, breite: o.breite, code: o.code, strich: o.strich, fuellung: 'none' });
    }
    return out;
  }

  /* --------------------------------------------------------------------- */
  /* zeichne(eingabe)                                                       */
  /* --------------------------------------------------------------------- */
  function zeichne(eingabe, svglib) {
    var e = eingabe || {};
    var Svg = svglib || (typeof self !== 'undefined' ? self.DTNSvgLib : null) ||
              (typeof global !== 'undefined' ? global.DTNSvgLib : null);
    var warn = [], hin = [], leg = [], bem = [], punkte = [], teile = [];

    if (!Svg) return leerErgebnis('msg_symbol_keine_svglib');

    var g = e.grund ? eintrag(e.grund) : null;
    if (!g || g.art !== 'grund') return leerErgebnis('msg_symbol_kein_grundsymbol');

    var gg = e.gegenseite ? eintrag(e.gegenseite) : null;
    if (gg && gg.art !== 'grund') { gg = null; warn.push('msg_symbol_kein_grundsymbol'); }

    var beidseitig = (g.seite === 'beide');
    if (beidseitig && gg) { gg = null; hin.push('msg_symbol_gegenseite_symmetrisch'); }

    var farbe = Svg.PALETTE.neutral;
    var bre = zahl(e.strichbreite) && e.strichbreite > 0 ? e.strichbreite : 1.6;
    var o = { farbe: farbe, breite: bre };

    /* 1) Pfeillinie und Bezugslinie */
    punkte.push(P(L_PFEIL_Y, L_PFEIL_Z), P(L_ENDE_Y, L_LINIE_Z));
    teile.push({ art: 'pfeil', striche: [{ t: 'poly', p: [P(L_PFEIL_Y, L_PFEIL_Z), P(L_KNICK_Y, L_LINIE_Z)] }], code: 'sy_pfeillinie', strich: false });
    teile.push({ art: 'linie', striche: [{ t: 'poly', p: [P(L_KNICK_Y, L_LINIE_Z), P(L_ENDE_Y, L_LINIE_Z)] }], code: 'sy_bezugslinie', strich: false });
    leg.push({ code: 'sy_pfeillinie' });
    leg.push({ code: 'sy_bezugslinie' });

    /* 2) Grundsymbol der Pfeilseite — unter der durchgezogenen Linie */
    teile.push({ art: 'grund', striche: setze(form(g.code), L_MITTE_Y, L_LINIE_Z, -1, punkte), code: 'sy_' + g.code, strich: false });
    leg.push({ code: 'sym_' + g.code, seite: 'pfeil', nachweisbar: g.nachweisbar });
    if (!g.nachweisbar) hin.push('msg_symbol_nicht_nachweisbar');

    /* 3) Gegenseite: symmetrisch gespiegelt ODER eigenes Symbol an der
          gestrichelten Identifikationslinie */
    if (beidseitig) {
      teile.push({ art: 'grund', striche: setze(form(g.code), L_MITTE_Y, L_LINIE_Z, 1, punkte), code: 'sy_' + g.code, strich: false });
      leg.push({ code: 'sym_' + g.code, seite: 'gegen', nachweisbar: g.nachweisbar });
    } else if (gg) {
      var zStrich = L_LINIE_Z + L_STRICH_Z;
      punkte.push(P(L_KNICK_Y, zStrich), P(L_ENDE_Y, zStrich));
      teile.push({ art: 'linie', striche: [{ t: 'poly', p: [P(L_KNICK_Y, zStrich), P(L_ENDE_Y, zStrich)] }], code: 'sy_identlinie', strich: '5 3' });
      teile.push({ art: 'grund', striche: setze(form(gg.code), L_MITTE_Y, zStrich, 1, punkte), code: 'sy_' + gg.code, strich: false });
      leg.push({ code: 'sy_identlinie' });
      leg.push({ code: 'sym_' + gg.code, seite: 'gegen', nachweisbar: gg.nachweisbar });
      if (!gg.nachweisbar) hin.push('msg_symbol_nicht_nachweisbar');
    }
    hin.push('msg_symbol_seitenregel');

    /* 4) Zusatzzeichen — auf dem Kopf des jeweiligen Grundsymbols */
    var zus = zusatzListe(e.zusatz), i, zc;
    for (i = 0; i < zus.length; i++) {
      zc = zus[i];
      teile.push({ art: 'zusatz', striche: setze(form(zc), L_MITTE_Y, L_LINIE_Z - 8.6, -1, punkte), code: 'sy_' + zc, strich: false });
      leg.push({ code: 'sym_' + zc, seite: 'pfeil' });
      if (zc.indexOf('badsicherung') === 0) hin.push('msg_symbol_buchstaben_in_legende');
    }

    /* 5) Angaben an der Pfeillinie */
    if (e.rundum) {
      teile.push({ art: 'lage', striche: setze(form('rundum'), L_KNICK_Y, L_LINIE_Z, 1, punkte), code: 'sy_rundum', strich: false });
      leg.push({ code: 'sym_rundum' });
    }
    if (e.baustelle) {
      teile.push({ art: 'lage', striche: setze(form('baustelle'), L_KNICK_Y, L_LINIE_Z, 1, punkte), code: 'sy_baustelle', strich: false });
      leg.push({ code: 'sym_baustelle' });
    }
    if (e.gabel) {
      teile.push({ art: 'lage', striche: setze(form('gabel'), L_ENDE_Y, L_LINIE_Z, 1, punkte), code: 'sy_gabel', strich: false });
      leg.push({ code: 'sym_gabel' });
      hin.push('msg_symbol_buchstaben_in_legende');
    }

    /* 6) Bemassung — KEINE Zahl ins Bild, nur die Anweisung, wohin sie gehoert */
    var m = e.masse || {}, k;
    for (k in m) {
      if (!Object.prototype.hasOwnProperty.call(m, k)) continue;
      if (istLeer(m[k])) continue;
      if (!hatMass(g.code, k)) { warn.push('msg_symbol_mass_ungueltig'); continue; }
      bem.push({ mass: k, code: 'sym_mass_' + k, wert: m[k],
                 lage: (k === 'a' || k === 'z' || k === 's' || k === 'd') ? 'vor' : 'nach',
                 seite: 'pfeil' });
    }

    /* 7) Malen */
    var box = Svg.box(punkte);
    var v = Svg.sicht(box, { breite: e.breite, hoehe: e.hoehe, rand: zahl(e.rand) ? e.rand : 14 });
    var inhalt = '';
    for (i = 0; i < teile.length; i++) {
      inhalt += male(Svg, v, teile[i].striche,
                     { farbe: farbe, breite: bre, code: teile[i].code,
                       strich: teile[i].strich || null });
    }
    if (e.rahmen) inhalt += Svg.rahmen(v, { code: 'sy_rahmen' });

    return {
      ok: true, svg: Svg.svg(v, inhalt, { klasse: 'symbol', id: g.code }),
      legende: leg, bemassung: bem,
      grund: g.code, gegenseite: gg ? gg.code : (beidseitig ? g.code : null),
      symmetrisch: beidseitig,
      nachweisbar: g.nachweisbar && (!gg || gg.nachweisbar),
      vorbereitung: g.vorbereitung,
      gezeichnet: teile.length, box: box, sicht: v,
      fehler: null, warnungen: warn, hinweise: hin
    };
  }

  function zusatzListe(z) {
    var r = [], i, e;
    if (!z) return r;
    if (typeof z === 'string') z = [z];
    for (i = 0; i < z.length; i++) {
      e = eintrag(z[i]);
      if (e && e.art === 'zusatz' && form(z[i])) r.push(z[i]);
    }
    return r;
  }

  function leerErgebnis(grund) {
    return {
      ok: false, svg: '', legende: [], bemassung: [],
      grund: null, gegenseite: null, symmetrisch: false, nachweisbar: false,
      vorbereitung: null, gezeichnet: 0, box: null, sicht: null,
      fehler: grund, warnungen: [], hinweise: []
    };
  }

  /* Zeichnet das Symbol, das zu einer rechenbaren Nahtart gehoert. */
  function ausNahtart(nahtCode, opt, svglib) {
    var e = fuerNahtart(nahtCode);
    if (!e) return leerErgebnis('msg_symbol_kein_grundsymbol');
    var ein = {}, k;
    for (k in (opt || {})) if (Object.prototype.hasOwnProperty.call(opt, k)) ein[k] = opt[k];
    ein.grund = e.code;
    if (nahtCode === 'kehl_umlaufend') ein.rundum = true;
    return zeichne(ein, svglib);
  }

  return {
    NAME: NAME, VERSION: VERSION,
    KATALOG: KATALOG, MASSE: MASSE, CODES: CODES, FORMEN: FORMEN, DOPPEL: DOPPEL,
    eintrag: eintrag, katalog: katalog, codes: codes,
    fuerNahtart: fuerNahtart, ohneNachweis: ohneNachweis, hatMass: hatMass,
    zeichne: zeichne, ausNahtart: ausNahtart, formCode: formCode
  };
}));
