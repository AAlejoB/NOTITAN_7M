'use strict';
/**
 * NOTITAN_7M · núcleo
 *
 * Funciones puras: sin dependencias, sin leer archivos y sin Date.now().
 * Todo entra por parámetro, así el archivo entero se puede pegar en un
 * Code node de n8n (se borra la última línea, module.exports).
 *
 * Dos pasos, porque en el medio va la IA (que juzga lo que no se puede medir):
 *   1. preparar(notas, ctx)            → agrupa, cuenta grupos, descarta lo barato
 *   2. decidir(candidatos, juicios, ctx) → aplica "entra o no" y arma las listas
 *
 * Flujo con la excepción a mano (una noticia a la que le falta 1 medio, "4 de 5"):
 *   preparar devuelve `candidatos` (5 grupos o firma) y `elegiblesAMano` (les falta 1 medio).
 *   La IA juzga las dos listas. decidir recibe `elegiblesAMano` en ctx y devuelve, además de
 *   las listas de siempre, `aMano` por bloque: un menú de donde la persona elige. Nunca entran
 *   solas a nacionales ni a internacionales.
 *
 * ctx = { portales, reglas, firmas, ahora }
 *   (ver config/portales.json, config/reglas.json y config/firmas.json; firmas es opcional)
 */

const HORA = 3600 * 1000;

const STOP = new Set((
  'el la los las un una unos unas de del al en y e o u que se su sus por con sin para como mas pero ' +
  'es son fue ser ha han habia hay lo le les este esta estos estas ese esa tras ante entre sobre ' +
  'the of and to in on for is are was were by with at from as an'
).split(' '));

// Una nota copiada de agencia: "(EFE)", "con información de agencias", "según Reuters"
const CABLE = /\((efe|afp|ap|reuters|na|dpa|europa press|ansa)\)|con informaci[oó]n de (agencias|efe|afp|ap|reuters|na)\b|seg[uú]n (efe|afp|ap|reuters)\b/i;

/* ───────────── texto ───────────── */

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9%\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Raíz tosca: aprobó / aprobaron / aprobado → "aprob". Las cifras se conservan enteras.
function tokens(texto) {
  const out = new Set();
  for (const t of normalizar(texto).split(' ')) {
    if (!t || STOP.has(t)) continue;
    if (/^\d/.test(t)) { out.add(t); continue; }
    if (t.length < 3) continue;
    out.add(t.slice(0, 5));
  }
  return out;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function firma(nota) {
  return {
    titulo: tokens(nota.titulo),
    completo: tokens(`${nota.titulo || ''} ${nota.bajada || ''}`),
  };
}

// Título solo, o título + bajada: gana el más parecido.
function similitud(fa, fb) {
  return Math.max(jaccard(fa.titulo, fb.titulo), jaccard(fa.completo, fb.completo));
}

/* ───────────── portales ───────────── */

function dominioDe(nota) {
  const crudo = nota.portal || nota.url || '';
  const m = String(crudo).toLowerCase().match(/^(?:https?:\/\/)?(?:www\.)?([^/:?#\s]+)/);
  return m ? m[1] : '';
}

function buscarPortal(dominio, portales) {
  return portales.find(p => dominio === p.dominio || dominio.endsWith('.' + p.dominio)) || null;
}

// A quién se le suma la nota. Un cable copiado suma para la agencia, no para el medio.
function emisor(nota, portales) {
  const portal = buscarPortal(dominioDe(nota), portales);
  if (!portal) return { clave: null, motivo: 'portal_fuera_de_lista' };
  if (portal.cuenta === false) return { clave: null, motivo: 'no_suma_' + portal.tipo };
  if (portal.activo === false) return { clave: null, motivo: 'portal_inactivo' };
  if (portal.tipo === 'medio') {
    const m = `${nota.bajada || ''} ${nota.firma || ''}`.match(CABLE) || String(nota.titulo || '').match(CABLE);
    if (m) {
      const agencia = m.slice(1).find(Boolean);
      return { clave: normalizar(agencia), motivo: null, cable: true };
    }
  }
  return { clave: normalizar(portal.grupo), motivo: null };
}

// "Se cuenta por grupo, no por dominio": Clarín + TN + Olé valen 1.
function gruposIndependientes(notas, portales) {
  const claves = new Set();
  const ignoradas = [];
  for (const n of notas) {
    const e = emisor(n, portales);
    if (e.clave) claves.add(e.clave);
    else ignoradas.push({ id: n.id, motivo: e.motivo });
  }
  return { cantidad: claves.size, claves: [...claves], ignoradas };
}

/* ───────────── criterio 1: nota informativa ───────────── */

function esInformativa(nota, regla) {
  const url = String(nota.url || '').toLowerCase();
  const titulo = normalizar(nota.titulo);
  const etiqueta = normalizar(nota.etiqueta);
  for (const u of regla.urlsExcluidas || []) {
    if (url.includes(u)) return { ok: false, motivo: `no_informativa (url ${u})` };
  }
  for (const t of regla.titulosExcluidos || []) {
    if (new RegExp(t).test(titulo)) return { ok: false, motivo: `no_informativa (título ${t})` };
  }
  for (const m of regla.notasDeServicio || []) {
    if (new RegExp(m.molde).test(titulo)) return { ok: false, motivo: `nota_de_servicio (${m.nombre})` };
  }
  for (const e of regla.etiquetasExcluidas || []) {
    if (etiqueta && etiqueta.includes(e)) return { ok: false, motivo: `no_informativa (etiqueta ${e})` };
  }
  return { ok: true };
}

/* ───────────── agrupar: "misma noticia" ───────────── */

// Cuántas palabras comparten dos notas (los elementos de `completo`, que arma firma() con título y bajada).
function palabrasComunes(fa, fb) {
  let n = 0;
  for (const t of fa.completo) if (fb.completo.has(t)) n++;
  return n;
}

// Una nota entra al grupo con la que más se parece, si el par "califica" y salió dentro de la
// ventana contada desde la primera nota del grupo. Un par califica si la similitud llega a
// `umbralSeguro`, o si llega a `umbralSimilitud` y además comparten al menos `minPalabrasComunes`
// palabras. Así un umbral bajo no junta dos etapas distintas de un tema que comparten pocas
// palabras. Si faltan los dos valores nuevos, el resultado es el de siempre.
function agrupar(notas, { umbralSimilitud, ventanaMismoHechoHoras, umbralSeguro = umbralSimilitud, minPalabrasComunes = 0 }) {
  const orden = [...notas].sort((a, b) =>
    Date.parse(a.fecha) - Date.parse(b.fecha) || String(a.id).localeCompare(String(b.id)));
  const grupos = [];
  for (const n of orden) {
    const t = Date.parse(n.fecha);
    const f = firma(n);
    let mejor = null;
    let mejorSim = 0;
    for (const g of grupos) {
      if (t - g.primera > ventanaMismoHechoHoras * HORA) continue;
      for (const m of g.firmas) {
        const s = similitud(f, m);
        if (s <= mejorSim) continue;
        if (s >= umbralSeguro || (s >= umbralSimilitud && palabrasComunes(f, m) >= minPalabrasComunes)) { mejorSim = s; mejor = g; }
      }
    }
    if (mejor) {
      mejor.notas.push(n);
      mejor.firmas.push(f);
    } else {
      grupos.push({ id: 'g:' + n.id, primera: t, notas: [n], firmas: [f] });
    }
  }
  return grupos.map(({ firmas, ...g }) => g);
}

/* ───────────── vía B: firma reconocida ───────────── */

// Segunda línea de verificación. Si un hecho no llega a reglas.minGrupos, lo puede
// respaldar un mínimo de autores distintos de la lista que arma Alejo (config/firmas.json).
// Una firma suma solo si su nota es informativa (ya pasó el criterio 1, así que una
// columna de opinión no cuenta) y salió en un portal que cuenta. Un autor vale 1 aunque
// firme en varios portales. La coincidencia es por nombre completo o alias, sin tildes.
function firmasDelHecho(notas, firmas, portales) {
  const halladas = new Map();
  for (const n of notas) {
    const portal = buscarPortal(dominioDe(n), portales);
    if (!portal || portal.cuenta === false || portal.activo === false) continue;
    const texto = ` ${normalizar(n.firma)} `;
    for (const f of firmas) {
      if (halladas.has(f.nombre)) continue;
      const nombres = [f.nombre, ...(f.alias || [])].map(normalizar).filter(Boolean);
      if (nombres.some(k => texto.includes(` ${k} `))) halladas.set(f.nombre, f);
    }
  }
  return [...halladas.values()];
}

// Excepción a mano: un hecho en observación al que le faltan entre 1 y reglas.aMano.faltanMedios
// medios para llegar a minGrupos se puede elegir a mano. Sin reglas.aMano, o con activa:false, no hay.
function faltaPocoParaElegirAMano(faltan, reglas) {
  const a = reglas.aMano;
  if (!a || a.activa === false) return false;
  return faltan >= 1 && faltan <= (a.faltanMedios || 1);
}

// Sin reglas.viaB, o con activa:false, la vía B no existe.
function minimoFirmas(reglas) {
  const v = reglas.viaB;
  return v && v.activa !== false ? (v.minFirmas || 2) : Infinity;
}

// "Respaldada por A", "… por A y B" y, si hay más autores que reglas.viaB.maxFirmasEnEtiqueta, "… por A y B (y 1 más)".
function etiquetaViaB(firmasDelBloque, reglas) {
  const nombres = firmasDelBloque.map(f => f.nombre);
  const tope = reglas.viaB && reglas.viaB.maxFirmasEnEtiqueta;
  const mostrados = tope ? nombres.slice(0, tope) : nombres;
  const resto = nombres.length - mostrados.length;
  return `Respaldada por ${unir(mostrados)}${resto ? ` (y ${resto} más)` : ''}`;
}

// "A", "A y B", "A, B y C"
function unir(lista) {
  return lista.length < 2 ? lista.join('') : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`;
}

/* ───────────── acumular lecturas ───────────── */

// Junta lo ya guardado con lo recién leído y saca lo que pasó de la ventana de recolección.
// Pura: no toca los arrays que recibe, no lee archivos y no mira el reloj (la hora entra por `ahora`).
// Si un id está en las dos listas queda la versión de `nuevas`. Las notas salen por fecha y, si empatan, por id.
// Devuelve { notas, agregadas, repetidas, borradas }: `agregadas` son los ids que no estaban guardados, `repetidas`
// los que ya estaban y `borradas` las notas sacadas por viejas, vengan de la lista que vengan.
function acumular(guardadas, nuevas, { reglas, ahora }) {
  const t0 = Date.parse(ahora);
  const limite = reglas.ventanaRecoleccionHoras * HORA;
  const conocidos = new Set(guardadas.map(n => n.id));
  const porId = new Map(guardadas.map(n => [n.id, n]));
  const agregadas = [];
  const repetidas = [];
  for (const n of nuevas) {
    if (conocidos.has(n.id)) repetidas.push(n.id);
    else { agregadas.push(n.id); conocidos.add(n.id); }
    porId.set(n.id, n);
  }
  const notas = [];
  const borradas = [];
  for (const n of porId.values()) (t0 - Date.parse(n.fecha) > limite ? borradas : notas).push(n);
  notas.sort((a, b) => Date.parse(a.fecha) - Date.parse(b.fecha) || String(a.id).localeCompare(String(b.id)));
  return { notas, agregadas, repetidas, borradas };
}

/* ───────────── paso 1: preparar ───────────── */

function preparar(notas, { portales, reglas, ahora, firmas = [] }) {
  const t0 = Date.parse(ahora);
  const minFirmas = minimoFirmas(reglas);
  const descartadas = [];
  const avisos = [];

  // 0. Ventana de recolección
  const recientes = notas.filter(n => t0 - Date.parse(n.fecha) <= reglas.ventanaRecoleccionHoras * HORA);
  const fueraDeVentana = notas.length - recientes.length;

  // 1. Criterio 1, nota por nota. Lo que cae acá no cuenta para la verificación.
  const validas = [];
  for (const n of recientes) {
    const r = esInformativa(n, reglas.criterio1 || {});
    if (r.ok) validas.push(n);
    else descartadas.push({ tipo: 'nota', id: n.id, titulo: n.titulo, portal: dominioDe(n), motivo: r.motivo });
  }

  // 2. Agrupar en hechos y contar grupos independientes
  const grupos = agrupar(validas, reglas);
  const candidatos = [];
  const enObservacion = [];
  for (const g of grupos) {
    const verif = gruposIndependientes(g.notas, portales);
    const base = g.notas[0];
    const reconocidas = firmasDelHecho(g.notas, firmas, portales);
    const ficha = {
      id: g.id,
      titulo: base.titulo,
      bajada: base.bajada || '',
      primera: new Date(g.primera).toISOString(),
      gruposIndependientes: verif.cantidad,
      firmasReconocidas: reconocidas.map(f => ({ nombre: f.nombre, ambitos: f.ambitos || BLOQUES })),
      notas: g.notas.map(n => ({ id: n.id, titulo: n.titulo, bajada: n.bajada || '', url: n.url, portal: dominioDe(n), seccion: n.seccion || '' })),
    };
    const viejo = t0 - g.primera > reglas.ventanaFrescoHoras * HORA;
    if (verif.cantidad >= reglas.minGrupos) {
      candidatos.push({ ...ficha, via: 'A', viejo });
    } else if (reconocidas.length >= minFirmas) {
      candidatos.push({ ...ficha, via: 'B', viejo });
    } else if (viejo) {
      descartadas.push({ tipo: 'hecho', id: g.id, titulo: ficha.titulo, motivo: `no_llego_a_${reglas.minGrupos} (${verif.cantidad}/${reglas.minGrupos}, pasaron más de ${reglas.ventanaFrescoHoras} h)` });
    } else {
      const obs = { ...ficha, contador: `${verif.cantidad}/${reglas.minGrupos}` };
      if (reconocidas.length) obs.contadorFirmas = `${reconocidas.length}/${minFirmas}`;
      obs.elegibleAMano = faltaPocoParaElegirAMano(reglas.minGrupos - verif.cantidad, reglas);
      enObservacion.push(obs);
    }
  }
  const elegiblesAMano = enObservacion.filter(o => o.elegibleAMano);

  // Salud de los datos: un portal en 0 notas casi siempre es un feed roto, no un día sin noticias.
  const conNotas = new Set();
  for (const n of notas) {
    const p = buscarPortal(dominioDe(n), portales);
    if (p) conNotas.add(p.dominio);
  }
  const sinNotas = portales
    .filter(p => p.cuenta !== false && p.activo !== false && !conNotas.has(p.dominio))
    .map(p => p.dominio);
  if (sinNotas.length) avisos.push(`Portales sin notas en esta corrida (¿feed roto?): ${sinNotas.join(', ')}`);

  return {
    candidatos, enObservacion, elegiblesAMano, descartadas, avisos,
    resumen: {
      notasEntrada: notas.length,
      fueraDeVentana,
      notasDescartadas: descartadas.filter(d => d.tipo === 'nota').length,
      hechos: grupos.length,
      enObservacion: enObservacion.length,
      elegiblesAMano: elegiblesAMano.length,
      candidatos: candidatos.length,
      viaB: candidatos.filter(c => c.via === 'B').length,
    },
  };
}

/* ───────────── paso 2: decidir ───────────── */

const BLOQUES = ['nacional', 'internacional'];

// Cuántas noticias por bloque pide quien aprieta el botón. Se elige entre
// reglas.cupoMinimo y reglas.cupoPorBloque (que es el máximo). `cupo` puede ser un número
// para los dos bloques o { nacional, internacional }. Sin elegir, vale el máximo.
// Lo que se sale del rango se acomoda y se avisa; nunca se rellena con notas que no pasaron.
function cupoElegido(reglas, cupo, avisos) {
  const max = reglas.cupoPorBloque;
  const min = Math.min(reglas.cupoMinimo || 1, max);
  const uno = (pedido, nombre) => {
    const n = pedido == null || pedido === '' ? NaN : Number(pedido);
    if (!Number.isFinite(n)) return max;
    const usado = Math.min(max, Math.max(min, Math.round(n)));
    if (usado !== n) avisos.push(`Se pidieron ${n} ${nombre}; se usaron ${usado} (el rango es de ${min} a ${max}).`);
    return usado;
  };
  const porBloque = cupo !== null && typeof cupo === 'object';
  return {
    nacional: uno(porBloque ? cupo.nacional : cupo, 'nacionales'),
    internacional: uno(porBloque ? cupo.internacional : cupo, 'internacionales'),
  };
}

// juicios[idDelHecho] = {
//   datoNuevo, fuenteConNombre, interesPublico, desmentido  (true/false)
//   bloque: 'nacional' | 'internacional' | null,
//   impacto: 0..3, seccion: 'economía', pais: 'EEUU'
// }
// Criterios 3, 4, 5 y 6 sobre el juicio de la IA. Devuelve el motivo del primer NO, o null si pasa.
function motivoCriterios3a6(j) {
  if (!j.fuenteConNombre) return 'sin_fuente_con_nombre (criterio 3)';
  if (!j.interesPublico) return 'no_interes_publico (criterio 4)';
  if (!BLOQUES.includes(j.bloque)) return 'fuera_de_bloque (criterio 5)';
  if (j.desmentido) return 'desmentido (criterio 6)';
  return null;
}

function decidir(candidatos, juicios, { reglas, cupo, elegiblesAMano = [] }) {
  const descartadas = [];
  const avisos = [];
  const cupoUsado = cupoElegido(reglas, cupo, avisos);
  const topeViaB = reglas.viaB && reglas.viaB.maxNoticiasPorBloque;
  const sobreviven = { nacional: [], internacional: [] };
  const minFirmas = minimoFirmas(reglas);
  const baja = (c, motivo, aMano = false) =>
    descartadas.push({ tipo: 'hecho', id: c.id, titulo: c.titulo, motivo, ...(aMano ? { aMano: true } : {}) });

  let sinJuicio = 0;
  for (const c of candidatos) {
    const j = juicios && juicios[c.id];
    if (!j) { sinJuicio++; baja(c, 'sin_juicio'); continue; }
    // Criterios 2, 3, 4, 5 y 6: con un solo NO queda afuera, y se dice cuál.
    if (c.viejo && !j.datoNuevo) { baja(c, 'no_fresco (criterio 2)'); continue; }
    const motivo3a6 = motivoCriterios3a6(j);
    if (motivo3a6) { baja(c, motivo3a6); continue; }
    // Vía B: cada autor está habilitado para nacional, internacional o los dos (config/firmas.json).
    // Con el bloque ya decidido tienen que seguir siendo suficientes.
    let firmasDelBloque = [];
    if (c.via === 'B') {
      firmasDelBloque = (c.firmasReconocidas || []).filter(f => (f.ambitos || BLOQUES).includes(j.bloque));
      if (firmasDelBloque.length < minFirmas) { baja(c, `firmas_no_habilitadas_para_${j.bloque} (vía B)`); continue; }
    }
    sobreviven[j.bloque].push({ c, j, firmasDelBloque });
  }

  // Excepción a mano: les falta 1 medio. Mismos controles que un candidato (el 2 no se mira: son
  // frescos por definición) y van a un menú aparte, sin cupo, sin topes y sin reserva.
  const menu = { nacional: [], internacional: [] };
  for (const c of elegiblesAMano || []) {
    const j = juicios && juicios[c.id];
    if (!j) { sinJuicio++; baja(c, 'sin_juicio', true); continue; }
    const motivo = motivoCriterios3a6(j);
    if (motivo) { baja(c, motivo, true); continue; }
    menu[j.bloque].push({ c, j });
  }
  if (sinJuicio) avisos.push(`${sinJuicio} hecho(s) sin juicio de la IA: no se pudieron evaluar. ¿Falló ese paso?`);
  const aMano = {};
  for (const bloque of BLOQUES) {
    aMano[bloque] = menu[bloque]
      .sort((a, b) =>
        (b.j.impacto || 0) - (a.j.impacto || 0) ||
        b.c.gruposIndependientes - a.c.gruposIndependientes ||
        Date.parse(b.c.primera) - Date.parse(a.c.primera))
      .map(({ c, j }) => ({
        id: c.id, titulo: c.titulo, bloque, impacto: j.impacto || 0, seccion: j.seccion || '', pais: j.pais || '',
        via: 'mano',
        etiqueta: `Confirmada por ${c.gruposIndependientes} medios · elegida a mano`,
        gruposIndependientes: c.gruposIndependientes,
        links: c.notas.map(n => ({ portal: n.portal, url: n.url })),
      }));
  }

  const listas = { nacional: [], internacional: [] };
  const reserva = [];
  for (const bloque of BLOQUES) {
    // La vía B es la segunda línea: va después de todo lo confirmado por la vía A.
    // Criterio 7, dentro de cada vía: impacto; empate → más grupos independientes → más reciente.
    const orden = sobreviven[bloque].sort((a, b) =>
      (a.c.via === 'B') - (b.c.via === 'B') ||
      (b.j.impacto || 0) - (a.j.impacto || 0) ||
      b.c.gruposIndependientes - a.c.gruposIndependientes ||
      Date.parse(b.c.primera) - Date.parse(a.c.primera));
    const porSeccion = {};
    const porPais = {};
    let enViaB = 0;
    // Criterio 8: variedad, de arriba hacia abajo hasta llenar el cupo.
    for (const { c, j, firmasDelBloque } of orden) {
      const seccion = j.seccion || '';
      const pais = j.pais || '';
      const viaB = c.via === 'B';
      let motivo = null;
      if (listas[bloque].length >= cupoUsado[bloque]) motivo = 'cupo';
      else if (viaB && topeViaB != null && enViaB >= topeViaB) motivo = 'tope_via_B';
      else if (seccion && (porSeccion[seccion] || 0) >= reglas.maxPorSeccion) motivo = `tope_seccion (${seccion})`;
      else if (bloque === 'internacional' && pais && (porPais[pais] || 0) >= reglas.maxPorPais) motivo = `tope_pais (${pais})`;
      const salida = {
        id: c.id, titulo: c.titulo, bloque, impacto: j.impacto || 0, seccion, pais,
        via: viaB ? 'B' : 'A',
        etiqueta: viaB ? etiquetaViaB(firmasDelBloque, reglas) : `Confirmada por ${c.gruposIndependientes} medios`,
        gruposIndependientes: c.gruposIndependientes,
        links: c.notas.map(n => ({ portal: n.portal, url: n.url })),
      };
      if (motivo) { reserva.push({ ...salida, motivo }); continue; }
      listas[bloque].push(salida);
      if (viaB) enViaB++;
      if (seccion) porSeccion[seccion] = (porSeccion[seccion] || 0) + 1;
      if (pais) porPais[pais] = (porPais[pais] || 0) + 1;
    }
  }

  const n = listas.nacional.length;
  const i = listas.internacional.length;
  // El cupo es un tope, no una cuota: nunca se rellena. Si no se llega al mínimo, se dice y no se baja el estándar.
  const minimo = Math.min(reglas.cupoMinimo || 1, reglas.cupoPorBloque);
  if (n < minimo) avisos.push(`Nacionales: solo ${n} pasaron los filtros (el mínimo es ${minimo}). No se baja el estándar para completar.`);
  if (i < minimo) avisos.push(`Internacionales: solo ${i} pasaron los filtros (el mínimo es ${minimo}). No se baja el estándar para completar.`);
  const aviso = (n < cupoUsado.nacional || i < cupoUsado.internacional)
    ? `Hoy: ${n} ${n === 1 ? 'nacional' : 'nacionales'}, ${i} ${i === 1 ? 'internacional' : 'internacionales'}` : null;

  return { nacionales: listas.nacional, internacionales: listas.internacional, aMano, cupo: cupoUsado, reserva, descartadas, avisos, aviso };
}

module.exports = { normalizar, tokens, similitud, firma, jaccard, dominioDe, emisor, gruposIndependientes, esInformativa, agrupar, acumular, preparar, decidir };
