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
  set: function (v) {
    /* Kinder wirklich wegnehmen — sonst faende querySelectorAll spaeter
       Elemente, die es in der Oberflaeche gar nicht mehr gibt. */
    for (var k = this.children.length - 1; k >= 0; k--) this.children[k]._entferne();
    this.children = [];
    this._html = String(v); this._text = '';
  }
});

/* --- Baum: erzeugte Elemente muessen im Bestand ankommen (N5b) ------------
   ui.js baut das Formular selbst. Ein angehaengtes Element wird deshalb im
   selben Bestand registriert wie die aus der HTML gelesenen — sonst waere es
   ueber getElementById/querySelectorAll nicht auffindbar und der Smoke wuerde
   eine Oberflaeche pruefen, die es so nicht gibt. */
Element.prototype.appendChild = function (kind) {
  if (!kind) return kind;
  this.children.push(kind);
  kind.parentNode = this;
  if (this._reg) kind._registriere(this._reg);
  return kind;
};
Element.prototype._registriere = function (reg) {
  this._reg = reg;
  reg.elemente.push(this);
  var i = this.getAttribute('id');
  if (i && !reg.byId[i]) reg.byId[i] = this;
  for (var k = 0; k < this.children.length; k++) this.children[k]._registriere(reg);
};
Element.prototype._entferne = function () {
  var reg = this._reg, i;
  if (reg) {
    var p = reg.elemente.indexOf(this);
    if (p >= 0) reg.elemente.splice(p, 1);
    i = this.getAttribute('id');
    if (i && reg.byId[i] === this) delete reg.byId[i];
  }
  for (var k = 0; k < this.children.length; k++) this.children[k]._entferne();
  this._reg = null;
};
Element.prototype.removeAttribute = function (n) {
  delete this.attributes[n];
  if (n === 'class') this.className = '';
};
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
  var reg = { byId: byId, elemente: elemente };
  var tagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, m;

  while ((m = tagRe.exec(html)) !== null) {
    var tag = m[1].toLowerCase(), roh = m[2] || '';
    if (tag === 'script' || tag === 'meta' || tag === 'link' || tag === 'br') continue;
    var e = new Element(tag);
    var aRe = /([a-zA-Z][-a-zA-Z0-9_:]*)\s*=\s*"([^"]*)"/g, am;
    while ((am = aRe.exec(roh)) !== null) e.setAttribute(am[1].toLowerCase(), am[2]);
    if (/(^|\s)hidden(\s|$|=)/.test(roh)) e.hidden = true;
    if (e.attributes.value) e.value = e.attributes.value;
    e._reg = reg;
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

  /* Bild der frisch geoeffneten Seite: Sichtbarkeit jeder Auswahlzeile und
     jeder Feldzeile. "Leeren" muss spaeter GENAU hierhin zurueckfuehren. */
  function sichtbarkeitsBild() {
    var bild = [], q, c;
    var mods = require('./optionen.js'), vals = require('./validate.js');
    for (q = 0; q < mods.GRUPPEN.length; q++) {
      c = d.byId['row_g_' + mods.GRUPPEN[q].code];
      if (c) bild.push('g:' + mods.GRUPPEN[q].code + '=' + (c.hidden ? 'zu' : 'auf'));
    }
    for (q = 0; q < vals.SCHEMA.length; q++) {
      c = d.byId['row_f_' + vals.SCHEMA[q].code];
      if (c) bild.push('f:' + vals.SCHEMA[q].code + '=' + (c.hidden ? 'zu' : 'auf'));
    }
    return bild.join(' ');
  }
  var startBild = sichtbarkeitsBild();
  ok(startBild.length > 100, 'Startbild der Eingabeseite aufgenommen');
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

  /* =================================================== 6b) N5b: Eingabeseite
     Das Formular wird von ui.js aus optionen.js/validate.js ERZEUGT. Hier wird
     geprueft, dass es wirklich da ist, wirklich anklickbar ist und dass DIE
     eine Filterfunktion greift (Plan 3.4). ------------------------------- */
  var Opt = win.DTNOptions, Val = win.DTNValidate;

  ok(s.gebaut() === true, 'N5b: das Formular ist beim Start gebaut');

  /* Jede Gruppe und jedes Feld steht GENAU EINMAL in der Zuordnung. */
  var zugeordnetG = {}, zugeordnetF = {}, doppeltG = 0, doppeltF = 0, unbekannt = 0;
  for (i = 0; i < UI.ZUORDNUNG.length; i++) {
    var bz = UI.ZUORDNUNG[i], q;
    for (q = 0; q < bz.gruppen.length; q++) {
      if (zugeordnetG[bz.gruppen[q]]) doppeltG++;
      zugeordnetG[bz.gruppen[q]] = bz.code;
      if (!Opt.gruppe(bz.gruppen[q])) unbekannt++;
    }
    for (q = 0; q < bz.felder.length; q++) {
      if (zugeordnetF[bz.felder[q]]) doppeltF++;
      zugeordnetF[bz.felder[q]] = bz.code;
      if (!Val.feld(bz.felder[q])) unbekannt++;
    }
  }
  ok(doppeltG === 0 && doppeltF === 0, 'N5b: keine Gruppe und kein Feld ist zweimal zugeordnet');
  ok(unbekannt === 0, 'N5b: kein unbekannter Code in der Zuordnung');
  ok(Object.keys(zugeordnetG).length === Opt.GRUPPEN.length,
     'N5b: ALLE ' + Opt.GRUPPEN.length + ' Auswahlgruppen sind zugeordnet (ist ' +
     Object.keys(zugeordnetG).length + ')');
  ok(Object.keys(zugeordnetF).length === Val.SCHEMA.length,
     'N5b: ALLE ' + Val.SCHEMA.length + ' Felder sind zugeordnet (ist ' +
     Object.keys(zugeordnetF).length + ')');

  /* Jede in dieser Etappe gebaute Gruppe steht wirklich im DOM — mit Id. */
  var gebauteGruppen = 0;
  for (i = 0; i < UI.ZUORDNUNG.length; i++) {
    var bb = UI.ZUORDNUNG[i];
    if (bb.etappe) continue;
    for (var gq = 0; gq < bb.gruppen.length; gq++) {
      var gc = bb.gruppen[gq];
      ok(!!d.byId['row_g_' + gc] && !!d.byId['sel_' + gc] && !!d.byId['lbl_g_' + gc] &&
         !!d.byId['info_g_' + gc],
         'N5b: Auswahlgruppe vollstaendig erzeugt und anklickbar: ' + gc);
      gebauteGruppen++;
    }
  }
  ok(gebauteGruppen === 18, 'N5b: 18 Gruppen gebaut, ISO 5817 und EXC bleiben N5d (ist ' +
     gebauteGruppen + ')');
  ok(!d.byId['sel_iso5817'] && !d.byId['sel_exc'],
     'N5b: der Block Ausfuehrung ist NICHT vorweggenommen — er folgt in N5d');
  ok(/N5d/.test(d.byId.host_ausfuehrung.children.length ? d.alleTexte() : ''),
     'N5b: der Bereich Ausfuehrung sagt ehrlich, dass er in N5d kommt');

  for (i = 0; i < Val.SCHEMA.length; i++) {
    var fc = Val.SCHEMA[i].code;
    ok(!!d.byId['row_f_' + fc] && !!d.byId['fld_' + fc] && !!d.byId['lbl_f_' + fc] &&
       !!d.byId['info_f_' + fc],
       'N5b: Feld vollstaendig erzeugt und anklickbar: ' + fc);
  }

  /* Laien-ⓘ an JEDEM Feld und JEDER Gruppe (Plan, stehende Regel). */
  var ohneHilfe = [];
  for (i = 0; i < Opt.GRUPPEN.length; i++) {
    if (!win.DTNI18nHilfe.has('grp_' + Opt.GRUPPEN[i].code)) ohneHilfe.push(Opt.GRUPPEN[i].code);
  }
  for (i = 0; i < Val.SCHEMA.length; i++) {
    if (!win.DTNI18nHilfe.has('fld_' + Val.SCHEMA[i].code)) ohneHilfe.push(Val.SCHEMA[i].code);
  }
  ok(ohneHilfe.length === 0, 'N5b: Laien-ⓘ an jeder Gruppe und jedem Feld (ohne: ' +
     (ohneHilfe.join(',') || 'keine') + ')');

  /* Der ⓘ-Knopf oeffnet wirklich den Dialog und traegt wirklich Text. */
  ok(d.byId.hilfeModal.hidden === true, 'N5b: die Laien-Hilfe ist beim Start zu');
  d.byId.info_f_a.click();
  ok(d.byId.hilfeModal.hidden === false, 'N5b: der ⓘ-Knopf oeffnet die Laien-Hilfe');
  ok(d.byId.hilfeWas.inhalt().length > 30, 'N5b: die Laien-Hilfe erklaert "Was ist das"');
  ok(d.byId.hilfeTipp.inhalt().length > 10, 'N5b: die Laien-Hilfe gibt eine Empfehlung');
  ok(d.byId.hilfeTitel.inhalt().indexOf('[') < 0, 'N5b: die Laien-Hilfe traegt eine echte Ueberschrift');
  d.byId.hilfeClose.click();
  ok(d.byId.hilfeModal.hidden === true, 'N5b: die Laien-Hilfe laesst sich schliessen');

  /* "eigener Wert": vorbelegt und gesperrt, per Haken frei (Plan 3.1). */
  var ueber = [];
  for (i = 0; i < Val.SCHEMA.length; i++) if (Val.SCHEMA[i].ueberschreibbar) ueber.push(Val.SCHEMA[i]);
  ok(ueber.length > 0, 'N5b: es gibt ueberschreibbare Tabellenwerte (ist ' + ueber.length + ')');
  for (i = 0; i < ueber.length; i++) {
    ok(!!d.byId['ev_' + ueber[i].code], 'N5b: "eigener Wert"-Haken vorhanden: ' + ueber[i].code);
    ok(d.byId['fld_' + ueber[i].code].getAttribute('readonly') !== null,
       'N5b: Tabellenwert ist ohne Haken gesperrt: ' + ueber[i].code);
  }
  ok(d.byId.fld_gammaM2.value === '1.25', 'N5b: der Tabellenwert ist vorbelegt (gammaM2 = 1.25)');
  d.byId.ev_gammaM2.checked = true;
  d.byId.ev_gammaM2.change();
  ok(d.byId.fld_gammaM2.getAttribute('readonly') === null,
     'N5b: der Haken gibt das Feld wirklich frei');
  d.byId.fld_gammaM2.value = '1.30';
  d.byId.ev_gammaM2.checked = false;
  d.byId.ev_gammaM2.change();
  ok(d.byId.fld_gammaM2.value === '1.25',
     'N5b: Haken weg → der Tabellenwert steht wieder da, nicht der eigene');

  /* DIE Filterfunktion: eine Auswahl blendet Unsinn sofort aus (Plan 3.4). */
  function optCodes(gruppe) {
    var sel = d.byId['sel_' + gruppe], r = [];
    for (var q = 0; q < sel.children.length; q++) {
      var v = sel.children[q].getAttribute('value');
      if (v) r.push(v);
    }
    return r;
  }
  function waehle(gruppe, wert) {
    var sel = d.byId['sel_' + gruppe];
    sel.value = wert; sel.change();
  }

  ok(optCodes('welt').length === 2, 'N5b: die Bemessungswelt bietet beide Welten an');
  waehle('welt', 'A');
  ok(optCodes('werkstoffgruppe').indexOf('alu') >= 0,
     'N5b: in Welt A ist Aluminium waehlbar');
  waehle('welt', 'B');
  ok(optCodes('werkstoffgruppe').indexOf('alu') < 0,
     'N5b: in Welt B verschwindet Aluminium (es gibt dort keine belegten Tabellenwerte)');
  ok(d.byId.row_g_lastfall.hidden === false,
     'N5b: der Lastfall erscheint erst in Welt B (er gehoert dorthin, Plan 2.8)');
  waehle('welt', 'A');
  ok(d.byId.row_g_lastfall.hidden === true, 'N5b: in Welt A ist der Lastfall wieder weg');

  /* Strenge Bereinigungsregel: eine nicht mehr begruendbare Auswahl faellt weg. */
  waehle('werkstoffgruppe', 'alu');
  waehle('werkstoff', 'AW5083');
  ok(d.byId.sel_werkstoff.value === 'AW5083', 'N5b: der Aluminiumwerkstoff ist gesetzt');
  waehle('welt', 'B');
  ok(d.byId.sel_werkstoffgruppe.value === '' && d.byId.sel_werkstoff.value === '',
     'N5b: Wechsel auf Welt B raeumt die Alu-Auswahl weg statt sie still stehenzulassen');

  /* Keine Sackgasse: in jeder sichtbaren Gruppe bleibt etwas waehlbar. */
  var sackgasse = [];
  for (i = 0; i < Opt.GRUPPEN.length; i++) {
    var sg = Opt.GRUPPEN[i].code;
    if (!d.byId['row_g_' + sg] || d.byId['row_g_' + sg].hidden) continue;
    if (optCodes(sg).length === 0) sackgasse.push(sg);
  }
  ok(sackgasse.length === 0, 'N5b: keine sichtbare Gruppe ist eine Sackgasse (' +
     (sackgasse.join(',') || 'keine') + ')');

  /* Verwandte Regel aus N2b: umlaufende Kehlnaht laesst nur "rundum" uebrig. */
  waehle('welt', 'A');
  waehle('nahtart', 'kehl_umlaufend');
  ok(optCodes('kanten').length === 1 && optCodes('kanten')[0] === 'rundum',
     'N5b: bei umlaufender Kehlnaht bleibt bei den Kanten nur "rundum"');

  /* Pflichtstern folgt dem Zustand, nicht der Vermutung. */
  waehle('rechenrichtung', 'auslegung');
  ok(d.byId.pf_f_a.hidden === true, 'N5b: bei der Auslegung ist das a-Mass keine Pflicht (es wird gesucht)');
  waehle('rechenrichtung', 'nachweis');
  ok(d.byId.pf_f_a.hidden === false, 'N5b: beim Nachweis ist das a-Mass Pflicht');

  /* Zusatzbereiche: Haken aus, Inhalt folgt ehrlich benannt (Plan 2.6). */
  for (i = 0; i < UI.ZUSATZ.length; i++) {
    var zc = UI.ZUSATZ[i].code;
    ok(!!d.byId['zus_' + zc], 'N5b: Freischalt-Haken vorhanden: ' + zc);
    ok(d.byId['zus_' + zc].checked === false, 'N5b: Zusatzbereich startet AUS: ' + zc);
    ok(d.byId['zusn_' + zc].hidden === true, 'N5b: sein Hinweis ist zunaechst verborgen: ' + zc);
  }
  d.byId.zus_ermuedung.checked = true;
  d.byId.zus_ermuedung.change();
  ok(d.byId.zusn_ermuedung.hidden === false,
     'N5b: der Haken schaltet den Zusatzbereich sichtbar frei');
  ok(s.zustand().ermuedung_aktiv === true,
     'N5b: der Haken kommt im Zustand an (validate.js liest ihn als ermuedung_aktiv)');
  d.byId.zus_ermuedung.checked = false;
  d.byId.zus_ermuedung.change();

  /* Ein vollstaendiger Fall laesst sich wirklich eingeben — das ist das
     Abnahmekriterium dieser Etappe. */
  var fall = { welt: 'A', rechenrichtung: 'nachweis', werkstoffgruppe: 'stahl',
               werkstoff: 'S235', stossart: 'ueberlappstoss', nahtart: 'kehl_doppel',
               nachweisverfahren: 'richtungsbezogen', profil: 'blech',
               kanten: 'flanken', lasteingabe: 'direkt' };
  for (var fk in fall) if (Object.prototype.hasOwnProperty.call(fall, fk)) waehle(fk, fall[fk]);
  var zst = s.zustand();
  var fehlendA = Opt.pruefe(zst);
  ok(fehlendA.ok === true, 'N5b: der Auswahlweg ist vollstaendig begehbar (fehlend: ' +
     (fehlendA.fehlend.join(',') || 'nichts') + ')');

  var eingaben = { l: '200', t1: '10', t2: '10', b: '80', a: '5', N: '150000', Q: '0' };
  for (var ek in eingaben) {
    if (!Object.prototype.hasOwnProperty.call(eingaben, ek)) continue;
    ok(d.byId['row_f_' + ek].hidden === false, 'N5b: das noetige Feld wird auch gezeigt: ' + ek);
    d.byId['fld_' + ek].value = eingaben[ek];
  }
  var pr = s.pruefen();
  ok(pr && pr.ok === true, 'N5b: der vollstaendige Fall wird als in Ordnung gemeldet' +
     (pr && pr.fehler.length ? ' — offen: ' + JSON.stringify(pr.fehler) : ''));
  ok(/N5c/.test(d.byId.pruefListe.inhalt() + d.alleTexte()),
     'N5b: und sagt ehrlich, dass das Rechnen in N5c folgt');

  /* Umgekehrt: ein unsinniger Wert wird ehrlich gemeldet, nicht still gerechnet. */
  d.byId.fld_t1.value = '0.1';
  pr = s.pruefen();
  ok(pr && pr.ok === false, 'N5b: eine unmoegliche Blechdicke wird nicht durchgewunken');
  ok(d.byId.row_f_t1.classList.contains('fehlerhaft'),
     'N5b: das betroffene Feld wird sichtbar markiert');
  d.byId.fld_t1.value = '10';

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

  /* N5b: "Leeren leert wirklich ALLES" (Plan 3.1) — geprueft wird nicht nur
     das Bezeichnungsfeld, sondern jedes erzeugte Feld, jede Auswahl und jeder
     Haken. Ergebnis muss exakt der Zustand der frisch geoeffneten Seite sein. */
  var restAuswahl = [], restFeld = [], restHaken = [];
  for (i = 0; i < Opt.GRUPPEN.length; i++) {
    var rg = d.byId['sel_' + Opt.GRUPPEN[i].code];
    if (rg && rg.value !== '') restAuswahl.push(Opt.GRUPPEN[i].code);
  }
  for (i = 0; i < Val.SCHEMA.length; i++) {
    var rf = Val.SCHEMA[i], re = d.byId['fld_' + rf.code];
    if (!re) continue;
    var soll = (rf.ueberschreibbar && typeof rf.standard !== 'undefined') ? String(rf.standard) : '';
    if (re.value !== soll) restFeld.push(rf.code + '="' + re.value + '"');
    var rev = d.byId['ev_' + rf.code];
    if (rev && rev.checked) restHaken.push(rf.code);
  }
  for (i = 0; i < UI.ZUSATZ.length; i++) {
    if (d.byId['zus_' + UI.ZUSATZ[i].code].checked) restHaken.push(UI.ZUSATZ[i].code);
  }
  ok(restAuswahl.length === 0, 'Leeren: keine Auswahl bleibt stehen (' +
     (restAuswahl.join(',') || 'keine') + ')');
  ok(restFeld.length === 0, 'Leeren: kein Feld bleibt stehen, Tabellenwerte stehen wieder da (' +
     (restFeld.join(',') || 'keins') + ')');
  ok(restHaken.length === 0, 'Leeren: kein Haken bleibt gesetzt (' +
     (restHaken.join(',') || 'keiner') + ')');
  ok(d.byId.pruefBox.hidden === true, 'Leeren: der Pruefkasten von vorher ist weg');
  ok(sichtbarkeitsBild() === startBild,
     'Leeren: die Oberflaeche steht wieder GENAU wie beim Oeffnen der Seite');
  ok(Object.keys(s.zustand()).length === 0, 'Leeren: der Zustand ist wirklich leer');
  ok(Object.keys(s.werte()).length === 4,
     'Leeren: nur die vier vorbelegten Tabellenwerte stehen im Formular (ist ' +
     Object.keys(s.werte()).length + ')');

  /* ------------------------------- 8) Knoepfe, die noch nicht rechnen ---- */
  /* "Berechnen" ist ab N5b verdrahtet: es PRUEFT (gerechnet wird in N5c). */
  d.byId.calcBtn.click();
  ok(d.byId.pruefBox.hidden === false, '"Berechnen" oeffnet den Pruefkasten');
  ok(d.byId.pruefListe.children.length > 0, '"Berechnen" sagt am leeren Formular, was fehlt');
  ok(/N5c/.test(d.alleTexte()),
     '"Berechnen" sagt ehrlich, dass das RECHNEN erst in N5c folgt');
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
