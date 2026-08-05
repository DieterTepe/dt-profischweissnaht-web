# 📚 DT-ProfiSchweissnaht — Historie (Entscheidungslog + Changelog)

> **Begleitdatei zu `Schweißnaht-1.md`.** Hier steht das WARUM, dort das WAS.
>
> **Diese Datei wird nur HINTEN ERGÄNZT, nie aktualisiert.** Sie kann deshalb nicht
> veralten und nicht von der Plandatei abweichen. Die Plandatei bleibt die **alleinige
> Grundlage für das Bauen**; diese hier wird gelesen, **bevor** man etwas ändert, das
> falsch aussieht.
>
> **Regel dazu in `Schweißnaht-1.md`, Abschnitt 9.1** — mit dem Beispiel, an dem es hing:
> 22 angezeigte Häkchen gegen 21 gezählte waren **keine** Abweichung, sondern Absicht.
>
> Ausgelagert am 2026-07-28 aus der Plandatei v2.26 (dort Abschnitt 9 und Changelog),
> zeichengenau, ohne Verlust. Stand bei der Auslagerung: **822 Assertions ·
> Smokes 448/449 · i18n-Parität 0** · Bausteine N1–N5c abgenommen.

═══════════════════════════════════════════════════════════════════════════

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


---

> ⚠️ **NACHGETRAGEN AM 2026-08-03.** Die Einträge **v2.27** und **v2.28** wurden am
> 2026-07-28 nur in `Schweißnaht-1.md` geschrieben und hier vergessen — aufgefallen beim
> Abgleich der beiden Dateien. Sie stehen unten **wortgleich** so, wie sie dort standen;
> nichts daran ist aus dem Gedächtnis ergänzt.
> **Lehre:** Die Historie ist anhängend, aber sie hängt sich nicht von selbst an. Der
> Changelog-Eintrag gehört in **beide** Dateien — hier vollständig, in der Plandatei die
> letzten drei.

**v2.27 (2026-07-28):** **Entscheidungslog und Changelog nach `Schweißnaht-Historie.md`
ausgelagert.** Kein Code geändert, keine Zeile Inhalt verloren — zeichengenau geprüft.
In dieser Datei bleiben: die bindenden Festlegungen (9.2), die Warnung, vor jeder
„Korrektur" erst die Historie zu lesen (9.1), ein Wegweiser über alle Blöcke (9.3) und die
letzten drei Changelog-Einträge. Grund: die beiden Teile waren **45 % dieser Datei** und
wurden in jedem Chat mitgelesen, obwohl von 160 Log-Einträgen nur 13 eine Verpflichtung
tragen. **Die Historie ist anhängend, nicht pflegend** — sie kann deshalb nicht veralten.
**Basislinie unverändert: 822 Assertions · Smokes 448/449 · i18n-Parität 0.**

**v2.28 (2026-07-28):** **Fehlerbefund von Dieter beim Prüfen — neue Etappe N5c-3
(„Nahtzug statt Segment"), sie hat Vorrang vor N5d.** Die Prüfung
`l_eff ≥ max(6·a; 30 mm)` läuft **je geometrischem Segment** statt je durchlaufendem
Nahtzug. Bei Profilen mit Flansch ist die Flanschkante nur `t_f` lang — **jedes I- und
U-Profil mit umlaufender Naht fällt dadurch durch**, unabhängig von den Maßen (nachgemessen:
I 200×200 → 4 × 15 mm bei 1182 mm Gesamtnaht · U 80×160 → 2 × 10 mm bei 626 mm ·
U 100×200 → 2 × 14 mm bei 782 mm). Dieters Einwand trifft zu: der Flansch müsste dicker als
30 mm sein, dann passt kein Normbauteil mehr. **Zweiter Befund beim Messen:** Ampel grün
und Rechenweg „✗ nicht erfüllt" **gleichzeitig**. Beides in 5.1-0 mit Messwerten,
Begründung (EN 1993-1-8 §4.5.1(2) meint kurze *freistehende* Nähte), Reparaturvorschlag und
Prüfankern festgehalten — samt der Gegenprobe, dass wirklich kurze Einzelnähte weiterhin
gefangen werden. **Ehrlich vermerkt:** der Fall war bekannt und wurde bei der Beispielwahl
umgangen statt gelöst; die Lehre daraus steht in 9.2. Kein Code geändert.
**Basislinie unverändert: 822 Assertions · Smokes 448/449 · i18n-Parität 0.**

---

**Aus N5c-3 „Nahtzug statt Segment" (2026-08-03):**

- **Der Fehler saß eine Ebene zu tief, nicht in der Formel.** `l ≥ max(6·a; 30 mm)` war
  richtig; falsch war, worauf sie angewendet wurde. Die Reparatur hat keine Norm
  angefasst, sondern die Bezugsgröße: **Nahtzug statt Segment.**
- **Das Material lag seit N2b bereit.** `profil.js` gibt je Segment `raupe` und
  `geschlossen` heraus, weil der Endkraterabzug schon immer je Raupe greifen musste.
  Der Solver hat diese Angabe nur nie gelesen. Es musste also nichts erfunden werden —
  eine vorhandene, bereits getestete Struktur wurde endlich benutzt.
- **Warum die Längenprüfung eine WARNUNG wurde und kein Nachweis** *(Dieters Entscheidung,
  er ist der Fachmann)*: Beides war vertretbar. EN 1993-1-8 §4.5.1(2) formuliert hart —
  eine so kurze Naht darf nicht als tragend angesetzt werden —, aber nach der
  Nahtzug-Reparatur trifft die Prüfung nur noch wirklich kurze Einzelnähte, und dort ist
  der Anwender besser mit einer Warnung bedient, die ihm sagt *warum*, als mit einer roten
  Ampel, die ihm die Rechnung wegnimmt. **Die Bedingung dafür:** der Warntext muss die
  Norm aussprechen und ohne Aufklappen dastehen. Beides ist so gebaut.
  *Angeboten und nicht entschieden:* wenn Grün sich im Gebrauch als zu freundlich erweist,
  kennt die Ampel auch **Gelb** — das bliebe Warnung statt Nachweis.
- **β_Lw blieb bewusst je Segment.** Beim Umbau lag nahe, auch die Langnaht-Abminderung
  auf Zug-Ebene zu heben — das wäre falsch gewesen: ein umlaufender 1182-mm-Zug hätte sie
  ausgelöst, obwohl sie auf lange Laschenanschlüsse zielt. **Eine Reparatur darf nicht
  weiterlaufen, als sie muss.**
- **Der freie Segmentmodus wurde nicht mit gelockert.** Ohne Raupenangabe bleibt jedes
  Segment ein eigener Zug. Wer Segmente von Hand eingibt, bekommt weiterhin die strenge
  Prüfung — die Lockerung gilt nur dort, wo die Zugehörigkeit belegt ist.
- **Die Plandatei im Projektordner war elf Versionen alt** (v2.17, Basislinie 679/234/235)
  zu Code auf Stand N5c-2. Gefunden hat es allein der Abgleich „Basislinie im Kopfblock
  gegen gemessene Basislinie". Ohne ihn wäre auf einem drei Etappen alten Plan
  weitergebaut worden. **Das ist der zweite Fall dieser Art in sechs Tagen** — die Regel
  steht deshalb jetzt in 9.2, nicht nur in der Kickoff-Liste.
- **Was diese Etappe über das Verfahren sagt:** Der Fehler war acht Tage lang bekannt und
  stand als Kommentar in `optionen.js` („I-Profil um die Flansche geschweißt warnt immer,
  deshalb nur der Steg"). Ein Beispiel war gewählt worden, um einem Verhalten
  auszuweichen. **Die Regel dagegen steht seit v2.28 in 9.2 — sie ist an genau diesem
  Fall entstanden.**

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
Zwei benannte Entscheidungen: **β_Lw bleibt je Segment** und **ohne Raupenangabe bleibt
jedes Segment ein eigener Zug**. Neu: Harness-Sektion **S33**, Hinweiscode
`msg_sv_l_eff_je_zug`. Geändert: `solver.js`, `rechenweg.js`, `i18n_kern.js`,
`test_naht.js`, `dom_smoke_voll.js` — `ui.js`, `profil.js` und beide HTMLs blieben
unberührt. Plandatei vollständig nachgezogen.
**Basislinie 822 → 874 Assertions · Smokes 448/449 → 463/464 · i18n-Parität 0.**
**Nächster Schritt: N5c-3 am Handy abnehmen, dann N5d — Einstieg „weiter mit N5d".**


---

**Aus der Rückmeldung 2026-08-03 (N5c-3 abgenommen):**

- **N5c-3 ist ohne Nacharbeit durchgegangen.** Dieter hat am Handy geprüft, was in 5.1-0
  als Beleg gefordert war: umlaufend geschweißte Profile rechnen durch, die Gegenprobe
  mit der wirklich zu kurzen Naht warnt weiterhin. Damit ist Baustein N5 bis auf N5d fertig.
- **Die Warnung statt des Nachweises hat sich im Gebrauch bewährt** — die angebotene
  Rückfallebene „gelbe Ampel" wurde nicht gebraucht. Sie bleibt als Möglichkeit in 5.1-0
  vermerkt, falls sich das später ändert.
- **Der Ordnerabgleich ist zur festen Handlung geworden.** Nach dem Einspielen wurde
  nicht nur gemessen, sondern auch **byteweise verglichen**, ob die gelieferten Dateien
  unverändert angekommen sind. Nach zwei Verlusten und zwei veralteten Plandateien in
  sechs Tagen ist das die billigste Versicherung im ganzen Projekt: sieben Vergleiche,
  ein Befehl.
- **Was das über den Zuschnitt der Etappe sagt:** N5c-3 war die erste Etappe, die als
  reine *Reparatur* geplant wurde — mit vorher gemessenen Prüfankern statt mit einem
  Funktionsumfang. Das hat gut funktioniert: der Umfang war von Anfang an begrenzt, die
  Abnahme brauchte keine Diskussion, weil die Zahlen schon im Plan standen.

**v2.30 (2026-08-03):** **Etappe N5c-3 von Dieter am Handy geprüft und ABGENOMMEN —
ohne Nacharbeit.** Damit ist Baustein N5 bis auf N5d fertig. Der Projektordner wurde
gegengeprüft: Vollständigkeit gegen 8.1, die drei Testläufe direkt aus dem Ordner grün
(874 / 463 / 464 · 0 Fehler), beide HTMLs mit genau einer Zeile Unterschied, und die sieben
gelieferten Dateien byteweise identisch angekommen. Plandatei auf den abgenommenen Stand
gesetzt (Kopfblock, Kickoff-Punkt 12, Bausteintabelle, 5.1, 5.2, 8.1, Wegweiser 9.3); die
Fallunterscheidung „abgenommen ja/nein" entfällt, der Einstieg lautet ohne Vorbehalt
**„weiter mit N5d"**. **Code unverändert.**
**Basislinie unverändert und verbindlich: 874 Assertions · Smokes 463/464 · i18n-Parität 0.**
**Nächster Schritt: N5d — Umfang vor dem Bau abstimmen (5.1-1), vorher die drei
fehlenden `VERSION`-Kennungen nachrüsten (3.6).**


---

**Aus der Abstimmung 2026-08-03 (vor N5d):**

- **Dieters Sorge, wörtlich:** *„Ich bin mir wirklich nicht sicher, wie weit wir überhaupt
  in diese Sachen eingehen sollten. Nahtvorbereitung ist ein wichtiges Thema,
  Toleranzklassen auch — es soll ja alles so sein, dass eine Schweißnaht nach vielen
  Normen hergestellt wird. Aber eine Qualitätssicherung soll das sicher alles nicht sein,
  denn die Sachen ändern sich auch zu schnell."* Daraus ist das **Aufnahmekriterium**
  entstanden (9.2): aufgenommen wird, was **stabil** ist und der Rechnung eine Aussage
  gibt — draußen bleibt, was **gepflegt werden müsste**.
- **Warum das trennscharf ist:** B/C/D und EXC1–4 sind zusammen sieben Codes und seit
  Jahrzehnten unverändert; sie tragen zudem den Ermüdungsteil. Prüfumfänge,
  Nahtvorbereitungsformen und Toleranztabellen sind dagegen genau die Stellen, an denen
  eine Normausgabe etwas verschiebt. Das Kriterium trennt also nicht nach *wichtig* —
  Nahtvorbereitung ist wichtig —, sondern nach *pflegebedürftig*.
- **Der entscheidende Zusatz: was draußen bleibt, wird BENANNT.** Prüfumfang,
  Nahtvorbereitung, Toleranzen und Herstellerqualifikation kommen als ehrliche Lücken in
  die Liste 2.4. Damit sagt das Programm selbst, dass es kein QS-System ist. Halb
  aufnehmen wäre die schlechtere Lösung gewesen: es hätte Vollständigkeit vorgetäuscht,
  wo keine ist.
- **EXC schlägt die Bewertungsgruppe vor, erzwingt sie nicht** (Dieter zugestimmt).
  EN 1090-2 verknüpft beides; für den Laien ist der Vorschlag eine echte Hilfe. Er bleibt
  überschreibbar wie jeder Tabellenwert und trägt seine Herkunft sichtbar — dieselbe
  Bauform wie bei β_w und γ_M2, also **keine neue Mechanik**.
- **Die Bewertungsgruppe und die Ermüdung** bleiben in V1 durch einen *Hinweis* verbunden,
  nicht durch eine Rechnung. Die Kerbfälle setzen eine Qualität voraus — das gehört gesagt,
  aber die Kopplung selbst gehört zu N13/N14. Eine Scheinrechnung wäre der schlimmere
  Fehler als eine offene Stelle.
- **Zum Verfahren:** Diese Abstimmung lief bewusst noch im alten Chat, mit dem letzten
  Fünftel des Kontingents. Ein Umfang, der nur im Gesprächsverlauf steht, überlebt keinen
  Chatwechsel — er stand deshalb binnen weniger Minuten in 5.1-1. Das ist Kickoff-Punkt 5c
  in seiner billigsten Form: **reden, solange der Kontext noch da ist; schreiben, bevor er
  weg ist.**

**v2.31 (2026-08-03):** **Umfang von N5d abgestimmt und in 5.1-1 ausformuliert.**
Aufgenommen: die zwei bereits in `optionen.js` vorhandenen Gruppen (`iso5817`, `exc`)
anzeigen, **EXC schlägt die Bewertungsgruppe vor** (überschreibbar, mit sichtbarer
Herkunft), sichtbarer **Ermüdungshinweis ohne Scheinrechnung**, Anforderungszeile in den
Ausgaben. Bewusst draußen: Prüfumfang/ZfP, Nahtvorbereitung (gehört zu N6b),
Toleranzklassen und Herstellerqualifikation — als **benannte Lücken in die Liste 2.4**.
Neues bindendes **Aufnahmekriterium** in 9.2. Vorlauf festgehalten: die Datengrundlage für
den Block liegt komplett vor, es fehlt nur die Verdrahtung. Offen: eine Ja/Nein-Frage
(Freitextfeld WPS-Nummer, Vorschlag: weglassen). **Code unverändert.**
**Basislinie unverändert und verbindlich: 874 Assertions · Smokes 463/464 · i18n-Parität 0.**
**Nächster Schritt: N5d — Einstieg „weiter mit N5d".**


---

**Aus N5d (2026-08-03) — Ausführung & Dokumentation, Versionszeile, Vorschlag statt Zwang:**

- **Die Reihenfolge war der halbe Bau.** Zuerst die drei fehlenden `VERSION`-Kennungen,
  dann die Zeile, die sie anzeigt. Andersherum hätte die Zeile drei Löcher gehabt —
  ausgerechnet in den Dateien, die sich am häufigsten ändern. Der Befund stand seit dem
  2026-07-28 im Plan (3.6) und war deshalb in fünf Minuten erledigt.
- **Die Versionszeile liest die Module, statt eine Liste zu führen.** `ui.js` geht über die
  `DTN…`-Namen am Fenster und fragt jedes Modul selbst nach `NAME` und `VERSION`. Eine
  gepflegte Modulliste wäre genau das gewesen, wogegen die Zeile gebaut wurde: eine zweite
  Stelle, die auseinanderdriftet. Ein Modul ohne Kennung würde sichtbar als „ohne Kennung"
  gezählt — die ehrliche Lücke ist eingebaut, nicht nachträglich geprüft.
- **Der Nebeneffekt ist der eigentliche Gewinn:** Weil die Zeile aus den geladenen Modulen
  kommt, zeigt sie am Handy sofort, wenn eine Datei beim Austausch nicht angekommen ist.
  Nach zwei verlorenen Dateien und zwei veralteten Plandateien in sechs Tagen ist das die
  zweite billige Versicherung neben dem byteweisen Vergleich.
- **„Vorschlag statt Zwang" hat eine Bauform bekommen, die es schon gab.** EXC füllt die
  Bewertungsgruppe genauso, wie ein Tabellenwert ein gesperrtes Feld füllt: gesetzt,
  sichtbar begründet, überschreibbar — und wer seine eigene Wahl wieder leert, bekommt den
  Vorschlag zurück. Es musste keine neue Mechanik erfunden werden, nur dieselbe auf eine
  Auswahl statt auf ein Feld angewendet. Der Merker sitzt in `S.manuell`,
  `istSelbstGewaehlt()` macht ihn prüfbar.
- **Die Karte lebt in `optionen.js`, nicht in `ui.js`** — und das ist jetzt messbar: der
  Harness prüft, dass die Zeichenkette `EXC` im Quelltext der Oberfläche überhaupt nicht
  vorkommt und der Gruppencode `iso5817` dort **genau einmal** steht, in der reinen
  Anordnung. Die erste Fassung dieser Prüfung war zu scharf („der Code darf gar nicht
  vorkommen") und schlug an der `ZUORDNUNG` an — das ist aber Anordnung, kein Fachwissen.
  **Gelernt:** eine Prüfung, die Anordnung und Logik nicht unterscheidet, verbietet das
  Falsche.
- **Die vier Lücken brauchten keine neue Leitung.** Sie stehen in `daten.js`
  (`NICHT_GEPRUEFT`, 10 → 14) und liefen von dort ohne eine einzige geänderte Zeile durch
  `solver.js`, `rechenweg.js` und die Anzeige bis in die Liste 2.4. Die Vorwarnung in 8.1
  hatte `validate.js` erwartet und `daten.js` nicht genannt — die Leitung war besser gebaut
  als die Vorwarnung wusste. **Eine Quelle je Sache zahlt sich zwei Etappen später aus.**
- **Was die Vorwarnung sonst noch verfehlt hat:** `validate.js` musste gar nicht angefasst
  werden (die zwei Auswahlen sind Gruppen, keine Felder), dafür `i18n_kerbfall.js`
  (Kennung). Die Liste in 8.1 ist eine Erwartung, keine Zusage — sie wird nachgeführt,
  nicht verteidigt.
- **Drei alte Assertions mussten umgestellt werden**, nicht gelockert: „der Block ist
  ausdrücklich auf N5d datiert" wurde zu „der Block ist nicht mehr datiert — er wird
  gebaut", „18 von 20 Gruppen" zu „alle 20". Gleiche Anzahl, andere Wahrheit. Eine
  Assertion, die einen Bauzustand festhält, gehört mit diesem Zustand fortgeschrieben —
  **gestrichen wird sie nie**, sonst schrumpft die Basislinie durch die Hintertür.
- **Der Block selbst brauchte keine neue CSS-Zeile.** Er nutzt `.feld-zeile` und
  `.gap-note` aus N5a/N5b; nur die zwei Zeilen des Info-Dialogs bekamen eigene Klassen.
  Das ist dasselbe Muster wie bei der Klappmechanik in N5c-2 — ein Zeichen, dass das
  Grundgerüst trägt.

**v2.32 (2026-08-03):** **Etappe N5d („Ausführung & Dokumentation" + Versionszeile) gebaut
und grün ausgeliefert.** Zuerst die drei fehlenden `VERSION`-Kennungen nachgerüstet
(`i18n_kern.js`, `i18n_hilfe.js`, `i18n_kerbfall.js` → `0.1.0-N1`): **alle 13 Module sind
gekennzeichnet**. Die **Versionszeile im Info-ⓘ** (`infoVersion` + `infoModule`) wird aus
den geladenen Modulen gebaut, nicht aus einer Liste; einzige Handzahl ist `PLAN` in
`ui.js`. Der **Block „Ausführung & Dokumentation"** ist verdrahtet: `iso5817` und `exc` mit
Laien-ⓘ, ehrlich als nicht rechenwirksam beschriftet; **EXC schlägt die Bewertungsgruppe
vor** (EXC1→D, EXC2→C, EXC3→B, EXC4→B nach EN 1090-2), mit sichtbarer Herkunft und
überschreibbar. Dazu **Ermüdungshinweis ohne Scheinrechnung**, **Anforderungszeile im
Ergebnis** und die **vier benannten Lücken** in Liste 2.4 (`daten.js` 10 → 14 Punkte).
**Dieters Entscheidung zur letzten offenen Frage: das Freitextfeld WPS-Nummer bleibt weg**,
solange N11 die Ausgaben nicht gebaut hat. Neu: Harness-Sektion **S34**, N5d-Durchklick im
DOM-Smoke, Planabschnitt **4.10d**, zwei Festlegungen in 9.2 („Vorschlag ist kein Zwang",
„die Versionszeile liest die Module"). Geändert: `daten.js`, `optionen.js`, `ui.js`,
`i18n_kern.js`, `i18n_hilfe.js`, `i18n_kerbfall.js`, `style.css`, beide HTMLs,
`test_naht.js`, `dom_smoke_voll.js` — die Rechenmodule `naht.js`, `profil.js`, `svglib.js`,
`schaubild.js`, `solver.js`, `rechenweg.js` sowie `validate.js` und `dom_smoke_test.js`
blieben unberührt. Plandatei vollständig nachgezogen (v2.32).
**Basislinie 874 → 984 Assertions · Smokes 463/464 → 513/514 · i18n-Parität 0.**
**Nächster Schritt: N5d am Handy abnehmen, dann N6b — Einstieg „weiter mit N6b".**



---

**Aus der Rückmeldung 2026-08-03 (N5d abgenommen):**

- **N5d ist ohne Nacharbeit durchgegangen.** Dieter hat am Handy geprüft, was in 5.1-1 als
  Beleg gefordert war: die Versionszeile nennt 13 von 13 Modulen mit Kennung, kein
  Fragezeichen, alle Nummern stimmen mit der Lieferung überein — und der Block
  „Ausführung & Dokumentation" verhält sich wie beschrieben. **Damit ist Baustein N5
  vollständig abgeschlossen**, über sechs einzeln abgenommene Etappen.
- **Die Versionszeile hat sich in derselben Stunde bewährt, in der sie gebaut wurde.** Sie
  war als Schutz gegen das Auseinanderdriften von Programm und Archiv gedacht (3.6). Bei
  der Abnahme hat sie aber vor allem eines geleistet: Dieter konnte am Handy selbst sehen,
  dass alle 11 Dateien angekommen sind — ohne Dateidaten zu vergleichen und ohne Rückfrage.
  **Aus einer Entwicklerhilfe ist die billigste Einspielkontrolle des Projekts geworden.**
- **Ein Befund aus der Abnahme, weitergereicht statt schnell repariert:** Die Zeile zeigt
  **Modulnamen**, nicht **Dateinamen** — `data` statt `daten.js`, `options` statt
  `optionen.js`, `kern`/`hilfe`/`kerbfall` statt der drei `i18n_*.js`. Zum Erkennen eines
  fehlenden Moduls reicht das vollkommen; sobald die Zeile aber in Druck, PDF, Word und
  `.dts` wandert, sollen die Namen den Dateinamen entsprechen. Das ist **eine Zeile je
  Modul** und gehört zu **N11**. Es jetzt nachzuschieben hätte eine abgenommene Etappe
  wieder geöffnet, um eine Kosmetik zu ändern, die erst in N11 sichtbar wird —
  **die Etappe bleibt zu, der Punkt steht im Plan.**
- **Der Ordnerabgleich hat sich zum zweiten Mal als feste Handlung bewährt.** Nach dem
  Einspielen wurden nicht nur die drei Testläufe aus dem Ordner gestartet, sondern auch die
  13 gelieferten Dateien byteweise verglichen **und** die acht nicht angefassten Module
  gegen den Vorstand geprüft. Der zweite Teil ist neu: er fängt das ab, was der erste nicht
  sieht — eine Datei, die *zusätzlich* mit überschrieben wurde. Kosten: ein Befehl.
- **Was diese Etappe über die Reihenfolge sagt:** Der eigentliche Bau (Block anzeigen,
  Vorschlag verdrahten) war klein. Groß war der Vorlauf — der Umfang stand seit dem
  Vorgängerchat in 5.1-1, die Datengrundlage lag seit N1 im Code, der Befund zu den drei
  fehlenden Kennungen seit dem 2026-07-28 im Plan. **Eine Etappe, die vollständig
  vorbereitet ist, kostet fast nur noch Tippen.**

**v2.33 (2026-08-03):** **Etappe N5d von Dieter am Handy geprüft und ABGENOMMEN — ohne
Nacharbeit. Baustein N5 ist damit vollständig abgeschlossen.** Der Projektordner wurde
gegengeprüft: Vollständigkeit gegen 8.1, die drei Testläufe direkt aus dem Ordner grün
(984 / 513 / 514 · 0 Fehler), `node --check` über alle 16 JS sauber, beide HTMLs mit genau
einer Zeile Unterschied, die 13 gelieferten Dateien byteweise identisch angekommen und die
acht nicht angefassten Module unverändert. Ein Punkt wurde an **N11** weitergereicht: die
Versionszeile zeigt Modulnamen statt Dateinamen — das wird angeglichen, wenn die Zeile in
die Ausgaben wandert (Merkposten in 3.6, Hinweis bei N11 in der Bausteintabelle). Plandatei
auf den abgenommenen Stand gesetzt; im Changelog dort ist v2.30 herausgerollt — Volltext
steht hier. **Code unverändert.**
**Basislinie unverändert und verbindlich: 984 Assertions · Smokes 513/514 · i18n-Parität 0.**
**Nächster Schritt: N6b — Einstieg „weiter mit N6b", Umfang vor dem Bau abstimmen (5.1-2).**



---

**Aus N6b (2026-08-04) — ISO-2553-Katalog, Nahtvorbereitung, Symbolgenerator:**

- **Der verworfene Anlauf war nicht verworfen.** Weil die Sitzung im selben Chat
  weiterlief, lag der Stand aus Drittel 1 und 2 noch vollständig und grün da. Claude hat
  das gemeldet, statt es stillschweigend zu benutzen **oder** stillschweigend noch einmal
  zu bauen — und Dieter hat entschieden (A: weiterverwenden). **Gelernt:** Regel 5c
  schützt davor, dass Halbes ausgeliefert wird und dass aus dem Gedächtnis rekonstruiert
  wird. Beides war hier nicht der Fall. Eine Regel anzuwenden, ohne ihren Zweck zu prüfen,
  hätte 20 Prozentpunkte gekostet — und die fehlten dann im letzten Drittel.
- **Der erste Schritt nach „A" war der Abgleich gegen die Vorlaufdatei**, nicht das Bauen:
  acht Kennzahlen (Katalogumfang, Fugenformen, Liste 2.4, Wörterbuch) gegen das, was die
  Datei behauptete. Erst als alle acht stimmten, ging es weiter. Ohne diesen Abgleich wäre
  „noch da" eine Vermutung geblieben.
- **Die Lücke wurde geschlossen, nicht umbenannt.** `nahtvorbereitung` fiel aus Liste 2.4,
  **weil** die 16 Fugenformen jetzt wirklich in `daten.js` stehen. Die Assertion prüft
  beides zusammen: die Lücke ist raus **und** die Tabelle ist da. Eine Lücke, die nur aus
  der Liste verschwindet, ist eine verschwiegene Lücke.
- **Die Legende darf nichts behaupten, was im Bild nicht steht.** Die
  Identifikationslinie war zuerst durchgezogen gezeichnet, während die Legende
  „gestrichelt = Gegenseite" sagte. Der Legendeneintrag war korrekt, das Bild nicht — und
  eine Assertion auf den Legendeneintrag hätte grün gemeldet. **Geprüft wird jetzt das
  `stroke-dasharray` im SVG-String selbst.** Als Festlegung in 9.2 übernommen.
- **Eine Doppelung, die benannt und bewacht ist, ist besser als eine Abhängigkeit, die
  niemand wollte.** Die Codeliste steht in `optionen.js` ein zweites Mal, damit dieses
  Modul von keinem anderen abhängt. Der Preis ist eine Assertion, die in **beide**
  Richtungen vergleicht — und ein Kommentar, der den Grund nennt. Ohne beides wäre es
  schlicht eine Doppelung.
- **Die Namen stehen trotzdem nur einmal.** Über `schluessel` zeigen die Optionen auf den
  Katalogtext `sym_*`; eine zweite Assertion verbietet einen eigenen `opt_*`-Text daneben.
  46 Wörterbucheinträge gespart — und keine Stelle, an der zwei Namen auseinanderlaufen.
- **Drei Fehlschläge, drei Lehren:** `var`-Hoisting (die Optionslisten standen hinter
  `GRUPPEN` und waren beim Bauen noch `undefined`) · der Harness benutzte `Sym` in einer
  Sektion, die vor der Deklaration läuft · und im DOM-Smoke heißen Eingabefelder `fld_`,
  nicht `f_`. Alle drei fielen sofort auf, weil vor jedem Weiterbauen gemessen wurde.
- **Der letzte Fund war der wichtigste:** Felder lösten kein Neuzeichnen aus. Das a-Maß am
  Symbol wäre stehen geblieben, während die Rechnung längst mit dem neuen Wert lief —
  zwei Wahrheiten auf einem Bildschirm. Gefunden hat es der Durchklick am echten Formular,
  nicht der Harness.

- **Der letzte Fund kam von Dieter, nicht vom Harness — und war der lehrreichste.** Die
  Versionszeile listete alle 14 Module richtig, zeigte als Programmstand aber „N5d ·
  Plan 2.32". `VERSION`, `ETAPPE` und `PLAN` in `ui.js` sind die **einzigen von Hand
  gepflegten Zahlen** der Zeile — und genau die wurden vergessen. **Die Assertion darauf
  hat den Fehler nicht gefunden, sondern zementiert**: sie verglich gegen die Konstante
  `'N5d'`, also gegen den alten Wert selbst. Grün gemeldet, falsch angezeigt.
  **Regel daraus:** Ein von Hand gepflegter Wert darf nie gegen eine im Test wiederholte
  Konstante geprüft werden, sondern nur gegen **seine Quelle**. Der Harness liest die
  Planversion jetzt aus dem Kopfblock der Plandatei. Bitter und passend zugleich: Die
  Zeile war gebaut worden, um Auseinanderdriften sichtbar zu machen — und drifteten
  ausgerechnet ihre eigenen drei Zahlen.

**v2.34 (2026-08-03):** **Umfang von N6b abgestimmt; erster Bauanlauf nach Regel 5c
verworfen.** Dieters drei Antworten: **voller ISO-2553-Katalog**, **Nahtvorbereitung
EN ISO 9692-1 kommt mit hinein**, **einteilig mit Haltepunkten nach je einem Drittel** —
Dieter beobachtet den Tokenstand und entscheidet an jedem Haltepunkt „weiter" oder
„Stopp". Gebaut wurden Drittel 1 (Katalog, 984 → 1067 Assertions) und Drittel 2
(Zeichnen, → 1116), beide grün; bei 55 % Tokenstand kam „Stopp". **Es wurde KEIN Code
ausgeliefert**, nur die Plandatei und `N6b_Vorlauf-Messwerte.md` mit den geprüften Werten.
Projektordner blieb auf N5d, Basislinie 984 · 513 · 514.

**Aus dem Stopp (2026-08-03) — was ein Haltepunkt wert ist:**

- **Der Haltepunkt hat funktioniert, weil er VOR der Grenze lag, nicht dahinter.** Bei 55 %
  war Drittel 3 rechnerisch machbar — aber ohne Polster für einen zähen Fehler in der
  Oberfläche. Genau dort ist am nächsten Tag auch tatsächlich dreimal etwas hakengeblieben
  (`var`-Hoisting, `Sym` vor der Deklaration, `fld_` statt `f_`). **Die Schätzung „geht
  sich aus" war richtig, die Entscheidung dagegen war trotzdem besser.**
- **Eine Vorlaufdatei ist kein Code-Ersatz, sondern ein Entscheidungsspeicher.** Was sie
  gerettet hat, waren nicht Zeilen, sondern **Festlegungen**: die Seitenregel, die
  `DOPPEL`-Zuordnung, die Bänder der 16 Fugenformen, vier bereits zugeschnappte Fallen und
  die Liste dessen, was Drittel 3 nachziehen muss. Beim Neuaufbau musste nichts noch
  einmal entschieden oder nachgeschlagen werden.
- **Messwerte in die Datei, Zeilen nicht.** Die Grenze ist scharf: Tabellen, Zahlen,
  Namen, Regeln — ja. Quelltext — nein. Sonst wäre es eine Auslieferung unter falschem
  Namen.

**v2.35 (2026-08-04):** **Baustein N6b gebaut und grün ausgeliefert.** Neu `symbol.js`
(32 Katalogeinträge + Zeichnen auf der unveränderten `svglib.js`), `FUGENFORMEN` von 7 auf
16 Fugenformen nach EN ISO 9692-1, **Liste 2.4 von 14 auf 13 Punkte** (Nahtvorbereitung
geschlossen), fünf Auswahlen mit Livebild im Block „Ausführung & Dokumentation", neue
Sektionen S35/S36/S37, Planabschnitt 4.11, zwei Festlegungen in 9.2. Beide HTMLs binden
14 Module ein. **Basislinie 984 → 1135 Assertions · Smokes 513/514 → 537/538 ·
i18n-Parität 0.** Im Plan-Changelog ist v2.32 herausgerollt — Volltext steht hier.
**Nächster Schritt: N6b am Handy abnehmen.**



---

**Aus der Abnahme von N6b (2026-08-04):**

- **Zum zweiten Mal hat der Mensch gefunden, was der Harness nicht sah.** Erst die
  gestrichelte Linie, die nicht gestrichelt war — dann der Programmstand, der auf „N5d ·
  Plan 2.32" stehen blieb. Beide Male war die Prüfung formal grün. **Die Lehre ist nicht
  „mehr Assertions", sondern: Assertions, die gegen eine wiederholte Konstante prüfen,
  prüfen nichts.** Sie schreiben den Zustand fest, statt ihn zu vergleichen.
- **Die Nachbesserung hatte selbst eine Nebenwirkung — und die fiel rechtzeitig auf.** Der
  neue Abgleich verglich `PLAN` in `ui.js` mit `Plan-Version` im Kopfblock. Damit hätte
  **jeder reine Abnahme- oder Dokumentationseintrag eine Codeänderung erzwungen**, nur
  damit eine Zahl wieder passt. Eine Prüfung, die Pflichtänderungen am Code erzeugt,
  produziert genau die Flüchtigkeitsfehler, gegen die sie gebaut wurde. **Abhilfe: das
  neue Kopffeld `Codestand`** — die Planversion, gegen die der *Code* gebaut ist. Sie
  wandert nur mit, wenn sich Code ändert; `Plan-Version` läuft frei weiter.
- **Diese Plandatei-Version ist der erste Beleg dafür, dass es trägt:** v2.38 ist eine
  reine Aufräumversion, `Codestand` steht unverändert auf 2.36 — und der Harness bleibt
  grün, ohne dass eine einzige Programmzeile angefasst wurde.

**v2.36 (2026-08-04):** **Nachbesserung aus der Abnahme von N6b.** `VERSION`, `ETAPPE` und
`PLAN` in `ui.js` waren beim Bau von N6b nicht mitgezogen worden — die Versionszeile zeigte
„N5d · Plan 2.32", obwohl alle 14 Module richtig gelistet waren. **Die Assertion darauf
hatte den alten Wert festgeschrieben und meldete grün.** Jetzt `0.8.0` / `N6b` / `2.36`;
`PLAN` ist exportiert und wird vom Harness gegen die Plandatei geprüft. Geändert: `ui.js`,
`test_naht.js`, `dom_smoke_voll.js`. **Basislinie 1135 → 1138 Assertions.**

**v2.37 (2026-08-04):** **Baustein N6b von Dieter am Handy geprüft und ABGENOMMEN.**
Versionszeile „Programmstand N6b · Plan 2.36 · 14 Module", `ui 0.8.0`,
`symbol 0.1.0-N6b`. Projektordner gegengeprüft: alle gelieferten Dateien byteweise
identisch, die acht nicht angefassten Module unverändert, Testläufe aus dem Ordner
**1138 / 537 / 538 · 0 Fehler**. **Neu im Kopfblock: `Codestand`** — der Harness vergleicht
`PLAN` ab jetzt damit statt mit `Plan-Version`. **Code unverändert.**

**v2.38 (2026-08-04):** **Aufräumen nach der Abnahme, keine Codeänderung.** Historie um
v2.34, v2.36 und v2.37 ergänzt (v2.34 war beim Stopp nie nachgetragen worden); im
Plan-Changelog v2.33 bis v2.35 ausgerollt — Volltext steht hier. `N6b_Vorlauf-Messwerte.md`
ist gelöscht, die Verweise darauf sind im Plan auf Vergangenheit gesetzt.
**`Codestand` bleibt 2.36** — der erste Beleg, dass eine reine Planversion den Code nicht
mehr anfassen muss. **Basislinie unverändert: 1138 · 537 · 538.**


**v2.39 (2026-08-04):** **Baustein N7 — der Beispielkatalog, und was er ans Licht
gebracht hat.** Aus drei Beispielen sind zwölf geworden, sechs je Bemessungswelt.
Der eigentliche Ertrag waren aber nicht die Beispiele, sondern **vier Fehler aus
N5c**, die seit dem 28. Juli im Programm standen und die niemand hätte finden
können, weil kein Beispiel je die Auslegung oder die durchgeschweißte Stumpfnaht
berührt hat. Genau dieses Muster hatte 5.1-0 schon einmal gezeigt.

**Aus N7 (2026-08-04) — Entscheidungen und Erfahrungen**

**Dieters Festlegungen:**
- **Zwölf Beispiele, sechs je Welt.** Claudes Vorschlag waren acht (vier je Welt,
  mit gemischten Fällen). Dieter hat auf sechs erhöht, damit sich die sechs
  Starter aus 2.11 in *beiden* Welten spiegeln. Das ist der bessere Schnitt:
  derselbe Fall einmal nach EC3 und einmal klassisch nebeneinander ist genau der
  Vergleich, den das Programm können soll — und die kontextbezogene Liste hat
  nach dem Filtern noch etwas zu zeigen.
- **Die a-Grenzen gelten für Kehlnaht UND teilweise durchgeschweißte Naht.**
  Claude hatte gefragt, ob HV/HY mit ausgenommen werden soll. Dieters Antwort:
  nein — ausgenommen ist ausschließlich die durchgeschweißte Naht. Dort ist
  `a = t` die Definition; bei der teilweise durchgeschweißten liegt eine
  Kehlnahtlage vor, also gilt die Regel weiter.
- **Beide Fehler in N7 mit beheben**, statt sie in einen Folgebaustein zu
  schieben. Damit belegt der Katalog zugleich, dass die reparierten Pfade tragen.

**Was die vier Befunde gelehrt haben:**
1. Eine ganze Rechenrichtung kann tot sein, ohne dass es auffällt, solange kein
   Beispiel sie betritt. Die Auslegung scheiterte über das Formular seit N5c-1
   an `msg_profil_a_fehlt`.
2. Eine Regel, die für einen Nahttyp nicht gilt, darf dort **keinen Haken**
   tragen — weder grün noch rot. Der grüne behauptet eine Prüfung, die nicht
   stattgefunden hat; der rote holt den Widerspruch aus 9.2 zurück.
3. **Iteration heilt nicht, was in der Geometrie sitzt.** Der erste Anlauf gegen
   Befund 1 setzte nur ein Bezugsmaß ein — und lieferte je nach Bezugsmaß ein um
   rund 10 % anderes `a_erf`, weil der Endkraterabzug selbst am a-Maß hängt.
   Gefunden wurde das nur, weil die Reparatur mit *mehreren* Bezugswerten
   gegengeprüft wurde. **Wer eine Reparatur nur mit einem Wert prüft, prüft die
   Reparatur, nicht die Sache.**
4. Ein Bild, das aus einer anderen Quelle kommt als die Zahlen, wird früher oder
   später etwas anderes zeigen — hier zeigte es gar nichts.

**Und eine Bestätigung:** Die Verträglichkeitsregel aus 3.4 hat beim Bauen einen
Entwurf abgewiesen (`kehl_umlaufend` mit „Flansche + Steg"). Sie hat damit einen
fachlichen Fehler gefangen, den sonst erst Dieter am Handy gesehen hätte.

**Zur Prüfkultur:** Die festgeschriebenen Handwerte für `ETAPPE` und `VERSION`
in den Assertions sind gefallen — sie werden jetzt wie `PLAN` gegen das Kopffeld
`Codestand` geprüft, und der DOM-Smoke prüft die Versionszeile gegen die
Kennungen aus `ui.js`. Damit ist die Lehre aus v2.36 überall durchgezogen, nicht
nur an der einen Stelle, an der sie aufgefallen war.

**Basislinie 1138 → 1553 Assertions · Smokes 537/538 → 611/612 · i18n-Parität 0.**
**Nächster Schritt: N7 am Handy abnehmen.**



═══════════════════════════════════════════════════════════════════════════
Ende Schweißnaht-Historie.md · DT-ProfiSchweissnaht
═══════════════════════════════════════════════════════════════════════════


**v2.40 (2026-08-04):** **N7 abgenommen — und was die Versionszeile dabei
verraten hat.**

**Aus der Rückmeldung 2026-08-04 (N7 abgenommen)**

Dieter hat den Katalog am Handy durchgeklickt und keinen Fehler gefunden. Die
Abnahme ging ohne Nacharbeit durch — die zweite in Folge. Der Projektordner ist
gegengeprüft: alle 30 Dateien byteweise identisch, die zwölf nicht angefassten
Module unverändert, Testläufe direkt aus dem Ordner 1553 / 611 / 612 · 0 Fehler.

**Der Fund kam nicht aus einer Rechnung, sondern aus der Versionszeile.** Dieter
hat sie nach dem Start abgetippt und mitgeschickt. Dabei fiel auf: `solver.js`
meldet `0.1.0-N3` und `rechenweg.js` `0.1.0-N4` — obwohl N7 in beiden Modulen
tief eingegriffen hat (Bezugsmaß, Außeniteration, a-Grenzen, das herausgegebene
Nahtbild; im Rechenweg die zwei Schritte ohne Haken). **Nur `ui.js` wächst mit.**

Das ist kein Schönheitsfehler. Die Zeile hat genau einen Zweck: ein altes oder
fehlendes Modul erkennbar machen. Solange die Kennungen nicht mitwandern, könnte
man heute `solver.js` in der Fassung von vor N7 einspielen, und die Zeile sähe
unverändert richtig aus. **Sie prüft weniger, als sie zu prüfen scheint** — und
das ist dieselbe Klasse von Fehler wie die festgeschriebene Assertion aus v2.36:
etwas meldet grün, ohne die Sache zu berühren.

Nicht sofort repariert, sondern **benannt und terminiert**: gehört zu N11, wo
die Zeile ohnehin angefasst wird (Modulnamen an Dateinamen angleichen). Dort
soll jedes geänderte Modul seine `VERSION` mitziehen und eine Assertion
festhalten, dass eine Änderung ohne Kennungswechsel nicht durchgeht. Bis dahin
bleibt der Basislinien-Abgleich aus Kickoff-Punkt 11 die einzige verlässliche
Probe darauf, dass Code und Plan zusammenpassen.

**Zum Verfahren:** `Codestand` bleibt bei 2.39, obwohl die Planversion auf 2.40
steigt. Das ist der zweite Beleg dafür, dass ein reiner Abnahmeeintrag den Code
nicht mehr anfassen muss — die Trennung aus v2.37 trägt.


**v2.41 (2026-08-04):** **S39 — die Prüfung, die vorher fehlte.**

**Aus S39 (2026-08-04) — Verifikation gegen publizierte Rechenbeispiele**

Der Anstoß kam von Dieter, und er traf einen wunden Punkt: Alle Hand-Anker
dieses Projekts prüfen **Bauteile** — I_y gegen die Steiner-Formel, W_t gegen
I_p/r_max, die Aufteilung mit 1/√2. Was keiner davon findet, ist ein
**Verdrahtungsfehler**: wenn jedes Stück für sich stimmt und die Kette sie
falsch zusammensteckt. Genau diese Sorte Fehler war der Segment-Fehler aus
N5c-3, und genau diese Sorte waren die vier N7-Befunde. Ein vollständig
durchgerechneter fremder Fall, Zahl für Zahl verglichen, ist die einzige
Prüfung, die sie fängt.

**Ergebnis: vier Anker stimmen auf die letzte publizierte Stelle.** Geometrie
einer geschlossenen Nahtgruppe (J_u = 2.604.166,66 mm³), zwei EC3-Fälle über
die ganze Kette einschließlich Widerständen und Ausnutzung, ein klassischer
Maschinenbaufall in Welt B. Das ist der erste unabhängige Beleg, dass die
Kette als Ganzes richtig verdrahtet ist — bisher war nur belegt, dass die
Einzelteile stimmen.

**Der fünfte Anker war fehlerhaft — in der Quelle, nicht bei uns.** Das
publizierte σ₉₀ = 145,8 N/mm² ließ sich mit unserem Programm nicht
reproduzieren; wir kamen auf 121,5. Statt den eigenen Code zu ändern, wurde
die Quelle nachgerechnet. Befund: dieselbe Seite rechnet dasselbe System mit
demselben a-Maß noch einmal nach dem vereinfachten Verfahren und kommt auf
171,9 — **exakt unser Wert**, denn 171,9/√2 = 121,5. Ihr σ₉₀ gehört zu
**a = 2,5 mm**, ihr τ₀ = 0,83 dagegen zu a = 3 mm; und die dort abgedruckte
Formel (mit N/2 und V/2) reproduziert weder ihr eigenes Ergebnis noch die
Formel aus dem Theorieteil derselben Seite.

**Daraus die Regel, die jetzt in 9.2 steht:** *Ein publiziertes Beispiel ist
ein Anker, kein Beweis.* Weicht das Programm ab, wird zuerst die Quelle
nachgerechnet. Wer eine Abweichung reflexhaft im eigenen Code sucht, baut
einen richtigen Rechenweg kaputt — das wäre hier fast passiert.

**Drei Konventionen entscheiden über die Vergleichbarkeit** und mussten erst
gefunden werden, weil der naive Vergleich zunächst überall danebenlag:
1. **Endkraterabzug.** Unser Programm zieht 2·a je offener Raupe ab, die
   Lehrbücher nicht — rund **15 %** Unterschied. Wir sind die konservative
   Seite. Daraus die neue offene Frage in 2.2b: Soll das ein Ankreuzfeld
   werden? Im Formular ist der Abzug heute nicht abschaltbar, und wer
   nachrechnet, findet den Unterschied ohne Erklärung.
2. **Rechenmodell.** Die Quellen rechnen dünnwandig.
3. **Beiwerte**, wo die Quelle abweichend einstuft.

**Nebenbefund am Plan selbst:** Abschnitt 4.5 behauptete pauschal, exakt und
dünnwandig unterschieden sich um weniger als 0,1 %. Für die Flächenmomente
stimmt das (0,02 %), für die **Widerstandsmomente nicht** — dort liegt die
Randfaser im exakten Modell um a/2 weiter außen, gemessen **2,9 %**. Eine
Aussage, die neun Bausteine lang unwidersprochen im Plan stand, ist beim
ersten Vergleich mit einer fremden Zahl gefallen. Korrigiert und mit zwei
Assertions belegt.

**Ehrliche Lücke, die die Recherche selbst benannt hat:** Für die **Kreisnaht
unter reiner Torsion** existiert kein frei zugängliches, vollständig
durchgerechnetes Beispiel. Der Torsionspfad ist damit über die Geometrie
(Anker 7) und die Formeln belegt, aber nicht über einen publizierten
Ende-zu-Ende-Fall. Bleibt offen.

**Geändert: nur `test_naht.js`** — kein Produktmodul, `Codestand` bleibt 2.39.
**Basislinie 1553 → 1589 Assertions · Smokes unverändert 611 / 612.**


**v2.42 (2026-08-04):** **N8a — die Dialoglogik, und was der Zwölf-Fälle-Vergleich gefangen hat.**

**Aus N8a (2026-08-04) — Entscheidungen und Erfahrungen**

**Dieters Festlegungen vor dem Bau:** Eingabefelder nach Bereichen gebündelt
statt ein Fenster je Feld · Reichweite einschließlich der Zusatzbereiche ·
Zeichnungssymbol als ein freiwilliger Schritt am Schluss · N8b und N8c
anschließend zusammen, weil die erste Hälfte allein am Handy nur halb
bedienbar wäre.

**Der Schnitt hat sich bewährt.** N8a ist DOM-frei und damit vollständig in
Node prüfbar — der Rechenkern wurde nicht ein einziges Mal angefasst. Wer eine
Dialogführung gegen eine bestehende Rechenkette baut, sollte genau so
schneiden: erst die Logik, die man beweisen kann, dann die Oberfläche.

**Der Fund des Tages kam aus der Kernprobe.** Der Gedanke war Dieters Prinzip
aus S39, eine Stufe weitergedreht: nicht die Bauteile prüfen, sondern die
Kette — hier gegen die eigene zweite Kette. Jeder der zwölf Beispielfälle
läuft einmal durch das Formular und einmal durch den Assistenten; verglichen
werden Auswahl, Ausnutzung, Ampel und Nahtbild.

Der erste Entwurf bot im Dialog nur **Pflichtfelder** an. Das klang vernünftig
— warum einen Laien mit β_w behelligen? Ergebnis: **Moment, Torsion und
Eckenausrundung** sind keine Pflichtfelder und fielen deshalb aus dem Dialog.
Sieben der zwölf Beispiele kamen über den Assistenten mit einer anderen
Ausnutzung heraus (RHS 0,359 gegen 0,295; Konsole 0,837 gegen 0,203), zwei
rechneten überhaupt nicht mehr. Der Plan sagt in 3.3 wörtlich das Gegenteil:
*nach jeder Auswahl bleiben die zugehörigen Eingabefelder mit „eigener Wert"-
Haken zugänglich*. Die Regel stand seit N1 da und war beim Bauen trotzdem
plausibel wegargumentiert worden.

**Die Lehre:** Ein zweiter Eingabeweg ist kein Bedienkomfort, sondern eine
**zweite Quelle für dieselben Daten**. Er muss gegen die erste geprüft werden,
und zwar am Ergebnis, nicht an der Bedienung. Ohne den Zwölf-Fälle-Vergleich
wäre das erst am Handy aufgefallen — bei einem Fall mit Moment, also
ausgerechnet dort, wo der Assistent seinen Laien am dringendsten braucht.

**Zwei Bauentscheidungen, die Bestand haben sollen:**
- **Keine zweite Schrittliste.** Die Folge entsteht aus `Options.gruppeAktiv()`
  und `Valid.sichtbareFelder()` — denselben Funktionen, die das Formular
  benutzt. Eine handgepflegte Liste wäre beim nächsten Baustein veraltet, ohne
  dass jemand es merkt. Genau davor warnt 3.4 mit der EINEN Filterfunktion.
- **Sitzungen sind unveränderlich.** `antworte`, `zurueck` und `springe`
  liefern eine neue Sitzung. „Einen Schritt zurück" ist damit kein Rückbau,
  sondern schlicht die vorige Sitzung — und die gegebene Antwort steht noch
  da, weil sie ja gerade geändert werden soll.

**Feld → Bereich ist umgezogen.** Die Zuordnung lag nur in `ui.js`; der
Assistent hätte sonst auf die Oberfläche zugreifen müssen, die oberste
Schicht. Sie steht jetzt am Feld in `validate.js`, `ui.js` behält die
Anordnung, und eine beidseitige Assertion hält beides deckungsgleich — dasselbe
Muster wie bei den Symbolcodes in N6b.

**Ehrlich zu den Zusatzbereichen:** Dieter wollte sie mit im Assistenten. Sie
sind heute reine Haken ohne ein einziges abhängiges Feld. Gebaut wurde deshalb
genau das, was das Formular auch zeigt — mit der Angabe, mit welchem Baustein
der Inhalt kommt. Nichts erfunden, nichts weggelassen.

**Basislinie 1589 → 1748 Assertions · Smokes 611/612 → 614/615.**
**Codestand 2.39 → 2.42 · 15 Module.**
**Nächster Schritt: N8a am Handy abnehmen, dann N8b+N8c zusammen.**


**v2.43 (2026-08-04):** **N8a abgenommen — und die Modulkennung fällt zum dritten Mal auf.**

**Aus der Rückmeldung 2026-08-04 (N8a abgenommen)**

Dieter hat die Versionszeile geprüft und alle zwölf Beispiele durchgeklickt:
grün, Nachweis erfüllt. Die dritte Abnahme in Folge ohne Nacharbeit. Die
zusätzliche Skript-Zeile in beiden HTMLs hat nichts gestört, und
`assistent 0.1.0-N8a` steht in der Zeile — die neue Datei ist auf GitHub
angekommen.

**Bemerkenswert ist, WAS diese Abnahme prüfen konnte und was nicht.** N8a ist
DOM-frei; am Handy gab es nichts zu bedienen. Die einzigen beiden Belege waren
die Versionszeile und die Frage, ob das Bestehende noch läuft. Genau dafür war
der Schnitt gedacht, und er hat funktioniert — aber es zeigt auch die Grenze:
Die eigentliche Prüfung von N8a lag im Harness, nicht am Gerät. Der
Zwölf-Fälle-Vergleich Formular gegen Assistent ist der Beleg, nicht dieser
Durchklick.

**Der Merkposten aus 3.6 hat sich zum dritten Mal gemeldet.** In der Zeile
stand `validate 0.1.0-N1`, obwohl N8a in genau diesem Modul die
Feld-zu-Bereich-Zuordnung eingebaut hatte. Vorher waren es `solver 0.1.0-N3`
und `rechenweg 0.1.0-N4` nach N7. Das Muster ist jetzt eindeutig: **nur `ui.js`
zieht seine Kennung mit, alle anderen Module nicht.** Die Zeile belegt, dass
fünfzehn Module da sind — nicht, dass sie aktuell sind. Damit prüft sie weniger,
als sie zu prüfen scheint, und das ist dieselbe Fehlerklasse wie die
festgeschriebene Assertion aus v2.36 und wie die Anker-Frage aus S39.

Wieder nicht sofort repariert, sondern in 3.6 um `validate.js` erweitert und
für **N11** terminiert. Der Grund bleibt derselbe: Eine Einzelreparatur erzwingt
die Regel nicht. Sie muss geprüft werden — jedes geänderte Modul zieht seine
`VERSION` mit, und eine Assertion hält fest, dass eine Änderung ohne
Kennungswechsel nicht durchgeht. Bis dahin ist der Basislinien-Abgleich aus
Kickoff-Punkt 11 die einzige verlässliche Probe.

**Code unverändert, `Codestand` bleibt 2.42.**
**Basislinie unverändert: 1748 Assertions · Smokes 614 / 615.**
**Nächster Schritt: N8b und N8c zusammen.**


**v2.44 (2026-08-04):** **N8b und N8c — der Assistent bekommt ein Gesicht.**

**Aus N8b/N8c (2026-08-04) — Entscheidungen und Erfahrungen**

**Dieters Festlegung war „erst alle Skizzen bauen".** Daraus wurde die
vorgeschaltete Etappe N8b-1. Beim Zuschnitt zeigte sich, dass „alle" nicht
wörtlich gehen kann, und das war die wichtigste Klärung des Tages: Für die
Hälfte der Auswahlgruppen — Welt, Werkstoffgruppe, Nachweisverfahren,
Nahtgüte und weitere — gibt es schlicht **nichts zu zeichnen, das erklärt
statt schmückt**. Ein hübsches Bildchen ohne Aussage wäre genau die stille
Lüge, die dieses Programm nicht baut.

Die Antwort war nicht, die Lücke zu verschweigen, sondern sie zu **listen**:
`OHNE_SKIZZE` führt die dreizehn Gruppen namentlich, und eine Assertion
verlangt, dass jede Auswahlgruppe entweder gezeichnet wird, aus fremder
Quelle kommt oder dort steht. Kommt später eine Gruppe dazu und niemand
entscheidet über ihre Skizze, wird es rot. **Eine benannte Lücke ist eine
Entscheidung, eine vergessene ist ein Fehler.**

**Kein Bild wurde doppelt gezeichnet.** Von den neun Schritten mit Skizze
bedient das neue Modul vier; die anderen fünf kommen aus `schaubild.js`
(N2c) und `symbol.js` (N6b). Für die Profil- und Kantenwahl fehlten nur die
Maße — die kamen als **Mustermaße** dazu, mit denen `schaubild.js` ganz
normal zeichnet. Also kein zweiter Zeichenweg für dieselbe Sache. Die
Mustermaße stehen in keinem Ergebnis und landen in keinem Feld; eine
Assertion hält das fest.

**Die beste Einzelentscheidung war, die Skizze IN die Auswahlkachel zu
setzen.** Der erste Entwurf hatte ein großes Bild über der Optionsliste —
und zeigte nichts, weil beim Auswählen ja noch nichts ausgewählt ist. Der
DOM-Smoke fand es sofort: drei Skizzen statt der erwarteten neun. Jetzt
stehen fünf Stoßarten oder sieben Profile nebeneinander, jede Kachel mit
ihrem eigenen Bild. Das ist nicht nur ein Fehler weniger, sondern die
bessere Bedienung — und näher an dem, was 3.3 mit „möglichst anklickbare
Auswahl" meint.

**Ein Schreibweg, nicht zwei.** `formularSetzen()` wurde aus
`beispielLaden()` herausgelöst; Beispielkatalog und Assistent benutzen jetzt
dieselbe Funktion. Das ist dieselbe Lehre wie bei der Schrittfolge in N8a:
Ein zweiter Weg zu denselben Daten ist eine zweite Gelegenheit, es anders zu
machen. Die Probe dazu ist ein vollständiger Durchlauf über die echte
Oberfläche gegen dieselbe Eingabe von Hand — zwölf Nachkommastellen gleich.

**Wieder ein Prüfmuster, das ich nicht aufgeweicht habe:** Der Assistent
nannte die Zeichenmodule in einem Kommentar, und die Quelltextprobe „kennt
keinen Rechenkern" schlug an. Der Kommentar wurde umformuliert, nicht die
Prüfung gelockert. Es war ein Kommentar, das Aufweichen hätte niemandem
geschadet — und genau deshalb wäre es der Anfang gewesen.

**Der Rechenkern blieb zum zweiten Mal in Folge unberührt.** `solver.js`,
`rechenweg.js`, `naht.js`, `profil.js`, `daten.js`, `optionen.js` und
`validate.js` haben sich in N8b/N8c nicht um ein Zeichen geändert. Bei einem
Baustein, der eine komplette zweite Bedienoberfläche hinzufügt, ist das der
beste Beleg dafür, dass der Schnitt stimmt.

**Ab jetzt gilt die Prozessregel aus 3.3:** Jeder weitere Baustein liefert
seine Assistenten-Schritte MIT. Der Assistent wird nie am Ende drangebaut.

**Basislinie 1748 → 1825 Assertions · Smokes 614/615 → 662/663.**
**Codestand 2.42 → 2.44 · 16 Module.**
**Nächster Schritt: N8 am Handy abnehmen, dann N9 (Vorwärmung & t8/5).**


**v2.45 (2026-08-04):** **N8 abgenommen — der Assistent steht.**

**Aus der Rückmeldung 2026-08-04 (N8 abgenommen)**

Dieter hat gezielt die drei Punkte geprüft, an denen es hätte hängen können,
und alle drei trugen: die Versionszeile mit sechzehn Modulen, ein
**Auslegungsfall mit Moment** über den Assistenten — grün, Nachweis erfüllt —
und der **Sprachwechsel bei offenem Dialog** in allen drei Sprachen.

**Warum ausgerechnet diese drei.** Der Auslegungsfall mit Moment vereint alles,
was in diesem Baustein schiefgehen konnte: ein gesuchtes a-Maß (der Pfad, den
N7 überhaupt erst geöffnet hat), ein Moment (das Feld, das mein erster
N8a-Entwurf aus dem Dialog hatte fallen lassen) und die Mündung in dieselbe
Rechenkette. Der Sprachwechsel wiederum ist der einzige Punkt, der sich an
keinem Ergebnis zeigt — ein Dialogfenster wird programmatisch aufgebaut, also
hätte es beim Umschalten stehenbleiben können, ohne dass eine Zahl falsch
wird. Genau solche Stellen fallen sonst erst dem Kunden auf.

**Der Merkposten aus 3.6 hat sich zum vierten Mal gemeldet.** In der Zeile
stand `assistent 0.1.0-N8a`, obwohl N8b in genau diesem Modul die
Skizzenzuordnung eingebaut hat. Nach `solver`, `rechenweg` und `validate` ist
das der vierte Fall. Erweitert in 3.6, Termin bleibt N11.

**Der Stand nach N8.** N1 bis N5 vollständig, N6b, N7 und N8 abgenommen. Das
Programm rechnet in beiden Bemessungswelten, in beide Rechenrichtungen, zeigt
seinen Rechenweg, prüft sich selbst, bringt zwölf durchgerechnete Beispiele
mit und führt einen Laien in neunzehn Schritten mit Bildern durch die Eingabe.
Bis zum Verkaufsstand fehlen N9 (Vorwärmung), N10 (Kosten), N11 (Ausgaben) und
N12 (Edition und Registrierung).

**Ab hier trägt jeder Baustein eine zusätzliche Pflicht:** Er liefert seine
Assistenten-Schritte MIT (3.3). Das ist billiger, als es klingt — die
Schrittfolge leitet sich aus `optionen.js` und `validate.js` ab, ein neues
Modul erscheint also von selbst im Dialog. Was mitgeliefert werden muss, sind
die Laien-Erklärung, der Tipp und die Entscheidung über die Skizze: gezeichnet
oder benannt ohne. Die Assertion aus S41 erzwingt genau diese Entscheidung.

**Code unverändert, `Codestand` bleibt 2.44.**
**Basislinie unverändert: 1825 Assertions · Smokes 662 / 663.**
**Nächster Schritt: Baustein N9 (Vorwärmung & t8/5).**


**v2.46 (2026-08-05):** **Vier Entscheidungen vor N9 — die wichtigste betraf den Zuschnitt von Version 1.**

**Aus dem Klärungsgespräch 2026-08-05**

Dieter kam mit einer Produktfrage, nicht mit einer technischen: Der
Kerbfallkatalog der EN 1993-1-9 umfasst über siebzig Details. Ob man ihn nicht
für Version 1 stark kürzen sollte, das Projekt schlanker machen — und die
Vollversion einem späteren Update überlassen, ohne sich den Weg zu verbauen.

**Die Antwort war zweigeteilt, und der zweite Teil war der wichtigere.**
Ja, kürzen ist richtig; der Plan sah es in N14a/N14b ohnehin so vor. Aber die
Art des Kürzens entscheidet über Sicherheit und Erweiterbarkeit:

- **Kürzen an der Tiefe, nicht an der Breite.** Ganze Familien weglassen ist
  ehrlich — der Anwender merkt es sofort. Einzelne Zeilen quer durch alle
  Tabellen picken ist die schlechteste Variante, weil dort niemand weiß, was
  fehlt. Die Regel steht jetzt in 9.2.
- **Die Gefahr eines kleinen Katalogs ist größer als die Lücke selbst.** Wer
  seinen Kerbfall nicht findet und „den ähnlichsten" nimmt, bekommt eine
  plausible falsche Zahl. Deshalb: kein passender Kerbfall → keine Rechnung,
  und niemals ein Vorschlag für etwas Ähnliches.
- **Was den Weg wirklich verbauen würde**, ist nicht die Zahl der Details,
  sondern die Struktur: Ein Kerbfall ist ein Entscheidungsbaum, keine Zahl
  (die Quer-Stumpfnaht allein hat fünf Werte je nach Ausführung), die
  Schlüssel müssen aus der Norm kommen, und jeder Eintrag trägt seine
  Anwendungsbedingungen mit. Das nachzurüsten ist teuer, es von Anfang an zu
  haben kostet nichts.
- **Eine Entscheidung drängt zeitlich:** der Versionsstempel im Dateiformat.
  Er gehört in N11 und damit vor die Ermüdung, sonst lassen sich alte
  Rechnungen später nicht mehr öffnen.

**Auf die Frage nach den Praxis-Kerbfällen — die der Plan seit Monaten für
diesen Moment vormerkte — antwortete Dieter: „eigentlich schon alle".** Damit
war die Reduktion kleiner als gedacht, und ein Widerspruch fiel auf: Der
kuratierte Katalog der Recherche enthält keine **Hohlprofile**, während vier
der zwölf Beispiele umlaufend geschweißte Hohlprofile sind. Ein Programm, das
solche Fälle statisch sauber rechnet und beim Ermüdungsnachweis passen muss,
wirkt widersprüchlich — auch wenn die Meldung ehrlich ist. Tabelle 8.6 kommt
dazu, mit einer ergänzenden Recherche vor N14.

**Zwei kleinere Punkte wurden gleich miterledigt.** Der **Endkraterabzug**
bekommt ein Ankreuzfeld — mit der Auflage, dass die konservative Seite die
Voreinstellung bleibt und der Rechenweg benennt, wie gerechnet wurde; ein
stiller Schalter wäre schlimmer als gar keiner. Und die **Modulkennungen**
werden nicht erst mit N11 abgesichert, sondern mit N9: vier Fälle in zwei
Bausteinen waren genug. Der Harness bekommt eine Tabelle Modul → VERSION plus
Prüfsumme; ein geänderter Quelltext ohne Kennungswechsel wird rot. Erst damit
belegt die Versionszeile, dass die Module nicht nur da, sondern auch aktuell
sind.

**Offen geblieben — bewusst:** die Herkunft der Spannungsschwingbreite. Sie
hängt am Rechenkern, nicht am Katalog, und bis N13a liegen vier Bausteine.

**Code unverändert, `Codestand` bleibt 2.44.**
**Basislinie unverändert: 1825 Assertions · Smokes 662 / 663.**
**Nächster Schritt: Baustein N9 (Vorwärmung & t8/5).**


**v2.47 (2026-08-05):** **N9a — der Wächter und der Wärmeführungs-Kern.**

**Aus N9a (2026-08-05) — Entscheidungen und Erfahrungen**

**Die Recherche hat gesagt: nein.** Dieter wollte beide Vorwärmverfahren, auch
Methode A. Die gezielte Nachrecherche kam mit einer klaren Absage zurück: Die
13 Nomogramme der Norm wurden nie tabelliert, es gibt keine Näherungsformel,
und auch die genannte Alternative AWS D1.1 Annex B liefert ihre Zahlen nur
innerhalb der AWS-Norm. **Das ist der eigentliche Wert dieser Recherche
gewesen** — sie hat verhindert, dass wir etwas anfangen, das wir nicht ehrlich
zu Ende bringen können. Eine halbe Stunde Suchen gegen eine Etappe Arbeit an
erfundenen Kurvenwerten.

**Zwei alte Widersprüche fielen als Beifang.** Der wichtigere: Die kombinierte
Dicke ist die **Summe** der zusammenlaufenden Blechdicken, nicht ihr
Mittelwert. Das verbreitete ½·(t1+t2) für Stumpfnähte stammt aus der
australischen AS 3992. Hätten wir es übernommen — und die frühere
Recherchedatei legte es nahe —, hätte das Programm **zu niedrige
Vorwärmtemperaturen** geliefert, also auf der unsicheren Seite. Genau davor
warnt jetzt ein Absatz im Quelltext, damit es niemand „zurückrepariert".

**Der Wächter kam zuerst, und das war richtig.** Die Absicherung der
Modulkennungen (S43) wurde vor dem eigentlichen Rechenkern gebaut, damit
alles Folgende schon darunter entsteht. Er hat sich sofort bewährt: Beim
Anlegen der Tabelle hatte ich für `assistent.js` eine veraltete Prüfsumme
eingetragen — rot. Bei der Gegenprobe machte eine einzige zusätzliche
Kommentarzeile in `naht.js` ihn rot, das Zurücknehmen wieder grün. Und
während des Bauens meldete er meine eigene Änderung an `thermik.js`.
**Fünf Kennungen wurden korrigiert**, die stillschweigend alte Stände
meldeten. Erst damit belegt die Versionszeile, dass die Module nicht nur da,
sondern aktuell sind.

**Der lehrreichste Anker war der scheinbar falsche.** Die Vorwärmung ergab
162,83 °C, publiziert waren 155 °C — knapp 5 % Abstand. Der Reflex wäre
gewesen, die Formel zu suchen. Richtig war, die Quelle zu lesen: Die 155 °C
sind eine **Diagrammablesung**, und dieselbe Quelle rechnet zur Kontrolle mit
der SEW-Fassung nach und kommt auf „rund 162 °C". Unsere SEW-Fassung liefert
161,94. Das ist exakt die Regel aus 9.2, die S39 hervorgebracht hat: *ein
publiziertes Beispiel ist ein Anker, kein Beweis* — und diesmal war der
Unterschied nicht ein Fehler der Quelle, sondern ein anderer **Wertetyp**.
Beide Fassungen sind jetzt wählbar, die Norm als Voreinstellung.

**Die Gegenprobe fand einen echten Denkfehler.** Die Auslegung aufs
Zielfenster löste zunächst nur **eine** Ableitungsart auf, während die
Vorwärtsrechnung den **größeren** der beiden Werte nimmt. Der Vorschlag traf
das Fenster damit nicht — 9,3 s statt der geforderten 8,0. Gefunden hat es
nicht die Formelprüfung, sondern die Probe, die den Vorschlag **wieder
vorwärts einsetzt**. Das ist dasselbe Muster wie beim Zwölf-Fälle-Vergleich in
N8a: Wer zwei Richtungen baut, muss sie gegeneinander prüfen, nicht jede
gegen sich selbst.

**Zur Teilung:** Der Plan führte N9 als einteilig. Mit Rechenkern, zwei
Rechenrichtungen, Panel, Assistent und zwei Zusatzpunkten war das zu viel —
geteilt statt gehetzt, wie 5.2 es vorsieht. Der Schnitt ist derselbe wie bei
N8: erst die Logik, die man beweisen kann, dann die Oberfläche. Zum dritten
Mal hat er getragen.

**Basislinie 1825 → 1939 Assertions · Smokes 662/663 → 663/664.**
**Codestand 2.44 → 2.47 · 17 Module.**
**Nächster Schritt: N9a abnehmen, dann N9b.**


**v2.48 (2026-08-05):** **N9a abgenommen — die Versionszeile ist jetzt ein Beleg.**

**Aus der Rückmeldung 2026-08-05 (N9a abgenommen)**

Dieter hat die Versionszeile geprüft, mehrere Beispiele durchgerechnet und den
Assistenten laufen lassen. Alles grün, keine Nacharbeit. Die vierte Abnahme in
Folge ohne Beanstandung.

**Der eigentliche Ertrag dieser Abnahme ist nicht, dass etwas funktioniert,
sondern dass etwas jetzt BEWIESEN ist.** In der Zeile stehen alle fünf
korrigierten Kennungen. Wichtiger noch sind die sechs Module, die weiterhin
`0.1.0-N1` oder `-N2` melden: `daten`, `hilfe`, `kerbfall`, `naht`, `options`
und die übrigen. Bis heute war das eine Behauptung — sie könnten alt gewesen
sein oder unverändert, die Zeile sagte es nicht. Seit dem Wächter aus S43 ist
es eine Aussage: **Was eine alte Kennung trägt, ist nachweislich unverändert.**

Der Punkt war seit N7 viermal aufgefallen, jedes Mal beim bloßen Lesen der
Zeile durch Dieter, nie durch einen Test. Repariert wurde er erst, als das
Muster eindeutig war — und dann nicht als Einzelfall, sondern als Regel mit
Prüfung. Das ist derselbe Weg wie bei der festgeschriebenen Assertion aus
v2.36 und bei der Anker-Frage aus S39: **erst benennen, dann terminieren, dann
so reparieren, dass der Rückfall auffällt.**

**Eine Beobachtung zur Prüfung selbst.** Ich hatte Dieter gebeten, auch das
Rechnen und den Assistenten zu prüfen, obwohl an vier Modulen nur je eine
Kennungszeile geändert wurde. Genau solche Änderungen sind die, bei denen
niemand nachsieht — und bei denen ein Tippfehler in einer Zeichenkette
unbemerkt bliebe, weil er syntaktisch gültig ist.

**Code unverändert, `Codestand` bleibt 2.47.**
**Basislinie unverändert: 1939 Assertions · Smokes 663 / 664.**
**Nächster Schritt: N9b — Panel, Rechenweg, Assistenten-Schritte, Endkraterabzug.**


**v2.49 (2026-08-05):** **Das t8/5-Zielfenster — eine Entscheidung über das Nichtwissen.**

**Aus der Festlegung 2026-08-05 (Zielfenster)**

Dieter gab die Richtung vor — Vorbelegung ja, damit ein Laie weiterkommt, und
überschreibbar per Haken — und überließ mir die Zahl. Die Recherche führt zwei
veröffentlichte Fenster, die sich widersprechen: 5–20 s aus einer Quelle,
10–25 s aus zweien.

**Die Wahl fiel auf die Überschneidung, 10–20 s.** Der Reiz lag darin, dass
das keine dritte, erfundene Zahl ist: Wer in diesem Bereich liegt, erfüllt
*beide* Empfehlungen. An beiden Enden ist es die strengere Grenze, das Programm
warnt also eher zu früh. Beide Quellfenster stehen im Hilfetext — wer eine
abweichende Vorgabe hat, sieht sofort, woher der Unterschied kommt.

**Die schwierigere Hälfte der Entscheidung war, wo es KEINE Vorbelegung gibt.**
Für unlegierte Baustähle — S235, S275, S355, also die häufigsten überhaupt —
führen die Quellen kein Zeitfenster. Die bequeme Lösung wäre gewesen, das
Feinkornfenster einfach mitzuverwenden; es hätte plausibel ausgesehen und
niemandem wäre etwas aufgefallen. Genau deshalb nicht: **Bei den häufigsten
Stählen wäre eine erfundene Grenze die auffälligste Lüge — und die, die am
längsten unbemerkt bliebe.** Dort bleibt die Ampel grau und sagt, dass kein
belegtes Fenster vorliegt; gerechnet und angezeigt wird der Wert trotzdem.

Dass t8/5 bei diesen Stählen praktisch kein Thema ist, macht die graue Ampel
außerdem sachlich richtig statt nur ehrlich. Sie ist keine Lücke, sondern eine
zutreffende Auskunft: Die Frage stellt sich dort kaum.

Dasselbe gilt am anderen Ende: Für vergütete hochfeste Güten sagen die Quellen
ausdrücklich „engeres Fenster, konkrete Zahlen herstellerspezifisch". Auch dort
keine Zahl, sondern der Verweis auf den Hersteller — und der Haken, mit dem der
Anwender die Angabe aus seinem Datenblatt einträgt.

**Zwei Regeln sind daraus in 9.2 gewandert:** Wo kein Beleg ist, gibt es keine
Vorbelegung. Und widersprechen sich zwei belegte Empfehlungen, ist die
Überschneidung die Vorbelegung — sie erfüllt beide und ist keine erfundene Zahl.

**Code unverändert, `Codestand` bleibt 2.47.**
**Basislinie unverändert: 1939 Assertions · Smokes 663 / 664.**
**Nächster Schritt: N9b — das Zielfenster ist entschieden und muss vor dem Bau
nicht mehr besprochen werden.**
