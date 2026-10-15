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
 *   { notas: [...], juicios: [{ urls, juicio, fecha, desmentidosVistos, viejo }], ultimoAviso: <ISO o null> }
 */
const { appendFileSync, copyFileSync, mkdirSync, renameSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { parsearFeed, claveUrl, rutaExcluida } = require('./lector.js');
const { acumular, preparar, decidir, buscarPortal, dominioDe } = require('./nucleo.js');
const { juiciosProvisorios } = require('./provisorio.js');
const { armarEntrega } = require('./entrega.js');
const { preguntaJuicio, leerJuicio, preguntaUnion, leerUnion, posiblesDesmentidos, buscarGuardado, hayQueVolverAPreguntar } = require('./ia.js');

const HORA = 3600 * 1000;
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

function mediosDe(hecho, portales) {
  const grupos = hecho.notas.map(n => { const d = dominioDe(n); return (buscarPortal(d, portales) || {}).grupo || d; });
  return [...new Set(grupos)];
}

// Igual que en scripts/vuelta.js, salvo `leidas`: acá la lectura no viaja con sus notas (pesan), así que se suman las de cada feed.
function armarLinea({ ahora, duracionMs, lectura, acumulado, p, juicios, d, portales = [] }) {
  const feeds = lectura ? lectura.feeds : [];
  const mal = feeds.filter(f => f.estado !== 'ok');
  const leidas = !lectura ? 0 : Array.isArray(lectura.notas) ? lectura.notas.length : feeds.reduce((s, f) => s + (f.notas || 0), 0);
  return {
    hora: ahora,
    duracionMs,
    feeds: { ok: feeds.length - mal.length, mal: mal.length, caidos: mal.map(f => f.nombre) },
    notas: {
      leidas,
      nuevas: acumulado.agregadas.length,
      repetidas: acumulado.repetidas.length,
      borradas: acumulado.borradas.length,
      acumuladas: acumulado.notas.length,
    },
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

function mitadUno({ cuerpos, guardado, ahora, feeds, portales, reglas, firmas = [] }) {
  const antes = guardado || { notas: [], juicios: [], ultimoAviso: null };
  const lectura = armarLectura(cuerpos, feeds, { ahora });
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
  return {
    guardado: { notas: acumulado.notas, juicios, ultimoAviso: antes.ultimoAviso || null },
    lectura: { feeds: lectura.feeds, avisos: lectura.avisos },
    // Ids (y no las notas enteras) para que pese poco en los datos estáticos de n8n: la línea solo cuenta cuántas.
    acumulado: { agregadas: acumulado.agregadas, repetidas: acumulado.repetidas, borradas: acumulado.borradas.map(n => n.id) },
    preguntas,
    resumen: { hechos: p.resumen.hechos, candidatos: p.candidatos.length, elegiblesAMano: p.elegiblesAMano.length, conJuicioGuardado, aPreguntar: preguntas.length },
  };
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

function mitadDos({ guardado, lectura, acumulado, respuestas = [], ahora, feeds, portales, reglas, firmas = [] }) {
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
  const lista = armarEntrega(d, {
    ahora, portales, reglas, ejemplo: false,
    sinIA: usados.length > 0 && usados.every(j => j.provisorio),
    provisorias,
    cliente: reglas.cliente || '',
    paginaViejaMinutos: (reglas.avisos && reglas.avisos.paginaViejaMinutos) || 60,
  });

  const linea = {
    ...armarLinea({ ahora, duracionMs: null, lectura, acumulado: { ...acumulado, notas }, p, juicios, d, portales }),
    ia, provisorias, tardoMs: null,
  };
  const avisar = armarAviso({ lectura, ia, ahora, ultimoAviso: guardado.ultimoAviso, reglas });
  return { guardado: { notas, juicios: juiciosGuardados, ultimoAviso: avisar.ultimoAviso }, lista, linea, avisar };
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
  filtrarRutas, armarLectura, hayQuePreguntar, mitadUno, mitadDos, escribir,
  armarLinea, hechosPorGrupos, mediosDe, resumenEnPantalla,
  cuerpoIA, textoDeRespuesta, preguntaUnionDePrueba, itemsDePrueba, resultadoPrueba,
};
