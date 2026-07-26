/* ============================================================================
 * DT-ProfiSchweissnaht · ui.js  (DTNUi)
 * Baustein N5, Etappe N5a — UI-GRUNDGERUEST.
 *   - Sprachumschaltung DE/EN/PT ueber data-i18n / data-i18n-title / data-i18n-ph
 *   - Theme hell/dunkel · START IMMER DUNKEL (Plan 3.1, bindend)
 *   - aufklappbare Bereiche des Formulargeruests
 *   - "Leeren" leert wirklich alle Felder (Plan 3.1)
 *   - Info-Dialog mit Impressum, Editionsweiche (Testbalken / Lizenzzeile)
 * DOM-nah, aber OHNE JEDE FACHLOGIK: dieses Modul rechnet nichts und kennt
 * weder Werkstoffe noch Nahtbilder. Texte kommen ausschliesslich aus
 * i18n_kern.js, Codes bleiben sprachneutral.
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.DTNUi = api;
  if (root.document) { api.start(root, root.document); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.5.1';
  var ETAPPE = 'N5a';
  var SPRACHEN = ['de', 'en', 'pt'];

  /* Plan 3.1 (bindend): die Oberflaeche startet IMMER im dunklen Design —
     in beiden Editionen gleich. Der Schalter bleibt erhalten. */
  var START_THEME = 'dark';
  var START_SPRACHE = 'de';

  /* Die aufklappbaren Bereiche der spaeteren Eingabeseite (Reihenfolge = Abfragefolge).
     Gefuellt werden sie in N5b (Felder), N5c (Ergebnis) und N5d (Ausfuehrung). */
  var BEREICHE = ['grund', 'werkstoff', 'naht', 'geometrie',
                  'lasten', 'beiwerte', 'zusatz', 'ausfuehrung'];

  /* Nur dieser eine Bereich ist beim Start offen — Handy zuerst. */
  var BEREICH_START_OFFEN = 'grund';

  /* Pflicht-Elemente. Der Harness prueft, dass jede Id in BEIDEN HTMLs steht. */
  var IDS = [
    'editionBar', 'brandMark', 'brandTag', 'licenseLine', 'langSwitch',
    'themeBtn', 'infoBtn', 'presetSel', 'presetLabel', 'assistBtn', 'calcBtn',
    'resetBtn', 'dtLabel', 'saveBtn', 'loadBtn', 'printBtn', 'rtfBtn', 'dtMsg',
    'formHost', 'geruestNote', 'resultHost', 'grafikHost', 'wegHost',
    'infoModal', 'infoEdition', 'infoImpressum', 'infoClose', 'footNote'
  ];

  /* CSS-Klassen, die style.css tragen muss (leer erlaubt, vorhanden Pflicht). */
  var KLASSEN = [
    'app-header', 'brand', 'lang-switch', 'lang-btn', 'icon-btn', 'subbar',
    'actionbar', 'dt-msg', 'app-main', 'card', 'card-head', 'card-body',
    'acc', 'acc-head', 'acc-titel', 'acc-caret', 'acc-body', 'acc-hint',
    'platzhalter', 'feld', 'feld-zeile', 'eigener-wert', 'info-i',
    'tiles', 'tile', 'tile-wert', 'ampel', 'rw-zeile', 'rw-formel',
    'rw-werte', 'rw-haken', 'rw-nachweis', 'modal-overlay', 'modal',
    'status-banner', 'gap-note', 'app-footer'
  ];

  /* Buttons, die in N5a bewusst noch nicht verdrahtet sind: Id -> ehrliche Meldung. */
  var GERUEST_BUTTONS = [
    ['calcBtn', 'uiFolgtN5c'],
    ['assistBtn', 'uiFolgtN8'],
    ['saveBtn', 'uiFolgtN11'],
    ['loadBtn', 'uiFolgtN11'],
    ['printBtn', 'uiFolgtN11'],
    ['rtfBtn', 'uiFolgtN11']
  ];

  /* ------------------------------------------------------------ Werkzeuge */
  function el(doc, x) { return doc && doc.getElementById ? doc.getElementById(x) : null; }

  function alle(doc, sel) {
    if (!doc || !doc.querySelectorAll) return [];
    var r = doc.querySelectorAll(sel);
    return r || [];
  }

  function txt(win, key, lang) {
    var m = win && win.DTNI18nKern;
    return m ? m.t(key, lang) : '[' + key + ']';
  }

  function setzeText(e, s) { if (e) e.textContent = s; }

  function setzeAttr(e, name, s) { if (e && e.setAttribute) e.setAttribute(name, s); }

  function klasse(e, name, an) {
    if (!e || !e.classList) return;
    if (an) e.classList.add(name); else e.classList.remove(name);
  }

  function istSprache(l) {
    for (var i = 0; i < SPRACHEN.length; i++) if (SPRACHEN[i] === l) return true;
    return false;
  }

  /* ================================================================= start */
  function start(win, doc) {
    if (!win || !doc) return null;

    var S = {
      sprache: START_SPRACHE,
      theme: START_THEME,
      offen: {},
      edition: (win.DT_EDITION === 'test') ? 'test' : 'full'
    };

    /* ---------------------------------------------------------- Sprache */
    function uebersetze() {
      var l = S.sprache, i, n, e;

      var lTexte = alle(doc, '[data-i18n]');
      for (i = 0; i < lTexte.length; i++) {
        e = lTexte[i];
        n = e.getAttribute('data-i18n');
        if (n) setzeText(e, txt(win, n, l));
      }
      var lTitel = alle(doc, '[data-i18n-title]');
      for (i = 0; i < lTitel.length; i++) {
        e = lTitel[i];
        n = e.getAttribute('data-i18n-title');
        if (n) setzeAttr(e, 'title', txt(win, n, l));
      }
      var lPh = alle(doc, '[data-i18n-ph]');
      for (i = 0; i < lPh.length; i++) {
        e = lPh[i];
        n = e.getAttribute('data-i18n-ph');
        if (n) { setzeAttr(e, 'placeholder', txt(win, n, l)); e.placeholder = txt(win, n, l); }
      }

      if (doc.documentElement) doc.documentElement.setAttribute('lang', l);
      doc.title = txt(win, 'appName', l) + ' \u2013 ' + txt(win, 'tagline', l);

      var lb = alle(doc, '.lang-btn');
      for (i = 0; i < lb.length; i++) {
        klasse(lb[i], 'active', lb[i].getAttribute('data-lang') === l);
      }

      edition();
      bereicheBeschriften();
      meldung('');
    }

    function setSprache(l) {
      if (!istSprache(l)) return S.sprache;
      S.sprache = l;
      uebersetze();
      return S.sprache;
    }

    /* ------------------------------------------------------------ Theme */
    function setTheme(t) {
      S.theme = (t === 'light') ? 'light' : 'dark';
      if (doc.documentElement) doc.documentElement.setAttribute('data-theme', S.theme);
      var b = el(doc, 'themeBtn');
      if (b) b.textContent = (S.theme === 'dark') ? '\u25D0' : '\u25D1';
      return S.theme;
    }

    function toggleTheme() { return setTheme(S.theme === 'dark' ? 'light' : 'dark'); }

    /* --------------------------------------------------------- Edition */
    function edition() {
      var bar = el(doc, 'editionBar'), lic = el(doc, 'licenseLine'),
          ie = el(doc, 'infoEdition');
      if (S.edition === 'test') {
        if (bar) { bar.hidden = false; bar.textContent = txt(win, 'editionTest', S.sprache); }
        if (lic) { lic.hidden = true; lic.textContent = ''; }
        if (ie) ie.textContent = txt(win, 'editionTest', S.sprache);
      } else {
        if (bar) { bar.hidden = true; bar.textContent = ''; }
        /* Die Lizenzzeile mit dem Namen setzt die Registrierung in N12. */
        if (lic) { lic.hidden = true; lic.textContent = ''; }
        if (ie) ie.textContent = txt(win, 'uiEditionVoll', S.sprache);
      }
      return S.edition;
    }

    /* -------------------------------------------------- Aufklappbereiche */
    function schalte(code, auf) {
      var kopf = el(doc, 'accBtn_' + code),
          korp = el(doc, 'accBody_' + code),
          sec = el(doc, 'acc_' + code);
      if (!kopf || !korp) return false;
      S.offen[code] = !!auf;
      korp.hidden = !auf;
      kopf.setAttribute('aria-expanded', auf ? 'true' : 'false');
      klasse(sec, 'offen', !!auf);
      var c = el(doc, 'accCaret_' + code);
      if (c) c.textContent = auf ? '\u25BE' : '\u25B8';
      return true;
    }

    function istOffen(code) { return !!S.offen[code]; }

    function umschalten(code) { return schalte(code, !S.offen[code]); }

    function bereicheStandard() {
      for (var i = 0; i < BEREICHE.length; i++) {
        schalte(BEREICHE[i], BEREICHE[i] === BEREICH_START_OFFEN);
      }
    }

    /* Die Bereichstitel und -erklaerungen kommen aus dem Woerterbuch. Sie stehen
       zusaetzlich als data-i18n in der HTML — hier wird nur nachgezogen, damit
       ein fehlender Schluessel sofort als [code] sichtbar wird. */
    function bereicheBeschriften() {
      for (var i = 0; i < BEREICHE.length; i++) {
        var c = BEREICHE[i];
        setzeText(el(doc, 'accTitel_' + c), txt(win, 'sec_' + c, S.sprache));
        setzeText(el(doc, 'accHint_' + c), txt(win, 'sec_' + c + '_hint', S.sprache));
      }
    }

    /* ------------------------------------------------------------ Leeren */
    function leeren() {
      var i, e, typ, n = 0;
      var ein = alle(doc, 'input');
      for (i = 0; i < ein.length; i++) {
        e = ein[i];
        typ = (e.getAttribute && e.getAttribute('type')) || 'text';
        if (typ === 'checkbox' || typ === 'radio') { e.checked = false; }
        else { e.value = ''; }
        n++;
      }
      var sel = alle(doc, 'select');
      for (i = 0; i < sel.length; i++) { sel[i].value = ''; sel[i].selectedIndex = 0; n++; }
      var ta = alle(doc, 'textarea');
      for (i = 0; i < ta.length; i++) { ta[i].value = ''; n++; }

      bereicheStandard();
      meldung(txt(win, 'uiGeleert', S.sprache));
      return n;
    }

    /* ----------------------------------------------------------- Meldung */
    function meldung(s) {
      var m = el(doc, 'dtMsg');
      if (m) m.textContent = s || '';
      return s || '';
    }

    /* -------------------------------------------------------- Info-Dialog */
    function infoZeigen(auf) {
      var m = el(doc, 'infoModal');
      if (!m) return false;
      m.hidden = !auf;
      klasse(m, 'offen', !!auf);
      return true;
    }

    /* ------------------------------------------------------ Verdrahtung */
    function verdrahte() {
      var i, b;

      var lb = alle(doc, '.lang-btn');
      for (i = 0; i < lb.length; i++) {
        (function (btn) {
          if (!btn.addEventListener) return;
          btn.addEventListener('click', function () {
            setSprache(btn.getAttribute('data-lang'));
          });
        }(lb[i]));
      }

      b = el(doc, 'themeBtn');
      if (b && b.addEventListener) b.addEventListener('click', function () { toggleTheme(); });

      b = el(doc, 'infoBtn');
      if (b && b.addEventListener) b.addEventListener('click', function () { infoZeigen(true); });
      b = el(doc, 'infoClose');
      if (b && b.addEventListener) b.addEventListener('click', function () { infoZeigen(false); });
      b = el(doc, 'infoModal');
      if (b && b.addEventListener) {
        b.addEventListener('click', function (ev) {
          if (!ev || !ev.target || ev.target === b) infoZeigen(false);
        });
      }

      for (i = 0; i < BEREICHE.length; i++) {
        (function (code) {
          var k = el(doc, 'accBtn_' + code);
          if (k && k.addEventListener) k.addEventListener('click', function () { umschalten(code); });
        }(BEREICHE[i]));
      }

      b = el(doc, 'resetBtn');
      if (b && b.addEventListener) b.addEventListener('click', function () { leeren(); });

      /* Noch nicht verdrahtete Knoepfe melden das ehrlich, statt still nichts zu tun. */
      for (i = 0; i < GERUEST_BUTTONS.length; i++) {
        (function (paar) {
          var k = el(doc, paar[0]);
          if (k && k.addEventListener) {
            k.addEventListener('click', function () { meldung(txt(win, paar[1], S.sprache)); });
          }
        }(GERUEST_BUTTONS[i]));
      }

      b = el(doc, 'presetSel');
      if (b && b.addEventListener) {
        b.addEventListener('change', function () { meldung(txt(win, 'uiFolgtN7', S.sprache)); });
      }
    }

    /* --------------------------------------------------------------- Lauf */
    setTheme(START_THEME);
    bereicheStandard();
    verdrahte();
    uebersetze();

    var sitzung = {
      VERSION: VERSION, ETAPPE: ETAPPE,
      sprache: function () { return S.sprache; },
      setSprache: setSprache,
      theme: function () { return S.theme; },
      setTheme: setTheme,
      toggleTheme: toggleTheme,
      edition: function () { return S.edition; },
      bereiche: function () { return BEREICHE.slice(); },
      istOffen: istOffen,
      schalte: schalte,
      umschalten: umschalten,
      leeren: leeren,
      meldung: meldung,
      infoZeigen: infoZeigen,
      uebersetze: uebersetze
    };
    api.sitzung = sitzung;
    return sitzung;
  }

  var api = {
    NAME: 'ui',
    VERSION: VERSION,
    ETAPPE: ETAPPE,
    SPRACHEN: SPRACHEN,
    START_THEME: START_THEME,
    START_SPRACHE: START_SPRACHE,
    BEREICHE: BEREICHE,
    BEREICH_START_OFFEN: BEREICH_START_OFFEN,
    IDS: IDS,
    KLASSEN: KLASSEN,
    GERUEST_BUTTONS: GERUEST_BUTTONS,
    start: start,
    sitzung: null
  };
  return api;
}));
