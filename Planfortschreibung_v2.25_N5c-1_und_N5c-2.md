# 📌 Planfortschreibung auf v2.25 — N5c-1 **und** N5c-2

## Austauschblöcke für `Schweißnaht-1.md`

> **Diese Datei ersetzt `N5c-1_Planfortschreibung_v2_24.md`** — die alte bitte löschen.
>
> **Warum sie existiert:** Die `Schweißnaht-1.md` im Projektordner ist **v2.17**. Die
> Fassungen v2.18–v2.23 sind nur noch in Bruchstücken auffindbar; als ganze Datei liegt
> keine neuere vor. Eine „vollständige v2.25" ließe sich daraus nur zusammenraten, und eine
> Plandatei mit still fehlenden Passagen ist schlimmer als eine, die ihre Lücken benennt.
>
> **Deshalb der ehrliche Weg:** Die Abschnitte, die seit v2.17 dazugekommen sind, stehen
> hier — und die beiden wichtigsten davon (**4.10b** und **3.6**) habe ich **nicht aus dem
> Gedächtnis rekonstruiert, sondern aus dem laufenden Code neu hergeleitet und
> nachgemessen.** Der Code ist die verlässlichere Quelle als jede Erinnerung.
>
> **v2.17 + diese Datei = vollständiger Stand.** Wer beides im Projektordner hat, kann
> N5d ohne Rückfragen bauen.

---

## 0 · KOPFBLOCK — ersetzt den Block am Dateianfang

```
Plan-Version : 2.25 · Stand 2026-07-28
Status       : N1 (Fundament), N2 (Nahtbild-Kern), N2b (Profileingabe),
               N2c (Nahtbild-Grafik), N3 (Spannungen + beide Welten),
               N4 (Rechenweg), N5a (UI-Grundgerüst), N5b (Eingabeseite)
               von Dieter am Handy geprüft und ABGENOMMEN.
               N5c-1 („Es rechnet") am Handy geprüft: rechnet in allen drei
               Sprachen, alles im grünen Bereich — ABGENOMMEN.
               **N5c-2 („Es erklärt sich") ist gebaut und ausgeliefert — Abnahme steht aus.**
               → NÄCHSTER SCHRITT: erst N5c-2 am Handy prüfen, dann Etappe
                 **N5d** — Einstieg „weiter mit N5d".
                 Inhalt: Block „Ausführung & Dokumentation" (ISO 5817 + EXC,
                 ehrlich als nicht rechenwirksam beschriftet, 2.7)
                 **+ Versionszeile im Info-ⓘ (siehe 3.6)**.
                 Schnittstellen: 4.10 / 4.10b / 4.10c (ui.js).
Basislinie   : 822 Assertions · DOM-Smokes 440 (voll) + 441 (test) · i18n-Parität 0
               (VERBINDLICH. Basislinie darf nur WACHSEN.)
Dateistand   : siehe Abschnitt 8.1.
```

---

## 1 · ABSCHNITT 3.6 — Versionszeile *(neu hergeleitet, mit Befund)*

Der Info-ⓘ bekommt eine Zeile mit **Programmstand und Plan-Version, gebaut aus den
Modulkennungen** statt von Hand gepflegt. Gebaut wird das in **N5d**, ausgegeben in **N11**.

**Nachgemessener Ist-Stand (2026-07-28) — 10 von 13 Modulen tragen eine Kennung:**

| Modul | `VERSION` | Modul | `VERSION` |
|---|---|---|---|
| `daten.js` | `0.1.0-N1` | `schaubild.js` | `0.1.0-N2c` |
| `optionen.js` | `0.1.0-N1` | `solver.js` | `0.1.0-N3` |
| `validate.js` | `0.1.0-N1` | `rechenweg.js` | `0.1.0-N4` |
| `naht.js` | `0.1.0-N2` | `svglib.js` | `0.1.0-N2c` |
| `profil.js` | `0.1.0-N2b` | `ui.js` | `0.6.0` *(+ `ETAPPE`)* |

> ⚠️ **BEFUND, VOR N5d ZU ERLEDIGEN:** **`i18n_kern.js`, `i18n_hilfe.js` und
> `i18n_kerbfall.js` haben gar keine `VERSION`.** Eine Versionszeile, die aus den
> Modulkennungen gebaut wird, hätte dort drei stille Löcher — ausgerechnet in den Dateien,
> die sich am häufigsten ändern. **N5d muss die drei Kennungen zuerst nachrüsten**,
> danach die Zeile bauen. `dom_smoke_test.js` braucht keine (DEV-ONLY, 625 Bytes Wrapper).

---

## 2 · ABSCHNITT 4.10b — Schnittstelle der Eingabeseite *(neu hergeleitet aus dem Code)*

> Aus `ui.js`, `optionen.js` und `validate.js` nachgemessen, nicht erinnert.

**Das Formular wird erzeugt, nicht geschrieben.** Quelle sind ausschließlich
`optionen.js` (**20 Gruppen · 89 Optionen**) und `validate.js` (**28 Felder**, seit der
Feldbereinigung in N5c-1). Es gibt keine zweite Liste in den HTMLs.

**Festes Id-Schema — was der Anwender anklickt, bekommt eine Id:**

| Id | Bedeutung |
|---|---|
| `sel_<gruppe>` | Auswahlfeld einer Gruppe |
| `fld_<feld>` | Eingabefeld |
| `ev_<feld>` | „eigener Wert"-Haken eines überschreibbaren Felds |
| `row_g_<feld>` / `row_f_<feld>` | Zeilenrahmen (Gruppe bzw. Feld) — tragen die Klasse `fehlerhaft` |
| `presetSel` · `calcBtn` · `resetBtn` · `pruefBox` · `pruefListe` | Beispiele, Berechnen, Leeren, Prüfkasten |

**`ZUORDNUNG` in `ui.js` — 8 Bereiche**, je mit `leit` (führende Gruppe), `gruppen[]` und
`felder[]`. Ein Bereich erscheint nur, wenn seine Leitgruppe aktiv ist. **Die Filterregel
läuft über genau eine Funktion** (`Options.filter`) — nirgends eine zweite Fassung.

**Sitzung (aus `start()` zurückgegeben):**
`sprache()` · `setSprache()` · `theme()` · `setTheme()` · `zustand()` · `werte()` ·
`pruefen()` · `leeren()` · `hilfeZeigen()` · `hilfeSchliessen()`
— erweitert in N5c-1/N5c-2, siehe 4.10c.

---

## 3 · ABSCHNITT 4.10c — Schnittstelle der Ergebnisseite (N5c-1 + N5c-2)

**`validate.js` — die Übersetzung Formular → Rechenkern:**

| Aufruf | Zweck |
|---|---|
| `normiert(werte, zustand)` | `{ok, fehler, werte, a_aus_z}` — Zahlen als Zahlen; fehlt `a` und ist `z` da, wird `a = z/√2` abgeleitet und mit `a_aus_z` ausgewiesen |
| `rechenEingabe(werte, zustand)` | `{ok, fehler, eingabe, a_aus_z}` — fertige Eingabe für `solver.rechne()` |
| `PROFIL_FELDER` | die Feldcodes, die zur Geometrie gehören |

`a` und `t1` stehen **in `profil_eingabe` UND flach** — der Rechenkern wertet beide Stellen
aus (a-Maß je Segment bzw. `t_min` als Rückfallebene). Das z-Maß wird **nicht**
durchgereicht: daraus ist `a` geworden, zwei Wege zum selben Maß wären eine Doppelquelle.

**`optionen.js`:** `BEISPIELE` (3 Einträge: `code`, `name` = i18n-Schlüssel, `auswahl{}`,
`felder{}`) und `beispiel(code)`.

**`ui.js` — neu in der Sitzung:**
`beispiele()` · `beispielLaden(code)` · `rechnen()` · `ergebnisLeeren()` · `ergebnis()` ·
`rechenweg()`.
**Neue Ids:** `ergBox` `ergAmpel` `ergKacheln` `ergGerechnetMit` · `wegBox` `rwBilanz`
`rwLuecken` · `grafikBox` `grafikSvg` `grafikLegende`.
**Neue Klassen:** `erg-box` `tile-k` · `weg-box` `rw-abschnitt` `rw-bilanz` ·
`grafik-box` `grafik-svg` `grafik-legende` `legende-eintrag` `legende-punkt` `legende-text`.

**DIE GRENZE VON `ui.js` — geschärft, nicht aufgeweicht.**
Erlaubt sind **genau drei** Module: `DTNSolver` (rechnet), `DTNRechenweg` (beschriftet),
`DTNSchaubild` (zeichnet). **Verboten bleiben `DTNNaht`, `DTNProfil` und `DTNData`** — die
holt sich der Solver selbst. Ebenso verboten bleibt jede eigene Rechnung; die Prüfung auf
`Math.` steht unverändert.

> **Achtung, zweimal zugeschnappt:** Die Prüfung liest den Quelltext als **Zeichenkette,
> Kommentare eingeschlossen.** In `ui.js` dürfen die verbotenen Namen und `Math.` auch im
> Fließtext eines Kommentars nicht vorkommen.

---

## 4 · ABSCHNITT 5.2 — Etappentabelle

| **N5c-1** ✅ | *(abgenommen 2026-07-28)* Feldbereinigung, drei Beispiele, Übersetzung Formular → `profil_eingabe`, „Berechnen" rechnet wirklich, Ergebnis-Kacheln mit Ampel | Beispiel antippen, rechnen, eine Zahl und eine Ampel sehen |
| **N5c-2** ✅ | *(gebaut 2026-07-28, Abnahme offen)* Rechenweg mit 10 Abschnitten, Nahtbild-Grafik mit dreisprachiger Legende, die zwei Häkchenarten getrennt, Liste 2.4 sichtbar, Zahlformat je Sprache aus `rechenweg.js` | Ein vollständiger Nachweis von der Eingabe bis zur Quellenangabe |
| **N5d** ⬅ | *(nächster Bau)* Block „Ausführung & Dokumentation" (ISO 5817 + EXC, ehrlich als nicht rechenwirksam, 2.7) **+ Versionszeile im Info-ⓘ (3.6, mit dem Befund oben)** | Der Block klappt auf; der Programmstand ist am Handy ablesbar |

---

## 5 · ABSCHNITT 8.1 — Dateistand nach N5c-2

| Datei | Stand |
|---|---|
| `validate.js` | **N5c-1** — `l` entfernt (**28 Felder**), `t1` profilabhängig, `t2` freiwillig, Längenprüfungen sitzen im Solver, `normiert()` + `rechenEingabe()` |
| `optionen.js` | **N5c-1** — `BEISPIELE` (3) und `beispiel()`; Gruppen/Optionen unverändert (**20 / 89**) |
| `profil.js` | **N5c-1** — `msg_endkrater_zu_lang` zeigt auf Feld `a` statt `l` |
| `ui.js` | **N5c-2** — Beispiele, Übersetzung, Rechnen, Kacheln, **Rechenweg, Nahtbild-Grafik, Liste 2.4**; Zahlformat aus `rechenweg.js` |
| `i18n_kern.js` | **N5c-2** — Beispielnamen, Ergebnis- und Rechenwegtexte, Quellenangaben; überholte Ankündigungstexte richtiggestellt |
| `i18n_hilfe.js` | **N5c-1** — Laien-ⓘ zu `t2` |
| `style.css` | **N5c-2** — `.erg-box`, `.tile .tile-k`, `.rw-abschnitt`, `.rw-bilanz`, `.weg-box`, Grafik- und Legendenstile |
| `test_naht.js` | **N5c-2** — S10 umgehängt, **S31** + **S32** neu, S29/S30 auf drei erlaubte Module geschärft |
| `dom_smoke_voll.js` | **N5c-2** — Feldbereinigung, Beispiele, Rechnen, Kacheln, Rechenweg, Grafik |

**Unverändert durch N5c-1 und N5c-2:** **beide HTMLs** (Unterschied weiterhin **genau eine
Zeile**; alle 13 `<script src>` lagen seit N5a richtig), `daten.js`, `naht.js`, `svglib.js`,
`schaubild.js`, `solver.js`, `rechenweg.js`, `i18n_kerbfall.js`, `dom_smoke_test.js`.

**Was N5d anfassen wird:** `ui.js`, `style.css`, `i18n_kern.js`, die drei `i18n_*.js`
(Kennungen), Harness und Smoke.

---

## 6 · ENTSCHEIDUNGSLOG — neuer Block

**Aus N5c-1 (2026-07-28):**

- **Die Beispiele sind Daten in `optionen.js`, nicht in `ui.js`.** Ein Beispiel ist nichts
  als eine Menge von Auswahlcodes plus ein paar Zahlen. In `ui.js` wüsste die Oberfläche
  plötzlich Werkstoffe und Profile — genau das, was 4.10 ausschließt. **N7 wächst auf
  derselben Struktur weiter.**
- **Die zwei Längenprüfungen wurden umgehängt, nicht gestrichen.** `l_eff ≥ max(6a; 30)`
  und `l ≤ 150·a` laufen je Segment im Solver an der echten Geometrie. Vorher nachgemessen:
  b 35/a 5 → zu kurz · b 1008/a 4 → zu lang · b 608/a 4 (genau 150·a) → still. 3 → 6 Assertions.
- **Die gesperrten Tabellenfelder werden nach dem Rechnen gefüllt** — mit den Werten, mit
  denen wirklich gerechnet wurde, samt Herkunft im Titel. Zuordnung über den **Feldnamen**,
  nicht über Fachwissen; ein gesetzter „eigener Wert"-Haken bleibt unangetastet.
- **Zwei echte Fehler, die erst der Test gefunden hat:** das Zahlformat der Kacheln ging
  beim Sprachwechsel nicht mit (Zahlen tragen kein `data-i18n`), und der Ergebnis-
  Platzhalter wurde zerstört statt ausgeblendet — dadurch gab es seine Id doppelt.

**Aus N5c-2 (2026-07-28):**

- **Die Erlaubnisliste wuchs um ZWEI Namen, nicht um einen.** Der Vorlauf-Nachtrag hatte
  „wieder genau einen" behauptet; N5c-2 bringt aber zwei Anzeigen. Beide sind reine
  Anzeige-Module — sie rechnen den Nachweis nicht noch einmal.
- **Die bewusste Doppelung aus N5c-1 ist aufgelöst.** Das Zahlformat kommt jetzt aus
  `rechenweg.zahl()` — eine Quelle, mit Tausenderpunkt und je Sprache richtig. Der Zweig
  ohne Modul bleibt nur als Rückfallebene stehen.
- **Ein vermeintlicher Fehler, der keiner war — und warum das wichtig ist:** Die Anzeige
  zeigte **22** Rechenproben-Häkchen, `rechenweg.js` zählte **21**. Nachgemessen statt
  angepasst: die Summenzeile der Selbstprüfung wird erst **nach** dem Zählen gebildet und
  **zählt sich selbst nicht mit** — so steht es im Quelltext. Nicht das Modul war falsch,
  sondern meine Assertion. Sie prüft jetzt `angezeigt = gezählt + 1` **mit Begründung**,
  damit niemand später „korrigiert", was Absicht ist.
- **Die zwei Häkchenarten werden im Smoke wirklich gezählt**, nicht nur ihre Klassen
  gesucht: `rw-haken` (Rechenprobe — ein Kreuz hieße, das Programm rechnet falsch) und
  `rw-nachweis` (Nachweis — ein Kreuz heißt, die Naht trägt so nicht). Beide haben eigene
  Erklärtexte im Titel.
- **Beide HTMLs blieben erneut unverändert.** Auch die Grafik- und Rechenwegkarten samt
  Platzhaltern lagen seit N5a bereit.

**Zum Verfahren (2026-07-28):**

- Der Projektordner lieferte beim Chatstart die Plandatei als **v2.17**, die Projektsuche
  Bruchstücke von **v2.23**; der Code daneben war neuer als beides. **Lehre:** Beim
  Wiedereinstieg zuerst die drei Testläufe fahren — sie verraten sofort, ob Plandatei und
  Code zusammenpassen. Steht dort eine andere Basislinie als im Kopfblock, ist die Datei alt.
- **Fehlende Plan-Abschnitte werden aus dem Code neu hergeleitet, nicht aus dem Gedächtnis
  rekonstruiert.** So sind 4.10b und 3.6 in dieser Datei entstanden — nachgemessen.

---

## 7 · CHANGELOG — neue Einträge

**v2.24 (2026-07-28):** **N5c-1 („Es rechnet") gebaut, ausgeliefert und am Handy
abgenommen.** Feldbereinigung (`l` entfällt, 29 → **28** Felder; `t1` profilabhängig
Pflicht; `t2` freiwillig; `msg_endkrater_zu_lang` auf `a`), Längenprüfungen **umgehängt
statt gestrichen** (3 → 6 Assertions). **Drei Beispiele** als Daten in `optionen.js`, mit
*erst leeren, dann laden* (3.5): RHS 120×80×6 → 4 Segmente/328 mm/η 0,359 · HEB 200 Steg →
2/324/0,626 · Blech 80×10 → 2/140/0,842, alle warnungsfrei. **Übersetzung** in
`validate.js` (`normiert()`, `rechenEingabe()`). **„Berechnen" rechnet wirklich**;
**Ergebnis-Kacheln** mit Ampel; gesperrte Felder werden aus `ergebnis.widerstand` gefüllt.
Fachlogik-Assertion **geschärft** (genau ein Rechenmodul). Neue Sektion **S31**.
**Basislinie 724 → 764 · Smokes 385/386 → 418/419.**

**v2.25 (2026-07-28):** **N5c-2 („Es erklärt sich") gebaut und ausgeliefert.**
**Rechenweg vollständig** (10 Abschnitte, Formel im Klartext, eingesetzte Zahlen, Quelle je
Schritt) über `rechenweg.ausErgebnis()` + `rendere()`. **Nahtbild-Grafik** aus
`schaubild.ausProfil()` mit dreisprachiger Legende. **Die zwei Häkchenarten optisch
getrennt** (4.9): `rw-haken` und `rw-nachweis`, je mit eigenem Erklärtext. **Liste 2.4
sichtbar** (10 benannte Lücken) samt Warnungen. **Zahlformat je Sprache** jetzt aus
`rechenweg.zahl()` — die Notlösung aus N5c-1 ist abgelöst, es gibt nur noch eine Fassung.
Erlaubnisliste für `ui.js` auf **drei Anzeige-Module** erweitert (`DTNSolver`,
`DTNRechenweg`, `DTNSchaubild`), verboten bleiben `DTNNaht`, `DTNProfil`, `DTNData`.
Neue Sektion **S32** (Vollständigkeit, Dreisprachigkeit ohne Platzhalter, Trennung der
Häkchenarten, Legendencodes, Zahlformat). Zwei überholte Ankündigungstexte richtiggestellt.
**Abschnitte 3.6 und 4.10b aus dem Code neu hergeleitet**, mit Befund: **drei i18n-Module
haben keine `VERSION`** — vor der Versionszeile in N5d nachzurüsten.
**Basislinie 764 → 822 Assertions · Smokes 418/419 → 440/441 · i18n-Parität 0.**
**Nächster Schritt: N5c-2 am Handy prüfen, dann N5d.**

---

*Fortschreibung 2026-07-28 · gehört zu `Schweißnaht-1.md` · ersetzt die N5c-1-Fassung*
