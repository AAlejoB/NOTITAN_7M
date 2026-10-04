# Pendientes

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**Alejo**
- [ ] Nombres para la lista de firmas (`config/firmas.json`): nombre y si vale para nacional, internacional o los dos. **Sin apuro**: Alejo no los tiene a mano. Mientras esté vacía, la vía B no hace nada. Hay alternativas para el DISEÑADOR (abajo).
- [ ] Decidir si los 10 feeds internacionales extra entran a la lista blanca (`config/feeds.json`, sección `extras`).

**DISEÑADOR**
- [ ] Diseñar la entrega para quien lo usa cada 4 horas (el caso de la hermana de Alejo, canal de comunicaciones): qué ve, en qué orden, cómo elige cuántas noticias (3 a 7), cómo se ve la segunda página.
- [ ] Diseñar las 5 preguntas de la IA que juzga (fresco o dato nuevo, fuente con nombre, interés público, nacional o internacional, desmentido).
- [ ] **Cálculo de verificación en lugar de "5 grupos fijos".** Alejo: "no tiene que ser a rajatabla"; si no salió en los 3 o 5 portales más conocidos, no entra; pero una noticia confirmada por 4 y otra por 3 podrían tratarse con algún cálculo. Hoy: cada grupo de medios vale 1 y hacen falta 5 (`minGrupos`). Para pensar, sin decidir todavía:
  - ¿Un peso por portal (los más conocidos o confiables valen más), y quién lo arma?
  - ¿Un umbral de puntaje en vez de 5? Ejemplo 1: 4 grupos y los 4 son de los más conocidos. Ejemplo 2: 4 grupos y los 4 son chicos o regionales. ¿Pasan igual?
  - ¿Dónde entra lo que queda con puntaje intermedio, por ejemplo en la segunda página con una etiqueta tipo "Confirmada por 4 medios"?
  - ¿Cómo se le explica el cálculo a quien compra el programa?
  - Relacionado con la decisión ya anotada en `CLAUDE.md`: "excepción manual para una 4/5".
  - Para Claude Code, cuando esté definido, es un cambio acotado: un `peso` por portal en `portales.json`, el umbral en `reglas.json` y ajustar `gruposIndependientes`, con tests.
- [ ] **Alternativas a la lista de firmas hecha a mano.** Opciones para pensar:
  - A: la lista manual de hoy.
  - B: reputación por trayectoria. Una firma sería reconocida si aparece firmando en varios portales de la lista blanca durante un período. Se arma sola con el campo `firma` que va a traer el lector y Alejo solo aprueba o descarta. Cuidado: popularidad no es confiabilidad, y habría que sacar firmas genéricas ("Redacción", "Agencias").
  - C: fuentes externas (premios, bases de datos de autores). Sin investigar ni probar.
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
- [x] 04-10-2026 · Cantidad de noticias por bloque elegible de 3 a 7.
- [x] 04-10-2026 · Segunda página confirmada por Alejo: alcanza con 1 autor de la lista, y se nombran hasta 2 (ver `ClaudeCode_para_PREPARADOR_2026-10-04_b.md`).
- [x] 04-10-2026 · Buzón armado en el repo, con el ciclo de cada tanda en `ARRANQUE.md`.
