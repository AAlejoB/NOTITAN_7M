# Cowork → Claude Code · 16-10-2026 · 18:07 (hora de Argentina) · letra c

No responde a un reporte: es la carta del **bloque «Avisos» de cortes** (agua, luz y gas), decidido por Alejo el 16-10 (opción B: un bloque aparte, leído de quien corta, no una noticia verificada; arrancar con lo legible). Va **después** de la carta `b` (la zona en la capa 4): esta carta se hace en dos fases y la segunda toca la capa 4. Base: el commit en que quede tu reporte `b` (`git pull` antes de empezar).

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-16_c.md`. Dos fases, dos reportes:

- **Fase A (ahora):** las fuentes, la lectura, el bloque en la página y en `npm run vuelta -- --zona config/zona`, la medición. Reporte `buzon/ClaudeCode_para_Cowork_2026-10-16_c.md`.
- **Fase B (Alejo te la pide con una línea, después de aprobar la A):** los avisos en la capa 4 (`src/capa4.js` y `n8n/vuelta.json`). Reporte con la letra que toque ese día.

**Qué pasó:** Alejo dijo por dónde se entera de un corte y Cowork miró esas fuentes el 16-10. La cooperativa de luz y agua de Comodoro (SCPL) tiene una página de **comunicados** (`scpl.coop/index.php/site/ver-seccion?id=2`: unos 300, con título, fecha y link a `ver-nota?id=N`) y en los cortes **programados** el texto de la nota trae **barrios, día y horario** («Mañana, jueves 08 de octubre… desde las 15:00hs. y por un lapso de 24hs.… en los siguientes barrios: Laprida, Güemes, Sarmiento…»; en las averías, los barrios a veces van en una imagen). Los portales locales que 7M ya lee escriben lo mismo en texto (El Patagónico tiene la etiqueta «corte de luz» con «entre las 8 y las 14»; ADNSUR y El Comodorense, los barrios). Un sitio local, `comodorohoy.ar/agua`, ya arma una página de estado a partir de los comunicados de la SCPL: por zona (Norte, Sur, Central), con barrios, causa, hora estimada de fin y si es programado o avería; cuenta **110 cortes de agua en 15 meses** (unos 7 por mes). Y la SCPL publica cada verano un **cronograma fijo de cortes de agua** por zona y día de la semana. Facebook e Instagram de la SCPL no se pueden leer desde el programa (piden login, bloquean lectores automáticos, sin feed): quedan afuera. **Al final de esto la página muestra, arriba de todo, un bloque «Avisos»** con los cortes de agua, luz y gas de Comodoro y Rada Tilly, cada uno con servicio, programado o avería, día, horario, barrios o zona, y el link a la fuente.

| Paso | Qué cambia | Archivos que se tocan |
|---|---|---|
| 1 | Las fuentes de avisos y el cronograma de verano, en config | `config/zona/avisos.json` (nuevo), `config/zona/cronograma-agua.json` (nuevo) |
| 2 | Leer los comunicados de la SCPL (listado y nota) | `src/avisos.js` (nuevo), `test/avisos.test.js` (nuevo) |
| 3 | Reconocer un aviso en las notas de los portales de zona y sacar día, horario, barrios | `src/avisos.js`, `config/reglas.json` (un molde) |
| 4 | Juntar comunicado y notas del mismo corte en un aviso; la lista de avisos | `src/avisos.js`, `src/entrega.js`, `test/entrega.test.js` |
| 5 | La vuelta lee la SCPL y arma el bloque | `scripts/vuelta.js`, `test/vuelta.test.js` |
| 6 | La página dibuja el bloque Avisos | `pagina/index.html`, `pagina/logica.js`, `test/logica.test.js`, `scripts/probar-pagina.js` |
| 7 | `medir` cuenta avisos | `scripts/medir.js`, `test/medir.test.js` |
| 8 | Documentos | `README.md`, `CLAUDE.md`, `docs/CORRER_EN_MI_COMPU.md`, `docs/PAQUETE_DE_CLIENTE.md`, `buzon/pendientes.md`, reporte, paquete |
| B | Fase B: lo mismo en la capa 4 | `src/capa4.js`, `n8n/vuelta.json`, `n8n/LEEME.md`, `test/capa4.test.js`, `test/n8n.test.js`, `docs/INSTALAR_EN_EL_SERVIDOR.md` |

**No se tocan en la Fase A:** `src/nucleo.js`, `src/zona.js`, `src/provisorio.js`, `src/ia.js`, `src/lector.js` (la SCPL no es RSS ni sitemap: su lectura vive en `src/avisos.js`), `src/capa4.js`, `n8n/`, `scripts/servir.js`, `scripts/usuario.js`, `config/feeds.json`, `config/portales.json`, `config/firmas.json`, `config/zona/feeds.json`, `config/zona/portales.json`, `config/zona/reglas.json`, `.gitignore`, `.github/`, los `buzon/LEEME*.md`, las cartas y reportes viejos, las capturas.

**Regla de toda la ronda:** nada de lo que sale de la SCPL ni de los portales entra al repo (lo leído vive en `datos/zona/avisos.json`, que no se sube). En el reporte van títulos, fechas, horarios y nombres de barrios tal como los publica la SCPL (son avisos públicos, para eso existen), nunca cuerpos enteros.

## Qué decidió Alejo y qué es valor por defecto

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Un bloque «Avisos» aparte, leído de quien corta (la SCPL como fuente primaria); los portales como respaldo; nunca como noticia verificada por N medios | Alejo (16-10, 04:57 y 16:53) | pasos 1 a 6 |
| Arrancar con lo legible; lo que tenga barrio y horario en texto se muestra; lo que no, con título y link | Alejo (16-10, 16:53) | pasos 2 y 3 |
| Lo que le importa a la persona: «hoy cortan la luz en zona norte», «la semana que viene no va a haber agua de tal a tal hora», avisado con antelación | Alejo (16-10, 16:53) | la tarjeta del paso 6 |
| El cronograma de verano de la SCPL (zona, día de la semana, hora) vale como aviso programado mientras esté vigente | Alejo (16-10, 18:06: «es hermoso») | paso 1 y 6 |
| Un aviso se arma con **1 sola fuente** (no hace falta confirmarlo con 2 medios: es replicar un aviso, no verificar una noticia) | Cowork (valor por defecto) | paso 4 |
| Los avisos van **primero** en la página, arriba de Comodoro; un bloque vacío no se dibuja | Cowork (valor por defecto) | paso 6 |
| Un aviso vive hasta 12 h después del fin del corte si se conoce, y si no, 72 h desde que se publicó | Cowork (valor por defecto; `avisos.json`) | paso 4 |
| Caleta Olivia (SPSE, por el feed de Prensa Santa Cruz) y el gas (Camuzzi no publica) quedan para después: esta carta es Comodoro y Rada Tilly | Cowork (valor por defecto; la lista de fuentes es config, se suman sin tocar código) | paso 1 |
| `comodorohoy.ar/agua` es el modelo del formato (zona, programado/avería, inicio, fin estimado, barrios), **no una fuente**: es una página derivada de la SCPL, igual que la nuestra | Cowork (valor por defecto) | paso 6 |
| Facebook e Instagram no se leen | Cowork (valor por defecto) | — |

## Paso 1 · `config/zona/avisos.json` y `config/zona/cronograma-agua.json`

`avisos.json`:

```json
{
  "_aviso": "Fuentes del bloque Avisos (cortes de agua, luz y gas) de la zona. La SCPL es la fuente primaria; los portales de config/zona/feeds.json son respaldo. Facebook e Instagram no se leen.",
  "ventanaSinFinHoras": 72,
  "horasDespuesDelFin": 12,
  "maxNotasPorVuelta": 5,
  "fuentes": [
    { "nombre": "SCPL", "dominio": "scpl.coop", "formato": "scpl",
      "listado": "https://scpl.coop/index.php/site/ver-seccion?id=2",
      "nota": "https://scpl.coop/index.php/site/ver-nota?id={id}",
      "servicios": ["agua", "luz"], "ciudad": "Comodoro Rivadavia",
      "comentario": "www.scpl.coop tiene el certificado roto; sin www anda (reporte a del 16-10)." }
  ],
  "servicios": {
    "agua":  ["agua", "acueducto", "suministro de agua", "red de agua"],
    "luz":   ["luz", "energia", "electric", "red electrica", "tension"],
    "gas":   ["gas"]
  },
  "zonas": ["zona norte", "zona sur", "zona central", "rada tilly"]
}
```

`cronograma-agua.json` (transcripto del cuadro «Cronograma de cortes de agua 2025-2026» que publicó la SCPL; es la temporada pasada: **Alejo lo actualiza cuando la SCPL publique el 2026-2027**, y mientras la vigencia esté vencida no se muestra nada):

```json
{
  "_aviso": "Cronograma estival de cortes de agua de la SCPL. Se muestra como aviso programado solo entre desde y hasta. Fuente: cuadro publicado por la SCPL para 2025-2026. Si las reservas alcanzan, la SCPL puede suspender un corte: la tarjeta lo dice.",
  "fuente": "SCPL",
  "desde": "2025-11-01",
  "hasta": "2026-03-31",
  "duracionHoras": 24,
  "zonas": [
    { "zona": "Zona Norte",         "dias": ["martes", "viernes"],   "desde": "18:00" },
    { "zona": "Zona Sur y Central", "dias": ["miercoles", "sabado"], "desde": "18:00" }
  ],
  "excepciones": [
    { "fecha": "2025-12-23", "zona": "Zona Norte",         "desde": "12:00" },
    { "fecha": "2025-12-30", "zona": "Zona Norte",         "desde": "12:00" },
    { "fecha": "2025-12-25", "zona": "Zona Sur y Central", "desde": "08:00" },
    { "fecha": "2026-01-01", "zona": "Zona Sur y Central", "desde": "08:00" }
  ]
}
```

## Paso 2 · Leer la SCPL (`src/avisos.js`)

Puro salvo donde se dice. Exporta:

**`leerListadoScpl(html)` → `[{ id, titulo, fecha }]`.** Del HTML del listado saca cada comunicado: `id` del link `ver-nota?id=N`, `titulo` con `limpiarHtml` (el del lector), `fecha` de `DD-MM-AAAA` a ISO con hora `12:00` de Argentina (la página no da hora). Orden: el del listado. Si no encuentra ninguno, `[]` (no tira).

**`leerNotaScpl(html, { id, titulo, fecha })` → `{ id, titulo, fecha, texto, url }`.** Del HTML de una nota saca el texto del cuerpo (los párrafos, sin etiquetas, con `limpiarHtml`), y `url` armada con el molde `nota` de la fuente.

**`vale(titulo, cfg)` → `true|false`.** Si el título pasa el molde de avisos del paso 3 **sin la condición de lugar** (la SCPL ya es de Comodoro). Así «REDUCCIÓN DE CALZADA…» queda afuera y «CRONOGRAMA MENSUAL DE MANIOBRAS OPERATIVAS DEL SERVICIO DE AGUA EN KM.18» entra.

Qué nota se baja (lo decide `scripts/vuelta.js` en el paso 5, con estas reglas de `avisos.js`): del listado, solo los ítems con fecha de los últimos 7 días, que pasan `vale`, y cuyo `id` no está ya en `datos/zona/avisos.json`; como mucho `maxNotasPorVuelta` por vuelta (los más nuevos primero). Una nota bajada se guarda con su texto y nunca se vuelve a bajar.

### 2a · Ejemplos

**E1.** Un listado inventado con tres ítems: «CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR TAREAS PROGRAMADAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS» (07-10-2026, id 2898), «REDUCCIÓN DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA» (09-10-2026, id 2900) y «HECHO VANDÁLICO PROVOCÓ UN CORTE DE ENERGÍA EN UN SECTOR DE ZONA SUR DE COMODORO Y EN RADA TILLY» (13-10-2026, id 2901) → `leerListadoScpl` devuelve 3; `vale` da `true`, `false`, `true`.

**E2.** Una nota inventada cuyo cuerpo dice «Mañana, jueves 08 de octubre, desde las 15:00hs. y por un lapso de 24hs., se interrumpe el suministro de agua en los siguientes barrios: Laprida, Güemes, Sarmiento, Manantial Rosales.» → `leerNotaScpl` devuelve ese texto limpio y la url `https://scpl.coop/index.php/site/ver-nota?id=2898`.

## Paso 3 · Reconocer un aviso en una nota y sacarle los datos

**El molde**, en `config/reglas.json`, en una clave nueva de primer nivel `cortes` (ojo: `avisos` ya existe ahí y es otra cosa, los mails de falla; no la toques): `"cortes": { "molde": "…" }`, con este valor exacto (se prueba sobre el título pasado por `normalizar`):

```
^(?!.*\b(ruta|calle|transito|calzada|tarifa|boleta|factura)\b)(?=.*\b(corte|cortes|cortan|cortaran|cortaron|cortara|cortado|cortada|sin (agua|luz|energia|gas)|interrupcion|interrumpe|suministro|restablec\w*|maniobras? operativas?|baja presion)\b)(?=.*\b(agua|luz|energia|electric\w*|gas|suministro|acueducto)\b)(?=.*\b(comodoro|rada tilly|caleta olivia|zona (norte|sur|central)|km ?\d+|kilometro \d+|barrios?|sectores?)\b)
```

En JSON van las barras dobles (`\\b`). Probado por Cowork contra `normalizar` del repo con 16 títulos: **entran** «Cortarán el agua en 23 barrios de Comodoro», «Numerosos barrios de Comodoro se hallan sin agua», «Una avería en el acueducto del 99 afecta el suministro de agua en 23 barrios de Comodoro», «Corte de energía programado para siete barrios de Zona Norte», «¿En qué barrios cortan la luz 6 horas el domingo?», «Varios sectores de Comodoro se quedaron sin luz», «Se restableció el servicio de agua en zona norte» y los tres de la SCPL de E1 que valen; **no entran** «REDUCCIÓN DE CALZADA…», «Corte de ruta 3 por reclamo de vecinos sin agua», «Aumentó la tarifa de luz en Chubut», «Nuevo ataque ruso deja seis muertos y cortes eléctricos en Ucrania», «Comodoro tendrá un viernes con sol pleno», «Greenpeace alertó por la muerte de ballenas en Chubut». Van los 16 al test.

**Dónde se aplica.** En `preparar` no se toca nada. En `scripts/vuelta.js` (paso 5), **antes** de `preparar` de la zona, las notas de zona cuyo título pasa el molde se apartan: van al camino de avisos y **no** entran a la verificación (si no, «Cortarán el agua en 23 barrios» sale como noticia local de 3 medios, como pasó el 16-10). Nada cambia para lo nacional.

**`datosDeAviso(texto, { fechaPublicacion, cfg })` → `{ servicio, programado, dia, desde, hasta, duracionHoras, barrios, zona }`**, cada campo `null` si no se encuentra. `texto` es título + bajada (portales) o título + cuerpo (SCPL), pasado por `normalizar`.

- `servicio`: la primera clave de `cfg.servicios` cuya lista de palabras aparece; «luz» y «agua» pueden aparecer las dos (un hecho vandálico que corta las dos): se queda con la que aparece primero en el texto.
- `programado`: `true` si aparece `programad`, `mantenimiento`, `cronograma`, `maniobra` o `tareas`; `false` si aparece `averia`, `vandal`, `rotura`, `falla`, `emergencia` o `imprevist`; `null` si ninguna o las dos.
- `dia`: fecha ISO (solo día) sacada de: «mañana» → `fechaPublicacion` + 1; «hoy» → `fechaPublicacion`; «el/este <día de la semana>» → el próximo de esos a partir de `fechaPublicacion` (hoy incluido); «<día> DD de <mes>» → esa fecha en el año de `fechaPublicacion` (si queda más de 30 días en el pasado, el año siguiente). Si hay varias, gana la más específica (la que trae número de día).
- `desde` y `hasta` (horas `HH:MM`) y `duracionHoras`: «desde las 15:00hs. y por un lapso de 24hs.» → `desde 15:00`, `duracionHoras 24`, `hasta` calculado; «entre las 8 y las 14» / «de 9 a 13 horas» / «de 9 a 13 hs» → `desde 08:00`, `hasta 14:00`; «a partir de las 12:00» → `desde 12:00`; «6 horas» sin hora → `duracionHoras 6`.
- `barrios`: lo que sigue a «barrios:» o «los siguientes barrios» hasta el primer punto, partido por comas y « y », cada uno recortado y con mayúscula inicial; si no hay lista, `[]`.
- `zona`: la primera de `cfg.zonas` que aparezca («Zona Norte», «Zona Sur», «Zona Central», «Rada Tilly»), con mayúsculas como en la lista; si el texto dice «zona sur y central», las dos.

### 3a · Ejemplos

**E3.** El texto de E2 con `fechaPublicacion` 2026-10-07 → `servicio agua`, `programado true`, `dia 2026-10-08`, `desde 15:00`, `duracionHoras 24`, `hasta 15:00` (del día siguiente: `hasta` lleva también la fecha cuando cruza la medianoche; representalo como ISO completo en `finISO`), `barrios ['Laprida', 'Güemes', 'Sarmiento', 'Manantial Rosales']`, `zona null`.

**E4.** «Corte de energía programado para siete barrios de Zona Norte» + bajada «La SCPL informó que el martes se interrumpirá el servicio entre las 8 y las 14 en Standard Norte, Castelli y Próspero Palazzo», publicada un sábado 2026-10-24 → `servicio luz`, `programado true`, `dia 2026-10-27`, `desde 08:00`, `hasta 14:00`, `barrios []` (no hay «barrios:» ni «los siguientes barrios»; la lista queda en el texto y la tarjeta muestra la bajada), `zona ['Zona Norte']`.

**E5.** «Varios sectores de Comodoro se quedaron sin luz» sin bajada, 2026-09-24 → `servicio luz`, `programado null`, `dia null`, horas `null`, `barrios []`, `zona null`. Igual es un aviso: sale con título y link.

## Paso 4 · Un aviso por corte (`armarAvisos`)

**`armarAvisos({ notasScpl, notasPortales, ahora, cfg, reglas, portales })` → `[aviso…]`**, en `src/avisos.js`:

1. Cada nota de la SCPL y cada nota de portal que pasó el molde se convierte en una «nota de aviso» con `datosDeAviso`. Una nota de la SCPL toma la forma de una nota del lector para que `agrupar` la entienda: `{ id: 'scpl.coop:<id>', titulo, bajada: <las primeras 200 letras del texto>, url, portal: 'scpl.coop', fecha, seccion: '', etiqueta: '', firma: '', feed: 'SCPL' }`.
2. Se agrupan con `agrupar` de `src/nucleo.js` (las mismas reglas del agrupador: así «Cortarán el agua en 23 barrios de Comodoro» de ADNSUR y «CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR AVERÍA…» de la SCPL quedan juntas). Un grupo es un aviso.
3. En cada aviso, la **fuente primaria** es la nota de la SCPL si hay; si no, la nota de portal más vieja (la que avisó primero). Los datos (`dia`, `desde`, `hasta`, `barrios`, `zona`, `programado`, `servicio`) se toman de la primaria y, campo por campo, lo que la primaria no tenga se completa con la primera nota del grupo que lo tenga. `fuentes` es la lista de todas (medio y url), primaria primero.
4. Vive hasta `finISO` + `horasDespuesDelFin` si `finISO` se conoce; si no, `fechaPublicacion` de la primaria + `ventanaSinFinHoras`. Lo vencido no sale.
5. Orden: primero los que están cortando ahora (entre `desde` y `fin`), después los que vienen (por `dia` y `desde`), después los sin día (por fecha de publicación, más nuevo primero).
6. **El cronograma de verano** (`cronograma-agua.json`): si `ahora` está entre `desde` y `hasta` del archivo, por cada zona cuyo día de la semana es hoy o mañana se agrega un aviso programado de agua con `dia`, `desde` y `duracionHoras` del archivo (o de la excepción de esa fecha si hay), `barrios []`, `zona` la del archivo, `fuentes` `[{ medio: 'SCPL', url: null }]`, `cronograma: true`, salvo que ya exista un aviso de la SCPL del mismo día y zona (entonces manda el comunicado). Con la vigencia vencida, nada.

Cada `aviso`: `{ id, servicio, programado, dia, desde, hasta, finISO, duracionHoras, barrios, zona, titulo, resumen, fuentes: [{ medio, url }], cronograma: false|true, publicado: ISO }`. `id` = `'a:'` + id de la nota primaria. `titulo` es el de la primaria; `resumen`, la bajada o las primeras 200 letras del cuerpo (lo que se muestra es un aviso público; sigue sin copiarse el cuerpo entero).

`src/entrega.js`: `armarEntrega` recibe `avisos` (opcional). Si viene y tiene al menos uno, `bloques.avisos = { nombre: 'Avisos', tope: null, noticias: [tarjetas de aviso], aMano: [], afueraPorTope: 0, minimo: 1 }` va **primero** en `orden`. Una tarjeta de aviso tiene los campos de tarjeta de hoy (`id, titulo, bajada: resumen, etiqueta, via: 'aviso', grupos: fuentes.length, medios, links`) más `aviso: { servicio, programado, dia, desde, hasta, duracionHoras, barrios, zona, cronograma }`. En `medios` y en `links[].medio`, la SCPL aparece como «SCPL» (el `nombre` de la fuente en `avisos.json`), no como el dominio: `tarjeta` recibe las fuentes como si fueran portales con `grupo: 'SCPL'`. `etiqueta`: «Agua · programado», «Luz · avería», «Agua · cronograma de verano», «Luz» (cuando `programado` es `null`).

### 4a · Ejemplos

**E6.** Una nota SCPL (E2/E3) y dos notas de portal del mismo corte (ADNSUR «Cortarán el agua en 23 barrios de Comodoro», El Patagónico «Numerosos barrios de Comodoro se hallan sin agua») → 1 aviso, primaria SCPL, `fuentes` de 3 (SCPL primero), `barrios` de la SCPL.

**E7.** Solo la nota de El Patagónico de E5 → 1 aviso con `programado null`, etiqueta «Luz», sin día, vive 72 h.

**E8.** `ahora` = 2025-11-04 (martes) 10:00 de Argentina, sin notas → 1 aviso de cronograma: Zona Norte, `dia 2025-11-04`, `desde 18:00`, `duracionHoras 24`. Con `ahora` = 2026-10-16, nada (vigencia vencida). Con `ahora` = 2025-12-23 → Zona Norte `desde 12:00` (la excepción).

**E9.** `armarEntrega` con `avisos` de un elemento → `orden` empieza con `'avisos'` y `bloques.avisos.noticias[0].etiqueta` es «Agua · programado». Con `avisos` vacío, `orden` como hoy.

## Paso 5 · `scripts/vuelta.js`

Con `--zona`, si existe `<zona>/avisos.json`:

1. Después de leer los feeds de zona y antes de `preparar` de zona: las notas de zona (acumuladas) cuyo título pasa el molde se apartan (`notasPortalesDeAviso`) y no entran a `preparar`.
2. Se baja el listado de la SCPL con el mismo `fetch` de la vuelta (y el mismo `user-agent` del lector); se guarda en `datos/zona/avisos.json` lo ya bajado (`{ notas: [{ id, titulo, fecha, texto, url, bajadaEn }] }`, recortado a 30 días); se bajan las notas nuevas que valen (paso 2), como mucho `maxNotasPorVuelta`. Si la SCPL no contesta, la vuelta sigue con lo guardado y lo anota en `avisos` de la línea («Fuente de avisos sin leer: SCPL (…)»).
3. `armarAvisos` → `armarEntrega(d, { …, zona, avisos })`.
4. La línea suma `avisos: { fuentes: { ok, mal, caidas: [] }, bajadas: n, vigentes: n, lista: [{ id, servicio, programado, dia, zona, fuentes: n, cronograma }] }`.
5. `resumenEnPantalla`: un renglón «Avisos: 2 vigentes (1 agua programado, 1 luz) · SCPL OK».

Con `--sin-leer`: no baja nada, arma con lo guardado. Sin `avisos.json`, nada de esto corre y la vuelta es la de hoy.

Tests: una vuelta con `fetch` falso que devuelve el listado y una nota inventados → `lista.json` con `orden` que empieza con `avisos` y `datos/zona/avisos.json` con 1 nota; segunda vuelta con el mismo `fetch` → no vuelve a bajar la nota (cuenta las llamadas al `fetch`).

## Paso 6 · La página

El bloque «Avisos» se dibuja con el mismo mecanismo que los otros (orden, nombre, mínimo 1, vacío no se dibuja). La tarjeta de aviso difiere de la de noticia en tres cosas:

- Arriba del título, en lugar del sello de medios, una pastilla con el servicio y el tipo: «Agua · programado» (verde), «Luz · avería» (naranja), «Agua · cronograma de verano» (gris). Los colores son los que la página ya usa para los sellos.
- Debajo del título, una línea con lo que importa, solo con los campos que haya: «Jueves 8/10 · desde las 15:00 · 24 h» · «Zona Norte» · «23 barrios: Laprida, Güemes, Sarmiento, Manantial Rosales…» (si son más de 6, los 6 primeros y «y N más», y el resto al tocar). Si no hay día ni horario: «Sin horario en el aviso: abrí el link».
- Los links: «SCPL» primero, después los portales, como en las noticias. Si `cronograma` es `true`, el link dice «Cronograma de verano de la SCPL» y no tiene url (es texto), y la bajada de esa tarjeta es fija: «Según el cronograma de verano de la SCPL. Si las reservas alcanzan, la cooperativa puede suspenderlo».
- El texto que se copia: una línea «Corte de agua programado · jueves 8/10 desde las 15:00, 24 h · Barrios: … · Fuente: SCPL <url>», con los campos que haya.
- La casilla, «Te la llevaste» y todo lo demás, igual que una noticia.

`scripts/probar-pagina.js`: una comprobación con una lista inventada que trae un bloque `avisos` de dos tarjetas (una con todos los datos, una sin día): el bloque sale primero, la pastilla y la línea de datos están, y el texto copiado tiene la forma de arriba. Y otra sin `avisos`: nada cambia.

## Paso 7 · `medir`

Si alguna vuelta del día trae `avisos`, un bloque «AVISOS» debajo de ZONA: por corte, vigentes (distintos por id) agua / luz / gas, y cuántos con cronograma. Un test.

## Paso 8 · Documentos

- `README.md` y `docs/CORRER_EN_MI_COMPU.md`: el bloque Avisos existe cuando hay `config/zona/avisos.json`; la línea de arranque no cambia.
- `docs/PAQUETE_DE_CLIENTE.md`: la fila «avisos» pasa a «hecho: `config/zona/avisos.json` y `cronograma-agua.json`».
- `CLAUDE.md`: estado al día.
- `buzon/pendientes.md`: arriba de todo, una sección corta «Cowork → pendientes · 16-10-2026 · 18:07 · los avisos» con: lo que decidió Alejo (B, arrancar con lo legible, el cronograma), las fuentes que Alejo dijo que usa (la página de comunicados de la SCPL, `comodorohoy.ar/agua`, ADNSUR, El Patagónico, Facebook e Instagram de la SCPL), qué se lee y qué no, y en «Abierto»: Caleta Olivia (SPSE) y el gas (Camuzzi) como fuentes a sumar en `avisos.json`; el barrio en imagen de las averías de la SCPL (lo lee la IA en la etapa 2); el cronograma 2026-2027 cuando lo publiquen.
- `npm run paquete` y el reporte.

## Fase B · La capa 4 (cuando Alejo te la pida)

- `src/capa4.js`: `mitadUno` recibe también `cuerposAvisos` (el HTML del listado y de las notas nuevas que bajó n8n) y `avisosCfg`; `guardado.avisos` guarda las notas bajadas (30 días). Como las notas nuevas se saben recién después de leer el listado, en n8n son dos pasos: un nodo HTTP que baja el listado, un nodo Code que decide qué notas faltan (con `leerListadoScpl` y lo guardado), un nodo HTTP que baja esas notas, y recién ahí `Preparar`. `mitadDos` arma los avisos y los pasa a `armarEntrega`.
- `n8n/vuelta.json`: esos tres nodos nuevos entre `Bajar` y `Preparar` (13 nodos en total), `n8n/LEEME.md` y `test/n8n.test.js` al día.
- `docs/INSTALAR_EN_EL_SERVIDOR.md`: nada que configurar (la fuente está en `config/zona/avisos.json`).

## Cuándo está listo (Fase A; comprobalo y ponelo en el reporte)

1. `npm test` en verde, antes y después.
2. `npm run probar-pagina` en verde, antes y después.
3. Una vuelta real: `npm run vuelta -- --zona config/zona`. En el reporte: el renglón «Avisos: …», cuántos comunicados de la SCPL listó, cuántos bajó, cuántos avisos vigentes salieron y cada uno con servicio, programado o avería, día, horario, zona, cantidad de barrios y fuentes. Si el listado de la SCPL hoy no tiene ningún corte de los últimos 7 días, decilo y mostrá E6 con las notas inventadas.
4. `npm run ver` abierto: el bloque Avisos arriba, con la pastilla y la línea de datos; una captura en `buzon/capturas/`.
5. `npm run medir` muestra AVISOS.
6. Los 16 títulos del molde, en el test.

## Qué va en tu reporte

Lo de siempre (qué cambió por paso, con commit; tests antes y después; qué decidiste por tu cuenta y por qué), más los números de los puntos 3 a 5, y **una lista de los títulos de los últimos 20 comunicados de la SCPL con `vale` true/false al lado**: es lo que Cowork mira para afinar el molde.
