# Buzón de NOTITAN_7M

Tres roles, como en ST. Alejo es el relé: cada agente trabaja a su ritmo y Alejo lleva los archivos de uno a otro. Esta carpeta es la memoria compartida. Lo que no está acá ni en `CLAUDE.md`, no existe.

Borrador armado por Claude Code el 04-10-2026 a partir de lo que Alejo usa en ST. Alejo lo ajusta.

## Los tres roles

| Rol | Dónde trabaja | Qué hace | A quién le escribe |
|---|---|---|---|
| DISEÑADOR | chat de Cowork | Ideas, visuales, decisiones con Alejo. No escribe código. | PREPARADOR |
| PREPARADOR | chat de Cowork | Convierte las decisiones en un pedido exacto para Claude Code y revisa lo que vuelve. | Claude Code |
| Claude Code | este repo | Ejecuta, prueba y reporta. | PREPARADOR y DISEÑADOR |

## Nombres de archivo

`<DE>_para_<A>_<AAAA-MM-DD>_<letra>.md`. La letra empieza en `a` y sigue `b`, `c` si hay más de uno el mismo día.

- `Disenador_para_PREPARADOR_...`
- `PREPARADOR_para_ClaudeCode_...`
- `ClaudeCode_para_PREPARADOR_...`
- `ClaudeCode_para_Disenador_...` (solo datos y capturas, nada para implementar)

## Reglas

1. **Al empezar cada turno**, cada agente lee todo lo que sea más nuevo que lo último que leyó, aunque Alejo no se lo haya pegado. Claude Code hace `git pull` antes.
2. **Un paquete por ronda.** Si el DISEÑADOR y Claude Code trabajan a la vez, el PREPARADOR espera a los dos antes de escribir de nuevo. Excepción: algo que bloquea a otro (un error de seguridad, un dato equivocado).
3. **Lo enviado no se reescribe.** Si algo cambia, va en un archivo nuevo con letra nueva y la primera línea dice qué reemplaza.
4. **La lista de la próxima ronda vive en `pendientes.md`.** Todo lo que llega y no sale ya se anota ahí en el momento.
5. **La hora es la de Argentina**, sacada con `TZ=America/Argentina/Buenos_Aires date`. El contenedor muestra UTC (Argentina más 3 h). Va en el encabezado de cada archivo.
6. **Una sola pregunta para Alejo por ronda**, con el valor por defecto ya cargado en los archivos.
7. **Las decisiones de Alejo no las toma nadie más.** Están en `CLAUDE.md`, sección "Decisiones que solo Alejo puede tomar". Si el pedido necesita una, queda anotada como pregunta y se sigue con un valor por defecto que se pueda cambiar con un número.
8. **Lo chico va directo a Claude Code**, sin pasar por los otros dos: un número en `config/`, un texto, un error de tipeo. Pasa por la ronda lo que toca una decisión de Alejo o más de un archivo.

## Qué lleva un pedido para Claude Code

- Qué cambia, contado como lo vería quien usa el programa.
- Qué NO se toca.
- Cuándo está listo: qué tests o qué demo lo prueban.
- Qué decisiones son de Alejo y qué valor por defecto se usa mientras tanto.
- Cuántos archivos se esperan y en qué carpetas.

## Qué lleva un reporte de Claude Code

- Hora de Argentina y veredicto en dos o tres oraciones.
- Qué cambió, un renglón por cambio.
- Cuántos tests, antes y después.
- Qué decidió Claude Code por su cuenta (para que otro lo revise).
- Qué quedó pendiente y para quién.
