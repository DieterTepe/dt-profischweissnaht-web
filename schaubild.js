/* ============================================================================
 * DT-ProfiSchweissnaht · schaubild.js  (DTNSchaubild)
 * Baustein N2c — NAHTBILD-GRAFIK. Segmente -> SVG-Vorschau.
 *
 * GRUNDSATZ (Schweissnaht-1.md 2.2b): Die Auswahl-Skizze ist KEIN separat
 * gezeichnetes Symbol, sondern die LIVE-VORSCHAU des gerechneten Nahtbilds.
 * Gezeichnet werden genau dieselben Segmente, die auch gerechnet werden —
 * eine Quelle, sie kann nie auseinanderlaufen. Aendert der Anwender die
 * Kantenauswahl, erscheint bzw. verschwindet die Naht sofort.
 *
 * DIESES MODUL RECHNET NICHTS. Es bekommt
 *   - segmente[] + info[]  aus profil.js (4.6)   -> Lage, Gruppe, Herkunft
 *   - das Ergebnis         aus naht.js  (4.5)    -> Schwerpunkt
 *   - die Kontur           aus profil.js         -> nicht geschweisste Kanten
 * und macht daraus einen SVG-String plus Legendendaten (CODES, keine Texte).
 *
 * VIER DINGE MUSS DIE GRAFIK EHRLICH ZEIGEN:
 *   1. WAS geschweisst ist  -> farbig, dick, nach Segmentgruppe eingefaerbt.
 *   2. WAS NICHT geschweisst ist -> duenn gestrichelt (die volle Profilkontur).
 *      Der Anwender muss auf einen Blick sehen, was er nicht gewaehlt hat.
 *   3. WO die Ecklueckenannahme sitzt -> bei Hohlprofilen mit Eckradius wird
 *      der Bogen nicht mitgerechnet (4.6); die Luecke wird sichtbar markiert.
 *   4. WO der Schwerpunkt liegt -> Kreuz plus y-/z-Achse durch den Schwerpunkt.
 *
 * KEIN TEXT IM SVG (4.3). Beschriftet wird ueber die Legendendaten in der HTML.
 * Der Massstab ist automatisch: ein 20-mm-Bolzen fuellt die Flaeche genauso wie
 * ein 1000-mm-Traeger. Die Naht wird strichbreit SYMBOLISCH dargestellt — das
 * a-Mass ist nicht massstaeblich, das steht als Hinweis im Ergebnis.
 *
 * DOM-frei · UMD/IIFE · deterministisch · mutiert seine Eingaben nicht.
 * ========================================================================== */
(function (root, factory) {
  var hatReq = (typeof require === 'function' && typeof module === 'object');
  var api = factory(
    hatReq ? require('./svglib.js') : root.DTNSvgLib,
    hatReq ? require('./naht.js') : root.DTNNaht,
    hatReq ? require('./profil.js') : root.DTNProfil
  );
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNSchaubild = api;
}(typeof self !== 'undefined' ? self : this, function (Svg, Naht, Profil) {
  'use strict';

  var VERSION = '0.1.0-N2c';
  var TOL = 1e-6;

  /* Reihenfolge der Segmentgruppen — feste Reihenfolge = deterministische
     Legende. Deckt sich mit DTNProfil.SEGMENTGRUPPEN (dort gepflegt). */
  var GRUPPEN = ['flanke', 'stirn', 'flansch', 'steg', 'kante', 'kreis'];

  /* Eine Farbe je Segmentgruppe. Beschriftet wird ueber die vorhandenen
     i18n-Schluessel sg_<gruppe> (4.6) — hier steht nur die Farbe. */
  var FARBEN = {
    flanke:  Svg && Svg.PALETTE ? Svg.PALETTE.blau : '#3d9ae0',
    stirn:   Svg && Svg.PALETTE ? Svg.PALETTE.bernstein : '#e0a53a',
    flansch: Svg && Svg.PALETTE ? Svg.PALETTE.gruen : '#4cc07a',
    steg:    Svg && Svg.PALETTE ? Svg.PALETTE.violett : '#b07ae0',
    kante:   Svg && Svg.PALETTE ? Svg.PALETTE.lachs : '#e0705a',
    kreis:   Svg && Svg.PALETTE ? Svg.PALETTE.tuerkis : '#38c0c0'
  };

  /* Farben der Hilfsdarstellungen. 'currentColor' erbt die Schriftfarbe und
     passt sich damit von selbst an Hell/Dunkel an. */
  var SONDER = {
    naht:        FARBEN.flanke,                                   /* ohne Gruppenangabe */
    kontur:      Svg && Svg.PALETTE ? Svg.PALETTE.neutral : 'currentColor',
    achsen:      Svg && Svg.PALETTE ? Svg.PALETTE.neutral : 'currentColor',
    luecke:      Svg && Svg.PALETTE ? Svg.PALETTE.neutral : 'currentColor',
    schwerpunkt: Svg && Svg.PALETTE ? Svg.PALETTE.rot : '#d64545'
  };

  /* Alle Meldungscodes dieses Moduls — dreisprachig in i18n_kern.js. */
  var CODES = [
    /* Fehler */
    'msg_grafik_leer',
    'msg_grafik_keine_svglib',
    /* Hinweise */
    'msg_grafik_symbolisch',
    'msg_grafik_kontur_gestrichelt',
    'msg_grafik_eckluecke_sichtbar',
    'msg_grafik_massstab_auto'
  ];

  /* Legenden-Codes der Hilfsdarstellungen (die Gruppen nutzen sg_<gruppe>). */
  var LEGENDE_CODES = ['sb_naht', 'sb_kontur', 'sb_eckluecke', 'sb_schwerpunkt', 'sb_achsen'];

  /* --------------------------------------------------------------------- */
  /* Kleinwerkzeug                                                          */
  /* --------------------------------------------------------------------- */
  function istZahl(x) { return typeof x === 'number' && isFinite(x); }

  function enden(s) {
    if (!s || s.typ !== 'linie') return null;
    return [{ y: s.y1, z: s.z1 }, { y: s.y2, z: s.z2 }];
  }

  function laengeVon(s) {
    if (!s) return 0;
    if (s.typ === 'kreis') return Math.PI * s.d;
    var dy = s.y2 - s.y1, dz = s.z2 - s.z1;
    return Math.sqrt(dy * dy + dz * dz);
  }

  /* Alle Eckpunkte einer Segmentliste — Futter fuer die Bounding-Box. */
  function punkteVon(segmente) {
    var p = [], i, s;
    if (!segmente) return p;
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (!s) continue;
      if (s.typ === 'kreis') {
        var r = Math.abs(s.d) / 2;
        p.push({ y: s.y - r, z: s.z - r });
        p.push({ y: s.y + r, z: s.z + r });
      } else if (s.typ === 'linie') {
        p.push({ y: s.y1, z: s.z1 });
        p.push({ y: s.y2, z: s.z2 });
      }
    }
    return p;
  }

  function abstand(a, b) {
    var dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dy * dy + dz * dz);
  }

  /* --------------------------------------------------------------------- */
  /* Ecklücken finden                                                       */
  /*                                                                        */
  /* Eine Ecklücke ist die Stelle, an der zwei aufeinanderfolgende Segmente */
  /* DERSELBEN Raupe sich nicht beruehren — genau das passiert beim         */
  /* Hohlprofil mit Eckradius, weil der Bogen bewusst nicht gerechnet wird  */
  /* (4.6). Erkannt wird das ausschliesslich ueber info[].raupe /           */
  /* info[].geschlossen, also ueber die dokumentierte Schnittstelle —       */
  /* nicht geraten. Ohne info[] gibt es keine Lueckenmarkierung.            */
  /* --------------------------------------------------------------------- */
  function luecken(segmente, info, maxWeite) {
    var out = [];
    if (!segmente || !info || info.length !== segmente.length) return out;

    var raupen = {}, reihenfolge = [], i, r;
    for (i = 0; i < info.length; i++) {
      r = info[i] && info[i].raupe;
      if (r === undefined || r === null) continue;
      if (!raupen[r]) { raupen[r] = { idx: [], geschlossen: !!(info[i] && info[i].geschlossen) }; reihenfolge.push(r); }
      raupen[r].idx.push(i);
    }

    for (var k = 0; k < reihenfolge.length; k++) {
      var raupe = raupen[reihenfolge[k]], idx = raupe.idx;
      if (idx.length < 2) continue;
      var paare = [], j;
      for (j = 0; j < idx.length - 1; j++) paare.push([idx[j], idx[j + 1]]);
      if (raupe.geschlossen) paare.push([idx[idx.length - 1], idx[0]]);

      for (j = 0; j < paare.length; j++) {
        var A = enden(segmente[paare[j][0]]), B = enden(segmente[paare[j][1]]);
        if (!A || !B) continue;
        /* das naechstliegende Endenpaar bestimmt die Fuge — die Segmente
           koennen in beliebiger Richtung gespeichert sein */
        var best = null, a2, b2, d;
        for (a2 = 0; a2 < 2; a2++) {
          for (b2 = 0; b2 < 2; b2++) {
            d = abstand(A[a2], B[b2]);
            if (best === null || d < best.d) best = { d: d, p: A[a2], q: B[b2] };
          }
        }
        if (!best || best.d <= TOL) continue;                 /* sie beruehren sich */
        if (istZahl(maxWeite) && best.d > maxWeite) continue;  /* keine Ecke, sondern zwei getrennte Stuecke */
        out.push({ y1: best.p.y, z1: best.p.z, y2: best.q.y, z2: best.q.z, weite: best.d });
      }
    }
    return out;
  }

  /* --------------------------------------------------------------------- */
  /* zeichne() — Hauptfunktion                                              */
  /*                                                                        */
  /* Eingabe:                                                               */
  /*   segmente[]   Pflicht, naht.js-Format                                 */
  /*   info[]       optional, aus profil.js (Gruppe, Raupe, geschlossen)    */
  /*   ergebnis     optional, aus naht.js (fuer den Schwerpunkt)            */
  /*   kontur[]     optional, die volle Profilkontur (gestrichelt)          */
  /*   breite/hoehe/rand, schwerpunkt, achsen, luecken, rahmen              */
  /* --------------------------------------------------------------------- */
  function zeichne(eingabe) {
    var e = eingabe || {};
    var fehler = [], warnungen = [], hinweise = [];

    function raus() {
      return { ok: false, version: VERSION, svg: '', legende: [], gruppen: [],
               fehler: fehler, warnungen: warnungen, hinweise: hinweise };
    }

    if (!Svg) { fehler.push({ code: 'msg_grafik_keine_svglib' }); return raus(); }
    var segmente = e.segmente;
    if (!segmente || !segmente.length) { fehler.push({ code: 'msg_grafik_leer' }); return raus(); }

    var info = (e.info && e.info.length === segmente.length) ? e.info : null;
    var kontur = (e.kontur && e.kontur.length) ? e.kontur : null;

    /* --- Sicht: Box aus Naht UND Kontur. Damit bleibt der Massstab gleich,
           wenn der Anwender die Kantenauswahl aendert — das Bild springt
           nicht, es verschwindet nur Naht. --- */
    var bN = Svg.box(punkteVon(segmente));
    var bK = kontur ? Svg.box(punkteVon(kontur)) : null;
    var b = bK ? Svg.boxVereinigen(bN, bK) : bN;
    var v = Svg.sicht(b, { breite: e.breite, hoehe: e.hoehe, rand: e.rand, skala_max: e.skala_max });

    var dickNaht = istZahl(e.strichbreite) ? e.strichbreite : 3.2;
    var dickKontur = istZahl(e.strichbreite_kontur) ? e.strichbreite_kontur : 1;

    var teile = '', i, s, gruppe, farbe;

    if (e.rahmen) teile += Svg.rahmen(v, {});

    /* --- 1. nicht geschweisste Kanten: duenn, gestrichelt --- */
    var nKontur = 0;
    if (kontur) {
      for (i = 0; i < kontur.length; i++) {
        s = kontur[i];
        if (!s) continue;
        if (s.typ === 'kreis') {
          teile += Svg.kreis(v, s.y, s.z, s.d, { farbe: SONDER.kontur, breite: dickKontur,
                    strich: '5 4', deckung: 0.5, code: 'kontur' });
        } else {
          teile += Svg.linie(v, s.y1, s.z1, s.y2, s.z2, { farbe: SONDER.kontur, breite: dickKontur,
                    strich: '5 4', deckung: 0.5, code: 'kontur' });
        }
        nKontur++;
      }
    }

    /* --- 2. Ecklücken sichtbar machen (Rechenannahme, 4.6) --- */
    var lue = [];
    if (e.luecken !== false && info) {
      var maxW = Math.max(b.breite, b.hoehe) * 0.5;
      lue = luecken(segmente, info, maxW > 0 ? maxW : undefined);
      for (i = 0; i < lue.length; i++) {
        teile += Svg.linie(v, lue[i].y1, lue[i].z1, lue[i].y2, lue[i].z2,
                 { farbe: SONDER.luecke, breite: 1.2, strich: '1.5 2.5', deckung: 0.85, code: 'eckluecke' });
      }
    }

    /* --- 3. die geschweissten Segmente, farbig nach Segmentgruppe --- */
    var summe = {}, anzahl = {}, gesehen = [];
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (!s) continue;
      gruppe = (info && info[i] && info[i].gruppe) ? info[i].gruppe : null;
      farbe = (gruppe && FARBEN[gruppe]) ? FARBEN[gruppe] : SONDER.naht;
      var schl = gruppe && FARBEN[gruppe] ? gruppe : '_naht';
      if (!anzahl[schl]) { anzahl[schl] = 0; summe[schl] = 0; gesehen.push(schl); }
      anzahl[schl]++;
      summe[schl] += laengeVon(s);

      var o = { farbe: farbe, breite: dickNaht, kappe: 'butt',
                code: (s.code || gruppe || 'naht'), gruppe: gruppe || 'naht' };
      if (s.typ === 'kreis') teile += Svg.kreis(v, s.y, s.z, s.d, o);
      else teile += Svg.linie(v, s.y1, s.z1, s.y2, s.z2, o);
    }

    /* --- 4. Schwerpunkt und Achsen --- */
    var sp = null;
    if (e.ergebnis && e.ergebnis.ok !== false &&
        istZahl(e.ergebnis.ys) && istZahl(e.ergebnis.zs)) {
      sp = { ys: e.ergebnis.ys, zs: e.ergebnis.zs };
    }
    if (sp && e.achsen !== false) teile += Svg.achsenkreuz(v, sp.ys, sp.zs, { farbe: SONDER.achsen });
    if (sp && e.schwerpunkt !== false) {
      teile += Svg.schwerpunktkreuz(v, sp.ys, sp.zs, { farbe: SONDER.schwerpunkt, code: 'schwerpunkt' });
    }

    /* --- 5. Legende: nur CODES und Farben, keine fertigen Texte --- */
    var legende = [], gruppen = [], g;
    for (i = 0; i < GRUPPEN.length; i++) {
      g = GRUPPEN[i];
      if (!anzahl[g]) continue;
      gruppen.push(g);
      legende.push({ code: 'sg_' + g, art: 'naht', gruppe: g, farbe: FARBEN[g],
                     n_seg: anzahl[g], l: summe[g], stil: 'voll' });
    }
    if (anzahl._naht) {
      legende.push({ code: 'sb_naht', art: 'naht', gruppe: null, farbe: SONDER.naht,
                     n_seg: anzahl._naht, l: summe._naht, stil: 'voll' });
    }
    if (nKontur) {
      legende.push({ code: 'sb_kontur', art: 'kontur', gruppe: null, farbe: SONDER.kontur,
                     n_seg: nKontur, l: null, stil: 'gestrichelt' });
    }
    if (lue.length) {
      legende.push({ code: 'sb_eckluecke', art: 'luecke', gruppe: null, farbe: SONDER.luecke,
                     n_seg: lue.length, l: null, stil: 'gepunktet' });
    }
    if (sp && e.schwerpunkt !== false) {
      legende.push({ code: 'sb_schwerpunkt', art: 'schwerpunkt', gruppe: null,
                     farbe: SONDER.schwerpunkt, n_seg: 1, l: null, stil: 'kreuz' });
    }
    if (sp && e.achsen !== false) {
      legende.push({ code: 'sb_achsen', art: 'achsen', gruppe: null, farbe: SONDER.achsen,
                     n_seg: 2, l: null, stil: 'strichpunkt' });
    }

    /* --- 6. ehrliche Hinweise --- */
    hinweise.push({ code: 'msg_grafik_symbolisch' });
    hinweise.push({ code: 'msg_grafik_massstab_auto', wert: v.mm_je_px });
    if (nKontur) hinweise.push({ code: 'msg_grafik_kontur_gestrichelt' });
    if (lue.length) hinweise.push({ code: 'msg_grafik_eckluecke_sichtbar', anzahl: lue.length });

    return {
      ok: true,
      version: VERSION,
      svg: Svg.svg(v, teile, { klasse: e.klasse || 'nahtbild-svg', id: e.id }),
      legende: legende,
      gruppen: gruppen,
      n_seg: segmente.length,
      n_kontur: nKontur,
      n_luecken: lue.length,
      luecken: lue,
      schwerpunkt: sp,
      box: { y_min: b.y_min, y_max: b.y_max, z_min: b.z_min, z_max: b.z_max,
             breite: b.breite, hoehe: b.hoehe },
      sicht: { breite: v.breite, hoehe: v.hoehe, rand: v.rand, skala: v.skala },
      mm_je_px: v.mm_je_px,
      gezeichnet: { breite: v.pl(b.breite), hoehe: v.pl(b.hoehe) },
      fehler: [], warnungen: warnungen, hinweise: hinweise
    };
  }

  /* --------------------------------------------------------------------- */
  /* ausProfil() — der bequeme Weg fuer die Oberflaeche                     */
  /*                                                                        */
  /* Nimmt exakt dieselbe Eingabe wie DTNProfil.baue() und erledigt alles:  */
  /*   1. Nahtbild bauen (profil.js)                                        */
  /*   2. Kontur holen — dafuer wird baue() ein ZWEITES Mal aufgerufen, mit */
  /*      kanten:'rundum' und OHNE Endkraterabzug. Das ist keine neue       */
  /*      Schnittstelle, sondern die vorhandene, zweimal benutzt (5.1).     */
  /*      Ohne Endkraterabzug, weil die Kontur die BAUTEILKANTE zeigt und   */
  /*      keine Naht ist.                                                   */
  /*   3. Schwerpunkt rechnen (naht.js)                                     */
  /*   4. zeichnen                                                          */
  /* --------------------------------------------------------------------- */
  function ausProfil(eingabe, opt) {
    var e = eingabe || {}, o = opt || {};
    var fehler = [];
    if (!Profil) { fehler.push({ code: 'msg_grafik_keine_svglib' }); }
    if (fehler.length) {
      return { ok: false, version: VERSION, svg: '', legende: [], gruppen: [],
               fehler: fehler, warnungen: [], hinweise: [] };
    }

    var p = Profil.baue(e);
    if (!p.ok) {
      return { ok: false, version: VERSION, svg: '', legende: [], gruppen: [],
               profil: p, ergebnis: null,
               fehler: p.fehler.slice(), warnungen: p.warnungen.slice(), hinweise: p.hinweise.slice() };
    }

    /* Kontur: dieselbe Eingabe, aber rundum und ohne Endkraterabzug. */
    var ke = {}, k;
    for (k in e) if (Object.prototype.hasOwnProperty.call(e, k)) ke[k] = e[k];
    ke.kanten = 'rundum';
    ke.endkrater = false;
    var kontur = null;
    if (o.kontur !== false) {
      var pk = Profil.baue(ke);
      if (pk.ok) kontur = pk.segmente;
    }

    var r = (Naht && Naht.rechne) ? Naht.rechne(p.segmente, { modell: o.modell }) : null;

    var bild = zeichne({
      segmente: p.segmente,
      info: p.info,
      ergebnis: (r && r.ok) ? r : null,
      kontur: kontur,
      breite: o.breite, hoehe: o.hoehe, rand: o.rand,
      strichbreite: o.strichbreite, rahmen: o.rahmen,
      schwerpunkt: o.schwerpunkt, achsen: o.achsen, luecken: o.luecken,
      klasse: o.klasse, id: o.id
    });

    bild.profil = p;          /* Ergebnis von profil.js  (Laengen, Hinweise) */
    bild.ergebnis = r;        /* Ergebnis von naht.js    (Querschnittswerte) */
    return bild;
  }

  return {
    VERSION: VERSION,
    GRUPPEN: GRUPPEN,
    FARBEN: FARBEN,
    SONDER: SONDER,
    CODES: CODES,
    LEGENDE_CODES: LEGENDE_CODES,
    luecken: luecken,
    zeichne: zeichne,
    ausProfil: ausProfil
  };
}));
