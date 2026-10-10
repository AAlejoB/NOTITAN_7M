'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { pareceInternacional, bloqueProvisorio, juiciosProvisorios } = require('../src/provisorio.js');
const N = require('../src/nucleo.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const dia = require('../ejemplos/dia-de-ejemplo.js');

const ctx = { portales, reglas };
const nota = (portal, seccion) => ({ portal, url: `https://www.${portal}/x`, seccion });
// Un hecho con `parecen` notas de bbc.com y el resto de clarin.com con sección de política.
const hecho = (total, parecen) => ({
  id: 'h', notas: Array.from({ length: total }, (_, i) => nota(i < parecen ? 'bbc.com' : 'clarin.com', 'politica')),
});

test('E1: parece internacional por el portal, por la sección, o no', () => {
  assert.equal(pareceInternacional(nota('bbc.com', 'politica'), ctx), true);
  assert.equal(pareceInternacional(nota('clarin.com', 'mundo'), ctx), true);
  assert.equal(pareceInternacional(nota('clarin.com', 'politica'), ctx), false);
});

test('la sección se compara en minúsculas y sin espacios en las puntas; una nota leída con url también sirve', () => {
  assert.equal(pareceInternacional({ url: 'https://www.clarin.com/a', seccion: '  Mundo ' }, ctx), true);
  assert.equal(pareceInternacional({ url: 'https://www.bbc.com/a' }, ctx), true);
  assert.equal(pareceInternacional({ url: 'https://www.clarin.com/a' }, ctx), false);
});

test('E2: la mitad o más de las notas internacionales da bloque internacional', () => {
  assert.equal(bloqueProvisorio(hecho(4, 2), ctx), 'internacional');
  assert.equal(bloqueProvisorio(hecho(4, 1), ctx), 'nacional');
  assert.equal(bloqueProvisorio(hecho(5, 3), ctx), 'internacional');
  assert.equal(bloqueProvisorio(hecho(5, 2), ctx), 'nacional');
});

const prep = () => {
  const c = { portales, reglas, firmas: dia.firmas, ahora: dia.ahora };
  return { c, p: N.preparar(dia.notas, c) };
};

test('E3: con el día de ejemplo hay un juicio por candidato y por elegible a mano, y decidir no descarta por sin_juicio', () => {
  const { c, p } = prep();
  const juicios = juiciosProvisorios(p, ctx);
  assert.equal(Object.keys(juicios).length, p.candidatos.length + p.elegiblesAMano.length);
  const d = N.decidir(p.candidatos, juicios, { reglas, elegiblesAMano: p.elegiblesAMano });
  assert.equal(d.descartadas.filter(x => x.motivo === 'sin_juicio').length, 0);
  assert.equal(d.avisos.some(a => /sin juicio/.test(a)), false);
});

test('cada juicio tiene exactamente las 8 claves con los valores fijos', () => {
  const { p } = prep();
  const juicios = juiciosProvisorios(p, ctx);
  const ids = Object.keys(juicios);
  assert.ok(ids.length > 0);
  for (const id of ids) {
    const j = juicios[id];
    assert.deepEqual(Object.keys(j).sort(), ['bloque', 'datoNuevo', 'desmentido', 'fuenteConNombre', 'interesPublico', 'pais', 'provisorio', 'seccion']);
    assert.deepEqual({ ...j, bloque: undefined }, { datoNuevo: false, fuenteConNombre: true, interesPublico: true, desmentido: false, bloque: undefined, seccion: '', pais: '', provisorio: true });
    assert.ok(['nacional', 'internacional'].includes(j.bloque), id);
  }
});

test('los hechos en observación que no son elegibles a mano no llevan juicio', () => {
  const { p } = prep();
  const juicios = juiciosProvisorios(p, ctx);
  const noElegibles = p.enObservacion.filter(o => !o.elegibleAMano);
  assert.ok(noElegibles.length > 0, 'el día de ejemplo tiene hechos en observación que no son elegibles');
  for (const o of noElegibles) assert.equal(o.id in juicios, false, o.id);
});

test('un candidato viejo se cae con no_fresco (criterio 2) y uno fresco no', () => {
  const { p } = prep();
  const juicios = juiciosProvisorios(p, ctx);
  const [a, b] = p.candidatos;
  const viejo = { ...a, viejo: true };
  const fresco = { ...b, viejo: false };
  const d = N.decidir([viejo, fresco], juicios, { reglas });
  const baja = d.descartadas.find(x => x.id === viejo.id);
  assert.equal(baja.motivo, 'no_fresco (criterio 2)');
  assert.equal(d.descartadas.some(x => x.id === fresco.id), false);
  assert.equal([...d.nacionales, ...d.internacionales].some(x => x.id === fresco.id), true);
});
