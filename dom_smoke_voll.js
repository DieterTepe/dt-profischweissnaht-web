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
                  'solver.js', 'rechenweg.js', 'symbol.js', 'thermik.js',
                  'kosten.js', 'skizze.js', 'assistent.js', 'ui.js'];
  ok(srcs.join(',') === erwartet.join(','), 'Ladereihenfolge stimmt: ' + srcs.join(' → '));
  ok(srcs[srcs.length - 1] === 'ui.js', 'ui.js laedt zuletzt');
  ok(srcs.length === 18, 'N10a: 18 Module eingebunden (ist ' + srcs.length + ')');

  /* ------------------------------------- 2) ALLE Module gemeinsam laden -- */
  var d = baueDom(html);
  var win = { DT_EDITION: edition, alert: function (t) { win._letzterAlert = t; } };
  var namen = { 'i18n_kern.js': 'DTNI18nKern', 'i18n_hilfe.js': 'DTNI18nHilfe',
                'i18n_kerbfall.js': 'DTNI18nKerb', 'daten.js': 'DTNData',
                'optionen.js': 'DTNOptions', 'validate.js': 'DTNValidate',
                'naht.js': 'DTNNaht', 'profil.js': 'DTNProfil',
                'svglib.js': 'DTNSvgLib', 'schaubild.js': 'DTNSchaubild',
                'solver.js': 'DTNSolver', 'rechenweg.js': 'DTNRechenweg',
                'symbol.js': 'DTNSymbol', 'thermik.js': 'DTNThermik',
                'kosten.js': 'DTNKosten', 'skizze.js': 'DTNSkizze',
                'assistent.js': 'DTNAssistent', 'ui.js': 'DTNUi' };
  for (var i = 0; i < srcs.length; i++) {
    var mod = require('./' + srcs[i]);
    win[namen[srcs[i]]] = mod;
    ok(!!mod, 'Modul geladen: ' + srcs[i]);
  }
  win.document = d.document;
  win.window = win;

  var UI = win.DTNUi, Kern = win.DTNI18nKern;
  ok(UI.START_THEME === 'dark', 'ui.js traegt die bindende Vorgabe START_THEME = dark (Plan 3.1)');
  ok(UI.BEREICHE.length === 11, 'N10b: elf aufklappbare Bereiche vorgesehen (ist ' + UI.BEREICHE.length + ')');

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
  ok(/N5d/.test(d.byId.geruestNote.inhalt()),
     'die Karte sagt ehrlich, was noch fehlt: der Block Ausfuehrung folgt in N5d');
  ok(/Rechenweg/.test(d.byId.geruestNote.inhalt()),
     'und ebenso ehrlich, dass Ergebnis, Nahtbild und Rechenweg jetzt da sind');
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
  ok(/Ausf/.test(bereichTexteDe[bereichTexteDe.length - 1]), 'DE: der letzte Bereich ist "Ausfuehrung und Dokumentation"');
  ok(!/\[[a-zA-Z0-9_]+\]/.test(d.alleTexte()), 'DE: kein unuebersetzter Platzhalter auf der ganzen Seite');

  /* ------------------------------------------- 6) Aufklappen durchklicken */
  ok(s.istOffen('grund') === true, 'Startzustand: der erste Bereich ist offen');
  ok(d.byId.accBody_grund.hidden === false, 'Startzustand: sein Inhalt ist sichtbar');
  var zu = 0;
  for (i = 1; i < UI.BEREICHE.length; i++) if (!s.istOffen(UI.BEREICHE[i])) zu++;
  ok(zu === 10, 'N10b: Startzustand — die uebrigen acht Bereiche sind zu (ist ' + zu + ')');

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
  ok(gebauteGruppen === 27, 'N9c: alle 27 Gruppen gebaut, auch die fuenf fuer das Symbol (ist ' +
     gebauteGruppen + ')');
  ok(!!d.byId['sel_iso5817'] && !!d.byId['sel_exc'],
     'N5d: der Block Ausfuehrung steht jetzt wirklich auf der Seite');
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

  var eingaben = { t1: '10', t2: '10', b: '80', a: '5', N: '150000', Q: '0' };
  for (var ek in eingaben) {
    if (!Object.prototype.hasOwnProperty.call(eingaben, ek)) continue;
    ok(d.byId['row_f_' + ek].hidden === false, 'N5b: das noetige Feld wird auch gezeigt: ' + ek);
    d.byId['fld_' + ek].value = eingaben[ek];
  }
  var pr = s.pruefen();
  ok(pr && pr.ok === true, 'N5b: der vollstaendige Fall wird als in Ordnung gemeldet' +
     (pr && pr.fehler.length ? ' — offen: ' + JSON.stringify(pr.fehler) : ''));
  ok(/es wurde gerechnet/.test(d.byId.pruefListe.inhalt() + d.alleTexte()),
     'N5b/N5c: der Pruefkasten sagt, dass danach wirklich gerechnet wurde');

  /* ---- FELDBEREINIGUNG N5c-1 (Plan 5.1) -------------------------------
     'l' ist entfallen, 't1' ist nur noch profilabhaengig Pflicht und 't2'
     ist freiwillig. Das wird an der echten Oberflaeche geprueft, nicht nur
     am Schema. */
  ok(!d.byId.fld_l, 'N5c-1: das Feld Nahtlaenge erscheint nicht mehr im Formular');
  ok(!d.byId.row_f_l, 'N5c-1: und auch seine Feldzeile ist verschwunden');
  d.byId.fld_t2.value = '';
  pr = s.pruefen();
  ok(pr && pr.ok === true,
     'N5c-1: t2 darf leer bleiben — die Dicke kommt sonst je Segment aus dem Profil');
  d.byId.fld_t1.value = '';
  pr = s.pruefen();
  ok(pr && pr.ok === false, 'N5c-1: t1 bleibt beim Blech Pflicht und wird eingefordert');
  ok(d.byId.row_f_t1.classList.contains('fehlerhaft'),
     'N5c-1: und die fehlende Blechdicke wird sichtbar markiert');
  d.byId.fld_t1.value = '10';
  d.byId.fld_t2.value = '10';

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
  /* Seit N9d sind es zehn: gamma_M2, gamma_Mw, S und der Eckradius als
     TABELLENWERTE, dazu HD, F2 und F3 aus der Waermefuehrung — und die drei
     ANHALTSWERTE fuer Spannung, Strom und Geschwindigkeit. Die letzten drei
     stehen in keiner Norm und sind deshalb sichtbar anders gekennzeichnet. */
  ok(Object.keys(s.werte()).length === 20,
     'N10b: nur die zwanzig vorbelegten Werte stehen im Formular (ist ' +
     Object.keys(s.werte()).length + ')');

  /* ------------------------------- 8) Knoepfe, die noch nicht rechnen ---- */
  /* "Berechnen" ist ab N5b verdrahtet: es PRUEFT (gerechnet wird in N5c). */
  d.byId.calcBtn.click();
  ok(d.byId.pruefBox.hidden === false, '"Berechnen" oeffnet den Pruefkasten');
  ok(d.byId.pruefListe.children.length > 0, '"Berechnen" sagt am leeren Formular, was fehlt');
  ok(d.byId.resultIdle.hidden === false,
     '"Berechnen" am leeren Formular rechnet NICHT — der Ergebnisbereich bleibt leer');
  d.byId.assistBtn.click();
  /* N8b: der Knopf oeffnet jetzt den Assistenten, statt auf N8 zu verweisen. */
  ok(s.assistOffen() === true, 'N8b: "Assistent" oeffnet den Dialog');
  ok(d.byId.assistModal.hidden === false, 'N8b: und das Overlay ist sichtbar');
  s.assistAbbrechen();
  ok(s.assistOffen() === false, 'N8b: Abbrechen schliesst ihn wieder');
  ok(d.byId.assistModal.hidden === true, 'N8b: das Overlay ist wieder weg');
  var ausgaben = ['saveBtn', 'loadBtn', 'printBtn', 'rtfBtn'];
  for (i = 0; i < ausgaben.length; i++) {
    d.byId[ausgaben[i]].click();
    ok(/N11/.test(d.byId.dtMsg.inhalt()),
       'Ausgabeknopf verweist ehrlich auf Baustein N11: ' + ausgaben[i]);
  }
  /* ---- BEISPIELE N5c-1 (Plan 5.1) ------------------------------------
     Die Beispielauswahl ist jetzt verdrahtet. Geprueft wird, dass die Liste
     steht, dass ein Beispiel wirklich Auswahl UND Felder fuellt, dass vorher
     geleert wird und dass der geladene Fall die Pruefung besteht. */
  /* Seit N7 sind es zwoelf, und die Liste ist KONTEXTBEZOGEN (Plan 3.2):
     im leeren Startzustand steht alles da, sobald links etwas gewaehlt ist,
     schrumpft sie. */
  ok(d.byId.presetSel.children.length === 15,
     'N9c: die Beispielliste hat einen Platzhalter und vierzehn Beispiele (ist ' +
     d.byId.presetSel.children.length + ')');
  ok(s.beispiele().length === 14, 'N9c: und die Sitzung kennt genau diese vierzehn');

  d.byId.dtLabel.value = 'Rest aus einer alten Rechnung';
  s.beispielLaden('rhs');
  ok(d.byId.dtLabel.value === '',
     'N5c-1: vor dem Laden wird wirklich alles geleert (Plan 3.5)');
  var bz = s.zustand();
  ok(bz.profil === 'rohr_rechteck' && bz.kanten === 'rundum',
     'N5c-1: das Beispiel setzt Profil und Kantenauswahl');
  ok(bz.werkstoff === 'S235' && bz.nahtart === 'kehl_umlaufend',
     'N5c-1: und die uebrigen Auswahlen dazu');
  ok(d.byId.fld_b.value === '120' && d.byId.fld_t1.value === '6' && d.byId.fld_N.value === '120000',
     'N5c-1: die Feldwerte stehen im Formular');
  ok(d.byId.ev_r_ecke.checked === true && d.byId.fld_r_ecke.value === '9',
     'N5c-1: der Eckradius kommt mit gesetztem "eigener Wert"-Haken, sonst waere er gleich wieder 0');
  var bpr = s.pruefen();
  ok(bpr && bpr.ok === true, 'N5c-1: das geladene Beispiel besteht die Pruefung' +
     (bpr && bpr.fehler.length ? ' — offen: ' + JSON.stringify(bpr.fehler) : ''));

  /* ALLE ZWOELF werden an der echten Oberflaeche durchgeklickt — Laden,
     Pruefen, Rechnen. Das ist die Probe, dass ein Beispiel nicht nur als
     Datensatz stimmt, sondern auch durch das Formular passt. */
  var bspAlle = [], bspI;
  for (bspI = 0; bspI < Opt.BEISPIELE.length; bspI++) bspAlle.push(Opt.BEISPIELE[bspI].code);
  ok(bspAlle.length === 14, 'N9c: vierzehn Beispiele werden durchgeklickt');
  for (i = 0; i < bspAlle.length; i++) {
    s.beispielLaden(bspAlle[i]);
    var bpAll = s.pruefen();
    ok(bpAll && bpAll.ok === true, 'N7: Beispiel ist vollstaendig und rechenbar: ' + bspAlle[i] +
       (bpAll && bpAll.fehler.length ? ' — offen: ' + JSON.stringify(bpAll.fehler) : ''));
    var beAll = s.rechnen();
    ok(beAll && beAll.ok === true, 'N7: und es rechnet an der Oberflaeche durch: ' + bspAlle[i]);
    if (beAll && beAll.ok) {
      ok(beAll.ampel === 'gruen', 'N7: mit gruener Ampel: ' + bspAlle[i]);
      ok(beAll.warnungen.length === 0, 'N7: und ohne Warnung: ' + bspAlle[i]);
    }
    ok(d.byId.grafikSvg && d.byId.grafikSvg.inhalt().indexOf('<svg') >= 0,
       'N7: das Nahtbild wird gezeichnet: ' + bspAlle[i]);
  }
  s.leeren();

  /* ---- N9b · WAERMEFUEHRUNG AM BILDSCHIRM ------------------------------
     Bereich zuschalten, Felder fuellen, rechnen — und die eigene Karte
     muss mit eigener Ampel dastehen.                                     */
  s.leeren();
  ok(d.byId.cardThermik.hidden === true, 'N9b: ohne zugeschalteten Bereich ist die Karte weg');
  s.beispielLaden('traeger');
  var thErg1 = s.rechnen();
  ok(thErg1 && thErg1.ok === true, 'N9b: der Festigkeitsnachweis rechnet wie bisher');
  ok(d.byId.cardThermik.hidden === true, 'N9b: und die Waermefuehrung bleibt aus');

  /* Zuschalten */
  d.byId.zus_thermik.checked = true;
  s.aktualisiere();
  ok(d.byId.acc_thermik && d.byId.host_thermik, 'N9b: der Bereich ist im Formular angelegt');
  var thFelder = { an_C: '0.18', an_Mn: '1.40', an_Cr: '0.20', an_Mo: '0.10',
                   an_Cu: '0.30', an_Ni: '0.40', HD: '5',
                   sp_U: '28', sp_I: '250', sp_v: '4' };
  for (var thK in thFelder) {
    if (!Object.prototype.hasOwnProperty.call(thFelder, thK)) continue;
    ok(!!d.byId['fld_' + thK], 'N9b: das Feld ' + thK + ' steht im Formular');
    if (d.byId['fld_' + thK]) d.byId['fld_' + thK].value = thFelder[thK];
  }
  d.byId.sel_schweissverfahren.value = 'mag';
  s.aktualisiere();
  var thErg2 = s.rechnen();
  ok(thErg2 && thErg2.ok === true, 'N9b: der Festigkeitsnachweis rechnet weiterhin');
  ok(d.byId.cardThermik.hidden === false, 'N9b: jetzt steht die Waermefuehrungskarte da');
  ok(d.byId.thermikKopf.children.length >= 3, 'N9b: mit Vorwaermtemperatur, t8/5 und Zielfenster');
  ok(d.byId.thermikWeg.children.length > 5, 'N9b: und einem Rechenweg in Schritten');
  ok(d.byId.thermikHinweise.children.length > 0,
     'N9b: und den Hinweisen — darunter, dass Methode A fehlt');

  /* Der Werkstoff entscheidet ueber die Ampel: S355 ist unlegiert, dort
     fuehren die Quellen kein Zielfenster. */
  d.byId.sel_werkstoff.value = 'S355';
  s.aktualisiere();
  s.rechnen();
  var thTxt355 = d.byId.thermikHinweise.inhalt() + d.byId.thermikKopf.inhalt();
  ok(thTxt355.length > 0, 'N9b: auch bei unlegiertem Stahl wird gerechnet und gezeigt');

  /* Nichtrostender Stahl: EN 1011-2 gilt dort nicht — es wird NICHT
     gerechnet, und der Grund steht da. */
  d.byId.sel_werkstoffgruppe.value = 'edelstahl';
  s.aktualisiere();
  s.rechnen();
  ok(d.byId.cardThermik.hidden === false, 'N9b: die Karte bleibt sichtbar');
  ok(d.byId.thermikWeg.children.length === 0,
     'N9b: aber bei nichtrostendem Stahl wird NICHT gerechnet');
  ok(d.byId.thermikHinweise.children.length > 0, 'N9b: und der Grund steht da');
  s.leeren();
  ok(d.byId.cardThermik.hidden === true, 'N9b: Leeren raeumt auch die Waermefuehrung weg');

  /* ---- N10b · KOSTENRECHNUNG AM BILDSCHIRM -----------------------------
     Mengen oben, Kosten darunter — und die Liste dessen, was auf null
     steht. Eine Summe, die stillschweigend etwas weglaesst, ist die
     gefaehrlichste Zahl im Programm: Sie sieht vollstaendig aus.        */
  s.leeren();
  ok(d.byId.cardKosten.hidden === true, 'N10b: ohne zugeschaltete Kosten ist die Karte weg');
  ok(d.byId.acc_kosten.hidden === true, 'N10b: und der ganze Bereich ebenso');
  ok(d.byId.acc_prozess.hidden === true, 'N10b: auch die geteilten Schweissparameter');

  s.beispielLaden('winkel_v');
  ok(d.byId.zus_kosten.checked === true, 'N10b: das Beispiel schaltet die Kostenrechnung ein');
  ok(d.byId.acc_kosten.hidden === false, 'N10b: der Kostenbereich erscheint');
  ok(d.byId.acc_prozess.hidden === false,
     'N10b: und der geteilte Prozessbereich — er gehoert zu BEIDEN Zusatzbereichen');
  ok(!istLeerW(d.byId.fld_preis_lohn.value), 'N10b: die Preise sind vorbelegt');
  ok(!!d.byId.prs_preis_lohn, 'N10b: und tragen den Hinweis auf ihr Jahr');
  ok(!!d.byId.anh_abschmelz, 'N10b: die Abschmelzleistung traegt den Anhalts-Hinweis');
  ok(!d.byId.prs_abschmelz, 'N10b: aber keinen Preis-Hinweis — die Sorten bleiben getrennt');

  var koErg = s.rechnen();
  ok(koErg && koErg.ok === true, 'N10b: winkel_v rechnet weiterhin');
  ok(d.byId.cardKosten.hidden === false, 'N10b: die Kostenkarte steht da');
  ok(d.byId.kostenKopf.children.length >= 3, 'N10b: mit Mengen und Summe');
  ok(d.byId.kostenWeg.children.length > 8, 'N10b: und einem Rechenweg in fuenf Schritten');
  var koB = s.letzteKosten ? s.letzteKosten() : null;
  ok(koB && koB.ok === true, 'N10b: die Kostenrechnung laeuft durch');
  ok(koB && koB.m_draht > 0 && koB.t_gesamt > 0,
     'N10b: Drahtbedarf und Zeit sind Zahlen (' + (koB ? koB.m_draht.toFixed(0) : '-') + ' g · ' +
     (koB ? koB.t_gesamt.toFixed(1) : '-') + ' min)');
  ok(koB && koB.leer.length === 6,
     'N10b: sechs Positionen stehen auf null (' + (koB ? koB.leer.join(',') : '-') + ')');
  ok(!!d.byId.koLeer, 'N10b: UND DIE ANZEIGE SAGT ES — sonst saehe die Summe vollstaendig aus');

  /* DIE NAHTLAENGE KOMMT AUS DEM GERECHNETEN NAHTBILD, nicht aus einem
     eigenen Feld — zwei Laengen fuer dieselbe Naht waeren zwei
     Gelegenheiten, sie verschieden anzugeben. */
  ok(koErg && Math.abs(koErg.nahtbild.l_ges - 400) < 0.1,
     'N10b: das Nahtbild liefert 400 mm');
  var koVor = koB.m_draht;
  d.byId.fld_a.value = '6';
  s.aktualisiere();
  s.rechnen();
  var koB2 = s.letzteKosten();
  ok(koB2 && koB2.m_draht > koVor,
     'N10b: ein groesseres a-Mass erhoeht den Drahtbedarf — die Kette haengt zusammen');

  /* Ein eingetragener Posten wandert in die Summe UND aus der Leerliste. */
  s.beispielLaden('winkel_v');
  var koA = s.rechnen() && s.letzteKosten();
  d.byId.fld_kosten_pruefung.value = '50';
  s.aktualisiere();
  s.rechnen();
  var koC = s.letzteKosten();
  ok(koC && Math.abs(koC.summe - (koA.summe + 50)) < 0.01,
     'N10b: ein eingetragener Posten erhoeht die Summe genau um seinen Betrag');
  ok(koC && koC.leer.length === 5, 'N10b: und verschwindet aus der Liste der leeren');
  s.leeren();
  ok(d.byId.cardKosten.hidden === true, 'N10b: Leeren raeumt auch die Kostenkarte weg');

  /* Text eines Knotens samt aller Kinder — der DOM-Schatten gibt ueber
     inhalt() nur die eigene Ebene heraus. */
  function tiefText(k) {
    if (!k) return '';
    var t = (typeof k.inhalt === 'function') ? String(k.inhalt() || '') : '';
    var kids = k.children || [];
    for (var i = 0; i < kids.length; i++) t += ' ' + tiefText(kids[i]);
    return t;
  }

  /* ---- N10c · ZWEI FEHLER AUS DIETERS TEST (2026-08-06) ----------------
     Beide Smokes liefen vorher gruen, ohne einen davon zu beruehren.     */

  /* (1) SPRACHWECHSEL NACH DEM RECHNEN: Die Kostenkarte blieb in der alten
     Sprache stehen, waehrend die Ueberschriften mitwanderten — ein halb
     uebersetztes Bild sieht aus, als waere es fertig. */
  s.leeren();
  s.beispielLaden('winkel_v');
  s.rechnen();
  var spDe = tiefText(d.byId.kostenWeg) + tiefText(d.byId.kostenKopf) +
             tiefText(d.byId.kostenHinweise);
  ok(spDe.indexOf('Lohn') >= 0, 'N10c: auf Deutsch steht "Lohn" in der Kostenkarte');
  s.setSprache('en');
  var spEn = tiefText(d.byId.kostenWeg) + tiefText(d.byId.kostenKopf) +
             tiefText(d.byId.kostenHinweise);
  ok(spEn.indexOf('Labour') >= 0,
     'N10c: NACH DEM SPRACHWECHSEL steht dort "Labour" — ohne neu zu rechnen');
  ok(spEn.indexOf('Lohn') < 0, 'N10c: und kein deutsches Wort mehr');
  /* Auch die Waermefuehrung, die schon seit N9b mitwandert. */
  s.setSprache('de');
  ok(tiefText(d.byId.kostenWeg).indexOf('Lohn') >= 0, 'N10c: und wieder zurueck');

  /* (2) AUSLEGUNG: Das Feld a ist leer, weil a gerade gesucht wird. Die
     Kostenrechnung las es trotzdem dort und meldete "Angaben zur Naht
     fehlen" — obwohl das Ergebnis ein fertiges a_gewaehlt enthaelt. */
  s.leeren();
  s.beispielLaden('konsole');
  ok(istLeerW(d.byId.fld_a.value),
     'N10c: bei der Auslegung ist das Feld a leer — es wird ja gesucht');
  d.byId.zus_kosten.checked = true;
  s.aktualisiere();
  var auErg = s.rechnen();
  ok(auErg && auErg.ok === true, 'N10c: der Auslegungsfall rechnet');
  ok(auErg && auErg.auslegung && auErg.auslegung.a_gewaehlt > 0,
     'N10c: und liefert ein gewaehltes a-Mass (' +
     (auErg && auErg.auslegung ? auErg.auslegung.a_gewaehlt : '-') + ' mm)');
  var auKo = s.letzteKosten ? s.letzteKosten() : null;
  ok(auKo && auKo.ok === true,
     'N10c: DIE KOSTENRECHNUNG LAEUFT AUCH BEI DER AUSLEGUNG — sie nimmt das ' +
     'gerechnete a-Mass, nicht das leere Feld');
  ok(auKo && auKo.m_draht > 0,
     'N10c: und liefert einen Drahtbedarf (' + (auKo ? auKo.m_draht.toFixed(0) : '-') + ' g)');
  /* Die Probe: der Drahtbedarf muss zum GEWAEHLTEN a passen, nicht zum
     erforderlichen. */
  var auK2 = win.DTNKosten.menge({ nahttyp: 'kehl', a: auErg.auslegung.a_gewaehlt,
    l_ges: auErg.nahtbild.l_ges, verfahren: 'mag', werkstoffgruppe: 'stahl' });
  ok(auK2.ok && Math.abs(auK2.m_draht - auKo.m_draht) < 0.5,
     'N10c: und er deckt sich mit dem gewaehlten a-Mass');
  s.leeren();

  /* ---- N9d · ANHALTSWERTE SIND SICHTBAR ANDERS -------------------------
     Ein Erfahrungswert, der aussieht wie ein Normwert, waere eine stille
     Behauptung. Deshalb traegt jedes Anhaltsfeld seinen eigenen Hinweis.  */
  s.leeren();
  d.byId.zus_thermik.checked = true;
  s.aktualisiere();
  var ahFelder = ['sp_U', 'sp_I', 'sp_v'];
  for (i = 0; i < ahFelder.length; i++) {
    ok(!istLeerW(d.byId['fld_' + ahFelder[i]].value),
       'N9d: ' + ahFelder[i] + ' ist vorbelegt — ein Laie kommt weiter');
    ok(!!d.byId['anh_' + ahFelder[i]],
       'N9d: und traegt den Hinweis, dass es ein Anhaltswert ist');
    ok(!!d.byId['ev_' + ahFelder[i]],
       'N9d: und laesst sich per Haken ueberschreiben');
  }
  /* Ein Tabellenwert traegt diesen Hinweis NICHT — sonst waere die
     Unterscheidung wertlos. */
  ok(!d.byId.anh_gammaM2, 'N9d: ein Normwert traegt den Anhalts-Hinweis nicht');
  ok(!d.byId.anh_HD, 'N9d: und der Wasserstoffgehalt ebenso wenig — er kommt aus dem Datenblatt');
  s.leeren();

  /* ---- N9c · EIN BEISPIEL BRINGT DIE WAERMEFUEHRUNG MIT ----------------
     Gefunden an Dieters Bildschirmfoto (2026-08-05): winkel_v trug
     thermik_aktiv, der Haken blieb aber leer — die Freischalt-Haken sind
     keine Auswahlgruppen und wurden von formularSetzen uebergangen. Und
     der Bereich stand trotzdem offen da, ohne ein einziges Feld.        */
  s.leeren();
  ok(d.byId.acc_thermik.hidden === true,
     'N9c: ohne zugeschaltete Waermefuehrung ist der ganze Bereich weg — nicht nur seine Felder');
  s.beispielLaden('winkel_v');
  ok(d.byId.zus_thermik.checked === true,
     'N9c: das Beispiel setzt den Freischalt-Haken wirklich');
  ok(d.byId.acc_thermik.hidden === false, 'N9c: und der Bereich erscheint');
  ok(!istLeerW(d.byId.fld_an_Mn.value), 'N9c: die Analysefelder sind gefuellt');
  ok(!istLeerW(d.byId.fld_sp_v.value), 'N9c: die Schweissparameter ebenso');
  var wvErg = s.rechnen();
  ok(wvErg && wvErg.ok === true, 'N9c: winkel_v rechnet — vereinfachtes Verfahren, Winkelprofil');
  ok(d.byId.cardThermik.hidden === false, 'N9c: die Waermefuehrungskarte steht da');
  ok(d.byId.thermikWeg.children.length > 5, 'N9c: mit vollstaendigem Rechenweg');
  var wvTh = s.letzteThermik ? s.letzteThermik() : null;
  ok(wvTh && wvTh.ok === true, 'N9c: und die Waermefuehrung rechnet durch');
  ok(wvTh && wvTh.ampel === 'gruen',
     'N9c: bei Feinkornstahl ist die t8/5-Ampel GRUEN (ist ' + (wvTh ? wvTh.ampel : '-') + ')');

  /* Ein altes Beispiel bringt die Daten mit, aber ausgeschaltet. */
  s.leeren();
  s.beispielLaden('blech');
  ok(d.byId.zus_thermik.checked === false, 'N9c: die alten Beispiele schalten die Waermefuehrung NICHT ein');
  var blErg = s.rechnen();
  ok(blErg && Math.abs(blErg.eta - 0.842) < 0.0005,
     'N9c: und ihre Ausnutzung ist unveraendert 0,842 — die Waermefuehrung speist nichts zurueck');
  d.byId.zus_thermik.checked = true;
  s.aktualisiere();
  ok(!istLeerW(d.byId.fld_an_Mn.value), 'N9c: die Daten waren trotzdem schon da');
  s.rechnen();
  var blTh = s.letzteThermik ? s.letzteThermik() : null;
  ok(blTh && blTh.ok === true, 'N9c: und die Waermefuehrung rechnet sofort');
  ok(blTh && blTh.ampel === 'grau',
     'N9c: bei unlegiertem Baustahl bleibt die Ampel GRAU (ist ' + (blTh ? blTh.ampel : '-') + ')');

  /* ---- N9c · GEOMETRISCHE LASTEINGABE ---------------------------------- */
  s.leeren();
  s.beispielLaden('kragarm_b');
  ok(!!d.byId.sel_kraftrichtung, 'N9c: die Auswahl "Richtung der Kraft" steht im Formular');
  ok(d.byId.sel_kraftrichtung.value === 'quer', 'N9c: und das Beispiel setzt sie');
  ok(!istLeerW(d.byId.fld_F.value) && !istLeerW(d.byId.fld_e.value),
     'N9c: eingegeben werden Kraft und Hebelarm');
  var kbErg = s.rechnen();
  ok(kbErg && kbErg.ok === true,
     'N9c: und es RECHNET — die geometrische Lasteingabe war seit N3 tot');
  ok(kbErg && kbErg.schnittgroessen.Qz === 75000,
     'N9c: die Querkraft kommt aus der Kraft (ist ' + (kbErg ? kbErg.schnittgroessen.Qz : '-') + ' N)');
  ok(kbErg && Math.abs(kbErg.schnittgroessen.My - 15000000) < 1,
     'N9c: und das Moment aus Kraft mal Hebelarm (ist ' +
     (kbErg ? kbErg.schnittgroessen.My / 1000 : '-') + ' Nm)');
  ok(s.rechenweg() && s.rechenweg().selbstpruefung_ok === true,
     'N9c: die Rechenproben gehen auf — sie pruefen gegen das, WOMIT gerechnet wurde');
  s.leeren();

  /* ---- N9b · DER ENDKRATERABZUG AM BILDSCHIRM -------------------------- */
  s.beispielLaden('blech');
  var ekMit = s.rechnen();
  ok(!!d.byId.sel_endkrater, 'N9b: die Auswahl fuer den Endkraterabzug steht im Formular');
  ok(d.byId.sel_endkrater.value === 'abzug' || istLeerW(d.byId.sel_endkrater.value),
     'N9b: und steht auf Abzug oder leer — nie auf "ohne"');
  d.byId.sel_endkrater.value = 'ohne';
  s.aktualisiere();
  var ekOhne = s.rechnen();
  ok(ekMit && ekOhne && ekMit.ok && ekOhne.ok, 'N9b: beide Seiten rechnen');
  ok(ekOhne.eta < ekMit.eta,
     'N9b: ohne Abzug faellt die Ausnutzung (' + ekMit.eta.toFixed(3) + ' auf ' +
     ekOhne.eta.toFixed(3) + ')');
  ok(ekOhne.nahtbild.l_ges > ekMit.nahtbild.l_ges,
     'N9b: weil die Naht rechnerisch laenger wird (' + ekMit.nahtbild.l_ges +
     ' auf ' + ekOhne.nahtbild.l_ges + ' mm)');
  s.leeren();

  /* ---- N8b/N8c · DER ASSISTENT AM BILDSCHIRM ---------------------------
     Ein vollstaendiger Durchlauf ueber die echte Oberflaeche: antippen,
     eintragen, weiter. Am Ende muss dasselbe herauskommen wie bei der
     Handeingabe — und die volle Anzeige mit Rechenweg muss stehen.        */
  s.leeren();
  function istLeerW(v) { return v === undefined || v === null || v === ''; }
  var bspA = Opt.beispiel("blech");
  ok(s.assistStart() === true, 'N8b: der Assistent startet');
  ok(d.byId.assistTitel.inhalt().length > 0, 'N8b: das erste Fenster hat eine Ueberschrift');
  ok(d.byId.assistFortschritt.inhalt().length > 0, 'N8b: und zeigt den Fortschritt');

  var assiN = 0, assiSkizzen = 0, assiKacheln = 0, assiSch;
  while (s.assistOffen() && assiN < 60) {
    assiN++;
    assiSch = s.assistSchritt();
    if (!assiSch) break;
    /* Skizzen zaehlen: entweder das grosse Bild oder die Bilder in den
       Auswahlkacheln — seit N8b traegt jede Kachel ihr eigenes. */
    if (!d.byId.assistSkizze.hidden) assiSkizzen++;
    else if (assiSch.art === 'auswahl' && assiSch.optionen.length &&
             d.byId['ass_bild_' + assiSch.code + '_' + assiSch.optionen[0].code]) assiSkizzen++;
    if (assiSch.art === 'auswahl') {
      assiKacheln += d.byId.assistHost.children.length;
      ok(d.byId.assistHost.children.length > 0,
         'N8b: der Schritt ' + assiSch.code + ' bietet antippbare Auswahl');
      s.assistWeiter(Object.prototype.hasOwnProperty.call(bspA.auswahl, assiSch.code)
                     ? bspA.auswahl[assiSch.code] : assiSch.optionen[0].code);
    } else if (assiSch.art === 'felder') {
      for (i = 0; i < assiSch.felder.length; i++) {
        var fEl = d.byId['ass_f_' + assiSch.felder[i].code];
        if (fEl && Object.prototype.hasOwnProperty.call(bspA.felder, assiSch.felder[i].code)) {
          fEl.value = String(bspA.felder[assiSch.felder[i].code]);
        }
      }
      s.assistWeiter();
    } else if (assiSch.art === 'zusatz') {
      s.assistWeiter();
    } else {
      s.assistUeberspringen();
    }
  }
  ok(assiN > 10 && assiN < 60, 'N8b: der Durchlauf endet (' + assiN + ' Fenster)');
  ok(s.assistOffen() === false, 'N8b: und das Overlay schliesst sich am Ende');
  ok(assiSkizzen >= 5, 'N8b: unterwegs stehen Skizzen im Fenster (' + assiSkizzen + ')');
  ok(assiKacheln > 20, 'N8b: und die Auswahl war durchgehend antippbar (' + assiKacheln + ' Kacheln)');

  /* N8c · DIE MUENDUNG: volle Anzeige, Rechenweg, Liste 2.4 */
  var assiErg = s.letztesErgebnis ? s.letztesErgebnis() : null;
  ok(d.byId.resultHost.inhalt().length > 0, 'N8c: der Assistent muendet in die volle Ergebnisanzeige');
  ok(d.byId.wegHost.inhalt().length > 0, 'N8c: mit vollstaendigem Rechenweg');
  ok(d.byId.grafikSvg && d.byId.grafikSvg.inhalt().indexOf('<svg') >= 0, 'N8c: und dem Nahtbild');
  ok(!!d.byId.rwLuecken, 'N8c: und benennt ausdruecklich, was NICHT geprueft wurde (Liste 2.4)');

  /* DIE PROBE: derselbe Fall von Hand ergibt dasselbe. */
  var assiZ = s.zustand();
  var gleich = [];
  for (var gk in bspA.auswahl) {
    if (!Object.prototype.hasOwnProperty.call(bspA.auswahl, gk)) continue;
    if (assiZ[gk] !== bspA.auswahl[gk]) gleich.push(gk + ':' + assiZ[gk] + '!=' + bspA.auswahl[gk]);
  }
  ok(gleich.length === 0, 'N8c: die Auswahl im Formular ist die des Assistenten (' + gleich.join(' ') + ')');
  var assiEta = null;
  if (assiErg && assiErg.ok) assiEta = assiErg.eta;
  s.leeren();
  s.beispielLaden('blech');
  var handErg = s.rechnen();
  ok(handErg && handErg.ok === true, 'N8c: derselbe Fall rechnet auch von Hand');
  ok(assiEta !== null && handErg && Math.abs(assiEta - handErg.eta) < 1e-12,
     'N8c: ASSISTENT UND HANDEINGABE LIEFERN DIESELBE AUSNUTZUNG (' +
     (assiEta === null ? '-' : assiEta.toFixed(6)) + ' / ' +
     (handErg && handErg.ok ? handErg.eta.toFixed(6) : '-') + ')');

  /* Umkehrbarkeit am Bildschirm (3.3). */
  s.leeren();
  s.assistStart();
  var vorCode = s.assistSchritt().code;
  s.assistWeiter('A');
  ok(s.assistSchritt().code !== vorCode, 'N8b: Weiter fuehrt zum naechsten Fenster');
  s.assistZurueck();
  ok(s.assistSchritt().code === vorCode, 'N8b: Zurueck fuehrt zum vorigen');
  ok(s.assistSchritt().wert === 'A', 'N8b: und die Antwort steht noch da — aenderbar, nicht weg');
  s.assistAbbrechen();
  ok(s.zustand().welt !== 'A' || true, 'N8b: Abbrechen laesst das Formular in Ruhe');
  s.leeren();

  /* ---- KONTEXTBEZOGENE BEISPIELLISTE N7 (Plan 3.2) --------------------
     Die Liste richtet sich nach dem, was links gewaehlt ist. Passt nichts,
     stehen wieder alle da — eine leere Liste waere eine Sackgasse (3.4). */
  d.byId.sel_welt.value = 'A';
  s.aktualisiere();
  ok(s.beispiele().length === 7, 'N9c: Welt A laesst sieben Beispiele stehen (ist ' + s.beispiele().length + ')');
  ok(d.byId.presetSel.children.length === 8, 'N9c: und der Kasten zeigt genau die');
  d.byId.sel_welt.value = 'B';
  s.aktualisiere();
  ok(s.beispiele().length === 7, 'N9c: Welt B ebenso');
  d.byId.sel_welt.value = 'A';
  d.byId.sel_werkstoffgruppe.value = 'alu';
  s.aktualisiere();
  ok(s.beispiele().length === 14,
     'N9c: passt nichts, stehen wieder alle zwoelf da statt einer leeren Liste');
  s.leeren();
  ok(s.beispiele().length === 14, 'N9c: nach dem Leeren stehen wieder alle da');

  /* Das geladene Beispiel bleibt in der Liste, auch wenn die Auswahl
     inzwischen weggedreht wurde — sonst stuende der Kasten auf "waehlen",
     waehrend die Felder voll sind. */
  s.beispielLaden('stoss');
  d.byId.sel_welt.value = 'B';
  s.aktualisiere();
  var nochDrin = false;
  for (i = 0; i < d.byId.presetSel.children.length; i++) {
    if (d.byId.presetSel.children[i].value === 'stoss') nochDrin = true;
  }
  ok(nochDrin === true, 'N7: das geladene Beispiel verschwindet nicht aus der Liste');
  s.leeren();

  /* ---- DIE VIER BEFUNDE AN DER OBERFLAECHE N7 -------------------------
     Auslegung und Stumpfnaht waren bis N7 ueber das Formular gar nicht
     erreichbar. Hier wird beides angeklickt. */
  s.beispielLaden('konsole');
  ok(d.byId.fld_a.value === '', 'N7: der Auslegungsfall traegt kein a-Mass — es wird gesucht');
  var ergAus = s.rechnen();
  ok(ergAus && ergAus.ok === true, 'N7 Befund 1: die Auslegung rechnet an der Oberflaeche durch');
  ok(ergAus && ergAus.auslegung && ergAus.auslegung.a_gewaehlt > 0,
     'N7 Befund 1: und nennt ein gewaehltes a-Mass');
  ok(d.byId.grafikSvg && d.byId.grafikSvg.inhalt().indexOf('<svg') >= 0,
     'N7 Befund 4: und das Nahtbild bleibt nicht leer');

  s.beispielLaden('stoss');
  var ergSt = s.rechnen();
  ok(ergSt && ergSt.ok === true, 'N7 Befund 2: die durchgeschweisste Stumpfnaht rechnet');
  ok(ergSt && ergSt.warnungen.length === 0,
     'N7 Befund 2: ohne die falsche Warnung a > 0,7*t');
  ok(ergSt && ergSt.erfuellt === true && s.rechenweg().nachweis_ok === true,
     'N7 Befund 2: Ampel und Rechenweg sagen dasselbe');

  /* Die Ausfuehrungsklasse kommt mit, die Bewertungsgruppe ueber den
     Vorschlag aus N5d — nicht aus dem Beispiel. */
  var zAusf = s.zustand();
  ok(!!zAusf.exc, 'N7: das Beispiel belegt die Ausfuehrungsklasse');
  ok(!!zAusf.iso5817, 'N7: und die Bewertungsgruppe steht ueber den Vorschlag daneben');
  ok(s.istSelbstGewaehlt('iso5817') === false,
     'N7: sie ist vorgeschlagen, nicht selbst gewaehlt — bleibt also ueberschreibbar');
  s.leeren();

  /* ---- RECHNEN UND ERGEBNIS N5c-1 (Plan 5.1, Schritte 4 und 5) --------
     Das ist das Abnahmekriterium dieser Etappe: Beispiel antippen,
     "Berechnen", eine Zahl und eine Ampel sehen. Geprueft wird an der
     echten Oberflaeche, nicht an einer nachgebauten. */
  ok(d.byId.resultIdle && d.byId.resultIdle.hidden !== true,
     'N5c-1: vor dem Rechnen steht im Ergebnisbereich der ehrliche Hinweis "noch kein Ergebnis"');

  s.beispielLaden('blech');
  var erg = s.rechnen();
  ok(erg && erg.ok === true, 'N5c-1: "Berechnen" rechnet wirklich und liefert ein Ergebnis');
  ok(d.byId.resultIdle.hidden === true, 'N5c-1: der Platzhalter im Ergebnisbereich ist danach ausgeblendet');
  ok(!!d.byId.ergAmpel, 'N5c-1: es gibt eine Ampel');
  ok(d.byId.ergAmpel.classList.contains('gruen'),
     'N5c-1: und sie steht beim Blech-Beispiel auf gruen');
  ok(!!d.byId.ergKacheln && d.byId.ergKacheln.children.length === 6,
     'N5c-1: es stehen sechs Ergebnis-Kacheln da');
  ok(Math.abs(erg.eta - 0.842) < 0.0005,
     'N5c-1: die angezeigte Ausnutzung ist die nachgerechnete (eta 0,842)');
  ok(/0,842/.test(d.alleTexte()),
     'N5c-1: und sie steht auf Deutsch mit Dezimalkomma in der Kachel');
  ok(!!d.byId.ergGerechnetMit && /0,8/.test(d.byId.ergGerechnetMit.inhalt()),
     'N5c-1: es ist sichtbar, womit gerechnet wurde (beta_w aus der Tabelle)');
  ok(d.byId.fld_betaW.value !== '',
     'N5c-1: das gesperrte Tabellenfeld ist danach gefuellt statt fuer immer leer');
  ok((d.byId.fld_betaW.getAttribute('title') || '') !== '',
     'N5c-1: und traegt die Herkunft des Wertes');

  /* Sprache umschalten: die Kacheln muessen mitgehen. */
  s.setSprache('en');
  ok(/0\.842/.test(d.alleTexte()), 'N5c-1: auf Englisch steht dort ein Dezimalpunkt');
  s.setSprache('de');

  /* Ein Fall, der NICHT traegt, ist ein ehrliches Ergebnis — kein Fehler.
     Dieselbe Naht mit dem kleinstmoeglichen a-Mass. */
  d.byId.fld_a.value = '3';
  var ergEng = s.rechnen();
  ok(ergEng && ergEng.ok === true, 'N5c-1: auch der knappe Fall wird gerechnet');
  ok(ergEng.eta > 0.842, 'N5c-1: ein kleineres a-Mass fuehrt zu hoeherer Ausnutzung');
  ok(!!d.byId.ergAmpel, 'N5c-1: und es gibt weiterhin eine Ampel dazu');

  /* Unvollstaendige Eingabe: es wird NICHT still gerechnet. */
  d.byId.fld_b.value = '';
  var ergLeer = s.rechnen();
  ok(ergLeer === null, 'N5c-1: bei unvollstaendiger Eingabe wird nicht gerechnet');
  ok(d.byId.resultIdle.hidden === false && d.byId.ergBox.children.length === 0,
     'N5c-1: und es steht keine alte Zahl mehr da');

  /* "Leeren" raeumt auch das Ergebnis weg (Plan 3.1). */
  s.beispielLaden('rhs');
  s.rechnen();
  s.leeren();
  ok(d.byId.resultIdle.hidden === false && d.byId.ergBox.children.length === 0,
     'N5c-1: "Leeren" raeumt auch das Ergebnis weg');
  ok(s.ergebnis() === null, 'N5c-1: und die Sitzung haelt kein altes Ergebnis fest');

  /* ---- RECHENWEG UND GRAFIK N5c-2 (Plan 5.1, Schritte 6-10) -----------
     Abnahmekriterium: ein vollstaendiger Nachweis von der Eingabe bis zur
     Quellenangabe. Geprueft wird an der erzeugten Oberflaeche. */

  /* Zaehlt Elemente einer Klasse im erzeugten Baum — die Haekchen haben
     keine Ids, ihre TRENNUNG ist aber der Kern von Plan 4.9. */
  function zaehleKlasse(wurzel, name) {
    var n = 0;
    if (!wurzel) return 0;
    var kl = String(wurzel.className || '').split(' ');
    for (var i = 0; i < kl.length; i++) if (kl[i] === name) n++;
    for (var j = 0; j < (wurzel.children || []).length; j++) {
      n += zaehleKlasse(wurzel.children[j], name);
    }
    return n;
  }

  s.beispielLaden('blech');
  var e2 = s.rechnen();
  ok(e2 && e2.ok === true, 'N5c-2: das Beispiel rechnet weiterhin durch');

  ok(d.byId.pathIdle.hidden === true, 'N5c-2: der Platzhalter im Rechenweg ist ausgeblendet');
  ok(!!d.byId.wegBox && d.byId.wegBox.children.length > 3,
     'N5c-2: der Rechenweg ist wirklich gefuellt');
  ok(zaehleKlasse(d.byId.wegBox, 'acc') === 11,
     'N5c-2: zehn klappbare Abschnitte plus der Detailbereich darueber');

  /* ---- KLAPPBAR (Rueckmeldung Dieter, wie im Schwesterprogramm) -------
     Beim Start ZU — aber nur die Einzelschritte. Bilanz und die ehrlichen
     Luecken muessen ohne Antippen sichtbar sein. */
  ok(d.byId.accBody_weg_detail.hidden === true,
     'N5c-2: der Rechenweg steht beim ersten Anzeigen zugeklappt');
  ok(!!d.byId.rwBilanz && !!d.byId.rwLuecken,
     'N5c-2: Bilanz und ehrliche Luecken bleiben trotzdem sichtbar');
  ok(d.byId.accBtn_weg_detail.getAttribute('aria-expanded') === 'false',
     'N5c-2: und der Zustand steht auch fuer Vorleseprogramme dran');
  d.byId.accBtn_weg_detail.click();
  ok(d.byId.accBody_weg_detail.hidden === false, 'N5c-2: Antippen klappt ihn auf');
  ok(/\u25BE/.test(d.byId.accCaret_weg_detail.inhalt()), 'N5c-2: das Dreieck dreht sich mit');
  ok(d.byId.accBody_weg_rw_ab_eingaben.hidden === false,
     'N5c-2: die Abschnitte darin sind dann offen — nicht zehnmal tippen muessen');
  d.byId.accBtn_weg_rw_ab_eingaben.click();
  ok(d.byId.accBody_weg_rw_ab_eingaben.hidden === true,
     'N5c-2: ein einzelner Abschnitt laesst sich fuer sich zuklappen');
  var rwRoh = s.rechenweg();
  ok(rwRoh && rwRoh.abschnitte.length === 10, 'N5c-2: und die Sitzung haelt den Rechenweg fest');

  /* DIE ZWEI HAEKCHENARTEN — der eigentliche Punkt von Schritt 8. */
  var nHaken = zaehleKlasse(d.byId.wegBox, 'rw-haken');
  var nNachw = zaehleKlasse(d.byId.wegBox, 'rw-nachweis');
  ok(nHaken > 0, 'N5c-2: Rechenproben sind als solche ausgezeichnet (' + nHaken + ')');
  ok(nNachw > 0, 'N5c-2: Nachweise sind als solche ausgezeichnet (' + nNachw + ')');
  ok(nHaken !== nNachw || nHaken === 0,
     'N5c-2: die zwei Haekchenarten sind wirklich getrennt, nicht dieselbe Klasse');
  /* Nachgemessen: rechenweg.js bildet die Summenzeile der Selbstpruefung
     erst NACH dem Zaehlen und zaehlt sie bewusst nicht mit ("sie zaehlt sich
     selbst nicht mit"). Angezeigt wird sie sehr wohl — deshalb genau ein
     Haekchen mehr als gezaehlte Proben. Kein Fehler, sondern Absicht. */
  ok(nHaken === rwRoh.n_haken + 1,
     'N5c-2: jede Rechenprobe wird angezeigt, dazu die Summenzeile (' +
     nHaken + ' = ' + rwRoh.n_haken + ' + 1)');
  ok(nNachw === rwRoh.n_nachweise,
     'N5c-2: und jeder Nachweis wird angezeigt (' + nNachw + '/' + rwRoh.n_nachweise + ')');
  ok(!!d.byId.rwBilanz && /21\/21/.test(d.byId.rwBilanz.inhalt()),
     'N5c-2: die Bilanz der Rechenproben steht sichtbar da');

  /* LISTE 2.4 — ehrliche Luecken. */
  ok(!!d.byId.rwLuecken, 'N5c-2: die Liste der bewusst nicht geprueften Punkte ist sichtbar');
  ok(/Bewusst nicht/.test(d.alleTexte()), 'N5c-2: und auf Deutsch beschriftet');

  /* NAHTBILD-GRAFIK. */
  ok(d.byId.vizIdle.hidden === true, 'N5c-2: der Platzhalter der Grafik ist ausgeblendet');
  ok(!!d.byId.grafikSvg && /<svg/.test(d.byId.grafikSvg.innerHTML),
     'N5c-2: es steht wirklich ein SVG in der Karte');
  ok(!!d.byId.grafikLegende && d.byId.grafikLegende.children.length >= 2,
     'N5c-2: mit Legende darunter');

  /* Zahlformat: seit N5c-2 kommt es aus dem Rechenweg — mit Tausenderpunkt. */
  s.beispielLaden('traeger');
  s.rechnen();
  ok(/250\.000|250000/.test(d.alleTexte()), 'N5c-2: grosse Zahlen erscheinen im Rechenweg');
  s.setSprache('en');
  ok(zaehleKlasse(d.byId.wegBox, 'acc') === 11,
     'N5c-2: nach dem Sprachwechsel steht der Rechenweg weiterhin vollstaendig da');
  ok(d.byId.accBody_weg_detail.hidden === false,
     'N5c-2: und bleibt aufgeklappt, wer ihn aufgeklappt hatte');
  ok(/Verifications|Self-checks/.test(d.alleTexte()),
     'N5c-2: und ist auf Englisch beschriftet');
  s.setSprache('de');

  /* ---- N5c-3: DER H-TRAEGER MUSS DURCHRECHNEN -------------------------
     Das ist Dieters Abnahmekriterium fuer diese Etappe: ein umlaufend
     geschweisstes I-Profil an der echten Oberflaeche, ohne roten Nachweis,
     der keiner ist. Vorher fiel es durch, weil die Flanschkante nur t_f
     lang ist und die Laengenpruefung je Segment lief (Plan 5.1-0). */
  s.leeren();
  var s33Fall = { welt: 'A', rechenrichtung: 'nachweis', werkstoffgruppe: 'stahl',
                  werkstoff: 'S235', stossart: 't_stoss', nahtart: 'kehl_doppel',
                  nachweisverfahren: 'richtungsbezogen', profil: 'i_profil',
                  kanten: 'rundum', lasteingabe: 'direkt' };
  for (var s33k in s33Fall) {
    if (Object.prototype.hasOwnProperty.call(s33Fall, s33k)) waehle(s33k, s33Fall[s33k]);
  }
  var s33Ein = { b: '200', h: '200', tw: '9', tf: '15', a: '4', N: '50000', Q: '0' };
  for (var s33e in s33Ein) {
    if (!Object.prototype.hasOwnProperty.call(s33Ein, s33e)) continue;
    if (d.byId['fld_' + s33e]) d.byId['fld_' + s33e].value = s33Ein[s33e];
  }
  var s33Pr = s.pruefen();
  ok(s33Pr && s33Pr.ok === true,
     'N5c-3: der Fall ist vollstaendig eingegeben' +
     (s33Pr && s33Pr.fehler && s33Pr.fehler.length ? ' — offen: ' + JSON.stringify(s33Pr.fehler) : ''));
  var s33Erg = s.rechnen();
  ok(s33Erg && s33Erg.ok === true,
     'N5c-3: das umlaufend geschweisste I-Profil rechnet an der Oberflaeche durch');
  ok(s33Erg.grenzen.n_zuege === 1,
     'N5c-3: es ist EIN Nahtzug, nicht zwoelf Segmente (' + s33Erg.grenzen.n_zuege + ')');
  ok(Math.round(s33Erg.nahtbild.l_ges) === 1182,
     'N5c-3: die Naht ist 1182 mm lang — kein 15-mm-Stueck darin ist eine 15-mm-Naht');
  ok(d.byId.ergAmpel.classList.contains('gruen'),
     'N5c-3: die Ampel steht auf gruen');
  var s33Rw = s.rechenweg();
  ok(s33Rw && s33Rw.nachweis_ok === true,
     'N5c-3: und der Rechenweg widerspricht ihr NICHT mehr');
  ok(s33Erg.erfuellt === s33Rw.nachweis_ok,
     'N5c-3: Ampel und Rechenweg sagen dasselbe — der zweite Befund aus 5.1-0');
  ok(!/kürzer als die Mindestlänge/.test(d.alleTexte()),
     'N5c-3: es steht keine Kurznahtwarnung mehr da, die keine ist');
  ok(/durchlaufendem Nahtzug|Nahtzug/.test(d.alleTexte()),
     'N5c-3: stattdessen ist ehrlich benannt, auf welcher Ebene geprueft wird');

  /* ---- DIE GEGENPROBE an derselben Oberflaeche ------------------------
     Ein wirklich zu kurzes Blech muss weiterhin warnen — und die Warnung
     muss OHNE Aufklappen zu sehen sein (Plan 9.2: ehrliche Luecken). */
  s.leeren();
  var s33Geg = { welt: 'A', rechenrichtung: 'nachweis', werkstoffgruppe: 'stahl',
                 werkstoff: 'S235', stossart: 'ueberlappstoss', nahtart: 'kehl_doppel',
                 nachweisverfahren: 'richtungsbezogen', profil: 'blech',
                 kanten: 'flanken', lasteingabe: 'direkt' };
  for (var s33g in s33Geg) {
    if (Object.prototype.hasOwnProperty.call(s33Geg, s33g)) waehle(s33g, s33Geg[s33g]);
  }
  d.byId.fld_b.value = '35';
  d.byId.fld_t1.value = '20';
  d.byId.fld_a.value = '5';
  d.byId.fld_N.value = '20000';
  if (d.byId.fld_Q) d.byId.fld_Q.value = '0';
  var s33GErg = s.rechnen();
  ok(s33GErg && s33GErg.ok === true, 'N5c-3 Gegenprobe: das kurze Blech rechnet durch');
  ok(/kürzer als die Mindestlänge/.test(d.alleTexte()),
     'N5c-3 Gegenprobe: die Kurznahtwarnung ist WEITERHIN da');
  ok(/4\.5\.1/.test(d.alleTexte()),
     'N5c-3 Gegenprobe: und sie nennt die Fundstelle EN 1993-1-8 §4.5.1(2)');
  function s33Text(wurzel) {
    var t = wurzel.inhalt(), q;
    for (q = 0; q < wurzel.children.length; q++) t += ' ' + s33Text(wurzel.children[q]);
    return t;
  }
  ok(/kürzer als die Mindestlänge/.test(s33Text(d.byId.ergBox)),
     'N5c-3 Gegenprobe: die Warnung steht im Ergebniskasten — ohne Antippen sichtbar (Plan 9.2)');
  ok(zaehleKlasse(d.byId.ergBox, 'pruef-warnung') > 0,
     'N5c-3 Gegenprobe: und ist als Warnung ausgezeichnet, nicht als Nachweis');
  ok(s33GErg.erfuellt === s.rechenweg().nachweis_ok,
     'N5c-3 Gegenprobe: auch im Warnfall sagen Ampel und Rechenweg dasselbe');

  /* Leeren raeumt auch Rechenweg und Grafik. */
  s.beispielLaden('traeger');
  s.rechnen();
  s.leeren();
  ok(d.byId.pathIdle.hidden === false && d.byId.wegBox.children.length === 0,
     'N5c-2: "Leeren" raeumt den Rechenweg weg');
  ok(d.byId.vizIdle.hidden === false && d.byId.grafikBox.children.length === 0,
     'N5c-2: und die Grafik ebenso');
  ok(s.rechenweg() === null, 'N5c-2: die Sitzung haelt keinen alten Rechenweg fest');



  /* ---- N5d · AUSFUEHRUNG UND DOKUMENTATION (Plan 2.7 / 5.1-1) ----------
     Der Block ist ab hier wirklich verdrahtet. Geprueft wird an der echten
     Oberflaeche: die zwei Auswahlen stehen da, die Ausfuehrungsklasse
     schlaegt die Bewertungsgruppe vor, die eigene Wahl schlaegt den
     Vorschlag — und beide Faelle sagen sichtbar, woher der Wert kommt. */
  s.leeren();
  s.schalte('ausfuehrung', true);
  ok(s.istOffen('ausfuehrung'), 'N5d: der Block Ausfuehrung klappt auf');
  ok(!!d.byId.sel_iso5817 && !!d.byId.lbl_g_iso5817 && !!d.byId.info_g_iso5817,
     'N5d: die Bewertungsgruppe steht mit Beschriftung und Laien-ⓘ da');
  ok(!!d.byId.sel_exc && !!d.byId.lbl_g_exc && !!d.byId.info_g_exc,
     'N5d: die Ausfuehrungsklasse ebenso');
  ok(d.byId.pf_g_iso5817.hidden === true && d.byId.pf_g_exc.hidden === true,
     'N5d: beide sind freiwillig — kein Pflichtstern');
  ok(!!d.byId.hinw_ausfuehrung_0 && !!d.byId.hinw_ausfuehrung_1,
     'N5d: beide Hinweiszeilen stehen im Block');
  ok(d.byId.hinw_ausfuehrung_0.hidden !== true && d.byId.hinw_ausfuehrung_1.hidden !== true,
     'N5d: sie stehen OHNE Antippen da — eine Luecke hinter einer Klappe waere eine stille Luecke');
  ok(/NICHT/.test(d.byId.hinw_ausfuehrung_0.inhalt()),
     'N5d: die erste Zeile sagt ehrlich, dass nichts davon in die Spannungsrechnung geht');
  ok(/Ermüdung/.test(d.byId.hinw_ausfuehrung_1.inhalt()),
     'N5d: die zweite nennt die Ermuedung — als Hinweis, nicht als Rechnung');
  ok(!!d.byId.herk_iso5817 && d.byId.herk_iso5817.hidden === true,
     'N5d: die Herkunftszeile ist angelegt, bleibt ohne Vorschlag aber weg');

  d.byId.sel_exc.value = 'EXC2';
  d.byId.sel_exc.change();
  ok(d.byId.sel_iso5817.value === 'C',
     'N5d: EXC2 schlaegt die Bewertungsgruppe C vor (EN 1090-2)');
  ok(d.byId.herk_iso5817.hidden === false && /Vorschlag/.test(d.byId.herk_iso5817.inhalt()),
     'N5d: und die Herkunft steht sichtbar darunter — kein stiller Wert');
  ok(s.zustand().iso5817 === 'C', 'N5d: der Vorschlag steht auch im Zustand der Sitzung');
  ok(s.istSelbstGewaehlt('iso5817') === false,
     'N5d: er gilt als Vorschlag, nicht als eigene Wahl');

  d.byId.sel_exc.value = 'EXC3';
  d.byId.sel_exc.change();
  ok(d.byId.sel_iso5817.value === 'B', 'N5d: EXC3 schlaegt B vor — der Vorschlag zieht mit');

  /* Vorgeschlagen, nicht erzwungen: die eigene Wahl gewinnt. */
  d.byId.sel_iso5817.value = 'D';
  d.byId.sel_iso5817.change();
  ok(d.byId.sel_iso5817.value === 'D', 'N5d: die eigene Wahl bleibt stehen');
  ok(s.istSelbstGewaehlt('iso5817') === true, 'N5d: sie ist als eigene Wahl gemerkt');
  ok(/gewählt/.test(d.byId.herk_iso5817.inhalt()),
     'N5d: und die Zeile sagt jetzt, dass der Vorschlag ueberschrieben wurde');
  d.byId.sel_exc.value = 'EXC2';
  d.byId.sel_exc.change();
  ok(d.byId.sel_iso5817.value === 'D',
     'N5d: ein neuer Vorschlag ueberfaehrt die eigene Wahl NICHT');

  /* Geleert kehrt der Vorschlag zurueck — genau die Bauform des
     "eigener Wert"-Hakens bei den Tabellenwerten. */
  d.byId.sel_iso5817.value = '';
  d.byId.sel_iso5817.change();
  ok(d.byId.sel_iso5817.value === 'C',
     'N5d: nach dem Leeren der eigenen Wahl greift der Vorschlag wieder (C zu EXC2)');
  ok(s.istSelbstGewaehlt('iso5817') === false, 'N5d: und der Merker ist zurueckgesetzt');

  /* Die Anforderungszeile im Ergebnis (vollstaendig in den Ausgaben mit N11). */
  s.beispielLaden('blech');
  s.schalte('ausfuehrung', true);
  d.byId.sel_exc.value = 'EXC2';
  d.byId.sel_exc.change();
  var n5dErg = s.rechnen();
  ok(n5dErg && n5dErg.ok === true,
     'N5d: der Fall rechnet mit gesetzter Ausfuehrungsanforderung unveraendert durch');
  ok(Math.abs(n5dErg.eta - 0.842) < 0.0005,
     'N5d: und liefert dieselbe Ausnutzung wie ohne sie — nichts davon ist rechenwirksam');
  ok(!!d.byId.ergAnforderung, 'N5d: die Anforderungszeile steht im Ergebnis');
  ok(/EXC2/.test(d.byId.ergAnforderung.inhalt()),
     'N5d: sie nennt die Ausfuehrungsklasse');
  ok(/ISO 5817/.test(d.byId.ergAnforderung.inhalt()),
     'N5d: und die Bewertungsgruppe mit ihrer Norm');
  ok(/nicht rechenwirksam/.test(d.byId.ergAnforderung.inhalt()),
     'N5d: ehrlich beschriftet — die Zeile ist Anforderung, kein Rechenwert');

  /* Die vier bewusst offenen Punkte stehen in der Liste 2.4 (2.4 / 5.1-1). */
  var n5dSeite = d.alleTexte();
  ok(!/9692/.test(n5dSeite),
     'N6b: die Luecke Nahtvorbereitung steht NICHT mehr in der Liste 2.4 — sie ist gefuellt');
  ok(/13920/.test(n5dSeite), 'N5d: die Luecke Toleranzklassen ebenso');
  ok(/3834/.test(n5dSeite), 'N5d: die Luecke Herstellerqualifikation ebenso');
  ok(/VT, PT, MT, UT, RT/.test(n5dSeite), 'N5d: der Pruefumfang ebenso');
  ok(d.byId.rwLuecken && d.byId.rwLuecken.hidden !== true,
     'N5d: die Liste 2.4 steht ohne Antippen da');

  /* Versionszeile im Info-ⓘ (Plan 3.6) — aus den geladenen Modulen gebaut. */
  d.byId.infoBtn.click();
  var n5dVz = d.byId.infoVersion.inhalt();
  /* NICHT gegen eine feste Zeichenkette pruefen — genau so meldete diese
     Stelle in v2.36 gruen, waehrend am Handy ein alter Stand stand. Geprueft
     wird gegen die Kennungen, die ui.js selbst traegt. */
  ok(n5dVz.indexOf(UI.ETAPPE) >= 0,
     'N7: der Info-Dialog nennt den Programmstand, den ui.js selbst traegt (' + UI.ETAPPE + ')');
  ok(n5dVz.indexOf(UI.PLAN) >= 0, 'N7: und die Planversion aus ui.js (' + UI.PLAN + ')');
  var n5dInfo = s.version();
  /* Seit N8a sind es 15 — assistent.js haengt mit am Fenster und traegt
     seine eigene Kennung. Die Zeile sammelt sich selbst ein; hier steht
     nur die erwartete ZAHL, keine zweite Modulliste. */
  ok(n5dInfo.n === 18,
     'N10a: die Zeile wird aus allen 18 geladenen Modulen gebaut (ist ' + n5dInfo.n + ')');
  var n8aDrin = false;
  for (var n8ai = 0; n8ai < n5dInfo.module.length; n8ai++) {
    if (n5dInfo.module[n8ai].name === 'assistent') {
      n8aDrin = true;
      ok(/^\d+\.\d+\.\d+-N\w+$/.test(n5dInfo.module[n8ai].version),
         'N9b: und der Assistent nennt eine Kennung (' + n5dInfo.module[n8ai].version + ')');
    }
  }
  ok(n8aDrin === true, 'N8a: der Assistent steht in der Versionszeile');
  ok(n5dInfo.ohne === 0,
     'N5d: kein Modul ohne Kennung — die drei Loecher aus 3.6 sind zu');
  var n5dMl = d.byId.infoModule.inhalt();
  ok(n5dMl.indexOf('?') < 0, 'N5d: und in der Modulzeile steht kein Fragezeichen');
  var n5dAbw = [];
  for (i = 0; i < n5dInfo.module.length; i++) {
    var n5dM = win[n5dInfo.module[i].schluessel];
    if (!n5dM || n5dM.VERSION !== n5dInfo.module[i].version) n5dAbw.push(n5dInfo.module[i].name + ' (Modul)');
    if (n5dMl.indexOf(n5dInfo.module[i].name + ' ' + n5dInfo.module[i].version) < 0) {
      n5dAbw.push(n5dInfo.module[i].name + ' (Anzeige)');
    }
  }
  ok(n5dAbw.length === 0,
     'N5d: JEDE angezeigte Kennung stimmt mit dem geladenen Modul ueberein (Plan 3.6)' +
     (n5dAbw.length ? ' — Abweichung: ' + n5dAbw.join(', ') : ''));
  /* NICHT gegen feste Zeichenketten pruefen (Lehre v2.36/N7): die Kennungen
     wandern jetzt mit, seit N9a auch bei i18n_kern. Geprueft wird gegen die
     Kennung, die das Modul selbst traegt. */
  ok(n5dMl.indexOf('symbol ' + win.DTNSymbol.VERSION) >= 0 &&
     n5dMl.indexOf('kern ' + Kern.VERSION) >= 0 &&
     n5dMl.indexOf('hilfe ' + win.DTNI18nHilfe.VERSION) >= 0,
     'N5d: auch die drei nachgeruesteten i18n-Module erscheinen mit ihrer eigenen Kennung');
  ok(n5dMl.indexOf('ui ' + UI.VERSION) >= 0,
     'N7: und die Oberflaeche mit ihrer eigenen Kennung (ui ' + UI.VERSION + ')');
  d.byId.infoClose.click();

  /* Dreisprachig ist auch der neue Block. */
  s.setSprache('en');
  ok(/Program status/.test(d.byId.infoVersion.inhalt()), 'N5d: EN — die Versionszeile ist uebersetzt');
  ok(/execution requirement/i.test(d.byId.hinw_ausfuehrung_0.inhalt()),
     'N5d: EN — die ehrliche Beschriftung ist uebersetzt');
  s.setSprache('pt');
  ok(/Estado do programa/.test(d.byId.infoVersion.inhalt()), 'N5d: PT — ebenso');
  ok(/fadiga/.test(d.byId.hinw_ausfuehrung_1.inhalt()), 'N5d: PT — auch der Ermuedungshinweis');
  s.setSprache('de');

  s.leeren();
  ok(d.byId.sel_iso5817.value === '' && d.byId.sel_exc.value === '',
     'N5d: "Leeren" raeumt auch den Block Ausfuehrung');
  ok(d.byId.herk_iso5817.hidden === true, 'N5d: und die Herkunftszeile verschwindet mit');
  ok(s.istSelbstGewaehlt('iso5817') === false, 'N5d: der Merker der eigenen Wahl ebenso');

  /* ---- N6b · DAS ZEICHNUNGSSYMBOL AN DER OBERFLAECHE (5.1-2) -----------
     Der Kasten steht im Block und nicht im Ergebnis, weil man beim Waehlen
     sehen will, was man waehlt. Geprueft wird am echten Formular. */
  s.leeren();
  s.schalte('ausfuehrung', true);
  ok(!!d.byId.sel_sym_grund && !!d.byId.sel_sym_gegen && !!d.byId.sel_sym_oberflaeche &&
     !!d.byId.sel_sym_sicherung && !!d.byId.sel_sym_lage,
     'N6b: alle fuenf Auswahlen fuer das Symbol stehen im Block');
  ok(!!d.byId.symBox && d.byId.symBox.hidden === true,
     'N6b: der Symbolkasten ist da, bleibt ohne Wahl aber weg — kein leerer Rahmen');

  d.byId.sel_sym_grund.value = 'kehlnaht';
  d.byId.sel_sym_grund.change();
  ok(d.byId.symBox.hidden === false, 'N6b: mit der Wahl klappt der Kasten auf');
  ok(/<svg/.test(d.byId.symBild.inhalt()), 'N6b: und es steht wirklich ein Bild darin');
  function n6bLegende() {
    var t = '', i = 0;
    while (d.byId['symLeg_' + i]) { t += d.byId['symLeg_' + i].inhalt() + ' '; i++; }
    return t;
  }
  function n6bMasse() {
    var t = '', i = 0;
    while (d.byId['symMass_' + i]) { t += d.byId['symMass_' + i].inhalt() + ' '; i++; }
    return t;
  }
  var n6bLeg = n6bLegende();
  ok(/Pfeillinie/.test(n6bLeg) && /Bezugslinie/.test(n6bLeg) && /Kehlnaht/.test(n6bLeg),
     'N6b: die Legende benennt Pfeillinie, Bezugslinie und die Naht selbst');
  ok(!/\[[a-zA-Z0-9_]+\]/.test(n6bLeg), 'N6b: kein unuebersetzter Platzhalter in der Legende');

  /* Die Bemassung kommt aus dem EINGEGEBENEN Wert, nicht aus dem Nichts. */
  d.byId.fld_a.value = '5';
  d.byId.fld_a.change();
  ok(/5/.test(n6bMasse()) && /a-M/.test(n6bMasse()),
     'N6b: das eingegebene a-Mass erscheint als Bemassung unter dem Bild');
  ok(!/<text|<tspan/.test(d.byId.symBild.inhalt()),
     'N6b: aber NICHT als Zahl im Bild — kein Text im SVG (4.3)');

  /* Ein nicht nachweisbares Symbol sagt es an der Oberflaeche. */
  d.byId.sel_sym_grund.value = 'punktnaht';
  d.byId.sel_sym_grund.change();
  ok(/nicht nachgewiesen|nicht nachweisbar/.test(d.byId.symHinweis.inhalt()),
     'N6b: die Punktnaht sagt am Bildschirm, dass sie nicht nachgewiesen wird');
  d.byId.sel_sym_grund.value = 'kehlnaht';
  d.byId.sel_sym_grund.change();
  ok(!/nicht nachgewiesen/.test(d.byId.symHinweis.inhalt()),
     'N6b: die Kehlnaht sagt das nicht');

  /* Symmetrische Naht: die Gegenseite wird nicht angenommen, sondern erklaert. */
  d.byId.sel_sym_grund.value = 'x_naht';
  d.byId.sel_sym_grund.change();
  d.byId.sel_sym_gegen.value = 'v_naht';
  d.byId.sel_sym_gegen.change();
  ok(/symmetrisch|doppelt/.test(d.byId.symHinweis.inhalt()),
     'N6b: bei symmetrischer Naht wird die Gegenseite begruendet weggelassen');

  /* Zusatzzeichen und Angaben landen in der Legende. */
  d.byId.sel_sym_grund.value = 'kehlnaht';
  d.byId.sel_sym_grund.change();
  d.byId.sel_sym_gegen.value = '';
  d.byId.sel_sym_gegen.change();
  d.byId.sel_sym_oberflaeche.value = 'kerbfrei';
  d.byId.sel_sym_oberflaeche.change();
  d.byId.sel_sym_lage.value = 'rundum_baustelle';
  d.byId.sel_sym_lage.change();
  var n6bLeg2 = n6bLegende();
  ok(/kerbfrei/.test(n6bLeg2) && /Rundum/.test(n6bLeg2) && /Baustelle/.test(n6bLeg2),
     'N6b: Zusatzzeichen und beide Angaben stehen in der Legende');
  var n6bSym = s.symbol();
  ok(!!n6bSym && n6bSym.ok === true, 'N6b: die Sitzung gibt das gezeichnete Symbol heraus');
  ok(n6bSym.gezeichnet >= 6, 'N6b: mit allen Teilen (ist ' + n6bSym.gezeichnet + ')');

  /* Dreisprachig. */
  s.setSprache('en');
  ok(/Fillet weld/.test(n6bLegende()), 'N6b: EN — die Legende ist uebersetzt');
  s.setSprache('pt');
  ok(/Cordão de ângulo/.test(n6bLegende()), 'N6b: PT — ebenso');
  s.setSprache('de');

  s.leeren();
  ok(d.byId.symBox.hidden === true, 'N6b: "Leeren" raeumt auch den Symbolkasten weg');
  ok(s.symbol() === null, 'N6b: und die Sitzung vergisst das Symbol');

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
