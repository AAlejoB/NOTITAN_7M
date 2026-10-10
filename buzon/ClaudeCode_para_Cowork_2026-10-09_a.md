# Claude Code → Cowork · 09-10-2026 · 22:30 (hora de Argentina) · letra a

Responde a la carta `Cowork_para_ClaudeCode_2026-10-09_a.md` (base: commit `f20daa3`).

**Veredicto:** los 5 pasos de código están hechos y probados, y las 2 vueltas reales salieron bien (19 de 19 feeds, código 0, unos 3 segundos cada una). `npm test` pasó de 200 a 231 bien (+31) y sigue 1 pendiente; `npm run probar-pagina` da 68 bien y 0 mal. Con una vuelta de cada 11 minutos solo hay un corte de 4 horas medido (20-24), así que la medición del día real **todavía no dice nada**: falta la máquina que lo corra cada 30 minutos (preguntas 1 y 2). **Un hallazgo para revisar:** la regla del bloque provisorio manda al bloque nacional una noticia internacional (el Nobel de la Paz) porque los medios argentinos la publican en secciones genéricas (ver «Para Cowork»).

## Qué cambió

| Paso | Archivo | Qué cambió |
|---|---|---|
| carta | `buzon/Cowork_para_ClaudeCode_2026-10-09_a.md` | La carta guardada tal cual. |
| 1 | `src/provisorio.js` (nuevo) | `pareceInternacional`, `bloqueProvisorio` y `juiciosProvisorios`, tal cual 1b. |
| 1 | `config/reglas.json` | Sección `provisorio` con `seccionesInternacionales`, al final, después de `criterio1`. |
| 1 | `test/provisorio.test.js` (nuevo) | 7 tests: E1, E2, E3, las 8 claves con sus valores fijos, no-elegibles sin juicio, el viejo que se cae con `no_fresco (criterio 2)` y el fresco que no. |
| 2 | `src/entrega.js` | `armarEntrega(..., { sinIA = false })` devuelve `sinIA` después de `ejemplo`. |
| 2 | `pagina/index.html` | La regla `.franja.sinia` y la línea con el texto de la franja. |
| 2 | `pagina/lista.json` | Rearmado con `npm run pagina` (`"sinIA": false`, `ejemplo: true`). |
| 2 | `test/entrega.test.js` | 1 test: `sinIA` false por defecto, true si se pide, y false en `pagina/lista.json`. |
| 2 | `scripts/probar-pagina.js` | 2 comprobaciones más (la franja con `sinIA: true`, con el texto exacto; y sin la clave, no hay franja). |
| 3 | `scripts/vuelta.js` (nuevo) | `npm run vuelta` con `--carpeta`, `--cada`, `--sin-leer`, el candado, `datos/pagina/`, `vueltas.jsonl` y el resumen de pantalla. Exporta `vuelta()`. |
| 3 | `test/vuelta.test.js` (nuevo) | 13 tests: E4, E5, E6, E7, candado fresco y de 30 minutos, el candado se borra aunque falle, `notas.json` roto, `--sin-leer` (con y sin archivo), el bloque provisorio en nacional e internacional, la sección `mundo` en medios argentinos, y las opciones. |
| 3 | `package.json` | `vuelta` y `medir`. |
| 4 | `scripts/medir.js` (nuevo) | `npm run medir` con `--carpeta` y `--dia`; exporta `diaYCorteDe`, `porDiaYCorte` y `resumir`. |
| 4 | `test/medir.test.js` (nuevo) | 11 tests: E8, E9, E10, E11, los límites de los cortes, 4/5 con y sin firma, feeds caídos, archivo inexistente o vacío, renglón roto, el informe y las opciones. |
| 5 | `scripts/probar-pagina.js` | `--solo-capturas <carpeta>` junto con `--capturas <nombre>`. |
| 6 | `CLAUDE.md`, `buzon/pendientes.md`, `README.md` | Renglón de la etapa 1 en «Estado», «Siguiente paso» en un párrafo, los 5 cambios de `pendientes.md` y los 2 comandos en el README (con el número de tests real). |
| 6 | `buzon/capturas/pagina-real-2026-10-09-{390,1200,390-oscuro}.png` | Las 3 capturas de la lista real. |

Cómo queda una vuelta (lo que se escribe y dónde):

```
npm run vuelta
   │
   ├─ datos/vuelta.lock ......... mientras corre (25 min; se borra siempre)
   ├─ datos/notas.json .......... lo acumulado (48 h)
   ├─ datos/vueltas.jsonl ....... +1 línea por vuelta  ──►  npm run medir
   └─ datos/pagina/
        ├─ lista.json ........... la lista real (sinIA: true)
        ├─ index.html ........... copia fresca del repo
        └─ logica.js ............ copia fresca del repo
                                  (esta carpeta es la que algún día se sube al hosting)
```

## Tests

| | Bien | Pendiente | Total |
|---|---|---|---|
| `npm test` antes (reporte `d`) | 200 | 1 | 201 |
| `npm test` después | **231** | 1 | 232 |
| `npm run probar-pagina` antes | 66 | 0 mal | 66 |
| `npm run probar-pagina` después | **68** | 0 mal | 68 |

## C1 a C11

| # | Comprobación | Dio | ¿Cumple? |
|---|---|---|---|
| C1 | `npm test` antes y después | antes 200 bien y 1 pendiente; después 231 bien (+31) y 1 pendiente | sí |
| C2 | `preparar` + `juiciosProvisorios` sobre el día de ejemplo | 21 juicios y 21 (`candidatos.length + elegiblesAMano.length`) | sí |
| C3 | `grep -c '"sinIA": false' pagina/lista.json` | 1 | sí |
| C4 | Primera `npm run vuelta` | código 0; `ls datos/pagina`: `index.html lista.json logica.js`; `wc -l datos/vueltas.jsonl`: 1; `grep -c '"sinIA": true' datos/pagina/lista.json`: 1; `datos/vuelta.lock`: no está | sí |
| C5 | Segunda `npm run vuelta` 11 minutos después | 2 líneas en `vueltas.jsonl`; `repetidas` 962 | sí |
| C6 | `npm run medir` | la tabla de abajo: un solo corte (`20-24`) con las 2 vueltas y la fila «Día entero» | sí |
| C7 | `npm run probar-pagina` | 68 bien, 0 mal | sí |
| C8 | `--solo-capturas datos/pagina --capturas real-2026-10-09` | 3 archivos nuevos en `buzon/capturas/` (el de 390 se miró a ojo: franja azul «Sin el juicio de la IA…», 2 de 3 nacionales, 2 de 3 internacionales y la 4/5 abierta) | sí |
| C9 | `git ls-files datos` | nada | sí |
| C10 | `git add -A` y `git diff --cached --stat f20daa3` | 21 archivos, solo los de la lista (ver el renglón de abajo) | sí |
| C11 | Hora del encabezado | `TZ=America/Argentina/Buenos_Aires date` dio «Fri Oct  9 22:30:54 -03 2026» justo antes de escribir; el encabezado dice 22:30 | sí |

C10: `git diff --cached --stat f20daa3` da 21 archivos y 1.337 líneas agregadas, y son exactamente los de la lista de la carta: `config/reglas.json`, `src/provisorio.js`, `src/entrega.js`, `pagina/index.html`, `pagina/lista.json`, `scripts/vuelta.js`, `scripts/medir.js`, `scripts/probar-pagina.js`, `package.json`, los 4 tests (`provisorio`, `entrega`, `vuelta`, `medir`), `README.md`, `CLAUDE.md`, `buzon/pendientes.md`, la carta, este reporte y las 3 capturas. Ningún otro. Cumple.

## Lo medido (6b)

**1. Las 2 vueltas, el resumen de pantalla tal cual.** Antes de la primera, `datos/notas.json` tenía **1.277 notas** (las del 04-10): la primera vuelta borró 1.139 por tener más de 48 h y dejó 973.

```
VUELTA · 9/10/26 22:19 (hora de Argentina)
Feeds: 19 OK · 0 caídos
Notas: 1065 leídas · 1048 nuevas · 973 acumuladas
Hechos según grupos: 1: 745 · 2: 47 · 3: 7 · 4: 2 · 5+: 4
Confirmados: 2 nacionales + 2 internacionales
4/5 (les falta 1 medio): 0 nacionales + 1 internacionales
Lista: 2 nacionales + 2 internacionales
Escribí: datos/pagina/lista.json
Código de salida: 0
```

```
VUELTA · 9/10/26 22:30 (hora de Argentina)
Feeds: 19 OK · 0 caídos
Notas: 1067 leídas · 105 nuevas · 986 acumuladas
Hechos según grupos: 1: 754 · 2: 46 · 3: 8 · 4: 2 · 5+: 4
Confirmados: 2 nacionales + 2 internacionales
4/5 (les falta 1 medio): 0 nacionales + 1 internacionales
Lista: 2 nacionales + 2 internacionales
Escribí: datos/pagina/lista.json
Código de salida: 0
```

**2. La tabla de `npm run medir`, tal cual.**

```
DÍA 2026-10-09 · 2 vueltas · cada celda es nacionales / internacionales

Corte                   Vueltas  Confirmados  4/5 sin firma  4/5 con firma  Vía B
──────────────────────  ───────  ───────────  ─────────────  ─────────────  ─────
20-24                         2        2 / 2          0 / 1          0 / 0  0 / 0
Día entero (distintos)        2        2 / 2          0 / 1          0 / 0  0 / 0

Feeds caídos
  (ninguno)
Vueltas sin ningún feed: 0
```

**3. Los `confirmados` de la segunda vuelta, para revisar a ojo la regla del paso 1.**

| Título | Grupos | Bloque provisorio | Parecen internacionales / total | ¿La regla acertó? |
|---|---|---|---|---|
| Quién es Navi Pillay, la sudafricana que ganó el Nobel de la Paz 2026 | 7 | **nacional** | 3 / 9 | **No**: es internacional |
| Un terremoto de magnitud 7,6 sacudió Panamá y hay alerta de tsunami | 12 | internacional | 12 / 19 | sí |
| Trump afirma que Rusia acordó suministrar diésel al mercado mundial tras hablar con Putin | 8 | internacional | 7 / 8 | sí |
| Del gol de Enner Valencia a la lesión de Paredes: los mejores memes y reacciones del partido… | 5 | nacional | 0 / 7 | sí (deportes; 7 notas, todas de medios argentinos) |

La 4/5 de esa vuelta: «Emiratos afirma que el copiloto de un vuelo de Flydubai planeaba estrellarlo contra el aeropuerto…» (4 grupos, 3 / 4 parecen internacionales → internacional).

**4. Las 25 secciones más frecuentes en `datos/notas.json`** (986 notas, 108 secciones distintas; ← es de `seccionesInternacionales`).

| # | Sección | Notas | # | Sección | Notas |
|---|---|---|---|---|---|
| 1 | nota | 124 | 14 | policiales | 20 |
| 2 | noticias | 51 | 15 | cultura | 18 |
| 3 | deportes | 50 | 16 | espectaculos | 18 |
| 4 | es | 45 | 17 | lifestyle | 18 |
| 5 | economia | 44 | 18 | world ← | 17 |
| 6 | politica | 42 | 19 | internacional ← | 15 |
| 7 | sociedad | 41 | 20 | la-ciudad | 14 |
| 8 | mundo ← | 36 | 21 | show | 14 |
| 9 | (vacía) | 28 | 22 | estados-unidos | 14 |
| 10 | espana | 23 | 23 | news | 13 |
| 11 | america ← | 22 | 24 | opinion | 11 |
| 12 | informacion-gral | 21 | 25 | informacion-general | 11 |
| 13 | ovacion | 20 |  |  |  |

(Hay otras secciones con 10 o menos notas. Los empates están en el orden en que los dio el comando.)

**5. `duracionMs` y tamaños.** Primera vuelta 3.244 ms, segunda 3.473 ms. `datos/notas.json`: 604 KB (986 notas). `datos/pagina/lista.json`: 16 KB.

**6. `npm run probar-pagina`:** 68 comprobaciones (eran 66), 0 mal.

## Qué decidí por mi cuenta (para que otro lo revise)

| # | Qué | Por qué |
|---|---|---|
| 1 | `vuelta()` acepta además de `carpeta`, `ahora` y `fetch` las opciones `sinLeer`, `feeds`, `portales`, `reglas` y `firmas`, con `config/` por defecto. | Los tests usan feeds inventados y el comando usa `--sin-leer`. |
| 2 | `--sin-leer` sin `notas.json` corta con `ErrorDeUso` (como `scripts/leer.js`), antes de tomar el candado; no crea ninguna carpeta. | La carta no decía qué hacer sin archivo; es lo más conservador. |
| 3 | `--sin-leer` también respeta el candado (porque rehace `pagina/lista.json`). | Dos vueltas no deberían escribir la misma carpeta a la vez. |
| 4 | El código 2 es «ningún feed con estado `ok`»: un feed `vacio` cuenta como caído. | Se corresponde con `feeds.mal` de la línea de medición. |
| 5 | En `medir`, `viaB` toma el bloque de la última vuelta en que el hecho salió como confirmado; «feeds caídos» y «vueltas sin ningún feed» se calculan por día (no sobre todo el archivo). | La carta lo dejaba abierto. |
| 6 | Un renglón roto de `vueltas.jsonl` corta `medir` con un mensaje que dice el número de renglón (no se saltea). | Un renglón roto cambia los números sin que nadie se entere. |
| 7 | `--solo-capturas` sale con código 2 si a la carpeta le falta algún archivo, y no siembra estado en el navegador: las capturas muestran la lista como la ve alguien que entra por primera vez («Nueva» en todo). | La carta no pedía el estado de siempre (usa ids del día de ejemplo). |
| 8 | `pagina/lista.json` quedó con la hora (UTC) de cuando corrí `npm run pagina` en el paso 2: `2026-10-10T01:17:28Z`. | Es solo `generadaEn`; cada `npm run pagina` la cambia. |
| 9 | En el README corregí el número de `npm test` a 231 (decía 185). | Lo pedía la carta. |

## Para Cowork (marcado: pide una decisión de diseño)

1. **La regla del bloque provisorio falla en una noticia internacional con medios argentinos** (Nobel de la Paz a Navi Pillay: 3 de 9 notas «parecen» internacionales, sale como nacional). Los medios argentinos la ponen en `sociedad`, `nota`, `noticias`, `informacion-general` y `es`, que no dicen nada. En las otras dos internacionales la regla acertó porque hay muchas notas de BBC, DW, France 24 y El País. Con la lista real no se puede arreglar sin la IA (etapa 2); si se quiere un parche mientras tanto, las secciones `espana`, `estados-unidos` y `us` (23, 14 y varias) son candidatas para `seccionesInternacionales`. Valor por defecto: no se toca nada.
2. **Las secciones más frecuentes son ruido**: `nota` (124), `noticias` (51) y `es` (45) son lo más común y no dicen de qué es la nota (vienen de la ruta de la URL, o de la primera categoría del feed).
3. **La medición real todavía no existe**: 2 vueltas seguidas dan lo mismo (4 confirmadas + 1 4/5). Para responder «cuántas noticias da la regla de 5 en un día real» hace falta `npm run vuelta -- --cada 30` un día entero en una máquina que no se apague.

## Qué quedó pendiente y para quién

| Para | Qué |
|---|---|
| Alejo con Don Julio | Dónde corre cada 30 minutos (preguntas 1 y 2). Es lo único que frena la medición de un día real. |
| Cowork | Revisar este reporte y la regla del bloque provisorio (punto 1 de arriba); escribir la próxima carta. |
| Claude Code | Nada hasta la próxima carta. |
