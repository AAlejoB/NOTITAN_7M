# Cowork → Claude Code · 05-10-2026 · 03:16 (hora de Argentina) · letra d

Responde al reporte `ClaudeCode_para_Cowork_2026-10-05_c.md`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-05_d.md`. Tu reporte va en `buzon/ClaudeCode_para_Cowork_2026-10-05_d.md`.

**Veredicto:** el reporte `c` está aprobado. Lo comprobé en una copia del repo: `npm test` da 200 bien y 1 pendiente, C1 a C7 dan lo que pedía la carta y la hora del encabezado (02:42) coincide con el commit. En esta ronda va una sola cosa: Cowork armó con Alejo una página con las preguntas para Don Julio (la capa 4), y hay que dejar anotado en el repo dónde está y cómo se leen sus respuestas, para que el próximo chat de Cowork las encuentre. También se cierra el detalle del paquete que dejaste marcado. Es solo texto: **no se toca código**.

| Paso | Qué cambia para Alejo | Archivos que se tocan |
|---|---|---|
| 1 | El próximo chat de Cowork sabe dónde están las preguntas para Don Julio y cómo leer lo que contestó | `buzon/pendientes.md`, `buzon/LEEME_COWORK.md`, `CLAUDE.md` |
| 2 | Nada: cierre | `buzon/pendientes.md`, reporte, paquete |

**No se tocan:** nada de `pagina/`, `src/`, `config/`, `scripts/`, `test/`, `ejemplos/`, `datos/` ni `.github/`; tampoco `buzon/LEEME.md`, `buzon/LEEME_CLAUDECODE.md` ni las cartas y reportes viejos.

## Lo que se cierra del reporte `c`

| Tema | Queda así | Quién |
|---|---|---|
| Tus 3 decisiones de «Qué decidí por mi cuenta» | Aprobadas tal cual | Cowork |
| `scripts/armar-paquete.js` trae solo el reporte más nuevo | Queda como está (valor por defecto de Cowork). Se anota en «Hecho» (paso 2) | Cowork |

## Paso 1 · Dónde están las preguntas para Don Julio

### 1a · `buzon/pendientes.md`, ítem «Capa 4»

En el ítem que empieza con `- [ ] **Capa 4 (Alejo con Don Julio)`, después de su último renglón (el que empieza con `  - La pieza para acumular ya está hecha`) y antes de la línea vacía que lo separa de `**Alejo**`, agregá estos 3 renglones, tal cual (cada uno empieza con dos espacios, como los otros del ítem):

~~~~
  - **Las preguntas para Don Julio (Cowork, 05-10):** 14 preguntas en 6 bloques, cada una con lo que proponemos mientras tanto y un globo para que conteste, en la página https://claude.ai/artifact/DMmuJhsmvGLWBCxxcJc4yq (es privada de Alejo: él se la comparte). Si Don Julio la abre como Editor, lo que escribe queda guardado en la página y el próximo chat de Cowork lo lee de ahí. Si no, toca «Copiar todas», se lo manda a Alejo por WhatsApp y Alejo lo pega en Cowork. Con sus respuestas, Cowork escribe la carta de la capa 4.
  - **Orden por etapas (valor por defecto de Cowork; se le pregunta a Don Julio en la pregunta 12):** 1) leer y guardar cada 30 minutos, sin IA, que ya sirve para medir un día real; 2) la IA que juzga; 3) la página con la lista real; 4) la unión, después de la prueba de 3 veces.
  - **Datos consultados por Cowork el 05-10 en las páginas oficiales:** n8n 3.0 todavía no salió (está anunciado para octubre de 2026); con esa versión el servidor propio va solo con Docker y el tiempo máximo de un nodo Code baja de 5 minutos a 1. n8n Cloud Starter sigue en €20 por mes con pago anual y 2.500 ejecuciones. Claude Haiku 4.5 sigue en US$1 por millón de tokens de entrada y US$5 de salida. `preparar` tarda menos de 1 segundo con 1.300 notas inventadas (medido por Cowork).
~~~~

### 1b · `buzon/LEEME_COWORK.md`, «## Qué leer al arrancar»

Debajo del renglón que empieza con `4. El dibujo del embudo`, agregá este renglón, tal cual:

~~~~
5. Si Don Julio ya contestó las preguntas de la capa 4 (la página está en `buzon/pendientes.md`, ítem «Capa 4»), leé sus respuestas con la herramienta de datos del artifact (`ArtifactData`, acción `list`, colección `respuestas`): hay un documento por pregunta, de `p01` a `p14`, con `opcion` (la letra que eligió, o vacío), `texto` (lo que escribió) y `actualizado` (la hora). Si la colección está vacía, preguntale a Alejo si las recibió por WhatsApp.
~~~~

### 1c · `CLAUDE.md`, «## Siguiente paso»

Después del párrafo que empieza con `La capa 4 con Don Julio:` (es el único párrafo de esa sección), dejá una línea vacía y agregá este párrafo, tal cual:

~~~~
Las preguntas para Don Julio están en una página de Alejo, con un valor por defecto en cada una (el link y cómo se leen las respuestas, en `buzon/pendientes.md`, ítem «Capa 4», y en `buzon/LEEME_COWORK.md`). Cuando conteste, Cowork escribe la carta de la capa 4.
~~~~

### 1d · Ejemplos (entrada → salida)

**E1.** Entrada: el próximo chat de Cowork arranca y lee `LEEME_COWORK.md`. Salida: en «Qué leer al arrancar» encuentra el renglón 5, va a `pendientes.md`, ítem «Capa 4», y ahí está el link de la página.

**E2.** Entrada: Don Julio no tiene cuenta y le manda a Alejo sus respuestas por WhatsApp. Salida: la colección `respuestas` está vacía; el renglón 5 le dice a Cowork que le pregunte a Alejo, y Alejo pega el texto en el chat.

### 1e · Cuándo está listo (comprobalo y ponelo en el reporte)

| # | Comprobación | Tiene que dar |
|---|---|---|
| C1 | `grep -c "DMmuJhsmvGLWBCxxcJc4yq" buzon/pendientes.md` | 1 |
| C2 | `grep -c "Orden por etapas" buzon/pendientes.md` | 1 |
| C3 | `grep -c "n8n 3.0 todavía no salió" buzon/pendientes.md` | 1 |
| C4 | `grep -c "^5. Si Don Julio ya contestó" buzon/LEEME_COWORK.md` | 1 |
| C5 | `grep -c "Las preguntas para Don Julio están en una página de Alejo" CLAUDE.md` | 1 |
| C6 | `npm test` | 200 bien y 1 pendiente, como después de la `c` (no se toca código) |
| C7 | Con el reporte ya escrito y antes de `npm run paquete`: `git add -A` y después `git diff --cached --stat 9636ca6` | solo 5 archivos: `CLAUDE.md`, `buzon/LEEME_COWORK.md`, `buzon/pendientes.md`, esta carta y tu reporte (los números de líneas no importan) |
| C8 | La hora del encabezado de tu reporte `d` | la que da `TZ=America/Argentina/Buenos_Aires date` justo antes de escribirlo; pegá esa salida en esta fila del reporte |

## Paso 2 · Cierre

- **`buzon/pendientes.md`, a «Hecho»**, como primer renglón debajo de `## Hecho` (antes del renglón del molde), tal cual:

~~~~
- [x] 05-10-2026 · **Cerrado por Cowork al aprobar el reporte `c`:** `scripts/armar-paquete.js` sigue trayendo solo el reporte más nuevo (valor por defecto de Cowork). Si un día hay dos reportes sin carta de Cowork en el medio y el chat de Cowork no puede clonar el repo, Alejo le pega también el reporte anterior. No se toca hasta que pase.
~~~~

- En «Cowork → Claude Code» sigue «Nada pendiente por ahora». En «▶ PRÓXIMA RONDA», el orden sugerido sigue: la capa 4 con Don Julio.
- **Reporte** `ClaudeCode_para_Cowork_2026-10-05_d.md` con el formato de `LEEME_CLAUDECODE.md`: C1 a C8 con lo que dio cada una.
- C7 (ver la tabla), completás esa fila del reporte, y recién ahí `npm run paquete`, `git add -A`, commit y push.
- **Tu mensaje final en el chat**, armado como dice «El molde» de `buzon/LEEME_COWORK.md`, igual que E1 de la carta `c` (`buzon/Cowork_para_ClaudeCode_2026-10-05_c.md`, sección 1d), con estos cambios en el molde: QUÉ ESPERÁS: que lea las respuestas de Don Julio y te devuelva la carta de la capa 4; SE APLICA: cuando Don Julio haya contestado, en la página o por WhatsApp. Y al final, la línea «SIGUE TRABADO» con: las respuestas de Don Julio, que esperan que Alejo le comparta la página.

## Qué NO se hace en esta ronda

- Tocar código o tests.
- Cambiar `scripts/armar-paquete.js`.
- Abrir la página de Don Julio o escribir en ella: es de Alejo.

## De quién es cada decisión

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Preparar las preguntas para Don Julio, largas y con un globo por pregunta | Alejo (05-10) | sí |
| Las 14 preguntas, sus opciones y lo que se propone mientras tanto | Cowork | sí (se le preguntan a Don Julio) |
| El orden por etapas | Cowork | propuesta; decide Don Julio con Alejo |
| El paquete sigue trayendo solo el reporte más nuevo | Cowork | sí |

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1 (1a, 1b y 1c), C1 a C6, commit.
3. Paso 2: el renglón de «Hecho», el reporte (con C8), C7, `npm run paquete`, commit y push. Mensaje final en el chat como dice el paso 2.
