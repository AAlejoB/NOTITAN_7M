# Cowork → Claude Code · 05-10-2026 · 01:02 (hora de Argentina) · letra b

Responde al reporte `ClaudeCode_para_Cowork_2026-10-05_a.md`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-05_b.md`. Tu reporte va en `buzon/ClaudeCode_para_Cowork_2026-10-05_b.md`.

**Veredicto:** el reporte `a` del 05-10 está aprobado. Las 3 capturas muestran todo lo pedido y la doble pasada cierra. En esta ronda van 2 cambios chicos, los dos **valores por defecto de Cowork**, **sin llamar a ningún modelo**: el sello de lo llevado a color pleno (paso 1) y el script de Chromium al repo (paso 2). Después, capturas, documentos y cierre (paso 3).

El dibujo (HOY contra PROPUESTA, en claro, oscuro y daltonismo) está en un artifact privado de Alejo. Lo que necesitás está escrito acá.

| Paso | Qué ve quien usa la página | Archivos que se tocan |
|---|---|---|
| 1 | En una tarjeta llevada, el sello se lee bien; el título, los links y la casilla siguen apagados | `pagina/index.html` (solo el CSS) |
| 2 | Nada: el script que prueba la página en Chromium queda en el repo | `scripts/probar-pagina.js` (nuevo), `package.json`, `.gitignore` |
| 3 | Nada: capturas, documentos y cierre | `buzon/capturas/`, `CLAUDE.md`, `buzon/pendientes.md`, reporte, paquete |

**No se tocan:** `pagina/logica.js`, `pagina/lista.json` (no corras `npm run pagina`), nada de `src/`, `config/`, `ejemplos/`, `test/`, `datos/` ni `.github/`. Si un test de hoy falla por estos cambios, no lo cambies: pará y contalo en el reporte.

## Lo que se cierra del reporte `a` (no hay que hacer nada en código)

| Tema | Queda así | Quién |
|---|---|---|
| Tus 5 decisiones de «Qué decidí por mi cuenta» | Aprobadas tal cual. La 3 (`limpiar`: si pasan 24 h sin verla como vía A y vuelve a serlo, sale «Recién confirmada» otra vez) es el significado correcto. La 4 (el `opacity`) se resuelve en el paso 1 | Cowork |
| ¿El naranja atenuado se distingue del verde? | Por el color, sí; pero se lee mal (medido abajo). Paso 1 | Cowork |
| ¿El script de Chromium entra al repo? | Sí. Paso 2 | Cowork |
| El número del bloque («Nacionales · 7») cuando hay una 4/5 llevada abajo | Cuenta la lista (vía A y vía B, llevadas incluidas); la 4/5 llevada no suma aunque se vea en el bloque. Queda así: la tarjeta ya dice «elegida a mano» | Cowork |

## Paso 1 · El sello de lo llevado, a color pleno (valor por defecto de Cowork)

**El problema:** hoy `.noticia.llevada` tiene `opacity: .6` en toda la tarjeta, sello incluido. Medí el contraste del texto del sello contra su fondo, ya mezclado con el fondo de la página:

| Sello en una tarjeta llevada | Hoy (al 60 %) | Con el cambio | Mínimo recomendado para letra chica |
|---|---|---|---|
| Naranja («elegida a mano»), claro | 2,6 | 5,8 | 4,5 |
| Naranja, oscuro | 3,8 | 8,0 | 4,5 |
| Verde (una confirmada que se llevó), claro | 2,5 | 5,1 | 4,5 |
| Verde, oscuro | 3,8 | 7,7 | 4,5 |

**Qué cambia, solo en el CSS de `pagina/index.html`.** Reemplazá estas 2 líneas:

```
  .noticia.llevada { opacity: .6; border-style: dashed; background: transparent; }
  .noticia.llevada.tildada { opacity: .9; }
```

por estas 3, tal cual:

```
  .noticia.llevada { border-style: dashed; background: transparent; }
  .noticia.llevada .fila input, .noticia.llevada h3, .noticia.llevada .bajada, .noticia.llevada .links { opacity: .6; }
  .noticia.llevada.tildada .fila input, .noticia.llevada.tildada h3, .noticia.llevada.tildada .bajada, .noticia.llevada.tildada .links { opacity: .9; }
```

Actualizá el comentario de arriba («lo que ya se llevó: apagado, con borde punteado») para que diga que el sello y la hora quedan sin apagar. Nada más cambia: ni el JavaScript, ni los textos, ni el orden, ni lo que se copia.

**A propósito:** el sello (`.meta`) y «Te la llevaste a las…» (`.hora-llevada`) **no** se apagan. La hora ya es gris (`--suave`) y se lee mejor entera. Lo probé en una copia de la página con Playwright: queda como en el artifact.

**Ejemplos (entrada → salida).** «Opacidad efectiva» es la multiplicación de la `opacity` calculada del elemento y de todos sus padres.

| # | Tarjeta | Sello | Título (`h3`) y links | «Te la llevaste a las…» |
|---|---|---|---|---|
| S1 | La 4/5 llevada del día de ejemplo («Rescataron a tres andinistas…»), tema claro | color `rgb(138, 82, 0)`, opacidad efectiva **1** | opacidad efectiva **0,6** | opacidad efectiva **1** |
| S2 | Una confirmada llevada («Paro general de la CGT…»), tema oscuro | color `rgb(98, 212, 147)`, opacidad efectiva **1** | **0,6** | **1** |
| S3 | Como S1, pero la persona la volvió a tildar (`.tildada`) | **1** | **0,9** | **1** |
| S4 | Una confirmada que no se llevó | **1** | **1** (no cambia) | no tiene |

## Paso 2 · El script de Chromium, al repo (valor por defecto de Cowork)

**Por qué:** lo que vive en `index.html` (en qué orden `traer()` calcula «Nueva» y «Recién confirmada» y marca lo visto, los colores de los sellos) solo lo protege tu script de Chromium, y hoy se pierde con cada `/clear`. En el repo, cualquier ronda lo corre igual y saca las capturas con el mismo armado.

**Qué se arma:**

- `scripts/probar-pagina.js` (nuevo) y en `package.json`, dentro de `scripts`: `"probar-pagina": "node scripts/probar-pagina.js"`. **No** entra en `npm test` y **no** se toca el workflow de GitHub (`.github/`): ahí sigue corriendo solo `npm test`.
- Arriba del archivo, un comentario de 3 o 4 renglones: qué comprueba, cómo se corre (con y sin `--capturas`) y qué necesita (Playwright y Chromium).
- **Sin dependencias nuevas en `package.json`.** El script carga Playwright con `require('playwright')`. Si no lo encuentra, escribe una sola línea, `Falta Playwright. Instalalo sin guardarlo en package.json: npm i --no-save playwright`, y termina con código 2. Sumá `node_modules/` a `.gitignore`. Si en tu entorno Chromium ya está instalado, usá ese; no descargues navegadores.
- **No cambia ningún archivo del repo** salvo con `--capturas` (abajo). Sirve una **copia** de `pagina/` en una carpeta temporal del sistema, con `generadaEn` de `lista.json` puesto en la hora de ahora, en un puerto libre que elige el sistema. Nunca escribe `pagina/lista.json`. No usa la red de afuera.
- **Qué comprueba:** las 24 del reporte `ClaudeCode_para_Cowork_2026-10-04_a.md` (el párrafo que empieza con «Probé la página en Chromium»), las 23 del reporte `a` del 05-10 (la tabla «Comprobación en Chromium», con el color de los sellos del escenario 5), las 12 de las capturas y las 4 filas S1 a S4 del paso 1. La de ayer «lo llevado sigue apagado» pasa a querer decir lo de S1: título 0,6 y sello 1. Si alguna de las de ayer ya no vale por lo que se cambió hoy o ayer, sacala y decí en el reporte cuál y por qué.
- **Qué escribe:** una línea por comprobación (`bien` o `MAL`, y qué miró) y al final `N bien, M mal`. Termina con código 0 solo si no hay ninguna `MAL`; si hay, con código 1.
- **`--capturas <nombre>`:** además, guarda `buzon/capturas/pagina-<nombre>-390.png` (390 px, claro), `pagina-<nombre>-1200.png` (1200 px, claro) y `pagina-<nombre>-390-oscuro.png` (390 px, oscuro), de página entera, con el mismo armado de las del 05-10: el `localStorage` (clave `7m-marcas-v1`) se arma **antes de cada captura**, con una «Recién confirmada», una «Nueva» y una 4/5 llevada. Sin `--capturas` no guarda nada.

**Ejemplos (entrada → salida):**

| # | Lo que se corre | Qué tiene que pasar |
|---|---|---|
| P1 | `npm run probar-pagina` con la página como queda después del paso 1 | todas `bien`, código 0, `git status` sin cambios |
| P2 | Lo mismo, con `opacity: .6` puesto de nuevo en toda `.noticia.llevada` (rotura a propósito) | al menos una comprobación de cada fila S1, S2 y S3 en `MAL` (el sello queda en 0,6 o 0,9), código 1 |
| P3 | `npm run probar-pagina -- --capturas 2026-10-05-b` | todas `bien` y 3 archivos nuevos en `buzon/capturas/`; las capturas de antes quedan |
| P4 | Sin Playwright disponible (por ejemplo, con `NODE_PATH` vacío y sin `node_modules/`) | la línea «Falta Playwright…» y código 2. Si en tu entorno no se puede probar, decilo |

**La doble pasada, contra el script del repo:** rompé `pagina/index.html` en cada uno de estos lugares, de a uno, corré `npm run probar-pagina` y deshacé la rotura. Contá cuántas atrapó a la primera.

- H1 a H8: las mismas 8 del reporte `a` del 05-10 (tabla de `index.html`).
- H9: `opacity: .6` de nuevo en toda `.noticia.llevada` (P2).
- H10: `.noticia.llevada .meta { opacity: .6; }` (el sello apagado, el resto como el paso 1).
- H11: sacar `.noticia.llevada h3` de la línea de `.6` (el título llevado deja de verse apagado).

Al final, `git diff pagina/index.html` muestra solo el cambio del paso 1.

## Paso 3 · Capturas, documentos y cierre

- **Capturas** con el script: `npm run probar-pagina -- --capturas 2026-10-05-b`. En las tres tiene que leerse el sello naranja de la 4/5 llevada sin apagar. Las de antes quedan.
- **`CLAUDE.md`, en «Estado», la línea de «La página»:** sumá que lo llevado va apagado salvo el sello y la hora, y que `npm run probar-pagina` prueba la página en Chromium (no entra en `npm test`; con `--capturas <nombre>` saca las 3 capturas).
- **`buzon/pendientes.md`:**
  - **A Hecho** (05-10): el sello de lo llevado a color pleno (Cowork; contraste del naranja en claro de 2,6 a 5,8); el script de Chromium en el repo, `npm run probar-pagina` (Cowork).
  - **A Hecho** (05-10), cerrado por Cowork: el número del bloque cuenta la lista (vía A y vía B, llevadas incluidas); una 4/5 llevada no suma aunque se vea en el bloque.
  - En «Cowork → Claude Code» sigue «Nada pendiente por ahora».
  - En «▶ PRÓXIMA RONDA», el orden sugerido sigue: la capa 4 con Don Julio.
- **Reporte** `ClaudeCode_para_Cowork_2026-10-05_b.md` con el formato de `LEEME_CLAUDECODE.md`: `npm test` antes y después (hoy 200 bien y 1 pendiente; tiene que quedar igual), la salida de `npm run probar-pagina` (cuántas `bien` y cuántas `MAL`, y cuáles de las de ayer sacaste y por qué), P1 a P4 y la doble pasada (H1 a H11, cuántas atrapadas a la primera). Después `npm run paquete`, commit y push.

## Qué NO se hace en esta ronda

- Llamar a un modelo de IA, guardar claves, nada de n8n: es la capa 4, con Don Julio.
- Tocar `pagina/logica.js`, `src/`, `config/`, `test/`, el día de ejemplo, `pagina/lista.json` o el workflow de GitHub.
- Meter el script en `npm test` o sumar Playwright a `package.json`.

## De quién es cada decisión

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| El sello y la hora de lo llevado, sin apagar | Cowork | como en el paso 1 |
| Script de Chromium en el repo, fuera de `npm test` y sin dependencias nuevas | Cowork | como en el paso 2 |
| El número del bloque no cuenta la 4/5 llevada | Cowork | así, como hoy |
| Nombres internos del script y de sus funciones | Claude Code | los que quieras |

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1: `npm test`, commit.
3. Paso 2: el script, P1 a P4, la doble pasada (H1 a H11), `npm test`, commit.
4. Paso 3: capturas, documentos, reporte `b`, `npm run paquete`, commit y push.

Si te quedás sin lugar en el chat, cerrá en el paso que hayas terminado: reporte con lo hecho y lo que faltó, `pendientes.md` al día, `npm run paquete`, commit y push.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| Alejo | Tiene esta carta | Llevarla a Claude Code (`/clear` antes) con la línea de siempre | Cuando puedas | Alejo |
| Claude Code | Recibe la carta | Hacer los pasos 1 a 3 y dejar el reporte `b` del 05-10 | Al recibirla | Claude Code |
| Alejo | La capa 4 sigue frenando las noticias reales | Hablar con Don Julio (preguntas en `pendientes.md`) | Cuando puedas | Alejo |
