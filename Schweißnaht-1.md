# 🔩 DT-ProfiSchweissnaht — Bauplan (Schweißnaht-1.md · alleinige Projektgrundlage)

## Schweißnahtberechnung für Stahlbau **und** Maschinenbau — statischer Nachweis, Ermüdung,
## Wärmeführung, Kosten, Verzug · dreisprachig (DE/EN/PT) · offline · Handy zuerst

> **Diese Datei ersetzt `Schweißnaht.md` vollständig.** Sie enthält den Stand nach dem
> Konzeptgespräch (2026-07-23), nach der abgeschlossenen Recherche (R1–R6), nach der
> Abstimmung vom **2026-07-24** (alle offenen Fragen aus Abschnitt 0 geklärt) und nach den
> abgenommenen Bausteinen **N1, N2, N2b, N2c und N3** (Stand 2026-07-26).
> Sie ist so geschrieben, dass ein **neuer Chat ohne Vorwissen** damit weiterarbeiten kann.
> Einstieg dort: **„weiter mit N4"** — dann der Reihenfolge in Kickoff-Punkt 5b folgen.

```
Plan-Version : 2.13 · Stand 2026-07-26
Status       : N1 (Fundament), N2 (Nahtbild-Kern), N2b (Profileingabe),
               N2c (Nahtbild-Grafik) und N3 (Spannungen + beide Welten)
               von Dieter am Handy geprüft und ABGENOMMEN.
               Projektordner /mnt/project/ UND GitHub Pages sind auf diesem Stand —
               am 2026-07-26 gegengeprüft: alle 11 Module, style.css, beide HTMLs und
               die drei DEV-ONLY-Dateien vorhanden, Testläufe direkt aus dem
               Projektordner grün.
               → NÄCHSTER SCHRITT: Baustein N4 (Rechenweg, rechenweg.js) — einteilig
                 — Auftrag in Abschnitt 5.1, Schnittstellen in 4.5 (naht.js), 4.6 (profil.js),
                   4.7 (svglib.js + schaubild.js) und 4.8 (solver.js).
               Große Bausteine (N5, N8, N13, N14) werden in ETAPPEN gebaut — Regel in
               Kickoff-Punkt 5c, Etappen in Abschnitt 5.2.
Basislinie   : 580 Assertions · DOM-Smokes 149 (voll) + 150 (test) · i18n-Parität 0 Abweichungen
               (VERBINDLICH. Basislinie darf nur WACHSEN — nie schrumpfen, nie gelockert werden.)
Dateistand   : siehe Abschnitt 8.1 — dort steht, was fertig ist und was noch fehlt.
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
Einstiegssatz von Dieter: **„weiter mit N4"**.
1. Diese Datei komplett lesen (`Schweißnaht-1.md`, sie ist die alleinige Grundlage).
2. Abschnitt **8.1** lesen: was ist fertig, was fehlt.
3. Abschnitt **4.5** lesen: die fertige Schnittstelle von `naht.js` (N2).
4. Abschnitt **4.6** lesen: die fertige Schnittstelle von `profil.js` (N2b) — darauf setzen
   die Grafik und N7 (Presets) auf. Fachlicher Hintergrund steht in **2.2b**.
5. Abschnitt **4.7** lesen: die fertige Schnittstelle von `svglib.js` + `schaubild.js`
   (N2c) — darauf setzen N5 (UI), N6b (ISO 2553) und N14 (Kerbfallskizzen) auf.
6. Abschnitt **4.8** lesen: die fertige Schnittstelle von `solver.js` (N3) — **darauf
   setzt N4 unmittelbar auf.** Das ist die wichtigste Schnittstelle für den nächsten Schritt.
7. Abschnitt **5.1** lesen: der ausformulierte Auftrag für den nächsten Baustein **N4**.
8. **Vollständigkeit des Projektordners prüfen** (Liste in 8.1): 11 Module, `style.css`,
   beide HTMLs und **alle drei** DEV-ONLY-Dateien. `dom_smoke_test.js` allein läuft nicht,
   sie ruft `dom_smoke_voll.js` auf — fehlt eine davon, zuerst bei Dieter nachfragen.
9. Arbeitsordner herstellen (Befehl unter Punkt 6 der Kickoff-Liste), dann
   `node test_naht.js`, `node dom_smoke_voll.js`, `node dom_smoke_test.js` laufen lassen
   und die Basislinie aus dem Plan-Kopf bestätigen (**580 / 149 / 150 · 0 Fehler**),
   **bevor** etwas gebaut wird. Weicht etwas ab, erst das klären.
10. Erst dann N4 bauen — Fließband nach Punkt 5 der Kickoff-Liste.

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
Kleine Bausteine (N4, N6b, N7, N9, N10, N11, N12, N15) bleiben einteilig — wenn sich das
beim Bauen als falsch erweist, wird geteilt statt gehetzt.

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

---

## 4. Architektur & Module

### 4.1 Modulkarte + Ladereihenfolge
```
dt-profischweissnaht-web/
├── DT-ProfiSchweissnaht.html      → Vollversion
├── DT-ProfiSchweissnaht_Test.html → Testedition (Unterschied: NUR window.DT_EDITION)
├── style.css                      → Design-Tokens/Look (aus der Passung portiert)
├── i18n_kern.js   (DTNI18nKern)   → Bedienung, Felder, Meldungen, Rechenweg-Beschriftungen
│                                     ✅ fertig (N1–N3) · 435 Schlüssel
├── i18n_hilfe.js  (DTNI18nHilfe)  → Laien-ⓘ-Texte, Dialog-Erklärungen, Tipps
│                                     ✅ fertig (N1–N3) · 57 Einträge
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
├── rechenweg.js   (DTNRechenweg)  → selbstprüfender Rechenweg für ALLE Module
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
├── ui.js                          → Formular, Modi, Zusatzbereiche, i18n, Theme, Rechenweg,
│                                     Grafik, Presets, Laien-ⓘ, Assistent-Overlay, Aktionsleiste
├── test_naht.js      (DEV-ONLY)   → Assertion-Harness — nie ausgeliefert
└── dom_smoke_*.js    (DEV-ONLY)   → DOM-Smokes Voll + Test — nie ausgeliefert
```

**Ladereihenfolge in beiden HTMLs (Zielbild):**
```
i18n_kern → i18n_hilfe → i18n_kerbfall → daten → kerbfall → optionen → validate →
naht → profil → solver → rechenweg → ermuedung → thermik → kosten → verzug →
svglib → schaubild → symbol → beratung → assistent → report → ui
```
**Tatsächlich in den HTMLs eingetragen (Stand N3, vom DOM-Smoke geprüft):**
```
i18n_kern → i18n_hilfe → i18n_kerbfall → daten → optionen → validate → naht → profil →
svglib → schaubild → solver
```
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
je_segment[], eta_mit_gewaehlt}` · `grenzen{a_min, je_segment[], verletzt[], beta_Lw}` ·
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
| **N4** ⬅ | **Rechenweg — NÄCHSTER SCHRITT** | `rechenweg.js`: selbstprüfende Schritte für N2/N2b/N3, dreisprachig. |
| **N5** | **UI-Basis** | 2 HTMLs, `style.css`, Formular mit aufklappbaren Bereichen und Freischalt-Haken, Ergebnis-Kacheln, Ampel, i18n, Theme (**Start immer dunkel**), Laien-ⓘ, Block „Ausführung & Dokumentation" (ISO 5817 + EXC). **Erster Handy-Test.** |
| **N6b** | **ISO-2553-Symbolgenerator** | `symbol.js`: Pfeil-/Gegenseite, a- bzw. z-Maß, Länge, Rundumnaht, Baustellennaht. Nutzt `svglib.js` aus N2c. Bewusst **vor** dem Launch — Verkaufsargument. |
| **N7** | **Presets** | Die 6 Starter als Profil-/Kantendaten auf `profil.js`, **mit Merkmalen für die kontextbezogene Beispielliste** (3.2). |
| **N8** | **Assistent** | `assistent.js` (DOM-freie Dialoglogik) + Overlay-UI, Button-Einstieg, tabellengestützt aus `optionen.js`, mit Erklärungen/Tipps/Skizzen je Dialog, Übernahme vorhandener Eingaben. |
| **N9** | **Vorwärmung & t8/5** | `thermik.js` + Panel + Rechenweg + Assistenten-Schritte. |
| **N10** | **Kosten/Zeit/Draht** | `kosten.js` + Panel + Rechenweg + Assistenten-Schritte. |
| **N11** | **Ausgaben** | `report.js`: `.dts` speichern/öffnen (**erst leeren, dann laden** + Formatversion), Druck/PDF, Word (.rtf), `guard()`-Gating. Aktionsleiste **oben**, Dateiname trägt Bezeichnung + Datum. |
| **N12** | **Edition/Registrierung/Impressum** | Testbalken, Aktivierungsdialog beim Erststart (Name + Schlüssel, **keine Formatprüfung**), „Vollversion · lizenziert für <Name>", **10-s-Long-Press** = Reset, Info-ⓘ mit Impressum. |
| **★** | **LAUNCH-CHECKPOINT** | **Ab hier verkaufsfähig.** Dieter entscheidet: weiterbauen oder veröffentlichen. |
| **N13** | **Ermüdung — Rechenkern** | `ermuedung.js`: Wöhlerlinie m=3/5, γ_Mf, Miner, Kollektive + Rechenweg. **Hier Dieter nach seinen Praxis-Kerbfällen fragen.** |
| **N14** | **Kerbfallkatalog** | `kerbfall.js` + SVG-Skizzen + Auswahl-UI mit Filter. Struktur vollständig, Füllung gestaffelt (Start 25–35 Details, je 2 Quellen), **ehrliche Lücken sichtbar**. Mehrere Etappen. |
| **N15** | **Verzug & Schrumpfung** | `verzug.js` + Panel, klar als **Abschätzung** gekennzeichnet. |
| **N16** | **Feinschliff + Build** | Presets ausbauen, Wissenstexte, Code-Audit, Bündelung + Obfuskierung (zwei Bündel, Unterschied nur `DT_EDITION`). **→ V1-Launch.** |

### 5.1 Auftrag für den nächsten Baustein **N4 — Rechenweg** *(hier ansetzen)*

> Alles, was N4 braucht, ist fertig und liefert **Codes statt Texte**: `profil.js` (4.6)
> die Segmente samt Herkunft, `naht.js` (4.5) die Querschnittswerte samt Selbstprüfung,
> `schaubild.js` (4.7) das Bild samt Legendencodes, `solver.js` (4.8) die Spannungen an
> jedem Randpunkt, den maßgebenden Punkt, jeden Einzelnachweis und die Auslegung mit
> `a_erf` **und** `a_gewaehlt`. N4 baut **`rechenweg.js` (`DTNRechenweg`)** — DOM-frei,
> deterministisch, wie die Vorgänger.

**Warum das das Herzstück ist:** Der selbstprüfende Rechenweg ist das Nachweis-Herzstück
des Produkts (stehende Regel 8). Er muss **vollständig in der gewählten Sprache** stehen,
inklusive aller Formel- und Werte-Beschriftungen.

**Zu bauen:**
- **Schrittliste als Daten, nicht als Text:** je Schritt `code` (i18n-Schlüssel),
  `formel` (Klartext, Symbole sprachneutral), `eingesetzt` (Formel mit den echten Zahlen),
  `ergebnis` + `einheit`, `quelle` (Norm/Regelwerk), `haken` (bestanden ja/nein) und
  optional `hinweis`. Die Oberfläche (N5) und die Ausgaben (N11) rendern nur.
- **Abschnitte:** Eingaben → Nahtbild (Segmente, A_w, Schwerpunkt, I_y/I_z/I_p, gewähltes
  Rechenmodell) → Schnittgrößen → Spannungen am maßgebenden Punkt → Widerstand mit
  benannter Grundlage → jeder Einzelnachweis mit Ausnutzung → Auslegung mit **beiden**
  a-Zahlen → Grenzen (a_min, a_max, l_eff) → Liste 2.4 → Lücken und Hinweise.
- **Selbstprüfung sichtbar:** die Häkchen aus `naht.js` (`kontrolle`: statische Momente
  um den Schwerpunkt = 0, I_p = I_y + I_z, I_1 + I_2 = I_y + I_z) und die Hand-Anker
  gehören als Zeilen in den Rechenweg, nicht in eine Fußnote.
- **Zweiter Rechenpfad je Schritt, wo es billig ist** (z. B. A_w = Σ a·l gegen die Summe
  aus `teile[]`) — eine Abweichung muss auffallen.
- **Negativkontrolle:** ein absichtlich verfälschtes Ergebnis muss ein Häkchen umkippen.
  Das ist die Pflicht-Assertion für N4.
- **Dreisprachig über alle Presets:** der Rechenweg muss in DE/EN/PT vollständig sein,
  ohne einen einzigen Platzhalter.

**Abzuliefern wie immer:** Modul + `<script src>` an der richtigen Stelle in beiden HTMLs
(nach `solver.js`), Ergebnis in der Zwischen-Statusseite sichtbar (entfällt mit N5),
DOM-Smokes erweitert, Harness um eine Sektion **S28** (Vollständigkeit je Schritt,
Negativkontrolle, i18n-Parität über alle Schritte, Determinismus, Nichtmutation).
**Recherche:** nicht nötig — N4 beschriftet nur, was N2/N2b/N3 belegt gerechnet haben.

**Später (nicht V1):** **Normprofil-Katalog** (IPE/HEA/HEB/UPE/UPN/RHS/Rohr, 2.2b Stufe 2),
unterbrochene Nähte, Loch-/Schlitznähte, weitere Kerbfälle, FKM-Richtlinie, Kranbau-Regelwerke,
AWS/US-Normen, EN 1993-1-8:2024 (2. Generation, β_w,mod — Werte noch nicht belegbar).

### 5.2 Etappenteilung der großen Bausteine *(Regel in Kickoff-Punkt 5c)*

> **Vorschlag, noch nicht endgültig.** Die Etappen eines Bausteins werden **unmittelbar vor
> dessen Bau** mit Dieter final abgestimmt und hier festgeschrieben — dann ist der Umfang
> jeder Lieferung klar, bevor Tokens ausgegeben werden. Die Reihenfolge innerhalb eines
> Bausteins ist so gewählt, dass **jede Etappe für sich lauffähig und prüfbar** ist.

**N5 — UI-Basis (vier Etappen):**
| Etappe | Inhalt | Am Handy prüfbar |
|---|---|---|
| **N5a** | Grundgerüst: beide HTMLs neu, `ui.js`, `style.css` — Kopfzeile mit Marke und Lizenzzeile, Sprachumschalter DE/EN/PT, Theme-Button mit **Start immer dunkel** (3.1), Info-ⓘ, Subbar, leeres Formulargerüst mit aufklappbaren Bereichen. Die Zwischen-Statusseiten aus N1–N3 fallen hier weg. | Sieht aus wie ein Programm, startet dunkel, drei Sprachen laufen |
| **N5b** | Eingabeseite: alle Auswahlgruppen aus `optionen.js` über **die** Filterfunktion, alle Felder aus `validate.js`, Freischalt-Haken, **„eigener Wert"-Haken überall**, Laien-ⓘ an jedem Feld, „Leeren" leert wirklich alles (3.1) | Man kann einen Fall wirklich eingeben |
| **N5c** | Ergebnisseite: Ergebnis-Kacheln, Ampel, Nahtbild-Grafik eingebunden, **Rechenweg aus N4 angezeigt**, Liste 2.4, Warnungen und ehrliche Lücken sichtbar | Ein vollständiger Nachweis von Eingabe bis Ergebnis |
| **N5d** | Block „Ausführung & Dokumentation" (ISO 5817 + EXC, ehrlich als nicht rechenwirksam beschriftet, 2.7) | Der Block klappt auf und erscheint in der Ausgabe |

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

**Nicht geteilt** (nach heutiger Einschätzung einteilig): N4, N6b, N7, N9, N10, N11, N12, N15.
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

**Referenzdateien (read-only, nur Muster):** `DT-ProfiPassung_Testversion-Orginal.html` ·
`DT-ProfiPassung.html` · `DT-ProfiPassung_Test.html`

### 8.1 Dateistand nach N3 *(Stand 2026-07-26)*

**Produktdateien:**
| Datei | Stand |
|---|---|
| `DT-ProfiSchweissnaht.html` | Voll-Edition (`DT_EDITION='full'`), lädt **11 Module**, enthält die **Zwischen-Statusseite N1/N2/N2b/N2c/N3** (entfällt mit N5) |
| `DT-ProfiSchweissnaht_Test.html` | Test-Edition — **verifiziert: Unterschied genau eine Zeile** |
| `daten.js` | N1, unverändert |
| `naht.js` | N2, unverändert — Schnittstelle in 4.5 |
| `profil.js` | N2b, unverändert — Schnittstelle in 4.6 |
| `svglib.js` | N2c, unverändert — Schnittstelle in 4.7 |
| `schaubild.js` | N2c, unverändert — Schnittstelle in 4.7 |
| `solver.js` | **N3** — Spannungen, beide Welten, Nachweis + Auslegung, Schnittstelle in 4.8 |
| `optionen.js` | **N3 geändert** — 20 Gruppen, 89 Optionen (neu: `a_rundung`, `weltb_nahtgruppe`) |
| `validate.js` | **N3 geändert** — 29 Felder (neu: Qy, Qz, My, Mz, Re) |
| `i18n_kern.js` | **N3 erweitert** — 322 → **435 Schlüssel** |
| `i18n_hilfe.js` | **N3 erweitert** — 50 → **57 Laien-ⓘ-Einträge** |
| `i18n_kerbfall.js` | Gerüst, unverändert (Füllung in N14) |
| `style.css` | N2c, unverändert (N3 nutzt die vorhandenen Klassen `kv`, `gap-note`, `status-banner warn`) |

**DEV-ONLY — nur in `/mnt/project/`, NIE ausliefern und nicht auf GitHub nötig:**
`test_naht.js` (580 Assertions, Sektionen S1–S27) · `dom_smoke_voll.js` (149 Prüfungen) ·
`dom_smoke_test.js` (150 Prüfungen, ruft den Lauf aus `dom_smoke_voll.js` auf).
⚠ **Beide Smoke-Dateien müssen im Projektordner liegen** — `dom_smoke_test.js` allein läuft nicht.

**Noch nicht gebaut:** `rechenweg.js` (N4) · `ui.js` (N5) · `symbol.js` (N6b) ·
`assistent.js` (N8) · `thermik.js` (N9) · `kosten.js` (N10) · `report.js` (N11) ·
`ermuedung.js` (N13) · `kerbfall.js` (N14) · `verzug.js` (N15).

**Am 2026-07-26 gegengeprüft:** Projektordner und GitHub tragen genau diesen Stand.
Alle 11 Module, `style.css`, beide HTMLs und die drei DEV-ONLY-Dateien sind vorhanden;
die Ladereihenfolge in der HTML zeigt auf lauter existierende Dateien; die drei Testläufe
sind **direkt aus dem Projektordner** grün gelaufen.

**Erste Handlung im neuen Chat:** Vollständigkeit gegen die Tabelle oben prüfen,
Arbeitsordner herstellen, die drei Testläufe starten.
Melden müssen sie **580 / 149 / 150 · 0 Fehler**. Weicht etwas ab, erst das klären.

---

## 9. Entscheidungslog

**Aus dem Konzeptgespräch 2026-07-23:**
- Beide Bemessungswelten umschaltbar; Welt B = klassisch; FKM für V1 verworfen.
- Alle vier Zusatzbereiche und alle drei Werkstoffgruppen in V1.
- Voller Umfang in V1, risikosortierte Reihenfolge mit Launch-Checkpoint nach N12.
- Freies Segment-Nahtbild als Kern, Standardfälle nur als Presets.
- Beide Rechenrichtungen (Nachweis + Auslegung) gehören in den Kern.
- Lasteingabe beides wählbar (Schnittgrößen direkt / Geometrie + Kraft).
- Ermüdung: kompletter Katalog als Ziel, Struktur vollständig, Füllung gestaffelt, selbst
  gezeichnete SVG-Skizzen, ehrliche Lücken statt Fehlwerten.
- Lastfall-Faktoren und Ermüdungs-Modul strikt getrennt, nie multipliziert.
- Assistent von Anfang an, aus einer einzigen Optionsquelle; rechnet nie selbst.
- Verfahren: MAG, MIG, WIG, E-Hand, UP. Presets: die 6 aus 2.11.
- Abdeckungsziel 75–80 %. Editionsweiche oben in der HTML. Claude testet vollständig selbst.

**Aus der Recherche (abgeschlossen 2026-07-24):**
- Welt-B-Quellenbasis: **Roloff/Matek primär**, Decker als zweite Quelle, DVS 1612 für
  Kerbfälle, FKM als Ausbaupfad.
- Vier Korrekturen für `daten.js` (siehe 6.1).

**Aus N1 (2026-07-25) — Festlegungen, die beim Bauen entstanden sind:**
- **Welt B kennt kein Aluminium.** Die klassischen Tabellenwerte (Decker/Roloff-Matek) decken
  nur Stahl ab; Aluminium verlangt EN 1999-1-1 mit WEZ-Entfestigung. In `optionen.js` ist
  Aluminium daher an Welt A gebunden — statt still mit unbelegten Zahlen zu rechnen.
- **Welt-B-Tabellenwerte liegen nur für S235 und S355 (Bewertungsgruppe B) belegt vor.**
  Für andere Werkstoffe greift der Formelweg σzul = Re/S · ν, ausdrücklich als *kein*
  Tabellenwert gekennzeichnet (sichtbare Lücke).
- **Abfragereihenfolge:** `nachweisverfahren` steht **nach** `nahtart` (das vereinfachte
  Verfahren ist ein Kehlnaht-Verfahren) — damit gibt es keine Vorwärtsabhängigkeit.
- **Filterregel:** Ist ein Bezugswert noch nicht gewählt, bleibt eine Option **sichtbar**
  (kein vorzeitiges Ausblenden). Beim **Bereinigen** nach einer Änderung gilt dagegen die
  strenge Regel: eine nicht mehr begründbare Auswahl fällt weg.
- **N1-Zwischenstand in den beiden HTMLs:** kleine Statusseite (Module, Zahlen, Sprachschalter,
  Lücken, Liste 2.4), damit das Fundament am Handy prüfbar ist. **Entfällt vollständig mit N5.**
- **rho_haz (Alu):** EN 1999-1-1 Tab. 3.2 ist geschützt; frei belegbar sind nur Bänder.
  Angesetzt wird der **konservative untere** Wert, sichtbar als Lücke, per „eigener Wert"
  überschreibbar.

**Aus der Abstimmung 2026-07-25 (Profileingabe):**
- **Profil erzeugt Segmente, nicht eine Länge** — sonst fehlt für Biegung/Torsion die Lage.
- **Zweistufig:** parametrisch in V1 (7 Profile, keine Recherche nötig), Normprofil-Katalog
  später als eigenes Datenpaket, gestaffelt und mit sichtbaren Lücken.
- **U-Profil von Dieter aus der Praxis ergänzt** (kommt oft vor) → Satz von 6 auf 7 erweitert.
- **Kantenauswahl ist eigene Pflichtabfrage** (rundum / Flanken / Stirn / Flansche / Steg).
- **Auswahl-Skizze = Live-Vorschau des gerechneten Nahtbilds**, kein separates Symbol →
  `svglib.js` + `schaubild.js` von N6 auf **N2c vorgezogen**.
- **Abdeckung 75–80 % ist Erfahrungseinschätzung, keine belegte Statistik** — so im Plan
  gekennzeichnet, steuert nur den Bauumfang.

**Aus N2 (2026-07-25) — Festlegungen, die beim Bauen entstanden sind:**
- **Zwei benannte Rechenmodelle statt eines stillen Kompromisses.** `exakt` rechnet die
  Nahtfläche als Rechteck a × l einschließlich des Eigenanteils in Dickenrichtung (a³-Glieder)
  und deckt sich exakt mit Voigt (HS Anhalt); `duennwandig` ist das klassische Linienmodell und
  deckt sich exakt mit Roloff/Matek. Voreinstellung ist `exakt`; das gewählte Modell wird im
  Ergebnis benannt und gehört in den Rechenweg. Der Unterschied liegt unter 0,1 % (durch
  Assertion abgesichert).
- **Torsion bei offenen Nahtbildern:** `naht.js` erkennt offene Enden selbst und meldet
  `msg_torsion_offenes_nahtbild` — die Ip-Methode ist dort eine Näherung ohne
  Wölbkrafttorsion (Recherchehinweis Voigt). Ehrlicher Hinweis statt stiller Rechnung.
- **Kreisnaht:** l = π·d mit dem **Außendurchmesser**; das wird als Hinweis
  `msg_kreis_aussendurchmesser` mitgeliefert und erscheint damit im Rechenweg.
- **Unsymmetrische Nahtbilder:** I_yz, Hauptachsen (I1, I2, α) werden mitgerechnet;
  α ist der Winkel, um den die Achsen zu drehen sind, damit I_yz verschwindet. Bei
  I_yz ≠ 0 erscheint `msg_hauptachsen_gedreht` (schiefe Biegung).
- **Segmenttypen in V1: `linie` und `kreis`.** Ein Kreisbogen wird nicht gebraucht — die
  Eckradien der Hohlprofile verkürzen die Segmente, sie werden nicht als Bögen gezeichnet.
- **`naht.js` bleibt dumm, wie geplant:** kein Endkraterabzug, keine Eckradien, keine
  Profilkenntnis. Das kommt vollständig aus `profil.js` (N2b).
- **Selbstprüfung im Ergebnis:** statische Momente um den Schwerpunkt = 0, Ip = Iy + Iz,
  I1 + I2 = Iy + Iz. Diese Häkchen speist N4 direkt in den Rechenweg ein.

**Aus N2b (2026-07-25) — Festlegungen, die beim Bauen entstanden sind:**
- **Raupenmodell statt Segmentliste.** Eine Kantenauswahl erzeugt Schweißraupen. Der
  Endkraterabzug greift **je freiem Ende einer Raupe**, nicht je Segment — innere
  Stoßstellen sind keine Endkrater. Abgezogen wird geometrisch (der Endpunkt wandert um a
  nach innen), damit stimmt auch die Lage. Umlaufende Raupen: kein Abzug.
- **Die Raupe wird erklärt, nicht erraten.** Ob eine Naht umläuft, sagt die Kantenauswahl —
  nicht die Geometrie. Nur so bleibt ein Rechteckrohr **mit Eckradien** korrekt „umlaufend",
  obwohl die Segmente sich rechnerisch nicht berühren.
- **Eckradien:** verkürzen die Segmente, der Bogen wird **nicht** mitgerechnet (dort entsteht
  keine saubere Kehlnaht mit dem angegebenen a-Maß). Ausgewiesen werden beide Zahlen:
  gerechneter Umfang und geometrischer Umfang mit Bögen. Weil `naht.js` die Ecklücken als
  offene Enden sieht, liefert `profil.js` `msg_eckluecke_keine_offene_naht` — **N3/N4 werten
  `umlaufend` aus, nicht `geschlossen`.**
- **`t1` wird doppelt genutzt** (Blechdicke / Wanddicke / Schenkeldicke), damit kein Maß
  zweimal abgefragt wird. Für I- und U-Profil kommen `tw` und `tf` dazu.
- **`flansche_steg` ist eine eigene Auswahl**, obwohl die Geometrie mit `rundum` identisch
  ist: vier einzeln geschweißte Raupen kosten 4 × 2·a. Genau dieser Unterschied wird von
  Hand am häufigsten übersehen — er ist jetzt sichtbar und durch Assertion abgesichert.
- **Winkel `flanken` ist EINE Raupe** um die Ecke herum (zwei freie Enden), keine zwei.
- **Verträglichkeitsregel:** ist ausdrücklich eine umlaufende Kehlnaht gewählt, bleibt bei
  der Kantenauswahl nur `rundum` übrig. Keine Sackgasse (55.104 Wege geprüft).
- **Abdeckung:** 7 Profile × 19 Kantenkombinationen, jede einzeln gegen `naht.js`
  nachgerechnet (A_w = Σ a·l als zweiter Rechenpfad).

**Aus N2c (2026-07-25) — Festlegungen, die beim Bauen entstanden sind:**
- **Die Grafik rechnet nichts.** Sie zeichnet ausschließlich die Segmente, die auch gerechnet
  werden, und holt den Schwerpunkt aus `naht.js`. Damit können Bild und Rechnung nie
  auseinanderlaufen — das war der ganze Grund, die Grafik von N6 vorzuziehen.
- **Der Maßstab hängt an der Kontur, nicht an der Naht.** Die Bounding-Box wird aus Naht
  **und** Kontur gebildet. Wählt der Anwender weniger Kanten, springt das Bild nicht — die
  Naht verschwindet nur. (Durch Assertion abgesichert: gleiche Skala bei rundum / Flansche /
  Steg.)
- **Die Kontur kommt aus einem zweiten `baue()`-Aufruf** mit `kanten:'rundum'` und
  `endkrater:false` — keine neue Schnittstelle. Ohne Endkraterabzug, weil die Kontur die
  **Bauteilkante** zeigt und keine Naht ist.
- **Ecklücken werden nicht geraten.** Sie werden ausschließlich über `info[].raupe` /
  `info[].geschlossen` erkannt: zwei aufeinanderfolgende Segmente **derselben Raupe**, die
  sich nicht berühren. Ohne `info[]` gibt es keine Markierung. Zusätzlich begrenzt eine
  Weite (halbe kleinste Bauteilseite), damit zwei getrennte Nahtstücke nie als Ecke
  fehlgedeutet werden.
- **Die Naht ist symbolisch strichbreit**, Lage und Länge dagegen maßstäblich. Das steht als
  Hinweis `msg_grafik_symbolisch` im Ergebnis — kein stiller Eindruck von Maßstäblichkeit.
- **Hilfslinien nutzen `currentColor`** (Kontur, Achsen, Ecklücken) und passen sich damit von
  selbst an Hell/Dunkel an; nur die sechs Segmentgruppen haben feste, unterscheidbare Farben.
- **Kein Text im SVG, auch keine Zahl** (4.3). Die Legende liefert nur Codes und Zahlen; der
  Text kommt aus dem i18n-Wörterbuch, die Zahl wird in der HTML formatiert. Damit ist die
  Grafik in allen drei Sprachen dieselbe Datei — wichtig für N6b und die 80–90 Kerbfälle.
- **Zweiter Rechenpfad in der Legende:** die Summe der Legendenlängen ist identisch mit
  `l_netto` aus `profil.js` — eine falsch gezeichnete Naht fiele sofort auf.

**Aus der Abstimmung 2026-07-26 (vor N3) — Aufrundung des a-Maßes:**
- Dieter hat die Entscheidung an Claude gegeben; festgelegt ist: **ganze mm als
  Voreinstellung, immer aufgerundet, umschaltbar auf halbe mm.** Ausformuliert in 2.3.
- **Begründung:** Das a-Maß ist ein Fertigungsmaß — auf der Zeichnung steht a4 oder a5, und
  der Schweißer stellt danach ein. Ein Ergebnis wie 4,37 mm täuscht eine Genauigkeit vor, die
  in der Werkstatt nicht existiert; das widerspräche dem Grundsatz „ehrliche Zahlen".
- **Warum keine Sprungreihe** (3, 4, 5, 6, 8, 10): a7 und a9 kommen vor, und wer von 6 auf 8
  aufrunden muss, verschenkt Schweißgut — bei gleichem a-Sprung wächst das Nahtvolumen
  überproportional (Kostenmodul N10 rechnet genau das aus).
- **Warum trotzdem halbe mm als Schalter:** bei t = 5 mm ist a_max = 0,7 · t = 3,5 mm — mit
  ganzen mm gäbe es dort zwischen a3 und a_max keine Stufe mehr.

**Aus der Abstimmung 2026-07-26 (Etappen bei großen Bausteinen):**
- **Anlass:** Dieter hat darauf hingewiesen, dass einige kommende Aufgaben mit einem
  Token-Kontingent nicht zu schaffen sind und ein **abgebrochener Chat** die Gefahr birgt,
  nicht richtig fortzusetzen. Das ist die richtige Sorge: eine Token-Pause ist harmlos
  (der Kontext bleibt), ein Chatwechsel mitten im Baustein ist es nicht.
- **Festgelegt:** Große Bausteine werden **vor** dem Bauen in Etappen zerlegt, jede einzeln
  lieferbar und abnehmbar. Ausformuliert in Kickoff-Punkt **5c**, Etappen in **5.2**.
- **Kernsatz:** *Nie mitten im Modul aufhören — immer an einer grünen Messung.* Ein
  Zwischenstand ist niemals „Datei halb geschrieben", sondern „läuft, aber Umfang noch offen".
- **Und ausdrücklich:** Halbfertiges wird bei einem Abbruch **verworfen, nicht gerettet.**
  Wiederherstellung aus dem Gedächtnis ist die gefährlichste Fehlerquelle des Projekts —
  gerade weil sie sich hilfsbereit anfühlt.
- **Klarstellung, die dabei nötig war:** Claude hatte zunächst vermutet, nach einer
  Token-Pause müsse der Plan neu gelesen werden. Das ist **falsch** — in diesem Chat gab es
  eine Pause, und der Kontext war danach vollständig da. Dieter hatte das aus zwei
  eigenen Durchläufen richtig eingeschätzt. Festgehalten, damit die Fehlannahme nicht
  in einem späteren Chat wiederkehrt.

**Aus der Rückmeldung 2026-07-26 (N3 abgenommen):**
- N3 von Dieter am Handy geprüft: beide Bemessungswelten nebeneinander, die Auslegung mit
  `a_erf` und `a_gewaehlt`, die fünf Hand-Anker und die sichtbare a_max-Warnung laufen in
  allen drei Sprachen. **Abgenommen.** Projektordner und GitHub sind auf diesem Stand.
- Damit ist die **Basislinie 580 / 149 / 150** verbindlich — sie darf nur noch wachsen.
- **Lehre aus diesem Chat, festgehalten für die nächsten Bausteine:** Der Harness hat drei
  eigene Fehler gefunden, die von Hand nicht aufgefallen wären (Randradius der Kreisnaht,
  a-abhängige Meldungen am falschen Bezugswert, `Re` fälschlich als Pflichtfeld) und die
  i18n-Prüfung zwei fehlende Übersetzungen. Deshalb bleibt es bindend: **nach jedem
  Teilschritt sofort messen**, nicht erst am Ende.

**Aus N3 (2026-07-26) — Festlegungen, die beim Bauen entstanden sind:**
- **Die Welten sind BAULICH getrennt, nicht nur durch Text.** Zwei Widerstandsbauer,
  jeder liefert nur die Felder seiner Welt: Welt A ohne `S`/`nu`/`Re`/`sigma_zul`,
  Welt B ohne `betaW`/`gammaM2`. Durch Assertions abgesichert. Ein Lastfall in Welt A
  wird ausdrücklich als wirkungslos gemeldet.
- **Das Umklappen ist der fachliche Kern.** Die quer wirkende Resultierende
  √(σ_x² + τ_n²) teilt sich mit 1/√2 auf σ⊥ und τ⊥ auf. Damit reproduziert der Code
  **beide** in R1 belegten Proben von selbst: Verhältnis der Verfahren √(3/2) = 1,2247
  bei Querzug, Gleichstand bei Längsbeanspruchung. Das war die Bestätigung, dass das
  Modell stimmt — nicht nur eine Formel, die plausibel aussieht.
- **Kreisnähte werden auf 72 Punkte verdichtet.** Die 8 Randpunkte aus `naht.js` genügen
  für die Querschnittswerte, nicht für das Spannungsmaximum. Wichtig dabei: der
  Randradius muss **derselbe** sein wie in `naht.js` (im Modell `exakt` die Außenkante
  (d+a)/2), sonst passt τ nicht zu W_t. Genau das war ein gefundener Fehler.
- **Auslegung: direkt auflösen, dann nachiterieren.** Im Modell `duennwandig` ist
  σ ∝ 1/a exakt, im Modell `exakt` wegen der a³-Glieder nur fast. Die Fixpunktiteration
  braucht 1 bis 7 Schritte und trifft η = 1 auf 1e-9.
- **Aufgerundet wird JE SEGMENT.** Bei unterschiedlichen a-Maßen (Steg/Flansch) wäre ein
  gemeinsamer Faktor ein Rechenergebnis, kein Fertigungsmaß. Jedes Segment bekommt sein
  eigenes ganzes (oder halbes) Millimeter — dadurch kann die Ausnutzung nur besser werden.
- **`a_max` wird je Segment geprüft**, mit der Dicke aus `info[].t` von `profil.js` —
  damit greift die in 2.2b geforderte segmentweise Dickengrenze wirklich.
- **Welt-B-Tabelle: keine erfundene Zuordnung.** Nahtart → Tabellenzeile lässt sich nicht
  belegt herleiten („mit Gegenlage" ist keine Eigenschaft der Nahtart). Deshalb wählt der
  Anwender die Zeile in der neuen, **nicht** pflichtigen Gruppe `weltb_nahtgruppe`; ohne
  Auswahl läuft ehrlich der Formelweg σ_zul = R_e/S·ν mit sichtbarem Hinweis. Der Lastfall
  wirkt nur im Tabellenweg — auch das wird gesagt.
- **β_Lw wird berechnet, aber nicht stillschweigend angewendet.** Bei l > 150·a erscheint
  die Warnung und der Beiwert steht im Ergebnis; angewendet wird er nur auf Wunsch.
- **Alu-WEZ ist Information, kein Nachweis.** ρ_haz, f_o,haz, f_u,haz und b_haz stehen im
  Ergebnis und sind ausdrücklich als **nicht** Teil des Nahtnachweises beschriftet — der
  Grundwerkstoff-Nachweis steht in der Liste 2.4.
- **Kurzform und Langform der Lasten:** Q = Q_z und M = M_y bleiben für den häufigen Fall,
  Qy/Qz/My/Mz kommen dazu. Sind beide mit **verschiedenen** Werten gefüllt, gibt es einen
  Fehler statt einer stillen Auswahl.
- **`Re` ist KEIN Pflichtfeld.** Beim Bauen zuerst als Pflicht angelegt — der Harness hat
  sofort gemeldet, dass dadurch die zweite Prüfstufe nicht mehr lief. Der Wert kommt aus
  der Werkstofftabelle und ist nur überschreibbar, wie `betaW`. Leitziel: wenige Eingaben.
- **N3 wertet `umlaufend` aus, nicht `geschlossen`** (Vorgabe aus 4.6): bei Hohlprofilen
  mit Eckradius bleibt die Torsionsrechnung gültig, statt eine falsche Warnung zu zeigen.
- **`t_min` wird selbst gebildet** aus `t1`/`t2`, wenn es nicht ausdrücklich angegeben ist.

**Aus der Rückmeldung 2026-07-26 (N2c abgenommen):**
- N2c von Dieter am Handy geprüft: beide Nahtbilder, Einfärbung nach Segmentgruppe,
  Ecklücken, Schwerpunkt und die dreisprachige Legende laufen. **Abgenommen.**
  Projektordner und GitHub sind auf diesem Stand.
- Damit ist die **Basislinie 382 / 102 / 103** verbindlich — sie darf nur noch wachsen.

**Aus der Rückmeldung 2026-07-25 (N1 abgenommen):**
- N1 von Dieter am Handy geprüft: läuft, alle Sprachumstellungen sauber. **Abgenommen.**
- **Neue bindende Vorgabe: die HTML startet immer im dunklen Design** (Schalter bleibt,
  nur der Startzustand ändert sich) → Umsetzung in N5, Prüfung im DOM-Smoke.

**Aus der Rückmeldung 2026-07-25 (N2b abgenommen):**
- N2b von Dieter am Handy geprüft: Profilkarte, Umfangs-Gegenüberstellung mit Eckbogen,
  Hand-Anker und Hinweise laufen in allen drei Sprachen. **Abgenommen.**
  Projektordner und GitHub sind auf diesem Stand.
- Damit ist die **Basislinie 309 / 79 / 80** verbindlich — sie darf nur noch wachsen.

**Aus der Rückmeldung 2026-07-25 (N2 abgenommen):**
- N2 von Dieter am Handy geprüft: Nahtbild-Karte, Hand-Anker-Häkchen und Selbstprüfung laufen
  in allen drei Sprachen. **Abgenommen.** Projektordner und GitHub sind auf diesem Stand.
- Damit ist die **Basislinie 208 / 55 / 56** verbindlich — sie darf nur noch wachsen.

**Aus der Abstimmung 2026-07-24 (dieser Chat):**
- Produktname **DT-ProfiSchweissnaht**, Repo `dt-profischweissnaht-web`, Projektdatei `.dts`.
- **11 Werkstoffsorten** in V1 (5 Stahl, 3 Edelstahl, 3 Alu).
- **ISO 5817 und ISO 2553 beide rein**, **EXC als reines Hinweisfeld** → gemeinsamer Block
  „Ausführung & Dokumentation"; ehrlich beschriftet als nicht rechenwirksam.
- **ISO 2553 wird N6b**, direkt nach der Grafik, damit vor dem Launch-Checkpoint fertig.
- **Kein Prüfstand** — Lieferung nur Voll-HTML + Test-HTML + Module.
- **Grenzen-Liste um 4 Punkte erweitert** (Lastannahmen, Sprödbruch/Kaltzähigkeit,
  Anschlusssteifigkeit, Terrassenbruch).
- **i18n: ein Schlüssel/drei Sprachen**, nach Themen getrennt — statt einer Datei je Sprache
  (Begründung in 4.2).
- **Eigene SVG-Bausteinbibliothek**, keine fremden Bilder (Begründung in 4.3).
- **Recherche just-in-time je Baustein**, nicht auf Vorrat.
- **Verträglichkeitsregeln** in `optionen.js` + Pflicht-Test gegen Sackgassen (3.4).
- **Laden = erst leeren**, Formatversion, ehrlicher Fehler statt Teil-Laden (3.5).
- **Kontextbezogene Beispielliste** über Preset-Merkmale (3.2).
- **Token-Pause: 4 Stunden.** Preisrichtwert 169 € (später final).
- Kerbfall-Startumfang (welche Details aus Dieters Praxis) wird **bei N13/N14** gefragt.

---

═══════════════════════════════════════════════════════════════════════════
Changelog
═══════════════════════════════════════════════════════════════════════════
**v1.0 (2026-07-23):** Erstfassung nach dem Konzeptgespräch (`Schweißnaht.md`).

**v2.0 (2026-07-24):** Recherche R1–R6 eingearbeitet, **alle offenen Fragen aus Abschnitt 0
geklärt**, Produkt umbenannt in DT-ProfiSchweissnaht, Bedienkonzept (Abschnitt 3) neu
aufgenommen, i18n- und SVG-Architektur festgelegt, N6b ergänzt, Prüfstand gestrichen,
Grenzen-Liste erweitert. **Diese Datei ersetzt `Schweißnaht.md`.**

**v2.1 (2026-07-25):** **Baustein N1 (Fundament) gebaut und ausgeliefert:** `daten.js`
(11 Werkstoffe, beide βw-Regelsätze, Welt-B-Tabellen, Geometriegrenzen, Verfahren, Fugenformen,
ISO 5817, EXC, Quellen- und Lückenverzeichnis), `optionen.js` (16 Gruppen, 68 Optionen,
Verträglichkeitsregeln, EINE Filterfunktion, Wegeaufzählung), `i18n_kern.js` (198 Schlüssel),
`i18n_hilfe.js` (32 Laien-ⓘ-Einträge), `i18n_kerbfall.js` (Gerüst), `validate.js`
(16 Felder, zweistufige Prüfung), `style.css`, beide HTMLs (Unterschied verifiziert: genau
eine Zeile). Vier Korrekturen aus 6.1 im Code verankert und durch Assertions abgesichert.
**Nächster Schritt: N2 (Nahtbild-Kern, `naht.js`).**

**v2.2 (2026-07-25):** N1 von Dieter am Handy geprüft und **abgenommen** (Sprachumschaltung
sauber). Neue bindende Vorgabe aufgenommen: **Startdarstellung immer dunkel** (Abschnitt 3.1,
Umsetzung in N5). Sonst unverändert.

**v2.3 (2026-07-25):** **Profileingabe abgestimmt und eingeplant.** Neuer Abschnitt 2.2b
(7 parametrische Profile inkl. **U-Profil**, Kantenauswahl als Pflichtabfrage, Endkraterabzug/
Eckradien/Dicke je Segment, Länge als überschreibbarer Vorschlag, Normprofil-Katalog als
Stufe 2 nach V1). Neue Bausteine **N2b** (`profil.js`) und **N2c** (Grafik, von N6 vorgezogen);
N6 entfällt, N6b nutzt `svglib.js` aus N2c; N7-Presets setzen auf `profil.js` auf.
Modulkarte um `profil.js` ergänzt.

**v2.4 (2026-07-25):** **Baustein N2 (Nahtbild-Kern) gebaut und ausgeliefert:** `naht.js`
(Segmente → A_w, Schwerpunkt, I_y, I_z, I_yz, I_p, Hauptachsen, W_y/W_z/W_t, Randpunkte,
offen/geschlossen, Selbstprüfung; Segmentbausteine, Verschieben, Drehen; zwei benannte
Rechenmodelle). Vier Hand-Anker geschlossen nachgerechnet (Rechteck-Nahtbild nach
Roloff/Matek, umlaufende Kehlnaht und Kreisnaht nach Voigt, reiner Steiner-Anteil), dazu
Invarianten (Verschieben, Drehen, Unterteilen, a-Verdopplung, Hauptachsen-Rückdrehung,
Nichtmutation, Determinismus). 16 Ergebnisgrößen und 9 Meldungen dreisprachig, Laien-ⓘ an den
8 Kerngrößen. Beide HTMLs zeigen den Kern live mit Häkchen (entfällt mit N5).
**Basislinie 128 → 208 Assertions · Smokes 39/40 → 55/56.**
**Nächster Schritt: N2b (Profileingabe, `profil.js`).**

**v2.5 (2026-07-25):** **N2 von Dieter am Handy geprüft und ABGENOMMEN**, Projektordner und
GitHub auf diesem Stand. Plan für den Wiedereinstieg in einem neuen Chat geschärft: neuer
Kickoff-Punkt **5b** (Reihenfolge beim Wiedereinstieg), neuer Abschnitt **4.5** (vollständige
Schnittstelle von `naht.js` — Segmentformate, Funktionen, Ergebnisfelder, Meldungscodes und
ausdrücklich das, was `naht.js` NICHT tut), neuer Abschnitt **8.1** (Dateistand: fertig /
DEV-ONLY / noch nicht gebaut), Modulkarte und Bausteintabelle mit Fertigkennzeichen,
Ladereihenfolge um Ist-Stand ergänzt. **Nächster Schritt unverändert: N2b (`profil.js`).**
**v2.6 (2026-07-25):** **Baustein N2b (Profileingabe) gebaut und ausgeliefert:** `profil.js`
(7 parametrische Profile, 19 Kantenkombinationen, Raupenmodell mit Endkraterabzug je freiem
Ende, Eckradien mit ehrlicher Gegenüberstellung von gerechnetem und geometrischem Umfang,
a-Maß je Segment für Steg und Flansch, Bauteildicke je Segment, Herkunfts-Code je Segment
als Futter für N2c/N4). `optionen.js` um die Gruppen `profil` und `kanten` erweitert
(18 Gruppen, 82 Optionen, Verträglichkeitsregel „umlaufende Kehlnaht ⇒ nur rundum",
55.104 Wege ohne Sackgasse), `validate.js` um 8 Profilmaß-Felder (24 Felder),
`i18n_kern.js` auf 307 Schlüssel und `i18n_hilfe.js` auf 50 Laien-ⓘ-Einträge erweitert.
Neuer Abschnitt **4.6** (vollständige Schnittstelle von `profil.js`). Hand-Anker geschlossen
nachgerechnet: Blech 2·(b+t), Rechteckrohr 2·(b+h)−8·r, Rundrohr π·d, I- und U-Profil
2·h+4·b−2·tw, Winkel 2·(b+h), Endkrater 2·a je offener Raupe.
**Basislinie 208 → 309 Assertions · Smokes 55/56 → 79/80.**
**Nächster Schritt: N2c (Nahtbild-Grafik, `svglib.js` + `schaubild.js`).**
**v2.7 (2026-07-25):** **N2b von Dieter am Handy geprüft und ABGENOMMEN**, Projektordner und
GitHub auf diesem Stand. Neuer Abschnitt **5.1** (ausformulierter Auftrag für N2c: `svglib.js`
und `schaubild.js`, Auto-Skalierung, Einfärbung nach Segmentgruppe, Schwerpunkt, gestrichelte
nicht geschweißte Kanten, sichtbare Ecklücken, kein Text im SVG), Kickoff-Punkt 5b um den
Verweis darauf ergänzt. Basislinie unverändert **309 / 79 / 80**.
**Nächster Schritt: N2c (Nahtbild-Grafik).**

**v2.8 (2026-07-26):** **Baustein N2c (Nahtbild-Grafik) gebaut und ausgeliefert:**
`svglib.js` (13 Grundbausteine: Linie, Polylinie/Polygon, Kreis, Rechteck, Nahtdreieck,
Kraftpfeil, Maßlinie, Schraffur, Beschriftungspunkt, Schwerpunktkreuz, Achsenkreuz, Rahmen,
SVG-Hülle; Bounding-Box, Auto-Skalierung mit gedrehter z-Achse, striktes Zahlformat,
**kein Text im SVG**) und `schaubild.js` (Segmente → SVG + Legendendaten: Einfärbung nach
Segmentgruppe, Schwerpunkt und Achsen aus `naht.js`, nicht geschweißte Kanten gestrichelt,
Ecklücken sichtbar, `ausProfil()` als Ein-Aufruf-Weg für die Oberfläche).
`i18n_kern.js` auf **322 Schlüssel** erweitert (6 Meldungen + 9 Beschriftungen), `style.css`
um Grafikrahmen und Legende ergänzt, beide HTMLs um die Karte „Nahtbild-Grafik" (zwei
Zeichnungen: rundum und nur Flanken, gleicher Maßstab).
Neuer Abschnitt **4.7** (vollständige Schnittstelle), Abschnitt **5.1** neu als Auftrag für
**N3**. Alle 19 Kantenkombinationen der 7 Profile durchgezeichnet und geprüft.
**Basislinie 309 → 382 Assertions · Smokes 79/80 → 102/103.**

**v2.9 (2026-07-26):** **N2c von Dieter am Handy geprüft und ABGENOMMEN**, Projektordner und
GitHub auf diesem Stand. Basislinie **382 / 102 / 103** verbindlich.
**Nächster Schritt: N3 (Spannungen + beide Welten, `solver.js`) — Auftrag in Abschnitt 5.1.**

**v2.10 (2026-07-26):** **Aufrundung des a-Maßes bei der Auslegung entschieden und
verankert** (Abschnitt 2.3 bindend, Auftrag 5.1 ergänzt, Begründung im Entscheidungslog):
ganze mm als Voreinstellung, immer aufgerundet, umschaltbar auf halbe mm, keine Sprungreihe,
`a_erf` und `a_gewaehlt` beide im Rechenweg, Nachprüfung gegen a_max nach dem Aufrunden.
Außerdem festgehalten: **für N3 ist keine zusätzliche Recherche nötig** — Welt A (beide
Verfahren, Umklappen der Naht, Verhältnis √(3/2) ≈ 1,22), Welt B (durchgerechnetes Beispiel
S235: 218 → 207 N/mm²) und Aluminium mit WEZ-Entfestigung sind in R1 und R3 belegt.
Code unverändert, **Basislinie unverändert 382 / 102 / 103**.
**Nächster Schritt: N3 bauen — im neuen Chat mit „weiter mit N3" einsteigen.**

**v2.11 (2026-07-26):** **Baustein N3 (Spannungen + beide Welten) gebaut und
ausgeliefert:** `solver.js` (Schnittgrößen N/Q_y/Q_z/M_y/M_z/T → σ⊥, τ⊥, τ∥ an jedem
Randpunkt mit Benennung des maßgebenden Punkts; Umklappen der Kehlnaht mit 1/√2;
durchgeschweißte Stumpfnaht ohne Umklappen; teilweise durchgeschweißt mit a − 2 mm;
allgemeine schiefe Biegung; Kreisnähte auf 72 Punkte verdichtet; Welt A mit beiden
Verfahren und dem Zusatznachweis σ⊥ ≤ 0,9·f_u/γ_M2; Welt B mit Tabellen- und Formelweg;
Aluminium über f_w mit ausgewiesener WEZ-Entfestigung und ohne β_w; Nachweis UND Auslegung
mit Aufrundung je Segment; Ampel; Grenzen a_min/a_max/l_eff/β_Lw; Liste 2.4 im Ergebnis).
`optionen.js` um `a_rundung` und `weltb_nahtgruppe` erweitert (**20 Gruppen, 89 Optionen**,
55.104 Wege ohne Sackgasse), `validate.js` um Qy/Qz/My/Mz/Re (**29 Felder**),
`i18n_kern.js` auf **435 Schlüssel**, `i18n_hilfe.js` auf **57 Einträge**, beide HTMLs um
die Karte „Spannungen und Nachweis" (Welt A und Welt B nebeneinander, Auslegung, fünf
Hand-Anker, sichtbare Warnungen). Neuer Abschnitt **4.8** (vollständige Schnittstelle),
Abschnitt **5.1** neu als Auftrag für **N4**.
Sechs Hand-Anker geschlossen nachgerechnet: Verhältnis der Verfahren √(3/2) = 1,2247,
Gleichstand bei Längsbeanspruchung, σ_v = √2·σ_w bei Querzug, Biegung gegen W_y,
Kreisnaht-Torsion gegen W_t, Welt-B-Lehrbuchbeispiel S235 → 207 N/mm².
Drei Fehler beim Bauen gefunden und behoben: Randradius der Kreisnaht passte nicht zu W_t,
a-abhängige Meldungen bezogen sich auf den Startwert statt auf das Ergebnis der Auslegung,
`Re` war fälschlich als Pflichtfeld angelegt (brach die zweite Prüfstufe).
**Basislinie 382 → 580 Assertions · Smokes 102/103 → 149/150 · i18n-Parität 0.**
**Nächster Schritt: N3 am Handy prüfen, dann N4 (Rechenweg).**

**v2.12 (2026-07-26):** **N3 von Dieter am Handy geprüft und ABGENOMMEN**, Projektordner
und GitHub auf diesem Stand — zusätzlich **gegengeprüft**: alle 11 Module, `style.css`,
beide HTMLs und die drei DEV-ONLY-Dateien liegen vollständig im Projektordner, die
Ladereihenfolge der HTML zeigt auf lauter existierende Dateien, und die drei Testläufe
sind direkt aus dem Projektordner grün. Basislinie **580 / 149 / 150** verbindlich.
Wiedereinstiegsliste 5b sauber neu numeriert (10 Schritte, Abschnitt 4.8 als Pflichtlektüre
für N4) und um einen **Vollständigkeitscheck des Projektordners** erweitert — ausgelöst
davon, dass `dom_smoke_voll.js` in diesem Chat einmal fehlte. Code unverändert.
**Nächster Schritt: N4 bauen — im neuen Chat mit „weiter mit N4" einsteigen.
Auftrag steht in Abschnitt 5.1, Schnittstelle von solver.js in Abschnitt 4.8.**

**v2.13 (2026-07-26):** **Etappenregel für große Bausteine aufgenommen** (Dieters
Festlegung, Begründung im Entscheidungslog): neuer Kickoff-Punkt **5c** mit dem Kernsatz
*„Nie mitten im Modul aufhören — immer an einer grünen Messung"*, dem Verfahren zur
Etappenfestlegung **vor** dem ersten Codezeichen und der harten Regel, dass Halbfertiges
bei einem Abbruch verworfen und nicht aus dem Gedächtnis rekonstruiert wird. Neuer
Abschnitt **5.2** mit der vorgeschlagenen Etappenteilung von **N5** (vier Etappen a–d),
**N8** (drei Etappen a–c) und **N13/N14**; die übrigen Bausteine bleiben einteilig.
Abschnitt 5 im Kopf entsprechend ergänzt. Außerdem richtiggestellt: eine Token-Pause
**erhält** den Chatkontext, nur ein Chatwechsel verliert ihn. Code unverändert,
Basislinie unverändert **580 / 149 / 150**.
**Nächster Schritt unverändert: N4 (Rechenweg) — Einstieg „weiter mit N4".**
═══════════════════════════════════════════════════════════════════════════
Ende Schweißnaht-1.md · DT-ProfiSchweissnaht
═══════════════════════════════════════════════════════════════════════════
