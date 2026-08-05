/* ============================================================================
 * DT-ProfiSchweissnaht · i18n_hilfe.js  (DTNI18nHilfe)
 * Baustein N1 — Laien-ⓘ an JEDEM Eingabefeld und an jeder Auswahlgruppe.
 * Aufbau je Eintrag:  { de:{was,bereich,tipp}, en:{...}, pt:{...} }
 *   was     = Was ist das? (Laiensprache, ein bis zwei Saetze)
 *   bereich = ueblicher Wertebereich / moegliche Antworten
 *   tipp    = empfohlener Wert bzw. Entscheidungshilfe
 * Die Paritaetspruefung verlangt alle drei Sprachen mit allen drei Feldern.
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNI18nHilfe = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.4.0-N10b';
  var SPRACHEN = ['de', 'en', 'pt'];
  var FELDER = ['was', 'bereich', 'tipp'];

  var H = {

    /* =============== Auswahlgruppen =============== */

    grp_welt: {
      de: { was: 'Nach welchem Regelwerk gerechnet wird. Stahlbau rechnet mit Bemessungslasten gegen die Zugfestigkeit, der klassische Maschinenbau mit zulässigen Spannungen gegen die Streckgrenze.',
            bereich: 'Stahlbau (EN 1993-1-8) oder Maschinenbau (klassisch).',
            tipp: 'Bauwerk, Halle, Konsole, Träger → Stahlbau. Maschinenrahmen, Gerät, Vorrichtung → Maschinenbau. Beide Welten werden nie vermischt.' },
      en: { was: 'Which code the calculation follows. Structural steelwork uses design loads against ultimate strength; classic mechanical engineering uses allowable stresses against yield.',
            bereich: 'Structural (EN 1993-1-8) or mechanical (classic).',
            tipp: 'Building, hall, bracket, beam → structural. Machine frame, device, fixture → mechanical. The two worlds are never mixed.' },
      pt: { was: 'Segundo que regulamento se calcula. A construção metálica usa cargas de dimensionamento contra a tensão de rotura; a mecânica clássica usa tensões admissíveis contra a cedência.',
            bereich: 'Construção metálica (EN 1993-1-8) ou mecânica (clássico).',
            tipp: 'Edifício, pavilhão, consola, viga → construção metálica. Chassis de máquina, equipamento → mecânica. Os dois métodos nunca se misturam.' }
    },

    grp_rechenrichtung: {
      de: { was: 'Nachweis: Sie geben das a-Maß vor und erfahren die Ausnutzung. Auslegung: Sie geben die Last vor und erfahren das nötige a-Maß.',
            bereich: 'Nachweis oder Auslegung.',
            tipp: 'Neue Konstruktion → Auslegung. Vorhandene Zeichnung prüfen → Nachweis.' },
      en: { was: 'Verification: you set the throat and get the utilisation. Design: you set the load and get the required throat.',
            bereich: 'Verification or design.',
            tipp: 'New design → design. Checking an existing drawing → verification.' },
      pt: { was: 'Verificação: define a garganta e obtém o grau de utilização. Dimensionamento: define a carga e obtém a garganta necessária.',
            bereich: 'Verificação ou dimensionamento.',
            tipp: 'Projeto novo → dimensionamento. Verificar um desenho existente → verificação.' }
    },

    grp_werkstoffgruppe: {
      de: { was: 'Die Werkstofffamilie bestimmt das gesamte Nachweisverfahren – nicht nur die Zahlenwerte.',
            bereich: 'Baustahl, nichtrostender Stahl oder Aluminium.',
            tipp: 'Im Zweifel Baustahl. Aluminium immer mit WEZ-Entfestigung – dort wird die Naht sonst deutlich zu günstig gerechnet.' },
      en: { was: 'The material family determines the whole verification procedure – not only the numbers.',
            bereich: 'Structural steel, stainless steel or aluminium.',
            tipp: 'If in doubt, structural steel. Aluminium always with HAZ softening – otherwise the weld is calculated far too favourably.' },
      pt: { was: 'A família de material determina todo o procedimento de verificação – não apenas os números.',
            bereich: 'Aço estrutural, aço inoxidável ou alumínio.',
            tipp: 'Na dúvida, aço estrutural. Alumínio sempre com amaciamento da ZTA – caso contrário a solda fica demasiado otimista.' }
    },

    grp_werkstoff: {
      de: { was: 'Die konkrete Sorte. Daraus kommen Streckgrenze, Zugfestigkeit und der Korrelationsbeiwert βw.',
            bereich: '11 Sorten: S235 bis S460, 1.4301/1.4404/1.4571, EN AW-5083/6060/6082.',
            tipp: 'S235 und S355 decken den größten Teil der Praxis ab. Sondergüten über „eigener Wert".' },
      en: { was: 'The specific grade. It supplies yield strength, ultimate strength and the correlation factor βw.',
            bereich: '11 grades: S235 to S460, 1.4301/1.4404/1.4571, EN AW-5083/6060/6082.',
            tipp: 'S235 and S355 cover most of practice. Special grades via "own value".' },
      pt: { was: 'A qualidade concreta. Dela vêm a cedência, a rotura e o coeficiente βw.',
            bereich: '11 qualidades: S235 a S460, 1.4301/1.4404/1.4571, EN AW-5083/6060/6082.',
            tipp: 'S235 e S355 cobrem a maior parte da prática. Qualidades especiais via "valor próprio".' }
    },

    grp_zustand: {
      de: { was: 'Der Liefer- bzw. Wärmebehandlungszustand des Aluminiums. Er entscheidet über Festigkeit UND über den Festigkeitsverlust in der Wärmeeinflusszone.',
            bereich: 'O/H111, F/H112, H24/H34, T4, T6.',
            tipp: 'T6 ist der häufigste Profilzustand, verliert aber in der WEZ fast die Hälfte der Festigkeit. Im Zustand O gibt es keinen Verlust.' },
      en: { was: 'The delivery or heat-treatment condition of the aluminium. It governs strength AND the strength loss in the heat-affected zone.',
            bereich: 'O/H111, F/H112, H24/H34, T4, T6.',
            tipp: 'T6 is the most common extrusion condition but loses nearly half its strength in the HAZ. Condition O loses nothing.' },
      pt: { was: 'O estado de fornecimento ou tratamento térmico do alumínio. Determina a resistência E a perda na zona termicamente afetada.',
            bereich: 'O/H111, F/H112, H24/H34, T4, T6.',
            tipp: 'T6 é o estado mais comum em perfis, mas perde quase metade da resistência na ZTA. No estado O não há perda.' }
    },

    grp_zusatzwerkstoff: {
      de: { was: 'Der Schweißzusatz beim Aluminium. Seine Festigkeit fw geht direkt in den Nahtnachweis ein.',
            bereich: '5356 (AlMg5) oder 4043A (AlSi5).',
            tipp: '5356 ist fester und der Standard für 5083 und tragende 6xxx-Nähte. 4043A ist rissunempfindlicher, aber schwächer.' },
      en: { was: 'The aluminium filler metal. Its strength fw enters the weld check directly.',
            bereich: '5356 (AlMg5) or 4043A (AlSi5).',
            tipp: '5356 is stronger and standard for 5083 and load-bearing 6xxx welds. 4043A is less crack-sensitive but weaker.' },
      pt: { was: 'O metal de adição para alumínio. A sua resistência fw entra diretamente na verificação.',
            bereich: '5356 (AlMg5) ou 4043A (AlSi5).',
            tipp: '5356 é mais resistente e padrão para 5083 e soldas estruturais em 6xxx. 4043A é menos sensível a fissuras mas mais fraco.' }
    },

    grp_bw_regelsatz: {
      de: { was: 'Für S420 und S460 weichen die europäische Fassung und der deutsche Nationale Anhang beim Korrelationsbeiwert βw voneinander ab.',
            bereich: 'Deutscher NA (0,88 / 0,85) oder CEN 2005 (1,0 / 1,0).',
            tipp: 'In Deutschland den Nationalen Anhang wählen – er liegt auf der sicheren Seite. Die getroffene Wahl steht im Rechenweg.' },
      en: { was: 'For S420 and S460 the European edition and the German National Annex give different correlation factors βw.',
            bereich: 'German NA (0.88 / 0.85) or CEN 2005 (1.0 / 1.0).',
            tipp: 'In Germany choose the National Annex – it is on the safe side. The choice is shown in the calculation steps.' },
      pt: { was: 'Para S420 e S460 a versão europeia e o Anexo Nacional alemão dão coeficientes βw diferentes.',
            bereich: 'Anexo Nacional alemão (0,88 / 0,85) ou CEN 2005 (1,0 / 1,0).',
            tipp: 'Na Alemanha escolher o Anexo Nacional – está do lado da segurança. A escolha consta da memória de cálculo.' }
    },

    grp_nachweisverfahren: {
      de: { was: 'Das richtungsbezogene Verfahren zerlegt die Spannungen in Komponenten. Das vereinfachte Verfahren rechnet nur mit der Resultierenden.',
            bereich: 'Richtungsbezogen oder vereinfacht.',
            tipp: 'Richtungsbezogen ist im Mittel rund 10 % günstiger. Das vereinfachte Verfahren liegt immer auf der sicheren Seite und ist stets zulässig.' },
      en: { was: 'The directional method splits the stresses into components. The simplified method works with the resultant only.',
            bereich: 'Directional or simplified.',
            tipp: 'Directional is on average about 10 % more favourable. The simplified method is always safe and always permitted.' },
      pt: { was: 'O método direcional decompõe as tensões em componentes. O simplificado usa apenas a resultante.',
            bereich: 'Direcional ou simplificado.',
            tipp: 'O direcional é em média cerca de 10 % mais favorável. O simplificado está sempre do lado seguro e é sempre admissível.' }
    },

    grp_stossart: {
      de: { was: 'Wie die Bauteile zueinander stehen. Daraus ergibt sich, welche Nahtformen überhaupt sinnvoll sind.',
            bereich: 'Stumpf-, T-, Kreuz-, Eck- oder Überlappstoß.',
            tipp: 'Blech an Blech in einer Ebene → Stumpfstoß. Blech senkrecht auf Blech → T-Stoß. Zwei Bleche übereinander → Überlappstoß.' },
      en: { was: 'How the parts meet. This determines which weld shapes make sense at all.',
            bereich: 'Butt, T, cruciform, corner or lap joint.',
            tipp: 'Plate to plate in one plane → butt joint. Plate perpendicular on plate → T-joint. Two plates on top of each other → lap joint.' },
      pt: { was: 'Como as peças se encontram. Define quais as formas de solda que fazem sentido.',
            bereich: 'Junta de topo, em T, cruciforme, de canto ou sobreposta.',
            tipp: 'Chapa com chapa no mesmo plano → topo. Chapa perpendicular → em T. Duas chapas sobrepostas → sobreposta.' }
    },

    grp_nahtart: {
      de: { was: 'Die Form der Naht. Kehlnähte liegen außen auf, Stumpfnähte füllen eine vorbereitete Fuge.',
            bereich: 'Kehlnaht (einseitig, doppelseitig, Flanke, Stirn, umlaufend) oder Stumpfnaht (I, V, DV/X, HV, DHV/K, HY, DHY).',
            tipp: 'Die Kehlnaht ist die günstigste Naht: keine Fugenvorbereitung. Die durchgeschweißte Stumpfnaht ist die tragfähigste, aber die teuerste.' },
      en: { was: 'The shape of the weld. Fillet welds sit on the outside; butt welds fill a prepared groove.',
            bereich: 'Fillet (single, double, side, end, all-round) or butt (I, V, X, single-bevel, K, J, double-J).',
            tipp: 'The fillet weld is the cheapest: no edge preparation. The full-penetration butt weld is the strongest but the most expensive.' },
      pt: { was: 'A forma da solda. Os filetes ficam por fora; as soldas de topo preenchem um chanfro preparado.',
            bereich: 'Filete (unilateral, bilateral, lateral, frontal, perimetral) ou topo (I, V, X, meio V, K, meio Y, duplo meio Y).',
            tipp: 'O filete é o mais económico: sem preparação. A solda de topo totalmente penetrada é a mais resistente mas a mais cara.' }
    },

    grp_nahtguete: {
      de: { was: 'Im klassischen Maschinenbau bestimmt die Nahtgüte die zulässige Spannung. Entscheidend ist, ob die Naht durchgeschweißt und ob die Zugbeanspruchung nachgewiesen ist.',
            bereich: 'Durchgeschweißt (Zug nachgewiesen / nicht nachgewiesen / nur Druck) oder Kehlnaht.',
            tipp: '„Nachgewiesen" heißt geprüft, zum Beispiel durch Ultraschall oder Durchstrahlung. Ohne Prüfung die ungünstigere Zeile wählen.' },
      en: { was: 'In classic mechanical engineering the weld quality determines the allowable stress. Decisive is whether the weld is fully penetrated and whether tension has been verified.',
            bereich: 'Full penetration (tension verified / not verified / compression only) or fillet weld.',
            tipp: '"Verified" means tested, e.g. by ultrasonic or radiographic testing. Without testing choose the less favourable row.' },
      pt: { was: 'Na mecânica clássica a qualidade da solda determina a tensão admissível. Decisivo é se está totalmente penetrada e se a tração foi comprovada.',
            bereich: 'Totalmente penetrada (tração comprovada / não comprovada / só compressão) ou filete.',
            tipp: '"Comprovada" significa ensaiada, p. ex. por ultrassons ou radiografia. Sem ensaio escolher a linha mais desfavorável.' }
    },

    grp_lastfall: {
      de: { was: 'Wie sich die Last über die Zeit verhält. Nur im Maschinenbau (Welt B) und nur dort wirkt der Lastfall auf die zulässige Spannung.',
            bereich: 'ruhend, schwellend oder wechselnd.',
            tipp: 'Konstante Last → ruhend. An/Aus → schwellend. Zug und Druck im Wechsel → wechselnd. Der Lastfall ersetzt keinen Ermüdungsnachweis und wird nie mit ihm multipliziert.' },
      en: { was: 'How the load behaves over time. Only in mechanical engineering (world B) does the load case affect the allowable stress.',
            bereich: 'static, pulsating or alternating.',
            tipp: 'Constant load → static. On/off → pulsating. Tension and compression alternating → alternating. The load case does not replace a fatigue check and is never multiplied with it.' },
      pt: { was: 'Como a carga varia no tempo. Só na mecânica (método B) o caso de carga afeta a tensão admissível.',
            bereich: 'estático, pulsante ou alternado.',
            tipp: 'Carga constante → estático. Liga/desliga → pulsante. Tração e compressão alternadas → alternado. Não substitui a verificação à fadiga nem se multiplica com ela.' }
    },

    grp_profil: {
      de: { was: 'Die Form des angeschweißten Teils. Aus ihr entsteht nicht nur die Nahtlänge, sondern das ganze Nahtbild – also auch die Lage der Nähte. Für Zug genügt die Länge, für Biegung und Torsion entscheidet die Lage.',
            bereich: 'Blech, Rechteckrohr, Rundrohr, I-/H-Profil, U-Profil, Winkel, Vollrund.',
            tipp: 'Im Zweifel Blech: Lasche, Knotenblech und Stirnplatte sind der häufigste Fall. Maße sind immer Außenmaße; ein Normprofil-Katalog (IPE, HEA, RHS) kommt später – mit den Maßen von Hand geht heute schon jede Abmessung.' },
      en: { was: 'The shape of the welded-on part. It generates not only the weld length but the whole weld group – including where the welds sit. Tension needs the length only; bending and torsion depend on the position.',
            bereich: 'Plate, rectangular tube, round tube, I/H section, channel, angle, solid round.',
            tipp: 'If unsure choose plate: lug, gusset and end plate are the most common case. Dimensions are always outside dimensions; a catalogue of standard sections follows later – typing the dimensions already covers any size.' },
      pt: { was: 'A forma da peça soldada. Dela resulta não só o comprimento do cordão, mas todo o grupo de soldas – incluindo a posição. Para tração basta o comprimento; para flexão e torção decide a posição.',
            bereich: 'Chapa, tubo retangular, tubo circular, perfil I/H, perfil U, cantoneira, barra maciça.',
            tipp: 'Na dúvida escolha chapa: talas, gussets e chapas de topo são o caso mais frequente. As dimensões são sempre exteriores; um catálogo de perfis normalizados virá depois – introduzir as medidas já cobre qualquer dimensão.' }
    },

    grp_kanten: {
      de: { was: 'Welche Kanten des Profils tatsächlich geschweißt sind. Diese Frage ist wichtiger als das Profil selbst: ohne sie rechnet das Programm Nähte mit, die es in Wirklichkeit gar nicht gibt.',
            bereich: 'Rundum, nur Flanken, nur Stirnseiten, nur eine Flanke, nur Flansche, nur Steg, Flansche und Steg.',
            tipp: 'Auf der Zeichnung nachsehen und im Zweifel die kleinere Auswahl nehmen – das liegt auf der sicheren Seite. Rundum ist die einzige Auswahl ohne Endkraterabzug, weil es dort kein freies Nahtende gibt.' },
      en: { was: 'Which edges of the section are actually welded. This question matters more than the section itself: without it the program counts welds that do not exist.',
            bereich: 'All round, sides only, ends only, one side only, flanges only, web only, flanges and web.',
            tipp: 'Check the drawing and, if in doubt, take the smaller selection – that is on the safe side. All round is the only choice without an end crater deduction, because there is no free weld end.' },
      pt: { was: 'Quais arestas do perfil estão realmente soldadas. Esta pergunta é mais importante que o próprio perfil: sem ela o programa conta cordões que não existem.',
            bereich: 'Todo o contorno, apenas laterais, apenas extremidades, apenas um lado, apenas banzos, apenas alma, banzos e alma.',
            tipp: 'Confirme no desenho e, na dúvida, escolha a opção menor – fica do lado seguro. Todo o contorno é a única escolha sem dedução de cratera, por não haver extremidade livre.' }
    },

    grp_lasteingabe: {
      de: { was: 'Ob Sie die Schnittgrößen an der Naht schon kennen oder ob das Programm sie aus Kraft und Hebelarm ermitteln soll.',
            bereich: 'Direkt (N, Q, M, T) oder geometrisch (Kraft + Hebelarm).',
            tipp: 'Wer unsicher ist, wählt geometrisch – dann rechnet das Programm die Schnittgrößen nachvollziehbar vor.' },
      en: { was: 'Whether you already know the internal forces at the weld or the program should derive them from force and lever arm.',
            bereich: 'Direct (N, Q, M, T) or geometric (force + lever arm).',
            tipp: 'If unsure choose geometric – the program then derives the internal forces transparently.' },
      pt: { was: 'Se já conhece os esforços na solda ou se o programa os deve obter da força e do braço.',
            bereich: 'Direta (N, Q, M, T) ou geométrica (força + braço).',
            tipp: 'Na dúvida escolha geométrica – o programa deduz os esforços de forma transparente.' }
    },

    grp_schweissverfahren: {
      de: { was: 'Das Fügeverfahren. Es beeinflusst nicht die Tragfähigkeit, wohl aber Wärmeeinbringung, Zeit und Kosten.',
            bereich: 'MAG, MIG, WIG, E-Hand, UP.',
            tipp: 'MAG ist der Werkstattstandard bei Stahl, MIG bei Aluminium, WIG bei dünnen und hochwertigen Nähten, UP bei langen Nähten in der Serie.' },
      en: { was: 'The joining process. It does not affect load capacity, but it does affect heat input, time and cost.',
            bereich: 'MAG, MIG, TIG, MMA, SAW.',
            tipp: 'MAG is the workshop standard for steel, MIG for aluminium, TIG for thin and high-quality welds, SAW for long production welds.' },
      pt: { was: 'O processo de soldadura. Não afeta a capacidade resistente, mas afeta o aporte térmico, o tempo e o custo.',
            bereich: 'MAG, MIG, TIG, eletrodo revestido, arco submerso.',
            tipp: 'MAG é o padrão de oficina em aço, MIG em alumínio, TIG em soldas finas e de alta qualidade, arco submerso em cordões longos de série.' }
    },

    grp_iso5817: {
      de: { was: 'Die zulässige Größe von Unregelmäßigkeiten wie Einbrandkerben oder Poren. Eine Ausführungsanforderung, keine Rechengröße.',
            bereich: 'B (hoch), C (mittel), D (niedrig).',
            tipp: 'B ist die übliche Forderung bei dynamischer Beanspruchung. Für den Ermüdungsnachweis ist die Bewertungsgruppe wichtig, weil die Kerbfälle eine bestimmte Qualität voraussetzen. Wählen Sie eine Ausführungsklasse, schlägt das Programm die dazu passende Bewertungsgruppe vor (EN 1090-2) — der Vorschlag bleibt überschreibbar.' },
      en: { was: 'The permitted size of imperfections such as undercut or porosity. An execution requirement, not a calculation quantity.',
            bereich: 'B (stringent), C (intermediate), D (moderate).',
            tipp: 'B is the usual requirement for dynamic loading. The quality level matters for fatigue because detail categories presuppose a given quality. If you choose an execution class, the program proposes the matching quality level (EN 1090-2) — the proposal can be overridden.' },
      pt: { was: 'A dimensão admissível de imperfeições como mordeduras ou poros. É um requisito de execução, não uma grandeza de cálculo.',
            bereich: 'B (exigente), C (intermédio), D (moderado).',
            tipp: 'B é o requisito usual em carga dinâmica. O nível importa para a fadiga, pois as categorias de detalhe pressupõem uma dada qualidade. Ao escolher uma classe de execução, o programa propõe o nível correspondente (EN 1090-2) — a proposta pode ser alterada.' }
    },

    grp_exc: {
      de: { was: 'Die Ausführungsklasse nach EN 1090 legt fest, wie streng Herstellung, Prüfung und Dokumentation zu handhaben sind. Sie geht nicht in die Rechnung ein.',
            bereich: 'EXC1 bis EXC4.',
            tipp: 'EXC2 ist der übliche Standard im allgemeinen Stahlbau. Das Feld ist ein reines Hinweisfeld für Ihre Dokumentation.' },
      en: { was: 'The execution class to EN 1090 sets how strictly fabrication, testing and documentation are handled. It does not enter the calculation.',
            bereich: 'EXC1 to EXC4.',
            tipp: 'EXC2 is the usual standard in general steelwork. This field is purely informative for your documentation.' },
      pt: { was: 'A classe de execução da EN 1090 define o rigor de fabrico, ensaio e documentação. Não entra no cálculo.',
            bereich: 'EXC1 a EXC4.',
            tipp: 'EXC2 é o padrão usual na construção metálica corrente. Este campo é meramente informativo.' }
    },

    /* =============== Eingabefelder =============== */

    grp_sym_grund: {
      de: { was: 'Das Symbol, das die Naht auf der Zeichnung darstellt (EN ISO 2553).', bereich: 'Für die Pfeilseite — also die Seite, auf die der Pfeil zeigt.', tipp: 'Der Katalog kann mehr zeichnen, als dieses Programm rechnen kann. Symbole ohne Nachweis werden gezeichnet und dabei ausdrücklich als nicht nachweisbar benannt.' },
      en: { was: 'The symbol representing the weld on the drawing (EN ISO 2553).', bereich: 'For the arrow side — the side the arrow points at.', tipp: 'The catalogue can draw more than this program can calculate. Symbols without verification are drawn and explicitly marked as not verifiable.' },
      pt: { was: 'O símbolo que representa o cordão no desenho (EN ISO 2553).', bereich: 'Para o lado da seta — o lado para onde a seta aponta.', tipp: 'O catálogo desenha mais do que este programa calcula. Os símbolos sem verificação são desenhados e assinalados como não verificáveis.' } },
    grp_sym_gegen: {
      de: { was: 'Ein zweites Symbol für die Gegenseite, wenn dort etwas anderes geschweißt wird.', bereich: 'Nur nötig, wenn beide Seiten unterschiedlich sind.', tipp: 'Bei symmetrischen Nähten (X, K, Doppelkehlnaht) leer lassen — das Symbol steht dort ohnehin auf beiden Seiten.' },
      en: { was: 'A second symbol for the other side, if something different is welded there.', bereich: 'Only needed when the two sides differ.', tipp: 'Leave empty for symmetrical welds (double-V, double-bevel, double fillet) — the symbol already appears on both sides.' },
      pt: { was: 'Um segundo símbolo para o lado oposto, se aí for soldado algo diferente.', bereich: 'Só é necessário quando os dois lados diferem.', tipp: 'Deixe vazio em cordões simétricos (X, K, ângulo duplo) — o símbolo já aparece dos dois lados.' } },
    grp_sym_oberflaeche: {
      de: { was: 'Wie die fertige Nahtoberfläche aussehen soll: eben, gewölbt, hohl oder kerbfrei verschliffen.', bereich: 'Freiwillig — ohne Angabe bleibt die Oberfläche wie geschweißt.', tipp: 'Kerbfrei verschliffen verbessert den Kerbfall bei Ermüdung erheblich. In dieser Fassung ist das nur eine Zeichnungsangabe, gerechnet wird damit noch nicht.' },
      en: { was: 'How the finished weld surface shall look: flat, convex, concave or blended smooth.', bereich: 'Optional — without it the surface stays as welded.', tipp: 'Blending the toes smooth improves the fatigue detail category considerably. Here it is a drawing note only; nothing is calculated from it yet.' },
      pt: { was: 'Como deve ficar a superfície do cordão: à face, convexa, côncava ou suavizada.', bereich: 'Facultativo — sem indicação a superfície fica como soldada.', tipp: 'A suavização melhora bastante a categoria de fadiga. Aqui é apenas uma indicação de desenho; ainda não entra em cálculo.' } },
    grp_sym_sicherung: {
      de: { was: 'Eine Badsicherung stützt die Wurzel beim Schweißen von einer Seite.', bereich: 'M bleibt im Bauteil, MR wird nach dem Schweißen entfernt.', tipp: 'Die Buchstaben M und MR stehen in der Legende unter dem Bild, nicht im Bild selbst — nur so bleiben sie übersetzbar.' },
      en: { was: 'Backing supports the root when welding from one side.', bereich: 'M stays in the part, MR is removed after welding.', tipp: 'The letters M and MR appear in the legend below the image, not inside it — only then do they stay translatable.' },
      pt: { was: 'O cobre-junta apoia a raiz ao soldar de um só lado.', bereich: 'M fica na peça, MR é removido após a soldadura.', tipp: 'As letras M e MR constam da legenda por baixo da imagem, não da imagem — só assim permanecem traduzíveis.' } },
    grp_sym_lage: {
      de: { was: 'Zusätzliche Angaben am Knick der Pfeillinie: Rundumnaht und Baustellennaht.', bereich: 'Freiwillig.', tipp: 'Die Gabel mit der Verfahrensangabe erscheint von selbst, sobald oben ein Schweißverfahren gewählt ist.' },
      en: { was: 'Additional notes at the elbow of the arrow line: weld all round and site weld.', bereich: 'Optional.', tipp: 'The tail with the process reference appears automatically once a welding process is selected above.' },
      pt: { was: 'Indicações adicionais no cotovelo da linha de seta: soldadura em todo o contorno e no local.', bereich: 'Facultativo.', tipp: 'A bifurcação com o processo aparece automaticamente assim que for escolhido um processo acima.' } },
    fld_a: {
      de: { was: 'Die rechnerische Nahtdicke: der Abstand von der Nahtwurzel zur Nahtoberfläche, gemessen im eingeschriebenen Dreieck.',
            bereich: '3 bis etwa 12 mm im üblichen Stahlbau; höchstens 0,7 · kleinste Blechdicke.',
            tipp: 'Faustregel a ≈ √(größte Blechdicke) − 0,5. Bei 10 mm Blech also rund 3 mm. EN 1993-1-8 fordert mindestens 3 mm.' },
      en: { was: 'The design throat thickness: the distance from the weld root to the weld face, measured in the inscribed triangle.',
            bereich: '3 to about 12 mm in normal steelwork; at most 0.7 × smallest plate thickness.',
            tipp: 'Rule of thumb a ≈ √(largest plate thickness) − 0.5. For 10 mm plate about 3 mm. EN 1993-1-8 requires at least 3 mm.' },
      pt: { was: 'A espessura de garganta de cálculo: a distância da raiz à face da solda, medida no triângulo inscrito.',
            bereich: '3 a cerca de 12 mm na construção corrente; no máximo 0,7 × menor espessura.',
            tipp: 'Regra prática a ≈ √(maior espessura) − 0,5. Para chapa de 10 mm cerca de 3 mm. A EN 1993-1-8 exige pelo menos 3 mm.' }
    },

    fld_z: {
      de: { was: 'Das Schenkelmaß: die Kathete des Nahtdreiecks, also das, was man am Bauteil abmisst.',
            bereich: 'etwa 4 bis 17 mm.',
            tipp: 'Umrechnung bei gleichschenkliger Kehlnaht: a = z / √2 beziehungsweise z = a · √2. Aus a = 4 mm folgt z ≈ 5,7 mm.' },
      en: { was: 'The leg length: the side of the weld triangle, i.e. what you actually measure on the part.',
            bereich: 'about 4 to 17 mm.',
            tipp: 'For an equal-leg fillet: a = z / √2 and z = a · √2. From a = 4 mm follows z ≈ 5.7 mm.' },
      pt: { was: 'A perna: o cateto do triângulo da solda, ou seja, o que se mede na peça.',
            bereich: 'cerca de 4 a 17 mm.',
            tipp: 'Para filete de pernas iguais: a = z / √2 e z = a · √2. De a = 4 mm resulta z ≈ 5,7 mm.' }
    },

    fld_l: {
      de: { was: 'Die Länge des einzelnen Nahtabschnitts. Die wirksame Länge ist um den Endkraterabzug 2·a kürzer, wenn die Naht nicht um die Ecke geführt wird.',
            bereich: 'mindestens max(6·a; 30 mm), voll wirksam bis 150·a.',
            tipp: 'Bei a = 4 mm sind das mindestens 30 mm und voll wirksam bis 600 mm. Längere Nähte werden abgemindert.' },
      en: { was: 'The length of the individual weld segment. The effective length is shorter by the end crater deduction 2·a unless the weld is returned around the corner.',
            bereich: 'at least max(6·a; 30 mm), fully effective up to 150·a.',
            tipp: 'For a = 4 mm that is at least 30 mm and fully effective up to 600 mm. Longer welds are reduced.' },
      pt: { was: 'O comprimento do troço de solda. O comprimento efetivo é menor em 2·a, salvo se o cordão contornar a esquina.',
            bereich: 'pelo menos max(6·a; 30 mm), totalmente efetivo até 150·a.',
            tipp: 'Para a = 4 mm são pelo menos 30 mm e efetivo até 600 mm. Cordões maiores são reduzidos.' }
    },

    fld_t1: {
      de: { was: 'Die Dicke des ersten verbundenen Bauteils. Sie begrenzt das a-Maß und bestimmt über die Dickenstufe die Festigkeitswerte.',
            bereich: '4 bis 80 mm (Tabellenbereich EN 1993-1-1).',
            tipp: 'Bei Blechen unter 4 mm ist der Anwendungsbereich von EN 1993-1-8 zu prüfen; Hohlprofile ab 2,5 mm.' },
      en: { was: 'Thickness of the first connected part. It limits the throat and, via the thickness step, determines the strength values.',
            bereich: '4 to 80 mm (table range of EN 1993-1-1).',
            tipp: 'Below 4 mm check the scope of EN 1993-1-8; hollow sections from 2.5 mm.' },
      pt: { was: 'Espessura da primeira peça ligada. Limita a garganta e, pelo escalão de espessura, determina as resistências.',
            bereich: '4 a 80 mm (intervalo da EN 1993-1-1).',
            tipp: 'Abaixo de 4 mm verificar o âmbito da EN 1993-1-8; perfis tubulares a partir de 2,5 mm.' }
    },

    fld_t2: {
      de: { was: 'Die Dicke des zweiten verbundenen Bauteils. Maßgebend für die Festigkeit ist immer das schwächere Bauteil.',
            bereich: '4 bis 80 mm.',
            tipp: 'Freiwillig: Bleibt das Feld leer, wird die Dicke je Nahtabschnitt aus dem Profil verwendet. Sind beide Bleche gleich dick, hier denselben Wert eintragen.' },
      en: { was: 'Thickness of the second connected part. The weaker part always governs the strength.',
            bereich: '4 to 80 mm.',
            tipp: 'Optional: if left empty, the thickness of each weld section is taken from the profile. If both plates are equal, enter the same value here.' },
      pt: { was: 'Espessura da segunda peça ligada. A peça mais fraca é sempre determinante.',
            bereich: '4 a 80 mm.',
            tipp: 'Facultativo: se ficar vazio, é usada a espessura de cada troço a partir do perfil. Se as chapas forem iguais, introduza o mesmo valor.' }
    },

    fld_b: {
      de: { was: 'Die Breite des Profils quer zur Höhe – beim Blech die Blechbreite, beim I- und U-Profil die Flanschbreite, beim Winkel der waagerechte Schenkel.',
            bereich: 'im Maschinenbau meist 20 bis 300 mm, im Stahlbau bis etwa 500 mm.',
            tipp: 'Immer das Außenmaß eintragen. Die Breite liegt in der waagerechten Achse (y) des Nahtbilds – die Skizze zeigt sofort, ob es passt.' },
      en: { was: 'The width of the section across the height – plate width for a plate, flange width for I and channel sections, horizontal leg for an angle.',
            bereich: 'usually 20 to 300 mm in machinery, up to about 500 mm in steelwork.',
            tipp: 'Always enter the outside dimension. The width lies along the horizontal axis (y) of the weld group – the sketch shows immediately whether it fits.' },
      pt: { was: 'A largura do perfil na direção transversal à altura – largura da chapa, largura do banzo em perfis I e U, aba horizontal na cantoneira.',
            bereich: 'normalmente 20 a 300 mm em mecânica, até cerca de 500 mm em construção metálica.',
            tipp: 'Introduza sempre a medida exterior. A largura segue o eixo horizontal (y) do grupo de soldas – o esboço mostra logo se está correto.' }
    },

    fld_h: {
      de: { was: 'Die Höhe des Profils – beim Hohlprofil das zweite Außenmaß, beim I- und U-Profil die Profilhöhe, beim Winkel der senkrechte Schenkel.',
            bereich: 'im Maschinenbau meist 20 bis 300 mm, im Stahlbau bis etwa 1000 mm.',
            tipp: 'Die Höhe liegt in der senkrechten Achse (z). Sie bestimmt das Widerstandsmoment Wy und damit fast immer die Tragfähigkeit gegen Biegung.' },
      en: { was: 'The height of the section – the second outside dimension of a hollow section, the section depth for I and channel sections, the vertical leg for an angle.',
            bereich: 'usually 20 to 300 mm in machinery, up to about 1000 mm in steelwork.',
            tipp: 'The height lies along the vertical axis (z). It governs the section modulus Wy and therefore nearly always the bending capacity.' },
      pt: { was: 'A altura do perfil – a segunda medida exterior do perfil tubular, a altura em perfis I e U, a aba vertical na cantoneira.',
            bereich: 'normalmente 20 a 300 mm em mecânica, até cerca de 1000 mm em construção metálica.',
            tipp: 'A altura segue o eixo vertical (z). Determina o módulo de flexão Wy e, por isso, quase sempre a capacidade à flexão.' }
    },

    fld_d: {
      de: { was: 'Der Außendurchmesser von Rundrohr oder Vollrund. Die Naht liegt außen, deshalb wird mit l = π·d und dem Außendurchmesser gerechnet.',
            bereich: 'gängig 10 bis 500 mm.',
            tipp: 'Nicht den Innendurchmesser und nicht den mittleren Durchmesser eintragen – das ergäbe eine zu kurze Naht und damit ein unsicheres Ergebnis.' },
      en: { was: 'The outside diameter of a round tube or solid bar. The weld sits on the outside, so l = π·d is calculated with the outside diameter.',
            bereich: 'commonly 10 to 500 mm.',
            tipp: 'Do not enter the inside or the mean diameter – that would give too short a weld and therefore an unsafe result.' },
      pt: { was: 'O diâmetro exterior do tubo ou da barra maciça. A solda fica no exterior, por isso calcula-se l = π·d com o diâmetro exterior.',
            bereich: 'habitualmente 10 a 500 mm.',
            tipp: 'Não introduza o diâmetro interior nem o médio – daria um cordão curto demais e um resultado inseguro.' }
    },

    fld_tw: {
      de: { was: 'Die Dicke des Stegs beim I-, H- oder U-Profil. Sie begrenzt das a-Maß der Stegnaht.',
            bereich: 'meist 3 bis 20 mm.',
            tipp: 'Bei Walzprofilen steht der Wert in der Profiltabelle (z. B. IPE 200: tw = 5,6 mm). Das a-Maß am Steg sollte 0,7 · tw nicht überschreiten.' },
      en: { was: 'The web thickness of an I, H or channel section. It limits the throat thickness of the web weld.',
            bereich: 'usually 3 to 20 mm.',
            tipp: 'For rolled sections the value is in the section tables (e.g. IPE 200: tw = 5.6 mm). The throat at the web should not exceed 0.7 · tw.' },
      pt: { was: 'A espessura da alma em perfis I, H ou U. Limita a garganta do cordão na alma.',
            bereich: 'normalmente 3 a 20 mm.',
            tipp: 'Em perfis laminados o valor consta das tabelas (p. ex. IPE 200: tw = 5,6 mm). A garganta na alma não deve exceder 0,7 · tw.' }
    },

    fld_tf: {
      de: { was: 'Die Dicke des Flansches beim I-, H- oder U-Profil. Sie begrenzt das a-Maß der Flanschnaht und bestimmt die freie Steghöhe h − 2·tf.',
            bereich: 'meist 4 bis 30 mm.',
            tipp: 'Der Flansch ist fast immer dicker als der Steg – deshalb sind am Flansch größere a-Maße möglich als am Steg.' },
      en: { was: 'The flange thickness of an I, H or channel section. It limits the throat of the flange weld and defines the clear web height h − 2·tf.',
            bereich: 'usually 4 to 30 mm.',
            tipp: 'The flange is almost always thicker than the web – so larger throats are possible at the flange than at the web.' },
      pt: { was: 'A espessura do banzo em perfis I, H ou U. Limita a garganta do cordão no banzo e define a altura livre da alma h − 2·tf.',
            bereich: 'normalmente 4 a 30 mm.',
            tipp: 'O banzo é quase sempre mais espesso que a alma – por isso admite gargantas maiores.' }
    },

    fld_r_ecke: {
      de: { was: 'Der Eckradius eines Rechteck-Hohlprofils. Er verkürzt die gerechnete Naht: der Bogen in der Ecke wird nicht mitgerechnet, weil dort keine saubere Kehlnaht mit dem angegebenen a-Maß entsteht.',
            bereich: '0 bei geschweißten Kästen, sonst etwa das 1,5- bis 2,5-fache der Wanddicke.',
            tipp: 'Im Zweifel den Wert aus der Profiltabelle nehmen. 0 einzutragen rechnet die Naht länger, als sie tragfähig ist – das ist die unsichere Seite.' },
      en: { was: 'The corner radius of a rectangular hollow section. It shortens the calculated weld: the corner arc is not counted, because no sound fillet weld with the stated throat forms there.',
            bereich: '0 for welded boxes, otherwise about 1.5 to 2.5 times the wall thickness.',
            tipp: 'If in doubt take the value from the section table. Entering 0 makes the weld longer than it is loadbearing – that is the unsafe side.' },
      pt: { was: 'O raio de canto de um perfil tubular retangular. Encurta o cordão calculado: o arco do canto não é contabilizado, pois aí não se forma um filete correto.',
            bereich: '0 em caixões soldados, caso contrário cerca de 1,5 a 2,5 vezes a espessura da parede.',
            tipp: 'Na dúvida use o valor da tabela do perfil. Introduzir 0 torna o cordão mais longo do que é resistente – é o lado inseguro.' }
    },

    fld_a_steg: {
      de: { was: 'Ein eigenes a-Maß für die Nähte am Steg. Bleibt das Feld leer, gilt das allgemeine a-Maß für alle Segmente.',
            bereich: 'meist 3 bis 6 mm, höchstens 0,7 · Stegdicke.',
            tipp: 'Der Steg ist dünner als der Flansch – deshalb wird dort in der Praxis oft ein kleineres a-Maß geschweißt. Nur dann dieses Feld nutzen.' },
      en: { was: 'A separate throat thickness for the web welds. If left empty the general throat applies to all segments.',
            bereich: 'usually 3 to 6 mm, at most 0.7 · web thickness.',
            tipp: 'The web is thinner than the flange – in practice a smaller throat is often welded there. Use this field only in that case.' },
      pt: { was: 'Uma garganta própria para os cordões na alma. Se ficar vazio aplica-se a garganta geral a todos os segmentos.',
            bereich: 'normalmente 3 a 6 mm, no máximo 0,7 · espessura da alma.',
            tipp: 'A alma é mais fina que o banzo – na prática solda-se aí muitas vezes uma garganta menor. Use este campo só nesse caso.' }
    },

    fld_a_flansch: {
      de: { was: 'Ein eigenes a-Maß für die Nähte am Flansch. Bleibt das Feld leer, gilt das allgemeine a-Maß für alle Segmente.',
            bereich: 'meist 4 bis 10 mm, höchstens 0,7 · Flanschdicke.',
            tipp: 'Am Flansch wird die Biegung abgetragen – dort lohnt sich ein größeres a-Maß mehr als am Steg.' },
      en: { was: 'A separate throat thickness for the flange welds. If left empty the general throat applies to all segments.',
            bereich: 'usually 4 to 10 mm, at most 0.7 · flange thickness.',
            tipp: 'The flange carries the bending – a larger throat pays off there more than at the web.' },
      pt: { was: 'Uma garganta própria para os cordões no banzo. Se ficar vazio aplica-se a garganta geral a todos os segmentos.',
            bereich: 'normalmente 4 a 10 mm, no máximo 0,7 · espessura do banzo.',
            tipp: 'O banzo absorve a flexão – aí uma garganta maior compensa mais do que na alma.' }
    },

    fld_N: {
      de: { was: 'Die Kraft senkrecht zur Anschlussfläche, also Zug oder Druck. Zug ist positiv.',
            bereich: 'je nach Anschluss einige kN bis mehrere hundert kN.',
            tipp: 'Im Stahlbau sind hier Bemessungslasten einzusetzen, also bereits mit den Teilsicherheitsbeiwerten der Einwirkungen versehen.' },
      en: { was: 'The force perpendicular to the connected face, i.e. tension or compression. Tension is positive.',
            bereich: 'from a few kN to several hundred kN depending on the joint.',
            tipp: 'In structural steelwork enter design loads, i.e. already factored actions.' },
      pt: { was: 'A força perpendicular à face ligada, ou seja, tração ou compressão. A tração é positiva.',
            bereich: 'de alguns kN a várias centenas de kN.',
            tipp: 'Na construção metálica introduzir cargas de dimensionamento, já majoradas.' }
    },

    fld_Q: {
      de: { was: 'Die Kraft parallel zur Anschlussfläche, die die Naht abscheren will.',
            bereich: 'wie die Normalkraft.',
            tipp: 'Bei einer Konsole ist die Auflagerkraft die Querkraft; sie erzeugt zusätzlich das Biegemoment über den Hebelarm.' },
      en: { was: 'The force parallel to the connected face, which tries to shear the weld.',
            bereich: 'as for the axial force.',
            tipp: 'For a bracket the support force is the shear force; via the lever arm it also creates the bending moment.' },
      pt: { was: 'A força paralela à face ligada, que tende a cortar a solda.',
            bereich: 'como o esforço normal.',
            tipp: 'Numa consola a reação é o esforço transverso; pelo braço gera também o momento fletor.' }
    },

    fld_M: {
      de: { was: 'Das Moment, das die Naht aufbiegen will. Es erzeugt am Rand des Nahtbilds die größten Spannungen.',
            bereich: 'einige zehn bis einige tausend Nm.',
            tipp: 'Bei einem Kragarm gilt M = Kraft · Hebelarm. Wer die Geometrie eingibt, muss das Moment nicht selbst rechnen.' },
      en: { was: 'The moment that tends to open the weld. It produces the largest stresses at the edge of the weld group.',
            bereich: 'tens to thousands of Nm.',
            tipp: 'For a cantilever M = force · lever arm. If you enter the geometry you need not compute it yourself.' },
      pt: { was: 'O momento que tende a abrir a solda. Produz as maiores tensões na extremidade do grupo de soldas.',
            bereich: 'de dezenas a milhares de Nm.',
            tipp: 'Numa consola M = força · braço. Se introduzir a geometria não precisa de o calcular.' }
    },

    fld_T: {
      de: { was: 'Das Moment um die Achse senkrecht zum Nahtbild. Es verdreht das Nahtbild in seiner Ebene.',
            bereich: 'einige zehn bis einige tausend Nm.',
            tipp: 'Typisch bei einem Rohr auf einer Platte oder bei außermittig angreifenden Kräften.' },
      en: { was: 'The moment about the axis perpendicular to the weld group. It twists the group in its own plane.',
            bereich: 'tens to thousands of Nm.',
            tipp: 'Typical for a tube on a plate or for eccentric loads.' },
      pt: { was: 'O momento em torno do eixo perpendicular ao grupo de soldas. Torce o grupo no seu plano.',
            bereich: 'de dezenas a milhares de Nm.',
            tipp: 'Típico num tubo sobre chapa ou em cargas excêntricas.' }
    },

    fld_F: {
      de: { was: 'Die angreifende Einzelkraft, wenn Sie den geometrischen Eingabeweg nutzen.',
            bereich: 'je nach Anwendung.',
            tipp: 'Zusammen mit dem Hebelarm entstehen daraus Querkraft und Biegemoment – beide werden im Rechenweg ausgewiesen.' },
      en: { was: 'The applied point load when you use the geometric input route.',
            bereich: 'depending on the application.',
            tipp: 'Together with the lever arm it produces shear force and bending moment – both are shown in the calculation steps.' },
      pt: { was: 'A força aplicada quando usa a entrada geométrica.',
            bereich: 'conforme a aplicação.',
            tipp: 'Com o braço origina esforço transverso e momento fletor – ambos surgem na memória de cálculo.' }
    },

    fld_e: {
      de: { was: 'Der Abstand vom Kraftangriffspunkt bis zum Schwerpunkt des Nahtbilds.',
            bereich: 'einige zehn bis einige hundert Millimeter.',
            tipp: 'Je größer der Hebelarm, desto stärker dominiert das Biegemoment gegenüber der Querkraft.' },
      en: { was: 'The distance from the point of load application to the centroid of the weld group.',
            bereich: 'tens to hundreds of millimetres.',
            tipp: 'The larger the lever arm, the more the bending moment dominates over the shear force.' },
      pt: { was: 'A distância do ponto de aplicação da carga ao centro de gravidade do grupo de soldas.',
            bereich: 'de dezenas a centenas de milímetros.',
            tipp: 'Quanto maior o braço, mais o momento fletor domina sobre o esforço transverso.' }
    },

    fld_gammaM2: {
      de: { was: 'Der Teilsicherheitsbeiwert für die Tragfähigkeit von Verbindungen. Er teilt die Festigkeit herunter.',
            bereich: 'national festgelegt, in Deutschland 1,25.',
            tipp: 'Nur ändern, wenn ein anderer Nationaler Anhang gilt. Der gewählte Wert erscheint im Rechenweg.' },
      en: { was: 'The partial factor for the resistance of joints. It divides down the strength.',
            bereich: 'nationally determined, 1.25 in Germany.',
            tipp: 'Change only if another National Annex applies. The chosen value appears in the calculation steps.' },
      pt: { was: 'O coeficiente parcial para a resistência das ligações. Divide a resistência.',
            bereich: 'definido nacionalmente, 1,25 na Alemanha.',
            tipp: 'Alterar apenas se vigorar outro Anexo Nacional. O valor escolhido consta da memória de cálculo.' }
    },

    fld_gammaMw: {
      de: { was: 'Der Teilsicherheitsbeiwert für Aluminium-Schweißverbindungen nach EN 1999-1-1.',
            bereich: 'empfohlen 1,25.',
            tipp: 'Nur bei abweichendem Nationalem Anhang ändern.' },
      en: { was: 'The partial factor for aluminium welded joints to EN 1999-1-1.',
            bereich: 'recommended 1.25.',
            tipp: 'Change only for a differing National Annex.' },
      pt: { was: 'O coeficiente parcial para ligações soldadas em alumínio seg. EN 1999-1-1.',
            bereich: 'recomendado 1,25.',
            tipp: 'Alterar apenas se o Anexo Nacional for diferente.' }
    },

    fld_betaW: {
      de: { was: 'Der Korrelationsbeiwert gleicht aus, dass festere Stähle nicht im gleichen Maß festere Nähte ergeben.',
            bereich: '0,80 bis 1,00 je Stahlsorte; 1,00 für alle nichtrostenden Stähle.',
            tipp: 'Der Wert wird automatisch aus Werkstoff und Regelsatz gesetzt. Aluminium kennt kein βw – dort gilt die Schweißgutfestigkeit fw.' },
      en: { was: 'The correlation factor compensates for the fact that stronger steels do not give proportionally stronger welds.',
            bereich: '0.80 to 1.00 depending on grade; 1.00 for all stainless steels.',
            tipp: 'The value is set automatically from material and rule set. Aluminium has no βw – there the weld metal strength fw applies.' },
      pt: { was: 'O coeficiente de correlação compensa o facto de aços mais resistentes não darem soldas proporcionalmente mais resistentes.',
            bereich: '0,80 a 1,00 conforme a qualidade; 1,00 para todos os inoxidáveis.',
            tipp: 'O valor é definido automaticamente. O alumínio não tem βw – aí vale a resistência do metal depositado fw.' }
    },

    fld_S: {
      de: { was: 'Der Sicherheitsbeiwert im klassischen Maschinenbau. Er teilt die Streckgrenze auf die zulässige Spannung herunter.',
            bereich: '1,3 bis 2,0 üblich; in der Literatur werden auch 2 bis 4 genannt.',
            tipp: 'Ständige Last 1,3, veränderliche Last 1,5. Bei unsicheren Lastannahmen höher wählen.' },
      en: { was: 'The safety factor in classic mechanical engineering. It divides the yield strength down to the allowable stress.',
            bereich: '1.3 to 2.0 usual; the literature also quotes 2 to 4.',
            tipp: 'Permanent load 1.3, variable load 1.5. Choose higher for uncertain load assumptions.' },
      pt: { was: 'O coeficiente de segurança na mecânica clássica. Divide a cedência para obter a tensão admissível.',
            bereich: '1,3 a 2,0 usual; a literatura refere também 2 a 4.',
            tipp: 'Carga permanente 1,3, carga variável 1,5. Escolher mais alto com hipóteses incertas.' }
    },

    fld_nu: {
      de: { was: 'Der Nahtgütefaktor mindert die zulässige Spannung je nach Nahtart und Prüfumfang.',
            bereich: '0,5 bis 1,0.',
            tipp: 'Durchgeschweißt und geprüft 1,0; durchgeschweißt ungeprüft 0,95 (bei S355 0,80); Kehlnähte deutlich darunter. Wo Tabellenwerte vorliegen, haben diese Vorrang.' },
      en: { was: 'The weld quality factor reduces the allowable stress depending on weld type and extent of testing.',
            bereich: '0.5 to 1.0.',
            tipp: 'Full penetration and tested 1.0; full penetration untested 0.95 (0.80 for S355); fillet welds clearly lower. Where tabulated values exist they take precedence.' },
      pt: { was: 'O fator de qualidade reduz a tensão admissível conforme o tipo de solda e o ensaio.',
            bereich: '0,5 a 1,0.',
            tipp: 'Penetração total e ensaiada 1,0; total sem ensaio 0,95 (0,80 em S355); filetes bastante abaixo. Havendo valores tabelados, estes prevalecem.' }
    },

    /* =============== Ergebnisgrößen des Nahtbilds (N2) =============== */

    gr_A: {
      de: { was: 'Die tragende Fläche aller Nähte zusammen: für jede Naht a-Maß mal Länge, alles addiert. Eine Zugkraft verteilt sich auf genau diese Fläche.',
            bereich: 'Je nach Bauteil einige hundert bis einige tausend mm².',
            tipp: 'Doppelt so viel Fläche heißt halb so viel Spannung. Wird die Naht zu knapp, ist mehr Länge meist billiger als mehr a-Maß.' },
      en: { was: 'The load-bearing area of all welds together: throat thickness times length for each weld, summed up. A tensile force is carried by exactly this area.',
            bereich: 'A few hundred to a few thousand mm², depending on the part.',
            tipp: 'Twice the area means half the stress. If the weld is tight, more length is usually cheaper than a larger throat.' },
      pt: { was: 'A área resistente de todos os cordões: garganta vezes comprimento de cada cordão, somado. Uma força de tração distribui-se exatamente por esta área.',
            bereich: 'De algumas centenas a alguns milhares de mm², conforme a peça.',
            tipp: 'O dobro da área significa metade da tensão. Se o cordão ficar justo, mais comprimento costuma ser mais barato que mais garganta.' }
    },

    gr_ys: {
      de: { was: 'Die waagerechte Lage des Schwerpunkts der Nahtfläche. Um diesen Punkt dreht sich alles: Biegung und Torsion werden immer auf ihn bezogen.',
            bereich: 'Liegt bei symmetrischen Nahtbildern in der Mitte, sonst zur nahtreicheren Seite verschoben.',
            tipp: 'Sitzt der Schwerpunkt weit außerhalb der Lastachse, entsteht ein zusätzliches Moment – das Nahtbild besser symmetrisch anlegen.' },
      en: { was: 'The horizontal position of the centroid of the weld area. Everything refers to this point: bending and torsion are always related to it.',
            bereich: 'At mid-width for symmetric weld groups, otherwise shifted towards the side with more weld.',
            tipp: 'If the centroid sits far off the load axis an additional moment appears – better arrange the weld group symmetrically.' },
      pt: { was: 'A posição horizontal do centroide da área de solda. Tudo se refere a este ponto: flexão e torção são sempre relacionadas com ele.',
            bereich: 'A meio nos grupos simétricos, caso contrário deslocado para o lado com mais solda.',
            tipp: 'Se o centroide ficar longe do eixo da carga surge um momento adicional – é melhor dispor o grupo de forma simétrica.' }
    },

    gr_zs: {
      de: { was: 'Die senkrechte Lage des Schwerpunkts der Nahtfläche – dieselbe Bedeutung wie ys, nur in Hochrichtung.',
            bereich: 'Bei symmetrischen Nahtbildern in halber Höhe.',
            tipp: 'Bei einseitig angeordneten Nähten wandert der Schwerpunkt – die Randabstände oben und unten werden dann ungleich.' },
      en: { was: 'The vertical position of the centroid of the weld area – same meaning as ys, but in the height direction.',
            bereich: 'At mid-height for symmetric weld groups.',
            tipp: 'With welds on one side only the centroid moves – the edge distances top and bottom then differ.' },
      pt: { was: 'A posição vertical do centroide da área de solda – o mesmo significado que ys, mas na direção da altura.',
            bereich: 'A meia altura nos grupos simétricos.',
            tipp: 'Com cordões só de um lado o centroide desloca-se – as distâncias ao bordo em cima e em baixo passam a ser diferentes.' }
    },

    gr_Iy: {
      de: { was: 'Das Flächenmoment um die waagerechte Achse. Es sagt, wie gut das Nahtbild ein Biegemoment um diese Achse aufnimmt.',
            bereich: 'Wächst mit der dritten Potenz der Höhe – hohe Nahtbilder sind sehr viel biegesteifer.',
            tipp: 'Nähte weit oben und weit unten bringen für die Biegung viel mehr als Nähte in der Mitte.' },
      en: { was: 'The second moment of area about the horizontal axis. It tells how well the weld group carries a bending moment about that axis.',
            bereich: 'Grows with the third power of the height – tall weld groups are far stiffer in bending.',
            tipp: 'Welds far top and bottom contribute much more to bending than welds near the middle.' },
      pt: { was: 'O momento de inércia em torno do eixo horizontal. Indica quão bem o grupo resiste a um momento fletor nesse eixo.',
            bereich: 'Cresce com a terceira potência da altura – grupos altos são muito mais rígidos à flexão.',
            tipp: 'Cordões bem acima e bem abaixo contribuem muito mais para a flexão do que cordões a meio.' }
    },

    gr_Iz: {
      de: { was: 'Das Flächenmoment um die senkrechte Achse – dieselbe Bedeutung wie Iy, nur für Biegung um die Hochachse.',
            bereich: 'Wächst mit der dritten Potenz der Breite bzw. mit dem Quadrat des Nahtabstands.',
            tipp: 'Zwei weit auseinanderliegende Nähte ergeben ein großes Iz, auch wenn jede einzelne Naht schmal ist.' },
      en: { was: 'The second moment of area about the vertical axis – same meaning as Iy, but for bending about the vertical axis.',
            bereich: 'Grows with the third power of the width, or with the square of the weld spacing.',
            tipp: 'Two widely spaced welds give a large Iz even if each single weld is narrow.' },
      pt: { was: 'O momento de inércia em torno do eixo vertical – o mesmo significado que Iy, mas para flexão nesse eixo.',
            bereich: 'Cresce com a terceira potência da largura ou com o quadrado do afastamento entre cordões.',
            tipp: 'Dois cordões muito afastados dão um Iz grande, mesmo que cada cordão seja estreito.' }
    },

    gr_Ip: {
      de: { was: 'Das polare Flächenmoment, die Summe aus Iy und Iz. Damit wird die Torsion gerechnet: das Drehmoment erzeugt Schub, der mit dem Abstand vom Schwerpunkt wächst.',
            bereich: 'Immer größer als Iy und Iz einzeln.',
            tipp: 'Bei offenen Nahtbildern ist dieser Weg nur eine Näherung – das Programm weist ausdrücklich darauf hin.' },
      en: { was: 'The polar second moment, the sum of Iy and Iz. Torsion is calculated with it: the torque produces shear that grows with the distance from the centroid.',
            bereich: 'Always larger than Iy or Iz alone.',
            tipp: 'For open weld groups this route is only an approximation – the program says so explicitly.' },
      pt: { was: 'O momento polar de inércia, a soma de Iy e Iz. Com ele calcula-se a torção: o momento torsor gera corte que cresce com a distância ao centroide.',
            bereich: 'Sempre maior do que Iy ou Iz isoladamente.',
            tipp: 'Em grupos abertos esta via é apenas uma aproximação – o programa avisa expressamente.' }
    },

    gr_Wy: {
      de: { was: 'Das Widerstandsmoment: Flächenmoment geteilt durch den größten Randabstand. Biegemoment durch Widerstandsmoment ergibt direkt die Randspannung.',
            bereich: 'Je größer, desto tragfähiger gegen Biegung.',
            tipp: 'Maßgebend ist immer der Rand mit dem größten Abstand – dort tritt die höchste Spannung auf.' },
      en: { was: 'The section modulus: second moment divided by the largest edge distance. Bending moment divided by section modulus gives the edge stress directly.',
            bereich: 'The larger the value, the higher the bending capacity.',
            tipp: 'The governing edge is always the one furthest away – that is where the highest stress occurs.' },
      pt: { was: 'O módulo de flexão: momento de inércia a dividir pela maior distância ao bordo. Momento fletor a dividir pelo módulo dá diretamente a tensão no bordo.',
            bereich: 'Quanto maior, maior a capacidade à flexão.',
            tipp: 'Determinante é sempre o bordo mais afastado – é aí que ocorre a tensão máxima.' }
    },

    gr_Wt: {
      de: { was: 'Das Torsionswiderstandsmoment: polares Flächenmoment geteilt durch den größten Abstand vom Schwerpunkt. Torsionsmoment geteilt durch diesen Wert ergibt den Schub am ungünstigsten Punkt.',
            bereich: 'Bei Rohren und geschlossenen Nahtbildern zuverlässig, bei offenen nur näherungsweise.',
            tipp: 'Runde, geschlossene Nahtbilder nehmen Torsion am besten auf – zwei parallele Flankennähte am schlechtesten.' },
      en: { was: 'The torsional section modulus: polar second moment divided by the largest distance from the centroid. Torque divided by this value gives the shear at the worst point.',
            bereich: 'Reliable for tubes and closed weld groups, approximate only for open ones.',
            tipp: 'Round, closed weld groups carry torsion best – two parallel side welds are the worst case.' },
      pt: { was: 'O módulo de torção: momento polar a dividir pela maior distância ao centroide. O momento torsor a dividir por este valor dá o corte no ponto mais desfavorável.',
            bereich: 'Fiável em tubos e grupos fechados, apenas aproximado em grupos abertos.',
            tipp: 'Grupos redondos e fechados resistem melhor à torção – dois cordões laterais paralelos são o pior caso.' }
    },

    /* =============== N3 · solver.js =============== */

    fld_an_C: {
      de: { was: 'Kohlenstoffgehalt aus dem Abnahmezeugnis (Schmelzenanalyse).',
            bereich: 'Baustähle 0,10 bis 0,22 %. Unter 0,18 % ist Pcm aussagekräftiger als CEV.',
            tipp: 'Steht im Werkszeugnis 3.1. Ohne Analyse tragen Sie unten das CET direkt ein.' },
      en: { was: 'Carbon content from the inspection certificate (ladle analysis).',
            bereich: 'Structural steels 0.10 to 0.22 %. Below 0.18 % Pcm is more meaningful than CEV.',
            tipp: 'It is stated in the 3.1 certificate. Without an analysis enter the CET directly below.' },
      pt: { was: 'Teor de carbono do certificado (análise de panela).',
            bereich: 'Aços de construção 0,10 a 0,22 %. Abaixo de 0,18 % o Pcm é mais significativo que o CEV.',
            tipp: 'Consta do certificado 3.1. Sem análise, indique o CET diretamente abaixo.' }
    },
    fld_an_Si: {
      de: { was: 'Siliziumgehalt. Geht nur in das Pcm ein, nicht in CET oder CEV.',
            bereich: 'Baustähle bis etwa 0,6 %.',
            tipp: 'Kann leer bleiben, wenn Sie nur mit CET rechnen.' },
      en: { was: 'Silicon content. Enters Pcm only, not CET or CEV.',
            bereich: 'Structural steels up to about 0.6 %.',
            tipp: 'May be left empty if you only work with CET.' },
      pt: { was: 'Teor de silício. Entra apenas no Pcm, não no CET nem no CEV.',
            bereich: 'Aços de construção até cerca de 0,6 %.',
            tipp: 'Pode ficar vazio se só usar o CET.' }
    },
    fld_an_Mn: {
      de: { was: 'Mangangehalt. Der stärkste Einzeleinfluss nach dem Kohlenstoff.',
            bereich: 'Baustähle 0,4 bis 1,7 %.',
            tipp: 'Steht im Werkszeugnis. Fehlt er, wird das CET zu niedrig.' },
      en: { was: 'Manganese content. The strongest single influence after carbon.',
            bereich: 'Structural steels 0.4 to 1.7 %.',
            tipp: 'Stated in the certificate. If missing, the CET comes out too low.' },
      pt: { was: 'Teor de manganês. A maior influência individual depois do carbono.',
            bereich: 'Aços de construção 0,4 a 1,7 %.',
            tipp: 'Consta do certificado. Se faltar, o CET fica baixo demais.' }
    },
    fld_an_Cr: {
      de: { was: 'Chromgehalt.',
            bereich: 'Unlegierte Baustähle unter 0,3 %.',
            tipp: 'Bei S235 bis S355 meist eine Spur; dann 0 eintragen oder leer lassen.' },
      en: { was: 'Chromium content.',
            bereich: 'Non-alloy structural steels below 0.3 %.',
            tipp: 'In S235 to S355 usually a trace; enter 0 or leave empty.' },
      pt: { was: 'Teor de crómio.',
            bereich: 'Aços não ligados abaixo de 0,3 %.',
            tipp: 'Em S235 a S355 normalmente vestigial; indique 0 ou deixe vazio.' }
    },
    fld_an_Mo: {
      de: { was: 'Molybdängehalt.',
            bereich: 'Unlegierte Baustähle unter 0,1 %.',
            tipp: 'Wie Chrom: bei einfachen Baustählen meist vernachlässigbar.' },
      en: { was: 'Molybdenum content.',
            bereich: 'Non-alloy structural steels below 0.1 %.',
            tipp: 'Like chromium: usually negligible in plain structural steels.' },
      pt: { was: 'Teor de molibdénio.',
            bereich: 'Aços não ligados abaixo de 0,1 %.',
            tipp: 'Como o crómio: normalmente desprezável em aços simples.' }
    },
    fld_an_V: {
      de: { was: 'Vanadiumgehalt. Geht in CEV und Pcm ein, nicht in CET.',
            bereich: 'Feinkornstähle bis etwa 0,2 %.',
            tipp: 'Nur bei Feinkornstählen von Bedeutung.' },
      en: { was: 'Vanadium content. Enters CEV and Pcm, not CET.',
            bereich: 'Fine-grain steels up to about 0.2 %.',
            tipp: 'Only relevant for fine-grain steels.' },
      pt: { was: 'Teor de vanádio. Entra no CEV e no Pcm, não no CET.',
            bereich: 'Aços de grão fino até cerca de 0,2 %.',
            tipp: 'Só relevante em aços de grão fino.' }
    },
    fld_an_Cu: {
      de: { was: 'Kupfergehalt.',
            bereich: 'Baustähle unter 0,55 %.',
            tipp: 'Meist eine Begleitspur aus dem Schrott.' },
      en: { was: 'Copper content.',
            bereich: 'Structural steels below 0.55 %.',
            tipp: 'Usually a trace carried over from scrap.' },
      pt: { was: 'Teor de cobre.',
            bereich: 'Aços de construção abaixo de 0,55 %.',
            tipp: 'Normalmente um vestígio proveniente da sucata.' }
    },
    fld_an_Ni: {
      de: { was: 'Nickelgehalt.',
            bereich: 'Unlegierte Baustähle unter 0,3 %, Feinkornstähle mehr.',
            tipp: 'Bei S460N kann Nickel spürbar zum CET beitragen.' },
      en: { was: 'Nickel content.',
            bereich: 'Non-alloy structural steels below 0.3 %, fine-grain steels more.',
            tipp: 'In S460N nickel can contribute noticeably to the CET.' },
      pt: { was: 'Teor de níquel.',
            bereich: 'Aços não ligados abaixo de 0,3 %, aços de grão fino mais.',
            tipp: 'Em S460N o níquel pode contribuir sensivelmente para o CET.' }
    },
    fld_drahtdm: {
      de: { was: 'Der Durchmesser des Schweißdrahts.',
            bereich: 'Übliche Durchmesser 0,8 · 1,0 · 1,2 · 1,6 mm. Er bestimmt beim MAG-Schweißen auch den Gasdurchfluss (Faustformel: Durchmesser × 10 l/min).',
            tipp: '1,2 mm ist der häufigste Draht im Stahlbau.' },
      en: { was: 'The diameter of the welding wire.',
            bereich: 'Common diameters 0.8 · 1.0 · 1.2 · 1.6 mm. In MAG welding it also sets the gas flow (rule of thumb: diameter × 10 l/min).',
            tipp: '1.2 mm is the most common wire in structural steelwork.' },
      pt: { was: 'O diâmetro do fio de soldadura.',
            bereich: 'Diâmetros usuais 0,8 · 1,0 · 1,2 · 1,6 mm. Em MAG define também o caudal de gás (regra: diâmetro × 10 l/min).',
            tipp: '1,2 mm é o fio mais comum na construção metálica.' }
    },
    fld_eta_quelle: {
      de: { was: 'Wie viel der aufgenommenen elektrischen Leistung am Lichtbogen ankommt.',
            bereich: 'Moderne Inverter etwa 0,85. Ältere Trafo- und Thyristorquellen liegen darunter.',
            tipp: '0,85 lassen, wenn Sie das Gerät nicht kennen. Der Wert beeinflusst nur den Stromverbrauch, nicht die Naht.' },
      en: { was: 'How much of the drawn electrical power reaches the arc.',
            bereich: 'Modern inverters about 0.85. Older transformer and thyristor sources are lower.',
            tipp: 'Leave it at 0.85 if you do not know the machine. It affects only the energy consumption, not the weld.' },
      pt: { was: 'Quanto da potência elétrica consumida chega ao arco.',
            bereich: 'Inversores modernos cerca de 0,85. Fontes antigas ficam abaixo.',
            tipp: 'Deixe 0,85 se não conhecer o equipamento. Afeta só o consumo, não o cordão.' }
    },
    fld_A_fuge: {
      de: { was: 'Die Querschnittsfläche der Naht, die mit Schweißgut gefüllt wird.',
            bereich: 'Bei einer Kehlnaht rechnet das Programm sie selbst: a². Bei Stumpfnähten hängt sie an Öffnungswinkel, Spalt und Steghöhe und wird geschätzt.',
            tipp: 'Nur eintragen, wenn Sie den Querschnitt aus der Zeichnung oder der Schweißanweisung kennen — dann wird nicht geschätzt.' },
      en: { was: 'The cross-sectional area of the weld that is filled with weld metal.',
            bereich: 'For a fillet weld the program computes it itself: a². For butt welds it depends on included angle, gap and root face and is estimated.',
            tipp: 'Enter it only if you know the section from the drawing or procedure — then nothing is estimated.' },
      pt: { was: 'A área da secção do cordão que é preenchida com metal depositado.',
            bereich: 'Num filete o programa calcula-a: a². Em juntas de topo depende do ângulo, folga e nariz, sendo estimada.',
            tipp: 'Indique-a só se a conhecer do desenho ou da especificação — então nada é estimado.' }
    },
    fld_ueberhoehung: {
      de: { was: 'Zuschlag auf den theoretischen Querschnitt, weil eine Naht nie exakt bündig abschließt.',
            bereich: 'Üblich rund 15 %. Bei Zwangslagen, Nacharbeit und vielen kurzen Nähten 20 % und mehr.',
            tipp: '15 % ist der Erfahrungswert für normale Werkstattbedingungen.' },
      en: { was: 'Allowance on the theoretical cross-section, because a weld never finishes exactly flush.',
            bereich: 'Usually about 15 %. Out-of-position work, rework and many short welds warrant 20 % and more.',
            tipp: '15 % is the practical value for normal shop conditions.' },
      pt: { was: 'Acréscimo sobre a secção teórica, porque um cordão nunca fica exatamente rente.',
            bereich: 'Habitualmente cerca de 15 %. Posições difíceis e cordões curtos justificam 20 % ou mais.',
            tipp: '15 % é o valor prático para condições normais de oficina.' }
    },
    fld_ausbringung: {
      de: { was: 'Wie viel vom eingesetzten Draht als Schweißgut in der Naht bleibt.',
            bereich: 'MAG Massivdraht 92–98 % · Fülldraht 80–90 % · Stabelektrode rund 65 % (Stummelverluste) · Unterpulver rund 99 %.',
            tipp: '95 % gilt für MAG mit Massivdraht. Bei Stabelektroden deutlich heruntersetzen.' },
      en: { was: 'How much of the wire used remains as weld metal in the joint.',
            bereich: 'MAG solid wire 92–98 % · flux-cored 80–90 % · stick electrode about 65 % (stub loss) · submerged arc about 99 %.',
            tipp: '95 % applies to MAG with solid wire. Reduce it considerably for stick electrodes.' },
      pt: { was: 'Quanto do fio usado permanece como metal depositado.',
            bereich: 'MAG fio maciço 92–98 % · fluxado 80–90 % · elétrodo revestido cerca de 65 % · arco submerso cerca de 99 %.',
            tipp: '95 % aplica-se a MAG com fio maciço. Reduza bastante para elétrodos revestidos.' }
    },
    fld_abschmelz: {
      de: { was: 'Wie viel Schweißgut je Stunde reiner Lichtbogenzeit abgeschmolzen wird.',
            bereich: 'E-Hand 0,4–2,5 · MAG Kurzlichtbogen 1–3 · MAG Sprühlichtbogen 3–6 · WIG 0,3–1 · Unterpulver 10–20 kg/h.',
            tipp: '3 kg/h entspricht MAG im Sprühlichtbogen. Der Wert bezieht sich auf 100 % Einschaltdauer.' },
      en: { was: 'How much weld metal is deposited per hour of pure arc time.',
            bereich: 'MMA 0.4–2.5 · MAG short arc 1–3 · MAG spray 3–6 · TIG 0.3–1 · submerged arc 10–20 kg/h.',
            tipp: '3 kg/h corresponds to MAG spray transfer. The figure refers to 100 % duty cycle.' },
      pt: { was: 'Quanto metal é depositado por hora de arco puro.',
            bereich: 'Elétrodo 0,4–2,5 · MAG curto 1–3 · MAG spray 3–6 · TIG 0,3–1 · arco submerso 10–20 kg/h.',
            tipp: '3 kg/h corresponde a MAG em spray. Refere-se a 100 % de fator de marcha.' }
    },
    fld_brennzeit: {
      de: { was: 'Der Anteil der reinen Lichtbogenzeit an der gesamten Arbeitszeit. Heften, Positionieren, Schlacke entfernen und Prüfen zählen nicht dazu.',
            bereich: 'Industriedurchschnitt rund 20 % · Einzelfertigung 20–35 % · getaktetes Fertigschweißen 40 % · mechanisiert 60–80 % · Unterpulver vollautomatisch nahe 100 %.',
            tipp: 'Das ist der größte Hebel auf die Kosten: Halbe Brennzeit bedeutet doppelte Gesamtzeit und damit doppelten Lohn.' },
      en: { was: 'The share of pure arc time in the total working time. Tacking, positioning, slag removal and inspection do not count.',
            bereich: 'Industry average about 20 % · one-off work 20–35 % · cycled finish welding 40 % · mechanised 60–80 % · submerged arc near 100 %.',
            tipp: 'This is the biggest lever on cost: half the arc-on time means double the total time and double the labour.' },
      pt: { was: 'A fração de tempo de arco puro no tempo total. Pingar, posicionar, remover escória e inspecionar não contam.',
            bereich: 'Média industrial cerca de 20 % · peça única 20–35 % · soldadura em ciclo 40 % · mecanizada 60–80 % · arco submerso perto de 100 %.',
            tipp: 'É a maior alavanca no custo: metade do tempo de arco duplica o tempo total e a mão de obra.' }
    },
    fld_gasfluss: {
      de: { was: 'Der eingestellte Schutzgasdurchfluss.',
            bereich: 'MAG Stahl: Drahtdurchmesser × 10 l/min · MIG Aluminium × 15 · WIG 6,5–9,5 l/min je nach Strom.',
            tipp: 'Leer lassen — das Programm rechnet ihn aus dem Drahtdurchmesser. Nur eintragen, wenn Sie am Gerät etwas anderes eingestellt haben.' },
      en: { was: 'The shielding gas flow rate set on the machine.',
            bereich: 'MAG steel: wire diameter × 10 l/min · MIG aluminium × 15 · TIG 6.5–9.5 l/min depending on current.',
            tipp: 'Leave it empty — the program derives it from the wire diameter. Enter it only if your machine is set differently.' },
      pt: { was: 'O caudal de gás de proteção regulado.',
            bereich: 'MAG aço: diâmetro × 10 l/min · MIG alumínio × 15 · TIG 6,5–9,5 l/min conforme a corrente.',
            tipp: 'Deixe vazio — o programa deriva-o do diâmetro. Indique só se o equipamento estiver regulado de outro modo.' }
    },
    fld_preis_lohn: {
      de: { was: 'Ihr Fertigungsstundensatz für den Schweißer, einschließlich Lohnnebenkosten.',
            bereich: 'Der vorbelegte Wert stammt aus einer Quelle von 2019 und ist inzwischen sicher zu niedrig.',
            tipp: 'Unbedingt durch Ihren eigenen Satz ersetzen. Der Lohn macht in der Regel rund 80 % der Schweißkosten aus.' },
      en: { was: 'Your shop hourly rate for the welder, including on-costs.',
            bereich: 'The preset comes from a 2019 source and is certainly too low by now.',
            tipp: 'Replace it with your own rate. Labour typically accounts for about 80 % of welding cost.' },
      pt: { was: 'O seu custo horário de fabrico do soldador, incluindo encargos.',
            bereich: 'O valor predefinido vem de uma fonte de 2019 e está certamente desatualizado.',
            tipp: 'Substitua pelo seu valor. A mão de obra representa tipicamente cerca de 80 % do custo.' }
    },
    fld_preis_draht: {
      de: { was: 'Der Preis je Kilogramm Schweißdraht.',
            bereich: 'Für diesen Preis ließ sich keine zweifach belegte Quelle finden — der vorbelegte Wert ist eine reine Annahme.',
            tipp: 'Aus Ihrer letzten Rechnung übernehmen. Der Drahtanteil liegt meist unter 10 % der Gesamtkosten.' },
      en: { was: 'The price per kilogram of welding wire.',
            bereich: 'No doubly sourced figure could be found for this price — the preset is a plain assumption.',
            tipp: 'Take it from your last invoice. Wire usually accounts for under 10 % of total cost.' },
      pt: { was: 'O preço por quilograma de fio.',
            bereich: 'Não foi possível encontrar fonte dupla para este preço — o valor é um mero pressuposto.',
            tipp: 'Retire-o da sua última fatura. O fio representa normalmente menos de 10 % do custo.' }
    },
    fld_preis_gas: {
      de: { was: 'Der Preis je Liter Schutzgas.',
            bereich: 'Herstellerannahme aus 2025. Flaschenpreise und Mietkosten schwanken stark und regional.',
            tipp: 'Aus Flaschenpreis geteilt durch Füllmenge rechnen. Reines Argon ist teurer als Mischgas, Helium deutlich teurer.' },
      en: { was: 'The price per litre of shielding gas.',
            bereich: 'Manufacturer assumption from 2025. Cylinder prices and rental vary strongly and regionally.',
            tipp: 'Derive it from cylinder price divided by content. Pure argon costs more than mixed gas, helium much more.' },
      pt: { was: 'O preço por litro de gás de proteção.',
            bereich: 'Pressuposto de fabricante de 2025. Preços de garrafa e aluguer variam muito e por região.',
            tipp: 'Calcule a partir do preço da garrafa a dividir pelo conteúdo. Árgon puro custa mais que mistura.' }
    },
    fld_preis_energie: {
      de: { was: 'Ihr Strompreis je Kilowattstunde.',
            bereich: 'Herstellerannahme aus 2025 für Industriestrom. Energiepreise sind besonders volatil.',
            tipp: 'Aus Ihrer Stromrechnung übernehmen. Der Energieanteil liegt meist bei ein bis zwei Prozent der Schweißkosten.' },
      en: { was: 'Your electricity price per kilowatt-hour.',
            bereich: 'Manufacturer assumption from 2025 for industrial power. Energy prices are especially volatile.',
            tipp: 'Take it from your electricity bill. Energy usually accounts for one to two percent of welding cost.' },
      pt: { was: 'O seu preço de eletricidade por quilowatt-hora.',
            bereich: 'Pressuposto de fabricante de 2025 para energia industrial. Muito volátil.',
            tipp: 'Retire-o da sua fatura. A energia representa normalmente um a dois por cento do custo.' }
    },
    fld_kosten_maschine: {
      de: { was: 'Abschreibung und Wartung der Schweißanlage, umgelegt auf diese Naht.',
            bereich: 'Kein allgemeiner Richtwert möglich — hängt an Anlage, Auslastung und Abschreibungsdauer.',
            tipp: 'Steht auf null. Das Programm kann diesen Betrag nicht herleiten; wer ihn kennt, trägt ihn ein.' },
      en: { was: 'Depreciation and maintenance of the welding equipment, apportioned to this weld.',
            bereich: 'No general guide value is possible — it depends on equipment, utilisation and depreciation period.',
            tipp: 'Stands at zero. The program cannot derive this amount; enter it if you know it.' },
      pt: { was: 'Amortização e manutenção do equipamento, imputadas a este cordão.',
            bereich: 'Não é possível um valor geral — depende do equipamento, utilização e amortização.',
            tipp: 'Está a zero. O programa não pode deduzir este montante; introduza-o se o conhecer.' }
    },
    fld_kosten_vorbereitung: {
      de: { was: 'Schneiden, Fasen, Reinigen und Heften vor dem Schweißen.',
            bereich: 'Kein allgemeiner Richtwert möglich — hängt an Fugenform, Blechdicke und Verfahren.',
            tipp: 'Steht auf null. Bei Stumpfnähten mit aufwändiger Fugenvorbereitung kann dieser Posten erheblich sein.' },
      en: { was: 'Cutting, bevelling, cleaning and tacking before welding.',
            bereich: 'No general guide value is possible — it depends on groove form, plate thickness and process.',
            tipp: 'Stands at zero. For butt welds with elaborate preparation this item can be substantial.' },
      pt: { was: 'Corte, chanfragem, limpeza e pingagem antes de soldar.',
            bereich: 'Não é possível um valor geral — depende do chanfro, espessura e processo.',
            tipp: 'Está a zero. Em juntas de topo com preparação elaborada pode ser considerável.' }
    },
    fld_kosten_vorwaermen: {
      de: { was: 'Energie und Zeit für das Vorwärmen des Bauteils.',
            bereich: 'Kein allgemeiner Richtwert möglich — hängt an Bauteilmasse, Zieltemperatur und Heizverfahren.',
            tipp: 'Steht auf null. Ob überhaupt vorgewärmt werden muss, sagt Ihnen der Bereich Vorwärmung und t8/5.' },
      en: { was: 'Energy and time for preheating the component.',
            bereich: 'No general guide value is possible — it depends on component mass, target temperature and heating method.',
            tipp: 'Stands at zero. Whether preheating is needed at all is answered by the Preheating & t8/5 section.' },
      pt: { was: 'Energia e tempo para pré-aquecer a peça.',
            bereich: 'Não é possível um valor geral — depende da massa, temperatura alvo e método.',
            tipp: 'Está a zero. Se é sequer necessário, di-lo a secção Pré-aquecimento e t8/5.' }
    },
    fld_kosten_nacharbeit: {
      de: { was: 'Schleifen, Richten und Ausbessern nach dem Schweißen.',
            bereich: 'Kein allgemeiner Richtwert möglich — hängt an Qualitätsanforderung und Ausführung.',
            tipp: 'Steht auf null. Bei hoher Bewertungsgruppe und sichtbaren Nähten deutlich mehr einplanen.' },
      en: { was: 'Grinding, straightening and repair after welding.',
            bereich: 'No general guide value is possible — it depends on quality requirement and workmanship.',
            tipp: 'Stands at zero. Allow considerably more for high quality levels and visible welds.' },
      pt: { was: 'Esmerilagem, endireitamento e reparação após soldar.',
            bereich: 'Não é possível um valor geral — depende do nível de qualidade e da execução.',
            tipp: 'Está a zero. Preveja bastante mais para níveis exigentes e cordões visíveis.' }
    },
    fld_kosten_pruefung: {
      de: { was: 'Sichtprüfung, Oberflächen- und Volumenprüfung.',
            bereich: 'Kein allgemeiner Richtwert möglich — hängt an Prüfumfang, Verfahren und Prüfstelle.',
            tipp: 'Steht auf null. Der Prüfumfang ergibt sich aus der Ausführungsklasse, nicht aus der Berechnung.' },
      en: { was: 'Visual, surface and volumetric inspection.',
            bereich: 'No general guide value is possible — it depends on scope, method and test house.',
            tipp: 'Stands at zero. The scope follows from the execution class, not from the calculation.' },
      pt: { was: 'Inspeção visual, superficial e volumétrica.',
            bereich: 'Não é possível um valor geral — depende do âmbito, método e entidade.',
            tipp: 'Está a zero. O âmbito decorre da classe de execução, não do cálculo.' }
    },
    fld_kosten_gemeinkosten: {
      de: { was: 'Zuschlag für Verwaltung, Raum, Werkzeug und alles, was nicht einzeln zugeordnet wird.',
            bereich: 'Kein allgemeiner Richtwert möglich — jeder Betrieb rechnet anders.',
            tipp: 'Steht auf null. Häufig als Prozentsatz auf Material und Fertigung gerechnet; hier als Betrag einzutragen.' },
      en: { was: 'Allowance for administration, premises, tooling and everything not directly attributable.',
            bereich: 'No general guide value is possible — every company calculates differently.',
            tipp: 'Stands at zero. Often computed as a percentage on material and production; enter it here as an amount.' },
      pt: { was: 'Acréscimo para administração, instalações, ferramenta e tudo o que não é imputado diretamente.',
            bereich: 'Não é possível um valor geral — cada empresa calcula de forma diferente.',
            tipp: 'Está a zero. Muitas vezes calculado em percentagem; aqui indica-se como montante.' }
    },
    fld_d_komb: {
      de: { was: 'Die Summe der Blechdicken, die im Nahtbereich zusammenlaufen. Normalerweise rechnet das Programm sie aus Stoßart und Blechdicken.',
            bereich: 'Methode B gilt von 10 bis 90 mm. Stumpfstoß zählt zwei Wege, T-Stoß drei, Kreuzstoß vier.',
            tipp: 'Nur eintragen, wenn das Gegenstück nicht im Modell steht – etwa ein Bolzen auf einer Grundplatte oder ein T-Stoß auf einem viel dickeren Fundament.' },
      en: { was: 'The sum of the plate thicknesses meeting at the weld. Normally the program computes it from the joint type and the plate thicknesses.',
            bereich: 'Method B is valid from 10 to 90 mm. A butt joint counts two paths, a T-joint three, a cruciform four.',
            tipp: 'Enter it only when the counterpart is not in the model – e.g. a pin on a base plate, or a T-joint on a much thicker foundation.' },
      pt: { was: 'A soma das espessuras que convergem no cordão. Normalmente o programa calcula-a a partir do tipo de junta e das espessuras.',
            bereich: 'O Método B é válido de 10 a 90 mm. Junta de topo conta dois caminhos, junta em T três, cruciforme quatro.',
            tipp: 'Indique-o só quando a contraparte não está no modelo – p. ex. uma cavilha sobre uma chapa base, ou uma junta em T sobre uma fundação bem mais espessa.' }
    },

    fld_CET: {
      de: { was: 'Das Kohlenstoffäquivalent, mit dem die Vorwärmung gerechnet wird. Normalerweise rechnet das Programm es aus der Analyse.',
            bereich: 'Methode B gilt von 0,20 bis 0,50 %.',
            tipp: 'Nur setzen, wenn das CET im Zeugnis steht oder Sie es aus anderer Quelle kennen. Sonst die Analyse oben ausfüllen.' },
      en: { was: 'The carbon equivalent used for the preheat calculation. Normally the program computes it from the analysis.',
            bereich: 'Method B is valid from 0.20 to 0.50 %.',
            tipp: 'Set it only if the CET is stated in the certificate or known from elsewhere. Otherwise fill in the analysis above.' },
      pt: { was: 'O carbono equivalente usado no cálculo do pré-aquecimento. Normalmente o programa calcula-o a partir da análise.',
            bereich: 'O Método B é válido de 0,20 a 0,50 %.',
            tipp: 'Indique-o só se constar do certificado ou for conhecido de outra fonte. Caso contrário preencha a análise acima.' }
    },
    fld_HD: {
      de: { was: 'Wasserstoffgehalt des Schweißguts. Wasserstoff ist die eigentliche Ursache der Kaltrisse.',
            bereich: 'Methode B gilt von 1 bis 20 ml/100 g. Basisch umhüllt und trocken: 3 bis 5. Rutil oder feucht: 10 bis 15.',
            tipp: 'Der Wert steht im Datenblatt des Zusatzwerkstoffs. 5 ml/100 g ist ein vernünftiger Ausgangspunkt für trockene basische Elektroden.' },
      en: { was: 'Hydrogen content of the weld metal. Hydrogen is the actual cause of cold cracks.',
            bereich: 'Method B is valid from 1 to 20 ml/100 g. Basic coated and dry: 3 to 5. Rutile or damp: 10 to 15.',
            tipp: 'The value is in the consumable data sheet. 5 ml/100 g is a sensible starting point for dry basic electrodes.' },
      pt: { was: 'Teor de hidrogénio do metal depositado. O hidrogénio é a verdadeira causa das fissuras a frio.',
            bereich: 'O Método B é válido de 1 a 20 ml/100 g. Básico e seco: 3 a 5. Rutilo ou húmido: 10 a 15.',
            tipp: 'O valor está na ficha do consumível. 5 ml/100 g é um ponto de partida razoável para elétrodos básicos secos.' }
    },
    fld_sp_U: {
      de: { was: 'Lichtbogenspannung beim Schweißen.',
            bereich: 'MAG 18 bis 32 V, WIG 10 bis 15 V, Lichtbogenhand 20 bis 26 V.',
            tipp: 'Ablesen am Gerät oder aus der Schweißanweisung übernehmen.' },
      en: { was: 'Arc voltage during welding.',
            bereich: 'MAG 18 to 32 V, TIG 10 to 15 V, MMA 20 to 26 V.',
            tipp: 'Read it from the machine or take it from the welding procedure.' },
      pt: { was: 'Tensão do arco durante a soldadura.',
            bereich: 'MAG 18 a 32 V, TIG 10 a 15 V, eléctrodo revestido 20 a 26 V.',
            tipp: 'Leia no equipamento ou retire da especificação.' }
    },
    fld_sp_I: {
      de: { was: 'Schweißstrom.',
            bereich: 'MAG 120 bis 350 A, WIG 60 bis 200 A, Lichtbogenhand 80 bis 250 A.',
            tipp: 'Ablesen am Gerät oder aus der Schweißanweisung übernehmen.' },
      en: { was: 'Welding current.',
            bereich: 'MAG 120 to 350 A, TIG 60 to 200 A, MMA 80 to 250 A.',
            tipp: 'Read it from the machine or take it from the welding procedure.' },
      pt: { was: 'Corrente de soldadura.',
            bereich: 'MAG 120 a 350 A, TIG 60 a 200 A, eléctrodo revestido 80 a 250 A.',
            tipp: 'Leia no equipamento ou retire da especificação.' }
    },
    fld_sp_v: {
      de: { was: 'Schweißgeschwindigkeit, also wie schnell der Brenner läuft.',
            bereich: 'MAG 3 bis 8 mm/s, entspricht 180 bis 480 mm/min.',
            tipp: 'Aus der Nahtlänge geteilt durch die Schweißzeit. Wer schneller schweißt, bringt weniger Wärme ein und kühlt schneller ab.' },
      en: { was: 'Travel speed, that is how fast the torch moves.',
            bereich: 'MAG 3 to 8 mm/s, i.e. 180 to 480 mm/min.',
            tipp: 'Weld length divided by welding time. Faster welding means less heat input and faster cooling.' },
      pt: { was: 'Velocidade de soldadura, ou seja, a rapidez do maçarico.',
            bereich: 'MAG 3 a 8 mm/s, isto é 180 a 480 mm/min.',
            tipp: 'Comprimento do cordão a dividir pelo tempo. Soldar mais depressa reduz o aporte e acelera o arrefecimento.' }
    },
    fld_T0: {
      de: { was: 'Die Temperatur des Bauteils beim Schweißen: Vorwärm- oder Zwischenlagentemperatur.',
            bereich: 'Ohne Vorwärmung 20 °C. Die Zwischenlagentemperatur soll 300 °C nicht übersteigen.',
            tipp: 'Leer lassen: dann rechnet das Programm mit der eigenen erforderlichen Vorwärmtemperatur, was der übliche Fall ist.' },
      en: { was: 'The component temperature during welding: preheat or interpass temperature.',
            bereich: 'Without preheating 20 °C. The interpass temperature should not exceed 300 °C.',
            tipp: 'Leave empty: the program then uses its own required preheat temperature, which is the usual case.' },
      pt: { was: 'A temperatura da peça durante a soldadura: pré-aquecimento ou entre passes.',
            bereich: 'Sem pré-aquecimento 20 °C. A temperatura entre passes não deve exceder 300 °C.',
            tipp: 'Deixe vazio: o programa usa então a sua própria temperatura de pré-aquecimento necessária.' }
    },
    fld_t85_min: {
      de: { was: 'Untere Grenze des angestrebten Zeitfensters. Zu schnelles Abkühlen härtet auf und begünstigt Kaltrisse.',
            bereich: 'Vorbelegt sind 10 s — die Überschneidung von TÜV SÜD (5 bis 20 s) und VdTÜV Wbl. 257 (10 bis 25 s).',
            tipp: 'Nur ändern, wenn Ihre Schweißanweisung oder das Herstellerdatenblatt etwas anderes vorgibt.' },
      en: { was: 'Lower bound of the intended time window. Cooling too fast hardens the material and promotes cold cracks.',
            bereich: 'Preset 10 s — the overlap of TÜV SÜD (5 to 20 s) and VdTÜV Wbl. 257 (10 to 25 s).',
            tipp: 'Change it only if your welding procedure or the maker’s data sheet says otherwise.' },
      pt: { was: 'Limite inferior da janela pretendida. Arrefecer depressa demais endurece e favorece fissuras a frio.',
            bereich: 'Predefinido 10 s — a sobreposição de TÜV SÜD (5 a 20 s) e VdTÜV Wbl. 257 (10 a 25 s).',
            tipp: 'Altere só se a sua especificação ou a ficha do fabricante indicar outra coisa.' }
    },
    fld_t85_max: {
      de: { was: 'Obere Grenze des angestrebten Zeitfensters. Zu langsames Abkühlen kostet Zähigkeit und Festigkeit.',
            bereich: 'Vorbelegt sind 20 s. Für unlegierte Baustähle führen unsere Quellen kein Fenster — dort bleibt die Bewertung aus.',
            tipp: 'Nur ändern, wenn Ihre Schweißanweisung oder das Herstellerdatenblatt etwas anderes vorgibt.' },
      en: { was: 'Upper bound of the intended time window. Cooling too slowly costs toughness and strength.',
            bereich: 'Preset 20 s. For non-alloy structural steels our sources give no window — there no assessment is made.',
            tipp: 'Change it only if your welding procedure or the maker’s data sheet says otherwise.' },
      pt: { was: 'Limite superior da janela pretendida. Arrefecer devagar demais custa tenacidade e resistência.',
            bereich: 'Predefinido 20 s. Para aços não ligados as fontes não indicam janela — aí não há avaliação.',
            tipp: 'Altere só se a sua especificação ou a ficha do fabricante indicar outra coisa.' }
    },
    fld_F2: {
      de: { was: 'Nahtfaktor für zweidimensionale Wärmeableitung, also dünne Bleche.',
            bereich: 'Auftragraupe 1,0 · Stumpfnaht 0,9 · Kehlnaht am Eckstoß 0,45 bis 0,67 · Kehlnaht am T-Stoß 0,67.',
            tipp: 'Voreinstellung 1,0. Bei Kehlnähten deutlich kleiner — dort fließt die Wärme in mehr Richtungen ab.' },
      en: { was: 'Joint factor for two-dimensional heat flow, i.e. thin plates.',
            bereich: 'Bead on plate 1.0 · butt weld 0.9 · fillet at corner joint 0.45 to 0.67 · fillet at T-joint 0.67.',
            tipp: 'Default 1.0. Considerably smaller for fillet welds — there the heat flows away in more directions.' },
      pt: { was: 'Fator de junta para fluxo bidimensional, ou seja, chapas finas.',
            bereich: 'Cordão sobre chapa 1,0 · topo 0,9 · filete em canto 0,45 a 0,67 · filete em T 0,67.',
            tipp: 'Predefinição 1,0. Bem menor em filetes — aí o calor escoa em mais direções.' }
    },
    fld_F3: {
      de: { was: 'Nahtfaktor für dreidimensionale Wärmeableitung, also dicke Bleche.',
            bereich: 'Auftragraupe 1,0 · Stumpfnaht 0,9 · Kehlnaht am Eckstoß 0,67 · Kehlnaht am T-Stoß 0,67 bis 0,9.',
            tipp: 'Voreinstellung 1,0. Wie F₂ bei Kehlnähten kleiner ansetzen.' },
      en: { was: 'Joint factor for three-dimensional heat flow, i.e. thick plates.',
            bereich: 'Bead on plate 1.0 · butt weld 0.9 · fillet at corner joint 0.67 · fillet at T-joint 0.67 to 0.9.',
            tipp: 'Default 1.0. Like F₂, use a smaller value for fillet welds.' },
      pt: { was: 'Fator de junta para fluxo tridimensional, ou seja, chapas espessas.',
            bereich: 'Cordão sobre chapa 1,0 · topo 0,9 · filete em canto 0,67 · filete em T 0,67 a 0,9.',
            tipp: 'Predefinição 1,0. Como o F₂, use valor menor em filetes.' }
    },
    grp_kraftrichtung: {
      de: { was: 'Wohin die Kraft zeigt, die Sie eingegeben haben. Daraus rechnet das Programm die Schnittgrößen an der Naht — die Richtung entscheidet, ob Zug, Querkraft oder Torsion entsteht.',
            bereich: 'Längs gibt Normalkraft und Biegung, quer gibt Querkraft und Biegung, Torsion gibt ein Torsionsmoment. Der Hebelarm wirkt in allen drei Fällen.',
            tipp: 'Bei einer Konsole oder einem Kragarm ist es fast immer quer: die Last hängt nach unten, die Naht steht senkrecht dazu.' },
      en: { was: 'Where the force you entered points. From this the program computes the section forces at the weld — the direction decides whether tension, shear or torsion arises.',
            bereich: 'Along gives axial force and bending, across gives shear and bending, torsion gives a torsional moment. The lever arm acts in all three cases.',
            tipp: 'For a bracket or cantilever it is almost always across: the load hangs downwards, the weld stands perpendicular to it.' },
      pt: { was: 'Para onde aponta a força que introduziu. A partir daí o programa calcula os esforços no cordão — a direção decide se surge tração, esforço transverso ou torção.',
            bereich: 'Longitudinal dá força axial e flexão, transversal dá esforço transverso e flexão, torção dá um momento torsor. O braço atua nos três casos.',
            tipp: 'Numa consola ou viga em balanço é quase sempre transversal: a carga desce e o cordão fica perpendicular.' }
    },

    grp_endkrater: {
      de: { was: 'Am Anfang und Ende einer offenen Naht ist die Schweißqualität schlechter – der Lichtbogen wird gezündet und wieder abgesetzt. Deshalb wird an jedem freien Ende die Länge a abgezogen, zusammen 2·a je Nahtzug.',
            bereich: 'Voreinstellung ist der Abzug. Bei umlaufenden Nähten gibt es keine freien Enden, dort ändert die Einstellung nichts.',
            tipp: 'Abziehen lassen. Ohne Abzug rechnet das Programm etwa 15 % günstiger – das ist nur dann richtig, wenn An- und Auslaufbleche verwendet und danach entfernt werden, oder wenn Sie ein Lehrbuchbeispiel nachrechnen, das ohne Abzug arbeitet.' },
      en: { was: 'At the start and end of an open weld the quality is poorer – the arc is struck and broken. The length a is therefore deducted at each free end, 2·a per weld run in total.',
            bereich: 'Deduction is the default. Continuous welds have no free ends, so the setting changes nothing there.',
            tipp: 'Leave the deduction on. Without it the program calculates about 15 % more favourably – correct only if run-on and run-off plates are used and removed afterwards, or when checking a textbook example that works without the deduction.' },
      pt: { was: 'No início e no fim de um cordão aberto a qualidade é pior – o arco é aberto e interrompido. Por isso deduz-se o comprimento a em cada extremidade livre, 2·a por cordão.',
            bereich: 'A dedução é a predefinição. Cordões contínuos não têm extremidades livres, aí a opção não altera nada.',
            tipp: 'Deixe a dedução ativa. Sem ela o programa calcula cerca de 15 % mais favoravelmente – só é correto com chapas de entrada e saída removidas depois, ou ao verificar um exemplo de livro que trabalha sem dedução.' }
    },

    grp_a_rundung: {
      de: { was: 'Auf welches Fertigungsmaß das errechnete a-Maß aufgerundet wird. Auf der Zeichnung steht a4 oder a5 – kein Schweißer stellt auf 4,37 mm ein.',
            bereich: 'Ganze Millimeter (Voreinstellung) oder halbe Millimeter. Es wird IMMER aufgerundet, nie ab.',
            tipp: 'Ganze Millimeter sind der Normalfall. Halbe Millimeter erst bei dünnen Blechen: bei t = 5 mm liegt a_max schon bei 3,5 mm, da ist ganzzahlig zu grob.' },
      en: { was: 'To which fabrication size the computed throat is rounded up. The drawing says a4 or a5 – no welder sets 4.37 mm.',
            bereich: 'Whole millimetres (default) or half millimetres. Always rounded UP, never down.',
            tipp: 'Whole millimetres are the normal case. Use half millimetres only for thin plate: at t = 5 mm a_max is already 3.5 mm, so whole steps are too coarse.' },
      pt: { was: 'Para que medida de fabrico a garganta calculada é arredondada. No desenho consta a4 ou a5 – nenhum soldador ajusta 4,37 mm.',
            bereich: 'Milímetros inteiros (predefinição) ou meios milímetros. Sempre arredondado PARA CIMA, nunca para baixo.',
            tipp: 'Milímetros inteiros são o caso normal. Meios milímetros só em chapa fina: com t = 5 mm, a_max já é 3,5 mm.' }
    },

    grp_weltb_nahtgruppe: {
      de: { was: 'Zeile der klassischen Tabelle der zulässigen Spannungen. Nur damit greift der Tabellenwert – sonst wird über die Formel gerechnet.',
            bereich: 'Fünf Zeilen, belegt für S235 und S355 in der Bewertungsgruppe B.',
            tipp: 'Wenn Sie die Zeile nicht sicher zuordnen können, lassen Sie das Feld leer: dann rechnet das Programm ehrlich über die Formel σ_zul = R_e / S · ν und sagt es Ihnen.' },
      en: { was: 'Row of the classic table of permissible stresses. Only with it does the table value apply – otherwise the formula is used.',
            bereich: 'Five rows, documented for S235 and S355 in quality level B.',
            tipp: 'If you cannot assign the row with confidence, leave it empty: the program then honestly uses the formula σ_perm = R_e / S · ν and tells you so.' },
      pt: { was: 'Linha da tabela clássica de tensões admissíveis. Só com ela o valor tabelado se aplica – caso contrário usa-se a fórmula.',
            bereich: 'Cinco linhas, documentadas para S235 e S355 no nível B.',
            tipp: 'Se não conseguir atribuir a linha com segurança, deixe vazio: o programa usa então a fórmula σ_adm = R_e / S · ν e informa-o.' }
    },

    fld_Qy: {
      de: { was: 'Querkraft in Richtung der waagerechten y-Achse, also seitlich am Nahtbild.',
            bereich: 'Frei, in Newton. Null lassen, wenn nur senkrecht belastet wird.',
            tipp: 'Die meisten Fälle brauchen nur Q_z. Q_y erst, wenn die Kraft schräg oder seitlich angreift.' },
      en: { was: 'Shear force along the horizontal y axis, i.e. sideways on the weld group.',
            bereich: 'Free, in newtons. Leave zero if the load acts vertically only.',
            tipp: 'Most cases need only Q_z. Use Q_y when the force acts sideways or at an angle.' },
      pt: { was: 'Esforço transverso na direção do eixo horizontal y, ou seja lateral ao grupo de solda.',
            bereich: 'Livre, em newtons. Deixe zero se a carga só atua na vertical.',
            tipp: 'A maioria dos casos só precisa de Q_z. Use Q_y quando a força atua lateral ou obliquamente.' }
    },

    fld_Qz: {
      de: { was: 'Querkraft in Richtung der senkrechten z-Achse – der übliche Fall bei Konsolen und Kragarmen.',
            bereich: 'Frei, in Newton.',
            tipp: 'Dies ist die Querkraft, die man normalerweise meint. Sie erzeugt Schub längs senkrechter Nähte.' },
      en: { was: 'Shear force along the vertical z axis – the usual case for brackets and cantilevers.',
            bereich: 'Free, in newtons.',
            tipp: 'This is the shear force normally meant. It produces shear along vertical welds.' },
      pt: { was: 'Esforço transverso na direção do eixo vertical z – o caso usual em consolas.',
            bereich: 'Livre, em newtons.',
            tipp: 'É o esforço transverso habitualmente referido. Produz corte ao longo de cordões verticais.' }
    },

    fld_My: {
      de: { was: 'Biegemoment um die waagerechte y-Achse – die starke Achse, der häufigste Biegefall.',
            bereich: 'Frei, in Newtonmeter.',
            tipp: 'Kraft mal Hebelarm. Wenn Sie den geometrischen Weg wählen, rechnet das Programm M_y selbst aus.' },
      en: { was: 'Bending moment about the horizontal y axis – the strong axis, the most common bending case.',
            bereich: 'Free, in newton metres.',
            tipp: 'Force times lever arm. If you choose the geometric input the program computes M_y itself.' },
      pt: { was: 'Momento fletor em torno do eixo horizontal y – o eixo forte, o caso mais comum.',
            bereich: 'Livre, em newton metro.',
            tipp: 'Força vezes braço. Na entrada geométrica o programa calcula M_y automaticamente.' }
    },

    fld_Mz: {
      de: { was: 'Biegemoment um die senkrechte z-Achse – die schwache Achse.',
            bereich: 'Frei, in Newtonmeter. Null lassen, wenn nur um die starke Achse gebogen wird.',
            tipp: 'Treten M_y und M_z gemeinsam auf, liegt zweiachsige Biegung vor. Das Programm rechnet das mit.' },
      en: { was: 'Bending moment about the vertical z axis – the weak axis.',
            bereich: 'Free, in newton metres. Leave zero for bending about the strong axis only.',
            tipp: 'If M_y and M_z occur together this is biaxial bending. The program covers it.' },
      pt: { was: 'Momento fletor em torno do eixo vertical z – o eixo fraco.',
            bereich: 'Livre, em newton metro. Deixe zero se só há flexão no eixo forte.',
            tipp: 'Se M_y e M_z ocorrem juntos há flexão biaxial. O programa considera-a.' }
    },

    fld_Re: {
      de: { was: 'Streckgrenze des Grundwerkstoffs für die Welt B. Wird aus der Werkstofftabelle vorbelegt und ist per Haken überschreibbar.',
            bereich: 'Typisch 215 bis 460 N/mm² bei Stahl.',
            tipp: 'Nur überschreiben, wenn Sie einen belegten Wert haben – zum Beispiel den alten Wert 240 N/mm² aus einem Lehrbuchbeispiel.' },
      en: { was: 'Yield strength of the base material for world B. Pre-filled from the material table and overridable via the tick box.',
            bereich: 'Typically 215 to 460 N/mm² for steel.',
            tipp: 'Override only with a documented value – for instance the legacy 240 N/mm² from a textbook example.' },
      pt: { was: 'Tensão de cedência do material base para o método B. Pré-preenchida da tabela e substituível pela opção de valor próprio.',
            bereich: 'Tipicamente 215 a 460 N/mm² em aço.',
            tipp: 'Substitua apenas com um valor documentado – por exemplo o antigo 240 N/mm² de um exemplo de manual.' }
    },

    /* ==================================================================== */
    /* N4 — Laien-ⓘ am Rechenweg                                            */
    /* ==================================================================== */

    rw_titel: {
      de: { was: 'Der Rechenweg zeigt Schritt für Schritt, wie das Ergebnis zustande kommt: die Formel im Klartext, dieselbe Formel mit den eingesetzten Zahlen, das Ergebnis und die Norm, aus der die Formel stammt.',
            bereich: 'Er ist immer vollständig – auch wenn der Nachweis nicht erfüllt ist.',
            tipp: 'Für eine Prüfung oder eine Freigabe drucken Sie den Rechenweg mit aus. Jeder Wert lässt sich damit von Hand nachvollziehen.' },
      en: { was: 'The calculation steps show how the result is obtained: the formula in plain text, the same formula with the actual figures, the result, and the standard the formula comes from.',
            bereich: 'It is always complete – even when the verification is not satisfied.',
            tipp: 'Print the calculation steps for a review or an approval. Every value can then be reproduced by hand.' },
      pt: { was: 'A memória de cálculo mostra passo a passo como se chega ao resultado: a fórmula em texto claro, a mesma fórmula com os números introduzidos, o resultado e a norma de onde vem a fórmula.',
            bereich: 'Está sempre completa – mesmo quando a verificação não é cumprida.',
            tipp: 'Imprima a memória de cálculo para uma revisão ou aprovação. Assim qualquer valor pode ser reproduzido à mão.' }
    },

    rw_s_umklappen: {
      de: { was: 'Eine Kehlnaht liegt schräg zur Anschlussfläche. Für den Nachweis wird sie rechnerisch in ihre schmalste Ebene geklappt – dort ist sie am schwächsten. Die quer wirkende Spannung teilt sich dabei zu gleichen Teilen auf eine Normal- und eine Schubspannung auf, jede mit dem Faktor 1/√2.',
            bereich: 'Gilt für Kehlnähte und teilweise durchgeschweißte Nähte. Eine durchgeschweißte Stumpfnaht wird nicht geklappt.',
            tipp: 'Das ist kein Rechentrick, sondern der Kern des Verfahrens nach EN 1993-1-8. Wer es weglässt, rechnet die Naht deutlich zu günstig.' },
      en: { was: 'A fillet weld sits at an angle to the connected face. For the verification it is rotated into its narrowest plane – where it is weakest. The transverse stress then splits equally into a normal and a shear component, each with the factor 1/√2.',
            bereich: 'Applies to fillet welds and partial-penetration welds. A full-penetration butt weld is not rotated.',
            tipp: 'This is not a calculation trick but the core of the method in EN 1993-1-8. Omitting it makes the weld look far stronger than it is.' },
      pt: { was: 'Uma solda de filete fica inclinada em relação à face ligada. Para a verificação é rodada para o seu plano mais estreito – onde é mais fraca. A tensão transversal divide-se então em partes iguais numa componente normal e numa de corte, cada uma com o fator 1/√2.',
            bereich: 'Aplica-se a soldas de filete e de penetração parcial. Uma solda de topo de penetração total não é rodada.',
            tipp: 'Não é um truque de cálculo mas o cerne do método da EN 1993-1-8. Omiti-lo faz a solda parecer muito mais resistente do que é.' }
    },

    rw_s_sigma_v: {
      de: { was: 'Die Vergleichsspannung fasst Normal- und Schubspannungen zu einer einzigen Zahl zusammen, die sich direkt mit der Grenzspannung vergleichen lässt. Die Schubanteile gehen dabei mit dem Faktor 3 ein.',
            bereich: 'Sie ist immer größer als jeder Einzelanteil.',
            tipp: 'Vergleichen Sie nie eine einzelne Spannung mit der Grenzspannung – maßgebend ist die Vergleichsspannung.' },
      en: { was: 'The equivalent stress combines normal and shear stresses into a single figure that can be compared directly with the design resistance. The shear terms enter with the factor 3.',
            bereich: 'It is always larger than any individual component.',
            tipp: 'Never compare a single stress component with the resistance – the equivalent stress governs.' },
      pt: { was: 'A tensão equivalente reúne tensões normais e de corte num único valor que pode ser comparado diretamente com a tensão resistente. Os termos de corte entram com o fator 3.',
            bereich: 'É sempre maior do que qualquer parcela isolada.',
            tipp: 'Nunca compare uma tensão isolada com a resistência – a tensão equivalente é que governa.' }
    },

    rw_s_widerstand: {
      de: { was: 'Die Grenzspannung ist der Wert, den die Naht höchstens aufnehmen darf. Sie entsteht aus der Werkstofffestigkeit, geteilt durch die Sicherheitsbeiwerte des jeweiligen Regelwerks.',
            bereich: 'Im Stahlbau meist 200 bis 450 N/mm², im klassischen Maschinenbau deutlich niedriger.',
            tipp: 'Die Zahl hängt am gewählten Regelwerk. Vergleichen Sie nie eine Grenzspannung aus Welt A mit einer aus Welt B.' },
      en: { was: 'The design resistance is the highest stress the weld may carry. It follows from the material strength divided by the safety factors of the respective code.',
            bereich: 'Typically 200 to 450 N/mm² in structural steelwork, considerably lower in classic mechanical engineering.',
            tipp: 'The figure depends on the code chosen. Never compare a resistance from world A with one from world B.' },
      pt: { was: 'A tensão resistente é o valor máximo que a solda pode suportar. Resulta da resistência do material dividida pelos coeficientes de segurança do respetivo regulamento.',
            bereich: 'Tipicamente 200 a 450 N/mm² na construção metálica, bastante menor na engenharia mecânica clássica.',
            tipp: 'O valor depende do regulamento escolhido. Nunca compare uma resistência do método A com uma do método B.' }
    },

    rw_s_ausnutzung: {
      de: { was: 'Der Ausnutzungsgrad sagt, wie viel der zulässigen Belastung tatsächlich ausgeschöpft ist. 1,00 bedeutet: genau an der Grenze. Über 1,00 ist der Nachweis nicht erfüllt.',
            bereich: '0 bis 1,00 zulässig; bis 0,90 grün, bis 1,00 gelb, darüber rot.',
            tipp: 'Zielen Sie nicht auf 0,99. Fertigungstoleranzen und Lastannahmen sind ungenauer, als die zweite Nachkommastelle suggeriert.' },
      en: { was: 'The utilisation states how much of the permissible load is actually used up. 1.00 means exactly at the limit. Above 1.00 the verification is not satisfied.',
            bereich: '0 to 1.00 admissible; up to 0.90 green, up to 1.00 amber, above that red.',
            tipp: 'Do not aim for 0.99. Fabrication tolerances and load assumptions are less precise than the second decimal place suggests.' },
      pt: { was: 'O grau de utilização indica quanto da carga admissível é realmente consumido. 1,00 significa exatamente no limite. Acima de 1,00 a verificação não é cumprida.',
            bereich: '0 a 1,00 admissível; até 0,90 verde, até 1,00 amarelo, acima disso vermelho.',
            tipp: 'Não aponte a 0,99. As tolerâncias de fabrico e as hipóteses de carga são menos precisas do que a segunda casa decimal sugere.' }
    },

    rw_s_a_gewaehlt: {
      de: { was: 'Das rechnerisch erforderliche a-Maß wird auf ein Fertigungsmaß aufgerundet – auf der Zeichnung steht a4 oder a5, nicht a4,37. Im Rechenweg stehen beide Zahlen nebeneinander.',
            bereich: 'Voreinstellung ganze Millimeter, umschaltbar auf halbe.',
            tipp: 'Nach dem Aufrunden wird noch einmal gegen a_max = 0,7 · t geprüft. Passt das gewählte Maß nicht mehr zur Blechdicke, erscheint eine Warnung – dann ist das Blech zu dünn, nicht die Naht zu klein.' },
      en: { was: 'The throat size required by calculation is rounded up to a fabrication size – a drawing states a4 or a5, not a4.37. Both figures appear side by side in the calculation steps.',
            bereich: 'Whole millimetres by default, switchable to half millimetres.',
            tipp: 'After rounding up, a_max = 0.7 · t is checked again. If the selected size no longer suits the plate thickness a warning appears – then the plate is too thin, not the weld too small.' },
      pt: { was: 'A garganta necessária por cálculo é arredondada para cima até uma medida de fabrico – num desenho consta a4 ou a5, não a4,37. Ambos os valores aparecem lado a lado na memória de cálculo.',
            bereich: 'Milímetros inteiros por defeito, comutável para meios milímetros.',
            tipp: 'Após o arredondamento verifica-se de novo a_max = 0,7 · t. Se a medida escolhida deixar de se adequar à espessura, surge um aviso – nesse caso a chapa é fina demais, não a solda pequena demais.' }
    },

    rw_s_kontrolle_gesamt: {
      de: { was: 'Der Rechenweg prüft sich selbst: fast jeder Schritt wird über einen zweiten, unabhängigen Rechenpfad nachgerechnet. Diese Zeile zählt, wie viele dieser Proben bestanden sind.',
            bereich: 'Erwartet wird immer die volle Zahl.',
            tipp: 'Wichtig zu unterscheiden: eine fehlende Rechenprobe wäre ein Programmfehler. Ein nicht erfüllter Nachweis dagegen bedeutet nur, dass die Naht so nicht trägt – beides wird getrennt ausgewiesen.' },
      en: { was: 'The calculation checks itself: nearly every step is recomputed via a second, independent path. This line counts how many of those cross-checks passed.',
            bereich: 'The full count is always expected.',
            tipp: 'An important distinction: a failed cross-check would be a program error. An unsatisfied verification merely means the weld does not carry as designed – the two are reported separately.' },
      pt: { was: 'A memória de cálculo verifica-se a si própria: quase todos os passos são recalculados por uma segunda via independente. Esta linha conta quantas dessas verificações passaram.',
            bereich: 'Espera-se sempre o número completo.',
            tipp: 'Distinção importante: uma verificação cruzada falhada seria um erro do programa. Uma verificação não cumprida significa apenas que a solda não resiste assim – ambos são indicados em separado.' }
    }
  };

  function h(key, lang, feld) {
    var e = H[key];
    if (!e) return '';
    var s = e[lang] || e.de;
    if (!s) return '';
    return s[feld] || '';
  }

  function has(key) { return Object.prototype.hasOwnProperty.call(H, key); }

  function keys() {
    var r = [];
    for (var k in H) if (Object.prototype.hasOwnProperty.call(H, k)) r.push(k);
    return r;
  }

  return { NAME: 'hilfe', VERSION: VERSION, SPRACHEN: SPRACHEN, FELDER: FELDER, dict: H, h: h, has: has, keys: keys };
}));
