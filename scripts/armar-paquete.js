'use strict';
// Arma un archivo por rol de Cowork (DISEÑADOR y PREPARADOR) con todo lo que ese chat tiene que leer al arrancar,
// para pegárselo de una sola vez cuando el chat no puede abrir el repo. Los textos salen tal cual del repo.
// Uso: node scripts/armar-paquete.js      (o npm run paquete). Escribe en buzon/paquetes/.
// El paquete es una foto: hay que volver a armarlo al cerrar cada tanda.
const { readFileSync, readdirSync, writeFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const raiz = join(__dirname, '..');
const buzon = join(raiz, 'buzon');
const salida = join(buzon, 'paquetes');

// Familias de cartas que cada rol lee, según su LEEME_<ROL>.md.
const roles = {
  DISENADOR: { nombre: 'DISEÑADOR', leeme: 'LEEME_DISENADOR.md', cartas: ['PREPARADOR_para_Disenador_'] },
  PREPARADOR: { nombre: 'PREPARADOR', leeme: 'LEEME_PREPARADOR.md', cartas: ['Disenador_para_PREPARADOR_', 'ClaudeCode_para_PREPARADOR_'] },
};

// La carta más nueva de una familia. El nombre termina en AAAA-MM-DD_letra.md, así que ordenar por nombre alcanza.
function masNueva(prefijo, carpeta = buzon) {
  const cartas = readdirSync(carpeta).filter(f => f.startsWith(prefijo) && f.endsWith('.md')).sort();
  return cartas.length ? cartas[cartas.length - 1] : null;
}

// Los archivos del paquete, en el orden en que se leen: primero el arranque del rol.
function archivosDe(rol, carpeta = buzon, rutaClaudeMd = join(raiz, 'CLAUDE.md')) {
  const { leeme, cartas } = roles[rol];
  const lista = [
    { ruta: `buzon/${leeme}`, ubicacion: join(carpeta, leeme) },
    { ruta: 'buzon/LEEME.md', ubicacion: join(carpeta, 'LEEME.md') },
    { ruta: 'CLAUDE.md', ubicacion: rutaClaudeMd },
    { ruta: 'buzon/pendientes.md', ubicacion: join(carpeta, 'pendientes.md') },
  ];
  for (const prefijo of cartas) {
    const carta = masNueva(prefijo, carpeta);
    if (carta) lista.push({ ruta: `buzon/${carta}`, ubicacion: join(carpeta, carta) });
  }
  return lista;
}

function armarPaquete(rol, hora, carpeta = buzon, rutaClaudeMd = join(raiz, 'CLAUDE.md')) {
  const { nombre, leeme } = roles[rol];
  const archivos = archivosDe(rol, carpeta, rutaClaudeMd).map(a => ({ ...a, texto: readFileSync(a.ubicacion, 'utf8').trimEnd() }));
  const linea = '='.repeat(60);
  const partes = [
    `PAQUETE PARA PEGAR · ${nombre} de NOTITAN_7M`,
    `Armado el ${hora} (hora de Argentina) con "npm run paquete".`,
    '',
    `Para el chat de Cowork: este paquete reemplaza abrir el repo. Son ${archivos.length} archivos, uno atrás del otro, tal cual están en el repo. Leelos en orden y arrancá como dice el primero (${leeme}).`,
    'Lo que escribas (las cartas, con el nombre que indica buzon/LEEME.md) entregalo como texto: Alejo lo pega en el chat de Claude Code, que lo guarda en el repo.',
    '',
    'Archivos de este paquete:',
    ...archivos.map((a, i) => `${i + 1}. ${a.ruta}`),
  ];
  archivos.forEach((a, i) => partes.push('', linea, `ARCHIVO ${i + 1} de ${archivos.length} · ${a.ruta}`, linea, '', a.texto));
  partes.push('', linea, 'FIN DEL PAQUETE', linea, '');
  return partes.join('\n');
}

function main() {
  const hora = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', dateStyle: 'short', timeStyle: 'short', hour12: false });
  mkdirSync(salida, { recursive: true });
  for (const rol of Object.keys(roles)) {
    const texto = armarPaquete(rol, hora);
    const destino = join(salida, `PEGAR_${rol}.md`);
    writeFileSync(destino, texto);
    console.log(`${roles[rol].nombre.padEnd(11)} ${String(archivosDe(rol).length).padStart(2)} archivos  ${String(Buffer.byteLength(texto)).padStart(6)} bytes  buzon/paquetes/PEGAR_${rol}.md`);
  }
}

if (require.main === module) main();

module.exports = { roles, masNueva, archivosDe, armarPaquete };
