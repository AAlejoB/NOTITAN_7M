'use strict';
// Las personas que entran a la página (scripts/servir.js). Viven en <datos>/usuarios.json, que nunca va al repo.
// Uso: node scripts/usuario.js [--carpeta datos] <orden> [mail]
//   agregar <mail>      crea la persona con una contraseña temporal al azar y la muestra UNA sola vez.
//   sacar <mail>        la borra.
//   listar              los mails y cuándo se crearon.
//   nueva-clave <mail>  le pone otra contraseña temporal al azar (por si no le llega el mail de «olvidé mi clave»).
// Las contraseñas se guardan con scrypt (sal de 16 bytes, hash de 64): nunca en texto. Los mails, en minúsculas.
// Códigos: 0 bien · 1 error de uso (orden desconocida, mail inválido, ya existe, no existe).
const { randomBytes, randomInt, scryptSync, timingSafeEqual } = require('node:crypto');
const { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

class ErrorDeUso extends Error {}

const normalizarMail = mail => String(mail || '').trim().toLowerCase();
// Tiene @ y, después, un punto (con algo antes y después de cada uno).
const mailValido = mail => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizarMail(mail));

function claveAlAzar(largo = 12) {
  let t = '';
  for (let i = 0; i < largo; i++) t += LETRAS[randomInt(LETRAS.length)];
  return t;
}

function hashear(clave, sal = randomBytes(16).toString('hex')) {
  return { sal, hash: scryptSync(String(clave), Buffer.from(sal, 'hex'), 64).toString('hex') };
}

function claveCorrecta(usuario, clave) {
  if (!usuario) return false;
  const esperado = Buffer.from(usuario.hash, 'hex');
  const dado = scryptSync(String(clave), Buffer.from(usuario.sal, 'hex'), 64);
  return esperado.length === dado.length && timingSafeEqual(esperado, dado);
}

const archivo = carpeta => join(carpeta, 'usuarios.json');

function cargarUsuarios(carpeta) {
  if (!existsSync(archivo(carpeta))) return [];
  const datos = JSON.parse(readFileSync(archivo(carpeta), 'utf8'));
  if (!Array.isArray(datos)) throw new ErrorDeUso(`${archivo(carpeta)} no es una lista. No lo toqué.`);
  return datos;
}

function guardarUsuarios(carpeta, usuarios) {
  mkdirSync(carpeta, { recursive: true });
  const temporal = `${archivo(carpeta)}.tmp`;
  writeFileSync(temporal, JSON.stringify(usuarios, null, 2) + '\n', { mode: 0o600 });
  renameSync(temporal, archivo(carpeta));
}

const buscar = (usuarios, mail) => usuarios.find(u => u.mail === normalizarMail(mail)) || null;

// → la contraseña temporal (se muestra una sola vez).
function agregar(carpeta, mail, { ahora = new Date().toISOString() } = {}) {
  if (!mailValido(mail)) throw new ErrorDeUso(`"${mail}" no parece un mail (tiene que tener @ y un punto después).`);
  const usuarios = cargarUsuarios(carpeta);
  if (buscar(usuarios, mail)) throw new ErrorDeUso(`${normalizarMail(mail)} ya existe. Para darle otra contraseña: nueva-clave ${normalizarMail(mail)}`);
  const clave = claveAlAzar();
  usuarios.push({ mail: normalizarMail(mail), ...hashear(clave), creado: ahora });
  guardarUsuarios(carpeta, usuarios);
  return clave;
}

function sacar(carpeta, mail) {
  const usuarios = cargarUsuarios(carpeta);
  if (!buscar(usuarios, mail)) throw new ErrorDeUso(`${normalizarMail(mail)} no existe.`);
  guardarUsuarios(carpeta, usuarios.filter(u => u.mail !== normalizarMail(mail)));
}

const listar = carpeta => cargarUsuarios(carpeta).map(u => ({ mail: u.mail, creado: u.creado }));

// Cambia la contraseña. Sin `clave`, pone una temporal al azar y la devuelve.
function cambiarClave(carpeta, mail, clave = claveAlAzar()) {
  const usuarios = cargarUsuarios(carpeta);
  const u = buscar(usuarios, mail);
  if (!u) throw new ErrorDeUso(`${normalizarMail(mail)} no existe.`);
  Object.assign(u, hashear(clave));
  guardarUsuarios(carpeta, usuarios);
  return clave;
}

function main(args) {
  const i = args.indexOf('--carpeta');
  const carpeta = i < 0 ? 'datos' : args[i + 1];
  if (!carpeta || carpeta.startsWith('--')) throw new ErrorDeUso('--carpeta necesita un valor.');
  const resto = args.filter((_, k) => i < 0 || (k !== i && k !== i + 1));
  const [orden, mail] = resto;
  const necesitaMail = () => { if (!mail) throw new ErrorDeUso(`${orden} necesita un mail.`); };
  if (orden === 'agregar') {
    necesitaMail();
    const clave = agregar(carpeta, mail);
    console.log(`Listo: ${normalizarMail(mail)}\nContraseña temporal (se muestra una sola vez; pasásela por un canal privado): ${clave}`);
  } else if (orden === 'sacar') {
    necesitaMail();
    sacar(carpeta, mail);
    console.log(`Listo: ${normalizarMail(mail)} ya no entra.`);
  } else if (orden === 'listar') {
    const lista = listar(carpeta);
    console.log(lista.length ? lista.map(u => `${u.mail} · creado ${u.creado}`).join('\n') : 'No hay nadie todavía.');
  } else if (orden === 'nueva-clave') {
    necesitaMail();
    console.log(`Listo: ${normalizarMail(mail)}\nContraseña temporal nueva (se muestra una sola vez): ${cambiarClave(carpeta, mail)}`);
  } else {
    throw new ErrorDeUso('Uso: node scripts/usuario.js [--carpeta datos] agregar <mail> | sacar <mail> | listar | nueva-clave <mail>');
  }
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    if (e instanceof ErrorDeUso) console.error(e.message);
    else console.error(e);
    process.exit(1);
  }
}

module.exports = { ErrorDeUso, normalizarMail, mailValido, claveAlAzar, hashear, claveCorrecta, cargarUsuarios, guardarUsuarios, buscar, agregar, sacar, listar, cambiarClave };
