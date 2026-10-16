# Cowork → Claude Code · 16-10-2026 · 17:06 (hora de Argentina) · letra b

Responde a tu reporte `ClaudeCode_para_Cowork_2026-10-16_a.md`. Alejo decidió el 16-10 (16:53): **ids por la B** (la medición cuenta por link; además queda como regla del proyecto que nada se guarda por id de hecho, todo por link), **Avisos arrancan con lo legible** (eso va en la carta `c`, no acá) y **esta carta lleva solo lo chico y ya probado**: la zona dentro de la capa 4, el arreglo del molde del pronóstico, los links en `vueltas.jsonl` para que `medir` cuente bien, y un documento con el «paquete de cliente». Base: commit `63d3fc4` de la rama `claude/trusting-knuth-brmpsy`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-16_b.md`. Una sola fase, un solo reporte: `buzon/ClaudeCode_para_Cowork_2026-10-16_b.md`.

**Qué pasó:** los anillos Comodoro y Chubut ya andan en `npm run vuelta -- --zona config/zona` (tu reporte `a`), pero la capa 4, que es lo que va a correr en el servidor de Don Julio, sigue mostrando solo Nacionales e Internacionales. Como el servidor se instala una sola vez, los cuatro bloques tienen que estar en la capa 4 **antes** de ese día. **Al final de esto, la vuelta de n8n hace lo mismo que `npm run vuelta -- --zona config/zona`**: lee los 19 feeds nacionales y los 8 de la zona, verifica, cruza, y escribe una `lista.json` con `orden` de cuatro; y `npm run medir` ya no cuenta dos veces un hecho que cambió de id.

| Paso | Qué cambia | Archivos que se tocan |
|---|---|---|
| 1 | `mitadUno` y `mitadDos` corren la zona, sin IA, como lo hace `scripts/vuelta.js` | `src/capa4.js`, `test/capa4.test.js` |
| 2 | El workflow de la vuelta baja también los feeds de la zona y le pasa la zona a las dos mitades | `n8n/vuelta.json`, `n8n/LEEME.md`, `test/n8n.test.js` |
| 3 | El molde «pronóstico del tiempo» no se come las listas de películas | `config/reglas.json`, `test/nucleo.test.js` |
| 4 | Cada hecho de `vueltas.jsonl` lleva sus links; `medir` cuenta por link | `scripts/vuelta.js`, `src/capa4.js`, `src/zona.js` (una línea), `scripts/medir.js`, `test/vuelta.test.js`, `test/capa4.test.js`, `test/zona.test.js`, `test/medir.test.js` |
| 5 | El paquete de cliente, documentado | `docs/PAQUETE_DE_CLIENTE.md` (nuevo) |
| 6 | Documentos y pendientes | `docs/INSTALAR_EN_EL_SERVIDOR.md`, `CLAUDE.md`, `buzon/pendientes.md`, reporte, paquete |

**No se tocan:** `src/nucleo.js`, `src/entrega.js`, `src/provisorio.js`, `src/ia.js`, `src/lector.js`, `pagina/`, `scripts/servir.js`, `scripts/usuario.js`, `scripts/ia-falsa.js`, `scripts/leer.js`, `config/feeds.json`, `config/portales.json`, `config/firmas.json`, `config/zona/*`, `n8n/correo.json`, `n8n/error.json`, `n8n/prueba-union.json`, `docs/CORRER_EN_MI_COMPU.md`, `.gitignore`, `.github/`, los `buzon/LEEME*.md`, las cartas y reportes viejos, las capturas. **Nada de avisos de cortes en esta carta** (carta `c`).

**Regla de toda la ronda:** nada de lo que sale de los portales entra al repo; lo real vive en `datos/` y en los datos estáticos de n8n. En el reporte van números y títulos, nunca bajadas ni cuerpos.

## Qué decidió Alejo y qué es valor por defecto

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Los ids: opción B. La medición reconoce un hecho por sus links, no por su id. **Regla del proyecto desde hoy: nada se guarda por id de hecho; lo que necesite reconocer «la misma noticia» usa sus links** (la página y `src/ia.js` ya lo hacen así) | Alejo (16-10, 16:53) | paso 4, y la regla escrita en `CLAUDE.md` |
| Esta carta no toca los avisos de cortes; van en la carta `c` | Alejo (16-10) | — |
| La zona corre en la capa 4 **sin juicio de la IA** por ahora: sus hechos no se le preguntan a la IA; el cruce «también nacional» saca el relleno. Preguntarle a la IA por la zona (bloque, tema) es de la etapa 2 | Cowork (valor por defecto) | paso 1 |
| Las notas de la zona viven en los datos estáticos de n8n junto con las nacionales (`guardado.zona.notas`), con la misma ventana de 48 h | Cowork (valor por defecto) | paso 1 |
| En el nodo Rutas, `configZona` vacío apaga la zona y la vuelta es exactamente la de hoy | Cowork (valor por defecto) | paso 2 |
| El molde del pronóstico no aplica si el título habla de «qué ver», Netflix, series o películas | Cowork (valor por defecto) | paso 3 |
| `medir` cuenta por link solo cuando la línea trae `urls`; las líneas viejas (sin `urls`) se cuentan por id como hasta hoy | Cowork (valor por defecto) | paso 4 |

## Paso 1 · `src/capa4.js`: la zona en las dos mitades

Las dos mitades suman un parámetro opcional `zona`, con la misma forma que recibe `vuelta()` de `scripts/vuelta.js`: `{ feeds, portales, reglas }` (lo que devuelve `cargarConfig('config/zona')`), o `null`. Sin `zona`, **todo sale byte por byte igual que hoy**: los tests que ya existen no cambian.

**`mitadUno({ cuerpos, guardado, ahora, feeds, portales, reglas, firmas, zona })`.** `cuerpos` viene en el orden de los ítems del nodo Feeds: primero los feeds nacionales con `url`, después los de la zona con `url` (paso 2). Con `zona`, los primeros `feeds.filter(f => f.url).length` cuerpos son nacionales y el resto son de la zona. Para la zona hace lo mismo que para lo nacional, por separado: `armarLectura(cuerposZona, zona.feeds, { ahora })`, `filtrarRutas` sobre `guardado.zona.notas` (o `[]`), `acumular` con `zona.reglas`. **No prepara la zona ni arma preguntas por ella.** Devuelve, además de lo de hoy:

- `guardado.zona`: `{ notas: acumuladoZona.notas }` (si no hay zona, no existe la clave `zona` en `guardado`).
- `lectura.zona`: `{ feeds: lecturaZona.feeds, avisos: lecturaZona.avisos }` (sin notas: pesan).
- `acumulado.zona`: `{ agregadas, repetidas, borradas: [ids] }`, igual que lo nacional.

**`mitadDos({ guardado, lectura, acumulado, respuestas, ahora, feeds, portales, reglas, firmas, zona })`.** Después de `decidir` y antes de `armarEntrega`, con `zona`:

1. `notasZona = filtrarRutas(guardado.zona.notas || [], zona.feeds).notas`.
2. `pZona = preparar(notasZona, { portales: zona.portales, reglas: zona.reglas, firmas: [], ahora })`.
3. `z = decidirZona(pZona, { portales: zona.portales, reglas: zona.reglas, hechosNacionales: [...p.candidatos, ...p.enObservacion] })` (`p` es el `preparar` nacional de esa mitad; `decidirZona` se importa de `src/zona.js`).
4. `armarEntrega(d, { …lo de hoy, zona: { ...z, portales: zona.portales } })`.
5. La línea lleva `zona` con la misma forma que la de `scripts/vuelta.js` (su `armarLinea` ya la arma: copiá esa parte a la copia de `armarLinea` que vive en `capa4.js`, como está copiado lo demás; no importes nada de `scripts/`).
6. `guardado.zona` vuelve igual que entró (`{ notas: notasZona }`).

`provisorias` y `sinIA` siguen contando solo lo nacional e internacional (la zona no pasa por la IA, así que no es «provisoria»: es sin IA por diseño). `resumenEnPantalla` de `capa4.js` suma los dos renglones de zona como el de `vuelta.js` (recibe `anillos`).

### 1a · Ejemplos (entrada → salida)

**E1 · mitadUno con zona.** 19 feeds nacionales con `url` y 8 de zona; `cuerpos` de 27, los 8 últimos con el XML de un feed inventado de `adnsur.com.ar` con 2 notas → `guardado.zona.notas` tiene 2 notas, `lectura.zona.feeds` tiene 8 entradas, `acumulado.zona.agregadas` tiene 2 ids, `preguntas` no incluye ningún hecho de zona, y lo nacional (`guardado.notas`, `preguntas`, `resumen`) es idéntico a correr `mitadUno` sin `zona` con los primeros 19 cuerpos.

**E2 · mitadDos con zona.** `guardado.zona.notas` con dos notas de la misma noticia (El Comodorense y El Patagónico, títulos de E1 de la carta `a`), `respuestas` vacías → `lista.orden` es `["local", "chubut", "nacional", "internacional"]`, `lista.bloques.local.noticias` tiene 1 tarjeta con `medios` `['El Comodorense', 'El Patagónico']`, `linea.zona.lista.local` es 1, y `guardado.zona.notas` sigue con las 2 notas.

**E3 · sin zona.** Las mismas llamadas sin `zona` (o con `zona: null`) → `guardado` sin clave `zona`, `lista.orden` `["nacional", "internacional"]`, `linea` sin `zona`. Los tests de hoy de `capa4.test.js` lo cubren: no los toques, agregá E1 y E2.

**E4 · también nacional en la capa 4.** Dos notas de zona del riesgo país (E4 de la carta `a`) y, en `guardado.notas`, tres notas nacionales del mismo hecho (tres portales distintos de la lista blanca) → la zona no muestra el hecho; `linea.zona.confirmados[0].tambienNacional` es `true`.

### 1b · Tests en `test/capa4.test.js`

E1, E2 y E4, uno por test. E3 ya está.

## Paso 2 · `n8n/vuelta.json`

- Nodo **Rutas** (Edit Fields): un campo más, `configZona`, con valor `config/zona`. Vacío (`""`) quiere decir sin zona.
- Nodo **Feeds** (Code): si `rutas.configZona` no está vacío, además de `config/feeds.json` lee `<carpetaRepo>/<configZona>/feeds.json` y emite **primero** los nacionales con `url`, **después** los de la zona con `url`, cada ítem con `origen: 'nacional' | 'zona'`. Sin `configZona`, exactamente lo de hoy.
- Nodo **Bajar**: no cambia (baja un ítem por feed, en orden).
- Nodo **Preparar** (Code): arma `zona` con `cargarConfig` a mano (leer `feeds.json`, `portales.json` y `reglas.json` de `<carpetaRepo>/<configZona>`; `reglas` es `{ ...reglasNacionales, ...reglasZona }` como hace `cargarConfig`; `firmas` vacías) y se lo pasa a `mitadUno`. Con `configZona` vacío, `zona` es `null`.
- Nodo **Decidir** (Code): lo mismo, se lo pasa a `mitadDos`, y `resumenEnPantalla` recibe `anillos: zona ? zona.reglas.anillos : []`.
- Los otros nodos y las flechas no cambian: siguen siendo 10 nodos.

`n8n/LEEME.md`: en «Lo que hay que editar después de importar», la fila de Rutas suma `configZona` («`config/zona`; vacío para no correr la zona»). En «Lo que conviene saber», una línea: la zona corre sin IA; sus notas viven en los mismos datos estáticos.

`test/n8n.test.js`: el test de los 10 nodos comprueba además que Rutas trae `configZona` y que el código de Feeds, Preparar y Decidir nombra `configZona`. El test de claves sigue igual.

## Paso 3 · El molde del pronóstico

En `config/reglas.json`, el molde «pronóstico del tiempo» suma una exclusión al principio, en la misma línea que la de «alerta»: el título **no** lleva `que ver`, `netflix`, `series`, `peliculas`, `pelicula`, `serie`. Queda así (es el de hoy con la segunda negación):

```json
{ "nombre": "pronóstico del tiempo", "molde": "^(?!.*\\balerta\\b)(?!.*\\b(que ver|netflix|series?|peliculas?)\\b)(?=.*\\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo|fin de semana)\\b)(?=.*\\b(pronostico|nublado|nubes|nubosidad|lluvias?|sol pleno|soleado|maxima de|minima de|rafagas|como estara el (tiempo|clima)|estado del tiempo)\\b)" }
```

Casos que se suman al test del molde en `test/nucleo.test.js` (los 7 de la carta `a` siguen igual): **pasa, no se saca** «Qué ver en Netflix: las mejores películas y series para disfrutar este fin de semana nublado y fresco»; **se sacan** «Pronóstico para el Día de la Madre: ¿lloverá el fin de semana?» y «El tiempo en Rosario: viernes, otra vez con probabilidades de lluvia». Los 10 casos están probados contra `normalizar` del repo.

## Paso 4 · Links en `vueltas.jsonl` y `medir` por link

**En la línea.** Cada entrada de `confirmados`, de `cuatroDeCinco` y de `zona.confirmados` suma `urls`: la lista de las urls de las notas del hecho (`hecho.notas.map(n => n.url)`), sin repetir. Para lo nacional va en `armarLinea` de `scripts/vuelta.js` y en la copia de `src/capa4.js`; para la zona, en `decidirZona` de `src/zona.js`, que ya arma cada confirmado (una línea más, `urls`, junto a `medios`). Es el único cambio en `src/zona.js`.

**En `medir`.** Hoy cuenta ids distintos. Pasa a contar **hechos distintos**: dos entradas (del mismo corte o de cortes distintos del mismo día) que comparten al menos una url son el mismo hecho, aunque tengan id distinto; también si A comparte url con B y B con C (los tres son uno). El bloque o anillo del hecho es el de su última vuelta, como hoy. Una entrada **sin** `urls` (línea vieja) se cuenta por id, como hoy. Las columnas y el texto del informe no cambian; cambia solo qué cuenta como «distinto».

### 4a · Ejemplos

**E5.** Dos vueltas del mismo día: la primera trae el confirmado `g:a` con `urls` `[u1, u2, u3]`; la segunda, `g:b` con `urls` `[u2, u3, u4]` → «Día entero (distintos)» cuenta 1 confirmado, no 2.

**E6.** Lo mismo pero la segunda línea no trae `urls` → cuenta 2 (regla de las líneas viejas).

**E7.** `g:a` `[u1]`, `g:b` `[u2]`, `g:c` `[u1, u2]` en tres vueltas → 1.

Un test por ejemplo en `test/medir.test.js`; en `test/vuelta.test.js` y `test/capa4.test.js`, una comprobación de que cada confirmado y cada 4/5 trae `urls` con la cantidad correcta.

## Paso 5 · `docs/PAQUETE_DE_CLIENTE.md`

Un documento corto, para Alejo, con una tabla: **qué es de un cliente, dónde vive hoy, y estado**. Las filas: nombre del cliente (`config/reglas.json → cliente`), cupos (`cupoPorBloque`, `cupoMinimo`), anillos de zona (`config/zona/`), usuarios (`datos/usuarios.json` en el servidor, con `scripts/usuario.js`), portales y feeds nacionales (`config/portales.json`, `config/feeds.json`; hoy una sola lista para todos), y las que todavía no existen con su estado: escalón Normal/Plus (página C), temas (página C), largos de la pieza 2 (pieza 2), avisos (carta `c`). Al final, en dos párrafos: cómo se clonaría hoy para un segundo cliente (copiar `config/` a una carpeta por cliente y correr con ella; los datos y la página en otra carpeta de `datos/`), y que la decisión de Alejo del 14-10 es «una sola empresa ahora; multi-empresa después, por clonado o por licencia». Nada de código.

## Paso 6 · Documentos

- `docs/INSTALAR_EN_EL_SERVIDOR.md`: donde se edita el nodo Rutas, sumar `configZona`; donde se explica qué guarda n8n, sumar las notas de la zona; en la prueba de la primera vuelta, que el resumen tenga los dos renglones de zona.
- `CLAUDE.md`: estado al día (la capa 4 corre la zona; los cuatro bloques en el servidor) y **la regla nueva, con sus palabras:** «Nada se guarda por id de hecho: el id cambia cuando se cae su primera nota. Lo que necesite reconocer la misma noticia usa sus links (la página, `src/ia.js`, `medir`)».
- `buzon/pendientes.md`: en la sección de Cowork del 16-10 (la que pegaste arriba de todo), en «Abierto», el ítem «Viejas que vuelven como nuevas» pasa a **resuelto**: «decidió Alejo (16-10, 16:53): opción B, `medir` cuenta por link, y la regla del proyecto: nada por id». En «Qué viene después», el punto 3 pasa a: «carta `b` hecha: la capa 4 corre la zona; queda la carta `c`: el bloque Avisos (arranca con lo legible: notas locales de corte con 1 medio, horario y barrios del texto, link al comunicado)». En «▶ PRÓXIMA RONDA · Cowork → Claude Code», tachá «Enganchar la zona en `src/capa4.js`» y dejá la Fase B de la carta del 15-10 (la instalación).
- `npm run paquete` y el reporte.

## Cuándo está listo (comprobalo y ponelo en el reporte)

1. `npm test` en verde, con el número de tests antes y después.
2. `npm run probar-pagina` en verde (no debería cambiar: 80).
3. **n8n en tu entorno, como el 15-10** (n8n con npm y `scripts/ia-falsa.js`): importar el `vuelta.json` nuevo con `configZona` en `config/zona`, dos vueltas seguidas disparadas por el reloj. En el reporte: los renglones del resumen de cada vuelta (incluidos «Zona · feeds» y «Zona · lista»), cuántos hechos salieron en Comodoro y en Chubut, cuántos «también nacionales» con sus títulos, y que `lista.json` del servidor trae `orden` de cuatro. Después una tercera vuelta con `configZona` vacío: la lista vuelve a `orden` de dos y la línea no trae `zona`.
4. Una vuelta real, `npm run vuelta -- --zona config/zona` (sin `--sin-leer`, que no escribe la línea): la última línea de `datos/vueltas.jsonl` trae `urls` en cada confirmado, cada 4/5 y cada confirmado de `zona`.
5. `npm run medir` sobre tu `datos/vueltas.jsonl`: las líneas viejas se cuentan como antes, las nuevas por link; decí cuántos «distintos» daba antes y después en el último día.
6. El molde: el título de Netflix ya no se saca (mostralo con `npm run leer -- --detalle` o con el test).

## Qué va en tu reporte

Lo de siempre (qué cambió por paso, con commit; tests antes y después; qué decidiste por tu cuenta y por qué), más los números de los puntos 3, 4, 5 y 6. Si n8n no se puede levantar en tu entorno, decilo y mostrá E1, E2 y E4 corriendo por `node --test` con los cuerpos reales de una lectura (sin pegar los cuerpos en el reporte).
