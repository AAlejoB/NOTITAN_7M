# Buzón de NOTITAN_7M

Dos bloques. Alejo es el relé: cada uno trabaja a su ritmo y Alejo lleva los archivos de uno a otro. Esta carpeta es la memoria compartida. Lo que no está acá ni en `CLAUDE.md`, no existe.

El arranque de cada bloque está en su propio archivo: `LEEME_COWORK.md` y `LEEME_CLAUDECODE.md`.

## Quién habla con quién

| | con Alejo | con el otro bloque |
|---|---|---|
| **Cowork** | en su chat | por archivo, en los dos sentidos |
| **Claude Code** | en su chat, solo para lo chico | por archivo, en los dos sentidos |

Cowork y Claude Code no se hablan directo: Alejo lleva cada archivo. Las decisiones empiezan en Cowork (con Alejo), terminan en Claude Code, y lo que Claude Code encuentra vuelve a Cowork en su reporte.

## Los dos bloques

| Bloque | Dónde | Modelo | Qué hace |
|---|---|---|---|
| 1 · Cowork | un solo chat de Cowork | el más fuerte que haya, esfuerzo al máximo | Piensa, le pregunta a Alejo, dibuja con artifacts y escribe el pedido exacto para Claude Code. No escribe código. |
| 2 · Claude Code | este repo | Sonnet 5.5 | Ejecuta, prueba y reporta. |

Como Claude Code corre con un modelo más chico, el pedido de Cowork tiene que ser exacto.

## Nombres de archivo

`<DE>_para_<A>_<AAAA-MM-DD>_<letra>.md`. La letra empieza en `a` y sigue `b`, `c` si hay más de uno el mismo día.

- `Cowork_para_ClaudeCode_...`
- `ClaudeCode_para_Cowork_...`

**Historia.** Hasta el 04-10-2026 eran tres bloques (DISEÑADOR, PREPARADOR y Claude Code) y los archivos se llamaban `Disenador_para_PREPARADOR_...`, `PREPARADOR_para_Disenador_...`, `PREPARADOR_para_ClaudeCode_...` y `ClaudeCode_para_PREPARADOR_...`. Quedan en esta carpeta tal cual, como historia. Donde un documento dice DISEÑADOR o PREPARADOR, hoy es Cowork.

## Reglas

1. **Al empezar cada turno**, cada bloque lee todo lo que sea más nuevo que lo último que leyó, aunque Alejo no se lo haya pegado. Claude Code hace `git pull` antes.
2. **Un paquete por ronda.** Si Cowork y Claude Code trabajan a la vez, se espera a los dos antes de escribir de nuevo. Excepción: algo que bloquea al otro (un error de seguridad, un dato equivocado).
3. **Lo enviado no se reescribe.** Si algo cambia, va en un archivo nuevo con letra nueva y la primera línea dice qué reemplaza.
4. **La lista de la próxima ronda vive en `pendientes.md`.** Todo lo que llega y no sale ya se anota ahí en el momento.
5. **La hora es la de Argentina**, sacada con `TZ=America/Argentina/Buenos_Aires date`. El contenedor muestra UTC (Argentina más 3 h). Va en el encabezado de cada archivo.
6. **Las preguntas a Alejo se reparten.** Cowork le pregunta lo que haga falta, de a un tema por vez. Claude Code casi nunca: deja un valor por defecto y lo anota.
7. **Las decisiones de Alejo no las toma nadie más.** Están en `CLAUDE.md`, sección "Decisiones que solo Alejo puede tomar". Si hace falta una, se anota con un valor por defecto que se pueda cambiar con un número.
8. **Lo chico se le pide directo a Claude Code** en su chat: un número en `config/`, un texto, un error de tipeo. Pasa por Cowork lo que toca una decisión de Alejo o más de un archivo.

## Cada tanda arranca en limpio

Una tanda es una vuelta completa: Cowork decide y arma el pedido, Claude Code ejecuta y reporta.

1. **Se cierra la tanda.** Claude Code deja su reporte, actualiza `pendientes.md` y `CLAUDE.md`, y pushea.
2. **Alejo hace `/clear` en Claude Code.**
3. **Alejo cierra el chat de Cowork** y abre uno nuevo cuando haya algo para decidir.
4. **Pega en cada uno una sola línea.**

La memoria es el repo, no el chat. Lo que no quedó escrito se pierde con el `/clear`.

### Cómo llegan los archivos a Cowork

Hay una sola sesión de Claude Code y trabaja en la rama `claude/trusting-knuth-brmpsy`, que es la rama principal del repo en GitHub. El chat de Cowork lee `buzon/` de ahí. No hay nada que igualar.

1. **Hacia Cowork:** lo lee del repo. Un chat de Cowork puede clonar el repo si la línea trae el link (probado el 04-10). El paquete queda para cuando eso no ande: si el chat no puede abrir el repo (dice "no hay nada conectado"), Alejo le pega `buzon/paquetes/PEGAR_COWORK.md`. Lo arma Claude Code con `npm run paquete` y trae, en un solo texto, `LEEME_COWORK.md`, `LEEME.md`, `CLAUDE.md`, `pendientes.md` y el reporte más nuevo de Claude Code.
2. **Desde Cowork:** lo que escribe (`Cowork_para_ClaudeCode_*`) lo pega Alejo en el chat de Claude Code, que lo guarda en `buzon/` con el nombre correcto, lo commitea y lo pushea. Queda en el repo apenas se pushea.

Las líneas para pegar traen el link del repo. Si el chat no puede clonarlo, se pega el paquete en vez de la línea. Si el repo pasa a privado, la línea con el link deja de andar y se vuelve al paquete.

Para Cowork:

```
DESDE ACÁ
Chat nuevo. Cloná https://github.com/AAlejoB/NOTITAN_7M (rama claude/trusting-knuth-brmpsy), leé buzon/LEEME_COWORK.md y arrancá de ahí.
HASTA ACÁ
```

Para Claude Code, después del `/clear`:

```
DESDE ACÁ
Leé buzon/LEEME_CLAUDECODE.md y la carta más nueva de Cowork (Cowork_para_ClaudeCode_*), y hacela.
HASTA ACÁ
```
