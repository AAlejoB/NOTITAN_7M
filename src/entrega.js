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
 */
const { dominioDe, buscarPortal, nombreDeMedio } = require('./nucleo.js');
const { etiquetaDeAviso } = require('./avisos.js');

const BLOQUES = ['nacional', 'internacional'];

function tarjeta(salida, portales) {
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
        noticias: (b.noticias || []).map(x => tarjeta(x, zona.portales)),
        aMano: (b.aMano || []).map(x => tarjeta(x, zona.portales)),
        afueraPorTope: b.afueraPorTope || 0,
      };
      orden.push(clave);
    }
  }
  for (const b of BLOQUES) {
    bloques[b] = {
      tope: decidido.cupo[b],
      noticias: (listas[b] || []).map(x => tarjeta(x, portales)),
      aMano: ((decidido.aMano && decidido.aMano[b]) || []).map(x => tarjeta(x, portales)),
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
  };
}

module.exports = { armarEntrega, tarjeta, tarjetaDeAviso };
