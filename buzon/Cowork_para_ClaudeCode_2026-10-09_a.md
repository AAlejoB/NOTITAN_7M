# Cowork → Claude Code · 09-10-2026 · 22:01 (hora de Argentina) · letra a

Responde al reporte `ClaudeCode_para_Cowork_2026-10-05_d.md`. Base: commit `f20daa3` de la rama `claude/trusting-knuth-brmpsy`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-09_a.md`. Tu reporte va en `buzon/ClaudeCode_para_Cowork_<AAAA-MM-DD del día en que lo escribas>_a.md` (si ese día ya hay uno, la letra que siga).

**Qué pasó:** Don Julio no contestó la página de preguntas de la capa 4. **Alejo decidió el 09-10 contestarlas él con los valores por defecto** y arrancar la **etapa 1** (la pregunta 12, opción A): leer los portales y guardar lo acumulado cada 30 minutos, armar la lista real **sin IA** y mostrarla en la página, para medir un día real. **Dónde corre solo cada 30 minutos (preguntas 1 y 2) lo habla Alejo con Don Julio después:** en esta ronda no se toca n8n ni ningún servidor. Lo que hacés es dejar todo listo para que, el día que algo lo corra cada 30 minutos (n8n, un cron, una computadora prendida), la lista real y la medición salgan solas.

| Paso | Qué cambia para Alejo | Archivos que se tocan |
|---|---|---|
| 1 | Sin IA, cada noticia confirmada igual tiene un bloque (nacional o internacional), con una regla provisoria | `src/provisorio.js` (nuevo), `config/reglas.json`, `test/provisorio.test.js` (nuevo) |
| 2 | La página avisa cuando la lista salió sin el juicio de la IA | `src/entrega.js`, `pagina/index.html`, `pagina/lista.json` (rearmado), `test/entrega.test.js`, `scripts/probar-pagina.js` |
| 3 | Un solo comando hace una vuelta completa: lee, guarda, arma la lista real y anota lo medido | `scripts/vuelta.js` (nuevo), `package.json`, `test/vuelta.test.js` (nuevo) |
| 4 | Un comando resume las vueltas de un día: por bloque y por corte de 4 horas | `scripts/medir.js` (nuevo), `package.json`, `test/medir.test.js` (nuevo) |
| 5 | Se puede sacar una captura de la página con la lista real | `scripts/probar-pagina.js` |
| 6 | Vueltas reales, medición, documentos y cierre | `CLAUDE.md`, `buzon/pendientes.md`, `README.md`, reporte, paquete, `buzon/capturas/` |

**No se tocan:** `src/nucleo.js`, `src/ia.js`, `src/lector.js`, `scripts/leer.js`, `scripts/armar-pagina.js`, `scripts/armar-paquete.js`, `scripts/probar-feeds.js`, `pagina/logica.js`, `ejemplos/`, `config/feeds.json`, `config/portales.json`, `config/firmas.json`, `test/casos-ia.json`, `.gitignore`, `.github/`, los `buzon/LEEME*.md` y las cartas y reportes viejos.

**Regla de toda la ronda:** nada de lo que sale de los portales entra al repo. Lo real vive en `datos/` (ya está en `.gitignore`). Al repo van el código, los tests, los documentos, el reporte y 3 capturas de pantalla.

## Qué decidió Alejo y qué es valor por defecto

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Arrancar por la etapa 1: leer y guardar cada 30 minutos, sin IA, lista real en la página, para medir un día real | Alejo (09-10) | sí |
| Las 14 preguntas de la capa 4 quedan contestadas con los valores por defecto de la página | Alejo (09-10) | sí; valen hasta que Don Julio diga otra cosa |
| Dónde corre cada 30 minutos (preguntas 1 y 2) | Alejo, con Don Julio, después | en esta ronda no se decide ni se arma |
| El bloque provisorio de un hecho sin IA: por el portal y la sección de sus notas, mitad o más | Cowork (valor por defecto) | paso 1 |
| Sin IA, `datoNuevo` es `false`: lo que tiene más de 24 h se cae por el criterio 2 | Cowork (valor por defecto) | paso 1 |
| La lista real no se commitea: vive en `datos/pagina/` | Cowork, por la regla del repo público (pregunta 4) | paso 3 |
| El texto de la franja «Sin el juicio de la IA: el bloque de cada noticia es provisorio» | Cowork (valor por defecto) | paso 2 |
| `--cada <minutos>` y el candado `vuelta.lock` | Cowork (valor por defecto) | paso 3 |
| En la medición un hecho cuenta una vez por corte, en el bloque de su última vuelta | Cowork (valor por defecto) | paso 4 |

## Paso 1 · El bloque provisorio (`src/provisorio.js`)

Hoy `decidir` necesita un juicio por hecho (`juicios[id]`) y sin juicio descarta todo con `sin_juicio`. La IA es la etapa 2. Mientras tanto, un módulo nuevo arma un **juicio provisorio** por hecho. Es puro, como el núcleo: sin leer archivos ni mirar el reloj.

### 1a · `config/reglas.json`

Agregá esta sección al final del archivo, después de `criterio1` (y antes de la llave que cierra):

~~~~
"provisorio": {
  "seccionesInternacionales": ["mundo", "el-mundo", "el mundo", "internacional", "internacionales", "america", "world", "global"]
}
~~~~

### 1b · `src/provisorio.js`, tres funciones exportadas

- `pareceInternacional(nota, { portales, reglas })` → `true` o `false`. Es `true` si pasa **alguna** de las dos: (1) el portal de la nota (`buscarPortal(dominioDe(nota), portales)` de `src/nucleo.js`) existe y tiene `ambito === 'internacional'`; (2) `nota.seccion` pasada a minúsculas y sin espacios en las puntas está en `reglas.provisorio.seccionesInternacionales`. Sirve tanto para una nota leída (`{ url, portal, seccion }`) como para una nota de la ficha de un hecho (`hecho.notas[]`, donde `portal` ya es el dominio): `dominioDe` entiende las dos.
- `bloqueProvisorio(hecho, { portales, reglas })` → `'internacional'` si la cantidad de notas del hecho que parecen internacionales, multiplicada por 2, es **mayor o igual** que la cantidad total de notas del hecho (la mitad o más); si no, `'nacional'`.
- `juiciosProvisorios(preparado, { portales, reglas })` → un objeto `juicios` con una entrada por cada hecho de `preparado.candidatos` **y** de `preparado.elegiblesAMano` (los de `enObservacion` que no son elegibles a mano no llevan juicio). Cada entrada es exactamente:

~~~~
{ datoNuevo: false, fuenteConNombre: true, interesPublico: true, desmentido: false,
  bloque: <bloqueProvisorio del hecho>, seccion: '', pais: '', provisorio: true }
~~~~

Consecuencias, para que no te sorprendan: con `datoNuevo: false`, un candidato con `viejo: true` (su primera nota tiene más de 24 h) se cae en `decidir` con `no_fresco (criterio 2)`; los frescos no se tocan. Con `seccion` y `pais` vacíos no actúan los topes por sección ni por país: solo el cupo de 7. `decidir` ignora la clave `provisorio` (solo mira las que ya conoce); queda como marca.

### 1c · Ejemplos (entrada → salida)

**E1.** Una nota de `bbc.com` con sección `politica` → parece internacional (por el portal). Una de `clarin.com` con sección `mundo` → parece internacional (por la sección). Una de `clarin.com` con sección `politica` → no.

**E2.** Un hecho con 4 notas: 2 parecen internacionales → `internacional` (2 × 2 ≥ 4). Un hecho con 5 notas: 2 parecen → `nacional` (2 × 2 = 4 < 5); 3 parecen → `internacional`.

**E3.** Con el día de ejemplo (`ejemplos/dia-de-ejemplo.js`): `preparar` y después `juiciosProvisorios` dan tantos juicios como `candidatos.length + elegiblesAMano.length`, y `decidir` con esos juicios no descarta ninguno por `sin_juicio` ni avisa «sin juicio de la IA».

### 1d · Tests (`test/provisorio.test.js`), como mínimo

1. E1, los tres casos.
2. E2, los cuatro casos (2 de 4, 1 de 4, 3 de 5, 2 de 5).
3. E3 sobre el día de ejemplo.
4. Cada juicio tiene exactamente las 8 claves de 1b, con esos valores fijos y `bloque` en `['nacional', 'internacional']`.
5. Un candidato con `viejo: true` se cae en `decidir` con motivo `no_fresco (criterio 2)` cuando los juicios son los provisorios.

## Paso 2 · La lista dice que salió sin IA, y la página lo muestra

### 2a · `src/entrega.js`

`armarEntrega(decidido, { ahora, portales, reglas, ejemplo = false, sinIA = false })`. En lo que devuelve, después de `ejemplo`, va `sinIA: Boolean(sinIA)`. Nada más cambia.

### 2b · `pagina/index.html`

- En el CSS, debajo de `.franja.ejemplo { … }`, una regla nueva con los mismos colores que la de ejemplo: `.franja.sinia { background: var(--azul-fondo); color: var(--azul); }`.
- En `dibujar()`, justo después de la línea que agrega la franja de ejemplo (`if (lista.ejemplo) …`), esta línea:

~~~~
if (lista.sinIA) franjas.appendChild(h('p', { clase: 'franja sinia', texto: 'Sin el juicio de la IA: el bloque de cada noticia es provisorio' }));
~~~~

Las dos franjas pueden verse juntas (una lista de ejemplo y sin IA) o ninguna; cada una depende solo de su clave.

### 2c · `pagina/lista.json`

`scripts/armar-pagina.js` no cambia; corré `npm run pagina` y commiteá el `pagina/lista.json` nuevo (va a tener `"sinIA": false`).

### 2d · Tests

- `test/entrega.test.js`: sin pedirlo, `sinIA` es `false`; con `sinIA: true`, es `true`; `pagina/lista.json` (el que se commitea) tiene `sinIA` `false`.
- `scripts/probar-pagina.js`, en la parte donde ya sirve una lista con `ejemplo: false` por `p.route` (la de «sin la franja de ejemplo cuando ejemplo es false»): dos comprobaciones más, con el mismo mecanismo: con `sinIA: true` la franja `.franja.sinia` existe y su texto es exactamente el de 2b; con una lista sin la clave `sinIA`, `.franja.sinia` no existe. Las 66 de hoy quedan como están.

## Paso 3 · Una vuelta completa: `npm run vuelta`

`scripts/vuelta.js`, con `"vuelta": "node scripts/vuelta.js"` en `package.json`. Reusa lo que ya existe y está exportado: `cargarNotas`, `guardarNotas`, `filtrarRutas` y `ErrorDeUso` de `scripts/leer.js`; `leerFeeds` de `src/lector.js`; `acumular`, `preparar` y `decidir` de `src/nucleo.js`; `juiciosProvisorios` del paso 1; `armarEntrega` de `src/entrega.js`. Con proxy, igual que `npm run leer`: `NODE_USE_ENV_PROXY=1`.

### 3a · Opciones

`node scripts/vuelta.js [--carpeta datos] [--cada 30] [--sin-leer]`

- `--carpeta <dir>`: dónde vive todo lo real. Por defecto `datos`, relativa a la carpeta desde donde se corre. Adentro: `notas.json` (el mismo archivo y la misma forma que `npm run leer -- --acumular datos/notas.json`: los dos comandos pueden usar el mismo archivo, no a la vez), `pagina/` (ver 3c), `vueltas.jsonl` (ver 3d) y `vuelta.lock` (ver 3b).
- `--cada <minutos>`: entero, 1 o más. Repite para siempre: corre una vuelta y espera hasta que pasen esos minutos **desde que empezó** la vuelta anterior (si la vuelta tardó más que el intervalo, la siguiente arranca enseguida). Si una vuelta falla, se muestra el error y el ciclo sigue. Se corta con Ctrl+C. Sin `--cada`, hace una vuelta y termina.
- `--sin-leer`: no sale a internet, no escribe `notas.json` ni `vueltas.jsonl`; rehace `pagina/lista.json` con lo ya guardado y muestra el resumen. Sirve para probar y para ver la lista sin gastar una lectura.
- Un valor que falta o que no es un número entero corta con un mensaje (`ErrorDeUso`), código 1, sin tocar nada.

### 3b · Una vuelta, en orden (exportá `vuelta({ carpeta, ahora, fetch })` para los tests; `feeds`, `portales`, `reglas` y `firmas` se leen de `config/`)

1. **Candado.** Si existe `<carpeta>/vuelta.lock` y su fecha de modificación tiene **menos de 25 minutos**, mostrá «Hay otra vuelta corriendo desde las HH:MM (vuelta.lock). No se hace nada.» y terminá con código 3 sin escribir nada. Si tiene 25 minutos o más, quedó de una vuelta que se cortó: se pisa y se sigue. El candado se escribe con la hora ISO adentro y **se borra al terminar, también si la vuelta falla** (`finally`).
2. **Cargar lo guardado:** `cargarNotas(<carpeta>/notas.json)` y `filtrarRutas` con los feeds, igual que `scripts/leer.js`. Si el archivo está roto, corta con el mensaje de `cargarNotas` y no se escribe nada.
3. **Leer:** `leerFeeds(feeds, { ahora, fetch })`.
4. **Acumular y guardar:** `acumular(guardadas, lectura.notas, { reglas, ahora })` y `guardarNotas(<carpeta>/notas.json, acumulado.notas)`. Se guarda aunque ningún feed haya respondido (así se sacan las notas que ya pasaron las 48 h).
5. **Preparar:** `preparar(acumulado.notas, { portales, reglas, firmas, ahora })`.
6. **Juicios provisorios:** `juiciosProvisorios(p, { portales, reglas })`.
7. **Decidir:** `decidir(p.candidatos, juicios, { reglas, elegiblesAMano: p.elegiblesAMano })`, sin `cupo` (vale el tope, 7).
8. **La entrega:** `armarEntrega(d, { ahora, portales, reglas, ejemplo: false, sinIA: true })`.
9. **La carpeta de la página** (3c).
10. **La línea de la medición** (3d).
11. **El resumen en pantalla** (3e).
12. **Código de salida:** 0 si leyó al menos un feed; **2 si ningún feed respondió** (la lista igual se rehizo con lo guardado y la línea de medición igual se escribió, con `leidas: 0`); 3 por el candado; 1 por error de uso. Con `--cada`, el programa no termina: el código de cada vuelta se muestra en su resumen.

### 3c · `<carpeta>/pagina/`: lo que algún día se sube al hosting

En cada vuelta se escriben tres archivos, y nada más: `lista.json` (la entrega de 3b-8, en JSON con sangría de 2 espacios como hace `armar-pagina.js`, escrito en un temporal y renombrado, como `guardarNotas`), y copias frescas de `pagina/index.html` y `pagina/logica.js` del repo (se pisan en cada vuelta, así nunca quedan viejas). La página lee `lista.json` de su misma carpeta, así que esa carpeta se ve con cualquier servidor estático, tal cual.

### 3d · `<carpeta>/vueltas.jsonl`: una línea JSON por vuelta, al final del archivo

~~~~
{
  "hora": "<ahora, ISO>",
  "duracionMs": <entero>,
  "feeds": { "ok": <cuántos feeds tienen estado 'ok'>, "mal": <cuántos tienen otro estado>, "caidos": ["<los nombres de esos 'mal'>", ...] },
  "notas": { "leidas": <lectura.notas.length>, "nuevas": <acumulado.agregadas.length>, "repetidas": <acumulado.repetidas.length>, "borradas": <acumulado.borradas.length>, "acumuladas": <acumulado.notas.length> },
  "hechos": { "total": <p.resumen.hechos>, "porGrupos": { "1": n, "2": n, "3": n, "4": n, "5+": n } },
  "confirmados": [ { "id", "bloque", "grupos", "via", "viejo", "titulo" } ],
  "cuatroDeCinco": [ { "id", "bloque", "grupos", "conFirma", "titulo" } ],
  "lista": { "nacional": n, "internacional": n, "aManoNacional": n, "aManoInternacional": n, "noFresco": n },
  "avisos": [ "..." ]
}
~~~~

- `porGrupos` se cuenta igual que el bloque «HECHOS SEGÚN EN CUÁNTOS GRUPOS SALIERON» de `scripts/leer.js`: candidatos, en observación y los descartados por `no_llego_a_` (se saca el número del motivo).
- `confirmados` son los `p.candidatos`: `bloque` es el provisorio del paso 1, `via` es `'A'` o `'B'`, `viejo` el del hecho.
- `cuatroDeCinco` son los `p.elegiblesAMano`: `conFirma` es `true` si el hecho tiene al menos una `firmasReconocidas`.
- `lista.noFresco` es cuántos descartados de `decidir` tienen un motivo que empieza con `no_fresco`.
- `avisos` junta, en este orden, `lectura.avisos`, `p.avisos` y `d.avisos`.

### 3e · El resumen en pantalla (hasta 15 renglones)

Hora de Argentina de la vuelta; feeds OK y caídos (con los nombres); notas leídas, nuevas y acumuladas; hechos según grupos en un renglón (`1: n · 2: n · 3: n · 4: n · 5+: n`); confirmados nacionales e internacionales; 4/5 por bloque; lo que quedó en la lista (`Lista: N nacionales + I internacionales`); dónde escribió (`<carpeta>/pagina/lista.json`); el código de salida.

### 3f · Ejemplos (entrada → salida)

**E4.** Carpeta `datos` vacía, 19 feeds andan. Salida: `datos/notas.json` con lo leído; `datos/pagina/` con `index.html`, `logica.js` y `lista.json` (`ejemplo: false`, `sinIA: true`, `generadaEn` igual a la hora de la vuelta); `datos/vueltas.jsonl` con 1 línea; no queda `vuelta.lock`; código 0.

**E5.** Misma carpeta, un minuto después, los mismos feeds. Salida: `notas.nuevas` casi 0 y `repetidas` casi todas; `vueltas.jsonl` con 2 líneas; `lista.json` rehecho; código 0.

**E6.** Un feed no responde. Salida: `feeds.mal` 1 con su nombre en `caidos`, el aviso «Feed sin leer: …» en `avisos`, todo lo demás igual; código 0.

**E7.** Ningún feed responde (sin internet). Salida: `notas.leidas` 0, la lista se rehace con lo guardado, la línea se escribe igual; código 2.

### 3g · Tests (`test/vuelta.test.js`), con un `fetch` falso como en `test/lector.test.js` (`fetchPorUrl`) y una carpeta temporal; `feeds`, `portales` y `reglas` pueden ser los de `config/` o inventados, pero las notas inventadas tienen que armar al menos un hecho de 5 grupos. Como mínimo:

1. E4 (todos los archivos, las claves de la línea del jsonl tal como las lista 3d, sin candado al final).
2. E5 (`nuevas` 0 y `repetidas` igual a lo leído; 2 líneas).
3. E6 (un `fetch` que tira error para un feed).
4. E7 (código 2, `leidas` 0, la lista se arma con lo guardado).
5. Candado fresco → código 3 y ningún archivo cambia; candado con fecha de hace 30 minutos (`utimesSync`) → la vuelta corre normal.
6. `notas.json` roto → corta con `ErrorDeUso` y no aparecen ni `pagina/lista.json` ni `vueltas.jsonl`.
7. `--sin-leer` → no se llama a `fetch`, no cambian `notas.json` ni `vueltas.jsonl`, sí se rehace `pagina/lista.json`.
8. Un hecho de 5 grupos con la mitad o más de sus notas de portales internacionales (o con sección `mundo`) sale en `internacionales` de la lista y en `confirmados` con `bloque: 'internacional'`; otro de medios argentinos con sección `politica` sale en `nacionales`.

## Paso 4 · La medición: `npm run medir`

`scripts/medir.js`, con `"medir": "node scripts/medir.js"` en `package.json`. Lee `<carpeta>/vueltas.jsonl` y responde la pregunta pendiente de `pendientes.md` («Cuántas noticias da la regla de 5 en un día real»).

### 4a · Opciones

`node scripts/medir.js [--carpeta datos] [--dia AAAA-MM-DD]`. Sin `--dia`, muestra todos los días que haya en el archivo, uno después del otro. Si el archivo no existe o está vacío: «Todavía no hay vueltas en <archivo>», código 0.

### 4b · Qué cuenta

- El **día y el corte** de cada vuelta salen de su `hora` pasada a hora de Argentina con `timeZone: 'America/Argentina/Buenos_Aires'` (como `fechaCorta` de `scripts/leer.js`). Los cortes son seis, de 4 horas, y se escriben con guion simple: `00-04`, `04-08`, `08-12`, `12-16`, `16-20` y `20-24`. Exportá `diaYCorteDe(hora)` → `{ dia: 'AAAA-MM-DD', corte: '08-12' }`.
- Exportá `porDiaYCorte(vueltas)` → un objeto `{ 'AAAA-MM-DD': { '00-04': [vueltas], … } }` (solo los cortes que tienen vueltas).
- En un corte, **un hecho cuenta una sola vez** (por su `id`), **en el bloque de su última vuelta** dentro de ese corte (la de `hora` más nueva).
- Exportá `resumir(vueltas)` → `{ vueltas: n, confirmados: { nacional, internacional }, sinFirma: { nacional, internacional }, conFirma: { nacional, internacional }, viaB: { nacional, internacional } }`, donde: `confirmados` son ids distintos de `confirmados`; `sinFirma` son ids distintos de `cuatroDeCinco` con `conFirma` falso; `conFirma`, los que lo tienen verdadero; `viaB`, ids distintos de `confirmados` con `via` igual a `'B'`. Se usa para cada corte (con las vueltas de ese corte) y para el día entero (con todas las del día).
- Por día, una fila por corte con esos números y la cantidad de vueltas; al final, la fila **«Día entero (distintos)»**: `resumir` con todas las vueltas del día (no es la suma de las filas: un hecho que está en dos cortes vale 1).
- Debajo, **«Feeds caídos»**: cada nombre que aparezca en `caidos`, con en cuántas vueltas de cuántas; y **«Vueltas sin ningún feed»**: cuántas tienen `feeds.ok` 0.

### 4c · Ejemplos (entrada → salida)

**E8.** Dos vueltas a las 10:05 y 10:35 (hora de Argentina) con el mismo id confirmado como `nacional` → en el corte `08-12`, `confirmados.nacional` es 1.

**E9.** El mismo id en una vuelta de las 11:50 y otra de las 12:10 → cuenta 1 en `08-12` y 1 en `12-16`, y 1 en «Día entero».

**E10.** Una vuelta con `hora` `2026-10-10T02:30:00.000Z` → `diaYCorteDe` da `{ dia: '2026-10-09', corte: '20-24' }` (son las 23:30 de Argentina).

**E11.** El mismo id sale `nacional` a las 10:05 y `internacional` a las 10:35 → en `08-12` cuenta 1 en `internacional` y 0 en `nacional`.

### 4d · Tests (`test/medir.test.js`), como mínimo: E8, E9, E10, E11, una 4/5 con `conFirma` true va a `conFirma` y con false a `sinFirma`, y archivo inexistente o vacío → el mensaje de 4a sin romper.

## Paso 5 · Captura de la página con la lista real

`scripts/probar-pagina.js` suma `--solo-capturas <carpeta>`, que va junto con `--capturas <nombre>`:

- Sirve esa carpeta (tiene que tener `index.html`, `logica.js` y `lista.json`) con el mismo servidor que ya usa para la copia, **en vez de** la copia de `pagina/`. No escribe nada en esa carpeta.
- No corre las 66 comprobaciones ni arma el estado de las capturas de siempre (la «Recién confirmada», la «Nueva», la 4/5 llevada: eso usa ids del día de ejemplo). Solo abre la página, espera hasta 10 segundos a que aparezca la primera `.noticia` o la franja de error, y saca las mismas 3 capturas de siempre, con los mismos nombres: `buzon/capturas/pagina-<nombre>-390.png`, `-1200.png` y `-390-oscuro.png`. Muestra las 3 rutas y termina con código 0.
- `--solo-capturas` sin `--capturas` → el mismo error de uso que hoy da `--capturas` sin nombre, código 2.
- Sin `--solo-capturas`, todo sigue igual que hoy.

## Paso 6 · Vueltas reales, medición, documentos y cierre

### 6a · Las vueltas reales

Apenas el paso 3 pasa sus tests: **primera vuelta** real, `npm run vuelta` (con `NODE_USE_ENV_PROXY=1` si hace falta, como `npm run leer`). Si en tu sesión todavía está el `datos/notas.json` de las rondas del 04-10, la vuelta lo usa: anotá en el reporte cuántas notas tenía antes. Seguí con los pasos 4 y 5, y al terminarlos hacé la **segunda vuelta**. Que pasen al menos 10 minutos entre las dos.

### 6b · Lo que medís para el reporte

1. El resumen de pantalla de cada una de las 2 vueltas, tal cual.
2. La tabla de `npm run medir`, tal cual.
3. La lista de `confirmados` de la segunda vuelta: para cada uno, el título, los grupos, el bloque provisorio y la cuenta «parecen internacionales / total de notas». Es para que Cowork revise a ojo la regla del paso 1.
4. Las 25 secciones más frecuentes en `datos/notas.json`, con su cantidad (un `node -e` de una línea; si una sección es de `seccionesInternacionales`, marcalo). Es para ajustar la lista de 1a.
5. `duracionMs` de cada vuelta, y el tamaño en KB de `datos/notas.json` y de `datos/pagina/lista.json` (sirven para la pregunta 4 de Don Julio).
6. Cuántas comprobaciones da `npm run probar-pagina` (eran 66).

### 6c · Documentos

- **`CLAUDE.md`, «Estado»:** un renglón nuevo para la etapa 1 (09-10): qué hay (`npm run vuelta`, `--cada`, `--sin-leer`, el candado, `datos/pagina/` como lo que se sube al hosting, `vueltas.jsonl`, `npm run medir`, `--solo-capturas`), que la lista real sale `sinIA: true` con el bloque provisorio del paso 1 (la regla en una frase) y `datoNuevo` en `false`, y que la IA es la etapa 2. **«Siguiente paso»:** reemplazá los dos párrafos por uno: la etapa 1 está hecha en el repo; falta dónde corre cada 30 minutos (preguntas 1 y 2, Alejo con Don Julio), y después las etapas 2 (la IA que juzga), 3 (la página en su hosting, pregunta 5) y 4 (la unión, tras la prueba de 3 veces). Las 14 preguntas quedaron contestadas por Alejo con los valores por defecto el 09-10.
- **`buzon/pendientes.md`:**
  - Al ítem «Capa 4», un renglón al final (con dos espacios, como los otros): «**09-10 (Alejo):** Don Julio no contestó la página; Alejo contestó las 14 preguntas con los valores por defecto. Dónde corre cada 30 minutos (preguntas 1 y 2) lo habla con Don Julio después. Lo demás vale hasta que Don Julio diga otra cosa.»
  - Al ítem «Cuántas noticias da la regla de 5 en un día real», al final del mismo renglón: « **Herramienta lista (09-10):** `npm run vuelta -- --cada 30` un día entero y después `npm run medir`. Falta una máquina que lo corra: espera las preguntas 1 y 2.»
  - En «Más adelante», el ítem «Noticias reales en la página cuando exista la IA» pasa a: «Noticias reales en la página con el juicio de la IA (hoy la lista real sale sin IA, con la franja que lo dice; es la etapa 2).»
  - En «Cowork → Claude Code»: lo que te haya quedado para la próxima carta, o «Nada pendiente por ahora».
  - En «Hecho», primer renglón debajo de `## Hecho`: «- [x] 09-10-2026 · **Etapa 1 en el repo** (decidió Alejo): `npm run vuelta` hace una vuelta completa sin IA y deja la lista real en `datos/pagina/`; `npm run medir` resume las vueltas por corte de 4 h; la página avisa «Sin el juicio de la IA». Dónde corre, con Don Julio.»
- **`README.md`:** sumá `npm run vuelta` y `npm run medir` a la lista de comandos, con una frase cada uno, y corregí el número de tests del renglón de `npm test` por el real.

### 6d · Cuándo está listo (comprobalo y ponelo en el reporte)

| # | Comprobación | Tiene que dar |
|---|---|---|
| C1 | `npm test` antes y después | antes 200 bien y 1 pendiente; después todos bien, al menos 20 más que antes, y sigue 1 pendiente |
| C2 | `node -e` que corra `preparar` sobre el día de ejemplo y `juiciosProvisorios`, e imprima `Object.keys(juicios).length` y `candidatos.length + elegiblesAMano.length` | los dos números iguales |
| C3 | `npm run pagina` y después `grep -c '"sinIA": false' pagina/lista.json` | 1 |
| C4 | Primera `npm run vuelta`: código de salida, `ls datos/pagina`, `wc -l datos/vueltas.jsonl`, `grep -c '"sinIA": true' datos/pagina/lista.json`, `ls datos/vuelta.lock` | 0 (o 2 si no hubo internet); `index.html logica.js lista.json`; 1 línea; 1; el lock no está |
| C5 | Segunda `npm run vuelta`, al menos 10 minutos después | `wc -l datos/vueltas.jsonl` da 2; `repetidas` mayor que 0 |
| C6 | `npm run medir` | la tabla del día de hoy con los cortes de las 2 vueltas y la fila «Día entero» |
| C7 | `npm run probar-pagina` (con `npm i --no-save playwright`) | 0 MAL y al menos 68 comprobaciones |
| C8 | `npm run probar-pagina -- --solo-capturas datos/pagina --capturas real-<AAAA-MM-DD>` | 3 archivos nuevos en `buzon/capturas/` |
| C9 | `git ls-files datos` | nada: lo real no entra al repo |
| C10 | Con el reporte ya escrito y antes de `npm run paquete`: `git add -A` y `git diff --cached --stat f20daa3` | solo estos archivos: `config/reglas.json`, `src/provisorio.js`, `src/entrega.js`, `pagina/index.html`, `pagina/lista.json`, `scripts/vuelta.js`, `scripts/medir.js`, `scripts/probar-pagina.js`, `package.json`, `test/provisorio.test.js`, `test/entrega.test.js`, `test/vuelta.test.js`, `test/medir.test.js`, `README.md`, `CLAUDE.md`, `buzon/pendientes.md`, esta carta, tu reporte y las 3 capturas (los números de líneas no importan) |
| C11 | La hora del encabezado de tu reporte | la que da `TZ=America/Argentina/Buenos_Aires date` justo antes de escribirlo; pegá esa salida en esta fila |

## Qué NO se hace en esta ronda

- Llamar a ningún modelo de IA, ni armar nada en n8n, Vercel, Supabase ni ningún servidor: dónde corre lo decide Alejo con Don Julio.
- Dejar `npm run vuelta -- --cada 30` corriendo en tu sesión: hacés 2 vueltas sueltas y listo.
- Commitear nada de `datos/`, ni listas reales, ni notas de los portales. Las 3 capturas sí.
- Tocar la página de preguntas de Don Julio.
- Cambiar `src/nucleo.js`, `src/ia.js`, `src/lector.js` ni `scripts/leer.js`: si algo te falta de ahí, lo marcás en el reporte y seguís con lo que puedas.

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1 (1a, 1b, tests 1d), `npm test`, C2. Commit.
3. Paso 2 (2a, 2b, 2c, tests 2d), `npm test`, C3. Commit.
4. Paso 3 (3a a 3e, tests 3g), `npm test`. **Primera vuelta real** (6a), C4. Commit (sin `datos/`).
5. Paso 4 (4a a 4d), `npm test`. Commit.
6. Paso 5, C7. Commit.
7. **Segunda vuelta real**, C5, C6, C8 (las capturas). Commit.
8. Paso 6c (documentos), el reporte con lo de 6b y C1 a C11, C9 y C10, `npm run paquete`, commit y push.
9. Tu mensaje final en el chat, como dice «El molde» de `buzon/LEEME_COWORK.md`: un apartado para Cowork con la línea de arranque de `buzon/LEEME.md`; en el molde, QUÉ ESPERÁS: la revisión del reporte y la próxima carta; SE APLICA: cuando el reporte esté pusheado. Al final, la línea «SIGUE TRABADO» con: dónde corre cada 30 minutos, que espera a Alejo con Don Julio.
