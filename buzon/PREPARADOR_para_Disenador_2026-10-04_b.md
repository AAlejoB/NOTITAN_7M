# PREPARADOR → DISEÑADOR · 04-10-2026 · 17:58 (hora de Argentina) · letra b

Responde a `Disenador_para_PREPARADOR_2026-10-04_a.md`. Lo que pido a Claude Code está en `PREPARADOR_para_ClaudeCode_2026-10-04_b.md`.

**Veredicto:** tus tres decisiones bajaron a Claude Code. La pieza del núcleo de la 4/5 va **ahora**, como sugeriste: es chica, y sin ella no se puede contar cuántas 4/5 se ofrecerían. La vista sigue siendo tuya. Abajo, los detalles que definí yo y tres hallazgos que piden tu decisión, cada uno con valor por defecto. Ninguno frena nada.

## 1 · Lo que definí yo en los detalles

Cada uno se cambia con un número o una línea de `config/reglas.json`.

| Tema | Tu propuesta | Cómo quedó | Por qué |
|---|---|---|---|
| Dónde mira el molde "a qué hora juega" | Al principio del título | En cualquier parte | Los títulos reales lo ponen después de los dos puntos ("Boca vs. River: a qué hora juega…"). La frase entera ya es precisa: no agarra "a qué hora votan en Brasil" |
| Efemérides y lotería | Al principio | Al principio | Así no se llevan "Polémica por las efemérides que sacó el Gobierno" ni "Resultado de la auditoría en la Lotería" |
| Qué es "lotería" | — | Solo títulos con la palabra "lotería" y un resultado | Quini 6, Loto, Brinco y "sorteo" solo quedan afuera del molde. Claude Code los cuenta; si querés sumarlos, lo decidís con esos números |
| Las 4/5 y la IA | Pasan por la IA cuando exista | Se juzgan igual que un candidato (criterios 3 a 6) y salen **por bloque**, nacional e internacional | Sin juicio no se sabe a qué bloque van. Ojo para tus 5 preguntas de la IA: también va a juzgar estas |
| Las 4/5 y los topes | — | Sin cupo, sin tope por sección ni por país | Es un menú: la persona elige. Nunca entran solas ni para llegar al mínimo de 3 |
| "Solo 4/5" | Una 3/5 no | `faltanMedios: 1` | Si algún día querés ofrecer 3/5, es un 2 |
| Una 4/5 con 1 firma, si `minFirmas` sube a 2 | — | Se puede elegir a mano | No entra por la vía B, así que es como una sin firma |

Cómo queda el camino de una noticia, de punta a punta:

| Paso | Qué sale |
|---|---|
| `preparar` | `candidatos` (5 o más medios, o firma) · **`elegiblesAMano` (les falta 1 medio)** · el resto en observación |
| IA que juzga | Juzga `candidatos` **y** `elegiblesAMano` |
| `decidir` | Nacionales e internacionales (3 a 7) · **`aMano`, por bloque, con "Confirmada por 4 medios · elegida a mano"** · reserva · descartadas |

Para que se vea en la demo, el día de ejemplo suma dos noticias inventadas con 4 de 5: una nacional (andinistas rescatados en el Aconcagua) y una internacional (emergencia hídrica en Chile). Las internacionales siguen en 5 aunque el cupo sea 7: es la prueba de que no rellena.

## 2 · Hallazgos que piden tu decisión

**A · Las reglas viejas de "quiniela" y "horóscopo" son sueltas.** Sacan cualquier título que diga esa palabra. Lo probé: "Detienen al dueño de una agencia de quiniela por lavado" hoy queda afuera como si fuera la quiniela del día. Es lo contrario de lo que Alejo pidió para los moldes nuevos ("precisos, para no llevarse noticias de verdad"). Claude Code va a contar cuántas notas reales saca cada una y si alguna es noticia.
Opciones: (1) dejarlas como están; (2) volverlas precisas como los moldes nuevos. **Valor por defecto: (1)**, hasta ver los números.

**B · Brasil, el caso límite.** Claude Code juzgó que las 12 notas de Brasil (avances, votación y resultados en vivo de la jornada electoral) son **una sola noticia**, y pidió que, si pensás distinto, lo digas. Importa porque define qué es "el mismo hecho" en un día con muchas actualizaciones. Mi lectura: para quien publica, "elecciones en Brasil" es una noticia. **Valor por defecto: una sola noticia.** Contestá solo si no estás de acuerdo.

**C · Caso borde de la vía B.** Una 4/5 que entra por la vía B, pero cuya firma no vale para su bloque (un autor solo nacional en una noticia internacional), se descarta y no se ofrece a mano. Solo puede pasar con `firmas.json` llena, y hoy está vacía. **Valor por defecto: así.**

## 3 · Lo que viene en el reporte de Claude Code (letra j)

- Cuántas notas saca cada molde, con títulos para revisar a ojo, y si desaparecen las 2 uniones falsas de 3 grupos.
- Cuántas 4/5 se ofrecerían con lo guardado (si las notas siguen frescas).
- Las variantes de servicio que los moldes no agarran ("dónde ver", "a qué hora corre", Quini 6, "un día como hoy"), contadas, para que decidas si se suman.
- De qué feed salió la Lotería del Cauca, que es colombiana. Lo más probable es Infobae, que tiene edición Colombia, pero no está comprobado. Si es así, el feed de Infobae mezcla ediciones de otros países, como el del Cronista, y esas notas cuentan para verificar. Lo mido antes de proponer nada.

Cuando llegue, te escribo la letra c con eso traducido.

## 4 · Lo tuyo que sigue igual

- Diseño de la entrega cada 4 h. Ahora incluye la vista de las 4/5: el núcleo ya va a dar `aMano` por bloque, con su etiqueta.
- Las 5 preguntas de la IA que juzga (también juzga las 4/5).
- Alternativas a la lista de firmas.
- Ventanas de tiempo para corridas cada 4 h.
