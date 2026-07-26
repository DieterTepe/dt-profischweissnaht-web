/* ============================================================================
 * DT-ProfiSchweissnaht · optionen.js  (DTNOptions)
 * Baustein N1 — EINZIGE Options-/Auswahlquelle fuer Formular UND Assistent.
 *
 * Kernidee (Schweissnaht-1.md 3.4): jede Option traegt Bedingungen
 * (gilt_wenn / gilt_nicht_wenn). EINE Filterfunktion bedient beide Stellen.
 * Eine neue Option erscheint dadurch automatisch an beiden Stellen.
 *
 * Bedingungsformat:
 *   gilt_wenn:        { schluessel: [erlaubte Werte], ... }  (UND ueber Schluessel,
 *                       ODER innerhalb der Liste). Fehlt der Schluessel im
 *                       Zustand, gilt die Bedingung als NOCH NICHT entschieden
 *                       -> Option bleibt sichtbar (kein vorzeitiges Ausblenden).
 *   gilt_nicht_wenn:  gleiche Struktur, wirkt ausschliessend.
 *
 * Abhaengig ist immer nur "spaeter von frueher" (Reihenfolge = REIHENFOLGE).
 * DOM-frei · UMD/IIFE · benoetigt DTNData nicht zwingend (nur fuer Abgleich).
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNOptions = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.1.0-N1';

  var KEHL = ['kehl_einseitig', 'kehl_doppel', 'kehl_flanke', 'kehl_stirn', 'kehl_umlaufend'];
  var STUMPF_VOLL = ['stumpf_i', 'stumpf_v', 'stumpf_dv', 'stumpf_dhv'];
  var STUMPF_TEIL = ['stumpf_hv', 'stumpf_hy', 'stumpf_dhy'];

  /* --------------------------------------------------------------------- */
  /* Gruppen in Abfragereihenfolge. Jede Gruppe: code, pflicht, optionen.   */
  /* --------------------------------------------------------------------- */
  var GRUPPEN = [

    { code: 'welt', pflicht: true, verzweigt: true, optionen: [
      { code: 'A' },
      { code: 'B' }
    ]},

    { code: 'rechenrichtung', pflicht: true, verzweigt: true, optionen: [
      { code: 'nachweis' },
      { code: 'auslegung' }
    ]},

    { code: 'werkstoffgruppe', pflicht: true, verzweigt: true, optionen: [
      { code: 'stahl' },
      { code: 'edelstahl' },
      /* Alu nur Welt A: EN 1999-1-1 mit WEZ-Entfestigung; die klassischen
         Maschinenbau-Tabellen (Welt B) decken Aluminium nicht ab. */
      { code: 'alu', gilt_wenn: { welt: ['A'] } }
    ]},

    { code: 'werkstoff', pflicht: true, verzweigt: true, optionen: [
      { code: 'S235',  gilt_wenn: { werkstoffgruppe: ['stahl'] } },
      { code: 'S275',  gilt_wenn: { werkstoffgruppe: ['stahl'] } },
      { code: 'S355',  gilt_wenn: { werkstoffgruppe: ['stahl'] } },
      { code: 'S420',  gilt_wenn: { werkstoffgruppe: ['stahl'] } },
      { code: 'S460',  gilt_wenn: { werkstoffgruppe: ['stahl'] } },
      { code: '1.4301', gilt_wenn: { werkstoffgruppe: ['edelstahl'] } },
      { code: '1.4404', gilt_wenn: { werkstoffgruppe: ['edelstahl'] } },
      { code: '1.4571', gilt_wenn: { werkstoffgruppe: ['edelstahl'] } },
      { code: 'AW5083', gilt_wenn: { werkstoffgruppe: ['alu'] } },
      { code: 'AW6060', gilt_wenn: { werkstoffgruppe: ['alu'] } },
      { code: 'AW6082', gilt_wenn: { werkstoffgruppe: ['alu'] } }
    ]},

    { code: 'zustand', pflicht: true, verzweigt: true,
      gilt_wenn: { werkstoffgruppe: ['alu'] }, optionen: [
      { code: 'O_H111',    gilt_wenn: { werkstoff: ['AW5083'] } },
      { code: 'F_H112',    gilt_wenn: { werkstoff: ['AW5083'] } },
      { code: 'H24_H34',   gilt_wenn: { werkstoff: ['AW5083'] } },
      { code: 'T6',        gilt_wenn: { werkstoff: ['AW6060', 'AW6082'] } },
      { code: 'T6_strang', gilt_wenn: { werkstoff: ['AW6082'] } },
      { code: 'T4',        gilt_wenn: { werkstoff: ['AW6060', 'AW6082'] } }
    ]},

    { code: 'zusatzwerkstoff', pflicht: true, verzweigt: false,
      gilt_wenn: { werkstoffgruppe: ['alu'] }, optionen: [
      /* f_w-Tabellenwerte (EN 1999-1-1 Tab. 8.8): 5083 nur mit 5356 belegt. */
      { code: '5356' },
      { code: '4043A', gilt_wenn: { werkstoff: ['AW6060', 'AW6082'] } }
    ]},

    /* beta_w-Regelsatz nur dort, wo CEN-2005 und deutscher NA abweichen. */
    { code: 'bw_regelsatz', pflicht: true, verzweigt: false,
      gilt_wenn: { welt: ['A'], werkstoff: ['S420', 'S460'] }, optionen: [
      { code: 'na_de' },
      { code: 'cen2005' }
    ]},

    { code: 'stossart', pflicht: true, verzweigt: true, optionen: [
      { code: 'stumpfstoss' },
      { code: 't_stoss' },
      { code: 'kreuzstoss' },
      { code: 'eckstoss' },
      { code: 'ueberlappstoss' }
    ]},

    { code: 'nahtart', pflicht: true, verzweigt: true, optionen: [
      { code: 'kehl_einseitig', gilt_wenn: { stossart: ['t_stoss', 'eckstoss', 'ueberlappstoss'] } },
      { code: 'kehl_doppel',    gilt_wenn: { stossart: ['t_stoss', 'kreuzstoss', 'eckstoss', 'ueberlappstoss'] } },
      { code: 'kehl_flanke',    gilt_wenn: { stossart: ['ueberlappstoss'] } },
      { code: 'kehl_stirn',     gilt_wenn: { stossart: ['ueberlappstoss'] } },
      { code: 'kehl_umlaufend', gilt_wenn: { stossart: ['ueberlappstoss', 't_stoss'] } },
      { code: 'stumpf_i',       gilt_wenn: { stossart: ['stumpfstoss'] } },
      { code: 'stumpf_v',       gilt_wenn: { stossart: ['stumpfstoss', 'eckstoss'] } },
      { code: 'stumpf_dv',      gilt_wenn: { stossart: ['stumpfstoss'] } },
      { code: 'stumpf_hv',      gilt_wenn: { stossart: ['t_stoss', 'eckstoss'] } },
      { code: 'stumpf_dhv',     gilt_wenn: { stossart: ['t_stoss', 'kreuzstoss'] } },
      { code: 'stumpf_hy',      gilt_wenn: { stossart: ['t_stoss'] } },
      { code: 'stumpf_dhy',     gilt_wenn: { stossart: ['t_stoss', 'kreuzstoss'] } }
    ]},

    /* Nachweisverfahren steht bewusst NACH der Nahtart: das vereinfachte
       Verfahren ist ein Kehlnaht-Verfahren, es haengt also von ihr ab. */
    { code: 'nachweisverfahren', pflicht: true, verzweigt: true,
      gilt_wenn: { welt: ['A'] }, optionen: [
      { code: 'richtungsbezogen' },
      { code: 'vereinfacht', gilt_wenn: { nahtart: KEHL.concat(STUMPF_TEIL) } }
    ]},

    /* Welt B: Nahtguete / Nahtgruppe der Tabellenwerte */
    { code: 'nahtguete', pflicht: true, verzweigt: false,
      gilt_wenn: { welt: ['B'] }, optionen: [
      { code: 'durchgeschweisst_zug_geprueft',   gilt_wenn: { nahtart: STUMPF_VOLL } },
      { code: 'durchgeschweisst_zug_ungeprueft', gilt_wenn: { nahtart: STUMPF_VOLL } },
      { code: 'durchgeschweisst_druck',          gilt_wenn: { nahtart: STUMPF_VOLL } },
      { code: 'kehlnaht_allgemein',              gilt_wenn: { nahtart: KEHL.concat(STUMPF_TEIL) } }
    ]},

    /* Welt B: Zeile der klassischen Tabelle der zulaessigen Spannungen.
       NICHT pflicht — wer die Zeile nicht sicher zuordnen kann, laesst sie
       leer und bekommt ehrlich den Formelweg (stehende Regel: keine
       erfundene Zuordnung von Nahtart auf Tabellenzeile). Belegt sind nur
       S235 und S355 in der Bewertungsgruppe B (daten.js WELTB_TABELLE). */
    { code: 'weltb_nahtgruppe', pflicht: false, verzweigt: false,
      gilt_wenn: { welt: ['B'], werkstoff: ['S235', 'S355'] }, optionen: [
      { code: 'stumpf_mit_gegenlage',  gilt_wenn: { nahtart: STUMPF_VOLL } },
      { code: 'stumpf_ohne_gegenlage', gilt_wenn: { nahtart: STUMPF_VOLL } },
      { code: 'kehl_flach',            gilt_wenn: { nahtart: KEHL.concat(STUMPF_TEIL) } },
      { code: 'kehl_hohl',             gilt_wenn: { nahtart: KEHL.concat(STUMPF_TEIL) } },
      { code: 'kehl_doppel_umlaufend', gilt_wenn: { nahtart: ['kehl_doppel', 'kehl_umlaufend'] } }
    ]},

    /* Welt B: Lastfall (gehoert AUSSCHLIESSLICH zu Welt B, 2.8) */
    { code: 'lastfall', pflicht: true, verzweigt: false,
      gilt_wenn: { welt: ['B'] }, optionen: [
      { code: 'ruhend' },
      { code: 'schwellend' },
      { code: 'wechselnd' }
    ]},

    /* ---- N2b: Profileingabe (2.2b) ------------------------------------- */
    /* Das Profil erzeugt das Nahtbild (profil.js), nicht nur eine Laenge.  */
    { code: 'profil', pflicht: true, verzweigt: true, optionen: [
      { code: 'blech' },
      { code: 'rohr_rechteck' },
      { code: 'rohr_rund' },
      { code: 'i_profil' },
      { code: 'u_profil' },
      { code: 'winkel' },
      { code: 'vollrund' }
    ]},

    /* Die Kantenauswahl ist die eigentlich wichtige Frage: ohne sie rechnet
       das Programm Naehte mit, die es gar nicht gibt. Sie haengt am Profil —
       und eine ausdruecklich umlaufende Kehlnaht laesst nur "rundum" zu. */
    { code: 'kanten', pflicht: true, verzweigt: true, optionen: [
      { code: 'rundum' },
      { code: 'flanken',      gilt_wenn: { profil: ['blech', 'rohr_rechteck', 'winkel'] },
                              gilt_nicht_wenn: { nahtart: ['kehl_umlaufend'] } },
      { code: 'stirn',        gilt_wenn: { profil: ['blech', 'rohr_rechteck'] },
                              gilt_nicht_wenn: { nahtart: ['kehl_umlaufend'] } },
      { code: 'eine_flanke',  gilt_wenn: { profil: ['blech'] },
                              gilt_nicht_wenn: { nahtart: ['kehl_umlaufend', 'kehl_doppel'] } },
      { code: 'flansche',     gilt_wenn: { profil: ['i_profil', 'u_profil'] },
                              gilt_nicht_wenn: { nahtart: ['kehl_umlaufend'] } },
      { code: 'steg',         gilt_wenn: { profil: ['i_profil', 'u_profil'] },
                              gilt_nicht_wenn: { nahtart: ['kehl_umlaufend'] } },
      { code: 'flansche_steg', gilt_wenn: { profil: ['i_profil', 'u_profil'] },
                              gilt_nicht_wenn: { nahtart: ['kehl_umlaufend'] } }
    ]},

    { code: 'lasteingabe', pflicht: true, verzweigt: true, optionen: [
      { code: 'direkt' },
      { code: 'geometrisch' }
    ]},

    /* ---- N3: Aufrundung des a-Masses (2.3, BINDEND) -------------------- */
    /* Nur bei der Auslegung sichtbar — beim Nachweis gibt der Anwender das
       a-Mass selbst vor, da ist nichts zu runden. Immer AUFgerundet, nie ab.
       verzweigt:false, damit die Wegeaufzaehlung nicht verdoppelt wird. */
    { code: 'a_rundung', pflicht: true, verzweigt: false,
      gilt_wenn: { rechenrichtung: ['auslegung'] }, optionen: [
      { code: 'ganze_mm' },
      { code: 'halbe_mm' }
    ]},

    { code: 'schweissverfahren', pflicht: false, verzweigt: false, optionen: [
      { code: 'mag',   gilt_wenn: { werkstoffgruppe: ['stahl', 'edelstahl'] } },
      { code: 'mig',   gilt_wenn: { werkstoffgruppe: ['alu', 'edelstahl'] } },
      { code: 'wig' },
      { code: 'ehand', gilt_wenn: { werkstoffgruppe: ['stahl', 'edelstahl'] } },
      /* UP nur Stahl und nicht in Zwangslage/Ueberlappstoss-Kleinteilen */
      { code: 'up',    gilt_wenn: { werkstoffgruppe: ['stahl'] },
                       gilt_nicht_wenn: { stossart: ['ueberlappstoss'] } }
    ]},

    { code: 'iso5817', pflicht: false, verzweigt: false, rechenwirksam: false, optionen: [
      { code: 'B' }, { code: 'C' }, { code: 'D' }
    ]},

    { code: 'exc', pflicht: false, verzweigt: false, rechenwirksam: false, optionen: [
      { code: 'EXC1' }, { code: 'EXC2' }, { code: 'EXC3' }, { code: 'EXC4' }
    ]}
  ];

  /* --------------------------------------------------------------------- */
  /* Zusatzbereiche (Ankreuzfelder, standardmaessig AUS)                    */
  /* --------------------------------------------------------------------- */
  var ZUSATZBEREICHE = [
    { code: 'ermuedung', standard: false, baustein: 'N13' },
    { code: 'thermik',   standard: false, baustein: 'N9'  },
    { code: 'kosten',    standard: false, baustein: 'N10' },
    { code: 'verzug',    standard: false, baustein: 'N15', nur_abschaetzung: true },
    { code: 'ausfuehrung', standard: false, baustein: 'N1', rechenwirksam: false }
  ];

  /* --------------------------------------------------------------------- */
  /* Bedingungspruefung                                                     */
  /* --------------------------------------------------------------------- */

  function istLeer(v) { return v === undefined || v === null || v === ''; }

  /* true, wenn die Bedingung erfuellt ist ODER noch nicht entscheidbar. */
  function bedingungErfuellt(bed, zustand) {
    if (!bed) return true;
    for (var k in bed) {
      if (!Object.prototype.hasOwnProperty.call(bed, k)) continue;
      var ist = zustand ? zustand[k] : undefined;
      if (istLeer(ist)) continue;               /* noch nicht entschieden */
      if (bed[k].indexOf(ist) < 0) return false;
    }
    return true;
  }

  /* Strikte Variante fuer die Bereinigung: fehlt der Bezugswert, ist die
     getroffene Auswahl nicht mehr begruendbar und faellt weg. */
  function bedingungErfuelltStrikt(bed, zustand) {
    if (!bed) return true;
    for (var k in bed) {
      if (!Object.prototype.hasOwnProperty.call(bed, k)) continue;
      var ist = zustand ? zustand[k] : undefined;
      if (istLeer(ist)) return false;
      if (bed[k].indexOf(ist) < 0) return false;
    }
    return true;
  }

  /* true, wenn die Ausschlussbedingung greift (Option wird ausgeblendet). */
  function ausschlussGreift(bed, zustand) {
    if (!bed) return false;
    for (var k in bed) {
      if (!Object.prototype.hasOwnProperty.call(bed, k)) continue;
      var ist = zustand ? zustand[k] : undefined;
      if (istLeer(ist)) continue;
      if (bed[k].indexOf(ist) >= 0) return true;
    }
    return false;
  }

  function gruppe(code) {
    for (var i = 0; i < GRUPPEN.length; i++) if (GRUPPEN[i].code === code) return GRUPPEN[i];
    return null;
  }

  /* Ist die Gruppe im gegebenen Zustand ueberhaupt zu zeigen? */
  function gruppeAktiv(code, zustand) {
    var g = gruppe(code);
    if (!g) return false;
    if (!bedingungErfuellt(g.gilt_wenn, zustand)) return false;
    if (ausschlussGreift(g.gilt_nicht_wenn, zustand)) return false;
    return filter(code, zustand).length > 0;
  }

  /* DIE Filterfunktion — Formular UND Assistent nutzen ausschliesslich diese. */
  function filter(gruppenCode, zustand) {
    var g = gruppe(gruppenCode);
    if (!g) return [];
    var out = [];
    for (var i = 0; i < g.optionen.length; i++) {
      var o = g.optionen[i];
      if (!bedingungErfuellt(o.gilt_wenn, zustand)) continue;
      if (ausschlussGreift(o.gilt_nicht_wenn, zustand)) continue;
      out.push(o);
    }
    return out;
  }

  function codes(gruppenCode, zustand) {
    var l = filter(gruppenCode, zustand), r = [];
    for (var i = 0; i < l.length; i++) r.push(l[i].code);
    return r;
  }

  /* Alle im Zustand aktiven Gruppen in Abfragereihenfolge. */
  function aktiveGruppen(zustand) {
    var r = [];
    for (var i = 0; i < GRUPPEN.length; i++) {
      if (gruppeAktiv(GRUPPEN[i].code, zustand)) r.push(GRUPPEN[i]);
    }
    return r;
  }

  /* Zustand bereinigen: Werte entfernen, die nach einer Aenderung oben
     nicht mehr gueltig sind. Mutiert NICHT, liefert neues Objekt. */
  function bereinige(zustand) {
    var z = {}, k;
    for (k in zustand) if (Object.prototype.hasOwnProperty.call(zustand, k)) z[k] = zustand[k];
    var geaendert = true, runde = 0;
    while (geaendert && runde < 10) {
      geaendert = false; runde++;
      for (var i = 0; i < GRUPPEN.length; i++) {
        var gc = GRUPPEN[i].code;
        if (istLeer(z[gc])) continue;
        var g = GRUPPEN[i];
        var gruppeGilt = bedingungErfuelltStrikt(g.gilt_wenn, z) && !ausschlussGreift(g.gilt_nicht_wenn, z);
        var gewaehlt = null;
        for (var m = 0; m < g.optionen.length; m++) if (g.optionen[m].code === z[gc]) gewaehlt = g.optionen[m];
        var optGilt = gewaehlt
          ? (bedingungErfuelltStrikt(gewaehlt.gilt_wenn, z) && !ausschlussGreift(gewaehlt.gilt_nicht_wenn, z))
          : false;
        if (!gruppeGilt || !optGilt) { delete z[gc]; geaendert = true; }
      }
    }
    return z;
  }

  /* Konsistenzpruefung eines fertigen Zustands. */
  function pruefe(zustand) {
    var fehlend = [], ungueltig = [];
    for (var i = 0; i < GRUPPEN.length; i++) {
      var g = GRUPPEN[i], gc = g.code;
      if (!gruppeAktiv(gc, zustand)) continue;
      var wert = zustand[gc];
      if (istLeer(wert)) { if (g.pflicht) fehlend.push(gc); continue; }
      if (codes(gc, zustand).indexOf(wert) < 0) ungueltig.push(gc);
    }
    return { ok: fehlend.length === 0 && ungueltig.length === 0,
             fehlend: fehlend, ungueltig: ungueltig };
  }

  /* --------------------------------------------------------------------- */
  /* Wegeaufzaehlung — Grundlage des Sackgassen-Pflichttests (3.4)          */
  /* Zaehlt nur verzweigende Gruppen auf; nicht verzweigende werden mit der */
  /* ersten gueltigen Option belegt (sie koennen keine Sackgasse erzeugen). */
  /* --------------------------------------------------------------------- */
  function wege(maxWege) {
    var grenze = maxWege || 100000;
    var ergebnis = [], sackgassen = [], abgebrochen = false;

    function schritt(idx, zustand) {
      if (ergebnis.length >= grenze) { abgebrochen = true; return; }
      if (idx >= GRUPPEN.length) { ergebnis.push(zustand); return; }
      var g = GRUPPEN[idx], gc = g.code;

      var gruppeGilt = bedingungErfuellt(g.gilt_wenn, zustand) && !ausschlussGreift(g.gilt_nicht_wenn, zustand);
      if (!gruppeGilt) { schritt(idx + 1, zustand); return; }

      var moeglich = codes(gc, zustand);
      if (moeglich.length === 0) {
        if (g.pflicht) sackgassen.push({ gruppe: gc, zustand: zustand });
        schritt(idx + 1, zustand); return;
      }

      var n = g.verzweigt ? moeglich.length : 1;
      for (var i = 0; i < n; i++) {
        var z = {}, k;
        for (k in zustand) if (Object.prototype.hasOwnProperty.call(zustand, k)) z[k] = zustand[k];
        z[gc] = moeglich[i];
        schritt(idx + 1, z);
        if (abgebrochen) return;
      }
    }

    schritt(0, {});
    return { wege: ergebnis, sackgassen: sackgassen, abgebrochen: abgebrochen };
  }

  return {
    VERSION: VERSION,
    GRUPPEN: GRUPPEN,
    ZUSATZBEREICHE: ZUSATZBEREICHE,
    KEHL: KEHL,
    STUMPF_VOLL: STUMPF_VOLL,
    STUMPF_TEIL: STUMPF_TEIL,
    gruppe: gruppe,
    gruppeAktiv: gruppeAktiv,
    filter: filter,
    codes: codes,
    aktiveGruppen: aktiveGruppen,
    bereinige: bereinige,
    pruefe: pruefe,
    wege: wege
  };
}));
