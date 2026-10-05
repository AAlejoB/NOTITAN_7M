'use strict';
/**
 * NOTITAN_7M · las piezas que van alrededor de la IA
 *
 * Todavía NO se llama a ningún modelo: la llamada la arma Don Julio en n8n (capa 4). Acá está todo lo demás,
 * en funciones puras (sin dependencias, sin leer archivos y sin Date.now()), con pruebas:
 *   - qué pares de hechos se le preguntan a la IA («¿son la misma noticia?») y cómo se unen los que dice que sí;
 *   - el texto exacto de las dos preguntas (unión y juicio) y cómo se lee lo que contesta;
 *   - qué posibles desmentidos se le muestran;
 *   - cómo se reconoce lo que ya se juzgó, para no volver a preguntar.
 *
 * Definición de Alejo (04-10): «la misma noticia» es el mismo hecho: la misma gente, lo mismo que pasó, el mismo día.
 * No alcanza con el mismo tema.
 *
 * En todo este archivo, «los grupos» de un conjunto de notas son gruposIndependientes(notas, portales).cantidad
 * (la función del núcleo); no es el campo `gruposIndependientes` de un hecho, que ya es un número.
 */
const { STOP, normalizar, gruposIndependientes, nombreDeMedio, clasificarHecho } = require('./nucleo.js');

const HORA = 3600 * 1000;
const ZONA = 'America/Argentina/Buenos_Aires';

// Qué hechos se miran para armar pares: los de 3 o 4 grupos (valor por defecto de Cowork), más los confirmados de vía A como pareja.
const GRUPOS_MIN_PAR = 3;
const GRUPOS_MAX_PAR = 4;

/* ───────────── palabras propias de un hecho ───────────── */

const BORDES = /^[¿¡"'“”‘’«»():;,.!?…]+|[¿¡"'“”‘’«»():;,.!?…]+$/g;
const MAYUSCULAS_QUE_NO = new Set(['VIVO', 'HOY', 'ULTIMO', 'ULTIMA', 'URGENTE', 'VIDEO', 'FOTOS', 'MINUTO']);
const sinTildes = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '');

// Aproximación a «persona o lugar»: las palabras con mayúscula que no abren una frase. Se miran los títulos que se pasan
// (los de todas las notas del hecho). Devuelve las palabras sin tildes y en minúsculas, sin repetir, en el orden en que aparecen.
//   - Un pedazo (partido por espacios) es «primero» si es el primero del título, si el anterior termina en : . ? ! | —
//     (o es solo ese signo), o si él mismo empieza con ¿ ¡ « “ ‘ " o '. Los primeros no cuentan.
//   - Después se le sacan los signos de los bordes. Cuenta si empieza con mayúscula, tiene 3 letras o más, no está en STOP
//     y, si está toda en mayúsculas, no es VIVO, HOY, ULTIMO, ULTIMA, URGENTE, VIDEO, FOTOS ni MINUTO.
function palabrasPropias(titulos) {
  const out = [];
  for (const titulo of titulos) {
    let primero = true;
    for (const pedazo of String(titulo || '').split(/\s+/).filter(Boolean)) {
      const abreFrase = primero || /^[¿¡«“‘"']/.test(pedazo);
      primero = /[:.?!|—]$/.test(pedazo);
      if (abreFrase) continue;
      const palabra = pedazo.replace(BORDES, '');
      if (!palabra || !/^\p{Lu}/u.test(palabra)) continue;
      const norma = sinTildes(palabra.toLowerCase());
      if (norma.length < 3 || STOP.has(norma)) continue;
      const todaEnMayusculas = palabra === palabra.toUpperCase() && !/\p{Ll}/u.test(palabra);
      if (todaEnMayusculas && MAYUSCULAS_QUE_NO.has(sinTildes(palabra))) continue;
      if (!out.includes(norma)) out.push(norma);
    }
  }
  return out;
}

const palabrasDelHecho = hecho => palabrasPropias(hecho.notas.map(n => n.titulo));

/* ───────────── qué pares se le preguntan a la IA ───────────── */

// Pares de hechos de `preparado` que comparten al menos una palabra propia y cuya `primera` nota está a menos de
// reglas.ventanaMismoHechoHoras una de la otra. Entran los hechos en observación de 3 o 4 grupos y, solo como pareja de
// uno de esos, los candidatos de vía A: dos candidatos nunca forman un par.
// Cada par: { a: <id>, b: <id>, comunes: [palabras], gruposUnion: <n> } (la unión se cuenta sobre las notas de los dos:
// Clarín en los dos vale 1). Salen de más a menos grupos de unión; si empatan, en el orden en que se armaron
// (primero los de observación y después los candidatos; dentro de cada lista, el orden de `preparado`).
function paresParaUnir(preparado, { portales, reglas }) {
  const ventana = reglas.ventanaMismoHechoHoras * HORA;
  const items = [
    ...preparado.enObservacion.filter(h => h.gruposIndependientes >= GRUPOS_MIN_PAR && h.gruposIndependientes <= GRUPOS_MAX_PAR).map(h => ({ h, candidato: false })),
    ...preparado.candidatos.filter(h => h.via === 'A').map(h => ({ h, candidato: true })),
  ].map(x => ({ ...x, palabras: palabrasDelHecho(x.h), t: Date.parse(x.h.primera) }));
  const pares = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (a.candidato && b.candidato) continue;
      if (Math.abs(a.t - b.t) >= ventana) continue;
      const comunes = a.palabras.filter(p => b.palabras.includes(p));
      if (!comunes.length) continue;
      pares.push({ a: a.h.id, b: b.h.id, comunes, gruposUnion: gruposIndependientes([...a.h.notas, ...b.h.notas], portales).cantidad });
    }
  }
  return pares.sort((x, y) => y.gruposUnion - x.gruposUnion);
}

/* ───────────── unir los hechos que la IA dice que son la misma noticia ───────────── */

const porPrimera = (a, b) => Date.parse(a.primera) - Date.parse(b.primera) || String(a.id).localeCompare(String(b.id));

// uniones = [{ a, b, porQue }]: solo las que la IA contestó que sí. Devuelve un `preparado` nuevo, sin tocar el que recibe.
//   - Junta de a grupos: si A va con B y B con C, quedan los tres en un solo hecho.
//   - Una cadena que juntaría dos candidatos (candidato 1 – hecho de 3 – candidato 2): el hecho se une solo al candidato con más
//     grupos (si empatan, al de `primera` más vieja), los candidatos quedan separados y se suma un aviso.
//     Dos candidatos unidos directamente se ignoran (nunca forman un par).
//   - Las notas del hecho unido: todas, sin repetir por id, por fecha y, si empatan, por id. Su id es el del hecho con la
//     `primera` más vieja; título y bajada salen de la primera nota. Los grupos se vuelven a contar (nunca se suman).
//   - Se vuelve a clasificar con la misma función que usa preparar (clasificarHecho): puede quedar candidato, a mano, en observación…
//   - Se agrega `unidoPorIA`: la lista de los porQue de las uniones que se usaron.
//   - Los ids que no están en `preparado` se ignoran.
function unirHechos(preparado, uniones, { portales, reglas, firmas = [], ahora }) {
  const todos = [...preparado.candidatos, ...preparado.enObservacion];
  const porId = new Map(todos.map(h => [h.id, h]));
  const esCandidato = id => preparado.candidatos.some(c => c.id === id);

  // las uniones que se pueden aplicar, y quién es vecino de quién
  const aristas = [];
  const vecinos = new Map();
  for (const u of uniones || []) {
    if (!u || !porId.has(u.a) || !porId.has(u.b) || u.a === u.b) continue;
    if (esCandidato(u.a) && esCandidato(u.b)) continue;
    aristas.push({ a: u.a, b: u.b, porQue: u.porQue || '' });
    for (const [x, y] of [[u.a, u.b], [u.b, u.a]]) { if (!vecinos.has(x)) vecinos.set(x, new Set()); vecinos.get(x).add(y); }
  }

  // componentes conectados
  const visto = new Set();
  const grupos = []; // cada uno: lista de ids
  const avisos = [];
  for (const id of vecinos.keys()) {
    if (visto.has(id)) continue;
    const comp = [];
    const pila = [id];
    visto.add(id);
    while (pila.length) {
      const x = pila.pop();
      comp.push(x);
      for (const y of vecinos.get(x)) if (!visto.has(y)) { visto.add(y); pila.push(y); }
    }
    const candidatos = comp.filter(esCandidato).map(i => porId.get(i))
      .sort((p, q) => q.gruposIndependientes - p.gruposIndependientes || porPrimera(p, q));
    if (candidatos.length <= 1) { grupos.push(comp); continue; }
    // Varios candidatos en la misma cadena: cada uno, de mejor a peor, se queda con lo que alcanza sin pasar por otro candidato.
    const reclamado = new Map(); // id del hecho -> id del candidato que se lo queda
    for (const c of candidatos) {
      reclamado.set(c.id, c.id);
      const cola = [c.id];
      while (cola.length) {
        const x = cola.shift();
        for (const y of vecinos.get(x)) {
          if (esCandidato(y) || reclamado.has(y)) continue;
          reclamado.set(y, c.id);
          cola.push(y);
        }
      }
    }
    for (const [id2, dueno] of reclamado) {
      if (esCandidato(id2)) continue;
      for (const y of vecinos.get(id2)) {
        if (esCandidato(y) && y !== dueno) {
          const texto = `La IA unió un hecho con dos noticias ya confirmadas: ${porId.get(dueno).titulo} y ${porId.get(y).titulo}. Se unió solo a la primera.`;
          if (!avisos.includes(texto)) avisos.push(texto);
        }
      }
    }
    for (const c of candidatos) grupos.push([...reclamado].filter(([, d]) => d === c.id).map(([i]) => i));
  }

  // armar y clasificar cada hecho unido
  const absorbidos = new Set();
  const nuevos = [];
  for (const ids of grupos) {
    if (ids.length < 2) continue;
    const hechos = ids.map(i => porId.get(i)).sort(porPrimera);
    const notasPorId = new Map();
    for (const h of hechos) for (const n of h.notas) if (!notasPorId.has(n.id)) notasPorId.set(n.id, n);
    const notas = [...notasPorId.values()].sort((p, q) => Date.parse(p.fecha) - Date.parse(q.fecha) || String(p.id).localeCompare(String(q.id)));
    const r = clasificarHecho({ id: hechos[0].id, primera: Date.parse(hechos[0].primera), notas }, { portales, reglas, firmas, ahora });
    const usadas = aristas.filter(u => ids.includes(u.a) && ids.includes(u.b)).map(u => u.porQue);
    if (r.hecho) r.hecho.unidoPorIA = usadas;
    for (const i of ids) absorbidos.add(i);
    nuevos.push(r);
  }

  // Lo que no cambió queda en su lugar; cada hecho unido entra antes del primero que es más nuevo que él (así, en una lista
  // ordenada como la de preparar, sigue ordenada).
  const conNuevos = (lista, tipo) => {
    const out = lista.filter(h => !absorbidos.has(h.id));
    for (const r of nuevos) {
      if (r.tipo !== tipo) continue;
      const lugar = out.findIndex(h => porPrimera(r.hecho, h) < 0);
      out.splice(lugar < 0 ? out.length : lugar, 0, r.hecho);
    }
    return out;
  };
  const candidatos = conNuevos(preparado.candidatos, 'candidato');
  const enObservacion = conNuevos(preparado.enObservacion, 'observacion');
  const descartadas = [...preparado.descartadas, ...nuevos.filter(r => r.tipo === 'descartada').map(r => r.descartada)];
  const elegiblesAMano = enObservacion.filter(h => h.elegibleAMano);
  return {
    ...preparado,
    candidatos, enObservacion, elegiblesAMano, descartadas,
    avisos: [...preparado.avisos, ...avisos],
    resumen: {
      ...preparado.resumen,
      hechos: preparado.resumen.hechos - (absorbidos.size - nuevos.length),
      enObservacion: enObservacion.length,
      elegiblesAMano: elegiblesAMano.length,
      candidatos: candidatos.length,
      viaB: candidatos.filter(c => c.via === 'B').length,
    },
  };
}

/* ───────────── el texto de las preguntas ───────────── */

// dd/mm hh:mm, hora de Argentina.
function fechaCorta(iso) {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return '--/-- --:--';
  const partes = new Intl.DateTimeFormat('es-AR', { timeZone: ZONA, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(t);
  const v = tipo => String((partes.find(p => p.type === tipo) || {}).value).padStart(2, '0');
  return `${v('day')}/${v('month')} ${v('hour')}:${v('minute')}`;
}

// «- Medio · dd/mm hh:mm · título · bajada». Sin bajada, termina en el título.
function lineaDeNota(nota, portales) {
  return `- ${nombreDeMedio(nota, portales)} · ${fechaCorta(nota.fecha)} · ${nota.titulo}${nota.bajada ? ` · ${nota.bajada}` : ''}`;
}

const lineasDelHecho = (hecho, portales) => hecho.notas.map(n => lineaDeNota(n, portales)).join('\n');

function buscarHecho(preparado, id) {
  const h = [...preparado.candidatos, ...preparado.enObservacion].find(x => x.id === id);
  if (!h) throw new Error(`No hay un hecho con el id ${id} en lo preparado.`);
  return h;
}

// La pregunta «¿son la misma noticia?» para un par de paresParaUnir, con los dos hechos al final.
function preguntaUnion(par, preparado, { portales }) {
  return [
    'Sos el editor que revisa noticias para 7M. Te paso dos hechos, cada uno con las notas de distintos medios que lo cuentan. ¿Son la misma noticia?',
    '',
    'Son la misma noticia si cuentan el mismo hecho: la misma gente, lo mismo que pasó, el mismo día. No alcanza con que sean del mismo tema.',
    'Ejemplos: «Aprobaron el Presupuesto» y «Qué cambia con el Presupuesto aprobado» son la misma noticia. «Anuncian un paro de colectivos para el jueves» y «Se levantó el paro de colectivos» no lo son: anunciar no es levantar.',
    'Tampoco son la misma noticia «El Presidente inauguró una ruta en Córdoba» y «El Presidente habló en un foro en Madrid» (la misma persona, pero pasó otra cosa), ni «Chile eligió presidente» y «El Gobierno argentino felicitó al nuevo presidente de Chile» (uno es lo que pasó; el otro, lo que alguien hizo por eso).',
    'Si dudás, contestá false: es mejor dejar dos hechos separados que juntar dos que no son.',
    '',
    'Contestá solo con un JSON, sin texto antes ni después:',
    '{"misma": true o false, "porque": "una línea"}',
    '',
    'Hecho A:',
    lineasDelHecho(buscarHecho(preparado, par.a), portales),
    'Hecho B:',
    lineasDelHecho(buscarHecho(preparado, par.b), portales),
  ].join('\n');
}

// Lo que contesta la IA puede venir solo o dentro de un bloque ```json. Cualquier otra cosa da null.
function sacarJson(texto) {
  const crudo = String(texto == null ? '' : texto).trim();
  const bloque = crudo.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  try {
    const dato = JSON.parse(bloque ? bloque[1] : crudo);
    return dato !== null && typeof dato === 'object' && !Array.isArray(dato) ? dato : null;
  } catch (e) {
    return null;
  }
}

// → { misma, porQue } o null. `misma` tiene que ser true o false (no texto) y `porque` un texto. null se trata como «no».
function leerUnion(texto) {
  const d = sacarJson(texto);
  if (!d || typeof d.misma !== 'boolean' || typeof d.porque !== 'string') return null;
  return { misma: d.misma, porQue: d.porque };
}

// La pregunta de juicio de un hecho. `desmentidos`: las notas que devuelve posiblesDesmentidos (puede ser vacía).
function preguntaJuicio(hecho, { portales, reglas, desmentidos = [] }) {
  const ia = reglas.ia || {};
  const deportes = ia.deportes ? 'Los deportes cuentan como interés público.' : 'Los deportes no cuentan como interés público.';
  const farandula = ia.farandula ? 'La farándula también cuenta.' : 'La farándula no cuenta.';
  const notas48 = desmentidos.length ? `:\n${desmentidos.map(n => lineaDeNota(n, portales)).join('\n')}\n` : ': ninguna. ';
  return [
    'Sos el editor que revisa noticias para 7M. Te paso un hecho: las notas de distintos medios que lo cuentan. Contestá solo con un JSON, sin texto antes ni después.',
    '',
    '1. datoNuevo: ¿las notas de las últimas 24 horas cuentan el hecho por primera vez o traen un dato nuevo sobre él? true o false.',
    '2. fuenteConNombre: false si alguna nota dice «trascendió», «habría», «según fuentes», «se especula» o algo parecido, o si el hecho depende de alguien que nadie nombra. true si la fuente está nombrada o el hecho se ve por sí mismo (un resultado, una votación, un discurso público).',
    `3. interesPublico: true si es un asunto público: gobierno, economía, derechos, seguridad, salud, justicia, servicios, clima extremo o conflictos. false si es un chimento o un viral. ${deportes} ${farandula}`,
    '4. bloque: "nacional" si el hecho pasó en Argentina y le importa a alguien de otra provincia; "internacional" si pasó fuera de Argentina y toca a Argentina o a la región, o tiene alcance mundial; null si no es ninguna. Se decide por el lugar donde pasó, no por quién lo protagoniza: un argentino que juega, viaja o habla afuera va a "internacional".',
    `5. desmentido: true si la fuente original lo desmintió o un chequeador lo marcó como falso. Mirá también estas notas de las últimas 48 horas${notas48}Si nada lo desmiente, false.`,
    '6. seccion: una palabra: política, economía, sociedad, salud, deportes, cultura, tecnología, policiales, mundo u otra.',
    '7. pais: si es internacional, el país donde pasó; si no, "".',
    '8. porque: una línea por cada respuesta que deja la noticia afuera, por ejemplo {"interesPublico": "es un chimento de TV"}. {} si todo pasa.',
    '',
    'Formato:',
    '{"datoNuevo": true, "fuenteConNombre": true, "interesPublico": true, "bloque": "nacional", "desmentido": false, "seccion": "economía", "pais": "", "porque": {}}',
    '',
    'Hecho:',
    lineasDelHecho(hecho, portales),
  ].join('\n');
}

// → { datoNuevo, fuenteConNombre, interesPublico, bloque, desmentido, seccion, pais, porQue } o null.
// Los cuatro sí/no tienen que ser true o false; bloque, "nacional", "internacional" o null (acepta mayúsculas); seccion y pais, texto;
// porque, un objeto (si falta, {}). Si falta algo o no cumple, null: para decidir() es un hecho sin_juicio, que no sale.
function leerJuicio(texto) {
  const d = sacarJson(texto);
  if (!d) return null;
  for (const k of ['datoNuevo', 'fuenteConNombre', 'interesPublico', 'desmentido']) if (typeof d[k] !== 'boolean') return null;
  let bloque = d.bloque;
  if (typeof bloque === 'string') bloque = bloque.trim().toLowerCase();
  if (bloque !== 'nacional' && bloque !== 'internacional' && bloque !== null) return null;
  if (typeof d.seccion !== 'string' || typeof d.pais !== 'string') return null;
  let porque = d.porque;
  if (porque === undefined) porque = {};
  if (porque === null || typeof porque !== 'object' || Array.isArray(porque)) return null;
  return { datoNuevo: d.datoNuevo, fuenteConNombre: d.fuenteConNombre, interesPublico: d.interesPublico, bloque, desmentido: d.desmentido, seccion: d.seccion, pais: d.pais, porQue: porque };
}

/* ───────────── posibles desmentidos ───────────── */

// De `notas` (todo lo acumulado, 48 h), las que en el título tienen alguna de reglas.ia.palabrasDesmentido (como palabra o frase
// entera, no adentro de otra palabra) y comparten al menos una palabra propia con el hecho. Pueden ser del propio hecho.
// Sin repetir, las más nuevas primero, hasta reglas.ia.maxDesmentidos.
function posiblesDesmentidos(hecho, notas, { reglas }) {
  const ia = reglas.ia || {};
  const frases = (ia.palabrasDesmentido || []).map(normalizar).filter(Boolean);
  const propias = palabrasDelHecho(hecho);
  const vistas = new Set();
  const out = [];
  for (const n of [...notas].sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha))) {
    const titulo = ` ${normalizar(n.titulo)} `;
    if (!frases.some(f => titulo.includes(` ${f} `))) continue;
    if (!palabrasPropias([n.titulo]).some(p => propias.includes(p))) continue;
    const clave = n.id != null ? n.id : n.url;
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    out.push(n);
    if (out.length >= (ia.maxDesmentidos || 5)) break;
  }
  return out;
}

/* ───────────── lo que ya se juzgó ───────────── */

// guardados = [{ urls: [<url>…], juicio, fecha, desmentidosVistos: [<url>…] }]. Dónde se guardan lo decide la capa 4.
const urlsDelHecho = hecho => hecho.notas.map(n => n.url);

// El primer guardado que comparte al menos una url con las notas del hecho, o null.
function buscarGuardado(hecho, guardados) {
  const propias = urlsDelHecho(hecho);
  return (guardados || []).find(g => (g.urls || []).some(u => propias.includes(u))) || null;
}

// true si no hay guardado, o si alguno de los desmentidos (notas o urls) no estaba entre los que ya se habían visto.
function hayQueVolverAPreguntar(hecho, guardado, desmentidos = []) {
  if (!guardado) return true;
  const vistos = guardado.desmentidosVistos || [];
  return desmentidos.some(d => !vistos.includes(typeof d === 'string' ? d : d.url));
}

module.exports = {
  palabrasPropias, paresParaUnir, unirHechos, preguntaUnion, leerUnion, preguntaJuicio, leerJuicio,
  posiblesDesmentidos, buscarGuardado, hayQueVolverAPreguntar,
};
