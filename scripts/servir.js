'use strict';
// Sirve la página de hoy (<datos>/pagina/) solo a quien entró con su mail y su contraseña. Es lo que corre en el servidor;
// scripts/ver.js queda para mirar la lista en una compu, sin login.
// Uso: node scripts/servir.js --carpeta <datos> [--puerto 7000] [--escucha 127.0.0.1] [--n8n http://127.0.0.1:5678]
//   --carpeta <dir>  la carpeta de datos (la misma que escribe la vuelta de n8n). Adentro: pagina/, usuarios.json, servidor.json.
//   --puerto <n>     por defecto 7000.
//   --escucha <ip>   por defecto 127.0.0.1: delante va el servidor web con HTTPS (proxy inverso), nunca directo a internet.
//   --n8n <url>      dónde está n8n, para mandar el mail de «olvidé mi clave» por el webhook 7m-correo.
// Las sesiones y los tokens de «olvidé mi clave» viven en memoria: al reiniciar, todos vuelven a entrar.
// Las decisiones de cada persona en la página (GET y PUT /decisiones, solo con sesión) viven en <datos>/personas/<mail>.json.
// Sin dependencias. Códigos: 0 bien (se corta con Ctrl+C) · 1 error de uso o puerto ocupado.
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const U = require('./usuario.js');
const { normalizarEstado, estadoVacio } = require('../pagina/logica.js');

const ENTRAR_HTML = path.join(__dirname, '..', 'pagina', 'entrar.html');
const SESION_DIAS = 30;
const TOKEN_MINUTOS = 60;
const INTENTOS = 5;
const INTENTOS_MINUTOS = 15;
const CLAVE_MINIMA = 8;
const PERMITIDOS = { '/index.html': 'text/html; charset=utf-8', '/logica.js': 'text/javascript; charset=utf-8', '/lista.json': 'application/json; charset=utf-8' };
const DECISIONES_MAX = 256 * 1024;
const MSJ_OLVIDE = 'Si el mail está registrado, te llega un correo con un link para elegir una contraseña nueva. Vence en 60 minutos.';

class ErrorDeUso extends Error {}

function leerOpciones(args) {
  const valor = bandera => {
    const i = args.indexOf(bandera);
    if (i < 0) return null;
    const v = args[i + 1];
    if (v === undefined || v.startsWith('--')) throw new ErrorDeUso(`${bandera} necesita un valor.`);
    return v;
  };
  const puerto = valor('--puerto');
  if (puerto !== null && (!/^\d+$/.test(puerto) || Number(puerto) > 65535)) throw new ErrorDeUso(`--puerto tiene que ser un número entero de 0 a 65535, no "${puerto}".`);
  return {
    carpeta: valor('--carpeta') || 'datos',
    puerto: puerto === null ? 7000 : Number(puerto),
    escucha: valor('--escucha') || '127.0.0.1',
    n8n: (valor('--n8n') || 'http://127.0.0.1:5678').replace(/\/+$/, ''),
  };
}

const escapar = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Una página chica con un mensaje y un link para volver (para «olvidé mi clave», el tope de intentos y los errores).
function paginaMensaje(texto, { link = '/entrar', textoLink = 'Volver a entrar' } = {}) {
  return `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark"><title>7M</title><link rel="icon" href="data:,">
<style>body{margin:0;font:16px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:#f4f5f7;color:#1a1d21}
@media (prefers-color-scheme:dark){body{background:#101317;color:#e8eaed}a{color:#8cb5ff}}
main{max-width:420px;margin:15vh auto 0;padding:0 16px}a{color:#1456c9}</style></head>
<body><main><h1>7M</h1><p>${escapar(texto)}</p><p><a href="${escapar(link)}">${escapar(textoLink)}</a></p></main></body></html>`;
}

function leerCuerpo(req, max = 10000) {
  return new Promise((resolver, rechazar) => {
    let cuerpo = '';
    req.on('data', c => {
      cuerpo += c;
      if (cuerpo.length > max) { rechazar(new Error('cuerpo demasiado grande')); req.destroy(); }
    });
    req.on('end', () => resolver(Object.fromEntries(new URLSearchParams(cuerpo))));
    req.on('error', rechazar);
  });
}

// El cuerpo tal cual, hasta `max` bytes; si pasa, se sigue leyendo (sin guardarlo) y da { grande: true } para contestar 413.
function leerTexto(req, max) {
  return new Promise((resolver, rechazar) => {
    const partes = [];
    let largo = 0;
    req.on('data', c => { largo += c.length; if (largo <= max) partes.push(c); });
    req.on('end', () => resolver(largo > max ? { grande: true } : { texto: Buffer.concat(partes).toString('utf8') }));
    req.on('error', rechazar);
  });
}

// El archivo de una persona: el mail normalizado, con todo lo que no sea a-z, 0-9, @, ., _ o - cambiado por _.
const archivoDePersona = mail => U.normalizarMail(mail).replace(/[^a-z0-9@._-]/g, '_') + '.json';

// Se escribe primero en un temporal y después se renombra: si se corta la luz no queda un JSON a medias.
function escribirSeguro(archivo, contenido) {
  fs.mkdirSync(path.dirname(archivo), { recursive: true });
  const temporal = `${archivo}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  fs.writeFileSync(temporal, contenido);
  fs.renameSync(temporal, archivo);
}

const cookies = req => Object.fromEntries(String(req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(p => p[0]).map(([k, ...v]) => [k, v.join('=')]));
const alAzar = () => crypto.randomBytes(32).toString('hex');

function leerJson(archivo, siNo) {
  try { return JSON.parse(fs.readFileSync(archivo, 'utf8')); } catch { return siNo; }
}

// → un http.Server (sin escuchar). `ahora` se puede cambiar en los tests.
function crearServidor({ carpeta, n8n = 'http://127.0.0.1:5678', cliente = '', ahora = () => Date.now(), log = console.error } = {}) {
  const dirPagina = path.resolve(carpeta, 'pagina');
  const sesiones = new Map(); // token -> { mail, vence }
  const tokens = new Map(); // token de «olvidé mi clave» -> { mail, vence }
  const fallidos = new Map(); // mail -> [momentos de los intentos fallidos]

  const mailDeSesion = req => {
    const t = cookies(req)['7m-sesion'];
    const s = t && sesiones.get(t);
    if (!s) return null;
    if (s.vence < ahora()) { sesiones.delete(t); return null; }
    return s.mail;
  };
  const responder = (res, codigo, cuerpo, cabeceras = {}) => {
    res.writeHead(codigo, { 'cache-control': 'no-store', 'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer', ...cabeceras });
    res.end(cuerpo);
  };
  const html = (res, codigo, cuerpo) => responder(res, codigo, cuerpo, { 'content-type': 'text/html; charset=utf-8' });
  const ir = (res, a, cabeceras = {}) => responder(res, 302, '', { location: a, ...cabeceras });
  const servirEntrar = res => fs.readFile(ENTRAR_HTML, (e, d) => (e ? html(res, 500, paginaMensaje('Falta pagina/entrar.html.')) : html(res, 200, d)));

  function pedirCorreo(mail, token, req) {
    const conf = leerJson(path.join(carpeta, 'servidor.json'), {});
    const direccion = String(conf.direccion || `http://${req.headers.host}`).replace(/\/+$/, '');
    const cuerpo = {
      para: mail,
      asunto: '7M · nueva contraseña',
      texto: `Entrá a ${direccion}/nueva-clave?token=${token} para elegir una contraseña nueva. Vence en ${TOKEN_MINUTOS} minutos.\n\nSi no la pediste, no hagas nada: tu contraseña sigue igual.`,
    };
    fetch(`${n8n}/webhook/7m-correo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-7m-clave': String(conf.clave || '') },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(15000),
    }).then(r => { if (!r.ok) log(`servir: n8n contestó ${r.status} al pedir el mail de nueva contraseña.`); })
      .catch(e => log(`servir: n8n no contestó al pedir el mail de nueva contraseña (${e.cause && e.cause.code || e.name || e}).`));
  }

  async function atender(req, res) {
    const url = new URL(req.url, 'http://x');
    const ruta = url.pathname;
    const metodo = req.method;

    if (metodo === 'GET' && ruta === '/cliente.json') return responder(res, 200, JSON.stringify({ cliente }), { 'content-type': 'application/json; charset=utf-8' });
    if (metodo === 'GET' && (ruta === '/entrar' || ruta === '/olvide' || ruta === '/nueva-clave')) return servirEntrar(res);

    if (metodo === 'POST' && ruta === '/entrar') {
      const { mail = '', clave = '' } = await leerCuerpo(req);
      const m = U.normalizarMail(mail);
      const recientes = (fallidos.get(m) || []).filter(t => ahora() - t < INTENTOS_MINUTOS * 60000);
      if (recientes.length >= INTENTOS) {
        fallidos.set(m, recientes);
        return html(res, 429, paginaMensaje(`Demasiados intentos, esperá ${INTENTOS_MINUTOS} minutos.`));
      }
      const usuario = U.buscar(U.cargarUsuarios(carpeta), m);
      if (!U.claveCorrecta(usuario, clave)) {
        fallidos.set(m, [...recientes, ahora()]);
        return ir(res, '/entrar?error=1');
      }
      fallidos.delete(m);
      const token = alAzar();
      sesiones.set(token, { mail: m, vence: ahora() + SESION_DIAS * 86400000 });
      const segura = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https' ? '; Secure' : '';
      return ir(res, '/', { 'set-cookie': `7m-sesion=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESION_DIAS * 86400}${segura}` });
    }

    if (metodo === 'POST' && ruta === '/salir') {
      const t = cookies(req)['7m-sesion'];
      if (t) sesiones.delete(t);
      return ir(res, '/entrar', { 'set-cookie': '7m-sesion=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
    }

    if (metodo === 'POST' && ruta === '/olvide') {
      const { mail = '' } = await leerCuerpo(req);
      const m = U.normalizarMail(mail);
      if (U.buscar(U.cargarUsuarios(carpeta), m)) {
        const token = alAzar();
        tokens.set(token, { mail: m, vence: ahora() + TOKEN_MINUTOS * 60000 });
        pedirCorreo(m, token, req);
      }
      return html(res, 200, paginaMensaje(MSJ_OLVIDE));
    }

    if (metodo === 'POST' && ruta === '/nueva-clave') {
      const { token = '', clave = '', clave2 = '' } = await leerCuerpo(req);
      const t = tokens.get(token);
      if (!t || t.vence < ahora()) {
        tokens.delete(token);
        return html(res, 400, paginaMensaje('El link venció o ya se usó. Pedí otro con «Olvidé mi clave».', { link: '/olvide', textoLink: 'Olvidé mi clave' }));
      }
      if (clave !== clave2 || clave.length < CLAVE_MINIMA) {
        return html(res, 400, paginaMensaje(`Las dos contraseñas tienen que ser iguales y tener ${CLAVE_MINIMA} letras o más.`, { link: `/nueva-clave?token=${token}`, textoLink: 'Probar de nuevo' }));
      }
      tokens.delete(token);
      U.cambiarClave(carpeta, t.mail, clave);
      for (const [k, s] of sesiones) if (s.mail === t.mail) sesiones.delete(k);
      return ir(res, '/entrar?nueva=1');
    }

    if (ruta === '/decisiones' && (metodo === 'GET' || metodo === 'PUT')) {
      const mail = mailDeSesion(req);
      const json = { 'content-type': 'application/json; charset=utf-8' };
      if (!mail) return responder(res, 401, JSON.stringify({ error: 'sin sesión' }), json);
      const archivo = path.join(carpeta, 'personas', archivoDePersona(mail));
      if (metodo === 'GET') return responder(res, 200, JSON.stringify(normalizarEstado(leerJson(archivo, estadoVacio()))), json);
      const cuerpo = await leerTexto(req, DECISIONES_MAX);
      if (cuerpo.grande) return responder(res, 413, JSON.stringify({ error: 'demasiado grande' }), json);
      let datos;
      try { datos = JSON.parse(cuerpo.texto); } catch { return responder(res, 400, JSON.stringify({ error: 'no es JSON' }), json); }
      escribirSeguro(archivo, JSON.stringify(normalizarEstado(datos)));
      return responder(res, 204, '');
    }

    if (metodo === 'GET' || metodo === 'HEAD') {
      const archivo = ruta === '/' ? '/index.html' : ruta;
      const tipo = PERMITIDOS[archivo];
      if (!tipo) return responder(res, 404, 'no', { 'content-type': 'text/plain; charset=utf-8' });
      if (!mailDeSesion(req)) {
        if (archivo === '/index.html') return ir(res, '/entrar');
        return responder(res, 401, JSON.stringify({ error: 'sin sesión' }), { 'content-type': 'application/json; charset=utf-8' });
      }
      return fs.readFile(path.join(dirPagina, archivo), (e, d) => (e
        ? responder(res, 404, 'Todavía no hay lista: la primera vuelta de n8n la escribe.', { 'content-type': 'text/plain; charset=utf-8' })
        : responder(res, 200, d, { 'content-type': tipo })));
    }
    return responder(res, 405, 'no', { 'content-type': 'text/plain; charset=utf-8' });
  }

  return http.createServer((req, res) => {
    atender(req, res).catch(e => {
      log(`servir: ${e.message}`);
      if (!res.headersSent) responder(res, 400, 'no', { 'content-type': 'text/plain; charset=utf-8' });
    });
  });
}

// Escucha en <escucha>:<puerto> (0 = un puerto libre, para los tests). → { servidor, url }
function servir({ carpeta, puerto = 7000, escucha = '127.0.0.1', n8n, cliente, ahora, log } = {}) {
  const servidor = crearServidor({ carpeta, n8n, cliente, ahora, log });
  return new Promise((resolver, rechazar) => {
    servidor.once('error', rechazar);
    servidor.listen(puerto, escucha, () => {
      servidor.off('error', rechazar);
      resolver({ servidor, url: `http://${escucha}:${servidor.address().port}/` });
    });
  });
}

async function main() {
  const op = leerOpciones(process.argv.slice(2));
  if (!fs.existsSync(op.carpeta)) throw new ErrorDeUso(`No existe la carpeta ${op.carpeta}.`);
  if (!U.cargarUsuarios(op.carpeta).length) console.error(`Ojo: ${op.carpeta}/usuarios.json no tiene a nadie. Agregá con: node scripts/usuario.js --carpeta ${op.carpeta} agregar <mail>`);
  const cliente = leerJson(path.join(__dirname, '..', 'config', 'reglas.json'), {}).cliente || '';
  try {
    await servir({ ...op, cliente });
  } catch (e) {
    if (e.code === 'EADDRINUSE') throw new ErrorDeUso(`El puerto ${op.puerto} está ocupado. Probá con --puerto ${op.puerto + 1}.`);
    throw e;
  }
  console.log(`7M con login en http://${op.escucha}:${op.puerto}/ (sirve ${op.carpeta}/pagina; Ctrl+C para cortar)`);
}

if (require.main === module) {
  main().catch(e => {
    console.error(e instanceof ErrorDeUso || e instanceof U.ErrorDeUso ? e.message : e);
    process.exit(1);
  });
}

module.exports = { crearServidor, servir, leerOpciones, paginaMensaje, archivoDePersona };
