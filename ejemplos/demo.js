'use strict';
// node ejemplos/demo.js  →  corre el núcleo sobre un día inventado y dibuja el embudo.
const { preparar, decidir } = require('../src/nucleo.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const dia = require('./dia-de-ejemplo.js');

const ctx = { portales, reglas, ahora: dia.ahora };
const p = preparar(dia.notas, ctx);
const d = decidir(p.candidatos, dia.juicios, ctx);

const barra = (n, max) => '█'.repeat(Math.max(n ? 1 : 0, Math.round((n / max) * 30)));
const fila = (etiqueta, n, max, nota = '') => console.log(`${etiqueta.padEnd(34)} ${String(n).padStart(3)} ${barra(n, max)} ${nota}`);

const r = p.resumen;
console.log('\nEMBUDO · día de ejemplo (inventado)\n');
fila('Notas que llegaron', r.notasEntrada, r.notasEntrada);
fila('  − criterio 1 (opinión, servicio)', r.notasDescartadas, r.notasEntrada, 'no cuentan para verificar');
fila('Hechos (misma noticia agrupada)', r.hechos, r.notasEntrada);
fila('  − menos de 5 grupos', r.enObservacion, r.notasEntrada, '→ En observación');
fila('Verificados (≥ 5 grupos)', r.candidatos, r.notasEntrada);
fila('  − criterios 2 a 6', d.descartadas.length, r.notasEntrada, '→ Descartadas, con motivo');
fila('  − variedad y cupo', d.reserva.length, r.notasEntrada, '→ Reserva');
fila('ENTRAN', d.nacionales.length + d.internacionales.length, r.notasEntrada, d.aviso || '');

const lista = (titulo, items) => {
  console.log(`\n${titulo}`);
  items.forEach((x, i) => console.log(`  ${i + 1}. [${x.impacto}] ${x.titulo}  (${x.gruposIndependientes} grupos)`));
};
lista('NACIONALES', d.nacionales);
lista('INTERNACIONALES', d.internacionales);

console.log('\nEN OBSERVACIÓN');
p.enObservacion.forEach(x => console.log(`  ${x.contador}  ${x.titulo}`));

console.log('\nRESERVA');
d.reserva.forEach(x => console.log(`  ${x.titulo}  → ${x.motivo}`));

console.log('\nDESCARTADAS (hechos)');
d.descartadas.forEach(x => console.log(`  ${x.titulo}  → ${x.motivo}`));
if (p.avisos.length) console.log('\nAVISOS\n  ' + p.avisos.join('\n  '));
console.log();
