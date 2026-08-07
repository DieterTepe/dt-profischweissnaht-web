/* ============================================================================
 * DT-ProfiSchweissnaht · i18n_kerbfall.js  (DTNI18nKerb)
 * Baustein N1 — GERUEST. Kerbfallbezeichnungen und Anwendungsbedingungen
 * werden erst in N13/N14 gefuellt. Die Struktur steht bereits vollstaendig,
 * damit spaeter nur noch Eintraege ergaenzt werden (minimale Diffs).
 *
 * Regel: Nicht gefuellte Kerbfaelle bleiben eine SICHTBARE ehrliche Luecke —
 * niemals ein stiller Fehlwert.
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DTNI18nKerb = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.2.0-N11';
  var SPRACHEN = ['de', 'en', 'pt'];

  var K = {
    /* ---- Rahmen des Kerbfallkatalogs ---- */
    kat_titel:        { de: 'Kerbfallkatalog', en: 'Detail category catalogue', pt: 'Catálogo de categorias de detalhe' },
    kat_stahl:        { de: 'Stahl (EN 1993-1-9)', en: 'Steel (EN 1993-1-9)', pt: 'Aço (EN 1993-1-9)' },
    kat_alu:          { de: 'Aluminium (EN 1999-1-3)', en: 'Aluminium (EN 1999-1-3)', pt: 'Alumínio (EN 1999-1-3)' },
    kat_kategorie:    { de: 'Kerbfall Δσc', en: 'Detail category Δσc', pt: 'Categoria de detalhe Δσc' },
    kat_bedingungen:  { de: 'Anwendungsbedingungen', en: 'Conditions of use', pt: 'Condições de aplicação' },
    kat_skizze:       { de: 'Skizze', en: 'Sketch', pt: 'Esquema' },
    kat_spannungsart: { de: 'Spannungsart', en: 'Stress type', pt: 'Tipo de tensão' },
    kat_normal:       { de: 'Normalspannung', en: 'Normal stress', pt: 'Tensão normal' },
    kat_schub:        { de: 'Schubspannung', en: 'Shear stress', pt: 'Tensão de corte' },

    /* ---- Gruppen (Struktur nach EN 1993-1-9 Tab. 8.1 ff.) ---- */
    grp_ungeschweisst:   { de: 'Ungeschweißte Bauteile', en: 'Plain members', pt: 'Elementos não soldados' },
    grp_laengsnaehte:    { de: 'Geschweißte Bauteile mit Längsnähten', en: 'Welded built-up sections, longitudinal welds', pt: 'Secções soldadas, cordões longitudinais' },
    grp_quernaehte:      { de: 'Quer verlaufende Stumpfnähte', en: 'Transverse butt welds', pt: 'Soldas de topo transversais' },
    grp_anschweissteile: { de: 'Angeschweißte Bauteile und Steifen', en: 'Welded attachments and stiffeners', pt: 'Elementos e reforços soldados' },
    grp_kreuzstoss:      { de: 'Tragende Kreuz- und T-Stöße', en: 'Load-carrying cruciform and T-joints', pt: 'Juntas cruciformes e em T resistentes' },
    grp_hohlprofile:     { de: 'Hohlprofile und Knotenpunkte', en: 'Hollow sections and nodes', pt: 'Perfis tubulares e nós' },
    grp_sonstige:        { de: 'Sonstige Details', en: 'Other details', pt: 'Outros detalhes' },

    /* ---- Ehrliche Lueckenmeldungen ---- */
    lk_katalog_gestaffelt: { de: 'Der Kerbfallkatalog wird gestaffelt gefüllt. Dieses Detail ist noch nicht hinterlegt – es gibt hier bewusst keinen Ersatzwert.',
                             en: 'The detail category catalogue is being filled in stages. This detail is not yet included – no substitute value is given here on purpose.',
                             pt: 'O catálogo está a ser preenchido por etapas. Este detalhe ainda não está incluído – não é dado qualquer valor substituto.' },
    lk_kein_detail_gewaehlt: { de: 'Es ist noch kein Kerbfall gewählt – ohne Kerbfall ist kein Ermüdungsnachweis möglich.',
                               en: 'No detail category selected – without it no fatigue verification is possible.',
                               pt: 'Nenhuma categoria selecionada – sem ela não há verificação à fadiga.' },
    lk_qualitaet_vorausgesetzt: { de: 'Kerbfälle setzen eine bestimmte Ausführungsqualität voraus (siehe ISO 5817). Bewertungsgruppe prüfen.',
                                  en: 'Detail categories presuppose a given execution quality (see ISO 5817). Check the quality level.',
                                  pt: 'As categorias pressupõem uma dada qualidade de execução (ver ISO 5817). Verificar o nível.' }
  };

  /* Der eigentliche Katalog (Codes -> Bezeichnungen) wird ab N14 hier
     ergaenzt. Leer heisst: noch nichts hinterlegt, nicht "kein Kerbfall". */
  var KATALOG = {};

  function t(key, lang) {
    var e = K[key];
    if (!e) return '[' + key + ']';
    return e[lang] || e.de || ('[' + key + ']');
  }

  function has(key) { return Object.prototype.hasOwnProperty.call(K, key); }

  function keys() {
    var r = [];
    for (var k in K) if (Object.prototype.hasOwnProperty.call(K, k)) r.push(k);
    return r;
  }

  return { NAME: 'i18n_kerbfall', VERSION: VERSION, SPRACHEN: SPRACHEN, dict: K, KATALOG: KATALOG,
           t: t, has: has, keys: keys };
}));
