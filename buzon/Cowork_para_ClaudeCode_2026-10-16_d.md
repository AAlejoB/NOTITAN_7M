# Cowork → Claude Code · 16-10-2026 · 19:45 (hora de Argentina) · letra d

Responde a tu reporte `ClaudeCode_para_Cowork_2026-10-16_c.md` (Fase A del bloque «Avisos»). **Alejo aprobó la Fase A** (16-10, 19:30) y decidió los 4 puntos de «Lo que vi en la vuelta real». Esta carta trae esos 4 ajustes (pasos 1 a 4) y la **Fase B** (paso 5: los avisos en la capa 4). Base: el commit en que quedó tu reporte `c` (`63a1a3e`, «paquete para Cowork»); `git pull` antes de empezar.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-16_d.md`. Un solo reporte al final: `buzon/ClaudeCode_para_Cowork_2026-10-16_d.md`. Si la vuelta real de ese momento no trae ningún aviso, los ejemplos de abajo se prueban igual en los tests.

| Paso | Qué cambia | Archivos que se tocan |
|---|---|---|
| 1 | Un aviso de un portal provincial entra solo si el título nombra Comodoro o Rada Tilly | `src/avisos.js`, `scripts/vuelta.js`, `test/avisos.test.js`, `test/vuelta.test.js` |
| 2 | Programado o avería: manda el título; el cuerpo desempata solo si el título no dice nada | `src/avisos.js`, `test/avisos.test.js` |
| 3 | «Se normaliza / se restablece el servicio» entra como aviso «se normalizó», en verde, al final del bloque | `config/reglas.json`, `src/avisos.js`, `pagina/index.html`, `pagina/logica.js`, `test/avisos.test.js`, `test/logica.test.js`, `scripts/probar-pagina.js` |
| 4 | Una excepción del cronograma reemplaza el corte normal de esa zona en esa semana | `src/avisos.js`, `config/zona/cronograma-agua.json` (solo el `_aviso`), `test/avisos.test.js` |
| 5 | Fase B: los avisos en la capa 4 | `src/capa4.js`, `n8n/vuelta.json`, `n8n/LEEME.md`, `test/capa4.test.js`, `test/n8n.test.js`, `docs/INSTALAR_EN_EL_SERVIDOR.md` |
| 6 | Documentos | `README.md`, `CLAUDE.md`, `docs/CORRER_EN_MI_COMPU.md`, `docs/PAQUETE_DE_CLIENTE.md`, `buzon/pendientes.md`, reporte, paquete |

**No se tocan:** `src/nucleo.js`, `src/zona.js`, `src/provisorio.js`, `src/ia.js`, `src/lector.js`, `src/entrega.js` (el bloque `avisos` ya le llega armado), `scripts/servir.js`, `scripts/usuario.js`, `scripts/medir.js` (un «se normalizó» cuenta como aviso vigente, nada que cambiar), `config/feeds.json`, `config/portales.json`, `config/firmas.json`, `config/zona/feeds.json`, `config/zona/portales.json`, `config/zona/reglas.json`, `config/zona/avisos.json`, `.gitignore`, `.github/`, los `buzon/LEEME*.md`, las cartas y reportes viejos, las capturas viejas.

**Regla de toda la ronda (la misma de la carta `c`):** nada de lo que sale de la SCPL ni de los portales entra al repo. En el reporte van títulos, fechas, horarios y barrios, nunca cuerpos enteros.

## Qué decidió Alejo y qué es valor por defecto

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Fase A aprobada tal como está en las capturas del 16-10 | Alejo (16-10, 19:30) | — |
| Punto 1: **lo local manda, lo provincial suma solo cuando nombra el lugar.** Las notas de portales con `"zona": "local"` entran a Avisos como hoy; las de un portal `"provincial"` (hoy El Chubut) entran **solo si el título dice Comodoro o Rada Tilly**. Porqué de Alejo: es la misma lógica de los anillos; una familia de Comodoro no puede leer un corte de Puerto Madryn como propio | Alejo (16-10, 18:58; preguntó si se podían combinar A y B y eligió esto, que es B) | paso 1 |
| Que la condición sea **el título** (no la bajada) | Cowork (valor por defecto; el título es lo que ya mira `esAviso`) | paso 1 |
| Punto 2: **manda el título.** Si el título dice «avería» (o «programado»), eso es; el cuerpo desempata solo si el título no dice ni una cosa ni la otra. Porqué de Alejo: el título es lo que la SCPL eligió para resumir el corte; el cuerpo siempre dice «tareas» porque toda avería se repara con tareas («lo que dice el cartel pesa más que la letra chica») | Alejo (16-10, 19:02: «propuesta siiii») | paso 2 |
| Punto 3: **opción B.** «Se normaliza» entra como aviso aparte, en verde, con link. Porqué de Alejo: una familia quiere saber que volvió; es una línea en el molde. La opción C (que la tarjeta del corte cambie sola a «se normalizó») queda para la etapa 2, con la IA que empareja comunicados | Alejo (16-10, 19:17) | paso 3 |
| Un «se normalizó» vive **6 horas** desde que se publicó y va **al final** del bloque, después de los cortes | Cowork (valor por defecto: un «volvió el agua» de hace 3 días es ruido; `horasNormalizado` en `config/zona/avisos.json` no se agrega: es una constante en `src/avisos.js` hasta que haga falta moverla) | paso 3 |
| Punto 4: **una excepción del cronograma reemplaza el corte normal de esa zona en esa misma semana**, no se suma. Porqué de Alejo: lo lógico de la SCPL es que en Nochebuena nadie se quede sin agua, así que el corte del miércoles 24 se corre al jueves 25 a la mañana; dos cortes de 24 h seguidos no tienen sentido («si te cambian el turno de día, no tenés dos turnos»). Alejo cree recordar que esta última Navidad el 24 no cortaron; se confirma cuando salga el cuadro 2026-2027 | Alejo (16-10, 19:32) | paso 4 |
| Si la SCPL alguna vez **suma** un corte en vez de moverlo, se escribe en el archivo con `"suma": true` en esa excepción | Cowork (valor por defecto) | paso 4 |
| Fase B como la describe la carta `c` (tres nodos nuevos entre `Bajar` y `Preparar`) | Cowork (valor por defecto, ya estaba en la carta `c`) | paso 5 |

## Paso 1 · Lo provincial entra solo si nombra el lugar

Hoy `scripts/vuelta.js` aparta de la zona toda nota cuyo título pasa `esAviso` (línea «Las notas de la zona que son avisos de cortes…»), sin mirar de qué portal es. Cambia así:

- En `src/avisos.js`, una función pura nueva, `esAvisoDeAca(nota, { reglas, portales })`: devuelve `true` si `esAviso(nota.titulo, reglas)` **y** (el portal de la nota tiene `"zona": "local"` en `portales`, **o** el título normalizado contiene `comodoro` o `rada tilly` como palabra). El portal se busca por el dominio del link de la nota, igual que hace `src/zona.js` (`buscarPortal(dominioDe(n), portales)`); si no se encuentra el portal, cuenta como no local (entra solo si nombra el lugar). Se exporta.
- `scripts/vuelta.js` usa `esAvisoDeAca(n, { reglas: zona.reglas, portales: zona.portales })` en lugar de `esAviso(n.titulo, zona.reglas)`. **Lo que no pasa `esAvisoDeAca` se queda en la zona y sigue a la verificación como cualquier nota** (la nota de Puerto Madryn vuelve a ser una nota de El Chubut para el anillo Chubut, nada más).
- `esAviso` no cambia: lo usan los tests de los 16 títulos y la SCPL (la SCPL no pasa por `esAvisoDeAca`: sus comunicados son siempre de acá).

Ejemplos (todos con `config/zona/portales.json` tal como está):

| | Título | Portal | ¿A Avisos? |
|---|---|---|---|
| E1 | Mañana habrá corte programado de energía en zona norte | El Chubut (provincial, nota de `/puerto-madryn/`) | **No** (es el caso real del 16-10) |
| E2 | Corte de agua en 23 barrios de Comodoro por avería en el acueducto | El Chubut (provincial) | Sí (dice Comodoro) |
| E3 | Mañana habrá corte programado de energía en zona norte | El Patagónico (local) | Sí (es local, no hace falta que lo nombre) |
| E4 | Corte de luz en Rada Tilly por tareas de mantenimiento | El Chubut (provincial) | Sí (dice Rada Tilly) |
| E5 | Corte de agua en zona sur de Trelew | El Chubut (provincial) | No (y tampoco pasa `esAviso`: no nombra ningún lugar del molde) |

## Paso 2 · Programado o avería: manda el título

- `datosDeAviso(texto, { fechaPublicacion, cfg, titulo })` recibe además el **título solo** (opcional: si no viene, se comporta como hoy, así nada viejo se rompe). Con `titulo`: `programado` = `programadoDe(titulo)`; si eso da `null`, `programadoDe(texto)` (título + cuerpo, como hoy).
- Los dos lugares que llaman a `datosDeAviso` (la SCPL en `notaDeScpl` y las notas de portales en `armarAvisos`) le pasan `titulo`.
- `programadoDe` no cambia sus palabras.

| | Título | Cuerpo dice | Hoy | Después |
|---|---|---|---|---|
| E6 | CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR AVERÍA EN EL ACUEDUCTO DEL ‘99 | «tareas de reparación» | `null` (gris, «Agua») | **`false`** (naranja, «Agua · avería») |
| E7 | CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR TAREAS PROGRAMADAS DE MANTENIMIENTO | «falla» en una frase del medio | `null` | **`true`** («Agua · programado») |
| E8 | CORTE DE AGUA EN UN SECTOR DE ZONA NORTE | «por una avería en la cañería» | `false` | `false` (el título no dice nada, desempata el cuerpo) |
| E9 | CORTE DE AGUA EN UN SECTOR DE ZONA NORTE | «por mantenimiento … tras la falla de ayer» | `null` | `null` (ni el título ni el cuerpo desempatan: sigue gris) |

## Paso 3 · «Se normalizó», en verde, al final

**El molde.** En `cortes.molde` de `config/reglas.json`, la segunda condición (la de `corte|cortes|…|restablec\w*|…`) suma `normaliz\w*`. Con eso «SE NORMALIZA EL SERVICIO DE AGUA EN COMODORO TRAS LAS TAREAS…» pasa `vale` y `esAviso` (ya tiene «agua» y «Comodoro»).

**El dato nuevo.** `datosDeAviso` devuelve además `normalizado`: `true` si el título normalizado contiene `normaliz\w*` o `restablec\w*` **y no contiene** ninguna palabra de corte (`corte|cortes|cortan|cortaran|cortaron|cortara|cortado|cortada|interrupcion|interrumpe|sin (agua|luz|energia|gas)`); si no, `false`. Así «CORTE DE AGUA … HASTA QUE SE RESTABLEZCA» sigue siendo un corte.

**En `armarAvisos`:**
- Un aviso con `normalizado: true` vive **6 horas** desde `fechaPublicacion` (constante `HORAS_NORMALIZADO = 6` en `src/avisos.js`), no las 72 ni las 12 después del fin.
- Va **después de todos los cortes** (orden del bloque: cortando ahora → lo que viene → sin día → se normalizó), y entre ellos el más nuevo primero.
- No se agrupa con el corte al que responde (eso es la opción C, etapa 2). Sí se agrupan entre sí dos «se normalizó» del mismo servicio y zona (con `agrupar`, como el resto).
- `etiquetaDeAviso` devuelve `«Agua · se normalizó»` (el servicio con mayúscula, como las otras).

**En la página:**
- La pastilla de un aviso con `normalizado: true` es **verde llena** (como «Recién confirmada»: `background: var(--verde)`, texto blanco), para que no se confunda con el verde claro de «programado». Clase nueva `sello lleno`.
- La línea de datos dice «Se normalizó el servicio · <día y hora de publicación, como «Jueves 16/10 · 14:30»>», sin barrios ni duración aunque los traiga.
- Lo que se copia: `Se normalizó el servicio de agua en <zona o «Comodoro» si no hay zona> · <fuentes>`.
- `scripts/probar-pagina.js`: 3 comprobaciones nuevas (la pastilla llena, la línea, lo copiado), con una nota inventada en la lista de prueba.

| | Título (SCPL o portal) | `normalizado` | Pastilla | Vive |
|---|---|---|---|---|
| E10 | SE NORMALIZA EL SERVICIO DE AGUA EN COMODORO TRAS LAS TAREAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS | `true` | 🟩 Agua · se normalizó (verde llena) | 6 h desde que se publicó |
| E11 | Se restableció la luz en Rada Tilly tras el hecho vandálico | `true` | 🟩 Luz · se normalizó | 6 h |
| E12 | CORTE DE AGUA EN ZONA SUR HASTA QUE SE RESTABLEZCA EL SUMINISTRO | `false` | como hoy (es un corte) | como hoy |
| E13 | Vecinos reclaman que se normalice el agua en Km 8 | `true` (pasa el molde: «normalice» en la condición 2, «agua» en la 3, «km 8» en la 4; y no tiene palabra de corte) | 🟩 Agua · se normalizó | 6 h |

E13 es el precio de la opción B: un reclamo puede salir como «se normalizó». Lo acepto por esta ronda (sale en verde, con link, 6 horas); si en la vuelta real aparece un caso así, ponelo en el reporte y Cowork ajusta el molde (por ejemplo, pidiendo que «normaliz» y «servicio» vayan juntos). No lo arregles vos ahora.

## Paso 4 · Una excepción del cronograma reemplaza, no suma

En `cortesDelCronograma`:

- Para cada zona, una excepción con fecha `F` **reemplaza el corte normal de esa zona más cercano a `F` dentro de la misma semana** (lunes a domingo). Si hay dos a la misma distancia, el anterior. Si la zona no tiene ningún corte normal esa semana, la excepción solo se suma.
- Si la excepción trae `"suma": true`, no reemplaza nada: se suma.
- Si `F` cae en un día que ya es normal para esa zona, el reemplazo es sobre sí mismo (solo cambia la hora), como hoy.
- La ventana «ayer, hoy y mañana» se aplica **después** de resolver los reemplazos de la semana (si no, el miércoles 24 se dibujaría igual porque el jueves 25 todavía no entra en la ventana).

En `config/zona/cronograma-agua.json` solo cambia el texto de `_aviso` (una frase: «Una excepción reemplaza el corte normal de su zona más cercano en la misma semana; con "suma": true se agrega en vez de reemplazar»). Las 4 excepciones quedan como están.

Con el archivo tal como está (2025-2026):

| | Hoy (en la vuelta de ese día) | Zona Sur y Central hoy | Zona Sur y Central después |
|---|---|---|---|
| E14 | martes 23-12-2025 | nada (mañana es el miércoles 24: 1 aviso, mié 24 18:00) | **nada** (el 24 fue reemplazado por el jueves 25, que no está en la ventana) |
| E15 | miércoles 24-12-2025 | mié 24 18:00 | **jue 25 08:00** (mañana) |
| E16 | jueves 25-12-2025 | mié 24 18:00 (ayer, sigue cortando) **y** jue 25 08:00 | **solo jue 25 08:00** |
| E17 | martes 30-12-2025, Zona Norte | mar 30 12:00 (la excepción cambia la hora) | igual: mar 30 12:00 |
| E18 | miércoles 31-12-2025 | mié 31 18:00 | **jue 1-1 08:00** |

## Paso 5 · Fase B: los avisos en la capa 4

Como dice la carta `c`:

- `src/capa4.js`: `mitadUno` recibe además `avisos` (o `null`): `{ listadoHtml, notasHtml: [{ id, titulo, fecha, html }] }`, lo que bajó n8n, y usa `leerListadoScpl`, `leerNotaScpl` y `notasParaBajar` de `src/avisos.js` (nada se reescribe). `guardado.avisos` guarda las notas bajadas, 30 días, con la misma forma que `datos/zona/avisos.json` de `scripts/vuelta.js` (así las dos corridas se pueden comparar a ojo). Como las notas nuevas se saben recién después de leer el listado, hace falta una función pura más, `notasQueFaltan({ listadoHtml, guardado, ahora, cfg, reglas })` → `[{ id, titulo, fecha, url }]`, que n8n llama entre bajar el listado y bajar las notas; ponela en `src/capa4.js` (o exportá lo que haga falta de `src/avisos.js`: vos decidís, pero una sola función hace el trabajo y los dos caminos, `vuelta.js` y n8n, usan la misma).
- `mitadDos`: aparta de la zona las notas que pasan `esAvisoDeAca` (paso 1), arma los avisos con `armarAvisos` (con `cronograma` de `config/zona/cronograma-agua.json`, cargado por `cargarConfig` igual que en `vuelta.js`) y se los pasa a `armarEntrega`. La línea suma `cortes` con la misma forma que en `vuelta.js` (`listados`, `bajadas`, `apartadas`, `vigentes` y `urls` por aviso).
- `n8n/vuelta.json`: tres nodos nuevos entre `Bajar` y `Preparar`: `Bajar listado` (HTTP, el `listado` de `config/zona/avisos.json`), `Avisos` (Code: `notasQueFaltan`), `Bajar notas` (HTTP, una por item; `maxNotasPorVuelta` ya limita). 13 nodos en total. Si `configZona` está vacío o la carpeta no trae `avisos.json`, los tres nodos no hacen nada y la vuelta sigue como hoy. Si la SCPL no responde, la vuelta sigue sin avisos y la línea lo dice («Fuente de avisos sin leer: SCPL (…)»), como en `vuelta.js`.
- `n8n/LEEME.md` y `test/n8n.test.js`: el nodo nuevo, el conteo de nodos, el orden.
- `docs/INSTALAR_EN_EL_SERVIDOR.md`: una línea que diga que el bloque Avisos no necesita configurar nada (la fuente está en `config/zona/avisos.json`) y que el cronograma lo actualiza Alejo en `config/zona/cronograma-agua.json`.
- Probalo como la carta `b`: dos vueltas del reloj en tu n8n con la IA falsa; en la segunda, la SCPL no vuelve a bajar lo que ya bajó.

| | Qué pasa en la vuelta de n8n | Qué sale |
|---|---|---|
| E19 | Primera vuelta con `configZona = config/zona`: el listado trae 2181 comunicados, 2 de los últimos 7 días valen y no están guardados | `Bajar notas` baja 2; `lista.json` arranca con `avisos` (los vigentes); la línea trae `cortes.bajadas: 2` |
| E20 | Segunda vuelta, 30 minutos después, mismo listado | `Bajar notas` baja 0; los mismos avisos vigentes; `cortes.bajadas: 0` |
| E21 | `configZona` vacío | sin nodos de avisos activos; `lista.json` como antes de esta carta (sin `avisos`) |
| E22 | La SCPL da 500 en `Bajar listado` | la vuelta termina igual; `cortes.lectura` con la fuente caída; la línea con «Fuente de avisos sin leer: SCPL (500)» |

## Orden

1. Pasos 1 a 4, cada uno con sus tests, un commit por paso.
2. Una vuelta real con `npm run vuelta -- --zona config/zona` y las 3 capturas de `buzon/capturas/` con el nombre `pagina-real-2026-10-<día>-d-<ancho>.png`.
3. Paso 5, probado en tu n8n.
4. Paso 6, reporte, paquete, push.

## Cuándo está listo (comprobalo y ponelo en el reporte)

1. `npm test` en verde, antes y después (los 16 títulos de la carta `c` siguen pasando, más los de E1 a E13).
2. `npm run probar-pagina` en verde, antes y después.
3. La vuelta real: el renglón «Avisos: …» y cada aviso vigente con servicio, programado o avería (**la 2902 tiene que salir «avería» si sigue vigente**), día, horario, zona, barrios y fuentes; y **cuántas notas de portales se apartaron y cuáles no por ser provinciales sin nombrar el lugar** (el caso de Puerto Madryn tiene que figurar como «no apartada»).
4. Los últimos 20 comunicados de la SCPL con `vale`, como en el reporte `c`: «SE NORMALIZA…» tiene que dar `true`.
5. E14 a E18 en `test/avisos.test.js` con el reloj fijo.
6. Las dos vueltas de n8n (E19 y E20) con sus números.

## Qué va en tu reporte

Lo de siempre (qué cambió por paso con commit, tests antes y después, qué decidiste por tu cuenta y por qué), los números de los puntos 3 a 6, y si en la vuelta real salió algún «se normalizó» que no lo sea (E13).
