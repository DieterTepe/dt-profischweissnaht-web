/* ============================================================================
 * DT-ProfiSchweissnaht · dom_smoke_voll.js   ***DEV-ONLY — NIE AUSLIEFERN***
 * DOM-Smoke mit Mini-DOM-Shim in Node.
 *  - laedt IMMER ALLE Module gemeinsam (echte Ladereihenfolge aus der HTML)
 *  - fuehrt das in der HTML enthaltene Skript real aus
 *  - klickt die Oberflaeche durch (Sprachumschalter, Theme, Info)
 * Aufruf:  node dom_smoke_voll.js        (Vollversion)
 *          node dom_smoke_test.js        (Testversion)
 * ========================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');

/* ---------------------------------------------------------------- Mini-DOM */
function Element(tag) {
  this.tagName = tag || 'div';
  this.attributes = {};
  this.children = [];
  this._text = '';
  this._html = '';
  this.hidden = false;
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
Element.prototype.setAttribute = function (n, v) { this.attributes[n] = String(v); };
Element.prototype.addEventListener = function (ev, fn) {
  (this.listeners[ev] = this.listeners[ev] || []).push(fn);
};
Element.prototype.click = function () {
  var l = this.listeners.click || [];
  for (var i = 0; i < l.length; i++) l[i].call(this, { type: 'click', target: this });
};
Element.prototype.inhalt = function () { return this._html + ' ' + this._text; };

function baueDom(html) {
  var byId = {}, langBtns = [];
  var re = /id="([^"]+)"/g, m;
  while ((m = re.exec(html)) !== null) byId[m[1]] = new Element('div');

  var reBtn = /class="lang-btn[^"]*"[^>]*data-lang="([a-z]{2})"/g;
  while ((m = reBtn.exec(html)) !== null) {
    var b = new Element('button');
    b.setAttribute('data-lang', m[1]);
    b.classList.add('lang-btn');
    if (m[1] === 'de') b.classList.add('active');
    langBtns.push(b);
  }

  var docEl = new Element('html');
  docEl.setAttribute('lang', 'de');

  var document = {
    documentElement: docEl,
    getElementById: function (i) { return byId[i] || null; },
    createElement: function (t) { return new Element(t); },
    querySelectorAll: function (sel) {
      if (sel === '.lang-btn') return langBtns;
      return [];
    }
  };
  return { document: document, byId: byId, langBtns: langBtns, docEl: docEl };
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

  /* 1) Editionsweiche + Ladereihenfolge aus der HTML lesen */
  var mEd = html.match(/window\.DT_EDITION\s*=\s*'(full|test)'/);
  ok(!!mEd, 'Editionsweiche in der HTML gefunden');
  ok(mEd && mEd[1] === edition, 'Editionsweiche steht auf "' + edition + '"');

  var srcRe = /<script src="([^"]+)"><\/script>/g, srcs = [], mm;
  while ((mm = srcRe.exec(html)) !== null) srcs.push(mm[1]);
  var erwartet = ['i18n_kern.js', 'i18n_hilfe.js', 'i18n_kerbfall.js', 'daten.js', 'optionen.js',
                  'validate.js', 'naht.js', 'profil.js'];
  ok(srcs.join(',') === erwartet.join(','), 'Ladereihenfolge stimmt: ' + srcs.join(' → '));

  /* 2) ALLE Module gemeinsam laden — genau in dieser Reihenfolge */
  var d = baueDom(html);
  var win = { DT_EDITION: edition, alert: function (t) { win._letzterAlert = t; } };
  for (var i = 0; i < srcs.length; i++) {
    var mod = require('./' + srcs[i]);
    var name = { 'i18n_kern.js': 'DTNI18nKern', 'i18n_hilfe.js': 'DTNI18nHilfe',
                 'i18n_kerbfall.js': 'DTNI18nKerb', 'daten.js': 'DTNData',
                 'optionen.js': 'DTNOptions', 'validate.js': 'DTNValidate',
                 'naht.js': 'DTNNaht', 'profil.js': 'DTNProfil' }[srcs[i]];
    win[name] = mod;
    ok(!!mod, 'Modul geladen: ' + srcs[i]);
  }
  win.document = d.document;
  win.window = win;

  /* 3) Das Skript aus der HTML real ausfuehren */
  var inline = html.match(/<script>\n\(function \(\) \{[\s\S]*?\}\)\(\);\n<\/script>/);
  ok(!!inline, 'Skriptblock in der HTML gefunden');
  var code = inline[0].replace(/^<script>/, '').replace(/<\/script>$/, '');
  var fehler = null;
  try {
    (new Function('window', 'document', 'with (window) { ' + code + ' }'))(win, d.document);
  } catch (e) { fehler = e; }
  ok(!fehler, 'Oberflaeche laeuft ohne Fehler an' + (fehler ? ' — ' + fehler.message : ''));
  if (fehler) { return { N: N, FAIL: FAIL }; }

  /* 4) Statusanzeige */
  var kv = d.byId.statusKV.inhalt();
  ok(/Werkstoffe/.test(kv) && />11</.test(kv), 'Status zeigt 11 Werkstoffe');
  ok(/Auswahlgruppen/.test(kv), 'Status zeigt die Zahl der Auswahlgruppen');
  ok(/Eingabefelder/.test(kv), 'Status zeigt die Zahl der Eingabefelder');
  ok(/i18n/.test(kv), 'Status zeigt die Zahl der i18n-Schluessel');
  ok(d.byId.statusBanner.classList.contains('ok'), 'Statusbanner meldet "vollstaendig geladen"');
  ok(d.byId.statusKV.inhalt().indexOf('\u2717') < 0, 'kein Modul fehlt');

  /* 5) Editionsverhalten */
  if (edition === 'test') {
    ok(d.byId.editionBar.hidden === false, 'Testbalken ist sichtbar');
    ok(/Test/i.test(d.byId.editionBar.inhalt()), 'Testbalken traegt den Testversion-Text');
  } else {
    ok(d.byId.editionBar.hidden === true, 'Vollversion zeigt keinen Testbalken');
  }

  /* 6) Aufgebaute Bereiche */
  ok(d.byId.optionenHost.inhalt().length > 200, 'Auswahlgruppen sind aufgebaut');
  ok(/Bemessungswelt/.test(d.byId.optionenHost.inhalt()), 'Gruppe "Bemessungswelt" erscheint');
  ok(/Kehlnaht, doppelseitig/.test(d.byId.optionenHost.inhalt()), 'Optionstexte erscheinen');
  ok(/gap-note/.test(d.byId.lueckenHost.inhalt()), 'ehrliche Luecken werden angezeigt');
  var li = (d.byId.ngHost.inhalt().match(/<li>/g) || []).length;
  ok(li === 10, 'Liste "was NICHT geprueft wird" mit 10 Punkten (ist ' + li + ')');

  /* 6b) Nahtbild-Kern N2 — live vorgerechnet und selbst geprueft */
  var nb = d.byId.nahtHost.inhalt();
  ok(nb.length > 300, 'Nahtbild-Karte ist aufgebaut');
  ok(/Nahtfl\u00e4che Aw/.test(nb), 'DE: Nahtflaeche Aw erscheint');
  ok(/2\.000,0 mm\u00b2/.test(nb), 'A_w des Beispiels wird richtig angezeigt (2.000,0 mm²)');
  ok(/6\.666\.667 mm\u2074/.test(nb), 'I_y des Beispiels wird richtig angezeigt (a·h³/6)');
  ok(/polares Fl\u00e4chenmoment/.test(nb), 'polares Flaechenmoment wird ausgewiesen');
  ok((nb.match(/\u2713/g) || []).length >= 6, 'alle Hand-Anker und Selbstpruefungen zeigen ein Haekchen');
  ok(nb.indexOf('\u2717') < 0, 'kein Hand-Anker und keine Selbstpruefung schlaegt fehl');
  ok(/Offenes Nahtbild/.test(nb), 'offenes Nahtbild: ehrlicher Torsionshinweis erscheint');
  ok(/exakte Rechteckfl\u00e4che/.test(nb), 'gewaehltes Rechenmodell wird benannt');

  /* 6c) Profileingabe N2b — Profil + Kantenauswahl ergeben das Nahtbild */
  var pf = d.byId.profilHost.inhalt();
  ok(pf.length > 300, 'Profilkarte ist aufgebaut');
  ok(/Rechteck-\/Quadrat-Hohlprofil/.test(pf), 'DE: gewaehltes Profil wird benannt');
  ok(/Rundum geschwei\u00dft/.test(pf), 'DE: gewaehlte Kantenauswahl wird benannt');
  ok(/256,0 mm/.test(pf), 'Bruttoumfang 2*(b+h)-8r wird richtig angezeigt (256,0 mm)');
  ok(/306,3 mm/.test(pf), 'geometrischer Umfang mit Eckboegen wird gegenuebergestellt (306,3 mm)');
  ok(/50,3 mm/.test(pf), 'nicht gerechneter Eckbogen wird ausgewiesen (50,3 mm)');
  ok(/1\.024,0 mm\u00b2/.test(pf), 'A_w des Profilbeispiels stimmt (1.024,0 mm²)');
  ok((pf.match(/\u2713/g) || []).length >= 4, 'alle vier Profil-Hand-Anker zeigen ein Haekchen');
  ok(pf.indexOf('\u2717') < 0, 'kein Profil-Hand-Anker schlaegt fehl');
  ok(/Eckradien verk\u00fcrzen/.test(pf), 'DE: Eckradius wird ehrlich erklaert');
  ok(/L\u00fccken in den Ecken/.test(pf), 'DE: Ecklueckenhinweis grenzt sich vom offenen Nahtbild ab');
  ok(/Au\u00dfenma\u00dfe/.test(pf), 'DE: Hinweis auf Aussenmasse erscheint');
  ok(/entf\u00e4llt/.test(pf), 'DE: umlaufende Naht ohne Endkraterabzug wird begruendet');
  ok(/Profil/.test(d.byId.optionenHost.inhalt()), 'Auswahlgruppe "Profil" erscheint in der Optionsliste');
  ok(/Geschwei\u00dfte Kanten/.test(d.byId.optionenHost.inhalt()), 'Auswahlgruppe "Geschweisste Kanten" erscheint');
  ok(/Nur die Flansche|Nur der Steg/.test(d.byId.optionenHost.inhalt()), 'Kantenoptionen des I-Profils erscheinen');

  /* 7) Sprachumschaltung real durchklicken — inkl. Platzhalter-Kontrolle */
  function alleTexte() {
    return d.byId.optionenHost.inhalt() + d.byId.lueckenHost.inhalt() +
           d.byId.ngHost.inhalt() + d.byId.statusKV.inhalt() + d.byId.nahtHost.inhalt() +
           d.byId.profilHost.inhalt() + d.byId.h_profil.inhalt() +
           d.byId.h_luecken.inhalt() + d.byId.h_nichtgeprueft.inhalt() +
           d.byId.h_nahtbild.inhalt() + d.byId.footNote.inhalt();
  }
  ok(!/\[[a-z0-9_.]+\]/.test(alleTexte()), 'DE: kein unuebersetzter Platzhalter');

  function klick(l) {
    for (var k = 0; k < d.langBtns.length; k++) {
      if (d.langBtns[k].getAttribute('data-lang') === l) { d.langBtns[k].click(); return d.langBtns[k]; }
    }
    return null;
  }

  var bEn = klick('en');
  ok(!!bEn && bEn.classList.contains('active'), 'EN-Schalter wird aktiv');
  ok(d.docEl.getAttribute('lang') === 'en', 'Dokumentsprache auf EN gesetzt');
  ok(/Design world/.test(d.byId.optionenHost.inhalt()), 'EN: Gruppentexte uebersetzt');
  ok(/Fillet weld, double-sided/.test(d.byId.optionenHost.inhalt()), 'EN: Optionstexte uebersetzt');
  ok(/Weld area Aw/.test(d.byId.nahtHost.inhalt()), 'EN: Nahtbild-Groessen uebersetzt');
  ok(/Open weld group/.test(d.byId.nahtHost.inhalt()), 'EN: Torsionshinweis uebersetzt');
  ok(/2,000.0 mm\u00b2/.test(d.byId.nahtHost.inhalt()), 'EN: Zahlformat mit Punkt als Dezimaltrenner');
  ok(/Rectangular \/ square hollow section/.test(d.byId.profilHost.inhalt()), 'EN: Profilname uebersetzt');
  ok(/Welded all round/.test(d.byId.profilHost.inhalt()), 'EN: Kantenauswahl uebersetzt');
  ok(/306.3 mm/.test(d.byId.profilHost.inhalt()), 'EN: Umfang mit Eckboegen im englischen Zahlformat');
  ok(/Corner radii shorten/.test(d.byId.profilHost.inhalt()), 'EN: Eckradius-Hinweis uebersetzt');
  ok(!/\[[a-z0-9_.]+\]/.test(alleTexte()), 'EN: kein unuebersetzter Platzhalter');

  var bPt = klick('pt');
  ok(!!bPt && bPt.classList.contains('active'), 'PT-Schalter wird aktiv');
  ok(!bEn.classList.contains('active'), 'EN-Schalter ist wieder inaktiv');
  ok(d.docEl.getAttribute('lang') === 'pt', 'Dokumentsprache auf PT gesetzt');
  ok(/Método de dimensionamento/.test(d.byId.optionenHost.inhalt()), 'PT: Gruppentexte uebersetzt');
  ok(/Solda de filete, bilateral/.test(d.byId.optionenHost.inhalt()), 'PT: Optionstexte uebersetzt');
  ok(/\u00c1rea de solda Aw/.test(d.byId.nahtHost.inhalt()), 'PT: Nahtbild-Groessen uebersetzt');
  ok(/Grupo aberto/.test(d.byId.nahtHost.inhalt()), 'PT: Torsionshinweis uebersetzt');
  ok((d.byId.nahtHost.inhalt().match(/\u2713/g) || []).length >= 6, 'PT: Hand-Anker bleiben gruen');
  ok(/Perfil tubular retangular/.test(d.byId.profilHost.inhalt()), 'PT: Profilname uebersetzt');
  ok(/Soldado em todo o contorno/.test(d.byId.profilHost.inhalt()), 'PT: Kantenauswahl uebersetzt');
  ok((d.byId.profilHost.inhalt().match(/\u2713/g) || []).length >= 4, 'PT: Profil-Hand-Anker bleiben gruen');
  ok(!/\[[a-z0-9_.]+\]/.test(alleTexte()), 'PT: kein unuebersetzter Platzhalter');

  klick('de');
  ok(/Bemessungswelt/.test(d.byId.optionenHost.inhalt()), 'Rueckschaltung auf DE funktioniert');

  /* 8) Theme und Info */
  d.byId.themeBtn.click();
  ok(d.docEl.getAttribute('data-theme') === 'dark', 'Theme schaltet auf dunkel');
  d.byId.themeBtn.click();
  ok(d.docEl.getAttribute('data-theme') === 'light', 'Theme schaltet zurueck auf hell');
  d.byId.infoBtn.click();
  ok(/Dreierwalde/.test(win._letzterAlert || ''), 'Info zeigt das Impressum');

  return { N: N, FAIL: FAIL };
}

module.exports = { lauf: lauf };

if (require.main === module) {
  var r = lauf('full');
  console.log('\n  Smoke Vollversion: ' + r.N + ' Prüfungen · ' + r.FAIL.length + ' Fehler');
  process.exit(r.FAIL.length ? 1 : 0);
}
