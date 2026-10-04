'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { cargarNotas, guardarNotas, filtrarRutas, lineaRutasExcluidas, lineaAcumulado, fechaCorta, detalleDeHechos, motivosCriterio1, detalleCriterio1, leerOpciones, ErrorDeUso } = require('../scripts/leer.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');

const carpeta = () => mkdtempSync(join(tmpdir(), 'notitan-leer-'));
const nota = id => ({ id, titulo: id, fecha: '2026-10-04T10:00:00.000Z' });

test('cargarNotas: un archivo que no existe arranca vacío', () => {
  assert.deepEqual(cargarNotas(join(carpeta(), 'no-esta.json')), []);
});

test('cargarNotas: un archivo roto corta con un mensaje y no se pisa', () => {
  const archivo = join(carpeta(), 'notas.json');
  writeFileSync(archivo, '[{"id": "a", ');
  assert.throws(() => cargarNotas(archivo), e => e instanceof ErrorDeUso && /no es JSON válido/.test(e.message) && /No lo toqué/.test(e.message));
  assert.equal(readFileSync(archivo, 'utf8'), '[{"id": "a", ', 'el archivo queda como estaba');
});

test('cargarNotas: un JSON que no es una lista también corta', () => {
  const archivo = join(carpeta(), 'notas.json');
  writeFileSync(archivo, '{"id": "a"}');
  assert.throws(() => cargarNotas(archivo), /no es una lista de notas/);
});

test('guardarNotas: crea la carpeta que falta, vuelve a leerse igual y no deja archivos temporales', () => {
  const base = carpeta();
  const archivo = join(base, 'datos', 'notas.json');
  guardarNotas(archivo, [nota('a'), nota('b')]);
  assert.deepEqual(cargarNotas(archivo), [nota('a'), nota('b')]);
  guardarNotas(archivo, [nota('c')]);
  assert.deepEqual(cargarNotas(archivo), [nota('c')]);
  assert.deepEqual(readdirSync(join(base, 'datos')), ['notas.json']);
  rmSync(base, { recursive: true });
});

test('lineaAcumulado: el formato que pidió el PREPARADOR, con puntos de miles y hora de Argentina', () => {
  const ids = n => Array.from({ length: n }, (_, k) => 'id' + k);
  const notas = Array.from({ length: 1234 }, (_, k) => ({ id: 'n' + k, fecha: k === 0 ? '2026-10-03T17:10:00.000Z' : '2026-10-04T10:00:00.000Z' }));
  assert.equal(
    lineaAcumulado('datos/notas.json', { notas, agregadas: ids(56), repetidas: ids(980), borradas: ids(12) }, reglas),
    'ACUMULADO · 1.234 notas en datos/notas.json (56 nuevas, 980 repetidas, 12 borradas por tener más de 48 h) · la más vieja: 3/10/26 14:10');
});

test('lineaAcumulado: sin notas no inventa una fecha', () => {
  assert.equal(lineaAcumulado('a.json', { notas: [], agregadas: [], repetidas: [], borradas: [] }, reglas),
    'ACUMULADO · 0 notas en a.json (0 nuevas, 0 repetidas, 0 borradas por tener más de 48 h)');
});

test('fechaCorta: 23:30 en Argentina es el día siguiente en UTC', () => {
  assert.equal(fechaCorta('2026-10-05T02:30:00.000Z'), '4/10/26 23:30');
});

test('leerOpciones: --sin-leer solo vale con --acumular, y los valores tienen que venir', () => {
  assert.throws(() => leerOpciones(['--sin-leer'], reglas), /solo vale junto con --acumular/);
  assert.throws(() => leerOpciones(['--acumular'], reglas), /--acumular necesita un valor/);
  assert.throws(() => leerOpciones(['--acumular', '--sin-leer'], reglas), /--acumular necesita un valor/);
  assert.throws(() => leerOpciones(['--umbral', 'mucho'], reglas), /tiene que ser un número/);
});

test('leerOpciones: --umbral pisa solo la copia, y sin opciones todo queda como hoy', () => {
  const umbralDeLaConfig = reglas.umbralSimilitud;
  const o = leerOpciones(['--umbral', '0.42', '--acumular', 'datos/notas.json', '--sin-leer'], reglas);
  assert.equal(o.reglas.umbralSimilitud, 0.42);
  assert.equal(reglas.umbralSimilitud, umbralDeLaConfig, 'config/reglas.json no se toca');
  assert.equal(o.archivoAcum, 'datos/notas.json');
  assert.equal(o.sinLeer, true);
  const vacio = leerOpciones([], reglas);
  assert.deepEqual([vacio.archivoAcum, vacio.sinLeer, vacio.salidaJson], [null, false, null]);
  assert.equal(vacio.reglas.umbralSimilitud, reglas.umbralSimilitud);
});

test('leerOpciones: --min-comunes pisa solo la copia y tiene que ser un entero; --detalle se activa solo si se pide', () => {
  assert.equal(leerOpciones(['--min-comunes', '0'], reglas).reglas.minPalabrasComunes, 0);
  assert.equal(leerOpciones(['--min-comunes', '5'], reglas).reglas.minPalabrasComunes, 5);
  assert.equal(reglas.minPalabrasComunes, 3, 'config/reglas.json no se toca (la perilla vale 3)');
  assert.throws(() => leerOpciones(['--min-comunes', '2.5'], reglas), /entero/);
  assert.throws(() => leerOpciones(['--min-comunes', '-1'], reglas), /entero/);
  assert.equal(leerOpciones(['--detalle'], reglas).detalle, true);
  assert.equal(leerOpciones([], reglas).detalle, false);
});

const AHORA_DET = '2026-10-04T18:00:00.000Z';
const notaDet = (id, portal, titulo, extra = {}) => ({ id, portal, titulo, url: `https://www.${portal}/mundo/${id}`, fecha: '2026-10-04T16:00:00.000Z', ...extra });

test('detalleDeHechos: lista los hechos de 3 o más grupos con el portal y el título de cada nota', () => {
  const tratado = 'Se firmó un tratado comercial entre Chile y Japón en Tokio';
  const notas = [
    notaDet('1', 'clarin.com', tratado), notaDet('2', 'lanacion.com.ar', tratado), notaDet('3', 'infobae.com', tratado),
    notaDet('4', 'perfil.com', 'Llovió mucho en Rosario durante la madrugada'),
    notaDet('5', 'ambito.com', tratado, { url: 'https://www.ambito.com/opinion/5' }),
    notaDet('6', 'cronista.com', tratado, { fecha: '2026-10-01T16:00:00.000Z' }),
  ];
  const d = detalleDeHechos(notas, reglas, portales, AHORA_DET);
  assert.equal(d.cantidad, 1, 'la lluvia tiene 1 grupo; la opinión y la nota de hace 3 días no cuentan');
  assert.match(d.lineas[1], /^\[3 grupos · 3 notas\] Se firmó un tratado/);
  assert.match(d.lineas[2], /^    grupos: .*clarín.*|^    grupos: .*clarin/);
  assert.deepEqual(d.lineas.slice(3).map(l => l.trim().split(/\s+/)[1]), ['clarin.com', 'lanacion.com.ar', 'infobae.com']);
  assert.ok(!d.lineas.join('\n').includes('opinion'));
});

test('detalleDeHechos: respeta las reglas del agrupador que se le pasan', () => {
  const a = 'Diputados aprobó el Presupuesto';
  const b = 'Diputados empezó a debatir el Presupuesto';
  const notas = [notaDet('1', 'clarin.com', a), notaDet('2', 'lanacion.com.ar', b), notaDet('3', 'infobae.com', b)];
  const bajaSola = { ...reglas, umbralSimilitud: 0.3, minPalabrasComunes: 0 };
  assert.equal(detalleDeHechos(notas, bajaSola, portales, AHORA_DET).cantidad, 1, '0,3 sola junta las etapas');
  assert.equal(detalleDeHechos(notas, { ...bajaSola, minPalabrasComunes: 3 }, portales, AHORA_DET).cantidad, 0, 'con 3 palabras en común, no');
});

test('--sin-notas-de-servicio: para esa corrida los moldes quedan vacíos y la config compartida no se toca', () => {
  assert.equal(reglas.criterio1.notasDeServicio.length, 3);
  const o = leerOpciones(['--sin-notas-de-servicio'], reglas);
  assert.deepEqual(o.reglas.criterio1.notasDeServicio, []);
  assert.deepEqual(o.reglas.criterio1.titulosExcluidos, reglas.criterio1.titulosExcluidos, 'el resto del criterio 1 sigue');
  assert.equal(reglas.criterio1.notasDeServicio.length, 3, 'reglasBase sigue con los 3 moldes');
  assert.equal(leerOpciones([], reglas).reglas.criterio1.notasDeServicio.length, 3, 'sin la opción, valen los 3');
});

test('motivosCriterio1: cuenta por motivo, de mayor a menor, y solo mira las notas', () => {
  const nota3 = motivo => ({ tipo: 'nota', id: 'x', titulo: 't', portal: 'p', motivo });
  const r = motivosCriterio1([
    nota3('nota_de_servicio (efemérides)'), nota3('no_informativa (url /opinion/)'), nota3('nota_de_servicio (efemérides)'),
    { tipo: 'hecho', id: 'h', titulo: 't', motivo: 'no_llego_a_5 (2/5, pasaron más de 24 h)' },
    nota3('nota_de_servicio (efemérides)'),
  ]);
  assert.deepEqual(r, [['nota_de_servicio (efemérides)', 3], ['no_informativa (url /opinion/)', 1]]);
});

test('motivosCriterio1: si empatan, por orden alfabético', () => {
  const nota3 = motivo => ({ tipo: 'nota', id: 'x', titulo: 't', portal: 'p', motivo });
  assert.deepEqual(motivosCriterio1([nota3('b'), nota3('a')]), [['a', 1], ['b', 1]]);
  assert.deepEqual(motivosCriterio1([]), []);
});

test('detalleCriterio1: solo las notas sacadas por una regla de título, agrupadas por motivo', () => {
  const nota3 = (motivo, titulo, portal = 'clarin.com') => ({ tipo: 'nota', id: titulo, titulo, portal, motivo });
  const lineas = detalleCriterio1([
    nota3('nota_de_servicio (efemérides)', 'Efemérides de hoy'),
    nota3('no_informativa (url /opinion/)', 'Una columna'),
    nota3('no_informativa (título quiniela)', 'Quiniela de hoy', 'infobae.com'),
    nota3('nota_de_servicio (efemérides)', 'Efemérides del 4 de octubre', 'lanacion.com.ar'),
    { tipo: 'hecho', id: 'h', titulo: 'Un hecho', motivo: 'nota_de_servicio (x)' },
  ]);
  const texto = lineas.join('\n');
  assert.match(texto, /nota_de_servicio \(efemérides\)\n\s+· clarin\.com\s+Efemérides de hoy\n\s+· lanacion\.com\.ar\s+Efemérides del 4 de octubre/);
  assert.match(texto, /no_informativa \(título quiniela\)\n\s+· infobae\.com\s+Quiniela de hoy/);
  assert.doesNotMatch(texto, /columna/i, 'la de url no es una regla de título');
  assert.doesNotMatch(texto, /Un hecho/, 'los hechos no son notas');
  assert.deepEqual(detalleCriterio1([]), []);
});

/* ───────── rutas excluidas de lo guardado ───────── */

const FEEDS_RUTAS = [
  { nombre: 'Infobae', dominio: 'infobae.com', excluirRutas: ['/espana/', '/peru/', '/mexico/', '/colombia/'] },
  { nombre: 'Clarín', dominio: 'clarin.com' },
];
const deRuta = (id, url, feed) => ({ id, url, feed, titulo: id, fecha: '2026-10-04T10:00:00.000Z' });

test('filtrarRutas: saca solo lo que el feed de la nota excluye, deja lo que no tiene feed o su feed no existe, y no toca la lista', () => {
  const notas = [
    deRuta('peru', 'https://www.infobae.com/peru/2026/10/04/a/', 'Infobae'),
    deRuta('america', 'https://www.infobae.com/america/2026/10/04/b/', 'Infobae'),
    deRuta('sinfeed', 'https://www.infobae.com/peru/2026/10/04/c/', undefined),
    deRuta('feedfantasma', 'https://www.infobae.com/peru/2026/10/04/d/', 'Un feed que ya no existe'),
  ];
  const copia = structuredClone(notas);
  const r = filtrarRutas(notas, FEEDS_RUTAS);
  assert.deepEqual(r.notas.map(n => n.id), ['america', 'sinfeed', 'feedfantasma']);
  assert.deepEqual(r.sacadas, [{ id: 'peru', ruta: '/peru/' }]);
  assert.deepEqual(notas, copia, 'la lista que recibe queda como estaba');
});

test('filtrarRutas: un feed sin excluirRutas no pierde nada, aunque la dirección diga /peru/', () => {
  const r = filtrarRutas([deRuta('x', 'https://www.clarin.com/peru/a/', 'Clarín')], FEEDS_RUTAS);
  assert.equal(r.notas.length, 1);
  assert.deepEqual(r.sacadas, []);
});

test('filtrarRutas: no saca /america/mexico/ (la ruta tiene que abrir la dirección)', () => {
  const r = filtrarRutas([deRuta('am', 'https://www.infobae.com/america/mexico/2026/10/04/x/', 'Infobae')], FEEDS_RUTAS);
  assert.deepEqual(r.notas.map(n => n.id), ['am']);
});

test('lineaRutasExcluidas: el formato de la carta, de mayor a menor; sin notas sacadas no dice nada', () => {
  const rep = (ruta, n) => Array.from({ length: n }, (_, k) => ({ id: ruta + k, ruta }));
  assert.equal(
    lineaRutasExcluidas([...rep('/mexico/', 38), ...rep('/espana/', 76), ...rep('/colombia/', 27), ...rep('/peru/', 72)]),
    'RUTAS EXCLUIDAS · 213 notas guardadas sacadas (/espana/ 76, /peru/ 72, /mexico/ 38, /colombia/ 27)');
  assert.equal(lineaRutasExcluidas(rep('/peru/', 1)), 'RUTAS EXCLUIDAS · 1 nota guardada sacada (/peru/ 1)');
  assert.equal(lineaRutasExcluidas([]), null);
});

test('--sin-excluir-rutas: solo vale junto con --sin-leer', () => {
  assert.throws(() => leerOpciones(['--sin-excluir-rutas'], reglas),
    e => e instanceof ErrorDeUso && e.message === '--sin-excluir-rutas solo vale junto con --sin-leer.');
  assert.throws(() => leerOpciones(['--acumular', 'datos/notas.json', '--sin-excluir-rutas'], reglas),
    e => e instanceof ErrorDeUso && e.message === '--sin-excluir-rutas solo vale junto con --sin-leer.');
  assert.equal(leerOpciones(['--acumular', 'datos/notas.json', '--sin-leer', '--sin-excluir-rutas'], reglas).sinExcluirRutas, true);
  assert.equal(leerOpciones(['--acumular', 'datos/notas.json', '--sin-leer'], reglas).sinExcluirRutas, false);
});
