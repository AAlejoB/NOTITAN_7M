'use strict';
// node ejemplos/demo.js  →  corre el núcleo sobre un día inventado y dibuja el embudo.
const { preparar, decidir } = require('../src/nucleo.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const dia = require('./dia-de-ejemplo.js');

const ctx = { portales, reglas, firmas: dia.firmas, ahora: dia.ahora };
const p = preparar(dia.notas, ctx);
const d = decidir(p.candidatos, dia.juicios, { ...ctx, elegiblesAMano: p.elegiblesAMano });

const barra = (n, max) => '█'.repeat(Math.max(n ? 1 : 0, Math.round((n / max) * 30)));
const fila = (etiqueta, n, max, nota = '') => console.log(`${etiqueta.padEnd(34)} ${String(n).padStart(3)} ${barra(n, max)} ${nota}`);

const r = p.resumen;
console.log('\nEMBUDO · día de ejemplo (inventado)\n');
fila('Notas que llegaron', r.notasEntrada, r.notasEntrada);
fila('  − criterio 1 (opinión, servicio)', r.notasDescartadas, r.notasEntrada, 'no cuentan para verificar');
fila('Hechos (misma noticia agrupada)', r.hechos, r.notasEntrada);
fila('  − sin 5 grupos ni firma', r.enObservacion, r.notasEntrada, '→ En observación');
fila('    les falta 1 medio', r.elegiblesAMano, r.notasEntrada, '→ se pueden elegir a mano');
fila('Verificados', r.candidatos, r.notasEntrada);
fila('    vía A: 5 grupos de medios', r.candidatos - r.viaB, r.notasEntrada);
fila('    vía B: firma reconocida', r.viaB, r.notasEntrada, '→ segunda línea, va después');
fila('  − criterios 2 a 6', d.descartadas.length, r.notasEntrada, '→ Descartadas, con motivo');
fila('  − variedad y cupo', d.reserva.length, r.notasEntrada, '→ Reserva');
fila('ENTRAN', d.nacionales.length + d.internacionales.length, r.notasEntrada, d.aviso || '');

const lista = (titulo, items) => {
  console.log(`\n${titulo}`);
  items.forEach((x, i) => console.log(`  ${i + 1}. [${x.impacto}] ${x.titulo}  · ${x.etiqueta}`));
};
lista('NACIONALES', d.nacionales);
lista('INTERNACIONALES', d.internacionales);

console.log('\nPARA ELEGIR A MANO (les falta 1 medio; nunca entran solas)');
const sublista = (titulo, items) => {
  console.log(`  ${titulo}`);
  if (!items.length) console.log('    (ninguna)');
  items.forEach((x, i) => console.log(`    ${i + 1}. [${x.impacto}] ${x.titulo}  · ${x.etiqueta}`));
};
sublista('Nacionales', d.aMano.nacional);
sublista('Internacionales', d.aMano.internacional);

console.log('\nEN OBSERVACIÓN');
p.enObservacion.forEach(x => console.log(`  ${x.contador}${x.contadorFirmas ? ` (firmas ${x.contadorFirmas})` : ''}  ${x.titulo}${x.elegibleAMano ? '  ← se puede elegir a mano' : ''}`));

console.log('\nRESERVA');
d.reserva.forEach(x => console.log(`  ${x.titulo}  → ${x.motivo}`));

console.log('\nDESCARTADAS (hechos)');
d.descartadas.forEach(x => console.log(`  ${x.titulo}  → ${x.motivo}`));
if (p.avisos.length) console.log('\nAVISOS\n  ' + p.avisos.join('\n  '));
console.log();
