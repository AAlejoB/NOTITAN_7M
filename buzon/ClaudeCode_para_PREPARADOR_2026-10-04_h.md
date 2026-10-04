# Claude Code → PREPARADOR · 04-10-2026 · 14:34 (hora de Argentina) · letra h

**Veredicto:** un chat de Cowork le dijo a Alejo "no hay nada conectado" (no puede abrir el repo). El buzón estaba bien: `buzon/` está pusheado en la rama principal y el repo es público (se abrió un link directo sin login). Se armó un paquete por rol para pegar de una sola vez. Sin cambios en la lógica; `npm test` pasó de 69 a 73 bien y sigue 1 pendiente a propósito.

## Qué cambió

| Archivo | Cambio |
|---|---|
| `scripts/armar-paquete.js` (nuevo) | Arma `buzon/paquetes/PEGAR_DISENADOR.md` y `buzon/paquetes/PEGAR_PREPARADOR.md`. Los textos salen tal cual del repo. |
| `test/armar-paquete.test.js` (nuevo) | 4 tests: elige la carta más nueva, el orden de los archivos, no mezcla roles, y anda con el repo real. |
| `package.json` | `npm run paquete`. |
| `buzon/paquetes/PEGAR_*.md` (nuevos) | Los dos paquetes, armados el 04-10 a las 14:34. |
| `buzon/LEEME.md`, `buzon/LEEME_CLAUDECODE.md` | Dicen cuándo se pega el paquete y que se rearma al cerrar cada tanda. |
| `CLAUDE.md`, `buzon/pendientes.md` | Una línea en Estado y una en Hecho. |

## Qué lleva cada paquete

| Rol | Archivos, en este orden |
|---|---|
| DISEÑADOR | `LEEME_DISENADOR.md`, `LEEME.md`, `CLAUDE.md`, `pendientes.md` y el `PREPARADOR_para_Disenador_*` más nuevo (hoy no hay) |
| PREPARADOR | `LEEME_PREPARADOR.md`, `LEEME.md`, `CLAUDE.md`, `pendientes.md`, el `Disenador_para_PREPARADOR_*` más nuevo (hoy no hay) y el `ClaudeCode_para_PREPARADOR_*` más nuevo (esta carta) |

## Qué decidió Claude Code por su cuenta (para revisar)

- `pendientes.md` va completo y no solo la sección del rol: pesa 8 KB y evita recortar mal.
- Claude Code no tiene paquete: lee el repo directo.
- Los paquetes están commiteados para que se puedan bajar de GitHub. Son una foto y se desactualizan: por eso el último paso de cerrar una tanda es `npm run paquete`.

## Qué quedó pendiente

- Nada nuevo. Si el chat de Cowork sigue sin ver el repo, es un tema de conexión de Cowork (no del repo): el paquete lo resuelve sin conectar nada.
