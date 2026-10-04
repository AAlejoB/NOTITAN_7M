# Claude Code → PREPARADOR · 04-10-2026 · 19:01 (hora de Argentina) · letra k

Responde a `PREPARADOR_para_ClaudeCode_2026-10-04_c.md`.

**Veredicto:** hechos los 6 pasos. Infobae ya no cuenta sus ediciones de España, Perú, México y Colombia, tampoco en lo guardado: 213 notas menos, y los 2 confirmados y las 4 de "les falta 1 medio" siguen igual. La IA que une hechos partidos tendría pocos pares para mirar (2, con un control que da lo que decía la carta). Los feeds por sección de Infobae andan y traen mucho más material argentino. LN+ no anda ni con la red completa. `npm test` pasó de 123 a **132 bien** y sigue 1 pendiente a propósito.

## Qué cambió

| Paso | Commit | Cambio |
|---|---|---|
| guardar | `74f260c` | La carta `c`, en `buzon/`. |
| 1 | `86b2acb` | `rutaExcluida` en el lector ("la dirección empieza con la ruta"); `excluirRutas` de Infobae con su nota; `filtrarRutas` y `--sin-excluir-rutas` en `scripts/leer.js`; línea `RUTAS EXCLUIDAS`; README. |
| 2, 3, 4 | (nada) | Mediciones; scripts fuera del repo. |
| 5 | `584a0e0` | LN+ no anda: el `motivo` de `sinFeed` dice qué dio el 04-10. |
| 6 | este commit | `CLAUDE.md`, `pendientes.md`, este reporte y los paquetes. |

## Tests, antes y después

| | Antes | Después |
|---|---|---|
| Bien | 123 | **132** |
| Pendiente a propósito | 1 | 1 |
| `test/lector.test.js` | | +4 (`rutaExcluida` con los 6 ejemplos, `rutaExcluida` con los bordes, `parsearFeed` de Infobae, config) |
| `test/leer.test.js` | | +5 (`filtrarRutas` ×3, `lineaRutasExcluidas`, `--sin-excluir-rutas`) |

El test del Cronista que ya existía pasa sin tocarlo. `npm run demo` sale **idéntica** (`diff` vacío). Doble pasada: rompí a propósito el código en 9 lugares (`includes` en vez de `startsWith`, sin minúsculas en la dirección o en la config, una dirección ilegible que sale, un feed sin lista que usa una por defecto, sin el corte de `--sin-excluir-rutas`, `filtrarRutas` que no saca nada, la línea que cuenta mal). Los tests atraparon las 9. Un error mío en un test (el viaje por JSON borra `feed: undefined`) lo vi al correrlo y lo arreglé con `structuredClone`.

## Paso 1 · los 6 ejemplos de tu tabla

| # | Dirección | Resultado |
|---|---|---|
| 1 | `/colombia/2026/10/04/resultado-loteria-del-cauca-…` (real) | Sale: `ruta_excluida (/colombia/)` |
| 2 | `/america/america-latina/…/brasil/` | Queda |
| 3 | `/america/mexico/…/x/` | **Queda** (no empieza con `/mexico/`) |
| 4 | `/politica/…/x/` | Queda |
| 5 | `/ESPANA/…/x/` | Sale: `ruta_excluida (/espana/)` |
| 6 | `cronista.com/espana/lluvias-2` | Sale, como hoy |

**Ojo con una cosa operativa:** `datos/notas.json` **no se tocó** (hice las mediciones sin leer nada antes, como pedía el paso 2). Sigue con las 1.277 notas de antes, incluidas las 213 que ya no cuentan. La primera lectura con `--acumular` lo reescribe ya filtrado, y con `--sin-leer` cada corrida las saca al cargar.

## Paso 2 · antes y después (A = `--sin-excluir-rutas`, B = con el filtro)

Archivo: 1.277 notas, de 2/10 18:12 a 5/10 00:01 (la última es una de las 3 con fecha futura: Página/12 pone la fecha de la edición del lunes). A corrió a las 18:55:34 y B a las 18:55:36.

**a · Hechos según cuántos grupos**

| Grupos | A | B |
|---|---|---|
| 1 | 980 | 819 |
| 2 | 37 | 33 |
| 3 | 8 | 7 |
| 4 | 4 | 4 |
| 5 o más | 2 | 2 |
| Hechos en total | 1.031 | 865 |
| Notas | 1.277 | 1.064 |
| Hechos con 3 o más grupos | 14 | 13 |

(Hay 3 notas fuera de la ventana de 48 h en las dos corridas: es la hora, no el filtro. En A, la nota de lotería de `/colombia/` se contaba entre las 65 del criterio 1; en B no está.)

**b · Hechos de 3 o más grupos que pierden a Infobae: 2.**

| Hecho | A | B | Qué pasa |
|---|---|---|---|
| "Tras el cierre de los comicios, Lula Da Silva y Flávio Bolsonaro disputan voto a voto…" (Brasil) | 6 grupos · 14 notas | 6 grupos · 13 notas | Pierde 1 nota de `/espana/`; Infobae sigue en el hecho por otras 2 notas |
| "Menú semanal de El Comidista (5 a 11 de octubre)" | **3 grupos** · 5 notas | **2 grupos** · 3 notas | Pierde las 2 notas de Infobae `/espana/`: era una unión con la edición de España |

**c · Las 2 confirmadas y las 4 de la lista a mano: siguen exactamente igual en B.** Confirmadas: García Cuerva en Luján (6 grupos) y Brasil (6). A mano (4/5): Colapinto en Malasia, "Una carrera loca…" de Sepang, las ventas minoristas de septiembre y Milei con la elección en Brasil.

**d · Lo que había quedado sin agarrar**

| Cadena | En A | En B | Desaparecen (feed · ruta) |
|---|---|---|---|
| "sorteo" | 6 | 2 | Chontico Noche (Infobae · `/colombia/`), Triplex de la Once, Super Once y Bonoloto (Infobae · `/espana/` las tres). Quedan Telekino 2448 y el pozo del Quini 6 (La Nación · `/loterias/`) |
| "dónde ver" | 5 | 4 | El béisbol Braves vs. Dodgers (Infobae · `/mexico/`). Quedan las 4 de TN · `/deportes/` |

Tu tabla del reporte `j` decía 6 en "dónde ver" porque contaba por cadena: la sexta era "donde Verstappen" (La Gaceta), falsa. Acá cuento palabra suelta y son 5. Tu sospecha se confirma: los 4 "sorteo" de Colombia y España salían de Infobae.

**e · "Aparece" contra "empieza con": 0.** Ninguna nota de Infobae guardada contiene una de las 4 rutas sin empezar con ella. Con estos datos dan lo mismo; la diferencia es la protección para `/america/mexico/`.

**f · Infobae en B:** 128 notas, de 4/10 14:12 a 18:01 = **3,8 horas** (igual que en A).

```
Infobae en B, por primer tramo de la dirección (128 notas)
/america/          69  ████████████████████
argentinas         45  █████████████
otras ediciones    14  ████
```

Las 45 argentinas: `/deportes/` 9, `/salud/` 5, `/economia/` 4, `/tecno/` 4, `/teleshow/` 4, `/sociedad/` 4, `/tendencias/` 3, `/entretenimiento/` 3, `/movant/` 3, `/cultura/` 2, `/judiciales/` 2, `/historias/` 1 y `/politica/` 1. **Hallazgo:** quedan 14 notas de otras ediciones que Alejo no nombró: `/estados-unidos/` 3, `/cuba/` 2, `/guatemala/` 2, `/el-salvador/` 2, `/honduras/` 2, `/nicaragua/` 1, `/panama/` 1, `/costa-rica/` 1. No las toqué. Está en `pendientes.md` con valor por defecto "no".

## Paso 3 · pares para la sexta pregunta (script fuera del repo)

Sobre lo guardado, con el filtro de Infobae y las reglas de tu carta (palabras con mayúscula, sin la primera de cada frase, sin STOP ni VIVO/HOY/…). Entraron **10 hechos** de 739 en observación (6 de 3 grupos y 4 de 4) y salieron **2 pares**.

| # | Hecho A | Hecho B | Palabras en común | Unión | ¿5? | Misma noticia |
|---|---|---|---|---|---|---|
| 1 | "EN VIVO \| Elecciones en Brasil: comienza el escrutinio y Lula habla con la prensa a las 19…" (3 grupos: Perfil, La Gaceta, Noticias Argentinas) | "A la espera de los primeros resultados, Milei sigue con optimismo la elección en Brasil y respaldó a Bolsonaro…" (4 grupos: Infobae, El Cronista, La Capital, El País) | brasil, lula | **7** | sí | **sí**: es la noche del escrutinio; la nota de Milei suma el ángulo argentino. Además es la misma jornada del hecho de 6 grupos que ya sale confirmado |
| 2 | "Fórmula 1: qué dijo Colapinto luego de finalizar 13° en el Gran Premio de Malasia" (4 grupos, 8 notas) | "Una carrera loca que Franco Colapinto terminó con mucha dignidad en Sepang con el mejor Alpine" (4 grupos, 4 notas) | colapinto, gran, premio, franco, bahrein | **5** | sí | **sí**: la misma carrera (13°, Alpine, Gran Premio de Bahréin) |

**Control:** el par de Colapinto **sale**, con unión de **5 grupos** (La Gaceta, La Nación, Clarín, Página/12 y La Capital), como decías.

**Si también entraran los hechos viejos** (más de 24 h) de 3 o 4 grupos: **3 pares**. El tercero es Christa Pike ("Lo que la fallida ejecución…" + "Cómo sigue la salud de Christa Pike…", 3 grupos cada uno, unión de 6; misma noticia: sí).

Dos notas sobre el método: "gran" y "premio" cuentan como "propias" solo porque van con mayúscula en "Gran Premio" (la regla las deja pasar); y no se miraron los hechos de 2 grupos. Con estos datos la sexta pregunta tendría poco trabajo: 2 o 3 pares en un fin de semana.

## Paso 4 · feeds por sección de Infobae (sin sumar nada)

Las dos formas de la dirección andan para las tres secciones (200, `application/xml`) y devuelven lo mismo: por eso va una sola fila por sección. No hizo falta mirar el HTML. Una sola lectura a las 18:57.

| Feed | Notas | Argentinas | Horas que cubre | Ya estaban en el general |
|---|---|---|---|---|
| `…/rss/category/politica/` | 100 | 100 | 102,7 | 0 |
| `…/rss/category/economia/` | 100 | 99 | 76,4 | 0 |
| `…/rss/category/sociedad/` | 100 | 100 | 111,5 | 0 |
| **`…/rss/` (el general, misma lectura)** | 94 | **12** | **1,3** | — |

(Direcciones completas: `https://www.infobae.com/arc/outboundfeeds/rss/category/<seccion>/`, con o sin `?outputType=xml`. "Argentinas" = no empiezan con `/america/` ni con las 4 rutas excluidas.)

Las tres secciones juntas: **300 notas, 299 argentinas, 111 horas**, contra las 12 argentinas del general en la misma lectura. Traen también `/opinion/` (7 de 299), que el criterio 1 ya saca por la dirección. Cada feed trae un máximo de 100 notas.

## Paso 5 · LN+

No anda, **ni con la red completa**. Probé 8 direcciones (`/arc/outboundfeeds/rss/` con y sin `?outputType=xml`, `/rss`, `/rss/`, `/feed`, `/feed/`, la portada con `www` y sin `www`): todas cortan al conectar (`UND_ERR_CONNECT_TIMEOUT`; con `curl`, "Connection reset by peer" a los 12 s), mientras `lanacion.com.ar` responde 200 en 1 s por el mismo proxy. Como la portada tampoco abre, no hay `<link>` de RSS que buscar. `lnmas.com` sigue `activo: false` y en `sinFeed`, con el motivo actualizado. En `pendientes.md` el ítem se cerró: "se reintenta solo si Alejo lo pide".

## Qué decidió Claude Code por su cuenta (para revisar)

- La línea `RUTAS EXCLUIDAS` dice "1 nota guardada sacada" en singular cuando es una; con varias, el formato exacto de tu carta.
- Los errores salen en el mismo orden que antes: primero se carga el archivo (y corta si está roto), después se filtra, y recién ahí se avisa si falta con `--sin-leer`.
- Con `--sin-leer` el archivo no se modifica aunque haya notas para sacar (sigue como en el reporte `i`); solo sin `--sin-leer` se reescribe filtrado.
- `rutaExcluida` compara la ruta de la config en minúsculas, así que una ruta escrita `/ESPANA/` en `feeds.json` también anda.
- En el paso 3 las "palabras propias" las armé con tu regla al pie de la letra. Un token que abre con `¿`, `¡` o comillas cuenta como primera palabra de una frase y no se mira; un `(` solo no.
- No toqué `src/nucleo.js`, `/america/`, las rutas del Cronista ni `FECHA_FUTURA_HORAS`.

## Qué quedó pendiente

| A quién | Qué |
|---|---|
| DISEÑADOR (por el PREPARADOR) | Feeds por sección de Infobae: ¿se suman? (por defecto no). Las 14 notas de otras ediciones que quedan en Infobae (por defecto no). La sexta pregunta de la IA y el resto del diseño de las 6 preguntas. |
| DISEÑADOR | Diseño de la entrega con la vista de las 4/5; ventanas para corridas cada 4 h. |
| DISEÑADOR con Don Julio | Capa 4: cada cuánto leer y dónde se guarda `datos/notas.json`. Con Infobae general cubriendo 1,3 h por lectura, leer seguido importa más. |
| Alejo | Lista de firmas, lista blanca, repo público o privado: sin apuro. |

No se hizo, como pedía la carta: la unión de hechos partidos en el código, la IA y sus preguntas, sumar feeds por sección, la memoria de lo ya entregado, la capa 4, la lista blanca, `firmas.json` y deportes.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| PREPARADOR | Recibe este reporte con las 3 mediciones | Leerlo y escribirle al DISEÑADOR la letra `d`: los feeds por sección (tabla del paso 4), las 14 notas de otras ediciones y los 2 pares | Cuando Alejo se lo pase | Alejo lleva el archivo |
| Alejo | Nada se rompió; los paquetes están al día | Hacer `/clear` en Claude Code, borrar y reabrir los chats de Cowork con su línea | Ahora | Alejo |
