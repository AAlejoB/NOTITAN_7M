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

test('capa 4: sin pasarlas, la lista trae provisorias 0, cliente vacío y paginaViejaMinutos 60', () => {
  const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas });
  assert.equal(e.provisorias, 0);
  assert.equal(e.cliente, '');
  assert.equal(e.paginaViejaMinutos, 60);
});

test('capa 4: pasándolas, la lista trae provisorias, cliente y paginaViejaMinutos', () => {
  const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas, provisorias: 2, cliente: 'Canal 2', paginaViejaMinutos: 90 });
  assert.equal(e.provisorias, 2);
  assert.equal(e.cliente, 'Canal 2');
  assert.equal(e.paginaViejaMinutos, 90);
});

test('zona: con zona, los bloques de la zona van primero (con nombre y mínimo 1) y orden es de cuatro', () => {
  const portalesZona = require('../config/zona/portales.json').portales;
  const local = salida('g:z1', [{ portal: 'elcomodorense.net', url: 'https://www.elcomodorense.net/a' }, { portal: 'elpatagonico.com', url: 'https://www.elpatagonico.com/b' }],
    { bloque: 'local', etiqueta: 'Confirmada por 2 medios locales', gruposIndependientes: 2 });
  const zona = {
    bloques: {
      local: { nombre: 'Comodoro', tope: 3, noticias: [local], aMano: [], afueraPorTope: 0, minimo: 1 },
      chubut: { nombre: 'Chubut', tope: 3, noticias: [], aMano: [], afueraPorTope: 0, minimo: 1 },
    },
    confirmados: [], descartadas: [], portales: portalesZona,
  };
  const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas, zona });
  assert.deepEqual(e.orden, ['local', 'chubut', 'nacional', 'internacional']);
  assert.deepEqual(Object.keys(e.bloques), ['local', 'chubut', 'nacional', 'internacional']);
  assert.equal(e.bloques.local.nombre, 'Comodoro');
  assert.equal(e.bloques.local.minimo, 1);
  assert.equal(e.bloques.local.tope, 3);
  assert.deepEqual(e.bloques.local.noticias[0].medios, ['El Comodorense', 'El Patagónico']);
  assert.deepEqual(e.bloques.local.noticias[0].links.map(l => l.medio), ['El Comodorense', 'El Patagónico']);
  assert.equal(e.bloques.chubut.noticias.length, 0);
  assert.equal('nombre' in e.bloques.nacional, false, 'los dos de siempre no cambian de forma');
});

test('zona: sin zona, orden es nacional e internacional y los bloques son los dos de siempre', () => {
  const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas });
  assert.deepEqual(e.orden, ['nacional', 'internacional']);
  assert.deepEqual(Object.keys(e.bloques), ['nacional', 'internacional']);
  assert.deepEqual(Object.keys(e.bloques.nacional), ['tope', 'noticias', 'aMano', 'afueraPorTope']);
});

/* ───────────── avisos (cortes) ───────────── */

const aviso = (extra = {}) => ({
  id: 'a:scpl.coop:2898', servicio: 'agua', programado: true, dia: '2026-10-08', desde: '15:00', hasta: '15:00',
  finISO: '2026-10-09T18:00:00.000Z', duracionHoras: 24, barrios: ['Laprida', 'Güemes'], zona: null,
  titulo: 'CORTE DE AGUA EN 23 BARRIOS', resumen: 'Mañana, jueves 08 de octubre…',
  fuentes: [{ medio: 'SCPL', url: 'https://scpl.coop/index.php/site/ver-nota?id=2898' }, { medio: 'ADNSUR', url: 'https://www.adnsur.com.ar/x' }, { medio: 'ADNSUR', url: 'https://www.adnsur.com.ar/y' }],
  cronograma: false, publicado: '2026-10-07T15:00:00.000Z', ...extra,
});

test('E9: con un aviso, orden empieza con avisos y la tarjeta dice «Agua · programado»', () => {
  const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas, avisos: [aviso()] });
  assert.deepEqual(e.orden, ['avisos', 'nacional', 'internacional']);
  const b = e.bloques.avisos;
  assert.deepEqual({ ...b, noticias: b.noticias.length }, { nombre: 'Avisos', tope: null, noticias: 1, aMano: [], afueraPorTope: 0, minimo: 1 });
  const t = b.noticias[0];
  assert.equal(t.etiqueta, 'Agua · programado');
  assert.equal(t.via, 'aviso');
  assert.equal(t.bajada, 'Mañana, jueves 08 de octubre…');
  assert.equal(t.grupos, 3);
  assert.deepEqual(t.medios, ['SCPL', 'ADNSUR']);
  assert.deepEqual(t.links[0], { medio: 'SCPL', url: 'https://scpl.coop/index.php/site/ver-nota?id=2898' });
  assert.deepEqual(t.aviso, { servicio: 'agua', programado: true, dia: '2026-10-08', desde: '15:00', hasta: '15:00', duracionHoras: 24, barrios: ['Laprida', 'Güemes'], zona: null, cronograma: false });
  assert.deepEqual(e.avisos, [], 'el avisos de primer nivel sigue siendo el de decidir');
});

test('E9: con avisos vacío (o sin pasarlo), orden es el de siempre y no hay bloque avisos', () => {
  for (const avisos of [[], null, undefined]) {
    const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas, avisos });
    assert.deepEqual(e.orden, ['nacional', 'internacional']);
    assert.equal('avisos' in e.bloques, false);
  }
});

test('avisos: la etiqueta de cada tipo, y el cronograma sin link', () => {
  const etiqueta = extra => armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas, avisos: [aviso(extra)] }).bloques.avisos.noticias[0];
  assert.equal(etiqueta({ servicio: 'luz', programado: false }).etiqueta, 'Luz · avería');
  assert.equal(etiqueta({ servicio: 'luz', programado: null }).etiqueta, 'Luz');
  const crono = etiqueta({ cronograma: true, fuentes: [{ medio: 'SCPL', url: null }] });
  assert.equal(crono.etiqueta, 'Agua · cronograma de verano');
  assert.deepEqual(crono.links, [{ medio: 'Cronograma de verano de la SCPL', url: null }]);
  assert.equal(crono.aviso.cronograma, true);
});

test('avisos: un «se normalizó» lleva normalizado y publicado en aviso; los otros no los llevan', () => {
  const t = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas, avisos: [aviso({ normalizado: true })] }).bloques.avisos.noticias[0];
  assert.equal(t.etiqueta, 'Agua · se normalizó');
  assert.equal(t.aviso.normalizado, true);
  assert.equal(t.aviso.publicado, '2026-10-07T15:00:00.000Z');
  const otro = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas, avisos: [aviso({ normalizado: false })] }).bloques.avisos.noticias[0];
  assert.equal('normalizado' in otro.aviso, false);
});

// ── Carta del 17-10 (la página C): tema, hora y lista.pagina ──
const { temaDe } = require('../src/entrega.js');
const TEMAS = reglas.pagina.temas;

test('E1 · temaDe: la sección que más se repite, la de la IA manda, las palabras del título y «Sin tema»', () => {
  const secciones = ['policiales', 'sociedad', 'policiales'];
  assert.equal(temaDe({ seccionIA: '', secciones, titulo: 'Detienen a dos hombres…' }, TEMAS), 'Policiales');
  assert.equal(temaDe({ seccionIA: 'economía', secciones, titulo: 'Detienen a dos hombres…' }, TEMAS), 'Economía');
  const conPetroleo = [...TEMAS, { nombre: 'Petróleo', secciones: [], palabras: ['vaca muerta'] }];
  assert.equal(temaDe({ seccionIA: '', secciones: ['opinion', 'ultimas-noticias'], titulo: 'YPF anunció inversiones en Vaca Muerta' }, conPetroleo), 'Petróleo');
  assert.equal(temaDe({ seccionIA: '', secciones: [], titulo: 'Qué dijo el Papa' }, TEMAS), 'Sin tema');
});

test('E1 · temaDe: empate entre dos temas → el que va primero en la config; la sección se compara normalizada', () => {
  assert.equal(temaDe({ secciones: ['deportes', 'politica'], titulo: 'x' }, TEMAS), 'Política');
  assert.equal(temaDe({ secciones: ['Policiales---Judiciales'], titulo: 'x' }, TEMAS), 'Policiales');
  assert.equal(temaDe({ seccionIA: 'algo-que-no-es-tema', secciones: ['cultura'], titulo: 'x' }, TEMAS), 'Espectáculos');
});

test('E2 · lista.pagina sale de reglas.pagina, sin secciones ni palabras', () => {
  const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas: { ...reglas, pagina: { ...reglas.pagina, escalon: 'normal' } } });
  assert.equal(e.pagina.escalon, 'normal');
  assert.equal(e.pagina.nombre, '7M');
  assert.equal(e.pagina.temas.length, 6);
  for (const t of e.pagina.temas) assert.deepEqual(Object.keys(t), ['nombre', 'prendido']);
  assert.equal(e.pagina.motivos.length, 7);
  assert.equal(e.pagina.motivos[6].texto, 'Otro motivo…');
});

test('E2 · sin reglas.pagina (o con un escalón que no existe): plus y los seis temas y siete motivos por defecto', () => {
  const { pagina, ...sinPagina } = reglas;
  const e = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas: sinPagina });
  assert.equal(e.pagina.escalon, 'plus');
  assert.equal(e.pagina.nombre, '7M');
  assert.deepEqual(e.pagina.temas.map(t => t.nombre), ['Política', 'Economía', 'Sociedad', 'Policiales', 'Deportes', 'Espectáculos']);
  assert.deepEqual(e.pagina.motivos.map(m => m.clave), ['dato', 'tengo', 'opinion', 'bloque', 'vieja', 'publico', 'otro']);
  const raro = armarEntrega(decididoVacio(), { ahora: AHORA, portales, reglas: { ...reglas, pagina: { escalon: 'oro' } } });
  assert.equal(raro.pagina.escalon, 'plus');
});

test('E2 · cada tarjeta de noticia trae tema y hora; los avisos no traen tema', () => {
  const ctx = { portales, reglas, firmas: dia.firmas, ahora: dia.ahora };
  const p = N.preparar(dia.notas, ctx);
  const d = N.decidir(p.candidatos, dia.juicios, { ...ctx, elegiblesAMano: p.elegiblesAMano });
  const nombres = [...reglas.pagina.temas.map(t => t.nombre), 'Sin tema'];
  const aviso = { id: 'scpl-1', titulo: 'Corte', resumen: '', fuentes: [{ medio: 'SCPL', url: 'https://scpl.coop/1' }], servicio: 'agua', programado: true, barrios: [] };
  const e = armarEntrega(d, { ahora: AHORA, portales, reglas, avisos: [aviso] });
  const todas = ['nacional', 'internacional'].flatMap(b => [...e.bloques[b].noticias, ...e.bloques[b].aMano]);
  assert.ok(todas.length > 10);
  for (const t of todas) {
    assert.ok(nombres.includes(t.tema), t.tema);
    assert.ok(!Number.isNaN(Date.parse(t.hora)) && new Date(t.hora).toISOString() === t.hora, t.id);
  }
  assert.equal('tema' in e.bloques.avisos.noticias[0], false);
});

test('una salida con secciones y primera: el tema sale de sus notas y la hora es la de su primera nota', () => {
  const d = decididoVacio();
  d.nacionales = [salida('n1', [{ portal: 'clarin.com', url: 'https://www.clarin.com/a' }], { primera: '2026-10-04T12:00:00.000Z', secciones: ['policiales', 'sociedad', 'policiales'] })];
  const e = armarEntrega(d, { ahora: AHORA, portales, reglas });
  assert.equal(e.bloques.nacional.noticias[0].tema, 'Policiales');
  assert.equal(e.bloques.nacional.noticias[0].hora, '2026-10-04T12:00:00.000Z');
});
