'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const U = require('../scripts/usuario.js');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'usuario.js');
const carpeta = () => fs.mkdtempSync(path.join(os.tmpdir(), 'usuario-'));
const correr = (dir, ...args) => spawnSync(process.execPath, [SCRIPT, '--carpeta', dir, ...args], { encoding: 'utf8' });

test('E8: agregar dos veces dice «ya existe» y código 1; listar muestra mail y creado; sacar lo deja afuera', () => {
  const dir = carpeta();
  const r1 = correr(dir, 'agregar', 'Ana@Ejemplo.com');
  assert.equal(r1.status, 0);
  const clave = r1.stdout.match(/una sola vez[^:]*: (\S+)/)[1];
  assert.match(clave, /^[A-Za-z0-9]{12}$/);
  const r2 = correr(dir, 'agregar', 'ana@ejemplo.com');
  assert.equal(r2.status, 1);
  assert.match(r2.stderr, /ya existe/);
  const l = correr(dir, 'listar');
  assert.equal(l.status, 0);
  assert.match(l.stdout, /^ana@ejemplo\.com · creado \d{4}-\d\d-\d\dT/);
  const guardado = JSON.parse(fs.readFileSync(path.join(dir, 'usuarios.json'), 'utf8'));
  assert.deepEqual(Object.keys(guardado[0]), ['mail', 'sal', 'hash', 'creado']);
  assert.ok(!JSON.stringify(guardado).includes(clave), 'la contraseña nunca queda en el archivo');
  assert.ok(U.claveCorrecta(guardado[0], clave));
  assert.equal(correr(dir, 'sacar', 'ana@ejemplo.com').status, 0);
  assert.match(correr(dir, 'listar').stdout, /No hay nadie/);
  assert.equal(correr(dir, 'sacar', 'ana@ejemplo.com').status, 1);
});

test('usuario: mails inválidos, orden desconocida y nueva-clave', () => {
  const dir = carpeta();
  for (const malo of ['ana', 'ana@ejemplo', '@ejemplo.com', 'ana @ejemplo.com']) {
    assert.equal(U.mailValido(malo), false, malo);
    assert.equal(correr(dir, 'agregar', malo).status, 1);
  }
  assert.equal(correr(dir, 'cualquiera').status, 1);
  const vieja = U.agregar(dir, 'beto@ejemplo.com.ar');
  const nueva = U.cambiarClave(dir, 'BETO@ejemplo.com.ar');
  const u = U.buscar(U.cargarUsuarios(dir), 'beto@ejemplo.com.ar');
  assert.ok(U.claveCorrecta(u, nueva));
  assert.ok(!U.claveCorrecta(u, vieja));
});

test('usuario: dos personas con la misma contraseña tienen hash distinto (sal distinta)', () => {
  const a = U.hashear('Igual1234');
  const b = U.hashear('Igual1234');
  assert.notEqual(a.sal, b.sal);
  assert.notEqual(a.hash, b.hash);
  assert.equal(a.sal.length, 32, '16 bytes');
  assert.equal(a.hash.length, 128, '64 bytes');
  assert.ok(U.claveCorrecta(a, 'Igual1234'));
  assert.ok(!U.claveCorrecta(a, 'igual1234'));
});
