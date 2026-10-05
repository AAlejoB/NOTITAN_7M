# Cowork → Claude Code · 05-10-2026 · 02:38 (hora de Argentina) · letra c

Responde al reporte `ClaudeCode_para_Cowork_2026-10-05_b.md`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-05_c.md`. Tu reporte va en `buzon/ClaudeCode_para_Cowork_2026-10-05_c.md`.

**Veredicto:** el reporte `b` del 05-10 está aprobado. Lo comprobé en una copia del repo: `npm test` da 200 bien y 1 pendiente, `npm run probar-pagina` da 66 bien y 0 mal y deja `git status` limpio, y en `pagina-2026-10-05-b-390.png` el sello naranja de la 4/5 llevada se lee entero. En esta ronda va una sola cosa, **decidida por Alejo el 05-10**: toda entrega termina, por cada destinatario, con «ESTO mandale a …:» (sus palabras), un recuadro con exactamente lo que se pega y el molde «▶ QUÉ HACÉS AHORA» afuera. Hoy está escrito a medias en `CLAUDE.md` y en `LEEME_CLAUDECODE.md`, por eso los dos usábamos tablas. Va también un recordatorio de la hora del encabezado. Es solo texto: **no se toca código**.

| Paso | Qué cambia para Alejo | Archivos que se tocan |
|---|---|---|
| 1 | Cada entrega (de Cowork y de Claude Code) termina igual: «ESTO mandale a …:», el recuadro para copiar y el molde para leer. La hora de cada encabezado es la real | `buzon/LEEME_COWORK.md`, `buzon/LEEME_CLAUDECODE.md`, `CLAUDE.md` |
| 2 | Nada: cierre | `buzon/pendientes.md`, reporte, paquete |

**No se tocan:** nada de `pagina/`, `src/`, `config/`, `scripts/`, `test/`, `ejemplos/`, `datos/` ni `.github/`; tampoco `buzon/LEEME.md` ni las cartas y reportes viejos (son historia: no se pasan al molde, y el reporte `b` queda como está).

## Lo que se cierra del reporte `b` (no hay que hacer nada en código)

| Tema | Queda así | Quién |
|---|---|---|
| Tus 4 decisiones de «Qué decidí por mi cuenta» | Aprobadas tal cual. Las 66 comprobaciones quedan agrupadas como están: no hace falta que figuren una por una | Cowork |
| La captura del celular de Alejo con la versión vieja | No hay nada que arreglar: la página no está publicada en ningún lado; era una imagen de antes del 05-10 `a` | Cowork |
| La hora del encabezado del reporte `b` | Dice 02:35, pero su commit es de las 02:24: la hora no salió del comando. Se corrige de acá en adelante (paso 1b, segundo reemplazo) | Cowork |

## Paso 1 · El molde, escrito donde se lee al arrancar

### 1a · `buzon/LEEME_COWORK.md`

**En «## Cómo trabajás»**, justo debajo de la línea `- Español rioplatense, breve.`, agregá esta línea, tal cual:

~~~~
- **Cada entrega termina como dice «El molde» (abajo)**, nunca con una tabla en su lugar. Lo decidió Alejo el 05-10-2026.
~~~~

**Justo antes de la línea `## Con quién hablás`**, agregá esta sección entera, tal cual (con la línea vacía de antes y de después):

~~~~
## El molde

Toda entrega a Alejo termina así (es su skill para cerrar entregas: `que-haces-ahora`, antes `proximo-paso`). Lo que se copia para otro nunca se mezcla con lo que es para Alejo.

- **Un apartado por destinatario**, en el orden en que se hacen. Cada uno empieza con una línea en negrita con las palabras de Alejo: «ESTO mandale a Claude Code:», «ESTO otro mandáselo al próximo chat de Cowork:». Si hay que hacer algo antes, va entre paréntesis en esa misma línea, por ejemplo «(antes hacé /clear ahí)».
- Debajo, **un recuadro** (bloque de código) con exactamente lo que se pega, de DESDE ACÁ a HASTA ACÁ, sea una línea o una carta entera. El recuadro es solo para copiar: nada para Alejo va adentro.
- Debajo del recuadro, **el molde de ese destinatario**, afuera, como cita (cada renglón empieza con `>`): un renglón con el título «▶ QUÉ HACÉS AHORA» y después cinco campos, uno por renglón y en este orden: A QUIÉN, QUÉ LE PASÁS, QUÉ ESPERÁS, SE APLICA, A EJECUTAR.
- **Lo que se pega nunca lleva adentro otro recuadro de ejemplo, otro DESDE ACÁ o HASTA ACÁ, ni un molde**: Alejo lo ve todo junto y no sabe qué es para quién (le pasó el 05-10). Si una carta tiene que mostrar un ejemplo así, lo cuenta con palabras. Si lo que se pega trae otros bloques de código (por ejemplo, líneas de CSS), el recuadro usa un cerco de cuatro acentos graves.
- El molde va en el mensaje del chat, **nunca adentro de una carta, un reporte o un texto para pegar**.
- Las explicaciones para Alejo van antes del primer apartado. Nada entre un recuadro y su molde.
- Una línea por campo. Si un campo necesita dos, son dos pasos: dos apartados.
- «A QUIÉN» dice un nombre (Claude Code, Cowork, Don Julio, «vos mismo», «nadie»). Nunca «quien corresponda».
- «QUÉ ESPERÁS» dice qué tiene que volver, de forma que se reconozca cuando llega.
- «SE APLICA» nombra una condición, no una fecha: «cuando Claude Code pushee el reporte», no «pronto».
- Si no hay nada para mandar, se dice: una línea en negrita «NADA PARA MANDAR», sin recuadro, y el molde con «SE APLICA: nada, esto solo cierra el tema».
- Lo que sigue esperando algo de antes va al final de todo, fuera de recuadros, en una línea que empieza con «SIGUE TRABADO» en negrita: qué, y por quién.
- El molde no repite decisiones ni motivos: quien lee solo los apartados tiene que poder actuar.
~~~~

**En «## Qué leer al arrancar»**, reemplazá la línea 3:

~~~~
3. El `ClaudeCode_para_Cowork_*` más nuevo. Si todavía no hay ninguno, el `ClaudeCode_para_PREPARADOR_*` más nuevo (así se llamaban antes).
~~~~

por esta, tal cual:

~~~~
3. Todos los `ClaudeCode_para_Cowork_*` más nuevos que la última carta de Cowork (`Cowork_para_ClaudeCode_*`): puede haber más de uno. Si todavía no hay ninguno, el `ClaudeCode_para_PREPARADOR_*` más nuevo (así se llamaban antes).
~~~~

**Por qué la línea 3:** si Alejo te manda dos cartas seguidas sin pasar por un chat de Cowork, quedan dos reportes nuevos. Con la línea vieja, el próximo chat de Cowork leería solo el último.

### 1b · `buzon/LEEME_CLAUDECODE.md` (dos reemplazos)

**Primero.** Reemplazá la línea:

~~~~
- Terminás cada entrega con el bloque "QUÉ HACÉS AHORA".
~~~~

por esta, tal cual:

~~~~
- Terminás cada entrega con tu mensaje del chat para Alejo armado como dice «El molde» de `buzon/LEEME_COWORK.md`: por cada destinatario, «ESTO mandale a …:», el recuadro con exactamente lo que se pega (por ejemplo, la línea para Cowork de `buzon/LEEME.md`) y el molde afuera, como cita. Nunca una tabla en su lugar. El reporte (el archivo) no lleva el molde.
~~~~

**Segundo.** En «## Qué escribís», reemplazá la línea:

~~~~
- Hora de Argentina y veredicto en dos o tres oraciones.
~~~~

por esta, tal cual:

~~~~
- Hora de Argentina, la que da `TZ=America/Argentina/Buenos_Aires date` corrida justo antes de escribir el encabezado (no se estima ni se redondea), y veredicto en dos o tres oraciones.
~~~~

### 1c · `CLAUDE.md`

En «## Cómo trabajamos con Alejo», reemplazá la línea:

~~~~
- Cada entrega termina con el bloque "QUÉ HACÉS AHORA" (a quién, qué le pasa, qué espera, cuándo, quién ejecuta).
~~~~

por esta, tal cual:

~~~~
- Cada entrega termina con el molde «▶ QUÉ HACÉS AHORA» (decidió Alejo el 05-10-2026), en el mensaje del chat y nunca en tabla: por cada destinatario, «ESTO mandale a …:» (palabras de Alejo), un recuadro con exactamente lo que se pega (sea una línea o una carta entera, de DESDE ACÁ a HASTA ACÁ) y el molde afuera, con sus cinco campos de una línea (A QUIÉN, QUÉ LE PASÁS, QUÉ ESPERÁS, SE APLICA, A EJECUTAR). Lo que se pega nunca lleva adentro recuadros ni moldes de ejemplo. Detalle en `buzon/LEEME_COWORK.md` («El molde»).
~~~~

### 1d · Ejemplos (entrada → salida, contados con palabras a propósito)

**E1. Tu mensaje final en el chat, con algo para mandar.** Entrada: cerraste la tanda y pusheaste. Salida, al final de tu mensaje en el chat (no en el reporte), en este orden:

1. La línea en negrita «ESTO mandale al próximo chat de Cowork:».
2. Un recuadro con tres renglones: DESDE ACÁ; la línea para Cowork de `buzon/LEEME.md` (la que empieza con «Chat nuevo. Cloná https://github.com/AAlejoB/NOTITAN_7M»), copiada tal cual; HASTA ACÁ.
3. El molde, como cita: título «▶ QUÉ HACÉS AHORA»; A QUIÉN: Cowork, en un chat nuevo; QUÉ LE PASÁS: el recuadro de arriba, entero; QUÉ ESPERÁS: que lea el reporte nuevo y te devuelva la próxima carta o una pregunta; SE APLICA: ya, el reporte está pusheado; A EJECUTAR: vos pegás, Cowork escribe.
4. Al final de todo, fuera del recuadro y del molde: «SIGUE TRABADO» en negrita y «las noticias reales (capa 4): esperan que hables con Don Julio».

**E2. Una entrega que no deja nada para mandar.** Entrada: Alejo te pidió en el chat cambiar un número de `config/` y ya está commiteado y pusheado. Salida: la línea en negrita «NADA PARA MANDAR», sin recuadro, y el molde con A QUIÉN: nadie, esto es tuyo; QUÉ LE PASÁS: nada; QUÉ ESPERÁS: nada; SE APLICA: nada, esto solo cierra el tema; A EJECUTAR: nadie, ya está pusheado.

### 1e · Cuándo está listo (comprobalo y ponelo en el reporte)

| # | Comprobación | Tiene que dar |
|---|---|---|
| C1 | `grep -c "▶ QUÉ HACÉS AHORA" buzon/LEEME_COWORK.md` | 1 |
| C2 | `grep -c "^## El molde" buzon/LEEME_COWORK.md` | 1, y la sección queda entre «## Cómo trabajás» y «## Con quién hablás» |
| C3 | `grep -c 'el bloque "QUÉ HACÉS AHORA" (a quién' CLAUDE.md` | 0 |
| C4 | `grep -c "ESTO mandale a" buzon/LEEME_COWORK.md buzon/LEEME_CLAUDECODE.md CLAUDE.md` | al menos 1 en cada archivo |
| C5 | `npm test` | 200 bien y 1 pendiente, como después de la `b` (no se toca código) |
| C6 | Después de `npm run paquete`: `grep -c "Toda entrega a Alejo termina así" buzon/paquetes/PEGAR_COWORK.md` | al menos 1 |
| C7 | `grep -c "corrida justo antes de escribir el encabezado" buzon/LEEME_CLAUDECODE.md` | 1 |
| C8 | La hora del encabezado de tu reporte `c` | es la que dio `TZ=America/Argentina/Buenos_Aires date` al escribirlo; pegá esa salida en el reporte, en esta fila |
| C9 | Tu mensaje final en el chat | termina como E1; adentro del recuadro hay solo los tres renglones; el reporte no lleva el molde |

## Paso 2 · Cierre

- **`buzon/pendientes.md`, a «Hecho»** (05-10), dos renglones:
  - «El molde «▶ QUÉ HACÉS AHORA», decidido por Alejo: toda entrega de Cowork y de Claude Code termina, en el mensaje del chat, con «ESTO mandale a …:» por cada destinatario, un recuadro con exactamente lo que se pega y el molde afuera, como cita; nunca una tabla, y nunca recuadros ni moldes de ejemplo adentro de lo que se pega. Escrito en `LEEME_COWORK.md` («El molde»), `LEEME_CLAUDECODE.md` y `CLAUDE.md`. Cowork lee todos los reportes nuevos, no solo el último. La hora del encabezado sale del comando, corrida en el momento.»
  - «Cerrado por Cowork al aprobar el reporte `b`: las 66 comprobaciones de `npm run probar-pagina` quedan agrupadas como están; la captura del celular de Alejo con la versión vieja era una imagen de antes del 05-10 `a` (la página no está publicada en ningún lado).»
- En «Cowork → Claude Code» sigue «Nada pendiente por ahora». En «▶ PRÓXIMA RONDA», el orden sugerido sigue: la capa 4 con Don Julio.
- **Reporte** `ClaudeCode_para_Cowork_2026-10-05_c.md` con el formato de `LEEME_CLAUDECODE.md` (ya con el paso 1 puesto): C1 a C9 con lo que dio cada una.
- `npm run paquete`, commit y push. Después, tu mensaje final en el chat, como E1.

## Qué NO se hace en esta ronda

- Tocar código o tests.
- Pasar al molde las cartas y los reportes viejos, o corregir la hora del reporte `b`.
- Cambiar `scripts/armar-paquete.js` (el paquete sigue trayendo solo el reporte más nuevo).

## De quién es cada decisión

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| Toda entrega termina con el molde, con el texto exacto para mandar, sea largo o corto | Alejo (05-10) | sí |
| Cada apartado empieza con «ESTO mandale a …:»; recuadro = se copia, lo de afuera es para Alejo | Alejo (05-10) | sí |
| Lo que se pega nunca lleva recuadros ni moldes de ejemplo adentro | Cowork | sí |
| Que Claude Code también lo use, en su mensaje del chat (no en el reporte) | Cowork | sí |
| Que Cowork lea todos los reportes nuevos, no solo el último | Cowork | sí |
| La hora del encabezado sale del comando (ya es la regla 5 de `LEEME.md`; se repite en `LEEME_CLAUDECODE.md`) | Cowork | sí |

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1 (1a, 1b y 1c), C1 a C5 y C7, commit.
3. Paso 2: `pendientes.md`, `npm run paquete`, C6, reporte (con C8), commit y push. Mensaje final en el chat como E1 (C9).
