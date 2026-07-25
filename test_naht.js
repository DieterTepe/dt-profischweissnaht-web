/* ============================================================================
 * DT-ProfiSchweissnaht · test_naht.js   ***DEV-ONLY — NIE AUSLIEFERN***
 * Assertion-Harness. Sektionsweise, ok()-Zaehler, Basislinie waechst nur.
 * Aufruf:  node test_naht.js
 * ========================================================================== */
'use strict';

var Kern    = require('./i18n_kern.js');
var Hilfe   = require('./i18n_hilfe.js');
var Kerb    = require('./i18n_kerbfall.js');
var Data    = require('./daten.js');
var Options = require('./optionen.js');
var Valid   = require('./validate.js');
var Naht    = require('./naht.js');
var Profil  = require('./profil.js');
var Svg     = require('./svglib.js');
var Bild    = require('./schaubild.js');

var N = 0, FAIL = [], SEKTION = '';
function sek(s) { SEKTION = s; console.log('\n— ' + s + ' —'); }
function ok(bed, txt) {
  N++;
  if (!bed) { FAIL.push(SEKTION + ' :: ' + txt); console.log('  ✗ ' + txt); }
}
function eq(a, b, txt) { ok(a === b, txt + '  (ist ' + JSON.stringify(a) + ', soll ' + JSON.stringify(b) + ')'); }
function nahe(a, b, eps, txt) { ok(Math.abs(a - b) <= eps, txt + '  (ist ' + a + ', soll ≈ ' + b + ')'); }

/* ========================================================================= */
sek('S1 · Module und Grundstruktur');
ok(!!Kern && !!Hilfe && !!Kerb, 'alle drei i18n-Module geladen');
ok(!!Data && !!Options && !!Valid, 'daten, optionen, validate geladen');
eq(Data.WERKSTOFFE.length, 11, '11 Werkstoffsorten in V1');
eq(Data.werkstoffeDerGruppe('stahl').length, 5, '5 Baustaehle');
eq(Data.werkstoffeDerGruppe('edelstahl').length, 3, '3 Edelstaehle');
eq(Data.werkstoffeDerGruppe('alu').length, 3, '3 Aluminiumlegierungen');
eq(Data.ISO5817.length, 3, 'ISO 5817: B/C/D');
eq(Data.EXC.length, 4, 'EXC1..EXC4');
eq(Data.VERFAHREN.length, 5, '5 Schweissverfahren');
eq(Data.NICHT_GEPRUEFT.length, 10, 'Liste "nicht geprueft" mit 10 Punkten (2.4)');

/* ========================================================================= */
sek('S2 · Werkstoffkennwerte (Tabellenwerte sind massgeblich)');
var s235 = Data.kennwerte('S235', 10);
eq(s235.fy, 235, 'S235 fy (t<=40)'); eq(s235.fu, 360, 'S235 fu');
var s355 = Data.kennwerte('S355', 20);
eq(s355.fu, 490, 'KORREKTUR: S355 fu = 490 (Berichtigung AC:2009), nicht 510');
eq(s355.alt_fu.wert, 510, 'Alt-Wert 510 nur als dokumentierte Option hinterlegt');
eq(Data.kennwerte('S355', 60).fu, 470, 'S355 fu in der Dickenstufe 40<t<=80');
eq(Data.kennwerte('S275', 60).fu, 410, 'S275 fu in der zweiten Dickenstufe');
ok(Data.kennwerte('S235', 120).ok === false, 'Dicke ausserhalb der Tabelle wird ehrlich gemeldet');
eq(Data.kennwerte('1.4404', 8).fu, 520, '1.4404 fu konservativ am unteren Bandwert');
eq(Data.PHYSIK.edelstahl.E, 200000, 'KORREKTUR: Edelstahl E = 200000 (nicht 210000)');
eq(Data.PHYSIK.stahl.E, 210000, 'Baustahl E = 210000');
eq(Data.PHYSIK.alu.E, 70000, 'Aluminium E = 70000');

var alu = Data.kennwerte('AW6082', 10, 'T6');
eq(alu.fo, 255, 'AW-6082 T6 Blech fo'); eq(alu.fu, 300, 'AW-6082 T6 Blech fu');
ok(alu.rho_o < 1, 'AW-6082 T6: WEZ-Abminderung wirkt (rho_o < 1)');
ok(!!alu.luecke, 'AW-6082 T6: Luecke bei rho_haz ist gesetzt und damit sichtbar');
eq(Data.kennwerte('AW5083', 20, 'O_H111').rho_o, 1.0, 'AW-5083 im Zustand O: keine WEZ-Entfestigung');

/* ========================================================================= */
sek('S3 · beta_w — beide Regelsaetze, Edelstahl, Aluminium');
eq(Data.betaW('S235', 'na_de').wert, 0.80, 'beta_w S235');
eq(Data.betaW('S275', 'na_de').wert, 0.85, 'beta_w S275');
eq(Data.betaW('S355', 'na_de').wert, 0.90, 'beta_w S355');
eq(Data.betaW('S420', 'na_de').wert, 0.88, 'KORREKTUR: S420 deutscher NA = 0,88');
eq(Data.betaW('S460', 'na_de').wert, 0.85, 'KORREKTUR: S460 deutscher NA = 0,85');
eq(Data.betaW('S420', 'cen2005').wert, 1.00, 'S420 CEN-2005 = 1,0');
eq(Data.betaW('S460', 'cen2005').wert, 1.00, 'S460 CEN-2005 = 1,0');
eq(Data.betaW('S355', 'cen2005').wert, Data.betaW('S355', 'na_de').wert, 'S355 in beiden Regelsaetzen gleich');
eq(Data.betaW('1.4301').wert, 1.00, 'KORREKTUR: Edelstahl beta_w = 1,0 fuer alle Sorten');
eq(Data.betaW('1.4571').wert, 1.00, 'Edelstahl 1.4571 beta_w = 1,0');
ok(Data.betaW('AW6082').ok === false, 'KORREKTUR: Aluminium hat KEIN beta_w');
eq(Data.betaW('AW6082').hinweis, 'alu_nachweis_ueber_fw', 'Alu verweist auf den fw-Weg');
eq(Data.betaW('S420', 'na_de').regelsatz, 'na_de', 'gewaehlter Regelsatz wird zurueckgemeldet (Rechenweg)');

/* ========================================================================= */
sek('S4 · Aluminium: Schweissgut fw und WEZ-Breite');
eq(Data.fwSchweissgut('AW5083', '5356').wert, 240, 'fw 5083 + 5356');
eq(Data.fwSchweissgut('AW6082', '5356').wert, 210, 'fw 6082 + 5356');
eq(Data.fwSchweissgut('AW6082', '4043A').wert, 190, 'fw 6082 + 4043A');
eq(Data.fwSchweissgut('AW6060', '4043A').wert, 150, 'fw 6060 + 4043A');
ok(Data.fwSchweissgut('AW5083', '4043A').ok === false, '5083 + 4043A ist nicht belegt -> ehrliche Luecke');
ok(Data.fwSchweissgut('S235', '5356').ok === false, 'fw gibt es nur fuer Aluminium');
eq(Data.bHaz('mig', 5).wert, 20, 'b_haz MIG t<=6');
eq(Data.bHaz('mig', 10).wert, 30, 'b_haz MIG 6<t<=12');
eq(Data.bHaz('mig', 20).wert, 35, 'b_haz MIG 12<t<=25');
eq(Data.bHaz('mig', 40).wert, 40, 'b_haz MIG t>25');
eq(Data.bHaz('wig', 4).wert, 30, 'b_haz WIG t<=6');
ok(Data.bHaz('wig', 20).ok === false, 'b_haz WIG >6 mm ist eine ehrliche Luecke, kein interpolierter Wert');

/* ========================================================================= */
sek('S5 · Welt B — Tabellenwerte und Formelweg');
eq(Data.weltBTabelle('S235', 'stumpf_mit_gegenlage', 'normal', 'ruhend').wert, 160, 'S235 Stumpfnaht ruhend');
eq(Data.weltBTabelle('S235', 'stumpf_mit_gegenlage', 'normal', 'schwellend').wert, 110, 'S235 Stumpfnaht schwellend');
eq(Data.weltBTabelle('S235', 'stumpf_mit_gegenlage', 'normal', 'wechselnd').wert, 55, 'S235 Stumpfnaht wechselnd');
eq(Data.weltBTabelle('S355', 'kehl_flach', 'normal', 'ruhend').wert, 110, 'S355 Flachkehlnaht ruhend');
ok(Data.weltBTabelle('S460', 'kehl_flach', 'normal', 'ruhend').ok === false, 'S460 ist nicht tabelliert -> ehrliche Luecke');
ok(Data.weltBTabelle('S235', 'stumpf_mit_gegenlage', 'normal', 'ruhend').wert >
   Data.weltBTabelle('S235', 'stumpf_mit_gegenlage', 'normal', 'schwellend').wert &&
   Data.weltBTabelle('S235', 'stumpf_mit_gegenlage', 'normal', 'schwellend').wert >
   Data.weltBTabelle('S235', 'stumpf_mit_gegenlage', 'normal', 'wechselnd').wert,
   'Monotonie ruhend > schwellend > wechselnd');
eq(Data.WELTB_FORMEL.lastfall_R.ruhend, 1, 'Spannungsverhaeltnis ruhend R = 1');
eq(Data.WELTB_FORMEL.lastfall_R.wechselnd, -1, 'Spannungsverhaeltnis wechselnd R = -1');

/* ========================================================================= */
sek('S6 · Verfahren, Geometrie, Beiwerte');
eq(Data.verfahren('up').k, 1.0, 'thermischer Wirkungsgrad UP = 1,0');
eq(Data.verfahren('mag').k, 0.8, 'thermischer Wirkungsgrad MAG = 0,8');
eq(Data.verfahren('ehand').k, 0.8, 'thermischer Wirkungsgrad E-Hand = 0,8');
eq(Data.verfahren('wig').k, 0.6, 'thermischer Wirkungsgrad WIG = 0,6');
ok(Data.verfahren('up').eta_A > Data.verfahren('ehand').eta_A, 'UP bringt mehr aus als E-Hand');
eq(Data.BEIWERTE.gamma_M2.wert, 1.25, 'gamma_M2 = 1,25');
eq(Data.BEIWERTE.faktor_sigma_senkrecht.wert, 0.9, 'Zusatzbedingung sigma_senkr <= 0,9*fu/gM2');
eq(Data.GEOMETRIE.a_min_ec3.wert, 3.0, 'Mindest-a-Mass EN 1993-1-8 = 3 mm');
nahe(4 * Math.SQRT2, 5.657, 0.001, 'Umrechnung z = a*sqrt(2) (Hand-Anker)');

/* ========================================================================= */
sek('S7 · Optionen — Filter und Vertraeglichkeitsregeln');
eq(Options.codes('werkstoff', { werkstoffgruppe: 'stahl' }).length, 5, 'Baustahl-Auswahl zeigt 5 Sorten');
eq(Options.codes('werkstoff', { werkstoffgruppe: 'alu' }).length, 3, 'Alu-Auswahl zeigt 3 Legierungen');
ok(Options.codes('werkstoffgruppe', { welt: 'B' }).indexOf('alu') < 0, 'Welt B bietet kein Aluminium an');
ok(Options.codes('werkstoffgruppe', { welt: 'A' }).indexOf('alu') >= 0, 'Welt A bietet Aluminium an');
ok(Options.codes('nahtart', { stossart: 'stumpfstoss' }).indexOf('kehl_doppel') < 0, 'Stumpfstoss zeigt keine Kehlnaht');
ok(Options.codes('nahtart', { stossart: 'ueberlappstoss' }).indexOf('stumpf_v') < 0, 'Ueberlappstoss zeigt keine V-Naht');
ok(Options.codes('nahtart', { stossart: 't_stoss' }).indexOf('stumpf_dhv') >= 0, 'T-Stoss bietet die DHV-Naht an');
ok(Options.codes('schweissverfahren', { werkstoffgruppe: 'alu' }).indexOf('up') < 0, 'kein UP fuer Aluminium');
ok(Options.codes('schweissverfahren', { werkstoffgruppe: 'alu' }).indexOf('mig') >= 0, 'MIG fuer Aluminium');
ok(Options.codes('schweissverfahren', { werkstoffgruppe: 'stahl', stossart: 'ueberlappstoss' }).indexOf('up') < 0,
   'kein UP am Ueberlappstoss (gilt_nicht_wenn greift)');
ok(Options.gruppeAktiv('bw_regelsatz', { welt: 'A', werkstoff: 'S420' }), 'beta_w-Regelsatz erscheint bei S420');
ok(!Options.gruppeAktiv('bw_regelsatz', { welt: 'A', werkstoff: 'S235' }), 'beta_w-Regelsatz erscheint NICHT bei S235');
ok(!Options.gruppeAktiv('lastfall', { welt: 'A' }), 'Lastfall gehoert ausschliesslich zu Welt B');
ok(Options.gruppeAktiv('lastfall', { welt: 'B' }), 'Lastfall erscheint in Welt B');
ok(!Options.gruppeAktiv('zustand', { werkstoffgruppe: 'stahl' }), 'Zustand nur bei Aluminium');
eq(Options.codes('zustand', { werkstoffgruppe: 'alu', werkstoff: 'AW5083' }).length, 3, 'AW-5083 hat 3 Zustaende');
ok(Options.codes('zusatzwerkstoff', { werkstoffgruppe: 'alu', werkstoff: 'AW5083' }).indexOf('4043A') < 0,
   '4043A wird fuer AW-5083 nicht angeboten (kein fw-Wert belegt)');

/* Bereinigung: aendert sich oben etwas, faellt Unpassendes unten weg */
var zb = Options.bereinige({ welt: 'B', werkstoffgruppe: 'alu', werkstoff: 'AW6082', zustand: 'T6' });
ok(!zb.werkstoffgruppe && !zb.werkstoff, 'Wechsel auf Welt B entfernt die Alu-Auswahl vollstaendig');
var zb2 = Options.bereinige({ stossart: 'stumpfstoss', nahtart: 'kehl_doppel' });
ok(!zb2.nahtart, 'Wechsel der Stossart entfernt die unpassende Nahtart');
var zEin = { welt: 'A', werkstoffgruppe: 'stahl' };
Options.bereinige(zEin);
eq(Object.keys(zEin).length, 2, 'bereinige() mutiert die Eingabe nicht');

/* ========================================================================= */
sek('S8 · Pflichttest: keine Sackgasse, kein verwaistes Feld, alles rechenbar');
var W = Options.wege(200000);
ok(!W.abgebrochen, 'Wegeaufzaehlung vollstaendig (nicht abgebrochen)');
ok(W.wege.length > 200, 'ausreichend viele Auswahlwege durchlaufen (' + W.wege.length + ')');
eq(W.sackgassen.length, 0, 'KEINE Sackgasse: in jeder Pflichtgruppe bleibt mindestens eine Option');

var unvollstaendig = 0, verwaist = 0, i, j;
for (i = 0; i < W.wege.length; i++) {
  var p = Options.pruefe(W.wege[i]);
  if (!p.ok) unvollstaendig++;
  /* verwaistes Feld: ein Feld wird Pflicht, obwohl seine Gruppe nie gezeigt wurde */
  for (j = 0; j < Valid.SCHEMA.length; j++) {
    var f = Valid.SCHEMA[j];
    if (!f.pflicht_wenn) continue;
    if (!Valid.istPflicht(f, W.wege[i])) continue;
    for (var s in f.pflicht_wenn) {
      if (!Object.prototype.hasOwnProperty.call(f.pflicht_wenn, s)) continue;
      if (!Options.gruppe(s)) continue;
      if (!Options.gruppeAktiv(s, W.wege[i])) verwaist++;
    }
  }
}
eq(unvollstaendig, 0, 'jeder Weg endet in einem vollstaendigen, rechenbaren Eingabesatz');
eq(verwaist, 0, 'kein verwaistes Pflichtfeld auf irgendeinem Weg');

/* ========================================================================= */
sek('S9 · Validierung Stufe 1 (formal)');
var z1 = { welt: 'A', rechenrichtung: 'nachweis', werkstoffgruppe: 'stahl', werkstoff: 'S235',
           stossart: 't_stoss', nahtart: 'kehl_doppel', nachweisverfahren: 'richtungsbezogen',
           profil: 'blech', kanten: 'flanken',
           lasteingabe: 'direkt', iso5817: 'B', exc: 'EXC2' };
var gut = { a: 5, l: 200, t1: 10, t2: 10, b: 120, N: 50000, Q: 0, gammaM2: 1.25 };
var r = Valid.pruefe(gut, z1);
ok(r.ok, 'sauberer Datensatz besteht die Pruefung');
eq(Valid.zahl('4,5'), 4.5, 'Komma wird als Dezimaltrennzeichen akzeptiert');
ok(isNaN(Valid.zahl('4,5x')), 'Buchstaben werden nicht stillschweigend verschluckt');
ok(isNaN(Valid.zahl('')), 'leere Eingabe ist keine Zahl');
var rFehlt = Valid.pruefe({ l: 200, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(!rFehlt.ok, 'fehlendes Pflichtfeld a wird erkannt');
eq(rFehlt.fehler[0].code, 'msg_pflicht', 'Meldungscode ist sprachneutral');
var rBereich = Valid.pruefe({ a: 500, l: 200, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(!rBereich.ok, 'a ausserhalb des Feldbereichs wird erkannt');

/* ========================================================================= */
sek('S10 · Validierung Stufe 2 (fachlich)');
function codes(liste) { var c = []; for (var k = 0; k < liste.length; k++) c.push(liste[k].code); return c; }
var rMin = Valid.pruefe({ a: 2, l: 200, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rMin.fehler).indexOf('msg_a_min_ec3') >= 0, 'a = 2 mm verletzt das Mindest-a-Mass nach EN 1993-1-8');
var rMax = Valid.pruefe({ a: 9, l: 400, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rMax.warnungen).indexOf('msg_a_max') >= 0, 'a > 0,7*t_min wird als Warnung gemeldet');
var rKurz = Valid.pruefe({ a: 5, l: 35, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rKurz.fehler).indexOf('msg_leff_min') >= 0, 'zu kurze Naht: l_eff < max(6a;30) wird erkannt');
var rLang = Valid.pruefe({ a: 4, l: 1000, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rLang.warnungen).indexOf('msg_l_lang') >= 0, 'Naht laenger als 150*a: Abminderung wird angemahnt');
var rGrenze = Valid.pruefe({ a: 4, l: 600, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rGrenze.warnungen).indexOf('msg_l_lang') < 0, 'genau 150*a ist noch nicht abzumindern (Grenzfall)');

var zAlu = { welt: 'A', rechenrichtung: 'nachweis', werkstoffgruppe: 'alu', werkstoff: 'AW6082',
             zustand: 'T6', zusatzwerkstoff: '5356', stossart: 't_stoss', nahtart: 'kehl_doppel',
             nachweisverfahren: 'richtungsbezogen', lasteingabe: 'direkt', iso5817: 'B', exc: 'EXC2' };
var rAlu = Valid.pruefe({ a: 5, l: 200, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25, gammaMw: 1.25 }, zAlu);
ok(codes(rAlu.hinweise).indexOf('msg_alu_wez') >= 0, 'Aluminium: WEZ-Hinweis erscheint zwingend');
ok(codes(rAlu.hinweise).indexOf('lk_rho_haz_nur_band') >= 0, 'Aluminium: rho_haz-Luecke wird sichtbar gemacht');
var rWelt = Valid.pruefe(gut, z1);
ok(codes(rWelt.hinweise).indexOf('msg_welt_getrennt') >= 0, 'Trennung der Bemessungswelten wird ausgewiesen');
var zB = { welt: 'B', rechenrichtung: 'nachweis', werkstoffgruppe: 'stahl', werkstoff: 'S235',
           stossart: 't_stoss', nahtart: 'kehl_doppel', nahtguete: 'kehlnaht_allgemein',
           lastfall: 'schwellend', lasteingabe: 'direkt', iso5817: 'B', exc: 'EXC2',
           ermuedung_aktiv: true };
var rB = Valid.pruefe({ a: 5, l: 200, t1: 10, t2: 10, b: 120, N: 1, Q: 0, S: 1.5 }, zB);
ok(codes(rB.hinweise).indexOf('msg_lastfall_ermuedung') >= 0,
   'Lastfall + Ermuedung gleichzeitig: Klartext-Hinweis auf zwei getrennte Nachweise');

var leer = Valid.leer();
var alleLeer = true;
for (var lk in leer) if (leer[lk] !== '') alleLeer = false;
ok(alleLeer, '"Leeren" liefert wirklich einen komplett leeren Datensatz');
eq(Object.keys(leer).length, Valid.SCHEMA.length, '"Leeren" erfasst JEDES Feld des Schemas');

/* Eingaben duerfen nicht mutiert werden */
var einObj = { a: 5, l: 200, t1: 10, t2: 10, b: 120, N: 1, Q: 0, gammaM2: 1.25 };
Valid.pruefe(einObj, z1);
eq(einObj.a, 5, 'pruefe() mutiert die uebergebenen Werte nicht');

/* ========================================================================= */
sek('S11 · i18n-Paritaet DE/EN/PT (0 Abweichungen gefordert)');
function paritaetFlach(mod) {
  var fehlend = 0, keys = mod.keys();
  for (var a = 0; a < keys.length; a++) {
    var e = mod.dict[keys[a]];
    for (var b = 0; b < mod.SPRACHEN.length; b++) {
      var l = mod.SPRACHEN[b];
      if (typeof e[l] !== 'string' || e[l].length === 0) { fehlend++; console.log('    fehlt: ' + mod.NAME + '.' + keys[a] + '.' + l); }
    }
  }
  return fehlend;
}
eq(paritaetFlach(Kern), 0, 'i18n_kern: jeder Schluessel in allen drei Sprachen');
eq(paritaetFlach(Kerb), 0, 'i18n_kerbfall: jeder Schluessel in allen drei Sprachen');

var hFehlt = 0, hk = Hilfe.keys();
for (i = 0; i < hk.length; i++) {
  for (j = 0; j < Hilfe.SPRACHEN.length; j++) {
    var spr = Hilfe.dict[hk[i]][Hilfe.SPRACHEN[j]];
    if (!spr) { hFehlt++; continue; }
    for (var f2 = 0; f2 < Hilfe.FELDER.length; f2++) {
      if (typeof spr[Hilfe.FELDER[f2]] !== 'string' || spr[Hilfe.FELDER[f2]].length === 0) {
        hFehlt++; console.log('    fehlt: hilfe.' + hk[i] + '.' + Hilfe.SPRACHEN[j] + '.' + Hilfe.FELDER[f2]);
      }
    }
  }
}
eq(hFehlt, 0, 'i18n_hilfe: was/bereich/tipp in allen drei Sprachen fuer jeden Eintrag');
ok(Kern.keys().length > 150, 'Kern-Woerterbuch hat den erwarteten Umfang (' + Kern.keys().length + ' Schluessel)');

/* ========================================================================= */
sek('S12 · Vollstaendigkeit: jeder Code hat seinen Text');
var ohneText = 0;
for (i = 0; i < Options.GRUPPEN.length; i++) {
  var g = Options.GRUPPEN[i];
  if (!Kern.has('grp_' + g.code)) { ohneText++; console.log('    ohne Text: grp_' + g.code); }
  for (j = 0; j < g.optionen.length; j++) {
    var key = 'opt_' + g.code + '_' + g.optionen[j].code;
    if (!Kern.has(key)) { ohneText++; console.log('    ohne Text: ' + key); }
  }
}
eq(ohneText, 0, 'jede Gruppe und jede Option hat einen Kern-Schluessel');

var ohneHilfe = 0;
for (i = 0; i < Options.GRUPPEN.length; i++) {
  if (!Hilfe.has('grp_' + Options.GRUPPEN[i].code)) { ohneHilfe++; console.log('    ohne Laien-Hilfe: grp_' + Options.GRUPPEN[i].code); }
}
eq(ohneHilfe, 0, 'Laien-ⓘ an JEDER Auswahlgruppe');

var feldOhne = 0;
for (i = 0; i < Valid.SCHEMA.length; i++) {
  var fs = Valid.SCHEMA[i];
  if (!Kern.has(fs.label)) { feldOhne++; console.log('    ohne Text: ' + fs.label); }
  if (!Hilfe.has(fs.hilfe)) { feldOhne++; console.log('    ohne Laien-Hilfe: ' + fs.hilfe); }
  if (!Kern.has(fs.einheit)) { feldOhne++; console.log('    ohne Einheit: ' + fs.einheit); }
}
eq(feldOhne, 0, 'Laien-ⓘ und Beschriftung an JEDEM Eingabefeld');

var ngOhne = 0;
for (i = 0; i < Data.NICHT_GEPRUEFT.length; i++) {
  if (!Kern.has('ng_' + Data.NICHT_GEPRUEFT[i])) { ngOhne++; console.log('    ohne Text: ng_' + Data.NICHT_GEPRUEFT[i]); }
}
eq(ngOhne, 0, 'alle 10 Punkte der Liste "nicht geprueft" sind uebersetzt');

var zbOhne = 0;
for (i = 0; i < Options.ZUSATZBEREICHE.length; i++) {
  if (!Kern.has('zb_' + Options.ZUSATZBEREICHE[i].code)) { zbOhne++; }
}
eq(zbOhne, 0, 'alle Zusatzbereiche sind uebersetzt');

/* ========================================================================= */
sek('S13 · Ehrliche Luecken sind vollstaendig beschriftet');
var L = Data.luecken(), lOhne = 0, gesehen = {};
for (i = 0; i < L.length; i++) {
  if (gesehen[L[i].code]) continue;
  gesehen[L[i].code] = 1;
  if (!Kern.has('lk_' + L[i].code)) { lOhne++; console.log('    ohne Text: lk_' + L[i].code); }
}
ok(Object.keys(gesehen).length >= 5, 'Luecken werden erfasst und gemeldet (' + Object.keys(gesehen).length + ' verschiedene)');
eq(lOhne, 0, 'jede Luecke hat einen erklaerenden Text in allen drei Sprachen');
ok(Kern.has('lk_ec3_11_2005_vor_ac2009'), 'Alt-Wert fu = 510 ist als Hinweis erklaert');
ok(Kern.has('lk_alu_kein_beta_w'), 'Alu-ohne-beta_w ist erklaert');

/* ========================================================================= */
sek('S14 · Determinismus und Unveraenderlichkeit');
var d1 = JSON.stringify(Data.kennwerte('S355', 20));
var d2 = JSON.stringify(Data.kennwerte('S355', 20));
eq(d1, d2, 'kennwerte() ist deterministisch');
var vorher = JSON.stringify(Data.WERKSTOFFE);
Data.kennwerte('AW6082', 10, 'T6'); Data.betaW('S420', 'na_de'); Data.luecken();
eq(JSON.stringify(Data.WERKSTOFFE), vorher, 'Zugriffsfunktionen veraendern die Stammdaten nicht');
var zVor = { welt: 'A', werkstoffgruppe: 'stahl', werkstoff: 'S235' };
var zKopie = JSON.stringify(zVor);
Options.filter('nahtart', zVor); Options.pruefe(zVor); Options.aktiveGruppen(zVor);
eq(JSON.stringify(zVor), zKopie, 'Optionsfunktionen veraendern den Zustand nicht');

/* ========================================================================= */
sek('S15 · Nahtbild-Kern N2 — Hand-Anker gegen geschlossene Formeln');
ok(!!Naht, 'naht.js geladen');
eq(Naht.MODELL_STD, 'exakt', 'Voreinstellung ist das exakte Rechteckmodell');

/* --- Anker 1: Rechteck-Nahtbild, Doppelkehlnaht (Roloff/Matek) --- */
var h1 = 200, b1 = 100, a1 = 5;
var nbRe = [ Naht.linie(-b1 / 2, -h1 / 2, -b1 / 2, h1 / 2, a1),
             Naht.linie( b1 / 2, -h1 / 2,  b1 / 2, h1 / 2, a1) ];
var rRe = Naht.rechne(nbRe);
var rReD = Naht.rechne(nbRe, { modell: 'duennwandig' });
ok(rRe.ok, 'Rechteck-Nahtbild rechnet durch');
nahe(rRe.A, 2 * a1 * h1, 1e-9, 'Hand-Anker A_w = 2*a*h');
nahe(rRe.l_ges, 2 * h1, 1e-9, 'Hand-Anker Nahtlaenge = 2*h');
nahe(rRe.Iy, a1 * h1 * h1 * h1 / 6, 1e-6, 'Hand-Anker I_y = a*h^3/6');
nahe(rReD.Iy, a1 * h1 * h1 * h1 / 6, 1e-6, 'I_y ist in beiden Modellen gleich (senkrechte Naehte)');
nahe(rReD.Iz, 0.5 * a1 * h1 * b1 * b1, 1e-6, 'Hand-Anker I_z = 0,5*a*h*b^2 (Roloff/Matek, duennwandig)');
nahe(rRe.Iz, 0.5 * a1 * h1 * b1 * b1 + 2 * (h1 * a1 * a1 * a1 / 12), 1e-6,
     'exaktes Modell = Roloff/Matek + Eigenanteil in Dickenrichtung');
nahe(rRe.Ip, rRe.Iy + rRe.Iz, 1e-6, 'Hand-Anker I_p = I_y + I_z');
nahe(rRe.ys, 0, 1e-12, 'Schwerpunkt y liegt in der Mitte');
nahe(rRe.zs, 0, 1e-12, 'Schwerpunkt z liegt in der Mitte');
nahe(rRe.Iyz, 0, 1e-9, 'symmetrisches Nahtbild: I_yz = 0');
nahe(rRe.Wy, rRe.Iy / (h1 / 2), 1e-6, 'W_y = I_y / z_rand');
ok(rRe.kontrolle.ok, 'Selbstpruefung des Rechteck-Nahtbilds ist gruen');
var unterschied = Math.abs(rRe.Iz - rReD.Iz) / rRe.Iz;
ok(unterschied < 0.001, 'Unterschied beider Modelle unter 0,1 % (ist ' + (unterschied * 100).toFixed(4) + ' %)');

/* --- Anker 2: umlaufende Kehlnaht am Flachstahl (Voigt, HS Anhalt) --- */
var tF = 40, lF = 200, aF = 4;
var nbUm = [ Naht.linie(-tF / 2, -lF / 2, -tF / 2,  lF / 2, aF),
             Naht.linie( tF / 2, -lF / 2,  tF / 2,  lF / 2, aF),
             Naht.linie(-tF / 2,  lF / 2,  tF / 2,  lF / 2, aF),
             Naht.linie(-tF / 2, -lF / 2,  tF / 2, -lF / 2, aF) ];
var rUm = Naht.rechne(nbUm);
var sollUmIy = 2 * (aF * lF * lF * lF / 12) + 2 * (tF * aF * aF * aF / 12) + 2 * (tF * aF * (lF / 2) * (lF / 2));
var sollUmIz = 2 * (aF * tF * tF * tF / 12) + 2 * (lF * aF * aF * aF / 12) + 2 * (lF * aF * (tF / 2) * (tF / 2));
nahe(rUm.Iy, sollUmIy, 1e-6, 'Hand-Anker Voigt: I_w = 2*(a*l^3/12) + 2*(t*a^3/12) + 2*(t*a*(l/2)^2)');
nahe(rUm.Iz, sollUmIz, 1e-6, 'Hand-Anker Voigt, um 90 Grad gedacht: I_z');
nahe(rUm.A, 2 * aF * lF + 2 * aF * tF, 1e-9, 'A_w der umlaufenden Naht');
ok(rUm.geschlossen, 'umlaufende Naht wird als geschlossenes Nahtbild erkannt');
eq(rUm.offene_enden, 0, 'umlaufende Naht hat keine offenen Enden');

/* --- Anker 3: Kreisnaht am Rohr (Voigt, HS Anhalt) --- */
var dK = 100, aK = 5;
var nbKr = [ Naht.kreis(0, 0, dK, aK) ];
var rKr = Naht.rechne(nbKr);
var rKrD = Naht.rechne(nbKr, { modell: 'duennwandig' });
var DIFF4 = Math.pow(dK + aK, 4) - Math.pow(dK - aK, 4);
nahe(rKr.A, Math.PI / 4 * (Math.pow(dK + aK, 2) - Math.pow(dK - aK, 2)), 1e-6,
     'Hand-Anker A_w = (pi/4)*[(d+a)^2-(d-a)^2]');
nahe(rKr.A, Math.PI * dK * aK, 1e-6, 'gleichwertig: A_w = pi*d*a');
nahe(rKr.l_ges, Math.PI * dK, 1e-9, 'Nahtlaenge l = pi*d (Aussendurchmesser, Festlegung 2.2b)');
nahe(rKr.Iy, Math.PI / 64 * DIFF4, 1e-6, 'Hand-Anker I_w = (pi/64)*[(d+a)^4-(d-a)^4]');
nahe(rKr.Wy, Math.PI * DIFF4 / (32 * (dK + aK)), 1e-6, 'Hand-Anker W_w = pi*[(d+a)^4-(d-a)^4]/[32*(d+a)]');
nahe(rKr.Wt, Math.PI / 16 * DIFF4 / (dK + aK), 1e-6, 'Hand-Anker W_wt = (pi/16)*[(d+a)^4-(d-a)^4]/(d+a)');
nahe(rKrD.Iy, Math.PI * dK * dK * dK * aK / 8, 1e-6, 'duennwandiger Ring: I = pi*d^3*a/8');
nahe(rKr.Ip, 2 * rKr.Iy, 1e-6, 'Kreisnaht: I_p = 2*I_y');
ok(rKr.geschlossen, 'Kreisnaht ist ein geschlossenes Nahtbild');

/* --- Anker 4: reiner Steiner-Anteil (zwei waagerechte Naehte) --- */
var lS = 120, aS = 4, cS = 80;
var nbSt = [ Naht.linie(-lS / 2, -cS, lS / 2, -cS, aS), Naht.linie(-lS / 2, cS, lS / 2, cS, aS) ];
var rSt = Naht.rechne(nbSt);
nahe(rSt.Iy, 2 * (lS * aS * aS * aS / 12) + 2 * (aS * lS * cS * cS), 1e-6,
     'Hand-Anker Steiner: I_y = 2*(l*a^3/12) + 2*(a*l*c^2)');
nahe(rSt.Iz, 2 * (aS * lS * lS * lS / 12), 1e-6, 'Hand-Anker I_z = 2*(a*l^3/12)');

/* ========================================================================= */
sek('S16 · Nahtbild-Kern — Invarianten (zweiter Rechenpfad)');
var rVer = Naht.rechne(Naht.verschiebe(nbRe, 250, -75));
nahe(rVer.Iy, rRe.Iy, 1e-6, 'Verschieben aendert I_y nicht (Schwerpunktbezug)');
nahe(rVer.Iz, rRe.Iz, 1e-6, 'Verschieben aendert I_z nicht');
nahe(rVer.Ip, rRe.Ip, 1e-6, 'Verschieben aendert I_p nicht');
nahe(rVer.ys, 250, 1e-9, 'Schwerpunkt wandert korrekt mit');
nahe(rVer.zs, -75, 1e-9, 'Schwerpunkt wandert korrekt mit (z)');

var rDreh90 = Naht.rechne(Naht.drehe(nbRe, 90, 0, 0));
nahe(rDreh90.Iy, rRe.Iz, 1e-6, 'Drehung um 90 Grad: I_y wird zu I_z');
nahe(rDreh90.Iz, rRe.Iy, 1e-6, 'Drehung um 90 Grad: I_z wird zu I_y');
nahe(rDreh90.Ip, rRe.Ip, 1e-6, 'I_p ist drehinvariant');
var rDreh37 = Naht.rechne(Naht.drehe(nbRe, 37, 12, -8));
nahe(rDreh37.Ip, rRe.Ip, 1e-6, 'I_p bleibt auch bei beliebigem Winkel gleich');
nahe(rDreh37.A, rRe.A, 1e-9, 'A_w ist drehinvariant');

/* Unterteilung: dieselbe Naht in zwei Haelften muss identisch rechnen */
var ganz = [ Naht.linie(0, 0, 0, 200, 5) ];
var geteilt = [ Naht.linie(0, 0, 0, 100, 5), Naht.linie(0, 100, 0, 200, 5) ];
var rG = Naht.rechne(ganz), rT = Naht.rechne(geteilt);
nahe(rT.Iy, rG.Iy, 1e-6, 'Unterteilen eines Segments aendert I_y nicht');
nahe(rT.Iz, rG.Iz, 1e-6, 'Unterteilen eines Segments aendert I_z nicht');
nahe(rT.A, rG.A, 1e-9, 'Unterteilen eines Segments aendert A_w nicht');

/* a-Verdopplung */
var nbRe2a = [ Naht.linie(-b1 / 2, -h1 / 2, -b1 / 2, h1 / 2, 2 * a1),
               Naht.linie( b1 / 2, -h1 / 2,  b1 / 2, h1 / 2, 2 * a1) ];
nahe(Naht.rechne(nbRe2a).A, 2 * rRe.A, 1e-9, 'doppeltes a-Mass verdoppelt A_w exakt');
nahe(Naht.rechne(nbRe2a, { modell: 'duennwandig' }).Iy, 2 * rReD.Iy, 1e-6,
     'doppeltes a-Mass verdoppelt I_y im Linienmodell exakt');

/* Hauptachsen */
var schraeg = [ Naht.linie(0, 0, 100, 100, 4) ];
var rSch = Naht.rechne(schraeg);
ok(rSch.schiefe_biegung, 'schraege Einzelnaht: schiefe Biegung wird erkannt');
nahe(rSch.alpha, -45, 1e-6, 'Hauptachsenwinkel der 45-Grad-Naht ist -45 Grad');
var rZurueck = Naht.rechne(Naht.drehe(schraeg, -rSch.alpha, rSch.ys, rSch.zs));
nahe(rZurueck.Iyz, 0, 1e-6, 'nach Rueckdrehung um alpha verschwindet I_yz');
nahe(rZurueck.Iy, rSch.I1, 1e-6, 'nach Rueckdrehung ist I_y das Hauptflaechenmoment I1');
nahe(rSch.I1 + rSch.I2, rSch.Iy + rSch.Iz, 1e-6, 'I1 + I2 = I_y + I_z');
ok(rSch.I1 >= rSch.I2, 'I1 ist das groessere Hauptflaechenmoment');

/* Unsymmetrisches Nahtbild (Winkelprofil) gegen Handrechnung */
var nbL = [ Naht.linie(0, 0, 100, 0, 5), Naht.linie(0, 0, 0, 60, 5) ];
var rL = Naht.rechne(nbL);
nahe(rL.A, 5 * 100 + 5 * 60, 1e-9, 'Winkel-Nahtbild A_w = 500 + 300');
nahe(rL.ys, (500 * 50 + 300 * 0) / 800, 1e-9, 'Hand-Anker Schwerpunkt ys = 31,25 mm');
nahe(rL.zs, (500 * 0 + 300 * 30) / 800, 1e-9, 'Hand-Anker Schwerpunkt zs = 11,25 mm');
ok(Math.abs(rL.Iyz) > 1, 'unsymmetrisches Nahtbild hat ein Zentrifugalmoment');
ok(rL.kontrolle.ok, 'Selbstpruefung auch beim unsymmetrischen Nahtbild gruen');

/* Determinismus und Unveraenderlichkeit */
eq(JSON.stringify(Naht.rechne(nbUm).Iy), JSON.stringify(Naht.rechne(nbUm).Iy), 'rechne() ist deterministisch');
var kopieVor = JSON.stringify(nbRe);
Naht.rechne(nbRe); Naht.verschiebe(nbRe, 10, 10); Naht.drehe(nbRe, 30, 0, 0); Naht.pruefe(nbRe);
eq(JSON.stringify(nbRe), kopieVor, 'naht.js mutiert die uebergebenen Segmente nicht');

/* ========================================================================= */
sek('S17 · Nahtbild-Kern — Pruefung und ehrliche Hinweise');
function nCodes(liste) { var c = [], q; for (q = 0; q < liste.length; q++) c.push(liste[q].code); return c; }

var pLeer = Naht.rechne([]);
ok(!pLeer.ok, 'leeres Nahtbild wird abgelehnt');
ok(nCodes(pLeer.fehler).indexOf('msg_naht_leer') >= 0, 'Meldung msg_naht_leer erscheint');
ok(pLeer.A === undefined, 'bei Fehler werden keine stillen Teilwerte geliefert');
ok(nCodes(Naht.pruefe([ Naht.linie(0, 0, 0, 100, 0) ]).fehler).indexOf('msg_seg_a') >= 0, 'a = 0 wird erkannt');
ok(nCodes(Naht.pruefe([ Naht.linie(0, 0, 0, 0, 5) ]).fehler).indexOf('msg_seg_laenge') >= 0, 'Segment ohne Laenge wird erkannt');
ok(nCodes(Naht.pruefe([ { typ: 'spirale', a: 4 } ]).fehler).indexOf('msg_seg_typ') >= 0, 'unbekannte Segmentart wird erkannt');
ok(nCodes(Naht.pruefe([ Naht.kreis(0, 0, 20, 20) ]).fehler).indexOf('msg_seg_a_zu_gross') >= 0,
   'Kreisnaht mit a >= d wird abgelehnt');
ok(nCodes(Naht.pruefe([ Naht.linie(0, 0, 0, 12, 5) ]).warnungen).indexOf('msg_seg_duennwand') >= 0,
   'Verletzung der Duennwand-Annahme wird als Warnung gemeldet');

ok(nCodes(rRe.hinweise).indexOf('msg_torsion_offenes_nahtbild') >= 0,
   'offenes Nahtbild: Naeherungscharakter der Torsion wird ausgewiesen');
ok(nCodes(rUm.hinweise).indexOf('msg_torsion_offenes_nahtbild') < 0,
   'geschlossenes Nahtbild bekommt diesen Hinweis nicht');
ok(nCodes(rKr.hinweise).indexOf('msg_kreis_aussendurchmesser') >= 0,
   'Kreisnaht weist den Aussendurchmesser ausdruecklich aus');
ok(nCodes(rL.hinweise).indexOf('msg_hauptachsen_gedreht') >= 0,
   'unsymmetrisches Nahtbild weist auf schiefe Biegung hin');
eq(rRe.offene_enden, 4, 'Doppelkehlnaht hat 4 offene Enden');
eq(rL.offene_enden, 2, 'Winkel-Nahtbild hat 2 offene Enden');
ok(!rRe.geschlossen && rUm.geschlossen && rKr.geschlossen, 'offen/geschlossen wird richtig unterschieden');

/* ========================================================================= */
sek('S18 · Nahtbild-Kern — jede Groesse und jeder Code hat seinen Text');
var grOhne = 0, einhOhne = 0, gk;
for (gk = 0; gk < Naht.GROESSEN.length; gk++) {
  if (!Kern.has('gr_' + Naht.GROESSEN[gk].code)) { grOhne++; console.log('    ohne Text: gr_' + Naht.GROESSEN[gk].code); }
  if (!Kern.has(Naht.GROESSEN[gk].einheit)) { einhOhne++; console.log('    ohne Einheit: ' + Naht.GROESSEN[gk].einheit); }
}
eq(grOhne, 0, 'jede Ergebnisgroesse des Nahtbilds ist beschriftet');
eq(einhOhne, 0, 'jede Ergebnisgroesse traegt eine uebersetzte Einheit');

var cOhne = 0, ck;
for (ck = 0; ck < Naht.CODES.length; ck++) {
  if (!Kern.has(Naht.CODES[ck])) { cOhne++; console.log('    ohne Text: ' + Naht.CODES[ck]); }
}
eq(cOhne, 0, 'jede Meldung des Nahtbild-Kerns ist dreisprachig hinterlegt');

var kernGroessen = ['A', 'ys', 'zs', 'Iy', 'Iz', 'Ip', 'Wy', 'Wt'], hOhne2 = 0, hk2;
for (hk2 = 0; hk2 < kernGroessen.length; hk2++) {
  if (!Hilfe.has('gr_' + kernGroessen[hk2])) { hOhne2++; console.log('    ohne Laien-Hilfe: gr_' + kernGroessen[hk2]); }
}
eq(hOhne2, 0, 'Laien-ⓘ an allen Kerngroessen des Nahtbilds');
ok(Kern.has('nb_modell_exakt') && Kern.has('nb_modell_duennwandig'), 'beide Rechenmodelle sind benannt');

/* ========================================================================= */
sek('S19 · Profileingabe N2b — Umfaenge gegen geschlossene Formeln (Hand-Anker)');

/* Muster-Abmessungen je Profil — Grundlage der Vollstaendigkeitslaeufe. */
function mustermasse(profil, kanten) {
  var m = { profil: profil, kanten: kanten };
  if (profil === 'blech')         { m.b = 200; m.t1 = 20; m.a = 5; }
  if (profil === 'rohr_rechteck') { m.b = 100; m.h = 60; m.t1 = 4; m.r_ecke = 8; m.a = 4; }
  if (profil === 'rohr_rund')     { m.d = 114.3; m.t1 = 6; m.a = 5; }
  if (profil === 'i_profil')      { m.b = 100; m.h = 200; m.tw = 5.6; m.tf = 8.5; m.a = 4; }
  if (profil === 'u_profil')      { m.b = 50; m.h = 100; m.tw = 6; m.tf = 8.5; m.a = 4; }
  if (profil === 'winkel')        { m.b = 80; m.h = 80; m.t1 = 8; m.a = 4; }
  if (profil === 'vollrund')      { m.d = 50; m.a = 5; }
  return m;
}
function hatCode(liste, code) {
  for (var q = 0; q < (liste || []).length; q++) if (liste[q].code === code) return true;
  return false;
}
function bau(o) { return Profil.baue(o); }

/* Anker 1: Blech rundum  U = 2*(b + t) */
var pB = bau({ profil: 'blech', kanten: 'rundum', b: 200, t1: 12, a: 5 });
ok(pB.ok, 'Blech rundum wird gebaut');
nahe(pB.l_brutto, 2 * (200 + 12), 1e-9, 'Blech rundum: U = 2*(b+t)');
nahe(pB.l_netto, pB.l_brutto, 1e-9, 'umlaufende Naht: kein Endkraterabzug');
eq(pB.raupen, 1, 'Blech rundum ist EINE umlaufende Raupe');
ok(pB.umlaufend, 'Blech rundum wird als umlaufend gemeldet');

/* Anker 2: Blech, nur Flanken  l = 2*(b - 2a) */
var pF = bau({ profil: 'blech', kanten: 'flanken', b: 200, t1: 12, a: 5 });
nahe(pF.l_brutto, 400, 1e-9, 'Blech Flanken: Bruttolaenge 2*b');
nahe(pF.l_netto, 2 * (200 - 2 * 5), 1e-9, 'Blech Flanken: l = 2*(b - 2a) — Endkraterabzug');
eq(pF.raupen, 2, 'zwei getrennte Raupen');
eq(pF.offene_raupen, 2, 'beide Raupen sind offen');

/* Anker 3: Rechteck-Hohlprofil mit Eckradius  U = 2*(b+h) - 8*r */
var pR = bau({ profil: 'rohr_rechteck', kanten: 'rundum', b: 100, h: 60, t1: 4, r_ecke: 8, a: 4 });
nahe(pR.l_brutto, 2 * (100 + 60) - 8 * 8, 1e-9, 'Rechteckrohr: U = 2*(b+h) - 8*r');
nahe(pR.l_kontur, pR.l_brutto + 2 * Math.PI * 8, 1e-9, 'geometrischer Umfang mit den vier Viertelboegen');
nahe(pR.bogen_nicht_gerechnet, 2 * Math.PI * 8, 1e-9, 'nicht gerechneter Bogenanteil wird ausgewiesen');
ok(pR.umlaufend, 'Rechteckrohr rundum bleibt trotz Ecklücken umlaufend');
nahe(pR.l_netto, pR.l_brutto, 1e-9, 'kein Endkraterabzug an der umlaufenden Rohrnaht');

/* Anker 3b: ohne Eckradius schliesst sich das Nahtbild geometrisch wirklich */
var pR0 = bau({ profil: 'rohr_rechteck', kanten: 'rundum', b: 100, h: 60, t1: 4, r_ecke: 0, a: 4 });
nahe(pR0.l_brutto, 2 * (100 + 60), 1e-9, 'Rechteckrohr ohne Radius: U = 2*(b+h)');
eq(Naht.offeneEnden(pR0.segmente), 0, 'ohne Eckradius meldet der Nahtbild-Kern ein geschlossenes Nahtbild');
ok(Naht.offeneEnden(pR.segmente) > 0, 'mit Eckradius sieht der Kern Luecken — deshalb der ehrliche Zusatzhinweis');

/* Anker 4: Rundrohr  l = pi*d (Aussendurchmesser) */
var pD = bau({ profil: 'rohr_rund', kanten: 'rundum', d: 114.3, t1: 6, a: 5 });
nahe(pD.l_brutto, Math.PI * 114.3, 1e-9, 'Rundrohr: l = pi*d mit dem Aussendurchmesser');
eq(pD.n_seg, 1, 'Rundrohr ergibt genau ein Kreissegment');
var rD2 = Naht.rechne(pD.segmente);
nahe(rD2.A, Math.PI * 114.3 * 5, 1e-9, 'Rundrohr: A = pi*d*a');

/* Anker 5: I-Profil rundum  U = 2*h + 4*b - 2*tw (unabhaengig von tf) */
var pI = bau({ profil: 'i_profil', kanten: 'rundum', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
nahe(pI.l_brutto, 2 * 200 + 4 * 100 - 2 * 5.6, 1e-9, 'I-Profil rundum: U = 2h + 4b - 2tw');
eq(pI.n_seg, 12, 'I-Profil rundum besteht aus 12 Segmenten');
var pI2 = bau({ profil: 'i_profil', kanten: 'rundum', b: 100, h: 200, tw: 5.6, tf: 14, a: 4 });
nahe(pI2.l_brutto, pI.l_brutto, 1e-9, 'Flanschdicke aendert den Umfang nicht (zweiter Rechenpfad)');

/* Anker 6: U-Profil rundum  U = 2*h + 4*b - 2*tw */
var pU = bau({ profil: 'u_profil', kanten: 'rundum', b: 50, h: 100, tw: 6, tf: 8.5, a: 4 });
nahe(pU.l_brutto, 2 * 100 + 4 * 50 - 2 * 6, 1e-9, 'U-Profil rundum: U = 2h + 4b - 2tw');
eq(pU.n_seg, 8, 'U-Profil rundum besteht aus 8 Segmenten');

/* Anker 7: Winkel rundum  U = 2*(b + h), unabhaengig von der Dicke */
var pW = bau({ profil: 'winkel', kanten: 'rundum', b: 80, h: 80, t1: 8, a: 4 });
nahe(pW.l_brutto, 2 * (80 + 80), 1e-9, 'Winkel rundum: U = 2*(b+h)');
var pW2 = bau({ profil: 'winkel', kanten: 'rundum', b: 80, h: 80, t1: 12, a: 4 });
nahe(pW2.l_brutto, pW.l_brutto, 1e-9, 'Winkeldicke aendert den Umfang nicht');
var pWF = bau({ profil: 'winkel', kanten: 'flanken', b: 80, h: 80, t1: 8, a: 4 });
eq(pWF.raupen, 1, 'die beiden Aussenschenkel sind EINE Raupe um die Ecke');
nahe(pWF.l_netto, 80 + 80 - 2 * 4, 1e-9, 'Winkel Flanken: l = b + h - 2a (nur zwei freie Enden)');

/* Anker 8: Vollrund  l = pi*d */
var pV = bau({ profil: 'vollrund', kanten: 'rundum', d: 50, a: 5 });
nahe(pV.l_brutto, Math.PI * 50, 1e-9, 'Vollrund: l = pi*d');

/* Zweiter Rechenpfad: umfang() gegen die Summe der Segmentlaengen */
var zpFehler = 0, pk, kk, kl, pr2;
for (pk = 0; pk < Profil.PROFILE.length; pk++) {
  kl = Profil.kantenFuer(Profil.PROFILE[pk]);
  for (kk = 0; kk < kl.length; kk++) {
    pr2 = bau(mustermasse(Profil.PROFILE[pk], kl[kk]));
    if (!pr2.ok) { zpFehler++; continue; }
    if (Math.abs(Profil.umfang(Profil.PROFILE[pk], kl[kk], mustermasse(Profil.PROFILE[pk], kl[kk])) - pr2.l_brutto) > 1e-9) zpFehler++;
  }
}
eq(zpFehler, 0, 'umfang() und die gebauten Segmente stimmen bei jeder Kombination ueberein');

/* ========================================================================= */
sek('S20 · Profileingabe — Endkrater, Eckradien, a je Segment');

/* Endkraterabzug nur an FREIEN ENDEN, nicht an inneren Stossstellen */
var eI = bau({ profil: 'i_profil', kanten: 'flansche', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
eq(eI.raupen, 2, 'Flanschnaht laeuft je Flansch in EINEM Zug um den Flansch');
nahe(eI.l_netto, eI.l_brutto - 2 * 2 * 4, 1e-9, 'nur zwei freie Enden je Flansch — nicht je Segment');
eq(eI.n_seg, 10, 'die Flanschraupen bestehen aus 5 Segmenten je Flansch');

/* Gleiche Geometrie, aber einzeln geschweisst: vier Raupen = vier Mal 2a */
var eIrund = bau({ profil: 'i_profil', kanten: 'rundum', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
var eIein  = bau({ profil: 'i_profil', kanten: 'flansche_steg', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
nahe(eIein.l_brutto, eIrund.l_brutto, 1e-9, 'rundum und einzeln geschweisst haben dieselbe Geometrie');
nahe(eIrund.l_netto - eIein.l_netto, 4 * 2 * 4, 1e-9, 'einzeln geschweisst kostet 4 x 2a — genau hier wird von Hand falsch gerechnet');

/* Abzug laeuft ueber Segmentgrenzen hinweg (kurzes Anfangssegment) */
var eL = bau({ profil: 'i_profil', kanten: 'flansche', b: 60, h: 120, tw: 5, tf: 8, a: 30 });
ok(eL.ok, 'grosser Abzug bleibt rechenbar, solange die Raupe lang genug ist');
nahe(eL.l_brutto, 2 * (2 * 60 - 5 + 2 * 8), 1e-9, 'Bruttolaenge der beiden Flanschraupen');
nahe(eL.l_netto, eL.l_brutto - 4 * 30, 1e-9, 'Abzug wird ueber Segmentgrenzen hinweg verrechnet');
eq(eL.n_seg, 6, 'vollstaendig aufgezehrte Segmente verschwinden aus dem Nahtbild');

/* Zu kurze Naht: ehrlicher Fehler statt einer Zahl */
var eK = bau({ profil: 'blech', kanten: 'flanken', b: 15, t1: 10, a: 8 });
ok(!eK.ok, 'zu kurze Naht wird nicht gerechnet');
eq(eK.fehler[0].code, 'msg_endkrater_zu_lang', 'ehrlicher Fehlercode statt eines stillen Teilwerts');
eq(eK.segmente.length, 0, 'im Fehlerfall gibt es KEINE Segmente');

/* Abschaltbarer Abzug (nur mit Auslaufblechen) */
var eA = bau({ profil: 'blech', kanten: 'flanken', b: 200, t1: 12, a: 5, endkrater: false });
nahe(eA.l_netto, eA.l_brutto, 1e-9, 'ohne Endkraterabzug bleibt die Bruttolaenge stehen');
ok(hatCode(eA.warnungen, 'msg_endkrater_aus'), 'das Abschalten wird ausdruecklich gewarnt');

/* Eckradius: Umfang wird kuerzer, Hinweise erscheinen */
var e0 = bau({ profil: 'rohr_rechteck', kanten: 'rundum', b: 120, h: 80, t1: 5, r_ecke: 0, a: 4 });
var e8 = bau({ profil: 'rohr_rechteck', kanten: 'rundum', b: 120, h: 80, t1: 5, r_ecke: 10, a: 4 });
nahe(e0.l_brutto - e8.l_brutto, 8 * 10, 1e-9, 'jeder Eckradius kostet 8*r an gerechneter Nahtlaenge');
ok(hatCode(e8.hinweise, 'msg_eckradius_verkuerzt'), 'Eckradius wird ehrlich erklaert');
ok(hatCode(e8.hinweise, 'msg_eckluecke_keine_offene_naht'), 'die Ecklücken werden vom offenen Nahtbild abgegrenzt');
ok(!hatCode(e0.hinweise, 'msg_eckradius_verkuerzt'), 'ohne Radius kein Eckradius-Hinweis');
var eR = bau({ profil: 'rohr_rechteck', kanten: 'rundum', b: 60, h: 40, t1: 4, r_ecke: 25, a: 4 });
ok(!eR.ok && eR.fehler[0].code === 'msg_mass_r_zu_gross', 'zu grosser Eckradius wird abgefangen');

/* a-Mass je Segment: Steg und Flansch getrennt */
var aS = bau({ profil: 'i_profil', kanten: 'flansche_steg', b: 100, h: 200, tw: 5.6, tf: 8.5,
               a: 4, a_steg: 3, a_flansch: 5 });
var aSteg = 0, aFl = 0, ii;
for (ii = 0; ii < aS.info.length; ii++) {
  if (aS.info[ii].gruppe === 'steg' && aS.info[ii].a === 3) aSteg++;
  if ((aS.info[ii].gruppe === 'flansch' || aS.info[ii].gruppe === 'kante') && aS.info[ii].a === 5) aFl++;
}
eq(aSteg, 2, 'beide Stegsegmente tragen a_steg');
eq(aFl, 10, 'alle Flansch- und Kantensegmente tragen a_flansch');
ok(hatCode(aS.hinweise, 'msg_a_je_segment'), 'unterschiedliche a-Masse werden im Ergebnis benannt');
nahe(aS.endkrater_abzug, 2 * 2 * 5 + 2 * 2 * 3, 1e-9, 'der Endkrater wird mit dem a des jeweiligen Endsegments abgezogen');
var aT = 0;
for (ii = 0; ii < aS.info.length; ii++) if (aS.info[ii].gruppe === 'steg') aT += (aS.info[ii].t === 5.6) ? 1 : 0;
eq(aT, 2, 'die Bauteildicke am Steg wird je Segment mitgefuehrt (Futter fuer die a-Grenzen in N3)');

/* ========================================================================= */
sek('S21 · Profileingabe — jede Kombination liefert ein rechenbares Nahtbild');

var komb = 0, kFehler = 0, kKontrolle = 0, kFlaeche = 0, kCode = 0, kGruppe = 0, jj;
for (pk = 0; pk < Profil.PROFILE.length; pk++) {
  var pcode = Profil.PROFILE[pk];
  kl = Profil.kantenFuer(pcode);
  ok(kl.length > 0, 'Profil ' + pcode + ' bietet mindestens eine Kantenauswahl');
  for (kk = 0; kk < kl.length; kk++) {
    komb++;
    var pp = bau(mustermasse(pcode, kl[kk]));
    if (!pp.ok) { kFehler++; console.log('    baut nicht: ' + pcode + ' / ' + kl[kk]); continue; }
    var rr = Naht.rechne(pp.segmente);
    if (!rr.ok) { kFehler++; continue; }
    if (!rr.kontrolle.ok) kKontrolle++;
    var soll = 0;
    for (jj = 0; jj < pp.info.length; jj++) {
      soll += pp.info[jj].a * pp.info[jj].l;
      if (!pp.info[jj].code) kCode++;
      if (Profil.SEGMENTGRUPPEN.indexOf(pp.info[jj].gruppe) < 0) kGruppe++;
    }
    if (Math.abs(rr.A - soll) > 1e-6 * Math.max(1, soll)) kFlaeche++;
  }
}
eq(komb, 19, 'alle 19 Profil-/Kantenkombinationen sind abgedeckt');
eq(kFehler, 0, 'jede Kombination liefert ein rechenbares Nahtbild');
eq(kKontrolle, 0, 'die Selbstpruefung des Nahtbild-Kerns ist bei jeder Kombination gruen');
eq(kFlaeche, 0, 'A_w stimmt bei jeder Kombination mit SUMME(a*l) ueberein (zweiter Rechenpfad)');
eq(kCode, 0, 'jedes Segment traegt einen Herkunfts-Code fuer Grafik und Rechenweg');
eq(kGruppe, 0, 'jedes Segment traegt eine bekannte Segmentgruppe');

/* Symmetrie und Unsymmetrie muessen sich im Nahtbild wiederfinden */
var sB = Naht.rechne(bau({ profil: 'blech', kanten: 'rundum', b: 200, t1: 12, a: 5 }).segmente);
nahe(sB.ys, 0, 1e-9, 'Blech rundum: Schwerpunkt liegt in der Mitte (ys)');
nahe(sB.zs, 0, 1e-9, 'Blech rundum: Schwerpunkt liegt in der Mitte (zs)');
nahe(sB.Iyz, 0, 1e-6, 'Blech rundum: kein Zentrifugalmoment');
var sI = Naht.rechne(bau({ profil: 'i_profil', kanten: 'rundum', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 }).segmente);
nahe(sI.ys, 0, 1e-9, 'I-Profil rundum ist doppelt symmetrisch (ys)');
nahe(sI.zs, 0, 1e-9, 'I-Profil rundum ist doppelt symmetrisch (zs)');
ok(sI.Iy > sI.Iz, 'I-Profil: Iy ist deutlich groesser als Iz');
var sU = Naht.rechne(bau({ profil: 'u_profil', kanten: 'rundum', b: 50, h: 100, tw: 6, tf: 8.5, a: 4 }).segmente);
nahe(sU.zs, 0, 1e-9, 'U-Profil ist zur y-Achse symmetrisch');
ok(Math.abs(sU.ys) > 1, 'U-Profil: der Schwerpunkt des Nahtbilds liegt NICHT in der Profilmitte');
var sE = Naht.rechne(bau({ profil: 'blech', kanten: 'eine_flanke', b: 200, t1: 12, a: 5 }).segmente);
nahe(sE.zs, -6, 1e-9, 'einseitige Kehlnaht: der Schwerpunkt liegt auf der geschweissten Seite');

/* ========================================================================= */
sek('S22 · Profileingabe — Fehlerfaelle, Determinismus, Nichtmutation');

function fehlerCode(o) { var r = bau(o); return r.ok ? '(ok)' : (r.fehler[0] && r.fehler[0].code); }
eq(fehlerCode({ kanten: 'rundum', b: 100, t1: 10, a: 5 }), 'msg_profil_fehlt', 'fehlendes Profil');
eq(fehlerCode({ profil: 'traeger', kanten: 'rundum', b: 100, t1: 10, a: 5 }), 'msg_profil_unbekannt', 'unbekanntes Profil');
eq(fehlerCode({ profil: 'blech', b: 100, t1: 10, a: 5 }), 'msg_kanten_fehlt', 'fehlende Kantenauswahl');
eq(fehlerCode({ profil: 'blech', kanten: 'flansche', b: 100, t1: 10, a: 5 }), 'msg_kanten_unpassend', 'Kantenauswahl passt nicht zum Profil');
eq(fehlerCode({ profil: 'blech', kanten: 'rundum', t1: 10, a: 5 }), 'msg_mass_fehlt', 'fehlendes Profilmass');
eq(fehlerCode({ profil: 'blech', kanten: 'rundum', b: 100, t1: 10 }), 'msg_profil_a_fehlt', 'fehlendes a-Mass');
eq(fehlerCode({ profil: 'i_profil', kanten: 'rundum', b: 100, h: 20, tw: 5, tf: 12, a: 4 }), 'msg_mass_tf_zu_gross', 'Flansche dicker als das halbe Profil');
eq(fehlerCode({ profil: 'i_profil', kanten: 'rundum', b: 10, h: 200, tw: 12, tf: 8, a: 4 }), 'msg_mass_tw_zu_gross', 'Steg breiter als der Flansch');
eq(fehlerCode({ profil: 'winkel', kanten: 'rundum', b: 40, h: 40, t1: 40, a: 4 }), 'msg_mass_t_zu_gross', 'Winkeldicke erreicht die Schenkellaenge');
eq(fehlerCode({ profil: 'rohr_rund', kanten: 'rundum', d: 20, t1: 3, a: 25 }), 'msg_seg_a_zu_gross', 'a groesser als der Rohrdurchmesser wird vom Nahtbild-Kern abgefangen');
var fM = bau({ profil: 'blech', kanten: 'rundum', t1: 10, a: 5 });
eq(fM.fehler[0].feld, 'b', 'der Fehler benennt das betroffene Feld');

var detEin = { profil: 'i_profil', kanten: 'flansche', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 };
var detKopie = JSON.stringify(detEin);
var det1 = JSON.stringify(bau(detEin));
var det2 = JSON.stringify(bau(detEin));
eq(det1, det2, 'baue() ist deterministisch');
eq(JSON.stringify(detEin), detKopie, 'baue() mutiert die Eingabe nicht');
var kanten1 = Profil.kantenFuer('blech');
kanten1.push('unsinn');
eq(Profil.kantenFuer('blech').length, 4, 'kantenFuer() gibt eine Kopie zurueck');
var wieder = bau(detEin);
nahe(wieder.l_netto, JSON.parse(det1).l_netto, 1e-12, 'wiederholter Aufruf liefert dasselbe Ergebnis');

/* ========================================================================= */
sek('S23 · Profileingabe — Auswahlquelle, Felder und Texte stimmen ueberein');

eq(Options.codes('profil', {}).join(','), Profil.PROFILE.join(','),
   'optionen.js und profil.js kennen dieselben Profile in derselben Reihenfolge');
var kAbw = 0;
for (pk = 0; pk < Profil.PROFILE.length; pk++) {
  var a1 = Options.codes('kanten', { profil: Profil.PROFILE[pk] }).slice().sort().join(',');
  var a2 = Profil.kantenFuer(Profil.PROFILE[pk]).slice().sort().join(',');
  if (a1 !== a2) { kAbw++; console.log('    Abweichung bei ' + Profil.PROFILE[pk] + ': ' + a1 + ' / ' + a2); }
}
eq(kAbw, 0, 'die Kantenauswahl ist in optionen.js und profil.js identisch');
eq(Options.codes('kanten', { profil: 'blech', nahtart: 'kehl_umlaufend' }).join(','), 'rundum',
   'eine ausdruecklich umlaufende Kehlnaht laesst nur "rundum" zu');
ok(Options.gruppeAktiv('kanten', { profil: 'rohr_rund' }), 'die Kantenfrage erscheint auch beim Rundrohr');

var mFehlt = 0, mk, ml;
for (pk = 0; pk < Profil.PROFILE.length; pk++) {
  ml = Profil.masseFuer(Profil.PROFILE[pk]);
  for (mk = 0; mk < ml.length; mk++) {
    if (!Valid.feld(ml[mk].code)) { mFehlt++; console.log('    kein Eingabefeld: ' + ml[mk].code); }
  }
}
eq(mFehlt, 0, 'jedes Profilmass hat ein Eingabefeld mit Beschriftung und Laien-ⓘ');

var pflichtFehlt = 0;
var zProfil = { profil: 'i_profil' };
if (!Valid.istPflicht(Valid.feld('tw'), zProfil)) pflichtFehlt++;
if (!Valid.istPflicht(Valid.feld('tf'), zProfil)) pflichtFehlt++;
if (Valid.istPflicht(Valid.feld('d'), zProfil)) pflichtFehlt++;
if (!Valid.istPflicht(Valid.feld('d'), { profil: 'rohr_rund' })) pflichtFehlt++;
if (Valid.istPflicht(Valid.feld('tw'), { profil: 'blech' })) pflichtFehlt++;
eq(pflichtFehlt, 0, 'Profilmasse sind genau dort Pflicht, wo das gewaehlte Profil sie braucht');

var cOhne3 = 0;
for (ii = 0; ii < Profil.CODES.length; ii++) {
  if (!Kern.has(Profil.CODES[ii])) { cOhne3++; console.log('    ohne Text: ' + Profil.CODES[ii]); }
}
eq(cOhne3, 0, 'jede Meldung der Profileingabe ist dreisprachig hinterlegt');
var sgOhne = 0;
for (ii = 0; ii < Profil.SEGMENTGRUPPEN.length; ii++) {
  if (!Kern.has('sg_' + Profil.SEGMENTGRUPPEN[ii])) { sgOhne++; }
}
eq(sgOhne, 0, 'jede Segmentgruppe ist beschriftet');
var prKeys = ['pr_titel', 'pr_profil', 'pr_kanten', 'pr_raupen', 'pr_umlaufend', 'pr_offen',
              'pr_l_brutto', 'pr_l_netto', 'pr_l_kontur', 'pr_endkrater', 'pr_bogen',
              'pr_handanker', 'pr_anker_rohr', 'pr_anker_kreis', 'pr_anker_iprofil', 'pr_anker_endkrater'];
var prOhne = 0;
for (ii = 0; ii < prKeys.length; ii++) if (!Kern.has(prKeys[ii])) { prOhne++; console.log('    ohne Text: ' + prKeys[ii]); }
eq(prOhne, 0, 'alle Beschriftungen der Profilkarte sind vorhanden');

/* ========================================================================= */
sek('S24 · SVG-Bausteinbibliothek N2c — Auto-Skalierung und Formatdisziplin');
ok(!!Svg && !!Bild, 'svglib.js und schaubild.js geladen');
ok(typeof Svg.VERSION === 'string' && typeof Bild.VERSION === 'string', 'beide Module tragen eine Version');

eq(Svg.zahl(-0.0001), '0', 'Zahlformat: kein "-0" im SVG');
eq(Svg.zahl(12.3456), '12.346', 'Zahlformat: drei Nachkommastellen');
eq(Svg.zahl(2), '2', 'Zahlformat: keine unnoetigen Nullen');
eq(Svg.zahl(0.0000001), '0', 'Zahlformat: kein Exponent (1e-7 wird 0)');
eq(Svg.zahl(NaN), '0', 'Zahlformat: NaN wird nie ausgegeben');

var bx = Svg.box([{ y: -50, z: -30 }, { y: 50, z: 30 }]);
eq(bx.breite, 100, 'Bounding-Box Breite'); eq(bx.hoehe, 60, 'Bounding-Box Hoehe');
ok(Svg.box([]).leer === true, 'leere Punktliste ergibt eine leere Box');
var bv = Svg.boxVereinigen(bx, Svg.box([{ y: 0, z: 100 }]));
eq(bv.z_max, 100, 'Boxen lassen sich vereinigen (Naht + Kontur)');

/* Auto-Skalierung: der 20-mm-Bolzen fuellt die Flaeche genauso wie der
   1000-mm-Traeger — genau das ist der Sinn der Sicht. */
var vKlein = Svg.sicht(Svg.box([{ y: -10, z: -10 }, { y: 10, z: 10 }]), { breite: 320, hoehe: 240, rand: 16 });
var vGross = Svg.sicht(Svg.box([{ y: -150, z: -500 }, { y: 150, z: 500 }]), { breite: 320, hoehe: 240, rand: 16 });
nahe(vKlein.pl(20), 208, 1e-9, 'kleines Bauteil fuellt die Hoehe der Zeichenflaeche');
nahe(vGross.pl(1000), 208, 1e-9, 'grosses Bauteil fuellt dieselbe Hoehe');
ok(vKlein.skala > vGross.skala, 'der Massstab passt sich an (klein wird groesser gezeichnet)');
nahe(vKlein.px(0), 160, 1e-9, 'Bild ist waagerecht zentriert');
nahe(vKlein.pz(0), 120, 1e-9, 'Bild ist senkrecht zentriert');
ok(vKlein.pz(10) < vKlein.pz(-10), 'z zeigt nach OBEN (SVG-Y wird gedreht)');
nahe(vKlein.mm_je_px, 1 / vKlein.skala, 1e-12, 'mm je Bildpunkt ist der Kehrwert des Massstabs');

var vLinie = Svg.sicht(Svg.box([{ y: 0, z: -100 }, { y: 0, z: 100 }]), { breite: 320, hoehe: 240, rand: 16 });
ok(isFinite(vLinie.skala) && vLinie.skala > 0, 'entartete Box (Breite 0) ergibt trotzdem einen endlichen Massstab');
var vPunkt = Svg.sicht(Svg.box([{ y: 5, z: 5 }]), { breite: 320, hoehe: 240, rand: 16 });
ok(isFinite(vPunkt.px(5)) && isFinite(vPunkt.pz(5)), 'einzelner Punkt ergibt keine Division durch 0');

/* Jeder Baustein liefert ein wohlgeformtes Element — und niemals Text. */
var v0 = Svg.sicht(bx, { breite: 320, hoehe: 240, rand: 16 });
var bausteine = [
  ['linie', Svg.linie(v0, -50, -30, 50, 30, { farbe: '#3d9ae0', breite: 3 }), /^<line /],
  ['polylinie', Svg.polylinie(v0, [{ y: 0, z: 0 }, { y: 10, z: 10 }], {}), /^<polyline /],
  ['polygon', Svg.polylinie(v0, [{ y: 0, z: 0 }, { y: 10, z: 0 }, { y: 0, z: 10 }], { geschlossen: true }), /^<polygon /],
  ['kreis', Svg.kreis(v0, 0, 0, 40, {}), /^<circle /],
  ['rechteck', Svg.rechteck(v0, 0, 0, 40, 20, {}), /^<rect /],
  ['nahtdreieck', Svg.nahtdreieck(v0, 0, 0, 5, 45, {}), /^<polygon /],
  ['kraftpfeil', Svg.kraftpfeil(v0, -20, 0, 20, 0, {}), /^<line /],
  ['masslinie', Svg.masslinie(v0, -20, -20, 20, -20, {}), /^<line /],
  ['schraffur', Svg.schraffur(v0, 0, 0, 40, 20, {}), /^<line /],
  ['punktmarke', Svg.punktmarke(v0, 10, 10, { code: 'p1' }), /^<circle /],
  ['schwerpunktkreuz', Svg.schwerpunktkreuz(v0, 0, 0, {}), /^<circle /],
  ['achsenkreuz', Svg.achsenkreuz(v0, 0, 0, {}), /^<line /],
  ['rahmen', Svg.rahmen(v0, {}), /^<rect /]
];
var bFehler = 0, bText = 0, bZahl = 0, bi;
for (bi = 0; bi < bausteine.length; bi++) {
  var st = bausteine[bi][1];
  if (!bausteine[bi][2].test(st)) { bFehler++; console.log('    falsches Element: ' + bausteine[bi][0]); }
  if (st.indexOf('<text') >= 0 || st.indexOf('<tspan') >= 0) bText++;
  if (/NaN|Infinity|undefined|e[+-]\d/.test(st)) { bZahl++; console.log('    unsaubere Zahl: ' + bausteine[bi][0]); }
}
eq(bausteine.length, 13, '13 Grundbausteine stehen bereit');
eq(bFehler, 0, 'jeder Baustein liefert das richtige SVG-Element');
eq(bText, 0, 'KEIN Baustein erzeugt Text im SVG (Uebersetzbarkeit, 4.3)');
eq(bZahl, 0, 'kein NaN, kein Exponent, kein undefined in den Koordinaten');
ok(/data-code="p1"/.test(Svg.punktmarke(v0, 1, 1, { code: 'p1' })), 'Beschriftungspunkt traegt einen sprachneutralen Code');
var mSan = Svg.punktmarke(v0, 1, 1, { code: 'a<b>"c' }).match(/data-code="([^"]*)"/);
eq(mSan && mSan[1], 'abc', 'Codes werden gesaeubert (kein Einschleusen von Markup)');
var huelle = Svg.svg(v0, Svg.linie(v0, 0, 0, 10, 10, {}), { klasse: 'x' });
ok(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 320 240"/.test(huelle), 'Huelle traegt xmlns und viewBox');
ok(huelle.indexOf('<image') < 0 && huelle.indexOf('href') < 0, 'kein fremdes Bild, keine externe Referenz');
eq(Svg.linie(v0, 0, 0, 1, 1, { farbe: '#111' }), Svg.linie(v0, 0, 0, 1, 1, { farbe: '#111' }), 'svglib ist deterministisch');

/* ========================================================================= */
sek('S25 · Nahtbild-Grafik N2c — gezeichnet wird, was gerechnet wird');
eq(Bild.GRUPPEN.join(','), Profil.SEGMENTGRUPPEN.join(','), 'Grafik und Profileingabe nutzen dieselben Segmentgruppen (eine Quelle)');
var fOhne = 0, fDoppelt = 0, fSet = {}, gi;
for (gi = 0; gi < Profil.SEGMENTGRUPPEN.length; gi++) {
  var grp = Profil.SEGMENTGRUPPEN[gi];
  if (!Bild.FARBEN[grp]) { fOhne++; console.log('    ohne Farbe: ' + grp); }
  else { if (fSet[Bild.FARBEN[grp]]) fDoppelt++; fSet[Bild.FARBEN[grp]] = 1; }
  if (!Kern.has('sg_' + grp)) fOhne++;
}
eq(fOhne, 0, 'jede Segmentgruppe hat eine Farbe UND eine dreisprachige Beschriftung');
eq(fDoppelt, 0, 'keine zwei Segmentgruppen teilen sich eine Farbe');
var cOhne4 = 0, ci;
for (ci = 0; ci < Bild.CODES.length; ci++) if (!Kern.has(Bild.CODES[ci])) { cOhne4++; console.log('    ohne Text: ' + Bild.CODES[ci]); }
for (ci = 0; ci < Bild.LEGENDE_CODES.length; ci++) if (!Kern.has(Bild.LEGENDE_CODES[ci])) { cOhne4++; console.log('    ohne Text: ' + Bild.LEGENDE_CODES[ci]); }
eq(cOhne4, 0, 'jede Meldung und jeder Legendeneintrag ist dreisprachig hinterlegt');
var sbKeys = ['sb_titel', 'sb_legende', 'sb_massstab', 'sb_mm_je_px'], sbOhne = 0;
for (ci = 0; ci < sbKeys.length; ci++) if (!Kern.has(sbKeys[ci])) sbOhne++;
eq(sbOhne, 0, 'alle Beschriftungen der Grafikkarte sind vorhanden');

var gLeer = Bild.zeichne({ segmente: [] });
ok(gLeer.ok === false, 'ohne Segmente wird nicht gezeichnet');
eq(gLeer.svg, '', 'im Fehlerfall gibt es KEIN halbes Bild');
eq(gLeer.fehler[0].code, 'msg_grafik_leer', 'der Fehler ist benannt');

var gRohr = Bild.ausProfil({ profil: 'rohr_rechteck', kanten: 'rundum', b: 100, h: 60, t1: 4, r_ecke: 8, a: 4 });
ok(gRohr.ok, 'Rechteckrohr rundum wird gezeichnet');
eq(gRohr.n_seg, 4, 'vier gezeichnete Nahtsegmente');
eq(gRohr.n_kontur, 4, 'die volle Profilkontur wird mitgeliefert');
eq(gRohr.n_luecken, 4, 'die vier Ecklücken werden sichtbar gemacht');
eq((gRohr.svg.match(/<line/g) || []).length, 16, '16 Linien: 4 Naht + 4 Kontur + 4 Lücken + 2 Achsen + 2 Kreuz');
eq((gRohr.svg.match(/<circle/g) || []).length, 1, 'ein Schwerpunktkreis');
ok(gRohr.svg.indexOf('<text') < 0, 'kein Text im fertigen Nahtbild');
ok(/stroke-dasharray/.test(gRohr.svg), 'nicht geschweisste Kanten sind gestrichelt');
ok(/data-code="schwerpunkt"/.test(gRohr.svg), 'Schwerpunkt ist markiert');
nahe(gRohr.schwerpunkt.ys, 0, 1e-9, 'Schwerpunkt kommt aus naht.js (ys)');
nahe(gRohr.schwerpunkt.zs, 0, 1e-9, 'Schwerpunkt kommt aus naht.js (zs)');

var gOhneR = Bild.ausProfil({ profil: 'rohr_rechteck', kanten: 'rundum', b: 100, h: 60, t1: 4, r_ecke: 0, a: 4 });
eq(gOhneR.n_luecken, 0, 'ohne Eckradius gibt es keine Lücke — es wird nichts erfunden');
var gFlanken = Bild.ausProfil({ profil: 'blech', kanten: 'flanken', b: 200, t1: 12, a: 5 });
eq(gFlanken.n_luecken, 0, 'zwei getrennte Raupen sind keine Ecklücke');
eq(gFlanken.n_kontur, 4, 'beim Blech mit Flankennaht bleibt die ganze Kontur sichtbar');

/* Der Massstab haengt an der KONTUR, nicht an der Naht: waehlt der Anwender
   weniger Kanten, springt das Bild nicht — die Naht verschwindet nur. */
var gA = Bild.ausProfil({ profil: 'i_profil', kanten: 'rundum', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
var gB = Bild.ausProfil({ profil: 'i_profil', kanten: 'flansche', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
var gC = Bild.ausProfil({ profil: 'i_profil', kanten: 'steg', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
nahe(gB.sicht.skala, gA.sicht.skala, 1e-12, 'Kantenauswahl aendert den Massstab nicht (Flansche)');
nahe(gC.sicht.skala, gA.sicht.skala, 1e-12, 'Kantenauswahl aendert den Massstab nicht (Steg)');
ok(gC.n_seg < gA.n_seg, 'weniger gewaehlte Kanten = weniger gezeichnete Naht');

/* Zeichnung bleibt innerhalb der Zeichenflaeche (Rand eingehalten). */
var vG = gA.sicht, bG = gA.box;
var sichtG = Svg.sicht(Svg.box([{ y: bG.y_min, z: bG.z_min }, { y: bG.y_max, z: bG.z_max }]),
                       { breite: vG.breite, hoehe: vG.hoehe, rand: vG.rand });
ok(sichtG.px(bG.y_min) >= vG.rand - 1e-6 && sichtG.px(bG.y_max) <= vG.breite - vG.rand + 1e-6,
   'das Bild haelt den Rand waagerecht ein');
ok(sichtG.pz(bG.z_max) >= vG.rand - 1e-6 && sichtG.pz(bG.z_min) <= vG.hoehe - vG.rand + 1e-6,
   'das Bild haelt den Rand senkrecht ein');

/* Legende: Codes statt Texte, Laengen decken sich mit profil.js */
var lSum = 0, lArt = 0, li2;
for (li2 = 0; li2 < gRohr.legende.length; li2++) {
  if (gRohr.legende[li2].art === 'naht') { lSum += gRohr.legende[li2].l; lArt++; }
  if (/^\[/.test(Kern.t(gRohr.legende[li2].code, 'pt'))) lArt = -999;
}
nahe(lSum, gRohr.profil.l_netto, 1e-9, 'die Legendenlaengen ergeben genau die wirksame Nahtlaenge aus profil.js');
ok(lArt === 2, 'zwei Segmentgruppen in der Legende, alle Codes dreisprachig aufloesbar');
eq(gRohr.legende[0].code, 'sg_flanke', 'Legende ist deterministisch sortiert (Gruppenreihenfolge)');

/* Determinismus und Nichtmutation */
var d1 = Bild.ausProfil({ profil: 'u_profil', kanten: 'flansche_steg', b: 80, h: 160, tw: 6, tf: 10, a: 4 });
var d2 = Bild.ausProfil({ profil: 'u_profil', kanten: 'flansche_steg', b: 80, h: 160, tw: 6, tf: 10, a: 4 });
eq(d1.svg, d2.svg, 'gleiche Eingabe ergibt zeichengenau dasselbe SVG');
var pSeg = Profil.baue({ profil: 'blech', kanten: 'rundum', b: 100, t1: 10, a: 4 });
var vorher = JSON.stringify(pSeg.segmente) + JSON.stringify(pSeg.info);
Bild.zeichne({ segmente: pSeg.segmente, info: pSeg.info });
eq(JSON.stringify(pSeg.segmente) + JSON.stringify(pSeg.info), vorher, 'schaubild mutiert seine Eingabe nicht');
var ohneErg = Bild.zeichne({ segmente: pSeg.segmente, info: pSeg.info });
ok(ohneErg.schwerpunkt === null && ohneErg.svg.indexOf('data-code="schwerpunkt"') < 0,
   'ohne Ergebnis aus naht.js wird kein Schwerpunkt erfunden');

/* Vollstaendige Abdeckung: alle 7 Profile x alle Kantenkombinationen */
var maszSet = { blech: { b: 200, t1: 12 }, rohr_rechteck: { b: 100, h: 60, t1: 4, r_ecke: 8 },
                rohr_rund: { d: 114.3, t1: 6 }, i_profil: { b: 100, h: 200, tw: 5.6, tf: 8.5 },
                u_profil: { b: 80, h: 160, tw: 6, tf: 10 }, winkel: { b: 80, h: 80, t1: 8 },
                vollrund: { d: 20 } };
var wege = 0, wFehler = 0, wText = 0, wLeer = 0, wGruppe = 0, wKontur = 0, wAussen = 0, pi2, ki2;

/* Liegt wirklich alles innerhalb der Zeichenflaeche? Das ist die eigentliche
   Probe auf die Auto-Skalierung — ein zu grosser Massstab wuerde hier auffallen. */
function imBild(svgStr, B, H) {
  var xs = [], ys = [], m, re;
  re = /(?:x1|x2|cx)="(-?[\d.]+)"/g;  while ((m = re.exec(svgStr)) !== null) xs.push(parseFloat(m[1]));
  re = /(?:y1|y2|cy)="(-?[\d.]+)"/g;  while ((m = re.exec(svgStr)) !== null) ys.push(parseFloat(m[1]));
  re = /points="([^"]+)"/g;
  while ((m = re.exec(svgStr)) !== null) {
    var pp = m[1].split(' '), q;
    for (q = 0; q < pp.length; q++) {
      var xy = pp[q].split(',');
      if (xy.length === 2) { xs.push(parseFloat(xy[0])); ys.push(parseFloat(xy[1])); }
    }
  }
  var t = 12, q2;   /* Toleranz fuer Kreuz- und Markenradien */
  for (q2 = 0; q2 < xs.length; q2++) if (!(xs[q2] >= -0.6 && xs[q2] <= B + 0.6)) return false;
  for (q2 = 0; q2 < ys.length; q2++) if (!(ys[q2] >= -0.6 && ys[q2] <= H + 0.6)) return false;
  return xs.length > 0 && ys.length > 0 && t > 0;
}
for (pi2 = 0; pi2 < Profil.PROFILE.length; pi2++) {
  var prof = Profil.PROFILE[pi2], kk = Profil.kantenFuer(prof);
  for (ki2 = 0; ki2 < kk.length; ki2++) {
    var ein = { profil: prof, kanten: kk[ki2], a: 4 }, mk;
    for (mk in maszSet[prof]) if (Object.prototype.hasOwnProperty.call(maszSet[prof], mk)) ein[mk] = maszSet[prof][mk];
    var gg = Bild.ausProfil(ein);
    wege++;
    if (!gg.ok) { wFehler++; console.log('    nicht gezeichnet: ' + prof + '/' + kk[ki2]); continue; }
    if (gg.svg.indexOf('<text') >= 0) wText++;
    if (!gg.svg || gg.n_seg < 1) wLeer++;
    if (!gg.n_kontur) wKontur++;
    for (var gj = 0; gj < gg.gruppen.length; gj++) {
      if (Profil.SEGMENTGRUPPEN.indexOf(gg.gruppen[gj]) < 0) wGruppe++;
    }
    if (/NaN|Infinity|undefined/.test(gg.svg)) wFehler++;
    if (!imBild(gg.svg, gg.sicht.breite, gg.sicht.hoehe)) {
      wAussen++; console.log('    zeichnet ausserhalb der Flaeche: ' + prof + '/' + kk[ki2]);
    }
  }
}
eq(wege, 19, 'alle 19 Kantenkombinationen der 7 Profile durchgezeichnet');
eq(wFehler, 0, 'jede Kombination ergibt ein sauberes Bild (keine unsauberen Zahlen)');
eq(wText, 0, 'in keiner der 19 Zeichnungen steht Text im SVG');
eq(wLeer, 0, 'keine Kombination liefert ein leeres Bild');
eq(wKontur, 0, 'jede Kombination zeigt zusaetzlich die volle Profilkontur');
eq(wGruppe, 0, 'jede eingefaerbte Gruppe stammt aus der Segmentgruppenliste');
eq(wAussen, 0, 'keine Zeichnung laeuft ueber die Zeichenflaeche hinaus (Probe auf die Auto-Skalierung)');

var gFalsch = Bild.ausProfil({ profil: 'i_profil', kanten: 'flanken', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 });
ok(gFalsch.ok === false && gFalsch.svg === '', 'unpassende Kantenauswahl wird durchgereicht, nicht uebermalt');
eq(gFalsch.fehler[0].code, 'msg_kanten_unpassend', 'der Fehler von profil.js bleibt erhalten');

var gRund = Bild.ausProfil({ profil: 'rohr_rund', kanten: 'rundum', d: 114.3, t1: 6, a: 5 });
ok(/<circle/.test(gRund.svg), 'die Kreisnaht wird als Kreis gezeichnet');
eq(gRund.gruppen.join(','), 'kreis', 'die Kreisnaht traegt die Segmentgruppe kreis');

/* ========================================================================= */
console.log('\n════════════════════════════════════════════');
console.log(' Assertions: ' + N + '   ·   Fehler: ' + FAIL.length);
if (FAIL.length) {
  console.log('\n FEHLGESCHLAGEN:');
  for (i = 0; i < FAIL.length; i++) console.log('  - ' + FAIL[i]);
}
console.log('════════════════════════════════════════════');
process.exit(FAIL.length ? 1 : 0);
