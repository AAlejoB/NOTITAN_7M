'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const N = require('../src/nucleo.js');
const IA = require('../src/ia.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');

const AHORA = '2026-10-04T15:00:00.000Z';
const hace = h => new Date(Date.parse(AHORA) - h * 3600e3).toISOString();
const ctx = { portales, reglas, firmas: [], ahora: AHORA };

/* ───────── datos inventados ───────── */

const nota = (id, dom, titulo, cuando, extra = {}) => ({
  id, titulo, bajada: '', url: `https://www.${dom}/${id}`, portal: dom, seccion: '', fecha: cuando, firma: '', ...extra,
});

// Un hecho armado con la misma función que usa preparar: `doms` son los portales, uno por nota; la primera es la más vieja.
function hecho(id, doms, titulo, horas, extra = {}) {
  const notas = doms.map((d, i) => nota(`${id}-${i}`, d, Array.isArray(titulo) ? titulo[i % titulo.length] : titulo, new Date(Date.parse(hace(horas)) + i * 60e3).toISOString(), extra));
  return N.clasificarHecho({ id: 'g:' + id, primera: Date.parse(notas[0].fecha), notas }, ctx);
}

function preparadoDe(...armados) {
  const p = { candidatos: [], enObservacion: [], descartadas: [], avisos: [], resumen: { notasEntrada: 99, fueraDeVentana: 0, notasDescartadas: 0, hechos: armados.length, enObservacion: 0, elegiblesAMano: 0, candidatos: 0, viaB: 0 } };
  for (const r of armados) { if (r.tipo === 'candidato') p.candidatos.push(r.hecho); else if (r.tipo === 'observacion') p.enObservacion.push(r.hecho); else p.descartadas.push(r.descartada); }
  p.elegiblesAMano = p.enObservacion.filter(h => h.elegibleAMano);
  p.resumen.enObservacion = p.enObservacion.length;
  p.resumen.elegiblesAMano = p.elegiblesAMano.length;
  p.resumen.candidatos = p.candidatos.length;
  return p;
}
const ids = lista => lista.map(x => x.id);

const T_COLA = 'Fórmula 1: qué dijo Colapinto luego de finalizar 13° en el Gran Premio de Malasia';
const T_COLB = 'Una carrera loca que Franco Colapinto terminó con mucha dignidad en Sepang con el mejor Alpine';
const T_LULA3 = 'EN VIVO | Elecciones en Brasil: comienza el escrutinio y Lula habla con la prensa a las 19';
const T_CAND_LULA = 'Tras el cierre de los comicios, Lula Da Silva y Milei disputan voto a voto la presidencia';
const T_CAND_GARCIA = 'Mensaje de García Cuerva a Milei en la misa de Luján';
const SEIS_A = ['lanacion.com.ar', 'clarin.com', 'infobae.com', 'pagina12.com.ar', 'ambito.com', 'cronista.com'];
const SEIS_B = ['lanacion.com.ar', 'perfil.com', 'ambito.com', 'eldiarioar.com', 'pagina12.com.ar', 'cronista.com'];

/* ───────── I1 · palabras propias ───────── */

test('I1: palabrasPropias da exactamente las palabras de la carta, en ese orden', () => {
  assert.deepEqual(IA.palabrasPropias([T_LULA3]), ['brasil', 'lula']);
  assert.deepEqual(IA.palabrasPropias([T_COLA]), ['colapinto', 'gran', 'premio', 'malasia']);
});

test('I1b: palabrasPropias: la primera de cada frase no cuenta, ni las que abren con ¿ ¡ o comillas', () => {
  assert.deepEqual(IA.palabrasPropias(['Ahora: Milei habló con Lula']), ['lula'], 'Milei abre la frase después de los dos puntos');
  assert.deepEqual(IA.palabrasPropias(['Dijo Lula. Bolsonaro respondió']), ['lula'], 'después del punto');
  assert.deepEqual(IA.palabrasPropias(['¿Qué dijo Lula? ¿Y Bolsonaro?']), ['lula', 'bolsonaro'], '«Qué» y «Y» abren frase (empiezan con ¿); «Bolsonaro» es la segunda palabra de la pregunta');
  assert.deepEqual(IA.palabrasPropias(['¿Lula habló? Ahora Brasil espera']), ['brasil'], 'Lula abre la pregunta; «Ahora» abre después del «?»; Brasil no');
  assert.deepEqual(IA.palabrasPropias(['Dijo “Bolsonaro” ayer']), [], 'la que abre con comillas cuenta como primera');
  assert.deepEqual(IA.palabrasPropias(['Hoy | Lula | Brasil']), [], 'después de cada | abre una frase: ni Lula ni Brasil cuentan');
  assert.deepEqual(IA.palabrasPropias(['Titular — Lula y Brasil']), ['brasil'], 'Lula abre después de la raya, Brasil no');
});

test('I1c: palabrasPropias: STOP, menos de 3 letras, mayúsculas de servicio y sin repetir entre títulos', () => {
  assert.deepEqual(IA.palabrasPropias(['Habló ante El País']), ['pais'], '«El» es de STOP');
  assert.deepEqual(IA.palabrasPropias(['Habló Sobre Lula Entre Brasil']), ['lula', 'brasil'], '«Sobre» y «Entre» son de STOP aunque tengan 3 letras o más');
  assert.deepEqual(IA.palabrasPropias(['Habló Fe Ana']), ['ana'], '«Fe» tiene menos de 3 letras');
  assert.deepEqual(IA.palabrasPropias(['Nuevo VIDEO URGENTE de ONU y FOTOS en VIVO']), ['onu'], 'VIDEO, URGENTE, FOTOS y VIVO no; ONU sí');
  assert.deepEqual(IA.palabrasPropias(['Habló Lula en HOY', 'Sigue Lula con Brasil']), ['lula', 'brasil'], 'sin repetir y en el orden en que aparecen');
  assert.deepEqual(IA.palabrasPropias(['Habló EE.UU. y Perú']), ['ee.uu', 'peru'], '«y» abre frase después del punto de «EE.UU.»; Perú es la segunda');
  assert.deepEqual(IA.palabrasPropias(['Habló EE.UU. Perú respondió']), ['ee.uu'], 'si Perú viene justo después del punto, abre frase');
  assert.deepEqual(IA.palabrasPropias([]), []);
});

/* ───────── I2 · pares ───────── */

function cincoHechos() {
  return preparadoDe(
    hecho('colA', ['lagaceta.com.ar', 'lanacion.com.ar', 'clarin.com', 'pagina12.com.ar'], T_COLA, 8),
    hecho('colB', ['lacapital.com.ar', 'clarin.com', 'pagina12.com.ar', 'lanacion.com.ar'], T_COLB, 7),
    hecho('lula3', ['perfil.com', 'lagaceta.com.ar', 'noticiasargentinas.com'], T_LULA3, 5),
    hecho('candLula', SEIS_A, T_CAND_LULA, 6),
    hecho('candGarcia', SEIS_B, T_CAND_GARCIA, 6),
  );
}

test('I2: paresParaUnir saca 2 pares (Colapinto, y el de 3 con el candidato de Lula) y nunca junta dos candidatos', () => {
  const p = cincoHechos();
  assert.deepEqual([p.candidatos.length, p.enObservacion.length], [2, 3]);
  assert.deepEqual(p.enObservacion.map(h => h.gruposIndependientes), [4, 4, 3]);
  const pares = IA.paresParaUnir(p, { portales, reglas });
  assert.equal(pares.length, 2);
  assert.deepEqual(pares[0], { a: 'g:lula3', b: 'g:candLula', comunes: ['lula'], gruposUnion: 9 });
  assert.deepEqual(pares[1].a + ' ' + pares[1].b, 'g:colA g:colB');
  assert.deepEqual(pares[1].comunes, ['colapinto']);
  assert.equal(pares[1].gruposUnion, 5, 'Clarín, La Nación y Página/12 están en los dos y valen 1');
  assert.ok(!pares.some(x => [x.a, x.b].includes('g:candGarcia')), 'comparte «Milei» con el otro candidato y aun así no sale');
});

test('I2b: paresParaUnir respeta la ventana de 24 h, los grupos de 3 o 4, y que haya una palabra en común', () => {
  const ya = cincoHechos();
  // un candidato de hace 40 h (ya viejo) y un hecho fresco de hace 10 h: 30 h de diferencia
  const lejos = preparadoDe(
    hecho('colA', ['lagaceta.com.ar', 'lanacion.com.ar', 'clarin.com', 'pagina12.com.ar', 'perfil.com'], T_COLA, 40),
    hecho('colB', ['lacapital.com.ar', 'clarin.com', 'pagina12.com.ar', 'lanacion.com.ar'], T_COLB, 10));
  assert.equal(lejos.candidatos[0].viejo, true);
  assert.equal(IA.paresParaUnir(lejos, { portales, reglas: { ...reglas, ventanaMismoHechoHoras: 24 } }).length, 0, '30 h de diferencia: no');
  assert.equal(IA.paresParaUnir(lejos, { portales, reglas: { ...reglas, ventanaMismoHechoHoras: 31 } }).length, 1, 'con una ventana de 31 h, sí');
  assert.equal(IA.paresParaUnir(lejos, { portales, reglas: { ...reglas, ventanaMismoHechoHoras: 30 } }).length, 0, 'a menos de la ventana: justo 30 h no entra');
  const dos = preparadoDe(hecho('a', ['clarin.com', 'infobae.com'], 'Algo pasó con Lula', 3), hecho('b', ['lanacion.com.ar', 'perfil.com', 'ambito.com'], 'Otra cosa de Lula', 3));
  assert.equal(IA.paresParaUnir(dos, { portales, reglas }).length, 0, 'un hecho de 2 grupos no entra');
  const sinComun = preparadoDe(
    hecho('c', ['clarin.com', 'infobae.com', 'perfil.com'], 'Habló Lula en Brasil', 3),
    hecho('d', ['lanacion.com.ar', 'ambito.com', 'pagina12.com.ar'], 'Habló Milei en Roma', 3));
  assert.equal(IA.paresParaUnir(sinComun, { portales, reglas }).length, 0);
  assert.equal(ya.candidatos.length, 2);
});

/* ───────── I3 a I5 · unir ───────── */

test('I3: unirHechos con el caso Colapinto da 5 grupos y lo pasa a candidatos, con el id del hecho más viejo', () => {
  const p = cincoHechos();
  const antes = JSON.parse(JSON.stringify(p));
  const u = IA.unirHechos(p, [{ a: 'g:colA', b: 'g:colB', porQue: 'la misma carrera' }], { portales, reglas, ahora: AHORA });
  assert.deepEqual(p, antes, 'no toca lo que recibe');
  const unido = u.candidatos.find(c => c.id === 'g:colA');
  assert.ok(unido, 'el id es el de colA, el más viejo');
  assert.equal(unido.via, 'A');
  assert.equal(unido.gruposIndependientes, 5);
  assert.equal(unido.notas.length, 8);
  assert.deepEqual(unido.unidoPorIA, ['la misma carrera']);
  assert.equal(unido.titulo, T_COLA, 'el título es el de la primera nota');
  assert.deepEqual(u.enObservacion.map(h => h.id), ['g:lula3'], 'los dos salen de observación');
  assert.deepEqual(u.elegiblesAMano, [], 'y de las 4/5');
  assert.deepEqual(u.resumen, { ...p.resumen, hechos: 4, enObservacion: 1, elegiblesAMano: 0, candidatos: 3, viaB: 0 });
});

test('I3b: los grupos se vuelven a contar, no se suman (3 + 3 con 2 repetidos da 4, y queda a 1 medio)', () => {
  const p = preparadoDe(
    hecho('x', ['clarin.com', 'infobae.com', 'perfil.com'], 'Rescate de Ana en Salta', 5),
    hecho('y', ['clarin.com', 'infobae.com', 'ambito.com'], 'Rescataron a Ana en Salta', 4));
  const u = IA.unirHechos(p, [{ a: 'g:x', b: 'g:y', porQue: 'el mismo rescate' }], { portales, reglas, ahora: AHORA });
  assert.equal(u.candidatos.length, 0);
  assert.equal(u.enObservacion.length, 1);
  assert.equal(u.enObservacion[0].gruposIndependientes, 4);
  assert.equal(u.enObservacion[0].contador, '4/5');
  assert.equal(u.enObservacion[0].elegibleAMano, true, 'se clasifica con la misma función que preparar: queda para elegir a mano');
  assert.equal(u.elegiblesAMano.length, 1);
  assert.equal(u.resumen.hechos, 1);
});

test('I4: la unión de a tres (A con B y B con C) da un solo hecho', () => {
  const p = preparadoDe(
    hecho('a', ['lagaceta.com.ar', 'lanacion.com.ar', 'clarin.com'], 'Hecho A', 6),
    hecho('b', ['pagina12.com.ar', 'lacapital.com.ar', 'infobae.com'], 'Hecho B', 5),
    hecho('c', ['perfil.com', 'ambito.com', 'cronista.com'], 'Hecho C', 4),
    hecho('suelto', ['eldiarioar.com'], 'Otro hecho', 3));
  const u = IA.unirHechos(p, [{ a: 'g:a', b: 'g:b', porQue: 'uno' }, { a: 'g:b', b: 'g:c', porQue: 'dos' }], { portales, reglas, ahora: AHORA });
  assert.equal(u.candidatos.length, 1);
  assert.equal(u.candidatos[0].id, 'g:a');
  assert.equal(u.candidatos[0].notas.length, 9);
  assert.equal(u.candidatos[0].gruposIndependientes, 9);
  assert.deepEqual(u.candidatos[0].unidoPorIA, ['uno', 'dos']);
  assert.deepEqual(ids(u.enObservacion), ['g:suelto']);
  assert.equal(u.resumen.hechos, p.resumen.hechos - 2);
});

test('I5: unirHechos con el escrutinio y la confirmada deja un solo candidato, y el de 3 desaparece de observación', () => {
  const p = preparadoDe(
    hecho('lula3', ['perfil.com', 'lagaceta.com.ar', 'noticiasargentinas.com'], T_LULA3, 5),
    hecho('candLula', SEIS_A, T_CAND_LULA, 6));
  const u = IA.unirHechos(p, [{ a: 'g:lula3', b: 'g:candLula', porQue: 'el mismo escrutinio' }], { portales, reglas, ahora: AHORA });
  assert.deepEqual(ids(u.candidatos), ['g:candLula'], 'el id es el del hecho más viejo');
  assert.ok(u.candidatos[0].gruposIndependientes >= 6);
  assert.deepEqual(u.enObservacion, []);
  assert.equal(u.candidatos[0].notas.length, 9);
});

test('I5b: una cadena que juntaría dos candidatos: el hecho va solo con el de más grupos, y se avisa', () => {
  const c1 = hecho('c1', ['lanacion.com.ar', 'clarin.com', 'infobae.com', 'pagina12.com.ar', 'ambito.com', 'cronista.com', 'perfil.com'], 'Noticia confirmada uno', 6);
  const c2 = hecho('c2', SEIS_B, 'Noticia confirmada dos', 7);
  const h3 = hecho('h3', ['lagaceta.com.ar', 'lacapital.com.ar', 'eldiarioar.com'], 'Un hecho en el medio', 5);
  const p = preparadoDe(c2, h3, c1);
  const u = IA.unirHechos(p, [{ a: 'g:h3', b: 'g:c1', porQue: 'con uno' }, { a: 'g:h3', b: 'g:c2', porQue: 'con dos' }], { portales, reglas, ahora: AHORA });
  assert.deepEqual(ids(u.candidatos).sort(), ['g:c1', 'g:c2']);
  const con = u.candidatos.find(c => c.id === 'g:c1');
  assert.equal(con.notas.length, 7 + 3, 'el de 3 se unió al de 7 grupos');
  assert.deepEqual(con.unidoPorIA, ['con uno'], 'solo la unión que se usó');
  assert.equal(u.candidatos.find(c => c.id === 'g:c2').notas.length, 6, 'el otro candidato queda separado y sin tocar');
  assert.deepEqual(u.enObservacion, []);
  assert.deepEqual(u.avisos, ['La IA unió un hecho con dos noticias ya confirmadas: Noticia confirmada uno y Noticia confirmada dos. Se unió solo a la primera.']);
  // si empatan en grupos, gana el de primera más vieja
  const d1 = hecho('d1', SEIS_A, 'Empate nuevo', 4);
  const d2 = hecho('d2', SEIS_B, 'Empate viejo', 9);
  const e = IA.unirHechos(preparadoDe(d1, h3, d2), [{ a: 'g:h3', b: 'g:d1', porQue: 'x' }, { a: 'g:h3', b: 'g:d2', porQue: 'y' }], { portales, reglas, ahora: AHORA });
  assert.equal(e.candidatos.find(c => c.id === 'g:d2').notas.length, 6 + 3, 'se unió al más viejo');
  assert.match(e.avisos[0], /Empate viejo y Empate nuevo/);
});

test('unirHechos: si dos hechos comparten una nota, queda una sola vez en el unido', () => {
  const x = hecho('x', ['clarin.com', 'infobae.com', 'perfil.com'], 'Hecho X', 5).hecho;
  const y = hecho('y', ['lanacion.com.ar', 'ambito.com', 'pagina12.com.ar'], 'Hecho Y', 4).hecho;
  y.notas[0] = { ...x.notas[2] }; // la misma nota (mismo id) en los dos
  const u = IA.unirHechos({ ...preparadoDe(), candidatos: [], enObservacion: [x, y], resumen: { hechos: 2 } }, [{ a: 'g:x', b: 'g:y', porQue: 'z' }], { portales, reglas, ahora: AHORA });
  const unido = [...u.candidatos, ...u.enObservacion][0];
  assert.equal(unido.notas.length, 5);
  assert.equal(new Set(unido.notas.map(n => n.id)).size, 5);
});

test('unirHechos: sin uniones, con ids que no existen, o con dos candidatos juntos, no cambia nada', () => {
  const p = cincoHechos();
  const esperado = JSON.parse(JSON.stringify(p));
  for (const uniones of [[], undefined, [{ a: 'g:nada', b: 'g:colA', porQue: 'x' }], [{ a: 'g:colA', b: 'g:colA', porQue: 'x' }], [{ a: 'g:candLula', b: 'g:candGarcia', porQue: 'dos confirmadas' }]]) {
    const u = IA.unirHechos(p, uniones, { portales, reglas, ahora: AHORA });
    assert.deepEqual(JSON.parse(JSON.stringify(u)), esperado);
  }
});

test('unirHechos: un hecho viejo unido a uno fresco que no llega a 5 se descarta como cualquier hecho viejo', () => {
  const p = preparadoDe(
    hecho('viejo', ['clarin.com', 'infobae.com', 'perfil.com'], 'Algo de Ana', 30),
    hecho('nuevo', ['lanacion.com.ar', 'ambito.com'], 'Algo de Ana otra vez', 3));
  assert.equal(p.descartadas.length, 1, 'el viejo ya estaba descartado: no entra a los pares');
  const f1 = hecho('f1', ['clarin.com', 'infobae.com', 'perfil.com'], 'Algo de Ana', 4);
  const f2 = hecho('f2', ['clarin.com', 'infobae.com'], 'Algo de Ana otra vez', 3);
  const u = IA.unirHechos(preparadoDe(f1, f2), [{ a: 'g:f1', b: 'g:f2', porQue: 'x' }], { portales, reglas, ahora: AHORA });
  assert.equal(u.enObservacion.length, 1);
  assert.equal(u.enObservacion[0].contador, '3/5');
});

/* ───────── I6 y I7 · leer lo que contesta la IA ───────── */

test('I6: leerUnion acepta el JSON solo o dentro de ```json, y todo lo demás es null', () => {
  assert.deepEqual(IA.leerUnion('{"misma": true, "porque": "la misma carrera"}'), { misma: true, porQue: 'la misma carrera' });
  assert.deepEqual(IA.leerUnion('```json\n{"misma": true, "porque": "la misma carrera"}\n```'), { misma: true, porQue: 'la misma carrera' });
  assert.deepEqual(IA.leerUnion('```\n{"misma": false, "porque": "uno anuncia y el otro levanta"}\n```'), { misma: false, porQue: 'uno anuncia y el otro levanta' });
  assert.equal(IA.leerUnion('Sí, son la misma'), null);
  assert.equal(IA.leerUnion('{"misma": "si"}'), null);
  assert.equal(IA.leerUnion('{"misma": "true", "porque": "x"}'), null, 'true entre comillas es texto');
  assert.equal(IA.leerUnion('{"misma": 1, "porque": "x"}'), null);
  assert.equal(IA.leerUnion('{"misma": true}'), null, 'falta porque');
  assert.equal(IA.leerUnion('{"misma": true, "porque": 3}'), null);
  assert.equal(IA.leerUnion('[1, 2]'), null);
  assert.equal(IA.leerUnion('null'), null);
  assert.equal(IA.leerUnion(''), null);
  assert.equal(IA.leerUnion(undefined), null);
  assert.equal(IA.leerUnion('Acá va: {"misma": true, "porque": "x"}'), null, 'texto antes del JSON');
});

const JUICIO = { datoNuevo: true, fuenteConNombre: true, interesPublico: true, bloque: 'nacional', desmentido: false, seccion: 'economía', pais: '', porque: {} };

test('I7: leerJuicio devuelve el objeto, pasa el bloque a minúsculas y da null si falta algo', () => {
  assert.deepEqual(IA.leerJuicio(JSON.stringify(JUICIO)), { datoNuevo: true, fuenteConNombre: true, interesPublico: true, bloque: 'nacional', desmentido: false, seccion: 'economía', pais: '', porQue: {} });
  assert.equal(IA.leerJuicio(JSON.stringify({ ...JUICIO, bloque: 'Nacional' })).bloque, 'nacional');
  assert.equal(IA.leerJuicio(JSON.stringify({ ...JUICIO, bloque: 'INTERNACIONAL' })).bloque, 'internacional');
  assert.equal(IA.leerJuicio(JSON.stringify({ ...JUICIO, bloque: null })).bloque, null);
  const { desmentido, ...sinDesmentido } = JUICIO;
  assert.equal(IA.leerJuicio(JSON.stringify(sinDesmentido)), null);
  assert.equal(IA.leerJuicio('```json\n' + JSON.stringify(JUICIO) + '\n```').seccion, 'economía');
});

test('I7b: leerJuicio: sí/no que no son true o false, bloque inválido, texto que no es texto o porque que no es un objeto dan null', () => {
  for (const malo of [{ datoNuevo: 'true' }, { fuenteConNombre: 1 }, { interesPublico: null }, { desmentido: 'no' }, { bloque: 'regional' }, { bloque: 3 }, { seccion: 5 }, { pais: null }, { porque: 'nada' }, { porque: null }, { porque: [] }]) {
    assert.equal(IA.leerJuicio(JSON.stringify({ ...JUICIO, ...malo })), null, JSON.stringify(malo));
  }
  const { bloque, ...sinBloque } = JUICIO;
  assert.equal(IA.leerJuicio(JSON.stringify(sinBloque)), null, 'sin la clave bloque no es null: falta');
  const { porque, ...sinPorque } = JUICIO;
  assert.deepEqual(IA.leerJuicio(JSON.stringify(sinPorque)).porQue, {}, 'sin porque vale {}');
  assert.equal(IA.leerJuicio('no sé'), null);
  assert.equal(IA.leerJuicio(JSON.stringify({ ...JUICIO, porque: { interesPublico: 'es un chimento' } })).porQue.interesPublico, 'es un chimento');
});

/* ───────── I8 · las preguntas ───────── */

test('I8: preguntaJuicio dice lo de los deportes y la farándula según la config, y «ninguna» sin desmentidos', () => {
  const h = hecho('q', ['clarin.com', 'infobae.com', 'perfil.com'], 'Algo de Ana', 3).hecho;
  const con = IA.preguntaJuicio(h, { portales, reglas: { ...reglas, ia: { ...reglas.ia, deportes: true, farandula: false } } });
  assert.ok(con.includes('Los deportes cuentan como interés público.'));
  assert.ok(con.includes('La farándula no cuenta.'));
  assert.ok(!con.includes('Los deportes no cuentan'));
  const sin = IA.preguntaJuicio(h, { portales, reglas: { ...reglas, ia: { ...reglas.ia, deportes: false, farandula: true } }, desmentidos: [] });
  assert.ok(sin.includes('Los deportes no cuentan como interés público.'));
  assert.ok(sin.includes('La farándula también cuenta.'));
  assert.ok(con.includes('últimas 48 horas: ninguna. Si nada lo desmiente, false.'));
});

test('I8b: preguntaJuicio trae el hecho al final, una línea por nota, con el medio y la hora de Argentina; y los desmentidos con el mismo formato', () => {
  const h = hecho('q', ['tn.com.ar', 'clarin.com', 'infobae.com'], 'Algo de Ana', 3).hecho;
  h.notas[0].fecha = '2026-10-04T15:30:00.000Z';
  h.notas[0].bajada = 'Con la bajada del medio.';
  const desm = [{ id: 'd1', titulo: 'El Gobierno desmintió que Ana renuncie', bajada: '', portal: 'ole.com.ar', url: 'https://www.ole.com.ar/d1', fecha: '2026-10-04T03:05:00.000Z' }];
  const q = IA.preguntaJuicio(h, { portales, reglas, desmentidos: desm });
  const lineas = q.split('\n');
  assert.equal(lineas[lineas.indexOf('Hecho:') + 1], '- TN · 04/10 12:30 · Algo de Ana · Con la bajada del medio.');
  assert.match(lineas[lineas.indexOf('Hecho:') + 2], /^- Clarín · 04\/10 \d\d:\d\d · Algo de Ana$/, 'sin bajada, termina en el título');
  assert.ok(q.includes('últimas 48 horas:\n- Olé · 04/10 00:05 · El Gobierno desmintió que Ana renuncie\nSi nada lo desmiente, false.'));
  assert.ok(q.startsWith('Sos el editor que revisa noticias para 7M. Te paso un hecho:'));
  assert.ok(q.includes('4. bloque: "nacional" si el hecho pasó en Argentina'));
  assert.ok(q.includes('un argentino que juega, viaja o habla afuera va a "internacional".'));
});

test('I8c: preguntaUnion trae la definición de Alejo, los dos ejemplos y los dos hechos al final', () => {
  const p = cincoHechos();
  const q = IA.preguntaUnion({ a: 'g:colA', b: 'g:colB' }, p, { portales });
  assert.ok(q.startsWith('Sos el editor que revisa noticias para 7M. Te paso dos hechos, cada uno con las notas de distintos medios que lo cuentan. ¿Son la misma noticia?\n\nSon la misma noticia si cuentan el mismo hecho: la misma gente, lo mismo que pasó, el mismo día. No alcanza con que sean del mismo tema.\n'));
  assert.ok(q.includes('«Aprobaron el Presupuesto» y «Qué cambia con el Presupuesto aprobado» son la misma noticia. «Anuncian un paro de colectivos para el jueves» y «Se levantó el paro de colectivos» no lo son: anunciar no es levantar.'));
  assert.ok(q.includes('{"misma": true o false, "porque": "una línea"}'));
  const a = q.indexOf('Hecho A:\n');
  const b = q.indexOf('\nHecho B:\n');
  assert.ok(a > 0 && b > a);
  assert.equal(q.slice(a, b).split('\n').length, 1 + 4, 'Hecho A: y 4 notas');
  assert.equal(q.slice(b).split('\n').filter(l => l.startsWith('- ')).length, 4);
  assert.ok(q.slice(a, b).includes(T_COLA));
  assert.ok(q.slice(b).includes(T_COLB));
  assert.ok(!q.endsWith('\n'));
  assert.throws(() => IA.preguntaUnion({ a: 'g:colA', b: 'g:nada' }, p, { portales }), /g:nada/);
});

test('los ejemplos de la pregunta de unión no son los de los casos de prueba (si no, la prueba no mediría nada)', () => {
  const q = IA.preguntaUnion({ a: 'g:colA', b: 'g:colB' }, cincoHechos(), { portales });
  const casos = require('./casos-ia.json');
  const ejemplos = q.split('\n').find(l => l.startsWith('Ejemplos:'));
  for (const c of casos.union) { assert.ok(!ejemplos.includes(c.a), c.a); assert.ok(!ejemplos.includes(c.b), c.b); }
});

/* ───────── I9 · posibles desmentidos ───────── */

test('I9: posiblesDesmentidos saca la nota que desmiente y comparte una palabra propia, y no la que es de otro tema', () => {
  const h = hecho('aguinaldo', ['clarin.com', 'infobae.com', 'perfil.com'], 'El Gobierno elimina el aguinaldo', 6).hecho;
  const notas = [
    nota('d1', 'ambito.com', 'El Gobierno desmintió que vaya a eliminar el aguinaldo', hace(2)),
    nota('d2', 'lanacion.com.ar', 'Desmienten un caso de dengue en Salta', hace(1)),
    nota('n3', 'clarin.com', 'El Gobierno anunció el aguinaldo de octubre', hace(1)),
  ];
  const r = IA.posiblesDesmentidos(h, notas, { reglas });
  assert.deepEqual(ids(r), ['d1']);
});

test('I9b: posiblesDesmentidos: palabra entera, sin repetir, las más nuevas primero y hasta maxDesmentidos', () => {
  const h = hecho('x', ['clarin.com', 'infobae.com', 'perfil.com'], 'Habló Lula en Brasil', 6).hecho;
  const notas = [];
  for (let i = 0; i < 8; i++) notas.push(nota('n' + i, 'ambito.com', 'Es falso que Lula haya hablado en Brasil', hace(10 - i)));
  notas.push({ ...notas[3] }); // repetida
  notas.push(nota('adentro', 'ambito.com', 'Los desmintieronazos de Lula en Brasil', hace(0)));
  notas.push(nota('fake', 'ambito.com', 'Un fake de Lula en Brasil', hace(0.5)));
  const r = IA.posiblesDesmentidos(h, notas, { reglas });
  assert.equal(r.length, reglas.ia.maxDesmentidos);
  assert.equal(r[0].id, 'fake', 'la más nueva primero');
  assert.ok(!ids(r).includes('adentro'), '«desmintieron» adentro de otra palabra no cuenta');
  assert.equal(new Set(ids(r)).size, r.length, 'sin repetir');
  const todas = IA.posiblesDesmentidos(h, notas, { reglas: { ...reglas, ia: { ...reglas.ia, maxDesmentidos: 20 } } });
  assert.equal(todas.length, 9, '8 + «fake»; la repetida no cuenta dos veces y «desmintieronazos» no cuenta');
  assert.equal(new Set(ids(todas)).size, 9);
  const solo2 = IA.posiblesDesmentidos(h, notas, { reglas: { ...reglas, ia: { ...reglas.ia, maxDesmentidos: 2 } } });
  assert.deepEqual(ids(solo2), ['fake', 'n7']);
  assert.deepEqual(IA.posiblesDesmentidos(h, [], { reglas }), []);
});

/* ───────── I10 · lo ya juzgado ───────── */

test('I10: buscarGuardado lo encuentra por una url compartida, y hayQueVolverAPreguntar mira los desmentidos nuevos', () => {
  const h = hecho('j', ['clarin.com', 'infobae.com', 'perfil.com'], 'Algo de Ana', 3).hecho;
  const guardados = [
    { urls: ['https://www.otra.com/x'], juicio: {}, fecha: AHORA, desmentidosVistos: [] },
    { urls: ['https://www.lanacion.com.ar/otra', h.notas[1].url], juicio: { bloque: 'nacional' }, fecha: AHORA, desmentidosVistos: ['https://www.ambito.com/d1'] },
  ];
  assert.equal(IA.buscarGuardado(h, guardados), guardados[1]);
  assert.equal(IA.buscarGuardado(h, [guardados[0]]), null);
  assert.equal(IA.buscarGuardado(h, []), null);
  assert.equal(IA.buscarGuardado(h, undefined), null);
  const nuevoDesmentido = { url: 'https://www.perfil.com/desmiente' };
  assert.equal(IA.hayQueVolverAPreguntar(h, guardados[1], [nuevoDesmentido]), true, 'un desmentido nuevo');
  assert.equal(IA.hayQueVolverAPreguntar(h, guardados[1], [{ url: 'https://www.ambito.com/d1' }]), false, 'el mismo que ya se había visto');
  assert.equal(IA.hayQueVolverAPreguntar(h, guardados[1], []), false, 'sin desmentidos nuevos');
  assert.equal(IA.hayQueVolverAPreguntar(h, null, []), true, 'si no hay guardado, hay que preguntar');
  assert.equal(IA.hayQueVolverAPreguntar(h, guardados[1], ['https://www.perfil.com/desmiente']), true, 'también acepta urls sueltas');
});

/* ───────── la config y los casos ───────── */

test('config/reglas.json: la sección ia trae deportes sí, farándula no, las palabras de desmentido sin tildes y un tope', () => {
  assert.equal(reglas.ia.deportes, true);
  assert.equal(reglas.ia.farandula, false);
  assert.equal(reglas.ia.maxDesmentidos, 5);
  for (const p of reglas.ia.palabrasDesmentido) assert.equal(p, N.normalizar(p), p);
});

test('test/casos-ia.json: casos de unión (con misma true o false) y de bloque, con títulos completos', () => {
  const casos = require('./casos-ia.json');
  assert.equal(casos.union.length, 4);
  for (const c of casos.union) { assert.equal(typeof c.misma, 'boolean'); assert.ok(c.a && c.b); assert.ok(!c.a.endsWith('…') && !c.b.endsWith('…'), 'títulos completos'); }
  assert.equal(casos.union.filter(c => c.inventado).length, 1);
  assert.equal(casos.union[1].misma, false, 'escrutinio + Milei: no (decidió Alejo: el mismo hecho, no el mismo tema)');
  for (const c of casos.bloque) assert.ok(['nacional', 'internacional'].includes(c.bloque));
});
