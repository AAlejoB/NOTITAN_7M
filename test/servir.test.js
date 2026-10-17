'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { servir, leerOpciones } = require('../scripts/servir.js');
const U = require('../scripts/usuario.js');

const LISTA = { generadaEn: '2026-10-15T12:00:00Z', ejemplo: false };
const CLAVE_WEBHOOK = 'clave-inventada-para-el-test';

function carpetaDatos() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'servir-'));
  fs.mkdirSync(path.join(dir, 'pagina'));
  fs.writeFileSync(path.join(dir, 'pagina', 'index.html'), '<!doctype html><title>inventado</title>');
  fs.writeFileSync(path.join(dir, 'pagina', 'logica.js'), 'module.exports = {};');
  fs.writeFileSync(path.join(dir, 'pagina', 'lista.json'), JSON.stringify(LISTA));
  fs.writeFileSync(path.join(dir, 'servidor.json'), JSON.stringify({ clave: CLAVE_WEBHOOK, direccion: 'https://7m.ejemplo.com' }));
  const clave = U.agregar(dir, 'ana@ejemplo.com');
  return { dir, clave };
}

// Pide sin seguir redirecciones. → { status, headers, cuerpo }
function pedir(url, ruta, { metodo = 'GET', form, crudo, cookie, cabeceras = {} } = {}) {
  return new Promise((resolver, rechazar) => {
    const u = new URL(url);
    const cuerpo = form ? new URLSearchParams(form).toString() : crudo !== undefined ? crudo : '';
    const req = http.request({ host: u.hostname, port: u.port, path: ruta, method: metodo, headers: {
      ...(form ? { 'content-type': 'application/x-www-form-urlencoded', 'content-length': Buffer.byteLength(cuerpo) } : {}),
      ...(crudo !== undefined ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(cuerpo) } : {}),
      ...(cookie ? { cookie } : {}), ...cabeceras,
    } }, res => {
      let c = '';
      res.on('data', d => { c += d; });
      res.on('end', () => resolver({ status: res.statusCode, headers: res.headers, cuerpo: c }));
    });
    req.on('error', rechazar);
    req.end(cuerpo);
  });
}

// Un n8n falso: anota cada pedido que recibe.
function n8nFalso() {
  const recibidos = [];
  let avisar = () => {};
  const servidor = http.createServer((req, res) => {
    let c = '';
    req.on('data', d => { c += d; });
    req.on('end', () => {
      recibidos.push({ metodo: req.method, ruta: req.url, clave: req.headers['x-7m-clave'], cuerpo: JSON.parse(c || '{}') });
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{"ok":true}');
      avisar();
    });
  });
  const siguiente = () => new Promise(r => { avisar = r; });
  return new Promise(r => servidor.listen(0, '127.0.0.1', () => r({ servidor, recibidos, siguiente, url: `http://127.0.0.1:${servidor.address().port}` })));
}

async function con(fn, { n8n } = {}) {
  const { dir, clave } = carpetaDatos();
  const { servidor, url } = await servir({ carpeta: dir, puerto: 0, n8n: n8n || 'http://127.0.0.1:9', cliente: 'Canal 2', log: () => {} });
  try { await fn({ url, dir, clave }); } finally { servidor.close(); }
}

const sesionDe = r => (r.headers['set-cookie'] || [])[0].split(';')[0];

test('E6: sin sesión redirige o da 401; con la contraseña entra y ve la lista; con una mala no', () => con(async ({ url, clave }) => {
  let r = await pedir(url, '/');
  assert.equal(r.status, 302);
  assert.equal(r.headers.location, '/entrar');
  assert.equal((await pedir(url, '/index.html')).headers.location, '/entrar');
  r = await pedir(url, '/lista.json');
  assert.equal(r.status, 401);
  assert.deepEqual(JSON.parse(r.cuerpo), { error: 'sin sesión' });
  assert.equal((await pedir(url, '/logica.js')).status, 401);

  r = await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ana@ejemplo.com', clave } });
  assert.equal(r.status, 302);
  assert.equal(r.headers.location, '/');
  assert.match(r.headers['set-cookie'][0], /^7m-sesion=[0-9a-f]{64}; HttpOnly; SameSite=Lax; Path=\//);
  assert.doesNotMatch(r.headers['set-cookie'][0], /Secure/);
  const cookie = sesionDe(r);
  r = await pedir(url, '/lista.json', { cookie });
  assert.equal(r.status, 200);
  assert.deepEqual(JSON.parse(r.cuerpo), LISTA);
  assert.equal((await pedir(url, '/', { cookie })).status, 200);
  assert.equal((await pedir(url, '/usuarios.json', { cookie })).status, 404, 'solo se sirven los tres archivos de la página');
  assert.equal((await pedir(url, '/../usuarios.json', { cookie })).status, 404);

  r = await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ana@ejemplo.com', clave: 'x' } });
  assert.equal(r.status, 302);
  assert.equal(r.headers.location, '/entrar?error=1');
}));

test('E6: al sexto intento fallido seguido contesta 429, aunque la contraseña sea la buena', () => con(async ({ url, clave }) => {
  for (let i = 0; i < 5; i++) assert.equal((await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ana@ejemplo.com', clave: 'mala' } })).status, 302);
  let r = await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ana@ejemplo.com', clave: 'mala' } });
  assert.equal(r.status, 429);
  assert.match(r.cuerpo, /Demasiados intentos, esperá 15 minutos/);
  r = await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ANA@ejemplo.com', clave } });
  assert.equal(r.status, 429);
}));

test('servir: con x-forwarded-proto https la cookie va Secure; /salir borra la sesión', () => con(async ({ url, clave }) => {
  const r = await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ana@ejemplo.com', clave }, cabeceras: { 'x-forwarded-proto': 'https' } });
  assert.match(r.headers['set-cookie'][0], /; Secure$/);
  const cookie = sesionDe(r);
  const s = await pedir(url, '/salir', { metodo: 'POST', cookie });
  assert.equal(s.status, 302);
  assert.equal(s.headers.location, '/entrar');
  assert.equal((await pedir(url, '/lista.json', { cookie })).status, 401);
}));

test('servir: /entrar, /olvide y /nueva-clave sirven entrar.html; /cliente.json da el cliente sin sesión', () => con(async ({ url }) => {
  for (const ruta of ['/entrar', '/olvide', '/nueva-clave?token=x']) {
    const r = await pedir(url, ruta);
    assert.equal(r.status, 200);
    assert.match(r.cuerpo, /Olvidé mi clave/);
  }
  assert.deepEqual(JSON.parse((await pedir(url, '/cliente.json')).cuerpo), { cliente: 'Canal 2' });
}));

test('E7: olvidé mi clave manda el link por el webhook de n8n; la clave nueva entra y el token sirve una vez', async () => {
  const falso = await n8nFalso();
  try {
    await con(async ({ url, clave }) => {
      const llega = falso.siguiente();
      let r = await pedir(url, '/olvide', { metodo: 'POST', form: { mail: 'ana@ejemplo.com' } });
      assert.equal(r.status, 200);
      assert.match(r.cuerpo, /Si el mail está registrado, te llega un correo/);
      await llega;
      assert.equal(falso.recibidos.length, 1);
      const p = falso.recibidos[0];
      assert.equal(p.metodo, 'POST');
      assert.equal(p.ruta, '/webhook/7m-correo');
      assert.equal(p.clave, CLAVE_WEBHOOK);
      assert.equal(p.cuerpo.para, 'ana@ejemplo.com');
      assert.equal(p.cuerpo.asunto, '7M · nueva contraseña');
      assert.match(p.cuerpo.texto, /https:\/\/7m\.ejemplo\.com\/nueva-clave\?token=[0-9a-f]{64}/);
      const token = p.cuerpo.texto.match(/token=([0-9a-f]+)/)[1];

      r = await pedir(url, '/nueva-clave', { metodo: 'POST', form: { token, clave: 'Nueva1234', clave2: 'Otra1234' } });
      assert.equal(r.status, 400, 'si no coinciden no se cambia');
      r = await pedir(url, '/nueva-clave', { metodo: 'POST', form: { token, clave: 'Nueva1234', clave2: 'Nueva1234' } });
      assert.equal(r.status, 302);
      assert.equal(r.headers.location, '/entrar?nueva=1');
      r = await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ana@ejemplo.com', clave: 'Nueva1234' } });
      assert.equal(r.headers.location, '/');
      r = await pedir(url, '/entrar', { metodo: 'POST', form: { mail: 'ana@ejemplo.com', clave } });
      assert.equal(r.headers.location, '/entrar?error=1', 'la temporal ya no entra');
      r = await pedir(url, '/nueva-clave', { metodo: 'POST', form: { token, clave: 'Otra12345', clave2: 'Otra12345' } });
      assert.equal(r.status, 400);

      r = await pedir(url, '/olvide', { metodo: 'POST', form: { mail: 'nadie@ejemplo.com' } });
      assert.equal(r.status, 200);
      assert.match(r.cuerpo, /Si el mail está registrado, te llega un correo/);
      await new Promise(res => setTimeout(res, 100));
      assert.equal(falso.recibidos.length, 1, 'con un mail que no existe no se manda nada');
    }, { n8n: falso.url });
  } finally {
    falso.servidor.close();
  }
});

test('servir: si n8n no contesta, /olvide igual dice lo mismo', () => con(async ({ url }) => {
  const r = await pedir(url, '/olvide', { metodo: 'POST', form: { mail: 'ana@ejemplo.com' } });
  assert.equal(r.status, 200);
  assert.match(r.cuerpo, /Si el mail está registrado/);
}));

test('servir: opciones por defecto y errores de uso', () => {
  assert.deepEqual(leerOpciones([]), { carpeta: 'datos', puerto: 7000, escucha: '127.0.0.1', n8n: 'http://127.0.0.1:5678' });
  assert.deepEqual(leerOpciones(['--carpeta', '/d', '--puerto', '8000', '--n8n', 'http://n:1/']).n8n, 'http://n:1');
  assert.throws(() => leerOpciones(['--puerto', 'x']), /--puerto/);
  assert.throws(() => leerOpciones(['--carpeta']), /necesita un valor/);
});

// ── Carta del 17-10 (la página C), Fase B: las decisiones de cada persona ──
const { archivoDePersona } = require('../scripts/servir.js');
const VACIO = { version: 2, decisiones: [], llevadas: [], subidas: [], temasApagados: [] };
const entrar = async (url, mail, clave) => sesionDe(await pedir(url, '/entrar', { metodo: 'POST', form: { mail, clave } }));
const ESTADO = {
  version: 2,
  decisiones: [
    { urls: ['https://a/1', 'https://b/1'], que: 'nopor', motivo: 'opinion', hora: '2026-10-16T18:40:00.000Z', sello: 'A', grupos: 5, minimo: 5 },
    { urls: ['https://a/2'], que: 'nopor', motivo: 'otro', texto: 'hay cosas más importantes', hora: '2026-10-16T18:41:00.000Z', sello: 'A', grupos: 7, minimo: 5 },
    { urls: ['https://a/3'], que: 'interesa', hora: '2026-10-16T18:42:00.000Z', sello: 'mano', grupos: 4, minimo: 5, subio: true },
    { urls: ['https://a/4'], que: 'archivo', hora: '2026-10-16T18:43:00.000Z', sello: 'A', grupos: 6, minimo: 5 },
    { urls: ['id:scpl-2903'], que: 'interesa', hora: '2026-10-16T18:44:00.000Z', sello: 'aviso', grupos: 1, minimo: 1 },
  ],
  llevadas: [{ urls: ['https://a/5'], hora: '2026-10-16T14:20:00.000Z' }],
  subidas: [{ urls: ['https://a/6'], de: 'archivo', hora: '2026-10-16T14:20:00.000Z' }],
  temasApagados: ['Espectáculos'],
};

test('E14 · GET /decisiones: sin sesión 401; con sesión y sin archivo, el estado vacío', () => con(async ({ url, clave }) => {
  const sin = await pedir(url, '/decisiones');
  assert.equal(sin.status, 401);
  assert.deepEqual(JSON.parse(sin.cuerpo), { error: 'sin sesión' });
  assert.equal((await pedir(url, '/decisiones', { metodo: 'PUT', crudo: '{}' })).status, 401);
  const cookie = await entrar(url, 'ana@ejemplo.com', clave);
  const r = await pedir(url, '/decisiones', { cookie });
  assert.equal(r.status, 200);
  assert.match(r.headers['content-type'], /^application\/json/);
  assert.deepEqual(JSON.parse(r.cuerpo), VACIO);
}));

test('E14 · PUT /decisiones: 204, se guarda normalizado en personas/<mail>.json y GET lo devuelve', () => con(async ({ url, dir, clave }) => {
  const cookie = await entrar(url, 'ana@ejemplo.com', clave);
  const r = await pedir(url, '/decisiones', { metodo: 'PUT', crudo: JSON.stringify(ESTADO), cookie });
  assert.equal(r.status, 204);
  const archivo = path.join(dir, 'personas', 'ana@ejemplo.com.json');
  assert.deepEqual(JSON.parse(fs.readFileSync(archivo, 'utf8')), ESTADO);
  assert.deepEqual(fs.readdirSync(path.join(dir, 'personas')), ['ana@ejemplo.com.json'], 'sin temporales sueltos');
  assert.deepEqual(JSON.parse((await pedir(url, '/decisiones', { cookie })).cuerpo), ESTADO);
  // Lo que no tiene la forma se acomoda en el servidor.
  assert.equal((await pedir(url, '/decisiones', { metodo: 'PUT', crudo: JSON.stringify({ ...ESTADO, decisiones: 'x' }), cookie })).status, 204);
  assert.deepEqual(JSON.parse(fs.readFileSync(archivo, 'utf8')).decisiones, []);
  assert.deepEqual(JSON.parse(fs.readFileSync(archivo, 'utf8')).temasApagados, ['Espectáculos']);
  assert.equal((await pedir(url, '/decisiones', { metodo: 'PUT', crudo: 'esto no es json', cookie })).status, 400);
}));

test('E14 · PUT /decisiones de 300 KB → 413 y no se escribe nada', () => con(async ({ url, dir, clave }) => {
  const cookie = await entrar(url, 'ana@ejemplo.com', clave);
  const grande = JSON.stringify({ ...VACIO, relleno: 'x'.repeat(300 * 1024) });
  const r = await pedir(url, '/decisiones', { metodo: 'PUT', crudo: grande, cookie });
  assert.equal(r.status, 413);
  assert.equal(fs.existsSync(path.join(dir, 'personas', 'ana@ejemplo.com.json')), false);
}));

test('E14 · cada persona ve solo lo suyo; el nombre del archivo sale del mail normalizado', () => con(async ({ url, dir, clave }) => {
  const claveBea = U.agregar(dir, 'bea@ejemplo.com');
  const ana = await entrar(url, 'ana@ejemplo.com', clave);
  const bea = await entrar(url, 'bea@ejemplo.com', claveBea);
  await pedir(url, '/decisiones', { metodo: 'PUT', crudo: JSON.stringify(ESTADO), cookie: ana });
  assert.deepEqual(JSON.parse((await pedir(url, '/decisiones', { cookie: bea })).cuerpo), VACIO);
  assert.equal(archivoDePersona('Ana.Pérez+7m@canal2.com'), 'ana.p_rez_7m@canal2.com.json');
  assert.equal(archivoDePersona('../../etc/passwd'), '.._.._etc_passwd.json', 'sin barras: nunca sale de personas/');
}));
