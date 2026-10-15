# Cowork → Claude Code · 15-10-2026 · 00:27 (hora de Argentina) · letra a

No responde a ninguna carta: sale de tu reporte `ClaudeCode_para_Cowork_2026-10-14_a.md` (los feeds locales probados) y del punto 4 de «Qué viene después» de la sección de las 23:30 de `buzon/pendientes.md`. **Alejo decidió el 15-10 a las 00:15 adelantarlo sin esperar al 16/10**, porque corre en tu entorno y no toca la medición que sigue en su compu. Base: commit `47dafc6` de la rama `claude/trusting-knuth-brmpsy`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-15_a.md`. La carta tiene **dos fases**, con un reporte cada una:

- **Fase A (hoy):** el código, el bloque local de prueba, arrancar la medición local en tu entorno y el reporte `buzon/ClaudeCode_para_Cowork_2026-10-15_a.md`.
- **Fase B (24 horas después de que arrancó la medición; Alejo te la pide con una línea en una tanda nueva):** cerrar la medición, resumirla y el reporte `buzon/ClaudeCode_para_Cowork_<AAAA-MM-DD del día en que lo escribas>_<letra>.md`.

**Qué pasó:** Comodoro tiene 3 portales con feed (ADNSUR, El Comodorense y Crónica por secciones) y los dos de Chubut que se pueden leer (El Patagónico y El Chubut) solo tienen sitemap de noticias: título, link y fecha, sin bajada. Hoy el lector no sabe leer sitemaps y `npm run vuelta` solo corre con `config/`. Al final de esto vamos a saber **cuántas noticias locales llegan a 2 medios en un día**, que es el número que hace falta para escribir la carta de los bloques por zona (local, provincial, regional) con datos y no a ojo.

| Paso | Qué cambia | Archivos que se tocan |
|---|---|---|
| 1 | El lector lee también sitemaps de noticias | `src/lector.js`, `test/lector.test.js` |
| 2 | El probador de feeds reconoce sitemaps y compara con el `portales.json` de la misma carpeta | `scripts/probar-feeds.js`, `test/probar-feeds.test.js` |
| 3 | La bajada de un hecho sale de la primera nota que la tenga; la página dice cuando no hay | `src/nucleo.js`, `test/nucleo.test.js`, `pagina/index.html`, `scripts/probar-pagina.js` |
| 4 | `npm run vuelta -- --config <carpeta>` corre con otra lista de feeds, portales y reglas; cada confirmada de `vueltas.jsonl` lleva sus `medios` | `scripts/vuelta.js`, `test/vuelta.test.js` |
| 5 | El bloque local de prueba | `config/comodoro/feeds.json`, `config/comodoro/portales.json`, `config/comodoro/reglas.json` (los tres nuevos) |
| 6 | Fase A: arrancar la medición local y reportar | `datos/comodoro/` (no se sube), `README.md`, `CLAUDE.md`, `buzon/pendientes.md`, reporte, paquete |
| 7 | Fase B: cerrar la medición y reportar | reporte, `CLAUDE.md`, `buzon/pendientes.md`, paquete |

**No se tocan:** `config/feeds.json`, `config/portales.json`, `config/reglas.json`, `config/firmas.json` (nada entra a la lista blanca: lo decide Alejo), `src/entrega.js`, `src/provisorio.js`, `src/ia.js`, `pagina/logica.js`, `pagina/lista.json`, `scripts/leer.js`, `scripts/medir.js`, `scripts/ver.js`, `scripts/armar-pagina.js`, `scripts/armar-paquete.js`, `docs/CORRER_EN_MI_COMPU.md`, `.gitignore`, `.github/`, los `buzon/LEEME*.md`, las cartas y reportes viejos, y las capturas. Tampoco se toca lo que haya en `datos/` de la raíz (la vuelta del 09-10): la medición local vive en `datos/comodoro/`, que es otra carpeta.

**Regla de toda la ronda:** nada de lo que sale de los portales entra al repo. Lo real vive en `datos/comodoro/` (`datos/` ya está en `.gitignore`). Al repo van el código, los tests, los tres archivos de `config/comodoro/`, los documentos y los reportes. En los reportes van números y títulos de hechos, como siempre; nunca bajadas ni cuerpos.

## Qué decidió Alejo y qué es valor por defecto

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Sumar al lector la lectura de sitemaps de noticias (título, link y fecha, sin bajada) | Alejo (14-10, 23:51) | paso 1 |
| Un día de medición local desde el entorno de Claude Code con los 3 feeds de Comodoro más los sitemaps de El Patagónico y El Chubut | Alejo (14-10, 23:51; adelantado el 15-10, 00:15) | pasos 5, 6 y 7 |
| Crónica entra con sus secciones menos «energía»: actualidad, policiales, deportes y economía | Alejo (14-10) | paso 5 |
| La página dice cuando una noticia no trae bajada | Alejo (14-10, 23:51) | paso 3 |
| En este bloque alcanzan **2 medios** para confirmar, y no hay «1 de 2» a mano (`aMano` apagado) | Cowork (valor por defecto) | `config/comodoro/reglas.json` |
| El bloque local vive en `config/comodoro/` y se usa con `--config`; nada de `config/` de siempre cambia | Cowork (valor por defecto) | pasos 4 y 5 |
| El Chubut (Trelew) cuenta como un medio más del par, porque Alejo lo pidió; para separar después «2 de Comodoro» de «1 de Comodoro + El Chubut», cada confirmada lleva sus `medios` | Cowork (valor por defecto) | paso 4 |
| La sección de una nota de sitemap sale de la primera keyword (`news:keywords`); nunca de la dirección | Cowork (valor por defecto) | paso 1 |
| El `user-agent` del lector no cambia aunque un sitemap conteste 403: se anota y lo decide Cowork | Cowork (valor por defecto) | paso 6 |
| Lo medido no se commitea (ni `vueltas.jsonl` ni `notas.json`): el reporte de la Fase B es el registro | Cowork (valor por defecto) | paso 7 |

## Paso 1 · El lector lee sitemaps de noticias

Un feed de `feeds.json` puede traer `"formato": "sitemap"`. **Sin ese campo, o con `"rss"`, todo sigue exactamente como hoy** (RSS, Atom y RDF se leen igual que ahora). Con `"sitemap"`, `parsearFeed(xml, feed, { ahora })` cambia solo de dónde saca cada campo:

| Campo | RSS / Atom (hoy, no cambia) | Sitemap de noticias (nuevo) |
|---|---|---|
| bloques | `<item>…</item>` o `<entry>…</entry>` | `<url>…</url>` (la expresión es `/<url[\s>][\s\S]*?<\/url>/gi`: `<url` seguido de espacio o de `>`, así `<urlset>` no cuenta como bloque) |
| `titulo` | `<title>` | `<news:title>`, con `limpiarHtml` |
| `url` | `<link>`, `href` o `<guid>` | `<loc>`, con `urlLimpia` |
| `fecha` | `pubDate`, `dc:date`, `published`, `updated` | `<news:publication_date>`; si no está, `<lastmod>` |
| `bajada` | `<description>` o `<summary>` | siempre `''` |
| `seccion` | primer tramo de la dirección, o la primera categoría | la **primera** keyword de `<news:keywords>` (separadas por coma, recortada, en minúsculas); si no hay keywords, `''`. **Nunca sale de la dirección:** El Patagónico pone el título entero como único tramo (`/futsal-comodoro-ya-luce-…-n6333909`) y eso no es una sección |
| `etiqueta` | las categorías con ` / ` | las keywords con ` / ` (así `etiquetasExcluidas` del criterio 1 sigue andando) |
| `firma` | `dc:creator` o `author` | siempre `''` |
| `id`, `portal`, `feed`, descartes (`sin_titulo`, `sin_url`, `sin_fecha`, `fecha_futura`, `ruta_excluida`, `url_repetida`) | igual | igual |
| `items` | cantidad de `<item>` o `<entry>` | cantidad de `<url>` |

`contenido(bloque, 'news:title')` y `contenido(bloque, 'news:publication_date')` ya andan tal cual: la función escapa el nombre y los dos puntos no molestan. `leerFeeds` no cambia: un sitemap que no trae ningún `<url>` (por ejemplo un `<sitemapindex>`) queda `vacio`, como hoy un feed sin notas. No hace falta leer `<image:image>` ni `<news:publication>`.

### 1a · Ejemplos (entrada → salida)

**E1 (como El Chubut).** Un `<urlset>` con `xmlns:news` y dos `<url>`; el primero trae `<loc>https://www.elchubut.com.ar/regionales/el-centro-astronomico-de-trelew-ya-lleva-el-nombre-de-gustavo_123</loc>`, `<lastmod>2026-10-15T03:00:00Z</lastmod>`, `<news:publication_date>2026-10-14T23:35:00Z</news:publication_date>`, `<news:title>El Centro Astronómico de Trelew ya lleva el nombre de Gustavo</news:title>`, `<news:keywords>Regionales</news:keywords>` y un `<image:image>`; el feed es `{ nombre: 'El Chubut', dominio: 'elchubut.com.ar', formato: 'sitemap' }` → dos notas; la primera: `titulo` «El Centro Astronómico de Trelew ya lleva el nombre de Gustavo», `url` esa, `fecha` `2026-10-14T23:35:00.000Z` (la de `news:publication_date`, no la de `lastmod`), `bajada` `''`, `seccion` `'regionales'`, `etiqueta` `'Regionales'`, `firma` `''`, `portal` `'elchubut.com.ar'`, `feed` `'El Chubut'`; `items` 2.

**E2 (como El Patagónico).** Un `<url>` con `<loc>https://www.elpatagonico.com/futsal-comodoro-ya-luce-su-nueva-indumentaria-el-argentino-c17-n6333909</loc>`, `<news:publication_date>2026-10-15T00:00:00Z</news:publication_date>` y `<news:title>Futsal: Comodoro ya luce su nueva indumentaria para el Argentino C17</news:title>`, sin `lastmod`, sin keywords, sin imagen → una nota con `seccion` `''` (no `'futsal-comodoro-ya-luce-…'`), `etiqueta` `''`, `bajada` `''`, `fecha` `2026-10-15T00:00:00.000Z`.

**E3.** Un `<url>` con `<loc>` y fecha pero sin `<news:title>` → descartada con motivo `sin_titulo`; uno con `<news:title>` y fecha pero sin `<loc>` → `sin_url`; uno con `news:publication_date` 2 días adelante de `ahora` → `fecha_futura`.

**E4.** El mismo RSS de elDiarioAR del test de hoy, con el feed sin `formato` → exactamente lo mismo que hoy (el test que ya existe lo cubre; no lo toques).

### 1b · Tests en `test/lector.test.js`

Tres tests nuevos: E1, E2 y E3 (los tres `sin_*` de E3 en un solo test). Más uno al final, junto a los dos de `config/feeds.json`: en `config/comodoro/feeds.json`, todo feed que tenga `formato` lo tiene en `'sitemap'`, y los que lo tienen son exactamente El Patagónico y El Chubut.

## Paso 2 · El probador de feeds reconoce sitemaps

En `scripts/probar-feeds.js`:

- `analizarCuerpo`: si el comienzo trae `<urlset` (con o sin espacio después), `formato` es `'sitemap'`. Para ese formato, `items` cuenta los bloques `<url` seguido de espacio o `>` (no `<urlset`), y las fechas se buscan también en `<news:publication_date>` y `<lastmod>`.
- `dominiosDeLinks`: para los bloques `<url>…</url>`, el link sale de `<loc>`.
- `probar`: `'sitemap'` es un formato válido (hoy solo valen `rss`, `atom` y `rdf`); con eso un sitemap al día da `OK`.
- `main`: la lista de portales para avisar «links a dominios fuera de portales.json» es `portales.json` **de la misma carpeta que el archivo que se está probando** si existe (`config/comodoro/portales.json` cuando se prueba `config/comodoro/feeds.json`); si no existe, `config/portales.json` como hoy.

**E5.** `analizarCuerpo` con el `<urlset>` de E1 → `{ formato: 'sitemap', items: 2, masNueva: Date.parse('2026-10-14T23:35:00Z') o la más nueva de las dos, dominios: { 'elchubut.com.ar': 2 } }`.

**E6.** `node scripts/probar-feeds.js config/comodoro/feeds.json` → una línea `OK ` por cada uno de los 8 feeds, `8 de 8 andan.` y ninguna línea «links a dominios fuera de portales.json».

Un test nuevo en `test/probar-feeds.test.js` para E5.

## Paso 3 · La bajada sale de la primera nota que la tenga; la página dice cuando no hay

### 3a · `src/nucleo.js`

En `clasificarHecho`, la ficha hoy toma `bajada: base.bajada || ''` con `base = g.notas[0]`. Pasa a ser **la bajada de la primera nota del grupo que tenga una** (en el orden de `g.notas`); si ninguna trae, `''`. El `titulo` sigue saliendo de `base` como hoy; no cambia nada más. Así, cuando una noticia la traen El Patagónico (sin bajada) y ADNSUR (con bajada), la tarjeta muestra la de ADNSUR.

**E7.** Un hecho con dos notas en este orden: una de `elpatagonico.com` con `bajada` `''` y una de `adnsur.com.ar` con `bajada` «El intendente anunció…» → `ficha.bajada` es «El intendente anunció…» y `ficha.titulo` sigue siendo el de la nota de El Patagónico. Un test nuevo en `test/nucleo.test.js`.

### 3b · `pagina/index.html`

En `noticia(t, …)` y en `cuatroDeCinco(t)`, donde hoy se dibuja el `<p class="bajada">` solo si `t.bajada`, cuando `t.bajada` está vacía se dibuja en su lugar `h('p', { clase: 'bajada sin', texto: 'Sin bajada: este medio no la publica en su listado.' })`. En el CSS, una regla nueva debajo de `.bajada`: `.bajada.sin { font-style: italic; }`. **Lo que se copia no cambia:** `textoParaCopiar` en `pagina/logica.js` ya saltea la bajada vacía y no se toca.

### 3c · Comprobaciones en `scripts/probar-pagina.js`

En un contexto nuevo y con `p.route('**/lista.json', …)` como las demás, serví la lista del día de ejemplo con la **primera noticia de `bloques.nacional.noticias`** con `bajada: ''` (lo demás igual). Dos comprobaciones nuevas:

1. En esa primera noticia hay un `.bajada.sin` con el texto exacto «Sin bajada: este medio no la publica en su listado.».
2. Tildada esa noticia sola y apretado «Copiar», lo que queda en el portapapeles no contiene «Sin bajada».

Las 68 de hoy quedan como están.

## Paso 4 · `npm run vuelta -- --config <carpeta>` y `medios` en `vueltas.jsonl`

### 4a · La opción `--config`

`node scripts/vuelta.js [--carpeta datos] [--cada 30] [--sin-leer] [--config <carpeta>]`. Sin `--config`, todo como hoy (`config/`). Con `--config <carpeta>`, una función nueva y exportada, `cargarConfig(carpeta)` → `{ feeds, portales, reglas, firmas }`, que lee de esa carpeta:

- `feeds.json` (**obligatorio**): se usa su lista `feeds`, con el mismo formato que `config/feeds.json`.
- `portales.json` (**obligatorio**): se usa su lista `portales`.
- `reglas.json` (opcional): sus claves de primer nivel **pisan** las de `config/reglas.json`, una por una (`{ ...reglasDeConfig, ...lasDeLaCarpeta }`); lo que no está, queda como en `config/reglas.json`. Una clave que es un objeto (`aMano`, `viaB`, `ia`, `criterio1`, `provisorio`) se reemplaza entera, no se mezcla por adentro. Si el archivo no existe, se usa `config/reglas.json` tal cual. La clave `_aviso` también se copia; nadie la lee.
- `firmas.json` (opcional): su lista `firmas`; si no existe, `[]`.

Si la carpeta no existe, o falta `feeds.json` o `portales.json`, corta con `ErrorDeUso` «--config necesita una carpeta con feeds.json y portales.json: <carpeta>/<archivo> no está.» y código 1, sin escribir nada. `--config` sin valor corta como las demás opciones. Las dos ramas de `main` (una vuelta y `--cada`) pasan a `vuelta()` lo que devuelve `cargarConfig` (o nada, si no hay `--config`): `vuelta()` ya recibe `feeds`, `portales`, `reglas` y `firmas` por parámetro, no cambia su firma. `filtrarRutas` ya usa los `feeds` que recibe `vuelta()`. El candado, `notas.json`, `pagina/` y `vueltas.jsonl` siguen viviendo en `--carpeta`.

### 4b · `medios` en cada confirmada y cada 4/5 de la línea de `vueltas.jsonl`

En `armarLinea`, cada elemento de `confirmados` y de `cuatroDeCinco` suma un campo `medios`: la lista de **grupos distintos** de las notas del hecho, en el orden en que aparecen las notas (`c.notas`, que ya trae `portal` como dominio): para cada nota, `buscarPortal(dominioDe(n), portales)` y su `grupo`; si el portal no está en la lista, el dominio. Sin repetir. `scripts/medir.js` no cambia (ignora el campo).

### 4c · Ejemplos (entrada → salida)

**E8.** `cargarConfig` con una carpeta temporal que tiene `feeds.json` (2 feeds), `portales.json` (2 portales) y `reglas.json` con `{ "minGrupos": 2, "aMano": { "activa": false } }` → `feeds` son esos 2, `portales` esos 2, `reglas.minGrupos` es 2, `reglas.aMano` es `{ activa: false }`, `reglas.umbralSimilitud` es `0.3` (el de `config/reglas.json`), `firmas` es `[]`.

**E9.** `cargarConfig` con una carpeta que tiene `portales.json` pero no `feeds.json` → `ErrorDeUso` con «feeds.json no está».

**E10.** `vuelta({ carpeta, feeds, portales, reglas, firmas: [], fetch })` con lo de E8, donde los dos feeds (portales `a.com` y `b.com`, grupos `A` y `B`) traen el mismo título «El intendente inauguró la planta de agua en Comodoro» con bajada → la línea de `vueltas.jsonl` tiene `confirmados` con 1 elemento, `grupos` 2, `medios` `['A', 'B']`, y `cuatroDeCinco` vacío (sin `aMano`); en pantalla «Confirmados: 1 nacionales + 0 internacionales».

**E11.** `leerOpciones(['--config', 'config/comodoro'])` → `config: 'config/comodoro'`; `leerOpciones(['--config'])` → `ErrorDeUso`; sin `--config` → `config: null`.

Cuatro tests nuevos en `test/vuelta.test.js` (E8, E9, E10, E11); el test de opciones que ya existe puede crecer en vez de uno nuevo.

## Paso 5 · El bloque local de prueba: `config/comodoro/`

Tres archivos nuevos, con este contenido (podés cambiar solo el texto de `_aviso` y de `nota`; las direcciones, dominios, grupos y valores van tal cual).

`config/comodoro/feeds.json`:

~~~~
{
  "_aviso": "Bloque local de prueba (Comodoro Rivadavia y Chubut). Feeds y sitemaps probados el 14-10-2026 (buzon/ClaudeCode_para_Cowork_2026-10-14_a.md). Se usa con: node scripts/vuelta.js --config config/comodoro --carpeta datos/comodoro. Nada de acá entra a config/feeds.json ni a la lista blanca: lo decide Alejo.",
  "verificado": "2026-10-14",
  "feeds": [
    { "nombre": "ADNSUR",               "dominio": "adnsur.com.ar",        "grupo": "ADNSUR",         "ambito": "nacional", "url": "https://www.adnsur.com.ar/rss.xml", "nota": "Comodoro. Sin autor: no sirve para la vía B." },
    { "nombre": "El Comodorense",       "dominio": "elcomodorense.net",    "grupo": "El Comodorense", "ambito": "nacional", "url": "https://www.elcomodorense.net/feed/", "nota": "Comodoro. Trae autor." },
    { "nombre": "Crónica · actualidad", "dominio": "diariocronica.com.ar", "grupo": "Crónica",        "ambito": "nacional", "url": "https://www.diariocronica.com.ar/rss/actualidad", "nota": "Comodoro. Un feed por sección; sin autor. Trae notas de hasta un año: lo viejo lo saca acumular." },
    { "nombre": "Crónica · policiales", "dominio": "diariocronica.com.ar", "grupo": "Crónica",        "ambito": "nacional", "url": "https://www.diariocronica.com.ar/rss/policiales" },
    { "nombre": "Crónica · deportes",   "dominio": "diariocronica.com.ar", "grupo": "Crónica",        "ambito": "nacional", "url": "https://www.diariocronica.com.ar/rss/deportes" },
    { "nombre": "Crónica · economía",   "dominio": "diariocronica.com.ar", "grupo": "Crónica",        "ambito": "nacional", "url": "https://www.diariocronica.com.ar/rss/economia", "nota": "«energía» queda afuera (decidió Alejo el 14-10)." },
    { "nombre": "El Patagónico",        "dominio": "elpatagonico.com",     "grupo": "El Patagónico",  "ambito": "nacional", "formato": "sitemap", "url": "https://www.elpatagonico.com/sitemap-news.xml", "nota": "Comodoro. Sin feed: sitemap de noticias, sin bajada, sin sección ni autor." },
    { "nombre": "El Chubut",            "dominio": "elchubut.com.ar",      "grupo": "El Chubut",      "ambito": "nacional", "formato": "sitemap", "url": "https://www.elchubut.com.ar/sitemap-news.xml", "nota": "Trelew (provincial). Sin feed: sitemap de noticias, sin bajada ni autor; la sección sale de sus keywords." }
  ]
}
~~~~

`config/comodoro/portales.json`:

~~~~
{
  "_aviso": "Portales del bloque local de prueba (Comodoro Rivadavia y Chubut), para la medición local con --config config/comodoro. No es la lista blanca: esa la decide Alejo.",
  "portales": [
    { "dominio": "adnsur.com.ar",        "grupo": "ADNSUR",         "ambito": "nacional", "tipo": "medio", "ciudad": "Comodoro Rivadavia" },
    { "dominio": "elcomodorense.net",    "grupo": "El Comodorense", "ambito": "nacional", "tipo": "medio", "ciudad": "Comodoro Rivadavia" },
    { "dominio": "diariocronica.com.ar", "nombre": "Crónica", "grupo": "Crónica", "ambito": "nacional", "tipo": "medio", "ciudad": "Comodoro Rivadavia" },
    { "dominio": "elpatagonico.com",     "grupo": "El Patagónico",  "ambito": "nacional", "tipo": "medio", "ciudad": "Comodoro Rivadavia" },
    { "dominio": "elchubut.com.ar",      "grupo": "El Chubut",      "ambito": "nacional", "tipo": "medio", "ciudad": "Trelew" }
  ]
}
~~~~

`config/comodoro/reglas.json` (solo lo que cambia; el resto se toma de `config/reglas.json` por el paso 4):

~~~~
{
  "_aviso": "Solo lo que cambia respecto de config/reglas.json para el bloque local de prueba: 2 medios para confirmar y sin excepción a mano (una 1/2 no se ofrece). Todo lo demás (ventanas, agrupador, criterio 1, provisorio) se toma de config/reglas.json.",
  "minGrupos": 2,
  "aMano": { "activa": false }
}
~~~~

`ambito` queda `nacional` en los cinco porque el bloque provisorio solo distingue nacional de internacional: en esta medición todo cae en «nacionales», y así `npm run medir` muestra los números en la columna de la izquierda. `ciudad` es un dato para después; hoy nada lo lee.

## Paso 6 · Fase A: arrancar la medición local y reportar

Todo esto corre en tu entorno. Si la red va por proxy, anteponé `NODE_USE_ENV_PROXY=1` a cada comando que sale a internet, como con `npm run leer`.

1. `node scripts/probar-feeds.js config/comodoro/feeds.json` → E6. Pegá la salida tal cual en el reporte. Si un sitemap contesta `HTTP 403` o `NO ES FEED (html)`, anotalo en el reporte, **no cambies el `user-agent`** (lo decide Cowork) y seguí con los demás.
2. Una vuelta a mano: `node scripts/vuelta.js --config config/comodoro --carpeta datos/comodoro` → `Feeds: 8 OK · 0 caídos` (o los caídos del punto 1), `Código de salida: 0`. Pegá el resumen de pantalla en el reporte y mirá la primera línea de `datos/comodoro/vueltas.jsonl`: cada elemento de `confirmados` trae `medios`.
3. Dejala corriendo en segundo plano, con la salida en un archivo: `nohup node scripts/vuelta.js --config config/comodoro --carpeta datos/comodoro --cada 30 >> datos/comodoro/vuelta.log 2>&1 &`. Anotá la hora de arranque con `TZ=America/Argentina/Buenos_Aires date` y pegala en el reporte: **es la hora desde la que Alejo cuenta las 24 horas**.
4. Esperá a que `datos/comodoro/vueltas.jsonl` tenga **3 líneas** (la del punto 2 y dos del proceso: unos 31 minutos; `sleep` con tiempo de sobra) y comprobá que el proceso sigue vivo: `pgrep -f "scripts/vuelta.js --config config/comodoro"` da un número. Si murió, mirá `datos/comodoro/vuelta.log`, arreglá lo que sea tuyo y volvé a lanzarlo; si no es tuyo, reportalo y pará.
5. El reporte `buzon/ClaudeCode_para_Cowork_2026-10-15_a.md`, con: la salida del punto 1, el resumen del punto 2, la hora de arranque, el PID, y de la **última** línea de `vueltas.jsonl`: `notas.acumuladas`, `hechos.porGrupos`, y cada confirmada con grupos, medios y título. Más las comprobaciones C1 a C8 de abajo.
6. Documentos (paso 8), `npm run paquete`, commit y push. **No cortes el proceso al cerrar la tanda** y no corras nada más que escriba en `datos/comodoro/`.

## Paso 7 · Fase B: cerrar la medición y reportar (24 horas después)

Alejo te lo pide con una línea en una tanda nueva. Entonces:

1. `git pull`. `pgrep -f "scripts/vuelta.js --config config/comodoro"`: si sigue vivo, cortalo con `pkill -f "scripts/vuelta.js --config config/comodoro"`. Si ya no estaba, no lo relances: decí en el reporte a qué hora es la última línea de `vueltas.jsonl` y hasta ahí llegó la medición.
2. `node scripts/medir.js --carpeta datos/comodoro` → pegá la salida tal cual en el reporte.
3. **Tabla A, los hechos que llegaron a 2 medios en el día:** de todas las líneas de `vueltas.jsonl`, los `confirmados` distintos por `id`; por cada uno, la hora (de Argentina) de la **primera** línea en que apareció, los `grupos` y `medios` de la **última** línea en que apareció, y el título. Ordenados por esa primera hora. Debajo: cuántos son en total, cuántos tienen 2 medios de Comodoro (sin El Chubut) y cuántos tienen a El Chubut como uno de los dos.
4. **Tabla B, de qué notas se arma cada uno:** con un script descartable en tu carpeta de trabajo (no en el repo) que cargue `datos/comodoro/notas.json`, lo pase por `filtrarRutas` con los feeds de `cargarConfig('config/comodoro')`, y corra `preparar` del núcleo con esos portales y reglas y `ahora` igual a la hora de la última vuelta: por cada candidato, su título y, debajo, una línea por nota con `portal` y `titulo`. Agregá una columna «misma noticia a ojo»: `sí` si todas las notas cuentan lo mismo, `no` si hay una que es otra cosa, `dudoso` si no estás seguro. Los hechos de la Tabla A que ya no aparezcan (se cayeron por las 24 h) van con la nota «ya no está en lo acumulado».
5. **Números del día**, desde `datos/comodoro/notas.json` (las notas con `fecha` dentro de las 24 horas desde la hora de arranque): cuántas notas por `portal`; cuántas sin bajada por portal (tienen que ser todas las de los dos sitemaps y ninguna de los feeds, si no, decilo); para El Patagónico, cuántas horas de publicación distintas aparecen (si todas son `00:00:00Z`, decilo: significa que su sitemap da el día pero no la hora).
6. Lo que vino de `npm run medir`: feeds caídos y vueltas sin ningún feed, tal cual.
7. El reporte, con las comprobaciones D1 a D4; documentos (paso 8), `npm run paquete`, commit y push.

## Paso 8 · Documentos

**En la Fase A:**

- **`README.md`:** en la lista de comandos, debajo de las opciones de `npm run vuelta`, una línea `--config <carpeta>  corre con los feeds.json, portales.json y reglas.json de esa carpeta (config/comodoro: el bloque local de prueba)`; y en la línea de `config/feeds.json` (o donde se describe el lector), una frase: «Un feed con `"formato": "sitemap"` se lee de su sitemap de noticias: título, link, fecha y keywords, sin bajada ni autor.»
- **`CLAUDE.md`, «Estado»:** un renglón nuevo después del de «Links por medio y la medición en la compu de Alejo (2026-10-09)»: «**Sitemaps y el bloque local de prueba (2026-10-15):** el lector lee también sitemaps de noticias (`"formato": "sitemap"` en `feeds.json`: título, link, fecha y keywords; sin bajada ni autor); la bajada de un hecho sale de la primera nota que la tenga y la página dice «Sin bajada» cuando ninguna la trae; `npm run vuelta -- --config <carpeta>` corre con otra lista de feeds, portales y reglas (`config/comodoro/`: ADNSUR, El Comodorense, Crónica por secciones, El Patagónico y El Chubut; 2 medios para confirmar, sin 1/2 a mano), y cada confirmada de `vueltas.jsonl` lleva sus `medios`. La medición local de un día corre en el entorno de Claude Code en `datos/comodoro/` (no se sube). Nada entró a la lista blanca.»
- **`buzon/pendientes.md`:**
  - En la sección de las 23:30, «Qué viene después», al final del punto 4, una oración: «**Adelantado el 15-10 (decidió Alejo a las 00:15):** carta `Cowork_para_ClaudeCode_2026-10-15_a.md`, Fase A hecha; la Fase B se pide 24 h después del arranque.»
  - En «Cowork (diseño y decisiones; antes DISEÑADOR)», el ítem «Feeds de portales locales, probados el 14-10»: marcalo `[x]` y agregale al final «**Hecho el 15-10:** el lector lee sitemaps y el bloque local de prueba está en `config/comodoro/` (carta 2026-10-15_a).»
  - En «Cowork → Claude Code»: «- Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_a.md`: cerrar la medición local 24 h después del arranque (arrancó el 15-10 a las HH:MM) y reportar.»
  - En «Hecho», primer renglón: «- [x] 15-10-2026 · **Sitemaps en el lector y `--config` en la vuelta** (decidió Alejo adelantarlo el 15-10): El Patagónico y El Chubut se leen por su sitemap de noticias (sin bajada; la página lo dice); `config/comodoro/` es el bloque local de prueba (5 portales, 2 medios para confirmar); la medición local corre en el entorno de Claude Code.»

**En la Fase B:**

- **`CLAUDE.md`:** al renglón de arriba, agregale al final: «**Medido el <fecha>** (<N> vueltas, de HH:MM a HH:MM): <cuántos> hechos llegaron a 2 medios en el día, <cuántos> con 2 medios de Comodoro y <cuántos> con El Chubut; detalle en el reporte `<nombre>`.»
- **`buzon/pendientes.md`:** en «Cowork → Claude Code», volvé a «Nada pendiente por ahora. Lo que sigue: la carta de la capa 4, cuando Alejo mande su medición.»; en el ítem de «Hecho» del 15-10, agregá los mismos números del renglón de `CLAUDE.md`; y en «Abierto» de la sección de las 20:15, en el ítem «Los números por anillo (2 local, 3 Chubut, …) hay que medirlos con feeds reales antes de fijarlos», agregá «**Medido el <fecha>:** ver el reporte `<nombre>`.»

## Cuándo está listo (comprobalo y ponelo en el reporte)

Fase A:

| # | Comprobación | Tiene que dar |
|---|---|---|
| C1 | `npm test` antes y después | antes 239 bien y 1 pendiente; después todos bien, al menos 9 más que antes, y sigue 1 pendiente |
| C2 | `npm run probar-pagina` (con `npm i --no-save playwright`) | 0 MAL y al menos 70 comprobaciones |
| C3 | `node scripts/probar-feeds.js config/comodoro/feeds.json` | E6: 8 OK y ninguna línea «links a dominios fuera»; si hay alguna, corregí el `dominio` de ese feed en los dos archivos de `config/comodoro/` y decilo |
| C4 | `node scripts/vuelta.js --config /tmp/no-existe --carpeta /tmp/x` | el mensaje de 4a y código 1; `/tmp/x` no se crea |
| C5 | La vuelta del punto 2 del paso 6 | `Feeds: 8 OK · 0 caídos` (o los caídos del punto 1), código 0, y `medios` en cada confirmada de la primera línea de `datos/comodoro/vueltas.jsonl` |
| C6 | `git ls-files datos` | nada: lo real no entra al repo |
| C7 | Con el reporte ya escrito y antes de `npm run paquete`: `git add -A` y `git diff --cached --stat 47dafc6` | solo estos archivos: `src/lector.js`, `test/lector.test.js`, `scripts/probar-feeds.js`, `test/probar-feeds.test.js`, `src/nucleo.js`, `test/nucleo.test.js`, `pagina/index.html`, `scripts/probar-pagina.js`, `scripts/vuelta.js`, `test/vuelta.test.js`, `config/comodoro/feeds.json`, `config/comodoro/portales.json`, `config/comodoro/reglas.json`, `README.md`, `CLAUDE.md`, `buzon/pendientes.md`, esta carta y tu reporte (los números de líneas no importan) |
| C8 | La hora del encabezado de tu reporte | la que da `TZ=America/Argentina/Buenos_Aires date` justo antes de escribirlo; pegá esa salida en esta fila |

Fase B:

| # | Comprobación | Tiene que dar |
|---|---|---|
| D1 | `pgrep -f "scripts/vuelta.js --config config/comodoro"` después de cortarlo | nada |
| D2 | `wc -l datos/comodoro/vueltas.jsonl` | al menos 40 líneas si corrió las 24 horas; si son menos, el reporte dice hasta qué hora llegó |
| D3 | `git ls-files datos` | nada |
| D4 | `git diff --cached --stat <el commit de cierre de la Fase A>` | solo `CLAUDE.md`, `buzon/pendientes.md`, tu reporte y `buzon/paquetes/PEGAR_COWORK.md` |

## Qué NO se hace en esta ronda

- Sumar nada a `config/feeds.json`, `config/portales.json` ni `config/reglas.json`: el bloque local es de prueba y la lista blanca la decide Alejo.
- Cambiar el `user-agent` del lector, probar portales que no estén en esta carta (Jornada, La Opinión Austral, Rawson Digital, los de Neuquén, Río Negro, Santa Cruz o Tierra del Fuego), ni sumar moldes de notas de servicio locales: eso viene después, con los números de la Fase B.
- Tocar el bloque provisorio, la IA, n8n ni ningún servidor.
- Tocar `datos/` de la raíz ni la medición de Alejo: su compu sigue con el código que ya tiene y no hace `git pull`.
- Commitear `notas.json`, `vueltas.jsonl`, `vuelta.log`, listas reales ni bajadas.
- Cortar el proceso de la Fase A antes de que Alejo pida la Fase B.

## Pasos, en orden

Fase A:

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1 (lector y sus tests). `npm test`. Commit.
3. Paso 2 (probador y su test). Commit.
4. Paso 3 (núcleo, página y las 2 comprobaciones), `npm run probar-pagina`, C2. Commit.
5. Paso 4 (vuelta y sus tests), `npm test`, C1, C4. Commit.
6. Paso 5 (los tres archivos de `config/comodoro/`), C3. Commit.
7. Paso 6, puntos 1 a 4 (la medición arranca), C5, C6.
8. Paso 6, punto 5 (el reporte, con C1 a C8) y paso 8 (documentos de la Fase A), C7, `npm run paquete`, commit y push.
9. Tu mensaje final en el chat, como dice «El molde» de `buzon/LEEME_COWORK.md`, con dos apartados: primero uno para Alejo mismo (A QUIÉN: vos mismo; QUÉ LE PASÁS: nada; QUÉ ESPERÁS: que pasen 24 h desde la hora de arranque que dice el reporte; SE APLICA: cuando el reporte esté pusheado; A EJECUTAR: Alejo, con esperar), y después uno para Claude Code mismo con la línea que Alejo va a pegar en la próxima tanda, tal cual: «Leé buzon/LEEME_CLAUDECODE.md y la Fase B de buzon/Cowork_para_ClaudeCode_2026-10-15_a.md, y hacela.» (QUÉ ESPERÁS: el reporte de la Fase B; SE APLICA: 24 h después de la hora de arranque, con /clear antes). Al final, «SIGUE TRABADO» con: la carta de la capa 4, que espera la medición de Alejo del 16/10 y lo abierto de Don Julio.

Fase B:

1. `git pull`. Paso 7, puntos 1 a 6.
2. El reporte con D1 a D4, documentos de la Fase B (paso 8), `npm run paquete`, commit y push.
3. Tu mensaje final en el chat, como dice «El molde», con un apartado para Cowork: la línea de arranque de `buzon/LEEME.md` (QUÉ ESPERÁS: la lectura del reporte y la carta de los bloques por zona con datos; SE APLICA: cuando Alejo también tenga lista su medición del 16/10, para mandar las dos juntas). «SIGUE TRABADO» con lo mismo que en la Fase A, si sigue así.
