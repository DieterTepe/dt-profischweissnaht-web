/* ============================================================================
 * DT-ProfiSchweissnaht · report.js  (DTNReport)
 * Baustein N11 — AUSGABEN: .dts speichern/oeffnen, Drucken/PDF, Word (.rtf).
 *
 * DIESES MODUL IST DOM-FREI. Es fasst die Oberflaeche nirgends an, es
 * laedt keine Datei und es speichert keine. Es BAUT und LIEST nur
 * Zeichenketten — und genau deshalb ist jeder Schritt in Node pruefbar.
 * Den letzten Millimeter (Blob, Download, Dateiwahl, Canvas, Drucken)
 * erledigt `ui.js`, weil dort ohnehin die Oberflaeche sitzt.
 *
 * DAS GATING IST HIER GEBUENDELT (Plan 4.4). Kein anderes Modul kennt die
 * Edition. In der Testversion sind ALLE vier Ausgaben gesperrt (Plan 1) —
 * gerechnet werden darf dort alles, herausgegeben nichts.
 *
 * DAS DATEIFORMAT STEHT IN 5.1-8 UND IST ENTSCHIEDEN:
 *   - Jede Datei traegt einen Stempel aus vier Angaben; NUR `format` steuert
 *     das Lesen. `geschrieben_mit` und `datum` sind fuer den Menschen.
 *   - GESPEICHERT WERDEN NUR DIE EINGABEN. Die Datei beschreibt den FALL,
 *     nicht das ERGEBNIS. Eine mitgespeicherte Zahl waere nur so lange
 *     richtig, wie sich das Programm nicht aendert — und es aendert sich
 *     (die `konsole` liefert seit N9d 760 mm statt 764).
 *   - Aeltere Datei: oeffnen, aber den Unterschied BENENNEN.
 *     Neuere Datei: NICHT oeffnen — sie halb zu lesen waere schlimmer, als
 *     sie abzulehnen.
 *   - Die Liste der nicht geprueften Punkte kommt als reine DOKUMENTATION
 *     mit in die Datei, nie zum Zuruecklesen. `lieseDatei()` gibt sie
 *     deshalb gar nicht erst als Eingabe heraus.
 *
 * WORD (.rtf) MIT BILDERN — UND DER RUECKFALLWEG (Dieter 2026-08-07,
 * Entscheidung an Claude delegiert: "es muss laufen"):
 * RTF kann ein PNG tragen (`\pict\pngblip`). Das SVG dafuer zu rastern geht
 * nur im Browser ueber Canvas — es ist der EINZIGE Schritt in N11, den kein
 * Node-Test erreicht. Deshalb nimmt `baueRtf()` die Bilddaten ENTGEGEN,
 * statt sie zu erzeugen: der ganze Zusammenbau ist damit pruefbar.
 * Fehlt ein Bild (Rasterung gescheitert, kein Canvas, leeres SVG), wird die
 * Datei TROTZDEM geschrieben — ohne das Bild, mit einer sichtbaren Zeile,
 * die den Grund nennt. Es kann nie eine kaputte Datei entstehen und nie
 * eine stille Luecke.
 * ========================================================================== */
(function (root, factory) {
  var hatReq = (typeof require === 'function' && typeof module === 'object');
  var api = factory(
    hatReq ? require('./i18n_kern.js') : root.DTNI18nKern,
    hatReq ? require('./rechenweg.js') : root.DTNRechenweg
  );
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNReport = api;
}(typeof self !== 'undefined' ? self : this, function (Kern, Weg) {
  'use strict';

  var NAME = 'report';
  var VERSION = '0.3.0-P0';

  /* Der Programmname steht in der Datei, damit eine fremde .dts nicht
     stillschweigend als eigene gelesen wird. */
  var PROGRAMM = 'DT-ProfiSchweissnaht';

  /* FORMAT steigt NUR, wenn eine alte Datei nicht mehr unmittelbar passt
     (Feld umbenannt, Auswahl mit neuer Bedeutung). Das ist selten — nach
     5.1-8 vielleicht zwei- oder dreimal in der Lebenszeit des Programms.
     Wer es aus Gewohnheit hochzieht, macht jede aeltere Datei grundlos zur
     Meldung. */
  var FORMAT = 1;

  var ENDUNG = '.dts';

  /* Die vier Ausgaben. Mehr gibt es nicht, und der Harness prueft das —
     eine fuenfte Ausgabe, die am Gating vorbeilaeuft, waere die Luecke,
     wegen der das Gating hier gebuendelt ist. */
  var AKTIONEN = ['speichern', 'oeffnen', 'drucken', 'word'];

  var CODES = {
    /* Gating */
    gesperrt: 'msg_rep_gesperrt',
    aktion_unbekannt: 'msg_rep_aktion_unbekannt',
    /* Datei schreiben */
    keine_eingaben: 'msg_rep_keine_eingaben',
    /* Datei lesen */
    kein_text: 'msg_rep_kein_text',
    kein_json: 'msg_rep_kein_json',
    fremdes_programm: 'msg_rep_fremdes_programm',
    format_fehlt: 'msg_rep_format_fehlt',
    datei_neuer: 'msg_rep_datei_neuer',
    datei_aelter: 'msg_rep_datei_aelter',
    ohne_eingaben: 'msg_rep_ohne_eingaben',
    /* Hinweise, die in JEDER Ausgabe stehen */
    nur_eingaben: 'msg_rep_nur_eingaben',
    erst_leeren: 'msg_rep_erst_leeren',
    dokumentation: 'msg_rep_dokumentation',
    /* Word / Bilder */
    bild_fehlt: 'msg_rep_bild_fehlt',
    bild_kein_canvas: 'msg_rep_bild_kein_canvas',
    ohne_ergebnis: 'msg_rep_ohne_ergebnis'
  };

  /* ------------------------------------------------------------ Werkzeuge */

  function T(key, lang) {
    if (!key) return '';
    return Kern ? Kern.t(key, lang || 'de') : '[' + key + ']';
  }

  function istText(x) { return typeof x === 'string'; }

  function zwei(n) { return (n < 10 ? '0' : '') + n; }

  /* Das Datum kommt IMMER von aussen herein — sonst waere dieses Modul
     nicht bestimmt und kein Test koennte es festnageln. `ui.js` reicht die
     Uhr des Geraets durch. */
  function datumText(d) {
    if (istText(d)) return d;
    if (!d || typeof d.getFullYear !== 'function') return '';
    return d.getFullYear() + '-' + zwei(d.getMonth() + 1) + '-' + zwei(d.getDate());
  }

  /* ---------------------------------------------------------------- GATING
   * Plan 1: In der Testversion ist der volle Funktionsumfang beim RECHNEN
   * da und JEDE Ausgabe gesperrt. Genau eine Stelle im Programm weiss das. */

  /* WOHER DIE EDITION KOMMT — und warum die Frage hier steht.
     Bis 2026-08-08 entschied `ui.js` das selbst, und zwar falsch herum:
     `(DT_EDITION === 'test') ? 'test' : 'full'`. Alles, was nicht exakt
     'test' war, wurde zur VOLLVERSION — leer, geloescht, vertippt, 'FULL'.
     Wer die Zeile im HTML-Kopf entfernte, hatte die Vollversion.
     Das Gating hier drunter war die ganze Zeit richtig herum, und es gibt
     sogar Assertions darauf, dass eine unbekannte Edition nichts freigibt.
     Geprueft war also das Tor — nie die Hand, die den Schluessel hineinlegt.
     Jetzt entscheidet EINE Stelle, und sie entscheidet auf die sichere
     Seite: **nur exakt 'full' gibt die Vollversion.** Alles andere ist
     Testversion. Kein Trimmen, keine Gross-/Kleinschreibung, keine
     Freundlichkeit — wer die Vollversion ausliefert, schreibt sie richtig. */
  function editionAus(wert) {
    return (wert === 'full') ? 'full' : 'test';
  }

  function guard(aktion, edition) {
    if (AKTIONEN.indexOf(aktion) < 0) {
      return { erlaubt: false, aktion: aktion || null, code: CODES.aktion_unbekannt };
    }
    if (edition !== 'full') {
      return { erlaubt: false, aktion: aktion, code: CODES.gesperrt };
    }
    return { erlaubt: true, aktion: aktion, code: null };
  }

  /* ------------------------------------------------------- REGISTRIERUNG
   * WARUM HIER UND NICHT IN EINEM EIGENEN MODUL: In diesem Modul sitzt
   * bereits alles, was von der EDITION abhaengt — das Gating. Die
   * Lizenzzeile ist dieselbe Sorte Sache, und sie muss in der Kopfzeile, im
   * Ausdruck, im Word-Dokument und in der `.dts` WORTGLEICH stehen. Vier
   * Stellen, die denselben Satz bauen, waeren vier Gelegenheiten, ihn
   * verschieden zu bauen (Plan 3.4).
   *
   * ES WIRD NICHTS GEPRUEFT (Plan 1: „keine Formatpruefung"). Der Schluessel
   * wird nicht auf Form, Laenge oder Gueltigkeit untersucht — er wird
   * verwahrt. Der Zweck des Namens ist die HEMMSCHWELLE zur Weitergabe,
   * nicht der Kopierschutz. Wer hier eine Pruefung einbaut, verspricht eine
   * Sicherheit, die es nicht gibt.
   * ==================================================================== */

  /* Im lokalen Speicher stehen nur PROGRAMMBEDINGUNGEN (5.1-8) — nie die
     letzten Eingaben. Diese drei Schluessel sind alles, was N12 dort ablegt. */
  /* ZWEI SCHLUESSEL, NICHT DREI. Bis 2026-08-07 wurde auch gemerkt, dass
     jemand „Spaeter" gedrueckt hat — damit wurde nie wieder gefragt.
     Dieters Entscheidung: **„Spaeter" gilt nur fuer die laufende Sitzung.**
     Bei jedem Neustart wird wieder gefragt, solange Name und Schluessel
     nicht eingetragen und bestaetigt sind. Der Dialog ist die einzige
     Stelle, an der der Name ueberhaupt entstehen kann — wer ihn einmal
     wegklickt und nie wieder sieht, hat ihn faktisch verloren. */
  var SPEICHER = {
    name:      'dts_lizenz_name',
    schluessel:'dts_lizenz_key'
  };

  var NAME_MAX = 80;

  function lizenzName(name) {
    if (!istText(name)) return '';
    return name.replace(/\s+/g, ' ').replace(/^ +| +$/g, '').substring(0, NAME_MAX);
  }

  /* Aktiviert ist, wer BEIDES eingetragen hat. Mehr wird nicht verlangt. */
  function istAktiviert(name, schluessel) {
    return !!lizenzName(name) && !!lizenzName(schluessel);
  }

  function lizenzPhrase(name, lang) {
    var n = lizenzName(name);
    return n ? (T('lic_fuer', lang) + ' ' + n) : '';
  }

  /* Die eine Zeile, die ueberall steht. In der Testversion gibt es sie
     NICHT — dort sagt der Testbalken, woran man ist, und eine Lizenzzeile
     ohne Lizenz waere eine leere Behauptung. */
  function lizenzZeile(edition, name, lang) {
    if (edition !== 'full') return '';
    var ph = lizenzPhrase(name, lang);
    return ph ? (T('uiEditionVoll', lang) + ' \u00b7 ' + ph) : '';
  }

  /* --------------------------------------------------------- VERSIONSSTEMPEL */

  function stempel(o) {
    o = o || {};
    var mit = (o.etappe || '?') + ' \u00b7 Plan ' + (o.plan || '?');
    return {
      programm: PROGRAMM,
      format: FORMAT,
      geschrieben_mit: mit,
      datum: datumText(o.datum)
    };
  }

  /* -------------------------------------------------------- DATEI SCHREIBEN
   * NUR DIE EINGABEN. Was hier hineingehoert, ist genau das Paar, das auch
   * der Assistent herausgibt und das `formularSetzen()` entgegennimmt:
   * `auswahl` (die Auswahlgruppen samt Freischalt-Haken) und `werte` (die
   * Eingabefelder). Kein eta, kein a_gewaehlt, keine Ampel. */

  function baueDatei(e) {
    e = e || {};
    var raus = { ok: false, text: '', fehler: [], stempel: null };
    var au = e.auswahl, we = e.werte;

    if (!au || typeof au !== 'object' || !we || typeof we !== 'object') {
      raus.fehler.push({ code: CODES.keine_eingaben });
      return raus;
    }

    var st = stempel(e);
    var d = {
      programm: st.programm,
      format: st.format,
      geschrieben_mit: st.geschrieben_mit,
      datum: st.datum,
      bezeichnung: istText(e.bezeichnung) ? e.bezeichnung : '',
      lizenz: istText(e.lizenz) ? e.lizenz : '',
      sprache: istText(e.sprache) ? e.sprache : 'de',
      eingaben: { auswahl: {}, werte: {} },
      /* AUSDRUECKLICH DOKUMENTATION, NIE ZUM ZURUECKLESEN (5.1-8).
         Sie haelt fest, was DAMALS galt; ausgewertet wird beim Oeffnen immer
         der aktuelle Stand. Ohne sie saehe eine zwei Jahre alte Datei
         vollstaendiger aus, als sie war. */
      dokumentation: {
        hinweis: CODES.dokumentation,
        nicht_geprueft: [],
        module: []
      }
    };

    var k;
    for (k in au) if (Object.prototype.hasOwnProperty.call(au, k)) {
      if (au[k] === null || au[k] === undefined || au[k] === '') continue;
      d.eingaben.auswahl[k] = au[k];
    }
    for (k in we) if (Object.prototype.hasOwnProperty.call(we, k)) {
      if (we[k] === null || we[k] === undefined || we[k] === '') continue;
      d.eingaben.werte[k] = we[k];
    }

    var i;
    if (e.nicht_geprueft && e.nicht_geprueft.length) {
      for (i = 0; i < e.nicht_geprueft.length; i++) {
        d.dokumentation.nicht_geprueft.push(e.nicht_geprueft[i]);
      }
    }
    if (e.module && e.module.length) {
      for (i = 0; i < e.module.length; i++) {
        d.dokumentation.module.push({
          name: e.module[i].name || '',
          version: e.module[i].version || null
        });
      }
    }

    raus.ok = true;
    raus.stempel = st;
    raus.daten = d;
    raus.text = JSON.stringify(d, null, 2);
    return raus;
  }

  /* ------------------------------------------------------------ DATEI LESEN
   * Drei Faelle nach 5.1-8. Der dritte ist der wichtige: eine NEUERE Datei
   * wird nicht geoeffnet. Sie enthaelt womoeglich Angaben, die dieses
   * Programm nicht kennt — sie halb zu lesen waere schlimmer, als sie
   * abzulehnen. */

  function lieseDatei(text) {
    var raus = {
      ok: false, fehler: [], warnungen: [],
      stempel: null, lage: null, eingaben: null, dokumentation: null
    };

    if (!istText(text) || !text.replace(/\s+/g, '')) {
      raus.fehler.push({ code: CODES.kein_text });
      return raus;
    }

    var d = null;
    try { d = JSON.parse(text); } catch (ex) { d = null; }
    if (!d || typeof d !== 'object') {
      raus.fehler.push({ code: CODES.kein_json });
      return raus;
    }

    if (d.programm !== PROGRAMM) {
      raus.fehler.push({ code: CODES.fremdes_programm, wert: d.programm || '' });
      return raus;
    }

    if (typeof d.format !== 'number' || !isFinite(d.format)) {
      raus.fehler.push({ code: CODES.format_fehlt });
      return raus;
    }

    raus.stempel = {
      programm: d.programm,
      format: d.format,
      geschrieben_mit: istText(d.geschrieben_mit) ? d.geschrieben_mit : '',
      datum: istText(d.datum) ? d.datum : ''
    };

    if (d.format > FORMAT) {
      raus.lage = 'neuer';
      raus.fehler.push({
        code: CODES.datei_neuer,
        wert: String(d.format), erwartet: String(FORMAT),
        geschrieben_mit: raus.stempel.geschrieben_mit
      });
      return raus;                     /* HIER wird abgebrochen — bewusst. */
    }

    var ein = d.eingaben;
    if (!ein || typeof ein !== 'object' ||
        !ein.auswahl || typeof ein.auswahl !== 'object' ||
        !ein.werte || typeof ein.werte !== 'object') {
      raus.fehler.push({ code: CODES.ohne_eingaben });
      return raus;
    }

    raus.lage = (d.format < FORMAT) ? 'aelter' : 'gleich';
    if (raus.lage === 'aelter') {
      /* OEFFNEN, ABER SAGEN, AUS WELCHER FASSUNG SIE STAMMT. Nie
         stillschweigend umrechnen. */
      raus.warnungen.push({
        code: CODES.datei_aelter,
        wert: String(d.format), erwartet: String(FORMAT),
        geschrieben_mit: raus.stempel.geschrieben_mit,
        datum: raus.stempel.datum
      });
    }

    raus.ok = true;
    raus.bezeichnung = istText(d.bezeichnung) ? d.bezeichnung : '';
    /* Die Lizenzzeile der FREMDEN Datei wird gelesen, aber nie uebernommen —
       sie gehoert zu dem, der sie geschrieben hat. */
    raus.lizenz = istText(d.lizenz) ? d.lizenz : '';
    raus.sprache = istText(d.sprache) ? d.sprache : null;
    raus.eingaben = { auswahl: ein.auswahl, werte: ein.werte };
    /* Die Dokumentation wird HERAUSGEGEBEN, aber sie ist ausdruecklich
       nicht Teil von `eingaben` — wer sie zurueckschreibt, macht aus einer
       Notiz von damals eine Vorgabe von heute. */
    raus.dokumentation = d.dokumentation || null;
    return raus;
  }

  /* --------------------------------------------------------------- DATEINAME
   * Bezeichnung + Datum (Plan 5, N11). Der Dateiname darf nichts enthalten,
   * woran ein Dateisystem haengenbleibt — und er darf nicht leer werden,
   * wenn die Bezeichnung nur aus Sonderzeichen besteht. */

  var UMLAUT = { '\u00e4': 'ae', '\u00f6': 'oe', '\u00fc': 'ue', '\u00df': 'ss',
                 '\u00c4': 'Ae', '\u00d6': 'Oe', '\u00dc': 'Ue' };

  function saeubere(s) {
    if (!istText(s)) return '';
    var r = '', i, c;
    for (i = 0; i < s.length; i++) {
      c = s.charAt(i);
      if (UMLAUT[c]) { r += UMLAUT[c]; continue; }
      if (/[A-Za-z0-9]/.test(c)) { r += c; continue; }
      if (/[ \-_.\/\\]/.test(c)) { r += '_'; continue; }
      /* alles Uebrige faellt weg — lieber ein kurzer Name als ein kaputter */
    }
    r = r.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    return r.substring(0, 40);
  }

  function dateiname(bezeichnung, datum, endung) {
    var b = saeubere(bezeichnung);
    var t = datumText(datum);
    var n = PROGRAMM;
    if (b) n += '_' + b;
    if (t) n += '_' + t;
    return n + (istText(endung) ? endung : ENDUNG);
  }

  /* --------------------------------------------------------------- BILDMASS
   * Die Rechnung sitzt HIER und nicht in `ui.js` — dort ist `Math.` seit
   * N5b verboten (Plan 4.10c) und das bleibt so. `ui.js` bekommt fertige
   * Zahlen und setzt sie nur ein.
   * Zielgroesse in Twips (1/1440 Zoll): eine A4-Seite mit 2 cm Raendern
   * traegt rund 9600 Twips Textbreite. */

  var MAX_TWIPS = 9000;
  var TWIP_JE_PX = 15;              /* 96 dpi: 1440/96 = 15 */

  function bildMasse(breite_px, hoehe_px, maxTwips) {
    var mx = (typeof maxTwips === 'number' && maxTwips > 0) ? maxTwips : MAX_TWIPS;
    var b = Number(breite_px), h = Number(hoehe_px);
    if (!isFinite(b) || !isFinite(h) || b <= 0 || h <= 0) return null;
    var bw = b * TWIP_JE_PX, hw = h * TWIP_JE_PX;
    if (bw > mx) { hw = hw * (mx / bw); bw = mx; }
    return {
      breite_px: Math.round(b), hoehe_px: Math.round(h),
      breite_twips: Math.round(bw), hoehe_twips: Math.round(hw)
    };
  }

  /* Aus dem viewBox-Attribut werden feste Pixelmasse. `svglib.svg()` setzt
     `width="100%"` — ein Bild ohne feste Groesse zeichnet keine Canvas. */
  function svgMitMassen(svgText, skala) {
    if (!istText(svgText) || svgText.indexOf('<svg') < 0) return null;
    var m = svgText.match(/viewBox="0 0 ([0-9.]+) ([0-9.]+)"/);
    if (!m) return null;
    var s = (typeof skala === 'number' && skala > 0) ? skala : 2;
    var b = Math.round(Number(m[1]) * s), h = Math.round(Number(m[2]) * s);
    if (!isFinite(b) || !isFinite(h) || b <= 0 || h <= 0) return null;
    var neu = svgText.replace('width="100%"', 'width="' + b + '" height="' + h + '"');
    if (neu === svgText) neu = svgText.replace('<svg ', '<svg width="' + b + '" height="' + h + '" ');
    return { svg: neu, breite: b, hoehe: h };
  }

  /* ------------------------------------------------------------------- RTF */

  /* Base64 -> Hex, ohne Buffer und ohne atob: beides gibt es nicht auf
     beiden Seiten. Reiner Zeichenweg, damit Node und Browser dasselbe
     liefern — sonst waere der Test wertlos. */
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var HEX = '0123456789abcdef';

  function hexByte(b) { return HEX.charAt((b >> 4) & 15) + HEX.charAt(b & 15); }

  function b64ZuHex(b64) {
    if (!istText(b64)) return null;
    var s = b64.replace(/^data:[^,]*,/, '').replace(/[\r\n\s]/g, '');
    s = s.replace(/=+$/, '');
    var out = '', puffer = 0, bits = 0, i, v;
    for (i = 0; i < s.length; i++) {
      v = B64.indexOf(s.charAt(i));
      if (v < 0) return null;                    /* kein gueltiges Base64 */
      puffer = (puffer << 6) | v;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        out += hexByte((puffer >> bits) & 255);
      }
    }
    return out;
  }

  /* RTF kennt nur ASCII. Alles darueber wird als \uNNNN? geschrieben —
     mit Ersatzzeichen, damit auch ein alter Leser etwas anzeigt. */
  function rtfText(s) {
    if (s === 0) s = '0';
    if (!s && s !== 0) return '';
    s = String(s);
    var r = '', i, c, code;
    for (i = 0; i < s.length; i++) {
      c = s.charAt(i);
      code = s.charCodeAt(i);
      if (c === '\\') { r += '\\\\'; continue; }
      if (c === '{') { r += '\\{'; continue; }
      if (c === '}') { r += '\\}'; continue; }
      if (c === '\n') { r += '\\par '; continue; }
      if (code < 128) { r += c; continue; }
      r += '\\u' + (code > 32767 ? code - 65536 : code) + '?';
    }
    return r;
  }

  /* DIE HEX-DATEN MUESSEN UMBROCHEN WERDEN — sonst oeffnet Word die Datei
     nicht (Befund 2026-08-07, an Dieters erster Ausgabe gemessen).
     Ein 640x480-Nahtbild ergibt rund 11 kB PNG und damit ueber 22.000
     Hex-Zeichen. Standen sie auf EINER Zeile, hat Word beim Laden
     festgehangen; die Datei war formal richtig und trotzdem unbrauchbar.
     Word selbst schreibt Bilddaten mit 128 Zeichen je Zeile — genau das
     wird hier gemacht. Ein Zeilenumbruch zwischen zwei Hex-Ziffern ist fuer
     jeden RTF-Leser bedeutungslos, fuer manchen aber der Unterschied
     zwischen "oeffnet" und "oeffnet nicht". */
  var HEX_JE_ZEILE = 128;

  function hexUmbrechen(hex) {
    var r = [], i;
    for (i = 0; i < hex.length; i += HEX_JE_ZEILE) {
      r.push(hex.substring(i, i + HEX_JE_ZEILE));
    }
    return r.join('\n');
  }

  function bildBlock(png, masse) {
    if (!masse) return null;
    var hex = b64ZuHex(png);
    if (!hex) return null;
    /* Eine ungerade Zahl Hex-Ziffern waere ein halbes Byte — daran scheitert
       jeder Leser, und zwar still. Lieber gar kein Bild als ein kaputtes. */
    if (hex.length % 2 !== 0) return null;
    return '{\\pict\\pngblip' +
           '\\picw' + masse.breite_px + '\\pich' + masse.hoehe_px +
           '\\picwgoal' + masse.breite_twips + '\\pichgoal' + masse.hoehe_twips +
           '\n' + hexUmbrechen(hex) + '}';
  }

  /* ------------------------------------------------------------- DER BERICHT
   * Ein Bericht ist DATEN, kein Text — dieselbe Haltung wie bei der
   * Schrittliste in `rechenweg.js` (Plan 4.9). Er wird einmal gebaut und
   * dann in ein Format gegossen. Die Zahlen und Beschriftungen kommen
   * fertig aus `rechenweg.rendere()`; hier wird nichts nachgerechnet und
   * nichts nachformatiert. */

  function baueBericht(e) {
    e = e || {};
    var lang = e.sprache || 'de';
    var b = {
      ok: false, sprache: lang,
      titel: T('rw_titel', lang),
      programm: PROGRAMM,
      bezeichnung: istText(e.bezeichnung) ? e.bezeichnung : '',
      datum: datumText(e.datum),
      version: istText(e.version) ? e.version : '',
      module: [],
      anforderung: istText(e.anforderung) ? e.anforderung : '',
      /* DER HAFTUNGSHINWEIS IST PFLICHT IN JEDER AUSGABE (Plan 2.4). Er
         fehlte in Druck und Word, weil er am Bildschirm in der Fusszeile
         steht und die im Druck ausgeblendet ist (Befund 2026-08-07). Er
         kommt hier aus dem Woerterbuch, nicht aus der Oberflaeche — dann
         kann ihn kein Ausblenden mehr verschlucken. */
      lizenz: istText(e.lizenz) ? e.lizenz : '',
      haftung: T('disclaimer', lang),
      impressum: T('impressum', lang),
      karten: [], abschnitte: [], abschnitt_codes: [],
      luecken: [], warnungen: [], hinweise: [],
      bilder: [], fehler: []
    };

    var i, j;
    if (e.module && e.module.length) {
      for (i = 0; i < e.module.length; i++) {
        b.module.push((e.module[i].name || '') + ' ' + (e.module[i].version || '?'));
      }
    }

    /* Die Ergebniskarten kommen so herein, wie die Oberflaeche sie ohnehin
       anzeigt: Beschriftung und fertiger Wert. Zwei Wege zu derselben Zahl
       waeren zwei Gelegenheiten, sie verschieden zu zeigen. */
    if (e.karten && e.karten.length) {
      for (i = 0; i < e.karten.length; i++) {
        var k = e.karten[i] || {}, zeilen = [];
        for (j = 0; j < (k.zeilen || []).length; j++) {
          zeilen.push({
            k: istText(k.zeilen[j].k) ? k.zeilen[j].k : '',
            v: istText(k.zeilen[j].v) ? k.zeilen[j].v : String(k.zeilen[j].v)
          });
        }
        b.karten.push({ titel: k.titel || '', zeilen: zeilen });
      }
    }

    if (e.bilder && e.bilder.length) {
      for (i = 0; i < e.bilder.length; i++) {
        var bi = e.bilder[i] || {};
        b.bilder.push({
          titel: bi.titel || '',
          png: istText(bi.png) ? bi.png : null,
          breite_px: bi.breite_px || 0,
          hoehe_px: bi.hoehe_px || 0,
          grund: bi.png ? null : (bi.grund || CODES.bild_fehlt)
        });
      }
    }

    var rw = e.rw;
    if (!rw || !rw.ok) {
      /* OHNE ERGEBNIS GIBT ES KEINEN NACHWEIS — und der Bericht sagt das,
         statt ein leeres Blatt zu drucken, das aussieht wie ein Ergebnis. */
      b.fehler.push({ code: CODES.ohne_ergebnis });
      return b;
    }

    var g = (Weg && Weg.rendere) ? Weg.rendere(rw, lang) : null;
    if (!g || !g.ok) { b.fehler.push({ code: CODES.ohne_ergebnis }); return b; }

    for (i = 0; i < g.abschnitte.length; i++) {
      b.abschnitte.push({ titel: g.abschnitte[i].titel, schritte: g.abschnitte[i].schritte });
      b.abschnitt_codes.push(g.abschnitte[i].code);
    }
    b.selbstpruefung_ok = g.selbstpruefung_ok;
    b.nachweis_ok = rw.nachweis_ok;
    b.n_schritte = g.schritte.length;

    /* DIE EHRLICHEN LUECKEN GEHOEREN IN JEDE AUSGABE (Plan 2.4) — ohne
       Antippen, ohne Klappe, und in der Datei ohne Blaettern. */
    for (i = 0; i < (rw.nicht_geprueft || []).length; i++) {
      b.luecken.push(T(rw.nicht_geprueft[i], lang));
    }
    for (i = 0; i < (rw.warnungen || []).length; i++) {
      b.warnungen.push(T(rw.warnungen[i].code || rw.warnungen[i], lang));
    }
    for (i = 0; i < (rw.hinweise || []).length; i++) {
      b.hinweise.push(T(rw.hinweise[i].code || rw.hinweise[i], lang));
    }

    b.ok = true;
    return b;
  }

  /* ---------------------------------------------------------------- WORD */

  function baueRtf(bericht, opt) {
    opt = opt || {};
    var raus = { ok: false, text: '', bilder_ein: 0, bilder_aus: 0, fehler: [] };
    if (!bericht || !bericht.ok) {
      raus.fehler.push({ code: CODES.ohne_ergebnis });
      return raus;
    }
    var lang = bericht.sprache || 'de';
    var t = [], i, j;

    function p(s) { t.push(s); }
    /* Auch lange TEXTzeilen werden umbrochen. Ein Zeilenumbruch ist in RTF
       bedeutungslos — das Leerzeichen bleibt am Zeilenende stehen, also
       kleben keine Woerter zusammen. Umbrochen wird nur an Leerzeichen,
       nie mitten in einer Folge wie \u252? — die enthaelt keine. */
    function weich(t) {
      if (t.length <= 200) return t;
      var raus = [], rest = t, schnitt;
      while (rest.length > 200) {
        schnitt = rest.lastIndexOf(' ', 200);
        if (schnitt <= 0) break;            /* ein einzelnes langes Wort */
        raus.push(rest.substring(0, schnitt + 1));
        rest = rest.substring(schnitt + 1);
      }
      raus.push(rest);
      return raus.join('\n');
    }

    function zeile(s) { p(weich(rtfText(s)) + '\\par'); }
    function fett(s) { p('{\\b ' + rtfText(s) + '}\\par'); }
    /* Manche Beschriftungen tragen im Woerterbuch schon einen Doppelpunkt —
       als Ueberschrift sieht das falsch aus. */
    function ueber(s) { p('\\par{\\b\\fs28 ' + rtfText(String(s || '').replace(/\s*:\s*$/, '')) + '}\\par'); }
    /* Eine Zwischenueberschrift innerhalb einer Karte hat keinen Wert. Ihr
       einen Doppelpunkt anzuhaengen macht aus einer Ueberschrift eine leere
       Angabe. */
    function paar(k, v) { zeile(v ? (k + ':  ' + v) : k); }

    p('{\\rtf1\\ansi\\ansicpg1252\\uc1\\deff0' +
      '{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}}' +
      '\\paperw11906\\paperh16838\\margl1134\\margr1134\\margt1134\\margb1134' +
      '\\f0\\fs20');

    p('{\\b\\fs36 ' + rtfText(bericht.programm) + '}\\par');
    fett(bericht.titel);
    if (bericht.bezeichnung) zeile(bericht.bezeichnung);
    if (bericht.lizenz) zeile(bericht.lizenz);
    if (bericht.datum) zeile(bericht.datum);
    if (bericht.version) zeile(bericht.version);
    p('\\par');

    /* Ergebniskarten zuerst — das ist die Antwort. Der Weg dahin folgt. */
    for (i = 0; i < bericht.karten.length; i++) {
      ueber(bericht.karten[i].titel);
      for (j = 0; j < bericht.karten[i].zeilen.length; j++) {
        paar(bericht.karten[i].zeilen[j].k, bericht.karten[i].zeilen[j].v);
      }
    }

    if (bericht.anforderung) {
      ueber(T('ausf_anforderung', lang));
      zeile(bericht.anforderung);
    }

    /* DIE BILDER — mit Rueckfallweg. Ein fehlendes Bild kostet eine Zeile,
       nicht die Datei. */
    for (i = 0; i < bericht.bilder.length; i++) {
      var bi = bericht.bilder[i];
      ueber(bi.titel);
      var masse = bi.png ? bildMasse(bi.breite_px, bi.hoehe_px, opt.maxTwips) : null;
      var block = bi.png ? bildBlock(bi.png, masse) : null;
      if (block) { p(block + '\\par'); raus.bilder_ein++; }
      else { zeile(T(bi.grund || CODES.bild_fehlt, lang)); raus.bilder_aus++; }
    }

    /* Der Rechenweg vollstaendig — er ist das Nachweis-Herzstueck des
       Produkts (Kickoff 8). Eine Kurzfassung waere ein anderes Produkt. */
    for (i = 0; i < bericht.abschnitte.length; i++) {
      ueber(bericht.abschnitte[i].titel);
      for (j = 0; j < bericht.abschnitte[i].schritte.length; j++) {
        var s = bericht.abschnitte[i].schritte[j];
        var kopf = s.nr + '. ' + s.titel;
        if (s.haken_zeichen) kopf += '  ' + s.haken_zeichen;
        if (s.erfuellt_zeichen) kopf += '  ' + s.erfuellt_zeichen + ' ' + s.erfuellt_text;
        fett(kopf);
        if (s.formel) zeile('   ' + s.formel);
        if (s.eingesetzt) zeile('   ' + s.eingesetzt);
        if (s.ergebnis) zeile('   = ' + s.ergebnis);
        if (s.wert_text) zeile('   ' + s.wert_text);
        if (s.quelle) zeile('   ' + s.quelle);
        if (s.hinweis) zeile('   ' + s.hinweis);
        for (var m = 0; m < (s.liste || []).length; m++) zeile('   \u2013 ' + s.liste[m]);
      }
    }

    /* DER RECHENWEG FUEHRT BEIDE LISTEN BEREITS ALS EIGENEN ABSCHNITT.
       Sie ein zweites Mal anzuhaengen hat in der ersten Word-Datei dazu
       gefuehrt, dass "Was NICHT geprueft wird" zweimal im Blatt stand
       (Befund 2026-08-07). Gedruckt werden sie deshalb nur, wenn der
       Rechenweg sie NICHT hat — die Liste 2.4 darf nie fehlen, aber sie
       darf auch nicht doppelt dastehen. */
    var hatAbschnitt = bericht.abschnitt_codes || [];
    if (bericht.warnungen.length && hatAbschnitt.indexOf('rw_ab_hinweise') < 0) {
      ueber(T('rw_ab_hinweise', lang));
      for (i = 0; i < bericht.warnungen.length; i++) zeile('\u2013 ' + bericht.warnungen[i]);
    }

    if (bericht.luecken.length && hatAbschnitt.indexOf('rw_ab_nicht_geprueft') < 0) {
      ueber(T('rw_ab_nicht_geprueft', lang));
      for (i = 0; i < bericht.luecken.length; i++) zeile('\u2013 ' + bericht.luecken[i]);
    }

    if (bericht.module.length) {
      ueber(T('uiVersionModule', lang));
      zeile(bericht.module.join(' \u00b7 '));
    }

    /* Der Haftungshinweis steht am Schluss des Blattes — ohne Ueberschrift,
       damit er nicht wie ein weiterer Abschnitt aussieht, aber fett, damit
       ihn niemand ueberliest. */
    if (bericht.haftung) { p('\\par'); fett(bericht.haftung); }
    if (bericht.impressum) zeile(bericht.impressum);

    p('}');
    raus.ok = true;
    raus.text = t.join('\n');
    return raus;
  }

  return {
    NAME: NAME, VERSION: VERSION,
    PROGRAMM: PROGRAMM, FORMAT: FORMAT, ENDUNG: ENDUNG,
    AKTIONEN: AKTIONEN, CODES: CODES, SPEICHER: SPEICHER, NAME_MAX: NAME_MAX,
    lizenzName: lizenzName, istAktiviert: istAktiviert,
    lizenzPhrase: lizenzPhrase, lizenzZeile: lizenzZeile,
    MAX_TWIPS: MAX_TWIPS, TWIP_JE_PX: TWIP_JE_PX,
    editionAus: editionAus,
    guard: guard,
    stempel: stempel,
    baueDatei: baueDatei,
    lieseDatei: lieseDatei,
    dateiname: dateiname,
    saeubere: saeubere,
    bildMasse: bildMasse,
    svgMitMassen: svgMitMassen,
    b64ZuHex: b64ZuHex,
    hexUmbrechen: hexUmbrechen,
    HEX_JE_ZEILE: HEX_JE_ZEILE,
    rtfText: rtfText,
    bildBlock: bildBlock,
    baueBericht: baueBericht,
    baueRtf: baueRtf
  };
}));
