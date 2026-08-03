# 🔩 DT-ProfiSchweissnaht — Bauplan (Schweißnaht-1.md · alleinige Grundlage für das Bauen)

## Schweißnahtberechnung für Stahlbau **und** Maschinenbau — statischer Nachweis, Ermüdung,
## Wärmeführung, Kosten, Verzug · dreisprachig (DE/EN/PT) · offline · Handy zuerst

> **Diese Datei ersetzt `Schweißnaht.md` vollständig.** Sie enthält den Stand nach dem
> Konzeptgespräch (2026-07-23), nach der abgeschlossenen Recherche (R1–R6), nach der
> Abstimmung vom **2026-07-24** (alle offenen Fragen aus Abschnitt 0 geklärt) und nach den
> abgenommenen Bausteinen **N1, N2, N2b, N2c, N3, N4, N5a, N5b und N5c (alle drei
> Etappen, einschließlich N5c-3)** — Stand 2026-08-03.
> Sie ist so geschrieben, dass ein **neuer Chat ohne Vorwissen** damit weiterarbeiten kann.
> **Das WARUM steht in `Schweißnaht-Historie.md`** (Entscheidungslog + Changelog im
> Volltext) — dort nachschlagen, bevor etwas geändert wird, das falsch aussieht.
> Einstieg dort: **„weiter mit N5d"** — dann der Reihenfolge in Kickoff-Punkt 5b folgen.

```
Plan-Version : 2.31 · Stand 2026-08-03
Status       : N1 (Fundament), N2 (Nahtbild-Kern), N2b (Profileingabe),
               N2c (Nahtbild-Grafik), N3 (Spannungen + beide Welten),
               N4 (Rechenweg), N5a (UI-Grundgerüst), N5b (Eingabeseite) und
               **N5c vollständig — N5c-1 „Es rechnet", N5c-2 „Es erklärt sich"
               und N5c-3 „Nahtzug statt Segment"** — von Dieter am Handy
               geprüft und ABGENOMMEN.
               **Baustein N5 hat damit nur noch eine offene Etappe: N5d.**
               Projektordner /mnt/project/ ist auf diesem Stand — am 2026-08-03
               gegengeprüft: Vollständigkeit gegen 8.1, alle drei Testläufe
               direkt aus dem Ordner grün, beide HTMLs unterscheiden sich in
               genau einer Zeile, und die sieben gelieferten Dateien sind
               byteweise identisch angekommen.
               → NÄCHSTER SCHRITT: Etappe **N5d** — Einstieg „weiter mit N5d".
                 Inhalt: Block „Ausführung & Dokumentation" (ISO 5817 + EXC,
                 ehrlich als nicht rechenwirksam beschriftet, Abschnitt 2.7)
                 **+ Versionszeile im Info-ⓘ (Abschnitt 3.6)**.
                 ⚠️ VOR der Versionszeile nachzurüsten: **i18n_kern.js,
                 i18n_hilfe.js und i18n_kerbfall.js haben keine `VERSION`** —
                 nachgemessen am 2026-07-28, siehe 3.6.
                 **Der Umfang ist am 2026-08-03 ABGESTIMMT und steht
                 ausformuliert in 5.1-1** — samt Aufnahmekriterium und der
                 Liste dessen, was bewusst draußen bleibt. Offen ist dort nur
                 noch EINE Ja/Nein-Frage (Freitextfeld WPS-Nummer).
                 Schnittstellen: 4.5 (naht.js), 4.6 (profil.js),
                 4.7 (svglib.js + schaubild.js), 4.8 (solver.js),
                 4.9 (rechenweg.js), 4.10 / 4.10b / 4.10c (ui.js).
               Große Bausteine (N5, N8, N13, N14) werden in ETAPPEN gebaut — Regel in
               Kickoff-Punkt 5c, Etappen in Abschnitt 5.2.
Basislinie   : 874 Assertions · DOM-Smokes 463 (voll) + 464 (test) · i18n-Parität 0 Abweichungen
               (VERBINDLICH. Basislinie darf nur WACHSEN — nie schrumpfen, nie gelockert werden.)
Dateistand   : siehe Abschnitt 8.1 — dort steht, was fertig ist und was noch fehlt.
⚠️ SYNC       : Am 2026-08-03 lag im Projektordner eine **elf Versionen alte**
               Plandatei (v2.17) zu neuem Code. Gefunden hat es allein der
               Abgleich „Basislinie im Kopf gegen Basislinie gemessen"
               (Kickoff-Punkt 11). Diesen Abgleich NIE überspringen.
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
Einstiegssatz von Dieter: **„weiter mit N5d"**.
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
9. Abschnitt **5.1** lesen: der Auftragsvorschlag für die nächste Etappe **N5d**
   (**vor dem Bau mit Dieter bestätigen**), und Abschnitt **5.2**: die Etappen von N5.
10. **Vollständigkeit des Projektordners prüfen** (Liste in 8.1): 13 Module, `style.css`,
   beide HTMLs und **alle drei** DEV-ONLY-Dateien, dazu `Schweißnaht-Historie.md`.
   `dom_smoke_test.js` allein läuft nicht, sie ruft `dom_smoke_voll.js` auf — fehlt eine
   davon, zuerst bei Dieter nachfragen. **Das ist keine Formsache:** beim Austausch sind
   schon zweimal Dateien verlorengegangen, beide Male hat diese Prüfung es gefunden.
11. Arbeitsordner herstellen (Befehl unter Punkt 6 der Kickoff-Liste), dann
   `node test_naht.js`, `node dom_smoke_voll.js`, `node dom_smoke_test.js` laufen lassen
   und die Basislinie aus dem Plan-Kopf bestätigen (**874 / 463 / 464 · 0 Fehler**),
   **bevor** etwas gebaut wird. Weicht etwas ab, erst das klären.
   ⚠️ **Diese drei Läufe sind zugleich die Probe, ob Plandatei und Code zusammenpassen.**
   Steht im Kopfblock eine andere Basislinie als gemessen, ist eine der beiden Seiten alt —
   dann NICHT bauen, sondern erst mit Dieter klären. **Das ist zweimal passiert:** am
   2026-07-28 lag eine drei Etappen alte Plandatei im Ordner, am 2026-08-03 eine elf
   Versionen alte (v2.17, Basislinie 679/234/235) zu Code auf Stand N5c-2. Beide Male
   war dieser Abgleich die einzige Stelle, die es gemerkt hat.
12. Erst dann **N5d** bauen — Fließband nach Punkt 5 der Kickoff-Liste.
    **Der Umfang von N5d ist VOR dem Bau mit Dieter abzustimmen** (5.1-1); bei
    „Ausführung & Dokumentation" zählt seine Praxissicht, welche Angaben wirklich
    hingehören und welche nur Papier wären. **Zuerst** bekommen `i18n_kern.js`,
    `i18n_hilfe.js` und `i18n_kerbfall.js` ihre `VERSION` (3.6) — sonst hätte die
    Versionszeile drei stille Löcher.

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
**Terrassenbruch bei Zug in Dickenrichtung (Z-Güten)**

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

### 3.2 Kontextbezogene Beispiele *(neue Anforderung)*

Die Beispiele oben richten sich nach dem, was links ausgewählt/angehakt ist.
**Umsetzung:** Jedes Preset trägt **Merkmale** (Nahtart, Werkstoffgruppe, Belastungsart,
Bemessungswelt). Die Beispielliste zeigt nur passende Presets; passt nichts → alle anzeigen.
Eine Quelle, keine Doppelpflege. Der Anwender kann ein Beispiel laden, anpassen, ausprobieren.

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

> ⚠️ **NACHGEMESSEN AM 2026-07-28 — VOR DEM BAU DER ZEILE ZU ERLEDIGEN:**
> Es sind **10 von 13 Modulen**, die eine `VERSION` tragen. **`i18n_kern.js`,
> `i18n_hilfe.js` und `i18n_kerbfall.js` haben gar keine.** Eine Zeile, die aus den
> Modulkennungen gebaut wird, hätte dort drei stille Löcher — ausgerechnet in den Dateien,
> die sich am häufigsten ändern. **N5d rüstet die drei Kennungen zuerst nach**, dann wird
> die Zeile gebaut. `dom_smoke_test.js` braucht keine (DEV-ONLY, reiner Aufrufer).
> Ist-Stand: `daten` `optionen` `validate` `0.1.0-N1` · `naht` `0.1.0-N2` ·
> `profil` `0.1.0-N2b` · `svglib` `schaubild` `0.1.0-N2c` · `solver` `0.1.0-N3` ·
> `rechenweg` `0.1.0-N4` · `ui` `0.6.0` (dazu `ETAPPE`).

**Vorgabe:**
- Der **Info-ⓘ** zeigt eine Zeile mit **Programmstand und Plan-Version** (z. B.
  „Stand N5d · Plan 2.23"). Gebaut wird sie aus den Modulkennungen, nicht von Hand
  gepflegt — sonst ist sie die nächste Stelle, die auseinanderdriftet.
- **Jede Ausgabe** (Druck, PDF, Word, `.dts`) trägt dieselbe Zeile (N11).
- Eine Assertion prüft, dass die angezeigte Kennung mit den geladenen Modulen übereinstimmt.

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
`duennwandig` = klassisches Linienmodell (deckt sich mit Roloff/Matek). Unterschied < 0,1 %.
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
  gehört seit N5c-3 NICHT mehr dazu — sie ist eine Warnung, 5.1-0.)* `false` heißt
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
| **N5** ⬅ | **UI-Basis — LAUFEND: N5a ✅, N5b ✅, N5c-1 ✅, N5c-2 ✅ und N5c-3 ✅ alle abgenommen · EINZIGE OFFENE ETAPPE: N5d (Auftrag in 5.1-1, Etappen in 5.2)** | 2 HTMLs, `style.css`, Formular mit aufklappbaren Bereichen und Freischalt-Haken, Ergebnis-Kacheln, Ampel, i18n, Theme (**Start immer dunkel**), Laien-ⓘ, Block „Ausführung & Dokumentation" (ISO 5817 + EXC). **Erster Handy-Test.** |
| **N6b** | **ISO-2553-Symbolgenerator** | `symbol.js`: Pfeil-/Gegenseite, a- bzw. z-Maß, Länge, Rundumnaht, Baustellennaht. Nutzt `svglib.js` aus N2c. Bewusst **vor** dem Launch — Verkaufsargument. |
| **N7** | **Presets** | Die 6 Starter als Profil-/Kantendaten auf `profil.js`, **mit Merkmalen für die kontextbezogene Beispielliste** (3.2). |
| **N8** | **Assistent** | `assistent.js` (DOM-freie Dialoglogik) + Overlay-UI, Button-Einstieg, tabellengestützt aus `optionen.js`, mit Erklärungen/Tipps/Skizzen je Dialog, Übernahme vorhandener Eingaben. |
| **N9** | **Vorwärmung & t8/5** | `thermik.js` + Panel + Rechenweg + Assistenten-Schritte. |
| **N10** | **Kosten/Zeit/Draht** | `kosten.js` + Panel + Rechenweg + Assistenten-Schritte. |
| **N11** | **Ausgaben** | `report.js`: `.dts` speichern/öffnen (**erst leeren, dann laden** + Formatversion), Druck/PDF, Word (.rtf), `guard()`-Gating. Aktionsleiste **oben**, Dateiname trägt Bezeichnung + Datum. **Jede Ausgabe trägt die Versionszeile** (3.6). |
| **N12** | **Edition/Registrierung/Impressum** | Testbalken, Aktivierungsdialog beim Erststart (Name + Schlüssel, **keine Formatprüfung**), „Vollversion · lizenziert für <Name>", **10-s-Long-Press** = Reset, Info-ⓘ mit Impressum. |
| **★** | **LAUNCH-CHECKPOINT** | **Ab hier verkaufsfähig.** Dieter entscheidet: weiterbauen oder veröffentlichen. |
| **N13** | **Ermüdung — Rechenkern** | `ermuedung.js`: Wöhlerlinie m=3/5, γ_Mf, Miner, Kollektive + Rechenweg. **Hier Dieter nach seinen Praxis-Kerbfällen fragen.** |
| **N14** | **Kerbfallkatalog** | `kerbfall.js` + SVG-Skizzen + Auswahl-UI mit Filter. Struktur vollständig, Füllung gestaffelt (Start 25–35 Details, je 2 Quellen), **ehrliche Lücken sichtbar**. Mehrere Etappen. |
| **N15** | **Verzug & Schrumpfung** | `verzug.js` + Panel, klar als **Abschätzung** gekennzeichnet. |
| **N16** | **Feinschliff + Build** | Presets ausbauen, Wissenstexte, Code-Audit, Bündelung + Obfuskierung (zwei Bündel, Unterschied nur `DT_EDITION`). **→ V1-Launch.** |

### 5.1 Auftrag: **N5d** *(N5c-3 ist abgenommen — 5.1-0 nur noch als Begründung)*

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

#### 5.1-1 · N5d — **der nächste Auftrag** *(Umfang vor dem Bau abstimmen)*


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
| **N5d** ⬅ | *(nächster Bau — Umfang vor dem Bau mit Dieter abstimmen)* Block „Ausführung & Dokumentation" (ISO 5817 + EXC, ehrlich als nicht rechenwirksam beschriftet, 2.7) **+ Versionszeile im Info-ⓘ** (siehe 3.6, **mit dem Befund zu den drei fehlenden Kennungen**) | Der Block klappt auf und erscheint in der Ausgabe; der Programmstand ist am Handy ablesbar |

**N8 — Assistent (drei Etappen):**
| Etappe | Inhalt |
|---|---|
| **N8a** | `assistent.js`: DOM-freie Dialoglogik, Schrittfolge aus `optionen.js` und `validate.js`, Verzweigung, Umkehrbarkeit jedes Schritts, Übernahme bereits gefüllter Felder — vollständig in Node testbar, **ohne** Oberfläche |
| **N8b** | Overlay-UI: Button-Einstieg, ein Dialogfenster je Schritt mit Laien-Erklärung, Standardwert-Tipp, **Skizze** und antippbarer Auswahl (3.3) |
| **N8c** | Mündung in die volle Anzeige mit Rechenweg und Liste 2.4; ab hier gilt die **Prozessregel**, dass jeder spätere Baustein seine Assistenten-Schritte mitliefert |

**N13/N14 — Ermüdung und Kerbfallkatalog:**
| Etappe | Inhalt |
|---|---|
| **N13a** | `ermuedung.js` Rechenkern Stahl: Wöhlerlinie m = 3/5, Δσ_C, γ_Mf, Einstufenkollektiv + Hand-Anker |
| **N13b** | Miner-Schadensakkumulation und Kollektive, Alu-Kern nach EN 1999-1-3 |
| **N14a** | `kerbfall.js`: **Struktur vollständig** (Codes, Kategorien, Anwendungsbedingungen, Verweis auf Skizze) mit den ersten Details — ab hier ist jede Lücke sichtbar statt still |
| **N14b…** | Füllung in Etappen von je 8–12 Details, jedes mit eigener SVG-Skizze und **2 Quellen**. Hier wird Dieter nach seinen Praxis-Kerbfällen gefragt (Reihenfolge der Füllung) |

**N5a, N5b und N5c (alle drei Etappen) sind gebaut; der Auftrag für N5d steht in 5.1-1
und ist als einziger noch NICHT vorentschieden — er wird vor dem Bau bestätigt.**

**Nicht geteilt** (einteilig): N6b, N7, N9, N10, N11, N12, N15 — bei N4 hat sich die
Einschätzung bestätigt.
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

**Begleitdatei zum Plan:** `Schweißnaht-Historie.md` — Entscheidungslog und Changelog im
Volltext (ab 2026-07-28 ausgelagert). **Nur bei Bedarf lesen**, Regel in Abschnitt 9.

**Referenzdateien (read-only, nur Muster):** `DT-ProfiPassung_Testversion-Orginal.html` ·
`DT-ProfiPassung.html` · `DT-ProfiPassung_Test.html`

### 8.1 Dateistand nach N5c-3 *(Stand 2026-08-03)*

**Produktdateien (13 Module + style.css + 2 HTMLs):**
| Datei | Stand |
|---|---|
| `DT-ProfiSchweissnaht.html` | **von N5c NICHT angefasst** — Stand N5b. Alle 13 `<script src>` und die Karten für Ergebnis, Grafik und Rechenweg lagen seit N5a richtig |
| `DT-ProfiSchweissnaht_Test.html` | **von N5c NICHT angefasst** — Test-Edition, **durch Assertion verifiziert: Unterschied genau eine Zeile** |
| `ui.js` | **N5c stark erweitert** — dazu: Beispiele laden, Übersetzung anstoßen, „Berechnen" rechnet, Ergebnis-Kacheln mit Ampel, **Rechenweg (aufklappbar) und Nahtbild-Grafik**, Liste 2.4. Schnittstelle in **4.10 + 4.10b + 4.10c**. Ruft **genau drei** Module auf (`DTNSolver`, `DTNRechenweg`, `DTNSchaubild`), weiterhin ohne `Math.` und ohne eigene Rechnung |
| `daten.js` | N1, unverändert |
| `naht.js` | N2, unverändert — Schnittstelle in 4.5 |
| `profil.js` | **N5c-1 minimal geändert** — `msg_endkrater_zu_lang` zeigt auf Feld `a` statt auf das entfallene `l`; sonst N2b, Schnittstelle in 4.6 |
| `svglib.js` | N2c, unverändert — Schnittstelle in 4.7 |
| `schaubild.js` | N2c, unverändert — Schnittstelle in 4.7 |
| `solver.js` | **N5c-3 geändert** — `nahtzuege()` neu, Längenprüfung je Nahtzug, `grenzen.je_zug[]` / `n_zuege` / `mehrsegmentig` neu, Hinweiscode `msg_sv_l_eff_je_zug`. Sonst N3, Schnittstelle in 4.8 |
| `rechenweg.js` | **N5c-3 geändert** — Schritt `rw_s_l_eff` rechnet aus `je_zug` und ist eine **Warnung ohne Nachweis-Haken**. Sonst N4, Schnittstelle in 4.9 |
| `optionen.js` | **N5c-1 erweitert** — 20 Gruppen, 89 Optionen (unverändert) **+ `BEISPIELE` (3) und `beispiel()`** |
| `validate.js` | **N5c-1 geändert** — **28 Felder** (`l` entfallen), `t1` profilabhängig Pflicht, `t2` freiwillig, Längenprüfungen in den Solver verlegt; **neu `normiert()` und `rechenEingabe()`** |
| `i18n_kern.js` | **N5c erweitert, N5c-3 nachgeschärft** — Beispielnamen, Ergebnis- und Rechenwegtexte, Quellenangaben, Klapptexte; `msg_sv_l_eff_zu_kurz` nennt jetzt EN 1993-1-8 §4.5.1(2), neu `msg_sv_l_eff_je_zug`. ⚠️ **hat keine `VERSION`** (siehe 3.6) |
| `i18n_hilfe.js` | **N5c-1 minimal** — Laien-ⓘ zu `t2` sagt, was ohne Eingabe passiert; deckt alle 20 Gruppen und **28** Felder ab. ⚠️ **hat keine `VERSION`** (siehe 3.6) |
| `i18n_kerbfall.js` | Gerüst, unverändert (Füllung in N14). ⚠️ **hat keine `VERSION`** (siehe 3.6) |
| `style.css` | **N5c gewachsen** — dazu `.erg-box`, `.tile .tile-k`, `.rw-abschnitt`, `.rw-bilanz`, `.weg-box`, Grafik- und Legendenstile. **Die Klappmechanik brauchte keine neue Zeile** — sie nutzt die `.acc*`-Stile aus N5a |

**DEV-ONLY — nur in `/mnt/project/`, NIE ausliefern und nicht auf GitHub nötig:**
`test_naht.js` (**874 Assertions**, Sektionen S1–S33; in N5c kam **S31** (Beispiele) und
**S32** (Rechenweg/Grafik) dazu, in N5c-3 **S33** (Nahtzug); S10 umgehängt, S29/S30 geschärft) ·
`dom_smoke_voll.js` (**463 Prüfungen**, N5c-3: H-Träger und Gegenprobe an der echten
Oberfläche) ·
`dom_smoke_test.js` (**464 Prüfungen**, ruft den Lauf aus `dom_smoke_voll.js` auf;
seit N5c **unverändert**).
⚠ **Beide Smoke-Dateien müssen im Projektordner liegen** — `dom_smoke_test.js` allein läuft nicht.

**Noch nicht gebaut:** `symbol.js` (N6b) · `assistent.js` (N8) · `thermik.js` (N9) ·
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

**Von Dieter am 2026-08-03 bestätigt:** Der Projektordner `/mnt/project/` trägt genau
diesen Stand. **Alle N5c-Lieferungen — N5c-1, N5c-2, Klappmechanik und N5c-3 — sind
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
(**13 Module**, `style.css`, beide HTMLs, **alle drei** DEV-ONLY-Dateien, dazu Plandatei und
`Schweißnaht-Historie.md`), Arbeitsordner herstellen, die drei Testläufe starten.
Melden müssen sie **874 / 463 / 464 · 0 Fehler**. Weicht etwas ab, erst das klären —
nicht bauen.

**Was N5d überschreiben wird** (zur Vorwarnung, nicht als Auftrag): `optionen.js` und
`validate.js` um den Block „Ausführung & Dokumentation", `ui.js` um dessen Anzeige,
`i18n_kern.js` und `i18n_hilfe.js` um die Texte, `style.css` gegebenenfalls.
**Zuerst** bekommen `i18n_kern.js`, `i18n_hilfe.js` und `i18n_kerbfall.js` ihre `VERSION`
(3.6). Die Rechenmodule N1–N4 bleiben unberührt.

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

**v2.29 (2026-08-03):** **Etappe N5c-3 („Nahtzug statt Segment") gebaut und grün
ausgeliefert** — der Fehlerbefund aus v2.28 ist repariert. Die Prüfung
`l ≥ max(6·a; 30 mm)` läuft jetzt **je durchlaufendem Nahtzug** statt je Segment;
`solver.js` gruppiert dafür über `info[i].raupe`, das `profil.js` seit N2b liefert und das
nie benutzt wurde. Nachgemessen: I 200×200 rundum = **ein** Zug über 1182 mm ·
U 80×160 = 626 mm · U 100×200 = 782 mm — keiner gilt mehr als zu kurz, und die Gegenprobe
(Blech 35 mm, Flanken, a 5 → 25 mm je Zug) wird weiterhin gefangen.
**Dieters Entscheidung zur offenen Frage: die Längenprüfung ist eine WARNUNG, kein
Nachweis** — die Ampel bleibt bei η, der Rechenwegschritt trägt keinen Haken mehr, dafür
nennt der Warntext EN 1993-1-8 §4.5.1(2) und sagt, dass das Ergebnis nur rechnerisch gilt.
Damit widersprechen Ampel und Rechenweg sich nicht mehr (der zweite Befund aus v2.28).
Zwei benannte Entscheidungen: **β_Lw bleibt je Segment** (auf Zug-Ebene löste ein
umlaufender Zug die Langnaht-Abminderung fälschlich aus) und **ohne Raupenangabe bleibt
jedes Segment ein eigener Zug** (freier Modus, strengere Annahme). Neu: Harness-Sektion
**S33**, Hinweiscode `msg_sv_l_eff_je_zug`. Geändert: `solver.js`, `rechenweg.js`,
`i18n_kern.js`, `test_naht.js`, `dom_smoke_voll.js` — `ui.js`, `profil.js` und beide HTMLs
blieben unberührt. **Plandatei vollständig nachgezogen** (Kopfblock, Kickoff 5b, 4.8, 4.9,
5.1, 5.2, 8.1, 9.2, 9.3, Changelog), nachdem im Projektordner eine **elf Versionen alte**
Plandatei (v2.17) zu neuem Code lag — gefunden allein durch den Basislinien-Abgleich.
**Basislinie 822 → 874 Assertions · Smokes 448/449 → 463/464 · i18n-Parität 0.**
**Nächster Schritt: N5c-3 am Handy abnehmen, dann N5d — Einstieg „weiter mit N5d".**

**v2.30 (2026-08-03):** **Etappe N5c-3 von Dieter am Handy geprüft und ABGENOMMEN —
ohne Nacharbeit.** Damit ist Baustein N5 bis auf N5d fertig. Der Projektordner wurde
gegengeprüft: Vollständigkeit gegen 8.1, die drei Testläufe direkt aus dem Ordner grün,
beide HTMLs mit genau einer Zeile Unterschied, und die sieben gelieferten Dateien
byteweise identisch angekommen. Plandatei auf den abgenommenen Stand gesetzt (Kopfblock,
Kickoff-Punkt 12, Bausteintabelle, 5.1, 5.2, 8.1, Wegweiser 9.3); die Fallunterscheidung
„abgenommen ja/nein" im Kopfblock entfällt, der Einstieg lautet ohne Vorbehalt
**„weiter mit N5d"**. Im Changelog dieser Datei ist v2.27 herausgerollt — er steht
vollständig in der Historie. **Code unverändert.**
**Basislinie unverändert und verbindlich: 874 Assertions · Smokes 463/464 · i18n-Parität 0.**
**Nächster Schritt: N5d — Umfang vor dem Bau abstimmen (5.1-1), vorher die drei
fehlenden `VERSION`-Kennungen nachrüsten (3.6).**

**v2.31 (2026-08-03):** **Umfang von N5d abgestimmt und in 5.1-1 ausformuliert** — noch im
N5c-3-Chat, damit er einen Chatwechsel überlebt. Aufgenommen: die zwei bereits in
`optionen.js` vorhandenen Gruppen (`iso5817`, `exc`) anzeigen, **EXC schlägt die
Bewertungsgruppe vor** (überschreibbar, mit sichtbarer Herkunft, Regel nach 3.4), sichtbarer
**Ermüdungshinweis ohne Scheinrechnung**, Anforderungszeile in den Ausgaben. Bewusst
draußen: Prüfumfang/ZfP, Nahtvorbereitung (EN ISO 9692-1, gehört zu N6b), Toleranzklassen
(EN ISO 13920) und Herstellerqualifikation — sie kommen als **benannte Lücken in die
Liste 2.4**, damit im Programm selbst steht, dass es kein QS-System ist. Dahinter das neue
**Aufnahmekriterium** (jetzt bindend in 9.2): *aufgenommen wird, was stabil ist und der
Rechnung eine Aussage gibt; draußen bleibt, was gepflegt werden müsste.* Festgehalten ist
auch der **Vorlauf**: die Datengrundlage für den Block liegt komplett vor, es fehlt nur die
Verdrahtung. Offen bleibt eine einzige Ja/Nein-Frage (Freitextfeld WPS-Nummer, Vorschlag:
weglassen). Im Changelog dieser Datei ist v2.28 herausgerollt — Volltext in der Historie.
**Code unverändert.**
**Basislinie unverändert und verbindlich: 874 Assertions · Smokes 463/464 · i18n-Parität 0.**
**Nächster Schritt: N5d — Einstieg „weiter mit N5d". Auftrag vollständig in 5.1-1.**

═══════════════════════════════════════════════════════════════════════════
Ende Schweißnaht-1.md · DT-ProfiSchweissnaht
═══════════════════════════════════════════════════════════════════════════
