# Claude Code → PREPARADOR · 04-10-2026 · 18:06 (hora de Argentina) · letra j

Responde a `PREPARADOR_para_ClaudeCode_2026-10-04_b.md` (guardada junto con `PREPARADOR_para_Disenador_2026-10-04_b.md`).

**Veredicto:** hechos los 4 pasos y la medición. Con los 3 moldes afuera, las 2 uniones falsas de 3 grupos desaparecen y los verificados siguen siendo 2. El núcleo ya separa las 4/5 (`elegiblesAMano` y `aMano`). Hubo un ajuste al molde de lotería: el título real de la Lotería del Cauca no llevaba "de". `npm test` pasó de 102 a **123 bien** y sigue 1 pendiente a propósito.

## Qué cambió

| Paso | Commit | Cambio |
|---|---|---|
| guardar | `c2660c5` | Las dos cartas de la letra b, en `buzon/`. |
| 1 | `3beb75d` | `criterio1.notasDeServicio` en `reglas.json` (3 moldes) y un recorrido en `esInformativa`. Motivo: `nota_de_servicio (<nombre>)`. |
| 2 | `f8d4c4b` | `aMano` en `reglas.json`; `preparar` devuelve `elegiblesAMano` y `resumen.elegiblesAMano`; `decidir` recibe `elegiblesAMano` y devuelve `aMano`. Día de ejemplo con M1 y M2, demo y `leer.js` con la línea nueva. |
| 3 | `c13779f` | `npm run leer`: bloque CRITERIO 1 por motivo, `--sin-notas-de-servicio`, `motivosCriterio1` y, con `--detalle`, los títulos sacados por una regla de título. README con la opción. |
| 4 | este commit | `CLAUDE.md`, `README.md`, `pendientes.md`, este reporte y los paquetes. |

## Tests, antes y después

| | Antes | Después |
|---|---|---|
| Bien | 102 | **123** |
| Pendiente a propósito | 1 | 1 |
| Paso 1 | | +4 (servicio con motivo, noticias que siguen, sin la clave, y que una nota de servicio no cuenta para verificar) |
| Paso 2 | | +13 (una por fila de tu tabla, más el menú internacional, el orden y la regla 6) |
| Paso 3 | | +4 (la opción, `motivosCriterio1` dos veces, `detalleCriterio1`) |

Los 102 de antes quedaron sin tocar, salvo "día de ejemplo: de punta a punta", que cambia en las líneas que decía tu carta. Doble pasada: rompí a propósito el código en 8 lugares de la 4/5 (por ejemplo `<` en vez de `<=`, ignorar `activa:false`, mirar el criterio 2, ordenar al revés) y en 4 de los moldes (sacar un "empieza con" o agrandar el de partidos). Los tests atraparon las 12. Una no se atrapaba a la primera (sacar el "empieza con" del molde de lotería); agregué 2 títulos que siguen (con "lotería" en el medio) y ahora sí.

## Demo: lo único que cambia (coincide con lo que predijiste)

| Línea | Antes | Después |
|---|---|---|
| Notas que llegaron | 115 | 123 |
| Hechos | 22 | 24 |
| − sin 5 grupos ni firma | 3 | 5 |
| les falta 1 medio | (no existía) | 2 → se pueden elegir a mano |
| Sección PARA ELEGIR A MANO | (no existía) | Aconcagua (nacional) y emergencia hídrica en Chile (internacional), cada una con "Confirmada por 4 medios · elegida a mano" |
| EN OBSERVACIÓN | 3 líneas | 5 (las 2 nuevas con 4/5 y la marca) |

ENTRAN y AVISOS iguales. Las internacionales siguen en 5 con cupo 7: la 4/5 no rellena. Con solo el Paso 1 la demo era idéntica (`diff` vacío).

## Medición (con lo guardado, `--sin-leer`)

**i · El archivo.** Paso 0: `datos/notas.json` existía con 1.150 notas, de 2/10 17:18 a 4/10 16:59. Hice una lectura más a las 18:02 y quedó con **1.277 notas, de 2/10 18:12 a 4/10 18:02** (la ventana de 48 h corrió). A corrió a las 18:02:49 y B a las 18:02:51.
Dato de pasada: 3 notas tienen fecha futura (2 de Página/12 con 5/10 00:01 y 1 de La Nación 18:53). Hoy cuentan como frescas; no hice nada.

**d · Hechos según cuántos grupos (A = sin moldes, B = con moldes)**

| Grupos | A | B |
|---|---|---|
| 1 | 982 | 983 |
| 2 | 37 | 37 |
| 3 | 10 | **8** |
| 4 | 4 | 4 |
| 5 o más | 2 | 2 |
| Hechos en total | 1.035 | 1.034 |
| Notas sacadas por el criterio 1 | 58 | 65 |
| Hechos con 3 o más grupos | 16 | 14 |

**a · Por molde (B).** Sacan 7 notas en total; ninguna es noticia de verdad.

| Molde | Notas | Títulos |
|---|---|---|
| horario de partido | 3 | Olé: "A qué hora juegan Talleres vs. Belgrano y cómo ver hoy EN VIVO el Torneo Clausura" · Clarín: "Argentinos vs Tigre, EN VIVO: a qué hora juegan, formaciones y cómo ver el partido por el Torneo Cl…" · Clarín: "Estudiantes de Río Cuarto vs Racing, EN VIVO: a qué hora juegan, formaciones y cómo ver el partido …" |
| efemérides | 3 | Página/12: "Efemérides de hoy: qué pasó un 3 de octubre" · La Nación: "Efemérides del 4 de octubre: ¿qué pasó un día como hoy?" · Página/12: "Efemérides de hoy: qué pasó un 4 de octubre" |
| resultados de lotería | 1 | Infobae: "Resultado Lotería del Cauca hoy 3 de octubre" |

**Ajuste al molde de lotería (permitido por tu carta).** Con el molde tal cual, la Lotería del Cauca **no salía**: el título es "Resultado Lotería del Cauca…", sin "de". Cambié `^resultados? de (la )?loteria` por `^resultados? (de )?(la )?loteria`. Sigue "empieza con" y sigue pidiendo "lotería" pegada: no es aflojar. Es tu caso 13. Los 12 casos de la tabla dan igual.

**b · Las 2 uniones falsas de 3 grupos: desaparecen las dos.**
- "A qué hora juegan Talleres vs. Belgrano…" era `[3 grupos · 6 notas]` y juntaba el clásico con Argentinos-Tigre, Estudiantes RC-Racing y Vélez-Platense. En B ya no existe. Lo que quedaba del clásico se suma al hecho "Hinchas de Talleres atacaron con piedras el micro de Belgrano…", que pasa de `[3 grupos · 3 notas]` a `[3 grupos · 4 notas]` y es la misma historia.
- "Efemérides de hoy…" era `[3 grupos · 4 notas]` y juntaba la Lotería del Cauca. En B ya no existe.

**c · Hechos con 4 o más grupos (la lista es idéntica en A y B).**

| Grupos · notas | Título |
|---|---|
| 6 · 14 | Tras el cierre de los comicios, Lula Da Silva y Flávio Bolsonaro disputan voto a voto la … |
| 6 · 6 | Nuevo mensaje de García Cuerva para Milei en la misa de cierre de la peregrinación a Luján… |
| 4 · 8 | Fórmula 1: qué dijo Colapinto luego de finalizar 13° en el Gran Premio de Malasia |
| 4 · 5 | A la espera de los primeros resultados, Milei sigue con optimismo la elección en Brasil y… |
| 4 · 4 | Una carrera loca que Franco Colapinto terminó con mucha dignidad en Sepang con el mejor Alpine |
| 4 · 4 | El consumo, con cautela: las ventas minoristas crecieron apenas 0,3% interanual en septiembre |

Las dos de Colapinto son la misma carrera partida. La de Milei con Brasil es otro hecho aparte del de Brasil (6 grupos).

**e · Reglas viejas (sobre las 1.277 notas, con los moldes puestos).** Ninguna es noticia de verdad en estos datos.

| Regla | Notas | Títulos |
|---|---|---|
| `quiniela` | 0 | — |
| `horoscopo` | 2 (más 1 por url `/horoscopo/`) | La Gaceta: "Horóscopo semanal del 5 al 11 de octubre…" · La Nación: "Horóscopo: cómo será tu semana del 4 al 10 de octubre de 2026" · (url) La Nación: "Las predicciones de Jimena La Torre: conocé tu horóscopo para la semana del 4 al 10 de octubre" |
| `dolar hoy` | 6 | 4 de El Cronista, 1 de La Nación y 1 de Clarín: todas "Dólar hoy…" / "Dólar blue hoy…" con la cotización del día |

El caso peligroso ("Detienen al dueño de una agencia de quiniela") no apareció, pero sigue siendo posible.

**f · Lo que los moldes no agarran** (notas que pasan el criterio 1 en B; cadena normalizada y, entre paréntesis, como palabra suelta).

| Cadena | Títulos que la contienen | Qué son |
|---|---|---|
| "a que hora" | 6 (5) | Las 6 son de elecciones en Brasil y Perú ("A qué hora cierran los comicios…"). Ninguna de partidos. |
| "donde ver" | 6 (5) | 4 de TN con la plantilla de partidos "…en vivo por la fecha 32: hora, dónde ver y formaciones", 1 de béisbol (Infobae) y 1 falsa ("donde Verstappen") |
| "como ver" | 3 (3) | Argentina vs. Benín (La Nación), Vélez vs. Platense (Olé), Portugal vs. Noruega (Clarín) |
| "horario" | 4 (2) | Argentina vs. Benín (La Nación), horario oficial de las elecciones en Perú (Infobae) y 2 con "horarios" (el GP de Singapur de Colapinto y las manifestaciones en CDMX) |
| "un dia como hoy" | 0 | — |
| "santoral" | 0 | — |
| "loteria" | 0 | — |
| "quini" | 2 (1) | El pozo del Quini 6 (La Nación) y Quinigol (Infobae) |
| "loto" | 9 (0) | Ninguna como palabra: "piloto" ×6, "molotov", Lototurf y Bonoloto ×2 |
| "baloto" | 0 | — |
| "sorteo" | 6 (6) | Chontico Noche, Telekino, Quini 6, Triplex de la Once, Super Once y Bonoloto |

No sumé moldes. Lo que sí se ve: la plantilla de partidos de TN ("hora, dónde ver y formaciones") sigue pasando, porque el molde de partidos es solo "a qué hora juega".

**g · Les falta 1 medio.** `resumen.elegiblesAMano` = **4** (las 4 son 4/5 y frescas): Colapinto en Malasia (4 notas de La Gaceta, La Nación, TN y Página/12), "Una carrera loca…" de Sepang (La Capital, TN, Página/12, La Nación; es la misma carrera, si se juntaran serían 5 o 6), las ventas minoristas de septiembre (La Gaceta, Ámbito, TN, Infobae) y Milei con la elección en Brasil (Infobae, El Cronista, La Capital, El País).

**h · La Lotería del Cauca y los otros países.** Salió del feed de **Infobae**: `https://www.infobae.com/colombia/2026/10/04/resultado-loteria-del-cauca-hoy-3-de-octubre/`. El feed **sí mezcla ediciones de otros países**: de 341 notas de Infobae en el archivo, 282 (83 %) son de otra edición.

```
Infobae · primer tramo de la ruta (top 10 de 341 notas)
/espana/     76  ██████████████████████
/peru/       72  █████████████████████
/america/    69  ████████████████████
/mexico/     38  ███████████
/colombia/   27  ████████
/deportes/    9  ███
/salud/       5  ██
/economia/    4  █
/tecno/       4  █
/teleshow/    4  █
```

Todas cuentan como Infobae para verificar. No agregué `excluirRutas`. Ojo: `/america/` trae noticias internacionales de verdad (la elección de Brasil), así que excluirla no es obvio. No hizo falta mirar otro feed: la lotería salió de Infobae.

## Qué decidió Claude Code por su cuenta (para revisar)

- **Molde de lotería con "de" opcional** (arriba). Lo pedía tu caso 13.
- `elegibleAMano` (true o false) se pone en **todo** hecho en observación, no solo en los elegibles. `aMano` sin la clave `activa` vale activo, igual que `viaB`.
- En `decidir` saqué los criterios 3 a 6 a una función (`motivoCriterios3a6`) que usan los candidatos y las 4/5, para que los textos de motivo no se desfasen. Mismo orden y mismos textos; los tests de antes pasan sin tocar. El criterio 2 queda afuera de las 4/5.
- Una 4/5 sin juicio suma al aviso "N hecho(s) sin juicio de la IA", como pedía la carta.
- En el bloque CRITERIO 1 de `leer`, el largo de las barras toma como 100 % las notas sacadas por el criterio 1 (no las leídas), para que se vea la proporción entre motivos. Con `--sin-notas-de-servicio` el título del bloque lo avisa.
- Agregué `detalleCriterio1` (exportada, con test) para la lista de títulos con `--detalle`. La carta pedía el comportamiento, no la función.
- No toqué `quiniela` ni `horoscopo`, ni sumé moldes, ni excluí rutas de Infobae.

## Qué quedó pendiente

| A quién | Qué |
|---|---|
| DISEÑADOR (por el PREPARADOR) | Reglas viejas `quiniela`/`horoscopo` sueltas · variantes de servicio que los moldes no agarran (sobre todo la plantilla de TN) · rutas de otros países en el feed de Infobae · el caso borde de la vía B. Todo con números y valor por defecto en `pendientes.md`. |
| DISEÑADOR | Diseño de la entrega con la vista de las 4/5; las 5 preguntas de la IA (ahora también juzga las 4/5); ventanas para corridas cada 4 h. |
| DISEÑADOR con Don Julio | Capa 4: cada cuánto leer y dónde se guarda `datos/notas.json`. |
| Alejo | Lista de firmas, lista blanca, repo público o privado: sin apuro. |
| Claude Code | LN+: reintentar el feed con Network access en Full. |

No se hizo, como pedía la carta: la vista de las 4/5, la memoria de lo ya entregado, la capa 4, la IA que juzga, la lista blanca, `firmas.json` y deportes.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| PREPARADOR | Recibe este reporte con la medición | Leerlo y escribirle al DISEÑADOR la letra c con los números (en especial: las 4/5 elegibles, la plantilla de TN que sigue pasando y el feed de Infobae) | Cuando Alejo se lo pase | Alejo lleva el archivo |
| Alejo | Nada se rompió; los paquetes están al día | Hacer `/clear` en Claude Code, borrar y reabrir los chats de Cowork con su línea | Ahora | Alejo |
