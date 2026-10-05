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
  const guardado = { vistas: { u1: AHORA }, llevadas: [{ urls: ['u1'], hora: AHORA }], vistasConfirmadas: { u1: AHORA } };
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

/* ───────────── «Recién confirmada» ───────────── */

const deVia = (via, titulo, urls) => tarjeta(titulo, urls, { via });
const guardadoYCargado = e => L.normalizarEstado(JSON.parse(JSON.stringify(e))); // lo que pasa por localStorage
const pasados = min => new Date(Date.parse(AHORA) + min * 60e3).toISOString(); // AHORA es «10:30»; hace(0.5) es «10:00»
const H1000 = hace(0.5); const H1030 = AHORA; const H1045 = pasados(15); const H1100 = pasados(30);

// Una carga de la página, en el mismo orden que traer() de index.html: «Nueva» y «Recién confirmada» se calculan con el estado
// de antes, y recién después se marca todo como visto. `previas` son las de la visita en curso (sin recargar).
function cargar(tarjetas, estado, ahora, previas = {}) {
  const nuevas = L.nuevasDeLaVisita(tarjetas, estado, previas.nuevas || []);
  const recien = L.recienConfirmadasDeLaVisita(tarjetas, estado, previas.recien || []);
  return { nuevas, recien, estado: L.marcarVistas(tarjetas, estado, ahora) };
}
const pastilla = (t, c, llevada = false) => L.pastillaDe(t, { nuevas: c.nuevas, recien: c.recien, llevada });

// X: una 4/5 con urls u1 a u4 que después llega al 5.º medio (u1 a u5, vía A).
const x4 = () => deVia('mano', 'X', ['u1', 'u2', 'u3', 'u4']);
const x5 = () => deVia('A', 'X', ['u1', 'u2', 'u3', 'u4', 'u5']);

test('E1: la ve abajo como 4/5 a las 10:00 y a las 10:30, ya confirmada, lleva «Recién confirmada»', () => {
  const a = cargar([x4()], L.estadoVacio(), H1000);
  assert.deepEqual(a.recien, [], 'una 4/5 que se ve por primera vez no es «recién confirmada» (y la página no le dibuja pastilla)');
  const b = cargar([x5()], guardadoYCargado(a.estado), H1030);
  assert.equal(pastilla(x5(), b), 'recien');
});

test('E2: una confirmada que ya vio como confirmada y que sigue confirmada (ahora con 6) no lleva nada', () => {
  const y5 = deVia('A', 'Y', ['u1', 'u2', 'u3', 'u4', 'u5']);
  const y6 = deVia('A', 'Y', ['u1', 'u2', 'u3', 'u4', 'u5', 'u6']);
  const a = cargar([y5], L.estadoVacio(), H1000);
  assert.equal(pastilla(y5, a), 'nueva', 'la primera vez es «Nueva»');
  const b = cargar([y6], guardadoYCargado(a.estado), H1030);
  assert.equal(pastilla(y6, b), null);
});

test('E3: la 4/5 que se llevó y después sube a confirmada no lleva nada y baja con «Te la llevaste»', () => {
  const a = cargar([x4()], L.estadoVacio(), H1000);
  const llevado = guardadoYCargado(L.marcarLlevadas([x4()], a.estado, H1000));
  const b = cargar([x5()], llevado, H1030);
  assert.equal(L.esRecienConfirmada(x5(), llevado), false);
  assert.equal(pastilla(x5(), b, true), null);
  const reparto = L.repartirBloque({ noticias: [x5()], aMano: [] }, llevado);
  assert.deepEqual(reparto.principales, []);
  assert.deepEqual(reparto.llevadas.map(x => [x.tarjeta.titulo, x.hora]), [['X', H1000]]);
});

test('E4: una confirmada que aparece por primera vez lleva «Nueva»', () => {
  const z = deVia('A', 'Z', ['z1', 'z2', 'z3', 'z4', 'z5']);
  const a = cargar([x4()], L.estadoVacio(), H1000);
  const b = cargar([x4(), z], guardadoYCargado(a.estado), H1030);
  assert.equal(pastilla(z, b), 'nueva');
  assert.equal(L.esRecienConfirmada(z, guardadoYCargado(a.estado)), false, 'no la había visto: no es «recién»');
});

test('E5: lo guardado por la versión de hoy (sin vistasConfirmadas) no hace aparecer «Recién confirmada» en lo ya visto', () => {
  const viejo = guardadoYCargado({ vistas: { u1: H1000, u2: H1000, u3: H1000, u4: H1000 }, llevadas: [] });
  assert.deepEqual(viejo.vistasConfirmadas, viejo.vistas);
  const b = cargar([x5()], viejo, H1030);
  assert.equal(pastilla(x5(), b), null);
});

test('E6: si la que ya vio sube por la vía B, no lleva «Recién confirmada» (la vía B nunca dice «confirmada»)', () => {
  const a = cargar([x4()], L.estadoVacio(), H1000);
  const xB = deVia('B', 'X', ['u1', 'u2', 'u3']);
  const b = cargar([xB], guardadoYCargado(a.estado), H1030);
  assert.equal(L.esRecienConfirmada(xB, guardadoYCargado(a.estado)), false);
  assert.equal(pastilla(xB, b), null);
  assert.deepEqual(b.recien, []);
});

test('E7: la que se mostró como vía B y llegó a 5 medios (vía A) lleva «Recién confirmada»', () => {
  const wB = deVia('B', 'W', ['w1', 'w2']);
  const wA = deVia('A', 'W', ['w1', 'w2', 'w3', 'w4', 'w5']);
  const a = cargar([wB], L.estadoVacio(), H1000);
  assert.equal(pastilla(wB, a), 'nueva', 'la vía B, la primera vez, es «Nueva» como cualquier otra');
  const b = cargar([wA], guardadoYCargado(a.estado), H1030);
  assert.equal(pastilla(wA, b), 'recien');
});

test('E8: «Recién confirmada» dura la visita: al apretar «Traer noticias» sin recargar sigue', () => {
  const a = cargar([x4()], L.estadoVacio(), H1000);
  const b = cargar([x5()], guardadoYCargado(a.estado), H1030);
  assert.equal(pastilla(x5(), b), 'recien');
  // traer de nuevo a las 10:45: marcarVistas ya la puso en vistasConfirmadas, pero las previas la mantienen
  assert.equal(L.esRecienConfirmada(x5(), b.estado), false);
  const c = cargar([x5()], b.estado, H1045, b);
  assert.equal(pastilla(x5(), c), 'recien');
});

test('E9: pasada la visita (se abre la página de nuevo) ya no lleva nada', () => {
  const a = cargar([x4()], L.estadoVacio(), H1000);
  const b = cargar([x5()], guardadoYCargado(a.estado), H1030);
  const c = cargar([x5()], guardadoYCargado(b.estado), H1100);
  assert.equal(pastilla(x5(), c), null);
  assert.deepEqual(c.recien, []);
});

test('E10: la que ve abajo por primera vez (queda en «nuevas») y sube a confirmada sin recargar lleva «Recién confirmada», no «Nueva»', () => {
  const a = cargar([x4()], L.estadoVacio(), H1000);
  assert.deepEqual(a.nuevas, ['u1', 'u2', 'u3', 'u4']);
  const b = cargar([x5()], a.estado, H1030, a);
  assert.ok(b.nuevas.includes('u1'), 'sigue en nuevas');
  assert.equal(pastilla(x5(), b), 'recien');
});

test('pastillaDe: lo llevado no lleva pastilla, aunque sea nueva o recién confirmada; nunca dos a la vez', () => {
  const t = x5();
  const c = { nuevas: ['u1'], recien: ['u1'] };
  assert.equal(L.pastillaDe(t, { ...c, llevada: true }), null);
  assert.equal(L.pastillaDe(t, { nuevas: ['u1'], recien: [], llevada: true }), null);
  assert.equal(L.pastillaDe(t, { ...c, llevada: false }), 'recien', 'gana sobre «Nueva»');
  assert.equal(L.pastillaDe(t, { nuevas: ['u1'], recien: [] }), 'nueva');
  assert.equal(L.pastillaDe(t, { nuevas: [], recien: [] }), null);
  assert.equal(L.pastillaDe(t, {}), null);
  assert.equal(L.pastillaDe(deVia('B', 'b', ['u1']), { nuevas: [], recien: ['u1'] }), null, 'solo la vía A puede ser «recién»');
});

test('esRecienConfirmada pide las 4 condiciones: vía A, ya vista, nunca vista como confirmada y no llevada', () => {
  const estado = { vistas: { u1: H1000 }, llevadas: [], vistasConfirmadas: {} };
  assert.equal(L.esRecienConfirmada(deVia('A', 'x', ['u1']), estado), true);
  assert.equal(L.esRecienConfirmada(deVia('mano', 'x', ['u1']), estado), false, '(1) no es vía A');
  assert.equal(L.esRecienConfirmada(deVia('A', 'x', ['u9']), estado), false, '(2) no la había visto');
  assert.equal(L.esRecienConfirmada(deVia('A', 'x', ['u1']), { ...estado, vistasConfirmadas: { u1: H1000 } }), false, '(3) ya la vio como confirmada');
  assert.equal(L.esRecienConfirmada(deVia('A', 'x', ['u1', 'u2']), { ...estado, vistasConfirmadas: { u2: H1000 } }), false, '(3) con otra url suya');
  assert.equal(L.esRecienConfirmada(deVia('A', 'x', ['u1']), { ...estado, llevadas: [{ urls: ['u1'], hora: H1000 }] }), false, '(4) ya la llevó');
  assert.equal(L.esRecienConfirmada(deVia('A', 'x', ['u1']), { vistas: { u1: H1000 }, llevadas: [] }), true, 'un estado sin vistasConfirmadas se toma como {}');
});

test('marcarVistas pone en vistasConfirmadas solo las urls de la vía A, y no toca el estado que recibe', () => {
  const estado = { vistas: { u0: hace(2) }, llevadas: [{ urls: ['u0'], hora: hace(2) }], vistasConfirmadas: { u0: hace(2) } };
  const copia = JSON.parse(JSON.stringify(estado));
  const r = L.marcarVistas([deVia('A', 'a', ['a1', 'a2']), deVia('B', 'b', ['b1']), deVia('mano', 'm', ['m1'])], estado, AHORA);
  assert.deepEqual(Object.keys(r.vistas).sort(), ['a1', 'a2', 'b1', 'm1', 'u0']);
  assert.deepEqual(Object.keys(r.vistasConfirmadas).sort(), ['a1', 'a2', 'u0']);
  assert.equal(r.vistasConfirmadas.a1, AHORA);
  assert.deepEqual(estado, copia);
  r.vistasConfirmadas.mutada = 'x';
  assert.deepEqual(estado, copia, 'ni compartiendo el objeto');
  // marcarLlevadas la copia sin cambiarla
  const ll = L.marcarLlevadas([deVia('A', 'a', ['a1'])], estado, AHORA);
  assert.deepEqual(ll.vistasConfirmadas, estado.vistasConfirmadas);
  assert.notEqual(ll.vistasConfirmadas, estado.vistasConfirmadas);
  assert.deepEqual(estado, copia);
});

test('limpiar saca de vistasConfirmadas lo de más de 24 h y deja lo de 23 h', () => {
  const estado = { vistas: {}, llevadas: [], vistasConfirmadas: { vieja: hace(25), reciente: hace(23) } };
  const copia = JSON.parse(JSON.stringify(estado));
  assert.deepEqual(Object.keys(L.limpiar(estado, AHORA).vistasConfirmadas), ['reciente']);
  assert.deepEqual(estado, copia, 'no toca el estado que recibe');
  assert.deepEqual(L.limpiar({ vistas: {}, llevadas: [] }, AHORA).vistasConfirmadas, {}, 'sin vistasConfirmadas se toma como {}');
});

test('normalizarEstado: sin vistasConfirmadas (o con algo que no es un objeto) arranca como copia de vistas', () => {
  const vistas = { u1: H1000, u2: H1000, mala: 5 };
  const esperado = { u1: H1000, u2: H1000 };
  assert.deepEqual(L.normalizarEstado({ vistas, llevadas: [] }).vistasConfirmadas, esperado, 'falta');
  assert.deepEqual(L.normalizarEstado({ vistas, llevadas: [], vistasConfirmadas: 7 }).vistasConfirmadas, esperado, 'un número');
  assert.deepEqual(L.normalizarEstado({ vistas, llevadas: [], vistasConfirmadas: ['u1'] }).vistasConfirmadas, esperado, 'un array');
  assert.deepEqual(L.normalizarEstado({ vistas, llevadas: [], vistasConfirmadas: null }).vistasConfirmadas, esperado, 'null');
  assert.deepEqual(L.normalizarEstado({ vistas, llevadas: [], vistasConfirmadas: { a: H1000, b: 3, c: null, d: 'texto' } }).vistasConfirmadas, { a: H1000, d: 'texto' }, 'solo los valores de texto');
  assert.deepEqual(L.normalizarEstado({ vistas, llevadas: [], vistasConfirmadas: {} }).vistasConfirmadas, {}, 'un objeto vacío es un objeto: se respeta');
  const n = L.normalizarEstado({ vistas, llevadas: [] });
  n.vistasConfirmadas.nueva = 'x';
  assert.ok(!('nueva' in n.vistas), 'es una copia, no el mismo objeto');
  assert.deepEqual(L.estadoVacio(), { vistas: {}, llevadas: [], vistasConfirmadas: {} });
});
