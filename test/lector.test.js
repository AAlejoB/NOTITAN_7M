'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../src/lector.js');
const N = require('../src/nucleo.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const feedsJson = require('../config/feeds.json');

const AHORA = '2026-10-04T11:00:00.000Z';
const feed = (extra = {}) => ({ nombre: 'Diario', dominio: 'infobae.com', url: 'https://www.infobae.com/arc/outboundfeeds/rss/', ...extra });
const rss = items => `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Feed</title>${items}</channel></rss>`;
const item = (titulo, link, extra = '') =>
  `<item><title>${titulo}</title><link>${link}</link><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate>${extra}</item>`;
const una = (xml, f = feed(), opciones = { ahora: AHORA }) => L.parsearFeed(xml, f, opciones);

/* ───────── un feed ───────── */

test('RSS con CDATA (como elDiarioAR): título, link, fecha, autor y bajada sin HTML', () => {
  const xml = rss(`<item>
    <title><![CDATA[Un plato por cada DNI: la app para vigilar la entrega]]></title>
    <link><![CDATA[https://www.eldiarioar.com/sociedad/plato-dni_1_1.html]]></link>
    <description><![CDATA[<p><img src="x.jpg"></p><div class="subtitles"><p class="subtitle">Desde enero, los comedores deben cargar el DNI.</p></div>]]></description>
    <dc:creator><![CDATA[León Nicanoff]]></dc:creator>
    <pubDate><![CDATA[Sat, 03 Oct 2026 03:01:55 +0000]]></pubDate>
  </item>`);
  const { notas, items } = una(xml, feed({ nombre: 'elDiarioAR', dominio: 'eldiarioar.com' }));
  assert.equal(items, 1);
  assert.equal(notas[0].titulo, 'Un plato por cada DNI: la app para vigilar la entrega');
  assert.equal(notas[0].url, 'https://www.eldiarioar.com/sociedad/plato-dni_1_1.html');
  assert.equal(notas[0].fecha, '2026-10-03T03:01:55.000Z');
  assert.equal(notas[0].firma, 'León Nicanoff');
  assert.equal(notas[0].bajada, 'Desde enero, los comedores deben cargar el DNI.');
  assert.equal(notas[0].seccion, 'sociedad');
  assert.equal(notas[0].feed, 'elDiarioAR');
});

test('entidades: &#8211; y &amp; se decodifican, también cuando vienen dobles', () => {
  const { notas } = una(rss(item('Al Jazeera &#8211; Q&amp;A sobre el acuerdo', 'https://www.aljazeera.com/news/2026/10/4/a',
    '<description>Tarifas &amp;#8211; qué cambia</description>')));
  assert.equal(notas[0].titulo, 'Al Jazeera – Q&A sobre el acuerdo');
  assert.equal(notas[0].bajada, 'Tarifas – qué cambia');
});

test('autor: dc:creator repetido, <author> con mail y nombre, un mail solo no es un nombre', () => {
  const casos = [
    ['<dc:creator>Ana Gómez</dc:creator><dc:creator>Luis Paz</dc:creator>', 'Ana Gómez, Luis Paz'],
    ['<author>redaccion@perfil.com (Juan Pérez)</author>', 'Juan Pérez'],
    ['<author>redaccion@ambito.com</author>', ''],
    ['<dc:creator>Por María López</dc:creator>', 'María López'],
    ['', ''],
  ];
  for (const [etiqueta, esperado] of casos) {
    assert.equal(una(rss(item('T', 'https://www.infobae.com/a/1', etiqueta))).notas[0].firma, esperado, etiqueta);
  }
});

test('Atom: link href, summary, published y author/name', () => {
  const xml = `<feed xmlns="http://www.w3.org/2005/Atom"><entry>
    <title>Una nota en Atom</title>
    <link rel="self" href="https://sitio.com/api/1"/><link rel="alternate" href="https://www.sitio.com/mundo/una-nota?utm_source=x"/>
    <summary>Resumen &amp; más</summary><published>2026-10-04T08:30:00Z</published>
    <author><name>Carla Ruiz</name></author><category term="Mundo"/>
  </entry></feed>`;
  const { notas } = una(xml, feed({ dominio: 'sitio.com' }));
  assert.equal(notas[0].url, 'https://www.sitio.com/mundo/una-nota');
  assert.equal(notas[0].bajada, 'Resumen & más');
  assert.equal(notas[0].fecha, '2026-10-04T08:30:00.000Z');
  assert.equal(notas[0].firma, 'Carla Ruiz');
  assert.equal(notas[0].etiqueta, 'Mundo');
});

test('portal: sale de feeds.json aunque el feed se lea en otro host (BBC Mundo) y aunque el link sea de un subdominio', () => {
  const bbc = feed({ nombre: 'BBC Mundo', dominio: 'bbc.com', url: 'https://feeds.bbci.co.uk/mundo/rss.xml' });
  assert.equal(una(rss(item('T', 'https://www.bbc.com/mundo/articles/c1')), bbc).notas[0].portal, 'bbc.com');
  const pais = feed({ nombre: 'El País', dominio: 'elpais.com', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' });
  assert.equal(una(rss(item('T', 'https://cincodias.elpais.com/mercados/a.html')), pais).notas[0].portal, 'elpais.com');
});

test('urls: se sacan utm y fragmentos, y la misma nota repetida queda una vez', () => {
  const { notas, descartadas } = una(rss(
    item('Misma nota', 'https://www.infobae.com/politica/a?utm_source=tw&id=7#comentarios') +
    item('Misma nota', 'https://infobae.com/politica/a/?id=7&utm_medium=x')));
  assert.equal(notas.length, 1);
  assert.equal(notas[0].url, 'https://www.infobae.com/politica/a?id=7');
  assert.deepEqual(descartadas.map(d => d.motivo), ['url_repetida']);
});

test('excluirRutas: se descartan las ediciones de otros países del Cronista', () => {
  const cronista = feed({ nombre: 'El Cronista', dominio: 'cronista.com', excluirRutas: ['/espana/', '/mexico/'] });
  const { notas, descartadas } = una(rss(
    item('Dólar hoy', 'https://www.cronista.com/economia-politica/dolar-1') +
    item('Alerta por lluvias en Cataluña', 'https://www.cronista.com/espana/lluvias-2') +
    item('Peso mexicano', 'https://www.cronista.com/MEXICO/peso-3')), cronista);
  assert.deepEqual(notas.map(n => n.titulo), ['Dólar hoy']);
  assert.deepEqual(descartadas.map(d => d.motivo), ['ruta_excluida (/espana/)', 'ruta_excluida (/mexico/)']);
});

test('lo que no se puede usar se descarta con su motivo: sin título, sin link, sin fecha, fecha futura', () => {
  const xml = rss([
    '<item><title></title><link>https://www.infobae.com/a/1</link><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>',
    '<item><title>Sin link</title><pubDate>Sun, 04 Oct 2026 09:00:00 +0000</pubDate></item>',
    '<item><title>Sin fecha</title><link>https://www.infobae.com/a/3</link></item>',
    '<item><title>Fecha rota</title><link>https://www.infobae.com/a/4</link><pubDate>ayer a la tarde</pubDate></item>',
    item('Del futuro', 'https://www.infobae.com/a/5').replace('Sun, 04 Oct 2026 09:00:00', 'Tue, 06 Oct 2026 09:00:00'),
    item('Bien', 'https://www.infobae.com/a/6'),
  ].join(''));
  const { notas, descartadas, items } = una(xml);
  assert.equal(items, 6);
  assert.deepEqual(notas.map(n => n.titulo), ['Bien']);
  assert.deepEqual(descartadas.map(d => d.motivo), ['sin_titulo', 'sin_url', 'sin_fecha', 'sin_fecha', 'fecha_futura']);
});

test('ids: estables entre corridas y distintos entre notas', () => {
  const xml = rss(item('Uno', 'https://www.infobae.com/a/1') + item('Dos', 'https://www.infobae.com/a/2'));
  const a = una(xml).notas;
  const b = una(xml).notas;
  assert.deepEqual(a.map(n => n.id), b.map(n => n.id));
  assert.notEqual(a[0].id, a[1].id);
  assert.match(a[0].id, /^infobae\.com:[0-9a-f]{16}$/);
});

test('bajada: se recorta a 300 caracteres sin partir una palabra', () => {
  const largo = 'palabra '.repeat(80);
  const { notas } = una(rss(item('T', 'https://www.infobae.com/a/1', `<description>${largo}</description>`)));
  assert.ok(notas[0].bajada.length <= 301, `largo ${notas[0].bajada.length}`);
  assert.match(notas[0].bajada, /palabra…$/);
});

test('categorías: van a etiqueta, y una nota de opinión la descarta el criterio 1 del núcleo', () => {
  const xml = rss(
    item('Una columna', 'https://www.perfil.com/noticias/a-1', '<category>Opinión</category><category>Política</category>') +
    item('Una noticia', 'https://www.perfil.com/noticias/a-2', '<category>Política</category>'));
  const { notas } = una(xml, feed({ nombre: 'Perfil', dominio: 'perfil.com' }));
  assert.equal(notas[0].etiqueta, 'Opinión / Política');
  const p = N.preparar(notas, { portales, reglas, ahora: AHORA });
  assert.match(p.descartadas.find(d => d.tipo === 'nota').motivo, /etiqueta opinion/);
});

/* ───────── todos los feeds ───────── */

const respuesta = (status, cuerpo) => async () => ({ status, text: async () => cuerpo });
const fetchPorUrl = mapa => async (url) => {
  const r = mapa[url];
  if (r instanceof Error) throw r;
  return r();
};

test('leerFeeds: un feed caído, uno que no es feed y uno bueno: se avisa y los demás siguen', async () => {
  const feeds = [
    feed({ nombre: 'Bueno', dominio: 'infobae.com', url: 'https://a.test/rss' }),
    feed({ nombre: 'Caído', dominio: 'clarin.com', url: 'https://b.test/rss' }),
    feed({ nombre: 'Es una página', dominio: 'perfil.com', url: 'https://c.test/rss' }),
    feed({ nombre: 'Sin red', dominio: 'ambito.com', url: 'https://d.test/rss' }),
  ];
  const r = await L.leerFeeds(feeds, {
    ahora: AHORA,
    fetch: fetchPorUrl({
      'https://a.test/rss': respuesta(200, rss(item('Uno', 'https://www.infobae.com/a/1') + item('Dos', 'https://www.infobae.com/a/2'))),
      'https://b.test/rss': respuesta(500, 'error'),
      'https://c.test/rss': respuesta(200, '<!DOCTYPE html><html><body>Hola</body></html>'),
      'https://d.test/rss': new Error('sin red'),
    }),
  });
  assert.equal(r.notas.length, 2);
  assert.deepEqual(r.feeds.map(f => [f.nombre, f.estado, f.notas]), [['Bueno', 'ok', 2], ['Caído', 'error', 0], ['Es una página', 'vacio', 0], ['Sin red', 'error', 0]]);
  assert.deepEqual(r.avisos, ['Feed sin leer: Caído (HTTP 500)', 'Feed sin leer: Es una página (no trae notas (¿no es un feed?))', 'Feed sin leer: Sin red (Error)']);
});

test('leerFeeds: la misma nota en dos feeds cuenta una vez', async () => {
  const mismo = rss(item('Misma', 'https://www.lanacion.com.ar/politica/x-1'));
  const feeds = [
    feed({ nombre: 'La Nación', dominio: 'lanacion.com.ar', url: 'https://a.test/rss' }),
    feed({ nombre: 'LN+', dominio: 'lnmas.com', url: 'https://b.test/rss' }),
  ];
  const r = await L.leerFeeds(feeds, { ahora: AHORA, fetch: fetchPorUrl({ 'https://a.test/rss': respuesta(200, mismo), 'https://b.test/rss': respuesta(200, mismo) }) });
  assert.equal(r.notas.length, 1);
  assert.deepEqual(r.feeds.map(f => f.notas), [1, 0]);
  assert.equal(r.feeds[1].descartadas.url_repetida, 1);
});

test('leerFeeds: respeta el límite de pedidos en paralelo', async () => {
  let activos = 0;
  let maximo = 0;
  const feeds = Array.from({ length: 9 }, (_, k) => feed({ nombre: 'F' + k, url: `https://f${k}.test/rss` }));
  const fetch = async () => {
    maximo = Math.max(maximo, ++activos);
    await new Promise(r => setTimeout(r, 5));
    activos--;
    return { status: 200, text: async () => rss(item('T', 'https://www.infobae.com/a/' + Math.random())) };
  };
  await L.leerFeeds(feeds, { ahora: AHORA, fetch, paralelo: 3 });
  assert.equal(maximo, 3);
});

/* ───────── del lector al núcleo ───────── */

const mismoHecho = 'Se firmó un tratado comercial entre Chile y Japón en Tokio';

test('lector → núcleo: 5 grupos leídos de 5 feeds llegan a candidato', () => {
  const dominios = ['clarin.com', 'lanacion.com.ar', 'infobae.com', 'perfil.com', 'ambito.com'];
  const notas = dominios.flatMap(d => una(rss(item(mismoHecho, `https://www.${d}/mundo/tratado`)), feed({ dominio: d })).notas);
  const p = N.preparar(notas, { portales, reglas, ahora: AHORA });
  assert.equal(p.candidatos.length, 1);
  assert.equal(p.candidatos[0].gruposIndependientes, 5);
});

test('lector → núcleo: el autor del feed alcanza para la vía B', () => {
  const firmas = [{ nombre: 'Autora Ficticia Uno', ambitos: ['internacional'] }];
  const notas = [
    ...una(rss(item(mismoHecho, 'https://www.bbc.com/mundo/tratado', '<dc:creator>Autora Ficticia Uno</dc:creator>')), feed({ dominio: 'bbc.com' })).notas,
    ...una(rss(item(mismoHecho, 'https://www.dw.com/es/tratado')), feed({ dominio: 'dw.com' })).notas,
  ];
  const p = N.preparar(notas, { portales, reglas, firmas, ahora: AHORA });
  assert.equal(p.candidatos[0].via, 'B');
  const d = N.decidir(p.candidatos, { [p.candidatos[0].id]: { datoNuevo: true, fuenteConNombre: true, interesPublico: true, desmentido: false, bloque: 'internacional' } }, { reglas });
  assert.equal(d.internacionales[0].etiqueta, 'Respaldada por Autora Ficticia Uno');
});

/* ───────── la lista real ───────── */

test('config/feeds.json: excluirRutas, si existe, es una lista de rutas que empiezan con /', () => {
  for (const f of feedsJson.feeds) {
    if (f.excluirRutas === undefined) continue;
    assert.ok(Array.isArray(f.excluirRutas) && f.excluirRutas.length > 0, `${f.nombre}: lista vacía`);
    for (const r of f.excluirRutas) assert.match(r, /^\/.+\/$/, `${f.nombre}: ${r}`);
  }
  assert.ok(feedsJson.feeds.find(f => f.nombre === 'El Cronista').excluirRutas.includes('/espana/'));
});
