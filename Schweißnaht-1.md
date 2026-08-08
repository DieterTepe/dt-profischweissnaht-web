# 🔩 DT-ProfiSchweissnaht — Bauplan (Schweißnaht-1.md · alleinige Grundlage für das Bauen)

## Schweißnahtberechnung für Stahlbau **und** Maschinenbau — statischer Nachweis, Ermüdung,
## Wärmeführung, Kosten, Verzug · dreisprachig (DE/EN/PT) · offline · Handy zuerst

> **Diese Datei ersetzt `Schweißnaht.md` vollständig.** Sie enthält den Stand nach dem
> Konzeptgespräch (2026-07-23), nach der abgeschlossenen Recherche (R1–R6), nach der
> Abstimmung vom **2026-07-24** (alle offenen Fragen aus Abschnitt 0 geklärt) und nach den
> abgenommenen Bausteinen **N1, N2, N2b, N2c, N3, N4**, **N5 vollständig**
> (N5a, N5b, N5c-1 bis N5c-3, N5d), **N6b**, **N7**, **N8 vollständig**
> (N8a, N8b-1, N8b-2, N8c), **N9 vollständig** (N9a–N9d) und
> **N10 vollständig** (N10a–N10c) und **N11 (Ausgaben)**, dazu **N12 (Edition,
> Registrierung, Druckbild)** gebaut und geliefert — Stand 2026-08-07.
> **Der LAUNCH-CHECKPOINT ist damit erreicht.**
> Sie ist so geschrieben, dass ein **neuer Chat ohne Vorwissen** damit weiterarbeiten kann.
> **Das WARUM steht in `Schweißnaht-Historie.md`** (Entscheidungslog + Changelog im
> Volltext) — dort nachschlagen, bevor etwas geändert wird, das falsch aussieht.
>
> **AUFBAU (neu seit v2.80, P2): fünf Teile, sortiert danach, WANN man etwas braucht.**
> **A — Vor dem Bau** (Sitzungsablauf und das gesamte querliegende Regelwerk) ·
> **B — Das Produkt** · **C — Die Architektur** · **D — Der Bauplan** ·
> **E — Dateistand**.
> ⚠️ **Die Abschnittsnummern sind UNVERÄNDERT** (1, 2.x, 4.12, 9.2 …) — aus dem Code
> heraus wird auf sie verwiesen. Die Teile sind eine Wegweisung ÜBER der bestehenden
> Nummerierung, keine neue Nummerierung.
> **Die Erzählung abgeschlossener Bausteine ist in die Historie gewandert**; was
> künftige Arbeit steuert, ist hier geblieben. Wegweiser in **9.3**.
> Einstieg: **„weiter mit N13"** — davor der Reihenfolge in Kickoff-Punkt 5b folgen.
> `N6b_Vorlauf-Messwerte.md` ist nach der Abnahme **gelöscht worden** — der Inhalt steht
> in 4.11 und in der Historie. Im Projektordner liegt **keine Vorlaufdatei** mehr.

```
Plan-Version : 2.82 · Stand 2026-08-08
Codestand    : Plan 2.78 · ui 0.20.2 · P1
               (Die Planversion, gegen die der CODE gebaut ist. Sie steht auch
               in ui.js als PLAN und wird von einer Assertion damit verglichen.
               Sie wandert nur mit, wenn sich Code ändert — reine Plan- oder
               Abnahmeeinträge lassen sie stehen.)
Status       : N1 (Fundament), N2 (Nahtbild-Kern), N2b (Profileingabe),
               N2c (Nahtbild-Grafik), N3 (Spannungen + beide Welten),
               N4 (Rechenweg) und **N5 VOLLSTÄNDIG** — N5a (UI-Grundgerüst),
               N5b (Eingabeseite), N5c-1, N5c-2, N5c-3 und **N5d
               („Ausführung & Dokumentation" + Versionszeile)** — alle von
               Dieter am Handy geprüft und ABGENOMMEN.
               **Baustein N6b (ISO-2553-Symbolgenerator) ist von Dieter am
               Handy geprüft und ABGENOMMEN (2026-08-04).**
               **Baustein N7 (Beispielkatalog, 12 Fälle) ist von Dieter am
               Handy geprüft und ABGENOMMEN (2026-08-04), ohne Nacharbeit.**
               Er hat dabei VIER Fehler aus N5c aufgedeckt und behoben (5.1-3).
               Projektordner /mnt/project/ ist auf diesem Stand — nach N7
               am 2026-08-04 gegengeprüft: Vollständigkeit gegen 8.1, die
               drei Testläufe direkt aus dem Ordner grün (1553 / 611 / 612),
               `node --check` über alle 17 JS sauber, beide HTMLs mit genau
               einer Zeile Unterschied, alle 30 Dateien byteweise identisch
               angekommen und die zwölf nicht angefassten Module unverändert.
               Es liegt NICHTS Halbes und nichts Zusätzliches im Ordner.
               **Etappe N8a (Dialoglogik) ist von Dieter am Handy geprüft
               und ABGENOMMEN (2026-08-04), ohne Nacharbeit.** Belegt: die
               Versionszeile mit **15 Modulen** samt `assistent 0.1.0-N8a`
               und `ui 0.9.1`, und **alle zwölf Beispiele grün, Nachweis
               erfüllt** — die neue Skript-Zeile in beiden HTMLs hat nichts
               gestört.
               **Baustein N8 ist von Dieter am Handy geprüft und
               ABGENOMMEN (2026-08-04), ohne Nacharbeit.** Belegt: die
               Versionszeile mit **16 Modulen** samt `skizze 0.1.0-N8b`
               und `ui 0.10.0`; ein Durchlauf des **Auslegungsfalls mit
               Moment** (a gesucht) grün mit erfülltem Nachweis; und der
               **Sprachwechsel bei offenem Dialog** in allen drei Sprachen.
               **Etappe N9a ist von Dieter am Handy geprüft und
               ABGENOMMEN (2026-08-05), ohne Nacharbeit.** Belegt: die
               Versionszeile mit **17 Modulen**, `thermik 0.1.0-N9a`,
               `ui 0.10.1` und **allen fünf korrigierten Kennungen**;
               dazu mehrere durchgerechnete Beispiele und ein
               Assistentenlauf — die vier Module mit der
               Ein-Zeilen-Änderung haben nichts gestört.
               **Etappe N9b ist von Dieter am Handy geprüft und
               ABGENOMMEN (2026-08-05).** **Etappe N9c ist GEBAUT und
               GELIEFERT** — Abnahme steht aus. Sie bringt den
               Beispielkatalog von zwölf auf **vierzehn**, gibt allen
               Beispielen Wärmeführungsdaten und repariert dabei die
               **geometrische Lasteingabe**, die seit N3 tot war.
               **Baustein N9 ist vollständig von Dieter am Handy geprüft
               und ABGENOMMEN (2026-08-05).** Damit sind **sechs von zehn
               Bausteinen bis zum Verkaufsstand** fertig.
               **Etappe N10a ist von Dieter am Handy geprüft und
               ABGENOMMEN (2026-08-05).** Belegt durch die Versionszeile
               mit **18 Modulen** und ein gerechnetes Beispiel mit
               vollständiger Wärmeführungsanzeige — `i18n_kern.js` und
               beide HTMLs waren angefasst worden.
               **Baustein N10 ist vollständig von Dieter am Handy geprüft
               und ABGENOMMEN (2026-08-05)** — einschließlich der Probe,
               dass ein größeres a-Maß den Drahtbedarf mitzieht. Damit sind
               **sieben von zehn Bausteinen bis zum Verkaufsstand** fertig.
               **N10c ist geprüft und ABGENOMMEN (2026-08-06)** — beide
               Fehler sind weg. Das **Dateiformat für N11 ist entschieden**
               (5.1-8).
               **Baustein N11 (Ausgaben) ist von Dieter geprüft und
               vollständig ABGENOMMEN (2026-08-07)** — alle vier Ausgaben
               liefen; Word öffnet die Datei, und das eingebettete Nahtbild
               ist am PC sichtbar. **Benannte Einschränkung: die Word-App
               unter Android zeigt in RTF eingebettete Bilder nicht an** —
               für ein Dokument mit Bild auf mobilen Geräten ist
               „Drucken / PDF" der Weg (5.1-9).
               **Zwei Befunde aus der gelieferten Word-Datei sind
               nachgearbeitet** (5.1-9): die Karten der Wärmeführung und
               der Kostenrechnung klebten Beschriftung und Wert zusammen,
               und die Liste 2.4 stand zweimal im Blatt. Neu ist `report.js`
               (**19 Module**): `.dts` speichern und öffnen mit
               Versionsstempel, Drucken/PDF über ein eigenes Druckbild,
               Word (.rtf) mit Bildern und Rückfallweg, und das **Gating
               gebündelt an einer einzigen Stelle**. Der **Namensabgleich
               aus 3.6 ist damit erledigt** — die Versionszeile zeigt jetzt
               Dateinamen. Ergebnis in **5.1-9**, Schnittstelle in **4.12**.
               Damit sind **acht von zehn Bausteinen bis zum Verkaufsstand**
               fertig.
               **Baustein N12 ist von Dieter am Handy geprüft und
               ABGENOMMEN (2026-08-07)** — mit einer Nacharbeit: „Später"
               darf sich nicht merken lassen (5.1-10). Er bringt die **Registrierung** (Name +
               Digistore-Schlüssel, ohne jede Prüfung), die **Lizenzzeile in
               allen vier Ausgaben**, den **Lang-Druck zum Zurücksetzen** und
               die Reparatur des **Druckbilds** samt eigenem Druckkopf und
               Druckfuß. Ergebnis in **5.1-10**, ui-Teil in **4.10f**.
               Damit sind **neun von zehn Bausteinen bis zum Verkaufsstand**
               fertig und der **LAUNCH-CHECKPOINT ist erreicht**.
               **DER VERKAUFSSTAND WIRD VERÖFFENTLICHT** (Dieter,
               2026-08-07). Daraus folgen zwei kleine Aufträge VOR N13:
               **P1 (Hinweis „folgt in einem Update")** und **P2 (Neuordnung
               von Plandatei und Historie)** — beide in **5.3**, dazu die
               Verkaufsentscheidungen in **1a**.
               ✅ **P0 ist am Gerät geprüft und ABGENOMMEN (2026-08-08)** —
               mit `'voll'` im Kopf erscheint der Testbalken und alles ist
               gesperrt.
               ✅ **P1 ist am Gerät geprüft und ABGENOMMEN (2026-08-08)**,
               einschließlich der Nachträge P1b und P1c — Ergebnis in der
               **Historie** (mit P2 dorthin ausgelagert).
               **Die Auslieferungsform ist damit gesichert:** vor dem Zippen
               ist nur der Kopf der HTML anzufassen, nicht das Skript.
               ⚠️ **P0 (2026-08-08): DIE EDITIONSWEICHE WAR FALSCH HERUM.**
               `ui.js` fragte `(DT_EDITION === 'test') ? 'test' : 'full'` —
               alles, was nicht exakt `'test'` war, wurde zur **Vollversion**.
               Wer die Zeile im HTML-Kopf löschte oder vertippte, hatte alle
               Ausgaben frei. Von Dieter gefunden, behoben und geliefert;
               Ergebnis in der **Historie** (mit P2 dorthin ausgelagert).
               **P2 (Neuordnung von Plandatei und Historie) ist mit dieser
               Fassung ERLEDIGT** — 681 regelhafte Zeilen vorher erfasst,
               681 nachher wiedergefunden, kein Code angefasst.
               ✅ **DER VERKAUFSSTAND IST EINGEFROREN UND AUSGELIEFERT**
               (Dieter, 2026-08-08): Module zusammenkopiert und obfuskiert.
               **Damit ist die Einzeldatei-Fassung erledigt.** Verkaufter
               Stand: **P1 · Plan 2.78 · ui 0.20.2**. Die Folgen — vor
               allem die Lesbarkeit alter `.dts`-Dateien — in **5.3a**.
               → NÄCHSTER SCHRITT: Baustein
                 **N13 (Ermüdung)** — Einstieg „weiter mit N13";
                 **Umfang vor dem Bau abstimmen**.
                 Etappen stehen in 5.2 (Teil D).
                 ⚠️ **VORHER ZU ENTSCHEIDEN: woher Δσ kommt.** Der Vorschlag
                 liegt in **5.3** — zwei Lastzustände als der eine Weg,
                 „schwellend" und „Δσ direkt" als Abkürzungen. Dieter
                 2026-08-08: *überlegt, entscheidet nach der Reise.*
                 **Solange die Frage offen ist, wird an `ermuedung.js`
                 nicht gebaut** — sie prägt die Kernschnittstelle.
                 ✅ Die **Einzeldatei-Fassung** ist erledigt (5.3a).
                 Schnittstellen: 4.5 (naht.js), 4.6 (profil.js),
                 4.7 (svglib.js + schaubild.js), 4.8 (solver.js),
                 4.9 (rechenweg.js), 4.10 / 4.10b / 4.10c / 4.10d (ui.js),
                 4.11 (symbol.js), 4.12 (report.js) — alle in **Teil C**.
               Große Bausteine (N5, N8, N13, N14) werden in ETAPPEN gebaut — Regel in
               Kickoff-Punkt 5c, Etappen in Abschnitt 5.2.
Basislinie   : 3488 Assertions · DOM-Smokes 1121 (voll) + 1079 (test)
               + 1079 (kaputte Edition) · i18n-Parität 0 Abweichungen
               (VERBINDLICH. Basislinie darf nur WACHSEN — nie schrumpfen, nie gelockert werden.)
Dateistand   : siehe Abschnitt 8.1 in **Teil E** — dort steht, was fertig ist.
⚠️ SYNC       : Am 2026-08-03 lag im Projektordner eine **elf Versionen alte**
               Plandatei (v2.17, Basislinie 679/234/235) zu neuem Code. Gefunden
               hat es allein der Abgleich „Basislinie im Kopf gegen Basislinie
               gemessen" (Kickoff-Punkt 11). Diesen Abgleich NIE überspringen.
```

═══════════════════════════════════════════════════════════════════════════
# TEIL A — VOR DEM BAU
═══════════════════════════════════════════════════════════════════════════

> **Alles, was IMMER gilt — unabhängig davon, woran gerade gebaut wird.** Dieser Teil wird bei jedem Sitzungsbeginn gelesen. Regeln, die nur für ein bestimmtes Modul gelten, stehen bei diesem Modul in Teil C.

---

## A1 Der Sitzungsablauf

═══════════════════════════════════════════════════════════════════════════
# 🚀 KICKOFF — LIES DIES ZUERST (frische Claude-Instanz / neuer Chat)
═══════════════════════════════════════════════════════════════════════════

Du bist Claude und baust mit **Dieter Tepe** das Programm **DT-ProfiSchweissnaht**.

**1) KOMMUNIKATION: immer Deutsch.** Dieter arbeitet **ausschließlich am Handy**. Er hat
**kein Node, keine Konsole, keine Testprogramme**. Er prüft nur die gelieferten Dateien im
Browser (lädt sie auf GitHub Pages und klickt sie durch).

**2) DU TESTEST — vollständig und selbst.** Harte Zusage:
- **Assertion-Harness** (`test_naht.js`, DEV-ONLY) mit ok()-Zähler und Sektionen.
  Die Basislinie darf nur **WACHSEN** — nie schrumpfen, nie gelockert werden.
- **DOM-Smokes** mit Mini-DOM-Shim in Node, die **immer ALLE Module gemeinsam laden** und die
  Oberfläche echt durchklicken — je einer für Voll- und Testversion.
- **i18n-Parität** automatisiert: jeder Schlüssel in allen drei Sprachen, 0 Abweichungen.
- **Bei jeder Lieferung meldest du die Zahlen** (Assertions / Smokes / i18n).

**3) LIEFERFORM (Dieters Festlegung 2026-07-24):**
Immer **zwei HTML-Dateien + alle Module einzeln**:
```
DT-ProfiSchweissnaht.html        (window.DT_EDITION = 'full')
DT-ProfiSchweissnaht_Test.html   (window.DT_EDITION = 'test')
+ alle *.js und style.css als Einzeldateien im selben Ordner
```
Dieter legt sie in den GitHub-Ordner **`dt-profischweissnaht-web`**
(→ https://dietertepe.github.io/dt-profischweissnaht-web/) und in `/mnt/project/`.
**Kein Prüfstand mehr** — Dieter braucht ihn nicht (Entscheidung 2026-07-24).
Erst zum Verkauf werden HTML + alle Module zu **einer einzigen HTML** zusammenkopiert und
**obfuskiert** — zweimal, Unterschied nur `window.DT_EDITION`.

**4) REFERENZ-DATEIEN im Projektordner (nur lesen, Muster entnehmen):**
- `DT-ProfiPassung_Testversion-Orginal.html` — komplette lauffähige Testversion des
  Schwesterprogramms in **einer** Datei. Architektur-, Muster- und Design-Vorlage.
- `DT-ProfiPassung.html` + `DT-ProfiPassung_Test.html` — die schlanken Auslieferungs-HTMLs
  ohne Module. **Verifiziert: sie unterscheiden sich in exakt einer Zeile** (`DT_EDITION`).
  Daraus zu übernehmen: Kopfzeile mit Marke/Lizenzzeile, Sprachumschalter DE/EN/PT mit
  Flaggen-SVG, Theme- und Info-Button, Subbar mit „Beispiel laden" + Berechnen + Leeren +
  Aktionsleiste (Bezeichnungsfeld, Speichern, Öffnen, Drucken/PDF, Word .rtf), `notranslate`.

**Niemals Passungs-/Schrauben-Fachlogik umwidmen — nur Muster übernehmen.**

**5) ARBEITSWEISE JE BAUSTEIN (Fließband, minimale Diffs):**
bauen → `node --check` über alle JS → i18n-Parität → DOM-Smokes → Harness grün →
Dateien nach `/mnt/user-data/outputs/` → `present_files` → **knappe deutsche Zusammenfassung,
welche Dateien zu überschreiben sind** → Dieter bestätigt am Handy → erst dann der nächste
Schritt. Danach Plan-Kopf (Version/Status/Basislinie) + Changelog pflegen.

**5b) WIEDEREINSTIEG IN EINEM NEUEN CHAT — genau diese Reihenfolge:**
Einstiegssatz von Dieter: **„weiter mit N13"**.
1. Diese Datei komplett lesen (`Schweißnaht-1.md`, sie ist die alleinige Grundlage
   für das Bauen).
   **`Schweißnaht-Historie.md` NICHT vorab lesen** — sie enthält Entscheidungslog und
   Changelog im Volltext und wird nur bei Bedarf aufgeschlagen: **bevor** man etwas
   ändert, das falsch aussieht (Regel und Wegweiser in Abschnitt 9). Sie wird nur
   hinten ergänzt, nie aktualisiert, und kann deshalb nicht veralten.
2. Abschnitt **8.1** lesen: was ist fertig, was fehlt.
3. Abschnitt **4.5** lesen: die fertige Schnittstelle von `naht.js` (N2).
4. Abschnitt **4.6** lesen: die fertige Schnittstelle von `profil.js` (N2b) — darauf setzen
   die Grafik und N7 (Presets) auf. Fachlicher Hintergrund steht in **2.2b**.
5. Abschnitt **4.7** lesen: die fertige Schnittstelle von `svglib.js` + `schaubild.js`
   (N2c) — **darauf setzt N5c unmittelbar auf** (Nahtbild-Karte), dazu N6b und N14.
6. Abschnitt **4.8** lesen: die fertige Schnittstelle von `solver.js` (N3).
7. Abschnitt **4.9** lesen: die fertige Schnittstelle von `rechenweg.js` (N4) — **darauf
   setzt N5c unmittelbar auf.** Wichtig ist dort besonders, dass N5 nur RENDERT und
   die beiden Häkchenarten (Rechenprobe / Nachweis) nicht vermischt.
8. Abschnitt **4.10** lesen: die Schnittstelle von `ui.js` — **alle drei Teile**, N5a
   (Grundgerüst), **4.10b** (Eingabeseite, N5b) und **4.10c** (Ergebnisseite, N5c). Dort
   steht das Id-Schema, die Zuordnung, die Sichtbarkeitsregel, welche drei Module `ui.js`
   aufrufen darf und ausdrücklich, was es nicht tut.
9. Abschnitt **5.1** lesen: alles dort ist **gelieferter** Umfang und damit nur noch
   Begründung; **5.1-8** (Dateiformat) und **5.1-9** (N11) sind die jüngsten.
   Abschnitt **5.2**: die Etappenteilung der großen Bausteine.
10. **Vollständigkeit des Projektordners prüfen** (Liste in 8.1): 19 Module, `style.css`,
   beide HTMLs und **alle drei** DEV-ONLY-Dateien, dazu `Schweißnaht-Historie.md`.
   `dom_smoke_test.js` allein läuft nicht, sie ruft `dom_smoke_voll.js` auf — fehlt eine
   davon, zuerst bei Dieter nachfragen. **Das ist keine Formsache:** beim Austausch sind
   schon zweimal Dateien verlorengegangen, beide Male hat diese Prüfung es gefunden.
11. Arbeitsordner herstellen (Befehl unter Punkt 6 der Kickoff-Liste), dann
   `node test_naht.js`, `node dom_smoke_voll.js`, `node dom_smoke_test.js` laufen lassen
   und die Basislinie aus dem Plan-Kopf bestätigen (**3488 / 1121 / 1079 / 1079 · 0 Fehler**),
   **bevor** etwas gebaut wird. Weicht etwas ab, erst das klären.
   ⚠️ **Diese drei Läufe sind zugleich die Probe, ob Plandatei und Code zusammenpassen.**
   Steht im Kopfblock eine andere Basislinie als gemessen, ist eine der beiden Seiten alt —
   dann NICHT bauen, sondern erst mit Dieter klären. **Das ist zweimal passiert:** am
   2026-07-28 lag eine drei Etappen alte Plandatei im Ordner, am 2026-08-03 eine elf
   Versionen alte (v2.17, Basislinie 679/234/235) zu Code auf Stand N5c-2. Beide Male
   war dieser Abgleich die einzige Stelle, die es gemerkt hat.
12. Erst dann den **nächsten Baustein** bauen — Fließband nach Punkt 5 der Kickoff-Liste.
    **Der Umfang ist VOR dem Bau mit Dieter abzustimmen.**
    ✅ Erledigt in N5d: `i18n_kern.js`, `i18n_hilfe.js` und `i18n_kerbfall.js`
    tragen jetzt eine `VERSION` — alle 13 Module sind gekennzeichnet (3.6).

**5c) GROSSE BAUSTEINE WERDEN VORHER IN ETAPPEN ZERLEGT — BINDEND**
*(Dieters Festlegung 2026-07-26, Begründung im Entscheidungslog)*

Der Kontext eines Chats überlebt eine Token-Pause, aber **nicht** einen Chatwechsel. Reißt
ein Chat mitten in einem Baustein ab, ist das Einzige, was überlebt, **diese Datei**.
Daraus folgt die harte Regel:

> **Nie mitten im Modul aufhören — immer an einer grünen Messung.**
> Ein Zwischenstand darf niemals „Datei halb geschrieben" heißen. Er heißt:
> *Modul läuft, `node --check` sauber, i18n-Parität 0, DOM-Smokes und Harness grün —
> der Umfang ist aber noch unvollständig, und der fehlende Teil steht als eigene,
> benannte Etappe im Plan.*

**Verfahren, wenn ein Baustein absehbar nicht in ein Kontingent passt:**
1. **VOR dem ersten Codezeichen** die Etappen festlegen und in Abschnitt **5.2** eintragen,
   Dieter bestätigt sie. Das kostet fast nichts und ist die ganze Absicherung.
2. Jede Etappe ist **einzeln lieferbar und einzeln abnehmbar** — mit eigenen Assertions,
   eigener Smoke-Erweiterung und einer eigenen Zeile im Changelog.
3. Nach jeder Etappe: Plan-Kopf (Status/Basislinie) und Abschnitt 8.1 fortschreiben, damit
   ein neuer Chat **schwarz auf weiß** liest, welche Etappe fertig ist und welche folgt.
4. Der Plan-Kopf nennt dann nicht nur den Baustein, sondern die **Etappe**
   (z. B. „nächster Schritt: N5, Etappe b").
5. Läuft ein Chat trotzdem unerwartet aus: **die letzte grüne Lieferung ist der Stand.**
   Halbfertiges wird verworfen, nicht gerettet — Wiederherstellungsversuche aus dem
   Gedächtnis sind die gefährlichste Fehlerquelle des ganzen Projekts.

**Betroffen sind nach heutiger Einschätzung: N5, N8, N13 und N14** (Etappen in 5.2).
Kleine Bausteine (N6b, N7, N9, N10, N11, N12, N15) bleiben einteilig — wenn sich das
beim Bauen als falsch erweist, wird geteilt statt gehetzt.
**N4 hat die Einteilung bestätigt:** einteilig gebaut, in einem Zug grün geliefert.

**6) TOKEN-PAUSEN:** Dieter stoppt bei ~90 % Verbrauch, Pause **4 Stunden**, dann weiter.
Vor der Pause den genauen Stand nennen; Wiedereinstieg mit „weiter mit <Baustein>".
Container-Reset löscht Zwischenstände → **nach jeder Änderung ausliefern**.
Arbeitsordner wiederherstellen:
```
rm -rf /home/claude/dtn && mkdir -p /home/claude/dtn && cp /mnt/project/* /home/claude/dtn/
```

**7) RECHERCHE:** Die Grundlagenrecherche **R1–R6 ist abgeschlossen** (5 Dateien im
Projektordner, siehe Abschnitt 8). Weitere Recherche läuft **just-in-time je Baustein**, nicht
auf Vorrat. Dieter muss sie im Chat **freischalten** — also rechtzeitig ansagen, was gebraucht
wird, notfalls mit 4-Stunden-Pause.

**8) STEHENDE REGELN:**
- **Jede** Berechnung liefert einen **selbstprüfenden Rechenweg**: Formel im Klartext +
  eingesetzte Zahlenwerte + Häkchen. Das ist das Nachweis-Herzstück des Produkts —
  **vollständig in der gewählten Sprache**, inklusive aller Formel- und Werte-Beschriftungen.
- **Laien-ⓘ an JEDEM Eingabefeld** (Was ist das · Bereich · empfohlener Wert), dreisprachig.
- **Alle Tabellenwerte** aus Auswahllisten mit **„eigener Wert"-Haken** (vorbelegen + sperren,
  per Haken frei überschreibbar). Nach Änderung + „Berechnen" wird alles neu durchgerechnet.
- **Normtabellenwerte sind maßgeblich, nicht Formeln.** Jeder Zahlenwert braucht **≥ 2
  unabhängige Quellen**. **Ehrliche Lücken** (sichtbarer Hinweis) statt erfundener oder still
  interpolierter Werte.
- **Offline hart:** kein CDN, kein fetch, kein ES-Import. Klassische `<script src>` in
  Abhängigkeitsreihenfolge, UMD/IIFE, DOM-freie Kernlogik (in Node testbar).
- **i18n DE/EN/PT von Anfang an.** Logik nutzt **sprachneutrale Codes**; Texte leben
  ausschließlich im i18n-Wörterbuch.
- **`/mnt/project/` + GitHub sind die Source of Truth** (Dieter pflegt sie nach jedem Schritt).
- **Leitziel (Dieters Kernsatz):** *Ein Laie soll mit möglichst wenigen Eingaben ans Ziel
  kommen — bestens informiert, geführt, und möglichst nur durch Auswählen.*

═══════════════════════════════════════════════════════════════════════════

---

## A2 Das Regelwerk — alle querliegenden Regeln an einer Stelle

> **Hier stand bis v2.80 nichts — die Regeln lagen in Abschnitt 7, 9.1 und 9.2 verstreut, dazu im Kickoff.** Am 08.08. lag deshalb sechsmal an einem Tag eine Prüfung *neben* der Sache statt *auf* ihr. Jetzt stehen sie beisammen und nach Themen sortiert. **Die Abschnittsnummern 7, 9.1, 9.2 und 9.3 bleiben unverändert**, weil aus dem Code heraus auf sie verwiesen wird.

## 9. Entscheidungslog — **verdichtet; der Volltext steht in `Schweißnaht-Historie.md`**

**Warum geteilt (2026-07-28):** Entscheidungslog und Changelog waren zusammen **45 % dieser
Datei** (rund 21 000 Token), die in *jedem* neuen Chat mitgelesen wurden, bevor irgendetwas
gebaut wird. Beim Nachmessen zeigte sich: von 160 Einträgen tragen **13** überhaupt eine
Verpflichtung — der Rest ist **Begründung**. Die Vorschriften stehen ohnehin in den
Abschnitten 2, 3, 4 und 6; die Begründungen werden nur gebraucht, wenn jemand etwas ändern
will. Also: Vorschriften und Wegweiser bleiben hier, die Erzählung wandert.

> **`Schweißnaht-Historie.md` ist ANHÄNGEND, nicht pflegend.** Dort wird nur hinten
> ergänzt, nie etwas aktualisiert. Deshalb kann sie nicht veralten und nicht von dieser
> Datei abweichen — anders als eine zweite, mitzupflegende Quelle. **Diese Datei bleibt die
> alleinige Grundlage für das Bauen.**

---

### 9.1 DIE WICHTIGSTE REGEL AUS DEM LOG

> ⚠️ **Sieht etwas im Code falsch aus, erst in der Historie nachlesen — dann erst ändern.**
>
> Beispiel aus N5c-2, das genau daran hing: Die Anzeige zeigte **22** Rechenproben-Häkchen,
> `rechenweg.js` zählte **21**. Wer das für einen Fehler hält, „korrigiert" eine Absicht
> kaputt — die Summenzeile der Selbstprüfung wird erst **nach** dem Zählen gebildet und
> zählt sich selbst nicht mit. Die Assertion prüft deshalb `angezeigt = gezählt + 1`.
>
> **Vieles in diesem Programm sieht aus wie ein Fehler und ist eine begründete
> Entscheidung.** Die Begründung steht in der Historie, nach Bausteinen sortiert.

---

### 9.2 Festlegungen, die beim Bauen etwas verbieten oder vorschreiben

> **80 Regeln, thematisch sortiert.** Bis v2.80 standen sie in der Reihenfolge, in der sie gelernt wurden — wer wissen wollte, ob es zu einer Sache schon eine Regel gibt, musste achtzig Punkte lesen. **Der Wortlaut ist unverändert; nur die Reihenfolge ist neu.**
>
> *(Alles Weitere ist in 2/3/4/6 geregelt; hier nur, was sonst nirgends steht.)*

#### 9.2.1 Arbeitsweise, Lieferung, Übergabe

- **Ein getrimmter Changelog-Eintrag wandert in die HISTORIE, nicht ins Nichts**
  (2026-08-08, P2): Der Plan versprach seit v1.0, die vollständige Fassung stehe in
  der Historie — **den Mechanismus dafür gab es nie**, und beim Trimmen auf drei
  Einträge sind v2.65 bis v2.72 gelöscht worden. **Eine Zusage ohne Handgriff ist
  keine Zusage.** Wer etwas auslagert, prüft einmal nach, ob es am Zielort ankommt.
- **Jede Erhöhung der Planversion bekommt einen Changelog-Eintrag** (2026-08-08, P2):
  v2.75, v2.77, v2.78 und v2.79 hat es nie gegeben — die Nummer wurde hochgezählt,
  der Eintrag blieb aus. **Eine Versionsnummer ohne Eintrag lässt später jemanden
  suchen, was da passiert ist.** Zwei Zeilen genügen, aber sie müssen dastehen.

- **Basislinie darf nur WACHSEN** — nie schrumpfen, nie gelockert werden. Fällt eine Zahl,
  ist das ein harter Halt (Kopfblock, 7).
- **Plandatei und Code werden bei JEDEM Wiedereinstieg gegeneinander gemessen**
  (Kickoff-Punkt 11): Basislinie im Kopfblock gegen die drei Testläufe. Weichen sie ab,
  ist eine Seite alt — **nicht bauen, erst klären**. Zweimal war genau das der Fall.
- **Der Plan-Kopf wird vor jeder Chat-Übergabe GELESEN, nicht nur geschrieben**
  (2026-08-06): Er ist das Erste, was ein neuer Chat sieht. Wiederholtes
  Ersetzen an derselben Stelle kann Sätze zerreißen, ohne dass ein Testlauf es
  merkt — die Prüfungen kennen den Fließtext nicht.
- **Ein geändertes Modul muss seine Kennung mitziehen** (offen bis N11, 3.6):
  Solange das nicht abgesichert ist, sagt die Versionszeile nur für `ui.js`
  die Wahrheit. Wer sich auf sie verlässt, prüft weniger, als er glaubt.
- **`test_naht.js` gehört in JEDE Lieferung** (2026-08-05): Sobald sich ein
  Modul ändert, ändert sich die Wächtertabelle in S43 mit — auch wenn keine
  Assertion angefasst wurde. Einmal vergessen, und der Harness meldet vier rote
  Zeilen für einen Fehler, den es gar nicht gibt.
- **Ein Platzhalter für einen künftigen Baustein muss beim Bau ABGELÖST werden**
  (2026-08-07, N12): `edition()` leerte die Lizenzzeile bei jedem Aufruf, mit dem Kommentar
  „setzt die Registrierung in N12". N12 setzte sie — und `edition()` löschte sie weiter.
  **Wer einen Platzhalter setzt, benennt beim Ablösen auch den alten Besitzer.**
- **Token-Pause: 4 Stunden.**

---


#### 9.2.2 Ehrlichkeit gegenüber dem Anwender

- **Ehrliche Lücken gehören sichtbar** (2.4): Was bewusst nicht geprüft wurde, steht ohne
  Antippen da — auch nicht hinter einer Klappe.
- **Ampel und Rechenweg müssen dasselbe sagen.** Ein grünes Ergebnis neben einem roten
  Nachweis ist immer ein Fehler, egal welche Seite recht hat.
- **Die Mindestlänge ist eine WARNUNG, kein Nachweis** (Dieters Entscheidung 2026-08-03,
  5.1-0). Sie färbt die Ampel nicht und trägt im Rechenweg **keinen** Haken. Dafür nennt
  ihr Text die Norm und steht ohne Aufklappen im Ergebniskasten.
- **Vorschlag ist kein Zwang** (N5d, 4.10d): Ein vorgeschlagener Wert gilt nur, solange
  der Anwender die Auswahl nicht selbst angefasst hat; er trägt **immer** eine sichtbare
  Herkunftszeile, und das Leeren der eigenen Wahl holt ihn zurück. Wer das zu einer
  festen Kopplung macht, nimmt dem Anwender eine Entscheidung ab, die ihm gehört.
- **Eine bewusst konservative Voreinstellung bleibt die Voreinstellung**
  (2026-08-05, Endkraterabzug 2.2b): Sie darf anfassbar werden, aber
  Abschalten ist eine Handlung, und der **Rechenweg sagt, wie gerechnet
  wurde**. Ein stiller Schalter wäre schlimmer als gar keiner.
- **Wo kein Beleg ist, gibt es keine Vorbelegung** (2026-08-05, 5.1-6a):
  Lieber eine graue Ampel und ein ehrlicher Satz als ein erfundenes
  Zielfenster. Bei den häufigsten Stählen wäre eine erfundene Grenze die
  auffälligste Lüge — und die, die am längsten unbemerkt bliebe.
- **Zwei Sorten Vorbelegung, sichtbar unterschieden** (2026-08-05, S47):
  **Tabellenwert** aus einer Norm und **Anhaltswert** aus der Praxis. Beide
  gesperrt vorbelegt und per Haken überschreibbar — aber der Anhaltswert sagt
  von sich, dass keine Norm dahintersteht. Ein Erfahrungswert, der aussieht wie
  eine Vorschrift, ist eine stille Behauptung, und die fällt niemandem auf.
- **Mengen ohne Preise** (2026-08-05, N10): Schweißgut, Draht, Gas, Minuten und
  Kilowattstunden folgen aus Geometrie und Physik — sie altern nie und werden
  IMMER gezeigt. Kosten entstehen erst mit Preisen, und **jeder Preis trägt
  ein Jahr**. So veraltet nie das Ergebnis, sondern höchstens eine Annahme,
  die sichtbar danebensteht.
- **Eine Summe sagt, was in ihr steckt** (2026-08-05, N10): Von zehn
  Kostenpositionen kann das Programm vier herleiten. Die sechs übrigen stehen
  auf null und werden **benannt**. Eine Gesamtsumme, die stillschweigend die
  Prüfkosten weglässt, ist zu niedrig — und niemand sieht es.
- **Drei Sorten Wert, sichtbar unterschieden** (2026-08-05): **Tabellenwert**
  aus der Norm, **Anhaltswert** aus der Praxis, **Preisannahme** mit Jahr. Wer
  sie gleich aussehen lässt, macht aus einem Preis von 2019 eine Vorschrift.
- **Eine halb übersetzte Anzeige ist schlimmer als eine gar nicht übersetzte**
  (2026-08-06, N10c): Sie sieht aus, als wäre sie fertig. Programmatisch
  gesetzte Texte wandern beim Sprachwechsel **nicht** von selbst mit — jede
  neue Karte muss dort ausdrücklich neu gebaut werden.
- **Ein leeres Formular ist ehrlicher als ein altes** (2026-08-06, 5.1-8): Der
  lokale Speicher führt nur Sprache und Edition, nie die letzten Eingaben. Ein
  halb ausgefülltes Formular vom Vortag sieht aus wie ein frischer Fall.
- **Ein fehlendes Bild kostet eine Zeile, nicht die Datei** (2026-08-07, N11): Wo ein
  Teil der Ausgabe scheitern kann, entsteht die Ausgabe trotzdem — und benennt, was
  fehlt. Eine Datei, die gar nicht erst geschrieben wird, hilft niemandem.
- **Der Name ist eine Hemmschwelle, kein Schloss** (2026-08-07, N12, Plan 1): Am Schlüssel
  wird **nichts** geprüft, und **„Später" ist erlaubt**. Ein Dialog, den man nicht
  schließen kann, sperrt auch den aus, der gerade seinen Schlüssel sucht. Wer hier eine
  Prüfung einbaut, verspricht eine Sicherheit, die es nicht gibt.
- **Ein Reset nimmt nur weg, was er ankündigt** (2026-08-07, N12): Der lange Druck löscht
  die Aktivierung — nicht Sprache, nicht Design, nicht die Eingaben. Drei Assertions
  halten das fest.
- **Ein „Später" darf sich nicht merken lassen, wenn der Dialog der einzige Weg ist**
  (2026-08-07, N12, Dieter): Die Aktivierung kann **nur** über diesen Dialog entstehen.
  Wird „Später" verwahrt, wird nie wieder gefragt — und wer den langen Druck nicht kennt,
  hat die Aktivierung verloren, ohne es zu merken. „Später" gilt deshalb nur für die
  laufende Sitzung. **Merke dir ein Wegklicken nur dann dauerhaft, wenn es einen zweiten,
  auffindbaren Weg zurück gibt.**
- **Eine Beschriftung verhindert, ein Fenster erklärt nur** (2026-08-07, aus P1):
  Wo eine Funktion noch nicht da ist, gehört das **an die Beschriftung**, damit der
  Anwender es liest, BEVOR er klickt. Ein Hinweisfenster danach ist die zweite Stufe,
  nicht die erste.
- **Ein Hinweisfenster erscheint höchstens einmal je Sache und Sitzung**
  (2026-08-07, aus P1): Kommt es bei jedem Klick, wird es nach dem dritten Mal reflexhaft
  weggeklickt — dann hat es das Gegenteil erreicht.
- **Interne Bausteinnamen gehören nicht in den Programmtext** (2026-08-07, aus P1):
  „wird in Baustein N13 gerechnet" ist für uns präzise und für einen Käufer bedeutungslos.
  Nach außen heißt es **„folgt in einem späteren Update"** — nie „kostenlos", nie „gratis",
  weil das Update kostenpflichtig wird (1a).
- **Ein Haftungsausschluss, der zu weit geht, ist unwirksam** (2026-08-08, aus 1a):
  § 309 Nr. 7 BGB. Nicht „keinerlei Haftung", sondern die Sachaussage — keine Zusicherung
  eines Ergebnisses, Prüfpflicht gegen Originalnormen und eigene Abnahme, Verantwortung
  beim Fachkundigen. **Claude ist kein Jurist und sagt das auch.**
- **DIE SELBSTBESCHREIBUNG SAGT DEN STAND, NICHT DEN PLAN** (2026-08-08, P1b):
  Das Info-Fenster versprach Ermüdung und Verzug und listete deren Normen — während
  zwei Zeilen weiter „folgt in einem Update“ stand. **Ein Programm, das an dreizehn
  Stellen seine Grenzen nennt, darf sich nicht selbst mehr zuschreiben, als es kann.**
  Geprüft wird satzweise, und die verbotenen Begriffe kommen aus der ZUSATZ-Tabelle,
  nicht aus einer Handliste. **Das gilt auch für die Meta-Beschreibung der Seite** —
  sie ist das Erste, was eine Suchmaschine liest.

#### 9.2.3 Eine Quelle je Sache

- **Eine Quelle je Sache** (3.4): eine Filterfunktion, ein Zahlformat, eine Klappmechanik,
  eine Optionsquelle. Entsteht beim Bauen unvermeidlich eine Doppelung, wird sie **benannt
  und mit Ablösetermin versehen** — so geschehen beim Zahlformat (N5c-1 → N5c-2).
- **Welche Auswahl welche vorschlägt, steht in `optionen.js`** — nie in `ui.js`.
  Der Harness prüft, dass die Zeichenkette `EXC` im Quelltext von `ui.js` gar nicht
  vorkommt und der Gruppencode `iso5817` dort **genau einmal** steht (in der Anordnung).
- **Die Versionszeile wird aus den GELADENEN Modulen gebaut**, nie aus einer gepflegten
  Liste (3.6). Eine zweite Liste wäre genau die Stelle, die auseinanderdriftet — und die
  Zeile soll ja das Auseinanderdriften sichtbar machen.
- **Eine bewachte Doppelung ist erlaubt, eine stille nicht** (N6b, 4.11): Steht dieselbe
  Liste aus gutem Grund an zwei Stellen, muss eine Assertion sie **in beide Richtungen**
  vergleichen — und der Grund gehört als Kommentar daneben.
- **Gezeichnet wird, WOMIT gerechnet wurde** (N7, 4.10e): Das Nahtbild kommt aus
  `ergebnis.nahtbild.profil_eingabe`, nie aus der rohen Formulareingabe. Sonst
  zeigt das Bild etwas anderes als die Zahlen — oder gar nichts.
- **Gerechnet wird mit dem, WOMIT gerechnet wurde — nie mit dem Eingabefeld**
  (2026-08-06, viermal aufgefallen): Nahtbild (N7), Lastprobe (N9c),
  Auslegungsgeometrie (N9d), a-Maß in der Kostenrechnung (N10c). Immer war die
  Ursache dieselbe: Ein Folgeschritt las aus dem Formular statt aus dem
  Ergebnis. Bei der Auslegung ist das Feld **leer**, weil der Wert gerade
  gesucht wird. **Jeder neue Folgeschritt nimmt seine Werte aus dem Ergebnis.**
- **Das Gating hat genau eine Tür** (2026-08-07, N11): Alle vier Ausgaben fragen
  `Report.guard()`, und `ui.js` ruft es an **einer einzigen Stelle** — eine Assertion
  zählt das nach. Zwei Türen wären zwei Gelegenheiten, eine davon zu vergessen, und
  vergessen hieße: eine Ausgabe läuft in der Testversion doch durch. **Gesperrt ist die
  sichere Seite** — eine unbekannte Edition gibt nichts frei.
- **Die Ausgabe gibt wieder, was die Ergebnisseite zeigt** (2026-08-07, N11): Die Karten
  werden aus der Anzeige gelesen, nicht ein zweites Mal zusammengestellt. Zwei Wege zu
  einer Zahl wären zwei Gelegenheiten, sie verschieden zu zeigen.
- **Zwei Karten mit verschiedenem Aufbau brauchen eine Regel über die
  STRUKTUR, nicht über die Klasse** (2026-08-07, N11): Die Ergebniskacheln
  tragen `.tile-k`/`.tile-wert`, die Zeilen von Wärmeführung und Kosten zwei
  schlichte `<span>`. Wer nach der Klasse sucht, findet an der zweiten Stelle
  nichts — und klebt still zusammen, statt zu scheitern.
- **Ein zweiter `@media print`-Block ist eine stille Doppelquelle** (2026-08-07, N12):
  Zwei Druckbilder, und das zweite wusste nichts vom ersten. Eine Assertion zählt jetzt
  nach, dass es genau eines gibt.
- **Rechtstexte gehören an EINE Stelle, und die ist die Landingpage**
  (2026-08-08, aus 1a): Eine im Programm fest verdrahtete Anschrift ist dieselbe
  Doppelquelle wie doppelter Code (3.4) — zieht die Website nach, ist das Programm
  veraltet und niemand merkt es. Im Programm steht nur der **Verweis**.
- **Beschriftung und Wert dürfen kein Wort teilen** (2026-08-08, P1c): „Zielfenster für
  t8/5: **Zielfenster** 10 bis 20 s“. Am Bildschirm stehen beide in zwei Spalten und die
  Dopplung fällt kaum auf — **im Ausdruck rücken sie zusammen und sie springt ins Auge.**
  Was zweispaltig gebaut wird, muss auch einspaltig lesbar sein.

#### 9.2.4 Architektur und Grenzen

- **`ui.js` ruft genau VIER Module auf** (`DTNSolver`, `DTNRechenweg`, `DTNSchaubild`
  und seit N11 `DTNReport`) und rechnet nichts selbst; verboten bleiben `DTNNaht`,
  `DTNProfil`, `DTNData` (4.10c). *(Bis v2.69 stand hier noch „drei" — 4.10c war seit N11
  auf vier, diese Zeile nicht. Gefunden beim Durchlesen vor N12.)*
  Die Assertion liest den Quelltext als **Zeichenkette samt Kommentaren** — die verbotenen
  Namen und `Math.` dürfen dort auch im Fließtext nicht vorkommen.
- **Segmenttypen in V1: nur `linie` und `kreis`** (4.5).
- **Lastfall-Faktoren und Ermüdungsmodul strikt getrennt** halten (2).
- **Ein Modul, das etwas herausgibt, gehört DOM-frei geschnitten** (2026-08-07, N11):
  `report.js` baut und liest nur Zeichenketten; Blob, Dateiwahl, Canvas und Drucken
  bleiben in `ui.js`. Nur so ist die Ausgabe in Node prüfbar. Der eine Schritt, der
  ohnehin nicht prüfbar ist (die Rasterung), bekommt einen **sichtbaren Rückfallweg**
  statt einer stillen Lücke.
- **Was der Verkäufer nachträglich ändern können muss, gehört in den HTML-Kopf**
  (2026-08-08, aus P1): Adresse und E-Mail stehen im selben Inline-Block wie die
  Editionsweiche. Nach dem Zusammenkopieren zur Einzeldatei wäre ein Wert mitten im
  Skript nur mit erheblichem Aufwand zu ändern. **Mit Rückfall auf den eingebauten Wert** —
  eine leere Zeile im Ausdruck wäre schlimmer als ein alter Wert.
- **Bei Schaltern gilt die sichere Seite, und die wird POSITIV formuliert**
  (2026-08-08, P0): Nicht „alles außer `test` ist voll", sondern „**nur exakt `full` ist
  voll**". Die erste Form gibt bei jedem Tippfehler, jeder gelöschten Zeile und jedem
  leeren Wert das Mehr frei; die zweite das Weniger. Kein Trimmen, keine Groß-/
  Kleinschreibung, keine Freundlichkeit — wer die Vollversion ausliefert, schreibt sie
  richtig.

#### 9.2.5 Prüfen und Gegenproben

- **Die zwei Häkchenarten nie vermischen** (4.9): Rechenprobe = das Programm rechnet
  falsch · Nachweis = die Naht trägt so nicht.
- **Der zweite Rechenpfad muss wirklich zweiter Pfad sein** — Welt B rechnet eigenständig,
  nicht als Umrechnung von Welt A (4.8).
- **Ein Beispiel darf nie gewählt werden, um einem Verhalten auszuweichen.** Passiert das,
  ist es ein **Fehlerbefund** und gehört in den Plan — nicht in einen Quelltextkommentar.
  So ist der Segment-Fehler aus N5c-3 acht Tage lang unentdeckt geblieben (5.1-0).
- **Die drei Prüfebenen nicht zusammenlegen** (4.8, seit N5c-3): `a_min`/`a_max` **je
  Segment** · Mindestlänge **je Nahtzug** · `β_Lw` **je Segment**. Jede dieser drei Ebenen
  ist einzeln begründet; wer sie vereinheitlicht, macht eine davon falsch.
- **Ein Bild darf nichts behaupten, was die Legende nicht deckt — und umgekehrt** (N6b):
  Die gestrichelte Identifikationslinie war zuerst durchgezogen gezeichnet, während die
  Legende „gestrichelt" sagte. Assertions auf Legendeneinträge reichen nicht; **das Merkmal
  ist im SVG-String selbst zu prüfen.**
- **Ein Auslegungsergebnis darf nicht vom Rechenanfang abhängen** (N7, 4.8):
  Die Geometrie hängt über den Endkraterabzug selbst am a-Maß, also wird die
  Kette mit dem gefundenen a erneut durchlaufen. Wer die Schleife entfernt,
  bekommt ein Ergebnis, das je nach Bezugsmaß um rund 10 % schwankt.
- **Eine Assertion prüft gegen die QUELLE, nie gegen eine abgeschriebene Zahl**
  (v2.36 und N7): `PLAN`, `VERSION` und `ETAPPE` in `ui.js` werden alle drei
  gegen das Kopffeld `Codestand` dieser Datei geprüft, und der DOM-Smoke prüft
  die Versionszeile gegen die Kennungen aus `ui.js`. Eine festgeschriebene
  Zeichenkette hat hier schon einmal grün gemeldet, während am Handy ein zwei
  Bausteine alter Stand stand.
- **Jeder neue Beispielkatalog ist zugleich ein Fehlersuchlauf** (N7): Die vier
  Befunde aus 5.1-3 lagen alle auf Pfaden, die kein Beispiel je berührt hatte.
  Wer Beispiele nur als Bequemlichkeit sieht, verschenkt ihren halben Wert.
- **Ein Probefall, der etwas findet, wird eine Assertion — nicht weggeworfen**
  (2026-08-05, S46): Ein einmal durchgespielter Fall findet den Fehler einmal,
  derselbe Fall als Prüfung findet ihn für immer. Verworfen wird höchstens der
  KATALOG-Eintrag, nie die Prüfung.
- **Eine Prüfung, die ohne den Fix nicht rot wird, ist wertlos** (2026-08-07, N11):
  Die Gegenprobe zu „erst leeren, dann laden" (3.5) blieb grün, weil sie nur nachsah, ob
  die Werte der DATEI ankommen. Entscheidend war, ob die Werte des VORIGEN Falls
  verschwinden. **Jede neue Prüfung wird einmal gegen den entfernten Fix gehalten** —
  sonst weiß niemand, ob sie etwas hält.
- **Eine Ausgabe ist erst geprüft, wenn jemand das ERZEUGNIS geöffnet hat**
  (2026-08-07, N11): Beide Fehler der ersten Word-Datei — verklebte Karten und
  die doppelte Liste 2.4 — standen in der fertigen Datei, während alle drei
  Testläufe grün meldeten. Geprüft war, dass die Karten **ankommen**, nicht
  **wie** sie ankommen. Bei jedem neuen Ausgabeformat gehört ein Blick in das
  Erzeugnis dazu, und was dabei auffällt, wird eine Assertion.
- **Ein Bild kann in der Datei stehen und trotzdem unsichtbar sein**
  (2026-08-07, N11): Der RTF-Betrachter am Handy zeigt eingebettete PNG nicht
  an. Das ist eine Eigenschaft des Betrachters, kein Programmverhalten — bevor
  ein Rückfallweg beschuldigt wird, gehört in die Datei selbst geschaut.
- **Eine Ausgabe wird VERMESSEN, nicht nur angesehen** (2026-08-07, N11):
  Der Word-Befund war an keinem Bildschirm zu sehen — am Handy zeigt der
  Betrachter das Bild gar nicht, und in Word kam es nie so weit. Sichtbar
  wurde er erst, als Zeilenzahl und Zeilenlängen der gelieferten Datei
  gezählt wurden. **Wo ein Format Regeln hat, wird gegen die Regeln gemessen**
  — nicht gegen den Eindruck.
- **Bevor an einer Ausgabe gebaut wird, wird das ERZEUGNIS auseinandergenommen**
  (2026-08-07, N11): Das Nahtbild blieb am Handy unsichtbar. Der nächste Griff wäre
  gewesen, den Bildblock umzubauen oder das Bild ganz wegzulassen. Stattdessen wurde
  das PNG aus der gelieferten Datei **herausgelöst und angesehen** — es war
  einwandfrei. Der Fehler lag im Betrachter. **Wer ohne Befund an einer Ausgabe
  ändert, macht kaputt, was nachweislich funktioniert.**
- **EINE PRÜFUNG MUSS IHRE ERWARTUNG SELBST KENNEN** (2026-08-08, P0): Der DOM-Smoke
  holte sich die erwartete Edition aus `Report.editionAus()` — also aus dem, was er prüfen
  sollte. In der Gegenprobe blieb er **grün**, obwohl die Weiche falsch herum stand: die
  Erwartung drehte sich mit dem Fehler mit. **Wer die Erwartung aus dem Prüfling holt,
  prüft nichts.** Danach: 16 rote Zeilen.
- **Ein Handwert im MUSTER ist derselbe Fehler wie ein Handwert im WERT**
  (2026-08-08, P0): Zehn Assertions prüften Kennungen gegen `-N\w+`. Sie wurden rot, als
  die erste Etappe „P0" hieß — obwohl nichts kaputt war. Alle zehn prüfen jetzt
  `-[A-Za-z]\w*`.
- **Eine Prüfung auf „das erste Mal“ gehört an die Stelle, an der es wirklich das
  erste Mal ist** (2026-08-08, P1): Der Merker des Hinweisfensters ließ sich nicht
  gegenprüfen, weil die Prüfung dort stand, wo der Haken längst berührt war — sie sah
  nur noch den Wiederholungsfall. **Wo im Ablauf eine Prüfung steht, ist Teil der
  Prüfung.**
- **Ein Wortfilter braucht die BEDEUTUNG, nicht das Wort** (2026-08-08, P1): Die Suche
  nach „kostenlos“ fing auch das englische „free“ in *„no free weld end“* — vier
  Fehlalarme. Ein Filter, der zu viel fängt, wird abgeschaltet und fängt dann gar nichts.

#### 9.2.6 Fachliche Festlegungen

- **Die HTML startet immer im dunklen Design** (3.1) — bindende Vorgabe aus N5a.
- **Die gesperrten Tabellenfelder dürfen nicht für immer leer bleiben** — nach dem Rechnen
  werden sie aus `ergebnis.widerstand` gefüllt, samt Herkunft (4.10c).
- **Aufnahmekriterium für Normangaben ohne Rechenwirkung** (Dieter, 2026-08-03, 5.1-1):
  **aufgenommen wird, was stabil ist und der Rechnung eine Aussage gibt** — draußen
  bleibt, was gepflegt werden müsste. Das Programm ist ein Nachweisprogramm, **keine
  Qualitätssicherung**. Was draußen bleibt, gehört als benannte Lücke in die Liste 2.4.
- **Die a-Grenzen sind Kehlnahtregeln** (N7, Dieter 2026-08-04, 4.8): `a ≥ a_min`
  und `a ≤ 0,7·t` gelten für die Kehlnaht **und** die teilweise durchgeschweißte
  Naht — bei der **durchgeschweißten** nicht, dort ist `a = t` die Definition.
  Wo eine Regel nicht greift, steht **kein Haken** im Rechenweg: weder ein
  grüner (er behauptete eine Prüfung, die es nicht gab) noch ein roter (er wäre
  der Widerspruch „grüne Ampel, roter Nachweis").
- **Ein publiziertes Beispiel ist ein Anker, kein Beweis** (S39, 2026-08-04):
  Weicht das Programm von einer Quelle ab, wird **zuerst die Quelle
  nachgerechnet**. Bei Anker 1 lag der Fehler dort — nachgewiesen über die
  Gegenrechnung derselben Seite. Wer eine Abweichung reflexhaft im eigenen
  Code sucht, baut einen richtigen Rechenweg kaputt.
- **Beim Vergleich mit Lehrbüchern gehören drei Schalter genannt** (S39):
  Endkraterabzug, Rechenmodell und die Beiwerte. Ohne sie ist jeder Vergleich
  wertlos — der Endkraterabzug allein macht rund 15 % aus.
- **Ein Kerbfall ist ein Entscheidungsbaum, keine Zahl** (2026-08-05, 5.2):
  Die Anwendungsbedingungen werden ABGEFRAGT, nicht geraten. Und findet sich
  kein passender Kerbfall, gibt es **keine Rechnung und keinen Vorschlag für
  etwas Ähnliches**. Wer „den ähnlichsten" nimmt, bekommt eine plausible
  falsche Zahl — schlimmer als gar keine Ermüdungsrechnung.
- **Schlüssel kommen aus der Norm, nie aus eigener Zählung** (2026-08-05):
  Tabelle plus Detailnummer nach EN 1993-1-9. Eine eigene Nummerierung bricht
  beim ersten Update und beim Öffnen alter Dateien.
- **Was schlanker gemacht wird, wird an der TIEFE reduziert, nicht an der
  BREITE** (2026-08-05): Ganze Familien weglassen ist ehrlich — der Anwender
  merkt es sofort. Rosinen aus allen Familien picken ist die schlechteste
  Variante: dort weiß niemand, was fehlt.
- **Widersprechen sich zwei belegte Empfehlungen, ist die Überschneidung die
  Vorbelegung** (2026-08-05, t8/5-Fenster): Sie erfüllt beide zugleich, ist an
  beiden Enden die strengere Grenze und ist keine erfundene Zahl. Beide
  Quellfenster gehören dann in den Hilfetext.

#### 9.2.7 Dateien und Ausgaben

- **Eine gespeicherte Datei beschreibt den Fall, nicht das Ergebnis**
  (2026-08-06, 5.1-8): Gespeichert werden nur die Eingaben. Eine mitgespeicherte
  Zahl wäre nur so lange richtig, wie das Programm sich nicht ändert — und
  dieses Programm ändert sich. Der **Versionsstempel** sorgt dafür, dass ein
  Unterschied nicht stumm bleibt.
- **Eine Datei aus einer neueren Fassung wird NICHT geöffnet** (2026-08-06,
  5.1-8): Sie halb zu lesen wäre schlimmer, als sie abzulehnen.
- **Bilddaten in RTF gehören umbrochen — 128 Zeichen je Zeile**
  (2026-08-07, N11): Ein 640×480-Nahtbild ergibt über 22.000 Hex-Ziffern.
  Standen sie auf einer Zeile, öffnete **Word die Datei nicht**, obwohl sie
  formal einwandfrei war. Ein Umbruch zwischen zwei Hex-Ziffern ist
  bedeutungslos — und trotzdem der Unterschied zwischen „öffnet" und „öffnet
  nicht". Dasselbe gilt für lange Textzeilen; keine Zeile im Blatt geht über
  255 Zeichen.
- **`overflow:hidden` gehört im Druck zurückgenommen** (2026-08-07, N12): Am Bildschirm
  hält es runde Ecken sauber; im Druck **schneidet es jede Zeile ab, die über einen
  Seitenumbruch läuft** — die obere Hälfte bleibt zerschnitten stehen, die ganze Zeile
  erscheint noch einmal auf der Folgeseite. Sichtbar wurde es erst am gedruckten PDF.
- **`break-inside:avoid` nur auf KLEINE Einheiten** (2026-08-07, N12): Steht es auf einem
  Behälter, der höher ist als eine Seite, kann der Browser es nicht erfüllen und schiebt
  ihn auf die nächste — die erste Seite bleibt leer. Zusammengehalten wird an Kacheln,
  Feldzeilen und Rechenwegzeilen, nie an Karten.
- **Was im Druck ausgeblendet wird, muss anderswo wieder auftauchen** (2026-08-07, N12):
  Marke, Programmstand und Haftungshinweis stehen am Bildschirm in Kopfleiste, Info-Dialog
  und Fußzeile — alle drei trägt das Papier nicht. Ohne eigenen Druckkopf trug das Blatt
  **nichts davon**, obwohl 3.6 und 2.4 beides verlangen.

> **Die Teststrategie gehört zum Regelwerk** — sie sagt, WIE geprüft wird, und die
> Regeln in 9.2 sagen, WAS. Abschnittsnummer unverändert 7.

## 7. Teststrategie (Claude testet selbst — Dieter kann es nicht)

**Harness `test_naht.js`** (DEV-ONLY, sektionsweise, ok()-Zähler, Basislinie wächst nur):
- **Hand-Anker Geometrie:** Rechteck-Nahtbild und Kreisnaht geschlossen nachgerechnet
  (A_w, Schwerpunkt, I_y, I_z, I_p) — zweipfadig gegen unabhängige Formeln.
- **Invarianten:** Verschieben des Nahtbilds ändert I um den korrekten Steiner-Anteil ·
  a-Verdopplung halbiert die Spannungen · Auslegung und Nachweis sind zueinander invers
  (a aus Auslegung eingesetzt ⇒ Ausnutzung ≈ 1) · Welt A und Welt B nie vermischt ·
  Kernfunktionen mutieren ihre Eingabe nicht.
- **Auswahl-Logik (3.4):** alle Wege durchlaufen — keine Sackgasse, kein verwaistes Feld,
  jeder Weg endet rechenbar.
- **Laden/Speichern:** nach „Leeren" ist wirklich alles leer · Laden setzt zuerst zurück ·
  falsche Formatversion → ehrlicher Fehler, kein Teil-Laden.
- **Ermüdung:** Wöhlerlinie an den Knickpunkten stetig · Miner-Summe additiv · Determinismus.
- **Thermik/Kosten:** Einheiten- und Größenordnungsprüfungen, Grenzfälle (v→0, t→0).
- **Rechenweg-Selbstprüfung über alle Presets × 3 Sprachen** + Negativkontrollen
  (ein verfälschtes Ergebnis muss auffallen).
- **Gating:** in der Testversion ist **jede** Ausgabe gesperrt.

**DOM-Smokes** (Mini-DOM-Shim in Node, führt `ui.js` real aus, **lädt IMMER alle Module**):
je einer für Voll- und Testversion. Geprüft: Formularaufbau, aufklappbare Bereiche und
Freischalt-Haken, Laien-ⓘ in allen drei Sprachen, kontextbezogene Beispielliste, Presets
füllen die Felder, Assistent-Durchlauf inkl. Übernahme vorhandener Eingaben, Ausgabe-Buttons
verdrahtet, Sperr-Overlay in der Testversion, Registrierung + Long-Press-Reset.

**Verifikation gegen publizierte Rechenbeispiele (S39, ab 2026-08-04):**
Die übrigen Hand-Anker prüfen **Bauteile** — I_y gegen Steiner, W_t gegen
I_p/r_max, die Aufteilung mit 1/√2. Was kein Bauteiltest findet, ist ein
**Verdrahtungsfehler**: wenn jedes Stück für sich stimmt, die Kette sie aber
falsch zusammensteckt. Genau so lag der Segment-Fehler aus N5c-3 acht Tage
unentdeckt, und genau so entgingen die vier N7-Befunde jedem Bauteiltest.
S39 hält deshalb die **ganze Kette** gegen fremde, veröffentlichte Zahlen.

| Anker | Quelle | Was er prüft | Ergebnis |
|---|---|---|---|
| 7 | mechGuru (BS 5950) | Geometrie einer geschlossenen Nahtgruppe: A_u = 500 mm², J_u = 2.604.166,66 mm³ | **auf 6 Stellen gleich** |
| 2 | Structural Basics, vereinfacht | ganze Kette: I, W, F_w,Ed = 171,9 · f_vw,d = 207,9 · η = 82,7 % | **alle vier gleich** |
| 3 | Structural Basics, Hohlprofil | ganze Kette mit γ_M2 = 1,35: F_w,d = 131,67 · f_vw,d = 154 · η = 85,5 % | **alle drei gleich** |
| 8 | DS Werk (Decker/Roloff-Matek) | Welt B: A_w = 640 mm² · σ = 78,1 N/mm² | **gleich** |
| 1 | Structural Basics, richtungsbezogen | — | **Quelle fehlerhaft**, siehe unten |

**Drei Konventionen müssen dafür stimmen — sie sind der Grund, warum ein
naiver Vergleich scheitert:**
1. **Endkraterabzug AUS.** Unser `profil.js` zieht 2·a je offener Raupe ab,
   die Lehrbücher nicht. Am Anker 2 gemessen: **198,1 statt 171,9 N/mm², rund
   15 %.** Wir sind die konservative Seite (2.2b) — aber wer vergleicht, muss
   es wissen. Eine Assertion hält den Unterschied fest.
2. **Modell `duennwandig`** — die Quellen rechnen das Linienmodell.
3. **Beiwerte wie in der Quelle**, wo sie abweichend einstuft (Anker 3
   verwendet β_w = 1,0, weil dort als Stumpfnaht eingestuft).

**Anker 1 ist in der Quelle fehlerhaft — und das ist beweisbar.** Dieselbe
Seite rechnet dasselbe System mit demselben a-Maß noch einmal vereinfacht
und kommt auf σ_N = 171,9 — **genau unser Wert**. Ihr richtungsbezogenes
σ₉₀ = 145,8 entspräche **a = 2,5 mm** statt der angegebenen 3 mm, ihr
τ₀ = 0,83 dagegen a = 3. Die Quelle mischt zwei Kehldicken; zusätzlich
reproduziert die dort abgedruckte Formel (mit N/2 und V/2) weder ihr eigenes
Ergebnis noch die Formel aus dem Theorieteil derselben Seite. S39 prüft
deshalb **nicht** gegen 145,8, sondern gegen die Gegenrechnung der Quelle —
und weist zusätzlich nach, dass 145,8 zu a = 2,5 mm gehört.
**Lehre: ein publiziertes Beispiel ist ein Anker, kein Beweis.** Bevor eine
Abweichung dem eigenen Code angelastet wird, ist die Quelle gegenzurechnen.

**Zwei recherchierte Beispiele sind BEWUSST keine Anker** (in S39 benannt,
nicht übergangen): Petersen/Dlubal verteilt die Querkraft über den
**Schubfluss** V·S_y/(I_y·Σa), wir setzen sie gleichmäßig an (Q/A_w) und
sagen es im Rechenweg; SCI/NSC rechnet mit dem **plastischen**
Widerstandsmoment 2·l²/4 nach EN 1993-1-8 4.9(1), wir elastisch mit 2·l²/6
und damit konservativer.

**i18n-Parität:** jeder Schlüssel in allen drei Sprachen — automatisiert, 0 Abweichungen.

---

## A3 Wo was steht — und was in der Historie nachzuschlagen ist

### 9.3 Wo was steht — Wegweiser in `Schweißnaht-Historie.md`

> ⚠️ **DIESER WEGWEISER IST PFLICHT.** Was in der Historie steht, wird beim
> Sitzungsbeginn **nicht** gelesen. Ohne einen Hinweis, dass es etwas gibt, sucht dort
> niemand — und „wir haben es in die Historie verschoben" würde heimlich zu „niemand
> liest es mehr".

**Diese Fragen sind DORT beantwortet, nicht hier:**

| Frage | Wo in der Historie |
|---|---|
| Was hat Baustein X geliefert, und was wurde dabei gefunden? | *Gelieferter Umfang der Bausteine N5c-3 bis N12* |
| Warum ist eine Regel aus 9.2 entstanden? | derselbe Block — jede Regel hat dort ihren Fall |
| Wie lautete der ursprüngliche Auftrag für N5c-1, N5a/N5b, P1? | *Die Aufträge …* bzw. *P1 — gelieferter Umfang* |
| Was war P0 (Editionsweiche), und wie wurde es geprüft? | *P0 — die Editionsweiche* |
| Wie sah der Projektordner nach N5d oder N6b aus? | *Abgelöste Dateistände* — **der gültige steht in Teil E** |
| Wie kam eine Entscheidung zustande? | Entscheidungslog, Blöcke unten |
| Changelog vor v2.78 | dort im Volltext ab v1.0 |

**Was hier geblieben ist und NICHT in der Historie gesucht werden muss:** jede Regel
(Teil A) · jede Schnittstelle (Teil C) · die Liste 2.4 · das Dateiformat · das
Normfundament samt Korrekturen (6.1) · die Etappenteilung (5.2) · alle offenen
Entscheidungen · Basislinie und Dateistand.

---

Die Blöcke des Entscheidungslogs stehen dort in dieser Reihenfolge; jeder nennt Datum
und Baustein:

- Aus dem Konzeptgespräch 2026-07-23
- Aus der Recherche (abgeschlossen 2026-07-24)
- Aus N1 (2026-07-25)
- Aus der Abstimmung 2026-07-25 (Profileingabe)
- Aus N2 (2026-07-25)
- Aus N2b (2026-07-25)
- Aus N2c (2026-07-25)
- Aus der Abstimmung 2026-07-26 (vor N3)
- Aus der Abstimmung 2026-07-26 (Etappen bei großen Bausteinen)
- Aus der Rückmeldung 2026-07-26 (N3 abgenommen)
- Aus N3 (2026-07-26)
- Aus der Rückmeldung 2026-07-26 (N4 abgenommen)
- Aus N4 (2026-07-26)
- Aus der Vorbereitung von N5c (2026-07-27)
- Aus dem Gespraech ueber die Zeit NACH V1 (2026-07-27)
- Noch beim Nachmessen gefunden (2026-07-27), damit es N5c-1 nicht trifft
- Aus der Rückmeldung 2026-07-27 (N5b abgenommen)
- Aus der Abstimmung 2026-07-27 (vor N5b)
- Aus N5b (2026-07-27)
- Aus N5c-1 „Es rechnet" (2026-07-28)
- Aus N5c-2 „Es erklärt sich" (2026-07-28)
- Aus der Abnahme von N5c-2 (2026-07-28)
- Zum Verfahren (2026-07-28)
- Aus N5c-3 „Nahtzug statt Segment" (2026-08-03)
- Aus der Rückmeldung 2026-08-03 (N5c-3 abgenommen)
- Aus der Abstimmung 2026-08-03 (vor N5d)
- Aus N5d (2026-08-03) — Ausführung & Dokumentation, Versionszeile, Vorschlag statt Zwang
- Aus der Rückmeldung 2026-08-03 (N5d abgenommen)
- Aus N6b (2026-08-04) — ISO-2553-Katalog, Nahtvorbereitung, Symbolgenerator
- Aus N7 (2026-08-04) — Beispielkatalog, vier Befunde aus N5c, Prüfkultur
- Aus der Rückmeldung 2026-08-04 (N7 abgenommen)
- Aus S39 (2026-08-04) — Verifikation gegen publizierte Rechenbeispiele
- Aus N11 (2026-08-07) — Ausgaben, Dateiformat, Gating, Namensabgleich
- Aus N12 (2026-08-07) — Druckbild, Registrierung, Lizenzzeile, Lang-Druck
- Aus der Rückmeldung 2026-07-27 (N5a abgenommen)
- Aus N5a (2026-07-26)
- Aus der Rückmeldung 2026-07-26 (N2c abgenommen)
- Aus der Rückmeldung 2026-07-25 (N1 abgenommen)
- Aus der Rückmeldung 2026-07-25 (N2b abgenommen)
- Aus der Rückmeldung 2026-07-25 (N2 abgenommen)
- Aus der Abstimmung 2026-07-24 (dieser Chat)

---


═══════════════════════════════════════════════════════════════════════════
# TEIL B — DAS PRODUKT
═══════════════════════════════════════════════════════════════════════════

> **Was das Programm ist, kann und bewusst nicht kann** — samt der Entscheidungen, die das festgelegt haben.

---

## 1. Produkt-Eckdaten (alle geklärt)

| Punkt | Festlegung |
|---|---|
| **Produktname** | **DT-ProfiSchweissnaht** (ohne ß — Dateinamen und Repo passen zusammen) |
| **Dateien** | `DT-ProfiSchweissnaht.html` · `DT-ProfiSchweissnaht_Test.html` |
| **GitHub** | Repo/Ordner `dt-profischweissnaht-web` |
| **Projektdatei** | Endung **`.dts`** (analog `.dtp` bei der Passung) |
| **Prüfstand** | **entfällt** (Dieter braucht ihn nicht) |
| **Modell** | Einmalkauf (Vollversion) + kostenlose Testversion · Vertrieb Digistore24 |
| **Preis** | Richtwert **169 €** — endgültig später von Dieter entschieden |
| **Testversion** | voller Funktionsumfang beim **Rechnen**, **ALLE** Ausgaben gesperrt (Speichern, Öffnen, Drucken/PDF, Word) |
| **Vollversion** | Aktivierung beim Erststart: Name + Digistore-Schlüssel, **keine Formatprüfung**; Name erscheint in allen Ausgaben („Vollversion · lizenziert für …") = Hemmschwelle zur Weitergabe |
| **Editionsweiche** | `<script>window.DT_EDITION='full'\|'test';</script>` ganz oben in der HTML |
| **Sprachen** | DE · EN · PT vollständig (Bedienung, Feldtexte, Laien-Hilfe, Meldungen, Dialoge, Rechenweg). Symbole sprachneutral. |
| **Plattform** | Eine HTML im Browser, **voll offline**, Handy · Tablet · PC |
| **Zielgruppe** | Konstrukteure, Schweißfachleute, Fertigung/QS, Ausbildung — **Laie bis Profi** |
| **Abdeckungsziel** | **75–80 %** der gängigen Praxis; Sonderfälle bewusst außen vor, aufgefangen über „eigener Wert" |
| **Impressum** | Dieter Tepe · Mühlenstraße 2 · 48477 Dreierwalde · Dieter.Tepe@live.de · www.dt-profidreieck.de |
| **Sonstiges** | Registrierung ohne Prüfung · 10-s-Long-Press auf die Marke = Reset · Info-ⓘ mit Impressum · GitHub Pages · Ausgaben oben in der Aktionsleiste |

---

### 1a Verkauf und Verbreitung *(entschieden 2026-08-07, vor der Veröffentlichung)*

**Der Verkaufsstand geht in den Verkauf, bevor N13 gebaut wird.** Begründung von Dieter,
und sie ist durch diesen Tag belegt: Die drei echten Fehler des 07.08. — kaputtes
Druckbild, verklebte Karten, verwahrtes „Später" — hat **keine der 3417 Assertions**
gefunden, sondern echte Benutzung. Ein Programm, das niemand benutzt, wird nicht besser.
**Alles Weitere kommt als Update.**

**DIE VERKAUFSSEITE DARF NUR VERSPRECHEN, WAS DRIN IST.** Das Programm nennt an dreizehn
Stellen ehrlich, was es nicht prüft (2.4). Deutet die Verkaufsseite Ermüdung oder Verzug
an, bricht das Versprechen genau dort, wo der Kunde zuerst hinschaut. Beworben wird:
statischer Nachweis, Wärmeführung, Kosten/Zeit, ISO-2553-Symbole, Ausgaben — **nicht**
Ermüdung, **nicht** Verzug.

**Das Update wird kostenpflichtig** (Dieter): bei Digistore24 als eigener Update-Preis,
Erstkäufer sind über die Käuferliste auffindbar. **Daraus folgt eine Sprachregel für den
gesamten Programmtext:** nirgends „kostenlos", „gratis" oder etwas, das so klingt.
**„Folgt in einem späteren Update"** ist neutral und trägt beide Wege. Das kostet jetzt
nichts und erspart später eine Diskussion mit jemandem, der es anders verstanden hat.

**Zur Weitergabe.** Der Lizenzname ist eine Hemmschwelle, kein Schutz (Plan 1), und das
bleibt vorerst so. Dieters Rechnung: Verbreitung macht bekannt, und wer ernsthaft arbeitet,
kommt später zurück. **Das trägt — aber der Vertriebsweg soll die TESTVERSION sein, nicht
die Raubkopie.** Eine weitergereichte Vollversion verbreitet Bekanntheit *und nimmt den
Kaufgrund weg*; die Testversion verbreitet Bekanntheit *und schafft ihn*: sie rechnet
alles vollständig samt Rechenweg am Bildschirm und gibt nur nichts heraus. Genau dafür
wurde sie gebaut. **Also: Testversion offen und ohne Hürde streuen, ausdrücklich zum
Weitergeben gedacht.**

**Jede Ausgabe wirbt bereits mit.** Impressum und `www.dt-profidreieck.de` stehen im
Druckkopf, im PDF und im Word-Dokument. Ein weitergegebener Nachweis nennt auf fremden
Schreibtischen deine Adresse — der Lizenzname wirkt dabei doppelt: er hemmt die Weitergabe
**und** sagt dem Empfänger, woher es kommt.

**Der stärkste Hebel ist das Update, nicht das Schloss.** Eine kopierte Fassung altert: kein
N13, keine korrigierten Preise, keine Fehlerbehebung. Deshalb ist die Reihenfolge „erst
verkaufen, dann Server" richtig — **der Server schützt Umsatz, der existiert; das Update
erzeugt ihn.**

> ⚠️ **DIESE ÜBERLEGUNG DARF SPÄTER NICHT ALS BEGRÜNDUNG DIENEN, DEN SERVER NIE ZU BAUEN.**
> Bei dutzenden Käufern stimmt die Rechnung, bei hunderten kippt sie — dann ersetzen
> Kopien Käufer, statt sie zu gewinnen. **Der Umschlagpunkt ist erkennbar:** wenn
> Support-Anfragen von Leuten kommen, die nicht in der Digistore-Liste stehen.

**DIE RECHTSTEXTE WERDEN AUF DER LANDINGPAGE GEPFLEGT, NICHT IM PROGRAMM**
*(Dieter, 2026-08-08)*. Bis N12 stand die volle Anschrift fest verdrahtet in
`i18n_kern.js` — in der Fußzeile, im Info-Fenster, im Druckfuß und im Word-Dokument.
**Das ist dieselbe Doppelquelle wie im Code (3.4), nur mit Rechtstexten:** zieht die
Landingpage nach, ist das Programm veraltet und niemand merkt es. Künftig steht dort nur
noch der Verweis **„Vollständiges Impressum und Datenschutzerklärung online unter:
dt-profidreieck.de"**. Ein Verweis kann nicht veralten.

**Die Seiten** (Stand 2026-08-08): Landingpage
`https://dietertepe.github.io/dt-profidreieck-web/index.html`, gesteuert über eine
`config.js`, die fast alle Links trägt · Impressum `…/impressum.html` ·
Datenschutz `…/datenschutz.html`.

✅ **Impressum und Datenschutzerklärung sind ergänzt und geliefert (2026-08-08)** — als
fertige HTML-Dateien, nicht als Textvorschläge: Dieter hat den Quelltext nachgereicht,
und was man messen kann, wird nicht geraten. **Alle Links wurden byteweise gegen die
Originale gehalten** — fünf je Seite, keiner verändert; Struktur und `<style>`-Block
unberührt. Impressum jetzt v1.1.0.

**Was dort ergänzt wurde:** die Produktliste an drei Stellen · ein neuer Abschnitt
**„Haftung für die Berechnungsprogramme"** · und im Datenschutz ein **neuer Absatz zur
lokalen Speicherung** — DT-ProfiSchweissnaht ist das erste der Programme, das etwas
ablegt (Name und Lizenzschlüssel aus der Aktivierung). Abschnitt 2 behauptete bis dahin
pauschal, es fielen keine Daten an; das stimmte nicht mehr. Der Absatz nennt, was
gespeichert wird, dass es das Gerät nie verlässt, und **wie man es löscht** — die Auskunft,
die nach Art. 15 DSGVO verlangt werden kann.

**`Werbung.md`** liegt als Rohmaterial für die Seitentexte im Landingpage-Projekt —
Kurzbeschreibung, die fünf Alleinstellungen, Fragen und Antworten, und eine Liste von
**Formulierungen, die nicht verwendet werden dürfen**.

> **Diese drei Dateien gehören NICHT in den Projektordner dieses Programms.** Sie werden
> im Landingpage-Projekt gepflegt — sie hier zu kopieren wäre genau die Doppelquelle, die
> zu vermeiden der Anlass war.

> ⚠️ **ZUM HAFTUNGSAUSSCHLUSS — hier wurde Dieter widersprochen (2026-08-08).**
> Der Wunsch war, ihn zu „verschärfen". Ein pauschaler Ausschluss ist nach
> **§ 309 Nr. 7 BGB unwirksam** (Leben, Körper, Gesundheit; grobe Fahrlässigkeit) und
> kann selbst angreifbar sein. **Was trägt, ist die Sachaussage:** keine Zusicherung
> eines Ergebnisses · Prüfpflicht gegen Originalnormen und eigene Abnahme · Verantwortung
> beim Fachkundigen · die Liste 2.4 ist Bestandteil des Ergebnisses. Das ist stark und
> wirksam zugleich — und es passt zu einem Programm, das seine Lücken ohnehin benennt.
> **Claude ist kein Jurist; die Texte gehören vor dem Verkaufsstart fachkundig geprüft.**

**Rückmeldungen aus dem Verkauf werden gesammelt** — zwischen zwei Sitzungen geht sonst
verloren, was ein Käufer nebenbei erwähnt. Sie kommen beim Sitzungsstart auf den Tisch.

---

## 2. Was DT-ProfiSchweissnaht können soll

### 2.1 Zwei Bemessungswelten — umschaltbar, **niemals vermischt**

Jede Welt hat **eigenen Rechenweg mit benannter Grundlage**.

**Welt A — Stahlbau nach EN 1993-1-8 (richtungsbezogenes Verfahren):**
```
√(σ⊥² + 3·(τ⊥² + τ∥²)) ≤ f_u / (β_w · γ_M2)     UND     σ⊥ ≤ 0,9 · f_u / γ_M2
```
γ_M2 = 1,25 (national festgelegt → **überschreibbar**). Gerechnet wird mit **Bemessungslasten**.
Vereinfachtes Verfahren als Alternative: `f_vw,d = (f_u/√3)/(β_w·γ_M2)`.

**Welt B — klassischer Maschinenbau:**
```
σ_zul = R_e / S · ν      (ν = Nahtgütefaktor je Nahtart und Belastungsart)
```
Lastfälle **ruhend / schwellend / wechselnd**. Alle Faktoren sichtbar in Tabellen und per
„eigener Wert"-Haken überschreibbar.
**Quellenbasis (Frage 5, entschieden):** **Roloff/Matek als Primärreferenz**,
**Decker-Tabellen** als zweite Quelle (über schweizer-fn nachprüfbar),
**DVS 1612** für Kerbfälle, **FKM-Richtlinie als späterer Ausbaupfad** (für V1 verworfen —
zu umfangreich, überschneidet sich mit dem Ermüdungsmodul).

### 2.2 Rechenkern: freies Nahtbild aus Segmenten

**Kein Katalog von Sonderformeln, sondern EINE allgemeine Rechenmaschine.**
Ein Nahtbild besteht aus **Segmenten** (Lage, Länge, a-Maß, Richtung). Daraus automatisch:
Schwerpunkt · Nahtfläche A_w · Flächenmomente I_y, I_z · polares Moment I_p.
Alle Standardfälle sind damit **nur noch Presets, die Segmente füllen** — dieselbe Mathematik
für alle. Ein **freier Modus mit Live-SVG-Vorschau** deckt Sonderfälle ab.
Vorteil: ein prüfbarer Kern statt vieler Sonderwege, exakt gegen Hand-Anker verifizierbar.

### 2.2b Profileingabe — Nahtbild aus Profil + Kantenauswahl *(abgestimmt 2026-07-25)*

**Grundsatz:** Aus einem Profil kommt nicht *eine Zahl Nahtlänge*, sondern das **ganze
Nahtbild** — Lage der Segmente, nicht nur ihre Summe. Für Zug reicht die Länge, für Biegung
und Torsion entscheidet die Lage (I_y, I_z, I_p). `profil.js` erzeugt deshalb **Segmente**,
keine Länge.

**Schichtung (bindend):** `profil.js` (Profil + Maße + Kantenauswahl → Segmente) →
`naht.js` (Segmente → Querschnittswerte). `naht.js` bleibt dumm. Die Presets (2.11) setzen
auf `profil.js` auf, statt Segmentlisten doppelt zu pflegen.

**Stufe 1 — parametrisch (V1, Maße eintippen).** Deckt nach Dieters Praxiseinschätzung
75–80 % der Fälle ab, braucht **keine Recherche** und funktioniert für jede Abmessung:

1. **Blech / Flachstahl** — Lasche, Knotenblech, Stirnplatte (häufigster Fall)
2. **Rechteck-/Quadrat-Hohlprofil** — Maschinenrahmen, Konsolen, Geländer
3. **Rundrohr** — Rohr auf Platte, der Torsionsfall
4. **I-/H-Profil** — Träger an Stütze, Konsole am Flansch
5. **U-Profil** — *von Dieter aus der Praxis ergänzt, kommt oft vor*
6. **Winkel** — Streben, kleine Konsolen
7. **Vollrund** — Bolzen/Welle auf Platte, fast immer Torsion

> **Ehrlich:** Die Abdeckungsquote 75–80 % ist Dieters Erfahrungseinschätzung,
> **keine belegte Statistik**. Sie steuert nur den Bauumfang, nie eine Rechnung.

**Stufe 2 — Normprofil-Katalog (nach V1).** IPE, HEA/HEB, UPE/UPN, RHS/SHS, Rohr nach
EN 10365 / EN 10219 als **eigenes Datenpaket**, gestaffelt gefüllt wie der Kerbfallkatalog,
je zwei Quellen, **ehrliche Lücken sichtbar**. Reiner Komfort — Stufe 1 kann alles bereits.

**Die zweite Abfrage ist wichtiger als das Profil selbst: WELCHE KANTEN sind geschweißt?**
Rundum · nur Flanken · nur Stirnseiten · beim I-/U-Profil nur Flansche oder auch Steg.
Ohne diese Abfrage rechnet das Programm Nähte mit, die es nicht gibt.

**Fachliche Fallen, die `profil.js` beherrschen muss:**
- **Endkraterabzug 2·a** entfällt bei umlaufender Naht, greift bei **jedem** offenen Segment.
  Genau hier wird von Hand am häufigsten falsch gerechnet.
- **Eckradien bei Hohlprofilen** verkürzen den Umfang — und in der Ecke entsteht keine
  saubere Kehlnaht. Sicherheitsrelevant, nicht kosmetisch.
- **Unterschiedliche Dicken je Segment** (Steg/Flansch) → je Segment eigenes a-Grenzmaß.
  `naht.js` kann das (a je Segment); `profil.js` muss es füllen.
- **Rundrohr:** l = π·d mit dem **Außendurchmesser** — Festlegung muss im Rechenweg stehen.

**Auswahl-Skizze = Live-Vorschau des erzeugten Nahtbilds**, kein separat gezeichnetes Symbol.
Dieselben Segmente, die gerechnet werden, werden gezeichnet — eine Quelle, kann nie
auseinanderlaufen. Ändert der Anwender die Kantenauswahl, erscheint bzw. verschwindet die
Naht sofort. **Folge für die Reihenfolge:** `svglib.js` + `schaubild.js` werden von N6 auf
**N2c vorgezogen**.

> ✅ **ENTSCHIEDEN (Dieter, 2026-08-05): Der Endkraterabzug bekommt ein
> Ankreuzfeld.** Ausgangslage war der Befund aus S39: abschaltbar ist er nur
> in `profil.js`, im Formular nicht — und er macht rund **15 %** aus. Wer ein
> Lehrbuchbeispiel nachrechnet, fand den Unterschied ohne Erklärung.
>
> **Wie es gebaut wird — mit N9 mitgeliefert:**
> - Ankreuzfeld im Bereich *Geometrie*, **Voreinstellung bleibt AN**. Die
>   konservative Seite ist die Voreinstellung; abschalten ist eine bewusste
>   Handlung, nicht der Normalfall.
> - **Der Rechenweg sagt, wie gerechnet wurde** — mit oder ohne Abzug. Ein
>   stiller Schalter wäre schlimmer als gar keiner.
> - Laien-ⓘ benennt die Auswirkung, nicht nur die Regel.
> - Nach der Prozessregel aus 3.3 bringt er seinen **Assistenten-Schritt** mit.
> - Die Assertions aus S39 bleiben: sie messen den Unterschied weiterhin und
>   halten fest, dass die Anker ohne Abzug gerechnet sind.

**Die errechnete Länge ist ein VORSCHLAG**, mit „eigener Wert"-Haken überschreibbar
(Regel 3.1). Erklärungen laufen über die vorhandene Laien-ⓘ-Struktur
(Was ist das · Üblicher Bereich · Empfehlung) — nur füllen, nichts Neues bauen.

### 2.3 Beide Rechenrichtungen (im Kern, nicht als Extra)

- **Nachweis:** a-Maß gegeben → Spannungen, Ausnutzungsgrad, Ampel.
- **Auslegung:** a-Maß gesucht → „welches a brauche ich?". Direkt auflösbar (σ ∝ 1/a),
  für Sonderfälle Iteration dahinter. Ergebnis auf praxisübliche a-Maße aufgerundet,
  Mindest-/Höchstgrenzen geprüft.

**Aufrundung des a-Maßes — BINDEND (entschieden 2026-07-26, Begründung im Entscheidungslog):**
- **Voreinstellung: ganze mm, immer AUFgerundet** (nie ab). a4, a5, a6 — das ist ein
  Fertigungsmaß, kein Rechenergebnis; die Streuung beim Handschweißen ist größer als ein
  halber Millimeter. „a = 4,37 mm" täuscht eine Genauigkeit vor, die es nicht gibt.
- **Umschaltbar auf halbe mm** (3; 3,5; 4; …) — nötig bei dünnen Blechen: bei t = 5 mm liegt
  a_max = 0,7 · t_min bereits bei 3,5 mm, da ist ganzzahlig zu grob.
- **Keine Sprungreihe** (3, 4, 5, 6, 8, 10): a7 und a9 kommen in der Praxis vor, und der
  Sprung 6 → 8 verschenkt spürbar Schweißgut.
- Über den **„eigener Wert"-Haken** ist ohnehin jede Zahl eintragbar (Regel 3.1).
- **Im Rechenweg stehen BEIDE Zahlen:** „erforderlich a = 4,37 mm → gewählt a = 5 mm".
- **Nach** dem Aufrunden wird gegen `a_max = 0,7 · t_min` (und die Mindestmaße) geprüft —
  passt das gewählte Maß nicht mehr zur Blechdicke, gibt es eine **ehrliche Meldung** statt
  eines stillen Ergebnisses.

### 2.4 Was der Rechner NICHT prüft *(bestätigt + 4 Ergänzungen, 2026-07-24)*

Muss **sichtbar im Ergebnis und in allen Exporten** stehen:

Grundwerkstoff-Nachweis · Beulen/Stabilität · Schrauben und sonstige Verbindungsmittel ·
Bauteilsteifigkeit/Verformung · Ausführung, Schweißaufsicht und Qualifikation ·
Werkstoffzulassung und Schweißeignung im Einzelfall ·
**die Lastannahmen selbst (Einwirkungen/Kombinationen — die gibt der Anwender vor)** ·
**Sprödbruch / Kaltzähigkeit (EN 1993-1-10)** ·
**Anschlusssteifigkeit (gelenkig/starr)** ·
**Terrassenbruch bei Zug in Dickenrichtung (Z-Güten)** ·
**Prüfumfang und zerstörungsfreie Prüfung (VT, PT, MT, UT, RT)** ·
**Nahtvorbereitung und Fugenform (EN ISO 9692-1)** ·
**Toleranzklassen (EN ISO 13920)** ·
**Herstellerqualifikation und Schweißanweisung (EN 1090-1, EN ISO 3834, WPS/WPQR)**

> Die **vier letzten Punkte sind mit N5d dazugekommen** (Aufnahmekriterium in 9.2):
> Sie sind wichtig, aber sie müssten *gepflegt* werden — deshalb bleiben sie draußen
> und werden **benannt** statt verschwiegen. Damit sagt das Programm selbst, dass es
> kein QS-System ist. Die Liste steht als **eine** Quelle in `daten.js`
> (`NICHT_GEPRUEFT`, 14 Punkte) und läuft von dort durch Solver und Rechenweg
> in die Anzeige — es gibt keinen zweiten Weg.

**Produkt-Disclaimer Pflicht:** „Berechnung ohne Gewähr, vor Produktivnutzung gegen die
Originalnormen prüfen."

### 2.5 Werkstoffe — **11 Sorten in V1** *(entschieden 2026-07-24)*

- **Baustahl:** S235 · S275 · S355 · S420 · S460 → β_w, f_u, R_e je Güte
- **Edelstahl:** 1.4301 · 1.4404 · 1.4571 → Nachweis nach EN 1993-1-4
- **Aluminium:** EN AW-5083 · EN AW-6060 · EN AW-6082 → EN 1999-1-1,
  **zwingend mit WEZ-Entfestigung** (ohne den Abminderungsfaktor rechnet man Alu-Nähte
  deutlich zu günstig — muss im Ergebnis ausdrücklich sichtbar sein)

### 2.6 Zusatzbereiche — **alle vier in V1**

Jeder Bereich **zuschaltbar** (Ankreuzfeld, standardmäßig AUS), mit eigenem Ergebnis-Panel und
eigenem Rechenweg.

**(a) Ermüdung / Betriebsfestigkeit** — Wöhlerlinie mit Knick (m = 3, danach m = 5),
Dauerfestigkeit und Schwellenwert, γ_Mf nach Schadensfolge/Inspizierbarkeit,
Schadensakkumulation nach **Miner** (D = Σ n_i/N_i ≤ 1). Stahl: EN 1993-1-9 · Alu: EN 1999-1-3.
**Der Kerbfallkatalog ist der Brocken:** rund 80–90 Details, für Alu ein **zweiter** Katalog.
→ **Struktur von Anfang an vollständig**, **Füllung gestaffelt** (Start 25–35 häufigste
Details, jedes mit eigener SVG-Skizze und **2 Quellen** belegt). Nicht Gefülltes bleibt
**sichtbare ehrliche Lücke** — nie ein stiller Fehlwert.

**(b) Wärmeführung: Vorwärmung & t8/5** — CET und CEV, Streckenenergie und Wärmeeinbringen mit
Verfahrenswirkungsgrad, Abkühlzeit t8/5 (2D/3D-Wärmefluss), Vorwärmtemperatur nach EN 1011-2.

**(c) Kosten, Zeit und Drahtbedarf** — Nahtvolumen je Fugenform, Zusatzwerkstoff- und
Schutzgasbedarf, Schweißzeit über Abschmelzleistung, Kosten je Naht/Meter.

**(d) Verzug & Schrumpfung** — Quer-, Längs- und Winkelschrumpfung.
**Ehrlicher Hinweis: überwiegend Erfahrungswerte, keine Norm.** Ergebnis deutlich als
**„Abschätzung / Richtwert"** kennzeichnen — darf sich nie wie ein Nachweis anfühlen.

### 2.7 Neuer Block „Ausführung & Dokumentation" *(entschieden 2026-07-24)*

Eigener aufklappbarer Bereich, sauber getrennt vom Rechenteil:
- **ISO 5817** — Bewertungsgruppe B/C/D als Auswahlfeld mit Laien-Erklärung.
  **Ehrliche Beschriftung:** geht *nicht* in die Spannungsrechnung ein, ist
  Ausführungsanforderung — **aber** beim Ermüdungsnachweis relevant, weil die Kerbfälle eine
  bestimmte Qualität voraussetzen. Keine Scheinrechnung bauen.
- **EXC nach EN 1090** — EXC1–EXC4 als **reines Hinweisfeld**, ebenfalls nicht rechenwirksam.
- **ISO 2553** — Zeichnungssymbol-Generator (siehe N6b).

Alles erscheint als Anforderungszeile in den Ausgaben. Daten in `daten.js`/`optionen.js`,
nur der Symbolgenerator bekommt ein eigenes `symbol.js`.

### 2.8 Trennung Lastfall ↔ Ermüdung (Doppelzählung ausgeschlossen)

Die **Lastfall-Faktoren** (ruhend/schwellend/wechselnd) gehören **ausschließlich zu Welt B**
und wirken dort auf die zulässige Spannung. Das **Ermüdungs-Modul** ist davon völlig
unabhängig. Beide Ergebnisse stehen **nebeneinander und werden NIE multipliziert**.
Sind beide aktiv → Klartext-Hinweis: zwei getrennte Nachweise unterschiedlicher Schärfe.

### 2.9 Schweißverfahren

**MAG · MIG · WIG · E-Hand · UP.** Je Verfahren: Wirkungsgrad für die Wärmeeinbringung,
typische Abschmelzleistung, Zusatzwerkstoff- und Gasdaten. Exoten über „eigener Wert".

### 2.10 Nahtarten (Startumfang)

Kehlnähte (einseitig, doppelseitig, Flanken-/Stirnkehlnaht), durchgeschweißte Stumpfnähte
(I, V, DV) und die gebräuchlichen HV/HY-Formen. Unterbrochene Nähte, Loch-/Schlitznähte und
Sonderformen bleiben zunächst außen vor.

### 2.11 Presets (Starterset — decken jeden Rechenpfad mindestens einmal ab)

1. **Laschenanschluss mit Flankenkehlnähten** — Zug/Druck (häufigster Fall)
2. **Konsole / Kragarm am Stützenflansch** — Biegemoment + Querkraft
3. **Rohr / Rundprofil auf Platte** — Kreisnaht mit **Torsion**
4. **Rechteckprofil auf Platte** — Rahmenbau, kombinierte Beanspruchung
5. **Träger an Stütze über Stirnplatte** — Stahlbau-Standardfall
6. **Durchgeschweißter Blechstoß** — Stumpfnaht-Pfad

Presets sind **reine Daten** (Profil + Kantenauswahl + Vorbelegungen) → sie setzen auf
`profil.js` auf und werden nicht als eigene Segmentlisten gepflegt. Jederzeit erweiterbar.

### 2.12 Lasteingabe: beide Wege wählbar

**Direkt:** Schnittgrößen N, Q, M, T am Nahtbild eingeben.
**Geometrisch:** Kraft + Hebelarm/Geometrie → Schnittgrößen werden berechnet und im Rechenweg
ausgewiesen. Der Assistent nutzt bevorzugt den geometrischen Weg.

---

## 3. Bedienkonzept — Dieters Vorgaben vom 2026-07-24 (BINDEND)

### 3.1 Linke Eingabeseite

- Aufbau **ähnlich dem Schwesterprogramm**: Abfragen oben, Bereiche **aufklappbar**.
- **Ankreuzfelder schalten Abfragebereiche frei** — nur was angehakt ist, wird abgefragt.
- **„Eigener Wert"-Haken überall.** Wurde ein Fall gerechnet und der Anwender ändert einen
  Wert und drückt „Berechnen", wird **vollständig neu durchgerechnet**.
- **„Leeren" leert wirklich ALLE Felder** — ohne Rest.

**Startdarstellung (Dieters Hinweis 2026-07-25, BINDEND):** Die Oberfläche startet
**immer im dunklen Design**. Der Hell/Dunkel-Schalter bleibt erhalten, aber der
Ausgangszustand beim Öffnen der HTML ist dunkel — in **beiden** Editionen gleich.
Umzusetzen in N5 (`ui.js` + `style.css`), im DOM-Smoke abzusichern.

### 3.2 Kontextbezogene Beispiele *(✅ GEBAUT MIT N7, 2026-08-04)*

Die Beispiele oben richten sich nach dem, was links ausgewählt/angehakt ist.
**Umsetzung:** Jedes Preset trägt **Merkmale** (Nahtart, Werkstoffgruppe, Belastungsart,
Bemessungswelt). Die Beispielliste zeigt nur passende Presets; passt nichts → alle anzeigen.
Eine Quelle, keine Doppelpflege. Der Anwender kann ein Beispiel laden, anpassen, ausprobieren.

> ✅ **Umgesetzt in N7.** Gefiltert wird über die **Auswahl, die das Beispiel
> ohnehin trägt** (`BEISPIEL_FILTER` = `welt` · `werkstoffgruppe` · `nahtart`) —
> es gibt **keine zweite Merkmalsliste**. Nur was im Formular gar nicht
> auswählbar ist, steht als eigenes Merkmal daneben: die **Belastungsart**.
> Eine Assertion verbietet, dass ein Merkmal eine Auswahl doppelt.
> **Passt nichts, werden alle gezeigt** — eine leere Beispielliste wäre eine
> Sackgasse nach 3.4. Das **geladene** Beispiel bleibt immer in der Liste,
> auch wenn der Anwender die Auswahl inzwischen weggedreht hat; sonst stünde
> der Kasten auf „wählen", während die Felder voll sind.

### 3.3 Assistent (Dialogführung)

- **Start = Formular**, der Assistent wird über einen auffälligen **Button** geöffnet.
- **Reichweite:** führt durch **Kern + alle Zusatzbereiche**, verzweigt je nach Auswahl.
- **Übernahme bestehender Eingaben:** Sind beim Start schon Felder gefüllt, **übernimmt** der
  Assistent sie — im Dialog müssen sie aber **änderbar** sein.
- **Jedes Dialogfenster enthält:** aussagekräftige Erklärung **für Laien** · Tipp für den
  Standardwert · **Skizze** · möglichst **anklickbare Auswahl** statt Tippen.
- **Tabellengestützt und dreisprachig**, alles antippbar; nach jeder Auswahl bleiben die
  zugehörigen Eingabefelder mit „eigener Wert"-Haken zugänglich.
- **HARTE REGEL: Der Assistent führt, aber er rechnet NIE selbst.** Er füllt dieselben Felder
  wie die Handeingabe und übergibt an dieselbe Rechenkette. Sonst gäbe es zwei Wahrheiten und
  der selbstprüfende Rechenweg wäre entwertet. Jeder Schritt ist umkehrbar.
- **Sicherheitsaspekt:** Der Assistent mündet **immer** in die volle Anzeige mit Rechenweg und
  benennt ausdrücklich, was **nicht** geprüft wurde (Liste 2.4).
- **PROZESSREGEL: Jeder spätere Baustein liefert seine Assistenten-Schritte MIT.** Der
  Assistent wird nie „am Ende drangebaut", sondern wächst mit jedem Modul.

### 3.4 Verträglichkeitsregeln — **kein Unsinn in den Auswahlmenüs** *(Dieters Kernforderung)*

Beispiel: Ist ein Vierkantrohr-Träger gewählt, dürfen nur sinnvolle Nahtvorbereitungen
erscheinen. Das gilt für **alle** Auswahlen.

**Umsetzung:** Jede Option in `optionen.js` trägt **Bedingungen** (`gilt_wenn`).
**EINE** Filterfunktion bedient **Formular UND Assistent** — eine neue Option erscheint
automatisch an beiden Stellen, Übersetzungen nur im i18n-Wörterbuch. Kein Auseinanderdriften.
Auch der Assistent blendet Felder aus, die zum gewählten Weg nicht passen — sonst gibt es
später Rechenfehler.

**Pflicht-Test dazu:** Der Harness läuft **jeden möglichen Auswahlweg** durch und prüft:
- nie eine **Sackgasse** (es bleibt immer mindestens eine Option wählbar),
- **kein verwaistes Feld** (kein Pflichtfeld, das der Weg nie gezeigt hat),
- jeder Weg endet in einem **vollständigen, rechenbaren** Eingabesatz.

### 3.5 Laden gespeicherter Berechnungen

**Harte Regel: erst ALLES leeren, dann laden.** Nie Altwerte in eine Neuberechnung einsickern
lassen. Die `.dts`-Datei trägt eine **Formatversion**; passt sie nicht, gibt es eine
**ehrliche Fehlermeldung** statt eines stillen Teil-Ladens. Wird als Testfall abgesichert.

### 3.6 Versionszeile — das Programm sagt, welchen Standes es ist *(ab N5d)*

**Der Programmstand muss am Handy ablesbar sein, ohne Dateidaten zu vergleichen.**
Die Module tragen Kennungen (`daten 0.1.0-N1`, `solver 0.1.0-N3`, `ui 0.6.0`),
aber **nichts davon ist sichtbar** — der Info-ⓘ nennt bisher nur die Edition.

> ✅ **ERLEDIGT MIT N5d (2026-08-03).** Die drei fehlenden Kennungen sind nachgerüstet:
> `i18n_kern.js`, `i18n_hilfe.js` und `i18n_kerbfall.js` tragen jetzt `0.1.0-N1`.
> **Alle 13 Module sind gekennzeichnet**, die Zeile hat kein stilles Loch mehr.
> `dom_smoke_test.js` braucht keine (DEV-ONLY, reiner Aufrufer).
> Stand: `daten` `optionen` `validate` `i18n_kern` `i18n_hilfe` `i18n_kerbfall`
> `0.1.0-N1` · `naht` `0.1.0-N2` · `profil` `0.1.0-N2b` · `svglib` `schaubild`
> `0.1.0-N2c` · `solver` `0.1.0-N3` · `rechenweg` `0.1.0-N4` · `ui` `0.7.0`
> (dazu `ETAPPE` = `N5d` und `PLAN` = `2.32`).

**Vorgabe — mit N5d umgesetzt:**
- Der **Info-ⓘ** zeigt zwei Zeilen: `infoVersion` („Programmstand N5d · Plan 2.32 ·
  13 Module") und `infoModule` (jede Modulkennung einzeln, `name version`).
- **Gebaut wird sie aus den GELADENEN Modulen**, nicht aus einer Liste: `ui.js` geht
  über die `DTN…`-Namen am Fenster und liest `NAME` und `VERSION` beim Modul selbst.
  **Es gibt deshalb keine zweite Modulliste**, die auseinanderdriften könnte.
  Ein Modul ohne Kennung würde sichtbar als „ohne Kennung" gezählt (ehrliche Lücke).
- Die **einzige von Hand gepflegte Zahl** ist `PLAN` in `ui.js` — sie kommt aus
  dieser Datei und wird mit ihr fortgeschrieben.
- **Jede Ausgabe** (Druck, PDF, Word, `.dts`) trägt dieselbe Zeile (N11).
- Eine Assertion prüft, dass die angezeigte Kennung mit den geladenen Modulen
  übereinstimmt — im DOM-Smoke Modul für Modul gegen `win.DTN…VERSION`.

> ⚠️ **BEFUND AUS DER ABNAHME VON N6b (2026-08-04):** Die Zeile las die Module richtig
> aus (14, alle mit Kennung) — aber **Etappe und Planversion blieben auf „N5d · Plan 2.32"
> stehen**, weil sie von Hand gepflegt werden und beim Bau von N6b vergessen wurden.
> **Schlimmer: die Assertion darauf hatte den alten Wert festgeschrieben und meldete
> grün.** Gefunden hat es Dieter am Handy.
> **Abhilfe, seit v2.36 verbindlich:** Der Harness liest die Planversion aus dem Kopfblock
> DIESER DATEI und vergleicht sie mit `PLAN` in `ui.js`. Eine Assertion, die einen
> Handwert gegen eine Konstante prüft, prüft nichts — sie muss gegen die **Quelle** prüfen.
> `ETAPPE` und `VERSION` in `ui.js` gehören ab jetzt in die Abschlussliste jedes Bausteins.
> **Verglichen wird gegen das Kopffeld `Codestand`, nicht gegen `Plan-Version`:** Sonst
> müsste jeder reine Plan- oder Abnahmeeintrag den Code anfassen, nur damit eine Zahl
> wieder passt — und genau solche Pflichtänderungen erzeugen die Flüchtigkeitsfehler, die
> hier verhindert werden sollen. `Codestand` wandert nur mit, wenn sich Code ändert.

> ✅ **ERLEDIGT MIT N11 (2026-08-07).** Die Zeile zeigte die **Modulnamen** statt der
> **Dateinamen** — `data` statt `daten.js`, `options` statt `optionen.js`,
> `kern`/`hilfe`/`kerbfall` statt der drei `i18n_*.js`. Zum Erkennen eines fehlenden
> Moduls reichte das; seit die Zeile in Druck, PDF, Word und `.dts` wandert, nicht mehr.
> **Angefasst wurden genau die fünf Module, die abwichen** — die übrigen tragen keinen
> eigenen `NAME` und laufen über dieselbe Rückfallregel wie in `ui.js`
> (`DTNSolver` → `solver`), die dort bereits den Dateinamen trifft. Ein Eingriff hätte
> dort nur die Kennungen zerstört, die seit N2 belegen, dass sie unverändert sind.
> Geprüft wird **gegen die HTML**: für jedes eingebundene Modul muss `NAME + '.js'`
> der Dateiname sein — und der DOM-Smoke prüft dasselbe an der Zeile, die der Anwender
> wirklich liest.

> **Zweiter offener Punkt für N11 (aus der Abnahme von N7, 2026-08-04):** Die
> ✅ **ERLEDIGT MIT N9a (2026-08-05).** Der Wächter steht in Sektion **S43**:
> je Modul die erwartete `VERSION` und eine Prüfsumme des Quelltextes.
> Geänderter Quelltext ohne Kennungswechsel wird rot. Gegenprobe bestanden —
> eine einzige zusätzliche Kommentarzeile in `naht.js` machte ihn rot, das
> Zurücknehmen wieder grün. **Fünf Kennungen wurden dabei korrigiert:**
> `solver.js` und `rechenweg.js` auf N7, `validate.js` auf N8a,
> `assistent.js` auf N8b, `i18n_kern.js` auf N9a. Erst damit belegt die
> Versionszeile, dass die Module nicht nur DA, sondern auch AKTUELL sind.
> Der Namensabgleich (Anzeigename gegen Dateiname) bleibt bei N11.
> Modulkennungen sind **nicht alle mitgewachsen**. N7 hat in `solver.js` und
> `rechenweg.js` tief eingegriffen, N8a in `validate.js`, N8b in
> `assistent.js` — alle vier melden aber weiterhin `0.1.0-N3`, `0.1.0-N4`,
> `0.1.0-N1` bzw. `0.1.0-N8a`.
>
> **Wie es abgesichert wird:** Eine Einzelreparatur erzwingt die Regel nicht —
> deshalb bekommt der Harness eine Tabelle **Modul → VERSION + Prüfsumme des
> Quelltextes**. Ändert sich der Quelltext, ohne dass die `VERSION` mitwandert,
> wird es rot. Damit ist die Versionszeile zum ersten Mal ein echter Beleg
> dafür, dass die Module nicht nur DA, sondern auch AKTUELL sind. Der
> Namensabgleich (Anzeigename gegen Dateiname) bleibt bei N11. Bei der Abnahme von
> N8a stand `validate 0.1.0-N1` unverändert in der Zeile, obwohl das Modul
> gerade die Feld-zu-Bereich-Zuordnung bekommen hatte. **Die Zeile belegt,
> dass 15 Module DA sind — nicht, dass sie AKTUELL sind.** Nur `ui.js` wandert mit, weil es als einziges eine gepflegte
> Kennung trägt. **Damit könnte man heute einen Stand von vor N7 einspielen,
> ohne dass die Zeile es verrät** — und genau das Erkennen eines alten Moduls
> ist ihr einziger Zweck. Aufgefallen ist es Dieter beim Lesen der Zeile nach
> der N7-Abnahme. **Gehört zusammen mit dem Namensabgleich in N11 gemacht:**
> jedes geänderte Modul zieht seine `VERSION` mit, und eine Assertion hält
> fest, dass eine Änderung ohne Kennungswechsel nicht durchgeht. Solange das
> offen ist, bleibt der Basislinien-Abgleich aus Kickoff-Punkt 11 die einzige
> verlässliche Probe.

**Warum das mehr ist als Kosmetik:** Die Prüfdateien (`test_naht.js`, beide DOM-Smokes)
sind **DEV-ONLY** und liegen nach V1 nur noch im Archiv, nicht beim ausgelieferten
Programm. Sie sind aber die einzige Stelle, an der in ausführbarer Form steht, was
„richtig" in diesem Programm bedeutet — und sie werden gebraucht, sobald jemand die
zweite Generation der EN 1993-1-8 nachzieht, β_w,mod belegt, den Normprofil-Katalog
ergänzt oder eine Werkstofftabelle aktualisiert.
**Die Gefahr ist dann nicht der Verlust, sondern das Auseinanderdriften:** an der
laufenden Version wird eine Kleinigkeit geradegezogen, das Archiv bleibt liegen, und ein
Jahr später prüft der Harness einen Stand, den es nicht mehr gibt. Mit einer sichtbaren
Versionszeile ist das in zwei Sekunden erkennbar statt gar nicht.
**Regel dazu:** Das Archiv der Prüfdateien wird zusammen mit dem Plan mitgeführt und trägt
denselben Stand wie das ausgelieferte Programm — nicht am Ende der Entwicklung abgeräumt.

---

## 6. Normfundament — Kurzreferenz

> ⚠ **Die Detailwerte stehen in den fünf Recherchedateien (Abschnitt 8) — dort sind sie
> belegt.** Untenstehende Formeln dienen der Orientierung. Normtexte sind geschützt: Formeln
> und Werte stammen aus seriösen frei publizierten Sekundärquellen und werden eigenständig
> implementiert. **Normstände im Programm ausweisen.**

**Beteiligte Regelwerke:** EN 1993-1-8 (Anschlüsse/Schweißnähte) · EN 1993-1-9 (Ermüdung Stahl) ·
EN 1993-1-4 (nichtrostende Stähle) · EN 1999-1-1 und EN 1999-1-3 (Aluminium) ·
EN 1011-2 (Wärmeführung) · EN 1090 (Ausführung, EXC) · ISO 5817 (Bewertungsgruppen) ·
ISO 2553 (Zeichnungssymbole) · ISO 9692 (Nahtvorbereitung) · DVS 1612 ·
Roloff/Matek und Decker für Welt B.

### 6.1 KORREKTUREN aus der Recherche — **zwingend in `daten.js` beachten**

- **S355: f_u = 490 N/mm²** (nicht 510 — Berichtigung AC:2009)
- **β_w für S420/S460: zwei wählbare Regelsätze** — CEN 1,0 **vs.** deutscher NA 0,88 / 0,85.
  Beide anbieten, Auswahl sichtbar im Rechenweg ausweisen.
- **Edelstahl: β_w = 1,0 für alle Sorten, E = 200 000 N/mm²**
- **Aluminium: eigener Nachweis über f_w — kein β_w**

**Ermüdung:** Wöhlerlinie mit Knick — m = 3 bis zur Dauerfestigkeit, danach m = 5 bis zum
Schwellenwert; Detailkategorie Δσ_C bei 2·10⁶ Lastwechseln; γ_Mf nach Schadensfolge und
Inspizierbarkeit; Miner (D = Σ n_i/N_i ≤ 1).

**Wärmeführung:** CET = C + (Mn+Mo)/10 + (Cr+Cu)/20 + Ni/40 ·
CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 · Streckenenergie E = U·I/v ·
Wärmeeinbringen Q = k·E (MAG/E-Hand ≈ 0,8 · WIG ≈ 0,6 · UP ≈ 1,0) ·
t8/5 aus Wärmeeinbringen, Blechdicke, Vorwärmtemperatur, Nahtform (2D/3D).

**Kosten/Zeit:** Nahtvolumen aus Fugengeometrie · Masse = Volumen · Dichte ·
Schweißzeit = Masse / Abschmelzleistung · Gasbedarf = Durchfluss · Lichtbogenzeit.

---


═══════════════════════════════════════════════════════════════════════════
# TEIL C — DIE ARCHITEKTUR
═══════════════════════════════════════════════════════════════════════════

> **Module, Ladereihenfolge und Schnittstellen.** Die Regeln einer Schnittstelle stehen BEI ihr — eine Bedingung, die man erst zwei Kapitel entfernt findet, ist schlechter als eine, die neben dem steht, was sie bedingt.

---

## 4. Architektur & Module

### 4.1 Modulkarte + Ladereihenfolge
```
dt-profischweissnaht-web/
├── DT-ProfiSchweissnaht.html      → Vollversion
├── DT-ProfiSchweissnaht_Test.html → Testedition (Unterschied: NUR window.DT_EDITION)
├── style.css                      → Design-Tokens/Look (aus der Passung portiert)
├── i18n_kern.js   (DTNI18nKern)   → Bedienung, Felder, Meldungen, Rechenweg-Beschriftungen
│                                     ✅ fertig (N1–N4) · 520 Schlüssel
├── i18n_hilfe.js  (DTNI18nHilfe)  → Laien-ⓘ-Texte, Dialog-Erklärungen, Tipps
│                                     ✅ fertig (N1–N4) · 64 Einträge
├── i18n_kerbfall.js (DTNI18nKerb) → Kerbfall-Bezeichnungen und Anwendungsbedingungen
│                                     ⬜ Gerüst steht, Füllung in N14
├── daten.js       (DTNData)       → 11 Werkstoffe, β_w, f_u, R_e, Nahtgütefaktoren,
│                                     Verfahrensdaten, Fugenformen, ISO 5817, EXC
│                                     ✅ fertig (N1)
├── kerbfall.js    (DTNKerbfall)   → Kerbfallkatalog Stahl + Alu (Codes, Kategorien,
│                                     Anwendungsbedingungen, Verweis auf Skizze)
├── optionen.js    (DTNOptions)    → **einzige Options-/Auswahlquelle** für Formular UND
│                                     Assistent + **Verträglichkeitsregeln** (3.4)
│                                     ✅ fertig (N1/N2b/N3) · 20 Gruppen, 89 Optionen
├── validate.js    (DTNValidate)   → Feldschema (dreisprachig) + zweistufige Prüfung
│                                     ✅ fertig (N1/N2b/N3) · 29 Felder
├── naht.js        (DTNNaht)       → Nahtbild-Kern: Segmente → A_w, Schwerpunkt, I_y, I_z, I_p
│                                     ✅ fertig (N2) · Schnittstelle in 4.5
├── profil.js      (DTNProfil)     → Profiltyp + Maße + Kantenauswahl → Segmente (2.2b);
│                                     7 Profile, Raupenmodell, Endkraterabzug, Eckradien,
│                                     a je Segment  ✅ fertig (N2b) · Schnittstelle in 4.6
├── solver.js      (DTNSolver)     → Spannungen aus N/Q/M/T · Welt A + Welt B ·
│                                     Nachweis UND Auslegung, Aufrundung des a-Maßes,
│                                     Ampel  ✅ fertig (N3) · Schnittstelle in 4.8
├── rechenweg.js   (DTNRechenweg)  → selbstprüfender Rechenweg für ALLE Module;
│                                     Schrittliste als Daten, zweiter Rechenpfad je
│                                     Schritt  ✅ fertig (N4) · Schnittstelle in 4.9
├── ermuedung.js   (DTNFatigue)    → Wöhlerlinie, γ_Mf, Miner, Kollektive
├── thermik.js     (DTNThermal)    → CET/CEV, Streckenenergie, t8/5, Vorwärmtemperatur
├── kosten.js      (DTNCost)       → Nahtvolumen, Draht-/Gasbedarf, Zeit, Kosten
├── verzug.js      (DTNDistort)    → Quer-/Längs-/Winkelschrumpfung (Richtwerte)
├── svglib.js      (DTNSvgLib)     → **SVG-Bausteinbibliothek** (siehe 4.3); 13 Grund-
│                                     bausteine, Auto-Skalierung, kein Text im SVG
│                                     ✅ fertig (N2c) · Schnittstelle in 4.7
├── schaubild.js   (DTNSchaubild)  → Nahtbild-Vorschau: Segmente → SVG + Legendendaten
│                                     ✅ fertig (N2c) · Schnittstelle in 4.7
├── symbol.js      (DTNSymbol)     → ISO-2553-Symbolgenerator (nutzt svglib)
├── beratung.js    (DTNBeratung)   → Hinweise, Ampeln, Praxis-Tipps
├── assistent.js   (DTNAssistent)  → Dialoglogik (DOM-frei, Node-testbar)
├── report.js      (DTNReport)     → Ausgaben: .dts speichern/öffnen, Druck/PDF,
│                                     Word (.rtf), **Gating gebündelt hier**
│                                     ✅ fertig (N11) · Schnittstelle in 4.12
├── ui.js          (DTNUi)         → Formular, Modi, Zusatzbereiche, i18n, Theme, Rechenweg,
│                                     Grafik, Presets, Laien-ⓘ, Assistent-Overlay, Aktionsleiste
│                                     ✅ Grundgerüst (N5a) · Schnittstelle in 4.10
├── test_naht.js      (DEV-ONLY)   → Assertion-Harness — nie ausgeliefert
└── dom_smoke_*.js    (DEV-ONLY)   → DOM-Smokes Voll + Test — nie ausgeliefert
```

**Ladereihenfolge in beiden HTMLs (Zielbild):**
```
i18n_kern → i18n_hilfe → i18n_kerbfall → daten → kerbfall → optionen → validate →
naht → profil → solver → rechenweg → ermuedung → thermik → kosten → verzug →
svglib → schaubild → symbol → beratung → assistent → report → ui
```
**Tatsächlich in den HTMLs eingetragen (Stand N5a, vom DOM-Smoke geprüft — 13 Module):**
```
i18n_kern → i18n_hilfe → i18n_kerbfall → daten → optionen → validate → naht → profil →
svglib → schaubild → solver → rechenweg → ui
```
`ui.js` lädt **immer zuletzt** (es ist das einzige DOM-nahe Modul). Der Harness prüft
zusätzlich, dass jede eingebundene Datei wirklich im Ordner liegt.
Jeder neue Baustein trägt sein `<script src>` an der richtigen Stelle nach und erweitert
im DOM-Smoke die Liste `erwartet` sowie die Namenszuordnung (`'profil.js': 'DTNProfil'`).

### 4.2 i18n-Struktur *(Begründung dokumentiert, 2026-07-24)*

Dieters ursprünglicher Vorschlag war „eine .js je Sprache". **Stattdessen umgesetzt:**
**ein Schlüssel, drei Sprachen nebeneinander**, aufgeteilt nach Themen:
```js
nahtart_kehl: { de: "Kehlnaht", en: "Fillet weld", pt: "Solda de filete" }
```
**Warum:** Bei drei getrennten Sprachdateien müsste man für jeden neuen Text drei Dateien
anfassen — genau so entstehen Lücken. So ist die Parität **baulich** erzwungen und der
automatische Paritätstest sieht eine fehlende Übersetzung sofort. Die Aufteilung nach Themen
(kern / hilfe / kerbfall) hält die Dateien klein genug für minimale Diffs.

### 4.3 SVG-Bausteinbibliothek — der Größen-Hebel *(entschieden 2026-07-24)*

**Skizzen werden selbst gezeichnet.** Aus Lehrbüchern, Doktorarbeiten oder fremden Programmen
darf **nichts übernommen** werden (Bildrechte). Recherchiert wird, **wie** ein Detail aussieht
(Geometrie, Bezeichnungen, Anwendungsbedingungen) — gezeichnet wird eigenes SVG.

**`svglib.js`** stellt Grundbausteine bereit (Blech, Nahtdreieck, Kraftpfeil, Maßlinie,
Schraffur, Beschriftung). Jede Skizze ist dann nur noch eine **kurze Datenzeile** statt einer
kompletten Grafikdatei. Bei 80–90 Kerbfällen plus Nahtarten, Fugenformen und ISO-2553-Symbolen
ist das der wirksamste Hebel gegen das Größenproblem — und alle Skizzen sehen gleich aus.
Zahlen stehen in der HTML-Legende, nicht im SVG (Übersetzbarkeit).

### 4.4 Technische Leitplanken

- Ein Ordner, keine Unterordner, relative Pfade. Startdatei trägt den Programmnamen, nie `index`.
- Voll- und Test-HTML unterscheiden sich **ausschließlich** in `window.DT_EDITION`.
- `<html lang="de" translate="no">` + notranslate-Meta.
- Gating-Logik **gebündelt in `report.js`**; alle anderen Module bleiben gating-frei.
- Alle Rechenmodule **DOM-frei** und in Node testbar.
- Einheiten konsequent mitführen und anzeigen (mm · N · N/mm² · Nm · °C · kJ/mm · s).
- Am Ende **ein** gebündeltes, obfuskiertes Script, zweimal ausgeliefert.

### 4.5 Schnittstelle `naht.js` (fertig aus N2 — darauf setzt N2b auf)

> **Nicht ändern, nur benutzen.** `naht.js` ist DOM-frei, deterministisch, mutiert seine
> Eingaben nicht und kennt **keine** Profile. Namensraum: `DTNNaht` bzw. `require('./naht.js')`.

**Segmentformate** (das ist die ganze Sprache zwischen `profil.js` und `naht.js`):
```js
{ typ:'linie', y1, z1, y2, z2, a, code }   // gerade Naht, Punkte in mm
{ typ:'kreis', y,  z,  d,      a, code }   // geschlossene Kreisnaht, d = AUSSENdurchmesser
```
`a` ist **je Segment** gesetzt (Steg/Flansch dürfen unterschiedliche a-Maße haben).
`code` ist frei für die Herkunft (z. B. `'flansch_oben'`) und wird nur durchgereicht —
`schaubild.js` (N2c) kann damit später Segmente benennen und einfärben.

**Funktionen:**
| Aufruf | Zweck |
|---|---|
| `linie(y1,z1,y2,z2,a,code)` · `kreis(y,z,d,a,code)` | Segment-Fabriken |
| `laenge(seg)` | Länge in mm (Kreis: π·d) |
| `pruefe(segmente)` | `{ok, fehler:[{code,index}], warnungen:[…]}` |
| `rechne(segmente, {modell})` | Hauptrechnung, siehe unten |
| `offeneEnden(segmente)` | Zahl der freien Segmentenden |
| `verschiebe(segmente,dy,dz)` · `drehe(segmente,grad,y0,z0)` | neue Liste, Eingabe bleibt unberührt |

**Ergebnis von `rechne()`** (alles in mm, mm², mm³, mm⁴; I-Werte auf den Schwerpunkt bezogen):
`ok` · `version` · `modell` · `n_seg` · `l_ges` · `A` · `ys` · `zs` · `Iy` · `Iz` · `Iyz` · `Ip` ·
`I1` · `I2` · `alpha` · `schiefe_biegung` · `ymin/ymax/zmin/zmax` · `y_rand` · `z_rand` ·
`rmax` · `Wy` · `Wz` · `Wt` · `Wy_oben/Wy_unten/Wz_links/Wz_rechts` ·
`geschlossen` · `offene_enden` · `teile[]` (je Segment A, l, ys, zs, Eigenanteile,
Steiner-Anteile — das ist das Futter für die Segmenttabelle im Rechenweg N4) ·
`punkte[]` (Randpunkte mit y, z, r, seg — für die Spannungspunkte in N3) ·
`kontrolle` (Häkchen: `schwerpunkt_ok`, `polar_ok`, `hauptachsen_ok`, `ok`, dazu die
Restwerte `rest_Sy`/`rest_Sz`) ·
`fehler` · `warnungen` · `hinweise`.
**Bei einem Fehler ist `ok:false` und es gibt KEINE Zahlen** — kein stiller Teilwert.

**Zwei benannte Rechenmodelle** (`{modell:'exakt'}` ist Voreinstellung):
`exakt` = Rechteckfläche a × l samt Eigenanteil in Dickenrichtung (deckt sich mit Voigt),
`duennwandig` = klassisches Linienmodell (deckt sich mit Roloff/Matek).

> ⚠️ **KORRIGIERT MIT S39 (2026-08-04).** Hier stand bisher pauschal
> „Unterschied < 0,1 %". Das gilt für die **Flächenmomente** (am SHS
> 100×100×5 mit a = 3 gemessen: I_y **0,02 %**), **nicht aber für die
> Widerstandsmomente**: dort liegt die Randfaser im exakten Modell um a/2
> weiter außen, gemessen **2,9 %** (W_y 38.844 gegen 40.000 mm³). Wer ein
> Lehrbuchbeispiel nachrechnet, findet genau diese Differenz. Zwei
> Assertions in S39 halten beide Zahlen fest.
Das gewählte Modell **muss** im Rechenweg genannt werden (Schlüssel `nb_modell_*`).

**Meldungscodes** (`DTNNaht.CODES`, alle dreisprachig in `i18n_kern.js` vorhanden):
`msg_naht_leer` · `msg_seg_typ` · `msg_seg_a` · `msg_seg_laenge` · `msg_seg_a_zu_gross` ·
`msg_seg_duennwand` · `msg_torsion_offenes_nahtbild` · `msg_hauptachsen_gedreht` ·
`msg_kreis_aussendurchmesser`.
**Ergebnisgrößen** (`DTNNaht.GROESSEN`, 16 Stück) tragen je Code + Einheitsschlüssel;
Beschriftung `gr_<code>`, Laien-ⓘ an den 8 Kerngrößen (`gr_A`, `gr_ys`, `gr_zs`, `gr_Iy`,
`gr_Iz`, `gr_Ip`, `gr_Wy`, `gr_Wt`).

**WAS `naht.js` BEWUSST NICHT TUT — das ist die Aufgabe von N2b:**
- **kein Endkraterabzug 2·a** — `profil.js` liefert schon die *wirksamen* Längen,
- **keine Eckradien**, keine Profilkenntnis, keine Kantenauswahl,
- **keine Bögen** (Segmenttypen sind nur `linie` und `kreis`; die Eckradien der Hohlprofile
  verkürzen die Segmente, sie werden nicht als Bögen modelliert),
- keine Normprüfung (a_min, l_eff, β_Lw) — das sitzt in `validate.js` bzw. `solver.js`.

### 4.6 Schnittstelle `profil.js` (fertig aus N2b — darauf setzen N2c und N7 auf)

> **Nicht ändern, nur benutzen.** `profil.js` ist DOM-frei, deterministisch, mutiert seine
> Eingaben nicht und rechnet **keine Querschnittswerte** — das bleibt `naht.js`.
> Namensraum: `DTNProfil` bzw. `require('./profil.js')`. Lädt **nach** `naht.js`.

**Aufruf:** `DTNProfil.baue({ profil, kanten, b, h, d, tw, tf, t1, r_ecke, a, a_steg, a_flansch, endkrater })`
Die Feldnamen sind **exakt die Feldcodes aus `validate.js`** — das Formular kann seine Werte
unverändert durchreichen. `endkrater` ist standardmäßig `true`.

**7 Profile · 19 Kantenkombinationen** (`PROFILE`, `KANTEN_JE_PROFIL`, `kantenFuer(profil)`):

| Profil | Maße | Kantenauswahl |
|---|---|---|
| `blech` | b, t1 | rundum · flanken · stirn · eine_flanke |
| `rohr_rechteck` | b, h, t1, r_ecke | rundum · flanken · stirn |
| `rohr_rund` | d, t1 | rundum |
| `i_profil` | b, h, tw, tf | rundum · flansche · steg · flansche_steg |
| `u_profil` | b, h, tw, tf | rundum · flansche · steg · flansche_steg |
| `winkel` | b, h, t1 | rundum · flanken |
| `vollrund` | d | rundum |

`t1` ist bewusst **Doppelnutzung**: Blechdicke, Wanddicke bzw. Schenkeldicke — so wird kein
Maß zweimal abgefragt. Alle Maße sind **Außenmaße**, b liegt in y, h in z, das Profil liegt
mittig um den Ursprung.

**RAUPENMODELL — das ist der fachliche Kern des Moduls:**
Eine Kantenauswahl erzeugt **Schweißraupen**, nicht lose Segmente. Jede Raupe ist umlaufend
oder offen. Der **Endkraterabzug greift je FREIEM ENDE** (a am Anfang, a am Ende = 2·a je
offener Raupe) — **nicht je Segment**: innere Stoßstellen einer Raupe sind keine Endkrater.
Abgezogen wird **geometrisch** (der Endpunkt wandert um a nach innen), notfalls über
Segmentgrenzen hinweg; damit stimmt nicht nur die Länge, sondern auch die **Lage**.
Beispiele: I-Profil `flansche` = 2 Raupen (2×2·a), `flansche_steg` = 4 Raupen (4×2·a) bei
**identischer Geometrie** wie `rundum` (0·a) · Winkel `flanken` = **eine** Raupe um die Ecke.

**Rückgabe bei `ok:true`:**
`profil` · `kanten` · `segmente[]` (fertiges naht.js-Format) · `info[]` (je Segment: `code`,
`gruppe`, `a`, `l`, `t`, `raupe`, `geschlossen`) · `n_seg` · `raupen` · `offene_raupen` ·
`umlaufend` · `endkrater` · `endkrater_abzug` · `l_brutto` · `l_netto` · **`l_vorschlag`**
(= l_netto, der überschreibbare Längenvorschlag nach Regel 3.1) · `l_kontur` ·
`bogen_nicht_gerechnet` · `a`/`a_steg`/`a_flansch` · `fehler` · `warnungen` · `hinweise`.
**Bei einem Fehler ist `ok:false` und es gibt KEINE Zahlen und KEINE Segmente.**

**Weitere Funktionen:** `kantenFuer(profil)` · `masseFuer(profil)` · `pruefeMasse(profil, masse)` ·
`umfang(profil, kanten, masse)` (Bruttoumfang, dient im Harness als zweiter Rechenpfad).

**Segmentgruppen** (`SEGMENTGRUPPEN`, Beschriftung `sg_<gruppe>`): `flanke` · `stirn` ·
`flansch` · `steg` · `kante` · `kreis`. Jedes Segment trägt zusätzlich einen sprechenden
`code` (z. B. `flansch_oben_aussen`) — **das ist das Futter für die Einfärbung in N2c** und
für die Segmenttabelle im Rechenweg N4.

**Eckradien (sicherheitsrelevant):** sie verkürzen die geraden Segmente; der **Bogen wird
bewusst NICHT mitgerechnet**, weil dort keine saubere Kehlnaht mit dem angegebenen a-Maß
entsteht. Der nicht gerechnete Anteil steht als `bogen_nicht_gerechnet` im Ergebnis, der
geometrische Umfang als `l_kontur`. Die Raupe bleibt **umlaufend** (kein Endkraterabzug) —
und weil `naht.js` die Ecklücken als offene Enden sieht, liefert `profil.js` den Hinweis
`msg_eckluecke_keine_offene_naht`. **N3/N4 müssen `umlaufend` auswerten**, nicht
`geschlossen` aus `naht.js`.

**Meldungscodes** (`DTNProfil.CODES`, alle dreisprachig in `i18n_kern.js`):
Fehler `msg_profil_fehlt` · `msg_profil_unbekannt` · `msg_kanten_fehlt` ·
`msg_kanten_unpassend` · `msg_mass_fehlt` · `msg_mass_tf_zu_gross` · `msg_mass_tw_zu_gross` ·
`msg_mass_r_zu_gross` · `msg_mass_t_zu_gross` · `msg_profil_a_fehlt` ·
`msg_endkrater_zu_lang` (jeder Fehler nennt das betroffene **Feld**).
Hinweise `msg_endkrater_abzug` · `msg_endkrater_umlaufend` · `msg_endkrater_aus` ·
`msg_eckradius_verkuerzt` · `msg_eckluecke_keine_offene_naht` · `msg_a_je_segment` ·
`msg_nur_gewaehlte_kanten` · `msg_masse_sind_aussenmasse`.

**WAS `profil.js` BEWUSST NICHT TUT:**
- keine Querschnittswerte (das ist `naht.js`), keine Spannungen (N3),
- keine Normprüfung von a und l (`validate.js` / `solver.js`),
- **kein Normprofil-Katalog** — Stufe 2 nach V1 (2.2b), Stufe 1 kann jede Abmessung,
- keine Bögen: Eckradien verkürzen Segmente, sie werden nicht gezeichnet.

### 4.7 Schnittstelle `svglib.js` + `schaubild.js` (fertig aus N2c)

> **Nicht ändern, nur benutzen.** Beide Module sind DOM-frei, deterministisch und mutieren
> ihre Eingaben nicht. Namensräume `DTNSvgLib` und `DTNSchaubild`. `schaubild.js` lädt
> **nach** `svglib.js`, `naht.js` und `profil.js`.

**`svglib.js` — 13 Grundbausteine, jeder gibt einen SVG-String zurück:**
`linie` · `polylinie` (offen/geschlossen) · `kreis` · `rechteck` · `nahtdreieck` ·
`kraftpfeil` · `masslinie` · `schraffur` · `punktmarke` · `schwerpunktkreuz` ·
`achsenkreuz` · `rahmen` · `svg` (Hülle mit viewBox).
Dazu `box(punkte)` · `boxVereinigen(a,b)` · `sicht(box, {breite,hoehe,rand,skala_max})` ·
`zahl(x)` · `PALETTE`.

- **`sicht()` ist die Auto-Skalierung**: sie liefert `skala`, `mm_je_px` und die Funktionen
  `px(y)`, `pz(z)`, `pl(mm)`. **z zeigt nach oben**, die SVG-Y-Achse wird gedreht.
  Entartete Fälle (Breite 0, Höhe 0, einzelner Punkt) sind abgefangen — nie NaN.
- **Kein Text im SVG** (4.3): es wird kein `<text>`/`<tspan>` erzeugt. Statt Text trägt jeder
  Baustein `data-code` mit einem **sprachneutralen Code**; beschriftet wird in der HTML.
- Zahlen werden auf 3 Nachkommastellen formatiert, ohne Exponent und ohne „−0".
- Kein fremdes Bild, keine externe Referenz, keine `<marker>`-IDs (Pfeilspitzen sind Polygone).

**`schaubild.js` — `zeichne(eingabe)`:**
```js
{ segmente,            // Pflicht, naht.js-Format
  info,                // optional, aus profil.js (gruppe, raupe, geschlossen)
  ergebnis,            // optional, aus naht.js (ys, zs) → Schwerpunkt
  kontur,              // optional, volle Profilkontur → gestrichelt
  breite, hoehe, rand, strichbreite,
  schwerpunkt, achsen, luecken, rahmen }   // Schalter, alle standardmäßig an
```
**Rückgabe:** `ok` · `svg` · `legende[]` · `gruppen[]` · `n_seg` · `n_kontur` · `n_luecken` ·
`luecken[]` · `schwerpunkt` · `box` · `sicht` · `mm_je_px` · `gezeichnet` ·
`fehler` · `warnungen` · `hinweise`. Bei einem Fehler ist `ok:false` und `svg:''` —
**kein halbes Bild**.

**`ausProfil(eingabe, opt)`** nimmt **exakt dieselbe Eingabe wie `DTNProfil.baue()`** und
erledigt alles in einem Aufruf: Nahtbild bauen → Kontur holen → Schwerpunkt rechnen →
zeichnen. Zusätzlich im Ergebnis: `profil` (Ergebnis von `profil.js`) und `ergebnis`
(Ergebnis von `naht.js`). **Die Kontur entsteht durch einen zweiten `baue()`-Aufruf mit
`kanten:'rundum'` und `endkrater:false`** — keine neue Schnittstelle; ohne Endkraterabzug,
weil die Kontur die Bauteilkante zeigt und keine Naht ist.

**Legendendaten** (`legende[]`) sind **Codes, keine Texte**: je Eintrag `code` (`sg_<gruppe>`
bzw. `sb_*`), `farbe`, `art`, `stil`, `n_seg`, `l`. Die Summe der Längen aller Naht-Einträge
ist **identisch mit `l_netto` aus `profil.js`** (durch Assertion abgesichert).

**Farben:** eine Farbe je Segmentgruppe (`FARBEN`), alle sechs verschieden und auf hellem wie
dunklem Grund lesbar. Hilfslinien (Kontur, Achsen, Ecklücken) nutzen `currentColor` und passen
sich damit von selbst an Hell/Dunkel an.

**Meldungscodes** (`DTNSchaubild.CODES`, dreisprachig): `msg_grafik_leer` ·
`msg_grafik_keine_svglib` · `msg_grafik_symbolisch` · `msg_grafik_kontur_gestrichelt` ·
`msg_grafik_eckluecke_sichtbar` · `msg_grafik_massstab_auto`.
Legendenschlüssel: `sb_naht` · `sb_kontur` · `sb_eckluecke` · `sb_schwerpunkt` · `sb_achsen`
(dazu `sb_titel`, `sb_legende`, `sb_massstab`, `sb_mm_je_px`).

**WAS DIE GRAFIK BEWUSST NICHT TUT:**
- **sie rechnet nichts** — Schwerpunkt und Werte kommen aus `naht.js`, Segmente aus `profil.js`,
- **kein maßstäbliches a-Maß**: die Naht ist ein Strich fester Breite, Lage und Länge dagegen
  sind maßstäblich (Hinweis `msg_grafik_symbolisch` steht im Ergebnis),
- **keine erfundenen Ecklücken**: sie werden ausschließlich über `info[].raupe` erkannt —
  ohne `info[]` gibt es keine Lückenmarkierung,
- **kein Text**, keine Zahl, keine Einheit im SVG.

### 4.8 Schnittstelle `solver.js` (fertig aus N3 — darauf setzt N4 auf)

> **Nicht ändern, nur benutzen.** `solver.js` ist DOM-frei, deterministisch und mutiert
> seine Eingaben nicht. Namensraum `DTNSolver`. Lädt **nach** `daten.js`, `naht.js` und
> `profil.js` (es benutzt alle drei).

**Ein Aufruf:** `DTNSolver.rechne(eingabe)`.

**Eingabe** (alle Feldnamen sind die Feldcodes aus `validate.js` bzw. die Gruppencodes aus
`optionen.js` — das Formular kann seine Werte unverändert durchreichen):
```js
{ welt:'A'|'B', rechenrichtung:'nachweis'|'auslegung',
  nachweisverfahren:'richtungsbezogen'|'vereinfacht',      // nur Welt A
  werkstoff, werkstoffgruppe, zustand, zusatzwerkstoff, bw_regelsatz,
  nahtart, nahtguete, lastfall, weltb_nahtgruppe,          // Welt B: guete/lastfall/nahtgruppe
  segmente[] + info[] + umlaufend   ODER   profil_eingabe:{…wie DTNProfil.baue()…},
  modell:'exakt'|'duennwandig',
  N, Qy, Qz, My, Mz, T,            // Kurzform Q (=Qz) und M (=My) erlaubt
  a, t1, t2, t_min, a_rundung:'ganze_mm'|'halbe_mm', beta_lw_anwenden,
  gammaM2, gammaMw, betaW, fu, fw, Re, S, nu, a_min }      // alle „eigener Wert"
```
Lasten: **N und Q in Newton, M und T in Newtonmeter** (intern in Nmm umgerechnet).
Ist eine Last **doppelt** angegeben (Kurzform *und* ausführliche Form mit verschiedenen
Werten), gibt es einen **ehrlichen Fehler** statt einer stillen Auswahl.

**Das Spannungsmodell — „Umklappen der Naht" (R1 Abschnitt 1.1):**
Je Randpunkt entstehen `sigma_x` (senkrecht zur Anschlussebene, aus N, M_y, M_z),
`tau_n` (in der Ebene, quer zur Nahtachse) und `tau_t` (in der Ebene, längs), letztere
aus Q und T. Bei der 45-Grad-Kehlnaht teilt sich die quer wirkende Resultierende
`q_senk = √(sigma_x² + tau_n²)` auf in `sigma_senk = tau_senk = q_senk/√2`; längs bleibt
`tau_par = |tau_t|`. **Die durchgeschweißte Stumpfnaht wird NICHT umgeklappt.** Die
teilweise durchgeschweißte Naht rechnet mit `a_wirksam = a − 2 mm`.
Zwei belegte Proben, im Harness S26 nachgerechnet: bei Querzug ist das vereinfachte
Verfahren um **√(3/2) ≈ 1,2247** strenger, bei Längsbeanspruchung liefern beide
Verfahren **dasselbe**. Biegung läuft über die **allgemeine schiefe Biegung** (deckt
I_yz ≠ 0 mit ab), Kreisnähte werden auf **72 Auswertepunkte** verdichtet.

**Die beiden Welten sind BAULICH getrennt (2.8), nicht nur durch Text:** es gibt zwei
Widerstandsbauer. Ein Welt-A-Widerstand enthält **kein** `S`, `nu`, `Re`, `sigma_zul`;
ein Welt-B-Widerstand enthält **kein** `betaW`, `gammaM2`, `R_d_vereinfacht`. Wer die
falsche Zahl sucht, findet sie nicht. Durch Assertions abgesichert.

**Rückgabe bei `ok:true`:**
`welt` · `rechenrichtung` · `verfahren` · `modell` · `nahtart` · `nahttyp` · `umklappen` ·
`a_abzug` · `werkstoff{…}` · `widerstand{…}` (je Welt verschieden, mit `pfad`, `formel`,
`R_d` und den Quellen) · `schnittgroessen{N,Qy,Qz,My,Mz,T}` (in N und Nmm) ·
`nahtbild{…}` (Auszug aus `naht.js` inkl. `kontrolle` und `umlaufend`) ·
`punkte[]` (je Punkt alle sieben Spannungsanteile + `sigma_v` + `sigma_res`) ·
`massgebend` (der Punkt, der entscheidet) · `nachweise[]` (je Nachweis `code`, `ist`,
`grenze`, `eta`, `erfuellt`) · `eta` · `ampel` (`gruen`|`gelb`|`rot`) · `erfuellt` ·
`auslegung{a_erf, a_gewaehlt, a_bezug, faktor, stufe, rundung, iterationen,
je_segment[], eta_mit_gewaehlt}` ·
`grenzen{a_min, je_segment[], je_zug[], n_zuege, mehrsegmentig, verletzt[], beta_Lw}` ·
`nicht_geprueft[]` (die Liste 2.4 als **Kopie**) · `fehler` · `warnungen` · `hinweise`.
**Bei einem Fehler ist `ok:false` und es gibt KEINE Zahlen** — kein stiller Teilwert.

**Auslegung (2.3):** direkt aufgelöst über σ ∝ 1/a, danach **nachiteriert** (nötig im
Modell `exakt` wegen der a³-Glieder). Pflicht-Assertion: `a_erf` in den Nachweis
eingesetzt ergibt **η = 1**. Danach wird **AUFgerundet** — je Segment einzeln, denn a ist
ein Fertigungsmaß. `a_erf` **und** `a_gewaehlt` stehen beide im Ergebnis. **Nach** dem
Aufrunden wird gegen `a_max = 0,7 · t_min` (je Segment!) und `a_min` geprüft; passt es
nicht, gibt es eine sichtbare Warnung statt eines stillen Ergebnisses.

**Weitere Funktionen:** `nahtTyp(code)` → `'kehl'|'stumpf_voll'|'stumpf_teil'|null` ·
`rundeA(a_erf, rundung)` · `aMax(t_min)` · `ampel(eta)` ·
`schnittgroessen(F, e, richtung)` (geometrischer Lastweg, 2.12).

**Meldungscodes** (`DTNSolver.CODES`, 41 Stück, alle dreisprachig): 17 Fehler
(`msg_sv_welt_fehlt`, `msg_sv_keine_last`, `msg_sv_last_doppelt`,
`msg_sv_verfahren_unpassend`, `msg_sv_alu_nur_weltA`, `msg_sv_a_wirksam_null` …),
5 Warnungen (`msg_sv_a_ueber_amax`, `msg_sv_a_unter_amin`, `msg_sv_l_eff_zu_kurz`,
`msg_sv_lange_naht`, `msg_sv_nicht_erfuellt`) und 19 Hinweise (`msg_sv_umklappen`,
`msg_sv_querkraft_mittelwert`, `msg_sv_weltb_ohne_faktor3`, `msg_sv_alu_wez`,
`msg_sv_umlaufend_aus_profil` …). **Ergebnisgrößen** (`DTNSolver.GROESSEN`, 16 Stück)
tragen je Code + Einheitsschlüssel, Beschriftung `sv_<code>`.

**DIE a-GRENZEN SIND KEHLNAHTREGELN — SEIT N7 (nicht wieder verallgemeinern):**
`a ≥ a_min` und `a ≤ 0,7·t` gelten für die **Kehlnaht** und die **teilweise
durchgeschweißte** Naht (HV/HY/DHY). Bei der **durchgeschweißten** Stumpfnaht
gelten sie **nicht** — dort *ist* `a = t` die Definition, `a ≤ 0,7·t` wäre also
rechnerisch immer verletzt und `a ≥ 3 mm` würde jedes dünne Blech falsch
anzeigen. `grenzen.a_grenzen_gelten` sagt es heraus, `a_min` und `a_max` stehen
dann auf `null`, und der Hinweis `msg_sv_a_grenzen_stumpf_voll` benennt es.
*(Dieters Entscheidung 2026-08-04: ausgenommen ist ausschließlich die
durchgeschweißte Naht.)*

**AUSLEGUNG MIT PROFILEINGABE — SEIT N7 (zwei Dinge, die zusammengehören):**
1. **Bezugsmaß.** Im Auslegungsfall ist `a` kein Pflichtfeld, `profil.baue()`
   verlangt aber eins. Der Solver setzt deshalb `A_BEZUG_AUSLEGUNG` ein und
   meldet `msg_sv_a_bezug_auslegung`. **Vorher scheiterte jede Auslegung über
   das Formular** an `msg_profil_a_fehlt`.
2. **Die Geometrie hängt selbst am a-Maß.** Der Endkraterabzug `2·a` je offener
   Raupe wird geometrisch abgezogen — mit anderem Bezugsmaß kam ein anderes
   `a_erf` heraus (gemessen: **1,6931 bei Bezug 3 gegen 1,8628 bei Bezug 10**,
   rund 10 %). Deshalb läuft die **ganze Kette erneut** mit dem gefundenen a,
   bis sich das Nahtbild nicht mehr bewegt (`auslegung.geometrie_runden`,
   Hinweis `msg_sv_auslegung_geometrie`). Bei umlaufender Naht gibt es keinen
   Endkraterabzug — dort hält die Schleife sofort. Eine Assertion prüft, dass
   **fünf verschiedene Bezugsmaße dasselbe `a_erf`** liefern.

**`nahtbild.profil_eingabe`** gibt die Eingabe heraus, mit der **wirklich
gerechnet wurde** (im Auslegungsfall mit dem gefundenen a). Wer das Nahtbild
zeichnet, muss dieselbe Geometrie zeichnen — sonst zeigt das Bild etwas
anderes als die Zahlen, oder es bleibt ganz leer.

**DIE PRÜFEBENEN — SEIT N5c-3 GETRENNT (nicht wieder zusammenlegen):**
| Prüfung | Ebene | warum |
|---|---|---|
| `a ≥ a_min`, `a ≤ 0,7·t` | **je Segment** | a und t sind Segmenteigenschaften |
| `l ≥ max(6·a; 30 mm)` | **je Nahtzug** | EN 1993-1-8 §4.5.1(2) meint eine kurze, freistehende Naht. Eine umlaufende Naht ist EIN Zug, auch um zwölf Ecken — ein 15-mm-Stück mittendrin ist keine 15-mm-Naht |
| `β_Lw` (lange Naht) | **je Segment** | zielt auf lange Laschenanschlüsse; auf Zug-Ebene würde jeder umlaufende Profilzug sie fälschlich auslösen |

Die Zugehörigkeit kommt aus `info[i].raupe` (von `profil.js`). **Fehlt sie** — freier
Segmentmodus —, ist jedes Segment ein eigener Zug: die strengere Annahme.
`grenzen.je_zug[]` führt je Zug `{index, n_seg, segmente[], l, a, l_eff_min, geschlossen,
zu_kurz}`. Der Endkraterabzug `2·a` sitzt **schon in `profil.js`** und greift dort je
offenem Zug — im Solver darf er **nicht noch einmal** abgezogen werden.
**Die Längenprüfung ist eine WARNUNG, kein Nachweis** (Dieter, 2026-08-03): sie färbt die
Ampel nicht und trägt im Rechenweg keinen Haken. Wer ihr einen gibt, holt den Widerspruch
„grüne Ampel neben rotem Nachweis" zurück.

**WAS `solver.js` BEWUSST NICHT TUT:**
- **keine Texte** — nur sprachneutrale Codes (N4/N5 beschriften),
- **keine Querschnittswerte** (`naht.js`) und **keine Profile** (`profil.js`),
- **keine Ermüdung** (N13) — Lastfall und Ermüdung werden NIE multipliziert,
- **keinen Grundwerkstoff-Nachweis**, auch nicht für die Alu-WEZ: die Abminderung wird
  ausgewiesen, aber ehrlich als **nicht Teil des Nahtnachweises** beschriftet (2.4),
- **keine erfundene Zuordnung** von Nahtart auf Welt-B-Tabellenzeile: die Zeile wählt der
  Anwender, sonst läuft ehrlich der Formelweg,
- **kein β_Lw stillschweigend**: der Beiwert wird berechnet und gemeldet, angewendet nur
  auf ausdrücklichen Wunsch.

### 4.9 Schnittstelle `rechenweg.js` (fertig aus N4 — darauf setzen N5c und N11 auf)

> **Nicht ändern, nur benutzen.** `rechenweg.js` ist DOM-frei, deterministisch und mutiert
> seine Eingaben nicht. Namensraum `DTNRechenweg`. Lädt **nach** `naht.js`, `profil.js`,
> `solver.js` und `i18n_kern.js`.

**Zwei Einstiege:**
- `DTNRechenweg.baue(eingabe)` — nimmt **exakt dieselbe Eingabe wie `DTNSolver.rechne()`**,
  rechnet und beschriftet in einem Aufruf.
- `DTNRechenweg.ausErgebnis(ergebnis, eingabe)` — wenn `solver.js` schon gerechnet hat.
  **Das ist der Weg für N5**: einmal rechnen, dann beschriften — nicht zweimal rechnen.

**Die Schrittliste ist DATEN, kein Text.** Je Schritt:
```js
{ nr, abschnitt, code,        // code = i18n-Schlüssel der Überschrift
  formel,                     // Klartext, Symbole sprachneutral ('A_w = Σ (a_i · l_i)')
  vorlage, werte,             // '{0} / {1} = {2}' + [{v, nk}] → erst beim Rendern gefüllt
  ergebnis, nk, einheit,      // Zahl + Nachkommastellen + Einheitsschlüssel
  text,                       // Ergebnis, das selbst ein Code ist ('opt_werkstoff_S355')
  liste,                      // Liste von Codes (Liste 2.4, Warnungen, Hinweise)
  quelle,                     // benannte Grundlage, Code aus QUELLEN
  haken,                      // RECHENPROBE: true | false | null
  erfuellt,                   // NACHWEIS:    true | false | null
  probe, hinweis }            // Codes
```

**ZWEI HÄKCHENARTEN — NIE VERMISCHEN (Festlegung aus N4):**
- **`haken`** ist die **Rechenprobe**: ein zweiter, unabhängiger Rechenpfad. `false` heißt
  **Programmfehler**.
- **`erfuellt`** ist der **Nachweis**: a ≥ a_min, a ≤ a_max, η ≤ 1. *(Die Mindestlänge
  gehört seit N5c-3 NICHT mehr dazu — sie ist eine Warnung, 5.1-0. Und die beiden
  a-Schritte tragen seit N7 **keinen Haken**, wenn die Grenzen gar nicht gelten:
  bei der durchgeschweißten Naht stehen sie ohne `erfuellt` da, mit dem Hinweis,
  warum. Ein grüner Haken auf eine Regel, die nicht greift, behauptet eine
  Prüfung, die nicht stattgefunden hat.)* `false` heißt
  **die Naht trägt so nicht** — das ist ein normales, ehrliches Ergebnis, kein Fehler.
- Im Gesamtergebnis: `selbstpruefung_ok` (alle Rechenproben) und `nachweis_ok` (alle
  Nachweise) sind **getrennte Felder**. Die Oberfläche muss sie auch **optisch** trennen,
  sonst ist die Selbstprüfung als Warnsignal wertlos.

**11 Abschnitte in fester Reihenfolge** (`ABSCHNITTE`): `rw_ab_eingaben` · `rw_ab_nahtbild` ·
`rw_ab_schnittgroessen` · `rw_ab_spannungen` · `rw_ab_widerstand` · `rw_ab_nachweis` ·
`rw_ab_auslegung` · `rw_ab_grenzen` · `rw_ab_selbstpruefung` · `rw_ab_nicht_geprueft` ·
`rw_ab_hinweise`. Dazu **42 Schrittcodes** (`SCHRITTE`), **18 Probencodes** (`PROBEN`) und
**8 benannte Grundlagen** (`QUELLEN`) — jeder Code dreisprachig belegt.

**Rückgabe von `baue()` / `ausErgebnis()`:**
`ok` · `version` · `welt` · `rechenrichtung` · `verfahren` · `modell` ·
`abschnitte[]` (je `{code, schritte[]}`) · `schritte[]` (flach, durchnummeriert) ·
`n_schritte` · `n_haken` / `n_haken_ok` · `n_nachweise` / `n_nachweise_ok` ·
`selbstpruefung_ok` · `nachweis_ok` · `nicht_geprueft[]` ·
`fehler` / `warnungen` / `hinweise` · `ergebnis` (die Solver-Rückgabe durchgereicht).
**Bei einem Fehler ist `ok:false` und es gibt NULL Schritte** — kein halber Rechenweg.

**Weitere Funktionen:**
`rendere(rw, sprache)` → fertige Zeilen mit `titel`, `formel`, `eingesetzt`, `ergebnis`,
`wert_text`, `quelle`, `haken_zeichen`, `erfuellt_zeichen`, `erfuellt_text`, `probe`,
`hinweis`, `liste[]` · `alleTexte(gerendert)` (ein String, für die Platzhalterprüfung) ·
`pruefe(rw)` · `zahl(x, nk, sprache)` · `fuellen(vorlage, werte, sprache)`.

**Zahlformat:** DE und PT mit Dezimalkomma und Tausenderpunkt, EN umgekehrt. Negatives
Vorzeichen ist ein echtes Minuszeichen (U+2212), fehlender Wert ein Gedankenstrich.

**DIE PROBEN — das ist der Kern des Moduls.** Nachgerechnet werden unabhängig:
l_ges gegen Σ l_i · A_w gegen Σ a·l · y_s/z_s gegen Σ(A_i·y_i)/A_w · I_p gegen I_y + I_z ·
I_1 + I_2 gegen I_y + I_z · W_t gegen I_p/r_max · l_netto gegen l_brutto − Endkraterabzug ·
σ_x aus der allgemeinen schiefen Biegung · τ über die Invarianz der Projektion ·
q⊥ und die Aufteilung mit 1/√2 · σ_v aus ihren Anteilen · R_d aus ihren Faktoren ·
η aus ist/Grenze · a_erf gegen a_bezug·Faktor · a_gewaehlt gegen die Stufenreihe ·
die Momentenumrechnung Nm → Nmm gegen die Eingabe.
**Durch Assertion gesichert: 27 verfälschte Ergebniswerte kippen alle ein Häkchen** —
bei einer Verfälschung von nur 1e-6 relativ.

**WAS `rechenweg.js` BEWUSST NICHT TUT:**
- **es rechnet den Nachweis nicht noch einmal** — die maßgebenden Zahlen kommen aus
  `solver.js`, nachgerechnet wird nur zur Probe,
- **es entscheidet nichts** (keine Ampel, keine Auslegung, keine Grenzen) — es beschriftet
  und prüft,
- **es erfindet keine Zahl**: fehlt ein Wert, bleibt der Schritt ohne Zahl und ohne Haken
  statt mit einem stillen Ersatzwert,
- **keine Oberfläche, kein DOM, keine Formatierung außerhalb von `rendere()`**.

### 4.10 Schnittstelle `ui.js` (Grundgerüst aus N5a — darauf setzen N5b, N5c und N5d auf)

> **Nur erweitern, nicht umbauen.** `ui.js` ist das **einzige DOM-nahe Modul** und enthält
> **keine Fachlogik** — durch Assertion abgesichert: der Quelltext nennt weder `DTNSolver`
> noch `DTNNaht`, `DTNProfil`, `DTNRechenweg`, `DTNSchaubild` oder `DTNData` und enthält
> kein `Math.`. Namensraum `DTNUi`. Lädt **zuletzt**.

**Zwei Betriebsarten:**
- **Im Browser** startet sich `ui.js` selbst (`root.DTNUi = api; api.start(window, document)`).
- **In Node** exportiert es nur (`module.exports`) und startet **nicht** von allein — der
  DOM-Smoke ruft `DTNUi.start(win, doc)` gegen den Mini-DOM-Shim auf. So läuft die echte
  Oberfläche im Test, nicht eine nachgebaute.

**Konstanten (der Harness prüft gegen sie):**
| Name | Inhalt |
|---|---|
| `START_THEME` | `'dark'` — **bindend nach 3.1**, in beiden Editionen gleich |
| `START_SPRACHE` | `'de'` |
| `BEREICHE` | die 8 Aufklappbereiche: `grund` · `werkstoff` · `naht` · `geometrie` · `lasten` · `beiwerte` · `zusatz` · `ausfuehrung` |
| `BEREICH_START_OFFEN` | `'grund'` — beim Start ist genau ein Bereich offen (Handy zuerst) |
| `IDS` | 28 Pflicht-Elemente, die in **beiden** HTMLs stehen müssen |
| `KLASSEN` | 37 CSS-Klassen, die `style.css` tragen muss |
| `GERUEST_BUTTONS` | Knopf-Id → i18n-Code der ehrlichen „noch nicht verdrahtet"-Meldung |

**`start(win, doc)` gibt eine Sitzung zurück** (und legt sie auf `DTNUi.sitzung` ab):
`sprache()` · `setSprache(l)` · `theme()` · `setTheme(t)` · `toggleTheme()` · `edition()` ·
`bereiche()` · `istOffen(code)` · `schalte(code, auf)` · `umschalten(code)` · `leeren()` ·
`meldung(text)` · `infoZeigen(auf)` · `uebersetze()`.

**Beschriftungsregel (bindend für alle weiteren Etappen):** Texte stehen **nie** im Code und
**nie** in der HTML, sondern nur im Wörterbuch. Die HTML trägt Codes:
`data-i18n="key"` (Textinhalt) · `data-i18n-title="key"` (Titel) · `data-i18n-ph="key"`
(Platzhalter). `uebersetze()` läuft über alle drei Sorten. Fehlt ein Schlüssel, erscheint
sichtbar `[key]` — und **Harness und DOM-Smoke lassen genau das durchfallen**.

**Namensschema der Aufklappbereiche** (N5b füllt nur noch den Korpus):
```
acc_<code>        Rahmen        accBtn_<code>    Kopf (Button, aria-expanded)
accTitel_<code>   Titel         accCaret_<code>  Pfeil ▸/▾
accBody_<code>    Korpus (hidden)   accHint_<code>   Laien-Erklärung
```
Titel und Erklärung kommen aus `sec_<code>` und `sec_<code>_hint`.

**WAS `ui.js` BEWUSST NICHT TUT:**
- **es rechnet nichts** und ruft **kein** Rechenmodul auf — N5 rendert nur,
- es kennt **keine** Werkstoffe, Profile, Nahtbilder oder Beiwerte,
- **kein Gating** — das sitzt gebündelt in `report.js` (N11),
- **keine Registrierung** — Lizenzzeile und Aktivierung kommen in N12.

### 4.10b Was N5b zu `ui.js` hinzugefügt hat (Eingabeseite)

> **Nur erweitern, nicht umbauen.** Das Formular wird **aus den Modulen erzeugt**, nicht
> als Markup gepflegt (Dieters Entscheidung 2026-07-27, Begründung im Entscheidungslog):
> `optionen.js` liefert die Auswahlgruppen, `validate.js` die Felder, `i18n_hilfe.js` die
> Laien-ⓘ. Es gibt **keine zweite Liste** — der Harness prüft das.

**Erlaubt in `ui.js` sind genau drei Fremdmodule:** `DTNOptions`, `DTNValidate` und die
i18n-Wörterbücher. Die sechs Rechenmodule und `Math.` bleiben verboten (Assertion S30).

**ID-SCHEMA der erzeugten Elemente** — was der Anwender anklickt, hat eine Id, sonst wäre
es nicht prüfbar (Regel aus N5a):
```
host_<bereich>    Anker in der HTML      row_g_<gruppe>  Zeile einer Auswahl
lbl_g_<gruppe>    Beschriftung           info_g_<gruppe> Laien-ⓘ
sel_<gruppe>      das <select>           pf_g_<gruppe>   Pflichtstern
row_f_<feld>      Zeile eines Feldes     lbl_f_<feld>    Beschriftung
info_f_<feld>     Laien-ⓘ                fld_<feld>      das <input>
unit_<feld>       Einheit                pf_f_<feld>     Pflichtstern
ev_<feld>         „eigener Wert"-Haken   evl_<feld>      dessen Label
zus_<code>        Freischalt-Haken       zusn_<code>     dessen Hinweiszeile
```

**`ZUORDNUNG`** — reine Anordnung, keine Fachlogik: welche Gruppe und welches Feld in
welchem der acht Bereiche erscheint. Der Harness prüft, dass **jede der 20 Gruppen und
jedes der 29 Felder genau einmal** vorkommt und kein unbekannter Code auftaucht.
Je Bereich zusätzlich `leit` (Leitauswahl), `optional_wenn` (Bedingung im Format aus
`optionen.js`) und `etappe` (noch nicht gebaut). **N5b baut 18 Gruppen; `iso5817` und
`exc` tragen `etappe:'N5d'`** und zeigen dort einen ehrlichen Hinweis statt leerer Fläche.

**Sichtbarkeitsregel für Felder — eine einzige, dokumentierte Regel:**
1. Pflicht im aktuellen Zustand → sichtbar.
2. sonst: Bereich hat `optional_wenn` → nur wenn die Bedingung passt.
3. sonst: Bereich hat `leit` → nur wenn diese Auswahl getroffen ist.
4. sonst → sichtbar.

**Neue Sitzungsfunktionen:** `gebaut()` · `zustand()` (Auswahlwerte + `<code>_aktiv` der
Zusatzbereiche) · `werte()` (Feldwerte) · `aktualisiere()` · `vorbelegen()` ·
`eigenerWert(code, an)` · `pruefen()` · `hilfeZeigen(key, titelKey)` · `hilfeSchliessen()`.

**MILDE ANZEIGE, STRENGE BEREINIGUNG — und die Brücke dazwischen (bindend):**
`optionen.js` zeigt eine Option noch an, solange ihr Bezugswert **nicht entschieden** ist
(N1-Log), räumt sie beim Bereinigen aber **streng** weg. Beides zusammen hätte bedeutet:
der Anwender tippt eine angebotene Option an und sie verschwindet sofort wieder.
`ui.js` überbrückt das mit `bereinigeSchonend()`: eine weggeräumte Auswahl wird
**zurückgeholt, solange die milde Regel sie weiterhin anbietet** — aber **nicht**, wenn
einer ihrer Bezugswerte **gerade** weggefallen ist. Damit bleibt die strenge Regel wirksam
(Welt A + Alu → Welt B löscht beides), ohne die Bedienung zu sabotieren.

**„eigener Wert" (Plan 3.1):** die 9 überschreibbaren Felder starten **gesperrt**; wo ein
Standardwert im Feldschema steht, ist er vorbelegt (`gammaM2` 1,25 · `gammaMw` 1,25 ·
`S` 1,5 · `r_ecke` 0). Der Haken gibt frei, der abgehakte Haken stellt den Tabellenwert
wieder her. Werte, die aus der **Werkstofftabelle** kommen (`betaW`, `nu`, `Re`,
`a_steg`, `a_flansch`), bleiben leer — `ui.js` darf `daten.js` nicht kennen; gesetzt
werden sie vom Rechenkern in N5c.

**„Berechnen" ab N5b:** es **prüft** (`validate.js`, beide Stufen) und meldet ehrlich, was
fehlt — Feld für Feld markiert. **Gerechnet wird nicht**; das sagt der Prüfkasten auch so.

**„Leeren" (Plan 3.1):** leert wirklich alles und stellt danach **exakt den Zustand der
frisch geöffneten Seite** her. Der DOM-Smoke vergleicht dazu ein vorher aufgenommenes
Sichtbarkeitsbild — Zeichen für Zeichen. **Seit N5c räumt es auch Ergebnis, Rechenweg und
Grafik weg.**

---

### 4.10c Was N5c zu `ui.js` hinzugefügt hat (Ergebnisseite)

**DIE GRENZE VON `ui.js` — GESCHÄRFT, NICHT AUFGEWEICHT (bindend):**
`ui.js` ruft **genau vier** Module auf: **`DTNSolver`** (rechnet), **`DTNRechenweg`**
(beschriftet und formatiert), **`DTNSchaubild`** (zeichnet) und **seit N11
`DTNReport`** (gibt heraus). Die vier liefern Fertiges —
`ui.js` rechnet nichts nach und formatiert nichts nach.
**Die Liste ist zweimal um genau einen Namen gewachsen** (N5c: Rechenweg und Schaubild,
N11: Report) — jedes Mal, weil eine neue Aufgabe eine Adresse brauchte, nie weil eine
Grenze störte.
**Verboten bleiben `DTNNaht`, `DTNProfil` und `DTNData`** — die holt sich der Solver
selbst. Ebenso verboten bleibt jede eigene Rechnung; die Assertion auf `Math.` gilt
unverändert. Aus „kein Rechenmodul" ist damit „diese drei" geworden, nicht „alles erlaubt".

> ⚠️ **Die Assertion liest den Quelltext als ZEICHENKETTE — Kommentare eingeschlossen.**
> In `ui.js` dürfen die verbotenen Modulnamen und `Math.` auch im Fließtext eines
> Kommentars nicht vorkommen. Beim Bauen ist das zweimal zugeschnappt.

**Die Übersetzung Formular → Rechenkern steht in `validate.js`, nicht in `ui.js`:**

| Aufruf | Rückgabe / Zweck |
|---|---|
| `normiert(werte, zustand)` | `{ok, fehler, werte, a_aus_z}` — geprüfte Zahlen als Zahlen; fehlt `a` und ist `z` da, wird `a = z/√2` abgeleitet und das mit `a_aus_z` ausgewiesen |
| `rechenEingabe(werte, zustand)` | `{ok, fehler, eingabe, a_aus_z}` — die fertige Eingabe für `solver.rechne()` |
| `PROFIL_FELDER` | die Feldcodes, die zur Geometrie gehören |

**Warum dort:** Die Umrechnung `a = z/√2` stand ohnehin schon in `validate.js`, und welches
Feld eine Abmessung ist und welches eine Last, weiß das Feldschema. `ui.js` setzt nur
zusammen und bleibt rechenfrei.
`a` und `t1` stehen **in `profil_eingabe` UND flach** — der Rechenkern wertet beide Stellen
aus (a-Maß je Segment bzw. `t_min` als Rückfallebene). Das z-Maß wird **nicht**
durchgereicht: daraus ist `a` geworden, zwei Wege zum selben Maß wären eine Doppelquelle.

**`optionen.js` neu:** `BEISPIELE` (3 Einträge: `code`, `name` = i18n-Schlüssel,
`auswahl{}`, `felder{}`) und `beispiel(code)`. Die Beispiele stehen dort und **nicht** in
`ui.js` — sonst wüsste die Oberfläche plötzlich Werkstoffe und Profile. **N7 wächst auf
derselben Struktur weiter.**

**Neue Sitzungsfunktionen:** `beispiele()` · `beispielLaden(code)` · `rechnen()` ·
`ergebnisLeeren()` · `ergebnis()` · `rechenweg()`.

**Neue Ids:** `ergBox` `ergAmpel` `ergKacheln` `ergGerechnetMit` · `wegBox` `rwBilanz`
`rwLuecken` · `grafikBox` `grafikSvg` `grafikLegende` ·
Klappbereiche `acc_weg_detail` und `acc_weg_<abschnittscode>`.
**Neue Klassen:** `erg-box` `tile-k` · `weg-box` `rw-abschnitt` `rw-bilanz` ·
`grafik-box` `grafik-svg` `grafik-legende` `legende-eintrag` `legende-punkt` `legende-text`.

**Was „Berechnen" ab N5c tut:** erst prüfen (beide Stufen), **dann** rechnen — nie
umgekehrt. Danach erscheinen Ampel und sechs Kacheln (η, σ_v, R_d, a-Maß, Nahtlänge,
maßgebender Punkt), das gezeichnete Nahtbild mit dreisprachiger Legende und der Rechenweg.
Die gesperrten Tabellenfelder werden aus `ergebnis.widerstand` gefüllt — **über den
Feldnamen zugeordnet, nicht über Fachwissen**; ein gesetzter „eigener Wert"-Haken bleibt
unangetastet.

**Aufklappbarer Rechenweg (Nachbesserung aus der Abnahme, wie im Schwesterprogramm):**
`klappBereich()` erzeugt Klappbereiche mit **denselben** Ids, Klassen und Funktionen
(`schalte` / `umschalten`) wie die statischen aus N5a — es gibt weiterhin **eine**
Klappmechanik im Programm, und es brauchte **keine neue CSS-Zeile**.
**Was NICHT hinter die Klappe gehört (bindend):** die Bilanz der Selbstprüfung und die
**Liste 2.4 der ehrlichen Lücken** bleiben ohne Antippen sichtbar. Nur die Einzelschritte
klappen zu. Eine Lücke, die man erst aufklappen muss, wäre wieder eine stille Lücke.
Der Detailbereich startet **zu**, die Abschnitte darin sind **offen** und einzeln
schließbar; der Zustand überlebt Sprachwechsel und Neurechnen.

**DIE ZWEI HÄKCHENARTEN (Plan 4.9, seit N4 bindend) — jetzt sichtbar getrennt:**
`rw-haken` = **Rechenprobe** (ein Kreuz hieße: das Programm rechnet falsch) ·
`rw-nachweis` = **Nachweis** (ein Kreuz heißt: die Naht trägt so nicht). Beide haben
eigene Erklärtexte im Titel. Der DOM-Smoke **zählt** sie getrennt.

> **Merkposten, damit es niemand „korrigiert":** Angezeigt wird **ein Häkchen mehr**, als
> `rechenweg.js` Rechenproben zählt. Die Summenzeile der Selbstprüfung wird erst **nach**
> dem Zählen gebildet und **zählt sich selbst nicht mit** — so steht es dort im Quelltext.
> Die Assertion prüft deshalb `angezeigt = gezählt + 1`.

---

### 4.10d Was N5d hinzugefügt hat (Ausführung & Dokumentation + Versionszeile)

**Der Block ist reine Anzeige — die Fachlogik blieb draußen.** `ui.js` nennt die beiden
Gruppencodes **genau einmal**, in der `ZUORDNUNG` (reine Anordnung). Dass EXC eine
Bewertungsgruppe vorschlägt, weiß **allein `optionen.js`**; der Harness prüft, dass die
Zeichenkette `EXC` im Quelltext von `ui.js` überhaupt nicht vorkommt.

**Neu in `optionen.js`:**
| Aufruf | Rückgabe / Zweck |
|---|---|
| `VORSCHLAEGE` | Liste der Regeln: `{ziel, quelle, norm, hinweis, karte}` |
| `vorschlag(ziel, zustand)` | `{wert, quelle, norm, hinweis}` oder **null** — null, wenn die Quellauswahl fehlt, der Code unbekannt ist **oder die Karte auf eine nicht vorhandene Option zeigt** (kein erfundener Wert) |
| `istVorschlagsZiel(code)` | ob eine Gruppe überhaupt vorgeschlagen werden kann |

Die Karte in V1: **EXC1 → D · EXC2 → C · EXC3 → B · EXC4 → B** (EN 1090-2).
Beide Gruppen bleiben `rechenwirksam: false` — **es ist eine Verträglichkeitsregel
nach 3.4, keine Rechnung.**

**Neu in `ui.js` (Namensschema durchgehalten):**
```
herk_<gruppe>        Herkunftszeile unter einer vorgeschlagenen Auswahl
hinw_<bereich>_<n>   Hinweiszeile eines Bereichs (aus ZUORDNUNG.hinweise)
ergAnforderung       Anforderungszeile im Ergebnis
infoVersion          Programmstand · Plan · Modulzahl
infoModule           jede Modulkennung einzeln
```
**ZUORDNUNG neu:** `hinweise` (i18n-Codes, die **ohne Antippen** unter dem Bereich
stehen) und `anforderung` (die Auswahlen des Bereichs laufen als Anforderungszeile
ins Ergebnis). Beides ist Anordnung, kein Fachwissen.

**VORSCHLAG STATT ZWANG — die Bauform (bindend):** Der Vorschlag wird gesetzt, solange
der Anwender die Auswahl **nicht selbst angefasst** hat. Fasst er sie an, gilt seine Wahl
und die Herkunftszeile sagt das (`ausf_eigene_wahl`). **Leert er sie wieder, greift der
Vorschlag erneut** — exakt die Bauform des „eigener Wert"-Hakens bei den Tabellenwerten,
nur für eine Auswahl statt für ein Feld. Der Merker liegt in `S.manuell` und wird von
`leeren()` zurückgesetzt; `sitzung.istSelbstGewaehlt(code)` macht ihn prüfbar.

**Neue Sitzungsfunktionen:** `version()` (Programmstand, Planversion, Modulliste) ·
`anforderung()` (die Anforderungszeile als Text) · `istSelbstGewaehlt(code)`.

**Was N5d bewusst NICHT tut:** keine Kopplung Bewertungsgruppe → Ermüdung (nur ein
sichtbarer Hinweis, die Rechnung kommt mit N13/N14), kein Freitextfeld für die
WPS-Nummer (**Dieters Entscheidung 2026-08-03: weglassen**, solange N11 die Ausgaben
noch nicht gebaut hat), und keine der vier benannten Lücken aus 2.4.

---

### 4.10e Was N7 zu `ui.js` hinzugefügt hat (Beispielkatalog)

**Drei Änderungen, alle ohne einen Krümel Fachwissen:**

| Stelle | Was |
|---|---|
| `beispieleFuellen()` | holt die Liste bei `Options.beispieleFuer(zustand())` statt den ganzen Katalog zu nehmen, und wird jetzt aus `aktualisiere()` gerufen — die Liste folgt der Auswahl (3.2) |
| `sitzung.beispiele()` | liefert **dieselbe** gefilterte Liste wie der Kasten, nicht mehr `BEISPIELE` roh |
| `grafikZeigen(ein, erg)` | zeichnet aus `erg.nahtbild.profil_eingabe`, also aus dem, **womit gerechnet wurde** — im Auslegungsfall steht im Formular gar kein a-Maß, und die Karte blieb vorher leer |

**In `ui.js` steht kein einziger Beispielcode** — eine Assertion prüft das für
alle zwölf. Ebenso unverändert gültig: `EXC` kommt im Quelltext **null**mal vor,
`iso5817` **genau einmal** (in der Anordnung).

---

### 4.10f Was N12 zu `ui.js` hinzugefügt hat (Druckbild, Registrierung)

**Neue Ids:** `printKopf` `printBezeichnung` `printLizenz` `printVersion` · `printFuss`
`printHaftung` `printImpressum` · `licModal` `licTitel` `licText` `licNameLbl` `licName`
`licKeyLbl` `licKey` `licHinweis` `licAktivieren` `licSpaeter`.
**Neue Klassen:** `print-only` `print-kopf` `print-fuss` `print-mark` `print-tag`
`print-zeile` · `lic-feld` · `license-line`.

**DER DRUCKKOPF IST KEINE ZIERDE, SONDERN NOTWENDIG.** Marke, Programmstand und
Haftungshinweis stehen am Bildschirm in der Kopfleiste, im Info-Dialog und in der
Fußzeile — **alle drei sind im Druck ausgeblendet**, weil sie Bedienelemente tragen. Ohne
`printKopf`/`printFuss` trüge das Blatt weder Namen noch Stand noch Hinweis. Plan 3.6
verlangt die Versionszeile in *jeder* Ausgabe, Plan 2.4 den Hinweis.

**Der Druckkopf wird programmatisch gefüllt** und deshalb bei **jedem Sprachwechsel neu**
(Lehre aus N10c). Die festen Texte darin tragen `data-i18n` und laufen ohnehin mit.

**DIE LIZENZZEILE HAT GENAU EINEN BESITZER: `lizenzZeigen()`.** Bis N12 leerte `edition()`
sie bei jedem Aufruf — der Platzhalter aus N5a („setzt die Registrierung in N12"). Da
`uebersetze()` diese Funktion mitruft, war die Zeile nach jedem Sprachwechsel weg. Zwei
Besitzer für eine Zeile, und der eine wusste nichts vom anderen.

**Der lange Druck (`LANG_DRUCK_MS` = 10 000) setzt NUR die Aktivierung zurück** — nicht die
Sprache, nicht das Design, nicht die Eingaben. Drei Assertions halten das fest.
Der lokale Speicher trägt ausschließlich die drei Lizenzschlüssel; fällt er aus, läuft das
Programm weiter und sagt, dass die Aktivierung nur für diese Sitzung gilt.

**Neue Sitzungsfunktionen:** `lizenz()` · `lizenzName()` · `lizenzDialog(auf)` ·
`lizenzDialogOffen()` · `aktivieren()` · `spaeter()` · `zuruecksetzen()` ·
`lizenzNeuLaden()` · `erststartFragen()` · `druckKopf()`.

---

### 4.11 `symbol.js` — Zeichnungssymbole nach EN ISO 2553 (N6b)

DOM-frei, deterministisch, **kein Text im SVG**. Zeichnet auf `svglib.js`, die unverändert
blieb. Global `DTNSymbol`.

| Aufruf | Rückgabe |
|---|---|
| `KATALOG` / `katalog(art)` / `codes(art)` | 32 Einträge: **23 Grundsymbole, 6 Zusatzzeichen, 3 Angaben** |
| `eintrag(code)` | Kopie mit `art, seite, vorbereitung, naht, naht_auch, masse, nachweisbar` |
| `fuerNahtart(code)` | das Symbol zu einer rechenbaren Nahtart — oder `null` |
| `ohneNachweis()` | die **14** Grundsymbole ohne Nachweis in diesem Programm |
| `hatMass(code, mass)` | ob eine Bemaßung zu diesem Symbol passt |
| `zeichne(eingabe, svglib)` | `{ok, svg, legende[], bemassung[], symmetrisch, nachweisbar, gezeichnet, fehler, warnungen, hinweise}` |
| `ausNahtart(code, opt)` | zeichnet direkt aus der Rechenwelt heraus |
| `formCode(code)` / `DOPPEL` | Doppelnähte zeigen auf die einseitige Form |

**Die ehrliche Kernaussage:** Der Katalog **kann mehr zeichnen, als das Programm rechnen
kann**. Jeder Eintrag trägt `naht` — die Kennung der rechenbaren Nahtart **oder
ausdrücklich `null`**. Symbole ohne Rechenpartner werden gezeichnet **und dabei benannt**
(`nachweisbar: false` + `msg_symbol_nicht_nachweisbar`). Zwei Assertions halten das fest:
**jede der 12 rechenbaren Nahtarten hat ein Symbol**, und **jedes der 14 nicht
nachweisbaren sagt es beim Zeichnen**.

**Seitenregel (als Legendencode ausgegeben, gilt nie stillschweigend):** durchgezogene
Bezugslinie = Pfeilseite · gestrichelte Identifikationslinie = Gegenseite · bei
symmetrischen Nähten entfällt die gestrichelte Linie. Eine Assertion prüft das
`stroke-dasharray` **direkt im SVG-String** — die Legende darf nichts behaupten, was im
Bild nicht steht.

**Eine Form, eine Quelle:** Doppelnähte haben **keine** eigene Form, sie sind die
gespiegelte einseitige (`x_naht → v_naht`, `k_naht → hv_naht`, `doppelkehlnaht →
kehlnaht`, dazu DY, DHY, DU, DJ). Eine Assertion verbietet eine zweite Form daneben.

**Nahtvorbereitung** steht in `daten.js`: `FUGENFORMEN` mit **16 Fugenformen** nach
EN ISO 9692-1 (Richtwerte **und** Bänder, Dickenbereich, Radius, Zugänglichkeit,
empfohlene Verfahren), Zugriff über `nahtvorbereitung(code, t)` und `fugenformen()`.
`im_bereich` sagt, ob die Dicke im Anwendungsbereich liegt — **verbietet aber nichts.**
Die sieben alten Richtwerte blieben unverändert (Regression abgesichert, N10 hängt daran).

**Anbindung (`ui.js`):** fünf Auswahlen im Block „Ausführung & Dokumentation"
(`sym_grund`, `sym_gegen`, `sym_oberflaeche`, `sym_sicherung`, `sym_lage`), Kasten
`symBox` mit `symBild`, `symLegende` (`symLeg_<n>`), `symMasse` (`symMass_<n>`) und
`symHinweis`. Die Gabel erscheint von selbst, sobald ein **Verfahren** gewählt ist — sie
trägt ja genau diese Angabe. **In `ui.js` steht kein einziger Symbolcode**; eine Assertion
prüft das für alle 23.

**Bewachte Doppelung (benannt, nicht versteckt):** die Codeliste steht auch in
`optionen.js` (`SYM_GRUND`), damit dieses Modul von keinem anderen abhängt. **Eine
Assertion prüft in beide Richtungen auf Deckungsgleichheit.** Die Optionen tragen
`schluessel: 'sym_<code>'` und benutzen den Katalogtext — die Namen stehen nur **einmal**
im Wörterbuch; eine weitere Assertion verbietet einen zweiten Text daneben.

---

### 4.12 Schnittstelle `report.js` (fertig aus N11)

> **Nicht ändern, nur benutzen.** `report.js` ist **DOM-frei**, deterministisch und mutiert
> seine Eingaben nicht. Namensraum `DTNReport`. Lädt **nach** `i18n_kern.js` und
> `rechenweg.js`, **vor** `ui.js`.

**Warum DOM-frei, obwohl es Dateien schreibt:** Es schreibt gar keine. Es **baut und liest
Zeichenketten** — den `.dts`-Text, den RTF-Text, die Bildmaße. Den letzten Millimeter
(Blob, Download, Dateiwahl, Canvas, Drucken) erledigt `ui.js`. Genau dieser Schnitt macht
jeden Schritt in Node prüfbar; ohne ihn wäre die Hälfte von N11 ungetestet.

| Aufruf | Rückgabe / Zweck |
|---|---|
| `guard(aktion, edition)` | `{erlaubt, aktion, code}` — **das gesamte Gating**. Vier Aktionen: `speichern` · `oeffnen` · `drucken` · `word`. Alles außer `edition === 'full'` sperrt |
| `stempel({etappe, plan, datum})` | der Versionsstempel aus 5.1-8 |
| `baueDatei({auswahl, werte, bezeichnung, sprache, etappe, plan, datum, nicht_geprueft, module})` | `{ok, text, stempel, daten, fehler}` — **nur die Eingaben** |
| `lieseDatei(text)` | `{ok, fehler, warnungen, stempel, lage, eingaben, dokumentation, bezeichnung, sprache}`; `lage` ist `gleich` · `aelter` · `neuer` |
| `dateiname(bezeichnung, datum, endung)` · `saeubere(s)` | Dateiname aus Bezeichnung + Datum, ohne Zeichen, an denen ein Dateisystem hängenbleibt |
| `bildMasse(b_px, h_px, maxTwips)` · `svgMitMassen(svg, skala)` | Bildmaße für RTF und Canvas. **Die Rechnung sitzt hier, weil `ui.js` kein `Math.` enthalten darf** |
| `b64ZuHex(b64)` · `rtfText(s)` · `bildBlock(png, masse)` | die RTF-Bausteine |
| `baueBericht({rw, sprache, bezeichnung, datum, version, module, anforderung, karten, bilder})` | der Bericht als **Daten** — dieselbe Haltung wie die Schrittliste in 4.9 |
| `baueRtf(bericht, opt)` | `{ok, text, bilder_ein, bilder_aus, fehler}` |
| `lizenzName(s)` · `istAktiviert(name, key)` | **N12.** Name glätten (Leerraum zusammenziehen, max. 80). Aktiviert ist, wer BEIDES eingetragen hat — mehr wird nicht verlangt |
| `lizenzPhrase(name, lang)` · `lizenzZeile(edition, name, lang)` | die eine Zeile für alle vier Ausgaben. `''`, wenn kein Name da ist **oder die Edition nicht `full` ist** |
| `SPEICHER` · `NAME_MAX` | die drei Schlüssel des lokalen Speichers und die Namenslänge |

**WARUM DIE REGISTRIERUNG HIER LIEGT (N12):** In diesem Modul sitzt bereits alles, was von
der **Edition** abhängt — das Gating. Die Lizenzzeile ist dieselbe Sorte Sache, und sie muss
in Kopfzeile, Ausdruck, Word-Dokument und `.dts` **wortgleich** stehen. Vier Stellen, die
denselben Satz bauen, wären vier Gelegenheiten, ihn verschieden zu bauen (3.4).
**ES WIRD NICHTS GEPRÜFT** (Plan 1, „keine Formatprüfung"): der Schlüssel wird verwahrt,
nicht untersucht. Der Zweck des Namens ist die **Hemmschwelle zur Weitergabe**, kein
Kopierschutz — wer hier eine Prüfung einbaut, verspricht eine Sicherheit, die es nicht
gibt, und sperrt den aus, dessen Schlüssel anders aussieht als erwartet.

**Das Datum kommt IMMER von außen herein.** Das Modul holt sich die Uhr nicht selbst —
sonst wäre es nicht bestimmt und kein Test könnte es festnageln. Eine Assertion prüft,
dass weder `new Date` noch `Date.now` im Quelltext steht.

**DIE BILDER IM WORD-DOKUMENT — der Rückfallweg (Dieters Delegation 2026-08-07: „es muss
laufen"):** RTF kann ein PNG tragen (`\pict\pngblip`). Das SVG dafür zu rastern geht nur
im Browser über Canvas — **der einzige Schritt in N11, den kein Node-Test erreicht**.
Deshalb nimmt `baueRtf()` die Bilddaten **entgegen**, statt sie zu erzeugen: der ganze
Zusammenbau ist prüfbar. Fehlt ein Bild (keine Canvas, kaputtes PNG, leeres SVG), wird die
Datei **trotzdem geschrieben** — ohne das Bild, mit einer sichtbaren Zeile, die den Grund
nennt. Beide Wege sind durch Assertions belegt. **Ein fehlendes Bild kostet eine Zeile,
nicht die Datei.**

**WAS `report.js` BEWUSST NICHT TUT:**
- **es rechnet nichts nach** — Zahlen und Beschriftungen kommen fertig aus
  `rechenweg.rendere()`,
- **es speichert und lädt keine Datei** — das ist der Millimeter in `ui.js`,
- **es kennt die Oberfläche nicht** und holt sich kein Datum,
- **es schreibt kein Ergebnis in die Datei** (5.1-8) — eine Assertion sucht zehn
  Ergebnisnamen und darf keinen finden.

---


═══════════════════════════════════════════════════════════════════════════
# TEIL D — DER BAUPLAN
═══════════════════════════════════════════════════════════════════════════

> **Was als nächstes gebaut wird.** Was fertig und abgenommen ist, steht als Erzählung in `Schweißnaht-Historie.md` — hier steht nur, was noch bevorsteht.

---

## 5. Bausteine — risikosortiert, mit Launch-Checkpoint

> Voller Umfang in V1. Nicht der Umfang wird reduziert, sondern die **Reihenfolge**
> risikosortiert: erst Kern, dann die billigen Zusatzbereiche, dann der große Ermüdungsblock,
> zuletzt Verzug. Nach N12 ist das Programm bereits **verkaufsfähig**.
>
> **Die vier großen Bausteine N5, N8, N13 und N14 werden in Etappen gebaut** — jede Etappe
> einzeln lieferbar und abnehmbar (Regel in Kickoff-Punkt 5c, Etappen in Abschnitt 5.2).

| # | Baustein | Inhalt (Kurz) |
|---|---|---|
| **N1** ✅ | **Fundament** *(abgenommen 2026-07-25)* | `daten.js` (11 Werkstoffe, Beiwerte, ISO 5817, EXC) + `optionen.js` (einzige Auswahlquelle **inkl. Verträglichkeitsregeln**) + i18n-Gerüst DE/EN/PT + `validate.js`. Alle Codes sprachneutral. |
| **N2** ✅ | **Nahtbild-Kern** *(abgenommen 2026-07-25)* | `naht.js`: Segmente → A_w, Schwerpunkt, I_y, I_z, I_yz, I_p, Hauptachsen, W_y/W_z/W_t, offen/geschlossen, Selbstprüfung. DOM-frei. Vier Hand-Anker geschlossen nachgerechnet. **Schnittstelle: Abschnitt 4.5.** |
| **N2b** ✅ | **Profileingabe** *(abgenommen 2026-07-25)* | `profil.js`: 7 parametrische Profile + Kantenauswahl → Segmente. Raupenmodell mit Endkraterabzug je freiem Ende, Eckradien, a je Segment. DOM-frei. **Schnittstelle: Abschnitt 4.6.** |
| **N2c** ✅ | **Nahtbild-Grafik** *(abgenommen 2026-07-26)* | `svglib.js` + `schaubild.js`: SVG-Vorschau des Nahtbilds, Segmente farbig nach Gruppe, Schwerpunkt und Achsen, nicht geschweißte Kanten gestrichelt, Ecklücken sichtbar. Zugleich **Auswahl-Skizze** der Profileingabe. **Schnittstelle: Abschnitt 4.7.** |
| **N3** ✅ | **Spannungen + beide Welten** *(abgenommen 2026-07-26)* | `solver.js`: σ⊥, τ⊥, τ∥ aus N/Q/M/T · Welt A (EC3, beide Verfahren) · Welt B (klassisch, Tabelle + Formel) · **Nachweis UND Auslegung** mit Aufrundung · Ampel. **Schnittstelle: Abschnitt 4.8.** |
| **N4** ✅ | **Rechenweg** *(abgenommen 2026-07-26)* | `rechenweg.js`: selbstprüfende Schrittliste für N2/N2b/N3, dreisprachig, zweiter Rechenpfad je Schritt, Rechenprobe und Nachweis getrennt. **Schnittstelle: Abschnitt 4.9.** |
| **N5** ✅ | **UI-Basis — VOLLSTÄNDIG ABGENOMMEN: N5a, N5b, N5c-1, N5c-2, N5c-3 und N5d** | 2 HTMLs, `style.css`, Formular mit aufklappbaren Bereichen und Freischalt-Haken, Ergebnis-Kacheln, Ampel, i18n, Theme (**Start immer dunkel**), Laien-ⓘ, Block „Ausführung & Dokumentation" (ISO 5817 + EXC). **Erster Handy-Test.** |
| **N6b** ✅ | **ISO-2553-Symbolgenerator — ABGENOMMEN 2026-08-04** | `symbol.js`: Pfeil-/Gegenseite, a- bzw. z-Maß, Länge, Rundumnaht, Baustellennaht. Nutzt `svglib.js` aus N2c. Bewusst **vor** dem Launch — Verkaufsargument. |
| **N7** ✅ | **Beispielkatalog — ABGENOMMEN 2026-08-04** | **Zwölf Beispiele, sechs je Bemessungswelt**, als reine Daten in `optionen.js` auf `profil.js` aufgesetzt, mit Merkmalen für die **kontextbezogene Beispielliste** (3.2). Hat **vier Fehler aus N5c aufgedeckt und behoben** — Ergebnis in 5.1-3. |
| **N8** ✅ | **Assistent — vollständig ABGENOMMEN 2026-08-04** | `assistent.js` (DOM-freie Dialoglogik) + Overlay-UI, Button-Einstieg, tabellengestützt aus `optionen.js`, mit Erklärungen/Tipps/Skizzen je Dialog, Übernahme vorhandener Eingaben. |
| **N9** ✅ | **Vorwärmung & t8/5 — vollständig ABGENOMMEN 2026-08-05** | `thermik.js` + Panel + Rechenweg + Assistenten-Schritte. Umfang festgelegt 2026-08-05, Ergebnis in 5.1-6. Geteilt in **N9a** (Kennungsabsicherung + Rechenkern, DOM-frei) und **N9b** (Panel, Rechenweg, Assistent, Endkrater-Ankreuzfeld). |
| **N10** ✅ | **Kosten/Zeit/Draht — vollständig ABGENOMMEN 2026-08-05** | `kosten.js` + Panel + Rechenweg + Assistenten-Schritte. |
| **N11** ✅ | **Ausgaben** *(ABGENOMMEN 2026-08-07 — Ergebnis in 5.1-9)* | `report.js`: `.dts` speichern/öffnen (**erst leeren, dann laden**, **Versionsstempel nach 5.1-8**, **nur Eingaben**, Lückenliste als Dokumentation), Druck/PDF, Word (.rtf), `guard()`-Gating. Aktionsleiste **oben**, Dateiname trägt Bezeichnung + Datum. **Jede Ausgabe trägt die Versionszeile** (3.6) — **dabei die Modulnamen an die Dateinamen angleichen UND die Modulkennungen mitwachsen lassen**, beide Merkposten in 3.6. |
| **N12** ✅ | **Edition/Registrierung/Impressum** *(gebaut und geliefert 2026-08-07, Abnahme offen — Ergebnis in 5.1-10)* | Testbalken, Aktivierungsdialog beim Erststart (Name + Schlüssel, **keine Formatprüfung**), „Vollversion · lizenziert für <Name>", **10-s-Long-Press** = Reset, Info-ⓘ mit Impressum. |
| **★** | **LAUNCH-CHECKPOINT** | **Ab hier verkaufsfähig.** Dieter entscheidet: weiterbauen oder veröffentlichen. |
| **P0** ✅ | **Editionsweiche berichtigt** *(geliefert 2026-08-08 — 5.4)* |
| **P1** ✅ | **Hinweis „folgt in einem Update“ + Kontaktangaben** *(ABGENOMMEN 2026-08-08 — 5.3)* |
| **P2** ✅ | **Neuordnung von Plandatei und Historie** *(ERLEDIGT 2026-08-08 — Erzählung in der Historie)* |
| **N13** ⬅ | **Ermüdung — Rechenkern** *(nächster Bau — offene Entscheidung in 5.3)* | `ermuedung.js`: Wöhlerlinie m=3/5, γ_Mf, Miner, Kollektive + Rechenweg. **Hier Dieter nach seinen Praxis-Kerbfällen fragen.** |
| **N14** | **Kerbfallkatalog** | `kerbfall.js` + SVG-Skizzen + Auswahl-UI mit Filter. Struktur vollständig, Füllung gestaffelt (Start 25–35 Details, je 2 Quellen), **ehrliche Lücken sichtbar**. Mehrere Etappen. |
| **N15** | **Verzug & Schrumpfung** | `verzug.js` + Panel, klar als **Abschätzung** gekennzeichnet. |
| **N16** | **Feinschliff + Build** | Presets ausbauen, Wissenstexte, Code-Audit, Bündelung + Obfuskierung (zwei Bündel, Unterschied nur `DT_EDITION`). **→ V1-Launch.** |

### 5.2 Etappenteilung der großen Bausteine *(Regel in Kickoff-Punkt 5c)*

> **Vorschlag, noch nicht endgültig — mit einer Ausnahme: N5a steht fest** (Auftrag in 5.1).
> Alle übrigen Etappen werden **unmittelbar vor
> dessen Bau** mit Dieter final abgestimmt und hier festgeschrieben — dann ist der Umfang
> jeder Lieferung klar, bevor Tokens ausgegeben werden. Die Reihenfolge innerhalb eines
> Bausteins ist so gewählt, dass **jede Etappe für sich lauffähig und prüfbar** ist.

**N5 — UI-Basis (vier Etappen):**
| Etappe | Inhalt | Am Handy prüfbar |
|---|---|---|
| **N5a** ✅ | *(abgenommen 2026-07-27)* Grundgerüst: beide HTMLs neu, `ui.js`, `style.css` — Kopfzeile mit Marke und Lizenzzeile, Sprachumschalter DE/EN/PT, Theme-Button mit **Start immer dunkel** (3.1), Info-ⓘ, Subbar, Aktionsleiste, leeres Formulargerüst mit acht aufklappbaren Bereichen. Die Zwischen-Statusseite aus N1–N4 ist weg. **Schnittstelle: 4.10.** | Sieht aus wie ein Programm, startet dunkel, drei Sprachen laufen |
| **N5b** ✅ | *(abgenommen 2026-07-27)* Eingabeseite: 18 Auswahlgruppen aus `optionen.js` über **die** Filterfunktion, alle 29 Felder aus `validate.js`, Freischalt-Haken, **„eigener Wert"-Haken**, Laien-ⓘ an jedem Feld und jeder Gruppe, „Berechnen" prüft, „Leeren" führt in den Startzustand (3.1). **Schnittstelle: 4.10b.** | Man kann einen Fall wirklich eingeben |
| **N5c-1** ✅ | *(abgenommen 2026-07-28)* **Feldbereinigung** (`l` entfällt, `t1` profilabhängig, `t2` freiwillig — begründet in 5.1), **drei Beispiele** hinter „Beispiel laden", **Übersetzung Formular → `profil_eingabe`**, „Berechnen" rechnet wirklich, Ergebnis-Kacheln mit Ampel. **Schnittstelle: 4.10c.** | Beispiel antippen, rechnen, eine Zahl und eine Ampel sehen |
| **N5c-2** ✅ | *(abgenommen 2026-07-28)* **Rechenweg aus N4 angezeigt** (10 Abschnitte, seit der Abnahme **aufklappbar**), Nahtbild-Grafik eingebunden, die zwei Häkchenarten optisch getrennt, Liste 2.4, Warnungen und ehrliche Lücken, Zahlformat je Sprache aus `rechenweg.zahl()`. **Schnittstelle: 4.10c.** | Ein vollständiger Nachweis von der Eingabe bis zur Quellenangabe |
| **N5c-3** ✅ | *(gebaut, geliefert und **abgenommen 2026-08-03**, ohne Nacharbeit — Ergebnis in 5.1-0)* **„Nahtzug statt Segment":** die Prüfung `l_eff ≥ max(6a; 30)` lief je Segment statt je durchlaufendem Nahtzug — dadurch fiel **jedes I- und U-Profil mit umlaufender Naht** durch, weil die Flanschkante nur `t_f` lang ist. Dazu zusammengeführt: Ampel und Rechenweg widersprachen sich. Die Längenprüfung ist jetzt eine **Warnung** | Ein H-Träger und ein U-Profil, umlaufend geschweißt, rechnen durch — ohne roten Nachweis, der keiner ist |
| **N5d** ✅ | *(gebaut, geliefert und **abgenommen 2026-08-03**, ohne Nacharbeit — Ergebnis in 5.1-1)* Block „Ausführung & Dokumentation": ISO 5817 + EXC angezeigt und ehrlich als nicht rechenwirksam beschriftet, **EXC schlägt die Bewertungsgruppe vor** (überschreibbar, mit sichtbarer Herkunft), Ermüdungshinweis ohne Scheinrechnung, Anforderungszeile im Ergebnis, **vier benannte Lücken in Liste 2.4**. Dazu die **Versionszeile im Info-ⓘ** und die drei nachgerüsteten `VERSION`-Kennungen (3.6). **Schnittstelle: 4.10d.** | Der Block klappt auf, EXC füllt die Bewertungsgruppe mit sichtbarer Herkunft und lässt sie überschreibbar; der Programmstand ist am Handy ablesbar |

**N8 — Assistent (drei Etappen):**
| Etappe | Inhalt |
|---|---|
| **N8a** ✅ | **ABGENOMMEN 2026-08-04.** `assistent.js`: DOM-freie Dialoglogik, Schrittfolge aus `optionen.js` und `validate.js`, Verzweigung, Umkehrbarkeit jedes Schritts, Übernahme bereits gefüllter Felder — vollständig in Node testbar, **ohne** Oberfläche. Ergebnis in 5.1-4 |
| **N8b** ✅ | **ABGENOMMEN 2026-08-04.** Overlay-UI: Button-Einstieg, ein Dialogfenster je Schritt mit Laien-Erklärung, Standardwert-Tipp, **Skizze** und antippbarer Auswahl (3.3). Vorgeschaltet **N8b-1**: neues Modul `skizze.js`. Ergebnis in 5.1-5 |
| **N8c** ✅ | **ABGENOMMEN 2026-08-04.** Mündung in die volle Anzeige mit Rechenweg und Liste 2.4; **ab hier gilt die Prozessregel**, dass jeder spätere Baustein seine Assistenten-Schritte mitliefert |

**N13/N14 — Ermüdung und Kerbfallkatalog:**

> ✅ **UMFANG FÜR VERSION 1 FESTGELEGT (Dieter, 2026-08-05).**
>
> **Ermüdung ist in Version 1 dabei.** Sie war zur Diskussion gestellt, weil
> der Kerbfallkatalog der EN 1993-1-9 über 70 Details umfasst und das Projekt
> schlanker machen würde. Dieters Entscheidung: *„Ermüdung ist schon
> wichtig"* — für einen Teil der Anwender ist sie der Kaufgrund.
>
> **Reduziert wird die TIEFE, nicht die BREITE.** Alle vier Detailfamilien,
> die dieses Programm überhaupt sehen kann, sind dabei — Dieter zu allen
> vieren: *„eigentlich schon alle"*:
>
> | Familie | Normtabelle |
> |---|---|
> | Durchlaufende Längsnähte | 8.2 |
> | Quer-Stumpfnähte (alle Ausführungen) | 8.3 |
> | Steifen, Anbauteile, Deckblechenden | 8.4 |
> | Kreuz-/T-Stöße, Laschen, Halsnaht | 8.5 |
> | **Hohlprofile** *(Dieter, 2026-08-05: dazu)* | **8.6** |
>
> Grundlage sind die **~13 Nahtdetails** aus dem kuratierten Katalog der
> Recherche R4 (`Ermüdungsnachweis…md`, Abschnitt 2.2) — dort mit Δσ_C,
> Anwendungsbedingungen, Anrissort und Quellen.
>
> **Hohlprofile brauchen eine ergänzende Recherche vor N14.** Tabelle 8.6
> fehlt im kuratierten Katalog, aber vier der zwölf Beispiele sind
> Hohlprofile mit umlaufender Naht. Ein Programm, das solche Fälle statisch
> sauber rechnet und beim Ermüdungsnachweis „kein passender Kerbfall" meldet,
> wirkt widersprüchlich — auch wenn die Meldung ehrlich ist.
>
> **AUSDRÜCKLICH DRAUSSEN (benannte Lücken, keine vergessenen):**
> - **Keine Nahtdetails:** Schraubenverbindung am Lochrand, Bolzen im
>   Gewindegrund, Kopfbolzendübel, Grundwerkstoff mit Walzkante,
>   Brenn-/Scherkante (Tab. 8.1). Ein Schweißnahtprogramm, das plötzlich einen
>   Lochrand bewertet, verspricht mehr, als es kennt.
> - **Spezialtabellen:** Fachwerkknoten aus Hohlprofilen (8.7), orthotrope
>   Platten (8.8/8.9), Kranbahnträger-Gurt-Steg (8.10).
> - **Aluminium** nach EN 1999-1-3 — bleibt N13b.
>
> **VIER FESTLEGUNGEN, DIE VON N14a AN STEHEN MÜSSEN** (später teuer):
> 1. **Ein Kerbfall ist ein Entscheidungsbaum, keine Zahl.** Die
>    Quer-Stumpfnaht heißt 112 bündig geschliffen, 90 mit Nahtüberhöhung, 80
>    im Regelfall, 71 mit Badsicherung, 36 einseitig ohne Nachweis — dahinter
>    stehen Bedingungen wie An-/Auslaufbleche, NDT, Dickensprung ≤ 1:4.
>    **Das Programm fragt diese Bedingungen ab, es rät nicht.**
> 2. **Schlüssel aus der Norm**, also Tabelle plus Detailnummer nach
>    EN 1993-1-9 — nie eine eigene Nummerierung. Eigene Nummern rächen sich
>    beim ersten Update und beim Öffnen alter Dateien.
> 3. **Kein passender Kerbfall → keine Rechnung.** Sichtbar begründet, und
>    **nie ein Vorschlag für etwas Ähnliches**. Der Anwender, der „den
>    ähnlichsten" nimmt, bekommt eine plausible falsche Zahl — das wäre
>    schlimmer als gar keine Ermüdungsrechnung.
> 4. **Jeder Eintrag trägt seine Anwendungsbedingungen mit**, nicht nur sein
>    Δσ_C. Sie an hundert Einträgen nachzurüsten ist Arbeit, sie von Anfang an
>    mitzuführen kostet nichts.
>
> **EINE ENTSCHEIDUNG GEHÖRT IN N11, ALSO VOR DIE ERMÜDUNG:** Das
> Dateiformat braucht einen **Versionsstempel**. Eine gespeicherte Rechnung
> mit Kerbfallcode muss sich in Version 2 noch öffnen lassen, wenn der Katalog
> um ein Vielfaches gewachsen ist. Das ist die einzige der hier getroffenen
> Festlegungen, die zeitlich drängt.
>
> **NOCH OFFEN, zu entscheiden vor N13a:** Woher kommt die
> **Spannungsschwingbreite**? Ermüdung rechnet mit Δσ, nicht mit der
> statischen Bemessungslast. Möglich sind: Lastschwingbreite eingeben und das
> Programm rechnet Δσ, zwei Lastzustände (max/min), oder Δσ direkt. Dieter
> 2026-08-05: *später entscheiden* — es hängt am Rechenkern, nicht am Katalog,
> und bis N13a liegen N9, N10, N11 und N12.
| Etappe | Inhalt |
|---|---|
| **N13a** | `ermuedung.js` Rechenkern Stahl: Wöhlerlinie m = 3/5, Δσ_C, γ_Mf, Einstufenkollektiv + Hand-Anker |
| **N13b** | Miner-Schadensakkumulation und Kollektive, Alu-Kern nach EN 1999-1-3 |
| **N14a** | `kerbfall.js`: **Struktur vollständig** (Codes, Kategorien, Anwendungsbedingungen, Verweis auf Skizze) mit den ersten Details — ab hier ist jede Lücke sichtbar statt still |
| **N14b…** | Füllung in Etappen von je 8–12 Details, jedes mit eigener SVG-Skizze und **2 Quellen**. ~~Hier wird Dieter nach seinen Praxis-Kerbfällen gefragt~~ — **erledigt 2026-08-05**, Umfang steht im Kasten oben |

**Alle Etappen von N5 sind gebaut und abgenommen** — N5a, N5b, N5c-1 bis N5c-3 und N5d.
**Baustein N5 ist abgeschlossen.** Die Etappenteilung hat sich über sechs Lieferungen
getragen: jede war einzeln lauffähig, einzeln prüfbar und einzeln abnehmbar.

**Nicht geteilt** (einteilig): N6b, N7, N9, N10, N11, N12, N15 — bei N4 hat sich die
Einschätzung bestätigt. **N7 hat sie ein zweites Mal bestätigt**, obwohl der
Baustein unterwegs vier Reparaturen mit aufnehmen musste: die Haltepunkte je
Drittel haben gereicht, geteilt werden musste nicht.
Erweist sich das beim Bauen als falsch, wird **geteilt statt gehetzt** — eine unfertige
Lieferung ist teurer als eine zusätzliche.

---

### 5.3 Die offene Entscheidung vor N13a — **woher kommt Δσ?**

> Hier standen bis v2.82 die Aufträge **P1** und **P2**. Beide sind erledigt; ihre
> Erzählung steht in der Historie. Der Platz trägt jetzt die Frage, die vor N13a zu
> entscheiden ist.

**Ermüdung rechnet mit der Spannungsschwingbreite Δσ, nicht mit der statischen
Bemessungslast.** Dieter hat die Entscheidung am 2026-08-05 vertagt, weil sie am
Rechenkern hängt und N9 bis N12 davorlagen. Am **2026-08-08** hat Claude einen Vorschlag
vorgelegt; Dieter denkt darüber nach und entscheidet, wenn er zurück ist.

#### Der Vorschlag: zwei Lastzustände (max/min) als der EINE Weg

**Begründung — sie ist fachlich, nicht ergonomisch.** Gibt man nur eine
**Lastschwingbreite** ein, unterstellt man stillschweigend, dass alle Schnittgrößen
**proportional** schwanken. Bei ständiger Eigenlast plus wechselnder Nutzlast stimmt das
nicht — und dann kann der **maßgebende Punkt im Nahtbild wandern**. Bei den
unsymmetrischen Nahtbildern mit schiefer Biegung, die dieses Programm ausdrücklich
rechnet (2.2, 4.8), ist das kein Randfall.

Mit zwei Zuständen wird σ an **jedem** Punkt zweimal gerechnet und das größte Δσ über
alle Punkte genommen. Das ist im allgemeinen Fall korrekt und **nutzt den vorhandenen
Solver zweimal** — kein zweiter Spannungsweg, keine zweite Wahrheit (9.2.3).

**Die beiden anderen Wege verschwinden nicht, sie werden Bequemlichkeiten:**

- **Schwellend** ist der Sonderfall min = 0 — ein Knopf, der den zweiten Zustand auf null
  setzt. Häufigster Fall, kostet dann keinen Mehraufwand.
- **Δσ direkt** wird ein **„eigener Wert"-Haken**, wie bei jedem Tabellenwert im Programm
  (9.2.2). Wer die Schwingbreite hat, trägt sie ein und überschreibt die Rechnung.

Damit gibt es **einen Weg mit zwei Abkürzungen** statt drei Wegen — dasselbe Muster, das
der Anwender aus dem ganzen Programm kennt.

**Wogegen der Vorschlag sich richtet:** „Δσ direkt" als Hauptweg. Der Wert dieses
Programms liegt darin, dass es die Spannung **aus der Nahtgeometrie herleitet**. Fragt man
nach der fertigen Schwingbreite, umgeht man genau das — und die Umrechnung auf die
wirksame Nahtebene ist die Stelle, an der Ungeübte am häufigsten danebenliegen.

> ⚠️ **NICHT ENTSCHIEDEN.** Vor N13a bestätigen oder verwerfen. Solange die Frage offen
> ist, wird an `ermuedung.js` nicht gebaut — sie prägt die Schnittstelle des Rechenkerns,
> und eine später gedrehte Eingabelogik ist teuer.

---

### 5.3a Der Verkaufsstand ist eingefroren *(Dieter, 2026-08-08)*

**Dieter hat die Module zusammenkopiert und obfuskiert; die Verkaufsfassung ist
ausgeliefert.** Damit ist die **Einzeldatei-Fassung erledigt** — sie stand bis dahin als
zurückgestellter Punkt im Kopf.

**Der verkaufte Stand ist:**

```
Programmstand P1 · Plan 2.78 · 19 Module
ui 0.20.2 · report 0.4.0-P1 · i18n_kern 0.11.1-P1
```

**Was daraus für JEDEN weiteren Baustein folgt — und das ist keine Nebenbemerkung:**

1. **Ab jetzt gibt es Käufer mit einer eingefrorenen Kopie.** Alles Weitere ist ein
   **Update** für Leute, die bereits mit dem Programm arbeiten.
2. ⚠️ **Deren `.dts`-Dateien müssen weiter aufgehen.** Das Format ist dafür gebaut (5.1-8,
   in der Historie): Die Formatnummer steigt **nur**, wenn eine alte Datei nicht mehr
   unmittelbar passt — neue *Eingabefelder* allein sind kein solcher Fall. **In N13 wird
   das ausdrücklich geprüft, nicht angenommen:** eine Datei im Format 1 muss nach N13
   öffnen und dasselbe Ergebnis liefern.
3. **Bei jeder Rückmeldung zuerst nach dem Programmstand fragen.** Die Versionszeile nennt
   ihn. Ein Käufer mit altem Zwischenspeicher meldet sonst Fehler, die längst behoben sind
   (beobachtet am 2026-08-08).
4. **Die Versionszeile ist ab jetzt Kundendienstwerkzeug**, nicht nur Selbstauskunft.



═══════════════════════════════════════════════════════════════════════════
# TEIL E — DATEISTAND
═══════════════════════════════════════════════════════════════════════════

> **Was im Projektordner liegt und was auf GitHub gehört.**

---

## 8. Recherchedateien im Projektordner (R1–R6 abgeschlossen)

| Datei | Inhalt |
|---|---|
| `Schweißnahtberechnung_Stahl__Datengrundlage_Eurocode_3_und_klass.md` | Welt A (EN 1993-1-8): richtungsbezogenes + vereinfachtes Verfahren, β_w-Tabelle, γ_M2, Werkstoffkennwerte Baustahl, Geometriegrenzen, Stumpfnähte, Nahtbild-Linienmodell · Welt B klassisch |
| `Schweißnahtberechnung_für_nichtrostende_Stähle_und_Aluminium__Da.md` | R3: Edelstahl (EN 1993-1-4) Kennwerte + Nachweis · Aluminium (EN 1999-1-1) mit Schwerpunkt **WEZ-Entfestigung** |
| `Ermüdungsnachweis_von_Schweißverbindungen__Rechenkern_und_Kerbfa.md` | R4: Rechenkern Stahl (EN 1993-1-9), Kerbfallkatalog Stahl, Aluminium (EN 1999-1-3), Vergleichsregelwerke, **offene Lücken dokumentiert** |
| `Wärmeführung_und_Schweißtechnologie_nach_EN_1011-2__Datengrundla.md` | R5: CET/CEV inkl. Auswahl-Logik und Grenzwerte, Vorwärmung Methode A und B mit durchgerechnetem Beispiel, kombinierte Dicke, Wasserstoff |
| `Schweißzeit__Schweißkosten_und_Schweißverzug__Datengrundlage_und.md` | R6: Mengengerüst, Zeitermittlung, Kostenrechnung mit **durchgerechnetem Verifizierungsfall** · Verzugsarten, Näherungsformeln, Gegenmaßnahmen |

| `Referenzbeispiele_zur_Verifikation_eines_Schweißnaht-Bemessungsp.md` | **Verifikation (2026-08-04):** neun publizierte, durchgerechnete Schweißnahtbeispiele mit Quellenangabe — Grundlage der Harness-Sektion **S39**. Enthält auch die benannte Lücke: für die **Kreisnaht unter reiner Torsion** gibt es kein frei zugängliches vollständiges Beispiel |

**Begleitdatei zum Plan:** `Schweißnaht-Historie.md` — Entscheidungslog und Changelog im
Volltext (ab 2026-07-28 ausgelagert). **Nur bei Bedarf lesen**, Regel in Abschnitt 9.

**Referenzdateien (read-only, nur Muster):** `DT-ProfiPassung_Testversion-Orginal.html` ·
`DT-ProfiPassung.html` · `DT-ProfiPassung_Test.html`

### 8.1 Dateistand nach N7 *(Stand 2026-08-04)*

**N7-Lieferung — 7 Dateien zu überschreiben:** `solver.js`, `rechenweg.js`,
`optionen.js`, `i18n_kern.js`, `ui.js`, `test_naht.js`, `dom_smoke_voll.js`
— dazu diese Plandatei und `Schweißnaht-Historie.md`.
**Von N7 nicht angefasst:** `naht.js`, `profil.js`, `svglib.js`, `schaubild.js`,
`validate.js`, `daten.js`, `symbol.js`, `i18n_hilfe.js`, `i18n_kerbfall.js`,
`style.css`, **beide HTMLs** und `dom_smoke_test.js`.
**Kein neues Modul, keine neue HTML-Zeile, keine neue CSS-Zeile** — die zwölf
Beispiele sind reine Daten, und die Beispielliste stand seit N5a.
`validate.js` blieb unberührt: das Feldschema hat gestimmt, der Fehler saß im
Solver.

| Datei | Was N7 geändert hat |
|---|---|
| `optionen.js` | `BEISPIELE` 3 → **12** mit `merkmale` und Ausführungsklasse · neu `BEISPIEL_FILTER` und `beispieleFuer(zustand)` (3.2) |
| `solver.js` | Bezugsmaß für die Auslegung · Außeniteration der Geometrie · a-Grenzen nur bei Kehl- und teilweise durchgeschweißter Naht · `nahtbild.profil_eingabe` · drei neue Hinweiscodes. `VERSION` unverändert `0.1.0-N3` |
| `rechenweg.js` | `rw_s_a_min` / `rw_s_a_max` ohne Nachweis-Haken, wo die Grenzen nicht gelten |
| `i18n_kern.js` | neun Beispielnamen und drei Meldungstexte, alle dreisprachig |
| `ui.js` | kontextbezogene Beispielliste · `beispiele()` gefiltert · `grafikZeigen(ein, erg)` · `VERSION` **0.9.0**, `ETAPPE` **N7**, `PLAN` **2.39** |
| `test_naht.js` | neue Sektion **S38** · S31/S32 auf zwölf · `ETAPPE`/`VERSION` gegen `Codestand` statt gegen Konstanten |
| `dom_smoke_voll.js` | alle zwölf an der Oberfläche durchgeklickt · Filterprüfungen · die vier Befunde · Versionszeile gegen die Kennungen aus `ui.js` |

**Basislinie nach N7: 1553 Assertions · 611 / 612 DOM-Smokes · i18n-Parität 0.**

**Nachtrag N11 (2026-08-07) — 12 Dateien:** **neu `report.js`** ·
`ui.js` (die vier Ausgaben verdrahtet, `versionText()` herausgelöst,
Kennungen 0.17.0 / N11 / 2.65) · `style.css` (Druckbild `@media print`) ·
`i18n_kern.js` (21 neue Texte dreisprachig, **NAME `i18n_kern`**) ·
`i18n_hilfe.js`, `i18n_kerbfall.js`, `daten.js`, `optionen.js` (**nur
`NAME` und Kennung** — der Namensabgleich aus 3.6) · **beide HTMLs**
(Skript-Zeile) · `test_naht.js` (**S49**, S43-Tabelle, S42, S29/S30
nachgezogen) · `dom_smoke_voll.js` (N11-Durchlauf).
**Nicht angefasst:** `solver.js`, `rechenweg.js`, `naht.js`, `profil.js`,
`svglib.js`, `schaubild.js`, `validate.js`, `symbol.js`, `skizze.js`,
`thermik.js`, `kosten.js`, `assistent.js`, `dom_smoke_test.js`.
**Der gesamte Rechenkern blieb unberührt** — die vier Ausgaben lesen nur,
was ohnehin da ist.
⚠️ **Vier Module wurden allein wegen ihres Anzeigenamens angefasst**
(`daten`, `optionen`, `i18n_hilfe`, `i18n_kerbfall`) und tragen deshalb
neue Kennungen. Ihre Rechenwerte sind unverändert; der Wächter aus S43 hat
jede einzelne eingefordert, und das ist der Beleg dafür.

**Nachtrag N12-Nacharbeit (2026-08-07) — 5 Dateien:** `report.js` (Schlüssel
`dts_lizenz_spaeter` entfällt, jetzt zwei statt drei; 0.2.1-N12) · `ui.js`
(„Später" legt nichts mehr ab, jeder Start beginnt ohne den Merker;
0.18.1 / N12 / 2.70) · `i18n_kern.js` (der Hinweistext sagt jetzt, dass beim
nächsten Start wieder gefragt wird; 0.9.1-N12) · `test_naht.js` (**S51**
umgestellt) · `dom_smoke_voll.js` (Neustart nach „Später" durchgeklickt).

**Nachtrag N12 (2026-08-07) — 8 Dateien:** `style.css` (**ein** Druckbild statt
zwei, Überlauf zurückgenommen, Umbruchregeln, Druckkopf/Druckfuß, Farbverlauf
der Marke, `.lic-feld`) · **beide HTMLs** (Druckkopf, Druckfuß,
Aktivierungsdialog) · `ui.js` (Druckkopf füllen, Registrierung, Lang-Druck,
lokaler Speicher, `edition()` gibt die Lizenzzeile ab; Kennungen 0.18.0 /
N12 / 2.69) · `report.js` (Lizenzfunktionen, Lizenzzeile in Bericht und
Datei, Haftungshinweis und Impressum ins Word; 0.2.0-N12) ·
`i18n_kern.js` (14 neue Texte dreisprachig; 0.9.0-N12) ·
`test_naht.js` (**S50**, **S51**, ein Handwert in S49 durch eine Formprüfung
ersetzt) · `dom_smoke_voll.js` (Druckkopf und Registrierung durchgeklickt,
kleiner `localStorage`-Shim).
**Nicht angefasst:** `solver.js`, `rechenweg.js`, `naht.js`, `profil.js`,
`daten.js`, `optionen.js`, `validate.js`, `svglib.js`, `schaubild.js`,
`symbol.js`, `skizze.js`, `thermik.js`, `kosten.js`, `assistent.js`,
`i18n_hilfe.js`, `i18n_kerbfall.js`, `dom_smoke_test.js`.
**Der gesamte Rechenkern blieb unberührt** — N12 fasst keine Rechengröße an.

**Nachtrag N11-Nacharbeit 2 (2026-08-07) — 3 Dateien:** `report.js`
(Hex-Daten mit 128 Zeichen je Zeile, weicher Textumbruch, ungerade Hex-Länge
gibt kein Bild; Kennung 0.1.2-N11) · `ui.js` (**nur** die Kennungen:
0.17.2 / N11 / 2.67) · `test_naht.js` (**S49** um den Word-Befund erweitert).
**Kein anderes Modul angefasst, `dom_smoke_voll.js` unverändert.**

**Nachtrag N11-Nacharbeit (2026-08-07) — 5 Dateien:** `ui.js` (`karteZeilen()`
liest die Struktur statt der Klasse; Kennungen 0.17.1 / N11 / 2.66) ·
`report.js` (Zeile ohne Wert ohne Doppelpunkt, Überschrift ohne zweiten
Doppelpunkt, keine doppelte Liste 2.4; Kennung 0.1.1-N11) ·
`test_naht.js` (**S49** um die drei Befunde erweitert) ·
`dom_smoke_voll.js` (`winkel_v` mit beiden Zusatzbereichen durchgerechnet) ·
Plandatei und Historie. **Kein anderes Modul angefasst.**

**Nachtrag N10b (2026-08-05) — 12 Dateien:** `validate.js` (ODER-Bedingung,
20 Felder) · `ui.js` (zwei Bereiche, Kostenkarte, Preis-Hinweis, Kennungen
0.15.0 / N10b / 2.59) · `optionen.js` (zwei Beispiele mit Kostenrechnung) ·
`kosten.js` (Leerliste für nicht berechenbare Positionen) · `assistent.js` ·
`i18n_kern.js` · `i18n_hilfe.js` (18 Laienhilfen) · **beide HTMLs** ·
`test_naht.js` · `dom_smoke_voll.js`.
**Nicht angefasst:** `solver.js`, `rechenweg.js`, `naht.js`, `profil.js`,
`daten.js`, `svglib.js`, `schaubild.js`, `symbol.js`, `skizze.js`,
`thermik.js`, `i18n_kerbfall.js`, `style.css`, `dom_smoke_test.js`.

**Nachtrag N10a (2026-08-05) — 6 Dateien:** **neu `kosten.js`** ·
`i18n_kern.js` (Einheiten, Schritte, Positionen, Meldungen) · `ui.js` (nur
Kennungen: 0.14.0 / N10a / 2.57) · **beide HTMLs** (Skript-Zeile) ·
`test_naht.js` (**S48**) · `dom_smoke_voll.js`.
**Nicht angefasst:** der gesamte Rechenkern der Statik und der Wärmeführung.

**Nachtrag N9d (2026-08-05) — 10 Dateien:** `solver.js` (letzter Durchgang mit
dem gewählten a-Maß) · `rechenweg.js` (Skalierungsprobe) · `validate.js`
(Anhaltswerte) · `i18n_kern.js` · `ui.js` (Quelle unter dem Zielfenster,
Anhalts-Hinweis, Kennungen 0.13.0 / N9d / 2.55) · `style.css` ·
`test_naht.js` (**S46**, **S47**) · `dom_smoke_voll.js`.
**Nicht angefasst:** `optionen.js`, `thermik.js`, `naht.js`, `profil.js`,
`daten.js`, `svglib.js`, `schaubild.js`, `symbol.js`, `skizze.js`,
`assistent.js`, `i18n_hilfe.js`, `i18n_kerbfall.js`, beide HTMLs,
`dom_smoke_test.js`.

**Nachtrag N9c (2026-08-05) — 12 Dateien:** `solver.js` (geometrische
Lasteingabe verdrahtet) · `rechenweg.js` (Lastprobe) · `optionen.js`
(Gruppe `kraftrichtung`, 14 Beispiele) · `validate.js` (Feld `d_komb`) ·
`i18n_kern.js` · `i18n_hilfe.js` · `skizze.js` (Skizze Kraftrichtung) ·
`assistent.js` · `ui.js` (Kennungen 0.12.0 / N9c / 2.52) · `test_naht.js` ·
`dom_smoke_voll.js`. **Nicht angefasst:** `thermik.js` blieb bis auf die
Meldung unverändert, dazu `naht.js`, `profil.js`, `daten.js`, `svglib.js`,
`schaubild.js`, `symbol.js`, `i18n_kerbfall.js`, `style.css`, beide HTMLs,
`dom_smoke_test.js`.

**Nachtrag N9b (2026-08-05) — 13 Dateien:** `thermik.js` (Zielfenster,
Bericht) · `optionen.js` (Gruppe `endkrater`) · `validate.js` (18 Felder,
Endkrater durchgereicht) · `i18n_kern.js` · `i18n_hilfe.js` (18 Laienhilfen) ·
`skizze.js` (Endkraterskizze) · `assistent.js` (Bereich *thermik*,
Schrittreihenfolge) · `ui.js` (Panel, Ergebniskarte, Kennungen 0.11.0 / N9b /
2.50) · `style.css` · **beide HTMLs** · `test_naht.js` (**S45**) ·
`dom_smoke_voll.js`.
**Nicht angefasst:** `solver.js`, `rechenweg.js`, `naht.js`, `profil.js`,
`daten.js`, `svglib.js`, `schaubild.js`, `symbol.js`, `i18n_kerbfall.js`,
`dom_smoke_test.js`. **Der Rechenkern der Statik blieb wieder unberührt.**

**Nachtrag N9a (2026-08-05) — 7 Dateien:** **neu `thermik.js`** ·
`i18n_kern.js` (16 Meldungstexte, Kennung auf N9a) · `ui.js` (nur Kennungen:
0.10.1 / N9a / 2.47) · **beide HTMLs** (Skript-Zeile) · `test_naht.js`
(**S43**, **S44**, fünf Kennungskorrekturen) · `dom_smoke_voll.js`.
**Zusätzlich nur die Kennungszeile geändert:** `solver.js`, `rechenweg.js`,
`validate.js`, `assistent.js` — je genau ein `VERSION`-String, sonst nichts.
**Nicht angefasst:** `naht.js`, `profil.js`, `daten.js`, `optionen.js`,
`svglib.js`, `schaubild.js`, `symbol.js`, `skizze.js`, `i18n_hilfe.js`,
`i18n_kerbfall.js`, `style.css`, `dom_smoke_test.js`.

**Nachtrag N8b/N8c (2026-08-04) — 9 Dateien:** **neu `skizze.js`** ·
`assistent.js` (Skizzenzuordnung) · `i18n_kern.js` · `ui.js` (Overlay,
gemeinsamer Schreibweg, Kennungen 0.10.0 / N8c / 2.44) · `style.css` ·
**beide HTMLs** (Overlay-Markup und Skript-Zeile) · `test_naht.js`
(**S41**, **S42**) · `dom_smoke_voll.js`.
**Nicht angefasst:** `solver.js`, `rechenweg.js`, `naht.js`, `profil.js`,
`daten.js`, `optionen.js`, `validate.js`, `svglib.js`, `schaubild.js`,
`symbol.js`, `i18n_hilfe.js`, `i18n_kerbfall.js`, `dom_smoke_test.js`.
**Der Rechenkern blieb wieder unberührt.**

**Nachtrag N8a (2026-08-04) — 7 Dateien:** **neu `assistent.js`** · `validate.js`
(Feld → Bereich) · `i18n_kern.js` (sechs Beschriftungen) · `ui.js` (nur die
Kennungen: 0.9.1 / N8a / 2.42) · **beide HTMLs** (Skript-Zeile für
`assistent.js`) · `test_naht.js` (**S40**) · `dom_smoke_voll.js`.
**Nicht angefasst:** `solver.js`, `rechenweg.js`, `naht.js`, `profil.js`,
`daten.js`, `optionen.js`, `svglib.js`, `schaubild.js`, `symbol.js`,
`i18n_hilfe.js`, `i18n_kerbfall.js`, `style.css`, `dom_smoke_test.js`.
**Der Rechenkern blieb unberührt — genau das war der Zweck dieses Schnitts.**

**Nachtrag S39 (2026-08-04) — 1 Datei:** `test_naht.js` (neue Sektion **S39**,
Verifikation gegen publizierte Rechenbeispiele, 1553 → **1589** Assertions).
**Kein Produktmodul angefasst** — `Codestand` bleibt deshalb **2.39**. Die
Recherchegrundlage liegt als
`Referenzbeispiele_zur_Verifikation_eines_Schweißnaht-Bemessungsp.md`
im Projektordner (sechste Recherchedatei, Abschnitt 8).

---

═══════════════════════════════════════════════════════════════════════════
Changelog — **die vollständige Fassung ab v1.0 steht in `Schweißnaht-Historie.md`**
═══════════════════════════════════════════════════════════════════════════

Hier stehen nur die letzten drei Einträge. Wer wissen will, wie eine Entscheidung
zustande kam, findet die Kette dort — ab der Erstfassung vom 2026-07-23.

⚠️ **ZWEI SORTEN LÜCKEN, beide bei P2 gemessen** (2026-08-08):

**1) v2.65 bis v2.72 wurden GELÖSCHT.** Der Plan versprach seit v1.0, die vollständige
Fassung stehe in der Historie; **den Mechanismus dafür gab es nie.** Beim Trimmen auf
drei Einträge wurden sie entfernt statt verschoben. Der INHALT steht in den
Erzählblöcken der Historie — verloren ist die kompakte Form. Ab v2.73 ist nachgeholt.

**2) v2.75, v2.77, v2.78 und v2.79 hat es NIE GEGEBEN.** An manchen Tagen wurde die
Planversion hochgezählt, ohne einen Changelog-Eintrag zu schreiben. Kein Verlust, aber
unsauber: **eine Versionsnummer ohne Eintrag lässt später jemanden suchen, was da
passiert ist.**

**Seither gilt in 9.2.1:** ein getrimmter Eintrag wandert in die Historie — und jede
Erhöhung der Planversion bekommt einen Eintrag, und sei er zwei Zeilen lang.

**v2.80 (2026-08-08):** **P2 — Plandatei und Historie neu geordnet. Kein Code angefasst.**
Die Datei schrumpft von **4625 auf rund 2850 Zeilen**; die Historie wächst um dieselbe
Menge. **Fünf Teile (A–E), sortiert danach, WANN man etwas braucht** — und **das gesamte
querliegende Regelwerk steht jetzt an einer Stelle** (Teil A): Kickoff, Teststrategie,
9.1 und 9.2. Die **80 Regeln in 9.2 sind thematisch sortiert** statt in der Reihenfolge,
in der sie gelernt wurden — sieben Themen von *Arbeitsweise* bis *Dateien und Ausgaben*.
**Der Wortlaut ist unverändert; nur die Reihenfolge ist neu.**
⚠️ **Zwei Entscheidungen, die vom ursprünglichen Auftrag abweichen und begründet sind:**
**(1) Die Abschnittsnummern bleiben** (1, 2.x, 4.12, 9.2 …) — aus dem Code heraus wird auf
sie verwiesen; die Teile A–E sind eine Wegweisung ÜBER der Nummerierung, keine neue.
**(2) Die 152 Schnittstellenregeln bleiben bei ihrer Schnittstelle** in Teil C. In 5.3
stand „alle Regeln an EINER Stelle"; beim Vermessen zeigte sich, dass das falsch wäre —
eine Bedingung, die man erst zwei Kapitel entfernt findet, ist schlechter als eine, die
neben dem steht, was sie bedingt. Zusammengeführt wurde, was **immer** gilt.
**Gemessen statt gehofft:** 681 regelhafte Zeilen wurden vor dem Umbau erfasst und
nachher **alle 681** wiedergefunden — in der Plandatei oder in der Historie. Dazu 15
harte Anker (`f_u = 490`, die Liste 2.4, Δσ, EN ISO 13920 …) gegengezählt.
**Der Wegweiser in 9.3 ist Pflichtteil geworden:** eine Tabelle nennt, welche Fragen in
der Historie beantwortet sind — sonst würde „wir haben es verschoben" heimlich zu
„niemand liest es mehr".
**Codestand unverändert 2.78 · ui 0.20.2 · P1. Basislinie unverändert:
3488 Assertions · Smokes 1121 / 1079 / 1079 · i18n-Parität 0.**
**Nächster Schritt: Baustein N13 (Ermüdung). Einstieg: „weiter mit N13".**




**v2.81 (2026-08-08):** **Die Changelog-Lücke vollständig vermessen.** Nur Plandatei und
Historie, kein Code. Dieters Vermutung, ein abgebrochener Chat habe die Lücke verursacht,
trifft den Anfang: Der Plan-Kopf hält fest, dass am **2026-08-03 eine elf Versionen alte
Plandatei** zu neuem Code im Projektordner lag. Der Abgleich zeigt jetzt aber **zwei
verschiedene Sorten Lücken**: **v2.65–v2.72 wurden gelöscht** (beim Trimmen entfernt statt
verschoben, weil der versprochene Mechanismus nie existierte), während **v2.75, v2.77,
v2.78 und v2.79 nie geschrieben wurden** — dort wurde nur die Nummer hochgezählt. Beides
ist jetzt am Changelog vermerkt, damit sich beim nächsten Durchsehen niemand über die
Löcher wundert. Neue Regel in 9.2.1: **jede Erhöhung der Planversion bekommt einen
Eintrag, und sei er zwei Zeilen lang.**
**Codestand unverändert 2.78 · ui 0.20.2 · P1. Basislinie unverändert:
3488 · 1121 / 1079 / 1079.**
**Nächster Schritt: Baustein N13 (Ermüdung). Einstieg: „weiter mit N13".**




**v2.82 (2026-08-08):** **Der Verkaufsstand ist eingefroren — und der Δσ-Vorschlag steht
schriftlich.** Nur Plandatei und Historie, kein Code. Dieter hat die Module
zusammenkopiert und obfuskiert; **die Einzeldatei-Fassung ist damit erledigt**. Der
verkaufte Stand (**P1 · Plan 2.78 · ui 0.20.2**) steht in **5.3a** — samt der Folge, die
keine Nebenbemerkung ist: **Ab jetzt gibt es Käufer mit einer eingefrorenen Kopie, und
deren `.dts`-Dateien müssen nach N13 weiter aufgehen.** Das Format ist dafür gebaut;
**in N13 wird es geprüft, nicht angenommen.**
Abschnitt **5.3 trägt jetzt die offene Entscheidung vor N13a** statt der erledigten
Aufträge P1/P2: Vorgeschlagen sind **zwei Lastzustände (max/min) als der eine Weg**, weil
eine bloße Lastschwingbreite proportionale Schnittgrößen unterstellt — und dann kann der
maßgebende Punkt im Nahtbild wandern, was bei den unsymmetrischen Nahtbildern dieses
Programms kein Randfall ist. „Schwellend" wird der Sonderfall min = 0, „Δσ direkt" ein
„eigener Wert"-Haken. **Nicht entschieden** — Dieter entscheidet nach der Reise; bis dahin
wird an `ermuedung.js` nicht gebaut.
Der älteste Changelog-Eintrag (v2.76) ist beim Trimmen **in die Historie gewandert** —
zum ersten Mal der Handgriff, der seit v1.0 versprochen war und nie ausgeführt wurde.
**Codestand unverändert 2.78 · ui 0.20.2 · P1. Basislinie unverändert:
3488 · 1121 / 1079 / 1079.**
**Nächster Schritt: Δσ entscheiden, dann Baustein N13. Einstieg: „weiter mit N13".**


═══════════════
Ende Schweißnaht-1.md · DT-ProfiSchweissnaht
═══════════════════════════════════════════════════════════════════════════
