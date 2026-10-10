'use strict';
// Una vuelta completa, sin IA: lee los feeds, acumula las notas, arma la lista con el bloque provisorio,
// la deja lista para la página y anota lo medido. Lo real vive en la carpeta de datos (datos/), que no se sube al repo.
// Uso: node scripts/vuelta.js [--carpeta datos] [--cada 30] [--sin-leer]
//   --carpeta <dir>  dónde vive todo lo real (por defecto datos): notas.json, pagina/, vueltas.jsonl y vuelta.lock.
//   --cada <min>     repite para siempre: la vuelta siguiente arranca <min> minutos después de que empezó la anterior. Se corta con Ctrl+C.
//   --sin-leer       no sale a internet ni escribe notas.json ni vueltas.jsonl; rehace pagina/lista.json con lo ya guardado.
// Códigos: 0 bien · 1 error de uso · 2 ningún feed respondió (la lista igual se rehizo con lo guardado) · 3 hay otra vuelta corriendo.
// Con proxy: NODE_USE_ENV_PROXY=1 node scripts/vuelta.js
const { appendFileSync, copyFileSync, existsSync, mkdirSync, renameSync, rmSync, statSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { leerFeeds } = require('../src/lector.js');
const { acumular, preparar, decidir } = require('../src/nucleo.js');
const { juiciosProvisorios } = require('../src/provisorio.js');
const { armarEntrega } = require('../src/entrega.js');
const { cargarNotas, guardarNotas, filtrarRutas, fechaCorta, ErrorDeUso } = require('./leer.js');
const configReglas = require('../config/reglas.json');
const configPortales = require('../config/portales.json').portales;
const configFeeds = require('../config/feeds.json').feeds;
const configFirmas = require('../config/firmas.json').firmas;

const ZONA = 'America/Argentina/Buenos_Aires';
const CANDADO_MINUTOS = 25;
const PAGINA_DEL_REPO = join(__dirname, '..', 'pagina');

/* ───────────── opciones ───────────── */

function leerOpciones(args) {
  const valor = bandera => {
    const i = args.indexOf(bandera);
    if (i < 0) return null;
    const v = args[i + 1];
    if (v === undefined || v.startsWith('--')) throw new ErrorDeUso(`${bandera} necesita un valor.`);
    return v;
  };
  const cada = valor('--cada');
  if (cada !== null && !/^\d+$/.test(cada)) throw new ErrorDeUso(`--cada tiene que ser un número entero de minutos, 1 o más, no "${cada}".`);
  if (cada !== null && Number(cada) < 1) throw new ErrorDeUso('--cada tiene que ser de 1 minuto o más.');
  return { carpeta: valor('--carpeta') || 'datos', cada: cada === null ? null : Number(cada), sinLeer: args.includes('--sin-leer') };
}

/* ───────────── lo que se mide ───────────── */

// Cuántos hechos hay con 1, 2, 3, 4 o 5 o más grupos, contados igual que scripts/leer.js.
function hechosPorGrupos(p) {
  const por = { 1: 0, 2: 0, 3: 0, 4: 0, '5+': 0 };
  const suma = n => { por[n >= 5 ? '5+' : n] = (por[n >= 5 ? '5+' : n] || 0) + 1; };
  p.candidatos.forEach(c => suma(c.gruposIndependientes));
  p.enObservacion.forEach(o => suma(o.gruposIndependientes));
  for (const d of p.descartadas) {
    if (d.tipo !== 'hecho') continue;
    const m = d.motivo.match(/\((\d+)\//);
    if (m) suma(Number(m[1]));
  }
  return por;
}

function armarLinea({ ahora, duracionMs, lectura, acumulado, p, juicios, d }) {
  const feeds = lectura ? lectura.feeds : [];
  const mal = feeds.filter(f => f.estado !== 'ok');
  return {
    hora: ahora,
    duracionMs,
    feeds: { ok: feeds.length - mal.length, mal: mal.length, caidos: mal.map(f => f.nombre) },
    notas: {
      leidas: lectura ? lectura.notas.length : 0,
      nuevas: acumulado.agregadas.length,
      repetidas: acumulado.repetidas.length,
      borradas: acumulado.borradas.length,
      acumuladas: acumulado.notas.length,
    },
    hechos: { total: p.resumen.hechos, porGrupos: hechosPorGrupos(p) },
    confirmados: p.candidatos.map(c => ({ id: c.id, bloque: juicios[c.id].bloque, grupos: c.gruposIndependientes, via: c.via, viejo: c.viejo, titulo: c.titulo })),
    cuatroDeCinco: p.elegiblesAMano.map(c => ({ id: c.id, bloque: juicios[c.id].bloque, grupos: c.gruposIndependientes, conFirma: (c.firmasReconocidas || []).length > 0, titulo: c.titulo })),
    lista: {
      nacional: d.nacionales.length,
      internacional: d.internacionales.length,
      aManoNacional: d.aMano.nacional.length,
      aManoInternacional: d.aMano.internacional.length,
      noFresco: d.descartadas.filter(x => x.motivo.startsWith('no_fresco')).length,
    },
    avisos: [...(lectura ? lectura.avisos : []), ...p.avisos, ...d.avisos],
  };
}

function resumenEnPantalla({ linea, carpeta, codigo, sinLeer }) {
  const g = linea.hechos.porGrupos;
  const cuenta = bloque => linea.confirmados.filter(c => c.bloque === bloque).length;
  const mano = bloque => linea.cuatroDeCinco.filter(c => c.bloque === bloque).length;
  return [
    `VUELTA · ${fechaCorta(linea.hora)} (hora de Argentina)${sinLeer ? ' · sin leer, con lo ya guardado' : ''}`,
    sinLeer ? 'Feeds: no se leyeron' : `Feeds: ${linea.feeds.ok} OK · ${linea.feeds.mal} caídos${linea.feeds.caidos.length ? ` (${linea.feeds.caidos.join(', ')})` : ''}`,
    `Notas: ${linea.notas.leidas} leídas · ${linea.notas.nuevas} nuevas · ${linea.notas.acumuladas} acumuladas`,
    `Hechos según grupos: 1: ${g[1]} · 2: ${g[2]} · 3: ${g[3]} · 4: ${g[4]} · 5+: ${g['5+']}`,
    `Confirmados: ${cuenta('nacional')} nacionales + ${cuenta('internacional')} internacionales`,
    `4/5 (les falta 1 medio): ${mano('nacional')} nacionales + ${mano('internacional')} internacionales`,
    `Lista: ${linea.lista.nacional} nacionales + ${linea.lista.internacional} internacionales`,
    `Escribí: ${join(carpeta, 'pagina', 'lista.json')}`,
    `Código de salida: ${codigo}`,
  ];
}

/* ───────────── escribir ───────────── */

function escribirLista(archivo, lista) {
  const temporal = `${archivo}.tmp`;
  writeFileSync(temporal, JSON.stringify(lista, null, 2) + '\n');
  renameSync(temporal, archivo);
}

// Lo que algún día se sube al hosting: la lista y copias frescas de la página del repo.
function escribirPagina(carpeta, lista) {
  const dir = join(carpeta, 'pagina');
  mkdirSync(dir, { recursive: true });
  escribirLista(join(dir, 'lista.json'), lista);
  copyFileSync(join(PAGINA_DEL_REPO, 'index.html'), join(dir, 'index.html'));
  copyFileSync(join(PAGINA_DEL_REPO, 'logica.js'), join(dir, 'logica.js'));
}

const horaAR = fecha => fecha.toLocaleTimeString('es-AR', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hour12: false });

/* ───────────── una vuelta ───────────── */

// → { codigo, resumen: [líneas], linea } (con el candado fresco no hay `linea`).
// `feeds`, `portales`, `reglas` y `firmas` salen de config/; se pueden pasar otros (los tests lo hacen).
async function vuelta({ carpeta = 'datos', ahora = new Date().toISOString(), fetch = globalThis.fetch, sinLeer = false,
  feeds = configFeeds, portales = configPortales, reglas = configReglas, firmas = configFirmas } = {}) {
  const inicio = Date.now();
  const archivoNotas = join(carpeta, 'notas.json');
  const candado = join(carpeta, 'vuelta.lock');

  if (sinLeer && !existsSync(archivoNotas)) throw new ErrorDeUso(`--sin-leer necesita un archivo que ya exista: ${archivoNotas} no está.`);

  // 1. Candado: si otra vuelta corre desde hace menos de 25 minutos, no se hace nada.
  if (existsSync(candado)) {
    const desde = statSync(candado).mtime;
    if (Date.now() - desde.getTime() < CANDADO_MINUTOS * 60000) {
      return { codigo: 3, resumen: [`Hay otra vuelta corriendo desde las ${horaAR(desde)} (vuelta.lock). No se hace nada.`] };
    }
  }
  mkdirSync(carpeta, { recursive: true });
  writeFileSync(candado, ahora);
  try {
    // 2. Lo guardado (si el archivo está roto, corta acá y no se escribe nada).
    const guardadas = filtrarRutas(cargarNotas(archivoNotas), feeds).notas;
    // 3. Leer.
    const lectura = sinLeer ? null : await leerFeeds(feeds, { ahora, fetch });
    // 4. Acumular y guardar (aunque no haya respondido ningún feed: así se sacan las que pasaron las 48 h).
    let acumulado = { notas: guardadas, agregadas: [], repetidas: [], borradas: [] };
    if (!sinLeer) {
      acumulado = acumular(guardadas, lectura.notas, { reglas, ahora });
      guardarNotas(archivoNotas, acumulado.notas);
    }
    // 5 a 8. Preparar, juicios provisorios, decidir y la entrega.
    const p = preparar(acumulado.notas, { portales, reglas, firmas, ahora });
    const juicios = juiciosProvisorios(p, { portales, reglas });
    const d = decidir(p.candidatos, juicios, { reglas, elegiblesAMano: p.elegiblesAMano });
    const lista = armarEntrega(d, { ahora, portales, reglas, ejemplo: false, sinIA: true });
    // 9. La carpeta de la página.
    escribirPagina(carpeta, lista);
    // 10. La línea de la medición.
    const linea = armarLinea({ ahora, duracionMs: Date.now() - inicio, lectura, acumulado, p, juicios, d });
    if (!sinLeer) appendFileSync(join(carpeta, 'vueltas.jsonl'), JSON.stringify(linea) + '\n');
    // 12. Código de salida: 2 si ningún feed respondió.
    const codigo = !sinLeer && linea.feeds.ok === 0 ? 2 : 0;
    // 11. El resumen en pantalla.
    return { codigo, resumen: resumenEnPantalla({ linea, carpeta, codigo, sinLeer }), linea };
  } finally {
    rmSync(candado, { force: true });
  }
}

/* ───────────── el comando ───────────── */

const pausa = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const { carpeta, cada, sinLeer } = leerOpciones(process.argv.slice(2));
  if (cada === null) {
    const r = await vuelta({ carpeta, sinLeer });
    console.log('\n' + r.resumen.join('\n') + '\n');
    process.exitCode = r.codigo;
    return;
  }
  for (;;) {
    const empezo = Date.now();
    try {
      const r = await vuelta({ carpeta, sinLeer });
      console.log('\n' + r.resumen.join('\n') + '\n');
    } catch (e) {
      console.error(`\nLa vuelta falló: ${e instanceof ErrorDeUso ? e.message : e.stack || e}\n`);
    }
    await pausa(Math.max(0, cada * 60000 - (Date.now() - empezo)));
  }
}

if (require.main === module) {
  main().catch(e => {
    if (e instanceof ErrorDeUso) console.error(`\nNo se pudo: ${e.message}\n`);
    else console.error(e);
    process.exit(1);
  });
}

module.exports = { vuelta, leerOpciones, hechosPorGrupos, armarLinea, resumenEnPantalla };
