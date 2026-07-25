/* ============================================================================
 * DT-ProfiSchweissnaht · profil.js  (DTNProfil)
 * Baustein N2b — PROFILEINGABE. Profiltyp + Masse + Kantenauswahl -> Segmente.
 *
 * GRUNDSATZ (Schweissnaht-1.md 2.2b): Aus einem Profil kommt nicht EINE Zahl
 * Nahtlaenge, sondern das GANZE Nahtbild. Fuer Zug reicht die Laenge, fuer
 * Biegung und Torsion entscheidet die LAGE der Segmente (Iy, Iz, Ip).
 *
 * SCHICHTUNG (bindend):
 *   profil.js  = alles Fachliche: Kantenauswahl, Endkraterabzug, Eckradien,
 *                unterschiedliche a-Masse je Segment (Steg/Flansch).
 *   naht.js    = bleibt dumm und rechnet nur Querschnittswerte.
 *
 * RAUPENMODELL (der Kern dieses Moduls):
 *   Eine Kantenauswahl erzeugt eine oder mehrere SCHWEISSRAUPEN. Jede Raupe
 *   ist entweder umlaufend (geschlossen) oder offen. Der Endkraterabzug wird
 *   je FREIEM ENDE einer Raupe abgezogen (a am Anfang, a am Ende = 2*a je
 *   offener Raupe) — NICHT je Segment. Innere Stossstellen einer Raupe sind
 *   keine Endkrater. Bei umlaufender Naht entfaellt der Abzug vollstaendig.
 *   Abgezogen wird geometrisch: der Anfangs- bzw. Endpunkt wandert um a nach
 *   innen. Damit stimmt nicht nur die Laenge, sondern auch die LAGE.
 *
 * ECKRADIEN (Hohlprofil): sie verkuerzen die geraden Segmente. Der Bogen wird
 *   BEWUSST NICHT mitgerechnet — in der Ecke entsteht keine saubere Kehlnaht
 *   mit dem angegebenen a-Mass. Die Naht laeuft dort trotzdem durch, deshalb
 *   bleibt die Raupe umlaufend (kein Endkraterabzug) und deshalb gilt der
 *   Hinweis des Nahtbild-Kerns auf ein "offenes Nahtbild" hier NICHT.
 *   Der nicht angerechnete Bogenanteil wird als Zahl ausgewiesen.
 *
 * KOORDINATEN wie in naht.js: y waagerecht (Breite b), z senkrecht (Hoehe h),
 *   alles in mm, das Profil liegt mittig um den Ursprung (Bounding-Box).
 *   Alle Masse sind AUSSENMASSE, die Naht liegt auf der Aussenkontur.
 *
 * DOM-frei · UMD/IIFE · deterministisch · mutiert seine Eingaben nicht.
 * Sprachneutrale Codes; jeder Text lebt im i18n-Woerterbuch.
 * ========================================================================== */
(function (root, factory) {
  var api = factory(
    (typeof require === 'function' && typeof module === 'object') ? require('./naht.js') : root.DTNNaht
  );
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNProfil = api;
}(typeof self !== 'undefined' ? self : this, function (Naht) {
  'use strict';

  var VERSION = '0.1.0-N2b';
  var TOL = 1e-6;

  /* Die 7 parametrischen Profile der Stufe 1 (2.2b). */
  var PROFILE = ['blech', 'rohr_rechteck', 'rohr_rund', 'i_profil', 'u_profil', 'winkel', 'vollrund'];

  /* Kantenauswahl — eigene Pflichtabfrage, wichtiger als das Profil selbst. */
  var KANTEN = ['rundum', 'flanken', 'stirn', 'eine_flanke', 'flansche', 'steg', 'flansche_steg'];

  var KANTEN_JE_PROFIL = {
    blech:         ['rundum', 'flanken', 'stirn', 'eine_flanke'],
    rohr_rechteck: ['rundum', 'flanken', 'stirn'],
    rohr_rund:     ['rundum'],
    i_profil:      ['rundum', 'flansche', 'steg', 'flansche_steg'],
    u_profil:      ['rundum', 'flansche', 'steg', 'flansche_steg'],
    winkel:        ['rundum', 'flanken'],
    vollrund:      ['rundum']
  };

  /* Welche Masse ein Profil braucht. pflicht = ohne diesen Wert geht nichts. */
  var MASSE_JE_PROFIL = {
    blech:         [{ code: 'b', pflicht: true }, { code: 't1', pflicht: true }],
    rohr_rechteck: [{ code: 'b', pflicht: true }, { code: 'h', pflicht: true },
                    { code: 't1', pflicht: true }, { code: 'r_ecke', pflicht: false }],
    rohr_rund:     [{ code: 'd', pflicht: true }, { code: 't1', pflicht: true }],
    i_profil:      [{ code: 'b', pflicht: true }, { code: 'h', pflicht: true },
                    { code: 'tw', pflicht: true }, { code: 'tf', pflicht: true }],
    u_profil:      [{ code: 'b', pflicht: true }, { code: 'h', pflicht: true },
                    { code: 'tw', pflicht: true }, { code: 'tf', pflicht: true }],
    winkel:        [{ code: 'b', pflicht: true }, { code: 'h', pflicht: true },
                    { code: 't1', pflicht: true }],
    vollrund:      [{ code: 'd', pflicht: true }]
  };

  /* Segmentgruppen — Herkunft jedes Segments. schaubild.js (N2c) faerbt
     danach ein, rechenweg.js (N4) gruppiert die Segmenttabelle danach. */
  var SEGMENTGRUPPEN = ['flanke', 'stirn', 'flansch', 'steg', 'kante', 'kreis'];

  /* Alle Meldungscodes, die dieses Modul selbst erzeugen kann.
     Weitergereichte Codes des Nahtbild-Kerns stehen in DTNNaht.CODES. */
  var CODES = [
    /* Fehler */
    'msg_profil_fehlt',
    'msg_profil_unbekannt',
    'msg_kanten_fehlt',
    'msg_kanten_unpassend',
    'msg_mass_fehlt',
    'msg_mass_tf_zu_gross',
    'msg_mass_tw_zu_gross',
    'msg_mass_r_zu_gross',
    'msg_mass_t_zu_gross',
    'msg_profil_a_fehlt',
    'msg_endkrater_zu_lang',
    /* Hinweise und Warnungen */
    'msg_endkrater_abzug',
    'msg_endkrater_umlaufend',
    'msg_endkrater_aus',
    'msg_eckradius_verkuerzt',
    'msg_eckluecke_keine_offene_naht',
    'msg_a_je_segment',
    'msg_nur_gewaehlte_kanten',
    'msg_masse_sind_aussenmasse'
  ];

  /* --------------------------------------------------------------------- */
  /* Kleinwerkzeug                                                          */
  /* --------------------------------------------------------------------- */
  function istZahl(x) { return typeof x === 'number' && isFinite(x); }
  function laengeVon(s) {
    var dy = s.y2 - s.y1, dz = s.z2 - s.z1;
    return Math.sqrt(dy * dy + dz * dz);
  }

  /* Internes Segment (noch ohne a-Mass — das wird spaeter zugeordnet). */
  function ln(P, Q, code, gruppe, agrp) {
    return { typ: 'linie', y1: P[0], z1: P[1], y2: Q[0], z2: Q[1],
             code: code, gruppe: gruppe, agrp: agrp || 'basis' };
  }
  function kr(y, z, d, code) {
    return { typ: 'kreis', y: y, z: z, d: d, code: code, gruppe: 'kreis', agrp: 'basis' };
  }
  /* Eine Schweissraupe: Segmente in Laufrichtung + Angabe, ob sie umlaeuft. */
  function raupe(geschlossen, segmente) {
    return { geschlossen: !!geschlossen, seg: segmente };
  }

  function kantenFuer(profil) {
    var l = KANTEN_JE_PROFIL[profil];
    return l ? l.slice() : [];
  }
  function masseFuer(profil) {
    var l = MASSE_JE_PROFIL[profil], r = [], i;
    if (!l) return r;
    for (i = 0; i < l.length; i++) r.push({ code: l[i].code, pflicht: l[i].pflicht });
    return r;
  }

  /* --------------------------------------------------------------------- */
  /* Die sieben Profile — je Profil ALLE Kantenauswahlen als Raupenlisten.  */
  /* Reihenfolge der Segmente = Laufrichtung der Raupe (wichtig fuer den    */
  /* Endkraterabzug an den beiden freien Enden).                            */
  /* --------------------------------------------------------------------- */

  /* 1) Blech / Flachstahl: b = Breite, t1 = Dicke. */
  function bauBlech(m) {
    var b = m.b, t = m.t1;
    var A = [-b / 2, -t / 2], B = [b / 2, -t / 2], C = [b / 2, t / 2], D = [-b / 2, t / 2];
    return {
      rundum: [raupe(true, [
        ln(A, B, 'flanke_unten', 'flanke'), ln(B, C, 'stirn_rechts', 'stirn'),
        ln(C, D, 'flanke_oben', 'flanke'), ln(D, A, 'stirn_links', 'stirn')])],
      flanken: [raupe(false, [ln(A, B, 'flanke_unten', 'flanke')]),
                raupe(false, [ln(D, C, 'flanke_oben', 'flanke')])],
      stirn: [raupe(false, [ln(B, C, 'stirn_rechts', 'stirn')]),
              raupe(false, [ln(A, D, 'stirn_links', 'stirn')])],
      eine_flanke: [raupe(false, [ln(A, B, 'flanke_unten', 'flanke')])]
    };
  }

  /* 2) Rechteck-/Quadrat-Hohlprofil: b, h aussen, r_ecke = Eckradius. */
  function bauRohrRechteck(m) {
    var b = m.b, h = m.h, r = m.r_ecke || 0;
    var yl = -b / 2, yr = b / 2, zu = -h / 2, zo = h / 2;
    var uL = [yl + r, zu], uR = [yr - r, zu];       /* unten  */
    var rU = [yr, zu + r], rO = [yr, zo - r];       /* rechts */
    var oR = [yr - r, zo], oL = [yl + r, zo];       /* oben   */
    var lO = [yl, zo - r], lU = [yl, zu + r];       /* links  */
    return {
      rundum: [raupe(true, [
        ln(uL, uR, 'flanke_unten', 'flanke'), ln(rU, rO, 'stirn_rechts', 'stirn'),
        ln(oR, oL, 'flanke_oben', 'flanke'), ln(lO, lU, 'stirn_links', 'stirn')])],
      flanken: [raupe(false, [ln(uL, uR, 'flanke_unten', 'flanke')]),
                raupe(false, [ln(oL, oR, 'flanke_oben', 'flanke')])],
      stirn: [raupe(false, [ln(rU, rO, 'stirn_rechts', 'stirn')]),
              raupe(false, [ln(lU, lO, 'stirn_links', 'stirn')])]
    };
  }

  /* 3) Rundrohr und 7) Vollrund: d = AUSSENdurchmesser, l = pi*d. */
  function bauKreis(m) {
    return { rundum: [raupe(true, [kr(0, 0, m.d, 'kreisnaht')])] };
  }

  /* 4) I-/H-Profil: h Hoehe, b Flanschbreite, tw Stegdicke, tf Flanschdicke. */
  function bauIProfil(m) {
    var b = m.b, h = m.h, tw = m.tw, tf = m.tf;
    var yl = -b / 2, yr = b / 2, zu = -h / 2, zo = h / 2;
    var zui = zu + tf, zoi = zo - tf, sl = -tw / 2, sr = tw / 2;

    var P1 = [yl, zu], P2 = [yr, zu], P3 = [yr, zui], P4 = [sr, zui];
    var P5 = [sr, zoi], P6 = [yr, zoi], P7 = [yr, zo], P8 = [yl, zo];
    var P9 = [yl, zoi], P10 = [sl, zoi], P11 = [sl, zui], P12 = [yl, zui];

    var stegR = ln(P4, P5, 'steg_rechts', 'steg', 'steg');
    var stegL = ln(P11, P10, 'steg_links', 'steg', 'steg');

    /* Flansch unten, in Laufrichtung von innen links um den Flansch herum. */
    var flU = [ln(P11, P12, 'flansch_unten_innen_links', 'flansch', 'flansch'),
               ln(P12, P1, 'flansch_unten_kante_links', 'kante', 'flansch'),
               ln(P1, P2, 'flansch_unten_aussen', 'flansch', 'flansch'),
               ln(P2, P3, 'flansch_unten_kante_rechts', 'kante', 'flansch'),
               ln(P3, P4, 'flansch_unten_innen_rechts', 'flansch', 'flansch')];
    var flO = [ln(P5, P6, 'flansch_oben_innen_rechts', 'flansch', 'flansch'),
               ln(P6, P7, 'flansch_oben_kante_rechts', 'kante', 'flansch'),
               ln(P7, P8, 'flansch_oben_aussen', 'flansch', 'flansch'),
               ln(P8, P9, 'flansch_oben_kante_links', 'kante', 'flansch'),
               ln(P9, P10, 'flansch_oben_innen_links', 'flansch', 'flansch')];

    return {
      /* Eine einzige umlaufende Raupe entlang der gesamten Aussenkontur. */
      rundum: [raupe(true, [
        ln(P1, P2, 'flansch_unten_aussen', 'flansch', 'flansch'),
        ln(P2, P3, 'flansch_unten_kante_rechts', 'kante', 'flansch'),
        ln(P3, P4, 'flansch_unten_innen_rechts', 'flansch', 'flansch'),
        ln(P4, P5, 'steg_rechts', 'steg', 'steg'),
        ln(P5, P6, 'flansch_oben_innen_rechts', 'flansch', 'flansch'),
        ln(P6, P7, 'flansch_oben_kante_rechts', 'kante', 'flansch'),
        ln(P7, P8, 'flansch_oben_aussen', 'flansch', 'flansch'),
        ln(P8, P9, 'flansch_oben_kante_links', 'kante', 'flansch'),
        ln(P9, P10, 'flansch_oben_innen_links', 'flansch', 'flansch'),
        ln(P10, P11, 'steg_links', 'steg', 'steg'),
        ln(P11, P12, 'flansch_unten_innen_links', 'flansch', 'flansch'),
        ln(P12, P1, 'flansch_unten_kante_links', 'kante', 'flansch')])],
      flansche: [raupe(false, flU), raupe(false, flO)],
      steg: [raupe(false, [stegR]), raupe(false, [stegL])],
      /* Gleiche Geometrie wie rundum, aber VIER einzeln geschweisste Raupen
         -> vier Mal zwei Endkrater. Genau hier wird von Hand falsch gerechnet. */
      flansche_steg: [raupe(false, flU), raupe(false, flO),
                      raupe(false, [stegR]), raupe(false, [stegL])]
    };
  }

  /* 5) U-Profil: Steg links, Flansche nach rechts offen. */
  function bauUProfil(m) {
    var b = m.b, h = m.h, tw = m.tw, tf = m.tf;
    var yl = -b / 2, yr = b / 2, zu = -h / 2, zo = h / 2;
    var yi = yl + tw, zui = zu + tf, zoi = zo - tf;

    var Q1 = [yl, zu], Q2 = [yr, zu], Q3 = [yr, zui], Q4 = [yi, zui];
    var Q5 = [yi, zoi], Q6 = [yr, zoi], Q7 = [yr, zo], Q8 = [yl, zo];

    var flU = [ln(Q1, Q2, 'flansch_unten_aussen', 'flansch', 'flansch'),
               ln(Q2, Q3, 'flansch_unten_kante', 'kante', 'flansch'),
               ln(Q3, Q4, 'flansch_unten_innen', 'flansch', 'flansch')];
    var flO = [ln(Q5, Q6, 'flansch_oben_innen', 'flansch', 'flansch'),
               ln(Q6, Q7, 'flansch_oben_kante', 'kante', 'flansch'),
               ln(Q7, Q8, 'flansch_oben_aussen', 'flansch', 'flansch')];
    var stA = ln(Q8, Q1, 'steg_aussen', 'steg', 'steg');
    var stI = ln(Q4, Q5, 'steg_innen', 'steg', 'steg');

    return {
      rundum: [raupe(true, [flU[0], flU[1], flU[2], stI, flO[0], flO[1], flO[2], stA])],
      flansche: [raupe(false, flU), raupe(false, flO)],
      steg: [raupe(false, [stA]), raupe(false, [stI])],
      flansche_steg: [raupe(false, flU), raupe(false, flO),
                      raupe(false, [stA]), raupe(false, [stI])]
    };
  }

  /* 6) Winkel: b = Schenkel in y, h = Schenkel in z, t1 = Dicke. */
  function bauWinkel(m) {
    var b = m.b, h = m.h, t = m.t1;
    var yl = -b / 2, yr = b / 2, zu = -h / 2, zo = h / 2;
    var R1 = [yl, zu], R2 = [yr, zu], R3 = [yr, zu + t], R4 = [yl + t, zu + t];
    var R5 = [yl + t, zo], R6 = [yl, zo];
    return {
      rundum: [raupe(true, [
        ln(R1, R2, 'schenkel_unten_aussen', 'flanke'),
        ln(R2, R3, 'kante_rechts', 'kante'),
        ln(R3, R4, 'schenkel_unten_innen', 'flanke'),
        ln(R4, R5, 'schenkel_links_innen', 'stirn'),
        ln(R5, R6, 'kante_oben', 'kante'),
        ln(R6, R1, 'schenkel_links_aussen', 'stirn')])],
      /* Die beiden Aussenschenkel werden in der Praxis um die Ecke herum in
         EINEM Zug geschweisst -> eine Raupe mit nur zwei freien Enden. */
      flanken: [raupe(false, [ln(R2, R1, 'schenkel_unten_aussen', 'flanke'),
                              ln(R1, R6, 'schenkel_links_aussen', 'stirn')])]
    };
  }

  var BAUER = {
    blech: bauBlech, rohr_rechteck: bauRohrRechteck, rohr_rund: bauKreis,
    i_profil: bauIProfil, u_profil: bauUProfil, winkel: bauWinkel, vollrund: bauKreis
  };

  /* --------------------------------------------------------------------- */
  /* Pruefung der Masse — sprachneutrale Codes, immer mit Feldangabe.       */
  /* --------------------------------------------------------------------- */
  function pruefeMasse(profil, m) {
    var fehler = [], noetig = MASSE_JE_PROFIL[profil], i, f, v;
    if (!noetig) return { ok: false, fehler: [{ code: 'msg_profil_unbekannt', feld: 'profil' }] };
    m = m || {};

    for (i = 0; i < noetig.length; i++) {
      f = noetig[i]; v = m[f.code];
      if (!f.pflicht) continue;
      if (!istZahl(v) || v <= 0) fehler.push({ code: 'msg_mass_fehlt', feld: f.code });
    }
    if (istZahl(m.r_ecke) && m.r_ecke < 0) fehler.push({ code: 'msg_mass_fehlt', feld: 'r_ecke' });
    if (fehler.length) return { ok: false, fehler: fehler };

    if (profil === 'rohr_rechteck' && (m.r_ecke || 0) > 0) {
      if (2 * m.r_ecke > Math.min(m.b, m.h) + TOL) {
        fehler.push({ code: 'msg_mass_r_zu_gross', feld: 'r_ecke' });
      }
    }
    if (profil === 'i_profil' || profil === 'u_profil') {
      if (2 * m.tf >= m.h - TOL) fehler.push({ code: 'msg_mass_tf_zu_gross', feld: 'tf' });
      if (m.tw >= m.b - TOL) fehler.push({ code: 'msg_mass_tw_zu_gross', feld: 'tw' });
    }
    if (profil === 'winkel') {
      if (m.t1 >= Math.min(m.b, m.h) - TOL) fehler.push({ code: 'msg_mass_t_zu_gross', feld: 't1' });
    }
    return { ok: fehler.length === 0, fehler: fehler };
  }

  /* --------------------------------------------------------------------- */
  /* Endkraterabzug: der freie Anfang bzw. das freie Ende einer Raupe       */
  /* wandert um "betrag" nach innen. Laeuft ueber Segmentgrenzen hinweg.    */
  /* Rueckgabe: nicht verbrauchter Rest (> 0 => Raupe ist zu kurz).         */
  /* --------------------------------------------------------------------- */
  function kuerzeAnfang(seg, betrag) {
    while (betrag > TOL && seg.length) {
      var s = seg[0], l;
      if (s.typ === 'kreis') return 0;      /* Kreisnaht laeuft um: kein Endkrater */
      l = laengeVon(s);
      if (l - betrag > TOL) {
        var f = betrag / l;
        s.y1 = s.y1 + (s.y2 - s.y1) * f;
        s.z1 = s.z1 + (s.z2 - s.z1) * f;
        return 0;
      }
      betrag -= l; seg.shift();
    }
    return betrag > TOL ? betrag : 0;
  }
  function kuerzeEnde(seg, betrag) {
    while (betrag > TOL && seg.length) {
      var s = seg[seg.length - 1], l;
      if (s.typ === 'kreis') return 0;      /* Kreisnaht laeuft um: kein Endkrater */
      l = laengeVon(s);
      if (l - betrag > TOL) {
        var f = betrag / l;
        s.y2 = s.y2 + (s.y1 - s.y2) * f;
        s.z2 = s.z2 + (s.z1 - s.z2) * f;
        return 0;
      }
      betrag -= l; seg.pop();
    }
    return betrag > TOL ? betrag : 0;
  }

  /* --------------------------------------------------------------------- */
  /* Bruttoumfang der gewaehlten Kanten (ohne Endkraterabzug).              */
  /* Dient zugleich als unabhaengiger zweiter Rechenpfad im Harness.        */
  /* --------------------------------------------------------------------- */
  function umfang(profil, kanten, m) {
    var bauer = BAUER[profil];
    if (!bauer) return 0;
    var bild = bauer(m || {}), rp = bild[kanten];
    if (!rp) return 0;
    var s = 0, i, j;
    for (i = 0; i < rp.length; i++) {
      for (j = 0; j < rp[i].seg.length; j++) {
        var g = rp[i].seg[j];
        s += (g.typ === 'kreis') ? Math.PI * g.d : laengeVon(g);
      }
    }
    return s;
  }

  /* --------------------------------------------------------------------- */
  /* HAUPTFUNKTION: Eingabe -> Segmente fuer naht.js                        */
  /*                                                                        */
  /* Eingabe (flach oder mit .masse):                                       */
  /*   profil, kanten, b, h, d, tw, tf, t1, r_ecke,                         */
  /*   a (Grundwert), a_steg, a_flansch (optional), endkrater (Vorgabe an)  */
  /* Bei einem Fehler: ok:false und KEINE Zahlen — kein stiller Teilwert.   */
  /* --------------------------------------------------------------------- */
  function baue(eingabe) {
    var e = eingabe || {};
    var m = {}, k;
    var quelle = e.masse || e;
    var masseFelder = ['b', 'h', 'd', 'tw', 'tf', 't1', 'r_ecke'];
    for (k = 0; k < masseFelder.length; k++) {
      var mf = masseFelder[k];
      m[mf] = istZahl(quelle[mf]) ? quelle[mf] : (istZahl(e[mf]) ? e[mf] : undefined);
    }

    var profil = e.profil, kanten = e.kanten;
    var a = e.a, aSteg = istZahl(e.a_steg) ? e.a_steg : a, aFlansch = istZahl(e.a_flansch) ? e.a_flansch : a;
    var endkrater = (e.endkrater === false) ? false : true;

    var fehler = [], warnungen = [], hinweise = [];
    function raus() {
      return { ok: false, version: VERSION, profil: profil || null, kanten: kanten || null,
               segmente: [], info: [], fehler: fehler, warnungen: warnungen, hinweise: hinweise };
    }

    /* --- Stufe 1: Auswahl und Masse --- */
    if (!profil) { fehler.push({ code: 'msg_profil_fehlt', feld: 'profil' }); return raus(); }
    if (PROFILE.indexOf(profil) < 0) { fehler.push({ code: 'msg_profil_unbekannt', feld: 'profil' }); return raus(); }
    if (!kanten) { fehler.push({ code: 'msg_kanten_fehlt', feld: 'kanten' }); return raus(); }
    if (kantenFuer(profil).indexOf(kanten) < 0) {
      fehler.push({ code: 'msg_kanten_unpassend', feld: 'kanten' }); return raus();
    }
    if (!istZahl(a) || a <= 0) { fehler.push({ code: 'msg_profil_a_fehlt', feld: 'a' }); return raus(); }
    if (!istZahl(aSteg) || aSteg <= 0) { fehler.push({ code: 'msg_profil_a_fehlt', feld: 'a_steg' }); return raus(); }
    if (!istZahl(aFlansch) || aFlansch <= 0) { fehler.push({ code: 'msg_profil_a_fehlt', feld: 'a_flansch' }); return raus(); }

    var pm = pruefeMasse(profil, m);
    if (!pm.ok) { fehler = pm.fehler; return raus(); }

    /* --- Stufe 2: Raupen bauen --- */
    var bild = BAUER[profil](m);
    var rohRaupen = bild[kanten];
    if (!rohRaupen) { fehler.push({ code: 'msg_kanten_unpassend', feld: 'kanten' }); return raus(); }

    /* tiefe Kopie — die Bauer liefern frische Objekte, aber wir kuerzen sie */
    var raupen = [], i, j, s, kopie;
    for (i = 0; i < rohRaupen.length; i++) {
      kopie = [];
      for (j = 0; j < rohRaupen[i].seg.length; j++) {
        s = rohRaupen[i].seg[j];
        kopie.push({ typ: s.typ, y1: s.y1, z1: s.z1, y2: s.y2, z2: s.z2,
                     y: s.y, z: s.z, d: s.d, code: s.code, gruppe: s.gruppe, agrp: s.agrp });
      }
      raupen.push({ geschlossen: rohRaupen[i].geschlossen, seg: kopie });
    }

    var lBrutto = 0;
    for (i = 0; i < raupen.length; i++) {
      for (j = 0; j < raupen[i].seg.length; j++) {
        s = raupen[i].seg[j];
        lBrutto += (s.typ === 'kreis') ? Math.PI * s.d : laengeVon(s);
      }
    }

    /* --- Stufe 3: Endkraterabzug je freiem Ende --- */
    var umlaufend = true, offeneRaupen = 0;
    for (i = 0; i < raupen.length; i++) if (!raupen[i].geschlossen) { umlaufend = false; offeneRaupen++; }

    var abzug = 0;
    if (endkrater) {
      for (i = 0; i < raupen.length; i++) {
        if (raupen[i].geschlossen) continue;
        var seg = raupen[i].seg;
        /* a-Mass des jeweiligen Endsegments verwenden (Steg/Flansch!) */
        var aAnfang = aFuer(seg[0], a, aSteg, aFlansch);
        var aEnde = aFuer(seg[seg.length - 1], a, aSteg, aFlansch);
        var rest = kuerzeAnfang(seg, aAnfang);
        if (!seg.length || rest > 0) { fehler.push({ code: 'msg_endkrater_zu_lang', feld: 'l' }); return raus(); }
        rest = kuerzeEnde(seg, aEnde);
        if (!seg.length || rest > 0) { fehler.push({ code: 'msg_endkrater_zu_lang', feld: 'l' }); return raus(); }
        abzug += aAnfang + aEnde;
      }
    }

    /* --- Stufe 4: Segmente fuer naht.js + Begleitinformation --- */
    var segmente = [], info = [], lNetto = 0, aVerschieden = false;
    for (i = 0; i < raupen.length; i++) {
      for (j = 0; j < raupen[i].seg.length; j++) {
        s = raupen[i].seg[j];
        var aSeg = aFuer(s, a, aSteg, aFlansch);
        if (Math.abs(aSeg - a) > TOL) aVerschieden = true;
        var l = (s.typ === 'kreis') ? Math.PI * s.d : laengeVon(s);
        if (l <= TOL) continue;
        lNetto += l;
        if (s.typ === 'kreis') segmente.push(mkKreis(s.y, s.z, s.d, aSeg, s.code));
        else segmente.push(mkLinie(s.y1, s.z1, s.y2, s.z2, aSeg, s.code));
        info.push({ code: s.code, gruppe: s.gruppe, a: aSeg, l: l,
                    t: dickeFuer(s, profil, m), raupe: i, geschlossen: raupen[i].geschlossen });
      }
    }

    /* --- Stufe 5: Selbstpruefung mit dem Nahtbild-Kern --- */
    if (Naht) {
      var p = Naht.pruefe(segmente);
      if (!p.ok) { fehler = p.fehler.slice(); return raus(); }
      for (i = 0; i < p.warnungen.length; i++) warnungen.push(p.warnungen[i]);
    }

    /* --- Stufe 6: ehrliche Hinweise --- */
    var lKontur = lBrutto, bogen = 0;
    if (profil === 'rohr_rechteck' && (m.r_ecke || 0) > 0) {
      bogen = 2 * Math.PI * m.r_ecke;          /* vier Viertelkreise */
      lKontur = lBrutto + bogen;
      hinweise.push({ code: 'msg_eckradius_verkuerzt', wert: bogen });
      if (umlaufend) hinweise.push({ code: 'msg_eckluecke_keine_offene_naht' });
    }
    hinweise.push({ code: 'msg_masse_sind_aussenmasse' });
    if (kanten !== 'rundum') hinweise.push({ code: 'msg_nur_gewaehlte_kanten' });
    if (umlaufend) hinweise.push({ code: 'msg_endkrater_umlaufend' });
    else if (!endkrater) warnungen.push({ code: 'msg_endkrater_aus' });
    else hinweise.push({ code: 'msg_endkrater_abzug', wert: abzug, anzahl: offeneRaupen });
    if (aVerschieden) hinweise.push({ code: 'msg_a_je_segment' });

    return {
      ok: true,
      version: VERSION,
      profil: profil,
      kanten: kanten,
      segmente: segmente,
      info: info,
      n_seg: segmente.length,
      raupen: raupen.length,
      offene_raupen: offeneRaupen,
      umlaufend: umlaufend,
      endkrater: endkrater,
      endkrater_abzug: abzug,
      l_brutto: lBrutto,
      l_netto: lNetto,
      l_vorschlag: lNetto,      /* Vorschlag — per "eigener Wert" ueberschreibbar */
      l_kontur: lKontur,        /* mit Eckbogen, nur zur ehrlichen Gegenueberstellung */
      bogen_nicht_gerechnet: bogen,
      a: a, a_steg: aSteg, a_flansch: aFlansch,
      fehler: [], warnungen: warnungen, hinweise: hinweise
    };
  }

  /* a-Mass eines Segments: Steg und Flansch duerfen abweichen (2.2b). */
  function aFuer(s, a, aSteg, aFlansch) {
    if (!s) return a;
    if (s.agrp === 'steg') return aSteg;
    if (s.agrp === 'flansch') return aFlansch;
    return a;
  }

  /* Bauteildicke am Segment — Futter fuer die a-Grenzen in solver.js (N3). */
  function dickeFuer(s, profil, m) {
    if (profil === 'i_profil' || profil === 'u_profil') {
      return (s.agrp === 'steg') ? m.tw : m.tf;
    }
    return istZahl(m.t1) ? m.t1 : undefined;
  }

  /* Segmentfabriken: bevorzugt die des Nahtbild-Kerns (eine Quelle). */
  function mkLinie(y1, z1, y2, z2, a, code) {
    if (Naht && Naht.linie) return Naht.linie(y1, z1, y2, z2, a, code);
    return { typ: 'linie', y1: y1, z1: z1, y2: y2, z2: z2, a: a, code: code || '' };
  }
  function mkKreis(y, z, d, a, code) {
    if (Naht && Naht.kreis) return Naht.kreis(y, z, d, a, code);
    return { typ: 'kreis', y: y, z: z, d: d, a: a, code: code || '' };
  }

  return {
    VERSION: VERSION,
    PROFILE: PROFILE,
    KANTEN: KANTEN,
    KANTEN_JE_PROFIL: KANTEN_JE_PROFIL,
    MASSE_JE_PROFIL: MASSE_JE_PROFIL,
    SEGMENTGRUPPEN: SEGMENTGRUPPEN,
    CODES: CODES,
    kantenFuer: kantenFuer,
    masseFuer: masseFuer,
    pruefeMasse: pruefeMasse,
    umfang: umfang,
    baue: baue
  };
}));
