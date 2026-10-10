'use strict';
/**
 * NOTITAN_7M · entrega
 *
 * Pura, como el núcleo: sin dependencias, sin leer archivos y sin Date.now().
 * Toma lo que devuelve decidir() y arma lo que muestra la página (pagina/lista.json):
 * por bloque, las noticias confirmadas, las que les falta 1 medio (para elegir a mano)
 * y cuántas confirmadas quedaron afuera por el tope.
 *
 * Tarjeta = { id, titulo, bajada, etiqueta, via ('A' | 'B' | 'mano'), grupos, medios, links: [{ medio, url }] }
 *   medios: el grupo de cada link, sin repetir (Clarín + TN + Olé = «Clarín»); solo portales de la lista que cuentan.
 *   links[].medio: el nombre del portal (TN, Olé…), o su grupo, o el dominio si no está en la lista.
 */
const { dominioDe, buscarPortal, nombreDeMedio } = require('./nucleo.js');

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

// decidido = lo que devuelve decidir(). `ahora` entra por parámetro (ISO).
function armarEntrega(decidido, { ahora, portales, reglas, ejemplo = false, sinIA = false }) {
  const listas = { nacional: decidido.nacionales, internacional: decidido.internacionales };
  const bloques = {};
  for (const b of BLOQUES) {
    bloques[b] = {
      tope: decidido.cupo[b],
      noticias: (listas[b] || []).map(x => tarjeta(x, portales)),
      aMano: ((decidido.aMano && decidido.aMano[b]) || []).map(x => tarjeta(x, portales)),
      // Solo las que quedaron afuera porque la lista estaba llena. Las de tope de sección o de país no se cuentan.
      afueraPorTope: (decidido.reserva || []).filter(r => r.bloque === b && r.motivo === 'cupo').length,
    };
  }
  return {
    generadaEn: ahora,
    ejemplo: Boolean(ejemplo),
    sinIA: Boolean(sinIA),
    cupoMinimo: reglas.cupoMinimo,
    minGrupos: reglas.minGrupos,
    bloques,
    avisos: [...(decidido.avisos || [])],
  };
}

module.exports = { armarEntrega, tarjeta };
