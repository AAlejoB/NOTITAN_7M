# Claude Code → Cowork · 14-10-2026 · 23:40 (hora de Argentina) · letra a

No responde a ninguna carta. Alejo pidió adelantar, mientras corre la medición en su compu, la prueba de feeds de los portales locales que estaba en «Abierto» (sección de las 20:15 de `pendientes.md`). **Solo se midió:** no se tocó código, configuración, la página ni `datos/`. La prueba se corrió desde el entorno de Claude Code con `scripts/probar-feeds.js` sobre una lista de candidatos en una carpeta temporal (no quedó en el repo).

**Veredicto:** Comodoro Rivadavia tiene **3 portales con feed que anda y está al día** (ADNSUR, El Comodorense y Crónica). Con eso un bloque local con «2 medios para confirmar» es posible de entrada. Lo provincial (Chubut) **no tiene feeds**: los dos que se pueden leer lo hacen por su sitemap de noticias, que trae título, fecha y link pero no bajada, y el lector hoy no sabe leerlo.

## Qué anda

| Portal | Ciudad | Feed | Notas que trae | Última nota | En 24 h | En 48 h | Autor |
|---|---|---|---|---|---|---|---|
| ADNSUR | Comodoro | `https://www.adnsur.com.ar/rss.xml` (también `atom.xml`) | 20 | hace 0,2 h | 20 | 20 | no |
| El Comodorense | Comodoro | `https://www.elcomodorense.net/feed/` | 12 | hace 0,9 h | 12 | 12 | sí |
| Crónica · actualidad | Comodoro | `https://www.diariocronica.com.ar/rss/actualidad` | 500 | hace 4,9 h | 27 | 64 | no |
| Crónica · policiales | Comodoro | `/rss/policiales` | 500 | hace 3,8 h | 8 | 15 | no |
| Crónica · deportes | Comodoro | `/rss/deportes` | 500 | hace 1,0 h | 18 | 32 | no |
| Crónica · economía | Comodoro | `/rss/economia` | 468 | hace 4,6 h | 2 | 6 | no |
| Crónica · energía | Comodoro | `/rss/energia` | 54 | — | — | — | no |

Crónica no tiene feed general: tiene uno por sección (la lista está en `https://www.diariocronica.com.ar/rss`). Sus feeds traen notas de hasta un año atrás; lo de más de 24 h ya lo descarta el motor.

## Qué no anda

| Portal | Ciudad | Qué pasa | Alternativa |
|---|---|---|---|
| El Patagónico | Comodoro | Sin feed (404 en `/feed`, `/rss`, `/rss.xml`); la portada responde 403 al probador y 200 con un navegador común | **Sitemap de noticias** `/sitemap-news.xml`: 87 títulos, del 12-10 al 15-10 |
| El Chubut | Trelew | Sin feed (404) | **Sitemap de noticias** `/sitemap-news.xml`: 50 títulos de las últimas 24 h |
| Diario Jornada | Trelew | Sin feed (devuelve la página, no un feed); sin sitemap de noticias | Ninguna encontrada |
| La Opinión Austral | Río Gallegos (Santa Cruz), con edición de Caleta Olivia | Sin feed (404); sin sitemap de noticias | Ninguna encontrada |
| Rawson Digital | Rawson | No conecta | Ninguna |

**Ojo con dos datos de la lista de candidatos:** El Patagónico es de Comodoro, no provincial; y La Opinión Austral es de Santa Cruz, así que para la regla «2 medios de 2 provincias» contaría como Santa Cruz, no como Chubut.

## Qué hace falta decidir (para Cowork, con Alejo)

1. **Leer sitemaps de noticias además de feeds.** Suma El Patagónico y El Chubut (y es lo único que hoy le daría algo al bloque provincial). Costo: una pieza nueva en el lector; esas notas vendrían sin bajada. Valor por defecto propuesto: sí, pero en la carta de los anillos, no antes.
2. **Con cuáles feeds de Crónica quedarse.** Todos menos «energía» parece lo razonable; «actualidad» es el que más trae.
3. **ADNSUR y Crónica no traen autor:** no sirven para la vía B (firmas). El Comodorense sí.
4. Para la Región (Neuquén, Río Negro, Santa Cruz, Tierra del Fuego) no se probó nada: no había candidatos.

## Lo que no se hizo

- No se sumó nada a `config/feeds.json` ni a `portales.json`.
- No se midió cuántas noticias locales llegarían a 2 medios: haría falta leer estos feeds varias veces durante un día, como la medición de Alejo.
