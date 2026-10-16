# Cowork → Claude Code · 16-10-2026 · 13:02 (hora de Argentina) · letra a

No responde a ninguna carta: sale de la medición nacional y local que corrió Alejo en su compu (14-10 14:15 → 16-10 12:20) y de la charla del 16-10 a las 04:55 (`buzon/Cowork_resumen_2026-10-15.md`). Es la carta de **los bloques por zona** (Comodoro y Chubut) y arranca el bloque **«Avisos» de cortes** por su primer paso: probar las fuentes. Base: commit `399c3b2` de la rama `claude/trusting-knuth-brmpsy`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-16_a.md`. Una sola fase, un solo reporte: `buzon/ClaudeCode_para_Cowork_2026-10-16_a.md`.

**Qué pasó:** se midieron dos días. Lo nacional confirma unas 45 noticias frescas por día con la regla de 5 y la lista de 7 estuvo llena casi siempre. Lo local (5 portales de Comodoro y Chubut, 2 medios para confirmar) da unas 43 por día, el agrupador acierta en 46 de 52 pares, pero 1 de cada 4 «locales» es una noticia nacional que los portales de Comodoro repiten (el Papa, River, el riesgo país) y el pronóstico del tiempo llega a 2 medios todos los días. Con esos números Alejo decidió los dos primeros anillos. **Al final de esto la página muestra cuatro bloques en este orden: Comodoro, Chubut, Nacionales, Internacionales**, lo nacional no cambia, y sabemos por dónde publican los cortes las cooperativas.

| Paso | Qué cambia | Archivos que se tocan |
|---|---|---|
| 1 | `config/comodoro/` pasa a ser `config/zona/`, con qué portal es de Comodoro y cuál provincial, y las reglas de los dos anillos | `config/zona/feeds.json`, `config/zona/portales.json`, `config/zona/reglas.json` (los tres renombrados de `config/comodoro/`) |
| 2 | Las reglas de zona, puras: a qué anillo va un hecho, si «también es nacional», y la lista de cada anillo | `src/zona.js` (nuevo), `test/zona.test.js` (nuevo) |
| 3 | La entrega lleva los bloques de zona y el orden de los bloques | `src/entrega.js`, `test/entrega.test.js` |
| 4 | `npm run vuelta -- --zona config/zona` corre la zona en la misma vuelta que lo nacional y lo anota | `scripts/vuelta.js`, `test/vuelta.test.js` |
| 5 | La página dibuja los bloques que vengan, en orden, con el sello de cada anillo | `pagina/index.html`, `pagina/logica.js`, `test/logica.test.js`, `scripts/probar-pagina.js` |
| 6 | `npm run medir` suma la zona | `scripts/medir.js`, `test/medir.test.js` |
| 7 | Dos moldes de servicio nuevos: pronóstico del tiempo y cotizaciones | `config/reglas.json`, `test/nucleo.test.js` |
| 8 | Avisos de cortes: probar por dónde publican las cooperativas (solo reporte) | nada en el repo salvo el reporte |
| 9 | Documentos y pendientes | `README.md`, `CLAUDE.md`, `docs/CORRER_EN_MI_COMPU.md`, `buzon/pendientes.md`, reporte, paquete |

**No se tocan:** `src/nucleo.js`, `src/provisorio.js`, `src/ia.js`, `src/lector.js`, `src/capa4.js`, `n8n/`, `scripts/servir.js`, `scripts/usuario.js`, `scripts/ia-falsa.js`, `scripts/leer.js`, `scripts/armar-pagina.js`, `pagina/lista.json`, `config/feeds.json`, `config/portales.json`, `config/firmas.json`, `docs/INSTALAR_EN_EL_SERVIDOR.md`, `.gitignore`, `.github/`, los `buzon/LEEME*.md`, las cartas y reportes viejos, las capturas. **La capa 4 no cambia en esta carta:** el servidor de Don Julio, cuando se instale (Fase B de la carta `b`), sigue mostrando solo Nacionales e Internacionales; enganchar la zona en `src/capa4.js` es la carta siguiente, cuando lo de hoy esté probado.

**Regla de toda la ronda:** nada de lo que sale de los portales entra al repo. Lo real vive en `datos/` y en `datos/zona/` (ya cubiertos por `.gitignore`). En el reporte van números y títulos, nunca bajadas ni cuerpos.

## Qué decidió Alejo y qué es valor por defecto

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Los anillos van del más chico al más grande: Local (Comodoro) → Chubut → Región → Nacional → Internacional. Esta carta arma Local y Chubut; Región espera portales con feed | Alejo (14-10) | pasos 1 a 5 |
| **Local: 2 medios de Comodoro. Chubut: 2 medios, al menos uno provincial.** Alejo eligió la opción B el 16-10 a las 12:51. El porqué, con sus números: de los 27 hechos del día que tenían a El Chubut, solo 8 tenían además 2 medios de Comodoro; pedir 3 en la provincia dejaba afuera los otros 19, que eran justo las noticias provinciales (Gaiman, Trelew, Rawson, Las Plumas). Hoy la provincia tiene un solo portal legible; cuando haya más, el número se vuelve a medir | Alejo (16-10) | `config/zona/reglas.json` |
| Lo que cumple en dos anillos va al más chico | Alejo (14-10) | paso 2 |
| Los cortes de agua, luz y gas van en un bloque «Avisos» aparte, leído de quien corta (opción B), no como noticia verificada | Alejo (16-10, 04:57) | paso 8: solo probar las fuentes |
| El tema no descarta: el motor no saca una noticia por ser de deportes o espectáculos | Alejo (14-10) | nada cambia |
| Una noticia de zona que también salió en 3 o más portales nacionales no se muestra en Comodoro ni en Chubut («también nacional»); si llegó a 5, ya está en Nacionales; si no, no se muestra en ningún lado y queda anotada | Cowork (valor por defecto; el 3 está en `config/zona/reglas.json`) | paso 2 |
| Cupo 3 por anillo; orden por cantidad de medios y después la más nueva; sin 1/2 a mano; sin tope por sección | Cowork (valor por defecto) | paso 2 |
| Un anillo sin noticias no se dibuja | Cowork (valor por defecto) | paso 5 |
| Pronóstico del tiempo y cotizaciones son notas de servicio (criterio 1), para todos los anillos; una «alerta» del SMN sigue siendo noticia | Cowork (valor por defecto; Alejo las marcó como «sobran» en 3 de sus 19 pasadas) | paso 7 |
| Crónica cuenta como un medio más de Comodoro (no se le exige a nadie estar) | Cowork (valor por defecto) | paso 1 |

## Paso 1 · `config/zona/`

`git mv config/comodoro config/zona`. Los tres archivos son los de hoy con estos cambios y ningún otro:

- `feeds.json`: en `_aviso`, la línea de uso pasa a `node scripts/vuelta.js --zona config/zona` y «Bloque local de prueba» pasa a «Bloque de zona (Comodoro y Chubut)». Los 8 feeds quedan iguales.
- `portales.json`: cada portal suma el campo `"zona"`: `"local"` para ADNSUR, El Comodorense, Crónica y El Patagónico; `"provincial"` para El Chubut. El `ambito` sigue `nacional` (lo usa el provisorio; no lo toques). `_aviso` dice «Portales del bloque de zona».
- `reglas.json` queda así, entero:

```json
{
  "_aviso": "Solo lo que cambia respecto de config/reglas.json para la zona (Comodoro y Chubut): 2 medios para confirmar, sin 1/2 a mano, y las reglas de los anillos. Todo lo demás (ventanas, agrupador, criterio 1, provisorio) se toma de config/reglas.json.",
  "minGrupos": 2,
  "aMano": { "activa": false },
  "anillos": [
    { "clave": "local",  "nombre": "Comodoro", "minMedios": 2, "minProvinciales": 0, "cupo": 3, "etiqueta": "Confirmada por {n} medios locales" },
    { "clave": "chubut", "nombre": "Chubut",   "minMedios": 2, "minProvinciales": 1, "cupo": 3, "etiqueta": "Confirmada por {n} medios de Chubut" }
  ],
  "cruce": { "minGruposNacionales": 3 }
}
```

`cargarConfig` ya mezcla este archivo sobre `config/reglas.json` (un objeto de primer nivel se reemplaza entero): no hace falta cambiarla.

## Paso 2 · `src/zona.js`

Puro, como el núcleo: sin archivos, sin reloj. Importa de `src/nucleo.js` lo que necesite (`agrupar`, `buscarPortal`, `dominioDe`) y de `src/entrega.js` nada (la tarjeta la arma la entrega en el paso 3). Tres funciones exportadas.

**`anilloDe(hecho, { portales, reglas })` → clave del anillo o `null`.** Cuenta los grupos distintos del hecho igual que `gruposIndependientes` (portales de la lista que cuentan y están activos; TN y Clarín son uno), y cuántos de esos grupos tienen `zona: "local"` y cuántos `zona: "provincial"`. Recorre `reglas.anillos` **en el orden del archivo** (del más chico al más grande) y devuelve la clave del primero que cumple. Un anillo cumple cuando: (a) si su `minProvinciales` es 0, los grupos **locales** solos son ≥ `minMedios` (los provinciales no suman ahí); (b) si su `minProvinciales` es 1 o más, los grupos locales + provinciales son ≥ `minMedios` **y** los provinciales son ≥ `minProvinciales`. Si ninguno cumple, `null`. Con las reglas del paso 1: 2 locales → `local`; 1 local + 1 provincial → `chubut`; 2 locales + 1 provincial → `local` (es el primero que cumple).

**`tambienNacional(hecho, hechosNacionales, { reglas })` → `{ si: true|false, grupos: n }`.** `hechosNacionales` son los candidatos y los en observación de la vuelta nacional de esa misma vuelta (los devuelve `preparar`), filtrados a los que tienen `gruposIndependientes` ≥ `reglas.cruce.minGruposNacionales`. Para cada uno, se llama a `agrupar([...hecho.notas, ...nacional.notas], reglas)` con las mismas reglas del agrupador y se mira si alguna nota del hecho de zona quedó en el mismo grupo que alguna nota del hecho nacional. Con el primero que pase, `{ si: true, grupos: nacional.gruposIndependientes }`; si ninguno, `{ si: false, grupos: 0 }`. Es la misma pregunta que ya contesta el agrupador («¿es la misma noticia?»), hecha contra lo nacional; no se inventa otro parecido.

**`decidirZona(preparado, { portales, reglas, hechosNacionales })` → `{ bloques, confirmados, descartadas }`.** `preparado` es lo que devuelve `preparar` con la config de zona.

- Por cada candidato (ya son frescos o viejos; `enObservacion` no se mira: en la zona no hay 1/2 a mano): si `viejo` es true → descartada `no_fresco (criterio 2)`; si `tambienNacional(...).si` → descartada `tambien_nacional (N medios nacionales)`; si `anilloDe` da `null` → descartada `sin_anillo`; si no, va a su anillo.
- En cada anillo, orden: más grupos primero; si empatan, `primera` más nueva. Entran hasta `cupo`; las demás van a `descartadas` con motivo `cupo`.
- `bloques` es un objeto con una clave por anillo, **en el orden de `reglas.anillos`**, cada uno `{ nombre, tope: cupo, noticias: [salida…], aMano: [], afueraPorTope: k, minimo: 1 }`. Cada `salida` tiene la misma forma que las de `decidir` (`id, titulo, bajada, bloque, seccion: '', pais: '', via: 'A', etiqueta, gruposIndependientes, links`), con `bloque` = la clave del anillo y `etiqueta` = la plantilla del anillo con `{n}` reemplazado por los grupos.
- `confirmados` es la lista de **todos** los candidatos (viejos y «también nacionales» incluidos, como hace lo nacional con `confirmados`), para `vueltas.jsonl`: `{ id, anillo, grupos, medios, titulo, tambienNacional: true|false, viejo }`. `anillo` es lo que devuelve `anilloDe` para ese hecho (la clave o `null`), se haya mostrado o no; `medios` como ya lo arma `mediosDe` en `scripts/vuelta.js` (copiá esa función a `zona.js`, no la importes de un script).

### 2a · Ejemplos (entrada → salida), con títulos reales de la medición

**E1 · local.** Hecho con dos notas: El Comodorense «Comodoro, la ciudad con la canasta básica más cara de la Patagonia…» y El Patagónico «Comodoro tiene la canasta básica más cara de la Patagonia» → `anilloDe` = `'local'` (2 locales); etiqueta «Confirmada por 2 medios locales».

**E2 · chubut.** Crónica «Violento asalto a una familia en una chacra de Gaiman» + El Chubut «Violento asalto comando en una chacra de Gaiman» → locales 1, provinciales 1: no cumple local (pide 2 locales), cumple chubut → `'chubut'`, «Confirmada por 2 medios de Chubut».

**E3 · los dos → el más chico.** El Chubut «Comienza el Campeonato Provincial de handball» + Crónica «Comienza el provincial de juveniles» + El Comodorense «Comodoro recibe al Provincial Juvenil de Handball» → 2 locales y 1 provincial: cumple local y chubut → `'local'`, «Confirmada por 3 medios locales».

**E4 · también nacional.** Crónica «El riesgo país supera los 600 puntos tras una jornada de volatilidad global» + El Comodorense «El riesgo país subió y volvió a superar los 600 puntos en medio de la incertidumbre global», con un hecho nacional de 8 grupos «El riesgo país se encuentra al alza y vuelve a superar los 600 puntos» → `tambienNacional` = `{ si: true, grupos: 8 }`; en `decidirZona` queda descartada `tambien_nacional (8 medios nacionales)` y no sale en ningún bloque de zona. Con la misma entrada pero `hechosNacionales` vacío → `{ si: false, grupos: 0 }` y va a `'local'`.

**E5 · cupo.** Cinco hechos locales frescos de 2, 2, 3, 2 y 4 grupos → `bloques.local.noticias` trae 3 (el de 4, el de 3 y el de 2 más nuevo), `afueraPorTope` 2, y dos descartadas con motivo `cupo`.

**E6 · sin anillo.** Un hecho de 2 grupos cuyos dos portales no están en `portales.json` de la zona → `null` y descartada `sin_anillo` (no debería pasar con los feeds de hoy; es la red de abajo).

### 2b · Tests en `test/zona.test.js`

E1 a E6, uno por test, con notas inventadas (títulos de arriba, urls inventadas en los dominios reales). Más uno: `reglas.anillos` vacío → `decidirZona` devuelve `bloques` `{}` y todo descartado `sin_anillo`.

## Paso 3 · `src/entrega.js`

`armarEntrega` suma un parámetro opcional `zona` (lo que devuelve `decidirZona`, o `null`). Si viene:

- `bloques` lleva primero los de la zona (cada uno pasado por `tarjeta`, con los portales de la zona) y después `nacional` e `internacional` como hoy. Cada bloque de zona lleva además `nombre` y `minimo: 1`; los dos de siempre no cambian de forma.
- Un campo nuevo `orden`: la lista de claves de bloque en el orden en que se dibujan, por ejemplo `["local", "chubut", "nacional", "internacional"]`. **Sin `zona`, `orden` es `["nacional", "internacional"]`** y todo lo demás sale exactamente igual que hoy (los tests de hoy no cambian; `pagina/lista.json` de ejemplo no se regenera).
- `tarjeta` recibe los portales del bloque: para los de zona, los de `config/zona/portales.json`; para los otros dos, los de siempre. Para eso `armarEntrega` recibe `zona.portales` adentro del objeto `zona` (lo arma `scripts/vuelta.js`).

Dos tests nuevos en `test/entrega.test.js`: con `zona` (orden de cuatro, bloque local con una tarjeta cuyos `medios` son `['El Comodorense', 'El Patagónico']`) y sin `zona` (orden de dos, igual que antes).

## Paso 4 · `scripts/vuelta.js`

Una opción nueva, `--zona <carpeta>` (va junto con `--carpeta`, `--cada` y `--sin-leer`; `--config` sigue existiendo para los tests y la medición aparte y **no se combina** con `--zona`: si vienen las dos, `ErrorDeUso` «--zona y --config no van juntas»). Con `--zona config/zona`, la vuelta hace lo de siempre para lo nacional y, antes de armar la entrega:

1. Carga la config de zona con `cargarConfig(zona)`.
2. Lo guardado de la zona vive en `<carpeta>/zona/notas.json` (con `--carpeta datos`, es `datos/zona/notas.json`); se lee con `filtrarRutas(cargarNotas(...), feedsZona)`, se leen los feeds de zona con `leerFeeds`, se acumula y se guarda, igual que lo nacional. Con `--sin-leer`, no se lee ni se guarda.
3. `preparar(notasZona, { portales: portalesZona, reglas: reglasZona, firmas: [], ahora })`.
4. `decidirZona(pZona, { portales: portalesZona, reglas: reglasZona, hechosNacionales: [...p.candidatos, ...p.enObservacion] })`, donde `p` es el `preparar` nacional de la misma vuelta.
5. `armarEntrega(d, { …, zona: { ...zonaDecidida, portales: portalesZona } })`.

La línea de `vueltas.jsonl` suma `zona`: `{ feeds: { ok, mal, caidos }, notas: { leidas, nuevas, repetidas, borradas, acumuladas }, hechos: { total, porGrupos }, confirmados: [los de decidirZona], lista: { local: n, chubut: n } }` (una clave por anillo en `lista`, con las claves de `reglas.anillos`). Sin `--zona`, la línea no lleva `zona` y es idéntica a la de hoy. El candado es el mismo (`vuelta.lock`): la zona no corre sola.

`resumenEnPantalla` suma, solo cuando hay zona, dos renglones después de «Lista: …»: `Zona · feeds: 8 OK · 0 caídos` y `Zona · lista: 3 Comodoro + 2 Chubut · también nacionales: 4` (los nombres salen de `reglas.anillos[].nombre`; «también nacionales» cuenta las descartadas con ese motivo).

Tests en `test/vuelta.test.js`: `--zona` y `--config` juntas da `ErrorDeUso`; una vuelta con `fetch` falso y `zona` escribe `lista.json` con `orden` de cuatro y `vueltas.jsonl` con `zona.lista`; sin `--zona` la línea no tiene `zona`.

## Paso 5 · La página

- `pagina/index.html`: la constante `BLOQUES` desaparece. El orden sale de `lista.orden` (si falta, `['nacional', 'internacional']`); el nombre de cada bloque, de `lista.bloques[clave].nombre` si está y si no del par de siempre («Nacionales», «Internacionales»). Un bloque con 0 noticias, 0 a mano y 0 llevadas **no se dibuja**; los dos de siempre se dibujan siempre, como hoy (para que se vea «0 de 3»).
- `tituloBloque` y `avisoBloque` usan `b.minimo` cuando el bloque lo trae; si no, `lista.cupoMinimo`. Así un anillo con 1 noticia dice «Comodoro · 1» y no «1 de 3».
- El avance y el copiado («1 de 5 · Nacionales», lo que se lleva) recorren `lista.orden`, no la constante.
- `etiquetaMedios` (la de las 4/5) no cambia: en la zona no hay 4/5.
- `scripts/probar-pagina.js`: una comprobación nueva con una lista inventada de cuatro bloques (dos de zona con 1 y 0 noticias, más los dos de siempre): se dibujan tres secciones, en orden Comodoro → Nacionales → Internacionales, y el título del primero es «Comodoro · 1». Y otra con la lista de ejemplo de siempre: se dibujan dos, igual que hoy.

## Paso 6 · `scripts/medir.js`

Cuando una vuelta trae `zona`, el informe de cada día suma, debajo de «Vueltas sin ningún feed», un bloque:

```
ZONA · cada celda es Comodoro / Chubut
Corte                   Vueltas  Confirmados  También nacionales  Sin anillo
…
Día entero (distintos)  …
```

Con las mismas reglas de conteo que arriba: un id cuenta una vez por corte, en el `anillo` de su última vuelta de ese corte. «Confirmados» cuenta los ids con `anillo` (Comodoro / Chubut); «También nacionales» cuenta, de esos mismos, los que traen `tambienNacional: true` (también por anillo); «Sin anillo» cuenta los de `anillo: null`, en una sola celda. Sin `zona` en ninguna vuelta, el informe es idéntico al de hoy. Un test con dos vueltas inventadas.

## Paso 7 · Moldes de servicio en `config/reglas.json`

En `criterio1.notasDeServicio` se suman dos moldes (se prueban sobre el título ya pasado por `normalizar`: minúsculas, sin acentos, sin signos):

```json
{ "nombre": "pronóstico del tiempo", "molde": "^(?!.*\\balerta\\b)(?=.*\\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo|fin de semana)\\b)(?=.*\\b(pronostico|nublado|nubes|nubosidad|lluvias?|sol pleno|soleado|maxima de|minima de|rafagas|como estara el (tiempo|clima)|estado del tiempo)\\b)" },
{ "nombre": "cotizaciones", "molde": "\\b(dolar|euro)( blue| oficial| tarjeta| mep| cripto)? hoy\\b|\\ba cuanto cotizan?\\b|\\bbanco por banco\\b|\\bcotizacion de cierre\\b" }
```

Y en `titulosExcluidos` se **saca** `"^dolar (blue )?hoy"`, que queda cubierto por «cotizaciones» (si un test lo nombraba, pasa a probar el molde nuevo).

Casos para `test/nucleo.test.js` (un test por molde, con todos sus casos):

- Pronóstico, **sacan**: «Comodoro y Rada Tilly tendrán un jueves nublado y sin chances de lluvias», «Comodoro tendrá un viernes con sol pleno y una máxima de 18 °C», «Viernes agradable y con algunas nubes en Comodoro y Rada Tilly», «Tucumán: cómo estará el tiempo este miércoles 14 de octubre». **Pasan**: «Alerta amarilla por tormentas muy fuertes en gran parte de Chubut», «Pronostico en Chubut: rige una alerta amarilla por tormentas para este jueves», «El SMN emitió una alerta amarilla por tormentas en la Ciudad de Buenos Aires».
- Cotizaciones, **sacan**: «Euro hoy en Chile: cotización de cierre del 15 de octubre», «El dólar en Córdoba: a cuánto cotiza este miércoles 14 de octubre», «Euro blue hoy: se mantiene estable en los $1.844,75», «Dólar oficial y dólar tarjeta: banco por banco, a cuánto cotizan este jueves», «Dólar blue hoy: a cuánto abre». **Pasan**: «El Gobierno repone los límites a la venta de tierras», «Caputo aseguró que Argentina ya no depende del FMI», «El dólar blue tocó un récord tras el anuncio».

## Paso 8 · Avisos de cortes: probar las fuentes

Sin código. Desde tu entorno, buscá y probá por dónde publican sus cortes programados estas tres: la cooperativa de luz y agua de Comodoro Rivadavia, la distribuidora de gas de la zona, y la cooperativa de servicios de Caleta Olivia. Para cada una, en el reporte: nombre y sitio, si tiene **página de avisos, feed, o solo redes** (y cuáles), si el aviso trae **barrio o zona, día y horario**, cuántos avisos hay publicados hoy y los últimos tres tal como los titulan (sin copiar el cuerpo). Si una no publica en ningún lado legible, decilo. Es el dato para diseñar el bloque; el diseño viene en otra carta.

## Paso 9 · Documentos

- `README.md` y `docs/CORRER_EN_MI_COMPU.md`: la línea de arranque en la compu de Alejo pasa a `npm run vuelta -- --cada 30 --zona config/zona` (una sola ventana para las dos cosas); `config/zona` reemplaza a `config/comodoro` donde se nombre; lo local ya no se corre aparte. En `docs/CORRER_EN_MI_COMPU.md` va además una línea: si en la compu existe `datos\comodoro` (la medición del 15 y 16), se renombra a `datos\zona` antes de arrancar, para seguir con lo ya guardado.
- `CLAUDE.md`: estado al día (anillos Local y Chubut, cómo se corren, qué espera la capa 4).
- `buzon/pendientes.md`: pegá arriba de todo la sección «Cowork → pendientes · 16-10-2026» que va al final de esta carta, tal cual. En «▶ PRÓXIMA RONDA», el ítem «Cuántas noticias da la regla de 5 en un día real» pasa a hecho con una línea que apunte a esa sección; el ítem de la medición local (el del 15-10) también; en «Cowork → Claude Code» sumá «Enganchar la zona en `src/capa4.js` (carta siguiente, después de probar esto)».
- `npm run paquete` y el reporte.

## Cuándo está listo (comprobalo y ponelo en el reporte)

1. `npm test` en verde, con el número de tests antes y después.
2. `npm run probar-pagina` en verde, con el número antes y después.
3. `npm run vuelta -- --sin-leer --zona config/zona` falla con un mensaje claro si no hay `datos/notas.json` (como hoy), y con `datos/notas.json` y `datos/zona/notas.json` presentes arma `lista.json` con `orden` de cuatro.
4. Una vuelta real desde tu entorno: `npm run vuelta -- --zona config/zona` (con `NODE_USE_ENV_PROXY=1` si hace falta). En el reporte: los renglones del resumen en pantalla, cuántos hechos de zona salieron en Comodoro, cuántos en Chubut, cuántos «también nacionales» y sus títulos, y cuántos sacaron los dos moldes nuevos (títulos).
5. `npm run medir` sobre tu `datos/vueltas.jsonl` muestra el bloque ZONA.
6. El paso 8 contestado.

## Qué va en tu reporte

Lo de siempre (qué cambió por paso, con commit; tests antes y después; qué decidiste por tu cuenta y por qué), más:

- Los números del punto 4 y 5 de arriba.
- La tabla del paso 8.
- **Una explicación, leyendo el código, de esto que se vio en la medición de Alejo:** el 16-10 de madrugada, 23 hechos aparecieron por primera vez en `confirmados` de `vueltas.jsonl` con `viejo: true` (Roña Castro cuatro veces con ids distintos, el Papa, la Champions del 14). Es decir, un hecho ya confirmado dos días antes volvió como un id nuevo. ¿Cómo puede un hecho cambiar de id entre vueltas (el id es `g:` más el id de su primera nota) y qué pasa cuando una nota más vieja entra tarde a un grupo? No lo arregles: contalo, con tu propuesta y qué costaría. Lo decide Cowork con Alejo.

---

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

- **Viejas que vuelven como nuevas** (23 el 16-10): Claude Code explica en su reporte cómo un hecho cambia de id; se decide después. Mientras tanto: nada; la página no las muestra porque no son frescas.
- **Región:** sin portales con feed en Neuquén, Río Negro, Santa Cruz y Tierra del Fuego. Mientras tanto no existe en `config/zona/reglas.json`; se suma como tercer anillo cuando haya 2 portales por provincia.
- **Más portales de Chubut:** Diario Jornada y La Opinión Austral sin feed ni sitemap; Rawson Digital no conecta (14-10). Mientras tanto, El Chubut es el único provincial.
- **X / Twitter como segunda confirmación** (idea de Alejo del 16-10): nunca como medio que suma a los 5; como mucho una señal aparte, tipo vía B. Va a «Más adelante» hasta averiguar costo y reglas de la API; si es caro, no.
- **Avisos de cortes:** fuentes sin probar (paso 8 de la carta `a`); el bloque se diseña con lo que vuelva.
- **Canal 2 y el servidor de Don Julio:** sin respuesta (pedido el 15-10 por WhatsApp). La carta `b` asume Docker, 3 personas, celular.

### Qué viene después

1. Claude Code hace la carta `a` y reporta (incluida la prueba de las fuentes de los cortes y la explicación de los ids).
2. Cuando Don Julio conteste, la Fase B de la carta `b` (instalar la capa 4 en su servidor).
3. Carta: enganchar la zona en la capa 4 y diseñar el bloque «Avisos» con las fuentes probadas.
4. Carta de la página C (flujo con Normal/Plus, temas, los chips de motivo con «derivada»), ya con los dos anillos adentro.
