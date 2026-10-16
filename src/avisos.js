'use strict';
/**
 * NOTITAN_7M · avisos (cortes de agua, luz y gas de la zona)
 *
 * Puro, como el núcleo: sin red, sin archivos y sin reloj (la hora entra por `ahora`). Lo que sale a internet
 * (bajar el listado y las notas de la SCPL) vive en scripts/vuelta.js.
 *
 * Un aviso no es una noticia verificada por N medios: es replicar el aviso de quien corta (la SCPL), con los
 * portales de la zona como respaldo. Alcanza 1 sola fuente. Las reglas están en config/zona/avisos.json,
 * config/zona/cronograma-agua.json y `cortes` de config/reglas.json.
 *
 * - leerListadoScpl / leerNotaScpl: del HTML de la página de comunicados de la SCPL y de cada nota.
 * - vale: si un título de la SCPL es un aviso (el molde de `cortes`, sin la condición de lugar: la SCPL ya es de Comodoro).
 * - esAviso: si un título de portal es un aviso (el molde entero).
 * - esAvisoDeAca: esAviso, y además el portal es de Comodoro («local») o el título nombra Comodoro o Rada Tilly. Esas notas
 *   van a Avisos y no entran a la verificación; un aviso de un portal provincial que no nombra el lugar sigue como noticia.
 * - notasParaBajar: qué notas del listado faltan bajar (últimos 7 días, que valen, nunca bajadas; las más nuevas primero).
 * - datosDeAviso: servicio, programado o avería, día, horario, barrios y zona, sacados del texto.
 * - armarAvisos: junta comunicado y notas del mismo corte (con agrupar del núcleo), saca lo vencido, suma el cronograma de
 *   verano y ordena: primero lo que está cortando ahora, después lo que viene, después lo que no tiene día.
 */
const { normalizar, agrupar, dominioDe, buscarPortal, nombreDeMedio } = require('./nucleo.js');
const { limpiarHtml } = require('./lector.js');

const HORA = 3600 * 1000;
const DIA = 24 * HORA;
// Argentina no tiene horario de verano desde 2009: la hora es siempre UTC−3.
const DESFASE_AR = -3 * HORA;
const DIAS_PARA_BAJAR = 7;
const LARGO_RESUMEN = 200;
const MOLDE_NOTA_SCPL = 'https://scpl.coop/index.php/site/ver-nota?id={id}';
const SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const BAJADA_CRONOGRAMA = 'Según el cronograma de verano de la SCPL. Si las reservas alcanzan, la cooperativa puede suspenderlo';

/* ───────────── fechas (hora de Argentina) ───────────── */

// '2026-10-07T15:00:00.000Z' → '2026-10-07' (el día en Argentina)
const diaAR = iso => new Date(Date.parse(iso) + DESFASE_AR).toISOString().slice(0, 10);
// ('2026-10-08', '15:00') → '2026-10-08T18:00:00.000Z'
const isoDe = (dia, hora = '00:00') => new Date(Date.parse(`${dia}T${hora}:00.000Z`) - DESFASE_AR).toISOString();
const horaDe = iso => new Date(Date.parse(iso) + DESFASE_AR).toISOString().slice(11, 16);
const sumarDias = (dia, n) => new Date(Date.parse(`${dia}T00:00:00.000Z`) + n * DIA).toISOString().slice(0, 10);
const diaDeLaSemana = dia => new Date(`${dia}T00:00:00.000Z`).getUTCDay();
const dosCifras = n => String(n).padStart(2, '0');

/* ───────────── texto ───────────── */

// Las entidades con nombre que trae el HTML de la SCPL (&iacute;, &Uacute;…) y que limpiarHtml no conoce.
const ACENTOS = { aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', uuml: 'ü',
  Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', Uuml: 'Ü',
  ordm: 'º', ordf: 'ª', deg: '°', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', ndash: '–', mdash: '—', hellip: '…' };
const textoDeHtml = html => limpiarHtml(String(html ?? '').replace(/&([a-zA-Z]+);/g, (e, n) => ACENTOS[n] || e));

// Como normalizar del núcleo (minúsculas y sin tildes), pero deja la puntuación: las horas («15:00hs.») la necesitan.
const aplanar = texto => String(texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

// 'zona norte' → 'Zona Norte'
const mayusculas = t => t.replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase());

/* ───────────── el molde ───────────── */

// Parte un molde en sus pedazos de primer nivel: '^', '(?!…)', '(?=…)'… (respeta los escapes y los corchetes).
function pedazos(molde) {
  const out = [];
  let actual = '';
  let nivel = 0;
  let corchete = false;
  for (let i = 0; i < molde.length; i++) {
    const c = molde[i];
    actual += c;
    if (c === '\\') { actual += molde[++i] || ''; continue; }
    if (corchete) { if (c === ']') corchete = false; continue; }
    if (c === '[') corchete = true;
    else if (c === '(') nivel++;
    else if (c === ')' && --nivel === 0) { out.push(actual); actual = ''; }
    else if (nivel === 0) { out.push(actual); actual = ''; }
  }
  if (actual) out.push(actual);
  return out;
}

const moldeDe = reglas => (reglas && reglas.cortes && reglas.cortes.molde) || '';

// Si el título (de un portal) es un aviso: pasa el molde entero de `cortes`.
function esAviso(titulo, reglas) {
  const molde = moldeDe(reglas);
  return Boolean(molde) && new RegExp(molde).test(normalizar(titulo));
}

// Si la nota de un portal es un aviso de acá: lo local manda; lo provincial (o un portal que no está en la lista) suma solo
// cuando el título nombra Comodoro o Rada Tilly. La SCPL no pasa por acá: sus comunicados son siempre de acá.
function esAvisoDeAca(nota, { reglas, portales = [] } = {}) {
  if (!esAviso(nota.titulo, reglas)) return false;
  const portal = buscarPortal(dominioDe(nota), portales);
  if (portal && portal.zona === 'local') return true;
  return /\b(comodoro|rada tilly)\b/.test(normalizar(nota.titulo));
}

// Si un título de la SCPL es un aviso: el molde sin su última condición, que es la de lugar (la SCPL ya es de Comodoro).
function vale(titulo, reglas) {
  const molde = moldeDe(reglas);
  if (!molde) return false;
  const p = pedazos(molde);
  const sinLugar = p[p.length - 1].startsWith('(?=') ? p.slice(0, -1).join('') : molde;
  return new RegExp(sinLugar).test(normalizar(titulo));
}

/* ───────────── la SCPL ───────────── */

// HTML del listado de comunicados → [{ id, titulo, fecha }], en el orden del listado. La página no da hora: 12:00 de Argentina.
function leerListadoScpl(html) {
  const out = [];
  const vistos = new Set();
  for (const m of String(html ?? '').matchAll(/<article\b[^>]*class="[^"]*listSeccion[^"]*"[^>]*>([\s\S]*?)<\/article>/gi)) {
    const bloque = m[1];
    const link = bloque.match(/ver-nota\?id=(\d+)"[^>]*>([\s\S]*?)<\/a>/i);
    const f = bloque.match(/class="metadata"[^>]*>\s*(\d{2})-(\d{2})-(\d{4})/i);
    if (!link || !f || vistos.has(link[1])) continue;
    vistos.add(link[1]);
    out.push({ id: link[1], titulo: textoDeHtml(link[2]), fecha: isoDe(`${f[3]}-${f[2]}-${f[1]}`, '12:00') });
  }
  return out;
}

// HTML de una nota → { id, titulo, fecha, texto, url }. El texto es el cuerpo (los párrafos, sin etiquetas).
function leerNotaScpl(html, { id, titulo, fecha }, { nota = MOLDE_NOTA_SCPL } = {}) {
  const h = String(html ?? '');
  const i = h.indexOf('container-cms-page');
  let cuerpo = '';
  if (i >= 0) {
    const desde = h.indexOf('>', i) + 1;
    const fin = [h.indexOf('<aside', desde), h.indexOf('<!-- end row', desde)].filter(k => k >= 0);
    cuerpo = h.slice(desde, fin.length ? Math.min(...fin) : undefined);
  }
  return { id: String(id), titulo, fecha, texto: textoDeHtml(cuerpo), url: nota.replace('{id}', id) };
}

// Del listado, las que hay que bajar: de los últimos 7 días, que valen y que no están guardadas; las más nuevas primero,
// como mucho cfg.maxNotasPorVuelta.
function notasParaBajar(listado, guardadas, { ahora, reglas, cfg }) {
  const ya = new Set((guardadas || []).map(n => String(n.id)));
  const limite = Date.parse(ahora) - DIAS_PARA_BAJAR * DIA;
  return listado
    .filter(x => Date.parse(x.fecha) >= limite && !ya.has(String(x.id)) && vale(x.titulo, reglas))
    .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha) || Number(b.id) - Number(a.id))
    .slice(0, (cfg && cfg.maxNotasPorVuelta) || 5);
}

/* ───────────── los datos de un aviso ───────────── */

function servicioDe(t, servicios) {
  let mejor = null;
  let donde = Infinity;
  for (const [clave, palabras] of Object.entries(servicios || {})) {
    for (const p of palabras) {
      // Palabra entera; las de 6 letras o más valen como raíz («electric» agarra «eléctrico» y «eléctrica»).
      const w = aplanar(p);
      const m = new RegExp(w.length >= 6 ? `\\b${w}` : `\\b${w}\\b`).exec(t);
      if (m && m.index < donde) { donde = m.index; mejor = clave; }
    }
  }
  return mejor;
}

function programadoDe(t) {
  const si = /\b(programad\w*|mantenimiento|cronograma|maniobra\w*|tareas)\b/.test(t);
  const no = /\b(averia\w*|vandal\w*|rotura|falla\w*|emergencia|imprevist\w*)\b/.test(t);
  return si === no ? null : si;
}

const SEMANA_RE = SEMANA.join('|');

function diaDe(t, fechaPublicacion) {
  const base = diaAR(fechaPublicacion);
  // Con número: «jueves 08 de octubre», «8 de octubre». En el año de la publicación; si queda más de 30 días atrás, el siguiente.
  const conNumero = t.match(new RegExp(`\\b(\\d{1,2}) de (${MESES.join('|')})\\b`));
  if (conNumero) {
    const anio = Number(base.slice(0, 4));
    let dia = `${anio}-${dosCifras(MESES.indexOf(conNumero[2]) + 1)}-${dosCifras(Number(conNumero[1]))}`;
    if (Date.parse(base) - Date.parse(dia) > 30 * DIA) dia = `${anio + 1}${dia.slice(4)}`;
    return dia;
  }
  // Sin número: el primero que aparece de «hoy», «mañana» y «el/este <día de la semana>».
  const candidatos = [];
  const hoy = t.search(/\bhoy\b/);
  if (hoy >= 0) candidatos.push([hoy, base]);
  const manana = t.search(/\bmanana\b/);
  if (manana >= 0) candidatos.push([manana, sumarDias(base, 1)]);
  const semana = new RegExp(`\\b(el|este) (${SEMANA_RE})\\b`).exec(t);
  if (semana) {
    const falta = (SEMANA.indexOf(semana[2]) - diaDeLaSemana(base) + 7) % 7;
    candidatos.push([semana.index, sumarDias(base, falta)]);
  }
  candidatos.sort((a, b) => a[0] - b[0]);
  return candidatos.length ? candidatos[0][1] : null;
}

const HH = '(\\d{1,2})(?:[:.](\\d{2}))?';
const hhmm = (h, m) => (Number(h) <= 24 ? `${dosCifras(Number(h) % 24)}:${m || '00'}` : null);

function horarioDe(t) {
  let desde = null;
  let hasta = null;
  let duracionHoras = null;
  let m = t.match(new RegExp(`\\bentre las ${HH}\\s*(?:hs?\\b\\.?|horas)? y las ${HH}`));
  if (m) { desde = hhmm(m[1], m[2]); hasta = hhmm(m[3], m[4]); }
  if (!m) {
    // «de 9 a 13 horas», «de 9 a 13 hs», «de 9:00 a 13:00»: con unidad o con minutos, para no agarrar «de 9 a 13 barrios».
    const re = new RegExp(`\\bde (?:las )?${HH}\\s*(?:hs?\\b\\.?|horas)? a (?:las )?${HH}\\s*(hs?\\b|horas\\b)?`, 'g');
    m = [...t.matchAll(re)].find(x => x[2] || x[4] || x[5]) || null;
    if (m) { desde = hhmm(m[1], m[2]); hasta = hhmm(m[3], m[4]); }
  }
  if (!desde) {
    m = t.match(new RegExp(`\\b(?:desde|a partir de) las ${HH}`));
    if (m) desde = hhmm(m[1], m[2]);
  }
  const lapso = t.match(/\b(?:lapso de|durante|por) (?:unas? )?(\d{1,3})\s*(?:hs\b|horas\b)/) || t.match(/(?<![:\d])(?<!las )\b(\d{1,3})\s*horas\b/);
  if (lapso) duracionHoras = Number(lapso[1]);
  return { desde, hasta, duracionHoras };
}

// Lo que sigue a «barrios:» o «los siguientes barrios» hasta el primer punto (que no sea de «Gral.», «Km.8»…) o punto y coma.
// Se saca del texto original, para conservar mayúsculas y tildes.
function barriosDe(texto) {
  const m = String(texto || '').match(/(?:\bbarrios\s*:|\blos siguientes barrios\b\s*:?)\s*([\s\S]*)/i);
  if (!m) return [];
  let resto = m[1];
  const corte = resto.search(/;|(?<!\b(?:Gral|Km|Av|Pje|Dr|Sta|Sto|Cnel|Pte|B[º°]|Bº|Ing|Cdro))\.(?=\s|$)/i);
  if (corte >= 0) resto = resto.slice(0, corte);
  return resto.split(/,|\s+y\s+/).map(b => b.trim()).filter(Boolean).map(b => b[0].toUpperCase() + b.slice(1));
}

function zonaDe(t, zonas) {
  // «zona sur y central» → las dos
  const doble = t.match(/\bzona (norte|sur|central) y (?:zona )?(norte|sur|central)\b/);
  if (doble) return [`Zona ${mayusculas(doble[1])}`, `Zona ${mayusculas(doble[2])}`];
  let mejor = null;
  let donde = Infinity;
  for (const z of zonas || []) {
    const i = t.search(new RegExp(`\\b${aplanar(z)}\\b`));
    if (i >= 0 && i < donde) { donde = i; mejor = z; }
  }
  return mejor ? [mayusculas(mejor)] : null;
}

// texto: título + bajada (portales) o título + cuerpo (SCPL). Cada campo es null si no se encuentra (barrios: []).
function datosDeAviso(texto, { fechaPublicacion, cfg }) {
  const t = aplanar(texto);
  const { desde, duracionHoras } = horarioDe(t);
  let { hasta } = horarioDe(t);
  // Con hora de inicio y duración, el fin se calcula («desde las 15:00 y por 24 h» → hasta las 15:00 del día siguiente).
  if (!hasta && desde && duracionHoras) {
    const min = (Number(desde.slice(0, 2)) * 60 + Number(desde.slice(3)) + duracionHoras * 60) % (24 * 60);
    hasta = `${dosCifras(Math.floor(min / 60))}:${dosCifras(min % 60)}`;
  }
  return {
    servicio: servicioDe(t, cfg.servicios),
    programado: programadoDe(t),
    dia: diaDe(t, fechaPublicacion),
    desde,
    hasta,
    duracionHoras,
    barrios: barriosDe(texto),
    zona: zonaDe(t, cfg.zonas),
  };
}

// Cuándo empieza y cuándo termina, si se sabe. `hasta` se calcula con desde + duración; si cruza la medianoche, el fin
// queda en el día siguiente.
function tramo({ dia, desde, hasta, duracionHoras }) {
  if (!dia) return { inicioISO: null, finISO: null, hasta };
  const inicioISO = isoDe(dia, desde || '00:00');
  let finISO = null;
  if (desde && duracionHoras) {
    finISO = new Date(Date.parse(inicioISO) + duracionHoras * HORA).toISOString();
    hasta = horaDe(finISO);
  } else if (hasta) {
    finISO = isoDe(dia, hasta);
    if (desde && Date.parse(finISO) <= Date.parse(inicioISO)) finISO = new Date(Date.parse(finISO) + DIA).toISOString();
  }
  return { inicioISO, finISO, hasta };
}

/* ───────────── un aviso por corte ───────────── */

const CAMPOS = ['servicio', 'programado', 'dia', 'desde', 'hasta', 'duracionHoras', 'barrios', 'zona'];
const falta = v => v === null || v === undefined || (Array.isArray(v) && v.length === 0);
const fuenteDe = (url, cfg) => (cfg.fuentes || []).find(f => dominioDe({ url }) === f.dominio || dominioDe({ url }).endsWith('.' + f.dominio)) || null;

// Las primeras 200 letras del cuerpo, cortadas en una palabra entera.
function resumir(texto) {
  const t = String(texto || '');
  if (t.length <= LARGO_RESUMEN) return t;
  const corte = t.slice(0, LARGO_RESUMEN);
  return corte.slice(0, Math.max(corte.lastIndexOf(' '), LARGO_RESUMEN * 0.6)).replace(/[\s,;.]+$/, '') + '…';
}

// Una nota de la SCPL con la forma de una nota del lector, para que agrupar la entienda.
function notaDeScpl(n, cfg) {
  const f = fuenteDe(n.url, cfg) || { nombre: 'SCPL', dominio: 'scpl.coop' };
  return {
    id: `${f.dominio}:${n.id}`, titulo: n.titulo, bajada: resumir(n.texto), url: n.url,
    portal: f.dominio, fecha: n.fecha, seccion: '', etiqueta: '', firma: '', feed: f.nombre,
    _primaria: true, _medio: f.nombre, _texto: `${n.titulo} ${n.texto || ''}`,
  };
}

// Los días de la semana de una zona del cronograma, con sus excepciones: las fechas en que hay corte y a qué hora empieza.
function cortesDelCronograma(cronograma, ahora) {
  if (!cronograma) return [];
  const hoy = diaAR(ahora);
  if (hoy < cronograma.desde || hoy > cronograma.hasta) return [];
  const out = [];
  // Ayer (si todavía está cortando), hoy y mañana.
  for (const d of [-1, 0, 1].map(k => sumarDias(hoy, k))) {
    for (const z of cronograma.zonas || []) {
      const exc = (cronograma.excepciones || []).find(e => e.fecha === d && e.zona === z.zona);
      if (!exc && !(z.dias || []).includes(SEMANA[diaDeLaSemana(d)])) continue;
      out.push({ dia: d, zona: z.zona, desde: exc ? exc.desde : z.desde });
    }
  }
  return out;
}

// → [aviso…], en el orden en que se muestran.
function armarAvisos({ notasScpl = [], notasPortales = [], ahora, cfg, reglas, portales = [], cronograma = null }) {
  const t0 = Date.parse(ahora);
  const notas = [
    ...notasScpl.map(n => notaDeScpl(n, cfg)),
    ...notasPortales.map(n => ({ ...n, _primaria: false, _medio: nombreDeMedio(n, portales), _texto: `${n.titulo} ${n.bajada || ''}` })),
  ];
  const avisos = [];
  for (const g of agrupar(notas, reglas)) {
    const scpl = g.notas.filter(n => n._primaria);
    const primaria = scpl.length ? scpl[scpl.length - 1] : g.notas[0];
    const resto = [primaria, ...g.notas.filter(n => n !== primaria)];
    const datos = {};
    const porNota = new Map(resto.map(n => [n, datosDeAviso(n._texto, { fechaPublicacion: n.fecha, cfg })]));
    for (const c of CAMPOS) {
      const n = resto.find(x => !falta(porNota.get(x)[c]));
      datos[c] = n ? porNota.get(n)[c] : (c === 'barrios' ? [] : null);
    }
    const { inicioISO, finISO, hasta } = tramo(datos);
    avisos.push({
      id: 'a:' + primaria.id,
      servicio: datos.servicio,
      programado: datos.programado,
      dia: datos.dia,
      desde: datos.desde,
      hasta,
      finISO,
      duracionHoras: datos.duracionHoras,
      barrios: datos.barrios,
      zona: datos.zona,
      titulo: primaria.titulo,
      resumen: primaria.bajada || '',
      fuentes: resto.map(n => ({ medio: n._medio, url: n.url })),
      cronograma: false,
      publicado: new Date(Date.parse(primaria.fecha)).toISOString(),
      inicioISO,
    });
  }

  // El cronograma de verano, salvo que ya haya un comunicado de la SCPL del mismo día y zona.
  const zonasDe = texto => zonaDe(aplanar(texto), cfg.zonas) || [];
  const conScpl = avisos.filter(a => a.fuentes[0] && fuenteDe(a.fuentes[0].url || '', cfg));
  for (const c of cortesDelCronograma(cronograma, ahora)) {
    const zonas = zonasDe(c.zona);
    if (conScpl.some(a => a.dia === c.dia && (a.zona || []).some(z => zonas.includes(z)))) continue;
    const d = { dia: c.dia, desde: c.desde, hasta: null, duracionHoras: cronograma.duracionHoras || 24 };
    const { inicioISO, finISO, hasta } = tramo(d);
    if (c.dia < diaAR(ahora) && Date.parse(finISO) <= t0) continue; // el de ayer, solo si todavía está cortando
    avisos.push({
      id: `a:cronograma:${c.dia}:${c.zona}`,
      servicio: 'agua', programado: true, dia: c.dia, desde: c.desde, hasta, finISO, duracionHoras: d.duracionHoras,
      barrios: [], zona: zonas.length ? zonas : [c.zona],
      titulo: `Corte de agua en ${c.zona} · cronograma de verano`,
      resumen: BAJADA_CRONOGRAMA,
      fuentes: [{ medio: cronograma.fuente || 'SCPL', url: null }],
      cronograma: true,
      publicado: inicioISO,
      inicioISO,
    });
  }

  // Lo vencido no sale: 12 h después del fin si se sabe; si no, 72 h desde que se publicó.
  const vence = a => (a.finISO ? Date.parse(a.finISO) + (cfg.horasDespuesDelFin ?? 12) * HORA : Date.parse(a.publicado) + (cfg.ventanaSinFinHoras ?? 72) * HORA);
  const vigentes = avisos.filter(a => vence(a) > t0);

  // Orden: cortando ahora → los que vienen (por día y hora) → el resto (lo más nuevo primero).
  const tipo = a => {
    if (a.inicioISO && a.finISO && Date.parse(a.inicioISO) <= t0 && t0 < Date.parse(a.finISO)) return 0;
    if (a.dia && (a.finISO ? Date.parse(a.finISO) > t0 : a.dia >= diaAR(ahora))) return 1;
    return 2;
  };
  vigentes.sort((a, b) => tipo(a) - tipo(b)
    || (tipo(a) < 2 ? Date.parse(a.inicioISO) - Date.parse(b.inicioISO) : Date.parse(b.publicado) - Date.parse(a.publicado))
    || a.id.localeCompare(b.id));
  return vigentes.map(({ inicioISO, ...a }) => a);
}

// «Agua · programado», «Luz · avería», «Agua · cronograma de verano», «Luz» (sin saber si es programado).
function etiquetaDeAviso(a) {
  const servicio = a.servicio ? a.servicio[0].toUpperCase() + a.servicio.slice(1) : 'Corte';
  if (a.cronograma) return `${servicio} · cronograma de verano`;
  if (a.programado === true) return `${servicio} · programado`;
  if (a.programado === false) return `${servicio} · avería`;
  return servicio;
}

module.exports = { leerListadoScpl, leerNotaScpl, vale, esAviso, esAvisoDeAca, notasParaBajar, datosDeAviso, armarAvisos, etiquetaDeAviso, diaAR };
