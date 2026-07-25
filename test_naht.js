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
           lasteingabe: 'direkt', iso5817: 'B', exc: 'EXC2' };
var gut = { a: 5, l: 200, t1: 10, t2: 10, N: 50000, Q: 0, gammaM2: 1.25 };
var r = Valid.pruefe(gut, z1);
ok(r.ok, 'sauberer Datensatz besteht die Pruefung');
eq(Valid.zahl('4,5'), 4.5, 'Komma wird als Dezimaltrennzeichen akzeptiert');
ok(isNaN(Valid.zahl('4,5x')), 'Buchstaben werden nicht stillschweigend verschluckt');
ok(isNaN(Valid.zahl('')), 'leere Eingabe ist keine Zahl');
var rFehlt = Valid.pruefe({ l: 200, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(!rFehlt.ok, 'fehlendes Pflichtfeld a wird erkannt');
eq(rFehlt.fehler[0].code, 'msg_pflicht', 'Meldungscode ist sprachneutral');
var rBereich = Valid.pruefe({ a: 500, l: 200, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(!rBereich.ok, 'a ausserhalb des Feldbereichs wird erkannt');

/* ========================================================================= */
sek('S10 · Validierung Stufe 2 (fachlich)');
function codes(liste) { var c = []; for (var k = 0; k < liste.length; k++) c.push(liste[k].code); return c; }
var rMin = Valid.pruefe({ a: 2, l: 200, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rMin.fehler).indexOf('msg_a_min_ec3') >= 0, 'a = 2 mm verletzt das Mindest-a-Mass nach EN 1993-1-8');
var rMax = Valid.pruefe({ a: 9, l: 400, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rMax.warnungen).indexOf('msg_a_max') >= 0, 'a > 0,7*t_min wird als Warnung gemeldet');
var rKurz = Valid.pruefe({ a: 5, l: 35, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rKurz.fehler).indexOf('msg_leff_min') >= 0, 'zu kurze Naht: l_eff < max(6a;30) wird erkannt');
var rLang = Valid.pruefe({ a: 4, l: 1000, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rLang.warnungen).indexOf('msg_l_lang') >= 0, 'Naht laenger als 150*a: Abminderung wird angemahnt');
var rGrenze = Valid.pruefe({ a: 4, l: 600, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 }, z1);
ok(codes(rGrenze.warnungen).indexOf('msg_l_lang') < 0, 'genau 150*a ist noch nicht abzumindern (Grenzfall)');

var zAlu = { welt: 'A', rechenrichtung: 'nachweis', werkstoffgruppe: 'alu', werkstoff: 'AW6082',
             zustand: 'T6', zusatzwerkstoff: '5356', stossart: 't_stoss', nahtart: 'kehl_doppel',
             nachweisverfahren: 'richtungsbezogen', lasteingabe: 'direkt', iso5817: 'B', exc: 'EXC2' };
var rAlu = Valid.pruefe({ a: 5, l: 200, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25, gammaMw: 1.25 }, zAlu);
ok(codes(rAlu.hinweise).indexOf('msg_alu_wez') >= 0, 'Aluminium: WEZ-Hinweis erscheint zwingend');
ok(codes(rAlu.hinweise).indexOf('lk_rho_haz_nur_band') >= 0, 'Aluminium: rho_haz-Luecke wird sichtbar gemacht');
var rWelt = Valid.pruefe(gut, z1);
ok(codes(rWelt.hinweise).indexOf('msg_welt_getrennt') >= 0, 'Trennung der Bemessungswelten wird ausgewiesen');
var zB = { welt: 'B', rechenrichtung: 'nachweis', werkstoffgruppe: 'stahl', werkstoff: 'S235',
           stossart: 't_stoss', nahtart: 'kehl_doppel', nahtguete: 'kehlnaht_allgemein',
           lastfall: 'schwellend', lasteingabe: 'direkt', iso5817: 'B', exc: 'EXC2',
           ermuedung_aktiv: true };
var rB = Valid.pruefe({ a: 5, l: 200, t1: 10, t2: 10, N: 1, Q: 0, S: 1.5 }, zB);
ok(codes(rB.hinweise).indexOf('msg_lastfall_ermuedung') >= 0,
   'Lastfall + Ermuedung gleichzeitig: Klartext-Hinweis auf zwei getrennte Nachweise');

var leer = Valid.leer();
var alleLeer = true;
for (var lk in leer) if (leer[lk] !== '') alleLeer = false;
ok(alleLeer, '"Leeren" liefert wirklich einen komplett leeren Datensatz');
eq(Object.keys(leer).length, Valid.SCHEMA.length, '"Leeren" erfasst JEDES Feld des Schemas');

/* Eingaben duerfen nicht mutiert werden */
var einObj = { a: 5, l: 200, t1: 10, t2: 10, N: 1, Q: 0, gammaM2: 1.25 };
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
console.log('\n════════════════════════════════════════════');
console.log(' Assertions: ' + N + '   ·   Fehler: ' + FAIL.length);
if (FAIL.length) {
  console.log('\n FEHLGESCHLAGEN:');
  for (i = 0; i < FAIL.length; i++) console.log('  - ' + FAIL[i]);
}
console.log('════════════════════════════════════════════');
process.exit(FAIL.length ? 1 : 0);
