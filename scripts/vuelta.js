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
//                    Si la carpeta trae avisos.json, también el bloque «Avisos» (cortes de agua, luz y gas): lee la página de
//                    comunicados de la SCPL, guarda lo bajado en <carpeta>/zona/avisos.json y aparta de la zona las notas
//                    que son avisos (el molde de `cortes` de config/reglas.json): esas no entran a la verificación.
// Códigos: 0 bien · 1 error de uso · 2 ningún feed respondió (la lista igual se rehizo con lo guardado) · 3 hay otra vuelta corriendo.
// Con proxy: NODE_USE_ENV_PROXY=1 node scripts/vuelta.js
const { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { leerFeeds } = require('../src/lector.js');
const { acumular, preparar, decidir, buscarPortal, dominioDe } = require('../src/nucleo.js');
const { juiciosProvisorios } = require('../src/provisorio.js');
const { armarEntrega } = require('../src/entrega.js');
const { decidirZona } = require('../src/zona.js');
const { leerListadoScpl, leerNotaScpl, notasParaBajar, esAviso, esAvisoDeAca, armarAvisos } = require('../src/avisos.js');
const { cargarNotas, guardarNotas, filtrarRutas, fechaCorta, ErrorDeUso } = require('./leer.js');
const configReglas = require('../config/reglas.json');
const configPortales = require('../config/portales.json').portales;
const configFeeds = require('../config/feeds.json').feeds;
const configFirmas = require('../config/firmas.json').firmas;

const ZONA = 'America/Argentina/Buenos_Aires';
const CANDADO_MINUTOS = 25;
const AVISOS_DIAS = 30;
// El mismo user-agent que usa src/lector.js para los feeds.
const UA = 'Mozilla/5.0 (compatible; NOTITAN_7M lector)';
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
// avisos.json (si hay) son las fuentes del bloque Avisos, con cronograma-agua.json (si hay) en `cronograma`.
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
    ...(hay('avisos.json') ? { avisos: { ...leerJson('avisos.json'), cronograma: hay('cronograma-agua.json') ? leerJson('cronograma-agua.json') : null } } : {}),
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
// Las urls de las notas de un hecho, sin repetir: con ellas medir reconoce la misma noticia aunque cambie el id.
const urlsDeHecho = hecho => [...new Set(hecho.notas.map(n => n.url))];

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
// cortes: { lectura (lo de leerAvisos, o null sin leer), lista (lo de armarAvisos) } o null. Va en `cortes`, porque `avisos`
// ya es la lista de avisos de la vuelta (feeds caídos, «no se llegó al mínimo»…).
function armarLinea({ ahora, duracionMs, lectura, acumulado, p, juicios, d, portales = [], zona = null, cortes = null }) {
  const linea = {
    hora: ahora,
    duracionMs,
    feeds: cuentaFeeds(lectura),
    notas: cuentaNotas(lectura, acumulado),
    hechos: { total: p.resumen.hechos, porGrupos: hechosPorGrupos(p) },
    confirmados: p.candidatos.map(c => ({ id: c.id, bloque: juicios[c.id].bloque, grupos: c.gruposIndependientes, via: c.via, viejo: c.viejo, medios: mediosDe(c, portales), urls: urlsDeHecho(c), titulo: c.titulo })),
    cuatroDeCinco: p.elegiblesAMano.map(c => ({ id: c.id, bloque: juicios[c.id].bloque, grupos: c.gruposIndependientes, conFirma: (c.firmasReconocidas || []).length > 0, medios: mediosDe(c, portales), urls: urlsDeHecho(c), titulo: c.titulo })),
    lista: {
      nacional: d.nacionales.length,
      internacional: d.internacionales.length,
      aManoNacional: d.aMano.nacional.length,
      aManoInternacional: d.aMano.internacional.length,
      noFresco: d.descartadas.filter(x => x.motivo.startsWith('no_fresco')).length,
    },
    avisos: [...(lectura ? lectura.avisos : []), ...p.avisos, ...d.avisos, ...(cortes && cortes.lectura ? cortes.lectura.avisos : [])],
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
  if (cortes) {
    const l = cortes.lectura;
    linea.cortes = {
      fuentes: l ? l.fuentes : { ok: 0, mal: 0, caidas: [] },
      listados: l ? l.listados : 0,
      bajadas: l ? l.bajadas : 0,
      // apartadas: notas de portales que fueron a Avisos; sinLugar: avisos de un portal provincial que no nombran el lugar
      // (se quedaron en la zona).
      apartadas: cortes.apartadas || 0,
      sinLugar: cortes.sinLugar || 0,
      vigentes: cortes.lista.length,
      // urls: con ellas medir reconoce el mismo corte aunque cambie el id (cuando la SCPL se suma a un aviso de un portal).
      lista: cortes.lista.map(a => ({ id: a.id, servicio: a.servicio, programado: a.programado, dia: a.dia, zona: a.zona, fuentes: a.fuentes.length, cronograma: a.cronograma, urls: a.fuentes.map(f => f.url).filter(Boolean) })),
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
    ...(linea.cortes ? [resumenCortes(linea.cortes, sinLeer)] : []),
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

// «Avisos: 2 vigentes (1 agua programado, 1 luz) · SCPL OK»
function resumenCortes(c, sinLeer) {
  const tipos = new Map();
  for (const a of c.lista) {
    const t = `${a.servicio || 'corte'}${a.cronograma ? ' cronograma' : a.programado === true ? ' programado' : a.programado === false ? ' avería' : ''}`;
    tipos.set(t, (tipos.get(t) || 0) + 1);
  }
  const detalle = tipos.size ? ` (${[...tipos].map(([t, n]) => `${n} ${t}`).join(', ')})` : '';
  const fuentes = sinLeer ? 'fuentes: no se leyeron'
    : c.fuentes.caidas.length ? `sin leer: ${c.fuentes.caidas.join(', ')}` : `SCPL OK · ${c.listados} comunicados en el listado · ${c.bajadas} bajados`;
  return `Avisos: ${c.vigentes} ${c.vigentes === 1 ? 'vigente' : 'vigentes'}${detalle} · ${fuentes}`;
}

/* ───────────── los avisos: bajar de la SCPL ───────────── */

async function bajarHtml(url, fetch, timeoutMs = 20000) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), timeoutMs);
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html, */*' }, redirect: 'follow', signal: control.signal });
    if (r.status >= 400) return { error: `HTTP ${r.status}` };
    return { html: await r.text() };
  } catch (e) {
    return { error: (e.cause && e.cause.code) || e.name || String(e) };
  } finally {
    clearTimeout(reloj);
  }
}

// Baja el listado de cada fuente y las notas nuevas que valen (como mucho maxNotasPorVuelta). Lo ya bajado no se vuelve a bajar.
// → { notas (las guardadas más las nuevas, de los últimos 30 días), listados, bajadas, fuentes: { ok, mal, caidas }, avisos }
async function leerAvisos(cfg, guardadas, { ahora, fetch, reglas }) {
  const notas = [...guardadas];
  const caidas = [];
  const avisos = [];
  let ok = 0;
  let listados = 0;
  let bajadas = 0;
  for (const f of (cfg.fuentes || []).filter(x => x.formato === 'scpl')) {
    const r = await bajarHtml(f.listado, fetch);
    const listado = r.error ? [] : leerListadoScpl(r.html);
    if (r.error || !listado.length) { caidas.push(`${f.nombre} (${r.error || 'el listado no trae comunicados'})`); continue; }
    ok++;
    listados += listado.length;
    const deEsta = notas.filter(n => dominioDe(n) === f.dominio);
    for (const x of notasParaBajar(listado, deEsta, { ahora, reglas, cfg })) {
      const rn = await bajarHtml(f.nota.replace('{id}', x.id), fetch);
      if (rn.error) { avisos.push(`Nota de aviso sin bajar: ${f.nombre} ${x.id} (${rn.error})`); continue; }
      notas.push({ ...leerNotaScpl(rn.html, x, f), bajadaEn: ahora });
      bajadas++;
    }
  }
  const limite = Date.parse(ahora) - AVISOS_DIAS * 24 * 3600 * 1000;
  return {
    notas: notas.filter(n => Date.parse(n.fecha) >= limite),
    listados,
    bajadas,
    fuentes: { ok, mal: caidas.length, caidas },
    avisos: [...caidas.map(c => `Fuente de avisos sin leer: ${c}`), ...avisos],
  };
}

function cargarAvisos(archivo) {
  if (!existsSync(archivo)) return [];
  try {
    const datos = JSON.parse(readFileSync(archivo, 'utf8'));
    if (datos && Array.isArray(datos.notas)) return datos.notas;
  } catch (e) {
    throw new ErrorDeUso(`${archivo} existe pero no es JSON válido (${e.message}). No lo toqué: revisalo o borralo a mano.`);
  }
  throw new ErrorDeUso(`${archivo} existe pero no trae { notas: [...] }. No lo toqué.`);
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
    const conAvisos = Boolean(zona && zona.avisos);
    const archivoAvisos = join(carpeta, 'zona', 'avisos.json');
    const guardadosAvisos = conAvisos ? cargarAvisos(archivoAvisos) : [];
    // 3. Leer (lo nacional, la zona y la fuente de avisos a la vez).
    const [lectura, lecturaZona, lecturaAvisos] = sinLeer ? [null, null, null]
      : await Promise.all([
        leerFeeds(feeds, { ahora, fetch }),
        zona ? leerFeeds(zona.feeds, { ahora, fetch }) : null,
        conAvisos ? leerAvisos(zona.avisos, guardadosAvisos, { ahora, fetch, reglas: zona.reglas }) : null,
      ]);
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
      if (conAvisos) {
        mkdirSync(join(carpeta, 'zona'), { recursive: true });
        escribirLista(archivoAvisos, { notas: lecturaAvisos.notas });
      }
    }
    // 5 a 8. Preparar, juicios provisorios, decidir, la zona y la entrega.
    const p = preparar(acumulado.notas, { portales, reglas, firmas, ahora });
    const juicios = juiciosProvisorios(p, { portales, reglas });
    const d = decidir(p.candidatos, juicios, { reglas, elegiblesAMano: p.elegiblesAMano });
    let deZona = null;
    let cortes = null;
    if (zona) {
      // Las notas de la zona que son avisos de cortes de acá van al bloque Avisos y no a la verificación. Un aviso de un
      // portal provincial que no nombra Comodoro ni Rada Tilly se queda en la zona, como cualquier nota.
      const deAviso = conAvisos ? acumuladoZona.notas.filter(n => esAvisoDeAca(n, { reglas: zona.reglas, portales: zona.portales })) : [];
      const noticias = acumuladoZona.notas.filter(n => !deAviso.includes(n));
      if (conAvisos) {
        const lista = armarAvisos({ notasScpl: lecturaAvisos ? lecturaAvisos.notas : guardadosAvisos, notasPortales: deAviso, ahora,
          cfg: zona.avisos, reglas: zona.reglas, portales: zona.portales, cronograma: zona.avisos.cronograma });
        const sinLugar = noticias.filter(n => esAviso(n.titulo, zona.reglas)).length;
        cortes = { lectura: lecturaAvisos, lista, apartadas: deAviso.length, sinLugar };
      }
      const pZona = preparar(noticias, { portales: zona.portales, reglas: zona.reglas, firmas: [], ahora });
      const z = decidirZona(pZona, { portales: zona.portales, reglas: zona.reglas, hechosNacionales: [...p.candidatos, ...p.enObservacion] });
      deZona = { lectura: lecturaZona, acumulado: acumuladoZona, p: pZona, z, reglas: zona.reglas };
    }
    const lista = armarEntrega(d, { ahora, portales, reglas, ejemplo: false, sinIA: true, zona: deZona && { ...deZona.z, portales: zona.portales }, avisos: cortes && cortes.lista });
    // 9. La carpeta de la página.
    escribirPagina(carpeta, lista);
    // 10. La línea de la medición.
    const linea = armarLinea({ ahora, duracionMs: Date.now() - inicio, lectura, acumulado, p, juicios, d, portales, zona: deZona, cortes });
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

module.exports = { vuelta, leerOpciones, cargarConfig, hechosPorGrupos, armarLinea, resumenEnPantalla, leerAvisos };
