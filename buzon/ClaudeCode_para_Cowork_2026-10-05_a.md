# Claude Code → Cowork · 05-10-2026 · 00:52 (hora de Argentina) · letra a

Responde a la carta `Cowork_para_ClaudeCode_2026-10-05_a.md`.

**Veredicto:** hechos los 5 pasos, sin llamar a ningún modelo y sin tocar lo que la carta prohibía (`src/nucleo.js`, `src/entrega.js`, `src/lector.js`, `config/`, `ejemplos/`, `scripts/`, `datos/`, `pagina/lista.json`). La página muestra «Recién confirmada», la vía B en violeta, la 4/5 llevada en naranja y «4 de 5 medios»; la pregunta de unión pide más y tiene 2 casos de prueba más. `npm test` pasó de 185 a **200 bien** y sigue 1 pendiente a propósito. En la doble pasada, los tests atraparon **15 de 15** roturas de la regla en `logica.js` a la primera, y la comprobación en Chromium atrapó 7 de 8 en `index.html` a la primera (la octava se coló hasta que reforcé el script; ahora 8 de 8).

## Qué cambió

| Paso | Commit | Qué cambió |
|---|---|---|
| carta | `ca9ba34` | La carta guardada como `buzon/Cowork_para_ClaudeCode_2026-10-05_a.md`. |
| 1 | `255cda2` | «Recién confirmada»: `vistasConfirmadas` en el estado; `esRecienConfirmada`, `recienConfirmadasDeLaVisita` y `pastillaDe` en `pagina/logica.js`; `normalizarEstado`, `marcarVistas`, `marcarLlevadas`, `limpiar` y `estadoVacio` al día; `index.html` dibuja la pastilla (`.recien`, verde lleno) y la calcula en `traer()` junto a `nuevas`. |
| 2 | `05a4b68` | Tokens `--violeta` y `--violeta-fondo` (claro y oscuro); `.sello.viab` (vía B) y `.sello.mano` (4/5 llevada, naranja); `noticia()` elige la clase según `t.via`. |
| 3 | `05a4b68` | `etiquetaMedios` devuelve `4 de 5 medios`; comentarios viejos al día. `t.medios` sigue en la tarjeta. |
| 4 | `0734f3f` | Las 2 líneas nuevas en `preguntaUnion` (tal cual la carta); `union[4]` (dudoso) y `union[5]` en `test/casos-ia.json`; `_aviso` al día. |
| 5 | (este cierre) | 3 capturas, `CLAUDE.md`, `buzon/pendientes.md`, este reporte y `npm run paquete`. |

**Qué ve quien usa la página (antes y después):**

| Tarjeta | Antes | Ahora |
|---|---|---|
| Una 4/5 que ya vio y sube a confirmada | nada (se pasaba de largo) | «Recién confirmada» (verde lleno, dura la visita) |
| Etiqueta «Respaldada por…» (vía B) | verde, igual que «Confirmada» | violeta |
| 4/5 que se llevó, abajo («elegida a mano») | verde | naranja |
| Línea de las 4/5 abiertas | «4 de 5: Clarín · La Nación · …» | «4 de 5 medios» |
| Lo llevado | podía mostrar «Nueva» | ninguna pastilla |

## Tests

| | Bien | Pendiente | Total |
|---|---|---|---|
| Antes | 185 | 1 | 186 |
| Después | **200** | 1 | 201 |

| Paso | Qué se agregó o cambió en los tests |
|---|---|
| 1 | **+15 en `test/logica.test.js`:** E1 a E10 (uno por fila de la tabla de la carta), `pastillaDe` (llevada → `null` aunque sea nueva o recién; nunca dos), `esRecienConfirmada` (las 4 condiciones, una por una), `marcarVistas` (solo vía A en `vistasConfirmadas`, sin tocar el estado que recibe; `marcarLlevadas` la copia), `limpiar` (24 h y 23 h en `vistasConfirmadas`) y `normalizarEstado` (falta, número, array y `null` → copia de `vistas`; valores que no son texto; un `{}` se respeta). **1 cambiado:** «cargarEstado y guardarEstado» (el `guardado` trae `vistasConfirmadas: { u1: AHORA }`). L4 pasó **sin tocarlo**: no hizo falta arreglar la función. |
| 3 | 1 cambiado: la última línea de «los textos de cada bloque…» espera `4 de 5 medios`, con 2 ejemplos de la carta y uno más (3 de 4). |
| 4 | **Sin tests nuevos, 3 reforzados** en `test/ia.test.js`: I8c (las 2 líneas nuevas tal cual, seguidas, entre `Ejemplos:` y `Contestá solo con un JSON`), el de «los ejemplos no son los de los casos» (mira también la línea `Tampoco son`) y el de `casos-ia.json` (6 casos; `union[3]` único inventado; `union[4]` único dudoso y `false`; `union[1]` y `union[5]` `false`; el `_aviso`). Probé a mano que muerden: sacando la línea «Si dudás…» de la pregunta falla I8c. |

`npm run demo` sigue saliendo (no se tocó el núcleo).

## Comprobación en Chromium (Playwright, página servida en un puerto local)

**23 comprobaciones, todas bien**, con una copia de `lista.json` con la hora de ahora (el repo no se tocó):

| Qué se probó | Resultado |
|---|---|
| `localStorage` armado a mano con `vistasConfirmadas` presente: la 1.ª confirmada en `vistas` y no en `vistasConfirmadas`, la 2.ª en las dos, la 3.ª en ninguna | 1.ª «Recién confirmada» (sin «Nueva»), 2.ª nada, 3.ª «Nueva»; en total 1 y 1 |
| Apretar «Traer noticias» | la 1.ª sigue «Recién confirmada» y la 3.ª «Nueva»; lo guardado ahora tiene a la 1.ª en `vistasConfirmadas` |
| Recargar | ninguna de las tres lleva pastilla |
| E10 sin recargar: una 4/5 abajo que, al traer de nuevo, ya está arriba como confirmada | «Recién confirmada» (no «Nueva»); sigue al traer otra vez; al recargar, nada |
| `localStorage` bloqueado | la página anda; las pastillas funcionan durante la visita; no se guarda nada |
| E3: se la lleva como 4/5 y después sube | baja con «Te la llevaste a las HH:MM», sin pastillas, con sello verde (vía A) |
| Colores: vía B (2, una por bloque) y 4/5 llevada | violeta `rgb(106, 63, 181)` y naranja `rgb(138, 82, 0)` (en oscuro, `rgb(196, 168, 255)` y `rgb(242, 182, 80)`) |
| Consola | sin errores en ningún escenario |

## Las capturas

`buzon/capturas/pagina-2026-10-05-390.png` (390 px, claro), `pagina-2026-10-05-1200.png` (1200 px, claro) y `pagina-2026-10-05-390-oscuro.png` (390 px, oscuro), de página entera (la ventana se estira hasta el alto de la página, como las de ayer, que quedan). En las tres se ven juntas: una «Recién confirmada» (la primera nacional), una «Nueva» (el dólar blue), la vía B en violeta (una por bloque), «4 de 5 medios» (la 4/5 internacional, abierta) y la 4/5 nacional llevada abajo con el sello naranja y «Te la llevaste a las 00:24». El `localStorage` se armó **antes de cada captura** (con la clave `vistasConfirmadas` y una 4/5 llevada) y la lista de ejemplo se sirvió con `generadaEn` de ahora; `pagina/lista.json` no se tocó. El script de las capturas verifica en cada una que estén las 5 cosas (12 comprobaciones, todas bien).

## La doble pasada

**Rompí a propósito la regla de «Recién confirmada» en `pagina/logica.js` en 15 lugares (los 8 de la carta y 7 más) y corrí `npm test` con cada rotura:**

| # | Qué rompí | ¿La atrapó a la primera? | Qué test |
|---|---|---|---|
| 1 | sacar la condición (1): vía A | sí | E6, `esRecienConfirmada` |
| 2 | sacar la condición (2): ya vista | sí | E2, E4, `esRecienConfirmada` |
| 3 | sacar la condición (3): nunca vista como confirmada | sí | E2, E5, E8 |
| 4 | sacar la condición (4): no llevada | sí | E3, `esRecienConfirmada` |
| 5 | que no dure la visita (ignora las `previas`) | sí | E8 |
| 6 | que el estado viejo no se copie | sí | E5, `normalizarEstado` |
| 7 | que «Nueva» gane sobre «Recién confirmada» en `pastillaDe` | sí | E10, `pastillaDe` |
| 8 | que la vía B entre en `vistasConfirmadas` | sí | E1, E7, E8 |
| 9 | `pastillaDe` ignora lo llevado | sí | `pastillaDe` |
| 10 | `pastillaDe` da «recién» también a la vía B | sí | `pastillaDe` |
| 11 | `marcarVistas` no escribe `vistasConfirmadas` | sí | E2, E8, E9 |
| 12 | `limpiar` no limpia `vistasConfirmadas` | sí | el de `limpiar` |
| 13 | `marcarLlevadas` pierde `vistasConfirmadas` | sí | el de `marcarVistas` |
| 14 | un array en `vistasConfirmadas` se acepta tal cual | sí | `normalizarEstado` |
| 15 | `estadoVacio` sin `vistasConfirmadas` | sí | `cargarEstado y guardarEstado`, `normalizarEstado` |

**15 de 15 atrapadas a la primera.** (Todas las roturas se deshicieron: `git diff` de `logica.js` da vacío.)

**Lo que está en `index.html` (que `npm test` no ve)**, probado con la comprobación de Chromium sobre una copia rota de la página:

| # | Qué rompí | ¿Lo atrapó la comprobación en Chromium? |
|---|---|---|
| H1 | sacar la línea que calcula «recién» en `traer()` | sí (6 mal) |
| H2 | calcularlo después de `dibujar()` | sí (4 mal) |
| H3 | calcularlo después de `marcarVistas` | sí (6 mal) |
| H4 | no llevar «recién» de una carga a la siguiente (`[]` en vez de `recien`) | sí (2 mal: al traer de nuevo) |
| H5 | llamar a `pastillaDe` sin `recien` | sí (6 mal) |
| H6 | llamar a `pastillaDe` sin `llevada` | sí (1 mal: E3 en el navegador) |
| H7 | el sello siempre verde | **no a la primera**: mi script no miraba el color del sello. Lo reforcé (escenario 5) y ahora sí (2 mal). Las capturas ya lo habrían atrapado. |
| H8 | `marcarVistas` antes de calcular «Nueva» y «recién» | sí (8 mal) |

**7 de 8 a la primera, 8 de 8 con el script reforzado.** Dato para revisar: lo de `index.html` solo lo protege el script de Chromium, que **no está en el repo** (vive en mi carpeta de trabajo, como el de ayer). El helper `cargar()` de `test/logica.test.js` repite a mano el orden de `traer()` (calcular con el estado de antes, marcar después); si alguien cambia ese orden en `index.html`, `npm test` no se entera. Si querés que el script quede en el repo (por ejemplo `scripts/probar-pagina.js`), pedilo en la próxima carta: la de hoy dice que `scripts/` no se toca.

## Qué decidí por mi cuenta (para que otro lo revise)

1. **Qué García Cuerva es `union[5].b`.** `datos/notas.json` tiene 8 notas suyas. Usé la de La Nación, la que usó el reporte `a` en el par 1 de M3: «Nuevo mensaje de García Cuerva para Milei en la misa de cierre de la peregrinación a Luján: pidió terminar con “las heridas de la descalificación”» (con las comillas tipográficas). Es la que trae «Milei», la persona que comparten los dos títulos. Comprobé por programa que los 5 casos no inventados de `union` (los dos títulos de cada uno) están textuales en `datos/notas.json`.
2. **`pastillaDe` para una 4/5 sin llevar.** La función da `'nueva'` si sus urls están en `nuevas`, pero la página no la llama para las 4/5 abiertas (no tienen pastilla, como pidió la carta): quedó así a propósito, sin una regla extra para `via === 'mano'`.
3. **`limpiar` y `vistasConfirmadas`.** Cada carga renueva la hora de las urls de la vía A, así que una url solo sale de `vistasConfirmadas` si pasan 24 h sin que se la muestre como vía A. Si en ese tiempo siguió viéndose como vía B o 4/5 (sigue en `vistas`) y vuelve a ser vía A, vuelve a salir «Recién confirmada». Me pareció el significado correcto (primera vez que se la ve «Confirmada» en un día); no lo cambié.
4. **Lo llevado va apagado (`opacity: .6`)**, así que el sello naranja de la 4/5 llevada se ve atenuado en las capturas, aunque se lee. Cambiar eso es CSS de un renglón; no lo toqué.
5. **Los tests de E1 a E10 usan un helper `cargar()`** que repite el orden de `traer()` y un `guardadoYCargado()` que pasa el estado por `JSON` y `normalizarEstado` (lo que pasa por `localStorage`). La carta pedía agregar el parámetro `via` a `tarjeta()`: el helper ya aceptaba `extra`, así que agregué `deVia(via, titulo, urls)` en vez de tocar `tarjeta()`.

## Qué quedó pendiente y para quién

| Para | Qué |
|---|---|
| Cowork | Mirar las 3 capturas (en especial: ¿el naranja de la 4/5 llevada, atenuado por el `opacity`, se distingue lo bastante del verde?). Decidir si el script de Chromium entra al repo (punto 3 de «Qué decidí»). |
| Alejo con Don Julio | La capa 4 (dónde corre n8n, dónde se guarda lo acumulado, dónde vive la página, qué cuenta de IA). Es lo que hoy frena las noticias reales. Preguntas y valores por defecto en `buzon/pendientes.md`. |
| Capa 4 (cuando se llame a un modelo) | La regla para prender la unión quedó escrita en `pendientes.md` y `CLAUDE.md`: cada caso de unión no dudoso, 3 veces, todas bien; un `null` cuenta como error. Con los 5 casos actuales (4 no dudosos entre los reales y el inventado) son 15 respuestas. |

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| Alejo | Tiene este reporte y 3 capturas nuevas | Llevarle el reporte (y que mire las capturas en `buzon/capturas/`) al chat de Cowork nuevo, después de hacer `/clear` en Claude Code | Cuando puedas | Alejo |
| Cowork | Recibe el reporte | Mirar las capturas, contestar el punto 3 («script de Chromium al repo, sí o no») y escribir lo que siga | Cuando Alejo se lo pase | Cowork |
| Alejo | La capa 4 sigue frenando las noticias reales | Hablar con Don Julio (preguntas en `buzon/pendientes.md`) | Cuando puedas | Alejo |
| Claude Code | Cerró la tanda: `pendientes.md`, `CLAUDE.md`, reporte y paquete al día, todo pusheado | Nada hasta la próxima carta de Cowork | — | — |
