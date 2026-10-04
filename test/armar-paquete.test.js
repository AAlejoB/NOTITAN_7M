'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { masNueva, archivosDe, armarPaquete } = require('../scripts/armar-paquete.js');

function carpetaDePrueba({ conCowork = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'buzon-'));
  const escribir = (nombre, texto) => writeFileSync(join(dir, nombre), texto);
  escribir('LEEME.md', 'reglas');
  escribir('LEEME_COWORK.md', 'arranque cowork');
  escribir('pendientes.md', 'pendientes');
  escribir('ClaudeCode_para_PREPARADOR_2026-10-03_z.md', 'vieja');
  escribir('ClaudeCode_para_PREPARADOR_2026-10-04_a.md', 'del 4 a');
  escribir('ClaudeCode_para_PREPARADOR_2026-10-04_k.md', 'del 4 k (nombre viejo)');
  escribir('Cowork_para_ClaudeCode_2026-10-04_z.md', 'carta de Cowork: no es un reporte');
  escribir('claude.md', 'claude');
  if (conCowork) {
    escribir('ClaudeCode_para_Cowork_2026-10-04_a.md', 'cowork a');
    escribir('ClaudeCode_para_Cowork_2026-10-05_b.md', 'cowork b');
  }
  return dir;
}

test('masNueva: elige la carta de fecha y letra más nuevas, o null si no hay', () => {
  const dir = carpetaDePrueba();
  assert.equal(masNueva('ClaudeCode_para_PREPARADOR_', dir), 'ClaudeCode_para_PREPARADOR_2026-10-04_k.md');
  assert.equal(masNueva('Disenador_para_PREPARADOR_', dir), null);
});

test('masNueva con una lista de familias: gana la primera que tenga alguna, aunque la otra tenga una letra más nueva', () => {
  const sin = carpetaDePrueba();
  assert.equal(masNueva(['ClaudeCode_para_Cowork_', 'ClaudeCode_para_PREPARADOR_'], sin), 'ClaudeCode_para_PREPARADOR_2026-10-04_k.md', 'sin nombre nuevo, el viejo sirve de respaldo');
  const con = carpetaDePrueba({ conCowork: true });
  assert.equal(masNueva(['ClaudeCode_para_Cowork_', 'ClaudeCode_para_PREPARADOR_'], con), 'ClaudeCode_para_Cowork_2026-10-05_b.md');
  assert.equal(masNueva(['Nadie_para_Nadie_', 'Tampoco_'], con), null);
});

test('archivosDe: el arranque de Cowork va primero y entra solo el reporte más nuevo de Claude Code', () => {
  const sin = carpetaDePrueba();
  assert.deepEqual(archivosDe('COWORK', sin, join(sin, 'claude.md')).map(a => a.ruta),
    ['buzon/LEEME_COWORK.md', 'buzon/LEEME.md', 'CLAUDE.md', 'buzon/pendientes.md', 'buzon/ClaudeCode_para_PREPARADOR_2026-10-04_k.md']);
  const con = carpetaDePrueba({ conCowork: true });
  assert.equal(archivosDe('COWORK', con, join(con, 'claude.md')).at(-1).ruta, 'buzon/ClaudeCode_para_Cowork_2026-10-05_b.md');
});

test('armarPaquete: trae el texto de cada archivo, numerado, con la hora y sin cartas que no son reportes', () => {
  const dir = carpetaDePrueba({ conCowork: true });
  const texto = armarPaquete('COWORK', '04/10/2026, 14:30', dir, join(dir, 'claude.md'));
  assert.match(texto, /PAQUETE PARA PEGAR · COWORK/);
  assert.match(texto, /04\/10\/2026, 14:30/);
  assert.match(texto, /ARCHIVO 5 de 5 · buzon\/ClaudeCode_para_Cowork_2026-10-05_b\.md/);
  assert.match(texto, /cowork b/);
  assert.doesNotMatch(texto, /cowork a|del 4 a|del 4 k|vieja|carta de Cowork/);
});

test('armarPaquete con el repo real: lleva el arranque de Cowork, CLAUDE.md, pendientes y un reporte de Claude Code', () => {
  const rutas = archivosDe('COWORK').map(a => a.ruta);
  assert.equal(rutas[0], 'buzon/LEEME_COWORK.md');
  assert.ok(rutas.includes('CLAUDE.md') && rutas.includes('buzon/pendientes.md'));
  assert.match(rutas.at(-1), /^buzon\/ClaudeCode_para_(Cowork|PREPARADOR)_\d{4}-\d{2}-\d{2}_[a-z]\.md$/);
  assert.ok(armarPaquete('COWORK', 'hora').includes('FIN DEL PAQUETE'));
});
