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
var Solver  = require('./solver.js');
var Weg     = require('./rechenweg.js');

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
eq(Data.NICHT_GEPRUEFT.length, 13,
   'Liste "nicht geprueft" mit 13 Punkten (2.4) — N6b hat die Nahtvorbereitung GESCHLOSSEN');
eq(Data.NICHT_GEPRUEFT.indexOf('nahtvorbereitung'), -1,
   'die Luecke Nahtvorbereitung ist raus, weil sie gefuellt wurde — nicht weil sie umbenannt wurde');

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
/* ---- FELDBEREINIGUNG N5c-1 (Plan 5.1) --------------------------------
   Das Feld 'l' ist entfallen. Die beiden Laengenpruefungen sind damit NICHT
   verschwunden — sie haengen jetzt am Geometrieweg: solver.js fuehrt sie je
   Segment mit denselben Grenzen an der echten Nahtlaenge aus profil.js.
   Geprueft wird hier beides: dass das Feld weg ist UND dass die Pruefung
   noch greift. ----------------------------------------------------------- */
ok(Valid.feld('l') === null, 'Feld l ist aus dem Schema entfernt (Nahtlaenge kommt aus der Geometrie)');
eq(Valid.SCHEMA.length, 28, 'das Feldschema hat nach der Bereinigung 28 Felder');

function laengenFall(b, a) {
  var r = Solver.rechne({
    welt: 'A', rechenrichtung: 'nachweis', nachweisverfahren: 'richtungsbezogen',
    werkstoffgruppe: 'stahl', werkstoff: 'S235', nahtart: 'kehl_doppel',
    profil_eingabe: { profil: 'blech', kanten: 'flanken', b: b, t1: 20, a: a },
    N: 50000, gammaM2: 1.25
  });
  return codes(r.warnungen || []);
}
ok(laengenFall(35, 5).indexOf('msg_sv_l_eff_zu_kurz') >= 0,
   'zu kurze Naht: l_eff < max(6a;30) wird am Nahtbild erkannt');
ok(laengenFall(1008, 4).indexOf('msg_sv_lange_naht') >= 0,
   'Naht laenger als 150*a: Abminderung wird am Nahtbild angemahnt');
ok(laengenFall(608, 4).indexOf('msg_sv_lange_naht') < 0,
   'genau 150*a ist noch nicht abzumindern (Grenzfall)');
ok(laengenFall(608, 4).indexOf('msg_sv_l_eff_zu_kurz') < 0,
   'und der Grenzfall gilt auch nicht faelschlich als zu kurz');

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
    /* N6b: eine Option darf auf einen vorhandenen Text zeigen (schluessel) —
       dann steht ihr Name nur einmal im Woerterbuch. */
    var key = g.optionen[j].schluessel || ('opt_' + g.code + '_' + g.optionen[j].code);
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
eq(ngOhne, 0, 'alle 13 Punkte der Liste "nicht geprueft" sind uebersetzt');

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
sek('S26 · Spannungen und beide Welten N3 — Hand-Anker gegen belegte Beispiele');

/* Bezugs-Nahtbild: Doppelkehlnaht, Hoehe 200 mm, Abstand 100 mm, a = 5 mm.
   Dasselbe Bild wie im Nahtbild-Kern (S15) — damit sind die Querschnitts-
   werte dort schon geschlossen nachgerechnet und hier belastbar. */
var svH = 200, svB = 100, svA = 5;
function svSeg(a) {
  return [ Naht.linie(-svB / 2, -svH / 2, -svB / 2, svH / 2, a),
           Naht.linie(svB / 2, -svH / 2, svB / 2, svH / 2, a) ];
}
function svEin(extra) {
  var e = { welt: 'A', rechenrichtung: 'nachweis', nachweisverfahren: 'richtungsbezogen',
            werkstoff: 'S355', bw_regelsatz: 'na_de', nahtart: 'kehl_doppel',
            t1: 10, t2: 10, modell: 'duennwandig',
            segmente: svSeg(svA), umlaufend: false }, k;
  for (k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) e[k] = extra[k];
  return e;
}

ok(!!Solver, 'solver.js geladen');
eq(typeof Solver.rechne, 'function', 'DTNSolver.rechne ist die Hauptfunktion');
eq(Solver.WELTEN.join(','), 'A,B', 'genau zwei Bemessungswelten');
eq(Solver.VERFAHREN.join(','), 'richtungsbezogen,vereinfacht', 'beide Verfahren der Welt A');
eq(Solver.RICHTUNGEN.join(','), 'nachweis,auslegung', 'beide Rechenrichtungen im Kern (2.3)');
eq(Solver.GROESSEN.length, 16, '16 Ergebnisgroessen mit Einheit');

/* --- Hand-Anker 1: reine Querzugkraft ---------------------------------- */
var svQz = Solver.rechne(svEin({ N: 200000 }));
ok(svQz.ok, 'Querzug: Rechnung laeuft');
nahe(svQz.nahtbild.A, 2 * svA * svH, 1e-9, 'A_w = 2*a*h = 2000 mm² (Hand-Anker aus S15)');
nahe(svQz.massgebend.sigma_x, 100, 1e-9, 'sigma_x = N/A_w = 100 N/mm²');
nahe(svQz.massgebend.sigma_senk, 100 / Math.SQRT2, 1e-9,
     'UMKLAPPEN: sigma_senk = sigma_w/sqrt(2) = 70,71 (Roloff/Matek Nr. 30)');
nahe(svQz.massgebend.tau_senk, 100 / Math.SQRT2, 1e-9, 'UMKLAPPEN: tau_senk = sigma_w/sqrt(2)');
eq(svQz.massgebend.tau_par, 0, 'reiner Querzug: tau_parallel = 0');
nahe(svQz.massgebend.sigma_v, Math.SQRT2 * 100, 1e-9,
     'sigma_v = sqrt(2)*sigma_w — Probe der Aufteilung');
nahe(svQz.widerstand.R_d, 490 / (0.90 * 1.25), 1e-9,
     'Widerstand f_u/(beta_w*gamma_M2) = 490/(0,90*1,25) = 435,56');
nahe(svQz.eta, Math.SQRT2 * 100 / (490 / (0.9 * 1.25)), 1e-12, 'Ausnutzungsgrad stimmt');
eq(svQz.ampel, 'gruen', 'Ampel gruen bei 32 % Ausnutzung');
ok(svQz.erfuellt, 'Nachweis ist erfuellt');

/* --- Hand-Anker 2: Verhaeltnis der beiden Verfahren = sqrt(3/2) --------- */
var svVer = Solver.rechne(svEin({ N: 200000, nachweisverfahren: 'vereinfacht' }));
ok(svVer.ok, 'vereinfachtes Verfahren laeuft');
nahe(svVer.widerstand.R_d_vereinfacht, (490 / Math.sqrt(3)) / (0.9 * 1.25), 1e-9,
     'f_vw,d = (f_u/sqrt(3))/(beta_w*gamma_M2)');
nahe(svVer.eta / svQz.eta, Math.sqrt(1.5), 1e-12,
     'HAND-ANKER: bei Querzug ist das vereinfachte Verfahren um sqrt(3/2)=1,2247 strenger (Wald/CESTRUCO Q&A 3.4)');
ok(svVer.eta > svQz.eta, 'das vereinfachte Verfahren liegt auf der sicheren Seite');

/* --- Hand-Anker 3: reine Laengsbeanspruchung --------------------------- */
var svLa = Solver.rechne(svEin({ Qz: 200000 }));
var svLaV = Solver.rechne(svEin({ Qz: 200000, nachweisverfahren: 'vereinfacht' }));
nahe(svLa.massgebend.tau_par, 100, 1e-9, 'Laengsschub tau_par = Q/A_w = 100 N/mm²');
eq(svLa.massgebend.sigma_senk, 0, 'reiner Laengsschub: sigma_senk = 0');
nahe(svLa.massgebend.sigma_v, Math.sqrt(3) * 100, 1e-9, 'sigma_v = sqrt(3)*tau_par');
nahe(svLa.eta, svLaV.eta, 1e-12,
     'HAND-ANKER: laengs der Naht liefern BEIDE Verfahren dasselbe (R1, Abschnitt 1.2)');

/* --- Hand-Anker 4: Biegung gegen das Widerstandsmoment ----------------- */
var svBi = Solver.rechne(svEin({ My: 20000 }));
nahe(Math.abs(svBi.massgebend.sigma_x), 20000 * 1000 / svBi.nahtbild.Wy, 1e-9,
     'Biegung: sigma = M_y / W_y (M in Nm, intern Nmm)');
nahe(Math.abs(svBi.massgebend.sigma_x),
     20000 * 1000 / ((svA * svH * svH * svH / 6) / (svH / 2)), 1e-9,
     'Biegung geschlossen: W_y = (a*h³/6)/(h/2) = 66.667 mm³ — Roloff/Matek');
ok(svBi.massgebend.sigma_x < 0 || svBi.massgebend.sigma_x > 0,
   'der massgebende Biegepunkt liegt am Rand, das Vorzeichen wird mitgefuehrt');

/* --- Hand-Anker 5: Kreisnaht unter Torsion ----------------------------- */
var svKrS = [ Naht.kreis(0, 0, 100, 5) ];
var svKrN = Naht.rechne(svKrS);
var svKr = Solver.rechne({ welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S355',
  bw_regelsatz: 'na_de', nahtart: 'kehl_umlaufend', t1: 10, t2: 10,
  segmente: svKrS, umlaufend: true, T: 5000 });
ok(svKr.ok, 'Kreisnaht unter Torsion laeuft');
nahe(svKr.massgebend.tau_par, 5000 * 1000 / svKrN.Wt, 1e-6,
     'HAND-ANKER: tau = T/W_t mit W_t = (pi/16)*[(d+a)^4-(d-a)^4]/(d+a) (Voigt)');
ok(svKr.hinweise.length > 0, 'die Kreisnaht liefert ihre ehrlichen Hinweise mit');
function svHat(liste, code) {
  for (var q = 0; q < liste.length; q++) if (liste[q].code === code) return true;
  return false;
}
ok(svHat(svKr.hinweise, 'msg_sv_kreis_verdichtet'),
   'die Verdichtung auf 72 Auswertepunkte wird ehrlich gemeldet');
ok(svHat(svKr.hinweise, 'msg_kreis_aussendurchmesser'),
   'der Hinweis auf den Aussendurchmesser aus naht.js wird durchgereicht');

/* --- Hand-Anker 6: WELT B, durchgerechnetes Lehrbuchbeispiel ----------- */
var svWB = Solver.rechne(svEin({ welt: 'B', werkstoff: 'S235',
  nahtguete: 'durchgeschweisst_zug_ungeprueft', lastfall: 'ruhend',
  Re: 240, S: 1.1, N: 200000 }));
ok(svWB.ok, 'Welt B laeuft');
eq(svWB.widerstand.nu, 0.95, 'Nahtguetefaktor nu = 0,95 (Decker, nicht nachgewiesene Zugnaht)');
nahe(svWB.widerstand.Re / svWB.widerstand.S, 218.1818181818, 1e-6,
     'HAND-ANKER Welt B: zulaessige Spannung Stab = 240/1,1 = 218 N/mm²');
nahe(svWB.widerstand.sigma_zul, 207.2727272727, 1e-6,
     'HAND-ANKER Welt B: zulaessige Spannung Naht = 0,95*218 = 207 N/mm² (Lehrbuchbeispiel, R1 Abschnitt 2.2)');
nahe(svWB.massgebend.sigma_res, 100, 1e-9,
     'Welt B rechnet die Resultierende OHNE Faktor 3 (Maschinenbau-Konvention)');
nahe(svWB.eta, 100 / 207.2727272727, 1e-9, 'Welt-B-Ausnutzung stimmt');
ok(svHat(svWB.hinweise, 'msg_sv_weltb_ohne_faktor3'), 'fehlender Faktor 3 wird ehrlich benannt');
ok(svHat(svWB.hinweise, 'msg_sv_weltb_formelweg'), 'der Formelweg wird als KEIN Tabellenwert gekennzeichnet');
ok(svHat(svWB.hinweise, 'lk_weltb_kein_verbindliches_regelwerk'),
   'die Luecke "kein verbindliches Regelwerk" bleibt sichtbar');

/* --- Welt B: Tabellenweg ist massgeblich, wenn die Zeile gewaehlt ist --- */
var svWBt = Solver.rechne(svEin({ welt: 'B', werkstoff: 'S235',
  nahtguete: 'kehlnaht_allgemein', weltb_nahtgruppe: 'kehl_doppel_umlaufend',
  lastfall: 'ruhend', N: 200000 }));
eq(svWBt.widerstand.pfad, 'tabelle', 'gewaehlte Nahtgruppe -> Tabellenwert ist massgeblich');
eq(svWBt.widerstand.sigma_zul, 140, 'S235, Doppelkehlnaht umlaufend, ruhend: 140 N/mm² (Decker)');
eq(svWBt.widerstand.bewertungsgruppe, 'B', 'die Bewertungsgruppe des Tabellenwerts wird ausgewiesen');
var svWBt2 = Solver.rechne(svEin({ welt: 'B', werkstoff: 'S235',
  nahtguete: 'kehlnaht_allgemein', weltb_nahtgruppe: 'kehl_doppel_umlaufend',
  lastfall: 'wechselnd', N: 200000 }));
eq(svWBt2.widerstand.sigma_zul, 50, 'derselbe Fall wechselnd belastet: 50 N/mm² (Lastfall wirkt im Tabellenweg)');
ok(svWBt2.eta > svWBt.eta, 'wechselnde Last ergibt eine hoehere Ausnutzung als ruhende');
var svWBf = Solver.rechne(svEin({ welt: 'B', werkstoff: 'S275',
  nahtguete: 'kehlnaht_allgemein', lastfall: 'wechselnd', S: 1.5, N: 200000 }));
eq(svWBf.widerstand.pfad, 'formel', 'S275 ist nicht tabelliert -> Formelweg');
ok(svHat(svWBf.hinweise, 'msg_sv_weltb_lastfall_ohne_wirkung'),
   'EHRLICHE LUECKE: im Formelweg wirkt der Lastfall nicht — das wird gesagt');

/* --- Die beiden Welten werden strukturell nie vermischt (2.8) ---------- */
eq(svQz.widerstand.welt, 'A', 'Welt-A-Widerstand ist als solcher gekennzeichnet');
eq(svWB.widerstand.welt, 'B', 'Welt-B-Widerstand ist als solcher gekennzeichnet');
ok(!('S' in svQz.widerstand), 'Welt A kennt keinen Sicherheitsbeiwert S');
ok(!('nu' in svQz.widerstand), 'Welt A kennt keinen Nahtguetefaktor nu');
ok(!('Re' in svQz.widerstand), 'Welt A rechnet nicht mit der Streckgrenze');
ok(!('sigma_zul' in svQz.widerstand), 'Welt A kennt keine zulaessige Spannung');
ok(!('betaW' in svWB.widerstand), 'Welt B kennt kein beta_w');
ok(!('gammaM2' in svWB.widerstand), 'Welt B kennt kein gamma_M2');
ok(!('R_d_vereinfacht' in svWB.widerstand), 'Welt B kennt das vereinfachte Verfahren nicht');
eq(svWB.verfahren, null, 'in Welt B gibt es kein Nachweisverfahren der Welt A');
ok(svHat(Solver.rechne(svEin({ N: 1000, lastfall: 'schwellend' })).hinweise,
         'msg_sv_lastfall_nur_weltB'),
   'ein Lastfall in Welt A wird ehrlich als wirkungslos gemeldet');

/* --- Invarianten -------------------------------------------------------- */
var svA2 = Solver.rechne(svEin({ N: 200000, segmente: svSeg(2 * svA) }));
nahe(svQz.eta / svA2.eta, 2, 1e-12, 'INVARIANTE: verdoppeltes a-Mass halbiert die Spannung');
var svVersch = Solver.rechne(svEin({ N: 200000, My: 20000,
  segmente: Naht.verschiebe(svSeg(svA), 1234, -567) }));
var svOrig = Solver.rechne(svEin({ N: 200000, My: 20000 }));
nahe(svVersch.eta, svOrig.eta, 1e-12,
     'INVARIANTE: Verschieben des Nahtbilds aendert die Ausnutzung nicht (Bezug ist der Schwerpunkt)');
var svGed = Solver.rechne(svEin({ Mz: 20000, segmente: Naht.drehe(svSeg(svA), 90, 0, 0) }));
nahe(svGed.eta, svBi.eta, 1e-9,
     'INVARIANTE: 90 Grad gedrehtes Nahtbild mit gedrehtem Moment ergibt dieselbe Ausnutzung');
var svD1 = Solver.rechne(svEin({ N: 200000, My: 5000, T: 1000 }));
var svD2 = Solver.rechne(svEin({ N: 200000, My: 5000, T: 1000 }));
eq(JSON.stringify(svD1.nachweise), JSON.stringify(svD2.nachweise), 'DETERMINISMUS: gleiche Eingabe, gleiche Nachweise');
nahe(svD1.eta, svD2.eta, 0, 'DETERMINISMUS: identische Ausnutzung');
var svMut = svSeg(svA);
var svVor = JSON.stringify(svMut);
Solver.rechne(svEin({ N: 200000, segmente: svMut }));
eq(JSON.stringify(svMut), svVor, 'NICHTMUTATION: die uebergebenen Segmente bleiben unberuehrt');
var svEinObj = svEin({ N: 200000 });
var svEinVor = JSON.stringify(svEinObj);
Solver.rechne(svEinObj);
eq(JSON.stringify(svEinObj), svEinVor, 'NICHTMUTATION: das Eingabeobjekt bleibt unberuehrt');

/* --- Auslegung: Pflicht-Assertion "invers zum Nachweis" ---------------- */
var svAus = Solver.rechne(svEin({ N: 900000, rechenrichtung: 'auslegung', a: svA,
                                  a_rundung: 'ganze_mm' }));
ok(svAus.ok, 'Auslegung laeuft');
ok(svAus.auslegung !== null, 'die Auslegung liefert ihren eigenen Ergebnisblock');
var svProbe = Solver.rechne(svEin({ N: 900000, segmente: svSeg(svAus.auslegung.a_erf) }));
nahe(svProbe.eta, 1, 1e-9,
     'PFLICHT-ASSERTION: a_erf in den Nachweis eingesetzt ergibt Ausnutzung 1 — Auslegung und Nachweis sind invers');
ok(svAus.auslegung.a_gewaehlt >= svAus.auslegung.a_erf,
   'das gewaehlte a-Mass ist nie kleiner als das erforderliche');
ok(svAus.auslegung.eta_mit_gewaehlt <= 1 + 1e-12,
   'mit dem aufgerundeten a-Mass ist der Nachweis erfuellt');
eq(svAus.auslegung.a_gewaehlt, 8, 'a_erf = 7,31 mm wird auf ganze mm zu a8 AUFgerundet');
ok(svAus.auslegung.a_erf < 8 && svAus.auslegung.a_erf > 7,
   'a_erf liegt zwischen 7 und 8 mm — beide Zahlen stehen im Ergebnis (2.3)');
ok(svHat(svAus.hinweise, 'msg_sv_a_aufgerundet'), 'die Aufrundung wird ehrlich gemeldet');

/* Auslegung auch im exakten Modell (a^3-Glieder) — Iteration dahinter */
var svAusE = Solver.rechne(svEin({ N: 900000, rechenrichtung: 'auslegung', a: svA,
                                   a_rundung: 'ganze_mm', modell: 'exakt' }));
var svProbeE = Solver.rechne(svEin({ N: 900000, modell: 'exakt',
                                     segmente: svSeg(svAusE.auslegung.a_erf) }));
nahe(svProbeE.eta, 1, 1e-9,
     'PFLICHT-ASSERTION auch im Modell "exakt": die Iteration trifft die Ausnutzung 1 genau');
ok(svAusE.auslegung.iterationen >= 1 && svAusE.auslegung.iterationen <= 60,
   'die Iteration bleibt in der Schrittgrenze (' + svAusE.auslegung.iterationen + ' Schritte)');

/* --- Aufrundung: die bindende Regel aus 2.3 ---------------------------- */
eq(Solver.rundeA(4.37, 'ganze_mm').a_gewaehlt, 5, 'AUFrunden: 4,37 -> a5 (nie 4)');
eq(Solver.rundeA(4.01, 'ganze_mm').a_gewaehlt, 5, 'AUFrunden: 4,01 -> a5');
eq(Solver.rundeA(4.00, 'ganze_mm').a_gewaehlt, 4, 'genau 4,00 bleibt a4 (kein Sprung durch Rundungsfehler)');
eq(Solver.rundeA(3.10, 'halbe_mm').a_gewaehlt, 3.5, 'halbe mm: 3,10 -> a3,5');
eq(Solver.rundeA(3.50, 'halbe_mm').a_gewaehlt, 3.5, 'genau 3,50 bleibt a3,5');
eq(Solver.rundeA(3.51, 'halbe_mm').a_gewaehlt, 4, 'halbe mm: 3,51 -> a4');
eq(Solver.rundeA(6.20, 'ganze_mm').a_gewaehlt, 7, 'KEINE Sprungreihe: 6,20 -> a7, nicht a8');
eq(Solver.rundeA(8.10, 'ganze_mm').a_gewaehlt, 9, 'KEINE Sprungreihe: 8,10 -> a9, nicht a10');
eq(Solver.rundeA(4.37).rundung, 'ganze_mm', 'Voreinstellung sind ganze Millimeter');
var svR = 0, svRi;
for (svRi = 0; svRi < 400; svRi++) {
  var svX = 0.5 + svRi * 0.0731;
  if (Solver.rundeA(svX, 'ganze_mm').a_gewaehlt < svX - 1e-12) svR++;
  if (Solver.rundeA(svX, 'halbe_mm').a_gewaehlt < svX - 1e-12) svR++;
}
eq(svR, 0, 'in 800 Proben wird NIE abgerundet — die Regel aus 2.3 haelt');

/* --- a_max nach dem Aufrunden pruefen (2.3, letzter Punkt) ------------- */
nahe(Solver.aMax(5), 3.5, 1e-12, 'a_max = 0,7*t: bei t = 5 mm sind das 3,5 mm');
var svDuenn = Solver.rechne({ welt: 'A', rechenrichtung: 'auslegung', werkstoff: 'S235',
  bw_regelsatz: 'na_de', nahtart: 'kehl_doppel', t1: 5, t2: 5, a: 3, a_rundung: 'ganze_mm',
  modell: 'duennwandig', segmente: svSeg(3), umlaufend: false, N: 420000 });
ok(svDuenn.ok, 'duennes Blech: die Rechnung laeuft');
ok(svDuenn.auslegung.a_gewaehlt > Solver.aMax(5),
   'das aufgerundete a-Mass liegt hier ueber a_max — genau der Fall aus 2.3');
ok(svHat(svDuenn.warnungen, 'msg_sv_a_ueber_amax'),
   'PFLICHT: nach dem Aufrunden wird gegen a_max geprueft und EHRLICH gemeldet');
var svHalb = Solver.rechne({ welt: 'A', rechenrichtung: 'auslegung', werkstoff: 'S235',
  bw_regelsatz: 'na_de', nahtart: 'kehl_doppel', t1: 5, t2: 5, a: 3, a_rundung: 'halbe_mm',
  modell: 'duennwandig', segmente: svSeg(3), umlaufend: false, N: 150000 });
eq(svHalb.auslegung.stufe, 0.5, 'Umschaltung auf halbe mm greift');
ok(svHalb.auslegung.a_gewaehlt <= 3.5,
   'mit halben mm passt das Ergebnis bei t = 5 mm noch unter a_max — die Begruendung aus 2.3');

/* --- Aluminium: eigener Weg ueber f_w, WEZ sichtbar, kein beta_w ------- */
var svAl = Solver.rechne(svEin({ werkstoff: 'AW6082', zustand: 'T6',
  zusatzwerkstoff: '5356', werkstoffgruppe: 'alu', N: 100000, bw_regelsatz: null }));
ok(svAl.ok, 'Aluminium laeuft');
eq(svAl.widerstand.pfad, 'alu', 'Aluminium geht seinen eigenen Weg');
eq(svAl.widerstand.fw, 210, 'f_w AW-6082 mit Zusatz 5356 = 210 N/mm² (EN 1999-1-1 Tab. 8.8)');
eq(svAl.widerstand.gammaMw, 1.25, 'gamma_Mw = 1,25');
nahe(svAl.widerstand.R_d, 210 / 1.25, 1e-12, 'Widerstand = f_w/gamma_Mw = 168 N/mm²');
ok(!('betaW' in svAl.widerstand), 'KORREKTUR aus 6.1: Aluminium kennt KEIN beta_w');
eq(svAl.widerstand.R_d_sigma_senk, null, 'EN 1999 kennt den Zusatznachweis 0,9*f_u nicht');
ok(svAl.widerstand.wez.rho_u < 1, 'die WEZ-Entfestigung ist wirksam (rho_u < 1)');
nahe(svAl.widerstand.wez.f_u_haz, svAl.widerstand.wez.rho_u * svAl.widerstand.wez.f_u, 1e-9,
     'f_u,haz = rho_u,haz * f_u wird ausgerechnet und ausgewiesen');
ok(svAl.widerstand.wez.b_haz > 0, 'die WEZ-Breite b_haz wird mitgeliefert');
ok(svHat(svAl.hinweise, 'msg_sv_alu_wez'), 'die WEZ-Entfestigung wird ausdruecklich sichtbar gemacht (2.5)');
ok(svHat(svAl.hinweise, 'msg_sv_alu_wez_nicht_geprueft'),
   'EHRLICH: der Grundwerkstoff-Nachweis in der WEZ ist NICHT Teil der Nahtberechnung');
ok(svHat(svAl.hinweise, 'lk_alu_kein_beta_w'), 'die Luecke "Alu ohne beta_w" bleibt sichtbar');
var svAlB = Solver.rechne(svEin({ welt: 'B', werkstoff: 'AW6082', zustand: 'T6',
  nahtguete: 'kehlnaht_allgemein', N: 100000 }));
eq(svAlB.ok, false, 'ENTSCHEIDUNG N1: Welt B kennt kein Aluminium — die Rechnung wird verweigert');
eq(svAlB.fehler[0].code, 'msg_sv_alu_nur_weltA', 'und zwar mit klarer Begruendung');
ok(!('eta' in svAlB), 'bei einem Fehler gibt es KEINE Zahlen — kein stiller Teilwert');

/* --- Edelstahl: beta_w = 1,0 fuer alle Sorten -------------------------- */
var svEs = Solver.rechne(svEin({ werkstoff: '1.4404', werkstoffgruppe: 'edelstahl', N: 100000 }));
eq(svEs.widerstand.betaW, 1.0, 'KORREKTUR aus 6.1: Edelstahl beta_w = 1,0');
eq(svEs.widerstand.pfad, 'edelstahl', 'Edelstahl ist als eigener Weg gekennzeichnet');
nahe(svEs.widerstand.R_d, 520 / (1.0 * 1.25), 1e-9, 'Edelstahl-Widerstand aus dem unteren Bandwert');

/* --- Nahtarten: Umklappen ja/nein, 2-mm-Abzug -------------------------- */
eq(Solver.nahtTyp('kehl_doppel'), 'kehl', 'Kehlnaht wird als Kehlnaht erkannt');
eq(Solver.nahtTyp('stumpf_v'), 'stumpf_voll', 'V-Naht ist durchgeschweisst');
eq(Solver.nahtTyp('stumpf_hv'), 'stumpf_teil', 'HV-Naht ist teilweise durchgeschweisst');
eq(Solver.nahtTyp('gibtsnicht'), null, 'unbekannte Nahtart liefert null, nicht geraten');
var svSt = Solver.rechne(svEin({ nahtart: 'stumpf_v', N: 100000 }));
eq(svSt.umklappen, false, 'durchgeschweisste Stumpfnaht wird NICHT umgeklappt');
nahe(svSt.massgebend.sigma_senk, 50, 1e-9, 'dort ist sigma_senk = sigma_x = N/A_w');
ok(svHat(svSt.hinweise, 'msg_sv_stumpf_voll_kein_nachweis'),
   'EHRLICH: bei durchgeschweisster Stumpfnaht ist meist das Bauteil massgebend');
var svTeil = Solver.rechne(svEin({ nahtart: 'stumpf_hv', N: 100000 }));
var svVgl = Solver.rechne(svEin({ nahtart: 'kehl_doppel', N: 100000, segmente: svSeg(3) }));
eq(svTeil.a_abzug, 2, 'teilweise durchgeschweisst: 2 mm Abzug (Wald/CESTRUCO Q&A 3.5)');
nahe(svTeil.eta, svVgl.eta, 1e-12, 'a5 mit Abzug rechnet genau wie a3 ohne Abzug');
ok(svHat(svTeil.hinweise, 'msg_sv_teil_abzug'), 'der Abzug wird im Ergebnis benannt');
var svTeilD = Solver.rechne(svEin({ nahtart: 'stumpf_hv', N: 100000, segmente: svSeg(1.5) }));
eq(svTeilD.ok, false, 'a = 1,5 mm minus 2 mm ergibt kein wirksames Mass — ehrlicher Fehler');
eq(svTeilD.fehler[0].code, 'msg_sv_a_wirksam_null', 'mit dem passenden Meldungscode');
var svVerfF = Solver.rechne(svEin({ nahtart: 'stumpf_v', nachweisverfahren: 'vereinfacht', N: 1000 }));
eq(svVerfF.ok, false, 'vereinfachtes Verfahren bei durchgeschweisster Stumpfnaht wird abgewiesen');
eq(svVerfF.fehler[0].code, 'msg_sv_verfahren_unpassend', 'mit klarer Begruendung');

/* --- Profileingabe als Eingang: umlaufend aus profil.js (4.6) ---------- */
var svProf = Solver.rechne({ welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S235',
  bw_regelsatz: 'na_de', nahtart: 'kehl_umlaufend', t1: 8, t2: 8, modell: 'exakt',
  profil_eingabe: { profil: 'rohr_rechteck', kanten: 'rundum', b: 100, h: 60, t1: 8, r_ecke: 8, a: 4 },
  N: 100000, T: 500 });
ok(svProf.ok, 'solver.js nimmt eine Profileingabe direkt an (ein Aufruf, wie ausProfil in N2c)');
eq(svProf.nahtbild.umlaufend, true, 'die Naht ist umlaufend — das sagt profil.js, nicht die Geometrie');
eq(svProf.nahtbild.geschlossen, false, 'naht.js sieht die Ecklueken als offene Enden');
ok(svHat(svProf.hinweise, 'msg_sv_umlaufend_aus_profil'),
   'PFLICHT aus 4.6: N3 wertet "umlaufend" aus, NICHT "geschlossen" aus naht.js');
ok(!svHat(svProf.hinweise, 'msg_torsion_offenes_nahtbild'),
   'die Torsionswarnung fuer offene Nahtbilder erscheint hier zu Recht NICHT');
var svProfOffen = Solver.rechne({ welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S235',
  bw_regelsatz: 'na_de', nahtart: 'kehl_flanke', t1: 12, t2: 12,
  profil_eingabe: { profil: 'blech', kanten: 'flanken', b: 200, t1: 12, a: 5 },
  N: 100000, T: 500 });
ok(svHat(svProfOffen.hinweise, 'msg_torsion_offenes_nahtbild'),
   'beim wirklich offenen Nahtbild bleibt die Torsionswarnung stehen');
var svProfF = Solver.rechne({ welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S235',
  bw_regelsatz: 'na_de', nahtart: 'kehl_doppel', t1: 8, t2: 8,
  profil_eingabe: { profil: 'i_profil', kanten: 'flanken', b: 100, h: 200, tw: 5.6, tf: 8.5, a: 4 },
  N: 100000 });
eq(svProfF.ok, false, 'ein Fehler aus profil.js wird durchgereicht, nicht uebermalt');
eq(svProfF.fehler[0].code, 'msg_kanten_unpassend', 'und behaelt seinen Originalcode');

/* --- Auslegung je Segment: a je Steg und Flansch getrennt aufgerundet -- */
var svAusIP = Solver.rechne({ welt: 'A', rechenrichtung: 'auslegung', werkstoff: 'S355',
  bw_regelsatz: 'na_de', nahtart: 'kehl_umlaufend', t1: 10, t2: 10, a_rundung: 'ganze_mm',
  profil_eingabe: { profil: 'i_profil', kanten: 'flansche_steg', b: 100, h: 200,
                    tw: 5.6, tf: 8.5, a: 5, a_steg: 4, a_flansch: 6 },
  My: 40000 });
ok(svAusIP.ok, 'Auslegung mit unterschiedlichen a-Massen je Segment laeuft');
ok(svAusIP.auslegung.je_segment.length === svAusIP.nahtbild.n_seg,
   'jedes Segment bekommt sein eigenes a_erf und a_gewaehlt');
var svGanz = 0, svJi;
for (svJi = 0; svJi < svAusIP.auslegung.je_segment.length; svJi++) {
  var svJs = svAusIP.auslegung.je_segment[svJi];
  if (Math.abs(svJs.a_gewaehlt - Math.round(svJs.a_gewaehlt)) < 1e-12) svGanz++;
  if (svJs.a_gewaehlt < svJs.a_erf - 1e-12) svGanz = -999;
}
eq(svGanz, svAusIP.auslegung.je_segment.length,
   'alle Segment-a-Masse sind ganze mm und nie kleiner als das erforderliche Mass');
ok(svAusIP.auslegung.eta_mit_gewaehlt <= 1 + 1e-12,
   'mit den aufgerundeten Segmentmassen ist der Nachweis erfuellt');

/* --- Geometrische Grenzen ---------------------------------------------- */
var svKurz = Solver.rechne(svEin({ N: 1000,
  segmente: [ Naht.linie(-50, -10, -50, 10, 5), Naht.linie(50, -10, 50, 10, 5) ] }));
ok(svHat(svKurz.warnungen, 'msg_sv_l_eff_zu_kurz'),
   'zu kurzes Segment (l < max(6a; 30 mm)) wird gemeldet');
var svLang = Solver.rechne(svEin({ N: 1000,
  segmente: [ Naht.linie(-50, -500, -50, 500, 3), Naht.linie(50, -500, 50, 500, 3) ] }));
ok(svHat(svLang.warnungen, 'msg_sv_lange_naht'), 'lange Naht (l > 150a) wird gemeldet');
ok(svLang.grenzen.beta_Lw > 0 && svLang.grenzen.beta_Lw <= 1,
   'beta_Lw wird berechnet und liegt zwischen 0 und 1 (' + svLang.grenzen.beta_Lw.toFixed(3) + ')');
ok(svHat(svLang.hinweise, 'msg_sv_beta_lw_nicht_angewendet'),
   'EHRLICH: beta_Lw wird berechnet, aber nicht ohne Zustimmung angewendet');
var svDick = Solver.rechne(svEin({ N: 1000, t1: 5, t2: 5 }));
ok(svHat(svDick.warnungen, 'msg_sv_a_ueber_amax'), 'a5 bei t = 5 mm ueberschreitet a_max = 3,5 mm');
eq(svDick.grenzen.je_segment[0].a_max, 3.5, 'a_max wird je Segment ausgewiesen');
var svAmin = Solver.rechne(svEin({ N: 1000, segmente: svSeg(2) }));
ok(svHat(svAmin.warnungen, 'msg_sv_a_unter_amin'), 'a2 liegt unter dem Mindestmass a_min = 3 mm');

/* --- Fehlerwege: nie ein stilles Ergebnis ------------------------------ */
function svFehlt(ein, code, txt) {
  var r = Solver.rechne(ein);
  ok(r.ok === false && svHat(r.fehler, code), txt);
  ok(!('eta' in r) && !('massgebend' in r), txt + ' — und liefert KEINE Zahlen');
}
svFehlt({}, 'msg_sv_welt_fehlt', 'ohne Bemessungswelt wird nicht gerechnet');
svFehlt(svEin({ welt: 'C', N: 1 }), 'msg_sv_welt_fehlt', 'unbekannte Welt wird abgewiesen');
svFehlt(svEin({ rechenrichtung: 'irgendwas', N: 1 }), 'msg_sv_richtung_unbekannt',
        'unbekannte Rechenrichtung wird abgewiesen');
svFehlt({ welt: 'A', werkstoff: 'S235', nahtart: 'kehl_doppel', N: 1 },
        'msg_sv_nahtbild_fehlt', 'ohne Nahtbild wird nicht gerechnet');
svFehlt({ welt: 'A', nahtart: 'kehl_doppel', segmente: svSeg(5), N: 1 },
        'msg_sv_werkstoff_fehlt', 'ohne Werkstoff wird nicht gerechnet');
svFehlt(svEin({ werkstoff: 'S999', N: 1 }), 'msg_sv_werkstoff_unbekannt',
        'unbekannter Werkstoff wird abgewiesen');
svFehlt(svEin({}), 'msg_sv_keine_last', 'ohne jede Last wird nicht gerechnet');
svFehlt(svEin({ Q: 1000, Qz: 2000 }), 'msg_sv_last_doppelt',
        'Kurzform und ausfuehrliche Form mit verschiedenen Werten -> ehrlicher Fehler');
svFehlt(svEin({ M: 1000, My: 2000 }), 'msg_sv_last_doppelt',
        'dasselbe fuer das Biegemoment');
svFehlt(svEin({ welt: 'B', werkstoff: 'S235', N: 1000 }), 'msg_sv_kein_nu',
        'Welt B ohne Nahtguete: kein nu, also keine Rechnung');
svFehlt(svEin({ werkstoff: 'AW5083', zustand: 'O_H111', werkstoffgruppe: 'alu',
                zusatzwerkstoff: '4043A', N: 1000 }), 'msg_sv_kein_fw',
        'Alu ohne belegtes f_w fuer diese Zusatzkombination (AW-5083 mit 4043A)');
var svOkQM = Solver.rechne(svEin({ Q: 1000, Qz: 1000, M: 500, My: 500 }));
ok(svOkQM.ok, 'gleiche Werte in Kurz- und Langform sind kein Fehler');

/* --- Ampel und Ausnutzungsgrad ---------------------------------------- */
eq(Solver.ampel(0.5), 'gruen', 'Ampel: 50 % ist gruen');
eq(Solver.ampel(0.90), 'gruen', 'Ampel: genau 90 % ist noch gruen');
eq(Solver.ampel(0.95), 'gelb', 'Ampel: 95 % ist gelb');
eq(Solver.ampel(1.0), 'gelb', 'Ampel: genau 100 % ist gelb, nicht rot');
eq(Solver.ampel(1.01), 'rot', 'Ampel: ueber 100 % ist rot');
var svRot = Solver.rechne(svEin({ N: 3000000 }));
eq(svRot.ampel, 'rot', 'ueberlastete Naht bekommt die rote Ampel');
eq(svRot.erfuellt, false, 'und wird als nicht erfuellt gekennzeichnet');
ok(svHat(svRot.warnungen, 'msg_sv_nicht_erfuellt'), 'mit ausdruecklicher Warnung');
ok(svRot.ok === true, 'ein nicht erfuellter Nachweis ist KEIN Fehler — er wird gerechnet und gemeldet');

/* --- Zusatznachweis sigma_senk <= 0,9*fu/gammaM2 ---------------------- */
eq(svQz.nachweise.length, 2, 'richtungsbezogen: zwei Nachweise (Vergleichsspannung + sigma_senk)');
eq(svQz.nachweise[0].code, 'sv_nw_haupt', 'erster Nachweis ist die Vergleichsspannung');
eq(svQz.nachweise[1].code, 'sv_nw_sigma_senk', 'zweiter Nachweis ist sigma_senk <= 0,9*fu/gammaM2');
nahe(svQz.nachweise[1].grenze, 0.9 * 490 / 1.25, 1e-9, 'die Grenze des Zusatznachweises stimmt');
eq(svVer.nachweise.length, 1, 'vereinfachtes Verfahren: genau ein Nachweis');
ok(svQz.eta >= svQz.nachweise[0].eta && svQz.eta >= svQz.nachweise[1].eta,
   'der ausgewiesene Ausnutzungsgrad ist der groesste aller Einzelnachweise');

/* --- Liste "was NICHT geprueft wird" liegt im Ergebnis (2.4) ---------- */
eq(svQz.nicht_geprueft.length, 13, 'die Liste 2.4 mit 13 Punkten steht im Ergebnis');
svQz.nicht_geprueft.push('probe');
eq(Solver.rechne(svEin({ N: 200000 })).nicht_geprueft.length, 13,
   'die Liste ist eine Kopie — sie kann von aussen nicht verbogen werden');

/* --- Selbstpruefung von naht.js wird durchgereicht -------------------- */
ok(svQz.nahtbild.kontrolle.ok, 'die Selbstpruefung des Nahtbilds wird ins Ergebnis gehoben');
ok(svQz.nahtbild.A > 0 && svQz.nahtbild.Ip > 0, 'die Querschnittswerte kommen mit');

/* --- Geometrischer Lastweg (2.12) ------------------------------------- */
var svGeo = Solver.schnittgroessen(10000, 250, 'quer');
eq(svGeo.Qz, 10000, 'geometrischer Weg: Kraft wird zur Querkraft');
nahe(svGeo.My, 2500, 1e-12, 'geometrischer Weg: M_y = F*e = 10 kN * 0,25 m = 2500 Nm');
nahe(Solver.schnittgroessen(10000, 250, 'torsion').T, 2500, 1e-12,
     'geometrischer Weg: dieselbe Kraft als Torsionsmoment');

/* ========================================================================= */
sek('S27 · N3 — jeder Code und jede Groesse hat ihren Text (DE/EN/PT)');
var svOhne = 0, svAlleCodes = [], svKi;
svAlleCodes = svAlleCodes.concat(Solver.CODES.fehler, Solver.CODES.warnungen, Solver.CODES.hinweise);
for (svKi = 0; svKi < svAlleCodes.length; svKi++) {
  if (!Kern.has(svAlleCodes[svKi])) { svOhne++; console.log('    ohne Text: ' + svAlleCodes[svKi]); }
}
eq(svOhne, 0, 'jeder Meldungscode von solver.js hat einen Text (' + svAlleCodes.length + ' Codes)');
var svGrOhne = 0;
for (svKi = 0; svKi < Solver.GROESSEN.length; svKi++) {
  if (!Kern.has('sv_' + Solver.GROESSEN[svKi].code)) { svGrOhne++; console.log('    ohne Text: sv_' + Solver.GROESSEN[svKi].code); }
  if (!Kern.has(Solver.GROESSEN[svKi].einheit)) { svGrOhne++; console.log('    ohne Einheit: ' + Solver.GROESSEN[svKi].einheit); }
}
eq(svGrOhne, 0, 'jede Ergebnisgroesse hat Beschriftung und Einheit');
var svNwOhne = 0;
['sv_nw_haupt', 'sv_nw_sigma_senk', 'sv_nw_vereinfacht', 'sv_nw_weltb', 'sv_nw_weltb_schub',
 'sv_formel_ec3', 'sv_formel_alu', 'sv_formel_weltb_tabelle', 'sv_formel_weltb_formel',
 'amp_gruen', 'amp_gelb', 'amp_rot'].forEach(function (k) {
  if (!Kern.has(k)) { svNwOhne++; console.log('    ohne Text: ' + k); }
});
eq(svNwOhne, 0, 'Nachweisnamen, Nachweisgleichungen und Ampelstufen sind beschriftet');
ok(Kern.has('grp_a_rundung') && Kern.has('opt_a_rundung_ganze_mm') && Kern.has('opt_a_rundung_halbe_mm'),
   'die Auswahlgruppe a_rundung ist vollstaendig beschriftet');
ok(Hilfe.has('grp_a_rundung'), 'Laien-ⓘ an der Auswahlgruppe a_rundung');
ok(Hilfe.has('grp_weltb_nahtgruppe'), 'Laien-ⓘ an der Welt-B-Nahtgruppe');
var svFldOhne = 0;
['Qy', 'Qz', 'My', 'Mz', 'Re'].forEach(function (c) {
  var f = Valid.feld(c);
  if (!f) { svFldOhne++; console.log('    Feld fehlt: ' + c); return; }
  if (!Kern.has(f.label)) svFldOhne++;
  if (!Hilfe.has(f.hilfe)) svFldOhne++;
  if (!Kern.has(f.einheit)) svFldOhne++;
});
eq(svFldOhne, 0, 'die fuenf neuen Eingabefelder haben Beschriftung, Laien-ⓘ und Einheit');
var svDreiSpr = 0;
for (svKi = 0; svKi < svAlleCodes.length; svKi++) {
  ['de', 'en', 'pt'].forEach(function (l) {
    var t = Kern.t(svAlleCodes[svKi], l);
    if (!t || t.charAt(0) === '[') svDreiSpr++;
  });
}
eq(svDreiSpr, 0, 'jeder N3-Meldungstext liegt in allen drei Sprachen vor');

/* ========================================================================= */
sek('S28 · N4 Rechenweg — Vollstaendigkeit, Proben, Negativkontrolle');

ok(!!Weg, 'rechenweg.js geladen');
ok(typeof Weg.baue === 'function' && typeof Weg.ausErgebnis === 'function' &&
   typeof Weg.rendere === 'function' && typeof Weg.pruefe === 'function',
   'baue, ausErgebnis, rendere und pruefe sind da');

/* --- Testfaelle: jeder Rechenpfad mindestens einmal -------------------- */
function rwSegs(a) {
  return [Naht.linie(-50, -100, -50, 100, a), Naht.linie(50, -100, 50, 100, a)];
}
/* Unsymmetrisch: ys, zs und Iyz sind ungleich null. Nur so faellt eine
   verfaelschte Null ueberhaupt auf (Testdaten-Falle aus diesem Baustein). */
var rwSegU = [Naht.linie(0, 0, 0, 200, 5, 'steg'),
              Naht.linie(0, 200, 120, 200, 4, 'flansch'),
              Naht.linie(0, 0, 80, 0, 4, 'fuss')];

var rwFaelle = [
  ['A richtungsbezogen', { welt: 'A', rechenrichtung: 'nachweis', nachweisverfahren: 'richtungsbezogen',
    werkstoff: 'S355', bw_regelsatz: 'na_de', nahtart: 'kehl_doppel', t1: 10, t2: 10,
    modell: 'duennwandig', segmente: rwSegs(5), N: 200000 }],
  ['A vereinfacht', { welt: 'A', rechenrichtung: 'nachweis', nachweisverfahren: 'vereinfacht',
    werkstoff: 'S355', bw_regelsatz: 'na_de', nahtart: 'kehl_doppel', t1: 10, t2: 10,
    segmente: rwSegs(5), Qz: 150000 }],
  ['A Edelstahl', { welt: 'A', rechenrichtung: 'nachweis', werkstoff: '1.4404',
    nahtart: 'kehl_doppel', t1: 8, t2: 8, segmente: rwSegs(4), N: 100000 }],
  ['A Aluminium', { welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'AW6082', zustand: 'T6',
    zusatzwerkstoff: '5356', nahtart: 'kehl_doppel', t1: 10, t2: 10,
    segmente: rwSegs(6), N: 80000 }],
  ['B Formelweg', { welt: 'B', rechenrichtung: 'nachweis', werkstoff: 'S235',
    nahtguete: 'durchgeschweisst_zug_ungeprueft', lastfall: 'ruhend', nahtart: 'stumpf_v',
    t1: 10, t2: 10, segmente: rwSegs(7), N: 200000 }],
  ['B Tabellenweg', { welt: 'B', rechenrichtung: 'nachweis', werkstoff: 'S235',
    weltb_nahtgruppe: 'kehl_flach', nahtguete: 'kehlnaht_allgemein', lastfall: 'schwellend',
    nahtart: 'kehl_doppel', t1: 10, t2: 10, segmente: rwSegs(5), N: 100000 }],
  ['A Auslegung Rundrohr', { welt: 'A', rechenrichtung: 'auslegung', werkstoff: 'S355',
    bw_regelsatz: 'na_de', nahtart: 'kehl_umlaufend',
    profil_eingabe: { profil: 'rohr_rund', kanten: 'rundum', d: 100, t1: 8, a: 4 },
    t1: 8, t2: 8, T: 15000, N: 50000, a: 4, a_rundung: 'ganze_mm' }],
  ['A I-Profil Flansche', { welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S355',
    bw_regelsatz: 'na_de', nahtart: 'kehl_doppel',
    profil_eingabe: { profil: 'i_profil', kanten: 'flansche', b: 100, h: 200, tw: 6, tf: 9, a: 5 },
    t1: 9, t2: 9, My: 15000, Qz: 60000 }],
  ['A Stumpf teilweise', { welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S275',
    bw_regelsatz: 'na_de', nahtart: 'stumpf_hv', t1: 12, t2: 12,
    segmente: rwSegs(8), My: 20000 }],
  ['A Stumpf durchgeschweisst', { welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S275',
    bw_regelsatz: 'na_de', nahtart: 'stumpf_v', t1: 12, t2: 12,
    segmente: rwSegs(12), My: 20000 }],
  ['A unsymmetrisch', { welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S355',
    bw_regelsatz: 'na_de', nahtart: 'kehl_doppel', t1: 10, t2: 10, segmente: rwSegU,
    N: 120000, My: 9000, Mz: 4000, Qz: 30000, T: 2500 }]
];

var rwI, rwJ, rwK, rwE, rwW, rwP, rwG;

/* --- Jeder Pfad liefert einen vollstaendigen, in sich stimmigen Weg ---- */
var rwOhneOk = 0, rwOhneProbe = 0, rwProbeFehl = 0, rwLeerCode = 0,
    rwFremdAb = 0, rwFremdSchritt = 0, rwFremdQuelle = 0, rwFremdProbe = 0;
for (rwI = 0; rwI < rwFaelle.length; rwI++) {
  rwW = Weg.baue(rwFaelle[rwI][1]);
  if (!rwW.ok) { rwOhneOk++; console.log('    kein Weg: ' + rwFaelle[rwI][0]); continue; }
  rwP = Weg.pruefe(rwW);
  if (rwP.n === 0) rwOhneProbe++;
  if (!rwP.ok) { rwProbeFehl++; console.log('    Probe gekippt bei ' + rwFaelle[rwI][0] + ': ' + rwP.fehlgeschlagen.join(',')); }
  for (rwJ = 0; rwJ < rwW.schritte.length; rwJ++) {
    var rwS = rwW.schritte[rwJ];
    if (!rwS.code) rwLeerCode++;
    if (Weg.ABSCHNITTE.indexOf(rwS.abschnitt) < 0) rwFremdAb++;
    if (Weg.SCHRITTE.indexOf(rwS.code) < 0) { rwFremdSchritt++; console.log('    unbekannter Schritt: ' + rwS.code); }
    if (rwS.quelle && Weg.QUELLEN.indexOf(rwS.quelle) < 0) { rwFremdQuelle++; console.log('    unbekannte Quelle: ' + rwS.quelle); }
    if (rwS.probe && Weg.PROBEN.indexOf(rwS.probe) < 0) { rwFremdProbe++; console.log('    unbekannte Probe: ' + rwS.probe); }
  }
}
eq(rwOhneOk, 0, 'alle ' + rwFaelle.length + ' Rechenpfade liefern einen Rechenweg');
eq(rwOhneProbe, 0, 'jeder Rechenweg traegt mindestens eine Rechenprobe');
eq(rwProbeFehl, 0, 'in keinem Rechenpfad kippt eine Rechenprobe');
eq(rwLeerCode, 0, 'jeder Schritt hat einen Code');
eq(rwFremdAb, 0, 'jeder Schritt liegt in einem bekannten Abschnitt');
eq(rwFremdSchritt, 0, 'jeder Schrittcode steht im Verzeichnis SCHRITTE');
eq(rwFremdQuelle, 0, 'jede benannte Grundlage steht im Verzeichnis QUELLEN');
eq(rwFremdProbe, 0, 'jede Probe steht im Verzeichnis PROBEN');

/* --- Jeder Code hat seinen Text, und zwar in allen drei Sprachen ------- */
var rwAlleCodes = Weg.ABSCHNITTE.concat(Weg.SCHRITTE, Weg.PROBEN, Weg.QUELLEN);
var rwOhneText = 0, rwOhneSpr = 0;
for (rwI = 0; rwI < rwAlleCodes.length; rwI++) {
  if (!Kern.has(rwAlleCodes[rwI])) { rwOhneText++; console.log('    ohne Text: ' + rwAlleCodes[rwI]); }
  ['de', 'en', 'pt'].forEach(function (l) {
    var t = Kern.t(rwAlleCodes[rwI], l);
    if (!t || t.charAt(0) === '[') rwOhneSpr++;
  });
}
eq(rwOhneText, 0, 'jeder Code des Rechenwegs hat einen Text (' + rwAlleCodes.length + ' Codes)');
eq(rwOhneSpr, 0, 'jeder Text des Rechenwegs liegt in DE, EN und PT vor');
ok(Kern.has('rw_titel') && Kern.has('rw_probe') && Kern.has('rw_selbstpruefung'),
   'die Rahmenbeschriftungen des Rechenwegs sind vorhanden');

/* --- Dreisprachig gerendert, ohne einen einzigen Platzhalter ----------- */
var rwPlatz = 0, rwLeerTitel = 0;
for (rwI = 0; rwI < rwFaelle.length; rwI++) {
  rwW = Weg.baue(rwFaelle[rwI][1]);
  if (!rwW.ok) continue;
  ['de', 'en', 'pt'].forEach(function (l) {
    rwG = Weg.rendere(rwW, l);
    if (/\[[a-z0-9_.]+\]/.test(Weg.alleTexte(rwG))) {
      rwPlatz++;
      console.log('    Platzhalter in ' + l + ' bei ' + rwFaelle[rwI][0] + ': ' +
                  /\[[a-z0-9_.]+\]/.exec(Weg.alleTexte(rwG))[0]);
    }
    for (rwJ = 0; rwJ < rwG.schritte.length; rwJ++) {
      if (!rwG.schritte[rwJ].titel) rwLeerTitel++;
    }
  });
}
eq(rwPlatz, 0, 'kein unuebersetzter Platzhalter in DE/EN/PT ueber alle Rechenpfade');
eq(rwLeerTitel, 0, 'jeder Schritt hat in jeder Sprache eine Ueberschrift');

/* --- Zahlformat: DE und PT mit Komma, EN mit Punkt --------------------- */
eq(Weg.zahl(1234.5, 1, 'de'), '1.234,5', 'DE: Tausenderpunkt und Dezimalkomma');
eq(Weg.zahl(1234.5, 1, 'pt'), '1.234,5', 'PT: wie DE');
eq(Weg.zahl(1234.5, 1, 'en'), '1,234.5', 'EN: Tausenderkomma und Dezimalpunkt');
eq(Weg.zahl(-2.5, 2, 'de'), '\u22122,50', 'negatives Vorzeichen ist ein echtes Minuszeichen');
eq(Weg.zahl(NaN, 2, 'de'), '\u2013', 'kein Wert -> Gedankenstrich statt NaN');
eq(Weg.fuellen('{0} + {1} = {2}', [{ v: 1, nk: 0 }, { v: 2, nk: 0 }, { v: 3, nk: 0 }], 'de'),
   '1 + 2 = 3', 'Vorlage wird mit den Zahlen gefuellt');

/* --- PFLICHT-ASSERTION: Negativkontrolle ------------------------------- */
/* Ein absichtlich verfaelschtes Ergebnis MUSS ein Haekchen umkippen.      */
var rwEinU = rwFaelle[10][1];
var rwPfade = ['nahtbild.A', 'nahtbild.l_ges', 'nahtbild.ys', 'nahtbild.zs',
  'nahtbild.Iy', 'nahtbild.Iz', 'nahtbild.Iyz', 'nahtbild.Ip', 'nahtbild.Wt',
  'massgebend.sigma_x', 'massgebend.tau_n', 'massgebend.tau_t', 'massgebend.q_senk',
  'massgebend.sigma_senk', 'massgebend.tau_senk', 'massgebend.tau_par',
  'massgebend.sigma_v', 'widerstand.R_d', 'widerstand.fu', 'widerstand.betaW',
  'widerstand.gammaM2', 'eta', 'schnittgroessen.N', 'schnittgroessen.Qz',
  'schnittgroessen.My', 'schnittgroessen.Mz', 'schnittgroessen.T'];
var rwUnerkannt = 0;
for (rwI = 0; rwI < rwPfade.length; rwI++) {
  rwE = Solver.rechne(rwEinU);
  var rwZiel = rwE, rwT = rwPfade[rwI].split('.');
  for (rwJ = 0; rwJ < rwT.length - 1; rwJ++) rwZiel = rwZiel[rwT[rwJ]];
  rwZiel[rwT[rwT.length - 1]] = rwZiel[rwT[rwT.length - 1]] * 1.000001;
  if (Weg.pruefe(Weg.ausErgebnis(rwE, rwEinU)).ok) {
    rwUnerkannt++;
    console.log('    NICHT erkannt: ' + rwPfade[rwI]);
  }
}
eq(rwUnerkannt, 0, 'NEGATIVKONTROLLE: alle ' + rwPfade.length +
   ' verfaelschten Ergebniswerte kippen ein Haekchen (Verfaelschung nur 1e-6 relativ)');
ok(Weg.pruefe(Weg.baue(rwEinU)).ok, 'derselbe Fall bleibt unverfaelscht vollstaendig gruen');

/* --- Rechenprobe und Nachweis sind GETRENNT ---------------------------- */
/* Ein zu kleines a-Mass ist ein nicht erfuellter Nachweis, KEIN Rechen-
   fehler. Wuerde beides in einem Haekchen stecken, waere die Selbst-
   pruefung als Warnsignal wertlos. */
var rwKlein = Weg.baue({ welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S235',
  bw_regelsatz: 'na_de', nahtart: 'kehl_doppel', t1: 10, t2: 10,
  segmente: rwSegs(2), N: 30000 });
ok(rwKlein.ok, 'zu duenne Naht liefert trotzdem einen vollstaendigen Rechenweg');
ok(rwKlein.selbstpruefung_ok === true, 'a unter a_min kippt KEINE Rechenprobe');
ok(rwKlein.nachweis_ok === false, 'a unter a_min wird als nicht erfuellter Nachweis gemeldet');
var rwAmin = null;
for (rwI = 0; rwI < rwKlein.schritte.length; rwI++) {
  if (rwKlein.schritte[rwI].code === 'rw_s_a_min') rwAmin = rwKlein.schritte[rwI];
}
ok(!!rwAmin && rwAmin.erfuellt === false, 'der Schritt "Mindest-a-Mass" traegt das rote Haekchen');
ok(!!rwAmin && rwAmin.hinweis === 'msg_sv_a_unter_amin', 'und den passenden Klartext-Hinweis');

/* --- Die Haekchen aus naht.js stehen als Zeilen im Rechenweg ----------- */
var rwStd = Weg.baue(rwFaelle[0][1]);
function rwSchritt(w, code) {
  for (var k = 0; k < w.schritte.length; k++) if (w.schritte[k].code === code) return w.schritte[k];
  return null;
}
ok(!!rwSchritt(rwStd, 'rw_s_kontrolle_schwerpunkt'), 'Selbstpruefung Schwerpunkt steht im Rechenweg');
ok(!!rwSchritt(rwStd, 'rw_s_kontrolle_polar'), 'Selbstpruefung Ip = Iy + Iz steht im Rechenweg');
ok(!!rwSchritt(rwStd, 'rw_s_kontrolle_haupt'), 'Selbstpruefung Hauptachsen steht im Rechenweg');
ok(rwSchritt(rwStd, 'rw_s_kontrolle_gesamt').haken === true, 'die Gesamtzeile zaehlt alle Haekchen');
ok(!!rwSchritt(rwStd, 'rw_s_nicht_geprueft'), 'die Liste 2.4 steht im Rechenweg');
eq(rwSchritt(rwStd, 'rw_s_nicht_geprueft').liste.length, 13,
   'die Liste 2.4 traegt alle 13 Punkte');
eq(rwSchritt(rwStd, 'rw_s_flaeche').probe, 'rw_p_flaeche',
   'die Nahtflaeche nennt ihren zweiten Rechenpfad');
eq(rwSchritt(rwStd, 'rw_s_widerstand').quelle, 'qu_ec3_1_8',
   'der Widerstand nennt seine Grundlage EN 1993-1-8');
eq(rwSchritt(rwStd, 'rw_s_werkstoff').text, 'opt_werkstoff_S355',
   'der Werkstoff steht als Code, nicht als Text');

/* --- Hand-Anker mitten im Rechenweg ----------------------------------- */
/* Konsole 2 x 200 mm, a5, N = 200 kN: A_w = 2000 mm2, sigma_x = 100 N/mm2,
   sigma_v = sqrt(2)*100, R_d = 490/(0,90*1,25). */
nahe(rwSchritt(rwStd, 'rw_s_flaeche').ergebnis, 2000, 1e-9, 'HAND-ANKER: A_w = 2 * 5 * 200 = 2000 mm2');
nahe(rwSchritt(rwStd, 'rw_s_sigma_x').ergebnis, 100, 1e-9, 'HAND-ANKER: sigma_x = 200000/2000 = 100 N/mm2');
nahe(rwSchritt(rwStd, 'rw_s_umklappen').ergebnis, 100 / Math.sqrt(2), 1e-9,
     'HAND-ANKER: Umklappen ergibt 70,71 N/mm2');
nahe(rwSchritt(rwStd, 'rw_s_sigma_v').ergebnis, Math.sqrt(2) * 100, 1e-9,
     'HAND-ANKER: sigma_v = sqrt(2)*sigma_x bei reinem Querzug');
nahe(rwSchritt(rwStd, 'rw_s_widerstand').ergebnis, 490 / (0.90 * 1.25), 1e-9,
     'HAND-ANKER: R_d = 490/(0,90*1,25) = 435,56 N/mm2');

/* --- Auslegung: BEIDE a-Zahlen stehen im Rechenweg (2.3) --------------- */
var rwAus = Weg.baue(rwFaelle[6][1]);
var rwErf = rwSchritt(rwAus, 'rw_s_a_erf'), rwGew = rwSchritt(rwAus, 'rw_s_a_gewaehlt');
ok(!!rwErf && !!rwGew, 'Auslegung: erforderliches UND gewaehltes a-Mass sind eigene Schritte');
ok(rwGew.ergebnis >= rwErf.ergebnis - 1e-9, 'das gewaehlte a-Mass ist nie kleiner als das erforderliche');
ok(rwGew.ergebnis - rwErf.ergebnis < 1.0 + 1e-9, 'aufgerundet wird hoechstens um eine ganze Stufe');
ok(Math.abs(rwGew.ergebnis - Math.round(rwGew.ergebnis)) < 1e-9,
   'bei ganzen Millimetern liegt das gewaehlte Mass auf der Stufenreihe');
ok(rwErf.haken === true && rwGew.haken === true, 'beide a-Schritte sind durch eine Probe gedeckt');
ok(!!rwSchritt(rwAus, 'rw_s_a_kontrolle'), 'die Nachrechnung mit dem gewaehlten a-Mass steht dabei');

/* --- Determinismus und Nichtmutation ---------------------------------- */
var rwEin1 = { welt: 'A', rechenrichtung: 'nachweis', werkstoff: 'S355', bw_regelsatz: 'na_de',
  nahtart: 'kehl_doppel', t1: 10, t2: 10, segmente: rwSegs(5), N: 200000 };
var rwVor = JSON.stringify(rwEin1);
var rwA1 = Weg.baue(rwEin1), rwA2 = Weg.baue(rwEin1);
eq(JSON.stringify(rwEin1), rwVor, 'rechenweg.js mutiert seine Eingabe nicht');
eq(JSON.stringify(rwA1.schritte), JSON.stringify(rwA2.schritte),
   'zwei Laeufe liefern denselben Rechenweg (Determinismus)');
eq(JSON.stringify(Weg.rendere(rwA1, 'de')), JSON.stringify(Weg.rendere(rwA2, 'de')),
   'auch das Rendern ist deterministisch');
var rwSegVor = JSON.stringify(rwEin1.segmente);
Weg.baue({ welt: 'A', rechenrichtung: 'auslegung', werkstoff: 'S355', bw_regelsatz: 'na_de',
  nahtart: 'kehl_doppel', t1: 10, t2: 10, segmente: rwEin1.segmente, N: 600000, a: 5 });
eq(JSON.stringify(rwEin1.segmente), rwSegVor, 'auch die Auslegung laesst die Segmente unberuehrt');

/* --- Fehlerfall: kein halber Rechenweg, keine stille Zahl -------------- */
var rwFehl = Weg.baue({ welt: 'A', werkstoff: 'S355', nahtart: 'kehl_doppel', segmente: rwSegs(5) });
ok(rwFehl.ok === false, 'ohne Last gibt es keinen Rechenweg');
eq(rwFehl.schritte.length, 0, 'im Fehlerfall gibt es KEINEN einzigen Schritt');
ok(rwFehl.fehler.length > 0, 'im Fehlerfall steht der Fehlercode da');
ok(rwFehl.selbstpruefung_ok === false, 'im Fehlerfall gilt die Selbstpruefung als nicht bestanden');
eq(Weg.rendere(rwFehl, 'de').schritte.length, 0, 'auch gerendert bleibt der Fehlerfall leer');

/* --- Abschnitte in fester Reihenfolge ---------------------------------- */
var rwFolge = [];
for (rwI = 0; rwI < rwAus.abschnitte.length; rwI++) rwFolge.push(rwAus.abschnitte[rwI].code);
var rwSortiert = true;
for (rwI = 1; rwI < rwFolge.length; rwI++) {
  if (Weg.ABSCHNITTE.indexOf(rwFolge[rwI]) <= Weg.ABSCHNITTE.indexOf(rwFolge[rwI - 1])) rwSortiert = false;
}
ok(rwSortiert, 'die Abschnitte stehen in der festgelegten Reihenfolge: ' + rwFolge.join(' \u2192 '));
ok(rwFolge.indexOf('rw_ab_auslegung') > rwFolge.indexOf('rw_ab_nachweis'),
   'die Auslegung steht hinter dem Nachweis');
ok(rwFolge[rwFolge.length - 1] === 'rw_ab_hinweise',
   'Warnungen und ehrliche Hinweise stehen am Schluss');

/* --- Laien-ⓘ am Rechenweg --------------------------------------------- */
var rwHilfe = ['rw_titel', 'rw_s_umklappen', 'rw_s_sigma_v', 'rw_s_widerstand',
               'rw_s_ausnutzung', 'rw_s_a_gewaehlt', 'rw_s_kontrolle_gesamt'];
var rwHFehlt = 0;
for (rwI = 0; rwI < rwHilfe.length; rwI++) {
  if (!Hilfe.has(rwHilfe[rwI])) { rwHFehlt++; console.log('    ohne Laien-ⓘ: ' + rwHilfe[rwI]); continue; }
  ['de', 'en', 'pt'].forEach(function (l) {
    ['was', 'bereich', 'tipp'].forEach(function (f) {
      if (!Hilfe.h(rwHilfe[rwI], l, f)) rwHFehlt++;
    });
  });
}
eq(rwHFehlt, 0, 'die ' + rwHilfe.length + ' Laien-ⓘ des Rechenwegs sind in DE/EN/PT vollstaendig');

/* ========================================================================= */
sek('S29 · N5a UI-Grundgeruest — Geruest, Texte, Editionsgleichheit');
var fsU = require('fs');
var Ui = require('./ui.js');

/* --- Modul und die bindenden Vorgaben ---------------------------------- */
ok(!!Ui, 'ui.js laedt als Modul');
eq(Ui.NAME, 'ui', 'Namensraum DTNUi');
ok(typeof Ui.start === 'function', 'ui.js bietet start(win, doc)');
eq(Ui.START_THEME, 'dark', 'BINDEND (Plan 3.1): die Oberflaeche startet immer im dunklen Design');
eq(Ui.START_SPRACHE, 'de', 'Startsprache ist Deutsch');
eq(Ui.SPRACHEN.length, 3, 'drei Sprachen DE/EN/PT');
eq(Ui.BEREICHE.length, 8, 'acht aufklappbare Bereiche im Formulargeruest');
ok(Ui.BEREICHE.indexOf(Ui.BEREICH_START_OFFEN) >= 0, 'der beim Start offene Bereich gehoert zur Liste');
ok(Ui.start(null, null) === null, 'ohne DOM tut ui.js nichts und wirft nicht');

var uiDoppelt = 0, uiI, uiJ;
for (uiI = 0; uiI < Ui.BEREICHE.length; uiI++) {
  for (uiJ = uiI + 1; uiJ < Ui.BEREICHE.length; uiJ++) {
    if (Ui.BEREICHE[uiI] === Ui.BEREICHE[uiJ]) uiDoppelt++;
  }
}
eq(uiDoppelt, 0, 'kein Bereichscode doppelt');

/* --- ui.js bleibt fachlogikfrei ---------------------------------------- */
var uiSrc = fsU.readFileSync(__dirname + '/ui.js', 'utf8');
/* N5c-1: ui.js darf GENAU EIN Rechenmodul aufrufen — den Solver. Er holt
   sich Nahtbild, Profil und Werkstoffkennwerte selbst; ui.js uebergibt nur
   die uebersetzte Eingabe und zeigt an, was zurueckkommt. Die Grenze wird
   damit nicht aufgeweicht, sondern GESCHAERFT: aus "kein Rechenmodul" wird
   "dieses eine". Der Rechenweg kommt in N5c-2 dazu — dann waechst die Liste
   um genau einen Namen. Geprueft wird der Quelltext als Zeichenkette,
   Kommentare eingeschlossen. */
var uiErlaubt  = ['DTNSolver', 'DTNRechenweg', 'DTNSchaubild'];
var uiVerboten = ['DTNNaht', 'DTNProfil', 'DTNData'];
var uiTreffer = [];
for (uiI = 0; uiI < uiVerboten.length; uiI++) {
  if (uiSrc.indexOf(uiVerboten[uiI]) >= 0) uiTreffer.push(uiVerboten[uiI]);
}
eq(uiTreffer.length, 0, 'ui.js ruft ausser dem Solver KEIN Rechenmodul auf (' + uiTreffer.join(',') + ')');
for (uiI = 0; uiI < uiErlaubt.length; uiI++) {
  ok(uiSrc.indexOf(uiErlaubt[uiI]) > 0,
     'ui.js ruft dieses erlaubte Anzeigemodul auf: ' + uiErlaubt[uiI]);
}
/* Die drei Erlaubten rechnen den Nachweis NICHT noch einmal: der Solver
   rechnet, der Rechenweg beschriftet, das Schaubild zeichnet. Deshalb darf
   ui.js weiterhin keine eigene Rechnung enthalten — das prueft der Test auf
   'Math.' gleich darunter. */
ok(uiSrc.indexOf('DTNValidate') > 0 || uiSrc.indexOf('Valid.rechenEingabe') > 0,
   'und es uebersetzt die Eingabe ueber validate.js, statt selbst umzurechnen');
ok(uiSrc.indexOf('Math.') < 0, 'ui.js rechnet nichts (kein Math. im Quelltext)');
ok(uiSrc.indexOf('DTNI18nKern') > 0, 'ui.js holt seine Texte ausschliesslich aus dem Woerterbuch');

/* --- Texte: jeder Bereich hat Titel und Laien-Erklaerung in DE/EN/PT ---- */
var uiFehltText = 0, uiKurz = 0;
for (uiI = 0; uiI < Ui.BEREICHE.length; uiI++) {
  var uiC = Ui.BEREICHE[uiI];
  ['sec_' + uiC, 'sec_' + uiC + '_hint'].forEach(function (k) {
    if (!Kern.has(k)) { uiFehltText++; console.log('    ohne Text: ' + k); return; }
    ['de', 'en', 'pt'].forEach(function (l) {
      var v = Kern.t(k, l);
      if (!v || v.charAt(0) === '[') uiFehltText++;
      if (/_hint$/.test(k) && v.length < 40) uiKurz++;
    });
  });
}
eq(uiFehltText, 0, 'jeder der 8 Bereiche hat Titel und Erklaerung in allen drei Sprachen');
eq(uiKurz, 0, 'jede Bereichserklaerung ist wirklich eine Erklaerung, kein Stichwort');

var uiSchluessel = ['appName', 'tagline', 'calc', 'reset', 'loadExample', 'assistant',
  'outSave', 'outLoad', 'outPrint', 'outRtf', 'outDesign', 'themeTitle', 'infoTitle',
  'inputTitle', 'resultTitle', 'pathTitle', 'vizTitle', 'close', 'disclaimer',
  'impressum', 'infoProdukt', 'infoNormen', 'editionTest', 'uiEditionVoll',
  'uiGeruest', 'uiGeleert', 'uiFolgtN5b', 'uiFolgtN5c', 'uiFolgtN7', 'uiFolgtN8',
  'uiFolgtN11', 'resultIdle', 'vizIdle', 'pathIdle'];
var uiFehltK = 0;
for (uiI = 0; uiI < uiSchluessel.length; uiI++) {
  if (!Kern.has(uiSchluessel[uiI])) { uiFehltK++; console.log('    ohne Text: ' + uiSchluessel[uiI]); continue; }
  ['de', 'en', 'pt'].forEach(function (l) {
    var v = Kern.t(uiSchluessel[uiI], l);
    if (!v || v.charAt(0) === '[') uiFehltK++;
  });
}
eq(uiFehltK, 0, 'alle ' + uiSchluessel.length + ' Bedientexte der Oberflaeche sind dreisprachig belegt');

var uiKnopfFehlt = 0;
for (uiI = 0; uiI < Ui.GERUEST_BUTTONS.length; uiI++) {
  if (!Kern.has(Ui.GERUEST_BUTTONS[uiI][1])) uiKnopfFehlt++;
}
eq(uiKnopfFehlt, 0, 'jeder noch nicht verdrahtete Knopf hat eine ehrliche, uebersetzte Meldung');
ok(/N11/.test(Kern.t('uiFolgtN11', 'de')) && /N11/.test(Kern.t('uiFolgtN11', 'en')),
   'die Geruestmeldung nennt den Baustein, der den Knopf verdrahtet');

/* --- Beide HTMLs: genau eine Zeile Unterschied -------------------------- */
var uiVoll = fsU.readFileSync(__dirname + '/DT-ProfiSchweissnaht.html', 'utf8').split('\n');
var uiTest = fsU.readFileSync(__dirname + '/DT-ProfiSchweissnaht_Test.html', 'utf8').split('\n');
eq(uiVoll.length, uiTest.length, 'beide HTMLs haben dieselbe Zeilenzahl');
var uiDiff = [];
for (uiI = 0; uiI < uiVoll.length; uiI++) {
  if (uiVoll[uiI] !== uiTest[uiI]) uiDiff.push(uiI + 1);
}
eq(uiDiff.length, 1, 'die beiden HTMLs unterscheiden sich in GENAU EINER Zeile (Zeile ' + uiDiff.join(',') + ')');
ok(uiDiff.length === 1 && /DT_EDITION/.test(uiVoll[uiDiff[0] - 1]),
   'und diese eine Zeile ist die Editionsweiche');
ok(/window\.DT_EDITION = 'full';/.test(uiVoll.join('\n')), 'Voll-HTML steht auf full');
ok(/window\.DT_EDITION = 'test';/.test(uiTest.join('\n')), 'Test-HTML steht auf test');

/* --- Pflicht-Elemente, Ladereihenfolge, Startdarstellung ---------------- */
var uiHtml = uiVoll.join('\n');
var uiIdFehlt = [];
for (uiI = 0; uiI < Ui.IDS.length; uiI++) {
  if (uiHtml.indexOf('id="' + Ui.IDS[uiI] + '"') < 0) uiIdFehlt.push(Ui.IDS[uiI]);
}
eq(uiIdFehlt.length, 0, 'alle ' + Ui.IDS.length + ' Pflicht-Elemente stehen in der HTML (' + uiIdFehlt.join(',') + ')');

var uiAccFehlt = [];
for (uiI = 0; uiI < Ui.BEREICHE.length; uiI++) {
  ['acc_', 'accBtn_', 'accBody_', 'accTitel_', 'accHint_', 'accCaret_'].forEach(function (p) {
    if (uiHtml.indexOf('id="' + p + Ui.BEREICHE[uiI] + '"') < 0) uiAccFehlt.push(p + Ui.BEREICHE[uiI]);
  });
}
eq(uiAccFehlt.length, 0, 'jeder Bereich hat Kopf, Korpus, Titel, Erklaerung und Pfeil (' + uiAccFehlt.join(',') + ')');

ok(/<html lang="de" translate="no" data-theme="dark">/.test(uiHtml),
   'die HTML startet dunkel, ohne Aufblitzen des hellen Designs');
ok(/translate="no"/.test(uiHtml) && /notranslate/.test(uiHtml), 'notranslate ist gesetzt');
eq((uiHtml.match(/<script>/g) || []).length, 1,
   'genau ein Inline-Skript: die Editionsweiche — die Zwischen-Statusseite aus N1-N4 ist weg');

var uiSrcRe = /<script src="([^"]+)"><\/script>/g, uiSrcs = [], uiM;
while ((uiM = uiSrcRe.exec(uiHtml)) !== null) uiSrcs.push(uiM[1]);
eq(uiSrcs.length, 14, '14 Module in der HTML eingebunden — symbol.js ist mit N6b dazugekommen');
eq(uiSrcs[uiSrcs.length - 1], 'ui.js', 'ui.js laedt zuletzt');
var uiDateiFehlt = [];
for (uiI = 0; uiI < uiSrcs.length; uiI++) {
  if (!fsU.existsSync(__dirname + '/' + uiSrcs[uiI])) uiDateiFehlt.push(uiSrcs[uiI]);
}
eq(uiDateiFehlt.length, 0, 'jede eingebundene Datei liegt wirklich im Ordner (' + uiDateiFehlt.join(',') + ')');

/* --- Jeder i18n-Schluessel der HTML ist dreisprachig belegt -------------- */
var uiKeyRe = /data-i18n(?:-title|-ph)?="([a-zA-Z0-9_]+)"/g, uiKeys = [], uiK;
while ((uiK = uiKeyRe.exec(uiHtml)) !== null) if (uiKeys.indexOf(uiK[1]) < 0) uiKeys.push(uiK[1]);
ok(uiKeys.length >= 25, 'die HTML beschriftet sich ueber ' + uiKeys.length + ' i18n-Schluessel');
var uiHtmlFehlt = [];
for (uiI = 0; uiI < uiKeys.length; uiI++) {
  if (!Kern.has(uiKeys[uiI])) { uiHtmlFehlt.push(uiKeys[uiI]); continue; }
  ['de', 'en', 'pt'].forEach(function (l) {
    var v = Kern.t(uiKeys[uiI], l);
    if (!v || v.charAt(0) === '[') uiHtmlFehlt.push(uiKeys[uiI] + '.' + l);
  });
}
eq(uiHtmlFehlt.length, 0, 'jeder i18n-Schluessel der HTML ist in DE/EN/PT belegt (' + uiHtmlFehlt.join(',') + ')');

/* --- style.css traegt jede Klasse, die die Oberflaeche benutzt ---------- */
var uiCss = fsU.readFileSync(__dirname + '/style.css', 'utf8');
var uiCssFehlt = [];
for (uiI = 0; uiI < Ui.KLASSEN.length; uiI++) {
  if (uiCss.indexOf('.' + Ui.KLASSEN[uiI]) < 0) uiCssFehlt.push(Ui.KLASSEN[uiI]);
}
eq(uiCssFehlt.length, 0, 'style.css kennt alle ' + Ui.KLASSEN.length + ' Klassen der Oberflaeche (' + uiCssFehlt.join(',') + ')');
ok(/\[data-theme="dark"\]/.test(uiCss), 'style.css hat einen eigenen Satz Farben fuer das dunkle Design');
ok(/@media print/.test(uiCss), 'style.css hat einen Druck-Satz (Grundlage fuer N11)');
ok(/@media \(min-width:900px\)/.test(uiCss), 'Handy zuerst: zweispaltig erst ab 900 px');

/* --- Klassen, die in der HTML stehen, kennt die CSS ebenfalls ----------- */
var uiClsRe = /class="([^"]+)"/g, uiCls = [], uiCM;
while ((uiCM = uiClsRe.exec(uiHtml)) !== null) {
  uiCM[1].split(/\s+/).forEach(function (c) { if (c && uiCls.indexOf(c) < 0) uiCls.push(c); });
}
var uiOhneCss = [];
for (uiI = 0; uiI < uiCls.length; uiI++) {
  if (uiCss.indexOf('.' + uiCls[uiI]) < 0) uiOhneCss.push(uiCls[uiI]);
}
eq(uiOhneCss.length, 0, 'jede in der HTML benutzte Klasse ist in style.css angelegt (' + uiOhneCss.join(',') + ')');

/* ========================================================================= */
sek('S30 · N5b Eingabeseite — Zuordnung, Beschriftungen, Laien-ⓘ, Filterregel');

var Ui2 = require('./ui.js');
var Opt2 = require('./optionen.js');
var Val2 = require('./validate.js');
var uiSrc2 = fsU.readFileSync(__dirname + '/ui.js', 'utf8');

/* --- ui.js bleibt auch nach N5b fachlogikfrei -------------------------- */
var s30Verboten = ['DTNNaht', 'DTNProfil', 'DTNData'];
var s30Treffer = [];
for (var s30i = 0; s30i < s30Verboten.length; s30i++) {
  if (uiSrc2.indexOf(s30Verboten[s30i]) >= 0) s30Treffer.push(s30Verboten[s30i]);
}
eq(s30Treffer.length, 0, 'N5b: ui.js ruft weiterhin KEIN Rechenmodul auf (' + s30Treffer.join(',') + ')');
ok(uiSrc2.indexOf('Math.') < 0, 'N5b: ui.js rechnet weiterhin nichts (kein Math.)');
ok(uiSrc2.indexOf('DTNOptions') > 0, 'N5b: das Formular kommt aus optionen.js — nicht aus einer zweiten Liste');
ok(uiSrc2.indexOf('DTNValidate') > 0, 'N5b: die Felder kommen aus validate.js — nicht aus einer zweiten Liste');
ok(uiSrc2.indexOf('DTNI18nHilfe') > 0, 'N5b: die Laien-ⓘ kommen aus i18n_hilfe.js');

/* --- KEINE Liste doppelt: jede Gruppe und jedes Feld genau einmal ------- */
var s30G = {}, s30F = {}, s30Doppelt = [], s30Unbekannt = [], s30j, s30q, s30b;
for (s30i = 0; s30i < Ui2.ZUORDNUNG.length; s30i++) {
  s30b = Ui2.ZUORDNUNG[s30i];
  for (s30q = 0; s30q < s30b.gruppen.length; s30q++) {
    s30j = s30b.gruppen[s30q];
    if (s30G[s30j]) s30Doppelt.push('Gruppe ' + s30j);
    s30G[s30j] = s30b.code;
    if (!Opt2.gruppe(s30j)) s30Unbekannt.push('Gruppe ' + s30j);
  }
  for (s30q = 0; s30q < s30b.felder.length; s30q++) {
    s30j = s30b.felder[s30q];
    if (s30F[s30j]) s30Doppelt.push('Feld ' + s30j);
    s30F[s30j] = s30b.code;
    if (!Val2.feld(s30j)) s30Unbekannt.push('Feld ' + s30j);
  }
}
eq(s30Doppelt.length, 0, 'N5b: nichts ist zweimal zugeordnet (' + s30Doppelt.join(',') + ')');
eq(s30Unbekannt.length, 0, 'N5b: kein erfundener Code in der Zuordnung (' + s30Unbekannt.join(',') + ')');

var s30FehltG = [], s30FehltF = [];
for (s30i = 0; s30i < Opt2.GRUPPEN.length; s30i++) {
  if (!s30G[Opt2.GRUPPEN[s30i].code]) s30FehltG.push(Opt2.GRUPPEN[s30i].code);
}
for (s30i = 0; s30i < Val2.SCHEMA.length; s30i++) {
  if (!s30F[Val2.SCHEMA[s30i].code]) s30FehltF.push(Val2.SCHEMA[s30i].code);
}
eq(s30FehltG.length, 0, 'N5b: ALLE ' + Opt2.GRUPPEN.length + ' Auswahlgruppen haben einen Platz (' + s30FehltG.join(',') + ')');
eq(s30FehltF.length, 0, 'N5b: ALLE ' + Val2.SCHEMA.length + ' Felder haben einen Platz (' + s30FehltF.join(',') + ')');

/* Jeder Bereich der Zuordnung ist ein echter Aufklappbereich aus N5a. */
var s30Fremd = [];
for (s30i = 0; s30i < Ui2.ZUORDNUNG.length; s30i++) {
  if (Ui2.BEREICHE.indexOf(Ui2.ZUORDNUNG[s30i].code) < 0) s30Fremd.push(Ui2.ZUORDNUNG[s30i].code);
}
eq(s30Fremd.length, 0, 'N5b: die Zuordnung nutzt nur die acht Bereiche aus N5a (' + s30Fremd.join(',') + ')');
eq(Ui2.ZUORDNUNG.length, Ui2.BEREICHE.length, 'N5b: jeder der acht Bereiche kommt in der Zuordnung vor');

/* --- Der Block Ausfuehrung: in N5b datiert, seit N5d gebaut ------------ */
eq(s30G.iso5817, 'ausfuehrung', 'N5b: ISO 5817 ist dem Block Ausfuehrung zugeordnet');
eq(s30G.exc, 'ausfuehrung', 'N5b: EXC ist dem Block Ausfuehrung zugeordnet');
var s30Aus = null;
for (s30i = 0; s30i < Ui2.ZUORDNUNG.length; s30i++) {
  if (Ui2.ZUORDNUNG[s30i].code === 'ausfuehrung') s30Aus = Ui2.ZUORDNUNG[s30i];
}
ok(!s30Aus.etappe, 'N5d: der Block Ausfuehrung ist nicht mehr datiert — er wird gebaut');
ok(!!s30Aus.anforderung, 'N5d: seine Auswahlen laufen als Anforderungszeile in die Ausgaben');

var s30Gebaut = 0;
for (s30i = 0; s30i < Ui2.ZUORDNUNG.length; s30i++) {
  if (!Ui2.ZUORDNUNG[s30i].etappe) s30Gebaut += Ui2.ZUORDNUNG[s30i].gruppen.length;
}
eq(s30Gebaut, 25, 'N6b: alle 25 Gruppen werden gebaut — keine ist datiert (ist ' + s30Gebaut + ')');

/* --- Zusatzbereiche stimmen mit optionen.js ueberein -------------------- */
var s30Zus = [], s30ZusOpt = [];
for (s30i = 0; s30i < Ui2.ZUSATZ.length; s30i++) s30Zus.push(Ui2.ZUSATZ[s30i].code);
for (s30i = 0; s30i < Opt2.ZUSATZBEREICHE.length; s30i++) {
  if (Opt2.ZUSATZBEREICHE[s30i].code !== 'ausfuehrung') s30ZusOpt.push(Opt2.ZUSATZBEREICHE[s30i].code);
}
eq(s30Zus.sort().join(','), s30ZusOpt.sort().join(','),
   'N5b: die vier Freischalt-Haken sind genau die Zusatzbereiche aus optionen.js');
var s30ZusAus = 0;
for (s30i = 0; s30i < Opt2.ZUSATZBEREICHE.length; s30i++) {
  if (Opt2.ZUSATZBEREICHE[s30i].standard === false) s30ZusAus++;
}
eq(s30ZusAus, Opt2.ZUSATZBEREICHE.length, 'N5b: jeder Zusatzbereich ist standardmaessig AUS (Plan 2.6)');

/* --- Beschriftungen: jede Gruppe, jede Option, jedes Feld, jede Einheit - */
var s30OhneText = [];
for (s30i = 0; s30i < Opt2.GRUPPEN.length; s30i++) {
  var s30gr = Opt2.GRUPPEN[s30i];
  ['de', 'en', 'pt'].forEach(function (l) {
    if (!Kern.t('grp_' + s30gr.code, l)) s30OhneText.push('grp_' + s30gr.code + '/' + l);
  });
  for (s30q = 0; s30q < s30gr.optionen.length; s30q++) {
    (function (oc) {
      ['de', 'en', 'pt'].forEach(function (l) {
        if (!Kern.t('opt_' + s30gr.code + '_' + oc, l)) s30OhneText.push('opt_' + s30gr.code + '_' + oc + '/' + l);
      });
    }(s30gr.optionen[s30q].code));
  }
}
var s30Einheiten = {};
for (s30i = 0; s30i < Val2.SCHEMA.length; s30i++) {
  (function (f) {
    ['de', 'en', 'pt'].forEach(function (l) {
      if (!Kern.t(f.label || ('fld_' + f.code), l)) s30OhneText.push(f.code + '/' + l);
      if (f.einheit && !Kern.t(f.einheit, l)) s30OhneText.push(f.einheit + '/' + l);
    });
    if (f.einheit) s30Einheiten[f.einheit] = 1;
  }(Val2.SCHEMA[s30i]));
}
eq(s30OhneText.length, 0, 'N5b: jede Gruppe, Option, Feldbeschriftung und Einheit ist in DE/EN/PT belegt (' +
   s30OhneText.slice(0, 6).join(',') + ')');
ok(Object.keys(s30Einheiten).length >= 4, 'N5b: die Felder fuehren ihre Einheiten mit (' +
   Object.keys(s30Einheiten).join(', ') + ')');

/* --- Laien-ⓘ an JEDEM Feld und JEDER Gruppe, dreisprachig, vollstaendig - */
var s30OhneHilfe = [];
function s30PruefeHilfe(key) {
  if (!Hilfe.has(key)) { s30OhneHilfe.push(key); return; }
  ['de', 'en', 'pt'].forEach(function (l) {
    if (!Hilfe.h(key, l, 'was')) s30OhneHilfe.push(key + '/' + l + '/was');
  });
}
for (s30i = 0; s30i < Opt2.GRUPPEN.length; s30i++) s30PruefeHilfe('grp_' + Opt2.GRUPPEN[s30i].code);
for (s30i = 0; s30i < Val2.SCHEMA.length; s30i++) s30PruefeHilfe('fld_' + Val2.SCHEMA[s30i].code);
eq(s30OhneHilfe.length, 0, 'N5b: Laien-ⓘ an allen ' + Opt2.GRUPPEN.length + ' Gruppen und ' +
   Val2.SCHEMA.length + ' Feldern, dreisprachig (' + s30OhneHilfe.slice(0, 6).join(',') + ')');

/* --- Jeder Textschluessel, den ui.js nennt, existiert auch -------------- */
var s30KeyRe = /'(ui[A-Za-z0-9_]+|sec_[a-z_]+|zb_[a-z]+|grp_|opt_|fld_)'/g, s30M, s30Keys = [];
while ((s30M = s30KeyRe.exec(uiSrc2)) !== null) {
  if (/_$/.test(s30M[1])) continue;                 /* zusammengesetzte Praefixe */
  if (s30Keys.indexOf(s30M[1]) < 0) s30Keys.push(s30M[1]);
}
var s30KeyFehlt = [];
for (s30i = 0; s30i < s30Keys.length; s30i++) {
  ['de', 'en', 'pt'].forEach(function (l) {
    if (!Kern.t(s30Keys[s30i], l)) s30KeyFehlt.push(s30Keys[s30i] + '/' + l);
  });
}
ok(s30Keys.length >= 20, 'N5b: ui.js nennt ' + s30Keys.length + ' feste Textschluessel');
eq(s30KeyFehlt.length, 0, 'N5b: jeder davon ist in DE/EN/PT belegt (' + s30KeyFehlt.slice(0, 6).join(',') + ')');
var s30ZusText = [];
for (s30i = 0; s30i < Ui2.ZUSATZ.length; s30i++) {
  ['de', 'en', 'pt'].forEach(function (l) {
    if (!Kern.t(Ui2.ZUSATZ[s30i].label, l)) s30ZusText.push(Ui2.ZUSATZ[s30i].label + '/' + l);
    if (!Kern.t(Ui2.ZUSATZ[s30i].folgt, l)) s30ZusText.push(Ui2.ZUSATZ[s30i].folgt + '/' + l);
  });
}
eq(s30ZusText.length, 0, 'N5b: die Zusatzbereiche sind dreisprachig beschriftet (' + s30ZusText.join(',') + ')');

/* --- Pflicht-Ids: alles Anklickbare steht in BEIDEN HTMLs -------------- */
var s30HtmlV = fsU.readFileSync(__dirname + '/DT-ProfiSchweissnaht.html', 'utf8');
var s30HtmlT = fsU.readFileSync(__dirname + '/DT-ProfiSchweissnaht_Test.html', 'utf8');
var s30IdFehlt = [];
for (s30i = 0; s30i < Ui2.IDS.length; s30i++) {
  if (s30HtmlV.indexOf('id="' + Ui2.IDS[s30i] + '"') < 0) s30IdFehlt.push('voll:' + Ui2.IDS[s30i]);
  if (s30HtmlT.indexOf('id="' + Ui2.IDS[s30i] + '"') < 0) s30IdFehlt.push('test:' + Ui2.IDS[s30i]);
}
eq(s30IdFehlt.length, 0, 'N5b: alle ' + Ui2.IDS.length + ' Pflicht-Ids stehen in beiden HTMLs (' + s30IdFehlt.join(',') + ')');
for (s30i = 0; s30i < Ui2.BEREICHE.length; s30i++) {
  ok(s30HtmlV.indexOf('id="host_' + Ui2.BEREICHE[s30i] + '"') > 0,
     'N5b: der Bereich hat seinen Anker in der HTML: ' + Ui2.BEREICHE[s30i]);
}
var s30IdDoppelt = [];
for (s30i = 0; s30i < Ui2.IDS.length; s30i++) {
  var s30Anz = (s30HtmlV.match(new RegExp('id="' + Ui2.IDS[s30i] + '"', 'g')) || []).length;
  if (s30Anz !== 1) s30IdDoppelt.push(Ui2.IDS[s30i] + '(' + s30Anz + 'x)');
}
eq(s30IdDoppelt.length, 0, 'N5b: keine Id kommt in der HTML doppelt vor (' + s30IdDoppelt.join(',') + ')');

/* "Berechnen" ist ab N5b verdrahtet und darf nicht mehr als Geruest gelten. */
var s30Geruest = [];
for (s30i = 0; s30i < Ui2.GERUEST_BUTTONS.length; s30i++) s30Geruest.push(Ui2.GERUEST_BUTTONS[s30i][0]);
ok(s30Geruest.indexOf('calcBtn') < 0, 'N5b: "Berechnen" gilt nicht mehr als unverdrahteter Knopf');
ok(s30Geruest.indexOf('assistBtn') >= 0, 'N5b: der Assistent verweist weiterhin ehrlich auf N8');

/* --- DIE Filterregel: mild beim Anzeigen, streng beim Bereinigen -------
   Das ist die Regel aus dem N1-Log, und sie ist der Grund, warum ui.js eine
   weggeraeumte Auswahl zurueckholt, wenn ihr Bezugswert noch offen ist.
   Faellt dieser Unterschied weg, ist die Rueckholung sinnlos — deshalb wird
   er hier festgenagelt. */
var s30Mild = Opt2.codes('nahtart', {});
ok(s30Mild.indexOf('kehl_umlaufend') >= 0,
   'N5b: ohne gewaehlte Stossart wird die umlaufende Kehlnaht ANGEBOTEN (milde Regel)');
var s30Streng = Opt2.bereinige({ nahtart: 'kehl_umlaufend' });
ok(typeof s30Streng.nahtart === 'undefined',
   'N5b: die strenge Bereinigung wuerde sie entfernen — genau das faengt ui.js ab');
var s30Weg = Opt2.bereinige({ welt: 'B', werkstoffgruppe: 'alu', werkstoff: 'AW5083' });
ok(typeof s30Weg.werkstoffgruppe === 'undefined' && typeof s30Weg.werkstoff === 'undefined',
   'N5b: eine wirklich unpassende Auswahl faellt weg und wird NICHT zurueckgeholt');
ok(Opt2.codes('werkstoffgruppe', { welt: 'B' }).indexOf('alu') < 0,
   'N5b: dass sie unpassend ist, sagt schon die milde Regel — die Unterscheidung traegt');

/* --- Sichtbarkeitsregel: kein Pflichtfeld ohne Platz in dieser Etappe --- */
var s30Spaet = [];
for (s30i = 0; s30i < Val2.SCHEMA.length; s30i++) {
  var s30f = Val2.SCHEMA[s30i];
  var s30bz = null;
  for (s30q = 0; s30q < Ui2.ZUORDNUNG.length; s30q++) {
    if (Ui2.ZUORDNUNG[s30q].felder.indexOf(s30f.code) >= 0) s30bz = Ui2.ZUORDNUNG[s30q];
  }
  if (s30bz && s30bz.etappe) s30Spaet.push(s30f.code);
}
eq(s30Spaet.length, 0, 'N5b: kein Eingabefeld ist auf eine spaetere Etappe geschoben (' + s30Spaet.join(',') + ')');

/* --- Vollstaendiger Fall: der Auswahlweg fuehrt wirklich ans Ziel ------- */
var s30Fall = { welt: 'A', rechenrichtung: 'nachweis', werkstoffgruppe: 'stahl',
                werkstoff: 'S235', stossart: 'ueberlappstoss', nahtart: 'kehl_doppel',
                nachweisverfahren: 'richtungsbezogen', profil: 'blech',
                kanten: 'flanken', lasteingabe: 'direkt' };
var s30Sauber = Opt2.bereinige(s30Fall);
var s30Pr = Opt2.pruefe(s30Sauber);
ok(s30Pr.ok, 'N5b: der Beispielweg ist vollstaendig (fehlend: ' + (s30Pr.fehlend.join(',') || 'nichts') + ')');
var s30Werte = { l: '200', t1: '10', t2: '10', b: '80', a: '5', N: '150000', Q: '0', gammaM2: '1.25' };
var s30Erg = Val2.pruefe(s30Werte, s30Sauber);
ok(s30Erg.ok, 'N5b: und die Eingaben dazu gehen sauber durch beide Pruefstufen');
var s30Fehl = Val2.pruefe({ l: '200', t1: '0.1', t2: '10', b: '80', a: '5', N: '150000', Q: '0' }, s30Sauber);
ok(!s30Fehl.ok && s30Fehl.fehler.length > 0,
   'N5b: eine unmoegliche Blechdicke wird ehrlich gemeldet statt still gerechnet');
var s30MitFeld = 0;
for (s30i = 0; s30i < s30Fehl.fehler.length; s30i++) if (s30Fehl.fehler[s30i].feld) s30MitFeld++;
eq(s30MitFeld, s30Fehl.fehler.length, 'N5b: jede Fehlermeldung nennt ihr Feld — sonst waere sie nicht markierbar');

/* ========================================================================= */
sek('S31 · N5c-1 Beispiele — vollstaendig, rechenbar und nachgerechnet');

/* Die drei Beispiele stehen als DATEN in optionen.js (nicht in ui.js — dort
   duerfte weder ein Werkstoff noch ein Profil stehen, Plan 4.10). Geprueft
   wird dreierlei: die Struktur, die Vollstaendigkeit des Auswahlwegs und —
   am wichtigsten — dass die versprochenen Zahlen wirklich herauskommen.
   Ein Beispiel, das warnt oder nicht traegt, waere als Einstieg wertlos. */

var S31_MASSE = ['b', 'h', 'd', 'tw', 'tf', 't1', 'r_ecke'];
var S31_SOLL = {
  rhs:     { n_seg: 4, l: 328, eta: 0.359 },
  traeger: { n_seg: 2, l: 324, eta: 0.626 },
  blech:   { n_seg: 2, l: 140, eta: 0.842 }
};

eq(Options.BEISPIELE.length, 3, 'N5c-1: es gibt genau drei Beispiele');
ok(typeof Options.beispiel === 'function', 'N5c-1: und einen benannten Zugriff darauf');
ok(Options.beispiel('gibtesnicht') === null,
   'N5c-1: ein unbekanntes Beispiel liefert null, keinen Notbehelf');

var s31i, s31j;
for (s31i = 0; s31i < Options.BEISPIELE.length; s31i++) {
  (function (bsp) {
    var wo = 'N5c-1 [' + bsp.code + ']: ';
    var k;

    /* --- Struktur: kein erfundener Code darf sich einschleichen --------- */
    var unbekannt = [];
    for (var g in bsp.auswahl) {
      if (!Object.prototype.hasOwnProperty.call(bsp.auswahl, g)) continue;
      var gr = Options.gruppe(g);
      if (!gr) { unbekannt.push(g); continue; }
      var da = false;
      for (var o = 0; o < gr.optionen.length; o++) if (gr.optionen[o].code === bsp.auswahl[g]) da = true;
      if (!da) unbekannt.push(g + '=' + bsp.auswahl[g]);
    }
    eq(unbekannt.length, 0, wo + 'jede Auswahl gibt es wirklich in optionen.js (' + unbekannt.join(',') + ')');

    var fehltFeld = [];
    for (var fk in bsp.felder) {
      if (!Object.prototype.hasOwnProperty.call(bsp.felder, fk)) continue;
      if (!Valid.feld(fk)) fehltFeld.push(fk);
    }
    eq(fehltFeld.length, 0, wo + 'jedes Feld gibt es im Schema (' + fehltFeld.join(',') + ')');

    /* --- Der Auswahlweg ist vollstaendig, ohne Rest -------------------- */
    var pa = Options.pruefe(bsp.auswahl);
    ok(pa.ok, wo + 'der Auswahlweg ist vollstaendig (fehlend: ' + (pa.fehlend.join(',') || 'nichts') + ')');

    /* --- Beispiel + Standardvorbelegung = pruefbarer Eingabesatz ------- */
    var werte = Valid.standardwerte(bsp.auswahl);
    for (k in bsp.felder) if (Object.prototype.hasOwnProperty.call(bsp.felder, k)) werte[k] = bsp.felder[k];
    var pv = Valid.pruefe(werte, bsp.auswahl);
    ok(pv.ok, wo + 'mit den vorbelegten Standardwerten besteht es beide Pruefstufen' +
       (pv.ok ? '' : ' — offen: ' + JSON.stringify(pv.fehler)));

    /* --- Und jetzt das Entscheidende: die versprochenen Zahlen --------- */
    var pe = { profil: bsp.auswahl.profil, kanten: bsp.auswahl.kanten, a: bsp.felder.a };
    for (var m = 0; m < S31_MASSE.length; m++) {
      if (typeof bsp.felder[S31_MASSE[m]] === 'number') pe[S31_MASSE[m]] = bsp.felder[S31_MASSE[m]];
    }
    var ein = { profil_eingabe: pe };
    for (k in bsp.auswahl) if (Object.prototype.hasOwnProperty.call(bsp.auswahl, k)) ein[k] = bsp.auswahl[k];
    for (k in werte) if (Object.prototype.hasOwnProperty.call(werte, k) && S31_MASSE.indexOf(k) < 0) ein[k] = werte[k];

    var erg = Solver.rechne(ein);
    var soll = S31_SOLL[bsp.code];
    ok(erg.ok, wo + 'die Rechenkette laeuft durch');
    eq(erg.nahtbild.n_seg, soll.n_seg, wo + 'Zahl der Nahtabschnitte');
    ok(Math.abs(erg.nahtbild.l_ges - soll.l) < 0.05, wo + 'Nahtlaenge ' + soll.l + ' mm (ist ' +
       (Math.round(erg.nahtbild.l_ges * 100) / 100) + ')');
    ok(Math.abs(erg.eta - soll.eta) < 0.0005, wo + 'Ausnutzung ' + soll.eta + ' (ist ' +
       (Math.round(erg.eta * 1000) / 1000) + ')');
    ok(erg.erfuellt === true && erg.ampel === 'gruen', wo + 'der Nachweis ist erfuellt, die Ampel gruen');
    eq(erg.warnungen.length, 0, wo + 'und es steht KEINE Warnung daneben — ein Beispiel muss sauber sein');
  }(Options.BEISPIELE[s31i]));
}

/* Die Ausnutzung ist bewusst gestaffelt: wer die drei durchklickt, sieht
   einmal reichlich Reserve und einmal, wie es eng wird. */
ok(S31_SOLL.rhs.eta < S31_SOLL.traeger.eta && S31_SOLL.traeger.eta < S31_SOLL.blech.eta,
   'N5c-1: die drei Beispiele sind in der Ausnutzung gestaffelt');

/* Dreisprachigkeit der Beispielnamen — sonst stuende die Liste auf EN leer. */
var s31Fehlt = [];
for (s31i = 0; s31i < Options.BEISPIELE.length; s31i++) {
  var s31nm = Options.BEISPIELE[s31i].name;
  for (s31j = 0; s31j < 3; s31j++) {
    var s31lg = ['de', 'en', 'pt'][s31j];
    var s31t = Kern.t(s31nm, s31lg);
    if (!s31t || /^\[/.test(s31t)) s31Fehlt.push(s31nm + '/' + s31lg);
  }
}
eq(s31Fehlt.length, 0, 'N5c-1: jeder Beispielname ist dreisprachig belegt (' + s31Fehlt.join(',') + ')');

/* ========================================================================= */
sek('S32 · N5c-2 Rechenweg und Nahtbild — vollstaendig, dreisprachig, getrennte Haken');

/* N5c-2 zeigt an, was N5c-1 gerechnet hat. Geprueft wird deshalb nicht das
   Rechnen (das steht in S26-S28), sondern die Vollstaendigkeit und
   Uebersetzbarkeit der Darstellung — und die Trennung der zwei Haekchenarten
   nach Plan 4.9, die inhaltlich das Wichtigste an dieser Etappe ist. */

var S32_SPR = ['de', 'en', 'pt'];
var s32i, s32j, s32k;

for (s32i = 0; s32i < Options.BEISPIELE.length; s32i++) {
  (function (bsp) {
    var wo = 'N5c-2 [' + bsp.code + ']: ';
    var w = Valid.standardwerte(bsp.auswahl), k;
    for (k in bsp.felder) if (Object.prototype.hasOwnProperty.call(bsp.felder, k)) w[k] = bsp.felder[k];
    var ein = Valid.rechenEingabe(w, bsp.auswahl).eingabe;
    var erg = Solver.rechne(ein);
    var roh = Weg.ausErgebnis(erg, ein);

    ok(roh.ok === true, wo + 'der Rechenweg entsteht');
    eq(roh.abschnitte.length, 10, wo + 'er hat zehn Abschnitte');

    /* --- Die zwei Haekchenarten sind zwei verschiedene Dinge ------------ */
    ok(roh.n_haken > 0, wo + 'es gibt Rechenproben (' + roh.n_haken + ')');
    ok(roh.n_nachweise > 0, wo + 'und davon getrennt Nachweise (' + roh.n_nachweise + ')');
    ok(roh.n_haken_ok === roh.n_haken,
       wo + 'ALLE Rechenproben gehen auf — sonst rechnet das Programm falsch');
    ok(roh.selbstpruefung_ok === true, wo + 'und die Selbstpruefung sagt das auch');

    /* Die Summenzeile zaehlt sich selbst nicht mit (so gebaut in
       rechenweg.js). Genau ein Schritt mehr traegt einen Haken, als
       gezaehlt werden — festgehalten, damit die Anzeige nicht eines Tages
       still danebenliegt. */
    var mitHaken = 0, mitNw = 0;
    for (s32j = 0; s32j < roh.schritte.length; s32j++) {
      if (roh.schritte[s32j].haken !== null && typeof roh.schritte[s32j].haken !== 'undefined') mitHaken++;
      if (roh.schritte[s32j].erfuellt !== null && typeof roh.schritte[s32j].erfuellt !== 'undefined') mitNw++;
    }
    eq(mitHaken, roh.n_haken + 1, wo + 'angezeigte Haken = gezaehlte Proben + Summenzeile');
    eq(mitNw, roh.n_nachweise, wo + 'angezeigte Nachweise = gezaehlte Nachweise');

    /* --- Liste 2.4: die ehrlichen Luecken ------------------------------ */
    ok(roh.nicht_geprueft.length > 0,
       wo + 'es wird benannt, was bewusst NICHT geprueft wurde (' + roh.nicht_geprueft.length + ')');

    /* --- Dreisprachig, ohne Platzhalter --------------------------------- */
    for (s32j = 0; s32j < S32_SPR.length; s32j++) {
      (function (lg) {
        var r = Weg.rendere(roh, lg);
        var offen = [];
        for (var a = 0; a < r.abschnitte.length; a++) {
          if (/^\[/.test(r.abschnitte[a].titel || '')) offen.push(r.abschnitte[a].code);
          for (var t = 0; t < r.abschnitte[a].schritte.length; t++) {
            var s = r.abschnitte[a].schritte[t];
            if (/^\[/.test(s.titel || '')) offen.push(s.titel);
            if (/^\[/.test(s.quelle || '')) offen.push(s.quelle);
          }
        }
        eq(offen.length, 0, wo + lg + ': kein unuebersetzter Platzhalter (' + offen.slice(0, 3).join(',') + ')');
      }(S32_SPR[s32j]));
    }

    /* --- Nahtbild-Grafik ------------------------------------------------ */
    var bild = Bild.ausProfil(ein.profil_eingabe, { sprache: 'de' });
    ok(bild.ok === true, wo + 'das Nahtbild wird gezeichnet');
    ok(typeof bild.svg === 'string' && bild.svg.indexOf('<svg') >= 0, wo + 'und ist wirklich ein SVG');
    eq(bild.n_seg, erg.nahtbild.n_seg, wo + 'es zeigt so viele Abschnitte, wie gerechnet wurden');
    ok(bild.legende.length > 0, wo + 'mit Legende');

    var legOffen = [];
    for (s32k = 0; s32k < bild.legende.length; s32k++) {
      for (var lj = 0; lj < S32_SPR.length; lj++) {
        var lt = Kern.t(bild.legende[s32k].code, S32_SPR[lj]);
        if (!lt || /^\[/.test(lt)) legOffen.push(bild.legende[s32k].code + '/' + S32_SPR[lj]);
      }
    }
    eq(legOffen.length, 0, wo + 'jeder Legendeneintrag ist dreisprachig belegt (' + legOffen.join(',') + ')');
  }(Options.BEISPIELE[s32i]));
}

/* --- Das Zahlformat kommt aus EINER Quelle (Plan 3.4) ------------------- */
ok(Weg.zahl(1234.5678, 2, 'de') === '1.234,57', 'N5c-2: DE-Zahlformat mit Komma und Tausenderpunkt');
ok(Weg.zahl(1234.5678, 2, 'en') === '1,234.57', 'N5c-2: EN-Zahlformat mit Punkt');
ok(Weg.zahl(1234.5678, 2, 'pt') === Weg.zahl(1234.5678, 2, 'de'), 'N5c-2: PT rechnet wie DE mit Komma');

/* --- ui.js formatiert NICHT mehr selbst -------------------------------- */
var s32Ui = fsU.readFileSync('ui.js', 'utf8');
ok(s32Ui.indexOf('Rw.zahl') > 0 || s32Ui.indexOf('.zahl(') > 0,
   'N5c-2: ui.js holt das Zahlformat beim Rechenweg — die Notloesung aus N5c-1 ist abgeloest');
ok(s32Ui.indexOf('rw-haken') > 0 && s32Ui.indexOf('rw-nachweis') > 0,
   'N5c-2: ui.js kennt beide Haekchenklassen und haelt sie auseinander');

/* ========================================================================= */
sek('S33 · N5c-3 Nahtzug statt Segment — Laengenpruefung auf der richtigen Ebene');

/* DER FEHLER, den diese Sektion festnagelt (Plan 5.1-0, gefunden 2026-07-28):
   Die Pruefung l >= max(6a; 30 mm) lief JE SEGMENT. Bei I- und U-Profilen ist
   die Flanschkante aber nur t_f lang, und t_f erreicht bei keinem Normprofil
   30 mm. Folge: jedes umlaufend geschweisste I- und U-Profil fiel durch,
   unabhaengig von den Massen — um zu bestehen, haette der Flansch dicker als
   30 mm sein muessen. Jetzt laeuft die Pruefung je durchlaufendem NAHTZUG.
   Die Masse unten sind die aus dem Plan (I 200x200 = HEB-200-Geometrie). */

function s33Rechne(pe, extra) {
  var ein = { welt: 'A', rechenrichtung: 'nachweis', nachweisverfahren: 'richtungsbezogen',
              werkstoffgruppe: 'stahl', werkstoff: 'S235', nahtart: 'kehl_doppel',
              profil_eingabe: pe, N: 50000, gammaM2: 1.25 }, k;
  for (k in (extra || {})) if (Object.prototype.hasOwnProperty.call(extra, k)) ein[k] = extra[k];
  var erg = Solver.rechne(ein);
  return { ein: ein, erg: erg, rw: erg.ok ? Weg.ausErgebnis(erg, ein) : null };
}
function s33Kurz(erg) { return svHat(erg.warnungen, 'msg_sv_l_eff_zu_kurz'); }

var S33_FAELLE = [
  { name: 'I-Profil 200x200 rundum a4',
    pe: { profil: 'i_profil', kanten: 'rundum', b: 200, h: 200, tw: 9, tf: 15, a: 4 },
    n_seg: 12, zuege: 1, l: 1182 },
  { name: 'U-Profil 80x160 rundum a4',
    pe: { profil: 'u_profil', kanten: 'rundum', b: 80, h: 160, tw: 7, tf: 10, a: 4 },
    n_seg: 8, zuege: 1, l: 626 },
  { name: 'U-Profil 100x200 rundum a5',
    pe: { profil: 'u_profil', kanten: 'rundum', b: 100, h: 200, tw: 9, tf: 14, a: 5 },
    n_seg: 8, zuege: 1, l: 782 }
];

var s33i, s33f, s33r;
for (s33i = 0; s33i < S33_FAELLE.length; s33i++) {
  s33f = S33_FAELLE[s33i];
  s33r = s33Rechne(s33f.pe);
  ok(s33r.erg.ok, 'N5c-3 [' + s33f.name + ']: rechnet ueberhaupt durch');
  eq(s33r.erg.nahtbild.n_seg, s33f.n_seg,
     'N5c-3 [' + s33f.name + ']: die Segmentzahl ist unveraendert');
  eq(Math.round(s33r.erg.nahtbild.l_ges), s33f.l,
     'N5c-3 [' + s33f.name + ']: die Nahtlaenge ist unveraendert');
  eq(s33r.erg.grenzen.n_zuege, s33f.zuege,
     'N5c-3 [' + s33f.name + ']: umlaufend geschweisst ist EIN Nahtzug, nicht ' + s33f.n_seg);
  ok(!s33Kurz(s33r.erg),
     'N5c-3 [' + s33f.name + ']: gilt nicht mehr als zu kurz — das war der Fehler');
  ok(s33r.erg.grenzen.je_zug[0].l >= s33r.erg.grenzen.je_zug[0].l_eff_min,
     'N5c-3 [' + s33f.name + ']: der Zug haelt seine Mindestlaenge (' +
     s33r.erg.grenzen.je_zug[0].l.toFixed(0) + ' >= ' +
     s33r.erg.grenzen.je_zug[0].l_eff_min.toFixed(0) + ' mm)');
  ok(s33r.rw.nachweis_ok === true,
     'N5c-3 [' + s33f.name + ']: und der Rechenweg meldet keinen falschen roten Nachweis');
  ok(s33r.erg.erfuellt === s33r.rw.nachweis_ok,
     'N5c-3 [' + s33f.name + ']: Ampel und Rechenweg sagen dasselbe');
}

/* --- DIE GEGENPROBE: die Regel darf nicht verlorengehen ----------------- */
var s33Geg = s33Rechne({ profil: 'blech', kanten: 'flanken', b: 35, t1: 20, a: 5 });
ok(s33Geg.erg.ok, 'N5c-3 Gegenprobe: Blech 35 mm, Flanken, a 5 rechnet durch');
eq(s33Geg.erg.grenzen.n_zuege, 2,
   'N5c-3 Gegenprobe: zwei getrennte Flankennaehte sind zwei Zuege');
ok(s33Kurz(s33Geg.erg),
   'N5c-3 Gegenprobe: die wirklich zu kurze Einzelnaht wird WEITERHIN gefangen');
ok(s33Geg.erg.grenzen.je_zug[0].l < s33Geg.erg.grenzen.je_zug[0].l_eff_min,
   'N5c-3 Gegenprobe: 35 mm minus 2 x 5 mm Endkrater = 25 mm < 30 mm');

var s33Eine = s33Rechne({ profil: 'blech', kanten: 'eine_flanke', b: 25, t1: 20, a: 4 });
ok(s33Kurz(s33Eine.erg),
   'N5c-3: auch eine einzelne freistehende Kurznaht bleibt gefangen');

/* --- Freier Segmentmodus: ohne Raupenangabe bleibt es streng ------------ */
var s33Frei = Solver.rechne(svEin({ N: 1000,
  segmente: [ Naht.linie(-50, -10, -50, 10, 5), Naht.linie(50, -10, 50, 10, 5) ] }));
eq(s33Frei.grenzen.n_zuege, 2,
   'N5c-3: ohne Raupenangabe ist jedes Segment ein eigener Zug (strengere Annahme)');
ok(s33Kurz(s33Frei),
   'N5c-3: und die Kurznahtwarnung des freien Modus bleibt unveraendert');

/* --- Der Endkraterabzug greift je Zug, nicht an jeder Ecke -------------- */
var s33Fl = Profil.baue({ profil: 'i_profil', kanten: 'flansche',
                          b: 200, h: 200, tw: 9, tf: 15, a: 4 });
ok(s33Fl.ok, 'N5c-3: I-Profil, nur Flansche geschweisst, baut sich');
eq(s33Fl.raupen, 2, 'N5c-3: das sind zwei offene Zuege');
eq(Math.round(s33Fl.endkrater_abzug), 2 * 2 * 4,
   'N5c-3: abgezogen wird 2a JE ZUG (2 x 8 mm) — nicht 2a an jeder Ecke');
var s33Ru = Profil.baue({ profil: 'i_profil', kanten: 'rundum',
                          b: 200, h: 200, tw: 9, tf: 15, a: 4 });
eq(s33Ru.endkrater_abzug, 0,
   'N5c-3: der umlaufende Zug hat kein freies Ende und damit keinen Abzug');

/* --- beta_Lw bleibt BEWUSST je Segment (benannte Entscheidung, Plan 9.2) - */
ok(!svHat(s33Rechne(S33_FAELLE[0].pe).erg.warnungen, 'msg_sv_lange_naht'),
   'N5c-3: der 1182-mm-Zug loest KEINE Langnaht-Abminderung aus — beta_Lw zielt ' +
   'auf lange Laschenanschluesse und bleibt deshalb je Segment');

/* --- Ampel und Rechenweg: der zweite Befund aus 5.1-0 ------------------- */
/* Vorher zeigte das Programm gleichzeitig gruene Ampel und "Nachweis nicht
   erfuellt". Die Laengenpruefung ist nach Dieters Entscheidung (2026-08-03)
   eine WARNUNG — sie traegt deshalb keinen Nachweis-Haken mehr. */
var s33Schritt = null, s33s;
for (s33s = 0; s33s < s33Geg.rw.schritte.length; s33s++) {
  if (s33Geg.rw.schritte[s33s].code === 'rw_s_l_eff') s33Schritt = s33Geg.rw.schritte[s33s];
}
ok(!!s33Schritt, 'N5c-3: der Laengenschritt steht weiterhin im Rechenweg');
ok(s33Schritt.erfuellt === null,
   'N5c-3: er traegt KEINEN Nachweis-Haken mehr — sonst kaeme der Widerspruch zurueck');
eq(s33Schritt.hinweis, 'msg_sv_l_eff_zu_kurz',
   'N5c-3: stattdessen traegt er den Warntext, der die Norm ausspricht');
ok(s33Geg.erg.erfuellt === s33Geg.rw.nachweis_ok,
   'N5c-3: auch im Warnfall sagen Ampel und Rechenweg dasselbe');

/* --- Die neuen Texte sind dreisprachig belegt --------------------------- */
var s33Codes = ['msg_sv_l_eff_zu_kurz', 'msg_sv_l_eff_je_zug'];
var s33c, s33Spr = ['de', 'en', 'pt'];
for (s33c = 0; s33c < s33Codes.length; s33c++) {
  ok(Solver.CODES.warnungen.concat(Solver.CODES.hinweise).indexOf(s33Codes[s33c]) >= 0,
     'N5c-3: ' + s33Codes[s33c] + ' steht im Codeverzeichnis des Solvers');
  for (s33s = 0; s33s < s33Spr.length; s33s++) {
    ok(!!Kern.t(s33Codes[s33c], s33Spr[s33s]),
       'N5c-3: ' + s33Codes[s33c] + ' ist in ' + s33Spr[s33s].toUpperCase() + ' belegt');
  }
}
ok(Kern.t('msg_sv_l_eff_zu_kurz', 'de').indexOf('4.5.1') > 0,
   'N5c-3: der Warntext nennt die Fundstelle EN 1993-1-8 §4.5.1(2)');
ok(svHat(s33Rechne(S33_FAELLE[0].pe).erg.hinweise, 'msg_sv_l_eff_je_zug'),
   'N5c-3: bei mehrsegmentigen Zuegen wird die Pruefebene ehrlich benannt');

/* --- "Nur Steg" bleibt, was es war -------------------------------------- */
var s33Trg = s33Rechne({ profil: 'i_profil', kanten: 'steg', b: 200, h: 200, tw: 9, tf: 15, a: 4 });
eq(s33Trg.erg.grenzen.n_zuege, 2,
   'N5c-3: "nur Steg" bleibt zwei getrennte Zuege — jeder fuer sich geprueft');
ok(!s33Kurz(s33Trg.erg), 'N5c-3: und beide bestehen ihre Mindestlaenge');

/* ========================================================================= */
sek('S34 · N5d Ausfuehrung und Dokumentation + Versionszeile');

var Ui34  = require('./ui.js');
var Opt34 = require('./optionen.js');
var ui34Src = fsU.readFileSync(__dirname + '/ui.js', 'utf8');

/* --- 1) Modulkennungen: die drei Loecher aus 3.6 sind zu ---------------- */
var s34Module = [
  ['daten', Data], ['optionen', Options], ['validate', Valid], ['naht', Naht],
  ['profil', Profil], ['svglib', Svg], ['schaubild', Bild], ['solver', Solver],
  ['rechenweg', Weg], ['ui', Ui34], ['symbol', require('./symbol.js')],
  ['i18n_kern', Kern], ['i18n_hilfe', Hilfe], ['i18n_kerbfall', Kerb]
];
eq(s34Module.length, 14, 'N6b: 14 Module gehoeren zum Programm — symbol.js ist dazugekommen');
var s34OhneVersion = [];
for (var s34i = 0; s34i < s34Module.length; s34i++) {
  var s34m = s34Module[s34i][1];
  if (!s34m || typeof s34m.VERSION !== 'string' || !s34m.VERSION) s34OhneVersion.push(s34Module[s34i][0]);
}
eq(s34OhneVersion.length, 0,
   'N6b: JEDES der 14 Module traegt eine VERSION — auch das neue' +
   (s34OhneVersion.length ? ' (offen: ' + s34OhneVersion.join(', ') + ')' : ''));
eq(Kern.VERSION, '0.1.0-N1', 'N5d: i18n_kern.js hat jetzt eine Kennung');
eq(Hilfe.VERSION, '0.1.0-N1', 'N5d: i18n_hilfe.js hat jetzt eine Kennung');
eq(Kerb.VERSION, '0.1.0-N1', 'N5d: i18n_kerbfall.js hat jetzt eine Kennung');
eq(Ui34.ETAPPE, 'N6b', 'N6b: ui.js nennt seinen Stand');
eq(Ui34.VERSION, '0.8.0', 'N6b: die ui-Kennung ist mitgewachsen');

/* --- DER FUND VOM 2026-08-04 -------------------------------------------
   Die Versionszeile liest die Module selbst aus — aber Etappe und
   Planversion sind von Hand gepflegt, und genau die blieben nach N6b auf
   N5d/2.32 stehen. Die Assertion darauf hatte den ALTEN Wert festgeschrieben
   und meldete gruen. Gefunden hat es Dieter am Handy.
   Ab jetzt prueft der Harness gegen die PLANDATEI selbst: die Zahl in ui.js
   muss die sein, die im Kopf von Schweissnaht-1.md steht. Damit kann sie
   nicht mehr unbemerkt zurueckbleiben. */
var s34PlanPfad = __dirname + '/Schweißnaht-1.md';
ok(fsU.existsSync(s34PlanPfad),
   'N6b: die Plandatei liegt neben dem Code — sonst ist der Abgleich nicht moeglich');
var s34PlanTxt = fsU.existsSync(s34PlanPfad) ? fsU.readFileSync(s34PlanPfad, 'utf8') : '';
var s34PlanNr = (s34PlanTxt.match(/Plan-Version\s*:\s*([0-9]+\.[0-9]+)/) || [])[1] || null;
ok(!!s34PlanNr, 'N6b: die Planversion ist aus dem Kopfblock lesbar');
eq(Ui34.PLAN, s34PlanNr,
   'N6b: die Planversion in ui.js ist DIESELBE wie im Kopf der Plandatei (ui: ' +
   Ui34.PLAN + ', Plan: ' + s34PlanNr + ')');

/* --- 2) EXC schlaegt die Bewertungsgruppe vor (5.1-1) ------------------- */
ok(Opt34.istVorschlagsZiel('iso5817'), 'N5d: die Bewertungsgruppe ist ein Vorschlagsziel');
ok(!Opt34.istVorschlagsZiel('exc'), 'N5d: die Ausfuehrungsklasse selbst wird nie vorgeschlagen');
ok(!Opt34.istVorschlagsZiel('werkstoff'), 'N5d: sonst schlaegt nichts etwas vor');
var s34Karte = [['EXC1', 'D'], ['EXC2', 'C'], ['EXC3', 'B'], ['EXC4', 'B']];
for (s34i = 0; s34i < s34Karte.length; s34i++) {
  var s34v = Opt34.vorschlag('iso5817', { exc: s34Karte[s34i][0] });
  ok(!!s34v, 'N5d: ' + s34Karte[s34i][0] + ' liefert einen Vorschlag');
  eq(s34v.wert, s34Karte[s34i][1],
     'N5d: ' + s34Karte[s34i][0] + ' schlaegt Bewertungsgruppe ' + s34Karte[s34i][1] + ' vor (EN 1090-2)');
  eq(s34v.norm, 'EN 1090-2', 'N5d: der Vorschlag nennt seine Herkunft');
  ok(Kern.has(s34v.hinweis), 'N5d: und traegt einen Text, der die Herkunft ausspricht');
}
eq(Opt34.vorschlag('iso5817', {}), null,
   'N5d: ohne Ausfuehrungsklasse wird nichts vorgeschlagen — kein stiller Wert');
eq(Opt34.vorschlag('iso5817', { exc: 'EXC9' }), null,
   'N5d: ein unbekannter Code erzeugt keinen erfundenen Vorschlag');
eq(Opt34.vorschlag('exc', { exc: 'EXC2' }), null, 'N5d: fuer die Quelle selbst gibt es keinen Vorschlag');
var s34Iso = Opt34.gruppe('iso5817'), s34Exc = Opt34.gruppe('exc');
ok(s34Iso.rechenwirksam === false && s34Exc.rechenwirksam === false,
   'N5d: beide Gruppen bleiben ausdruecklich NICHT rechenwirksam');
var s34IsoCodes = [];
for (s34i = 0; s34i < s34Iso.optionen.length; s34i++) s34IsoCodes.push(s34Iso.optionen[s34i].code);
for (s34i = 0; s34i < s34Karte.length; s34i++) {
  ok(s34IsoCodes.indexOf(s34Karte[s34i][1]) >= 0,
     'N5d: der Vorschlag ' + s34Karte[s34i][1] + ' zeigt auf eine wirklich vorhandene Option');
}
for (s34i = 0; s34i < s34Exc.optionen.length; s34i++) {
  ok(!!Opt34.vorschlag('iso5817', { exc: s34Exc.optionen[s34i].code }),
     'N5d: die Karte deckt ' + s34Exc.optionen[s34i].code + ' ab — keine Luecke');
}

/* --- 3) Das Fachwissen steht NICHT in der Oberflaeche ------------------- */
ok(ui34Src.indexOf('EXC') < 0,
   'N5d: die Karte EXC -> Bewertungsgruppe steht in optionen.js, nicht in ui.js');
var s34Nennungen = ui34Src.split('iso5817').length - 1;
eq(s34Nennungen, 1,
   'N5d: ui.js nennt den Gruppencode genau EINMAL — in der reinen Anordnung, nirgends in der Logik');
ok(ui34Src.indexOf('Options.vorschlag') > 0, 'N5d: es fragt die Optionsquelle');

/* --- 4) Der Block ist verdrahtet und sagt, was er nicht ist ------------- */
var s34Aus = null;
for (s34i = 0; s34i < Ui34.ZUORDNUNG.length; s34i++) {
  if (Ui34.ZUORDNUNG[s34i].code === 'ausfuehrung') s34Aus = Ui34.ZUORDNUNG[s34i];
}
ok(!!s34Aus, 'N5d: der Bereich Ausfuehrung steht in der Zuordnung');
eq(s34Aus.gruppen.length, 7,
   'N6b: der Block traegt jetzt sieben Auswahlen — zwei aus N5d, fuenf fuer das Symbol');
eq(s34Aus.hinweise.length, 2, 'N5d: und zwei Hinweiszeilen ohne Antippen');
eq(s34Aus.hinweise[0], 'ausf_nicht_rechenwirksam', 'N5d: die erste sagt ehrlich: nicht rechenwirksam');
eq(s34Aus.hinweise[1], 'ausf_erm_hinweis', 'N5d: die zweite nennt die Ermuedung — als Hinweis, nicht als Rechnung');
var s34Texte = ['ausf_nicht_rechenwirksam', 'ausf_erm_hinweis', 'ausf_vorschlag_aus_exc',
                'ausf_eigene_wahl', 'ausf_anforderung',
                'uiVersionStand', 'uiVersionPlan', 'uiVersionModule', 'uiVersionOhne'];
var s34Spr = ['de', 'en', 'pt'], s34j;
for (s34i = 0; s34i < s34Texte.length; s34i++) {
  ok(Kern.has(s34Texte[s34i]), 'N5d: Text ' + s34Texte[s34i] + ' ist angelegt');
  for (s34j = 0; s34j < s34Spr.length; s34j++) {
    ok(!!Kern.t(s34Texte[s34i], s34Spr[s34j]),
       'N5d: ' + s34Texte[s34i] + ' ist in ' + s34Spr[s34j].toUpperCase() + ' belegt');
  }
}
ok(Kern.t('ausf_erm_hinweis', 'de').indexOf('Hinweis') > 0,
   'N5d: der Ermuedungstext sagt selbst, dass er nur ein Hinweis ist');

/* --- 5) Die vier bewusst offenen Punkte sind BENANNT (2.4) -------------- */
var s34Luecken = ['pruefumfang_zfp', 'toleranzen', 'herstellerqualifikation'];
for (s34i = 0; s34i < s34Luecken.length; s34i++) {
  ok(Data.NICHT_GEPRUEFT.indexOf(s34Luecken[s34i]) >= 0,
     'N5d: ' + s34Luecken[s34i] + ' steht als benannte Luecke in der Liste 2.4');
  for (s34j = 0; s34j < s34Spr.length; s34j++) {
    ok(!!Kern.t('ng_' + s34Luecken[s34i], s34Spr[s34j]),
       'N5d: die Luecke ' + s34Luecken[s34i] + ' ist in ' + s34Spr[s34j].toUpperCase() + ' benannt');
  }
}
/* N6b: diese Luecke gibt es nicht mehr — sie wurde gefuellt. Geprueft wird
   jetzt, dass sie WIRKLICH raus ist und nicht nur unsichtbar wurde. */
ok(Data.NICHT_GEPRUEFT.indexOf('nahtvorbereitung') < 0 && Data.fugenformen().length === 16,
   'N6b: die Luecke Nahtvorbereitung ist raus UND die Tabelle steht — gefuellt, nicht versteckt');
ok(require('./symbol.js').KATALOG.length === 32,
   'N6b: dazu gehoert der Katalog, der die Fugenformen ueberhaupt erst zeigt');
ok(Data.nahtvorbereitung('stumpf_v').q.indexOf('ISO9692') >= 0,
   'N6b: und die Werte nennen die Norm, die sie regelt');
ok(Kern.t('ng_toleranzen', 'de').indexOf('13920') > 0,
   'N5d: die Luecke Toleranzen nennt EN ISO 13920');
/* Die Liste kommt durch den ganzen Rechenweg hindurch — ohne eine zweite Quelle. */
var s34Rw = Weg.ausErgebnis(Solver.rechne(svEin({ N: 200000 })), svEin({ N: 200000 }));
for (s34i = 0; s34i < s34Luecken.length; s34i++) {
  ok(s34Rw.nicht_geprueft.indexOf('ng_' + s34Luecken[s34i]) >= 0,
     'N5d: ' + s34Luecken[s34i] + ' erscheint im Rechenweg — eine Quelle, kein zweiter Weg');
}

/* --- 6) Die Versionszeile hat alles, was sie braucht -------------------- */
ok(ui34Src.indexOf('PLAN') > 0, 'N5d: die Planversion steht als einzige Handzahl in ui.js');
ok(Ui34.IDS.indexOf('infoVersion') >= 0, 'N5d: die Versionszeile hat eine Id');
ok(Ui34.IDS.indexOf('infoModule') >= 0, 'N5d: die Modulkennungen haben eine Id');
ok(Ui34.KLASSEN.indexOf('info-version') >= 0, 'N5d: und style.css traegt ihre Klasse');
ok(Ui34.KLASSEN.indexOf('info-module') >= 0, 'N5d: ebenso fuer die Modulzeile');

/* ========================================================================= */
sek('S35 · N6b Etappe 1 — Katalog ISO 2553 und Nahtvorbereitung ISO 9692-1');

var Sym = require('./symbol.js');

/* --- 1) Das Modul meldet sich ordentlich an ---------------------------- */
eq(Sym.NAME, 'symbol', 'N6b: symbol.js nennt seinen Namen');
ok(typeof Sym.VERSION === 'string' && Sym.VERSION.indexOf('N6b') > 0,
   'N6b: und traegt von Anfang an eine Kennung (3.6)');

/* --- 2) Der Katalog ist vollstaendig und in sich richtig ---------------- */
eq(Sym.KATALOG.length, 32, 'N6b: der volle Katalog hat 32 Eintraege');
eq(Sym.codes('grund').length, 23, 'N6b: davon 23 Grundsymbole');
eq(Sym.codes('zusatz').length, 6, 'N6b: 6 Zusatzzeichen');
eq(Sym.codes('lage').length, 3, 'N6b: 3 Angaben an der Pfeillinie');
eq(Sym.codes().length, 32, 'N6b: ohne Filter kommt alles');

var s35Gesehen = {}, s35Doppelt = [], s35i, s35j, s35e;
var s35Arten = { grund: 1, zusatz: 1, lage: 1 };
var s35Seiten = { pfeil: 1, gegen: 1, beide: 1 };
var s35FehlArt = [], s35FehlSeite = [], s35FehlMass = [], s35FehlQ = [];
for (s35i = 0; s35i < Sym.KATALOG.length; s35i++) {
  s35e = Sym.KATALOG[s35i];
  if (s35Gesehen[s35e.code]) s35Doppelt.push(s35e.code);
  s35Gesehen[s35e.code] = 1;
  if (!s35Arten[s35e.art]) s35FehlArt.push(s35e.code);
  if (s35e.art === 'grund') {
    if (!s35Seiten[s35e.seite]) s35FehlSeite.push(s35e.code);
  } else if (s35e.seite !== null) s35FehlSeite.push(s35e.code);
  for (s35j = 0; s35j < s35e.masse.length; s35j++) {
    if (Sym.MASSE.indexOf(s35e.masse[s35j]) < 0) s35FehlMass.push(s35e.code);
  }
  for (s35j = 0; s35j < s35e.q.length; s35j++) {
    if (!Data.QUELLEN[s35e.q[s35j]]) s35FehlQ.push(s35e.code + '/' + s35e.q[s35j]);
  }
}
eq(s35Doppelt.length, 0, 'N6b: kein Code kommt zweimal vor' + (s35Doppelt.length ? ' (' + s35Doppelt.join(', ') + ')' : ''));
eq(s35FehlArt.length, 0, 'N6b: jede Art ist grund, zusatz oder lage');
eq(s35FehlSeite.length, 0, 'N6b: nur Grundsymbole haben eine Seite, alle anderen keine');
eq(s35FehlMass.length, 0, 'N6b: keine Bemassung ausserhalb der acht bekannten Groessen');
eq(s35FehlQ.length, 0, 'N6b: jede Quellenkennung ist in QUELLEN hinterlegt' + (s35FehlQ.length ? ' (' + s35FehlQ.join(', ') + ')' : ''));

/* --- 3) Die Verweise zeigen ins Leere? Dann faellt es hier auf ---------- */
var s35BadFug = [], s35BadNaht = [];
var s35NahtCodes = [];
for (s35i = 0; s35i < Data.NAHTARTEN.length; s35i++) s35NahtCodes.push(Data.NAHTARTEN[s35i].code);
for (s35i = 0; s35i < Sym.KATALOG.length; s35i++) {
  s35e = Sym.KATALOG[s35i];
  if (s35e.vorbereitung && !Data.FUGENFORMEN[s35e.vorbereitung]) s35BadFug.push(s35e.code);
  if (s35e.naht && s35NahtCodes.indexOf(s35e.naht) < 0) s35BadNaht.push(s35e.code);
  for (s35j = 0; s35j < s35e.naht_auch.length; s35j++) {
    if (s35NahtCodes.indexOf(s35e.naht_auch[s35j]) < 0) s35BadNaht.push(s35e.code);
  }
}
eq(s35BadFug.length, 0, 'N6b: jeder Verweis auf eine Fugenform trifft eine vorhandene');
eq(s35BadNaht.length, 0, 'N6b: jeder Verweis auf eine Nahtart trifft eine vorhandene');

/* --- 4) DIE EHRLICHE BRUECKE: was rechenbar ist, ist auch zeichenbar ---- */
var s35OhneSymbol = [];
for (s35i = 0; s35i < s35NahtCodes.length; s35i++) {
  if (!Sym.fuerNahtart(s35NahtCodes[s35i])) s35OhneSymbol.push(s35NahtCodes[s35i]);
}
eq(s35OhneSymbol.length, 0,
   'N6b: JEDE der 12 rechenbaren Nahtarten hat ein Zeichnungssymbol' +
   (s35OhneSymbol.length ? ' (fehlt: ' + s35OhneSymbol.join(', ') + ')' : ''));
eq(Sym.fuerNahtart('kehl_flanke').code, 'kehlnaht',
   'N6b: Flankenkehlnaht traegt dasselbe Symbol wie die Kehlnaht');
eq(Sym.fuerNahtart('kehl_umlaufend').code, 'kehlnaht',
   'N6b: die umlaufende Kehlnaht ebenso — die Umlaufigkeit ist ein Zusatzzeichen');
eq(Sym.fuerNahtart('gibtsnicht'), null, 'N6b: eine unbekannte Nahtart erfindet kein Symbol');
eq(Sym.fuerNahtart(null), null, 'N6b: und nichts liefert nichts');

/* --- 5) UND DIE ANDERE RICHTUNG: was NICHT nachweisbar ist, wird BENANNT */
var s35Ohne = Sym.ohneNachweis();
eq(s35Ohne.length, 14,
   'N6b: 14 Grundsymbole sind zeichenbar, aber in diesem Programm nicht nachweisbar');
var s35Still = [];
for (s35i = 0; s35i < s35Ohne.length; s35i++) {
  if (Sym.eintrag(s35Ohne[s35i]).nachweisbar !== false) s35Still.push(s35Ohne[s35i]);
}
eq(s35Still.length, 0, 'N6b: jeder davon sagt es selbst — nachweisbar:false, kein stilles Symbol');
ok(s35Ohne.indexOf('punktnaht') >= 0 && s35Ohne.indexOf('u_naht') >= 0,
   'N6b: Punkt- und U-Naht stehen ausdruecklich in dieser Liste');
eq(Sym.eintrag('kehlnaht').nachweisbar, true, 'N6b: die Kehlnaht dagegen ist nachweisbar');
ok(Kern.has('sym_nicht_nachweisbar'),
   'N6b: und es gibt einen Text, der genau das ausspricht');

/* --- 6) Kopien statt Durchgriff ----------------------------------------- */
var s35K = Sym.eintrag('kehlnaht');
s35K.masse.push('probe'); s35K.naht_auch.push('probe');
eq(Sym.eintrag('kehlnaht').masse.length, 5, 'N6b: eintrag() gibt eine Kopie — von aussen nicht verbiegbar');
eq(Sym.eintrag('kehlnaht').naht_auch.length, 3, 'N6b: auch die Nahtartenliste ist eine Kopie');
eq(Sym.eintrag('gibtsnicht'), null, 'N6b: ein unbekannter Code liefert null');
ok(Sym.hatMass('kehlnaht', 'a') && !Sym.hatMass('kehlnaht', 's'),
   'N6b: die Kehlnaht kennt das a-Mass, aber keine Stumpfnahtdicke');
ok(Sym.hatMass('v_naht', 's') && !Sym.hatMass('v_naht', 'a'),
   'N6b: bei der V-Naht ist es umgekehrt');

/* --- 7) Nahtvorbereitung nach EN ISO 9692-1 ----------------------------- */
eq(Data.fugenformen().length, 16, 'N6b: 16 Fugenformen in der Tabelle');
ok(!!Data.QUELLEN.ISO9692, 'N6b: EN ISO 9692-1 ist als Quelle hinterlegt');
var s35VerfCodes = [];
for (s35i = 0; s35i < Data.VERFAHREN.length; s35i++) s35VerfCodes.push(Data.VERFAHREN[s35i].code);
var s35Fug = Data.fugenformen(), s35Bad = [], s35BadV = [], s35BadT = [], s35BadArt = [];
var s35Arten2 = { alpha: 1, beta: 1 };
for (s35i = 0; s35i < s35Fug.length; s35i++) {
  var s35N = Data.nahtvorbereitung(s35Fug[s35i]);
  ok(s35N.ok, 'N6b: Fugenform ' + s35Fug[s35i] + ' ist abrufbar');
  /* Der Richtwert muss IM Band liegen — sonst haette man zwei Wahrheiten. */
  if (s35N.winkel_band && (s35N.winkel < s35N.winkel_band[0] || s35N.winkel > s35N.winkel_band[1])) s35Bad.push(s35Fug[s35i] + '/winkel');
  if (s35N.spalt_band && (s35N.spalt < s35N.spalt_band[0] || s35N.spalt > s35N.spalt_band[1])) s35Bad.push(s35Fug[s35i] + '/spalt');
  if (s35N.steg_band && (s35N.steg < s35N.steg_band[0] || s35N.steg > s35N.steg_band[1])) s35Bad.push(s35Fug[s35i] + '/steg');
  if (s35N.radius !== null && s35N.radius_band && (s35N.radius < s35N.radius_band[0] || s35N.radius > s35N.radius_band[1])) s35Bad.push(s35Fug[s35i] + '/radius');
  if (s35N.winkel_art !== null && !s35Arten2[s35N.winkel_art]) s35BadArt.push(s35Fug[s35i]);
  if (s35N.t_von !== null && s35N.t_bis !== null && s35N.t_von >= s35N.t_bis) s35BadT.push(s35Fug[s35i]);
  for (s35j = 0; s35j < s35N.verfahren.length; s35j++) {
    if (s35VerfCodes.indexOf(s35N.verfahren[s35j]) < 0) s35BadV.push(s35Fug[s35i] + '/' + s35N.verfahren[s35j]);
  }
}
eq(s35Bad.length, 0, 'N6b: JEDER Richtwert liegt in seinem eigenen Band' + (s35Bad.length ? ' (' + s35Bad.join(', ') + ')' : ''));
eq(s35BadArt.length, 0, 'N6b: die Winkelart ist immer alpha, beta oder ausdruecklich keine');
eq(s35BadT.length, 0, 'N6b: kein Dickenbereich steht auf dem Kopf');
eq(s35BadV.length, 0, 'N6b: jedes empfohlene Verfahren gibt es wirklich' + (s35BadV.length ? ' (' + s35BadV.join(', ') + ')' : ''));

/* Die Dickenfrage wird beantwortet, aber nichts verboten. */
eq(Data.nahtvorbereitung('stumpf_v', 10).im_bereich, true, 'N6b: 10 mm liegen im Bereich der V-Fuge');
eq(Data.nahtvorbereitung('stumpf_v', 30).im_bereich, false, 'N6b: 30 mm liegen darueber');
eq(Data.nahtvorbereitung('stumpf_u', 8).im_bereich, false, 'N6b: 8 mm liegen unter der U-Fuge');
eq(Data.nahtvorbereitung('stumpf_v').im_bereich, null, 'N6b: ohne Dicke wird nichts behauptet');
ok(Data.nahtvorbereitung('stumpf_v', 30).ok, 'N6b: ausserhalb des Bereichs wird trotzdem geantwortet — nicht verboten');
eq(Data.nahtvorbereitung('quatsch').grund, 'fugenform_unbekannt', 'N6b: eine unbekannte Fugenform sagt das');
var s35Kop = Data.nahtvorbereitung('stumpf_v');
s35Kop.verfahren.push('probe'); s35Kop.winkel_band.push(99);
eq(Data.nahtvorbereitung('stumpf_v').verfahren.length, 4, 'N6b: die Antwort ist eine Kopie');
eq(Data.nahtvorbereitung('stumpf_v').winkel_band.length, 2, 'N6b: auch die Baender sind Kopien');

/* --- 8) REGRESSION: die alten Richtwerte haben sich NICHT verschoben ---- */
/* An ihnen haengt ab N10 die Volumen- und Kostenrechnung. Die Tabelle ist
   gewachsen — die sieben alten Zahlenpaare muessen dieselben bleiben. */
var s35Alt = [
  ['stumpf_i', 0, 0, 2], ['stumpf_v', 60, 2, 2], ['stumpf_dv', 50, 3, 2],
  ['stumpf_hv', 50, 2, 2], ['stumpf_dhv', 50, 2, 2], ['stumpf_hy', 50, 3, 0],
  ['stumpf_dhy', 50, 3, 0]
];
for (s35i = 0; s35i < s35Alt.length; s35i++) {
  var s35A = Data.nahtvorbereitung(s35Alt[s35i][0]);
  eq(s35A.winkel, s35Alt[s35i][1], 'N6b: ' + s35Alt[s35i][0] + ' — Winkel unveraendert');
  eq(s35A.steg, s35Alt[s35i][2], 'N6b: ' + s35Alt[s35i][0] + ' — Steg unveraendert');
  eq(s35A.spalt, s35Alt[s35i][3], 'N6b: ' + s35Alt[s35i][0] + ' — Spalt unveraendert');
}

/* --- 9) Dreisprachig, sonst ist der Katalog nicht fertig ---------------- */
var s35Spr = ['de', 'en', 'pt'], s35Fehl = [];
for (s35i = 0; s35i < Sym.KATALOG.length; s35i++) {
  for (s35j = 0; s35j < s35Spr.length; s35j++) {
    if (!Kern.t('sym_' + Sym.KATALOG[s35i].code, s35Spr[s35j])) s35Fehl.push('sym_' + Sym.KATALOG[s35i].code);
  }
}
for (s35i = 0; s35i < Sym.MASSE.length; s35i++) {
  for (s35j = 0; s35j < s35Spr.length; s35j++) {
    if (!Kern.t('sym_mass_' + Sym.MASSE[s35i], s35Spr[s35j])) s35Fehl.push('sym_mass_' + Sym.MASSE[s35i]);
  }
}
for (s35i = 0; s35i < s35Fug.length; s35i++) {
  for (s35j = 0; s35j < s35Spr.length; s35j++) {
    if (!Kern.t('fug_' + s35Fug[s35i], s35Spr[s35j])) s35Fehl.push('fug_' + s35Fug[s35i]);
  }
}
eq(s35Fehl.length, 0,
   'N6b: jeder Katalogeintrag, jedes Mass und jede Fugenform ist dreisprachig benannt' +
   (s35Fehl.length ? ' (fehlt: ' + s35Fehl.slice(0, 5).join(', ') + ')' : ''));
ok(Kern.has('fug_winkel_alpha') && Kern.has('fug_winkel_beta') && Kern.has('fug_radius'),
   'N6b: auch die Kenngroessen der Vorbereitung haben Namen');
ok(Kern.t('sym_vorbereitung_richtwert', 'de').indexOf('WPS') > 0,
   'N6b: der Vorbereitungstext sagt, dass die WPS entscheidet — nicht dieses Programm');

/* ========================================================================= */
sek('S36 · N6b Etappe 2 — die Symbole werden gezeichnet');

/* svglib haengt im Harness am globalen Objekt, wie im Browser am Fenster. */
if (typeof global !== 'undefined' && !global.DTNSvgLib) global.DTNSvgLib = Svg;

/* --- 1) Jedes Grundsymbol laesst sich zeichnen -------------------------- */
var s36Grund = Sym.codes('grund'), s36i, s36j, s36z, s36Fehl = [], s36Kurz = [];
for (s36i = 0; s36i < s36Grund.length; s36i++) {
  s36z = Sym.zeichne({ grund: s36Grund[s36i] });
  if (!s36z.ok) s36Fehl.push(s36Grund[s36i]);
  else if (s36z.svg.length < 80 || s36z.gezeichnet < 3) s36Kurz.push(s36Grund[s36i]);
}
eq(s36Fehl.length, 0, 'N6b: ALLE 23 Grundsymbole lassen sich zeichnen' + (s36Fehl.length ? ' (' + s36Fehl.join(', ') + ')' : ''));
eq(s36Kurz.length, 0, 'N6b: keines liefert ein leeres oder halbes Bild' + (s36Kurz.length ? ' (' + s36Kurz.join(', ') + ')' : ''));

/* --- 2) DIE HARTE REGEL: kein Text im SVG (4.3) ------------------------- */
var s36Text = [], s36Voll;
for (s36i = 0; s36i < s36Grund.length; s36i++) {
  s36Voll = Sym.zeichne({ grund: s36Grund[s36i],
    zusatz: ['flach', 'gewoelbt', 'hohl', 'kerbfrei', 'badsicherung_bleibend', 'badsicherung_entfernbar'],
    rundum: true, baustelle: true, gabel: true, rahmen: true,
    masse: { a: 5, z: 7, s: 10, l: 100, n: 3, e: 200, d: 8, b: 12 } });
  if (/<text|<tspan/.test(s36Voll.svg)) s36Text.push(s36Grund[s36i]);
  if (/[A-Za-z]{2,}["'>]/.test(s36Voll.svg.replace(/data-code="[^"]*"|class="[^"]*"|data-id="[^"]*"|xmlns[^"]*"[^"]*"|viewBox|preserveAspectRatio|xMidYMid meet|role="img"|width="100%"/g, ''))) {
    /* nur Formhinweis, keine Assertion — die eigentliche Regel ist die Textregel oben */
  }
}
eq(s36Text.length, 0, 'N6b: in KEINEM Symbol steht Text im SVG — auch nicht mit allen Zusatzzeichen');
ok(Sym.zeichne({ grund: 'kehlnaht', masse: { a: 5 } }).svg.indexOf('5') < 0 ||
   Sym.zeichne({ grund: 'kehlnaht', masse: { a: 5 } }).bemassung.length === 1,
   'N6b: das a-Mass kommt als Bemassungsangabe heraus, nicht als Zahl im Bild');

/* --- 3) Doppelnaehte sind dieselbe Form, nur gespiegelt ----------------- */
eq(Sym.formCode('x_naht'), 'v_naht', 'N6b: die X-Naht benutzt die Form der V-Naht');
eq(Sym.formCode('k_naht'), 'hv_naht', 'N6b: die K-Naht die der HV-Naht');
eq(Sym.formCode('doppelkehlnaht'), 'kehlnaht', 'N6b: die Doppelkehlnaht die der Kehlnaht');
eq(Sym.formCode('v_naht'), 'v_naht', 'N6b: einseitige Naehte zeigen auf sich selbst');
var s36DoppelOhneForm = [], s36D;
for (s36D in Sym.DOPPEL) {
  if (!Object.prototype.hasOwnProperty.call(Sym.DOPPEL, s36D)) continue;
  if (!Sym.FORMEN[Sym.DOPPEL[s36D]]) s36DoppelOhneForm.push(s36D);
  if (Sym.FORMEN[s36D]) s36DoppelOhneForm.push(s36D + ' (doppelt angelegt)');
}
eq(s36DoppelOhneForm.length, 0,
   'N6b: keine Doppelnaht hat eine zweite eigene Form — eine Form, eine Quelle');
var s36X = Sym.zeichne({ grund: 'x_naht' }), s36V = Sym.zeichne({ grund: 'v_naht' });
ok(s36X.symmetrisch === true && s36V.symmetrisch === false,
   'N6b: die X-Naht meldet sich als symmetrisch, die V-Naht nicht');
ok(s36X.gezeichnet > s36V.gezeichnet, 'N6b: und zeichnet dafuer ein Teil mehr');

/* --- 4) Pfeilseite, Gegenseite, gestrichelte Linie ---------------------- */
function s36Leg(z, code) {
  for (var i = 0; i < z.legende.length; i++) if (z.legende[i].code === code) return z.legende[i];
  return null;
}
var s36Zwei = Sym.zeichne({ grund: 'kehlnaht', gegenseite: 'v_naht' });
ok(!!s36Leg(s36Zwei, 'sy_identlinie'),
   'N6b: bei zwei verschiedenen Seiten erscheint die Identifikationslinie');
ok(/data-code="sy_identlinie"/.test(s36Zwei.svg) &&
   /stroke-dasharray="[^"]+"[^>]*data-code="sy_identlinie"/.test(s36Zwei.svg),
   'N6b: und sie ist WIRKLICH gestrichelt — sonst waere die Seitenregel im Bild nicht ablesbar');
ok(!/stroke-dasharray/.test(s36V.svg),
   'N6b: ohne Gegenseite ist keine Linie gestrichelt');
eq(s36Zwei.gegenseite, 'v_naht', 'N6b: und die Gegenseite steht im Ergebnis');
ok(!s36Leg(s36V, 'sy_identlinie'),
   'N6b: bei nur einer Seite gibt es keine gestrichelte Linie');
ok(!s36Leg(s36X, 'sy_identlinie'),
   'N6b: bei symmetrischen Naehten ebenfalls nicht — sie waere doppelt gemoppelt');
var s36XG = Sym.zeichne({ grund: 'x_naht', gegenseite: 'v_naht' });
eq(s36XG.gegenseite, 'x_naht',
   'N6b: eine Gegenseite an einer symmetrischen Naht wird nicht angenommen');
ok(s36XG.hinweise.indexOf('msg_symbol_gegenseite_symmetrisch') >= 0,
   'N6b: und das wird gesagt, nicht stillschweigend verworfen');
ok(s36V.hinweise.indexOf('msg_symbol_seitenregel') >= 0,
   'N6b: die Seitenregel steht bei JEDER Angabe dabei — sie gilt nie stillschweigend');
ok(!!s36Leg(s36V, 'sy_pfeillinie') && !!s36Leg(s36V, 'sy_bezugslinie'),
   'N6b: Pfeillinie und Bezugslinie sind benannt');

/* --- 5) Die ehrliche Aussage kommt beim Zeichnen mit -------------------- */
var s36Ohne = Sym.ohneNachweis(), s36Still = [];
for (s36i = 0; s36i < s36Ohne.length; s36i++) {
  s36z = Sym.zeichne({ grund: s36Ohne[s36i] });
  if (s36z.nachweisbar !== false) s36Still.push(s36Ohne[s36i]);
  if (s36z.hinweise.indexOf('msg_symbol_nicht_nachweisbar') < 0) s36Still.push(s36Ohne[s36i] + ' (ohne Hinweis)');
}
eq(s36Still.length, 0,
   'N6b: JEDES nicht nachweisbare Symbol sagt es beim Zeichnen — 14 von 23' +
   (s36Still.length ? ' (' + s36Still.join(', ') + ')' : ''));
eq(Sym.zeichne({ grund: 'kehlnaht' }).hinweise.indexOf('msg_symbol_nicht_nachweisbar'), -1,
   'N6b: die Kehlnaht traegt diesen Hinweis nicht');
eq(Sym.zeichne({ grund: 'kehlnaht', gegenseite: 'u_naht' }).nachweisbar, false,
   'N6b: eine nicht nachweisbare Gegenseite macht die ganze Angabe nicht nachweisbar');

/* --- 6) Bemassung: geprueft statt uebernommen --------------------------- */
var s36B = Sym.zeichne({ grund: 'kehlnaht', masse: { a: 5, l: 100, n: 3, e: 200 } });
eq(s36B.bemassung.length, 4, 'N6b: vier zulaessige Masse an der Kehlnaht');
eq(s36B.warnungen.length, 0, 'N6b: ohne Beanstandung');
var s36BF = Sym.zeichne({ grund: 'kehlnaht', masse: { a: 5, s: 12 } });
eq(s36BF.bemassung.length, 1, 'N6b: die Stumpfnahtdicke gehoert nicht an eine Kehlnaht');
ok(s36BF.warnungen.indexOf('msg_symbol_mass_ungueltig') >= 0,
   'N6b: und das wird gemeldet statt still weggelassen');
eq(Sym.zeichne({ grund: 'v_naht', masse: { s: 12 } }).bemassung.length, 1,
   'N6b: an der V-Naht ist die Nahtdicke dagegen richtig');
eq(Sym.zeichne({ grund: 'kehlnaht', masse: { a: null, l: 100 } }).bemassung.length, 1,
   'N6b: leere Masse werden ausgelassen, ohne zu meckern');

/* --- 7) Zusatzzeichen und Angaben an der Pfeillinie --------------------- */
var s36Z = Sym.zeichne({ grund: 'kehlnaht', zusatz: ['flach'], rundum: true, baustelle: true, gabel: true });
ok(!!s36Leg(s36Z, 'sym_flach') && !!s36Leg(s36Z, 'sym_rundum') &&
   !!s36Leg(s36Z, 'sym_baustelle') && !!s36Leg(s36Z, 'sym_gabel'),
   'N6b: Zusatzzeichen und alle drei Angaben stehen in der Legende');
ok(s36Z.hinweise.indexOf('msg_symbol_buchstaben_in_legende') >= 0,
   'N6b: bei der Gabel wird gesagt, dass die Verfahrensangabe in der Legende steht');
eq(Sym.zeichne({ grund: 'kehlnaht', zusatz: ['rundum'] }).legende.length,
   Sym.zeichne({ grund: 'kehlnaht' }).legende.length,
   'N6b: ein Lagezeichen wird nicht als Zusatzzeichen angenommen');
eq(Sym.zeichne({ grund: 'kehlnaht', zusatz: ['gibtsnicht'] }).legende.length,
   Sym.zeichne({ grund: 'kehlnaht' }).legende.length,
   'N6b: ein unbekanntes Zusatzzeichen wird ausgelassen');
eq(Sym.zeichne({ grund: 'kehlnaht', zusatz: 'flach' }).legende.length,
   Sym.zeichne({ grund: 'kehlnaht', zusatz: ['flach'] }).legende.length,
   'N6b: ein einzelnes Zusatzzeichen darf auch ohne Liste kommen');

/* --- 8) Fehlerfaelle: kein halbes Bild --------------------------------- */
var s36Leer = Sym.zeichne({});
eq(s36Leer.ok, false, 'N6b: ohne Grundsymbol gibt es kein Bild');
eq(s36Leer.svg, '', 'N6b: und wirklich KEIN halbes SVG');
eq(s36Leer.fehler, 'msg_symbol_kein_grundsymbol', 'N6b: der Grund wird benannt');
eq(Sym.zeichne({ grund: 'flach' }).ok, false, 'N6b: ein Zusatzzeichen allein ist keine Angabe');
eq(Sym.zeichne({ grund: 'gibtsnicht' }).ok, false, 'N6b: ein unbekannter Code auch nicht');
var s36FehlCode = [];
for (s36i = 0; s36i < Sym.CODES.length; s36i++) {
  for (s36j = 0; s36j < 3; s36j++) {
    if (!Kern.t(Sym.CODES[s36i], ['de', 'en', 'pt'][s36j])) s36FehlCode.push(Sym.CODES[s36i]);
  }
}
eq(s36FehlCode.length, 0, 'N6b: jede Meldung des Symbolgenerators ist dreisprachig');

/* --- 9) Bestimmtheit und Nichteinmischung ------------------------------- */
eq(Sym.zeichne({ grund: 'v_naht' }).svg, Sym.zeichne({ grund: 'v_naht' }).svg,
   'N6b: gleiche Eingabe, zeichengenau gleiches Bild');
var s36Ein = { grund: 'kehlnaht', zusatz: ['flach'], masse: { a: 5 } };
Sym.zeichne(s36Ein);
eq(s36Ein.zusatz.length, 1, 'N6b: die Eingabe wird nicht veraendert');
ok(Object.keys(s36Ein.masse).length === 1, 'N6b: auch die Masse nicht');

/* --- 10) Der Weg von der Rechenwelt zum Symbol -------------------------- */
var s36AusNaht = [], s36N;
for (s36i = 0; s36i < Data.NAHTARTEN.length; s36i++) {
  s36N = Sym.ausNahtart(Data.NAHTARTEN[s36i].code);
  if (!s36N.ok) s36AusNaht.push(Data.NAHTARTEN[s36i].code);
}
eq(s36AusNaht.length, 0,
   'N6b: zu JEDER rechenbaren Nahtart laesst sich das Symbol zeichnen' +
   (s36AusNaht.length ? ' (' + s36AusNaht.join(', ') + ')' : ''));
ok(Sym.ausNahtart('kehl_umlaufend').legende.some ?
   Sym.ausNahtart('kehl_umlaufend').legende.some(function (l) { return l.code === 'sym_rundum'; }) : true,
   'N6b: die umlaufende Kehlnaht bekommt das Rundum-Zeichen von selbst');
eq(Sym.ausNahtart('gibtsnicht').ok, false, 'N6b: eine unbekannte Nahtart liefert kein Bild');
eq(Sym.ausNahtart('stumpf_v').grund, 'v_naht', 'N6b: die V-Naht findet ihr Symbol');
eq(Sym.ausNahtart('stumpf_dhv').grund, 'k_naht', 'N6b: die Doppel-HV-Naht ihre K-Naht');

/* ========================================================================= */
sek('S37 · N6b Etappe 3 — die Symbolwahl haengt an der Oberflaeche');

var Sym37 = require('./symbol.js'), Ui37 = require('./ui.js');
var ui37Src = fsU.readFileSync(__dirname + '/ui.js', 'utf8');
var s37i, s37j;

/* --- 1) Die bewachte Doppelung: Optionsliste gegen Katalog -------------- */
var s37Kat = Sym37.codes('grund').slice().sort().join(',');
var s37Opt = Options.SYM_GRUND.slice().sort().join(',');
eq(s37Opt, s37Kat,
   'N6b: die Auswahlliste in optionen.js und der Katalog in symbol.js sind deckungsgleich');
eq(Options.SYM_OBERFLAECHE.length + Options.SYM_SICHERUNG.length,
   Sym37.codes('zusatz').length,
   'N6b: alle sechs Zusatzzeichen sind auf die zwei Auswahlen verteilt — keines faellt hinten runter');
var s37Zus = Options.SYM_OBERFLAECHE.concat(Options.SYM_SICHERUNG), s37Fremd = [];
for (s37i = 0; s37i < s37Zus.length; s37i++) {
  var s37E = Sym37.eintrag(s37Zus[s37i]);
  if (!s37E || s37E.art !== 'zusatz') s37Fremd.push(s37Zus[s37i]);
}
eq(s37Fremd.length, 0, 'N6b: und keine der Auswahlen ist etwas anderes als ein Zusatzzeichen');

/* --- 2) Die Namen stehen nur EINMAL im Woerterbuch --------------------- */
var s37G = Options.gruppe('sym_grund'), s37OhneSchl = [], s37Doppelt = [];
for (s37i = 0; s37i < s37G.optionen.length; s37i++) {
  var s37O = s37G.optionen[s37i];
  if (!s37O.schluessel) s37OhneSchl.push(s37O.code);
  else if (Kern.has('opt_sym_grund_' + s37O.code)) s37Doppelt.push(s37O.code);
}
eq(s37OhneSchl.length, 0, 'N6b: jede Symboloption zeigt auf den Katalogtext');
eq(s37Doppelt.length, 0,
   'N6b: und KEINE hat zusaetzlich einen eigenen Text — sonst stuenden die Namen zweimal da');
eq(Options.gruppe('sym_grund').optionen.length, 23, 'N6b: 23 Symbole zur Wahl');
eq(Options.gruppe('sym_gegen').optionen.length, 23, 'N6b: die Gegenseite bietet dieselben an');
eq(Options.GRUPPEN.length, 25, 'N6b: 25 Auswahlgruppen insgesamt');
var s37Rechen = [];
for (s37i = 0; s37i < Options.GRUPPEN.length; s37i++) {
  if (Options.GRUPPEN[s37i].code.indexOf('sym_') === 0 && Options.GRUPPEN[s37i].rechenwirksam !== false) {
    s37Rechen.push(Options.GRUPPEN[s37i].code);
  }
}
eq(s37Rechen.length, 0, 'N6b: KEINE Symbolauswahl ist rechenwirksam — sie zeichnet, sie rechnet nicht');

/* --- 3) Beschriftung und Laien-ⓘ vollstaendig -------------------------- */
var s37Spr = ['de', 'en', 'pt'], s37FehlT = [], s37FehlH = [];
var s37Neu = ['sym_grund', 'sym_gegen', 'sym_oberflaeche', 'sym_sicherung', 'sym_lage'];
for (s37i = 0; s37i < s37Neu.length; s37i++) {
  for (s37j = 0; s37j < 3; s37j++) {
    if (!Kern.t('grp_' + s37Neu[s37i], s37Spr[s37j])) s37FehlT.push(s37Neu[s37i]);
  }
  if (!Hilfe.has('grp_' + s37Neu[s37i])) s37FehlH.push(s37Neu[s37i]);
}
eq(s37FehlT.length, 0, 'N6b: alle fuenf neuen Gruppen sind dreisprachig beschriftet');
eq(s37FehlH.length, 0, 'N6b: und jede hat ihr Laien-ⓘ' + (s37FehlH.length ? ' (fehlt: ' + s37FehlH.join(', ') + ')' : ''));

/* --- 4) Das Fachwissen bleibt draussen aus der Oberflaeche -------------- */
var s37Codes = Sym37.codes('grund'), s37Drin = [];
for (s37i = 0; s37i < s37Codes.length; s37i++) {
  if (ui37Src.indexOf("'" + s37Codes[i = s37i] + "'") >= 0) s37Drin.push(s37Codes[s37i]);
}
eq(s37Drin.length, 0,
   'N6b: KEIN einziger Symbolcode steht in ui.js — die Oberflaeche fragt nur nach' +
   (s37Drin.length ? ' (' + s37Drin.join(', ') + ')' : ''));
ok(ui37Src.indexOf('win.DTNSymbol') > 0, 'N6b: sie holt sich das Modul ueber das Fenster');
ok(ui37Src.indexOf('Symb.hatMass') > 0,
   'N6b: und fragt das Symbol selbst, welches Mass zu ihm passt');

/* --- 5) Der Block ist verdrahtet --------------------------------------- */
var s37Aus = null;
for (s37i = 0; s37i < Ui37.ZUORDNUNG.length; s37i++) {
  if (Ui37.ZUORDNUNG[s37i].code === 'ausfuehrung') s37Aus = Ui37.ZUORDNUNG[s37i];
}
ok(!!s37Aus && s37Aus.symbol === true, 'N6b: der Block traegt den Kasten fuer das Symbol');
eq(s37Aus.gruppen.length, 7, 'N6b: mit sieben Auswahlen');
var s37Klassen = ['symbol-box', 'symbol-bild', 'symbol-legende', 'symbol-masse'], s37FehlK = [];
for (s37i = 0; s37i < s37Klassen.length; s37i++) {
  if (Ui37.KLASSEN.indexOf(s37Klassen[s37i]) < 0) s37FehlK.push(s37Klassen[s37i]);
}
eq(s37FehlK.length, 0, 'N6b: alle vier neuen Klassen sind angemeldet und stehen in style.css');

/* --- 6) Die Luecke ist wirklich geschlossen ----------------------------- */
eq(Data.NICHT_GEPRUEFT.length, 13, 'N6b: die Liste 2.4 ist von 14 auf 13 Punkte geschrumpft');
eq(Data.NICHT_GEPRUEFT.indexOf('nahtvorbereitung'), -1, 'N6b: die Nahtvorbereitung ist raus');
ok(Data.fugenformen().length === 16 && Data.nahtvorbereitung('stumpf_u').radius === 6,
   'N6b: weil die Tabelle sie ersetzt — nachgeprueft an der U-Fuge');
ok(Kern.has('ng_pruefumfang_zfp') && Kern.has('ng_toleranzen') && Kern.has('ng_herstellerqualifikation'),
   'N6b: die drei verbliebenen Luecken stehen unveraendert');

/* ========================================================================= */
console.log('\n════════════════════════════════════════════');
console.log(' Assertions: ' + N + '   ·   Fehler: ' + FAIL.length);
if (FAIL.length) {
  console.log('\n FEHLGESCHLAGEN:');
  for (i = 0; i < FAIL.length; i++) console.log('  - ' + FAIL[i]);
}
console.log('════════════════════════════════════════════');
process.exit(FAIL.length ? 1 : 0);
