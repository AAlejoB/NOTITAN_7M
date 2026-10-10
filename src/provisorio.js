'use strict';
/**
 * NOTITAN_7M · bloque provisorio (etapa 1, sin IA)
 *
 * Pura, como el núcleo: sin leer archivos y sin mirar el reloj.
 * Mientras no haya una IA que juzgue, cada hecho recibe un juicio provisorio:
 * el bloque (nacional o internacional) sale del portal y de la sección de sus notas,
 * y los otros criterios se dan por cumplidos. El juicio lleva `provisorio: true` como marca.
 */
const { dominioDe, buscarPortal } = require('./nucleo.js');

// Una nota leída ({ url, portal, seccion }) o una nota de la ficha de un hecho (portal ya es el dominio).
function pareceInternacional(nota, { portales, reglas }) {
  const portal = buscarPortal(dominioDe(nota), portales);
  if (portal && portal.ambito === 'internacional') return true;
  const secciones = (reglas.provisorio && reglas.provisorio.seccionesInternacionales) || [];
  return secciones.includes(String(nota.seccion || '').trim().toLowerCase());
}

// 'internacional' si la mitad o más de las notas del hecho parecen internacionales.
function bloqueProvisorio(hecho, ctx) {
  const notas = hecho.notas || [];
  const parecen = notas.filter(n => pareceInternacional(n, ctx)).length;
  return parecen * 2 >= notas.length ? 'internacional' : 'nacional';
}

// Un juicio por cada candidato y por cada elegible a mano. Los de enObservacion que no son elegibles no llevan.
function juiciosProvisorios(preparado, ctx) {
  const juicios = {};
  for (const h of [...preparado.candidatos, ...preparado.elegiblesAMano]) {
    juicios[h.id] = {
      datoNuevo: false, fuenteConNombre: true, interesPublico: true, desmentido: false,
      bloque: bloqueProvisorio(h, ctx), seccion: '', pais: '', provisorio: true,
    };
  }
  return juicios;
}

module.exports = { pareceInternacional, bloqueProvisorio, juiciosProvisorios };
