# 🔩 DT-ProfiSchweissnaht — Bauplan (Schweißnaht-1.md · alleinige Grundlage für das Bauen)

## Schweißnahtberechnung für Stahlbau **und** Maschinenbau — statischer Nachweis, Ermüdung,
## Wärmeführung, Kosten, Verzug · dreisprachig (DE/EN/PT) · offline · Handy zuerst

> **Diese Datei ersetzt `Schweißnaht.md` vollständig.** Sie enthält den Stand nach dem
> Konzeptgespräch (2026-07-23), nach der abgeschlossenen Recherche (R1–R6), nach der
> Abstimmung vom **2026-07-24** (alle offenen Fragen aus Abschnitt 0 geklärt) und nach den
> abgenommenen Bausteinen **N1, N2, N2b, N2c, N3, N4 und N5 vollständig
> (N5a, N5b, N5c-1 bis N5c-3 und N5d)**, **N6b**, **N7** und **N8 vollständig
> (N8a, N8b-1, N8b-2, N8c)**, **N9a** und **N9b**, dazu **N9c gebaut und
> **N9 vollständig (N9a, N9b, N9c, N9d)** — Stand 2026-08-05.
> Sie ist so geschrieben, dass ein **neuer Chat ohne Vorwissen** damit weiterarbeiten kann.
> **Das WARUM steht in `Schweißnaht-Historie.md`** (Entscheidungslog + Changelog im
> Volltext) — dort nachschlagen, bevor etwas geändert wird, das falsch aussieht.
> Einstieg dort: **„weiter mit N8"** — dann der Reihenfolge in Kickoff-Punkt 5b folgen.
> `N6b_Vorlauf-Messwerte.md` ist nach der Abnahme **gelöscht worden** — der Inhalt steht
> in 4.11 und in der Historie. Im Projektordner liegt **keine Vorlaufdatei** mehr.

```
Plan-Version : 2.56 · Stand 2026-08-05
Codestand    : Plan 2.55 · ui 0.13.0 · N9d
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
               → NÄCHSTER SCHRITT: Baustein **N10 (Kosten, Zeit, Draht)** —
                 Einstieg „weiter mit N10", **Umfang vor dem Bau
                 abstimmen**. Eine Recherchedatei liegt bereit
                 (`Schweißzeit__Schweißkosten…md`), und N10 bringt seine
                 Assistenten-Schritte nach 3.3 mit.
                 Schnittstellen: 4.5 (naht.js), 4.6 (profil.js),
                 4.7 (svglib.js + schaubild.js), 4.8 (solver.js),
                 4.9 (rechenweg.js), 4.10 / 4.10b / 4.10c / 4.10d (ui.js),
                 4.11 (symbol.js).
               Große Bausteine (N5, N8, N13, N14) werden in ETAPPEN gebaut — Regel in
               Kickoff-Punkt 5c, Etappen in Abschnitt 5.2.
Basislinie   : 2942 Assertions · DOM-Smokes 801 (voll) + 802 (test) · i18n-Parität 0 Abweichungen
               (VERBINDLICH. Basislinie darf nur WACHSEN — nie schrumpfen, nie gelockert werden.)
Dateistand   : siehe Abschnitt 8.1 — dort steht, was fertig ist und was noch fehlt.
⚠️ SYNC       : Am 2026-08-03 lag im Projektordner eine **elf Versionen alte**
               Plandatei (v2.17, Basislinie 679/234/235) zu neuem Code. Gefunden
               hat es allein der Abgleich „Basislinie im Kopf gegen Basislinie
               gemessen" (Kickoff-Punkt 11). Diesen Abgleich NIE überspringen.
```

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
Einstiegssatz von Dieter: **„weiter mit N10"**.
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
9. Abschnitt **5.1** lesen: 5.1-1 ist der **gelieferte** Umfang von N5d (nur noch
   Begründung), 5.1-2 der **nächste** Auftrag **N6b** — **vor dem Bau mit Dieter
   bestätigen**. Abschnitt **5.2**: die Etappen von N5.
10. **Vollständigkeit des Projektordners prüfen** (Liste in 8.1): 17 Module, `style.css`,
   beide HTMLs und **alle drei** DEV-ONLY-Dateien, dazu `Schweißnaht-Historie.md`.
   `dom_smoke_test.js` allein läuft nicht, sie ruft `dom_smoke_voll.js` auf — fehlt eine
   davon, zuerst bei Dieter nachfragen. **Das ist keine Formsache:** beim Austausch sind
   schon zweimal Dateien verlorengegangen, beide Male hat diese Prüfung es gefunden.
11. Arbeitsordner herstellen (Befehl unter Punkt 6 der Kickoff-Liste), dann
   `node test_naht.js`, `node dom_smoke_voll.js`, `node dom_smoke_test.js` laufen lassen
   und die Basislinie aus dem Plan-Kopf bestätigen (**2942 / 801 / 802 · 0 Fehler**),
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

> **Offener Punkt für N11 (aus der Abnahme von N5d, 2026-08-03):** Die Zeile zeigt die
> **Modulnamen**, nicht die **Dateinamen** — `data` statt `daten.js`, `options` statt
> `optionen.js`, `kern`/`hilfe`/`kerbfall` statt der drei `i18n_*.js`. Zum Erkennen eines
> fehlenden oder alten Moduls reicht das; sobald die Zeile aber in Druck, PDF, Word und
> `.dts` wandert, sollen die Namen den Dateinamen entsprechen. Das ist **eine Zeile je
> Modul** (`NAME`) und gehört **in N11 mitgemacht**, nicht als eigener Bau.

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
`ui.js` ruft **genau drei** Module auf: **`DTNSolver`** (rechnet), **`DTNRechenweg`**
(beschriftet und formatiert), **`DTNSchaubild`** (zeichnet). Die drei liefern Fertiges —
`ui.js` rechnet nichts nach und formatiert nichts nach.
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
| **N10** ⬅ | **Kosten/Zeit/Draht** *(nächster Bau — Umfang vorher abstimmen)* | `kosten.js` + Panel + Rechenweg + Assistenten-Schritte. |
| **N11** | **Ausgaben** | `report.js`: `.dts` speichern/öffnen (**erst leeren, dann laden** + Formatversion), Druck/PDF, Word (.rtf), `guard()`-Gating. Aktionsleiste **oben**, Dateiname trägt Bezeichnung + Datum. **Jede Ausgabe trägt die Versionszeile** (3.6) — **dabei die Modulnamen an die Dateinamen angleichen UND die Modulkennungen mitwachsen lassen**, beide Merkposten in 3.6. |
| **N12** | **Edition/Registrierung/Impressum** | Testbalken, Aktivierungsdialog beim Erststart (Name + Schlüssel, **keine Formatprüfung**), „Vollversion · lizenziert für <Name>", **10-s-Long-Press** = Reset, Info-ⓘ mit Impressum. |
| **★** | **LAUNCH-CHECKPOINT** | **Ab hier verkaufsfähig.** Dieter entscheidet: weiterbauen oder veröffentlichen. |
| **N13** | **Ermüdung — Rechenkern** | `ermuedung.js`: Wöhlerlinie m=3/5, γ_Mf, Miner, Kollektive + Rechenweg. **Hier Dieter nach seinen Praxis-Kerbfällen fragen.** |
| **N14** | **Kerbfallkatalog** | `kerbfall.js` + SVG-Skizzen + Auswahl-UI mit Filter. Struktur vollständig, Füllung gestaffelt (Start 25–35 Details, je 2 Quellen), **ehrliche Lücken sichtbar**. Mehrere Etappen. |
| **N15** | **Verzug & Schrumpfung** | `verzug.js` + Panel, klar als **Abschätzung** gekennzeichnet. |
| **N16** | **Feinschliff + Build** | Presets ausbauen, Wissenstexte, Code-Audit, Bündelung + Obfuskierung (zwei Bündel, Unterschied nur `DT_EDITION`). **→ V1-Launch.** |

### 5.1 Aufträge *(N5c-3, N5d, N6b und N7 sind gebaut — alles hier ist Begründung)*

---

#### 5.1-0 · N5c-3 — „Nahtzug statt Segment" **(ERLEDIGT UND ABGENOMMEN 2026-08-03)**

> ✅ **Gebaut, grün ausgeliefert und von Dieter am Handy ABGENOMMEN — 2026-08-03,
> ohne Nacharbeit.** Was unten steht, ist die
> Fehlerbeschreibung von 2026-07-28 — sie bleibt stehen, weil dort **nachlesbar ist,
> warum** die Prüfung heute auf der Nahtzug-Ebene läuft und warum die Längenprüfung eine
> Warnung ist. **Gebaut wird daraus nichts mehr.**
>
> **Was geliefert wurde:**
> - `solver.js`: neue Funktion `nahtzuege(segmente, info)` gruppiert die Segmente über
>   `info[i].raupe` aus `profil.js`. Die Prüfung `l ≥ max(6·a; 30 mm)` läuft seither
>   **je durchlaufendem Zug**. Neu im Ergebnis: `grenzen.je_zug[]`, `grenzen.n_zuege`,
>   `grenzen.mehrsegmentig`; `je_segment[]` trägt statt `l_eff_min` jetzt `zug`.
> - `rechenweg.js`: Schritt `rw_s_l_eff` rechnet aus `je_zug` und trägt **`erfuellt: null`**
>   — kein Nachweis-Haken mehr, sondern der Warntext.
> - `i18n_kern.js`: `msg_sv_l_eff_zu_kurz` neu formuliert (nennt EN 1993-1-8 §4.5.1(2) und
>   sagt, dass das Ergebnis nur rechnerisch gilt), neuer Hinweis `msg_sv_l_eff_je_zug`.
> - `test_naht.js`: Sektion **S33** mit allen Prüfankern von unten · `dom_smoke_voll.js`:
>   H-Träger und Gegenprobe an der echten Oberfläche.
>
> **Dieters Entscheidung vom 2026-08-03 zur offenen Frage:** Die Längenprüfung ist eine
> **WARNUNG**, kein Nachweis. Die Ampel bleibt bei η. Damit das ehrlich bleibt, trägt der
> Warntext die volle Aussage der Norm und steht **ohne Aufklappen** im Ergebniskasten.
> *Falls sich das im Gebrauch als zu freundlich erweist: die Ampel kennt auch **gelb** —
> das bliebe Warnung statt Nachweis. Angeboten, nicht entschieden.*
>
> **Zwei benannte Entscheidungen (damit sie niemand „korrigiert"):**
> 1. **β_Lw bleibt je Segment.** Auf Zug-Ebene umgestellt, würde ein umlaufender
>    1182-mm-Zug die Langnaht-Abminderung auslösen — die zielt auf lange
>    Laschenanschlüsse, nicht auf eine Naht, die um Ecken geht.
> 2. **Ohne Raupenangabe ist jedes Segment ein eigener Zug** (freier Segmentmodus).
>    Das ist die strengere Annahme und genau das bisherige Verhalten.
>
> **Basislinie 822 → 874 Assertions · Smokes 448/449 → 463/464 · i18n-Parität 0.**
> **Nichts offen.** Der Beleg unten ist am Handy erbracht: die umlaufend geschweißten
> Profile rechnen durch, die Gegenprobe warnt weiterhin.

**Der Befund vom 2026-07-28 (Begründung, nicht mehr Auftrag):**

> **Gefunden von Dieter am 2026-07-28 beim Prüfen von N5c-2.** Kein Schönheitsfehler:
> **jedes I- und U-Profil mit umlaufender Naht fällt durch**, unabhängig von den Maßen.

**Was passiert.** Die Prüfung `l_eff ≥ max(6·a ; 30 mm)` läuft **je geometrischem
Segment**. Bei Profilen mit Flansch sind die Flanschkanten aber nur **`t_f` lang** — und
`t_f` ist bei keinem Normprofil ≥ 30 mm. Nachgemessen am 2026-07-28:

| Fall | Segmente | Naht gesamt | als „zu kurz" gewertet | Ampel | Rechenweg |
|---|---|---|---|---|---|
| I-Profil 200×200, rundum, a 4 | 12 | **1182 mm** | 4 × **15 mm** (= `t_f`) | grün, η 0,083 | ✗ nicht erfüllt |
| U-Profil 80×160, rundum, a 4 | 8 | **626 mm** | 2 × **10 mm** (= `t_f`) | grün, η 0,157 | ✗ nicht erfüllt |
| U-Profil 100×200, rundum, a 5 | 8 | **782 mm** | 2 × **14 mm** (= `t_f`) | grün, η 0,100 | ✗ nicht erfüllt |
| RHS 120×80×6, rundum, a 4 | 4 | 328 mm | keine | grün, η 0,299 | ✓ erfüllt |

**Dieters Einwand, und er trifft zu:** Um die Prüfung zu bestehen, müsste der Flansch
dicker als 30 mm sein. **Dann würde kein einziges Normbauteil passen.**

**Warum es falsch ist.** EN 1993-1-8 §4.5.1(2) spricht von **einer Kehlnaht**, deren
wirksame Länge zu klein ist. Gemeint sind kurze, **freistehende** Nähte, bei denen Anfang
und Ende die Tragfähigkeit aufzehren. Beim umlaufend geschweißten I-Profil liegt aber
**eine einzige durchlaufende Naht von 1182 mm** vor — sie geht nur um Ecken. Ein 15-mm-Stück
mittendrin ist keine 15-mm-Naht. Die Prüfung sitzt auf der **falschen Ebene**.

**Zweiter Befund, beim Messen aufgefallen — genauso wichtig:**
Das Programm zeigt **gleichzeitig** grüne Ampel (`erfuellt: true`) **und** im Rechenweg
`rw_s_l_eff` → **✗ Nachweis NICHT erfüllt** (`nachweis_ok: false`). Zwei Antworten auf
dieselbe Frage auf einem Bildschirm. **Das muss mit derselben Etappe zusammengeführt
werden** — egal wie die Längenprüfung am Ende eingestuft wird.

**Warum es durchgerutscht ist — ehrlich festgehalten:** Es war bekannt. In `optionen.js`
steht als Begründung zur Beispielwahl, ein I-Profil um die Flansche geschweißt warne immer,
*„deshalb nur der Steg"*. Der Fall wurde **umgangen statt gelöst**. Die drei Beispiele sind
deshalb sauber — der erste realistische Griff daneben nicht.
**Lehre für künftige Etappen: Wenn ein Beispiel gewählt wird, um einem Verhalten
auszuweichen, ist das ein Fehlerbefund und gehört hierher — nicht in einen Kommentar.**

**So ist es zu reparieren.** Die Prüfung gehört **je durchlaufendem NAHTZUG**, nicht je
Segment:

- `umlaufend = true` → **ein** Zug, Gesamtlänge (I-Profil oben: 1182 mm) → besteht
- getrennte Züge (z. B. „nur Steg": zwei Nähte à 170 mm) → **jeder Zug für sich** → besteht
- wirklich kurze, freistehende Nähte → werden **weiterhin gefangen**. Das ist der Sinn der
  Regel und darf nicht verlorengehen.
- **`l_eff = l − 2·a` ebenso je Zug**, nicht an jeder Ecke erneut — sonst kostet jede Ecke
  ein weiteres `2·a`, was genauso falsch ist.

**Zu entscheiden (mit Dieter, er ist der Fachmann):** Ist die Längenprüfung ein **Nachweis**
(✗ = die Naht trägt so nicht) oder eine **Warnung**? Beides ist vertretbar — aber Ampel und
Rechenweg müssen danach **dasselbe** sagen.

**Betroffen:** `solver.js` (die Prüfung), ggf. `profil.js` (muss die Zugehörigkeit zum
Nahtzug herausgeben — `umlaufend` gibt es schon), `rechenweg.js` (Einstufung und Text),
`test_naht.js`, `dom_smoke_voll.js`.

**Prüfanker für den Harness — vorher gemessen, nachher bestätigt** *(alle in S33, grün am
2026-08-03; die Profilmaße dazu: I 200×200 mit t_w 9 / t_f 15, U 80×160 mit t_w 7 / t_f 10,
U 100×200 mit t_w 9 / t_f 14 — ohne sie kommen die Längen unten nicht heraus)*:

- I-Profil 200×200, rundum, a 4 → **kein** „zu kurz" mehr, Naht 1182 mm, Rechenweg erfüllt
- U-Profil 80×160, rundum, a 4 → **kein** „zu kurz" mehr, Naht 626 mm
- I-Profil „nur Steg" (Beispiel `traeger`) → unverändert 2 Segmente/324 mm/η 0,626
- RHS 120×80×6 rundum (Beispiel `rhs`) → unverändert 4 Segmente/328 mm/η 0,359
- **Gegenprobe, damit die Regel nicht verlorengeht:** Blech, Flanken, t 20, b 35, a 5 →
  muss **weiterhin** „zu kurz" melden (Einzelnaht, 35 mm, Grenze 30 mm nach Abzug)
- Ampel und `rw.nachweis_ok` müssen in **allen** Fällen dasselbe sagen

**Erwarteter Beleg am Handy:** Ein H-Träger und ein U-Profil, umlaufend geschweißt, rechnen
durch — ohne roten Nachweis, der keiner ist.

---

#### 5.1-1 · N5d — **GEBAUT, GELIEFERT UND ABGENOMMEN 2026-08-03**

> ✅ **Gebaut, grün ausgeliefert und von Dieter am Handy ABGENOMMEN — ohne Nacharbeit.**
> Belegt am Handy: die Versionszeile nennt 13 von 13 Modulen mit Kennung, der Block
> klappt auf und verhält sich wie beschrieben. Was unten steht, ist der abgestimmte
> Umfang — er bleibt als **Begründung** stehen, gebaut wird daraus nichts mehr.
>
> **Was geliefert wurde:**
> - **Die drei fehlenden `VERSION`-Kennungen zuerst** (`i18n_kern.js`, `i18n_hilfe.js`,
>   `i18n_kerbfall.js` → `0.1.0-N1`). Alle 13 Module sind gekennzeichnet.
> - **Versionszeile im Info-ⓘ**, gebaut aus den *geladenen* Modulen statt aus einer
>   zweiten Liste (3.6, Bauform in 4.10d). Einzige Handzahl: `PLAN` in `ui.js`.
> - **Block „Ausführung & Dokumentation"** verdrahtet: `iso5817` und `exc` erscheinen,
>   ehrlich als nicht rechenwirksam beschriftet, mit Laien-ⓘ und Pflichtstern-frei.
> - **EXC schlägt die Bewertungsgruppe vor** (EXC1→D, EXC2→C, EXC3→B, EXC4→B), die
>   Herkunft steht sichtbar darunter, die eigene Wahl schlägt den Vorschlag, das
>   Leeren der Wahl holt ihn zurück. Die Karte lebt in `optionen.js`.
> - **Ermüdungshinweis ohne Scheinrechnung**, ohne Antippen sichtbar.
> - **Anforderungszeile im Ergebnis** (`ergAnforderung`) — vollständig in Druck/PDF/
>   Word/`.dts` erst mit N11.
> - **Die vier benannten Lücken** stehen in `daten.js` (`NICHT_GEPRUEFT` 10 → 14) und
>   laufen von dort durch Solver und Rechenweg in die Liste 2.4 — **eine** Quelle.
> - Neue Harness-Sektion **S34**, neuer N5d-Durchklick im DOM-Smoke.
>
> **Dieters Entscheidung zur offenen Ja/Nein-Frage (2026-08-03): das Freitextfeld für
> die WPS-Nummer bleibt WEG**, solange N11 die Ausgaben noch nicht gebaut hat.
>
> **Basislinie 874 → 984 Assertions · Smokes 463/464 → 513/514 · i18n-Parität 0.**
> **Nichts offen.** Ein einziger Punkt ist an die Ausgaben weitergereicht worden:
> die Modulnamen der Versionszeile werden in **N11** an die Dateinamen angeglichen (3.6).

**Der abgestimmte Umfang (Begründung, nicht mehr Auftrag):**


> **N5c IST GEBAUT UND ABGENOMMEN (2026-07-28).** Was unten ab „Auftrag für N5c-1" steht,
> ist damit **erledigt** und bleibt nur noch als Begründung stehen — dort ist nachlesbar,
> **warum** die Feldbereinigung so entschieden wurde und mit welchen Zahlen die drei
> Beispiele belegt sind. Gebaut wird daraus nichts mehr.
>
> **Der Umfang ist am 2026-08-03 mit Dieter abgestimmt** (Vorüberlegung am Ende des
> N5c-3-Chats). Er hat zwei Teile.

**Vorlauf — was bereits im Code liegt** *(am 2026-08-03 nachgesehen, spart Arbeit)*:
`optionen.js` enthält die Gruppen **`iso5817`** (B/C/D) und **`exc`** (EXC1–EXC4) fertig,
beide bereits mit `rechenwirksam: false`. Die Laien-ⓘ dazu stehen dreisprachig in
`i18n_hilfe.js` (`grp_iso5817`, `grp_exc`). `ZUSATZBEREICHE` kennt den Bereich
**`ausfuehrung`** (standardmäßig aus). **Es fehlt keine Datengrundlage — es fehlt die
Verdrahtung und die ehrliche Beschriftung.**

**1. Block „Ausführung & Dokumentation" — der abgestimmte Umfang:**

- **Die zwei vorhandenen Auswahlfelder anzeigen**, im Bereich `ausfuehrung`, sauber
  getrennt vom Rechenteil (2.7). Ehrliche Beschriftung: **nicht rechenwirksam**.
- **EXC schlägt die Bewertungsgruppe vor** *(Dieter, 2026-08-03)*: EN 1090-2 verknüpft
  beides (grob EXC2 → C, EXC3/EXC4 → B). Der Vorschlag wird **vorgeschlagen, nicht
  erzwungen** — überschreibbar wie jeder Tabellenwert, **mit sichtbarer Herkunft**.
  Eine Verträglichkeitsregel nach 3.4, keine Rechnung.
- **Sichtbarer Hinweis zur Ermüdung** *(Dieter, 2026-08-03)*: die Bewertungsgruppe zählt
  beim Ermüdungsnachweis sehr wohl, weil die Kerbfälle eine Qualität voraussetzen (2.7).
  In V1 **nur als Hinweis — keine Scheinrechnung.** Die echte Kopplung kommt mit N13/N14.
- **Die Angaben laufen als Anforderungszeile in die Ausgaben** (Druck/PDF/Word/`.dts`
  vollständig erst mit N11).

**BEWUSST NICHT in V1 — und das AUFNAHMEKRITERIUM dahinter** *(Dieters Festlegung
2026-08-03, sie gilt über N5d hinaus)*:

> **Aufgenommen wird, was stabil ist und der Rechnung eine Aussage gibt.**
> B/C/D und EXC1–4 sind zusammen sieben Codes, seit Jahrzehnten unverändert, und sie
> tragen den Ermüdungsteil. **Draußen bleibt, was gepflegt werden müsste.**
> Dieters Satz dazu: *eine Schweißnaht soll nach vielen Normen hergestellt werden — eine
> Qualitätssicherung soll das Programm aber nicht sein, denn die Sachen ändern sich zu
> schnell.* Genau die schnelllebigen Teile bleiben deshalb außen vor:

- **Prüfumfang / ZfP** (VT, PT, MT, UT, RT mit Prozentsätzen je EXC) — hängt an Ausgabe
  und Nahtart, wäre eine zu pflegende Tabelle.
- **Nahtvorbereitung** nach EN ISO 9692-1 — *wichtiges Thema* (Dieter), aber ein
  Geometriekatalog. Gehört fachlich zum Zeichnungssymbol, also frühestens zu **N6b**.
- **Toleranzklassen** nach EN ISO 13920 — *wichtiges Thema* (Dieter), aber Fertigungs-,
  nicht Nachweisseite; Tabellenwerte, die gepflegt werden müssten.
- **Herstellerqualifikation** (EN 1090-1, EN ISO 3834), WPS-/WPQR-Angaben.

> **Diese vier Punkte gehören als benannte Lücken in die Liste 2.4** — sichtbar, ohne
> Antippen. Dann steht im Programm selbst, dass es kein QS-System ist. Das ist ehrlicher,
> als sie halb aufzunehmen. **Diese Zeile ist Teil des Auftrags, nicht optional.**

**2. Versionszeile im Info-ⓘ** (Abschnitt 3.6) — unstrittig. ⚠️ **Zuerst nachrüsten:**
`i18n_kern.js`, `i18n_hilfe.js` und `i18n_kerbfall.js` haben **keine `VERSION`** —
am 2026-07-28 nachgemessen. Eine Zeile aus den Modulkennungen hätte sonst drei stille
Löcher.

**Erwarteter Beleg am Handy:** Der Block klappt auf; EXC anzutippen füllt die
Bewertungsgruppe mit sichtbarer Herkunft und lässt sie überschreibbar; der Ermüdungshinweis
und die vier ehrlichen Lücken stehen ohne Antippen da; der Programmstand ist ablesbar.

**Noch in einem Satz zu bestätigen, bevor gebaut wird:** ob ein freies Textfeld für die
**Schweißanweisung / WPS-Nummer** mit hineinsoll. Es kostet keine Pflege (kein Tabellenwert)
und erscheint nur in der Ausgabe — aber es ist der erste Schritt Richtung Dokumentenverwaltung.
**Vorschlag: weglassen**, solange N11 die Ausgaben noch nicht gebaut hat.

---

#### 5.1-2 · N6b — **GEBAUT, GELIEFERT UND ABGENOMMEN 2026-08-04**

> ⚠️ **ANLAUF VOM 2026-08-03 VERWORFEN — und zwar richtig so.** Drittel 1 (Katalog +
> Nahtvorbereitung, 984 → **1067** Assertions) und Drittel 2 (Zeichnen, → **1116**
> Assertions) waren grün; danach lag der Tokenstand bei **55 %**. Dieter hat am zweiten
> Haltepunkt „Stopp" gesagt — Drittel 3 hätte kein Polster für einen zähen Fehler in der
> Oberfläche gehabt. **Ausgeliefert wurde KEIN Code**, nur diese Plandatei und
> **`N6b_Vorlauf-Messwerte.md`**: voller Katalog (32 Einträge), 16 Fugenformen mit
> Bändern, alle Zeichenfestlegungen, vier bereits zugeschnappte Fallen und die Liste
> dessen, was Drittel 3 nachziehen muss (Modulzahl 13 → 14, Liste 2.4 14 → 13).
> **Der Projektordner blieb unberührt auf N5d — Basislinie 984 · 513 · 514.**
>
> **Beim Neuaufbau gilt: die Vorlaufdatei ist die Abkürzung, nicht der Code.** Gebaut
> wird von vorn, aber nichts muss noch einmal entschieden oder nachgeschlagen werden.

**Dieters drei Antworten (bindend):**
1. **Der volle ISO-2553-Katalog** — nicht nur Kehl-/Stumpfnaht mit Zusatzzeichen.
2. **Die Nahtvorbereitung (EN ISO 9692-1) kommt mit hinein.** Damit fällt
   `ng_nahtvorbereitung` aus der Liste 2.4 (14 → 13 Punkte) — **eine Lücke wird
   geschlossen, nicht umbenannt.**
3. **Einteilig**, aber mit **Haltepunkten nach je rund einem Drittel**: Claude meldet den
   Stand und fragt, ob es weitergeht. Dieter beobachtet den Tokenstand und sagt „weiter"
   oder „Stopp". **Ein Haltepunkt ist ein Entscheidungspunkt, KEINE Lieferung** — Regel 5c
   gilt unverändert. Bei „Stopp" wird das bis dahin *Gemessene* in eine eigene Vorlaufdatei
   gesichert (wie `N5c-1_Vorlauf-Messwerte.md`), der Code wird verworfen und neu gebaut.

**Architektur (von Claude entschieden, von Dieter delegiert):**
- **Neu `symbol.js`** — Katalog *und* Zeichnen, DOM-frei, deterministisch, ohne Text im SVG
  (`data-code` wie in N2c, beschriftet wird in der HTML). Zeichnet auf `svglib.js`, die
  **unverändert** bleibt.
- **`daten.js`**: `FUGENFORMEN` (bisher 7 Einträge mit Einzelwerten) wächst zur
  **Nahtvorbereitungstabelle nach EN ISO 9692-1** — Blechdickenbereich, Winkel, Spalt, Steg
  jeweils als **Band mit Richtwert**, dazu die empfohlenen Verfahren. Bisher wird
  `FUGENFORMEN` **nur innerhalb von `daten.js`** benutzt; die Erweiterung bricht nichts.
- **`optionen.js`**: die Symbolwahl als eigene Gruppen.
- **`ui.js`**: Anzeige im Block „Ausführung & Dokumentation" (2.7).
- **i18n**: Katalogtexte dreisprachig.

**Die ehrliche Kernentscheidung dieses Bausteins:** Der Katalog kann **mehr zeichnen, als
das Programm rechnen kann** (Punkt-, Rollen-, Loch-, Bördelnaht, Auftragschweißung …).
Jeder Katalogeintrag trägt deshalb einen Verweis auf die zugehörige `NAHTARTEN`-Kennung —
**oder ausdrücklich `null`**. Symbole ohne Rechenpartner werden **gezeichnet und dabei
benannt**: „zeichenbar, nicht nachweisbar". Ein Symbol, das aussieht, als würde es
mitgerechnet, wäre genau die stille Lüge, die dieses Programm nicht baut.

**Die drei Drittel:**
1. **Datengrundlage** — Symbolkatalog, Nahtvorbereitungstabelle, dreisprachige Texte,
   Assertions. **Kein Pixel gezeichnet.**
2. **`symbol.js` zeichnet** — die Symbole auf `svglib.js`, mit Bemaßungslage und
   Zusatzzeichen.
3. **Anbindung** — `ui.js`, Liste 2.4 nachziehen, DOM-Smoke, Plandatei.

Ob das wirklich in einen Zug passt, ist **nach Drittel 1 ehrlich zu sagen** — nicht vorher.
*Erfahrungswert aus dem ersten Anlauf: Drittel 1 kostete rund 12, Drittel 2 rund 9
Prozentpunkte Tokenstand. Wer bei über 40 % startet, schafft alle drei.*

---

#### 5.1-3 · N7 — **GEBAUT, GELIEFERT UND ABGENOMMEN 2026-08-04**

> ✅ **Von Dieter am Handy geprüft und ABGENOMMEN — ohne Nacharbeit.**
> Belegt: die Versionszeile nennt „Programmstand N7 · Plan 2.39 · 14 Module"
> mit `ui 0.9.0` und allen vierzehn Kennungen. Was unten steht, bleibt als
> **Begründung** stehen — gebaut wird daraus nichts mehr.

**Der abgestimmte Umfang** *(Dieter, 2026-08-04)*: **zwölf Beispiele, sechs je
Bemessungswelt** — die sechs Starter aus 2.11 spiegeln sich in beiden Welten.
Der Ausführungsblock wird mitbelegt. Gebaut einteilig mit Haltepunkten je Drittel.

**Der Katalog (alle Zahlen gemessen, nicht geschätzt):**

| Beispiel | Welt | Fall | Segmente | Naht | η |
|---|---|---|---|---|---|
| `blech` | A | Laschenanschluss, Flankenkehlnähte, Zug | 2 | 140 mm | 0,842 |
| `traeger` | A | Träger an Stütze, nur Steg, Zug | 2 | 324 mm | 0,626 |
| `rhs` | A | Rechteckprofil, umlaufend, Zug | 4 | 328 mm | 0,359 |
| `konsole` | A | Kragarm, Flansche + Steg, M + Q, **Auslegung** | 12 | 764 mm | 0,837 (a_erf 2,504 → 3) |
| `rohr` | A | Rohr auf Platte, Kreisnaht, **Torsion** | 1 | 359,1 mm | 0,545 |
| `stoss` | A | Blechstoß, **durchgeschweißte V-Naht** | 1 | 126 mm | 0,714 |
| `lasche_b` | B | Laschenanschluss, **ruhend** | 2 | 140 mm | 0,714 |
| `konsole_b` | B | Kragarm U-Profil, **schwellend**, M + Q | 8 | 594 mm | 0,673 |
| `rhs_b` | B | Rechteckprofil, **wechselnd** | 4 | 328 mm | 0,686 |
| `rohr_b` | B | Rohr auf Platte, Torsion | 1 | 359,1 mm | 0,540 |
| `bolzen_b` | B | Bolzen ⌀60, Torsion + Biegung, **Auslegung** | 1 | 188,5 mm | 0,846 (a_erf 3,356 → 4) |
| `stoss_b` | B | Blechstoß, durchgeschweißt und geprüft | 1 | 126 mm | 0,703 |

**Alle zwölf:** grüne Ampel · keine Warnung · alle Rechenproben auf · Ampel und
Rechenweg einig. Jeder Rechenpfad ist mindestens einmal belegt — beide Welten,
beide Rechenrichtungen, Kehl- und Stumpfnaht, Linien- und Kreisnaht, alle drei
Lastfälle. **Draußen geblieben:** Edelstahl und Aluminium mit WEZ-Entfestigung.
Das sind eigene Rechenpfade und je zwei weitere Beispiele — sie stehen als
**benannte Lücke für N16** hier, nicht verschwiegen.

**VIER FEHLER AUS N5c — vom Katalog aufgedeckt, in N7 behoben.**
Alle vier lagen auf den zwei Pfaden, die **kein Beispiel je berührt hatte**:
der Auslegung und der durchgeschweißten Stumpfnaht. Das ist genau das Muster
aus 5.1-0 — und genau davor warnt 9.2.

1. **Die Auslegung war über das Formular unerreichbar.** `a` ist dort kein
   Pflichtfeld, `profil.baue()` verlangt aber eins → `msg_profil_a_fehlt` bei
   **jedem** Auslegungsfall mit Profileingabe. Damit war die halbe
   Rechenrichtung des Programms tot (2.3: „beide Rechenrichtungen im Kern").
   → Bezugsmaß im Solver, `validate.js` bleibt dumm.
2. **Die a-Grenzen griffen bei der durchgeschweißten Naht.** Dort ist `a = t`
   die Definition, `a ≤ 0,7·t` also immer verletzt. Folge war zusätzlich der
   verbotene Widerspruch aus 9.2: **grüne Ampel (η 0,128) neben rotem
   `rw_s_a_max`**. → Grenzen gelten nur noch für Kehl- und teilweise
   durchgeschweißte Naht; die beiden Rechenwegschritte tragen dort keinen Haken.
3. **Das Auslegungsergebnis hing vom Bezugsmaß ab** — 1,6931 aus Bezug 3 gegen
   1,8628 aus Bezug 10. Ursache: der Endkraterabzug hängt selbst am a-Maß.
   → Geometrie wird nachgezogen; jetzt aus Bezug 1/3/5/10/12 identisch.
4. **Die Nahtbild-Grafik blieb im Auslegungsfall leer**, weil `ui.js` aus der
   rohen Formulareingabe zeichnete. → Der Solver gibt das benutzte Nahtbild
   heraus, `ui.js` zeichnet daraus.

**Was beim Bauen sonst noch zuschnappte:** Die Verträglichkeitsregel aus 3.4 hat
einen Entwurf abgewiesen — `kehl_umlaufend` zusammen mit „Flansche + Steg".
Zu Recht: eine umlaufende Naht läuft um. Richtig ist die Doppelkehlnaht.
**Die Regel hat getan, wofür sie gebaut wurde.**

**Basislinie 1138 → 1553 Assertions · Smokes 537/538 → 611/612 · i18n-Parität 0.**
Neue Harness-Sektion **S38**; S31/S32 auf zwölf erweitert; **die festgeschriebenen
Handwerte für `ETAPPE` und `VERSION` sind durch Prüfungen gegen das Kopffeld
`Codestand` ersetzt** — dieselbe Lehre wie bei `PLAN` in v2.36, nur konsequent
zu Ende geführt. Auch der DOM-Smoke prüft die Versionszeile jetzt gegen die
Kennungen aus `ui.js` statt gegen feste Zeichenketten.

**Erwarteter Beleg am Handy:** Die Beispielliste wird kürzer, sobald links eine
Welt gewählt ist. `konsole` antippen und „Berechnen" liefert ein **gesuchtes
a-Maß** samt Nahtbild. `stoss` antippen liefert eine **grüne durchgeschweißte
Stumpfnaht ohne Warnung**.

**Offen für N16:** Beispiele für Edelstahl und Aluminium.
**An N11 weitergereicht:** die Modulkennungen von `solver.js` und `rechenweg.js`
(siehe Merkposten in 3.6).

---

#### 5.1-4 · N8a — **GEBAUT, GELIEFERT UND ABGENOMMEN 2026-08-04**

> ✅ **Von Dieter am Handy geprüft und ABGENOMMEN — ohne Nacharbeit.**
> Belegt durch die Versionszeile (15 Module, `assistent 0.1.0-N8a`,
> `ui 0.9.1`) und einen Durchlauf **aller zwölf Beispiele: grün, Nachweis
> erfüllt**. Was unten steht, bleibt als **Begründung** stehen.

**Der abgestimmte Umfang** *(Dieter, 2026-08-04)*: Eingabefelder **nach
Bereichen gebündelt** statt ein Fenster je Feld · Reichweite **einschließlich
der Zusatzbereiche** · Zeichnungssymbol als **ein freiwilliger Schritt** am
Schluss. N8b und N8c werden anschließend **zusammen** gebaut.

**`assistent.js` — was es ist und was ausdrücklich nicht:**
DOM-frei, hängt nur an `optionen.js` und `validate.js`. Es gibt dort **keine
Formel, keine Grenze, keinen Beiwert**. Eine Quelltextprobe im Harness prüft
das: der Assistent darf keinen Rechenkern nennen und kein DOM anfassen.

| Funktion | Zweck |
|---|---|
| `starte(auswahl, werte)` | übernimmt Vorhandenes, bereinigt Widersprüche |
| `schritt(s)` | das Fenster, das gerade dran ist — sprachneutrale Schlüssel |
| `antworte(s, wert)` | **neue** Sitzung, die alte bleibt unberührt |
| `zurueck` · `springe` · `ueberspringe` | Umkehrbarkeit (3.3) |
| `ergebnis(s)` | genau `{auswahl, werte}` — dasselbe Paar wie das Formular |
| `offen(s)` · `fortschritt(s)` | fragt `optionen.js`/`validate.js`, urteilt nicht selbst |

**KEINE ZWEITE SCHRITTLISTE.** Die Folge entsteht aus `Options.gruppeAktiv()`
und `Valid.sichtbareFelder()` — denselben Funktionen, die das Formular
benutzt. Eine handgepflegte Liste wäre beim nächsten Baustein veraltet, ohne
dass es jemand merkt. Ein typischer Durchlauf hat **19 Schritte**.

**Neu: Feld → Bereich steht jetzt am Feld** (`validate.js`, `bereich`). Der
Assistent bündelt nach Bereichen und darf dafür **nicht** auf `ui.js`
zugreifen — die Oberfläche ist die oberste Schicht. `ui.js` führt in
`ZUORDNUNG` weiterhin die **Anordnung**; eine beidseitige Assertion hält beide
Listen deckungsgleich (dasselbe Muster wie bei den Symbolcodes in N6b).

**DIE KERNPROBE, und sie ist scharf:** Jeder der **zwölf Beispielfälle** läuft
einmal durch das Formular und einmal durch den Assistenten. Verglichen werden
Auswahl, Ausnutzung, Ampel und Nahtbild. **Alle zwölf stimmen auf zwölf
Nachkommastellen überein.** Wäre es anders, hätte das Programm zwei Wahrheiten
und der selbstprüfende Rechenweg wäre entwertet (3.3).

**Ein Fund beim Bauen, den die Kernprobe aufgedeckt hat:** Der erste Entwurf
bot nur Pflichtfelder an und ließ die „eigener Wert"-Felder weg — bequemer und
falsch. Damit fielen **Moment, Torsion und Eckenausrundung** aus dem Dialog,
und sieben der zwölf Beispiele kamen über den Assistenten mit einer **anderen
Ausnutzung** heraus (RHS 0,359 gegen 0,295; Konsole 0,837 gegen 0,203). Plan
3.3 verlangt wörtlich, dass diese Felder zugänglich bleiben. **Ohne den
Zwölf-Fälle-Vergleich wäre das erst am Handy aufgefallen — oder gar nicht.**

**Ehrlich zu den Zusatzbereichen:** Ermüdung, Wärmeführung, Kosten und Verzug
sind heute **reine Haken**; kein Feld und keine Gruppe hängt an ihnen. Der
Assistent fragt dort nur, was auch das Formular fragt, und **benennt bei jedem,
mit welchem Baustein er kommt**. Inhaltliche Schritte liefern N9, N10, N13 und
N15 nach der Prozessregel mit.

**Basislinie 1589 → 1748 Assertions · Smokes 611/612 → 614/615.** Neue
Harness-Sektion **S40**. `assistent.js` hängt seit N8a in beiden HTMLs — die
Versionszeile zeigt deshalb **15 Module**, und sie sammelt sich weiterhin
selbst ein.

**Erwarteter Beleg am Handy:** Die Versionszeile nennt „Programmstand **N8a** ·
Plan **2.42** · **15 Module**" mit `assistent 0.1.0-N8a` und `ui 0.9.1`.
Sonst ist **nichts** zu sehen — das Overlay kommt mit N8b.

---

#### 5.1-5 · N8b und N8c — **GEBAUT, GELIEFERT UND ABGENOMMEN 2026-08-04**

> ✅ **Von Dieter am Handy geprüft und ABGENOMMEN — ohne Nacharbeit.**
> Geprüft wurden ausdrücklich die drei Punkte, an denen es hätte hängen
> können: die Versionszeile mit 16 Modulen, der **Auslegungsfall mit
> Moment** über den Assistenten (grün, Nachweis erfüllt) und der
> **Sprachwechsel bei offenem Dialog** in allen drei Sprachen.
> Was unten steht, bleibt als **Begründung**.

**Dieters Festlegung vorab:** *erst alle Skizzen bauen*, dann das Overlay.
Daraus wurde die vorgeschaltete Etappe **N8b-1**.

**N8b-1 · `skizze.js` — zwölf schematische Bilder.** Fünf Stoßarten, drei
Lastfälle als Last-Zeit-Verlauf, Nachweis gegen Auslegung, Schnittgrößen
direkt gegen Kraft am Hebelarm. Kein Text im SVG (4.3), dreisprachige
Legende, und **jede Skizze meldet selbst, dass sie nicht maßstäblich ist**.
Dazu ein Satz **Mustermaße** je Profil: damit zeichnet `schaubild.js` schon
beim Auswählen, wenn die echten Maße noch gar nicht eingegeben sind. Die
Mustermaße stehen in keinem Ergebnis und landen in keinem Feld — eine
Assertion prüft das.

**Woher die Skizzen kommen — drei Quellen, kein Bild doppelt:**

| Quelle | Deckt ab |
|---|---|
| `skizze.js` *(neu)* | Stoßart · Lastfall · Rechenrichtung · Lasteingabe |
| `schaubild.js` *(N2c)* | Profil · Kanten · die beiden Maß-Schritte |
| `symbol.js` *(N6b)* | Nahtart · Zeichnungssymbol |

**Die benannte Lücke.** Für **Welt, Werkstoffgruppe, Werkstoff, Zustand,
Zusatzwerkstoff, β_w-Regelsatz, Nachweisverfahren, Nahtgüte,
Welt-B-Nahtgruppe, a-Rundung, Schweißverfahren, Bewertungsgruppe und
Ausführungsklasse** gibt es **nichts zu zeichnen, das erklärt statt
schmückt**. Sie stehen als Liste `OHNE_SKIZZE` im Modul, und eine Assertion
verlangt, dass **jede** Auswahlgruppe entweder gezeichnet wird, aus fremder
Quelle kommt oder dort steht. Kommt später eine Gruppe dazu und niemand
entscheidet über ihre Skizze, wird es rot. Dort trägt das Fenster die
Laien-Erklärung und den Tipp — die ehrlichere Hilfe.

**N8b-2 · das Overlay.** Der Knopf `assistBtn` war seit N5a da und verwies
ehrlich auf N8; jetzt öffnet er den Dialog. Je Fenster: Überschrift,
Fortschritt („Schritt 7 von 19"), Skizze, Laien-Erklärung, Tipp und die
Auswahl. **Die Skizze sitzt in der Auswahlkachel, nicht darüber** — beim
Auswählen ist ja noch nichts gewählt, ein Bild über der Liste könnte gar
nichts zeigen. So stehen fünf Stoßarten oder sieben Profile nebeneinander,
jede mit ihrem eigenen Bild. Genau so ist „möglichst anklickbare Auswahl"
aus 3.3 gemeint.

**Erklärung und Tipp kommen aus `i18n_hilfe.js`** — derselben Quelle wie der
ⓘ-Knopf im Formular. Kein einziger Text wurde doppelt gepflegt. Eine
Assertion prüft, dass **jeder** Dialogschritt eine belegte Erklärung hat.

**N8c · die Mündung.** Der Assistent hat **keine eigene Ergebnisanzeige und
keinen eigenen Rechenweg**. Am Ende schreibt er über `formularSetzen()` in
dieselben Felder wie die Handeingabe und drückt denselben Rechenweg an. Der
Anwender sieht danach die volle Anzeige samt Rechenweg und der Liste dessen,
was **nicht** geprüft wurde (3.3, Sicherheitsaspekt).

**Neu und wichtig: EIN Schreibweg ins Formular.** `formularSetzen()` wurde
aus `beispielLaden()` herausgelöst; Beispielkatalog und Assistent benutzen
jetzt dieselbe Funktion. Zwei Schreibwege wären zwei Gelegenheiten,
verschieden zu schreiben — und genau daran hängt, dass beide Wege dasselbe
ergeben.

**Die Probe am Bildschirm:** Ein vollständiger Durchlauf über die echte
Oberfläche — antippen, eintragen, weiter — ergibt dieselbe Auswahl und
**dieselbe Ausnutzung auf zwölf Nachkommastellen** wie derselbe Fall von
Hand. Zusätzlich geprüft: Zurück führt zum vorigen Fenster und die Antwort
steht noch da (änderbar, nicht weg), Abbrechen lässt das Formular in Ruhe,
und ein offener Dialog wird beim Sprachwechsel mit übersetzt.

**Basislinie 1748 → 1825 Assertions · Smokes 614/615 → 662/663.** Neue
Sektionen **S41** (Skizzen) und **S42** (Nahtstelle zur Oberfläche).
`skizze.js` hängt in beiden HTMLs — die Versionszeile zeigt **16 Module**.

**Erwarteter Beleg am Handy:** „Assistent starten" öffnet ein Fenster mit
Fortschritt und antippbaren Kacheln; bei Stoßart, Profil, Nahtart, Lastfall
und Lasteingabe trägt **jede Kachel ihr eigenes Bild**. Am Ende steht das
volle Ergebnis mit Rechenweg — dasselbe, das die Handeingabe liefert.

**Ab jetzt gilt die Prozessregel aus 3.3:** Jeder weitere Baustein liefert
seine Assistenten-Schritte **mit**. Der Assistent wird nie „am Ende
drangebaut".

---

#### 5.1-6 · N9 — Umfang festgelegt · **N9a ABGENOMMEN 2026-08-05**

> ✅ **N9a von Dieter am Handy geprüft und ABGENOMMEN — ohne Nacharbeit.**
> **Zum ersten Mal ist die Versionszeile ein Beleg und nicht nur eine
> Anzeige:** Die sechs Module, die weiterhin `0.1.0-N1` oder `-N2` melden,
> sind seit ihrem Baustein nachweislich unverändert — der Wächter aus S43
> würde jede stille Änderung rot machen.

**Der abgestimmte Umfang** *(Dieter, 2026-08-05)*:

| | |
|---|---|
| Vorwärmung | **nur Methode B** (CET-Formel), Geltungsbereich hart geprüft |
| CET | **aus der Analyse gerechnet**, direkt überschreibbar; CEV und Pcm zur Einordnung |
| kombinierte Dicke | **Summe** je Stoßart |
| t8/5 | 2D **und** 3D, Übergangsdicke, Nahtfaktoren, Wärmeeinbringen |
| Zielfenster | Ampel **und** Auslegungsrichtung (zulässiges Q, Vorschlag für v) |

**METHODE A LÄSST SICH NICHT EHRLICH BAUEN — gezielt recherchiert.** Sie
besteht aus **13 Nomogrammen** (Figure C.2 a–m), die nie in Tabellen- oder
Formelform veröffentlicht wurden; auch keine Regressionsnäherung existiert.
Mehrere Quellen sagen ausdrücklich, dass EN 1011-2 anders als AWS D1.1 oder
ASME B31.3 keine Nachschlagetabelle hat. Die Kurven aus der Norm zu
digitalisieren wäre weder überprüfbar noch urheberrechtlich sauber.
**AWS D1.1 Annex B** wäre frei tabelliert, die Zahlen stehen aber in der
AWS-Norm — gleiche Lage. Dieters Entscheidung: **Methode B allein, Methode A
als benannte Lücke**, die neben jedem Ergebnis genannt wird.

**ZWEI ALTE WIDERSPRÜCHE HAT DIESELBE RECHERCHE AUFGELÖST:**
1. **Die kombinierte Dicke ist die SUMME**, nicht der Mittelwert — Stumpfnaht
   t1+t2, Kehlnaht t1+t2+t3, Kreuzstoß vier. Das verbreitete ½·(t1+t2) stammt
   aus der **australischen AS 3992** und ist für EN 1011-2 falsch. Zweifach
   belegt. Es liefert zu niedrige Vorwärmtemperaturen, also auf der
   **unsicheren** Seite — deshalb steht die Warnung im Quelltext.
2. Die **CEV-Grenzwerte für S420, S460 und S690** liegen jetzt vor, teils nur
   aus einer Quelle. Verwendet werden nur die doppelt belegten; der Rest
   bleibt benannte Lücke.

**AUSDRÜCKLICH DRAUSSEN:** Methode A · AWS D1.1 Annex B · **Spannungsarmglühen**
(Haltezeit und Ofenführung sind Fertigungsanweisung, nicht Bemessung — das ist
die Grenze zur Qualitätssicherung, die schon bei N5d getragen hat).

---

**N9a — was geliefert wurde:**

**Erstens der Wächter für die Modulkennungen** (3.6, Sektion **S43**). Er kam
bewusst zuerst, damit alles Folgende schon darunter gebaut wird. **Fünf
Kennungen wurden korrigiert**, die stillschweigend alte Stände meldeten.

**Zweitens `thermik.js`** — DOM-frei, hängt an nichts. Kohlenstoffäquivalente
CET, CEV und Pcm · Vorwärmung nach Methode B in **zwei zulässigen Fassungen**
(Norm 697/−328 als Voreinstellung, SEW 700/−330 wählbar) · kombinierte Dicke ·
Wärmeeinbringen mit den Wirkungsgraden nach EN 1011-1 · t8/5 zwei- und
dreidimensional samt Übergangsdicke · die Umkehrung aufs Zielfenster.

**DREI PUBLIZIERTE ANKER, und einer war lehrreich:**

| Anker | publiziert | unser Wert |
|---|---|---|
| t8/5 dreidimensional | 5,3 s | **5,29 s** |
| t8/5 zweidimensional | 17,8 s | **17,76 s** |
| Vorwärmung Methode B | 155 °C | **162,83 °C** |

Der dritte sieht nach Abweichung aus und ist keine: **die 155 °C sind eine
Diagrammablesung**, keine Formelauswertung. Die Quelle rechnet selbst mit der
SEW-Fassung nach und kommt auf „rund 162 °C", was sie als im ±10-%-Band
übereinstimmend bezeichnet. **Unsere SEW-Fassung liefert 161,94 °C** — die
Kontrollrechnung der Quelle auf 0,1 °C getroffen. Wieder die Regel aus 9.2:
erst die Quelle verstehen, dann vergleichen.

**Die Gegenprobe hat einen echten Denkfehler gefunden.** Die Auslegung löste
zunächst **eine** Ableitungsart auf, während die Vorwärtsrechnung den
**größeren** der beiden Werte nimmt — der Vorschlag traf das Zielfenster
damit nicht (9,3 s statt der geforderten 8,0 s). Richtig ist, **beide** Arten
aufzulösen und das kleinere Q zu nehmen. Die Assertion prüft jetzt beide
Richtungen gegeneinander, nicht die Formel gegen sich selbst.

**Basislinie 1825 → 1939 Assertions · Smokes 662/663 → 663/664.** Neue
Sektionen **S43** (Kennungswächter) und **S44** (Wärmeführung). `thermik.js`
hängt in beiden HTMLs — die Versionszeile zeigt **17 Module**.

**Erwarteter Beleg am Handy:** „Programmstand **N9a** · Plan **2.47** ·
**17 Module**" mit `thermik 0.1.0-N9a` und `ui 0.10.1`. Und die fünf
korrigierten Kennungen sind sichtbar: `solver 0.2.0-N7`, `rechenweg 0.2.0-N7`,
`validate 0.2.0-N8a`, `assistent 0.2.0-N8b`, `kern 0.2.0-N9a`. Sonst ist
nichts zu sehen — das Panel kommt mit N9b.

---

#### 5.1-6a · Das t8/5-Zielfenster — **ENTSCHIEDEN 2026-08-05, zu bauen in N9b**

**Dieters Vorgabe:** Es muss eine **Vorbelegung** geben, damit ein Laie
weiterkommt — und der Anwender muss sie **per Haken überschreiben** können.
Also dieselbe Mechanik wie bei γ_M2, β_w und ν: Tabellenwert vorbelegt und
gesperrt, „eigener Wert" schaltet frei. Die Wahl des Fensters hat Dieter mir
überlassen.

**Die Datenlage** (Recherche R5, Abschnitt 3.5):

| Fenster | Gilt für | Belege |
|---|---|---|
| 5–20 s | Feinkornbaustähle allgemein | TÜV SÜD — **eine** Quelle |
| 10–25 s | Feinkornbaustähle, N-/QL-Güten | Killing 2022 **und** VdTÜV Wbl. 257 |
| enger, herstellerspezifisch | vergütete hochfeste (Q/QL, S690) | TÜV SÜD, **ohne Zahlen** |

**ENTSCHIEDEN: Vorbelegung 10–20 s** — der **Überschneidungsbereich** beider
veröffentlichter Empfehlungen. Das ist keine erfundene Zahl, sondern der
Bereich, in dem **beide** Fenster zugleich erfüllt sind; er ist an beiden
Enden die strengere Grenze und warnt damit eher zu früh als zu spät. Der
Hilfetext nennt **beide Quellfenster**, damit ein Anwender mit abweichender
Vorgabe versteht, warum sein Wert daneben liegt, und ihn setzen kann.

**ZWEI FÄLLE BEKOMMEN AUSDRÜCKLICH KEINE VORBELEGUNG:**

1. **Unlegierte Baustähle** (S235, S275, S355). Unsere Quellen führen dort
   kein Zeitfenster — und das ist kein Versehen der Recherche: t8/5 ist bei
   diesen Stählen praktisch kein Thema, die Aufhärtungsneigung ist gering.
   Das Programm rechnet und zeigt den Wert, lässt die Ampel aber **grau** und
   sagt, dass kein belegtes Fenster vorliegt. **Ein erfundenes Fenster wäre
   bei den häufigsten Stählen die auffälligste Lüge.**
2. **Vergütete hochfeste Güten** (S690Q und darüber). Die Quellen sagen
   ausdrücklich „engeres Fenster, konkrete Zahlen herstellerspezifisch".
   Verwiesen wird auf die Herstellerangabe — genau dafür ist der Haken da.

Die Vorbelegung greift damit dort, wo sie belegt ist: bei den **Feinkorn- und
höherfesten Güten**, für die das Zeitfenster überhaupt gedacht ist.

**Was daraus für N9b folgt:** ein Feld für die untere und eines für die obere
Fenstergrenze, beide `ueberschreibbar`, beide nur bei den Stahlgruppen
vorbelegt, für die es Belege gibt. Die Ampel kennt drei Zustände — innerhalb,
außerhalb, **kein Fenster belegt**. Der Rechenweg nennt die Quelle des
verwendeten Fensters.

---

#### 5.1-6b · N9b — **GEBAUT UND GELIEFERT 2026-08-05, Abnahme offen**

**Damit ist Baustein N9 vollständig.** Geliefert wurden drei Dinge:

**1 · Das Endkrater-Ankreuzfeld** (2.2b). Es wurde eine **Auswahlgruppe**
statt eines Hakens — damit greift die vorhandene Mechanik von selbst:
Filterung, Bereinigung, Dreisprachigkeit, Laien-ⓘ und der Assistenten-Schritt.
**Voreinstellung bleibt „Abziehen"**; nur ein ausdrückliches „ohne" schaltet
ab, jede andere Lage lässt ihn an. **Die unsichere Seite kann nicht durch
Weglassen entstehen.** Gemessen: bei reinem Zug rund 8 %, mit Biegung über
12 % — weil das Widerstandsmoment mit dem Quadrat der Länge geht. Er hat eine
eigene **Skizze** bekommen: zwei Bilder in der Draufsicht, mit Abzug sind die
Enden abgesetzt.

**2 · Das Wärmeführungs-Panel.** Achtzehn neue Felder im eigenen Bereich
*Vorwärmung & t8/5*: die acht Analysewerte, CET (überschreibbar), HD,
Schweißparameter U/I/v, Arbeitstemperatur, das Zielfenster und die
Nahtfaktoren. Sie sind **nur Pflicht, wenn der Bereich zugeschaltet ist** —
sonst stünde ein Laie vor einer Schmelzenanalyse, die er gar nicht braucht.

**3 · Die eigene Ergebniskarte** mit eigener Ampel und eigenem Rechenweg in
sechs Schritten. Sie zeigt die Vorwärmtemperatur mit ihren **vier
Teilbeträgen**, die Abkühlzeit in beiden Ableitungsarten und das Zielfenster.

**DREI ENTSCHEIDUNGEN, DIE BEIM BAUEN FIELEN:**

**Gerechnet wird mit der tatsächlichen Arbeitstemperatur.** Ohne eigene
Angabe ist das die **erforderliche Vorwärmtemperatur**, nicht 20 °C. Mit
Raumtemperatur zu rechnen, während das Bauteil auf 155 °C vorgewärmt wird,
wäre schlicht falsch — und ergäbe eine zu kurze Abkühlzeit, also die
unsichere Seite.

**Die Wärmeführung läuft unabhängig vom Festigkeitsnachweis** und deshalb
**vor** ihm. Der DOM-Smoke hat das gefunden: stand sie hinter dem Abbruch,
blieb bei unvollständigem Formular ihr **voriges** Ergebnis stehen — eine
alte Zahl, die aussieht wie eine neue. Entsprechend räumt `leeren()` die
Karte weg, das Abräumen des Nachweises aber **nicht**.

**EN 1011-2 gilt für ferritische Stähle.** Für nichtrostende Stähle und
Aluminium wird **nicht gerechnet**, sondern gesagt, dass EN 1011-3 und
EN 1011-4 gelten. Dieselbe Haltung wie beim Geltungsbereich der Methode B.

**Das Zielfenster** ist wie in 5.1-6a entschieden umgesetzt: **10–20 s** für
S420 und S460 (die es nur als Feinkornstähle gibt), **graue Ampel** für S235,
S275 und S355, und ein eigenes Fenster schaltet die Bewertung überall frei.

**Der Assistent bringt seinen Schritt mit** (Prozessregel 3.3) — und der
**Zusatzschritt steht jetzt vor den Feldern**. Vorher wäre die Wärmeführung
schon vorbeigezogen, bevor man sie einschalten konnte.

**Basislinie 1939 → 2005 Assertions · Smokes 663/664 → 748/749.** Neue
Sektion **S45**. **Acht Module haben eine neue Kennung** — der Wächter aus
N9a hat jede einzelne eingefordert.

**Erwarteter Beleg am Handy:** Im Bereich *Geometrie* steht die neue Auswahl
**Endkraterabzug**; auf „Volle Länge ansetzen" umgestellt sinkt die
Ausnutzung sichtbar. Unter *Zusatzbereiche* schaltet **Vorwärmung & t8/5**
einen neuen Aufklappbereich frei; nach dem Rechnen steht eine **zweite
Ergebniskarte** da.

---

#### 5.1-6c · N9c — **GEBAUT UND GELIEFERT 2026-08-05, Abnahme offen**

**Dieters Anstoß:** Die Beispiele sollten die Wärmeführung mitbringen, damit
ein Anwender sie nicht aus dem Nichts befüllen muss. Der Anlass war seine
eigene Erfahrung — er hatte den Bereich ohne Beispiel ausprobiert und eine
rote Meldung bekommen.

**Diese Meldung war schlecht gemacht und ist repariert.** Wer nur den
Kohlenstoff einträgt, bekam ein CET von 0,18 und die Auskunft „außerhalb des
Geltungsbereichs". Das beschuldigt den Stahl, obwohl nur das **Mangan**
fehlte — nach dem Kohlenstoff der größte Beitrag. Jetzt sagt das Programm,
dass die Analyse unvollständig ist.

**Der Katalog wächst von zwölf auf vierzehn**, sieben je Welt. Alle vierzehn
tragen jetzt Analyse, Wasserstoffgehalt und Schweißparameter — bei den
zwölf alten **ohne** den Bereich einzuschalten, damit sich am
Festigkeitsnachweis nichts ändert. Die gemessenen Ausnutzungen aus N7 sind
unverändert geblieben; das ist der Beleg, dass die Wärmeführung nichts
zurückspeist.

**Die zwei neuen schließen drei Rechenpfade**, die kein Beispiel je berührt
hatte:

| | `winkel_v` (Welt A) | `kragarm_b` (Welt B) |
|---|---|---|
| neu | **vereinfachtes Verfahren**, **Winkelprofil** | **geometrische Lasteingabe** |
| Werkstoff | S420 | S460 |
| Ausnutzung | 0,756 grün | 0,707 grün |
| t8/5 | 13,3 s **grün** | 13,2 s **grün** |

**Sie sind die einzigen mit Feinkornstahl** — und damit die einzigen, bei
denen die Wärmeführungs-Ampel überhaupt grün werden kann. Bei den zwölf
übrigen bleibt sie **grau**, weil unsere Quellen für unlegierte Baustähle
kein Zeitfenster führen. Das ist keine Schwäche des Katalogs, sondern die
zutreffende Auskunft.

**DIE GEOMETRISCHE LASTEINGABE WAR TOT — seit N3.** Die Umrechnung
`schnittgroessen(F, e, richtung)` stand in `solver.js`, war exportiert und
wurde **nirgends aufgerufen**. Wer im Formular „Kraft und Hebelarm" wählte,
bekam `msg_sv_keine_last`. Gefunden auf demselben Weg wie die Auslegung und
die Stumpfnaht in N7: **beim Versuch, ein Beispiel für einen Pfad zu bauen,
den kein Beispiel berührt.** Das dritte Mal, dass dieses Muster etwas findet.

Repariert wurde mehr als der Aufruf: Die Funktion kennt drei Kraftrichtungen,
aber es gab **keine Auswahlgruppe** dafür — der Anwender konnte gar nicht
sagen, wohin seine Kraft zeigt. Neu ist deshalb die Gruppe
**`kraftrichtung`** (längs, quer, Torsion), **bewusst ohne Voreinstellung**:
Die Richtung ändert das Ergebnis grundlegend, und eine geratene Richtung wäre
schlimmer als eine Rückfrage. Sie hat eine eigene Skizze — derselbe Kragarm
dreimal, nur der Pfeil dreht sich.

**Ein Folgefund im Rechenweg:** Seine Probe verglich die Schnittgrößen gegen
die **eingegebenen** Felder — bei geometrischer Eingabe sind die leer, also
schlug sie fehl. Jetzt prüft sie gegen das, **womit gerechnet wurde**;
dasselbe Prinzip wie beim Nahtbild in N7.

**Neu: das Feld `d_komb`.** Der Bolzen hat im statischen Modell keine
Blechdicke — die Grundplatte kommt dort nicht vor. Für die Wärmeführung lässt
sich die kombinierte Dicke deshalb direkt vorgeben. Das ist kein Sonderfall:
Auch beim T-Stoß auf ein dickes Fundament steht das Gegenstück nicht im
Modell.

**Basislinie 2005 → 2107 Assertions · Smokes 748/749 → 762/763.**

**DREI NACHTRÄGE AUS DEM ERSTEN TEST (2026-08-05, Dieters Bildschirmfoto).**
Er lud `winkel_v` — und der Bereich blieb leer. Das Foto zeigte zweierlei:
die Freischalt-Haken alle offen, der Bereich *Vorwärmung & t8/5* aber
trotzdem als offener Kasten sichtbar.
1. **Die Freischalt-Haken sind keine Auswahlgruppen** und wurden von
   `formularSetzen()` schlicht übergangen. `thermik_aktiv: true` im Beispiel
   hatte deshalb keine Wirkung. Sie werden jetzt **vor** den Gruppen gesetzt,
   weil davon abhängt, welche Felder überhaupt Pflicht sind.
2. **Ein Bereich ohne einen einzigen sichtbaren Inhalt wird ausgeblendet.**
   Vorher stand die Wärmeführung als leerer Kasten mit Erklärung da, auch
   wenn sie gar nicht zugeschaltet war — das sah aus wie ein leerer Bereich
   statt wie ein nicht gewählter.
3. **Den zwölf alten Beispielen fehlte das Schweißverfahren.** Ohne das gibt
   es keinen Wirkungsgrad und damit kein Wärmeeinbringen. Alle vierzehn
   führen jetzt MAG — das geläufigste Verfahren (Dieter, 2026-08-05).

**Erwarteter Beleg am Handy:** **Vierzehn Beispiele** in der Liste. `winkel_v`
und `kragarm_b` bringen die Wärmeführung **eingeschaltet** mit und zeigen eine
grüne t8/5-Ampel. Bei `kragarm_b` steht im Bereich *Lasten* die neue Auswahl
**Richtung der Kraft**, und eingegeben werden **Kraft und Hebelarm** statt
Schnittgrößen.

---

#### 5.1-6d · N9d — **ABGENOMMEN 2026-08-05**

> ✅ **Von Dieter am Handy geprüft und ABGENOMMEN — ohne Nacharbeit.** Er hat
> die Fälle im Programm durchgespielt, wie zuvor besprochen. Damit ist
> **Baustein N9 vollständig.**

**Dieters Anstoß:** intern Probefälle durchspielen, um Fehler aufzudecken —
und Eingabefelder vorbelegen, damit ein unerfahrener Anwender nicht
überfordert ist.

**Beides umgesetzt, eines davon geschärft.** Ein Probefall, den man einmal
durchspielt und wegwirft, findet den Fehler *einmal*; derselbe Fall als
Assertion findet ihn *für immer*. Verworfen wird deshalb höchstens der
Katalog-Eintrag, nie die Prüfung.

**DER STREIFZUG (S46).** Er betritt **jede Option jeder rechenwirksamen
Gruppe** mindestens einmal — 87 Fälle — und verlangt genau eine von zwei
Antworten: es rechnet, oder es scheitert mit einem **benannten** Grund. Was
er nicht duldet, ist das Dritte: eine Ausnahme, ein leeres Ergebnis, ein
Fehlercode ohne Text. Genau dort saßen alle bisherigen Funde.

| | |
|---|---|
| gerechnet | 64 |
| benannt abgelehnt | 4 |
| unvollständige Auswahl (benannt) | 19 |

Er füllt fehlende Auswahlen selbst mit der ersten zulässigen Option auf —
sonst bliebe er an Unvollständigkeit hängen und käme nie bis zur Rechnung.

**UND ER HAT BEIM ERSTEN LAUF ETWAS GEFUNDEN.** Bei
`rechenrichtung = auslegung` gingen die Rechenproben nicht auf: Das Nahtbild
wurde mit dem **erforderlichen** a-Maß gebaut, Fläche und Ausnutzung aber mit
dem **gewählten**. Die Probe „Fläche = Summe a·l" musste scheitern.

Ursache war die Außeniteration aus N7 — sie konvergiert auf `a_erf`, aber
gebaut wird `a_gewaehlt`, und dessen Naht ist wegen des Endkraterabzugs ein
Stück kürzer. **Jetzt läuft ein letzter Durchgang mit dem gewählten a-Maß**,
damit Nahtbild, Fläche und Ausnutzung dieselbe Naht beschreiben — die, die
entsteht. Das erforderliche a bleibt der konvergierte Wert; es ist die
Anforderung, nicht die Ausführung.

**Eine gemessene Zahl hat sich dadurch geändert:** `konsole` liefert jetzt
760 mm und η 0,842 statt 764 mm und 0,837. Das ist die **Korrektur**, nicht
die Regression — 764 mm beschrieb eine Naht mit a = 2,504 mm, die niemand
baut.

**Ein Folgefund:** Die Rechenprobe `a_erf = a_bezug · η` gilt nur, solange die
Geometrie **nicht selbst** am a-Maß hängt. Mit Endkraterabzug wurde a_erf
durch wiederholtes Durchrechnen gefunden, nicht durch Multiplikation — dort
schweigt die Probe jetzt und sagt, warum, statt eine Beziehung zu behaupten,
die nicht mehr besteht.

**DIE ANHALTSWERTE (S47).** Neu ist eine Unterscheidung, die es vorher nicht
gab:

| | Herkunft | Kennzeichnung |
|---|---|---|
| **Tabellenwert** | Norm (γ_M2, β_w, ν, S) | gesperrt, „eigener Wert"-Haken |
| **Anhaltswert** | Praxis (U, I, v) | dasselbe **plus sichtbarer Hinweis** |

Schweißspannung, Strom und Geschwindigkeit stehen in keiner Norm — die Praxis
kennt nur Bereiche. Sie werden trotzdem vorbelegt (MAG in mittlerer Lage),
tragen aber `anhalt: true` und einen eigenen Hinweis: *Anhaltswert aus der
Praxis — keine Norm.* **Ein Erfahrungswert, der aussieht wie eine Vorschrift,
wäre eine stille Behauptung, und die fällt niemandem auf.**

**Die Probe dazu:** Mit den Vorbelegungen allein rechnet die Wärmeführung
durch — ein Anwender muss nur noch die Analyse eintragen, und das vorbelegte
Wärmeeinbringen liegt im Geltungsbereich der Methode B.

**Dazu die Quelle unter dem Zielfenster.** Vorher stand dort eine Überschrift
ohne Inhalt (Dieters Beobachtung). Jetzt steht darunter, woher die Grenzen
kommen — oder dass es eine eigene Vorgabe ist.

**Basislinie 2107 → 2942 Assertions · Smokes 784/785 → 801/802.** Der Sprung
kommt fast ganz vom Streifzug.

---

### 5.1a Auftrag für N5c-1 — „Es rechnet" *(ERLEDIGT 2026-07-28, hier nur noch als Begründung)*

> **Dieser Auftrag ist entschieden, nicht mehr Vorschlag.** Dieter hat die offenen Fragen
> am 2026-07-27 an Claude gegeben; die Entscheidungen stehen unten mit Begründung und mit
> nachgerechneten Zahlen. Der nächste Chat kann direkt bauen.

> **N5b ist abgenommen — N5c kann beginnen, sobald der Umfang steht.**
> **Erst bestätigen, dann bauen** (Regel aus 5.2): Der Umfang unten ist der Vorschlag;
> Dieter sagt ja oder korrigiert ihn, **bevor** das erste Codezeichen entsteht.

Alles, was N5c braucht, ist fertig: `solver.js` rechnet (4.8), `rechenweg.js` beschriftet
(4.9), `schaubild.js` zeichnet (4.7) — alle drei liefern **Codes statt Texte**.
**N5c rechnet nichts selbst — N5c rendert**, und zwar aus **einem** Aufruf:
`DTNRechenweg.ausErgebnis(ergebnis, eingabe)` (einmal rechnen, dann beschriften).

**ENTSCHIEDEN am 2026-07-27 (Dieter hat die Entscheidung an Claude gegeben) —
FELDBEREINIGUNG, erster Schritt von N5c-1. Alles unten ist nachgemessen, nicht vermutet.**

Beim Vorbereiten von N5c wurde die Rechenkette Feld fuer Feld gegen das Formular gehalten.
Ergebnis: **das Formular verlangt drei Angaben, die so nicht gebraucht werden.**

| Feld | Wer liest es wirklich | Formular verlangt bisher |
|---|---|---|
| `l` | **niemand fuer die Rechnung.** Die Nahtlaenge entsteht immer aus der Profilgeometrie (`Naht.laenge(seg)`) | Pflicht bei allen 7 Profilen |
| `t1` | Geometriemass **nur** bei Blech, Rechteckrohr, Rundrohr, Winkel | Pflicht bei allen 7 Profilen |
| `t2` | nur als **Ersatz** fuer die massgebende Dicke | Pflicht bei allen 7 Profilen |

**Der entscheidende Befund:** `profil.js` liefert die **Dicke je Segment** mit
(`info[i].t` — Rechteckrohr 6 mm, I-Profil-Steg 9 mm, Blech 10 mm), und `solver.js` nutzt
genau die; erst wenn sie fehlt, greift er auf `t1`/`t2` zurueck.
**Die Kontrolle a <= 0,7 x t laeuft also laengst aus der Profilgeometrie.**
`t1`/`t2` sind nur noch Rueckfallebene fuer den Weg, den das Formular gar nicht geht
(Segmente direkt uebergeben). Ebenso ist `msg_sv_dicke_fehlt` zwar deklariert, wird aber
**nirgends geworfen**.

**Beschlossene Aenderungen — bewusst klein gehalten:**
1. **`l` entfaellt aus dem Feldschema** (29 → 28 Felder). Es speiste in Stufe 2 von
   `validate.js` nur `msg_leff_min` und `msg_l_lang` — beides prueft der Solver bereits
   **je Segment aus der echten Geometrie**, mit derselben Formel `l_eff,min = max(6a, 30)`
   (`msg_sv_l_eff_zu_kurz`, `msg_sv_lange_naht`). Zwei Quellen fuer dieselbe Pruefung sind
   genau das, was 3.4 und 4.2 verhindern sollen — und die Geometrieversion ist die
   genauere. **Die beiden Pruefungen in `validate.js` Stufe 2 entfallen mit.**
2. **`t1` wird profilabhaengig Pflicht:** `pflicht_wenn: { profil: ['blech',
   'rohr_rechteck', 'rohr_rund', 'winkel'] }`. Bei I- und U-Profil uebernehmen `tw`/`tf`
   diese Rolle, bei Vollrund gibt es keine Wanddicke.
3. **`t2` bleibt, wird aber freiwillig** und bedeutet klar *die Dicke des angeschlossenen
   Bauteils*. Begruendung: a <= 0,7 x t gilt fuer die **kleinste verbundene** Dicke; das
   Profil kennt seine eigene, nicht die des Gegenstuecks. **Der Laien-ⓘ muss ehrlich sagen:
   ohne diese Angabe wird nur die Profildicke herangezogen.**
4. **`solver.js` bleibt unangetastet** — er macht es bereits richtig.
5. **Eine Kleinigkeit muss mit:** `profil.js` meldet `msg_endkrater_zu_lang` mit
   `feld: 'l'` (zweimal, Zeilen 457 und 459). Ohne das Feld zeigt die Meldung ins Leere —
   sie gehoert auf **`a`**, denn der Endkraterabzug haengt am a-Mass.
6. **Nachziehen:** `ui.js` ZUORDNUNG (`l` aus dem Bereich *geometrie*), die Laien-ⓘ zu
   `t1`/`t2`, die Textschluessel `fld_l`/`msg_leff_min`/`msg_l_lang` (pruefen, ob sie noch
   gebraucht werden), Harness und beide DOM-Smokes. Die Feldzahl steht ueberall als
   `SCHEMA.length` und nicht als feste 29 — das erspart Sucharbeit.

**Warum nicht der andere Weg (`l` behalten und verdrahten):** Das Rechenmodell ist eine
**Nahtgruppe in der Fuegeebene**, umgeklappt (Plan 2.3). Ihre Abmessungen *sind* die
Profilmasse; eine davon unabhaengige Laenge gibt es in diesem Modell nicht. Sie einzubauen
hiesse, ein Konzept zu erfinden, das die Quellen nicht hergeben. **Bewusst in Kauf
genommen:** eine Naht, die kuerzer ist als das Bauteil, wird abgebildet, indem man das
nahtrelevante Mass eingibt (Blech b = 120 statt 200). Die Rechnung stimmt dann, nur die
Zeichnung zeigt das kleinere Bauteil. **Das gehoert ehrlich in die Liste 2.4** und in den
Laien-ⓘ.

**BESCHLOSSEN — drei Beispiele hinter „Beispiel laden", als Schritt 2 von N5c-1**
*(Anregung von Dieter, 2026-07-27; entschieden am selben Tag)*
Der Knopf `presetSel` steht seit N5a da und meldet „folgt in N7". Die Beispiele kommen
**nicht vor N5c-1, sondern darin** — die Begründung ist praktisch und geprüft:
- Ein Beispiel ist nichts als *Auswahlzustand + Feldwerte*. Genau diese Übersetzung ins
  Format des Solvers entsteht **in N5c-1**. Vorher gebaut, müsste man sie zweimal schreiben.
- Ob ein Beispiel *fachlich* taugt, sieht man erst, wenn ein Ergebnis erscheint — also
  ebenfalls erst in N5c-1. (Genau daran sind zwei erste Entwürfe gescheitert, siehe unten.)
- Danach zahlt es sich sofort aus: **jeder weitere Handy-Test ist zwei Antipper statt rund
  siebzehn Eingaben.** Für N5c selbst, für N5d, N6b und N8.
- Es prüft genau die Wege, die von Hand am mühsamsten sind: umlaufende Naht am Hohlprofil
  und ein Träger mit Flanschen **und** Steg (a_steg/a_flansch, r_ecke, Umfangsrechnung).

Konkret vorgeschlagen. **Diese Zahlen sind vollständig durchgerechnet** — durch
`profil.baue()` → `solver.rechne()` → `rechenweg.ausErgebnis()`, jeweils **ohne jede
Warnung**, grün und erfüllt, mit bewusst gestaffelter Ausnutzung:

| Beispiel | Auswahl | Maße | Last | Ergebnis (nachgerechnet) |
|---|---|---|---|---|
| **Vierkantrohr** | Welt A · Nachweis · S235 · T-Stoß · umlaufende Kehlnaht · richtungsbezogen · Hohlprofil rechteckig · rundum | b 120 · h 80 · t 6 · r 9 · **a 4** | N = 120 kN | 4 Segmente · **328 mm** · η = 0,359 · grün |
| **H-Träger** | Welt A · Nachweis · S355 · T-Stoß · Doppelkehlnaht · richtungsbezogen · I-Profil · **nur Steg** | b 200 · h 200 · t_w 9 · t_f 15 (HEB 200) · **a 4** | N = 250 kN | 2 Segmente · **324 mm** · η = 0,626 · grün |
| **Blech** | Welt A · Nachweis · S235 · Überlappstoß · Doppelkehlnaht · richtungsbezogen · Blech · Flanken | b 80 · t 10 · **a 5** | N = 150 kN | 2 Segmente · **140 mm** · η = 0,842 · grün |

**Zwei Fallen, die beim Nachrechnen aufgeflogen sind — beide bitte beim Bauen beachten:**
1. **a ≤ 0,7 · t_min und zugleich a ≥ 3 mm** engt stärker ein, als es aussieht. Eine
   Wanddicke von 4 mm lässt gar keine regelkonforme Kehlnaht zu (a_max 2,8 mm liegt unter
   a_min 3 mm). Deshalb im Beispiel t = 6 mm statt 4 mm.
2. **Ein I-Profil, das um die Flansche herum geschweißt wird, warnt IMMER** — die
   Flanschkante ist nur `t_f` lang (hier 15 mm) und bleibt damit unter der wirksamen
   Mindestlänge von 30 mm nach EN 1993-1-8. Das ist kein Fehler, sondern die Norm.
   Deshalb im Beispiel **nur der Steg**. Der Fall „Flansche + Steg" eignet sich später
   als eigenes **Lehrbeispiel**, das zeigt, dass das Programm ehrlich warnt.

**Der große Beispielkatalog bleibt N7** (Benennung, Sortierung, Dreisprachigkeit, weitere
Fälle). Hier geht es nur um die drei, die N5c-1 selbst prüfbar machen.

**N5c WIRD GETEILT** — der Umfang unten ist zu gross fuer eine Etappe (Regel 5c: lieber
teilen als hetzen). Die Nahtstelle liegt dort, wo die Rechnung fertig ist und nur noch die
Darstellung folgt.

**N5c-1 — „Es rechnet“** *(naechster Bau)*
1. **Feldbereinigung** (oben beschlossen) — zuerst, weil alles Weitere darauf aufsetzt.
2. **Drei Beispiele** hinter „Beispiel laden“ (Tabelle unten).
3. **Uebersetzung Formular → Rechenkern:** aus den flachen Feldwerten das verschachtelte
   `profil_eingabe = { profil, kanten, masse:{...}, a }` bauen. **Das ist das Kernstueck.**
4. **„Berechnen“ rechnet wirklich:** `solver.rechne()` nach der bestandenen Pruefung.
5. **Ergebnis-Kacheln** (Ausnutzung η, massgebender Punkt, gewaehltes a) mit **Ampel**
   aus `ergebnis.ampel` und `ergebnis.erfuellt`.
**Am Handy pruefbar:** Beispiel antippen, „Berechnen“, eine Zahl und eine Ampel sehen.

**DREI STOLPERSTELLEN IN SCHRITT 3 — nachgemessen am 2026-07-27, bitte vorher lesen:**

**(a) Das z-Mass muss in der Uebersetzung mitkommen — und ui.js darf es nicht rechnen.**
`validate.js` leitet das a-Mass aus dem z-Mass ab (`a = z / √2`, Zeile 199) — aber **nur
fuer seine eigenen Pruefungen**. `profil.baue()` verlangt `e.a` und kennt `z` nicht. Wer
also nur das z-Mass eintraegt, kommt durch die Pruefung und scheitert danach an
`msg_profil_a_fehlt`. **Ohne Gegenmassnahme ist das ein Fehler, den kein Anwender versteht.**
Loesung, die die Regeln einhaelt: `validate.js` bekommt eine Funktion, die die geprueften
Werte **normiert** zurueckgibt (Zahlen als Zahlen, `a` aus `z` abgeleitet). `ui.js` setzt
daraus nur noch das Objekt zusammen — **ohne einen einzigen Rechenschritt**, damit die
Assertion „kein `Math.` in ui.js“ (S29/S30) bestehen bleibt. Die Umrechnung gehoert
ohnehin dorthin, wo sie schon steht.

**(b) `a_steg` und `a_flansch` muessen durchgereicht werden.**
`profil.baue()` nimmt beide entgegen und faellt sonst auf `a` zurueck (Zeile 396). Beim
H-Traeger-Beispiel — Naht **nur am Steg** — ist das der Unterschied zwischen richtig und
falsch. In `profil_eingabe` gehoeren sie neben `a`.

**(c) Die gesperrten Felder bleiben sonst fuer immer leer — das sieht aus wie ein Fehler.**
`betaW`, `nu`, `Re`, `a_steg`, `a_flansch` starten leer und gesperrt, weil `ui.js`
`daten.js` nicht kennen darf (4.10b). Nach dem Rechnen liefert `ergebnis.widerstand` aber
**genau diese Werte samt Herkunft** — gemessen am Blech-Beispiel:
`betaW 0,8 · fu 360 N/mm² · gammaM2 1,25 · quelle_betaW „tabelle“ · quelle_fu „tabelle“`.
**Vorschlag: nach dem Rechnen die gesperrten Felder mit den tatsaechlich verwendeten
Werten fuellen und die Herkunft dazuschreiben.** Das kostet fast nichts, schliesst eine
Luecke, die sonst wie ein Programmfehler wirkt, und ist genau die Ehrlichkeit, die der
Plan verlangt: **zeigen, womit gerechnet wurde.** Der „eigener Wert“-Haken bleibt davon
unberuehrt — wer ihn setzt, behaelt seinen Wert.

**N5c-2 — „Es erklaert sich“**
6. **Rechenweg vollstaendig**: `DTNRechenweg.ausErgebnis(ergebnis, eingabe)` liefert
   10 Abschnitte (gemessen) — Formel im Klartext, eingesetzte Zahlen, Quelle je Schritt.
7. **Nahtbild-Grafik** aus `schaubild.js` in die vorhandene Karte, Legende dreisprachig.
8. **Die zwei Haekchenarten optisch getrennt** (4.9, bindend seit N4): Rechenprobe
   (`haken`, `false` = Programmfehler) und Nachweis (`erfuellt`, `false` = die Naht traegt
   so nicht). Die Klassen `rw-haken` und `rw-nachweis` stehen bereit.
9. **Liste 2.4 sichtbar**, dazu Warnungen und ehrliche Luecken (`nicht_geprueft`).
10. **Zahlformat je Sprache** ueber `rechenweg.rendere(rw, sprache)` — DE/PT Komma, EN Punkt.
**Am Handy pruefbar:** ein vollstaendiger Nachweis von der Eingabe bis zur Quellenangabe.

**Was der Solver zurueckgibt** (gemessen, erspart dem naechsten Chat das Nachsehen):
`ok · welt · rechenrichtung · verfahren · modell · nahtart · nahttyp · umklappen ·
a_abzug · werkstoff · widerstand · schnittgroessen · nahtbild · punkte · massgebend ·
nachweise · **eta** · **ampel** · **erfuellt** · auslegung · grenzen · nicht_geprueft ·
fehler · warnungen · hinweise`

**Abzuliefern wie immer:** geänderte Module, `<script src>` an der richtigen Stelle in
beiden HTMLs, DOM-Smokes erweitert, Harness um eine Sektion **S31** (N5c-1); N5c-2 bekommt
dann **S32**.
**Recherche:** nicht nötig.

**Später (nicht V1):** **Normprofil-Katalog** (IPE/HEA/HEB/UPE/UPN/RHS/Rohr, 2.2b Stufe 2),
unterbrochene Nähte, Loch-/Schlitznähte, weitere Kerbfälle, FKM-Richtlinie, Kranbau-Regelwerke,
AWS/US-Normen, EN 1993-1-8:2024 (2. Generation, β_w,mod — Werte noch nicht belegbar).

### 5.1b Was N5a und N5b geliefert haben *(abgeschlossen, hier nur noch zum Nachschlagen)*

**N5a (abgenommen 2026-07-27):**
- **Beide HTMLs vollständig neu**, ohne die Zwischen-Statusseite aus N1–N4: Kopfzeile mit
  Marke, Untertitel und Lizenzzeile, Sprachumschalter DE/EN/PT mit Flaggen-SVG,
  Theme-Knopf, Info-ⓘ mit Impressum, Subbar und **Aktionsleiste oben**.
- **`ui.js` neu**: Sprache, Theme, Aufklappbereiche, Leeren, Info-Dialog, Editionsweiche.
- **Startdarstellung immer dunkel** (3.1) — schon im `<html>`-Tag.
- **`style.css`** auf vollen Umfang; **leeres Formulargerüst** mit acht Bereichen.

**N5b (abgenommen 2026-07-27):**
- **Das Formular wird aus `optionen.js`/`validate.js` erzeugt** — 18 Auswahlgruppen und
  alle 29 Felder, festes Id-Schema, keine zweite Liste (Schnittstelle in **4.10b**).
- **DIE eine Filterfunktion verdrahtet** (3.4), samt der Brücke zwischen milder Anzeige
  und strenger Bereinigung.
- **„eigener Wert"-Haken** an den 9 überschreibbaren Werten, vorbelegt und gesperrt.
- **Laien-ⓘ an jeder Gruppe und jedem Feld** als eigener Dialog, dreisprachig.
- **Freischalt-Haken** der vier Zusatzbereiche, standardmäßig aus.
- **„Berechnen" prüft** und markiert fehlerhafte Felder; **„Leeren"** führt exakt in den
  Startzustand zurück.

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

### 8.1b Dateistand nach N6b *(Stand 2026-08-04)*

**N6b-Lieferung — 11 Dateien:** `symbol.js` (**NEU**), `daten.js`, `optionen.js`, `ui.js`,
`i18n_kern.js`, `i18n_hilfe.js`, `style.css`, beide HTMLs, `test_naht.js`,
`dom_smoke_voll.js` — dazu Plandatei und Historie.
**Unberührt:** `naht.js`, `profil.js`, `svglib.js`, `schaubild.js`, `solver.js`,
`rechenweg.js`, `validate.js`, `dom_smoke_test.js`. **`svglib.js` wurde benutzt, nicht
geändert** — die Bibliothek aus N2c trägt auch die Symbole.
**Beide HTMLs** binden jetzt **14 Module** ein (`symbol.js` vor `ui.js`); die Versionszeile
zeigt entsprechend 14. **Liste 2.4 ist von 14 auf 13 Punkte geschrumpft** — die
Nahtvorbereitung wurde **gefüllt, nicht umbenannt**.
`test_naht.js` **1135 Assertions** (S35 Katalog, S36 Zeichnen, S37 Anbindung) ·
`dom_smoke_voll.js` **537** · `dom_smoke_test.js` **538**.

---

### 8.1a Dateistand nach N5d — abgenommen *(Stand 2026-08-03)*

**Produktdateien (13 Module + style.css + 2 HTMLs):**
| Datei | Stand |
|---|---|
| `DT-ProfiSchweissnaht.html` | **N5d minimal** — zwei Zeilen im Info-Dialog: `infoVersion` und `infoModule` (3.6). Sonst Stand N5b |
| `DT-ProfiSchweissnaht_Test.html` | **N5d minimal, identisch** — Test-Edition, **durch Assertion verifiziert: Unterschied genau eine Zeile** |
| `ui.js` | **N5d erweitert** — Block „Ausführung & Dokumentation", Vorschlagsmechanik mit Herkunftszeile, Bereichshinweise, Anforderungszeile, Versionszeile aus den geladenen Modulen. `VERSION` `0.7.0`, `ETAPPE` `N5d`, neu `PLAN`. Schnittstelle in **4.10d**. Davor: **N5c stark erweitert** — dazu: Beispiele laden, Übersetzung anstoßen, „Berechnen" rechnet, Ergebnis-Kacheln mit Ampel, **Rechenweg (aufklappbar) und Nahtbild-Grafik**, Liste 2.4. Schnittstelle in **4.10 + 4.10b + 4.10c**. Ruft **genau drei** Module auf (`DTNSolver`, `DTNRechenweg`, `DTNSchaubild`), weiterhin ohne `Math.` und ohne eigene Rechnung |
| `daten.js` | **N5d erweitert** — `NICHT_GEPRUEFT` 10 → **14 Punkte** (die vier benannten Lücken aus 5.1-1). Sonst N1, keine Rechengröße berührt |
| `naht.js` | N2, unverändert — Schnittstelle in 4.5 |
| `profil.js` | **N5c-1 minimal geändert** — `msg_endkrater_zu_lang` zeigt auf Feld `a` statt auf das entfallene `l`; sonst N2b, Schnittstelle in 4.6 |
| `svglib.js` | N2c, unverändert — Schnittstelle in 4.7 |
| `schaubild.js` | N2c, unverändert — Schnittstelle in 4.7 |
| `solver.js` | **N5c-3 geändert** — `nahtzuege()` neu, Längenprüfung je Nahtzug, `grenzen.je_zug[]` / `n_zuege` / `mehrsegmentig` neu, Hinweiscode `msg_sv_l_eff_je_zug`. Sonst N3, Schnittstelle in 4.8 |
| `rechenweg.js` | **N5c-3 geändert** — Schritt `rw_s_l_eff` rechnet aus `je_zug` und ist eine **Warnung ohne Nachweis-Haken**. Sonst N4, Schnittstelle in 4.9 |
| `optionen.js` | **N5d erweitert** — `VORSCHLAEGE`, `vorschlag()`, `istVorschlagsZiel()` (EXC → Bewertungsgruppe, EN 1090-2). Davor N5c-1: 20 Gruppen, 89 Optionen, `BEISPIELE` (3) und `beispiel()` |
| `validate.js` | **N5c-1 geändert** — **28 Felder** (`l` entfallen), `t1` profilabhängig Pflicht, `t2` freiwillig, Längenprüfungen in den Solver verlegt; **neu `normiert()` und `rechenEingabe()`** |
| `i18n_kern.js` | **N5d erweitert** — vier `ng_*`-Lückentexte, fünf `ausf_*`-Texte, vier `uiVersion*`-Texte, alle dreisprachig; **`VERSION` `0.1.0-N1` nachgerüstet**. Davor: **N5c erweitert, N5c-3 nachgeschärft** — Beispielnamen, Ergebnis- und Rechenwegtexte, Quellenangaben, Klapptexte; `msg_sv_l_eff_zu_kurz` nennt jetzt EN 1993-1-8 §4.5.1(2), neu `msg_sv_l_eff_je_zug`. ⚠️ **hat keine `VERSION`** (siehe 3.6) |
| `i18n_hilfe.js` | **N5d minimal** — die Laien-ⓘ zur Bewertungsgruppe nennt den EXC-Vorschlag; **`VERSION` `0.1.0-N1` nachgerüstet**. Davor N5c-1: Laien-ⓘ zu `t2`; deckt alle 20 Gruppen und **28** Felder ab |
| `i18n_kerbfall.js` | Gerüst, Füllung in N14 — **`VERSION` `0.1.0-N1` nachgerüstet** (3.6) |
| `style.css` | **N5d minimal** — `.info-version` und `.info-module`; der Block selbst brauchte **keine neue Zeile** (er nutzt `.gap-note` und `.feld-zeile`). Davor: **N5c gewachsen** — dazu `.erg-box`, `.tile .tile-k`, `.rw-abschnitt`, `.rw-bilanz`, `.weg-box`, Grafik- und Legendenstile. **Die Klappmechanik brauchte keine neue Zeile** — sie nutzt die `.acc*`-Stile aus N5a |

**DEV-ONLY — nur in `/mnt/project/`, NIE ausliefern und nicht auf GitHub nötig:**
`test_naht.js` (**984 Assertions**, Sektionen S1–S34; N5d bringt **S34** (Ausführung +
Versionszeile) und zieht in S1/S26/S28 die Liste 2.4 von 10 auf 14 Punkte nach; die drei
S30-Prüfungen „Block ist auf N5d datiert" wurden auf die neue Wahrheit umgestellt —
gleiche Anzahl, anderer Inhalt) ·
`dom_smoke_voll.js` (**513 Prüfungen**, N5d: der ganze Block wird durchgeklickt —
Vorschlag, eigene Wahl, Rückkehr des Vorschlags, Anforderungszeile, Versionszeile
Modul für Modul) ·
`dom_smoke_test.js` (**514 Prüfungen**, ruft den Lauf aus `dom_smoke_voll.js` auf;
seit N5c **unverändert**).
⚠ **Beide Smoke-Dateien müssen im Projektordner liegen** — `dom_smoke_test.js` allein läuft nicht.

**Noch nicht gebaut:**
`kosten.js` (N10) · `report.js` (N11) · `ermuedung.js` (N13) · `kerbfall.js` (N14) ·
`verzug.js` (N15).

**N5c-Lieferungen (2026-07-28):** N5c-1: `validate.js`, `optionen.js`, `profil.js`, `ui.js`,
`i18n_kern.js`, `i18n_hilfe.js`, `style.css`, `test_naht.js`, `dom_smoke_voll.js` ·
N5c-2: `ui.js`, `i18n_kern.js`, `style.css`, `test_naht.js`, `dom_smoke_voll.js` ·
Klappmechanik: `ui.js`, `i18n_kern.js`, `dom_smoke_voll.js`.
**N5c-3-Lieferung (2026-08-03):** `solver.js`, `rechenweg.js`, `i18n_kern.js`,
`test_naht.js`, `dom_smoke_voll.js` — dazu diese Plandatei und `Schweißnaht-Historie.md`.
**Von N5c-3 nicht angefasst:** beide HTMLs, `ui.js`, `profil.js`, `validate.js`,
`optionen.js`, `daten.js`, `naht.js`, `svglib.js`, `schaubild.js`, `i18n_hilfe.js`,
`i18n_kerbfall.js`, `style.css`, `dom_smoke_test.js`.
**`profil.js` musste nicht angefasst werden** — die Zugehörigkeit zum Nahtzug gab es dort
seit N2b als `info[i].raupe`; sie wurde nur nie benutzt.

**N5d-Lieferung (2026-08-03) — 11 Dateien zu überschreiben:** `daten.js`, `optionen.js`,
`ui.js`, `i18n_kern.js`, `i18n_hilfe.js`, `i18n_kerbfall.js`, `style.css`,
`DT-ProfiSchweissnaht.html`, `DT-ProfiSchweissnaht_Test.html`, `test_naht.js`,
`dom_smoke_voll.js` — dazu diese Plandatei und `Schweißnaht-Historie.md`.
**Von N5d nicht angefasst:** `naht.js`, `profil.js`, `svglib.js`, `schaubild.js`,
`solver.js`, `rechenweg.js`, `validate.js`, `dom_smoke_test.js`.
**Die Rechenmodule N2–N4 sind unberührt geblieben** — N5d hat keine Rechengröße
angefasst. Die vier neuen Lücken laufen durch `daten.js` in Solver und Rechenweg,
ohne dass dort eine Zeile geändert wurde.

**Von Dieter am 2026-08-03 bestätigt — N5d eingespielt und ABGENOMMEN.** Der Projektordner
`/mnt/project/` trägt genau diesen Stand. Gegengeprüft direkt aus dem Ordner: Vollständigkeit
gegen die Tabelle oben, die drei Testläufe grün (**984 / 513 / 514 · 0 Fehler**),
`node --check` über alle 16 JS sauber, beide HTMLs mit genau einer Zeile Unterschied, die
**13 gelieferten Dateien byteweise identisch** angekommen und die **acht nicht angefassten
Module unverändert** (`naht.js`, `profil.js`, `svglib.js`, `schaubild.js`, `solver.js`,
`rechenweg.js`, `validate.js`, `dom_smoke_test.js`) — nichts versehentlich überschrieben.

**Frühere Bestätigung (Stand N5c-3, 2026-08-03):** Der Projektordner trug
genau jenen Stand. **Alle N5c-Lieferungen — N5c-1, N5c-2, Klappmechanik und N5c-3 — sind
eingespielt, am Handy geprüft und ABGENOMMEN**, N5c-3 ohne Nacharbeit.
Zusätzlich **gegengeprüft, direkt aus dem Projektordner**: Vollständigkeit gegen die
Tabelle oben, die drei Testläufe grün (**874 / 463 / 464 · 0 Fehler**), `node --check` über
alle 16 JS-Dateien sauber, die beiden HTMLs unterscheiden sich in genau einer Zeile, und die
sieben gelieferten Dateien sind **byteweise identisch** angekommen.
⚠️ **Beim Austausch sind schon Dateien verlorengegangen oder veraltet** — einmal `style.css`
und `test_naht.js`, **zweimal die Plandatei** (2026-07-28 und 2026-08-03, letztere elf
Versionen alt). Deshalb ist die Vollständigkeitsprüfung gegen die Tabelle oben keine
Formsache, und der Basislinien-Abgleich aus Kickoff-Punkt 11 ebenso wenig.

**Erste Handlung im neuen Chat:** Vollständigkeit gegen die Tabelle oben prüfen
(**17 Module**, `style.css`, beide HTMLs, **alle drei** DEV-ONLY-Dateien, dazu Plandatei und
`Schweißnaht-Historie.md`), Arbeitsordner herstellen, die drei Testläufe starten.
Melden müssen sie **2942 / 801 / 802 · 0 Fehler**. Weicht etwas ab, erst das klären —
nicht bauen.

**Was N6b überschreiben wird** (zur Vorwarnung, nicht als Auftrag): neu `symbol.js`,
dazu `ui.js` um dessen Anzeige, `i18n_kern.js` und `i18n_hilfe.js` um die Texte,
beide HTMLs um den Anker, `style.css` gegebenenfalls. `svglib.js` wird **benutzt**,
nicht geändert. Die Rechenmodule bleiben unberührt.
**Abweichung von der Vorwarnung in N5d — festgehalten:** `validate.js` musste **nicht**
angefasst werden (die zwei Auswahlen sind Gruppen, keine Felder), dafür `daten.js`
(die Liste 2.4 hat dort ihre einzige Quelle) und `i18n_kerbfall.js` (Kennung).

---
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

### 9.2 Festlegungen, die beim Bauen noch etwas verbieten oder vorschreiben

*(Alles Weitere ist in 2/3/4/6 geregelt; hier nur, was sonst nirgends steht.)*

- **Basislinie darf nur WACHSEN** — nie schrumpfen, nie gelockert werden. Fällt eine Zahl,
  ist das ein harter Halt (Kopfblock, 7).
- **Die HTML startet immer im dunklen Design** (3.1) — bindende Vorgabe aus N5a.
- **`ui.js` ruft genau drei Module auf** (`DTNSolver`, `DTNRechenweg`, `DTNSchaubild`) und
  rechnet nichts selbst; verboten bleiben `DTNNaht`, `DTNProfil`, `DTNData` (4.10c).
  Die Assertion liest den Quelltext als **Zeichenkette samt Kommentaren** — die verbotenen
  Namen und `Math.` dürfen dort auch im Fließtext nicht vorkommen.
- **Die zwei Häkchenarten nie vermischen** (4.9): Rechenprobe = das Programm rechnet
  falsch · Nachweis = die Naht trägt so nicht.
- **Der zweite Rechenpfad muss wirklich zweiter Pfad sein** — Welt B rechnet eigenständig,
  nicht als Umrechnung von Welt A (4.8).
- **Die gesperrten Tabellenfelder dürfen nicht für immer leer bleiben** — nach dem Rechnen
  werden sie aus `ergebnis.widerstand` gefüllt, samt Herkunft (4.10c).
- **Segmenttypen in V1: nur `linie` und `kreis`** (4.5).
- **Lastfall-Faktoren und Ermüdungsmodul strikt getrennt** halten (2).
- **Eine Quelle je Sache** (3.4): eine Filterfunktion, ein Zahlformat, eine Klappmechanik,
  eine Optionsquelle. Entsteht beim Bauen unvermeidlich eine Doppelung, wird sie **benannt
  und mit Ablösetermin versehen** — so geschehen beim Zahlformat (N5c-1 → N5c-2).
- **Ehrliche Lücken gehören sichtbar** (2.4): Was bewusst nicht geprüft wurde, steht ohne
  Antippen da — auch nicht hinter einer Klappe.
- **Ein Beispiel darf nie gewählt werden, um einem Verhalten auszuweichen.** Passiert das,
  ist es ein **Fehlerbefund** und gehört in den Plan — nicht in einen Quelltextkommentar.
  So ist der Segment-Fehler aus N5c-3 acht Tage lang unentdeckt geblieben (5.1-0).
- **Ampel und Rechenweg müssen dasselbe sagen.** Ein grünes Ergebnis neben einem roten
  Nachweis ist immer ein Fehler, egal welche Seite recht hat.
- **Die drei Prüfebenen nicht zusammenlegen** (4.8, seit N5c-3): `a_min`/`a_max` **je
  Segment** · Mindestlänge **je Nahtzug** · `β_Lw` **je Segment**. Jede dieser drei Ebenen
  ist einzeln begründet; wer sie vereinheitlicht, macht eine davon falsch.
- **Die Mindestlänge ist eine WARNUNG, kein Nachweis** (Dieters Entscheidung 2026-08-03,
  5.1-0). Sie färbt die Ampel nicht und trägt im Rechenweg **keinen** Haken. Dafür nennt
  ihr Text die Norm und steht ohne Aufklappen im Ergebniskasten.
- **Plandatei und Code werden bei JEDEM Wiedereinstieg gegeneinander gemessen**
  (Kickoff-Punkt 11): Basislinie im Kopfblock gegen die drei Testläufe. Weichen sie ab,
  ist eine Seite alt — **nicht bauen, erst klären**. Zweimal war genau das der Fall.
- **Aufnahmekriterium für Normangaben ohne Rechenwirkung** (Dieter, 2026-08-03, 5.1-1):
  **aufgenommen wird, was stabil ist und der Rechnung eine Aussage gibt** — draußen
  bleibt, was gepflegt werden müsste. Das Programm ist ein Nachweisprogramm, **keine
  Qualitätssicherung**. Was draußen bleibt, gehört als benannte Lücke in die Liste 2.4.
- **Vorschlag ist kein Zwang** (N5d, 4.10d): Ein vorgeschlagener Wert gilt nur, solange
  der Anwender die Auswahl nicht selbst angefasst hat; er trägt **immer** eine sichtbare
  Herkunftszeile, und das Leeren der eigenen Wahl holt ihn zurück. Wer das zu einer
  festen Kopplung macht, nimmt dem Anwender eine Entscheidung ab, die ihm gehört.
- **Welche Auswahl welche vorschlägt, steht in `optionen.js`** — nie in `ui.js`.
  Der Harness prüft, dass die Zeichenkette `EXC` im Quelltext von `ui.js` gar nicht
  vorkommt und der Gruppencode `iso5817` dort **genau einmal** steht (in der Anordnung).
- **Die Versionszeile wird aus den GELADENEN Modulen gebaut**, nie aus einer gepflegten
  Liste (3.6). Eine zweite Liste wäre genau die Stelle, die auseinanderdriftet — und die
  Zeile soll ja das Auseinanderdriften sichtbar machen.
- **Eine bewachte Doppelung ist erlaubt, eine stille nicht** (N6b, 4.11): Steht dieselbe
  Liste aus gutem Grund an zwei Stellen, muss eine Assertion sie **in beide Richtungen**
  vergleichen — und der Grund gehört als Kommentar daneben.
- **Ein Bild darf nichts behaupten, was die Legende nicht deckt — und umgekehrt** (N6b):
  Die gestrichelte Identifikationslinie war zuerst durchgezogen gezeichnet, während die
  Legende „gestrichelt" sagte. Assertions auf Legendeneinträge reichen nicht; **das Merkmal
  ist im SVG-String selbst zu prüfen.**
- **Die a-Grenzen sind Kehlnahtregeln** (N7, Dieter 2026-08-04, 4.8): `a ≥ a_min`
  und `a ≤ 0,7·t` gelten für die Kehlnaht **und** die teilweise durchgeschweißte
  Naht — bei der **durchgeschweißten** nicht, dort ist `a = t` die Definition.
  Wo eine Regel nicht greift, steht **kein Haken** im Rechenweg: weder ein
  grüner (er behauptete eine Prüfung, die es nicht gab) noch ein roter (er wäre
  der Widerspruch „grüne Ampel, roter Nachweis").
- **Ein Auslegungsergebnis darf nicht vom Rechenanfang abhängen** (N7, 4.8):
  Die Geometrie hängt über den Endkraterabzug selbst am a-Maß, also wird die
  Kette mit dem gefundenen a erneut durchlaufen. Wer die Schleife entfernt,
  bekommt ein Ergebnis, das je nach Bezugsmaß um rund 10 % schwankt.
- **Gezeichnet wird, WOMIT gerechnet wurde** (N7, 4.10e): Das Nahtbild kommt aus
  `ergebnis.nahtbild.profil_eingabe`, nie aus der rohen Formulareingabe. Sonst
  zeigt das Bild etwas anderes als die Zahlen — oder gar nichts.
- **Eine Assertion prüft gegen die QUELLE, nie gegen eine abgeschriebene Zahl**
  (v2.36 und N7): `PLAN`, `VERSION` und `ETAPPE` in `ui.js` werden alle drei
  gegen das Kopffeld `Codestand` dieser Datei geprüft, und der DOM-Smoke prüft
  die Versionszeile gegen die Kennungen aus `ui.js`. Eine festgeschriebene
  Zeichenkette hat hier schon einmal grün gemeldet, während am Handy ein zwei
  Bausteine alter Stand stand.
- **Jeder neue Beispielkatalog ist zugleich ein Fehlersuchlauf** (N7): Die vier
  Befunde aus 5.1-3 lagen alle auf Pfaden, die kein Beispiel je berührt hatte.
  Wer Beispiele nur als Bequemlichkeit sieht, verschenkt ihren halben Wert.
- **Ein geändertes Modul muss seine Kennung mitziehen** (offen bis N11, 3.6):
  Solange das nicht abgesichert ist, sagt die Versionszeile nur für `ui.js`
  die Wahrheit. Wer sich auf sie verlässt, prüft weniger, als er glaubt.
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
- **Eine bewusst konservative Voreinstellung bleibt die Voreinstellung**
  (2026-08-05, Endkraterabzug 2.2b): Sie darf anfassbar werden, aber
  Abschalten ist eine Handlung, und der **Rechenweg sagt, wie gerechnet
  wurde**. Ein stiller Schalter wäre schlimmer als gar keiner.
- **Wo kein Beleg ist, gibt es keine Vorbelegung** (2026-08-05, 5.1-6a):
  Lieber eine graue Ampel und ein ehrlicher Satz als ein erfundenes
  Zielfenster. Bei den häufigsten Stählen wäre eine erfundene Grenze die
  auffälligste Lüge — und die, die am längsten unbemerkt bliebe.
- **Widersprechen sich zwei belegte Empfehlungen, ist die Überschneidung die
  Vorbelegung** (2026-08-05, t8/5-Fenster): Sie erfüllt beide zugleich, ist an
  beiden Enden die strengere Grenze und ist keine erfundene Zahl. Beide
  Quellfenster gehören dann in den Hilfetext.
- **Ein Probefall, der etwas findet, wird eine Assertion — nicht weggeworfen**
  (2026-08-05, S46): Ein einmal durchgespielter Fall findet den Fehler einmal,
  derselbe Fall als Prüfung findet ihn für immer. Verworfen wird höchstens der
  KATALOG-Eintrag, nie die Prüfung.
- **Zwei Sorten Vorbelegung, sichtbar unterschieden** (2026-08-05, S47):
  **Tabellenwert** aus einer Norm und **Anhaltswert** aus der Praxis. Beide
  gesperrt vorbelegt und per Haken überschreibbar — aber der Anhaltswert sagt
  von sich, dass keine Norm dahintersteht. Ein Erfahrungswert, der aussieht wie
  eine Vorschrift, ist eine stille Behauptung, und die fällt niemandem auf.
- **`test_naht.js` gehört in JEDE Lieferung** (2026-08-05): Sobald sich ein
  Modul ändert, ändert sich die Wächtertabelle in S43 mit — auch wenn keine
  Assertion angefasst wurde. Einmal vergessen, und der Harness meldet vier rote
  Zeilen für einen Fehler, den es gar nicht gibt.
- **Token-Pause: 4 Stunden.**

---

### 9.3 Wo was steht — Wegweiser in `Schweißnaht-Historie.md`

Die Blöcke stehen dort in dieser Reihenfolge; jeder nennt Datum und Baustein:

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
- Aus der Rückmeldung 2026-07-27 (N5a abgenommen)
- Aus N5a (2026-07-26)
- Aus der Rückmeldung 2026-07-26 (N2c abgenommen)
- Aus der Rückmeldung 2026-07-25 (N1 abgenommen)
- Aus der Rückmeldung 2026-07-25 (N2b abgenommen)
- Aus der Rückmeldung 2026-07-25 (N2 abgenommen)
- Aus der Abstimmung 2026-07-24 (dieser Chat)

---

═══════════════════════════════════════════════════════════════════════════
Changelog — **die vollständige Fassung ab v1.0 steht in `Schweißnaht-Historie.md`**
═══════════════════════════════════════════════════════════════════════════

Hier stehen nur die letzten drei Einträge. Wer wissen will, wie eine Entscheidung
zustande kam, findet die Kette dort — lückenlos ab der Erstfassung vom 2026-07-23.

**v2.54 (2026-08-05):** **Etappe N9c von Dieter am Handy geprüft und
ABGENOMMEN.** `winkel_v` bringt die Wärmeführung eingeschaltet mit; die
angezeigten Zahlen decken sich mit den Messungen (CET 0,348 · d 36 mm ·
Q 2,088 kJ/mm · Tp 120 °C · t8/5 13,3 s im Fenster). Eine Beobachtung blieb:
Unter „Zielfenster für t8/5" stand eine **Überschrift ohne Inhalt** — behoben
in N9d. **Code unverändert, `Codestand` bleibt 2.53.**

**v2.55 (2026-08-05):** **Etappe N9d gebaut und geliefert — der Streifzug und
die Anhaltswerte.** Auf Dieters Anstoß, intern Probefälle durchzuspielen und
Felder vorzubelegen. Der **Streifzug (S46)** betritt jede Option jeder
rechenwirksamen Gruppe einmal (87 Fälle) und verlangt entweder eine Rechnung
oder einen **benannten** Grund — und hat beim ersten Lauf einen echten
Widerspruch gefunden: Bei der Auslegung beschrieb das Nahtbild die Naht mit dem
**erforderlichen**, Fläche und Ausnutzung aber die mit dem **gewählten** a-Maß.
Jetzt läuft ein letzter Durchgang mit dem gewählten Maß; dadurch ändert sich
eine gemessene Zahl (`konsole` 760 mm / 0,842 statt 764 / 0,837) — die
Korrektur, nicht die Regression. Als Folgefund schweigt die Rechenprobe
`a_erf = a_bezug · η` dort, wo die Geometrie selbst am a-Maß hängt. Neu sind
außerdem die **Anhaltswerte (S47)**: Spannung, Strom und Geschwindigkeit werden
vorbelegt, tragen aber einen sichtbaren Hinweis, dass keine Norm dahintersteht
— unterschieden von den Tabellenwerten. Dazu die Quelle unter dem Zielfenster.
**Basislinie 2107 → 2942 Assertions · Smokes 784/785 → 801/802 · i18n-Parität 0.**
**Codestand 2.53 → 2.55** (`ui` 0.12.1 → 0.13.0, Etappe N9c → N9d).
**Nächster Schritt: N9d am Handy abnehmen, dann Baustein N10.**



**v2.56 (2026-08-05):** **Baustein N9 vollständig von Dieter am Handy geprüft
und ABGENOMMEN.** Die Versionszeile zeigt „N9d · Plan 2.55 · 17 Module" mit
`solver 0.4.0-N9d`, `rechenweg 0.4.0-N9d`, `validate 0.5.0-N9d`,
`kern 0.5.0-N9d` und `ui 0.13.0`. Dieter hat die Fälle im Programm
durchgespielt, wie zuvor besprochen — ohne Beanstandung. Projektordner
gegengeprüft: alle Dateien byteweise identisch, `node --check` über 20 JS
sauber, Testläufe direkt aus dem Ordner **2942 / 801 / 802 · 0 Fehler**.
**Damit sind sechs von zehn Bausteinen bis zum Verkaufsstand fertig**
(N1–N5, N6b, N7, N8, N9); offen bleiben N10, N11, N12 und N13/N14.
**Code unverändert, `Codestand` bleibt 2.55.**
**Nächster Schritt: Baustein N10 (Kosten, Zeit, Drahtbedarf) — Umfang vor dem
Bau abstimmen, Assistenten-Schritte liefert N10 MIT. Einstieg: „weiter mit N10".**


═══════════════════════════════════════════════════════════════════════════
Ende Schweißnaht-1.md · DT-ProfiSchweissnaht
═══════════════════════════════════════════════════════════════════════════
