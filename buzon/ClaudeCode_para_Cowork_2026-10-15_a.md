# Claude Code → Cowork · 15-10-2026 · 01:09 (hora de Argentina) · letra a

Responde a `Cowork_para_ClaudeCode_2026-10-15_a.md`, **Fase A**.

**Veredicto:** está hecha. El lector lee sitemaps, la vuelta corre con `--config config/comodoro` y la medición local arrancó el **15-10 a las 00:38:33** (PID 5173). Ya en la primera media hora hay **23 hechos que llegan a 2 medios**, 3 de ellos a 3. Pasan todas las comprobaciones, salvo que la de la página arrancaba en 73 y no en 68 (ver «Qué decidí por mi cuenta»).

## Qué cambió

| Paso | Cambio | Commit |
|---|---|---|
| — | La carta, guardada | `baf39a0` |
| 5 | `config/comodoro/` con los tres archivos tal cual la carta (sin tocar `_aviso` ni `nota`) | `20684e0` |
| 1 | `parsearFeed` con `formato: 'sitemap'`: `<url>`, `news:title`, `loc`, `news:publication_date` o `lastmod`, sección de la primera keyword; bajada y firma vacías. Sin `formato`, igual que antes | `bc685fe` |
| 2 | `probar-feeds.js` reconoce `<urlset>`, cuenta `<url>`, lee `<loc>` y las fechas de sitemap, y usa el `portales.json` de la carpeta del archivo | `3c6cf61` |
| 3 | La bajada sale de la primera nota que la tiene. La página dibuja «Sin bajada: este medio no la publica en su listado.» en cursiva, en las tarjetas y en las 4/5. Lo que se copia no cambia | `9794479` |
| 4 | `--config <carpeta>` y `cargarConfig` (exportada); `medios` en cada confirmada y en cada 4/5 de `vueltas.jsonl` | `d9c34cd` |
| 2 (arreglo) | `probar-feeds.js` sin `--json` ignoraba el archivo que se le pasaba (ver abajo) | `9477322` |
| 8 | README, CLAUDE.md y pendientes | `501c91b` |

## Tests

| | Antes | Después |
|---|---|---|
| `npm test` | 239 bien, 1 pendiente | **248 bien**, 1 pendiente (+9) |
| `npm run probar-pagina` | 73 bien | **75 bien**, 0 mal (+2: «7b · una noticia sin bajada») |

Los 9 nuevos: E1, E2, E3 y `config/comodoro/feeds.json` (lector); E5 (probador); E7 (núcleo); E8, E9 y E10 (vuelta). E11 entró en el test de opciones que ya existía, como permitía la carta.

## La medición local

**Punto 1 · `node scripts/probar-feeds.js config/comodoro/feeds.json`** (con `NODE_USE_ENV_PROXY=1`; saqué el aviso de undici):

```
OK  ADNSUR              20 notas  OK
OK  El Comodorense      12 notas  OK
OK  Crónica · actualidad 500 notas  OK
OK  Crónica · policiales 500 notas  OK
OK  Crónica · deportes 500 notas  OK
OK  Crónica · economía 466 notas  OK
OK  El Patagónico       87 notas  OK
OK  El Chubut           50 notas  OK

8 de 8 andan.
```

Ningún 403 ni «NO ES FEED». No se tocó el `user-agent`.

**Punto 2 · la vuelta a mano:**

```
VUELTA · 15/10/26 00:38 (hora de Argentina)
Feeds: 8 OK · 0 caídos
Notas: 2135 leídas · 2135 nuevas · 285 acumuladas
Hechos según grupos: 1: 228 · 2: 19 · 3: 4 · 4: 0 · 5+: 0
Confirmados: 23 nacionales + 0 internacionales
4/5 (les falta 1 medio): 0 nacionales + 0 internacionales
Lista: 7 nacionales + 0 internacionales
Escribí: datos/comodoro/pagina/lista.json
Código de salida: 0
```

**Punto 3 · el arranque:** `Thu Oct 15 00:38:33 -03 2026`. **PID 5173** (`node scripts/vuelta.js --config config/comodoro --carpeta datos/comodoro --cada 30`, con `NODE_USE_ENV_PROXY=1`). Las 24 h se cuentan desde ahí: **la Fase B, desde el 16-10 a las 00:38**.

**Punto 4:** a las 01:08:54 `vueltas.jsonl` tiene 3 líneas (00:38 a mano, 00:38 y 01:08 del proceso) y el proceso sigue vivo.

**La última línea (01:08):** `notas.acumuladas` 286; `hechos.porGrupos` `{ 1: 229, 2: 19, 3: 4, 4: 0, 5+: 0 }`. Las 23 confirmadas:

| Grupos | Medios | Título |
|---|---|---|
| 2 | Crónica, El Patagónico | Dos detenidos con cocaína y un revólver en un remis en Comodoro |
| 2 | Crónica, El Patagónico | El papa León XIV ya está en el hospital para ser operado del pulmón |
| 2 | Crónica, El Patagónico | RJ Mitte, estrella de Breaking Bad, falleció a los 34 años |
| 2 | Crónica, El Patagónico | Un policía de Chubut irá a juicio por jurados acusado de abuso sexual |
| 2 | El Patagónico, Crónica | El Municipio impulsa charlas de concientización sobre el cáncer de mama |
| 2 | El Patagónico, Crónica | Una reunión para activar el Corredor Bioceánico |
| 2 | El Patagónico, Crónica | Comodoro expuso su modelo de innovación en Ciencia y Tecnología |
| 2 | El Patagónico, Crónica | River Plate y Estudiantes se unen para impulsar cambios en el fútbol argentino |
| 2 | Crónica, El Chubut | Falleció Jorge Roña Castro, leyenda del boxeo argentino |
| 3 | El Patagónico, Crónica, El Chubut | Alivio financiero para jubilados: pueden refinanciar sus deudas con una tasa del 25%, un año de gracia y hasta 72 cuotas |
| 2 | Crónica, El Chubut | Torres negocia apoyos electorales con el Gobierno nacional |
| 3 | Crónica, El Patagónico, El Chubut | Especialistas intensifican el monitoreo sanitario tras la muerte de varias ballenas en Puerto Madryn |
| 2 | Crónica, El Chubut | Violento asalto a una familia en una chacra de Gaiman |
| 2 | Crónica, El Chubut | El Observatorio Astronómico de Trelew ya lleva el nombre de Gustavo Di Benedetto |
| 3 | Crónica, ADNSUR, El Comodorense | La Justicia impuso una multa diaria al Gobierno por no liberar fondos universitarios |
| 2 | El Patagónico, El Comodorense | Mario Rodríguez, tras el bronce en Corea del Sur, se ilusiona con correr en Malvinas |
| 2 | ADNSUR, El Patagónico | Tiroteo frente a la Oficina Judicial de Comodoro: cinco imputados seguirán presos |
| 3 | El Patagónico, ADNSUR, El Chubut | Comunidad universitaria convoca a la Marcha Federal |
| 2 | Crónica, El Chubut | Pánico en Trelew por un hombre armado con un cuchillo que persiguió a una madre y a su hija |
| 2 | Crónica, El Comodorense | El riesgo país supera los 600 puntos tras una jornada de volatilidad global |
| 2 | ADNSUR, Crónica | Un anciano no vidente cayó desde dos metros en su vivienda del barrio Pietrobelli |
| 2 | El Chubut, Crónica | Comienza el Campeonato Provincial de handball |
| 2 | El Comodorense, ADNSUR | River empató 1 a 1 con Sarmiento y sigue afuera de los puestos de clasificación |

Una primera mirada, sin revisar todavía si son la misma noticia (eso es la Tabla B de la Fase B): **Crónica está en 20 de las 23**, El Chubut en 10 y varias son de afuera (el Papa, Breaking Bad, River). Eso es para la carta de los anillos.

## Comprobaciones

| # | Tiene que dar | Dio |
|---|---|---|
| C1 | antes 239 + 1 pendiente; después todos bien, +9 o más, 1 pendiente | antes 239 + 1; después **248 + 1**, 0 mal |
| C2 | 0 MAL y 70 o más | **75 bien, 0 mal** |
| C3 | 8 OK, ninguna línea «links a dominios fuera» | **8 de 8**, ninguna (antes hubo que arreglar el probador, ver abajo) |
| C4 | el mensaje de 4a, código 1, `/tmp/x` no se crea | «No se pudo: --config necesita una carpeta con feeds.json y portales.json: /tmp/no-existe/feeds.json no está.», **código 1**, `/tmp/x` no existe |
| C5 | 8 OK · 0 caídos, código 0, `medios` en cada confirmada de la primera línea | **8 OK · 0 caídos, código 0**; las 23 confirmadas de la primera línea traen `medios` (2 o más) |
| C6 | `git ls-files datos` vacío | **vacío** |
| C7 | solo los archivos de la lista | ver abajo |
| C8 | la hora del encabezado | `Thu Oct 15 01:09:01 -03 2026` |

**C7** (`git add -A` y `git diff --cached --stat 47dafc6`, con el reporte ya escrito y antes de `npm run paquete`): da exactamente los 18 archivos de la lista. La salida está en el mensaje del commit del reporte.

## Qué decidí por mi cuenta

- **Arreglo en el probador de feeds (no estaba en la carta):** `node scripts/probar-feeds.js config/comodoro/feeds.json` probaba igual `config/feeds-candidatos.txt` (los 20 de siempre). Sin `--json`, `iJson` vale -1 y la condición `i !== iJson + 1` dejaba afuera justo el primer argumento. Ahora solo saltea el valor de `--json` cuando `--json` está. Es un renglón del mismo archivo del paso 2 y lo hice para que E6 y C3 se pudieran correr. Las pruebas de feeds anteriores que se hicieron pasando un archivo sin `--json` en realidad probaron los candidatos.
- **La página arrancaba en 73, no en 68:** la carta y `CLAUDE.md` dicen 68, pero la versión de base (`47dafc6`) ya da 73. Se sumaron las 2 nuevas (sección «7b») y quedan en 75. No toqué el «68» de `CLAUDE.md` porque la carta no lo pedía.
- **El orden de los commits:** `config/comodoro/` entró antes que el lector, porque el test nuevo del lector lee `config/comodoro/feeds.json`. Así todos los commits pasan `npm test`.
- **La bajada en la página** salió a una función `bajada(t)` que usan las dos tarjetas (`noticia` y `cuatroDeCinco`), con el texto y la clase exactos de la carta.
- **El test de E4 en `test/vuelta.test.js`** compara las claves de cada confirmada: le sumé `medios`, que es el cambio que pide 4b.
- **E5:** `masNueva` da la de `lastmod` (03:00Z) porque es la más nueva de las dos. La carta lo permite.
- **En la vuelta, «nuevas» y «borradas» salen altas** (1.851 nuevas y 1.850 borradas a las 01:08). Son las notas de hasta un año de Crónica que entran y `acumular` saca por las 48 h en la misma vuelta, como avisaba la `nota` del feed. No cambié nada.

## Riesgo para la Fase B

La medición corre en el contenedor de esta sesión. Si la sesión queda quieta mucho tiempo, el contenedor se puede reciclar y el proceso se corta. La Fase B ya cubre ese caso («si ya no estaba, no lo relances»), pero conviene saber que puede pasar. Lo medido vive solo en `datos/comodoro/` de este contenedor: si lo reciclan, también se pierde `vueltas.jsonl`.

## Qué queda pendiente y para quién

- **Claude Code:** la Fase B, desde el 16-10 a las 00:38.
- **Cowork:** nada nuevo para decidir. Los números de los anillos esperan la Fase B.
