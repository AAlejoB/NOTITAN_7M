# PREPARADOR → DISEÑADOR · 04-10-2026 · 18:20 (hora de Argentina) · letra c

Traduce `ClaudeCode_para_PREPARADOR_2026-10-04_j.md`. Si no leíste la letra `b`, leela antes: esta la continúa.

**Veredicto:** tus 3 decisiones ya están hechas y probadas (123 tests bien). Los moldes funcionan: sacaron 7 notas, ninguna era noticia, y las 2 uniones falsas desaparecieron. Pero la medición deja ver dos problemas más grandes que los moldes: **la misma carrera de Colapinto aparece dos veces en el menú de las 4/5**, y **el 83 % del feed de Infobae es de otros países**. Te pido dos decisiones, cada una con su valor por defecto. El resto lo cierro yo.

## 1 · Qué daría el botón hoy

Sobre 1.277 notas reales acumuladas (de 2/10 18:12 a 4/10 18:02, un fin de semana), sin la IA:

| Qué | Cuántas | Cuáles |
|---|---|---|
| Confirmadas (5 o más medios) | **2** | Brasil (6 medios) y García Cuerva en Luján (6) |
| Para elegir a mano (4 de 5) | **4** | Colapinto en Malasia · "Una carrera loca…" de Colapinto en Sepang · ventas minoristas de septiembre · Milei siguiendo la elección en Brasil |
| Hechos en total | 1.034 | 983 salieron en un solo medio |

Dos de las 4 del menú son **la misma carrera**: quien use el botón la vería repetida. Juntas sumarían 5 o 6 medios y saldrían solas como "Confirmada", sin necesidad de elegirlas a mano.

Lo que cambiaron los moldes (A sin moldes, B con moldes):

| Hechos según cuántos medios | A | B |
|---|---|---|
| 1 | 982 | 983 |
| 2 | 37 | 37 |
| 3 | 10 | **8** (las 2 uniones falsas desaparecieron) |
| 4 | 4 | 4 |
| 5 o más | 2 | 2 |

## 2 · Decisiones que te pido

### 2.1 · Hechos partidos: ahora se ven, y repetidos

Ya estaba en `pendientes.md`, pero cambió de peso: antes solo se perdía una confirmada; con el menú de las 4/5, además, la misma noticia sale dos veces. El agrupador compara palabras, y los dos títulos de Colapinto casi no comparten ninguna ("Gran Premio de Malasia" contra "Sepang", "13°" contra "carrera loca"). Ninguna regla de palabras lo arregla sin juntar cosas que no son.

| Opción | Qué es | Costo |
|---|---|---|
| A | Sumar a la IA que juzga una pregunta más: "¿estos dos hechos son la misma noticia?", solo para hechos de 3 o 4 medios que comparten una persona o un lugar | Sale con el diseño de las preguntas de la IA, que ya es tuyo |
| B | Agrupar por significado (embeddings), no por palabras. Resuelve también las notas en inglés | Más caro; hace falta un servicio aparte |
| C | Esperar, y mientras tanto aceptar el menú con repetidas | Nada |

**Valor por defecto: A**, como sexta pregunta de la IA. Mientras no exista la IA, queda C.

### 2.2 · Infobae trae ediciones de otros países

De 341 notas de Infobae, 282 son de otra edición:

| Ruta | Notas | Qué trae |
|---|---|---|
| `/espana/` | 76 | Noticias locales de España |
| `/peru/` | 72 | Noticias locales de Perú |
| `/america/` | 69 | Internacionales de verdad (por ejemplo, la elección de Brasil) |
| `/mexico/` | 38 | Noticias locales de México |
| `/colombia/` | 27 | Noticias locales de Colombia (de ahí salió la Lotería del Cauca) |

Todas cuentan como "Infobae" para confirmar. Además, parte del servicio que los moldes no agarran parece venir de esas ediciones: de los 6 "sorteos" que pasaron, 4 son juegos de Colombia y España (Chontico, Super Once, Triplex de la Once, Bonoloto). Que salgan de Infobae no está comprobado; Claude Code lo mide en la próxima ronda.

Con El Cronista ya se hizo lo mismo: se sacan sus ediciones de España, México, Colombia y Estados Unidos (`excluirRutas`).

| Opción | Qué es |
|---|---|
| A | Sacar `/espana/`, `/peru/`, `/mexico/` y `/colombia/`, como en el Cronista. `/america/` se queda |
| B | Dejar todo como está |

**Mi recomendación: A.** Es la misma regla que el Cronista y deja la sección internacional de verdad. Claude Code tiene la decisión anotada con valor por defecto B; si elegís A, en la próxima ronda la hace y mide antes y después (cuántos hechos de 3 o más medios pierden a Infobae). Si te parece que toca "qué es INTERNACIONAL" (decisión de Alejo), preguntale a él.

## 3 · Lo que cierro yo, salvo que digas otra cosa

| Tema | Qué mostró la medición | Cómo queda |
|---|---|---|
| Reglas viejas `quiniela` y `horoscopo` (hallazgo A de la letra `b`) | `quiniela` sacó 0 notas, `horoscopo` 2, `dolar hoy` 6. Ninguna era noticia | Quedan como están. Se reabre si aparece un caso real |
| Plantilla de partidos de TN ("…en vivo por la fecha 32: hora, dónde ver y formaciones") | 4 notas de TN pasan, más 3 "cómo ver" de otros medios (Argentina vs. Benín en La Nación, Vélez vs. Platense en Olé) | No sumo molde todavía: TN, Clarín y Olé son un solo grupo, así que solas no llegan a 5. Si las querés afuera, se suma "dónde ver / cómo ver" junto con "en vivo" o "formaciones" |
| "a qué hora" que quedó afuera del molde | Las 6 son de elecciones (Brasil y Perú) | Bien que no entren: confirma que el molde tiene que ser solo "a qué hora juega" |
| Ajuste del molde de lotería | El título real era "Resultado Lotería del Cauca hoy…", sin "de". Claude Code dejó el "de" opcional | Bien: sigue mirando cómo empieza el título |
| Notas con fecha futura | 3 de 1.277 (Página/12 fecha la edición impresa del día siguiente a las 00:01) | No es de diseño: lo tomo yo y lo paso a Claude Code |
| Brasil, caso límite (B de la letra `b`) y caso borde de la vía B (C) | Sin cambios | Siguen los valores por defecto |

Ojo con la decisión de deportes (de Alejo): 2 de las 4 del menú son de Fórmula 1. Si Alejo decide que deportes no entra, el menú de hoy quedaría en 2.

## 4 · Lo tuyo que sigue

- Diseño de la entrega, con la vista de las 4/5. Si elegís 2.1 C, contemplá que pueden salir repetidas.
- Las 5 preguntas de la IA (6 si elegís 2.1 A). Juzga `candidatos` y las 4/5.
- Alternativas a la lista de firmas.
- Ventanas de tiempo para corridas cada 4 h.
- Capa 4 con Don Julio: con 2 confirmadas en 48 h de fin de semana, leer seguido es lo que más puede sumar.
