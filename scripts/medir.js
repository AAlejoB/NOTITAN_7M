'use strict';
// Resume las vueltas de <carpeta>/vueltas.jsonl por día y por corte de 4 horas (hora de Argentina):
// cuántas noticias confirmadas (la regla de 5 medios) y cuántas 4/5 hubo, por bloque.
// Uso: node scripts/medir.js [--carpeta datos] [--dia AAAA-MM-DD]
// En un corte, un hecho cuenta una sola vez (por su id), en el bloque de su última vuelta de ese corte.
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { ErrorDeUso } = require('./leer.js');

const ZONA = 'America/Argentina/Buenos_Aires';
const CORTES = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'];
const BLOQUES = ['nacional', 'internacional'];

const formato = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' });

// '2026-10-10T02:30:00.000Z' → { dia: '2026-10-09', corte: '20-24' }
function diaYCorteDe(hora) {
  const partes = Object.fromEntries(formato.formatToParts(new Date(hora)).map(p => [p.type, p.value]));
  return { dia: `${partes.year}-${partes.month}-${partes.day}`, corte: CORTES[Math.floor(Number(partes.hour) / 4)] };
}

// → { 'AAAA-MM-DD': { '08-12': [vueltas], … } }, solo los cortes que tienen vueltas.
function porDiaYCorte(vueltas) {
  const por = {};
  for (const v of vueltas) {
    const { dia, corte } = diaYCorteDe(v.hora);
    ((por[dia] = por[dia] || {})[corte] = por[dia][corte] || []).push(v);
  }
  return por;
}

const vacio = () => ({ nacional: 0, internacional: 0 });

// De cada id de la lista `clave`, lo que dice su última vuelta (la de `hora` más nueva).
function ultimaVezDeCada(vueltas, clave) {
  const ordenadas = [...vueltas].sort((a, b) => Date.parse(a.hora) - Date.parse(b.hora));
  const porId = new Map();
  for (const v of ordenadas) for (const x of v[clave] || []) porId.set(x.id, x);
  return [...porId.values()];
}

// → { vueltas, confirmados, sinFirma, conFirma, viaB }, cada uno con { nacional, internacional } de ids distintos.
function resumir(vueltas) {
  const r = { vueltas: vueltas.length, confirmados: vacio(), sinFirma: vacio(), conFirma: vacio(), viaB: vacio() };
  for (const c of ultimaVezDeCada(vueltas, 'confirmados')) {
    if (!BLOQUES.includes(c.bloque)) continue;
    r.confirmados[c.bloque]++;
    if (c.via === 'B') r.viaB[c.bloque]++;
  }
  for (const c of ultimaVezDeCada(vueltas, 'cuatroDeCinco')) {
    if (BLOQUES.includes(c.bloque)) r[c.conFirma ? 'conFirma' : 'sinFirma'][c.bloque]++;
  }
  return r;
}

// Cada feed caído con en cuántas vueltas, y cuántas vueltas no tuvieron ningún feed.
function feedsCaidos(vueltas) {
  const cuenta = new Map();
  for (const v of vueltas) for (const n of new Set(v.feeds.caidos)) cuenta.set(n, (cuenta.get(n) || 0) + 1);
  return {
    caidos: [...cuenta].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    sinNingunFeed: vueltas.filter(v => v.feeds.ok === 0).length,
  };
}

/* ───────────── el archivo y el texto ───────────── */

function leerVueltas(archivo) {
  if (!existsSync(archivo)) return [];
  const vueltas = [];
  readFileSync(archivo, 'utf8').split('\n').forEach((linea, i) => {
    if (!linea.trim()) return;
    try {
      vueltas.push(JSON.parse(linea));
    } catch (e) {
      throw new ErrorDeUso(`${archivo}, renglón ${i + 1}: no es JSON válido (${e.message}).`);
    }
  });
  return vueltas;
}

const par = o => `${o.nacional} / ${o.internacional}`;
const FILA = ['Corte', 'Vueltas', 'Confirmados', '4/5 sin firma', '4/5 con firma', 'Vía B'];

function fila(nombre, r) {
  return [nombre, String(r.vueltas), par(r.confirmados), par(r.sinFirma), par(r.conFirma), par(r.viaB)];
}

function tabla(filas) {
  const ancho = FILA.map((t, k) => Math.max(t.length, ...filas.map(f => f[k].length)));
  const linea = f => f.map((c, k) => (k === 0 ? c.padEnd(ancho[k]) : c.padStart(ancho[k]))).join('  ');
  return [linea(FILA), ancho.map(a => '─'.repeat(a)).join('  '), ...filas.map(linea)];
}

// Las líneas del informe de un día. `cortes` es { '08-12': [vueltas], … }.
function informeDelDia(dia, cortes) {
  const todas = Object.values(cortes).flat();
  const filas = CORTES.filter(c => cortes[c]).map(c => fila(c, resumir(cortes[c])));
  filas.push(fila('Día entero (distintos)', resumir(todas)));
  const { caidos, sinNingunFeed } = feedsCaidos(todas);
  return [
    `DÍA ${dia} · ${todas.length} ${todas.length === 1 ? 'vuelta' : 'vueltas'} · cada celda es nacionales / internacionales`,
    '',
    ...tabla(filas),
    '',
    'Feeds caídos',
    ...(caidos.length ? caidos.map(([n, k]) => `  ${n}: en ${k} de ${todas.length} vueltas`) : ['  (ninguno)']),
    `Vueltas sin ningún feed: ${sinNingunFeed}`,
  ];
}

function informe(vueltas, { dia = null } = {}) {
  const porDia = porDiaYCorte(vueltas);
  const dias = Object.keys(porDia).sort().filter(d => !dia || d === dia);
  if (!dias.length) return [dia ? `No hay vueltas del día ${dia}.` : 'Todavía no hay vueltas.'];
  return dias.flatMap((d, k) => [...(k ? [''] : []), ...informeDelDia(d, porDia[d])]);
}

function leerOpciones(args) {
  const valor = bandera => {
    const i = args.indexOf(bandera);
    if (i < 0) return null;
    const v = args[i + 1];
    if (v === undefined || v.startsWith('--')) throw new ErrorDeUso(`${bandera} necesita un valor.`);
    return v;
  };
  const dia = valor('--dia');
  if (dia !== null && !/^\d{4}-\d{2}-\d{2}$/.test(dia)) throw new ErrorDeUso(`--dia tiene que ser AAAA-MM-DD, no "${dia}".`);
  return { carpeta: valor('--carpeta') || 'datos', dia };
}

function main() {
  const { carpeta, dia } = leerOpciones(process.argv.slice(2));
  const archivo = join(carpeta, 'vueltas.jsonl');
  const vueltas = leerVueltas(archivo);
  if (!vueltas.length) { console.log(`Todavía no hay vueltas en ${archivo}`); return; }
  console.log('\n' + informe(vueltas, { dia }).join('\n') + '\n');
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    if (e instanceof ErrorDeUso) { console.error(`\nNo se pudo: ${e.message}\n`); process.exit(1); }
    throw e;
  }
}

module.exports = { diaYCorteDe, porDiaYCorte, resumir, feedsCaidos, leerVueltas, informe, leerOpciones, CORTES };
