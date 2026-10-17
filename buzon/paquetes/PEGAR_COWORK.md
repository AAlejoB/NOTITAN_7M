PAQUETE PARA PEGAR · COWORK de NOTITAN_7M
Armado el 17/10/26, 15:50 (hora de Argentina) con "npm run paquete".

Para el chat de Cowork: este paquete reemplaza abrir el repo. Son 5 archivos, uno atrás del otro, tal cual están en el repo. Leelos en orden y arrancá como dice el primero (LEEME_COWORK.md).
Lo que escribas (las cartas, con el nombre que indica buzon/LEEME.md) entregalo como texto: Alejo lo pega en el chat de Claude Code, que lo guarda en el repo.

Archivos de este paquete:
1. buzon/LEEME_COWORK.md
2. buzon/LEEME.md
3. CLAUDE.md
4. buzon/pendientes.md
5. buzon/ClaudeCode_para_Cowork_2026-10-17_a.md

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
- **Cada entrega termina como dice «El molde» (abajo)**, nunca con una tabla en su lugar. Lo decidió Alejo el 05-10-2026.
- Distinguís siempre lo que **decidió Alejo** de lo que **propusiste vos** (valor por defecto).
- **Sos incisivo antes de que algo llegue al código.** Buscás lo ambiguo y lo cuestionás. Ejemplo de este proyecto: Alejo dijo "dos o tres escritores" y podía ser 2 o 3 autores por noticia, o 2 o 3 noticias. Se aclara acá, no en el código.
- **Te revisás antes de cerrar la carta.** Antes eran dos chats y el segundo le buscaba los huecos al primero (ejemplo real: una regla de rutas que decía "aparece en cualquier parte" habría tirado `/america/mexico/` por `/mexico/`). Ahora lo hacés vos: releé la carta como si fueras Claude Code con un modelo más chico y fijate si hay algo que se pueda entender de dos maneras.

## El molde

Toda entrega a Alejo termina así (es su skill para cerrar entregas: `que-haces-ahora`, antes `proximo-paso`). Lo que se copia para otro nunca se mezcla con lo que es para Alejo.

- **Un apartado por destinatario**, en el orden en que se hacen. Cada uno empieza con una línea en negrita con las palabras de Alejo: «ESTO mandale a Claude Code:», «ESTO otro mandáselo al próximo chat de Cowork:». Si hay que hacer algo antes, va entre paréntesis en esa misma línea, por ejemplo «(antes hacé /clear ahí)».
- Debajo, **un recuadro** (bloque de código) con exactamente lo que se pega, de DESDE ACÁ a HASTA ACÁ, sea una línea o una carta entera. El recuadro es solo para copiar: nada para Alejo va adentro.
- Debajo del recuadro, **el molde de ese destinatario**, afuera, como cita (cada renglón empieza con `>`): un renglón con el título «▶ QUÉ HACÉS AHORA» y después cinco campos, uno por renglón y en este orden: A QUIÉN, QUÉ LE PASÁS, QUÉ ESPERÁS, SE APLICA, A EJECUTAR.
- **Lo que se pega nunca lleva adentro otro recuadro de ejemplo, otro DESDE ACÁ o HASTA ACÁ, ni un molde**: Alejo lo ve todo junto y no sabe qué es para quién (le pasó el 05-10). Si una carta tiene que mostrar un ejemplo así, lo cuenta con palabras. Si lo que se pega trae otros bloques de código (por ejemplo, líneas de CSS), el recuadro usa un cerco de cuatro acentos graves.
- El molde va en el mensaje del chat, **nunca adentro de una carta, un reporte o un texto para pegar**.
- Las explicaciones para Alejo van antes del primer apartado. Nada entre un recuadro y su molde.
- Una línea por campo. Si un campo necesita dos, son dos pasos: dos apartados.
- «A QUIÉN» dice un nombre (Claude Code, Cowork, Don Julio, «vos mismo», «nadie»). Nunca «quien corresponda».
- «QUÉ ESPERÁS» dice qué tiene que volver, de forma que se reconozca cuando llega.
- «SE APLICA» nombra una condición, no una fecha: «cuando Claude Code pushee el reporte», no «pronto».
- Si no hay nada para mandar, se dice: una línea en negrita «NADA PARA MANDAR», sin recuadro, y el molde con «SE APLICA: nada, esto solo cierra el tema».
- Lo que sigue esperando algo de antes va al final de todo, fuera de recuadros, en una línea que empieza con «SIGUE TRABADO» en negrita: qué, y por quién.
- El molde no repite decisiones ni motivos: quien lee solo los apartados tiene que poder actuar.

## Con quién hablás

- Con Alejo, en este chat.
- Con Claude Code, por archivo, en los dos sentidos. Alejo lleva los archivos de uno a otro.

Lo chico (un número en `config/`, un texto, un error de tipeo) Alejo se lo pide directo a Claude Code. Pasa por acá lo que toca una decisión de Alejo o más de un archivo.

## Qué leer al arrancar

1. `CLAUDE.md`: decisiones de Alejo y estado del proyecto.
2. `buzon/pendientes.md`, completo.
3. Todos los `ClaudeCode_para_Cowork_*` más nuevos que la última carta de Cowork (`Cowork_para_ClaudeCode_*`): puede haber más de uno. Si todavía no hay ninguno, el `ClaudeCode_para_PREPARADOR_*` más nuevo (así se llamaban antes).
4. El dibujo del embudo, si lo necesitás: https://claude.ai/artifact/1x8EynL8rEGJV9i6DyiHFi (es privado de Alejo; si no podés abrirlo, pedíselo).
5. Si Don Julio ya contestó las preguntas de la capa 4 (la página está en `buzon/pendientes.md`, ítem «Capa 4»), leé sus respuestas con la herramienta de datos del artifact (`ArtifactData`, acción `list`, colección `respuestas`): hay un documento por pregunta, de `p01` a `p14`, con `opcion` (la letra que eligió, o vacío), `texto` (lo que escribió) y `actualizado` (la hora). Si la colección está vacía, preguntale a Alejo si las recibió por WhatsApp.

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
- Cada entrega termina con el molde «▶ QUÉ HACÉS AHORA» (decidió Alejo el 05-10-2026), en el mensaje del chat y nunca en tabla: por cada destinatario, «ESTO mandale a …:» (palabras de Alejo), un recuadro con exactamente lo que se pega (sea una línea o una carta entera, de DESDE ACÁ a HASTA ACÁ) y el molde afuera, con sus cinco campos de una línea (A QUIÉN, QUÉ LE PASÁS, QUÉ ESPERÁS, SE APLICA, A EJECUTAR). Lo que se pega nunca lleva adentro recuadros ni moldes de ejemplo. Detalle en `buzon/LEEME_COWORK.md` («El molde»).
- No poner diagramas con forma de comando dentro de bloques de código: una vez los copió en PowerShell.
- Para trabajos delicados o estructurales (diseño, decisiones, cartas grandes), recomendarle siempre el modelo de pensamiento más fuerte que haya y con esfuerzo al máximo, y decirle qué modelo y qué esfuerzo usar en cada lado (pidió Alejo el 14-10-2026).
- Dice "andá para adelante": no pedirle permiso por cada paso, solo parar si hay algo que solo él puede hacer.
- Trabaja con **dos bloques** (desde el 2026-10-04; antes eran tres, como en su otro proyecto ST: DISEÑADOR, PREPARADOR y Claude Code, y se mareaba llevando archivos entre tres chats): **un solo chat de Cowork** (el modelo más fuerte que haya, esfuerzo al máximo; piensa, le pregunta a Alejo, dibuja con artifacts y escribe el pedido exacto) y **Claude Code** (Sonnet 5.5, ejecuta). **Claude Code habla solo con Cowork, por archivos en `buzon/`** (`Cowork_para_ClaudeCode_*` y `ClaudeCode_para_Cowork_*`). Alejo lleva los archivos de uno a otro. Al empezar: `buzon/LEEME_CLAUDECODE.md` y `buzon/pendientes.md`. Lo chico se le pide directo a Claude Code; pasa por Cowork lo que toca una decisión de Alejo o más de un archivo. Donde este archivo o `pendientes.md` dicen DISEÑADOR o PREPARADOR, hoy es Cowork; las cartas viejas con esos nombres quedan en `buzon/` como historia.
- Hay **una sola sesión de Claude Code**: la de la rama `claude/trusting-knuth-brmpsy` (decidido por Alejo el 2026-10-04; la sesión original se retiró). Esa rama es la principal del repo, así que nadie tiene que igualar nada.
- Cada tanda arranca en limpio: Alejo hace `/clear` en Claude Code, cierra el chat de Cowork y abre uno nuevo cuando haya algo para decidir, y pega en cada uno una línea que apunta a su `LEEME_COWORK.md` o `LEEME_CLAUDECODE.md` (ver `buzon/LEEME.md`). La memoria es el repo: al cerrar una tanda hay que dejar `pendientes.md`, `CLAUDE.md` y un reporte al día, y pushear.
- No llenar a Alejo de preguntas. Las decisiones abiertas van a `buzon/pendientes.md` con un valor por defecto y a él se le pregunta solo lo que es suyo y frena el trabajo. Muchas veces va a contestar "dejalo pendiente": está bien.
- Los artifacts, para comparar opciones. El del embudo queda como mapa vivo y se sobrescribe. Un artifact es privado: para pasarle el contexto a otra IA sirve este archivo, no el link.

## Estado

- Capas 1 y 2 hechas: `src/nucleo.js` (funciones puras, sin dependencias), `config/reglas.json`, `config/portales.json`. `npm test` da 380 bien y 1 pendiente a propósito (17-10, página C). `npm run demo` dibuja el embudo de un día inventado, con la vía B incluida.
- Vía B (firma reconocida) hecha en el núcleo el 2026-10-04: `config/firmas.json` (vacía, la arma Alejo) y `viaB` en `config/reglas.json`.
- Capa 3 hecha el 2026-10-04: `config/feeds.json` (19 feeds probados), `scripts/probar-feeds.js` (`npm run feeds`), el lector `src/lector.js` y `scripts/leer.js` (`npm run leer`: lee los feeds reales y dibuja el embudo; opciones `--json`, `--umbral`, `--min-comunes`, `--detalle`, `--sin-notas-de-servicio`, `--acumular <archivo>`, `--sin-leer` y `--sin-excluir-rutas`). Con proxy: `NODE_USE_ENV_PROXY=1`.
- Acumular lo leído (2026-10-04): `acumular` en el núcleo y `npm run leer -- --acumular datos/notas.json` (con `--sin-leer` se verifica sobre lo ya guardado, sin pedirle nada a los portales). Guarda 48 h (`ventanaRecoleccionHoras`); la verificación mira 24 h. `datos/` está en `.gitignore`: el repo es público y no se suben las notas.
- Perilla del agrupador (2026-10-04): `umbralSimilitud` 0.3, `umbralSeguro` 0.5 y `minPalabrasComunes` 3 en `config/reglas.json`. Una nota entra a un grupo si se parece al menos 0.5, o si se parece entre 0.3 y 0.5 y comparten 3 palabras. El día de ejemplo da lo mismo con 0.3 que con 0.5 (se comparó la salida de `npm run demo`); el test #22 (misma noticia) no se tocó.
- Notas de servicio con plantilla (2026-10-04): salen en el criterio 1, antes de agrupar y sin contar para verificar. Son 3 moldes en `criterio1.notasDeServicio` de `config/reglas.json` (horario de partido, efemérides, resultados de lotería); en lo descartado llevan el motivo `nota_de_servicio (<nombre>)`. Los moldes son precisos a propósito: no se llevan "a qué hora votan en Brasil" ni "Detienen a funcionarios de la Lotería". `npm run leer` muestra qué sacó el criterio 1 por motivo y tiene `--sin-notas-de-servicio` para comparar antes y después.
- Orden por cantidad de medios (2026-10-04, decidió Alejo): dentro de cada bloque va primero el hecho con más grupos; si empatan, el más nuevo; la vía B va después de toda la vía A. La IA ya no da `impacto`: no se usa y no sale en ninguna lista. Cada noticia de `decidir` trae la `bajada` del medio.
- *(Historia: la página de casillas del 04-10 y «Recién confirmada» del 05-10, en los dos ítems que siguen, las reemplazó la página C del 17-10; ver el ítem «La página C».)*
- La página (2026-10-04, capa 5, sobre el día de ejemplo): `pagina/index.html` (un solo archivo, sin librerías, pensada primero para celular) con `pagina/logica.js` (funciones puras: se prueban con `node --test` y andan también en el navegador), `src/entrega.js` (arma lo que muestra la página a partir de lo que devuelve `decidir`) y `npm run pagina`, que arma `pagina/lista.json` con el día de ejemplo (inventado, marcado `ejemplo: true`, se commitea). Las marcas («Nueva», «Recién confirmada», «Te la llevaste») viven en el navegador de cada persona (`localStorage`, clave `7m-marcas-v1`, 24 h). Lo llevado va apagado salvo el sello y la hora (2026-10-05, Cowork: el sello naranja subió de contraste 2,6 a 5,8). `npm run probar-pagina` (`scripts/probar-pagina.js`) prueba la página en Chromium sobre una copia de `pagina/` (66 comprobaciones; necesita `npm i --no-save playwright`; no entra en `npm test` ni en el workflow de GitHub; con `-- --capturas <nombre>` saca las 3 capturas de `buzon/capturas/`; sin Playwright termina con código 2). Capturas en `buzon/capturas/`. Para verla: servir la carpeta `pagina/` con cualquier servidor estático.
- «Recién confirmada» (2026-10-05, decidió Alejo, opción C): una pastilla verde llena para una tarjeta de la vía A que la persona ya había visto sin la etiqueta «Confirmada por N medios» (como 4/5 o como vía B) y todavía no se llevó. Dura la visita, igual que «Nueva» (desde que abre o recarga la página hasta que la cierra; «Traer noticias» no empieza una visita nueva). Se apoya en `vistasConfirmadas: { url: hora }` del estado (las urls de las tarjetas de la vía A que se mostraron; la vía B y las 4/5 no entran); un estado guardado por la versión anterior, sin esa clave, arranca como copia de `vistas`, así nada ya visto sale como «recién». Las reglas viven en `pagina/logica.js` (`esRecienConfirmada`, `recienConfirmadasDeLaVisita`, `pastillaDe`; esta última es la única que decide qué pastilla se dibuja: nunca dos, «Recién confirmada» gana sobre «Nueva», y lo llevado va sin pastillas); lo que se copia no lleva ninguna. Los sellos: vía A verde, vía B («Respaldada por…») violeta y una 4/5 que se llevó («elegida a mano») naranja, para que no se confundan con «Confirmada». En las 4/5 que quedan abiertas la línea dice «4 de 5 medios» (los nombres ya están en los links).
- Las piezas de la IA (2026-10-04, **todavía no se llama a ningún modelo**): `src/ia.js` con `palabrasPropias`, `paresParaUnir`, `unirHechos`, `preguntaUnion` y `leerUnion`, `preguntaJuicio` y `leerJuicio`, `posiblesDesmentidos`, `buscarGuardado` y `hayQueVolverAPreguntar`; la sección `ia` de `config/reglas.json` (`deportes` sí, `farandula` no, `palabrasDesmentido`, `maxDesmentidos`); y `test/casos-ia.json`, para medir al modelo cuando exista. `preparar` ahora arma cada hecho con `clasificarHecho` (la misma función que usa `unirHechos`, así un hecho unido por la IA se clasifica igual que uno armado por el agrupador) y la ficha lleva `fecha` y `firma` de cada nota. La llamada al modelo la arma Don Julio en n8n (capa 4).
- Excepción a mano para una 4/5 (2026-10-04, solo el núcleo): `preparar` devuelve `elegiblesAMano` (hechos en observación a los que les falta 1 medio, sin firma que los haga entrar por la vía B; `aMano` en `config/reglas.json`: `activa` y `faltanMedios`, hoy 1) y `resumen.elegiblesAMano`. La IA juzga `candidatos` **y** `elegiblesAMano`. `decidir` recibe `elegiblesAMano` y devuelve `aMano: { nacional, internacional }`: los que pasan los criterios 3 a 6, sin cupo, sin topes y sin reserva, con la etiqueta "Confirmada por N medios · elegida a mano". Nunca entran solos a `nacionales` ni a `internacionales`, ni para llegar al mínimo de 3. La vista (el menú "En observación · les falta 1 medio" con "Llevármela igual") es capa 5 y espera el diseño de la entrega.
- Rutas excluidas por feed (2026-10-04): `excluirRutas` en `config/feeds.json` (hoy El Cronista e Infobae). La regla es que la dirección **empiece con** la ruta (`rutaExcluida` en `src/lector.js`). Lo ya guardado se vuelve a filtrar al cargarlo (`filtrarRutas` en `scripts/leer.js`; en n8n, el mismo paso al cargar lo acumulado); el núcleo no sabe de feeds. `--sin-excluir-rutas` (solo con `--sin-leer`) da el "antes" de una medición.
- Los 6 portales sin feed (Reuters, AP, AFP, EFE, La Voz y LN+) quedan `activo: false` en `portales.json`: no suman a la verificación y no avisan "feed roto". El día de ejemplo usa medios argentinos para lo internacional.
- **Etapa 1 (2026-10-09, decidió Alejo; hecha en el repo):** `npm run vuelta` (`scripts/vuelta.js`) hace una vuelta completa sin IA: lee los feeds, acumula en `datos/notas.json` (48 h), arma la lista y deja en `datos/pagina/` lo que algún día se sube al hosting (`lista.json` y copias frescas de `index.html` y `logica.js`), y anota una línea por vuelta en `datos/vueltas.jsonl`. `--cada <min>` repite (la siguiente arranca a esos minutos de que empezó la anterior; Ctrl+C corta), `--sin-leer` rehace la lista con lo guardado sin salir a internet, `--carpeta` cambia dónde vive todo. El candado `datos/vuelta.lock` evita dos vueltas a la vez (25 minutos; se borra al terminar). Códigos: 0 bien, 1 error de uso, 2 ningún feed respondió, 3 candado. La lista real sale `sinIA: true` (la página lo dice en una franja azul): el bloque de cada noticia es provisorio (`src/provisorio.js`: nacional o internacional según el portal y la sección de sus notas, internacional si la mitad o más lo parecen; las secciones están en `provisorio` de `config/reglas.json`) y `datoNuevo` va en `false`, así que lo de más de 24 h se cae por el criterio 2. La IA es la etapa 2. `npm run medir` resume `vueltas.jsonl` por día y por corte de 4 horas (hora de Argentina; un hecho cuenta una vez por corte, en el bloque de su última vuelta). `npm run probar-pagina -- --solo-capturas datos/pagina --capturas <nombre>` saca las 3 capturas con la lista real (68 comprobaciones en la prueba normal). Lo real vive en `datos/` y no se sube al repo. Todavía no corre solo: dónde corre cada 30 minutos lo habla Alejo con Don Julio.
- **Links por medio y la medición en la compu de Alejo (2026-10-09):** en la página cada medio aparece una sola vez en la fila de links, con su primera nota (`links(t)` en `pagina/index.html`; `lista.json` y lo que se copia siguen trayendo todas las notas; valor por defecto de Cowork). `npm run ver` (`scripts/ver.js`) sirve `datos/pagina/` en `http://127.0.0.1:7000/` para verla en esa compu; con `-- --wifi` (17-10, pidió Alejo) escucha también en el wifi de la casa y escribe las direcciones para abrirla desde el celu (sin login, solo esa red, lo decidido en el celu queda en el celu). **El día de medición lo corre Alejo en su compu** (decidió el 09-10): la guía es `docs/CORRER_EN_MI_COMPU.md`; al terminar manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`.
- **Sitemaps y el bloque local de prueba (2026-10-15):** el lector lee también sitemaps de noticias (`"formato": "sitemap"` en `feeds.json`: título, link, fecha y keywords; sin bajada ni autor); la bajada de un hecho sale de la primera nota que la tenga y la página dice «Sin bajada» cuando ninguna la trae; `npm run vuelta -- --config <carpeta>` corre con otra lista de feeds, portales y reglas (`config/comodoro/`, hoy `config/zona/`: ADNSUR, El Comodorense, Crónica por secciones, El Patagónico y El Chubut; 2 medios para confirmar, sin 1/2 a mano), y cada confirmada de `vueltas.jsonl` lleva sus `medios`. La medición local corrió en la compu de Alejo (15-10 09:45 → 16-10 12:20). Nada entró a la lista blanca.
- **Capa 4 escrita (2026-10-15):** `src/capa4.js` parte la vuelta en `mitadUno` (leer, acumular, preparar, armar las preguntas de juicio) y `mitadDos` (leer las respuestas, guardar juicios, decidir, lista); n8n la corre cada 30 minutos (`n8n/vuelta.json`, con `n8n/correo.json`, `n8n/error.json` y `n8n/prueba-union.json`), guarda lo acumulado y lo juzgado en los datos estáticos del workflow y escribe `lista.json` en `<datos>/pagina/`; `scripts/servir.js` sirve la página con login (mail y contraseña, «olvidé mi clave» por el webhook de correo; usuarios con `scripts/usuario.js` en `<datos>/usuarios.json`, nunca en el repo); la IA es `ia.modelo` de `config/reglas.json`, temperatura 0, y se vuelve a preguntar solo por lo que no tiene juicio, lo que tiene un desmentido nuevo o lo que pasó a viejo; si no contesta, el hecho lleva el juicio provisorio y la página lo dice; aviso por mail con tope de 1 por hora; la unión sigue apagada hasta que `prueba-union` pase 3 de 3. Falta instalarlo en el servidor de Don Julio (`docs/INSTALAR_EN_EL_SERVIDOR.md`). Probado en el entorno de Claude Code con n8n 2.43.6 (npm, Node 24) y la IA falsa (`scripts/ia-falsa.js`): dos vueltas del reloj, 19 feeds, 5 preguntas y después 0. `ia.modelo` es `claude-haiku-4-5`, que la documentación de Anthropic marca «legacy» (retiro no antes del 15-10-2026; el Haiku actual es `claude-haiku-5-5`): ver el reporte `ClaudeCode_para_Cowork_2026-10-15_b.md`.
- **Los anillos de zona: Comodoro y Chubut (2026-10-16, carta `Cowork_para_ClaudeCode_2026-10-16_a.md`):** `config/zona/` (antes `config/comodoro/`) dice qué portal es de Comodoro (`"zona": "local"`: ADNSUR, El Comodorense, Crónica, El Patagónico) y cuál provincial (`"provincial"`: El Chubut), y trae `anillos` y `cruce` en su `reglas.json`. **Decidió Alejo:** Comodoro con 2 medios de Comodoro; Chubut con 2 medios, al menos uno provincial; lo que cumple en los dos va al más chico. Valores por defecto de Cowork: cupo 3 por anillo, sin 1/2 a mano, un anillo vacío no se dibuja, y una noticia de zona que el agrupador une con un hecho nacional de 3 o más grupos («también nacional», `cruce.minGruposNacionales`) no sale en la zona. Las reglas son puras, en `src/zona.js` (`anilloDe`, `tambienNacional`, `decidirZona`). `npm run vuelta -- --cada 30 --zona config/zona` corre lo nacional y la zona en la misma vuelta (notas de zona en `datos/zona/notas.json`; `vueltas.jsonl` suma `zona`; no va con `--config`); `lista.json` suma `orden` (`["local", "chubut", "nacional", "internacional"]`; sin zona, los dos de siempre) y la página dibuja los bloques en ese orden («Comodoro · 1», sin «de 3»). `npm run medir` suma el bloque ZONA por anillo. Dos moldes de servicio nuevos para todos: «pronóstico del tiempo» (no toca las alertas) y «cotizaciones» (reemplaza `^dolar (blue )?hoy`). La capa 4 ya tiene la zona (ver el ítem siguiente). `npm run probar-pagina` hace 90 comprobaciones. Avisos de cortes (opción B de Alejo): las fuentes se probaron (ver el reporte `ClaudeCode_para_Cowork_2026-10-16_a.md`); el bloque se diseña en otra carta.
- **La zona en la capa 4 (2026-10-16, carta `Cowork_para_ClaudeCode_2026-10-16_b.md`):** `mitadUno` y `mitadDos` de `src/capa4.js` reciben `zona` (lo de `cargarConfig('config/zona')`, o `null`) y corren Comodoro y Chubut **sin IA**, como `npm run vuelta -- --zona config/zona`: las notas de la zona viven en los datos estáticos de n8n (`guardado.zona.notas`, 48 h), la lista sale con `orden` de cuatro y la línea con `zona`. En `n8n/vuelta.json` el nodo Rutas trae `configZona` (`config/zona`; vacío = sin zona, como antes); Feeds baja primero los 19 nacionales y después los 8 de la zona. Con eso el servidor de Don Julio muestra los cuatro bloques. El molde «pronóstico del tiempo» no aplica si el título habla de «qué ver», Netflix, series o películas. `docs/PAQUETE_DE_CLIENTE.md` dice qué es de un cliente y dónde vive.
- **El bloque «Avisos» de cortes, Fase A (2026-10-16, carta `Cowork_para_ClaudeCode_2026-10-16_c.md`; decidió Alejo: opción B, un bloque aparte leído de quien corta, arrancar con lo legible, y el cronograma de verano):** `config/zona/avisos.json` (fuentes: la SCPL, `scpl.coop` sin www; servicios, zonas, 72 h sin fin, 12 h después del fin, 5 notas por vuelta) y `config/zona/cronograma-agua.json` (2025-2026, vencido: hoy no muestra nada; lo actualiza Alejo). `src/avisos.js` (puro): lee el listado y las notas de la SCPL, `vale` (el molde sin la condición de lugar), `esAviso` (el molde `cortes.molde` de `config/reglas.json`, aparte de `avisos`, que son los mails), `datosDeAviso` (servicio, programado o avería, día, horario, barrios, zona) y `armarAvisos` (comunicado + notas del mismo corte con `agrupar`; primaria la SCPL; vive 12 h después del fin o 72 h; orden: cortando ahora → lo que viene → sin día; el cronograma suma ayer si sigue cortando, hoy y mañana). Con `--zona` y `avisos.json`, `npm run vuelta` baja el listado y las notas nuevas (lo bajado en `datos/zona/avisos.json`, 30 días, nunca se baja dos veces), **aparta de la zona las notas que son avisos** (no entran a la verificación) y `lista.json` empieza con `avisos`. La línea de `vueltas.jsonl` suma **`cortes`** (no `avisos`, que ya es la lista de avisos de la vuelta). La página dibuja la tarjeta con la pastilla (programado verde, avería naranja, cronograma o sin saber gris), la línea «Jueves 8/10 · desde las 15:00 · 24 h · Zona Norte · 23 barrios: …» (más de 6, «y N más») y copia una sola línea por aviso; una tarjeta sin link (el cronograma) se reconoce por `id:<id>`. `npm run medir` suma AVISOS. Facebook e Instagram no se leen. La Fase B (capa 4) espera que Alejo apruebe la A.
- **Los avisos, carta `d` (2026-10-16; Alejo aprobó la Fase A a las 19:30 y decidió los 4 puntos):** (1) **lo local manda, lo provincial suma solo si nombra el lugar**: una nota de portal va a Avisos si pasa el molde y su portal es `"zona": "local"`, o si el título dice Comodoro o Rada Tilly (`esAvisoDeAca` en `src/avisos.js`); lo que no, sigue como noticia de la zona (el corte de Puerto Madryn de El Chubut se queda en Chubut). (2) **Programado o avería: manda el título**; el cuerpo desempata solo si el título no dice nada (la 2902 sale «Agua · avería»). (3) **«Se normalizó»** (`normaliz\w*` en el molde; `normalizado` si el título dice normaliz o restablec sin palabra de corte): aviso aparte, no se junta con su corte, pastilla verde llena («Agua · se normalizó»), línea «Se normalizó el servicio · Viernes 16/10 · 14:30», vive 6 h (de la SCPL, desde que se bajó) y va al final del bloque. (4) **Una excepción del cronograma reemplaza** el corte normal de su zona más cercano en la misma semana (empate: el anterior); `"suma": true` la agrega. La línea de `vueltas.jsonl` suma `cortes.apartadas` y `cortes.sinLugar`. **Fase B hecha:** `mitadUno` recibe `avisos` (lo que bajó n8n), `notasQueFaltan` (en `src/avisos.js`, la usan `vuelta.js` y n8n) dice qué notas bajar, `guardado.avisos.notas` guarda 30 días; `n8n/vuelta.json` tiene 13 nodos (`Bajar listado`, `Avisos` y `Bajar notas` entre `Bajar` y `Preparar`). `npm run probar-pagina` hace 93 comprobaciones.
- **Los avisos, carta `e` (16-10, 20:15):** el día de un corte sale primero de la fecha pegada a la hora de inicio (lo que sigue a «desde las HH» o «a partir de las HH» hasta la primera coma, punto y coma o punto, 60 caracteres como mucho; el lector entiende también «sábado 17» sin mes: el mes de la publicación, o el siguiente si queda más de 7 días antes); si no hay, lo de antes sobre el texto entero. El 2903 de la SCPL sale «Sábado 17/10». Los lugares que hacen «de acá» un aviso de un portal provincial son `lugares` de `config/zona/avisos.json` (de cada cliente; sin la clave, Comodoro y Rada Tilly).
- **Regla del proyecto (decidió Alejo el 16-10, 16:53): nada se guarda por id de hecho: el id cambia cuando se cae su primera nota. Lo que necesite reconocer la misma noticia usa sus links (la página, `src/ia.js`, `medir`).** Cada confirmado, cada 4/5 y cada confirmado de la zona en `vueltas.jsonl` lleva `urls`; `npm run medir` junta como un mismo hecho las entradas que comparten una url (también en cadena); las líneas viejas, sin `urls`, se cuentan por id.
- **La página C (17-10, carta `Cowork_para_ClaudeCode_2026-10-17_a.md`, Fases A y B; el flujo lo decidió Alejo el 14-10 y el 16-10):** una tarjeta abierta arriba (el pivote) con «Me interesa» · «No por hoy…» (siete motivos en chips; «Otro motivo…» abre un renglón de 120 letras) · «Archivar» en el escalón **Plus**, o «Me interesa» · «Siguiente» en **Normal**; el resto en renglones por bloque (pastilla con los medios, «4/5» en las que les falta 1); pestañas con número (Plus: Por decidir · Me interesa · Archivo · No por hoy; Normal: Por decidir · Me interesa · Pasadas); Deshacer 6 s; «Volver»/«Sacar» en cualquier momento; los avisos en una franja propia arriba con un solo «Me interesa»; «Copiar» se lleva solo «Para llevar», en el orden en que se eligió; la página mira `lista.json` cada 5 minutos y avisa «N nuevas · Ver» sin mover el pivote. La mezcla (una «le falta 1» decidida que sube a confirmada): de Archivo vuelve primera bajo «Subieron a confirmada»; en Me interesa o No por hoy queda con `subio: true` y su línea o pastilla. **Desaparecen** las casillas, «Nueva», «Recién confirmada», el menú «En observación…» con «Llevármela igual» y «Actualizada hace…». La config es `pagina` de `config/reglas.json` (`nombre` «7M», `escalon` «plus», 6 `temas` con `secciones` medidas sobre los datos reales y `palabras`, 7 `motivos`); la zona usa la misma. Cada tarjeta trae `tema` (`temaDe` en `src/entrega.js`: la sección de la IA, si no la de las notas que más se repite, si no una palabra del título, si no «Sin tema») y `hora`; `decidir` y `decidirZona` suman `primera` y `secciones`. Las reglas son puras en `pagina/logica.js` (`repartir`, `pivoteSiguiente`, `aplicarMezcla`, `hayNuevas`, `decidirTarjeta`…); el estado es `7m-decisiones-v2` (`decisiones`, `llevadas`, `subidas`, `temasApagados`; un v1 conserva sus llevadas y se borra). **Fase B:** `GET`/`PUT /decisiones` en `scripts/servir.js` (solo con sesión, tope 256 KB, se normaliza en el servidor, un archivo por persona en `<datos>/personas/`); la página usa el servidor si contesta 200 y el navegador si no (`npm run ver` da 404), y lo dice al pie. Con los datos del 15-16-10, solo el 42,9 % de las notas nacionales y el 17,6 % de las de zona caen en un tema (las secciones de muchos portales son «america», «nota», «noticias»…); en la lista real del 17-10, 15 de 24 tarjetas (internacional, 0 de 5): decide Alejo si suma palabras o espera a la IA. `npm run probar-pagina` hace 82 comprobaciones; capturas `buzon/capturas/pagina-c-2026-10-17-*`.
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

La página C está hecha (Fases A y B). Sigue: Alejo la prueba en su compu con `npm run ver`; la tanda de instalar en el servidor de Don Julio cuando mande los datos (Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_b.md`); después la carta C («Falta una noticia» y «Combinar») y la carta de la pinta.

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

============================================================
ARCHIVO 4 de 5 · buzon/pendientes.md
============================================================

# Pendientes

## Alejo → pendientes · 17-10-2026 · 03:40 · la comodidad y el orden de los enchufes (charlado con Claude Code)

Alejo probó la página C en su compu («está increíble, hay información por todos lados») y preguntó cuándo ponerse con la comodidad (diseño, user experience; celular **y** compu). Claude Code le propuso este orden; **es una propuesta, no una decisión**: Cowork la confirma con Alejo.

| # | Qué | Por qué en ese lugar |
|---|---|---|
| 1 | Cerrar el enchufe 1: instalar en el servidor de Don Julio para que ande solo | Mientras corra solo en la compu de Alejo, lo demás es maqueta |
| 2 | Una semana de uso real (la hermana en el celular, Alejo en la compu), anotando lo que molesta | La comodidad buena sale del uso real, no de adivinar |
| 3 | La carta de la comodidad (la «carta de la pinta» que ya estaba prevista), hecha con esas notas | Se arregla lo que molestó de verdad |
| 4 | Enchufe 2: títulos y resúmenes con IA | Se apoya en la IA del servidor |
| 5 | Enchufe 2,5: videos con voz de IA | Necesita los títulos y resúmenes del 2 |

**Diario de fricción (desde el 17-10):** cada vez que Alejo o su hermana usen la página, anotan cuándo (a) dudaron qué hacía algo, (b) tocaron de más para lograr algo, o (c) buscaron algo que no estaba donde esperaban, y si fue en el celular o en la compu. Esas notas son la entrada de la carta de la comodidad.

Alejo dijo que se siente más cómodo charlando con Claude Code que con Cowork. Lo charlado acá queda en este archivo para que Cowork lo lea.

## Claude Code → pendientes · 17-10-2026 · la página C hecha (Fases A y B)

Reporte `ClaudeCode_para_Cowork_2026-10-17_a.md`. **Para Alejo (no frena nada; valor por defecto «Sin tema»):** con las secciones reales, solo el 42,9 % de las notas nacionales cae en un tema (menos del 60 % que pedía la carta) y el 17,6 % de las de zona; en la lista real del 17-10, 15 de 24 tarjetas (lo internacional, 0 de 5, porque los portales lo publican en secciones como «america», «mundo» o «estados-unidos»). Opciones: sumar `palabras` por tema en `config/reglas.json`, o esperar a la IA (etapa 2), que pone la sección y manda sobre las del portal. Las 10 decisiones chicas de Claude Code están en «Qué decidí por mi cuenta» del reporte, para Cowork.

## Cowork → pendientes · 17-10-2026 · 00:25 · la página C (carta `Cowork_para_ClaudeCode_2026-10-17_a.md`)

Carta de la página C, Fases A (la página) y B (guardado por persona). Alejo la revisó paso a paso la noche del 16-10 sobre el dibujo «7M · Página C final» (artifact privado https://claude.ai/artifact/JbSrztzZDxHhUUpdmMUh8G).

**Decidió Alejo (16-10, 22:50 a 00:20):**

| Qué | Decidió | Porqué (en sus palabras o la analogía que aceptó) |
|---|---|---|
| Qué entra en esta carta | A+B ahora; C («Falta una noticia» y «Combinar») aparte, «hasta que esté comprobado al 100 % que funciona y no contamina nada» | «La bici primero, después el canasto»; quiere hacerlo una sola vez y bien |
| Avisos de cortes en la página nueva | Franja propia arriba, siempre visible, un solo botón «Me interesa» (opción A) | Un corte no se «decide»: alerta; mandarlo a «No por hoy con motivo» no tiene sentido |
| La pinta (colores, bordes) | No en esta carta; carta chica aparte cuando pase su galería | «Es elegir la pintura después de levantar la pared» |
| Los siete motivos de «No por hoy» | Con palabras que se entiendan la primera vez: *Es un dato, no una noticia · Ya la tengo · Opinión o reacción a otra · Está en el bloque equivocado · Ya pasó, llegó tarde · No va con nuestro público · Otro motivo…* | «Si entro por primera vez, “Vieja” y “No es noticia” me parecen el mismo chip» |
| Orden de «Para llevar» y de lo copiado | El orden en que fue eligiendo | Es lo que después pega en ese orden |
| Temas | Por cliente en `config/` (seis de arranque, tope 10, palabras clave opcionales para que un cliente cree el suyo) | Quiere que la persona pueda crear temas propios; crearlos desde la página queda para cuando las decisiones vivan por persona |

**Valores por defecto de Cowork (se cambian):** Canal 2 arranca en Plus; el tema sale de la sección del portal (la IA manda cuando conteste); «Sin tema» se muestra siempre; dentro de cada bloque primero las confirmadas y después las «le falta 1»; el pivote no se mueve al actualizar; la página mira cada 5 minutos y avisa «N nuevas · Ver» sin redibujar; Deshacer 6 segundos; servidor si hay login y navegador si no, un archivo por persona en `<datos>/personas/`; todo por link.

**Abierto (nuevo, de Alejo, sin apuro):**

- **Nombre del producto:** **decidido: Werken · Las 7 Mejores (decidió Alejo el 17-10, 00:45).** `pagina.nombre` en `config/reglas.json` es «Werken» (el encabezado dice «Canal 2 · Werken»; sin la clave sigue «7M»); el lema todavía no se muestra. Antes: Alejo quería cambiarlo por algo más original alrededor de la luz que entra chica y sale alumbrando grande (linterna, cono, anillos). Candidatos de Cowork del 14-10: FOCO, HAZ, VÉRTICE; se charla el 17-10. Mientras tanto «7M», y ya es una línea de config (`pagina.nombre`).
- **Nombre de los escalones:** «Plus» suena a pago extra. Candidatos de Cowork: «Rápida / Completa», «Simple / A fondo». En la página no aparece el nombre; no frena nada.
- **Temas creados por la persona desde la página** (botón «+ tema»): después de la Fase B.
- **Pestañas más prácticas:** las pestañas chicas («Por decidir», etc.) buscarles una forma mejor, inspirada en las páginas más visitadas; va con la carta de la pinta.
- **Tour con globitos** que flotan y se desvanecen al toque, para quien entra por primera vez, y **diapositivas comerciales** (qué hace cada cosa, qué da cada escalón, con parla de venta y sin lo técnico; para su tío o una empresa). Lo pidió el 16-10; se hace cuando la página C esté andando. Es la misma idea del «un solo artifact con todo para mostrar a clientes» del 14-10.
- **Servidor de Don Julio:** el 16-10 avisó por WhatsApp que ya tiene todo listo y está con la seguridad, para que la compu de Alejo entre por SSH y a la web de n8n; «hoy o mañana termino». Cuando mande los datos, es la tanda de instalar (Fase B de la carta del 15-10, `docs/INSTALAR_EN_EL_SERVIDOR.md`). Se puede instalar antes de que termine la página C: la página nueva llega después con un `git pull`.

**Qué viene después:** 1) Claude Code hace esta carta y reporta. 2) Alejo prueba la página nueva en su compu con `npm run ver`. 3) La tanda de instalar en lo de Don Julio, cuando mande los datos. 4) La carta C. 5) La carta de la pinta.

## Claude Code → pendientes · 16-10-2026 · carta `e` hecha

La fecha del corte y los `lugares` en la configuración (reporte `ClaudeCode_para_Cowork_2026-10-16_e.md`). Sin decisiones nuevas para Alejo. Sigue la página C.

## Cowork → pendientes · 16-10-2026 · 19:50 · Fase A aprobada, los 4 puntos y la Fase B

Carta `Cowork_para_ClaudeCode_2026-10-16_d.md`. **Alejo aprobó la Fase A (19:30)** y decidió los 4 puntos del reporte `c`:

| Punto | Decidió Alejo | Porqué (en sus palabras o la analogía que aceptó) |
|---|---|---|
| 1 · Puerto Madryn salió como Comodoro | Lo local entra siempre; lo provincial (El Chubut) solo si el título dice Comodoro o Rada Tilly (18:58) | Misma lógica de los anillos: lo provincial suma, no manda |
| 2 · La avería salió «Agua» a secas | Manda el título; el cuerpo desempata solo si el título no dice nada (19:02) | «Lo que dice el cartel pesa más que la letra chica» |
| 3 · «Se normaliza» no entraba | Opción B: entra como aviso aparte, en verde, con link (19:17). La C (que la tarjeta del corte cambie sola) queda para la etapa 2 | Una familia quiere saber que volvió; es una línea en el molde |
| 4 · La excepción del cronograma sumaba un día | Reemplaza el corte normal de esa zona en la misma semana (19:32). Cree recordar que el 24-12 no cortaron | «Si te cambian el turno de día, no tenés dos turnos»; se confirma con el cuadro 2026-2027 |

Valores por defecto de Cowork en la carta `d`: la condición del punto 1 es el título (no la bajada); un «se normalizó» vive 6 h y va al final del bloque; `"suma": true` en una excepción del cronograma para cuando la SCPL de verdad agregue un corte.

### Abierto (nuevo)

- **Apodos por ciudad** (preguntó Alejo, 18:58): «la ciudad del viento», «la villa», «Km 3»… hoy el molde busca palabras literales y no los reconoce. Para los avisos el riesgo es chico (la SCPL escribe formal); para noticias es tema de la IA (etapa 2). Idea: una lista de apodos por ciudad en `config/zona/`, que cada cliente carga la suya (lo general que Alejo quiere vender). Sin carta todavía.
- **Endurecer «1 fuente alcanza»** si aparece una fake de un portal: «1 portal alcanza salvo que la SCPL diga lo contrario». Sin carta; se mira con los datos de las primeras semanas.
- **Para Cowork (reporte `d` de Claude Code):** las 9 decisiones de «Qué decidí por mi cuenta» quedaron aceptadas por Cowork en la carta `e` (incluida la línea de `src/entrega.js`).

### Resuelto en la carta `e` (16-10, 20:15)

- ~~E13 («vecinos reclaman que se normalice el agua»)~~: se queda como está, con `normaliz\w*` (con z). Un reclamo no es un aviso y la SCPL escribe «se normaliza» con z (Cowork).
- ~~La fecha del 2903 sale viernes~~: el día de un corte sale de la fecha pegada a la hora de inicio («desde las 00:00hs. del sábado 17» → sábado 17); el lector entiende «sábado 17» sin mes. La tarjeta dice «Sábado 17/10 · desde las 00:00 · 18 h».
- ~~«Comodoro o Rada Tilly» escrito en el código~~: pasó a `lugares` de `config/zona/avisos.json`, de cada cliente.

## Cowork → pendientes · 16-10-2026 · 18:07 · los avisos

Lo pide la carta `Cowork_para_ClaudeCode_2026-10-16_c.md`. La Fase A (la vuelta y la página) la hizo Claude Code: reporte `ClaudeCode_para_Cowork_2026-10-16_c.md`. La Fase B (capa 4) espera que Alejo apruebe la A.

**Decidió Alejo (16-10):** opción B, un bloque «Avisos» aparte, leído de quien corta (la SCPL), nunca como noticia verificada por N medios (04:57 y 16:53); arrancar con lo legible: lo que tenga barrio y horario en texto se muestra, lo que no, con título y link (16:53); quiere el aviso con antelación («hoy cortan la luz en zona norte», «de 9 a 15»); el cronograma de verano de la SCPL vale como aviso programado mientras esté vigente (18:06: «es hermoso»).

**Por dónde se entera Alejo de un corte (18:04):** la página de comunicados de la SCPL (`scpl.coop/index.php/site/ver-seccion?id=2`), `comodorohoy.ar/agua`, ADNSUR, la etiqueta «corte de luz» de El Patagónico, y Facebook e Instagram de la SCPL.

| Fuente | ¿Se lee? |
|---|---|
| Comunicados de la SCPL (listado + nota) | Sí: fuente primaria (`config/zona/avisos.json`) |
| ADNSUR, El Patagónico y los otros portales de la zona | Sí: las notas cuyo título pasa el molde `cortes` van a Avisos y no a la verificación |
| Cronograma de verano de la SCPL | Sí: `config/zona/cronograma-agua.json` (2025-2026, vencido: hoy no muestra nada) |
| `comodorohoy.ar/agua` | No: es una página derivada de la SCPL, sirve de modelo del formato |
| Facebook e Instagram de la SCPL | No: piden login y no tienen feed |

**Valores por defecto de Cowork:** 1 sola fuente alcanza; Avisos va primero y vacío no se dibuja; vive 12 h después del fin o 72 h desde que se publicó.

### Abierto

- **Caleta Olivia (SPSE, por el feed de Prensa Santa Cruz) y el gas (Camuzzi no publica):** fuentes a sumar en `config/zona/avisos.json` cuando se decida.
- **El barrio en imagen** de las averías de la SCPL: lo lee la IA en la etapa 2.
- **El cronograma 2026-2027:** Alejo lo carga en `config/zona/cronograma-agua.json` cuando la SCPL lo publique.
- **Para Cowork (lo vio Claude Code en la vuelta real del 16-10; detalle en el reporte `c`):** (1) «Mañana habrá corte programado de energía en zona norte» de El Chubut es de Puerto Madryn y salió como aviso de Comodoro: el molde acepta «zona norte» como lugar y El Chubut es provincial; (2) la avería real de la SCPL (2902) sale como «Agua» y no «Agua · avería» porque el cuerpo dice «tareas»; (3) «SE NORMALIZA EL SERVICIO DE AGUA…» no pasa el molde; (4) el cronograma: qué hacer con el día normal cuando una excepción lo mueve (24-12 → 25-12).

## Cowork → pendientes · 16-10-2026 · 13:02 (hora de Argentina) · la medición y los anillos

No es una carta de cambios: es el registro de las dos mediciones que corrió Alejo en su compu y de lo que decidió con eso. Los cambios están en `Cowork_para_ClaudeCode_2026-10-16_a.md`. La página de Cowork con los números y gráficos: https://claude.ai/artifact/8NAbjuLTQznf7xFe85ccAd (privada de Alejo).

### Lo que dejó la medición nacional (91 vueltas, 14-10 13:18 → 16-10 12:14, hueco del 15-10 07:43 a 09:44)

| Qué | Número |
|---|---|
| Hechos que llegaron a 5 medios en la corrida | 110 (81 nacionales, 29 internacionales) |
| Nuevas y frescas en 24 h (15-10 09:44 → 16-10 09:44) | 45 de 69 nuevas (las otras 24, con notas de más de 24 h) |
| Nuevas frescas por vuelta | 0,9 en promedio, máximo 5; 44 de 91 vueltas sin ninguna |
| 4/5 distintas · llegaron a 5 · nunca | 104 · 58 · 46; espera mediana 2 h (de 0,5 a 13) |
| Lista de Nacionales llena (7) | desde el 14-10 18:43; bajó a 5–6 solo el 16-10 de 04:14 a 07:14 |
| Internacionales en la lista | 1 hasta el 14-10 19:13; después entre 3 y 7 |
| Internacionales que salieron en Nacionales (provisorio) | 17 de 81 (Champions ×3, Lisandro Martínez ×3, Messi en la MLS, inflación de EE.UU., Hilary Swank, Julio Iglesias, Lula y Meta, el Papa ×2, FIFA, Tesla, euro en Chile); al revés 1 |
| La misma noticia partida | el Papa en 18 hechos, Roña Castro 7, la Marcha Universitaria 8, Martín Fierro 4, Lisandro Martínez 3; los 110 hechos son unas 60 noticias |
| Notas de servicio que llegaron a 5 sin molde | Anses «quiénes cobran» ×3 y «cuándo cobro», dólar/euro ×5, el clima de Tucumán, «a qué hora es la Marcha», «ver … en Roja Directa», tres «EN VIVO minuto a minuto», horario del Martín Fierro |
| Viejas que vuelven como nuevas | 16-10 de madrugada: 23 hechos con `viejo: true` aparecen por primera vez (Roña Castro ×4). Pregunta para Claude Code en la carta `a` |
| Feeds caídos | Al Jazeera, 1 vuelta de 91; vuelta más larga 23 s |

### Lo que dejó la medición local (54 vueltas, 15-10 09:45 → 16-10 12:15; 5 portales, 2 medios)

| Qué | Número |
|---|---|
| Hechos que llegaron a 2 medios | 69 (22 ya estaban en la primera vuelta); unas 43 nuevas por día |
| De qué se arma cada par | 42 con 2 o más de Comodoro; 19 con 1 de Comodoro + El Chubut (sin El Chubut no llegan); 8 con 2 de Comodoro + El Chubut |
| Quién aparece en los 69 | Crónica 46 · El Patagónico 32 · El Comodorense 28 · El Chubut 27 · ADNSUR 24 |
| «Misma noticia» a ojo, sobre los 52 pares de `preparar` | 46 sí · 4 dudosas · 2 no; ninguna unión falsa grave |
| No son locales (nacional repetido por portales de Comodoro) | ≈ 17 de 69: el Papa ×5, River ×2, Roña Castro ×2, riesgo país, la multa universitaria, el DNU, «19 de cada 100», Entre Ríos, Flamengo |
| Mismo hecho en dos pares | el crimen de Km 8, los apuñalados del Isidro Quiroga, el pronóstico del viernes, la refinanciación de jubilados |
| Servicio local sin molde | el pronóstico de Comodoro y Rada Tilly llegó a 2 medios las 3 veces |
| Notas del día | 542: El Chubut 166, Crónica 114, ADNSUR 112, El Patagónico 78, El Comodorense 72; 245 sin bajada (los dos sitemaps). El Patagónico trae hora (77 de 78) |
| Cortes | «Cortarán el agua en 23 barrios de Comodoro» llegó a 3 medios (una avería grande); los cortes programados por barrio no aparecieron |

### Las 19 pasadas de Alejo mirando la página (14-10 14:15 → 16-10 11:45)

- Vio 99 noticias nuevas y eligió 48 (45 de las nuevas y 3 viejas aprobadas tarde): **el 45 %** (nacionales 41 %, internacionales 61 %); 2,5 por pasada, mediana 2, máximo 9 (la pasada de las 11:46 del 15, después del hueco).
- **Las 4/5 valen igual que las confirmadas:** aprobó 21 de 47 que estaban en revisión (45 %) y 24 de 52 confirmadas (46 %). Para la página C: mostrarlas está bien; lo que molesta es el desorden.
- Por qué dejó pasar (en cuántas pasadas lo nombra): repetida o derivada de otra («quien dijo qué») 11 · vieja o llegó tarde 5 · poco relevante u otro país 4 · servicio o cotización 3 · fútbol 2. Encaja con los seis chips de «No por hoy»; falta uno: **«derivada / opinión sobre otra noticia»** (se suma a los chips cuando se escriba la página C).
- Aprobó tarde 3 veces una que ya había dejado pasar; a las 17:45 del 15 vio «6 confirmadas quedaron afuera por tope de 7».
- Lo que vio afuera: Caputo llegó 6 h 30 después; PSG 4-2 City llegó 42 h después; Fluminense-Palmeiras y el tráiler de GTA 6, nunca.

### Decidió Alejo (16-10-2026)

1. **Chubut con 2 medios, uno provincial (opción B, 12:51).** Local sigue con 2 de Comodoro; lo que cumple en dos anillos va al más chico. Motivo: con 3, de los 27 hechos del día que tenían a El Chubut entraban 8 y se perdían 19, justo las provinciales; la provincia tiene hoy un solo portal legible. Se vuelve a medir cuando haya más portales de la provincia.
2. **Avisos de cortes: opción B (04:57)**, bloque aparte leído de quien corta, por barrio o zona. Primer paso en la carta `a`: probar las fuentes.
3. Primero lo simple, después lo complejo: la carta `a` no toca la capa 4; la zona se engancha en `src/capa4.js` en la carta siguiente.

### Valores por defecto de Cowork (no son decisiones de Alejo; se cambian)

- «También nacional»: una noticia de zona que el agrupador une con un hecho nacional de 3 o más grupos no se muestra en Comodoro ni en Chubut. Número en `config/zona/reglas.json` (`cruce.minGruposNacionales`). Con 5 se escaparían «Entre Ríos: gas pimienta en el cine» y «Flamengo eliminado»; con 3 cae alguna noticia de Comodoro que levantaron 3 nacionales (no pasó en el día medido). Es la primera respuesta medible al ítem «noticias que tocan dos anillos».
- Cupo 3 por anillo; sin 1/2 a mano; un anillo vacío no se dibuja; Crónica no es obligatoria.
- Moldes nuevos de servicio para todos los anillos: pronóstico del tiempo (no toca las alertas) y cotizaciones (reemplaza `^dolar (blue )?hoy`). Los otros de la tabla (Anses, «a qué hora es», «ver … en Roja Directa», «EN VIVO») esperan a ver si la IA de la etapa 2 los saca sola.

### Abierto (sin resolver, con valor por defecto mientras tanto)

- ~~**Viejas que vuelven como nuevas** (23 el 16-10)~~ — **resuelto:** decidió Alejo (16-10, 16:53): opción B, `medir` cuenta por link, y la regla del proyecto: nada por id. Hecho en la carta `b` (`urls` en cada hecho de `vueltas.jsonl`).
- **Región:** sin portales con feed en Neuquén, Río Negro, Santa Cruz y Tierra del Fuego. Mientras tanto no existe en `config/zona/reglas.json`; se suma como tercer anillo cuando haya 2 portales por provincia.
- **Más portales de Chubut:** Diario Jornada y La Opinión Austral sin feed ni sitemap; Rawson Digital no conecta (14-10). Mientras tanto, El Chubut es el único provincial.
- **X / Twitter como segunda confirmación** (idea de Alejo del 16-10): nunca como medio que suma a los 5; como mucho una señal aparte, tipo vía B. Va a «Más adelante» hasta averiguar costo y reglas de la API; si es caro, no.
- **Avisos de cortes:** fuentes sin probar (paso 8 de la carta `a`); el bloque se diseña con lo que vuelva.
- **Canal 2 y el servidor de Don Julio:** sin respuesta (pedido el 15-10 por WhatsApp). La carta `b` asume Docker, 3 personas, celular.

### Qué viene después

1. Claude Code hace la carta `a` y reporta (incluida la prueba de las fuentes de los cortes y la explicación de los ids).
2. Cuando Don Julio conteste, la Fase B de la carta `b` (instalar la capa 4 en su servidor).
3. Carta `b` hecha: la capa 4 corre la zona; queda la carta `c`: el bloque Avisos (arranca con lo legible: notas locales de corte con 1 medio, horario y barrios del texto, link al comunicado).
4. Carta de la página C (flujo con Normal/Plus, temas, los chips de motivo con «derivada»), ya con los dos anillos adentro.

# Cowork → pendientes · 14-10-2026 · 23:30 (hora de Argentina) · las 14 respuestas de Don Julio

No es una carta de cambios. Don Julio contestó las 14 preguntas de la capa 4 por WhatsApp (la colección «respuestas» de la página quedó vacía). Alejo las cruzó con Cowork una por una. Regla que puso Alejo para leerlas: lo que sienta bases (dónde corre, dónde se guarda, dónde vive la página, cómo se entra, quién paga, el orden) va como lo dijo Don Julio; lo interno lo acomoda Cowork. Esta sección es la base de la carta de la capa 4, que se escribe después de la medición y ANTES que la carta de la página C.

## Decidió Alejo (14-10-2026, 22:45 a 23:28)

1. Todo corre en el servidor de Don Julio: su n8n ya instalado, accesible desde internet (pregunta 1, opción B). Se cae n8n Cloud y los €20 por mes.
2. El código entra por carpeta en ese servidor y n8n lo lee del disco (pregunta 2, opción B); hace falta habilitar NODE_FUNCTION_ALLOW_EXTERNAL (con Docker, montar la carpeta en el contenedor). Un cambio es un git pull. Don Julio no entendió la pregunta (la leyó como «dónde se guardan los datos»); en el WhatsApp se le vuelve a explicar.
3. Los feeds los baja n8n y nuestro código los interpreta (pregunta 3, opción A, como estaba).
4. Lo acumulado, lo juzgado por la IA y la última lista se guardan adentro de n8n si no lo enlentece; plan B, una base de datos en el mismo Linux (pregunta 4, opción A). Supabase sale de la lista. Dato para la carta: hoy ya anda con archivos (datos/) en la compu de Alejo; se nombra, no se propone.
5. La página vive en el mismo servidor que n8n (pregunta 5, opción B; Alejo eligió el mismo servidor y no InMotion). Nada que subir: la lista se escribe en la carpeta que sirve el servidor web.
6. Se entra con mail y contraseña, con «olvidé mi clave» por mail (pregunta 6, opción C). Una sola empresa al principio. El login lo arma Claude Code (pieza chica en Node, sin librerías, en el mismo servidor); a Don Julio se le pide solo una casilla de correo para mandar esos mails.
7. La IA la pagan Alejo y Don Julio con su propia cuenta y el cliente paga un cargo mensual (pregunta 7). El proveedor no cambia: Claude Haiku 4.5. Los planes de servicio (cuántas por día, qué temas, Normal o Plus) son negocio de Alejo y Don Julio y se arman con las perillas que ya existen en config/; para el motor no cambia nada: sigue mirando los portales cada 30 minutos y la página muestra siempre lo último.
8. Cómo avisa si falla: como estaba (pregunta 9, opción C) más lo que sumó Don Julio: la página dice «contactá al administrador» y el aviso llega con el detalle del error. Destinatarios: Alejo y Don Julio.
9. Pruebas contra lo real: un solo workflow hasta que esté fino; después dos, real y pruebas, y lo que anda se clona al real (pregunta 10, termina en A).
10. Primer cliente: Canal 2 (pregunta 11). Canal 2 o Don Julio paga el desarrollo a medida; terminado (versión 1.0), paga un valor mensual con precio preferencial por primer cliente; los demás, otro precio.
11. Orden (pregunta 12): capa 4 primero (poner lo de hoy en el servidor de Julio y conectar la IA), página C después, pieza 2 al final. Da vuelta el orden escrito en la sección de las 22:30.
12. Repo: sigue público (pregunta 13). A Don Julio no le molesta mientras sea seguro.
13. Una sola empresa ahora (pregunta 14); multi-empresa después, por clonado o por licencia por empresa.
14. Las analogías de Alejo y Cowork (anillos, linterna, cono) son solo para entenderse entre ellos: en cartas a Claude Code y mensajes a Don Julio van con nombre real (bloque regional, filtro por tema, portales locales).

## Valores por defecto de Cowork (no son decisiones de Alejo; se cambian)

- Recursos del servidor: con el mínimo de n8n (1 vCPU, 2 GB de RAM) alcanza; 2 vCPU y 4 GB si el equipo comparte; 10 GB libres de disco sobran. 7M hace 48 vueltas por día de menos de 1 segundo y guarda ~0,5 MB.
- Acceso: la gente de Canal 2 entra a la página, nunca a n8n. A n8n entran Alejo y Don Julio; Claude Code necesita un usuario de n8n o SSH para dejar el código.
- Con login, las decisiones de la página C (me interesa, no por hoy con motivo, archivo, «no la vi») pasan a guardarse en el servidor por persona, en vez de localStorage. Esto destraba dos pendientes: «que las personas del mismo canal vean lo que se llevó cada una» y «dónde viajan los motivos de No por hoy».
- Aviso de falla por mail, con la misma casilla que usa el login; tope 1 mail por hora. La página agrega «contactá al administrador» si la última vuelta tiene más de 1 hora.
- El workflow de pruebas escribe en otra carpeta y otra página, nunca en lo que ve Canal 2.
- La prueba de la unión (pregunta 8) la escribe Claude Code como workflow aparte en el n8n de Don Julio, con la misma configuración que lo real; temperatura y tope de tokens los fija Claude Code en la carta. Don Julio no la entendió y no hace falta que la entienda: es interna.
- Seguridad en el servidor: en el repo nunca hay claves ni texto de los portales; la clave de la IA y la casilla de correo viven en las credenciales de n8n y en un archivo de configuración del servidor que no se sube. Como el repo es público, el servidor lo baja con git clone sin permisos.
- Regla para Claude Code: todo lo que es de un cliente vive en config/ (cupo, temas, escalón, usuarios). Así clonar para otra empresa es copiar una carpeta.

## Abierto (sin resolver, con valor por defecto mientras tanto)

- Datos del servidor de Don Julio que faltan para la carta: versión de n8n, si corre con Docker o npm (por el cambio de la 3.0), y cómo se entra (SSH o lo sube él). Se piden en el WhatsApp. Mientras tanto: se asume Docker. **Están en el cuadro 1 de `docs/INSTALAR_EN_EL_SERVIDOR.md`.**
- Canal 2: cuántas personas lo usan y si entran desde el celular o la compu. Entra en el login (usuarios) y en la página C (versión ancha si es compu). Mientras tanto: 3 personas, celular.
- Cuántas horas por semana tiene Don Julio. Mientras tanto: sin plazo.
- Cuánto esperar a un feed lento antes de seguir sin él. Mientras tanto: lo que ya hace el lector.
- Precios de los planes y del mensual de Canal 2: de Alejo y Don Julio.
- Nombre del producto: ~~sigue 7M hasta que Alejo decida~~ **decidido el 17-10, 00:45: Werken · Las 7 Mejores** (ver la sección de la carta del 17-10).

## Qué viene después

1. Alejo manda el WhatsApp a Don Julio (o lo charla en persona) y pega acá las respuestas a lo abierto.
2. Al terminar la medición (16/10 después de las 00:30), Alejo manda a Cowork, de su compu, cinco cosas: la salida de `npm run medir` (nacional), `datos/vueltas.jsonl`, la salida de `npm run medir -- --carpeta datos/comodoro`, `datos/comodoro/vueltas.jsonl` y `datos/comodoro/notas.json` (este último para ver de qué notas se arma cada hecho local; es una foto, no se sube al repo). Cowork revisa a ojo las dos.
   **Leer también `buzon/Cowork_resumen_2026-10-15.md`** (guardado el 16-10 a las 12:40): trae la charla del 16-10 a las 04:55 que todavía no estaba en el repo, con una decisión de Alejo (bloque «Avisos» de cortes de agua, luz y gas, opción B) y qué hace el chat de Cowork con la medición.
3. Cowork escribe la carta de la capa 4 (etapas 1 y 2 en el servidor de Don Julio: vuelta cada 30 minutos, IA que juzga, página de hoy con login, aviso por mail). Después, la carta de la página C.
4. Lo local (reporte ClaudeCode_para_Cowork_2026-10-14_a.md), decidió Alejo el 14-10 a las 23:51: cuando termine la medición (16/10), Cowork escribe una carta chica aparte para Claude Code: sumar al lector la lectura de sitemaps de noticias (título, link y fecha, sin bajada; la página lo dice cuando falta la bajada) y correr desde el entorno de Claude Code un día de medición local con los 3 feeds de Comodoro (ADNSUR, El Comodorense, Crónica sin «energía») más los sitemaps de El Patagónico y El Chubut, para saber cuántas locales llegan a 2 medios por día. Va en paralelo con la carta de la capa 4 y antes de la carta de los anillos, que así se escribe con datos. Correcciones a la lista de candidatos: El Patagónico es de Comodoro (local, no provincial) y La Opinión Austral es de Santa Cruz (cuenta para la Región). ADNSUR y Crónica no traen autor (no sirven para la vía B); El Comodorense sí. **Adelantado el 15-10 (decidió Alejo a las 00:15):** carta `Cowork_para_ClaudeCode_2026-10-15_a.md`, Fase A hecha; la Fase B se pide 24 h después del arranque.

# Cowork → pendientes · 14-10-2026 · 22:30 (hora de Argentina) · el después (audio de Don Julio)

No es una carta de cambios. La medición sigue corriendo en la compu de Alejo hasta el 16/10 después de las 00:30; hasta entonces no se toca la página ni se escribe carta para Claude Code. Esta sección se guarda en buzon/pendientes.md tal cual, arriba de la de las 20:15, y las dos juntas son la base de las cartas de la página nueva.

Dibujo de todo esto (artifact privado de Alejo): https://claude.ai/artifact/LmLyF2NgRYmv73sA5qgkUZ («El después de una noticia»). El tablero «La vida de una noticia» sigue siendo https://claude.ai/artifact/4U1sirot5pTVdMp2jJB6qd y la Opción C https://claude.ai/artifact/477KpBW4ZuXPAPuR8eDv6G.

## Lo que dijo Don Julio (audio del 14-10, transcripto por Alejo)

- La pieza 1 le alcanza tal como está: «con que encuentre la noticia, la compruebe contra los sitios importantes, descarte lo que no va y diga: esta noticia es real, comprobada contra estos medios, listo, con eso ya está».
- El después: tener el texto completo («me imagino que baja el artículo»), pedirle a la IA «re-redactame este texto con otras palabras y en otro orden, y re-redactame un título». De ahí sale una re-redacción «de X cantidad de líneas» con otro título.
- «El mismo título se puede usar para el Facebook un poquito más ampliado, y el mismo título con otro texto para Instagram; para el resto lo vamos reutilizando».
- «En la próxima búsqueda, si encontré una misma noticia, ya fue, no va. Buscate otras, más actuales».
- «El resto es que una IA haga algo y no haga cagada, pero eso se ve después».
- No nombró fotos ni voz.

## Decidió Alejo (14-10-2026, entre las 21:52 y las 22:23)

1. **«Ya fue» = lo que tocaste.** Nada se va de Por decidir por haberla mirado; se va cuando se toca un botón, y siempre con «Deshacer» unos segundos y «Volver» en cada pestaña. Lo que todavía no pasó por el pivote se queda hasta caerse a las 24 h. La marca «visto / no visto» no existe.
2. **Una página, dos escalones.** Normal y Plus en la misma página, elegido por cliente en config/ (campo `escalon`, valores `normal` o `plus`), cambiable después sin tocar código; más adelante, un botón en la página. Igual en los dos: una tarjeta abierta arriba (pivote), sube sola la siguiente, Deshacer, Volver, ningún menú. **Normal:** dos botones, «Me interesa» y «Siguiente» («Siguiente» es «no por hoy» sin preguntar el motivo); pestañas Por decidir / Me interesa / Pasadas; sin motivo, sin Archivo, sin Combinar, sin temas. **Plus:** todo lo de la Opción C (tres botones, motivo, Archivo, Combinar cuando hay una parecida, temas). Esto refina el punto 2 de la sección de las 20:15, no lo reemplaza: la Opción C es el escalón Plus.
3. **Botones con palabras cortas:** «Traer noticias» pasa a «↻ Actualizar» (valor por defecto de Cowork; se cierra con los colores).
4. **Pieza 2, títulos: un título para todo** (opción A). Corto y con gancho, hasta 60 letras, el mismo para Instagram, Facebook y el portal. Se descartó un título por red (B) porque la IA tiene tres chances de errarle. La variante corta derivada del título (C, dibujada con «↳») se agrega solo si Instagram la pide, nunca de entrada. Destinos por ahora: Instagram, Facebook y el portal. La voz y lo demás, después.
5. **«Armar» vive en la misma página.** En Me interesa, cada noticia tiene un botón «Armar»; lo que devuelve la IA (la bandeja) se abre debajo de la misma tarjeta, pieza por pieza, con un «Copiar» por pieza. «Copiar todo» sigue existiendo para quien no arma. La comodidad de la persona se revisa cuando se diseñe la pantalla.
6. **La puerta: la IA lee el artículo completo.** Al tocar «Armar», el sistema baja el cuerpo de hasta 3 notas de los medios que confirmaron la noticia. Si un portal bloquea, sigue con el siguiente de la lista; con 0 cuerpos, la IA escribe con títulos y bajadas y la bandeja lo dice. Reglas: el texto original nunca se muestra ni se copia, solo lo re-escrito; lo bajado se guarda 48 h como todo lo demás y después se borra; las fuentes van siempre al pie.
7. **Plan B por casillero**, con una regla: cuando entra el plan B, la página lo dice, nunca se queda muda. Los casilleros de hoy ya lo tienen (feed roto, 4/5 a mano, sin IA → provisorio, Deshacer/Volver). Los dos nuevos son los de la pieza 2 (punto 6 y valores por defecto).
8. **Largos, como valor límite:** título hasta 60 letras; portal (texto base) 8 a 12 líneas (~150 palabras); Facebook 10 a 15 líneas (~200 palabras); Instagram 4 a 6 líneas (~70 palabras); fuentes 1 renglón, siempre. Una línea son unas 15 palabras en el celular. Se cambian por cliente en config/, como el escalón.
9. **Crédito a los medios:** cada pieza que escribe la IA termina con «Fuentes: …» y sus links, sin opción de sacarlo. La pieza 1 ya copia los links de todos los medios.
10. **Estándar de dibujo y de página:** la flechita «↳» corrida a la derecha quiere decir «de ahí sale» (un derivado).

## Valores por defecto de Cowork (no son decisiones de Alejo; se cambian)

- Entra al quinchito una noticia por vez, la que la persona toca; no todas las de Me interesa juntas.
- El canal de Don Julio arranca en Plus; «normal» queda para quien diga «es mucho bardo».
- Si la IA no contesta o contesta cualquier cosa (sin título, sin fuentes, o texto fuera de largo), se reintenta 1 vez; si falla, «No pude armarla, probá de nuevo» y la tarjeta queda como estaba. Nunca sale una pieza sin título o sin fuentes.
- La bandeja dice con cuántas notas se escribió («escrita con 2 de 3 notas»).
- Sin hashtags ni emojis, salvo que el cliente lo pida.
- Quién publica: la persona copia y pega, como hoy. Que el sistema publique solo no se diseña.
- La pieza 2 usa la misma IA de la etapa 2 (la que juzga), en el mismo lugar donde corra (n8n, capa 4). Por eso va después de la etapa 2, nunca antes.

## Abierto (sin resolver, con valor por defecto mientras tanto)

- **Fotos:** Don Julio no las nombró; Alejo sí. Sigue como ítem de «Más adelante» (derechos de las imágenes). Mientras tanto: la pieza 2 sale sin fotos.
- **Cómo se baja el cuerpo de cada portal:** cada uno arma su página distinto y alguno bloquea. Trabajo para Claude Code después de la medición: probar con los 19 portales de la lista qué cuerpo se puede sacar y anotar los que bloquean. Mientras tanto: nada.
- **Costo de IA por armado:** medir cuántas palabras entran (3 cuerpos) y salen (3 textos) y cuánto cuesta cada «Armar» con el modelo de la capa 4. Mientras tanto: la cuenta de la capa 4 (US$1 a 5 por mes) no lo incluye.
- Respuestas de Don Julio: llegaron el 14-10 por WhatsApp; ver la sección de las 23:30.
- **Un solo artifact con todo, paso a paso** (idea de Alejo, 22:23): al final, juntar tablero, Opción C y «El después» en un solo lugar para mostrar a clientes. Se hace cuando la página nueva esté decidida del todo, no antes.

## Qué cambia respecto de lo ya anotado

- El ítem «Más adelante · la visión a largo plazo» (pieza 2) ahora tiene diseño: puntos 4 a 9 de arriba. La pieza 3 (voz) sigue sin diseñar.
- En Normal no hay motivo de «No por hoy»: los seis chips de motivo son solo del escalón Plus.
- «Traer noticias» (decidido el 04-10) pasa a «↻ Actualizar».

## Qué viene después

1. Al terminar la medición, lo mismo que decía la sección de las 20:15: Alejo manda la salida de npm run medir y datos/vueltas.jsonl; Cowork revisa a ojo.
2. Carta de la página C, en este orden: flujo (con el escalón Normal/Plus), temas, anillos.
3. La pieza 2 (quinchito) va en una carta aparte, después de la etapa 2 (la IA que juzga), con la prueba de bajar cuerpos de los 19 portales adelante de todo.

# Cowork → pendientes · 14-10-2026 · 20:15 (hora de Argentina) · charla de diseño

No es una carta de cambios. La medición corre en la compu de Alejo desde el 14/10 a las 14:15 y se corta el 16/10 después de las 00:30. Hasta entonces no se toca la página ni se escribe carta para Claude Code. Esto se guarda en buzon/pendientes.md tal cual, para que después de la medición se convierta en la carta de la página nueva.

Dibujo de todo esto (artifact privado de Alejo, él lo tiene): https://claude.ai/artifact/477KpBW4ZuXPAPuR8eDv6G

## Decidió Alejo (14-10-2026)

1. Flujo por noticia: primero mirar, después decidir con tres botones (me interesa / no por hoy diciendo el motivo / archivar), y recién al final copiar, solo lo que le interesa. Copiar deja de ser el paso principal.
2. La página es la Opción C: cuatro pestañas con número (Por decidir, Me interesa, Archivo, No por hoy). En Por decidir hay una sola tarjeta abierta, siempre arriba, en un lugar fijo (pivote), con sello de medios, hora, título, bajada, un link por medio y los tres botones grandes. Las demás son renglones de un título con la cantidad de medios. Al decidir la abierta, se va a su pestaña y sube sola la siguiente; tocar un renglón lo sube al pivote. Los bloques siguen como títulos en la lista y en el avance («1 de 5 · Nacionales»). La pastilla «Nueva» desaparece: lo nuevo es lo que está en Por decidir.
3. Combinar dos noticias: la página combina, pero solo noticias del mismo tema (nunca cualquier cosa con cualquier cosa). La página propone y la persona decide: acepta, corrige el texto o las deja separadas. La última palabra es siempre de quien publica.
4. Temas: el motor NO descarta ninguna noticia por su tema; si está verificada, pasó. Esto cambia el valor por defecto de hoy en ia de config/reglas.json (farandula: no dejaba afuera la farándula): la IA no bloquea por tema. Los temas son un filtro en la página, con botones que se prenden y apagan; cómo arranca cada botón se fija por cliente en config/; la persona los cambia en la página cuando quiere. Lo apagado se oculta pero se cuenta («2 ocultas por tema · ver») y nunca se pierde. Sin buscador por ahora.
5. Anillos: la noticia vive en anillos, del más chico al más grande, y son 5: Local (ciudad) → Provincial (Chubut) → Región (Patagonia) → Nacional → Internacional. «Región» es la palabra. Cada anillo es un bloque con su propio número de medios para confirmar, su propia lista de portales que cuentan y su propio cupo. El «5» de hoy es el número del anillo nacional y del internacional, no una regla general. La Región va prendida desde el principio, no después. Portales locales a sumar: Comodoro Rivadavia, Caleta Olivia, Chubut.
6. Región, qué cuenta y cuánto hace falta: en la lista blanca entran solo 2 portales por provincia de la región (Neuquén, Río Negro, Santa Cruz, Tierra del Fuego) más los que ya tenga Chubut. Una noticia es regional cuando la cubren 2 medios de 2 provincias distintas; Chubut cuenta como una provincia más (un portal de Trelew y uno de Neuquén la hacen regional; tres portales de Chubut no). Cupo 3. La etiqueta dice «Confirmada por 2 medios de 2 provincias».
7. El apartado humano «Falta una noticia»: abajo de Por decidir hay un renglón para escribir la noticia que la persona vio en otro lado y acá no está. El sistema contesta siempre, con su motivo. Es el campo «qué noticia importante vi en otro lado y acá no estaba» de la planilla de medición, puesto en la página.
8. El norte del proyecto (no cambia nada ahora): tocar el botón, ver la noticia ya verificada, y que el paso siguiente sea título para Instagram, título para Facebook y dos o tres fotos para elegir. La página C es el primer escalón de ese agente: hoy decide qué noticia; el armado viene después, sobre lo ya elegido.
9. Una noticia que la persona ya decidió y después sube a confirmada (una 4/5 que llega a 5 medios): «la mezcla» (decidió Alejo el 14-10-2026 a las 21:00, con el tablero «La vida de una noticia», artifact privado https://claude.ai/artifact/4U1sirot5pTVdMp2jJB6qd). Lo que manda es por qué la sacó, no que llegó a 5. Si estaba en Archivo: vuelve sola a Por decidir, arriba, con el sello verde y una línea adentro de la tarjeta «Subió a confirmada. A las HH:MM la habías archivado». Si estaba en No por hoy: se queda ahí con su motivo, el sello pasa de 4/5 naranja a verde, y Por decidir muestra abajo una línea contable como la de los temas ocultos: «1 que mandaste a No por hoy subió a confirmada · ver». Si estaba en Me interesa (elegida a mano): sigue ahí y el sello naranja pasa a verde «Confirmada por N medios». Reemplaza a la pastilla «Recién confirmada» de la página de hoy. Anotado por Cowork para después de la medición (no son decisiones): sumar un molde de nota de servicio para «Horarios y cómo ver los Martín Fierro»; el caso «obispos y el Papa» lo resuelve la etapa 4 (unión de hechos partidos) antes de llegar a la página.

## Valores por defecto de Cowork (no son decisiones de Alejo; se cambian)

- Los motivos de «No por hoy» son seis chips fijos, sacados de la planilla de medición de Alejo: no es noticia · repetida · va en el otro bloque · vieja · no me interesa el tema · otro (abre un renglón para escribir). Un toque en un motivo alcanza, sin botón «Listo». Los motivos aparecen adentro de la misma tarjeta, sin ventana aparte, con «Volver». Al decidir aparece unos segundos «Mandada a No por hoy · Deshacer».
- Las decisiones (me interesa, no por hoy con su motivo, archivada) viven en el navegador de cada persona, como las marcas de hoy (localStorage), y se borran solas cuando la noticia se cae de la lista (24 h).
- La 4/5 («en observación») pasa por los mismos tres botones; «Me interesa» ahí equivale a «la elijo a mano» y sale con el sello naranja de hoy. Desaparece el menú «Llevármela igual».
- Pestaña Me interesa: lo que se va a llevar, con «Sacar» en cada una. «Copiar» se lleva todo lo de esa pestaña, sin tildes. Lo copiado baja a «Llevadas hoy», apagado y con la hora, como hoy.
- Pestaña Archivo: tarjetas cortas con la hora en que se archivó y dos botones: «Me interesa» (va directo a llevar) y «Volver» (a Por decidir).
- Pestaña No por hoy: renglones con el motivo en una pastilla gris y «Volver».
- Combinar: cuando llega una noticia parecida a una archivada, la abierta muestra el aviso «Parecida a una que archivaste a las HH:MM: «título»» y un botón más, «Combinar con la archivada». La propuesta combinada la escribe la IA: un título y una bajada con las dos, y los links de ambas; abajo dice de qué dos noticias sale. Tres botones: «Me interesa así», «Corregir el texto», «Dejarlas separadas». Mientras no haya IA (etapa 2), el botón dice «Llevar juntas» y las dos van a Me interesa tal cual, una debajo de la otra. «Parecida» se detecta con lo que ya hay (paresParaUnir en src/ia.js: persona o lugar en común), sin llamar a ningún modelo.
- Temas: seis, cada noticia lleva uno solo como pastilla gris: Política · Economía · Sociedad · Policiales · Deportes · Espectáculos. Internacional no es un tema, es el bloque. Mientras no haya IA, el tema sale de la sección del portal donde salió la nota (seccion, que el lector ya guarda); si ninguna nota del hecho trae sección, va «Sin tema» y se muestra siempre. Con la IA, lo pone ella (clasificarHecho).
- Anillos, números: Local cuenta solo los portales locales de la lista, 2 medios para confirmar, cupo 3. Chubut cuenta los provinciales y los locales, 3 para confirmar, cupo 3. Región como dice el punto 6. Nacional e Internacional como hoy (5 y 7). La etiqueta de los anillos chicos dice siempre de dónde son los medios («Confirmada por 2 medios locales», «Confirmada por 2 medios de 2 provincias»), nunca «Confirmada» a secas; una 1/2 local es la «en observación» de ese anillo. El anillo de una noticia se decide por lugar (donde pasó), como ya está decidido para nacional/internacional; sin IA, por el portal y su sección, como hoy el bloque provisorio.
- Una noticia que cumple en dos anillos a la vez (por ejemplo, 3 portales de Chubut y 1 de Neuquén) va al anillo más chico donde pasó (Chubut).
- Orden de construcción de los anillos: primero los feeds de Comodoro y Chubut, después los de las otras provincias. La Región existe en config/ desde el primer día y aparece en la página en cuanto tenga noticias (un anillo sin noticias no se muestra).
- «Falta una noticia»: se busca por palabras del título contra todo lo acumulado de 48 h (verificado, en observación, descartado con su motivo, caído por viejo). Cuatro respuestas: «la tengo pero no llegó» (muestra la noticia con sus medios y deja llevarla a mano), «la saqué» (con el motivo del criterio 1 y «ver igual»), «vieja» (se cayó por las 24 h) y «no la vi en ningún portal de la lista». Las «no la vi» quedan anotadas con la hora: es la lista de lo que se escapó, para revisar portales y moldes. Para que la página pueda contestar, lista.json tiene que traer también lo descartado (título, motivo, medios); hoy trae solo lo que entra.
- En el encabezado, la hora de la última vuelta en vez de «Actualizada recién».
- El pivote es un lugar fijo arriba (no un acordeón que se expande donde está la fila).

## Abierto (sin resolver, con valor por defecto mientras tanto)

- Dónde viajan los motivos de «No por hoy» y las respuestas «no la vi» para que el sistema aprenda de ellos. Hoy quedarían en el navegador de cada persona y nadie los vería. Es capa 4 (lo de Don Julio). Mientras tanto: navegador.
- Qué portales locales y regionales tienen feed. Candidatos sin verificar: ADNSUR, El Patagónico, Crónica, El Comodorense (Comodoro); La Opinión Austral (Caleta Olivia); Diario Jornada, El Chubut, Rawson Digital (provincia). De Neuquén, Río Negro, Santa Cruz y Tierra del Fuego no hay candidatos todavía. Trabajo para Claude Code después de la medición, con npm run feeds. Después de ver qué traen, moldes de notas de servicio propios de lo local (clima, cortes de luz, horarios), sumados a los 3 que ya hay en el criterio 1.
- Noticias que tocan dos o más anillos (un hecho de Comodoro que también sale en medios nacionales): cómo se combinan los anillos. Idea de Alejo, sin diseñar.
- Los números por anillo (2 local, 3 Chubut, 2 de 2 provincias en Región) y los cupos (3) hay que medirlos con feeds reales antes de fijarlos.
- Cuántas noticias quedan «Sin tema» usando la sección del portal: medirlo sobre lo acumulado en la medición.
- Colores y bordes redondeados de la página: Alejo tiene una galería de conceptos; se ve después, cuando se diseñe la página nueva. Alejo dijo que lo dibujado «se ve demasiado IA» en colores.
- Nombre del producto: idea de Alejo del cono de luz de una linterna (el vértice chico que se expande; las secciones cónicas). Candidatos de Cowork: FOCO (el punto de la cónica, la linterna, «poner el foco»), HAZ, VÉRTICE. 7M sigue siendo el nombre hasta que Alejo decida.
- Pendiente ya existente que esto resuelve en parte: «deportes y espectáculos» (por defecto deportes sí, farándula no) pasa a «el motor no descarta por tema; filtro en la página».

## Lo que dejó la medición hasta ahora (notas de Alejo del 14-10, letras a y b), para cruzar al terminar

- Faltaron: Caputo negociando más financiamiento; PSG 4-2 Manchester City (Champions). Ver si no llegaron a 5 medios o si se partieron en varios hechos.
- Repetidos: varios obispos hablando de la operación del Papa León XIV (unión de hechos, etapa 4).
- Nota de servicio que el molde no agarró: horarios del Martín Fierro.
- Sobran por poco interés: Tucumán y el clima; testimonios de familiares (Roña Castro); bonos y riesgo país (juicio de la IA, etapa 2).
- De 4 a 5 nuevas por mirada, elegiría entre 0 y 3. Cruzar con npm run medir.
- «Más noticias al descartar» (bajar de 5 portales): Alejo dijo «por ahora dejalo así», lo habla con Don Julio. La regla de 5 sigue fija.

**Parcial, hasta las 09:44 del 15-10 (38 vueltas desde el 14-10 13:18), revisado por Cowork el 15-10; el día completo se cruza cuando termine la medición (16/10):**

| Qué | Número |
|---|---|
| Noticias distintas que llegaron a 5 medios en el día | 32 (22 nacionales + 10 internacionales) |
| Noticias distintas que pasaron por 4/5 | 46; 23 de ellas llegaron después a 5, 23 nunca |
| Confirmadas que estuvieron antes en 4/5 | 23 de 32 (entre 1 y 7 horas antes) |
| Vueltas con la lista de nacionales llena (7) | desde las 18:43 en adelante, todas |
| Internacionales en la lista | 1 hasta las 19:13, 3 o 4 después |
| Confirmadas nuevas de madrugada (23:43 a 07:13) | 0 |
| Bloque provisorio equivocado (internacionales que salieron nacionales) | 4 de 22 confirmadas y 3 de las 4/5 |
| La misma noticia partida en varios hechos | el Papa en 6 hechos; Martín Fierro en 3; riesgo país en 2; Caputo en 2; Roña Castro en 2 |
| Notas de servicio que los moldes no agarran y llegaron a 5 | horario del Martín Fierro, el clima de Tucumán, «Anses: quiénes cobran», «Precio del euro hoy en Chile», «Cuánto cobran los empleados de McDonald's» |
| Feeds caídos | Al Jazeera, 1 vuelta de 38 |

## Qué viene después

1. Antes de la carta, en el mismo chat de Cowork: Alejo pidió estudiar «el comportamiento de una noticia», qué le pasa desde que sucede hasta que se publica y qué le pasa cuando la toma el agente. Cowork lo dibuja como un tablero interactivo (la noticia es una ficha que avanza por etapas, con un control de tiempo). No es carta ni cambio: es para entendernos.
2. Al terminar la medición, Alejo manda a Cowork la salida de npm run medir y datos/vueltas.jsonl. Cowork revisa a ojo los bloques por los títulos y cruza con las notas de arriba.
3. Cowork escribe la carta Cowork_para_ClaudeCode_<fecha>_<letra>.md con la página C (esta charla es su base), en este orden: primero el flujo (pestañas, pivote, tres botones, motivos, archivo, me interesa, copiar, falta una noticia); después los temas como filtro; después los anillos y los portales locales y regionales (que empiezan por probar feeds). Combinar con IA espera a la etapa 2.

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**Desde el 04-10-2026 hay un solo chat de Cowork** (antes DISEÑADOR y PREPARADOR). Donde un ítem dice DISEÑADOR o PREPARADOR, es Cowork. Lo que sigue (es una sugerencia, no una decisión de Alejo): la capa 4 con Don Julio, que es lo que hoy frena tener algo que apretar con noticias reales. La revisión de la página y de lo medido en el reporte `a` del 04-10 quedó aprobada (ver «Hecho»).

**Capa 4 y calidad del agrupador** (medido con datos reales el 04-10, ver `CLAUDE.md`)
- [x] ~~Umbral del agrupador.~~ Hecho: `umbralSimilitud` 0.3 con `umbralSeguro` 0.5 y `minPalabrasComunes` 3. Sobre lo acumulado (1.150 notas) con 0.5 hay 0 verificados y con 0.3 hay 2, sin uniones falsas entre los hechos de 5 o más grupos.
- [x] **Cuántas noticias da la regla de 5 en un día real** — **hecho (16-10):** la midió Alejo en su compu (14-10 14:15 → 16-10 12:20); los números están arriba de todo, en «Cowork → pendientes · 16-10-2026 · la medición y los anillos». Lo que sigue es la historia del ítem. (pide el DISEÑADOR): con lecturas cada 30 minutos de un día entero, por bloque y por corte de 4 h, cuántos hechos llegan a 5 o más grupos, cuántos quedan en 4/5 sin firma y cuántos tienen firma. Las 4/5 que se ofrecerían salen de `resumen.elegiblesAMano` (con lo guardado el 04-10 a las 18:02 son 4, todas frescas). Sin apuro: depende de la capa 4. **Herramienta lista (09-10):** `npm run vuelta -- --cada 30` un día entero y después `npm run medir`. **Decidió Alejo (09-10): el día de medición lo corre él en su compu**, con la guía `docs/CORRER_EN_MI_COMPU.md`; al terminar le manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`, y Cowork revisa a ojo los bloques por los títulos (ver el ítem del bloque provisorio).
- [ ] **Hechos partidos: decidido por Alejo (opción A): la IA los une y se cuentan juntos; espera la IA.** «La misma noticia» es **el mismo hecho: la misma gente, lo mismo que pasó, el mismo día**; no alcanza con el mismo tema. Es la sexta pregunta de la IA. Hecho en el repo, sin llamar a ningún modelo: `paresParaUnir`, `unirHechos`, `preguntaUnion` y `leerUnion` de `src/ia.js`. **Corrección:** el par «EN VIVO | Elecciones en Brasil: comienza el escrutinio…» + «…Milei sigue con optimismo la elección en Brasil…» es **no** (uno es el conteo de votos, el otro lo que hace Milei); antes figuraba como «sí». Medido el 04-10 con la regla nueva (lo guardado hasta el 5/10 00:01, con el filtro de Infobae): entran 11 hechos (5 de 3 grupos, 4 de 4 y 2 candidatos de vía A) y salen **5 pares**: 2 entre hechos de 3 o 4 grupos (Colapinto, unión de 5 grupos, sí; escrutinio + Milei, unión de 7, no) y 3 con un candidato (escrutinio + «voto a voto», unión de 8, sí; Milei + «voto a voto», unión de 9, dudoso; Milei + García Cuerva, unión de 9, no). Los 5 llegan a 5 grupos: por eso la pregunta tiene que ser estricta. Detalle en `ClaudeCode_para_Cowork_2026-10-04_a.md`.
- [ ] **Capa 4 (Alejo con Don Julio): reemplaza «Guardar lo leído entre corridas».** Cada cosa lleva un valor por defecto que se puede cambiar:
  - Dónde corre n8n. Por defecto: n8n Cloud Starter, €20 por mes con 2.500 ejecuciones; leer cada 30 minutos son 1.440 por mes. Ojo: n8n 3.0 sale en octubre de 2026 y en servidor propio exige Docker. (Datos de n8n y de la IA consultados por Cowork el 04-10 en sus páginas oficiales.)
  - Dónde se guarda lo acumulado, la última lista (`pagina/lista.json` en su versión real) y lo juzgado por la IA (los guardados de `src/ia.js`).
  - Dónde vive la página, para que verla no gaste ejecuciones de n8n, y con un link secreto por cliente.
  - Qué cuenta de IA. Por defecto Claude Haiku 4.5, entre US$1 y 5 por mes. Quién la paga.
  - Cómo avisa si una lectura falla, y cómo se separan las pruebas de lo real.
  - **Antes de prender la unión con un modelo real (valor por defecto de Cowork, 05-10):** se le hace a ese modelo, con la misma configuración que va a usar n8n, cada caso de unión de `test/casos-ia.json` que no es `dudoso`, **3 veces**. Tiene que acertar las 3 veces en todos. Una respuesta que `leerUnion` no puede leer (`null`) cuenta como error. Si erra una, la unión queda apagada hasta que se arregle la pregunta o se cambie de modelo. Los casos `true` también cuentan, para que «Si dudás, contestá false» no lo vuelva tan desconfiado que no una nada.
  - La pieza para acumular ya está hecha (`acumular` y `npm run leer -- --acumular datos/notas.json`, 48 h, `datos/` no se sube al repo), y también las piezas de la IA (`src/ia.js`); lo que falta es el pegamento.
  - **Las preguntas para Don Julio (Cowork, 05-10):** 14 preguntas en 6 bloques, cada una con lo que proponemos mientras tanto y un globo para que conteste, en la página https://claude.ai/artifact/DMmuJhsmvGLWBCxxcJc4yq (es privada de Alejo: él se la comparte). Si Don Julio la abre como Editor, lo que escribe queda guardado en la página y el próximo chat de Cowork lo lee de ahí. Si no, toca «Copiar todas», se lo manda a Alejo por WhatsApp y Alejo lo pega en Cowork. Con sus respuestas, Cowork escribe la carta de la capa 4.
  - **Orden por etapas (valor por defecto de Cowork; se le pregunta a Don Julio en la pregunta 12):** 1) leer y guardar cada 30 minutos, sin IA, que ya sirve para medir un día real; 2) la IA que juzga; 3) la página con la lista real; 4) la unión, después de la prueba de 3 veces.
  - **Datos consultados por Cowork el 05-10 en las páginas oficiales:** n8n 3.0 todavía no salió (está anunciado para octubre de 2026); con esa versión el servidor propio va solo con Docker y el tiempo máximo de un nodo Code baja de 5 minutos a 1. n8n Cloud Starter sigue en €20 por mes con pago anual y 2.500 ejecuciones. Claude Haiku 4.5 sigue en US$1 por millón de tokens de entrada y US$5 de salida. `preparar` tarda menos de 1 segundo con 1.300 notas inventadas (medido por Cowork).
  - **09-10 (Alejo):** Don Julio no contestó la página; Alejo contestó las 14 preguntas con los valores por defecto. Dónde corre cada 30 minutos (preguntas 1 y 2) lo habla con Don Julio después. Lo demás vale hasta que Don Julio diga otra cosa.
  - 14-10 23:30: Don Julio contestó por WhatsApp; ver la sección de las 23:30 arriba.

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
- [x] **La medición local en la nube se cortó (15-10):** — **hecho (16-10):** la local corrió en la compu de Alejo (15-10 09:45 → 16-10 12:20) y Cowork la revisó; ver «Cowork → pendientes · 16-10-2026 · la medición y los anillos», arriba de todo. la compu de Claude Code se apaga cuando la sesión queda quieta; hizo solo 3 vueltas (desde las 00:38). Un día entero no se puede correr desde ahí. Alejo la arranca en su compu el 15-10, en paralelo con la nacional (`--config config/comodoro --carpeta datos/comodoro`); al terminar manda también `npm run medir -- --carpeta datos/comodoro` y `datos/comodoro/vueltas.jsonl`. **Cowork (carta `c`): la Fase B de la carta `a` queda cancelada; la revisión la hace Cowork con esos archivos.**
  - **Hueco en la medición nacional:** la ventana de la vuelta se cerró en la compu de Alejo cerca de las 07:43 del 15-10 y se rearrancó a las 09:45 (unas 2 horas sin vueltas). La local arrancó a la misma hora, en su compu, con `Feeds: 8 OK`. Las dos iban a cortar el 16-10 después de las 00:30; **Alejo las estiró hasta el 16-10 a las 12:05** (decidió a las 06:46 del 16-10): así la mañana, que el 15 quedó con hueco, se mide entera. Donde las secciones de Cowork dicen «después de las 00:30», hoy es 12:05. **Se cortaron las dos el 16-10 a las 12:20** y Alejo le mandó a un chat nuevo de Cowork las 5 cosas del punto 2 de «Qué viene después», numeradas (las dos `vueltas.jsonl` renombradas a `.txt`).
- [x] **Feeds de portales locales, probados el 14-10** (`buzon/ClaudeCode_para_Cowork_2026-10-14_a.md`): Comodoro tiene 3 con feed al día (ADNSUR, El Comodorense, Crónica por secciones); lo provincial no tiene feeds, solo sitemaps de noticias (El Chubut, El Patagónico). Decidir si el lector suma sitemaps. Nada sumado a `config/`. **Hecho el 15-10:** el lector lee sitemaps y el bloque local de prueba está en `config/comodoro/` (carta 2026-10-15_a).
- [ ] **Las notas de Alejo usando la página durante la medición** (14-10-2026, 5 miradas): están en `buzon/Alejo_para_Cowork_2026-10-14_a.md`, tal cual y con un resumen. Pide para la página: menos scroll, más legible, **quitar** una noticia «por hoy» con el motivo (para aprender qué busca quien publica) y **archivar** una para combinarla después. De las noticias: sobran locales y de poco interés, un molde de servicio no agarra «horarios del Martín Fierro», hechos repetidos (obispos y el Papa), faltaron Caputo y PSG-Manchester City. Va con la salida de `npm run medir` cuando termine la medición; la modificación de la página, **después** de la prueba (decidió Alejo).
- [ ] **El flujo que quiere Alejo con cada noticia** (14-10-2026, `buzon/Alejo_para_Cowork_2026-10-14_b.md`): primero discriminar (me interesa / no por hoy con motivo / archivar) y después copiar solo lo elegido. Ideas para pensar: gustos por persona (chimento sí o no), más noticias al descartar (la regla de 5 queda fija: «por ahora dejalo así»), portales locales de Chubut. Se diseña después de la prueba.
- [ ] **El bloque provisorio falla con una internacional que los medios argentinos ponen en secciones genéricas** (medido el 09-10: el Nobel de la Paz a Navi Pillay, 7 grupos, 3 de 9 notas «parecen» internacionales, salió en Nacionales; las otras 3 confirmadas salieron bien). **Valor por defecto: no se toca**; lo arregla la IA en la etapa 2 y la página ya dice «provisorio». Parche posible si molesta en la medición: que un hecho vaya a internacional también cuando lo publican 3 o más medios de `ambito: internacional` distintos (riesgo: una nacional muy grande con cobertura de afuera iría a internacional). Mientras tanto, al revisar el día medido, Cowork mira los bloques a ojo por los títulos de `vueltas.jsonl`.
- [ ] **El juicio de un hecho mezclado:** el hecho «A la espera de los primeros resultados, Milei sigue con optimismo…» (4 grupos) tiene un título de Milei pero 4 de sus 5 notas son del conteo de votos. La pregunta de la IA se arma con todas las notas, no solo con el título, pero conviene mirarlo cuando se pruebe el modelo (`test/casos-ia.json`). **Su caso de bloque queda nacional** (Cowork, por la regla «por lugar» de Alejo: lo que hace Milei pasa en Argentina).
- [ ] **Caso borde de la vía B con la 4/5:** una 4/5 que entra por la vía B pero cuya firma no vale para su bloque (un autor solo nacional en una noticia internacional) se descarta y no se ofrece a mano. Solo pasa con `firmas.json` llena. **Valor por defecto:** así.
- [ ] **Alternativas a la lista de firmas hecha a mano.** Opciones para pensar:
  - A: la lista manual de hoy.
  - B: reputación por trayectoria. Una firma sería reconocida si aparece firmando en varios portales de la lista blanca durante un período. Se arma sola con el campo `firma` que va a traer el lector y Alejo solo aprueba o descarta. Cuidado: popularidad no es confiabilidad, y habría que sacar firmas genéricas ("Redacción", "Agencias").
  - C: fuentes externas (premios, bases de datos de autores). Sin investigar ni probar.

**Cowork → Claude Code (antes PREPARADOR → Claude Code)**
- ~~Enganchar la zona en `src/capa4.js`~~ — hecho el 16-10 (carta `Cowork_para_ClaudeCode_2026-10-16_b.md`).
- ~~Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_a.md`~~: **cancelada el 15-10 (carta `c`)**: la medición local corre en la compu de Alejo y la revisa Cowork con los archivos que él mande. Claude Code no tiene nada que hacer con lo local hasta la carta de los bloques por zona.
- Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_b.md`: instalar la capa 4 en el servidor de Don Julio el día que Alejo vaya, en una tanda.

**Más adelante**
- [ ] Portales y firmas por país, para vender a otros países (Uruguay, por ejemplo).
- [ ] Fotos y armado de publicaciones (hoy se hace a mano en Canva). Las fotos de los portales tienen derechos: antes de automatizar hay que definir de dónde salen las imágenes.
- [ ] **La visión a largo plazo de Alejo (contada el 14-10-2026, sin diseñar todavía):** piezas que se enchufan una detrás de otra, cada una con su tarea, y todas toman de entrada la lista de noticias confirmadas (`lista.json`). 1) La de hoy: noticias chequeadas a mano para quien publica. 2) Armado para publicar: título con gancho, resumen chiquito, foto bien centrada y personalizada, miniaturas para Facebook, YouTube, un portal o un canal de WhatsApp. 3) Voz: leer la noticia con una voz generada, por una API. Alejo quiere ir paso a paso: primero que la pieza 1 ande sola. Antes de la 2 hay que resolver los derechos de las fotos (ítem de arriba); la 3 suma un costo de API.
- [ ] Mejorar el agrupador para notas en otro idioma (hoy compara palabras).
- [ ] Que las personas de un mismo canal vean lo que se llevó cada una (hoy cada una ve lo suyo; hace falta saber quién es quién).
- [ ] Un aviso de «hay nuevas».
- [ ] Noticias reales en la página con el juicio de la IA (hoy la lista real sale sin IA, con la franja que lo dice; es la etapa 2).

## Hecho

- [x] 15-10-2026 · **Capa 4 escrita** (carta `b`): `src/capa4.js`, los cuatro workflows en `n8n/`, la página con login (`scripts/servir.js`, `scripts/usuario.js`), la IA falsa y la guía de instalación. Falta instalar (Fase B).
- [x] 15-10-2026 · **Sitemaps en el lector y `--config` en la vuelta** (decidió Alejo adelantarlo el 15-10): El Patagónico y El Chubut se leen por su sitemap de noticias (sin bajada; la página lo dice); `config/comodoro/` es el bloque local de prueba (5 portales, 2 medios para confirmar); la medición local corre en el entorno de Claude Code.
- [x] 16-10-2026 · **La zona en la capa 4** (carta `Cowork_para_ClaudeCode_2026-10-16_b.md`): `mitadUno` y `mitadDos` corren Comodoro y Chubut sin IA; el nodo Rutas trae `configZona`; el molde del pronóstico ya no saca las listas de Netflix; cada hecho de `vueltas.jsonl` lleva sus `urls` y `medir` cuenta por link; `docs/PAQUETE_DE_CLIENTE.md`. Reporte `ClaudeCode_para_Cowork_2026-10-16_b.md`.
- [x] 16-10-2026 · **Los anillos Comodoro y Chubut** (carta `Cowork_para_ClaudeCode_2026-10-16_a.md`): `config/zona/`, `src/zona.js`, la zona en la misma vuelta (`--zona config/zona`), la página en el orden de `lista.orden`, ZONA en `npm run medir`, moldes «pronóstico del tiempo» y «cotizaciones», y las fuentes de los cortes probadas. Reporte `ClaudeCode_para_Cowork_2026-10-16_a.md`.
- [x] 09-10-2026 · **Links por medio** (Cowork, valor por defecto, variante A): en la página cada medio aparece una sola vez en la fila de links, con su primera nota; lo que se copia sigue con todos. `npm run ver` para ver `datos/pagina/` en la compu. **El día de medición lo corre Alejo en su compu** (decidió Alejo): guía `docs/CORRER_EN_MI_COMPU.md`.
- [x] 09-10-2026 · **Etapa 1 en el repo** (decidió Alejo): `npm run vuelta` hace una vuelta completa sin IA y deja la lista real en `datos/pagina/`; `npm run medir` resume las vueltas por corte de 4 h; la página avisa «Sin el juicio de la IA». Dónde corre, con Don Julio.
- [x] 05-10-2026 · **Cerrado por Cowork al aprobar el reporte `c`:** `scripts/armar-paquete.js` sigue trayendo solo el reporte más nuevo (valor por defecto de Cowork). Si un día hay dos reportes sin carta de Cowork en el medio y el chat de Cowork no puede clonar el repo, Alejo le pega también el reporte anterior. No se toca hasta que pase.
- [x] 05-10-2026 · **El molde «▶ QUÉ HACÉS AHORA»**, decidido por Alejo: toda entrega de Cowork y de Claude Code termina, en el mensaje del chat, con «ESTO mandale a …:» por cada destinatario, un recuadro con exactamente lo que se pega y el molde afuera, como cita; nunca una tabla, y nunca recuadros ni moldes de ejemplo adentro de lo que se pega. Escrito en `LEEME_COWORK.md` («El molde»), `LEEME_CLAUDECODE.md` y `CLAUDE.md`. Cowork lee todos los reportes nuevos, no solo el último. La hora del encabezado sale del comando, corrida en el momento.
- [x] 05-10-2026 · **Cerrado por Cowork al aprobar el reporte `b`:** las 66 comprobaciones de `npm run probar-pagina` quedan agrupadas como están; la captura del celular de Alejo con la versión vieja era una imagen de antes del 05-10 `a` (la página no está publicada en ningún lado).
- [x] 05-10-2026 · **El sello de lo llevado a color pleno** (Cowork): en una tarjeta llevada se apagan solo la casilla, el título, la bajada y los links (0,6; 0,9 si se la vuelve a tildar); el sello y «Te la llevaste a las…» quedan sin apagar. Contraste del naranja en claro de 2,6 a 5,8 (oscuro 3,8 a 8,0; verde 2,5 a 5,1 y 3,8 a 7,7). **El script de Chromium en el repo:** `npm run probar-pagina` (Cowork; fuera de `npm test`, sin Playwright en `package.json`, con `--capturas <nombre>`).
- [x] 05-10-2026 · **Cerrado por Cowork:** el número del bloque («Nacionales · 7») cuenta la lista (vía A y vía B, llevadas incluidas); una 4/5 llevada no suma aunque se vea en el bloque.
- [x] 05-10-2026 · **«Recién confirmada»** (decidió Alejo, opción C): una 4/5 que ya vio y sube a confirmada lleva una pastilla propia que dura la visita (`vistasConfirmadas` en el estado; un estado viejo arranca como copia de `vistas`). Descartado: sin marca; «Nueva» otra vez. También de Cowork, valores por defecto: la vía B en violeta y la 4/5 llevada en naranja (ya no se confunden con «Confirmada por N medios»), «4 de 5 medios» en las 4/5, y la pregunta de unión más estricta con 2 casos de prueba más (`union[4]` dudoso y `union[5]`). Capturas `buzon/capturas/pagina-2026-10-05-*.png`.
- [x] 05-10-2026 · **Cerrados por Cowork al aprobar el reporte `a` del 04-10:** revisar la página y lo medido (aprobado; M1 cerrado); Chequeado como fuente de desmentidos (no se suma); la pastilla «Nueva» en las 4/5 (no); «Detalle conocido de la página» (ya no aplica: la línea de las 4/5 no nombra medios).
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
ARCHIVO 5 de 5 · buzon/ClaudeCode_para_Cowork_2026-10-17_a.md
============================================================

# Claude Code → Cowork · 17-10-2026 · 01:23 (hora de Argentina) · letra a

Responde a la carta `Cowork_para_ClaudeCode_2026-10-17_a.md` (la página C).

## Veredicto

La página C está hecha y probada, con sus dos fases: la página nueva (pivote, tres o dos botones, motivos, pestañas, temas, avisos, Deshacer, «N nuevas», la mezcla) y el guardado por persona en el servidor. `npm test` da 378 bien y 1 pendiente; `npm run probar-pagina` da 82 bien y 0 mal. **Ojo, arriba de todo, como pide la carta:** con las secciones reales, **solo el 42,9 % de las notas nacionales queda con tema** (menos del 60 %). Seguí igual con «Sin tema» por defecto; la decisión es de Alejo (sumar palabras clave o esperar a la IA).

### Dos lecturas posibles (elegí la que menos cambia)

1. **El nombre de las capturas.** La carta dice `pagina-c-<nombre>-<sufijo>.png` y «con nombre `pagina-c-2026-10-17`». Lo leí como `<nombre>` = `2026-10-17`: quedaron `pagina-c-2026-10-17-390.png`, etc. (y no `pagina-c-pagina-c-2026-10-17-…`).
2. **`pivoteSiguiente(porDecidir, pivoteActual, decidida)`.** Para saber «la que estaba justo después de la decidida», `porDecidir` es el de **antes** de decidir (la decidida todavía está). Sin `decidida`, devuelve la misma abierta si sigue ahí o la primera. Así lo usa la página y así está el test E4.

## Paso 1 · las secciones reales → tema

Sobre `datos/notas.json` (1.540 notas nacionales) y `datos/zona/notas.json` (336), las que había en el entorno (15-10 y 16-10). Sección comparada ya normalizada (minúsculas, sin tildes, guiones como espacios).

**Nacional, las 30 más frecuentes:**

| # | Sección | Notas | Tema |
|---|---|---|---|
| 1 | `america` | 111 | Sin tema |
| 2 | `nota` | 109 | Sin tema |
| 3 | `noticias` | 108 | Sin tema |
| 4 | `deportes` | 77 | Deportes |
| 5 | `politica` | 74 | Política |
| 6 | `economia` | 66 | Economía |
| 7 | (vacía) | 63 | Sin tema |
| 8 | `sociedad` | 61 | Sociedad |
| 9 | `es` | 52 | Sin tema |
| 10 | `estados-unidos` | 51 | Sin tema |
| 11 | `mundo` | 39 | Sin tema |
| 12 | `espana` | 30 | Sin tema |
| 13 | `informacion-gral` | 27 | Sociedad |
| 14 | `espectaculos` | 27 | Espectáculos |
| 15 | `ovacion` | 25 | Deportes |
| 16 | `policiales` | 24 | Policiales |
| 17 | `show` | 23 | Espectáculos |
| 18 | `cultura` | 20 | Espectáculos |
| 19 | `news` | 20 | Sin tema |
| 20 | `en` | 20 | Sin tema |
| 21 | `zoom` | 19 | Sin tema |
| 22 | `la-ciudad` | 19 | Sociedad |
| 23 | `internacional` | 18 | Sin tema |
| 24 | `tecno` | 16 | Sociedad |
| 25 | `economia-politica` | 15 | Economía |
| 26 | `finanzas-mercados` | 15 | Economía |
| 27 | `lifestyle` | 15 | Sin tema |
| 28 | `salud` | 14 | Sociedad |
| 29 | `video` | 14 | Sin tema |
| 30 | `us-news` | 13 | Sin tema |

**Zona, las 17 que no son el título de la nota** (El Comodorense pone el título como sección: 1 nota cada una, Sin tema):

| # | Sección | Notas | Tema |
|---|---|---|---|
| 1 | `noticias` (Crónica) | 103 | Sin tema |
| 2 | (vacía, El Patagónico) | 70 | Sin tema |
| 3 | `regionales` | 45 | Sin tema |
| 4 | `sociedad` | 15 | Sociedad |
| 5 | `policiales---judiciales` | 13 | Policiales |
| 6 | `superdepor` | 11 | Deportes |
| 7 | `espectaculos` | 7 | Espectáculos |
| 8 | `trelew` | 6 | Sin tema |
| 9 | `puerto madryn` | 6 | Sin tema |
| 10 | `policiales` | 4 | Policiales |
| 11 | `nacionales` | 4 | Sin tema |
| 12 | `rawson` | 3 | Sin tema |
| 13 | `deportes` | 2 | Deportes |
| 14 | `cultura---espectaculos` | 2 | Espectáculos |
| 15 | `politica` | 2 | Política |
| 16 | `pulso-energetico` | 2 | Economía |
| 17 | `esquel` | 2 | Sin tema |

**Cuántas notas quedan con tema:**

| Tema | Nacional | % | Zona | % |
|---|---|---|---|---|
| Sociedad | 170 | 11,0 % | 15 | 4,5 % |
| Economía | 140 | 9,1 % | 3 | 0,9 % |
| Deportes | 136 | 8,8 % | 13 | 3,9 % |
| Espectáculos | 107 | 6,9 % | 9 | 2,7 % |
| Política | 77 | 5,0 % | 2 | 0,6 % |
| Policiales | 30 | 1,9 % | 17 | 5,1 % |
| **Con tema** | **660** | **42,9 %** | **59** | **17,6 %** |
| Sin tema | 880 | 57,1 % | 277 | 82,4 % |

Lo que más pesa en «Sin tema» no es tema sino lugar o formato: `america`, `nota` (La Gaceta), `noticias` (Perfil, Infobae, Crónica), `es`/`en` (DW, France 24, El Cronista), `estados-unidos`, `mundo`, `espana`, la vacía (Página/12, El Patagónico) y `regionales`. Por eso lo internacional casi nunca tiene tema.

**En la lista real del 17-10 (01:13)**, por tarjeta (el tema de una tarjeta sale de todas sus notas): 15 de 24 con tema. Nacional 12 de 13; Comodoro 2 de 3; Chubut 1 de 3; internacional 0 de 5.

Las `secciones` de los seis temas son las de la carta más estas, todas vistas en los datos: Política `politics`, `poli`; Economía `economia-politica`, `finanzas-mercados`, `campo`, `agro`, `rural`, `revista-chacra`, `propiedades`, `real-estate`, `companias`, `business`, `economy`, `pulso-energetico`; Sociedad `informacion-gral`, `interes-general`, `la-ciudad`, `comunidad`, `tecno`, `salud-y-bienestar`, `clima-y-medio-ambiente`, `environment`, `clima`, `el-tiempo`; Policiales `policiales-judiciales`; Deportes `ovacion`, `superdepor`, `sports`, `agenda-deportiva`, `futbol-primera`, `futbol-internacional`, `futbol-ascenso`, `seleccion`, `river-plate`, `boca-juniors`, `racing`, `independiente`, `belgrano`, `gimnasia-de-mendoza`, `messi`, `basquet`; Espectáculos `show`, `teleshow`, `television`, `gente`, `fama`, `entretenimiento`, `cultura-espectaculos`, `music`, `film`, `babelia`, `que-sale`. Dejé las de arranque de la carta aunque no aparezcan en estos datos (`el-pais`, `dolar`, `inseguridad`, `cine`…): no molestan. `lifestyle`, `estilo`, `cocina`, `autos`, `zoom` y `video` quedaron Sin tema a propósito (no son ninguno de los seis).

## Qué cambió

| Paso | Commit | Qué |
|---|---|---|
| 2 | `599f136` | `pagina` en `config/reglas.json`; `primera` y `secciones` en las salidas de `decidir` y `decidirZona` (nada más cambia: comparé la salida entera de `decidir` del día de ejemplo antes y después, sin los dos campos, y es idéntica); `temaDe`, `tema`, `hora` y `lista.pagina` en `src/entrega.js`; `pagina/lista.json` regenerada |
| 3 | `f3a7a8b` | `pagina/logica.js` nuevo (estado v2, decisiones, temas, `repartir`, pivote, mezcla, nuevas) y `test/logica.test.js` reescrito |
| 4 | `15c4c82` | `pagina/index.html` nuevo, modo navegador |
| 5 | `0f6fd75` | `scripts/probar-pagina.js` reescrito y las capturas |
| 6 | `aaf5ba3` | Fase B: `GET`/`PUT /decisiones` en `scripts/servir.js`, la página elige modo, tests E14 |
| 7 | (este) | `docs/PAQUETE_DE_CLIENTE.md`, `docs/CORRER_EN_MI_COMPU.md`, `README.md`, `CLAUDE.md`, `pendientes.md`, este reporte y el paquete |

## Tests

| | Antes | Después |
|---|---|---|
| `npm test` | 371 bien + 1 pendiente | **378 bien + 1 pendiente** |
| `test/logica.test.js` | 37 | 31 (se borraron 24 de lo que desaparece: casillas, «Nueva», «Recién confirmada», `repartirBloque`…; quedaron 13; 18 nuevos: E3 a E13, E15 y otros) |
| `test/entrega.test.js` | 17 | 23 (+6: E1, E2) |
| `test/nucleo.test.js` | 86 | 88 (+2: `primera`, `secciones`; lo de antes sigue igual) |
| `test/zona.test.js` | 11 | 12 (+1, y uno ajustado: la lista de campos de la noticia suma los dos nuevos al final) |
| `test/servir.test.js` | 7 | 11 (+4, E14) |
| `npm run probar-pagina` | 93 | **82** |

## `npm run probar-pagina`: las 16 de §12

| # | Comprobación | |
|---|---|---|
| 1 | «última vuelta HH:MM» y «↻ Actualizar» | pasa |
| 2 | Hay pivote, es la primera de Por decidir; el avance dice «1 de 8 · Nacionales» | pasa |
| 3 | Pestañas y números (Plus: 4; Normal: Por decidir · Me interesa · Pasadas, con dos botones) | pasa |
| 4 | «Me interesa»: Por decidir −1, Me interesa +1, sube la siguiente, franja «Mandada a “Me interesa” · Deshacer» | pasa |
| 5 | «Deshacer» antes de 6 s deshace; a los 6 s la franja se va sola | pasa |
| 6 | Los siete chips exactos; «Opinión o reacción a otra» → No por hoy con la pastilla; «Otro motivo…» con texto → «Otro: …»; vacío no hace nada; «‹ Volver» cierra sin decidir | pasa |
| 7 | «Archivar» → Archivo con «archivada HH:MM»; desde ahí «Me interesa» y «Volver» | pasa |
| 8 | Tocar un renglón lo sube al pivote (y no se repite como renglón; la 4/5 dice «4/5») | pasa |
| 9 | Apagar «Espectáculos» oculta, «1 oculta por tema (Espectáculos) · ver», «ver» la muestra, «Sin tema» siempre | pasa |
| 10 | «Para llevar · 3» en orden de elección; copiar empieza por la primera elegida; pasan a «Llevadas hoy»; botón apagado | pasa |
| 11 | El aviso: «Me interesa» en su franja, «En Me interesa», nunca en Por decidir, «Te lo llevaste · HH:MM» | pasa |
| 12 | La mezcla E9 (de Archivo, primera bajo «Subieron a confirmada», con su línea) y E10 (No por hoy con «Subió a confirmada» y la línea del pie; Me interesa con «↳ Era 4 de 5…») | pasa |
| 13 | Un v1 en `7m-marcas-v1` queda v2 con sus llevadas y la clave v1 se borra | pasa |
| 14 | «Tus decisiones se guardan en este navegador» | pasa |
| 15 | Al recargar, mismas decisiones y el pivote vuelve a la primera | pasa |
| 16 | 1200 sin scroll horizontal; en 390 ningún botón de la abierta mide menos de 44 px (48, 48, 48), y las cuatro pestañas entran sin correrlas | pasa |

Además: sin errores en la consola en ningún escenario. Una prueba de control (cambié a propósito «Mandada a “No por hoy”») hizo fallar la comprobación 6: el script mira de verdad.

**Fase B, a mano** con `servir` y dos usuarios de prueba (en una carpeta temporal, con la lista real): Ana decide tres → queda `personas/ana@ejemplo.com.json` con `interesa`, `archivo`, `nopor:tengo` y nada en el navegador; recarga → las tres siguen; un `PUT` cortado → franja «No pude guardar en tu usuario. Lo reintento solo.» y respaldo en el navegador; el siguiente anda → la franja se va y el respaldo se borra; sale y entra Bea → no ve ninguna.

## Capturas (`buzon/capturas/`)

- `pagina-c-2026-10-17-390.png`, `-1200.png`, `-390-oscuro.png` y `-normal-390.png`: la lista de ejemplo con un aviso sumado y una elegida.
- `pagina-c-2026-10-17-real-390.png`, `-real-1200.png`, `-real-390-oscuro.png`: la lista real del 17-10 a la 01:13 (Comodoro, Chubut, 2 avisos), con `--solo-capturas`.

## Tiempos y pesos

| Qué | Medido |
|---|---|
| `repartir` con 60 tarjetas y 200 decisiones (Node) | **2,3 ms** (pedía menos de 50) |
| El estado con 200 decisiones (3 urls cada una, todas con texto «Otro») | **55,8 KB** (el tope del `PUT` es 256) |

## Qué decidí por mi cuenta

1. **`temasApagados` con «!»**: `"Espectáculos"` = la persona lo apagó; `"!Espectáculos"` = lo prendió aunque la config lo trae apagado. Lo que no figura sigue la config. Documentado arriba de `pagina/logica.js`. `alternarTema` recibe la lista como tercer dato (opcional) para saber cómo viene de la config.
2. **`decidirTarjeta` recibe `minimo`** (`lista.minGrupos`) dentro del segundo dato, junto a `que`, `motivo` y `texto`: la carta pide guardarlo y la función no recibía la lista. **`borrarDecision`** acepta una `subida` opcional: Deshacer de una que había vuelto de Archivo la devuelve a «Subieron a confirmada».
3. **`repartir` devuelve además `numeros`** (los de las pestañas; el de Por decidir nunca cuenta las ocultas). Exporté también `mismaTarjeta`, `subidaDe`, `decididasEnVisita`, `paginaDe`, `tituloPagina`, `temaPrendido`, `MOTIVOS` y `CLAVE_V1`.
4. **«ver» las ocultas**: van a sus lugares en los renglones con su pastilla de tema, pero el pivote nunca cae solo en una oculta. Después de «ver», la línea queda sin el «ver» (no hay texto para «ocultar» en la carta).
5. **El título de un bloque en los renglones** cuenta también la abierta («Nacionales · 7 por decidir», igual que el avance) y no se dibuja si en ese bloque solo queda la abierta.
6. **«Volver» cuando no había pivote** (todo decidido): la que vuelve pasa a ser el pivote, porque la regla dice que sin pivote es solo cuando no queda ninguna.
7. **Singulares**: «1 oculta por tema…», «1 nueva desde las…», «1 que mandaste a No por hoy subió a confirmada · ver». Los plurales son los de la carta.
8. **La franja de avisos** muestra también el título y los links del aviso (como hoy), además de la pastilla, la línea y el botón.
9. **`PUT /decisiones` con algo que no es JSON** → 400 (la carta no lo decía). El tope de 256 KB se cuenta en bytes; para contestar 413 se termina de leer el cuerpo sin guardarlo.
10. **Las pestañas en 390 px** pueden partir en dos renglones si no entran (con la letra del entorno no entraban); desde 420 px van en uno.
11. En `probar-pagina`, la copia de la lista de ejemplo suma un aviso y le pone «Espectáculos» a una noticia (la de ejemplo no trae ninguna de ese tema); para la mezcla, las dos «le falta 1» pasan a confirmadas. El 404 de `/decisiones` que anota la consola del navegador no cuenta como error: es como la página sabe que no hay login.

## Qué vi y no toqué (para Cowork)

- **Desaparecieron dos textos que la carta no nombra**: «N confirmadas más quedaron afuera por el tope de 7» (`afueraPorTope`) y «1 de 3. No se completa con menos medios.» (cuando un bloque no llega al mínimo). La lista los sigue trayendo y `logica.js` sigue exportando `textoAfuera`, `avisoBloque` y `tituloBloque`; la página nueva no los dibuja porque §1 no los lista. Si van, ¿dónde?
- En **Normal**, la línea del pie dice «… que mandaste a No por hoy …» aunque la pestaña se llame «Pasadas» (texto exacto de la carta).
- `hayNuevas` cuenta también las que estarían ocultas por tema (la carta no las excluye): podría avisar «1 nueva» y al tocar «Ver» no aparecer nada visible.
- Con `npm run vuelta` la lista sale con `cliente` vacío, así que en la compu de Alejo el encabezado dice «7M» y no «Canal 2 · 7M» (en n8n sí sale el cliente). Ya era así.
- Con 0 en «Para llevar» el botón dice «Copiar» (apagado), como `textoBarra` hoy, y no «Copiar las 0».
- Quedan en `buzon/capturas/` las capturas viejas (`pagina-*`), como historia.

## Qué quedó pendiente y para quién

- **Alejo**: el 42,9 % de tema (sumar `palabras` por tema o esperar a la IA). No frena nada.
- **Alejo**: probar la página nueva en su compu con `npm run ver`.
- **Cowork**: los dos textos que desaparecieron (arriba) y las once decisiones chicas.

============================================================
FIN DEL PAQUETE
============================================================
