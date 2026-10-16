'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, utimesSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { vuelta, leerOpciones, cargarConfig } = require('../scripts/vuelta.js');
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
  assert.deepEqual(Object.keys(l[0].confirmados[0]), ['id', 'bloque', 'grupos', 'via', 'viejo', 'medios', 'urls', 'titulo']);
  // Cada confirmado trae las urls de sus notas, sin repetir (con ellas medir reconoce la misma noticia).
  for (const c of l[0].confirmados) assert.equal(c.urls.length, new Set(c.urls).size);
  assert.ok(l[0].confirmados.every(c => c.urls.length >= 5));
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

test('opciones: --cada tiene que ser un entero de 1 o más; --carpeta, --cada y --config necesitan valor', () => {
  assert.deepEqual(leerOpciones([]), { carpeta: 'datos', cada: null, sinLeer: false, config: null, zona: null });
  assert.deepEqual(leerOpciones(['--carpeta', 'x', '--cada', '30', '--sin-leer']), { carpeta: 'x', cada: 30, sinLeer: true, config: null, zona: null });
  assert.equal(leerOpciones(['--config', 'config/zona']).config, 'config/zona');
  for (const malas of [['--cada'], ['--cada', 'abc'], ['--cada', '1.5'], ['--cada', '0'], ['--cada', '--sin-leer'], ['--carpeta'], ['--config'], ['--config', '--sin-leer']]) {
    assert.throws(() => leerOpciones(malas), ErrorDeUso, malas.join(' '));
  }
});

/* ───────── --config: otra lista de feeds, portales y reglas ───────── */

const T_LOCAL = 'El intendente inauguró la planta de agua en Comodoro';
const feedsLocales = [
  { nombre: 'Feed A', dominio: 'a.com', grupo: 'A', ambito: 'nacional', url: 'https://fa.test/rss' },
  { nombre: 'Feed B', dominio: 'b.com', grupo: 'B', ambito: 'nacional', url: 'https://fb.test/rss' },
];
const portalesLocales = [
  { dominio: 'a.com', grupo: 'A', ambito: 'nacional', tipo: 'medio' },
  { dominio: 'b.com', grupo: 'B', ambito: 'nacional', tipo: 'medio' },
];
const carpetaConfig = (archivos) => {
  const c = mkdtempSync(join(tmpdir(), 'notitan-config-'));
  for (const [nombre, contenido] of Object.entries(archivos)) writeFileSync(join(c, nombre), JSON.stringify(contenido));
  return c;
};
const configLocal = () => carpetaConfig({
  'feeds.json': { feeds: feedsLocales },
  'portales.json': { portales: portalesLocales },
  'reglas.json': { minGrupos: 2, aMano: { activa: false } },
});

test('cargarConfig: feeds y portales de la carpeta; reglas.json pisa claves enteras; sin firmas.json, ninguna', () => {
  const c = cargarConfig(configLocal());
  assert.deepEqual(c.feeds, feedsLocales);
  assert.deepEqual(c.portales, portalesLocales);
  assert.equal(c.reglas.minGrupos, 2);
  assert.deepEqual(c.reglas.aMano, { activa: false });
  assert.equal(c.reglas.umbralSimilitud, reglas.umbralSimilitud);
  assert.equal(c.reglas.umbralSimilitud, 0.3);
  assert.deepEqual(c.firmas, []);
});

test('cargarConfig: sin feeds.json (o sin la carpeta) corta con ErrorDeUso', () => {
  const c = carpetaConfig({ 'portales.json': { portales: portalesLocales } });
  assert.throws(() => cargarConfig(c), e => e instanceof ErrorDeUso && /feeds\.json no está/.test(e.message));
  assert.throws(() => cargarConfig(join(tmpdir(), 'notitan-no-existe-' + Date.now())), ErrorDeUso);
});

test('--config: con 2 medios alcanza, la confirmada lleva sus medios y no hay 1/2 a mano', async () => {
  const { feeds: fs, portales: ps, reglas: rs } = cargarConfig(configLocal());
  const c = carpeta();
  const xml = (d) => rss(`<item><title>${T_LOCAL}</title><link>https://www.${d}/locales/planta-agua</link><description>Una bajada de prueba.</description><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>`);
  const mapa = { 'https://fa.test/rss': () => ({ status: 200, text: async () => xml('a.com') }), 'https://fb.test/rss': () => ({ status: 200, text: async () => xml('b.com') }) };
  const r = await vuelta({ carpeta: c, ahora: AHORA, fetch: fetchPorUrl(mapa), feeds: fs, portales: ps, reglas: rs, firmas: [] });
  const [l] = lineas(c);
  assert.equal(l.confirmados.length, 1);
  assert.equal(l.confirmados[0].grupos, 2);
  assert.deepEqual(l.confirmados[0].medios, ['A', 'B']);
  assert.deepEqual(l.cuatroDeCinco, []);
  assert.ok(r.resumen.includes('Confirmados: 1 nacionales + 0 internacionales'));
});

test('una 4/5 lleva en la línea las urls de sus 4 notas', async () => {
  const c = carpeta();
  const mapa = respuestas();
  mapa[feeds[4].url] = new Error('ECONNRESET');
  await correr(c, { fetch: fetchPorUrl(mapa) });
  const [l] = lineas(c);
  assert.equal(l.cuatroDeCinco.length, 1);
  assert.deepEqual(Object.keys(l.cuatroDeCinco[0]), ['id', 'bloque', 'grupos', 'conFirma', 'medios', 'urls', 'titulo']);
  assert.equal(l.cuatroDeCinco[0].urls.length, 4);
  rmSync(c, { recursive: true });
});

/* ───────── --zona: lo nacional y la zona en la misma vuelta ───────── */

test('--zona y --config juntas cortan con ErrorDeUso; --zona necesita valor', () => {
  assert.throws(() => leerOpciones(['--zona', 'config/zona', '--config', 'config/zona']), e => e instanceof ErrorDeUso && e.message === '--zona y --config no van juntas.');
  assert.throws(() => leerOpciones(['--zona']), ErrorDeUso);
  assert.equal(leerOpciones(['--zona', 'config/zona', '--cada', '30']).zona, 'config/zona');
});

// La zona de prueba: dos portales de Comodoro (zona local) que traen la misma noticia.
const configZona = () => carpetaConfig({
  'feeds.json': { feeds: feedsLocales },
  'portales.json': { portales: portalesLocales.map(p => ({ ...p, zona: 'local' })) },
  'reglas.json': require('../config/zona/reglas.json'),
});
const mapaZona = () => {
  const xml = d => rss(`<item><title>${T_LOCAL}</title><link>https://www.${d}/locales/planta-agua</link><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>`);
  return { 'https://fa.test/rss': () => ({ status: 200, text: async () => xml('a.com') }), 'https://fb.test/rss': () => ({ status: 200, text: async () => xml('b.com') }) };
};

test('--zona: lista.json con orden de cuatro, zona/notas.json guardado y vueltas.jsonl con zona.lista', async () => {
  const c = carpeta();
  const zona = cargarConfig(configZona(), '--zona');
  const r = await correr(c, { fetch: fetchPorUrl({ ...respuestas(), ...mapaZona() }), zona });
  assert.equal(r.codigo, 0);
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.deepEqual(lista.orden, ['local', 'chubut', 'nacional', 'internacional']);
  assert.equal(lista.bloques.local.nombre, 'Comodoro');
  assert.equal(lista.bloques.local.noticias.length, 1);
  assert.equal(lista.bloques.local.noticias[0].etiqueta, 'Confirmada por 2 medios locales');
  assert.equal(lista.bloques.nacional.noticias.length, 1, 'lo nacional sigue igual');
  assert.equal(JSON.parse(readFileSync(join(c, 'zona', 'notas.json'), 'utf8')).length, 2);
  const [l] = lineas(c);
  assert.deepEqual(Object.keys(l.zona), ['feeds', 'notas', 'hechos', 'confirmados', 'lista']);
  assert.deepEqual(l.zona.lista, { local: 1, chubut: 0 });
  assert.deepEqual(l.zona.feeds, { ok: 2, mal: 0, caidos: [] });
  assert.equal(l.zona.confirmados[0].anillo, 'local');
  assert.deepEqual(Object.keys(l.zona.confirmados[0]), ['id', 'anillo', 'grupos', 'medios', 'urls', 'titulo', 'tambienNacional', 'viejo']);
  assert.equal(l.zona.confirmados[0].urls.length, 2);
  assert.ok(r.resumen.includes('Zona · feeds: 2 OK · 0 caídos'));
  assert.ok(r.resumen.includes('Zona · lista: 1 Comodoro + 0 Chubut · también nacionales: 0'));
});

test('sin --zona la línea no lleva zona y lista.json trae orden de dos', async () => {
  const c = carpeta();
  await correr(c);
  const [l] = lineas(c);
  assert.equal('zona' in l, false);
  assert.deepEqual(JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8')).orden, ['nacional', 'internacional']);
});

test('--zona con --sin-leer: usa zona/notas.json guardado, no lo reescribe y arma la lista con orden de cuatro', async () => {
  const c = carpeta();
  const zona = cargarConfig(configZona(), '--zona');
  await correr(c, { fetch: fetchPorUrl({ ...respuestas(), ...mapaZona() }), zona });
  const antes = readFileSync(join(c, 'zona', 'notas.json'), 'utf8');
  const r = await correr(c, { fetch: async () => { throw new Error('no tenía que leer'); }, zona, sinLeer: true });
  assert.equal(readFileSync(join(c, 'zona', 'notas.json'), 'utf8'), antes);
  assert.deepEqual(JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8')).orden, ['local', 'chubut', 'nacional', 'internacional']);
  assert.ok(r.resumen.includes('Zona · feeds: no se leyeron'));
});

/* ───────── --zona con avisos.json: el bloque Avisos ───────── */

const LISTADO_SCPL = `<html><body>
<article class="listSeccion"><h2><a href="/index.php/site/ver-nota?id=2898">CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR TAREAS PROGRAMADAS DE MANTENIMIENTO</a></h2><div class="metadata">03-10-2026</div></article>
<article class="listSeccion"><h2><a href="/index.php/site/ver-nota?id=2897">REDUCCIÓN DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA</a></h2><div class="metadata">03-10-2026</div></article>
</body></html>`;
const NOTA_SCPL = '<div class="container-cms-page"><p>Mañana, domingo 04 de octubre, desde las 15:00hs. y por un lapso de 24hs., se interrumpe el suministro de agua en los siguientes barrios: Laprida, Güemes.</p></div><aside id="sidebar"></aside>';
const URL_LISTADO = 'https://scpl.coop/index.php/site/ver-seccion?id=2';
const URL_NOTA = 'https://scpl.coop/index.php/site/ver-nota?id=2898';
const configZonaConAvisos = () => carpetaConfig({
  'feeds.json': { feeds: feedsLocales },
  'portales.json': { portales: portalesLocales.map(p => ({ ...p, zona: 'local' })) },
  'reglas.json': require('../config/zona/reglas.json'),
  'avisos.json': require('../config/zona/avisos.json'),
});
// Los dos portales traen la noticia de siempre y además «Cortarán el agua…», que es un aviso.
const mapaZonaConAviso = () => {
  const xml = d => rss(`<item><title>${T_LOCAL}</title><link>https://www.${d}/locales/planta-agua</link><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>`
    + `<item><title>Cortarán el agua en 23 barrios de Comodoro</title><link>https://www.${d}/locales/corte-agua</link><pubDate>Sat, 03 Oct 2026 20:00:00 +0000</pubDate></item>`);
  return { 'https://fa.test/rss': () => ({ status: 200, text: async () => xml('a.com') }), 'https://fb.test/rss': () => ({ status: 200, text: async () => xml('b.com') }) };
};
const mapaScpl = () => ({ [URL_LISTADO]: () => ({ status: 200, text: async () => LISTADO_SCPL }), [URL_NOTA]: () => ({ status: 200, text: async () => NOTA_SCPL }) });

test('--zona con avisos.json: lista.json empieza con avisos, zona/avisos.json guarda 1 nota y la segunda vuelta no la vuelve a bajar', async () => {
  const c = carpeta();
  const zona = cargarConfig(configZonaConAvisos(), '--zona');
  assert.equal(zona.avisos.cronograma, null, 'sin cronograma-agua.json en la carpeta');
  const llamadas = [];
  const fetch = fetchPorUrl({ ...respuestas(), ...mapaZonaConAviso(), ...mapaScpl() }, llamadas);
  const r = await correr(c, { fetch, zona });
  assert.equal(r.codigo, 0);
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.deepEqual(lista.orden, ['avisos', 'local', 'chubut', 'nacional', 'internacional']);
  const t = lista.bloques.avisos.noticias;
  assert.equal(t.length, 1, 'el comunicado y las dos notas de portal son el mismo corte');
  assert.equal(t[0].etiqueta, 'Agua · programado');
  assert.deepEqual(t[0].medios, ['SCPL', 'A', 'B']);
  assert.deepEqual(t[0].aviso.barrios, ['Laprida', 'Güemes']);
  assert.equal(lista.bloques.local.noticias.length, 1, 'el corte no entra a Comodoro: la noticia de siempre sí');
  assert.equal(lista.bloques.local.noticias[0].titulo, T_LOCAL);
  const guardado = JSON.parse(readFileSync(join(c, 'zona', 'avisos.json'), 'utf8'));
  assert.deepEqual(guardado.notas.map(n => n.id), ['2898']);
  assert.deepEqual(Object.keys(guardado.notas[0]), ['id', 'titulo', 'fecha', 'texto', 'url', 'bajadaEn']);
  const [l] = lineas(c);
  assert.deepEqual(l.cortes.fuentes, { ok: 1, mal: 0, caidas: [] });
  assert.equal(l.cortes.listados, 2);
  assert.equal(l.cortes.bajadas, 1);
  assert.equal(l.cortes.vigentes, 1);
  assert.deepEqual(l.cortes.lista[0], { id: 'a:scpl.coop:2898', servicio: 'agua', programado: true, dia: '2026-10-04', zona: null, fuentes: 3, cronograma: false, normalizado: false,
    urls: [URL_NOTA, 'https://www.a.com/locales/corte-agua', 'https://www.b.com/locales/corte-agua'] });
  assert.ok(r.resumen.includes('Avisos: 1 vigente (1 agua programado) · SCPL OK · 2 comunicados en el listado · 1 bajados'), r.resumen.join('\n'));
  assert.equal(llamadas.filter(u => u === URL_NOTA).length, 1);

  await correr(c, { fetch, zona, ahora: '2026-10-04T11:30:00.000Z' });
  assert.equal(llamadas.filter(u => u === URL_NOTA).length, 1, 'la nota ya bajada no se vuelve a pedir');
  assert.equal(llamadas.filter(u => u === URL_LISTADO).length, 2);
  assert.equal(lineas(c)[1].cortes.bajadas, 0);
  assert.equal(lineas(c)[1].cortes.vigentes, 1);
  rmSync(c, { recursive: true });
});

test('--zona con avisos.json: un aviso de un portal provincial que no nombra el lugar se queda en la zona', async () => {
  const c = carpeta();
  const zona = cargarConfig(carpetaConfig({
    'feeds.json': { feeds: feedsLocales },
    'portales.json': { portales: portalesLocales.map((p, i) => ({ ...p, zona: i === 0 ? 'local' : 'provincial' })) },
    'reglas.json': require('../config/zona/reglas.json'),
    'avisos.json': require('../config/zona/avisos.json'),
  }), '--zona');
  // B (provincial) trae además el corte de Puerto Madryn, que no nombra Comodoro ni Rada Tilly.
  const xml = (d, extra = '') => rss(`<item><title>${T_LOCAL}</title><link>https://www.${d}/locales/planta-agua</link><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>`
    + `<item><title>Cortarán el agua en 23 barrios de Comodoro</title><link>https://www.${d}/locales/corte-agua</link><pubDate>Sat, 03 Oct 2026 20:00:00 +0000</pubDate></item>` + extra);
  const madryn = '<item><title>Mañana habrá corte programado de energía en zona norte</title><link>https://www.b.com/puerto-madryn/corte-energia</link><pubDate>Sun, 04 Oct 2026 08:00:00 +0000</pubDate></item>';
  const mapa = { 'https://fa.test/rss': () => ({ status: 200, text: async () => xml('a.com') }), 'https://fb.test/rss': () => ({ status: 200, text: async () => xml('b.com', madryn) }) };
  await correr(c, { fetch: fetchPorUrl({ ...respuestas(), ...mapa, ...mapaScpl() }), zona });
  const [l] = lineas(c);
  assert.equal(l.cortes.apartadas, 2, 'los dos «Cortarán el agua… de Comodoro»: el de B nombra el lugar');
  assert.equal(l.cortes.sinLugar, 1, 'el de Puerto Madryn');
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.equal(lista.bloques.avisos.noticias.length, 1, 'Madryn no sale en Avisos');
  assert.equal(lista.bloques.avisos.noticias[0].medios.includes('B'), true);
  rmSync(c, { recursive: true });
});

test('--zona con avisos.json: si la SCPL no contesta, la vuelta sigue con lo guardado y lo anota', async () => {
  const c = carpeta();
  const zona = cargarConfig(configZonaConAvisos(), '--zona');
  await correr(c, { fetch: fetchPorUrl({ ...respuestas(), ...mapaZonaConAviso(), ...mapaScpl() }), zona });
  const r = await correr(c, { fetch: fetchPorUrl({ ...respuestas(), ...mapaZonaConAviso(), [URL_LISTADO]: () => ({ status: 503, text: async () => '' }) }), zona, ahora: '2026-10-04T11:30:00.000Z' });
  assert.equal(r.codigo, 0);
  const l = lineas(c)[1];
  assert.deepEqual(l.cortes.fuentes, { ok: 0, mal: 1, caidas: ['SCPL (HTTP 503)'] });
  assert.ok(l.avisos.includes('Fuente de avisos sin leer: SCPL (HTTP 503)'));
  assert.equal(l.cortes.vigentes, 1, 'con la nota guardada');
  assert.equal(JSON.parse(readFileSync(join(c, 'zona', 'avisos.json'), 'utf8')).notas.length, 1);
  rmSync(c, { recursive: true });
});

test('--zona con avisos.json y --sin-leer: no baja nada y arma los avisos con lo guardado', async () => {
  const c = carpeta();
  const zona = cargarConfig(configZonaConAvisos(), '--zona');
  await correr(c, { fetch: fetchPorUrl({ ...respuestas(), ...mapaZonaConAviso(), ...mapaScpl() }), zona });
  const r = await correr(c, { fetch: async () => { throw new Error('no tenía que leer'); }, zona, sinLeer: true });
  assert.equal(r.codigo, 0);
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.equal(lista.orden[0], 'avisos');
  assert.equal(lista.bloques.avisos.noticias.length, 1);
  assert.ok(r.resumen.includes('Avisos: 1 vigente (1 agua programado) · fuentes: no se leyeron'), r.resumen.join('\n'));
  rmSync(c, { recursive: true });
});

test('--zona sin avisos.json: ni bloque Avisos ni cortes en la línea (la vuelta de siempre)', async () => {
  const c = carpeta();
  const zona = cargarConfig(configZona(), '--zona');
  assert.equal('avisos' in zona, false);
  await correr(c, { fetch: fetchPorUrl({ ...respuestas(), ...mapaZona() }), zona });
  const lista = JSON.parse(readFileSync(join(c, 'pagina', 'lista.json'), 'utf8'));
  assert.equal(lista.orden[0], 'local');
  assert.equal('cortes' in lineas(c)[0], false);
  assert.equal(existsSync(join(c, 'zona', 'avisos.json')), false);
  rmSync(c, { recursive: true });
});
