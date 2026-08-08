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


**v2.50 (2026-08-05):** **N9b — die Wärmeführung wird sichtbar, und ein Werkzeug entlarvt sich selbst.**

**Aus N9b (2026-08-05) — Entscheidungen und Erfahrungen**

**Der Endkraterabzug wurde eine Auswahlgruppe statt eines Hakens.** Das war
die beste kleine Entscheidung des Tages: Damit greift die gesamte vorhandene
Mechanik von selbst — Filterung, Bereinigung, dreisprachige Beschriftung,
Laien-ⓘ, Skizze und der Assistenten-Schritt. Ein Ankreuzfeld hätte für jedes
davon eine Sonderbehandlung gebraucht. **Wo eine Entscheidung wie eine Auswahl
aussieht, sollte sie auch eine sein.**

Die Voreinstellung bleibt der Abzug, und im Code steht bewusst
`z.endkrater !== 'ohne'` statt `=== 'abzug'`: **die unsichere Seite darf nie
durch Weglassen entstehen.** Ein unbekannter oder fehlender Wert lässt den
Abzug an. Gemessen wurde die Wirkung in beiden Lastfällen — 8 % bei reinem
Zug, über 12 % mit Biegung, weil das Widerstandsmoment mit dem Quadrat der
Länge geht. Die 15 % aus S39 waren also der Biegefall; gut, dass beide jetzt
als Assertion stehen.

**Drei Entscheidungen fielen beim Bauen der Wärmeführung:**

*Gerechnet wird mit der tatsächlichen Arbeitstemperatur.* Ohne eigene Angabe
ist das die erforderliche Vorwärmtemperatur, nicht 20 °C. Der bequeme
Standardwert wäre hier gefährlich gewesen: Er hätte eine zu kurze Abkühlzeit
geliefert und damit auf der unsicheren Seite gelegen.

*Die Wärmeführung läuft unabhängig vom Festigkeitsnachweis — und vor ihm.*
Das hat der DOM-Smoke gefunden, nicht ich. Stand sie hinter dem Abbruch, blieb
bei einem unvollständigen Formular ihr **voriges** Ergebnis stehen. Eine alte
Zahl, die aussieht wie eine neue, ist die schlimmste Sorte Fehler: Sie sieht
richtig aus, ist plausibel, und niemand prüft sie nach. Entsprechend räumt
`leeren()` die Karte weg, das Abräumen des Nachweises aber ausdrücklich nicht.

*EN 1011-2 gilt für ferritische Stähle.* Für nichtrostende Stähle und
Aluminium wird nicht gerechnet, sondern gesagt, dass andere Normen gelten.
Dieselbe Haltung wie beim Geltungsbereich der Methode B — und dieselbe
Begründung: eine Formel außerhalb ihres Anwendungsbereichs liefert eine
plausible Zahl ohne Deckung.

**Und ein Fund, der über diesen Baustein hinausgeht.** Zum Erneuern der
Wächtertabelle aus N9a hatte ich mir ein kleines Hilfsskript geschrieben: Es
liest je Modul die `VERSION` und die Prüfsumme und trägt beides ein. Das
spart Handarbeit — und **höhlt genau die Prüfung aus, für die der Wächter
gebaut wurde.** Denn es nimmt die Kennung, die im Modul *steht*, nicht die,
die dort *stehen sollte*. Aufgefallen ist es beim Abschluss: `thermik.js`
trug noch die N9a-Kennung, obwohl N9b es deutlich erweitert hatte, und der
Wächter meldete nichts, weil das Skript die alte Kennung mitgeschleppt hatte.

**Die Lehre gehört festgehalten: Ein Werkzeug, das eine Prüfung bequemer
macht, kann sie auch aushöhlen.** Die Prüfsumme darf automatisch erneuert
werden, die Kennung nie — sie ist die Aussage des Bauenden darüber, dass er
etwas geändert hat. Wer beides automatisiert, hat den Wächter zu einem
Protokollanten degradiert. Das Skript bleibt ein reiner Entwicklungshelfer
und wandert nicht in den Projektordner.

**Basislinie 1939 → 2005 Assertions · Smokes 663/664 → 748/749.**
**Codestand 2.47 → 2.50 · acht Module mit neuer Kennung.**
**Nächster Schritt: N9 abnehmen, dann N10 (Kosten, Zeit, Draht).**


**v2.51 (2026-08-05):** **N9b abgenommen — und die rote Meldung, die kein Bedienfehler war.**

Dieter hat N9b geprüft: Endkraterabzug und Wärmeführung waren bedienbar, es kam
ein Ergebnis. Aber er erwähnte beiläufig, dass „noch was rot" gewesen sei, und
vermutete einen eigenen falschen Wert.

**Das nicht als Bedienfehler durchgehen zu lassen, war die richtige
Entscheidung.** Nachgestellt ergaben sich vier mögliche Ursachen — und die
wahrscheinlichste war ein Mangel des Programms: Wer nur den Kohlenstoff
einträgt, bekommt ein CET von 0,18 und die Meldung „außerhalb des
Geltungsbereichs". Das klingt, als sei der Stahl ungewöhnlich. In Wahrheit
fehlte nur das Mangan — nach dem Kohlenstoff der größte Beitrag.

**Die Meldung beschuldigte den Werkstoff statt die Eingabe.** Das ist eine
eigene Fehlerklasse: eine Meldung, die technisch stimmt und trotzdem in die
falsche Richtung weist. Sie kostet den Anwender genau die Zeit, die eine gute
Meldung ihm spart. Behoben in N9c.

**Und eine Beobachtung zur Prüfkultur:** Dieter war der erste Anwender ohne
Beispiel — und genau dort hat es geklemmt. Das ist zugleich die Begründung für
N9c: Beispiele sind nicht Bequemlichkeit, sondern der Weg, auf dem ein
Anwender überhaupt erfährt, wie eine sinnvolle Eingabe aussieht.


**v2.52 (2026-08-05):** **N9c — vierzehn Beispiele, und die dritte tote Eingabeart.**

**Aus N9c (2026-08-05) — Entscheidungen und Erfahrungen**

Der Auftrag war klein: Die Beispiele sollen die Wärmeführung mitbringen.
Herausgekommen ist wieder eine Reparatur — die dritte, die durch denselben
Handgriff gefunden wurde.

**Die geometrische Lasteingabe war seit N3 tot.** Die Umrechnung
`schnittgroessen(F, e, richtung)` stand in `solver.js`, war sogar exportiert,
und wurde **nirgends aufgerufen**. Wer im Formular „Kraft und Hebelarm" wählte,
bekam „keine Last". Über zwei Monate hinweg hat das niemand bemerkt, weil kein
Beispiel diesen Weg ging.

**Das Muster ist jetzt dreifach belegt:** Auslegung und Stumpfnaht in N7, die
geometrische Lasteingabe in N9c. Jedes Mal gefunden beim Versuch, ein Beispiel
für einen Pfad zu bauen, den kein Beispiel berührte. **Ein Beispielkatalog ist
kein Komfort, sondern der einzige Test, der eine ganze Eingabeart als tot
entlarvt.** Ein Bauteiltest kann das nicht: Die Funktion war korrekt, sie wurde
nur nie gerufen.

**Repariert wurde mehr als der Aufruf.** Die Funktion kennt drei
Kraftrichtungen, aber es gab keine Auswahlgruppe dafür — der Anwender hätte gar
nicht sagen können, wohin seine Kraft zeigt. Die neue Gruppe `kraftrichtung`
steht **bewusst ohne Voreinstellung** da: Die Richtung entscheidet, ob Zug,
Querkraft oder Torsion entsteht, und eine geratene Richtung wäre schlimmer als
eine Rückfrage. Das ist dieselbe Haltung wie beim Zielfenster: **wo eine
Vorgabe das Ergebnis grundlegend ändert, wird gefragt statt geraten.**

**Ein Folgefund im Rechenweg.** Seine Probe verglich die Schnittgrößen gegen
die eingegebenen Felder — bei geometrischer Eingabe sind die leer, also schlug
sie fehl. Die Lösung war dieselbe wie beim Nahtbild in N7: **geprüft wird gegen
das, womit gerechnet wurde.** Dass dasselbe Prinzip zum zweiten Mal die Lösung
war, spricht dafür, es beim nächsten Zweifel zuerst zu probieren.

**Zwei Beispiele, drei Pfade, und ein ehrliches Grau.** Die neuen Fälle bringen
das vereinfachte Verfahren, die geometrische Lasteingabe und das Winkelprofil
— und sind die einzigen mit Feinkornstahl. Nur dort kann die t8/5-Ampel grün
werden; bei den zwölf übrigen bleibt sie grau. Der Versuchung, ihnen der Optik
wegen ein Zielfenster zu geben, wurde nicht nachgegeben. **Zwölf graue Ampeln
und zwei grüne sagen mehr als vierzehn grüne.**

**Was beim Bauen zweimal daneben lag und korrigiert wurde:** Der Kreuzstoß mit
Hebelarm war statisch unsinnig — die Nähte liegen nur eine Blechdicke
auseinander, das Widerstandsmoment ist winzig. Und beim Winkel war die Naht
dicker als ein Drittel des kürzesten Abschnitts, was zu Recht eine
Dünnwand-Warnung auslöste. Beides hat die Messung gefunden, nicht das Auge.

**Basislinie 2005 → 2107 Assertions · Smokes 748/749 → 762/763.**
**Codestand 2.50 → 2.52.**
**Nächster Schritt: N9c abnehmen, dann N10 (Kosten, Zeit, Draht).**


**v2.53 (2026-08-05):** **Drei Fehler aus einem einzigen Bildschirmfoto.**

Dieter lud `winkel_v` und schrieb: „nichts ist eingehakt und ausgerechnet". Dazu
ein Foto. Es zeigte mehr als die Beschreibung: die Freischalt-Haken alle offen —
**und den Bereich Vorwärmung & t8/5 trotzdem als offenen Kasten**.

**Das zweite war der wertvollere Hinweis**, weil Dieter es gar nicht erwähnt
hatte. Ein Bereich, der ohne einen einzigen sichtbaren Inhalt dasteht, sieht aus
wie ein leerer Bereich statt wie ein nicht gewählter. Der Unterschied ist für
den Anwender alles: Im ersten Fall sucht er den Fehler bei sich, im zweiten
weiß er, dass er etwas anhaken muss.

**Die eigentliche Ursache war eine Lücke im gemeinsamen Schreibweg.**
`formularSetzen()` läuft über die Auswahlgruppen — und die Freischalt-Haken
sind keine. Sie standen im Zustand, wurden aber von keiner der beiden
Schleifen erfasst. Ausgerechnet die Funktion, die in N8b als *ein* Schreibweg
für Beispiele und Assistent eingeführt wurde, hatte einen blinden Fleck.
**Ein gemeinsamer Weg ist nur so gut wie sein vollständigster Fall.**

**Der dritte Fehler kam beim Nachstellen ans Licht:** Den zwölf alten
Beispielen fehlte das Schweißverfahren. Ohne das gibt es keinen Wirkungsgrad
und damit kein Wärmeeinbringen — die Wärmeführung hätte auch bei gesetztem
Haken nicht gerechnet. Gefunden nicht am Bildschirm, sondern beim
Durchrechnen im Kleinen, nachdem der erste Fehler behoben war.

**Zur Prüfkultur:** Der DOM-Smoke lief vorher grün, weil er die Haken selbst
gesetzt hatte, statt ein Beispiel sie setzen zu lassen. Er prüfte damit den
Weg, den ein Anwender nie geht. Jetzt lädt er `winkel_v` und prüft, was danach
im Formular steht — die drei Punkte stehen namentlich drin.

**Basislinie 2107 Assertions unverändert · Smokes 762/763 → 784/785.**
**Codestand 2.52 → 2.53.**


**v2.54 (2026-08-05):** **N9c abgenommen.** `winkel_v` bringt die Wärmeführung
eingeschaltet mit, und die angezeigten Zahlen decken sich mit den Messungen.
Besonders wertvoll war Dieters Beobachtung nebenbei: Unter „Zielfenster für
t8/5" stand eine **Überschrift ohne Inhalt**. In einem Programm, das sonst
überall sagt, was es tut, wirkt so etwas wie ein abgeschnittener Gedanke — und
es war der Anlass, dort die Quelle des Fensters zu zeigen.


**v2.55 (2026-08-05):** **N9d — der Streifzug findet beim ersten Lauf etwas.**

**Aus N9d (2026-08-05) — Entscheidungen und Erfahrungen**

Dieter schlug vor, intern Probefälle durchzuspielen, um Fehler aufzudecken, und
sie danach gegebenenfalls wieder zu verwerfen. Die Idee war richtig, aber sie
ließ sich schärfen: **Ein Probefall, den man einmal durchspielt und wegwirft,
findet den Fehler einmal — derselbe Fall als Assertion findet ihn für immer.**
Verworfen wird deshalb höchstens der Katalog-Eintrag, nie die Prüfung.

Und statt zu stochern wurde systematisiert: Der Streifzug betritt **jede Option
jeder rechenwirksamen Gruppe** einmal und verlangt entweder eine Rechnung oder
einen benannten Grund. 87 Fälle, +813 Assertions.

**Er hat beim ersten richtigen Lauf einen echten Widerspruch gefunden** — genau
das, was Dieter sich davon erhofft hatte. Bei der Auslegung beschrieb das
Nahtbild die Naht mit dem *erforderlichen* a-Maß, Fläche und Ausnutzung aber
die mit dem *gewählten*. Die Rechenprobe „Fläche = Summe a·l" musste scheitern.
Ursache war ausgerechnet die Reparatur aus N7: Die Außeniteration konvergiert
auf a_erf, gebaut wird aber a_gewaehlt — und dessen Naht ist wegen des
Endkraterabzugs kürzer. **Eine Reparatur kann eine neue Unstimmigkeit
erzeugen, wenn sie nur die halbe Kette nachzieht.**

Kein Beispiel hatte je Auslegung *und* Endkraterabzug zugleich. Wieder derselbe
blinde Fleck — und diesmal hat ihn nicht ein Beispiel gefunden, sondern das
Werkzeug, das Beispiele überflüssig macht, wo es nur ums Betreten geht.

**Eine gemessene Zahl hat sich geändert**, und das war der unangenehme Teil:
`konsole` liefert jetzt 760 mm statt 764. Die Versuchung, den alten Wert zu
behalten, weil er ja „abgenommen" war, ist real. Aber 764 mm beschrieb eine
Naht mit a = 2,504 mm, die niemand baut. **Eine abgenommene Zahl ist nicht
dadurch richtig, dass sie abgenommen wurde.**

**Bei den Vorbelegungen wurde eine Unterscheidung nötig.** Dieter wollte
möglichst viele Felder vorbelegt haben, damit ein Laie weiterkommt — richtig.
Aber Schweißspannung, Strom und Geschwindigkeit stehen in keiner Norm. Sie
genauso auszuzeichnen wie γ_M2 hätte einen Erfahrungswert zur Vorschrift
gemacht. Deshalb jetzt zwei Sorten: **Tabellenwert** und **Anhaltswert**, beide
gesperrt und überschreibbar, aber der zweite sagt von sich, dass keine Norm
dahintersteht. **Das ist der Unterschied zwischen Hilfe und Behauptung.**

**Und eine Lehre über Werkzeuge**, die zur Lehre aus v2.50 passt: Beim Prüfen
des Projektordners fehlte `test_naht.js` in einer Lieferung — der Wächter
meldete vier rote Zeilen für Module, die völlig in Ordnung waren. Sobald sich
ein Modul ändert, ändert sich die Wächtertabelle mit. Die Datei gehört deshalb
in **jede** Lieferung, auch wenn keine Assertion angefasst wurde. Steht jetzt
in 9.2.

**Basislinie 2107 → 2942 Assertions · Smokes 784/785 → 801/802.**
**Codestand 2.53 → 2.55.**
**Nächster Schritt: N9d abnehmen, dann N10 (Kosten, Zeit, Draht).**


**v2.56 (2026-08-05):** **Baustein N9 vollständig abgenommen.**

**Aus der Rückmeldung 2026-08-05 (N9 abgenommen)**

Dieter hat die Fälle im Programm durchgespielt und nichts beanstandet. Damit
ist die Wärmeführung fertig: Vorwärmung nach Methode B, Abkühlzeit in beiden
Ableitungsarten, Auslegung aufs Zielfenster, eigene Ergebniskarte, Assistenten-
Schritt — und zwei Beispiele, die es vorführen.

**Was dieser Baustein über das Arbeiten gezeigt hat**, war wertvoller als sein
Inhalt:

**Eine Recherche darf mit Nein antworten.** Methode A ließ sich nicht ehrlich
bauen — 13 Nomogramme, nie tabelliert. Die halbe Stunde Suchen hat eine ganze
Etappe an erfundenen Kurvenwerten verhindert. Und sie hat als Beifang zwei alte
Widersprüche gelöst, darunter die kombinierte Dicke, wo die verbreitete
Halbierung auf der **unsicheren** Seite gelegen hätte.

**Ein Werkzeug kann eine Prüfung aushöhlen.** Das Hilfsskript für die
Wächtertabelle las die Kennung aus dem Modul und schleppte damit eine
vergessene Kennung mit, statt sie aufzudecken. Die Prüfsumme darf automatisch
erneuert werden, die Kennung nie.

**Ein Bildschirmfoto enthält mehr als seine Beschreibung.** Dieter schrieb
„nichts ist eingehakt"; das Bild zeigte zusätzlich einen Bereich, der sichtbar
war, obwohl er nicht gewählt war. Der zweite Fehler war der wichtigere, und er
wäre in Worten nie erwähnt worden.

**Und der Streifzug hat bewiesen, was er wert ist.** Dieters Vorschlag, intern
Probefälle durchzuspielen, hat beim ersten Lauf einen Widerspruch gefunden, den
kein Beispiel je berührt hätte — und er hat gezeigt, dass eine Reparatur eine
neue Unstimmigkeit erzeugen kann, wenn sie nur die halbe Kette nachzieht.

**Der Stand:** N1 bis N5, N6b, N7, N8 und N9 abgenommen — sechs von zehn
Bausteinen bis zum Verkaufsstand. Offen: N10 (Kosten), N11 (Ausgaben),
N12 (Edition) und N13/N14 (Ermüdung). Die Basislinie ist an einem Tag von
1138 auf 2942 Assertions gewachsen.

**Code unverändert, `Codestand` bleibt 2.55.**
**Nächster Schritt: Baustein N10 (Kosten, Zeit, Drahtbedarf).**


**v2.57 (2026-08-05):** **N10a — der Baustein, bei dem die Zahlen altern.**

**Aus N10a (2026-08-05) — Entscheidungen und Erfahrungen**

N10 unterscheidet sich von allen bisherigen Bausteinen: **Preise sind keine
Normen.** Ein Stundensatz von 35 €/h ist von 2019, ein Gaspreis von 2025 ist
nächstes Jahr falsch. Alles, was dieses Programm bisher gebaut hat, war
entweder normativ oder physikalisch — beides altert nicht.

**Die Antwort war, die Rechnung zu teilen.** Mengen und Zeiten folgen aus
Geometrie und Physik: Schweißgut, Draht, Gasliter, Minuten, Kilowattstunden.
Die stehen immer da und bleiben richtig. Kosten entstehen erst mit Preisen,
und **jeder Preis trägt sein Jahr**. So veraltet nie das Ergebnis, sondern
höchstens eine Annahme, die sichtbar danebensteht. Die Recherche R6 hatte
genau das gefordert, bevor ich es vorschlug — ein gutes Zeichen für beide.

**Damit gibt es jetzt drei Sorten Wert.** Tabellenwert aus der Norm,
Anhaltswert aus der Praxis (seit N9d), Preisannahme mit Jahr (neu). Sie gleich
aussehen zu lassen wäre bequem und falsch: Aus einem Preis von 2019 würde eine
Vorschrift.

**Der schwierigste Punkt war Dieters Wunsch nach allen zehn
Kostenpositionen.** Vier davon kann das Programm herleiten — Lohn aus der
Zeit, Draht aus der Masse, Gas aus dem Durchfluss, Energie aus U·I. Für die
anderen sechs gibt es **keine** Grundlage: Prüfkosten lassen sich nicht aus
einer Nahtgeometrie berechnen. Sie einfach wegzulassen hätte die Summe zu
niedrig gemacht; sie zu schätzen wäre erfunden gewesen. Die Lösung: Sie
existieren, stehen auf null, **und die Summe sagt, welche leer sind.** Eine
Gesamtsumme, die stillschweigend etwas weglässt, ist die gefährlichste Zahl
im ganzen Programm — sie sieht vollständig aus.

**Der Anker sitzt beim ersten Lauf**, und zwar auf allen acht Größen. Das ist
in diesem Projekt selten genug, um es zu erwähnen — und es liegt daran, dass
die Recherche ein vollständig durchgerechnetes Beispiel mitbrachte, nicht nur
Formeln.

**Eine bewusste Abweichung vom Anker:** Beim Gas nennt die Quelle ~110 l
*einschließlich* eines Anfahrzuschlags, den sie nicht beziffert. Wir geben
108,3 l — den nackten Verbrauch. **Einen Zuschlag zu raten, den niemand
angibt, wäre eine erfundene Zahl**, und sie wäre in der Summe nicht mehr von
einer gerechneten zu unterscheiden.

**Basislinie 2942 → 3015 Assertions · Smokes 801/802 → 802/803.**
**Codestand 2.55 → 2.57 · 18 Module.**
**Nächster Schritt: N10a abnehmen, dann N10b.**


**v2.58 (2026-08-05):** **N10a abgenommen — und ein Bild, das diesmal nichts Neues zeigte.**

Dieter hat N10a geprüft: Versionszeile mit 18 Modulen, dazu ein
Bildschirmfoto der gerechneten Wärmeführung. Das war die eigentliche Prüfung —
N10a selbst ist DOM-frei, aber es hat `i18n_kern.js` und beide HTMLs angefasst,
und das sind die Dateien, über die alles andere läuft.

**Diesmal zeigte das Bild nichts Unerwartetes**, und auch das ist eine
Information: Vier Teilbeträge der Vorwärmformel, grüne Ampel, die
„eigener Wert"-Haken der Nahtfaktoren richtig gesetzt, weil das Beispiel sie
mitbringt. Nach dem Fund aus v2.53 — wo ein Foto zwei Fehler enthielt, von
denen einer gar nicht erwähnt war — lohnt es sich, das festzuhalten: **Die
Gewohnheit, ein Bild zu schicken, ist mehr wert als die Frage, die dabeisteht.**

**Eine Beobachtung bleibt offen.** Die Felder *Zielfenster von/bis* stehen
leer, während das Ergebnis „10 bis 20 s" zeigt. Das ist die Folge einer
bewussten Entscheidung aus N9d: Es kann keine allgemeine Vorbelegung geben,
weil für unlegierte Baustähle gar kein Fenster belegt ist. Richtig — aber ein
leeres Feld neben einem gefüllten Ergebnis ist für einen Laien erklärungs-
bedürftig. Notiert für N10b, nicht sofort geändert: Eine Lösung, die dem
Anwender das Fenster ins Feld schreibt, würde bei S235 wieder eine erfundene
Zahl erzeugen.

**Code unverändert, `Codestand` bleibt 2.57.**
**Nächster Schritt: N10b.**


**v2.59 (2026-08-05):** **N10b — ein Feld, das zwei Bereichen gehört.**

**Aus N10b (2026-08-05) — Entscheidungen und Erfahrungen**

Der interessanteste Punkt war klein und strukturell: **Spannung, Strom und
Geschwindigkeit werden von zwei Zusatzbereichen gebraucht.** Die Wärmeführung
rechnet daraus das Wärmeeinbringen, die Kostenrechnung Zeit und Energie. Bis
N10b lagen sie bei der Wärmeführung — wer nur kalkulieren wollte, hätte sie
mit einschalten müssen.

**Die naheliegende Lösung wäre gewesen, sie zu verdoppeln.** Ein Satz Felder
für jeden Bereich. Das hätte funktioniert und wäre falsch gewesen: **Zwei
Felder für dieselbe Zahl sind zwei Gelegenheiten, sie verschieden
anzugeben** — dieselbe Begründung wie beim gemeinsamen Schreibweg in N8b und
bei der Nahtlänge, die aus dem gerechneten Nahtbild kommt statt aus einem
eigenen Feld.

Stattdessen wurde die Bedingungsauswertung erweitert: Ein **Array** von
Bedingungen wirkt als ODER. Zwei kleine Funktionen in `validate.js` und
`ui.js`, dieselbe Regel an beiden Stellen — und ein neuer Bereich, der
erscheint, sobald einer der beiden Zusatzbereiche an ist. Die Erweiterung wird
bei N13 wieder gebraucht werden.

**Die dritte Sorte Wert hat sich bewährt.** Preisannahmen tragen jetzt ihr Jahr
sichtbar unter dem Feld. Der Stundensatz stammt aus einer Quelle von 2019 und
ist heute sicher zu niedrig — genau deshalb steht das Jahr da. Ein Preis, der
aussieht wie ein Normwert, wäre die gefährlichste stille Behauptung im
Programm, weil ihn niemand nachprüft.

**Und eine Erkenntnis über Vollständigkeit:** Auch eine *rechenbare* Position
kann leer bleiben. Ohne Spannung und Strom gibt es keine Energiekosten. Sie
dann still auf null zu setzen wäre derselbe Fehler wie das Weglassen der
Prüfkosten — die Summe sähe vollständig aus und wäre es nicht. Die Leerliste
führt deshalb beides: was das Programm nicht herleiten kann, und was es
mangels Eingaben nicht konnte.

**Der Stand:** Sieben von zehn Bausteinen bis zum Verkaufsstand sind fertig.
Offen bleiben N11 (Ausgaben), N12 (Edition) und N13/N14 (Ermüdung). Bei N11
wartet die Entscheidung über den **Versionsstempel im Dateiformat** — die
einzige der Festlegungen aus v2.46, die zeitlich drängt, weil gespeicherte
Rechnungen sich später noch öffnen lassen müssen.

**Basislinie 3015 → 3053 Assertions · Smokes 802/803 → 905/906.**
**Codestand 2.57 → 2.59.**
**Nächster Schritt: N10 abnehmen, dann N11.**


**v2.60 (2026-08-05):** **Baustein N10 abgenommen — sieben von zehn.**

Dieter hat alle Bereiche durchgespielt und ausdrücklich auch die Kopplung
geprüft: Ein größeres a-Maß zieht den Drahtbedarf mit. Das war die eigentliche
Probe — sie belegt, dass die Kostenrechnung ihre Nahtlänge aus dem
**gerechneten** Nahtbild nimmt und nicht aus einem zweiten Feld.

**Damit ist der Tag abgeschlossen, an dem vier Bausteine dazukamen** — N7 und
N8 abgenommen, N9 und N10 gebaut und abgenommen. Die Basislinie wuchs von 1138
auf 3053 Assertions, die DOM-Smokes von 537 auf 905.

**Was in diesen vier Bausteinen über das Arbeiten gelernt wurde**, ist in 9.2
gewandert und gilt weiter:

- Eine Recherche darf **Nein** sagen — und erspart damit eine ganze Etappe.
- Ein Werkzeug, das eine Prüfung bequemer macht, kann sie **aushöhlen**.
- Ein Bildschirmfoto enthält **mehr als seine Beschreibung**.
- Ein Probefall, der etwas findet, wird eine **Assertion** — nicht weggeworfen.
- Wo **kein Beleg** ist, gibt es **keine Vorbelegung**.
- **Zwei Felder für dieselbe Zahl** sind zwei Gelegenheiten, sie verschieden
  anzugeben.
- Eine **Summe sagt, was in ihr steckt** — sonst sieht sie vollständig aus.

**Vor N11 steht eine Entscheidung, die seit v2.46 wartet:** der
**Versionsstempel im Dateiformat**. Sie drängt, weil eine gespeicherte Rechnung
mit Kerbfallcode sich später noch öffnen lassen muss, wenn der Katalog
gewachsen ist. N11 ist außerdem der erste Baustein, bei dem das Programm etwas
**aus der Hand gibt** — eine Datei, einen Ausdruck, ein RTF. Was darin steht,
ist danach nicht mehr korrigierbar.

**Code unverändert, `Codestand` bleibt 2.59.**
**Nächster Schritt: N11 (Ausgaben).**


**v2.61 (2026-08-06):** **Zwei Fehler, die beide Smokes nicht gesehen haben.**

Dieter meldete zwei Beobachtungen aus dem Alltagsgebrauch — beide echt, beide
von den 905 Prüfungen nicht berührt.

**Der erste war der unauffälligere und deshalb der gefährlichere.** Nach einem
Sprachwechsel stand die Kostenkarte gemischt da: Überschriften auf Englisch,
Zeilen auf Deutsch. Ein neues Durchrechnen räumte es auf — genau das ließ es
harmlos aussehen. **Eine halb übersetzte Anzeige ist schlimmer als eine gar
nicht übersetzte: Sie sieht aus, als wäre sie fertig.** Die Ursache war banal:
Die Kostenkarte fehlte in der Liste der Anzeigen, die beim Umschalten neu
gebaut werden. Die Wärmeführung stand dort seit N9b, die Kosten hatte ich
schlicht vergessen — bei einer Karte, die ich selbst zwei Stunden zuvor gebaut
hatte.

**Der zweite ist zum vierten Mal dieselbe Ursache.** Bei der Auslegung ist das
Feld `a` leer, weil a gerade gesucht wird. Die Kostenrechnung las es trotzdem
aus dem Formular und meldete „Angaben zur Naht fehlen", obwohl das Ergebnis
ein fertiges `a_gewaehlt` enthielt.

Vorher: das Nahtbild in N7, die Lastprobe in N9c, die Auslegungsgeometrie in
N9d. Immer las ein Folgeschritt aus dem **Formular** statt aus dem
**Ergebnis**. Viermal reicht — die Regel steht jetzt in 9.2 und gilt für jeden
künftigen Folgeschritt: **Gerechnet wird mit dem, womit gerechnet wurde.**

**Die Gegenprobe war diesmal ausdrücklich Teil der Arbeit.** Beide Fixes wurden
nach dem Bau der Prüfungen wieder entfernt: Ohne den ersten fallen zwei Zeilen,
ohne den zweiten genau eine. **Eine Prüfung, die ohne den Fix nicht rot wird,
ist wertlos** — und sie sieht genauso grün aus wie eine, die etwas taugt.

**Und eine Beobachtung über den Streifzug:** Er hat beide Fehler nicht
gefunden, obwohl er 87 Fälle betritt. Der erste braucht einen Sprachwechsel
**nach** dem Rechnen, der zweite eine zugeschaltete Kostenrechnung **bei
Auslegung** — beides Kombinationen aus zwei Zuständen, nicht einzelne Optionen.
Der Streifzug prüft eine Dimension; Dieter prüft die Fläche.

**Basislinie 3053 unverändert · Smokes 905/906 → 915/916.**
**Codestand 2.59 → 2.61.**


**v2.62 (2026-08-06):** **Das Dateiformat — die Entscheidung, die vor die Ermüdung gehörte.**

Sie stand seit v2.46 aus und war die einzige der damaligen Festlegungen mit
einem Termin: Eine gespeicherte Rechnung mit Kerbfallcode muss sich noch öffnen
lassen, wenn der Katalog von dreizehn auf achtzig Details gewachsen ist.

**Der Kern ist die Trennung zwischen einer Zahl, auf die das Programm
reagiert, und Zahlen, die für Menschen da sind.** `format` steuert das Lesen
und steigt nur bei echten Strukturbrüchen — vielleicht zwei- oder dreimal in
der Lebenszeit des Programms. `geschrieben_mit` und `datum` steuern nichts; sie
beantworten die Frage, die in zwei Jahren kommt: *Warum sieht mein Ergebnis
anders aus?*

**Der schärfste Punkt ist das Verhalten bei einer neueren Datei: nicht
öffnen.** Der Reflex wäre, so viel zu lesen wie möglich. Aber eine Datei aus
einer neueren Fassung enthält womöglich Angaben, die dieses Programm nicht
kennt — und die halb gelesene Datei rechnet dann etwas, das der Anwender nicht
gemeint hat. **Eine Ablehnung ist sichtbar, ein halb gelesener Fall nicht.**

**Dieters Festlegung, nur die Eingaben zu speichern, ist die sauberere
Trennung**: Die Datei beschreibt den Fall, nicht das Ergebnis. Sie hat eine
Folge, die benannt werden musste — beim Öffnen einer alten Datei kann ein
anderes Ergebnis herauskommen, ohne dass es jemand sagt. Genau das ist in
diesem Projekt schon passiert: Die `konsole` liefert seit N9d 760 mm statt 764,
und die alte Zahl war zwei Tage lang abgenommen. Der sichtbare Stempel fängt
das ab: Er ersetzt keinen Vergleich, aber er lässt den Unterschied nicht stumm.

**Und eine Entscheidung, die mich überzeugt hat, weil ihre Begründung über
Bequemlichkeit hinausgeht.** Dieter will im lokalen Speicher nur Sprache und
Edition, nicht die letzten Eingaben. **Ein halb ausgefülltes Formular vom
Vortag sieht aus wie ein frischer Fall** — der Anwender ändert zwei Werte und
rechnet mit drei, die er längst vergessen hat. Ein leeres Formular ist
ehrlicher als ein altes. Dieselbe Haltung wie bei der stehen gebliebenen
Wärmeführungskarte in N9b: **Eine alte Zahl, die aussieht wie eine neue, ist
die gefährlichste Sorte Fehler.**

**Code unverändert, `Codestand` bleibt 2.61.**
**Nächster Schritt: N10c prüfen, dann N11 bauen.**


**v2.63 (2026-08-06):** **N10c abgenommen — und ein Ausweichweg, der etwas verrät.**

Beide Fehler sind weg: Der Sprachwechsel lässt die Kostenkarte vollständig
mitwandern, und die Kostenrechnung läuft auch bei der Auslegung mit leerem
a-Feld.

**Interessanter als die Abnahme war der Weg dorthin.** Weil die Bereitstellung
auf GitHub Pages hängen blieb — der Build lief durch, nur das Ausrollen
scheiterte —, hat Dieter alle Module in eine einzige HTML kopiert und offline
geprüft. Derselbe Code, nur anders geladen. Dass die Versionszeile trotzdem
korrekt alle 18 Module meldete, ist der Beleg, dass sich jedes registriert hat.

**Daraus folgt etwas für später:** Wenn sich das Programm so ohne weiteres in
eine einzige Datei falten lässt, ist das eine mögliche **Auslieferungsform** —
eine HTML, kein Server, kein Netz. Für ein Werkzeug, das auf Baustellen und in
Werkstätten benutzt wird, kann das mehr wert sein als eine Webadresse. Notiert
für N12, nicht entschieden.

**Und eine Beobachtung zur Diagnose:** Das Bildschirmfoto der GitHub-Prüfungen
hat die Frage in einem Zug geklärt — Build erfolgreich, nur Bereitstellung
gescheitert. Ohne das Bild hätte ich geraten, und der naheliegende Rat wäre
falsch gewesen: noch einmal hochladen hätte nichts geändert, weil am Code
nichts fehlte. **Zum dritten Mal hat ein Bild eine Vermutung ersetzt.**

**Der Stand:** Sieben von zehn Bausteinen bis zum Verkaufsstand sind fertig.
Offen bleiben N11 (Ausgaben, Dateiformat entschieden), N12 (Edition) und
N13/N14 (Ermüdung).

**Code unverändert, `Codestand` bleibt 2.61.**
**Nächster Schritt: N11.**


**v2.64 (2026-08-06):** **Der Plan-Kopf war zerrissen — und keine Prüfung hat es gemerkt.**

Dieter fragte vor der Übergabe an einen neuen Chat, ob der Satz *„Lies dir
Schweißnaht-1.md genau durch, danach weiter mit N11"* ausreicht. Beim
Nachsehen fand sich, dass der erste Absatz des Plans durch wiederholtes
Ersetzen **zerrissen** war: Er endete mitten in „dazu N9c gebaut und" und ging
dann in einen anderen Satz über. Zwei Zeilen tiefer stand noch der veraltete
Einstiegssatz „weiter mit N8" — aus einer Zeit vor vier Bausteinen.

**Das ist eine eigene Fehlerklasse.** Über 3000 Assertions prüfen Zahlen,
Codes, Texte und Modulkennungen — aber keine einzige liest den Fließtext des
Plans. Der Kopf ist zugleich das Erste, was ein neuer Chat sieht. Ein
abgebrochener Halbsatz dort ist folgenloser als ein Rechenfehler und
gleichzeitig gefährlicher, weil er die Arbeit in die falsche Richtung lenkt,
bevor sie beginnt.

**Bemerkenswert ist, wodurch es aufgefallen ist:** nicht durch einen Test,
sondern durch die **Frage nach der Übergabe**. Dieter wollte nur wissen, ob ein
Satz genügt — und weil ich nachgesehen statt geantwortet habe, kam es heraus.
**Eine Frage nach der Vollständigkeit ist selbst eine Prüfung**, wenn man sie
ernst nimmt, statt sie aus dem Gedächtnis zu beantworten.

Neue Regel in 9.2: Der Plan-Kopf wird vor jeder Chat-Übergabe **gelesen**,
nicht nur geschrieben.

**Code unverändert, `Codestand` bleibt 2.61.**
**Nächster Schritt: N11.**

---

## Aus N11 (2026-08-07) — Ausgaben, Dateiformat, Gating, Namensabgleich

**Der abgestimmte Umfang (Dieter, 2026-08-07).** Drei Fragen, drei Antworten:
*einteilig komplett, aber mit vielen Prüfungen* · Word *mit Bildern, auf der Seite
angepasst — entscheide du, es muss laufen* · das Freitextfeld für die WPS-Nummer
*weiter weglassen*.

**Die delegierte Entscheidung und wie sie ausgefallen ist.** RTF kann ein PNG tragen
(`\pict\pngblip`). Das SVG dafür zu rastern geht nur im Browser über Canvas — und das
ist der einzige Schritt in ganz N11, den kein Node-Test erreicht. Deshalb nimmt
`baueRtf()` die Bilddaten *entgegen*, statt sie zu erzeugen: der gesamte Zusammenbau
bleibt prüfbar, nur der eine Millimeter nicht. Und dieser eine Millimeter bekommt einen
Rückfallweg: Fehlt das Bild, entsteht die Datei trotzdem und nennt den Grund. Dieters
Satz „es muss laufen" ist damit wörtlich umgesetzt — es gibt keinen Weg, auf dem die
Word-Ausgabe gar nichts liefert.

**Warum `report.js` DOM-frei ist, obwohl es Dateien schreibt.** Es schreibt keine. Es
baut und liest Zeichenketten; Blob, Dateiwahl, Canvas und Drucken bleiben in `ui.js`.
Der Schnitt war die wichtigste Entscheidung des Bausteins: 196 der 221 neuen Assertions
liegen auf der Ausgabeseite. Ohne ihn wäre die Hälfte von N11 ungeprüft geblieben —
und Ausgaben sind die Stelle, an der ein Fehler nicht beim Rechnen auffällt, sondern
Jahre später, wenn eine Datei nicht mehr aufgeht.

**Das Gating hat genau eine Tür.** Alle vier Ausgaben fragen `Report.guard()`, und
`ui.js` ruft es an einer einzigen Stelle; eine Assertion zählt das nach. Beim Bauen war
zuerst eine zweite Stelle entstanden (die Sitzungsfunktion für den DOM-Smoke) — sie ist
zu einem gemeinsamen `gating()` zusammengezogen worden. Zwei Türen wären zwei
Gelegenheiten, eine davon zu vergessen, und vergessen hieße hier: eine Ausgabe läuft in
der Testversion doch durch. Gesperrt ist außerdem die sichere Seite — eine leere oder
unbekannte Edition gibt nichts frei, statt „alles außer `test`" zu erlauben.

**Die scharfe Probe am Dateiformat.** Dass die Eingaben in der Datei stehen, prüft sich
leicht. Die eigentliche Festlegung aus 5.1-8 ist die umgekehrte: dass *kein Ergebnis*
darin steht. Eine Assertion sucht deshalb zehn Ergebnisnamen im Dateitext und darf
keinen finden. Ebenso beim Öffnen: dass eine neuere Datei abgelehnt wird, reicht nicht —
geprüft wird, dass sie *kein einziges Feld* herausgibt. Halb zu lesen wäre schlimmer,
als abzulehnen, und eine Prüfung, die nur die Ablehnung sieht, würde ein halbes Lesen
nicht bemerken.

**DIE DRITTE GEGENPROBE HAT ETWAS GEFUNDEN — und der Fehler saß im Test.**
Zur Kontrolle wurden drei Fixe testweise entfernt. Ohne das Gating fielen 12 Assertions
und 5 Smoke-Zeilen; ließ man die neuere Datei doch zu, fielen 3 und 1. Ließ man aber
`leeren()` vor dem Laden weg — die harte Regel aus Plan 3.5 —, blieb **alles grün**.
Die Prüfung sah nur nach, ob die Werte der *Datei* ankommen. Entscheidend ist aber, ob
die Werte des *vorigen Falls* verschwinden. Jetzt wird erst der Kragarm geladen, dann
die Blech-Datei, und Steg- und Flanschdicke müssen weg sein; ohne `leeren()` wird das
rot. Daraus die Regel in 9.2: **Jede neue Prüfung wird einmal gegen den entfernten Fix
gehalten.** Eine Prüfung, die ohne den Fix nicht rot wird, ist wertlos — auch dann,
wenn sie das Richtige zu prüfen scheint.

**Der Namensabgleich — und warum nur fünf Module angefasst wurden.** Die Versionszeile
zeigte `data`, `options`, `kern`, `hilfe`, `kerbfall` — Namen, die es als Datei nie gab.
Solange die Zeile nur im Info-Fenster stand, reichte sie zum Erkennen eines fehlenden
Moduls; seit sie in Druck, Word und `.dts` wandert, nicht mehr. Sieben weitere Module
tragen gar keinen eigenen `NAME` und laufen über dieselbe Rückfallregel wie in `ui.js`
(`DTNSolver` → `solver`) — die trifft dort bereits den Dateinamen. Sie anzufassen hätte
nur ihre Kennungen zerstört, die seit N2 belegen, dass sie unverändert sind. Geprüft
wird deshalb nicht die Liste, sondern das Ergebnis: für jedes in der HTML eingebundene
Modul muss `NAME + '.js'` der Dateiname sein, und der DOM-Smoke prüft dasselbe an der
Zeile, die der Anwender wirklich liest.

**Der Kennungswächter aus S43 hat wieder gearbeitet.** Alle fünf umbenannten Module hat
er sofort rot gemeldet und beide Zeilen eingefordert — Kennung *und* Prüfsumme. Vier von
ihnen (`daten`, `optionen`, `i18n_hilfe`, `i18n_kerbfall`) wurden allein wegen ihres
Anzeigenamens angefasst und tragen deshalb neue Kennungen, obwohl sich an ihren
Rechenwerten nichts geändert hat. Das ist kein Schönheitsfehler, sondern genau der
Zweck: die Kennung sagt „diese Datei ist nicht mehr die von gestern", nicht „hier wurde
gerechnet".

**Und noch ein Fund im Bestand.** In S34 stand `eq(Kerb.VERSION, '0.1.0-N1', …)` — ein
festgeschriebener Handwert, also genau die Sorte Assertion, vor der v2.36 warnt: sie
prüft eine Konstante gegen eine Konstante. Sie prüft jetzt die *Form* der Kennung; den
Stand führt der Wächter in S43.

**Drucken über die lebende Seite.** Ein eigenes `@media print`, kein zweiter
Rendering-Weg — der könnte etwas anderes zeigen als der Bildschirm. Vorher klappt
`ui.js` alles auf; ein Nachweis mit halbem Rechenweg wäre kein Nachweis. Die ehrlichen
Lücken und die Bilanz der Selbstprüfung stehen ausdrücklich mit auf dem Blatt. Und weil
eine CSS-Regel auf einen Tippfehler stumm nichts ausblendet, prüft eine Assertion, dass
jede angesprochene Klasse wirklich existiert — beim ersten Entwurf waren `.acc-kopf`,
`.hilfe-host` und `.info-host` erfunden; die Klassen heißen `.acc-head` und
`.modal-overlay`.

**Zum Verfahren.** Nach Drittel 1 stand ein Haltepunkt mit der ehrlichen Einschätzung,
dass es knapp werden könnte, und dem Vorschlag, sauber in N11a/N11b zu schneiden.
Dieter hat gemeldet, dass sein Kontingent bei 12 % steht — größeres Abo. Daraufhin wurde
einteilig durchgezogen, wie ursprünglich abgestimmt. Der Haltepunkt hat damit genau
getan, wofür er gedacht ist: er hat eine Entscheidung ermöglicht, statt sie zu ersetzen.

**Basislinie 3053 → 3274 Assertions · Smokes 915/916 → 982/982 · i18n-Parität 0.**

---

## Aus der Rückmeldung 2026-08-07 (N11 abgenommen — und die fertige Datei nachgesehen)

**Alle vier Ausgaben liefen am Handy.** Die Versionszeile nannte 19 Module, alle mit
Kennung, und die Namen waren zum ersten Mal Dateinamen: `daten`, `optionen`,
`i18n_kern`, `i18n_hilfe`, `i18n_kerbfall` statt `data`, `options`, `kern`, `hilfe`,
`kerbfall`. Der Merkposten aus 3.6, seit der N5d-Abnahme offen, ist damit am Gerät
belegt.

**Dieters Rückmeldung zum Nahtbild war: „ist nicht drin, nur der Hinweis."** Er hat die
`.rtf` mitgeschickt. In der Datei stand:

```
{\pict\pngblip\picw640\pich480\picwgoal9000\pichgoal6750
89504e470d0a1a0a…
```

**Das Bild war drin.** Die Canvas-Rasterung trägt auf dem Gerät; der Rückfallweg musste
gar nicht greifen. Nur der RTF-Betrachter am Handy zeigt eingebettete PNG nicht an. Das
ist eine Eigenschaft des Betrachters, kein Programmverhalten — und es wäre beinahe als
Programmfehler in den Plan gewandert. **Bevor ein Rückfallweg beschuldigt wird, gehört
in die Datei selbst geschaut.**

**ZWEI ECHTE FEHLER HAT ERST DIE FERTIGE DATEI GEZEIGT — bei drei grünen Testläufen.**

*Erstens:* Die Karten der Wärmeführung und der Kostenrechnung klebten Beschriftung und
Wert zusammen. Im Blatt stand „Mindest-Vorwärmtemperatur120 °C:", und die Wertspalte
blieb leer. Die Ursache ist banal und lehrreich zugleich: Die Ergebniskacheln des
Nachweises tragen `.tile-k` und `.tile-wert`; die Zeilen von Wärmeführung und Kosten
bauen sich aus zwei schlichten `<span>`, von denen nur der zweite eine Klasse hat. Die
Ausgabe suchte nach der Klasse, fand an der zweiten Stelle nichts und fiel auf den
gesamten Textinhalt der Zeile zurück — sie **scheiterte nicht, sie klebte still
zusammen**. Gelesen wird jetzt die Struktur: erste Spalte Beschriftung, letzte Spalte
Wert, und eine Zeile ohne zweite Spalte ist eine Zwischenüberschrift und bekommt keinen
Doppelpunkt angehängt.

*Zweitens:* „Was NICHT geprüft wird" stand zweimal im Blatt, beide Male mit demselben
Inhalt — einmal als Abschnitt des Rechenwegs, einmal als angehängte Liste. Angehängt
wird sie jetzt nur noch, wenn der Rechenweg sie nicht führt. Die Liste 2.4 darf nie
fehlen, aber eine doppelte Liste lässt den Leser suchen, worin sie sich unterscheiden.

**Ein dritter Befund ist KEIN Fehler.** Die Schrittnummern springen im Abschnitt
*Selbstprüfung* — …31, dann 34, dann 32 im nächsten Abschnitt. Das sah nach einem Fehler
der Ausgabe aus und ist Bestandsverhalten von `rechenweg.js`: Die Summenzeile der
Selbstprüfung wird erst **nach** dem Zählen gebildet und trägt deshalb die höchste
Nummer. Genau davor warnt 9.1. Statt es zu „korrigieren", hält S49 jetzt beides fest:
dass die Nummern springen **und** dass kein Schritt fehlt. Wer künftig darüber stolpert,
findet die Prüfung, bevor er die Absicht kaputtmacht.

**Die Lehre, und sie schließt an die dritte Gegenprobe an.** Beide Fehler standen in der
fertigen Datei, während alle drei Testläufe grün meldeten. Geprüft war, dass die Karten
**ankommen** — nicht, **wie** sie ankommen. Dasselbe Muster wie beim vergessenen
`leeren()`: die Prüfung sah die richtige Sache an der falschen Stelle. Daraus die Regel
in 9.2: **Eine Ausgabe ist erst geprüft, wenn jemand das Erzeugnis geöffnet hat.** Der
DOM-Smoke rechnet dafür jetzt ein Beispiel mit **beiden** Zusatzbereichen durch
(`winkel_v`) und prüft, dass keine Beschriftung ihren eigenen Wert enthält.

**Nacharbeit: 5 Dateien** — `ui.js` (0.17.1), `report.js` (0.1.1-N11), `test_naht.js`,
`dom_smoke_voll.js`, dazu Plan und Historie. Kein anderes Modul angefasst.

**Basislinie 3274 → 3283 Assertions · Smokes 982/982 → 988/988 · i18n-Parität 0.**
**Damit sind acht von zehn Bausteinen bis zum Verkaufsstand fertig.**

---

## Aus der zweiten Nacharbeit zu N11 (2026-08-07) — Word öffnete die Datei nicht

**Dieters Meldung:** *„Jetzt öffnet Word das Dokument nicht mehr, es versucht zu laden,
dann steht alles."*

Das „nicht mehr" war irreführend — und zwar nicht durch seine Schuld. Die erste Datei
hatte er am Handy geprüft, wo der RTF-Betrachter das Bild ohnehin überspringt. **Word
hatte sie nie geöffnet.** Der Fehler war also von der ersten Lieferung an da und wurde
erst sichtbar, als überhaupt zum ersten Mal ein richtiger RTF-Leser darauf sah.

**Statt zu raten, wurde die Datei vermessen.** Sie hat 284 Zeilen. 282 davon sind
unauffällig; die längste Textzeile hat 472 Zeichen. Eine Zeile hat **22.611 Zeichen** —
die Hex-Daten des Bildes. Das PNG selbst ist einwandfrei: gültige Signatur, 11.303
Bytes, 640×480 wie im `\pict` angegeben, sauber mit IEND abgeschlossen. Die Klammern
sind ausgeglichen, die Maße stimmen. **Formal war alles richtig.**

**Word schreibt Bilddaten selbst mit 128 Zeichen je Zeile.** Ein Zeilenumbruch zwischen
zwei Hex-Ziffern ist für einen RTF-Leser bedeutungslos — und trotzdem der Unterschied
zwischen „öffnet" und „öffnet nicht". Genau das wird jetzt gemacht, dazu ein weicher
Umbruch langer Textzeilen an Leerzeichen (das Leerzeichen bleibt am Zeilenende stehen,
also klebt nichts zusammen). Keine Zeile im Blatt geht mehr über 255 Zeichen.

**Eine Kleinigkeit kam mit:** Eine ungerade Zahl Hex-Ziffern gibt jetzt gar kein Bild
mehr. Ein halbes Byte wäre ein kaputtes Bild — und zwar ein stilles. Lieber der
sichtbare Rückfallweg als eine Datei, die irgendwo mittendrin abbricht.

**Die Lehre, und sie ist unbequem.** Alle drei Testläufe waren grün, das Erzeugnis war
geöffnet worden, die Klammern waren gezählt, jeder Rechenwegschritt war nachgewiesen —
und die Datei war trotzdem unbrauchbar. Geprüft worden war der **Inhalt**, nicht die
**Form**. Ein Dateiformat hat aber Regeln, die nichts mit dem Inhalt zu tun haben, und
die fallen keinem Auge auf: Zeilenlängen, gerade Byte-Zahlen, Klammerbilanz. Daraus die
Regel in 9.2: **Wo ein Format Regeln hat, wird gegen die Regeln gemessen — nicht gegen
den Eindruck.** Der Harness zählt jetzt Zeilenlängen in allen drei Sprachen, prüft, dass
der Umbruch kein Zeichen verliert, dass keine Zeile mitten in einem Byte bricht, und
dass der Textumbruch keine Wörter zusammenklebt.

**Das ist innerhalb eines Tages das dritte Mal dasselbe Muster:** beim vergessenen
`leeren()`, bei den verklebten Karten und jetzt bei der Zeilenlänge war die Prüfung
jedes Mal *in der Nähe* der Sache, aber nicht *auf* ihr. Sie sah, dass die Datei
entsteht — nicht, ob sie sich öffnen lässt. Sie sah, dass die Karten ankommen — nicht,
wie. Sie sah, dass die Werte der Datei da sind — nicht, ob die alten weg sind.

**Nacharbeit: 3 Dateien** — `report.js` (0.1.2-N11), `ui.js` (nur Kennungen, 0.17.2),
`test_naht.js`. `dom_smoke_voll.js` blieb unverändert; der Befund liegt im Bildpfad, den
der Mini-DOM gar nicht erreicht.

**Gegenprobe bestanden:** Ohne den Umbruch fallen drei Assertions.
**Basislinie 3283 → 3303 Assertions · Smokes unverändert 988/988 · i18n-Parität 0.**

---

## Aus dem Abschluss von N11 (2026-08-07) — das Bild war immer da

Nach dem Zeilenumbruch öffnete Word die Datei. Das Nahtbild blieb für Dieter trotzdem
unsichtbar — am Handy und am Tablet, beide Male in der Word-App unter Android.

**Der nächste Griff wäre der falsche gewesen.** Naheliegend war, den Bildblock umzubauen
oder das Bild ganz wegzulassen; Dieter hatte Letzteres sogar angeboten. Stattdessen
wurde das PNG aus der gelieferten `.rtf` **herausgelöst und angesehen**: 11.303 Bytes,
640×480, gültige Signatur, sauber bis zum IEND — und inhaltlich genau das Nahtbild des
Winkelprofils, dasselbe, das im PDF steht. Die Datei hat 452 Zeilen, die längste hat 201
Zeichen, keine geht über 255. Ein Programmierkollege von Dieter bestätigte, dass das
Bild am PC erscheint.

**Es war also nie ein Programmfehler.** Die Word-App unter Android zeigt in RTF
eingebettete Bilder nicht an. Der Text ist dort vollständig, nur die Darstellung fehlt.
Das ist eine benannte Einschränkung des Betrachters und gehört als solche in den Plan —
nicht als Lücke der Rechnung und schon gar nicht als Anlass, ein funktionierendes
Format zu verbiegen.

**Die praktische Antwort steht daneben:** Wer auf einem mobilen Gerät ein Dokument mit
Bild braucht, nimmt „Drucken / PDF". Dieser Weg druckt die lebende Seite und trägt das
Bild überall — Dieters PDF hat es an diesem Tag zweimal gezeigt.

**Die Regel, die daraus wurde:** *Bevor an einer Ausgabe gebaut wird, wird das Erzeugnis
auseinandergenommen.* Sie schließt die Reihe des Tages ab. Dreimal hatte die Prüfung in
der Nähe der Sache gelegen statt auf ihr — beim vergessenen `leeren()`, bei den
verklebten Karten, bei der Zeilenlänge. Beim vierten Mal lag der Fehler gar nicht im
Programm, und genau da hätte ein Umbau am meisten geschadet: Er hätte kaputtgemacht, was
nachweislich funktioniert.

**Was Dieters PDF nebenbei belegt hat:** Der Ausdruck ist vollständig — alle drei
Ergebniskarten, das Nahtbild, 34 Rechenwegschritte, die Liste 2.4. Und die beiden Fehler
vom Vormittag sind darin nachweislich weg: „Abkühlzeit t8/5 · 13,3 s" steht sauber
getrennt, und „Was NICHT geprüft wird" steht genau einmal.

**Code unverändert, `Codestand` bleibt 2.67. Basislinie unverändert: 3303 · 988 · 988.**
**Baustein N11 ist vollständig abgeschlossen; acht von zehn Bausteinen bis zum
Verkaufsstand sind fertig.**

---

## Aus N12 (2026-08-07) — Druckbild, Registrierung, Lizenzzeile, Lang-Druck

**Der abgestimmte Umfang.** Dieter wollte alles zusammen in N12 statt einer eigenen
Nacharbeit, den Farbverlauf der Marke wie im Schwesterprogramm, das Word-Dokument
unverändert bis auf Nutzernamen und Haftungshinweis — und die Einzeldatei-Fassung
zurückgestellt: *„solange wir bauen, müsste die Einzeldatei nach jeder Änderung neu
erzeugt werden, genau so kann ich zur Not wenn GitHub ausfällt von Hand alles
zusammensetzen."*

**VIER BEFUNDE AUS DEM GEDRUCKTEN PDF — und drei davon waren meine.**

Dieters Meldung war präzise und hätte trotzdem zu einer falschen Reparatur führen können:
leere erste Seite, eine Seite über der nächsten, ein Wort zur Hälfte auf zwei Seiten. Statt
zu raten wurde das PDF vermessen. 25 Seiten, **Seite 1 mit 0 Byte Inhalt**. Seite 23 endete
mit `Summe 200€`, Seite 24 begann mit `Summe 2,00 €` — dieselbe Zeile zweimal, einmal oben
abgeschnitten. Damit war die Ursache eindeutig statt vermutet.

*Erstens:* `.card` und `.acc` tragen seit N5a `overflow:hidden`, damit die runden Ecken
sauber bleiben. Im Druck schneidet das **jede Zeile ab, die über einen Seitenumbruch
läuft** — die obere Hälfte bleibt zerschnitten stehen, die ganze Zeile erscheint noch
einmal auf der Folgeseite. Genau die „Überlappung" und das halbierte Wort.

*Zweitens:* Mein `break-inside:avoid` aus N11 stand auf `.card` und `.acc`. Beide sind
höher als eine Seite; der Browser kann die Regel nicht erfüllen und schiebt die erste Karte
auf Seite 2. Zusammengehalten wird jetzt an den kleinen Einheiten — Kacheln, Feldzeilen,
Rechenwegzeilen.

*Drittens:* Es standen **zwei `@media print`-Blöcke** in `style.css` — einer aus N5a, einer
aus N11 danebengeschrieben, ohne dass ich den ersten bemerkt hatte. Der erste blendete
`.app-header` aus. Genau die Doppelquelle, die 3.4 verbietet, und sie war mir beim Bauen
von N11 selbst untergekommen. Eine Assertion zählt jetzt nach, dass es genau ein Druckbild
gibt.

*Viertens*, und das fiel erst beim Nachmessen auf: Die Wörter **„DT-ProfiSchweissnaht",
„Programmstand" und „ohne Gewähr" kamen im ganzen PDF nicht vor.** Alle drei stehen am
Bildschirm an Stellen, die im Druck ausgeblendet sind — Kopfleiste, Info-Dialog, Fußzeile.
Das Blatt trug also weder Namen noch Stand noch Haftungshinweis, obwohl 3.6 die
Versionszeile in *jeder* Ausgabe verlangt und 2.4 den Hinweis. Neu sind deshalb Druckkopf
und Druckfuß — am Bildschirm unsichtbar, im Druck die einzige Stelle, an der beides
auftaucht.

**DIE REGISTRIERUNG — Hemmschwelle, nicht Schloss.**

Das Verhalten musste nicht erfunden werden: Das Schwesterprogramm hat den Dialog mit
**„Aktivieren" und „Später"**. Damit war die einzige wirklich offene Frage beantwortet —
die Aktivierung blockiert nicht. Ein Dialog, den man nicht schließen kann, sperrt auch den
aus, der gerade seinen Schlüssel sucht.

Geprüft wird **nichts** (Plan 1). Ein einzelnes Zeichen genügt als Schlüssel; verlangt wird
nur, dass Name und Schlüssel dastehen. Wer hier eine Formprüfung einbaut, verspricht eine
Sicherheit, die es nicht gibt. Der Zweck des Namens ist, dass er in allen Ausgaben steht.

Die Lizenzzeile liegt in `report.js` — dort, wo schon das Gating sitzt, also alles
Editionsabhängige. Sie hat **eine Quelle und vier Orte**: Kopfzeile, Druckkopf, Word-Blatt,
`.dts`. In der Datei steht sie ausdrücklich **nicht bei den Eingaben**; sie gehört dem, der
die Datei geschrieben hat. **In der Testversion gibt es sie nie**, auch nicht mit von Hand
in den Speicher geschriebenem Namen — sonst könnte man sich die Vollversion hineinschreiben.
Dieselbe sichere Seite wie beim Gating.

**Der lange Druck setzt nur die Aktivierung zurück.** Nicht die Sprache, nicht das Design,
nicht die Eingaben. Drei Assertions halten das fest, denn ein Reset, der mehr wegnimmt als
angekündigt, ist eine Falle — und beim Bauen war die Versuchung da, gleich `leeren()`
mitzurufen.

**EIN FEHLER IM BESTAND KAM DABEI HERAUS, UND ER IST LEHRREICH.** Die Lizenzzeile
verschwand nach jedem Sprachwechsel. Ursache: `edition()` leerte sie bei jedem Aufruf —
mit dem Kommentar *„Die Lizenzzeile mit dem Namen setzt die Registrierung in N12."* Der
Platzhalter aus N5a hatte brav gewartet; nur hat ihn beim Bauen von N12 niemand abgelöst,
und `uebersetze()` ruft `edition()` mit. **Zwei Besitzer für eine Zeile, und der eine
wusste nichts vom anderen.** Daraus die Regel in 9.2: Wer einen Platzhalter für einen
künftigen Baustein setzt, benennt beim Ablösen auch den alten Besitzer.

**SECHS GEGENPROBEN, alle bestanden.** Überlauf nicht zurückgenommen → 7 rot · große
Behälter dürfen nicht umbrechen → 2 · Druckkopf wandert beim Sprachwechsel nicht mit → 3 ·
Lizenzzeile in der Testversion → 6 · Aktivierung ohne Schlüssel → 5 · Reset leert das
Formular mit → 3.

**Zwei Kleinigkeiten am Rande.** In S49 stand wieder ein festgeschriebener Handwert
(`-N11` in der Kennungsprüfung) — er wäre beim nächsten Baustein rot geworden, ohne dass
etwas kaputt ist; geprüft wird jetzt die Form. Und im Plan widersprachen sich 4.10c und
9.2: die eine Stelle sagte seit N11 „vier Module", die andere noch „drei". Beides beim
Durchlesen vor dem Bauen gefunden.

**Was bewusst nicht gebaut wurde.** Die Eingabewerte im Word-Dokument — angeboten war ein
eigener Abschnitt, Dieter wollte es *„so wie es zuletzt war"*. Benannt sei, was das heißt:
die maßgebenden Zahlen stehen ohnehin im Rechenweg; es fehlen nur die Parameter der
Zusatzrechnungen, deren Ergebnisse im Blatt stehen. Dazu die Einzeldatei-Fassung und die
Ablage von Sprache und Design im lokalen Speicher — beides zurückgestellt, keine Lücken.

**Basislinie 3303 → 3414 Assertions · Smokes 988/988 → 1078/1039 · i18n-Parität 0.**
Die beiden Smokes sind seit N12 **verschieden lang** — den Aktivierungsdialog gibt es nur
in der Vollversion. Beide Zahlen sind Basislinie und dürfen nur wachsen.
**Neun von zehn Bausteinen bis zum Verkaufsstand sind fertig; der Launch-Checkpoint ist
erreicht.**

---

## Aus der Abnahme von N12 (2026-08-07) — „Später" darf sich nicht merken lassen

Alle sechs Prüfpunkte liefen am Handy: Farbverlauf der Marke, Aktivierungsdialog mit der
ehrlichen Meldung bei halber Eingabe, die Lizenzzeile beim Sprachwechsel, Druck und PDF
ohne leere erste Seite und ohne halbierte Zeilen, das Word-Dokument mit Lizenzzeile und
Haftungshinweis, und der Lang-Druck.

**Ein Verhalten war trotzdem falsch, und Dieter hat es gefunden:** *„wenn ich den Button
Später drücke und das Programm beende und wieder starte, muss wieder die Eingabe für
Nutzer und Nummer kommen. Solange bis ein Nutzer und eine Nummer eingegeben wurde und der
Button bestätigt."*

Ich hatte „Später" im lokalen Speicher verwahrt — in der Absicht, niemanden zu belästigen,
der sich einmal entschieden hat. Der Gedanke war falsch, und zwar aus einem bauartbedingten
Grund: **Der Dialog ist die einzige Stelle, an der ein Name überhaupt entstehen kann.**
Wer ihn einmal wegklickt und nie wieder sieht, hat die Aktivierung faktisch verloren. Der
lange Druck auf die Marke wäre der Weg zurück — aber er hilft nur dem, der von ihm weiß,
und das steht nirgends auf dem Bildschirm.

Der Speicherschlüssel `dts_lizenz_spaeter` ist **ersatzlos entfallen**; es sind jetzt zwei
statt drei. Jeder Start beginnt ohne den Merker, also wird gefragt, solange Name und
Schlüssel nicht eingetragen und bestätigt sind. Der Hinweistext nach „Später" sagt das
jetzt auch ausdrücklich, in allen drei Sprachen.

**Die Regel dahinter, jetzt in 9.2:** *Merke dir ein Wegklicken nur dann dauerhaft, wenn es
einen zweiten, auffindbaren Weg zurück gibt.* Ein „nicht mehr fragen" ist nur dann
freundlich, wenn der Anwender die Frage auch wiederfinden kann.

**Gegenprobe bestanden:** verwahrt man „Später" wieder, fallen 6 Assertions und 3
Smoke-Zeilen. Der DOM-Smoke klickt jetzt den ganzen Weg durch — „Später" drücken, neu
laden, Dialog muss wieder da sein.

**Nacharbeit: 5 Dateien** — `report.js` (0.2.1-N12), `ui.js` (0.18.1), `i18n_kern.js`
(0.9.1-N12), `test_naht.js`, `dom_smoke_voll.js`.
**Basislinie 3414 → 3417 Assertions · Smokes 1078/1039 → 1081/1039 · i18n-Parität 0.**
**Baustein N12 ist damit abgenommen; der Launch-Checkpoint ist erreicht.**

---

## Aus dem Verkaufsentschluss (2026-08-07) — veröffentlichen, und was daraus folgt

**Dieters Entscheidung:** Der Verkaufsstand geht so in den Verkauf, alles Weitere kommt als
Update. *„Dann wird auch viel benutzt und Fehler fallen eher auf."*

**Er hat recht, und dieser Tag ist der Beleg.** Drei echte Fehler wurden am 07.08. gefunden
— das kaputte Druckbild, die verklebten Karten, das verwahrte „Später". **Keinen davon
haben 3417 Assertions gefunden.** Alle drei kamen aus echter Benutzung. Ein Programm, das
niemand benutzt, wird nicht besser; es wird nur größer.

**Was beim Nachsehen auffiel.** Schaltet ein Käufer den Bereich *Ermüdung* ein, steht dort
„Zugeschaltet. Der Ermüdungsnachweis wird in **Baustein N13** gerechnet." Für uns präzise,
für einen Käufer bedeutungslos — er liest einen internen Bauplan und weiß nicht, ob das
nächste Woche kommt oder nie. Daraus wurde P1.

**Zum Hinweisfenster waren wir schnell einig, aber die Reihenfolge war die eigentliche
Erkenntnis:** Ein Fenster erklärt eine Enttäuschung; **die Beschriftung verhindert sie.**
Deshalb steht künftig schon am Haken „folgt in einem Update", und das Fenster ist nur die
zweite Stufe — einmal je Bereich und Sitzung, denn was bei jedem Klick kommt, wird nach dem
dritten Mal reflexhaft weggeklickt.

**Zur Verbreitung gingen die Meinungen anfangs auseinander.** Dieters Rechnung: Weitergabe
macht bekannt, und wer ernsthaft arbeitet, kommt später zurück. Das trägt — aber der
Vertriebsweg sollte die **Testversion** sein, nicht die Raubkopie. Der Unterschied ist
entscheidend: Eine weitergereichte Vollversion verbreitet Bekanntheit **und nimmt
gleichzeitig den Kaufgrund weg**; die Testversion verbreitet Bekanntheit **und schafft
ihn** — sie rechnet alles vollständig samt Rechenweg am Bildschirm und gibt nur nichts
heraus. Genau dafür wurde sie gebaut. Damit wird Weitergabe kein Verlust, sondern der
Vertriebsweg.

**Und die Werbung läuft ohnehin mit:** Impressum und Netzadresse stehen im Druckkopf, im
PDF und im Word-Dokument. Ein weitergegebener Nachweis nennt auf fremden Schreibtischen
Dieters Adresse; der Lizenzname hemmt die Weitergabe **und** sagt dem Empfänger, woher es
kommt.

**Zur Reihenfolge „erst verkaufen, dann Server" sind wir einer Meinung**, und der Satz, der
sie begründet, steht jetzt in 1a: **Der Server schützt Umsatz, der existiert; das Update
erzeugt ihn.** Eine kopierte Fassung altert — kein N13, keine korrigierten Preise, keine
Fehlerbehebung. Dazu die Warnung, die nicht untergehen darf: Bei dutzenden Käufern stimmt
die Rechnung, bei hunderten kippt sie, weil Kopien dann Käufer **ersetzen** statt sie zu
gewinnen. Der Umschlagpunkt ist erkennbar — wenn Support-Anfragen von Leuten kommen, die
nicht in der Digistore-Liste stehen.

**Zur Neuordnung von Plandatei und Historie (P2).** Dieters Beobachtung, dass vieles
verstreut ist und überlesen wird, ist an diesem Tag dreimal bestätigt worden — und alle
drei waren **Findefehler, keine Denkfehler**: der Widerspruch zwischen 9.2 und 4.10c, das
zweite `@media print` neben dem aus N5a, und der Platzhalter in `edition()`, den niemand
ablöste. Verbindliche Regeln stehen heute an fünf Orten.

**Die Gegenrede, die dazugehört:** Die Plandatei ist das Sicherheitsnetz. Jede Regel darin
steht dort, weil einmal etwas schiefging. Eine Zeile beim Umräumen zu verlieren heißt, den
Schutz zu verlieren, den sie erkauft hat — und man merkt es erst, wenn derselbe Fehler
wiederkommt. Und was in die Historie wandert, wird beim Sitzungsstart nicht mehr gelesen:
„Wir haben es in die Historie verschoben" darf nicht heimlich zu „niemand liest es mehr"
werden. Deshalb die drei Bedingungen in 5.3: nichts Bindendes wandert · es wird gemessen
statt gehofft · eigene Etappe ohne Code, mit identischen Zahlen vorher und nachher.

**Nur Plandatei, kein Code. Basislinie unverändert: 3417 · 1081 · 1039.**

---

## Aus dem Hotel (2026-08-08) — Rechtstexte, Kontaktangaben und ein Widerspruch

Dieter meldete sich unterwegs mit fünf Beobachtungen. Vier davon wurden übernommen, bei
einer habe ich widersprochen.

**Die Anschrift gehört nicht ins Programm.** Bis N12 stand sie fest verdrahtet in
`i18n_kern.js` — in der Fußzeile, im Info-Fenster, im Druckfuß und im Word-Dokument. Auf
der Landingpage wird das Impressum ohnehin gepflegt und an neue Rechtslage angepasst.
**Das ist dieselbe Doppelquelle, vor der Plan 3.4 warnt, nur mit Rechtstexten statt mit
Code:** zieht die Website nach, ist das Programm veraltet, und niemand merkt es. Ein
Verweis kann nicht veralten. Künftig steht dort nur noch „Vollständiges Impressum und
Datenschutzerklärung online unter: dt-profidreieck.de".

**Die Adressen gehören in den HTML-Kopf.** Dieters Begründung ist praktischer Natur und
überzeugend: Nach dem Zusammenkopieren zur Einzeldatei und der Verschlüsselung läge eine
Adresse mitten im Skript — sie zu ändern wäre eine Arbeit von Minuten statt von Sekunden.
Im Kopf genügt ein Editor, dann neu zippen. Wichtig war dabei ein Detail, das er nicht
wissen konnte: Der Harness prüft, dass es **genau ein** Inline-Skript gibt. Beide Angaben
kommen deshalb in denselben Block wie die Editionsweiche — dann bleibt auch der
Unterschied zwischen Voll- und Testversion genau eine Zeile.

**Anklickbar ja, aber nicht überall.** In der Anwendung werden Adresse und E-Mail echte
Links. Im Word-Dokument bleiben sie Klartext: RTF-Hyperlinks sind zusätzliche Struktur in
einer Datei, die in derselben Woche zweimal an Struktur gescheitert ist — erst am nicht
umbrochenen Bildblock, dann an der doppelten Lückenliste. Der Text ist lesbar; mehr braucht
es nicht.

**WIDERSPROCHEN habe ich beim Haftungsausschluss.** Dieter wollte ihn „verschärfen". Der
Wunsch ist verständlich und der Weg wäre falsch gewesen: Ein pauschaler Ausschluss ist
nach § 309 Nr. 7 BGB **unwirksam** — für Leben, Körper, Gesundheit und für grobe
Fahrlässigkeit — und ein überzogener Text kann selbst angreifbar sein. Er hätte also nichts
gebracht und womöglich geschadet.

Was trägt, ist die **Sachaussage**: keine Zusicherung, dass ein Ergebnis für einen
bestimmten Fall zutrifft · Prüfpflicht gegen die Originalnormen und die eigene Abnahme ·
die fachliche Verantwortung bleibt beim Anwender · und die Liste der dreizehn nicht
geprüften Punkte ist ausdrücklich **Bestandteil des Ergebnisses**. Das ist stark und
wirksam zugleich — und es passt zu einem Programm, das seine Lücken ohnehin beim Namen
nennt. Dazu der Satz, der dazugehört: **ich bin kein Jurist, und das steht auch in der
gelieferten Datei.**

**Für das Landingpage-Projekt entstanden zwei Dateien.** `Werbung.md` beschreibt, was das
Programm kann — mit Fragen und Antworten und, was mir wichtiger war, mit einer Liste von
**Formulierungen, die nicht verwendet werden dürfen**: „normkonform", „geprüft", „sicher",
„ersetzt den Statiker", „kostenloses Update" und jede Andeutung von Ermüdung oder Verzug.
Die Regel aus 1a gilt auch für die Werbung: Die Verkaufsseite darf nur versprechen, was
drin ist. Ein Programm, das an dreizehn Stellen seine Grenzen nennt, darf sie auf der
Seite davor nicht verschweigen.

Für Impressum und Datenschutz entstanden zunächst nur Textblöcke mit genauer
Einbaustelle — die Seiten waren nur gerendert abrufbar, und Markup zu raten wäre
leichtsinnig gewesen, wo Dieter ausdrücklich verlangt hatte, dass alle Links unverändert
bleiben. **Nicht raten, wo man messen kann** hieß hier: nicht liefern, was man nicht
gesehen hat. Dieter reichte daraufhin den Quelltext nach, und beide Seiten wurden als
**fertige HTML-Dateien** geändert; alle Links wurden byteweise gegen die Originale
gehalten, fünf je Seite, keiner verändert.

Ergänzt wurde die Produktliste an drei Stellen, ein Abschnitt „Haftung für die
Berechnungsprogramme" — und ein Absatz, der nicht auf Dieters Zettel stand: **die
Datenschutzerklärung behauptete pauschal, es fielen keine Daten an.** Das stimmte seit N12
nicht mehr, denn DT-ProfiSchweissnaht ist das erste der Programme, das etwas lokal ablegt:
Name und Lizenzschlüssel aus der Aktivierung. Der neue Absatz nennt, was gespeichert wird,
dass es das Gerät nie verlässt, und **wie man es löscht** — die Auskunft, die nach
Art. 15 DSGVO verlangt werden kann.

**Ein Nachklapper mit eigener Lehre.** Nachdem die fertigen Seiten geliefert waren, war
die Zwischendatei mit den Textblöcken überholt — **der Plan verwies aber weiter auf sie.**
Ein Verweis auf eine Datei, deren Inhalt längst erledigt ist, schickt den nächsten Leser
auf die Suche nach Arbeit, die es nicht mehr gibt. Er wurde ersetzt, und zugleich steht
jetzt in 1a, dass die drei Landingpage-Dateien **nicht** in den Projektordner dieses
Programms gehören — sie dort zu kopieren wäre genau die Doppelquelle, die zu vermeiden
der Anlass war.

**Eine Einschränkung, die benannt gehört:** Die beiden Rechtsseiten waren nur *gerendert*
abrufbar, nicht im Quelltext. Vollständige HTML-Dateien hätten bedeutet, das Markup zu
raten — und Dieter hatte ausdrücklich verlangt, dass alle Links unverändert bleiben.
Deshalb wurden Textblöcke mit genauer Einbaustelle geliefert statt ganzer Dateien.
**Nicht raten, wo man messen kann** — hier hieß das: nicht liefern, was man nicht gesehen
hat.

**Nur Plandatei und Landingpage-Dateien, kein Code. Basislinie unverändert: 3417 · 1081 · 1039.**

---

## Aus P0 (2026-08-08) — die Editionsweiche war falsch herum

Dieter meldete aus dem Hotel: *„wenn full oben im HTML-Kopf steht, kommt ja die
Vollversion, aber hier ist es so, dass auch wenn nichts drinsteht oder ungültiges, die
Vollversion da ist."*

Er hatte recht. In `ui.js` stand seit N5a:

```js
edition: (win.DT_EDITION === 'test') ? 'test' : 'full'
```

**Alles, was nicht exakt `'test'` war, wurde zur Vollversion.** Eine leere Zeichenkette,
eine gelöschte Zeile, ein Tippfehler, `'FULL'`, `'voll'`, `'Vollversion'`. Bei einem
Programm, das über Digistore24 verkauft werden soll, ist das kein Schönheitsfehler — es
ist der Unterschied zwischen einem Produkt und einem Geschenk.

**Das Bittere daran ist nicht der Fehler, sondern wo er stand.** Das Gating in `report.js`
war die ganze Zeit richtig herum: `if (edition !== 'full')` sperren. Und S49 prüft seit
N11 ausdrücklich, dass eine **leere** und eine **unbekannte** Edition nichts freigeben.
Ich hatte also genau die richtige Frage gestellt — nur an der falschen Stelle. **Geprüft
war das Tor; nie die Hand, die den Schlüssel hineinlegt.**

Das ist innerhalb einer Woche das vierte Mal dasselbe Muster. Beim vergessenen `leeren()`
prüfte der Test, ob die Werte der Datei ankommen, nicht ob die alten verschwinden. Bei den
verklebten Karten prüfte er, ob sie ankommen, nicht wie. Bei der Zeilenlänge prüfte er,
ob die Datei entsteht, nicht ob sie sich öffnen lässt. Und jetzt prüfte er das Tor statt
den Schlüssel. **Die Prüfung lag jedes Mal in der Nähe der Sache statt auf ihr.**

**Die Entscheidung liegt jetzt in `report.js`**, bei allem anderen Editionsabhängigen —
und damit in Node prüfbar. Sie lautet: **nur exakt `'full'`**. Kein Trimmen, keine Groß-
und Kleinschreibung, keine Freundlichkeit. Wer die Vollversion ausliefert, schreibt sie
richtig. `ui.js` liest `DT_EDITION` an genau einer Stelle; fehlt `report.js`, bleibt es bei
der Testversion.

**Ein Nebenfund aus der Gegenprobe wurde zur wichtigsten Regel des Tages.** Beim ersten
Anlauf holte sich der DOM-Smoke die erwartete Edition aus `Report.editionAus()` — also
aus dem, was er prüfen sollte. Als ich zur Kontrolle die Weiche wieder falsch herum
stellte, blieb er **grün**: Die Erwartung drehte sich mit dem Fehler mit. Erst als die
Regel unabhängig im Smoke steht (`edition === 'full'`), meldet die Gegenprobe 16 rote
Zeilen. **Wer die Erwartung aus dem Prüfling holt, prüft nichts.** Das ist eine Falle, die
sich nur beim Gegenprüfen zeigt — und sie hätte ohne die Gewohnheit, jeden Fix testweise
wieder herauszunehmen, unbemerkt bestanden.

**Der DOM-Smoke der Vollversion läuft seit P0 zweimal.** Der zweite Lauf nimmt dieselbe
Vollversions-HTML, schreibt Unsinn in den Kopf und klickt alles durch: Testbalken muss
erscheinen, alle vier Ausgaben gesperrt, der Info-Dialog nennt die Testversion. Damit ist
der gefährliche Fall nicht nur an der Funktion belegt, sondern an der echten Oberfläche.

**Und eine Kleinigkeit, die zum dritten Mal auffiel:** Zehn Assertions prüften
Modulkennungen gegen das Muster `-N\w+`. Sie wurden rot, als die erste Etappe „P0" hieß —
obwohl nichts kaputt war. Ein Handwert im Muster ist derselbe Fehler wie ein Handwert im
Wert. Alle zehn prüfen jetzt allgemein.

**Zu Dieters Auslieferungsplan.** Beim Bau der Einzeldatei entfernt er den erklärenden
Kommentar über der Editionszeile, damit niemand Fremdes Bescheid weiß. Das ist geprüft und
unschädlich — es hilft aber nur wenig, denn `window.DT_EDITION = 'full'` steht ohnehin
lesbar da. **Was wirklich schützt, ist die richtige Vorgabe:** wer die Zeile verändert,
landet in der Testversion.

**Basislinie 3417 → 3432 Assertions · Smokes 1081 / 1039 / 1039 (dritter Lauf neu).**

---

## Aus P1 (2026-08-08) — „folgt in einem Update" und die Kontaktangaben

**Drei Stufen, und die Reihenfolge war die eigentliche Erkenntnis.** Dieter hatte ein
Hinweisfenster vorgeschlagen; richtig ist es, aber es ist die *zweite* Stufe. Ein Fenster
erklärt eine Enttäuschung — die **Beschriftung verhindert sie**. Deshalb steht jetzt schon
am Haken „Ermüdung / Betriebsfestigkeit — **folgt in einem Update**", und der Anwender
erfährt es, *bevor* er klickt. Das Fenster kommt danach, einmal je Bereich und Sitzung.

**Der Merker wird nicht verwahrt.** Dieselbe Überlegung wie beim „Später" der Aktivierung,
nur umgekehrt begründet: Dort musste der Merker weg, weil der Dialog der einzige Weg zur
Aktivierung war. Hier darf er weg, weil die Beschriftung die Auskunft ohnehin dauerhaft
trägt — beim nächsten Start erscheint der Hinweis wieder, und das schadet nicht.

**Interne Bausteinnamen sind aus dem Programmtext verschwunden.** „Der Ermüdungsnachweis
wird in Baustein N13 gerechnet" war für uns präzise und für einen Käufer bedeutungslos —
er las einen internen Bauplan und wusste nicht, ob das nächste Woche kommt oder nie. Eine
Assertion durchsucht jetzt alle nach außen sichtbaren Texte nach `N13`, `P1`, „Baustein"
und Verwandten.

**Und eine, die weiter reicht:** Eine zweite Assertion durchsucht das **ganze Wörterbuch**
in allen drei Sprachen nach „kostenlos", „gratis", „free of charge". Das Update wird
kostenpflichtig (1a); ein „gratis" im Programmtext wäre ein Versprechen, das später
zurückgenommen werden müsste.

**Die volle Anschrift ist aus dem Programm verschwunden.** Sie stand fest verdrahtet im
Wörterbuch — in der Fußzeile, im Info-Fenster, im Druckfuß und im Word-Dokument. An ihre
Stelle tritt der Verweis auf `dt-profidreieck.de`, gebaut in `report.js` aus **einer**
Quelle für alle vier Orte. Die Adresse ist ein echter Link, im Info-Fenster steht
zusätzlich die E-Mail als `mailto` — dort sucht jemand Kontakt, in der Fußzeile nicht.
Eine Assertion sucht die Anschrift in allen fünf Programmdateien und darf sie nirgends
finden.

**Adresse und E-Mail stehen im HTML-Kopf**, im selben Inline-Block wie die Editionsweiche —
damit der Unterschied der beiden Editionen weiterhin genau eine Zeile ist und der Harness
weiterhin genau ein Inline-Skript findet. **Mit Rückfall auf den eingebauten Wert**: Fehlt
oder verrutscht eine Angabe, steht der alte Wert da statt einer leeren Zeile. Geprüft wird
nichts — wie beim Lizenzschlüssel —, aber es entsteht nie eine Lücke.

**ZWEI NEBENFUNDE, und beide betreffen die Prüfungen selbst.**

*Erstens:* Der Wortfilter auf „kostenlos" fing auch das englische **„free"** — in
*„there is no free weld end"*. Vier Fehlalarme. Gemeint ist nur der **Preis**; das Muster
nennt jetzt ausdrücklich `free of charge`, `for free`, `gratis` und Verwandte. **Ein
Filter, der zu viel fängt, wird abgeschaltet und fängt dann gar nichts.**

*Zweitens, und das ist die feinere Falle:* Der Merker des Hinweisfensters ließ sich nicht
gegenprüfen. Nahm ich ihn heraus, blieb alles grün. Der Grund: Meine Prüfung stand an
einer Stelle, an der der Ermüdungshaken im Ablauf längst berührt worden war — sie sah nur
noch den Wiederholungsfall, nie das erste Mal. Die Erstanzeige wird jetzt dort geprüft, wo
der Haken zum **ersten Mal im ganzen Lauf** angefasst wird. **Wo im Ablauf eine Prüfung
steht, ist Teil der Prüfung.**

**Fünf Gegenproben bestanden:** Bausteinname im Text → 2 rot · kein Rückfall auf den
eingebauten Wert → 5 · Hinweisfenster ohne Merker → 2 · Beschriftungszusatz entfernt → 2 ·
Anschrift wieder fest verdrahtet → 5.

**Basislinie 3432 → 3469 Assertions · Smokes 1081/1039/1039 → 1119/1077/1077.**

---

## P1b (2026-08-08) — das Programm versprach, was es nicht kann

Direkt nach der Lieferung von P1 schickte Dieter, was das Info-Fenster anzeigt. Die erste
Zeile lautete:

> „Schweißnahtberechnung für Stahlbau und Maschinenbau: statischer Nachweis, **Ermüdung**,
> Wärmeführung, Kosten und **Verzug**. Läuft vollständig offline."

Und darunter unter *Regelwerke* **EN 1993-1-9** und **EN 1999-1-3** — die beiden
Ermüdungsnormen. Zwei Zeilen weiter unten stand „folgt in einem Update".

**Der Text stammte aus der Zeit, als der Plan beschrieben wurde, nicht der Stand.** Er war
nie falsch gemeint; er war einfach nie nachgezogen worden. Aber er widersprach direkt der
Regel, die wir am Tag zuvor in 1a geschrieben hatten: *Die Verkaufsseite darf nur
versprechen, was drin ist.* Dass dieselbe Regel für das Programm selbst gilt, stand
nirgends — jetzt schon.

**Und wieder lag meine Prüfung neben der Sache.** S53 durchsuchte die **Hinweistexte** auf
interne Bausteinnamen und das ganze Wörterbuch auf „kostenlos" — aber nie die
**Selbstbeschreibung** auf Versprechen. Ich hatte geprüft, dass wir nichts Falsches über
das *Fehlen* sagen, nicht dass wir nichts Falsches über das *Können* sagen. Das ist
innerhalb von zwei Tagen das sechste Mal dasselbe Muster.

**Die neue Prüfung nimmt ihre Begriffe aus der Quelle.** Für jeden Bereich, der in der
ZUSATZ-Tabelle als `offen` markiert ist, wird die Beschriftung in allen drei Sprachen
zerlegt — aus „Ermüdung / Betriebsfestigkeit" wird „Ermüdung", aus „Verzug & Schrumpfung"
wird „Verzug". Dazu kommen die Normen des Bereichs, die neu in derselben Tabelle stehen:
`normen: ['EN 1993-1-9', 'EN 1999-1-3']`. Keine Handliste, die beim nächsten Baustein
vergessen wird.

**Geprüft wird satzweise**, und das war beim ersten Anlauf falsch: Ich teilte den Text vor
der Ankündigung und prüfte nur, was davor stand. Die Wörter stehen dort aber gerade davor —
„Ermüdung und Verzug folgen in einem späteren Update". Die richtige Regel ist einfacher:
**Ein Satz, der einen ungebauten Bereich nennt, muss auch vom Update sprechen.**

Mitgeprüft wird jetzt auch die **Meta-Beschreibung beider HTML-Dateien**. Sie enthielt
denselben Satz und ist das Erste, was eine Suchmaschine liest — und damit womöglich das
Erste, was ein Käufer sieht.

**Zwei Gegenproben bestanden:** Ermüdung zurück in die Beschreibung → rot; Ermüdungsnorm
zurück in die Liste → rot.

**Basislinie 3469 → 3488 Assertions. Smokes unverändert 1119 / 1077 / 1077.**

---

## P1b und P1c (2026-08-08) — was drei Bildschirmfotos gezeigt haben

Dieter schickte drei Bilder von seinem Tablet: den Zusatzbereich mit dem neuen
Hinweisfenster und zwei Seiten des Word-Dokuments. Alles funktionierte — und trotzdem
kamen zwei Befunde heraus.

**P1b: Das Programm versprach, was es nicht kann.** Das Info-Fenster nannte
„statischer Nachweis, **Ermüdung**, Wärmeführung, Kosten und **Verzug**" und listete unter
Regelwerken EN 1993-1-9 und EN 1999-1-3. Zwei Zeilen weiter unten stand „folgt in einem
Update". Der Text beschrieb den **Plan**, nicht den **Stand**, und war nie nachgezogen
worden. Auch die Meta-Beschreibung beider HTML-Dateien war betroffen — und die ist das
Erste, was eine Suchmaschine liest. Ausführlich im eigenen Abschnitt oben.

**P1c: Eine Wortdopplung, die nur im Ausdruck auffällt.** Im Word-Blatt stand
„Zielfenster für t8/5:  **Zielfenster** 10 bis 20 s". Die Beschriftung trug das Wort, und
der Wert wiederholte es. Kein Rechenfehler — aber die Ursache ist lehrreich: **Am
Bildschirm stehen Beschriftung und Wert in zwei Spalten, und die Dopplung fällt kaum auf.
Erst im Ausdruck rücken sie zusammen.** Der Wert lautet jetzt schlicht „10 bis 20 s".

Daraus wurde eine **allgemeine** Prüfung im DOM-Smoke: In keiner Kartenzeile darf das
erste Wort des Wertes das erste Wort der Beschriftung wiederholen — geprüft an einem
Beispiel mit allen drei Karten. So etwas kann jetzt nirgends mehr entstehen, nicht nur an
dieser einen Stelle.

**Die Regel dahinter, jetzt in 9.2:** *Was zweispaltig gebaut wird, muss auch einspaltig
lesbar sein.* Der Bildschirm verzeiht Redundanz, die das Papier bloßstellt.

**Was die Bilder außerdem belegt haben:** Die Lizenzzeile aus N12 steht im Word-Kopf
(„Vollversion · lizenziert für Dieter"). Die Karten der Wärmeführung zeigen saubere
Zeilen statt der verklebten Fassung vom Vortag. „Kohlenstoffäquivalente aus der Analyse"
steht als Zwischenüberschrift ohne angehängten Doppelpunkt. Und am Schluss der
Haftungshinweis mit dem neuen Impressumsverweis statt der Anschrift.

**Basislinie: 3488 Assertions · Smokes 1121 / 1079 / 1079.**


═══════════════════════════════════════════════════════════════════════════
# AUS DER PLANDATEI AUSGELAGERT (P2, 2026-08-08)
═══════════════════════════════════════════════════════════════════════════

> **Was hier steht, stand bis v2.79 in `Schweißnaht-1.md`.** Es ist die **Erzählung
> abgeschlossener Arbeit** — der gelieferte Umfang jedes Bausteins, die Begründung
> dahinter, die abgelösten Dateistände. **Nichts davon steuert künftige Arbeit.**
>
> ⚠️ **Was BINDET, ist in der Plandatei geblieben** — jede Regel, jede Schnittstelle,
> jede offene Entscheidung, die Liste 2.4, das Dateiformat, die Basislinie. Die
> Auslagerung wurde gemessen: Jede regelhafte Zeile der alten Fassung wurde vorher
> erfasst und nachher wiedergefunden, in der Plandatei oder hier.
>
> **Wer eine Entscheidung nachvollziehen will, sucht hier.** Der Wegweiser in
> Abschnitt 9.3 der Plandatei nennt, welche Fragen hier beantwortet sind.

---

## Gelieferter Umfang der Bausteine N5c-3 bis N12 *(ehemals 5.1-0 bis 5.1-10)*

> Jeder Abschnitt beschreibt, was ein Baustein geliefert hat, was dabei gefunden
> wurde und was am Gerät geprüft wurde. **Die Regeln, die daraus entstanden sind,
> stehen in 9.2 der Plandatei** — hier steht, warum es sie gibt.

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

#### 5.1-7 · N10 — Umfang festgelegt · **N10a ABGENOMMEN 2026-08-05**

> ✅ **Von Dieter am Handy geprüft und ABGENOMMEN — ohne Nacharbeit.**
> **Offene Beobachtung für N10b:** Die Felder *Zielfenster von/bis* stehen
> leer, während das Ergebnis „10 bis 20 s" zeigt. Das ist so gewollt — es
> gibt keine allgemeine Vorbelegung, weil für unlegierte Baustähle kein
> Fenster belegt ist. Ob das für einen Laien deutlich genug ist, bleibt zu
> entscheiden.

**Der abgestimmte Umfang** *(Dieter, 2026-08-05)*: **alle zehn
Kostenpositionen** und **Beispielpreise mit Jahresangabe**.

**DIE LEITENDE ENTSCHEIDUNG: MENGEN OHNE PREISE.** Das Programm rechnet
immer aus, wie viel Schweißgut, wie viel Draht, wie viel Gas, wie viele
Minuten und Kilowattstunden — das folgt aus Geometrie und Physik und altert
nie. **Kosten** entstehen erst mit Preisen, und die altern schnell. Die
Recherche R6 verlangt das wörtlich: *Preise als editierbare Eingabefelder mit
Datumsstempel, keine fest verdrahteten Werte.*

**Drei Sorten Wert — die dritte ist neu:**

| | Beispiel | Verhalten |
|---|---|---|
| **Berechnet** | Volumen, Masse, Gasmenge, Zeit | folgt aus Geometrie, altert nie |
| **Anhaltswert** | Ausbringungsgrad, Abschmelzleistung, Brennzeit | Praxisbereiche, überschreibbar |
| **Preisannahme** | €/h, €/kg, €/l, €/kWh | **mit Jahr**, ausdrücklich zu ersetzen |

**ZEHN POSITIONEN, ABER NUR VIER RECHENBAR.** Lohn, Zusatzwerkstoff, Gas und
Energie ergeben sich aus der Rechnung. Maschine, Vorbereitung, Vorwärmen,
Nacharbeit, Prüfung und Gemeinkosten kann dieses Programm **nicht
herleiten** — es gibt keine belastbare Grundlage dafür. Sie werden
entgegengenommen, stehen sonst auf null, **und die Summe benennt sie**. Eine
Gesamtsumme, die stillschweigend die Prüfkosten weglässt, ist zu niedrig, und
niemand sieht es.

**DER ANKER — und er sitzt beim ersten Lauf.** Die Recherche enthält ein
vollständig durchgerechnetes Beispiel: 1 m Doppelkehlnaht a = 5 mm, T-Stoß,
S355, MAG 135.

| | publiziert | unser Wert |
|---|---|---|
| Querschnitt | 25 mm² | **25 mm²** |
| Schweißgut | ~452 g | **451,4 g** |
| Draht | ~476 g | **475,1 g** |
| Lichtbogenzeit | ~9,0 min | **9,03 min** |
| Gesamtzeit | ~22,6 min | **22,6 min** |
| Energie | ~1,15 kWh | **1,151 kWh** |
| Summe | ~15,70 € | **15,62 €** |
| Lohnanteil | ~84 % | **84 %** |

Beim **Gas** weichen wir bewusst ab: Die Quelle nennt ~110 l *mit*
Anfahrzuschlag, wir geben **108,3 l** — den nackten Verbrauch aus
12 l/min × 9,03 min. Einen Zuschlag zu raten, den niemand beziffert, wäre
eine erfundene Zahl.

**Zwei Wege zur Zeit, beide herausgegeben.** Über die Masse
(`m / Abschmelzleistung`) und über die Länge (`l / v`). Maßgebend ist der
Massenweg, weil er die Volumenrechnung fortsetzt — aber beide stehen im
Rechenweg, denn sie gegeneinander zu halten sagt mehr als jeder einzelne.

**Die Stumpfnaht wird geschätzt und sagt es.** Ihr Fugenquerschnitt hängt an
Öffnungswinkel, Spalt und Steghöhe — die stehen nicht im statischen Modell.
Das Programm schätzt aus Anhaltswerten (60°, 2 mm, 2 mm) und benennt das; wer
den Querschnitt aus Zeichnung oder WPS kennt, trägt ihn ein.

**Benannte Lücken aus der Recherche:** Drahtpreise sind **nicht zweifach
belegt** (der vorbelegte Wert ist als reine Annahme gekennzeichnet), für
**Zwangspositionen** gibt es keine belegbaren Faktoren (nur ein Hinweis statt
einer Zahl), und der Volumenvorteil **X gegen V** wird gerechnet statt aus
Literaturprozenten genommen. **Teil B der Recherche** — Verzug und Toleranzen
— gehört zu N15 und bleibt hier draußen.

**Basislinie 2942 → 3015 Assertions · Smokes 801/802 → 802/803.** Neue
Sektion **S48**.

**Erwarteter Beleg am Handy:** „Programmstand **N10a** · Plan **2.57** ·
**18 Module**" mit `kosten 0.1.0-N10a` und `ui 0.14.0`. Sonst ist nichts zu
sehen — Panel und Felder kommen mit N10b.

---

#### 5.1-7b · N10b — **ABGENOMMEN 2026-08-05**

> ✅ **Von Dieter am Handy geprüft und ABGENOMMEN — ohne Nacharbeit.** Alle
> Bereiche liefen, und die Probe auf die Kopplung ging auf: ein größeres
> a-Maß zieht den Drahtbedarf mit. **Damit ist Baustein N10 vollständig.**

**Damit ist Baustein N10 vollständig.** Geliefert wurden vier Dinge:

**1 · Ein geteilter Bereich für die Schweißparameter.** Spannung, Strom und
Geschwindigkeit brauchen **beide** Zusatzbereiche — die Wärmeführung und die
Kostenrechnung. Sie zweimal zu führen wären zwei Gelegenheiten, dieselbe Zahl
verschieden anzugeben. Dafür wurde die Bedingungsauswertung um ein **ODER**
erweitert: Ein Array von Bedingungen gilt, wenn **eine** davon zutrifft. Der
neue Bereich *Schweißparameter* erscheint, sobald einer der beiden
Zusatzbereiche eingeschaltet ist — in `validate.js` und `ui.js` nach derselben
Regel.

**2 · Zwanzig neue Felder** in zwei Bereichen: fünf geteilte Prozessgrößen und
sechzehn für die Kostenrechnung — Fugenquerschnitt, vier Anhaltswerte, vier
Preise und die sechs nicht herleitbaren Positionen.

**3 · Die Preisannahme als sichtbar dritte Sorte.** Jedes Preisfeld trägt
unter sich den Satz *„Preisannahme von 2019 — sie altert. Bitte durch Ihren
eigenen Wert ersetzen."* Ein Preis von 2019, der aussieht wie ein Normwert,
wäre die gefährlichste stille Behauptung im ganzen Programm.

**4 · Die Ergebniskarte:** Mengen oben (Draht, Zeit, Gas), die Summe darunter,
der Rechenweg in fünf Schritten mit allen zehn Positionen einzeln — **und die
Liste dessen, was auf null steht.**

**DIE NAHTLÄNGE KOMMT AUS DEM GERECHNETEN NAHTBILD**, nicht aus einem eigenen
Feld. Deshalb läuft die Kostenrechnung **nach** dem Nachweis, während die
Wärmeführung davor läuft — sie braucht das Nahtbild nicht. Ein größeres a-Maß
erhöht sofort den Drahtbedarf; der DOM-Smoke prüft genau diese Kopplung.

**Der Assistent bringt zwei Schritte mit** (Prozessregel 3.3): *Schweiß-
parameter* und *Kosten und Zeit*, beide nur wenn zugeschaltet. Ein Durchlauf
hat damit 20 Schritte ohne Zusatzbereiche, 22 mit Kosten, 23 mit beidem.

**Die zwei Feinkorn-Beispiele bringen die Kostenrechnung mit** — `winkel_v`
mit 61 g Draht, 2,9 min und 2,00 €, `kragarm_b` mit 119 g, 5,6 min und 3,92 €.
Bei beiden stehen **sechs Positionen auf null**, und die Anzeige sagt es.

**Auch eine rechenbare Position kann leer bleiben:** Ohne Spannung und Strom
lässt sich die Energie nicht bestimmen. Sie dann still auf null zu setzen wäre
derselbe Fehler wie das Weglassen der Prüfkosten — die Summe sähe vollständig
aus und wäre es nicht.

**Basislinie 3015 → 3053 Assertions · Smokes 802/803 → 905/906.** Der Sprung
bei den Smokes kommt von den zwanzig neuen Feldern, die in beiden Editionen
gebaut und geprüft werden.

**Erwarteter Beleg am Handy:** Unter *Zusatzbereiche* schaltet **Kosten, Zeit,
Drahtbedarf** zwei neue Aufklappbereiche frei. `winkel_v` bringt beide
eingeschaltet mit; nach dem Rechnen steht eine **dritte Ergebniskarte** mit
Drahtbedarf, Zeit und Summe.

---

#### 5.1-7c · N10c — **ABGENOMMEN 2026-08-06**

> ✅ **Von Dieter geprüft und ABGENOMMEN — beide Fehler sind weg.**
> **Bemerkenswert am Vorgehen:** Weil die Bereitstellung auf GitHub Pages
> hing, hat Dieter alle Module in **eine HTML kopiert und offline geprüft**.
> Das prüft denselben Code, nur anders geladen — und die Versionszeile
> meldete korrekt alle 18 Module, was belegt, dass sich jedes registriert
> hat. **Ein brauchbarer Weg, wenn die Bereitstellung hakt** — und ein
> Hinweis darauf, dass eine Einzeldatei-Fassung als Auslieferungsform
> möglich wäre (offen für N12).

**Beide Smokes liefen vorher grün**, ohne einen der beiden zu berühren.

**1 · Nach dem Sprachwechsel stand die Kostenkarte gemischt da.** Die
Überschriften wanderten mit, weil sie über `beschrifte()` laufen und damit ein
`data-i18n` tragen — die programmatisch gesetzten Zeilen blieben in der alten
Sprache. Ein neues Durchrechnen räumte es auf, was den Fehler harmlos
aussehen ließ. **Eine halb übersetzte Anzeige ist schlimmer als eine gar nicht
übersetzte: Sie sieht aus, als wäre sie fertig.** Die Kostenkarte fehlte
schlicht in der Liste der Karten, die beim Umschalten neu gebaut werden.

**2 · Bei der Auslegung meldete die Kostenrechnung „Angaben zur Naht
fehlen".** Das Feld `a` ist dort **leer** — das a wird ja gerade gesucht. Die
Kostenrechnung las es trotzdem aus dem Formular, obwohl das Ergebnis ein
fertiges `a_gewaehlt` enthält.

**Das ist zum vierten Mal dieselbe Ursache:** Nahtbild (N7), Lastprobe (N9c),
Auslegungsgeometrie (N9d), jetzt das a-Maß. Immer las ein Folgeschritt aus dem
**Formular** statt aus dem **Ergebnis**. Die Regel steht jetzt in 9.2, und sie
gilt für jeden künftigen Folgeschritt.

**Gegenprobe bestanden:** Ohne den ersten Fix fallen zwei Prüfzeilen, ohne den
zweiten genau eine. Eine Prüfung, die ohne den Fix nicht rot wird, wäre
wertlos.

**Basislinie 3053 Assertions unverändert · Smokes 905/906 → 915/916.**

---

#### 5.1-8 · N11 — **Dateiformat entschieden 2026-08-06**

Die Entscheidung stand seit v2.46 aus und drängte, weil sie **vor** der
Ermüdung fallen musste: Eine gespeicherte Rechnung mit Kerbfallcode muss sich
später noch öffnen lassen, wenn der Katalog von dreizehn auf achtzig Details
gewachsen ist.

**DER VERSIONSSTEMPEL.** Jede gespeicherte Datei trägt einen Kopf:

```
programm        DT-ProfiSchweissnaht
format          1
geschrieben_mit N11 · Plan 2.62
datum           2026-08-06
```

**Nur `format` steuert das Lesen.** Es steigt ausschließlich, wenn sich der
Aufbau so ändert, dass eine alte Datei nicht mehr unmittelbar passt — ein Feld
wird umbenannt, eine Auswahl bekommt neue Bedeutung. Das ist selten, vielleicht
zwei- oder dreimal in der Lebenszeit des Programms. `geschrieben_mit` und
`datum` sind für den Menschen: Wenn in zwei Jahren jemand fragt, warum sein
Ergebnis anders aussieht, steht dort die Antwort.

**Drei Fälle beim Öffnen:**

| Format | Verhalten |
|---|---|
| gleich | öffnen |
| **älter** | öffnen, **aber sagen**, aus welcher Fassung die Datei stammt — nie stillschweigend umrechnen |
| **neuer** | **NICHT öffnen** — sie enthält womöglich Angaben, die dieses Programm nicht kennt; sie halb zu lesen wäre schlimmer als sie abzulehnen |

**GESPEICHERT WERDEN NUR DIE EINGABEN** *(Dieter, 2026-08-06)*. Die Datei
beschreibt den **Fall**, nicht das **Ergebnis**. Eine gespeicherte Zahl wäre
ohnehin nur so lange richtig, wie das Programm sich nicht ändert.

**Die Folge muss benannt sein:** Öffnet jemand in einem Jahr eine alte Datei
und das Programm wurde inzwischen korrigiert, bekommt er ein anderes Ergebnis.
Genau das ist in diesem Projekt schon geschehen — die `konsole` liefert seit
N9d 760 mm statt 764. Dagegen hilft der Stempel: Beim Öffnen zeigt das
Programm **sichtbar**, mit welchem Stand die Datei geschrieben wurde. Das
ersetzt keinen Vergleich, aber es lässt den Unterschied nicht stumm.

**Die Liste der nicht geprüften Punkte kommt mit in die Datei** — aber
ausdrücklich **nur als Dokumentation, nie zum Zurücklesen**. Sie hält fest, was
damals galt; ausgewertet wird beim Öffnen immer der aktuelle Stand. Ohne sie
sähe eine zwei Jahre alte Datei vollständiger aus, als sie war.

**IM LOKALEN SPEICHER NUR PROGRAMMBEDINGUNGEN** *(Dieter, 2026-08-06)*:
**Sprache** und später die **Edition** (Voll oder Test). **Nicht** der letzte
Stand der Eingaben.

Die Begründung geht über Bequemlichkeit hinaus: **Ein halb ausgefülltes
Formular vom Vortag sieht aus wie ein frischer Fall.** Der Anwender öffnet das
Programm, sieht Zahlen stehen, ändert zwei davon und rechnet — mit drei
Werten, die er längst vergessen hat. **Ein leeres Formular ist ehrlicher als
ein altes.**

---

#### 5.1-9 · N11 — **GEBAUT, GELIEFERT UND ABGENOMMEN 2026-08-07**

> ✅ **Von Dieter am Handy geprüft und ABGENOMMEN.** Alle vier Ausgaben liefen;
> die Versionszeile nannte 19 Module mit den neuen **Dateinamen**.
> **Die Canvas-Rasterung trägt:** die gelieferte `.rtf` enthielt das Nahtbild als
> `\pict\pngblip` mit 640×480 px — der Rückfallweg musste gar nicht greifen.
> Am Handy war es nur nicht **sichtbar**, weil der dortige RTF-Betrachter
> eingebettete Bilder nicht anzeigt; in Word oder LibreOffice steht es da.
> **Das ist eine Eigenschaft des Betrachters, kein Programmverhalten** — und
> genau deshalb war es wichtig, die gelieferte Datei anzusehen statt dem
> Bildschirm zu glauben.
>
> **ZWEI ECHTE FEHLER HAT ERST DIE FERTIGE DATEI GEZEIGT** (nachgearbeitet in
> derselben Sitzung, `ui 0.17.1`, `report 0.1.1-N11`):
> 1. **Die Karten der Wärmeführung und der Kostenrechnung klebten
>    Beschriftung und Wert zusammen** — „Mindest-Vorwärmtemperatur120 °C",
>    und die Wertspalte blieb leer. Ursache: sie bauen ihre Zeilen aus zwei
>    schlichten `<span>`, während die Ergebniskacheln `.tile-k` und
>    `.tile-wert` tragen. Die Ausgabe suchte nur nach der Klasse. **Jetzt
>    wird die STRUKTUR gelesen** — erste Spalte Beschriftung, letzte Spalte
>    Wert; eine Zeile ohne zweite Spalte ist eine Zwischenüberschrift und
>    bekommt keinen Doppelpunkt angehängt.
> 2. **„Was NICHT geprüft wird" stand zweimal im Blatt** — einmal als
>    Abschnitt des Rechenwegs, einmal als angehängte Liste, beide Male
>    derselbe Inhalt. Angehängt wird sie jetzt nur noch, wenn der Rechenweg
>    sie **nicht** führt: die Liste 2.4 darf nie fehlen, aber auch nicht
>    doppelt dastehen.
>
> **Ein dritter Befund ist KEIN Fehler und steht jetzt als Assertion fest:**
> die Schrittnummern springen im Abschnitt *Selbstprüfung* (…31, 34, dann 32).
> Das ist Bestandsverhalten von `rechenweg.js` und auf dem Bildschirm
> genauso — die Summenzeile wird erst **nach** dem Zählen gebildet und trägt
> deshalb die höchste Nummer (Plan 9.1). Wer das „korrigiert", macht eine
> Absicht kaputt. S49 hält beides fest: dass die Nummern springen **und**
> dass kein Schritt fehlt.
>
> **DRITTER BEFUND, ZWEI TAGE ZU SPÄT ENTDECKT: Word öffnete die Datei gar
> nicht.** Sie ließ sich am Handy lesen, aber Word blieb beim Laden hängen.
> Die Datei war formal einwandfrei — gültiges PNG (11.303 Bytes, 640×480,
> sauber mit IEND), ausgeglichene Klammern, richtige Maße. Der Fehler war die
> **Zeilenlänge**: die 22.606 Hex-Ziffern des Bildes standen auf **einer
> einzigen Zeile**. 282 der 284 Zeilen waren unauffällig, eine war 22.611
> Zeichen lang. **Word schreibt Bilddaten selbst mit 128 Zeichen je Zeile** —
> genau das wird jetzt gemacht, und lange Textzeilen werden an Leerzeichen
> weich umbrochen. Keine Zeile im Blatt ist mehr länger als 255 Zeichen.
> **Der Fehler war von der ERSTEN Lieferung an da** und wäre am Handy nie
> aufgefallen, weil der dortige Betrachter das Bild ohnehin überspringt.
> Gefunden wurde er erst, als die gelieferte Datei selbst **vermessen** wurde.
> Gegenprobe bestanden: ohne den Umbruch fallen drei Assertions.
>
> **ABSCHLUSS: DAS BILD IST DRIN — DIE ANDROID-APP ZEIGT ES NUR NICHT.**
> Nach dem Umbruch öffnet Word die Datei. Dieter sah das Nahtbild trotzdem
> nicht. Statt zu raten wurde das PNG **aus der gelieferten `.rtf`
> herausgelöst und angesehen**: es ist genau das Nahtbild des Winkelprofils,
> 640×480, gültig bis zum IEND. Die Datei hat 452 Zeilen, die längste hat
> 201 Zeichen, keine geht über 255. **Ein Programmierkollege hat bestätigt,
> dass das Bild am PC erscheint.**
>
> **BENANNTE EINSCHRÄNKUNG (keine Lücke der Rechnung):** Die **Word-App unter
> Android** zeigt in RTF eingebettete Bilder nicht an — am Handy und am
> Tablet gleichermaßen. Der Text ist dort vollständig, nur das Bild fehlt in
> der Anzeige. **Wer ein Dokument MIT Bild auf einem mobilen Gerät braucht,
> nimmt „Drucken / PDF"** — dieser Weg trägt das Bild überall, weil er die
> lebende Seite druckt.
> **Am Bildblock wird deshalb nichts geändert.** Er ist normgerecht, das PNG
> ist gültig, Word lädt die Datei — eine Änderung ohne Befund würde nur das
> kaputtmachen, was nachweislich funktioniert.
>
> **Basislinie 3274 → 3303 Assertions · Smokes 982/982 → 988/988.**


**Der abgestimmte Umfang** *(Dieter, 2026-08-07)*: **einteilig komplett, aber mit vielen
Prüfungen** · Word **mit** Bildern, die Ausführung an Claude delegiert („es muss laufen")
· das Freitextfeld für die **WPS-Nummer bleibt weiterhin weg**.

**DER SCHNITT, DER ALLES TRÄGT: `report.js` ist DOM-frei.** Es baut und liest nur
Zeichenketten; Blob, Dateiwahl, Canvas und Drucken bleiben in `ui.js`. Ohne diesen Schnitt
wäre die Hälfte des Bausteins ungetestet — mit ihm sind **196 Assertions** allein auf die
Ausgaben gefallen. Schnittstelle in **4.12**.

**1 · DAS GATING SITZT HINTER GENAU EINER TÜR.** Alle vier Ausgaben fragen
`Report.guard()`, und `ui.js` ruft es an **einer einzigen Stelle**. Eine Assertion zählt
das nach. Zwei Türen wären zwei Gelegenheiten, eine davon zu vergessen — und vergessen
hieße hier: eine Ausgabe läuft in der Testversion doch durch. Gesperrt ist außerdem die
**sichere Seite**: eine leere oder unbekannte Edition gibt nichts frei, statt „alles außer
`test`" zu erlauben.

**2 · DAS DATEIFORMAT wie in 5.1-8 entschieden.** Die scharfe Probe ist die Gegenprobe:
eine Assertion sucht **zehn Ergebnisnamen** (`eta`, `ampel`, `a_gewaehlt`, `erfuellt`,
`sigma_v` …) im Dateitext und darf **keinen** finden. Die Datei beschreibt den Fall, nicht
das Ergebnis. Eine **ältere** Datei wird geöffnet und der Unterschied benannt — die
Meldung nennt den Stand, mit dem sie geschrieben wurde. Eine **neuere** gibt **kein
einziges Feld** heraus. Sieben kaputte Dateien werfen keine Ausnahme, sondern nennen je
einen eigenen Grund.

**3 · DRUCKEN/PDF über die LEBENDE SEITE.** Ein eigenes `@media print` in `style.css`,
kein zweiter Rendering-Weg — der könnte etwas anderes zeigen als der Bildschirm. Vorher
klappt `ui.js` alles auf: **ein Nachweis mit halbem Rechenweg wäre kein Nachweis.** Die
ehrlichen Lücken und die Bilanz der Selbstprüfung stehen ausdrücklich **mit** auf dem
Blatt. Eine Assertion prüft, dass jede vom Druckbild angesprochene Klasse wirklich
existiert — eine Regel auf einen Tippfehler blendet nichts aus.

**4 · WORD (.rtf) MIT BILDERN UND RÜCKFALLWEG.** Begründung in 4.12. Geprüft sind **beide**
Wege: mit PNG steht der `\pngblip`-Block samt der Bytes im Blatt, ohne PNG steht der
**Grund** dort und die Datei entsteht trotzdem. Dazu die Dinge, an denen eine RTF-Datei
sonst stirbt: die geschweiften Klammern werden **gezählt** (eine zu viel, und Word öffnet
nichts mehr), **jeder** Rechenwegschritt muss im Blatt stehen, und kein unübersetzter
Schlüssel darf durch — in allen drei Sprachen. Die eigene Base64-Umrechnung ist gegen Node
**auf das Byte** gegengerechnet, auch bei allen Füllzeichen-Längen.

**DIE AUSGABE GIBT WIEDER, WAS DIE ERGEBNISSEITE ZEIGT.** Die Karten für Nachweis,
Wärmeführung und Kosten werden aus der Anzeige gelesen, nicht ein zweites Mal
zusammengestellt. Zwei Wege zu einer Zahl wären zwei Gelegenheiten, sie verschieden zu
zeigen (3.4). Der DOM-Smoke prüft, dass Blatt und Bildschirm dieselben Karten führen.

**5 · DER NAMENSABGLEICH aus 3.6 ist erledigt** — Begründung und Umfang dort.

**DREI GEGENPROBEN, UND DIE DRITTE HAT ETWAS GEFUNDEN.** Nimmt man das Gating heraus,
fallen 12 Assertions und 5 Smoke-Zeilen; lässt man die neuere Datei doch zu, fallen 3 und
1. **Ließ man aber `leeren()` vor dem Laden weg, blieb alles grün.** Genau das verlangt
Plan 3.5 als harte Regel. Der Fehler lag in der Prüfung, nicht im Code: sie sah nur nach,
ob die Werte der **Datei** ankommen — entscheidend ist aber, ob die Werte des **vorigen
Falls** verschwinden. Jetzt wird der Kragarm geladen, danach die Blech-Datei, und die
Steg- und Flanschdicke müssen **weg** sein. Ohne `leeren()` wird das rot.
**Lehre, und sie ist die alte:** eine Prüfung, die ohne den Fix nicht rot wird, ist
wertlos — auch dann, wenn sie das Richtige zu prüfen scheint.

**Basislinie 3053 → 3283 Assertions · Smokes 915/916 → 988/988 · i18n-Parität 0.**
Neue Sektion **S49**. `report.js` hängt in beiden HTMLs — die Versionszeile zeigt
**19 Module**.

**LEHRE AUS DER NACHARBEIT (2026-08-07):** Beide Fehler lagen in der **fertigen
Datei**, nicht im Rechenweg — und beide Testläufe waren grün. Der Grund ist
derselbe wie bei der dritten Gegenprobe: geprüft wurde, dass die Karten
**ankommen**, nicht **wie** sie ankommen. Eine Ausgabe ist erst geprüft, wenn
jemand das Erzeugnis geöffnet und angesehen hat. **Der DOM-Smoke rechnet dafür
jetzt ein Beispiel mit BEIDEN Zusatzbereichen durch** (`winkel_v`) und prüft,
dass keine Beschriftung ihren eigenen Wert enthält.

**Erwarteter Beleg am Handy:**
- Die Versionszeile nennt „Programmstand **N11** · Plan **2.65** · **19 Module**" mit
  `ui 0.17.0` und `report 0.1.0-N11` — und die Namen sind jetzt **Dateinamen**
  (`daten`, `optionen`, `i18n_kern` statt `data`, `options`, `kern`).
- In der **Vollversion**: einen Fall rechnen, eine Bezeichnung eintragen, **Speichern** →
  eine `.dts` mit Bezeichnung und Datum im Namen. **Öffnen** → das Formular ist erst leer
  und dann gefüllt, „Berechnen" liefert dasselbe Ergebnis. **Drucken** → ein Blatt ohne
  Knöpfe, mit vollem Rechenweg und den ehrlichen Lücken. **Word** → eine `.rtf`, die sich
  öffnen lässt; das Nahtbild sollte darin stehen, und wenn nicht, sagt eine Zeile warum.
- In der **Testversion**: alle vier Knöpfe melden, dass die Ausgaben gesperrt sind.

**Offen für N12:** die **Einzeldatei-Fassung** als Auslieferungsform (aus der
N10c-Abnahme), Registrierung und Lizenzzeile.

---

#### 5.1-10 · N12 — **GEBAUT UND GELIEFERT 2026-08-07, Abnahme offen**

**Der abgestimmte Umfang** *(Dieter, 2026-08-07)*: **alles zusammen in N12** statt einer
eigenen Nacharbeit · Farbverlauf der Marke **wie im Schwesterprogramm** (Türkis → Messing)
· Word-Dokument **wie zuletzt, nur ergänzt um Nutzernamen und Haftungshinweis** ·
**Einzeldatei-Fassung zurückgestellt** bis nach dem Launch-Checkpoint.

**VIER BEFUNDE AUS DEM GEDRUCKTEN PDF — und drei davon waren meine.**
Dieter meldete: leere erste Seite, eine Seite schiebt sich über die nächste, ein Wort steht
zur Hälfte auf zwei Seiten. Statt zu raten wurde das PDF **vermessen**: 25 Seiten, Seite 1
mit **0 Byte** Inhalt, Seite 23 endete mit `Summe 200€` und Seite 24 begann mit
`Summe 2,00 €` — dieselbe Zeile zweimal, einmal oben abgeschnitten.

1. **`overflow:hidden` auf `.card` und `.acc`.** Am Bildschirm hält es die runden Ecken
   sauber; im Druck **schneidet es jede Zeile ab, die über einen Seitenumbruch läuft**.
   Das war die halbierte Zeile und die scheinbare Überlappung.
2. **`break-inside:avoid` auf `.card` und `.acc`** — beide sind viel höher als eine Seite.
   Der Browser kann die Regel nicht erfüllen und schiebt die erste Karte auf Seite 2.
   Das war die leere Seite 1. Zusammengehalten wird jetzt an den **kleinen** Einheiten.
3. **ES GAB ZWEI `@media print`-BLÖCKE** — einer aus N5a, einer aus N11 danebengeschrieben,
   ohne den ersten zu bemerken. Der erste blendete `.app-header` aus. Genau die Doppelquelle,
   die 3.4 verbietet. **Jetzt gibt es einen, und eine Assertion zählt das nach.**
4. **Marke, Programmstand und Haftungshinweis fehlten im PDF vollständig.** Alle drei stehen
   am Bildschirm an Stellen, die im Druck ausgeblendet sind. Neu sind deshalb **Druckkopf und
   Druckfuß** (4.10f) — die einzige Stelle, an der sie aufs Blatt kommen.

**DIE REGISTRIERUNG — Hemmschwelle, nicht Schloss.** Name + Digistore-Schlüssel,
**nichts wird geprüft** (Plan 1). Ein einzelnes Zeichen genügt als Schlüssel; verlangt wird
nur, dass beides dasteht. **„Später" ist erlaubt** — ein Dialog, den man nicht schließen
kann, sperrt auch den aus, der gerade seinen Schlüssel sucht. Das Programm läuft
vollständig weiter, die Ausgaben tragen dann nur keinen Namen.

> ⚠️ **NACHGEARBEITET NACH DER ABNAHME (Dieter, 2026-08-07): „Später" gilt NUR für die
> laufende Sitzung.** Zuerst war es verwahrt worden — wer einmal „Später" drückte, wurde
> **nie wieder** gefragt. Dieters Einwand: *„wenn ich den Button Später drücke und das
> Programm beende und wieder starte, muss wieder die Eingabe kommen — solange bis ein
> Nutzer und eine Nummer eingegeben wurde und der Button bestätigt."*
> **Er hat recht, und der Grund ist bauartbedingt:** der Dialog ist die **einzige** Stelle,
> an der ein Name überhaupt entstehen kann. Wer ihn einmal wegklickt und nie wieder sieht,
> hat die Aktivierung faktisch verloren — der lange Druck hilft nur dem, der von ihm weiß.
> Der Speicherschlüssel `dts_lizenz_spaeter` ist **ersatzlos entfallen**; es sind jetzt
> **zwei** statt drei. Jeder Start beginnt ohne den Merker. Gegenprobe: verwahrt man
> „Später" wieder, fallen 6 Assertions und 3 Smoke-Zeilen.

**Die Lizenzzeile hat eine Quelle und vier Orte:** Kopfzeile, Druckkopf, Word-Blatt und
`.dts`. In der Datei steht sie **nicht bei den Eingaben** — sie gehört dem, der die Datei
geschrieben hat, nicht dem, der sie öffnet. **In der Testversion gibt es sie nie**, auch
nicht mit von Hand eingetragenem Namen: sonst könnte man sich die Vollversion
hineinschreiben. Dieselbe sichere Seite wie beim Gating.

**Der lange Druck setzt NUR die Aktivierung zurück** — nicht Sprache, nicht Design, nicht
Eingaben. Ein Reset, der mehr wegnimmt als angekündigt, ist eine Falle.

**EIN FEHLER IM BESTAND KAM DABEI HERAUS:** `edition()` leerte die Lizenzzeile bei jedem
Aufruf — der Platzhalter aus N5a. Da `uebersetze()` sie mitruft, war die Zeile nach jedem
Sprachwechsel weg. **Zwei Besitzer für eine Zeile.** Begründung in 4.10f.

**SECHS GEGENPROBEN, alle bestanden:** Überlauf nicht zurückgenommen → 7 rot · große
Behälter dürfen nicht umbrechen → 2 · Druckkopf wandert beim Sprachwechsel nicht mit → 3 ·
Lizenzzeile in der Testversion → 6 · Aktivierung ohne Schlüssel → 5 · Reset leert das
Formular mit → 3.

**Basislinie 3303 → 3417 Assertions · Smokes 988/988 → 1081/1039 · i18n-Parität 0.**
Neue Sektionen **S50** (Druckbild) und **S51** (Registrierung).
⚠️ **Die beiden Smokes sind seit N12 verschieden lang** — den Aktivierungsdialog gibt es
nur in der Vollversion. Beide Zahlen sind Basislinie und dürfen nur wachsen.

**WAS BEWUSST NICHT GEBAUT WURDE:**
- **Die Eingabewerte im Word-Dokument** *(Dieter, 2026-08-07: „so wie es zuletzt war")*.
  Angeboten war ein eigener Abschnitt mit allen Formularwerten. Benannt sei, was das heißt:
  die **maßgebenden** Zahlen stehen ohnehin im Rechenweg (f_u, f_y, Schnittgrößen, a-Maß,
  Nahtlänge); es fehlen nur die Parameter der Zusatzrechnungen (U, I, v, Preise), deren
  **Ergebnisse** im Blatt stehen.
- **Die Einzeldatei-Fassung** — zurückgestellt bis nach dem Launch-Checkpoint.
- **Sprache und Design im lokalen Speicher.** 5.1-8 erlaubt beides; N12 legt dort nur die
  drei Lizenzschlüssel ab. Bleibt offen, ist keine Lücke.

**Erwarteter Beleg am Handy:**
- Die Marke oben links trägt einen **Farbverlauf von Türkis nach Messing**.
- **Vollversion, Erststart:** der Aktivierungsdialog erscheint. Nur den Namen eintragen →
  ehrliche Meldung, Dialog bleibt offen. Beides eintragen → Dialog schließt, im Kopf steht
  **„Vollversion · lizenziert für …"**. Sprache umschalten → die Zeile wandert mit.
- **Drucken/PDF:** keine leere erste Seite mehr, keine halbierten Zeilen, oben Marke und
  Programmstand, unten Haftungshinweis und Impressum.
- **Word:** derselbe Kopf mit Lizenzzeile, am Schluss der Haftungshinweis.
- **Zehn Sekunden auf die Marke:** die Aktivierung ist weg, der Dialog fragt erneut — und
  Sprache, Design und die eingetragenen Werte stehen unverändert da.
- **Testversion:** kein Aktivierungsdialog, keine Lizenzzeile, Testbalken wie gehabt.

---


---

## Die Aufträge für N5c-1 und N5a/N5b *(ehemals 5.1a und 5.1b)*

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


---

## P1 — gelieferter Umfang und der ursprüngliche Auftrag *(ehemals 5.3)*

#### P1 · Hinweis „folgt in einem Update" + Kontaktangaben — **ABGENOMMEN 2026-08-08**

> ✅ **AM GERÄT GEPRÜFT, alle vier Punkte:** der Zusatz „— folgt in einem Update“ steht
> an Ermüdung und Verzug, nicht an den gebauten Bereichen · das Hinweisfenster kommt beim
> ersten Anhaken und beim zweiten nicht wieder · Adresse und E-Mail im Info-Fenster sind
> anklickbar · und **`DT_WEB` im HTML-Kopf schlägt an allen vier Orten durch** —
> Fußzeile, Info-Fenster, Ausdruck, Word — **während ein leerer Wert auf den eingebauten
> zurückfällt.** Damit ist die Auslieferungsform gesichert.
>
> Dieters Word-Blatt belegte nebenbei drei ältere Punkte: die Lizenzzeile aus N12, die
> sauberen Kartenzeilen nach dem Verklebungsbefund vom Vortag, und
> „Kohlenstoffäquivalente aus der Analyse“ als Zwischenüberschrift ohne angehängten
> Doppelpunkt.

> ✅ **GEBAUT UND GELIEFERT.** Alle drei Stufen umgesetzt, dazu die Kontaktangaben.
> **Die volle Anschrift steht in KEINER Programmdatei mehr** — eine Assertion sucht sie
> in `i18n_kern.js`, `ui.js`, `report.js` und beiden HTMLs und darf sie nirgends finden.
>
> **Fünf Gegenproben bestanden:** Bausteinname im Text → 2 rot · kein Rückfall auf den
> eingebauten Wert → 5 · Hinweisfenster ohne Merker → 2 · Beschriftungszusatz entfernt
> → 2 · Anschrift wieder fest verdrahtet → 5.
>
> **Zwei Dinge fielen beim Bauen auf und wurden mitgenommen:**
> Die Prüfung auf „kostenlos“ fing zunächst auch das englische **„free“** in
> *„no free weld end“* — vier Fehlalarme. Gemeint ist nur der **Preis**; das Muster nennt
> jetzt ausdrücklich `free of charge`, `for free`, `gratis` und Verwandte.
> Und der **Merker des Hinweisfensters ließ sich zunächst nicht gegenprüfen**, weil die
> Prüfung an einer Stelle stand, an der der Haken längst berührt war. Die **Erstanzeige**
> wird jetzt dort geprüft, wo der Haken zum ersten Mal im ganzen Lauf angefasst wird.
> *Eine Prüfung auf „das erste Mal“ gehört an die Stelle, an der es wirklich das erste
> Mal ist.*
>
> ---
>
> **P1b · NACHTRAG (Dieters Fund direkt nach der Lieferung, 2026-08-08):**
> **Das Info-Fenster versprach Ermüdung und Verzug.** Wörtlich stand dort
> „statischer Nachweis, **Ermüdung**, Wärmeführung, Kosten und **Verzug**“, und die
> Normenliste führte **EN 1993-1-9** und **EN 1999-1-3** — die beiden Ermüdungsnormen.
> Zwei Zeilen weiter unten sagte dasselbe Fenster „folgt in einem Update“.
> **Der Text stammte aus der Zeit, als der PLAN beschrieben wurde, nicht der STAND** —
> und er widersprach direkt der Regel aus 1a. Auch die Meta-Beschreibung beider HTMLs war
> betroffen.
>
> ⚠️ **UND WIEDER LAG DIE PRÜFUNG NEBEN DER SACHE.** S53 durchsuchte die **Hinweis**texte
> auf Bausteinnamen — nie die **Selbstbeschreibung** auf Versprechen. Jetzt prüft sie
> beides, und die verbotenen Begriffe kommen **aus der Quelle**: aus den Beschriftungen
> der als `offen` markierten Bereiche und aus deren Normen, die dazu neu in der
> ZUSATZ-Tabelle stehen. Geprüft wird **satzweise** — ein Satz, der einen ungebauten
> Bereich nennt, muss auch vom Update sprechen. *(Der erste Versuch teilte den Text VOR
> der Ankündigung; die Wörter stehen dort aber davor: „Ermüdung und Verzug folgen in
> einem Update“.)*
> Zwei weitere Gegenproben bestanden: Ermüdung zurück in die Beschreibung → rot;
> Ermüdungsnorm zurück in die Liste → rot.
>
> ---
>
> **P1c · EINE WORTDOPPLUNG, an Dieters Word-Blatt gesehen (2026-08-08):**
> Dort stand **„Zielfenster für t8/5:  Zielfenster 10 bis 20 s“** — die Beschriftung
> trug das Wort, und der Wert wiederholte es. Kein Rechenfehler, aber unsauber.
> **Am Bildschirm fällt es kaum auf**, weil Beschriftung und Wert dort in zwei Spalten
> stehen; erst im Ausdruck rücken sie zusammen. Der Wert lautet jetzt „10 bis 20 s“.
> Daraus wurde eine **allgemeine** Prüfung im DOM-Smoke: In keiner Kartenzeile darf das
> erste Wort des Wertes das erste Wort der Beschriftung wiederholen — geprüft an einem
> Beispiel mit allen drei Karten. Gegenprobe bestanden.
>
> **Basislinie 3432 → 3488 Assertions · Smokes 1081/1039/1039 → 1121/1079/1079.**
> Neue Sektion **S53**. Betroffen: `i18n_kern.js` (0.10.0-P1), `report.js` (0.4.0-P1),
> `ui.js` (0.20.0), `style.css`, beide HTMLs, `test_naht.js`, `dom_smoke_voll.js`.
>
> **Am Gerät zu prüfen:** Neben *Ermüdung* und *Verzug* steht **„— folgt in einem
> Update“**; beim ersten Anhaken kommt ein Fenster, beim zweiten nicht mehr.
> *Wärmeführung* und *Kosten* zeigen nichts davon. In Fußzeile, Info-Fenster, Ausdruck und
> Word steht **„Vollständiges Impressum und Datenschutzerklärung online unter:
> dt-profidreieck.de“** — anklickbar, im Info-Fenster zusätzlich die E-Mail als `mailto`.
> Und: `DT_WEB` im HTML-Kopf ändern → die neue Adresse muss überall durchschlagen;
> leeren → der eingebaute Wert steht da.

---

#### P1 · der ursprüngliche Auftrag *(zur Begründung)*

**Der Anlass.** Schaltet ein Käufer den Bereich *Ermüdung* ein, steht dort heute:
„Zugeschaltet. Der Ermüdungsnachweis wird in **Baustein N13** gerechnet." Dasselbe beim
Verzug mit N15. Für uns ist das präzise — **für einen Käufer ist „Baustein N13"
bedeutungslos.** Er liest einen internen Bauplan und weiß nicht, ob das nächste Woche
kommt oder nie.

**Drei Stufen, in dieser Reihenfolge wichtig:**

1. **Die Beschriftung sagt es VORHER.** Der Haken heißt künftig
   „Ermüdung / Betriebsfestigkeit — **folgt in einem Update**", ebenso „Verzug &
   Schrumpfung — folgt in einem Update". *Eine Beschriftung verhindert die Enttäuschung;
   ein Fenster erklärt sie nur.* Das ist die wichtigste der drei Stufen.
2. **Ein Hinweisfenster zum Wegklicken — aber NUR EINMAL JE BEREICH UND SITZUNG.**
   Erscheint es bei jedem Haken, klickt man es nach dem dritten Mal reflexhaft weg, ohne zu
   lesen — dann hat es das Gegenteil erreicht. Der Merker gilt **nur für die Sitzung** und
   wird **nicht** im lokalen Speicher abgelegt (dieselbe Überlegung wie beim „Später" in
   5.1-10: was sich dauerhaft merkt, muss einen auffindbaren Weg zurück haben).
3. **Die Notiz unter dem Haken bleibt stehen**, umformuliert ohne Bausteinnamen.

**SPRACHREGEL (aus 1a):** nirgends „kostenlos" oder „gratis" — das Update wird
kostenpflichtig. **„Folgt in einem späteren Update"** trägt beide Wege.

**Betrifft:** `ui.js` (ZUSATZ-Tabelle), `i18n_kern.js` (Texte dreisprachig), beide HTMLs
(Fenster), `style.css`, dazu Assertions und DOM-Smoke.

---

**P1 TRÄGT AUSSERDEM DIE KONTAKTANGABEN** *(Dieter, 2026-08-08)* — dieselben Dateien,
dieselbe Art Prüfung; zwei getrennte Etappen hießen zweimal hochladen und zweimal testen.

**a) Anschrift raus, Verweis rein.** Statt der vollen Adresse steht künftig überall
(Fußzeile, Info-Fenster, Druckfuß, Word-Dokument):
„Vollständiges Impressum und Datenschutzerklärung online unter: **dt-profidreieck.de**".
Begründung in 1a.

**b) Anklickbar.** In der Anwendung wird die Adresse ein echter Link
(`target="_blank" rel="noopener"`), die E-Mail ein `mailto:`-Link.
**Im Word-Dokument bleibt beides KLARTEXT** — RTF-Hyperlinks sind zusätzliche Struktur in
einer Datei, die diese Woche zweimal an Struktur gescheitert ist (5.1-9, v2.67). Der Text
ist lesbar; das genügt.

**c) BEIDE ANGABEN STEHEN IM KOPF DER HTML und sind mit einem Editor änderbar.**
Hintergrund: Nach dem Zusammenkopieren zur Einzeldatei und der Verschlüsselung wäre eine
Adresse mitten im Skript nur mit erheblichem Aufwand zu ändern. So genügt der Kopf, dann
neu zippen und an Digistore geben.

```html
<script>
/* ==== HIER ÄNDERN, wenn Adresse oder E-Mail wechseln ==== */
window.DT_WEB  = 'dt-profidreieck.de';
window.DT_MAIL = 'Dieter.Tepe@live.de';
window.DT_EDITION = 'full';
</script>
```

> ⚠️ **BEIDE ANGABEN GEHÖREN IN DENSELBEN INLINE-BLOCK.** Der Harness prüft, dass es
> **genau ein** Inline-Skript gibt (S29). Nur so bleibt außerdem der Unterschied zwischen
> Voll- und Testversion **genau eine Zeile**.
>
> **RÜCKFALLWEG:** Fehlt oder verrutscht eine Angabe, nimmt das Programm den eingebauten
> Wert — eine leere Zeile im Ausdruck wäre schlimmer als ein alter Wert. Geprüft wird
> nichts (wie beim Lizenzschlüssel), aber es entsteht nie eine Lücke.
>
> **EINE QUELLE:** Druck, Word und Anzeige holen die Angaben von derselben Stelle. Vier
> Orte, die denselben Satz bauen, wären vier Gelegenheiten, ihn verschieden zu bauen.

**Zusätzlich zu prüfen:** die Angaben aus dem HTML-Kopf erscheinen in Fußzeile,
Info-Fenster, Druckfuß und Word · geänderte Werte im Kopf schlagen überall durch ·
fehlende Werte fallen auf den eingebauten Wert zurück · die volle Anschrift steht
**nirgends** mehr im Programmtext · **Gegenprobe:** Adresse wieder fest verdrahten, dann
muss eine Prüfung rot werden.
**Zu prüfen:** Beschriftung in allen drei Sprachen · Fenster erscheint beim ersten Haken ·
beim zweiten Haken desselben Bereichs **nicht** mehr · nach Sprachwechsel bleibt der Merker
· kein Bausteinname und kein „kostenlos" im Text · **Gegenprobe:** ohne Merker erscheint es
zweimal, dann muss eine Prüfung rot werden.

---


---

## P0 — die Editionsweiche *(ehemals 5.4, abgenommen 2026-08-08)*

### 5.4 P0 · Die Editionsweiche — **GELIEFERT 2026-08-08**

**Dieters Fund, und er ist gravierend.** In `ui.js` stand seit N5a:

```js
edition: (win.DT_EDITION === 'test') ? 'test' : 'full'
```

**Alles, was nicht exakt `'test'` war, wurde zur Vollversion** — eine leere Zeichenkette,
eine gelöschte Zeile, ein Tippfehler, `'FULL'`, `'voll'`, `'Vollversion'`. Wer die Zeile
im HTML-Kopf entfernte oder irgendetwas hineinschrieb, hatte **alle Ausgaben frei**.
Bei einem Programm, das über Digistore24 verkauft werden soll, ist das kein
Schönheitsfehler.

> ⚠️ **DAS BITTERE DARAN: DAS GATING WAR DIE GANZE ZEIT RICHTIG HERUM.**
> `report.js` entscheidet seit N11 `if (edition !== 'full')` sperren, und **S49 prüft
> ausdrücklich, dass eine leere oder unbekannte Edition nichts freigibt.** Geprüft war
> also das **Tor** — nie die **Hand, die den Schlüssel hineinlegt**. Dasselbe Muster wie
> beim vergessenen `leeren()`, bei den verklebten Karten und bei der Zeilenlänge: die
> Prüfung lag *neben* der Sache statt *auf* ihr.

**Die Entscheidung liegt jetzt in `report.js`** — bei allem anderen Editionsabhängigen,
und damit in Node prüfbar:

```js
function editionAus(wert) { return (wert === 'full') ? 'full' : 'test'; }
```

**Kein Trimmen, keine Groß-/Kleinschreibung, keine Freundlichkeit.** Wer die Vollversion
ausliefert, schreibt sie richtig. `ui.js` liest `DT_EDITION` an genau einer Stelle und
fragt damit `report.js`; fehlt `report.js` ganz, bleibt es bei der Testversion.

**Geprüft in Sektion S52:** 19 falsche Schreibweisen (`''`, `' '`, `'FULL'`, `' full'`,
`'full '`, `"'full'"`, `'voll'`, `'demo'`, `'1'`, `'TEST'` …) und 10 Nicht-Zeichenketten
(`null`, `undefined`, `0`, `true`, `{}`, `['full']`, `NaN` …) — **keine davon** gibt die
Vollversion. Dazu: Weiche und Gating kommen bei jedem Wert zum selben Ergebnis; die alte
Form steht nirgends mehr im Quelltext; und wäre die Skriptzeile ganz weg, käme die
Testversion heraus.

**DER DOM-SMOKE DER VOLLVERSION LÄUFT SEIT P0 ZWEIMAL.** Der zweite Lauf nimmt dieselbe
**Vollversions-HTML**, schreibt aber Unsinn in den Kopf — und klickt alles durch: Der
Testbalken muss erscheinen, die vier Ausgaben müssen gesperrt sein, der Info-Dialog muss
die Testversion nennen. Damit ist der gefährliche Fall nicht nur an der Funktion belegt,
sondern an der echten Oberfläche.

> **EINE PRÜFUNG MUSS IHRE ERWARTUNG SELBST KENNEN (neue Regel, 9.2).**
> Im ersten Anlauf holte sich der Smoke die Erwartung aus `Report.editionAus()` — also
> aus dem, was er prüfen sollte. In der Gegenprobe blieb er dann **grün**, obwohl die
> Weiche wieder falsch herum stand: die Erwartung drehte sich mit. Jetzt steht die Regel
> unabhängig im Smoke (`edition === 'full'`), und die Gegenprobe meldet **16 rote
> Zeilen**.

**Zur Auslieferung** *(Dieter, 2026-08-08)*: Beim Bau der Einzeldatei wird der erklärende
Kommentar über der Editionszeile entfernt, damit niemand Fremdes Bescheid weiß. **Das ist
geprüft und unschädlich** (S52). Es hilft aber nur wenig — `window.DT_EDITION = 'full'`
steht ohnehin lesbar da. **Was wirklich schützt, ist die richtige Vorgabe:** wer die Zeile
verändert, landet in der Testversion.

**Basislinie 3417 → 3432 Assertions · Smokes 1081 / 1039 / **1039 (kaputte Edition, neu)**.**
**Betroffen:** `report.js` (0.3.0-P0), `ui.js` (0.19.0), `test_naht.js` (**S52**),
`dom_smoke_voll.js` (zweiter Lauf). Kein anderes Modul, kein Rechenkern.

**Am Gerät zu prüfen:** In der Vollversions-HTML `'full'` durch `'voll'` ersetzen und
laden — es **muss** der Testbalken erscheinen und jede Ausgabe gesperrt sein. Danach
wieder auf `'full'` setzen.

---


---

## Abgelöste Dateistände nach N6b und N5d *(ehemals 8.1b und 8.1a)*

> **Der GÜLTIGE Dateistand steht in Teil E der Plandatei.** Diese beiden sind
> überholt und stehen nur noch als Beleg, wie der Ordner damals aussah.

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
(**19 Module**, `style.css`, beide HTMLs, **alle drei** DEV-ONLY-Dateien, dazu Plandatei und
`Schweißnaht-Historie.md`), Arbeitsordner herstellen, die drei Testläufe starten.
Melden müssen sie **3488 / 1121 / 1079 / 1079 · 0 Fehler** — der DOM-Smoke der
Vollversion läuft seit P0 **zweimal**: einmal regulär und einmal mit einer kaputten
Edition im HTML-Kopf, die sich wie die Testversion verhalten muss.
⚠️ **Die beiden Smokes sind seit N12 verschieden lang** — der Aktivierungsdialog gibt es
nur in der Vollversion, also prüft der Testlauf dort anderes und weniger. Das ist kein
Fehler; beide Zahlen sind Basislinie und dürfen nur wachsen. Weicht etwas ab, erst das klären —
nicht bauen.

**Was N6b überschreiben wird** (zur Vorwarnung, nicht als Auftrag): neu `symbol.js`,
dazu `ui.js` um dessen Anzeige, `i18n_kern.js` und `i18n_hilfe.js` um die Texte,
beide HTMLs um den Anker, `style.css` gegebenenfalls. `svglib.js` wird **benutzt**,
nicht geändert. Die Rechenmodule bleiben unberührt.
**Abweichung von der Vorwarnung in N5d — festgehalten:** `validate.js` musste **nicht**
angefasst werden (die zwei Auswahlen sind Gruppen, keine Felder), dafür `daten.js`
(die Liste 2.4 hat dort ihre einzige Quelle) und `i18n_kerbfall.js` (Kennung).

---

---


---

## ⚠️ Lücke im Changelog: v2.65 bis v2.72 fehlen *(festgestellt bei P2, 2026-08-08)*

**Der Plan sagte seit v1.0: „die vollständige Fassung ab v1.0 steht in
`Schweißnaht-Historie.md`."** Auf diese Zusage gestützt wurde der Changelog im Plan bei
jeder Lieferung auf die letzten drei Einträge getrimmt. **Den Mechanismus, der sie
hierher gebracht hätte, gab es nie.** Die Einträge **v2.65 bis v2.72** sind dadurch aus
beiden Dateien verschwunden.

**Der Inhalt ist NICHT verloren** — er steht in den Erzählblöcken dieser Datei, die in
denselben Sitzungen geschrieben wurden: *Aus N11*, *Aus der Rückmeldung 2026-08-07*,
*Aus der zweiten Nacharbeit zu N11*, *Aus dem Abschluss von N11*, *Aus N12*,
*Aus der Abnahme von N12*, *Aus dem Verkaufsentschluss*. Verloren ist die **kompakte
Form**, nicht die Sache.

**Ab v2.73 wird nachgeholt.** Und die Regel dazu steht jetzt in 9.2 der Plandatei:
*Ein getrimmter Changelog-Eintrag wandert in die Historie, nicht ins Nichts.*

---

**v2.73 (2026-08-08):** **Impressum und Datenschutzerklärung fertig geliefert — und ein
Verweis im Plan berichtigt.** Nur Plandatei, kein Code; `Codestand` bleibt 2.70.
Dieter hat den Quelltext beider Rechtsseiten nachgereicht, daraufhin wurden sie als
**fertige HTML-Dateien** geändert statt als Textvorschläge: Produktliste an drei Stellen,
neuer Abschnitt „Haftung für die Berechnungsprogramme", neuer Datenschutzabsatz zur
lokalen Speicherung, Stand auf August 2026. **Alle Links wurden byteweise gegen die
Originale gehalten** — fünf je Seite, keiner verändert. Damit war die Zwischendatei
`Rechtstexte_Ergaenzung_Schweissnaht.md` überholt; **der Plan verwies aber weiter auf
sie.** Ein Verweis auf eine Datei, deren Inhalt längst erledigt ist, schickt den nächsten
Leser auf eine Suche nach Arbeit, die es nicht mehr gibt — deshalb ist er ersetzt.
Zugleich ist jetzt in 1a festgehalten, dass die drei Landingpage-Dateien **nicht** in den
Projektordner dieses Programms gehören: sie dort zu kopieren wäre genau die Doppelquelle,
die zu vermeiden der Anlass war.
**Basislinie unverändert: 3417 Assertions · Smokes 1081 / 1039 · i18n-Parität 0.**
**Nächster Schritt: P2, dann N13. Einstieg: „weiter mit P2".**

---

**v2.74 (2026-08-08):** **P0 — DIE EDITIONSWEICHE WAR FALSCH HERUM, von Dieter gefunden.**
In `ui.js` stand `(DT_EDITION === 'test') ? 'test' : 'full'`: alles, was nicht exakt
`'test'` war, wurde zur **Vollversion** — eine leere Zeichenkette, eine gelöschte Zeile,
ein Tippfehler, `'FULL'`, `'voll'`. Wer die Zeile im HTML-Kopf veränderte, hatte alle
Ausgaben frei. **Das Gating in `report.js` war die ganze Zeit richtig herum, und S49
prüft sogar, dass eine unbekannte Edition nichts freigibt** — geprüft war also das Tor,
nie die Hand, die den Schlüssel hineinlegt. Dasselbe Muster wie schon dreimal in dieser
Woche. Die Entscheidung liegt jetzt in `report.js` bei allem anderen Editionsabhängigen:
**nur exakt `'full'`**, kein Trimmen, keine Groß-/Kleinschreibung. Neue Sektion **S52**
mit 19 falschen Schreibweisen und 10 Nicht-Zeichenketten; **der DOM-Smoke der Vollversion
läuft seit P0 zweimal** — der zweite Lauf schreibt Unsinn in den Kopf derselben
Vollversions-HTML und klickt alles durch. **Ein Nebenfund aus der Gegenprobe wurde zur
Regel:** Der Smoke holte seine Erwartung anfangs aus `Report.editionAus()` und blieb
deshalb grün, obwohl die Weiche falsch stand — die Erwartung drehte sich mit. Jetzt steht
sie unabhängig, und die Gegenprobe meldet 16 rote Zeilen. Außerdem prüften zehn
Assertions Kennungen gegen `-N\w+` und wurden rot, als die Etappe „P0" hieß; alle zehn
prüfen jetzt allgemein. Drei neue Festlegungen in 9.2, Ergebnis in **5.4**.
**Codestand 2.70 → 2.74 · ui 0.18.1 → 0.19.0 · report 0.2.1 → 0.3.0-P0 · Etappe P0.**
**Basislinie 3417 → 3432 Assertions · Smokes 1081 / 1039 / 1039 (dritter Lauf neu).**
**Nächster Schritt: P2, dann N13. Einstieg: „weiter mit P2".**


════════════════════════════════════════

---

**v2.76 (2026-08-08):** **P0 abgenommen, P1 gebaut und geliefert.** P0 ist am Gerät
geprüft: mit `'voll'` im HTML-Kopf erscheint der Testbalken und alles ist gesperrt.
**P1 bringt drei Stufen und die Kontaktangaben.** Neben *Ermüdung* und *Verzug* steht
jetzt **„— folgt in einem Update“** an der Beschriftung — sie ist die wichtigere der
Stufen, denn ein Fenster erklärt eine Enttäuschung, die Beschriftung verhindert sie.
Das **Hinweisfenster erscheint höchstens einmal je Bereich und Sitzung**; der Merker wird
nicht verwahrt. **Interne Bausteinnamen stehen nirgends mehr im Programmtext**, und eine
Assertion durchsucht das ganze Wörterbuch nach „kostenlos“ und Verwandten — das Update
wird kostenpflichtig (1a). **Die volle Anschrift ist aus dem Programm verschwunden:**
an ihre Stelle tritt der Verweis auf `dt-profidreieck.de`, anklickbar, im Info-Fenster
zusätzlich die E-Mail als `mailto`. **Adresse und E-Mail stehen im HTML-Kopf** im selben
Block wie die Editionsweiche — mit Rückfall auf den eingebauten Wert, damit nie eine
leere Zeile entsteht. **Zwei Nebenfunde:** Der Wortfilter fing zunächst das englische
„free“ in „no free weld end“ (vier Fehlalarme), und der Merker des Hinweisfensters ließ
sich nicht gegenprüfen, weil die Prüfung dort stand, wo der Haken längst berührt war —
daraus zwei Festlegungen in 9.2. Fünf Gegenproben bestanden. Ergebnis in **5.3**.
**Codestand 2.74 → 2.76 · ui 0.19.0 → 0.20.0 · report 0.3.0 → 0.4.0-P1 ·
i18n_kern 0.9.1 → 0.10.0-P1.**
**Basislinie 3432 → 3469 Assertions · Smokes 1081/1039/1039 → 1119/1077/1077.**
**Nächster Schritt: P2 (Neuordnung), dann N13. Einstieg: „weiter mit P2“.**


════════════════════
Ende Schweißnaht-1.md · DT-ProfiSchweissnaht
════════════════════════════════════════════════════════════

---

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


═══════════════
Ende Schweißnaht-1.md · DT-ProfiSchweissnaht
════════════════════════════════════════════════════════════

---

## Aus P2 (2026-08-08) — Plandatei und Historie neu geordnet

**Der Anlass war eine Zahl.** Vor dem Umbau wurde vermessen: **681 regelhafte Zeilen**,
verteilt über sieben Orte, und **1976 Zeilen (43 %) reine Erzählung** abgeschlossener
Arbeit. Dieters Beobachtung, dass vieles verstreut sei und überlesen werde, war damit
keine Vermutung mehr — am Vortag hatte deshalb sechsmal eine Prüfung neben der Sache
gelegen statt auf ihr.

**Zwei Entscheidungen weichen vom ursprünglichen Auftrag ab, und beide sind begründet.**

*Erstens: Die Abschnittsnummern bleiben.* In 5.3 war eine neue Gliederung mit den Teilen
A–E vorgesehen. Beim Vorbereiten fiel auf, dass auf „4.12", „Plan 3.4" oder „9.2" an
dutzenden Stellen verwiesen wird — **auch aus dem Code heraus, in Kommentaren**. Eine
Umnummerierung hätte jeden dieser Verweise ins Leere laufen lassen. Die Teile sind
deshalb eine Wegweisung **über** der bestehenden Nummerierung geworden, keine neue.

*Zweitens: Nicht alle Regeln gehören an eine Stelle.* Der Auftrag sagte „alle
verbindlichen Regeln an EINER Stelle". Das Vermessen zeigte: **152 der 681 Regelzeilen
stehen in den Schnittstellen** — Sätze wie „`ui.js` ruft genau vier Module auf" oder
„`report.js` ist DOM-frei". Reißt man sie heraus, liest jemand eine Schnittstelle und
übersieht ihre Bedingung. **Eine Bedingung, die man erst zwei Kapitel entfernt findet,
ist schlechter als eine, die neben dem steht, was sie bedingt.** Zusammengeführt wurde,
was *immer* gilt: Kickoff, Teststrategie, 9.1 und 9.2 — jetzt in Teil A.

**Die 80 Regeln in 9.2 sind thematisch sortiert.** Sie standen in der Reihenfolge, in der
sie gelernt wurden; wer wissen wollte, ob es zu einer Sache schon eine Regel gibt, musste
achtzig Punkte lesen. Jetzt sind es sieben Themen von *Arbeitsweise* bis *Dateien und
Ausgaben*. **Der Wortlaut ist unverändert** — verschoben wurden ganze Punkte, nichts
umgeschrieben.

**Gemessen statt gehofft.** Vor dem Umbau wurden alle 681 regelhaften Zeilen samt ihrem
Wortkern erfasst. Nachher wurde jede einzelne gesucht — **alle 681 wiedergefunden**, in
der Plandatei oder in der Historie. Dazu fünfzehn harte Anker gegengezählt: `f_u = 490`,
die Liste 2.4, Δσ, EN ISO 13920, Basislinie, Codestand. **Keiner verloren.** Und die drei
Testläufe melden dieselben Zahlen wie vorher — der Beweis, dass nur Text bewegt wurde.

**DABEI KAM EIN ALTER SCHADEN HERAUS, UND ER IST DER EIGENTLICHE FUND DES TAGES.**

Der Plan versprach seit v1.0: *„die vollständige Fassung ab v1.0 steht in
`Schweißnaht-Historie.md`."* Auf diese Zusage gestützt wurde der Changelog bei jeder
Lieferung auf drei Einträge getrimmt. **Beim Nachprüfen zeigte sich: die Historie endet
bei v2.64.** Den Mechanismus, der die Einträge hierher gebracht hätte, gab es nie. **v2.65
bis v2.72 sind gelöscht worden** — acht Einträge, über Tage hinweg, ohne dass es jemandem
auffiel.

Der Inhalt ist nicht verloren: Er steht in den Erzählblöcken, die in denselben Sitzungen
entstanden sind. Verloren ist die kompakte Form. v2.73 aufwärts ist nachgetragen, und die
Regel steht jetzt in 9.2.1: **Eine Zusage ohne Handgriff ist keine Zusage.** Wer etwas
auslagert, prüft einmal nach, ob es am Zielort ankommt.

Das ist dasselbe Muster wie die sechs Funde des Vortags, nur größer: **Die Regel war da.
Die Prüfung, ob sie ausgeführt wird, war es nicht.**

**Plandatei 4625 → 2869 Zeilen (−38 %) · Historie 3219 → 5282 Zeilen (+64 %).**
**Kein Code angefasst. Basislinie unverändert: 3488 · 1121 / 1079 / 1079.**


---

## Der Auftrag für P2 *(ehemals 5.3 der Plandatei, erledigt 2026-08-08)*

### 5.3 Zwei kleine Aufträge vor N13 *(abgestimmt 2026-08-07)*

---

#### P2 · Neuordnung von Plandatei und Historie

**Der Anlass — belegt durch den 07.08.** Drei Fehler dieses Tages waren **Findefehler,
keine Denkfehler**: 9.2 sagte „drei Module", 4.10c seit N11 „vier". In N11 entstand ein
**zweites** `@media print` neben dem aus N5a, weil das erste an einer Stelle stand, an der
nicht gesucht wurde. Und der Platzhalter in `edition()` wartete auf N12, ohne dass ihn
jemand ablöste. **Verbindliche Regeln stehen heute an fünf Orten** — Kickoff, 3.x, 4.10c,
9.1, 9.2 — und wer an einem nachsieht, übersieht die anderen vier.

> ⚠️ **DAS IST DIE RISKANTESTE ARBEIT DES PROJEKTS.** Die Plandatei ist das
> Sicherheitsnetz: Jede Regel darin steht dort, weil einmal etwas schiefging. Eine Zeile
> beim Umräumen zu verlieren heißt, den Schutz zu verlieren, den sie erkauft hat — und man
> merkt es erst, wenn derselbe Fehler wiederkommt.

**DREI BEDINGUNGEN, ohne die nicht angefangen wird:**

1. **NICHTS BINDENDES WANDERT.** In die Historie geht nur die *Begründung* — die
   Geschichte, warum etwas so gebaut wurde. Jede *Regel*, die künftige Arbeit steuert,
   bleibt. **Die Trennung ist die eigentliche Arbeit:** In 5.1-8 etwa steckt beides — die
   Entscheidung zum Dateiformat bindet weiter, die Erzählung darum nicht.
   ⚠️ Was in die Historie wandert, wird beim Sitzungsstart **nicht mehr gelesen**.
   „Wir haben es in die Historie verschoben" darf nicht heimlich zu „niemand liest es
   mehr" werden.
2. **ES WIRD GEMESSEN, NICHT GEHOFFT.** Vorher wird jede regelhafte Zeile aus der Datei
   gezogen; nachher wird geprüft, dass jede wiederzufinden ist — in der Plandatei oder,
   wenn sie nur Begründung war, in der Historie. Aus „ich glaube, es ist alles da" wird
   eine Zahl.
3. **EIGENE ETAPPE, KEIN CODE.** Die drei Läufe müssen vorher und nachher **identische
   Zahlen** melden. Das ist der Beweis, dass nur Text bewegt wurde. `Codestand` bleibt
   stehen, nur `Plan-Version` wandert.

**Die Struktur — ein Regelwerk statt fünf.** Sortiert wird danach, *wann* man etwas
braucht:

| Teil | Inhalt |
|---|---|
| **A · Vor dem Bau** | Status und Basislinie · Sitzungsablauf (Kickoff) · **ALLE verbindlichen Regeln an EINER Stelle**, thematisch: Arbeitsweise · Ehrlichkeit · Architektur · Prüfen · Liefern · **Wegweiser: was steht wo, auch in der Historie** |
| **B · Das Produkt** | Eckdaten und Editionen · Verkauf (1a) · fachlicher Umfang und die ehrlichen Lücken · Produktentscheidungen (Dateiformat, Vorbelegungen, Zusatzbereiche) |
| **C · Die Architektur** | Modulkarte und Ladereihenfolge · Schnittstellen · die Grenzen von `ui.js` |
| **D · Der Bauplan** | Bausteintabelle · **nur der NÄCHSTE Auftrag** · Etappen und offene Entscheidungen |
| **E · Dateistand** | Was liegt im Projektordner, was gehört auf GitHub |

**Was in die Historie geht:** die Abschnitte „gelieferter Umfang" (5.1-1 … 5.1-10) als
Erzählung, die älteren Changelog-Einträge, die Herleitung der fachlichen Grundlagen.
**Was bleibt:** jede Regel, jede Schnittstelle, jede offene Entscheidung, die Liste 2.4,
das Dateiformat, die Basislinie.

**Der Wegweiser in Teil A ist Pflicht** — er nennt ausdrücklich, welche Fragen in der
Historie beantwortet sind, damit niemand dort suchen muss, ohne zu wissen, dass es sie
gibt.

**Zeitpunkt:** nach P1, vor N13. Danach ist die Datei die Grundlage für alles Weitere —
sie jetzt zu ordnen ist billiger als nach drei weiteren Bausteinen.

---
