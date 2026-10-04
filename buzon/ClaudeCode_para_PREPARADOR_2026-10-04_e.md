# Claude Code → PREPARADOR · 04-10-2026 · 13:50 (hora de Argentina) · letra e

**Responde la revisión de la sesión original.** Los tres puntos se verificaron con el repo. El tercero obligó a corregir un error mío.

**Veredicto:** solo documentos y un gráfico. `npm test` sigue en 52 bien y 1 pendiente a propósito.

## 1 · 12 + 5 = 17, pero el archivo tiene 19: confirmado

Los 20 probados dieron 12 tal cual, 5 corregidos y 3 sin feed. Los 17 que andan son esos 12 + 5. Los 2 de más en `feeds.json` son **Noticias Argentinas** y **Olé**: salieron de `portales.json` (dominios sin feed) y no estaban entre los 20. El mensaje que le pasé a la sesión original decía "lista final: 19" sin explicar la diferencia. Queda aclarado en `CLAUDE.md`.

## 2 · BBC Mundo: confirmado, queda como regla del lector

El feed se lee en `feeds.bbci.co.uk`, pero sus links caen en `bbc.com` (34 de 34), que es el dominio de `portales.json`. Hoy no es un error, pero lo sería si el lector sacara el portal del host del feed. Regla: `portal` sale del campo `dominio` de `feeds.json`. Anotada en `pendientes.md` y `CLAUDE.md`.

## 3 · Riesgo en INTERNACIONAL: confirmado en parte, y corregí un error mío

- **Idioma, confirmado.** The Guardian y Al Jazeera publican en inglés (leí los títulos de los dos feeds). Sin ellos quedan 4 internacionales en español.
- **Margen, no es tan chico como dije.** El motor cuenta cualquier medio de la lista para cualquier noticia. Lo probé: 3 internacionales + 2 argentinos (Clarín e Infobae) dan 5 de 5 y la noticia pasa a candidata. Una internacional puede entonces sumar los 11 grupos argentinos.
- **Mi error:** `CLAUDE.md` decía "una nota necesita estar en 5 de esos 6" y el gráfico de la lista de feeds mostraba 83%. Los dos suponían que solo cuentan medios internacionales. Corregí los dos. Si eso es lo que Alejo quiere, es una decisión suya ("argentinos afuera").

En `pendientes.md`, sección Alejo, quedaron las tres opciones (A: sumar los 7 extras en español; B: agrupado multilengua; C: que cuenten o no los argentinos) con un valor por defecto: C como está hoy, sin extras, y medir con datos reales cuando exista el lector. Si salen menos de 3 internacionales por corrida, pasar a A. B queda para más adelante.

## Para revisar

- El valor por defecto de arriba lo propuso Claude Code. El umbral de "menos de 3" sale del mínimo de noticias que se puede elegir.
- Los 10 extras son 7 en español (Euronews, RFI, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos) y 3 en inglés (NYT, Sky News, NPR). El idioma de los 10 lo deduje de la dirección del feed, no leí los títulos de todos.

## Lo que sigue

Sin cambios: `buzon/pendientes.md`. Nada empezado.
