'use strict';
/**
 * NOTITAN_7M · zona (los anillos: Comodoro, Chubut…)
 *
 * Pura, como el núcleo: sin archivos y sin reloj. Toma lo que devuelve preparar() con la config de zona
 * (config/zona/) y arma la lista de cada anillo. Las reglas están en `anillos` y `cruce` de config/zona/reglas.json.
 *
 * - anilloDe: a qué anillo va un hecho, según cuántos de sus grupos son de Comodoro (zona "local") y cuántos
 *   provinciales (zona "provincial"). Recorre los anillos en el orden del archivo: gana el más chico que cumple.
 * - tambienNacional: si el agrupador une el hecho con un hecho nacional de la misma vuelta que tenga al menos
 *   cruce.minGruposNacionales grupos. Una noticia así no se muestra en la zona.
 * - decidirZona: la lista de cada anillo (sin 1/2 a mano, sin IA): viejo → afuera; también nacional → afuera;
 *   sin anillo → afuera; si no, a su anillo, ordenado por grupos y después la más nueva, hasta el cupo.
 */
const { agrupar, buscarPortal, dominioDe, emisor } = require('./nucleo.js');

// Los grupos distintos de un hecho que suman (como gruposIndependientes), y cuántos de esos son locales y cuántos provinciales.
// Un cable copiado suma para la agencia (como en el núcleo) y se cuenta en la zona del portal que lo publicó primero.
function gruposPorZona(hecho, portales) {
  const zonas = new Map();
  for (const n of hecho.notas || []) {
    const e = emisor(n, portales);
    if (!e.clave || zonas.has(e.clave)) continue;
    zonas.set(e.clave, (buscarPortal(dominioDe(n), portales) || {}).zona || null);
  }
  const zs = [...zonas.values()];
  return { total: zonas.size, locales: zs.filter(z => z === 'local').length, provinciales: zs.filter(z => z === 'provincial').length };
}

function anilloDe(hecho, { portales, reglas }) {
  const g = gruposPorZona(hecho, portales);
  for (const a of reglas.anillos || []) {
    const minProv = a.minProvinciales || 0;
    const cumple = minProv === 0
      ? g.locales >= a.minMedios
      : g.locales + g.provinciales >= a.minMedios && g.provinciales >= minProv;
    if (cumple) return a.clave;
  }
  return null;
}

function tambienNacional(hecho, hechosNacionales, { reglas }) {
  const minimo = (reglas.cruce && reglas.cruce.minGruposNacionales) || Infinity;
  const propias = new Set((hecho.notas || []).map(n => n.id));
  for (const nacional of hechosNacionales || []) {
    if (nacional.gruposIndependientes < minimo) continue;
    const ajenas = new Set(nacional.notas.map(n => n.id));
    const grupos = agrupar([...hecho.notas, ...nacional.notas], reglas);
    const junta = grupos.some(g => g.notas.some(n => propias.has(n.id)) && g.notas.some(n => ajenas.has(n.id)));
    if (junta) return { si: true, grupos: nacional.gruposIndependientes };
  }
  return { si: false, grupos: 0 };
}

// Los grupos distintos de las notas de un hecho, en el orden de las notas (el dominio, si el portal no está en la lista).
// Es la misma que mediosDe de scripts/vuelta.js.
function mediosDe(hecho, portales) {
  const grupos = hecho.notas.map(n => { const d = dominioDe(n); return (buscarPortal(d, portales) || {}).grupo || d; });
  return [...new Set(grupos)];
}

// Las urls de las notas de un hecho, sin repetir: con ellas medir reconoce la misma noticia aunque cambie el id.
const urlsDe = hecho => [...new Set(hecho.notas.map(n => n.url))];

function decidirZona(preparado, { portales, reglas, hechosNacionales = [] }) {
  const anillos = reglas.anillos || [];
  const descartadas = [];
  const confirmados = [];
  const porAnillo = Object.fromEntries(anillos.map(a => [a.clave, []]));
  const baja = (c, motivo) => descartadas.push({ tipo: 'hecho', id: c.id, titulo: c.titulo, motivo });

  for (const c of preparado.candidatos || []) {
    const anillo = anilloDe(c, { portales, reglas });
    const cruce = tambienNacional(c, hechosNacionales, { reglas });
    confirmados.push({ id: c.id, anillo, grupos: c.gruposIndependientes, medios: mediosDe(c, portales), urls: urlsDe(c), titulo: c.titulo, tambienNacional: cruce.si, viejo: Boolean(c.viejo) });
    if (c.viejo) baja(c, 'no_fresco (criterio 2)');
    else if (cruce.si) baja(c, `tambien_nacional (${cruce.grupos} medios nacionales)`);
    else if (anillo === null) baja(c, 'sin_anillo');
    else porAnillo[anillo].push(c);
  }

  const bloques = {};
  for (const a of anillos) {
    const orden = porAnillo[a.clave].sort((x, y) =>
      y.gruposIndependientes - x.gruposIndependientes || Date.parse(y.primera) - Date.parse(x.primera));
    const noticias = [];
    let afuera = 0;
    for (const c of orden) {
      if (noticias.length >= a.cupo) { afuera++; baja(c, 'cupo'); continue; }
      noticias.push({
        id: c.id, titulo: c.titulo, bajada: c.bajada || '', bloque: a.clave, seccion: '', pais: '',
        via: 'A',
        etiqueta: String(a.etiqueta).replace('{n}', c.gruposIndependientes),
        gruposIndependientes: c.gruposIndependientes,
        links: c.notas.map(n => ({ portal: n.portal, url: n.url })),
      });
    }
    bloques[a.clave] = { nombre: a.nombre, tope: a.cupo, noticias, aMano: [], afueraPorTope: afuera, minimo: 1 };
  }
  return { bloques, confirmados, descartadas };
}

module.exports = { anilloDe, tambienNacional, decidirZona, mediosDe };
