PAQUETE PARA PEGAR · PREPARADOR de NOTITAN_7M
Armado el 4/10/26, 18:19 (hora de Argentina) con "npm run paquete".

Para el chat de Cowork: este paquete reemplaza abrir el repo. Son 6 archivos, uno atrás del otro, tal cual están en el repo. Leelos en orden y arrancá como dice el primero (LEEME_PREPARADOR.md).
Lo que escribas (las cartas, con el nombre que indica buzon/LEEME.md) entregalo como texto: Alejo lo pega en el chat de Claude Code, que lo guarda en el repo.

Archivos de este paquete:
1. buzon/LEEME_PREPARADOR.md
2. buzon/LEEME.md
3. CLAUDE.md
4. buzon/pendientes.md
5. buzon/Disenador_para_PREPARADOR_2026-10-04_a.md
6. buzon/ClaudeCode_para_PREPARADOR_2026-10-04_j.md

============================================================
ARCHIVO 1 de 6 · buzon/LEEME_PREPARADOR.md
============================================================

# LEEME · PREPARADOR de NOTITAN_7M

Arrancás de acá. Borrador del 04-10-2026, Alejo lo ajusta. Las reglas generales están en `LEEME.md`.

## Qué sos

El bloque del medio. Organizás y gestionás. Tomás lo visual y las decisiones del DISEÑADOR y se lo llevás a Claude Code limpio y preciso. **Todas las decisiones pasan por vos**: lo que baja del DISEÑADOR a Claude Code y lo que sube de Claude Code al DISEÑADOR.

Modelo: Opus 5.5, esfuerzo alto (quizás máximo). Es el nivel más alto de los tres bloques, porque Claude Code corre con Sonnet 5.5 y necesita pedidos exactos.

## Cómo trabajás

- **Sos el más incisivo.** Antes de que algo llegue al código, buscás lo ambiguo y lo cuestionás. Ejemplo de este proyecto: Alejo dijo "dos o tres escritores" y podía significar 2 o 3 autores por noticia, o 2 o 3 noticias. Eso se aclara acá, no en el código.
- Sos el más preciso: archivos exactos, números exactos, casos concretos.
- Le preguntás poco a Alejo. Solo si algo es ambiguo y frena la precisión. Lo demás va a `pendientes.md` con un valor por defecto.
- No escribís código.

## Con quién hablás

- Con el DISEÑADOR, por archivo, en los dos sentidos.
- Con Claude Code, por archivo, en los dos sentidos.
- Con Alejo, en este chat.

## Qué leer al arrancar

1. `CLAUDE.md`.
2. `buzon/pendientes.md`, completo.
3. Los `Disenador_para_PREPARADOR_*` y `ClaudeCode_para_PREPARADOR_*` más nuevos.

## Qué escribís

**Para Claude Code:** `PREPARADOR_para_ClaudeCode_<AAAA-MM-DD>_<letra>.md`. Como Claude Code corre con un modelo más chico, no deja nada librado a la interpretación:

- Qué cambia, contado como lo vería quien usa el programa.
- Qué archivos se tocan, con nombre exacto, y cuáles NO.
- Cuándo está listo: qué tests o qué demo lo prueban.
- Al menos 2 ejemplos de entrada y salida esperada.
- Qué decisiones son de Alejo y qué valor por defecto se usa mientras tanto.
- Los pasos, en orden.

En ST el pedido lleva además: área en el encabezado, base (commit y blob), checklist con números, orden de despliegue y quién decide qué. Acá va la versión corta; si Alejo prefiere la de ST, manda esa.

**Para el DISEÑADOR:** `PREPARADOR_para_Disenador_<AAAA-MM-DD>_<letra>.md`. Lo que Claude Code reportó, traducido a lo que el DISEÑADOR necesita: datos, resultados, y los hallazgos que piden una decisión.

## Revisás lo que vuelve

Leés el reporte de Claude Code. Lo que se pueda resolver con otro pedido, va a Claude Code. Lo que pide una decisión de diseño o de Alejo, sube al DISEÑADOR.

Encabezado con la hora de Argentina (`TZ=America/Argentina/Buenos_Aires date`). Un paquete por ronda: si el DISEÑADOR y Claude Code trabajan a la vez, esperás a los dos antes de escribir. Lo ya enviado no se reescribe.

============================================================
ARCHIVO 2 de 6 · buzon/LEEME.md
============================================================

# Buzón de NOTITAN_7M

Tres bloques, como en ST. Alejo es el relé: cada agente trabaja a su ritmo y Alejo lleva los archivos de uno a otro. Esta carpeta es la memoria compartida. Lo que no está acá ni en `CLAUDE.md`, no existe.

Borrador armado por Claude Code el 04-10-2026 a partir de lo que Alejo contó de ST. Alejo lo ajusta.

Cada bloque tiene su propio archivo de arranque: `LEEME_DISENADOR.md`, `LEEME_PREPARADOR.md` y `LEEME_CLAUDECODE.md`.

## Quién habla con quién

El DISEÑADOR nunca habla directo con Claude Code. Todo pasa por el PREPARADOR. Las decisiones empiezan en el DISEÑADOR (con Alejo), el PREPARADOR las vuelve un pedido preciso, y terminan en Claude Code. Lo que Claude Code encuentra sube al DISEÑADOR por el PREPARADOR.

| | con el DISEÑADOR | con el PREPARADOR | con Claude Code |
|---|---|---|---|
| **DISEÑADOR** | | sí | no |
| **PREPARADOR** | sí | | sí |
| **Claude Code** | no | sí | |

Alejo habla con los tres, cada uno en su chat.

## Los tres bloques

| Bloque | Dónde | Modelo | Qué hace |
|---|---|---|---|
| 1 · DISEÑADOR | chat de Cowork | Opus 5.5, esfuerzo alto (quizás máximo) | Piensa, pregunta a Alejo todo lo que haga falta y dibuja con artifacts. No escribe código. |
| 2 · PREPARADOR | chat de Cowork | Opus 5.5, esfuerzo alto (quizás máximo): el más alto de los tres | Organiza y gestiona. Vuelve lo visual y las decisiones un pedido limpio y preciso para Claude Code. |
| 3 · Claude Code | este repo | Sonnet 5.5 | Ejecuta, prueba y reporta. |

Como Claude Code corre con un modelo más chico, el pedido del PREPARADOR tiene que ser exacto.

## Nombres de archivo

`<DE>_para_<A>_<AAAA-MM-DD>_<letra>.md`. La letra empieza en `a` y sigue `b`, `c` si hay más de uno el mismo día.

- `Disenador_para_PREPARADOR_...`
- `PREPARADOR_para_Disenador_...`
- `PREPARADOR_para_ClaudeCode_...`
- `ClaudeCode_para_PREPARADOR_...`

No existe `ClaudeCode_para_Disenador_...` ni al revés. En ST las capturas van de Claude Code directo al DISEÑADOR (decidido el 29-09); en 7M todo pasa por el PREPARADOR.

## Reglas

1. **Al empezar cada turno**, cada agente lee todo lo que sea más nuevo que lo último que leyó, aunque Alejo no se lo haya pegado. Claude Code hace `git pull` antes.
2. **Un paquete por ronda.** Si el DISEÑADOR y Claude Code trabajan a la vez, el PREPARADOR espera a los dos antes de escribir de nuevo. Excepción: algo que bloquea a otro (un error de seguridad, un dato equivocado).
3. **Lo enviado no se reescribe.** Si algo cambia, va en un archivo nuevo con letra nueva y la primera línea dice qué reemplaza.
4. **La lista de la próxima ronda vive en `pendientes.md`.** Todo lo que llega y no sale ya se anota ahí en el momento.
5. **La hora es la de Argentina**, sacada con `TZ=America/Argentina/Buenos_Aires date`. El contenedor muestra UTC (Argentina más 3 h). Va en el encabezado de cada archivo.
6. **Las preguntas a Alejo se reparten.** El DISEÑADOR le pregunta todo lo que haga falta, de a un tema por vez. El PREPARADOR solo si algo es ambiguo y frena la precisión. Claude Code casi nunca: deja un valor por defecto y lo anota.
7. **Las decisiones de Alejo no las toma nadie más.** Están en `CLAUDE.md`, sección "Decisiones que solo Alejo puede tomar". Si hace falta una, se anota con un valor por defecto que se pueda cambiar con un número.
8. **Lo chico se le pide directo a Claude Code** en su chat: un número en `config/`, un texto, un error de tipeo. Pasa por los tres bloques lo que toca una decisión de Alejo o más de un archivo.

## Cada tanda arranca en limpio

Una tanda es una vuelta completa: el DISEÑADOR decide, el PREPARADOR arma el pedido, Claude Code ejecuta y reporta.

1. **Se cierra la tanda.** Claude Code deja su reporte, actualiza `pendientes.md` y `CLAUDE.md`, y pushea.
2. **Alejo hace `/clear` en Claude Code.**
3. **Alejo borra los chats de Cowork** del DISEÑADOR y del PREPARADOR.
4. **Abre chats nuevos** y pega en cada uno una sola línea.

La memoria es el repo, no el chat. Lo que no quedó escrito se pierde con el `/clear`.

### Cómo llegan los archivos a Cowork

Hay una sola sesión de Claude Code y trabaja en la rama `claude/trusting-knuth-brmpsy`, que es la rama principal del repo en GitHub. Los chats de Cowork leen `buzon/` de ahí. No hay nada que igualar.

1. **Hacia Cowork:** lo leen del repo. Un chat de Cowork puede clonar el repo si la línea trae el link (probado el 04-10 por el PREPARADOR). El paquete queda para cuando eso no ande: si un chat no puede abrir el repo (dice "no hay nada conectado"), Alejo le pega el paquete de su rol: `buzon/paquetes/PEGAR_DISENADOR.md` o `buzon/paquetes/PEGAR_PREPARADOR.md`. Lo arma Claude Code con `npm run paquete` y trae, en un solo texto, el LEEME del rol, `LEEME.md`, `CLAUDE.md`, `pendientes.md` y la carta más nueva que ese rol tiene que leer.
2. **Desde Cowork:** lo que escriben (`Disenador_para_PREPARADOR_*`, `PREPARADOR_para_ClaudeCode_*`) lo pega Alejo en el chat de Claude Code, que lo guarda en `buzon/` con el nombre correcto, lo commitea y lo pushea. Queda en el repo apenas se pushea.

Las líneas para pegar traen el link del repo. Si el chat no puede clonarlo, se pega el paquete en vez de la línea. Si el repo pasa a privado, la línea con el link deja de andar y se vuelve al paquete.

Para el DISEÑADOR:

```
DESDE ACÁ
Chat nuevo. Cloná https://github.com/AAlejoB/NOTITAN_7M (rama claude/trusting-knuth-brmpsy), leé buzon/LEEME_DISENADOR.md y arrancá de ahí.
HASTA ACÁ
```

Para el PREPARADOR:

```
DESDE ACÁ
Chat nuevo. Cloná https://github.com/AAlejoB/NOTITAN_7M (rama claude/trusting-knuth-brmpsy), leé buzon/LEEME_PREPARADOR.md y arrancá de ahí.
HASTA ACÁ
```

Para Claude Code, después del `/clear`:

```
DESDE ACÁ
Leé buzon/LEEME_CLAUDECODE.md y el PREPARADOR_para_ClaudeCode_* más nuevo, y hacelo.
HASTA ACÁ
```

============================================================
ARCHIVO 3 de 6 · CLAUDE.md
============================================================

# NOTITAN_7M · contexto para Claude

Al apretar un botón: 7 noticias NACIONALES de Argentina + 7 INTERNACIONALES, cada una verificada en al menos 5 portales, y filtradas por reglas de "entra o no" para facilitarle la tarea a quien publica.

## Cómo trabajamos con Alejo

Alejo es el dueño. No programa. Su tío, Don Julio, sabe de sistemas y sugirió hacerlo en n8n.

- Español rioplatense, breve. Un tema por vez y una sola pregunta por respuesta.
- Cuando se cambia algo, mostrarlo también en gráfico o tabla, no solo escrito. Si pide ejemplos, mínimo 2.
- De adentro hacia afuera: 1 núcleo, 2 motor, 3 datos (portales), 4 orquestación, 5 botón y entrega.
- Cada entrega termina con el bloque "QUÉ HACÉS AHORA" (a quién, qué le pasa, qué espera, cuándo, quién ejecuta).
- No poner diagramas con forma de comando dentro de bloques de código: una vez los copió en PowerShell.
- Dice "andá para adelante": no pedirle permiso por cada paso, solo parar si hay algo que solo él puede hacer.
- Trabaja con tres bloques, como en su otro proyecto (ST): DISEÑADOR (Cowork, Opus 5.5, esfuerzo alto o máximo) → PREPARADOR (Cowork, Opus 5.5, alto o máximo, el más preciso) → Claude Code (Sonnet 5.5, ejecuta). **Claude Code habla solo con el PREPARADOR, por archivos en `buzon/`, y nunca directo con el DISEÑADOR**: todo pasa por el PREPARADOR. El DISEÑADOR es quien le pregunta mucho a Alejo y dibuja; Claude Code casi no le pregunta. Alejo lleva los archivos de uno a otro. Al empezar: `buzon/LEEME_CLAUDECODE.md` y `buzon/pendientes.md`. Lo chico se le pide directo a Claude Code; pasa por los tres bloques lo que toca una decisión de Alejo o más de un archivo.
- Hay **una sola sesión de Claude Code**: la de la rama `claude/trusting-knuth-brmpsy` (decidido por Alejo el 2026-10-04; la sesión original se retiró). Esa rama es la principal del repo, así que nadie tiene que igualar nada.
- Cada tanda arranca en limpio: Alejo hace `/clear` en Claude Code, borra y reabre los chats de Cowork, y pega en cada uno una línea que apunta a su `LEEME_<ROL>.md` (ver `buzon/LEEME.md`). La memoria es el repo: al cerrar una tanda hay que dejar `pendientes.md`, `CLAUDE.md` y un reporte al día, y pushear.
- No llenar a Alejo de preguntas. Las decisiones abiertas van a `buzon/pendientes.md` con un valor por defecto y a él se le pregunta solo lo que es suyo y frena el trabajo. Muchas veces va a contestar "dejalo pendiente": está bien.
- Los artifacts, para comparar opciones. El del embudo queda como mapa vivo y se sobrescribe. Un artifact es privado: para pasarle el contexto a otra IA sirve este archivo, no el link.

## Estado

- Capas 1 y 2 hechas: `src/nucleo.js` (funciones puras, sin dependencias), `config/reglas.json`, `config/portales.json`. `npm test` da 123 bien y 1 pendiente a propósito. `npm run demo` dibuja el embudo de un día inventado, con la vía B incluida.
- Vía B (firma reconocida) hecha en el núcleo el 2026-10-04: `config/firmas.json` (vacía, la arma Alejo) y `viaB` en `config/reglas.json`.
- Capa 3 hecha el 2026-10-04: `config/feeds.json` (19 feeds probados), `scripts/probar-feeds.js` (`npm run feeds`), el lector `src/lector.js` y `scripts/leer.js` (`npm run leer`: lee los feeds reales y dibuja el embudo; opciones `--json`, `--umbral`, `--min-comunes`, `--detalle`, `--acumular <archivo>` y `--sin-leer`). Con proxy: `NODE_USE_ENV_PROXY=1`.
- Acumular lo leído (2026-10-04): `acumular` en el núcleo y `npm run leer -- --acumular datos/notas.json` (con `--sin-leer` se verifica sobre lo ya guardado, sin pedirle nada a los portales). Guarda 48 h (`ventanaRecoleccionHoras`); la verificación mira 24 h. `datos/` está en `.gitignore`: el repo es público y no se suben las notas.
- Perilla del agrupador (2026-10-04): `umbralSimilitud` 0.3, `umbralSeguro` 0.5 y `minPalabrasComunes` 3 en `config/reglas.json`. Una nota entra a un grupo si se parece al menos 0.5, o si se parece entre 0.3 y 0.5 y comparten 3 palabras. El día de ejemplo da lo mismo con 0.3 que con 0.5 (se comparó la salida de `npm run demo`); el test #22 (misma noticia) no se tocó.
- Notas de servicio con plantilla (2026-10-04): salen en el criterio 1, antes de agrupar y sin contar para verificar. Son 3 moldes en `criterio1.notasDeServicio` de `config/reglas.json` (horario de partido, efemérides, resultados de lotería); en lo descartado llevan el motivo `nota_de_servicio (<nombre>)`. Los moldes son precisos a propósito: no se llevan "a qué hora votan en Brasil" ni "Detienen a funcionarios de la Lotería". `npm run leer` muestra qué sacó el criterio 1 por motivo y tiene `--sin-notas-de-servicio` para comparar antes y después.
- Excepción a mano para una 4/5 (2026-10-04, solo el núcleo): `preparar` devuelve `elegiblesAMano` (hechos en observación a los que les falta 1 medio, sin firma que los haga entrar por la vía B; `aMano` en `config/reglas.json`: `activa` y `faltanMedios`, hoy 1) y `resumen.elegiblesAMano`. La IA juzga `candidatos` **y** `elegiblesAMano`. `decidir` recibe `elegiblesAMano` y devuelve `aMano: { nacional, internacional }`: los que pasan los criterios 3 a 6, sin cupo, sin topes y sin reserva, con la etiqueta "Confirmada por N medios · elegida a mano". Nunca entran solos a `nacionales` ni a `internacionales`, ni para llegar al mínimo de 3. La vista (el menú "En observación · les falta 1 medio" con "Llevármela igual") es capa 5 y espera el diseño de la entrega.
- Los 6 portales sin feed (Reuters, AP, AFP, EFE, La Voz y LN+) quedan `activo: false` en `portales.json`: no suman a la verificación y no avisan "feed roto". El día de ejemplo usa medios argentinos para lo internacional.
- Paquetes para pegar en Cowork (2026-10-04): cuando un chat de Cowork dice "no hay nada conectado", Alejo le pega `buzon/paquetes/PEGAR_DISENADOR.md` o `buzon/paquetes/PEGAR_PREPARADOR.md`. Los arma `npm run paquete` (`scripts/armar-paquete.js`) con los archivos tal cual del repo. Son una foto: se rearman al cerrar cada tanda.
- Los valores son la propuesta por defecto. **No son decisiones de Alejo.** Se cambian en `config/`.
- La lista de portales es provisoria: dominios y feeds sin verificar.

## Capa 3 · lo que se probó de los feeds (2026-10-04)

- Andan 19: 13 nacionales + 6 internacionales. Son 17 de los 20 probados (12 tal cual y 5 corregidos) más Noticias Argentinas y Olé, que salieron de `portales.json` y no estaban entre los 20. Los links de cada feed caen en el dominio que ya está en `portales.json`.
- Se corrigieron 5 direcciones de memoria: Infobae, Página/12, El Cronista, La Capital y DW (el español es `rss-sp-all`, no `es`).
- **Sin feed alcanzable:** Reuters (401, DataDome), AP (403, Cloudflare), AFP (solo RSS corporativo, viejo), EFE ("No feed available"), La Voz (403) y LN+ (timeout: reintentar con Network access en Full). Se confirmó la sospecha de Reuters, AP y AFP.
- 10 feeds internacionales extra andan (Euronews, RFI, NYT, Sky, NPR, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos) pero su portal no está en la lista blanca: los decide Alejo. Hoy hay 6 grupos internacionales con feed, y dos (The Guardian y Al Jazeera) publican en inglés. El motor cuenta cualquier medio de la lista para cualquier noticia, también los argentinos para una internacional; si eso es lo que Alejo quiere es decisión suya (ver `buzon/pendientes.md`).
- El feed de El Cronista mezcla ediciones de otros países (37 de 100 notas: /espana/, /mexico/, /colombia/, /usa/). Clarín solo trae 10 notas; Olé es solo deportes.

## Hallazgo con datos reales (2026-10-04): lo medido sobre lo acumulado

**Primera medición (14:00, una sola lectura de 19 feeds, 1.018 notas):** con 0.5, 0 verificados de 735 hechos. Dos causas: (1) los feeds muestran ventanas de tiempo muy distintas (Clarín 0,5 h, Infobae 1,2 h, el resto de 11 h a varios días), y en una sola lectura coinciden solo en la última hora; (2) el agrupador por palabras casi no junta las notas reales (la noticia de Brasil, con 14 medios, se partía en 45 pedazos con 0.5).

**Segunda medición (15:07 a 17:00, 5 lecturas separadas por unos 28 minutos, acumuladas en `datos/notas.json`: 1.150 notas, 58 descartadas por criterio 1).** Se midieron tres variantes sobre lo mismo (`--sin-leer`):

| Variante | `umbralSimilitud` | Mínimo de palabras en común | Hechos | Con 3 o más grupos | Con 5 o más grupos (verificados) |
|---|---|---|---|---|---|
| V1 (la de antes) | 0.5 | 3 (no se mira) | 1.036 | 0 | **0** |
| V2 | 0.3 | 0 | 941 | 9 | **2** |
| V3 (la elegida) | 0.3 | 3 | 941 | 9 | **2** |

Cuántos hechos hay según en cuántos grupos salieron (V3): 897 con 1 grupo, 35 con 2, 6 con 3, 1 con 4 y 2 con 5 o más.

- **V2 y V3 dan exactamente lo mismo con estos datos.** La regla de 3 palabras en común no cambió nada: quedó como red de seguridad, no se vio que haga falta todavía.
- **Los dos hechos verificados son de verdad la misma noticia**, revisados a ojo: Brasil (6 grupos, 12 notas: la jornada electoral, con avances, votación y resultados en vivo; es el caso límite) y el mensaje de García Cuerva en Luján (6 grupos, 6 notas). Entre los hechos de 5 o más grupos, **0 uniones falsas**, por eso `umbralSimilitud` queda en 0.3.
- **Las uniones falsas están en hechos de 3 grupos, que no llegan a 5:** "A qué hora juegan Talleres vs. Belgrano… EN VIVO" junta también otros partidos (Argentinos-Tigre, Racing, Vélez), y "Efemérides de hoy" junta con la Lotería del Cauca. Son notas de servicio con plantilla; la regla de 3 palabras no las frena. En una jornada con más medios podrían llegar a 5. Propuesta (no hecha): excluir esas plantillas en el criterio 1 (ver `buzon/pendientes.md`).
- **Hechos partidos:** Colapinto en Malasia/Bahréin sale como un hecho de 4 grupos y otro de 3 que son la misma carrera; juntos serían 5 o 6. El agrupador por palabras todavía deja notas sueltas.
- **Brasil se verifica solo con medios argentinos** (los 6 grupos son argentinos; ningún internacional): 0 de 2 verificados tienen 2 o más notas de feeds internacionales. Sigue siendo la opción C de `buzon/pendientes.md`.
- Con lo acumulado la ventana de Clarín pasa de 0,5 h a 2,1 h e Infobae de 1,2 h a 2,8 h; los dos todavía son cortos. Hace falta leer seguido (cada 15 a 30 minutos) para que no queden huecos: eso es la capa 4.

### Con las notas de servicio afuera y la 4/5 (2026-10-04, 18:02; 1.277 notas acumuladas, de 2/10 18:12 a 4/10 18:02)

Dos corridas seguidas sobre lo guardado (`--sin-leer`): A sin los moldes, B con los moldes.

| Hechos según cuántos grupos | A (sin moldes) | B (con moldes) |
|---|---|---|
| 1 grupo | 982 | 983 |
| 2 grupos | 37 | 37 |
| 3 grupos | 10 | **8** |
| 4 grupos | 4 | 4 |
| 5 o más (verificados) | 2 | 2 |
| Notas sacadas por el criterio 1 | 58 | 65 |

- Los moldes sacaron 7 notas: 3 de horario de partido, 3 de efemérides y 1 de lotería. Ninguna era noticia de verdad.
- **Las 2 uniones falsas de 3 grupos desaparecen.** "A qué hora juegan Talleres vs. Belgrano… EN VIVO" (que juntaba otros 3 partidos) y "Efemérides de hoy" (que juntaba la Lotería del Cauca) ya no salen. Lo que quedaba del clásico de Talleres y Belgrano se junta limpio con las notas del partido.
- Los hechos de 4 grupos no cambian. Son 4 y los 4 son 4/5 frescos, o sea elegibles a mano: Colapinto en Malasia (dos hechos que son la misma carrera), las ventas minoristas de septiembre y Milei siguiendo la elección en Brasil.
- Hubo que ajustar el molde de lotería: "Resultado Lotería del Cauca hoy 3 de octubre" (Infobae, ruta `/colombia/`) no lleva "de" y el molde de la carta no la agarraba.
- **El feed de Infobae mezcla ediciones de otros países:** de 341 notas, 282 (83 %) son de `/espana/` (76), `/peru/` (72), `/america/` (69), `/mexico/` (38) y `/colombia/` (27). Cuentan como Infobae para verificar. No se excluyó nada: lo decide el DISEÑADOR (ver `buzon/pendientes.md`).

## Siguiente paso

Está en `buzon/pendientes.md`. Lo que queda, en este orden: la capa 4 (cada cuánto leer y dónde se guarda lo acumulado, con Don Julio), el diseño de la entrega (que incluye la vista de las 4/5 y la memoria de lo ya entregado) y la IA que juzga (que ahora juzga también las 4/5). El lector (`src/lector.js`) devuelve notas `{id, titulo, bajada, url, portal, fecha, seccion, etiqueta, firma, feed}`, con `portal` tomado del campo `dominio` de `feeds.json` y las rutas de otros países del Cronista descartadas con `excluirRutas`. Para el DISEÑADOR, con números: las reglas viejas `quiniela` y `horoscopo`, las variantes de servicio que los moldes no agarran, y las ediciones de otros países en el feed de Infobae.

## Lo que Alejo pidió el 2026-10-04

- Meta: que quien apriete el botón (él, su hermana o un cliente desconocido) confíe en que las noticias pasaron por varios filtros. Entrega: título, breve descripción y links. Para la "breve descripción" se asume la bajada del propio medio, sin IA, salvo que diga otra cosa.
- Uso real: su hermana trabaja en un canal de comunicaciones y hoy lo hace a mano (lee noticias, en Canva busca y edita la foto). Quiere un botón, con corridas cada 4 horas (por ejemplo), de 5 a 10 noticias como máximo; con rescatar 2 o 3 ya le alcanza para publicar. Más adelante, que salga más cerca de lo publicable (fotos y armado). Eso es futuro: hoy solo las noticias.
- **Cantidad de noticias, hecho:** se elige entre 3 y 7 por bloque (`cupoMinimo` y `cupoPorBloque` en `config/reglas.json`; se pasa como `cupo` a `decidir`). Sirve para un domingo flojo o para pedir 5 y 5. Sin elegir valen 7. Si no se llega al mínimo de 3, se avisa y no se baja el estándar para completar.
- **Vía B, hecha y confirmada** (Alejo: "que sea así tal cual", y eligió la lectura A el 2026-10-04): segunda línea de verificación para internacionales y también nacionales. Si un hecho no llega a 5 grupos, lo respalda al menos 1 autor de `config/firmas.json` (`viaB.minFirmas: 1`). Su razonamiento: un hecho público con miles de testigos (una conferencia de dos presidentes) lo confirman muchos medios solos; la información más reservada (un tratado) tiene pocos medios con acceso, y ahí entran las firmas.
  - Es una segunda página: solo ocupa lo que la primera deja libre, va después de todo lo de la vía A y sale con la etiqueta "Respaldada por [nombres]". Nombra hasta 2 autores (`maxFirmasEnEtiqueta: 2`); si hay más, "y N más".
  - Bajó el estándar respecto de la primera propuesta (2 autores): Alejo lo eligió sabiendo eso. Por eso la etiqueta nunca dice "Confirmada" y la vía B va aparte. Si hiciera falta volver a pedir 2 autores, es `minFirmas: 2`. Hay un tope opcional de noticias de segunda página (`maxNoticiasPorBloque`), hoy apagado.
  - La lista de firmas la arma Alejo; Claude no inventa nombres. Está vacía, así que hoy la vía B no hace nada.
  - Una firma suma solo si su nota es informativa (la opinión se descarta en el criterio 1) y salió en un portal que cuenta de `portales.json`. Un autor vale 1 aunque firme en varios portales. Cada autor tiene `ambitos`: nacional, internacional o los dos.
  - Sigue pasando por fuente con nombre, interés público y no desmentido.
  - El lector (`src/lector.js`) tiene que llenar `nota.firma` con el autor del feed (`dc:creator`, `author`); elDiarioAR ya lo trae.
- Dos ideas, una descartada y una sin resolver (para el DISEÑADOR, ver `buzon/pendientes.md`): (1) que la verificación no sea "5 fijos" sino un cálculo, por ejemplo con peso por portal: **descartada por Alejo el 04-10-2026: la verificación queda en 5 grupos fijos. Sin peso por portal, sin umbral de puntaje y sin segunda página automática con "Confirmada por 4 medios".** (2) Otras formas de armar la lista de firmas, porque Alejo no tiene nombres a mano: sigue pendiente.
- **Excepción a mano para una 4/5, decidida por Alejo (carta del DISEÑADOR `a`, 04-10-2026), hecha en el núcleo.** No contradice los 5 fijos: la 4/5 nunca entra sola ni cuenta como verificada; la persona la elige a mano y sale marcada "Confirmada por 4 medios · elegida a mano". Los detalles (solo les falta 1 medio, sin cupo ni topes, pasan por la IA y los criterios 3 a 6, en un menú por bloque) son valores por defecto del DISEÑADOR, no decisiones de Alejo. Se cambian en `aMano` de `config/reglas.json`. La vista espera el diseño de la entrega.
- **Notas de servicio con plantilla, decidido por Alejo (04-10-2026), hecho:** salen en el criterio 1 con 3 moldes en `criterio1.notasDeServicio`. No decide deportes: los resultados de los partidos siguen entrando.
- Con corridas cada 4 horas, la misma noticia vuelve a salir en la corrida siguiente: el motor no recuerda lo ya entregado. Hace falta esa memoria antes de automatizar. Las ventanas de 48 h y 24 h también están pensadas para una corrida por día.
- Futuro: portales y firmas por país (venta a otros países, por ejemplo Uruguay). Las fotos de los portales tienen derechos: antes de automatizar imágenes hay que definir de dónde salen.
- Etiqueta para el cliente: "confirmada por N medios", no "verificada". Cinco medios que repiten el mismo error pasan igual, y el agrupador compara palabras (le cuesta con notas en otro idioma).
- Dibujo del embudo: https://claude.ai/artifact/1x8EynL8rEGJV9i6DyiHFi

## Decisión de arquitectura (n8n)

Veredicto de la comparación: **n8n, con el código de reglas y agrupado en este repo y con tests**. Puntajes sobre 10: n8n con el código en el repo 6,5; híbrido (n8n + motor aparte) 6,2; todo en código 5,7. Gana el híbrido si Don Julio ya maneja un servidor con Docker y Python.

- n8n resuelve bien lo de afuera: leer portales, botón (Telegram o formulario), entrega, avisos.
- n8n no resuelve juntar "la misma noticia" ni decidir "entra o no": eso es código igual.
- Precios de n8n Cloud (unos €24 por mes en Starter) salen de sitios de terceros, sin verificar. n8n 3.0 sale en octubre de 2026 y rompe cosas.

## Decisiones que solo Alejo puede tomar (no urgentes)

Lista blanca de medios · qué ordena el top (impacto o cantidad de medios) · deportes y espectáculos · qué es INTERNACIONAL · topes por sección y por país · argentinos afuera (¿NACIONAL o INTERNACIONAL?) · horarios de las corridas · policiales sensibles · si se entrega solo título y links o también un resumen con IA.

## Notas del entorno

- La red del entorno de Alejo ("Alejito") bloquea los portales. Hay que poner **Network access en Full** (o Custom con los dominios) antes de abrir la sesión. Se edita solo desde la pantalla de nueva sesión de claude.ai/code, en el ícono de nube con el nombre del entorno, encima de la caja de mensaje. Una sesión ya abierta no cambia su red.
- El `git push` funciona en sesiones creadas después de instalar la app de Claude en GitHub. La rama principal del repo es `claude/trusting-knuth-brmpsy` (Alejo la configuró así en GitHub el 2026-10-04; verificado). La rama vieja `claude/quirky-bell-pkumz7` ya no se usa. No existe `main`.
- El repo es público (2026-10-04). Alejo decide si pasa a privado; lo que se ve y lo que conviene revisar está en `buzon/pendientes.md`.
- Pendiente chico de Alejo: la descripción del repo en GitHub dice "INTENACIONALES" (falta una R).
- Borrador de los 8 criterios, para que Alejo los marque: https://claude.ai/artifact/6wSXsoworDA4ifVUZqwwqS

============================================================
ARCHIVO 4 de 6 · buzon/pendientes.md
============================================================

# Pendientes

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**Capa 4 y calidad del agrupador** (medido con datos reales el 04-10, ver `CLAUDE.md`)
- [x] ~~Umbral del agrupador.~~ Hecho: `umbralSimilitud` 0.3 con `umbralSeguro` 0.5 y `minPalabrasComunes` 3. Sobre lo acumulado (1.150 notas) con 0.5 hay 0 verificados y con 0.3 hay 2, sin uniones falsas entre los hechos de 5 o más grupos.
- [ ] **Cuántas noticias da la regla de 5 en un día real** (pide el DISEÑADOR): con lecturas cada 30 minutos de un día entero, por bloque y por corte de 4 h, cuántos hechos llegan a 5 o más grupos, cuántos quedan en 4/5 sin firma y cuántos tienen firma. Las 4/5 que se ofrecerían salen de `resumen.elegiblesAMano` (con lo guardado el 04-10 a las 18:02 son 4, todas frescas). Sin apuro: depende de la capa 4.
- [ ] **Hechos partidos.** Colapinto en Malasia/Bahréin sale como un hecho de 4 grupos y otro de 3 que son la misma carrera. Es el límite del agrupador por palabras; lo resuelve el agrupado por significado (opción B de abajo) o la IA que juzga los grupos dudosos. Con los moldes puestos (04-10, 18:02) sigue igual: dos hechos de 4 grupos que, juntos, serían 5 o 6.
- [ ] **Guardar lo leído entre corridas: queda solo lo de capa 4.** Cada cuánto leer (valor por defecto: cada 30 minutos) y dónde se guarda el archivo (n8n). Le toca al DISEÑADOR con Don Julio. La pieza para acumular ya está hecha: `acumular` y `npm run leer -- --acumular datos/notas.json` (48 h, `datos/` no se sube al repo).

**Alejo**
- [ ] Nombres para la lista de firmas (`config/firmas.json`): nombre y si vale para nacional, internacional o los dos. **Sin apuro**: Alejo no los tiene a mano. Mientras esté vacía, la vía B no hace nada. Hay alternativas para el DISEÑADOR (abajo).
- [ ] Opcional: borrar la rama vieja `claude/quirky-bell-pkumz7`, que ya no se usa. Se hace desde GitHub; Claude Code no la toca.
- [ ] **El repo es público.** Alejo decide si pasa a privado. Revisado el 04-10-2026: no hay claves ni tokens; el historial solo tiene como autor a "Claude <noreply@anthropic.com>" (ningún correo personal); los correos de los tests son inventados; el único workflow de GitHub solo corre `npm test`. Sí se ve: la lógica de verificación y las reglas (lo que se piensa vender), las decisiones de Alejo, y menciones a su hermana, a Don Julio y al plan de vender el programa. La lista de firmas, cuando se llene, también sería pública. Si pasa a privado, confirmar que la app de Claude en GitHub y los chats de Cowork sigan teniendo acceso. **Valor por defecto:** sigue público hasta que Alejo decida. Si pasa a privado, la línea de arranque con el link deja de andar y se vuelve al paquete.
- [ ] Decidir si los 10 feeds internacionales extra entran a la lista blanca (`config/feeds.json`, sección `extras`). Va junto con el riesgo de abajo.
- [ ] **Riesgo en INTERNACIONAL: margen e idioma.** Con solo medios internacionales hay 6 grupos con feed y se exigen 5. Dos de esos 6 (The Guardian y Al Jazeera) publican en inglés y el agrupador compara palabras: sin ellos quedan 4 en español. El motor cuenta hoy cualquier medio de la lista para cualquier noticia (verificado: 3 internacionales + 2 argentinos dan 5 de 5), así que una internacional puede sumar los 11 grupos argentinos. Opciones:
  - A: sumar a la lista blanca los 7 extras en español (Euronews, RFI, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos). Cuesta poco, los feeds ya andan. Ojo: 5 son de España.
  - B: agrupado multilengua, comparar significado y no palabras. Resuelve también The Guardian, Al Jazeera y los extras en inglés (NYT, Sky News, NPR). Más caro: hace falta embeddings o una IA. Es el pendiente de los sinónimos.
  - C: que cuenten los medios argentinos para una internacional, como está hoy, o decidir que no. Es la decisión "argentinos afuera / qué es INTERNACIONAL" de `CLAUDE.md`.
  - Primera medición con datos reales: en las notas leídas, la noticia de Brasil la cubren 10 grupos argentinos y 4 internacionales (2 en inglés, The Guardian y Al Jazeera). Sin contar a los argentinos no se verifica: quedan 2 internacionales en español. Se verifica porque cuentan los medios argentinos.
  - **Valor por defecto si Alejo no decide:** C como está hoy, sin extras, y medir con datos reales cuando exista el lector cuántas internacionales llegan a 5 por corrida. Si son menos de 3 (el mínimo que se puede elegir), pasar a A; B queda para más adelante.

**DISEÑADOR**
- [ ] Diseñar la entrega para quien lo usa cada 4 horas (el caso de la hermana de Alejo, canal de comunicaciones): qué ve, en qué orden, cómo elige cuántas noticias (3 a 7), cómo se ve la segunda página. **Incluye la vista de las 4/5** ("En observación · les falta 1 medio" con "Llevármela igual"): el núcleo ya da `aMano` por bloque, con su etiqueta.
- [ ] Diseñar las 5 preguntas de la IA que juzga (fresco o dato nuevo, fuente con nombre, interés público, nacional o internacional, desmentido). Ojo: también juzga `elegiblesAMano` (las 4/5), no solo `candidatos`.
- [ ] **Reglas viejas de título (`quiniela`, `horoscopo`) sueltas:** sacan cualquier título con esa palabra, también noticias de verdad (ej.: "Detienen al dueño de una agencia de quiniela"). ¿Se vuelven precisas como los moldes nuevos? Medido el 04-10 sobre 1.277 notas: `quiniela` sacó 0, `horoscopo` sacó 2 por título (más 1 por url `/horoscopo/`) y `dolar hoy` sacó 6; ninguna era noticia de verdad. El caso peligroso no apareció en estos datos, pero sigue siendo posible. **Valor por defecto:** quedan como están.
- [ ] **Variantes de servicio que los moldes no agarran** (medido el 04-10, notas que pasan el criterio 1): "a qué hora" 6 (las 6 son de elecciones en Brasil y Perú, ninguna de partidos), "dónde ver" 6 (4 de TN con la plantilla "hora, dónde ver y formaciones" de partidos, 1 de béisbol y 1 falsa: "donde Verstappen"), "cómo ver" 3, "horario" 4, "sorteo" 6 (Chontico, Telekino, Quini 6, Triplex y Super Once, Bonoloto), "quini" 2 (el pozo del Quini 6 y Quinigol), "loto" 0 como palabra (9 con la cadena, pero son "piloto", "molotov", Lototurf y Bonoloto), "un día como hoy", "santoral", "lotería" y "baloto" 0. ¿Se suma alguna? **Valor por defecto:** no.
- [ ] **El feed de Infobae mezcla ediciones de otros países, como el del Cronista.** De 341 notas guardadas, 282 (83 %) son de `/espana/` (76), `/peru/` (72), `/america/` (69), `/mexico/` (38) y `/colombia/` (27); la Lotería del Cauca salió de `/colombia/`. Todas cuentan como Infobae para verificar. Ojo: `/america/` trae noticias internacionales de verdad (la elección de Brasil), así que excluirla no es obvio. ¿Se excluyen esas rutas como en el Cronista? **Valor por defecto:** no.
- [ ] **Caso borde de la vía B con la 4/5:** una 4/5 que entra por la vía B pero cuya firma no vale para su bloque (un autor solo nacional en una noticia internacional) se descarta y no se ofrece a mano. Solo pasa con `firmas.json` llena. **Valor por defecto:** así.
- [ ] **Notas con fecha futura:** 3 de 1.277 (2 de Página/12 con la fecha de la edición del lunes, 5/10 00:01, y 1 de La Nación 18:53 cuando eran las 18:02). Hoy cuentan como frescas. **Valor por defecto:** no se hace nada hasta que moleste.
- [ ] **Alternativas a la lista de firmas hecha a mano.** Opciones para pensar:
  - A: la lista manual de hoy.
  - B: reputación por trayectoria. Una firma sería reconocida si aparece firmando en varios portales de la lista blanca durante un período. Se arma sola con el campo `firma` que va a traer el lector y Alejo solo aprueba o descarta. Cuidado: popularidad no es confiabilidad, y habría que sacar firmas genéricas ("Redacción", "Agencias").
  - C: fuentes externas (premios, bases de datos de autores). Sin investigar ni probar.
- [ ] Decidir las ventanas de tiempo para corridas cada 4 horas. Hoy son 48 h de recolección y 24 h de frescura, pensadas para una corrida por día.

**PREPARADOR → Claude Code**
- [ ] Memoria de lo ya entregado: con corridas cada 4 h, la misma noticia vuelve a salir en la corrida siguiente porque el motor no recuerda. Hace falta pasarle la lista de hechos ya entregados, o marcar cuáles son nuevas desde la última corrida. **Espera el diseño de la entrega (DISEÑADOR): ocultar o marcar, por persona, cuánto dura.**
- [ ] LN+: reintentar el feed con Network access en Full. Si anda, sacarle `activo: false`, sumarlo a `config/feeds.json` y sacarlo de `sinFeed`.

**Más adelante**
- [ ] Portales y firmas por país, para vender a otros países (Uruguay, por ejemplo).
- [ ] Fotos y armado de publicaciones (hoy se hace a mano en Canva). Las fotos de los portales tienen derechos: antes de automatizar hay que definir de dónde salen las imágenes.
- [ ] Mejorar el agrupador para notas en otro idioma (hoy compara palabras).

## Hecho

- [x] 04-10-2026 · **Decisión de Alejo (carta del DISEÑADOR `a`, 1.1): la verificación queda en 5 grupos fijos, sin cálculo.** Se cierra el pendiente del cálculo: no hay peso por portal, ni umbral de puntaje, ni segunda página automática con "Confirmada por 4 medios". `minGrupos` sigue en 5. Anotado en `CLAUDE.md`.
- [x] 04-10-2026 · Notas de servicio con plantilla afuera del criterio 1: 3 moldes en `criterio1.notasDeServicio` (horario de partido, efemérides, resultados de lotería), con motivo `nota_de_servicio (<nombre>)`. Medido con los moldes puestos: sacan 7 notas (3, 3 y 1), ninguna era noticia, y las 2 uniones falsas de 3 grupos desaparecen (hechos de 3 grupos: 10 → 8). Ver `ClaudeCode_para_PREPARADOR_2026-10-04_j.md`.
- [x] 04-10-2026 · Excepción a mano para una 4/5, pieza del núcleo: `elegiblesAMano` en `preparar` y `aMano` en `decidir`, con la etiqueta "Confirmada por N medios · elegida a mano". Sin cupo ni topes; nunca entra sola. La vista espera el diseño de la entrega.
- [x] 04-10-2026 · `npm run leer` muestra qué sacó el criterio 1 por motivo y tiene `--sin-notas-de-servicio`; con `--detalle` lista los títulos sacados por una regla de título.
- [x] 04-10-2026 · Perilla del agrupador (`umbralSeguro`, `minPalabrasComunes`) y `--min-comunes`/`--detalle` en `npm run leer`; `umbralSimilitud` baja de 0.5 a 0.3 con el resultado de la medición (V1, V2 y V3; ver `ClaudeCode_para_PREPARADOR_2026-10-04_i.md`).
- [x] 04-10-2026 · Los 6 portales sin feed (Reuters, AP, AFP, EFE, La Voz y LN+) quedan `activo: false`: el aviso de "¿feed roto?" ya no los nombra. El día de ejemplo usa medios argentinos para lo internacional (opción C).
- [x] 04-10-2026 · `acumular` y `npm run leer -- --acumular datos/notas.json`: lo leído se junta entre lecturas y se verifica sobre 48 h.
- [x] 04-10-2026 · Paquetes para pegar en Cowork (`npm run paquete`): un archivo por rol en `buzon/paquetes/`, para cuando el chat no tiene el repo conectado.
- [x] 04-10-2026 · Feeds probados y lista real en `config/feeds.json`.
- [x] 04-10-2026 · Vía B (firma reconocida) en el núcleo, con `config/firmas.json` vacía.
- [x] 04-10-2026 · Cantidad de noticias por bloque elegible de 3 a 7.
- [x] 04-10-2026 · Segunda página confirmada por Alejo: alcanza con 1 autor de la lista, y se nombran hasta 2 (ver `ClaudeCode_para_PREPARADOR_2026-10-04_b.md`).
- [x] 04-10-2026 · Los chats de Cowork ven `buzon/`: `claude/trusting-knuth-brmpsy` es la rama principal del repo en GitHub (Alejo la configuró y se verificó), con una sola sesión de Claude Code.
- [x] 04-10-2026 · Lector `src/lector.js` y `npm run leer`: 19 de 19 feeds leen bien con datos reales (1.018 notas).
- [x] 04-10-2026 · Buzón armado en el repo: `LEEME.md` (reglas, ciclo de cada tanda) y un `LEEME_` por bloque. Todo pasa por el PREPARADOR.

============================================================
ARCHIVO 5 de 6 · buzon/Disenador_para_PREPARADOR_2026-10-04_a.md
============================================================

# DISEÑADOR → PREPARADOR · 04-10-2026 · 17:41 (hora de Argentina) · letra a

Primera carta del DISEÑADOR. Responde a `PREPARADOR_para_Disenador_2026-10-04_a.md`.

**Veredicto:** Alejo tomó tres decisiones, las tres para cuidar el sello "Confirmada". La 1.1 no toca código. La 1.2 pide una pieza chica en el núcleo, que puede ir ahora o junto con el diseño de la entrega. La 1.3 es un cambio chico en el criterio 1 y puede ir ya. El punto 2.1 de tu carta lo resolvió la medición; 2.2 y 2.3 siguen con sus valores por defecto.

## 1 · Decisiones

### 1.1 · Verificación: 5 grupos fijos, sin cálculo (decidió Alejo)

- Alejo escribió: "quiero que sean los 5". Se podía leer de tres maneras (los 5 temas del DISEÑADOR, 5 medios fijos o las 5 preguntas de la IA), así que le pregunté. Eligió **"5 medios, fijo: la verificación queda como está, hacen falta 5 grupos de medios, sin pesos ni puntajes. Se cierra el pendiente del cálculo."**
- **Qué se ve:** nada cambia para quien usa el programa. Por la vía A, "Confirmada por N medios" sale solo con N de 5 o más. Un grupo chico vale lo mismo que uno grande, y se sigue contando por grupo (Clarín, TN y Olé valen 1).
- **Qué se toca:** nada en `config/` ni en `src/`. `minGrupos` sigue en 5.
- **Qué hay que anotar:**
  - `pendientes.md`: sacar del bloque DISEÑADOR el ítem "Cálculo de verificación en lugar de 5 grupos fijos" y pasarlo a Hecho como decisión de Alejo.
  - `CLAUDE.md`, sección "Lo que Alejo pidió": la idea (1), el cálculo con peso por portal, queda **descartada por Alejo el 04-10-2026**. Con ella se descartan el peso por portal, el umbral de puntaje y una segunda página automática con "Confirmada por 4 medios".
- **Lo que le mostré para decidir:** con los datos de la medición, 2 de 941 hechos llegaron a 5 grupos en 2 h de un domingo, y el mínimo por bloque es 3. Las formas de sumar noticias sin bajar los 5 ya están en `pendientes.md`: leer cada 30 minutos, juntar los hechos partidos (Colapinto), sumar los feeds extras y la vía B.

### 1.2 · Excepción manual para una 4/5: sí, a mano y marcada (decidió Alejo)

- Le pregunté: "si una noticia queda en 4/5, ¿quien usa el programa puede meterla a mano?". Eligió **"Sí, a mano y marcada: puede elegirla de la lista de observación, pero sale con otra etiqueta"**.
- Sale de la lista "Decisiones que solo Alejo puede tomar" de `CLAUDE.md` (el ítem "excepción manual para una 4/5").
- **Los detalles los propuse yo.** Alejo no los decidió: son valores por defecto y cada uno se cambia por separado.

| Detalle | Valor por defecto |
|---|---|
| Qué se puede elegir | Solo los hechos que tienen exactamente `minGrupos − 1` grupos (hoy, 4 de 5). Una 3/5 no. |
| Etiqueta | "Confirmada por 4 medios · elegida a mano". Nunca "Confirmada por 5". |
| Otros filtros | Pasa por todo lo demás: el criterio 1 (ya corre antes de agrupar) y, cuando exista, la IA que juzga. |
| Quién la elige | Cualquiera que use el botón, para su propio paquete. No cambia lo que ven los demás. |
| Cupo de 3 a 7 | El programa nunca la mete solo para completar. Entra al paquete solo si la persona la elige. |
| Hasta cuándo | Lo mismo que la observación: menos de 24 h desde la primera nota (`ventanaFrescoHoras`). |

- **Cruce con la vía B:** una 4/5 con firma de la lista ya entra hoy por la vía B como "Respaldada por…". La excepción a mano es solo para las 4/5 sin firma.
- **Qué se toca.** Hoy `enObservacion` trae todo lo que no llegó a 5 y es fresco, de 1/5 a 4/5 sin separar (en la medición, casi todo es 1/5). La excepción necesita que el núcleo marque cuáles se pueden elegir a mano y con qué etiqueta. Lo que se ve (una lista aparte "En observación · les falta 1 medio", con un botón "Llevármela igual") es capa 5 y va con el diseño de la entrega. Mi sugerencia: la parte del núcleo ahora, con tests, porque es chica; la vista después. Lo decidís vos.

### 1.3 · Notas de servicio con plantilla: se sacan en el criterio 1 (decidió Alejo)

- Es el pendiente que dejó Claude Code en `ClaudeCode_para_PREPARADOR_2026-10-04_i.md`. Le pregunté: "¿Las sacamos antes de juntar, como hoy se saca el horóscopo?". Eligió **"Sí, sacarlas: se suman 3 moldes a la etapa Limpiar (a qué hora juega, efemérides y resultados de lotería), buscados con precisión para no llevarse noticias de verdad"**.
- **Por qué:** con datos reales ya se juntan de forma falsa a 3 grupos ("A qué hora juegan Talleres vs. Belgrano… EN VIVO" con otros partidos; "Efemérides de hoy" con la Lotería del Cauca). Un día con muchos medios podrían llegar a 5 y salir como "Confirmada por 5 medios".
- **Qué se ve:** esas notas no aparecen nunca, igual que el horóscopo. En lo descartado quedan con su motivo (propuesta mía: "nota de servicio").
- **Qué se toca:** los 3 moldes en `criterio1` de `config/reglas.json`, junto a horóscopo y quiniela, con tests.
- **Lo que propuse yo (valores por defecto):**
  - Moldes precisos, no una palabra suelta en cualquier parte del título. Por ejemplo, al principio del título. El texto exacto de cada molde lo arma Claude Code mirando los títulos reales.
  - Tests con estos 4 casos. Los 2 primeros son reales del 04-10 y los otros 2 son inventados:

| Título | Tiene que |
|---|---|
| "A qué hora juegan Talleres vs. Belgrano… EN VIVO" | Salir en el criterio 1 |
| "Efemérides de hoy" | Salir en el criterio 1 |
| "Talleres le ganó 2 a 1 a Belgrano en el clásico" | Seguir (es un resultado, no un horario) |
| "Detienen a dos funcionarios de la Lotería por fraude" | Seguir (dice "lotería" pero no es un resultado de lotería) |

- **No decide deportes:** si entran o no los deportes sigue siendo una decisión de Alejo, aparte.

## 2 · Tu carta a

| Tema | Cómo quedó |
|---|---|
| 2.1 · Umbral del agrupador | Lo resolvió la medición: 0 uniones falsas entre los hechos de 5 o más grupos, que es el valor por defecto (cero), así que queda 0.3. No se lo pregunté a Alejo porque se cumplió su valor por defecto. |
| 2.2 · Memoria de lo entregado | Sin tratar. Siguen tus valores por defecto. Lo tomo junto con el diseño de la entrega. |
| 2.3 · Dos relojes | Sin tratar. Siguen los valores por defecto: leer cada 30 minutos, entregar cada 4 h o al apretar el botón. |
| 2.4 · Opción C en el día de ejemplo | Visto. |
| Notas de servicio con plantilla (`pendientes.md`) | Decidido: ver 1.3. |

## 3 · Lo que necesito de Claude Code

1. **Cuántas noticias da la regla de 5 en un día real.** Cuando haya lecturas cada 30 minutos de un día entero (o lo más parecido que se pueda con `--acumular`), contar por bloque (nacional e internacional) y por cada corte de 4 h: cuántos hechos llegan a 5 o más grupos, cuántos quedan en 4/5 sin firma y cuántos tienen firma. Sirve para saber si con 5 fijos se llega al mínimo de 3 por bloque y cuántas 4/5 se ofrecerían para elegir a mano. Sin apuro: depende de la capa 4.
2. **Con los moldes de 1.3 puestos,** repetir la medición sobre lo ya guardado (`--sin-leer`) y mostrar: cuántas notas saca cada molde, con sus títulos para revisarlos a ojo; si las 2 uniones falsas de 3 grupos desaparecen, y si cambia algo en los hechos de 4 o más grupos.

## 4 · Lo que sigue pendiente del DISEÑADOR

Quedan, sin tratar en esta ronda y con los valores por defecto de `pendientes.md`:

- Diseño de la entrega cada 4 h. Ahora suma la vista de la excepción 4/5 y lo de 2.2.
- Las 5 preguntas de la IA que juzga.
- Alternativas a la lista de firmas hecha a mano.
- Ventanas de tiempo para corridas cada 4 h, junto con 2.3.

El ítem del cálculo de verificación sale de esta lista (ver 1.1).

## 5 · Artifacts

- **Regla de los 5 medios:** https://claude.ai/artifact/CrtqRN5vonzq5LJzPAKr7A . Es privado de Alejo; esta carta alcanza para trabajar sin abrirlo. Tiene lo descartado contra lo decidido, tres ejemplos inventados, los números de la medición y una maqueta de cómo se vería una 4/5 elegida a mano.
- **Notas de servicio:** https://claude.ai/artifact/QgbG5pqVE8f5GXCudSrLMw . También es privado. Tiene las 2 uniones falsas reales, la etapa Limpiar antes y después, y los 4 ejemplos de 1.3.

============================================================
ARCHIVO 6 de 6 · buzon/ClaudeCode_para_PREPARADOR_2026-10-04_j.md
============================================================

# Claude Code → PREPARADOR · 04-10-2026 · 18:06 (hora de Argentina) · letra j

Responde a `PREPARADOR_para_ClaudeCode_2026-10-04_b.md` (guardada junto con `PREPARADOR_para_Disenador_2026-10-04_b.md`).

**Veredicto:** hechos los 4 pasos y la medición. Con los 3 moldes afuera, las 2 uniones falsas de 3 grupos desaparecen y los verificados siguen siendo 2. El núcleo ya separa las 4/5 (`elegiblesAMano` y `aMano`). Hubo un ajuste al molde de lotería: el título real de la Lotería del Cauca no llevaba "de". `npm test` pasó de 102 a **123 bien** y sigue 1 pendiente a propósito.

## Qué cambió

| Paso | Commit | Cambio |
|---|---|---|
| guardar | `c2660c5` | Las dos cartas de la letra b, en `buzon/`. |
| 1 | `3beb75d` | `criterio1.notasDeServicio` en `reglas.json` (3 moldes) y un recorrido en `esInformativa`. Motivo: `nota_de_servicio (<nombre>)`. |
| 2 | `f8d4c4b` | `aMano` en `reglas.json`; `preparar` devuelve `elegiblesAMano` y `resumen.elegiblesAMano`; `decidir` recibe `elegiblesAMano` y devuelve `aMano`. Día de ejemplo con M1 y M2, demo y `leer.js` con la línea nueva. |
| 3 | `c13779f` | `npm run leer`: bloque CRITERIO 1 por motivo, `--sin-notas-de-servicio`, `motivosCriterio1` y, con `--detalle`, los títulos sacados por una regla de título. README con la opción. |
| 4 | este commit | `CLAUDE.md`, `README.md`, `pendientes.md`, este reporte y los paquetes. |

## Tests, antes y después

| | Antes | Después |
|---|---|---|
| Bien | 102 | **123** |
| Pendiente a propósito | 1 | 1 |
| Paso 1 | | +4 (servicio con motivo, noticias que siguen, sin la clave, y que una nota de servicio no cuenta para verificar) |
| Paso 2 | | +13 (una por fila de tu tabla, más el menú internacional, el orden y la regla 6) |
| Paso 3 | | +4 (la opción, `motivosCriterio1` dos veces, `detalleCriterio1`) |

Los 102 de antes quedaron sin tocar, salvo "día de ejemplo: de punta a punta", que cambia en las líneas que decía tu carta. Doble pasada: rompí a propósito el código en 8 lugares de la 4/5 (por ejemplo `<` en vez de `<=`, ignorar `activa:false`, mirar el criterio 2, ordenar al revés) y en 4 de los moldes (sacar un "empieza con" o agrandar el de partidos). Los tests atraparon las 12. Una no se atrapaba a la primera (sacar el "empieza con" del molde de lotería); agregué 2 títulos que siguen (con "lotería" en el medio) y ahora sí.

## Demo: lo único que cambia (coincide con lo que predijiste)

| Línea | Antes | Después |
|---|---|---|
| Notas que llegaron | 115 | 123 |
| Hechos | 22 | 24 |
| − sin 5 grupos ni firma | 3 | 5 |
| les falta 1 medio | (no existía) | 2 → se pueden elegir a mano |
| Sección PARA ELEGIR A MANO | (no existía) | Aconcagua (nacional) y emergencia hídrica en Chile (internacional), cada una con "Confirmada por 4 medios · elegida a mano" |
| EN OBSERVACIÓN | 3 líneas | 5 (las 2 nuevas con 4/5 y la marca) |

ENTRAN y AVISOS iguales. Las internacionales siguen en 5 con cupo 7: la 4/5 no rellena. Con solo el Paso 1 la demo era idéntica (`diff` vacío).

## Medición (con lo guardado, `--sin-leer`)

**i · El archivo.** Paso 0: `datos/notas.json` existía con 1.150 notas, de 2/10 17:18 a 4/10 16:59. Hice una lectura más a las 18:02 y quedó con **1.277 notas, de 2/10 18:12 a 4/10 18:02** (la ventana de 48 h corrió). A corrió a las 18:02:49 y B a las 18:02:51.
Dato de pasada: 3 notas tienen fecha futura (2 de Página/12 con 5/10 00:01 y 1 de La Nación 18:53). Hoy cuentan como frescas; no hice nada.

**d · Hechos según cuántos grupos (A = sin moldes, B = con moldes)**

| Grupos | A | B |
|---|---|---|
| 1 | 982 | 983 |
| 2 | 37 | 37 |
| 3 | 10 | **8** |
| 4 | 4 | 4 |
| 5 o más | 2 | 2 |
| Hechos en total | 1.035 | 1.034 |
| Notas sacadas por el criterio 1 | 58 | 65 |
| Hechos con 3 o más grupos | 16 | 14 |

**a · Por molde (B).** Sacan 7 notas en total; ninguna es noticia de verdad.

| Molde | Notas | Títulos |
|---|---|---|
| horario de partido | 3 | Olé: "A qué hora juegan Talleres vs. Belgrano y cómo ver hoy EN VIVO el Torneo Clausura" · Clarín: "Argentinos vs Tigre, EN VIVO: a qué hora juegan, formaciones y cómo ver el partido por el Torneo Cl…" · Clarín: "Estudiantes de Río Cuarto vs Racing, EN VIVO: a qué hora juegan, formaciones y cómo ver el partido …" |
| efemérides | 3 | Página/12: "Efemérides de hoy: qué pasó un 3 de octubre" · La Nación: "Efemérides del 4 de octubre: ¿qué pasó un día como hoy?" · Página/12: "Efemérides de hoy: qué pasó un 4 de octubre" |
| resultados de lotería | 1 | Infobae: "Resultado Lotería del Cauca hoy 3 de octubre" |

**Ajuste al molde de lotería (permitido por tu carta).** Con el molde tal cual, la Lotería del Cauca **no salía**: el título es "Resultado Lotería del Cauca…", sin "de". Cambié `^resultados? de (la )?loteria` por `^resultados? (de )?(la )?loteria`. Sigue "empieza con" y sigue pidiendo "lotería" pegada: no es aflojar. Es tu caso 13. Los 12 casos de la tabla dan igual.

**b · Las 2 uniones falsas de 3 grupos: desaparecen las dos.**
- "A qué hora juegan Talleres vs. Belgrano…" era `[3 grupos · 6 notas]` y juntaba el clásico con Argentinos-Tigre, Estudiantes RC-Racing y Vélez-Platense. En B ya no existe. Lo que quedaba del clásico se suma al hecho "Hinchas de Talleres atacaron con piedras el micro de Belgrano…", que pasa de `[3 grupos · 3 notas]` a `[3 grupos · 4 notas]` y es la misma historia.
- "Efemérides de hoy…" era `[3 grupos · 4 notas]` y juntaba la Lotería del Cauca. En B ya no existe.

**c · Hechos con 4 o más grupos (la lista es idéntica en A y B).**

| Grupos · notas | Título |
|---|---|
| 6 · 14 | Tras el cierre de los comicios, Lula Da Silva y Flávio Bolsonaro disputan voto a voto la … |
| 6 · 6 | Nuevo mensaje de García Cuerva para Milei en la misa de cierre de la peregrinación a Luján… |
| 4 · 8 | Fórmula 1: qué dijo Colapinto luego de finalizar 13° en el Gran Premio de Malasia |
| 4 · 5 | A la espera de los primeros resultados, Milei sigue con optimismo la elección en Brasil y… |
| 4 · 4 | Una carrera loca que Franco Colapinto terminó con mucha dignidad en Sepang con el mejor Alpine |
| 4 · 4 | El consumo, con cautela: las ventas minoristas crecieron apenas 0,3% interanual en septiembre |

Las dos de Colapinto son la misma carrera partida. La de Milei con Brasil es otro hecho aparte del de Brasil (6 grupos).

**e · Reglas viejas (sobre las 1.277 notas, con los moldes puestos).** Ninguna es noticia de verdad en estos datos.

| Regla | Notas | Títulos |
|---|---|---|
| `quiniela` | 0 | — |
| `horoscopo` | 2 (más 1 por url `/horoscopo/`) | La Gaceta: "Horóscopo semanal del 5 al 11 de octubre…" · La Nación: "Horóscopo: cómo será tu semana del 4 al 10 de octubre de 2026" · (url) La Nación: "Las predicciones de Jimena La Torre: conocé tu horóscopo para la semana del 4 al 10 de octubre" |
| `dolar hoy` | 6 | 4 de El Cronista, 1 de La Nación y 1 de Clarín: todas "Dólar hoy…" / "Dólar blue hoy…" con la cotización del día |

El caso peligroso ("Detienen al dueño de una agencia de quiniela") no apareció, pero sigue siendo posible.

**f · Lo que los moldes no agarran** (notas que pasan el criterio 1 en B; cadena normalizada y, entre paréntesis, como palabra suelta).

| Cadena | Títulos que la contienen | Qué son |
|---|---|---|
| "a que hora" | 6 (5) | Las 6 son de elecciones en Brasil y Perú ("A qué hora cierran los comicios…"). Ninguna de partidos. |
| "donde ver" | 6 (5) | 4 de TN con la plantilla de partidos "…en vivo por la fecha 32: hora, dónde ver y formaciones", 1 de béisbol (Infobae) y 1 falsa ("donde Verstappen") |
| "como ver" | 3 (3) | Argentina vs. Benín (La Nación), Vélez vs. Platense (Olé), Portugal vs. Noruega (Clarín) |
| "horario" | 4 (2) | Argentina vs. Benín (La Nación), horario oficial de las elecciones en Perú (Infobae) y 2 con "horarios" (el GP de Singapur de Colapinto y las manifestaciones en CDMX) |
| "un dia como hoy" | 0 | — |
| "santoral" | 0 | — |
| "loteria" | 0 | — |
| "quini" | 2 (1) | El pozo del Quini 6 (La Nación) y Quinigol (Infobae) |
| "loto" | 9 (0) | Ninguna como palabra: "piloto" ×6, "molotov", Lototurf y Bonoloto ×2 |
| "baloto" | 0 | — |
| "sorteo" | 6 (6) | Chontico Noche, Telekino, Quini 6, Triplex de la Once, Super Once y Bonoloto |

No sumé moldes. Lo que sí se ve: la plantilla de partidos de TN ("hora, dónde ver y formaciones") sigue pasando, porque el molde de partidos es solo "a qué hora juega".

**g · Les falta 1 medio.** `resumen.elegiblesAMano` = **4** (las 4 son 4/5 y frescas): Colapinto en Malasia (4 notas de La Gaceta, La Nación, TN y Página/12), "Una carrera loca…" de Sepang (La Capital, TN, Página/12, La Nación; es la misma carrera, si se juntaran serían 5 o 6), las ventas minoristas de septiembre (La Gaceta, Ámbito, TN, Infobae) y Milei con la elección en Brasil (Infobae, El Cronista, La Capital, El País).

**h · La Lotería del Cauca y los otros países.** Salió del feed de **Infobae**: `https://www.infobae.com/colombia/2026/10/04/resultado-loteria-del-cauca-hoy-3-de-octubre/`. El feed **sí mezcla ediciones de otros países**: de 341 notas de Infobae en el archivo, 282 (83 %) son de otra edición.

```
Infobae · primer tramo de la ruta (top 10 de 341 notas)
/espana/     76  ██████████████████████
/peru/       72  █████████████████████
/america/    69  ████████████████████
/mexico/     38  ███████████
/colombia/   27  ████████
/deportes/    9  ███
/salud/       5  ██
/economia/    4  █
/tecno/       4  █
/teleshow/    4  █
```

Todas cuentan como Infobae para verificar. No agregué `excluirRutas`. Ojo: `/america/` trae noticias internacionales de verdad (la elección de Brasil), así que excluirla no es obvio. No hizo falta mirar otro feed: la lotería salió de Infobae.

## Qué decidió Claude Code por su cuenta (para revisar)

- **Molde de lotería con "de" opcional** (arriba). Lo pedía tu caso 13.
- `elegibleAMano` (true o false) se pone en **todo** hecho en observación, no solo en los elegibles. `aMano` sin la clave `activa` vale activo, igual que `viaB`.
- En `decidir` saqué los criterios 3 a 6 a una función (`motivoCriterios3a6`) que usan los candidatos y las 4/5, para que los textos de motivo no se desfasen. Mismo orden y mismos textos; los tests de antes pasan sin tocar. El criterio 2 queda afuera de las 4/5.
- Una 4/5 sin juicio suma al aviso "N hecho(s) sin juicio de la IA", como pedía la carta.
- En el bloque CRITERIO 1 de `leer`, el largo de las barras toma como 100 % las notas sacadas por el criterio 1 (no las leídas), para que se vea la proporción entre motivos. Con `--sin-notas-de-servicio` el título del bloque lo avisa.
- Agregué `detalleCriterio1` (exportada, con test) para la lista de títulos con `--detalle`. La carta pedía el comportamiento, no la función.
- No toqué `quiniela` ni `horoscopo`, ni sumé moldes, ni excluí rutas de Infobae.

## Qué quedó pendiente

| A quién | Qué |
|---|---|
| DISEÑADOR (por el PREPARADOR) | Reglas viejas `quiniela`/`horoscopo` sueltas · variantes de servicio que los moldes no agarran (sobre todo la plantilla de TN) · rutas de otros países en el feed de Infobae · el caso borde de la vía B. Todo con números y valor por defecto en `pendientes.md`. |
| DISEÑADOR | Diseño de la entrega con la vista de las 4/5; las 5 preguntas de la IA (ahora también juzga las 4/5); ventanas para corridas cada 4 h. |
| DISEÑADOR con Don Julio | Capa 4: cada cuánto leer y dónde se guarda `datos/notas.json`. |
| Alejo | Lista de firmas, lista blanca, repo público o privado: sin apuro. |
| Claude Code | LN+: reintentar el feed con Network access en Full. |

No se hizo, como pedía la carta: la vista de las 4/5, la memoria de lo ya entregado, la capa 4, la IA que juzga, la lista blanca, `firmas.json` y deportes.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| PREPARADOR | Recibe este reporte con la medición | Leerlo y escribirle al DISEÑADOR la letra c con los números (en especial: las 4/5 elegibles, la plantilla de TN que sigue pasando y el feed de Infobae) | Cuando Alejo se lo pase | Alejo lleva el archivo |
| Alejo | Nada se rompió; los paquetes están al día | Hacer `/clear` en Claude Code, borrar y reabrir los chats de Cowork con su línea | Ahora | Alejo |

============================================================
FIN DEL PAQUETE
============================================================
