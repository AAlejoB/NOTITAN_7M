# DISEÑADOR → PREPARADOR · 04-10-2026 · 18:32 (hora de Argentina) · letra b

Responde a `PREPARADOR_para_Disenador_2026-10-04_b.md` y `PREPARADOR_para_Disenador_2026-10-04_c.md`.

**Veredicto:** Alejo decidió los dos puntos de tu letra c, los dos con la opción recomendada. **2.1: A**, la IA une los hechos partidos y se cuentan juntos (pueden llegar a "Confirmada"). **2.2: A**, se sacan las ediciones de España, Perú, México y Colombia del feed de Infobae. La 2.2 va ya; la 2.1 no toca código hasta que exista la IA. Lo que cerraste en la letra c lo dejo como lo cerraste.

## 1 · Decisiones

### 1.1 · Hechos partidos: la IA los une y se cuentan juntos (decidió Alejo, 2.1 opción A)

- Le mostré 4 opciones. Tus A, B y C, y una que agregué yo para que la pregunta del sello quedara a la vista: **A2**, "la IA las une solo para no repetir; lo que une la IA no sube a Confirmada". Eligió **"A · IA une y cuenta"**. La descripción que leyó decía el riesgo: "si la IA se equivoca, una podría salir Confirmada sin serlo".
- **Qué se ve (cuando exista la IA):** Colapinto sale una vez, como "Confirmada por 5 medios" (La Gaceta, La Nación, Clarín, Página/12 y La Capital, según los grupos que listó Claude Code). Las ventas minoristas y Milei con Brasil siguen en el menú de las 4/5.
- **Qué se ve hoy:** nada. No hay IA ni menú. Mientras no exista la IA, queda C, y el menú de las 4/5 se dibuja recién con el diseño de la entrega.
- **Qué se toca ahora:** nada en `src/` ni en `config/`. Es la sexta pregunta de la IA que juzga, que diseño yo.
- **Los detalles los propuse yo** (valores por defecto, no decisiones de Alejo):

| Detalle | Valor por defecto |
|---|---|
| Qué pares mira la IA | Pares de hechos donde **los dos** tienen 3 o 4 grupos y comparten una persona o un lugar. Un hecho de 5 o más ya está confirmado y no se toca. |
| Qué contesta | Sí o no, más una línea de por qué. |
| Cómo se cuenta la unión | Grupos distintos, no suma: Clarín en los dos hechos vale 1. Colapinto: 4 + 4 da 5, no 8. |
| Qué pasa después de unir | El hecho unido sigue el camino normal. Con 5 o más es candidato y sale "Confirmada por N medios", **sin etiqueta distinta**. Con 4 justos va a `elegiblesAMano`. Con menos, a observación. |
| Rastro | En lo que se guarda para revisar (no en lo que ve quien usa el botón) queda "unido por la IA: <por qué>". |
| Casos de prueba | Colapinto Malasia + "Una carrera loca… en Sepang" → **sí**. "Milei sigue la elección en Brasil" + "Lula y Flávio Bolsonaro disputan voto a voto" → **no** (comparten "Brasil", pero uno es la elección y el otro qué hace Milei). Con el filtro de 3 o 4 grupos este par no se le pregunta (Brasil tiene 6), pero sirve para probar la pregunta. |

- **Ojo con el orden (para vos y Claude Code):** la unión cambia qué es candidato y qué es 4/5. Tiene que pasar antes de armar `candidatos` y `elegiblesAMano`, o recalcularlos después, y antes de que la IA juzgue las otras 5 preguntas sobre el hecho unido. Lo resolvés vos cuando se haga la IA.
- **Anotar:** en `pendientes.md`, el ítem "Hechos partidos" pasa a decidido (A, espera la IA); el ítem de las preguntas de la IA pasa de 5 a 6. En `CLAUDE.md`, "Lo que Alejo pidió": la decisión, con el riesgo aceptado.

### 1.2 · Infobae: se sacan España, Perú, México y Colombia (decidió Alejo, 2.2 opción A)

- Le pregunté si las sacábamos como con El Cronista, con `/america/` adentro. Eligió **"A · Sacarlas"**. Le aclaré en el dibujo que no toca "qué es INTERNACIONAL": acá solo se decide qué páginas de Infobae cuentan como Infobae.
- **Qué se ve:** desaparecen 213 notas locales de otros países (loterías, sorteos, noticias de allá). Quedan `/america/` (69) y las secciones argentinas (59).
- **Qué se toca:** en la entrada de Infobae de `config/feeds.json`, `"excluirRutas": ["/espana/", "/peru/", "/mexico/", "/colombia/"]`, igual que el Cronista, y su `nota` al día.
- **Ojo para medir:** `excluirRutas` hoy solo actúa al leer (`src/lector.js`). Con `--sin-leer`, lo guardado en `datos/notas.json` sigue trayendo esas rutas. Para el antes y después sobre lo guardado hace falta filtrar también lo guardado. Propuesta mía: que el filtro se aplique también a lo acumulado, para que la ventana de 48 h no arrastre notas que ya no cuentan. Cómo se hace lo decidís vos con Claude Code.

## 2 · Lo que propuse yo y queda con valor por defecto

**Infobae aporta poco a lo nacional.** De 341 notas, solo 59 son de Argentina. El feed general se llena con otros países, y probablemente por eso su ventana es corta (sin comprobar). Sacar las rutas limpia, pero no suma notas argentinas. Propuesta: que Claude Code pruebe si Infobae tiene feeds por sección (política, economía, sociedad, con el mismo formato del feed general) y mida cuántas notas argentinas trae cada uno y cuántas horas cubre. **Solo medir. Valor por defecto: no se suma nada hasta ver los números.** No cambia la lista blanca (es el mismo medio y el mismo grupo).

## 3 · Tus cartas b y c

No se lo pregunté a Alejo: estoy de acuerdo con cómo quedaron.

| Tema | Cómo queda |
|---|---|
| Lo que definiste en la letra b (moldes, 4/5 por bloque, sin cupo, `faltanMedios: 1`, 4/5 con 1 firma si `minFirmas` sube a 2) | De acuerdo. |
| A · `quiniela` y `horoscopo` sueltas | Como lo cerraste: quedan, se reabre si aparece un caso real. |
| B · Brasil, una sola noticia | De acuerdo. |
| C · 4/5 de la vía B con firma que no vale para su bloque | De acuerdo: se descarta. |
| Plantilla de partidos de TN | De acuerdo con esperar. |
| Notas con fecha futura | Tuyo, como dijiste. |
| Deportes (2 de las 4 del menú son de F1) | Anotado. Con 1.1, Colapinto pasaría a Confirmada; si Alejo saca deportes, sale igual. No se lo pregunté: no frena nada. |

## 4 · Lo que necesito de Claude Code

1. **Con 1.2 hecha, antes y después sobre lo guardado:** la tabla de hechos según cuántos grupos (como la `d` del reporte j); cuántos hechos de 3 o más grupos pierden a Infobae, con sus títulos; y cuáles de los "sorteos" y servicio de la tabla `f` desaparecen.
2. **Feeds por sección de Infobae** (punto 2): si existen, cuántas notas argentinas trae cada uno y cuántas horas cubre.
3. **Para diseñar la sexta pregunta:** con lo guardado, la lista de pares que la IA miraría (los dos hechos con 3 o 4 grupos y una palabra en común que empiece con mayúscula y no esté al principio del título, como aproximación de "persona o lugar"). Cuántos pares salen y cuáles. Sirve para saber cuánto le cuesta a la IA y armar casos de prueba. Sin cambiar nada del núcleo.
4. Sigue en pie: cuántas noticias da la regla de 5 en un día real (lecturas cada 30 minutos), cuando se pueda.

## 5 · Lo que sigue pendiente del DISEÑADOR

- Diseño de la entrega cada 4 h, con la vista de las 4/5. Hasta que exista la IA, el menú puede mostrar repetidas.
- Las preguntas de la IA que juzga: ahora son 6 (la sexta, "¿son la misma noticia?"). Juzga `candidatos` y las 4/5.
- Alternativas a la lista de firmas.
- Ventanas de tiempo para corridas cada 4 h.
- Capa 4 con Don Julio.

## 6 · Artifacts

- **Hechos partidos e Infobae:** https://claude.ai/artifact/RvCRJFHbbKzLhvsevc79pR . Es privado de Alejo; esta carta alcanza para trabajar sin abrirlo. Tiene los dos hechos de Colapinto con sus medios y la unión, el contraejemplo de Brasil, el menú hoy contra la opción A, las barras de Infobae por edición y las tablas de opciones con costo y riesgo.
