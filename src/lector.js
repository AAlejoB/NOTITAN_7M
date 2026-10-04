'use strict';
/**
 * NOTITAN_7M · lector
 *
 * Convierte el XML de un feed en notas para el núcleo:
 *   { id, titulo, bajada, url, portal, fecha, seccion, etiqueta, firma, feed }
 *
 * parsearFeed y las funciones de texto son puras: sin red ni reloj. leerFeeds es lo único que
 * sale a internet y recibe `fetch` por parámetro, así se prueba sin conexión. Sin dependencias.
 *
 * El `portal` de cada nota sale del campo `dominio` de config/feeds.json, no del host del feed:
 * BBC Mundo se lee en feeds.bbci.co.uk y sus notas caen en bbc.com, que es lo que está en portales.json.
 *
 * `etiqueta` junta las categorías del feed (el núcleo descarta "opinión", "columna", etc.) y
 * `firma` es el autor (dc:creator o author), que usa la vía B.
 */

const BAJADA_MAX = 300;
const FECHA_FUTURA_HORAS = 12;
const PARAMS_DE_SEGUIMIENTO = /^(utm_|fbclid$|gclid$|mc_cid$|mc_eid$)/i;

/* ───────────── texto ───────────── */

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const HAY_ENTIDAD = /&(?:#\d+|#x[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/i;

function aTexto(codigo) {
  try { return String.fromCodePoint(codigo); } catch { return ''; }
}

// Una o dos pasadas: algunos feeds traen "&amp;#8211;" (entidad dentro de entidad).
function decodificar(texto) {
  let t = String(texto ?? '');
  for (let pasada = 0; pasada < 2 && HAY_ENTIDAD.test(t); pasada++) {
    t = t.replace(/&(#\d+|#x[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/gi, (_, e) => {
      if (e[0] !== '#') return ENTIDADES[e.toLowerCase()];
      return aTexto(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    });
  }
  return t;
}

// De HTML (o de un texto con CDATA) a una sola línea de texto.
function limpiarHtml(html) {
  return decodificar(
    String(html ?? '')
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<\/?(?:br|p|div|li|h[1-6])\b[^>]*>/gi, ' ')
      .replace(/<\/?[a-z][^>]*>/gi, '')
  ).replace(/\s+/g, ' ').trim();
}

function recortar(texto, max) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max);
  return corte.slice(0, Math.max(corte.lastIndexOf(' '), max * 0.6)).trimEnd() + '…';
}

/* ───────────── XML a mano ───────────── */

function escapar(nombre) {
  return nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Lo de adentro de la primera <nombre>…</nombre>, o null.
function contenido(bloque, nombre) {
  const n = escapar(nombre);
  const m = bloque.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'i'));
  return m ? m[1] : null;
}

function todos(bloque, nombre) {
  const n = escapar(nombre);
  return [...bloque.matchAll(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'gi'))].map(m => m[1]);
}

function enlaceDe(bloque) {
  const texto = contenido(bloque, 'link');
  if (texto !== null && limpiarHtml(texto)) return limpiarHtml(texto);
  // Atom: <link rel="alternate" href="…"/>
  const tags = [...bloque.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);
  const elegido = tags.find(t => /rel=["']alternate["']/i.test(t)) || tags.find(t => !/rel=/i.test(t)) || tags[0];
  const href = elegido && elegido.match(/href=["']([^"']+)["']/i);
  if (href) return decodificar(href[1]).trim();
  const guid = contenido(bloque, 'guid');
  const g = guid !== null ? limpiarHtml(guid) : '';
  return /^https?:\/\//i.test(g) ? g : '';
}

function fechaDe(bloque) {
  for (const etiqueta of ['pubDate', 'dc:date', 'published', 'updated']) {
    const c = contenido(bloque, etiqueta);
    const t = c !== null ? Date.parse(limpiarHtml(c)) : NaN;
    if (Number.isFinite(t)) return new Date(t).toISOString();
  }
  return null;
}

// "mail@sitio.com (Nombre)" → "Nombre"; un mail solo no es un nombre; se saca el "Por ".
function limpiarFirma(texto) {
  let t = limpiarHtml(texto);
  const entreParentesis = t.match(/^\S+@\S+\s*\(([^)]+)\)$/);
  if (entreParentesis) t = entreParentesis[1];
  if (/^\S+@\S+$/.test(t)) return '';
  return t.replace(/^por\s+/i, '').trim();
}

function firmaDe(bloque) {
  const creadores = todos(bloque, 'dc:creator').map(limpiarFirma).filter(Boolean);
  if (creadores.length) return [...new Set(creadores)].join(', ');
  const autor = contenido(bloque, 'author');
  if (autor === null) return '';
  const nombre = contenido(autor, 'name'); // Atom
  return limpiarFirma(nombre !== null ? nombre : autor);
}

function categoriasDe(bloque) {
  const texto = todos(bloque, 'category').map(limpiarHtml);
  const atom = [...bloque.matchAll(/<category\b[^>]*\bterm=["']([^"']+)["']/gi)].map(m => decodificar(m[1]).trim());
  return [...new Set([...texto, ...atom].filter(Boolean))];
}

/* ───────────── urls ───────────── */

function urlLimpia(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  u.hash = '';
  for (const clave of [...u.searchParams.keys()]) if (PARAMS_DE_SEGUIMIENTO.test(clave)) u.searchParams.delete(clave);
  return u.href;
}

// Para saber si dos notas son la misma: sin www, sin barra final, con los parámetros ordenados.
function claveUrl(url) {
  const u = new URL(url);
  u.searchParams.sort();
  return `${u.hostname.replace(/^www\./i, '').toLowerCase()}${u.pathname.replace(/\/+$/, '')}${u.search}`;
}

function seccionDeUrl(url) {
  const segmento = new URL(url).pathname.split('/').filter(Boolean)[0] || '';
  let s = segmento;
  try { s = decodeURIComponent(segmento); } catch { /* queda como vino */ }
  s = s.toLowerCase();
  return /^\d+$|\.\w{2,5}$/.test(s) ? '' : s;
}

// Dos hashes de 32 bits pegados: estable, corto y sin depender de crypto.
function idDe(dominio, url) {
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < url.length; i++) {
    a = Math.imul(a ^ url.charCodeAt(i), 0x01000193) >>> 0;
    b = Math.imul(b + url.charCodeAt(i), 0x85ebca6b) >>> 0;
  }
  return `${dominio}:${a.toString(16).padStart(8, '0')}${b.toString(16).padStart(8, '0')}`;
}

/* ───────────── un feed ───────────── */

// feed = una entrada de config/feeds.json: { nombre, dominio, url, excluirRutas? }
// Devuelve { items, notas, descartadas: [{ motivo, titulo, url }] }.
function parsearFeed(xml, feed, { ahora } = {}) {
  const bloques = String(xml ?? '').match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  const tope = ahora ? Date.parse(ahora) + FECHA_FUTURA_HORAS * 3600 * 1000 : Infinity;
  const excluidas = (feed.excluirRutas || []).map(r => r.toLowerCase());
  const vistas = new Set();
  const notas = [];
  const descartadas = [];

  for (const bloque of bloques) {
    const tituloCrudo = contenido(bloque, 'title');
    const titulo = tituloCrudo !== null ? limpiarHtml(tituloCrudo) : '';
    const url = urlLimpia(enlaceDe(bloque));
    const baja = motivo => descartadas.push({ motivo, titulo, url: url || '' });

    if (!titulo) { baja('sin_titulo'); continue; }
    if (!url) { baja('sin_url'); continue; }
    const fecha = fechaDe(bloque);
    if (!fecha) { baja('sin_fecha'); continue; }
    if (Date.parse(fecha) > tope) { baja('fecha_futura'); continue; }
    const ruta = new URL(url).pathname.toLowerCase();
    const rutaExcluida = excluidas.find(r => ruta.includes(r));
    if (rutaExcluida) { baja(`ruta_excluida (${rutaExcluida})`); continue; }
    const clave = claveUrl(url);
    if (vistas.has(clave)) { baja('url_repetida'); continue; }
    vistas.add(clave);

    const categorias = categoriasDe(bloque);
    const descripcion = contenido(bloque, 'description') ?? contenido(bloque, 'summary');
    notas.push({
      id: idDe(feed.dominio, url),
      titulo,
      bajada: recortar(descripcion !== null ? limpiarHtml(descripcion) : '', BAJADA_MAX),
      url,
      portal: feed.dominio,
      fecha,
      seccion: seccionDeUrl(url) || (categorias[0] || '').toLowerCase(),
      etiqueta: categorias.join(' / '),
      firma: firmaDe(bloque),
      feed: feed.nombre,
    });
  }
  return { items: bloques.length, notas, descartadas };
}

/* ───────────── todos los feeds (lo único que sale a internet) ───────────── */

const UA = 'Mozilla/5.0 (compatible; NOTITAN_7M lector)';

async function bajar(feed, { fetch, timeoutMs }) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), timeoutMs);
  try {
    const r = await fetch(feed.url, {
      headers: { 'user-agent': UA, accept: 'application/rss+xml, application/xml, text/xml, */*' },
      redirect: 'follow',
      signal: control.signal,
    });
    return { status: r.status, xml: await r.text() };
  } catch (e) {
    return { status: 0, error: (e.cause && e.cause.code) || e.name || String(e) };
  } finally {
    clearTimeout(reloj);
  }
}

// → { notas, feeds: [{ nombre, dominio, estado, detalle, items, notas, descartadas }], avisos }
// estado: 'ok' | 'vacio' | 'error'. Un feed caído no frena a los demás: se lista y se avisa.
async function leerFeeds(feeds, { fetch = globalThis.fetch, ahora, timeoutMs = 20000, paralelo = 5 } = {}) {
  const resultados = new Array(feeds.length);
  let siguiente = 0;
  await Promise.all(Array.from({ length: Math.min(paralelo, feeds.length) }, async () => {
    while (siguiente < feeds.length) {
      const k = siguiente++;
      const feed = feeds[k];
      const r = await bajar(feed, { fetch, timeoutMs });
      const base = { nombre: feed.nombre, dominio: feed.dominio, items: 0, notas: [], descartadas: {} };
      if (r.status === 0) resultados[k] = { ...base, estado: 'error', detalle: r.error };
      else if (r.status >= 400) resultados[k] = { ...base, estado: 'error', detalle: `HTTP ${r.status}` };
      else {
        const p = parsearFeed(r.xml, feed, { ahora });
        const motivos = {};
        for (const d of p.descartadas) motivos[d.motivo] = (motivos[d.motivo] || 0) + 1;
        resultados[k] = p.items === 0
          ? { ...base, estado: 'vacio', detalle: 'no trae notas (¿no es un feed?)' }
          : { ...base, estado: 'ok', detalle: '', items: p.items, notas: p.notas, descartadas: motivos };
      }
    }
  }));

  // La misma nota en dos feeds se cuenta una vez.
  const vistas = new Set();
  const notas = [];
  for (const r of resultados) {
    r.aceptadas = 0;
    for (const n of r.notas) {
      const clave = claveUrl(n.url);
      if (vistas.has(clave)) { r.descartadas.url_repetida = (r.descartadas.url_repetida || 0) + 1; continue; }
      vistas.add(clave);
      notas.push(n);
      r.aceptadas++;
    }
  }
  const avisos = resultados.filter(r => r.estado !== 'ok').map(r => `Feed sin leer: ${r.nombre} (${r.detalle})`);
  return {
    notas,
    feeds: resultados.map(({ notas: _propias, aceptadas, ...r }) => ({ ...r, notas: aceptadas })),
    avisos,
  };
}

module.exports = { decodificar, limpiarHtml, limpiarFirma, claveUrl, urlLimpia, idDe, parsearFeed, leerFeeds };
