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
                  'validate.js', 'naht.js', 'profil.js', 'svglib.js', 'schaubild.js',
                  'solver.js'];
  ok(srcs.join(',') === erwartet.join(','), 'Ladereihenfolge stimmt: ' + srcs.join(' → '));

  /* 2) ALLE Module gemeinsam laden — genau in dieser Reihenfolge */
  var d = baueDom(html);
  var win = { DT_EDITION: edition, alert: function (t) { win._letzterAlert = t; } };
  for (var i = 0; i < srcs.length; i++) {
    var mod = require('./' + srcs[i]);
    var name = { 'i18n_kern.js': 'DTNI18nKern', 'i18n_hilfe.js': 'DTNI18nHilfe',
                 'i18n_kerbfall.js': 'DTNI18nKerb', 'daten.js': 'DTNData',
                 'optionen.js': 'DTNOptions', 'validate.js': 'DTNValidate',
                 'naht.js': 'DTNNaht', 'profil.js': 'DTNProfil',
                 'svglib.js': 'DTNSvgLib', 'schaubild.js': 'DTNSchaubild',
                 'solver.js': 'DTNSolver' }[srcs[i]];
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

  /* 6d) Nahtbild-Grafik N2c — gezeichnet wird, was gerechnet wird */
  var gf = d.byId.grafikHost.inhalt();
  ok(gf.length > 300, 'Grafikkarte ist aufgebaut');
  ok((gf.match(/<svg /g) || []).length === 2, 'zwei Nahtbilder gezeichnet (rundum und nur Flanken)');
  ok(gf.indexOf('<text') < 0 && gf.indexOf('<tspan') < 0, 'KEIN Text im SVG (alles steht in der HTML-Legende)');
  ok((gf.match(/data-code="eckluecke"/g) || []).length === 4, 'die vier Ecklueckenmarken der umlaufenden Naht sind gesetzt');
  var gTeile = gf.split('<svg ');
  ok(gTeile.length === 3 && gTeile[2].indexOf('data-code="eckluecke"') < 0,
     'zweite Zeichnung (nur Flanken) zeigt KEINE Ecklueckenmarke - dort laeuft keine Naht um');
  ok(/stroke-dasharray="5 4"/.test(gf), 'nicht geschweisste Kanten sind gestrichelt gezeichnet');
  ok(/stroke="#3d9ae0"/.test(gf), 'Segmentgruppe Flanke ist eingefaerbt');
  ok(/stroke="#e0a53a"/.test(gf), 'Segmentgruppe Stirnseite ist eingefaerbt');
  ok(/data-code="schwerpunkt"/.test(gf), 'Schwerpunkt ist eingezeichnet');
  ok(/data-code="achsen"/.test(gf), 'y- und z-Achse durch den Schwerpunkt sind eingezeichnet');
  ok(/class="legende"/.test(gf), 'Legende ist aufgebaut');
  ok(/Flanke/.test(gf) && /Stirnseite/.test(gf), 'DE: Segmentgruppen sind in der Legende beschriftet');
  ok(/nicht geschwei\u00dfte Kante/.test(gf), 'DE: nicht geschweisste Kante ist in der Legende erklaert');
  ok(/Schwerpunkt des Nahtbilds/.test(gf), 'DE: Schwerpunkt ist in der Legende erklaert');
  ok(/mm je Bildpunkt/.test(gf), 'DE: Massstab wird ehrlich als mm je Bildpunkt angegeben');
  ok(/nicht ma\u00dfst\u00e4blich/.test(gf), 'DE: symbolische Nahtdarstellung wird ehrlich benannt');

  /* 6e) Spannungen und Nachweis N3 — beide Welten, getrennt gerechnet */
  var sp = d.byId.spannungHost.inhalt();
  ok(sp.length > 800, 'Nachweiskarte ist aufgebaut');
  ok(/100,00 N\/mm\u00b2/.test(sp), 'sigma_x = N/A_w = 100,00 N/mm² wird angezeigt');
  ok((sp.match(/70,71 N\/mm\u00b2/g) || []).length === 2,
     'UMKLAPPEN: sigma_senk UND tau_senk sind je 70,71 N/mm² (Faktor 1/sqrt(2))');
  ok(/141,42 N\/mm\u00b2/.test(sp), 'Vergleichsspannung sqrt(2)*100 = 141,42 N/mm²');
  ok(/435,56 N\/mm\u00b2/.test(sp), 'Widerstand f_u/(beta_w*gamma_M2) = 435,56 N/mm²');
  ok(/32,5 %/.test(sp), 'Ausnutzungsgrad 32,5 % wird angezeigt');
  ok(/Gr\u00fcn/.test(sp), 'DE: Ampel steht auf gruen');
  ok(/y = \u221250,0 mm, z = \u2212100,0 mm/.test(sp), 'maßgebender Punkt wird benannt');
  ok(/\u221a\(\u03c3\u22a5\u00b2 \+ 3\u00b7\(\u03c4\u22a5\u00b2 \+ \u03c4\u2225\u00b2\)\) \u2264 f_u \/ \(\u03b2_w \u00b7 \u03b3_M2\)/.test(sp),
     'die Nachweisgleichung der Welt A steht in der Karte');

  ok(/240 N\/mm\u00b2/.test(sp), 'Welt B: eigener Wert R_e = 240 N/mm² wird uebernommen');
  ok(/1,10/.test(sp), 'Welt B: Sicherheitsbeiwert S = 1,10');
  ok(/0,95/.test(sp), 'Welt B: Nahtguetefaktor nu = 0,95');
  ok(/207,27 N\/mm\u00b2/.test(sp), 'HAND-ANKER Welt B: 0,95*240/1,1 = 207,27 N/mm² (Lehrbuchbeispiel)');
  ok(/48,2 %/.test(sp), 'Welt-B-Ausnutzung 48,2 %');
  ok(/Formelweg/.test(sp), 'DE: der Formelweg wird als KEIN Tabellenwert gekennzeichnet');
  ok(/nie vermischt/.test(sp), 'DE: die Trennung der beiden Welten steht ausdruecklich in der Karte');

  ok(/7,31 mm/.test(sp), 'Auslegung: a_erf = 7,31 mm');
  ok(/8,0 mm/.test(sp), 'Auslegung: aufgerundet auf a8 — beide Zahlen stehen da (2.3)');
  ok(/7,0 mm/.test(sp), 'Auslegung: a_max = 0,7*10 = 7,0 mm wird gegenuebergestellt');
  ok(/91,3 %/.test(sp), 'Auslegung: Ausnutzung mit dem gewaehlten a-Mass');
  ok(/Ganze Millimeter/.test(sp), 'DE: die Rundungsstufe wird benannt');
  ok(/status-banner warn/.test(sp), 'die a_max-Ueberschreitung erscheint als sichtbare Warnung');
  ok(/zu dick/.test(sp), 'DE: die Warnung ist im Klartext lesbar');

  ok((sp.match(/\u2713/g) || []).length >= 5, 'alle fuenf Hand-Anker der Spannungsrechnung zeigen ein Haekchen');
  ok(sp.indexOf('\u2717') < 0, 'kein Hand-Anker der Spannungsrechnung schlaegt fehl');
  ok(/1,2247/.test(sp), 'HAND-ANKER: das Verhaeltnis der Verfahren sqrt(3/2) = 1,2247 steht in der Karte');
  ok(/2,000000/.test(sp), 'HAND-ANKER: a-Verdopplung halbiert die Spannung (Faktor 2,000000)');
  ok(/1,000000/.test(sp), 'HAND-ANKER: Auslegung und Nachweis sind invers (eta = 1,000000)');
  ok(/Nahtebene geklappt/.test(sp), 'DE: das Umklappen der Kehlnaht wird erklaert');
  ok(/OHNE den Faktor 3/.test(sp), 'DE: Welt B rechnet ohne Faktor 3 — ehrlich benannt');
  ok(/AUFgerundet/.test(sp), 'DE: die Aufrundung wird ehrlich gemeldet');

  /* 7) Sprachumschaltung real durchklicken — inkl. Platzhalter-Kontrolle */
  function alleTexte() {
    return d.byId.optionenHost.inhalt() + d.byId.lueckenHost.inhalt() +
           d.byId.ngHost.inhalt() + d.byId.statusKV.inhalt() + d.byId.nahtHost.inhalt() +
           d.byId.profilHost.inhalt() + d.byId.h_profil.inhalt() +
           d.byId.grafikHost.inhalt() + d.byId.h_grafik.inhalt() +
           d.byId.spannungHost.inhalt() + d.byId.h_spannung.inhalt() +
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
  ok(/Side weld/.test(d.byId.grafikHost.inhalt()), 'EN: Segmentgruppen der Legende uebersetzt');
  ok(/edge not welded/.test(d.byId.grafikHost.inhalt()), 'EN: nicht geschweisste Kante uebersetzt');
  ok(d.byId.grafikHost.inhalt().indexOf('<text') < 0, 'EN: weiterhin kein Text im SVG');
  ok(/Directional method/.test(d.byId.spannungHost.inhalt()), 'EN: Nachweisverfahren uebersetzt');
  ok(/Equivalent stress/.test(d.byId.spannungHost.inhalt()), 'EN: Vergleichsspannung uebersetzt');
  ok(/Utilisation/.test(d.byId.spannungHost.inhalt()), 'EN: Ausnutzungsgrad uebersetzt');
  ok(/Green \u2013 sufficient reserve/.test(d.byId.spannungHost.inhalt()), 'EN: Ampeltext uebersetzt');
  ok(/Required throat size/.test(d.byId.spannungHost.inhalt()), 'EN: erforderliches a-Mass uebersetzt');
  ok(/never mixed/.test(d.byId.spannungHost.inhalt()), 'EN: Trennung der Welten uebersetzt');
  ok(/141.42 N\/mm\u00b2/.test(d.byId.spannungHost.inhalt()), 'EN: Spannungen im englischen Zahlformat');
  ok((d.byId.spannungHost.inhalt().match(/\u2713/g) || []).length >= 5, 'EN: Hand-Anker bleiben gruen');
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
  ok(/Cord\u00e3o lateral/.test(d.byId.grafikHost.inhalt()), 'PT: Segmentgruppen der Legende uebersetzt');
  ok(/aresta n\u00e3o soldada/.test(d.byId.grafikHost.inhalt()), 'PT: nicht geschweisste Kante uebersetzt');
  ok(/M\u00e9todo direcional/.test(d.byId.spannungHost.inhalt()), 'PT: Nachweisverfahren uebersetzt');
  ok(/Tens\u00e3o equivalente/.test(d.byId.spannungHost.inhalt()), 'PT: Vergleichsspannung uebersetzt');
  ok(/Grau de utiliza\u00e7\u00e3o/.test(d.byId.spannungHost.inhalt()), 'PT: Ausnutzungsgrad uebersetzt');
  ok(/Verde \u2013 reserva suficiente/.test(d.byId.spannungHost.inhalt()), 'PT: Ampeltext uebersetzt');
  ok(/Garganta necess\u00e1ria/.test(d.byId.spannungHost.inhalt()), 'PT: erforderliches a-Mass uebersetzt');
  ok(/nunca se misturam/.test(d.byId.spannungHost.inhalt()), 'PT: Trennung der Welten uebersetzt');
  ok((d.byId.spannungHost.inhalt().match(/\u2713/g) || []).length >= 5, 'PT: Hand-Anker bleiben gruen');
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
