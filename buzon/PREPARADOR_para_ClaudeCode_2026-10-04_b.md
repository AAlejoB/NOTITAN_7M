# PREPARADOR → Claude Code · 04-10-2026 · 17:55 (hora de Argentina) · letra b

Responde a `ClaudeCode_para_PREPARADOR_2026-10-04_i.md` y a `Disenador_para_PREPARADOR_2026-10-04_a.md`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/PREPARADOR_para_ClaudeCode_2026-10-04_b.md` y la que Alejo te pega junto con esta como `buzon/PREPARADOR_para_Disenador_2026-10-04_b.md`. Tu reporte va en `buzon/ClaudeCode_para_PREPARADOR_2026-10-04_j.md`.

**Veredicto:** Alejo tomó tres decisiones. Dos piden código: sacar las notas de servicio con plantilla (paso 1) y que el núcleo separe las noticias a las que les falta 1 medio para que se puedan elegir a mano (paso 2). La tercera (5 grupos fijos, sin cálculo) solo se anota (paso 4). En el medio va una medición con lo que ya está guardado (paso 3). Cada paso termina con `npm test` en verde y su propio commit.

| Paso | Qué ve quien usa el programa | Archivos |
|---|---|---|
| 0 | Nada: revisar que estén las notas guardadas | ninguno |
| 1 | "A qué hora juegan…", "Efemérides…" y "Resultados de la Lotería…" no aparecen nunca, como el horóscopo | `config/reglas.json`, `src/nucleo.js`, `test/nucleo.test.js` |
| 2 | Una noticia con 4 de 5 medios queda en una lista aparte para elegir a mano, con su etiqueta. Nunca entra sola | `config/reglas.json`, `src/nucleo.js`, `ejemplos/dia-de-ejemplo.js`, `ejemplos/demo.js`, `scripts/leer.js`, `test/nucleo.test.js` |
| 3 | `npm run leer` muestra qué sacó el criterio 1 y por qué. Se mide con lo guardado | `scripts/leer.js`, `test/leer.test.js` |
| 4 | Nada: documentos y cierre de tanda | `CLAUDE.md`, `README.md`, `buzon/pendientes.md`, reporte, paquetes |

## Lo que el PREPARADOR ya comprobó (usalo, no lo repitas)

Lo probé en una copia del repo (commit `4ad920f`), sin red a los portales:

1. Hoy `npm test` da 102 bien y 1 pendiente.
2. Los 3 moldes del paso 1, tal como están abajo, dan bien los 12 casos de la tabla del paso 1. Ninguno agarra un título del día de ejemplo, así que `npm run demo` no cambia con el paso 1.
3. Con el paso 2 hecho como dice abajo, falla **un solo** test, "día de ejemplo: de punta a punta", y solo en dos líneas (las que cambian, más abajo). Todo lo demás sale igual: nacionales, internacionales, reserva, 4 descartadas, el aviso "Hoy: 7 nacionales, 5 internacionales" y la línea de AVISOS de la demo.
4. La regla `quiniela` que ya existe en `titulosExcluidos` saca cualquier título que diga "quiniela", también "Detienen al dueño de una agencia de quiniela por lavado". Con `horoscopo` pasa lo mismo. **No la toques**: va como hallazgo al DISEÑADOR y se mide en el paso 3.

## Paso 0 · Las notas guardadas

`ls -la datos/notas.json`. En el reporte poné cuántas notas tiene y de qué hora es la más vieja y la más nueva.

- Si existe: seguí con el paso 1.
- Si no existe (se perdió el contenedor): con Network access en Full y `NODE_USE_ENV_PROXY=1`, corré `npm run leer -- --acumular datos/notas.json` ahora y repetí cada 30 minutos mientras hacés los pasos 1 y 2, hasta tener 3 lecturas. Si los portales no responden, seguí igual con los pasos 1, 2 y 4, y en el reporte poné que la medición no se pudo hacer.

## Paso 1 · Notas de servicio con plantilla (criterio 1)

**Qué cambia:** tres tipos de nota de servicio salen en el criterio 1, antes de agrupar, igual que el horóscopo. No cuentan para verificar. En lo descartado quedan con el motivo `nota_de_servicio (<nombre del molde>)`. Hoy ya se juntan de forma falsa a 3 grupos ("A qué hora juegan Talleres vs. Belgrano… EN VIVO" con otros partidos; "Efemérides de hoy" con la Lotería del Cauca) y con más medios podrían llegar a 5.

**Archivos que se tocan:**

- `config/reglas.json`: dentro de `criterio1`, una clave nueva `notasDeServicio`, justo debajo de `titulosExcluidos`:

```json
"notasDeServicio": [
  { "nombre": "horario de partido", "molde": "a que hora (juega|juegan|jugara|jugaran)\\b" },
  { "nombre": "efemérides", "molde": "^efemerides\\b" },
  { "nombre": "resultados de lotería", "molde": "^resultados? de (la )?loteria\\b|^loteria\\b.*\\b(resultados?|numeros? ganador(es)?)\\b" }
]
```

- `src/nucleo.js`, función `esInformativa`: después del recorrido de `titulosExcluidos` y antes del de `etiquetasExcluidas`, recorrer `regla.notasDeServicio || []`. Si `new RegExp(m.molde).test(titulo)`, devolver `ok: false` con el motivo `nota_de_servicio (` + `m.nombre` + `)`, por ejemplo `nota_de_servicio (efemérides)`. `titulo` es el que ya se calcula ahí con `normalizar` (minúsculas, sin tildes, los signos pasan a espacio). Nada más en ese archivo.
- `test/nucleo.test.js`: los tests de abajo.

**No se tocan:** `titulosExcluidos` (ni `quiniela` ni `horoscopo`), `urlsExcluidas`, `etiquetasExcluidas`, `src/lector.js`.

**Cómo leer cada molde:**

- *Horario de partido*: la frase "a qué hora juega / juegan / jugará / jugarán" en **cualquier parte** del título, porque en los títulos reales suele ir después de los dos puntos ("Boca vs. River: a qué hora juega…"). La frase entera ya es precisa. No agarra "a qué hora votan", "a qué hora corre", "dónde ver" ni "horario".
- *Efemérides*: el título **empieza** con "Efemérides".
- *Resultados de lotería*: el título **empieza** con "Resultado(s) de (la) Lotería…", o empieza con "Lotería…" y más adelante dice "resultado(s)" o "número(s) ganador(es)". Solo la palabra "lotería": Quini 6, Loto, Brinco, Baloto y "sorteo" solo **no** entran (se cuentan en el paso 3).

**Ajustes permitidos:** podés cambiar el texto de un molde solo para agarrar una variante real del mismo tipo que encuentres en `datos/notas.json`, y en el reporte va el título real que lo motivó. Si para agarrarla hay que aflojar el molde (sacar el "empieza con", dejar una palabra suelta), no lo hagas: anotala en el reporte. Los 12 casos de la tabla tienen que seguir dando lo mismo.

**Ejemplos** (los 2 primeros son reales del 04-10; el resto, inventados). Todos van a los tests:

| # | Título | Tiene que | Motivo |
|---|---|---|---|
| 1 | "A qué hora juegan Talleres vs. Belgrano… EN VIVO" | Salir | `nota_de_servicio (horario de partido)` |
| 2 | "Efemérides de hoy" | Salir | `nota_de_servicio (efemérides)` |
| 3 | "Boca vs. River: a qué hora juega el Superclásico y cómo verlo" | Salir | `nota_de_servicio (horario de partido)` |
| 4 | "Efemérides del 4 de octubre: qué pasó un día como hoy" | Salir | `nota_de_servicio (efemérides)` |
| 5 | "Resultados de la Lotería del Cauca del 3 de octubre" | Salir | `nota_de_servicio (resultados de lotería)` |
| 6 | "Lotería de Medellín: resultados y números ganadores del sorteo" | Salir | `nota_de_servicio (resultados de lotería)` |
| 7 | "Talleres le ganó 2 a 1 a Belgrano en el clásico" | Seguir | es un resultado, no un horario |
| 8 | "Detienen a dos funcionarios de la Lotería por fraude" | Seguir | dice "lotería" pero no es un resultado |
| 9 | "A qué hora votan en Brasil y cuándo se conocen los resultados" | Seguir | Brasil fue uno de los 2 verificados reales: el molde de partidos no lo toca |
| 10 | "Polémica por las efemérides que el Gobierno sacó del calendario escolar" | Seguir | "efemérides" no está al principio |
| 11 | "Resultado de la auditoría en la Lotería de la Ciudad: hallaron irregularidades" | Seguir | no es "resultados de la lotería" |
| 12 | "Quini 6: resultados del sorteo del domingo" | Seguir | queda afuera del molde por ahora (decide el DISEÑADOR) |

Si en `datos/notas.json` está el título real de la Lotería del Cauca, sumalo como caso 13 (tiene que salir).

**Tests mínimos:**

- "criterio 1: notas de servicio con plantilla (horario de partido, efemérides, lotería) quedan afuera con su motivo": casos 1 a 6, con el motivo exacto.
- "criterio 1: los moldes de servicio no se llevan noticias de verdad": casos 7 a 12, `ok: true`.
- "criterio 1: sin notasDeServicio en la config, todo queda como antes": con un `criterio1` sin esa clave, el caso 1 da `ok: true`.

**Cuándo está listo:** `npm test` en verde, con los 102 de antes sin tocar. La salida de `npm run demo` es idéntica a la de antes (compará con `diff`).

## Paso 2 · Excepción a mano para una 4/5 (núcleo)

**Qué cambia:** el núcleo separa los hechos a los que les falta exactamente 1 medio para llegar a 5, sin firma que los haga entrar por la vía B. Pasan por el juicio de la IA como cualquier candidato y salen en una lista aparte, por bloque, con la etiqueta **"Confirmada por 4 medios · elegida a mano"**. Esa lista es un menú: el programa nunca los mete solo en las nacionales ni en las internacionales, ni para completar el mínimo de 3. La vista (la lista "En observación · les falta 1 medio" con el botón "Llevármela igual") es capa 5 y **no** se hace ahora.

**Cómo queda el flujo** (para n8n, más adelante): `preparar` devuelve además `elegiblesAMano`; la IA juzga `candidatos` **y** `elegiblesAMano`; `decidir` recibe `elegiblesAMano` en el contexto y devuelve `aMano`.

**Archivos que se tocan:**

- `config/reglas.json`: `"aMano": { "activa": true, "faltanMedios": 1 }`, en la línea de abajo de `viaB`.
- `src/nucleo.js`:
  - `preparar`: a cada hecho que va a `enObservacion` se le agrega `elegibleAMano` (true o false). Devuelve una lista nueva `elegiblesAMano` (los de `enObservacion` con `elegibleAMano: true`, los mismos objetos) y `resumen.elegiblesAMano` (cuántos son).
  - `decidir(candidatos, juicios, { reglas, cupo, elegiblesAMano = [] })`: procesa esa lista y devuelve `aMano: { nacional: [...], internacional: [...] }`.
  - El comentario de arriba del archivo: sumar el flujo de "Cómo queda el flujo".
- `ejemplos/dia-de-ejemplo.js`: dos hechos nuevos (ver abajo).
- `ejemplos/demo.js`: pasarle `elegiblesAMano: p.elegiblesAMano` a `decidir`, y las dos salidas nuevas (ver abajo).
- `scripts/leer.js`: una línea más en el embudo (ver abajo).
- `test/nucleo.test.js`: los tests de abajo y el cambio en "día de ejemplo: de punta a punta".

**No se tocan:** cómo se arma `candidatos` (vías A y B), las descartadas de `preparar`, el orden y los topes de las listas de `decidir`, `cupoElegido`, ni el resto de los tests.

**La regla, exacta:**

1. **Quién es elegible** (en `preparar`). Solo un hecho que va a `enObservacion`, o sea: no llegó a `minGrupos`, no entró por la vía B y tiene menos de `ventanaFrescoHoras`. Es elegible si `faltan = minGrupos − gruposIndependientes` está entre 1 y `reglas.aMano.faltanMedios`. Con 5 y 1, es exactamente 4/5. Sin `reglas.aMano`, o con `activa: false`, ninguno es elegible. Si falta `faltanMedios`, vale 1.
2. **Firma.** Con `minFirmas` en 1 (hoy), un hecho con una firma reconocida ya es candidato por la vía B y nunca llega a observación: "sin firma" se cumple solo. Si `minFirmas` sube a 2, una 4/5 con 1 firma queda en observación y **sí** es elegible, porque no entra por la vía B.
3. **El juicio** (en `decidir`). Cada elegible pasa por los mismos controles que un candidato, en el mismo orden y con los mismos textos de motivo: sin juicio (`sin_juicio`, y suma al aviso "N hecho(s) sin juicio de la IA"), criterio 3, 4, 5 y 6. El criterio 2 no se mira: por definición tienen menos de 24 h. Lo que cae va a `descartadas` con un campo más, `aMano: true`.
4. **La lista** (en `decidir`). Los que pasan van a `aMano[bloque]`, ordenados por impacto (mayor primero), después más grupos y después más reciente. **Sin cupo, sin tope por sección ni por país, sin reserva.** Cada uno sale con la misma forma que una noticia de las listas (`id`, `titulo`, `bloque`, `impacto`, `seccion`, `pais`, `gruposIndependientes`, `links`), más `via: 'mano'` y una `etiqueta` que dice "Confirmada por N medios · elegida a mano", con N = `gruposIndependientes`.
5. **No cuentan para nada más.** No entran en `nacionales` ni en `internacionales`, no cambian los avisos del mínimo ni `aviso`.
6. **Sin `elegiblesAMano` en el contexto**, `aMano` es `{ nacional: [], internacional: [] }` y todo lo demás sale idéntico a hoy.

**Ejemplos** (hora de referencia como en los tests; "fresco" es de hace 2 h):

| # | Hecho | `preparar` | `decidir` |
|---|---|---|---|
| 1 | 4 grupos, fresco, sin firma; juicio nacional, todo bien | En observación, `4/5`, `elegibleAMano: true`, está en `elegiblesAMano` | En `aMano.nacional`, etiqueta "Confirmada por 4 medios · elegida a mano". `nacionales` no cambia |
| 2 | 3 grupos, fresco | `3/5`, `elegibleAMano: false`, no está en la lista | Nada |
| 3 | 4 grupos, de hace 30 h | Descartado `no_llego_a_5 (4/5, …)`, como hoy | Nada |
| 4 | 4 grupos + 1 firma reconocida, `minFirmas` 1 | Candidato por la vía B, no está en la lista | Como hoy |
| 5 | El mismo del 4 con `minFirmas` 2 | En observación, `4/5`, `contadorFirmas` `1/2`, `elegibleAMano: true` | — |
| 6 | 3 grupos con `faltanMedios` 2 / 4 grupos con `activa: false` | `elegibleAMano: true` / `false` | — |
| 7 | 2 candidatos nacionales por la vía A + el elegible del 1 | — | `nacionales` tiene 2; sigue el aviso "Nacionales: solo 2 pasaron los filtros (el mínimo es 3). No se baja el estándar para completar."; `aMano.nacional` tiene 1 |
| 8 | El elegible del 1 con `desmentido: true` | — | No está en `aMano`; en `descartadas` con `motivo: 'desmentido (criterio 6)'` y `aMano: true` |
| 9 | El elegible del 1 sin juicio | — | En `descartadas` con `sin_juicio`; aviso "1 hecho(s) sin juicio de la IA…" |
| 10 | 3 de economía ya en `nacionales` + un elegible de economía | — | El elegible está en `aMano.nacional`: los topes no se aplican |

**Tests mínimos:** uno por fila (se pueden juntar las que comparten preparación) y uno para la regla 6 (sin el parámetro, todo igual).

**Día de ejemplo** (`ejemplos/dia-de-ejemplo.js`). Dos hechos inventados:

- Antes del comentario `/* ── Ruido que el criterio 1 saca antes de contar ── */`:
  - Comentario: `// Les falta 1 medio (4 de 5 grupos), sin firma: no entran solas; se pueden elegir a mano.`
  - `hecho('M1', NAC.slice(0, 4), ['Rescataron a tres andinistas perdidos en el cerro Aconcagua', 'Tres andinistas perdidos en el Aconcagua fueron rescatados'], { hace: 2, seccion: 'sociedad', juicio: J({ impacto: 2, seccion: 'sociedad' }) });`
- Antes del comentario `/* ── VÍA B: firma reconocida (segunda línea) ── */`:
  - `hecho('M2', INT.slice(4, 8), ['Chile declaró la emergencia hídrica en cuatro regiones del centro del país', 'Emergencia hídrica en Chile: el Gobierno la declaró en cuatro regiones del centro'], { hace: 2.5, seccion: 'sociedad', juicio: J({ bloque: 'internacional', impacto: 1, seccion: 'sociedad', pais: 'Chile' }) });`

**Test "día de ejemplo: de punta a punta"**, lo único que cambia:

- `decidir` se llama con `{ reglas, elegiblesAMano: p.elegiblesAMano }`.
- `p.resumen.hechos`: de 22 a **24**, con el mensaje "(19 de siempre + 3 de la vía B + 2 a las que les falta 1 medio)".
- La lista de `enObservacion` pasa a: `[['g:IC-1', '2/5'], ['g:M1-1', '4/5'], ['g:M2-1', '4/5'], ['g:N8-1', '1/5'], ['g:O1-1', '3/5']]`.
- Nuevos: `p.resumen.elegiblesAMano` es 2; `ids(d.aMano.nacional)` es `['g:M1-1']`; `ids(d.aMano.internacional)` es `['g:M2-1']`; la etiqueta de M1 es `'Confirmada por 4 medios · elegida a mano'`.
- **Queda igual**, y es la prueba de que no rellena: `internacionales` sigue con 5 (`['g:I1-1', 'g:I6-1', 'g:I4-1', 'g:I2-1', 'g:IB-1']`) aunque M2 esté disponible y el cupo sea 7. También las nacionales, la reserva, las 4 descartadas y `'Hoy: 7 nacionales, 5 internacionales'`.

**Demo** (`ejemplos/demo.js`):

- En el embudo, debajo de `− sin 5 grupos ni firma`: `fila('    les falta 1 medio', r.elegiblesAMano, r.notasEntrada, '→ se pueden elegir a mano');`
- En EN OBSERVACIÓN, al final de la línea de cada elegible: `  ← se puede elegir a mano`.
- Una sección nueva después de INTERNACIONALES: `PARA ELEGIR A MANO (les falta 1 medio; nunca entran solas)`, con dos sublistas, nacionales e internacionales, con el mismo formato de `lista()`. Tiene que mostrar "Rescataron a tres andinistas…" y "Chile declaró la emergencia hídrica…", cada una con "Confirmada por 4 medios · elegida a mano".
- La línea ENTRAN y la de AVISOS no cambian.

**`scripts/leer.js`:** en el embudo, debajo de `− sin 5 grupos ni firma`, la misma línea: `fila('    les falta 1 medio', r.elegiblesAMano, r.notasEntrada, '→ se pueden elegir a mano');`

**Cuándo está listo:** `npm test` en verde. En el `diff` de `npm run demo` cambian solo: "Notas que llegaron" (115 → 123), "Hechos" (22 → 24), "− sin 5 grupos ni firma" (3 → 5), las 2 líneas nuevas de EN OBSERVACIÓN (M1 y M2, con `4/5`) y lo nuevo de arriba (la fila "les falta 1 medio" con 2, las marcas y la sección PARA ELEGIR A MANO). Lo comprobé en la copia, salvo lo nuevo.

## Paso 3 · Qué sacó el criterio 1, y medición

**Código, en `scripts/leer.js`:**

- Opción nueva `--sin-notas-de-servicio`: para esa corrida, `notasDeServicio` queda vacía. Ojo: `reglas` hoy es una copia superficial de `reglasBase`. Hay que armar un `criterio1` nuevo (`{ ...reglasBase.criterio1, notasDeServicio: [] }`), no vaciar el de `reglasBase`.
- Siempre, después de HECHOS SEGÚN EN CUÁNTOS GRUPOS SALIERON, un bloque `CRITERIO 1 · NOTAS SACADAS POR MOTIVO`: una fila por motivo, de mayor a menor (si empatan, por orden alfabético), con la función `fila` que ya existe. El conteo sale de una función exportada `motivosCriterio1(descartadas)` que devuelve `[[motivo, cantidad], ...]` y solo mira las de `tipo: 'nota'`.
- Con `--detalle`, debajo de ese bloque: el portal y el título de cada nota sacada por una regla de título (el motivo empieza con `nota_de_servicio` o contiene `(título `), agrupadas por motivo.
- `README.md`: la opción nueva, en la línea de `npm run leer`.
- `test/leer.test.js`: (1) con `--sin-notas-de-servicio`, `leerOpciones` devuelve `criterio1.notasDeServicio` vacía y `reglasBase.criterio1.notasDeServicio` sigue con 3; (2) `motivosCriterio1` con 3 descartadas de un motivo, 1 de otro y 1 de `tipo: 'hecho'` devuelve `[[el de 3, 3], [el de 1, 1]]`.

**Medición** (con lo guardado; si en el paso 0 no hubo notas ni red, saltéala y decilo):

1. Si hay red: una lectura más, `NODE_USE_ENV_PROXY=1 npm run leer -- --acumular datos/notas.json`, para tener notas frescas y poder contar 4/5.
2. Las dos corridas, **una atrás de la otra** (las dos usan la hora de ese momento):
   - A (antes): `npm run leer -- --acumular datos/notas.json --sin-leer --detalle --sin-notas-de-servicio`
   - B (con los moldes): `npm run leer -- --acumular datos/notas.json --sin-leer --detalle`
3. En el reporte, con datos de B salvo que diga otra cosa:
   - a. **Por molde:** cuántas notas saca y todos los títulos (si son más de 30, los 30 primeros y el total). Revisalos a ojo: si alguno es una noticia de verdad, el molde está mal; corregilo y sumalo como test que tiene que seguir.
   - b. **Las 2 uniones falsas de 3 grupos:** su línea `[N grupos · M notas]` en A y qué pasa en B (desaparecen, bajan de grupos o siguen).
   - c. **Hechos con 4 o más grupos:** la lista en A y en B, con título y cantidad de grupos.
   - d. **Hechos según cuántos grupos (1, 2, 3, 4, 5 o más):** A contra B, en una tabla.
   - e. **Las reglas viejas** `quiniela`, `horoscopo` y `dolar hoy`: cuántas notas saca cada una y sus títulos. Marcá las que sean noticias de verdad.
   - f. **Lo que los moldes no agarran:** entre las notas que **pasan** el criterio 1 en B, cuántos títulos (normalizados) contienen cada una de estas: "a que hora", "donde ver", "como ver", "horario", "un dia como hoy", "santoral", "loteria", "quini", "loto", "baloto", "sorteo". Hasta 10 títulos por cada una. **No sumes moldes**: lo decide el DISEÑADOR.
   - g. **Les falta 1 medio:** `resumen.elegiblesAMano` en B y sus títulos. Si la corrida es más de 24 h después de las lecturas, da 0 porque nada es fresco: anotalo, no es un error.
   - h. **La Lotería del Cauca y los otros países:** de qué feed salió esa nota y su URL. Además, de las notas de `infobae.com` en el archivo, cuántas hay por primer tramo de la ruta (`/colombia/`, `/mexico/`, `/america/`, `/politica/`…), los 10 más frecuentes. Si la lotería salió de otro feed, lo mismo para ese feed. Es para saber si mezcla ediciones de otros países, como el del Cronista. **No agregues `excluirRutas`.**
   - i. Cuántas notas tiene el archivo, desde y hasta qué hora, y a qué hora corriste A y B.

Para f y h usá un script de una sola vez fuera del repo (por ejemplo en `/tmp`): no se commitea. Las salidas completas de A y B tampoco van al repo (son textos de los medios): solo lo que pide la lista.

## Paso 4 · Documentos y cierre de tanda

- `CLAUDE.md`:
  - "Lo que Alejo pidió el 2026-10-04", ítem "Dos ideas sin resolver": la idea (1) pasa a **"descartada por Alejo el 04-10-2026: la verificación queda en 5 grupos fijos. Sin peso por portal, sin umbral de puntaje y sin segunda página automática con 'Confirmada por 4 medios'."** La (2) queda como está.
  - En la misma sección, dos ítems nuevos: la excepción a mano para una 4/5 (decidió Alejo, carta del DISEÑADOR `a`; los detalles son valores por defecto del DISEÑADOR; hecho en el núcleo, la vista espera el diseño de la entrega) y las notas de servicio con plantilla (decidió Alejo; 3 moldes en `criterio1.notasDeServicio`; no decide deportes).
  - "Decisiones que solo Alejo puede tomar": sacar "excepción manual para una 4/5".
  - "Estado": tests al día, los moldes, `aMano` y el flujo nuevo (la IA juzga `candidatos` y `elegiblesAMano`).
  - El resultado de la medición, corto (tabla d y lo que pasó con las 2 uniones falsas), y "Siguiente paso".
- `README.md`: tests al día (dice 69); en "Cómo funciona", que `decidir` devuelve también `aMano`; en "Dónde se cambian las reglas", `notasDeServicio` y `aMano`; en "Límites conocidos", el umbral es 0,3 y ya se midió con datos reales.
- `buzon/pendientes.md`:
  - A Hecho: los moldes de servicio, la pieza del núcleo de la 4/5 y la medición con los moldes.
  - En "Diseñar la entrega" (DISEÑADOR), agregar: "incluye la vista de las 4/5 ('En observación · les falta 1 medio' con 'Llevármela igual'); el núcleo ya da `aMano` por bloque".
  - En "Cuántas noticias da la regla de 5 en un día real", agregar: "las 4/5 que se ofrecerían salen de `resumen.elegiblesAMano`".
  - Nuevos en DISEÑADOR, con los números de tu medición:
    - "Reglas viejas de título (`quiniela`, `horoscopo`) sueltas: sacan cualquier título con esa palabra, también noticias de verdad (ej.: 'Detienen al dueño de una agencia de quiniela'). ¿Se vuelven precisas como los moldes nuevos? Valor por defecto: quedan como están."
    - "Variantes de servicio que los moldes no agarran (dónde ver, a qué hora corre, Quini 6, un día como hoy…): ¿se suman? Valor por defecto: no."
    - Si en (h) Infobae trae ediciones de otros países: "¿Se excluyen esas rutas como en el Cronista? Valor por defecto: no."
    - "Caso borde: una 4/5 que entra por la vía B pero cuya firma no vale para su bloque se descarta y no se ofrece a mano. Solo pasa con `firmas.json` llena. Valor por defecto: así."
- Reporte `ClaudeCode_para_PREPARADOR_2026-10-04_j.md`, con el formato de siempre, la tabla de tests antes y después, y la medición. Después `npm run paquete`, commit y push.

## Qué NO se hace en esta ronda

- La vista de la 4/5 y la función que la mete en el paquete de quien la elige: capa 5, espera el diseño de la entrega.
- Tocar `quiniela` u `horoscopo`, sumar moldes nuevos o excluir rutas de Infobae: solo se miden.
- LN+, la memoria de lo ya entregado, la capa 4, la IA que juzga, la lista blanca, `firmas.json` y deportes.

## De quién es cada decisión y qué se usa mientras tanto

| Tema | Quién decide | Valor en esta ronda |
|---|---|---|
| Verificación: 5 grupos fijos, sin cálculo | Alejo (decidido) | `minGrupos` 5 |
| Excepción a mano para una 4/5 | Alejo (decidido: sí, a mano y marcada) | — |
| Qué se puede elegir: solo a las que les falta 1 | DISEÑADOR | `aMano.faltanMedios` 1 |
| Etiqueta | DISEÑADOR | "Confirmada por N medios · elegida a mano" |
| Pasan por la IA y los criterios 3 a 6, sin cupo ni topes | PREPARADOR | así |
| Una 4/5 con firma que no alcanza (si `minFirmas` sube a 2) | PREPARADOR | es elegible |
| Notas de servicio afuera | Alejo (decidido) | 3 moldes |
| Dónde mira cada molde | PREPARADOR | partido: en cualquier parte; efemérides y lotería: al principio |
| Lotería: solo la palabra "lotería" | DISEÑADOR | Quini 6, Loto y "sorteo" solo quedan afuera; se cuentan |
| Motivo en lo descartado | DISEÑADOR | `nota_de_servicio (<nombre>)` |
| Deportes | Alejo | sin cambios |

## Pasos, en orden

1. `git pull`. Guardar esta carta y la del DISEÑADOR en `buzon/`. Commit. Paso 0.
2. Paso 1, `npm test`, `diff` de la demo (igual), commit.
3. Paso 2, `npm test`, demo con las líneas nuevas, commit.
4. Paso 3 (código), `npm test`, commit. Medición.
5. Paso 4, reporte `j`, `npm run paquete`, commit y push.
