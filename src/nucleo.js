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
 * ctx = { portales, reglas, ahora }  (ver config/portales.json y config/reglas.json)
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
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
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
  for (const e of regla.etiquetasExcluidas || []) {
    if (etiqueta && etiqueta.includes(e)) return { ok: false, motivo: `no_informativa (etiqueta ${e})` };
  }
  return { ok: true };
}

/* ───────────── agrupar: "misma noticia" ───────────── */

// Una nota entra al grupo con la que más se parece, si supera el umbral y
// salió dentro de la ventana contada desde la primera nota del grupo.
function agrupar(notas, { umbralSimilitud, ventanaMismoHechoHoras }) {
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
        if (s > mejorSim) { mejorSim = s; mejor = g; }
      }
    }
    if (mejor && mejorSim >= umbralSimilitud) {
      mejor.notas.push(n);
      mejor.firmas.push(f);
    } else {
      grupos.push({ id: 'g:' + n.id, primera: t, notas: [n], firmas: [f] });
    }
  }
  return grupos.map(({ firmas, ...g }) => g);
}

/* ───────────── paso 1: preparar ───────────── */

function preparar(notas, { portales, reglas, ahora }) {
  const t0 = Date.parse(ahora);
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
    const ficha = {
      id: g.id,
      titulo: base.titulo,
      bajada: base.bajada || '',
      primera: new Date(g.primera).toISOString(),
      gruposIndependientes: verif.cantidad,
      notas: g.notas.map(n => ({ id: n.id, titulo: n.titulo, bajada: n.bajada || '', url: n.url, portal: dominioDe(n), seccion: n.seccion || '' })),
    };
    const viejo = t0 - g.primera > reglas.ventanaFrescoHoras * HORA;
    if (verif.cantidad < reglas.minGrupos) {
      if (viejo) descartadas.push({ tipo: 'hecho', id: g.id, titulo: ficha.titulo, motivo: `no_llego_a_${reglas.minGrupos} (${verif.cantidad}/${reglas.minGrupos}, pasaron más de ${reglas.ventanaFrescoHoras} h)` });
      else enObservacion.push({ ...ficha, contador: `${verif.cantidad}/${reglas.minGrupos}` });
    } else {
      candidatos.push({ ...ficha, viejo });
    }
  }

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
    candidatos, enObservacion, descartadas, avisos,
    resumen: {
      notasEntrada: notas.length,
      fueraDeVentana,
      notasDescartadas: descartadas.filter(d => d.tipo === 'nota').length,
      hechos: grupos.length,
      enObservacion: enObservacion.length,
      candidatos: candidatos.length,
    },
  };
}

/* ───────────── paso 2: decidir ───────────── */

const BLOQUES = ['nacional', 'internacional'];

// juicios[idDelHecho] = {
//   datoNuevo, fuenteConNombre, interesPublico, desmentido  (true/false)
//   bloque: 'nacional' | 'internacional' | null,
//   impacto: 0..3, seccion: 'economía', pais: 'EEUU'
// }
function decidir(candidatos, juicios, { reglas }) {
  const descartadas = [];
  const avisos = [];
  const sobreviven = { nacional: [], internacional: [] };
  const baja = (c, motivo) => descartadas.push({ tipo: 'hecho', id: c.id, titulo: c.titulo, motivo });

  let sinJuicio = 0;
  for (const c of candidatos) {
    const j = juicios && juicios[c.id];
    if (!j) { sinJuicio++; baja(c, 'sin_juicio'); continue; }
    // Criterios 2, 3, 4, 5 y 6: con un solo NO queda afuera, y se dice cuál.
    if (c.viejo && !j.datoNuevo) { baja(c, 'no_fresco (criterio 2)'); continue; }
    if (!j.fuenteConNombre) { baja(c, 'sin_fuente_con_nombre (criterio 3)'); continue; }
    if (!j.interesPublico) { baja(c, 'no_interes_publico (criterio 4)'); continue; }
    if (!BLOQUES.includes(j.bloque)) { baja(c, 'fuera_de_bloque (criterio 5)'); continue; }
    if (j.desmentido) { baja(c, 'desmentido (criterio 6)'); continue; }
    sobreviven[j.bloque].push({ c, j });
  }
  if (sinJuicio) avisos.push(`${sinJuicio} hecho(s) sin juicio de la IA: no se pudieron evaluar. ¿Falló ese paso?`);

  const listas = { nacional: [], internacional: [] };
  const reserva = [];
  for (const bloque of BLOQUES) {
    // Criterio 7: impacto; empate → más grupos independientes → más reciente.
    const orden = sobreviven[bloque].sort((a, b) =>
      (b.j.impacto || 0) - (a.j.impacto || 0) ||
      b.c.gruposIndependientes - a.c.gruposIndependientes ||
      Date.parse(b.c.primera) - Date.parse(a.c.primera));
    const porSeccion = {};
    const porPais = {};
    // Criterio 8: variedad, de arriba hacia abajo hasta llenar el cupo.
    for (const { c, j } of orden) {
      const seccion = j.seccion || '';
      const pais = j.pais || '';
      let motivo = null;
      if (listas[bloque].length >= reglas.cupoPorBloque) motivo = 'cupo';
      else if (seccion && (porSeccion[seccion] || 0) >= reglas.maxPorSeccion) motivo = `tope_seccion (${seccion})`;
      else if (bloque === 'internacional' && pais && (porPais[pais] || 0) >= reglas.maxPorPais) motivo = `tope_pais (${pais})`;
      const salida = {
        id: c.id, titulo: c.titulo, bloque, impacto: j.impacto || 0, seccion, pais,
        gruposIndependientes: c.gruposIndependientes,
        links: c.notas.map(n => ({ portal: n.portal, url: n.url })),
      };
      if (motivo) { reserva.push({ ...salida, motivo }); continue; }
      listas[bloque].push(salida);
      if (seccion) porSeccion[seccion] = (porSeccion[seccion] || 0) + 1;
      if (pais) porPais[pais] = (porPais[pais] || 0) + 1;
    }
  }

  const n = listas.nacional.length;
  const i = listas.internacional.length;
  // El 7 es un tope, no una cuota: nunca se rellena.
  const aviso = (n < reglas.cupoPorBloque || i < reglas.cupoPorBloque)
    ? `Hoy: ${n} ${n === 1 ? 'nacional' : 'nacionales'}, ${i} ${i === 1 ? 'internacional' : 'internacionales'}` : null;

  return { nacionales: listas.nacional, internacionales: listas.internacional, reserva, descartadas, avisos, aviso };
}

module.exports = { normalizar, tokens, similitud, firma, jaccard, dominioDe, emisor, gruposIndependientes, esInformativa, agrupar, preparar, decidir };
