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

  var VERSION = '0.1.0-N1';

  /* --------------------------------------------------------------------- */
  /* Feldschema — eine Quelle fuer Formular, Assistent und Pruefung         */
  /*   code       sprachneutral                                             */
  /*   typ        'zahl' | 'auswahl'                                        */
  /*   label/hilfe i18n-Schluessel                                          */
  /*   pflicht_wenn wie optionen.js: {schluessel:[werte]} — leer = immer    */
  /* --------------------------------------------------------------------- */
  var SCHEMA = [
    { code: 'a',  typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 50,   dez: 1,
      label: 'fld_a',  hilfe: 'fld_a',  pflicht_wenn: { rechenrichtung: ['nachweis'] } },
    { code: 'z',  typ: 'zahl', einheit: 'unit_mm',   min: 0.7,  max: 71,   dez: 1,
      label: 'fld_z',  hilfe: 'fld_z',  pflicht: false },
    { code: 'l',  typ: 'zahl', einheit: 'unit_mm',   min: 1,    max: 100000, dez: 0,
      label: 'fld_l',  hilfe: 'fld_l',  pflicht: true },
    { code: 't1', typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 200,  dez: 1,
      label: 'fld_t1', hilfe: 'fld_t1', pflicht: true },
    { code: 't2', typ: 'zahl', einheit: 'unit_mm',   min: 0.5,  max: 200,  dez: 1,
      label: 'fld_t2', hilfe: 'fld_t2', pflicht: true },

    { code: 'N',  typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_N',  hilfe: 'fld_N',  pflicht_wenn: { lasteingabe: ['direkt'] } },
    { code: 'Q',  typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_Q',  hilfe: 'fld_Q',  pflicht_wenn: { lasteingabe: ['direkt'] } },
    { code: 'M',  typ: 'zahl', einheit: 'unit_Nm',   min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_M',  hilfe: 'fld_M',  pflicht: false },
    { code: 'T',  typ: 'zahl', einheit: 'unit_Nm',   min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_T',  hilfe: 'fld_T',  pflicht: false },

    { code: 'F',  typ: 'zahl', einheit: 'unit_N',    min: -1e9, max: 1e9,  dez: 0,
      label: 'fld_F',  hilfe: 'fld_F',  pflicht_wenn: { lasteingabe: ['geometrisch'] } },
    { code: 'e',  typ: 'zahl', einheit: 'unit_mm',   min: 0,    max: 100000, dez: 1,
      label: 'fld_e',  hilfe: 'fld_e',  pflicht_wenn: { lasteingabe: ['geometrisch'] } },

    { code: 'gammaM2', typ: 'zahl', einheit: 'unit_dimensionslos', min: 1.0, max: 2.0, dez: 2,
      standard: 1.25, label: 'fld_gammaM2', hilfe: 'fld_gammaM2',
      pflicht_wenn: { welt: ['A'] }, ueberschreibbar: true },
    { code: 'gammaMw', typ: 'zahl', einheit: 'unit_dimensionslos', min: 1.0, max: 2.0, dez: 2,
      standard: 1.25, label: 'fld_gammaMw', hilfe: 'fld_gammaMw',
      pflicht_wenn: { welt: ['A'], werkstoffgruppe: ['alu'] }, ueberschreibbar: true },
    { code: 'betaW',   typ: 'zahl', einheit: 'unit_dimensionslos', min: 0.5, max: 1.5, dez: 2,
      label: 'fld_betaW', hilfe: 'fld_betaW', pflicht: false, ueberschreibbar: true },

    { code: 'S',  typ: 'zahl', einheit: 'unit_dimensionslos', min: 1.0, max: 4.0, dez: 2,
      standard: 1.5, label: 'fld_S', hilfe: 'fld_S',
      pflicht_wenn: { welt: ['B'] }, ueberschreibbar: true },
    { code: 'nu', typ: 'zahl', einheit: 'unit_dimensionslos', min: 0.3, max: 1.0, dez: 2,
      label: 'fld_nu', hilfe: 'fld_nu', pflicht: false, ueberschreibbar: true }
  ];

  function feld(code) {
    for (var i = 0; i < SCHEMA.length; i++) if (SCHEMA[i].code === code) return SCHEMA[i];
    return null;
  }

  function istLeer(v) { return v === undefined || v === null || v === '' ||
                               (typeof v === 'number' && !isFinite(v)); }

  function bedingung(bed, zustand) {
    if (!bed) return true;
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

    if (typeof v.l === 'number' && typeof a === 'number' && a > 0) {
      var leff = v.l - 2 * a;
      var leffMin = Math.max(6 * a, 30);
      if (leff < leffMin) fehler.push(meldung('l', 'msg_leff_min', { grenze: Math.round(leffMin * 10) / 10 }));
      if (v.l > 150 * a) warnungen.push(meldung('l', 'msg_l_lang', { grenze: Math.round(150 * a) }));
    }

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
    standardwerte: standardwerte,
    sichtbareFelder: sichtbareFelder,
    leer: leer
  };
}));
