'use strict';
// Arma pagina/lista.json: lo que muestra la página. Por ahora corre sobre el DÍA DE EJEMPLO (inventado),
// porque todavía no hay una IA que juzgue las noticias reales. La lista sale marcada con ejemplo: true.
// Uso: node scripts/armar-pagina.js   (o npm run pagina)
// `generadaEn` es la hora de ahora, así la página no sale "vieja". pagina/lista.json se commitea (son datos inventados).
const { writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { preparar, decidir } = require('../src/nucleo.js');
const { armarEntrega } = require('../src/entrega.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const dia = require('../ejemplos/dia-de-ejemplo.js');

const destino = join(__dirname, '..', 'pagina', 'lista.json');

// Corre preparar y decidir sobre el día de ejemplo con su propia hora (dia.ahora), como ejemplos/demo.js.
function armarLista(ahora) {
  const ctx = { portales, reglas, firmas: dia.firmas, ahora: dia.ahora };
  const p = preparar(dia.notas, ctx);
  const d = decidir(p.candidatos, dia.juicios, { ...ctx, elegiblesAMano: p.elegiblesAMano });
  return armarEntrega(d, { ahora, portales, reglas, ejemplo: true });
}

function main() {
  const lista = armarLista(new Date().toISOString());
  writeFileSync(destino, JSON.stringify(lista, null, 2) + '\n');
  for (const [nombre, b] of Object.entries(lista.bloques)) {
    console.log(`${nombre.padEnd(14)} ${String(b.noticias.length).padStart(2)} noticias · ${b.aMano.length} a las que les falta 1 medio · ${b.afueraPorTope} afuera por tope`);
  }
  console.log(`pagina/lista.json · ejemplo: ${lista.ejemplo} · generada ${lista.generadaEn}`);
}

if (require.main === module) main();

module.exports = { armarLista };
