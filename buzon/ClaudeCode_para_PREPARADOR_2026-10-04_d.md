# Claude Code → PREPARADOR · 04-10-2026 · 10:58 (hora de Argentina) · letra d

**Reemplaza** lo que la `c` decía de `ARRANQUE.md` y del método de trabajo. El resto de la `c` sigue valiendo.

**Veredicto:** Alejo pidió que el arranque de cada bloque sea un archivo por rol. Hecho. Solo documentos, sin cambios de código; `npm test` sigue en 52 bien y 1 pendiente a propósito.

## Qué decidió Alejo sobre el método

- Un `LEEME_<ROL>.md` por bloque. `ARRANQUE.md` quedó como un aviso de que fue reemplazado.
- **El DISEÑADOR** es el primer bloque: diseña con artifacts, le pregunta a Alejo todo lo posible, explica dimensiones y es lo visual. Le escribe solo al PREPARADOR.
- **El PREPARADOR** es el del medio: organiza y gestiona, usa lo visual del DISEÑADOR para llevar un pedido limpio a Claude Code, es el más incisivo y el más preciso, y usa el nivel más alto de los tres.
- **Claude Code** habla solo con el PREPARADOR. El DISEÑADOR y Claude Code nunca se hablan directo.
- Modelos: Opus 5.5 con esfuerzo alto (quizás máximo) en DISEÑADOR y PREPARADOR; Sonnet 5.5 en Claude Code.

## Qué cambió en los archivos

- `LEEME.md`: ahora es la parte común. Tiene la tabla de quién habla con quién, los modelos, los nombres de archivo, las reglas, el ciclo de cada tanda y los tres textos para pegar.
- `LEEME_DISENADOR.md`, `LEEME_PREPARADOR.md`, `LEEME_CLAUDECODE.md`: cada uno dice qué es el bloque, con quién habla, qué lee al arrancar y qué escribe.
- Se agrega el nombre `PREPARADOR_para_Disenador_<fecha>_<letra>.md` y se saca `ClaudeCode_para_Disenador_*`.
- La regla de preguntas a Alejo ahora se reparte por bloque. Antes decía "una sola por ronda" para todos.
- `CLAUDE.md` quedó al día con la misma estructura.

## Para revisar

- En ST las capturas van de Claude Code directo al DISEÑADOR (decidido el 29-09). Acá se sacó ese camino porque Alejo dijo que nunca se hablan directo. Si más adelante hacen falta capturas, las pide el PREPARADOR.
- Los `LEEME_` son borradores armados con lo que Alejo contó. El formato del pedido en ST es más largo (área, base de commit y blob, checklist numerada, orden de despliegue); acá va una versión corta.

## Lo que sigue

Sin cambios: `buzon/pendientes.md`. Nada empezado.
