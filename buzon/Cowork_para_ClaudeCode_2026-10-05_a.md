# Cowork → Claude Code · 05-10-2026 · 00:31 (hora de Argentina) · letra a

Responde al reporte `ClaudeCode_para_Cowork_2026-10-04_a.md`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-05_a.md`. Tu reporte va en `buzon/ClaudeCode_para_Cowork_2026-10-05_a.md`.

**Veredicto:** el reporte `a` está aprobado: la página está bien hecha y las mediciones cierran. En esta ronda van 4 cambios chicos, todos sobre el día de ejemplo y **sin llamar a ningún modelo**: una pastilla nueva, «Recién confirmada» (paso 1, **decidió Alejo**), la etiqueta de la vía B en violeta y la de la 4/5 llevada en naranja (paso 2), «4 de 5 medios» en las 4/5 (paso 3) y la pregunta de unión más estricta, con 2 casos de prueba más (paso 4). Después, los documentos (paso 5).

El dibujo de todo esto (HOY contra PROPUESTA) está en un artifact privado de Alejo. Lo que necesitás está escrito acá.

| Paso | Qué ve quien usa la página | Archivos que se tocan |
|---|---|---|
| 1 | Una 4/5 que ya vio y pasó a confirmada lleva «Recién confirmada» | `pagina/logica.js`, `pagina/index.html`, `test/logica.test.js` |
| 2 | La etiqueta «Respaldada por…» de la vía B sale en violeta, y la de una 4/5 llevada en naranja, no en verde | `pagina/index.html` |
| 3 | En las 4/5, «4 de 5 medios» en lugar de «4 de 5: Clarín · La Nación · …» | `pagina/logica.js`, `test/logica.test.js` |
| 4 | Nada todavía: la pregunta de unión pide más y hay 2 casos de prueba más | `src/ia.js`, `test/ia.test.js`, `test/casos-ia.json` |
| 5 | Nada: documentos, capturas y cierre | `CLAUDE.md`, `buzon/pendientes.md`, `buzon/capturas/`, reporte, paquete |

**No se tocan:** `src/nucleo.js`, `src/entrega.js`, `src/lector.js`, nada de `config/`, `pagina/lista.json` (no corras `npm run pagina`), el día de ejemplo (`ejemplos/`), `scripts/`, ni `datos/`. `textoParaCopiar` no cambia: lo que se copia no lleva ninguna pastilla.

## Lo que se cierra del reporte `a` (no hay que hacer nada en código)

| Tema | Queda así | Quién |
|---|---|---|
| M1 (ids entre vueltas) | Cerrado: 120 de 120 iguales; con 3 h de retraso, 1 de 104 cambia y la regla «comparte una url» lo reconoce | — |
| M2 (Chequeado) | No se suma | Cowork (valor por defecto aceptado) |
| Caso de bloque «Milei sigue con optimismo…» | **Nacional**, como está en `test/casos-ia.json`: con «por lugar», lo que hace Milei pasa en Argentina | Cowork, aplicando la regla de Alejo |
| «Nueva» en las 4/5 la primera vez | No sale, como hoy | Cowork (valor por defecto aceptado) |
| Lo que Claude Code decidió por su cuenta (horas `h23`, marcas, portapapeles, links en las 4/5, `nombreDeMedio`, `unirHechos`, `paresParaUnir`, `leerJuicio`/`leerUnion`) | Aprobado tal cual | Cowork |

## Paso 1 · «Recién confirmada» (decidió Alejo el 05-10, opción C)

**El problema:** una 4/5 que la persona ya vio (abajo, en «En observación») y que después llega al 5.º medio sube a las confirmadas. Hoy no lleva ninguna marca, porque `esNueva` da `false` (sus urls ya están en `vistas`). Queda mezclada con las otras y se pasa de largo justo cuando ya se puede publicar.

**Lo que decidió Alejo** (descartó «sin marca, como hoy» y «“Nueva” otra vez»): una pastilla propia, **«Recién confirmada»**, que dura esa visita, igual que «Nueva».

**Qué quiere decir, en una línea:** es la primera vez que la ve con la etiqueta «Confirmada por N medios», pero ya la había visto antes sin ella (como 4/5 o como vía B).

**«Visita»** es lo mismo que hoy para «Nueva»: desde que se abre (o se recarga) la página hasta que se cierra. Apretar «Traer noticias» no empieza una visita nueva.

### 1a · El estado

`vistas` sigue igual: todas las urls que se mostraron, de cualquier tarjeta. Se suma **`vistasConfirmadas: { url: hora }`**: las urls de las tarjetas con `via === 'A'` que se mostraron (de `bloque.noticias` de los dos bloques, también las que están abajo como llevadas). Las de vía B (`'B'`) y las 4/5 (`'mano'`) **no** entran.

- `estadoVacio()` → `{ vistas: {}, llevadas: [], vistasConfirmadas: {} }`.
- `normalizarEstado(e)`: si `e.vistasConfirmadas` es un objeto (no array, no null), se queda con los valores de texto, como `vistas`. **Si no lo es** (falta, es un número, un array o null), arranca como **copia de `vistas` ya normalizada**. Así nadie ve «Recién confirmada» en algo que ya tenía visto cuando se actualice la página. La clave sigue siendo `7m-marcas-v1`.
- `marcarVistas(tarjetas, estado, ahora)`: como hoy, y además pone `ahora` en `vistasConfirmadas` para cada url de cada tarjeta de `tarjetas` con `via === 'A'`. No hace falta otro parámetro: la tarjeta ya dice su vía.
- `marcarLlevadas` copia `vistasConfirmadas` sin cambiarla. `limpiar` saca de `vistasConfirmadas` lo de más de 24 h, con la misma cuenta que `vistas`.
- Todas las funciones que la leen toman una `vistasConfirmadas` que falta como `{}` (no tiran error con un estado armado a mano en un test).
- Todas siguen devolviendo un estado nuevo sin tocar el que reciben.

### 1b · La regla, en funciones puras de `pagina/logica.js` (se exportan)

- `esRecienConfirmada(t, estado)` es `true` si se cumplen las 4: (1) `t.via === 'A'`; (2) al menos una de sus urls está en `vistas`; (3) ninguna de sus urls está en `vistasConfirmadas`; (4) `llevadaA(t, estado)` da `null`.
- `recienConfirmadasDeLaVisita(tarjetas, estado, previas = [])`: igual que `nuevasDeLaVisita`: devuelve una lista de urls con las de `previas` más las de cada tarjeta que cumple `esRecienConfirmada`.
- `pastillaDe(t, { nuevas, recien, llevada })` → `'recien'`, `'nueva'` o `null`. **Es la única que decide qué pastilla se dibuja:**
  - si `llevada` es `true` → `null` (lo llevado va apagado, sin pastillas; **esto cambia algo de hoy**: hoy una llevada puede mostrar «Nueva»);
  - si `t.via === 'A'` y alguna url de `t` está en `recien` → `'recien'`;
  - si alguna url de `t` está en `nuevas` → `'nueva'`;
  - si no → `null`.
  - Nunca dos a la vez. «Recién confirmada» gana sobre «Nueva»: pasa cuando la vio como 4/5 en esta misma visita y, al traer de nuevo, ya está confirmada.

### 1c · `pagina/index.html`

- `var recien = [];` junto a `var nuevas = [];`.
- En `traer()`, en el mismo lugar que `nuevas` (antes de `dibujar()`): `recien = L.recienConfirmadasDeLaVisita(todas, estado, recien);`. `marcarVistas` sigue después de `dibujar()`, igual que hoy.
- En `noticia(t, opciones)`: la pastilla sale de `L.pastillaDe(t, { nuevas: nuevas, recien: recien, llevada: Boolean(opciones && opciones.hora) })`. `'nueva'` dibuja la de hoy; `'recien'` dibuja `<span class="recien">Recién confirmada</span>`, en el mismo lugar.
- CSS: `.recien { background: var(--verde); color: var(--tarjeta); border-radius: 999px; padding: 2px 10px; font-size: 13px; font-weight: 700; }`. Verde lleno: se distingue del sello (verde claro) y de «Nueva» (azul).
- Actualizá los comentarios que quedan viejos (el de `noticia` y el de la línea 142 sobre lo que hay en memoria).

### 1d · Ejemplos (entrada → salida)

En todos, X es una 4/5 con urls u1 a u4 que después llega al 5.º medio (u1 a u5, `via: 'A'`).

| # | Lo que pasó | Qué lleva la tarjeta |
|---|---|---|
| E1 | 10:00 abre la página y ve X abajo; no se la lleva. 10:30 abre la página de nuevo: X está arriba | «Recién confirmada» |
| E2 | 10:00 ve la confirmada Y (5 medios). 10:30 abre de nuevo: Y sigue confirmada, ahora con 6 | nada |
| E3 | 10:00 se lleva X con «Llevármela igual» y copia. 10:30 abre de nuevo: X está en `noticias` | nada; abajo, con «Te la llevaste a las 10:00» |
| E4 | Z aparece por primera vez a las 10:30, ya confirmada | «Nueva» |
| E5 | Como E1, pero lo guardado es de la versión de hoy (sin `vistasConfirmadas`) | nada |
| E6 | Como E1, pero X sube por la vía B (`via: 'B'`) | nada (la vía B nunca dice «confirmada») |
| E7 | La tarjeta W se mostró a las 10:00 como vía B («Respaldada por…»). 10:30 abre de nuevo: llegó a 5 medios y es vía A | «Recién confirmada» |
| E8 | Como E1, y a las 10:45 aprieta «Traer noticias» sin recargar | sigue «Recién confirmada» |
| E9 | Como E1, y a las 11:00 abre la página de nuevo | nada |
| E10 | 10:00 abre la página y ve X abajo (primera vez: sus urls quedan en `nuevas`). 10:30, sin recargar, aprieta «Traer noticias» y X ya está arriba | «Recién confirmada» (no «Nueva») |

### 1e · Tests (`test/logica.test.js`)

- Uno por fila de la tabla E1 a E10 (con `recienConfirmadasDeLaVisita`, sus `previas` y `pastillaDe`). Las tarjetas de estos tests necesitan `via`: el ayudante `tarjeta()` de hoy no la trae; sumale el parámetro.
- `limpiar` saca de `vistasConfirmadas` lo de más de 24 h y deja lo de 23 h.
- `normalizarEstado`: sin `vistasConfirmadas` → copia de `vistas`; con un número o un array en su lugar → copia de `vistas`; con un objeto con valores que no son texto → quedan solo los de texto.
- `marcarVistas` pone en `vistasConfirmadas` solo las urls de vía A, y no toca el estado que recibe.
- `pastillaDe` con una llevada da `null` aunque sea nueva o recién confirmada.
- **Dos tests de hoy cambian, y está bien:** L4 (sus estados armados a mano no traen `vistasConfirmadas`: con «falta = `{}`» tiene que pasar sin tocarlo; si no pasa, arreglá la función, no el test) y «cargarEstado y guardarEstado» (el `guardado` pasa a traer `vistasConfirmadas: { u1: AHORA }`, así sigue comparando igual).

### 1f · Comprobación en Chromium (como la del reporte `a`)

Armá a mano el `localStorage` (clave `7m-marcas-v1`) **con la clave `vistasConfirmadas` presente**: las urls de una confirmada del día de ejemplo en `vistas` y no en `vistasConfirmadas`; las de otra confirmada en las dos; las de una tercera en ninguna. Comprobá: la primera muestra «Recién confirmada», la segunda nada, la tercera «Nueva». Al apretar «Traer noticias», la primera sigue con «Recién confirmada». Al recargar, ninguna de las tres lleva pastilla. Y con `localStorage` bloqueado la página anda: las pastillas funcionan durante la visita y no se guarda nada.

## Paso 2 · La vía B en violeta (valor por defecto de Cowork)

**Por qué:** Alejo decidió que la vía B nunca dice «Confirmada» y va aparte, porque pide menos (1 autor en vez de 5 medios). Hoy su etiqueta tiene el mismo verde que «Confirmada por N medios» y de un vistazo parecen lo mismo.

**Qué cambia, solo en `pagina/index.html`:**

- Tokens nuevos en `:root`: `--violeta: #6a3fb5; --violeta-fondo: #efe8fb;` y en el bloque oscuro: `--violeta: #c4a8ff; --violeta-fondo: #2a1d45;`.
- `.sello.viab { background: var(--violeta-fondo); color: var(--violeta); }`.
- `.sello.mano { background: var(--ambar-fondo); color: var(--ambar); }`.
- En `noticia()`, el sello lleva la clase `sello viab` cuando `t.via === 'B'` y `sello mano` cuando `t.via === 'mano'`. Vía A queda `sello`, verde.
- El texto de las etiquetas no cambia. Las 4/5 de «En observación» (las que todavía no se llevó) no tienen sello y no cambian.

**Por qué también `mano`:** una 4/5 que se llevó baja al fondo y se dibuja con `noticia()`, con el sello «Confirmada por 4 medios · elegida a mano» en verde. Con el mismo naranja de «En observación» se ve que no es una de las confirmadas.

**Ejemplos:** «Confirmada por 5 medios» (vía A) → verde, como hoy. «Respaldada por Autora Ficticia Uno y Autor Ficticio Tres» (vía B) → violeta. «Confirmada por 4 medios · elegida a mano», abajo entre las llevadas → naranja.

## Paso 3 · «4 de 5 medios» en las 4/5 (valor por defecto de Cowork)

**Por qué:** la línea naranja repite los mismos nombres que los links de abajo. Con «4 de 5 medios» queda igual que «Confirmada por 5 medios» arriba y en el celular ahorra un renglón por tarjeta.

**Qué cambia:** en `pagina/logica.js`, `etiquetaMedios(t, minGrupos)` devuelve `` `${t.grupos} de ${minGrupos} medios` ``. `t.medios` sigue en la tarjeta (no toques `src/entrega.js`). El test está en la última línea de «los textos de cada bloque…» (`test/logica.test.js`): cambiá lo que espera. Actualizá también los comentarios que dicen «4 de 5: medios» (`pagina/logica.js` y `pagina/index.html`).

**Ejemplos:** `{ grupos: 4, medios: ['Clarín', 'La Nación', 'Infobae', 'Página/12'] }` con `minGrupos` 5 → `4 de 5 medios`. `{ grupos: 4, medios: ['BBC', 'DW', 'France 24', 'El País'] }` → `4 de 5 medios`.

Esto cierra el pendiente «Detalle conocido de la página» (`medios` podía mostrar un nombre de más con un cable copiado): la línea ya no nombra medios.

## Paso 4 · La pregunta de unión, más estricta (valor por defecto de Cowork)

**Por qué:** en M3, de 5 pares, 2 son «no» (el 1 y el 4) y **los 5 llegarían a 5 medios**. Si la IA contesta «sí» donde no, sale una «Confirmada» que no lo es. Alejo aceptó ese riesgo; esto lo achica sin cambiar su decisión. Los dos ejemplos de hoy (Presupuesto, paro) no enseñan las dos trampas que aparecieron: «la misma persona, otra cosa que pasó» (par 1) y «la reacción no es el hecho» (par 4). Y una respuesta equivocada que dice «no» cuesta poco (el hecho queda en observación); una que dice «sí» cuesta mucho.

**En `src/ia.js`, `preguntaUnion`:** después de la línea que empieza con `Ejemplos:` y antes de la línea vacía, agregá estas 2 líneas, tal cual:

```
Tampoco son la misma noticia «El Presidente inauguró una ruta en Córdoba» y «El Presidente habló en un foro en Madrid» (la misma persona, pero pasó otra cosa), ni «Chile eligió presidente» y «El Gobierno argentino felicitó al nuevo presidente de Chile» (uno es lo que pasó; el otro, lo que alguien hizo por eso).
Si dudás, contestá false: es mejor dejar dos hechos separados que juntar dos que no son.
```

Nada más cambia en la pregunta. `leerUnion` no cambia.

**En `test/casos-ia.json`, `union`:** agregá **al final y en este orden** (no cambies el orden de los 4 que están) los 2 pares de M3 que faltan. Quedan como `union[4]` y `union[5]`:

| Queda en | Par de M3 | `a` | `b` | `misma` | Además |
|---|---|---|---|---|---|
| `union[4]` | 2 | «A la espera de los primeros resultados, Milei sigue con optimismo la elección en Brasil y respaldó a Bolsonaro en redes» (el mismo texto que ya es la `b` de `union[1]`) | «Tras el cierre de los comicios, Lula Da Silva y Flávio Bolsonaro disputan voto a voto la presidencia» (el mismo texto que ya es la `b` de `union[2]`) | `false` | `"dudoso": true` |
| `union[5]` | 1 | el mismo de Milei | el título **completo** de la nota de García Cuerva en la misa de Luján, copiado de `datos/notas.json` | `false` | — |

**Si no tenés `datos/notas.json`** (o no encontrás ahí el título completo de García Cuerva): no lo inventes ni lo cortes. Agregá solo `union[4]` y decilo en el reporte; ese caso va en la próxima ronda.

En `_aviso`: cambiá «el último de 'union' es inventado» por «`union[3]` es inventado», y sumá al final: `Los casos con "dudoso": true no cuentan para decidir si se prende la unión.`

**En `test/ia.test.js`:**

- El test de I8c: además de lo que ya mira, que la pregunta incluya las 2 líneas nuevas tal cual y que estén entre la de `Ejemplos:` y `Contestá solo con un JSON`.
- El test «los ejemplos de la pregunta de unión no son los de los casos de prueba»: que mire también la línea que empieza con `Tampoco son`.
- El test de `test/casos-ia.json`: `union` tiene 6 (o 5, si no estaba el título de García Cuerva); `union[3]` es el único con `inventado`; `union[4]` es el único con `dudoso` y tiene `misma === false`; `union[1]` sigue en `false`; si hay `union[5]`, tiene `misma === false`.

**La regla para la capa 4** (no es código: va a `pendientes.md` y a `CLAUDE.md`, paso 5): antes de prender la unión con un modelo real, se le hace a ese modelo, con la misma configuración que va a usar n8n, cada caso de unión de `test/casos-ia.json` que no es `dudoso`, **3 veces**. Tiene que acertar las 3 veces en todos. Una respuesta que `leerUnion` no puede leer (`null`) cuenta como error. Si erra una, la unión queda apagada hasta que se arregle la pregunta o se cambie de modelo. Los casos `true` también cuentan: así «Si dudás, contestá false» no lo vuelve tan desconfiado que no une nada.

## Paso 5 · Documentos, capturas y cierre

**Capturas** en `buzon/capturas/`, de página entera: `pagina-2026-10-05-390.png` (390 px, claro), `pagina-2026-10-05-1200.png` (1200 px, claro) y `pagina-2026-10-05-390-oscuro.png` (390 px, oscuro). En las tres tienen que verse juntas: una «Recién confirmada», una «Nueva», la vía B en violeta, «4 de 5 medios» y una 4/5 llevada abajo con el sello naranja. Para eso:

- Armá el `localStorage` como en 1f **antes de cada captura** (al cargar, la página marca todo como visto y lo guarda, y la segunda captura saldría sin pastillas). Sumale una 4/5 llevada.
- `pagina/lista.json` tiene la hora de ayer y saldría el aviso «No se actualiza desde…». Para las capturas serví una copia con `generadaEn` de ahora (o fijá el reloj del navegador). No commitees `pagina/lista.json`.
- Las de ayer quedan.

**`CLAUDE.md`, en «Estado» (la línea de «La página»):** «Recién confirmada» (qué es, que dura la visita, `vistasConfirmadas` y que un estado viejo la arranca como copia de `vistas`), la vía B en violeta y «4 de 5 medios». En «Lo que Alejo pidió», dentro de «La entrega»: **«Una 4/5 que ya vio y sube a confirmada: “Recién confirmada”, que dura esa visita (decidió Alejo el 05-10). Descartado: sin marca; “Nueva” otra vez.»** En el ítem que empieza con «**Hechos partidos, decidido por Alejo (04-10-2026, opción A), espera la IA:**» (dentro de «Lo que Alejo pidió el 2026-10-04»): las 2 líneas nuevas de la pregunta y la regla para la capa 4, como valores por defecto de Cowork. Tests al día.

**`buzon/pendientes.md`:**

- **A Hecho** (05-10): «Recién confirmada» (decidió Alejo, opción C); la vía B en violeta y «4 de 5 medios» (Cowork); la pregunta de unión más estricta y los 2 casos nuevos (Cowork).
- **A Hecho** (05-10), cerrados por Cowork: «Revisar la página y lo medido en el reporte `a`» (aprobado); Chequeado (no se suma); «Nueva» en las 4/5 (no); «Detalle conocido de la página» (ya no aplica: la línea no nombra medios).
- **«El juicio de un hecho mezclado»:** sumá que el caso de bloque de «Milei sigue con optimismo…» queda **nacional** (Cowork, por la regla «por lugar» de Alejo), y arreglá el renglón pegado: «…(`test/casos-ia.json`).- [ ] **Caso borde de la vía B…**» tiene que ser dos ítems, cada uno en su línea.
- **Capa 4:** sumá la regla para prender la unión (paso 4).
- En «▶ PRÓXIMA RONDA», el orden sugerido queda: la capa 4 con Don Julio.

**Reporte** `ClaudeCode_para_Cowork_2026-10-05_a.md` con el formato de `LEEME_CLAUDECODE.md`: tests antes y después (hoy 185 bien y 1 pendiente), qué test se agregó o cambió por paso, las capturas, la comprobación en Chromium, y la doble pasada: rompé a propósito la regla de «Recién confirmada» en al menos 8 lugares (sacar cada una de las 4 condiciones de `esRecienConfirmada`, que no dure la visita, que el estado viejo no se copie, que «Nueva» gane sobre «Recién confirmada» en `pastillaDe`, que la vía B entre en `vistasConfirmadas`) y contá cuántas atraparon los tests a la primera. Lo que está en `index.html` (dónde se llama cada función en `traer()`) no lo ve `npm test`: decí aparte qué rompiste ahí y si lo atrapó la comprobación en Chromium. Después `npm run paquete`, commit y push.

## Qué NO se hace en esta ronda

- Llamar a un modelo de IA, guardar claves, nada de n8n: es la capa 4, con Don Julio.
- Tocar el núcleo, la entrega, el lector, `config/`, el día de ejemplo o `pagina/lista.json`.
- Cambiar `paresParaUnir` (la regla de una palabra propia en común queda: la pregunta es el filtro).
- Que «Recién confirmada» cambie el orden o entre en lo que se copia.

## De quién es cada decisión

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| «Recién confirmada» para una 4/5 que ya vio y sube | Alejo (decidido el 05-10) | opción C, dura la visita |
| Solo vía A; vía B que sube a A sí la lleva; gana sobre «Nueva»; llevadas sin ninguna pastilla; estado viejo como copia de `vistas` | Cowork | como en el paso 1 |
| Color de la vía B y de la 4/5 llevada | Cowork | violeta y naranja |
| «4 de 5 medios» | Cowork | sí |
| Las 2 líneas nuevas de la pregunta de unión | Cowork | tal cual arriba |
| Regla para prender la unión en la capa 4 | Cowork | todos los casos no dudosos bien |
| Nombres internos de funciones y tests | Claude Code | los propuestos, o mejores si hace falta |

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1: `npm test`, comprobación en Chromium, commit.
3. Paso 2 y paso 3: `npm test`, commit.
4. Paso 4: `npm test`, commit.
5. Paso 5: capturas, documentos, reporte `a`, `npm run paquete`, commit y push.

Si te quedás sin lugar en el chat, cerrá en el paso que hayas terminado: reporte con lo hecho y lo que faltó, `pendientes.md` al día, `npm run paquete`, commit y push.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| Alejo | Tiene esta carta | Llevarla a Claude Code (`/clear` antes) con la línea de siempre | Cuando puedas | Alejo |
| Claude Code | Recibe la carta | Hacer los pasos 1 a 5 y dejar el reporte `a` del 05-10 | Al recibirla | Claude Code |
| Alejo | La capa 4 sigue frenando las noticias reales | Hablar con Don Julio (preguntas en `pendientes.md`) | Cuando puedas | Alejo |
