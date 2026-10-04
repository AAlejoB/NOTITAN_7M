PAQUETE PARA PEGAR · DISEÑADOR de NOTITAN_7M
Armado el 4/10/26, 17:06 (hora de Argentina) con "npm run paquete".

Para el chat de Cowork: este paquete reemplaza abrir el repo. Son 5 archivos, uno atrás del otro, tal cual están en el repo. Leelos en orden y arrancá como dice el primero (LEEME_DISENADOR.md).
Lo que escribas (las cartas, con el nombre que indica buzon/LEEME.md) entregalo como texto: Alejo lo pega en el chat de Claude Code, que lo guarda en el repo.

Archivos de este paquete:
1. buzon/LEEME_DISENADOR.md
2. buzon/LEEME.md
3. CLAUDE.md
4. buzon/pendientes.md
5. buzon/PREPARADOR_para_Disenador_2026-10-04_a.md

============================================================
ARCHIVO 1 de 5 · buzon/LEEME_DISENADOR.md
============================================================

# LEEME · DISEÑADOR de NOTITAN_7M

Arrancás de acá. Borrador del 04-10-2026, Alejo lo ajusta. Las reglas generales están en `LEEME.md`.

## Qué sos

El primer bloque. Vos y Alejo piensan, deciden y dibujan. **Todo lo visual se trabaja en este chat.** No escribís código.

Modelo: Opus 5.5, esfuerzo alto (quizás máximo).

## Cómo trabajás

- **Le preguntás a Alejo todo lo que haga falta**, de a un tema por vez. Sos el único bloque que lo hace a fondo.
- Le explicás las dimensiones y las consecuencias de cada opción con palabras de todos los días. Alejo no programa.
- Dibujás con artifacts: comparaciones HOY contra PROPUESTA, tarjetas lado a lado, tablas. Si Alejo pide ejemplos, mínimo 2.
- Español rioplatense, breve.
- Distinguís lo que decidió Alejo de lo que propusiste vos.

## Con quién hablás

- Con Alejo, en este chat.
- Con el PREPARADOR, por archivo.
- **No con Claude Code.** Si necesitás algo de él (un dato del repo, el resultado de una prueba, una captura), se lo pedís al PREPARADOR en tu carta.

## Qué leer al arrancar

1. `CLAUDE.md`: decisiones de Alejo y estado del proyecto.
2. `buzon/pendientes.md`, sección DISEÑADOR.
3. El `PREPARADOR_para_Disenador_*` más nuevo, si hay.
4. El dibujo del embudo, si necesitás verlo: https://claude.ai/artifact/1x8EynL8rEGJV9i6DyiHFi (es privado de Alejo; si no podés abrirlo, pedíselo).

## Qué escribís

`Disenador_para_PREPARADOR_<AAAA-MM-DD>_<letra>.md`, con:

- Las decisiones numeradas: qué se ve, qué se toca y por qué.
- Qué decidió Alejo, con sus palabras si importan, y qué propusiste vos.
- Lo que quedó pendiente y con qué valor por defecto.
- Los links a los artifacts.
- Lo que necesitás saber de Claude Code, para que el PREPARADOR lo pida.

Encabezado con la hora de Argentina (`TZ=America/Argentina/Buenos_Aires date`). Un paquete por ronda; lo ya enviado no se reescribe.

============================================================
ARCHIVO 2 de 5 · buzon/LEEME.md
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
ARCHIVO 3 de 5 · CLAUDE.md
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

- Capas 1 y 2 hechas: `src/nucleo.js` (funciones puras, sin dependencias), `config/reglas.json`, `config/portales.json`. `npm test` da 102 bien y 1 pendiente a propósito. `npm run demo` dibuja el embudo de un día inventado, con la vía B incluida.
- Vía B (firma reconocida) hecha en el núcleo el 2026-10-04: `config/firmas.json` (vacía, la arma Alejo) y `viaB` en `config/reglas.json`.
- Capa 3 hecha el 2026-10-04: `config/feeds.json` (19 feeds probados), `scripts/probar-feeds.js` (`npm run feeds`), el lector `src/lector.js` y `scripts/leer.js` (`npm run leer`: lee los feeds reales y dibuja el embudo; opciones `--json`, `--umbral`, `--min-comunes`, `--detalle`, `--acumular <archivo>` y `--sin-leer`). Con proxy: `NODE_USE_ENV_PROXY=1`.
- Acumular lo leído (2026-10-04): `acumular` en el núcleo y `npm run leer -- --acumular datos/notas.json` (con `--sin-leer` se verifica sobre lo ya guardado, sin pedirle nada a los portales). Guarda 48 h (`ventanaRecoleccionHoras`); la verificación mira 24 h. `datos/` está en `.gitignore`: el repo es público y no se suben las notas.
- Perilla del agrupador (2026-10-04): `umbralSimilitud` 0.3, `umbralSeguro` 0.5 y `minPalabrasComunes` 3 en `config/reglas.json`. Una nota entra a un grupo si se parece al menos 0.5, o si se parece entre 0.3 y 0.5 y comparten 3 palabras. El día de ejemplo da lo mismo con 0.3 que con 0.5 (se comparó la salida de `npm run demo`); el test #22 (misma noticia) no se tocó.
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

## Siguiente paso

Está en `buzon/pendientes.md`. Con lo hecho (acumular, perilla del agrupador, 6 portales inactivos) quedan, en este orden: la capa 4 (cada cuánto leer y dónde se guarda lo acumulado, con Don Julio), la memoria de lo ya entregado (espera el diseño de la entrega) y la IA que juzga. El lector (`src/lector.js`) devuelve notas `{id, titulo, bajada, url, portal, fecha, seccion, etiqueta, firma, feed}`, con `portal` tomado del campo `dominio` de `feeds.json` y las rutas de otros países del Cronista descartadas con `excluirRutas`. Proponer al DISEÑADOR: excluir en el criterio 1 las notas de servicio con plantilla (a qué hora juega, efemérides, lotería), que hoy se juntan de forma falsa a 3 grupos.

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
- Dos ideas sin resolver (para el DISEÑADOR, ver `buzon/pendientes.md`): (1) que la verificación no sea "5 fijos" sino un cálculo, por ejemplo con peso por portal, para tratar distinto una noticia confirmada por 4 portales grandes que por 3 chicos; (2) otras formas de armar la lista de firmas, porque Alejo no tiene nombres a mano. Dejó ambas pendientes.
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

Lista blanca de medios · qué ordena el top (impacto o cantidad de medios) · deportes y espectáculos · qué es INTERNACIONAL · topes por sección y por país · argentinos afuera (¿NACIONAL o INTERNACIONAL?) · excepción manual para una 4/5 · horarios de las corridas · policiales sensibles · si se entrega solo título y links o también un resumen con IA.

## Notas del entorno

- La red del entorno de Alejo ("Alejito") bloquea los portales. Hay que poner **Network access en Full** (o Custom con los dominios) antes de abrir la sesión. Se edita solo desde la pantalla de nueva sesión de claude.ai/code, en el ícono de nube con el nombre del entorno, encima de la caja de mensaje. Una sesión ya abierta no cambia su red.
- El `git push` funciona en sesiones creadas después de instalar la app de Claude en GitHub. La rama principal del repo es `claude/trusting-knuth-brmpsy` (Alejo la configuró así en GitHub el 2026-10-04; verificado). La rama vieja `claude/quirky-bell-pkumz7` ya no se usa. No existe `main`.
- El repo es público (2026-10-04). Alejo decide si pasa a privado; lo que se ve y lo que conviene revisar está en `buzon/pendientes.md`.
- Pendiente chico de Alejo: la descripción del repo en GitHub dice "INTENACIONALES" (falta una R).
- Borrador de los 8 criterios, para que Alejo los marque: https://claude.ai/artifact/6wSXsoworDA4ifVUZqwwqS

============================================================
ARCHIVO 4 de 5 · buzon/pendientes.md
============================================================

# Pendientes

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**Capa 4 y calidad del agrupador** (medido con datos reales el 04-10, ver `CLAUDE.md`)
- [x] ~~Umbral del agrupador.~~ Hecho: `umbralSimilitud` 0.3 con `umbralSeguro` 0.5 y `minPalabrasComunes` 3. Sobre lo acumulado (1.150 notas) con 0.5 hay 0 verificados y con 0.3 hay 2, sin uniones falsas entre los hechos de 5 o más grupos.
- [ ] **Notas de servicio con plantilla (propuesta para el DISEÑADOR).** A 3 grupos ya se juntan de forma falsa: "A qué hora juegan… EN VIVO" une partidos distintos y "Efemérides de hoy" une con la Lotería del Cauca. En un día con más medios podrían llegar a 5 y pasar como verificados. Opción: sumarlas al criterio 1 (como la opinión), con una lista de patrones en `config/reglas.json` (por ejemplo "a qué hora juega", "efemérides", "lotería"). **Valor por defecto:** no se hace hasta que el DISEÑADOR lo apruebe; Claude Code lo implementa con tests.
- [ ] **Hechos partidos.** Colapinto en Malasia/Bahréin sale como un hecho de 4 grupos y otro de 3 que son la misma carrera. Es el límite del agrupador por palabras; lo resuelve el agrupado por significado (opción B de abajo) o la IA que juzga los grupos dudosos.
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
- [ ] Diseñar la entrega para quien lo usa cada 4 horas (el caso de la hermana de Alejo, canal de comunicaciones): qué ve, en qué orden, cómo elige cuántas noticias (3 a 7), cómo se ve la segunda página.
- [ ] Diseñar las 5 preguntas de la IA que juzga (fresco o dato nuevo, fuente con nombre, interés público, nacional o internacional, desmentido).
- [ ] **Cálculo de verificación en lugar de "5 grupos fijos".** Alejo: "no tiene que ser a rajatabla"; si no salió en los 3 o 5 portales más conocidos, no entra; pero una noticia confirmada por 4 y otra por 3 podrían tratarse con algún cálculo. Hoy: cada grupo de medios vale 1 y hacen falta 5 (`minGrupos`). Para pensar, sin decidir todavía:
  - ¿Un peso por portal (los más conocidos o confiables valen más), y quién lo arma?
  - ¿Un umbral de puntaje en vez de 5? Ejemplo 1: 4 grupos y los 4 son de los más conocidos. Ejemplo 2: 4 grupos y los 4 son chicos o regionales. ¿Pasan igual?
  - ¿Dónde entra lo que queda con puntaje intermedio, por ejemplo en la segunda página con una etiqueta tipo "Confirmada por 4 medios"?
  - ¿Cómo se le explica el cálculo a quien compra el programa?
  - Relacionado con la decisión ya anotada en `CLAUDE.md`: "excepción manual para una 4/5".
  - Para Claude Code, cuando esté definido, es un cambio acotado: un `peso` por portal en `portales.json`, el umbral en `reglas.json` y ajustar `gruposIndependientes`, con tests.
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
ARCHIVO 5 de 5 · buzon/PREPARADOR_para_Disenador_2026-10-04_a.md
============================================================

# PREPARADOR → DISEÑADOR · 04-10-2026 · 14:46 (hora de Argentina) · letra a

Es la primera carta. Todavía no hay `Disenador_para_PREPARADOR_*`.

**Veredicto:** le pedí a Claude Code tres cosas que no tocan ninguna decisión de Alejo, más una medición con datos reales. Hay tres temas que piden diseño con Alejo. Cada uno tiene un valor por defecto, así que nada se frena mientras tanto.

## 1 · Lo que viene de Claude Code (`PREPARADOR_para_ClaudeCode_2026-10-04_a.md`)

| Paso | Qué cambia para quien usa el programa |
|---|---|
| 1 | Se apaga el aviso "¿feed roto?" de los 6 portales sin feed: Reuters, AP, AFP, EFE, La Voz y LN+. Eran 6, no 4 como decía el pendiente. |
| 2 | Lo leído se puede guardar entre lecturas y verificar sobre 48 h juntas, no sobre una sola foto. |
| 3 | Una regla nueva del agrupador, y una tabla que mide tres variantes con datos reales. |

## 2 · Para decidir con Alejo

### 2.1 · Umbral del agrupador: más noticias contra el riesgo de juntar dos hechos distintos

Hoy el umbral es 0,5 y con datos reales casi no se junta nada: 0 verificados. Bajarlo a 0,3 junta más, pero también une dos etapas distintas de un mismo tema. Encontré que eso rompe un test que existe justamente para cuidar ese caso. Propuse una regla intermedia: con un umbral bajo, una nota se suma a un hecho solo si además comparte al menos 3 palabras con otra nota del grupo.

| Ejemplo | Hoy (0,5) | 0,3 sola | 0,3 con 3 palabras en común |
|---|---|---|---|
| "Brasil: Lula y Bolsonaro definirán la presidencia en un balotaje" / "Elecciones en Brasil: Lula ganó la primera vuelta pero habrá balotaje con Bolsonaro" | Separadas (mal) | Juntas (bien) | Juntas (bien) |
| "Diputados aprobó el Presupuesto" / "Diputados empezó a debatir el Presupuesto" | Separadas (bien) | Juntas (**mal**: 3 medios del debate más 2 de la aprobación darían "Confirmada por 5") | Separadas (bien) |

Hay un límite conocido que ninguna variante arregla: "Boca le ganó a Racing…" y "River le ganó a Racing…" se juntan aun con 0,5.

**Lo que hace falta decidir:** ¿cuántas uniones falsas se aceptan entre las noticias que salen como "Confirmada por N medios"? **Valor por defecto: cero.** Claude Code baja a 0,3 con la regla nueva solo si en la medición no aparece ninguna. Para decidir conviene esperar su tabla, que te paso apenas llegue.

### 2.2 · Memoria de lo ya entregado (va junto con el diseño de la entrega cada 4 h)

No la mandé a construir porque primero hay que diseñar qué ve quien usa el programa. Estas son las preguntas, con su valor por defecto:

| Pregunta | Valor por defecto |
|---|---|
| Lo ya entregado, ¿se oculta o se muestra marcado ("enviada a las 10:00")? | Se oculta 24 h y queda en la Reserva con el motivo "ya entregada" |
| ¿La lista es por persona? La hermana de Alejo y un cliente no deberían compartirla | Sí, una lista por persona |
| ¿Cuánto dura? | 24 h |
| ¿"Entregada" quiere decir "publicada"? La hermana pudo no usarla | No. Por ahora no hay botón de "volver a ver" |

Dos ejemplos de novedades:

1. A las 10:00 sale "Diputados empezó a debatir el Presupuesto" y a las 14:00 aparece "Diputados aprobó el Presupuesto". **Valor por defecto: sale como nueva**, porque con la regla nueva el agrupador las separa.
2. A las 10:00 sale "Brasil va a balotaje" y a las 14:00 más medios confirman lo mismo. **Valor por defecto: no vuelve a salir.**

### 2.3 · Dos relojes: leer seguido y entregar cada 4 h (capa 4, con Don Julio)

Con los datos de Claude Code, el feed de Clarín abarca 0,5 h e Infobae 1,2 h. Si el programa lee solo cuando entrega, cada 4 h, se pierde la mayor parte de lo que publican. Por eso son dos relojes distintos:

| Reloj | Para qué | Valor por defecto |
|---|---|---|
| Lectura | Juntar notas sin perder las de los feeds cortos | Cada 30 minutos |
| Entrega | Lo que recibe quien aprieta el botón | Cada 4 h, o cuando lo aprietan |

Esto también toca tu pendiente de las ventanas (48 h de recolección y 24 h de frescura). Hasta que lo decidas, lo acumulado usa 48 h.

### 2.4 · Solo para que lo sepas: opción C en el día de ejemplo

El día de ejemplo ahora dice explícitamente que una noticia internacional se confirma también con medios argentinos (la opción C, que es el valor por defecto hasta que Alejo decida). Si Alejo elige "argentinos afuera", ese ejemplo se tiene que rehacer, y va a quedar a la vista.

## 3 · Qué necesito de vos

Un `Disenador_para_PREPARADOR_*` con lo que decidan sobre 2.1, 2.2 y 2.3. Si Alejo dice "dejalo pendiente", alcanza con anotarlo: quedan los valores por defecto. Para 2.1, esperá la tabla de la medición.

============================================================
FIN DEL PAQUETE
============================================================
