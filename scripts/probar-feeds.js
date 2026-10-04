// Prueba cada feed de un archivo "nombre | ámbito | url" y dice si anda.
// Uso: node scripts/probar-feeds.js [config/feeds.json | candidatos.txt] [--json salida.json]
// Sin dependencias. Si la red pasa por proxy: NODE_USE_ENV_PROXY=1 node scripts/probar-feeds.js
'use strict';
const { readFileSync, writeFileSync } = require('node:fs');

const UA = 'Mozilla/5.0 (compatible; NOTITAN_7M feed-probe)';
const TIMEOUT_MS = 20000;
const PARALELO = 5;
const FRESCO_HORAS = 48;

const args = process.argv.slice(2);
const iJson = args.indexOf('--json');
const salidaJson = iJson >= 0 ? args[iJson + 1] : null;
const archivo = args.find((a, i) => !a.startsWith('--') && i !== iJson + 1) ?? 'config/feeds-candidatos.txt';

function leerCandidatos(texto) {
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [nombre, ambito, url] = l.split('|').map((s) => s.trim());
      return { nombre, ambito, url };
    });
}

// config/feeds.json: prueba los feeds de "activos" y también los "extras".
function leerFeedsJson(texto) {
  const { feeds = [], extras = [] } = JSON.parse(texto);
  return [...feeds, ...extras].map(({ nombre, ambito, url }) => ({ nombre, ambito, url }));
}

// Mira el cuerpo y dice qué formato es y cuántas notas trae.
function analizarCuerpo(cuerpo) {
  const inicio = cuerpo.slice(0, 2000).toLowerCase();
  let formato = null;
  if (/<rss[\s>]/.test(inicio)) formato = 'rss';
  else if (/<feed[\s>]/.test(inicio)) formato = 'atom';
  else if (/<rdf:rdf[\s>]/.test(inicio)) formato = 'rdf';
  else if (/<!doctype html|<html/.test(inicio)) formato = 'html';

  const items = (cuerpo.match(/<(item|entry)[\s>]/gi) ?? []).length;
  const fechas = [...cuerpo.matchAll(/<(?:pubDate|published|updated|dc:date)[^>]*>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*</gi)]
    .map((m) => Date.parse(m[1].trim()))
    .filter((t) => Number.isFinite(t));
  const masNueva = fechas.length ? Math.max(...fechas) : null;
  return { formato, items, masNueva, dominios: dominiosDeLinks(cuerpo) };
}

// Dominio (sin www.) de cada nota del feed, con cuántas notas trae cada uno.
function dominiosDeLinks(cuerpo) {
  const bloques = cuerpo.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? [];
  const cuenta = {};
  for (const b of bloques) {
    const link =
      b.match(/<link>\s*(?:<!\[CDATA\[)?\s*([^<\s\]]+)/i)?.[1] ??
      b.match(/<link\b[^>]*href=["']([^"']+)["']/i)?.[1];
    if (!link) continue;
    try {
      const host = new URL(link).hostname.replace(/^www\./, '');
      cuenta[host] = (cuenta[host] ?? 0) + 1;
    } catch {}
  }
  return cuenta;
}

async function pedir(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'application/rss+xml, application/xml, text/xml, */*' },
      redirect: 'follow',
      signal: ctl.signal,
    });
    const cuerpo = await r.text();
    return { status: r.status, urlFinal: r.url, tipo: r.headers.get('content-type') ?? '', cuerpo };
  } catch (e) {
    return { status: 0, error: e.cause?.code ?? e.name ?? String(e), cuerpo: '' };
  } finally {
    clearTimeout(timer);
  }
}

// Si la url no es un feed, busca en el HTML la etiqueta que anuncia el RSS.
function descubrirFeeds(html, base) {
  const out = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/rel=["']?alternate/i.test(tag)) continue;
    if (!/type=["']?application\/(rss|atom)\+xml/i.test(tag)) continue;
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    try {
      out.push(new URL(href, base).href);
    } catch {}
  }
  return [...new Set(out)];
}

async function probar({ nombre, ambito, url }) {
  const r = await pedir(url);
  const { formato, items, masNueva, dominios } = analizarCuerpo(r.cuerpo);
  const horas = masNueva ? (Date.now() - masNueva) / 36e5 : null;
  let veredicto;
  if (r.status === 0) veredicto = `NO CONECTA (${r.error})`;
  else if (r.status >= 400) veredicto = `HTTP ${r.status}`;
  else if (!['rss', 'atom', 'rdf'].includes(formato)) veredicto = `NO ES FEED (${formato ?? 'vacío'})`;
  else if (items === 0) veredicto = 'FEED VACÍO';
  else if (horas !== null && horas > FRESCO_HORAS) veredicto = `VIEJO (${Math.round(horas)} h)`;
  else veredicto = 'OK';

  let alternativas = [];
  if (veredicto !== 'OK' && r.cuerpo && formato === 'html') {
    alternativas = descubrirFeeds(r.cuerpo, r.urlFinal ?? url);
  }
  return {
    nombre, ambito, url,
    status: r.status,
    urlFinal: r.urlFinal && r.urlFinal !== url ? r.urlFinal : null,
    formato, items, dominios,
    horasDesdeUltima: horas === null ? null : Math.round(horas * 10) / 10,
    veredicto,
    alternativas,
  };
}

async function main() {
  const texto = readFileSync(archivo, 'utf8');
  const cand = archivo.endsWith('.json') ? leerFeedsJson(texto) : leerCandidatos(texto);
  const resultados = new Array(cand.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: PARALELO }, async () => {
      while (i < cand.length) {
        const k = i++;
        resultados[k] = await probar(cand[k]);
      }
    }),
  );
  const portales = JSON.parse(readFileSync('config/portales.json', 'utf8')).portales;
  const enLista = (host) => portales.some((p) => host === p.dominio || host.endsWith('.' + p.dominio));
  for (const r of resultados) {
    const marca = r.veredicto === 'OK' ? 'OK ' : 'MAL';
    const extra = r.urlFinal ? `  → redirige a ${r.urlFinal}` : '';
    console.log(`${marca} ${r.nombre.padEnd(18)} ${String(r.items).padStart(3)} notas  ${r.veredicto}${extra}`);
    for (const a of r.alternativas.slice(0, 3)) console.log(`      posible feed: ${a}`);
    const fuera = Object.entries(r.dominios ?? {}).filter(([h]) => !enLista(h));
    if (r.veredicto === 'OK' && fuera.length) {
      console.log(`      links a dominios fuera de portales.json: ${fuera.map(([h, n]) => `${h} (${n})`).join(', ')}`);
    }
  }
  const ok = resultados.filter((r) => r.veredicto === 'OK').length;
  console.log(`\n${ok} de ${resultados.length} andan.`);
  if (salidaJson) writeFileSync(salidaJson, JSON.stringify(resultados, null, 2));
}

module.exports = { leerCandidatos, leerFeedsJson, analizarCuerpo, dominiosDeLinks, descubrirFeeds, probar };

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
