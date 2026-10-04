# Claude Code → PREPARADOR · 04-10-2026 · 14:01 (hora de Argentina) · letra f · cierre de tanda

**Veredicto:** el lector está hecho y anda con los 19 feeds reales. Al probarlo con datos de verdad apareció un problema más grande que el lector: **casi no se verifica nada**. Necesita decisión antes de seguir con la IA que juzga. `npm test` da 69 bien y 1 pendiente a propósito (eran 52).

## Qué se hizo

- `src/lector.js`: convierte cada feed en notas `{id, titulo, bajada, url, portal, fecha, seccion, etiqueta, firma, feed}`. Parsea RSS y Atom sin dependencias, decodifica entidades (también las dobles), saca los parámetros de seguimiento de los links, descarta la misma nota repetida y las que no tienen título, link o fecha. El portal sale del campo `dominio` de `feeds.json`. Un feed caído no frena a los demás: se lista y se avisa.
- `config/feeds.json`: El Cronista lleva `excluirRutas` (`/espana/`, `/mexico/`, `/colombia/`, `/usa/`). Hoy descarta 28 de 100 notas.
- `scripts/leer.js` (`npm run leer`): lee los feeds reales y dibuja el embudo del núcleo con datos de verdad. Opciones: `--json notas.json` y `--umbral 0.3` (prueba otro umbral sin tocar la configuración).
- 17 tests nuevos, con feeds sintéticos modelados sobre los reales, incluida una prueba de punta a punta lector → núcleo (5 grupos, y vía B por el autor del feed). Rompí a propósito 6 piezas del lector y los tests las atraparon todas.
- Marqué como resuelto lo de que Cowork vea `buzon/`, a pedido de la sesión original.

## Hallazgo con datos reales (foto de las 14:00 del 04-10)

1.018 notas leídas, 735 hechos. Con el umbral actual (0.5): **0 verificados**. Dos causas:

1. **Ventanas de tiempo distintas.** Cada feed abarca un tiempo muy diferente: Clarín 0,5 h, Infobae 1,2 h, Olé 3 h, Noticias Argentinas 4,2 h, Al Jazeera 5,4 h; La Nación, Perfil y La Gaceta 11 a 13 h; el resto de 20 h a días. En una lectura, los 19 coinciden solo en la última hora. Hace falta guardar lo leído y verificar sobre 24 h acumuladas.
2. **El agrupador casi no junta.** La noticia del día (elecciones de Brasil) la cubren 14 medios y con 0.5 se parte en 45 pedazos. Con 0.3 queda en un hecho de 6 o 7 grupos y salen 2 verificados. Revisé a ojo los hechos de 3 o más notas con 0.3: son casi todos la misma noticia. Con 0.25 aparecen uniones falsas (partidos de fútbol distintos). Una variante con peso por rareza de las palabras no mejoró.

| Umbral | Hechos | Con 3 o más grupos | Con 5 o más grupos |
|---|---|---|---|
| 0.5 (actual) | 795 | 0 | 0 |
| 0.4 | 775 | 4 | 1 |
| 0.3 | 737 | 7 | 2 |
| 0.25 | 697 | 15 | 2 |

También se confirmó que Brasil se verifica solo porque el motor cuenta a los medios argentinos (opción C del pendiente): en las notas leídas la cubren 10 grupos argentinos y 4 internacionales, dos de ellos en inglés.

## Para decidir (en `pendientes.md`, arriba de todo)

- **Umbral del agrupador.** Valor por defecto propuesto: 0.3. Es un número en `config/reglas.json`, más ajustar el día de ejemplo y los tests que asumen 0.5. No lo toqué porque no era parte del pedido.
- **Guardar lo leído entre corridas.** Es capa 4 (n8n y Don Julio) y es la misma pieza que la memoria de lo ya entregado.

## Para revisar

- Lo que Claude Code decidió por su cuenta: la bajada se recorta a 300 caracteres; `seccion` sale del primer tramo del link y, si no, de la primera categoría; `etiqueta` junta las categorías para que el criterio 1 descarte "opinión"; una fecha más de 12 h en el futuro se descarta; el `id` es un hash de 16 caracteres del link, sin usar `crypto`.
- La medición es una sola foto. Los números cambian con la hora del día.
- Sigue pendiente marcar `activo: false` a Reuters, AP, AFP y EFE: el aviso de "feed roto" las lista en cada corrida.

## Lo que sigue

Nada empezado. Esta tanda queda cerrada: todo escrito y pusheado, y se avisó a Alejo para que la sesión original iguale la rama principal.
