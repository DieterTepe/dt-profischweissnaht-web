/* ============================================================================
 * DT-ProfiSchweissnaht · dom_smoke_voll.js   ***DEV-ONLY — NIE AUSLIEFERN***
 * DOM-Smoke mit Mini-DOM-Shim in Node.
 *  - laedt IMMER ALLE Module gemeinsam (echte Ladereihenfolge aus der HTML)
 *  - startet ui.js real gegen den Shim (kein Inline-Skript mehr — N5a)
 *  - klickt die Oberflaeche durch: Sprache, Theme, Aufklappbereiche, Leeren,
 *    Info-Dialog, Aktionsleiste
 * Aufruf:  node dom_smoke_voll.js        (Vollversion)
 *          node dom_smoke_test.js        (Testversion)
 * ========================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');

/* ---------------------------------------------------------------- Mini-DOM */
function Element(tag) {
  this.tagName = (tag || 'div').toUpperCase();
  this.attributes = {};
  this.children = [];
  this._text = '';
  this._html = '';
  this.hidden = false;
  this.value = '';
  this.checked = false;
  this.selectedIndex = 0;
  this.placeholder = '';
  this.listeners = {};
  var self = this;
  this.classList = {
    _set: {},
    add: function (c) { self.classList._set[c] = 1; },
    remove: function (c) { delete self.classList._set[c]; },
    contains: function (c) { return !!self.classList._set[c]; }
  };
  this.style = {};
}
Object.defineProperty(Element.prototype, 'textContent', {
  get: function () { return this._text; },
  set: function (v) { this._text = String(v); this._html = ''; }
});
Object.defineProperty(Element.prototype, 'innerHTML', {
  get: function () { return this._html; },
  set: function (v) { this._html = String(v); this._text = ''; }
});
Object.defineProperty(Element.prototype, 'className', {
  get: function () { return Object.keys(this.classList._set).join(' '); },
  set: function (v) {
    this.classList._set = {};
    String(v).split(/\s+/).forEach(function (c) { if (c) this.classList._set[c] = 1; }, this);
  }
});
Element.prototype.getAttribute = function (n) {
  return Object.prototype.hasOwnProperty.call(this.attributes, n) ? this.attributes[n] : null;
};
Element.prototype.setAttribute = function (n, v) {
  this.attributes[n] = String(v);
  if (n === 'class') this.className = String(v);
  if (n === 'placeholder') this.placeholder = String(v);
};
Element.prototype.hasAttribute = function (n) {
  return Object.prototype.hasOwnProperty.call(this.attributes, n);
};
Element.prototype.addEventListener = function (ev, fn) {
  (this.listeners[ev] = this.listeners[ev] || []).push(fn);
};
Element.prototype.feuere = function (ev) {
  var l = this.listeners[ev] || [];
  for (var i = 0; i < l.length; i++) l[i].call(this, { type: ev, target: this });
};
Element.prototype.click = function () { this.feuere('click'); };
Element.prototype.change = function () { this.feuere('change'); };
/* Sichtbarer Inhalt eines Elements: Text, HTML und die sprechenden Attribute. */
Element.prototype.inhalt = function () {
  return this._html + ' ' + this._text + ' ' +
         (this.attributes.title || '') + ' ' + (this.placeholder || '');
};

/* Baut aus der HTML einen flachen Elementbestand: jedes Tag wird ein Element,
   Attribute werden uebernommen. Kein Baum — die Oberflaeche spricht ihre
   Elemente ueber Ids und Klassen an, nicht ueber Nachbarschaft. */
function baueDom(html) {
  var byId = {}, elemente = [];
  var tagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, m;

  while ((m = tagRe.exec(html)) !== null) {
    var tag = m[1].toLowerCase(), roh = m[2] || '';
    if (tag === 'script' || tag === 'meta' || tag === 'link' || tag === 'br') continue;
    var e = new Element(tag);
    var aRe = /([a-zA-Z][-a-zA-Z0-9_:]*)\s*=\s*"([^"]*)"/g, am;
    while ((am = aRe.exec(roh)) !== null) e.setAttribute(am[1].toLowerCase(), am[2]);
    if (/(^|\s)hidden(\s|$|=)/.test(roh)) e.hidden = true;
    if (e.attributes.value) e.value = e.attributes.value;
    elemente.push(e);
    var i = e.getAttribute('id');
    if (i && !byId[i]) byId[i] = e;
  }

  function passt(e, sel) {
    if (sel.charAt(0) === '.') return e.classList.contains(sel.slice(1));
    if (sel.charAt(0) === '[') return e.hasAttribute(sel.slice(1, sel.length - 1));
    return e.tagName === sel.toUpperCase();
  }

  var docEl = new Element('html');
  docEl.setAttribute('lang', 'de');
  var mTheme = html.match(/<html[^>]*data-theme="([a-z]+)"/);
  if (mTheme) docEl.setAttribute('data-theme', mTheme[1]);

  var document = {
    documentElement: docEl,
    title: '',
    getElementById: function (i) { return byId[i] || null; },
    createElement: function (t) { return new Element(t); },
    querySelectorAll: function (sel) {
      var r = [], teile = String(sel).split(','), k, s;
      for (var a = 0; a < elemente.length; a++) {
        for (k = 0; k < teile.length; k++) {
          s = teile[k].replace(/^\s+|\s+$/g, '');
          if (s && passt(elemente[a], s)) { r.push(elemente[a]); break; }
        }
      }
      return r;
    }
  };

  return {
    document: document, byId: byId, docEl: docEl, elemente: elemente,
    langBtns: document.querySelectorAll('.lang-btn'),
    alleTexte: function () {
      var s = document.title + ' ';
      for (var a = 0; a < elemente.length; a++) s += elemente[a].inhalt() + ' ';
      return s;
    }
  };
}

/* -------------------------------------------------------------- Smoke-Lauf */
function lauf(edition) {
  var N = 0, FAIL = [];
  function ok(bed, txt) {
    N++;
    if (!bed) { FAIL.push(txt); console.log('  ✗ ' + txt); }
  }

  var datei = (edition === 'test') ? 'DT-ProfiSchweissnaht_Test.html' : 'DT-ProfiSchweissnaht.html';
  var htmlPfad = path.join(__dirname, datei);
  var html = fs.readFileSync(htmlPfad, 'utf8');

  console.log('\n— DOM-Smoke ' + (edition === 'test' ? 'TESTVERSION' : 'VOLLVERSION') + ' (' + datei + ') —');

  /* ---------------------------------------------- 1) Rahmen der HTML ---- */
  var mEd = html.match(/window\.DT_EDITION\s*=\s*'(full|test)'/);
  ok(!!mEd, 'Editionsweiche in der HTML gefunden');
  ok(mEd && mEd[1] === edition, 'Editionsweiche steht auf "' + edition + '"');
  ok(/<html lang="de" translate="no" data-theme="dark">/.test(html),
     'START IMMER DUNKEL: data-theme="dark" steht schon im html-Tag (kein Aufblitzen)');
  ok(/<meta name="google" content="notranslate">/.test(html), 'notranslate-Meta gesetzt');
  ok(/<link rel="stylesheet" href="style\.css">/.test(html), 'style.css eingebunden');
  ok(html.indexOf('<script>\n(function') < 0,
     'die Zwischen-Statusseite aus N1-N4 ist verschwunden (kein Inline-Skript mehr)');
  var inlineZahl = (html.match(/<script>/g) || []).length;
  ok(inlineZahl === 1, 'genau ein Inline-Skript in der HTML: die Editionsweiche (ist ' + inlineZahl + ')');

  var srcRe = /<script src="([^"]+)"><\/script>/g, srcs = [], mm;
  while ((mm = srcRe.exec(html)) !== null) srcs.push(mm[1]);
  var erwartet = ['i18n_kern.js', 'i18n_hilfe.js', 'i18n_kerbfall.js', 'daten.js', 'optionen.js',
                  'validate.js', 'naht.js', 'profil.js', 'svglib.js', 'schaubild.js',
                  'solver.js', 'rechenweg.js', 'ui.js'];
  ok(srcs.join(',') === erwartet.join(','), 'Ladereihenfolge stimmt: ' + srcs.join(' → '));
  ok(srcs[srcs.length - 1] === 'ui.js', 'ui.js laedt zuletzt');
  ok(srcs.length === 13, '13 Module eingebunden (ist ' + srcs.length + ')');

  /* ------------------------------------- 2) ALLE Module gemeinsam laden -- */
  var d = baueDom(html);
  var win = { DT_EDITION: edition, alert: function (t) { win._letzterAlert = t; } };
  var namen = { 'i18n_kern.js': 'DTNI18nKern', 'i18n_hilfe.js': 'DTNI18nHilfe',
                'i18n_kerbfall.js': 'DTNI18nKerb', 'daten.js': 'DTNData',
                'optionen.js': 'DTNOptions', 'validate.js': 'DTNValidate',
                'naht.js': 'DTNNaht', 'profil.js': 'DTNProfil',
                'svglib.js': 'DTNSvgLib', 'schaubild.js': 'DTNSchaubild',
                'solver.js': 'DTNSolver', 'rechenweg.js': 'DTNRechenweg',
                'ui.js': 'DTNUi' };
  for (var i = 0; i < srcs.length; i++) {
    var mod = require('./' + srcs[i]);
    win[namen[srcs[i]]] = mod;
    ok(!!mod, 'Modul geladen: ' + srcs[i]);
  }
  win.document = d.document;
  win.window = win;

  var UI = win.DTNUi, Kern = win.DTNI18nKern;
  ok(UI.START_THEME === 'dark', 'ui.js traegt die bindende Vorgabe START_THEME = dark (Plan 3.1)');
  ok(UI.BEREICHE.length === 8, 'acht aufklappbare Bereiche vorgesehen (ist ' + UI.BEREICHE.length + ')');

  /* Pflicht-Elemente: jede Id aus ui.js muss in der HTML wirklich stehen. */
  for (i = 0; i < UI.IDS.length; i++) {
    ok(!!d.byId[UI.IDS[i]], 'Pflicht-Element in der HTML vorhanden: #' + UI.IDS[i]);
  }
  for (i = 0; i < UI.BEREICHE.length; i++) {
    var c = UI.BEREICHE[i];
    ok(!!d.byId['accBtn_' + c] && !!d.byId['accBody_' + c] && !!d.byId['accTitel_' + c],
       'Bereich vollstaendig angelegt: ' + c);
  }

  /* ------------------------------------------ 3) Oberflaeche starten ----- */
  var fehler = null, s = null;
  try { s = UI.start(win, d.document); } catch (e) { fehler = e; }
  ok(!fehler, 'Oberflaeche laeuft ohne Fehler an' + (fehler ? ' — ' + fehler.message : ''));
  if (fehler || !s) { return { N: N, FAIL: FAIL }; }

  ok(s.sprache() === 'de', 'Startsprache ist Deutsch');
  ok(s.theme() === 'dark', 'START IMMER DUNKEL: die Oberflaeche startet im dunklen Design');
  ok(d.docEl.getAttribute('data-theme') === 'dark', 'data-theme steht nach dem Start auf dark');
  ok(d.docEl.getAttribute('lang') === 'de', 'Dokumentsprache steht auf de');
  ok(/DT-ProfiSchweissnaht/.test(d.document.title), 'Seitentitel traegt den Produktnamen');
  ok(s.edition() === edition, 'Oberflaeche kennt die Edition "' + edition + '"');

  /* ------------------------------------------------ 4) Editionsverhalten - */
  if (edition === 'test') {
    ok(d.byId.editionBar.hidden === false, 'Testbalken ist sichtbar');
    ok(/Testversion/i.test(d.byId.editionBar.inhalt()), 'Testbalken traegt den Testversion-Text');
    ok(/gesperrt/i.test(d.byId.editionBar.inhalt()), 'Testbalken sagt ehrlich, dass die Ausgaben gesperrt sind');
  } else {
    ok(d.byId.editionBar.hidden === true, 'Vollversion zeigt keinen Testbalken');
    ok(d.byId.licenseLine.hidden === true, 'Lizenzzeile bleibt leer bis zur Registrierung (N12)');
  }

  /* -------------------------------------------------- 5) Texte auf DE ---- */
  ok(d.byId.brandMark.inhalt().indexOf('DT-ProfiSchweissnaht') >= 0, 'Marke steht im Kopf');
  ok(/Stahlbau/.test(d.byId.brandTag.inhalt()), 'DE: Untertitel der Marke uebersetzt');
  ok(/Berechnen/.test(d.byId.calcBtn.inhalt()), 'DE: Knopf "Berechnen"');
  ok(/Leeren/.test(d.byId.resetBtn.inhalt()), 'DE: Knopf "Leeren"');
  ok(/Beispiel laden/.test(d.byId.presetLabel.inhalt()), 'DE: "Beispiel laden"');
  ok(/Assistent/.test(d.byId.assistBtn.inhalt()), 'DE: Knopf "Assistent starten"');
  ok(/Speichern/.test(d.byId.saveBtn.inhalt()), 'DE: Aktionsleiste "Speichern (.dts)"');
  ok(/\.dts/.test(d.byId.saveBtn.inhalt()), 'Projektdateiendung .dts steht am Knopf');
  ok(/ffnen/.test(d.byId.loadBtn.inhalt()), 'DE: Aktionsleiste "Oeffnen"');
  ok(/Drucken/.test(d.byId.printBtn.inhalt()), 'DE: Aktionsleiste "Drucken / PDF"');
  ok(/Word/.test(d.byId.rtfBtn.inhalt()), 'DE: Aktionsleiste "Word (.rtf)"');
  ok(/Bezeichnung/.test(d.byId.dtLabel.placeholder), 'DE: Bezeichnungsfeld hat einen Platzhaltertext');
  ok(/Hell/.test(d.byId.themeBtn.getAttribute('title') || ''), 'DE: Theme-Knopf hat einen Titel');
  ok(/Info/.test(d.byId.infoBtn.getAttribute('title') || ''), 'DE: Info-Knopf hat einen Titel');
  ok(/ohne Gew/.test(d.byId.footNote.inhalt()), 'DE: der Produkt-Disclaimer steht in der Fusszeile');
  ok(/Dreierwalde/.test(d.byId.footImpressum.inhalt()), 'das Impressum steht in der Fusszeile');
  ok(/N5b/.test(d.byId.geruestNote.inhalt()), 'die Karte sagt ehrlich, dass die Felder erst in N5b kommen');
  ok(d.byId.resultIdle.inhalt().length > 20, 'Ergebniskarte traegt einen Leertext');
  ok(d.byId.vizIdle.inhalt().length > 20, 'Nahtbildkarte traegt einen Leertext');
  ok(d.byId.pathIdle.inhalt().length > 20, 'Rechenwegkarte traegt einen Leertext');

  var bereichTexteDe = [];
  for (i = 0; i < UI.BEREICHE.length; i++) {
    var cc = UI.BEREICHE[i];
    var titel = d.byId['accTitel_' + cc].inhalt();
    var hint = d.byId['accHint_' + cc].inhalt();
    bereichTexteDe.push(titel);
    ok(titel.replace(/\s/g, '').length > 3 && titel.indexOf('[') < 0,
       'DE: Bereichstitel uebersetzt: ' + cc + ' → ' + titel.replace(/\s+/g, ' ').substring(0, 40));
    ok(hint.replace(/\s/g, '').length > 30, 'DE: Bereich ' + cc + ' hat eine Laien-Erklaerung');
  }
  ok(/Grundeinstellung/.test(bereichTexteDe[0]), 'DE: der erste Bereich heisst "Grundeinstellung"');
  ok(/Ausf/.test(bereichTexteDe[7]), 'DE: der letzte Bereich ist "Ausfuehrung und Dokumentation"');
  ok(!/\[[a-zA-Z0-9_]+\]/.test(d.alleTexte()), 'DE: kein unuebersetzter Platzhalter auf der ganzen Seite');

  /* ------------------------------------------- 6) Aufklappen durchklicken */
  ok(s.istOffen('grund') === true, 'Startzustand: der erste Bereich ist offen');
  ok(d.byId.accBody_grund.hidden === false, 'Startzustand: sein Inhalt ist sichtbar');
  var zu = 0;
  for (i = 1; i < UI.BEREICHE.length; i++) if (!s.istOffen(UI.BEREICHE[i])) zu++;
  ok(zu === 7, 'Startzustand: die uebrigen sieben Bereiche sind zu (ist ' + zu + ')');

  for (i = 0; i < UI.BEREICHE.length; i++) {
    var code = UI.BEREICHE[i];
    var vorher = s.istOffen(code);
    d.byId['accBtn_' + code].click();
    ok(s.istOffen(code) === !vorher, 'Klick schaltet den Bereich um: ' + code);
    ok(d.byId['accBody_' + code].hidden === vorher, 'Inhalt folgt dem Zustand: ' + code);
    ok(d.byId['accBtn_' + code].getAttribute('aria-expanded') === (!vorher ? 'true' : 'false'),
       'aria-expanded stimmt: ' + code);
    d.byId['accBtn_' + code].click();
    ok(s.istOffen(code) === vorher, 'zweiter Klick schaltet zurueck: ' + code);
  }

  /* ------------------------------------------------------- 7) Leeren ----- */
  d.byId.dtLabel.value = 'Konsole links';
  d.byId.presetSel.value = 'irgendwas';
  s.schalte('lasten', true);
  s.schalte('grund', false);
  var geleert = s.leeren();
  ok(geleert >= 2, 'Leeren fasst alle Eingabeelemente an (ist ' + geleert + ')');
  ok(d.byId.dtLabel.value === '', 'Leeren raeumt das Bezeichnungsfeld wirklich leer (Plan 3.1)');
  ok(d.byId.presetSel.value === '', 'Leeren setzt auch die Auswahl zurueck');
  ok(s.istOffen('grund') === true && s.istOffen('lasten') === false,
     'Leeren stellt den Startzustand der Bereiche wieder her');
  ok(/geleert/i.test(d.byId.dtMsg.inhalt()), 'Leeren meldet sichtbar, dass alles leer ist');

  /* ------------------------------- 8) Knoepfe, die noch nicht rechnen ---- */
  d.byId.calcBtn.click();
  ok(/N5c/.test(d.byId.dtMsg.inhalt()), '"Berechnen" sagt ehrlich, dass es erst in N5c verdrahtet wird');
  d.byId.assistBtn.click();
  ok(/N8/.test(d.byId.dtMsg.inhalt()), '"Assistent" verweist ehrlich auf Baustein N8');
  var ausgaben = ['saveBtn', 'loadBtn', 'printBtn', 'rtfBtn'];
  for (i = 0; i < ausgaben.length; i++) {
    d.byId[ausgaben[i]].click();
    ok(/N11/.test(d.byId.dtMsg.inhalt()),
       'Ausgabeknopf verweist ehrlich auf Baustein N11: ' + ausgaben[i]);
  }
  d.byId.presetSel.change();
  ok(/N7/.test(d.byId.dtMsg.inhalt()), 'Beispielauswahl verweist ehrlich auf Baustein N7');

  /* ------------------------------------------------------- 9) Theme ----- */
  ok(d.byId.infoModal.hidden === true, 'der Info-Dialog ist beim Start zu');
  d.byId.themeBtn.click();
  ok(s.theme() === 'light', 'Theme schaltet auf hell');
  ok(d.docEl.getAttribute('data-theme') === 'light', 'data-theme folgt auf light');
  d.byId.themeBtn.click();
  ok(s.theme() === 'dark', 'Theme schaltet zurueck auf dunkel');
  ok(d.docEl.getAttribute('data-theme') === 'dark', 'data-theme folgt zurueck auf dark');

  /* --------------------------------------------------- 10) Info-Dialog -- */
  d.byId.infoBtn.click();
  ok(d.byId.infoModal.hidden === false, 'Info-Knopf oeffnet den Dialog');
  ok(/Dreierwalde/.test(d.byId.infoImpressum.inhalt()), 'der Dialog zeigt das Impressum');
  ok(/EN 1993-1-8/.test(d.byId.infoNormen.inhalt()), 'der Dialog nennt die Regelwerke');
  ok(/ohne Gew/.test(d.byId.infoDisclaimer.inhalt()), 'der Dialog nennt den Disclaimer');
  ok(d.byId.infoEdition.inhalt().replace(/\s/g, '').length > 4, 'der Dialog nennt die Edition');
  if (edition === 'test') {
    ok(/gesperrt/i.test(d.byId.infoEdition.inhalt()), 'Testversion: der Dialog nennt die gesperrten Ausgaben');
  } else {
    ok(/Vollversion/.test(d.byId.infoEdition.inhalt()), 'Vollversion: der Dialog nennt die Vollversion');
  }
  d.byId.infoClose.click();
  ok(d.byId.infoModal.hidden === true, 'der Dialog laesst sich wieder schliessen');

  /* -------------------------------------------- 11) Sprache durchklicken - */
  function klick(l) {
    for (var k = 0; k < d.langBtns.length; k++) {
      if (d.langBtns[k].getAttribute('data-lang') === l) { d.langBtns[k].click(); return d.langBtns[k]; }
    }
    return null;
  }

  var bEn = klick('en');
  ok(!!bEn && bEn.classList.contains('active'), 'EN-Schalter wird aktiv');
  ok(s.sprache() === 'en', 'Oberflaeche steht auf EN');
  ok(d.docEl.getAttribute('lang') === 'en', 'Dokumentsprache auf EN gesetzt');
  ok(/Calculate/.test(d.byId.calcBtn.inhalt()), 'EN: "Calculate"');
  ok(/Clear/.test(d.byId.resetBtn.inhalt()), 'EN: "Clear"');
  ok(/Load example/.test(d.byId.presetLabel.inhalt()), 'EN: "Load example"');
  ok(/assistant/i.test(d.byId.assistBtn.inhalt()), 'EN: Assistentenknopf uebersetzt');
  ok(/Save/.test(d.byId.saveBtn.inhalt()), 'EN: "Save (.dts)"');
  ok(/Open/.test(d.byId.loadBtn.inhalt()), 'EN: "Open (.dts)"');
  ok(/Print/.test(d.byId.printBtn.inhalt()), 'EN: "Print / PDF"');
  ok(/Label/.test(d.byId.dtLabel.placeholder), 'EN: Platzhalter des Bezeichnungsfelds uebersetzt');
  ok(/structural/.test(d.byId.brandTag.inhalt()), 'EN: Untertitel der Marke uebersetzt');
  ok(/warranty/.test(d.byId.footNote.inhalt()), 'EN: Disclaimer uebersetzt');
  ok(/Light/.test(d.byId.themeBtn.getAttribute('title') || ''), 'EN: Titel des Theme-Knopfs uebersetzt');
  ok(/No result/.test(d.byId.resultIdle.inhalt()), 'EN: Leertext der Ergebniskarte uebersetzt');
  ok(/calculation path/.test(d.byId.pathIdle.inhalt()), 'EN: Leertext der Rechenwegkarte uebersetzt');
  for (i = 0; i < UI.BEREICHE.length; i++) {
    var cE = UI.BEREICHE[i], tE = d.byId['accTitel_' + cE].inhalt();
    ok(tE.indexOf('[') < 0 && tE !== bereichTexteDe[i],
       'EN: Bereichstitel uebersetzt: ' + cE + ' → ' + tE.replace(/\s+/g, ' ').substring(0, 40));
  }
  ok(/Basic setup/.test(d.byId.accTitel_grund.inhalt()), 'EN: "Basic setup"');
  ok(/Execution/.test(d.byId.accTitel_ausfuehrung.inhalt()), 'EN: "Execution and documentation"');
  ok(!/\[[a-zA-Z0-9_]+\]/.test(d.alleTexte()), 'EN: kein unuebersetzter Platzhalter auf der ganzen Seite');
  d.byId.saveBtn.click();
  ok(/module N11/.test(d.byId.dtMsg.inhalt()), 'EN: auch die ehrliche Geruestmeldung ist uebersetzt');
  d.byId.infoBtn.click();
  ok(/offline/i.test(d.byId.infoProdukt.inhalt()), 'EN: der Info-Dialog ist uebersetzt');
  d.byId.infoClose.click();

  var bPt = klick('pt');
  ok(!!bPt && bPt.classList.contains('active'), 'PT-Schalter wird aktiv');
  ok(!bEn.classList.contains('active'), 'EN-Schalter ist wieder inaktiv');
  ok(s.sprache() === 'pt', 'Oberflaeche steht auf PT');
  ok(d.docEl.getAttribute('lang') === 'pt', 'Dokumentsprache auf PT gesetzt');
  ok(/Calcular/.test(d.byId.calcBtn.inhalt()), 'PT: "Calcular"');
  ok(/Limpar/.test(d.byId.resetBtn.inhalt()), 'PT: "Limpar"');
  ok(/Carregar exemplo/.test(d.byId.presetLabel.inhalt()), 'PT: "Carregar exemplo"');
  ok(/assistente/i.test(d.byId.assistBtn.inhalt()), 'PT: Assistentenknopf uebersetzt');
  ok(/Guardar/.test(d.byId.saveBtn.inhalt()), 'PT: "Guardar (.dts)"');
  ok(/Abrir/.test(d.byId.loadBtn.inhalt()), 'PT: "Abrir (.dts)"');
  ok(/Imprimir/.test(d.byId.printBtn.inhalt()), 'PT: "Imprimir / PDF"');
  ok(/Designa/.test(d.byId.dtLabel.placeholder), 'PT: Platzhalter des Bezeichnungsfelds uebersetzt');
  ok(/metálica|metalica/.test(d.byId.brandTag.inhalt()), 'PT: Untertitel der Marke uebersetzt');
  ok(/garantia/.test(d.byId.footNote.inhalt()), 'PT: Disclaimer uebersetzt');
  ok(/Claro/.test(d.byId.themeBtn.getAttribute('title') || ''), 'PT: Titel des Theme-Knopfs uebersetzt');
  ok(/sem resultado/.test(d.byId.resultIdle.inhalt()), 'PT: Leertext der Ergebniskarte uebersetzt');
  ok(/memória de cálculo/i.test(d.byId.pathIdle.inhalt()), 'PT: Leertext der Rechenwegkarte uebersetzt');
  for (i = 0; i < UI.BEREICHE.length; i++) {
    var cP = UI.BEREICHE[i], tP = d.byId['accTitel_' + cP].inhalt();
    ok(tP.indexOf('[') < 0 && tP !== bereichTexteDe[i],
       'PT: Bereichstitel uebersetzt: ' + cP + ' → ' + tP.replace(/\s+/g, ' ').substring(0, 40));
  }
  ok(/Configura/.test(d.byId.accTitel_grund.inhalt()), 'PT: "Configuração básica"');
  ok(/Execu/.test(d.byId.accTitel_ausfuehrung.inhalt()), 'PT: "Execução e documentação"');
  ok(!/\[[a-zA-Z0-9_]+\]/.test(d.alleTexte()), 'PT: kein unuebersetzter Platzhalter auf der ganzen Seite');
  d.byId.resetBtn.click();
  ok(/limpos/i.test(d.byId.dtMsg.inhalt()), 'PT: auch die Leeren-Meldung ist uebersetzt');

  klick('de');
  ok(s.sprache() === 'de', 'Rueckschaltung auf DE funktioniert');
  ok(/Berechnen/.test(d.byId.calcBtn.inhalt()), 'DE: die Knoepfe stehen wieder auf Deutsch');
  ok(/Grundeinstellung/.test(d.byId.accTitel_grund.inhalt()), 'DE: die Bereichstitel stehen wieder auf Deutsch');

  /* -------------------------- 12) Sprachwechsel laesst den Zustand heil -- */
  s.schalte('lasten', true);
  klick('en'); klick('pt'); klick('de');
  ok(s.istOffen('lasten') === true, 'ein offener Bereich bleibt beim Sprachwechsel offen');
  ok(s.theme() === 'dark', 'das Theme ueberlebt den Sprachwechsel');
  ok(d.byId.accHint_lasten.inhalt().indexOf('[') < 0, 'die Erklaerung bleibt nach drei Sprachwechseln uebersetzt');

  /* --------------------------------- 13) i18n-Paritaet der UI-Schluessel - */
  var uiKeys = [];
  var kRe = /data-i18n(?:-title|-ph)?="([a-zA-Z0-9_]+)"/g, km;
  while ((km = kRe.exec(html)) !== null) if (uiKeys.indexOf(km[1]) < 0) uiKeys.push(km[1]);
  ok(uiKeys.length >= 25, 'die HTML verwendet ' + uiKeys.length + ' i18n-Schluessel');
  var fehlt = 0;
  for (i = 0; i < uiKeys.length; i++) {
    if (!Kern.has(uiKeys[i])) { fehlt++; console.log('    fehlt im Woerterbuch: ' + uiKeys[i]); }
  }
  ok(fehlt === 0, 'jeder i18n-Schluessel der HTML steht im Woerterbuch');

  return { N: N, FAIL: FAIL };
}

module.exports = { lauf: lauf };

if (require.main === module) {
  var r = lauf('full');
  console.log('\n  Smoke Vollversion: ' + r.N + ' Prüfungen · ' + r.FAIL.length + ' Fehler');
  process.exit(r.FAIL.length ? 1 : 0);
}
