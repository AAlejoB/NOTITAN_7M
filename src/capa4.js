'use strict';
/**
 * NOTITAN_7M · capa 4: la vuelta en dos mitades, para que la corra n8n
 *
 * Es la vuelta de scripts/vuelta.js partida en dos, porque en el medio n8n le pregunta a la IA:
 *   mitadUno: interpreta los feeds que bajó n8n, acumula, prepara y arma las preguntas de juicio
 *             (solo por los hechos que no tienen juicio guardado, tienen un desmentido nuevo o pasaron a viejos).
 *   mitadDos: lee las respuestas, guarda los juicios, decide (con el juicio provisorio donde la IA no contestó),
 *             arma la lista, la línea de la medición y si hay que mandar un aviso.
 *   escribir: lo único que toca el disco: <datos>/pagina/ y <datos>/vueltas.jsonl.
 *
 * Pura como el núcleo (salvo escribir): sin leer archivos, sin Date.now() y sin fetch; todo entra por parámetro.
 * Lo que se guarda entre vueltas (`guardado`) lo guarda n8n en los datos estáticos del workflow:
 *   { notas: [...], juicios: [{ urls, juicio, fecha, desmentidosVistos, viejo }], ultimoAviso: <ISO o null>, zona: { notas: [...] },
 *     avisos: { notas: [...] } }
 * La zona (Comodoro y Chubut, config/zona/) es opcional: `zona` es { feeds, portales, reglas, avisos? } o null. Corre sin IA,
 * como en scripts/vuelta.js: sus hechos no se le preguntan a la IA y el cruce «también nacional» saca el relleno.
 * Con zona.avisos (config/zona/avisos.json, con `cronograma`), también el bloque «Avisos»: n8n baja el listado de la SCPL,
 * pregunta notasQueFaltan, baja esas notas y se las pasa a mitadUno en `avisos`. Lo bajado vive 30 días en guardado.avisos,
 * con la misma forma que <datos>/zona/avisos.json de scripts/vuelta.js.
 */
const { appendFileSync, copyFileSync, mkdirSync, renameSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { parsearFeed, claveUrl, rutaExcluida } = require('./lector.js');
const { acumular, preparar, decidir, buscarPortal, dominioDe } = require('./nucleo.js');
const { juiciosProvisorios } = require('./provisorio.js');
const { armarEntrega } = require('./entrega.js');
const { decidirZona } = require('./zona.js');
const avisosDeZona = require('./avisos.js');
const { preguntaJuicio, leerJuicio, preguntaUnion, leerUnion, posiblesDesmentidos, buscarGuardado, hayQueVolverAPreguntar } = require('./ia.js');

const HORA = 3600 * 1000;
const AVISOS_DIAS = 30;
const ZONA = 'America/Argentina/Buenos_Aires';
const PAGINA_DEL_REPO = join(__dirname, '..', 'pagina');

/* ───────────── copiadas de scripts/leer.js y scripts/vuelta.js (que no se tocan) ───────────── */

// Lo guardado puede traer notas de rutas que hoy se excluyen: se sacan al cargarlo. Igual que en scripts/leer.js.
function filtrarRutas(notas, feeds) {
  const porNombre = new Map(feeds.map(f => [f.nombre, f]));
  const quedan = [];
  const sacadas = [];
  for (const n of notas) {
    const f = n.feed ? porNombre.get(n.feed) : null;
    const ruta = f && f.excluirRutas ? rutaExcluida(n.url, f.excluirRutas) : null;
    if (ruta) sacadas.push({ id: n.id, ruta });
    else quedan.push(n);
  }
  return { notas: quedan, sacadas };
}

// "3/10/26 14:10", en hora de Argentina.
function fechaCorta(iso) {
  const d = new Date(iso);
  const dia = d.toLocaleDateString('es-AR', { timeZone: ZONA, dateStyle: 'short' });
  const hora = d.toLocaleTimeString('es-AR', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hour12: false });
  return `${dia} ${hora}`;
}

// "15/10 14:30", para el asunto del aviso.
function diaHora(iso) {
  const partes = new Intl.DateTimeFormat('es-AR', { timeZone: ZONA, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso));
  const v = tipo => String((partes.find(p => p.type === tipo) || {}).value).padStart(2, '0');
  return `${v('day')}/${v('month')} ${v('hour')}:${v('minute')}`;
}

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

// Acá la lectura no viaja con sus notas (pesan), así que las leídas se suman de cada feed.
function cuentaNotas(lectura, acumulado) {
  const feeds = lectura ? lectura.feeds : [];
  return {
    leidas: !lectura ? 0 : Array.isArray(lectura.notas) ? lectura.notas.length : feeds.reduce((s, f) => s + (f.notas || 0), 0),
    nuevas: acumulado.agregadas.length,
    repetidas: acumulado.repetidas.length,
    borradas: acumulado.borradas.length,
    acumuladas: acumulado.notas.length,
  };
}

// Igual que en scripts/vuelta.js, salvo `leidas` (ver cuentaNotas).
// zona: { lectura, acumulado, p, z (lo de decidirZona), reglas } o null. Sin zona, la línea es la de siempre.
// cortes: { lectura (lo de leerAvisosBajados, o null), lista (lo de armarAvisos), apartadas, sinLugar } o null, como en scripts/vuelta.js.
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
      apartadas: cortes.apartadas || 0,
      sinLugar: cortes.sinLugar || 0,
      vigentes: cortes.lista.length,
      lista: cortes.lista.map(a => ({ id: a.id, servicio: a.servicio, programado: a.programado, dia: a.dia, zona: a.zona, fuentes: a.fuentes.length, cronograma: a.cronograma, normalizado: Boolean(a.normalizado), urls: a.fuentes.map(f => f.url).filter(Boolean) })),
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

// «Avisos: 2 vigentes (1 agua programado, 1 luz) · SCPL OK · …», como en scripts/vuelta.js.
function resumenCortes(c, sinLeer) {
  const tipos = new Map();
  for (const a of c.lista) {
    const t = `${a.servicio || 'corte'}${a.normalizado ? ' se normalizó' : a.cronograma ? ' cronograma' : a.programado === true ? ' programado' : a.programado === false ? ' avería' : ''}`;
    tipos.set(t, (tipos.get(t) || 0) + 1);
  }
  const detalle = tipos.size ? ` (${[...tipos].map(([t, n]) => `${n} ${t}`).join(', ')})` : '';
  const fuentes = sinLeer ? 'fuentes: no se leyeron'
    : c.fuentes.caidas.length ? `sin leer: ${c.fuentes.caidas.join(', ')}` : `SCPL OK · ${c.listados} comunicados en el listado · ${c.bajadas} bajados`;
  return `Avisos: ${c.vigentes} ${c.vigentes === 1 ? 'vigente' : 'vigentes'}${detalle} · ${fuentes}`;
}

/* ───────────── los avisos, desde lo que bajó n8n ───────────── */

// Lo que n8n le pregunta entre bajar el listado y bajar las notas: qué notas de la SCPL faltan bajar.
// guardado: el de la vuelta anterior (con guardado.avisos.notas). → [{ id, titulo, fecha, url }]
function notasQueFaltan({ listadoHtml, guardado, ahora, cfg, reglas }) {
  return avisosDeZona.notasQueFaltan({ listadoHtml, guardadas: (guardado && guardado.avisos && guardado.avisos.notas) || [], ahora, cfg, reglas });
}

// avisos: { listadoHtml, listadoError?, notasHtml: [{ id, titulo, fecha, html, error? }] }, lo que bajó n8n.
// → { notas (las guardadas más las nuevas, de los últimos 30 días), listados, bajadas, fuentes: { ok, mal, caidas }, avisos },
// como leerAvisos de scripts/vuelta.js. Hoy hay una sola fuente (la SCPL).
function leerAvisosBajados(avisos, guardadas, { ahora, cfg }) {
  const f = (cfg.fuentes || []).find(x => x.formato === 'scpl') || { nombre: 'SCPL' };
  const notas = [...guardadas];
  const caidas = [];
  const mensajes = [];
  let listados = 0;
  let bajadas = 0;
  const listado = avisos.listadoError ? [] : avisosDeZona.leerListadoScpl(avisos.listadoHtml);
  if (avisos.listadoError || !listado.length) caidas.push(`${f.nombre} (${avisos.listadoError || 'el listado no trae comunicados'})`);
  else {
    listados = listado.length;
    const ya = new Set(guardadas.map(n => String(n.id)));
    for (const x of avisos.notasHtml || []) {
      if (ya.has(String(x.id))) continue;
      if (x.error) { mensajes.push(`Nota de aviso sin bajar: ${f.nombre} ${x.id} (${x.error})`); continue; }
      notas.push({ ...avisosDeZona.leerNotaScpl(x.html, x, f), bajadaEn: ahora });
      bajadas++;
    }
  }
  const limite = Date.parse(ahora) - AVISOS_DIAS * 24 * HORA;
  return {
    notas: notas.filter(n => Date.parse(n.fecha) >= limite),
    listados,
    bajadas,
    fuentes: { ok: caidas.length ? 0 : 1, mal: caidas.length, caidas },
    avisos: [...caidas.map(c => `Fuente de avisos sin leer: ${c}`), ...mensajes],
  };
}

/* ───────────── la lectura, desde lo que bajó n8n ───────────── */

// cuerpos: uno por feed, en el mismo orden: { nombre, status, xml } o { nombre, status: 0, error }.
// → { notas, feeds: [{ nombre, dominio, estado, detalle, items, notas, descartadas }], avisos }, igual que leerFeeds.
function armarLectura(cuerpos, feeds, { ahora }) {
  const resultados = feeds.map((feed, k) => {
    const c = (cuerpos || [])[k] || { status: 0, error: 'sin respuesta' };
    const base = { nombre: feed.nombre, dominio: feed.dominio, items: 0, notas: [], descartadas: {} };
    const status = Number(c.status) || 0;
    if (status === 0) return { ...base, estado: 'error', detalle: String(c.error || 'sin respuesta') };
    if (status < 200 || status >= 400) return { ...base, estado: 'error', detalle: `HTTP ${status}` };
    const p = parsearFeed(c.xml, feed, { ahora });
    const motivos = {};
    for (const d of p.descartadas) motivos[d.motivo] = (motivos[d.motivo] || 0) + 1;
    return p.items === 0
      ? { ...base, estado: 'vacio', detalle: 'no trae notas (¿no es un feed?)' }
      : { ...base, estado: 'ok', detalle: '', items: p.items, notas: p.notas, descartadas: motivos };
  });
  const vistas = new Set();
  const notas = [];
  for (const r of resultados) {
    r.aceptadas = 0;
    for (const n of r.notas) {
      const clave = claveUrl(n.url);
      if (vistas.has(clave)) { r.descartadas.url_repetida = (r.descartadas.url_repetida || 0) + 1; continue; }
      vistas.add(clave);
      notas.push(n);
      r.aceptadas++;
    }
  }
  const avisos = resultados.filter(r => r.estado !== 'ok').map(r => `Feed sin leer: ${r.nombre} (${r.detalle})`);
  return { notas, feeds: resultados.map(({ notas: _propias, aceptadas, ...r }) => ({ ...r, notas: aceptadas })), avisos };
}

/* ───────────── qué se le pregunta a la IA ───────────── */

const aJuzgar = p => [...p.candidatos, ...p.elegiblesAMano];
const urlsDe = notas => notas.map(n => (typeof n === 'string' ? n : n.url));

// Se vuelve a preguntar si no hay juicio guardado, si apareció un desmentido nuevo,
// o si el hecho pasó a viejo y el juicio guardado era de cuando no lo era (así un dato nuevo lo puede dejar adentro).
function hayQuePreguntar(hecho, guardado, desmentidos) {
  if (hayQueVolverAPreguntar(hecho, guardado, desmentidos)) return true;
  return Boolean(hecho.viejo) && guardado.viejo === false;
}

// cuerpos: primero los de los feeds nacionales con url y, si hay zona, después los de la zona con url (el orden del nodo Feeds).
// avisos: lo que bajó n8n de la SCPL (ver leerAvisosBajados), o null. Solo se usa si zona trae avisos.
function mitadUno({ cuerpos, guardado, ahora, feeds, portales, reglas, firmas = [], zona = null, avisos = null }) {
  const antes = guardado || { notas: [], juicios: [], ultimoAviso: null };
  const nNacionales = zona ? feeds.filter(f => f.url).length : Infinity;
  const lectura = armarLectura((cuerpos || []).slice(0, nNacionales), feeds, { ahora });
  const guardadas = filtrarRutas(antes.notas || [], feeds).notas;
  const acumulado = acumular(guardadas, lectura.notas, { reglas, ahora });
  const limite = Date.parse(ahora) - reglas.ventanaRecoleccionHoras * HORA;
  const juicios = (antes.juicios || []).filter(j => Date.parse(j.fecha) >= limite);
  const p = preparar(acumulado.notas, { portales, reglas, firmas, ahora });

  const preguntas = [];
  let conJuicioGuardado = 0;
  for (const h of aJuzgar(p)) {
    const g = buscarGuardado(h, juicios);
    const desmentidos = posiblesDesmentidos(h, acumulado.notas, { reglas });
    if (!hayQuePreguntar(h, g, desmentidos)) { conJuicioGuardado++; continue; }
    preguntas.push({ id: h.id, texto: preguntaJuicio(h, { portales, reglas, desmentidos }), desmentidos: urlsDe(desmentidos), viejo: Boolean(h.viejo) });
  }
  const salida = {
    guardado: { notas: acumulado.notas, juicios, ultimoAviso: antes.ultimoAviso || null },
    lectura: { feeds: lectura.feeds, avisos: lectura.avisos },
    // Ids (y no las notas enteras) para que pese poco en los datos estáticos de n8n: la línea solo cuenta cuántas.
    acumulado: { agregadas: acumulado.agregadas, repetidas: acumulado.repetidas, borradas: acumulado.borradas.map(n => n.id) },
    preguntas,
    resumen: { hechos: p.resumen.hechos, candidatos: p.candidatos.length, elegiblesAMano: p.elegiblesAMano.length, conJuicioGuardado, aPreguntar: preguntas.length },
  };
  // La zona: leer y acumular aparte, con sus feeds y sus reglas. No se prepara ni se le pregunta nada a la IA.
  if (zona) {
    const lecturaZona = armarLectura((cuerpos || []).slice(feeds.filter(f => f.url).length), zona.feeds.filter(f => f.url), { ahora });
    const guardadasZona = filtrarRutas((antes.zona && antes.zona.notas) || [], zona.feeds).notas;
    const acumuladoZona = acumular(guardadasZona, lecturaZona.notas, { reglas: zona.reglas, ahora });
    salida.guardado.zona = { notas: acumuladoZona.notas };
    salida.lectura.zona = { feeds: lecturaZona.feeds, avisos: lecturaZona.avisos };
    salida.acumulado.zona = { agregadas: acumuladoZona.agregadas, repetidas: acumuladoZona.repetidas, borradas: acumuladoZona.borradas.map(n => n.id) };
    // Los avisos: lo bajado de la SCPL se suma a lo guardado (30 días). Sin `avisos` (no se bajó nada), queda lo guardado.
    if (zona.avisos) {
      const guardadasAvisos = (antes.avisos && antes.avisos.notas) || [];
      const l = avisos ? leerAvisosBajados(avisos, guardadasAvisos, { ahora, cfg: zona.avisos }) : null;
      salida.guardado.avisos = { notas: l ? l.notas : guardadasAvisos };
      salida.lectura.cortes = l && { listados: l.listados, bajadas: l.bajadas, fuentes: l.fuentes, avisos: l.avisos };
    }
  }
  return salida;
}

/* ───────────── con las respuestas: decidir y la lista ───────────── */

function armarAviso({ lectura, ia, ahora, ultimoAviso, reglas }) {
  const feeds = (lectura && lectura.feeds) || [];
  const motivos = [];
  if (ia.preguntadas > 0 && ia.contestadas === 0) motivos.push('la IA no contestó');
  if (feeds.length > 0 && !feeds.some(f => f.estado === 'ok')) motivos.push('ningún portal contestó');
  const tope = ((reglas.avisos && reglas.avisos.topeMinutos) || 60) * 60000;
  const libre = !ultimoAviso || Date.parse(ahora) - Date.parse(ultimoAviso) > tope;
  if (!motivos.length || !libre) return { hayQue: false, asunto: '', texto: '', ultimoAviso: ultimoAviso || null };
  const motivo = motivos.join(' y ');
  const caidos = feeds.filter(f => f.estado !== 'ok');
  const texto = [
    `7M: ${motivo} en la vuelta de las ${diaHora(ahora)} (hora de Argentina).`,
    '',
    caidos.length ? `Feeds caídos (${caidos.length} de ${feeds.length}):` : 'Feeds: todos respondieron.',
    ...caidos.map(f => `- ${f.nombre}: ${f.detalle}`),
    '',
    `Preguntas a la IA: ${ia.preguntadas}, contestadas ${ia.contestadas}, fallaron ${ia.fallidas}.`,
    'Mientras tanto la página sale con el bloque provisorio donde la IA no contestó. Próximo aviso, como mucho en una hora.',
  ].join('\n');
  return { hayQue: true, asunto: `7M · ${motivo} · ${diaHora(ahora)}`, texto, ultimoAviso: ahora };
}

function mitadDos({ guardado, lectura, acumulado, respuestas = [], ahora, feeds, portales, reglas, firmas = [], zona = null }) {
  const notas = filtrarRutas(guardado.notas || [], feeds).notas;
  const p = preparar(notas, { portales, reglas, firmas, ahora });
  const porId = new Map(aJuzgar(p).map(h => [h.id, h]));
  let juiciosGuardados = [...(guardado.juicios || [])];

  const ia = { preguntadas: respuestas.length, contestadas: 0, fallidas: 0 };
  for (const r of respuestas) {
    const juicio = leerJuicio(r.texto);
    const hecho = porId.get(r.id);
    if (!juicio || !hecho) { ia.fallidas++; continue; }
    ia.contestadas++;
    const urls = hecho.notas.map(n => n.url);
    juiciosGuardados = juiciosGuardados.filter(g => !(g.urls || []).some(u => urls.includes(u)));
    juiciosGuardados.push({
      urls, juicio, fecha: ahora,
      desmentidosVistos: urlsDe(posiblesDesmentidos(hecho, notas, { reglas })),
      viejo: Boolean(hecho.viejo),
    });
  }

  const provisorios = juiciosProvisorios(p, { portales, reglas });
  const juicios = {};
  for (const h of aJuzgar(p)) {
    const g = buscarGuardado(h, juiciosGuardados);
    juicios[h.id] = g ? g.juicio : provisorios[h.id];
  }
  const usados = Object.values(juicios);
  const d = decidir(p.candidatos, juicios, { reglas, elegiblesAMano: p.elegiblesAMano });
  const enLista = [...d.nacionales, ...d.internacionales, ...d.aMano.nacional, ...d.aMano.internacional];
  const provisorias = enLista.filter(x => juicios[x.id] && juicios[x.id].provisorio).length;
  // La zona, sin IA: preparar con sus reglas y decidir cada anillo, cruzando con los hechos nacionales de esta vuelta.
  let deZona = null;
  let cortes = null;
  if (zona) {
    const notasZona = filtrarRutas((guardado.zona && guardado.zona.notas) || [], zona.feeds).notas;
    // Las notas de la zona que son avisos de cortes de acá van al bloque Avisos y no a la verificación (como en scripts/vuelta.js).
    const deAviso = zona.avisos ? notasZona.filter(n => avisosDeZona.esAvisoDeAca(n, { reglas: zona.reglas, portales: zona.portales, cfg: zona.avisos })) : [];
    const noticias = notasZona.filter(n => !deAviso.includes(n));
    if (zona.avisos) {
      const lista = avisosDeZona.armarAvisos({ notasScpl: (guardado.avisos && guardado.avisos.notas) || [], notasPortales: deAviso, ahora,
        cfg: zona.avisos, reglas: zona.reglas, portales: zona.portales, cronograma: zona.avisos.cronograma || null });
      const sinLugar = noticias.filter(n => avisosDeZona.esAviso(n.titulo, zona.reglas)).length;
      cortes = { lectura: (lectura && lectura.cortes) || null, lista, apartadas: deAviso.length, sinLugar };
    }
    const pZona = preparar(noticias, { portales: zona.portales, reglas: zona.reglas, firmas: [], ahora });
    const z = decidirZona(pZona, { portales: zona.portales, reglas: zona.reglas, hechosNacionales: [...p.candidatos, ...p.enObservacion] });
    const az = (acumulado && acumulado.zona) || { agregadas: [], repetidas: [], borradas: [] };
    deZona = { notas: notasZona, lectura: (lectura && lectura.zona) || null, acumulado: { ...az, notas: notasZona }, p: pZona, z, reglas: zona.reglas };
  }
  const lista = armarEntrega(d, {
    ahora, portales, reglas, ejemplo: false,
    sinIA: usados.length > 0 && usados.every(j => j.provisorio),
    provisorias,
    cliente: reglas.cliente || '',
    paginaViejaMinutos: (reglas.avisos && reglas.avisos.paginaViejaMinutos) || 60,
    zona: deZona && { ...deZona.z, portales: zona.portales },
    avisos: cortes && cortes.lista,
  });

  const linea = {
    ...armarLinea({ ahora, duracionMs: null, lectura, acumulado: { ...acumulado, notas }, p, juicios, d, portales, zona: deZona, cortes }),
    ia, provisorias, tardoMs: null,
  };
  const avisar = armarAviso({ lectura, ia, ahora, ultimoAviso: guardado.ultimoAviso, reglas });
  const nuevoGuardado = { notas, juicios: juiciosGuardados, ultimoAviso: avisar.ultimoAviso };
  if (deZona) nuevoGuardado.zona = { notas: deZona.notas };
  if (zona && zona.avisos) nuevoGuardado.avisos = { notas: (guardado.avisos && guardado.avisos.notas) || [] };
  return { guardado: nuevoGuardado, lista, linea, avisar };
}

/* ───────────── lo que se escribe en disco ───────────── */

function escribir({ carpetaDatos, lista, linea }) {
  const dir = join(carpetaDatos, 'pagina');
  mkdirSync(dir, { recursive: true });
  const archivo = join(dir, 'lista.json');
  writeFileSync(`${archivo}.tmp`, JSON.stringify(lista, null, 2) + '\n');
  renameSync(`${archivo}.tmp`, archivo);
  copyFileSync(join(PAGINA_DEL_REPO, 'index.html'), join(dir, 'index.html'));
  copyFileSync(join(PAGINA_DEL_REPO, 'logica.js'), join(dir, 'logica.js'));
  appendFileSync(join(carpetaDatos, 'vueltas.jsonl'), JSON.stringify(linea) + '\n');
}

/* ───────────── la API de mensajes (lo que usan los nodos de n8n) ───────────── */

// El cuerpo completo para POST /v1/messages. tipo: 'juicio' o 'union'.
function cuerpoIA(texto, { reglas, tipo = 'juicio' }) {
  const ia = reglas.ia || {};
  return {
    model: ia.modelo,
    max_tokens: (ia.maxTokens || {})[tipo] || 400,
    temperature: ia.temperatura ?? 0,
    messages: [{ role: 'user', content: texto }],
  };
}

// El texto de una respuesta de la API (content[0].text), o null si la llamada falló o vino otra cosa.
function textoDeRespuesta(r) {
  if (!r || r.error) return null;
  const bloque = Array.isArray(r.content) ? r.content.find(c => c && c.type === 'text') || r.content[0] : null;
  return bloque && typeof bloque.text === 'string' ? bloque.text : null;
}

/* ───────────── la prueba de la unión (3 veces) ───────────── */

// La pregunta de unión para un caso de test/casos-ia.json: dos hechos inventados de una nota cada uno.
function preguntaUnionDePrueba(caso, { portales }) {
  const hecho = (id, titulo) => ({
    id, titulo, primera: '2026-10-04T15:00:00Z', gruposIndependientes: 1,
    notas: [{ id, titulo, bajada: '', url: `https://prueba.invalid/${id}`, portal: 'prueba.invalid', fecha: '2026-10-04T15:00:00Z', firma: '' }],
  });
  const preparado = { candidatos: [], enObservacion: [hecho('a', caso.a), hecho('b', caso.b)] };
  return preguntaUnion({ a: 'a', b: 'b' }, preparado, { portales });
}

// Los casos que cuentan (sin dudoso), tres ítems por caso.
function itemsDePrueba(casos, { portales, reglas, intentos = 3 }) {
  const items = [];
  (casos.union || []).forEach((caso, k) => {
    if (caso.dudoso) return;
    const cuerpo = cuerpoIA(preguntaUnionDePrueba(caso, { portales }), { reglas, tipo: 'union' });
    for (let i = 1; i <= intentos; i++) items.push({ caso: k, intento: i, cuerpoIA: cuerpo });
  });
  return items;
}

// items: los de itemsDePrueba; respuestas: lo que devolvió la API para cada uno, en el mismo orden.
// → [{ caso, titulos, esperado, intentos: [bool…], pasa }…, { resumen: 'pasa' | 'no pasa', casos, aciertos, de }]
function resultadoPrueba(casos, items, respuestas) {
  const porCaso = new Map();
  items.forEach((it, k) => {
    const caso = casos.union[it.caso];
    const leido = leerUnion(textoDeRespuesta(respuestas[k]));
    const acierto = leido !== null && leido.misma === caso.misma;
    if (!porCaso.has(it.caso)) porCaso.set(it.caso, { caso: it.caso, titulos: [caso.a, caso.b], esperado: caso.misma, intentos: [] });
    porCaso.get(it.caso).intentos.push(acierto);
  });
  const filas = [...porCaso.values()].map(f => ({ ...f, pasa: f.intentos.length > 0 && f.intentos.every(Boolean) }));
  const aciertos = filas.reduce((s, f) => s + f.intentos.filter(Boolean).length, 0);
  const de = filas.reduce((s, f) => s + f.intentos.length, 0);
  return [...filas, { resumen: filas.length && filas.every(f => f.pasa) ? 'pasa' : 'no pasa', casos: filas.length, aciertos, de }];
}

module.exports = {
  filtrarRutas, armarLectura, hayQuePreguntar, mitadUno, mitadDos, escribir, notasQueFaltan, leerAvisosBajados,
  armarLinea, hechosPorGrupos, mediosDe, resumenEnPantalla,
  cuerpoIA, textoDeRespuesta, preguntaUnionDePrueba, itemsDePrueba, resultadoPrueba,
};
