'use strict';
// Lee los feeds de config/feeds.json, arma las notas con src/lector.js y corre preparar() del núcleo
// para ver el embudo con datos reales. No juzga (falta la IA): muestra hechos, candidatos y En observación.
// Uso: node scripts/leer.js [--json notas.json] [--umbral 0.3] [--acumular datos/notas.json [--sin-leer]]
//   --umbral         prueba otro umbralSimilitud solo para esta corrida, sin tocar config/reglas.json.
//   --acumular <f>   guarda lo leído en <f> y verifica sobre todo lo juntado en las últimas 48 h, no solo sobre esta lectura.
//   --sin-leer       solo con --acumular: no lee los feeds, trabaja con lo que ya está en <f> y no lo modifica.
//   --json <f>       guarda las notas de esta lectura (con --sin-leer, las del archivo acumulado).
// Con proxy: NODE_USE_ENV_PROXY=1 node scripts/leer.js
const { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } = require('node:fs');
const { dirname } = require('node:path');
const { leerFeeds } = require('../src/lector.js');
const { preparar, acumular } = require('../src/nucleo.js');
const reglasBase = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const { feeds } = require('../config/feeds.json');
const { firmas } = require('../config/firmas.json');

const ZONA = 'America/Argentina/Buenos_Aires';

// Un error de uso se muestra como mensaje, sin el rastro del programa.
class ErrorDeUso extends Error {}

/* ───────────── el archivo de notas acumuladas ───────────── */

// Una lista de notas. Si no existe, arranca vacía. Si existe pero no sirve, corta y no lo pisa.
function cargarNotas(archivo) {
  if (!existsSync(archivo)) return [];
  let datos;
  try {
    datos = JSON.parse(readFileSync(archivo, 'utf8'));
  } catch (e) {
    throw new ErrorDeUso(`${archivo} existe pero no es JSON válido (${e.message}). No lo toqué: revisalo o borralo a mano.`);
  }
  if (!Array.isArray(datos)) throw new ErrorDeUso(`${archivo} existe pero no es una lista de notas. No lo toqué.`);
  return datos;
}

// Se escribe en un archivo aparte y después se renombra: si el programa se corta a la mitad, el archivo bueno queda como estaba.
function guardarNotas(archivo, notas) {
  mkdirSync(dirname(archivo), { recursive: true });
  const temporal = `${archivo}.tmp`;
  writeFileSync(temporal, JSON.stringify(notas));
  renameSync(temporal, archivo);
}

/* ───────────── texto ───────────── */

const miles = n => n.toLocaleString('es-AR');

// "3/10/26 14:10", en hora de Argentina.
function fechaCorta(iso) {
  const d = new Date(iso);
  const dia = d.toLocaleDateString('es-AR', { timeZone: ZONA, dateStyle: 'short' });
  const hora = d.toLocaleTimeString('es-AR', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hour12: false });
  return `${dia} ${hora}`;
}

function lineaAcumulado(archivo, { notas, agregadas, repetidas, borradas }, reglas) {
  const vieja = notas.length ? ` · la más vieja: ${fechaCorta(notas[0].fecha)}` : '';
  return `ACUMULADO · ${miles(notas.length)} notas en ${archivo} (${miles(agregadas.length)} nuevas, ${miles(repetidas.length)} repetidas, ${miles(borradas.length)} borradas por tener más de ${reglas.ventanaRecoleccionHoras} h)${vieja}`;
}

const corto = (t, n) => (t.length > n ? t.slice(0, n - 1) + '…' : t);
const barra = (n, max) => '█'.repeat(Math.max(n ? 1 : 0, Math.round((n / max) * 30)));
const fila = (etiqueta, n, max, nota = '') => console.log(`${etiqueta.padEnd(38)} ${String(n).padStart(4)} ${barra(n, max)} ${nota}`);

// "abarca": entre la nota más nueva y la más vieja que trae un feed. Un feed que abarca poco (Clarín, Infobae)
// solo deja verificar noticias muy recientes en una sola lectura.
const abarca = (notas, nombre) => {
  const ts = notas.filter(n => n.feed === nombre).map(n => Date.parse(n.fecha));
  return ts.length ? `abarca ${((Math.max(...ts) - Math.min(...ts)) / 36e5).toFixed(1)} h` : '';
};

/* ───────────── opciones ───────────── */

function leerOpciones(args, reglasBase) {
  const valor = bandera => {
    const i = args.indexOf(bandera);
    if (i < 0) return null;
    const v = args[i + 1];
    if (v === undefined || v.startsWith('--')) throw new ErrorDeUso(`${bandera} necesita un valor.`);
    return v;
  };
  const archivoAcum = valor('--acumular');
  const sinLeer = args.includes('--sin-leer');
  if (sinLeer && !archivoAcum) throw new ErrorDeUso('--sin-leer solo vale junto con --acumular <archivo>.');
  const umbral = valor('--umbral');
  const reglas = { ...reglasBase };
  if (umbral !== null) {
    if (!Number.isFinite(Number(umbral))) throw new ErrorDeUso(`--umbral tiene que ser un número, no "${umbral}".`);
    reglas.umbralSimilitud = Number(umbral);
  }
  return { reglas, archivoAcum, sinLeer, salidaJson: valor('--json') };
}

/* ───────────── el comando ───────────── */

async function main() {
  const { reglas, archivoAcum, sinLeer, salidaJson } = leerOpciones(process.argv.slice(2), reglasBase);
  const ahora = new Date().toISOString();
  const hora = new Date().toLocaleString('es-AR', { timeZone: ZONA, dateStyle: 'short', timeStyle: 'short' });

  // Se carga antes de salir a internet: si el archivo está roto, se corta sin gastar una lectura.
  const guardadas = archivoAcum ? cargarNotas(archivoAcum) : [];
  if (sinLeer && !existsSync(archivoAcum)) throw new ErrorDeUso(`--sin-leer necesita un archivo que ya exista: ${archivoAcum} no está.`);

  const lectura = sinLeer ? null : await leerFeeds(feeds, { ahora });
  let notas = sinLeer ? guardadas : lectura.notas;
  let acumulado = null;
  if (archivoAcum && !sinLeer) {
    acumulado = acumular(guardadas, lectura.notas, { reglas, ahora });
    guardarNotas(archivoAcum, acumulado.notas);
    notas = acumulado.notas;
  }
  if (salidaJson) writeFileSync(salidaJson, JSON.stringify(sinLeer ? notas : lectura.notas, null, 2));

  if (lectura) {
    console.log(`\nLECTURA · ${hora} (hora de Argentina)\n`);
    for (const f of lectura.feeds) {
      const motivos = Object.entries(f.descartadas).map(([m, n]) => `${m}: ${n}`).join(', ');
      console.log(`${f.estado === 'ok' ? 'OK ' : 'MAL'} ${f.nombre.padEnd(20)} ${String(f.notas).padStart(3)} notas  ${abarca(notas, f.nombre).padEnd(14)}${motivos ? `  (descartadas: ${motivos})` : ''}${f.estado !== 'ok' ? `  ${f.detalle}` : ''}`);
    }
  } else {
    console.log(`\nSin leer: se usan las ${miles(notas.length)} notas de ${archivoAcum}\n`);
    for (const f of feeds) console.log(`    ${f.nombre.padEnd(20)} ${String(notas.filter(n => n.feed === f.nombre).length).padStart(4)} notas  ${abarca(notas, f.nombre)}`);
  }
  if (acumulado) console.log(`\n${lineaAcumulado(archivoAcum, acumulado, reglas)}`);

  const p = preparar(notas, { portales, reglas, firmas, ahora });
  const r = p.resumen;
  console.log(`\nEMBUDO · datos reales, sin el juicio de la IA · umbral de similitud ${reglas.umbralSimilitud}${archivoAcum ? ' · sobre lo acumulado' : ''}\n`);
  fila('Notas leídas', r.notasEntrada, r.notasEntrada);
  fila('  fuera de la ventana de 48 h', r.fueraDeVentana, r.notasEntrada);
  fila('  − criterio 1 (opinión, servicio)', r.notasDescartadas, r.notasEntrada, 'no cuentan para verificar');
  fila('Hechos (misma noticia agrupada)', r.hechos, r.notasEntrada);
  fila('  − sin 5 grupos ni firma', r.enObservacion, r.notasEntrada, '→ En observación');
  fila('Verificados', r.candidatos, r.notasEntrada);
  fila('    vía A: 5 grupos de medios', r.candidatos - r.viaB, r.notasEntrada);
  fila('    vía B: firma reconocida', r.viaB, r.notasEntrada);

  // Cuántos hechos hay con 1, 2, 3, 4 o 5 o más grupos (los viejos que no llegaron salen de los motivos).
  const porGrupos = {};
  const suma = n => { const k = Math.min(n, 5); porGrupos[k] = (porGrupos[k] || 0) + 1; };
  p.candidatos.forEach(c => suma(c.gruposIndependientes));
  p.enObservacion.forEach(o => suma(o.gruposIndependientes));
  p.descartadas.filter(d => d.tipo === 'hecho').forEach(d => { const m = d.motivo.match(/\((\d+)\//); if (m) suma(Number(m[1])); });
  console.log('\nHECHOS SEGÚN EN CUÁNTOS GRUPOS SALIERON');
  for (let k = 1; k <= 5; k++) fila(`  ${k === 5 ? '5 o más' : k + ' grupo' + (k > 1 ? 's' : '')}`, porGrupos[k] || 0, r.hechos);

  // Aproximado: el ámbito real lo decide la IA. Acá se cuenta si lo cubren al menos 2 feeds internacionales.
  const internacionales = new Set(feeds.filter(f => f.ambito === 'internacional').map(f => f.dominio));
  const conInternacional = p.candidatos.filter(c => c.notas.filter(n => internacionales.has(n.portal)).length >= 2);
  console.log(`\nVERIFICADOS con al menos 2 notas de feeds internacionales (aproximado): ${conInternacional.length} de ${r.candidatos}`);

  console.log('\nVERIFICADOS (hasta 15)');
  [...p.candidatos].sort((a, b) => b.gruposIndependientes - a.gruposIndependientes).slice(0, 15)
    .forEach(c => console.log(`  [${c.gruposIndependientes}] ${corto(c.titulo, 78)}`));

  const todos = [...(lectura ? lectura.avisos : []), ...p.avisos];
  if (todos.length) console.log('\nAVISOS\n  ' + todos.join('\n  '));
  console.log();
}

if (require.main === module) {
  main().catch(e => {
    if (e instanceof ErrorDeUso) console.error(`\nNo se pudo: ${e.message}\n`);
    else console.error(e);
    process.exit(1);
  });
}

module.exports = { cargarNotas, guardarNotas, lineaAcumulado, fechaCorta, leerOpciones, ErrorDeUso };
