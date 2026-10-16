'use strict';
// Una vuelta completa, sin IA: lee los feeds, acumula las notas, arma la lista con el bloque provisorio,
// la deja lista para la página y anota lo medido. Lo real vive en la carpeta de datos (datos/), que no se sube al repo.
// Uso: node scripts/vuelta.js [--carpeta datos] [--cada 30] [--sin-leer] [--config <carpeta> | --zona <carpeta>]
//   --carpeta <dir>  dónde vive todo lo real (por defecto datos): notas.json, pagina/, vueltas.jsonl y vuelta.lock.
//   --cada <min>     repite para siempre: la vuelta siguiente arranca <min> minutos después de que empezó la anterior. Se corta con Ctrl+C.
//   --sin-leer       no sale a internet ni escribe notas.json ni vueltas.jsonl; rehace pagina/lista.json con lo ya guardado.
//   --config <dir>   usa los feeds.json y portales.json de esa carpeta; su reglas.json (si hay) pisa claves de config/reglas.json,
//                    y su firmas.json (si hay) reemplaza la lista de firmas. Sirve para medir otra lista de feeds aparte.
//   --zona <dir>     además de lo nacional, en la misma vuelta, la zona de esa carpeta (config/zona: Comodoro y Chubut):
//                    sus notas viven en <carpeta>/zona/notas.json y sus anillos van primero en la lista. No va con --config.
// Códigos: 0 bien · 1 error de uso · 2 ningún feed respondió (la lista igual se rehizo con lo guardado) · 3 hay otra vuelta corriendo.
// Con proxy: NODE_USE_ENV_PROXY=1 node scripts/vuelta.js
const { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { leerFeeds } = require('../src/lector.js');
const { acumular, preparar, decidir, buscarPortal, dominioDe } = require('../src/nucleo.js');
const { juiciosProvisorios } = require('../src/provisorio.js');
const { armarEntrega } = require('../src/entrega.js');
const { decidirZona } = require('../src/zona.js');
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
  const config = valor('--config');
  const zona = valor('--zona');
  if (config !== null && zona !== null) throw new ErrorDeUso('--zona y --config no van juntas.');
  return { carpeta: valor('--carpeta') || 'datos', cada: cada === null ? null : Number(cada), sinLeer: args.includes('--sin-leer'), config, zona };
}

// --config <carpeta>: feeds.json y portales.json obligatorios; reglas.json pisa claves de primer nivel de config/reglas.json
// (un objeto se reemplaza entero, no se mezcla); firmas.json, si no está, deja la lista vacía.
function cargarConfig(carpeta, bandera = '--config') {
  const leerJson = archivo => JSON.parse(readFileSync(join(carpeta, archivo), 'utf8'));
  for (const archivo of ['feeds.json', 'portales.json']) {
    if (!existsSync(join(carpeta, archivo))) {
      throw new ErrorDeUso(`${bandera} necesita una carpeta con feeds.json y portales.json: ${join(carpeta, archivo)} no está.`);
    }
  }
  const hay = archivo => existsSync(join(carpeta, archivo));
  return {
    feeds: leerJson('feeds.json').feeds,
    portales: leerJson('portales.json').portales,
    reglas: hay('reglas.json') ? { ...configReglas, ...leerJson('reglas.json') } : configReglas,
    firmas: hay('firmas.json') ? leerJson('firmas.json').firmas : [],
  };
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

// Los grupos distintos de las notas de un hecho, en el orden de las notas (el dominio, si el portal no está en la lista).
function mediosDe(hecho, portales) {
  const grupos = hecho.notas.map(n => { const d = dominioDe(n); return (buscarPortal(d, portales) || {}).grupo || d; });
  return [...new Set(grupos)];
}

function cuentaFeeds(lectura) {
  const feeds = lectura ? lectura.feeds : [];
  const mal = feeds.filter(f => f.estado !== 'ok');
  return { ok: feeds.length - mal.length, mal: mal.length, caidos: mal.map(f => f.nombre) };
}

function cuentaNotas(lectura, acumulado) {
  return {
    leidas: lectura ? lectura.notas.length : 0,
    nuevas: acumulado.agregadas.length,
    repetidas: acumulado.repetidas.length,
    borradas: acumulado.borradas.length,
    acumuladas: acumulado.notas.length,
  };
}

// zona: { lectura, acumulado, p, z (lo de decidirZona), reglas } o null. Sin zona, la línea es la de siempre.
function armarLinea({ ahora, duracionMs, lectura, acumulado, p, juicios, d, portales = [], zona = null }) {
  const linea = {
    hora: ahora,
    duracionMs,
    feeds: cuentaFeeds(lectura),
    notas: cuentaNotas(lectura, acumulado),
    hechos: { total: p.resumen.hechos, porGrupos: hechosPorGrupos(p) },
    confirmados: p.candidatos.map(c => ({ id: c.id, bloque: juicios[c.id].bloque, grupos: c.gruposIndependientes, via: c.via, viejo: c.viejo, medios: mediosDe(c, portales), titulo: c.titulo })),
    cuatroDeCinco: p.elegiblesAMano.map(c => ({ id: c.id, bloque: juicios[c.id].bloque, grupos: c.gruposIndependientes, conFirma: (c.firmasReconocidas || []).length > 0, medios: mediosDe(c, portales), titulo: c.titulo })),
    lista: {
      nacional: d.nacionales.length,
      internacional: d.internacionales.length,
      aManoNacional: d.aMano.nacional.length,
      aManoInternacional: d.aMano.internacional.length,
      noFresco: d.descartadas.filter(x => x.motivo.startsWith('no_fresco')).length,
    },
    avisos: [...(lectura ? lectura.avisos : []), ...p.avisos, ...d.avisos],
  };
  if (zona) {
    linea.zona = {
      feeds: cuentaFeeds(zona.lectura),
      notas: cuentaNotas(zona.lectura, zona.acumulado),
      hechos: { total: zona.p.resumen.hechos, porGrupos: hechosPorGrupos(zona.p) },
      confirmados: zona.z.confirmados,
      lista: Object.fromEntries((zona.reglas.anillos || []).map(a => [a.clave, zona.z.bloques[a.clave].noticias.length])),
    };
  }
  return linea;
}

// anillos: reglas.anillos de la zona (para los nombres), si hubo zona.
function resumenEnPantalla({ linea, carpeta, codigo, sinLeer, anillos = [] }) {
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
    ...(linea.zona ? resumenZona(linea.zona, sinLeer, anillos) : []),
    `Escribí: ${join(carpeta, 'pagina', 'lista.json')}`,
    `Código de salida: ${codigo}`,
  ];
}

function resumenZona(z, sinLeer, anillos) {
  const nombres = anillos.map(a => `${z.lista[a.clave] || 0} ${a.nombre}`).join(' + ') || 'sin anillos';
  const tambien = z.confirmados.filter(c => c.tambienNacional && !c.viejo).length;
  return [
    sinLeer ? 'Zona · feeds: no se leyeron' : `Zona · feeds: ${z.feeds.ok} OK · ${z.feeds.mal} caídos${z.feeds.caidos.length ? ` (${z.feeds.caidos.join(', ')})` : ''}`,
    `Zona · lista: ${nombres} · también nacionales: ${tambien}`,
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
// `zona`: lo que devuelve cargarConfig('config/zona') ({ feeds, portales, reglas }), o null para no correr la zona.
async function vuelta({ carpeta = 'datos', ahora = new Date().toISOString(), fetch = globalThis.fetch, sinLeer = false,
  feeds = configFeeds, portales = configPortales, reglas = configReglas, firmas = configFirmas, zona = null } = {}) {
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
    const archivoZona = join(carpeta, 'zona', 'notas.json');
    const guardadas = filtrarRutas(cargarNotas(archivoNotas), feeds).notas;
    const guardadasZona = zona ? filtrarRutas(cargarNotas(archivoZona), zona.feeds).notas : [];
    // 3. Leer (lo nacional y la zona a la vez).
    const [lectura, lecturaZona] = sinLeer ? [null, null]
      : await Promise.all([leerFeeds(feeds, { ahora, fetch }), zona ? leerFeeds(zona.feeds, { ahora, fetch }) : null]);
    // 4. Acumular y guardar (aunque no haya respondido ningún feed: así se sacan las que pasaron las 48 h).
    let acumulado = { notas: guardadas, agregadas: [], repetidas: [], borradas: [] };
    let acumuladoZona = { notas: guardadasZona, agregadas: [], repetidas: [], borradas: [] };
    if (!sinLeer) {
      acumulado = acumular(guardadas, lectura.notas, { reglas, ahora });
      guardarNotas(archivoNotas, acumulado.notas);
      if (zona) {
        acumuladoZona = acumular(guardadasZona, lecturaZona.notas, { reglas: zona.reglas, ahora });
        guardarNotas(archivoZona, acumuladoZona.notas);
      }
    }
    // 5 a 8. Preparar, juicios provisorios, decidir, la zona y la entrega.
    const p = preparar(acumulado.notas, { portales, reglas, firmas, ahora });
    const juicios = juiciosProvisorios(p, { portales, reglas });
    const d = decidir(p.candidatos, juicios, { reglas, elegiblesAMano: p.elegiblesAMano });
    let deZona = null;
    if (zona) {
      const pZona = preparar(acumuladoZona.notas, { portales: zona.portales, reglas: zona.reglas, firmas: [], ahora });
      const z = decidirZona(pZona, { portales: zona.portales, reglas: zona.reglas, hechosNacionales: [...p.candidatos, ...p.enObservacion] });
      deZona = { lectura: lecturaZona, acumulado: acumuladoZona, p: pZona, z, reglas: zona.reglas };
    }
    const lista = armarEntrega(d, { ahora, portales, reglas, ejemplo: false, sinIA: true, zona: deZona && { ...deZona.z, portales: zona.portales } });
    // 9. La carpeta de la página.
    escribirPagina(carpeta, lista);
    // 10. La línea de la medición.
    const linea = armarLinea({ ahora, duracionMs: Date.now() - inicio, lectura, acumulado, p, juicios, d, portales, zona: deZona });
    if (!sinLeer) appendFileSync(join(carpeta, 'vueltas.jsonl'), JSON.stringify(linea) + '\n');
    // 12. Código de salida: 2 si ningún feed respondió.
    const codigo = !sinLeer && linea.feeds.ok === 0 ? 2 : 0;
    // 11. El resumen en pantalla.
    return { codigo, resumen: resumenEnPantalla({ linea, carpeta, codigo, sinLeer, anillos: zona ? zona.reglas.anillos || [] : [] }), linea };
  } finally {
    rmSync(candado, { force: true });
  }
}

/* ───────────── el comando ───────────── */

const pausa = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const { carpeta, cada, sinLeer, config, zona } = leerOpciones(process.argv.slice(2));
  const otra = config === null ? {} : cargarConfig(config);
  if (zona !== null) otra.zona = cargarConfig(zona, '--zona');
  if (cada === null) {
    const r = await vuelta({ carpeta, sinLeer, ...otra });
    console.log('\n' + r.resumen.join('\n') + '\n');
    process.exitCode = r.codigo;
    return;
  }
  for (;;) {
    const empezo = Date.now();
    try {
      const r = await vuelta({ carpeta, sinLeer, ...otra });
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

module.exports = { vuelta, leerOpciones, cargarConfig, hechosPorGrupos, armarLinea, resumenEnPantalla };
