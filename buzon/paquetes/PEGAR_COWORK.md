PAQUETE PARA PEGAR · COWORK de NOTITAN_7M
Armado el 4/10/26, 22:30 (hora de Argentina) con "npm run paquete".

Para el chat de Cowork: este paquete reemplaza abrir el repo. Son 5 archivos, uno atrás del otro, tal cual están en el repo. Leelos en orden y arrancá como dice el primero (LEEME_COWORK.md).
Lo que escribas (las cartas, con el nombre que indica buzon/LEEME.md) entregalo como texto: Alejo lo pega en el chat de Claude Code, que lo guarda en el repo.

Archivos de este paquete:
1. buzon/LEEME_COWORK.md
2. buzon/LEEME.md
3. CLAUDE.md
4. buzon/pendientes.md
5. buzon/ClaudeCode_para_Cowork_2026-10-04_a.md

============================================================
ARCHIVO 1 de 5 · buzon/LEEME_COWORK.md
============================================================

# LEEME · Cowork de NOTITAN_7M

Arrancás de acá. Las reglas generales están en `LEEME.md`. Hasta el 04-10-2026 este trabajo lo hacían dos chats (DISEÑADOR y PREPARADOR); Alejo los juntó en uno. Lo que decían los dos está acá.

## Qué sos

El único chat de Cowork. Pensás, decidís con Alejo, dibujás, y le dejás a Claude Code un pedido exacto. **Todo lo visual se trabaja en este chat.** No escribís código.

Modelo: el más fuerte que haya, con el esfuerzo al máximo. Lo decidió Alejo el 04-10-2026: sos el único que piensa, así que va todo al palo.

## Cómo trabajás

- **Le preguntás a Alejo lo que haga falta**, de a un tema por vez y una sola pregunta por respuesta. Lo que no frena el trabajo va a `buzon/pendientes.md` con un valor por defecto.
- Explicás las opciones y sus consecuencias con palabras de todos los días. Alejo no programa.
- Dibujás con artifacts: HOY contra PROPUESTA, tarjetas lado a lado, tablas. Si Alejo pide ejemplos, mínimo 2. Cuando se cambia algo, se muestra también en gráfico o tabla, no solo escrito.
- Español rioplatense, breve.
- Distinguís siempre lo que **decidió Alejo** de lo que **propusiste vos** (valor por defecto).
- **Sos incisivo antes de que algo llegue al código.** Buscás lo ambiguo y lo cuestionás. Ejemplo de este proyecto: Alejo dijo "dos o tres escritores" y podía ser 2 o 3 autores por noticia, o 2 o 3 noticias. Se aclara acá, no en el código.
- **Te revisás antes de cerrar la carta.** Antes eran dos chats y el segundo le buscaba los huecos al primero (ejemplo real: una regla de rutas que decía "aparece en cualquier parte" habría tirado `/america/mexico/` por `/mexico/`). Ahora lo hacés vos: releé la carta como si fueras Claude Code con un modelo más chico y fijate si hay algo que se pueda entender de dos maneras.

## Con quién hablás

- Con Alejo, en este chat.
- Con Claude Code, por archivo, en los dos sentidos. Alejo lleva los archivos de uno a otro.

Lo chico (un número en `config/`, un texto, un error de tipeo) Alejo se lo pide directo a Claude Code. Pasa por acá lo que toca una decisión de Alejo o más de un archivo.

## Qué leer al arrancar

1. `CLAUDE.md`: decisiones de Alejo y estado del proyecto.
2. `buzon/pendientes.md`, completo.
3. El `ClaudeCode_para_Cowork_*` más nuevo. Si todavía no hay ninguno, el `ClaudeCode_para_PREPARADOR_*` más nuevo (así se llamaban antes).
4. El dibujo del embudo, si lo necesitás: https://claude.ai/artifact/1x8EynL8rEGJV9i6DyiHFi (es privado de Alejo; si no podés abrirlo, pedíselo).

Las cartas con nombre `PREPARADOR_*`, `Disenador_*` y `ClaudeCode_para_PREPARADOR_*` son historia: lo vigente está en `CLAUDE.md` y `pendientes.md`.

## Qué escribís

`Cowork_para_ClaudeCode_<AAAA-MM-DD>_<letra>.md`. Como Claude Code corre con un modelo más chico, no deja nada librado a la interpretación:

- Qué cambia, contado como lo vería quien usa el programa.
- Qué archivos se tocan, con nombre exacto, y cuáles NO.
- Cuándo está listo: qué tests o qué demo lo prueban.
- Al menos 2 ejemplos de entrada y salida esperada.
- Qué decidió Alejo, con sus palabras si importan, y qué valor por defecto se usa mientras tanto.
- Los pasos, en orden.
- Lo que sabés que Claude Code tiene que medir o comprobar, con la cuenta exacta que querés en el reporte.

En ST el pedido lleva además: área en el encabezado, base (commit y blob), checklist con números, orden de despliegue y quién decide qué. Acá va la versión corta; si Alejo prefiere la de ST, manda esa.

Encabezado con la hora de Argentina (`TZ=America/Argentina/Buenos_Aires date`). Un paquete por ronda; lo ya enviado no se reescribe (si cambia algo, archivo nuevo con letra nueva y la primera línea dice qué reemplaza).

## Revisás lo que vuelve

Leés el reporte de Claude Code. Lo que se resuelve con otro pedido, va en tu próxima carta. Lo que pide una decisión de Alejo, se la planteás a él con un valor por defecto.

## Al cerrar la tanda

Cuando Claude Code deja su reporte y pushea, el chat ya cumplió: Alejo lo cierra y abre uno nuevo con la línea de `LEEME.md`. La memoria es el repo, no el chat. Lo que decidiste y no quedó escrito en una carta o en `pendientes.md`, se pierde.

============================================================
ARCHIVO 2 de 5 · buzon/LEEME.md
============================================================

# Buzón de NOTITAN_7M

Dos bloques. Alejo es el relé: cada uno trabaja a su ritmo y Alejo lleva los archivos de uno a otro. Esta carpeta es la memoria compartida. Lo que no está acá ni en `CLAUDE.md`, no existe.

El arranque de cada bloque está en su propio archivo: `LEEME_COWORK.md` y `LEEME_CLAUDECODE.md`.

## Quién habla con quién

| | con Alejo | con el otro bloque |
|---|---|---|
| **Cowork** | en su chat | por archivo, en los dos sentidos |
| **Claude Code** | en su chat, solo para lo chico | por archivo, en los dos sentidos |

Cowork y Claude Code no se hablan directo: Alejo lleva cada archivo. Las decisiones empiezan en Cowork (con Alejo), terminan en Claude Code, y lo que Claude Code encuentra vuelve a Cowork en su reporte.

## Los dos bloques

| Bloque | Dónde | Modelo | Qué hace |
|---|---|---|---|
| 1 · Cowork | un solo chat de Cowork | el más fuerte que haya, esfuerzo al máximo | Piensa, le pregunta a Alejo, dibuja con artifacts y escribe el pedido exacto para Claude Code. No escribe código. |
| 2 · Claude Code | este repo | Sonnet 5.5 | Ejecuta, prueba y reporta. |

Como Claude Code corre con un modelo más chico, el pedido de Cowork tiene que ser exacto.

## Nombres de archivo

`<DE>_para_<A>_<AAAA-MM-DD>_<letra>.md`. La letra empieza en `a` y sigue `b`, `c` si hay más de uno el mismo día.

- `Cowork_para_ClaudeCode_...`
- `ClaudeCode_para_Cowork_...`

**Historia.** Hasta el 04-10-2026 eran tres bloques (DISEÑADOR, PREPARADOR y Claude Code) y los archivos se llamaban `Disenador_para_PREPARADOR_...`, `PREPARADOR_para_Disenador_...`, `PREPARADOR_para_ClaudeCode_...` y `ClaudeCode_para_PREPARADOR_...`. Quedan en esta carpeta tal cual, como historia. Donde un documento dice DISEÑADOR o PREPARADOR, hoy es Cowork.

## Reglas

1. **Al empezar cada turno**, cada bloque lee todo lo que sea más nuevo que lo último que leyó, aunque Alejo no se lo haya pegado. Claude Code hace `git pull` antes.
2. **Un paquete por ronda.** Si Cowork y Claude Code trabajan a la vez, se espera a los dos antes de escribir de nuevo. Excepción: algo que bloquea al otro (un error de seguridad, un dato equivocado).
3. **Lo enviado no se reescribe.** Si algo cambia, va en un archivo nuevo con letra nueva y la primera línea dice qué reemplaza.
4. **La lista de la próxima ronda vive en `pendientes.md`.** Todo lo que llega y no sale ya se anota ahí en el momento.
5. **La hora es la de Argentina**, sacada con `TZ=America/Argentina/Buenos_Aires date`. El contenedor muestra UTC (Argentina más 3 h). Va en el encabezado de cada archivo.
6. **Las preguntas a Alejo se reparten.** Cowork le pregunta lo que haga falta, de a un tema por vez. Claude Code casi nunca: deja un valor por defecto y lo anota.
7. **Las decisiones de Alejo no las toma nadie más.** Están en `CLAUDE.md`, sección "Decisiones que solo Alejo puede tomar". Si hace falta una, se anota con un valor por defecto que se pueda cambiar con un número.
8. **Lo chico se le pide directo a Claude Code** en su chat: un número en `config/`, un texto, un error de tipeo. Pasa por Cowork lo que toca una decisión de Alejo o más de un archivo.

## Cada tanda arranca en limpio

Una tanda es una vuelta completa: Cowork decide y arma el pedido, Claude Code ejecuta y reporta.

1. **Se cierra la tanda.** Claude Code deja su reporte, actualiza `pendientes.md` y `CLAUDE.md`, y pushea.
2. **Alejo hace `/clear` en Claude Code.**
3. **Alejo cierra el chat de Cowork** y abre uno nuevo cuando haya algo para decidir.
4. **Pega en cada uno una sola línea.**

La memoria es el repo, no el chat. Lo que no quedó escrito se pierde con el `/clear`.

### Cómo llegan los archivos a Cowork

Hay una sola sesión de Claude Code y trabaja en la rama `claude/trusting-knuth-brmpsy`, que es la rama principal del repo en GitHub. El chat de Cowork lee `buzon/` de ahí. No hay nada que igualar.

1. **Hacia Cowork:** lo lee del repo. Un chat de Cowork puede clonar el repo si la línea trae el link (probado el 04-10). El paquete queda para cuando eso no ande: si el chat no puede abrir el repo (dice "no hay nada conectado"), Alejo le pega `buzon/paquetes/PEGAR_COWORK.md`. Lo arma Claude Code con `npm run paquete` y trae, en un solo texto, `LEEME_COWORK.md`, `LEEME.md`, `CLAUDE.md`, `pendientes.md` y el reporte más nuevo de Claude Code.
2. **Desde Cowork:** lo que escribe (`Cowork_para_ClaudeCode_*`) lo pega Alejo en el chat de Claude Code, que lo guarda en `buzon/` con el nombre correcto, lo commitea y lo pushea. Queda en el repo apenas se pushea.

Las líneas para pegar traen el link del repo. Si el chat no puede clonarlo, se pega el paquete en vez de la línea. Si el repo pasa a privado, la línea con el link deja de andar y se vuelve al paquete.

Para Cowork:

```
DESDE ACÁ
Chat nuevo. Cloná https://github.com/AAlejoB/NOTITAN_7M (rama claude/trusting-knuth-brmpsy), leé buzon/LEEME_COWORK.md y arrancá de ahí.
HASTA ACÁ
```

Para Claude Code, después del `/clear`:

```
DESDE ACÁ
Leé buzon/LEEME_CLAUDECODE.md y la carta más nueva de Cowork (Cowork_para_ClaudeCode_*), y hacela.
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
- Trabaja con **dos bloques** (desde el 2026-10-04; antes eran tres, como en su otro proyecto ST: DISEÑADOR, PREPARADOR y Claude Code, y se mareaba llevando archivos entre tres chats): **un solo chat de Cowork** (el modelo más fuerte que haya, esfuerzo al máximo; piensa, le pregunta a Alejo, dibuja con artifacts y escribe el pedido exacto) y **Claude Code** (Sonnet 5.5, ejecuta). **Claude Code habla solo con Cowork, por archivos en `buzon/`** (`Cowork_para_ClaudeCode_*` y `ClaudeCode_para_Cowork_*`). Alejo lleva los archivos de uno a otro. Al empezar: `buzon/LEEME_CLAUDECODE.md` y `buzon/pendientes.md`. Lo chico se le pide directo a Claude Code; pasa por Cowork lo que toca una decisión de Alejo o más de un archivo. Donde este archivo o `pendientes.md` dicen DISEÑADOR o PREPARADOR, hoy es Cowork; las cartas viejas con esos nombres quedan en `buzon/` como historia.
- Hay **una sola sesión de Claude Code**: la de la rama `claude/trusting-knuth-brmpsy` (decidido por Alejo el 2026-10-04; la sesión original se retiró). Esa rama es la principal del repo, así que nadie tiene que igualar nada.
- Cada tanda arranca en limpio: Alejo hace `/clear` en Claude Code, cierra el chat de Cowork y abre uno nuevo cuando haya algo para decidir, y pega en cada uno una línea que apunta a su `LEEME_COWORK.md` o `LEEME_CLAUDECODE.md` (ver `buzon/LEEME.md`). La memoria es el repo: al cerrar una tanda hay que dejar `pendientes.md`, `CLAUDE.md` y un reporte al día, y pushear.
- No llenar a Alejo de preguntas. Las decisiones abiertas van a `buzon/pendientes.md` con un valor por defecto y a él se le pregunta solo lo que es suyo y frena el trabajo. Muchas veces va a contestar "dejalo pendiente": está bien.
- Los artifacts, para comparar opciones. El del embudo queda como mapa vivo y se sobrescribe. Un artifact es privado: para pasarle el contexto a otra IA sirve este archivo, no el link.

## Estado

- Capas 1 y 2 hechas: `src/nucleo.js` (funciones puras, sin dependencias), `config/reglas.json`, `config/portales.json`. `npm test` da 185 bien y 1 pendiente a propósito. `npm run demo` dibuja el embudo de un día inventado, con la vía B incluida.
- Vía B (firma reconocida) hecha en el núcleo el 2026-10-04: `config/firmas.json` (vacía, la arma Alejo) y `viaB` en `config/reglas.json`.
- Capa 3 hecha el 2026-10-04: `config/feeds.json` (19 feeds probados), `scripts/probar-feeds.js` (`npm run feeds`), el lector `src/lector.js` y `scripts/leer.js` (`npm run leer`: lee los feeds reales y dibuja el embudo; opciones `--json`, `--umbral`, `--min-comunes`, `--detalle`, `--sin-notas-de-servicio`, `--acumular <archivo>`, `--sin-leer` y `--sin-excluir-rutas`). Con proxy: `NODE_USE_ENV_PROXY=1`.
- Acumular lo leído (2026-10-04): `acumular` en el núcleo y `npm run leer -- --acumular datos/notas.json` (con `--sin-leer` se verifica sobre lo ya guardado, sin pedirle nada a los portales). Guarda 48 h (`ventanaRecoleccionHoras`); la verificación mira 24 h. `datos/` está en `.gitignore`: el repo es público y no se suben las notas.
- Perilla del agrupador (2026-10-04): `umbralSimilitud` 0.3, `umbralSeguro` 0.5 y `minPalabrasComunes` 3 en `config/reglas.json`. Una nota entra a un grupo si se parece al menos 0.5, o si se parece entre 0.3 y 0.5 y comparten 3 palabras. El día de ejemplo da lo mismo con 0.3 que con 0.5 (se comparó la salida de `npm run demo`); el test #22 (misma noticia) no se tocó.
- Notas de servicio con plantilla (2026-10-04): salen en el criterio 1, antes de agrupar y sin contar para verificar. Son 3 moldes en `criterio1.notasDeServicio` de `config/reglas.json` (horario de partido, efemérides, resultados de lotería); en lo descartado llevan el motivo `nota_de_servicio (<nombre>)`. Los moldes son precisos a propósito: no se llevan "a qué hora votan en Brasil" ni "Detienen a funcionarios de la Lotería". `npm run leer` muestra qué sacó el criterio 1 por motivo y tiene `--sin-notas-de-servicio` para comparar antes y después.
- Orden por cantidad de medios (2026-10-04, decidió Alejo): dentro de cada bloque va primero el hecho con más grupos; si empatan, el más nuevo; la vía B va después de toda la vía A. La IA ya no da `impacto`: no se usa y no sale en ninguna lista. Cada noticia de `decidir` trae la `bajada` del medio.
- La página (2026-10-04, capa 5, sobre el día de ejemplo): `pagina/index.html` (un solo archivo, sin librerías, pensada primero para celular) con `pagina/logica.js` (funciones puras: se prueban con `node --test` y andan también en el navegador), `src/entrega.js` (arma lo que muestra la página a partir de lo que devuelve `decidir`) y `npm run pagina`, que arma `pagina/lista.json` con el día de ejemplo (inventado, marcado `ejemplo: true`, se commitea). Las marcas («Nueva», «Te la llevaste») viven en el navegador de cada persona (`localStorage`, clave `7m-marcas-v1`, 24 h). Capturas en `buzon/capturas/`. Para verla: servir la carpeta `pagina/` con cualquier servidor estático.
- Las piezas de la IA (2026-10-04, **todavía no se llama a ningún modelo**): `src/ia.js` con `palabrasPropias`, `paresParaUnir`, `unirHechos`, `preguntaUnion` y `leerUnion`, `preguntaJuicio` y `leerJuicio`, `posiblesDesmentidos`, `buscarGuardado` y `hayQueVolverAPreguntar`; la sección `ia` de `config/reglas.json` (`deportes` sí, `farandula` no, `palabrasDesmentido`, `maxDesmentidos`); y `test/casos-ia.json`, para medir al modelo cuando exista. `preparar` ahora arma cada hecho con `clasificarHecho` (la misma función que usa `unirHechos`, así un hecho unido por la IA se clasifica igual que uno armado por el agrupador) y la ficha lleva `fecha` y `firma` de cada nota. La llamada al modelo la arma Don Julio en n8n (capa 4).
- Excepción a mano para una 4/5 (2026-10-04, solo el núcleo): `preparar` devuelve `elegiblesAMano` (hechos en observación a los que les falta 1 medio, sin firma que los haga entrar por la vía B; `aMano` en `config/reglas.json`: `activa` y `faltanMedios`, hoy 1) y `resumen.elegiblesAMano`. La IA juzga `candidatos` **y** `elegiblesAMano`. `decidir` recibe `elegiblesAMano` y devuelve `aMano: { nacional, internacional }`: los que pasan los criterios 3 a 6, sin cupo, sin topes y sin reserva, con la etiqueta "Confirmada por N medios · elegida a mano". Nunca entran solos a `nacionales` ni a `internacionales`, ni para llegar al mínimo de 3. La vista (el menú "En observación · les falta 1 medio" con "Llevármela igual") es capa 5 y espera el diseño de la entrega.
- Rutas excluidas por feed (2026-10-04): `excluirRutas` en `config/feeds.json` (hoy El Cronista e Infobae). La regla es que la dirección **empiece con** la ruta (`rutaExcluida` en `src/lector.js`). Lo ya guardado se vuelve a filtrar al cargarlo (`filtrarRutas` en `scripts/leer.js`; en n8n, el mismo paso al cargar lo acumulado); el núcleo no sabe de feeds. `--sin-excluir-rutas` (solo con `--sin-leer`) da el "antes" de una medición.
- Los 6 portales sin feed (Reuters, AP, AFP, EFE, La Voz y LN+) quedan `activo: false` en `portales.json`: no suman a la verificación y no avisan "feed roto". El día de ejemplo usa medios argentinos para lo internacional.
- Paquete para pegar en Cowork (2026-10-04): cuando el chat de Cowork dice "no hay nada conectado", Alejo le pega `buzon/paquetes/PEGAR_COWORK.md` (antes había uno por rol; con un solo chat hay un solo paquete). Lo arma `npm run paquete` (`scripts/armar-paquete.js`) con `LEEME_COWORK.md`, `LEEME.md`, `CLAUDE.md`, `pendientes.md` y el reporte más nuevo de Claude Code, tal cual del repo. Es una foto: se rearma al cerrar cada tanda.
- Los valores son la propuesta por defecto. **No son decisiones de Alejo.** Se cambian en `config/`.
- La lista de portales es provisoria: dominios y feeds sin verificar.

## Capa 3 · lo que se probó de los feeds (2026-10-04)

- Andan 19: 13 nacionales + 6 internacionales. Son 17 de los 20 probados (12 tal cual y 5 corregidos) más Noticias Argentinas y Olé, que salieron de `portales.json` y no estaban entre los 20. Los links de cada feed caen en el dominio que ya está en `portales.json`.
- Se corrigieron 5 direcciones de memoria: Infobae, Página/12, El Cronista, La Capital y DW (el español es `rss-sp-all`, no `es`).
- **Sin feed alcanzable:** Reuters (401, DataDome), AP (403, Cloudflare), AFP (solo RSS corporativo, viejo), EFE ("No feed available"), La Voz (403) y LN+ (el portal corta la conexión también con la red completa: se probaron 8 direcciones el 04-10 mientras La Nación responde en 1 s por el mismo camino; se reintenta solo si Alejo lo pide). Se confirmó la sospecha de Reuters, AP y AFP.
- 10 feeds internacionales extra andan (Euronews, RFI, NYT, Sky, NPR, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos) pero su portal no está en la lista blanca: los decide Alejo. Hoy hay 6 grupos internacionales con feed, y dos (The Guardian y Al Jazeera) publican en inglés. El motor cuenta cualquier medio de la lista para cualquier noticia, también los argentinos para una internacional; si eso es lo que Alejo quiere es decisión suya (ver `buzon/pendientes.md`).
- El feed de El Cronista mezcla ediciones de otros países (37 de 100 notas: /espana/, /mexico/, /colombia/, /usa/). Clarín solo trae 10 notas; Olé es solo deportes.
- **El feed de Infobae también mezcla ediciones:** de 341 notas guardadas el 04-10, 282 (83 %) eran de otra edición (`/espana/` 76, `/peru/` 72, `/america/` 69, `/mexico/` 38, `/colombia/` 27) y solo 59 eran argentinas. Se descartan España, Perú, México y Colombia (decidió Alejo); `/america/` queda porque trae internacionales de verdad. La regla de rutas pasó de "aparece en cualquier parte de la dirección" a "la dirección empieza con la ruta": con la primera, `/america/mexico/` se habría caído por `/mexico/`. Siguen quedando 14 notas de otras ediciones que no se nombraron (Estados Unidos, Cuba, Centroamérica).
- Infobae tiene feeds por sección que andan (`/arc/outboundfeeds/rss/category/politica/`, `economia` y `sociedad`): 100 notas argentinas cada uno y entre 76 y 112 horas de cobertura, contra 12 argentinas y 1,3 horas del feed general en la misma lectura. No se sumaron (decide el DISEÑADOR).

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

### Con Infobae sin las ediciones de otros países (2026-10-04, 18:55; 1.277 notas guardadas)

Dos corridas seguidas sobre lo guardado (`--sin-leer`): A con `--sin-excluir-rutas` (el antes) y B con el filtro puesto.

| Hechos según cuántos grupos | A (antes) | B (después) |
|---|---|---|
| 1 grupo | 980 | 819 |
| 2 grupos | 37 | 33 |
| 3 grupos | 8 | 7 |
| 4 grupos | 4 | 4 |
| 5 o más (verificados) | 2 | 2 |
| Hechos en total | 1.031 | 865 |
| Notas | 1.277 | 1.064 |

- Se sacaron 213 notas guardadas (`/espana/` 76, `/peru/` 72, `/mexico/` 38, `/colombia/` 27). Las 2 confirmadas y las 4 de "les falta 1 medio" siguen exactamente igual.
- De los hechos de 3 o más grupos, solo uno pierde a Infobae: "Menú semanal de El Comidista" baja de 3 a 2 grupos (era una unión con la edición de España). Brasil pierde una nota de `/espana/` pero sigue en 6 grupos.
- Desaparecen 4 de los 6 "sorteo" que los moldes no agarraban (Chontico, Triplex de la Once, Super Once, Bonoloto: todos de Infobae `/colombia/` y `/espana/`) y el béisbol de "dónde ver" (`/mexico/`). Quedan las plantillas de TN.
- Ninguna nota de Infobae contiene una de las 4 rutas sin empezar con ella: por ahora "empieza con" y "aparece en cualquier parte" dan lo mismo con estos datos; la diferencia es una protección para `/america/mexico/`.
- Infobae queda con 128 notas que cubren 3,8 horas (69 de `/america/`, 14 de otras ediciones sin nombrar y 45 argentinas).

### Hechos partidos: cuántos pares miraría la IA (2026-10-04, solo medido)

Sobre las mismas notas y con el filtro de Infobae: entran 10 hechos (los de 3 o 4 grupos que siguen en observación) y salen 2 pares: Colapinto (unión de 5 grupos) y la jornada de Brasil (unión de 7). Con los hechos viejos serían 3 pares. Es poco: la sexta pregunta de la IA no cuesta mucho. **Corrección (decidió Alejo después):** el par de Brasil con «Milei sigue con optimismo…» **no** es la misma noticia (el mismo hecho, no el mismo tema); ver «Lo medido para la página y la IA».

### Lo medido para la página y la IA (2026-10-04, noche; 1.064 notas guardadas con el filtro de Infobae)

- **¿Cambia el id de un hecho entre una vuelta de 30 minutos y la siguiente? (M1)** Se rehízo cada 30 minutos con las notas que ya habían salido (96 vueltas, del 3/10 00:12 al 5/10 00:01). De 120 hechos de 4 o más grupos, **120 mantuvieron el id**, 0 lo cambiaron y 0 eran nuevos. Es una aproximación: `fecha` no es cuándo se leyó la nota, y este recorrido siempre agrega notas más nuevas. Con notas que llegan hasta 3 horas tarde (al azar), 103 mantuvieron el id y **1 de 104 lo cambió** (entró una nota más vieja y pasó a ser la primera). Por eso la página reconoce la misma noticia por **una url compartida** y no por el id.
- **Pares para la IA con la regla nueva (M3):** 11 hechos entran (5 de 3 grupos, 4 de 4 y 2 candidatos de vía A) y salen 5 pares; los 5 llegan a 5 grupos. Con la definición de Alejo (el mismo hecho): Colapinto, sí; escrutinio + «voto a voto», sí; escrutinio + Milei, **no**; Milei + García Cuerva (comparten solo el nombre «Milei»), **no**; Milei + «voto a voto», dudoso. El hecho «Milei sigue con optimismo…» está mezclado: su título es de Milei pero 4 de sus 5 notas son del conteo de votos.
- **Chequeado (M2):** su feed anda (`https://chequeado.com/feed/`, 50 notas) pero la más nueva es de hace 40 días y cubre 587 días: no sirve para desmentidos de 48 horas. No se sumó.

## Siguiente paso

La capa 4 con Don Julio: dónde corre n8n, dónde se guarda lo acumulado, la última lista y lo juzgado, dónde vive la página (para que verla no gaste ejecuciones, con un link secreto por cliente) y qué cuenta de IA. Las preguntas para Don Julio y los valores por defecto están en `buzon/pendientes.md`. Con eso, lo que toca código (cargar y guardar lo acumulado, llamar al modelo con `preguntaUnion` y `preguntaJuicio`, armar la lista real en lugar de la del día de ejemplo) se pide en una carta de Cowork. El lector (`src/lector.js`) devuelve notas `{id, titulo, bajada, url, portal, fecha, seccion, etiqueta, firma, feed}`.

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
- Dos ideas, una descartada y una sin resolver (para Cowork, ver `buzon/pendientes.md`): (1) que la verificación no sea "5 fijos" sino un cálculo, por ejemplo con peso por portal: **descartada por Alejo el 04-10-2026: la verificación queda en 5 grupos fijos. Sin peso por portal, sin umbral de puntaje y sin segunda página automática con "Confirmada por 4 medios".** (2) Otras formas de armar la lista de firmas, porque Alejo no tiene nombres a mano: sigue pendiente.
- **Excepción a mano para una 4/5, decidida por Alejo (carta del DISEÑADOR `a`, 04-10-2026), hecha en el núcleo.** No contradice los 5 fijos: la 4/5 nunca entra sola ni cuenta como verificada; la persona la elige a mano y sale marcada "Confirmada por 4 medios · elegida a mano". Los detalles (solo les falta 1 medio, sin cupo ni topes, pasan por la IA y los criterios 3 a 6, en un menú por bloque) son valores por defecto del DISEÑADOR, no decisiones de Alejo. Se cambian en `aMano` de `config/reglas.json`. La vista espera el diseño de la entrega.
- **Notas de servicio con plantilla, decidido por Alejo (04-10-2026), hecho:** salen en el criterio 1 con 3 moldes en `criterio1.notasDeServicio`. No decide deportes: los resultados de los partidos siguen entrando.
- **Infobae, decidido por Alejo (04-10-2026), hecho:** se descartan sus ediciones de España, Perú, México y Colombia, como en el Cronista; `/america/` queda. No toca "qué es INTERNACIONAL": solo decide qué páginas de Infobae cuentan como Infobae.
- **Hechos partidos, decidido por Alejo (04-10-2026, opción A), espera la IA:** la IA que juzga une dos hechos que son la misma noticia y se cuentan juntos, por grupos distintos (Clarín en los dos vale 1). **«La misma noticia» es el mismo hecho: la misma gente, lo mismo que pasó, el mismo día.** No alcanza con el mismo tema: el par «EN VIVO | Elecciones en Brasil: comienza el escrutinio…» + «…Milei sigue con optimismo la elección en Brasil…» es **no** (uno es el conteo de votos, el otro lo que hace Milei); antes figuraba como «sí». El hecho unido sigue el camino normal: con 5 o más grupos sale «Confirmada por N medios», **sin etiqueta distinta**. **Riesgo aceptado por Alejo:** si la IA se equivoca, una noticia podría salir Confirmada sin serlo. Es la sexta pregunta de la IA. Valores por defecto de Cowork, no decisiones de Alejo: solo pares de hechos con 3 o 4 grupos que comparten persona o lugar, **y también un hecho de 3 o 4 con los ya confirmados** (un candidato de vía A solo como pareja, nunca dos candidatos entre sí); la IA contesta sí o no, más una línea de por qué; en lo que se guarda para revisar (no en lo que ve quien usa el botón) queda «unido por la IA: <por qué>» (`unidoPorIA`); la unión va **antes** de armar `candidatos` y `elegiblesAMano` y antes de las otras 5 preguntas. Si una cadena juntaría dos confirmadas, el hecho de 3 o 4 se une solo a la de más grupos y se avisa. Las piezas ya están en `src/ia.js`; falta llamar al modelo (capa 4).
- **La entrega, decidida por Alejo el 04-10 en el chat de Cowork** (hecha sobre el día de ejemplo):
  - **Por dónde le llegan las noticias:** una página con un botón «Traer noticias». Entra desde un link guardado, tilda las que quiere y las copia juntas. No avisa sola. Descartado: Telegram, WhatsApp, mail.
  - **Qué ve al apretar:** siempre lo último. La lista se rehace sola cada 30 minutos, después de cada lectura; las 3 personas del canal ven lo mismo. No hay horarios de corrida. Descartado: horas fijas cada 4 h; armar la lista al apretar.
  - **Lo que ya vio y lo que ya se llevó:** se marca, no se oculta. «Nueva» en lo que no vio; lo que copió baja al fondo, apagado, con la hora. Descartado: ocultar lo llevado; ocultar todo lo visto; no marcar.
  - **Cuántas ve:** hasta el tope (7) y ella tilda. Sin selector en la página; el 3 a 7 queda como ajuste por cliente en `config/`. Descartado: un selector «3 · 5 · 7».
  - **Las 4/5:** abiertas, debajo de cada bloque, con «Llevármela igual». Descartado: plegadas.
- **Las preguntas de la IA, decididas por Alejo el 04-10:** «la misma noticia» es el mismo hecho (la misma gente, lo mismo que pasó, el mismo día), no el mismo tema; **qué ordena el top: cantidad de medios** (no la importancia que pone la IA ni lo más nuevo); **argentinos afuera: por lugar**, el hecho va donde pasó y no según quién lo protagoniza. **Deportes y espectáculos: «dejalo como pendiente»** (por defecto, deportes sí y farándula no). **Dónde corre n8n: «lo hablo con Don Julio».**
- **Lo que Alejo dejó con el valor por defecto («dejalas con el valor por defecto»):** feeds por sección de Infobae (no se suman), las 14 notas de otras ediciones de Infobae (no se tocan), reglas viejas `quiniela` y `horoscopo` (quedan como están) y variantes de servicio (no se suma ningún molde).
- Fechas futuras (decidió el PREPARADOR): no se tocan. El lector ya descarta lo que viene con más de 12 h de adelanto (`FECHA_FUTURA_HORAS`).
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

Lista blanca de medios · **deportes y espectáculos** (pendiente; por defecto: deportes sí, farándula no, en `ia` de `config/reglas.json`) · qué es INTERNACIONAL · topes por sección y por país · policiales sensibles · si se entrega solo título y links o también un resumen con IA.

Ya decididas: qué ordena el top (cantidad de medios), argentinos afuera (por lugar), horarios de las corridas (no hay: siempre lo último, cada 30 minutos) y la excepción manual para una 4/5.

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

**Desde el 04-10-2026 hay un solo chat de Cowork** (antes DISEÑADOR y PREPARADOR). Donde un ítem dice DISEÑADOR o PREPARADOR, es Cowork. Lo que sigue, en este orden (es una sugerencia, no una decisión de Alejo): revisar las capturas de la página y lo medido en el reporte `a` de Claude Code; y la capa 4 con Don Julio, que es lo que hoy frena tener algo que apretar con noticias reales.

**Capa 4 y calidad del agrupador** (medido con datos reales el 04-10, ver `CLAUDE.md`)
- [x] ~~Umbral del agrupador.~~ Hecho: `umbralSimilitud` 0.3 con `umbralSeguro` 0.5 y `minPalabrasComunes` 3. Sobre lo acumulado (1.150 notas) con 0.5 hay 0 verificados y con 0.3 hay 2, sin uniones falsas entre los hechos de 5 o más grupos.
- [ ] **Cuántas noticias da la regla de 5 en un día real** (pide el DISEÑADOR): con lecturas cada 30 minutos de un día entero, por bloque y por corte de 4 h, cuántos hechos llegan a 5 o más grupos, cuántos quedan en 4/5 sin firma y cuántos tienen firma. Las 4/5 que se ofrecerían salen de `resumen.elegiblesAMano` (con lo guardado el 04-10 a las 18:02 son 4, todas frescas). Sin apuro: depende de la capa 4.
- [ ] **Hechos partidos: decidido por Alejo (opción A): la IA los une y se cuentan juntos; espera la IA.** «La misma noticia» es **el mismo hecho: la misma gente, lo mismo que pasó, el mismo día**; no alcanza con el mismo tema. Es la sexta pregunta de la IA. Hecho en el repo, sin llamar a ningún modelo: `paresParaUnir`, `unirHechos`, `preguntaUnion` y `leerUnion` de `src/ia.js`. **Corrección:** el par «EN VIVO | Elecciones en Brasil: comienza el escrutinio…» + «…Milei sigue con optimismo la elección en Brasil…» es **no** (uno es el conteo de votos, el otro lo que hace Milei); antes figuraba como «sí». Medido el 04-10 con la regla nueva (lo guardado hasta el 5/10 00:01, con el filtro de Infobae): entran 11 hechos (5 de 3 grupos, 4 de 4 y 2 candidatos de vía A) y salen **5 pares**: 2 entre hechos de 3 o 4 grupos (Colapinto, unión de 5 grupos, sí; escrutinio + Milei, unión de 7, no) y 3 con un candidato (escrutinio + «voto a voto», unión de 8, sí; Milei + «voto a voto», unión de 9, dudoso; Milei + García Cuerva, unión de 9, no). Los 5 llegan a 5 grupos: por eso la pregunta tiene que ser estricta. Detalle en `ClaudeCode_para_Cowork_2026-10-04_a.md`.
- [ ] **Capa 4 (Alejo con Don Julio): reemplaza «Guardar lo leído entre corridas».** Cada cosa lleva un valor por defecto que se puede cambiar:
  - Dónde corre n8n. Por defecto: n8n Cloud Starter, €20 por mes con 2.500 ejecuciones; leer cada 30 minutos son 1.440 por mes. Ojo: n8n 3.0 sale en octubre de 2026 y en servidor propio exige Docker. (Datos de n8n y de la IA consultados por Cowork el 04-10 en sus páginas oficiales.)
  - Dónde se guarda lo acumulado, la última lista (`pagina/lista.json` en su versión real) y lo juzgado por la IA (los guardados de `src/ia.js`).
  - Dónde vive la página, para que verla no gaste ejecuciones de n8n, y con un link secreto por cliente.
  - Qué cuenta de IA. Por defecto Claude Haiku 4.5, entre US$1 y 5 por mes. Quién la paga.
  - Cómo avisa si una lectura falla, y cómo se separan las pruebas de lo real.
  - La pieza para acumular ya está hecha (`acumular` y `npm run leer -- --acumular datos/notas.json`, 48 h, `datos/` no se sube al repo), y también las piezas de la IA (`src/ia.js`); lo que falta es el pegamento.

**Alejo**
- [ ] **Deportes y espectáculos: pendiente** (Alejo: «dejalo como pendiente»). Por defecto: **deportes sí, farándula no** (`config/reglas.json`, sección `ia`: `deportes` y `farandula`). Esos dos valores entran en el texto de la pregunta de juicio de la IA.
- [ ] Nombres para la lista de firmas (`config/firmas.json`): nombre y si vale para nacional, internacional o los dos. **Sin apuro**: Alejo no los tiene a mano. Mientras esté vacía, la vía B no hace nada. Hay alternativas para Cowork (abajo).
- [ ] Opcional: borrar la rama vieja `claude/quirky-bell-pkumz7`, que ya no se usa. Se hace desde GitHub; Claude Code no la toca.
- [ ] **El repo es público.** Alejo decide si pasa a privado. Revisado el 04-10-2026: no hay claves ni tokens; el historial solo tiene como autor a "Claude <noreply@anthropic.com>" (ningún correo personal); los correos de los tests son inventados; el único workflow de GitHub solo corre `npm test`. Sí se ve: la lógica de verificación y las reglas (lo que se piensa vender), las decisiones de Alejo, y menciones a su hermana, a Don Julio y al plan de vender el programa. La lista de firmas, cuando se llene, también sería pública. Si pasa a privado, confirmar que la app de Claude en GitHub y los chats de Cowork sigan teniendo acceso. **Valor por defecto:** sigue público hasta que Alejo decida. Si pasa a privado, la línea de arranque con el link deja de andar y se vuelve al paquete.
- [ ] Decidir si los 10 feeds internacionales extra entran a la lista blanca (`config/feeds.json`, sección `extras`). Va junto con el riesgo de abajo.
- [ ] **Riesgo en INTERNACIONAL: margen e idioma.** Con solo medios internacionales hay 6 grupos con feed y se exigen 5. Dos de esos 6 (The Guardian y Al Jazeera) publican en inglés y el agrupador compara palabras: sin ellos quedan 4 en español. El motor cuenta hoy cualquier medio de la lista para cualquier noticia (verificado: 3 internacionales + 2 argentinos dan 5 de 5), así que una internacional puede sumar los 11 grupos argentinos. Opciones:
  - A: sumar a la lista blanca los 7 extras en español (Euronews, RFI, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos). Cuesta poco, los feeds ya andan. Ojo: 5 son de España.
  - B: agrupado multilengua, comparar significado y no palabras. Resuelve también The Guardian, Al Jazeera y los extras en inglés (NYT, Sky News, NPR). Más caro: hace falta embeddings o una IA. Es el pendiente de los sinónimos.
  - C: que cuenten los medios argentinos para una internacional, como está hoy, o decidir que no. Es la decisión "argentinos afuera / qué es INTERNACIONAL" de `CLAUDE.md`.
  - Primera medición con datos reales: en las notas leídas, la noticia de Brasil la cubren 10 grupos argentinos y 4 internacionales (2 en inglés, The Guardian y Al Jazeera). Sin contar a los argentinos no se verifica: quedan 2 internacionales en español. Se verifica porque cuentan los medios argentinos.
  - **Valor por defecto si Alejo no decide:** C como está hoy, sin extras, y medir con datos reales cuando exista el lector cuántas internacionales llegan a 5 por corrida. Si son menos de 3 (el mínimo que se puede elegir), pasar a A; B queda para más adelante.

**Cowork (diseño y decisiones; antes DISEÑADOR)**
- [ ] **Revisar la página** (`pagina/index.html`, capturas en `buzon/capturas/`) y **lo medido en el reporte `a`**, en especial M1: si muchos hechos cambian de id entre una vuelta y la siguiente, la regla de «comparte una url» se pone a prueba. Con el replay por fecha dio 0 cambios en 120 hechos; con notas que llegan hasta 3 horas tarde, 1 de 104.
- [ ] **Chequeado como fuente de desmentidos:** el feed anda (`https://chequeado.com/feed/`, 50 notas) pero la más nueva es de hace 40 días y cubre 587 días: son notas editoriales, no las verificaciones del día. **Valor por defecto:** no se suma; los desmentidos salen de las notas acumuladas (`posiblesDesmentidos`).
- [ ] **Detalle conocido de la página:** `medios` (el «4 de 5: La Gaceta · La Nación · …» de las 4/5) sale del grupo de cada link. Si una nota es un cable copiado, el núcleo la cuenta para la agencia pero la página muestra el medio: puede sobrar un nombre. No se arregló.
- [ ] **La pastilla «Nueva» no sale en las 4/5**, solo en las confirmadas (la carta no la pedía ahí). ¿Se suma? **Valor por defecto:** no.
- [ ] **El juicio de un hecho mezclado:** el hecho «A la espera de los primeros resultados, Milei sigue con optimismo…» (4 grupos) tiene un título de Milei pero 4 de sus 5 notas son del conteo de votos. La pregunta de la IA se arma con todas las notas, no solo con el título, pero conviene mirarlo cuando se pruebe el modelo (`test/casos-ia.json`).- [ ] **Caso borde de la vía B con la 4/5:** una 4/5 que entra por la vía B pero cuya firma no vale para su bloque (un autor solo nacional en una noticia internacional) se descarta y no se ofrece a mano. Solo pasa con `firmas.json` llena. **Valor por defecto:** así.
- [ ] **Alternativas a la lista de firmas hecha a mano.** Opciones para pensar:
  - A: la lista manual de hoy.
  - B: reputación por trayectoria. Una firma sería reconocida si aparece firmando en varios portales de la lista blanca durante un período. Se arma sola con el campo `firma` que va a traer el lector y Alejo solo aprueba o descarta. Cuidado: popularidad no es confiabilidad, y habría que sacar firmas genéricas ("Redacción", "Agencias").
  - C: fuentes externas (premios, bases de datos de autores). Sin investigar ni probar.

**Cowork → Claude Code (antes PREPARADOR → Claude Code)**
- Nada pendiente por ahora. Lo que sigue (la capa 4) lo arma Don Julio en n8n; cuando defina dónde corre y dónde se guarda, Cowork escribe el pedido para lo que toque código: cargar y guardar lo acumulado, llamar al modelo con `preguntaUnion` y `preguntaJuicio`, y armar la lista real en lugar de la del día de ejemplo.

**Más adelante**
- [ ] Portales y firmas por país, para vender a otros países (Uruguay, por ejemplo).
- [ ] Fotos y armado de publicaciones (hoy se hace a mano en Canva). Las fotos de los portales tienen derechos: antes de automatizar hay que definir de dónde salen las imágenes.
- [ ] Mejorar el agrupador para notas en otro idioma (hoy compara palabras).
- [ ] Que las personas de un mismo canal vean lo que se llevó cada una (hoy cada una ve lo suyo; hace falta saber quién es quién).
- [ ] Un aviso de «hay nuevas».
- [ ] Noticias reales en la página cuando exista la IA (hoy usa el día de ejemplo y lo dice arriba).

## Hecho

- [x] 04-10-2026 · **La página (capa 5) sobre el día de ejemplo.** `pagina/index.html` con `pagina/logica.js` (funciones puras que se prueban con `node --test`) y `src/entrega.js`; `npm run pagina` arma `pagina/lista.json` (de ejemplo, inventado, se commitea). Lo decidió Alejo: una página con «Traer noticias», siempre lo último (se rehace cada 30 minutos), «Nueva» y «Te la llevaste» (se marca, no se oculta), hasta 7 y ella tilda, las 4/5 abiertas debajo de cada bloque con «Llevármela igual». Capturas en `buzon/capturas/`.
- [x] 04-10-2026 · **Memoria de lo ya entregado:** se resolvió en la página (marcas por persona en su navegador, 24 h, `localStorage`), no en el motor. Se reconoce la misma noticia por una url compartida, no por el id.
- [x] 04-10-2026 · **Orden por cantidad de medios** (decidió Alejo): primero lo que más medios publicaron; si empatan, lo más nuevo; la vía B después de toda la vía A. La IA ya no da importancia (`impacto` no se usa y no sale). Con el orden nuevo cambia cuáles entran por los topes (en el día de ejemplo, E3 y E4 entran y E1 y E2 salen por el tope de economía; I3 entra e I2 sale por el de EEUU).
- [x] 04-10-2026 · **«Argentinos afuera» por lugar** (decidió Alejo): el hecho va donde pasó, no según quién lo protagoniza. Entra en la pregunta 4 de la IA.
- [x] 04-10-2026 · Cada noticia de `decidir` trae la `bajada` del medio.
- [x] 04-10-2026 · **Diseñar las 6 preguntas de la IA** (decisiones 2.1, 2.3 y 2.4 de Alejo) y **las piezas alrededor, sin llamar a ningún modelo** (`src/ia.js`): pares de hechos para unir, `unirHechos` (reclasifica con la misma función que `preparar`), el texto exacto de las preguntas de unión y de juicio, cómo se lee lo que contesta, posibles desmentidos y cómo se reconoce lo ya juzgado. La llamada al modelo la arma Don Julio en n8n (capa 4).
- [x] 04-10-2026 · **Ventanas de tiempo para corridas cada 4 horas:** no hay corridas cada 4 horas; la lista se rehace cada 30 minutos. Quedan 48 h de recolección y 24 h de frescura.
- [x] 04-10-2026 · **Decidió Alejo: «dejalas con el valor por defecto»** (los cuatro quedan como están): feeds por sección de Infobae (no se suman; medidos: 100 notas argentinas cada uno y 76 a 112 horas de cobertura); las 14 notas de otras ediciones de Infobae (no se tocan); reglas viejas `quiniela` y `horoscopo` (quedan sueltas; en 1.277 notas sacaron 0 y 2 y ninguna era noticia); variantes de servicio (no se suma ningún molde nuevo).
- [x] 04-10-2026 · **Alejo pasó de tres bloques a dos: un solo chat de Cowork y Claude Code.** Se juntaron DISEÑADOR y PREPARADOR en `buzon/LEEME_COWORK.md`; las cartas se llaman `Cowork_para_ClaudeCode_*` y `ClaudeCode_para_Cowork_*`; hay un solo paquete (`buzon/paquetes/PEGAR_COWORK.md`); `LEEME.md`, `LEEME_CLAUDECODE.md` y `CLAUDE.md` están al día. `LEEME_DISENADOR.md` y `LEEME_PREPARADOR.md` quedan como avisos que apuntan al nuevo, y las cartas viejas quedan como historia. El motivo: llevar archivos entre tres chats lo mareaba.
- [x] 04-10-2026 · **Infobae sin las ediciones de España, Perú, México y Colombia** (decidió Alejo). `excluirRutas` en su feed, con la regla "la dirección **empieza con** la ruta" (así `/america/mexico/` no se cae por `/mexico/`), y lo ya guardado se filtra al cargarlo (`filtrarRutas` en `scripts/leer.js`; en n8n, el mismo paso al cargar lo acumulado). `npm run leer -- --acumular datos/notas.json --sin-leer --sin-excluir-rutas` da el "antes". Sobre lo guardado: 213 notas sacadas (`/espana/` 76, `/peru/` 72, `/mexico/` 38, `/colombia/` 27), hechos 1.031 → 865, los 2 confirmados y las 4 de "les falta 1 medio" siguen igual, y de los hechos de 3 o más grupos solo uno pierde a Infobae (El Comidista, de 3 a 2 grupos: era una unión con la edición de España). Ver `ClaudeCode_para_PREPARADOR_2026-10-04_k.md`.
- [x] 04-10-2026 · LN+ no anda con la red completa: el portal corta la conexión en las 8 direcciones probadas, mientras La Nación responde en 1 s por el mismo camino. Queda `activo: false` y en `sinFeed`, con el motivo. Se reintenta solo si Alejo lo pide.
- [x] 04-10-2026 · Notas con fecha futura. **Decidido por el PREPARADOR: no se toca.** El lector ya descarta lo que viene con más de 12 h de adelanto (`FECHA_FUTURA_HORAS`); lo de menos de 12 h (Página/12 fecha la edición del lunes a las 00:01) cuenta como fresco un rato más, sin daño visto.
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
ARCHIVO 5 de 5 · buzon/ClaudeCode_para_Cowork_2026-10-04_a.md
============================================================

# Claude Code → Cowork · 04-10-2026 · 22:29 (hora de Argentina) · letra a

Responde a `Cowork_para_ClaudeCode_2026-10-04_a.md`. Es el primer reporte para el chat único de Cowork.

**Veredicto:** hechos los 6 pasos. El orden pasa a cantidad de medios (y cambia qué entra por los topes, como calculaste), cada noticia trae la bajada, la página anda en un navegador de verdad (Chromium, 24 comprobaciones, con capturas) y las piezas de la IA están listas y probadas sin llamar a ningún modelo. Las tres mediciones dieron: los ids no cambian entre vueltas (120 de 120), salen 5 pares para la IA (2 son «no» y 1 es dudoso) y el feed de Chequeado anda pero no sirve para 48 horas. `npm test` pasó de 133 a **185 bien** y sigue 1 pendiente a propósito. `npm run demo` salió idéntica después del Paso 4.

## Qué cambió

| Paso | Commit | Cambio |
|---|---|---|
| guardar | `1000a44` | La carta `a` de Cowork, en `buzon/`. |
| 1 | `6fbdf50` | Orden por cantidad de medios; `impacto` ya no se usa ni sale; ejemplos y demo sin `impacto`. |
| 2 | `42e4df3` | `bajada` en nacionales, internacionales, reserva y a mano. |
| 3 | `38c8461` | `src/entrega.js`, `pagina/` (`index.html`, `logica.js`, `lista.json`), `scripts/armar-pagina.js` + `npm run pagina`, nombres en `portales.json`, 2 archivos de tests, 2 capturas. |
| 4 | `8e9ef8b` | `src/ia.js`, sección `ia` en `reglas.json`, `test/ia.test.js` y `test/casos-ia.json`; en el núcleo, `clasificarHecho` (sale de `preparar`), `nombreDeMedio` y la ficha con `fecha` y `firma`. |
| 5 | (nada) | M1, M2 y M3: scripts fuera del repo. |
| 6 | este commit | `CLAUDE.md`, `README.md`, `pendientes.md`, este reporte y el paquete. |

## Tests, antes y después

| | Antes | Después |
|---|---|---|
| Bien | 133 | **185** |
| Pendiente a propósito | 1 | 1 |
| Paso 1 | | +5 (T1 a T5) |
| Paso 2 | | +1 (la bajada) |
| Paso 3 | | +21 (8 de `entrega` y de `armar-pagina`/`lista.json`; 13 de `logica`) |
| Paso 4 | | +25 (`ia.test.js`, con I1 a I10 y los de unión, desmentidos y guardados) |

Doble pasada: rompí a propósito el código en unos 50 lugares (el orden, la bajada, `haceCuanto`, `limpiar`, `llevadaA`, `unirHechos`, `palabrasPropias`, `leerUnion`, `posiblesDesmentidos`…). Los tests atraparon casi todo; **5 no se atrapaban a la primera** (el borde de 24 h justas en `limpiar`, la regla de STOP con palabras de 3 o más letras, notas repetidas en una unión, `"misma": "true"` como texto y desmentidos repetidos): agregué los casos que faltaban y ahora se atrapan. La primera corrida de `ia.test.js` dio 6 fallos: 4 eran expectativas mal calculadas por mí (las corregí) y 2 eran del código, que arreglé: `fechaCorta` no rellenaba con ceros (`Intl` da `4/10` aunque se pida dos dígitos) y `unirHechos` reordenaba las listas aunque no hubiera uniones.

## Paso 1 · los tests reescritos

| Test | Antes | Ahora |
|---|---|---|
| `decidir: orden por impacto, después más grupos, después más reciente` → `…orden por cantidad de medios y, si empatan, la más reciente` | alta, media-con-mas-grupos, media-reciente, media-vieja, baja | media-con-mas-grupos (8 medios), baja, media-reciente, media-vieja, alta (los otros 4 tienen 5 medios: va la más nueva) |
| `a mano: … ordenadas por impacto, grupos y recencia` → `…por medios y recencia` | a, b, d, c | b, d, a, c |
| `día de ejemplo: de punta a punta` | nacionales N2, N1, N3, E2, E1, N6, NB · internacionales I1, I6, I4, I2, IB · reserva: E3, E4 (tope economía) e I3 (tope EEUU) | nacionales N2, N1, **E4, E3**, N3, N6, NB · internacionales **I6, I1**, I4, **I3**, IB · reserva: **E1, E2** (tope economía) e **I2** (tope EEUU) |
| `día de ejemplo: eligiendo 5 o 3 noticias por bloque` | cupo 5: N2, N1, N3, E2, E1 · I1, I6, I4, I2, IB · por cupo: E3, E4, N6, NB. Cupo 3: N2, N1, N3 · I1, I6, I4 | cupo 5: N2, N1, E4, E3, N3 · I6, I1, I4, I3, IB · por cupo: E1, E2, N6, NB. Cupo 3: N2, N1, E4 · I6, I1, I4 |
| `la vía B va después de la A aunque tenga más impacto…` → `…aunque tenga más medios y sea más nueva…` | B con impacto 3 contra A con 1: sale ['a', 'b'] | B con 9 medios y más nueva contra A con 5: sale igual ['a', 'b'] |
| 7 tests más (tope por sección, por país, cupo 7, desmentido, tope de vía B, segunda página, 4/5 al menú) | usaban `impacto` de relleno | sin `impacto`; la expectativa no cambia (con todo empatado, quedan como llegaron) |

Los 5 nuevos (T1 a T5) son los de tu carta, con tus números. T3 además mira la reserva y el menú a mano, no solo las listas.

## Demo, antes y después (el día de ejemplo)

| # | Nacionales, antes | Nacionales, ahora |
|---|---|---|
| 1 | Paro general de la CGT (6 medios) | Paro general de la CGT (6) |
| 2 | Diputados aprobó el Presupuesto 2027 (6) | Diputados aprobó el Presupuesto 2027 (6) |
| 3 | Aumento de tarifas de luz y gas (5) | **El dólar blue cerró en alza** (5) |
| 4 | Riesgo país récord (5) | **Caen las reservas del Banco Central** (5) |
| 5 | El BCRA subió la tasa (5) | Aumento de tarifas de luz y gas (5) |
| 6 | Alerta de dengue en el norte (5) | Alerta de dengue en el norte (5) |
| 7 | Investigación del puente (vía B) | Investigación del puente (vía B) |

| # | Internacionales, antes | Internacionales, ahora |
|---|---|---|
| 1 | La Fed bajó la tasa (6) | **Terremoto de magnitud 7 en Japón** (7) |
| 2 | Terremoto de magnitud 7 en Japón (7) | **La Fed bajó la tasa** (6) |
| 3 | Brasil y Argentina, acuerdo automotor (5) | Brasil y Argentina, acuerdo automotor (5) |
| 4 | El Senado de EEUU aprobó un plan de gasto (5) | **La Casa Blanca anunció aranceles** (5) |
| 5 | Tratado reservado (vía B) | Tratado reservado (vía B) |

Reserva: antes, dólar blue y reservas del BCRA (tope de economía) y Casa Blanca (tope de EEUU); ahora, riesgo país y tasa del BCRA (tope de economía) y Senado de EEUU (tope de EEUU). Es lo que calculaste. En la demo, `[3]` pasó a `[6 medios]`.

## Paso 3 · la salida de `npm run pagina`

```
nacional        7 noticias · 1 a las que les falta 1 medio · 0 afuera por tope
internacional   5 noticias · 1 a las que les falta 1 medio · 0 afuera por tope
pagina/lista.json · ejemplo: true · generada <la hora de ahora>
```

**Las capturas** están en `buzon/capturas/pagina-2026-10-04-390.png` (390 px) y `pagina-2026-10-04-1200.png` (1200 px), modo claro, con una confirmada tildada y la 4/5 nacional tildada («Sacar»). Son de página entera: la ventana se estiró hasta el alto de la página para que la barra de abajo quede abajo de todo. En el día de ejemplo las bajadas están vacías y `afueraPorTope` da 0: **no se ven esas dos cosas**, como avisabas. No toqué el día de ejemplo.

**Probé la página en Chromium** (Playwright, servida en un puerto local), 24 comprobaciones, todas bien: tildar y la barra («2 elegidas», «Copiar las 2»); la 4/5 dice «Sacar» al tildarla; copiar trae los títulos y los renglones «Medio: url», **sin sello**; después de copiar se destilda todo, lo copiado baja al fondo con «Te la llevaste a las HH:MM», sigue contando para el tope (el título dice `Nacionales · 7`) y aparece «Copiadas. Ya podés pegarlas.»; al recargar nada es «Nueva» y lo llevado sigue apagado; «Traer noticias» no pierde lo tildado; con el portapapeles bloqueado aparece el cuadro con el texto; una lista de hace 2 h 5 min dice «Actualizada hace 2 h 5 min» y el aviso ámbar «No se actualiza desde las HH:MM»; una lista que no carga muestra el mensaje y «Reintentar» la trae; sin `localStorage` anda igual, sin marcas; en modo oscuro el fondo cambia; sin errores en la consola.

## Paso 4 · lo hecho, en una línea por pieza

| Pieza | Qué hace |
|---|---|
| `palabrasPropias` | Con tus dos ejemplos da exactamente `brasil, lula` y `colapinto, gran, premio, malasia`. |
| `paresParaUnir` | Hechos de 3 o 4 grupos más los candidatos de vía A como pareja; dos candidatos nunca forman un par. |
| `unirHechos` | Junta de a grupos, recuenta los grupos (no los suma), reclasifica con la misma función que `preparar`, agrega `unidoPorIA`; con dos confirmadas en la cadena el hecho se une a la de más grupos y se avisa con tu texto. |
| `preguntaUnion` y `leerUnion` | Tu texto tal cual; la respuesta tiene que ser JSON solo o en un bloque ```json, con `misma` true o false y `porque` texto. |
| `preguntaJuicio` y `leerJuicio` | Tu texto, con los deportes y la farándula según `ia`; `bloque` pasa a minúsculas; lo inválido da `null`. |
| `posiblesDesmentidos` | Con tus dos ejemplos (el aguinaldo sí, el dengue de Salta no). |
| `buscarGuardado` y `hayQueVolverAPreguntar` | Por una url compartida; vuelve a preguntar si hay un desmentido nuevo. |

`npm run demo` **idéntica** a la del Paso 2 (`diff` vacío), y lo que devuelve `preparar` es lo mismo salvo la `fecha` y la `firma` de cada nota de la ficha. Los ejemplos de dentro de `preguntaUnion` (Presupuesto, paro de colectivos) no están en `test/casos-ia.json`: hay un test que lo comprueba. En `casos-ia.json` los 4 títulos eran completos en `datos/notas.json` (el de «EN VIVO…» ya terminaba en «a las 19»), así que no hizo falta marcar `incompleto`.

## Paso 5 · las tres mediciones

**M1 · ¿Cambia el id entre una vuelta y la siguiente?** 96 vueltas de 30 minutos (del 3/10 00:12 al 5/10 00:01), con las notas que ya habían salido en cada una y `preparar` con `ahora = t`.

| Hechos de 4 o más grupos | Cantidad |
|---|---|
| (a) mismo `id` | **120** |
| (b) otro `id` pero comparte una url | 0 |
| (c) no comparte nada (nuevo) | 0 |

Si se compara solo con los de 4 o más grupos de la vuelta anterior, son 114 (a), 0 (b) y 6 (c); los 6 ya existían como hecho más chico (crecieron de 3 a 4 grupos). **Caso b: no hay ninguno que mostrar.** Pero esto está sesgado a que salga bien: `fecha` es cuándo salió la nota, no cuándo se leyó, y en este recorrido solo se suman notas más nuevas, así que el agrupador (que va por fecha) arma siempre el mismo comienzo. Para ponerlo a prueba hice una variante con retraso: cada nota aparece hasta 1 o 3 horas después de su fecha, al azar (siempre la misma para la misma nota).

| Retraso máximo | Hechos de 4 o más grupos | (a) mismo id | (b) otro id, misma url | (c) nuevo |
|---|---|---|---|---|
| 0 h | 120 | 120 | 0 | 0 |
| 1 h | 116 | 116 | 0 | 0 |
| 3 h | 104 | 103 | **1** | 0 |

El único (b): «A la espera de los primeros resultados, Milei sigue con optimismo…» (4 grupos), el 4/10 a las 19:42. El `id` pasó de la nota de El Cronista a la de Infobae porque entró tarde una nota más vieja. Con la regla «comparte una url» la página lo sigue reconociendo.

**M2 · ¿Chequeado tiene feed?** Anda: `https://chequeado.com/feed/` da 200, RSS, **50 notas**. Pero cubre **14.089 horas** (587 días, del 15/1/2025 al 25/8/2026) y la más nueva es de hace 40 días: son notas editoriales, no las verificaciones del día. Tres títulos: «Nueva investigación: ¿Quiénes son más vulnerables a las desinformaciones sobre salud?» (25/8), «Una comunidad que banca lo verdadero: esto también es gracias a vos» (7/8), «Evaluar chatbots, un desafío metodológico…» (31/7). No sirve para desmentidos de 48 horas y **no lo sumé** a `config/`.

**M3 · los pares con la regla nueva** (`ahora` = la nota más nueva, 5/10 00:01): **11 hechos entran** (5 de 3 grupos, 4 de 4 y 2 candidatos de vía A), **5 pares**: **2 entre hechos de 3 o 4** y **3 con un candidato**. Los 5 llegan a 5 grupos.

| # | Hecho A | Hecho B | Comunes | Unión | Mi juicio (el mismo hecho) |
|---|---|---|---|---|---|
| 1 | Milei sigue con optimismo la elección en Brasil (4 grupos) | Nuevo mensaje de García Cuerva para Milei en la misa de Luján (6, candidato) | milei | 9 | **no**: comparten solo un nombre |
| 2 | Milei sigue con optimismo la elección en Brasil (4) | Tras el cierre de los comicios, Lula y Flávio Bolsonaro disputan voto a voto (6, candidato) | brasil, bolsonaro, flavio, lula | 9 | **dudoso**: 4 de las 5 notas del hecho de Milei son del conteo de votos, pero el título es de Milei |
| 3 | EN VIVO: comienza el escrutinio y Lula habla con la prensa (3) | Tras el cierre de los comicios… voto a voto (6, candidato) | brasil, lula | 8 | **sí** |
| 4 | EN VIVO: comienza el escrutinio y Lula habla con la prensa (3) | Milei sigue con optimismo la elección en Brasil (4) | brasil, lula | 7 | **no** (por tu definición: uno es el conteo, el otro lo que hace Milei) |
| 5 | Colapinto luego de finalizar 13° en el Gran Premio de Malasia (4) | Una carrera loca… en Sepang (4) | colapinto, gran, premio, franco, bahrein | 5 | **sí** |

**Controles:** sale Colapinto con **5** (La Gaceta, La Nación, Clarín, Página/12 y La Capital); sale el escrutinio con «voto a voto» (par 3); y sale el escrutinio con Milei (par 4) y mi juicio es «no». Como detalle, en el par 5 «gran» y «premio» entran como «propias» solo porque van con mayúscula en «Gran Premio».

**Lo que se ve:** la regla de «una palabra propia en común» deja pasar pares que no son (el 1 y el 4), y los 5 llegan a 5 grupos. La pregunta de la IA tiene que ser estricta: si contesta «sí» donde no, una noticia sale «Confirmada» sin serlo.

## Qué decidió Claude Code por su cuenta (para revisar)

- **Las horas:** agregué `hourCycle: 'h23'` al `toLocaleTimeString` de tu carta, para que sea siempre de 24 horas y no salga «24:05» ni «12:00 p. m.». Es lo único que cambia de esa llamada.
- **Las marcas:** `marcarVistas` pone la hora de la última vez que se vio (no la primera), así una noticia que se sigue viendo no vence a las 24 h. `marcarLlevadas` agrega una entrada nueva cada vez, y `llevadaA` devuelve la hora de la primera, como pedías.
- **Si el portapapeles falla:** las elegidas igual pasan a «llevadas» (el texto queda en el cuadro) y el mensaje cambia a «No se pudo copiar solo. Copialo desde acá».
- **En la página:** las 4/5 también muestran sus links (no los pedías, y sirven para leer las fuentes); la pastilla «Nueva» **no** sale en las 4/5; con 0 elegidas la barra dice «0 elegidas» y el botón «Copiar», apagado; con una sola confirmada afuera, el texto dice «1 confirmada más quedó afuera por el tope de 7».
- **`nombreDeMedio`** (el criterio de `links[].medio`) lo puse en el núcleo y lo usan la entrega y las preguntas de la IA, para que no haya dos copias. También exporté `clasificarHecho` y `STOP`.
- **`unirHechos`:** una unión directa entre dos candidatos se ignora sin aviso (el aviso es solo para las cadenas); los ids que no existen se ignoran; los hechos nuevos entran en la lista antes del primero que es más nuevo, y lo que no cambió queda donde estaba; con varias confirmadas en la cadena, cada una (de la de más grupos a la de menos) se queda con lo que alcanza sin pasar por otra confirmada.
- **`paresParaUnir`:** los 3 y 4 grupos van fijos (constantes arriba de `src/ia.js`). Si dos pares empatan en grupos de unión, salen en el orden en que se armaron (primero los de observación, después los candidatos).
- **`leerJuicio`:** sin la clave `bloque` da `null` (falta); sin `porque` vale `{}`. **`leerUnion`** es estricta: texto antes o después del JSON da `null`.
- **`test/casos-ia.json`** lleva una clave `_aviso` y el caso de bloque de «Milei sigue con optimismo…» como **nacional**, tal como lo escribiste. Una duda para vos: con la decisión «por lugar», esa elección pasó en Brasil; Milei la sigue desde Argentina. Si querés que sea «internacional», es una línea.
- **`pagina/lista.json`** que se commitea tiene la hora en que se armó: después de una hora la página va a decir «No se actualiza desde…». Se refresca con `npm run pagina`.
- No toqué el agrupador, `minGrupos`, las ventanas, las rutas de Infobae o del Cronista, las reglas viejas ni los moldes.

## Qué quedó pendiente

| A quién | Qué |
|---|---|
| Cowork | Revisar las capturas y M1 (los ids aguantan, incluso con 3 h de retraso). Mirar los pares de M3: el 1 y el 4 son falsos y llegan a 5. |
| Cowork | Decidir si la pastilla «Nueva» va también en las 4/5, y el caso de bloque de Milei (arriba). Valores por defecto: no y nacional. |
| Cowork | Chequeado no sirve como está (la más nueva es de hace 40 días). Valor por defecto: no se suma. |
| Alejo con Don Julio | La capa 4: dónde corre n8n, dónde se guarda lo acumulado + la última lista + lo juzgado, dónde vive la página y con qué cuenta de IA. Está en `pendientes.md` con valores por defecto. |
| Alejo | Deportes y espectáculos (pendiente; por defecto, deportes sí y farándula no, en `ia`). Lo de siempre: lista de firmas, lista blanca, repo público o privado. |

No se hizo, como pedía la carta: llamar a un modelo ni guardar claves, n8n y dónde se guardan las cosas, noticias reales en la página, sumar Chequeado, tocar el agrupador y lo demás de la lista, y que las personas del canal compartan lo que se llevó.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| Cowork | Recibe este reporte | Mirar las 2 capturas (`buzon/capturas/`) y los pares de M3, y contestar las dudas de arriba | Cuando Alejo se lo pase | Alejo lleva el archivo |
| Alejo | La página ya anda sobre un día inventado | Hablar con Don Julio por la capa 4 (preguntas en `pendientes.md`) | Cuando puedas | Alejo |
| Alejo | Todo guardado y pusheado | `/clear` acá y chat nuevo de Cowork con la línea de siempre | Después de leer | Alejo |

============================================================
FIN DEL PAQUETE
============================================================
