/* ============================================================================
 * DT-ProfiSchweissnaht · dom_smoke_test.js  ***DEV-ONLY — NIE AUSLIEFERN***
 * DOM-Smoke der TESTEDITION. Nutzt denselben Mini-DOM-Shim wie die
 * Vollversion und laedt ebenfalls IMMER ALLE Module gemeinsam.
 * Aufruf:  node dom_smoke_test.js
 * ========================================================================== */
'use strict';

var voll = require('./dom_smoke_voll.js');

var r = voll.lauf('test');
console.log('\n  Smoke Testversion: ' + r.N + ' Prüfungen · ' + r.FAIL.length + ' Fehler');
process.exit(r.FAIL.length ? 1 : 0);
