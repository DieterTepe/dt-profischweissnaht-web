/* ============================================================================
 * DT-ProfiSchweissnaht · assistent.js  (DTNAssistent)
 * Baustein N8 — DIALOGFUEHRUNG (Schweissnaht-1.md 3.3, Etappe N8a von 3).
 *
 * ETAPPE 1 VON 2: Hier steht NUR DIE LOGIK. Kein DOM, kein Fenster, kein
 * Pixel — das Overlay kommt in der zweiten Etappe. Alles hier ist in Node
 * pruefbar, und genau darum ist es der erste Schnitt.
 *
 * DIE HARTE REGEL DIESES MODULS (3.3): DER ASSISTENT RECHNET NIE SELBST.
 * Er fuellt dieselben Felder wie die Handeingabe und uebergibt an dieselbe
 * Kette. `ergebnis()` liefert genau `{auswahl, werte}` — dasselbe Paar, das
 * auch das Formular liefert. Es gibt hier keine Formel, keine Grenze, keinen
 * Beiwert. Gaebe es sie, haette das Programm zwei Wahrheiten, und der
 * selbstpruefende Rechenweg waere entwertet.
 *
 * KEINE ZWEITE SCHRITTLISTE. Die Schrittfolge entsteht aus `optionen.js`
 * (welche Auswahl ist jetzt ueberhaupt aktiv?) und `validate.js` (welches
 * Feld ist jetzt Pflicht?). Eine handgepflegte Liste waere beim naechsten
 * Baustein veraltet — und niemand haette es gemerkt. Deshalb: dieselbe
 * Filterfunktion wie das Formular, dieselben Bedingungen, dieselben Felder.
 *
 * UNVERAENDERLICH: `antworte`, `zurueck` und `springe` liefern eine NEUE
 * Sitzung und lassen die alte unberuehrt. So ist "einen Schritt zurueck"
 * kein Rueckbau, sondern schlicht die vorige Sitzung — und der Verlauf ist
 * jederzeit nachvollziehbar.
 *
 * DOM-frei · UMD/IIFE · haengt nur an optionen.js und validate.js.
 * ========================================================================== */
(function (root, factory) {
  var api;
  if (typeof module === 'object' && module.exports) {
    api = factory(require('./optionen.js'), require('./validate.js'));
    module.exports = api;
  } else {
    api = factory(root.DTNOptions, root.DTNValidate);
  }
  root.DTNAssistent = api;
}(typeof self !== 'undefined' ? self : this, function (Options, Valid) {
  'use strict';

  var NAME = 'assistent';
  var VERSION = '0.4.0-N9c';

  /* Die Bereiche, in denen Eingabefelder gebuendelt werden. Die Reihenfolge
     ist die Reihenfolge im Dialog. Welches Feld in welchen Bereich gehoert,
     steht am Feld selbst (validate.js, `bereich`) — nicht hier. */
  /* 'thermik' erscheint nur, wenn der Bereich zugeschaltet ist — die
     Felder sind dann Pflicht, und validate.js sagt es. N9b, Prozessregel
     aus 3.3: der Baustein liefert seinen Assistenten-Schritt MIT. */
  var FELD_BEREICHE = ['naht', 'geometrie', 'lasten', 'beiwerte', 'thermik'];

  /* Die sechs Symbolgruppen sind NICHT rechenwirksam. Sie kommen als EIN
     freiwilliger Schritt ganz am Schluss (Dieters Festlegung 2026-08-04) —
     sechs eigene Fenster waeren viel fuer etwas Optionales. */
  var SYMBOL_GRUPPEN = ['sym_grund', 'sym_gegen', 'sym_oberflaeche',
                        'sym_sicherung', 'sym_lage'];

  var SCHRITT_ZUSATZ = 'zusatzbereiche';
  var SCHRITT_SYMBOL = 'symbol';

  /* WELCHE SKIZZE ZU WELCHEM SCHRITT GEHOERT (N8b-1, Plan 3.3).
     Das ist DIALOGWISSEN, kein Fachwissen — deshalb steht es hier und nicht
     in der Oberflaeche. Dieses Modul zeichnet nichts; es sagt nur, WELCHE
     Quelle die Oberflaeche fragen soll. Drei Quellen gibt es:
       'skizze'    — die schematischen Bilder aus N8b-1
       'schaubild' — das echte Nahtbild aus dem Profil (N2c)
       'symbol'    — Fugenform und ISO-2553-Symbol (N6b)
     Fehlt ein Eintrag, gibt es zu diesem Schritt KEINE Skizze — und das ist
     eine benannte Luecke, keine vergessene: fuer Welt, Werkstoffgruppe,
     Nachweisverfahren und die uebrigen gaebe es nichts zu zeichnen, das
     erklaert statt schmueckt (OHNE_SKIZZE im Skizzenmodul). Dort traegt das
     Fenster die Laien-Erklaerung und den Tipp aus i18n_hilfe.js. */
  var SKIZZE_QUELLE = {
    stossart:       'skizze',
    lastfall:       'skizze',
    rechenrichtung: 'skizze',
    lasteingabe:    'skizze',
    endkrater:      'skizze',
    kraftrichtung:  'skizze',
    nahtart:        'symbol',
    profil:         'schaubild',
    kanten:         'schaubild',
    naht:           'schaubild',      /* der Feldbereich mit dem a-Mass */
    geometrie:      'schaubild'
  };

  function skizzeZu(code) {
    return Object.prototype.hasOwnProperty.call(SKIZZE_QUELLE, code)
         ? SKIZZE_QUELLE[code] : null;
  }

  /* --------------------------------------------------------------------- */
  /* Kleinkram                                                              */
  /* --------------------------------------------------------------------- */

  function istLeer(v) { return v === undefined || v === null || v === ''; }

  function kopie(o) {
    var n = {}, k;
    for (k in (o || {})) if (Object.prototype.hasOwnProperty.call(o, k)) n[k] = o[k];
    return n;
  }

  function drin(liste, wert) {
    for (var i = 0; i < liste.length; i++) if (liste[i] === wert) return true;
    return false;
  }

  function feld(code) {
    for (var i = 0; i < Valid.SCHEMA.length; i++) {
      if (Valid.SCHEMA[i].code === code) return Valid.SCHEMA[i];
    }
    return null;
  }

  /* --------------------------------------------------------------------- */
  /* Schrittfolge — ABGELEITET, nicht gepflegt                              */
  /* --------------------------------------------------------------------- */

  /* Welche Auswahlgruppen sind bei diesem Stand aktiv? Das beantwortet
     optionen.js, nicht dieses Modul — dieselbe Funktion, die auch das
     Formular benutzt (3.4: EINE Filterfunktion fuer beide). */
  function auswahlSchritte(auswahl) {
    var raus = [], g, i;
    for (i = 0; i < Options.GRUPPEN.length; i++) {
      g = Options.GRUPPEN[i];
      if (drin(SYMBOL_GRUPPEN, g.code)) continue;   /* eigener Schritt am Schluss */
      if (!Options.gruppeAktiv(g.code, auswahl)) continue;
      raus.push({ art: 'auswahl', code: g.code });
    }
    return raus;
  }

  /* Welche Felder gehoeren bei diesem Stand in den Dialog?
     WELCHE SICHTBAR SIND, ENTSCHEIDET validate.js — dieselbe Funktion, die
     auch das Formular benutzt. Dieses Modul waehlt nicht aus, es buendelt
     nur nach Bereichen.
     AUCH DIE "EIGENER WERT"-FELDER GEHOEREN DAZU (Plan 3.3 woertlich: nach
     jeder Auswahl bleiben die zugehoerigen Eingabefelder mit dem Haken
     zugaenglich). Sie kommen mit ihrem Tabellenwert und der Kennzeichnung
     `ueberschreibbar` — im Dialog stehen sie gesperrt da, bis jemand den
     Haken setzt. Sie wegzulassen waere bequemer gewesen und falsch: dann
     koennte der Assistent eine Eckenausrundung oder ein abweichendes
     gamma_M2 nie abbilden, und derselbe Fall kaeme ueber Formular und
     Assistent unterschiedlich heraus. Genau das darf nicht sein. */
  function feldSchritte(auswahl, werte) {
    var raus = [], b, i, j, sicht, f, liste, gebraucht;
    sicht = Valid.sichtbareFelder(auswahl);
    werte = werte || {};
    for (i = 0; i < FELD_BEREICHE.length; i++) {
      b = FELD_BEREICHE[i];
      liste = [];
      gebraucht = false;
      for (j = 0; j < sicht.length; j++) {
        f = sicht[j];
        if (f.bereich !== b) continue;
        liste.push(f.code);
        /* OB der Bereich ueberhaupt gefragt wird, entscheidet sich daran,
           ob dort etwas GEBRAUCHT wird: mindestens ein Pflichtfeld oder ein
           bereits gefuellter Wert. Sonst wuerde der Dialog nach der
           Waermefuehrung fragen, auch wenn niemand sie zugeschaltet hat —
           und der Laie stuende vor einer Schmelzenanalyse, die er gar nicht
           braucht.
           WELCHE Felder dann erscheinen, ist eine andere Frage: dann alle
           sichtbaren des Bereichs, auch die ueberschreibbaren (Plan 3.3,
           in N8a schmerzhaft gelernt). */
        if (Valid.istPflicht(f, auswahl) || !istLeer(werte[f.code])) gebraucht = true;
      }
      if (liste.length && gebraucht) raus.push({ art: 'felder', code: b, felder: liste });
    }
    return raus;
  }

  /* Die vollstaendige Folge bei diesem Stand.
     EHRLICH ZU DEN ZUSATZBEREICHEN: Ermuedung, Waermefuehrung, Kosten und
     Verzug sind heute reine Haken — kein Feld und keine Gruppe haengt an
     ihnen, die Inhalte kommen mit N9, N10, N13 und N15 (Prozessregel 3.3).
     Der Schritt fragt deshalb nur, was das Formular auch fragt: welche
     Bereiche spaeter dabei sein sollen. Er behauptet nichts anderes. */
  function folge(auswahl, werte) {
    var f = auswahlSchritte(auswahl);
    /* DER ZUSATZSCHRITT STEHT VOR DEN FELDERN (seit N9b). Erst entscheiden,
       welche Bereiche dabei sein sollen — dann danach gefragt werden. In
       der umgekehrten Reihenfolge waere die Waermefuehrung schon
       vorbeigezogen, bevor man sie einschalten konnte. */
    f.push({ art: 'zusatz', code: SCHRITT_ZUSATZ });
    f = f.concat(feldSchritte(auswahl, werte));
    f.push({ art: 'symbol', code: SCHRITT_SYMBOL, freiwillig: true });
    return f;
  }

  /* --------------------------------------------------------------------- */
  /* Sitzung                                                                */
  /* --------------------------------------------------------------------- */

  /* UEBERNAHME BESTEHENDER EINGABEN (3.3): Was im Formular schon steht,
     kommt mit. Es bleibt im Dialog aenderbar — deshalb wird es NICHT
     uebersprungen, sondern nur vorbelegt. Wer den Assistenten oeffnet, um
     etwas zu korrigieren, will es auch sehen. */
  function starte(auswahl, werte) {
    var a = kopie(auswahl), w = kopie(werte);
    /* Was zur uebernommenen Auswahl nicht passt, faellt weg — sonst startet
       der Dialog mit einem Widerspruch, den er nie gestellt hat. */
    a = Options.bereinige(a);
    return { version: VERSION, auswahl: a, werte: w, index: 0, verlauf: [] };
  }

  function schritte(s) { return folge(s.auswahl, s.werte); }

  function anzahl(s) { return schritte(s).length; }

  function fertig(s) { return s.index >= anzahl(s); }

  /* Der Schritt, der gerade dran ist — samt allem, was ein Dialogfenster
     braucht. Die BESCHRIFTUNG steht hier bewusst nicht: dieses Modul fuehrt
     nur sprachneutrale Schluessel, uebersetzt wird in i18n_kern.js (4.3). */
  function schritt(s) {
    var f = schritte(s), akt, i, g, opt, fs, code;
    if (s.index < 0 || s.index >= f.length) return null;
    akt = f[s.index];

    if (akt.art === 'auswahl') {
      g = Options.gruppe(akt.code);
      opt = Options.filter(akt.code, s.auswahl);
      return {
        art: 'auswahl', code: akt.code,
        label: 'grp_' + akt.code, hilfe: 'grp_' + akt.code,
        rechenwirksam: g.rechenwirksam !== false,
        optionen: opt.map(function (o) {
          return { code: o.code, label: 'opt_' + akt.code + '_' + o.code };
        }),
        wert: istLeer(s.auswahl[akt.code]) ? null : s.auswahl[akt.code],
        vorschlag: Options.vorschlag ? Options.vorschlag(akt.code, s.auswahl) : null,
        skizze: skizzeZu(akt.code),
        index: s.index, von: f.length
      };
    }

    if (akt.art === 'felder') {
      fs = [];
      for (i = 0; i < akt.felder.length; i++) {
        code = akt.felder[i];
        g = feld(code);
        fs.push({
          code: code, label: g.label, hilfe: g.hilfe, einheit: g.einheit || null,
          min: g.min, max: g.max, dez: g.dez,
          pflicht: Valid.istPflicht(g, s.auswahl),
          ueberschreibbar: g.ueberschreibbar === true,
          standard: g.standard === undefined ? null : g.standard,
          wert: istLeer(s.werte[code]) ? null : s.werte[code]
        });
      }
      return {
        art: 'felder', code: akt.code,
        label: 'ber_' + akt.code, hilfe: 'ber_' + akt.code,
        felder: fs, skizze: skizzeZu(akt.code),
        index: s.index, von: f.length
      };
    }

    if (akt.art === 'zusatz') {
      opt = [];
      for (i = 0; i < Options.ZUSATZBEREICHE.length; i++) {
        g = Options.ZUSATZBEREICHE[i];
        opt.push({
          code: g.code, label: 'zb_' + g.code,
          folgt: g.baustein || null,               /* ehrlich: kommt erst noch */
          nur_abschaetzung: g.nur_abschaetzung === true,
          rechenwirksam: g.rechenwirksam !== false,
          wert: s.auswahl[g.code + '_aktiv'] === true
        });
      }
      return {
        art: 'zusatz', code: SCHRITT_ZUSATZ,
        label: 'ass_zusatz', hilfe: 'ass_zusatz',
        bereiche: opt, skizze: null,
        index: s.index, von: f.length
      };
    }

    /* Symbolschritt — freiwillig, nicht rechenwirksam. */
    fs = [];
    for (i = 0; i < SYMBOL_GRUPPEN.length; i++) {
      code = SYMBOL_GRUPPEN[i];
      if (!Options.gruppeAktiv(code, s.auswahl)) continue;
      fs.push({
        code: code, label: 'grp_' + code,
        optionen: Options.filter(code, s.auswahl).map(function (o) {
          return { code: o.code, label: 'sym_' + o.code };
        }),
        wert: istLeer(s.auswahl[code]) ? null : s.auswahl[code]
      });
    }
    return {
      art: 'symbol', code: SCHRITT_SYMBOL, freiwillig: true,
      label: 'ass_symbol', hilfe: 'ass_symbol',
      gruppen: fs, skizze: 'symbol',
      index: s.index, von: f.length
    };
  }

  /* --------------------------------------------------------------------- */
  /* Antworten                                                              */
  /* --------------------------------------------------------------------- */

  /* Nimmt die Antwort an und geht einen Schritt weiter. Liefert eine NEUE
     Sitzung; die alte bleibt unberuehrt und liegt im Verlauf.
     `wert` ist je nach Schrittart: ein Optionscode ('auswahl'), ein Objekt
     {feldcode: zahl} ('felder'), ein Objekt {bereichcode: true} ('zusatz')
     oder ein Objekt {gruppencode: optionscode} ('symbol'). */
  function antworte(s, wert) {
    var akt = schritt(s), n, k, i, vorher;
    if (!akt) return s;
    n = { version: VERSION, auswahl: kopie(s.auswahl), werte: kopie(s.werte),
          index: s.index, verlauf: s.verlauf.concat([{ index: s.index, code: akt.code }]) };

    if (akt.art === 'auswahl') {
      if (istLeer(wert)) { delete n.auswahl[akt.code]; }
      else { n.auswahl[akt.code] = wert; }
      /* WAS JETZT NICHT MEHR PASST, FAELLT WEG. Wer nachtraeglich die Welt
         wechselt, darf keine Auswahl aus der alten Welt mitschleppen — das
         waere genau der stille Widerspruch, den 3.4 verbietet. */
      vorher = n.auswahl;
      n.auswahl = Options.bereinige(n.auswahl);
      n.entfernt = [];
      for (k in vorher) {
        if (!Object.prototype.hasOwnProperty.call(vorher, k)) continue;
        if (n.auswahl[k] !== vorher[k]) n.entfernt.push(k);
      }
    } else if (akt.art === 'felder') {
      for (i = 0; i < akt.felder.length; i++) {
        k = akt.felder[i].code;
        if (wert && Object.prototype.hasOwnProperty.call(wert, k)) {
          if (istLeer(wert[k])) delete n.werte[k]; else n.werte[k] = wert[k];
        }
      }
    } else if (akt.art === 'zusatz') {
      /* DIE FREISCHALT-HAKEN GEHOEREN IN DIE AUSWAHL, nicht in die Werte —
         genau dort fuehrt sie auch das Formular (ui.js zustand()). Lagen
         sie hier woanders, wuerde validate.js die Pflichtfelder des
         Bereichs nicht sehen und der Assistent fragte nie danach. */
      for (i = 0; i < Options.ZUSATZBEREICHE.length; i++) {
        k = Options.ZUSATZBEREICHE[i].code;
        if (wert && Object.prototype.hasOwnProperty.call(wert, k)) {
          if (wert[k] === true) n.auswahl[k + '_aktiv'] = true;
          else delete n.auswahl[k + '_aktiv'];
        }
      }
    } else {
      for (i = 0; i < SYMBOL_GRUPPEN.length; i++) {
        k = SYMBOL_GRUPPEN[i];
        if (wert && Object.prototype.hasOwnProperty.call(wert, k)) {
          if (istLeer(wert[k])) delete n.auswahl[k]; else n.auswahl[k] = wert[k];
        }
      }
    }

    n.index = s.index + 1;
    return n;
  }

  /* Einen Schritt zurueck. Die Antwort bleibt stehen — sie wird ja gerade
     wieder angezeigt, damit man sie aendern kann. */
  function zurueck(s) {
    if (s.index <= 0) return s;
    return { version: VERSION, auswahl: kopie(s.auswahl), werte: kopie(s.werte),
             index: s.index - 1, verlauf: s.verlauf.slice() };
  }

  /* Direkt zu einem Schritt springen — fuer die Rueckschau am Ende. */
  function springe(s, code) {
    var f = schritte(s), i;
    for (i = 0; i < f.length; i++) {
      if (f[i].code === code) {
        return { version: VERSION, auswahl: kopie(s.auswahl), werte: kopie(s.werte),
                 index: i, verlauf: s.verlauf.slice() };
      }
    }
    return s;
  }

  function ueberspringe(s) {
    var akt = schritt(s);
    if (!akt || akt.freiwillig !== true) return s;
    return { version: VERSION, auswahl: kopie(s.auswahl), werte: kopie(s.werte),
             index: s.index + 1, verlauf: s.verlauf.slice() };
  }

  /* --------------------------------------------------------------------- */
  /* Ergebnis und Stand                                                     */
  /* --------------------------------------------------------------------- */

  /* GENAU DAS PAAR, DAS AUCH DAS FORMULAR LIEFERT — nicht mehr und nicht
     weniger. Von hier geht es in dieselbe Kette. */
  function ergebnis(s) {
    return { auswahl: kopie(s.auswahl), werte: kopie(s.werte) };
  }

  /* Was fehlt noch? Fragt validate.js und optionen.js, urteilt nicht selbst. */
  function offen(s) {
    var p = Options.pruefe(s.auswahl);
    var v = Valid.pruefe(s.werte, s.auswahl);
    return {
      auswahl_fehlt: (p.fehlend || []).slice(),
      auswahl_ungueltig: (p.ungueltig || []).slice(),
      felder: (v.fehler || []).slice(),
      vollstaendig: p.ok === true && v.ok === true
    };
  }

  function fortschritt(s) {
    var n = anzahl(s);
    return { schritt: Math.min(s.index, n), von: n,
             anteil: n ? Math.min(s.index, n) / n : 1 };
  }

  return {
    NAME: NAME, VERSION: VERSION,
    FELD_BEREICHE: FELD_BEREICHE, SYMBOL_GRUPPEN: SYMBOL_GRUPPEN,
    SKIZZE_QUELLE: SKIZZE_QUELLE, skizzeZu: skizzeZu,
    SCHRITT_ZUSATZ: SCHRITT_ZUSATZ, SCHRITT_SYMBOL: SCHRITT_SYMBOL,
    starte: starte, schritte: schritte, schritt: schritt, anzahl: anzahl,
    antworte: antworte, zurueck: zurueck, springe: springe,
    ueberspringe: ueberspringe, fertig: fertig,
    ergebnis: ergebnis, offen: offen, fortschritt: fortschritt
  };
}));
