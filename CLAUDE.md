# NOTITAN_7M · contexto para Claude

Al apretar un botón: 7 noticias NACIONALES de Argentina + 7 INTERNACIONALES, cada una verificada en al menos 5 portales, y filtradas por reglas de "entra o no" para facilitarle la tarea a quien publica.

## Cómo trabajamos con Alejo

Alejo es el dueño. No programa. Su tío, Don Julio, sabe de sistemas y sugirió hacerlo en n8n.

- Español rioplatense, breve. Un tema por vez y una sola pregunta por respuesta.
- Cuando se cambia algo, mostrarlo también en gráfico o tabla, no solo escrito. Si pide ejemplos, mínimo 2.
- De adentro hacia afuera: 1 núcleo, 2 motor, 3 datos (portales), 4 orquestación, 5 botón y entrega.
- Cada entrega termina con el molde «▶ QUÉ HACÉS AHORA» (decidió Alejo el 05-10-2026), en el mensaje del chat y nunca en tabla: por cada destinatario, «ESTO mandale a …:» (palabras de Alejo), un recuadro con exactamente lo que se pega (sea una línea o una carta entera, de DESDE ACÁ a HASTA ACÁ) y el molde afuera, con sus cinco campos de una línea (A QUIÉN, QUÉ LE PASÁS, QUÉ ESPERÁS, SE APLICA, A EJECUTAR). Lo que se pega nunca lleva adentro recuadros ni moldes de ejemplo. Detalle en `buzon/LEEME_COWORK.md` («El molde»).
- No poner diagramas con forma de comando dentro de bloques de código: una vez los copió en PowerShell.
- Dice "andá para adelante": no pedirle permiso por cada paso, solo parar si hay algo que solo él puede hacer.
- Trabaja con **dos bloques** (desde el 2026-10-04; antes eran tres, como en su otro proyecto ST: DISEÑADOR, PREPARADOR y Claude Code, y se mareaba llevando archivos entre tres chats): **un solo chat de Cowork** (el modelo más fuerte que haya, esfuerzo al máximo; piensa, le pregunta a Alejo, dibuja con artifacts y escribe el pedido exacto) y **Claude Code** (Sonnet 5.5, ejecuta). **Claude Code habla solo con Cowork, por archivos en `buzon/`** (`Cowork_para_ClaudeCode_*` y `ClaudeCode_para_Cowork_*`). Alejo lleva los archivos de uno a otro. Al empezar: `buzon/LEEME_CLAUDECODE.md` y `buzon/pendientes.md`. Lo chico se le pide directo a Claude Code; pasa por Cowork lo que toca una decisión de Alejo o más de un archivo. Donde este archivo o `pendientes.md` dicen DISEÑADOR o PREPARADOR, hoy es Cowork; las cartas viejas con esos nombres quedan en `buzon/` como historia.
- Hay **una sola sesión de Claude Code**: la de la rama `claude/trusting-knuth-brmpsy` (decidido por Alejo el 2026-10-04; la sesión original se retiró). Esa rama es la principal del repo, así que nadie tiene que igualar nada.
- Cada tanda arranca en limpio: Alejo hace `/clear` en Claude Code, cierra el chat de Cowork y abre uno nuevo cuando haya algo para decidir, y pega en cada uno una línea que apunta a su `LEEME_COWORK.md` o `LEEME_CLAUDECODE.md` (ver `buzon/LEEME.md`). La memoria es el repo: al cerrar una tanda hay que dejar `pendientes.md`, `CLAUDE.md` y un reporte al día, y pushear.
- No llenar a Alejo de preguntas. Las decisiones abiertas van a `buzon/pendientes.md` con un valor por defecto y a él se le pregunta solo lo que es suyo y frena el trabajo. Muchas veces va a contestar "dejalo pendiente": está bien.
- Los artifacts, para comparar opciones. El del embudo queda como mapa vivo y se sobrescribe. Un artifact es privado: para pasarle el contexto a otra IA sirve este archivo, no el link.

## Estado

- Capas 1 y 2 hechas: `src/nucleo.js` (funciones puras, sin dependencias), `config/reglas.json`, `config/portales.json`. `npm test` da 231 bien y 1 pendiente a propósito. `npm run demo` dibuja el embudo de un día inventado, con la vía B incluida.
- Vía B (firma reconocida) hecha en el núcleo el 2026-10-04: `config/firmas.json` (vacía, la arma Alejo) y `viaB` en `config/reglas.json`.
- Capa 3 hecha el 2026-10-04: `config/feeds.json` (19 feeds probados), `scripts/probar-feeds.js` (`npm run feeds`), el lector `src/lector.js` y `scripts/leer.js` (`npm run leer`: lee los feeds reales y dibuja el embudo; opciones `--json`, `--umbral`, `--min-comunes`, `--detalle`, `--sin-notas-de-servicio`, `--acumular <archivo>`, `--sin-leer` y `--sin-excluir-rutas`). Con proxy: `NODE_USE_ENV_PROXY=1`.
- Acumular lo leído (2026-10-04): `acumular` en el núcleo y `npm run leer -- --acumular datos/notas.json` (con `--sin-leer` se verifica sobre lo ya guardado, sin pedirle nada a los portales). Guarda 48 h (`ventanaRecoleccionHoras`); la verificación mira 24 h. `datos/` está en `.gitignore`: el repo es público y no se suben las notas.
- Perilla del agrupador (2026-10-04): `umbralSimilitud` 0.3, `umbralSeguro` 0.5 y `minPalabrasComunes` 3 en `config/reglas.json`. Una nota entra a un grupo si se parece al menos 0.5, o si se parece entre 0.3 y 0.5 y comparten 3 palabras. El día de ejemplo da lo mismo con 0.3 que con 0.5 (se comparó la salida de `npm run demo`); el test #22 (misma noticia) no se tocó.
- Notas de servicio con plantilla (2026-10-04): salen en el criterio 1, antes de agrupar y sin contar para verificar. Son 3 moldes en `criterio1.notasDeServicio` de `config/reglas.json` (horario de partido, efemérides, resultados de lotería); en lo descartado llevan el motivo `nota_de_servicio (<nombre>)`. Los moldes son precisos a propósito: no se llevan "a qué hora votan en Brasil" ni "Detienen a funcionarios de la Lotería". `npm run leer` muestra qué sacó el criterio 1 por motivo y tiene `--sin-notas-de-servicio` para comparar antes y después.
- Orden por cantidad de medios (2026-10-04, decidió Alejo): dentro de cada bloque va primero el hecho con más grupos; si empatan, el más nuevo; la vía B va después de toda la vía A. La IA ya no da `impacto`: no se usa y no sale en ninguna lista. Cada noticia de `decidir` trae la `bajada` del medio.
- La página (2026-10-04, capa 5, sobre el día de ejemplo): `pagina/index.html` (un solo archivo, sin librerías, pensada primero para celular) con `pagina/logica.js` (funciones puras: se prueban con `node --test` y andan también en el navegador), `src/entrega.js` (arma lo que muestra la página a partir de lo que devuelve `decidir`) y `npm run pagina`, que arma `pagina/lista.json` con el día de ejemplo (inventado, marcado `ejemplo: true`, se commitea). Las marcas («Nueva», «Recién confirmada», «Te la llevaste») viven en el navegador de cada persona (`localStorage`, clave `7m-marcas-v1`, 24 h). Lo llevado va apagado salvo el sello y la hora (2026-10-05, Cowork: el sello naranja subió de contraste 2,6 a 5,8). `npm run probar-pagina` (`scripts/probar-pagina.js`) prueba la página en Chromium sobre una copia de `pagina/` (66 comprobaciones; necesita `npm i --no-save playwright`; no entra en `npm test` ni en el workflow de GitHub; con `-- --capturas <nombre>` saca las 3 capturas de `buzon/capturas/`; sin Playwright termina con código 2). Capturas en `buzon/capturas/`. Para verla: servir la carpeta `pagina/` con cualquier servidor estático.
- «Recién confirmada» (2026-10-05, decidió Alejo, opción C): una pastilla verde llena para una tarjeta de la vía A que la persona ya había visto sin la etiqueta «Confirmada por N medios» (como 4/5 o como vía B) y todavía no se llevó. Dura la visita, igual que «Nueva» (desde que abre o recarga la página hasta que la cierra; «Traer noticias» no empieza una visita nueva). Se apoya en `vistasConfirmadas: { url: hora }` del estado (las urls de las tarjetas de la vía A que se mostraron; la vía B y las 4/5 no entran); un estado guardado por la versión anterior, sin esa clave, arranca como copia de `vistas`, así nada ya visto sale como «recién». Las reglas viven en `pagina/logica.js` (`esRecienConfirmada`, `recienConfirmadasDeLaVisita`, `pastillaDe`; esta última es la única que decide qué pastilla se dibuja: nunca dos, «Recién confirmada» gana sobre «Nueva», y lo llevado va sin pastillas); lo que se copia no lleva ninguna. Los sellos: vía A verde, vía B («Respaldada por…») violeta y una 4/5 que se llevó («elegida a mano») naranja, para que no se confundan con «Confirmada». En las 4/5 que quedan abiertas la línea dice «4 de 5 medios» (los nombres ya están en los links).
- Las piezas de la IA (2026-10-04, **todavía no se llama a ningún modelo**): `src/ia.js` con `palabrasPropias`, `paresParaUnir`, `unirHechos`, `preguntaUnion` y `leerUnion`, `preguntaJuicio` y `leerJuicio`, `posiblesDesmentidos`, `buscarGuardado` y `hayQueVolverAPreguntar`; la sección `ia` de `config/reglas.json` (`deportes` sí, `farandula` no, `palabrasDesmentido`, `maxDesmentidos`); y `test/casos-ia.json`, para medir al modelo cuando exista. `preparar` ahora arma cada hecho con `clasificarHecho` (la misma función que usa `unirHechos`, así un hecho unido por la IA se clasifica igual que uno armado por el agrupador) y la ficha lleva `fecha` y `firma` de cada nota. La llamada al modelo la arma Don Julio en n8n (capa 4).
- Excepción a mano para una 4/5 (2026-10-04, solo el núcleo): `preparar` devuelve `elegiblesAMano` (hechos en observación a los que les falta 1 medio, sin firma que los haga entrar por la vía B; `aMano` en `config/reglas.json`: `activa` y `faltanMedios`, hoy 1) y `resumen.elegiblesAMano`. La IA juzga `candidatos` **y** `elegiblesAMano`. `decidir` recibe `elegiblesAMano` y devuelve `aMano: { nacional, internacional }`: los que pasan los criterios 3 a 6, sin cupo, sin topes y sin reserva, con la etiqueta "Confirmada por N medios · elegida a mano". Nunca entran solos a `nacionales` ni a `internacionales`, ni para llegar al mínimo de 3. La vista (el menú "En observación · les falta 1 medio" con "Llevármela igual") es capa 5 y espera el diseño de la entrega.
- Rutas excluidas por feed (2026-10-04): `excluirRutas` en `config/feeds.json` (hoy El Cronista e Infobae). La regla es que la dirección **empiece con** la ruta (`rutaExcluida` en `src/lector.js`). Lo ya guardado se vuelve a filtrar al cargarlo (`filtrarRutas` en `scripts/leer.js`; en n8n, el mismo paso al cargar lo acumulado); el núcleo no sabe de feeds. `--sin-excluir-rutas` (solo con `--sin-leer`) da el "antes" de una medición.
- Los 6 portales sin feed (Reuters, AP, AFP, EFE, La Voz y LN+) quedan `activo: false` en `portales.json`: no suman a la verificación y no avisan "feed roto". El día de ejemplo usa medios argentinos para lo internacional.
- **Etapa 1 (2026-10-09, decidió Alejo; hecha en el repo):** `npm run vuelta` (`scripts/vuelta.js`) hace una vuelta completa sin IA: lee los feeds, acumula en `datos/notas.json` (48 h), arma la lista y deja en `datos/pagina/` lo que algún día se sube al hosting (`lista.json` y copias frescas de `index.html` y `logica.js`), y anota una línea por vuelta en `datos/vueltas.jsonl`. `--cada <min>` repite (la siguiente arranca a esos minutos de que empezó la anterior; Ctrl+C corta), `--sin-leer` rehace la lista con lo guardado sin salir a internet, `--carpeta` cambia dónde vive todo. El candado `datos/vuelta.lock` evita dos vueltas a la vez (25 minutos; se borra al terminar). Códigos: 0 bien, 1 error de uso, 2 ningún feed respondió, 3 candado. La lista real sale `sinIA: true` (la página lo dice en una franja azul): el bloque de cada noticia es provisorio (`src/provisorio.js`: nacional o internacional según el portal y la sección de sus notas, internacional si la mitad o más lo parecen; las secciones están en `provisorio` de `config/reglas.json`) y `datoNuevo` va en `false`, así que lo de más de 24 h se cae por el criterio 2. La IA es la etapa 2. `npm run medir` resume `vueltas.jsonl` por día y por corte de 4 horas (hora de Argentina; un hecho cuenta una vez por corte, en el bloque de su última vuelta). `npm run probar-pagina -- --solo-capturas datos/pagina --capturas <nombre>` saca las 3 capturas con la lista real (68 comprobaciones en la prueba normal). Lo real vive en `datos/` y no se sube al repo. Todavía no corre solo: dónde corre cada 30 minutos lo habla Alejo con Don Julio.
- **Links por medio y la medición en la compu de Alejo (2026-10-09):** en la página cada medio aparece una sola vez en la fila de links, con su primera nota (`links(t)` en `pagina/index.html`; `lista.json` y lo que se copia siguen trayendo todas las notas; valor por defecto de Cowork). `npm run ver` (`scripts/ver.js`) sirve `datos/pagina/` en `http://127.0.0.1:7000/` para verla en esa compu. **El día de medición lo corre Alejo en su compu** (decidió el 09-10): la guía es `docs/CORRER_EN_MI_COMPU.md`; al terminar manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`.
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

La etapa 1 está hecha en el repo. El día de medición lo corre Alejo en su compu (decidió el 09-10; guía en `docs/CORRER_EN_MI_COMPU.md`) y le manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`; con eso Cowork revisa a ojo los bloques por los títulos. Dónde corre de verdad cada 30 minutos (preguntas 1 y 2 de la capa 4) sigue siendo de Alejo con Don Julio. Después vienen la etapa 2 (la IA que juzga, con `preguntaJuicio`), la 3 (la página en su hosting, pregunta 5) y la 4 (la unión de hechos partidos, tras la prueba de 3 veces). Las 14 preguntas de la capa 4 quedaron contestadas por Alejo con los valores por defecto el 2026-10-09 (están en `buzon/pendientes.md`, ítem «Capa 4»). El lector (`src/lector.js`) devuelve notas `{id, titulo, bajada, url, portal, fecha, seccion, etiqueta, firma, feed}`.

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
  - **La pregunta, más estricta (2026-10-05, valor por defecto de Cowork):** `preguntaUnion` suma dos líneas después de la de «Ejemplos:»: una que enseña las dos trampas que aparecieron en la medición (la misma persona con otra cosa que pasó; la reacción no es el hecho) y «Si dudás, contestá false: es mejor dejar dos hechos separados que juntar dos que no son». Una respuesta equivocada «no» cuesta poco (el hecho queda en observación); una «sí» equivocada cuesta mucho (sale una «Confirmada» que no lo es). `test/casos-ia.json` suma `union[4]` (Milei + «voto a voto», `dudoso`) y `union[5]` (Milei + García Cuerva, `false`); los `dudoso` no cuentan para la regla de abajo.
  - **Regla para prender la unión (capa 4, valor por defecto de Cowork):** antes de prenderla con un modelo real, se le hace a ese modelo, con la misma configuración que va a usar n8n, cada caso de unión de `test/casos-ia.json` que no es `dudoso`, **3 veces**. Tiene que acertar las 3 veces en todos. Una respuesta que `leerUnion` no puede leer (`null`) cuenta como error. Si erra una, la unión queda apagada hasta que se arregle la pregunta o se cambie de modelo. Los casos `true` también cuentan, para que «Si dudás, contestá false» no lo vuelva tan desconfiado que no una nada.
- **La entrega, decidida por Alejo el 04-10 en el chat de Cowork** (hecha sobre el día de ejemplo):
  - **Por dónde le llegan las noticias:** una página con un botón «Traer noticias». Entra desde un link guardado, tilda las que quiere y las copia juntas. No avisa sola. Descartado: Telegram, WhatsApp, mail.
  - **Qué ve al apretar:** siempre lo último. La lista se rehace sola cada 30 minutos, después de cada lectura; las 3 personas del canal ven lo mismo. No hay horarios de corrida. Descartado: horas fijas cada 4 h; armar la lista al apretar.
  - **Lo que ya vio y lo que ya se llevó:** se marca, no se oculta. «Nueva» en lo que no vio; lo que copió baja al fondo, apagado, con la hora. Descartado: ocultar lo llevado; ocultar todo lo visto; no marcar.
  - **Cuántas ve:** hasta el tope (7) y ella tilda. Sin selector en la página; el 3 a 7 queda como ajuste por cliente en `config/`. Descartado: un selector «3 · 5 · 7».
  - **Las 4/5:** abiertas, debajo de cada bloque, con «Llevármela igual». Descartado: plegadas.
  - **Una 4/5 que ya vio y sube a confirmada:** «Recién confirmada», que dura esa visita (decidió Alejo el 05-10). Descartado: sin marca; «Nueva» otra vez.
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
