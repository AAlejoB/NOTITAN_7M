#!/usr/bin/env node
'use strict';
/**
 * Prueba la página (pagina/index.html) en Chromium: lo que `npm test` no ve, porque vive en el navegador
 * (el orden de traer(), los colores de los sellos, lo apagado de lo llevado, el portapapeles, el estado guardado).
 * Se corre con `npm run probar-pagina`; con `-- --capturas <nombre>` además guarda 3 capturas en buzon/capturas/
 * (pagina-<nombre>-390.png, -1200.png y -390-oscuro.png). Necesita Playwright (npm i --no-save playwright) y un Chromium.
 * Sirve una COPIA de pagina/ en una carpeta temporal: nunca escribe pagina/lista.json ni usa la red de afuera.
 * Una línea por comprobación (bien / MAL) y al final «N bien, M mal»; código 0 si no hay MAL, 1 si hay, 2 si falta Playwright.
 */
const fs = require('fs');
const os = require('os');
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
const CLAVE = '7m-marcas-v1';
const arg = process.argv.indexOf('--capturas');
const NOMBRE_CAPTURAS = arg >= 0 ? process.argv[arg + 1] : null;
if (arg >= 0 && (!NOMBRE_CAPTURAS || NOMBRE_CAPTURAS.startsWith('--'))) {
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

const VIOLETA = { claro: 'rgb(106, 63, 181)', oscuro: 'rgb(196, 168, 255)' };
const NARANJA = { claro: 'rgb(138, 82, 0)', oscuro: 'rgb(242, 182, 80)' };
const VERDE_OSCURO = 'rgb(98, 212, 147)';

// La opacidad que se ve: la del elemento por la de todos sus padres.
const opacidad = loc => loc.evaluate(el => {
  let o = 1;
  for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
  return Math.round(o * 100) / 100;
});
const color = loc => loc.evaluate(el => getComputedStyle(el).color);

/* ───────────── la copia de la página y su servidor ───────────── */

function armarCopia() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'probar-pagina-'));
  fs.cpSync(path.join(RAIZ, 'pagina'), dir, { recursive: true });
  const f = path.join(dir, 'lista.json');
  const lista = JSON.parse(fs.readFileSync(f, 'utf8'));
  lista.generadaEn = new Date().toISOString();
  fs.writeFileSync(f, JSON.stringify(lista, null, 2));
  return { dir, lista };
}

function servir(dir) {
  const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
  const servidor = http.createServer((req, res) => {
    const nombre = req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0];
    const f = path.join(dir, path.normalize(nombre).replace(/^(\.\.[/\\])+/, ''));
    fs.readFile(f, (e, d) => {
      if (e) { res.writeHead(404); res.end('no'); return; }
      res.writeHead(200, { 'content-type': tipos[path.extname(f)] || 'text/plain', 'cache-control': 'no-store' });
      res.end(d);
    });
  });
  return new Promise(resolver => servidor.listen(0, '127.0.0.1', () => resolver({ servidor, url: `http://127.0.0.1:${servidor.address().port}/` })));
}

/* ───────────── lo que se arma en localStorage ───────────── */

const todas = lista => ['nacional', 'internacional'].flatMap(b => [...lista.bloques[b].noticias, ...lista.bloques[b].aMano]);
const urlsDe = t => t.links.map(l => l.url);
const tarjeta = (lista, titulo) => todas(lista).find(t => t.titulo.includes(titulo));

// Todo visto hace una hora (las de la vía A, también como confirmadas), menos lo que se pide:
// `recien` (vista, pero no como confirmada), `sinVer` (no vista) y `llevar` (llevada hace 5 min).
function estadoDe(lista, { recien = [], sinVer = [], llevar = [] } = {}) {
  const hace = min => new Date(Date.now() - min * 60000).toISOString();
  const est = { vistas: {}, vistasConfirmadas: {}, llevadas: [] };
  const de = nombres => nombres.map(n => tarjeta(lista, n));
  const quitar = de(sinVer);
  const sinConfirmar = de(recien);
  for (const t of todas(lista)) {
    if (quitar.includes(t)) continue;
    for (const u of urlsDe(t)) {
      est.vistas[u] = hace(60);
      if (t.via === 'A' && !sinConfirmar.includes(t)) est.vistasConfirmadas[u] = hace(60);
    }
  }
  for (const t of de(llevar)) est.llevadas.push({ urls: urlsDe(t), hora: hace(5) });
  return est;
}

// Se arma antes de que corra la página, y solo si todavía no hay nada (una recarga no lo pisa).
const sembrar = (page, estado) => page.addInitScript(([k, v]) => {
  try { if (!localStorage.getItem(k)) localStorage.setItem(k, v); } catch (e) { /* bloqueado */ }
}, [CLAVE, JSON.stringify(estado)]);

// Lo que se ve en las capturas: una «Recién confirmada», una «Nueva» y una 4/5 llevada.
const estadoCaptura = lista => estadoDe(lista, { recien: ['Paro general'], sinVer: ['dólar blue'], llevar: ['Rescataron'] });

/* ───────────── las comprobaciones ───────────── */

async function main() {
  const { dir, lista } = armarCopia();
  const { servidor, url } = await servir(dir);
  let navegador;
  try {
    try {
      navegador = await chromium.launch({ args: ['--no-sandbox'] });
    } catch (e) {
      const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
      const carpeta = fs.existsSync(base) ? fs.readdirSync(base).filter(n => /^chromium-\d+$/.test(n)).sort().pop() : null;
      const exe = carpeta && path.join(base, carpeta, 'chrome-linux', 'chrome');
      if (!exe || !fs.existsSync(exe)) throw new Error('No se pudo abrir Chromium (ni el de Playwright ni uno en ' + base + ')');
      navegador = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
    }
    await comprobar(navegador, url, lista);
  } finally {
    if (navegador) await navegador.close();
    servidor.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function comprobar(navegador, URL, lista) {
  const nuevoCtx = (extra = {}) => navegador.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-AR', timezoneId: 'America/Argentina/Buenos_Aires', colorScheme: 'light', ...extra });
  const errores = [];
  const vigilar = p => { p.on('pageerror', e => errores.push(e.message)); p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); }); };
  const abrir = async (ctx, { estado, vigilada = true } = {}) => {
    const p = await ctx.newPage();
    if (vigilada) vigilar(p);
    if (estado) await sembrar(p, estado);
    await p.goto(URL);
    await p.waitForSelector('.noticia');
    return p;
  };
  const tildar = (p, bloque, n) => p.locator('.bloque').nth(bloque).locator('article.noticia input[type=checkbox]').nth(n).check();
  const carta = (p, titulo) => p.locator('article.noticia', { hasText: titulo }).first();
  const lleva = (p, titulo) => p.locator('article.noticia.llevada', { hasText: titulo }).first();
  const pastillas = (p, titulo) => carta(p, titulo).locator('.recien, .nueva').evaluateAll(es => es.map(e => e.textContent));

  /* ── 1 · el flujo completo: tildar, 4/5, copiar, recargar, traer ── */
  console.log('\n# 1 · tildar, copiar, recargar y traer');
  let ctx = await nuevoCtx({ permissions: ['clipboard-read', 'clipboard-write'] });
  let p = await abrir(ctx);
  await tildar(p, 0, 1);
  await p.locator('.amano button', { hasText: 'Llevármela igual' }).first().click();
  ok((await p.textContent('#cuenta')) === '2 elegidas', 'la barra dice «2 elegidas»');
  ok((await p.textContent('#copiar')) === 'Copiar las 2', 'el botón dice «Copiar las 2»');
  ok((await p.locator('.amano button').first().textContent()) === 'Sacar', 'la 4/5 tildada dice «Sacar»');
  ok((await p.locator('.franja.ejemplo').textContent()) === 'Datos de ejemplo, inventados', 'la franja «Datos de ejemplo, inventados» está (ejemplo: true)');
  const elegidas = await p.evaluate(() => [...document.querySelectorAll('.noticia.tildada h3, .noticia.tildada h4')].map(e => e.textContent));
  await p.click('#copiar');
  await p.waitForFunction(() => document.getElementById('mensaje').textContent.length > 0);
  ok((await p.textContent('#mensaje')) === 'Copiadas. Ya podés pegarlas.', 'aparece «Copiadas. Ya podés pegarlas.»');
  const portapapeles = await p.evaluate(() => navigator.clipboard.readText());
  ok(elegidas.length === 2 && elegidas.every(t => portapapeles.includes(t)), 'el portapapeles trae los títulos de las 2 elegidas');
  ok(!/Confirmada por|Respaldada por|elegida a mano|Nueva|Recién confirmada/.test(portapapeles), 'el texto copiado no lleva el sello ni pastillas');
  ok(/^[^\n]+\n(?:[^\n]+\n)*[A-Za-zÁ-ú+/ 0-9]+: https?:\/\//m.test(portapapeles), 'el texto copiado trae renglones «Medio: url»');
  ok((await p.textContent('#cuenta')) === '0 elegidas', 'después de copiar se destilda todo');
  ok((await p.locator('.noticia.llevada').count()) === 2, 'las 2 copiadas bajan al fondo como llevadas');
  const hora = await p.locator('.hora-llevada').first().textContent();
  ok(/^Te la llevaste a las \d\d:\d\d$/.test(hora), 'la llevada dice «' + hora + '»');
  ok((await p.locator('.bloque').first().locator('h2').textContent()) === 'Nacionales · 7', 'lo llevado sigue contando para el tope («Nacionales · 7»)');
  await p.reload();
  await p.waitForSelector('.noticia');
  ok((await p.locator('.nueva, .recien').count()) === 0, 'al recargar, nada es «Nueva» ni «Recién confirmada»');
  const ll = p.locator('.noticia.llevada');
  ok((await ll.count()) === 2 && (await opacidad(ll.first().locator('h3'))) === 0.6, 'al recargar, lo llevado sigue apagado (título al 0,6)');
  await tildar(p, 0, 0);
  await p.click('#traer');
  await p.waitForTimeout(400);
  ok((await p.textContent('#cuenta')) === '1 elegida', '«Traer noticias» no pierde lo tildado');
  await ctx.close();

  /* ── 2 · el portapapeles bloqueado ── */
  console.log('\n# 2 · portapapeles bloqueado');
  ctx = await nuevoCtx();
  p = await ctx.newPage();
  await p.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('no')) } }); });
  await p.goto(URL);
  await p.waitForSelector('.noticia');
  await tildar(p, 0, 0);
  await p.click('#copiar');
  await p.waitForSelector('#manual:not([hidden])');
  ok(await p.locator('#manual').isVisible(), 'si el portapapeles falla, aparece el cuadro para copiar a mano');
  ok((await p.inputValue('#manual-cuadro')).length > 20, 'el cuadro trae el texto');
  await ctx.close();

  /* ── 3 · lista vieja, lista que no carga, sin localStorage, modo oscuro ── */
  console.log('\n# 3 · lista vieja, error, sin localStorage y modo oscuro');
  ctx = await nuevoCtx();
  p = await ctx.newPage();
  await p.route('**/lista.json', r => r.fulfill({ json: { ...lista, generadaEn: new Date(Date.now() - 125 * 60000).toISOString(), ejemplo: false } }));
  await p.goto(URL);
  await p.waitForSelector('.noticia');
  ok((await p.textContent('#actualizada')) === 'Actualizada hace 2 h 5 min', 'una lista de hace 2 h 5 min dice «' + (await p.textContent('#actualizada')) + '»');
  ok(/^No se actualiza desde las \d\d:\d\d$/.test(await p.locator('.franja.vieja').textContent()), 'el aviso ámbar dice «' + (await p.locator('.franja.vieja').textContent()) + '»');
  ok((await p.locator('.franja.ejemplo').count()) === 0, 'sin la franja de ejemplo cuando ejemplo es false');
  await ctx.close();

  ctx = await nuevoCtx();
  p = await ctx.newPage();
  let fallar = true;
  await p.route('**/lista.json', r => (fallar ? r.abort() : r.continue()));
  await p.goto(URL);
  await p.waitForSelector('.franja.error');
  ok((await p.locator('.franja.error span').textContent()) === 'No se pudo traer la lista. Probá de nuevo en un rato.', 'una lista que no carga muestra el mensaje de error');
  fallar = false;
  await p.click('.franja.error button');
  await p.waitForSelector('.noticia');
  ok((await p.locator('.franja.error').count()) === 0, '«Reintentar» trae la lista y saca el error');
  await ctx.close();

  ctx = await nuevoCtx();
  p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('bloqueado'); } }); });
  await p.goto(URL);
  await p.waitForSelector('.noticia');
  ok(errs.length === 0 && (await p.locator('.nueva').count()) === 12, 'con localStorage bloqueado la página anda, todo «Nueva» y sin errores');
  await p.click('#traer');
  await p.waitForTimeout(300);
  ok((await p.locator('.nueva').count()) === 12 && errs.length === 0, 'con localStorage bloqueado, «Nueva» dura la visita aunque se traiga de nuevo');
  await ctx.close();

  ctx = await nuevoCtx({ colorScheme: 'dark' });
  p = await abrir(ctx);
  const fondo = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok(fondo !== 'rgb(244, 245, 247)' && fondo !== 'rgb(255, 255, 255)', 'en modo oscuro el fondo cambia (' + fondo + ')');
  await ctx.close();

  /* ── 4 · «Nueva» y «Recién confirmada» ── */
  console.log('\n# 4 · «Nueva» y «Recién confirmada»');
  const [t1, t2, t3] = lista.bloques.nacional.noticias.slice(0, 3).map(t => t.titulo.slice(0, 20));
  const est = estadoDe(lista, { recien: [t1], sinVer: [t3] });
  ctx = await nuevoCtx();
  p = await abrir(ctx, { estado: est });
  ok(JSON.stringify(await pastillas(p, t1)) === '["Recién confirmada"]', 'vista sin la etiqueta de confirmada: 1.ª dice «Recién confirmada», sin «Nueva»');
  ok((await pastillas(p, t2)).length === 0, 'vista y ya confirmada: la 2.ª no lleva pastilla');
  ok(JSON.stringify(await pastillas(p, t3)) === '["Nueva"]', 'nunca vista: la 3.ª dice «Nueva»');
  ok((await p.locator('.recien').count()) === 1 && (await p.locator('.nueva').count()) === 1, 'en total hay 1 «Recién confirmada» y 1 «Nueva»');
  await p.click('#traer');
  await p.waitForTimeout(300);
  ok(JSON.stringify(await pastillas(p, t1)) === '["Recién confirmada"]' && JSON.stringify(await pastillas(p, t3)) === '["Nueva"]', '«Traer noticias» no empieza una visita nueva: siguen la 1.ª y la 3.ª');
  const guardado = await p.evaluate(k => JSON.parse(localStorage.getItem(k)), CLAVE);
  ok(urlsDe(tarjeta(lista, t1)).every(u => u in guardado.vistasConfirmadas), 'lo guardado ahora tiene a la 1.ª en vistasConfirmadas');
  await p.reload();
  await p.waitForSelector('.noticia');
  ok((await p.locator('.nueva, .recien').count()) === 0, 'al recargar, ninguna lleva pastilla');
  await ctx.close();

  // Una versión de la lista donde «El dólar blue» es una 4/5 (abajo, en observación)
  const dolar = 'dólar blue';
  const variante = JSON.parse(JSON.stringify(lista));
  const bn = variante.bloques.nacional;
  const i = bn.noticias.findIndex(t => t.titulo.includes(dolar));
  const [mov] = bn.noticias.splice(i, 1);
  bn.aMano.push({ ...mov, via: 'mano', grupos: 4, etiqueta: 'Confirmada por 4 medios · elegida a mano' });

  // E10: sin recargar, una 4/5 que al traer de nuevo ya está arriba como confirmada
  ctx = await nuevoCtx();
  p = await ctx.newPage();
  vigilar(p);
  let servida = variante;
  await p.route('**/lista.json', r => r.fulfill({ json: servida }));
  await p.goto(URL);
  await p.waitForSelector('.noticia');
  await p.reload();
  await p.waitForSelector('.noticia');
  ok((await p.locator('.amano', { hasText: dolar }).count()) === 1, 'la 4/5 está abajo, en observación');
  servida = lista;
  await p.click('#traer');
  await p.waitForTimeout(300);
  ok(JSON.stringify(await pastillas(p, dolar)) === '["Recién confirmada"]', 'una 4/5 que ya vio y sube a confirmada, sin recargar: «Recién confirmada» (no «Nueva»)');
  await p.click('#traer');
  await p.waitForTimeout(300);
  ok(JSON.stringify(await pastillas(p, dolar)) === '["Recién confirmada"]', '«Recién confirmada» sigue al traer otra vez');
  await p.reload();
  await p.waitForSelector('.noticia');
  ok((await pastillas(p, dolar)).length === 0, 'al recargar, ya no lleva pastilla');
  await ctx.close();

  // E3: se la lleva como 4/5 y después sube a confirmada
  ctx = await nuevoCtx({ permissions: ['clipboard-read', 'clipboard-write'] });
  p = await ctx.newPage();
  vigilar(p);
  servida = variante;
  await p.route('**/lista.json', r => r.fulfill({ json: servida }));
  await p.goto(URL);
  await p.waitForSelector('.noticia');
  await p.locator('.amano article', { hasText: dolar }).locator('button').click();
  await p.click('#copiar');
  await p.waitForFunction(() => document.getElementById('mensaje').textContent.length > 0);
  servida = lista;
  await p.click('#traer');
  await p.waitForTimeout(300);
  const baja = lleva(p, dolar);
  ok((await baja.count()) === 1 && /^Te la llevaste a las \d\d:\d\d$/.test(await baja.locator('.hora-llevada').textContent()), 'se la llevó como 4/5 y después sube: baja con «Te la llevaste a las HH:MM»');
  ok((await baja.locator('.recien, .nueva').count()) === 0, 'lo llevado va sin pastillas');
  const normal = await color(carta(p, 'Paro general').locator('.sello'));
  ok((await baja.locator('.sello.mano').count()) === 0 && (await color(baja.locator('.sello'))) === normal, 'el sello de esa llevada es verde (vía A), no naranja');
  await ctx.close();

  /* ── 5 · los colores de los sellos ── */
  console.log('\n# 5 · colores de los sellos');
  for (const esquema of ['claro', 'oscuro']) {
    ctx = await nuevoCtx({ colorScheme: esquema === 'claro' ? 'light' : 'dark' });
    p = await abrir(ctx, { estado: estadoCaptura(lista) });
    const viab = p.locator('.sello.viab');
    ok((await viab.count()) === 2 && (await color(viab.first())) === VIOLETA[esquema] && (await color(viab.last())) === VIOLETA[esquema], `vía B (2, una por bloque): violeta ${VIOLETA[esquema]} (${esquema})`);
    ok((await color(lleva(p, 'Rescataron').locator('.sello.mano'))) === NARANJA[esquema], `4/5 llevada: naranja ${NARANJA[esquema]} (${esquema})`);
    await ctx.close();
  }

  /* ── 6 · lo llevado: apagado salvo el sello y la hora (S1 a S4) ── */
  console.log('\n# 6 · lo llevado, apagado salvo el sello y la hora');
  ctx = await nuevoCtx();
  p = await abrir(ctx, { estado: estadoCaptura(lista) });
  let s1 = lleva(p, 'Rescataron');
  ok((await color(s1.locator('.sello'))) === NARANJA.claro && (await opacidad(s1.locator('.sello'))) === 1, 'S1 · 4/5 llevada, claro: sello naranja rgb(138, 82, 0), opacidad 1');
  ok((await opacidad(s1.locator('h3'))) === 0.6, 'S1 · el título llevado se ve al 0,6');
  ok((await opacidad(s1.locator('.hora-llevada'))) === 1, 'S1 · «Te la llevaste a las…» al 1');
  ok((await opacidad(s1.locator('.links'))) === 0.6 && (await opacidad(s1.locator('.fila input'))) === 0.6, 'S1 · los links y la casilla llevados se ven al 0,6');
  const s4 = carta(p, 'dólar blue');
  ok((await opacidad(s4.locator('.sello'))) === 1 && (await opacidad(s4.locator('h3'))) === 1 && (await s4.locator('.hora-llevada').count()) === 0, 'S4 · una confirmada que no se llevó: sello 1, título 1 y sin hora');
  await s1.locator('.fila input').check();
  s1 = lleva(p, 'Rescataron');
  ok((await s1.evaluate(e => e.classList.contains('tildada'))) && (await opacidad(s1.locator('.sello'))) === 1 && (await opacidad(s1.locator('.hora-llevada'))) === 1, 'S3 · la volvió a tildar: sello 1 y hora 1');
  ok((await opacidad(s1.locator('h3'))) === 0.9, 'S3 · el título de la tildada se ve al 0,9');
  await ctx.close();

  ctx = await nuevoCtx({ colorScheme: 'dark' });
  p = await abrir(ctx, { estado: estadoDe(lista, { llevar: ['Paro general'] }) });
  const s2 = lleva(p, 'Paro general');
  ok((await color(s2.locator('.sello'))) === VERDE_OSCURO && (await opacidad(s2.locator('.sello'))) === 1, 'S2 · confirmada llevada, oscuro: sello verde rgb(98, 212, 147), opacidad 1');
  ok((await opacidad(s2.locator('h3'))) === 0.6, 'S2 · el título llevado se ve al 0,6');
  ok((await opacidad(s2.locator('.hora-llevada'))) === 1, 'S2 · «Te la llevaste a las…» al 1');
  await ctx.close();

  /* ── 7 · las capturas (se miran siempre; los archivos, solo con --capturas) ── */
  console.log('\n# 7 · lo que se ve en las 3 capturas' + (NOMBRE_CAPTURAS ? ' (se guardan en buzon/capturas/)' : ' (sin --capturas no se guarda nada)'));
  const carpeta = path.join(RAIZ, 'buzon', 'capturas');
  const capturas = [
    { sufijo: '390', ancho: 390, esquema: 'light' },
    { sufijo: '1200', ancho: 1200, esquema: 'light' },
    { sufijo: '390-oscuro', ancho: 390, esquema: 'dark' },
  ];
  for (const c of capturas) {
    ctx = await nuevoCtx({ colorScheme: c.esquema, viewport: { width: c.ancho, height: 900 } });
    p = await abrir(ctx, { estado: estadoCaptura(lista) });
    const etiqueta = `(${c.sufijo})`;
    ok((await p.locator('.recien').count()) === 1, `captura ${etiqueta}: hay una «Recién confirmada»`);
    ok((await p.locator('.nueva').count()) >= 1, `captura ${etiqueta}: hay una «Nueva»`);
    ok((await p.locator('.sello.viab').count()) === 2 && (await p.getByText('4 de 5 medios').count()) >= 1, `captura ${etiqueta}: la vía B en violeta (una por bloque) y «4 de 5 medios»`);
    const llev = lleva(p, 'Rescataron');
    ok((await color(llev.locator('.sello.mano'))) === NARANJA[c.esquema === 'dark' ? 'oscuro' : 'claro'] && /Te la llevaste a las \d\d:\d\d/.test(await llev.locator('.hora-llevada').textContent()), `captura ${etiqueta}: la 4/5 llevada con el sello naranja y su hora`);
    if (NOMBRE_CAPTURAS) {
      // La ventana se estira hasta el alto de la página: así la barra fija de abajo queda abajo de todo.
      const alto = await p.evaluate(() => document.documentElement.scrollHeight);
      await p.setViewportSize({ width: c.ancho, height: alto });
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.screenshot({ path: path.join(carpeta, `pagina-${NOMBRE_CAPTURAS}-${c.sufijo}.png`) });
    }
    await ctx.close();
  }

  console.log('');
  ok(errores.length === 0, 'sin errores en la consola en ningún escenario' + (errores.length ? ': ' + JSON.stringify(errores) : ''));
}

main()
  .then(() => {
    console.log(`\n${bien} bien, ${mal} mal`);
    process.exit(mal ? 1 : 0);
  })
  .catch(e => {
    if (/No se pudo abrir Chromium/.test(e.message)) { console.error(e.message); process.exit(2); }
    console.error('EXPLOTÓ:', e);
    process.exit(1);
  });
