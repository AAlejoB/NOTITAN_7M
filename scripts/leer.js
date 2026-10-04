'use strict';
// Lee los feeds de config/feeds.json, arma las notas con src/lector.js y corre preparar() del núcleo
// para ver el embudo con datos reales. No juzga (falta la IA): muestra hechos, candidatos y En observación.
// Uso: node scripts/leer.js [--json notas.json] [--umbral 0.3]      Con proxy: NODE_USE_ENV_PROXY=1 node scripts/leer.js
// --umbral prueba otro umbralSimilitud solo para esta corrida, sin tocar config/reglas.json.
const { readFileSync, writeFileSync } = require('node:fs');
const { leerFeeds } = require('../src/lector.js');
const { preparar } = require('../src/nucleo.js');
const reglasBase = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const { feeds } = require('../config/feeds.json');
const { firmas } = require('../config/firmas.json');

const args = process.argv.slice(2);
const iJson = args.indexOf('--json');
const salidaJson = iJson >= 0 ? args[iJson + 1] : null;
const iUmbral = args.indexOf('--umbral');
const reglas = iUmbral >= 0 ? { ...reglasBase, umbralSimilitud: Number(args[iUmbral + 1]) } : reglasBase;

const corto = (t, n) => (t.length > n ? t.slice(0, n - 1) + '…' : t);
const barra = (n, max) => '█'.repeat(Math.max(n ? 1 : 0, Math.round((n / max) * 30)));
const fila = (etiqueta, n, max, nota = '') => console.log(`${etiqueta.padEnd(38)} ${String(n).padStart(4)} ${barra(n, max)} ${nota}`);

async function main() {
  const ahora = new Date().toISOString();
  const hora = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', dateStyle: 'short', timeStyle: 'short' });
  const lectura = await leerFeeds(feeds, { ahora });
  const { notas } = lectura;
  if (salidaJson) writeFileSync(salidaJson, JSON.stringify(notas, null, 2));

  console.log(`\nLECTURA · ${hora} (hora de Argentina)\n`);
  // "abarca": entre la nota más nueva y la más vieja que trae cada feed. Un feed que abarca poco (Clarín, Infobae)
  // solo deja verificar noticias muy recientes en una sola lectura.
  const abarca = nombre => {
    const ts = notas.filter(n => n.feed === nombre).map(n => Date.parse(n.fecha));
    return ts.length ? `abarca ${((Math.max(...ts) - Math.min(...ts)) / 36e5).toFixed(1)} h` : '';
  };
  for (const f of lectura.feeds) {
    const motivos = Object.entries(f.descartadas).map(([m, n]) => `${m}: ${n}`).join(', ');
    console.log(`${f.estado === 'ok' ? 'OK ' : 'MAL'} ${f.nombre.padEnd(20)} ${String(f.notas).padStart(3)} notas  ${abarca(f.nombre).padEnd(14)}${motivos ? `  (descartadas: ${motivos})` : ''}${f.estado !== 'ok' ? `  ${f.detalle}` : ''}`);
  }

  const p = preparar(notas, { portales, reglas, firmas, ahora });
  const r = p.resumen;
  console.log(`\nEMBUDO · datos reales, sin el juicio de la IA · umbral de similitud ${reglas.umbralSimilitud}\n`);
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

  const todos = [...lectura.avisos, ...p.avisos];
  if (todos.length) console.log('\nAVISOS\n  ' + todos.join('\n  '));
  console.log();
}

main().catch(e => { console.error(e); process.exit(1); });
