'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { anilloDe, tambienNacional, decidirZona } = require('../src/zona.js');
const reglasBase = require('../config/reglas.json');
const reglasZona = require('../config/zona/reglas.json');
const { portales } = require('../config/zona/portales.json');

// La zona se corre con config/reglas.json pisado por config/zona/reglas.json (como cargarConfig de scripts/vuelta.js).
const reglas = { ...reglasBase, ...reglasZona };
const AHORA = '2026-10-16T15:00:00.000Z';
const DOMINIO = {
  comodorense: 'elcomodorense.net', patagonico: 'elpatagonico.com', cronica: 'diariocronica.com.ar',
  adnsur: 'adnsur.com.ar', chubut: 'elchubut.com.ar', clarin: 'clarin.com', nada: 'portal-que-no-esta.com',
};

// Una nota como las de un hecho de preparar(): con portal (dominio), url y fecha.
let cuenta = 0;
const nota = (medio, titulo, fecha = '2026-10-16T12:00:00.000Z') => {
  cuenta++;
  return { id: `${medio}-${cuenta}`, titulo, bajada: '', url: `https://www.${DOMINIO[medio]}/nota-${cuenta}`, portal: DOMINIO[medio], seccion: '', fecha, firma: '' };
};
const hecho = (notas, { grupos = new Set(notas.map(n => n.portal)).size, primera = notas[0].fecha, viejo = false } = {}) =>
  ({ id: 'g:' + notas[0].id, titulo: notas[0].titulo, bajada: '', primera, gruposIndependientes: grupos, notas, via: 'A', viejo });
const preparado = candidatos => ({ candidatos, enObservacion: [], elegiblesAMano: [], descartadas: [], avisos: [] });

test('E1 · local: dos medios de Comodoro → Comodoro, «Confirmada por 2 medios locales»', () => {
  const h = hecho([
    nota('comodorense', 'Comodoro, la ciudad con la canasta básica más cara de la Patagonia…'),
    nota('patagonico', 'Comodoro tiene la canasta básica más cara de la Patagonia'),
  ]);
  assert.equal(anilloDe(h, { portales, reglas }), 'local');
  const z = decidirZona(preparado([h]), { portales, reglas });
  assert.equal(z.bloques.local.noticias.length, 1);
  assert.equal(z.bloques.local.noticias[0].etiqueta, 'Confirmada por 2 medios locales');
  assert.equal(z.bloques.local.noticias[0].bloque, 'local');
  assert.equal(z.bloques.chubut.noticias.length, 0);
  assert.deepEqual(z.confirmados[0], { id: h.id, anillo: 'local', grupos: 2, medios: ['El Comodorense', 'El Patagónico'], titulo: h.titulo, tambienNacional: false, viejo: false });
});

test('E2 · chubut: uno de Comodoro y uno provincial → Chubut, «Confirmada por 2 medios de Chubut»', () => {
  const h = hecho([
    nota('cronica', 'Violento asalto a una familia en una chacra de Gaiman'),
    nota('chubut', 'Violento asalto comando en una chacra de Gaiman'),
  ]);
  assert.equal(anilloDe(h, { portales, reglas }), 'chubut');
  const z = decidirZona(preparado([h]), { portales, reglas });
  assert.equal(z.bloques.local.noticias.length, 0);
  assert.equal(z.bloques.chubut.noticias[0].etiqueta, 'Confirmada por 2 medios de Chubut');
  assert.equal(z.bloques.chubut.noticias[0].bloque, 'chubut');
});

test('E3 · cumple en los dos anillos → va al más chico (Comodoro), «Confirmada por 3 medios locales»', () => {
  const h = hecho([
    nota('chubut', 'Comienza el Campeonato Provincial de handball'),
    nota('cronica', 'Comienza el provincial de juveniles'),
    nota('comodorense', 'Comodoro recibe al Provincial Juvenil de Handball'),
  ]);
  assert.equal(anilloDe(h, { portales, reglas }), 'local');
  const z = decidirZona(preparado([h]), { portales, reglas });
  assert.equal(z.bloques.local.noticias[0].etiqueta, 'Confirmada por 3 medios locales');
  assert.equal(z.bloques.chubut.noticias.length, 0);
});

test('E4 · también nacional: se une con un hecho nacional de 8 grupos y no sale en la zona; sin nacionales, va a Comodoro', () => {
  const h = hecho([
    nota('cronica', 'El riesgo país supera los 600 puntos tras una jornada de volatilidad global'),
    nota('comodorense', 'El riesgo país subió y volvió a superar los 600 puntos en medio de la incertidumbre global'),
  ]);
  const nacional = hecho([nota('clarin', 'El riesgo país se encuentra al alza y vuelve a superar los 600 puntos')], { grupos: 8 });
  assert.deepEqual(tambienNacional(h, [nacional], { reglas }), { si: true, grupos: 8 });
  const z = decidirZona(preparado([h]), { portales, reglas, hechosNacionales: [nacional] });
  assert.equal(z.bloques.local.noticias.length, 0);
  assert.equal(z.bloques.chubut.noticias.length, 0);
  assert.deepEqual(z.descartadas.map(d => d.motivo), ['tambien_nacional (8 medios nacionales)']);
  assert.equal(z.confirmados[0].tambienNacional, true);
  assert.equal(z.confirmados[0].anillo, 'local', 'el anillo se anota aunque no se muestre');

  assert.deepEqual(tambienNacional(h, [], { reglas }), { si: false, grupos: 0 });
  const sin = decidirZona(preparado([h]), { portales, reglas, hechosNacionales: [] });
  assert.equal(sin.bloques.local.noticias.length, 1);
});

test('E4 · un hecho nacional con menos de cruce.minGruposNacionales grupos no cuenta', () => {
  const h = hecho([
    nota('cronica', 'El riesgo país supera los 600 puntos tras una jornada de volatilidad global'),
    nota('comodorense', 'El riesgo país subió y volvió a superar los 600 puntos en medio de la incertidumbre global'),
  ]);
  const nacional = hecho([nota('clarin', 'El riesgo país se encuentra al alza y vuelve a superar los 600 puntos')], { grupos: 2 });
  assert.deepEqual(tambienNacional(h, [nacional], { reglas }), { si: false, grupos: 0 });
});

test('E5 · cupo: de cinco locales frescos (2, 2, 3, 2 y 4 grupos) entran el de 4, el de 3 y el de 2 más nuevo', () => {
  const de = (n, hora, titulo) => {
    const medios = ['comodorense', 'patagonico', 'cronica', 'adnsur'].slice(0, n);
    const fecha = `2026-10-16T${hora}:00:00.000Z`;
    return hecho(medios.map(m => nota(m, titulo, fecha)), { primera: fecha });
  };
  const hechos = [de(2, '08', 'Uno'), de(2, '11', 'Dos más nuevo'), de(3, '09', 'Tres'), de(2, '10', 'Cuatro'), de(4, '07', 'Cinco')];
  const z = decidirZona(preparado(hechos), { portales, reglas });
  assert.deepEqual(z.bloques.local.noticias.map(n => n.titulo), ['Cinco', 'Tres', 'Dos más nuevo']);
  assert.equal(z.bloques.local.afueraPorTope, 2);
  assert.equal(z.bloques.local.tope, 3);
  assert.equal(z.bloques.local.minimo, 1);
  assert.deepEqual(z.descartadas.map(d => d.motivo), ['cupo', 'cupo']);
  assert.equal(z.confirmados.length, 5);
});

test('E6 · sin anillo: dos portales que no están en la zona → null y descartada sin_anillo', () => {
  const h = hecho([nota('nada', 'Algo que pasó'), nota('clarin', 'Algo que pasó')]);
  assert.equal(anilloDe(h, { portales, reglas }), null);
  const z = decidirZona(preparado([h]), { portales, reglas });
  assert.deepEqual(z.descartadas.map(d => d.motivo), ['sin_anillo']);
  assert.equal(z.confirmados[0].anillo, null);
});

test('un hecho viejo se descarta por el criterio 2 y queda anotado en confirmados', () => {
  const h = hecho([nota('comodorense', 'Viejo'), nota('patagonico', 'Viejo')], { viejo: true });
  const z = decidirZona(preparado([h]), { portales, reglas });
  assert.deepEqual(z.descartadas.map(d => d.motivo), ['no_fresco (criterio 2)']);
  assert.equal(z.confirmados[0].viejo, true);
  assert.equal(z.bloques.local.noticias.length, 0);
});

test('los bloques salen en el orden de reglas.anillos, con la forma de decidir()', () => {
  const h = hecho([nota('comodorense', 'Algo'), nota('patagonico', 'Algo')]);
  const z = decidirZona(preparado([h]), { portales, reglas });
  assert.deepEqual(Object.keys(z.bloques), ['local', 'chubut']);
  assert.deepEqual(Object.keys(z.bloques.local), ['nombre', 'tope', 'noticias', 'aMano', 'afueraPorTope', 'minimo']);
  assert.equal(z.bloques.local.nombre, 'Comodoro');
  assert.equal(z.bloques.chubut.nombre, 'Chubut');
  const s = z.bloques.local.noticias[0];
  assert.deepEqual(Object.keys(s), ['id', 'titulo', 'bajada', 'bloque', 'seccion', 'pais', 'via', 'etiqueta', 'gruposIndependientes', 'links']);
  assert.deepEqual(s.links.map(l => l.portal), ['elcomodorense.net', 'elpatagonico.com']);
});

test('sin anillos en las reglas: bloques vacíos y todo descartado sin_anillo', () => {
  const h = hecho([nota('comodorense', 'Algo'), nota('patagonico', 'Algo')]);
  const z = decidirZona(preparado([h]), { portales, reglas: { ...reglas, anillos: [] } });
  assert.deepEqual(z.bloques, {});
  assert.deepEqual(z.descartadas.map(d => d.motivo), ['sin_anillo']);
});

test('con preparar(): dos notas reales de Comodoro llegan a candidato con minGrupos 2 y van a Comodoro', () => {
  const { preparar } = require('../src/nucleo.js');
  const notas = [
    { id: 'a', titulo: 'Comodoro tiene la canasta básica más cara de la Patagonia', url: 'https://www.elpatagonico.com/a', fecha: '2026-10-16T12:00:00.000Z' },
    { id: 'b', titulo: 'Comodoro, la ciudad con la canasta básica más cara de la Patagonia', url: 'https://www.elcomodorense.net/b', fecha: '2026-10-16T12:30:00.000Z' },
  ];
  const p = preparar(notas, { portales, reglas, ahora: AHORA });
  assert.equal(p.candidatos.length, 1);
  const z = decidirZona(p, { portales, reglas });
  assert.equal(z.bloques.local.noticias.length, 1);
});
