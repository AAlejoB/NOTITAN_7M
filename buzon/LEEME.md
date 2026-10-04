# Buzón de NOTITAN_7M

Tres bloques, como en ST. Alejo es el relé: cada agente trabaja a su ritmo y Alejo lleva los archivos de uno a otro. Esta carpeta es la memoria compartida. Lo que no está acá ni en `CLAUDE.md`, no existe.

Borrador armado por Claude Code el 04-10-2026 a partir de lo que Alejo contó de ST. Alejo lo ajusta.

Cada bloque tiene su propio archivo de arranque: `LEEME_DISENADOR.md`, `LEEME_PREPARADOR.md` y `LEEME_CLAUDECODE.md`.

## Quién habla con quién

El DISEÑADOR nunca habla directo con Claude Code. Todo pasa por el PREPARADOR. Las decisiones empiezan en el DISEÑADOR (con Alejo), el PREPARADOR las vuelve un pedido preciso, y terminan en Claude Code. Lo que Claude Code encuentra sube al DISEÑADOR por el PREPARADOR.

| | con el DISEÑADOR | con el PREPARADOR | con Claude Code |
|---|---|---|---|
| **DISEÑADOR** | | sí | no |
| **PREPARADOR** | sí | | sí |
| **Claude Code** | no | sí | |

Alejo habla con los tres, cada uno en su chat.

## Los tres bloques

| Bloque | Dónde | Modelo | Qué hace |
|---|---|---|---|
| 1 · DISEÑADOR | chat de Cowork | Opus 5.5, esfuerzo alto (quizás máximo) | Piensa, pregunta a Alejo todo lo que haga falta y dibuja con artifacts. No escribe código. |
| 2 · PREPARADOR | chat de Cowork | Opus 5.5, esfuerzo alto (quizás máximo): el más alto de los tres | Organiza y gestiona. Vuelve lo visual y las decisiones un pedido limpio y preciso para Claude Code. |
| 3 · Claude Code | este repo | Sonnet 5.5 | Ejecuta, prueba y reporta. |

Como Claude Code corre con un modelo más chico, el pedido del PREPARADOR tiene que ser exacto.

## Nombres de archivo

`<DE>_para_<A>_<AAAA-MM-DD>_<letra>.md`. La letra empieza en `a` y sigue `b`, `c` si hay más de uno el mismo día.

- `Disenador_para_PREPARADOR_...`
- `PREPARADOR_para_Disenador_...`
- `PREPARADOR_para_ClaudeCode_...`
- `ClaudeCode_para_PREPARADOR_...`

No existe `ClaudeCode_para_Disenador_...` ni al revés. En ST las capturas van de Claude Code directo al DISEÑADOR (decidido el 29-09); en 7M todo pasa por el PREPARADOR.

## Reglas

1. **Al empezar cada turno**, cada agente lee todo lo que sea más nuevo que lo último que leyó, aunque Alejo no se lo haya pegado. Claude Code hace `git pull` antes.
2. **Un paquete por ronda.** Si el DISEÑADOR y Claude Code trabajan a la vez, el PREPARADOR espera a los dos antes de escribir de nuevo. Excepción: algo que bloquea a otro (un error de seguridad, un dato equivocado).
3. **Lo enviado no se reescribe.** Si algo cambia, va en un archivo nuevo con letra nueva y la primera línea dice qué reemplaza.
4. **La lista de la próxima ronda vive en `pendientes.md`.** Todo lo que llega y no sale ya se anota ahí en el momento.
5. **La hora es la de Argentina**, sacada con `TZ=America/Argentina/Buenos_Aires date`. El contenedor muestra UTC (Argentina más 3 h). Va en el encabezado de cada archivo.
6. **Las preguntas a Alejo se reparten.** El DISEÑADOR le pregunta todo lo que haga falta, de a un tema por vez. El PREPARADOR solo si algo es ambiguo y frena la precisión. Claude Code casi nunca: deja un valor por defecto y lo anota.
7. **Las decisiones de Alejo no las toma nadie más.** Están en `CLAUDE.md`, sección "Decisiones que solo Alejo puede tomar". Si hace falta una, se anota con un valor por defecto que se pueda cambiar con un número.
8. **Lo chico se le pide directo a Claude Code** en su chat: un número en `config/`, un texto, un error de tipeo. Pasa por los tres bloques lo que toca una decisión de Alejo o más de un archivo.

## Cada tanda arranca en limpio

Una tanda es una vuelta completa: el DISEÑADOR decide, el PREPARADOR arma el pedido, Claude Code ejecuta y reporta.

1. **Se cierra la tanda.** Claude Code deja su reporte, actualiza `pendientes.md` y `CLAUDE.md`, y pushea.
2. **Alejo hace `/clear` en Claude Code.**
3. **Alejo borra los chats de Cowork** del DISEÑADOR y del PREPARADOR.
4. **Abre chats nuevos** y pega en cada uno una sola línea.

La memoria es el repo, no el chat. Lo que no quedó escrito se pierde con el `/clear`.

### Cómo llegan los archivos a Cowork

Hay una sola sesión de Claude Code y trabaja en la rama `claude/trusting-knuth-brmpsy`, que es la rama principal del repo en GitHub. Los chats de Cowork leen `buzon/` de ahí. No hay nada que igualar.

1. **Hacia Cowork:** lo leen del repo. Si un chat no puede abrir el repo, Alejo le pega el contenido de su `LEEME_<ROL>.md` y de `CLAUDE.md`.
2. **Desde Cowork:** lo que escriben (`Disenador_para_PREPARADOR_*`, `PREPARADOR_para_ClaudeCode_*`) lo pega Alejo en el chat de Claude Code, que lo guarda en `buzon/` con el nombre correcto, lo commitea y lo pushea. Queda en el repo apenas se pushea.

La línea corta para pegar sigue siendo la de abajo; si el chat no puede abrir el archivo, se pega el contenido en vez de la línea.

Para el DISEÑADOR:

```
DESDE ACÁ
Chat nuevo. Leé buzon/LEEME_DISENADOR.md y arrancá de ahí.
HASTA ACÁ
```

Para el PREPARADOR:

```
DESDE ACÁ
Chat nuevo. Leé buzon/LEEME_PREPARADOR.md y arrancá de ahí.
HASTA ACÁ
```

Para Claude Code, después del `/clear`:

```
DESDE ACÁ
Leé buzon/LEEME_CLAUDECODE.md y el PREPARADOR_para_ClaudeCode_* más nuevo, y hacelo.
HASTA ACÁ
```
