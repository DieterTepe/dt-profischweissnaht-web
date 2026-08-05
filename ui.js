/* ============================================================================
 * DT-ProfiSchweissnaht · ui.js  (DTNUi)
 * Baustein N5 — Etappen N5a (Grundgeruest), N5b (Eingabeseite),
 * N5c (Ergebnisseite) und N5d (Ausfuehrung und Dokumentation + Versionszeile).
 *
 * N5a:  Sprachumschaltung DE/EN/PT · Theme (START IMMER DUNKEL, Plan 3.1) ·
 *       aufklappbare Bereiche · Leeren · Info-Dialog · Editionsweiche.
 * N5b:  Das Formular wird AUS DEN MODULEN ERZEUGT, nicht doppelt gepflegt:
 *         - Auswahlgruppen aus DTNOptions (DIE eine Filterfunktion, Plan 3.4)
 *         - Eingabefelder aus DTNValidate (Feldschema, zweistufige Pruefung)
 *         - Laien-ⓘ aus DTNI18nHilfe (Was ist das · Bereich · Empfehlung)
 *       Jedes erzeugte Element traegt eine FESTE Id (Schema unten) — sonst
 *       waere es im DOM-Smoke nicht anklickbar (Regel aus N5a).
 *
 * DOM-nah, aber OHNE JEDE FACHLOGIK: dieses Modul rechnet nichts, kennt weder
 * Werkstoffe noch Nahtbilder und ruft KEIN Rechenmodul auf. Erlaubt sind
 * ausschliesslich die Auswahl-, Feld- und Textquellen (Options/Validate/i18n).
 * Texte kommen nur aus dem Woerterbuch, Codes bleiben sprachneutral.
 *
 * ID-SCHEMA der erzeugten Elemente (der Harness prueft es):
 *   host_<bereich>     Anker in der HTML       row_g_<gruppe>   Zeile Auswahl
 *   lbl_g_<gruppe>     Beschriftung            info_g_<gruppe>  Laien-ⓘ
 *   sel_<gruppe>       das <select>            pf_g_<gruppe>    Pflichtstern
 *   row_f_<feld>       Zeile Eingabefeld       lbl_f_<feld>     Beschriftung
 *   info_f_<feld>      Laien-ⓘ                 fld_<feld>       das <input>
 *   unit_<feld>        Einheit                 pf_f_<feld>      Pflichtstern
 *   ev_<feld>          "eigener Wert"-Haken    evl_<feld>       dessen Label
 *   zus_<code>         Freischalt-Haken        zusl_<code>      dessen Label
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.DTNUi = api;
  if (root.document) { api.start(root, root.document); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.14.0';
  var ETAPPE = 'N10a';
  /* Plan-Version, die zu diesem Stand gehoert. Sie ist die EINZIGE von Hand
     gepflegte Zahl der Versionszeile — alles andere kommt aus den geladenen
     Modulen selbst (Plan 3.6). */
  var PLAN = '2.57';
  var SPRACHEN = ['de', 'en', 'pt'];

  /* Plan 3.1 (bindend): die Oberflaeche startet IMMER im dunklen Design —
     in beiden Editionen gleich. Der Schalter bleibt erhalten. */
  var START_THEME = 'dark';
  var START_SPRACHE = 'de';

  var BEREICHE = ['grund', 'werkstoff', 'naht', 'geometrie',
                  'lasten', 'beiwerte', 'zusatz', 'thermik', 'ausfuehrung'];

  /* Nur dieser eine Bereich ist beim Start offen — Handy zuerst. */
  var BEREICH_START_OFFEN = 'grund';

  /* ------------------------------------------------------------------------
   * ZUORDNUNG — welche Auswahlgruppe und welches Feld erscheint in welchem
   * Bereich. Das ist reine Anordnung, KEINE Fachlogik: die Inhalte selbst
   * (Optionen, Grenzen, Bedingungen) stehen unveraendert in optionen.js und
   * validate.js. Der Harness prueft, dass JEDE der 20 Gruppen und JEDES der
   * 29 Felder hier GENAU EINMAL vorkommt und kein unbekannter Code auftaucht.
   *
   *   leit          Leitauswahl des Bereichs. Nicht-Pflichtfelder erscheinen
   *                 erst, wenn sie getroffen ist (sonst stuende die halbe
   *                 Eingabeseite leer herum — Handy zuerst).
   *   optional_wenn Bedingung im Format aus optionen.js; gilt fuer die Felder
   *                 des Bereichs, die keine eigene Bedingung tragen.
   *   etappe        Bereich wird in dieser Etappe noch NICHT gebaut.
   * --------------------------------------------------------------------- */
  var ZUORDNUNG = [
    { code: 'grund', leit: null,
      gruppen: ['welt', 'rechenrichtung', 'lasteingabe', 'a_rundung'],
      felder: [] },

    { code: 'werkstoff', leit: 'werkstoffgruppe',
      gruppen: ['werkstoffgruppe', 'werkstoff', 'zustand', 'zusatzwerkstoff', 'bw_regelsatz'],
      felder: [] },

    { code: 'naht', leit: 'nahtart',
      gruppen: ['stossart', 'nahtart', 'nachweisverfahren', 'nahtguete',
                'weltb_nahtgruppe', 'lastfall', 'schweissverfahren'],
      felder: ['a', 'z', 'a_steg', 'a_flansch'] },

    { code: 'geometrie', leit: 'profil',
      gruppen: ['profil', 'kanten', 'endkrater'],
      felder: ['b', 'h', 'd', 'tw', 'tf', 'r_ecke', 't1', 't2'] },

    { code: 'lasten', leit: 'lasteingabe',
      gruppen: ['kraftrichtung'],
      felder: ['N', 'Q', 'M', 'T', 'Qy', 'Qz', 'My', 'Mz', 'F', 'e'],
      optional_wenn: { lasteingabe: ['direkt'] } },

    { code: 'beiwerte', leit: 'welt',
      gruppen: [],
      felder: ['gammaM2', 'gammaMw', 'betaW', 'S', 'nu', 'Re'] },

    { code: 'zusatz', leit: null, gruppen: [], felder: [], zusatz: true },

    /* N9b · Waermefuehrung. Erscheint erst, wenn der Bereich oben
       zugeschaltet ist — er ist eine eigene Rechnung neben dem
       Festigkeitsnachweis, kein Teil davon. */
    { code: 'thermik', leit: null, optional_wenn: { thermik_aktiv: [true] },
      gruppen: [],
      felder: ['an_C', 'an_Si', 'an_Mn', 'an_Cr', 'an_Mo', 'an_V', 'an_Cu', 'an_Ni',
               'CET', 'HD', 'd_komb', 'sp_U', 'sp_I', 'sp_v', 'T0',
               't85_min', 't85_max', 'F2', 'F3'] },

    /* N5d: der Block "Ausfuehrung und Dokumentation" (Plan 2.7 / 5.1-1).
       hinweise    = i18n-Codes, die als Hinweiszeile unter dem Block stehen —
                     ehrliche Beschriftung und Ermuedungshinweis, beide OHNE
                     Antippen sichtbar.
       anforderung = die Auswahlen dieses Bereichs erscheinen nach dem Rechnen
                     als Anforderungszeile im Ergebnis (vollstaendig in allen
                     Ausgaben erst mit N11). */
    { code: 'ausfuehrung', leit: null,
      gruppen: ['iso5817', 'exc',
                'sym_grund', 'sym_gegen', 'sym_oberflaeche', 'sym_sicherung', 'sym_lage'],
      felder: [],
      symbol: true,
      anforderung: true,
      hinweise: ['ausf_nicht_rechenwirksam', 'ausf_erm_hinweis'] }
  ];

  /* Die vier zuschaltbaren Zusatzbereiche (Plan 2.6) — Haken hier, Inhalt
     spaeter. Der Rechenkern liest den Haken als "<code>_aktiv" (validate.js). */
  var ZUSATZ = [
    { code: 'ermuedung', label: 'zb_ermuedung', folgt: 'uiFolgtN13' },
    { code: 'thermik',   label: 'zb_thermik',   folgt: 'uiFolgtN9' },
    { code: 'kosten',    label: 'zb_kosten',    folgt: 'uiFolgtN10' },
    { code: 'verzug',    label: 'zb_verzug',    folgt: 'uiFolgtN15' }
  ];

  /* Pflicht-Elemente. Der Harness prueft, dass jede Id in BEIDEN HTMLs steht. */
  var IDS = [
    'editionBar', 'brandMark', 'brandTag', 'licenseLine', 'langSwitch',
    'themeBtn', 'infoBtn', 'presetSel', 'presetLabel', 'assistBtn', 'calcBtn',
    'resetBtn', 'dtLabel', 'saveBtn', 'loadBtn', 'printBtn', 'rtfBtn', 'dtMsg',
    'formHost', 'geruestNote', 'resultHost', 'grafikHost', 'wegHost',
    'infoModal', 'infoEdition', 'infoImpressum', 'infoClose', 'footNote',
    /* N5b */
    'host_grund', 'host_werkstoff', 'host_naht', 'host_geometrie',
    'host_lasten', 'host_beiwerte', 'host_zusatz', 'host_ausfuehrung',
    'pruefBox', 'pruefTitel', 'pruefListe',
    /* N8b */
    'assistModal', 'assistTitel', 'assistFortschritt', 'assistSkizze',
    'assistLegende', 'assistWas', 'assistTippLbl', 'assistTipp', 'assistHost',
    'assistAbbruch', 'assistZurueck', 'assistUeber', 'assistWeiter',
    /* N9b */
    'cardThermik', 'thermikEyebrow', 'thermikHead', 'thermikKopf',
    'thermikWeg', 'thermikHinweise',
    'acc_thermik', 'accBtn_thermik', 'accBody_thermik', 'accTitel_thermik',
    'accHint_thermik', 'accCaret_thermik', 'host_thermik',
    'hilfeModal', 'hilfeTitel', 'hilfeWasLbl', 'hilfeWas', 'hilfeBereichLbl',
    'hilfeBereich', 'hilfeTippLbl', 'hilfeTipp', 'hilfeClose',
    /* N5d */
    'infoVersion', 'infoModule'
  ];

  /* CSS-Klassen, die style.css tragen muss (leer erlaubt, vorhanden Pflicht). */
  var KLASSEN = [
    'app-header', 'brand', 'lang-switch', 'lang-btn', 'icon-btn', 'subbar',
    'actionbar', 'dt-msg', 'app-main', 'card', 'card-head', 'card-body',
    'acc', 'acc-head', 'acc-titel', 'acc-caret', 'acc-body', 'acc-hint',
    'platzhalter', 'feld', 'feld-zeile', 'eigener-wert', 'info-i',
    'tiles', 'tile', 'tile-wert', 'ampel', 'rw-zeile', 'rw-formel',
    'rw-werte', 'rw-haken', 'rw-nachweis', 'modal-overlay', 'modal',
    'status-banner', 'gap-note', 'app-footer',
    /* N5b */
    'feldgruppe', 'feld-label', 'feld-eingabe', 'feld-einheit', 'pflicht',
    'gesperrt', 'fehlerhaft', 'zusatz-haken', 'zusatz-note',
    'pruef-box', 'pruef-ok', 'pruef-fehler', 'pruef-warnung', 'pruef-hinweis',
    'hilfe-abschnitt', 'hilfe-titel',
    /* N5c-1 */
    'tile-k', 'erg-box',
    /* N5c-2 */
    'weg-box', 'grafik-box', 'grafik-svg', 'grafik-legende',
    'legende-eintrag', 'legende-punkt', 'legende-text', 'rw-abschnitt', 'rw-bilanz',
    /* N5d */
    'info-version', 'info-module',
    /* N6b */
    'symbol-box', 'symbol-bild', 'symbol-legende', 'symbol-masse',
    /* N8b */
    'assist-fortschritt', 'assist-skizze', 'assist-legende', 'assist-host',
    'assist-wahl', 'assist-wahl-vorschlag', 'assist-feld', 'assist-einheit',
    'assist-haken', 'assist-folgt', 'assist-actions', 'modal-assist', 'gewaehlt',
    'assist-wahl-bild',
    /* N9b */
    'th-kopf', 'th-weg', 'th-hinweise', 'th-wert', 'th-zeile', 'th-ampel',
    'th-gruen', 'th-rot', 'th-grau', 'anhalt-note'
  ];

  /* Buttons, die bewusst noch nicht verdrahtet sind: Id -> ehrliche Meldung.
     "Berechnen" ist ab N5b verdrahtet — es PRUEFT (Rechnen folgt in N5c). */
  var GERUEST_BUTTONS = [
    /* 'assistBtn' ist seit N8b verdrahtet und steht deshalb NICHT mehr hier. */
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

  function hilfe(win, key, lang, feld) {
    var m = win && win.DTNI18nHilfe;
    return m ? m.h(key, lang, feld) : '';
  }

  function setzeText(e, s) { if (e) e.textContent = s; }

  function setzeAttr(e, name, s) { if (e && e.setAttribute) e.setAttribute(name, s); }

  function klasse(e, name, an) {
    if (!e || !e.classList) return;
    if (an) e.classList.add(name); else e.classList.remove(name);
  }

  function zeige(e, an) { if (e) e.hidden = !an; }

  function istSprache(l) {
    for (var i = 0; i < SPRACHEN.length; i++) if (SPRACHEN[i] === l) return true;
    return false;
  }

  function istLeer(v) { return v === undefined || v === null || v === ''; }

  /* Bedingungsformat aus optionen.js — hier nur zum Ein-/Ausblenden. */
  function bedingungPasst(bed, zustand) {
    if (!bed) return true;
    for (var k in bed) {
      if (!Object.prototype.hasOwnProperty.call(bed, k)) continue;
      var ist = zustand ? zustand[k] : undefined;
      if (istLeer(ist)) return false;
      if (bed[k].indexOf(ist) < 0) return false;
    }
    return true;
  }

  function bereichVon(code) {
    for (var i = 0; i < ZUORDNUNG.length; i++) if (ZUORDNUNG[i].code === code) return ZUORDNUNG[i];
    return null;
  }

  /* ================================================================= start */
  function start(win, doc) {
    if (!win || !doc) return null;

    var Options = win.DTNOptions || null;
    var Valid = win.DTNValidate || null;

    var S = {
      sprache: START_SPRACHE,
      theme: START_THEME,
      offen: {},
      gebaut: false,
      /* N5d: welche Vorschlagsziele hat der Anwender SELBST gesetzt? Solange
         hier nichts steht, gilt der Vorschlag; danach gilt seine Wahl. Genau
         die Bauform des "eigener Wert"-Hakens, nur fuer eine Auswahl. */
      manuell: {},
      edition: (win.DT_EDITION === 'test') ? 'test' : 'full'
    };

    /* --------------------------------------------------------- Erzeugen */
    function neu(tag, klassen, id) {
      var e = doc.createElement(tag);
      if (klassen) e.className = klassen;
      if (id) e.setAttribute('id', id);
      return e;
    }

    /* Beschriftung ueber data-i18n, damit die Sprachumschaltung sie mitnimmt. */
    function beschrifte(e, key) {
      if (!e) return e;
      e.setAttribute('data-i18n', key);
      e.textContent = txt(win, key, S.sprache);
      return e;
    }

    function beschrifteTitel(e, key) {
      if (!e) return e;
      e.setAttribute('data-i18n-title', key);
      e.setAttribute('title', txt(win, key, S.sprache));
      return e;
    }

    /* ------------------------------------------------ Zeile: Auswahlgruppe */
    function baueGruppe(g) {
      var zeile = neu('div', 'feld-zeile', 'row_g_' + g.code);

      var lab = neu('label', 'feld-label', 'lbl_g_' + g.code);
      lab.setAttribute('for', 'sel_' + g.code);
      beschrifte(lab, 'grp_' + g.code);
      zeile.appendChild(lab);

      var stern = neu('span', 'pflicht', 'pf_g_' + g.code);
      stern.textContent = '*';
      beschrifteTitel(stern, 'uiPflicht');
      stern.hidden = !g.pflicht;
      zeile.appendChild(stern);

      var info = neu('button', 'info-i', 'info_g_' + g.code);
      info.setAttribute('type', 'button');
      info.textContent = '\u24D8';
      beschrifteTitel(info, 'uiInfoTitel');
      info.addEventListener('click', function () { hilfeZeigen('grp_' + g.code, 'grp_' + g.code); });
      zeile.appendChild(info);

      var sel = neu('select', 'feld', 'sel_' + g.code);
      sel.addEventListener('change', function () {
        /* N5d: Wer ein Vorschlagsziel selbst anfasst, hat die Wahl getroffen.
           Leert er es wieder, greift der Vorschlag erneut. */
        if (Options && Options.istVorschlagsZiel(g.code)) {
          S.manuell[g.code] = !istLeer(sel.value);
        }
        aktualisiere(); meldung('');
      });
      zeile.appendChild(sel);

      return zeile;
    }

    /* Optionen einer Gruppe neu setzen — ausschliesslich ueber DIE
       Filterfunktion aus optionen.js (Plan 3.4). Der bisherige Wert bleibt,
       wenn er weiterhin waehlbar ist. */
    function fuelleSelect(g, liste, wert) {
      var sel = el(doc, 'sel_' + g.code);
      if (!sel) return 0;
      sel.innerHTML = '';

      var leerOpt = doc.createElement('option');
      leerOpt.setAttribute('value', '');
      beschrifte(leerOpt, 'uiBitteWaehlen');
      sel.appendChild(leerOpt);

      var drin = false, i, o, opt;
      for (i = 0; i < liste.length; i++) {
        o = liste[i];
        opt = doc.createElement('option');
        opt.setAttribute('value', o.code);
        opt.value = o.code;
        /* N6b: zeigt die Option auf einen vorhandenen Text (z. B. den
           Katalognamen sym_*), wird dieser benutzt — sonst steht der Name
           zweimal im Woerterbuch. */
        beschrifte(opt, o.schluessel || ('opt_' + g.code + '_' + o.code));
        sel.appendChild(opt);
        if (o.code === wert) drin = true;
      }
      sel.value = drin ? wert : '';
      return liste.length;
    }

    /* ------------------------------------------------------ Zeile: Feld */
    function baueFeld(f) {
      var zeile = neu('div', 'feld-zeile', 'row_f_' + f.code);

      var lab = neu('label', 'feld-label', 'lbl_f_' + f.code);
      lab.setAttribute('for', 'fld_' + f.code);
      beschrifte(lab, f.label || ('fld_' + f.code));
      zeile.appendChild(lab);

      var stern = neu('span', 'pflicht', 'pf_f_' + f.code);
      stern.textContent = '*';
      beschrifteTitel(stern, 'uiPflicht');
      stern.hidden = true;
      zeile.appendChild(stern);

      var info = neu('button', 'info-i', 'info_f_' + f.code);
      info.setAttribute('type', 'button');
      info.textContent = '\u24D8';
      beschrifteTitel(info, 'uiInfoTitel');
      info.addEventListener('click', function () {
        hilfeZeigen(f.hilfe || ('fld_' + f.code), f.label || ('fld_' + f.code));
      });
      zeile.appendChild(info);

      var box = neu('span', 'feld-eingabe', null);

      var inp = neu('input', 'feld', 'fld_' + f.code);
      inp.setAttribute('type', 'text');
      inp.setAttribute('inputmode', 'decimal');
      inp.addEventListener('change', function () {
        meldung('');
        /* N6b: das a-Mass steht am Symbol — aendert sich das Feld, muss die
           Bemassung mit. Nur das Symbol wird neu gezeichnet, nicht das ganze
           Formular: Felder sollen beim Tippen nichts umbauen. */
        symbolZeigen(zustand());
      });
      box.appendChild(inp);

      if (f.einheit) {
        var ein = neu('span', 'feld-einheit', 'unit_' + f.code);
        beschrifte(ein, f.einheit);
        box.appendChild(ein);
      }
      zeile.appendChild(box);

      /* ANHALTSWERT STATT TABELLENWERT (N9d): Er sieht sichtbar anders aus,
         weil er es ist — Erfahrung statt Norm. Ein Erfahrungswert, der wie
         eine Vorschrift aussieht, waere eine stille Behauptung. */
      if (f.anhalt) {
        var ah = neu('div', 'gap-note anhalt-note', 'anh_' + f.code);
        beschrifte(ah, 'uiAnhaltswert');
        zeile.appendChild(ah);
      }

      /* "eigener Wert"-Haken (Plan 3.1): Tabellenwert vorbelegen und sperren,
         per Haken frei ueberschreibbar. */
      if (f.ueberschreibbar) {
        var evl = neu('label', 'eigener-wert', 'evl_' + f.code);
        var ev = neu('input', null, 'ev_' + f.code);
        ev.setAttribute('type', 'checkbox');
        ev.addEventListener('change', function () {
          eigenerWert(f.code, !!ev.checked);
          meldung('');
        });
        evl.appendChild(ev);
        var evt = neu('span', null, null);
        beschrifte(evt, 'uiEigenerWert');
        evl.appendChild(evt);
        zeile.appendChild(evl);
      }

      return zeile;
    }

    /* Sperren bzw. freigeben. Gesperrte Felder tragen den Standardwert aus
       dem Feldschema; Werte, die aus einer Tabelle stammen, bleiben leer und
       werden erst vom Rechenkern gesetzt (N5c) — ui.js kennt sie nicht. */
    function eigenerWert(code, an) {
      var inp = el(doc, 'fld_' + code);
      if (!inp) return false;
      var f = Valid ? Valid.feld(code) : null;
      if (an) {
        if (inp.removeAttribute) inp.removeAttribute('readonly');
        inp.readOnly = false;
        klasse(inp, 'gesperrt', false);
      } else {
        inp.setAttribute('readonly', 'readonly');
        inp.readOnly = true;
        klasse(inp, 'gesperrt', true);
        inp.value = (f && typeof f.standard !== 'undefined') ? String(f.standard) : '';
      }
      return true;
    }

    /* ------------------------------------------------------ Zusatzbereiche */
    /* DIE HAKEN UEBERLEBEN DAS AUFFRISCHEN (N9c).
       Vorher baute diese Funktion die Kaestchen bei JEDEM aktualisiere()
       neu — und immer leer. Wer die Waermefuehrung anhakte und danach
       irgendeine Auswahl aenderte, verlor den Haken wieder, ohne dass es
       jemand sagte. Der Stand wird deshalb aus dem Zustand uebernommen,
       der VOR dem Neubau gelesen wurde. */
    function baueZusatz(host, stand) {
      stand = stand || {};
      for (var i = 0; i < ZUSATZ.length; i++) {
        (function (z) {
          var lab = neu('label', 'zusatz-haken', 'zusl_' + z.code);
          var box = neu('input', null, 'zus_' + z.code);
          box.setAttribute('type', 'checkbox');
          box.checked = (stand[z.code + '_aktiv'] === true);
          lab.appendChild(box);
          var t = neu('span', null, null);
          beschrifte(t, z.label);
          lab.appendChild(t);
          host.appendChild(lab);

          var note = neu('div', 'zusatz-note', 'zusn_' + z.code);
          beschrifte(note, z.folgt);
          note.hidden = !box.checked;
          host.appendChild(note);

          box.addEventListener('change', function () {
            note.hidden = !box.checked;
            meldung('');
          });
        }(ZUSATZ[i]));
      }
    }

    /* ------------------------------------------------------- Formularbau */
    function baueFormular() {
      if (!Options || !Valid) return false;
      var i, j, b, host, g, f;

      for (i = 0; i < ZUORDNUNG.length; i++) {
        b = ZUORDNUNG[i];
        host = el(doc, 'host_' + b.code);
        if (!host) continue;
        host.innerHTML = '';

        if (b.etappe) {                      /* noch nicht dran — ehrlich sagen */
          var p = neu('div', 'platzhalter', null);
          beschrifte(p, b.folgt);
          host.appendChild(p);
          continue;
        }

        if (b.zusatz) { baueZusatz(host); continue; }

        for (j = 0; j < b.gruppen.length; j++) {
          g = Options.gruppe(b.gruppen[j]);
          if (!g) continue;
          host.appendChild(baueGruppe(g));
          /* N5d: Ein vorgeschlagener Wert sagt, WOHER er kommt — sonst waere
             er ein stiller Wert. Die Zeile steht direkt unter der Auswahl. */
          if (Options.istVorschlagsZiel(g.code)) {
            var hk = neu('div', 'gap-note', 'herk_' + g.code);
            hk.hidden = true;
            host.appendChild(hk);
          }
        }
        for (j = 0; j < b.felder.length; j++) {
          f = Valid.feld(b.felder[j]);
          if (f) host.appendChild(baueFeld(f));
        }
        /* N6b: der Kasten fuer das Zeichnungssymbol. Er steht im Block und
           nicht im Ergebnis, weil man beim Waehlen sehen will, was man waehlt. */
        if (b.symbol) {
          var sk = neu('div', 'symbol-box', 'symBox');
          sk.hidden = true;
          sk.appendChild(neu('div', 'symbol-bild', 'symBild'));
          sk.appendChild(neu('ul', 'symbol-legende', 'symLegende'));
          sk.appendChild(neu('div', 'symbol-masse', 'symMasse'));
          sk.appendChild(neu('div', 'gap-note', 'symHinweis'));
          host.appendChild(sk);
        }

        /* N5d: ehrliche Beschriftung und Ermuedungshinweis — ohne Antippen. */
        for (j = 0; j < (b.hinweise || []).length; j++) {
          var hw = neu('div', 'gap-note', 'hinw_' + b.code + '_' + j);
          beschrifte(hw, b.hinweise[j]);
          host.appendChild(hw);
        }
      }

      S.gebaut = true;
      return true;
    }

    /* --------------------------------------------------------- Zustand */
    /* Der Zustand ist das, was die Auswahlgruppen sagen — mehr nicht.
       Die Zusatzbereiche kommen als "<code>_aktiv" dazu (validate.js liest sie). */
    function zustand() {
      var z = {}, i, sel, g;
      if (!Options) return z;
      for (i = 0; i < Options.GRUPPEN.length; i++) {
        g = Options.GRUPPEN[i];
        sel = el(doc, 'sel_' + g.code);
        if (sel && !istLeer(sel.value)) z[g.code] = sel.value;
      }
      for (i = 0; i < ZUSATZ.length; i++) {
        var box = el(doc, 'zus_' + ZUSATZ[i].code);
        if (box && box.checked) z[ZUSATZ[i].code + '_aktiv'] = true;
      }
      return z;
    }

    function werte() {
      var w = {}, i, inp;
      if (!Valid) return w;
      for (i = 0; i < Valid.SCHEMA.length; i++) {
        inp = el(doc, 'fld_' + Valid.SCHEMA[i].code);
        if (inp && !istLeer(inp.value)) w[Valid.SCHEMA[i].code] = inp.value;
      }
      return w;
    }

    /* Sichtbarkeitsregel fuer Felder — dokumentiert, eine einzige Regel:
       1. Pflicht im aktuellen Zustand  -> sichtbar
       2. Bereich hat optional_wenn     -> nur wenn die Bedingung passt
       3. Bereich hat eine Leitauswahl  -> nur wenn sie getroffen ist
       4. sonst                          -> sichtbar */
    function feldSichtbar(f, b, z) {
      if (Valid && Valid.istPflicht(f, z)) return true;
      if (b && b.optional_wenn) return bedingungPasst(b.optional_wenn, z);
      if (b && b.leit) return !istLeer(z[b.leit]);
      return true;
    }

    /* Eine Aenderung oben raeumt unten auf (strenge Regel aus dem N1-Log:
       eine nicht mehr begruendbare Auswahl faellt weg) und blendet die
       unpassenden Optionen sofort aus (Plan 3.4). */
    /* Die strenge Bereinigung aus optionen.js entfernt jede Auswahl, deren
       Bedingung nicht STRIKT erfuellt ist — auch die, deren Bezugswert noch
       gar nicht gewaehlt wurde. Am Bildschirm waere das falsch: die Option
       wurde nach der milden Regel angeboten (N1-Log), der Anwender hat sie
       angetippt, und sie duerfte ihm nicht unter der Hand wieder verschwinden.
       Deshalb wird eine so entfernte Auswahl zurueckgeholt, solange die milde
       Regel sie weiterhin anbietet. Eine wirklich unpassende Auswahl (die
       milde Regel kennt sie nicht mehr) bleibt entfernt — das ist der Fall,
       den die strenge Regel treffen soll. */
    /* Auf welche anderen Auswahlen stuetzt sich diese Gruppe bzw. dieser Wert? */
    function bezugsschluessel(gruppenCode, wert) {
      var keys = {}, gr = Options.gruppe(gruppenCode), i, k;
      if (!gr) return keys;
      function sammle(bed) {
        if (!bed) return;
        for (k in bed) if (Object.prototype.hasOwnProperty.call(bed, k)) keys[k] = 1;
      }
      sammle(gr.gilt_wenn); sammle(gr.gilt_nicht_wenn);
      for (i = 0; i < gr.optionen.length; i++) {
        if (gr.optionen[i].code !== wert) continue;
        sammle(gr.optionen[i].gilt_wenn); sammle(gr.optionen[i].gilt_nicht_wenn);
      }
      return keys;
    }

    function bereinigeSchonend(roh) {
      if (!Options) return roh;
      var z = Options.bereinige(roh), runde = 0, geaendert = true, i, g, w, keys, k, halt;
      while (geaendert && runde < 10) {
        geaendert = false; runde++;
        for (i = 0; i < Options.GRUPPEN.length; i++) {
          g = Options.GRUPPEN[i].code;
          w = roh[g];
          if (istLeer(w) || !istLeer(z[g])) continue;

          /* Nur zurueckholen, wenn kein Bezugswert GERADE weggefallen ist.
             Fiel oben etwas weg, ist auch das Darunterliegende nicht mehr
             begruendbar — dann gilt die strenge Regel. */
          keys = bezugsschluessel(g, w); halt = false;
          for (k in keys) {
            if (!Object.prototype.hasOwnProperty.call(keys, k)) continue;
            if (!istLeer(roh[k]) && istLeer(z[k])) { halt = true; break; }
          }
          if (halt) continue;

          if (!Options.gruppeAktiv(g, z)) continue;
          if (Options.codes(g, z).indexOf(w) < 0) continue;
          z[g] = w; geaendert = true;
        }
      }
      return z;
    }

    function aktualisiere() {
      if (!S.gebaut || !Options || !Valid) return null;
      var i, j, b, g, f, sel, roh = zustand();
      var z = bereinigeSchonend(roh);

      for (i = 0; i < Options.GRUPPEN.length; i++) {
        g = Options.GRUPPEN[i];
        sel = el(doc, 'sel_' + g.code);
        if (!sel) continue;
        var aktiv = Options.gruppeAktiv(g.code, z);
        zeige(el(doc, 'row_g_' + g.code), aktiv);
        if (aktiv) fuelleSelect(g, Options.filter(g.code, z), z[g.code]);
        else if (!istLeer(sel.value)) { sel.value = ''; }
        klasse(el(doc, 'row_g_' + g.code), 'fehlerhaft', false);
      }

      for (i = 0; i < ZUORDNUNG.length; i++) {
        b = ZUORDNUNG[i];
        if (b.etappe) continue;
        for (j = 0; j < b.felder.length; j++) {
          f = Valid.feld(b.felder[j]);
          if (!f) continue;
          zeige(el(doc, 'row_f_' + f.code), feldSichtbar(f, b, z));
          zeige(el(doc, 'pf_f_' + f.code), Valid.istPflicht(f, z));
          klasse(el(doc, 'row_f_' + f.code), 'fehlerhaft', false);
        }
      }
      vorschlaegeAnwenden(z);
      symbolZeigen(z);

      /* EIN BEREICH OHNE EINEN EINZIGEN SICHTBAREN INHALT WIRD AUSGEBLENDET
         (N9c). Vorher stand die Waermefuehrung als offener Kasten mit
         Erklaerung, aber ohne ein Feld da — auch wenn sie gar nicht
         zugeschaltet war. Das sah aus wie ein leerer Bereich statt wie ein
         nicht gewaehlter. Aufgefallen an Dieters Bildschirmfoto. */
      for (i = 0; i < ZUORDNUNG.length; i++) {
        b = ZUORDNUNG[i];
        if (b.zusatz) continue;                 /* traegt die Haken selbst */
        var kasten = el(doc, 'acc_' + b.code);
        if (!kasten) continue;
        var inhalt = 0;
        for (j = 0; j < b.gruppen.length; j++) {
          if (Options.gruppeAktiv(b.gruppen[j], z)) inhalt++;
        }
        for (j = 0; j < b.felder.length; j++) {
          f = Valid.feld(b.felder[j]);
          if (f && feldSichtbar(f, b, z)) inhalt++;
        }
        if (b.symbol || b.anforderung) inhalt++;  /* diese tragen eigenen Inhalt */
        zeige(kasten, inhalt > 0);
      }

      beispieleFuellen();   /* Plan 3.2: die Liste folgt der Auswahl */
      return z;
    }

    /* ------------------------------------------------------------------
     * N6b — DAS ZEICHNUNGSSYMBOL (Plan 5.1-2 / 4.11)
     * ui.js waehlt nur aus und ordnet an. WAS gezeichnet wird, wie es
     * aussieht und was daran nicht nachweisbar ist, weiss allein das
     * Symbolmodul. Hier steht kein einziger Symbolcode.
     * ---------------------------------------------------------------- */
    function symbolZeigen(z) {
      var kasten = el(doc, 'symBox');
      if (!kasten) return null;
      var Symb = win.DTNSymbol || null;
      if (!Symb || istLeer(z.sym_grund)) { zeige(kasten, false); return null; }

      /* Die Bemassung kommt aus den EINGEGEBENEN Werten, nicht aus dem Nichts:
         dieselbe Nahtdicke, mit der auch gerechnet wird. Welches Kuerzel dazu
         passt, entscheidet das Symbol. */
      var masse = {}, dicke = wertVon('a');
      if (dicke !== null) {
        if (Symb.hatMass(z.sym_grund, 'a')) masse.a = dicke;
        else if (Symb.hatMass(z.sym_grund, 's')) masse.s = dicke;
      }

      var zus = [];
      if (!istLeer(z.sym_oberflaeche)) zus.push(z.sym_oberflaeche);
      if (!istLeer(z.sym_sicherung)) zus.push(z.sym_sicherung);

      var erg = Symb.zeichne({
        grund: z.sym_grund,
        gegenseite: istLeer(z.sym_gegen) ? null : z.sym_gegen,
        zusatz: zus,
        rundum: (z.sym_lage === 'rundum' || z.sym_lage === 'rundum_baustelle'),
        baustelle: (z.sym_lage === 'baustelle' || z.sym_lage === 'rundum_baustelle'),
        gabel: !istLeer(z.verfahren),
        masse: masse
      }, win.DTNSvgLib);

      var bild = el(doc, 'symBild');
      if (bild) bild.innerHTML = erg.ok ? erg.svg : '';
      zeige(kasten, true);

      /* Legende: jede Linie und jedes Zeichen wird benannt. */
      var liste = el(doc, 'symLegende'), i, li;
      if (liste) {
        liste.innerHTML = '';
        for (i = 0; i < erg.legende.length; i++) {
          li = neu('li', 'legende-eintrag', 'symLeg_' + i);
          setzeText(li, txt(win, erg.legende[i].code, S.sprache));
          liste.appendChild(li);
        }
      }

      /* Bemassung: die Zahlen stehen HIER, nicht im Bild (4.3). */
      var mk = el(doc, 'symMasse');
      if (mk) {
        mk.innerHTML = '';
        for (i = 0; i < erg.bemassung.length; i++) {
          var mz = neu('div', 'legende-text', 'symMass_' + i);
          setzeText(mz, txt(win, erg.bemassung[i].code, S.sprache) + ': ' + erg.bemassung[i].wert);
          mk.appendChild(mz);
        }
      }

      /* Hinweise und Warnungen des Moduls — ungefiltert. */
      var hk = el(doc, 'symHinweis');
      if (hk) {
        var t = [];
        for (i = 0; i < erg.hinweise.length; i++) t.push(txt(win, erg.hinweise[i], S.sprache));
        for (i = 0; i < erg.warnungen.length; i++) t.push(txt(win, erg.warnungen[i], S.sprache));
        if (!erg.ok && erg.fehler) t.push(txt(win, erg.fehler, S.sprache));
        setzeText(hk, t.join(' '));
        zeige(hk, t.length > 0);
      }
      S.letztesSymbol = erg;
      return erg;
    }

    /* Zahl aus einem Eingabefeld, oder null. */
    function wertVon(code) {
      var f = el(doc, 'fld_' + code);
      if (!f || istLeer(f.value)) return null;
      var w = parseFloat(String(f.value).replace(',', '.'));
      return (isFinite(w) && w > 0) ? w : null;
    }

    /* ------------------------------------------------------------------
     * N5d — VORSCHLAG STATT ZWANG (Plan 5.1-1)
     * Welche Auswahl welche andere vorschlaegt, weiss ALLEIN optionen.js.
     * Hier steht nur: nachfragen, eintragen, Herkunft anschreiben — und
     * die Wahl des Anwenders nicht ueberfahren.
     * ---------------------------------------------------------------- */
    function vorschlaegeAnwenden(z) {
      if (!Options || !Options.VORSCHLAEGE) return z;
      for (var i = 0; i < Options.VORSCHLAEGE.length; i++) {
        var ziel = Options.VORSCHLAEGE[i].ziel;
        var sel = el(doc, 'sel_' + ziel);
        var note = el(doc, 'herk_' + ziel);
        if (!sel) continue;
        var v = Options.vorschlag(ziel, z);

        if (S.manuell[ziel] && !istLeer(sel.value)) {
          if (note) { beschrifte(note, 'ausf_eigene_wahl'); zeige(note, !!v); }
          continue;
        }
        S.manuell[ziel] = false;
        if (v) {
          if (sel.value !== v.wert) sel.value = v.wert;
          z[ziel] = v.wert;
          if (note) { beschrifte(note, v.hinweis); zeige(note, true); }
        } else if (note) {
          zeige(note, false);
        }
      }
      return z;
    }

    /* Die Anforderungszeile: was in den Ausgaben steht, ohne dass es in die
       Rechnung eingeht. Reine Anordnung — die Texte kommen aus dem
       Woerterbuch, die Codes aus der ZUORDNUNG. */
    function anforderungText() {
      if (!Options) return '';
      var z = zustand(), teile = [], i, j, b, code, wert;
      for (i = 0; i < ZUORDNUNG.length; i++) {
        b = ZUORDNUNG[i];
        if (!b.anforderung) continue;
        for (j = 0; j < b.gruppen.length; j++) {
          code = b.gruppen[j];
          wert = z[code];
          if (istLeer(wert)) continue;
          teile.push(txt(win, 'grp_' + code, S.sprache) + ' ' +
                     txt(win, 'opt_' + code + '_' + wert, S.sprache));
        }
      }
      return teile.join(' \u00b7 ');
    }

    /* Standardwerte in die gesperrten Felder — der Zustand direkt nach dem
       Oeffnen der Seite. "Leeren" stellt exakt diesen Zustand wieder her. */
    function vorbelegen() {
      if (!Valid) return 0;
      var n = 0;
      for (var i = 0; i < Valid.SCHEMA.length; i++) {
        var f = Valid.SCHEMA[i];
        if (!f.ueberschreibbar) continue;
        var ev = el(doc, 'ev_' + f.code);
        if (ev) ev.checked = false;
        eigenerWert(f.code, false);
        n++;
      }
      return n;
    }

    /* ------------------------------------------------------- Beispiele */
    /* N5c-1, Plan 5.1. Die Daten stehen in optionen.js — ui.js kennt weder
       Werkstoffe noch Profile, es traegt nur ein, was dort steht. */
    /* KONTEXTBEZOGEN seit N7 (Plan 3.2): gezeigt wird, was zur getroffenen
       Auswahl passt. WELCHE Merkmale das sind, weiss allein optionen.js —
       ui.js reicht nur den Zustand hin und traegt ein, was zurueckkommt.
       Passt nichts, liefert optionen.js alle zurueck; eine leere Liste
       gibt es nie (Sackgassenverbot, Plan 3.4).
       Das GELADENE Beispiel bleibt immer in der Liste, auch wenn der
       Anwender die Auswahl inzwischen weggedreht hat — sonst stuende der
       Kasten auf "waehlen", waehrend die Felder voll sind. */
    function beispieleFuellen() {
      var sel = el(doc, 'presetSel');
      if (!sel || !Options || !Options.BEISPIELE) return 0;
      var vorher = sel.value;
      sel.innerHTML = '';

      var leerOpt = doc.createElement('option');
      leerOpt.setAttribute('value', '');
      beschrifte(leerOpt, 'bspWaehlen');
      sel.appendChild(leerOpt);

      var liste = Options.beispieleFuer ? Options.beispieleFuer(zustand())
                                        : Options.BEISPIELE;
      var i, b, drin = false;
      for (i = 0; i < liste.length; i++) if (liste[i].code === vorher) drin = true;
      if (vorher && !drin) {
        b = Options.beispiel(vorher);
        if (b) { liste = liste.slice(0); liste.push(b); }
      }

      for (i = 0; i < liste.length; i++) {
        b = liste[i];
        var opt = doc.createElement('option');
        opt.setAttribute('value', b.code);
        opt.value = b.code;
        beschrifte(opt, b.name);
        sel.appendChild(opt);
      }
      sel.value = vorher || '';
      return liste.length;
    }

    /* Plan 3.5, sinngemaess: ERST ALLES LEEREN, DANN LADEN — nie duerfen
       Reste einer frueheren Eingabe in einer neuen Rechnung stehenbleiben. */
    /* EIN WEG, IN DAS FORMULAR ZU SCHREIBEN (seit N8b geteilt).
       Beispielkatalog und Assistent benutzen dieselbe Funktion. Zwei
       Schreibwege waeren zwei Gelegenheiten, verschieden zu schreiben — und
       genau daran haengt, dass Formular und Assistent dasselbe ergeben. */
    function formularSetzen(auswahl, werte) {
      if (!Options || !Valid) return false;
      var i, g, sel, k, f, ev, inp;

      /* DIE FREISCHALT-HAKEN ZUERST (N9c). Sie stehen im Zustand, sind aber
         KEINE Auswahlgruppen — die Schleife unten wuerde sie schlicht
         uebergehen. Genau das ist passiert: das Beispiel winkel_v brachte
         `thermik_aktiv: true` mit, der Haken blieb leer und der Bereich
         blieb ohne Felder. Und sie muessen VOR den Gruppen gesetzt werden,
         weil davon abhaengt, welche Felder ueberhaupt Pflicht sind. */
      for (i = 0; i < (Options.ZUSATZBEREICHE || []).length; i++) {
        var zc = Options.ZUSATZBEREICHE[i].code;
        if (!auswahl || !Object.prototype.hasOwnProperty.call(auswahl, zc + '_aktiv')) continue;
        var zb = el(doc, 'zus_' + zc);
        if (zb) zb.checked = (auswahl[zc + '_aktiv'] === true);
      }

      /* Die Gruppen in ihrer eigenen Reihenfolge setzen: sie ist zugleich die
         Abhaengigkeitsreihenfolge (erst stossart, dann nahtart …). Nach jeder
         Auswahl neu filtern, sonst gaebe es die naechste Option noch nicht. */
      for (i = 0; i < Options.GRUPPEN.length; i++) {
        g = Options.GRUPPEN[i].code;
        if (!auswahl || !Object.prototype.hasOwnProperty.call(auswahl, g)) continue;
        sel = el(doc, 'sel_' + g);
        if (!sel) continue;
        sel.value = auswahl[g];
        aktualisiere();
      }

      /* Felder eintragen. Ein ueberschreibbarer Wert (z. B. der Eckradius)
         ist gesperrt vorbelegt — dafuer wird der "eigener Wert"-Haken
         mitgesetzt, sonst faende der Anwender seinen Wert gleich wieder
         ueberschrieben. */
      for (k in (werte || {})) {
        if (!Object.prototype.hasOwnProperty.call(werte, k)) continue;
        f = Valid.feld(k);
        if (f) {
          if (f.ueberschreibbar) {
            ev = el(doc, 'ev_' + k);
            if (ev) ev.checked = true;
            eigenerWert(k, true);
          }
          inp = el(doc, 'fld_' + k);
          if (inp) inp.value = String(werte[k]);
        } else if (/_aktiv$/.test(k)) {
          /* Die Freischalt-Haken der Zusatzbereiche (Plan 2.6). */
          ev = el(doc, 'zus_' + k.replace(/_aktiv$/, ''));
          if (ev) ev.checked = werte[k] === true;
        }
      }

      aktualisiere();
      return true;
    }

    function beispielLaden(code) {
      if (!Options || !Valid) return null;
      var b = Options.beispiel(code);
      if (!b) return null;

      leeren();
      formularSetzen(b.auswahl, b.felder);
      var sel = el(doc, 'presetSel');
      if (sel) sel.value = code;
      meldung(txt(win, 'uiBeispiel', S.sprache) + ' ' + txt(win, b.name, S.sprache));
      return code;
    }

    /* ==================================================================== */
    /* N8b · ASSISTENT — Overlay ueber der DOM-freien Logik aus N8a          */
    /*                                                                       */
    /* HIER WIRD NICHT GEFUEHRT UND NICHT GERECHNET. Welcher Schritt kommt,  */
    /* welche Optionen es gibt und was noch fehlt, sagt assistent.js. Was    */
    /* gezeichnet wird, sagen skizze.js, schaubild.js und symbol.js. Diese   */
    /* Schicht malt nur hin, was sie bekommt, und gibt Antippen zurueck.     */
    /*                                                                       */
    /* AM ENDE (N8c) schreibt der Assistent ueber formularSetzen() in        */
    /* DIESELBEN Felder wie die Handeingabe und drueckt DENSELBEN Rechenweg  */
    /* an — es gibt keinen zweiten Rechenpfad (Plan 3.3).                    */
    /* ==================================================================== */

    function assiModul() { return win.DTNAssistent || null; }

    /* Platzhalter {0}, {1} … in einem uebersetzten Text ersetzen. Bewusst
       hier und nicht im Woerterbuch: die Texte bleiben so lesbar und
       uebersetzbar, ohne dass i18n_kern.js Logik bekommt. */
    function fuelle(vorlage, werte) {
      var t = String(vorlage || ''), i;
      for (i = 0; i < (werte || []).length; i++) {
        t = t.split('{' + i + '}').join(String(werte[i]));
      }
      return t;
    }

    function assistOffen() { return !!S.assi; }

    /* Die Skizze zum Schritt. WELCHE Quelle zustaendig ist, sagt der
       Assistent; diese Schicht ruft sie nur auf. Kommt kein Bild zustande,
       bleibt der Kasten leer — lieber nichts als ein falsches Bild. */
    function assistSkizzeZeigen(sch) {
      var box = el(doc, 'assistSkizze'), leg = el(doc, 'assistLegende');
      if (!box) return false;
      box.innerHTML = '';
      if (leg) { setzeText(leg, ''); leg.hidden = true; }
      zeige(box, false);
      if (!sch || !sch.skizze) return false;

      var Svg = win.DTNSvgLib, erg = null, quelle = sch.skizze;
      if (!Svg) return false;

      if (quelle === 'skizze' && win.DTNSkizze) {
        erg = win.DTNSkizze.zeichne(sch.code, sch.wert, Svg);
      } else if (quelle === 'symbol' && win.DTNSymbol) {
        var na = (sch.art === 'auswahl') ? sch.wert : S.assi.auswahl.nahtart;
        if (na) erg = win.DTNSymbol.ausNahtart(na, {}, Svg);
      } else if (quelle === 'schaubild' && win.DTNSchaubild) {
        /* Erst mit den ECHTEN Massen versuchen. Reichen sie noch nicht,
           zeichnet das Mustermass — schematisch, klar benannt, und es
           landet in keinem Feld. */
        var re = Valid.rechenEingabe(S.assi.werte, S.assi.auswahl);
        if (re && re.ok && re.eingabe && re.eingabe.profil_eingabe) {
          erg = win.DTNSchaubild.ausProfil(re.eingabe.profil_eingabe, { sprache: S.sprache });
        }
        if ((!erg || !erg.ok) && win.DTNSkizze) {
          var m = win.DTNSkizze.muster(S.assi.auswahl.profil, S.assi.auswahl.kanten);
          if (m) erg = win.DTNSchaubild.ausProfil(m, { sprache: S.sprache });
        }
      }
      if (!erg || !erg.ok || !erg.svg) return false;

      box.innerHTML = erg.svg;
      zeige(box, true);
      if (leg && erg.legende && erg.legende.length) {
        var teile = [], i;
        for (i = 0; i < erg.legende.length; i++) {
          teile.push(txt(win, erg.legende[i].code || erg.legende[i], S.sprache));
        }
        setzeText(leg, teile.join(' · '));
        leg.hidden = false;
      }
      return true;
    }

    /* DIE SKIZZE ZU EINER EINZELNEN OPTION (N8b).
       Beim Auswaehlen ist noch nichts gewaehlt — eine Skizze ueber der Liste
       koennte also gar nichts zeigen. Deshalb bekommt JEDE Kachel ihr
       eigenes Bild: fuenf Stossarten, sieben Profile, drei Lastfaelle
       nebeneinander. Genau so ist "moeglichst anklickbare Auswahl" aus
       Plan 3.3 gemeint. */
    function assistOptionSkizze(quelle, gruppe, optionCode) {
      var Svg = win.DTNSvgLib, m;
      if (!Svg || !quelle || !optionCode) return null;
      if (quelle === 'skizze' && win.DTNSkizze) {
        return win.DTNSkizze.zeichne(gruppe, optionCode, Svg);
      }
      if (quelle === 'symbol' && win.DTNSymbol && gruppe === 'nahtart') {
        return win.DTNSymbol.ausNahtart(optionCode, {}, Svg);
      }
      if (quelle === 'schaubild' && win.DTNSchaubild && win.DTNSkizze) {
        if (gruppe === 'profil') m = win.DTNSkizze.muster(optionCode, 'rundum');
        else if (gruppe === 'kanten') m = win.DTNSkizze.muster(S.assi.auswahl.profil, optionCode);
        else m = null;
        if (m) return win.DTNSchaubild.ausProfil(m, { sprache: S.sprache });
      }
      return null;
    }

    /* Eine antippbare Auswahlkachel. */
    function assistKachel(host, code, label, gewaehlt, vorschlagText, aufTipp, bild, gruppe) {
      var b = neu('button', 'assist-wahl', null);
      b.setAttribute('type', 'button');
      if (gewaehlt) klasse(b, 'gewaehlt', true);
      if (bild && bild.ok && bild.svg) {
        /* Eigene Kennung, damit das Bild auch von aussen auffindbar ist. */
        var bx = neu('span', 'assist-wahl-bild', 'ass_bild_' + gruppe + '_' + code);
        bx.innerHTML = bild.svg;
        b.appendChild(bx);
      }
      var t = neu('span', null, null);
      setzeText(t, label);
      b.appendChild(t);
      if (vorschlagText) {
        var v = neu('span', 'assist-wahl-vorschlag', null);
        setzeText(v, vorschlagText);
        b.appendChild(v);
      }
      if (b.addEventListener) b.addEventListener('click', function () { aufTipp(code); });
      host.appendChild(b);
      return b;
    }

    function assistZeigen() {
      var A = assiModul();
      if (!A || !S.assi) return false;
      var host = el(doc, 'assistHost');
      var sch = A.schritt(S.assi);
      var l = S.sprache, i;

      if (!sch) return assistFertig();
      if (host) host.innerHTML = '';

      setzeText(el(doc, 'assistTitel'), txt(win, sch.label, l));
      var fs = A.fortschritt(S.assi);
      setzeText(el(doc, 'assistFortschritt'),
                fuelle(txt(win, 'uiAssSchritt', l), [String(fs.schritt + 1), String(fs.von)]));

      /* Laien-Erklaerung und Tipp kommen aus i18n_hilfe.js — dieselbe Quelle
         wie der ⓘ-Knopf im Formular (Plan 3.3, keine zweite Textpflege). */
      var was = hilfe(win, sch.hilfe, l, 'was');
      var tip = hilfe(win, sch.hilfe, l, 'tipp');
      if (!was && sch.freiwillig) was = txt(win, 'uiAssFreiwillig', l);
      setzeText(el(doc, 'assistWas'), was || '');
      setzeText(el(doc, 'assistTipp'), tip || '');
      zeige(el(doc, 'assistTipp'), !!tip);
      zeige(el(doc, 'assistTippLbl'), !!tip);

      /* Die grosse Skizze nur dort, wo es keine Kacheln gibt — sonst
         stuende dasselbe Bild zweimal im Fenster. */
      if (sch.art === 'auswahl') {
        var box0 = el(doc, 'assistSkizze'), leg0 = el(doc, 'assistLegende');
        if (box0) { box0.innerHTML = ''; zeige(box0, false); }
        if (leg0) { setzeText(leg0, ''); leg0.hidden = true; }
      } else {
        assistSkizzeZeigen(sch);
      }

      if (sch.art === 'auswahl') {
        for (i = 0; i < sch.optionen.length; i++) {
          (function (o) {
            var vor = (sch.vorschlag && sch.vorschlag.wert === o.code)
                    ? txt(win, 'uiAssVorschlag', l) : null;
            assistKachel(host, o.code, txt(win, o.label, l), sch.wert === o.code, vor,
                         function (c) { assistWeiter(c); },
                         assistOptionSkizze(sch.skizze, sch.code, o.code), sch.code);
          }(sch.optionen[i]));
        }
      } else if (sch.art === 'felder') {
        for (i = 0; i < sch.felder.length; i++) {
          (function (f) {
            var zeile = neu('div', 'assist-feld', null);
            var lab = neu('label', null, null);
            setzeText(lab, txt(win, f.label, l) + (f.pflicht ? ' *' : ''));
            if (f.pflicht) klasse(lab, 'pflicht', true);
            var inp = neu('input', null, 'ass_f_' + f.code);
            inp.setAttribute('type', 'number');
            if (f.wert !== null) inp.value = String(f.wert);
            else if (f.standard !== null) inp.value = String(f.standard);
            var eh = neu('span', 'assist-einheit', null);
            setzeText(eh, f.einheit ? txt(win, f.einheit, l) : '');
            zeile.appendChild(lab); zeile.appendChild(inp); zeile.appendChild(eh);
            host.appendChild(zeile);
          }(sch.felder[i]));
        }
      } else if (sch.art === 'zusatz') {
        for (i = 0; i < sch.bereiche.length; i++) {
          (function (b) {
            var zeile = neu('label', 'assist-haken', null);
            var box = neu('input', null, 'ass_z_' + b.code);
            box.setAttribute('type', 'checkbox');
            box.checked = b.wert === true;
            var t = neu('span', null, null);
            setzeText(t, txt(win, b.label, l));
            zeile.appendChild(box); zeile.appendChild(t);
            /* EHRLICH: was es noch nicht gibt, sagt es selbst. */
            if (b.folgt) {
              var f2 = neu('span', 'assist-folgt', null);
              setzeText(f2, fuelle(txt(win, 'uiAssFolgt', l), [b.folgt]));
              zeile.appendChild(f2);
            }
            host.appendChild(zeile);
          }(sch.bereiche[i]));
        }
      } else if (sch.art === 'symbol') {
        for (i = 0; i < sch.gruppen.length; i++) {
          (function (g) {
            var zeile = neu('div', 'assist-feld', null);
            var lab = neu('label', null, null);
            setzeText(lab, txt(win, g.label, l));
            var sel = neu('select', null, 'ass_s_' + g.code);
            var leerOpt = doc.createElement('option');
            leerOpt.setAttribute('value', '');
            setzeText(leerOpt, '—');
            sel.appendChild(leerOpt);
            for (var j = 0; j < g.optionen.length; j++) {
              var o = doc.createElement('option');
              o.setAttribute('value', g.optionen[j].code);
              o.value = g.optionen[j].code;
              setzeText(o, txt(win, g.optionen[j].label, l));
              sel.appendChild(o);
            }
            sel.value = g.wert || '';
            zeile.appendChild(lab); zeile.appendChild(sel);
            host.appendChild(zeile);
          }(sch.gruppen[i]));
        }
      }

      /* Die Knoepfe richten sich nach dem Schritt. */
      zeige(el(doc, 'assistZurueck'), fs.schritt > 0);
      zeige(el(doc, 'assistUeber'), sch.freiwillig === true);
      var w = el(doc, 'assistWeiter');
      if (w) beschrifte(w, (fs.schritt + 1 >= fs.von) ? 'uiAssFertig' : 'uiAssWeiter');
      /* Bei einer reinen Auswahl fuehrt das Antippen weiter — der
         Weiter-Knopf bleibt trotzdem da, damit eine schon getroffene
         Auswahl bestaetigt werden kann, ohne sie neu zu tippen. */
      return true;
    }

    /* Sammelt die Antwort des aktuellen Fensters ein. */
    function assistAntwortAus(sch) {
      var wert = null, i, inp;
      if (!sch) return null;
      if (sch.art === 'auswahl') {
        wert = sch.wert;
      } else if (sch.art === 'felder') {
        wert = {};
        for (i = 0; i < sch.felder.length; i++) {
          inp = el(doc, 'ass_f_' + sch.felder[i].code);
          if (inp && !istLeer(inp.value)) wert[sch.felder[i].code] = inp.value;
        }
      } else if (sch.art === 'zusatz') {
        wert = {};
        for (i = 0; i < sch.bereiche.length; i++) {
          inp = el(doc, 'ass_z_' + sch.bereiche[i].code);
          wert[sch.bereiche[i].code] = !!(inp && inp.checked);
        }
      } else if (sch.art === 'symbol') {
        wert = {};
        for (i = 0; i < sch.gruppen.length; i++) {
          inp = el(doc, 'ass_s_' + sch.gruppen[i].code);
          if (inp && !istLeer(inp.value)) wert[sch.gruppen[i].code] = inp.value;
        }
      }
      return wert;
    }

    function assistStart() {
      var A = assiModul();
      if (!A) return false;
      /* UEBERNAHME (3.3): was im Formular steht, kommt mit. */
      S.assi = A.starte(zustand(), werte());
      var m = el(doc, 'assistModal');
      if (m) { m.hidden = false; klasse(m, 'offen', true); }
      assistZeigen();
      return true;
    }

    function assistSchliessen() {
      var m = el(doc, 'assistModal');
      if (m) { m.hidden = true; klasse(m, 'offen', false); }
      S.assi = null;
      return true;
    }

    function assistAbbrechen() {
      assistSchliessen();
      meldung(txt(win, 'uiAssAbgebrochen', S.sprache));
      return true;
    }

    function assistWeiter(direktWert) {
      var A = assiModul();
      if (!A || !S.assi) return false;
      var sch = A.schritt(S.assi);
      var wert = (direktWert !== undefined && direktWert !== null)
               ? direktWert : assistAntwortAus(sch);
      S.assi = A.antworte(S.assi, wert);
      if (A.fertig(S.assi)) return assistFertig();
      return assistZeigen();
    }

    function assistZurueck() {
      var A = assiModul();
      if (!A || !S.assi) return false;
      S.assi = A.zurueck(S.assi);
      return assistZeigen();
    }

    function assistUeberspringen() {
      var A = assiModul();
      if (!A || !S.assi) return false;
      S.assi = A.ueberspringe(S.assi);
      if (A.fertig(S.assi)) return assistFertig();
      return assistZeigen();
    }

    /* N8c · DIE MUENDUNG. Der Assistent endet NICHT in einer eigenen
       Ergebnisanzeige, sondern schreibt in das Formular und drueckt denselben
       Rechenweg an, den auch die Handeingabe nimmt. Der Anwender sieht
       danach die VOLLE Anzeige samt Rechenweg und der Liste dessen, was
       nicht geprueft wurde (Plan 3.3, Sicherheitsaspekt). */
    function assistFertig() {
      var A = assiModul();
      if (!A || !S.assi) return false;
      var erg = A.ergebnis(S.assi);
      assistSchliessen();
      leeren();
      formularSetzen(erg.auswahl, erg.werte);
      var r = rechnen();
      meldung(txt(win, 'uiAssFertigMsg', S.sprache));
      return r;
    }

    /* ==================================================================== */
    /* N9b · WAERMEFUEHRUNG — nur anzeigen, nichts rechnen                   */
    /*                                                                       */
    /* Alles Fachliche steht in thermik.js: die Formeln, die Grenzen, das    */
    /* Zielfenster und die Entscheidung, wann NICHT gerechnet wird. Diese    */
    /* Schicht sammelt die Felder ein, reicht sie hin und traegt ein, was    */
    /* zurueckkommt. Sie hat KEINE eigene Ampel-Regel und keinen eigenen     */
    /* Grenzwert (Plan 4.10).                                                */
    /* ==================================================================== */

    function thermikEingabe(z, w) {
      function nz(k) { return istLeer(w[k]) ? null : w[k]; }
      return {
        werkstoffgruppe: z.werkstoffgruppe, werkstoff: z.werkstoff,
        stossart: z.stossart, verfahren: z.schweissverfahren,
        analyse: { C: nz('an_C'), Si: nz('an_Si'), Mn: nz('an_Mn'),
                   Cr: nz('an_Cr'), Mo: nz('an_Mo'), V: nz('an_V'),
                   Cu: nz('an_Cu'), Ni: nz('an_Ni') },
        CET: nz('CET'), HD: nz('HD'), d_kombiniert: nz('d_komb'),
        U: nz('sp_U'), I: nz('sp_I'), v: nz('sp_v'), T0: nz('T0'),
        t85_min: nz('t85_min'), t85_max: nz('t85_max'),
        F2: nz('F2'), F3: nz('F3'),
        /* Die Blechdicken kommen aus der Geometrie — dieselben Felder, die
           auch der Festigkeitsnachweis benutzt. Zwei Eingaben fuer dieselbe
           Dicke waeren zwei Gelegenheiten, sie verschieden anzugeben. */
        dicken: [nz('t1'), nz('t2'), nz('tw'), nz('tf')].filter(function (x) { return x !== null; })
      };
    }

    function thermikZeile(host, label, wert, klasse) {
      var z = neu('div', 'th-zeile', null);
      var l = neu('span', null, null);
      setzeText(l, label);
      var v = neu('span', 'th-wert' + (klasse ? ' ' + klasse : ''), null);
      setzeText(v, wert);
      z.appendChild(l); z.appendChild(v);
      host.appendChild(z);
      return z;
    }

    /* Nur beim vollstaendigen Leeren. NICHT beim Abbruch des
       Festigkeitsnachweises: die Waermefuehrung ist eine eigene Rechnung
       und darf ihr Ergebnis behalten, wenn nebenan etwas fehlt (N9b). */
    function thermikLeeren() {
      var tk = el(doc, 'cardThermik');
      if (tk) zeige(tk, false);
      var tw = el(doc, 'thermikWeg'); if (tw) tw.innerHTML = '';
      var tko = el(doc, 'thermikKopf'); if (tko) tko.innerHTML = '';
      var th = el(doc, 'thermikHinweise'); if (th) th.innerHTML = '';
      S.letzteThermik = null;
      return true;
    }

    function thermikZeigen(z, w) {
      var karte = el(doc, 'cardThermik');
      var kopf = el(doc, 'thermikKopf'), weg = el(doc, 'thermikWeg');
      var hin = el(doc, 'thermikHinweise');
      var T = win.DTNThermik, l = S.sprache, i, sch;
      if (!karte) return null;
      if (kopf) kopf.innerHTML = '';
      if (weg) weg.innerHTML = '';
      if (hin) hin.innerHTML = '';

      if (!T || z.thermik_aktiv !== true) { zeige(karte, false); return null; }
      zeige(karte, true);

      var b = T.bericht(thermikEingabe(z, w));
      if (!b.ok) {
        for (i = 0; i < b.fehler.length; i++) {
          zeile(hin, 'pruef-fehler', txt(win, b.fehler[i].code, l));
        }
        return b;
      }

      /* Kopf: die zwei Zahlen, auf die es ankommt. */
      thermikZeile(kopf, txt(win, 'th_tp', l),
                   b.vorwaermung_erforderlich
                     ? (zahlText(b.Tp_gerundet, 0) + ' ' + txt(win, 'unit_gradC', l))
                     : txt(win, 'th_keine_vorw', l));
      var ampelKlasse = (b.ampel === 'gruen') ? 'th-gruen'
                      : (b.ampel === 'rot') ? 'th-rot' : 'th-grau';
      thermikZeile(kopf, txt(win, 'th_t85', l),
                   zahlText(b.t85, 1) + ' ' + txt(win, 'unit_s', l), ampelKlasse);
      thermikZeile(kopf, txt(win, 'th_s_fenster', l),
                   b.fenster.min === null
                     ? txt(win, 'th_fenster_offen', l)
                     : fuelle(txt(win, 'th_fenster_von_bis', l),
                              [zahlText(b.fenster.min, 0), zahlText(b.fenster.max, 0)]),
                   ampelKlasse);

      /* Der Rechenweg: jeder Schritt mit seinen Zahlen. */
      for (i = 0; i < b.schritte.length; i++) {
        sch = b.schritte[i];
        var t = neu('div', 'rw-abschnitt', null);
        setzeText(t, txt(win, sch.code, l));
        weg.appendChild(t);
        if (sch.code === 'th_s_aequivalente') {
          thermikZeile(weg, 'CET', zahlText(sch.CET, 3));
          thermikZeile(weg, 'CEV', zahlText(sch.CEV, 3));
          thermikZeile(weg, 'Pcm', zahlText(sch.Pcm, 3));
        } else if (sch.code === 'th_s_dicke') {
          thermikZeile(weg, 'd', zahlText(sch.d, 0) + ' ' + txt(win, 'unit_mm', l));
        } else if (sch.code === 'th_s_waerme') {
          thermikZeile(weg, 'k', zahlText(sch.k, 2));
          thermikZeile(weg, 'Q', zahlText(sch.Q, 3) + ' ' + txt(win, 'unit_kj_mm', l));
        } else if (sch.code === 'th_s_vorwaermung') {
          thermikZeile(weg, 'CET', zahlText(sch.teile.CET, 1));
          thermikZeile(weg, 'd', zahlText(sch.teile.d, 1));
          thermikZeile(weg, 'HD', zahlText(sch.teile.HD, 1));
          thermikZeile(weg, 'Q', zahlText(sch.teile.Q, 1));
          thermikZeile(weg, 'Tp', zahlText(sch.Tp, 1) + ' ' + txt(win, 'unit_gradC', l));
        } else if (sch.code === 'th_s_fenster') {
          /* DIE QUELLE DES FENSTERS GEHOERT DARUNTER (N9d). Vorher
             stand hier eine Ueberschrift ohne Inhalt — das sieht aus wie ein
             abgeschnittener Gedanke. Und der Anwender soll einschaetzen
             koennen, ob die Grenzen zu seiner Vorgabe passen. */
          if (sch.min !== null) {
            thermikZeile(weg, txt(win, 'th_fenster_kurz', l),
                         zahlText(sch.min, 0) + '–' + zahlText(sch.max, 0) + ' ' +
                         txt(win, 'unit_s', l));
          }
          if (sch.eigen) {
            zeile(weg, 'gap-note', txt(win, 'th_fenster_eigen', l));
          } else if (sch.quelle) {
            zeile(weg, 'gap-note', txt(win, sch.quelle, l));
          } else {
            zeile(weg, 'gap-note', txt(win, 'th_fenster_offen', l));
          }
        } else if (sch.code === 'th_s_abkuehlzeit') {
          thermikZeile(weg, 'T0', zahlText(sch.T0, 0) + ' ' + txt(win, 'unit_gradC', l));
          thermikZeile(weg, '2D', zahlText(sch.t85_2d, 1) + ' ' + txt(win, 'unit_s', l));
          thermikZeile(weg, '3D', zahlText(sch.t85_3d, 1) + ' ' + txt(win, 'unit_s', l));
        }
      }

      /* Und was NICHT gerechnet wurde — jeder Hinweis, jede Warnung. */
      for (i = 0; i < b.warnungen.length; i++) {
        zeile(hin, 'pruef-warnung', txt(win, b.warnungen[i].code, l));
      }
      for (i = 0; i < b.hinweise.length; i++) {
        zeile(hin, 'gap-note', '\u00b7 ' + txt(win, b.hinweise[i].code, l));
      }
      return b;
    }

    /* ------------------------------------------------------------ Pruefen */
    /* N5b rechnet NICHT. "Berechnen" prueft die Eingaben und sagt ehrlich,
       was fehlt; das Rechnen selbst folgt in Etappe N5c. */
    function beschriftungVon(code) {
      if (Valid && Valid.feld(code)) return txt(win, 'fld_' + code, S.sprache);
      if (Options && Options.gruppe(code)) return txt(win, 'grp_' + code, S.sprache);
      return code;
    }

    function zeileMelden(liste, m, art) {
      var d = neu('div', art, null);
      var name = m.feld ? beschriftungVon(m.feld) : '';
      var text = txt(win, m.code, S.sprache);
      if (typeof m.grenze !== 'undefined') text = text + ' (' + m.grenze + ')';
      d.textContent = (name ? name + ': ' : '') + text;
      liste.appendChild(d);
      if (m.feld && art === 'pruef-fehler') {
        klasse(el(doc, 'row_f_' + m.feld), 'fehlerhaft', true);
        klasse(el(doc, 'row_g_' + m.feld), 'fehlerhaft', true);
      }
    }

    function pruefen() {
      var box = el(doc, 'pruefBox'), liste = el(doc, 'pruefListe');
      if (!box || !liste || !Valid) return null;
      var z = aktualisiere() || zustand();
      var r = Valid.pruefe(werte(), z);

      liste.innerHTML = '';
      var i;
      for (i = 0; i < r.fehler.length; i++)    zeileMelden(liste, r.fehler[i], 'pruef-fehler');
      for (i = 0; i < r.warnungen.length; i++) zeileMelden(liste, r.warnungen[i], 'pruef-warnung');
      for (i = 0; i < r.hinweise.length; i++)  zeileMelden(liste, r.hinweise[i], 'pruef-hinweis');

      if (r.ok) {
        var d = neu('div', 'pruef-ok', null);
        d.textContent = txt(win, 'uiPruefOk', S.sprache);
        liste.appendChild(d);
      }
      box.hidden = false;
      klasse(box, 'offen', true);
      setzeText(el(doc, 'pruefTitel'), txt(win, 'uiPruefTitel', S.sprache));
      meldung(txt(win, r.ok ? 'uiPruefOk' : 'uiPruefFehler', S.sprache));
      return r;
    }

    /* ------------------------------------------------------------ Rechnen */
    /* N5c-1, Plan 5.1. Ab hier ruft ui.js GENAU EIN Rechenmodul auf:
       DTNSolver. Alles andere bleibt verboten (Nahtbild, Profil, Werkstoff-
       tabelle, Rechenweg, Grafik) — der Solver holt sich das selbst. ui.js
       uebergibt die uebersetzte Eingabe und zeigt an, was zurueckkommt;
       gerechnet wird hier nichts. Der Rechenweg kommt in N5c-2 dazu. */

    /* Zahlausgabe fuers Auge. Seit N5c-2 gibt es davon nur noch EINE
       Fassung: die des Rechenwegs (DE/PT Komma, EN Punkt, Tausenderpunkt).
       Die Notloesung aus N5c-1 ist damit abgeloest; der Zweig ohne Modul
       bleibt nur, damit die Kacheln auch ohne Rechenweg lesbar waeren. */
    function zahlText(x, nk) {
      if (typeof x !== 'number' || !isFinite(x)) return '–';
      var stellen = (typeof nk === 'number') ? nk : 2;
      var Rw = win.DTNRechenweg;
      if (Rw && typeof Rw.zahl === 'function') return Rw.zahl(x, stellen, S.sprache);
      return x.toFixed(stellen);
    }

    function kachel(host, key, wert, einheitKey) {
      var t = neu('div', 'tile', null);
      var k = neu('div', 'tile-k', null);
      beschrifte(k, key);
      t.appendChild(k);
      var v = neu('div', 'tile-wert', null);
      v.textContent = wert + (einheitKey ? ' ' + txt(win, einheitKey, S.sprache) : '');
      t.appendChild(v);
      host.appendChild(t);
      return t;
    }

    /* Der Platzhalter aus der HTML wird nur AUS- und EINGEBLENDET, nie
       zerstoert und neu gebaut — sonst gaebe es seine Id zweimal. Das
       Erzeugte lebt in einem eigenen Behaelter darunter. */
    function ergBox() {
      var b = el(doc, 'ergBox');
      if (b) return b;
      var host = el(doc, 'resultHost');
      if (!host) return null;
      b = neu('div', 'erg-box', 'ergBox');
      host.appendChild(b);
      return b;
    }

    function ergebnisLeeren() {
      var b = ergBox();
      if (b) b.innerHTML = '';
      zeige(el(doc, 'resultIdle'), true);
      var w = wegBox();
      if (w) w.innerHTML = '';
      zeige(el(doc, 'pathIdle'), true);
      var g = grafikBox();
      if (g) g.innerHTML = '';
      zeige(el(doc, 'vizIdle'), true);
      S.letzteEingabe = null;
      S.letzterWeg = null;
      return !!b;
    }

    /* Die gesperrten Tabellenfelder mit den Werten fuellen, mit denen
       WIRKLICH gerechnet wurde — samt Herkunft. Sonst blieben sie fuer immer
       leer, und bewusste Zurueckhaltung saehe aus wie ein Fehler.
       Zugeordnet wird ueber den Feldnamen, nicht ueber Fachwissen; ein per
       Haken gesetzter eigener Wert bleibt unangetastet (Plan 3.1). */
    function gesperrteFuellen(erg) {
      if (!Valid || !erg || !erg.widerstand) return 0;
      var n = 0;
      for (var i = 0; i < Valid.SCHEMA.length; i++) {
        var f = Valid.SCHEMA[i];
        if (!f.ueberschreibbar) continue;
        var ev = el(doc, 'ev_' + f.code);
        if (ev && ev.checked) continue;
        var wert = erg.widerstand[f.code];
        if (typeof wert !== 'number' || !isFinite(wert)) continue;
        var inp = el(doc, 'fld_' + f.code);
        if (!inp) continue;
        inp.value = zahlText(wert, typeof f.dez === 'number' ? f.dez : 2);
        var q = erg.widerstand['quelle_' + f.code];
        if (q) setzeAttr(inp, 'title', txt(win, 'uiQuelle_' + q, S.sprache));
        n++;
      }
      return n;
    }

    function ergebnisZeigen(erg) {
      var host = ergBox();
      if (!host) return false;
      host.innerHTML = '';
      zeige(el(doc, 'resultIdle'), false);

      /* Kein halbes Ergebnis: geht es nicht, wird gesagt warum — ohne Zahlen. */
      if (!erg || erg.ok !== true) {
        var kopf = neu('div', 'status-banner', null);
        beschrifte(kopf, 'uiRechnenFehler');
        host.appendChild(kopf);
        var fl = (erg && erg.fehler) || [];
        for (var fi = 0; fi < fl.length; fi++) {
          var z = neu('div', 'pruef-fehler', null);
          z.textContent = txt(win, fl[fi].code || fl[fi], S.sprache);
          host.appendChild(z);
        }
        return false;
      }

      /* Ampel aus dem Ergebnis — nicht selbst hergeleitet. */
      var amp = neu('div', 'ampel ' + (erg.ampel || 'gelb'), 'ergAmpel');
      beschrifte(amp, erg.erfuellt ? 'erg_erfuellt' : 'erg_nicht_erfuellt');
      host.appendChild(amp);

      var tiles = neu('div', 'tiles', 'ergKacheln');
      host.appendChild(tiles);

      var mg = erg.massgebend || {};
      kachel(tiles, 'erg_eta', zahlText(erg.eta, 3), null);
      kachel(tiles, 'erg_sigma_v', zahlText(mg.sigma_v, 1), 'unit_Nmm2');
      kachel(tiles, 'erg_rd', zahlText(erg.widerstand && erg.widerstand.R_d, 1), 'unit_Nmm2');
      kachel(tiles, 'erg_a',
             zahlText((erg.auslegung && erg.auslegung.a_gewaehlt) || (erg.nahtbild && erg.nahtbild.a) ||
                      (erg.schnittgroessen && erg.schnittgroessen.a) || S.letztesA, 1), 'unit_mm');
      kachel(tiles, 'erg_l', zahlText(erg.nahtbild && erg.nahtbild.l_ges, 1), 'unit_mm');
      kachel(tiles, 'erg_punkt',
             zahlText(mg.y, 1) + ' | ' + zahlText(mg.z, 1), 'unit_mm');

      /* Womit gerechnet wurde — sichtbar, nicht nur im Rechenweg. */
      if (erg.widerstand) {
        var gm = neu('div', 'gap-note', 'ergGerechnetMit');
        gm.textContent = txt(win, 'uiGerechnetMit', S.sprache) + ' ' +
          'β_w = ' + zahlText(erg.widerstand.betaW, 2) + ' · ' +
          'f_u = ' + zahlText(erg.widerstand.fu, 0) + ' ' + txt(win, 'unit_Nmm2', S.sprache) + ' · ' +
          'γ_M2 = ' + zahlText(erg.widerstand.gammaM2, 2);
        host.appendChild(gm);
      }

      /* N5d: die Ausfuehrungsanforderung steht beim Ergebnis — ehrlich als
         nicht rechenwirksam beschriftet. Vollstaendig in Druck/PDF/Word und
         in der .dts-Datei erst mit N11. */
      var anf = anforderungText();
      if (anf) {
        var az = neu('div', 'gap-note', 'ergAnforderung');
        az.textContent = txt(win, 'ausf_anforderung', S.sprache) + ' ' + anf;
        host.appendChild(az);
      }

      /* Warnungen und Hinweise des Rechenkerns gehoeren sichtbar hierher —
         ein Ergebnis ohne seine Warnung waere ein stilles Ergebnis. */
      var i, zeile;
      for (i = 0; i < (erg.warnungen || []).length; i++) {
        zeile = neu('div', 'pruef-warnung', null);
        zeile.textContent = txt(win, erg.warnungen[i].code || erg.warnungen[i], S.sprache);
        host.appendChild(zeile);
      }
      for (i = 0; i < (erg.hinweise || []).length; i++) {
        zeile = neu('div', 'pruef-hinweis', null);
        zeile.textContent = txt(win, erg.hinweise[i].code || erg.hinweise[i], S.sprache);
        host.appendChild(zeile);
      }
      return true;
    }

    /* "Berechnen": erst pruefen, dann rechnen. Nie rechnen, was die Pruefung
       nicht bestanden hat — sonst entstuende ein Ergebnis auf unsicherem
       Grund (Plan 3.1/3.4). */
    function rechnen() {
      /* DIE WAERMEFUEHRUNG IST EINE EIGENE RECHNUNG (N9b) und laeuft
         deshalb ZUERST und unabhaengig davon, ob der Festigkeitsnachweis
         durchgeht. Stuende sie hinter dem Abbruch, bliebe bei einem
         unvollstaendigen Formular ihr VORIGES Ergebnis stehen — und das
         waere die schlimmste Sorte Fehler: eine alte Zahl, die aussieht
         wie eine neue. Der DOM-Smoke hat genau das gefunden. */
      S.letzteThermik = thermikZeigen(zustand(), werte());

      var r = pruefen();
      if (!r || r.ok !== true) { ergebnisLeeren(); return null; }

      var Rechner = win.DTNSolver;
      if (!Rechner || typeof Rechner.rechne !== 'function') {
        meldung(txt(win, 'uiKeinRechenkern', S.sprache));
        ergebnisLeeren();
        return null;
      }
      if (!Valid || typeof Valid.rechenEingabe !== 'function') return null;

      var ue = Valid.rechenEingabe(werte(), zustand());
      S.letztesA = ue.eingabe.a;
      var erg = Rechner.rechne(ue.eingabe);

      S.letzteEingabe = ue.eingabe;
      ergebnisZeigen(erg);
      rechenwegZeigen(erg, ue.eingabe);
      grafikZeigen(ue.eingabe, erg);
      if (erg && erg.ok) gesperrteFuellen(erg);
      meldung(txt(win, (erg && erg.ok) ? 'uiGerechnet' : 'uiRechnenFehler', S.sprache));
      S.letztesErgebnis = erg;
      return erg;
    }

    /* --------------------------------------------------- Rechenweg (N5c-2) */
    /* Plan 5.1, Schritte 6 bis 10. Ab hier sind DREI Anzeige-Aufrufe erlaubt:
       der Solver rechnet, der Rechenweg beschriftet, das Schaubild zeichnet.
       Alle drei liefern Fertiges — hier wird nichts nachgerechnet und nichts
       nachformatiert. */

    function wegBox() {
      var b = el(doc, 'wegBox');
      if (b) return b;
      var host = el(doc, 'wegHost');
      if (!host) return null;
      b = neu('div', 'weg-box', 'wegBox');
      host.appendChild(b);
      return b;
    }

    function grafikBox() {
      var b = el(doc, 'grafikBox');
      if (b) return b;
      var host = el(doc, 'grafikHost');
      if (!host) return null;
      b = neu('div', 'grafik-box', 'grafikBox');
      host.appendChild(b);
      return b;
    }

    /* Ein Klappbereich, gebaut wie die statischen aus N5a — gleiche Klassen,
       gleiche Mechanik (schalte/umschalten), gleiches Aussehen. Es gibt
       damit nur EINE Klappmechanik im Programm, nicht zwei.
       Der Rechenweg im Schwesterprogramm klappt genauso. */
    function klappBereich(host, code, titel, hinweis, offen) {
      var sec = neu('section', 'acc', 'acc_' + code);
      var kopf = neu('button', 'acc-head', 'accBtn_' + code);
      setzeAttr(kopf, 'type', 'button');
      setzeAttr(kopf, 'aria-controls', 'accBody_' + code);
      var car = neu('span', 'acc-caret', 'accCaret_' + code);
      setzeAttr(car, 'aria-hidden', 'true');
      car.textContent = '\u25B8';
      kopf.appendChild(car);
      var tit = neu('span', 'acc-titel', 'accTitel_' + code);
      tit.textContent = titel;
      kopf.appendChild(tit);
      sec.appendChild(kopf);

      var korp = neu('div', 'acc-body', 'accBody_' + code);
      if (hinweis) {
        var h = neu('p', 'acc-hint', 'accHint_' + code);
        h.textContent = hinweis;
        korp.appendChild(h);
      }
      sec.appendChild(korp);
      host.appendChild(sec);

      if (kopf.addEventListener) kopf.addEventListener('click', function () { umschalten(code); });
      schalte(code, !!offen);
      return korp;
    }

    function zeile(host, klassen, text) {
      if (!text && text !== 0) return null;
      var d = neu('div', klassen, null);
      d.textContent = text;
      host.appendChild(d);
      return d;
    }

    /* DIE ZWEI HAEKCHENARTEN — nie vermischen (Plan 4.9, bindend seit N4).
       Ein falscher Haken heisst: das Programm rechnet falsch.
       Ein nicht erfuellter Nachweis heisst: die Naht traegt so nicht.
       Deshalb zwei verschiedene Klassen und zwei verschiedene Zeichen. */
    function haekchen(host, s) {
      if (s.haken !== null && typeof s.haken !== 'undefined') {
        var h = neu('span', 'rw-haken' + (s.haken ? '' : ' fehl'), null);
        h.textContent = s.haken_zeichen || (s.haken ? '✓' : '✗');
        setzeAttr(h, 'title', txt(win, 'rwProbeTitel', S.sprache));
        host.appendChild(h);
      }
      if (s.erfuellt !== null && typeof s.erfuellt !== 'undefined') {
        var n = neu('span', 'rw-nachweis' + (s.erfuellt ? '' : ' fehl'), null);
        n.textContent = (s.erfuellt_zeichen || '') + ' ' + (s.erfuellt_text || '');
        setzeAttr(n, 'title', txt(win, 'rwNachweisTitel', S.sprache));
        host.appendChild(n);
      }
    }

    function rechenwegZeigen(erg, ein) {
      var host = wegBox();
      if (!host) return false;
      host.innerHTML = '';
      zeige(el(doc, 'pathIdle'), false);

      var Rw = win.DTNRechenweg;
      if (!Rw || !erg || erg.ok !== true) {
        zeige(el(doc, 'pathIdle'), true);
        return false;
      }
      var roh = Rw.ausErgebnis(erg, ein);
      var r = Rw.rendere(roh, S.sprache);
      S.letzterWeg = roh;

      /* ZUERST das Wichtige, IMMER sichtbar: Bilanz der Selbstpruefung und
         die ehrlichen Luecken. Was der Anwender wissen MUSS, verschwindet
         nicht hinter einer Klappe — nur die 36 Einzelschritte tun das. */
      var bil = neu('div', 'rw-bilanz', 'rwBilanz');
      bil.textContent =
        txt(win, 'rwProben', S.sprache) + ' ' + r.n_haken_ok + '/' + r.n_haken + ' \u00b7 ' +
        txt(win, 'rwNachweise', S.sprache) + ' ' + r.n_nachweise_ok + '/' + r.n_nachweise;
      host.appendChild(bil);

      var i, j, ab, s, blatt;
      if ((roh.nicht_geprueft || []).length) {
        var lk = neu('div', 'rw-abschnitt', 'rwLuecken');
        beschrifte(lk, 'rwNichtGeprueft');
        host.appendChild(lk);
        for (i = 0; i < roh.nicht_geprueft.length; i++) {
          zeile(host, 'gap-note', '\u00b7 ' + txt(win, roh.nicht_geprueft[i], S.sprache));
        }
      }
      for (i = 0; i < (roh.warnungen || []).length; i++) {
        zeile(host, 'pruef-warnung', txt(win, roh.warnungen[i].code || roh.warnungen[i], S.sprache));
      }

      /* Und jetzt der Rechenweg selbst — aufklappbar, beim Start ZU.
         Er ist lang (zehn Abschnitte, meist ueber dreissig Schritte); am
         Handy stuende sonst zwischen Ergebnis und Seitenende eine Wand. */
      var nSchritte = 0;
      for (i = 0; i < r.abschnitte.length; i++) nSchritte += r.abschnitte[i].schritte.length;
      var detail = klappBereich(
        host, 'weg_detail',
        txt(win, 'rwDetail', S.sprache),
        r.abschnitte.length + ' ' + txt(win, 'rwAbschnitte', S.sprache) + ' \u00b7 ' +
          nSchritte + ' ' + txt(win, 'rwSchritte', S.sprache),
        S.wegDetailOffen === true);
      if (!detail) return true;

      for (i = 0; i < r.abschnitte.length; i++) {
        ab = r.abschnitte[i];
        /* Jeder Abschnitt fuer sich klappbar, beim Aufklappen des Ganzen
           aber offen — wer sucht, soll nicht zehnmal tippen muessen. */
        var korp = klappBereich(detail, 'weg_' + ab.code, ab.titel, null,
                                S.offen['weg_' + ab.code] !== false);

        for (j = 0; j < ab.schritte.length; j++) {
          s = ab.schritte[j];
          blatt = neu('div', 'rw-zeile', null);
          zeile(blatt, 'rw-titel', s.nr + '. ' + s.titel);
          zeile(blatt, 'rw-formel', s.formel);
          zeile(blatt, 'rw-werte', s.eingesetzt);
          zeile(blatt, 'rw-werte', s.ergebnis);
          zeile(blatt, 'rw-werte', s.wert_text);
          for (var li = 0; li < (s.liste || []).length; li++) {
            zeile(blatt, 'rw-werte', '· ' + s.liste[li]);
          }
          zeile(blatt, 'rw-werte', s.probe);
          haekchen(blatt, s);
          zeile(blatt, 'rw-quelle', s.quelle);
          zeile(blatt, 'rw-quelle', s.hinweis);
          korp.appendChild(blatt);
        }
      }
      return true;
    }

    /* ------------------------------------------------ Nahtbild-Grafik (N5c-2) */
    function grafikZeigen(ein, erg) {
      var host = grafikBox();
      if (!host) return false;
      host.innerHTML = '';
      zeige(el(doc, 'vizIdle'), false);

      var Sb = win.DTNSchaubild;
      if (!Sb || !ein || !ein.profil_eingabe) { zeige(el(doc, 'vizIdle'), true); return false; }

      /* Gezeichnet wird das Nahtbild, mit dem GERECHNET wurde — der Solver
         gibt es heraus. Im Auslegungsfall steht im Formular gar kein a-Mass;
         vor N7 blieb die Karte dort deshalb leer. */
      var pe = (erg && erg.nahtbild && erg.nahtbild.profil_eingabe)
             ? erg.nahtbild.profil_eingabe : ein.profil_eingabe;
      var bild = Sb.ausProfil(pe, { sprache: S.sprache });
      if (!bild || !bild.ok || !bild.svg) {
        zeige(el(doc, 'vizIdle'), true);
        return false;
      }
      var rahmen = neu('div', 'grafik-svg', 'grafikSvg');
      rahmen.innerHTML = bild.svg;
      host.appendChild(rahmen);

      /* Legende dreisprachig — die Codes kommen aus dem Schaubild, die
         Beschriftung aus dem Woerterbuch. */
      var leg = neu('div', 'grafik-legende', 'grafikLegende');
      for (var i = 0; i < (bild.legende || []).length; i++) {
        var e = bild.legende[i];
        var p = neu('div', 'legende-eintrag', null);
        var punkt = neu('span', 'legende-punkt', null);
        punkt.setAttribute('style', 'background:' + (e.farbe || 'currentColor'));
        p.appendChild(punkt);
        var b = neu('span', 'legende-text', null);
        b.textContent = txt(win, e.code, S.sprache) +
          (typeof e.l === 'number' ? ' · ' + zahlText(e.l, 0) + ' ' + txt(win, 'unit_mm', S.sprache) : '');
        p.appendChild(b);
        leg.appendChild(p);
      }
      host.appendChild(leg);
      return true;
    }

    /* ------------------------------------------------------- Laien-Hilfe */
    function hilfeZeigen(key, titelKey) {
      var m = el(doc, 'hilfeModal');
      if (!m) return false;
      var l = S.sprache;
      setzeText(el(doc, 'hilfeTitel'), titelKey ? txt(win, titelKey, l) : '');
      var was = hilfe(win, key, l, 'was');
      var ber = hilfe(win, key, l, 'bereich');
      var tip = hilfe(win, key, l, 'tipp');
      setzeText(el(doc, 'hilfeWas'), was || txt(win, 'uiHilfeLeer', l));
      setzeText(el(doc, 'hilfeBereich'), ber);
      setzeText(el(doc, 'hilfeTipp'), tip);
      zeige(el(doc, 'hilfeBereich'), !!ber);
      zeige(el(doc, 'hilfeBereichLbl'), !!ber);
      zeige(el(doc, 'hilfeTipp'), !!tip);
      zeige(el(doc, 'hilfeTippLbl'), !!tip);
      m.hidden = false;
      klasse(m, 'offen', true);
      return true;
    }

    function hilfeSchliessen() {
      var m = el(doc, 'hilfeModal');
      if (!m) return false;
      m.hidden = true;
      klasse(m, 'offen', false);
      return true;
    }

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
      versionZeigen();
      /* N6b: die Legende des Symbols haengt an der Sprache — sie muss mit. */
      if (S.gebaut) symbolZeigen(zustand());
      bereicheBeschriften();
      setzeText(el(doc, 'pruefTitel'), txt(win, 'uiPruefTitel', l));
      meldung('');
    }

    function setSprache(l) {
      if (!istSprache(l)) return S.sprache;
      S.sprache = l;
      uebersetze();
      /* Die Zahlen in den Ergebnis-Kacheln tragen kein data-i18n — sie sind
         Werte, keine Texte. Das Zahlformat haengt aber an der Sprache
         (Komma bzw. Punkt), also wird das Ergebnis neu gesetzt. Sonst
         stuende nach dem Umschalten ein deutsches Komma auf Englisch. */
      if (S.letztesErgebnis) {
        ergebnisZeigen(S.letztesErgebnis);
        rechenwegZeigen(S.letztesErgebnis, S.letzteEingabe);
        grafikZeigen(S.letzteEingabe, S.letztesErgebnis);
      }
      /* Ein offener Assistent wird mit uebersetzt — sonst stuende das
         Dialogfenster nach dem Umschalten noch in der alten Sprache. */
      if (S.assi) assistZeigen();
      if (S.letzteThermik) thermikZeigen(zustand(), werte());
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

    function umschalten(code) {
      var r = schalte(code, !S.offen[code]);
      /* Der Zustand des Rechenwegs ueberlebt Sprachwechsel und Neurechnen —
         wer ihn aufgeklappt hat, findet ihn danach wieder aufgeklappt. */
      if (code === 'weg_detail') S.wegDetailOffen = !!S.offen[code];
      return r;
    }

    function bereicheStandard() {
      for (var i = 0; i < BEREICHE.length; i++) {
        schalte(BEREICHE[i], BEREICHE[i] === BEREICH_START_OFFEN);
      }
    }

    function bereicheBeschriften() {
      for (var i = 0; i < BEREICHE.length; i++) {
        var c = BEREICHE[i];
        setzeText(el(doc, 'accTitel_' + c), txt(win, 'sec_' + c, S.sprache));
        setzeText(el(doc, 'accHint_' + c), txt(win, 'sec_' + c + '_hint', S.sprache));
      }
    }

    /* ------------------------------------------------------------ Leeren */
    /* Plan 3.1: leert wirklich ALLES — und stellt danach genau den Zustand
       her, den die frisch geoeffnete Seite hat (Standardwerte in gesperrten
       Feldern, ein Bereich offen, keine Meldung). */
    function leeren() {
      thermikLeeren();
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

      for (i = 0; i < ZUSATZ.length; i++) zeige(el(doc, 'zusn_' + ZUSATZ[i].code), false);
      S.manuell = {};
      S.letztesSymbol = null;
      var box = el(doc, 'pruefBox');
      if (box) { box.hidden = true; klasse(box, 'offen', false); }
      var liste = el(doc, 'pruefListe');
      if (liste) liste.innerHTML = '';
      hilfeSchliessen();

      aktualisiere();
      vorbelegen();
      bereicheStandard();
      ergebnisLeeren();
      S.letztesErgebnis = null;
      meldung(txt(win, 'uiGeleert', S.sprache));
      return n;
    }

    /* ----------------------------------------------------------- Meldung */
    function meldung(s) {
      var m = el(doc, 'dtMsg');
      if (m) m.textContent = s || '';
      return s || '';
    }

    /* ------------------------------------------------------------------
     * N5d — VERSIONSZEILE (Plan 3.6)
     * Sie wird aus den GELADENEN Modulen gebaut, nicht von Hand gepflegt:
     * jedes Modul haengt unter seinem eigenen Namen am Fenster und traegt
     * seine Kennung selbst. Deshalb steht hier keine Modulliste — eine
     * zweite Liste waere die naechste Stelle, die auseinanderdriftet.
     * Ein Modul ohne Kennung wird SICHTBAR als Luecke gezaehlt.
     * ---------------------------------------------------------------- */
    function moduleKennungen() {
      var r = [], k, m, name, ver;
      for (k in win) {
        if (!k || k.indexOf('DTN') !== 0) continue;
        try { m = win[k]; } catch (e) { m = null; }
        if (!m || typeof m !== 'object') continue;
        name = (typeof m.NAME === 'string' && m.NAME) ? m.NAME : k.substring(3).toLowerCase();
        ver = (typeof m.VERSION === 'string' && m.VERSION) ? m.VERSION : null;
        r.push({ schluessel: k, name: name, version: ver });
      }
      r.sort(function (a, b) { return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0); });
      return r;
    }

    function versionInfo() {
      var mods = moduleKennungen(), ohne = 0;
      for (var i = 0; i < mods.length; i++) if (!mods[i].version) ohne++;
      return { stand: ETAPPE, plan: PLAN, ui: VERSION,
               module: mods, n: mods.length, ohne: ohne };
    }

    function versionZeigen() {
      var v = versionInfo(), l = S.sprache, i, t = [];
      var kopf = el(doc, 'infoVersion');
      if (kopf) {
        var s1 = txt(win, 'uiVersionStand', l) + ' ' + v.stand + ' \u00b7 ' +
                 txt(win, 'uiVersionPlan', l) + ' ' + v.plan + ' \u00b7 ' +
                 v.n + ' ' + txt(win, 'uiVersionModule', l);
        if (v.ohne) s1 += ' \u00b7 ' + v.ohne + ' ' + txt(win, 'uiVersionOhne', l);
        kopf.textContent = s1;
      }
      var liste = el(doc, 'infoModule');
      if (liste) {
        for (i = 0; i < v.module.length; i++) {
          t.push(v.module[i].name + ' ' + (v.module[i].version || '?'));
        }
        liste.textContent = t.join(' \u00b7 ');
      }
      return v;
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

      b = el(doc, 'hilfeClose');
      if (b && b.addEventListener) b.addEventListener('click', function () { hilfeSchliessen(); });
      b = el(doc, 'hilfeModal');
      if (b && b.addEventListener) {
        b.addEventListener('click', function (ev) {
          if (!ev || !ev.target || ev.target === b) hilfeSchliessen();
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

      b = el(doc, 'calcBtn');
      if (b && b.addEventListener) b.addEventListener('click', function () { rechnen(); });

      /* Noch nicht verdrahtete Knoepfe melden das ehrlich, statt still nichts zu tun. */
      for (i = 0; i < GERUEST_BUTTONS.length; i++) {
        (function (paar) {
          var k = el(doc, paar[0]);
          if (k && k.addEventListener) {
            k.addEventListener('click', function () { meldung(txt(win, paar[1], S.sprache)); });
          }
        }(GERUEST_BUTTONS[i]));
      }

      /* N8b · Assistent */
      b = el(doc, 'assistBtn');
      if (b && b.addEventListener) b.addEventListener('click', function () { assistStart(); });
      b = el(doc, 'assistWeiter');
      if (b && b.addEventListener) b.addEventListener('click', function () { assistWeiter(); });
      b = el(doc, 'assistZurueck');
      if (b && b.addEventListener) b.addEventListener('click', function () { assistZurueck(); });
      b = el(doc, 'assistUeber');
      if (b && b.addEventListener) b.addEventListener('click', function () { assistUeberspringen(); });
      b = el(doc, 'assistAbbruch');
      if (b && b.addEventListener) b.addEventListener('click', function () { assistAbbrechen(); });

      b = el(doc, 'presetSel');
      if (b && b.addEventListener) {
        b.addEventListener('change', function () {
          var sel = el(doc, 'presetSel');
          var wahl = sel ? sel.value : '';
          if (istLeer(wahl)) return;
          beispielLaden(wahl);
        });
      }
    }

    /* --------------------------------------------------------------- Lauf */
    setTheme(START_THEME);
    baueFormular();
    beispieleFuellen();
    aktualisiere();
    vorbelegen();
    bereicheStandard();
    verdrahte();
    uebersetze();

    var sitzung = {
      VERSION: VERSION, ETAPPE: ETAPPE, PLAN: PLAN,
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
      uebersetze: uebersetze,
      /* N5b */
      gebaut: function () { return S.gebaut; },
      zustand: zustand,
      werte: werte,
      aktualisiere: aktualisiere,
      vorbelegen: vorbelegen,
      eigenerWert: eigenerWert,
      pruefen: pruefen,
      hilfeZeigen: hilfeZeigen,
      hilfeSchliessen: hilfeSchliessen,
      /* N5c-1 */
      /* KONTEXTBEZOGEN seit N7 (Plan 3.2): dieselbe Liste, die im Kasten
         steht — nicht der ganze Katalog. */
      /* N8b — der Assistent von aussen bedienbar (fuer den DOM-Smoke). */
      assistStart: assistStart,
      assistSchritt: function () {
        var A = assiModul();
        return (A && S.assi) ? A.schritt(S.assi) : null;
      },
      assistWeiter: assistWeiter,
      assistZurueck: assistZurueck,
      assistUeberspringen: assistUeberspringen,
      assistAbbrechen: assistAbbrechen,
      assistOffen: assistOffen,
      letztesErgebnis: function () { return S.letztesErgebnis || null; },
      /* N9c — das Waermefuehrungsergebnis von aussen, fuer den DOM-Smoke. */
      letzteThermik: function () { return S.letzteThermik || null; },
      assistFortschritt: function () {
        var A = assiModul();
        return (A && S.assi) ? A.fortschritt(S.assi) : null;
      },
      beispiele: function () {
        if (!Options || !Options.BEISPIELE) return [];
        return Options.beispieleFuer ? Options.beispieleFuer(zustand())
                                     : Options.BEISPIELE.slice();
      },
      beispielLaden: beispielLaden,
      rechnen: rechnen,
      ergebnisLeeren: ergebnisLeeren,
      ergebnis: function () { return S.letztesErgebnis || null; },
      rechenweg: function () { return S.letzterWeg || null; },
      /* N5d */
      version: versionInfo,
      symbol: function () { return S.letztesSymbol || null; },
      anforderung: anforderungText,
      istSelbstGewaehlt: function (code) { return S.manuell[code] === true; }
    };
    api.sitzung = sitzung;
    return sitzung;
  }

  var api = {
    NAME: 'ui',
    VERSION: VERSION,
    ETAPPE: ETAPPE,
    PLAN: PLAN,
    SPRACHEN: SPRACHEN,
    START_THEME: START_THEME,
    START_SPRACHE: START_SPRACHE,
    BEREICHE: BEREICHE,
    BEREICH_START_OFFEN: BEREICH_START_OFFEN,
    ZUORDNUNG: ZUORDNUNG,
    ZUSATZ: ZUSATZ,
    IDS: IDS,
    KLASSEN: KLASSEN,
    GERUEST_BUTTONS: GERUEST_BUTTONS,
    start: start,
    sitzung: null
  };
  return api;
}));
