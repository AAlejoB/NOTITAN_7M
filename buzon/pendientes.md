# Pendientes

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**Capa 4 y calidad del agrupador** (medido con datos reales el 04-10, ver `CLAUDE.md`)
- [x] ~~Umbral del agrupador.~~ Hecho: `umbralSimilitud` 0.3 con `umbralSeguro` 0.5 y `minPalabrasComunes` 3. Sobre lo acumulado (1.150 notas) con 0.5 hay 0 verificados y con 0.3 hay 2, sin uniones falsas entre los hechos de 5 o más grupos.
- [ ] **Cuántas noticias da la regla de 5 en un día real** (pide el DISEÑADOR): con lecturas cada 30 minutos de un día entero, por bloque y por corte de 4 h, cuántos hechos llegan a 5 o más grupos, cuántos quedan en 4/5 sin firma y cuántos tienen firma. Las 4/5 que se ofrecerían salen de `resumen.elegiblesAMano` (con lo guardado el 04-10 a las 18:02 son 4, todas frescas). Sin apuro: depende de la capa 4.
- [ ] **Hechos partidos.** Colapinto en Malasia/Bahréin sale como un hecho de 4 grupos y otro de 3 que son la misma carrera. Es el límite del agrupador por palabras; lo resuelve el agrupado por significado (opción B de abajo) o la IA que juzga los grupos dudosos. Con los moldes puestos (04-10, 18:02) sigue igual: dos hechos de 4 grupos que, juntos, serían 5 o 6.
- [ ] **Guardar lo leído entre corridas: queda solo lo de capa 4.** Cada cuánto leer (valor por defecto: cada 30 minutos) y dónde se guarda el archivo (n8n). Le toca al DISEÑADOR con Don Julio. La pieza para acumular ya está hecha: `acumular` y `npm run leer -- --acumular datos/notas.json` (48 h, `datos/` no se sube al repo).

**Alejo**
- [ ] Nombres para la lista de firmas (`config/firmas.json`): nombre y si vale para nacional, internacional o los dos. **Sin apuro**: Alejo no los tiene a mano. Mientras esté vacía, la vía B no hace nada. Hay alternativas para el DISEÑADOR (abajo).
- [ ] Opcional: borrar la rama vieja `claude/quirky-bell-pkumz7`, que ya no se usa. Se hace desde GitHub; Claude Code no la toca.
- [ ] **El repo es público.** Alejo decide si pasa a privado. Revisado el 04-10-2026: no hay claves ni tokens; el historial solo tiene como autor a "Claude <noreply@anthropic.com>" (ningún correo personal); los correos de los tests son inventados; el único workflow de GitHub solo corre `npm test`. Sí se ve: la lógica de verificación y las reglas (lo que se piensa vender), las decisiones de Alejo, y menciones a su hermana, a Don Julio y al plan de vender el programa. La lista de firmas, cuando se llene, también sería pública. Si pasa a privado, confirmar que la app de Claude en GitHub y los chats de Cowork sigan teniendo acceso. **Valor por defecto:** sigue público hasta que Alejo decida. Si pasa a privado, la línea de arranque con el link deja de andar y se vuelve al paquete.
- [ ] Decidir si los 10 feeds internacionales extra entran a la lista blanca (`config/feeds.json`, sección `extras`). Va junto con el riesgo de abajo.
- [ ] **Riesgo en INTERNACIONAL: margen e idioma.** Con solo medios internacionales hay 6 grupos con feed y se exigen 5. Dos de esos 6 (The Guardian y Al Jazeera) publican en inglés y el agrupador compara palabras: sin ellos quedan 4 en español. El motor cuenta hoy cualquier medio de la lista para cualquier noticia (verificado: 3 internacionales + 2 argentinos dan 5 de 5), así que una internacional puede sumar los 11 grupos argentinos. Opciones:
  - A: sumar a la lista blanca los 7 extras en español (Euronews, RFI, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos). Cuesta poco, los feeds ya andan. Ojo: 5 son de España.
  - B: agrupado multilengua, comparar significado y no palabras. Resuelve también The Guardian, Al Jazeera y los extras en inglés (NYT, Sky News, NPR). Más caro: hace falta embeddings o una IA. Es el pendiente de los sinónimos.
  - C: que cuenten los medios argentinos para una internacional, como está hoy, o decidir que no. Es la decisión "argentinos afuera / qué es INTERNACIONAL" de `CLAUDE.md`.
  - Primera medición con datos reales: en las notas leídas, la noticia de Brasil la cubren 10 grupos argentinos y 4 internacionales (2 en inglés, The Guardian y Al Jazeera). Sin contar a los argentinos no se verifica: quedan 2 internacionales en español. Se verifica porque cuentan los medios argentinos.
  - **Valor por defecto si Alejo no decide:** C como está hoy, sin extras, y medir con datos reales cuando exista el lector cuántas internacionales llegan a 5 por corrida. Si son menos de 3 (el mínimo que se puede elegir), pasar a A; B queda para más adelante.

**DISEÑADOR**
- [ ] Diseñar la entrega para quien lo usa cada 4 horas (el caso de la hermana de Alejo, canal de comunicaciones): qué ve, en qué orden, cómo elige cuántas noticias (3 a 7), cómo se ve la segunda página. **Incluye la vista de las 4/5** ("En observación · les falta 1 medio" con "Llevármela igual"): el núcleo ya da `aMano` por bloque, con su etiqueta.
- [ ] Diseñar las 5 preguntas de la IA que juzga (fresco o dato nuevo, fuente con nombre, interés público, nacional o internacional, desmentido). Ojo: también juzga `elegiblesAMano` (las 4/5), no solo `candidatos`.
- [ ] **Reglas viejas de título (`quiniela`, `horoscopo`) sueltas:** sacan cualquier título con esa palabra, también noticias de verdad (ej.: "Detienen al dueño de una agencia de quiniela"). ¿Se vuelven precisas como los moldes nuevos? Medido el 04-10 sobre 1.277 notas: `quiniela` sacó 0, `horoscopo` sacó 2 por título (más 1 por url `/horoscopo/`) y `dolar hoy` sacó 6; ninguna era noticia de verdad. El caso peligroso no apareció en estos datos, pero sigue siendo posible. **Valor por defecto:** quedan como están.
- [ ] **Variantes de servicio que los moldes no agarran** (medido el 04-10, notas que pasan el criterio 1): "a qué hora" 6 (las 6 son de elecciones en Brasil y Perú, ninguna de partidos), "dónde ver" 6 (4 de TN con la plantilla "hora, dónde ver y formaciones" de partidos, 1 de béisbol y 1 falsa: "donde Verstappen"), "cómo ver" 3, "horario" 4, "sorteo" 6 (Chontico, Telekino, Quini 6, Triplex y Super Once, Bonoloto), "quini" 2 (el pozo del Quini 6 y Quinigol), "loto" 0 como palabra (9 con la cadena, pero son "piloto", "molotov", Lototurf y Bonoloto), "un día como hoy", "santoral", "lotería" y "baloto" 0. ¿Se suma alguna? **Valor por defecto:** no.
- [ ] **El feed de Infobae mezcla ediciones de otros países, como el del Cronista.** De 341 notas guardadas, 282 (83 %) son de `/espana/` (76), `/peru/` (72), `/america/` (69), `/mexico/` (38) y `/colombia/` (27); la Lotería del Cauca salió de `/colombia/`. Todas cuentan como Infobae para verificar. Ojo: `/america/` trae noticias internacionales de verdad (la elección de Brasil), así que excluirla no es obvio. ¿Se excluyen esas rutas como en el Cronista? **Valor por defecto:** no.
- [ ] **Caso borde de la vía B con la 4/5:** una 4/5 que entra por la vía B pero cuya firma no vale para su bloque (un autor solo nacional en una noticia internacional) se descarta y no se ofrece a mano. Solo pasa con `firmas.json` llena. **Valor por defecto:** así.
- [ ] **Notas con fecha futura:** 3 de 1.277 (2 de Página/12 con la fecha de la edición del lunes, 5/10 00:01, y 1 de La Nación 18:53 cuando eran las 18:02). Hoy cuentan como frescas. **Valor por defecto:** no se hace nada hasta que moleste.
- [ ] **Alternativas a la lista de firmas hecha a mano.** Opciones para pensar:
  - A: la lista manual de hoy.
  - B: reputación por trayectoria. Una firma sería reconocida si aparece firmando en varios portales de la lista blanca durante un período. Se arma sola con el campo `firma` que va a traer el lector y Alejo solo aprueba o descarta. Cuidado: popularidad no es confiabilidad, y habría que sacar firmas genéricas ("Redacción", "Agencias").
  - C: fuentes externas (premios, bases de datos de autores). Sin investigar ni probar.
- [ ] Decidir las ventanas de tiempo para corridas cada 4 horas. Hoy son 48 h de recolección y 24 h de frescura, pensadas para una corrida por día.

**PREPARADOR → Claude Code**
- [ ] Memoria de lo ya entregado: con corridas cada 4 h, la misma noticia vuelve a salir en la corrida siguiente porque el motor no recuerda. Hace falta pasarle la lista de hechos ya entregados, o marcar cuáles son nuevas desde la última corrida. **Espera el diseño de la entrega (DISEÑADOR): ocultar o marcar, por persona, cuánto dura.**
- [ ] LN+: reintentar el feed con Network access en Full. Si anda, sacarle `activo: false`, sumarlo a `config/feeds.json` y sacarlo de `sinFeed`.

**Más adelante**
- [ ] Portales y firmas por país, para vender a otros países (Uruguay, por ejemplo).
- [ ] Fotos y armado de publicaciones (hoy se hace a mano en Canva). Las fotos de los portales tienen derechos: antes de automatizar hay que definir de dónde salen las imágenes.
- [ ] Mejorar el agrupador para notas en otro idioma (hoy compara palabras).

## Hecho

- [x] 04-10-2026 · **Decisión de Alejo (carta del DISEÑADOR `a`, 1.1): la verificación queda en 5 grupos fijos, sin cálculo.** Se cierra el pendiente del cálculo: no hay peso por portal, ni umbral de puntaje, ni segunda página automática con "Confirmada por 4 medios". `minGrupos` sigue en 5. Anotado en `CLAUDE.md`.
- [x] 04-10-2026 · Notas de servicio con plantilla afuera del criterio 1: 3 moldes en `criterio1.notasDeServicio` (horario de partido, efemérides, resultados de lotería), con motivo `nota_de_servicio (<nombre>)`. Medido con los moldes puestos: sacan 7 notas (3, 3 y 1), ninguna era noticia, y las 2 uniones falsas de 3 grupos desaparecen (hechos de 3 grupos: 10 → 8). Ver `ClaudeCode_para_PREPARADOR_2026-10-04_j.md`.
- [x] 04-10-2026 · Excepción a mano para una 4/5, pieza del núcleo: `elegiblesAMano` en `preparar` y `aMano` en `decidir`, con la etiqueta "Confirmada por N medios · elegida a mano". Sin cupo ni topes; nunca entra sola. La vista espera el diseño de la entrega.
- [x] 04-10-2026 · `npm run leer` muestra qué sacó el criterio 1 por motivo y tiene `--sin-notas-de-servicio`; con `--detalle` lista los títulos sacados por una regla de título.
- [x] 04-10-2026 · Perilla del agrupador (`umbralSeguro`, `minPalabrasComunes`) y `--min-comunes`/`--detalle` en `npm run leer`; `umbralSimilitud` baja de 0.5 a 0.3 con el resultado de la medición (V1, V2 y V3; ver `ClaudeCode_para_PREPARADOR_2026-10-04_i.md`).
- [x] 04-10-2026 · Los 6 portales sin feed (Reuters, AP, AFP, EFE, La Voz y LN+) quedan `activo: false`: el aviso de "¿feed roto?" ya no los nombra. El día de ejemplo usa medios argentinos para lo internacional (opción C).
- [x] 04-10-2026 · `acumular` y `npm run leer -- --acumular datos/notas.json`: lo leído se junta entre lecturas y se verifica sobre 48 h.
- [x] 04-10-2026 · Paquetes para pegar en Cowork (`npm run paquete`): un archivo por rol en `buzon/paquetes/`, para cuando el chat no tiene el repo conectado.
- [x] 04-10-2026 · Feeds probados y lista real en `config/feeds.json`.
- [x] 04-10-2026 · Vía B (firma reconocida) en el núcleo, con `config/firmas.json` vacía.
- [x] 04-10-2026 · Cantidad de noticias por bloque elegible de 3 a 7.
- [x] 04-10-2026 · Segunda página confirmada por Alejo: alcanza con 1 autor de la lista, y se nombran hasta 2 (ver `ClaudeCode_para_PREPARADOR_2026-10-04_b.md`).
- [x] 04-10-2026 · Los chats de Cowork ven `buzon/`: `claude/trusting-knuth-brmpsy` es la rama principal del repo en GitHub (Alejo la configuró y se verificó), con una sola sesión de Claude Code.
- [x] 04-10-2026 · Lector `src/lector.js` y `npm run leer`: 19 de 19 feeds leen bien con datos reales (1.018 notas).
- [x] 04-10-2026 · Buzón armado en el repo: `LEEME.md` (reglas, ciclo de cada tanda) y un `LEEME_` por bloque. Todo pasa por el PREPARADOR.
