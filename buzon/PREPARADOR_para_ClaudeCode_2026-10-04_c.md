# PREPARADOR → Claude Code · 04-10-2026 · 18:45 (hora de Argentina) · letra c

Responde a `Disenador_para_PREPARADOR_2026-10-04_b.md` (ya está en `buzon/`).

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/PREPARADOR_para_ClaudeCode_2026-10-04_c.md`. Tu reporte va en `buzon/ClaudeCode_para_PREPARADOR_2026-10-04_k.md`.

**Veredicto:** Alejo decidió dos cosas. (1) Se sacan del feed de Infobae las ediciones de España, Perú, México y Colombia: va ahora, con código (paso 1). (2) La IA va a unir los hechos partidos: **no toca código** hasta que exista la IA; ahora solo se mide cuántos pares miraría (paso 3). Además, dos mediciones que pide el DISEÑADOR (pasos 2 y 4), LN+ (paso 5) y los documentos (paso 6).

| Paso | Qué ve quien usa el programa | Archivos |
|---|---|---|
| 1 | Las notas locales de España, Perú, México y Colombia que trae Infobae no aparecen ni cuentan para confirmar. Tampoco las que ya estaban guardadas | `config/feeds.json`, `src/lector.js`, `scripts/leer.js`, `test/lector.test.js`, `test/leer.test.js`, `README.md` |
| 2 | Nada: medición antes y después sobre lo guardado | ninguno |
| 3 | Nada: medición de pares para la sexta pregunta de la IA | ninguno (script de una sola vez, fuera del repo) |
| 4 | Nada: prueba de feeds por sección de Infobae | ninguno (fuera del repo) |
| 5 | Si LN+ anda, sus notas entran (es grupo La Nación: no suma un medio nuevo) | `config/portales.json`, `config/feeds.json` |
| 6 | Nada: documentos y cierre de tanda | `CLAUDE.md`, `buzon/pendientes.md`, reporte, paquetes |

## Lo que el PREPARADOR ya comprobó (usalo, no lo repitas)

En una copia del repo (commit `0dc533e`), sin red a los portales:

1. Hoy `npm test` da 123 bien y 1 pendiente.
2. El lector descarta una ruta si **aparece en cualquier parte** de la dirección (`ruta.includes(r)` en `parsearFeed`). Con Infobae eso es peligroso: una dirección como `/america/mexico/…` (internacional de verdad) se caería por `/mexico/`. Cambiando a **"la dirección empieza con la ruta"** (`startsWith`), los 123 tests siguen bien, incluido el del Cronista, porque sus ediciones también son el primer tramo de la dirección.
3. Las fechas futuras ya tienen un freno: el lector descarta lo que viene con más de 12 h de adelanto (`FECHA_FUTURA_HORAS`). Lo de Página/12 (6 h de adelanto) pasa y cuenta como fresco un rato más, sin daño visto. **Decisión del PREPARADOR: no se toca.** Solo se anota (paso 6).

## Paso 1 · Infobae sin las ediciones de otros países

**Qué cambia:** las notas de `/espana/`, `/peru/`, `/mexico/` y `/colombia/` de Infobae se descartan al leer, como las del Cronista. `/america/` queda: trae internacionales de verdad. Lo ya guardado en `datos/notas.json` también se filtra al cargarlo, para que la ventana de 48 h no arrastre notas que ya no cuentan.

**Archivos que se tocan:**

- `config/feeds.json`, entrada de Infobae: agregar `"excluirRutas": ["/espana/", "/peru/", "/mexico/", "/colombia/"]` y una `nota`: "Mezcla ediciones de otros países: de 341 notas guardadas el 04-10, 282 eran de otra edición (/espana/ 76, /peru/ 72, /america/ 69, /mexico/ 38, /colombia/ 27). Se descartan España, Perú, México y Colombia (decidió Alejo el 04-10). /america/ queda porque trae internacionales de verdad."
- `src/lector.js`:
  - Función nueva y exportada `rutaExcluida(url, excluirRutas)`. Devuelve la ruta (en minúsculas) si el `pathname` de la dirección, en minúsculas, **empieza con** esa ruta; si no, `null`. Si la dirección no se puede leer, `null`.
  - `parsearFeed` la usa en lugar de su `excluidas.find(...)`. El motivo sigue igual: `ruta_excluida (<ruta>)`.
- `scripts/leer.js`:
  - Función nueva y exportada `filtrarRutas(notas, feeds)`. Para cada nota busca el feed con `f.nombre === nota.feed`. Si ese feed tiene `excluirRutas` y `rutaExcluida(nota.url, f.excluirRutas)` da una ruta, la nota sale. Si la nota no tiene `feed`, o su feed ya no existe, queda. Devuelve `{ notas, sacadas }`, donde `sacadas` es `[{ id, ruta }]`. No modifica la lista que recibe.
  - Al cargar el archivo de `--acumular` (las dos formas: con y sin `--sin-leer`), se pasa lo guardado por `filtrarRutas` antes de usarlo. Si sacó alguna, se imprime una línea: `RUTAS EXCLUIDAS · 213 notas guardadas sacadas (/espana/ 76, /peru/ 72, /mexico/ 38, /colombia/ 27)`, de mayor a menor. Sin `--sin-leer`, el archivo se reescribe ya sin esas notas (pasa solo, porque `acumular` recibe lo filtrado).
  - Opción nueva `--sin-excluir-rutas`, **solo junto con `--sin-leer`**: no filtra lo guardado. Sirve para el "antes" del paso 2. Sin `--sin-leer`, corta con el mensaje "--sin-excluir-rutas solo vale junto con --sin-leer."
- `README.md`: la opción nueva, en la línea de `npm run leer`.

**No se tocan:** `src/nucleo.js` (el núcleo no sabe de feeds), las rutas del Cronista, `/america/`, `FECHA_FUTURA_HORAS`.

**Ejemplos** (las direcciones inventadas están marcadas):

| # | Dirección | Feed | Resultado |
|---|---|---|---|
| 1 | `https://www.infobae.com/colombia/2026/10/04/resultado-loteria-del-cauca-hoy-3-de-octubre/` (real) | Infobae | Sale: `ruta_excluida (/colombia/)` |
| 2 | `https://www.infobae.com/america/america-latina/2026/10/04/brasil/` (inventada) | Infobae | Queda |
| 3 | `https://www.infobae.com/america/mexico/2026/10/04/x/` (inventada) | Infobae | **Queda**: no empieza con `/mexico/`. Hoy, con "aparece en cualquier parte", saldría |
| 4 | `https://www.infobae.com/politica/2026/10/04/x/` (inventada) | Infobae | Queda |
| 5 | `https://www.infobae.com/ESPANA/2026/10/04/x/` (inventada) | Infobae | Sale: `ruta_excluida (/espana/)` |
| 6 | `https://www.cronista.com/espana/lluvias-2` (del test que ya existe) | El Cronista | Sale, como hoy |

**Tests mínimos:**

- `test/lector.test.js`: `rutaExcluida` con los 6 ejemplos. Un `parsearFeed` con un feed de Infobae y los ejemplos 1 a 4: quedan 2, 3 y 4. En el test de `config/feeds.json`, que Infobae tenga las 4 rutas y no tenga `/america/`.
- `test/leer.test.js`: `filtrarRutas` con 4 notas (una de Infobae `/peru/`, una de Infobae `/america/`, una sin `feed`, una de un feed que no existe): saca solo la primera, devuelve `sacadas: [{ id, ruta: '/peru/' }]` y no modifica la lista. `leerOpciones` con `--sin-excluir-rutas` sin `--sin-leer` corta con el mensaje.
- El test del Cronista que ya existe no se toca y tiene que pasar.

**Cuándo está listo:** `npm test` en verde. `npm run demo` sale idéntica (el día de ejemplo no tiene feeds).

## Paso 2 · Medición antes y después (lo pide el DISEÑADOR)

**Ojo con el orden:** no corras ninguna lectura con `--acumular` antes de A y B. La primera lectura reescribe el archivo ya sin esas rutas, y el "antes" se pierde.

1. `ls -la datos/notas.json`: cuántas notas y de qué hora es la más vieja y la más nueva. Si no existe, salteá los pasos 2 y 3, decilo en el reporte y seguí con el 4.
2. Las dos corridas, una atrás de la otra:
   - A (antes): `npm run leer -- --acumular datos/notas.json --sin-leer --detalle --sin-excluir-rutas`
   - B (después): `npm run leer -- --acumular datos/notas.json --sin-leer --detalle`
3. En el reporte:
   - a. **Hechos según cuántos grupos** (1, 2, 3, 4, 5 o más), hechos en total y notas, A contra B, en una tabla como la `d` del reporte j.
   - b. **Hechos de 3 o más grupos que pierden a Infobae:** título, grupos en A y en B.
   - c. **Las 2 confirmadas y las 4 de la lista para elegir a mano:** si siguen igual en B. Si alguna cambia, cuál y por qué.
   - d. **Lo que quedó sin agarrar en la tabla `f` del reporte j:** de los 6 "sorteos" (Chontico, Telekino, Quini 6, Triplex de la Once, Super Once, Bonoloto) y de las 6 "dónde ver", cuáles desaparecen en B. Para cada una, de qué feed y ruta venía.
   - e. **"Aparece" contra "empieza con":** entre las notas de Infobae guardadas, cuántas contienen una de las 4 rutas pero **no** empiezan con ella, con sus direcciones. Si son 0, decilo.
   - f. **Infobae en B:** cuántas notas quedan y cuántas horas cubren (entre la más vieja y la más nueva).

## Paso 3 · Pares para la sexta pregunta de la IA (lo pide el DISEÑADOR)

Alejo decidió que la IA va a unir los hechos partidos (los dos de Colapinto, por ejemplo) y que se cuenten juntos. Antes de diseñar esa pregunta, el DISEÑADOR quiere saber cuántos pares miraría la IA y cuáles. **No se toca el núcleo.** Es un script de una sola vez, fuera del repo (por ejemplo en `/tmp`), sobre lo guardado y con el filtro del paso 1 puesto (como B). No se commitea.

**Qué hechos entran:** los de `enObservacion` de `preparar` (frescos, menos de 24 h) con `gruposIndependientes` 3 o 4. Un hecho de 5 o más ya está confirmado y no entra.

**Palabras propias de un hecho** (aproximación a "persona o lugar"): se miran los títulos de **todas** las notas del hecho. Cuenta una palabra si:

- empieza con mayúscula;
- no es la primera palabra del título, ni la primera después de `:`, `.`, `?`, `!`, `|`, `—` o de un `¿`, `¡` o comillas que abren;
- sin tildes y en minúsculas tiene 3 letras o más y no está en la lista `STOP` de `src/nucleo.js`;
- si está toda en mayúsculas, no es ninguna de estas: VIVO, HOY, ULTIMO, ULTIMA, URGENTE, VIDEO, FOTOS, MINUTO.

Se comparan sin tildes y en minúsculas. Los signos de los bordes (`¿¡"'“”‘’«»():;,.!?…`) se sacan antes de mirar.

**Qué es un par:** dos hechos de la lista que comparten al menos una palabra propia y cuya `primera` nota está a menos de 24 h una de otra (`ventanaMismoHechoHoras`).

**En el reporte:**

- Cuántos hechos entraron y cuántos pares salieron.
- Para cada par (si son más de 40, los 40 con más grupos en la unión): el título base de cada hecho, los grupos de cada uno, las palabras en común, **cuántos grupos distintos suma la unión** (Clarín en los dos vale 1), si llega a 5, y tu juicio a ojo: "misma noticia: sí, no o dudoso".
- **Control:** el par de Colapinto ("…Gran Premio de Malasia" + "Una carrera loca… en Sepang") tiene que salir, con una unión de 5 grupos (La Gaceta, La Nación, Clarín, Página/12 y La Capital, según el reporte j). Si no sale o da otro número, decí por qué.
- Un solo número aparte: cuántos pares saldrían si también entraran los hechos viejos (más de 24 h) de 3 o 4 grupos.

## Paso 4 · Feeds por sección de Infobae (lo pide el DISEÑADOR, solo medir)

De 341 notas de Infobae, solo 59 eran argentinas. La idea: ver si Infobae tiene feeds por sección que traigan más notas argentinas y cubran más horas. **No se suma nada a `config/feeds.json`.**

1. Con `NODE_USE_ENV_PROXY=1`, probá para `politica`, `economia` y `sociedad` estas dos formas (**sin verificar**, siguen el formato del feed general, que es Arc):
   - `https://www.infobae.com/arc/outboundfeeds/rss/category/<seccion>/`
   - `https://www.infobae.com/arc/outboundfeeds/rss/category/<seccion>/?outputType=xml`
2. Si ninguna anda, mirá el HTML de `https://www.infobae.com/<seccion>/` buscando un `<link>` con `application/rss+xml`. Si tampoco hay, decilo y pará: no busques más formas.
3. Para cada feed que ande, en una tabla: dirección, cuántas notas trae, cuántas son argentinas (no empiezan con `/america/` ni con ninguna de las 4 rutas excluidas), cuántas horas cubren y cuántas ya estaban en el feed general en esa misma lectura (por `id`). En la última fila, el feed general leído en el mismo momento, con las mismas columnas.

Para probar podés usar `scripts/probar-feeds.js` con un archivo de candidatos en `/tmp` (formato `nombre | ámbito | url`) y, para contar, un script de una sola vez que use `leerFeeds` de `src/lector.js`. Nada de esto va al repo.

## Paso 5 · LN+

Está pendiente desde la capa 3 ("reintentar con Network access en Full"). Esta sesión ya leyó los portales, así que la red alcanza.

- Probá el feed de LN+ (`lnmas.com`). Si no sabés la dirección, buscá en el HTML de la portada un `<link>` con `application/rss+xml`.
- **Si anda:** en `config/portales.json`, sacarle `"activo": false` a `lnmas.com`. En `config/feeds.json`, agregarlo a `feeds` con `"grupo": "La Nación"` y `"ambito": "nacional"`, y sacarlo de `sinFeed`. El test "los portales sin feed están inactivos" tiene que seguir en verde. Commit aparte.
- **Si no anda:** en `sinFeed`, el `motivo` pasa a decir qué dio el 04-10 con la red completa. En `pendientes.md` el ítem se cierra: "no anda con la red completa; se reintenta solo si Alejo lo pide".

Va **después** de los pasos 2 a 4, para no mezclar sus notas con la medición.

## Paso 6 · Documentos y cierre de tanda

- `CLAUDE.md`:
  - "Lo que Alejo pidió el 2026-10-04", dos ítems nuevos:
    - **Infobae** (decidió Alejo, 04-10): se descartan sus ediciones de España, Perú, México y Colombia, como en el Cronista; `/america/` queda. No toca "qué es INTERNACIONAL": solo decide qué páginas de Infobae cuentan como Infobae.
    - **Hechos partidos** (decidió Alejo, 04-10, opción A): la IA que juzga une dos hechos que son la misma noticia y se cuentan juntos, por grupos distintos (Clarín en los dos vale 1). El hecho unido sigue el camino normal: con 5 o más grupos sale "Confirmada por N medios", **sin etiqueta distinta**. **Riesgo aceptado por Alejo:** si la IA se equivoca, una noticia podría salir Confirmada sin serlo. Es la sexta pregunta de la IA y espera a que la IA exista. Los detalles son valores por defecto del DISEÑADOR: solo pares de hechos con 3 o 4 grupos que comparten persona o lugar; la IA contesta sí o no, más una línea de por qué; en lo que se guarda para revisar (no en lo que ve quien usa el botón) queda "unido por la IA: <por qué>"; la unión va **antes** de armar `candidatos` y `elegiblesAMano` y antes de las otras 5 preguntas.
  - "Capa 3": el feed de Infobae mezcla ediciones, con los números; la regla de rutas pasa a "empieza con", y lo guardado se vuelve a filtrar al cargarlo (`filtrarRutas` en `scripts/leer.js`; en n8n, el mismo paso al cargar lo acumulado).
  - "Estado": tests al día y `--sin-excluir-rutas`.
  - El resultado de la medición del paso 2, corto (tabla a), y "Siguiente paso".
- `buzon/pendientes.md`:
  - A Hecho: Infobae sin ediciones de otros países, con el antes y después.
  - "Hechos partidos": pasa a "**decidido por Alejo (A): la IA los une y se cuentan juntos; espera la IA**", con el resultado del paso 3 (cuántos pares).
  - "Diseñar las 5 preguntas de la IA" pasa a "**6 preguntas**", con la sexta: "¿estos dos hechos son la misma noticia?".
  - "Notas con fecha futura" sale del bloque DISEÑADOR y pasa a Hecho: "Decidido por el PREPARADOR: no se toca. El lector ya descarta lo que viene con más de 12 h de adelanto (`FECHA_FUTURA_HORAS`); lo de menos de 12 h cuenta como fresco un rato más, sin daño visto."
  - Nuevo en DISEÑADOR, con los números del paso 4: "Feeds por sección de Infobae: ¿se suman? **Valor por defecto:** no." Si no existen, el ítem va directo a Hecho como "no hay".
  - LN+: según el paso 5.
- Reporte `ClaudeCode_para_PREPARADOR_2026-10-04_k.md`, con el formato de siempre, los tests antes y después, y las mediciones de los pasos 2, 3 y 4. Después `npm run paquete`, commit y push.

## Qué NO se hace en esta ronda

- La unión de hechos partidos en el código, la IA que juzga y sus preguntas.
- Sumar feeds por sección de Infobae (solo se miden).
- Tocar `/america/`, las rutas del Cronista o `FECHA_FUTURA_HORAS`.
- La memoria de lo ya entregado, la capa 4, la lista blanca, `firmas.json` y deportes.

## De quién es cada decisión y qué se usa mientras tanto

| Tema | Quién decide | Valor en esta ronda |
|---|---|---|
| Sacar las ediciones de otros países de Infobae | Alejo (decidido) | `/espana/`, `/peru/`, `/mexico/`, `/colombia/`; `/america/` queda |
| La regla de rutas: "empieza con" en vez de "aparece en cualquier parte" | PREPARADOR | empieza con |
| Filtrar también lo guardado al cargarlo | DISEÑADOR lo propuso, PREPARADOR decidió cómo | en `scripts/leer.js`, no en el núcleo |
| La IA une los hechos partidos y se cuentan juntos | Alejo (decidido) | espera la IA |
| Qué pares mira la IA y cómo se cuenta la unión | DISEÑADOR | 3 o 4 grupos, persona o lugar en común, grupos distintos |
| Aproximación de "persona o lugar" para medir | PREPARADOR | palabras con mayúscula, con las reglas del paso 3 |
| Feeds por sección de Infobae | DISEÑADOR, con los números | no se suman |
| Fechas futuras | PREPARADOR | no se tocan |

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1, `npm test`, `diff` de la demo (igual), commit.
3. Paso 2 (sin leer antes), paso 3 y paso 4. Nada se commitea de esto.
4. Paso 5, `npm test`, commit (si cambió algo).
5. Paso 6, reporte `k`, `npm run paquete`, commit y push.
