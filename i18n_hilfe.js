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
            tipp: 'B ist die übliche Forderung bei dynamischer Beanspruchung. Für den Ermüdungsnachweis ist die Bewertungsgruppe wichtig, weil die Kerbfälle eine bestimmte Qualität voraussetzen.' },
      en: { was: 'The permitted size of imperfections such as undercut or porosity. An execution requirement, not a calculation quantity.',
            bereich: 'B (stringent), C (intermediate), D (moderate).',
            tipp: 'B is the usual requirement for dynamic loading. The quality level matters for fatigue because detail categories presuppose a given quality.' },
      pt: { was: 'A dimensão admissível de imperfeições como mordeduras ou poros. É um requisito de execução, não uma grandeza de cálculo.',
            bereich: 'B (exigente), C (intermédio), D (moderado).',
            tipp: 'B é o requisito usual em carga dinâmica. O nível importa para a fadiga, pois as categorias de detalhe pressupõem uma dada qualidade.' }
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
            tipp: 'Sind beide Bleche gleich dick, hier denselben Wert eintragen.' },
      en: { was: 'Thickness of the second connected part. The weaker part always governs the strength.',
            bereich: '4 to 80 mm.',
            tipp: 'If both plates are equal, enter the same value here.' },
      pt: { was: 'Espessura da segunda peça ligada. A peça mais fraca é sempre determinante.',
            bereich: '4 a 80 mm.',
            tipp: 'Se as chapas forem iguais, introduza o mesmo valor.' }
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

  return { NAME: 'hilfe', SPRACHEN: SPRACHEN, FELDER: FELDER, dict: H, h: h, has: has, keys: keys };
}));
