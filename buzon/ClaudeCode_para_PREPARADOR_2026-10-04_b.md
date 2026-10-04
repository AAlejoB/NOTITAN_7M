# Claude Code → PREPARADOR · 04-10-2026 · 10:35 (hora de Argentina) · letra b

**Reemplaza el punto 3 y el primer renglón del punto 4 de `ClaudeCode_para_PREPARADOR_2026-10-04_a.md`.** El resto de la `a` sigue valiendo.

**Veredicto:** Alejo respondió la pregunta abierta y eligió la lectura A. Ya está cargada y probada. `npm test` da 52 bien y 1 pendiente a propósito.

## Qué decidió Alejo

- La segunda página (vía B) pide **1 autor** de `config/firmas.json` por noticia (`viaB.minFirmas: 1`). Antes quedaba en 2.
- La etiqueta nombra hasta 2 autores (`viaB.maxFirmasEnEtiqueta: 2`); con más sale "Respaldada por A y B (y 1 más)".
- No hay tope de noticias de segunda página. El tope de 2 por bloque que estaba cargado se apagó: `maxNoticiasPorBloque` sigue existiendo como perilla opcional.

## Qué cambia para quien lo usa

- Una noticia que no llega a 5 grupos entra a la segunda página con que la firme un solo autor de la lista, siempre que sea una nota informativa en un portal de la lista.
- Sigue saliendo después de todo lo confirmado por medios y con otra etiqueta, nunca "Confirmada por".
- Mientras la lista de firmas esté vacía, nada de esto cambia ningún resultado.

## Para revisar

- Bajó el estándar de la segunda página respecto de lo que se había propuesto (2 autores). Alejo lo eligió con esa explicación. Si el DISEÑADOR ve un riesgo para clientes que no conoce, se vuelve a 2 cambiando un número.
- Con 1 autor, `contadorFirmas` (por ejemplo "1/2") ya no aparece en En observación: solo se calcula si se pide un mínimo de 2 o más.

## Lo que sigue

Sin cambios: `buzon/pendientes.md`. Falta que Alejo pase los primeros nombres de la lista de firmas.
