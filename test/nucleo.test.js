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

/* ───────── preparar ───────── */

const cinco = ['clarin.com', 'lanacion.com.ar', 'infobae.com', 'perfil.com', 'ambito.com'];

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

test('vía B: una sola firma no alcanza y queda En observación con su contador', () => {
  const p = N.preparar(hechoB(['Autora Ficticia Uno', undefined, undefined]), ctxB);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contador, '3/5');
  assert.equal(p.enObservacion[0].contadorFirmas, '1/2');
});

test('vía B: el mismo autor en dos portales vale 1, y el alias cuenta como la misma persona', () => {
  const dos = N.preparar(hechoB(['Autora Ficticia Uno', 'Autora Ficticia Uno', undefined]), ctxB);
  assert.equal(dos.candidatos.length, 0, 'un autor repetido no llega a 2');
  const alias = N.preparar(hechoB(['Autor Ficticio Dos', 'A. Ficticio Dos', 'Autor Ficticio Tres']), ctxB);
  assert.equal(alias.candidatos[0].firmasReconocidas.length, 2, 'Dos (por nombre y por alias) + Tres');
});

test('vía B: una columna de opinión de un autor reconocido no suma (criterio 1)', () => {
  const notas = hechoB(['Autora Ficticia Uno', 'Autor Ficticio Dos', undefined]);
  notas[1].url = 'https://www.theguardian.com/opinion/b1';
  const p = N.preparar(notas, ctxB);
  assert.equal(p.candidatos.length, 0);
  assert.equal(p.enObservacion[0].contadorFirmas, '1/2');
});

test('vía B: una firma suma solo si salió en un portal que cuenta', () => {
  const p = N.preparar(hechoB(['Autora Ficticia Uno', 'Autor Ficticio Dos', 'Autor Ficticio Tres'], ['bbc.com', 'chequeado.com', 'blog-personal.com']), ctxB);
  assert.equal(p.candidatos.length, 0, 'Chequeado (no suma) y un sitio fuera de lista no habilitan firmas');
  assert.equal(p.enObservacion[0].contadorFirmas, '1/2');
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
  const c = cand('n', { via: 'B', gruposIndependientes: 2, firmasReconocidas: [
    { nombre: 'Uno', ambitos: ['nacional', 'internacional'] }, { nombre: 'Dos', ambitos: ['internacional'] }] });
  const nac = N.decidir([c], { n: J({ bloque: 'nacional' }) }, ctx);
  assert.equal(nac.nacionales.length, 0);
  assert.match(nac.descartadas[0].motivo, /firmas_no_habilitadas_para_nacional/);
  const int = N.decidir([c], { n: J({ bloque: 'internacional' }) }, ctx);
  assert.equal(int.internacionales.length, 1);
});

test('decidir: la etiqueta de la vía B une los nombres ("A, B y C")', () => {
  const r = N.decidir([candB('t', ['A', 'B', 'C'])], { t: J() }, ctx);
  assert.equal(r.nacionales[0].etiqueta, 'Respaldada por A, B y C');
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

test('vía B: la segunda página muestra como máximo 2 noticias por bloque; las demás van a Reserva', () => {
  const cs = [candB('b1', ['X', 'Y']), candB('b2', ['X', 'Y']), candB('b3', ['X', 'Y']), candB('bi', ['X', 'Y'])];
  const js = { b1: J({ impacto: 3 }), b2: J({ impacto: 2 }), b3: J({ impacto: 1 }), bi: J({ bloque: 'internacional' }) };
  const r = N.decidir(cs, js, ctx);
  assert.deepEqual(ids(r.nacionales), ['b1', 'b2']);
  assert.equal(r.reserva.find(x => x.id === 'b3').motivo, 'tope_via_B');
  assert.deepEqual(ids(r.internacionales), ['bi'], 'el tope es por bloque');
});

test('vía B: la segunda página solo ocupa lo que la primera deja libre', () => {
  const cs = [cand('a1'), cand('a2'), cand('a3'), candB('b1', ['X', 'Y']), candB('b2', ['X', 'Y'])];
  const js = { a1: J({ seccion: 'x' }), a2: J({ seccion: 'y' }), a3: J({ seccion: 'z' }), b1: J({ impacto: 3 }), b2: J({ impacto: 3 }) };
  const r = N.decidir(cs, js, { ...ctx, cupo: 4 });
  assert.deepEqual(ids(r.nacionales), ['a1', 'a2', 'a3', 'b1']);
  assert.equal(r.reserva[0].motivo, 'cupo');
});

/* ───────── un día completo ───────── */

test('día de ejemplo: de punta a punta', () => {
  const p = N.preparar(dia.notas, { portales, reglas, firmas: dia.firmas, ahora: dia.ahora });
  const d = N.decidir(p.candidatos, dia.juicios, { reglas });

  assert.equal(p.resumen.hechos, 22, 'ningún hecho se partió ni se juntó mal (19 de siempre + 3 de la vía B)');
  assert.equal(p.resumen.notasDescartadas, 8, 'las 5 columnas y los 3 "dólar hoy"');
  assert.equal(p.resumen.viaB, 2, 'el tratado reservado y la investigación del puente');
  assert.deepEqual(p.enObservacion.map(x => [x.id, x.contador]).sort(), [['g:IC-1', '2/5'], ['g:N8-1', '1/5'], ['g:O1-1', '3/5']]);
  assert.equal(p.enObservacion.find(x => x.id === 'g:IC-1').contadorFirmas, '1/2');

  // La vía A de siempre, en el mismo orden, y la vía B al final de cada lista.
  assert.deepEqual(ids(d.nacionales), ['g:N2-1', 'g:N1-1', 'g:N3-1', 'g:E2-1', 'g:E1-1', 'g:N6-1', 'g:NB-1']);
  assert.deepEqual(ids(d.internacionales), ['g:I1-1', 'g:I6-1', 'g:I4-1', 'g:I2-1', 'g:IB-1']);
  assert.equal(d.nacionales[6].etiqueta, 'Respaldada por Autora Ficticia Uno y Autor Ficticio Tres');
  assert.equal(d.internacionales[4].etiqueta, 'Respaldada por Autora Ficticia Uno y Autor Ficticio Dos');
  assert.equal(d.nacionales[0].etiqueta, 'Confirmada por 6 medios');
  assert.deepEqual(d.reserva.map(x => x.motivo).sort(), ['tope_pais (EEUU)', 'tope_seccion (economía)', 'tope_seccion (economía)']);
  assert.equal(d.descartadas.length, 4);
  assert.equal(d.aviso, 'Hoy: 7 nacionales, 5 internacionales');
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
