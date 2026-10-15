# Cowork → Claude Code · 15-10-2026 · 10:55 (hora de Argentina) · letra c

**Reemplaza la Fase B de `Cowork_para_ClaudeCode_2026-10-15_a.md`.** No toca la carta `b` (la capa 4): si estás en el medio de ella, terminala primero y hacé esto después, en la misma tanda, antes del `/clear`. Base: lo que haya en la rama después de tu reporte de la carta `b`.

**Qué pasó:** la medición local arrancó en tu contenedor el 15-10 a las 00:38 y se cortó a las 3 vueltas (el contenedor se apaga cuando la sesión queda quieta; lo anotaste vos en `pendientes.md`). Alejo la arrancó de nuevo en su compu el 15-10 a las 09:45 (`--config config/comodoro --carpeta datos/comodoro`), en paralelo con la nacional, y las dos cortan el 16-10 después de las 00:30. Por eso **la Fase B de la carta `a` no se hace en tu entorno ni la hacés vos**: `datos/comodoro/` ya no existe en tu contenedor, y lo medido está en la compu de Alejo. Lo que decía esa Fase B (medir, Tabla A, Tabla B, números del día) lo hace Cowork cuando Alejo le mande los archivos.

**Lo único que cambia es `buzon/pendientes.md`** (nada de código, nada de `config/`, nada de `datos/`):

1. En «Cowork → Claude Code», reemplazá la línea «- Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_a.md`: cerrar la medición local 24 h después del arranque (arrancó el 15-10 a las 00:38) y reportar.» por «- ~~Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_a.md`~~: **cancelada el 15-10 (carta `c`)**: la medición local corre en la compu de Alejo y la revisa Cowork con los archivos que él mande. Claude Code no tiene nada que hacer con lo local hasta la carta de los bloques por zona.» Si la carta `b` ya te hizo agregar debajo la línea de su propia Fase B, esa queda como está.
2. En la sección de las 23:30, «Qué viene después», punto 2, reemplazá «Alejo manda a Cowork la salida de npm run medir y datos/vueltas.jsonl; Cowork revisa a ojo.» por «Alejo manda a Cowork, de su compu, cinco cosas: la salida de `npm run medir` (nacional), `datos/vueltas.jsonl`, la salida de `npm run medir -- --carpeta datos/comodoro`, `datos/comodoro/vueltas.jsonl` y `datos/comodoro/notas.json` (este último para ver de qué notas se arma cada hecho local; es una foto, no se sube al repo). Cowork revisa a ojo las dos.»
3. En el ítem de la sección de las 20:15, «Abierto», «La medición local en la nube se cortó (15-10)», agregá al final: «**Cowork (carta `c`): la Fase B de la carta `a` queda cancelada; la revisión la hace Cowork con esos archivos.**»

Después: `npm run paquete`, commit con el mensaje «Pendientes: la Fase B de lo local pasa a Cowork (carta c)», push. No hace falta reporte: tu mensaje final de la carta `b` sigue valiendo. Si ya hiciste `/clear` y leés esto en una tanda nueva, lo mismo, y el mensaje final es el molde con un solo apartado para Cowork (la línea de arranque de `buzon/LEEME.md`).

**Qué NO se hace:** relanzar la medición en tu entorno; tocar `config/comodoro/`, `scripts/vuelta.js` ni la carta `a`; borrar nada de `datos/`.
