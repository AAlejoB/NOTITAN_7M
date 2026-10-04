# Claude Code → PREPARADOR · 04-10-2026 · 17:05 (hora de Argentina) · letra i

**Veredicto:** hechos los 4 pasos de tu carta (`PREPARADOR_para_ClaudeCode_2026-10-04_a.md`) y la medición con datos reales. Con 0.5 hay **0 verificados** sobre lo acumulado; con 0.3 hay **2**, y entre esos dos hechos hay 0 uniones falsas, así que `umbralSimilitud` quedó en **0.3**. `npm test` pasó de 73 a **102 bien** y sigue 1 pendiente a propósito.

## Qué cambió

| Paso | Commit | Cambio |
|---|---|---|
| 1 | `b8a533d` | Reuters, AP, AFP, EFE, La Voz y LN+ quedan `activo: false` en `config/portales.json`. Ya no avisan "feed roto" ni suman a la verificación. El día de ejemplo usa medios argentinos para lo internacional. 1 test nuevo. |
| 2 | `d517194` | `acumular(guardadas, nuevas, {reglas, ahora})` en el núcleo. `npm run leer -- --acumular datos/notas.json` y `--sin-leer`. Guarda 48 h. `datos/` en `.gitignore` (el repo es público). |
| 3 | `bc16e90` | Perilla del agrupador: `umbralSeguro` y `minPalabrasComunes` en `reglas.json`; `--min-comunes` y `--detalle` en `npm run leer`. Una nota entra al grupo si se parece ≥ `umbralSeguro`, o si se parece entre `umbralSimilitud` y `umbralSeguro` y comparten `minPalabrasComunes` palabras. |
| 4 | `d50ca3d` | `pendientes.md` y línea de arranque con el link para clonar en `LEEME.md`. |
| medición | `88b217e` | `umbralSimilitud` de 0.5 a 0.3. |
| cierre | este commit | `CLAUDE.md`, `pendientes.md`, este reporte y los paquetes. |

El test #22 ("misma noticia: el mismo hecho se junta y otro hecho del mismo tema no") no se tocó y pasa con 0.3. Dos tests míos asumían 0.5; los hice independientes de la config. El día de ejemplo (`npm run demo`) da lo mismo con 0.3 que con 0.5.

## Medición con datos reales

5 lecturas de los 19 feeds, entre las 15:07 y las 17:00, separadas unos 28 minutos, acumuladas en `datos/notas.json`. Se midió sobre lo mismo con `--sin-leer`. Total: **1.150 notas**, 58 descartadas por criterio 1.

| Variante | `umbralSimilitud` | Mínimo de palabras | Hechos | Con 3 o más grupos | Con 5 o más grupos |
|---|---|---|---|---|---|
| V1 | 0.5 | 3 (no se mira) | 1.036 | 0 | **0** |
| V2 | 0.3 | 0 | 941 | 9 | **2** |
| V3 (elegida) | 0.3 | 3 | 941 | 9 | **2** |

Hechos según en cuántos grupos salieron, con V3:

```
1 grupo   897  ██████████████████████████████
2 grupos   35  █
3 grupos    6  ▏
4 grupos    1  ▏
5 o más     2  ▏  ← Brasil y García Cuerva
```

- **V2 y V3 dan lo mismo.** La regla de 3 palabras no cambió nada con estos datos: es una red de seguridad que todavía no se vio necesaria. La dejé porque tu carta la pedía.
- **Regla de decisión de tu carta:** V3 tiene 0 uniones falsas entre sus hechos de 5 o más grupos (revisé a ojo las 18 notas), así que 0.3. No probé otros números.
- Los dos verificados: **Brasil** (6 grupos, 12 notas: la jornada electoral, con avances, votación y resultados en vivo) y **García Cuerva en Luján** (6 grupos, 6 notas). Brasil es el caso límite porque junta cosas distintas del mismo día; lo juzgué la misma noticia. Si el DISEÑADOR piensa distinto, hay que decirlo.
- **Ninguno de los dos tiene un solo grupo internacional.** Brasil se verifica con 6 grupos argentinos. Es la opción C de `pendientes.md`, ahora medida: hoy una internacional se verifica porque cuentan los medios argentinos.

## Qué encontré (para subir al DISEÑADOR)

| Hallazgo | Dónde se ve | Riesgo |
|---|---|---|
| **Notas de servicio con plantilla se juntan mal.** "A qué hora juegan Talleres vs. Belgrano… EN VIVO" une partidos distintos (Argentinos-Tigre, Racing, Vélez). "Efemérides de hoy" une con la Lotería del Cauca. | 2 hechos de 3 grupos | Con más medios podrían llegar a 5 y pasar como verificados. La regla de 3 palabras no las frena. |
| **Hechos partidos.** Colapinto en Malasia/Bahréin sale como un hecho de 4 grupos y otro de 3: es la misma carrera. | 2 hechos | Juntos serían 5 o 6 grupos y verificarían. Hoy se pierde una noticia. |
| **Clarín e Infobae siguen cortos.** Con lo acumulado abarcan 2,1 h y 2,8 h. | tabla de ventanas | Hace falta leer cada 15 a 30 minutos para que no queden huecos (capa 4). |

Propuesta que **no implementé**: excluir las notas de servicio con plantilla en el criterio 1, con una lista de patrones en `reglas.json`. Está en `pendientes.md` con valor por defecto "no se hace hasta que el DISEÑADOR lo apruebe".

## Qué decidió Claude Code por su cuenta (para revisar)

- `minPalabrasComunes` por defecto 3 y `umbralSeguro` por defecto igual a `umbralSimilitud` cuando faltan en la config (así una config vieja se comporta como antes). Tests cubren las dos combinaciones.
- "Palabras en común" cuenta las mismas raíces (primeras 5 letras, sin palabras vacías) que usa el agrupador, sobre título más bajada. Por eso "juegan" y "jugará" cuentan como una.
- `--acumular` guarda las notas ordenadas por fecha y por id, para que el archivo no cambie de orden entre corridas.
- La línea de arranque con el link para clonar quedó en `LEEME.md`, con valor por defecto "sí". Si Alejo dice que no, se saca.
- El conteo de "nuevas" en `--acumular` puede parecer alto en la primera lectura de cada feed porque algunos devuelven notas viejas que nunca vimos: son nuevas para el archivo aunque no sean de hoy.

## Qué quedó pendiente

| A quién | Qué |
|---|---|
| DISEÑADOR (por el PREPARADOR) | Aprobar o no excluir las notas de servicio con plantilla en el criterio 1. |
| DISEÑADOR con Don Julio | Capa 4: cada cuánto leer (por defecto 30 min) y dónde se guarda `datos/notas.json`. |
| DISEÑADOR | Memoria de lo ya entregado: espera el diseño de la entrega. |
| Alejo | Lista de firmas, lista blanca, repo público o privado: sin apuro. |
| Claude Code | LN+: reintentar el feed con Network access en Full. |

No se hizo, como pedía la carta: memoria de lo ya entregado, capa 4, la IA que juzga, lista blanca y `firmas.json`.

## QUÉ HACÉS AHORA

| A quién | Qué le pasa | Qué espera | Cuándo | Quién ejecuta |
|---|---|---|---|---|
| PREPARADOR | Recibe este reporte con la medición | Leerlo y subir al DISEÑADOR los dos hallazgos (plantillas y hechos partidos) | Cuando Alejo se lo pase | Alejo lleva el archivo |
| Alejo | Nada se rompió; los paquetes están al día | Si quiere, decir "no" a la línea de arranque con link en `LEEME.md` | Cuando quiera | Alejo |
