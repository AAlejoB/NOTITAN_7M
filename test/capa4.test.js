'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const C = require('../src/capa4.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const casosIA = require('./casos-ia.json');

const AHORA = '2026-10-04T11:00:00.000Z';
const hace = h => new Date(Date.parse(AHORA) - h * 3600e3).toISOString();
const T = 'El Gobierno anunció un nuevo plan de empleo para jóvenes en todo el país';
const CINCO = ['clarin.com', 'lanacion.com.ar', 'infobae.com', 'pagina12.com.ar', 'perfil.com'];
const nota = (portal, extra = {}) => ({
  id: `${portal}:1`, titulo: T, bajada: '', url: `https://www.${portal}/politica/plan-empleo`, portal, fecha: hace(2),
  seccion: 'politica', etiqueta: '', firma: '', ...extra,
});
const cincoNotas = (extra = {}) => CINCO.map(p => nota(p, extra));
const ctx = { ahora: AHORA, feeds: [], portales, reglas, firmas: [] };
const JUICIO = '{"datoNuevo": true, "fuenteConNombre": true, "interesPublico": true, "bloque": "nacional", "desmentido": false, "seccion": "política", "pais": "", "porque": {}}';

const rss = items => `<?xml version="1.0"?><rss version="2.0"><channel><title>A</title>${items}</channel></rss>`;
const item = (titulo, link) => `<item><title>${titulo}</title><link>${link}</link><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>`;
const feedsAB = [
  { nombre: 'A', dominio: 'a.com', url: 'https://a.com/rss' },
  { nombre: 'B', dominio: 'b.com', url: 'https://b.com/rss' },
];
const portalesAB = [
  { dominio: 'a.com', nombre: 'A', grupo: 'A', ambito: 'nacional' },
  { dominio: 'b.com', nombre: 'B', grupo: 'B', ambito: 'nacional' },
];

// mitadUno y después mitadDos con estas respuestas (texto por cada pregunta).
function vuelta(guardado, textos, extra = {}) {
  const u = C.mitadUno({ cuerpos: [], guardado, ...ctx, ...extra });
  const respuestas = u.preguntas.map((q, k) => ({ id: q.id, texto: typeof textos === 'function' ? textos(q, k) : textos }));
  const d = C.mitadDos({ guardado: u.guardado, lectura: u.lectura, acumulado: u.acumulado, respuestas, ...ctx, ...extra });
  return { u, d };
}

/* ───────── mitadUno ───────── */

test('E1: un feed anda y otro no: el caído se avisa, se acumulan 2 notas y no hay nada que preguntar', () => {
  const cuerpos = [
    { nombre: 'A', status: 200, xml: rss(item('Primera nota de prueba del portal A', 'https://a.com/x/1') + item('Segunda nota distinta del portal A', 'https://a.com/x/2')) },
    { nombre: 'B', status: 0, error: 'ETIMEDOUT' },
  ];
  const u = C.mitadUno({ cuerpos, guardado: null, ahora: AHORA, feeds: feedsAB, portales: portalesAB, reglas, firmas: [] });
  assert.equal(u.lectura.feeds[0].estado, 'ok');
  assert.equal(u.lectura.feeds[1].estado, 'error');
  assert.ok(u.lectura.avisos.includes('Feed sin leer: B (ETIMEDOUT)'));
  assert.equal(u.guardado.notas.length, 2);
  assert.deepEqual(u.guardado.juicios, []);
  assert.equal(u.guardado.ultimoAviso, null);
  assert.deepEqual(u.preguntas, []);
  assert.equal(u.resumen.aPreguntar, 0);
  assert.deepEqual(u.acumulado.agregadas.length, 2);
});

test('mitadUno: un HTTP 404 es un feed caído y la misma nota en dos feeds se cuenta una vez', () => {
  const xml = rss(item('Nota compartida entre dos feeds del mismo portal', 'https://a.com/x/1'));
  const feeds = [feedsAB[0], { nombre: 'A2', dominio: 'a.com', url: 'https://a.com/rss2' }, feedsAB[1]];
  const u = C.mitadUno({ cuerpos: [{ status: 200, xml }, { status: 200, xml }, { status: 404, xml: '' }], guardado: null, ahora: AHORA, feeds, portales: portalesAB, reglas });
  assert.equal(u.guardado.notas.length, 1);
  assert.equal(u.lectura.feeds[1].descartadas.url_repetida, 1);
  assert.equal(u.lectura.feeds[2].detalle, 'HTTP 404');
});

test('E2: 5 notas guardadas del mismo hecho en 5 medios: 1 pregunta; con un juicio guardado, ninguna', () => {
  const u = C.mitadUno({ cuerpos: [], guardado: { notas: cincoNotas(), juicios: [], ultimoAviso: null }, ...ctx });
  assert.equal(u.preguntas.length, 1);
  assert.ok(u.preguntas[0].texto.startsWith('Sos el editor que revisa noticias para 7M'));
  const ultimas = u.preguntas[0].texto.split('\n').slice(-5);
  assert.equal(ultimas.length, 5);
  assert.ok(ultimas.every(l => l.startsWith('- ') && l.includes(T)));
  assert.deepEqual(u.preguntas[0].desmentidos, []);
  assert.equal(u.preguntas[0].viejo, false);
  assert.equal(u.resumen.candidatos, 1);

  const juicios = [{ urls: [cincoNotas()[2].url], juicio: {}, fecha: hace(1), desmentidosVistos: [], viejo: false }];
  const u2 = C.mitadUno({ cuerpos: [], guardado: { notas: cincoNotas(), juicios, ultimoAviso: null }, ...ctx });
  assert.deepEqual(u2.preguntas, []);
  assert.equal(u2.resumen.conJuicioGuardado, 1);
});

test('mitadUno: saca los juicios de más de 48 h y deja los de 10 h', () => {
  const juicios = [
    { urls: ['https://x.com/viejo'], juicio: {}, fecha: hace(50), desmentidosVistos: [], viejo: false },
    { urls: ['https://x.com/nuevo'], juicio: {}, fecha: hace(10), desmentidosVistos: [], viejo: false },
  ];
  const u = C.mitadUno({ cuerpos: [], guardado: { notas: [], juicios, ultimoAviso: null }, ...ctx });
  assert.deepEqual(u.guardado.juicios.map(j => j.urls[0]), ['https://x.com/nuevo']);
});

test('mitadUno: un hecho viejo con un juicio de cuando no era viejo se vuelve a preguntar; con uno ya viejo, no', () => {
  const notas = cincoNotas({ fecha: hace(30) });
  const guardado = viejo => ({ notas, juicios: [{ urls: [notas[0].url], juicio: {}, fecha: hace(5), desmentidosVistos: [], viejo }], ultimoAviso: null });
  const u = C.mitadUno({ cuerpos: [], guardado: guardado(false), ...ctx });
  assert.equal(u.preguntas.length, 1);
  assert.equal(u.preguntas[0].viejo, true);
  assert.equal(C.mitadUno({ cuerpos: [], guardado: guardado(true), ...ctx }).preguntas.length, 0);
});

/* ───────── mitadDos ───────── */

test('E3: la IA contesta: se guarda el juicio con las 5 urls y la noticia sale sin provisorio', () => {
  const { d } = vuelta({ notas: cincoNotas(), juicios: [], ultimoAviso: null }, JUICIO);
  assert.equal(d.guardado.juicios.length, 1);
  assert.deepEqual(d.guardado.juicios[0].urls.sort(), cincoNotas().map(n => n.url).sort());
  assert.equal(d.guardado.juicios[0].fecha, AHORA);
  assert.equal(d.guardado.juicios[0].viejo, false);
  assert.equal(d.lista.bloques.nacional.noticias.length, 1);
  assert.equal(d.lista.sinIA, false);
  assert.equal(d.lista.provisorias, 0);
  assert.equal(d.lista.cliente, 'Canal 2');
  assert.equal(d.lista.paginaViejaMinutos, 60);
  assert.deepEqual(d.linea.ia, { preguntadas: 1, contestadas: 1, fallidas: 0 });
  assert.equal(d.linea.provisorias, 0);
  assert.equal(d.linea.tardoMs, null);
  assert.equal(d.avisar.hayQue, false);
});

test('E4: la IA no contesta (null o «no sé»): sale igual con el bloque provisorio, sinIA y aviso', () => {
  for (const texto of [null, 'no sé']) {
    const { d } = vuelta({ notas: cincoNotas(), juicios: [], ultimoAviso: null }, texto);
    assert.deepEqual(d.guardado.juicios, []);
    assert.equal(d.lista.bloques.nacional.noticias.length, 1);
    assert.equal(d.lista.sinIA, true);
    assert.equal(d.lista.provisorias, 1);
    assert.deepEqual(d.linea.ia, { preguntadas: 1, contestadas: 0, fallidas: 1 });
    assert.equal(d.avisar.hayQue, true);
    assert.ok(d.avisar.asunto.startsWith('7M · la IA no contestó'));
    assert.equal(d.avisar.ultimoAviso, AHORA);
    assert.equal(d.guardado.ultimoAviso, AHORA);
    assert.match(d.avisar.texto, /Preguntas a la IA: 1, contestadas 0, fallaron 1/);
  }
});

test('E5: con un aviso de hace 10 minutos, la misma falla no avisa y ultimoAviso no cambia', () => {
  const { d } = vuelta({ notas: cincoNotas(), juicios: [], ultimoAviso: hace(10 / 60) }, null);
  assert.equal(d.avisar.hayQue, false);
  assert.equal(d.avisar.ultimoAviso, hace(10 / 60));
  const { d: d2 } = vuelta({ notas: cincoNotas(), juicios: [], ultimoAviso: hace(61 / 60) }, null);
  assert.equal(d2.avisar.hayQue, true);
});

test('mitadDos: con dos noticias y una sola respuesta, sale una provisoria y sinIA es false', () => {
  const otro = 'Terremoto de magnitud siete sacude la costa de Japón y activa alerta de tsunami';
  const notas = [...cincoNotas(), ...CINCO.map(p => nota(p, { id: `${p}:2`, titulo: otro, url: `https://www.${p}/mundo/terremoto` }))];
  const { u, d } = vuelta({ notas, juicios: [], ultimoAviso: null }, (q, k) => (k === 0 ? JUICIO : null));
  assert.equal(u.preguntas.length, 2);
  assert.equal(d.lista.sinIA, false);
  assert.equal(d.lista.provisorias, 1);
  assert.deepEqual(d.linea.ia, { preguntadas: 2, contestadas: 1, fallidas: 1 });
  assert.equal(d.avisar.hayQue, false, 'contestó una: no es «la IA no contestó»');
});

test('mitadDos: un juicio nuevo reemplaza al guardado que compartía una url, y la segunda vuelta ya no pregunta', () => {
  const notas = cincoNotas();
  const viejo = { urls: [notas[0].url], juicio: {}, fecha: hace(5), desmentidosVistos: ['https://x.com/d'], viejo: false };
  const d = C.mitadDos({ guardado: { notas, juicios: [viejo], ultimoAviso: null }, lectura: { feeds: [], avisos: [] },
    acumulado: { agregadas: [], repetidas: [], borradas: [] }, respuestas: [{ id: C.mitadUno({ cuerpos: [], guardado: { notas, juicios: [] }, ...ctx }).preguntas[0].id, texto: JUICIO }], ...ctx });
  assert.equal(d.guardado.juicios.length, 1);
  assert.equal(d.guardado.juicios[0].urls.length, 5);
  const u2 = C.mitadUno({ cuerpos: [], guardado: d.guardado, ...ctx });
  assert.equal(u2.resumen.aPreguntar, 0);
  assert.equal(u2.resumen.conJuicioGuardado, 1);
});

test('mitadDos: con feeds y ninguno ok, avisa «ningún portal contestó» con los caídos en el texto', () => {
  const extra = { feeds: feedsAB, portales: portalesAB };
  const u = C.mitadUno({ cuerpos: [{ status: 0, error: 'ETIMEDOUT' }, { status: 503 }], guardado: null, ahora: AHORA, reglas, ...extra });
  const d = C.mitadDos({ guardado: u.guardado, lectura: u.lectura, acumulado: u.acumulado, respuestas: [], ahora: AHORA, reglas, ...extra });
  assert.equal(d.avisar.hayQue, true);
  assert.ok(d.avisar.asunto.startsWith('7M · ningún portal contestó · '));
  assert.match(d.avisar.texto, /- A: ETIMEDOUT/);
  assert.match(d.avisar.texto, /- B: HTTP 503/);
  assert.equal(d.lista.sinIA, false, 'sin juicios usados no es «sin IA»');
  assert.equal(d.linea.feeds.ok, 0);
});

test('resumenEnPantalla: las líneas de siempre, con la carpeta de datos', () => {
  const { d } = vuelta({ notas: cincoNotas(), juicios: [], ultimoAviso: null }, JUICIO);
  const r = C.resumenEnPantalla({ linea: d.linea, carpeta: '/datos', codigo: 0 });
  assert.match(r[0], /^VUELTA · /);
  assert.equal(r[4], 'Confirmados: 1 nacionales + 0 internacionales');
  assert.equal(r[7], 'Escribí: /datos/pagina/lista.json');
});

/* ───────── escribir ───────── */

test('escribir: deja la página y un renglón en vueltas.jsonl; dos veces, dos renglones', () => {
  const c = join(mkdtempSync(join(tmpdir(), 'notitan-capa4-')), 'datos');
  const { d } = vuelta({ notas: cincoNotas(), juicios: [], ultimoAviso: null }, JUICIO);
  C.escribir({ carpetaDatos: c, lista: d.lista, linea: d.linea });
  assert.deepEqual(readdirSync(join(c, 'pagina')).sort(), ['index.html', 'lista.json', 'logica.js']);
  assert.equal(JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8')).generadaEn, AHORA);
  const renglones = () => readFileSync(join(c, 'vueltas.jsonl'), 'utf8').trim().split('\n');
  assert.equal(renglones().length, 1);
  C.escribir({ carpetaDatos: c, lista: d.lista, linea: d.linea });
  assert.equal(renglones().length, 2);
  assert.deepEqual(JSON.parse(renglones()[1]).ia, { preguntadas: 1, contestadas: 1, fallidas: 0 });
});

/* ───────── la API y la prueba de la unión ───────── */

test('cuerpoIA y textoDeRespuesta: el cuerpo sale de reglas.ia y el texto de content[0].text', () => {
  assert.deepEqual(C.cuerpoIA('hola', { reglas }), { model: reglas.ia.modelo, max_tokens: 400, temperature: 0, messages: [{ role: 'user', content: 'hola' }] });
  assert.equal(C.cuerpoIA('x', { reglas, tipo: 'union' }).max_tokens, 200);
  assert.equal(C.textoDeRespuesta({ content: [{ type: 'text', text: '{"a":1}' }] }), '{"a":1}');
  assert.equal(C.textoDeRespuesta({ error: { message: 'boom' } }), null);
  assert.equal(C.textoDeRespuesta({}), null);
  assert.equal(C.textoDeRespuesta(null), null);
});

test('preguntaUnionDePrueba: la pregunta de unión con un título en cada hecho', () => {
  const t = C.preguntaUnionDePrueba(casosIA.union[0], { portales });
  assert.ok(t.startsWith('Sos el editor que revisa noticias para 7M. Te paso dos hechos'));
  assert.match(t, /Hecho A:\n- prueba\.invalid · 04\/10 12:00 · Fórmula 1: qué dijo Colapinto/);
  assert.ok(t.endsWith(casosIA.union[0].b));
});

test('prueba de la unión: 3 ítems por caso sin dudoso; pasa solo si acierta las 3 veces en todos', () => {
  const items = C.itemsDePrueba(casosIA, { portales, reglas });
  const cuentan = casosIA.union.filter(c => !c.dudoso).length;
  assert.equal(items.length, cuentan * 3);
  assert.deepEqual(items.slice(0, 3).map(i => i.intento), [1, 2, 3]);
  assert.equal(items[0].cuerpoIA.max_tokens, 200);
  const responder = (item, misma) => ({ content: [{ type: 'text', text: JSON.stringify({ misma, porque: 'x' }) }] });
  const bien = C.resultadoPrueba(casosIA, items, items.map(i => responder(i, casosIA.union[i.caso].misma)));
  assert.equal(bien.at(-1).resumen, 'pasa');
  assert.equal(bien.at(-1).aciertos, cuentan * 3);
  assert.equal(bien.length, cuentan + 1);
  // Un solo error (una respuesta ilegible) y no pasa.
  const resp = items.map(i => responder(i, casosIA.union[i.caso].misma));
  resp[4] = { content: [{ type: 'text', text: 'no sé' }] };
  const mal = C.resultadoPrueba(casosIA, items, resp);
  assert.equal(mal.at(-1).resumen, 'no pasa');
  assert.deepEqual(mal[1].intentos, [true, false, true]);
  assert.equal(mal[1].pasa, false);
});
