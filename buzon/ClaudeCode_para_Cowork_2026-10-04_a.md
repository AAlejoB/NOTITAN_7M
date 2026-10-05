# Claude Code → Cowork · 04-10-2026 · 22:29 (hora de Argentina) · letra a

Responde a `Cowork_para_ClaudeCode_2026-10-04_a.md`. Es el primer reporte para el chat único de Cowork.

**Veredicto:** hechos los 6 pasos. El orden pasa a cantidad de medios (y cambia qué entra por los topes, como calculaste), cada noticia trae la bajada, la página anda en un navegador de verdad (Chromium, 24 comprobaciones, con capturas) y las piezas de la IA están listas y probadas sin llamar a ningún modelo. Las tres mediciones dieron: los ids no cambian entre vueltas (120 de 120), salen 5 pares para la IA (2 son «no» y 1 es dudoso) y el feed de Chequeado anda pero no sirve para 48 horas. `npm test` pasó de 133 a **185 bien** y sigue 1 pendiente a propósito. `npm run demo` salió idéntica después del Paso 4.

## Qué cambió

| Paso | Commit | Cambio |
|---|---|---|
| guardar | `1000a44` | La carta `a` de Cowork, en `buzon/`. |
| 1 | `6fbdf50` | Orden por cantidad de medios; `impacto` ya no se usa ni sale; ejemplos y demo sin `impacto`. |
| 2 | `42e4df3` | `bajada` en nacionales, internacionales, reserva y a mano. |
| 3 | `38c8461` | `src/entrega.js`, `pagina/` (`index.html`, `logica.js`, `lista.json`), `scripts/armar-pagina.js` + `npm run pagina`, nombres en `portales.json`, 2 archivos de tests, 2 capturas. |
| 4 | `8e9ef8b` | `src/ia.js`, sección `ia` en `reglas.json`, `test/ia.test.js` y `test/casos-ia.json`; en el núcleo, `clasificarHecho` (sale de `preparar`), `nombreDeMedio` y la ficha con `fecha` y `firma`. |
| 5 | (nada) | M1, M2 y M3: scripts fuera del repo. |
| 6 | este commit | `CLAUDE.md`, `README.md`, `pendientes.md`, este reporte y el paquete. |

## Tests, antes y después

| | Antes | Después |
|---|---|---|
| Bien | 133 | **185** |
| Pendiente a propósito | 1 | 1 |
| Paso 1 | | +5 (T1 a T5) |
| Paso 2 | | +1 (la bajada) |
| Paso 3 | | +21 (8 de `entrega` y de `armar-pagina`/`lista.json`; 13 de `logica`) |
| Paso 4 | | +25 (`ia.test.js`, con I1 a I10 y los de unión, desmentidos y guardados) |

Doble pasada: rompí a propósito el código en unos 50 lugares (el orden, la bajada, `haceCuanto`, `limpiar`, `llevadaA`, `unirHechos`, `palabrasPropias`, `leerUnion`, `posiblesDesmentidos`…). Los tests atraparon casi todo; **5 no se atrapaban a la primera** (el borde de 24 h justas en `limpiar`, la regla de STOP con palabras de 3 o más letras, notas repetidas en una unión, `"misma": "true"` como texto y desmentidos repetidos): agregué los casos que faltaban y ahora se atrapan. La primera corrida de `ia.test.js` dio 6 fallos: 4 eran expectativas mal calculadas por mí (las corregí) y 2 eran del código, que arreglé: `fechaCorta` no rellenaba con ceros (`Intl` da `4/10` aunque se pida dos dígitos) y `unirHechos` reordenaba las listas aunque no hubiera uniones.

## Paso 1 · los tests reescritos

| Test | Antes | Ahora |
|---|---|---|
| `decidir: orden por impacto, después más grupos, después más reciente` → `…orden por cantidad de medios y, si empatan, la más reciente` | alta, media-con-mas-grupos, media-reciente, media-vieja, baja | media-con-mas-grupos (8 medios), baja, media-reciente, media-vieja, alta (los otros 4 tienen 5 medios: va la más nueva) |
| `a mano: … ordenadas por impacto, grupos y recencia` → `…por medios y recencia` | a, b, d, c | b, d, a, c |
| `día de ejemplo: de punta a punta` | nacionales N2, N1, N3, E2, E1, N6, NB · internacionales I1, I6, I4, I2, IB · reserva: E3, E4 (tope economía) e I3 (tope EEUU) | nacionales N2, N1, **E4, E3**, N3, N6, NB · internacionales **I6, I1**, I4, **I3**, IB · reserva: **E1, E2** (tope economía) e **I2** (tope EEUU) |
| `día de ejemplo: eligiendo 5 o 3 noticias por bloque` | cupo 5: N2, N1, N3, E2, E1 · I1, I6, I4, I2, IB · por cupo: E3, E4, N6, NB. Cupo 3: N2, N1, N3 · I1, I6, I4 | cupo 5: N2, N1, E4, E3, N3 · I6, I1, I4, I3, IB · por cupo: E1, E2, N6, NB. Cupo 3: N2, N1, E4 · I6, I1, I4 |
| `la vía B va después de la A aunque tenga más impacto…` → `…aunque tenga más medios y sea más nueva…` | B con impacto 3 contra A con 1: sale ['a', 'b'] | B con 9 medios y más nueva contra A con 5: sale igual ['a', 'b'] |
| 7 tests más (tope por sección, por país, cupo 7, desmentido, tope de vía B, segunda página, 4/5 al menú) | usaban `impacto` de relleno | sin `impacto`; la expectativa no cambia (con todo empatado, quedan como llegaron) |

Los 5 nuevos (T1 a T5) son los de tu carta, con tus números. T3 además mira la reserva y el menú a mano, no solo las listas.

## Demo, antes y después (el día de ejemplo)

| # | Nacionales, antes | Nacionales, ahora |
|---|---|---|
| 1 | Paro general de la CGT (6 medios) | Paro general de la CGT (6) |
| 2 | Diputados aprobó el Presupuesto 2027 (6) | Diputados aprobó el Presupuesto 2027 (6) |
| 3 | Aumento de tarifas de luz y gas (5) | **El dólar blue cerró en alza** (5) |
| 4 | Riesgo país récord (5) | **Caen las reservas del Banco Central** (5) |
| 5 | El BCRA subió la tasa (5) | Aumento de tarifas de luz y gas (5) |
| 6 | Alerta de dengue en el norte (5) | Alerta de dengue en el norte (5) |
| 7 | Investigación del puente (vía B) | Investigación del puente (vía B) |

| # | Internacionales, antes | Internacionales, ahora |
|---|---|---|
| 1 | La Fed bajó la tasa (6) | **Terremoto de magnitud 7 en Japón** (7) |
| 2 | Terremoto de magnitud 7 en Japón (7) | **La Fed bajó la tasa** (6) |
| 3 | Brasil y Argentina, acuerdo automotor (5) | Brasil y Argentina, acuerdo automotor (5) |
| 4 | El Senado de EEUU aprobó un plan de gasto (5) | **La Casa Blanca anunció aranceles** (5) |
| 5 | Tratado reservado (vía B) | Tratado reservado (vía B) |

Reserva: antes, dólar blue y reservas del BCRA (tope de economía) y Casa Blanca (tope de EEUU); ahora, riesgo país y tasa del BCRA (tope de economía) y Senado de EEUU (tope de EEUU). Es lo que calculaste. En la demo, `[3]` pasó a `[6 medios]`.

## Paso 3 · la salida de `npm run pagina`

```
nacional        7 noticias · 1 a las que les falta 1 medio · 0 afuera por tope
internacional   5 noticias · 1 a las que les falta 1 medio · 0 afuera por tope
pagina/lista.json · ejemplo: true · generada <la hora de ahora>
```

**Las capturas** están en `buzon/capturas/pagina-2026-10-04-390.png` (390 px) y `pagina-2026-10-04-1200.png` (1200 px), modo claro, con una confirmada tildada y la 4/5 nacional tildada («Sacar»). Son de página entera: la ventana se estiró hasta el alto de la página para que la barra de abajo quede abajo de todo. En el día de ejemplo las bajadas están vacías y `afueraPorTope` da 0: **no se ven esas dos cosas**, como avisabas. No toqué el día de ejemplo.

**Probé la página en Chromium** (Playwright, servida en un puerto local), 24 comprobaciones, todas bien: tildar y la barra («2 elegidas», «Copiar las 2»); la 4/5 dice «Sacar» al tildarla; copiar trae los títulos y los renglones «Medio: url», **sin sello**; después de copiar se destilda todo, lo copiado baja al fondo con «Te la llevaste a las HH:MM», sigue contando para el tope (el título dice `Nacionales · 7`) y aparece «Copiadas. Ya podés pegarlas.»; al recargar nada es «Nueva» y lo llevado sigue apagado; «Traer noticias» no pierde lo tildado; con el portapapeles bloqueado aparece el cuadro con el texto; una lista de hace 2 h 5 min dice «Actualizada hace 2 h 5 min» y el aviso ámbar «No se actualiza desde las HH:MM»; una lista que no carga muestra el mensaje y «Reintentar» la trae; sin `localStorage` anda igual, sin marcas; en modo oscuro el fondo cambia; sin errores en la consola.

## Paso 4 · lo hecho, en una línea por pieza

| Pieza | Qué hace |
|---|---|
| `palabrasPropias` | Con tus dos ejemplos da exactamente `brasil, lula` y `colapinto, gran, premio, malasia`. |
| `paresParaUnir` | Hechos de 3 o 4 grupos más los candidatos de vía A como pareja; dos candidatos nunca forman un par. |
| `unirHechos` | Junta de a grupos, recuenta los grupos (no los suma), reclasifica con la misma función que `preparar`, agrega `unidoPorIA`; con dos confirmadas en la cadena el hecho se une a la de más grupos y se avisa con tu texto. |
| `preguntaUnion` y `leerUnion` | Tu texto tal cual; la respuesta tiene que ser JSON solo o en un bloque ```json, con `misma` true o false y `porque` texto. |
| `preguntaJuicio` y `leerJuicio` | Tu texto, con los deportes y la farándula según `ia`; `bloque` pasa a minúsculas; lo inválido da `null`. |
| `posiblesDesmentidos` | Con tus dos ejemplos (el aguinaldo sí, el dengue de Salta no). |
| `buscarGuardado` y `hayQueVolverAPreguntar` | Por una url compartida; vuelve a preguntar si hay un desmentido nuevo. |

`npm run demo` **idéntica** a la del Paso 2 (`diff` vacío), y lo que devuelve `preparar` es lo mismo salvo la `fecha` y la `firma` de cada nota de la ficha. Los ejemplos de dentro de `preguntaUnion` (Presupuesto, paro de colectivos) no están en `test/casos-ia.json`: hay un test que lo comprueba. En `casos-ia.json` los 4 títulos eran completos en `datos/notas.json` (el de «EN VIVO…» ya terminaba en «a las 19»), así que no hizo falta marcar `incompleto`.

## Paso 5 · las tres mediciones

**M1 · ¿Cambia el id entre una vuelta y la siguiente?** 96 vueltas de 30 minutos (del 3/10 00:12 al 5/10 00:01), con las notas que ya habían salido en cada una y `preparar` con `ahora = t`.

| Hechos de 4 o más grupos | Cantidad |
|---|---|
| (a) mismo `id` | **120** |
| (b) otro `id` pero comparte una url | 0 |
| (c) no comparte nada (nuevo) | 0 |

Si se compara solo con los de 4 o más grupos de la vuelta anterior, son 114 (a), 0 (b) y 6 (c); los 6 ya existían como hecho más chico (crecieron de 3 a 4 grupos). **Caso b: no hay ninguno que mostrar.** Pero esto está sesgado a que salga bien: `fecha` es cuándo salió la nota, no cuándo se leyó, y en este recorrido solo se suman notas más nuevas, así que el agrupador (que va por fecha) arma siempre el mismo comienzo. Para ponerlo a prueba hice una variante con retraso: cada nota aparece hasta 1 o 3 horas después de su fecha, al azar (siempre la misma para la misma nota).

| Retraso máximo | Hechos de 4 o más grupos | (a) mismo id | (b) otro id, misma url | (c) nuevo |
|---|---|---|---|---|
| 0 h | 120 | 120 | 0 | 0 |
| 1 h | 116 | 116 | 0 | 0 |
| 3 h | 104 | 103 | **1** | 0 |

El único (b): «A la espera de los primeros resultados, Milei sigue con optimismo…» (4 grupos), el 4/10 a las 19:42. El `id` pasó de la nota de El Cronista a la de Infobae porque entró tarde una nota más vieja. Con la regla «comparte una url» la página lo sigue reconociendo.

**M2 · ¿Chequeado tiene feed?** Anda: `https://chequeado.com/feed/` da 200, RSS, **50 notas**. Pero cubre **14.089 horas** (587 días, del 15/1/2025 al 25/8/2026) y la más nueva es de hace 40 días: son notas editoriales, no las verificaciones del día. Tres títulos: «Nueva investigación: ¿Quiénes son más vulnerables a las desinformaciones sobre salud?» (25/8), «Una comunidad que banca lo verdadero: esto también es gracias a vos» (7/8), «Evaluar chatbots, un desafío metodológico…» (31/7). No sirve para desmentidos de 48 horas y **no lo sumé** a `config/`.

**M3 · los pares con la regla nueva** (`ahora` = la nota más nueva, 5/10 00:01): **11 hechos entran** (5 de 3 grupos, 4 de 4 y 2 candidatos de vía A), **5 pares**: **2 entre hechos de 3 o 4** y **3 con un candidato**. Los 5 llegan a 5 grupos.

| # | Hecho A | Hecho B | Comunes | Unión | Mi juicio (el mismo hecho) |
|---|---|---|---|---|---|
| 1 | Milei sigue con optimismo la elección en Brasil (4 grupos) | Nuevo mensaje de García Cuerva para Milei en la misa de Luján (6, candidato) | milei | 9 | **no**: comparten solo un nombre |
| 2 | Milei sigue con optimismo la elección en Brasil (4) | Tras el cierre de los comicios, Lula y Flávio Bolsonaro disputan voto a voto (6, candidato) | brasil, bolsonaro, flavio, lula | 9 | **dudoso**: 4 de las 5 notas del hecho de Milei son del conteo de votos, pero el título es de Milei |
| 3 | EN VIVO: comienza el escrutinio y Lula habla con la prensa (3) | Tras el cierre de los comicios… voto a voto (6, candidato) | brasil, lula | 8 | **sí** |
| 4 | EN VIVO: comienza el escrutinio y Lula habla con la prensa (3) | Milei sigue con optimismo la elección en Brasil (4) | brasil, lula | 7 | **no** (por tu definición: uno es el conteo, el otro lo que hace Milei) |
| 5 | Colapinto luego de finalizar 13° en el Gran Premio de Malasia (4) | Una carrera loca… en Sepang (4) | colapinto, gran, premio, franco, bahrein | 5 | **sí** |

**Controles:** sale Colapinto con **5** (La Gaceta, La Nación, Clarín, Página/12 y La Capital); sale el escrutinio con «voto a voto» (par 3); y sale el escrutinio con Milei (par 4) y mi juicio es «no». Como detalle, en el par 5 «gran» y «premio» entran como «propias» solo porque van con mayúscula en «Gran Premio».

**Lo que se ve:** la regla de «una palabra propia en común» deja pasar pares que no son (el 1 y el 4), y los 5 llegan a 5 grupos. La pregunta de la IA tiene que ser estricta: si contesta «sí» donde no, una noticia sale «Confirmada» sin serlo.

## Qué decidió Claude Code por su cuenta (para revisar)

- **Las horas:** agregué `hourCycle: 'h23'` al `toLocaleTimeString` de tu carta, para que sea siempre de 24 horas y no salga «24:05» ni «12:00 p. m.». Es lo único que cambia de esa llamada.
- **Las marcas:** `marcarVistas` pone la hora de la última vez que se vio (no la primera), así una noticia que se sigue viendo no vence a las 24 h. `marcarLlevadas` agrega una entrada nueva cada vez, y `llevadaA` devuelve la hora de la primera, como pedías.
- **Si el portapapeles falla:** las elegidas igual pasan a «llevadas» (el texto queda en el cuadro) y el mensaje cambia a «No se pudo copiar solo. Copialo desde acá».
- **En la página:** las 4/5 también muestran sus links (no los pedías, y sirven para leer las fuentes); la pastilla «Nueva» **no** sale en las 4/5; con 0 elegidas la barra dice «0 elegidas» y el botón «Copiar», apagado; con una sola confirmada afuera, el texto dice «1 confirmada más quedó afuera por el tope de 7».
- **`nombreDeMedio`** (el criterio de `links[].medio`) lo puse en el núcleo y lo usan la entrega y las preguntas de la IA, para que no haya dos copias. También exporté `clasificarHecho` y `STOP`.
- **`unirHechos`:** una unión directa entre dos candidatos se ignora sin aviso (el aviso es solo para las cadenas); los ids que no existen se ignoran; los hechos nuevos entran en la lista antes del primero que es más nuevo, y lo que no cambió queda donde estaba; con varias confirmadas en la cadena, cada una (de la de más grupos a la de menos) se queda con lo que alcanza sin pasar por otra confirmada.
- **`paresParaUnir`:** los 3 y 4 grupos van fijos (constantes arriba de `src/ia.js`). Si dos pares empatan en grupos de unión, salen en el orden en que se armaron (primero los de observación, después los candidatos).
- **`leerJuicio`:** sin la clave `bloque` da `null` (falta); sin `porque` vale `{}`. **`leerUnion`** es estricta: texto antes o después del JSON da `null`.
- **`test/casos-ia.json`** lleva una clave `_aviso` y el caso de bloque de «Milei sigue con optimismo…» como **nacional**, tal como lo escribiste. Una duda para vos: con la decisión «por lugar», esa elección pasó en Brasil; Milei la sigue desde Argentina. Si querés que sea «internacional», es una línea.
- **`pagina/lista.json`** que se commitea tiene la hora en que se armó: después de una hora la página va a decir «No se actualiza desde…». Se refresca con `npm run pagina`.
- No toqué el agrupador, `minGrupos`, las ventanas, las rutas de Infobae o del Cronista, las reglas viejas ni los moldes.

## Qué quedó pendiente

| A quién | Qué |
|---|---|
| Cowork | Revisar las capturas y M1 (los ids aguantan, incluso con 3 h de retraso). Mirar los pares de M3: el 1 y el 4 son falsos y llegan a 5. |
| Cowork | Decidir si la pastilla «Nueva» va también en las 4/5, y el caso de bloque de Milei (arriba). Valores por defecto: no y nacional. |
| Cowork | Chequeado no sirve como está (la más nueva es de hace 40 días). Valor por defecto: no se suma. |
| Alejo con Don Julio | La capa 4: dónde corre n8n, dónde se guarda lo acumulado + la última lista + lo juzgado, dónde vive la página y con qué cuenta de IA. Está en `pendientes.md` con valores por defecto. |
| Alejo | Deportes y espectáculos (pendiente; por defecto, deportes sí y farándula no, en `ia`). Lo de siempre: lista de firmas, lista blanca, repo público o privado. |

No se hizo, como pedía la carta: llamar a un modelo ni guardar claves, n8n y dónde se guardan las cosas, noticias reales en la página, sumar Chequeado, tocar el agrupador y lo demás de la lista, y que las personas del canal compartan lo que se llevó.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| Cowork | Recibe este reporte | Mirar las 2 capturas (`buzon/capturas/`) y los pares de M3, y contestar las dudas de arriba | Cuando Alejo se lo pase | Alejo lleva el archivo |
| Alejo | La página ya anda sobre un día inventado | Hablar con Don Julio por la capa 4 (preguntas en `pendientes.md`) | Cuando puedas | Alejo |
| Alejo | Todo guardado y pusheado | `/clear` acá y chat nuevo de Cowork con la línea de siempre | Después de leer | Alejo |
