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

test('L2: esNueva es falsa si alguna url ya se vio, y verdadera si no se vio ninguna', () => {
  const t = tarjeta('x', ['u1', 'u2']);
  assert.equal(L.esNueva(t, { vistas: { u2: hace(1) }, llevadas: [] }), false);
  assert.equal(L.esNueva(t, { vistas: {}, llevadas: [] }), true);
  assert.equal(L.esNueva(t, { vistas: { u9: hace(1) }, llevadas: [] }), true);
});

test('L3: llevadaA reconoce la misma noticia aunque el programa la recalcule (comparte una url)', () => {
  const estado = { vistas: {}, llevadas: [{ urls: ['u1', 'u2'], hora: 'H' }] };
  assert.equal(L.llevadaA(tarjeta('recalculada', ['u2', 'u3']), estado), 'H');
  assert.equal(L.llevadaA(tarjeta('otra', ['u4']), estado), null);
  const dos = { vistas: {}, llevadas: [{ urls: ['u1'], hora: 'H1' }, { urls: ['u1', 'u5'], hora: 'H2' }] };
  assert.equal(L.llevadaA(tarjeta('x', ['u1']), dos), 'H1', 'la hora de la primera que comparte');
});

test('L4: limpiar saca lo de más de 24 h y deja lo de 23 h, en vistas y en llevadas', () => {
  const estado = {
    vistas: { vieja: hace(25), reciente: hace(23) },
    llevadas: [{ urls: ['a'], hora: hace(25) }, { urls: ['b'], hora: hace(23) }],
  };
  const r = L.limpiar(estado, AHORA);
  assert.deepEqual(Object.keys(r.vistas), ['reciente']);
  assert.deepEqual(r.llevadas.map(l => l.urls[0]), ['b']);
  assert.deepEqual(Object.keys(L.limpiar(estado, AHORA, 48).vistas).sort(), ['reciente', 'vieja'], 'con otro plazo');
  const justa = L.limpiar({ vistas: { exacta: hace(24), pasada: new Date(Date.parse(hace(24)) - 1).toISOString() }, llevadas: [] }, AHORA);
  assert.deepEqual(Object.keys(justa.vistas), ['exacta'], '«de más de 24 h»: la que tiene justo 24 h se queda');
  assert.equal(Object.keys(estado.vistas).length, 2, 'no toca el estado que recibe');
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

test('marcarVistas y marcarLlevadas devuelven un estado nuevo y no tocan el que reciben', () => {
  const estado = { vistas: { u0: hace(2) }, llevadas: [{ urls: ['u0'], hora: hace(2) }] };
  const copia = JSON.parse(JSON.stringify(estado));
  const t = tarjeta('x', ['u1', 'u2']);
  const v = L.marcarVistas([t], estado, AHORA);
  assert.deepEqual(Object.keys(v.vistas).sort(), ['u0', 'u1', 'u2']);
  assert.equal(v.vistas.u1, AHORA);
  const ll = L.marcarLlevadas([t], estado, AHORA);
  assert.deepEqual(ll.llevadas.map(l => [l.urls, l.hora]), [[['u0'], hace(2)], [['u1', 'u2'], AHORA]]);
  assert.deepEqual(estado, copia, 'el estado de entrada queda igual');
  ll.llevadas[0].urls.push('mutada');
  assert.deepEqual(estado, copia, 'ni compartiendo arreglos adentro');
});

test('lo tildado: se tilda por urls, se destilda entero y reconoce la misma noticia por una url', () => {
  const t = tarjeta('x', ['u1', 'u2']);
  const tildadas = L.alternarTilde(t, ['otra']);
  assert.deepEqual(tildadas, ['otra', 'u1', 'u2']);
  assert.equal(L.estaTildada(t, tildadas), true);
  assert.equal(L.estaTildada(tarjeta('recalculada', ['u2', 'u9']), tildadas), true, 'comparte u2');
  assert.deepEqual(L.alternarTilde(t, tildadas), ['otra']);
  assert.equal(L.estaTildada(tarjeta('y', ['u7']), tildadas), false);
});

test('la barra de abajo: 0, 1 y varias elegidas', () => {
  assert.deepEqual(L.textoBarra(0), { cuenta: '0 elegidas', boton: 'Copiar', apagado: true });
  assert.deepEqual(L.textoBarra(1), { cuenta: '1 elegida', boton: 'Copiar la 1', apagado: false });
  assert.deepEqual(L.textoBarra(2), { cuenta: '2 elegidas', boton: 'Copiar las 2', apagado: false });
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
  assert.equal(L.etiquetaMedios({ grupos: 4, medios: ['La Gaceta', 'La Nación', 'Clarín', 'Página/12'] }, 5), '4 de 5: La Gaceta · La Nación · Clarín · Página/12');
});

test('«Nueva» dura esa visita: sigue siéndolo al traer de nuevo, y una tarjeta que ya se vio no lo es', () => {
  const vistaAntes = tarjeta('vieja', ['u1']);
  const nuevaHoy = tarjeta('nueva', ['u2']);
  const estado = { vistas: { u1: hace(2) }, llevadas: [] };
  const alAbrir = L.nuevasDeLaVisita([vistaAntes, nuevaHoy], estado);
  assert.deepEqual(alAbrir, ['u2']);
  // al abrir se marca todo como visto; al apretar «Traer noticias» la que era nueva sigue siéndolo, y aparece otra
  const despues = L.marcarVistas([vistaAntes, nuevaHoy], estado, AHORA);
  const otra = tarjeta('otra', ['u3']);
  const alTraer = L.nuevasDeLaVisita([vistaAntes, nuevaHoy, otra], despues, alAbrir);
  assert.deepEqual(alTraer, ['u2', 'u3']);
  assert.equal(L.esNuevaEnVisita(nuevaHoy, alTraer), true);
  assert.equal(L.esNuevaEnVisita(vistaAntes, alTraer), false);
});

test('repartirBloque: lo llevado baja al final (confirmadas primero, después 4/5) y el resto queda donde estaba', () => {
  const c1 = tarjeta('c1', ['u1']); const c2 = tarjeta('c2', ['u2']); const m1 = tarjeta('m1', ['u3']); const m2 = tarjeta('m2', ['u4']);
  const estado = { vistas: {}, llevadas: [{ urls: ['u2'], hora: 'H2' }, { urls: ['u3'], hora: 'H3' }] };
  const r = L.repartirBloque({ noticias: [c1, c2], aMano: [m1, m2] }, estado);
  assert.deepEqual(r.principales.map(t => t.titulo), ['c1']);
  assert.deepEqual(r.aMano.map(t => t.titulo), ['m2']);
  assert.deepEqual(r.llevadas.map(x => [x.tarjeta.titulo, x.hora]), [['c2', 'H2'], ['m1', 'H3']]);
});

test('cargarEstado y guardarEstado: sin almacén, con datos rotos o con el disco lleno, la página anda sin marcas', () => {
  const guardado = { vistas: { u1: AHORA }, llevadas: [{ urls: ['u1'], hora: AHORA }] };
  const mem = {}; const almacen = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = v; } };
  assert.equal(L.guardarEstado(almacen, guardado), true);
  assert.ok(L.CLAVE in mem);
  assert.equal(L.CLAVE, '7m-marcas-v1');
  assert.deepEqual(L.cargarEstado(almacen), guardado);
  assert.deepEqual(L.cargarEstado({ getItem: () => 'esto no es json' }), L.estadoVacio());
  assert.deepEqual(L.cargarEstado({ getItem: () => { throw new Error('bloqueado'); } }), L.estadoVacio());
  assert.deepEqual(L.cargarEstado(undefined), L.estadoVacio());
  assert.deepEqual(L.cargarEstado({ getItem: () => JSON.stringify({ vistas: [1], llevadas: 'no' }) }), L.estadoVacio());
  assert.equal(L.guardarEstado({ setItem: () => { throw new Error('lleno'); } }, guardado), false);
  assert.equal(L.guardarEstado(undefined, guardado), false);
});

test('horaAR: hora de Argentina de 24 horas, también pasada la medianoche', () => {
  assert.equal(L.horaAR('2026-10-04T15:00:00.000Z'), '12:00');
  assert.equal(L.horaAR('2026-10-04T03:05:00.000Z'), '00:05');
  assert.equal(L.horaAR('2026-10-04T17:30:00.000Z'), '14:30');
});
