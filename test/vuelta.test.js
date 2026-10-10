'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, utimesSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { vuelta, leerOpciones } = require('../scripts/vuelta.js');
const { ErrorDeUso } = require('../scripts/leer.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');

const AHORA = '2026-10-04T11:00:00.000Z';
const NACIONALES = ['clarin.com', 'lanacion.com.ar', 'infobae.com', 'pagina12.com.ar', 'perfil.com'];
const INTERNACIONALES = ['bbc.com', 'dw.com', 'france24.com', 'elpais.com', 'theguardian.com'];
const T_NAC = 'El Gobierno anunció un nuevo plan de empleo para jóvenes en todo el país';
const T_INT = 'Terremoto de magnitud siete sacude la costa de Japón y activa alerta de tsunami';

const rss = items => `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Feed</title>${items}</channel></rss>`;
const item = (titulo, link) => `<item><title>${titulo}</title><link>${link}</link><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>`;

// Un feed por portal. Cada portal nacional trae la nota del hecho nacional (sección «politica»);
// cada portal internacional, la del hecho internacional (sección «mundo»). Los dos hechos llegan a 5 grupos.
const feedDe = (dominio, i) => ({ nombre: 'Feed ' + dominio, dominio, url: `https://f${i}.test/rss`, ambito: 'x' });
const feeds = [...NACIONALES, ...INTERNACIONALES].map(feedDe);
const xmlDe = (dominio, i) => rss(NACIONALES.includes(dominio)
  ? item(T_NAC, `https://www.${dominio}/politica/plan-empleo-${i}`)
  : item(T_INT, `https://www.${dominio}/mundo/terremoto-japon-${i}`));
const respuestas = () => Object.fromEntries(feeds.map((f, i) => [f.url, () => ({ status: 200, text: async () => xmlDe(f.dominio, i) })]));
// Como en test/lector.test.js: una función por url; un Error significa que el feed no responde.
const fetchPorUrl = (mapa, llamadas = []) => async url => {
  llamadas.push(url);
  const r = mapa[url];
  if (r instanceof Error) throw r;
  return r();
};

const carpeta = () => mkdtempSync(join(tmpdir(), 'notitan-vuelta-'));
const lineas = c => readFileSync(join(c, 'vueltas.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const correr = (c, extra = {}) => vuelta({ carpeta: c, ahora: AHORA, fetch: fetchPorUrl(respuestas()), feeds, portales, reglas, firmas: [], ...extra });

test('E4: carpeta vacía y todos los feeds andan: notas, página, una línea y sin candado', async () => {
  const c = carpeta();
  const r = await correr(c);
  assert.equal(r.codigo, 0);
  assert.deepEqual(readdirSync(c).sort(), ['notas.json', 'pagina', 'vueltas.jsonl']);
  assert.deepEqual(readdirSync(join(c, 'pagina')).sort(), ['index.html', 'lista.json', 'logica.js']);
  assert.equal(existsSync(join(c, 'vuelta.lock')), false);
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.equal(lista.ejemplo, false);
  assert.equal(lista.sinIA, true);
  assert.equal(lista.generadaEn, AHORA);
  const l = lineas(c);
  assert.equal(l.length, 1);
  assert.deepEqual(Object.keys(l[0]), ['hora', 'duracionMs', 'feeds', 'notas', 'hechos', 'confirmados', 'cuatroDeCinco', 'lista', 'avisos']);
  assert.deepEqual(Object.keys(l[0].feeds), ['ok', 'mal', 'caidos']);
  assert.deepEqual(Object.keys(l[0].notas), ['leidas', 'nuevas', 'repetidas', 'borradas', 'acumuladas']);
  assert.deepEqual(Object.keys(l[0].hechos), ['total', 'porGrupos']);
  assert.deepEqual(Object.keys(l[0].hechos.porGrupos), ['1', '2', '3', '4', '5+']);
  assert.deepEqual(Object.keys(l[0].confirmados[0]), ['id', 'bloque', 'grupos', 'via', 'viejo', 'titulo']);
  assert.deepEqual(Object.keys(l[0].lista), ['nacional', 'internacional', 'aManoNacional', 'aManoInternacional', 'noFresco']);
  assert.equal(l[0].hora, AHORA);
  assert.equal(typeof l[0].duracionMs, 'number');
  assert.equal(l[0].feeds.ok, 10);
  assert.equal(l[0].notas.leidas, 10);
  assert.equal(l[0].notas.acumuladas, 10);
  assert.equal(l[0].hechos.porGrupos['5+'], 2);
  rmSync(c, { recursive: true });
});

test('E5: la misma carpeta, los mismos feeds: nada nuevo, todo repetido, dos líneas y la lista rehecha', async () => {
  const c = carpeta();
  await correr(c);
  const r = await correr(c, { ahora: '2026-10-04T11:01:00.000Z' });
  assert.equal(r.codigo, 0);
  const l = lineas(c);
  assert.equal(l.length, 2);
  assert.equal(l[1].notas.nuevas, 0);
  assert.equal(l[1].notas.repetidas, l[1].notas.leidas);
  assert.ok(l[1].notas.repetidas > 0);
  assert.equal(JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8')).generadaEn, '2026-10-04T11:01:00.000Z');
});

test('E6: un feed que no responde: se cuenta, se nombra y se avisa; el resto sigue igual', async () => {
  const c = carpeta();
  const mapa = respuestas();
  mapa[feeds[0].url] = new Error('sin red');
  const r = await correr(c, { fetch: fetchPorUrl(mapa) });
  assert.equal(r.codigo, 0);
  const [l] = lineas(c);
  assert.deepEqual(l.feeds, { ok: 9, mal: 1, caidos: ['Feed clarin.com'] });
  assert.ok(l.avisos.some(a => a.startsWith('Feed sin leer: Feed clarin.com')));
  assert.equal(l.notas.leidas, 9);
});

test('E7: ningún feed responde: código 2, nada leído, y la lista sale con lo guardado', async () => {
  const c = carpeta();
  await correr(c);
  const todosCaidos = Object.fromEntries(feeds.map(f => [f.url, new Error('sin internet')]));
  const r = await correr(c, { ahora: '2026-10-04T11:30:00.000Z', fetch: fetchPorUrl(todosCaidos) });
  assert.equal(r.codigo, 2);
  const l = lineas(c);
  assert.equal(l.length, 2, 'la línea se escribe igual');
  assert.equal(l[1].notas.leidas, 0);
  assert.equal(l[1].feeds.ok, 0);
  assert.equal(l[1].feeds.mal, 10);
  assert.equal(l[1].notas.acumuladas, 10);
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.equal(lista.bloques.nacional.noticias.length, 1, 'la lista se armó con lo guardado');
  assert.equal(lista.generadaEn, '2026-10-04T11:30:00.000Z');
});

test('candado: uno fresco corta con código 3 sin escribir; uno de hace 30 minutos se pisa', async () => {
  const c = carpeta();
  const candado = join(c, 'vuelta.lock');
  writeFileSync(candado, AHORA);
  const llamadas = [];
  const r = await correr(c, { fetch: fetchPorUrl(respuestas(), llamadas) });
  assert.equal(r.codigo, 3);
  assert.match(r.resumen[0], /^Hay otra vuelta corriendo desde las \d\d:\d\d \(vuelta\.lock\)\. No se hace nada\.$/);
  assert.deepEqual(readdirSync(c), ['vuelta.lock']);
  assert.equal(readFileSync(candado, 'utf8'), AHORA);
  assert.equal(llamadas.length, 0);

  const hace30 = new Date(Date.now() - 30 * 60000);
  utimesSync(candado, hace30, hace30);
  const r2 = await correr(c);
  assert.equal(r2.codigo, 0);
  assert.equal(existsSync(candado), false, 'el candado se borra al terminar');
  assert.equal(lineas(c).length, 1);
});

test('el candado se borra también si la vuelta falla', async () => {
  const c = carpeta();
  writeFileSync(join(c, 'notas.json'), '[{"id": "a", ');
  await assert.rejects(correr(c), ErrorDeUso);
  assert.equal(existsSync(join(c, 'vuelta.lock')), false);
});

test('notas.json roto: corta con ErrorDeUso y no aparece ni la lista ni la medición', async () => {
  const c = carpeta();
  writeFileSync(join(c, 'notas.json'), '{no es json');
  await assert.rejects(correr(c), e => e instanceof ErrorDeUso && /no es JSON válido/.test(e.message));
  assert.equal(existsSync(join(c, 'pagina')), false);
  assert.equal(existsSync(join(c, 'vueltas.jsonl')), false);
  assert.equal(readFileSync(join(c, 'notas.json'), 'utf8'), '{no es json');
});

test('--sin-leer: no llama a fetch, no cambia notas.json ni vueltas.jsonl, y rehace la lista', async () => {
  const c = carpeta();
  await correr(c);
  const notasAntes = readFileSync(join(c, 'notas.json'), 'utf8');
  const medicionAntes = readFileSync(join(c, 'vueltas.jsonl'), 'utf8');
  writeFileSync(join(c, 'pagina', 'lista.json'), '{}');
  const llamadas = [];
  const r = await correr(c, { sinLeer: true, ahora: '2026-10-04T12:00:00.000Z', fetch: fetchPorUrl(respuestas(), llamadas) });
  assert.equal(r.codigo, 0);
  assert.equal(llamadas.length, 0);
  assert.equal(readFileSync(join(c, 'notas.json'), 'utf8'), notasAntes);
  assert.equal(readFileSync(join(c, 'vueltas.jsonl'), 'utf8'), medicionAntes);
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.equal(lista.generadaEn, '2026-10-04T12:00:00.000Z');
  assert.equal(lista.sinIA, true);
});

test('--sin-leer sin notas.json corta con un mensaje y no escribe nada', async () => {
  const c = carpeta();
  await assert.rejects(correr(c, { sinLeer: true }), ErrorDeUso);
  assert.deepEqual(readdirSync(c), []);
});

test('el bloque provisorio: el hecho de portales internacionales va a internacionales y el de medios argentinos a nacionales', async () => {
  const c = carpeta();
  await correr(c);
  const [l] = lineas(c);
  const porTitulo = Object.fromEntries(l.confirmados.map(x => [x.titulo, x]));
  assert.equal(porTitulo[T_INT].bloque, 'internacional');
  assert.equal(porTitulo[T_NAC].bloque, 'nacional');
  assert.equal(porTitulo[T_INT].via, 'A');
  assert.equal(porTitulo[T_NAC].grupos, 5);
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.deepEqual(lista.bloques.internacional.noticias.map(n => n.titulo), [T_INT]);
  assert.deepEqual(lista.bloques.nacional.noticias.map(n => n.titulo), [T_NAC]);
  assert.deepEqual(l.lista, { nacional: 1, internacional: 1, aManoNacional: 0, aManoInternacional: 0, noFresco: 0 });
});

test('una sección «mundo» en medios argentinos también da internacional', async () => {
  const c = carpeta();
  const mapa = Object.fromEntries(feeds.slice(0, 5).map((f, i) => [f.url, () => ({ status: 200, text: async () => rss(item(T_INT, `https://www.${f.dominio}/mundo/terremoto-japon-${i}`)) })]));
  const r = await correr(c, { fetch: fetchPorUrl({ ...Object.fromEntries(feeds.map(f => [f.url, new Error('no')])), ...mapa }) });
  assert.equal(r.codigo, 0);
  assert.equal(lineas(c)[0].confirmados[0].bloque, 'internacional');
});

test('opciones: --cada tiene que ser un entero de 1 o más; --carpeta y --cada necesitan valor', () => {
  assert.deepEqual(leerOpciones([]), { carpeta: 'datos', cada: null, sinLeer: false });
  assert.deepEqual(leerOpciones(['--carpeta', 'x', '--cada', '30', '--sin-leer']), { carpeta: 'x', cada: 30, sinLeer: true });
  for (const malas of [['--cada'], ['--cada', 'abc'], ['--cada', '1.5'], ['--cada', '0'], ['--cada', '--sin-leer'], ['--carpeta']]) {
    assert.throws(() => leerOpciones(malas), ErrorDeUso, malas.join(' '));
  }
});
