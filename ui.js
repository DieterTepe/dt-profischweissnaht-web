/* ============================================================================
 * DT-ProfiSchweissnaht · ui.js  (DTNUi)
 * Baustein N5 — Etappe N5a (Grundgeruest) + Etappe N5b (EINGABESEITE).
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

  var VERSION = '0.6.0';
  var ETAPPE = 'N5c-2';
  var SPRACHEN = ['de', 'en', 'pt'];

  /* Plan 3.1 (bindend): die Oberflaeche startet IMMER im dunklen Design —
     in beiden Editionen gleich. Der Schalter bleibt erhalten. */
  var START_THEME = 'dark';
  var START_SPRACHE = 'de';

  var BEREICHE = ['grund', 'werkstoff', 'naht', 'geometrie',
                  'lasten', 'beiwerte', 'zusatz', 'ausfuehrung'];

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
      gruppen: ['profil', 'kanten'],
      felder: ['b', 'h', 'd', 'tw', 'tf', 'r_ecke', 't1', 't2'] },

    { code: 'lasten', leit: 'lasteingabe',
      gruppen: [],
      felder: ['N', 'Q', 'M', 'T', 'Qy', 'Qz', 'My', 'Mz', 'F', 'e'],
      optional_wenn: { lasteingabe: ['direkt'] } },

    { code: 'beiwerte', leit: 'welt',
      gruppen: [],
      felder: ['gammaM2', 'gammaMw', 'betaW', 'S', 'nu', 'Re'] },

    { code: 'zusatz', leit: null, gruppen: [], felder: [], zusatz: true },

    /* ISO 5817 und EXC bekommen in N5d ihren eigenen Block (Plan 2.7). */
    { code: 'ausfuehrung', leit: null, gruppen: ['iso5817', 'exc'], felder: [],
      etappe: 'N5d', folgt: 'uiFolgtN5d' }
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
    'hilfeModal', 'hilfeTitel', 'hilfeWasLbl', 'hilfeWas', 'hilfeBereichLbl',
    'hilfeBereich', 'hilfeTippLbl', 'hilfeTipp', 'hilfeClose'
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
    'legende-eintrag', 'legende-punkt', 'legende-text', 'rw-abschnitt', 'rw-bilanz'
  ];

  /* Buttons, die bewusst noch nicht verdrahtet sind: Id -> ehrliche Meldung.
     "Berechnen" ist ab N5b verdrahtet — es PRUEFT (Rechnen folgt in N5c). */
  var GERUEST_BUTTONS = [
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
      sel.addEventListener('change', function () { aktualisiere(); meldung(''); });
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
        beschrifte(opt, 'opt_' + g.code + '_' + o.code);
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
      inp.addEventListener('change', function () { meldung(''); });
      box.appendChild(inp);

      if (f.einheit) {
        var ein = neu('span', 'feld-einheit', 'unit_' + f.code);
        beschrifte(ein, f.einheit);
        box.appendChild(ein);
      }
      zeile.appendChild(box);

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
    function baueZusatz(host) {
      for (var i = 0; i < ZUSATZ.length; i++) {
        (function (z) {
          var lab = neu('label', 'zusatz-haken', 'zusl_' + z.code);
          var box = neu('input', null, 'zus_' + z.code);
          box.setAttribute('type', 'checkbox');
          lab.appendChild(box);
          var t = neu('span', null, null);
          beschrifte(t, z.label);
          lab.appendChild(t);
          host.appendChild(lab);

          var note = neu('div', 'zusatz-note', 'zusn_' + z.code);
          beschrifte(note, z.folgt);
          note.hidden = true;
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
          if (g) host.appendChild(baueGruppe(g));
        }
        for (j = 0; j < b.felder.length; j++) {
          f = Valid.feld(b.felder[j]);
          if (f) host.appendChild(baueFeld(f));
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
      return z;
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
    function beispieleFuellen() {
      var sel = el(doc, 'presetSel');
      if (!sel || !Options || !Options.BEISPIELE) return 0;
      var vorher = sel.value;
      sel.innerHTML = '';

      var leerOpt = doc.createElement('option');
      leerOpt.setAttribute('value', '');
      beschrifte(leerOpt, 'bspWaehlen');
      sel.appendChild(leerOpt);

      for (var i = 0; i < Options.BEISPIELE.length; i++) {
        var b = Options.BEISPIELE[i];
        var opt = doc.createElement('option');
        opt.setAttribute('value', b.code);
        opt.value = b.code;
        beschrifte(opt, b.name);
        sel.appendChild(opt);
      }
      sel.value = vorher || '';
      return Options.BEISPIELE.length;
    }

    /* Plan 3.5, sinngemaess: ERST ALLES LEEREN, DANN LADEN — nie duerfen
       Reste einer frueheren Eingabe in einer neuen Rechnung stehenbleiben. */
    function beispielLaden(code) {
      if (!Options || !Valid) return null;
      var b = Options.beispiel(code);
      if (!b) return null;

      leeren();

      var i, g, sel, wert;
      /* Die Gruppen in ihrer eigenen Reihenfolge setzen: sie ist zugleich die
         Abhaengigkeitsreihenfolge (erst stossart, dann nahtart …). Nach jeder
         Auswahl neu filtern, sonst gaebe es die naechste Option noch nicht. */
      for (i = 0; i < Options.GRUPPEN.length; i++) {
        g = Options.GRUPPEN[i].code;
        if (!Object.prototype.hasOwnProperty.call(b.auswahl, g)) continue;
        sel = el(doc, 'sel_' + g);
        if (!sel) continue;
        sel.value = b.auswahl[g];
        aktualisiere();
      }

      /* Felder eintragen. Ein ueberschreibbarer Wert (z. B. der Eckradius)
         ist gesperrt vorbelegt — dafuer wird der "eigener Wert"-Haken
         mitgesetzt, sonst faende der Anwender seinen Wert gleich wieder
         ueberschrieben. */
      for (var k in b.felder) {
        if (!Object.prototype.hasOwnProperty.call(b.felder, k)) continue;
        var f = Valid.feld(k);
        if (!f) continue;
        if (f.ueberschreibbar) {
          var ev = el(doc, 'ev_' + k);
          if (ev) ev.checked = true;
          eigenerWert(k, true);
        }
        var inp = el(doc, 'fld_' + k);
        if (inp) inp.value = String(b.felder[k]);
      }

      aktualisiere();
      sel = el(doc, 'presetSel');
      if (sel) sel.value = code;
      meldung(txt(win, 'uiBeispiel', S.sprache) + ' ' + txt(win, b.name, S.sprache));
      return code;
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
      grafikZeigen(ue.eingabe);
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

      var i, j, ab, s, kopf, blatt;
      for (i = 0; i < r.abschnitte.length; i++) {
        ab = r.abschnitte[i];
        kopf = neu('div', 'rw-abschnitt', null);
        kopf.textContent = ab.titel;
        host.appendChild(kopf);

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
          host.appendChild(blatt);
        }
      }

      /* Selbstpruefung sichtbar: wie viele Rechenproben und wie viele
         Nachweise, und ob sie aufgehen. */
      var bil = neu('div', 'rw-bilanz', 'rwBilanz');
      bil.textContent =
        txt(win, 'rwProben', S.sprache) + ' ' + r.n_haken_ok + '/' + r.n_haken + ' · ' +
        txt(win, 'rwNachweise', S.sprache) + ' ' + r.n_nachweise_ok + '/' + r.n_nachweise;
      host.appendChild(bil);

      /* LISTE 2.4 — was bewusst NICHT geprueft wurde. Sie gehoert sichtbar
         hierher: eine stille Luecke waere schlimmer als eine benannte. */
      if ((roh.nicht_geprueft || []).length) {
        var lk = neu('div', 'rw-abschnitt', 'rwLuecken');
        beschrifte(lk, 'rwNichtGeprueft');
        host.appendChild(lk);
        for (i = 0; i < roh.nicht_geprueft.length; i++) {
          zeile(host, 'gap-note', '· ' + txt(win, roh.nicht_geprueft[i], S.sprache));
        }
      }
      for (i = 0; i < (roh.warnungen || []).length; i++) {
        zeile(host, 'pruef-warnung', txt(win, roh.warnungen[i].code || roh.warnungen[i], S.sprache));
      }
      return true;
    }

    /* ------------------------------------------------ Nahtbild-Grafik (N5c-2) */
    function grafikZeigen(ein) {
      var host = grafikBox();
      if (!host) return false;
      host.innerHTML = '';
      zeige(el(doc, 'vizIdle'), false);

      var Sb = win.DTNSchaubild;
      if (!Sb || !ein || !ein.profil_eingabe) { zeige(el(doc, 'vizIdle'), true); return false; }

      var bild = Sb.ausProfil(ein.profil_eingabe, { sprache: S.sprache });
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
        grafikZeigen(S.letzteEingabe);
      }
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
      beispiele: function () { return (Options && Options.BEISPIELE) ? Options.BEISPIELE.slice() : []; },
      beispielLaden: beispielLaden,
      rechnen: rechnen,
      ergebnisLeeren: ergebnisLeeren,
      ergebnis: function () { return S.letztesErgebnis || null; },
      rechenweg: function () { return S.letzterWeg || null; }
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
