# 🔩 DT-ProfiSchweissnaht — Bauplan (Schweißnaht-1.md · alleinige Projektgrundlage)

## Schweißnahtberechnung für Stahlbau **und** Maschinenbau — statischer Nachweis, Ermüdung,
## Wärmeführung, Kosten, Verzug · dreisprachig (DE/EN/PT) · offline · Handy zuerst

> **Diese Datei ersetzt `Schweißnaht.md` vollständig.** Sie enthält den Stand nach dem
> Konzeptgespräch (2026-07-23), nach der abgeschlossenen Recherche (R1–R6), nach der
> Abstimmung vom **2026-07-24** (alle offenen Fragen aus Abschnitt 0 geklärt) und nach den
> abgenommenen Bausteinen **N1, N2, N2b, N2c, N3, N4, N5a, N5b und N5c** (Stand 2026-07-28).
> Sie ist so geschrieben, dass ein **neuer Chat ohne Vorwissen** damit weiterarbeiten kann.
> Einstieg dort: **„weiter mit N5d"** — dann der Reihenfolge in Kickoff-Punkt 5b folgen.

```
Plan-Version : 2.26 · Stand 2026-07-28
Status       : N1 (Fundament), N2 (Nahtbild-Kern), N2b (Profileingabe),
               N2c (Nahtbild-Grafik), N3 (Spannungen + beide Welten),
               N4 (Rechenweg), N5a (UI-Grundgerüst), N5b (Eingabeseite) und
               **N5c (N5c-1 „Es rechnet" + N5c-2 „Es erklärt sich")**
               von Dieter am Handy geprüft und ABGENOMMEN.
               Projektordner /mnt/project/ ist auf diesem Stand — am 2026-07-28
               gegengeprüft: alle 13 Module, style.css, beide HTMLs und die drei
               DEV-ONLY-Dateien liegen aktuell vor, die drei Testläufe sind direkt
               aus dem Projektordner grün.
               → NÄCHSTER SCHRITT: Etappe **N5d** — Einstieg „weiter mit N5d".
                 Inhalt: Block „Ausführung & Dokumentation" (ISO 5817 + EXC,
                 ehrlich als nicht rechenwirksam beschriftet, Abschnitt 2.7)
                 **+ Versionszeile im Info-ⓘ (Abschnitt 3.6)**.
                 ⚠️ VOR der Versionszeile nachzurüsten: **i18n_kern.js,
                 i18n_hilfe.js und i18n_kerbfall.js haben keine `VERSION`** —
                 nachgemessen am 2026-07-28, siehe 3.6.
                 Der Umfang von N5d ist vor dem Bau mit Dieter abzustimmen;
                 bei Punkt 1 zählt seine Praxissicht, welche Angaben wirklich
                 hingehören und welche nur Papier wären.
                 Schnittstellen: 4.5 (naht.js), 4.6 (profil.js),
                 4.7 (svglib.js + schaubild.js), 4.8 (solver.js),
                 4.9 (rechenweg.js), 4.10 / 4.10b / 4.10c (ui.js).
               Große Bausteine (N5, N8, N13, N14) werden in ETAPPEN gebaut — Regel in
               Kickoff-Punkt 5c, Etappen in Abschnitt 5.2.
Basislinie   : 822 Assertions · DOM-Smokes 448 (voll) + 449 (test) · i18n-Parität 0 Abweichungen
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
Einstiegssatz von Dieter: **„weiter mit N5d"**.
1. Diese Datei komplett lesen (`Schweißnaht-1.md`, sie ist die alleinige Grundlage).
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
   beide HTMLs und **alle drei** DEV-ONLY-Dateien. `dom_smoke_test.js` allein läuft nicht,
   sie ruft `dom_smoke_voll.js` auf — fehlt eine davon, zuerst bei Dieter nachfragen.
11. Arbeitsordner herstellen (Befehl unter Punkt 6 der Kickoff-Liste), dann
   `node test_naht.js`, `node dom_smoke_voll.js`, `node dom_smoke_test.js` laufen lassen
   und die Basislinie aus dem Plan-Kopf bestätigen (**822 / 448 / 449 · 0 Fehler**),
   **bevor** etwas gebaut wird. Weicht etwas ab, erst das klären.
   ⚠️ **Diese drei Läufe sind zugleich die Probe, ob Plandatei und Code zusammenpassen.**
   Steht im Kopfblock eine andere Basislinie als gemessen, ist eine der beiden Seiten alt —
   dann NICHT bauen, sondern erst mit Dieter klären. (Genau das ist am 2026-07-28
   passiert: der Ordner lieferte eine drei Etappen alte Plandatei zu neuem Code.)
12. Erst dann **N5d** bauen — Fließband nach Punkt 5 der Kickoff-Liste.
    **Der Umfang von N5d ist mit Dieter abzustimmen** (5.1); bei „Ausführung &
    Dokumentation" zählt seine Praxissicht.

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
- **`erfuellt`** ist der **Nachweis**: a ≥ a_min, a ≤ a_max, η ≤ 1, l ≥ l_eff. `false` heißt
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
| **N5** ⬅ | **UI-Basis — LAUFEND: N5a ✅, N5b ✅ und N5c ✅ abgenommen, NÄCHSTER SCHRITT N5d (Etappen in 5.2)** | 2 HTMLs, `style.css`, Formular mit aufklappbaren Bereichen und Freischalt-Haken, Ergebnis-Kacheln, Ampel, i18n, Theme (**Start immer dunkel**), Laien-ⓘ, Block „Ausführung & Dokumentation" (ISO 5817 + EXC). **Erster Handy-Test.** |
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

### 5.1 Auftrag für die nächste Etappe **N5d**

> **N5c IST GEBAUT UND ABGENOMMEN (2026-07-28).** Was unten ab „Auftrag für N5c-1" steht,
> ist damit **erledigt** und bleibt nur noch als Begründung stehen — dort ist nachlesbar,
> **warum** die Feldbereinigung so entschieden wurde und mit welchen Zahlen die drei
> Beispiele belegt sind. Gebaut wird daraus nichts mehr.
>
> **Der Auftrag für N5d ist NICHT vorentschieden** — anders als bei N5c-1. Er hat zwei
> Teile:
>
> **1. Block „Ausführung & Dokumentation"** (ISO 5817 Bewertungsgruppen + EXC nach
> EN 1090-2, ehrlich als **nicht rechenwirksam** beschriftet, Abschnitt 2.7).
> **Hier zählt Dieters Praxissicht:** welche Angaben wirklich hingehören und welche nur
> Papier wären. **Vor dem Bau abstimmen.**
>
> **2. Versionszeile im Info-ⓘ** (Abschnitt 3.6). ⚠️ **Zuerst nachrüsten:**
> `i18n_kern.js`, `i18n_hilfe.js` und `i18n_kerbfall.js` haben **keine `VERSION`** —
> am 2026-07-28 nachgemessen. Eine Zeile aus den Modulkennungen hätte sonst drei stille
> Löcher.
>
> Erwarteter Beleg: der Block klappt auf, und der Programmstand ist am Handy ablesbar.

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

**N5a und N5b sind gebaut; der Auftrag für N5c steht ausformuliert in 5.1.**
N5c und N5d werden jeweils **vor** ihrem Bau bestätigt.

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

**Referenzdateien (read-only, nur Muster):** `DT-ProfiPassung_Testversion-Orginal.html` ·
`DT-ProfiPassung.html` · `DT-ProfiPassung_Test.html`

### 8.1 Dateistand nach N5c *(Stand 2026-07-28)*

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
| `solver.js` | N3, unverändert — Schnittstelle in 4.8 |
| `rechenweg.js` | N4, unverändert — Schnittstelle in 4.9 |
| `optionen.js` | **N5c-1 erweitert** — 20 Gruppen, 89 Optionen (unverändert) **+ `BEISPIELE` (3) und `beispiel()`** |
| `validate.js` | **N5c-1 geändert** — **28 Felder** (`l` entfallen), `t1` profilabhängig Pflicht, `t2` freiwillig, Längenprüfungen in den Solver verlegt; **neu `normiert()` und `rechenEingabe()`** |
| `i18n_kern.js` | **N5c erweitert** — Beispielnamen, Ergebnis- und Rechenwegtexte, Quellenangaben, Klapptexte; überholte Ankündigungstexte richtiggestellt. ⚠️ **hat keine `VERSION`** (siehe 3.6) |
| `i18n_hilfe.js` | **N5c-1 minimal** — Laien-ⓘ zu `t2` sagt, was ohne Eingabe passiert; deckt alle 20 Gruppen und **28** Felder ab. ⚠️ **hat keine `VERSION`** (siehe 3.6) |
| `i18n_kerbfall.js` | Gerüst, unverändert (Füllung in N14). ⚠️ **hat keine `VERSION`** (siehe 3.6) |
| `style.css` | **N5c gewachsen** — dazu `.erg-box`, `.tile .tile-k`, `.rw-abschnitt`, `.rw-bilanz`, `.weg-box`, Grafik- und Legendenstile. **Die Klappmechanik brauchte keine neue Zeile** — sie nutzt die `.acc*`-Stile aus N5a |

**DEV-ONLY — nur in `/mnt/project/`, NIE ausliefern und nicht auf GitHub nötig:**
`test_naht.js` (**822 Assertions**, Sektionen S1–S32; in N5c kam **S31** (Beispiele) und
**S32** (Rechenweg/Grafik) dazu, S10 wurde umgehängt, S29/S30 geschärft) ·
`dom_smoke_voll.js` (**448 Prüfungen**) ·
`dom_smoke_test.js` (**449 Prüfungen**, ruft den Lauf aus `dom_smoke_voll.js` auf;
in N5c **unverändert**).
⚠ **Beide Smoke-Dateien müssen im Projektordner liegen** — `dom_smoke_test.js` allein läuft nicht.

**Noch nicht gebaut:** `symbol.js` (N6b) · `assistent.js` (N8) · `thermik.js` (N9) ·
`kosten.js` (N10) · `report.js` (N11) · `ermuedung.js` (N13) · `kerbfall.js` (N14) ·
`verzug.js` (N15).

**N5c-Lieferungen (2026-07-28):** N5c-1: `validate.js`, `optionen.js`, `profil.js`, `ui.js`,
`i18n_kern.js`, `i18n_hilfe.js`, `style.css`, `test_naht.js`, `dom_smoke_voll.js` ·
N5c-2: `ui.js`, `i18n_kern.js`, `style.css`, `test_naht.js`, `dom_smoke_voll.js` ·
Klappmechanik: `ui.js`, `i18n_kern.js`, `dom_smoke_voll.js`.
**Von N5c nie angefasst:** beide HTMLs, `daten.js`, `naht.js`, `svglib.js`, `schaubild.js`,
`solver.js`, `rechenweg.js`, `i18n_kerbfall.js`, `dom_smoke_test.js`.

**Von Dieter am 2026-07-28 bestätigt:** Der Projektordner `/mnt/project/` trägt genau
diesen Stand. Die N5c-Lieferungen sind eingespielt, am Handy geprüft und **abgenommen**.
Zusätzlich **gegengeprüft**: die drei Testläufe sind direkt aus dem Projektordner grün
(**822 / 448 / 449 · 0 Fehler**), `node --check` über alle 16 JS-Dateien ist sauber, und die
beiden HTMLs unterscheiden sich weiterhin in genau einer Zeile.
⚠️ **Beim Austausch sind zweimal Dateien verlorengegangen** (einmal die Plandatei, einmal
`style.css` und `test_naht.js`). Deshalb ist die Vollständigkeitsprüfung gegen die Tabelle
oben keine Formsache — sie hat beide Male den Verlust gefunden.

**Erste Handlung im neuen Chat:** Vollständigkeit gegen die Tabelle oben prüfen
(**13 Module**, `style.css`, beide HTMLs, **alle drei** DEV-ONLY-Dateien), Arbeitsordner
herstellen, die drei Testläufe starten.
Melden müssen sie **822 / 448 / 449 · 0 Fehler**. Weicht etwas ab, erst das klären —
nicht bauen.

**Was N5c überschreiben wird** (zur Vorwarnung, nicht als Auftrag): `ui.js` wächst um die
Ergebnisdarstellung und ruft dort **erstmals** Rechenmodule auf — die Assertion auf
Fachlogikfreiheit in S29/S30 muss dann bewusst umgestellt werden, statt sie stillschweigend
zu lockern. `style.css` und `i18n_kern.js` wachsen, Harness und DOM-Smokes wachsen mit.
Die Rechenmodule N1–N4 bleiben unberührt.

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

**Aus der Rückmeldung 2026-07-26 (N4 abgenommen):**
- N4 lief am Handy auf Anhieb sauber, in allen drei Sprachen. Keine Nacharbeit.
- Die **Trennung von Rechenprobe und Nachweis** hat sich am Beispielfall bewährt: die
  gelbe a_max-Warnung neben lauter grünen Häkchen war sofort als „die Naht trägt so
  nicht" lesbar und nicht als Programmfehler. **Diese Trennung ist ab jetzt bindend für
  jedes weitere Modul, das Häkchen anzeigt** — insbesondere N5c, N11 und N13.

**Aus N4 (2026-07-26) — Festlegungen, die beim Bauen entstanden sind:**
- **Rechenprobe und Nachweis sind ZWEI Häkchen, nicht eines.** Die erste Fassung hat beides
  in `haken` zusammengefasst — dann meldete die Selbstprüfung „nicht bestanden", nur weil
  das a-Maß unter a_min lag. Das ist ein Fehlalarm und macht das Warnsignal wertlos.
  Jetzt: `haken` = zweiter Rechenpfad (`false` ⇒ **Programmfehler**), `erfuellt` = Nachweis
  (`false` ⇒ **die Naht trägt so nicht**, ein ehrliches Ergebnis). Getrennt gezählt, getrennt
  gemeldet und in der Karte auch **optisch** getrennt dargestellt.
- **Der Rechenweg ist Daten, keine Zeichenkette.** Zahlen bleiben Zahlen, die Einsetz-Zeile
  ist eine Vorlage mit Platzhaltern. Erst `rendere(rw, sprache)` setzt Text und Zahlformat
  zusammen. Sonst wäre das Dezimalkomma in der Datenstruktur eingebacken und der Rechenweg
  auf Englisch falsch formatiert.
- **Keine Wörter in Formeln.** Die erste Fassung hatte „a_gew = AUFrunden(a_erf, Stufe)" —
  das wäre in EN und PT deutsch stehengeblieben. Formeln enthalten jetzt ausschließlich
  Symbole (`a_gew = ⌈a_erf / Δa⌉ · Δa`), Sprache lebt nur im Wörterbuch.
- **Der zweite Rechenpfad muss wirklich zweiter Pfad sein.** A_w, y_s/z_s und l_ges werden
  aus den Segmenten neu gebildet, ohne einen Wert aus `naht.js` anzufassen; σ_x aus der
  allgemeinen schiefen Biegung; τ über die Invarianz der Projektion (der Betrag der
  Schubresultierenden hängt nicht von der Projektionsrichtung ab — eine besonders billige
  und trotzdem scharfe Probe).
- **Testdaten-Falle, die dabei aufgefallen ist:** Am symmetrischen Nahtbild sind y_s und z_s
  exakt null — eine Verfälschung *mal einem Faktor* ändert die Null nicht und bleibt
  unbemerkt. Die Negativkontrolle läuft deshalb am **unsymmetrischen** Nahtbild. Nicht der
  Code war schwach, sondern der Testfall. Für alle künftigen Negativkontrollen merken.
- **Zwei vermeintliche Fehler waren meine Testeingaben**, nicht der Code: ein erfundener
  Zusatzwerkstoff-Code und ein absurdes Torsionsmoment. `solver.js` hat in beiden Fällen
  ehrlich gemeldet, woran es lag — genau wie vorgesehen.

**Aus der Vorbereitung von N5c (2026-07-27) — beide Punkte inzwischen ENTSCHIEDEN:**
- **Dieters Anregung: Beispiele für Vierkantrohr und H-Träger.** Antwort nach Nachmessen:
  **sinnvoll, aber als Schritt 1 von N5c, nicht davor.** Ein Beispiel ist nur
  *Auswahlzustand + Feldwerte*; die Übersetzung dieser Werte in das Solver-Format entsteht
  erst in N5c, und ob ein Beispiel fachlich taugt, sieht man erst am Ergebnis. Danach
  spart es bei jedem weiteren Handy-Test rund siebzehn Eingaben auf zwei Antipper.
  Der große Beispielkatalog bleibt **N7**. Vorschlag mit gegengerechneten Zahlen in 5.1.
- **Widerspruch zwischen `validate.js` und `profil.js` gefunden** (belegt, nicht vermutet):
  `validate.js` verlangt `l` und `t2` als Pflicht, `profil.js` rechnet die Nahtlänge bei
  geschlossenen Profilen aber selbst aus dem Umfang (Vierkantrohr 100×60, r=6 → 272 mm;
  H-Träger 200×100 an Flanschen und Steg → 788,8 mm) und kennt dort kein `t2`.
  **Muss vor dem Bau von N5c entschieden werden**, sonst fragt das Formular Werte ab, die
  niemand braucht — oder es fehlen welche.
- **Gute Nachricht dabei:** die Rechenkette selbst ist fertig. `DTNProfil.baue()` →
  `DTNSolver.rechne()` → `DTNRechenweg.ausErgebnis()` läuft für das Vierkantrohr heute
  schon vollständig durch (4 Segmente, umlaufend, 10 Rechenweg-Abschnitte, Ampel grün).
  **N5c muss nichts Neues rechnen — nur übersetzen und anzeigen.**

**Aus dem Gespraech ueber die Zeit NACH V1 (2026-07-27):**
- Dieter fuehrt die Arbeitsdateien bereits ausserhalb von GitHub mit und laedt sie zum
  Weiterarbeiten wieder hoch; nach V1 bleibt auf GitHub nur die fertige Version.
  **Das traegt** — der Verlust ist damit abgedeckt.
- **Die verbleibende Gefahr ist nicht der Verlust, sondern das Auseinanderdriften:** wird
  spaeter an der laufenden Version eine Kleinigkeit geradegezogen, ohne das Archiv der
  Pruefdateien mit anzufassen, prueft der Harness beim naechsten Hochladen einen Stand,
  den es nicht mehr gibt. Das ist genau der Fehler, gegen den 3.4 und 4.2 gebaut sind:
  zwei Quellen, die dasselbe behaupten.
- **Beschlossen: eine sichtbare Versionszeile** (neuer Abschnitt **3.6**). Alle Module
  tragen laengst eine Kennung, aber das Programm zeigt keine an. Kuenftig steht sie im
  Info-ⓘ und in jeder Ausgabe, **gebaut aus den Modulkennungen**, nicht von Hand
  gepflegt. Damit ist in zwei Sekunden am Handy ablesbar, welcher Archivstand zu dem
  gehoert, was gerade laeuft.
- **Und die Regel dazu:** das Archiv der Pruefdateien wird wie der Plan mitgefuehrt und
  am Ende der Entwicklung **nicht abgeraeumt**. Es wird gebraucht, sobald jemand die
  zweite Generation der EN 1993-1-8 nachzieht, β_w,mod belegt oder eine Werkstofftabelle
  aktualisiert — also genau dann, wenn sich niemand mehr an die Einzelheiten erinnert.

**Noch beim Nachmessen gefunden (2026-07-27), damit es N5c-1 nicht trifft:**
- **Das z-Mass ist eine Falle derselben Art wie `l`, nur gefaehrlicher.** `validate.js`
  rechnet `a = z / √2` — aber nur fuer die eigenen Pruefungen. `profil.baue()` kennt `z`
  nicht. Wer nur das z-Mass eintraegt, kommt durch die Pruefung und scheitert danach mit
  `msg_profil_a_fehlt` — ein Fehler, den kein Anwender einordnen kann.
  **Beschlossen:** die Umrechnung bleibt in `validate.js` und wird von dort **normiert
  herausgegeben**; `ui.js` setzt nur zusammen und rechnet weiterhin nichts. Damit haelt
  die Assertion „kein `Math.` in ui.js“.
- **`a_steg`/`a_flansch` muessen in `profil_eingabe` mit** — sonst rechnet das
  H-Traeger-Beispiel mit dem falschen a-Mass.
- **Die gesperrten Tabellenfelder duerfen nicht fuer immer leer bleiben.** `ui.js` darf
  `daten.js` nicht kennen, also startet das Formular dort leer. Nach dem Rechnen liefert
  aber `ergebnis.widerstand` genau diese Werte **samt Herkunftsangabe**. Vorschlag in 5.1:
  sie danach eintragen und die Herkunft dazuschreiben — sonst sieht eine bewusste
  Zurueckhaltung wie ein Programmfehler aus.

**Entscheidung 2026-07-27 zur Feldbereinigung (Dieter hat sie an Claude gegeben):**
- **`l` entfällt, `t1` wird profilabhängig, `t2` freiwillig.** Volle Begründung mit
  Messwerten in 5.1. Kurz: `profil.js` liefert die **Dicke je Segment** mit, und
  `solver.js` nutzt genau die — `t1`/`t2` sind nur Rückfallebene für einen Weg, den das
  Formular nie geht. Und `l` speiste in Stufe 2 nur eine gröbere Zweitfassung der
  Prüfung `l_eff,min = max(6a, 30)`, die der Solver längst je Segment aus der echten
  Geometrie macht. **Zwei Quellen für dieselbe Prüfung — genau das, was 3.4 verhindern soll.**
- **Bewusst NICHT gemacht:** `l` behalten und im Solver verdrahten. Das Rechenmodell ist
  eine Nahtgruppe in der Fügeebene (2.3); ihre Abmessungen *sind* die Profilmaße. Eine
  davon unabhängige Länge gäbe es dort nicht — sie einzubauen hieße, ein Konzept zu
  erfinden, das die Quellen nicht hergeben. **Der Preis ist benannt** (Naht kürzer als das
  Bauteil wird über das nahtrelevante Maß eingegeben) und gehört in die Liste 2.4.
- **Zwei Beispielzahlen mussten korrigiert werden — Claudes eigener Fehler**, gefunden
  durch Nachrechnen statt durch Vermuten: Ein Vierkantrohr mit 4 mm Wand lässt gar keine
  regelkonforme Kehlnaht zu (a_max 2,8 mm liegt unter a_min 3 mm). Und ein I-Profil, das
  um die Flansche geschweißt wird, warnt **immer**, weil die Flanschkante nur `t_f` lang
  ist (15 mm < 30 mm wirksame Mindestlänge). Beides ist keine Panne im Programm, sondern
  die Norm — und beides steht jetzt als Warnung in 5.1, damit es nicht wieder passiert.
- **N5c wird geteilt** (N5c-1 „Es rechnet", N5c-2 „Es erklärt sich"). Feldbereinigung,
  Beispiele, Übersetzung ins Solver-Format, Rechnen und Kacheln sind zusammen schon eine
  volle Etappe; Rechenweg und Grafik kämen sonst gehetzt hinterher.

**Aus der Rückmeldung 2026-07-27 (N5b abgenommen):**
- N5b von Dieter am Handy geprüft: **keine Fehler festgestellt**, keine Nacharbeit.
  Projektordner und GitHub sind auf diesem Stand.
- Damit ist die **Basislinie 724 / 385 / 386** verbindlich — sie darf nur noch wachsen.
- **Damit ist zum ersten Mal ein Fall wirklich eingebbar**: Auswahl, Felder, Laien-ⓘ,
  „eigener Wert" und die Prüfung laufen. Was fehlt, ist nur noch das Ergebnis — N5c.
- **Die Entscheidung „Formular erzeugen statt Markup pflegen" hat sich getragen**: beide
  HTMLs sind schlank geblieben, der Unterschied ist weiterhin genau eine Zeile, und die
  89 Optionen stehen nach wie vor nur an einer Stelle. Für N7 (Presets) und N8 (Assistent),
  die dieselbe Quelle nutzen, ist das die Voraussetzung.

**Aus der Abstimmung 2026-07-27 (vor N5b) — wie das Formular entsteht:**
- **Frage:** Markup für 18 Gruppen und 29 Felder von Hand in beide HTMLs schreiben, oder
  das Formular aus `optionen.js`/`validate.js` erzeugen?
- **Entschieden: erzeugen.** Handmarkup hätte die 89 Optionen ein zweites Mal geführt und
  jede spätere Änderung dreifach nötig gemacht — genau das, was 3.4 und 4.2 verhindern
  sollen. Dieter hat die Entscheidung an Claude gegeben mit der Auflage „gründlich prüfen".
- **Preis, bewusst bezahlt:** der Mini-DOM-Shim musste `appendChild` lernen und erzeugte
  Elemente registrieren. DEV-ONLY, das Produkt berührt es nicht.
- **Die N5a-Regel bleibt in der Sache erhalten:** *was der Anwender anklickt, bekommt eine
  Id.* Sie wird jetzt durch ein festes, im Harness geprüftes Id-Schema erfüllt (4.10b)
  statt durch Handmarkup. Der Grund für die Regel war die Prüfbarkeit, nicht die HTML.

**Aus N5b (2026-07-27) — Festlegungen, die beim Bauen entstanden sind:**
- **Milde Anzeige und strenge Bereinigung brauchen eine Brücke.** Der Smoke hat es sofort
  gefunden: `optionen.js` bietet „umlaufende Kehlnaht" an, solange die Stoßart nicht
  gewählt ist (milde Regel, N1-Log) — `bereinige()` löscht sie im selben Atemzug wieder
  (strenge Regel). Am Handy hätte der Anwender getippt und die Auswahl wäre verschwunden.
  `ui.js` holt eine so entfernte Auswahl deshalb zurück, **solange die milde Regel sie
  weiterhin anbietet**.
- **Die erste Fassung dieser Rücknahme war zu großzügig** und rettete auch Werte, deren
  Bezug gerade weggefallen war: Wechsel auf Welt B löschte „Aluminium", ließ aber den
  Aluminiumwerkstoff stehen. Jetzt gilt: **fiel ein Bezugswert gerade weg, wird nichts
  zurückgeholt** — die strenge Regel behält dort das letzte Wort. Beide Fälle sind als
  Assertion und im Smoke festgenagelt.
- **Eine Sichtbarkeitsregel, nicht zwanzig Sonderfälle.** Nicht-Pflichtfelder erscheinen
  erst, wenn die Leitauswahl ihres Bereichs getroffen ist (`leit`), bzw. wenn eine
  ausdrückliche Bedingung passt (`optional_wenn`). Sonst stünde am Handy die halbe
  Eingabeseite leer herum. Die Regel steht in 4.10b und wird geprüft.
- **`ui.js` darf `daten.js` nicht kennen** — deshalb bleiben die Tabellenwerte `betaW`,
  `nu`, `Re`, `a_steg` und `a_flansch` im Formular leer und gesperrt, statt dass die
  Oberfläche sie errät. Gesetzt werden sie vom Rechenkern in N5c. Nur die vier Werte mit
  Standard im Feldschema sind vorbelegt (γ_M2, γ_Mw, S, r_ecke).
- **„Leeren" ist jetzt scharf definiert:** exakt der Zustand der frisch geöffneten Seite.
  Das ist prüfbar — der Smoke vergleicht ein vorher aufgenommenes Sichtbarkeitsbild — und
  war vorher nur eine Formulierung.
- **„Berechnen" prüft, statt zu schweigen.** Ein Knopf, der am leeren Formular nichts tut,
  wirkt kaputt. Er läuft jetzt durch beide Prüfstufen von `validate.js`, markiert die
  betroffenen Felder und sagt ausdrücklich, dass das Rechnen in N5c folgt.
- **Ein Stilfehler, den nur das Nachrechnen fand:** die Klasse `.feld` aus N5a ist ein
  Container-Stil (`display:grid`) und saß nun auf echten Eingabefeldern. Neutralisiert,
  bevor es am Handy auffällt.
- **Für N5c vorgemerkt:** dort ruft `ui.js` **erstmals** Rechenmodule auf. Die Assertion
  auf Fachlogikfreiheit muss dann **bewusst umgestellt** werden (rendern erlaubt, rechnen
  weiterhin nicht) — nicht stillschweigend gelockert.


**Aus N5c-1 „Es rechnet" (2026-07-28) — Festlegungen, die beim Bauen entstanden sind:**
- **Die drei Beispiele sind DATEN in `optionen.js`, nicht in `ui.js`.** Ein Beispiel ist
  nichts als eine Menge von Auswahlcodes plus ein paar Zahlen. In `ui.js` wüsste die
  Oberfläche plötzlich Werkstoffe und Profile — genau das, was 4.10 ausschließt.
  **N7 wächst auf derselben Struktur weiter**, statt eine zweite Quelle aufzumachen.
- **Die zwei Längenprüfungen wurden UMGEHÄNGT, nicht gestrichen.** `l_eff ≥ max(6a; 30)`
  und `l ≤ 150·a` laufen jetzt je Segment im Solver an der echten Geometrie. Vor dem Umbau
  nachgemessen (Blech, Flankennähte, t 20): b 35/a 5 meldet zu kurz · b 1008/a 4 meldet
  zu lang · b 608/a 4 — genau 150·a — meldet nichts. Aus 3 Assertions wurden 6.
- **Die Übersetzung Formular → Rechenkern gehört in `validate.js`.** Die Umrechnung
  `a = z/√2` stand dort ohnehin schon, und welches Feld eine Abmessung ist und welches eine
  Last, weiß das Feldschema. Hätte `ui.js` das zusammengesetzt, wäre dieselbe Kenntnis
  zweimal im Programm — und `ui.js` müsste rechnen.
- **Die gesperrten Tabellenfelder werden nach dem Rechnen gefüllt**, mit den Werten, mit
  denen wirklich gerechnet wurde, samt Herkunft im Titel. Zugeordnet wird über den
  **Feldnamen**, nicht über Fachwissen; ein gesetzter „eigener Wert"-Haken bleibt
  unangetastet. Ohne das sähe bewusste Zurückhaltung wie ein Fehler aus.
- **Zwei echte Fehler, die erst der Test gefunden hat:** (1) Beim Sprachwechsel blieben die
  Zahlen in den Ergebnis-Kacheln im alten Format stehen — auf Englisch stand ein deutsches
  Dezimalkomma. Grund: Zahlen sind Werte und tragen kein `data-i18n`, also fasst sie
  `uebersetze()` nicht an; `setSprache()` setzt das Ergebnis jetzt neu. (2) Der
  Ergebnis-Platzhalter wurde per `innerHTML` zerstört und neu gebaut — dadurch gab es seine
  Id zweimal. Er wird jetzt nur noch ein- und ausgeblendet.
- **Bewusste Doppelung auf Zeit, benannt und wieder aufgelöst:** Das Zahlformat steckte in
  N5c-1 vorläufig in einer kleinen Hilfsfunktion in `ui.js`, weil der Rechenweg dort noch
  nicht aufgerufen werden durfte. **In N5c-2 abgelöst** durch `rechenweg.zahl()`.

**Aus N5c-2 „Es erklärt sich" (2026-07-28):**
- **Die Erlaubnisliste für `ui.js` wuchs um ZWEI Namen, nicht um einen.** Der Vorlauf hatte
  „wieder genau einen" notiert; N5c-2 bringt aber zwei Anzeigen — Rechenweg **und**
  Schaubild. Beide sind reine Anzeige-Module: sie rechnen den Nachweis nicht noch einmal.
  Die Grenze ist damit **geschärft, nicht aufgeweicht** (4.10c).
- **Die Zeichenketten-Prüfung trifft auch Kommentare — beim Bauen zweimal zugeschnappt**
  (einmal wegen `Math.`, einmal wegen eines Modulnamens im Fließtext eines Kommentars).
  Das ist keine Aufweichung wert: die Prüfung ist gut, nur stumpf. **Regel: in `ui.js` die
  verbotenen Namen auch in Kommentaren nicht schreiben.**
- **Ein vermeintlicher Fehler, der keiner war — und warum das wichtig ist:** Die Anzeige
  zeigte **22** Rechenproben-Häkchen, `rechenweg.js` zählte **21**. Nachgemessen statt
  angepasst: die Summenzeile der Selbstprüfung wird erst **nach** dem Zählen gebildet und
  **zählt sich selbst nicht mit** — so steht es im Quelltext. Nicht das Modul war falsch,
  sondern die Assertion. Sie prüft jetzt `angezeigt = gezählt + 1` **mit Begründung**,
  damit niemand später „korrigiert", was Absicht ist.

**Aus der Abnahme von N5c-2 (2026-07-28) — Rückmeldung Dieter:**
- **Der Rechenweg ist aufklappbar**, wie im Schwesterprogramm DT-ProfiPassung. Zehn
  Abschnitte mit über dreißig Schritten sind am Handy sonst eine Wand zwischen Ergebnis
  und Seitenende.
- **Gebaut mit der VORHANDENEN Mechanik, nicht mit einer zweiten.** `klappBereich()`
  erzeugt dieselben `acc*`-Ids und -Klassen wie die statischen Bereiche aus N5a,
  `schalte`/`umschalten` blieben unverändert. Es brauchte **keine neue CSS-Zeile**.
- **Was NICHT hinter die Klappe gehört — bewusst entschieden:** die Bilanz der
  Selbstprüfung und die **Liste 2.4 der ehrlichen Lücken** bleiben ohne Antippen sichtbar.
  Nur die Einzelschritte klappen zu. **Eine Lücke, die man erst aufklappen muss, wäre
  wieder eine stille Lücke** — genau das, was 2.4 verhindern soll.

**Zum Verfahren (2026-07-28) — zweimal teuer gelernt:**
- **Der Projektordner wird beim Chat-Start eingelesen und kann veraltet sein.** Zu Beginn
  dieses Chats lag dort die Plandatei als v2.17 zu Code auf N5b-Stand; ein Vorlauf war
  daran schon einmal gescheitert. **Die drei Testläufe sind die Probe:** melden sie eine
  andere Basislinie als der Kopfblock, ist eine der beiden Seiten alt — dann klären, nicht
  bauen.
- **Beim Dateiaustausch sind zweimal Dateien verlorengegangen** (einmal die Plandatei,
  einmal `style.css` und `test_naht.js`). Die Vollständigkeitsprüfung gegen die Tabelle in
  8.1 ist deshalb **keine Formsache** — sie hat beide Male den Verlust gefunden.
- **Fehlende Plan-Abschnitte werden aus dem CODE neu hergeleitet, nicht aus dem Gedächtnis
  rekonstruiert.** Eine Plandatei mit still fehlenden Passagen ist schlimmer als eine, die
  ihre Lücken benennt.

**Aus der Rückmeldung 2026-07-27 (N5a abgenommen):**
- N5a von Dieter am Handy geprüft: die Oberfläche startet dunkel, die drei Sprachen laufen
  durch, die acht Bereiche klappen auf und zu. **Abgenommen, ohne Nacharbeit.**
  Projektordner und GitHub sind auf diesem Stand.
- Damit ist die **Basislinie 679 / 234 / 235** verbindlich — sie darf nur noch wachsen.
- **Damit ist zum ersten Mal ein Programm sichtbar**, kein Prüfstand: die Zwischen-Statusseite
  aus N1–N4 ist ersatzlos entfallen und kommt nicht zurück.

**Aus N5a (2026-07-26) — Festlegungen, die beim Bauen entstanden sind:**
- **Das Formulargerüst steht als Markup in der HTML, nicht als Zeichenkette in `ui.js`.**
  Der erste Entwurf hätte die Bereiche per `innerHTML` erzeugt — dann wäre jeder Kopf nur
  Text gewesen und im DOM-Smoke nicht anklickbar. Jetzt hat jeder Bereich echte Elemente
  mit eigener Id (`accBtn_*`, `accBody_*`, …); der Smoke klickt sie wirklich an. **Regel für
  N5b/N5c:** was der Anwender anklickt, bekommt eine Id — sonst ist es nicht prüfbar.
- **`ui.js` startet im Browser selbst, in Node nicht.** Dadurch läuft im DOM-Smoke die
  echte Oberfläche gegen den Shim, statt eine nachgebaute. Der Preis: `ui.js` darf nur
  DOM-Mittel benutzen, die der Shim kennt (Ids, Klassen, `querySelectorAll`, `hidden`,
  `classList`, `addEventListener`) — kein Baumlaufen, kein `closest`, kein Bubbling.
- **Der Mini-DOM-Shim musste dafür neu geschrieben werden**: er liest jetzt echte Attribute
  aus der HTML (`data-i18n`, `hidden`, `class`, `value`) statt nur Ids einzusammeln.
  Das war der eigentliche Aufwand von N5a — und die Grundlage für alle weiteren UI-Etappen.
- **Start dunkel steht doppelt fest:** `data-theme="dark"` schon im `<html>`-Tag (damit beim
  Öffnen nichts hell aufblitzt) **und** in `ui.js` als `START_THEME`. Beides wird geprüft.
- **`ui.js` deklariert seine Anforderungen selbst** (`IDS`, `KLASSEN`, `BEREICHE`,
  `GERUEST_BUTTONS`) — der Harness hält sie gegen HTML und `style.css`. Genau das hat beim
  Bauen sofort einen echten Fehler gefunden: die Klasse `.norm` stand in der HTML, aber
  nicht in `style.css`. Ohne diese Prüfung wäre es niemandem aufgefallen.
- **Nicht verdrahtete Knöpfe melden das ehrlich** („folgt in N7 / N8 / N11") statt still
  nichts zu tun. Ein Knopf, der scheinbar kaputt ist, ist schlimmer als einer, der sagt,
  dass er noch nicht dran ist — und die Meldung ist dreisprachig wie alles andere.
- **Der Info-ⓘ ist ein Dialog geworden, kein `alert()`.** Ein `alert` sieht am Handy nach
  Fehler aus, nicht nach Programm; der Dialog trägt Produkttext, Edition, Disclaimer,
  Regelwerke und Impressum.
- **Bewusst mitgenommen, obwohl in 5.1 nicht ausdrücklich gefordert:** der Knopf
  „Assistent starten" (3.3 verlangt einen auffälligen Einstieg) und drei leere
  Ergebniskarten (Ergebnis, Nahtbild, Rechenweg). Beides ist reines Gerüst und macht am
  Handy sichtbar, wohin N5c zielt.
- **Die Zwischen-Statusseite ist ersatzlos weg.** Damit sind rund 80 Smoke-Prüfungen
  entfallen und über 130 neue an ihre Stelle getreten. Festgehalten, damit die
  schrumpfende Teilzahl später niemanden verwirrt: die Rechenkerne hängen am Harness,
  nicht am Smoke.

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

**v2.14 (2026-07-26):** **Baustein N4 (Rechenweg) gebaut und ausgeliefert:**
`rechenweg.js` (Schrittliste als Daten statt als Text: 11 Abschnitte, 42 Schrittcodes,
18 Probencodes, 8 benannte Grundlagen; `baue()` und `ausErgebnis()` als Einstiege,
`rendere(rw, sprache)` setzt erst beim Rendern Text und Zahlformat zusammen;
DE/PT mit Dezimalkomma, EN mit Dezimalpunkt; **zweiter Rechenpfad an fast jedem Schritt**;
die Häkchen aus `naht.js` und die Liste 2.4 stehen als eigene Zeilen im Weg).
**Rechenprobe und Nachweis baulich getrennt** (`haken` / `erfuellt`, `selbstpruefung_ok` /
`nachweis_ok`) — Begründung im Entscheidungslog.
`i18n_kern.js` auf **520 Schlüssel**, `i18n_hilfe.js` auf **64 Laien-ⓘ-Einträge**,
beide HTMLs um die Karte „Rechenweg" (Auslegungsbeispiel S355, N = 600 kN: a_erf = 7,793 mm
→ gewählt a8, danach ehrliche a_max-Warnung nach Regel 2.3).
Neuer Abschnitt **4.9** (vollständige Schnittstelle), Abschnitt **5.1** neu als Auftrag für
**N5a**, Kickoff-Punkt 5b auf N5a umgestellt.
Harness-Sektion **S28**: elf Rechenpfade durchgerechnet, Verzeichnisse gegen die Texte
geprüft, Zahlformat je Sprache, Determinismus, Nichtmutation, leerer Fehlerfall,
Abschnittsreihenfolge — und die **Pflicht-Negativkontrolle: 27 verfälschte Ergebniswerte
kippen alle ein Häkchen** bei einer Verfälschung von nur 1e-6 relativ.
Fünf Hand-Anker stehen jetzt im Rechenweg selbst (A_w, σ_x, Umklappen, σ_v = √2·σ_x, R_d).
**Basislinie 580 → 641 Assertions · Smokes 149/150 → 182/183 · i18n-Parität 0.**
**Nächster Schritt: N4 am Handy prüfen, dann N5a (UI-Grundgerüst).**

**v2.15 (2026-07-26):** **N4 (Rechenweg) von Dieter am Handy geprüft und ABGENOMMEN** —
ohne Nacharbeit, in allen drei Sprachen. Projektordner und GitHub tragen diesen Stand.
Plan-Kopf, Bausteintabelle und Abschnitt 8.1 auf den abgenommenen Stand gesetzt;
die Vorbedingung „erst N4 prüfen" in 5.1 entfällt. Im Entscheidungslog festgehalten:
**die Trennung von Rechenprobe (`haken`) und Nachweis (`erfuellt`) ist ab jetzt bindend
für jedes Modul, das Häkchen anzeigt** — sie hat sich am Beispielfall bewährt.
In 8.1 zusätzlich eine Vorwarnung, was N5a überschreiben wird (beide HTMLs vollständig,
`style.css`, neu `ui.js`) — die Rechenmodule N1–N4 bleiben unberührt.
**Basislinie unverändert und verbindlich: 641 Assertions · Smokes 182/183 · i18n-Parität 0.**
**Nächster Schritt: N5a (UI-Grundgerüst) — Einstieg „weiter mit N5a".**
**v2.16 (2026-07-26):** **Baustein N5, Etappe N5a (UI-Grundgerüst) gebaut und
ausgeliefert:** `ui.js` neu (Sprachumschaltung DE/EN/PT über `data-i18n` /
`data-i18n-title` / `data-i18n-ph`, Theme mit **Start immer dunkel**, acht aufklappbare
Bereiche, „Leeren" leert wirklich alles, Info-Dialog mit Impressum, Editionsweiche
mit Testbalken — **ohne jede Fachlogik**, durch Assertion abgesichert).
**Beide HTMLs vollständig neu**: Kopfzeile mit Marke, Untertitel und Lizenzzeile,
Flaggen-Sprachumschalter, Theme- und Info-Knopf, Subbar (Beispiel, Assistent, Berechnen,
Leeren), **Aktionsleiste oben** (Bezeichnung, Speichern, Öffnen, Drucken/PDF, Word),
leeres Formulargerüst mit acht Bereichen, drei leere Ergebniskarten, Fußzeile mit
Disclaimer und Impressum. **Die Zwischen-Statusseite aus N1–N4 ist entfallen** — es gibt
nur noch ein Inline-Skript: die Editionsweiche. Unterschied der beiden HTMLs weiterhin
**genau eine Zeile** (jetzt zeilenweise durch Assertion verifiziert).
`style.css` stark gewachsen (Aktionsleiste, Aufklappbereiche, Formularraster,
Ergebniskacheln, Ampel, Rechenwegzeilen mit **getrennten** Klassen für Rechenprobe und
Nachweis, Dialog), `i18n_kern.js` auf **552 Schlüssel**.
Neuer Abschnitt **4.10** (Schnittstelle von `ui.js`), Abschnitt **5.1** neu als
Auftragsvorschlag für **N5b** (vor dem Bau zu bestätigen), **5.1b** hält fest, was N5a
geliefert hat; Kickoff-Punkt 5b auf N5b umgestellt.
Harness-Sektion **S29**: Gerüstvollständigkeit (alle 28 Pflicht-Ids in beiden HTMLs, alle
37 Klassen in `style.css`, jede in der HTML benutzte Klasse in der CSS, jede eingebundene
Datei wirklich im Ordner), Editionsgleichheit zeilenweise, dreisprachige Belegung jedes
i18n-Schlüssels der HTML, Fachlogikfreiheit von `ui.js`.
`dom_smoke_voll.js` **neu geschrieben**: der Mini-DOM-Shim liest jetzt echte Attribute und
kann `querySelectorAll`; er startet `ui.js` real und klickt Sprache, Theme, alle acht
Bereiche, Leeren, Info-Dialog und die Aktionsleiste durch.
Ein echter Fehler beim Bauen gefunden und behoben: die Klasse `.norm` stand in der HTML,
aber nicht in `style.css`.
**Basislinie 641 → 679 Assertions · Smokes 182/183 → 234/235 · i18n-Parität 0.**
**Nächster Schritt: N5a am Handy prüfen, dann N5b (Eingabeseite) abstimmen und bauen.**
**v2.17 (2026-07-27):** **N5a (UI-Grundgerüst) von Dieter am Handy geprüft und
ABGENOMMEN** — ohne Nacharbeit: startet dunkel, drei Sprachen laufen durch, die acht
Bereiche klappen auf und zu. Projektordner `/mnt/project/` und GitHub Pages tragen diesen
Stand (13 Module, `style.css`, beide HTMLs, drei DEV-ONLY-Dateien).
Plan-Kopf, Bausteintabelle, Etappentabelle 5.2 und Abschnitt 8.1 auf den abgenommenen
Stand gesetzt; die Vorbedingung „erst N5a prüfen" in 5.1 entfällt; Kickoff-Punkt 5b ohne
Vorbehalt auf **„weiter mit N5b"**. Code unverändert.
**Basislinie unverändert und verbindlich: 679 Assertions · Smokes 234/235 · i18n-Parität 0.**
**Nächster Schritt: N5b (Eingabeseite) — Einstieg „weiter mit N5b". Auftragsvorschlag in
Abschnitt 5.1, Umfang vor dem Bau bestätigen. Schnittstelle von `ui.js` in Abschnitt 4.10.**
**v2.18 (2026-07-27):** **Baustein N5, Etappe N5b (Eingabeseite) gebaut und ausgeliefert.**
Vor dem Bau entschieden: **das Formular wird aus `optionen.js`/`validate.js` erzeugt**,
nicht als Markup gepflegt (Begründung im Entscheidungslog).
`ui.js` erzeugt jetzt **18 Auswahlgruppen und alle 29 Felder** mit festem, im Harness
geprüftem Id-Schema; **DIE eine Filterfunktion** ist verdrahtet, dazu „eigener Wert"-Haken
an den 9 überschreibbaren Werten, **Laien-ⓘ an jeder Gruppe und jedem Feld** als eigener
Dialog, die vier **Freischalt-Haken** (standardmäßig aus) und ein **Prüfkasten**:
„Berechnen" läuft durch beide Stufen von `validate.js` und markiert die betroffenen Felder
— **gerechnet wird nicht, das folgt in N5c**. „Leeren" ist scharf definiert als *exakt der
Zustand der frisch geöffneten Seite* und wird gegen ein aufgenommenes Sichtbarkeitsbild
geprüft. `iso5817` und `exc` bleiben ausdrücklich für **N5d** stehen, mit ehrlichem Hinweis
statt leerer Fläche.
Beide HTMLs um acht Anker, Prüfkasten und Hilfe-Dialog erweitert — **Unterschied weiterhin
genau eine Zeile**. `style.css` um Feldzeilen, gesperrte Felder, fehlerhafte Zeilen,
Zusatzhaken, Prüfkasten und Hilfetexte gewachsen; `i18n_kern.js` auf **568 Schlüssel**.
`dom_smoke_voll.js` um `appendChild` samt Registrierung erzeugter Elemente erweitert (sonst
prüfte der Smoke eine Oberfläche, die es so nicht gibt). Neue Harness-Sektion **S30**:
Zuordnung vollständig und doppelfrei, alle Beschriftungen und Einheiten dreisprachig,
Laien-ⓘ lückenlos, jeder Textschlüssel aus `ui.js` belegt, Id-Schema in beiden HTMLs,
und die Filterregel selbst festgenagelt.
Neuer Abschnitt **4.10b** (Schnittstelle der Eingabeseite), Abschnitt **5.1** neu als
Auftragsvorschlag für **N5c**, **5.1b** hält N5a und N5b fest; Kickoff-Punkt 5b auf N5c
umgestellt.
**Drei echte Fehler beim Bauen gefunden und behoben:** eine gerade getroffene Auswahl
verschwand durch die strenge Bereinigung wieder; die erste Korrektur rettete umgekehrt zu
viel (Alu-Werkstoff überlebte den Wechsel auf Welt B); und die Container-Klasse `.feld`
saß auf echten Eingabefeldern.
**Basislinie 679 → 724 Assertions · Smokes 234/235 → 385/386 · i18n-Parität 0.**
**Nächster Schritt: N5b am Handy prüfen, dann N5c (Ergebnisseite) abstimmen und bauen.**
**v2.19 (2026-07-27):** **N5b (Eingabeseite) von Dieter am Handy geprüft und ABGENOMMEN** —
ohne Nacharbeit, keine Fehler festgestellt. Projektordner `/mnt/project/` und GitHub Pages
tragen diesen Stand; zusätzlich **gegengeprüft**: alle 13 Module, `style.css`, beide HTMLs
und die drei DEV-ONLY-Dateien liegen vollständig vor, `node --check` über alle 16 JS-Dateien
ist sauber, die drei Testläufe sind direkt aus dem Projektordner grün und die beiden HTMLs
unterscheiden sich in genau einer Zeile.
Plan-Kopf, Bausteintabelle, Etappentabelle 5.2 und Abschnitt 8.1 auf den abgenommenen Stand
gesetzt; die Vorbedingung „erst N5b prüfen" in 5.1 entfällt. Im Entscheidungslog festgehalten,
dass sich die Entscheidung *Formular erzeugen statt Markup pflegen* getragen hat — sie ist
die Voraussetzung dafür, dass N7 (Presets) und N8 (Assistent) dieselbe einzige Optionsquelle
nutzen können. Code unverändert.
**Basislinie unverändert und verbindlich: 724 Assertions · Smokes 385/386 · i18n-Parität 0.**
**Nächster Schritt: N5c (Ergebnisseite) — Einstieg „weiter mit N5c". Auftragsvorschlag in
Abschnitt 5.1, Umfang vor dem Bau bestätigen. Schnittstellen: `ui.js` in 4.10 + 4.10b,
`solver.js` in 4.8, `rechenweg.js` in 4.9, `schaubild.js` in 4.7.**
**v2.20 (2026-07-27):** **Vorbereitung von N5c — zwei Punkte zur Entscheidung eingetragen,
kein Code geändert.**
Auf Dieters Anregung geprüft, ob Beispiele für **Vierkantrohr** und **H-Träger** schon jetzt
sinnvoll sind. Ergebnis nach Nachmessen: **ja, aber als Schritt 1 von N5c, nicht davor** —
ein Beispiel ist nur Auswahlzustand plus Feldwerte, und genau deren Übersetzung ins
Solver-Format entsteht erst in N5c; ob ein Beispiel fachlich taugt, zeigt sich erst am
Ergebnis. Danach spart es bei jedem Handy-Test rund siebzehn Eingaben auf zwei Antipper.
Drei gegengerechnete Beispiele stehen mit allen Zahlen in **5.1** (Vierkantrohr 100×60×4
r 6 · H-Träger 200×100 t_w 5,6 t_f 8,5 · Blech 200×80). Der große Beispielkatalog bleibt **N7**.
Dabei ein **echter Widerspruch** gefunden und dokumentiert: `validate.js` verlangt `l` und
`t2` als Pflicht, `profil.js` rechnet die Nahtlänge bei geschlossenen Profilen aber selbst
aus dem Umfang (272 mm bzw. 788,8 mm) und kennt dort kein `t2`. **Vor dem Bau von N5c zu
entscheiden.** Ebenfalls belegt: der Solver holt sein Nahtbild über das verschachtelte
`ein.profil_eingabe`, nicht über die flachen Feldwerte — die Übersetzung ist ein Kernstück
von N5c. **Und die gute Nachricht:** `DTNProfil.baue()` → `DTNSolver.rechne()` →
`DTNRechenweg.ausErgebnis()` läuft für das Vierkantrohr heute schon vollständig durch
(4 Segmente, umlaufend, 10 Abschnitte, Ampel grün) — **N5c muss nichts Neues rechnen,
nur übersetzen und anzeigen.**
Kopfblock, Abschnitt 5.1 und Entscheidungslog entsprechend erweitert.
**Basislinie unverändert: 724 Assertions · Smokes 385/386 · i18n-Parität 0.**
**v2.21 (2026-07-27):** **Der Auftrag für N5c ist ENTSCHIEDEN und ausformuliert — der
nächste Chat muss nichts mehr abstimmen, nur noch bauen.** Kein Code geändert.
**N5c wird geteilt:** **N5c-1 „Es rechnet"** (Feldbereinigung, drei Beispiele, Übersetzung
Formular → `profil_eingabe`, „Berechnen" rechnet wirklich, Ergebnis-Kacheln mit Ampel) und
**N5c-2 „Es erklärt sich"** (Rechenweg, Nahtbild-Grafik, zwei Häkchenarten getrennt,
Liste 2.4, Zahlformat je Sprache). Einstieg neu: **„weiter mit N5c-1"**.
**Feldbereinigung beschlossen und begründet:** `l` entfällt aus dem Feldschema (29 → 28),
`t1` wird profilabhängig Pflicht (Blech, Rechteckrohr, Rundrohr, Winkel), `t2` wird
freiwillig als *Dicke des angeschlossenen Bauteils*. Tragender Befund: `profil.js` liefert
die **Dicke je Segment** mit und `solver.js` nutzt genau die — `t1`/`t2` sind nur
Rückfallebene, und `l` speiste bloß eine gröbere Zweitfassung der Prüfung
`l_eff,min = max(6a, 30)`, die der Solver längst aus der echten Geometrie macht.
`solver.js` bleibt unangetastet. Mit erledigt werden muss: `msg_endkrater_zu_lang` in
`profil.js` zeigt auf `feld:'l'` und gehört auf `a`.
**Zwei eigene Beispielzahlen aus v2.20 korrigiert**, gefunden durch Nachrechnen: 4 mm
Wanddicke lässt keine regelkonforme Kehlnaht zu (a_max 2,8 < a_min 3), und ein I-Profil um
die Flansche geschweißt warnt immer (Flanschkante nur `t_f` = 15 mm < 30 mm). Die drei
Beispiele sind jetzt vollständig durchgerechnet, **warnungsfrei**, mit gestaffelter
Ausnutzung: RHS 120×80×6 → 328 mm, η 0,359 · HEB 200 Steg → 324 mm, η 0,626 ·
Blech 80×10 → 140 mm, η 0,842.
Zusätzlich dokumentiert, **was `solver.rechne()` zurückgibt** (25 Schlüssel, u. a. `eta`,
`ampel`, `erfuellt`, `nicht_geprueft`) — erspart dem nächsten Chat das Nachsehen.
**Basislinie unverändert: 724 Assertions · Smokes 385/386 · i18n-Parität 0.**
**v2.22 (2026-07-27):** **Drei weitere Stolperstellen fuer N5c-1 nachgemessen und
dokumentiert — kein Code geaendert.** Alle drei sind vom selben Typ wie der Befund zu `l`:
etwas, das im Formular steht, kommt im Rechenkern anders oder gar nicht an.
**(a) Das z-Mass.** `validate.js` leitet `a = z / √2` ab, aber nur fuer die eigenen
Pruefungen; `profil.baue()` kennt `z` nicht. Wer nur das z-Mass eintraegt, besteht die
Pruefung und scheitert danach an `msg_profil_a_fehlt`. Beschlossen: die Umrechnung bleibt
in `validate.js` und wird **normiert herausgegeben**, `ui.js` setzt nur zusammen — so
bleibt die Assertion „kein `Math.` in ui.js“ bestehen.
**(b) `a_steg`/`a_flansch`** muessen in `profil_eingabe` durchgereicht werden, sonst
rechnet das H-Traeger-Beispiel (Naht nur am Steg) mit dem falschen a-Mass.
**(c) Die gesperrten Tabellenfelder** (`betaW`, `nu`, `Re`, `a_steg`, `a_flansch`) blieben
sonst fuer immer leer, weil `ui.js` `daten.js` nicht kennen darf. `ergebnis.widerstand`
liefert nach dem Rechnen genau diese Werte **samt Herkunft** (gemessen: betaW 0,8 ·
fu 360 · gammaM2 1,25 · Quelle jeweils „tabelle“). Vorschlag: danach eintragen und die
Herkunft anzeigen — sonst wirkt bewusste Zurueckhaltung wie ein Fehler.
Alles drei steht als eigener Block in **5.1** direkt vor dem Auftrag von N5c-2.
**Basislinie unveraendert: 724 Assertions · Smokes 385/386 · i18n-Paritaet 0.**
**v2.23 (2026-07-27):** **Neuer Abschnitt 3.6 — Versionszeile.** Kein Code geaendert.
Beim Nachsehen aufgefallen: alle Module tragen eine Kennung (`daten 0.1.0-N1`,
`solver 0.1.0-N3`, `ui 0.6.0`), **aber das Programm zeigt keine davon an** — der Info-ⓘ
nennt bisher nur die Edition. Kuenftig steht dort eine Zeile mit **Programmstand und
Plan-Version**, gebaut aus den Modulkennungen statt von Hand gepflegt, und **jede Ausgabe**
(Druck, PDF, Word, `.dts`) traegt sie mit. Eingeplant in **N5d** (Anzeige) und **N11**
(Ausgaben); eine Assertion prueft, dass Anzeige und geladene Module uebereinstimmen.
**Der Grund steht dabei:** die Pruefdateien sind DEV-ONLY und liegen nach V1 nur noch im
Archiv — sie sind aber die einzige Stelle, an der in ausfuehrbarer Form steht, was
„richtig“ heisst, und werden gebraucht, sobald die zweite Generation der EN 1993-1-8,
β_w,mod oder eine neue Werkstofftabelle nachgezogen wird. Die Gefahr ist dann nicht der
Verlust, sondern das **Auseinanderdriften** zwischen laufender Version und Archiv — mit
einer sichtbaren Versionszeile in zwei Sekunden erkennbar. Als Regel festgehalten: das
Archiv der Pruefdateien wird wie der Plan mitgefuehrt und am Ende **nicht abgeraeumt**.
**Basislinie unveraendert: 724 Assertions · Smokes 385/386 · i18n-Paritaet 0.**

**v2.24 (2026-07-28):** **Baustein N5, Etappe N5c-1 („Es rechnet") gebaut, ausgeliefert und
am Handy ABGENOMMEN.** **Feldbereinigung:** `l` entfaellt aus dem Feldschema (29 → **28**),
`t1` wird profilabhaengig Pflicht, `t2` freiwillig, `msg_endkrater_zu_lang` in `profil.js`
zeigt auf `a`; die beiden Laengenpruefungen sind **umgehaengt statt gestrichen** (je Segment
im Solver, drei Grenzfaelle vorher nachgemessen, 3 → 6 Assertions). **Drei Beispiele** als
Daten in `optionen.js` (nicht in `ui.js` — Begruendung im Entscheidungslog), hinter
„Beispiel laden" verdrahtet, mit **erst leeren, dann laden** (3.5) und gesetztem „eigener
Wert"-Haken fuer den Eckradius. Alle drei reproduzieren die Zahlen aus 5.1a exakt und
warnungsfrei: RHS 120x80x6 → 4 Segmente/328 mm/η 0,359 · HEB 200 Steg → 2/324/0,626 ·
Blech 80x10 → 2/140/0,842. **Uebersetzung Formular → Rechenkern** in `validate.js`
(`normiert()`, `rechenEingabe()`): Zahlen als Zahlen, `a` aus dem z-Mass abgeleitet,
`a_steg`/`a_flansch` durchgereicht, Geometrie ins verschachtelte `profil_eingabe`.
**„Berechnen" rechnet wirklich** — erst pruefen, dann `DTNSolver.rechne()`, dann anzeigen;
**Ergebnis-Kacheln** mit **Ampel** aus `ergebnis.ampel`/`erfuellt`, dazu Warnungen und
Hinweise sichtbar und die Zeile „Gerechnet wurde mit". Die gesperrten Tabellenfelder werden
nach dem Rechnen aus `ergebnis.widerstand` gefuellt. **Die Fachlogik-Assertion wurde
GESCHAERFT statt aufgeweicht:** genau ein erlaubtes Rechenmodul. Neuer Abschnitt **4.10c**,
neue Harness-Sektion **S31**. **Zwei echte Fehler beim Bauen gefunden und behoben** (siehe
Entscheidungslog). Beide HTMLs unveraendert.
**Basislinie 724 → 764 Assertions · Smokes 385/386 → 418/419 · i18n-Paritaet 0.**

**v2.25 (2026-07-28):** **Etappe N5c-2 („Es erklaert sich") gebaut, ausgeliefert und am
Handy ABGENOMMEN.** **Rechenweg vollstaendig** (10 Abschnitte, Formel im Klartext,
eingesetzte Zahlen, Quelle je Schritt) ueber `rechenweg.ausErgebnis()` + `rendere()`.
**Nahtbild-Grafik** aus `schaubild.ausProfil()` mit dreisprachiger Legende.
**Die zwei Haekchenarten optisch getrennt** (4.9): `rw-haken` und `rw-nachweis`, je mit
eigenem Erklaertext. **Liste 2.4 sichtbar** (10 benannte Luecken) samt Warnungen.
**Zahlformat je Sprache** jetzt aus `rechenweg.zahl()` — die Notloesung aus N5c-1 ist
abgeloest, es gibt nur noch eine Fassung. Erlaubnisliste fuer `ui.js` auf **drei
Anzeige-Module** erweitert (`DTNSolver`, `DTNRechenweg`, `DTNSchaubild`); verboten bleiben
`DTNNaht`, `DTNProfil`, `DTNData`. Neue Sektion **S32**. Zwei ueberholte
Ankuendigungstexte richtiggestellt. Beide HTMLs erneut unveraendert — alle 13
`<script src>` und die Karten lagen seit N5a richtig.
**Basislinie 764 → 822 Assertions · Smokes 418/419 → 440/441 · i18n-Paritaet 0.**

**v2.26 (2026-07-28):** **Nachbesserung aus der Abnahme: der Rechenweg ist aufklappbar**,
wie im Schwesterprogramm DT-ProfiPassung. Gebaut mit der **vorhandenen** Klappmechanik aus
N5a (`klappBereich()` erzeugt dieselben `acc*`-Ids und -Klassen, `schalte`/`umschalten`
unveraendert) — es gibt weiterhin nur **eine** Klappmechanik und es brauchte **keine neue
CSS-Zeile**. Zwei Ebenen: Detailbereich beim Start zu, die zehn Abschnitte darin offen und
einzeln schliessbar; der Zustand ueberlebt Sprachwechsel und Neurechnen. **Bilanz der
Selbstpruefung und Liste 2.4 bleiben ohne Antippen sichtbar** — eine Luecke hinter einer
Klappe waere wieder eine stille Luecke. Nur `ui.js`, `i18n_kern.js` und
`dom_smoke_voll.js` geaendert.
**Ausserdem in dieser Fassung eingearbeitet:** Kopfblock, Kickoff-Punkt 5b, **3.6** (mit dem
nachgemessenen Befund, dass **drei i18n-Module keine `VERSION` haben**), **neuer Abschnitt
4.10c**, **5.1** (N5c erledigt, N5d als naechster Auftrag — **nicht vorentschieden, mit
Dieter abzustimmen**), **5.2**, **8.1** und der Entscheidungslog. Damit ist die Plandatei
wieder die **alleinige** Grundlage; die Fortschreibungsdateien koennen geloescht werden.
**Basislinie 822 Assertions · Smokes 440/441 → 448/449 · i18n-Paritaet 0.**
**Naechster Schritt: N5d — Einstieg „weiter mit N5d".**

═══════════════════════════════════════════════════════════════════════════
Ende Schweißnaht-1.md · DT-ProfiSchweissnaht
═══════════════════════════════════════════════════════════════════════════
