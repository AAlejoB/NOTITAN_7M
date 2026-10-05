'use strict';
/**
 * NOTITAN_7M · lo que hace la página, en funciones puras.
 *
 * Anda en el navegador (queda en window.Logica) y en Node (module.exports), así se prueba con `node --test`.
 * Sin dependencias, sin Date.now() (la hora entra por parámetro) y sin tocar el DOM.
 *
 * estado = { vistas: { <url>: <ISO> }, llevadas: [ { urls: [<url>…], hora: <ISO> } ] }
 *   Se guarda en el navegador de cada persona. Una noticia se reconoce por sus links, no por su id:
 *   si el programa le cambia el id o le suma notas, comparte al menos una url y sigue siendo la misma.
 */
(function (raiz, fabrica) {
  const L = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = L;
  else raiz.Logica = L;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const MIN = 60 * 1000;
  const HORA = 60 * MIN;
  const CLAVE = '7m-marcas-v1';

  /* ───────────── el reloj ───────────── */

  // "hace 12 min" / "hace 1 h 5 min" / "hace 2 h" / "recién". `vieja` es true desde 60 minutos.
  function haceCuanto(generadaEn, ahora) {
    const min = Math.floor((Date.parse(ahora) - Date.parse(generadaEn)) / MIN);
    if (Number.isNaN(min)) return { texto: 'sin fecha', vieja: true };
    if (min < 1) return { texto: 'recién', vieja: false };
    if (min < 60) return { texto: `hace ${min} min`, vieja: false };
    const h = Math.floor(min / 60);
    const m = min % 60;
    return { texto: `hace ${h} h${m ? ` ${m} min` : ''}`, vieja: true };
  }

  // "12:00", hora de Argentina, de 24 horas.
  function horaAR(iso) {
    return new Date(iso).toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  }

  /* ───────────── las tarjetas ───────────── */

  const urlsDe = t => (t.links || []).map(l => l.url);

  // Lo que se copia: título, bajada (si hay) y un renglón por link; una línea en blanco entre noticias. Sin sello.
  function textoParaCopiar(tarjetas) {
    return tarjetas
      .map(t => [t.titulo, ...(t.bajada ? [t.bajada] : []), ...(t.links || []).map(l => `${l.medio}: ${l.url}`)].join('\n'))
      .join('\n\n');
  }

  // «4 de 5: La Gaceta · La Nación · Clarín · Página/12»
  const etiquetaMedios = (t, minGrupos) => `${t.grupos} de ${minGrupos}: ${t.medios.join(' · ')}`;

  /* ───────────── lo tildado ───────────── */

  // Lo tildado es una lista de urls: una tarjeta está tildada si alguna de sus urls está ahí.
  const estaTildada = (t, tildadas) => urlsDe(t).some(u => tildadas.includes(u));

  function alternarTilde(t, tildadas) {
    if (estaTildada(t, tildadas)) {
      const propias = urlsDe(t);
      return tildadas.filter(u => !propias.includes(u));
    }
    return [...tildadas, ...urlsDe(t).filter(u => !tildadas.includes(u))];
  }

  // La barra de abajo: «2 elegidas» y «Copiar las 2». Con 0, el botón va apagado.
  function textoBarra(n) {
    if (n === 0) return { cuenta: '0 elegidas', boton: 'Copiar', apagado: true };
    if (n === 1) return { cuenta: '1 elegida', boton: 'Copiar la 1', apagado: false };
    return { cuenta: `${n} elegidas`, boton: `Copiar las ${n}`, apagado: false };
  }

  /* ───────────── los textos de cada bloque ───────────── */

  // «Nacionales · 5» o, si hay menos que el mínimo, «Nacionales · 1 de 3».
  const tituloBloque = (nombre, n, cupoMinimo) => (n < cupoMinimo ? `${nombre} · ${n} de ${cupoMinimo}` : `${nombre} · ${n}`);

  function avisoBloque(n, cupoMinimo, cantidadAMano) {
    if (n >= cupoMinimo) return '';
    return `${n} de ${cupoMinimo}. No se completa con menos medios.${cantidadAMano > 0 ? ` Abajo hay ${cantidadAMano} a las que les falta 1.` : ''}`;
  }

  function textoAfuera(k, tope) {
    return k === 1 ? `1 confirmada más quedó afuera por el tope de ${tope}` : `${k} confirmadas más quedaron afuera por el tope de ${tope}`;
  }

  /* ───────────── las marcas: lo que vio y lo que se llevó ───────────── */

  const estadoVacio = () => ({ vistas: {}, llevadas: [] });

  // Lo que viene de localStorage puede estar roto o ser de otra versión: se acomoda sin romper nada.
  function normalizarEstado(e) {
    const vistas = {};
    if (e && e.vistas && typeof e.vistas === 'object' && !Array.isArray(e.vistas)) {
      for (const [u, h] of Object.entries(e.vistas)) if (typeof h === 'string') vistas[u] = h;
    }
    const llevadas = [];
    if (e && Array.isArray(e.llevadas)) {
      for (const l of e.llevadas) if (l && Array.isArray(l.urls) && typeof l.hora === 'string') llevadas.push({ urls: l.urls.filter(u => typeof u === 'string'), hora: l.hora });
    }
    return { vistas, llevadas };
  }

  // «Nueva»: ninguna de sus urls está en lo ya visto.
  const esNueva = (t, estado) => !urlsDe(t).some(u => Object.prototype.hasOwnProperty.call(estado.vistas, u));

  // La hora de la primera llevada que comparte al menos una url con la tarjeta; si no, null.
  function llevadaA(t, estado) {
    const propias = urlsDe(t);
    const l = estado.llevadas.find(x => x.urls.some(u => propias.includes(u)));
    return l ? l.hora : null;
  }

  // Las tres devuelven un estado nuevo y no tocan el que reciben.
  function marcarVistas(tarjetas, estado, ahora) {
    const vistas = { ...estado.vistas };
    for (const t of tarjetas) for (const u of urlsDe(t)) vistas[u] = ahora;
    return { vistas, llevadas: estado.llevadas.map(l => ({ urls: [...l.urls], hora: l.hora })) };
  }

  function marcarLlevadas(tarjetas, estado, ahora) {
    return {
      vistas: { ...estado.vistas },
      llevadas: [...estado.llevadas.map(l => ({ urls: [...l.urls], hora: l.hora })), ...tarjetas.map(t => ({ urls: urlsDe(t), hora: ahora }))],
    };
  }

  // Saca lo de más de `horas` (24).
  function limpiar(estado, ahora, horas = 24) {
    const limite = horas * HORA;
    const viejo = h => Date.parse(ahora) - Date.parse(h) > limite;
    const vistas = {};
    for (const [u, h] of Object.entries(estado.vistas)) if (!viejo(h)) vistas[u] = h;
    return { vistas, llevadas: estado.llevadas.filter(l => !viejo(l.hora)).map(l => ({ urls: [...l.urls], hora: l.hora })) };
  }

  // «Nueva» dura esa visita: una tarjeta es nueva si ya lo era (están sus urls en `previas`) o si no estaba en lo visto.
  // Devuelve la lista de urls de las nuevas, para llevarla de una carga a la siguiente.
  function nuevasDeLaVisita(tarjetas, estado, previas = []) {
    const urls = [...previas];
    for (const t of tarjetas) if (esNueva(t, estado)) for (const u of urlsDe(t)) if (!urls.includes(u)) urls.push(u);
    return urls;
  }

  const esNuevaEnVisita = (t, nuevas) => urlsDe(t).some(u => nuevas.includes(u));

  // Cómo se reparte un bloque en la página: las confirmadas que no se llevó, las 4/5 que no se llevó,
  // y al final lo llevado (confirmadas primero, después 4/5), cada una con su hora.
  function repartirBloque(bloque, estado) {
    const principales = [];
    const aMano = [];
    const llevadas = [];
    for (const t of bloque.noticias) { const h = llevadaA(t, estado); if (h) llevadas.push({ tarjeta: t, hora: h }); else principales.push(t); }
    const aManoLlevadas = [];
    for (const t of bloque.aMano) { const h = llevadaA(t, estado); if (h) aManoLlevadas.push({ tarjeta: t, hora: h }); else aMano.push(t); }
    return { principales, aMano, llevadas: [...llevadas, ...aManoLlevadas] };
  }

  /* ───────────── guardar en el navegador ───────────── */

  // `almacen` es window.localStorage. Todo va dentro de try/catch: puede no existir o estar bloqueado.
  function cargarEstado(almacen) {
    try {
      return normalizarEstado(JSON.parse(almacen.getItem(CLAVE)));
    } catch (e) {
      return estadoVacio();
    }
  }

  function guardarEstado(almacen, estado) {
    try { almacen.setItem(CLAVE, JSON.stringify(estado)); return true; } catch (e) { return false; }
  }

  return {
    CLAVE, haceCuanto, horaAR, urlsDe, textoParaCopiar, etiquetaMedios, estaTildada, alternarTilde, textoBarra,
    tituloBloque, avisoBloque, textoAfuera, estadoVacio, normalizarEstado, esNueva, llevadaA, marcarVistas, marcarLlevadas,
    limpiar, nuevasDeLaVisita, esNuevaEnVisita, repartirBloque, cargarEstado, guardarEstado,
  };
});
