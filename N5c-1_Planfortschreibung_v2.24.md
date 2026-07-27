# 📌 N5c-1 · Planfortschreibung auf v2.24

## Austauschblöcke für `Schweißnaht-1.md` — **kein Ersatz der Plandatei**

> **Warum diese Datei existiert:** Im Projektordner lag beim Start dieses Chats
> `Schweißnaht-1.md` in der Fassung **v2.17**, während die aktuelle Fassung **v2.23** ist
> (dieselbe Lage wie im abgebrochenen Vorlauf, dort in Abschnitt 0 beschrieben). Der
> **Auftrag** war über die Projektsuche vollständig lesbar — die **ganze Datei** aber nicht.
> Eine vollständige v2.24 hätte ich nur aus Bruchstücken zusammensetzen können, und eine
> Plandatei mit einer still fehlenden Passage ist schlimmer als gar keine.
>
> Deshalb stehen hier die **geänderten Abschnitte einzeln**. Wer die echte v2.23 vorliegen
> hat (Dieter am Handy oder der nächste Chat), trägt sie ein — dann ist die Plandatei
> wieder die alleinige Grundlage und **diese Datei kann gelöscht werden**.
>
> **Ebenfalls erledigt und löschbar:** `N5c-1_Vorlauf-Messwerte.md`. Alle vier Punkte
> daraus sind gebaut und geprüft (siehe Entscheidungslog unten).

---

## 1 · KOPFBLOCK — ersetzt den Block am Dateianfang

```
Plan-Version : 2.24 · Stand 2026-07-28
Status       : N1 (Fundament), N2 (Nahtbild-Kern), N2b (Profileingabe),
               N2c (Nahtbild-Grafik), N3 (Spannungen + beide Welten),
               N4 (Rechenweg), N5a (UI-Grundgerüst), N5b (Eingabeseite)
               von Dieter am Handy geprüft und ABGENOMMEN.
               **N5c-1 („Es rechnet") ist gebaut und ausgeliefert — Abnahme steht aus.**
               → NÄCHSTER SCHRITT: erst N5c-1 am Handy prüfen, dann Etappe
                 **N5c-2** („Es erklärt sich") — Einstieg „weiter mit N5c-2".
                 Auftrag in Abschnitt 5.1. Schnittstellen: 4.8 (solver.js),
                 4.9 (rechenweg.js), 4.7 (schaubild.js), 4.10/4.10b/4.10c (ui.js).
Basislinie   : 764 Assertions · DOM-Smokes 418 (voll) + 419 (test) · i18n-Parität 0
               (VERBINDLICH. Basislinie darf nur WACHSEN.)
Dateistand   : siehe Abschnitt 8.1.
```

Im Vorspann außerdem: Einstieg **„weiter mit N5c-2"** statt „weiter mit N5c-1".

---

## 2 · ABSCHNITT 5.2 — Zeile N5c-1 in der Etappentabelle

| **N5c-1** ✅ | *(gebaut 2026-07-28, Abnahme offen)* Feldbereinigung, drei Beispiele, Übersetzung Formular → `profil_eingabe`, „Berechnen" rechnet wirklich, Ergebnis-Kacheln mit Ampel | Beispiel antippen, rechnen, eine Zahl und eine Ampel sehen |

Die Zeile **N5c-2** bleibt unverändert und ist jetzt der nächste Bau.

---

## 3 · NEUER ABSCHNITT 4.10c — Schnittstelle der Ergebnisseite (N5c-1)

> **Nur erweitern, nicht umbauen.**

**`validate.js` — neu, das ist die Übersetzung (Plan 5.1, Schritt 3):**

| Aufruf | Zweck |
|---|---|
| `normiert(werte, zustand)` | `{ok, fehler, werte, a_aus_z}` — geprüfte Zahlen als Zahlen; fehlt `a` und ist `z` da, wird `a = z/√2` abgeleitet und das mit `a_aus_z` ausgewiesen |
| `rechenEingabe(werte, zustand)` | `{ok, fehler, eingabe, a_aus_z}` — die fertige Eingabe für `solver.rechne()`: Auswahlzustand flach, Geometrie im verschachtelten `profil_eingabe`, Lasten und Beiwerte flach |
| `PROFIL_FELDER` | die Feldcodes, die zur Geometrie gehören |

**Warum hier und nicht in `ui.js`:** die Umrechnung `a = z/√2` stand ohnehin schon in
`validate.js`, und welches Feld eine Abmessung ist und welches eine Last, weiß das
Feldschema. `ui.js` setzt nur noch zusammen und bleibt rechenfrei.
`a` und `t1` stehen **in `profil_eingabe` UND flach** — der Rechenkern wertet beide Stellen
aus (a-Maß je Segment bzw. `t_min` als Rückfallebene). Das z-Maß wird **nicht**
durchgereicht: daraus ist `a` geworden, zwei Wege zum selben Maß wären eine Doppelquelle.

**`optionen.js` — neu:** `BEISPIELE` (3 Einträge: `code`, `name` = i18n-Schlüssel,
`auswahl{}`, `felder{}`) und `beispiel(code)`.

**`ui.js` — neu in der Sitzung:**
`beispiele()` · `beispielLaden(code)` · `rechnen()` · `ergebnisLeeren()` · `ergebnis()`.
Neue Ids: `ergBox` · `ergAmpel` · `ergKacheln` · `ergGerechnetMit`.
Neue Klassen: `erg-box` · `tile-k`.

**DIE GRENZE VON `ui.js` IST GESCHÄRFT, NICHT AUFGEWEICHT:**
erlaubt ist **genau ein** Rechenmodul — `DTNSolver`. Verboten bleiben `DTNNaht`,
`DTNProfil`, `DTNData`, `DTNRechenweg`, `DTNSchaubild`; ebenso weiterhin jede eigene
Rechnung. In **N5c-2** wächst die Liste um **genau einen** Namen (den Rechenweg).

---

## 4 · ABSCHNITT 5.1 — Ergänzung am Kopf

> **N5c-1 ist gebaut und ausgeliefert (2026-07-28), die Abnahme steht aus.**
> Der Auftrag für **N5c-2** steht unverändert darunter und ist der nächste Bau.
> Die Feldbereinigung ist erledigt: `l` ist raus (**28 Felder**), `t1` profilabhängig
> Pflicht, `t2` freiwillig, `msg_endkrater_zu_lang` zeigt auf `a`.
> Die drei Beispiele sind gebaut und werden vom Harness bei **jedem** Lauf nachgerechnet.

---

## 5 · ABSCHNITT 8.1 — Dateistand nach N5c-1

**Geändert (9 Dateien):**

| Datei | Stand |
|---|---|
| `validate.js` | **N5c-1** — `l` entfernt (28 Felder), `t1` profilabhängig, `t2` freiwillig, Längenprüfungen entfallen (sitzen im Solver), **neu `normiert()` und `rechenEingabe()`** |
| `optionen.js` | **N5c-1** — neu `BEISPIELE` (3) und `beispiel()`; Gruppen und Optionen unverändert (20 / 89) |
| `profil.js` | **N5c-1** — `msg_endkrater_zu_lang` zeigt auf Feld `a` statt `l` (zwei Stellen), sonst unverändert |
| `ui.js` | **N5c-1** — Beispiele geladen, Übersetzung angestoßen, „Berechnen" rechnet, Ergebnis-Kacheln mit Ampel, gesperrte Felder werden nach dem Rechnen gefüllt |
| `i18n_kern.js` | **N5c-1** — Beispielnamen, Ergebnisbeschriftungen, Quellenangaben; zwei überholte Texte richtiggestellt |
| `i18n_hilfe.js` | **N5c-1** — Laien-ⓘ zu `t2` sagt, was ohne Eingabe passiert |
| `style.css` | **N5c-1** — `.erg-box`, `.tile .tile-k` |
| `test_naht.js` | **N5c-1** — S10 umgehängt, **neue Sektion S31**, S29/S30 geschärft |
| `dom_smoke_voll.js` | **N5c-1** — Feldbereinigung, Beispiele, Rechnen und Kacheln an der echten Oberfläche |

**Unverändert:** **beide HTMLs** (der Unterschied bleibt damit genau eine Zeile),
`daten.js`, `naht.js`, `svglib.js`, `schaubild.js`, `solver.js`, `rechenweg.js`,
`i18n_kerbfall.js`, `dom_smoke_test.js`.

**Was N5c-2 überschreiben wird:** `ui.js`, `style.css`, `i18n_kern.js`, Harness und Smoke;
die Rechenmodule bleiben unberührt.

---

## 6 · ENTSCHEIDUNGSLOG — neuer Block

**Aus N5c-1 (2026-07-28) — Festlegungen, die beim Bauen entstanden sind:**

- **Die Beispiele sind Daten in `optionen.js`, nicht in `ui.js`.** Ein Beispiel ist nichts
  als eine Menge von Auswahlcodes plus ein paar Zahlen. Hätten sie in `ui.js` gestanden,
  wüsste die Oberfläche plötzlich Werkstoffe und Profile — genau das, was 4.10 ausschließt.
  **N7 wächst auf derselben Struktur weiter**, statt eine zweite Quelle aufzumachen.
- **Die Grenze von `ui.js` wurde geschärft, nicht aufgeweicht.** Aus „kein Rechenmodul"
  wurde „**dieses eine**": `DTNSolver`. Er holt sich Nahtbild, Profil und Kennwerte selbst;
  `ui.js` übergibt die übersetzte Eingabe und zeigt an, was zurückkommt.
- **Die Zeichenketten-Prüfung trifft auch Kommentare — sie ist beim Bauen zweimal
  zugeschnappt** (einmal wegen `Math.`, einmal wegen eines Modulnamens in einem Kommentar).
  Das ist keine Aufweichung wert: die Prüfung ist gut, nur stumpf. **Regel: in `ui.js` die
  verbotenen Namen auch im Fließtext der Kommentare nicht schreiben.**
- **Die zwei Längenprüfungen wurden umgehängt, nicht gestrichen.** `l_eff ≥ max(6a; 30)`
  und `l ≤ 150·a` laufen jetzt je Segment im Solver an der echten Geometrie. Vor dem
  Umbau nachgemessen: Blech mit Flankennähten, t 20 — b 35/a 5 meldet zu kurz,
  b 1008/a 4 meldet zu lang, b 608/a 4 (genau 150·a) meldet nichts. Aus 3 Assertions
  wurden 6.
- **Ein echter Produktfehler, den erst der Test gefunden hat:** Beim Sprachwechsel blieben
  die Zahlen in den Ergebnis-Kacheln im alten Format stehen — auf Englisch stand ein
  deutsches Dezimalkomma. Grund: Zahlen sind Werte und tragen kein `data-i18n`, also fasst
  sie `uebersetze()` nicht an. `setSprache()` setzt das Ergebnis jetzt neu.
- **Der Platzhalter im Ergebnisbereich wird ein- und ausgeblendet, nicht zerstört.** Die
  erste Fassung hat ihn per `innerHTML` weggeräumt und neu gebaut — dann gäbe es seine Id
  zweimal. Das Erzeugte lebt jetzt in einem eigenen Behälter `ergBox` darunter.
- **Die gesperrten Tabellenfelder werden nach dem Rechnen gefüllt** — mit den Werten, mit
  denen wirklich gerechnet wurde, samt Herkunft im Titel (`β_w` 0,8 · `f_u` 360 ·
  `γ_M2` 1,25, Quelle „Tabelle"). Zugeordnet wird über den **Feldnamen**, nicht über
  Fachwissen; ein per Haken gesetzter eigener Wert bleibt unangetastet. Ohne das sähe
  bewusste Zurückhaltung wie ein Fehler aus.
- **Bewusste Doppelung auf Zeit, benannt:** Das Zahlformat (Komma bzw. Punkt) steckt
  vorläufig in einer kleinen Hilfsfunktion in `ui.js`, weil der Rechenweg dort noch nicht
  aufgerufen werden darf. **In N5c-2 wird sie durch das Zahlformat von `rechenweg.js`
  ersetzt**, damit es nur eine Fassung gibt.
- **Beide HTMLs blieben unverändert.** Das Gerüst aus N5a hat gereicht — ein gutes Zeichen
  für die Entscheidung, das Formular zu erzeugen statt Markup zu pflegen.

**Aus dem Chatverlauf 2026-07-28 — zum Verfahren:**

- Der Projektordner lieferte beim Chatstart **v2.17**, die Projektsuche **v2.23**. Der
  Auftrag war vollständig lesbar, die Plandatei nicht schreibbar. Statt eine v2.24 aus
  Bruchstücken zusammenzusetzen, wurden die Änderungen als **Austauschblöcke** geliefert.
  **Lehre:** Beim Wiedereinstieg zuerst die Plan-Version im Ordner gegen die Basislinie
  prüfen — die drei Testläufe verraten sofort, ob Datei und Code zusammenpassen.

---

## 7 · CHANGELOG — neuer Eintrag

**v2.24 (2026-07-28):** **Baustein N5, Etappe N5c-1 („Es rechnet") gebaut und
ausgeliefert.** **Feldbereinigung:** `l` entfällt aus dem Feldschema (29 → **28**), `t1`
wird profilabhängig Pflicht, `t2` freiwillig, `msg_endkrater_zu_lang` in `profil.js` zeigt
auf `a`; die beiden Längenprüfungen sind **umgehängt statt gestrichen** (je Segment im
Solver, drei Grenzfälle vorher nachgemessen, 3 → 6 Assertions).
**Drei Beispiele** als Daten in `optionen.js` (nicht in `ui.js` — Begründung im
Entscheidungslog), hinter „Beispiel laden" verdrahtet, mit **erst leeren, dann laden**
(3.5) und gesetztem „eigener Wert"-Haken für den Eckradius. Alle drei reproduzieren die
Zahlen aus 5.1 exakt und warnungsfrei: RHS 120×80×6 → 4 Segmente/328 mm/η 0,359 ·
HEB 200 Steg → 2/324/0,626 · Blech 80×10 → 2/140/0,842.
**Übersetzung Formular → Rechenkern** in `validate.js` (`normiert()`, `rechenEingabe()`):
Zahlen als Zahlen, `a` aus dem z-Maß abgeleitet, `a_steg`/`a_flansch` durchgereicht,
Geometrie ins verschachtelte `profil_eingabe`. **„Berechnen" rechnet wirklich** — erst
prüfen, dann `DTNSolver.rechne()`, dann anzeigen; **Ergebnis-Kacheln** (η, σ_v, R_d,
a-Maß, Nahtlänge, maßgebender Punkt) mit **Ampel** aus `ergebnis.ampel`/`erfuellt`, dazu
Warnungen und Hinweise des Rechenkerns sichtbar und die Zeile „Gerechnet wurde mit".
Die gesperrten Tabellenfelder werden nach dem Rechnen aus `ergebnis.widerstand` gefüllt.
**Die Fachlogik-Assertion wurde geschärft statt aufgeweicht:** genau ein erlaubtes
Rechenmodul. Neuer Abschnitt **4.10c**, neue Harness-Sektion **S31** (rechnet die drei
Beispiele bei jedem Lauf nach: Segmentzahl, Länge, Ausnutzung, Ampel, keine Warnung).
**Zwei echte Fehler beim Bauen gefunden und behoben:** das Zahlformat der Kacheln ging
beim Sprachwechsel nicht mit, und der Ergebnis-Platzhalter wurde zerstört statt
ausgeblendet (Id doppelt).
**Basislinie 724 → 764 Assertions · Smokes 385/386 → 418/419 · i18n-Parität 0.**
**Nächster Schritt: N5c-1 am Handy prüfen, dann N5c-2 („Es erklärt sich").**

---

*Fortschreibung erstellt 2026-07-28 · gehört zu `Schweißnaht-1.md` · DT-ProfiSchweissnaht*
