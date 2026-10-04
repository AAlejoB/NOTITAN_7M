# PREPARADOR → Claude Code · 04-10-2026 · 14:46 (hora de Argentina) · letra a

Responde a `ClaudeCode_para_PREPARADOR_2026-10-04_f`, `g` y `h`. Todavía no hay carta del DISEÑADOR.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/PREPARADOR_para_ClaudeCode_2026-10-04_a.md` y la que Alejo te pega junto con esta como `buzon/PREPARADOR_para_Disenador_2026-10-04_a.md`. Tu reporte va en `buzon/ClaudeCode_para_PREPARADOR_2026-10-04_i.md`.

**Veredicto:** son tres pasos de código y uno de documentos, en este orden. Cada paso termina con `npm test` en verde y su propio commit. Lo urgente (casi no se verifica nada) se ataca en los pasos 2 y 3. La memoria de lo ya entregado **no** va en esta ronda (ver "Qué NO se hace").

| Paso | Qué ve quien usa el programa | Archivos |
|---|---|---|
| 1 | El aviso "¿feed roto?" deja de nombrar a los 6 portales que no tienen feed | `config/portales.json`, `ejemplos/dia-de-ejemplo.js`, `test/probar-feeds.test.js` |
| 2 | `npm run leer` puede juntar varias lecturas y verificar sobre las últimas 48 h | `src/nucleo.js`, `scripts/leer.js`, `test/nucleo.test.js`, `.gitignore`, `README.md` |
| 3 | El agrupador puede bajar el umbral sin juntar dos etapas distintas de un tema. Se mide con datos reales | `src/nucleo.js`, `config/reglas.json`, `scripts/leer.js`, `test/nucleo.test.js` |
| 4 | Nada: documentos y cierre de tanda | `CLAUDE.md`, `buzon/pendientes.md`, `buzon/LEEME.md`, reporte, paquetes |

## Lo que el PREPARADOR ya comprobó (usalo, no lo repitas)

Lo probé en una copia del repo (commit `5a503ac`), sin red a los portales:

1. Hoy `npm test` da 73 bien y 1 pendiente. `CLAUDE.md` dice 69: corregilo.
2. Con `umbralSimilitud` en 0.3 falla **un solo** test, el #22 ("misma noticia: el mismo hecho se junta y otro hecho del mismo tema no"), y `npm run demo` sale **idéntica**. No son "varios tests y el día de ejemplo". Falla porque 0.3 junta "Diputados aprobó el Presupuesto" con "Diputados empezó a debatir el Presupuesto": similitud 0,40, con 2 palabras en común (diput, presu). Ese test protege justo lo que no queremos: que dos etapas distintas de un tema se cuenten como un solo hecho y sumen medios entre sí. **Su resultado esperado no se cambia.**
3. Los portales sin feed que disparan el aviso en cada corrida son **6**, no 4: Reuters, AP, AFP, EFE, **La Voz y LN+**. Son los 6 de `sinFeed` en `config/feeds.json`.
4. Con los 6 en `activo: false` y el cambio del paso 1 en el día de ejemplo: 73 bien. La demo sale igual salvo la línea de AVISOS.
5. Con la regla del paso 3 cargada en `config/reglas.json` (0.3, 0.5 y 3): 73 bien, el #22 pasa y la demo sale igual.

## Paso 1 · Los 6 portales sin feed, inactivos

**Qué cambia:** el aviso "Portales sin notas en esta corrida (¿feed roto?)" deja de nombrar a los 6 que no tienen feed. Si se cae un feed de verdad, sigue avisando.

**Archivos que se tocan:**

- `config/portales.json`: agregar `"activo": false` al final del objeto de `reuters.com`, `apnews.com`, `afp.com`, `efe.com`, `lavoz.com.ar` y `lnmas.com`. Nada más en ese archivo.
- `ejemplos/dia-de-ejemplo.js`: en la línea `const INT = [...]`, reemplazar `'reuters.com', 'apnews.com', 'afp.com', 'efe.com'` por `'clarin.com', 'lanacion.com.ar', 'infobae.com', 'pagina12.com.ar'`, en las mismas posiciones. Arriba de esa línea va este comentario: `// Las 4 primeras son medios argentinos: hoy el motor los cuenta también para una noticia internacional (opción C de buzon/pendientes.md). Reuters, AP, AFP y EFE están inactivas porque no tienen feed.`
- `test/probar-feeds.test.js`: un test nuevo, "config/portales.json: los portales sin feed están inactivos". Cada `dominio` de `sinFeed` tiene `activo: false` en `portales.json`, y ningún otro portal tiene `activo: false`.

**No se tocan:** `src/nucleo.js`, `config/feeds.json` ni `test/nucleo.test.js`. El test del cable de EFE sigue pasando tal cual: los 4 cables suman para "efe" y la nota de efe.com se ignora por estar inactiva.

**Ejemplos:**

| Caso | Antes | Después |
|---|---|---|
| Corrida real con los 19 feeds trayendo notas | El aviso nombra reuters.com, apnews.com, afp.com, efe.com, lavoz.com.ar y lnmas.com | No aparece el aviso "¿feed roto?" |
| Corrida real con el feed de Clarín caído | Los 6 de arriba y clarin.com | Solo clarin.com |
| `npm run demo`, línea AVISOS | ole.com.ar, lavoz.com.ar, lnmas.com, noticiasargentinas.com, aljazeera.com | ole.com.ar, noticiasargentinas.com, aljazeera.com |

**Cuándo está listo:** `npm test` da 74 bien y 1 pendiente. La salida de `npm run demo` es igual a la de antes salvo la línea de AVISOS (compará con `diff`).

## Paso 2 · Acumular lo leído entre lecturas

**Qué cambia:** `npm run leer -- --acumular datos/notas.json` guarda lo leído y verifica sobre todo lo juntado en las últimas 48 h, no solo sobre la última lectura. Es la pieza pura que después va a usar n8n: n8n guarda el archivo y se lo pasa. Cada cuánto leer lo decide la capa 4 (DISEÑADOR y Don Julio), no esta ronda.

**Archivos que se tocan:**

- `src/nucleo.js`: función nueva `acumular(guardadas, nuevas, { reglas, ahora })`, exportada. Es pura como el resto: sin `fs` y sin `Date.now()`.
- `scripts/leer.js`: opciones `--acumular <archivo>` y `--sin-leer`.
- `test/nucleo.test.js`: tests de `acumular`, como mínimo los 4 ejemplos de abajo.
- `.gitignore` (nuevo): una sola línea, `datos/`. Las notas acumuladas **no** se suben: el repo es público y son textos de los medios.
- `README.md`: las opciones nuevas, en la línea de `npm run leer`.

**No se tocan:** `src/lector.js` ni nada de `config/`.

**Cómo funciona `acumular`:**

1. Junta `guardadas` y `nuevas` por `id` (el hash del link que arma el lector). Si un `id` está en las dos listas, queda entera la versión de `nuevas`.
2. Saca las notas cuya `fecha` tenga más de `reglas.ventanaRecoleccionHoras` (48) contadas desde `ahora`.
3. Ordena por `fecha` y, si empatan, por `id`, igual que `agrupar`.
4. Devuelve `{ notas, agregadas, repetidas, borradas }`. `agregadas` son los ids que no estaban guardados, `repetidas` los que ya estaban y `borradas` las notas sacadas por viejas, vengan de cualquiera de las dos listas.
5. No modifica los arrays que recibe.

**Ejemplos** (ahora = `2026-10-04T18:00:00.000Z`, ventana de 48 h, horas en UTC):

| # | guardadas | nuevas | notas | agregadas | repetidas | borradas |
|---|---|---|---|---|---|---|
| 1 | a (10:00, "Uno"), b (09:00, "Dos") | b (09:00, "Dos actualizado"), c (11:00) | b "Dos actualizado", a, c | 1 | 1 | 0 |
| 2 | d (hace 50 h), e (hace 2 h) | ninguna | e | 0 | 0 | 1 |
| 3 | ninguna | g (12:00), f (12:00) | f, g (misma fecha: se ordenan por id) | 2 | 0 | 0 |

Ejemplo 4: después de llamar con los datos del ejemplo 1, `guardadas` y `nuevas` siguen exactamente iguales.

**`scripts/leer.js`:**

- `--acumular <archivo>`: lee los feeds como hoy y carga el archivo. Si el archivo no existe, arranca vacío y crea la carpeta si falta. Llama a `acumular`, guarda el resultado en el archivo y corre `preparar` sobre todas las notas acumuladas, no solo las de esta lectura. Si el archivo existe pero no es JSON válido, corta con un mensaje y no lo pisa.
- `--sin-leer`, que solo vale junto con `--acumular`: no lee los feeds. Imprime "Sin leer: se usan las N notas de <archivo>", trabaja con lo que ya está en el archivo y no lo modifica. Sirve para comparar umbrales sobre las mismas notas.
- Con `--acumular`, después de la lista de feeds se imprime una línea con este formato: `ACUMULADO · 1.234 notas en datos/notas.json (56 nuevas, 980 repetidas, 12 borradas por tener más de 48 h) · la más vieja: 3/10/26 14:10`, en hora de Argentina.
- Con `--acumular`, el título del embudo agrega "sobre lo acumulado".
- `--json` sigue igual. Sin `--acumular`, `npm run leer` hace exactamente lo mismo que hoy.

**Cuándo está listo:** los tests nuevos están en verde. Corrés `npm run leer -- --acumular datos/notas.json` dos veces seguidas y la segunda muestra casi todas las notas como repetidas. `git status` no muestra `datos/`.

## Paso 3 · Agrupar: perilla nueva y medición con datos reales

**Qué cambia:** con un umbral bajo, una nota se suma a un hecho solo si además comparte al menos 3 palabras con una nota del grupo. Con similitud alta (0,5 o más) se suma como hoy.

**Archivos que se tocan:**

- `src/nucleo.js`, función `agrupar`: lee dos valores nuevos de las reglas, `umbralSeguro` y `minPalabrasComunes`.
- `config/reglas.json`: agregar `"umbralSeguro": 0.5` y `"minPalabrasComunes": 3` debajo de `umbralSimilitud`. **`umbralSimilitud` queda en 0.5 por ahora**: con 0.5 en los dos, nada cambia. Solo se baja si la medición lo permite (ver abajo).
- `scripts/leer.js`: dos opciones nuevas. `--min-comunes N` pisa `minPalabrasComunes` solo para esa corrida, como ya hace `--umbral`. `--detalle` lista cada hecho con 3 o más grupos: los grupos, y el portal y el título de cada nota.
- `test/nucleo.test.js`: tests de la regla, con los ejemplos 1 a 3 de abajo.

**No se tocan:** el test #22 ni su resultado esperado, ni ninguna otra función del núcleo.

**La regla, exacta:**

- "Palabras en común" entre dos notas es cuántos elementos comparten sus conjuntos `completo`, los que arma `firma()` con título y bajada.
- Un par (nota nueva, nota del grupo) **califica** si la similitud es ≥ `umbralSeguro`, **o** si la similitud es ≥ `umbralSimilitud` **y** las palabras en común son ≥ `minPalabrasComunes`.
- La nota entra al grupo de la nota que califica con la similitud más alta, respetando la ventana de 24 h como hoy. Si ninguna califica, arma un grupo nuevo.
- Si falta `umbralSeguro`, vale lo mismo que `umbralSimilitud`. Si falta `minPalabrasComunes`, vale 0. Así, sin los valores nuevos, el resultado es idéntico al de hoy.

**Ejemplos** (ventana de 24 h; las notas llegan en este orden de fecha):

| # | Notas | Reglas | Grupos esperados |
|---|---|---|---|
| 1 | a "Diputados aprobó el Presupuesto", b "Diputados empezó a debatir el Presupuesto", c "Aprobaron el Presupuesto", d "Qué cambia con el Presupuesto aprobado" (las 4 del #22) | 0.3, seguro 0.5, mínimo 3 | [a, c, d] y [b]. El par a-b da 0,40 con 2 en común: no califica |
| 1 bis | las mismas | 0.3, sin los valores nuevos | [a, b, c, d]: la unión falsa que hoy produce 0.3 |
| 2 | p "Brasil: Lula y Bolsonaro definirán la presidencia en un balotaje", q "Elecciones en Brasil: Lula ganó la primera vuelta pero habrá balotaje con Bolsonaro" | 0.3, seguro 0.5, mínimo 3 | [p, q]: 0,364 con 4 en común (brasi, lula, bolso, balot) |
| 2 bis | las mismas | 0.5, como hoy | [p] y [q] |
| 3 | las del 1 más las del 2 | 0.5, sin los valores nuevos | Lo mismo que da la función de hoy |

**Medición** (con Network access en Full y `NODE_USE_ENV_PROXY=1`):

1. Corré `npm run leer -- --acumular datos/notas.json` ahora. Si la sesión te deja correr en segundo plano sin trabarte, repetí la lectura cada 30 minutos hasta juntar 5 (unas 2 h). Si no, medí con lo que haya y anotá cuántas lecturas hiciste y a qué horas.
2. Sobre el mismo archivo, con `--sin-leer --detalle`, corré tres variantes:
   - V1: `--umbral 0.5` (lo de hoy).
   - V2: `--umbral 0.3 --min-comunes 0` (0,3 sola).
   - V3: `--umbral 0.3` (0,3 con 3 palabras en común; 0,5 como seguro).
3. Revisá a ojo cada hecho de V2 y de V3 que tenga 5 o más grupos y fijate si es la misma noticia. Hay **unión falsa** cuando en el hecho hay notas de dos hechos distintos, aunque sean del mismo tema: otra etapa, otro partido, otra persona.
4. Armá para tu reporte una tabla con una fila por variante y estas columnas: hechos, con 3 o más grupos, con 5 o más grupos, y uniones falsas entre los de 5 o más. Abajo, los títulos de cada unión falsa. Aparte, cuántas lecturas hiciste y cuántas horas abarcan en el archivo las notas de Clarín y de Infobae, que son los feeds más cortos.

**Qué se carga después de medir.** Es el valor por defecto; el DISEÑADOR y Alejo lo pueden cambiar con un número.

- Si V3 tiene **0 uniones falsas** entre sus hechos de 5 o más grupos: poné `"umbralSimilitud": 0.3` en `config/reglas.json`. `npm test` tiene que seguir en verde (ya lo comprobé: el #22 pasa con 0.3, 0.5 y 3) y la demo tiene que salir igual.
- Si V3 tiene alguna: dejá 0.5 y reportá los títulos. No pruebes otros números por tu cuenta.
- Ojo en la revisión: dos resultados deportivos armados con la misma frase, como "Boca le ganó a Racing por la Liga Profesional" y "River le ganó a Racing por la Liga Profesional", ya se juntan hoy con 0.5 (dan 0,50 justo). Si aparecen, anotalos aparte: no los causa la regla nueva.

## Paso 4 · Documentos y cierre de tanda

- `CLAUDE.md`: actualizar Estado (tests al día, `acumular`, la perilla del agrupador, los 6 portales inactivos), el hallazgo con la tabla de la medición y "Siguiente paso".
- `buzon/pendientes.md`:
  - Pasan a Hecho los portales sin feed inactivos (6), `acumular` con `--acumular`, y la perilla del agrupador (con el umbral nuevo, si quedó en 0.3).
  - En "Guardar lo leído entre corridas" queda solo lo de capa 4: cada cuánto leer y dónde se guarda. Le toca al DISEÑADOR con Don Julio.
  - Nuevo en "PREPARADOR → Claude Code": "LN+: reintentar el feed con Network access en Full. Si anda, sacarle `activo: false`, sumarlo a `config/feeds.json` y sacarlo de `sinFeed`."
  - "Memoria de lo ya entregado" sigue en "PREPARADOR → Claude Code", con esta nota: "espera el diseño de la entrega (DISEÑADOR): ocultar o marcar, por persona, cuánto dura".
  - En el ítem de Alejo sobre el repo público, agregar: "si pasa a privado, la línea de arranque con el link deja de andar y se vuelve al paquete".
- `buzon/LEEME.md`: cambio de método que propone el PREPARADOR. **Si Alejo te dice que no, salteá este punto.** Yo leí este repo clonándolo desde un chat de Cowork, porque es público. En "Cómo llegan los archivos a Cowork", punto 1, agregar: "Un chat de Cowork puede clonar el repo si la línea trae el link (probado el 04-10 por el PREPARADOR). El paquete queda para cuando eso no ande." Las líneas para pegar pasan a ser:
  - DISEÑADOR: `Chat nuevo. Cloná https://github.com/AAlejoB/NOTITAN_7M (rama claude/trusting-knuth-brmpsy), leé buzon/LEEME_DISENADOR.md y arrancá de ahí.`
  - PREPARADOR: `Chat nuevo. Cloná https://github.com/AAlejoB/NOTITAN_7M (rama claude/trusting-knuth-brmpsy), leé buzon/LEEME_PREPARADOR.md y arrancá de ahí.`
- Reporte `ClaudeCode_para_PREPARADOR_2026-10-04_i.md`, con el formato de siempre más la tabla de la medición. Después `npm run paquete`, commit y push.

## Qué NO se hace en esta ronda

- **La memoria de lo ya entregado.** Espera el diseño de la entrega, porque antes hay que decidir cuatro cosas: si lo ya entregado se oculta o se muestra marcado; si la lista es por persona (la hermana de Alejo y un cliente no comparten lista); cuánto dura; y qué pasa con una novedad de una noticia ya entregada. Además depende del umbral: una novedad que el agrupador une a un hecho ya entregado quedaría oculta.
- Cada cuánto leer y dónde se guarda (capa 4).
- La IA que juzga.
- La lista blanca, `config/firmas.json` y todo lo de "Decisiones que solo Alejo puede tomar".

## De quién es cada decisión y qué se usa mientras tanto

| Tema | Quién decide | Valor por defecto en esta ronda |
|---|---|---|
| Umbral del agrupador | DISEÑADOR con Alejo, mirando la tabla de la medición | 0.5 hasta medir; 0.3 con la regla nueva si V3 no tiene uniones falsas |
| Ventana de lo acumulado | DISEÑADOR | 48 h (`ventanaRecoleccionHoras`, que ya existe) |
| Las notas acumuladas quedan fuera del repo | PREPARADOR | `datos/` en `.gitignore` |
| Medios argentinos que cuentan para una internacional (opción C) | Alejo | Sí, como hoy; el día de ejemplo lo deja escrito |
| Línea de arranque con el link del repo | Alejo | Sí, salvo que diga que no |

## Pasos, en orden

1. `git pull`. Guardar esta carta y la del DISEÑADOR en `buzon/`. Commit.
2. Paso 1, `npm test`, commit.
3. Paso 2, `npm test`, commit.
4. Paso 3 (código), `npm test`, commit.
5. Medición. Si corresponde, umbral en 0.3, `npm test` y demo. Commit.
6. Paso 4, reporte `i`, `npm run paquete`, commit y push.
