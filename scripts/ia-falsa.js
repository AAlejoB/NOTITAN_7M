'use strict';
// Una IA falsa, solo para probar la capa 4 sin clave: contesta POST /v1/messages con la forma de la API de mensajes.
//   - A la pregunta de juicio, un juicio como el provisorio (bloque "internacional" si después de «Hecho:» aparece la palabra
//     «internacional», si no "nacional").
//   - A la pregunta de unión, {"misma": false, "porque": "ia falsa"}.
// No es la IA de verdad: no sirve para la prueba de la unión ni para medir nada. En el servidor real se usa la de Anthropic.
// Uso: node scripts/ia-falsa.js [--puerto 7100] [--fallar <n>]
//   --fallar <n>  contesta 500 a una de cada <n> llamadas (la n-ésima, la 2n-ésima…), para probar el plan B.
const http = require('node:http');

const JUICIO = 'Sos el editor que revisa noticias para 7M. Te paso un hecho';
const UNION = 'Sos el editor que revisa noticias para 7M. Te paso dos hechos';

function contestar(texto) {
  if (texto.startsWith(UNION)) return JSON.stringify({ misma: false, porque: 'ia falsa' });
  if (texto.startsWith(JUICIO)) {
    const hecho = texto.slice(texto.lastIndexOf('Hecho:'));
    return JSON.stringify({
      datoNuevo: false, fuenteConNombre: true, interesPublico: true,
      bloque: /internacional/i.test(hecho) ? 'internacional' : 'nacional',
      desmentido: false, seccion: 'otra', pais: '', porque: {},
    });
  }
  return 'No entiendo la pregunta.';
}

function crearServidor({ fallar = 0 } = {}) {
  let llamadas = 0;
  return http.createServer((req, res) => {
    const responder = (codigo, dato) => {
      res.writeHead(codigo, { 'content-type': 'application/json' });
      res.end(JSON.stringify(dato));
    };
    if (req.method !== 'POST' || req.url.split('?')[0] !== '/v1/messages') return responder(404, { type: 'error', error: { type: 'not_found_error', message: 'no' } });
    let cuerpo = '';
    req.on('data', c => { cuerpo += c; });
    req.on('end', () => {
      llamadas++;
      if (fallar > 0 && llamadas % fallar === 0) return responder(500, { type: 'error', error: { type: 'api_error', message: 'ia falsa: falla a propósito' } });
      let pedido;
      try { pedido = JSON.parse(cuerpo); } catch { return responder(400, { type: 'error', error: { type: 'invalid_request_error', message: 'JSON inválido' } }); }
      const mensaje = ((pedido.messages || [])[0] || {}).content;
      const texto = typeof mensaje === 'string' ? mensaje : Array.isArray(mensaje) ? mensaje.map(b => b.text || '').join('') : '';
      responder(200, {
        id: `msg_falso_${llamadas}`, type: 'message', role: 'assistant', model: pedido.model || 'ia-falsa',
        content: [{ type: 'text', text: contestar(texto) }],
        stop_reason: 'end_turn', usage: { input_tokens: 0, output_tokens: 0 },
      });
    });
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const valor = (b, def) => { const i = args.indexOf(b); return i < 0 ? def : Number(args[i + 1]); };
  const puerto = valor('--puerto', 7100);
  const fallar = valor('--fallar', 0);
  crearServidor({ fallar }).listen(puerto, '127.0.0.1', () => {
    console.log(`IA falsa en http://127.0.0.1:${puerto}/v1/messages${fallar ? ` (falla 1 de cada ${fallar})` : ''}. Ctrl+C para cortar.`);
  });
}

module.exports = { crearServidor, contestar };
