'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { leerListadoScpl, leerNotaScpl, vale, esAviso, esAvisoDeAca, notasParaBajar, datosDeAviso, armarAvisos, etiquetaDeAviso } = require('../src/avisos.js');
const reglas = { ...require('../config/reglas.json'), ...require('../config/zona/reglas.json') };
const cfg = require('../config/zona/avisos.json');
const cronograma = require('../config/zona/cronograma-agua.json');
const { portales } = require('../config/zona/portales.json');

/* ───────────── lo inventado ───────────── */

const itemListado = (id, titulo, fecha) => `<div class="col-md-3 col-sm-6">
    <article class="listSeccion">
        <h2><a href="/index.php/site/ver-nota?id=${id}">${titulo} </a></h2>
        <hr>
        <div class="metadata">${fecha}</div>
        <div class="smallview"></div>
        <p><a href="/index.php/site/ver-nota?id=${id}" class="btn btn-primary btn-ms">AMPLIAR</a></p>
    </article>
</div>`;
const T_2898 = 'CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR TAREAS PROGRAMADAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS';
const T_2900 = 'REDUCCI&Oacute;N DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA';
const T_2901 = 'HECHO VAND&Aacute;LICO PROVOC&Oacute; UN CORTE DE ENERG&Iacute;A EN UN SECTOR DE ZONA SUR DE COMODORO Y EN RADA TILLY';
const LISTADO = `<html><body><div id="category-page" class="container"><div class="row">
${itemListado(2898, T_2898, '07-10-2026')}
${itemListado(2900, T_2900, '09-10-2026')}
${itemListado(2901, T_2901, '13-10-2026')}
</div></div></body></html>`;
const CUERPO_E2 = 'Mañana, jueves 08 de octubre, desde las 15:00hs. y por un lapso de 24hs., se interrumpe el suministro de agua en los siguientes barrios: Laprida, Güemes, Sarmiento, Manantial Rosales.';
const NOTA_E2 = `<html><body><div id="articleVista" class="container"><div class="row"><div class="col-md-8">
<h1>${T_2898}</h1><div class="metadata"><span class="date">07-10-2026</span></div>
<div class="container-cms-page"><p>Ma&ntilde;ana, jueves 08 de octubre, desde las 15:00hs. y por un lapso de 24hs., se interrumpe el suministro de agua en los siguientes barrios: Laprida, G&uuml;emes, Sarmiento, Manantial Rosales.</p><p><br></p><p>Depto. Saneamiento</p></div>
</div><aside id="sidebar" class="col-md-4"><h3>GALERÍA DE IMÁGENES</h3></aside></div></div></body></html>`;

/* ───────────── paso 2 · la SCPL ───────────── */

test('E1: el listado da 3 comunicados con id, título limpio y fecha a las 12:00 de Argentina; vale da true, false, true', () => {
  const l = leerListadoScpl(LISTADO);
  assert.equal(l.length, 3);
  assert.deepEqual(l.map(x => x.id), ['2898', '2900', '2901']);
  assert.equal(l[0].titulo, T_2898);
  assert.equal(l[2].titulo, 'HECHO VANDÁLICO PROVOCÓ UN CORTE DE ENERGÍA EN UN SECTOR DE ZONA SUR DE COMODORO Y EN RADA TILLY');
  assert.equal(l[0].fecha, '2026-10-07T15:00:00.000Z');
  assert.deepEqual(l.map(x => vale(x.titulo, reglas)), [true, false, true]);
  assert.equal(vale('CRONOGRAMA MENSUAL DE MANIOBRAS OPERATIVAS DEL SERVICIO DE AGUA EN KM.18', reglas), true);
});

test('leerListadoScpl: un HTML sin comunicados da [] y no tira', () => {
  assert.deepEqual(leerListadoScpl('<html><body>Mantenimiento</body></html>'), []);
  assert.deepEqual(leerListadoScpl(''), []);
  assert.deepEqual(leerListadoScpl(null), []);
});

test('E2: leerNotaScpl saca el cuerpo limpio y arma la url con el molde de la fuente', () => {
  const n = leerNotaScpl(NOTA_E2, { id: '2898', titulo: T_2898, fecha: '2026-10-07T15:00:00.000Z' });
  assert.equal(n.texto, `${CUERPO_E2} Depto. Saneamiento`);
  assert.equal(n.url, 'https://scpl.coop/index.php/site/ver-nota?id=2898');
  assert.equal(n.id, '2898');
  assert.equal(n.titulo, T_2898);
});

test('notasParaBajar: últimos 7 días, que valen, no guardadas, las más nuevas primero y como mucho maxNotasPorVuelta', () => {
  const l = leerListadoScpl(LISTADO);
  const ahora = '2026-10-14T12:00:00.000Z';
  assert.deepEqual(notasParaBajar(l, [], { ahora, reglas, cfg }).map(x => x.id), ['2901', '2898']);
  assert.deepEqual(notasParaBajar(l, [{ id: '2901' }], { ahora, reglas, cfg }).map(x => x.id), ['2898']);
  assert.deepEqual(notasParaBajar(l, [], { ahora: '2026-10-16T12:00:00.000Z', reglas, cfg }).map(x => x.id), ['2901'], 'la del 07-10 ya tiene más de 7 días');
  assert.deepEqual(notasParaBajar(l, [], { ahora, reglas, cfg: { ...cfg, maxNotasPorVuelta: 1 } }).map(x => x.id), ['2901']);
});

/* ───────────── paso 3 · el molde y los datos ───────────── */

const ENTRAN = [
  'Cortarán el agua en 23 barrios de Comodoro',
  'Numerosos barrios de Comodoro se hallan sin agua',
  'Una avería en el acueducto del 99 afecta el suministro de agua en 23 barrios de Comodoro',
  'Corte de energía programado para siete barrios de Zona Norte',
  '¿En qué barrios cortan la luz 6 horas el domingo?',
  'Varios sectores de Comodoro se quedaron sin luz',
  'Se restableció el servicio de agua en zona norte',
  'CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR TAREAS PROGRAMADAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS',
  'HECHO VANDÁLICO PROVOCÓ UN CORTE DE ENERGÍA EN UN SECTOR DE ZONA SUR DE COMODORO Y EN RADA TILLY',
  'CRONOGRAMA MENSUAL DE MANIOBRAS OPERATIVAS DEL SERVICIO DE AGUA EN KM.18',
];
const NO_ENTRAN = [
  'REDUCCIÓN DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA',
  'Corte de ruta 3 por reclamo de vecinos sin agua',
  'Aumentó la tarifa de luz en Chubut',
  'Nuevo ataque ruso deja seis muertos y cortes eléctricos en Ucrania',
  'Comodoro tendrá un viernes con sol pleno',
  'Greenpeace alertó por la muerte de ballenas en Chubut',
];

test('el molde de cortes: los 16 títulos de Cowork (10 entran, 6 no)', () => {
  assert.equal(ENTRAN.length + NO_ENTRAN.length, 16);
  for (const t of ENTRAN) assert.equal(esAviso(t, reglas), true, `tendría que entrar: ${t}`);
  for (const t of NO_ENTRAN) assert.equal(esAviso(t, reglas), false, `no tendría que entrar: ${t}`);
});

test('el molde: sin la clave cortes en las reglas, nada es aviso', () => {
  assert.equal(esAviso(ENTRAN[0], {}), false);
  assert.equal(vale(ENTRAN[0], {}), false);
});

test('E3: la nota de la SCPL → agua, programado, jueves 8, desde las 15:00 por 24 h, hasta las 15:00 y 4 barrios', () => {
  const d = datosDeAviso(`${T_2898} ${CUERPO_E2}`, { fechaPublicacion: '2026-10-07T15:00:00.000Z', cfg });
  assert.deepEqual(d, {
    servicio: 'agua', programado: true, dia: '2026-10-08', desde: '15:00', hasta: '15:00', duracionHoras: 24,
    barrios: ['Laprida', 'Güemes', 'Sarmiento', 'Manantial Rosales'], zona: null, normalizado: false,
  });
});

test('E4: luz programada el martes entre las 8 y las 14 en Zona Norte; sin «barrios:» la lista queda vacía', () => {
  const d = datosDeAviso('Corte de energía programado para siete barrios de Zona Norte La SCPL informó que el martes se interrumpirá el servicio entre las 8 y las 14 en Standard Norte, Castelli y Próspero Palazzo',
    { fechaPublicacion: '2026-10-24T13:00:00.000Z', cfg });
  assert.deepEqual(d, { servicio: 'luz', programado: true, dia: '2026-10-27', desde: '08:00', hasta: '14:00', duracionHoras: null, barrios: [], zona: ['Zona Norte'], normalizado: false });
});

test('E5: «Varios sectores de Comodoro se quedaron sin luz» → luz y nada más', () => {
  const d = datosDeAviso('Varios sectores de Comodoro se quedaron sin luz', { fechaPublicacion: '2026-09-24T13:00:00.000Z', cfg });
  assert.deepEqual(d, { servicio: 'luz', programado: null, dia: null, desde: null, hasta: null, duracionHoras: null, barrios: [], zona: null, normalizado: false });
});

test('datosDeAviso: las otras formas de día y de horario', () => {
  const pub = { fechaPublicacion: '2026-10-24T13:00:00.000Z', cfg }; // sábado 24-10
  const d = t => datosDeAviso(t, pub);
  assert.equal(d('Hoy cortan el agua en zona sur').dia, '2026-10-24');
  assert.equal(d('Mañana cortan el agua').dia, '2026-10-25');
  assert.equal(d('Cortan la luz este sábado').dia, '2026-10-24', 'el día de la semana cuenta desde hoy, incluido');
  assert.equal(d('Mañana, lunes 26 de octubre, corte').dia, '2026-10-26', 'gana el que trae número');
  assert.equal(datosDeAviso('Corte el 2 de enero', { fechaPublicacion: '2026-12-30T13:00:00.000Z', cfg }).dia, '2027-01-02', 'más de 30 días atrás: el año siguiente');
  assert.deepEqual([d('Corte de luz de 9 a 13 horas').desde, d('Corte de luz de 9 a 13 horas').hasta], ['09:00', '13:00']);
  assert.deepEqual([d('Corte de luz de 9 a 13 hs en Km 3').desde, d('Corte de luz de 9 a 13 hs en Km 3').hasta], ['09:00', '13:00']);
  assert.equal(d('Corte de agua de 9 a 13 barrios').desde, null, '«de 9 a 13 barrios» no es un horario');
  assert.equal(d('Sin agua a partir de las 12:00 en zona norte').desde, '12:00');
  assert.equal(d('¿En qué barrios cortan la luz 6 horas el domingo?').duracionHoras, 6);
  assert.equal(d('Corte entre las 12 y las 14 horas').duracionHoras, null, '«las 14 horas» es una hora, no una duración');
  assert.deepEqual(d('Corte de agua en zona sur y central').zona, ['Zona Sur', 'Zona Central']);
  assert.equal(d('Corte de energía por un hecho vandálico; también sin agua').servicio, 'luz', 'luz y agua: la que aparece primero');
  assert.equal(d('Rotura y tareas de reparación: corte de agua').programado, null, 'las dos: null');
  assert.equal(d('Aumentan los gastos en Comodoro: corte de luz').servicio, 'luz', '«gastos» no es gas');
});

test('barrios: «Gral.» y «Km.8» no cortan la lista; el punto y coma sí', () => {
  const d = datosDeAviso('Se interrumpe el suministro de agua en los siguientes barrios: Km.8, un sector de Gral. Mosconi y la zona de Chacras de Saavedra; en el marco del plan.',
    { fechaPublicacion: '2026-10-07T15:00:00.000Z', cfg });
  assert.deepEqual(d.barrios, ['Km.8', 'Un sector de Gral. Mosconi', 'La zona de Chacras de Saavedra']);
});

/* ───────────── paso 4 · un aviso por corte ───────────── */

const NOTA_SCPL = { id: '2898', titulo: T_2898, fecha: '2026-10-07T15:00:00.000Z', texto: CUERPO_E2, url: 'https://scpl.coop/index.php/site/ver-nota?id=2898', bajadaEn: '2026-10-07T16:00:00.000Z' };
const portal = (dominio, slug, titulo, bajada, fecha) => ({ id: `${dominio}:${slug}`, titulo, bajada, url: `https://www.${dominio}/${slug}`, portal: dominio, fecha, seccion: '', etiqueta: '', firma: '', feed: dominio });
const ADNSUR = portal('adnsur.com.ar', 'cortaran-agua', 'Cortarán el agua en 23 barrios de Comodoro', 'La SCPL informó que mañana se interrumpe el suministro en 23 barrios.', '2026-10-07T13:00:00.000Z');
const PATAGONICO = portal('elpatagonico.com', 'sin-agua', 'Numerosos barrios de Comodoro se hallan sin agua', '', '2026-10-08T10:00:00.000Z');
const SIN_LUZ = portal('elpatagonico.com', 'sin-luz', 'Varios sectores de Comodoro se quedaron sin luz', '', '2026-09-24T13:00:00.000Z');

test('E6: comunicado de la SCPL + dos notas de portal del mismo corte → 1 aviso, la SCPL primero, con sus barrios', () => {
  const a = armarAvisos({ notasScpl: [NOTA_SCPL], notasPortales: [ADNSUR, PATAGONICO], ahora: '2026-10-08T12:00:00.000Z', cfg, reglas, portales });
  assert.equal(a.length, 1);
  assert.equal(a[0].id, 'a:scpl.coop:2898');
  assert.deepEqual(a[0].fuentes.map(f => f.medio), ['SCPL', 'ADNSUR', 'El Patagónico']);
  assert.equal(a[0].fuentes[0].url, NOTA_SCPL.url);
  assert.deepEqual(a[0].barrios, ['Laprida', 'Güemes', 'Sarmiento', 'Manantial Rosales']);
  assert.equal(a[0].dia, '2026-10-08');
  assert.equal(a[0].finISO, '2026-10-09T18:00:00.000Z', 'jueves 15:00 + 24 h = viernes 15:00 de Argentina');
  assert.equal(a[0].titulo, T_2898);
  assert.equal(a[0].resumen, CUERPO_E2, 'el cuerpo entra entero en 200 letras');
  assert.equal(a[0].cronograma, false);
  assert.equal(etiquetaDeAviso(a[0]), 'Agua · programado');
  assert.deepEqual(Object.keys(a[0]), ['id', 'servicio', 'programado', 'dia', 'desde', 'hasta', 'finISO', 'duracionHoras', 'barrios', 'zona', 'titulo', 'resumen', 'fuentes', 'cronograma', 'normalizado', 'publicado']);
});

test('el resumen de un cuerpo largo se corta en una palabra entera, con «…»', () => {
  const largo = { ...NOTA_SCPL, texto: `${CUERPO_E2} Se solicita a los vecinos hacer uso racional del servicio durante todo el corte.` };
  const [a] = armarAvisos({ notasScpl: [largo], ahora: '2026-10-08T12:00:00.000Z', cfg, reglas, portales });
  assert.equal(a.resumen, `${CUERPO_E2} Se solicita a…`);
});

test('E6: el aviso vive hasta 12 h después del fin', () => {
  const con = ahora => armarAvisos({ notasScpl: [NOTA_SCPL], notasPortales: [], ahora, cfg, reglas, portales }).length;
  assert.equal(con('2026-10-10T05:59:00.000Z'), 1);
  assert.equal(con('2026-10-10T06:01:00.000Z'), 0);
});

test('E7: solo la nota de El Patagónico «sin luz» → 1 aviso «Luz», sin día, que vive 72 h', () => {
  const con = ahora => armarAvisos({ notasPortales: [SIN_LUZ], ahora, cfg, reglas, portales });
  const a = con('2026-09-24T14:00:00.000Z');
  assert.equal(a.length, 1);
  assert.equal(a[0].programado, null);
  assert.equal(a[0].dia, null);
  assert.equal(etiquetaDeAviso(a[0]), 'Luz');
  assert.deepEqual(a[0].fuentes, [{ medio: 'El Patagónico', url: SIN_LUZ.url }]);
  assert.equal(con('2026-09-27T12:59:00.000Z').length, 1);
  assert.equal(con('2026-09-27T13:01:00.000Z').length, 0);
});

test('E8: el cronograma de verano (martes 4-11-2025: Zona Norte hoy; vencido en 2026: nada; la excepción del 23-12)', () => {
  const con = ahora => armarAvisos({ ahora, cfg, reglas, portales, cronograma });
  const nov = con('2025-11-04T13:00:00.000Z');
  const norte = nov.find(a => a.zona.includes('Zona Norte'));
  assert.equal(norte.dia, '2025-11-04');
  assert.equal(norte.desde, '18:00');
  assert.equal(norte.duracionHoras, 24);
  assert.equal(norte.cronograma, true);
  assert.deepEqual(norte.fuentes, [{ medio: 'SCPL', url: null }]);
  assert.deepEqual(norte.barrios, []);
  assert.equal(etiquetaDeAviso(norte), 'Agua · cronograma de verano');
  // Hoy o mañana: el miércoles 5 le toca a Zona Sur y Central (va después: es mañana).
  assert.deepEqual(nov.map(a => `${a.dia} ${a.zona.join('+')}`), ['2025-11-04 Zona Norte', '2025-11-05 Zona Sur+Zona Central']);
  assert.deepEqual(con('2026-10-16T13:00:00.000Z'), []);
  const dic = con('2025-12-23T13:00:00.000Z').find(a => a.dia === '2025-12-23');
  assert.equal(dic.desde, '12:00');
  assert.equal(dic.zona[0], 'Zona Norte');
});

test('el cronograma no se muestra si ya hay un comunicado de la SCPL del mismo día y zona', () => {
  const nota = { ...NOTA_SCPL, id: '3000', titulo: 'CORTE DE AGUA EN ZONA NORTE', texto: 'Hoy, martes 4 de noviembre, desde las 18:00hs. y por un lapso de 24hs. se interrumpe el suministro de agua en zona norte.', fecha: '2025-11-04T15:00:00.000Z', url: 'https://scpl.coop/index.php/site/ver-nota?id=3000' };
  const a = armarAvisos({ notasScpl: [nota], ahora: '2025-11-04T16:00:00.000Z', cfg, reglas, portales, cronograma });
  assert.deepEqual(a.map(x => x.id), ['a:scpl.coop:3000', 'a:cronograma:2025-11-05:Zona Sur y Central']);
});

test('el orden: cortando ahora → lo que viene → lo que no tiene día (lo más nuevo primero)', () => {
  const ahora = '2026-10-08T19:00:00.000Z'; // jueves 8, 16:00 de Argentina: el corte de la SCPL ya empezó
  const viene = portal('adnsur.com.ar', 'luz-martes', 'Corte de energía programado para siete barrios de Zona Norte', 'La SCPL informó que el martes se interrumpirá el servicio entre las 8 y las 14.', '2026-10-08T12:00:00.000Z');
  const sinDia1 = portal('elcomodorense.net', 'sin-luz-1', 'Varios sectores de Comodoro se quedaron sin luz', '', '2026-10-08T10:00:00.000Z');
  const sinDia2 = portal('diariocronica.com.ar', 'gas', 'Un escape obligó a cortar el gas en un sector del barrio Pueyrredón', '', '2026-10-08T15:00:00.000Z');
  const a = armarAvisos({ notasScpl: [NOTA_SCPL], notasPortales: [viene, sinDia1, sinDia2], ahora, cfg, reglas, portales });
  assert.deepEqual(a.map(x => x.id), ['a:scpl.coop:2898', 'a:adnsur.com.ar:luz-martes', 'a:diariocronica.com.ar:gas', 'a:elcomodorense.net:sin-luz-1']);
});

test('sin notas y sin cronograma, ningún aviso', () => {
  assert.deepEqual(armarAvisos({ ahora: '2026-10-16T12:00:00.000Z', cfg, reglas, portales }), []);
});

/* ───────────── carta d · paso 1 · lo provincial entra solo si nombra el lugar ───────────── */

const deChubut = (slug, titulo) => ({ titulo, url: `https://www.elchubut.com.ar/${slug}`, portal: 'elchubut.com.ar' });
const dePatagonico = (slug, titulo) => ({ titulo, url: `https://www.elpatagonico.com/${slug}`, portal: 'elpatagonico.com' });
const deAca = n => esAvisoDeAca(n, { reglas, portales });

test('E1 a E5: lo local entra; lo provincial, solo si el título nombra Comodoro o Rada Tilly', () => {
  assert.equal(deAca(deChubut('puerto-madryn/corte-energia', 'Mañana habrá corte programado de energía en zona norte')), false, 'E1: el caso de Puerto Madryn');
  assert.equal(deAca(deChubut('regionales/corte-agua', 'Corte de agua en 23 barrios de Comodoro por avería en el acueducto')), true, 'E2');
  assert.equal(deAca(dePatagonico('locales/corte-energia', 'Mañana habrá corte programado de energía en zona norte')), true, 'E3: local, no hace falta que lo nombre');
  assert.equal(deAca(deChubut('regionales/rada', 'Corte de luz en Rada Tilly por tareas de mantenimiento')), true, 'E4');
  assert.equal(deAca(deChubut('trelew/corte', 'Corte de agua en zona sur de Trelew')), false, 'E5');
});

test('esAvisoDeAca: un portal que no está en la lista cuenta como no local; lo que no pasa esAviso nunca entra', () => {
  const ajeno = { titulo: 'Mañana habrá corte programado de energía en zona norte', url: 'https://www.otro.com.ar/x' };
  assert.equal(deAca(ajeno), false);
  assert.equal(deAca({ ...ajeno, titulo: 'Corte programado de energía en zona norte de Comodoro' }), true);
  assert.equal(deAca(dePatagonico('x', 'Comodoro tendrá un viernes con sol pleno')), false);
});

/* ───────────── carta d · paso 2 · programado o avería: manda el título ───────────── */

test('E6 a E9: el título decide programado o avería; el cuerpo desempata solo si el título no dice nada', () => {
  const pub = { fechaPublicacion: '2026-10-16T13:00:00.000Z', cfg };
  const prog = (titulo, cuerpo) => [datosDeAviso(`${titulo} ${cuerpo}`, pub).programado, datosDeAviso(`${titulo} ${cuerpo}`, { ...pub, titulo }).programado];
  const T_AVERIA = 'CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR AVERÍA EN EL ACUEDUCTO DEL ‘99';
  const T_SECTOR = 'CORTE DE AGUA EN UN SECTOR DE ZONA NORTE';
  assert.deepEqual(prog(T_AVERIA, 'Se realizan tareas de reparación.'), [null, false], 'E6');
  assert.deepEqual(prog(T_2898, 'Se suspende por una falla en la bomba del sector.'), [null, true], 'E7');
  assert.deepEqual(prog(T_SECTOR, 'Se interrumpe el servicio por una avería en la cañería.'), [false, false], 'E8');
  assert.deepEqual(prog(T_SECTOR, 'Se interrumpe por mantenimiento tras la falla de ayer.'), [null, null], 'E9');
});

test('E6 en armarAvisos: un comunicado de la SCPL con «avería» en el título sale «Agua · avería»', () => {
  const nota = { ...NOTA_SCPL, id: '2902', titulo: 'CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR AVERÍA EN EL ACUEDUCTO DEL ‘99', texto: `${CUERPO_E2} Se realizan tareas de reparación.`, url: 'https://scpl.coop/index.php/site/ver-nota?id=2902' };
  const [a] = armarAvisos({ notasScpl: [nota], ahora: '2026-10-08T12:00:00.000Z', cfg, reglas, portales });
  assert.equal(a.programado, false);
  assert.equal(etiquetaDeAviso(a), 'Agua · avería');
});

/* ───────────── carta d · paso 3 · «se normalizó», aparte y al final ───────────── */

const T_NORMALIZA = 'SE NORMALIZA EL SERVICIO DE AGUA EN COMODORO TRAS LAS TAREAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS';

test('E10 a E13: normalizado en el molde y en datosDeAviso', () => {
  const pub = { fechaPublicacion: '2026-10-16T13:00:00.000Z', cfg };
  const casos = [
    [T_NORMALIZA, true],
    ['Se restableció la luz en Rada Tilly tras el hecho vandálico', true],
    ['CORTE DE AGUA EN ZONA SUR HASTA QUE SE RESTABLEZCA EL SUMINISTRO', false],
    ['SE NORMALIZA EL SERVICIO EN 23 BARRIOS Y SE CORTA EL AGUA EN EL RESTO DE LA ZONA SUR Y CENTRAL PARA RECUPERAR RESERVAS', false],
  ];
  for (const [titulo, normalizado] of casos) {
    assert.equal(esAviso(titulo, reglas), true, `pasa el molde: ${titulo}`);
    assert.equal(datosDeAviso(titulo, { ...pub, titulo }).normalizado, normalizado, titulo);
  }
  // E13: «normalice» se escribe con c, así que normaliz\w* no lo agarra: el reclamo no es aviso ni «se normalizó».
  const E13 = 'Vecinos reclaman que se normalice el agua en Km 8';
  assert.equal(esAviso(E13, reglas), false);
  assert.equal(datosDeAviso(E13, { ...pub, titulo: E13 }).normalizado, false);
  assert.equal(vale(T_NORMALIZA, reglas), true, 'E10 vale para la SCPL');
});

const NOTA_NORMALIZA = { id: '2905', titulo: T_NORMALIZA, fecha: '2026-10-08T15:00:00.000Z', texto: 'Se informa que se normalizó el servicio en los barrios afectados.', url: 'https://scpl.coop/index.php/site/ver-nota?id=2905', bajadaEn: '2026-10-08T21:10:00.000Z' };

test('E10: «se normaliza» no se junta con el corte, va al final, dice «Agua · se normalizó» y vive 6 h desde que se bajó', () => {
  const ahora = '2026-10-08T22:00:00.000Z';
  const a = armarAvisos({ notasScpl: [NOTA_SCPL, NOTA_NORMALIZA], ahora, cfg, reglas, portales });
  assert.deepEqual(a.map(x => x.id), ['a:scpl.coop:2898', 'a:scpl.coop:2905'], 'el corte (cortando ahora) y después el «se normalizó»');
  assert.equal(a[1].normalizado, true);
  assert.equal(a[0].normalizado, false);
  assert.equal(etiquetaDeAviso(a[1]), 'Agua · se normalizó');
  assert.equal(a[1].publicado, '2026-10-08T21:10:00.000Z', 'la SCPL no da hora: cuenta desde que se bajó');
  assert.equal(a[1].finISO, null);
  const con = t => armarAvisos({ notasScpl: [NOTA_NORMALIZA], ahora: t, cfg, reglas, portales }).length;
  assert.equal(con('2026-10-09T03:09:00.000Z'), 1);
  assert.equal(con('2026-10-09T03:11:00.000Z'), 0);
});

test('E11: dos «se normalizó» del mismo servicio y zona se juntan; entre ellos, el más nuevo primero', () => {
  const luz1 = portal('adnsur.com.ar', 'luz-rada', 'Se restableció la luz en Rada Tilly tras el hecho vandálico', '', '2026-10-08T18:00:00.000Z');
  const luz2 = portal('elpatagonico.com', 'luz-rada', 'Se restableció la luz en Rada Tilly tras un hecho vandálico', '', '2026-10-08T18:30:00.000Z');
  const gas = portal('elcomodorense.net', 'gas', 'Se normalizó el gas en barrio Pueyrredón', '', '2026-10-08T19:00:00.000Z');
  const a = armarAvisos({ notasPortales: [luz1, luz2, gas], ahora: '2026-10-08T20:00:00.000Z', cfg, reglas, portales });
  assert.deepEqual(a.map(x => x.id), ['a:elcomodorense.net:gas', 'a:adnsur.com.ar:luz-rada']);
  assert.equal(a[1].fuentes.length, 2);
  assert.equal(etiquetaDeAviso(a[1]), 'Luz · se normalizó');
  assert.deepEqual(a[1].zona, ['Rada Tilly']);
});

/* ───────────── carta d · paso 4 · una excepción del cronograma reemplaza, no suma ───────────── */

// Lo que dibuja el cronograma a las 10:00 de Argentina de ese día, para una zona: «2025-12-25 08:00».
const delCronograma = (dia, zona, crono = cronograma) => armarAvisos({ ahora: `${dia}T13:00:00.000Z`, cfg, reglas, portales, cronograma: crono })
  .filter(a => a.id.endsWith(`:${zona}`)).map(a => `${a.dia} ${a.desde}`);

test('E14 a E18: la excepción corre el corte de la semana (Nochebuena y Año Nuevo)', () => {
  assert.deepEqual(delCronograma('2025-12-23', 'Zona Sur y Central'), [], 'E14: el 24 se corrió al 25, que todavía no está en la ventana');
  assert.deepEqual(delCronograma('2025-12-24', 'Zona Sur y Central'), ['2025-12-25 08:00'], 'E15');
  assert.deepEqual(delCronograma('2025-12-25', 'Zona Sur y Central'), ['2025-12-25 08:00'], 'E16: el del 24 ya no está');
  assert.deepEqual(delCronograma('2025-12-30', 'Zona Norte'), ['2025-12-30 12:00'], 'E17: cae en un día normal, cambia la hora');
  assert.deepEqual(delCronograma('2025-12-31', 'Zona Sur y Central'), ['2026-01-01 08:00'], 'E18');
  assert.deepEqual(delCronograma('2025-12-23', 'Zona Norte'), ['2025-12-23 12:00'], 'el 23 de Zona Norte, sobre sí mismo');
});

test('cronograma: con "suma": true la excepción se agrega; sin corte normal en la semana, también', () => {
  const suma = { ...cronograma, excepciones: [{ fecha: '2025-12-25', zona: 'Zona Sur y Central', desde: '08:00', suma: true }] };
  assert.deepEqual(delCronograma('2025-12-25', 'Zona Sur y Central', suma), ['2025-12-24 18:00', '2025-12-25 08:00']);
  const sinNormal = { ...cronograma, zonas: [{ zona: 'Zona Sur y Central', dias: [], desde: '18:00' }] };
  assert.deepEqual(delCronograma('2025-12-25', 'Zona Sur y Central', sinNormal), ['2025-12-25 08:00']);
});
