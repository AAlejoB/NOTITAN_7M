'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { armarEntrega } = require('../src/entrega.js');
const N = require('../src/nucleo.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const dia = require('../ejemplos/dia-de-ejemplo.js');

const AHORA = '2026-10-04T15:00:00.000Z';
const salida = (id, links, extra = {}) => ({
  id, titulo: 'Título ' + id, bajada: '', bloque: 'nacional', seccion: '', pais: '', via: 'A',
  etiqueta: 'Confirmada por 5 medios', gruposIndependientes: 5, links, ...extra,
});
const decididoVacio = () => ({ nacionales: [], internacionales: [], aMano: { nacional: [], internacional: [] }, cupo: { nacional: 7, internacional: 7 }, reserva: [], avisos: [] });

test('E1: con el día de ejemplo, cada bloque trae las mismas noticias que decidir, con título, bajada y links', () => {
  const ctx = { portales, reglas, firmas: dia.firmas, ahora: dia.ahora };
  const p = N.preparar(dia.notas, ctx);
  const d = N.decidir(p.candidatos, dia.juicios, { ...ctx, elegiblesAMano: p.elegiblesAMano });
  const e = armarEntrega(d, { ahora: AHORA, portales, reglas, ejemplo: true });
  assert.equal(e.generadaEn, AHORA);
  assert.equal(e.ejemplo, true);
  assert.equal(e.cupoMinimo, 3);
  assert.equal(e.minGrupos, 5);
  assert.equal(e.bloques.nacional.noticias.length, d.nacionales.length);
  assert.equal(e.bloques.internacional.noticias.length, d.internacionales.length);
  assert.equal(e.bloques.nacional.aMano.length, d.aMano.nacional.length);
  assert.equal(e.bloques.internacional.aMano.length, d.aMano.internacional.length);
  assert.deepEqual(e.bloques.nacional.noticias.map(t => t.id), d.nacionales.map(x => x.id), 'en el mismo orden');
  assert.equal(e.bloques.nacional.tope, 7);
  const todas = [...e.bloques.nacional.noticias, ...e.bloques.nacional.aMano, ...e.bloques.internacional.noticias, ...e.bloques.internacional.aMano];
  assert.ok(todas.length > 10);
  for (const t of todas) {
    assert.equal(typeof t.titulo, 'string');
    assert.equal(typeof t.bajada, 'string');
    assert.ok(t.links.length > 0 && t.links.every(l => l.medio && l.url), t.id);
    assert.equal('impacto' in t, false, t.id);
  }
});

test('E1b: la tarjeta lleva etiqueta, vía, grupos y medios, y lo de a mano sale con vía "mano"', () => {
  const ctx = { portales, reglas, firmas: dia.firmas, ahora: dia.ahora };
  const p = N.preparar(dia.notas, ctx);
  const d = N.decidir(p.candidatos, dia.juicios, { ...ctx, elegiblesAMano: p.elegiblesAMano });
  const e = armarEntrega(d, { ahora: AHORA, portales, reglas });
  assert.equal(e.ejemplo, false, 'sin pedirlo, no es de ejemplo');
  const primera = e.bloques.nacional.noticias[0];
  assert.equal(primera.etiqueta, 'Confirmada por 6 medios');
  assert.equal(primera.grupos, 6);
  assert.equal(primera.via, 'A');
  assert.equal(primera.medios.length, 6, 'seis grupos distintos');
  const mano = e.bloques.nacional.aMano[0];
  assert.equal(mano.via, 'mano');
  assert.equal(mano.etiqueta, 'Confirmada por 4 medios · elegida a mano');
  assert.equal(mano.grupos, 4);
  assert.equal(e.bloques.nacional.noticias.at(-1).via, 'B');
});

test('E2: el medio de cada link sale con su nombre (TN, Clarín), y fuera de la lista con el dominio; TN y Clarín cuentan como un solo medio', () => {
  const d = decididoVacio();
  d.nacionales = [salida('x', [
    { portal: 'tn.com.ar', url: 'https://tn.com.ar/a' },
    { portal: 'clarin.com', url: 'https://www.clarin.com/b' },
    { portal: 'ejemplo.com', url: 'https://www.ejemplo.com/c' },
    { portal: 'lanacion.com.ar', url: 'https://www.lanacion.com.ar/d' },
    { portal: 'lnmas.com', url: 'https://www.lnmas.com/e' },
  ])];
  const t = armarEntrega(d, { ahora: AHORA, portales, reglas }).bloques.nacional.noticias[0];
  assert.deepEqual(t.links.map(l => l.medio), ['TN', 'Clarín', 'ejemplo.com', 'La Nación', 'LN+']);
  assert.deepEqual(t.medios, ['Clarín', 'La Nación'], 'TN y Clarín dan uno solo; el dominio fuera de la lista y el portal inactivo no suman');
});

test('E3: afueraPorTope cuenta solo las que quedaron por cupo, y solo las de ese bloque', () => {
  const d = decididoVacio();
  d.reserva = [
    { ...salida('cupo-nac', []), motivo: 'cupo' },
    { ...salida('seccion-nac', []), motivo: 'tope_seccion (economía)' },
    { ...salida('cupo-int', [], { bloque: 'internacional' }), motivo: 'cupo' },
    { ...salida('pais-int', [], { bloque: 'internacional' }), motivo: 'tope_pais (EEUU)' },
    { ...salida('cupo-int2', [], { bloque: 'internacional' }), motivo: 'cupo' },
  ];
  const e = armarEntrega(d, { ahora: AHORA, portales, reglas });
  assert.equal(e.bloques.nacional.afueraPorTope, 1);
  assert.equal(e.bloques.internacional.afueraPorTope, 2);
});

test('armarEntrega: el tope sale del cupo usado, los avisos se copian y no se comparte el arreglo', () => {
  const d = decididoVacio();
  d.cupo = { nacional: 5, internacional: 3 };
  d.avisos = ['Un aviso'];
  const e = armarEntrega(d, { ahora: AHORA, portales, reglas });
  assert.equal(e.bloques.nacional.tope, 5);
  assert.equal(e.bloques.internacional.tope, 3);
  assert.deepEqual(e.avisos, ['Un aviso']);
  assert.notEqual(e.avisos, d.avisos);
  assert.deepEqual(e.bloques.nacional.noticias, []);
  assert.deepEqual(e.bloques.nacional.aMano, []);
});

test('config/portales.json: solo TN, Olé, La Voz y LN+ llevan un nombre propio', () => {
  assert.deepEqual(portales.filter(p => p.nombre).map(p => [p.dominio, p.nombre]),
    [['tn.com.ar', 'TN'], ['ole.com.ar', 'Olé'], ['lavoz.com.ar', 'La Voz'], ['lnmas.com', 'LN+']]);
});

test('armar-pagina: la lista del día de ejemplo sale marcada como ejemplo, con 7 y 5 noticias y una 4/5 por bloque', () => {
  const { armarLista } = require('../scripts/armar-pagina.js');
  const e = armarLista(AHORA);
  assert.equal(e.ejemplo, true);
  assert.equal(e.generadaEn, AHORA);
  assert.deepEqual([e.bloques.nacional.noticias.length, e.bloques.internacional.noticias.length], [7, 5]);
  assert.deepEqual([e.bloques.nacional.aMano.length, e.bloques.internacional.aMano.length], [1, 1]);
  assert.deepEqual([e.bloques.nacional.afueraPorTope, e.bloques.internacional.afueraPorTope], [0, 0]);
  assert.equal(e.bloques.nacional.noticias[0].titulo.startsWith('Paro general de la CGT'), true, 'arriba, la que más medios publicó');
});

test('pagina/lista.json (el que se commitea): es de ejemplo y tiene la forma que lee la página', () => {
  const lista = require('../pagina/lista.json');
  assert.equal(lista.ejemplo, true, 'son datos inventados');
  assert.ok(!Number.isNaN(Date.parse(lista.generadaEn)));
  assert.equal(typeof lista.cupoMinimo, 'number');
  assert.equal(typeof lista.minGrupos, 'number');
  for (const b of ['nacional', 'internacional']) {
    const bloque = lista.bloques[b];
    assert.equal(typeof bloque.tope, 'number');
    assert.equal(typeof bloque.afueraPorTope, 'number');
    for (const t of [...bloque.noticias, ...bloque.aMano]) {
      assert.ok(t.titulo && t.etiqueta && t.links.length > 0 && Array.isArray(t.medios), t.id);
      assert.equal('impacto' in t, false);
    }
  }
});

test('sinIA es false si no se pide y true si se pide; la lista que se commitea (pagina/lista.json) tiene sinIA false', () => {
  const ctx = { ahora: AHORA, portales, reglas };
  assert.equal(armarEntrega(decididoVacio(), ctx).sinIA, false);
  assert.equal(armarEntrega(decididoVacio(), { ...ctx, sinIA: true }).sinIA, true);
  const lista = JSON.parse(require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'pagina', 'lista.json'), 'utf8'));
  assert.equal(lista.sinIA, false);
});
