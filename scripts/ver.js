'use strict';
// Sirve la carpeta <carpeta>/pagina/ (la que escribe `npm run vuelta`) para verla en el navegador de esta misma compu.
// Uso: node scripts/ver.js [--carpeta datos] [--puerto 7000] [--wifi]
//   --carpeta <dir>  la misma que en `npm run vuelta` (por defecto datos). Se sirve <dir>/pagina.
//   --puerto <n>     entero de 1 a 65535 (por defecto 7000).
//   --wifi           escucha también en el wifi de la casa, para abrirla desde el celu (sin login: la ve cualquiera de esa red).
// Sin --wifi escucha solo en 127.0.0.1: la lista se ve únicamente en esta compu. Sin dependencias.
// Códigos: 0 bien (se corta con Ctrl+C) · 1 error de uso, no existe la página o el puerto está ocupado.
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

const DIRECCION = '127.0.0.1';
const TODAS = '0.0.0.0';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

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
  if (puerto !== null && (!/^\d+$/.test(puerto) || Number(puerto) < 1 || Number(puerto) > 65535)) {
    throw new ErrorDeUso(`--puerto tiene que ser un número entero de 1 a 65535, no "${puerto}".`);
  }
  return { carpeta: valor('--carpeta') || 'datos', puerto: puerto === null ? 7000 : Number(puerto), wifi: args.includes('--wifi') };
}

// Las direcciones IPv4 de esta compu en la red de la casa (lo que devuelve os.networkInterfaces()).
function direccionesDeWifi(interfaces) {
  return Object.values(interfaces).flat().filter(i => i && (i.family === 'IPv4' || i.family === 4) && !i.internal).map(i => i.address);
}

// Sirve <carpeta>/pagina en <direccion>:<puerto> (0 = un puerto libre, para los tests).
function servir(carpeta, puerto, direccion = DIRECCION) {
  const dir = path.resolve(carpeta, 'pagina');
  const servidor = http.createServer((req, res) => {
    const nombre = req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0];
    const f = path.join(dir, path.normalize(nombre).replace(/^(\.\.[/\\])+/, ''));
    if (f !== dir && !f.startsWith(dir + path.sep)) { res.writeHead(404); res.end('no'); return; }
    fs.readFile(f, (e, d) => {
      if (e) { res.writeHead(404); res.end('no'); return; }
      res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'text/plain', 'cache-control': 'no-store' });
      res.end(d);
    });
  });
  return new Promise((resolver, rechazar) => {
    servidor.once('error', rechazar);
    servidor.listen(puerto, direccion, () => {
      servidor.off('error', rechazar);
      resolver({ servidor, url: `http://${direccion === TODAS ? DIRECCION : direccion}:${servidor.address().port}/` });
    });
  });
}

async function main() {
  const { carpeta, puerto, wifi } = leerOpciones(process.argv.slice(2));
  if (!fs.existsSync(path.join(carpeta, 'pagina', 'index.html'))) {
    throw new ErrorDeUso(`No existe ${carpeta}/pagina/index.html. Corré primero npm run vuelta.`);
  }
  try {
    await servir(carpeta, puerto, wifi ? TODAS : DIRECCION);
  } catch (e) {
    if (e.code === 'EADDRINUSE') throw new ErrorDeUso(`El puerto ${puerto} está ocupado. Probá con --puerto ${puerto + 1}.`);
    throw e;
  }
  console.log(`Viendo ${carpeta}/pagina en http://${DIRECCION}:${puerto}/ (Ctrl+C para cortar)`);
  if (!wifi) return;
  const ips = direccionesDeWifi(os.networkInterfaces());
  if (!ips.length) { console.log('No encontré el wifi de esta compu: el celu no la va a poder abrir.'); return; }
  console.log('Desde el celu, conectado al mismo wifi, entrá a:');
  for (const ip of ips) console.log(`  http://${ip}:${puerto}/`);
  console.log('Si Windows pregunta por el firewall, tocá «Permitir» (redes privadas). La ve cualquiera de este wifi: no hay login.');
}

if (require.main === module) {
  main().catch(e => {
    if (e instanceof ErrorDeUso) console.error(e.message);
    else console.error(e);
    process.exit(1);
  });
}

module.exports = { servir, leerOpciones, direccionesDeWifi };
