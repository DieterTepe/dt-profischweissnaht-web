/* ============================================================================
 * DT-ProfiSchweissnaht · skizze.js  (DTNSkizze)
 * Baustein N8 — DIALOGSKIZZEN (Schweissnaht-1.md 3.3, Etappe N8b-1).
 *
 * WOFUER: Plan 3.3 verlangt in jedem Dialogfenster des Assistenten eine
 * SKIZZE. Fuer Profil und Kanten zeichnet das schon schaubild.js, fuer die
 * Nahtart und das Zeichnungssymbol symbol.js. Was fehlte, sind die vier
 * Auswahlen, bei denen ein Bild wirklich etwas erklaert:
 *   stossart        — wie die zwei Teile zueinander stehen
 *   lastfall        — wie sich die Last ueber der Zeit verhaelt
 *   rechenrichtung  — was gesucht ist: das a-Mass oder die Ausnutzung
 *   lasteingabe     — Schnittgroessen direkt oder Kraft mit Hebelarm
 *
 * UND WOFUER AUSDRUECKLICH NICHT (2026-08-04, benannte Luecke):
 * Fuer Welt, Werkstoffgruppe, Werkstoff, Zustand, Zusatzwerkstoff,
 * beta_w-Regelsatz, Nachweisverfahren, Nahtguete, Welt-B-Nahtgruppe,
 * a-Rundung, Schweissverfahren, Bewertungsgruppe und Ausfuehrungsklasse
 * gibt es NICHTS ZU ZEICHNEN, das erklaert statt schmueckt. Ein huebsches
 * Bildchen ohne Aussage waere die stille Luege, die dieses Programm nicht
 * baut. Dort traegt das Dialogfenster die Laien-Erklaerung und den Tipp aus
 * i18n_hilfe.js — das ist die ehrlichere Hilfe.
 *
 * KEIN TEXT IM SVG (4.3): beschriftet wird ueber die Legende, also ueber
 * sprachneutrale Schluessel und i18n_kern.js. Die Skizzen sind SCHEMATISCH
 * und ausdruecklich NICHT massstaeblich — sie zeigen die Lage, nicht die
 * Groesse.
 *
 * DOM-frei · UMD/IIFE · zeichnet auf svglib.js · rechnet nichts.
 * ========================================================================== */
(function (root, factory) {
  var api;
  if (typeof module === 'object' && module.exports) {
    api = factory();
    module.exports = api;
  } else {
    api = factory();
  }
  root.DTNSkizze = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NAME = 'skizze';
  var VERSION = '0.1.0-N8b';

  /* Welche Gruppen dieses Modul bedient. Andere Quellen (schaubild.js fuer
     Profil und Kanten, symbol.js fuer Nahtart und Symbol) stehen hier
     bewusst NICHT — dieses Modul kennt sie nicht und haengt nicht an ihnen. */
  var GRUPPEN = ['stossart', 'lastfall', 'rechenrichtung', 'lasteingabe'];

  /* Die Gruppen ohne Skizze — als Liste gefuehrt, damit die Luecke benannt
     ist und nicht bloss vorhanden. Eine Assertion prueft, dass jede
     Auswahlgruppe entweder gezeichnet wird oder hier steht. */
  var OHNE_SKIZZE = ['welt', 'werkstoffgruppe', 'werkstoff', 'zustand',
                     'zusatzwerkstoff', 'bw_regelsatz', 'nachweisverfahren',
                     'nahtguete', 'weltb_nahtgruppe', 'a_rundung',
                     'schweissverfahren', 'iso5817', 'exc'];

  var LEGENDE_CODES = ['skz_bauteil', 'skz_naht', 'skz_kraft', 'skz_zeit',
                       'skz_gesucht', 'skz_hebelarm', 'skz_nulllinie',
                       'skz_nicht_masstab'];

  function leer(code) {
    return { ok: false, svg: '', legende: [], fehler: [{ code: code }] };
  }

  /* EINE FESTE SICHT FUER ALLE SKIZZEN. Sie sollen im Dialog gleich gross
     und gleich ausgerichtet erscheinen — ein Bild, das je nach Auswahl
     springt, lenkt vom Inhalt ab. Der Rahmen ist Zeichenmass, kein
     Bauteilmass: die Skizzen sind SCHEMATISCH und nicht massstaeblich. */
  var RAHMEN = [{ y: -110, z: -80 }, { y: 110, z: 80 }];

  function sichtVon(Svg) { return Svg.sicht(Svg.box(RAHMEN), {}); }

  /* Ein Bauteil im Schnitt. */
  function teil(Svg, v, y, z, b, h) {
    return Svg.rechteck(v, y, z, b, h,
      { farbe: Svg.PALETTE.blau, fuellung: Svg.PALETTE.blau, deckung: 0.30, breite: 1.4 });
  }

  /* Eine Kehlnaht im Schnitt — svglib zeichnet das Dreieck selbst (N2c). */
  function kehle(Svg, v, y, z, a, winkel) {
    return Svg.nahtdreieck(v, y, z, a, winkel,
      { farbe: Svg.PALETTE.bernstein, fuellung: Svg.PALETTE.bernstein, deckung: 0.85 });
  }

  /* --------------------------------------------------------------------- */
  /* stossart — wie die zwei Teile zueinander stehen                        */
  /* --------------------------------------------------------------------- */

  function stossart(Svg, v, code) {
    var t = [], leg = ['skz_bauteil', 'skz_naht'], d = 16;

    if (code === 'stumpfstoss') {
      t.push(teil(Svg, v, -55, 0, 86, d));
      t.push(teil(Svg, v, 55, 0, 86, d));
      t.push(Svg.rechteck(v, 0, 0, 10, d,
        { farbe: Svg.PALETTE.bernstein, fuellung: Svg.PALETTE.bernstein, deckung: 0.85 }));
    } else if (code === 't_stoss') {
      t.push(teil(Svg, v, 0, 45, 150, d));
      t.push(teil(Svg, v, 0, -15, d, 104));
      t.push(kehle(Svg, v, d / 2, 37, 13, 0));
      t.push(kehle(Svg, v, -d / 2, 37, 13, 90));
    } else if (code === 'kreuzstoss') {
      t.push(teil(Svg, v, 0, 0, 150, d));
      t.push(teil(Svg, v, 0, -45, d, 74));
      t.push(teil(Svg, v, 0, 45, d, 74));
      t.push(kehle(Svg, v, d / 2, -d / 2, 11, 0));
      t.push(kehle(Svg, v, -d / 2, -d / 2, 11, 90));
      t.push(kehle(Svg, v, d / 2, d / 2, 11, -90));
      t.push(kehle(Svg, v, -d / 2, d / 2, 11, 180));
    } else if (code === 'eckstoss') {
      t.push(teil(Svg, v, 20, 45, 110, d));
      t.push(teil(Svg, v, -27, -8, d, 90));
      t.push(kehle(Svg, v, -19, 37, 13, 0));
    } else if (code === 'ueberlappstoss') {
      t.push(teil(Svg, v, -30, 10, 120, d));
      t.push(teil(Svg, v, 30, -10, 120, d));
      t.push(kehle(Svg, v, -30, 2, 12, 180));
      t.push(kehle(Svg, v, 30, -2, 12, 0));
    } else {
      return null;
    }
    leg.push('skz_nicht_masstab');
    return { t: t, leg: leg };
  }

  /* --------------------------------------------------------------------- */
  /* lastfall — wie sich die Last ueber der Zeit verhaelt                   */
  /* --------------------------------------------------------------------- */

  function lastfall(Svg, v, code) {
    var t = [], leg = ['skz_kraft', 'skz_zeit', 'skz_nulllinie'];
    var y0 = -95, y1 = 100, i, x, wert, punkte = [];

    t.push(Svg.linie(v, y0, 0, y1, 0,
      { farbe: Svg.PALETTE.neutral, strich: '5 4', breite: 1.2 }));
    t.push(Svg.linie(v, y0, -62, y0, 62, { farbe: Svg.PALETTE.neutral, breite: 1.2 }));

    for (i = 0; i <= 72; i++) {
      x = y0 + (y1 - y0) * i / 72;
      if (code === 'ruhend') wert = 1;
      else if (code === 'schwellend') wert = 0.5 - 0.5 * Math.cos(i / 72 * 6 * Math.PI);
      else if (code === 'wechselnd') wert = Math.sin(i / 72 * 6 * Math.PI);
      else return null;
      punkte.push({ y: x, z: -wert * 52 });
    }
    t.push(Svg.polylinie(v, punkte, { farbe: Svg.PALETTE.rot, breite: 2 }));
    return { t: t, leg: leg };
  }

  /* --------------------------------------------------------------------- */
  /* rechenrichtung — was ist gegeben, was gesucht                          */
  /* --------------------------------------------------------------------- */

  function rechenrichtung(Svg, v, code) {
    var t = [], leg = [], d = 16;

    t.push(teil(Svg, v, 0, 45, 150, d));
    t.push(teil(Svg, v, 0, -15, d, 104));
    t.push(Svg.kraftpfeil(v, 0, -75, 0, -55, { farbe: Svg.PALETTE.rot }));

    if (code === 'auslegung') {
      /* Das a-Mass ist das GESUCHTE: die Naht steht offen und markiert da. */
      t.push(Svg.polylinie(v, [{ y: d / 2, z: 37 }, { y: d / 2 + 18, z: 37 },
                               { y: d / 2, z: 19 }],
        { farbe: Svg.PALETTE.gruen, strich: '4 3', breite: 2, geschlossen: true }));
      t.push(Svg.punktmarke(v, d / 2 + 7, 30, { farbe: Svg.PALETTE.gruen }));
      leg.push('skz_gesucht');
    } else if (code === 'nachweis') {
      t.push(kehle(Svg, v, d / 2, 37, 13, 0));
      t.push(kehle(Svg, v, -d / 2, 37, 13, 90));
      leg.push('skz_naht');
    } else {
      return null;
    }
    leg.push('skz_kraft');
    leg.push('skz_nicht_masstab');
    return { t: t, leg: leg };
  }

  /* --------------------------------------------------------------------- */
  /* lasteingabe — Schnittgroessen direkt oder Kraft mit Hebelarm           */
  /* --------------------------------------------------------------------- */

  function lasteingabe(Svg, v, code) {
    var t = [], leg = ['skz_kraft'], d = 16;

    t.push(teil(Svg, v, -85, 0, d, 110));            /* die Fuegeebene */
    t.push(teil(Svg, v, 0, 0, 150, d));              /* der Kragarm */
    t.push(kehle(Svg, v, -77, d / 2, 12, -90));
    t.push(kehle(Svg, v, -77, -d / 2, 12, 0));

    if (code === 'direkt') {
      /* Die Schnittgroessen greifen unmittelbar in der Fuegeebene an. */
      t.push(Svg.kraftpfeil(v, -35, 0, -70, 0, { farbe: Svg.PALETTE.rot }));
      t.push(Svg.kraftpfeil(v, -77, -55, -77, -18, { farbe: Svg.PALETTE.rot }));
    } else if (code === 'geometrisch') {
      /* Eine Kraft am Hebelarm — das Moment entsteht erst daraus. */
      t.push(Svg.kraftpfeil(v, 62, -62, 62, -14, { farbe: Svg.PALETTE.rot }));
      t.push(Svg.masslinie(v, -77, 45, 62, 45, { farbe: Svg.PALETTE.neutral }));
      leg.push('skz_hebelarm');
    } else {
      return null;
    }
    leg.push('skz_nicht_masstab');
    return { t: t, leg: leg };
  }

  /* --------------------------------------------------------------------- */
  /* Einstieg                                                               */
  /* --------------------------------------------------------------------- */

  /* SCHEMATISCHE MUSTERMASSE (N8b-1).
     Beim Schritt "Profil" und "Kanten" sind die echten Masse noch gar nicht
     eingegeben — trotzdem soll man sehen, WAS man da waehlt. Diese Tabelle
     liefert deshalb einen Satz Zeichenmasse je Profil, den schaubild.js dann
     ganz normal zeichnet. Es wird also NICHT zweimal gezeichnet: das echte
     Nahtbild und das Musterbild kommen aus derselben Quelle.
     DIE ZAHLEN SIND ZEICHENMASSE, KEINE BAUTEILMASSE. Sie stehen in keinem
     Ergebnis, gehen in keine Rechnung und werden nie in ein Feld
     uebernommen. Sobald der Anwender eigene Masse eingibt, zeichnet
     schaubild.js diese. */
  var MUSTER = {
    blech:         { b: 120, t1: 12 },
    rohr_rechteck: { b: 120, h: 80, t1: 8, r_ecke: 0 },
    rohr_rund:     { d: 100, t1: 8 },
    vollrund:      { d: 80 },
    i_profil:      { b: 100, h: 160, tw: 8, tf: 12 },
    u_profil:      { b: 80, h: 160, tw: 8, tf: 12 },
    winkel:        { b: 100, h: 100, t1: 10 }
  };
  var MUSTER_A = 5;                      /* Zeichen-a, kein Bemessungswert */

  /* Liefert eine Profileingabe mit Mustermassen — oder null, wenn das
     Profil unbekannt ist. Die Kanten werden durchgereicht, damit man im
     Kanten-Schritt sieht, WELCHE Kanten geschweisst werden. */
  function muster(profil, kanten) {
    if (!profil || !Object.prototype.hasOwnProperty.call(MUSTER, profil)) return null;
    var e = { profil: profil, kanten: kanten || 'rundum', a: MUSTER_A, endkrater: false }, k;
    for (k in MUSTER[profil]) {
      if (Object.prototype.hasOwnProperty.call(MUSTER[profil], k)) e[k] = MUSTER[profil][k];
    }
    return e;
  }

  function hat(gruppe) {
    for (var i = 0; i < GRUPPEN.length; i++) if (GRUPPEN[i] === gruppe) return true;
    return false;
  }

  /* Zeichnet die Skizze zu EINER Auswahl. Liefert wie schaubild.js und
     symbol.js ein {ok, svg, legende} — dieselbe Form, damit die Oberflaeche
     die drei Quellen gleich behandeln kann. */
  function zeichne(gruppe, option, svglib) {
    var Svg = svglib || (typeof self !== 'undefined' ? self.DTNSvgLib : null) ||
              (typeof global !== 'undefined' ? global.DTNSvgLib : null);
    if (!Svg) return leer('msg_skizze_kein_svglib');
    if (!hat(gruppe)) return leer('msg_skizze_keine_zu_gruppe');
    if (!option) return leer('msg_skizze_keine_auswahl');

    var v = sichtVon(Svg), r = null;
    if (gruppe === 'stossart') r = stossart(Svg, v, option);
    else if (gruppe === 'lastfall') r = lastfall(Svg, v, option);
    else if (gruppe === 'rechenrichtung') r = rechenrichtung(Svg, v, option);
    else if (gruppe === 'lasteingabe') r = lasteingabe(Svg, v, option);
    if (!r) return leer('msg_skizze_keine_zu_option');

    return {
      ok: true, gruppe: gruppe, option: option,
      svg: Svg.svg(v, r.t.join(''), { klasse: 'skizze-svg' }),
      legende: r.leg.slice(),
      masstaeblich: false
    };
  }

  return {
    NAME: NAME, VERSION: VERSION,
    GRUPPEN: GRUPPEN, OHNE_SKIZZE: OHNE_SKIZZE, LEGENDE_CODES: LEGENDE_CODES,
    RAHMEN: RAHMEN, MUSTER: MUSTER, MUSTER_A: MUSTER_A,
    hat: hat, muster: muster, zeichne: zeichne
  };
}));
