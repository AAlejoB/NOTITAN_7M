#!/usr/bin/env node
'use strict';
/**
 * Prueba la página C (pagina/index.html) en Chromium: lo que `npm test` no ve, porque vive en el navegador
 * (el pivote, los botones, los motivos, las pestañas, Deshacer, los temas, el portapapeles, el estado guardado).
 * Se corre con `npm run probar-pagina`; con `-- --capturas <nombre>` además guarda 4 capturas en buzon/capturas/
 * (pagina-c-<nombre>-390.png, -1200.png, -390-oscuro.png y -normal-390.png, esta con el escalón Normal).
 * Necesita Playwright (npm i --no-save playwright) y un Chromium.
 * Sirve una COPIA de pagina/ desde la memoria: nunca escribe pagina/lista.json ni usa la red de afuera. A la copia de la
 * lista de ejemplo le suma un aviso y le pone el tema «Espectáculos» a una noticia (la de ejemplo no trae ninguna), y para
 * la mezcla pasa las dos «le falta 1» a confirmadas.
 * Una línea por comprobación (bien / MAL) y al final «N bien, M mal»; código 0 si no hay MAL, 1 si hay, 2 si falta Playwright.
 * Con `-- --solo-capturas <carpeta> --capturas <nombre>` no corre las comprobaciones: sirve esa carpeta tal cual
 * (index.html, logica.js y lista.json, por ejemplo datos/pagina con la lista real), saca las 3 capturas de siempre y termina.
 * No escribe nada en la carpeta.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('Falta Playwright. Instalalo sin guardarlo en package.json: npm i --no-save playwright');
  process.exit(2);
}

const RAIZ = path.join(__dirname, '..');
const CLAVE = '7m-decisiones-v2';
const CLAVE_V1 = '7m-marcas-v1';
const arg = process.argv.indexOf('--capturas');
const NOMBRE_CAPTURAS = arg >= 0 ? process.argv[arg + 1] : null;
if (arg >= 0 && (!NOMBRE_CAPTURAS || NOMBRE_CAPTURAS.startsWith('--'))) {
  console.error('Falta el nombre: --capturas <nombre>');
  process.exit(2);
}
const argSolo = process.argv.indexOf('--solo-capturas');
const CARPETA_SOLO = argSolo >= 0 ? process.argv[argSolo + 1] : null;
if (argSolo >= 0 && (!CARPETA_SOLO || CARPETA_SOLO.startsWith('--'))) {
  console.error('Falta la carpeta: --solo-capturas <carpeta>');
  process.exit(2);
}
if (argSolo >= 0 && !NOMBRE_CAPTURAS) {
  console.error('Falta el nombre: --capturas <nombre>');
  process.exit(2);
}

/* ───────────── lo que se mira ───────────── */

let bien = 0;
let mal = 0;
function ok(cond, que) {
  if (cond) bien++; else mal++;
  console.log((cond ? 'bien ' : 'MAL  ') + ' ' + que);
}

const MOTIVOS = ['Es un dato, no una noticia', 'Ya la tengo', 'Opinión o reacción a otra', 'Está en el bloque equivocado', 'Ya pasó, llegó tarde', 'No va con nuestro público', 'Otro motivo…'];
const HHMM = /^\d\d:\d\d$/;

/* ───────────── la lista de la copia ───────────── */

const AVISO = {
  id: 'a:scpl.coop:2903', titulo: 'CORTE DE AGUA EN ZONA SUR Y CENTRAL', bajada: '', etiqueta: 'Agua · programado', via: 'aviso', grupos: 1, medios: ['SCPL'],
  links: [{ medio: 'SCPL', url: 'https://scpl.coop/index.php/site/ver-nota?id=2903' }],
  aviso: { servicio: 'agua', programado: true, dia: '2026-10-17', desde: '00:00', hasta: '18:00', duracionHoras: 18, barrios: [], zona: ['Zona Sur', 'Zona Central'], cronograma: false },
};
const ESPECTACULOS = 'Alerta del Ministerio de Salud';

// La de ejemplo, fresca, con un aviso y una noticia de Espectáculos. `escalon` y `mezcla` cambian lo que pide cada escenario.
function armarLista(base, { escalon = 'plus', mezcla = false } = {}) {
  const l = JSON.parse(JSON.stringify(base));
  l.generadaEn = new Date().toISOString();
  l.orden = ['avisos', ...(l.orden || ['nacional', 'internacional']).filter(k => k !== 'avisos')];
  l.bloques.avisos = { nombre: 'Avisos', tope: null, noticias: [AVISO], aMano: [], afueraPorTope: 0, minimo: 1 };
  for (const b of ['nacional', 'internacional']) for (const t of l.bloques[b].noticias) if (t.titulo.includes(ESPECTACULOS)) t.tema = 'Espectáculos';
  l.pagina.escalon = escalon;
  if (mezcla) {
    // Las dos «le falta 1» llegaron al 5.º medio: ahora son confirmadas (vía A) y van al final de las noticias de su bloque.
    for (const b of ['nacional', 'internacional']) {
      const subidas = l.bloques[b].aMano.map(t => ({ ...t, via: 'A', grupos: 5, etiqueta: 'Confirmada por 5 medios' }));
      l.bloques[b].noticias.push(...subidas);
      l.bloques[b].aMano = [];
    }
  }
  return l;
}

// Por decidir de la lista, como lo arma repartir con el estado vacío (sin avisos ni ocultas).
const porDecidir = l => l.orden.filter(k => k !== 'avisos').flatMap(k => [...l.bloques[k].noticias, ...l.bloques[k].aMano]);
const buscar = (l, titulo) => porDecidir(l).find(t => t.titulo.includes(titulo));
const urlsDe = t => t.links.map(x => x.url).filter(Boolean);

/* ───────────── el servidor de la copia ───────────── */

function servir(dir, actual) {
  const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
  const servidor = http.createServer((req, res) => {
    const nombre = req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0].slice(1);
    if (actual && nombre === 'lista.json') {
      res.writeHead(200, { 'content-type': tipos['.json'], 'cache-control': 'no-store' });
      res.end(JSON.stringify(actual.lista));
      return;
    }
    const f = path.join(dir, path.normalize(nombre).replace(/^(\.\.[/\\])+/, ''));
    fs.readFile(f, (e, d) => {
      if (e) { res.writeHead(404); res.end('no'); return; }
      res.writeHead(200, { 'content-type': tipos[path.extname(f)] || 'text/plain', 'cache-control': 'no-store' });
      res.end(d);
    });
  });
  return new Promise(resolver => servidor.listen(0, '127.0.0.1', () => resolver({ servidor, url: `http://127.0.0.1:${servidor.address().port}/` })));
}

// Se arma antes de que corra la página, y solo si todavía no hay nada (una recarga no lo pisa).
const sembrar = (page, clave, estado) => page.addInitScript(([k, v]) => {
  try { if (!localStorage.getItem(k)) localStorage.setItem(k, v); } catch (e) { /* bloqueado */ }
}, [clave, JSON.stringify(estado)]);

/* ───────────── las capturas ───────────── */

const CAPTURAS = [
  { sufijo: '390', ancho: 390, esquema: 'light' },
  { sufijo: '1200', ancho: 1200, esquema: 'light' },
  { sufijo: '390-oscuro', ancho: 390, esquema: 'dark' },
  { sufijo: 'normal-390', ancho: 390, esquema: 'light', escalon: 'normal' },
];
const CARPETA_CAPTURAS = path.join(RAIZ, 'buzon', 'capturas');
const ESPERAR = '#pivote, .nada, .franja.error';

// La ventana se estira hasta el alto de la página: así la barra fija de abajo queda abajo de todo.
async function capturar(p, ancho, ruta) {
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.setViewportSize({ width: ancho, height: alto });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: ruta });
}

// --solo-capturas: abre la página tal cual está en la carpeta (sin estado guardado ni comprobaciones) y saca las 3 capturas.
async function soloCapturas(navegador, url) {
  const rutas = [];
  for (const c of CAPTURAS.filter(x => !x.escalon)) {
    const ctx = await navegador.newContext({ viewport: { width: c.ancho, height: 900 }, locale: 'es-AR', timezoneId: 'America/Argentina/Buenos_Aires', colorScheme: c.esquema });
    const p = await ctx.newPage();
    await p.goto(url);
    await p.waitForSelector(ESPERAR, { timeout: 10000 });
    const ruta = path.join(CARPETA_CAPTURAS, `pagina-c-${NOMBRE_CAPTURAS}-${c.sufijo}.png`);
    await capturar(p, c.ancho, ruta);
    rutas.push(path.relative(RAIZ, ruta));
    await ctx.close();
  }
  return rutas;
}

async function abrirChromium() {
  try {
    return await chromium.launch({ args: ['--no-sandbox'] });
  } catch (e) {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
    const carpeta = fs.existsSync(base) ? fs.readdirSync(base).filter(n => /^chromium-\d+$/.test(n)).sort().pop() : null;
    const exe = carpeta && path.join(base, carpeta, 'chrome-linux', 'chrome');
    if (!exe || !fs.existsSync(exe)) throw new Error('No se pudo abrir Chromium (ni el de Playwright ni uno en ' + base + ')');
    return chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  }
}

async function main() {
  let dir;
  let actual = null;
  let base = null;
  if (CARPETA_SOLO) {
    dir = path.resolve(CARPETA_SOLO);
    const faltan = ['index.html', 'logica.js', 'lista.json'].filter(n => !fs.existsSync(path.join(dir, n)));
    if (faltan.length) { console.error(`En ${CARPETA_SOLO} faltan: ${faltan.join(', ')}`); process.exit(2); }
  } else {
    dir = path.join(RAIZ, 'pagina');
    base = JSON.parse(fs.readFileSync(path.join(dir, 'lista.json'), 'utf8'));
    actual = { lista: armarLista(base) };
  }
  const { servidor, url } = await servir(dir, actual);
  let navegador;
  try {
    navegador = await abrirChromium();
    if (CARPETA_SOLO) {
      fs.mkdirSync(CARPETA_CAPTURAS, { recursive: true });
      (await soloCapturas(navegador, url)).forEach(r => console.log(r));
    } else {
      await comprobar(navegador, url, base, actual);
    }
  } finally {
    if (navegador) await navegador.close();
    servidor.close();
  }
}

/* ───────────── las comprobaciones ───────────── */

async function comprobar(navegador, URL, base, actual) {
  const nuevoCtx = (extra = {}) => navegador.newContext({
    viewport: { width: 390, height: 844 }, locale: 'es-AR', timezoneId: 'America/Argentina/Buenos_Aires', colorScheme: 'light',
    permissions: ['clipboard-read', 'clipboard-write'], ...extra,
  });
  const errores = [];
  const vigilar = p => { p.on('pageerror', e => errores.push(e.message)); p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); }); };
  const abrir = async (ctx, { estado = null, clave = CLAVE } = {}) => {
    const p = await ctx.newPage();
    vigilar(p);
    if (estado) await sembrar(p, clave, estado);
    await p.goto(URL);
    await p.waitForSelector(ESPERAR);
    return p;
  };
  const texto = async (p, sel) => ((await p.locator(sel).allTextContents()).join(' | ')).trim();
  const numeros = async p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('.pestana')].map(b => [b.childNodes[0].textContent, Number(b.querySelector('.numero').textContent)])));
  const pivote = p => texto(p, '#pivote h3');
  const usar = opciones => { actual.lista = armarLista(base, opciones); return actual.lista; };
  const leerEstado = p => p.evaluate(k => JSON.parse(localStorage.getItem(k)), CLAVE);

  let lista = usar();
  const orden = porDecidir(lista);
  const total = orden.length;

  /* ── 1, 2, 3 · encabezado, pivote, avance y pestañas ── */
  console.log('# 1 · encabezado · 2 · pivote y avance · 3 · pestañas');
  let ctx = await nuevoCtx();
  let p = await abrir(ctx);
  ok(/^última vuelta \d\d:\d\d$/.test(await texto(p, '#vuelta')), '1 · el encabezado dice «' + await texto(p, '#vuelta') + '»');
  ok((await texto(p, '#actualizar')) === '↻ Actualizar', '1 · el botón dice «↻ Actualizar»');
  ok((await texto(p, '#marca')) === '7M' && (await p.title()) === '7M', '1 · el título es el nombre de la página («7M», sin cliente en la lista de ejemplo)');
  ok((await pivote(p)) === orden[0].titulo, '2 · el pivote es la primera de Por decidir: «' + orden[0].titulo + '»');
  const nNac = lista.bloques.nacional.noticias.length + lista.bloques.nacional.aMano.length;
  ok((await texto(p, '#avance span')) === `1 de ${nNac} · Nacionales`, '2 · el avance dice «' + await texto(p, '#avance span') + '»');
  ok((await p.locator('#avance .puntos i').count()) === nNac && (await p.locator('#avance .puntos i.aca').count()) === 1, '2 · un punto por noticia del bloque, el de la abierta en azul');
  ok((await texto(p, '.pestana')).replace(/\d+/g, '') === 'Por decidir | Me interesa | Archivo | No por hoy', '3 · las pestañas de Plus: ' + await texto(p, '.pestana'));
  ok(JSON.stringify(await numeros(p)) === JSON.stringify({ 'Por decidir': total, 'Me interesa': 0, Archivo: 0, 'No por hoy': 0 }), `3 · los números: ${total} por decidir (sin el aviso) y 0 en las demás`);
  ok((await p.locator('#pivote .botones .boton').allTextContents()).join('|') === 'Me interesa|No por hoy…|Archivar', '3 · Plus: tres botones, en ese orden');
  const fila = await p.locator('#pivote .meta span').allTextContents();
  ok(fila[0] === orden[0].etiqueta && fila[1] === orden[0].tema && HHMM.test(fila[2]), '2 · la fila de pastillas: sello, tema y hora (' + fila.join(' · ') + ')');
  ok((await texto(p, '#guardado-en')) === 'Tus decisiones se guardan en este navegador', '14 · la línea al pie: «Tus decisiones se guardan en este navegador»');

  /* ── 4, 5 · Me interesa y Deshacer ── */
  console.log('\n# 4 · Me interesa · 5 · Deshacer');
  await p.click('[data-accion=interesa]');
  let n = await numeros(p);
  ok(n['Por decidir'] === total - 1 && n['Me interesa'] === 1, '4 · Por decidir baja 1 y Me interesa sube 1');
  ok((await pivote(p)) === orden[1].titulo, '4 · sube la siguiente: «' + orden[1].titulo + '»');
  ok((await texto(p, '#deshacer-texto')) === 'Mandada a “Me interesa”' && (await p.isVisible('#deshacer')), '4 · aparece «Mandada a “Me interesa” · Deshacer»');
  ok((await texto(p, '#cuenta')) === 'Me interesa: 1' && (await texto(p, '#copiar')) === 'Copiar la 1', '4 · la barra: «Me interesa: 1» y «Copiar la 1»');
  await p.click('#deshacer-boton');
  n = await numeros(p);
  ok(n['Por decidir'] === total && n['Me interesa'] === 0 && (await pivote(p)) === orden[0].titulo, '5 · Deshacer: los números vuelven y el pivote vuelve a ser la misma');
  ok(!(await p.isVisible('#deshacer')), '5 · la franja se va al deshacer');
  await p.click('[data-accion=archivo]');
  await p.waitForTimeout(6500);
  ok(!(await p.isVisible('#deshacer')), '5 · a los 6 segundos la franja se va sola');
  await p.click('[data-pestana=archivo]');
  await p.click('#archivo button:has-text("Volver")');
  await p.click('[data-pestana=decidir]');

  /* ── 6 · No por hoy y los motivos ── */
  console.log('\n# 6 · No por hoy');
  await p.click('[data-accion=nopor]');
  ok((await texto(p, '.porque')) === 'No por hoy. ¿Por qué?', '6 · «No por hoy. ¿Por qué?»');
  ok(JSON.stringify(await p.locator('.chip').allTextContents()) === JSON.stringify(MOTIVOS), '6 · los siete chips, con los textos exactos');
  await p.click('[data-accion=volver-chips]');
  ok((await p.locator('#pivote .botones > .boton').count()) === 3 && (await numeros(p))['No por hoy'] === 0, '6 · «‹ Volver» cierra los chips sin decidir');
  const primera = await pivote(p);
  await p.click('[data-accion=nopor]');
  await p.click('.chip:has-text("Opinión o reacción a otra")');
  ok((await texto(p, '#deshacer-texto')) === 'Mandada a “No por hoy”', '6 · «Mandada a “No por hoy” · Deshacer»');
  await p.click('[data-accion=nopor]');
  await p.click('[data-motivo=otro]');
  ok(await p.isVisible('.otro input'), '6 · «Otro motivo…» muestra el renglón para escribir');
  await p.click('[data-accion=listo]');
  ok((await numeros(p))['No por hoy'] === 1, '6 · con el renglón vacío «Listo» no hace nada');
  await p.fill('.otro input', 'hay cosas más importantes');
  await p.click('[data-accion=listo]');
  await p.click('[data-pestana=nopor]');
  const pastillas = await p.locator('#no-por-hoy .pastilla').allTextContents();
  ok(pastillas.includes('Opinión o reacción a otra') && pastillas.includes('Otro: hay cosas más importantes'), '6 · en No por hoy: ' + pastillas.join(' · '));
  ok((await p.locator('#no-por-hoy .titulo').first().textContent()) !== primera, '6 · de la más nueva a la más vieja');
  for (let i = 0; i < 2; i++) await p.click('#no-por-hoy button:has-text("Volver") >> nth=0');
  await p.click('[data-pestana=decidir]');

  /* ── 7 · Archivar ── */
  console.log('\n# 7 · Archivar');
  const archivada = await pivote(p);
  await p.click('[data-accion=archivo]');
  const archivada2 = await pivote(p);
  await p.click('[data-accion=archivo]');
  await p.click('[data-pestana=archivo]');
  ok((await p.locator('#archivo .corta').count()) === 2 && /^archivada \d\d:\d\d$/.test(await p.locator('#archivo .cuando').first().textContent()), '7 · en Archivo, con «archivada HH:MM»');
  ok((await p.locator('#archivo .titulo').first().textContent()) === archivada2, '7 · de la más nueva a la más vieja');
  await p.click('#archivo .corta:has-text("' + archivada2.slice(0, 30) + '") button:has-text("Me interesa")');
  ok((await numeros(p))['Me interesa'] === 1 && (await numeros(p)).Archivo === 1, '7 · «Me interesa» desde Archivo la pasa a Me interesa');
  await p.click('#archivo button:has-text("Volver")');
  n = await numeros(p);
  ok(n.Archivo === 0 && n['Por decidir'] === total - 1, '7 · «Volver» la devuelve a Por decidir');
  await p.click('[data-pestana=decidir]');
  ok((await pivote(p)) !== archivada && (await p.locator('.renglon', { hasText: archivada.slice(0, 30) }).count()) === 1, '7 · vuelve como renglón, sin volverse pivote');

  /* ── 8 · tocar un renglón ── */
  console.log('\n# 8 · un renglón');
  const renglon = p.locator('.renglon').nth(2);
  const titRenglon = await renglon.getAttribute('aria-label');
  await renglon.click();
  ok((await pivote(p)) === titRenglon, '8 · tocar un renglón lo sube al pivote: «' + titRenglon + '»');
  ok((await p.locator('.renglon', { hasText: titRenglon }).count()) === 0, '8 · el pivote no se repite como renglón');
  const mano = buscar(lista, 'Rescataron');
  ok((await p.locator('.renglon', { hasText: mano.titulo }).locator('.cant').textContent()) === `${mano.grupos}/${lista.minGrupos}`, '8 · la «le falta 1» lleva «4/5» en su renglón');

  /* ── 9 · temas ── */
  console.log('\n# 9 · temas');
  ok((await texto(p, '.sintema')) === 'Sin tema', '9 · «Sin tema» siempre se ve');
  const antesTema = (await numeros(p))['Por decidir'];
  await p.click('.tema:has-text("Espectáculos")');
  ok((await p.getAttribute('.tema:has-text("Espectáculos")', 'aria-pressed')) === 'false', '9 · el botón queda apagado');
  ok((await numeros(p))['Por decidir'] === antesTema - 1 && (await p.locator('.renglon', { hasText: ESPECTACULOS }).count()) === 0, '9 · apagar «Espectáculos» oculta su noticia y baja el número');
  ok((await texto(p, '#ocultas')) === '1 oculta por tema (Espectáculos) · ver', '9 · «' + await texto(p, '#ocultas') + '»');
  await p.click('[data-accion=ver-ocultas]');
  ok((await p.locator('.renglon', { hasText: ESPECTACULOS }).count()) === 1 && (await numeros(p))['Por decidir'] === antesTema - 1, '9 · «ver» la muestra como renglón (el número no la cuenta)');
  await p.click('.tema:has-text("Espectáculos")');
  await ctx.close();

  /* ── 10, 11 · Me interesa, Copiar y el aviso ── */
  console.log('\n# 10 · Copiar · 11 · el aviso');
  ctx = await nuevoCtx();
  p = await abrir(ctx);
  ok((await texto(p, '#avisos h2')) === 'Avisos · 1' && (await p.locator('#avisos button:has-text("Me interesa")').count()) === 1, '11 · el aviso tiene «Me interesa» en su franja');
  ok((await p.locator('.renglon', { hasText: AVISO.titulo }).count()) === 0 && (await pivote(p)) !== AVISO.titulo, '11 · nunca aparece en Por decidir');
  const elegidas = [];
  elegidas.push(await pivote(p));
  await p.click('[data-accion=interesa]');
  await p.click('#avisos button:has-text("Me interesa")');
  ok((await texto(p, '#avisos .estado-aviso')) === 'En Me interesa' && (await numeros(p))['Me interesa'] === 2, '11 · tocado dice «En Me interesa» y cuenta en Me interesa');
  ok((await numeros(p))['Por decidir'] === total - 1, '11 · el aviso no cuenta en Por decidir');
  elegidas.push(AVISO.titulo);
  await p.locator('.renglon').nth(3).click();
  elegidas.push(await pivote(p));
  await p.click('[data-accion=interesa]');
  await p.click('[data-pestana=interesa]');
  ok((await texto(p, '#me-interesa h2')) === 'Para llevar · 3', '10 · «Para llevar · 3»');
  ok(JSON.stringify(await p.locator('#me-interesa .titulo').allTextContents()) === JSON.stringify(elegidas), '10 · en el orden en que se eligieron');
  ok((await texto(p, '#copiar')) === 'Copiar las 3', '10 · «Copiar las 3»');
  await p.click('#copiar');
  await p.waitForFunction(() => document.getElementById('mensaje').textContent.length > 0);
  const pegado = await p.evaluate(() => navigator.clipboard.readText());
  ok(pegado.startsWith(elegidas[0] + '\n'), '10 · lo copiado empieza por el título de la primera elegida');
  ok(pegado.includes('Corte de agua programado · sábado 17/10 desde las 00:00, 18 h · Zona Sur y Zona Central'), '10 · el aviso se copia en una línea, en su lugar');
  ok((await texto(p, '#mensaje')) === 'Copiadas. Ya podés pegarlas.', '10 · «Copiadas. Ya podés pegarlas.»');
  ok((await texto(p, '#me-interesa h2')) === 'Para llevar · 0' && (await p.locator('#me-interesa .llevada').count()) === 3, '10 · «Para llevar» queda vacío y las tres pasan a «Llevadas hoy»');
  ok(/Te lo llevaste a las \d\d:\d\d/.test(await texto(p, '#me-interesa .llevada .hora-llevada')) && /Te la llevaste a las \d\d:\d\d/.test(await texto(p, '#me-interesa .llevada .hora-llevada')), '10 · «Te la llevaste…» y, en el aviso, «Te lo llevaste…»');
  ok(await p.isDisabled('#copiar'), '10 · el botón queda apagado');
  ok(/^Te lo llevaste · \d\d:\d\d$/.test(await texto(p, '#avisos .estado-aviso')), '11 · el aviso dice «Te lo llevaste · HH:MM» en su franja');

  /* ── 15 · recargar ── */
  console.log('\n# 15 · recargar');
  const antesRecarga = await numeros(p);
  await p.click('[data-pestana=decidir]');
  await p.locator('.renglon').nth(1).click();
  await p.reload();
  await p.waitForSelector(ESPERAR);
  ok(JSON.stringify(await numeros(p)) === JSON.stringify(antesRecarga), '15 · al recargar, las decisiones siguen (números iguales)');
  ok((await pivote(p)) === orden.find(t => !elegidas.includes(t.titulo)).titulo, '15 · y el pivote vuelve a ser la primera de Por decidir');
  ok((await p.getAttribute('[data-pestana=decidir]', 'aria-selected')) === 'true', '15 · arranca en Por decidir');
  await ctx.close();

  /* ── 12 · la mezcla ── */
  console.log('\n# 12 · la mezcla');
  const H = new Date(Date.now() - 2 * 3600e3).toISOString();
  const rescate = buscar(lista, 'Rescataron');
  const chile = buscar(lista, 'Chile declaró');
  lista = usar({ mezcla: true });
  ctx = await nuevoCtx();
  p = await abrir(ctx, { estado: { version: 2, decisiones: [
    { urls: urlsDe(rescate), que: 'archivo', hora: H, sello: 'mano', grupos: 4, minimo: 5 },
    { urls: urlsDe(chile), que: 'nopor', motivo: 'vieja', hora: H, sello: 'mano', grupos: 4, minimo: 5 },
  ], llevadas: [], subidas: [], temasApagados: [] } });
  ok((await pivote(p)) === rescate.titulo, '12 · E9: la que estaba en Archivo vuelve primera de todas y es el pivote');
  ok((await texto(p, '#avance span')) === '1 de 1 · Subieron a confirmada', '12 · E9: el avance dice «1 de 1 · Subieron a confirmada»');
  ok((await texto(p, '#pivote .subio')).startsWith('↳ Subió a confirmada. A las ') && (await texto(p, '#pivote .subio')).endsWith(' la habías archivado'), '12 · E9: «' + await texto(p, '#pivote .subio') + '»');
  ok((await texto(p, '#pivote .meta .sello')) === 'Confirmada por 5 medios', '12 · E9: con el sello verde de la lista');
  ok((await texto(p, '#subieron')) === '1 que mandaste a No por hoy subió a confirmada · ver', '12 · E10: «' + await texto(p, '#subieron') + '»');
  await p.click('[data-accion=ver-subieron]');
  ok((await p.getAttribute('[data-pestana=nopor]', 'aria-selected')) === 'true', '12 · E10: «ver» abre No por hoy');
  const meta = await p.locator('#no-por-hoy .corta', { hasText: chile.titulo }).locator('.meta span').allTextContents();
  ok(meta.join(' · ') === 'Confirmada por 5 medios · Subió a confirmada · Ya pasó, llegó tarde', '12 · E10: en No por hoy, sello verde, «Subió a confirmada» y su motivo (' + meta.join(' · ') + ')');
  await ctx.close();
  ctx = await nuevoCtx();
  p = await abrir(ctx, { estado: { version: 2, decisiones: [{ urls: urlsDe(rescate), que: 'interesa', hora: H, sello: 'mano', grupos: 4, minimo: 5 }] } });
  await p.click('[data-pestana=interesa]');
  ok((await texto(p, '#me-interesa .subio')) === '↳ Era 4 de 5 cuando la elegiste; ahora confirmada', '12 · E10: en Me interesa, «↳ Era 4 de 5 cuando la elegiste; ahora confirmada»');
  ok((await texto(p, '#me-interesa .sello')) === 'Confirmada por 5 medios', '12 · E10: el sello se dibuja con la lista de ahora');
  ok((await leerEstado(p)).decisiones[0].subio === true, '12 · E10: la decisión queda con subio: true');
  await ctx.close();
  lista = usar();

  /* ── 13 · estado viejo ── */
  console.log('\n# 13 · estado viejo');
  ctx = await nuevoCtx();
  const llevadaVieja = { urls: urlsDe(orden[0]), hora: new Date(Date.now() - 3600e3).toISOString() };
  p = await abrir(ctx, { clave: CLAVE_V1, estado: { vistas: { [urlsDe(orden[0])[0]]: llevadaVieja.hora }, llevadas: [llevadaVieja], vistasConfirmadas: {} } });
  const guardado = await leerEstado(p);
  ok(guardado && guardado.version === 2 && JSON.stringify(guardado.llevadas) === JSON.stringify([llevadaVieja]) && guardado.decisiones.length === 0, '13 · queda v2 con sus llevadas');
  ok((await p.evaluate(k => localStorage.getItem(k), CLAVE_V1)) === null, '13 · la clave v1 ya no existe');
  ok((await pivote(p)) === orden[1].titulo, '13 · lo llevado no vuelve a Por decidir');
  await ctx.close();

  /* ── 3 · el escalón Normal ── */
  console.log('\n# 3 · Normal');
  lista = usar({ escalon: 'normal' });
  ctx = await nuevoCtx();
  p = await abrir(ctx);
  ok((await texto(p, '.pestana')).replace(/\d+/g, '') === 'Por decidir | Me interesa | Pasadas', '3 · Normal: Por decidir · Me interesa · Pasadas');
  ok((await p.locator('#pivote .botones .boton').allTextContents()).join('|') === 'Me interesa|Siguiente', '3 · Normal: dos botones, «Me interesa» y «Siguiente»');
  ok(await p.isHidden('#temas'), '3 · Normal: sin la fila de temas');
  await p.click('[data-accion=siguiente]');
  ok((await texto(p, '#deshacer-texto')) === 'Pasada' && (await numeros(p)).Pasadas === 1, '3 · Normal: «Siguiente» la manda a Pasadas («Pasada · Deshacer»)');
  await ctx.close();
  lista = usar();

  /* ── 16 · medidas y las capturas ── */
  console.log('\n# 16 · medidas y capturas' + (NOMBRE_CAPTURAS ? ' (se guardan en buzon/capturas/)' : ' (sin --capturas no se guarda nada)'));
  if (NOMBRE_CAPTURAS) fs.mkdirSync(CARPETA_CAPTURAS, { recursive: true });
  for (const c of CAPTURAS) {
    lista = usar({ escalon: c.escalon || 'plus' });
    ctx = await nuevoCtx({ colorScheme: c.esquema, viewport: { width: c.ancho, height: 900 } });
    // Una elegida, para que se vea la barra con algo.
    p = await abrir(ctx, { estado: { version: 2, decisiones: [{ urls: urlsDe(buscar(lista, 'Diputados')), que: 'interesa', hora: new Date().toISOString(), sello: 'A', grupos: 6, minimo: 5 }] } });
    if (c.sufijo === '1200') {
      ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '16 · 1200: sin scroll horizontal');
    }
    if (c.sufijo === '390') {
      const altos = await p.locator('#pivote .botones .boton').evaluateAll(bs => bs.map(b => b.getBoundingClientRect().height));
      ok(altos.length === 3 && altos.every(a => a >= 44), '16 · 390: ningún botón de la abierta mide menos de 44 px (' + altos.map(Math.round).join(', ') + ')');
      ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '16 · 390: sin scroll horizontal');
      ok(await p.evaluate(() => { const n = document.getElementById('pestanas'); return n.scrollWidth <= n.clientWidth; }), '16 · 390: las cuatro pestañas entran sin correrlas');
    }
    ok((await p.locator('#pivote').count()) === 1 && (await texto(p, '#cuenta')) === 'Me interesa: 1', `captura (${c.sufijo}): pivote abierto y «Me interesa: 1»`);
    if (NOMBRE_CAPTURAS) await capturar(p, c.ancho, path.join(CARPETA_CAPTURAS, `pagina-c-${NOMBRE_CAPTURAS}-${c.sufijo}.png`));
    await ctx.close();
  }

  console.log('');
  ok(errores.length === 0, 'sin errores en la consola en ningún escenario' + (errores.length ? ': ' + JSON.stringify(errores) : ''));
}

main()
  .then(() => {
    if (CARPETA_SOLO) process.exit(0);
    console.log(`\n${bien} bien, ${mal} mal`);
    process.exit(mal ? 1 : 0);
  })
  .catch(e => {
    if (/No se pudo abrir Chromium/.test(e.message)) { console.error(e.message); process.exit(2); }
    console.error('EXPLOTÓ:', e);
    process.exit(1);
  });
