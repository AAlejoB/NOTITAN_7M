'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const N = require('../src/nucleo.js');
const reglas = require('../config/reglas.json');
const { portales } = require('../config/portales.json');
const dia = require('../ejemplos/dia-de-ejemplo.js');

const AHORA = '2026-10-04T11:00:00.000Z';
const ctx = { portales, reglas, ahora: AHORA };
const hace = h => new Date(Date.parse(AHORA) - h * 3600e3).toISOString();
const nota = (id, portal, titulo, extra = {}) => ({
  id, portal, titulo, url: `https://www.${portal}/actualidad/${id}`, fecha: hace(2), ...extra,
});
const ids = lista => lista.map(x => x.id);

/* ───────── misma noticia ───────── */

test('misma noticia: el mismo hecho se junta y otro hecho del mismo tema no', () => {
  const notas = [
    nota('a', 'clarin.com', 'Diputados aprobó el Presupuesto'),
    nota('b', 'infobae.com', 'Diputados empezó a debatir el Presupuesto'),
    nota('c', 'perfil.com', 'Aprobaron el Presupuesto'),
    nota('d', 'ambito.com', 'Qué cambia con el Presupuesto aprobado'),
  ];
  const grupos = N.agrupar(notas, reglas).map(g => g.notas.map(n => n.id));
  assert.deepEqual(grupos, [['a', 'c', 'd'], ['b']]);
});

test('misma noticia: no junta notas que salieron con más de 24 h de diferencia', () => {
  const notas = [
    nota('a', 'clarin.com', 'Paro general de la CGT paraliza el transporte', { fecha: hace(40) }),
    nota('b', 'infobae.com', 'Paro general de la CGT paraliza el transporte', { fecha: hace(2) }),
  ];
  assert.equal(N.agrupar(notas, reglas).length, 2);
});

// Limitación conocida del agrupado por palabras: no entiende sinónimos ni idiomas.
// Se resuelve con embeddings o una IA que confirme los grupos dudosos.
test('misma noticia: sinónimos ("naftas" = "combustibles")', { todo: 'hace falta embeddings o IA' }, () => {
  const g = N.agrupar([
    nota('a', 'clarin.com', 'Suben las naftas 5%'),
    nota('b', 'infobae.com', 'YPF aumentó los combustibles'),
  ], reglas);
  assert.equal(g.length, 1);
});

/* ───────── verificación: se cuenta por grupo ───────── */

test('verificación: Clarín, TN, Olé y La Voz valen 1', () => {
  const v = N.gruposIndependientes([
    nota('1', 'clarin.com', 'x'), nota('2', 'tn.com.ar', 'x'), nota('3', 'ole.com.ar', 'x'),
    nota('4', 'lavoz.com.ar', 'x'), nota('5', 'lanacion.com.ar', 'x'),
  ], portales);
  assert.equal(v.cantidad, 2);
});

test('verificación: un cable copiado en 4 medios vale 1, y es para la agencia', () => {
  const v = N.gruposIndependientes([
    nota('1', 'clarin.com', 'x', { bajada: 'Cuerpo de la nota (EFE)' }),
    nota('2', 'infobae.com', 'x', { bajada: 'Cuerpo de la nota (EFE)' }),
    nota('3', 'perfil.com', 'x', { bajada: 'Cuerpo de la nota (EFE)' }),
    nota('4', 'ambito.com', 'x', { bajada: 'Cuerpo de la nota (EFE)' }),
    nota('5', 'efe.com', 'x'),
  ], portales);
  assert.equal(v.cantidad, 1);
  assert.deepEqual(v.claves, ['efe']);
});

test('verificación: fuentes primarias, chequeadores y portales fuera de lista no suman', () => {
  const v = N.gruposIndependientes([
    nota('1', 'boletinoficial.gob.ar', 'x'), nota('2', 'chequeado.com', 'x'), nota('3', 'miblog.blogspot.com', 'x'),
  ], portales);
  assert.equal(v.cantidad, 0);
  assert.equal(v.ignoradas.length, 3);
});

test('verificación: acepta subdominios y www', () => {
  assert.equal(N.gruposIndependientes([nota('1', 'm.clarin.com', 'x'), { id: '2', url: 'https://www.infobae.com/a', titulo: 'x', fecha: hace(1) }], portales).cantidad, 2);
});

/* ───────── criterio 1 ───────── */

test('criterio 1: columnas, dólar de hoy y contenido patrocinado quedan afuera', () => {
  const r = reglas.criterio1;
  assert.equal(N.esInformativa({ titulo: 'Diputados aprobó el Presupuesto', url: 'https://x.com/politica/a' }, r).ok, true);
  assert.equal(N.esInformativa({ titulo: 'Por qué el Presupuesto es un salto al vacío', url: 'https://x.com/opinion/a' }, r).ok, false);
  assert.equal(N.esInformativa({ titulo: 'Dólar blue hoy: a cuánto cotiza este martes', url: 'https://x.com/economia/a' }, r).ok, false);
  assert.equal(N.esInformativa({ titulo: 'La billetera X lanza reintegros', url: 'https://x.com/economia/a', etiqueta: 'Contenido de marca' }, r).ok, false);
});

test('criterio 1: las columnas no cuentan para llegar a 5', () => {
  const notas = [
    nota('1', 'clarin.com', 'Incendio en planta de Zárate: evacuaron trabajadores'),
    nota('2', 'infobae.com', 'Incendio en planta de Zárate: evacuaron a trabajadores'),
    nota('3', 'perfil.com', 'Incendio en planta de Zárate: evacuaron trabajadores'),
    nota('4', 'ambito.com', 'Incendio en planta de Zárate: evacuaron trabajadores', { url: 'https://www.ambito.com/opinion/4' }),
    nota('5', 'cronista.com', 'Incendio en planta de Zárate: evacuaron trabajadores', { url: 'https://www.cronista.com/opinion/5' }),
  ];
  const p = N.preparar(notas, ctx);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contador, '3/5');
  assert.equal(p.descartadas.filter(d => d.tipo === 'nota').length, 2);
});

test('criterio 1: notas de servicio con plantilla (horario de partido, efemérides, lotería) quedan afuera con su motivo', () => {
  const r = reglas.criterio1;
  const casos = [
    ['A qué hora juegan Talleres vs. Belgrano y cómo ver hoy EN VIVO el Torneo Clausura', 'nota_de_servicio (horario de partido)'],
    ['Efemérides de hoy: qué pasó un 3 de octubre', 'nota_de_servicio (efemérides)'],
    ['Boca vs. River: a qué hora juega el Superclásico y cómo verlo', 'nota_de_servicio (horario de partido)'],
    ['Efemérides del 4 de octubre: qué pasó un día como hoy', 'nota_de_servicio (efemérides)'],
    ['Resultados de la Lotería del Cauca del 3 de octubre', 'nota_de_servicio (resultados de lotería)'],
    ['Lotería de Medellín: resultados y números ganadores del sorteo', 'nota_de_servicio (resultados de lotería)'],
  ];
  for (const [titulo, motivo] of casos) {
    const e = N.esInformativa({ titulo, url: 'https://x.com/deportes/a' }, r);
    assert.equal(e.ok, false, titulo);
    assert.equal(e.motivo, motivo, titulo);
  }
});

test('criterio 1: los moldes de servicio no se llevan noticias de verdad', () => {
  const r = reglas.criterio1;
  const titulos = [
    'Talleres le ganó 2 a 1 a Belgrano en el clásico',
    'Detienen a dos funcionarios de la Lotería por fraude',
    'A qué hora votan en Brasil y cuándo se conocen los resultados',
    'Polémica por las efemérides que el Gobierno sacó del calendario escolar',
    'Resultado de la auditoría en la Lotería de la Ciudad: hallaron irregularidades',
    'Quini 6: resultados del sorteo del domingo',
    'Polémica por los resultados de la Lotería de la Ciudad',
    'Escándalo en la Lotería de Santa Fe: los resultados del sorteo fueron anulados',
  ];
  for (const titulo of titulos) {
    assert.equal(N.esInformativa({ titulo, url: 'https://x.com/politica/a' }, r).ok, true, titulo);
  }
});

test('criterio 1: sin notasDeServicio en la config, todo queda como antes', () => {
  const { notasDeServicio, ...sinMoldes } = reglas.criterio1;
  assert.equal(notasDeServicio.length, 3);
  const e = N.esInformativa({ titulo: 'A qué hora juegan Talleres vs. Belgrano', url: 'https://x.com/deportes/a' }, sinMoldes);
  assert.equal(e.ok, true);
});

test('criterio 1: una nota de servicio no cuenta para verificar y queda en descartadas con su motivo', () => {
  const notas = cinco5Servicio();
  const p = N.preparar(notas, ctx);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion.length, 0);
  assert.equal(p.resumen.notasDescartadas, 5);
  assert.deepEqual([...new Set(p.descartadas.map(d => d.motivo))], ['nota_de_servicio (efemérides)']);
});

function cinco5Servicio() {
  return ['clarin.com', 'lanacion.com.ar', 'infobae.com', 'perfil.com', 'ambito.com']
    .map((portal, i) => nota(`s${i}`, portal, 'Efemérides de hoy: qué pasó un 4 de octubre'));
}

/* ───────── preparar ───────── */

const cinco =['clarin.com', 'lanacion.com.ar', 'infobae.com', 'perfil.com', 'ambito.com'];

test('preparar: con 5 grupos el hecho pasa a candidato', () => {
  const p = N.preparar(cinco.map((d, i) => nota('n' + i, d, 'Paro general de la CGT paraliza el transporte')), ctx);
  assert.equal(p.candidatos.length, 1);
  assert.equal(p.candidatos[0].gruposIndependientes, 5);
});

test('preparar: con menos de 5 va a En observación con su contador, y no se baja el umbral', () => {
  const p = N.preparar(cinco.slice(0, 4).map((d, i) => nota('n' + i, d, 'Paro general de la CGT paraliza el transporte')), ctx);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contador, '4/5');
});

test('preparar: si pasaron más de 24 h y no llegó a 5, se descarta', () => {
  const p = N.preparar(cinco.slice(0, 3).map((d, i) => nota('n' + i, d, 'Paro general de la CGT paraliza el transporte', { fecha: hace(30) })), ctx);
  assert.equal(p.enObservacion.length, 0);
  assert.match(p.descartadas[0].motivo, /no_llego_a_5/);
});

test('preparar: lo que salió hace más de 48 h ni se mira', () => {
  const p = N.preparar([nota('v', 'clarin.com', 'Algo viejo', { fecha: hace(60) })], ctx);
  assert.equal(p.resumen.fueraDeVentana, 1);
  assert.equal(p.resumen.hechos, 0);
});

test('preparar: avisa si un portal no mandó ninguna nota (feed roto)', () => {
  const p = N.preparar([nota('1', 'clarin.com', 'Algo')], ctx);
  assert.match(p.avisos[0], /infobae\.com/);
  assert.doesNotMatch(p.avisos[0], /clarin\.com/);
  assert.doesNotMatch(p.avisos[0], /boletinoficial/);
});

/* ───────── decidir ───────── */

const cand = (id, extra = {}) => ({
  id, titulo: id, bajada: '', primera: hace(3), gruposIndependientes: 5, viejo: false,
  notas: [{ id: id + '-1', titulo: id, url: `https://www.clarin.com/${id}`, portal: 'clarin.com' }], ...extra,
});
const J = (o = {}) => ({ datoNuevo: true, fuenteConNombre: true, interesPublico: true, desmentido: false, bloque: 'nacional', impacto: 1, seccion: '', pais: '', ...o });

test('decidir: cada criterio que falla deja su motivo', () => {
  const cs = ['viejo', 'sinfuente', 'farandula', 'afuera', 'desmentida', 'ok'].map(id => cand(id, { viejo: id === 'viejo' }));
  const r = N.decidir(cs, {
    viejo: J({ datoNuevo: false }), sinfuente: J({ fuenteConNombre: false }), farandula: J({ interesPublico: false }),
    afuera: J({ bloque: null }), desmentida: J({ desmentido: true }), ok: J(),
  }, ctx);
  const motivo = id => r.descartadas.find(d => d.id === id).motivo;
  assert.match(motivo('viejo'), /criterio 2/);
  assert.match(motivo('sinfuente'), /criterio 3/);
  assert.match(motivo('farandula'), /criterio 4/);
  assert.match(motivo('afuera'), /criterio 5/);
  assert.match(motivo('desmentida'), /criterio 6/);
  assert.deepEqual(ids(r.nacionales), ['ok']);
});

test('decidir: un hecho viejo entra si la IA ve un dato nuevo', () => {
  const r = N.decidir([cand('a', { viejo: true })], { a: J({ datoNuevo: true }) }, ctx);
  assert.deepEqual(ids(r.nacionales), ['a']);
});

test('decidir: orden por impacto, después más grupos, después más reciente', () => {
  const r = N.decidir([
    cand('baja', { primera: hace(1) }),
    cand('media-reciente', { primera: hace(2) }),
    cand('media-vieja', { primera: hace(9) }),
    cand('media-con-mas-grupos', { primera: hace(9), gruposIndependientes: 8 }),
    cand('alta', { primera: hace(20) }),
  ], {
    baja: J({ impacto: 1 }), 'media-reciente': J({ impacto: 2 }), 'media-vieja': J({ impacto: 2 }),
    'media-con-mas-grupos': J({ impacto: 2 }), alta: J({ impacto: 3 }),
  }, ctx);
  assert.deepEqual(ids(r.nacionales), ['alta', 'media-con-mas-grupos', 'media-reciente', 'media-vieja', 'baja']);
});

test('decidir: tope de 3 por sección; la cuarta de economía va a Reserva', () => {
  const cs = ['e1', 'e2', 'e3', 'e4'].map(id => cand(id));
  const r = N.decidir(cs, { e1: J({ seccion: 'economía', impacto: 3 }), e2: J({ seccion: 'economía', impacto: 2 }), e3: J({ seccion: 'economía', impacto: 2 }), e4: J({ seccion: 'economía', impacto: 1 }) }, ctx);
  assert.deepEqual(ids(r.nacionales), ['e1', 'e2', 'e3']);
  assert.deepEqual(r.reserva.map(x => [x.id, x.motivo]), [['e4', 'tope_seccion (economía)']]);
});

test('decidir: en INTERNACIONAL, máximo 2 del mismo país', () => {
  const cs = ['us1', 'us2', 'us3', 'br'].map(id => cand(id));
  const j = { bloque: 'internacional' };
  const r = N.decidir(cs, { us1: J({ ...j, pais: 'EEUU', impacto: 3 }), us2: J({ ...j, pais: 'EEUU', impacto: 2 }), us3: J({ ...j, pais: 'EEUU', impacto: 1 }), br: J({ ...j, pais: 'Brasil', impacto: 1, seccion: 'x' }) }, ctx);
  assert.deepEqual(ids(r.internacionales).sort(), ['br', 'us1', 'us2']);
  assert.equal(r.reserva[0].id, 'us3');
});

test('decidir: el cupo es 7 por bloque; el resto va a Reserva', () => {
  const cs = Array.from({ length: 9 }, (_, i) => cand('n' + i));
  const js = Object.fromEntries(cs.map((c, i) => [c.id, J({ impacto: 1 + (i % 3), seccion: 's' + i })]));
  const r = N.decidir(cs, js, ctx);
  assert.equal(r.nacionales.length, 7);
  assert.equal(r.reserva.length, 2);
  assert.ok(r.reserva.every(x => x.motivo === 'cupo'));
  assert.equal(r.aviso, 'Hoy: 7 nacionales, 0 internacionales');
});

test('decidir: el 7 es un tope, no una cuota: no se rellena ni se pasa de un bloque al otro', () => {
  const r = N.decidir([cand('a'), cand('b', { id: 'b' })], { a: J(), b: J({ bloque: 'internacional' }) }, ctx);
  assert.equal(r.nacionales.length, 1);
  assert.equal(r.internacionales.length, 1);
  assert.equal(r.aviso, 'Hoy: 1 nacional, 1 internacional');
});

test('decidir: sin aviso cuando se llenan las dos listas de 7', () => {
  const cs = [];
  const js = {};
  for (let i = 0; i < 7; i++) {
    cs.push(cand('n' + i), cand('i' + i));
    js['n' + i] = J({ seccion: 's' + i });
    js['i' + i] = J({ bloque: 'internacional', seccion: 's' + i, pais: 'p' + i });
  }
  const r = N.decidir(cs, js, ctx);
  assert.equal(r.nacionales.length, 7);
  assert.equal(r.internacionales.length, 7);
  assert.equal(r.aviso, null);
});

test('decidir: un desmentido sale y sube el siguiente de la Reserva', () => {
  const cs = ['e1', 'e2', 'e3', 'e4'].map(id => cand(id));
  const e = o => J({ seccion: 'economía', ...o });
  const r = N.decidir(cs, { e1: e({ impacto: 3, desmentido: true }), e2: e({ impacto: 2 }), e3: e({ impacto: 2 }), e4: e({ impacto: 1 }) }, ctx);
  assert.deepEqual(ids(r.nacionales), ['e2', 'e3', 'e4']);
  assert.equal(r.reserva.length, 0);
  assert.match(r.descartadas[0].motivo, /desmentido/);
});

test('decidir: si la IA no devolvió juicio, el hecho no entra y se avisa', () => {
  const r = N.decidir([cand('a'), cand('b')], { a: J() }, ctx);
  assert.deepEqual(ids(r.nacionales), ['a']);
  assert.equal(r.descartadas[0].motivo, 'sin_juicio');
  assert.match(r.avisos[0], /sin juicio/);
});

/* ───────── vía B: firma reconocida ───────── */

// Nombres inventados. La lista real la arma Alejo en config/firmas.json.
const FIRMAS = [
  { nombre: 'Autora Ficticia Uno', ambitos: ['nacional', 'internacional'] },
  { nombre: 'Autor Ficticio Dos', alias: ['A. Ficticio Dos'], ambitos: ['internacional'] },
  { nombre: 'Autor Ficticio Tres' },
];
const ctxB = { ...ctx, firmas: FIRMAS };
const conViaB = cambios => ({ ...ctxB, reglas: { ...reglas, viaB: { ...reglas.viaB, ...cambios } } });
const ctxMin2 = conViaB({ minFirmas: 2 });
const TRATADO = 'Se filtró el texto de un tratado reservado entre dos países europeos';
const hechoB = (firmas, portalesLista = ['bbc.com', 'theguardian.com', 'elpais.com'], extra = {}) =>
  portalesLista.map((d, i) => nota('b' + i, d, TRATADO, { firma: firmas[i], ...extra }));

test('vía B: 3 grupos + 2 firmas reconocidas distintas pasan a candidato, con su etiqueta', () => {
  const p = N.preparar(hechoB(['Por Autora Ficticia Uno', 'AUTOR FICTICIO DOS', undefined]), ctxB);
  assert.equal(p.candidatos.length, 1);
  assert.equal(p.candidatos[0].via, 'B');
  assert.equal(p.candidatos[0].gruposIndependientes, 3);
  assert.equal(p.enObservacion.length, 0);
  const d = N.decidir(p.candidatos, { 'g:b0': J({ bloque: 'internacional' }) }, ctxB);
  assert.equal(d.internacionales[0].via, 'B');
  assert.equal(d.internacionales[0].etiqueta, 'Respaldada por Autora Ficticia Uno y Autor Ficticio Dos');
});

test('vía B: con la regla elegida por Alejo, una sola firma reconocida alcanza', () => {
  const p = N.preparar(hechoB(['Autora Ficticia Uno', undefined, undefined]), ctxB);
  assert.equal(p.candidatos.length, 1);
  assert.equal(p.candidatos[0].via, 'B');
  const d = N.decidir(p.candidatos, { 'g:b0': J({ bloque: 'internacional' }) }, ctxB);
  assert.equal(d.internacionales[0].etiqueta, 'Respaldada por Autora Ficticia Uno');
});

test('vía B: si se sube el mínimo a 2, una sola firma no alcanza y queda En observación con su contador', () => {
  const p = N.preparar(hechoB(['Autora Ficticia Uno', undefined, undefined]), ctxMin2);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contador, '3/5');
  assert.equal(p.enObservacion[0].contadorFirmas, '1/2');
});

test('vía B: el mismo autor en dos portales vale 1, y el alias cuenta como la misma persona', () => {
  const dos = N.preparar(hechoB(['Autora Ficticia Uno', 'Autora Ficticia Uno', undefined]), ctxMin2);
  assert.equal(dos.candidatos.length, 0, 'con mínimo 2, un autor repetido no llega');
  assert.equal(N.preparar(hechoB(['Autora Ficticia Uno', 'Autora Ficticia Uno', undefined]), ctxB).candidatos[0].firmasReconocidas.length, 1);
  const alias = N.preparar(hechoB(['Autor Ficticio Dos', 'A. Ficticio Dos', 'Autor Ficticio Tres']), ctxB);
  assert.equal(alias.candidatos[0].firmasReconocidas.length, 2, 'Dos (por nombre y por alias) + Tres');
});

test('vía B: una columna de opinión de un autor reconocido no suma (criterio 1)', () => {
  const notas = hechoB(['Autora Ficticia Uno', undefined, undefined]);
  notas[0].url = 'https://www.bbc.com/opinion/b0';
  const p = N.preparar(notas, ctxB);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contador, '2/5', 'la columna ni cuenta como nota del hecho');
  assert.equal(p.enObservacion[0].firmasReconocidas.length, 0);
});

test('vía B: una firma suma solo si salió en un portal que cuenta', () => {
  const p = N.preparar(hechoB(['Autora Ficticia Uno', 'Autor Ficticio Dos', undefined], ['chequeado.com', 'blog-personal.com', 'elpais.com']), ctxB);
  assert.equal(p.candidatos.length, 0, 'Chequeado (no suma) y un sitio fuera de lista no habilitan firmas');
  assert.equal(p.enObservacion[0].firmasReconocidas.length, 0);
});

test('vía B: si ya hay 5 grupos entra por la vía A, y las firmas quedan como dato extra', () => {
  const notas = cinco.map((d, i) => nota('v' + i, d, TRATADO, { firma: i < 2 ? ['Autora Ficticia Uno', 'Autor Ficticio Dos'][i] : undefined }));
  const p = N.preparar(notas, ctxB);
  assert.equal(p.candidatos[0].via, 'A');
  assert.equal(p.candidatos[0].firmasReconocidas.length, 2);
  const d = N.decidir(p.candidatos, { 'g:v0': J() }, ctxB);
  assert.equal(d.nacionales[0].etiqueta, 'Confirmada por 5 medios');
});

test('vía B: sin lista de firmas, o con la vía apagada, todo queda como antes', () => {
  const notas = hechoB(['Autora Ficticia Uno', 'Autor Ficticio Dos', undefined]);
  assert.equal(N.preparar(notas, ctx).candidatos.length, 0, 'sin lista');
  const apagada = { ...ctxB, reglas: { ...reglas, viaB: { activa: false } } };
  assert.equal(N.preparar(notas, apagada).candidatos.length, 0, 'con activa:false');
});

const candB = (id, nombres, extra = {}) => cand(id, {
  via: 'B', gruposIndependientes: 3, firmasReconocidas: nombres.map(nombre => ({ nombre })), ...extra,
});

test('decidir: la vía B va después de la A aunque tenga más impacto, y se queda afuera si no hay cupo', () => {
  const cs = [candB('b', ['X', 'Y']), cand('a')];
  const js = { b: J({ impacto: 3 }), a: J({ impacto: 1 }) };
  assert.deepEqual(ids(N.decidir(cs, js, ctx).nacionales), ['a', 'b']);
  const justo = N.decidir(cs, js, { reglas: { ...reglas, cupoPorBloque: 1 } });
  assert.deepEqual(ids(justo.nacionales), ['a']);
  assert.equal(justo.reserva[0].motivo, 'cupo');
});

test('decidir: la vía B sigue pasando por los criterios 3 a 6', () => {
  const cs = [candB('sinfuente', ['X', 'Y']), candB('desmentida', ['X', 'Y']), candB('ok', ['X', 'Y'])];
  const r = N.decidir(cs, { sinfuente: J({ fuenteConNombre: false }), desmentida: J({ desmentido: true }), ok: J() }, ctx);
  assert.deepEqual(ids(r.nacionales), ['ok']);
  assert.deepEqual(r.descartadas.map(d => d.motivo).sort(), ['desmentido (criterio 6)', 'sin_fuente_con_nombre (criterio 3)']);
});

test('decidir: una firma habilitada solo para internacional no respalda una nacional', () => {
  const soloInt = cand('n', { via: 'B', gruposIndependientes: 2, firmasReconocidas: [{ nombre: 'Dos', ambitos: ['internacional'] }] });
  const nac = N.decidir([soloInt], { n: J({ bloque: 'nacional' }) }, ctx);
  assert.equal(nac.nacionales.length, 0);
  assert.match(nac.descartadas[0].motivo, /firmas_no_habilitadas_para_nacional/);
  assert.equal(N.decidir([soloInt], { n: J({ bloque: 'internacional' }) }, ctx).internacionales.length, 1);
  const mixto = cand('m', { via: 'B', gruposIndependientes: 2, firmasReconocidas: [
    { nombre: 'Uno', ambitos: ['nacional', 'internacional'] }, { nombre: 'Dos', ambitos: ['internacional'] }] });
  const r = N.decidir([mixto], { m: J({ bloque: 'nacional' }) }, ctx);
  assert.equal(r.nacionales[0].etiqueta, 'Respaldada por Uno', 'solo se nombra a quien está habilitado para el bloque');
});

test('decidir: la etiqueta de la vía B nombra hasta 2 autores y cuenta el resto', () => {
  const tres = [candB('t', ['A', 'B', 'C'])];
  assert.equal(N.decidir(tres, { t: J() }, ctx).nacionales[0].etiqueta, 'Respaldada por A y B (y 1 más)');
  const sinTope = { reglas: { ...reglas, viaB: { ...reglas.viaB, maxFirmasEnEtiqueta: undefined } } };
  assert.equal(N.decidir(tres, { t: J() }, sinTope).nacionales[0].etiqueta, 'Respaldada por A, B y C');
  assert.equal(N.decidir([candB('u', ['A', 'B'])], { u: J() }, ctx).nacionales[0].etiqueta, 'Respaldada por A y B');
});

/* ───────── cuántas noticias: se elige entre 3 y 7 ───────── */

const nueve = prefijo => Array.from({ length: 9 }, (_, k) => cand(prefijo + k));
const juiciosDe = (prefijo, o = {}) => Object.fromEntries(Array.from({ length: 9 }, (_, k) => [prefijo + k, J({ seccion: 's' + k, pais: 'p' + k, ...o })]));
const lleno = { ...juiciosDe('n'), ...juiciosDe('i', { bloque: 'internacional' }) };
const candidatos9 = [...nueve('n'), ...nueve('i')];

test('cupo: sin elegir valen 7 por bloque; eligiendo 3, entran 3 y el resto va a Reserva', () => {
  const sin = N.decidir(candidatos9, lleno, ctx);
  assert.equal(sin.nacionales.length, 7);
  assert.deepEqual(sin.cupo, { nacional: 7, internacional: 7 });
  const tres = N.decidir(candidatos9, lleno, { ...ctx, cupo: 3 });
  assert.equal(tres.nacionales.length, 3);
  assert.equal(tres.internacionales.length, 3);
  assert.equal(tres.reserva.filter(x => x.motivo === 'cupo').length, 12, '6 nacionales + 6 internacionales');
});

test('cupo: se puede elegir distinto para cada bloque', () => {
  const r = N.decidir(candidatos9, lleno, { ...ctx, cupo: { nacional: 3, internacional: 5 } });
  assert.equal(r.nacionales.length, 3);
  assert.equal(r.internacionales.length, 5);
});

test('cupo: lo que se sale del rango 3 a 7 se acomoda y se avisa; un texto numérico del formulario sirve', () => {
  const alto = N.decidir(candidatos9, lleno, { ...ctx, cupo: 10 });
  assert.equal(alto.nacionales.length, 7);
  assert.match(alto.avisos[0], /Se pidieron 10 nacionales; se usaron 7/);
  const bajo = N.decidir(candidatos9, lleno, { ...ctx, cupo: 1 });
  assert.equal(bajo.nacionales.length, 3, 'el mínimo que se puede elegir es 3');
  assert.equal(N.decidir(candidatos9, lleno, { ...ctx, cupo: '5' }).nacionales.length, 5);
  assert.equal(N.decidir(candidatos9, lleno, { ...ctx, cupo: '' }).nacionales.length, 7);
  assert.equal(N.decidir(candidatos9, lleno, { ...ctx, cupo: null }).nacionales.length, 7);
});

test('cupo: si no se llega al mínimo de 3, se avisa y no se baja el estándar para completar', () => {
  const r = N.decidir([cand('a'), cand('b'), cand('c', { id: 'c' })], { a: J(), b: J(), c: J({ bloque: 'internacional' }) }, ctx);
  assert.equal(r.nacionales.length, 2);
  assert.ok(r.avisos.some(a => /Nacionales: solo 2 pasaron los filtros \(el mínimo es 3\)/.test(a)));
  assert.ok(r.avisos.some(a => /Internacionales: solo 1/.test(a)));
});

test('vía B: si se pone tope, la segunda página muestra como máximo esa cantidad por bloque', () => {
  const conTope = { reglas: { ...reglas, viaB: { ...reglas.viaB, maxNoticiasPorBloque: 2 } } };
  const cs = [candB('b1', ['X', 'Y']), candB('b2', ['X', 'Y']), candB('b3', ['X', 'Y']), candB('bi', ['X', 'Y'])];
  const js = { b1: J({ impacto: 3 }), b2: J({ impacto: 2 }), b3: J({ impacto: 1 }), bi: J({ bloque: 'internacional' }) };
  const r = N.decidir(cs, js, conTope);
  assert.deepEqual(ids(r.nacionales), ['b1', 'b2']);
  assert.equal(r.reserva.find(x => x.id === 'b3').motivo, 'tope_via_B');
  assert.deepEqual(ids(r.internacionales), ['bi'], 'el tope es por bloque');
  assert.equal(N.decidir(cs, js, ctx).nacionales.length, 3, 'sin tope (lo elegido por Alejo) entran las tres');
});

test('vía B: la segunda página solo ocupa lo que la primera deja libre', () => {
  const cs = [cand('a1'), cand('a2'), cand('a3'), candB('b1', ['X', 'Y']), candB('b2', ['X', 'Y'])];
  const js = { a1: J({ seccion: 'x' }), a2: J({ seccion: 'y' }), a3: J({ seccion: 'z' }), b1: J({ impacto: 3 }), b2: J({ impacto: 3 }) };
  const r = N.decidir(cs, js, { ...ctx, cupo: 4 });
  assert.deepEqual(ids(r.nacionales), ['a1', 'a2', 'a3', 'b1']);
  assert.equal(r.reserva[0].motivo, 'cupo');
});

/* ───────── acumular lecturas ───────── */

const AHORA_ACUM = '2026-10-04T18:00:00.000Z';
const ctxAcum = { reglas, ahora: AHORA_ACUM };
const horaUTC = h => `2026-10-04T${h}:00.000Z`;
const guardada = (id, fecha, titulo = id) => ({ id, fecha, titulo, portal: 'clarin.com', url: `https://www.clarin.com/${id}` });
const haceAcum = h => new Date(Date.parse(AHORA_ACUM) - h * 3600e3).toISOString();
const copia = x => JSON.parse(JSON.stringify(x));

test('acumular: lo que ya estaba queda con la versión nueva, y se cuentan agregadas y repetidas', () => {
  const guardadas = [guardada('a', horaUTC('10:00'), 'Uno'), guardada('b', horaUTC('09:00'), 'Dos')];
  const nuevas = [guardada('b', horaUTC('09:00'), 'Dos actualizado'), guardada('c', horaUTC('11:00'))];
  const r = N.acumular(guardadas, nuevas, ctxAcum);
  assert.deepEqual(r.notas.map(n => [n.id, n.titulo]), [['b', 'Dos actualizado'], ['a', 'Uno'], ['c', 'c']]);
  assert.deepEqual(r.agregadas, ['c']);
  assert.deepEqual(r.repetidas, ['b']);
  assert.deepEqual(r.borradas, []);
});

test('acumular: lo que pasó de las 48 h se saca, y cuenta como borrada', () => {
  const r = N.acumular([guardada('d', haceAcum(50)), guardada('e', haceAcum(2))], [], ctxAcum);
  assert.deepEqual(r.notas.map(n => n.id), ['e']);
  assert.deepEqual(r.borradas.map(n => n.id), ['d']);
  assert.equal(r.agregadas.length + r.repetidas.length, 0);
});

test('acumular: también se saca lo viejo que llega en las nuevas, y justo 48 h todavía vale', () => {
  const r = N.acumular([], [guardada('v', haceAcum(49)), guardada('j', haceAcum(48)), guardada('n', haceAcum(1))], ctxAcum);
  assert.deepEqual(r.notas.map(n => n.id), ['j', 'n']);
  assert.deepEqual(r.borradas.map(n => n.id), ['v']);
});

test('acumular: si empatan en fecha, se ordenan por id, igual que agrupar', () => {
  const r = N.acumular([], [guardada('g', horaUTC('12:00')), guardada('f', horaUTC('12:00'))], ctxAcum);
  assert.deepEqual(r.notas.map(n => n.id), ['f', 'g']);
  assert.deepEqual(r.agregadas, ['g', 'f']);
  assert.equal(r.repetidas.length, 0);
});

test('acumular: no modifica las listas que recibe', () => {
  const guardadas = [guardada('a', horaUTC('10:00'), 'Uno'), guardada('b', horaUTC('09:00'), 'Dos'), guardada('x', haceAcum(60))];
  const nuevas = [guardada('b', horaUTC('09:00'), 'Dos actualizado'), guardada('c', horaUTC('11:00'))];
  const [g0, n0] = [copia(guardadas), copia(nuevas)];
  N.acumular(guardadas, nuevas, ctxAcum);
  assert.deepEqual(guardadas, g0);
  assert.deepEqual(nuevas, n0);
});

test('acumular: dos lecturas seguidas iguales no suman nada nuevo', () => {
  const lectura = [guardada('a', horaUTC('10:00')), guardada('b', horaUTC('11:00'))];
  const primera = N.acumular([], lectura, ctxAcum);
  const segunda = N.acumular(primera.notas, lectura, ctxAcum);
  assert.deepEqual(segunda.notas, primera.notas);
  assert.equal(segunda.agregadas.length, 0);
  assert.equal(segunda.repetidas.length, 2);
});

/* ───────── agrupar: umbral bajo con palabras en común ───────── */

const sinPerillas = r => { const { umbralSeguro, minPalabrasComunes, ...resto } = r; return resto; };
const gruposDe = (notas, r) => N.agrupar(notas, r).map(g => g.notas.map(n => n.id));
const reglasBajas = { ...reglas, umbralSimilitud: 0.3, umbralSeguro: 0.5, minPalabrasComunes: 3 };
const comunesDe = (a, b) => { const fb = N.firma(b).completo; return [...N.firma(a).completo].filter(t => fb.has(t)).length; };

const presupuesto = [
  nota('a', 'clarin.com', 'Diputados aprobó el Presupuesto'),
  nota('b', 'infobae.com', 'Diputados empezó a debatir el Presupuesto'),
  nota('c', 'perfil.com', 'Aprobaron el Presupuesto'),
  nota('d', 'ambito.com', 'Qué cambia con el Presupuesto aprobado'),
];
const brasil = [
  nota('p', 'clarin.com', 'Brasil: Lula y Bolsonaro definirán la presidencia en un balotaje'),
  nota('q', 'infobae.com', 'Elecciones en Brasil: Lula ganó la primera vuelta pero habrá balotaje con Bolsonaro'),
];

// La función de antes de agregar la regla, copiada tal cual, para comprobar que sin los valores nuevos nada cambia.
function agruparComoAntes(notas, { umbralSimilitud, ventanaMismoHechoHoras }) {
  const orden = [...notas].sort((a, b) => Date.parse(a.fecha) - Date.parse(b.fecha) || String(a.id).localeCompare(String(b.id)));
  const grupos = [];
  for (const n of orden) {
    const t = Date.parse(n.fecha);
    const f = N.firma(n);
    let mejor = null;
    let mejorSim = 0;
    for (const g of grupos) {
      if (t - g.primera > ventanaMismoHechoHoras * 3600e3) continue;
      for (const m of g.firmas) { const sim = N.similitud(f, m); if (sim > mejorSim) { mejorSim = sim; mejor = g; } }
    }
    if (mejor && mejorSim >= umbralSimilitud) { mejor.notas.push(n); mejor.firmas.push(f); }
    else grupos.push({ primera: t, notas: [n], firmas: [f] });
  }
  return grupos.map(g => g.notas.map(n => n.id));
}

test('agrupar, ejemplo 1: con 0,3 y 3 palabras en común, dos etapas del mismo tema no se juntan', () => {
  assert.deepEqual(gruposDe(presupuesto, reglasBajas), [['a', 'c', 'd'], ['b']]);
  assert.equal(N.similitud(N.firma(presupuesto[0]), N.firma(presupuesto[1])).toFixed(2), '0.40');
  assert.equal(comunesDe(presupuesto[0], presupuesto[1]), 2, 'diput y presu: no alcanzan 3');
});

test('agrupar, ejemplo 1 bis: con 0,3 sola se juntan las cuatro, la unión falsa que se quiere evitar', () => {
  assert.deepEqual(gruposDe(presupuesto, sinPerillas({ ...reglas, umbralSimilitud: 0.3 })), [['a', 'b', 'c', 'd']]);
});

test('agrupar, ejemplo 2: la misma noticia con otras palabras se junta con 0,3 y 4 palabras en común', () => {
  assert.deepEqual(gruposDe(brasil, reglasBajas), [['p', 'q']]);
  assert.equal(N.similitud(N.firma(brasil[0]), N.firma(brasil[1])).toFixed(3), '0.364');
  assert.equal(comunesDe(brasil[0], brasil[1]), 4, 'brasi, lula, bolso y balot');
});

test('agrupar, ejemplo 2 bis: con 0,5, como antes de bajar el umbral, quedan separadas', () => {
  assert.deepEqual(gruposDe(brasil, { ...reglas, umbralSimilitud: 0.5 }), [['p'], ['q']]);
});

test('agrupar, ejemplo 3: sin los valores nuevos el resultado es el de la función de antes', () => {
  const juntas = [...presupuesto, ...brasil];
  for (const umbral of [0.5, 0.4, 0.3, 0.2]) {
    const r = sinPerillas({ ...reglas, umbralSimilitud: umbral });
    assert.deepEqual(gruposDe(juntas, r), agruparComoAntes(juntas, r), `las 6 notas, umbral ${umbral}`);
    assert.deepEqual(gruposDe(dia.notas, r), agruparComoAntes(dia.notas, r), `el día de ejemplo entero, umbral ${umbral}`);
  }
});

test('agrupar: con umbralSeguro igual al umbral, el mínimo de palabras no cambia nada (0,5 y 0,5)', () => {
  const igualesA05 = { ...reglas, umbralSimilitud: 0.5, umbralSeguro: 0.5 };
  assert.deepEqual(gruposDe(dia.notas, igualesA05), agruparComoAntes(dia.notas, igualesA05));
  const iguales = { ...reglas, umbralSimilitud: 0.3, umbralSeguro: 0.3, minPalabrasComunes: 99 };
  assert.deepEqual(gruposDe(presupuesto, iguales), [['a', 'b', 'c', 'd']]);
});

test('agrupar: con mínimo 0 el umbral bajo funciona solo; y una similitud alta se suma aunque comparta pocas palabras', () => {
  assert.deepEqual(gruposDe(presupuesto, { ...reglas, umbralSimilitud: 0.3, umbralSeguro: 0.5, minPalabrasComunes: 0 }), [['a', 'b', 'c', 'd']]);
  const cortas = [nota('x', 'clarin.com', 'Paro general'), nota('y', 'infobae.com', 'Paro general')];
  assert.equal(comunesDe(cortas[0], cortas[1]), 2);
  assert.deepEqual(gruposDe(cortas, reglasBajas), [['x', 'y']], 'similitud 1: pasa por umbralSeguro');
});

test('agrupar: la nota entra al grupo que califica, no al más parecido que no califica', () => {
  // c se parece más a a (2 de 5 palabras: 0,40, pero solo 2 en común) que a b (3 de 9: 0,33, con 3 en común).
  const notas = [
    nota('a', 'clarin.com', 'zorro plato'),
    nota('b', 'infobae.com', 'zorro nubes cielo barco moneda tigre viaje'),
    nota('c', 'perfil.com', 'zorro plato nubes carta cielo'),
  ];
  assert.equal(N.similitud(N.firma(notas[2]), N.firma(notas[0])).toFixed(2), '0.40');
  assert.equal(N.similitud(N.firma(notas[2]), N.firma(notas[1])).toFixed(2), '0.33');
  assert.deepEqual(gruposDe(notas, reglasBajas), [['a'], ['b', 'c']], 'con la regla, entra al que califica');
  assert.deepEqual(gruposDe(notas, { ...reglasBajas, minPalabrasComunes: 0 }), [['a', 'c'], ['b']], 'sin mínimo, al más parecido');
});

test('agrupar: las palabras en común cuentan también las de la bajada, no solo las del título', () => {
  const notas = [
    nota('x', 'clarin.com', 'zorro plato', { bajada: 'nubes carta cielo barco moneda' }),
    nota('y', 'infobae.com', 'zorro viaje', { bajada: 'nubes carta cielo tigre otros' }),
  ];
  assert.equal(comunesDe(notas[0], notas[1]), 4);
  assert.equal(N.similitud(N.firma(notas[0]), N.firma(notas[1])).toFixed(2), '0.40');
  assert.deepEqual(gruposDe(notas, reglasBajas), [['x', 'y']]);
});

test('agrupar: si falta minPalabrasComunes vale 0 (queda el umbral bajo solo), y si falta umbralSeguro vale lo mismo que el umbral', () => {
  const sinMinimo = { ...reglas, umbralSimilitud: 0.3, umbralSeguro: 0.5 };
  delete sinMinimo.minPalabrasComunes;
  assert.deepEqual(gruposDe(presupuesto, sinMinimo), [['a', 'b', 'c', 'd']]);
  const sinSeguro = { ...reglas, umbralSimilitud: 0.3, minPalabrasComunes: 99 };
  delete sinSeguro.umbralSeguro;
  assert.deepEqual(gruposDe(presupuesto, sinSeguro), [['a', 'b', 'c', 'd']], 'con seguro = umbral, el mínimo no se mira');
});

/* ───────── excepción a mano: les falta 1 medio ───────── */

const ANDINISTAS = 'Rescataron a tres andinistas perdidos en el cerro Aconcagua';
const medios4 = ['clarin.com', 'lanacion.com.ar', 'infobae.com', 'perfil.com'];
const hecho4 = (id, extra = {}, titulo = ANDINISTAS) => medios4.map((d, i) => nota(`${id}${i}`, d, titulo, extra));
const conAMano = cambios => ({ ...ctx, reglas: { ...reglas, aMano: { ...reglas.aMano, ...cambios } } });
const elegible = (id, extra = {}) => cand(id, { gruposIndependientes: 4, contador: '4/5', elegibleAMano: true, ...extra });
const ETIQUETA_MANO = 'Confirmada por 4 medios · elegida a mano';

test('a mano: un hecho con 4 de 5 medios queda en observación, es elegible y sale en el menú sin entrar a las listas', () => {
  const p = N.preparar(hecho4('m'), ctx);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contador, '4/5');
  assert.equal(p.enObservacion[0].elegibleAMano, true);
  assert.equal(p.elegiblesAMano.length, 1);
  assert.equal(p.elegiblesAMano[0], p.enObservacion[0], 'son los mismos objetos');
  assert.equal(p.resumen.elegiblesAMano, 1);
  const d = N.decidir(p.candidatos, { 'g:m0': J({ impacto: 2, seccion: 'sociedad' }) }, { ...ctx, elegiblesAMano: p.elegiblesAMano });
  assert.deepEqual(ids(d.aMano.nacional), ['g:m0']);
  assert.deepEqual(d.aMano.internacional, []);
  assert.equal(d.aMano.nacional[0].etiqueta, ETIQUETA_MANO);
  assert.equal(d.aMano.nacional[0].via, 'mano');
  assert.equal(d.aMano.nacional[0].bloque, 'nacional');
  assert.equal(d.aMano.nacional[0].gruposIndependientes, 4);
  assert.equal(d.aMano.nacional[0].links.length, 4);
  assert.equal(d.nacionales.length, 0, 'nunca entra sola');
  assert.equal(d.internacionales.length, 0);
  assert.equal(d.descartadas.length, 0);
});

test('a mano: una internacional va al menú internacional', () => {
  const d = N.decidir([], { x: J({ bloque: 'internacional', pais: 'Chile' }) }, { ...ctx, elegiblesAMano: [elegible('x')] });
  assert.deepEqual(ids(d.aMano.internacional), ['x']);
  assert.deepEqual(d.aMano.nacional, []);
});

test('a mano: con 3 de 5 no es elegible', () => {
  const p = N.preparar(hecho4('m').slice(0, 3), ctx);
  assert.equal(p.enObservacion[0].contador, '3/5');
  assert.equal(p.enObservacion[0].elegibleAMano, false);
  assert.deepEqual(p.elegiblesAMano, []);
  assert.equal(p.resumen.elegiblesAMano, 0);
});

test('a mano: con 4 de 5 pero pasadas las 24 h se descarta como siempre y no es elegible', () => {
  const p = N.preparar(hecho4('m', { fecha: hace(30) }), ctx);
  assert.match(p.descartadas[0].motivo, /^no_llego_a_5 \(4\/5/);
  assert.deepEqual(p.enObservacion, []);
  assert.deepEqual(p.elegiblesAMano, []);
});

test('a mano: con 4 grupos y una firma reconocida entra por la vía B y no es elegible', () => {
  const p = N.preparar(hechoB(['Autora Ficticia Uno'], ['bbc.com', 'theguardian.com', 'elpais.com', 'dw.com']), ctxB);
  assert.equal(p.candidatos.length, 1);
  assert.equal(p.candidatos[0].via, 'B');
  assert.equal(p.candidatos[0].gruposIndependientes, 4);
  assert.deepEqual(p.elegiblesAMano, []);
});

test('a mano: si la vía B sube a 2 firmas, una 4/5 con 1 firma queda en observación y es elegible', () => {
  const p = N.preparar(hechoB(['Autora Ficticia Uno'], ['bbc.com', 'theguardian.com', 'elpais.com', 'dw.com']), ctxMin2);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contador, '4/5');
  assert.equal(p.enObservacion[0].contadorFirmas, '1/2');
  assert.equal(p.enObservacion[0].elegibleAMano, true);
  assert.equal(p.elegiblesAMano.length, 1);
});

test('a mano: faltanMedios 2 suma las 3 de 5; activa:false o sin la clave no deja elegir ninguna', () => {
  const tres = hecho4('m').slice(0, 3);
  assert.equal(N.preparar(tres, ctx).elegiblesAMano.length, 0, 'con el valor de la config, una 3/5 no');
  assert.equal(N.preparar(tres, conAMano({ faltanMedios: 2 })).elegiblesAMano.length, 1);
  assert.equal(N.preparar(hecho4('m'), conAMano({ faltanMedios: 2 })).elegiblesAMano.length, 1, 'y la 4/5 sigue');
  assert.equal(N.preparar(hecho4('m'), conAMano({ activa: false })).elegiblesAMano.length, 0);
  assert.equal(N.preparar(hecho4('m'), { ...ctx, reglas: { ...reglas, aMano: undefined } }).elegiblesAMano.length, 0);
  assert.equal(N.preparar(hecho4('m'), conAMano({ faltanMedios: undefined })).elegiblesAMano.length, 1, 'sin faltanMedios vale 1');
  const apagada = N.preparar(hecho4('m'), conAMano({ activa: false }));
  assert.equal(apagada.enObservacion[0].elegibleAMano, false, 'sigue en observación, solo que no es elegible');
});

test('a mano: no cuenta para el mínimo ni para las listas, y el aviso del mínimo sigue', () => {
  const d = N.decidir([cand('c1'), cand('c2')], { c1: J(), c2: J(), x: J() }, { ...ctx, elegiblesAMano: [elegible('x')] });
  assert.deepEqual(ids(d.nacionales), ['c1', 'c2']);
  assert.ok(d.avisos.includes('Nacionales: solo 2 pasaron los filtros (el mínimo es 3). No se baja el estándar para completar.'));
  assert.equal(d.aviso, 'Hoy: 2 nacionales, 0 internacionales');
  assert.deepEqual(ids(d.aMano.nacional), ['x']);
});

test('a mano: los criterios 3 a 6 la descartan con el mismo motivo y la marca aMano', () => {
  const casos = [
    ['sf', J({ fuenteConNombre: false }), 'sin_fuente_con_nombre (criterio 3)'],
    ['ip', J({ interesPublico: false }), 'no_interes_publico (criterio 4)'],
    ['fb', J({ bloque: null }), 'fuera_de_bloque (criterio 5)'],
    ['de', J({ desmentido: true }), 'desmentido (criterio 6)'],
  ];
  const d = N.decidir([], Object.fromEntries(casos.map(([id, j]) => [id, j])), { ...ctx, elegiblesAMano: casos.map(([id]) => elegible(id)) });
  assert.deepEqual(d.aMano, { nacional: [], internacional: [] });
  for (const [id, , motivo] of casos) {
    assert.deepEqual(d.descartadas.find(x => x.id === id), { tipo: 'hecho', id, titulo: id, motivo, aMano: true });
  }
});

test('a mano: el criterio 2 no se mira (un dato viejo sin dato nuevo igual se puede elegir)', () => {
  const d = N.decidir([], { x: J({ datoNuevo: false }) }, { ...ctx, elegiblesAMano: [elegible('x', { viejo: true })] });
  assert.deepEqual(ids(d.aMano.nacional), ['x']);
});

test('a mano: sin juicio queda en descartadas y suma al aviso de "sin juicio"', () => {
  const d = N.decidir([cand('c1')], { c1: J() }, { ...ctx, elegiblesAMano: [elegible('x')] });
  assert.deepEqual(d.descartadas, [{ tipo: 'hecho', id: 'x', titulo: 'x', motivo: 'sin_juicio', aMano: true }]);
  assert.ok(d.avisos.some(a => /^1 hecho\(s\) sin juicio de la IA/.test(a)));
  const dos = N.decidir([cand('c1')], { }, { ...ctx, elegiblesAMano: [elegible('x')] });
  assert.ok(dos.avisos.some(a => /^2 hecho\(s\) sin juicio de la IA/.test(a)), 'el candidato y el elegible suman');
});

test('a mano: sin cupo, sin tope por sección ni por país, y ordenadas por impacto, grupos y recencia', () => {
  const cs = ['e1', 'e2', 'e3'].map(id => cand(id));
  const js = { e1: J({ seccion: 'economía' }), e2: J({ seccion: 'economía' }), e3: J({ seccion: 'economía' }) };
  const el = [
    elegible('a', { primera: hace(5) }), elegible('b', { primera: hace(1) }),
    elegible('c', { primera: hace(1), gruposIndependientes: 3 }), elegible('d', { primera: hace(1) }),
  ];
  Object.assign(js, { a: J({ seccion: 'economía', impacto: 3 }), b: J({ seccion: 'economía', impacto: 1 }), c: J({ seccion: 'economía', impacto: 1 }), d: J({ seccion: 'economía', impacto: 1 }) });
  const d = N.decidir(cs, js, { ...ctx, cupo: 3, elegiblesAMano: el });
  assert.equal(d.nacionales.length, 3);
  assert.deepEqual(ids(d.aMano.nacional), ['a', 'b', 'd', 'c'], 'mayor impacto; empate: más grupos; después más reciente (b y d empatan y quedan como llegaron)');
  assert.deepEqual(d.reserva, []);
  const pais = N.decidir([], { p1: J({ bloque: 'internacional', pais: 'Chile' }), p2: J({ bloque: 'internacional', pais: 'Chile' }), p3: J({ bloque: 'internacional', pais: 'Chile' }) },
    { ...ctx, elegiblesAMano: ['p1', 'p2', 'p3'].map(id => elegible(id)) });
  assert.equal(pais.aMano.internacional.length, 3, 'el tope de 2 por país no se aplica');
});

test('a mano: sin elegiblesAMano en el contexto, aMano queda vacío y todo lo demás sale igual', () => {
  const cs = [cand('c1'), cand('c2')];
  const js = { c1: J(), c2: J({ bloque: 'internacional' }) };
  const sin = N.decidir(cs, js, ctx);
  assert.deepEqual(sin.aMano, { nacional: [], internacional: [] });
  const { aMano: _a, ...resto } = sin;
  const con = N.decidir(cs, js, { ...ctx, elegiblesAMano: [] });
  const { aMano: _b, ...restoCon } = con;
  assert.deepEqual(restoCon, resto);
  assert.deepEqual(con.aMano, { nacional: [], internacional: [] });
});

/* ───────── un día completo ───────── */

test('día de ejemplo: de punta a punta', () => {
  const p = N.preparar(dia.notas, { portales, reglas, firmas: dia.firmas, ahora: dia.ahora });
  const d = N.decidir(p.candidatos, dia.juicios, { reglas, elegiblesAMano: p.elegiblesAMano });

  assert.equal(p.resumen.hechos, 24, 'ningún hecho se partió ni se juntó mal (19 de siempre + 3 de la vía B + 2 a las que les falta 1 medio)');
  assert.equal(p.resumen.notasDescartadas, 8, 'las 5 columnas y los 3 "dólar hoy"');
  assert.equal(p.resumen.viaB, 2, 'el tratado reservado y la investigación del puente');
  assert.deepEqual(p.enObservacion.map(x => [x.id, x.contador]).sort(), [['g:IC-1', '2/5'], ['g:M1-1', '4/5'], ['g:M2-1', '4/5'], ['g:N8-1', '1/5'], ['g:O1-1', '3/5']]);
  assert.equal(p.resumen.elegiblesAMano, 2);
  assert.equal(p.enObservacion.find(x => x.id === 'g:IC-1').firmasReconocidas.length, 0, 'lo firma alguien que no está en la lista');

  // La vía A de siempre, en el mismo orden, y la vía B al final de cada lista.
  assert.deepEqual(ids(d.nacionales), ['g:N2-1', 'g:N1-1', 'g:N3-1', 'g:E2-1', 'g:E1-1', 'g:N6-1', 'g:NB-1']);
  assert.deepEqual(ids(d.internacionales), ['g:I1-1', 'g:I6-1', 'g:I4-1', 'g:I2-1', 'g:IB-1']);
  assert.equal(d.nacionales[6].etiqueta, 'Respaldada por Autora Ficticia Uno y Autor Ficticio Tres');
  assert.equal(d.internacionales[4].etiqueta, 'Respaldada por Autora Ficticia Uno y Autor Ficticio Dos');
  assert.equal(d.nacionales[0].etiqueta, 'Confirmada por 6 medios');
  assert.deepEqual(d.reserva.map(x => x.motivo).sort(), ['tope_pais (EEUU)', 'tope_seccion (economía)', 'tope_seccion (economía)']);
  assert.equal(d.descartadas.length, 4);
  assert.equal(d.aviso, 'Hoy: 7 nacionales, 5 internacionales');

  // Las que les falta 1 medio: un menú aparte. No rellenan: las internacionales siguen en 5 con cupo 7.
  assert.deepEqual(ids(d.aMano.nacional), ['g:M1-1']);
  assert.deepEqual(ids(d.aMano.internacional), ['g:M2-1']);
  assert.equal(d.aMano.nacional[0].etiqueta, 'Confirmada por 4 medios · elegida a mano');
});

test('día de ejemplo: eligiendo 5 o 3 noticias por bloque', () => {
  const p = N.preparar(dia.notas, { portales, reglas, firmas: dia.firmas, ahora: dia.ahora });
  const cinco = N.decidir(p.candidatos, dia.juicios, { reglas, cupo: 5 });
  assert.deepEqual(ids(cinco.nacionales), ['g:N2-1', 'g:N1-1', 'g:N3-1', 'g:E2-1', 'g:E1-1']);
  assert.deepEqual(ids(cinco.internacionales), ['g:I1-1', 'g:I6-1', 'g:I4-1', 'g:I2-1', 'g:IB-1']);
  assert.deepEqual(cinco.reserva.filter(x => x.motivo === 'cupo').map(x => x.id).sort(), ['g:E3-1', 'g:E4-1', 'g:N6-1', 'g:NB-1'],
    'con la lista llena, lo que sobra queda por cupo: N6, las dos de economía que igual habrían caído por tope, y la vía B');
  const tres = N.decidir(p.candidatos, dia.juicios, { reglas, cupo: 3 });
  assert.deepEqual(ids(tres.nacionales), ['g:N2-1', 'g:N1-1', 'g:N3-1']);
  assert.deepEqual(ids(tres.internacionales), ['g:I1-1', 'g:I6-1', 'g:I4-1']);
});
