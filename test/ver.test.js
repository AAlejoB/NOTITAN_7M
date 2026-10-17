'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { servir, leerOpciones, direccionesDeWifi } = require('../scripts/ver.js');

const INDEX = '<!doctype html><title>inventado</title>';
const LISTA = { generadaEn: '2026-10-09T12:00:00Z', ejemplo: true };

function carpetaConPagina() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ver-'));
  fs.mkdirSync(path.join(dir, 'pagina'));
  fs.writeFileSync(path.join(dir, 'pagina', 'index.html'), INDEX);
  fs.writeFileSync(path.join(dir, 'pagina', 'logica.js'), 'module.exports = {};');
  fs.writeFileSync(path.join(dir, 'pagina', 'lista.json'), JSON.stringify(LISTA));
  return dir;
}

// Pide con http.get y la ruta tal cual (sin que el cliente la "arregle").
function pedir(url, ruta) {
  return new Promise((resolver, rechazar) => {
    const u = new URL(url);
    require('node:http').get({ host: u.hostname, port: u.port, path: ruta }, res => {
      let cuerpo = '';
      res.on('data', d => { cuerpo += d; });
      res.on('end', () => resolver({ status: res.statusCode, tipo: res.headers['content-type'] || '', cuerpo }));
    }).on('error', rechazar);
  });
}

async function conServidor(fn) {
  const dir = carpetaConPagina();
  const { servidor, url } = await servir(dir, 0);
  try {
    await fn(url, dir);
  } finally {
    servidor.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('GET / devuelve el index.html de la carpeta', () => conServidor(async url => {
  const r = await pedir(url, '/');
  assert.equal(r.status, 200);
  assert.ok(r.tipo.startsWith('text/html'));
  assert.equal(r.cuerpo, INDEX);
}));

test('GET /lista.json devuelve la lista de la carpeta', () => conServidor(async url => {
  const r = await pedir(url, '/lista.json');
  assert.equal(r.status, 200);
  assert.ok(r.tipo.startsWith('application/json'));
  assert.deepEqual(JSON.parse(r.cuerpo), LISTA);
}));

test('GET de un archivo que no existe da 404', () => conServidor(async url => {
  assert.equal((await pedir(url, '/nada.js')).status, 404);
}));

test('E7 · GET /../package.json da 404 aunque exista en la raíz del repo', () => conServidor(async url => {
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'package.json')));
  assert.equal((await pedir(url, '/../package.json')).status, 404);
  assert.equal((await pedir(url, '/../../package.json')).status, 404);
}));

test('solo escucha en 127.0.0.1', () => conServidor(async url => {
  assert.ok(url.startsWith('http://127.0.0.1:'));
}));

test('E6 · sin pagina/ muestra el mensaje y sale con código 1', () => {
  const vacia = fs.mkdtempSync(path.join(os.tmpdir(), 'ver-vacia-'));
  try {
    const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'ver.js'), '--carpeta', vacia], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stdout + r.stderr, /No existe .*pagina\/index\.html\. Corré primero npm run vuelta\./);
  } finally {
    fs.rmSync(vacia, { recursive: true, force: true });
  }
});

test('un puerto ocupado avisa y sale con código 1', async () => {
  const dir = carpetaConPagina();
  const { servidor } = await servir(dir, 0);
  const puerto = servidor.address().port;
  try {
    const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'ver.js'), '--carpeta', dir, '--puerto', String(puerto)], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stderr, new RegExp(`El puerto ${puerto} está ocupado\\. Probá con --puerto ${puerto + 1}\\.`));
  } finally {
    servidor.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('leerOpciones: valores por defecto y valores inválidos', () => {
  assert.deepEqual(leerOpciones([]), { carpeta: 'datos', puerto: 7000, wifi: false });
  assert.deepEqual(leerOpciones(['--carpeta', 'x', '--puerto', '8080']), { carpeta: 'x', puerto: 8080, wifi: false });
  assert.deepEqual(leerOpciones(['--wifi']), { carpeta: 'datos', puerto: 7000, wifi: true });
  for (const malo of [['--puerto'], ['--puerto', 'abc'], ['--puerto', '0'], ['--puerto', '70000'], ['--puerto', '7.5'], ['--carpeta']]) {
    assert.throws(() => leerOpciones(malo), /necesita un valor|tiene que ser/, malo.join(' '));
  }
});

test('--wifi: escucha en todas las direcciones y la página se pide igual', async () => {
  const dir = carpetaConPagina();
  const { servidor, url } = await servir(dir, 0, '0.0.0.0');
  try {
    assert.equal(servidor.address().address, '0.0.0.0');
    assert.ok(url.startsWith('http://127.0.0.1:'));
    assert.equal((await pedir(url, '/')).cuerpo, INDEX);
  } finally {
    servidor.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('direccionesDeWifi: solo IPv4 y sin la de adentro de la compu', () => {
  const interfaces = {
    lo: [{ address: '127.0.0.1', family: 'IPv4', internal: true }],
    'Wi-Fi': [{ address: 'fe80::1', family: 'IPv6', internal: false }, { address: '192.168.0.23', family: 'IPv4', internal: false }],
    Ethernet: [{ address: '10.0.0.5', family: 4, internal: false }],
  };
  assert.deepEqual(direccionesDeWifi(interfaces), ['192.168.0.23', '10.0.0.5']);
  assert.deepEqual(direccionesDeWifi({}), []);
});
