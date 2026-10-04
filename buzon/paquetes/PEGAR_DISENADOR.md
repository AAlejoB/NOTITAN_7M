PAQUETE PARA PEGAR · DISEÑADOR de NOTITAN_7M
Armado el 4/10/26, 14:34 (hora de Argentina) con "npm run paquete".

Para el chat de Cowork: este paquete reemplaza abrir el repo. Son 4 archivos, uno atrás del otro, tal cual están en el repo. Leelos en orden y arrancá como dice el primero (LEEME_DISENADOR.md).
Lo que escribas (las cartas, con el nombre que indica buzon/LEEME.md) entregalo como texto: Alejo lo pega en el chat de Claude Code, que lo guarda en el repo.

Archivos de este paquete:
1. buzon/LEEME_DISENADOR.md
2. buzon/LEEME.md
3. CLAUDE.md
4. buzon/pendientes.md

============================================================
ARCHIVO 1 de 4 · buzon/LEEME_DISENADOR.md
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
ARCHIVO 2 de 4 · buzon/LEEME.md
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

1. **Hacia Cowork:** lo leen del repo. Si un chat no puede abrir el repo (dice "no hay nada conectado"), Alejo le pega el paquete de su rol: `buzon/paquetes/PEGAR_DISENADOR.md` o `buzon/paquetes/PEGAR_PREPARADOR.md`. Lo arma Claude Code con `npm run paquete` y trae, en un solo texto, el LEEME del rol, `LEEME.md`, `CLAUDE.md`, `pendientes.md` y la carta más nueva que ese rol tiene que leer.
2. **Desde Cowork:** lo que escriben (`Disenador_para_PREPARADOR_*`, `PREPARADOR_para_ClaudeCode_*`) lo pega Alejo en el chat de Claude Code, que lo guarda en `buzon/` con el nombre correcto, lo commitea y lo pushea. Queda en el repo apenas se pushea.

La línea corta para pegar sigue siendo la de abajo; si el chat no puede abrir el archivo, se pega el paquete en vez de la línea.

Para el DISEÑADOR:

```
DESDE ACÁ
Chat nuevo. Leé buzon/LEEME_DISENADOR.md y arrancá de ahí.
HASTA ACÁ
```

Para el PREPARADOR:

```
DESDE ACÁ
Chat nuevo. Leé buzon/LEEME_PREPARADOR.md y arrancá de ahí.
HASTA ACÁ
```

Para Claude Code, después del `/clear`:

```
DESDE ACÁ
Leé buzon/LEEME_CLAUDECODE.md y el PREPARADOR_para_ClaudeCode_* más nuevo, y hacelo.
HASTA ACÁ
```

============================================================
ARCHIVO 3 de 4 · CLAUDE.md
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

- Capas 1 y 2 hechas: `src/nucleo.js` (funciones puras, sin dependencias), `config/reglas.json`, `config/portales.json`. `npm test` da 69 bien y 1 pendiente a propósito. `npm run demo` dibuja el embudo de un día inventado, con la vía B incluida.
- Vía B (firma reconocida) hecha en el núcleo el 2026-10-04: `config/firmas.json` (vacía, la arma Alejo) y `viaB` en `config/reglas.json`.
- Capa 3 hecha el 2026-10-04: `config/feeds.json` (19 feeds probados), `scripts/probar-feeds.js` (`npm run feeds`), el lector `src/lector.js` y `scripts/leer.js` (`npm run leer`: lee los feeds reales y dibuja el embudo; opciones `--json` y `--umbral`). Con proxy: `NODE_USE_ENV_PROXY=1`.
- Paquetes para pegar en Cowork (2026-10-04): cuando un chat de Cowork dice "no hay nada conectado", Alejo le pega `buzon/paquetes/PEGAR_DISENADOR.md` o `buzon/paquetes/PEGAR_PREPARADOR.md`. Los arma `npm run paquete` (`scripts/armar-paquete.js`) con los archivos tal cual del repo. Son una foto: se rearman al cerrar cada tanda.
- Los valores son la propuesta por defecto. **No son decisiones de Alejo.** Se cambian en `config/`.
- La lista de portales es provisoria: dominios y feeds sin verificar.

## Capa 3 · lo que se probó de los feeds (2026-10-04)

- Andan 19: 13 nacionales + 6 internacionales. Son 17 de los 20 probados (12 tal cual y 5 corregidos) más Noticias Argentinas y Olé, que salieron de `portales.json` y no estaban entre los 20. Los links de cada feed caen en el dominio que ya está en `portales.json`.
- Se corrigieron 5 direcciones de memoria: Infobae, Página/12, El Cronista, La Capital y DW (el español es `rss-sp-all`, no `es`).
- **Sin feed alcanzable:** Reuters (401, DataDome), AP (403, Cloudflare), AFP (solo RSS corporativo, viejo), EFE ("No feed available"), La Voz (403) y LN+ (timeout: reintentar con Network access en Full). Se confirmó la sospecha de Reuters, AP y AFP.
- 10 feeds internacionales extra andan (Euronews, RFI, NYT, Sky, NPR, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos) pero su portal no está en la lista blanca: los decide Alejo. Hoy hay 6 grupos internacionales con feed, y dos (The Guardian y Al Jazeera) publican en inglés. El motor cuenta cualquier medio de la lista para cualquier noticia, también los argentinos para una internacional; si eso es lo que Alejo quiere es decisión suya (ver `buzon/pendientes.md`).
- El feed de El Cronista mezcla ediciones de otros países (37 de 100 notas: /espana/, /mexico/, /colombia/, /usa/). Clarín solo trae 10 notas; Olé es solo deportes.

## Hallazgo con datos reales (2026-10-04, 14:00): casi no se verifica nada

Con el lector corriendo sobre los 19 feeds (1.018 notas, 735 hechos), con el umbral actual de 0.5 hay **0 verificados**. Hay dos causas, que se suman:

1. **Los feeds muestran ventanas de tiempo muy distintas.** Clarín abarca 0,5 h, Infobae 1,2 h, Olé 3 h, Noticias Argentinas 4,2 h y Al Jazeera 5,4 h; La Nación, Perfil y La Gaceta, 11 a 13 h; el resto, de 20 h a varios días. En una sola lectura los 19 coinciden solo en la última hora. Hace falta guardar lo leído y verificar sobre las últimas 24 h acumuladas, leyendo los feeds seguido (por ejemplo cada 15 o 30 minutos). Va junto con la memoria de lo ya entregado.
2. **El agrupador por palabras casi no junta las notas reales.** La noticia del día (las elecciones de Brasil) la cubren 14 medios, y con 0.5 se parte en 45 pedazos. Con `umbralSimilitud` 0.3 se junta en un hecho de 6 o 7 grupos y aparecen 2 verificados (Brasil y el mensaje de García Cuerva en Luján, con 5 grupos). Los grupos de 3 o más notas, revisados a ojo, son casi todos la misma noticia. Con 0.25 ya aparecen uniones falsas (partidos de fútbol distintos). Una variante con peso por rareza de las palabras (IDF) no mejoró. Cambiar el umbral es un número en `config/reglas.json`; no se tocó porque el día de ejemplo y varios tests asumen 0.5.

Además se confirmó que la noticia de Brasil solo se verifica porque el motor cuenta a los medios argentinos: en las notas leídas la cubren 10 grupos argentinos y 4 internacionales, y dos de esos 4 están en inglés. Es la opción C de `buzon/pendientes.md`.

## Siguiente paso

Está en `buzon/pendientes.md`: decidir el umbral del agrupador, guardar lo leído entre corridas (y lo ya entregado), y recién después la IA que juzga. El lector (`src/lector.js`) ya está hecho: devuelve notas `{id, titulo, bajada, url, portal, fecha, seccion, etiqueta, firma, feed}`, con `portal` tomado del campo `dominio` de `feeds.json` y las rutas de otros países del Cronista descartadas con `excluirRutas`. Falta marcar `activo: false` en `portales.json` a Reuters, AP, AFP y EFE para que no avisen "feed roto" en cada corrida; no se tocó porque el día de ejemplo y un test usan esas agencias.

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
ARCHIVO 4 de 4 · buzon/pendientes.md
============================================================

# Pendientes

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**URGENTE para PREPARADOR y DISEÑADOR: con datos reales casi no se verifica nada** (medido con `npm run leer` el 04-10 a las 14:00, ver `CLAUDE.md`)
- [ ] **Umbral del agrupador.** Con `umbralSimilitud` 0.5 hay 0 verificados de 795 hechos. Con 0.3, 2 verificados y los grupos grandes son casi todos la misma noticia; con 0.25 aparecen uniones falsas (partidos distintos). **Valor por defecto propuesto: 0.3**, y más adelante una IA que confirme los grupos dudosos. Para Claude Code es un número en `config/reglas.json` más ajustar el día de ejemplo y los tests que asumen 0.5. Se puede probar sin tocar nada con `npm run leer -- --umbral 0.3`.
- [ ] **Guardar lo leído entre corridas.** Cada feed muestra una ventana distinta (Clarín 0,5 h, Infobae 1,2 h, Olé 3 h; otros, días). En una sola lectura casi no se solapan. Diseñar: leer los feeds cada 15 o 30 minutos, guardar las notas y verificar sobre las últimas 24 h acumuladas. Es la misma pieza que la memoria de lo ya entregado, y es trabajo de la capa 4 (n8n y Don Julio).

**Alejo**
- [ ] Nombres para la lista de firmas (`config/firmas.json`): nombre y si vale para nacional, internacional o los dos. **Sin apuro**: Alejo no los tiene a mano. Mientras esté vacía, la vía B no hace nada. Hay alternativas para el DISEÑADOR (abajo).
- [ ] Opcional: borrar la rama vieja `claude/quirky-bell-pkumz7`, que ya no se usa. Se hace desde GitHub; Claude Code no la toca.
- [ ] **El repo es público.** Alejo decide si pasa a privado. Revisado el 04-10-2026: no hay claves ni tokens; el historial solo tiene como autor a "Claude <noreply@anthropic.com>" (ningún correo personal); los correos de los tests son inventados; el único workflow de GitHub solo corre `npm test`. Sí se ve: la lógica de verificación y las reglas (lo que se piensa vender), las decisiones de Alejo, y menciones a su hermana, a Don Julio y al plan de vender el programa. La lista de firmas, cuando se llene, también sería pública. Si pasa a privado, confirmar que la app de Claude en GitHub y los chats de Cowork sigan teniendo acceso. **Valor por defecto:** sigue público hasta que Alejo decida.
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
- [ ] Memoria de lo ya entregado: con corridas cada 4 h, la misma noticia vuelve a salir en la corrida siguiente porque el motor no recuerda. Hace falta pasarle la lista de hechos ya entregados, o marcar cuáles son nuevas desde la última corrida.
- [ ] Marcar `activo: false` en `portales.json` a Reuters, AP, AFP y EFE (sin feed) para que no avisen "feed roto" en cada corrida. Hay que ajustar el día de ejemplo y un test que usan esas agencias.

**Más adelante**
- [ ] Portales y firmas por país, para vender a otros países (Uruguay, por ejemplo).
- [ ] Fotos y armado de publicaciones (hoy se hace a mano en Canva). Las fotos de los portales tienen derechos: antes de automatizar hay que definir de dónde salen las imágenes.
- [ ] Mejorar el agrupador para notas en otro idioma (hoy compara palabras).

## Hecho

- [x] 04-10-2026 · Paquetes para pegar en Cowork (`npm run paquete`): un archivo por rol en `buzon/paquetes/`, para cuando el chat no tiene el repo conectado.
- [x] 04-10-2026 · Feeds probados y lista real en `config/feeds.json`.
- [x] 04-10-2026 · Vía B (firma reconocida) en el núcleo, con `config/firmas.json` vacía.
- [x] 04-10-2026 · Cantidad de noticias por bloque elegible de 3 a 7.
- [x] 04-10-2026 · Segunda página confirmada por Alejo: alcanza con 1 autor de la lista, y se nombran hasta 2 (ver `ClaudeCode_para_PREPARADOR_2026-10-04_b.md`).
- [x] 04-10-2026 · Los chats de Cowork ven `buzon/`: `claude/trusting-knuth-brmpsy` es la rama principal del repo en GitHub (Alejo la configuró y se verificó), con una sola sesión de Claude Code.
- [x] 04-10-2026 · Lector `src/lector.js` y `npm run leer`: 19 de 19 feeds leen bien con datos reales (1.018 notas).
- [x] 04-10-2026 · Buzón armado en el repo: `LEEME.md` (reglas, ciclo de cada tanda) y un `LEEME_` por bloque. Todo pasa por el PREPARADOR.

============================================================
FIN DEL PAQUETE
============================================================
