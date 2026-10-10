'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { diaYCorteDe, porDiaYCorte, resumir, feedsCaidos, leerVueltas, informe, leerOpciones } = require('../scripts/medir.js');
const { ErrorDeUso } = require('../scripts/leer.js');

// La hora de Argentina es UTC−3: 10:05 de Argentina = 13:05Z.
const hora = (hhmm, dia = '2026-10-09') => `${dia}T${String(Number(hhmm.slice(0, 2)) + 3).padStart(2, '0')}:${hhmm.slice(3)}:00.000Z`;
const vuelta = (hhmm, extra = {}) => ({ hora: hora(hhmm), feeds: { ok: 19, mal: 0, caidos: [] }, confirmados: [], cuatroDeCinco: [], ...extra });
const conf = (id, bloque, via = 'A') => ({ id, bloque, grupos: 5, via, viejo: false, titulo: id });
const cuatro = (id, bloque, conFirma) => ({ id, bloque, grupos: 4, conFirma, titulo: id });

test('E8: dos vueltas del mismo corte con el mismo hecho: cuenta 1', () => {
  const vs = [vuelta('10:05', { confirmados: [conf('a', 'nacional')] }), vuelta('10:35', { confirmados: [conf('a', 'nacional')] })];
  const cortes = porDiaYCorte(vs)['2026-10-09'];
  assert.deepEqual(Object.keys(cortes), ['08-12']);
  assert.deepEqual(resumir(cortes['08-12']).confirmados, { nacional: 1, internacional: 0 });
  assert.equal(resumir(cortes['08-12']).vueltas, 2);
});

test('E9: el mismo hecho en dos cortes cuenta 1 en cada uno y 1 en el día entero', () => {
  const vs = [vuelta('11:50', { confirmados: [conf('a', 'nacional')] }), vuelta('12:10', { confirmados: [conf('a', 'nacional')] })];
  const cortes = porDiaYCorte(vs)['2026-10-09'];
  assert.deepEqual(resumir(cortes['08-12']).confirmados, { nacional: 1, internacional: 0 });
  assert.deepEqual(resumir(cortes['12-16']).confirmados, { nacional: 1, internacional: 0 });
  assert.deepEqual(resumir(vs).confirmados, { nacional: 1, internacional: 0 });
});

test('E10: las 23:30 de Argentina son del día 9, corte 20-24', () => {
  assert.deepEqual(diaYCorteDe('2026-10-10T02:30:00.000Z'), { dia: '2026-10-09', corte: '20-24' });
});

test('los límites de los cortes: 00:00, 03:59, 04:00 y 23:59 de Argentina', () => {
  assert.deepEqual(diaYCorteDe('2026-10-09T03:00:00.000Z'), { dia: '2026-10-09', corte: '00-04' });
  assert.deepEqual(diaYCorteDe('2026-10-09T06:59:00.000Z'), { dia: '2026-10-09', corte: '00-04' });
  assert.deepEqual(diaYCorteDe('2026-10-09T07:00:00.000Z'), { dia: '2026-10-09', corte: '04-08' });
  assert.deepEqual(diaYCorteDe('2026-10-10T02:59:00.000Z'), { dia: '2026-10-09', corte: '20-24' });
});

test('E11: el mismo hecho cambia de bloque dentro del corte: vale el de su última vuelta', () => {
  const vs = [vuelta('10:05', { confirmados: [conf('a', 'nacional')] }), vuelta('10:35', { confirmados: [conf('a', 'internacional')] })];
  assert.deepEqual(resumir(vs).confirmados, { nacional: 0, internacional: 1 });
  assert.deepEqual(resumir([vs[1], vs[0]]).confirmados, { nacional: 0, internacional: 1 }, 'no importa en qué orden vengan');
});

test('una 4/5 con firma va a conFirma y una sin firma a sinFirma; la vía B se cuenta aparte', () => {
  const r = resumir([vuelta('10:05', {
    cuatroDeCinco: [cuatro('x', 'nacional', true), cuatro('y', 'internacional', false), cuatro('z', 'internacional', false)],
    confirmados: [conf('b', 'internacional', 'B'), conf('c', 'nacional')],
  })]);
  assert.deepEqual(r.conFirma, { nacional: 1, internacional: 0 });
  assert.deepEqual(r.sinFirma, { nacional: 0, internacional: 2 });
  assert.deepEqual(r.viaB, { nacional: 0, internacional: 1 });
  assert.deepEqual(r.confirmados, { nacional: 1, internacional: 1 });
});

test('feeds caídos: cuántas vueltas cada uno, y las vueltas sin ningún feed', () => {
  const vs = [
    vuelta('10:05', { feeds: { ok: 17, mal: 2, caidos: ['LN+', 'Reuters'] } }),
    vuelta('10:35', { feeds: { ok: 18, mal: 1, caidos: ['Reuters'] } }),
    vuelta('11:05', { feeds: { ok: 0, mal: 19, caidos: ['Reuters'] } }),
  ];
  assert.deepEqual(feedsCaidos(vs), { caidos: [['Reuters', 3], ['LN+', 1]], sinNingunFeed: 1 });
});

test('un archivo que no existe o está vacío no rompe: no hay vueltas', () => {
  const dir = mkdtempSync(join(tmpdir(), 'notitan-medir-'));
  assert.deepEqual(leerVueltas(join(dir, 'vueltas.jsonl')), []);
  writeFileSync(join(dir, 'vueltas.jsonl'), '\n');
  assert.deepEqual(leerVueltas(join(dir, 'vueltas.jsonl')), []);
  assert.deepEqual(informe([]), ['Todavía no hay vueltas.']);
});

test('un renglón roto corta con un mensaje que dice cuál es', () => {
  const dir = mkdtempSync(join(tmpdir(), 'notitan-medir-'));
  writeFileSync(join(dir, 'vueltas.jsonl'), JSON.stringify(vuelta('10:05')) + '\n{roto\n');
  assert.throws(() => leerVueltas(join(dir, 'vueltas.jsonl')), e => e instanceof ErrorDeUso && /renglón 2/.test(e.message));
});

test('el informe trae una fila por corte, la del día entero, y se puede pedir un día', () => {
  const vs = [
    vuelta('11:50', { confirmados: [conf('a', 'nacional')] }),
    vuelta('12:10', { confirmados: [conf('a', 'nacional'), conf('b', 'internacional')] }),
    { ...vuelta('10:00'), hora: '2026-10-10T13:00:00.000Z' },
  ];
  const texto = informe(vs, { dia: '2026-10-09' }).join('\n');
  assert.match(texto, /^DÍA 2026-10-09 · 2 vueltas/);
  assert.match(texto, /08-12 +1 +1 \/ 0/);
  assert.match(texto, /12-16 +1 +2 \/ 0|12-16 +1 +1 \/ 1/);
  assert.match(texto, /Día entero \(distintos\) +2 +1 \/ 1/);
  assert.doesNotMatch(texto, /2026-10-10/);
  assert.match(texto, /Vueltas sin ningún feed: 0/);
  assert.deepEqual(informe(vs, { dia: '2026-01-01' }), ['No hay vueltas del día 2026-01-01.']);
  assert.match(informe(vs).join('\n'), /DÍA 2026-10-10/);
});

test('opciones: --dia tiene que ser una fecha', () => {
  assert.deepEqual(leerOpciones([]), { carpeta: 'datos', dia: null });
  assert.deepEqual(leerOpciones(['--dia', '2026-10-09', '--carpeta', 'x']), { carpeta: 'x', dia: '2026-10-09' });
  assert.throws(() => leerOpciones(['--dia', 'hoy']), ErrorDeUso);
  assert.throws(() => leerOpciones(['--dia']), ErrorDeUso);
});
