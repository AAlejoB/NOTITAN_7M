# Claude Code → PREPARADOR · 04-10-2026 · 10:24 (hora de Argentina) · letra a

Primer reporte, para que el PREPARADOR y el DISEÑADOR arranquen con el mismo contexto. Es un puntero a lo que ya está escrito, no una copia.

**Veredicto:** capas 1 y 2 hechas, capa 3 a la mitad (feeds probados, falta el lector). `npm test` da 51 bien y 1 pendiente a propósito. Nada de lo de abajo está sin probar.

## 1 · Dónde está cada cosa

- `CLAUDE.md`: decisiones de Alejo, estado y pendientes. Es la fuente. Lo lee Claude Code solo.
- `README.md`: cómo funciona y cómo se prueba.
- `config/reglas.json`, `config/portales.json`, `config/feeds.json`, `config/firmas.json`: todo lo que se cambia sin tocar código.
- `npm run demo`: dibuja el embudo de un día inventado. `npm run feeds`: prueba los feeds por internet.
- Dibujo del embudo (privado de Alejo): https://claude.ai/artifact/1x8EynL8rEGJV9i6DyiHFi

## 2 · Lo que Alejo pidió y cómo quedó

| Pedido | Estado |
|---|---|
| Noticias verificadas, con título, breve descripción y links | Hecho. Sale con "Confirmada por N medios". La descripción es la bajada del propio medio, sin IA, salvo que Alejo diga otra cosa. |
| Elegir cuántas noticias por bloque, de 3 a 7 | Hecho. `decidir(..., { reglas, cupo })`. Fuera de rango se acomoda y avisa. Si no se llega a 3, avisa y no se baja el estándar. |
| Segunda línea por firma reconocida, nacional e internacional | Hecho. 2 autores distintos de `config/firmas.json`, que está vacía. Sale "Respaldada por …" y va después de la vía A. |
| Segunda página con mínimo 1 y máximo 2 | Hecho a medias: ver punto 3. |
| Corridas cada 4 horas, para quien trabaja en comunicaciones | Anotado. Falta diseñarlo y falta la memoria de lo ya entregado. Ver `pendientes.md`. |

## 3 · Pregunta abierta para Alejo (una sola)

Alejo dijo: "un mínimo de un escritor y un máximo de dos". Se puede leer de dos maneras:

- **A:** cada noticia de la segunda página se respalda con 1 o 2 escritores. Alcanzaría con 1 (hoy se piden 2).
- **B (la que quedó cargada):** la segunda página muestra entre 1 y 2 noticias. Cada noticia sigue pidiendo 2 escritores y hay un tope de 2 noticias por bloque. El mínimo de 1 no se puede forzar: si ninguna llega, la segunda página queda vacía y se avisa.

Se pasa de una a otra cambiando números en `viaB` de `config/reglas.json`: A es `minFirmas: 1`; B es `minFirmas: 2` con `maxNoticiasPorBloque: 2`. B conserva el estándar actual; A lo baja.

Además, el 04-10 Alejo había dicho "que sean dos o tres internacionales, que sea de escritores". Claude Code lo tomó como 2 autores por noticia. Puede que quisiera decir 2 o 3 noticias. La pregunta de arriba lo cubre.

## 4 · Lo que Claude Code decidió por su cuenta (para que alguien lo revise)

- `viaB.minFirmas = 2` (Alejo dijo "dos o tres", quedó el valor más bajo de ese rango).
- `cupoMinimo = 3` es el piso de lo que se puede elegir y también el umbral del aviso por pocas noticias.
- Dentro de un bloque, la vía A va siempre antes que la B, aunque la B tenga más impacto.
- Con el cupo lleno, lo que sobra queda en Reserva con motivo `cupo`, aunque también habría caído por un tope de sección o de país.

## 5 · Lo que no se toca sin Alejo

`config/firmas.json` (la arma él), la lista blanca de `config/portales.json`, y todo lo de la sección "Decisiones que solo Alejo puede tomar" de `CLAUDE.md`.

## 6 · Lo que sigue

Ver `buzon/pendientes.md`, sección "PRÓXIMA RONDA". Lo más grande: el lector (`src/lector.js`) y el diseño de la IA que juzga.
