/* ============================================================================
 * DT-ProfiSchweissnaht · thermik.js  (DTNThermik)
 * Baustein N9 — WAERMEFUEHRUNG nach EN 1011-2 (Etappe N9a von 2).
 *
 * ETAPPE 1 VON 2: NUR DER RECHENKERN. Kein DOM, kein Panel, kein Pixel —
 * das kommt mit N9b. Alles hier ist in Node pruefbar.
 *
 * WAS DIESES MODUL RECHNET:
 *   - Kohlenstoffaequivalente CET, CEV(IIW) und Pcm aus der Analyse
 *   - Mindest-Vorwaermtemperatur nach EN 1011-2 Anhang C.3, METHODE B
 *   - kombinierte Dicke je Stossart
 *   - Waermeeinbringen Q aus U, I, v und dem thermischen Wirkungsgrad
 *   - Abkuehlzeit t8/5 zwei- UND dreidimensional samt Uebergangsdicke
 *   - die Umkehrung: welches Q haelt ein t8/5-Zielfenster ein
 *
 * WAS ES AUSDRUECKLICH NICHT RECHNET (benannte Luecken, 2026-08-05):
 *   - METHODE A (Anhang C.2). Sie besteht aus 13 Nomogrammen, die nie in
 *     Tabellen- oder Formelform veroeffentlicht wurden. Eine gezielte
 *     Recherche hat das bestaetigt. Die Kurven aus der Norm abzudigitalisieren
 *     waere weder ueberpruefbar noch urheberrechtlich sauber, und Zahlen zu
 *     erfinden kommt nicht in Frage. Dieters Entscheidung 2026-08-05:
 *     Methode B allein, Methode A als BENANNTE Luecke.
 *   - AWS D1.1 Annex B (Pcm + Einspanngrad) — waere frei tabelliert, die
 *     Zahlen stehen aber in der AWS-Norm. Gleiche Lage wie Methode A.
 *   - SPANNUNGSARMGLUEHEN. Haltezeit und Ofenfuehrung sind Fertigungs-
 *     anweisung, nicht Bemessung. Das ist die Grenze zur Qualitaetssicherung,
 *     die dieses Programm nicht ueberschreitet (Plan 2.4).
 *
 * DER GELTUNGSBEREICH WIRD HART GEPRUEFT. Methode B gilt fuer CET 0,2–0,5 %,
 * d 10–90 mm, HD 1–20 ml/100 g, Q 0,5–4,0 kJ/mm. Ausserhalb wird NICHT
 * extrapoliert, sondern abgelehnt — dieselbe Haltung wie beim fehlenden
 * Kerbfall. Eine Formel ausserhalb ihres Gueltigkeitsbereichs liefert eine
 * plausible Zahl ohne Deckung, und das ist gefaehrlicher als keine Zahl.
 *
 * DOM-frei · UMD/IIFE · haengt an nichts ausser sich selbst.
 * ========================================================================== */
(function (root, factory) {
  var api;
  if (typeof module === 'object' && module.exports) {
    api = factory();
    module.exports = api;
  } else {
    api = factory();
  }
  root.DTNThermik = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NAME = 'thermik';
  var VERSION = '0.1.0-N9a';

  /* --------------------------------------------------------------------- */
  /* Tabellen                                                               */
  /* --------------------------------------------------------------------- */

  /* Thermischer Wirkungsgrad k nach EN 1011-1, je Prozesskennzahl
     EN ISO 4063. Quelle 1: ERL GmbH; Quelle 2: anleitung-zum-schweissen.de. */
  var WIRKUNGSGRAD = {
    '111': 0.8,   /* Lichtbogenhandschweissen           */
    '121': 1.0,   /* Unterpulverschweissen              */
    '131': 0.8,   /* MIG, Massivdraht                   */
    '135': 0.8,   /* MAG, Massivdraht                   */
    '136': 0.8,   /* MAG Fuelldraht, schlackebildend    */
    '138': 0.8,   /* MAG Fuelldraht, metallpulvergefuellt */
    '141': 0.6,   /* WIG                                */
    '15':  0.6    /* Plasma                             */
  };

  /* Wasserstoffskala nach EN 1011-2, Table C.2 (ml/100 g abgeschmolzenes
     Schweissgut). Sie gehoert zu METHODE A und wird hier NUR zur Einordnung
     eines eingegebenen HD-Werts gefuehrt — gerechnet wird mit HD selbst. */
  var H_SKALA = [
    { code: 'A', von: 15, bis: null },
    { code: 'B', von: 10, bis: 15 },
    { code: 'C', von: 5,  bis: 10 },
    { code: 'D', von: 3,  bis: 5 },
    { code: 'E', von: 0,  bis: 3 }
  ];

  /* KOMBINIERTE DICKE — Zahl der Waermepfade je Stossart.
     EN 1011-2 Figure C.1 verwendet die SUMME der (ueber 75 mm gemittelten)
     Blechdicken, NICHT deren Mittelwert. Die verbreitete Angabe
     0,5*(t1+t2) fuer Stumpfnaehte stammt aus der australischen AS 3992 und
     ist fuer EN 1011-2 falsch — gezielt recherchiert und zweifach belegt
     (2026-08-05). Wer sie wieder einbaut, rechnet zu niedrige
     Vorwaermtemperaturen, also auf der unsicheren Seite. */
  var WAERMEPFADE = {
    stumpfstoss:    2,
    t_stoss:        3,
    kreuzstoss:     4,
    eckstoss:       2,
    ueberlappstoss: 3
  };

  /* Geltungsbereich Methode B — EN 1011-2:2001, Anhang C.3, woertlich
     belegt: "valid for structural steels with a yield strength up to
     1 000 N/mm2 and CET = 0,2 % to 0,5 %, d = 10 mm to 90 mm,
     HD = 1 ml/100g to 20 ml/100g, Q = 0,5 kJ/mm to 4,0 kJ/mm". */
  var BEREICH_B = {
    CET: { min: 0.20, max: 0.50 },
    d:   { min: 10,   max: 90 },
    HD:  { min: 1,    max: 20 },
    Q:   { min: 0.5,  max: 4.0 }
  };

  /* Obergrenze der Zwischenlagentemperatur (EN 1011-2; Baustaehle und
     Feinkornstaehle). Darueber verlaengert sich t8/5 so weit, dass
     Zaehigkeit und Festigkeit leiden. */
  var INTERPASS_MAX = 300;

  var CODES = [
    'msg_th_ausserhalb_cet', 'msg_th_ausserhalb_d', 'msg_th_ausserhalb_hd',
    'msg_th_ausserhalb_q', 'msg_th_keine_analyse', 'msg_th_kein_verfahren',
    'msg_th_kein_cet', 'msg_th_2d_oder_3d', 'msg_th_massgebend_groesser',
    'msg_th_interpass_grenze', 'msg_th_methode_a_fehlt', 'msg_th_keine_vorwaermung',
    'msg_th_cev_ueber_norm', 'msg_th_kombinierte_dicke_summe',
    'msg_th_zielfenster_unerreichbar', 'msg_th_toleranz_zehn_prozent'
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
    var e = { code: code };
    if (zusatz) for (var k in zusatz) {
      if (Object.prototype.hasOwnProperty.call(zusatz, k)) e[k] = zusatz[k];
    }
    liste.push(e);
  }

  function fehlErgebnis(fehler) {
    return { ok: false, version: VERSION, fehler: fehler, warnungen: [], hinweise: [] };
  }

  /* --------------------------------------------------------------------- */
  /* 1 · Kohlenstoffaequivalente                                            */
  /* --------------------------------------------------------------------- */

  /* Alle drei aus derselben Analyse. Gerechnet wird die Vorwaermung mit CET
     (Methode B); CEV und Pcm stehen zur EINORDNUNG daneben, weil die
     Erzeugnisnormen CEV fuehren und weil Pcm bei C < 0,18 % aussagekraeftiger
     ist. Sie gehen NICHT in die Vorwaermformel ein. */
  function aequivalente(a) {
    a = a || {};
    var C  = oder(a.C, 0),  Si = oder(a.Si, 0), Mn = oder(a.Mn, 0);
    var Cr = oder(a.Cr, 0), Mo = oder(a.Mo, 0), V  = oder(a.V, 0);
    var Cu = oder(a.Cu, 0), Ni = oder(a.Ni, 0), B  = oder(a.B, 0);

    return {
      /* EN 1011-2 / IIW */
      CEV: C + Mn / 6 + (Cr + Mo + V) / 5 + (Cu + Ni) / 15,
      /* Uwer/Hoehne 1991 — Grundlage der Methode B */
      CET: C + (Mn + Mo) / 10 + (Cr + Cu) / 20 + Ni / 40,
      /* Ito-Bessyo */
      Pcm: C + Si / 30 + (Mn + Cu + Cr) / 20 + Ni / 60 + Mo / 15 + V / 10 + 5 * B,
      C: C
    };
  }

  /* Welches Aequivalent ist fuer diesen Stahl das aussagekraeftigste?
     Das ist eine EINORDNUNG, keine Rechenentscheidung — die Vorwaermung
     laeuft immer ueber CET. */
  function empfohlenesAequivalent(C) {
    var c = zahl(C);
    if (c === null) return null;
    if (c < 0.18) return 'Pcm';
    return 'CEV';
  }

  function hSkala(HD) {
    var h = zahl(HD), i, e;
    if (h === null) return null;
    for (i = 0; i < H_SKALA.length; i++) {
      e = H_SKALA[i];
      if (e.bis === null) { if (h > e.von) return e.code; }
      else if (h > e.von && h <= e.bis) return e.code;
      else if (e.von === 0 && h <= e.bis) return e.code;
    }
    return null;
  }

  /* --------------------------------------------------------------------- */
  /* 2 · Kombinierte Dicke                                                  */
  /* --------------------------------------------------------------------- */

  /* Summe der im Nahtbereich zusammenlaufenden Blechdicken. Je mehr Pfade,
     desto groesser die Waermesenke — deshalb braucht eine Kehlnaht bei
     gleicher Einzeldicke mehr Vorwaermung als eine Stumpfnaht. */
  function kombinierteDicke(stossart, dicken) {
    var n = Object.prototype.hasOwnProperty.call(WAERMEPFADE, stossart)
          ? WAERMEPFADE[stossart] : null;
    if (n === null) return null;
    var liste = [], i, z;
    for (i = 0; i < (dicken || []).length; i++) {
      z = zahl(dicken[i]);
      if (z !== null && z > 0) liste.push(z);
    }
    if (!liste.length) return null;
    /* Fehlen Angaben, wird die letzte bekannte Dicke fortgeschrieben — das
       ist der uebliche Fall gleicher Bleche und liegt auf der sicheren
       Seite, weil es die Summe nicht kleiner macht. */
    var summe = 0;
    for (i = 0; i < n; i++) summe += (i < liste.length) ? liste[i] : liste[liste.length - 1];
    return { wert: summe, pfade: n, einzeln: liste.slice() };
  }

  /* --------------------------------------------------------------------- */
  /* 3 · Waermeeinbringen                                                   */
  /* --------------------------------------------------------------------- */

  /* Q = k * U * I / v  [kJ/mm].  v in mm/s.  Der Wirkungsgrad k kommt aus
     der Tabelle oben oder wird direkt vorgegeben. */
  function waermeeinbringen(ein) {
    ein = ein || {};
    var U = zahl(ein.U), I = zahl(ein.I), v = zahl(ein.v);
    var k = zahl(ein.k);
    var fehler = [];

    if (k === null) {
      if (!ein.verfahren || !Object.prototype.hasOwnProperty.call(WIRKUNGSGRAD, String(ein.verfahren))) {
        schiebe(fehler, 'msg_th_kein_verfahren');
      } else {
        k = WIRKUNGSGRAD[String(ein.verfahren)];
      }
    }
    if (U === null || I === null || v === null || v <= 0) {
      return { ok: false, fehler: [{ code: 'msg_th_kein_verfahren' }] };
    }
    if (fehler.length) return { ok: false, fehler: fehler };

    var E = (U * I) / v / 1000;          /* Streckenenergie kJ/mm */
    return { ok: true, E: E, k: k, Q: k * E, U: U, I: I, v: v };
  }

  /* --------------------------------------------------------------------- */
  /* 4 · Vorwaermung nach Methode B                                         */
  /* --------------------------------------------------------------------- */

  /* Tp = 697*CET + 160*tanh(d/35) + 62*HD^0,35 + (53*CET − 32)*Q − 328
     EN 1011-2:2001, Gleichung C.8. Zerlegbar in vier Teilbetraege, die
     einzeln herausgegeben werden — der Rechenweg soll zeigen, WOHER die
     Temperatur kommt, nicht nur WIE HOCH sie ist. */
  function tanh(x) {
    if (x > 20) return 1;
    if (x < -20) return -1;
    var e2 = Math.exp(2 * x);
    return (e2 - 1) / (e2 + 1);
  }

  function vorwaermung(ein) {
    ein = ein || {};
    var CET = zahl(ein.CET), d = zahl(ein.d), HD = zahl(ein.HD), Q = zahl(ein.Q);
    var fehler = [], warnungen = [], hinweise = [];

    if (CET === null) schiebe(fehler, 'msg_th_kein_cet');
    if (d === null || HD === null || Q === null) schiebe(fehler, 'msg_th_keine_analyse');
    if (fehler.length) return fehlErgebnis(fehler);

    /* GELTUNGSBEREICH — hart. Ausserhalb wird nicht gerechnet. */
    if (CET < BEREICH_B.CET.min || CET > BEREICH_B.CET.max) {
      schiebe(fehler, 'msg_th_ausserhalb_cet',
              { ist: CET, min: BEREICH_B.CET.min, max: BEREICH_B.CET.max });
    }
    if (d < BEREICH_B.d.min || d > BEREICH_B.d.max) {
      schiebe(fehler, 'msg_th_ausserhalb_d',
              { ist: d, min: BEREICH_B.d.min, max: BEREICH_B.d.max });
    }
    if (HD < BEREICH_B.HD.min || HD > BEREICH_B.HD.max) {
      schiebe(fehler, 'msg_th_ausserhalb_hd',
              { ist: HD, min: BEREICH_B.HD.min, max: BEREICH_B.HD.max });
    }
    if (Q < BEREICH_B.Q.min || Q > BEREICH_B.Q.max) {
      schiebe(fehler, 'msg_th_ausserhalb_q',
              { ist: Q, min: BEREICH_B.Q.min, max: BEREICH_B.Q.max });
    }
    if (fehler.length) return fehlErgebnis(fehler);

    /* ZWEI ZULAESSIGE FASSUNGEN DERSELBEN FORMEL. Die Norm fuehrt
       697/−328 (EN 1011-2 Gl. C.8), die SEW 088 bzw. Uwer/Hoehne 1991
       fuehrt 700/−330. Der Unterschied liegt im niedrigen einstelligen
       Gradbereich (am Anker: 162,83 gegen 161,94 °C). Voreinstellung ist
       die NORMFASSUNG; die SEW-Fassung ist waehlbar, damit ein Anwender,
       der gegen ein SEW-Beispiel nachrechnet, nicht raetselt. Der
       Rechenweg nennt die verwendete Fassung. */
    var sew = (ein.formel === 'SEW');
    var kA = sew ? 700 : 697;
    var kB = sew ? -330 : -328;

    var TpCET = kA * CET;
    var Tpd   = 160 * tanh(d / 35);
    var TpHD  = 62 * Math.pow(HD, 0.35);
    var TpQ   = (53 * CET - 32) * Q;
    var Tp    = TpCET + Tpd + TpHD + TpQ + kB;

    /* Eine rechnerisch negative oder sehr niedrige Temperatur heisst:
       keine Vorwaermung erforderlich. Das ist ein Ergebnis, keine Panne —
       und es wird ausdruecklich gesagt statt stillschweigend auf 0 gesetzt. */
    if (Tp <= 20) schiebe(hinweise, 'msg_th_keine_vorwaermung', { Tp: Tp });
    /* Methode A liefert systematisch niedrigere Werte und ist hier nicht
       gebaut — das gehoert neben jedes Ergebnis. */
    schiebe(hinweise, 'msg_th_methode_a_fehlt');

    return {
      ok: true, version: VERSION, methode: 'B', formel: sew ? 'SEW' : 'EN',
      Tp: Tp, Tp_gerundet: Math.ceil(Math.max(Tp, 0) / 5) * 5,
      teile: { CET: TpCET, d: Tpd, HD: TpHD, Q: TpQ, konstante: kB },
      eingang: { CET: CET, d: d, HD: HD, Q: Q },
      erforderlich: Tp > 20,
      interpass_max: INTERPASS_MAX,
      fehler: [], warnungen: warnungen, hinweise: hinweise
    };
  }

  /* --------------------------------------------------------------------- */
  /* 5 · Abkuehlzeit t8/5                                                   */
  /* --------------------------------------------------------------------- */

  /* Dreidimensional (dicke Bleche):
       t8/5 = (6700 − 5*T0) * Q * [1/(500−T0) − 1/(800−T0)] * F3
     Zweidimensional (duenne Bleche):
       t8/5 = (4300 − 4,3*T0) * 1e5 * (Q²/d²) * [(1/(500−T0))² − (1/(800−T0))²] * F2
     Nach SEW 088 Bbl. 2 / Uwer-Degenkolbe. */
  function t85_3d(T0, Q, F3) {
    return (6700 - 5 * T0) * Q * (1 / (500 - T0) - 1 / (800 - T0)) * F3;
  }

  function t85_2d(T0, Q, d, F2) {
    return (4300 - 4.3 * T0) * 1e5 * (Q * Q) / (d * d) *
           (Math.pow(1 / (500 - T0), 2) - Math.pow(1 / (800 - T0), 2)) * F2;
  }

  /* Uebergangsblechdicke: dort sind 2D und 3D gleich. */
  function uebergangsdicke(T0, Q) {
    return Math.sqrt(((4300 - 4.3 * T0) / (6700 - 5 * T0)) * 1e5 * Q *
                     (1 / (500 - T0) + 1 / (800 - T0)));
  }

  function abkuehlzeit(ein) {
    ein = ein || {};
    var T0 = zahl(ein.T0), Q = zahl(ein.Q), d = zahl(ein.d);
    var F3 = oder(ein.F3, 1), F2 = oder(ein.F2, 1);
    var fehler = [], hinweise = [];

    if (T0 === null || Q === null || d === null || d <= 0) {
      schiebe(fehler, 'msg_th_keine_analyse');
      return fehlErgebnis(fehler);
    }
    if (T0 >= 500) { schiebe(fehler, 'msg_th_interpass_grenze'); return fehlErgebnis(fehler); }
    if (T0 > INTERPASS_MAX) schiebe(hinweise, 'msg_th_interpass_grenze', { ist: T0, max: INTERPASS_MAX });

    var d3 = t85_3d(T0, Q, F3);
    var d2 = t85_2d(T0, Q, d, F2);
    var due = uebergangsdicke(T0, Q);

    /* BEI ZWEIFEL IST DER GROESSERE WERT MASSGEBEND. Die Uebergangsdicke
       sagt, welche Ableitung zu erwarten ist — aber die Rechnung streut um
       rund 10 %, im Uebergangsbereich mehr. Deshalb wird nicht blind nach
       der Dicke entschieden, sondern der ungünstigere Wert genommen und
       BEIDE Werte herausgegeben. */
    var art = (d >= due) ? '3D' : '2D';
    var massgebend = Math.max(d2, d3);
    if ((massgebend === d3 && art === '2D') || (massgebend === d2 && art === '3D')) {
      schiebe(hinweise, 'msg_th_massgebend_groesser', { art: art });
    }
    schiebe(hinweise, 'msg_th_2d_oder_3d', { art: art, due: due });
    schiebe(hinweise, 'msg_th_toleranz_zehn_prozent');

    return {
      ok: true, version: VERSION,
      t85: massgebend, t85_2d: d2, t85_3d: d3,
      uebergangsdicke: due, waermeableitung: art,
      eingang: { T0: T0, Q: Q, d: d, F2: F2, F3: F3 },
      fehler: [], warnungen: [], hinweise: hinweise
    };
  }

  /* --------------------------------------------------------------------- */
  /* 6 · Die Umkehrung — welches Q haelt das Zielfenster ein                */
  /* --------------------------------------------------------------------- */

  /* Beide Formeln sind in Q streng monoton steigend (3D linear, 2D
     quadratisch) — die Umkehrung ist deshalb geschlossen moeglich, ohne
     Iteration. Gerechnet wird die Ableitungsart, die auch vorwaerts
     massgebend waere. */
  function qFuerT85(T0, t85, d, F2, F3, art) {
    if (art === '3D') {
      var n3 = (6700 - 5 * T0) * (1 / (500 - T0) - 1 / (800 - T0)) * F3;
      return (n3 > 0) ? t85 / n3 : null;
    }
    var n2 = (4300 - 4.3 * T0) * 1e5 / (d * d) *
             (Math.pow(1 / (500 - T0), 2) - Math.pow(1 / (800 - T0), 2)) * F2;
    return (n2 > 0) ? Math.sqrt(t85 / n2) : null;
  }

  /* Zu einem Zielfenster [t_min, t_max] den zulaessigen Q-Bereich und —
     wenn U und I bekannt sind — den Bereich der Schweissgeschwindigkeit. */
  function auslegung(ein) {
    ein = ein || {};
    var T0 = zahl(ein.T0), d = zahl(ein.d);
    var tMin = zahl(ein.t85_min), tMax = zahl(ein.t85_max);
    var F3 = oder(ein.F3, 1), F2 = oder(ein.F2, 1);
    var U = zahl(ein.U), I = zahl(ein.I), k = zahl(ein.k);
    var hinweise = [];

    if (T0 === null || d === null || tMin === null || tMax === null || tMax <= tMin) {
      return fehlErgebnis([{ code: 'msg_th_keine_analyse' }]);
    }
    if (k === null && ein.verfahren &&
        Object.prototype.hasOwnProperty.call(WIRKUNGSGRAD, String(ein.verfahren))) {
      k = WIRKUNGSGRAD[String(ein.verfahren)];
    }

    /* DIE UMKEHRUNG MUSS DIESELBE REGEL BEFOLGEN WIE DIE VORWAERTSRECHNUNG.
       Vorwaerts ist der GROESSERE der beiden Werte massgebend. Loeste man
       hier nur EINE Ableitungsart auf, traefe der Vorschlag das Zielfenster
       nicht — die Gegenprobe in S44 hat genau das gefunden (9,3 s statt der
       geforderten 8,0 s).
       Richtig ist: beide Arten aufloesen und das KLEINERE Q nehmen. Weil
       beide Formeln in Q streng monoton steigen, erreicht dort die eine
       Kurve gerade den Zielwert, waehrend die andere darunter liegt — das
       Maximum ist also genau der Zielwert. */
    function qBeide(t) {
      var q2 = qFuerT85(T0, t, d, F2, F3, '2D');
      var q3 = qFuerT85(T0, t, d, F2, F3, '3D');
      if (q2 === null && q3 === null) return null;
      if (q2 === null) return q3;
      if (q3 === null) return q2;
      return Math.min(q2, q3);
    }

    var qMin = qBeide(tMin);
    var qMax = qBeide(tMax);
    if (qMin === null || qMax === null) {
      return fehlErgebnis([{ code: 'msg_th_zielfenster_unerreichbar' }]);
    }
    /* Welche Art im Fenster fuehrt, wird zur Einordnung mitgegeben. */
    var due = uebergangsdicke(T0, (qMin + qMax) / 2);
    var art = (d >= due) ? '3D' : '2D';

    /* Der Geltungsbereich der Methode B begrenzt Q ebenfalls — das gehoert
       benannt, sonst schlaegt das Programm etwas vor, was es selbst nicht
       nachrechnen koennte. */
    var qMinB = Math.max(qMin, BEREICH_B.Q.min);
    var qMaxB = Math.min(qMax, BEREICH_B.Q.max);
    if (qMaxB < qMinB) schiebe(hinweise, 'msg_th_zielfenster_unerreichbar');
    schiebe(hinweise, 'msg_th_2d_oder_3d', { art: art, due: due });
    schiebe(hinweise, 'msg_th_toleranz_zehn_prozent');

    var vMin = null, vMax = null;
    if (U !== null && I !== null && k !== null && qMin > 0 && qMax > 0) {
      /* Q = k*U*I/(v*1000)  ->  v = k*U*I/(Q*1000).
         Grosses Q heisst kleine Geschwindigkeit — die Grenzen drehen sich. */
      vMax = k * U * I / (qMin * 1000);
      vMin = k * U * I / (qMax * 1000);
    }

    return {
      ok: true, version: VERSION,
      Q_min: qMin, Q_max: qMax,
      Q_min_gueltig: qMinB, Q_max_gueltig: qMaxB,
      v_min: vMin, v_max: vMax,
      waermeableitung: art, uebergangsdicke: due,
      eingang: { T0: T0, d: d, t85_min: tMin, t85_max: tMax, F2: F2, F3: F3 },
      fehler: [], warnungen: [], hinweise: hinweise
    };
  }

  return {
    NAME: NAME, VERSION: VERSION,
    WIRKUNGSGRAD: WIRKUNGSGRAD, H_SKALA: H_SKALA, WAERMEPFADE: WAERMEPFADE,
    BEREICH_B: BEREICH_B, INTERPASS_MAX: INTERPASS_MAX, CODES: CODES,
    aequivalente: aequivalente, empfohlenesAequivalent: empfohlenesAequivalent,
    hSkala: hSkala, kombinierteDicke: kombinierteDicke,
    waermeeinbringen: waermeeinbringen, vorwaermung: vorwaermung,
    abkuehlzeit: abkuehlzeit, auslegung: auslegung,
    t85_2d: t85_2d, t85_3d: t85_3d, uebergangsdicke: uebergangsdicke
  };
}));
