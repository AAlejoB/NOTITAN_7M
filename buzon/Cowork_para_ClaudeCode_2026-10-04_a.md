# Cowork → Claude Code · 04-10-2026 · 21:55 (hora de Argentina) · letra a

Responde al reporte `ClaudeCode_para_PREPARADOR_2026-10-04_k.md`. Es la primera carta del chat único de Cowork (ver `buzon/LEEME_COWORK.md`).

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-04_a.md`. Tu reporte va en `buzon/ClaudeCode_para_Cowork_2026-10-04_a.md`.

**Veredicto:** Alejo cerró en este chat el diseño de la entrega (5 decisiones) y las preguntas de la IA (3 decisiones y 1 pendiente), y dejó la capa 4 para hablarla con Don Julio. En esta ronda: el orden pasa a **cantidad de medios** (paso 1), la salida trae la bajada (paso 2), se arma **la página** con su armador sobre el día de ejemplo (paso 3), se arman **las piezas de la IA que no llaman a ningún modelo** (paso 4), 3 mediciones (paso 5) y los documentos (paso 6). Ninguna IA de verdad se llama en esta ronda.

| Paso | Qué ve quien usa el programa | Archivos |
|---|---|---|
| 1 | Arriba de cada bloque va lo que más medios publicaron; si empatan, lo más nuevo | `src/nucleo.js`, `test/nucleo.test.js`, `ejemplos/dia-de-ejemplo.js`, `ejemplos/demo.js` |
| 2 | Cada noticia trae la bajada del medio | `src/nucleo.js`, `test/nucleo.test.js` |
| 3 | La página: elegir, copiar, «Nueva», «Te la llevaste», las 4/5 | nuevos: `src/entrega.js`, `pagina/index.html`, `pagina/logica.js`, `pagina/lista.json`, `scripts/armar-pagina.js`, `test/entrega.test.js`, `test/logica.test.js`; cambian: `config/portales.json`, `package.json`, `src/nucleo.js` (solo exportar) |
| 4 | Nada todavía: piezas para cuando haya IA | nuevos: `src/ia.js`, `test/ia.test.js`, `test/casos-ia.json`; cambian: `config/reglas.json`, `src/nucleo.js` (notas de la ficha y exportar) |
| 5 | Nada: 3 mediciones | ninguno (scripts de una sola vez, fuera del repo) |
| 6 | Nada: documentos y cierre | `CLAUDE.md`, `buzon/pendientes.md`, `README.md`, reporte, paquete |

## Lo que decidió Alejo hoy (04-10, en el chat de Cowork)

| # | Tema | Decidió | Descartado |
|---|---|---|---|
| 1.1 | Por dónde le llegan las noticias | **Una página con un botón «Traer noticias».** Entra desde un link guardado, tilda las que quiere y las copia juntas. No avisa sola. | Telegram, WhatsApp, mail |
| 1.2 | Qué ve al apretar | **Siempre lo último:** la lista se rehace sola cada 30 minutos, después de cada lectura. Las 3 personas del canal ven lo mismo. No hay horarios de corrida. | Horas fijas cada 4 h; armar la lista al apretar |
| 1.3 | Lo que ya vio y lo que ya se llevó | **Se marca, no se oculta.** «Nueva» en lo que no vio; lo que copió baja al fondo, apagado, con la hora. | Ocultar lo llevado; ocultar todo lo visto; no marcar |
| 1.4 | Cuántas ve | **Hasta el tope (7) y ella tilda.** Sin selector en la página. El 3 a 7 queda como ajuste por cliente en `config/`. | Selector «3 · 5 · 7» |
| 1.5 | Las 4/5 | **Abiertas, debajo de cada bloque**, con «Llevármela igual». | Plegadas |
| 2.1 | Qué es «la misma noticia» | **El mismo hecho:** misma gente, lo mismo que pasó, el mismo día. No alcanza con el mismo tema. | El mismo tema |
| 2.2 | Deportes y espectáculos | **«Dejalo como pendiente».** | — |
| 2.3 | Qué ordena el top | **Cantidad de medios.** | Importancia que pone la IA; lo más nuevo |
| 2.4 | Argentinos afuera | **Por lugar:** va donde pasó el hecho. | Por protagonista |
| 3.1 | Dónde corre n8n | **«Lo hablo con Don Julio».** | — |
| — | Infobae (feeds por sección y las 14 notas de otras ediciones), reglas viejas `quiniela`/`horoscopo`, variantes de servicio | **«Dejalas con el valor por defecto».** Quedan como están. | — |

**Corrección importante (2.1):** el reporte `k` y `pendientes.md` dicen que el par «EN VIVO | Elecciones en Brasil: comienza el escrutinio…» + «…Milei sigue con optimismo la elección en Brasil…» es la misma noticia. Con la definición de Alejo **no lo es**: uno es el conteo de votos, el otro es lo que hace Milei. Ese par entra a los casos de prueba como «no» (paso 4).

## Paso 1 · El orden pasa a cantidad de medios

**Qué cambia:** dentro de cada bloque va primero el hecho con más grupos independientes; si empatan, el más nuevo (la `primera` más reciente). La vía B sigue yendo después de toda la vía A. En el menú a mano (`aMano`) todos tienen 4, así que va primero el más nuevo. La IA ya no da importancia: `impacto` no se usa para nada y **no sale** en ninguna lista.

**En `src/nucleo.js`, dentro de `decidir`:**

1. El orden de `sobreviven[bloque]` queda: `(a.c.via === 'B') - (b.c.via === 'B') || b.c.gruposIndependientes - a.c.gruposIndependientes || Date.parse(b.c.primera) - Date.parse(a.c.primera)`. Si sigue el empate, quedan como llegaron (el `sort` de Node es estable).
2. El orden de `menu[bloque]` (a mano) queda: `b.c.gruposIndependientes - a.c.gruposIndependientes || Date.parse(b.c.primera) - Date.parse(a.c.primera)`.
3. Sacá `impacto` de `salida` y de cada entrada de `aMano`. Si un juicio trae `impacto`, se ignora sin error.
4. El comentario de `juicios[idDelHecho]` queda: `datoNuevo, fuenteConNombre, interesPublico, desmentido (true/false); bloque: 'nacional' | 'internacional' | null; seccion; pais`. El comentario del criterio 7 dice: «Criterio 7 (decidió Alejo el 04-10): cantidad de grupos; si empatan, la más reciente».

**En los ejemplos:** sacá `impacto` de `J()` y de cada llamada en `ejemplos/dia-de-ejemplo.js`. En `ejemplos/demo.js`, donde hoy imprime `[${x.impacto}]`, que imprima `[${x.gruposIndependientes} medios]`.

**Tests:** reescribí los que esperaban un orden por impacto (son varios; algunos solo usan `impacto` de relleno y no cambian). En el reporte, una tabla: nombre del test antes → después, y qué esperaba antes → qué espera ahora. Sumá estos 5:

- **T1 · orden por medios.** Candidatos vía A, mismo bloque: A (5 grupos, `primera` hace 1 h), B (7 grupos, hace 6 h), C (6 grupos, hace 3 h). Sale: **B, C, A**.
- **T2 · empate: la más nueva.** X (5 grupos, hace 5 h) e Y (5 grupos, hace 2 h). Sale: **Y, X**.
- **T3 · el impacto no cambia nada.** Igual que T1, pero los juicios traen `impacto: 3` para A y `impacto: 0` para B. Sale igual: **B, C, A**, y ninguna salida tiene la propiedad `impacto`.
- **T4 · a mano.** Dos 4/5 del mismo bloque, `primera` hace 3 h y hace 1 h. Sale primero **la de hace 1 h**.
- **T5 · el tope decide cuáles entran.** Cupo 3, cinco candidatos nacionales: 7 grupos (hace 6 h), 6 (hace 5 h), 5 (hace 2 h), 5 (hace 3 h), 5 (hace 8 h). Entran **7, 6 y el 5 de hace 2 h**; los otros dos van a `reserva` con `motivo: 'cupo'`. Cada uno con su sección distinta, para que el tope por sección no se meta.

**Ojo: también cambia cuáles entran, no solo el orden.** Con el tope de 3 por sección y de 2 por país, otro orden deja afuera a otras noticias (en el día de ejemplo, Cowork calcula que en nacionales entran E3 y E4 y salen E1 y E2 por el tope de economía, y en internacionales entra I3 y sale I2 por el tope de EEUU). No es un error: es lo que decidió Alejo. Los tests del día de ejemplo se actualizan con lo nuevo.

**Demo:** en `ejemplos/demo.js`, `[${x.impacto}]` aparece en `lista` y en `sublista`: cambiá los dos. `npm run demo` va a cambiar. En el reporte, las listas de nacionales e internacionales antes y después, lado a lado.

## Paso 2 · La bajada en la salida

**Qué cambia:** cada noticia que devuelve `decidir` (en `nacionales`, `internacionales`, `reserva` y `aMano`) trae `bajada`: la de la ficha que ya arma `preparar` (`base.bajada`, o `''`).

**Test:** un candidato con bajada «Fue con 130 votos.» sale con `bajada: 'Fue con 130 votos.'`; uno sin bajada sale con `bajada: ''`.

## Paso 3 · La página (capa 5), sobre el día de ejemplo

**Qué ve quien la usa:** una página que abre desde un link. Arriba, «Actualizada hace 12 min» y el botón «Traer noticias». Debajo, Nacionales y después Internacionales: cada noticia con una casilla, su sello, «Nueva» si no la vio antes, título, bajada y los links. Abajo de cada bloque, las 4/5 con «Llevármela igual». Una barra fija abajo: «2 elegidas · Copiar las 2». Como todavía no hay IA, se arma con el **día de ejemplo** (inventado) y lo dice arriba.

### 3a · `src/entrega.js`: `armarEntrega(decidido, { ahora, portales, reglas, ejemplo = false })`

Pura, como el núcleo (sin `Date.now()`, sin leer archivos). Recibe lo que devuelve `decidir` y devuelve:

```
{
  generadaEn: <ahora, ISO>,
  ejemplo: <true | false>,
  cupoMinimo: <reglas.cupoMinimo>,
  minGrupos: <reglas.minGrupos>,
  bloques: {
    nacional:      { tope: <decidido.cupo.nacional>,      noticias: [Tarjeta], aMano: [Tarjeta], afueraPorTope: <n> },
    internacional: { tope: <decidido.cupo.internacional>, noticias: [Tarjeta], aMano: [Tarjeta], afueraPorTope: <n> }
  },
  avisos: <decidido.avisos, copiado; por ahora la página no los muestra>
}

Tarjeta = { id, titulo, bajada, etiqueta, via ('A' | 'B' | 'mano'), grupos, medios: [nombre de grupo], links: [{ medio, url }] }
```

- `grupos` = `gruposIndependientes` de la salida de `decidir`.
- `links[].medio`: el portal se busca con la misma función del núcleo (`buscarPortal(dominioDe(link), portales)`; `dominioDe` ya se exporta, `buscarPortal` exportala sin cambiarla). Se usa su `nombre`; si no tiene, su `grupo`; si el dominio no está en la lista, el dominio tal cual.
- `medios`: el `grupo` de cada link, sin repetir, en el orden de los links (es lo que muestra «4 de 5: La Gaceta · La Nación · …»). Solo portales de la lista con `cuenta !== false` y `activo !== false`; los demás no suman nada acá. Si una nota es un cable copiado, el núcleo la cuenta para la agencia, pero acá aparece el medio: puede sobrar un nombre. Anotalo en `pendientes.md` como detalle conocido, sin arreglarlo.
- `afueraPorTope`: cuántas entradas de `decidido.reserva` de ese bloque tienen `motivo === 'cupo'`. Las que quedaron afuera por tope de sección o de país no se cuentan ni se muestran.
- Nunca sale `impacto`.

**`config/portales.json`:** agregá `"nombre"` solo donde difiere del grupo: `tn.com.ar` → `"TN"`, `ole.com.ar` → `"Olé"`, `lavoz.com.ar` → `"La Voz"`, `lnmas.com` → `"LN+"`. Nada más cambia en ese archivo.

### 3b · `pagina/logica.js`: lo que hace la página, en funciones puras

Un solo archivo que anda en el navegador (deja las funciones en `window.Logica`) y en Node (`module.exports`), para poder probarlo con `node --test`. Funciones:

- `haceCuanto(generadaEn, ahora)` → `{ texto, vieja }`. Menos de 60 min: `"hace 12 min"`, `vieja: false`. 60 min o más: `"hace 1 h 5 min"` (sin «0 min»: 120 min → `"hace 2 h"`), `vieja: true`. Menos de 1 min: `"recién"`.
- `textoParaCopiar(tarjetas)` → por cada tarjeta: el título; la bajada en el renglón siguiente si no está vacía; un renglón por link con `Medio: url`. Entre una tarjeta y otra, un renglón en blanco. Sin renglón en blanco al final. Sin el sello.
- Las marcas, en un objeto `estado = { vistas: { <url>: <ISO> }, llevadas: [ { urls: [<url>…], hora: <ISO> } ] }`:
  - `esNueva(tarjeta, estado)` → `true` si **ninguna** url de sus links está en `vistas`.
  - `llevadaA(tarjeta, estado)` → la `hora` de la primera llevada que comparte **al menos una** url con la tarjeta; si no, `null`. (Así se reconoce la misma noticia aunque el programa le cambie el id o le sume notas.)
  - `marcarVistas(tarjetas, estado, ahora)` y `marcarLlevadas(tarjetas, estado, ahora)` → un estado nuevo, sin tocar el que reciben.
  - `limpiar(estado, ahora, horas = 24)` → saca las vistas y las llevadas de más de 24 h.

### 3c · `pagina/index.html`: la página

Un solo archivo HTML con su CSS y su JS adentro, más `logica.js` al lado. Sin librerías de afuera. Pensada primero para celular (360 px de ancho) y que ande bien en compu. Español rioplatense en todos los textos.

1. **Al abrir** carga `lista.json` de la misma carpeta (`fetch('lista.json', { cache: 'no-store' })`). Si falla: «No se pudo traer la lista. Probá de nuevo en un rato.» con un botón para reintentar.
2. **Arriba:** «7M», el texto de `haceCuanto` («Actualizada hace 12 min») y el botón **«Traer noticias»**, que vuelve a cargar `lista.json` y redibuja sin perder lo tildado. Lo tildado es un conjunto de urls: una tarjeta está tildada si alguna de sus urls está ahí. Si `vieja` es `true`, un aviso ámbar: «No se actualiza desde las 14:30» (la hora de `generadaEn`). Si `ejemplo` es `true`, una franja: «Datos de ejemplo, inventados».
3. **Cada bloque** (Nacionales primero, Internacionales después):
   - Título: «Nacionales · N» o, si N es menor que `cupoMinimo`, «Nacionales · N de `cupoMinimo`» (hoy, «1 de 3»). Ningún 3 ni 5 va fijo en la página: salen de `lista.json`.
   - Si N es menor que `cupoMinimo`: aviso «N de `cupoMinimo`. No se completa con menos medios.» y, si hay 4/5 en ese bloque, se agrega «Abajo hay M a las que les falta 1.»
   - Cada noticia: casilla, el sello (la `etiqueta` tal cual: «Confirmada por N medios» o «Respaldada por …»), «Nueva» si `esNueva`, el título, la bajada y los links (el texto del link es el `medio`; abren en pestaña nueva).
   - Si `afueraPorTope` > 0: «K confirmadas más quedaron afuera por el tope de 7» (el número es el `tope` del bloque).
   - Las 4/5, **abiertas**, en una caja con borde punteado ámbar: «En observación · les falta 1 medio». Cada una: título, `${grupos} de ${minGrupos}: ` y los `medios` unidos con « · » (hoy, «4 de 5: La Gaceta · La Nación · Clarín · Página/12»), y el botón **«Llevármela igual»**, que la tilda y la suma a lo elegido; tildada, el botón dice «Sacar» y la destilda. Si el bloque no tiene 4/5, no aparece la caja.
   - Las que se llevó (`llevadaA` ≠ `null`, sean confirmadas o 4/5): al final del bloque, después de la caja de las 4/5, apagadas, con «Te la llevaste a las 12:00». Se pueden volver a tildar. **Siguen contando para el tope:** el programa no sabe qué se llevó cada persona; la página solo las baja.
4. **La barra de abajo**, fija: «N elegidas» y el botón **«Copiar las N»** (con una: «1 elegida · Copiar la 1»; apagado con 0). Al copiar: `textoParaCopiar` con las elegidas en el orden en que aparecen en la página, `navigator.clipboard.writeText`; si falla, el texto aparece seleccionado en un cuadro para copiarlo a mano. Después: `marcarLlevadas`, se destilda todo, se redibuja y aparece «Copiadas. Ya podés pegarlas.» Una 4/5 llevada se copia igual que las demás (el texto no lleva sello).
5. **«Nueva»:** al abrir se calcula con las marcas de antes, se dibuja, y recién después se guardan como vistas todas las que se mostraron. Así «Nueva» dura esa visita. Las «Nueva» de la visita quedan en memoria: al apretar «Traer noticias», una tarjeta es «Nueva» si ya lo era en esta visita o si ninguna de sus urls está en `vistas`; después se guardan como vistas.
6. **Las marcas** se guardan en `localStorage` con la clave `7m-marcas-v1`, siempre dentro de `try/catch`, y se pasan por `limpiar` al abrir. Si no hay `localStorage`, la página anda igual, sin marcas.
7. **Las horas**, en hora de Argentina: `toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit' })`.
8. **El aspecto:** sello en verde; «Nueva» como una pastilla azul; las 4/5 con borde punteado ámbar; lo llevado, apagado y con borde punteado. Que se lea bien en modo claro y oscuro.

### 3d · `scripts/armar-pagina.js` y `npm run pagina`

Corre `preparar` y `decidir` sobre el día de ejemplo con `dia.ahora` (como `ejemplos/demo.js`), y arma la entrega con `ejemplo: true` y `ahora: new Date().toISOString()`, así la página no sale «vieja». Escribe `pagina/lista.json`. Las capturas se sacan recién armada la lista. Imprime una línea por bloque: cuántas noticias, cuántas 4/5 y cuántas quedaron afuera por tope. `pagina/lista.json` **se commitea** (son datos inventados), para que Cowork pueda mostrarle la página a Alejo. Agregá `"pagina": "node scripts/armar-pagina.js"` a `package.json`.

### 3e · Tests del paso 3

- **E1** (`test/entrega.test.js`): con el día de ejemplo, la cantidad de noticias de cada bloque es igual a la de `decidir`; cada tarjeta tiene `titulo`, `bajada` (texto, puede ser vacío) y `links` con `medio`; ninguna tiene `impacto`.
- **E2:** un link de `tn.com.ar` sale con medio «TN»; uno de `clarin.com`, «Clarín»; uno de `ejemplo.com` (fuera de la lista), «ejemplo.com». En `medios`, TN y Clarín juntos dan un solo «Clarín».
- **E3:** `afueraPorTope` cuenta solo las de `motivo: 'cupo'` (armá una reserva con una de cupo y una de `tope_seccion (economía)`: da 1).
- **L1** (`test/logica.test.js`), entrada y salida exactas (datos inventados):

  Entrada:
  ```
  [
    { titulo: 'Diputados aprobó el Presupuesto', bajada: 'Fue con 130 votos.', links: [ { medio: 'Clarín', url: 'https://www.clarin.com/a' }, { medio: 'La Nación', url: 'https://www.lanacion.com.ar/b' } ] },
    { titulo: 'Suben la luz y el gas', bajada: '', links: [ { medio: 'Infobae', url: 'https://www.infobae.com/c' } ] }
  ]
  ```
  Salida:
  ```
  Diputados aprobó el Presupuesto
  Fue con 130 votos.
  Clarín: https://www.clarin.com/a
  La Nación: https://www.lanacion.com.ar/b

  Suben la luz y el gas
  Infobae: https://www.infobae.com/c
  ```
- **L2:** tarjeta con urls `u1` y `u2`; `vistas` tiene `u2` → `esNueva` da `false`. Con `vistas` vacío → `true`.
- **L3:** `llevadas` tiene `{ urls: ['u1', 'u2'], hora: H }`; una tarjeta nueva con urls `u2` y `u3` (la misma noticia, recalculada) → `llevadaA` da `H`. Una con `u4` → `null`.
- **L4:** `limpiar` saca una vista de hace 25 h y deja una de hace 23 h; igual con las llevadas.
- **L5:** `haceCuanto` con 12 min → `"hace 12 min"`, `vieja: false`; con 65 min → `"hace 1 h 5 min"`, `vieja: true`; con 120 min → `"hace 2 h"`.

### 3f · Para que Alejo la vea

Si en tu entorno hay Chromium con Playwright, serví la carpeta `pagina/` en un puerto local y sacá **dos capturas**: 390 px de ancho y 1200 px, modo claro, con una noticia tildada y una 4/5 tildada con «Llevármela igual». Guardalas en `buzon/capturas/pagina-2026-10-04-390.png` y `buzon/capturas/pagina-2026-10-04-1200.png`. Si no hay Chromium, decilo en el reporte y seguí: Cowork la publica desde el repo. En el día de ejemplo las bajadas están vacías y `afueraPorTope` da 0: las capturas no van a mostrar esas dos cosas. Decilo en el reporte y **no toques el día de ejemplo** (cambiaría el agrupado).

## Paso 4 · Las piezas de la IA, sin llamar a ningún modelo

**Qué cambia:** nada que se vea. Quedan listas, con pruebas, las piezas que van alrededor de la IA: qué pares se le preguntan, cómo se unen los hechos que dice que son la misma noticia, el texto exacto de las preguntas, cómo se lee lo que contesta, qué posibles desmentidos se le muestran y cómo se reconoce lo que ya juzgó. La llamada al modelo la arma Don Julio en n8n (capa 4).

### 4a · `src/nucleo.js`: la ficha lleva fecha y firma de cada nota

En `preparar`, cada nota de `ficha.notas` suma `fecha` y `firma` (la de la nota, o `''`). No cambia ninguna cuenta: los tests que ya había pasan sin tocarlos, y `npm run demo` da exactamente igual que al terminar el paso 2. Exportá también `buscarPortal`, `STOP` y la función que arma cada hecho a partir de un grupo de notas, si la sacás aparte (ver 4d).

### 4b · `config/reglas.json`: sección nueva `ia`

```
"ia": {
  "deportes": true,
  "farandula": false,
  "palabrasDesmentido": ["desmintio", "desmiente", "desmienten", "desmintieron", "es falso", "falso que", "fake", "no es cierto"],
  "maxDesmentidos": 5
}
```

`deportes: true` es el **valor por defecto mientras Alejo decide** (él dijo el 04-10, cuando se sacaron las notas de servicio: «los resultados de los partidos siguen entrando»). Las palabras van sin tildes porque se comparan con `normalizar`.

### 4c · `src/ia.js`: `palabrasPropias(titulos)`

Es la regla del paso 3 de la carta `PREPARADOR_para_ClaudeCode_2026-10-04_c.md`, ahora dentro del repo. Se miran los títulos de **todas** las notas del hecho. Cuenta una palabra si:

- empieza con mayúscula;
- no es la primera del título, ni la primera después de `:`, `.`, `?`, `!`, `|`, `—`, ni la primera después de un `¿`, `¡` o comillas que abren;
- sin tildes y en minúsculas tiene 3 letras o más y no está en `STOP`;
- si está toda en mayúsculas, no es ninguna de estas: VIVO, HOY, ULTIMO, ULTIMA, URGENTE, VIDEO, FOTOS, MINUTO.

Cómo se hace, para que la regla de «primera después de `:`» no se pierda: partí cada título por espacios. Un pedazo es «primero» si es el primero del título, si el pedazo anterior termina en `:`, `.`, `?`, `!`, `|` o `—` (o es solo ese signo), o si él mismo empieza con `¿`, `¡`, `«`, `“`, `‘`, `"` o `'`. Recién después se le sacan los signos de los bordes (`¿¡"'“”‘’«»():;,.!?…`) y se mira el resto de la regla. Se devuelven sin tildes y en minúsculas, sin repetir, en el orden en que aparecen.

Ejemplos (títulos reales del 04-10):

- «EN VIVO | Elecciones en Brasil: comienza el escrutinio y Lula habla con la prensa a las 19» → `brasil`, `lula`.
- «Fórmula 1: qué dijo Colapinto luego de finalizar 13° en el Gran Premio de Malasia» → `colapinto`, `gran`, `premio`, `malasia`.

### 4d · `src/ia.js`: `paresParaUnir(preparado, { portales, reglas })` y `unirHechos(preparado, uniones, { portales, reglas, firmas, ahora })`

En todo el paso 4, «los grupos» de un conjunto de notas son `gruposIndependientes(notas, portales).cantidad` (la función del núcleo; no confundir con el campo `gruposIndependientes` de un hecho, que es un número).

**Qué hechos entran a los pares:**

- de `preparado.enObservacion`, los que tienen `gruposIndependientes` 3 o 4 (son frescos por definición);
- de `preparado.candidatos`, los de vía A (5 o más), **solo como pareja** de uno de 3 o 4. Dos candidatos nunca forman un par.

**Qué es un par:** dos de esos hechos que comparten al menos una palabra propia y cuya `primera` está a menos de `reglas.ventanaMismoHechoHoras` una de otra. Cada par sale como `{ a: <id>, b: <id>, comunes: [palabras], gruposUnion: <n> }`, donde `gruposUnion` se cuenta con `gruposIndependientes` sobre las notas de los dos (Clarín en los dos vale 1). Salen ordenados por `gruposUnion`, de más a menos.

**`unirHechos(preparado, uniones, { portales, reglas, firmas, ahora })`**, con `uniones = [{ a, b, porQue }]` (solo las que la IA contestó que sí). Devuelve un `preparado` nuevo, sin tocar el que recibe:

- Junta de a grupos: si A va con B y B con C, quedan A, B y C en un solo hecho.
- **Excepción:** si una cadena juntaría dos candidatos (candidato 1 – hecho de 3 – candidato 2), el hecho de 3 o 4 se une solo al candidato con más grupos (si empatan, al de `primera` más vieja), los dos candidatos quedan separados y se suma un aviso a `avisos`: «La IA unió un hecho con dos noticias ya confirmadas: <título 1> y <título 2>. Se unió solo a la primera.»
- Las notas del hecho unido: todas, sin repetir por `id`, ordenadas por `fecha` y, si empatan, por `id` (como `agrupar`). El `id` es el del hecho con la `primera` más vieja; `titulo` y `bajada` salen de la primera nota de esa lista ordenada (como en `preparar`), y se agrega `unidoPorIA`: la lista de los `porQue`.
- Los grupos se **vuelven a contar** sobre todas las notas. Nunca se suman.
- El hecho unido se vuelve a clasificar **con la misma función que usa `preparar`**: vía A, vía B, a mano, en observación o descartado por viejo. No copies la lógica: sacá de `preparar` la parte que arma y clasifica un hecho a una función aparte y usala en los dos lados, sin cambiar ningún resultado.
- Si uno de los hechos ya era candidato, el unido sigue siendo candidato (con los grupos recontados) y el otro desaparece de donde estaba.
- `resumen`: `notasEntrada`, `fueraDeVentana` y `notasDescartadas` quedan igual; `hechos` baja 1 por cada hecho absorbido; `enObservacion`, `elegiblesAMano`, `candidatos` y `viaB` toman los largos nuevos.

**Ejemplos (para los tests, con datos inventados que imiten estos casos reales):**

- **Colapinto:** dos hechos de 4 grupos, de los cuales 3 grupos se repiten (La Gaceta, La Nación, Clarín, Página/12 contra La Capital, Clarín, Página/12, La Nación). La unión da **5 grupos**: el hecho pasa a `candidatos` y los dos salen de `elegiblesAMano`.
- **Escrutinio con la confirmada:** un hecho de 3 grupos («EN VIVO | Elecciones en Brasil: comienza el escrutinio…») y un candidato de 6 («Tras el cierre de los comicios, Lula Da Silva y Flávio Bolsonaro disputan voto a voto»). Unidos, queda **un solo candidato** con 6 o más grupos y el de 3 desaparece de `enObservacion`.

### 4e · `src/ia.js`: las preguntas y cómo se leen las respuestas

**`preguntaUnion(par, preparado, { portales })`** devuelve este texto, con los dos hechos al final (una línea por nota: `- Medio · dd/mm hh:mm · título · bajada`, hora de Argentina, el medio con el mismo criterio que `links[].medio` del paso 3; sin bajada, la línea termina en el título, sin « · » al final):

```
Sos el editor que revisa noticias para 7M. Te paso dos hechos, cada uno con las notas de distintos medios que lo cuentan. ¿Son la misma noticia?

Son la misma noticia si cuentan el mismo hecho: la misma gente, lo mismo que pasó, el mismo día. No alcanza con que sean del mismo tema.
Ejemplos: «Aprobaron el Presupuesto» y «Qué cambia con el Presupuesto aprobado» son la misma noticia. «Anuncian un paro de colectivos para el jueves» y «Se levantó el paro de colectivos» no lo son: anunciar no es levantar.

Contestá solo con un JSON, sin texto antes ni después:
{"misma": true o false, "porque": "una línea"}

Hecho A:
…
Hecho B:
…
```

**`leerUnion(texto)`** → `{ misma, porQue }` o `null`. Acepta el JSON solo o dentro de un bloque ```json. `misma` tiene que ser `true` o `false` (no texto) y `porque`, un texto; si falta alguno, `null`. Cualquier otra cosa da `null`, y `null` se trata como «no».

**`preguntaJuicio(hecho, { portales, reglas, desmentidos })`** devuelve este texto, con el hecho al final (mismas líneas por nota) y las frases entre corchetes según la config:

```
Sos el editor que revisa noticias para 7M. Te paso un hecho: las notas de distintos medios que lo cuentan. Contestá solo con un JSON, sin texto antes ni después.

1. datoNuevo: ¿las notas de las últimas 24 horas cuentan el hecho por primera vez o traen un dato nuevo sobre él? true o false.
2. fuenteConNombre: false si alguna nota dice «trascendió», «habría», «según fuentes», «se especula» o algo parecido, o si el hecho depende de alguien que nadie nombra. true si la fuente está nombrada o el hecho se ve por sí mismo (un resultado, una votación, un discurso público).
3. interesPublico: true si es un asunto público: gobierno, economía, derechos, seguridad, salud, justicia, servicios, clima extremo o conflictos. false si es un chimento o un viral. [Los deportes cuentan como interés público. | Los deportes no cuentan como interés público.] [La farándula también cuenta. | La farándula no cuenta.]
4. bloque: "nacional" si el hecho pasó en Argentina y le importa a alguien de otra provincia; "internacional" si pasó fuera de Argentina y toca a Argentina o a la región, o tiene alcance mundial; null si no es ninguna. Se decide por el lugar donde pasó, no por quién lo protagoniza: un argentino que juega, viaja o habla afuera va a "internacional".
5. desmentido: true si la fuente original lo desmintió o un chequeador lo marcó como falso. Mirá también estas notas de las últimas 48 horas: [un renglón por cada posible desmentido, con el mismo formato de línea | ninguna]. Si nada lo desmiente, false.
6. seccion: una palabra: política, economía, sociedad, salud, deportes, cultura, tecnología, policiales, mundo u otra.
7. pais: si es internacional, el país donde pasó; si no, "".
8. porque: una línea por cada respuesta que deja la noticia afuera, por ejemplo {"interesPublico": "es un chimento de TV"}. {} si todo pasa.

Formato:
{"datoNuevo": true, "fuenteConNombre": true, "interesPublico": true, "bloque": "nacional", "desmentido": false, "seccion": "economía", "pais": "", "porque": {}}

Hecho:
…
```

**`leerJuicio(texto)`** → `{ datoNuevo, fuenteConNombre, interesPublico, bloque, desmentido, seccion, pais, porQue }` o `null`. Acepta el JSON solo o dentro de un bloque ```json. Los cuatro sí/no tienen que ser `true` o `false`; `bloque` tiene que ser `"nacional"`, `"internacional"` o `null` (acepta mayúsculas y lo pasa a minúsculas); `seccion` y `pais`, texto; `porque`, un objeto (si falta, `{}`). Si falta algo o no cumple, `null`: para `decidir` es un hecho `sin_juicio`, que no sale.

### 4f · `src/ia.js`: `posiblesDesmentidos(hecho, notas, { reglas })`

De `notas` (todo lo acumulado, 48 h), las que en el título normalizado tienen alguna de `reglas.ia.palabrasDesmentido` como palabra o frase entera (no adentro de otra palabra) **y** comparten al menos una palabra propia con el hecho. Pueden ser del propio hecho. Sin repetir, las más nuevas primero, hasta `reglas.ia.maxDesmentidos`.

Ejemplo (inventado, del borrador del núcleo): hecho «El Gobierno elimina el aguinaldo»; nota «El Gobierno desmintió que vaya a eliminar el aguinaldo» → sale (comparten `gobierno`). Nota «Desmienten un caso de dengue en Salta» → no sale (no comparten palabra propia).

### 4g · `src/ia.js`: lo que ya se juzgó

Lo juzgado se guarda donde diga Don Julio; acá solo las funciones puras. Cada guardado: `{ urls: [<url>…], juicio, fecha, desmentidosVistos: [<url>…] }`.

- `buscarGuardado(hecho, guardados)` → el primero que comparte **al menos una url** con las notas del hecho, o `null`.
- `hayQueVolverAPreguntar(hecho, guardado, desmentidos)` → `true` si no hay guardado, o si alguno de los `desmentidos` tiene una url que no está en `guardado.desmentidosVistos`. Si no, `false`: se usa el juicio guardado.

### 4h · `test/casos-ia.json`: casos para probar el modelo cuando exista

No los usa ningún test de hoy: son para medir al modelo de verdad más adelante. Tomá los títulos **completos** de `datos/notas.json`; si no está, dejá los de esta carta y poné `"incompleto": true` en los que terminan en «…».

```
{
  "union": [
    { "a": "Fórmula 1: qué dijo Colapinto luego de finalizar 13° en el Gran Premio de Malasia", "b": "Una carrera loca que Franco Colapinto terminó con mucha dignidad en Sepang…", "misma": true },
    { "a": "EN VIVO | Elecciones en Brasil: comienza el escrutinio y Lula habla con la prensa a las 19…", "b": "A la espera de los primeros resultados, Milei sigue con optimismo la elección en Brasil y respaldó a Bolsonaro…", "misma": false },
    { "a": "EN VIVO | Elecciones en Brasil: comienza el escrutinio y Lula habla con la prensa a las 19…", "b": "Tras el cierre de los comicios, Lula Da Silva y Flávio Bolsonaro disputan voto a voto…", "misma": true },
    { "a": "Diputados empezó a debatir el Presupuesto", "b": "Diputados aprobó el Presupuesto", "misma": false, "inventado": true }
  ],
  "bloque": [
    { "titulo": "Fórmula 1: qué dijo Colapinto luego de finalizar 13° en el Gran Premio de Malasia", "bloque": "internacional" },
    { "titulo": "A la espera de los primeros resultados, Milei sigue con optimismo la elección en Brasil y respaldó a Bolsonaro…", "bloque": "nacional" },
    { "titulo": "Tras el cierre de los comicios, Lula Da Silva y Flávio Bolsonaro disputan voto a voto…", "bloque": "internacional" }
  ]
}
```

Los ejemplos que van **dentro** de `preguntaUnion` (Presupuesto aprobado, paro de colectivos) son otros a propósito: si fueran los mismos, la prueba no mediría nada.

### 4i · Tests del paso 4 (`test/ia.test.js`, datos inventados)

- **I1:** `palabrasPropias`, una llamada por cada título de 4c, da exactamente esas palabras y en ese orden.
- **I2:** `paresParaUnir` con un `preparado` armado a mano (no con `preparar`, para que el agrupador no junte nada), con notas que tengan `id, titulo, bajada, url, portal, fecha, firma`. Cinco hechos: dos de 4 grupos con «Colapinto» (nunca como primera palabra del título); uno de 3 con «Lula»; un candidato de 6 con «Lula» y «Milei»; otro candidato de 6 con «Milei» y «García Cuerva». Salen **2 pares**: los de Colapinto, y el de 3 con el candidato de «Lula». Los dos candidatos comparten «Milei» y aun así no salen juntos.
- **I3:** `unirHechos` con el caso Colapinto da 5 grupos y lo pasa a `candidatos` (el `id` es el del hecho más viejo).
- **I4:** unión de a tres (A con B y B con C) da un solo hecho.
- **I5:** `unirHechos` con el caso del escrutinio y la confirmada deja un solo candidato.
- **I6:** `leerUnion`: `{"misma": true, "porque": "la misma carrera"}` → `{ misma: true, porQue: 'la misma carrera' }`; lo mismo dentro de ```json → igual; `Sí, son la misma` → `null`; `{"misma": "si"}` → `null`.
- **I7:** `leerJuicio`: uno válido → el objeto; con `"bloque": "Nacional"` → `'nacional'`; sin `desmentido` → `null`.
- **I8:** `preguntaJuicio` con `ia.deportes: true` contiene «Los deportes cuentan como interés público.»; con `false`, «Los deportes no cuentan como interés público.». Sin desmentidos contiene «ninguna».
- **I9:** `posiblesDesmentidos` con los dos ejemplos de 4f.
- **I10:** `buscarGuardado` lo encuentra por una url compartida; `hayQueVolverAPreguntar` da `true` con un desmentido nuevo y `false` sin desmentidos nuevos.

## Paso 5 · Mediciones (scripts de una sola vez, fuera del repo, sin commitear)

Sobre `datos/notas.json`, con el filtro de rutas de Infobae puesto. No hace falta leer los portales salvo en M2. Si `datos/notas.json` no está (va en `.gitignore`), decilo en el reporte, salteá M1 y M3 y hacé M2.

**M1 · ¿Cambia el id de un hecho entre una vuelta y la siguiente?** «Nueva», «Te la llevaste» y lo juzgado por la IA necesitan reconocer el mismo hecho cada 30 minutos. Para cada instante `t`, desde 6 h después de la nota más vieja hasta la más nueva, cada 30 minutos: las notas con `fecha` ≤ `t`, `preparar` con `ahora = t`. Tomá los hechos con 4 o más grupos. Compará cada uno con los de la vuelta anterior (`t` − 30 min) y contalo en una sola de estas: **(a)** mismo `id`; **(b)** otro `id`, pero comparte al menos una url con un hecho de la vuelta anterior; **(c)** no comparte nada (nuevo). En el reporte: cuántas vueltas, los totales de a, b y c, y cada caso b (título, `id` antes y después y, si se ve, por qué cambió). Aclaración: `fecha` no es el momento en que se leyó la nota; es una aproximación.

**M2 · ¿Chequeado tiene feed?** Con `NODE_USE_ENV_PROXY=1`, probá `https://chequeado.com/feed/`. Si no anda, buscá en el HTML de la portada un `<link>` con `application/rss+xml`; si tampoco, decilo y pará. Si anda: cuántas notas trae, cuántas horas cubre y 3 títulos de ejemplo. **No lo sumes** a `config/`.

**M3 · Los pares con la regla nueva.** Con `paresParaUnir` del paso 4 sobre lo guardado (`ahora` = la nota más nueva): cuántos hechos entran, cuántos pares hay entre hechos de 3 o 4 y cuántos con un candidato. Para cada par (si son más de 40, los 40 con más `gruposUnion`): los dos títulos base, los grupos de cada uno, las palabras en común, `gruposUnion`, si llega a 5, y tu juicio a ojo con la definición de Alejo (mismo hecho: la misma gente, lo mismo que pasó, el mismo día): sí, no o dudoso. **Controles:** sale el par de Colapinto con 5; sale el escrutinio con «voto a voto» (con el candidato); y si sale escrutinio con Milei, tu juicio tiene que ser «no».

## Paso 6 · Documentos y cierre

**`CLAUDE.md`:**

- «Lo que Alejo pidió el 2026-10-04», un ítem por cada decisión de la tabla de arriba (1.1 a 1.5, 2.1 a 2.4, 3.1 y lo que queda con el valor por defecto), con lo descartado.
- «Hechos partidos»: la definición de Alejo (el mismo hecho), que el par escrutinio + Milei es «no», y que la IA también compara un hecho de 3 o 4 con los ya confirmados (valor por defecto de Cowork).
- «Decisiones que solo Alejo puede tomar»: salen «qué ordena el top» (cantidad de medios), «argentinos afuera» (por lugar) y «horarios de las corridas» (no hay: siempre lo último). «Deportes y espectáculos» queda, con «por defecto: deportes sí (`ia.deportes`), farándula no».
- «Estado»: tests al día, `npm run pagina`, `src/entrega.js`, `pagina/`, `src/ia.js`, y que la IA todavía no se llama.
- «Siguiente paso»: la capa 4 con Don Julio (dónde corre, dónde se guarda, dónde vive la página, la cuenta de la IA). Las preguntas para Don Julio están en `buzon/pendientes.md`.

**`buzon/pendientes.md`:**

- **A Hecho**, con fecha 04-10 y «decidió Alejo: valor por defecto»: feeds por sección de Infobae (no se suman); las 14 notas de otras ediciones de Infobae (no se tocan); reglas viejas `quiniela` y `horoscopo` (quedan como están); variantes de servicio (no se suma ninguna).
- **A Hecho:** «Diseñar la entrega» (con las 5 decisiones) y «Diseñar las 6 preguntas» (con las decisiones 2.1, 2.3, 2.4 y lo hecho en el paso 4).
- **A Hecho:** «Memoria de lo ya entregado»: se resolvió en la página (marcas por persona en su navegador, 24 h), no en el motor.
- **A Hecho:** «Decidir las ventanas de tiempo para corridas cada 4 horas»: no hay corridas cada 4 h (la lista se rehace cada 30 min); quedan 48 h y 24 h.
- «Hechos partidos»: corregí «la jornada electoral de Brasil (…) misma noticia: sí» por «**no** (decidió Alejo el 04-10: el mismo hecho, no el mismo tema)», y sumá los números de M3.
- **Alejo:** «Deportes y espectáculos: pendiente. Por defecto: deportes sí, farándula no (`config/reglas.json`, `ia`).»
- **Capa 4 (Alejo con Don Julio)**, reemplaza «Guardar lo leído entre corridas»: dónde corre n8n (por defecto: Cloud Starter, €20 por mes, 2.500 ejecuciones; leer cada 30 min son 1.440 por mes), dónde se guarda lo acumulado + la última lista + lo juzgado, dónde vive la página para que verla no gaste ejecuciones y con un link secreto por cliente, qué cuenta de IA (por defecto Claude Haiku 4.5, entre US$1 y 5 por mes) y quién la paga, cómo avisa si una lectura falla, y separar pruebas de lo real. Ojo: n8n 3.0 sale en octubre de 2026 y en servidor propio exige Docker. Datos de n8n y de la IA consultados por Cowork el 04-10 en sus páginas oficiales.
- **Más adelante:** que las personas de un mismo canal vean lo que se llevó cada una (hace falta saber quién es quién); un aviso de «hay nuevas»; noticias reales en la página cuando exista la IA.
- **Cowork:** revisar las capturas de la página y el resultado de M1 (si muchos hechos cambian de id, la regla de «comparte una url» se pone a prueba).

**Reporte** `ClaudeCode_para_Cowork_2026-10-04_a.md`, con el formato de `LEEME_CLAUDECODE.md`: tests antes y después, la tabla de tests reescritos del paso 1, la demo antes y después, la salida de `npm run pagina`, las capturas (o por qué no) y M1, M2 y M3. Después `npm run paquete`, commit y push.

## Qué NO se hace en esta ronda

- Llamar a un modelo de IA de verdad, ni guardar claves.
- n8n, dónde se guardan las cosas, dónde vive la página, el link secreto: es la capa 4, con Don Julio.
- Noticias reales en la página: sin IA no hay juicios. La página usa el día de ejemplo.
- Sumar Chequeado a `config/` (solo se prueba).
- Tocar el agrupador, `minGrupos`, las ventanas de 48 h y 24 h, las rutas de Infobae o del Cronista, las reglas viejas o los moldes.
- Que las personas del canal compartan lo que se llevó, o un aviso de nuevas.

## De quién es cada decisión y qué se usa mientras tanto

| Tema | Quién decide | Valor en esta ronda |
|---|---|---|
| Página, siempre lo último, marcar, hasta 7, 4/5 abiertas | Alejo (decidido) | como en la tabla de arriba |
| Orden por cantidad de medios | Alejo (decidido) | empate: la más nueva (Cowork) |
| Misma noticia = el mismo hecho | Alejo (decidido) | — |
| Comparar también un hecho de 3 o 4 con los confirmados | Cowork | sí |
| Una cadena que juntaría dos confirmadas | Cowork | el hecho de 3 o 4 va solo con la de más grupos, y se avisa |
| Argentinos afuera, por lugar | Alejo (decidido) | — |
| Deportes y espectáculos | Alejo (pendiente) | deportes sí, farándula no |
| Dónde corre n8n | Alejo con Don Julio (pendiente) | Cloud Starter; no toca código |
| Texto que copia, sello, horas, «Nueva» por visita, marcas 24 h, aviso de 1 h | Cowork | como en el paso 3 |
| Lo llevado sigue contando para el tope | Cowork | sí (el programa no sabe quién se llevó qué) |
| Qué lee la IA, fuente con nombre adaptada a título y bajada, desmentidos, volver a preguntar | Cowork | como en el paso 4 |
| Nombres de TN, Olé, La Voz y LN+ | Cowork | como en 3a |
| Cómo se reorganiza `preparar` para no duplicar la clasificación | Claude Code | sin cambiar ningún resultado |

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1: `npm test`, la demo antes y después, commit.
3. Paso 2: `npm test`, commit.
4. Paso 3: `npm test`, `npm run pagina`, las capturas, commit.
5. Paso 4: `npm test`; `npm run demo` sale igual que al terminar el paso 2 (comparalo con `diff`); commit.
6. Paso 5 (nada se commitea).
7. Paso 6: reporte `a`, `npm run paquete`, commit y push.

Si te quedás sin lugar en el chat, cerrá en el paso que hayas terminado: reporte con lo hecho y lo que faltó, `pendientes.md` al día, `npm run paquete`, commit y push. Lo que falte va primero en la próxima carta.
