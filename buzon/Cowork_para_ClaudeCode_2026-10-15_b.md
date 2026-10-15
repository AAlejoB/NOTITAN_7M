# Cowork → Claude Code · 15-10-2026 · 10:20 (hora de Argentina) · letra b

No responde a ninguna carta: es **la carta de la capa 4**, la que `buzon/pendientes.md` (sección de las 23:30 del 14-10) decía que se escribía después de la medición. La medición sigue corriendo en la compu de Alejo hasta el 16/10 después de las 00:30 (esta carta no la toca: no usa `datos/` de esa compu); lo que va en «Qué dejó la medición», abajo, es **parcial**, hasta las 09:44 del 15-10 (38 vueltas, 32 noticias distintas con 5 medios). Alejo decidió el 15-10 a las 10:34 mandarte esta carta ahora porque no depende de esos números. Base: commit `da5ef4e` de la rama `claude/trusting-knuth-brmpsy`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-15_b.md`. La carta tiene **dos fases**, con un reporte cada una:

- **Fase A (ahora, en tu entorno):** el código, los workflows de n8n como archivos, la página con login, la guía de instalación, los tests, y el reporte `buzon/ClaudeCode_para_Cowork_2026-10-15_b.md` (o la letra que siga si ya hay una `b` ese día).
- **Fase B (el día que Alejo instale en el servidor de Don Julio; Alejo te la pide con una línea en una tanda nueva, con la compu de Don Julio al lado):** acompañar la instalación paso a paso, correr la prueba de la unión 3 veces, la primera vuelta real, y el reporte `buzon/ClaudeCode_para_Cowork_<fecha>_<letra>.md`.

**Qué pasa al final de esto, contado como lo ve quien usa el programa:** 7M deja de correr en la compu de Alejo. Corre cada 30 minutos en el servidor de Don Julio, adentro de su n8n. Cada vuelta lee los 19 portales, junta las notas con las de las últimas 48 horas, arma los hechos, le pregunta a la IA (Claude Haiku 4.5) solo por los hechos que todavía no juzgó, decide con esos juicios (ya no con el bloque provisorio) y escribe la lista. La gente de Canal 2 entra a una dirección con su mail y su contraseña y ve la página de hoy, siempre con lo último. Si algo falla (ningún portal contesta, la IA no contesta, la vuelta se rompe), Alejo y Don Julio reciben un mail con el detalle, como mucho uno por hora, y la página dice «contactá al administrador». La página C (pestañas, pivote, tres botones) **no** entra en esta carta: viene en la siguiente, sobre lo que esta deja andando.

| Paso | Qué cambia | Archivos que se tocan |
|---|---|---|
| 1 | `src/capa4.js`: la vuelta partida en dos mitades alrededor de la IA, pura, para que la llame n8n desde el disco | `src/capa4.js`, `test/capa4.test.js` (nuevos) |
| 2 | La IA en `config/reglas.json` (modelo, temperatura, tope de tokens) y el juicio provisorio como plan B | `config/reglas.json`, `src/entrega.js`, `test/entrega.test.js` |
| 3 | Los workflows de n8n, como archivos que se importan: la vuelta, el correo, el error y la prueba de la unión | `n8n/vuelta.json`, `n8n/correo.json`, `n8n/error.json`, `n8n/prueba-union.json`, `n8n/LEEME.md`, `test/n8n.test.js` (nuevos) |
| 4 | La página con login: un servidor chico en Node, sin librerías, que sirve `pagina/` solo a quien entró | `scripts/servir.js`, `scripts/usuario.js`, `pagina/entrar.html`, `test/servir.test.js`, `test/usuario.test.js` (nuevos), `package.json` |
| 5 | La página: «contactá al administrador», las noticias con juicio provisorio, y qué hace si no está logueada | `pagina/index.html`, `scripts/probar-pagina.js` |
| 6 | Una IA falsa para probar todo en tu entorno sin clave | `scripts/ia-falsa.js` (nuevo) |
| 7 | La guía de instalación para Alejo y Don Julio | `docs/INSTALAR_EN_EL_SERVIDOR.md` (nuevo) |
| 8 | Fase A: documentos, reporte, paquete | `README.md`, `CLAUDE.md`, `buzon/pendientes.md`, reporte, paquete |
| 9 | Fase B: instalar, probar la unión 3 veces, primera vuelta real, reporte | reporte, `CLAUDE.md`, `buzon/pendientes.md`, paquete |

**No se tocan:** `src/nucleo.js`, `src/ia.js` (todo lo que la capa 4 necesita de la IA ya está ahí; si te falta algo, lo decís en el reporte y lo resolvés en `src/capa4.js`), `src/lector.js`, `src/provisorio.js`, `scripts/vuelta.js` (sigue siendo la vuelta sin IA para medir en una compu), `scripts/leer.js`, `scripts/medir.js`, `scripts/ver.js`, `scripts/probar-feeds.js`, `scripts/armar-pagina.js`, `scripts/armar-paquete.js`, `pagina/logica.js`, `pagina/lista.json`, `config/feeds.json`, `config/portales.json`, `config/firmas.json`, `config/comodoro/`, `docs/CORRER_EN_MI_COMPU.md`, `.gitignore`, `.github/`, los `buzon/LEEME*.md`, las cartas y reportes viejos, y las capturas.

**Reglas de toda la ronda:**

- En el repo nunca hay claves, contraseñas, mails de personas ni texto de los portales. La clave de la IA y la casilla de correo viven en las credenciales de n8n. Los usuarios de la página viven en un archivo del servidor que no se sube. El repo es público y el servidor lo baja con `git clone` sin permisos.
- Nada de lo que es de un cliente queda escrito en el código: lo que hoy sea de Canal 2 (cupo, usuarios) sale de `config/` o del archivo de usuarios del servidor.
- Vos no podés entrar al servidor de Don Julio: lo que es del servidor lo probás en tu entorno con la IA falsa (paso 6) y, si podés, con un n8n instalado con npm (paso 3, punto 3f). La instalación real la hace Alejo en lo de Don Julio siguiendo la guía, con vos en una tanda al lado (Fase B).
- Cuando algo entra por el plan B (la IA no contestó, ningún feed respondió, la lista es vieja), la página lo dice. Nunca se queda muda.

## Qué decidió Alejo (con Don Julio) y qué es valor por defecto

Lo que sienta bases va como lo pidió Don Julio; lo interno lo acomodó Cowork. Las respuestas de Don Julio llegaron por WhatsApp el 14-10; Alejo las cruzó entre las 22:45 y las 23:28.

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Todo corre en el servidor de Don Julio, en su n8n ya instalado y accesible desde internet (no n8n Cloud) | Don Julio, Alejo (14-10, 22:45) | pasos 3 y 7 |
| El código entra por carpeta en ese servidor y n8n lo lee del disco; un cambio es `git pull` | Don Julio, Alejo | paso 3 (`require` desde la carpeta) y paso 7 |
| Los feeds los baja n8n y nuestro código los interpreta | Alejo (14-10) | paso 3: nodo HTTP Request por feed, y `src/capa4.js` interpreta |
| Lo acumulado, lo juzgado por la IA y la última lista se guardan **adentro de n8n** si no lo enlentece; plan B, una base en el mismo Linux. Hoy anda con archivos en `datos/` en la compu de Alejo: se nombra, no se propone | Don Julio, Alejo | paso 3: datos estáticos del workflow (`$getWorkflowStaticData('global')`); la vuelta mide cuánto tarda guardarlos (Fase B) |
| La página vive en el mismo servidor que n8n; la lista se escribe en la carpeta que sirve el servidor web | Don Julio, Alejo | pasos 3 y 4: `lista.json` se escribe en `<datos>/pagina/` y `scripts/servir.js` sirve esa carpeta |
| Se entra con mail y contraseña, con «olvidé mi clave» por mail; una sola empresa (Canal 2); el login lo arma Claude Code, pieza chica en Node, sin librerías; a Don Julio se le pide solo una casilla de correo | Alejo (14-10, 23:11) | paso 4 |
| La IA es Claude Haiku 4.5; la pagan Alejo y Don Julio con su cuenta | Alejo | paso 2 (`ia.modelo`) |
| Si falla: la página dice «contactá al administrador» y el aviso llega por mail con el detalle, a Alejo y a Don Julio | Don Julio, Alejo | pasos 3 y 5 |
| Un solo workflow hasta que esté fino; después, uno real y uno de pruebas | Don Julio | paso 3: solo el real en esta carta |
| El repo sigue público | Alejo | regla de la ronda |
| Primero la capa 4, después la página C, al final la pieza 2 | Alejo (14-10, 23:26) | esta carta es la capa 4 |
| Temperatura 0 y tope de 400 tokens para la pregunta de juicio, 200 para la de unión; se vuelve a preguntar por un hecho solo si no tiene juicio guardado, si apareció un desmentido nuevo o si pasó a viejo | Cowork (valor por defecto) | paso 2 y paso 1 |
| Si la IA no contesta por un hecho, ese hecho lleva el juicio provisorio de hoy y la página lo dice; si no contesta por ninguno, la lista sale `sinIA` como hoy | Cowork (valor por defecto) | pasos 1, 2 y 5 |
| La unión de hechos partidos queda **apagada** hasta que la prueba de 3 veces pase; esta carta deja la prueba como workflow aparte, no prende la unión | Cowork (valor por defecto, 05-10) | paso 3 (`prueba-union.json`) |
| Aviso por mail con tope de 1 por hora; la página dice «contactá al administrador» cuando la lista tiene más de 60 minutos | Cowork (valor por defecto) | pasos 3 y 5 |
| Las rutas del servidor (carpeta del repo, carpeta de datos) se escriben en un nodo «Rutas» del workflow, editable desde n8n, no en variables de entorno | Cowork (valor por defecto) | paso 3 |
| HTTPS lo pone el servidor web de Don Julio delante del login (proxy inverso); si no tiene, Caddy | Cowork (valor por defecto, hasta que Don Julio confirme) | paso 7 |
| Se asume n8n con Docker hasta que Don Julio confirme versión y forma de instalación | Cowork (valor por defecto) | paso 7, cuadro «Lo que Don Julio tiene que confirmar» |

## Paso 1 · `src/capa4.js`: la vuelta en dos mitades

Es la vuelta de `scripts/vuelta.js` partida en dos, porque en el medio n8n llama a la IA. **Pura como el núcleo:** sin leer archivos, sin `Date.now()`, sin `fetch`; todo entra por parámetro. Solo una función escribe en disco (`escribir`), y recibe las rutas. `require` únicamente de `./lector.js`, `./nucleo.js`, `./provisorio.js`, `./entrega.js`, `./ia.js` y `node:fs`/`node:path` (en `escribir`).

### 1a · `mitadUno({ cuerpos, guardado, ahora, feeds, portales, reglas, firmas })`

- `cuerpos`: una por feed de `feeds`, en el mismo orden: `{ nombre, status, xml }` (`status` 0 si no se pudo bajar, con `error` en vez de `xml`). Es lo que trae el nodo HTTP Request.
- `guardado`: `{ notas: [...], juicios: [...], ultimoAviso: <ISO o null> }` o `null` la primera vez. `notas` son las acumuladas (lo que hoy va en `datos/notas.json`), `juicios` son los `guardados` de `src/ia.js` (`{ urls, juicio, fecha, desmentidosVistos, viejo }`).
- Hace, en este orden: por cada cuerpo con `status` entre 200 y 399, `parsearFeed(xml, feed, { ahora })` (de `src/lector.js`), armando `lectura` con exactamente la forma que devuelve `leerFeeds` (`{ notas, feeds: [{ nombre, dominio, estado, detalle, items, notas, descartadas }], avisos }`, la misma nota en dos feeds una sola vez, por `claveUrl`); `filtrarRutas` sobre lo guardado (copiá la función de `scripts/leer.js` a `src/capa4.js`; `scripts/leer.js` no se toca); `acumular`; `preparar`; y para cada hecho de `candidatos` y de `elegiblesAMano`, decide si hay que preguntar: `buscarGuardado` y `hayQueVolverAPreguntar` de `src/ia.js`, **más** una condición nueva: si el hecho es `viejo` y el guardado se hizo con `viejo: false`, se vuelve a preguntar (así un hecho de más de 24 h con un dato nuevo puede quedarse).
- Devuelve `{ guardado: { notas, juicios, ultimoAviso }, lectura: { feeds, avisos }, acumulado: { agregadas, repetidas, borradas }, preguntas: [{ id, texto, desmentidos: [urls], viejo }], resumen: { hechos, candidatos, elegiblesAMano, conJuicioGuardado, aPreguntar } }`. `guardado.notas` son las acumuladas nuevas; `guardado.juicios` sale igual que entró salvo que se sacan los de más de 48 h (por `fecha`). `texto` es `preguntaJuicio(hecho, { portales, reglas, desmentidos })` con `desmentidos = posiblesDesmentidos(hecho, notas, { reglas })`.

### 1b · `mitadDos({ guardado, lectura, acumulado, respuestas, ahora, feeds, portales, reglas, firmas })`

- `guardado`, `lectura` y `acumulado` son los que devolvió `mitadUno` (el nodo los guarda entre los dos). `respuestas`: `[{ id, texto }]`, una por pregunta de `mitadUno` (`texto` es lo que contestó la IA, o `null` si la llamada falló).
- Vuelve a hacer `filtrarRutas` + `preparar` sobre `guardado.notas` (es determinista y tarda menos de un segundo; así no hay que pasar `preparado` entre nodos). Por cada respuesta: `leerJuicio(texto)`; si da un juicio, se guarda en `guardado.juicios` como `{ urls: <las urls de las notas del hecho>, juicio, fecha: ahora, desmentidosVistos: <los desmentidos de la pregunta>, viejo: <el viejo de la pregunta> }`, reemplazando al guardado que ya compartía una url con el hecho, si había. Si da `null` (falló o contestó mal), no se guarda nada.
- Arma `juicios[id]` para cada candidato y elegible a mano: el juicio guardado (`buscarGuardado`) si lo hay; si no, el de `juiciosProvisorios(preparado, { portales, reglas })` para ese id (ya trae `provisorio: true`).
- `decidir`, `armarEntrega` con `sinIA: <true solo si todos los juicios usados son provisorios>` y tres campos nuevos en la lista (ver paso 2): `provisorias` (cuántas noticias de la lista, confirmadas o a mano, llevan juicio provisorio), `cliente` (`reglas.cliente || ''`) y `paginaViejaMinutos` (`reglas.avisos.paginaViejaMinutos`).
- Devuelve `{ guardado, lista, linea, avisar }`. `linea` es la misma de `armarLinea` de `scripts/vuelta.js` (copiá `armarLinea`, `hechosPorGrupos`, `mediosDe` y `resumenEnPantalla` a `src/capa4.js`; `scripts/vuelta.js` no se toca; `armarLinea` recibe `lectura`, `acumulado` con `notas: guardado.notas`, y lo demás) más tres campos: `ia: { preguntadas, contestadas, fallidas }` y `provisorias` (los mismos números) y `tardoMs` (lo pone el nodo; acá va `null`). `avisar` es `{ hayQue: true | false, asunto, texto, ultimoAviso }`: `hayQue` es true cuando `lectura.feeds` no tiene ninguno `ok`, o cuando `preguntadas > 0` y `contestadas === 0`, **y** `guardado.ultimoAviso` es null o tiene más de 60 minutos (`reglas.avisos.topeMinutos`); si es true, `ultimoAviso` pasa a `ahora`. `asunto`: `7M · <motivo> · <dd/mm hh:mm>`; `texto`: el motivo en una línea, los feeds caídos con su `detalle`, y cuántas preguntas fallaron.

### 1c · `escribir({ carpetaDatos, lista, linea })`

Escribe `<carpetaDatos>/pagina/lista.json` (igual que `escribirPagina` de `scripts/vuelta.js`: archivo temporal y `rename`, y copia `index.html` y `logica.js` desde `pagina/` del repo) y agrega `linea` como un renglón a `<carpetaDatos>/vueltas.jsonl`. Crea las carpetas que falten. Así `npm run medir -- --carpeta <carpetaDatos>` sigue andando en el servidor.

### 1d · Ejemplos (entrada → salida)

**E1.** `mitadUno` con `feeds` de 2 feeds inventados (A, dominio `a.com`; B, dominio `b.com`), `cuerpos` = A con `status` 200 y un RSS de 2 notas, B con `status` 0 y `error: 'ETIMEDOUT'`, `guardado: null`, `portales` de 2 portales, `reglas` las de `config/reglas.json` → `lectura.feeds[1].estado` es `'error'` y `lectura.avisos` tiene `Feed sin leer: B (ETIMEDOUT)`; `guardado.notas` tiene 2 notas; `guardado.juicios` es `[]`; `preguntas` es `[]` (ningún hecho llega a 5 ni a 4); `resumen.aPreguntar` es 0.

**E2.** `mitadUno` con un `guardado.notas` de 5 notas del mismo hecho en 5 portales distintos (las del test de «misma noticia» de `test/nucleo.test.js` sirven) y `cuerpos` todos con `status` 0 → `preguntas` tiene 1, con `texto` que empieza con «Sos el editor que revisa noticias para 7M» y termina con las 5 líneas del hecho; `preguntas[0].desmentidos` es `[]`. Con el mismo `guardado` pero `juicios` con un guardado que comparte una url de esas notas y `viejo: false`, y el hecho no viejo → `preguntas` es `[]` y `resumen.conJuicioGuardado` es 1.

**E3.** `mitadDos` con el `guardado` de E2 (sin juicios) y `respuestas: [{ id, texto: '{"datoNuevo": true, "fuenteConNombre": true, "interesPublico": true, "bloque": "nacional", "desmentido": false, "seccion": "política", "pais": "", "porque": {}}' }]` → `guardado.juicios` tiene 1 con esas 5 `urls`; `lista.bloques.nacional.noticias` tiene 1; `lista.sinIA` es `false`; `lista.provisorias` es 0; `linea.ia` es `{ preguntadas: 1, contestadas: 1, fallidas: 0 }`; `avisar.hayQue` es `false`.

**E4.** Lo mismo que E3 con `texto: null` → `guardado.juicios` sigue vacío; la noticia sale igual, con el bloque provisorio; `lista.sinIA` es `true`; `lista.provisorias` es 1; `linea.ia` es `{ 1, 0, 1 }`; `avisar.hayQue` es `true` (preguntó y nadie contestó, sin aviso previo), `avisar.asunto` empieza con `7M · la IA no contestó`. Si en vez de `null` el texto es `'no sé'` → lo mismo (`leerJuicio` da `null`).

**E5.** `mitadDos` con `guardado.ultimoAviso` de hace 10 minutos y la misma falla que E4 → `avisar.hayQue` es `false` y `avisar.ultimoAviso` no cambia.

### 1e · Tests en `test/capa4.test.js`

E1 a E5, más: `escribir` sobre una carpeta temporal deja `pagina/lista.json`, `pagina/index.html`, `pagina/logica.js` y `vueltas.jsonl` con 1 renglón, y llamada dos veces deja 2 renglones; `mitadUno` saca de `guardado.juicios` uno con `fecha` de hace 50 horas y deja uno de hace 10; un hecho `viejo` con guardado `viejo: false` vuelve a `preguntas`, y con guardado `viejo: true` no.

## Paso 2 · La IA en `config/reglas.json` y la lista

En `config/reglas.json`, dentro de `ia`, tres claves nuevas al final: `"modelo": "claude-haiku-4-5"`, `"temperatura": 0`, `"maxTokens": { "juicio": 400, "union": 200 }`. **Verificá el nombre exacto del modelo** en https://docs.claude.com (lista de modelos) antes de escribirlo; si Haiku 4.5 ya no está disponible, escribí el Haiku más nuevo y decilo en el reporte: la decisión de Alejo es «Haiku», el número lo pone la lista oficial. También una sección nueva de primer nivel, después de `provisorio`: `"avisos": { "topeMinutos": 60, "paginaViejaMinutos": 60 }`, y una clave de primer nivel `"cliente": "Canal 2"` (es el único dato del cliente que hace falta hoy; la página lo muestra en el encabezado, paso 5).

En `src/entrega.js`, `armarEntrega` acepta tres opciones más, `provisorias` (número, por defecto 0), `cliente` (texto, por defecto `''`) y `paginaViejaMinutos` (número, por defecto 60), y las deja en la lista con esos tres nombres. `test/entrega.test.js`: sin pasarlas, la lista trae `provisorias: 0`, `cliente: ''` y `paginaViejaMinutos: 60`; pasándolas, las trae. `scripts/vuelta.js` no se toca: su lista sale con los valores por defecto.

## Paso 3 · Los workflows de n8n, como archivos

Carpeta nueva `n8n/` con cuatro archivos JSON **importables desde n8n** (menú del workflow → «Import from file») y un `n8n/LEEME.md` que dice qué es cada uno y qué hay que editar después de importar. Escribilos a mano con el formato que exporta n8n (`{ "name", "nodes": [...], "connections": {...}, "settings": {...} }`); mirá la documentación de n8n para la forma de cada nodo (tipo, `typeVersion`, parámetros) y usá la versión más nueva de cada nodo que exista en la documentación en el momento en que escribas. Si podés instalar n8n en tu entorno (3f), importalos y corrélos ahí: es la única prueba de verdad que tenés.

### 3a · `n8n/vuelta.json` · «7M · vuelta cada 30 minutos»

| # | Nodo | Tipo | Qué hace |
|---|---|---|---|
| 1 | Cada 30 minutos | Schedule Trigger | cada 30 minutos |
| 2 | Rutas | Set (Edit Fields) | dos campos de texto: `carpetaRepo` (por defecto `/home/node/7m`) y `carpetaDatos` (por defecto `/home/node/7m-datos`). Es lo único que se edita después de importar |
| 3 | Feeds | Code, «Run Once for All Items» | `const config = require($('Rutas').first().json.carpetaRepo + '/config/feeds.json')` y devuelve un ítem por feed con `{ nombre, url }` (solo los que tienen `url`) |
| 4 | Bajar | HTTP Request | `GET` a `{{ $json.url }}`, respuesta como **texto** (no JSON) con la opción «Include Response Headers and Status» prendida (así cada ítem trae `statusCode` y `body`), timeout 20 segundos, `User-Agent` el mismo que usa `src/lector.js`, y **«On Error» en «Continue»** (la opción que deja el ítem en la misma salida con un campo `error`; no la de «error output»), para que un feed caído no corte la vuelta |
| 5 | Preparar | Code, «Run Once for All Items» | guarda `inicio = Date.now()` en los datos estáticos; arma `cuerpos` desde `$input.all()` (cada ítem: `nombre` del ítem de Feeds en la misma posición, `status` = `statusCode`, o 0 si trae `error`, `xml` = `body`), lee `guardado` de `$getWorkflowStaticData('global').guardado` (o `null`), llama `mitadUno` de `require(carpetaRepo + '/src/capa4.js')` con `feeds`, `portales`, `reglas` y `firmas` leídos del disco (`config/*.json`) y `ahora = new Date().toISOString()`, guarda `guardado`, `lectura` y `acumulado` en los datos estáticos, y devuelve **un ítem por pregunta** `{ id, cuerpoIA }`, donde `cuerpoIA` es el cuerpo completo para la API: `{ model: reglas.ia.modelo, max_tokens: reglas.ia.maxTokens.juicio, temperature: reglas.ia.temperatura, messages: [{ role: 'user', content: texto }] }`; si no hay preguntas, un solo ítem `{ sinPreguntas: true }` |
| 6 | ¿Hay preguntas? | IF | `{{ $json.sinPreguntas }}` no es true |
| 7 | IA | HTTP Request | solo en la rama «true» del IF. `POST https://api.anthropic.com/v1/messages`, cabeceras `anthropic-version: 2023-06-01` y `content-type: application/json`, **credencial de n8n** de tipo «Header Auth» con nombre `x-api-key` (la crea Don Julio al instalar; en el JSON va solo la referencia por nombre `7M Anthropic`), cuerpo JSON con la expresión `{{ $json.cuerpoIA }}` (un objeto, armado en Preparar: así el texto con comillas y saltos de línea no rompe nada y el JSON del workflow no repite modelo ni tope), «On Error» en «Continue», timeout 60 segundos. Verificá en https://docs.claude.com que ese sea el formato vigente de la API de mensajes y dónde viene el texto de la respuesta (hoy, `content[0].text`) |
| 8 | Decidir | Code, «Run Once for All Items» | recibe de las dos ramas (la «false» del IF directo, la «true» después de IA). Arma `respuestas`: si el primer ítem trae `sinPreguntas`, `[]`; si no, por cada ítem `k` de `$input.all()`, `id` del ítem `k` de `$('Preparar').all()` y `texto` igual a `content[0].text` de la respuesta, o `null` si el ítem trae `error` o no tiene ese campo. Llama `mitadDos` con el `guardado` de los datos estáticos, llama `escribir` con `carpetaDatos`, guarda el `guardado` que devuelve en los datos estáticos (y en `linea.tardoMs` los milisegundos desde que empezó Preparar: guardá `Date.now()` en los datos estáticos al principio de Preparar), y devuelve un ítem `{ avisar, resumen: <las líneas de resumenEnPantalla de scripts/vuelta.js, copiada a capa4.js> }` |
| 9 | ¿Avisar? | IF | `{{ $json.avisar.hayQue }}` es true |
| 10 | Avisar | Send Email | credencial SMTP `7M Correo` (la crea Don Julio), **para** y **de** leídos del nodo Rutas (dos campos más: `correoAvisos`, `correoDesde`; `correoAvisos` admite varios separados por coma), asunto `{{ $json.avisar.asunto }}`, texto `{{ $json.avisar.texto }}` |

Datos estáticos: `$getWorkflowStaticData('global')` guarda `{ guardado, inicio }`. **n8n no guarda los datos estáticos en una ejecución manual («Execute workflow» desde el editor), solo en las disparadas por el trigger.** Ponelo en `n8n/LEEME.md` y en la guía: para probar a mano hay que activar el workflow y esperar el disparo, o bajar el intervalo a 1 minuto un rato.

El workflow tiene «Execution Order: v1» y «Save successful executions» en prendido, así se ve cada vuelta en n8n.

### 3b · `n8n/correo.json` · «7M · correo»

Un Webhook (`POST`, ruta `7m-correo`, autenticación «Header Auth» con credencial `7M Webhook` que tiene un nombre de cabecera `x-7m-clave` y un valor que Don Julio inventa al instalar) → Send Email (`7M Correo`; para `{{ $json.body.para }}`, asunto `{{ $json.body.asunto }}`, texto `{{ $json.body.texto }}`) → Respond to Webhook con `{ "ok": true }`. Lo usa el login para «olvidé mi clave» (paso 4). Responde a `http://127.0.0.1:5678/webhook/7m-correo` (o el puerto que tenga n8n).

### 3c · `n8n/error.json` · «7M · si la vuelta se rompe»

Error Trigger → Send Email (`7M Correo`, para y de leídos de un nodo Set «Rutas» igual al de la vuelta), asunto `7M · la vuelta se rompió · {{ $json.execution.id }}`, texto con `{{ $json.execution.error.message }}` y el nombre del nodo. En `vuelta.json`, en `settings`, `errorWorkflow` queda vacío: **después de importar los dos**, Don Julio elige este como «Error Workflow» de la vuelta (está en la guía). Este aviso no tiene tope de uno por hora (si la vuelta se rompe 48 veces, es grave y se quiere saber).

### 3d · `n8n/prueba-union.json` · «7M · prueba de la unión (3 veces)»

Trigger manual → Set «Rutas» (igual al de la vuelta) → Code «Casos» (lee `test/casos-ia.json` del disco, toma los casos de `union` que no tienen `dudoso: true`, y devuelve **tres ítems por caso**, con `{ caso: k, intento: 1|2|3, cuerpoIA }` donde `cuerpoIA` es como el de la vuelta pero con `max_tokens` el de `union` y `content` igual a `preguntaUnion` armada con dos hechos de una nota cada uno: para eso agregá en `src/capa4.js` una función `preguntaUnionDePrueba(caso, { portales })` que arma un `preparado` mínimo con dos hechos inventados (`id` `a` y `b`, una nota cada uno con `titulo` el del caso, `bajada ''`, `url` `https://prueba.invalid/a` y `/b`, `portal` `prueba.invalid`, `fecha` `2026-10-04T15:00:00Z`, `firma ''`) y llama `preguntaUnion({ a: 'a', b: 'b' }, preparado, { portales })`) → HTTP Request «IA» igual al de la vuelta → Code «Resultado» (por cada ítem, `leerUnion(content[0].text)`; `acierto` es true si `misma` coincide con el `misma` del caso; `null` cuenta como error) → devuelve un ítem por caso con `{ caso, titulos, esperado, intentos: [true|false ×3], pasa }` y un último ítem `{ resumen: 'pasa' | 'no pasa', casos, aciertos, de }`. **La regla:** la unión se prende solo si `pasa` en todos los casos (los 3 intentos bien en todos). El resultado se mira en la ejecución, en n8n. Esta carta no prende la unión: si pasa, la prende la carta siguiente.

### 3e · `test/n8n.test.js`

Los 4 archivos son JSON válido, cada uno tiene `name`, `nodes` y `connections`; `vuelta.json` tiene exactamente los 10 nodos de la tabla con esos nombres y las conexiones de la tabla (1→2→3→4→5→6, 6 «true»→7→8, 6 «false»→8, 8→9, 9 «true»→10); `prueba-union.json` tiene los nodos Rutas, Casos, IA y Resultado; ningún archivo de `n8n/` contiene `sk-ant`, `@` seguido de un dominio, ni la palabra `password`.

### 3f · Probarlo con n8n en tu entorno (si se puede)

Intentá, con un tope de 30 minutos de reloj: `npm i --no-save n8n` (o `npx n8n`) en una carpeta fuera del repo, `N8N_... import:workflow --input=n8n/vuelta.json`, editar Rutas a tu repo y a una carpeta temporal, apuntar el nodo IA a la IA falsa (paso 6, `http://127.0.0.1:7100/v1/messages`) y ejecutar el workflow. Si corre, en el reporte va la salida del nodo Decidir y el `tardoMs`. Si en 30 minutos no corre (n8n no instala, no importa, no ejecuta por la red o por el sandbox del Code node), parás, decís exactamente en qué paso se trabó y seguís: la prueba real es la Fase B. No gastes más que eso.

## Paso 4 · La página con login

`scripts/servir.js` reemplaza a `scripts/ver.js` en el servidor (`ver.js` queda para mirar la lista en una compu, sin login). `node scripts/servir.js --carpeta <datos> [--puerto 7000] [--escucha 127.0.0.1] [--n8n http://127.0.0.1:5678]`. Sin dependencias: `node:http`, `node:crypto`, `node:fs`, `node:path`. `npm run servir` en `package.json`.

- Sirve `<datos>/pagina/` (`index.html`, `logica.js`, `lista.json`) **solo con sesión**. Sin sesión: `/` y `/index.html` redirigen (302) a `/entrar`; `/lista.json` y `/logica.js` contestan 401 con `{ "error": "sin sesión" }`.
- `/entrar` (GET): sirve `pagina/entrar.html` del repo (`join(__dirname, '..', 'pagina', 'entrar.html')`; es nuevo, un formulario con mail y contraseña, botón «Entrar», link «Olvidé mi clave», sin librerías, mismo estilo que `index.html`, pensado para celular; la página toma el nombre del cliente de `/cliente.json`, que el servidor contesta con `{ "cliente": reglas.cliente }` sin sesión). `/entrar` (POST, `application/x-www-form-urlencoded`, campos `mail` y `clave`): si coinciden con `<datos>/usuarios.json`, crea una sesión (32 bytes al azar, en memoria, vence a los 30 días o al reiniciar), manda la cookie `7m-sesion` con `HttpOnly`, `SameSite=Lax`, `Path=/`, y `Secure` si la petición trae `x-forwarded-proto: https`, y redirige a `/`. Si no, vuelve a `/entrar?error=1` y la página dice «Mail o contraseña incorrectos». Tope: 5 intentos fallidos por mail cada 15 minutos; al sexto contesta «Demasiados intentos, esperá 15 minutos».
- `/salir` (POST): borra la sesión y redirige a `/entrar`.
- `/olvide` (POST, campo `mail`): si el mail existe, genera un token (32 bytes, vence en 60 minutos, en memoria) y pide a n8n que mande el mail: `POST <n8n>/webhook/7m-correo` con cabecera `x-7m-clave: <clave de <datos>/servidor.json>` y cuerpo `{ "para": mail, "asunto": "7M · nueva contraseña", "texto": "Entrá a <dirección>/nueva-clave?token=... para elegir una contraseña nueva. Vence en 60 minutos." }` (`<dirección>` sale de `servidor.json`, campo `direccion`). Conteste lo que conteste n8n, y exista o no el mail, la página dice siempre «Si el mail está registrado, te llega un correo» (así no se adivinan mails). Si n8n no contesta, lo anota en la consola.
- `/nueva-clave?token=...` (GET): formulario de contraseña nueva (dos veces); (POST): si el token vale, guarda la nueva y redirige a `/entrar?nueva=1`.
- `<datos>/usuarios.json`: `[{ "mail", "sal", "hash", "creado" }]`, con `scrypt` de `node:crypto` (sal de 16 bytes, hash de 64, `timingSafeEqual` para comparar). `<datos>/servidor.json`: `{ "clave": "<la misma que la credencial 7M Webhook>", "direccion": "https://..." }`. Los dos los crea la guía; ninguno va al repo (`datos/` ya está en `.gitignore`).
- `scripts/usuario.js`: `agregar <mail>` (crea el usuario con una contraseña temporal al azar de 12 letras y números, la imprime una sola vez), `sacar <mail>`, `listar`, `nueva-clave <mail>`. Con `--carpeta <datos>`. Mails válidos: tienen `@` y un punto después; se guardan en minúsculas.

### 4a · Ejemplos

**E6.** Carpeta temporal con `usuarios.json` de un usuario `ana@ejemplo.com` creado con `usuario.js agregar` → `GET /` sin cookie da 302 a `/entrar`; `GET /lista.json` sin cookie da 401; `POST /entrar` con `mail=ana@ejemplo.com&clave=<la temporal>` da 302 a `/` con `Set-Cookie: 7m-sesion=...; HttpOnly; SameSite=Lax; Path=/`; con esa cookie, `GET /lista.json` da 200 y el JSON; `POST /entrar` con clave `x` da 302 a `/entrar?error=1`; seis veces seguidas con clave mala → la sexta contesta 429.

**E7.** `POST /olvide` con `mail=ana@ejemplo.com` y un servidor HTTP falso en el test en el lugar de n8n (`--n8n http://127.0.0.1:<puerto del falso>`) → el falso recibe `POST /webhook/7m-correo` con la cabecera `x-7m-clave` igual a la de `servidor.json` y un `texto` que contiene `/nueva-clave?token=`; `POST /nueva-clave` con ese token y `clave=Nueva1234&clave2=Nueva1234` → 302 a `/entrar?nueva=1` y después `POST /entrar` con `Nueva1234` entra; el mismo token otra vez → 400. `POST /olvide` con un mail que no existe → 200 con el mismo mensaje y el falso no recibe nada.

**E8.** `usuario.js agregar ana@ejemplo.com` dos veces → la segunda dice «ya existe» y código 1; `listar` muestra el mail y `creado`; `sacar` lo deja afuera.

### 4b · Tests

`test/servir.test.js`: E6 y E7 (levantando el servidor en el puerto 0 como hace `test/ver.test.js`). `test/usuario.test.js`: E8 y que el hash de dos usuarios con la misma contraseña es distinto (sal distinta).

## Paso 5 · La página

En `pagina/index.html`:

- Si `fetch('lista.json')` contesta 401, `location.href = '/entrar'` (en vez de la franja de error).
- La franja «vieja» pasa a decir `No se actualiza desde las HH:MM · contactá al administrador` cuando la lista tiene más de `avisos.paginaViejaMinutos` (la página no lee `reglas.json`: `armarEntrega` deja `paginaViejaMinutos` en la lista, campo nuevo, por defecto 60; `haceCuanto` de `logica.js` no se toca, se compara en `index.html`).
- Si `lista.provisorias > 0` y `lista.sinIA` es false: franja azul «N noticias con bloque provisorio: la IA no contestó por ellas» (N en singular/plural). Si `sinIA` es true, la franja de hoy, que ya existe.
- El encabezado muestra `lista.cliente` antes de «7M» si no está vacío («Canal 2 · 7M»).
- Un link «Salir» chico, arriba a la derecha, que hace `POST /salir` (un `form`). Si la página se abre desde `npm run ver` (sin login), «Salir» muestra el «no» del 404 de `ver.js`; no importa.

`scripts/probar-pagina.js`: tres comprobaciones nuevas, en una sección «8 · capa 4»: la franja de «contactá al administrador» aparece con una lista de hace 61 minutos y no con una de hace 30; la franja de provisorias aparece con `provisorias: 2` y dice «2 noticias»; el encabezado dice «Canal 2 · 7M» con `cliente: 'Canal 2'`.

## Paso 6 · `scripts/ia-falsa.js`

`node scripts/ia-falsa.js [--puerto 7100]`: un servidor HTTP que contesta `POST /v1/messages` con la forma de la API de mensajes (`{ "content": [{ "type": "text", "text": ... }] }`) y, según el texto de la pregunta: si empieza con la pregunta de juicio, un juicio con `bloque` `"internacional"` si el texto contiene la palabra «Internacional» después de «Hecho:» y `"nacional"` si no, todo lo demás `true/false` como el provisorio; si empieza con la pregunta de unión, `{"misma": false, "porque": "ia falsa"}`. Con `--fallar <n>` contesta 500 a una de cada `n` llamadas, para probar el plan B. Es solo para tu entorno y para la Fase B si la clave real tarda en llegar; la guía lo nombra como tal.

## Paso 7 · `docs/INSTALAR_EN_EL_SERVIDOR.md`

Para Alejo, parado en la compu de Don Julio, con Don Julio al lado, y con vos en una tanda. Estilo de `docs/CORRER_EN_MI_COMPU.md`: cada comando en su renglón, palabras de todos los días, sin suponer que saben de n8n. Secciones, en este orden:

1. **Lo que Don Julio tiene que confirmar antes de empezar** (un cuadro, con el valor que se asume si no contesta): versión de n8n (se asume 1.x; si es 3.x, el Code node corre en un proceso aparte y el `require` desde el disco necesita además `N8N_RUNNERS_...` según su documentación: decilo); si corre con Docker o con npm (se asume Docker); cómo se entra al servidor (SSH con usuario propio, o Don Julio tipea); si tiene un servidor web con HTTPS delante (nginx, Apache, Caddy; se asume que sí) y qué carpeta sirve; la casilla de correo (servidor SMTP, puerto, usuario, contraseña: se cargan en n8n, nunca en un archivo del repo); la clave de la API de Anthropic (la crea Alejo en su cuenta; se carga en n8n).
2. **Bajar el código:** `git clone -b claude/trusting-knuth-brmpsy https://github.com/AAlejoB/NOTITAN_7M.git <carpetaRepo>` y crear `<carpetaDatos>`. Con Docker, las dos carpetas se montan en el contenedor en `/home/node/7m` y `/home/node/7m-datos` (una línea `-v` por carpeta, o dos renglones de `volumes:` en `docker-compose.yml`), y se agregan las variables `NODE_FUNCTION_ALLOW_EXTERNAL=*` y `NODE_FUNCTION_ALLOW_BUILTIN=*` al contenedor; después, reiniciar n8n. Decí qué significa cada variable (dejan que el nodo Code use nuestro código del disco) y que son del contenedor de n8n, no de la compu.
3. **Las tres credenciales en n8n:** `7M Anthropic` (Header Auth, nombre `x-api-key`, valor la clave), `7M Correo` (SMTP) y `7M Webhook` (Header Auth, nombre `x-7m-clave`, valor inventado, el mismo que va en `servidor.json`).
4. **Importar los cuatro workflows**, editar «Rutas» en la vuelta y en el error (carpetas y correos), elegir «7M · si la vuelta se rompe» como Error Workflow de la vuelta, activar la vuelta y el correo.
5. **El login:** `<carpetaDatos>/servidor.json`, `node scripts/usuario.js --carpeta <carpetaDatos> agregar <mail>` por cada persona de Canal 2 (3 por defecto: a Alejo le faltan los datos de Canal 2, se piden en ese momento), y dejar corriendo `node scripts/servir.js --carpeta <carpetaDatos>` como servicio (una unidad de `systemd`, con el archivo completo en la guía, con `Restart=always`). Después, el proxy inverso de Don Julio apuntando a `127.0.0.1:7000` con HTTPS (un ejemplo de bloque para nginx y uno para Caddy; Don Julio adapta).
6. **Probar:** la prueba de la unión 3 veces (importar, ejecutar, leer el resumen), una vuelta (bajar el intervalo a 1 minuto, esperar, mirar la ejecución, volver a 30), la página desde el celular (entrar, ver la lista, olvidé mi clave, salir), y `node scripts/medir.js --carpeta <carpetaDatos>`.
7. **Si algo falla:** los cuatro problemas más probables y qué mirar (el `require` falla → las variables del paso 2 o la carpeta no montada; la IA contesta 401 → la credencial; el mail no sale → la credencial SMTP y la ejecución del workflow correo; la página no carga → `servir.js` caído o el proxy).

## Paso 8 · Documentos (Fase A)

- **`README.md`:** en el estado, la capa 4 pasa a «✔ n8n/ + src/capa4.js (corre en el servidor de Don Julio; guía en docs/INSTALAR_EN_EL_SERVIDOR.md)» y en los comandos se suman `npm run servir` (con sus opciones), `node scripts/usuario.js` y `node scripts/ia-falsa.js`, cada uno con una línea.
- **`CLAUDE.md`, «Estado»:** un renglón nuevo después del de «Sitemaps y el bloque local de prueba (2026-10-15)»: «**Capa 4 escrita (2026-10-15):** `src/capa4.js` parte la vuelta en `mitadUno` (leer, acumular, preparar, armar las preguntas de juicio) y `mitadDos` (leer las respuestas, guardar juicios, decidir, lista); n8n la corre cada 30 minutos (`n8n/vuelta.json`, con `n8n/correo.json`, `n8n/error.json` y `n8n/prueba-union.json`), guarda lo acumulado y lo juzgado en los datos estáticos del workflow y escribe `lista.json` en `<datos>/pagina/`; `scripts/servir.js` sirve la página con login (mail y contraseña, «olvidé mi clave» por el webhook de correo; usuarios con `scripts/usuario.js` en `<datos>/usuarios.json`, nunca en el repo); la IA es `ia.modelo` de `config/reglas.json`, temperatura 0, y se vuelve a preguntar solo por lo que no tiene juicio, lo que tiene un desmentido nuevo o lo que pasó a viejo; si no contesta, el hecho lleva el juicio provisorio y la página lo dice; aviso por mail con tope de 1 por hora; la unión sigue apagada hasta que `prueba-union` pase 3 de 3. Falta instalarlo en el servidor de Don Julio (`docs/INSTALAR_EN_EL_SERVIDOR.md`).» Y en «Siguiente paso», reemplazá el párrafo por: «La capa 4 está escrita; falta instalarla en el servidor de Don Julio (Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_b.md`). Después, la página C y la pieza 2.»
- **`buzon/pendientes.md`:** en «Cowork → Claude Code», debajo de la línea de la Fase B local, «- Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_b.md`: instalar la capa 4 en el servidor de Don Julio el día que Alejo vaya, en una tanda.»; en «Abierto» de la sección de las 23:30, al ítem de los datos del servidor agregale «**Están en el cuadro 1 de `docs/INSTALAR_EN_EL_SERVIDOR.md`.**»; en «Hecho», primer renglón: «- [x] 15-10-2026 · **Capa 4 escrita** (carta `b`): `src/capa4.js`, los cuatro workflows en `n8n/`, la página con login (`scripts/servir.js`, `scripts/usuario.js`), la IA falsa y la guía de instalación. Falta instalar (Fase B).» Y en la sección «Lo que dejó la medición hasta ahora», debajo de la última línea, pegá la tabla de «Qué dejó la medición» de esta carta, con una línea arriba que diga «**Parcial, hasta las 09:44 del 15-10 (38 vueltas desde el 14-10 13:18), revisado por Cowork el 15-10; el día completo se cruza cuando termine la medición (16/10):**».

## Paso 9 · Fase B (el día de la instalación)

Alejo te abre una tanda con la línea «Fase B de la capa 4» y la guía abierta en lo de Don Julio. Vos lo acompañás paso por paso, con una pregunta por vez, y vas anotando lo que pasó de verdad (versiones, carpetas, qué hubo que cambiar). Al final: `git pull` de lo que Alejo haya tocado (nada del código, si todo salió bien), y el reporte con: el cuadro 1 completado con las respuestas reales de Don Julio; el resultado de la prueba de la unión (la tabla de casos con los 3 intentos y el veredicto); la primera vuelta real (la salida del nodo Decidir y `tardoMs`, cuántas preguntas hizo la IA y cuántas contestó); si guardar los datos estáticos tarda más de 5 segundos (la condición de Don Julio: «si no lo enlentece»), decilo y proponé el plan B (base en el mismo Linux) como próximo pedido; y la página vista desde el celular de Alejo (entró, vio la lista, salió). Documentos: en `CLAUDE.md`, al renglón de la capa 4 agregale «**Instalada el <fecha>** en el servidor de Don Julio (n8n <versión>, <Docker|npm>); la prueba de la unión dio <pasa|no pasa>.»; en `pendientes.md`, la Fase B se tacha y el ítem de los datos del servidor pasa a «Hecho» con las respuestas; y si la unión pasó, en «Cowork → Claude Code» queda «Nada pendiente. Lo que sigue: la carta de la página C.»; si no pasó, «Lo que sigue: Cowork decide si se cambia la pregunta de unión o el modelo.»

## Cuándo está listo (comprobalo y ponelo en el reporte)

Fase A:

| # | Comprobación | Tiene que dar |
|---|---|---|
| C1 | `npm test` antes y después | antes 248 bien y 1 pendiente; después todos bien, al menos 20 más que antes, y sigue 1 pendiente |
| C2 | `npm run probar-pagina` (con `npm i --no-save playwright`) | 0 MAL y al menos 78 comprobaciones (75 + las 3 del paso 5) |
| C3 | `node scripts/vuelta.js --sin-leer --carpeta <una copia de datos/>` si tenés algo en `datos/`; si no, `npm run demo` | sigue andando igual que antes: la vuelta sin IA no cambió |
| C4 | `node scripts/ia-falsa.js` en una terminal y, en otra, un script descartable (fuera del repo) que lea `config/feeds.json`, baje los 19 feeds con `fetch`, arme `cuerpos`, llame `mitadUno` con `guardado: null`, mande cada `pregunta.texto` a la IA falsa, llame `mitadDos` y `escribir` sobre una carpeta temporal | termina con código 0; pegá en el reporte `resumen` de `mitadUno`, `linea.ia`, `lista.provisorias`, `lista.sinIA` y las 3 primeras líneas de `resumenEnPantalla`; después, lo mismo con `--fallar 2` en la IA falsa → `provisorias` mayor que 0 y `sinIA` false |
| C5 | El mismo script, corrido dos veces seguidas pasando el `guardado` de la primera a la segunda | la segunda vez `resumen.aPreguntar` es 0 o mucho menor que la primera, y `resumen.conJuicioGuardado` es igual a los que juzgó la primera |
| C6 | `node --test test/n8n.test.js` | los 4 JSON pasan |
| C7 | `git grep -n "sk-ant\|password\|contraseña:" -- n8n docs scripts src config` | ninguna línea que tenga una clave o contraseña de verdad (la palabra «contraseña» en la guía y en `entrar.html` es texto para la persona, está bien) |
| C8 | `git ls-files datos` | vacío |
| C9 | Con el reporte ya escrito y antes de `npm run paquete`: `git add -A` y `git diff --cached --stat da5ef4e` | solo los archivos de la tabla de pasos, más esta carta y tu reporte |
| C10 | La hora del encabezado de tu reporte | la que da `TZ=America/Argentina/Buenos_Aires date` justo antes de escribirlo; pegá esa salida en esta fila |
| C11 | 3f | si corrió: la salida del nodo Decidir; si no: en qué paso se trabó y en cuántos minutos paraste |

Fase B:

| # | Comprobación | Tiene que dar |
|---|---|---|
| D1 | `node -v` en el servidor (o adentro del contenedor) | v20 o más |
| D2 | La prueba de la unión | la tabla de casos y el veredicto |
| D3 | Una vuelta disparada por el trigger | la ejecución en verde, `lista.json` escrito en `<datos>/pagina/`, 1 renglón más en `vueltas.jsonl`, `tardoMs` |
| D4 | La página desde el celular de Alejo | entró con mail y contraseña, vio la lista con la franja sin «provisorio» (o con la de provisorias si la IA no contestó), «Salir» lo sacó |
| D5 | «Olvidé mi clave» | el mail llegó y la contraseña nueva entra |
| D6 | Un aviso forzado (bajar el timeout de Bajar a 1 milisegundo una vuelta) | llegó el mail a Alejo y a Don Julio; la segunda vuelta seguida con la misma falla **no** manda otro |

## Qué dejó la medición (para `pendientes.md` y para lo que decide Cowork después)

**Parcial, hasta las 09:44 del 15-10:** resumen de las primeras 38 vueltas nacionales (14/10 13:18 a 15/10 09:44, hueco de 07:43 a 09:44), revisado por Cowork. La medición sigue hasta el 16/10 y Cowork la cruza entera después. Son datos, no pedidos: nada de esto cambia en esta carta.

| Qué | Número |
|---|---|
| Noticias distintas que llegaron a 5 medios en el día | 32 (22 nacionales + 10 internacionales) |
| Noticias distintas que pasaron por 4/5 | 46; 23 de ellas llegaron después a 5, 23 nunca |
| Confirmadas que estuvieron antes en 4/5 | 23 de 32 (entre 1 y 7 horas antes) |
| Vueltas con la lista de nacionales llena (7) | desde las 18:43 en adelante, todas |
| Internacionales en la lista | 1 hasta las 19:13, 3 o 4 después |
| Confirmadas nuevas de madrugada (23:43 a 07:13) | 0 |
| Bloque provisorio equivocado (internacionales que salieron nacionales) | 4 de 22 confirmadas y 3 de las 4/5 |
| La misma noticia partida en varios hechos | el Papa en 6 hechos; Martín Fierro en 3; riesgo país en 2; Caputo en 2; Roña Castro en 2 |
| Notas de servicio que los moldes no agarran y llegaron a 5 | horario del Martín Fierro, el clima de Tucumán, «Anses: quiénes cobran», «Precio del euro hoy en Chile», «Cuánto cobran los empleados de McDonald's» |
| Feeds caídos | Al Jazeera, 1 vuelta de 38 |

## Qué va en tu reporte

Las comprobaciones C1 a C11 con lo que dieron; el nombre exacto del modelo que escribiste en `reglas.json` y dónde lo verificaste; la lista de nodos y versiones (`typeVersion`) que usaste en los JSON; lo que decidiste por tu cuenta; y lo que viste que a la guía le falta para alguien que no sabe de n8n. El reporte tiene números y títulos, nunca claves ni mails de personas.
