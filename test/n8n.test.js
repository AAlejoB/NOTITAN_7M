'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const DIR = path.join(__dirname, '..', 'n8n');
const ARCHIVOS = ['vuelta.json', 'correo.json', 'error.json', 'prueba-union.json'];
const leer = archivo => JSON.parse(fs.readFileSync(path.join(DIR, archivo), 'utf8'));
// Las flechas de un workflow como «origen[salida]→destino».
const flechas = wf => Object.entries(wf.connections).flatMap(([origen, c]) =>
  c.main.flatMap((salida, k) => salida.map(d => `${origen}[${k}]→${d.node}`))).sort();

test('n8n: los 4 archivos son JSON válido con name, nodes y connections', () => {
  for (const a of ARCHIVOS) {
    const wf = leer(a);
    assert.equal(typeof wf.name, 'string', a);
    assert.ok(Array.isArray(wf.nodes) && wf.nodes.length > 0, a);
    assert.equal(typeof wf.connections, 'object', a);
    for (const n of wf.nodes) {
      assert.ok(n.name && n.type && typeof n.typeVersion === 'number' && Array.isArray(n.position), `${a}: ${n.name}`);
    }
    const nombres = new Set(wf.nodes.map(n => n.name));
    assert.equal(nombres.size, wf.nodes.length, `${a}: sin nombres repetidos`);
    for (const f of flechas(wf)) assert.ok(nombres.has(f.split('→')[1]) && nombres.has(f.split('[')[0]), `${a}: ${f}`);
  }
});

test('n8n: la vuelta tiene los 10 nodos de la carta y sus flechas', () => {
  const wf = leer('vuelta.json');
  assert.deepEqual(wf.nodes.map(n => n.name), ['Cada 30 minutos', 'Rutas', 'Feeds', 'Bajar', 'Preparar', '¿Hay preguntas?', 'IA', 'Decidir', '¿Avisar?', 'Avisar']);
  assert.deepEqual(wf.nodes.map(n => n.type.replace('n8n-nodes-base.', '')), ['scheduleTrigger', 'set', 'code', 'httpRequest', 'code', 'if', 'httpRequest', 'code', 'if', 'emailSend']);
  // Salida 0 de un IF = «true», salida 1 = «false».
  assert.deepEqual(flechas(wf), [
    'Bajar[0]→Preparar', 'Cada 30 minutos[0]→Rutas', 'Decidir[0]→¿Avisar?', 'Feeds[0]→Bajar', 'IA[0]→Decidir',
    'Preparar[0]→¿Hay preguntas?', 'Rutas[0]→Feeds', '¿Avisar?[0]→Avisar', '¿Hay preguntas?[0]→IA', '¿Hay preguntas?[1]→Decidir',
  ].sort());
  const nodo = nombre => wf.nodes.find(n => n.name === nombre);
  assert.deepEqual(nodo('Cada 30 minutos').parameters.rule.interval, [{ field: 'minutes', minutesInterval: 30 }]);
  assert.deepEqual(nodo('Rutas').parameters.assignments.assignments.map(a => a.name), ['carpetaRepo', 'carpetaDatos', 'correoAvisos', 'correoDesde', 'configZona']);
  assert.equal(nodo('Rutas').parameters.assignments.assignments.find(a => a.name === 'configZona').value, 'config/zona');
  for (const n of ['Feeds', 'Preparar', 'Decidir']) assert.match(nodo(n).parameters.jsCode, /configZona/, n);
  assert.equal(nodo('Bajar').onError, 'continueRegularOutput');
  assert.equal(nodo('Bajar').parameters.options.timeout, 20000);
  assert.equal(nodo('IA').onError, 'continueRegularOutput');
  assert.equal(nodo('IA').parameters.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(nodo('IA').credentials.httpHeaderAuth.name, '7M Anthropic');
  assert.equal(nodo('Avisar').credentials.smtp.name, '7M Correo');
  assert.equal(wf.settings.executionOrder, 'v1');
  assert.equal(wf.settings.saveDataSuccessExecution, 'all');
  assert.ok(!wf.settings.errorWorkflow, 'el workflow de error se elige después de importar');
  for (const n of ['Preparar', 'Decidir']) assert.match(nodo(n).parameters.jsCode, /require\(rutas\.carpetaRepo \+ '\/src\/capa4\.js'\)/);
});

test('n8n: el correo, el error y la prueba de la unión tienen sus nodos', () => {
  assert.deepEqual(leer('correo.json').nodes.map(n => n.type.replace('n8n-nodes-base.', '')), ['webhook', 'emailSend', 'respondToWebhook']);
  const webhook = leer('correo.json').nodes[0];
  assert.equal(webhook.parameters.path, '7m-correo');
  assert.equal(webhook.parameters.httpMethod, 'POST');
  assert.equal(webhook.credentials.httpHeaderAuth.name, '7M Webhook');
  assert.deepEqual(leer('error.json').nodes.map(n => n.type.replace('n8n-nodes-base.', '')), ['errorTrigger', 'set', 'emailSend']);
  const prueba = leer('prueba-union.json').nodes.map(n => n.name);
  for (const nombre of ['Rutas', 'Casos', 'IA', 'Resultado']) assert.ok(prueba.includes(nombre), nombre);
  assert.deepEqual(flechas(leer('prueba-union.json')), ['Casos[0]→IA', 'IA[0]→Resultado', 'Probar[0]→Rutas', 'Rutas[0]→Casos']);
});

test('n8n: ningún archivo de n8n/ tiene claves, mails ni la palabra password', () => {
  for (const a of [...ARCHIVOS, 'LEEME.md']) {
    const texto = fs.readFileSync(path.join(DIR, a), 'utf8');
    assert.doesNotMatch(texto, /sk-ant/i, a);
    assert.doesNotMatch(texto, /@[a-z0-9-]+\.[a-z]/i, a);
    assert.doesNotMatch(texto, /password/i, a);
  }
});
