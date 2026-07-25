/* ============================================================================
 * DT-ProfiSchweissnaht · i18n_kern.js  (DTNI18nKern)
 * Baustein N1 — Bedienung, Gruppen, Optionen, Felder, Einheiten, Meldungen,
 *               Rechenweg-Beschriftungen, Luecken-Texte.
 * EIN Schluessel, DREI Sprachen nebeneinander -> Paritaet baulich erzwungen.
 * Logik verwendet ausschliesslich sprachneutrale Codes.
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNI18nKern = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SPRACHEN = ['de', 'en', 'pt'];

  var D = {

    /* ---------- Marke / Rahmen ---------- */
    appName:      { de: 'DT-ProfiSchweissnaht', en: 'DT-ProfiSchweissnaht', pt: 'DT-ProfiSchweissnaht' },
    tagline:      { de: 'Schweissnahtberechnung – Stahlbau und Maschinenbau',
                    en: 'Weld design – structural and mechanical engineering',
                    pt: 'Cálculo de soldas – construção metálica e engenharia mecânica' },
    editionFull:  { de: 'Vollversion · lizenziert für', en: 'Full version · licensed to', pt: 'Versão completa · licenciada a' },
    editionTest:  { de: 'Testversion – alle Ausgaben gesperrt', en: 'Trial version – all outputs locked', pt: 'Versão de teste – todas as saídas bloqueadas' },
    disclaimer:   { de: 'Berechnung ohne Gewähr, vor Produktivnutzung gegen die Originalnormen prüfen.',
                    en: 'Calculation without warranty; verify against the original standards before productive use.',
                    pt: 'Cálculo sem garantia; verificar face às normas originais antes de uso produtivo.' },

    /* ---------- Bedienung ---------- */
    calc:         { de: 'Berechnen', en: 'Calculate', pt: 'Calcular' },
    reset:        { de: 'Leeren', en: 'Clear', pt: 'Limpar' },
    loadExample:  { de: 'Beispiel laden', en: 'Load example', pt: 'Carregar exemplo' },
    assistant:    { de: 'Assistent starten', en: 'Start assistant', pt: 'Iniciar assistente' },
    ownValue:     { de: 'eigener Wert', en: 'own value', pt: 'valor próprio' },
    inputTitle:   { de: 'Eingabe', en: 'Input', pt: 'Entrada' },
    resultTitle:  { de: 'Ergebnis', en: 'Result', pt: 'Resultado' },
    pathTitle:    { de: 'Rechenweg', en: 'Calculation steps', pt: 'Memória de cálculo' },
    outSave:      { de: 'Speichern (.dts)', en: 'Save (.dts)', pt: 'Guardar (.dts)' },
    outLoad:      { de: 'Öffnen (.dts)', en: 'Open (.dts)', pt: 'Abrir (.dts)' },
    outPrint:     { de: 'Drucken / PDF', en: 'Print / PDF', pt: 'Imprimir / PDF' },
    outRtf:       { de: 'Word (.rtf)', en: 'Word (.rtf)', pt: 'Word (.rtf)' },
    outDesign:    { de: 'Bezeichnung (optional)', en: 'Label (optional)', pt: 'Designação (opcional)' },
    themeTitle:   { de: 'Hell / Dunkel', en: 'Light / dark', pt: 'Claro / escuro' },
    infoTitle:    { de: 'Info', en: 'Info', pt: 'Informação' },
    source:       { de: 'Quelle', en: 'Source', pt: 'Fonte' },
    sources:      { de: 'Quellen', en: 'Sources', pt: 'Fontes' },
    gap:          { de: 'Lücke', en: 'Gap', pt: 'Lacuna' },
    note:         { de: 'Hinweis', en: 'Note', pt: 'Nota' },
    estimate:     { de: 'Abschätzung / Richtwert', en: 'Estimate / guide value', pt: 'Estimativa / valor indicativo' },

    /* ---------- Gruppen (Abfragen) ---------- */
    grp_welt:              { de: 'Bemessungswelt', en: 'Design world', pt: 'Método de dimensionamento' },
    grp_rechenrichtung:    { de: 'Rechenrichtung', en: 'Calculation direction', pt: 'Direção do cálculo' },
    grp_werkstoffgruppe:   { de: 'Werkstoffgruppe', en: 'Material group', pt: 'Grupo de material' },
    grp_werkstoff:         { de: 'Werkstoff', en: 'Material', pt: 'Material' },
    grp_zustand:           { de: 'Werkstoffzustand', en: 'Temper / condition', pt: 'Estado / têmpera' },
    grp_zusatzwerkstoff:   { de: 'Zusatzwerkstoff', en: 'Filler metal', pt: 'Metal de adição' },
    grp_bw_regelsatz:      { de: 'Regelsatz für βw', en: 'Rule set for βw', pt: 'Conjunto de regras para βw' },
    grp_nachweisverfahren: { de: 'Nachweisverfahren', en: 'Verification method', pt: 'Método de verificação' },
    grp_stossart:          { de: 'Stoßart', en: 'Joint type', pt: 'Tipo de junta' },
    grp_nahtart:           { de: 'Nahtart', en: 'Weld type', pt: 'Tipo de solda' },
    grp_nahtguete:         { de: 'Nahtgüte', en: 'Weld quality class', pt: 'Qualidade da solda' },
    grp_lastfall:          { de: 'Lastfall', en: 'Load case', pt: 'Caso de carga' },
    grp_profil:            { de: 'Profil', en: 'Section', pt: 'Perfil' },
    grp_kanten:            { de: 'Geschweißte Kanten', en: 'Welded edges', pt: 'Arestas soldadas' },
    grp_lasteingabe:       { de: 'Lasteingabe', en: 'Load input', pt: 'Entrada de cargas' },
    grp_schweissverfahren: { de: 'Schweißverfahren', en: 'Welding process', pt: 'Processo de soldadura' },
    grp_iso5817:           { de: 'Bewertungsgruppe (ISO 5817)', en: 'Quality level (ISO 5817)', pt: 'Nível de qualidade (ISO 5817)' },
    grp_exc:               { de: 'Ausführungsklasse (EN 1090)', en: 'Execution class (EN 1090)', pt: 'Classe de execução (EN 1090)' },

    /* ---------- Optionen ---------- */
    opt_welt_A: { de: 'Stahlbau nach EN 1993-1-8', en: 'Structural steelwork to EN 1993-1-8', pt: 'Construção metálica seg. EN 1993-1-8' },
    opt_welt_B: { de: 'Maschinenbau, klassisch (zulässige Spannungen)', en: 'Mechanical engineering, classic (allowable stresses)', pt: 'Engenharia mecânica, clássico (tensões admissíveis)' },

    opt_rechenrichtung_nachweis:  { de: 'Nachweis (a-Maß gegeben)', en: 'Verification (throat given)', pt: 'Verificação (garganta dada)' },
    opt_rechenrichtung_auslegung: { de: 'Auslegung (a-Maß gesucht)', en: 'Design (throat sought)', pt: 'Dimensionamento (garganta procurada)' },

    opt_werkstoffgruppe_stahl:     { de: 'Baustahl', en: 'Structural steel', pt: 'Aço estrutural' },
    opt_werkstoffgruppe_edelstahl: { de: 'Nichtrostender Stahl', en: 'Stainless steel', pt: 'Aço inoxidável' },
    opt_werkstoffgruppe_alu:       { de: 'Aluminium', en: 'Aluminium', pt: 'Alumínio' },

    opt_werkstoff_S235:   { de: 'S235 (EN 10025-2)', en: 'S235 (EN 10025-2)', pt: 'S235 (EN 10025-2)' },
    opt_werkstoff_S275:   { de: 'S275 (EN 10025-2)', en: 'S275 (EN 10025-2)', pt: 'S275 (EN 10025-2)' },
    opt_werkstoff_S355:   { de: 'S355 (EN 10025-2)', en: 'S355 (EN 10025-2)', pt: 'S355 (EN 10025-2)' },
    opt_werkstoff_S420:   { de: 'S420 (N/M)', en: 'S420 (N/M)', pt: 'S420 (N/M)' },
    opt_werkstoff_S460:   { de: 'S460 (N/M/Q)', en: 'S460 (N/M/Q)', pt: 'S460 (N/M/Q)' },
    'opt_werkstoff_1.4301': { de: '1.4301 (304)', en: '1.4301 (304)', pt: '1.4301 (304)' },
    'opt_werkstoff_1.4404': { de: '1.4404 (316L)', en: '1.4404 (316L)', pt: '1.4404 (316L)' },
    'opt_werkstoff_1.4571': { de: '1.4571 (316Ti)', en: '1.4571 (316Ti)', pt: '1.4571 (316Ti)' },
    opt_werkstoff_AW5083: { de: 'EN AW-5083 (AlMg4,5Mn)', en: 'EN AW-5083 (AlMg4.5Mn)', pt: 'EN AW-5083 (AlMg4,5Mn)' },
    opt_werkstoff_AW6060: { de: 'EN AW-6060 (AlMgSi)', en: 'EN AW-6060 (AlMgSi)', pt: 'EN AW-6060 (AlMgSi)' },
    opt_werkstoff_AW6082: { de: 'EN AW-6082 (AlSi1MgMn)', en: 'EN AW-6082 (AlSi1MgMn)', pt: 'EN AW-6082 (AlSi1MgMn)' },

    opt_zustand_O_H111:    { de: 'O / H111 – weich, Blech', en: 'O / H111 – annealed, sheet', pt: 'O / H111 – recozido, chapa' },
    opt_zustand_F_H112:    { de: 'F / H112 – Strangpressprofil', en: 'F / H112 – extrusion', pt: 'F / H112 – extrudido' },
    opt_zustand_H24_H34:   { de: 'H24 / H34 – kaltverfestigt', en: 'H24 / H34 – strain hardened', pt: 'H24 / H34 – encruado' },
    opt_zustand_T6:        { de: 'T6 – warmausgelagert', en: 'T6 – artificially aged', pt: 'T6 – envelhecido artificialmente' },
    opt_zustand_T6_strang: { de: 'T6 – Strangpressprofil', en: 'T6 – extrusion', pt: 'T6 – extrudido' },
    opt_zustand_T4:        { de: 'T4 – kaltausgelagert', en: 'T4 – naturally aged', pt: 'T4 – envelhecido naturalmente' },

    opt_zusatzwerkstoff_5356:  { de: '5356 (AlMg5)', en: '5356 (AlMg5)', pt: '5356 (AlMg5)' },
    opt_zusatzwerkstoff_4043A: { de: '4043A (AlSi5)', en: '4043A (AlSi5)', pt: '4043A (AlSi5)' },

    opt_bw_regelsatz_na_de:   { de: 'Deutscher NA (S420 = 0,88 · S460 = 0,85)', en: 'German NA (S420 = 0.88 · S460 = 0.85)', pt: 'Anexo Nacional alemão (S420 = 0,88 · S460 = 0,85)' },
    opt_bw_regelsatz_cen2005: { de: 'CEN-Fassung 2005 (S420 = S460 = 1,0)', en: 'CEN edition 2005 (S420 = S460 = 1.0)', pt: 'Versão CEN 2005 (S420 = S460 = 1,0)' },

    opt_nachweisverfahren_richtungsbezogen: { de: 'Richtungsbezogenes Verfahren', en: 'Directional method', pt: 'Método direcional' },
    opt_nachweisverfahren_vereinfacht:      { de: 'Vereinfachtes Verfahren', en: 'Simplified method', pt: 'Método simplificado' },

    opt_stossart_stumpfstoss:   { de: 'Stumpfstoß', en: 'Butt joint', pt: 'Junta de topo' },
    opt_stossart_t_stoss:       { de: 'T-Stoß', en: 'T-joint', pt: 'Junta em T' },
    opt_stossart_kreuzstoss:    { de: 'Kreuzstoß', en: 'Cruciform joint', pt: 'Junta cruciforme' },
    opt_stossart_eckstoss:      { de: 'Eckstoß', en: 'Corner joint', pt: 'Junta de canto' },
    opt_stossart_ueberlappstoss:{ de: 'Überlappstoß', en: 'Lap joint', pt: 'Junta sobreposta' },

    opt_nahtart_kehl_einseitig: { de: 'Kehlnaht, einseitig', en: 'Fillet weld, single-sided', pt: 'Solda de filete, unilateral' },
    opt_nahtart_kehl_doppel:    { de: 'Kehlnaht, doppelseitig', en: 'Fillet weld, double-sided', pt: 'Solda de filete, bilateral' },
    opt_nahtart_kehl_flanke:    { de: 'Flankenkehlnaht', en: 'Side fillet weld', pt: 'Filete lateral' },
    opt_nahtart_kehl_stirn:     { de: 'Stirnkehlnaht', en: 'End fillet weld', pt: 'Filete frontal' },
    opt_nahtart_kehl_umlaufend: { de: 'Umlaufende Kehlnaht', en: 'All-round fillet weld', pt: 'Filete perimetral' },
    opt_nahtart_stumpf_i:       { de: 'I-Naht (Stumpfnaht)', en: 'Square butt weld', pt: 'Solda de topo reta (I)' },
    opt_nahtart_stumpf_v:       { de: 'V-Naht', en: 'Single-V butt weld', pt: 'Solda em V' },
    opt_nahtart_stumpf_dv:      { de: 'DV-Naht (X-Naht)', en: 'Double-V (X) butt weld', pt: 'Solda em X (duplo V)' },
    opt_nahtart_stumpf_hv:      { de: 'HV-Naht (halb-V)', en: 'Single-bevel butt weld', pt: 'Solda em meio V' },
    opt_nahtart_stumpf_dhv:     { de: 'DHV-Naht (K-Naht)', en: 'Double-bevel (K) butt weld', pt: 'Solda em K (duplo meio V)' },
    opt_nahtart_stumpf_hy:      { de: 'HY-Naht', en: 'Single-J butt weld', pt: 'Solda em meio Y' },
    opt_nahtart_stumpf_dhy:     { de: 'DHY-Naht', en: 'Double-J butt weld', pt: 'Solda em duplo meio Y' },

    opt_nahtguete_durchgeschweisst_zug_geprueft:   { de: 'Durchgeschweißt, Zug nachgewiesen', en: 'Full penetration, tension verified', pt: 'Totalmente penetrada, tração comprovada' },
    opt_nahtguete_durchgeschweisst_zug_ungeprueft: { de: 'Durchgeschweißt, Zug nicht nachgewiesen', en: 'Full penetration, tension not verified', pt: 'Totalmente penetrada, tração não comprovada' },
    opt_nahtguete_durchgeschweisst_druck:          { de: 'Durchgeschweißt, nur Druck', en: 'Full penetration, compression only', pt: 'Totalmente penetrada, só compressão' },
    opt_nahtguete_kehlnaht_allgemein:              { de: 'Kehlnaht / nicht durchgeschweißt', en: 'Fillet / partial penetration', pt: 'Filete / penetração parcial' },

    opt_lastfall_ruhend:     { de: 'ruhend (R = 1)', en: 'static (R = 1)', pt: 'estático (R = 1)' },
    opt_lastfall_schwellend: { de: 'schwellend (R = 0)', en: 'pulsating (R = 0)', pt: 'pulsante (R = 0)' },
    opt_lastfall_wechselnd:  { de: 'wechselnd (R = −1)', en: 'alternating (R = −1)', pt: 'alternado (R = −1)' },

    /* Profile (N2b) — parametrisch, Stufe 1 nach 2.2b */
    opt_profil_blech:         { de: 'Blech / Flachstahl', en: 'Plate / flat bar', pt: 'Chapa / barra chata' },
    opt_profil_rohr_rechteck: { de: 'Rechteck-/Quadrat-Hohlprofil', en: 'Rectangular / square hollow section', pt: 'Perfil tubular retangular / quadrado' },
    opt_profil_rohr_rund:     { de: 'Rundrohr', en: 'Circular hollow section', pt: 'Tubo circular' },
    opt_profil_i_profil:      { de: 'I-/H-Profil', en: 'I / H section', pt: 'Perfil I / H' },
    opt_profil_u_profil:      { de: 'U-Profil', en: 'Channel section', pt: 'Perfil U' },
    opt_profil_winkel:        { de: 'Winkel', en: 'Angle section', pt: 'Cantoneira' },
    opt_profil_vollrund:      { de: 'Vollrund (Bolzen, Welle)', en: 'Solid round bar (pin, shaft)', pt: 'Barra redonda maciça (perno, veio)' },

    /* Kantenauswahl (N2b) — die Frage, die ueber die Nahtlaenge entscheidet */
    opt_kanten_rundum:        { de: 'Rundum geschweißt', en: 'Welded all round', pt: 'Soldado em todo o contorno' },
    opt_kanten_flanken:       { de: 'Nur die beiden Flanken (Länge b)', en: 'Side welds only (length b)', pt: 'Apenas os cordões laterais (comprimento b)' },
    opt_kanten_stirn:         { de: 'Nur die beiden Stirnseiten (Länge h)', en: 'End welds only (length h)', pt: 'Apenas as extremidades (comprimento h)' },
    opt_kanten_eine_flanke:   { de: 'Nur eine Flanke (einseitig)', en: 'One side only (single-sided)', pt: 'Apenas um lado (unilateral)' },
    opt_kanten_flansche:      { de: 'Nur die Flansche', en: 'Flanges only', pt: 'Apenas os banzos' },
    opt_kanten_steg:          { de: 'Nur der Steg', en: 'Web only', pt: 'Apenas a alma' },
    opt_kanten_flansche_steg: { de: 'Flansche und Steg (einzeln geschweißt)', en: 'Flanges and web (welded separately)', pt: 'Banzos e alma (soldados separadamente)' },

    opt_lasteingabe_direkt:      { de: 'Schnittgrößen direkt eingeben', en: 'Enter internal forces directly', pt: 'Introduzir esforços diretamente' },
    opt_lasteingabe_geometrisch: { de: 'Kraft + Geometrie (Hebelarm)', en: 'Force + geometry (lever arm)', pt: 'Força + geometria (braço)' },

    opt_schweissverfahren_mag:   { de: 'MAG (135)', en: 'MAG (135)', pt: 'MAG (135)' },
    opt_schweissverfahren_mig:   { de: 'MIG (131)', en: 'MIG (131)', pt: 'MIG (131)' },
    opt_schweissverfahren_wig:   { de: 'WIG (141)', en: 'TIG (141)', pt: 'TIG (141)' },
    opt_schweissverfahren_ehand: { de: 'E-Hand (111)', en: 'MMA (111)', pt: 'Eletrodo revestido (111)' },
    opt_schweissverfahren_up:    { de: 'UP (121)', en: 'SAW (121)', pt: 'Arco submerso (121)' },

    opt_iso5817_B: { de: 'B – hoch', en: 'B – stringent', pt: 'B – exigente' },
    opt_iso5817_C: { de: 'C – mittel', en: 'C – intermediate', pt: 'C – intermédio' },
    opt_iso5817_D: { de: 'D – niedrig', en: 'D – moderate', pt: 'D – moderado' },

    opt_exc_EXC1: { de: 'EXC1', en: 'EXC1', pt: 'EXC1' },
    opt_exc_EXC2: { de: 'EXC2', en: 'EXC2', pt: 'EXC2' },
    opt_exc_EXC3: { de: 'EXC3', en: 'EXC3', pt: 'EXC3' },
    opt_exc_EXC4: { de: 'EXC4', en: 'EXC4', pt: 'EXC4' },

    /* ---------- Zusatzbereiche ---------- */
    zb_ermuedung:   { de: 'Ermüdung / Betriebsfestigkeit', en: 'Fatigue', pt: 'Fadiga' },
    zb_thermik:     { de: 'Vorwärmung & t8/5', en: 'Preheating & t8/5', pt: 'Pré-aquecimento e t8/5' },
    zb_kosten:      { de: 'Kosten, Zeit, Drahtbedarf', en: 'Cost, time, wire demand', pt: 'Custo, tempo, consumo de fio' },
    zb_verzug:      { de: 'Verzug & Schrumpfung', en: 'Distortion & shrinkage', pt: 'Distorção e contração' },
    zb_ausfuehrung: { de: 'Ausführung & Dokumentation', en: 'Execution & documentation', pt: 'Execução e documentação' },

    /* ---------- Felder ---------- */
    fld_a:        { de: 'Nahtdicke a', en: 'Throat thickness a', pt: 'Espessura da garganta a' },
    fld_z:        { de: 'Schenkelmaß z', en: 'Leg length z', pt: 'Perna z' },
    fld_l:        { de: 'Nahtlänge l', en: 'Weld length l', pt: 'Comprimento do cordão l' },
    fld_t1:       { de: 'Blechdicke t1', en: 'Plate thickness t1', pt: 'Espessura da chapa t1' },
    fld_t2:       { de: 'Blechdicke t2', en: 'Plate thickness t2', pt: 'Espessura da chapa t2' },
    fld_b:        { de: 'Breite b', en: 'Width b', pt: 'Largura b' },
    fld_h:        { de: 'Höhe h', en: 'Height h', pt: 'Altura h' },
    fld_d:        { de: 'Außendurchmesser d', en: 'Outside diameter d', pt: 'Diâmetro exterior d' },
    fld_tw:       { de: 'Stegdicke tw', en: 'Web thickness tw', pt: 'Espessura da alma tw' },
    fld_tf:       { de: 'Flanschdicke tf', en: 'Flange thickness tf', pt: 'Espessura do banzo tf' },
    fld_r_ecke:   { de: 'Eckradius r', en: 'Corner radius r', pt: 'Raio de canto r' },
    fld_a_steg:   { de: 'Nahtdicke am Steg a,Steg', en: 'Throat at the web a,web', pt: 'Garganta na alma a,alma' },
    fld_a_flansch:{ de: 'Nahtdicke am Flansch a,Flansch', en: 'Throat at the flange a,flange', pt: 'Garganta no banzo a,banzo' },
    fld_N:        { de: 'Normalkraft N', en: 'Axial force N', pt: 'Esforço normal N' },
    fld_Q:        { de: 'Querkraft Q', en: 'Shear force Q', pt: 'Esforço transverso Q' },
    fld_M:        { de: 'Biegemoment M', en: 'Bending moment M', pt: 'Momento fletor M' },
    fld_T:        { de: 'Torsionsmoment T', en: 'Torsional moment T', pt: 'Momento torsor T' },
    fld_F:        { de: 'Kraft F', en: 'Force F', pt: 'Força F' },
    fld_e:        { de: 'Hebelarm e', en: 'Lever arm e', pt: 'Braço e' },
    fld_gammaM2:  { de: 'Teilsicherheitsbeiwert γM2', en: 'Partial factor γM2', pt: 'Coeficiente parcial γM2' },
    fld_gammaMw:  { de: 'Teilsicherheitsbeiwert γMw', en: 'Partial factor γMw', pt: 'Coeficiente parcial γMw' },
    fld_betaW:    { de: 'Korrelationsbeiwert βw', en: 'Correlation factor βw', pt: 'Coeficiente de correlação βw' },
    fld_fu:       { de: 'Zugfestigkeit fu', en: 'Ultimate strength fu', pt: 'Tensão de rotura fu' },
    fld_fy:       { de: 'Streckgrenze fy', en: 'Yield strength fy', pt: 'Tensão de cedência fy' },
    fld_fo:       { de: '0,2-%-Dehngrenze fo', en: '0.2 % proof strength fo', pt: 'Tensão limite 0,2 % fo' },
    fld_fw:       { de: 'Schweißgutfestigkeit fw', en: 'Weld metal strength fw', pt: 'Resistência do metal depositado fw' },
    fld_rho_o:    { de: 'WEZ-Faktor ρo,haz', en: 'HAZ factor ρo,haz', pt: 'Fator ZTA ρo,haz' },
    fld_rho_u:    { de: 'WEZ-Faktor ρu,haz', en: 'HAZ factor ρu,haz', pt: 'Fator ZTA ρu,haz' },
    fld_S:        { de: 'Sicherheitsbeiwert S', en: 'Safety factor S', pt: 'Coeficiente de segurança S' },
    fld_nu:       { de: 'Nahtgütefaktor ν', en: 'Weld quality factor ν', pt: 'Fator de qualidade da solda ν' },
    fld_sigmaZul: { de: 'zulässige Spannung σzul', en: 'allowable stress σall', pt: 'tensão admissível σadm' },

    /* ---------- Einheiten ---------- */
    unit_mm:    { de: 'mm', en: 'mm', pt: 'mm' },
    unit_N:     { de: 'N', en: 'N', pt: 'N' },
    unit_Nmm2:  { de: 'N/mm²', en: 'N/mm²', pt: 'N/mm²' },
    unit_Nm:    { de: 'Nm', en: 'Nm', pt: 'Nm' },
    unit_grad:  { de: '°', en: '°', pt: '°' },
    unit_dimensionslos: { de: '–', en: '–', pt: '–' },
    unit_mm2:   { de: 'mm²', en: 'mm²', pt: 'mm²' },
    unit_mm3:   { de: 'mm³', en: 'mm³', pt: 'mm³' },
    unit_mm4:   { de: 'mm⁴', en: 'mm⁴', pt: 'mm⁴' },

    /* ---------- Meldungen (Stufe 1: formal) ---------- */
    msg_pflicht:      { de: 'Pflichtfeld – bitte ausfüllen.', en: 'Required field – please complete.', pt: 'Campo obrigatório – por favor preencha.' },
    msg_zahl:         { de: 'Bitte eine Zahl eingeben.', en: 'Please enter a number.', pt: 'Introduza um número.' },
    msg_min:          { de: 'Wert ist kleiner als der zulässige Mindestwert.', en: 'Value is below the permitted minimum.', pt: 'Valor abaixo do mínimo permitido.' },
    msg_max:          { de: 'Wert ist größer als der zulässige Höchstwert.', en: 'Value exceeds the permitted maximum.', pt: 'Valor acima do máximo permitido.' },
    msg_positiv:      { de: 'Wert muss größer als 0 sein.', en: 'Value must be greater than 0.', pt: 'O valor tem de ser maior que 0.' },
    msg_auswahl:      { de: 'Bitte eine Auswahl treffen.', en: 'Please make a selection.', pt: 'Faça uma seleção.' },
    msg_ungueltig:    { de: 'Auswahl passt nicht zu den übrigen Eingaben.', en: 'Selection does not fit the other entries.', pt: 'Seleção não é compatível com as restantes entradas.' },

    /* ---------- Meldungen (Stufe 2: fachlich) ---------- */
    msg_a_min_ec3:    { de: 'a-Maß unter 3 mm – EN 1993-1-8 fordert mindestens 3 mm.', en: 'Throat below 3 mm – EN 1993-1-8 requires at least 3 mm.', pt: 'Garganta abaixo de 3 mm – a EN 1993-1-8 exige pelo menos 3 mm.' },
    msg_a_min_praxis: { de: 'a-Maß unter dem Praxisrichtwert a ≥ √tmax − 0,5 (nicht normativ).', en: 'Throat below the practical guide value a ≥ √tmax − 0.5 (not normative).', pt: 'Garganta abaixo do valor prático a ≥ √tmax − 0,5 (não normativo).' },
    msg_a_max:        { de: 'a-Maß über dem üblichen Höchstwert a ≤ 0,7 · tmin.', en: 'Throat above the usual maximum a ≤ 0.7 · tmin.', pt: 'Garganta acima do máximo usual a ≤ 0,7 · tmin.' },
    msg_t_min_ec3:    { de: 'Blechdicke unter 4 mm – EN 1993-1-8 Anwendungsgrenze beachten.', en: 'Plate thickness below 4 mm – note the EN 1993-1-8 scope limit.', pt: 'Espessura abaixo de 4 mm – observar o limite de aplicação da EN 1993-1-8.' },
    msg_leff_min:     { de: 'Wirksame Nahtlänge unter max(6a; 30 mm) – Naht gilt als nicht tragend.', en: 'Effective length below max(6a; 30 mm) – weld counts as non-loadbearing.', pt: 'Comprimento efetivo abaixo de max(6a; 30 mm) – solda não resistente.' },
    msg_l_lang:       { de: 'Naht länger als 150·a – Abminderung βLw prüfen.', en: 'Weld longer than 150·a – check reduction βLw.', pt: 'Cordão maior que 150·a – verificar redução βLw.' },
    msg_dicke_stufe:  { de: 'Blechdicke außerhalb der hinterlegten Tabellenstufen.', en: 'Plate thickness outside the tabulated thickness steps.', pt: 'Espessura fora dos escalões tabelados.' },
    msg_alu_wez:      { de: 'Aluminium: WEZ-Entfestigung ist im Ergebnis zwingend zu berücksichtigen.', en: 'Aluminium: HAZ softening must be taken into account in the result.', pt: 'Alumínio: o amaciamento da ZTA tem de ser considerado no resultado.' },
    msg_welt_getrennt:{ de: 'Welt A und Welt B werden nie vermischt – es gilt ausschließlich die gewählte Welt.', en: 'World A and world B are never mixed – only the selected world applies.', pt: 'Os métodos A e B nunca se misturam – aplica-se apenas o selecionado.' },
    msg_lastfall_ermuedung: { de: 'Lastfall-Faktor und Ermüdungsnachweis sind zwei getrennte Nachweise – sie werden nie multipliziert.', en: 'Load-case factor and fatigue check are two separate verifications – they are never multiplied.', pt: 'O fator de caso de carga e a verificação à fadiga são independentes – nunca são multiplicados.' },

    /* ---------- Meldungen Nahtbild-Kern (N2, naht.js) ---------- */
    msg_naht_leer:        { de: 'Kein Nahtsegment vorhanden – das Nahtbild ist leer.', en: 'No weld segment present – the weld group is empty.', pt: 'Nenhum segmento de solda – o grupo de soldas está vazio.' },
    msg_seg_typ:          { de: 'Unbekannte Segmentart – zulässig sind gerade Naht und Kreisnaht.', en: 'Unknown segment type – straight welds and circular welds are permitted.', pt: 'Tipo de segmento desconhecido – só são admitidos cordões retos e soldas circulares.' },
    msg_seg_a:            { de: 'a-Maß des Segments fehlt oder ist nicht größer als 0.', en: 'Segment throat thickness is missing or not greater than 0.', pt: 'Falta a garganta do segmento ou não é maior que 0.' },
    msg_seg_laenge:       { de: 'Segment hat keine Länge – Anfangs- und Endpunkt prüfen.', en: 'Segment has no length – check start and end point.', pt: 'O segmento não tem comprimento – verifique o início e o fim.' },
    msg_seg_a_zu_gross:   { de: 'a-Maß erreicht den Durchmesser – die Kreisnaht würde sich selbst durchdringen.', en: 'Throat reaches the diameter – the circular weld would intersect itself.', pt: 'A garganta atinge o diâmetro – a solda circular sobrepor-se-ia a si mesma.' },
    msg_seg_duennwand:    { de: 'a-Maß größer als ein Drittel der Nahtlänge – das Linienmodell setzt schlanke Nähte voraus.', en: 'Throat larger than one third of the weld length – the line model assumes slender welds.', pt: 'Garganta maior que um terço do comprimento – o modelo de linha pressupõe cordões esbeltos.' },
    msg_torsion_offenes_nahtbild: { de: 'Offenes Nahtbild: die Torsion über Ip ist eine Näherung – die Wölbkrafttorsion bleibt unberücksichtigt. Ergebnis konservativ bewerten.', en: 'Open weld group: torsion via Ip is an approximation – warping torsion is not covered. Assess the result conservatively.', pt: 'Grupo aberto: a torção através de Ip é uma aproximação – a torção com empenamento não é considerada. Avalie o resultado de forma conservativa.' },
    msg_hauptachsen_gedreht: { de: 'Unsymmetrisches Nahtbild: die Hauptachsen sind gegenüber y und z gedreht – schiefe Biegung beachten.', en: 'Unsymmetric weld group: the principal axes are rotated relative to y and z – consider biaxial bending.', pt: 'Grupo assimétrico: os eixos principais estão rodados face a y e z – considerar flexão desviada.' },
    msg_kreis_aussendurchmesser: { de: 'Kreisnaht: gerechnet wird mit l = π·d, dabei ist d der Außendurchmesser.', en: 'Circular weld: calculated with l = π·d, where d is the outside diameter.', pt: 'Solda circular: calculada com l = π·d, sendo d o diâmetro exterior.' },

    /* ---------- Nahtbild-Kern: Beschriftungen (N2) ---------- */
    nb_titel:             { de: 'Nahtbild', en: 'Weld group', pt: 'Grupo de soldas' },
    nb_beispiel:          { de: 'Beispiel', en: 'Example', pt: 'Exemplo' },
    nb_modell:            { de: 'Rechenmodell', en: 'Calculation model', pt: 'Modelo de cálculo' },
    nb_modell_exakt:      { de: 'exakte Rechteckfläche (mit Eigenanteil in Dickenrichtung)', en: 'exact rectangular throat area (including through-thickness term)', pt: 'área retangular exata (incluindo o termo na direção da espessura)' },
    nb_modell_duennwandig:{ de: 'dünnwandiges Linienmodell (klassisch)', en: 'thin-walled line model (classic)', pt: 'modelo de linha de parede fina (clássico)' },
    nb_geschlossen:       { de: 'geschlossenes Nahtbild', en: 'closed weld group', pt: 'grupo de soldas fechado' },
    nb_offen:             { de: 'offenes Nahtbild', en: 'open weld group', pt: 'grupo de soldas aberto' },
    nb_segmente:          { de: 'Segmente', en: 'Segments', pt: 'Segmentos' },
    nb_handanker:         { de: 'Hand-Anker – gegen geschlossene Formeln nachgerechnet', en: 'Hand anchors – recalculated against closed-form formulas', pt: 'Âncoras manuais – recalculadas contra fórmulas fechadas' },
    nb_anker_rechteck:    { de: 'Rechteck-Nahtbild, Doppelkehlnaht (Roloff/Matek)', en: 'Rectangular weld group, double fillet weld (Roloff/Matek)', pt: 'Grupo retangular, filete bilateral (Roloff/Matek)' },
    nb_anker_umlauf:      { de: 'Umlaufende Kehlnaht am Flachstahl (Voigt)', en: 'All-round fillet weld on a flat bar (Voigt)', pt: 'Filete em todo o contorno de barra chata (Voigt)' },
    nb_anker_kreis:       { de: 'Kreisnaht am Rohr (Voigt)', en: 'Circular weld on a tube (Voigt)', pt: 'Solda circular em tubo (Voigt)' },
    nb_selbstpruefung:    { de: 'Selbstprüfung', en: 'Self-check', pt: 'Autoverificação' },
    nb_kontrolle_schwerpunkt: { de: 'statische Momente um den Schwerpunkt sind null', en: 'first moments about the centroid vanish', pt: 'os momentos estáticos em torno do centroide são nulos' },
    nb_kontrolle_polar:   { de: 'Ip = Iy + Iz', en: 'Ip = Iy + Iz', pt: 'Ip = Iy + Iz' },
    nb_kontrolle_haupt:   { de: 'I1 + I2 = Iy + Iz', en: 'I1 + I2 = Iy + Iz', pt: 'I1 + I2 = Iy + Iz' },

    /* ---------- Ergebnisgrößen des Nahtbilds (N2) ---------- */
    gr_n_seg:  { de: 'Anzahl Segmente', en: 'Number of segments', pt: 'Número de segmentos' },
    gr_l_ges:  { de: 'gesamte Nahtlänge', en: 'total weld length', pt: 'comprimento total do cordão' },
    gr_A:      { de: 'Nahtfläche Aw', en: 'Weld area Aw', pt: 'Área de solda Aw' },
    gr_ys:     { de: 'Schwerpunkt ys', en: 'Centroid ys', pt: 'Centroide ys' },
    gr_zs:     { de: 'Schwerpunkt zs', en: 'Centroid zs', pt: 'Centroide zs' },
    gr_Iy:     { de: 'Flächenmoment Iy', en: 'Second moment of area Iy', pt: 'Momento de inércia Iy' },
    gr_Iz:     { de: 'Flächenmoment Iz', en: 'Second moment of area Iz', pt: 'Momento de inércia Iz' },
    gr_Iyz:    { de: 'Zentrifugalmoment Iyz', en: 'Product of inertia Iyz', pt: 'Produto de inércia Iyz' },
    gr_Ip:     { de: 'polares Flächenmoment Ip', en: 'Polar second moment Ip', pt: 'Momento polar de inércia Ip' },
    gr_I1:     { de: 'Hauptflächenmoment I1', en: 'Principal second moment I1', pt: 'Momento principal de inércia I1' },
    gr_I2:     { de: 'Hauptflächenmoment I2', en: 'Principal second moment I2', pt: 'Momento principal de inércia I2' },
    gr_alpha:  { de: 'Hauptachsenwinkel α', en: 'Principal axis angle α', pt: 'Ângulo dos eixos principais α' },
    gr_Wy:     { de: 'Widerstandsmoment Wy', en: 'Section modulus Wy', pt: 'Módulo de flexão Wy' },
    gr_Wz:     { de: 'Widerstandsmoment Wz', en: 'Section modulus Wz', pt: 'Módulo de flexão Wz' },
    gr_Wt:     { de: 'Torsionswiderstandsmoment Wt', en: 'Torsional section modulus Wt', pt: 'Módulo de torção Wt' },
    gr_rmax:   { de: 'größter Randabstand rmax', en: 'largest edge distance rmax', pt: 'maior distância ao bordo rmax' },

    /* ---------- Meldungen Profileingabe (N2b, profil.js) ---------- */
    msg_profil_fehlt:      { de: 'Kein Profil gewählt – ohne Profil entsteht kein Nahtbild.', en: 'No section selected – without a section there is no weld group.', pt: 'Nenhum perfil selecionado – sem perfil não há grupo de soldas.' },
    msg_profil_unbekannt:  { de: 'Unbekannter Profiltyp.', en: 'Unknown section type.', pt: 'Tipo de perfil desconhecido.' },
    msg_kanten_fehlt:      { de: 'Kantenauswahl fehlt – bitte angeben, welche Kanten geschweißt sind.', en: 'Edge selection missing – please state which edges are welded.', pt: 'Falta a seleção de arestas – indique quais arestas são soldadas.' },
    msg_kanten_unpassend:  { de: 'Diese Kantenauswahl gibt es bei diesem Profil nicht.', en: 'This edge selection does not exist for this section.', pt: 'Esta seleção de arestas não existe para este perfil.' },
    msg_mass_fehlt:        { de: 'Profilmaß fehlt oder ist nicht größer als 0.', en: 'Section dimension is missing or not greater than 0.', pt: 'Falta uma dimensão do perfil ou não é maior que 0.' },
    msg_mass_tf_zu_gross:  { de: 'Die beiden Flansche sind zusammen so dick wie das Profil hoch ist – für den Steg bleibt nichts übrig.', en: 'The two flanges together are as thick as the section is high – nothing is left for the web.', pt: 'Os dois banzos juntos são tão espessos quanto a altura do perfil – não sobra alma.' },
    msg_mass_tw_zu_gross:  { de: 'Die Stegdicke erreicht die Flanschbreite – so ist das Profil nicht darstellbar.', en: 'The web thickness reaches the flange width – such a section cannot be modelled.', pt: 'A espessura da alma atinge a largura do banzo – o perfil não é representável.' },
    msg_mass_r_zu_gross:   { de: 'Der Eckradius ist größer als die halbe kleinste Profilseite.', en: 'The corner radius exceeds half of the smallest section side.', pt: 'O raio de canto excede metade do menor lado do perfil.' },
    msg_mass_t_zu_gross:   { de: 'Die Dicke erreicht die Schenkellänge – so ist der Winkel nicht darstellbar.', en: 'The thickness reaches the leg length – such an angle cannot be modelled.', pt: 'A espessura atinge o comprimento da aba – a cantoneira não é representável.' },
    msg_profil_a_fehlt:    { de: 'a-Maß fehlt oder ist nicht größer als 0.', en: 'Throat thickness is missing or not greater than 0.', pt: 'Falta a garganta ou não é maior que 0.' },
    msg_endkrater_zu_lang: { de: 'Der Endkraterabzug ist länger als die Naht selbst – die Naht ist für dieses a-Maß zu kurz.', en: 'The end crater deduction is longer than the weld itself – the weld is too short for this throat thickness.', pt: 'A dedução das crateras de fim é maior que o próprio cordão – o cordão é curto demais para esta garganta.' },

    msg_endkrater_abzug:   { de: 'Endkraterabzug: je offener Naht wird 2·a abgezogen (an jedem freien Ende a).', en: 'End crater deduction: 2·a is deducted per open weld run (a at each free end).', pt: 'Dedução de cratera: 2·a por cordão aberto (a em cada extremidade livre).' },
    msg_endkrater_umlaufend:{ de: 'Umlaufende Naht: der Endkraterabzug entfällt, weil es kein freies Nahtende gibt.', en: 'All-round weld: no end crater deduction, because there is no free weld end.', pt: 'Solda perimetral: sem dedução de cratera, pois não há extremidade livre.' },
    msg_endkrater_aus:     { de: 'Endkraterabzug abgeschaltet – das ist nur mit Auslaufblechen oder ausgeschliffenen Endkratern zulässig.', en: 'End crater deduction switched off – only admissible with run-off plates or ground-out end craters.', pt: 'Dedução de cratera desativada – só admissível com chapas de extensão ou crateras esmeriladas.' },
    msg_eckradius_verkuerzt:{ de: 'Eckradien verkürzen die gerechnete Naht: der Bogen in der Ecke wird NICHT mitgerechnet, weil dort keine saubere Kehlnaht mit dem angegebenen a-Maß entsteht.', en: 'Corner radii shorten the calculated weld: the corner arc is NOT counted, because no sound fillet weld with the stated throat forms there.', pt: 'Os raios de canto encurtam o cordão calculado: o arco do canto NÃO é contabilizado, pois aí não se forma um filete correto com a garganta indicada.' },
    msg_eckluecke_keine_offene_naht: { de: 'Die Lücken in den Ecken sind eine Rechenannahme – die Naht selbst läuft um. Der Hinweis des Nahtbild-Kerns auf ein offenes Nahtbild gilt hier nicht.', en: 'The gaps at the corners are a modelling assumption – the weld itself runs all round. The weld group core’s note about an open weld group does not apply here.', pt: 'As folgas nos cantos são uma hipótese de cálculo – a solda corre em todo o contorno. A nota do núcleo sobre grupo aberto não se aplica aqui.' },
    msg_a_je_segment:      { de: 'Unterschiedliche a-Maße je Segment: Steg und Flansch werden getrennt gerechnet.', en: 'Different throat thicknesses per segment: web and flange are calculated separately.', pt: 'Gargantas diferentes por segmento: alma e banzo são calculadas separadamente.' },
    msg_nur_gewaehlte_kanten: { de: 'Es werden ausschließlich die gewählten Kanten gerechnet – alle übrigen Kanten gelten als nicht geschweißt.', en: 'Only the selected edges are calculated – all other edges count as not welded.', pt: 'Apenas as arestas selecionadas são calculadas – as restantes contam como não soldadas.' },
    msg_masse_sind_aussenmasse: { de: 'Alle Profilmaße sind Außenmaße; die Naht liegt auf der Außenkontur.', en: 'All section dimensions are outside dimensions; the weld lies on the outer contour.', pt: 'Todas as dimensões são exteriores; a solda situa-se no contorno exterior.' },

    /* ---------- Profileingabe: Beschriftungen (N2b) ---------- */
    pr_titel:          { de: 'Profileingabe', en: 'Section input', pt: 'Entrada do perfil' },
    pr_profil:         { de: 'Profil', en: 'Section', pt: 'Perfil' },
    pr_kanten:         { de: 'Geschweißte Kanten', en: 'Welded edges', pt: 'Arestas soldadas' },
    pr_raupen:         { de: 'Schweißraupen', en: 'Weld runs', pt: 'Cordões' },
    pr_umlaufend:      { de: 'umlaufend geschweißt', en: 'welded all round', pt: 'soldado em todo o contorno' },
    pr_offen:          { de: 'offene Naht (freie Enden)', en: 'open weld (free ends)', pt: 'cordão aberto (extremidades livres)' },
    pr_l_brutto:       { de: 'Nahtlänge vor Abzug', en: 'Weld length before deduction', pt: 'Comprimento antes da dedução' },
    pr_l_netto:        { de: 'wirksame Nahtlänge (Vorschlag)', en: 'effective weld length (proposal)', pt: 'comprimento efetivo (proposta)' },
    pr_l_kontur:       { de: 'geometrischer Umfang mit Eckbögen', en: 'geometric perimeter including corner arcs', pt: 'perímetro geométrico com arcos de canto' },
    pr_endkrater:      { de: 'Endkraterabzug gesamt', en: 'Total end crater deduction', pt: 'Dedução total de crateras' },
    pr_bogen:          { de: 'nicht gerechneter Eckbogen', en: 'corner arc not counted', pt: 'arco de canto não contabilizado' },
    pr_handanker:      { de: 'Hand-Anker – Umfänge gegen geschlossene Formeln', en: 'Hand anchors – perimeters against closed-form formulas', pt: 'Âncoras manuais – perímetros contra fórmulas fechadas' },
    pr_anker_rohr:     { de: 'Rechteckrohr: U = 2·(b+h) − 8·r', en: 'Rectangular hollow section: U = 2·(b+h) − 8·r', pt: 'Tubular retangular: U = 2·(b+h) − 8·r' },
    pr_anker_kreis:    { de: 'Rundrohr: l = π·d (Außendurchmesser)', en: 'Circular hollow section: l = π·d (outside diameter)', pt: 'Tubo circular: l = π·d (diâmetro exterior)' },
    pr_anker_iprofil:  { de: 'I-Profil rundum: U = 2·h + 4·b − 2·tw', en: 'I section all round: U = 2·h + 4·b − 2·tw', pt: 'Perfil I em todo o contorno: U = 2·h + 4·b − 2·tw' },
    pr_anker_endkrater:{ de: 'Endkrater: l = Bruttolänge − 2·a je offener Raupe', en: 'End craters: l = gross length − 2·a per open run', pt: 'Crateras: l = comprimento bruto − 2·a por cordão aberto' },

    /* ---------- Segmentgruppen (Herkunft eines Segments) ---------- */
    sg_flanke:  { de: 'Flanke', en: 'Side weld', pt: 'Cordão lateral' },
    sg_stirn:   { de: 'Stirnseite', en: 'End weld', pt: 'Extremidade' },
    sg_flansch: { de: 'Flansch', en: 'Flange', pt: 'Banzo' },
    sg_steg:    { de: 'Steg', en: 'Web', pt: 'Alma' },
    sg_kante:   { de: 'Stirnkante', en: 'Edge face', pt: 'Face de topo' },
    sg_kreis:   { de: 'Kreisnaht', en: 'Circular weld', pt: 'Solda circular' },

    /* ---------- Rechenweg ---------- */
    rw_schritt:      { de: 'Schritt', en: 'Step', pt: 'Passo' },
    rw_formel:       { de: 'Formel', en: 'Formula', pt: 'Fórmula' },
    rw_eingesetzt:   { de: 'eingesetzt', en: 'substituted', pt: 'substituído' },
    rw_ergebnis:     { de: 'Ergebnis', en: 'Result', pt: 'Resultado' },
    rw_grundlage:    { de: 'Grundlage', en: 'Basis', pt: 'Base' },
    rw_geprueft:     { de: 'geprüft', en: 'checked', pt: 'verificado' },
    rw_ausnutzung:   { de: 'Ausnutzung', en: 'Utilisation', pt: 'Grau de utilização' },
    rw_gewaehlt:     { de: 'gewählt', en: 'selected', pt: 'selecionado' },

    /* ---------- Ampel ---------- */
    amp_gruen: { de: 'Nachweis erfüllt', en: 'Verification satisfied', pt: 'Verificação satisfeita' },
    amp_gelb:  { de: 'Grenzbereich – prüfen', en: 'Borderline – review', pt: 'Zona limite – rever' },
    amp_rot:   { de: 'Nachweis nicht erfüllt', en: 'Verification not satisfied', pt: 'Verificação não satisfeita' },

    /* ---------- Was NICHT geprüft wird (2.4) ---------- */
    ng_titel:                 { de: 'Was dieser Rechner NICHT prüft', en: 'What this calculator does NOT check', pt: 'O que este programa NÃO verifica' },
    ng_grundwerkstoff:        { de: 'Nachweis des Grundwerkstoffs', en: 'Verification of the base material', pt: 'Verificação do material de base' },
    ng_beulen_stabilitaet:    { de: 'Beulen und Stabilität', en: 'Buckling and stability', pt: 'Encurvadura e estabilidade' },
    ng_verbindungsmittel:     { de: 'Schrauben und sonstige Verbindungsmittel', en: 'Bolts and other fasteners', pt: 'Parafusos e outros ligadores' },
    ng_steifigkeit_verformung:{ de: 'Bauteilsteifigkeit und Verformung', en: 'Component stiffness and deformation', pt: 'Rigidez e deformação do componente' },
    ng_ausfuehrung_aufsicht:  { de: 'Ausführung, Schweißaufsicht und Qualifikation', en: 'Execution, welding supervision and qualification', pt: 'Execução, supervisão e qualificação' },
    ng_werkstoffzulassung:    { de: 'Werkstoffzulassung und Schweißeignung im Einzelfall', en: 'Material approval and weldability in the individual case', pt: 'Aprovação do material e soldabilidade no caso concreto' },
    ng_lastannahmen:          { de: 'Die Lastannahmen selbst (Einwirkungen und Kombinationen)', en: 'The load assumptions themselves (actions and combinations)', pt: 'As próprias hipóteses de carga (ações e combinações)' },
    ng_sproedbruch:           { de: 'Sprödbruch / Kaltzähigkeit (EN 1993-1-10)', en: 'Brittle fracture / toughness (EN 1993-1-10)', pt: 'Fratura frágil / tenacidade (EN 1993-1-10)' },
    ng_anschlusssteifigkeit:  { de: 'Anschlusssteifigkeit (gelenkig / starr)', en: 'Joint stiffness (pinned / rigid)', pt: 'Rigidez da ligação (rotulada / rígida)' },
    ng_terrassenbruch:        { de: 'Terrassenbruch bei Zug in Dickenrichtung (Z-Güten)', en: 'Lamellar tearing under through-thickness tension (Z grades)', pt: 'Rotura lamelar sob tração na direção da espessura (qualidades Z)' },

    /* ---------- Lücken-Texte (ehrliche Hinweise) ---------- */
    lk_rho_haz_nur_band:            { de: 'ρhaz: die Einzelwerte der EN 1999-1-1 Tab. 3.2 sind geschützt – frei belegbar ist nur ein Wertebereich. Angesetzt wird der konservative untere Wert; über „eigener Wert" überschreibbar.', en: 'ρhaz: the individual values of EN 1999-1-1 Table 3.2 are protected – only a range is publicly verifiable. The conservative lower value is used; overridable via "own value".', pt: 'ρhaz: os valores individuais da Tab. 3.2 da EN 1999-1-1 são protegidos – só é verificável um intervalo. Usa-se o valor inferior conservativo; substituível por "valor próprio".' },
    lk_fo_fu_und_rho_nur_band:      { de: 'Festigkeits- und ρhaz-Werte dieses Zustands sind nur über eine Quelle bzw. als Bereich belegt.', en: 'Strength and ρhaz values for this temper are supported by only one source or as a range.', pt: 'Os valores de resistência e ρhaz deste estado só têm uma fonte ou são um intervalo.' },
    lk_nur_eine_quelle:             { de: 'Nur eine unabhängige Quelle gefunden – Wert vor Produktivnutzung prüfen.', en: 'Only one independent source found – verify before productive use.', pt: 'Apenas uma fonte independente – verificar antes do uso produtivo.' },
    lk_weltb_tabelle_nur_S235_S355_gruppe_B: { de: 'Die klassischen Tabellenwerte liegen nur für S235 und S355 (Bewertungsgruppe B) belegt vor. Für andere Werkstoffe wird der Formelweg σzul = Re/S · ν verwendet – das ist ausdrücklich kein Tabellenwert.', en: 'The classic tabulated values are documented only for S235 and S355 (quality level B). For other materials the formula route σall = Re/S · ν is used – explicitly not a tabulated value.', pt: 'Os valores tabelados clássicos só estão documentados para S235 e S355 (nível B). Para outros materiais usa-se a fórmula σadm = Re/S · ν – expressamente não é um valor tabelado.' },
    lk_beta_Lw2_nur_eine_quelle:    { de: 'βLw,2 (Versteifungen) ist nur einfach belegt.', en: 'βLw,2 (stiffeners) has only a single source.', pt: 'βLw,2 (reforços) tem apenas uma fonte.' },
    lk_nu_kehl_nur_eine_quelle:     { de: 'Nahtgütefaktor für Kehlnähte nur einfach belegt – bevorzugt den Tabellenweg nutzen.', en: 'Weld quality factor for fillet welds has only a single source – prefer the tabulated route.', pt: 'Fator de qualidade para filetes com apenas uma fonte – preferir a via tabelada.' },
    lk_einbrand_nur_eine_quelle:    { de: 'Anrechnung des tiefen Einbrands nur einfach belegt und nur mit Verfahrensprüfung zulässig.', en: 'Credit for deep penetration has a single source only and requires a procedure test.', pt: 'O crédito de penetração profunda tem uma só fonte e exige qualificação do procedimento.' },
    lk_b_haz_wig_nur_bis_6mm:       { de: 'b_haz für WIG ist nur bis 6 mm Dicke belegt.', en: 'b_haz for TIG is documented only up to 6 mm thickness.', pt: 'b_haz para TIG só está documentado até 6 mm.' },
    lk_spalt_richtwert:             { de: 'Spaltmaß ist ein Richtwert der Fertigungspraxis, keine Normvorgabe.', en: 'Root gap is a shop-practice guide value, not a code requirement.', pt: 'A folga na raiz é um valor prático de oficina, não uma exigência normativa.' },
    lk_F3_nicht_definiert:          { de: 'Für diese Nahtform ist kein F3-Faktor definiert (nur 2D-Wärmefluss).', en: 'No F3 factor is defined for this weld shape (2D heat flow only).', pt: 'Não há fator F3 definido para esta forma (só fluxo térmico 2D).' },
    lk_dicke_ausserhalb_zustand:    { de: 'Blechdicke liegt außerhalb des für diesen Zustand belegten Bereichs.', en: 'Plate thickness lies outside the documented range for this temper.', pt: 'Espessura fora do intervalo documentado para este estado.' },
    lk_dicke_ausserhalb_tabelle:    { de: 'Blechdicke liegt außerhalb der Tabelle (EN 1993-1-1 reicht bis 80 mm).', en: 'Plate thickness lies outside the table (EN 1993-1-1 up to 80 mm).', pt: 'Espessura fora da tabela (EN 1993-1-1 até 80 mm).' },
    lk_alu_kein_beta_w:             { de: 'Aluminium kennt kein βw – der Nachweis läuft über die Schweißgutfestigkeit fw.', en: 'Aluminium has no βw – verification uses the weld metal strength fw.', pt: 'O alumínio não tem βw – a verificação usa a resistência do metal depositado fw.' },
    lk_ec3_11_2005_vor_ac2009:      { de: 'Alt-Wert fu = 510 N/mm² aus EN 1993-1-1:2005 vor der Berichtigung AC:2009. Maßgebend ist 490 N/mm².', en: 'Legacy value fu = 510 N/mm² from EN 1993-1-1:2005 before corrigendum AC:2009. The governing value is 490 N/mm².', pt: 'Valor antigo fu = 510 N/mm² da EN 1993-1-1:2005 antes da errata AC:2009. Vigora 490 N/mm².' },
    lk_weltb_kein_verbindliches_regelwerk: { de: 'Für den allgemeinen Maschinenbau gibt es kein verbindliches Regelwerk. Grundlage sind Roloff/Matek und Decker.', en: 'There is no binding code for general mechanical engineering. The basis is Roloff/Matek and Decker.', pt: 'Não existe norma vinculativa para engenharia mecânica geral. A base é Roloff/Matek e Decker.' },
    lk_nicht_normativ_in_ec3:       { de: 'Praxisrichtwert – in EN 1993-1-8 nicht normativ geregelt.', en: 'Practical guide value – not normative in EN 1993-1-8.', pt: 'Valor prático – não normativo na EN 1993-1-8.' }
  };

  function t(key, lang) {
    var e = D[key];
    if (!e) return '[' + key + ']';
    return e[lang] || e.de || ('[' + key + ']');
  }

  function has(key) { return Object.prototype.hasOwnProperty.call(D, key); }

  function keys() {
    var r = [];
    for (var k in D) if (Object.prototype.hasOwnProperty.call(D, k)) r.push(k);
    return r;
  }

  return { NAME: 'kern', SPRACHEN: SPRACHEN, dict: D, t: t, has: has, keys: keys };
}));
