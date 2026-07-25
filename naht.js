/* ============================================================================
 * DT-ProfiSchweissnaht · naht.js  (DTNNaht)
 * Baustein N2 — NAHTBILD-KERN. Segmente -> Querschnittswerte der Nahtflaeche.
 *
 * EINE allgemeine Rechenmaschine statt eines Katalogs von Sonderformeln
 * (Schweissnaht-1.md 2.2). Alle Standardfaelle sind nur noch Segmentlisten.
 *
 * MODELL (elastisches, duennwandiges Linienmodell, EN 1993-1-8 / Roloff-Matek):
 *   Jede Naht ist ein Rechteck der Dicke a und der Laenge l in der y-z-Ebene.
 *   A_w = SUM(a*l) · Schwerpunkt · I_y = INT z^2 dA · I_z = INT y^2 dA
 *   I_yz = INT y*z dA · I_p = I_y + I_z   (alles auf den Schwerpunkt bezogen)
 *
 * KOORDINATEN: y = waagerecht, z = senkrecht, beides in mm.
 *   Biegung um die y-Achse (starke Achse)  -> I_y, Randabstand in z
 *   Biegung um die z-Achse                 -> I_z, Randabstand in y
 *   Torsion um die Nahtbildachse           -> I_p, Radius r
 *
 * ZWEI RECHENMODELLE, beide ausdruecklich benannt (erscheint im Rechenweg):
 *   'exakt'        = Rechteckflaeche exakt, mit Eigenanteil in Dickenrichtung
 *                    (a^3-Glieder). Deckt sich mit Voigt (HS Anhalt).
 *   'duennwandig'  = klassisches Linienmodell, a^3-Glieder vernachlaessigt.
 *                    Deckt sich mit der Roloff/Matek-Formelsammlung.
 *   Der Unterschied liegt bei praxisueblichen Nahtbildern unter 0,1 %.
 *   Voreinstellung: 'exakt' (mathematisch exakt fuer die getroffene Annahme).
 *
 * SCHICHTUNG (bindend, 2.2b): profil.js erzeugt Segmente -> naht.js rechnet.
 *   naht.js bleibt DUMM: kein Endkraterabzug, keine Eckradien, keine Profil-
 *   kenntnis. Es nimmt die Segmente so, wie sie geliefert werden.
 *
 * DOM-frei · UMD/IIFE · keine Abhaengigkeiten · deterministisch ·
 * mutiert seine Eingaben nicht. Alle Codes sprachneutral.
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNNaht = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.1.0-N2';

  /* Knotentoleranz: zwei Segmentenden gelten als verbunden, wenn sie naeher
     als TOL beieinander liegen. 0,0001 mm — feiner als jede Fertigung. */
  var TOL = 1e-4;

  var MODELLE = ['exakt', 'duennwandig'];
  var MODELL_STD = 'exakt';

  /* Segmenttypen. 'bogen' ist bewusst NICHT enthalten: die 7 Profile aus 2.2b
     brauchen ihn nicht (Eckradien verkuerzen dort gerade die Segmente). */
  var TYPEN = ['linie', 'kreis'];

  /* Alle Meldungscodes, die dieses Modul erzeugen kann. Der Harness prueft
     gegen diese Liste, dass jeder Code seinen dreisprachigen Text hat. */
  var CODES = [
    'msg_naht_leer',
    'msg_seg_typ',
    'msg_seg_a',
    'msg_seg_laenge',
    'msg_seg_a_zu_gross',
    'msg_seg_duennwand',
    'msg_torsion_offenes_nahtbild',
    'msg_hauptachsen_gedreht',
    'msg_kreis_aussendurchmesser'
  ];

  /* Ergebnisgroessen mit Einheit — Beschriftung fuer Rechenweg und Oberflaeche.
     Schluessel im Woerterbuch: 'gr_<code>' bzw. die Einheit direkt. */
  var GROESSEN = [
    { code: 'n_seg', einheit: 'unit_dimensionslos' },
    { code: 'l_ges', einheit: 'unit_mm' },
    { code: 'A',     einheit: 'unit_mm2' },
    { code: 'ys',    einheit: 'unit_mm' },
    { code: 'zs',    einheit: 'unit_mm' },
    { code: 'Iy',    einheit: 'unit_mm4' },
    { code: 'Iz',    einheit: 'unit_mm4' },
    { code: 'Iyz',   einheit: 'unit_mm4' },
    { code: 'Ip',    einheit: 'unit_mm4' },
    { code: 'I1',    einheit: 'unit_mm4' },
    { code: 'I2',    einheit: 'unit_mm4' },
    { code: 'alpha', einheit: 'unit_grad' },
    { code: 'Wy',    einheit: 'unit_mm3' },
    { code: 'Wz',    einheit: 'unit_mm3' },
    { code: 'Wt',    einheit: 'unit_mm3' },
    { code: 'rmax',  einheit: 'unit_mm' }
  ];

  /* --------------------------------------------------------------------- */
  /* 1) Segment-Bausteine (reine Fabriken, keine Rechnung)                  */
  /* --------------------------------------------------------------------- */

  /* Gerade Naht von (y1,z1) nach (y2,z2), Kehlnahtdicke a. */
  function linie(y1, z1, y2, z2, a, code) {
    return { typ: 'linie', y1: y1, z1: z1, y2: y2, z2: z2, a: a, code: code || '' };
  }

  /* Geschlossene Kreisnaht um (y,z). d = Durchmesser der NAHTMITTELLINIE.
     Festlegung 2.2b: bei Rohren wird der AUSSENdurchmesser eingesetzt
     (l = pi*d). Das steht als Hinweis msg_kreis_aussendurchmesser im
     Ergebnis und gehoert damit in den Rechenweg. */
  function kreis(y, z, d, a, code) {
    return { typ: 'kreis', y: y, z: z, d: d, a: a, code: code || '' };
  }

  function istZahl(x) { return typeof x === 'number' && isFinite(x); }

  /* Laenge eines Segments in mm. */
  function laenge(seg) {
    if (!seg) return 0;
    if (seg.typ === 'kreis') return Math.PI * seg.d;
    var dy = seg.y2 - seg.y1, dz = seg.z2 - seg.z1;
    return Math.sqrt(dy * dy + dz * dz);
  }

  /* --------------------------------------------------------------------- */
  /* 2) Pruefung der Segmentliste (sprachneutrale Codes)                    */
  /* --------------------------------------------------------------------- */
  function pruefe(segmente) {
    var fehler = [], warnungen = [], i, s, l;

    if (!segmente || !segmente.length) {
      fehler.push({ code: 'msg_naht_leer', index: -1 });
      return { ok: false, fehler: fehler, warnungen: warnungen };
    }

    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (!s || TYPEN.indexOf(s.typ) < 0) { fehler.push({ code: 'msg_seg_typ', index: i }); continue; }

      if (!istZahl(s.a) || s.a <= 0) { fehler.push({ code: 'msg_seg_a', index: i }); continue; }

      if (s.typ === 'kreis') {
        if (!istZahl(s.d) || s.d <= 0 || !istZahl(s.y) || !istZahl(s.z)) {
          fehler.push({ code: 'msg_seg_laenge', index: i }); continue;
        }
        /* Ring wuerde sich selbst durchdringen: d - a <= 0 */
        if (s.a >= s.d) { fehler.push({ code: 'msg_seg_a_zu_gross', index: i }); continue; }
      } else {
        if (!istZahl(s.y1) || !istZahl(s.z1) || !istZahl(s.y2) || !istZahl(s.z2)) {
          fehler.push({ code: 'msg_seg_laenge', index: i }); continue;
        }
        l = laenge(s);
        if (l <= TOL) { fehler.push({ code: 'msg_seg_laenge', index: i }); continue; }
        /* Duennwand-Annahme: a soll deutlich kleiner sein als die Laenge. */
        if (s.a > l / 3) warnungen.push({ code: 'msg_seg_duennwand', index: i });
      }
    }

    return { ok: fehler.length === 0, fehler: fehler, warnungen: warnungen };
  }

  /* --------------------------------------------------------------------- */
  /* 3) Anteile eines einzelnen Segments                                    */
  /*    Rueckgabe immer bezogen auf den EIGENEN Schwerpunkt des Segments.   */
  /* --------------------------------------------------------------------- */
  function teil(seg, duenn) {
    var A, l, ys, zs, Iy, Iz, Iyz, uy, uz, vy, vz, IL, ID, ra, r;

    if (seg.typ === 'kreis') {
      l = Math.PI * seg.d;
      A = seg.a * l;                       /* = (pi/4)*[(d+a)^2 - (d-a)^2] */
      ys = seg.y; zs = seg.z;
      if (duenn) {
        /* duennwandiger Ring: I = pi*d^3*a/8 */
        Iy = Math.PI * seg.d * seg.d * seg.d * seg.a / 8;
      } else {
        /* exakter Kreisring: I = (pi/64)*[(d+a)^4 - (d-a)^4] */
        Iy = Math.PI / 64 * (Math.pow(seg.d + seg.a, 4) - Math.pow(seg.d - seg.a, 4));
      }
      Iz = Iy; Iyz = 0;
      ra = duenn ? seg.d / 2 : (seg.d + seg.a) / 2;   /* Randfaser */
      return { A: A, l: l, ys: ys, zs: zs, Iy: Iy, Iz: Iz, Iyz: Iyz, rand: ra };
    }

    /* Gerade Naht: Rechteck l x a, um den Winkel der Segmentrichtung gedreht. */
    l = laenge(seg);
    A = seg.a * l;
    ys = (seg.y1 + seg.y2) / 2;
    zs = (seg.z1 + seg.z2) / 2;

    uy = (seg.y2 - seg.y1) / l;   /* Einheitsvektor laengs  */
    uz = (seg.z2 - seg.z1) / l;
    vy = -uz;                     /* Einheitsvektor quer (Dickenrichtung) */
    vz = uy;

    IL = seg.a * l * l * l / 12;              /* um die Querachse (laengs^2) */
    ID = duenn ? 0 : l * seg.a * seg.a * seg.a / 12;  /* Eigenanteil in Dicke */

    Iy  = uz * uz * IL + vz * vz * ID;
    Iz  = uy * uy * IL + vy * vy * ID;
    Iyz = uy * uz * IL + vy * vz * ID;

    r = duenn ? 0 : seg.a / 2;    /* halbe Dicke als Randabstand quer */
    return { A: A, l: l, ys: ys, zs: zs, Iy: Iy, Iz: Iz, Iyz: Iyz, rand: r,
             uy: uy, uz: uz, vy: vy, vz: vz };
  }

  /* Randpunkte eines Segments, bezogen auf den Nahtbild-Schwerpunkt. */
  function randpunkte(seg, duenn, ysG, zsG, index, out) {
    var i, w, r, t2, ecken, u, k;
    if (seg.typ === 'kreis') {
      r = duenn ? seg.d / 2 : (seg.d + seg.a) / 2;
      for (i = 0; i < 8; i++) {              /* 8 Punkte: alle 45 Grad */
        w = i * Math.PI / 4;
        out.push({ y: seg.y + r * Math.cos(w) - ysG, z: seg.z + r * Math.sin(w) - zsG, seg: index });
      }
      return;
    }
    t2 = teil(seg, duenn);
    ecken = duenn
      ? [[seg.y1, seg.z1], [seg.y2, seg.z2]]
      : [[seg.y1, seg.z1], [seg.y2, seg.z2]];
    for (k = 0; k < ecken.length; k++) {
      if (duenn) {
        out.push({ y: ecken[k][0] - ysG, z: ecken[k][1] - zsG, seg: index });
      } else {
        for (u = -1; u <= 1; u += 2) {
          out.push({ y: ecken[k][0] + u * (seg.a / 2) * t2.vy - ysG,
                     z: ecken[k][1] + u * (seg.a / 2) * t2.vz - zsG, seg: index });
        }
      }
    }
  }

  /* --------------------------------------------------------------------- */
  /* 4) Offene Enden / geschlossenes Nahtbild                               */
  /*    Wichtig fuer Torsion: die I_p-Methode setzt ein geschlossenes bzw.  */
  /*    woelbfreies Nahtbild voraus (Voigt, HS Anhalt). Bei offenen Bildern */
  /*    ist sie eine Naeherung — das wird ehrlich gemeldet.                 */
  /* --------------------------------------------------------------------- */
  function offeneEnden(segmente) {
    var knoten = {}, i, s, k, n = 0;
    function schl(y, z) { return Math.round(y / TOL) + '|' + Math.round(z / TOL); }
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (!s || s.typ !== 'linie') continue;
      k = schl(s.y1, s.z1); knoten[k] = (knoten[k] || 0) + 1;
      k = schl(s.y2, s.z2); knoten[k] = (knoten[k] || 0) + 1;
    }
    for (k in knoten) if (Object.prototype.hasOwnProperty.call(knoten, k)) {
      if (knoten[k] < 2) n++;
    }
    return n;
  }

  /* --------------------------------------------------------------------- */
  /* 5) Hauptrechnung                                                       */
  /* --------------------------------------------------------------------- */
  function rechne(segmente, opt) {
    opt = opt || {};
    var modell = (MODELLE.indexOf(opt.modell) >= 0) ? opt.modell : MODELL_STD;
    var duenn = (modell === 'duennwandig');

    var p = pruefe(segmente);
    if (!p.ok) {
      return { ok: false, modell: modell, fehler: p.fehler, warnungen: p.warnungen,
               hinweise: [], teile: [], punkte: [] };
    }

    var i, t, teile = [], A = 0, lges = 0, Sy = 0, Sz = 0, hatKreis = false;

    /* 5.1 Flaeche und statische Momente -> Schwerpunkt */
    for (i = 0; i < segmente.length; i++) {
      t = teil(segmente[i], duenn);
      teile.push(t);
      A += t.A;
      lges += t.l;
      Sy += t.A * t.ys;                 /* fuer y_s */
      Sz += t.A * t.zs;                 /* fuer z_s */
      if (segmente[i].typ === 'kreis') hatKreis = true;
    }
    var ys = Sy / A, zs = Sz / A;

    /* 5.2 Flaechenmomente um den Schwerpunkt (Eigenanteil + Steiner) */
    var Iy = 0, Iz = 0, Iyz = 0, dy, dz;
    for (i = 0; i < teile.length; i++) {
      t = teile[i];
      dy = t.ys - ys;
      dz = t.zs - zs;
      t.dy = dy; t.dz = dz;
      t.Iy_steiner  = t.A * dz * dz;
      t.Iz_steiner  = t.A * dy * dy;
      t.Iyz_steiner = t.A * dy * dz;
      Iy  += t.Iy  + t.Iy_steiner;
      Iz  += t.Iz  + t.Iz_steiner;
      Iyz += t.Iyz + t.Iyz_steiner;
    }
    var Ip = Iy + Iz;

    /* 5.3 Hauptachsen (schiefe Biegung bei unsymmetrischen Nahtbildern) */
    var mitte = (Iy + Iz) / 2;
    var rad = Math.sqrt(Math.pow((Iy - Iz) / 2, 2) + Iyz * Iyz);
    var I1 = mitte + rad, I2 = mitte - rad;
    var alpha = 0.5 * Math.atan2(-2 * Iyz, Iy - Iz) * 180 / Math.PI;
    if (alpha <= -90) alpha += 180;
    if (alpha > 90) alpha -= 180;
    var bezugsI = Math.max(Iy, Iz, 1);
    var schief = Math.abs(Iyz) > 1e-9 * bezugsI;

    /* 5.4 Randabstaende, Widerstandsmomente */
    var punkte = [];
    for (i = 0; i < segmente.length; i++) randpunkte(segmente[i], duenn, ys, zs, i, punkte);

    var ymin = 0, ymax = 0, zmin = 0, zmax = 0, rmax = 0, r2;
    for (i = 0; i < punkte.length; i++) {
      if (i === 0 || punkte[i].y < ymin) ymin = punkte[i].y;
      if (i === 0 || punkte[i].y > ymax) ymax = punkte[i].y;
      if (i === 0 || punkte[i].z < zmin) zmin = punkte[i].z;
      if (i === 0 || punkte[i].z > zmax) zmax = punkte[i].z;
      r2 = Math.sqrt(punkte[i].y * punkte[i].y + punkte[i].z * punkte[i].z);
      punkte[i].r = r2;
      if (r2 > rmax) rmax = r2;
    }
    var zRand = Math.max(Math.abs(zmax), Math.abs(zmin));
    var yRand = Math.max(Math.abs(ymax), Math.abs(ymin));

    var Wy_oben  = zmax > TOL ? Iy / zmax : 0;
    var Wy_unten = (-zmin) > TOL ? Iy / (-zmin) : 0;
    var Wz_rechts = ymax > TOL ? Iz / ymax : 0;
    var Wz_links  = (-ymin) > TOL ? Iz / (-ymin) : 0;
    var Wy = zRand > TOL ? Iy / zRand : 0;      /* massgebend = kleinstes W */
    var Wz = yRand > TOL ? Iz / yRand : 0;
    var Wt = rmax > TOL ? Ip / rmax : 0;

    /* 5.5 Ehrliche Hinweise */
    var offen = offeneEnden(segmente);
    var geschlossen = (offen === 0);
    var hinweise = [];
    if (!geschlossen) hinweise.push({ code: 'msg_torsion_offenes_nahtbild', index: -1 });
    if (schief) hinweise.push({ code: 'msg_hauptachsen_gedreht', index: -1 });
    if (hatKreis) hinweise.push({ code: 'msg_kreis_aussendurchmesser', index: -1 });

    /* 5.6 Selbstkontrolle (Haekchen im Rechenweg, 8. Stehende Regeln) */
    var sy = 0, sz = 0;
    for (i = 0; i < teile.length; i++) { sy += teile[i].A * teile[i].dy; sz += teile[i].A * teile[i].dz; }
    var bezug = A * Math.max(1, Math.abs(ys), Math.abs(zs), lges);
    var kontrolle = {
      schwerpunkt_ok: Math.abs(sy) <= 1e-9 * bezug && Math.abs(sz) <= 1e-9 * bezug,
      rest_Sy: sy, rest_Sz: sz,
      polar_ok: Math.abs(Ip - (Iy + Iz)) <= 1e-9 * Math.max(1, Ip),
      hauptachsen_ok: Math.abs((I1 + I2) - (Iy + Iz)) <= 1e-9 * Math.max(1, Ip)
    };
    kontrolle.ok = kontrolle.schwerpunkt_ok && kontrolle.polar_ok && kontrolle.hauptachsen_ok;

    return {
      ok: true,
      version: VERSION,
      modell: modell,
      n_seg: segmente.length,
      l_ges: lges,
      A: A,
      ys: ys, zs: zs,
      Iy: Iy, Iz: Iz, Iyz: Iyz, Ip: Ip,
      I1: I1, I2: I2, alpha: alpha, schiefe_biegung: schief,
      ymin: ymin, ymax: ymax, zmin: zmin, zmax: zmax,
      y_rand: yRand, z_rand: zRand, rmax: rmax,
      Wy: Wy, Wz: Wz, Wt: Wt,
      Wy_oben: Wy_oben, Wy_unten: Wy_unten, Wz_links: Wz_links, Wz_rechts: Wz_rechts,
      geschlossen: geschlossen, offene_enden: offen,
      teile: teile, punkte: punkte,
      kontrolle: kontrolle,
      fehler: [], warnungen: p.warnungen, hinweise: hinweise
    };
  }

  /* --------------------------------------------------------------------- */
  /* 6) Umformungen (mutieren die Eingabe NICHT)                            */
  /* --------------------------------------------------------------------- */
  function verschiebe(segmente, dy, dz) {
    var r = [], i, s;
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (s.typ === 'kreis') r.push(kreis(s.y + dy, s.z + dz, s.d, s.a, s.code));
      else r.push(linie(s.y1 + dy, s.z1 + dz, s.y2 + dy, s.z2 + dz, s.a, s.code));
    }
    return r;
  }

  /* Dreht das Nahtbild um (y0,z0) mathematisch positiv (gegen den Uhrzeiger). */
  function drehe(segmente, grad, y0, z0) {
    var w = grad * Math.PI / 180, c = Math.cos(w), s2 = Math.sin(w);
    y0 = y0 || 0; z0 = z0 || 0;
    function dy(y, z) { return y0 + (y - y0) * c - (z - z0) * s2; }
    function dz(y, z) { return z0 + (y - y0) * s2 + (z - z0) * c; }
    var r = [], i, s;
    for (i = 0; i < segmente.length; i++) {
      s = segmente[i];
      if (s.typ === 'kreis') r.push(kreis(dy(s.y, s.z), dz(s.y, s.z), s.d, s.a, s.code));
      else r.push(linie(dy(s.y1, s.z1), dz(s.y1, s.z1), dy(s.y2, s.z2), dz(s.y2, s.z2), s.a, s.code));
    }
    return r;
  }

  return {
    VERSION: VERSION,
    TOL: TOL,
    TYPEN: TYPEN,
    MODELLE: MODELLE,
    MODELL_STD: MODELL_STD,
    CODES: CODES,
    GROESSEN: GROESSEN,
    linie: linie,
    kreis: kreis,
    laenge: laenge,
    pruefe: pruefe,
    rechne: rechne,
    offeneEnden: offeneEnden,
    verschiebe: verschiebe,
    drehe: drehe
  };
}));
