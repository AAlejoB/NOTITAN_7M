'use strict';
/**
 * NOTITAN_7M · entrega
 *
 * Pura, como el núcleo: sin dependencias, sin leer archivos y sin Date.now().
 * Toma lo que devuelve decidir() y arma lo que muestra la página (pagina/lista.json):
 * por bloque, las noticias confirmadas, las que les falta 1 medio (para elegir a mano)
 * y cuántas confirmadas quedaron afuera por el tope.
 *
 * Con `zona` (lo que devuelve decidirZona de src/zona.js, más `portales`: los de config/zona/portales.json), los bloques
 * de la zona van primero (con `nombre` y `minimo: 1`) y después nacional e internacional. `orden` dice en qué orden se dibujan
 * los bloques; sin zona es ['nacional', 'internacional'] y todo lo demás sale igual que antes.
 *
 * Tarjeta = { id, titulo, bajada, etiqueta, via ('A' | 'B' | 'mano'), grupos, medios, links: [{ medio, url }] }
 *   medios: el grupo de cada link, sin repetir (Clarín + TN + Olé = «Clarín»); solo portales de la lista que cuentan.
 *   links[].medio: el nombre del portal (TN, Olé…), o su grupo, o el dominio si no está en la lista.
 *
 * Con `avisos` (lo que devuelve armarAvisos de src/avisos.js) y al menos uno, el bloque «Avisos» va primero de todo.
 * Tarjeta de aviso = la de siempre con via: 'aviso', bajada: el resumen del aviso, la SCPL como «SCPL» en medios y links,
 * y además aviso: { servicio, programado, dia, desde, hasta, duracionHoras, barrios, zona, cronograma }.
 * El `avisos` de primer nivel de la lista sigue siendo el de siempre (los avisos de decidir: «no se llegó al mínimo»…).
 *
 * Cada tarjeta de noticia lleva además `tema` (el nombre de un tema de reglas.pagina.temas, o «Sin tema»; ver temaDe) y
 * `hora` (la fecha de su primera nota). `lista.pagina` = { nombre, escalon, temas: [{ nombre, prendido }], motivos } sale de
 * reglas.pagina (sin secciones ni palabras: la página no las necesita), o de PAGINA_POR_DEFECTO si no está.
 */
const { dominioDe, buscarPortal, nombreDeMedio, normalizar } = require('./nucleo.js');
const { etiquetaDeAviso } = require('./avisos.js');

const BLOQUES = ['nacional', 'internacional'];
const ESCALONES = ['normal', 'plus'];

const PAGINA_POR_DEFECTO = {
  nombre: '7M',
  escalon: 'plus',
  temas: [
    { nombre: 'Política', prendido: true, secciones: ['politica', 'el-pais', 'elecciones'], palabras: [] },
    { nombre: 'Economía', prendido: true, secciones: ['economia', 'negocios', 'finanzas', 'dolar', 'mercados'], palabras: [] },
    { nombre: 'Sociedad', prendido: true, secciones: ['sociedad', 'informacion-general', 'salud', 'educacion', 'ciencia', 'tecnologia'], palabras: [] },
    { nombre: 'Policiales', prendido: true, secciones: ['policiales', 'judiciales', 'seguridad', 'inseguridad'], palabras: [] },
    { nombre: 'Deportes', prendido: true, secciones: ['deportes', 'deporte', 'futbol', 'ole'], palabras: [] },
    { nombre: 'Espectáculos', prendido: true, secciones: ['espectaculos', 'farandula', 'cultura', 'musica', 'cine', 'series'], palabras: [] },
  ],
  motivos: [
    { clave: 'dato', texto: 'Es un dato, no una noticia' },
    { clave: 'tengo', texto: 'Ya la tengo' },
    { clave: 'opinion', texto: 'Opinión o reacción a otra' },
    { clave: 'bloque', texto: 'Está en el bloque equivocado' },
    { clave: 'vieja', texto: 'Ya pasó, llegó tarde' },
    { clave: 'publico', texto: 'No va con nuestro público' },
    { clave: 'otro', texto: 'Otro motivo…' },
  ],
};

// La config de la página con los valores por defecto donde falta algo.
function configPagina(reglas) {
  const p = (reglas && reglas.pagina) || {};
  return {
    nombre: p.nombre || PAGINA_POR_DEFECTO.nombre,
    escalon: ESCALONES.includes(p.escalon) ? p.escalon : 'plus',
    temas: (Array.isArray(p.temas) ? p.temas : PAGINA_POR_DEFECTO.temas).slice(0, 10),
    motivos: Array.isArray(p.motivos) && p.motivos.length ? p.motivos : PAGINA_POR_DEFECTO.motivos,
  };
}

// El tema de una noticia: (a) la sección que puso la IA, si es de algún tema; (b) la sección de sus notas que más se repite
// entre las que son de algún tema (empate: el tema que va primero en la config); (c) una palabra del título; (d) «Sin tema».
function temaDe({ seccionIA = '', secciones = [], titulo = '' }, temas) {
  const deSeccion = s => temas.find(t => (t.secciones || []).some(x => normalizar(x) === s));
  const ia = normalizar(seccionIA);
  if (ia && deSeccion(ia)) return deSeccion(ia).nombre;
  const cuenta = new Map();
  for (const s of secciones) {
    const t = deSeccion(normalizar(s));
    if (t) cuenta.set(t, (cuenta.get(t) || 0) + 1);
  }
  if (cuenta.size) {
    const max = Math.max(...cuenta.values());
    return temas.find(t => cuenta.get(t) === max).nombre;
  }
  const tit = ` ${normalizar(titulo)} `;
  const porPalabra = temas.find(t => (t.palabras || []).some(p => normalizar(p) && tit.includes(` ${normalizar(p)} `)));
  return porPalabra ? porPalabra.nombre : 'Sin tema';
}

function tarjeta(salida, portales, temas = PAGINA_POR_DEFECTO.temas) {
  const links = [];
  const medios = [];
  for (const l of salida.links || []) {
    const portal = buscarPortal(dominioDe(l), portales);
    links.push({ medio: nombreDeMedio(l, portales), url: l.url });
    if (portal && portal.cuenta !== false && portal.activo !== false && !medios.includes(portal.grupo)) medios.push(portal.grupo);
  }
  return {
    id: salida.id,
    titulo: salida.titulo,
    bajada: salida.bajada || '',
    etiqueta: salida.etiqueta,
    via: salida.via,
    grupos: salida.gruposIndependientes,
    medios,
    links,
    tema: temaDe({ seccionIA: salida.seccion, secciones: salida.secciones || [], titulo: salida.titulo }, temas),
    hora: salida.primera || null,
  };
}

function tarjetaDeAviso(a) {
  const medios = [];
  for (const f of a.fuentes) if (!medios.includes(f.medio)) medios.push(f.medio);
  return {
    id: a.id,
    titulo: a.titulo,
    bajada: a.resumen || '',
    etiqueta: etiquetaDeAviso(a),
    via: 'aviso',
    grupos: a.fuentes.length,
    medios,
    // El cronograma de verano no tiene link: es texto.
    links: a.fuentes.map(f => (a.cronograma ? { medio: 'Cronograma de verano de la SCPL', url: null } : { medio: f.medio, url: f.url })),
    aviso: {
      servicio: a.servicio, programado: a.programado, dia: a.dia, desde: a.desde, hasta: a.hasta,
      duracionHoras: a.duracionHoras, barrios: a.barrios, zona: a.zona, cronograma: Boolean(a.cronograma),
      // Un «se normalizó» lleva además cuándo se publicó (la página lo muestra en lugar del horario).
      ...(a.normalizado ? { normalizado: true, publicado: a.publicado } : {}),
    },
  };
}

// decidido = lo que devuelve decidir(). `ahora` entra por parámetro (ISO).
// provisorias: cuántas noticias de la lista llevan juicio provisorio (la IA no contestó por ellas); cliente: el nombre del cliente
// para el encabezado; paginaViejaMinutos: desde cuántos minutos la página dice «contactá al administrador».
// zona: lo que devuelve decidirZona() con `portales` (los de la zona) adentro, o null.
// avisos: lo que devuelve armarAvisos() (los cortes), o null.
function armarEntrega(decidido, { ahora, portales, reglas, ejemplo = false, sinIA = false, provisorias = 0, cliente = '', paginaViejaMinutos = 60, zona = null, avisos = null }) {
  const listas = { nacional: decidido.nacionales, internacional: decidido.internacionales };
  const pagina = configPagina(reglas);
  const t = (x, ps) => tarjeta(x, ps, pagina.temas);
  const bloques = {};
  const orden = [];
  if (avisos && avisos.length) {
    bloques.avisos = { nombre: 'Avisos', tope: null, noticias: avisos.map(tarjetaDeAviso), aMano: [], afueraPorTope: 0, minimo: 1 };
    orden.push('avisos');
  }
  if (zona) {
    for (const [clave, b] of Object.entries(zona.bloques || {})) {
      bloques[clave] = {
        nombre: b.nombre,
        minimo: b.minimo,
        tope: b.tope,
        noticias: (b.noticias || []).map(x => t(x, zona.portales)),
        aMano: (b.aMano || []).map(x => t(x, zona.portales)),
        afueraPorTope: b.afueraPorTope || 0,
      };
      orden.push(clave);
    }
  }
  for (const b of BLOQUES) {
    bloques[b] = {
      tope: decidido.cupo[b],
      noticias: (listas[b] || []).map(x => t(x, portales)),
      aMano: ((decidido.aMano && decidido.aMano[b]) || []).map(x => t(x, portales)),
      // Solo las que quedaron afuera porque la lista estaba llena. Las de tope de sección o de país no se cuentan.
      afueraPorTope: (decidido.reserva || []).filter(r => r.bloque === b && r.motivo === 'cupo').length,
    };
    orden.push(b);
  }
  return {
    generadaEn: ahora,
    ejemplo: Boolean(ejemplo),
    sinIA: Boolean(sinIA),
    provisorias,
    cliente,
    paginaViejaMinutos,
    cupoMinimo: reglas.cupoMinimo,
    minGrupos: reglas.minGrupos,
    bloques,
    orden,
    avisos: [...(decidido.avisos || [])],
    pagina: {
      nombre: pagina.nombre,
      escalon: pagina.escalon,
      temas: pagina.temas.map(x => ({ nombre: x.nombre, prendido: x.prendido !== false })),
      motivos: pagina.motivos.map(m => ({ clave: m.clave, texto: m.texto })),
    },
  };
}

module.exports = { armarEntrega, tarjeta, tarjetaDeAviso, temaDe, PAGINA_POR_DEFECTO };
