'use strict';
/**
 * NOTITAN_7M · lo que hace la página, en funciones puras.
 *
 * Anda en el navegador (queda en window.Logica) y en Node (module.exports), así se prueba con `node --test` y el servidor
 * (scripts/servir.js) usa normalizarEstado. Sin dependencias, sin Date.now() (la hora entra por parámetro) y sin tocar el DOM.
 *
 * La página C (carta de Cowork del 17-10): una tarjeta abierta arriba (el pivote) con botones para decidir, el resto en
 * renglones, lo decidido en pestañas y copiar al final solo lo de «Me interesa».
 *
 * estado = { version: 2, decisiones: [ { urls, que, motivo?, texto?, hora, sello, grupos, minimo, subio? } ],
 *            llevadas: [ { urls, hora } ], subidas: [ { urls, de: 'archivo', hora } ], temasApagados: [<nombre>…] }
 *   que: 'interesa' | 'nopor' | 'archivo' | 'siguiente'; sello: la vía de la tarjeta al decidir ('A' | 'B' | 'mano' | 'aviso').
 *   Una noticia se reconoce siempre por sus links, nunca por su id: si el programa le cambia el id o le suma notas,
 *   comparte al menos una url y sigue siendo la misma. Una tarjeta sin ningún link (el cronograma) se reconoce por 'id:<id>'.
 *   Una tarjeta tiene a lo sumo una decisión. Lo de más de 24 h se va con limpiar(), salvo temasApagados.
 *   temasApagados: el nombre de un tema que la persona apagó; '!' + nombre si la persona prendió uno que la config trae
 *   apagado (`prendido: false`). Lo que no figura sigue lo que dice la config. En el escalón Normal no se usa.
 *
 * Tarjeta de aviso (bloque «Avisos», via: 'aviso'): trae además aviso: { servicio, programado, dia, desde, hasta,
 * duracionHoras, barrios, zona, cronograma } (un «se normalizó» suma normalizado: true y publicado). lineaDeAviso arma lo que se ve debajo del título y lineaParaCopiar lo que se copia.
 */
(function (raiz, fabrica) {
  const L = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = L;
  else raiz.Logica = L;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const MIN = 60 * 1000;
  const HORA = 60 * MIN;
  const CLAVE = '7m-decisiones-v2';
  const CLAVE_V1 = '7m-marcas-v1';

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

  function urlsDe(t) {
    const urls = (t.links || []).map(l => l.url).filter(Boolean);
    return urls.length ? urls : ['id:' + t.id];
  }

  // Lo que se copia: título, bajada (si hay) y un renglón por link; una línea en blanco entre noticias. Sin sello.
  // Un aviso se copia en una sola línea (lineaParaCopiar).
  function textoParaCopiar(tarjetas) {
    return tarjetas
      .map(t => (t.aviso ? lineaParaCopiar(t) : [t.titulo, ...(t.bajada ? [t.bajada] : []), ...(t.links || []).map(l => `${l.medio}: ${l.url}`)].join('\n')))
      .join('\n\n');
  }

  /* ───────────── los avisos (cortes) ───────────── */

  const SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const MAX_BARRIOS = 6;
  const mayuscula = t => (t ? t[0].toUpperCase() + t.slice(1) : t);

  // '2026-10-08' → 'jueves 8/10'
  function diaCorto(dia) {
    const [a, m, d] = dia.split('-').map(Number);
    return `${SEMANA[new Date(Date.UTC(a, m - 1, d)).getUTCDay()]} ${d}/${m}`;
  }

  // El día, el horario y la duración que haya: { dia: 'jueves 8/10', horario: 'desde las 15:00' | 'de 08:00 a 14:00' | 'hasta las 14:00', duracion: '24 h' }.
  function cuandoDeAviso(a) {
    let horario = null;
    if (a.desde && a.hasta && !a.duracionHoras) horario = `de ${a.desde} a ${a.hasta}`;
    else if (a.desde) horario = `desde las ${a.desde}`;
    else if (a.hasta) horario = `hasta las ${a.hasta}`;
    return { dia: a.dia ? diaCorto(a.dia) : null, horario, duracion: a.duracionHoras ? `${a.duracionHoras} h` : null };
  }

  const zonaDeAviso = a => (a.zona && a.zona.length ? a.zona.join(' y ') : null);
  // '2026-10-16T17:30:00.000Z' → '2026-10-16' (el día en Argentina, que es siempre UTC−3)
  const diaARde = iso => new Date(Date.parse(iso) - 3 * HORA).toISOString().slice(0, 10);

  // Lo que se ve debajo del título de un aviso, solo con lo que haya:
  // { partes: ['Jueves 8/10 · desde las 15:00 · 24 h', 'Zona Norte'], barrios: { total, primeros, resto, todos } | null }.
  // Sin día ni horario, la primera parte es «Sin horario en el aviso: abrí el link».
  // Un «se normalizó»: «Se normalizó el servicio · Jueves 16/10 · 14:30» (cuándo se publicó), sin barrios ni duración.
  function lineaDeAviso(t) {
    const a = t.aviso || {};
    if (a.normalizado) {
      const cuando = a.publicado ? ` · ${mayuscula(diaCorto(diaARde(a.publicado)))} · ${horaAR(a.publicado)}` : '';
      return { partes: ['Se normalizó el servicio' + cuando], barrios: null };
    }
    const c = cuandoDeAviso(a);
    const cuando = [c.dia, c.horario, c.duracion].filter(Boolean).join(' · ');
    const partes = [c.dia || c.horario ? mayuscula(cuando) : 'Sin horario en el aviso: abrí el link'];
    const zona = zonaDeAviso(a);
    if (zona) partes.push(zona);
    const todos = a.barrios || [];
    const barrios = todos.length
      ? { total: todos.length, primeros: todos.slice(0, MAX_BARRIOS), resto: Math.max(0, todos.length - MAX_BARRIOS), todos: [...todos] }
      : null;
    return { partes, barrios };
  }

  // «Corte de agua programado · jueves 8/10 desde las 15:00, 24 h · Zona Norte · Barrios: … · Fuente: SCPL <url>», con lo que haya.
  // Un «se normalizó»: «Se normalizó el servicio de agua en Zona Norte · Fuente: SCPL <url>» (sin zona, «en Comodoro»).
  function lineaParaCopiar(t) {
    const a = t.aviso || {};
    const fuentesDe = () => (t.links || []).map(l => (l.url ? `${l.medio} ${l.url}` : l.medio));
    if (a.normalizado) {
      const f = fuentesDe();
      return [`Se normalizó el servicio${a.servicio ? ` de ${a.servicio}` : ''} en ${zonaDeAviso(a) || 'Comodoro'}`, f.length ? `Fuente: ${f.join(' · ')}` : null].filter(Boolean).join(' · ');
    }
    const servicio = a.servicio ? `Corte de ${a.servicio}` : 'Corte';
    const tipo = a.cronograma ? ' · cronograma de verano' : a.programado === true ? ' programado' : a.programado === false ? ' por avería' : '';
    const c = cuandoDeAviso(a);
    const cuando = [[c.dia, c.horario].filter(Boolean).join(' '), c.duracion].filter(Boolean).join(', ');
    const fuentes = fuentesDe();
    return [
      servicio + tipo,
      cuando,
      zonaDeAviso(a),
      (a.barrios || []).length ? `Barrios: ${a.barrios.join(', ')}` : null,
      fuentes.length ? `Fuente: ${fuentes.join(' · ')}` : null,
    ].filter(Boolean).join(' · ');
  }

  // «4 de 5 medios» (los nombres ya están en los links de abajo)
  const etiquetaMedios = (t, minGrupos) => `${t.grupos} de ${minGrupos} medios`;

  // La barra de abajo: «Me interesa: 2» y «Copiar las 2». Con 0, el botón va apagado.
  function textoBarra(n) {
    if (n === 0) return { cuenta: 'Me interesa: 0', boton: 'Copiar', apagado: true };
    if (n === 1) return { cuenta: 'Me interesa: 1', boton: 'Copiar la 1', apagado: false };
    return { cuenta: `Me interesa: ${n}`, boton: `Copiar las ${n}`, apagado: false };
  }

  /* ───────────── los bloques: cuáles y en qué orden ───────────── */

  const SIEMPRE = { nacional: 'Nacionales', internacional: 'Internacionales' };

  // El orden sale de lista.orden (una lista vieja no lo trae: nacional e internacional). Cada uno con su nombre
  // (el de la lista o, para los dos de siempre, «Nacionales» e «Internacionales») y su mínimo (el del bloque o lista.cupoMinimo).
  // Un bloque de zona sin noticias ni 4/5 no se dibuja; los dos de siempre, sí (para que se vea «0 de 3»).
  function bloquesADibujar(lista) {
    const orden = Array.isArray(lista.orden) ? lista.orden : ['nacional', 'internacional'];
    return orden
      .filter(clave => lista.bloques && lista.bloques[clave])
      .filter(clave => {
        const b = lista.bloques[clave];
        return tiene(SIEMPRE, clave) || (b.noticias || []).length + (b.aMano || []).length > 0;
      })
      .map(clave => {
        const b = lista.bloques[clave];
        return { clave, nombre: b.nombre || SIEMPRE[clave] || clave, minimo: typeof b.minimo === 'number' ? b.minimo : lista.cupoMinimo };
      });
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

  /* ───────────── la config de la página (lista.pagina) ───────────── */

  const MOTIVOS = [
    { clave: 'dato', texto: 'Es un dato, no una noticia' },
    { clave: 'tengo', texto: 'Ya la tengo' },
    { clave: 'opinion', texto: 'Opinión o reacción a otra' },
    { clave: 'bloque', texto: 'Está en el bloque equivocado' },
    { clave: 'vieja', texto: 'Ya pasó, llegó tarde' },
    { clave: 'publico', texto: 'No va con nuestro público' },
    { clave: 'otro', texto: 'Otro motivo…' },
  ];
  const SIN_TEMA = 'Sin tema';

  // Una lista vieja no trae `pagina`: Plus, sin temas y los siete motivos.
  function paginaDe(lista) {
    const p = (lista && lista.pagina) || {};
    return {
      nombre: p.nombre || '7M',
      escalon: p.escalon === 'normal' ? 'normal' : 'plus',
      temas: Array.isArray(p.temas) ? p.temas : [],
      motivos: Array.isArray(p.motivos) && p.motivos.length ? p.motivos : MOTIVOS,
    };
  }

  // «Canal 2 · 7M», o solo «7M» sin cliente.
  const tituloPagina = lista => (lista.cliente ? `${lista.cliente} · ${paginaDe(lista).nombre}` : paginaDe(lista).nombre);

  /* ───────────── el estado: las decisiones ───────────── */

  const QUE = ['interesa', 'nopor', 'archivo', 'siguiente'];
  const SELLOS = ['A', 'B', 'mano', 'aviso'];
  const estadoVacio = () => ({ version: 2, decisiones: [], llevadas: [], subidas: [], temasApagados: [] });

  const esObjeto = x => Boolean(x) && typeof x === 'object' && !Array.isArray(x);
  const tiene = (obj, u) => Object.prototype.hasOwnProperty.call(obj, u);
  const esTexto = x => typeof x === 'string';
  const soloUrls = urls => (Array.isArray(urls) ? urls.filter(u => esTexto(u) && u) : []);
  const comparten = (a, b) => a.some(u => b.includes(u));

  function decisionValida(d) {
    if (!esObjeto(d) || !QUE.includes(d.que) || !esTexto(d.hora) || !SELLOS.includes(d.sello)) return null;
    const urls = soloUrls(d.urls);
    if (!urls.length) return null;
    const r = { urls, que: d.que };
    if (d.que === 'nopor') {
      if (!esTexto(d.motivo) || !d.motivo) return null;
      r.motivo = d.motivo;
      if (d.motivo === 'otro') r.texto = esTexto(d.texto) ? d.texto.slice(0, 120) : '';
    }
    r.hora = d.hora;
    r.sello = d.sello;
    r.grupos = typeof d.grupos === 'number' ? d.grupos : 0;
    r.minimo = typeof d.minimo === 'number' ? d.minimo : 0;
    if (d.subio === true) r.subio = true;
    return r;
  }

  const conUrlsYHora = x => (esObjeto(x) && esTexto(x.hora) && soloUrls(x.urls).length ? { urls: soloUrls(x.urls), hora: x.hora } : null);

  // Lo que viene del navegador o del servidor puede estar roto o ser de otra versión: se acomoda campo por campo
  // y se tira lo que no tenga la forma. Un estado viejo (7m-marcas-v1) conserva solo sus llevadas.
  function normalizarEstado(e) {
    const r = estadoVacio();
    if (!esObjeto(e)) return r;
    for (const d of Array.isArray(e.decisiones) ? e.decisiones : []) {
      const v = decisionValida(d);
      if (!v) continue;
      // A lo sumo una decisión por tarjeta: si dos comparten url, queda la última.
      r.decisiones = r.decisiones.filter(x => !comparten(x.urls, v.urls));
      r.decisiones.push(v);
    }
    for (const l of Array.isArray(e.llevadas) ? e.llevadas : []) { const v = conUrlsYHora(l); if (v) r.llevadas.push(v); }
    for (const s of Array.isArray(e.subidas) ? e.subidas : []) { const v = conUrlsYHora(s); if (v) r.subidas.push({ urls: v.urls, de: 'archivo', hora: v.hora }); }
    for (const t of Array.isArray(e.temasApagados) ? e.temasApagados : []) if (esTexto(t) && t && !r.temasApagados.includes(t)) r.temasApagados.push(t);
    return r;
  }

  const copiar = estado => normalizarEstado(estado);

  // Saca decisiones, llevadas y subidas de más de `horas` (24). Los temas no vencen.
  function limpiar(estado, ahora, horas = 24) {
    const viejo = h => Date.parse(ahora) - Date.parse(h) > horas * HORA;
    const r = copiar(estado);
    r.decisiones = r.decisiones.filter(d => !viejo(d.hora));
    r.llevadas = r.llevadas.filter(l => !viejo(l.hora));
    r.subidas = r.subidas.filter(s => !viejo(s.hora));
    return r;
  }

  const decisionDe = (t, estado) => estado.decisiones.find(d => comparten(urlsDe(t), d.urls)) || null;
  const subidaDe = (t, estado) => (estado.subidas || []).find(s => comparten(urlsDe(t), s.urls)) || null;

  // La hora de la primera llevada que comparte al menos una url con la tarjeta; si no, null.
  function llevadaA(t, estado) {
    const l = estado.llevadas.find(x => comparten(urlsDe(t), x.urls));
    return l ? l.hora : null;
  }

  // Todas devuelven un estado nuevo y no tocan el que reciben.
  // `minimo` es lista.minGrupos (para «Era 4 de 5 cuando la elegiste»); en un aviso, grupos y mínimo valen 1.
  function decidirTarjeta(t, { que, motivo, texto, minimo } = {}, estado, ahora) {
    const r = copiar(estado);
    const propias = urlsDe(t);
    const aviso = t.via === 'aviso';
    const d = { urls: propias, que };
    if (que === 'nopor') { d.motivo = motivo; if (motivo === 'otro') d.texto = String(texto || '').slice(0, 120); }
    Object.assign(d, { hora: ahora, sello: t.via, grupos: aviso ? 1 : t.grupos, minimo: aviso ? 1 : (typeof minimo === 'number' ? minimo : 0) });
    r.decisiones = r.decisiones.filter(x => !comparten(x.urls, propias));
    r.decisiones.push(d);
    r.subidas = r.subidas.filter(s => !comparten(s.urls, propias));
    return r;
  }

  // Para Deshacer, Volver y Sacar. Con `subida` (la entrada que borró la decisión), Deshacer la devuelve.
  function borrarDecision(t, estado, subida = null) {
    const r = copiar(estado);
    r.decisiones = r.decisiones.filter(x => !comparten(x.urls, urlsDe(t)));
    if (subida && !subidaDe(t, r)) r.subidas.push({ urls: [...subida.urls], de: 'archivo', hora: subida.hora });
    return r;
  }

  // Copiar: sus decisiones se borran y pasan a llevadas, todas con la misma hora.
  function marcarLlevadas(tarjetas, estado, ahora) {
    const r = copiar(estado);
    for (const t of tarjetas) {
      const propias = urlsDe(t);
      r.decisiones = r.decisiones.filter(x => !comparten(x.urls, propias));
      r.subidas = r.subidas.filter(s => !comparten(s.urls, propias));
      r.llevadas.push({ urls: propias, hora: ahora });
    }
    return r;
  }

  /* ───────────── los temas ───────────── */

  const configDeTema = (nombre, lista) => paginaDe(lista).temas.find(x => x.nombre === nombre) || null;

  // Si el tema se ve. En Normal manda solo la config; en Plus, lo que tocó la persona y si no, la config.
  function temaPrendido(nombre, lista, estado) {
    if (!nombre || nombre === SIN_TEMA) return true;
    const conf = configDeTema(nombre, lista);
    const deConfig = !conf || conf.prendido !== false;
    if (paginaDe(lista).escalon === 'normal') return deConfig;
    const apagados = (estado && estado.temasApagados) || [];
    if (apagados.includes(nombre)) return false;
    if (apagados.includes('!' + nombre)) return true;
    return deConfig;
  }

  const temaOculto = (t, lista, estado) => !temaPrendido(t.tema, lista, estado);

  // Sin `lista`, se toma la config con el tema prendido.
  function alternarTema(nombre, estado, lista = null) {
    const r = copiar(estado);
    const antes = lista ? temaPrendido(nombre, lista, r) : !r.temasApagados.includes(nombre);
    const conf = lista ? configDeTema(nombre, lista) : null;
    const deConfig = !conf || conf.prendido !== false;
    r.temasApagados = r.temasApagados.filter(x => x !== nombre && x !== '!' + nombre);
    const nuevo = !antes;
    if (nuevo !== deConfig) r.temasApagados.push(nuevo ? '!' + nombre : nombre);
    return r;
  }

  /* ───────────── repartir: qué va a cada pestaña ───────────── */

  // Las tarjetas de noticia de la lista, en el orden de la página: bloque por bloque (lista.orden, sin avisos),
  // primero las confirmadas y después las «le falta 1».
  function bloquesDeNoticias(lista) {
    return bloquesADibujar(lista)
      .filter(b => b.clave !== 'avisos')
      .map(b => ({ clave: b.clave, nombre: b.nombre, tarjetas: [...(lista.bloques[b.clave].noticias || []), ...(lista.bloques[b.clave].aMano || [])] }));
  }

  const tarjetasDeNoticia = lista => bloquesDeNoticias(lista).flatMap(b => b.tarjetas);
  const avisosDe = lista => (lista.bloques && lista.bloques.avisos && lista.bloques.avisos.noticias) || [];

  const masVieja = (a, b) => Date.parse(a.d.hora) - Date.parse(b.d.hora);

  // Lo que dibuja la página. `verOcultas`: las ocultas por tema también van a porDecidir (en su lugar); el número de
  // la pestaña nunca las cuenta. Las que volvieron de Archivo por la mezcla van primero, en el grupo 'subieron'.
  function repartir(lista, estado, { verOcultas = false } = {}) {
    const bloques = bloquesDeNoticias(lista);
    const subieron = [];
    const grupos = bloques.map(b => ({ clave: b.clave, nombre: b.nombre, tarjetas: [] }));
    const conDecision = { interesa: [], archivo: [], noPorHoy: [] };
    const llevadas = [];
    const ocultas = { total: 0, temas: [] };
    let porDecidirVisibles = 0;
    let subieronNoPorHoy = 0;
    bloques.forEach((b, i) => {
      for (const t of b.tarjetas) {
        const hora = llevadaA(t, estado);
        if (hora) { llevadas.push({ tarjeta: t, hora }); continue; }
        const d = decisionDe(t, estado);
        if (d) {
          if (d.que === 'interesa') conDecision.interesa.push({ t, d });
          else if (d.que === 'archivo') conDecision.archivo.push({ t, d });
          else { conDecision.noPorHoy.push({ t, d }); if (d.subio) subieronNoPorHoy++; }
          continue;
        }
        if (temaOculto(t, lista, estado)) {
          ocultas.total++;
          if (!ocultas.temas.includes(t.tema)) ocultas.temas.push(t.tema);
          if (!verOcultas) continue;
        } else porDecidirVisibles++;
        if (subidaDe(t, estado)) subieron.push(t);
        else grupos[i].tarjetas.push(t);
      }
    });
    // Los temas ocultos, en el orden de la config.
    const ordenTemas = paginaDe(lista).temas.map(x => x.nombre);
    ocultas.temas.sort((a, b) => ordenTemas.indexOf(a) - ordenTemas.indexOf(b));

    const avisos = avisosDe(lista).map(t => {
      const hora = llevadaA(t, estado);
      if (hora) { llevadas.push({ tarjeta: t, hora }); return { tarjeta: t, estado: 'llevado', hora }; }
      const d = decisionDe(t, estado);
      if (d && d.que === 'interesa') { conDecision.interesa.push({ t, d }); return { tarjeta: t, estado: 'interesa', hora: d.hora }; }
      return { tarjeta: t, estado: 'libre', hora: null };
    });

    const porDecidir = [
      ...(subieron.length ? [{ clave: 'subieron', nombre: 'Subieron a confirmada', tarjetas: subieron }] : []),
      ...grupos.filter(g => g.tarjetas.length),
    ];
    const meInteresa = conDecision.interesa.sort(masVieja).map(x => x.t);
    const archivo = conDecision.archivo.sort((a, b) => -masVieja(a, b)).map(x => x.t);
    const noPorHoy = conDecision.noPorHoy.sort((a, b) => -masVieja(a, b)).map(x => x.t);
    return {
      porDecidir, meInteresa, llevadas, archivo, noPorHoy, ocultas, subieronNoPorHoy, avisos,
      numeros: { porDecidir: porDecidirVisibles, meInteresa: meInteresa.length, archivo: archivo.length, noPorHoy: noPorHoy.length },
    };
  }

  /* ───────────── el pivote ───────────── */

  const plano = porDecidir => porDecidir.flatMap(g => g.tarjetas);
  const buscar = (lista, t) => (t ? lista.find(x => comparten(urlsDe(x), urlsDe(t))) || null : null);

  // La tarjeta abierta.
  // - Con `decidida` (la que se acaba de decidir, y `porDecidir` es el de antes de decidirla): la que estaba justo
  //   después; si era la última, la primera de todas; si no queda ninguna, null.
  // - Sin `decidida` (al abrir, al actualizar la lista, al volver de otra pestaña): la misma abierta si sigue ahí
  //   (por url compartida); si no, la primera.
  function pivoteSiguiente(porDecidir, pivoteActual, decidida = null) {
    const todas = plano(porDecidir);
    if (decidida) {
      const i = todas.findIndex(x => comparten(urlsDe(x), urlsDe(decidida)));
      if (i >= 0) {
        const resto = [...todas.slice(i + 1), ...todas.slice(0, i)];
        return resto[0] || null;
      }
    }
    return buscar(todas, pivoteActual) || todas[0] || null;
  }

  // «1 de 3 · Comodoro»: la posición de la abierta en su bloque y cuántas quedan por decidir ahí.
  function textoAvance(porDecidir, pivote) {
    if (!pivote) return null;
    for (const g of porDecidir) {
      const i = g.tarjetas.findIndex(x => comparten(urlsDe(x), urlsDe(pivote)));
      if (i >= 0) return { texto: `${i + 1} de ${g.tarjetas.length} · ${g.nombre}`, k: i + 1, n: g.tarjetas.length };
    }
    return null;
  }

  const TEXTO_DESHACER = { interesa: 'Mandada a “Me interesa”', nopor: 'Mandada a “No por hoy”', archivo: 'Archivada', siguiente: 'Pasada' };
  const textoDeshacer = que => TEXTO_DESHACER[que] || '';

  // Cuántas de las que la persona decidió en esta visita (sus urls) siguen decididas o llevadas.
  function decididasEnVisita(lista, estado, urlsDeLaVisita) {
    return [...tarjetasDeNoticia(lista), ...avisosDe(lista)]
      .filter(t => comparten(urlsDe(t), urlsDeLaVisita))
      .filter(t => decisionDe(t, estado) || llevadaA(t, estado)).length;
  }

  /* ───────────── la mezcla y las nuevas ───────────── */

  // Una decidida como «le falta 1» (sello 'mano') que la lista de ahora trae confirmada (vía A):
  // de Archivo vuelve a Por decidir (a `subidas`); en Me interesa, No por hoy o Pasadas se marca subio: true.
  function aplicarMezcla(lista, estado, ahora) {
    const r = copiar(estado);
    for (const t of tarjetasDeNoticia(lista)) {
      if (t.via !== 'A' || llevadaA(t, r)) continue;
      const d = decisionDe(t, r);
      if (!d || d.sello !== 'mano') continue;
      if (d.que === 'archivo') {
        r.decisiones = r.decisiones.filter(x => x !== d);
        r.subidas = r.subidas.filter(s => !comparten(s.urls, urlsDe(t)));
        r.subidas.push({ urls: urlsDe(t), de: 'archivo', hora: d.hora });
      } else d.subio = true;
    }
    return r;
  }

  // Cuántas tarjetas de noticia de la lista nueva no tienen decisión, no se llevaron y no comparten ninguna url con la que se ve.
  function hayNuevas(listaVieja, listaNueva, estado) {
    const vistas = tarjetasDeNoticia(listaVieja).flatMap(urlsDe);
    return tarjetasDeNoticia(listaNueva)
      .filter(t => !decisionDe(t, estado) && !llevadaA(t, estado) && !comparten(urlsDe(t), vistas)).length;
  }

  /* ───────────── guardar en el navegador ───────────── */

  // `almacen` es window.localStorage. Todo va dentro de try/catch: puede no existir o estar bloqueado.
  // Si no hay estado v2 y sí uno viejo (7m-marcas-v1), se lee una sola vez: quedan sus llevadas, se escribe v2 y la v1 se borra.
  function cargarEstado(almacen) {
    try {
      const v2 = almacen.getItem(CLAVE);
      if (v2 !== null) return normalizarEstado(JSON.parse(v2));
      const v1 = almacen.getItem(CLAVE_V1);
      if (v1 === null) return estadoVacio();
      let viejo = null;
      try { viejo = JSON.parse(v1); } catch (e) { viejo = null; }
      const estado = normalizarEstado(esObjeto(viejo) ? { llevadas: viejo.llevadas } : null);
      if (guardarEstado(almacen, estado)) almacen.removeItem(CLAVE_V1);
      return estado;
    } catch (e) {
      return estadoVacio();
    }
  }

  function guardarEstado(almacen, estado) {
    try { almacen.setItem(CLAVE, JSON.stringify(estado)); return true; } catch (e) { return false; }
  }

  return {
    CLAVE, CLAVE_V1, MOTIVOS, SIN_TEMA, haceCuanto, horaAR, urlsDe, textoParaCopiar, diaCorto, cuandoDeAviso, lineaDeAviso, lineaParaCopiar,
    etiquetaMedios, textoBarra, bloquesADibujar, tituloBloque, avisoBloque, textoAfuera, paginaDe, tituloPagina,
    estadoVacio, normalizarEstado, limpiar, decisionDe, subidaDe, decidirTarjeta, borrarDecision, marcarLlevadas, llevadaA,
    temaPrendido, temaOculto, alternarTema, aplicarMezcla, repartir, pivoteSiguiente, hayNuevas, textoAvance, textoDeshacer,
    decididasEnVisita, cargarEstado, guardarEstado,
  };
});
