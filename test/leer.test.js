'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { cargarNotas, guardarNotas, lineaAcumulado, fechaCorta, leerOpciones, ErrorDeUso } = require('../scripts/leer.js');
const reglas = require('../config/reglas.json');

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
  const o = leerOpciones(['--umbral', '0.3', '--acumular', 'datos/notas.json', '--sin-leer'], reglas);
  assert.equal(o.reglas.umbralSimilitud, 0.3);
  assert.equal(reglas.umbralSimilitud, 0.5, 'config/reglas.json no se toca');
  assert.equal(o.archivoAcum, 'datos/notas.json');
  assert.equal(o.sinLeer, true);
  const vacio = leerOpciones([], reglas);
  assert.deepEqual([vacio.archivoAcum, vacio.sinLeer, vacio.salidaJson], [null, false, null]);
  assert.equal(vacio.reglas.umbralSimilitud, reglas.umbralSimilitud);
});
