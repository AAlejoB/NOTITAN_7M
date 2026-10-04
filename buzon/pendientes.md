# Pendientes

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**Alejo**
- [ ] Confirmar la segunda página (vía B). Ver pregunta en `ClaudeCode_para_PREPARADOR_2026-10-04_a.md`, punto 3. Hoy queda cargada la opción B.
- [ ] Pasar los primeros nombres de la lista de firmas (`config/firmas.json`): nombre y si vale para nacional, internacional o los dos.
- [ ] Decidir si los 10 feeds internacionales extra entran a la lista blanca (`config/feeds.json`, sección `extras`).

**DISEÑADOR**
- [ ] Diseñar la entrega para quien lo usa cada 4 horas (el caso de la hermana de Alejo, canal de comunicaciones): qué ve, en qué orden, cómo elige cuántas noticias (3 a 7), cómo se ve la segunda página.
- [ ] Diseñar las 5 preguntas de la IA que juzga (fresco o dato nuevo, fuente con nombre, interés público, nacional o internacional, desmentido).
- [ ] Decidir las ventanas de tiempo para corridas cada 4 horas. Hoy son 48 h de recolección y 24 h de frescura, pensadas para una corrida por día.

**PREPARADOR → Claude Code**
- [ ] `src/lector.js`: bajar los feeds de `config/feeds.json` y convertirlos en notas `{id, titulo, bajada, url, portal, fecha, seccion, firma}`. Descartar `/espana/`, `/mexico/`, `/colombia/` y `/usa/` del feed de El Cronista.
- [ ] Memoria de lo ya entregado: con corridas cada 4 h, la misma noticia vuelve a salir en la corrida siguiente porque el motor no recuerda. Hace falta pasarle la lista de hechos ya entregados, o marcar cuáles son nuevas desde la última corrida.
- [ ] Marcar `activo: false` en `portales.json` a Reuters, AP, AFP y EFE (sin feed) para que no avisen "feed roto" en cada corrida. Hay que ajustar el día de ejemplo y un test que usan esas agencias.

**Más adelante**
- [ ] Portales y firmas por país, para vender a otros países (Uruguay, por ejemplo).
- [ ] Fotos y armado de publicaciones (hoy se hace a mano en Canva). Las fotos de los portales tienen derechos: antes de automatizar hay que definir de dónde salen las imágenes.
- [ ] Mejorar el agrupador para notas en otro idioma (hoy compara palabras).

## Hecho

- [x] 04-10-2026 · Feeds probados y lista real en `config/feeds.json`.
- [x] 04-10-2026 · Vía B (firma reconocida) en el núcleo, con `config/firmas.json` vacía.
- [x] 04-10-2026 · Cantidad de noticias por bloque elegible de 3 a 7, y tope de 2 para la segunda página.
- [x] 04-10-2026 · Buzón armado en el repo.
