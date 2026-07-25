/* ============================================================================
 * DT-ProfiSchweissnaht · svglib.js  (DTNSvgLib)
 * Baustein N2c — SVG-BAUSTEINBIBLIOTHEK (Schweissnaht-1.md 4.3).
 *
 * GRUNDSATZ: Skizzen werden SELBST gezeichnet. Aus Lehrbuechern, Arbeiten oder
 * fremden Programmen wird nichts uebernommen (Bildrechte). Jede spaetere Skizze
 * ist damit nur noch eine kurze Datenzeile statt einer eigenen Grafikdatei —
 * bei 80..90 Kerbfaellen plus Nahtarten, Fugenformen und ISO-2553-Symbolen ist
 * das der wirksamste Hebel gegen das Groessenproblem.
 *
 * HARTE REGEL: KEIN TEXT IM SVG. Es wird kein <text>/<tspan> erzeugt. Zahlen
 * und Beschriftungen stehen in der HTML-Legende — sonst waeren sie nicht
 * uebersetzbar (DE/EN/PT). Statt Text traegt jeder Baustein ein data-code-
 * Attribut mit einem sprachneutralen Code, an dem die Legende andockt.
 *
 * KOORDINATEN wie im ganzen Programm: y waagerecht, z senkrecht, alles in mm.
 *   z zeigt nach OBEN (Technik), die SVG-Y-Achse zeigt nach UNTEN — die Sicht
 *   dreht das um. Wer y/z in mm liefert, bekommt eine richtig herum stehende
 *   Zeichnung.
 *
 * AUTO-SKALIERUNG: sicht(box, ...) legt Massstab und Mitte so fest, dass das
 *   Bild die Zeichenflaeche ausfuellt. Damit sieht ein 20-mm-Bolzen genauso
 *   gut aus wie ein 1000-mm-Traeger.
 *
 * DOM-frei · UMD/IIFE · keine Abhaengigkeiten · deterministisch:
 * gleiche Eingabe -> zeichengenau gleicher String (im Harness abgesichert).
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNSvgLib = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.1.0-N2c';

  /* Zeichenflaeche in Pixeln (viewBox-Einheiten), Voreinstellung Handy. */
  var BREITE = 320, HOEHE = 240, RAND = 16;

  /* Palette. Bewusst so gewaehlt, dass jede Farbe auf hellem UND auf dunklem
     Hintergrund lesbar bleibt (die Oberflaeche startet dunkel, 3.1). */
  var PALETTE = {
    blau:    '#3d9ae0',
    bernstein:'#e0a53a',
    gruen:   '#4cc07a',
    violett: '#b07ae0',
    lachs:   '#e0705a',
    tuerkis: '#38c0c0',
    rot:     '#d64545',
    /* 'currentColor' erbt die Schriftfarbe der Karte und passt sich damit von
       selbst an Hell/Dunkel an — fuer Hilfslinien genau richtig. */
    neutral: 'currentColor'
  };

  var TOL = 1e-9;

  /* --------------------------------------------------------------------- */
  /* Kleinwerkzeug                                                          */
  /* --------------------------------------------------------------------- */
  function istZahl(x) { return typeof x === 'number' && isFinite(x); }

  /* Zahlformat fuer SVG-Koordinaten: 3 Nachkommastellen, ohne Exponent,
     ohne "-0", ohne unnoetige Nullen. Sprachunabhaengig (toFixed). */
  function n(x) {
    if (!istZahl(x)) return '0';
    var s = x.toFixed(3);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (s === '-0') s = '0';
    return s;
  }

  /* data-code: nur sprachneutrale Zeichen zulassen (kein Text, keine Zitate). */
  function code(c) {
    if (!c && c !== 0) return '';
    return String(c).replace(/[^A-Za-z0-9_.\-]/g, '');
  }

  /* Gemeinsame Attribute aller Bausteine. */
  function attr(o) {
    o = o || {};
    var s = '';
    if (o.farbe) s += ' stroke="' + o.farbe + '"';
    if (istZahl(o.breite)) s += ' stroke-width="' + n(o.breite) + '"';
    s += ' fill="' + (o.fuellung || 'none') + '"';
    if (o.strich) s += ' stroke-dasharray="' + o.strich + '"';
    if (istZahl(o.deckung)) s += ' opacity="' + n(o.deckung) + '"';
    if (o.kappe) s += ' stroke-linecap="' + o.kappe + '"';
    if (o.code) s += ' data-code="' + code(o.code) + '"';
    if (o.gruppe) s += ' data-gruppe="' + code(o.gruppe) + '"';
    return s;
  }

  /* --------------------------------------------------------------------- */
  /* Bounding-Box und Sicht (Auto-Skalierung)                               */
  /* --------------------------------------------------------------------- */
  function box(punkte) {
    var b = { y_min: 0, y_max: 0, z_min: 0, z_max: 0, breite: 0, hoehe: 0, leer: true };
    if (!punkte || !punkte.length) return b;
    var i, p, erste = true;
    for (i = 0; i < punkte.length; i++) {
      p = punkte[i];
      if (!p || !istZahl(p.y) || !istZahl(p.z)) continue;
      if (erste) { b.y_min = b.y_max = p.y; b.z_min = b.z_max = p.z; erste = false; b.leer = false; continue; }
      if (p.y < b.y_min) b.y_min = p.y;
      if (p.y > b.y_max) b.y_max = p.y;
      if (p.z < b.z_min) b.z_min = p.z;
      if (p.z > b.z_max) b.z_max = p.z;
    }
    b.breite = b.y_max - b.y_min;
    b.hoehe = b.z_max - b.z_min;
    return b;
  }

  function boxVereinigen(a, b) {
    if (!a || a.leer) return b || box([]);
    if (!b || b.leer) return a;
    return box([{ y: Math.min(a.y_min, b.y_min), z: Math.min(a.z_min, b.z_min) },
                { y: Math.max(a.y_max, b.y_max), z: Math.max(a.z_max, b.z_max) }]);
  }

  /* Sicht = Massstab + Mitte. Fuellt die Zeichenflaeche abzueglich Rand aus.
     Entartete Faelle (Breite 0 oder Hoehe 0, z. B. eine einzelne senkrechte
     Naht) werden aufgefangen — nie NaN, nie Division durch 0.               */
  function sicht(b, opt) {
    opt = opt || {};
    var B = istZahl(opt.breite) && opt.breite > 0 ? opt.breite : BREITE;
    var H = istZahl(opt.hoehe) && opt.hoehe > 0 ? opt.hoehe : HOEHE;
    var R = istZahl(opt.rand) && opt.rand >= 0 ? opt.rand : RAND;
    if (2 * R >= B) R = Math.max(0, (B - 2) / 2);
    if (2 * R >= H) R = Math.max(0, (H - 2) / 2);

    b = b || box([]);
    var dy = Math.max(0, b.breite), dz = Math.max(0, b.hoehe);
    var nutzB = Math.max(1, B - 2 * R), nutzH = Math.max(1, H - 2 * R);

    var s;
    if (dy <= TOL && dz <= TOL) s = istZahl(opt.skala) && opt.skala > 0 ? opt.skala : 1;
    else if (dy <= TOL) s = nutzH / dz;
    else if (dz <= TOL) s = nutzB / dy;
    else s = Math.min(nutzB / dy, nutzH / dz);
    if (istZahl(opt.skala_max) && opt.skala_max > 0 && s > opt.skala_max) s = opt.skala_max;
    if (!istZahl(s) || s <= 0) s = 1;

    var cy = b.leer ? 0 : (b.y_min + b.y_max) / 2;
    var cz = b.leer ? 0 : (b.z_min + b.z_max) / 2;

    var v = {
      breite: B, hoehe: H, rand: R, skala: s, mm_je_px: 1 / s,
      cy: cy, cz: cz, box: b,
      px: function (y) { return B / 2 + s * (y - cy); },
      pz: function (z) { return H / 2 - s * (z - cz); },   /* z zeigt nach oben */
      pl: function (mm) { return s * mm; }
    };
    return v;
  }

  /* --------------------------------------------------------------------- */
  /* Bausteine — alle geben reines SVG als String zurueck                   */
  /* --------------------------------------------------------------------- */
  function linie(v, y1, z1, y2, z2, o) {
    return '<line x1="' + n(v.px(y1)) + '" y1="' + n(v.pz(z1)) +
           '" x2="' + n(v.px(y2)) + '" y2="' + n(v.pz(z2)) + '"' + attr(o) + '/>';
  }

  function polylinie(v, punkte, o) {
    if (!punkte || punkte.length < 2) return '';
    var i, p = [];
    for (i = 0; i < punkte.length; i++) {
      p.push(n(v.px(punkte[i].y)) + ',' + n(v.pz(punkte[i].z)));
    }
    o = o || {};
    var tag = o.geschlossen ? 'polygon' : 'polyline';
    return '<' + tag + ' points="' + p.join(' ') + '"' + attr(o) + '/>';
  }

  function kreis(v, y, z, d, o) {
    return '<circle cx="' + n(v.px(y)) + '" cy="' + n(v.pz(z)) +
           '" r="' + n(v.pl(Math.abs(d) / 2)) + '"' + attr(o) + '/>';
  }

  /* Rechteck ueber Mittelpunkt und Aussenmasse (b in y, h in z). */
  function rechteck(v, y, z, b, h, o) {
    var x1 = v.px(y - b / 2), y1 = v.pz(z + h / 2);
    return '<rect x="' + n(x1) + '" y="' + n(y1) +
           '" width="' + n(v.pl(Math.abs(b))) + '" height="' + n(v.pl(Math.abs(h))) +
           '"' + attr(o) + '/>';
  }

  /* Nahtdreieck (Kehlnaht im Schnitt): rechtwinkliges Dreieck mit den
     Schenkeln z = a*sqrt(2) am Punkt (y,z), gedreht um `winkel` Grad.
     Wird von N6b (ISO 2553) und N14 (Kerbfaelle) mitbenutzt.               */
  function nahtdreieck(v, y, z, a, winkel, o) {
    var s = Math.abs(a) * Math.SQRT2;              /* Schenkelmass z aus a */
    var w = (istZahl(winkel) ? winkel : 0) * Math.PI / 180;
    var cs = Math.cos(w), sn = Math.sin(w);
    function dy(u, w2) { return y + u * cs - w2 * sn; }
    function dz(u, w2) { return z + u * sn + w2 * cs; }
    var pts = [{ y: dy(0, 0), z: dz(0, 0) },
               { y: dy(s, 0), z: dz(s, 0) },
               { y: dy(0, s), z: dz(0, s) }];
    o = o || {};
    var oo = { farbe: o.farbe, breite: o.breite, fuellung: o.fuellung || 'none',
               deckung: o.deckung, code: o.code, gruppe: o.gruppe, geschlossen: true };
    return polylinie(v, pts, oo);
  }

  /* Kraftpfeil: Linie + Spitze als Dreieck (kein <marker>, damit der String
     fuer sich allein steht und keine ID kollidieren kann).                  */
  function kraftpfeil(v, y1, z1, y2, z2, o) {
    o = o || {};
    var x1 = v.px(y1), Y1 = v.pz(z1), x2 = v.px(y2), Y2 = v.pz(z2);
    var dx = x2 - x1, dy = Y2 - Y1, L = Math.sqrt(dx * dx + dy * dy);
    if (L <= TOL) return '';
    var sp = istZahl(o.spitze) ? o.spitze : 8;      /* Spitzenlaenge in px */
    var ux = dx / L, uy = dy / L, qx = -uy, qy = ux;
    var bx = x2 - ux * sp, by = Y2 - uy * sp;
    var a = attr({ farbe: o.farbe, breite: o.breite, deckung: o.deckung,
                   code: o.code, gruppe: o.gruppe, kappe: 'round' });
    var f = attr({ farbe: o.farbe, breite: 0, fuellung: o.farbe || 'currentColor',
                   deckung: o.deckung });
    return '<line x1="' + n(x1) + '" y1="' + n(Y1) + '" x2="' + n(bx) + '" y2="' + n(by) + '"' + a + '/>' +
           '<polygon points="' + n(x2) + ',' + n(Y2) + ' ' +
           n(bx + qx * sp * 0.35) + ',' + n(by + qy * sp * 0.35) + ' ' +
           n(bx - qx * sp * 0.35) + ',' + n(by - qy * sp * 0.35) + '"' + f + '/>';
  }

  /* Masslinie: Linie mit zwei Endstrichen. Die ZAHL steht in der HTML-Legende,
     nicht in der Grafik (Uebersetzbarkeit).                                 */
  function masslinie(v, y1, z1, y2, z2, o) {
    o = o || {};
    var x1 = v.px(y1), Y1 = v.pz(z1), x2 = v.px(y2), Y2 = v.pz(z2);
    var dx = x2 - x1, dy = Y2 - Y1, L = Math.sqrt(dx * dx + dy * dy);
    if (L <= TOL) return '';
    var t = istZahl(o.strichlaenge) ? o.strichlaenge : 5;
    var qx = -dy / L * t, qy = dx / L * t;
    var a = attr({ farbe: o.farbe, breite: o.breite, deckung: o.deckung,
                   code: o.code, gruppe: o.gruppe });
    return '<line x1="' + n(x1) + '" y1="' + n(Y1) + '" x2="' + n(x2) + '" y2="' + n(Y2) + '"' + a + '/>' +
           '<line x1="' + n(x1 + qx) + '" y1="' + n(Y1 + qy) + '" x2="' + n(x1 - qx) + '" y2="' + n(Y1 - qy) + '"' + a + '/>' +
           '<line x1="' + n(x2 + qx) + '" y1="' + n(Y2 + qy) + '" x2="' + n(x2 - qx) + '" y2="' + n(Y2 - qy) + '"' + a + '/>';
  }

  /* Schraffur (Schnittflaeche) in einem Rechteck, 45 Grad, ohne <pattern>. */
  function schraffur(v, y, z, b, h, o) {
    o = o || {};
    var x0 = v.px(y - Math.abs(b) / 2), y0 = v.pz(z + Math.abs(h) / 2);
    var B = v.pl(Math.abs(b)), H = v.pl(Math.abs(h));
    if (B <= TOL || H <= TOL) return '';
    var d = istZahl(o.abstand) ? o.abstand : 6;     /* Linienabstand in px */
    if (d <= 0.5) d = 0.5;
    var a = attr({ farbe: o.farbe, breite: o.breite, deckung: o.deckung,
                   code: o.code, gruppe: o.gruppe });
    var out = '', t;
    for (t = -H; t <= B; t += d) {
      var xa = t, ya = 0, xb = t + H, yb = H;
      if (xa < 0) { ya = -xa; xa = 0; }
      if (xb > B) { yb = H - (xb - B); xb = B; }
      if (xb <= xa) continue;
      out += '<line x1="' + n(x0 + xa) + '" y1="' + n(y0 + ya) +
             '" x2="' + n(x0 + xb) + '" y2="' + n(y0 + yb) + '"' + a + '/>';
    }
    return out;
  }

  /* Beschriftungspunkt: kleiner Punkt mit sprachneutralem data-code.
     Die Beschriftung selbst macht die HTML-Legende.                        */
  function punktmarke(v, y, z, o) {
    o = o || {};
    var r = istZahl(o.radius) ? o.radius : 3;
    return '<circle cx="' + n(v.px(y)) + '" cy="' + n(v.pz(z)) + '" r="' + n(r) + '"' +
           attr({ farbe: o.farbe, breite: istZahl(o.breite) ? o.breite : 1,
                  fuellung: o.fuellung || o.farbe || 'currentColor',
                  deckung: o.deckung, code: o.code, gruppe: o.gruppe }) + '/>';
  }

  /* Schwerpunktkreuz: Kreis + Fadenkreuz (das uebliche Schwerpunktsymbol). */
  function schwerpunktkreuz(v, y, z, o) {
    o = o || {};
    var r = istZahl(o.radius) ? o.radius : 6;
    var x = v.px(y), Y = v.pz(z);
    var a = attr({ farbe: o.farbe || PALETTE.rot, breite: istZahl(o.breite) ? o.breite : 1.6,
                   code: o.code || 'schwerpunkt', gruppe: o.gruppe });
    return '<circle cx="' + n(x) + '" cy="' + n(Y) + '" r="' + n(r) + '"' + a + '/>' +
           '<line x1="' + n(x - r * 1.8) + '" y1="' + n(Y) + '" x2="' + n(x + r * 1.8) + '" y2="' + n(Y) + '"' + a + '/>' +
           '<line x1="' + n(x) + '" y1="' + n(Y - r * 1.8) + '" x2="' + n(x) + '" y2="' + n(Y + r * 1.8) + '"' + a + '/>';
  }

  /* Achsenkreuz durch einen Punkt, ueber die ganze Zeichenflaeche
     (Strichpunktlinie wie in der Zeichnungsnorm).                          */
  function achsenkreuz(v, y, z, o) {
    o = o || {};
    var x = v.px(y), Y = v.pz(z);
    var a = attr({ farbe: o.farbe || PALETTE.neutral,
                   breite: istZahl(o.breite) ? o.breite : 1,
                   strich: o.strich || '7 3 1.5 3',
                   deckung: istZahl(o.deckung) ? o.deckung : 0.45,
                   code: o.code || 'achsen', gruppe: o.gruppe });
    return '<line x1="0" y1="' + n(Y) + '" x2="' + n(v.breite) + '" y2="' + n(Y) + '"' + a + '/>' +
           '<line x1="' + n(x) + '" y1="0" x2="' + n(x) + '" y2="' + n(v.hoehe) + '"' + a + '/>';
  }

  /* Rahmen der Zeichenflaeche (optional, hilft beim Pruefen der Skalierung). */
  function rahmen(v, o) {
    o = o || {};
    return '<rect x="0.5" y="0.5" width="' + n(v.breite - 1) + '" height="' + n(v.hoehe - 1) + '"' +
           attr({ farbe: o.farbe || PALETTE.neutral, breite: istZahl(o.breite) ? o.breite : 1,
                  deckung: istZahl(o.deckung) ? o.deckung : 0.25, code: o.code || 'rahmen' }) + '/>';
  }

  /* Huelle. KEIN <text>, kein Bild, keine externe Referenz.                */
  function svg(v, inhalt, o) {
    o = o || {};
    var kl = o.klasse ? ' class="' + code(o.klasse) + '"' : '';
    var id2 = o.id ? ' data-id="' + code(o.id) + '"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n(v.breite) + ' ' + n(v.hoehe) +
           '" width="100%" preserveAspectRatio="xMidYMid meet" role="img"' + kl + id2 + '>' +
           (inhalt || '') + '</svg>';
  }

  return {
    VERSION: VERSION,
    BREITE: BREITE, HOEHE: HOEHE, RAND: RAND,
    PALETTE: PALETTE,
    zahl: n,
    box: box,
    boxVereinigen: boxVereinigen,
    sicht: sicht,
    linie: linie,
    polylinie: polylinie,
    kreis: kreis,
    rechteck: rechteck,
    nahtdreieck: nahtdreieck,
    kraftpfeil: kraftpfeil,
    masslinie: masslinie,
    schraffur: schraffur,
    punktmarke: punktmarke,
    schwerpunktkreuz: schwerpunktkreuz,
    achsenkreuz: achsenkreuz,
    rahmen: rahmen,
    svg: svg
  };
}));
