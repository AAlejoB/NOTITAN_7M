'use strict';
/**
 * Un día INVENTADO para probar el núcleo. Ninguna de estas noticias es real.
 * Lo usan la demo (npm run demo) y el test de integración.
 *
 * `juicios` simula lo que devolvería la IA por cada hecho. Se indexa por
 * "g:" + id de la primera nota del hecho (la más vieja).
 */

const ahora = '2026-10-04T11:00:00.000Z'; // 08:00 en Argentina
const T0 = Date.parse(ahora);
const iso = horas => new Date(T0 - horas * 3600e3).toISOString();

const NAC = ['clarin.com', 'lanacion.com.ar', 'infobae.com', 'pagina12.com.ar', 'perfil.com', 'ambito.com', 'cronista.com', 'eldiarioar.com', 'lacapital.com.ar', 'lagaceta.com.ar'];
const INT = ['reuters.com', 'apnews.com', 'afp.com', 'efe.com', 'bbc.com', 'dw.com', 'france24.com', 'elpais.com', 'theguardian.com', 'aljazeera.com'];

const notas = [];
const juicios = {};

const J = o => ({ datoNuevo: true, fuenteConNombre: true, interesPublico: true, desmentido: false, bloque: 'nacional', impacto: 1, seccion: '', pais: '', ...o });

function hecho(id, portales, titulos, { hace = 4, seccion = 'actualidad', bajada = '', etiqueta, juicio, firmas = [] } = {}) {
  portales.forEach((p, i) => {
    notas.push({
      id: `${id}-${i + 1}`,
      portal: p,
      url: `https://www.${p}/${seccion}/${id.toLowerCase()}-${i + 1}`,
      titulo: titulos[i % titulos.length],
      bajada,
      etiqueta,
      ...(firmas[i] ? { firma: firmas[i] } : {}),
      fecha: iso(hace - i * 0.15),
      seccion,
    });
  });
  if (juicio) juicios[`g:${id}-1`] = juicio;
}

/* ── NACIONALES ── */

hecho('N1', [...NAC.slice(0, 6), 'tn.com.ar'], [
  'Diputados aprobó el Presupuesto 2027 y lo giró al Senado',
  'Aprobaron el Presupuesto 2027 en Diputados: pasa al Senado',
  'Presupuesto 2027: Diputados lo aprobó y ahora lo trata el Senado',
], { hace: 6, seccion: 'politica', juicio: J({ impacto: 3, seccion: 'política' }) });

hecho('N2', NAC.slice(1, 7), [
  'Paro general de la CGT: el transporte quedó paralizado en todo el país',
  'Paro general de la CGT: transporte paralizado en todo el país',
  'Paro general de la CGT paraliza el transporte en todo el país',
], { hace: 5, seccion: 'sociedad', juicio: J({ impacto: 3, seccion: 'trabajo' }) });

hecho('N3', NAC.slice(0, 5), [
  'Aumento de tarifas de luz y gas desde noviembre: el Gobierno lo oficializó',
  'Aumento de tarifas de luz y gas desde noviembre: cuánto pagarás',
  'El Gobierno oficializó el aumento de tarifas de luz y gas desde noviembre',
], { hace: 4, seccion: 'economia', juicio: J({ impacto: 3, seccion: 'economía' }) });

hecho('N4', NAC.slice(2, 8), [
  'Habría renunciado el ministro de Defensa, según trascendió',
  'Trascendió que habría renunciado el ministro de Defensa',
], { hace: 3, seccion: 'politica', juicio: J({ fuenteConNombre: false, impacto: 3, seccion: 'política' }) });

hecho('N5', NAC.slice(0, 5), [
  'Se separó la pareja de conductores de TV tras diez años juntos',
  'Se separó una pareja de conductores de TV tras diez años',
], { hace: 7, seccion: 'espectaculos', juicio: J({ interesPublico: false, seccion: 'espectáculos' }) });

hecho('N6', NAC.slice(3, 8), [
  'Alerta del Ministerio de Salud por un brote de dengue en el norte',
  'El Ministerio de Salud emitió una alerta por el brote de dengue en el norte del país',
  'Alerta por dengue: el Ministerio de Salud confirmó un brote en el norte',
], { hace: 5, seccion: 'salud', juicio: J({ impacto: 2, seccion: 'salud' }) });

// Cuatro de economía más: solo entran 3 en total (tope por sección).
hecho('E1', NAC.slice(0, 5), [
  'El BCRA subió la tasa de interés: qué cambia para los plazos fijos',
  'BCRA subió la tasa de interés y mueve los plazos fijos',
  'Sube la tasa de interés del BCRA: qué pasa con los plazos fijos',
], { hace: 4.5, seccion: 'economia', juicio: J({ impacto: 2, seccion: 'economía' }) });

hecho('E2', NAC.slice(2, 7), [
  'Riesgo país récord: superó los 1.500 puntos',
  'El riesgo país marcó un récord y superó los 1.500 puntos',
], { hace: 4.2, seccion: 'economia', juicio: J({ impacto: 2, seccion: 'economía' }) });

hecho('E3', NAC.slice(0, 5), [
  'Caen las reservas del Banco Central a su menor nivel del año',
  'Las reservas del Banco Central cayeron a su menor nivel del año',
], { hace: 3.8, seccion: 'economia', juicio: J({ impacto: 1, seccion: 'economía' }) });

hecho('E4', NAC.slice(1, 6), [
  'El dólar blue cerró en alza y marcó un nuevo máximo semanal',
  'Dólar blue: cerró en alza y tocó un máximo semanal',
], { hace: 3.5, seccion: 'economia', juicio: J({ impacto: 1, seccion: 'economía' }) });

// Salió hace 30 h y la IA no ve ningún dato nuevo: no es fresco.
hecho('N7', NAC.slice(0, 5), [
  'Se conoció el fallo de la Corte sobre las jubilaciones',
  'Fallo de la Corte sobre jubilaciones: qué dijeron los jueces',
], { hace: 30, seccion: 'politica', juicio: J({ datoNuevo: false, impacto: 2, seccion: 'política' }) });

// Cinco sitios, un solo cable: vale 1 (queda "En observación").
hecho('N8', [NAC[0], NAC[1], NAC[2], NAC[4], NAC[5]], [
  'Los choferes levantaron el paro de colectivos tras la conciliación obligatoria',
], { hace: 2, seccion: 'sociedad', bajada: 'El conflicto se destrabó anoche. (NA)' });

// Solo 3 portales lo publicaron: "En observación" con 3/5.
hecho('O1', NAC.slice(0, 3), [
  'Incendio en una planta industrial de Zárate: evacuaron a 200 trabajadores',
  'Zárate: incendio en una planta industrial y evacuaron a 200 trabajadores',
], { hace: 1.5, seccion: 'sociedad' });

/* ── Ruido que el criterio 1 saca antes de contar ── */

hecho('OP', [NAC[6], NAC[7], NAC[8], NAC[9], NAC[0]], [
  'Por qué el Presupuesto 2027 es un salto al vacío',
  'El Presupuesto 2027 y el salto al vacío',
], { hace: 5, seccion: 'opinion' });

hecho('DH', [NAC[0], NAC[1], NAC[2]], ['Dólar blue hoy: a cuánto cotiza este sábado'], { hace: 3, seccion: 'economia' });

/* ── INTERNACIONALES ── */

hecho('I1', INT.slice(0, 6), [
  'La Fed bajó la tasa de interés y se mueven el dólar y los bonos',
  'Fed: bajó la tasa de interés, se mueven el dólar y los bonos',
], { hace: 7, seccion: 'economia', juicio: J({ bloque: 'internacional', impacto: 3, seccion: 'economía', pais: 'EEUU' }) });

hecho('I2', INT.slice(2, 7), [
  'El Senado de EEUU aprobó un plan de gasto para evitar el cierre del gobierno',
  'Senado de EEUU: aprobó el plan de gasto y evitó el cierre del gobierno',
], { hace: 6, seccion: 'politica', juicio: J({ bloque: 'internacional', impacto: 2, seccion: 'política', pais: 'EEUU' }) });

hecho('I3', INT.slice(1, 6), [
  'La Casa Blanca anunció nuevos aranceles a la importación de acero',
  'Nuevos aranceles a la importación de acero anunciados por la Casa Blanca',
], { hace: 5, seccion: 'economia', juicio: J({ bloque: 'internacional', impacto: 1, seccion: 'economía', pais: 'EEUU' }) });

hecho('I4', INT.slice(3, 8), [
  'Brasil y Argentina firmaron un acuerdo comercial para el sector automotor',
  'Acuerdo comercial entre Brasil y Argentina para el sector automotor',
], { hace: 4, seccion: 'economia', juicio: J({ bloque: 'internacional', impacto: 2, seccion: 'economía', pais: 'Brasil' }) });

hecho('I5', INT.slice(0, 5), [
  'Renuncia un ministro en Noruega por un escándalo interno',
  'Noruega: un ministro renunció por un escándalo interno',
], { hace: 4, seccion: 'politica', juicio: J({ bloque: null, seccion: 'política', pais: 'Noruega' }) });

hecho('I6', INT.slice(0, 7), [
  'Un terremoto de magnitud 7 sacude el norte de Japón',
  'Terremoto de magnitud 7 en el norte de Japón',
], { hace: 3, seccion: 'sociedad', juicio: J({ bloque: 'internacional', impacto: 2, seccion: 'sociedad', pais: 'Japón' }) });

/* ── VÍA B: firma reconocida (segunda línea) ── */

// Autores inventados. La lista real la arma Alejo en config/firmas.json.
const firmas = [
  { nombre: 'Autora Ficticia Uno', ambitos: ['nacional', 'internacional'] },
  { nombre: 'Autor Ficticio Dos', ambitos: ['internacional'] },
  { nombre: 'Autor Ficticio Tres', ambitos: ['nacional'] },
];

// Información reservada: solo 3 grupos, pero la respaldan 2 firmas habilitadas para internacional.
hecho('IB', ['bbc.com', 'theguardian.com', 'elpais.com'], [
  'Se filtró el texto de un tratado reservado entre dos países europeos',
  'El texto del tratado reservado entre dos países europeos se filtró',
], { hace: 4, seccion: 'politica', firmas: ['Por Autora Ficticia Uno', 'Autor Ficticio Dos'],
  juicio: J({ bloque: 'internacional', impacto: 2, seccion: 'política', pais: 'Suiza' }) });

// Investigación nacional: 2 grupos y 2 firmas habilitadas para nacional.
hecho('NB', ['lanacion.com.ar', 'pagina12.com.ar'], [
  'Una investigación revela cómo se adjudicó la obra de un puente en el Litoral',
  'Cómo se adjudicó la obra de un puente en el Litoral: la investigación',
], { hace: 3, seccion: 'politica', firmas: ['Autora Ficticia Uno', 'Autor Ficticio Tres'],
  juicio: J({ impacto: 2, seccion: 'justicia' }) });

// Una sola firma de dos que hacen falta: queda "En observación" con 2/5 grupos y 1/2 firmas.
hecho('IC', ['dw.com', 'france24.com'], [
  'Un escritor propone un nuevo marco legal para la pesca en el Ártico',
  'Propuesta de un nuevo marco legal para la pesca en el Ártico',
], { hace: 3, seccion: 'sociedad', firmas: ['Autor Ficticio Dos'] });

module.exports = { ahora, notas, juicios, firmas };
