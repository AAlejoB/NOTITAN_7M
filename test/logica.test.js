'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../pagina/logica.js');

const AHORA = '2026-10-04T15:00:00.000Z';
const hace = h => new Date(Date.parse(AHORA) - h * 3600e3).toISOString();
const tarjeta = (titulo, urls, extra = {}) => ({ titulo, bajada: '', links: urls.map((u, i) => ({ medio: 'Medio ' + (i + 1), url: u })), ...extra });

test('L1: textoParaCopiar, entrada y salida exactas', () => {
  const entrada = [
    { titulo: 'Diputados aprobó el Presupuesto', bajada: 'Fue con 130 votos.', links: [{ medio: 'Clarín', url: 'https://www.clarin.com/a' }, { medio: 'La Nación', url: 'https://www.lanacion.com.ar/b' }] },
    { titulo: 'Suben la luz y el gas', bajada: '', links: [{ medio: 'Infobae', url: 'https://www.infobae.com/c' }] },
  ];
  assert.equal(L.textoParaCopiar(entrada), [
    'Diputados aprobó el Presupuesto',
    'Fue con 130 votos.',
    'Clarín: https://www.clarin.com/a',
    'La Nación: https://www.lanacion.com.ar/b',
    '',
    'Suben la luz y el gas',
    'Infobae: https://www.infobae.com/c',
  ].join('\n'));
  assert.equal(L.textoParaCopiar([]), '');
  assert.ok(!L.textoParaCopiar(entrada).endsWith('\n'), 'sin renglón en blanco al final');
});


test('L5: haceCuanto, con los minutos de la carta', () => {
  const desde = min => L.haceCuanto(hace(min / 60), AHORA);
  assert.deepEqual(desde(12), { texto: 'hace 12 min', vieja: false });
  assert.deepEqual(desde(65), { texto: 'hace 1 h 5 min', vieja: true });
  assert.deepEqual(desde(120), { texto: 'hace 2 h', vieja: true });
  assert.deepEqual(desde(0), { texto: 'recién', vieja: false });
  assert.deepEqual(desde(59), { texto: 'hace 59 min', vieja: false });
  assert.deepEqual(desde(60), { texto: 'hace 1 h', vieja: true });
  assert.deepEqual(L.haceCuanto(undefined, AHORA), { texto: 'sin fecha', vieja: true });
});


test('los textos de cada bloque salen de los números de la lista, no de uno fijo', () => {
  assert.equal(L.tituloBloque('Nacionales', 5, 3), 'Nacionales · 5');
  assert.equal(L.tituloBloque('Nacionales', 3, 3), 'Nacionales · 3');
  assert.equal(L.tituloBloque('Nacionales', 1, 3), 'Nacionales · 1 de 3');
  assert.equal(L.tituloBloque('Internacionales', 2, 4), 'Internacionales · 2 de 4');
  assert.equal(L.avisoBloque(5, 3, 2), '');
  assert.equal(L.avisoBloque(1, 3, 0), '1 de 3. No se completa con menos medios.');
  assert.equal(L.avisoBloque(1, 3, 2), '1 de 3. No se completa con menos medios. Abajo hay 2 a las que les falta 1.');
  assert.equal(L.textoAfuera(2, 7), '2 confirmadas más quedaron afuera por el tope de 7');
  assert.equal(L.textoAfuera(1, 5), '1 confirmada más quedó afuera por el tope de 5');
  assert.equal(L.etiquetaMedios({ grupos: 4, medios: ['Clarín', 'La Nación', 'Infobae', 'Página/12'] }, 5), '4 de 5 medios');
  assert.equal(L.etiquetaMedios({ grupos: 4, medios: ['BBC', 'DW', 'France 24', 'El País'] }, 5), '4 de 5 medios');
  assert.equal(L.etiquetaMedios({ grupos: 3, medios: ['BBC'] }, 4), '3 de 4 medios', 'sale de los números, no de los nombres');
});


test('horaAR: hora de Argentina de 24 horas, también pasada la medianoche', () => {
  assert.equal(L.horaAR('2026-10-04T15:00:00.000Z'), '12:00');
  assert.equal(L.horaAR('2026-10-04T03:05:00.000Z'), '00:05');
  assert.equal(L.horaAR('2026-10-04T17:30:00.000Z'), '14:30');
});


test('bloquesADibujar: una lista vieja sin orden dibuja nacional e internacional, con el mínimo de la lista', () => {
  const lista = { cupoMinimo: 3, bloques: { nacional: { noticias: [], aMano: [] }, internacional: { noticias: [], aMano: [] } } };
  assert.deepEqual(L.bloquesADibujar(lista), [
    { clave: 'nacional', nombre: 'Nacionales', minimo: 3 },
    { clave: 'internacional', nombre: 'Internacionales', minimo: 3 },
  ]);
});


test('bloquesADibujar: con zona sigue lista.orden, usa el nombre y el mínimo del bloque, y saltea un anillo vacío', () => {
  const t = { id: 'x', links: [{ medio: 'A', url: 'u' }] };
  const lista = {
    cupoMinimo: 3,
    orden: ['local', 'chubut', 'nacional', 'internacional'],
    bloques: {
      local: { nombre: 'Comodoro', minimo: 1, noticias: [t], aMano: [] },
      chubut: { nombre: 'Chubut', minimo: 1, noticias: [], aMano: [] },
      nacional: { noticias: [], aMano: [] },
      internacional: { noticias: [], aMano: [] },
    },
  };
  const b = L.bloquesADibujar(lista);
  assert.deepEqual(b.map(x => x.clave), ['local', 'nacional', 'internacional']);
  assert.deepEqual(b[0], { clave: 'local', nombre: 'Comodoro', minimo: 1 });
  assert.equal(L.tituloBloque(b[0].nombre, 1, b[0].minimo), 'Comodoro · 1', 'no «1 de 3»');
  assert.equal(L.avisoBloque(1, b[0].minimo, 0), '');
});


/* ───────────── los avisos (cortes) ───────────── */

const avisoCompleto = {
  id: 'a:scpl.coop:2898', titulo: 'CORTE DE AGUA EN 23 BARRIOS', bajada: '', etiqueta: 'Agua · programado', via: 'aviso',
  links: [{ medio: 'SCPL', url: 'https://scpl.coop/index.php/site/ver-nota?id=2898' }, { medio: 'ADNSUR', url: 'https://www.adnsur.com.ar/x' }],
  aviso: { servicio: 'agua', programado: true, dia: '2026-10-08', desde: '15:00', hasta: '15:00', duracionHoras: 24,
    barrios: ['Laprida', 'Güemes', 'Sarmiento', 'Manantial Rosales', 'Bella Vista Norte', 'Ara San Juan', 'Padre Corti', 'Km.8'], zona: ['Zona Norte'], cronograma: false },
};
const avisoSinDia = {
  id: 'a:elpatagonico.com:sin-luz', titulo: 'Varios sectores de Comodoro se quedaron sin luz', bajada: '', etiqueta: 'Luz', via: 'aviso',
  links: [{ medio: 'El Patagónico', url: 'https://www.elpatagonico.com/sin-luz' }],
  aviso: { servicio: 'luz', programado: null, dia: null, desde: null, hasta: null, duracionHoras: null, barrios: [], zona: null, cronograma: false },
};
const avisoCronograma = {
  id: 'a:cronograma:2025-11-04:Zona Norte', titulo: 'Corte de agua en Zona Norte · cronograma de verano', bajada: 'Según el cronograma…', etiqueta: 'Agua · cronograma de verano', via: 'aviso',
  links: [{ medio: 'Cronograma de verano de la SCPL', url: null }],
  aviso: { servicio: 'agua', programado: true, dia: '2025-11-04', desde: '18:00', hasta: '18:00', duracionHoras: 24, barrios: [], zona: ['Zona Norte'], cronograma: true },
};

test('avisos: diaCorto y la línea con todo (más de 6 barrios: los 6 primeros y el resto)', () => {
  assert.equal(L.diaCorto('2026-10-08'), 'jueves 8/10');
  assert.equal(L.diaCorto('2026-10-27'), 'martes 27/10');
  const l = L.lineaDeAviso(avisoCompleto);
  assert.deepEqual(l.partes, ['Jueves 8/10 · desde las 15:00 · 24 h', 'Zona Norte']);
  assert.equal(l.barrios.total, 8);
  assert.deepEqual(l.barrios.primeros, ['Laprida', 'Güemes', 'Sarmiento', 'Manantial Rosales', 'Bella Vista Norte', 'Ara San Juan']);
  assert.equal(l.barrios.resto, 2);
  assert.equal(l.barrios.todos.length, 8);
});

test('avisos: sin día ni horario la línea dice «Sin horario en el aviso: abrí el link»; «de 08:00 a 14:00» cuando hay las dos horas', () => {
  assert.deepEqual(L.lineaDeAviso(avisoSinDia), { partes: ['Sin horario en el aviso: abrí el link'], barrios: null });
  const conHoras = { ...avisoSinDia, aviso: { ...avisoSinDia.aviso, dia: '2026-10-27', desde: '08:00', hasta: '14:00', zona: ['Zona Sur', 'Zona Central'] } };
  assert.deepEqual(L.lineaDeAviso(conHoras).partes, ['Martes 27/10 · de 08:00 a 14:00', 'Zona Sur y Zona Central']);
});

test('avisos: lo que se copia es una línea, con los campos que haya', () => {
  assert.equal(L.lineaParaCopiar(avisoCompleto),
    'Corte de agua programado · jueves 8/10 desde las 15:00, 24 h · Zona Norte · Barrios: Laprida, Güemes, Sarmiento, Manantial Rosales, Bella Vista Norte, Ara San Juan, Padre Corti, Km.8 · Fuente: SCPL https://scpl.coop/index.php/site/ver-nota?id=2898 · ADNSUR https://www.adnsur.com.ar/x');
  assert.equal(L.lineaParaCopiar(avisoSinDia), 'Corte de luz · Fuente: El Patagónico https://www.elpatagonico.com/sin-luz');
  assert.equal(L.lineaParaCopiar(avisoCronograma), 'Corte de agua · cronograma de verano · martes 4/11 desde las 18:00, 24 h · Zona Norte · Fuente: Cronograma de verano de la SCPL');
  assert.equal(L.lineaParaCopiar({ ...avisoSinDia, aviso: { ...avisoSinDia.aviso, programado: false } }).startsWith('Corte de luz por avería'), true);
});

test('avisos: textoParaCopiar mezcla avisos (una línea) y noticias (como siempre)', () => {
  const noticia = { titulo: 'Título', bajada: 'Bajada', links: [{ medio: 'Clarín', url: 'https://clarin.com/a' }] };
  assert.equal(L.textoParaCopiar([avisoSinDia, noticia]), `${L.lineaParaCopiar(avisoSinDia)}\n\nTítulo\nBajada\nClarín: https://clarin.com/a`);
});

test('avisos: el del cronograma no tiene url y se reconoce por su id (decidir, llevar)', () => {
  assert.deepEqual(L.urlsDe(avisoCronograma), ['id:a:cronograma:2025-11-04:Zona Norte']);
  const est = L.decidirTarjeta(avisoCronograma, { que: 'interesa' }, L.estadoVacio(), '2025-11-04T12:00:00.000Z');
  assert.equal(L.decisionDe(avisoCronograma, est).que, 'interesa');
  assert.equal(L.decisionDe({ ...avisoCronograma, id: 'a:cronograma:2025-11-05:Zona Sur y Central' }, est), null, 'dos del cronograma no se confunden');
  const llevado = L.marcarLlevadas([avisoCronograma], est, '2025-11-04T13:00:00.000Z');
  assert.equal(L.llevadaA(avisoCronograma, llevado), '2025-11-04T13:00:00.000Z');
  assert.equal(L.decisionDe(avisoCronograma, llevado), null);
});

test('avisos: un bloque «Avisos» vacío no se dibuja y con uno va primero', () => {
  const base = { cupoMinimo: 3, bloques: { nacional: { noticias: [], aMano: [] }, internacional: { noticias: [], aMano: [] } } };
  const con = { ...base, orden: ['avisos', 'nacional', 'internacional'], bloques: { ...base.bloques, avisos: { nombre: 'Avisos', minimo: 1, noticias: [avisoSinDia], aMano: [] } } };
  assert.deepEqual(L.bloquesADibujar(con).map(b => `${b.clave}:${b.nombre}:${b.minimo}`), ['avisos:Avisos:1', 'nacional:Nacionales:3', 'internacional:Internacionales:3']);
  const vacio = { ...con, bloques: { ...con.bloques, avisos: { ...con.bloques.avisos, noticias: [] } } };
  assert.deepEqual(L.bloquesADibujar(vacio).map(b => b.clave), ['nacional', 'internacional']);
});

test('avisos: un «se normalizó» dice cuándo se publicó, sin barrios, y se copia en una línea', () => {
  const t = { ...avisoCompleto, id: 'a:scpl.coop:2905', etiqueta: 'Agua · se normalizó', links: [avisoCompleto.links[0]],
    aviso: { ...avisoCompleto.aviso, normalizado: true, publicado: '2026-10-16T17:30:00.000Z' } };
  assert.deepEqual(L.lineaDeAviso(t), { partes: ['Se normalizó el servicio · Viernes 16/10 · 14:30'], barrios: null });
  assert.equal(L.lineaParaCopiar(t), 'Se normalizó el servicio de agua en Zona Norte · Fuente: SCPL https://scpl.coop/index.php/site/ver-nota?id=2898');
  const sinZona = { ...t, aviso: { ...t.aviso, zona: null, servicio: null } };
  assert.equal(L.lineaParaCopiar(sinZona), 'Se normalizó el servicio en Comodoro · Fuente: SCPL https://scpl.coop/index.php/site/ver-nota?id=2898');
});

/* ───────────── la página C (carta de Cowork del 17-10) ───────────── */

const TEMAS = ['Política', 'Economía', 'Sociedad', 'Policiales', 'Deportes', 'Espectáculos'].map(nombre => ({ nombre, prendido: true }));
// Una tarjeta de noticia con dos urls, como vienen en la lista real.
const N = (id, extra = {}) => ({
  id, titulo: 'Título ' + id, bajada: 'Bajada ' + id, etiqueta: 'Confirmada por 5 medios', via: 'A', grupos: 5, medios: [], tema: 'Política', hora: hace(3),
  links: [{ medio: 'Clarín', url: `https://clarin.com/${id}` }, { medio: 'Infobae', url: `https://infobae.com/${id}` }], ...extra,
});
const A1 = () => ({ ...avisoSinDia, id: 'a:1', links: [{ medio: 'SCPL', url: 'https://scpl.coop/1' }] });

// La lista de E3: avisos, Comodoro, nacional (con una 4/5) e internacional.
function listaE3({ escalon = 'plus', temas = TEMAS, cambios = {} } = {}) {
  const t = Object.fromEntries(['L1', 'L2', 'N1', 'N2', 'N3', 'I1'].map(id => [id, N(id, cambios[id])]));
  t.N4 = N('N4', { via: 'mano', grupos: 4, etiqueta: 'Confirmada por 4 medios · elegida a mano', ...cambios.N4 });
  t.A1 = A1();
  const lista = {
    generadaEn: AHORA, cupoMinimo: 3, minGrupos: 5, cliente: 'Canal 2',
    orden: ['avisos', 'local', 'nacional', 'internacional'],
    bloques: {
      avisos: { nombre: 'Avisos', minimo: 1, noticias: [t.A1], aMano: [] },
      local: { nombre: 'Comodoro', minimo: 1, noticias: [t.L1, t.L2], aMano: [] },
      nacional: { noticias: [t.N1, t.N2, t.N3], aMano: [t.N4] },
      internacional: { noticias: [t.I1], aMano: [] },
    },
    pagina: { nombre: '7M', escalon, temas, motivos: L.MOTIVOS },
  };
  return { lista, t };
}
const ids = grupos => grupos.map(g => ({ clave: g.clave, tarjetas: g.tarjetas.map(x => x.id) }));
const decidir = (t, que, estado, hora = AHORA, extra = {}) => L.decidirTarjeta(t, { que, minimo: 5, ...extra }, estado, hora);

test('E3 · orden de Por decidir: bloque por bloque, confirmadas y después la 4/5; los avisos aparte; pivote L1', () => {
  const { lista, t } = listaE3();
  const r = L.repartir(lista, L.estadoVacio());
  assert.deepEqual(ids(r.porDecidir), [
    { clave: 'local', tarjetas: ['L1', 'L2'] },
    { clave: 'nacional', tarjetas: ['N1', 'N2', 'N3', 'N4'] },
    { clave: 'internacional', tarjetas: ['I1'] },
  ]);
  assert.deepEqual(r.porDecidir.map(g => g.nombre), ['Comodoro', 'Nacionales', 'Internacionales']);
  assert.deepEqual(r.avisos.map(a => [a.tarjeta.id, a.estado, a.hora]), [['a:1', 'libre', null]]);
  assert.equal(r.numeros.porDecidir, 7, 'los avisos no cuentan');
  assert.equal(L.pivoteSiguiente(r.porDecidir, null).id, 'L1');
  assert.deepEqual(L.textoAvance(r.porDecidir, t.L1), { texto: '1 de 2 · Comodoro', k: 1, n: 2 });
});

test('E4 · decidir y el pivote siguiente: la que estaba después; de la última, la primera; sin ninguna, null', () => {
  const { lista, t } = listaE3();
  let estado = L.estadoVacio();
  let antes = L.repartir(lista, estado).porDecidir;
  estado = decidir(t.N2, 'archivo', estado);
  assert.equal(L.pivoteSiguiente(antes, t.N2, t.N2).id, 'N3');
  antes = L.repartir(lista, estado).porDecidir;
  estado = decidir(t.I1, 'interesa', estado);
  assert.equal(L.pivoteSiguiente(antes, t.I1, t.I1).id, 'L1', 'I1 era la última');
  for (const id of ['L1', 'L2', 'N1', 'N3', 'N4']) estado = decidir(t[id], 'archivo', estado);
  antes = L.repartir(lista, estado).porDecidir;
  assert.deepEqual(antes, []);
  assert.equal(L.pivoteSiguiente(antes, null), null);
  const ultima = L.repartir(lista, L.borrarDecision(t.N4, estado)).porDecidir;
  assert.equal(L.pivoteSiguiente(ultima, t.N4, t.N4), null, 'decidida la única que quedaba');
  assert.equal(L.decididasEnVisita(lista, estado, ['L1', 'L2', 'N1', 'N2', 'N3', 'N4', 'I1'].flatMap(id => L.urlsDe(t[id]))), 7, '«Decidiste las 7»');
});

test('E5 · No por hoy con «otro»: guarda motivo, texto, sello y grupos; va a No por hoy y Por decidir baja de 7 a 6', () => {
  const { lista, t } = listaE3();
  const estado = decidir(t.N1, 'nopor', L.estadoVacio(), AHORA, { motivo: 'otro', texto: 'hay cosas más importantes' });
  const d = L.decisionDe(t.N1, estado);
  assert.equal(d.que, 'nopor');
  assert.equal(d.motivo, 'otro');
  assert.equal(d.texto, 'hay cosas más importantes');
  assert.equal(d.sello, 'A');
  assert.equal(d.grupos, t.N1.grupos);
  assert.equal(d.minimo, 5);
  assert.deepEqual(d.urls, L.urlsDe(t.N1));
  assert.equal(d.hora, AHORA);
  const r = L.repartir(lista, estado);
  assert.equal(r.noPorHoy[0].id, 'N1');
  assert.equal(r.numeros.noPorHoy, 1);
  assert.equal(r.numeros.porDecidir, 6);
  const largo = decidir(t.N1, 'nopor', L.estadoVacio(), AHORA, { motivo: 'otro', texto: 'x'.repeat(200) });
  assert.equal(L.decisionDe(t.N1, largo).texto.length, 120, 'una línea, 120 letras como mucho');
});

test('E6 · Deshacer y Volver: borrar la decisión la devuelve a su lugar (primera de nacional, antes de N2)', () => {
  const { lista, t } = listaE3();
  const decidido = decidir(t.N1, 'nopor', L.estadoVacio(), AHORA, { motivo: 'otro', texto: 'hay cosas más importantes' });
  const estado = L.borrarDecision(t.N1, decidido);
  assert.equal(L.decisionDe(t.N1, estado), null);
  const r = L.repartir(lista, estado);
  assert.deepEqual(r.porDecidir[1].tarjetas.map(x => x.id), ['N1', 'N2', 'N3', 'N4']);
  // «Volver» desde la pestaña: el pivote que estaba sigue (sin decidida).
  assert.equal(L.pivoteSiguiente(r.porDecidir, t.N3).id, 'N3');
  assert.equal(L.decisionDe(t.N1, decidido).que, 'nopor', 'no toca el estado que recibe');
});

test('E7 · Copiar: Me interesa en el orden en que se eligió; después, todo a llevadas con la misma hora', () => {
  const { lista, t } = listaE3();
  let estado = decidir(t.N3, 'interesa', L.estadoVacio(), '2026-10-04T18:40:00.000Z');
  estado = decidir(t.A1, 'interesa', estado, '2026-10-04T18:41:00.000Z');
  estado = decidir(t.L2, 'interesa', estado, '2026-10-04T18:42:00.000Z');
  const r = L.repartir(lista, estado);
  assert.deepEqual(r.meInteresa.map(x => x.id), ['N3', 'a:1', 'L2']);
  assert.equal(r.numeros.meInteresa, 3);
  assert.equal(L.textoParaCopiar(r.meInteresa), [
    'Título N3', 'Bajada N3', 'Clarín: https://clarin.com/N3', 'Infobae: https://infobae.com/N3', '',
    L.lineaParaCopiar(t.A1), '',
    'Título L2', 'Bajada L2', 'Clarín: https://clarin.com/L2', 'Infobae: https://infobae.com/L2',
  ].join('\n'));
  const H = '2026-10-04T18:45:00.000Z';
  const despues = L.marcarLlevadas(r.meInteresa, estado, H);
  const r2 = L.repartir(lista, despues);
  assert.deepEqual(r2.meInteresa, []);
  assert.deepEqual(r2.llevadas.map(x => [x.tarjeta.id, x.hora]).sort(), [['L2', H], ['N3', H], ['a:1', H]]);
  assert.deepEqual(r2.avisos.map(a => [a.estado, a.hora]), [['llevado', H]]);
  assert.equal(r2.numeros.porDecidir, 5, 'lo llevado no vuelve a Por decidir');
  assert.deepEqual(L.textoBarra(0), { cuenta: 'Me interesa: 0', boton: 'Copiar', apagado: true });
  assert.deepEqual(L.textoBarra(3), { cuenta: 'Me interesa: 3', boton: 'Copiar las 3', apagado: false });
  assert.deepEqual(L.textoBarra(1), { cuenta: 'Me interesa: 1', boton: 'Copiar la 1', apagado: false });
});

test('E8 · temas: apagar uno oculta sus noticias y las cuenta; «Sin tema» siempre se ve; en Normal manda la config', () => {
  const cambios = { N2: { tema: 'Espectáculos' }, N4: { tema: 'Sin tema' } };
  const { lista, t } = listaE3({ cambios });
  const estado = L.alternarTema('Espectáculos', L.estadoVacio());
  assert.deepEqual(estado.temasApagados, ['Espectáculos']);
  const r = L.repartir(lista, estado);
  assert.deepEqual(r.porDecidir[1].tarjetas.map(x => x.id), ['N1', 'N3', 'N4']);
  assert.deepEqual(r.ocultas, { total: 1, temas: ['Espectáculos'] });
  assert.equal(r.numeros.porDecidir, 6);
  const ver = L.repartir(lista, estado, { verOcultas: true });
  assert.deepEqual(ver.porDecidir[1].tarjetas.map(x => x.id), ['N1', 'N2', 'N3', 'N4']);
  assert.equal(ver.numeros.porDecidir, 6, 'el número nunca cuenta las ocultas');
  assert.deepEqual(L.alternarTema('Espectáculos', estado).temasApagados, [], 'prenderlo de nuevo');
  assert.equal(L.temaOculto(t.N4, lista, { ...estado, temasApagados: ['Sin tema'] }), false, '«Sin tema» no se apaga');

  const temasNormal = TEMAS.map(x => (x.nombre === 'Espectáculos' ? { ...x, prendido: false } : x));
  const normal = listaE3({ escalon: 'normal', temas: temasNormal, cambios }).lista;
  const rn = L.repartir(normal, L.estadoVacio());
  assert.deepEqual(rn.porDecidir[1].tarjetas.map(x => x.id), ['N1', 'N3', 'N4']);
  assert.deepEqual(rn.ocultas, { total: 1, temas: ['Espectáculos'] });
  assert.equal(L.temaOculto(t.N2, normal, { ...L.estadoVacio(), temasApagados: ['!Espectáculos'] }), true, 'en Normal no se usa temasApagados');
  // En Plus, la persona puede prender uno que la config trae apagado: queda como '!Espectáculos'.
  const plusApagado = listaE3({ temas: temasNormal, cambios }).lista;
  const prendido = L.alternarTema('Espectáculos', L.estadoVacio(), plusApagado);
  assert.deepEqual(prendido.temasApagados, ['!Espectáculos']);
  assert.equal(L.temaOculto(t.N2, plusApagado, prendido), false);
  assert.deepEqual(L.alternarTema('Espectáculos', prendido, plusApagado).temasApagados, [], 'apagarlo otra vez vuelve a la config');
});

test('E9 · la mezcla desde Archivo: vuelve a Por decidir, primera de todas, bajo «Subieron a confirmada»', () => {
  const { lista, t } = listaE3();
  const [u] = L.urlsDe(t.N3);
  const H = '2026-10-04T14:20:00.000Z';
  const antes = L.normalizarEstado({ version: 2, decisiones: [{ urls: [u], que: 'archivo', sello: 'mano', hora: H, grupos: 4, minimo: 5 }] });
  const estado = L.aplicarMezcla(lista, antes, AHORA);
  assert.equal(L.decisionDe(t.N3, estado), null);
  assert.deepEqual(estado.subidas, [{ urls: L.urlsDe(t.N3), de: 'archivo', hora: H }]);
  const r = L.repartir(lista, estado);
  assert.deepEqual(ids([r.porDecidir[0]]), [{ clave: 'subieron', tarjetas: ['N3'] }]);
  assert.equal(r.porDecidir[0].nombre, 'Subieron a confirmada');
  assert.deepEqual(r.porDecidir[2].tarjetas.map(x => x.id), ['N1', 'N2', 'N4'], 'no se repite en su bloque');
  assert.equal(L.pivoteSiguiente(r.porDecidir, null).id, 'N3');
  assert.equal(L.subidaDe(t.N3, estado).hora, H, 'para «A las 11:20 la habías archivado»');
  assert.equal(L.horaAR(L.subidaDe(t.N3, estado).hora), '11:20');
  const decidida = decidir(t.N3, 'interesa', estado);
  assert.equal(L.subidaDe(t.N3, decidida), null, 'decidirla de nuevo borra la subida');
  assert.equal(L.subidaDe(t.N3, L.borrarDecision(t.N3, decidida, L.subidaDe(t.N3, estado))).hora, H, 'Deshacer la devuelve');
  assert.deepEqual(L.aplicarMezcla(lista, estado, AHORA), estado, 'aplicarla otra vez no cambia nada');
});

test('E10 · la mezcla desde No por hoy y desde Me interesa: subio: true; una con sello A no cambia; una llevada tampoco', () => {
  const { lista, t } = listaE3();
  const d = (id, extra) => ({ urls: L.urlsDe(t[id]), hora: hace(2), grupos: 4, minimo: 5, ...extra });
  const antes = L.normalizarEstado({ decisiones: [
    d('N1', { que: 'nopor', motivo: 'vieja', sello: 'mano' }),
    d('N2', { que: 'interesa', sello: 'mano' }),
    d('I1', { que: 'nopor', motivo: 'dato', sello: 'A', grupos: 5 }),
  ], llevadas: [{ urls: L.urlsDe(t.L1), hora: hace(1) }] });
  const conLlevadaMano = { ...antes, decisiones: [...antes.decisiones] };
  const estado = L.aplicarMezcla(lista, conLlevadaMano, AHORA);
  assert.equal(L.decisionDe(t.N1, estado).subio, true);
  assert.equal(L.decisionDe(t.N2, estado).subio, true);
  assert.equal('subio' in L.decisionDe(t.I1, estado), false);
  const r = L.repartir(lista, estado);
  assert.equal(r.subieronNoPorHoy, 1);
  assert.deepEqual(r.meInteresa.map(x => x.id), ['N2']);
  const di = L.decisionDe(t.N2, estado);
  assert.equal(`Era ${di.grupos} de ${di.minimo} cuando la elegiste; ahora confirmada`, 'Era 4 de 5 cuando la elegiste; ahora confirmada');
  assert.equal('subio' in L.decisionDe(t.N1, antes), false, 'no toca el estado que recibe');
  // Una 4/5 que sigue siendo 4/5 (N4, via 'mano') no sube.
  const n4 = L.aplicarMezcla(lista, decidir(t.N4, 'archivo', L.estadoVacio()), AHORA);
  assert.equal(L.decisionDe(t.N4, n4).que, 'archivo');
  assert.deepEqual(n4.subidas, []);
});

test('E11 · hay nuevas: cuenta solo las que no comparten url con la lista que se ve ni tienen decisión', () => {
  const vieja = listaE3().lista;
  const { t } = listaE3();
  const N5 = N('N5', { links: [{ medio: 'Clarín', url: 'https://clarin.com/N1' }, { medio: 'TN', url: 'https://tn.com.ar/N5' }] });
  const N6 = N('N6');
  const nueva = { ...vieja, generadaEn: hace(-0.5), bloques: { ...vieja.bloques, nacional: { noticias: [t.N1, t.N2, t.N3, N5, N6], aMano: [] } } };
  const estado = decidir(t.N3, 'archivo', L.estadoVacio());
  assert.equal(L.hayNuevas(vieja, nueva, estado), 1, 'solo N6');
  const N2b = { ...t.N2, bajada: 'Una bajada nueva' };
  const casiIgual = { ...vieja, generadaEn: hace(-0.5), bloques: { ...vieja.bloques, nacional: { ...vieja.bloques.nacional, noticias: [t.N1, N2b, t.N3] } } };
  assert.equal(L.hayNuevas(vieja, casiIgual, estado), 0);
  assert.equal(L.hayNuevas(vieja, nueva, decidir(N6, 'archivo', estado)), 0, 'una con decisión no cuenta');
});

test('E12 · el pivote no se mueve al actualizar: sigue N2 aunque entre N0 adelante; si N2 se cae, la primera', () => {
  const { lista, t } = listaE3();
  const antes = L.repartir(lista, L.estadoVacio()).porDecidir;
  assert.equal(L.textoAvance(antes, t.N2).texto, '2 de 4 · Nacionales');
  const N0 = N('N0', { grupos: 8 });
  const conN0 = { ...lista, bloques: { ...lista.bloques, nacional: { noticias: [N0, t.N1, t.N2, t.N3], aMano: [t.N4] } } };
  const despues = L.repartir(conN0, L.estadoVacio()).porDecidir;
  const pivote = L.pivoteSiguiente(despues, t.N2);
  assert.equal(pivote.id, 'N2');
  assert.equal(despues[1].tarjetas[0].id, 'N0');
  assert.deepEqual(L.textoAvance(despues, pivote), { texto: '3 de 5 · Nacionales', k: 3, n: 5 });
  // La misma noticia con otra url de más (y otro id): sigue siendo el pivote.
  const N2b = { ...t.N2, id: 'otro-id', links: [...t.N2.links, { medio: 'TN', url: 'https://tn.com.ar/N2' }] };
  const recalculada = { ...lista, bloques: { ...lista.bloques, nacional: { noticias: [t.N1, N2b, t.N3], aMano: [] } } };
  assert.equal(L.pivoteSiguiente(L.repartir(recalculada, L.estadoVacio()).porDecidir, t.N2).id, 'otro-id');
  const sinN2 = { ...lista, bloques: { ...lista.bloques, nacional: { noticias: [t.N1, t.N3], aMano: [] } } };
  assert.equal(L.pivoteSiguiente(L.repartir(sinN2, L.estadoVacio()).porDecidir, t.N2).id, 'L1');
});

test('E13 · estado viejo y estado roto: v1 conserva solo sus llevadas; lo que no tiene la forma se tira', () => {
  const u = 'https://clarin.com/x';
  const v1 = { vistas: { [u]: AHORA }, llevadas: [{ urls: [u], hora: AHORA }], vistasConfirmadas: { [u]: AHORA } };
  assert.deepEqual(L.normalizarEstado(v1), { version: 2, decisiones: [], llevadas: [{ urls: [u], hora: AHORA }], subidas: [], temasApagados: [] });
  for (const malo of [null, 'basura', { decisiones: 'x' }, [], 42]) assert.deepEqual(L.normalizarEstado(malo), L.estadoVacio(), JSON.stringify(malo));
  const v2 = { version: 2, decisiones: [
    { urls: [u], hora: AHORA, sello: 'A' },
    { urls: ['https://b'], que: 'archivo', hora: AHORA, sello: 'A', grupos: 6, minimo: 5 },
    { urls: [], que: 'archivo', hora: AHORA, sello: 'A' },
    { urls: ['https://c'], que: 'nopor', hora: AHORA, sello: 'A' },
    { urls: ['https://d'], que: 'interesa', hora: AHORA, sello: 'X' },
  ], llevadas: 'no', subidas: [{ urls: ['https://e'], hora: AHORA }, { hora: AHORA }], temasApagados: ['Deportes', 3, 'Deportes'] };
  const r = L.normalizarEstado(v2);
  assert.deepEqual(r.decisiones, [{ urls: ['https://b'], que: 'archivo', hora: AHORA, sello: 'A', grupos: 6, minimo: 5 }]);
  assert.deepEqual(r.llevadas, []);
  assert.deepEqual(r.subidas, [{ urls: ['https://e'], de: 'archivo', hora: AHORA }]);
  assert.deepEqual(r.temasApagados, ['Deportes']);
  assert.deepEqual(L.normalizarEstado(r), r, 'normalizar dos veces da lo mismo');
});

test('E13 · cargarEstado: lee v1 una sola vez, escribe v2 y borra la clave vieja; sin almacén o roto, vacío', () => {
  const u = 'https://clarin.com/x';
  const mem = { [L.CLAVE_V1]: JSON.stringify({ vistas: { [u]: AHORA }, llevadas: [{ urls: [u], hora: AHORA }] }) };
  const almacen = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = v; }, removeItem: k => { delete mem[k]; } };
  assert.equal(L.CLAVE, '7m-decisiones-v2');
  assert.equal(L.CLAVE_V1, '7m-marcas-v1');
  const e = L.cargarEstado(almacen);
  assert.deepEqual(e.llevadas, [{ urls: [u], hora: AHORA }]);
  assert.equal(L.CLAVE_V1 in mem, false);
  assert.deepEqual(JSON.parse(mem[L.CLAVE]), e);
  assert.deepEqual(L.cargarEstado(almacen), e, 'la segunda vez lee v2');
  const otro = { getItem: k => (k === L.CLAVE ? JSON.stringify({ version: 2, decisiones: [] }) : 'no debería leerse'), setItem() {}, removeItem() {} };
  assert.deepEqual(L.cargarEstado(otro), L.estadoVacio(), 'con v2, la v1 no se mira');
  assert.deepEqual(L.cargarEstado({ getItem: () => 'esto no es json' }), L.estadoVacio());
  assert.deepEqual(L.cargarEstado({ getItem: () => { throw new Error('bloqueado'); } }), L.estadoVacio());
  assert.deepEqual(L.cargarEstado(undefined), L.estadoVacio());
  assert.equal(L.guardarEstado({ setItem: () => { throw new Error('lleno'); } }, e), false);
  assert.equal(L.guardarEstado(undefined, e), false);
});

test('limpiar: saca decisiones, llevadas y subidas de más de 24 h; los temas no vencen', () => {
  const e = L.normalizarEstado({
    decisiones: [{ urls: ['a'], que: 'archivo', hora: hace(25), sello: 'A' }, { urls: ['b'], que: 'archivo', hora: hace(23), sello: 'A' }],
    llevadas: [{ urls: ['c'], hora: hace(25) }, { urls: ['d'], hora: hace(24) }],
    subidas: [{ urls: ['e'], hora: hace(25) }],
    temasApagados: ['Deportes'],
  });
  const r = L.limpiar(e, AHORA);
  assert.deepEqual(r.decisiones.map(d => d.urls[0]), ['b']);
  assert.deepEqual(r.llevadas.map(d => d.urls[0]), ['d'], 'la que tiene justo 24 h se queda');
  assert.deepEqual(r.subidas, []);
  assert.deepEqual(r.temasApagados, ['Deportes']);
  assert.equal(e.decisiones.length, 2, 'no toca el estado que recibe');
});

test('decidir otra vez reemplaza: a lo sumo una decisión por tarjeta, reconocida por url compartida', () => {
  const { lista, t } = listaE3();
  let estado = decidir(t.N1, 'archivo', L.estadoVacio());
  const recalculada = { ...t.N1, id: 'otro', links: [t.N1.links[1], { medio: 'TN', url: 'https://tn.com.ar/z' }] };
  estado = decidir(recalculada, 'interesa', estado);
  assert.equal(estado.decisiones.length, 1);
  assert.equal(L.decisionDe(t.N1, estado).que, 'interesa');
  assert.deepEqual(L.repartir(lista, estado).archivo, []);
});

test('Archivo y No por hoy van de la más nueva a la más vieja; Siguiente (Normal) va con No por hoy', () => {
  const { lista, t } = listaE3();
  let e = decidir(t.N1, 'archivo', L.estadoVacio(), hace(3));
  e = decidir(t.N2, 'archivo', e, hace(1));
  e = decidir(t.N3, 'siguiente', e, hace(2));
  e = decidir(t.I1, 'nopor', e, hace(1), { motivo: 'tengo' });
  const r = L.repartir(lista, e);
  assert.deepEqual(r.archivo.map(x => x.id), ['N2', 'N1']);
  assert.deepEqual(r.noPorHoy.map(x => x.id), ['I1', 'N3']);
  assert.equal(L.decisionDe(t.N3, e).que, 'siguiente');
  assert.equal('motivo' in L.decisionDe(t.N3, e), false);
});

test('E15 · avisos: «Me interesa» guarda sello aviso, 1 y 1; nunca están en Por decidir', () => {
  const { lista, t } = listaE3();
  const e = L.decidirTarjeta(t.A1, { que: 'interesa', minimo: 5 }, L.estadoVacio(), AHORA);
  const d = L.decisionDe(t.A1, e);
  assert.deepEqual([d.sello, d.grupos, d.minimo], ['aviso', 1, 1]);
  const r = L.repartir(lista, e);
  assert.equal(r.avisos[0].estado, 'interesa');
  assert.ok(!r.porDecidir.some(g => g.tarjetas.some(x => x.via === 'aviso')));
});

test('textoDeshacer, textoAvance sin pivote, paginaDe y tituloPagina', () => {
  assert.equal(L.textoDeshacer('interesa'), 'Mandada a “Me interesa”');
  assert.equal(L.textoDeshacer('nopor'), 'Mandada a “No por hoy”');
  assert.equal(L.textoDeshacer('archivo'), 'Archivada');
  assert.equal(L.textoDeshacer('siguiente'), 'Pasada');
  assert.equal(L.textoAvance([], null), null);
  const { lista } = listaE3();
  assert.equal(L.tituloPagina(lista), 'Canal 2 · 7M');
  assert.equal(L.tituloPagina({ ...lista, cliente: '' }), '7M');
  const vieja = { cliente: 'Canal 2', bloques: {} };
  assert.deepEqual(L.paginaDe(vieja), { nombre: '7M', escalon: 'plus', temas: [], motivos: L.MOTIVOS });
  assert.equal(L.paginaDe({ pagina: { escalon: 'raro' } }).escalon, 'plus');
  assert.deepEqual(L.MOTIVOS.map(m => m.texto), ['Es un dato, no una noticia', 'Ya la tengo', 'Opinión o reacción a otra', 'Está en el bloque equivocado', 'Ya pasó, llegó tarde', 'No va con nuestro público', 'Otro motivo…']);
});

test('una lista vieja (sin pagina, sin orden ni avisos) se reparte igual: sin temas no se oculta nada', () => {
  const t1 = N('x1');
  const lista = { cupoMinimo: 3, minGrupos: 5, bloques: { nacional: { noticias: [t1], aMano: [] }, internacional: { noticias: [], aMano: [] } } };
  const r = L.repartir(lista, L.estadoVacio());
  assert.deepEqual(ids(r.porDecidir), [{ clave: 'nacional', tarjetas: ['x1'] }]);
  assert.deepEqual(r.avisos, []);
  assert.deepEqual(r.ocultas, { total: 0, temas: [] });
});
