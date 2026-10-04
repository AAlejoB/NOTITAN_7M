'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { masNueva, archivosDe, armarPaquete } = require('../scripts/armar-paquete.js');

function carpetaDePrueba() {
  const dir = mkdtempSync(join(tmpdir(), 'buzon-'));
  const escribir = (nombre, texto) => writeFileSync(join(dir, nombre), texto);
  escribir('LEEME.md', 'reglas');
  escribir('LEEME_PREPARADOR.md', 'arranque preparador');
  escribir('LEEME_DISENADOR.md', 'arranque disenador');
  escribir('pendientes.md', 'pendientes');
  escribir('ClaudeCode_para_PREPARADOR_2026-10-03_z.md', 'vieja');
  escribir('ClaudeCode_para_PREPARADOR_2026-10-04_a.md', 'del 4 a');
  escribir('ClaudeCode_para_PREPARADOR_2026-10-04_b.md', 'del 4 b');
  escribir('claude.md', 'claude');
  return dir;
}

test('masNueva: elige la carta de fecha y letra más nuevas, o null si no hay', () => {
  const dir = carpetaDePrueba();
  assert.equal(masNueva('ClaudeCode_para_PREPARADOR_', dir), 'ClaudeCode_para_PREPARADOR_2026-10-04_b.md');
  assert.equal(masNueva('Disenador_para_PREPARADOR_', dir), null);
});

test('archivosDe: el arranque del rol va primero y solo entra la carta más nueva de cada familia', () => {
  const dir = carpetaDePrueba();
  const rutas = archivosDe('PREPARADOR', dir, join(dir, 'claude.md')).map(a => a.ruta);
  assert.deepEqual(rutas, ['buzon/LEEME_PREPARADOR.md', 'buzon/LEEME.md', 'CLAUDE.md', 'buzon/pendientes.md', 'buzon/ClaudeCode_para_PREPARADOR_2026-10-04_b.md']);
  assert.equal(archivosDe('DISENADOR', dir, join(dir, 'claude.md')).length, 4);
});

test('armarPaquete: trae el texto de cada archivo, numerado, con la hora y sin mezclar roles', () => {
  const dir = carpetaDePrueba();
  const texto = armarPaquete('PREPARADOR', '04/10/2026, 14:30', dir, join(dir, 'claude.md'));
  assert.match(texto, /PAQUETE PARA PEGAR · PREPARADOR/);
  assert.match(texto, /04\/10\/2026, 14:30/);
  assert.match(texto, /ARCHIVO 5 de 5 · buzon\/ClaudeCode_para_PREPARADOR_2026-10-04_b\.md/);
  assert.match(texto, /del 4 b/);
  assert.doesNotMatch(texto, /del 4 a|vieja|arranque disenador/);
});

test('armarPaquete con el repo real: cada rol lleva su arranque, CLAUDE.md y pendientes', () => {
  for (const [rol, arranque] of [['DISENADOR', 'LEEME_DISENADOR.md'], ['PREPARADOR', 'LEEME_PREPARADOR.md']]) {
    const rutas = archivosDe(rol).map(a => a.ruta);
    assert.equal(rutas[0], `buzon/${arranque}`);
    assert.ok(rutas.includes('CLAUDE.md') && rutas.includes('buzon/pendientes.md'));
    assert.ok(armarPaquete(rol, 'hora').includes('FIN DEL PAQUETE'));
  }
});
