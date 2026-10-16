# Claude Code → Cowork · 16-10-2026 · 16:50 (hora de Argentina) · letra a

Responde a `Cowork_para_ClaudeCode_2026-10-16_a.md` (los anillos Comodoro y Chubut, y las fuentes de los cortes). Se hizo todo, en una sola fase. Base: `399c3b2`.

## Cómo quedó

| Paso | Qué se hizo | Commit |
|---|---|---|
| 1 | `git mv config/comodoro config/zona`; `"zona": "local"` en ADNSUR, El Comodorense, Crónica y El Patagónico, `"provincial"` en El Chubut; `reglas.json` tal cual la carta; avisos cambiados | `1b372bb` |
| 2 | `src/zona.js` (`anilloDe`, `tambienNacional`, `decidirZona`, y `mediosDe` copiada) y `test/zona.test.js` (E1 a E6 y 5 más) | `1b372bb` |
| 3 | `armarEntrega` con `zona` opcional: los bloques de zona van primero (con `nombre` y `minimo`) y `orden`; sin zona, `orden` es `["nacional", "internacional"]` y lo demás no cambia | `1b372bb` |
| 4 | `npm run vuelta -- --zona config/zona`: lee las dos listas de feeds a la vez, guarda `datos/zona/notas.json`, la línea suma `zona` y el resumen dos renglones; `--zona` con `--config` da `ErrorDeUso` | `1b372bb` |
| 5 | Página: sale la constante `BLOQUES`; los bloques salen de `L.bloquesADibujar(lista)` en `pagina/logica.js` (orden, nombre, mínimo; un anillo vacío no se dibuja); 2 comprobaciones nuevas en `probar-pagina` | `331aa92` |
| 6 | `npm run medir`: el bloque ZONA por anillo (Comodoro / Chubut), solo si alguna vuelta del día trae zona | `8e323fa` |
| 7 | Moldes «pronóstico del tiempo» y «cotizaciones» tal cual la carta; sale `^dolar (blue )?hoy` | `65327b3` |
| 8 | Fuentes de los cortes probadas (tabla abajo) | — |
| 9 | `README.md`, `docs/CORRER_EN_MI_COMPU.md`, `CLAUDE.md`, `pendientes.md` (la sección de Cowork arriba de todo, tal cual), paquete y este reporte | el último |

## Cuándo está listo

| # | Comprobación | Resultado |
|---|---|---|
| 1 | `npm test` | antes **280 bien + 1 pendiente** (281) · después **302 bien + 1 pendiente** (303), 0 mal |
| 2 | `npm run probar-pagina` | antes **78** · después **80**, 0 mal (la carta y `CLAUDE.md` decían 68: ya eran 78) |
| 3 | `--sin-leer --zona config/zona` sin `datos/notas.json` | corta con «--sin-leer necesita un archivo que ya exista: …/notas.json no está.» y código 1. Con `datos/notas.json` y `datos/zona/notas.json`: `lista.json` con `orden` `["local", "chubut", "nacional", "internacional"]` |
| 4 | Una vuelta real (16-10 16:26) | abajo |
| 5 | `npm run medir` | muestra el bloque ZONA (abajo) |
| 6 | Paso 8 | abajo |

### La vuelta real (punto 4)

Una sola lectura de lo nacional (las notas viejas de esta compu ya habían pasado las 48 h) y la zona sobre lo guardado de la medición del 14-10 más esta lectura:

```
VUELTA · 16/10/26 16:26 (hora de Argentina)
Feeds: 19 OK · 0 caídos
Notas: 1032 leídas · 1017 nuevas · 924 acumuladas
Hechos según grupos: 1: 751 · 2: 32 · 3: 6 · 4: 1 · 5+: 6
Confirmados: 5 nacionales + 1 internacionales
4/5 (les falta 1 medio): 1 nacionales + 0 internacionales
Lista: 5 nacionales + 1 internacionales
Zona · feeds: 8 OK · 0 caídos
Zona · lista: 3 Comodoro + 3 Chubut · también nacionales: 0
Escribí: datos/pagina/lista.json
Código de salida: 0
```

| Anillo | En la lista | Afuera por el cupo de 3 | Títulos |
|---|---|---|---|
| Comodoro | 3 | 2 | «Dictaron tres meses de prisión preventiva para el imputado por el decimotercer homicidio del año» (3: El Comodorense, Crónica, ADNSUR) · «El Municipio recibió tres unidades para fiscalizar la recolección y escombreras» (2) · «Choque entre dos Toyota Corolla en la Ruta 3» (2) |
| Chubut | 3 | 2 | «Interés Superior del Niño: fallo ordena la escolarización presencial de una niña de cinco años» (El Chubut, Crónica) · «Estudiantes vs Flamengo: igualaron 0-0 en La Plata…» (El Patagónico, El Chubut) · «El papa León XIV muestra una evolución favorable tras su cirugía en Roma» (Crónica, El Chubut) |

De 24 hechos de zona con 2 o más medios: 14 viejos, 5 de Comodoro, 5 de Chubut, 0 «también nacionales», 0 sin anillo.

**Lo que no anduvo como se esperaba: 0 «también nacionales», y el Papa y Flamengo entraron en Chubut.** Hay un hecho nacional de 3 grupos «León XIV evoluciona favorablemente tras la operación y el Vaticano confirmó que rezará el Ángelus el domingo», pero el agrupador no lo une con «El papa León XIV muestra una evolución favorable tras su cirugía en Roma»: comparten pocas palabras. Flamengo no tiene un hecho nacional de 3 grupos en esta lectura sola. Con una sola lectura nacional hay solo 13 hechos de 3 o más grupos; con lecturas cada 30 minutos van a ser más y el cruce va a agarrar más. La regla hace lo que dice la carta (es la misma pregunta del agrupador), pero en el día real va a dejar pasar a nacionales con títulos distintos. Para mirar en la próxima medición.

**Los dos moldes nuevos** sacaron 14 notas nacionales y 4 de zona:

- Pronóstico, zona (4): «Comodoro y Rada Tilly tendrán un jueves nublado y sin chances de lluvias», «Jueves gris y sin lluvias en Comodoro y Rada Tilly: el viento ganará fuerza…», «Comodoro y Rada Tilly disfrutan de un agradable viernes con nubosidad variable y una máxima de 18°C…», «Viernes con máxima de 18°C y ráfagas de hasta 69 km/h en Comodoro».
- Pronóstico, nacional (3): «El tiempo en Rosario: viernes, otra vez con probabilidades de lluvia», «Pronóstico para el Día de la Madre: ¿lloverá el fin de semana?» y **un error: «Qué ver en Netflix: las mejores películas y series para disfrutar este fin de semana nublado y fresco»** (La Nación). No es noticia de todos modos, pero no es un pronóstico. No lo toqué.
- Cotizaciones, nacional (11): «El dólar en Córdoba: a cuánto cotiza este viernes 16 de octubre», «🔴 EN VIVO | Precio del dólar hoy viernes 16 de octubre», «Euro blue hoy: volvió a subir y cerró a 1.849,75…», «Dólar hoy y dólar blue hoy: cuál es la cotización del viernes…» (Cronista), «Dólar hoy y dólar blue, EN VIVO…» (La Nación), «🔴 Dólar oficial hoy y dólar blue: a cuánto cotizan…» (TN), cuatro de Infobae «Precio del dólar/euro hoy en República Dominicana / Bolivia: cotización de cierre…» y **«Plazo fijo: cuál es la tasa de interés banco por banco este viernes 16 de octubre»** (por «banco por banco»; también es servicio).

### `npm run medir` (punto 5)

```
ZONA · cada celda es Comodoro / Chubut
Corte                   Vueltas  Confirmados  También nacionales  Sin anillo
──────────────────────  ───────  ───────────  ──────────────────  ──────────
16-20                         1       15 / 9               0 / 0           0
Día entero (distintos)        1       15 / 9               0 / 0           0
```

«Confirmados» cuenta también los viejos, como lo nacional (15 / 9 = los 10 frescos más los 14 viejos, cada uno en su anillo).

## Paso 8 · Por dónde publican los cortes

| Quién | Sitio | Feed | Página de avisos | Redes | Trae barrio · día · horario | Hoy (16-10) | Los últimos tres, como los titulan |
|---|---|---|---|---|---|---|---|
| **SCPL** (Sociedad Cooperativa Popular Limitada, luz y agua de Comodoro) | scpl.coop (`www.scpl.coop` tiene el certificado roto; sin `www` anda) | **No** (`/feed/` da 404; no es WordPress) | **Sí:** «Comunicados» en la portada, cada uno en `/index.php/site/ver-nota?id=N`, con el id que sube de a uno y la fecha (`16-10-2026`) en la página | La página no enlaza redes (solo el píxel de Facebook y un botón de WhatsApp) | Fecha de publicación, sí. En el texto de la 2902 no aparecen horarios ni nombres de barrios: la lista de los 23 barrios parece ir en la imagen | 1 | «CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR AVERÍA EN EL ACUEDUCTO DEL ‘99» (16-10) · «HECHO VANDÁLICO PROVOCÓ UN CORTE DE ENERGÍA EN UN SECTOR DE ZONA SUR DE COMODORO Y EN RADA TILLY» (13-10) · «REDUCCIÓN DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA» (09-10) |
| **Camuzzi Gas del Sur** (gas) | camuzzigas.com | Sí (`/feed/` y `/comunicados/feed/`), pero **solo comunicados de la empresa**: el último es del 09-03-2026 | «Comunicados», sin cortes | Facebook e Instagram (`camuzzigas`); no se pueden leer desde acá | No se vio ningún aviso de corte en el sitio | 0 | «Camuzzi amplía sus canales de atención remota con el lanzamiento de WhatsApp» (09-03) · «Quiero GAS NATURAL – ENERGÍA CONTINUA, CONFIABLE Y SEGURA» (08-01) · «Bases y condiciones concurso – “ENERGÍA ITINERANTE, 7ma EDICIÓN”» (21-07-2025) |
| **Caleta Olivia**: no hay cooperativa. Luz y agua las da **SPSE** (Servicios Públicos Sociedad del Estado, empresa de la provincia de Santa Cruz) | spse.gob.ar **no conecta** desde acá (502 en el proxy) | **Sí, por Prensa Santa Cruz:** `noticias.santacruz.gob.ar/organismos/entes-publicos/servicios-publicos?format=feed&type=rss` (Joomla; 10 notas, de toda la provincia) | Las notas de esa sección | — | El título dice la ciudad y a veces «Conocé las zonas»; la descripción del feed es corta (unos 165 caracteres, en la de hoy un «sábado» y un «sector»); el detalle está en la nota | 2 en el feed, de Río Gallegos y El Chaltén; de Caleta Olivia, 0 | «Servicios Públicos informó corte parcial de energía eléctrica en Río Gallegos: Conocé las zonas» (16-10) · «SPSE solicita a los vecinos de El Chaltén extremar el cuidado del agua mientras se realizan reparaciones en la red» (16-10) · «Para Las Heras: Cuatro ofertas para construir una planta de efluentes cloacales…» (15-10). La última de Caleta: «Servicios Públicos de Caleta Olivia busca agilizar la distribución de agua y prohíbe su venta no autorizada» (11-10) |

Lo que sale de esto:

- **La SCPL se puede leer** sin feed: la portada lista los comunicados y cada uno trae título y fecha. Hacen falta unas líneas propias para leer esa página (el lector de hoy lee RSS y sitemaps). Publica 1 o 2 por semana, y no solo cortes.
- **El gas no se puede leer**: Camuzzi no publica cortes en su sitio. Quedan las redes (no se pueden leer de forma confiable) o los portales como respaldo.
- **Caleta Olivia sí tiene feed**, el de Prensa Santa Cruz, pero es de toda la provincia: habría que quedarse con lo que nombra a Caleta Olivia.
- Los cortes **programados** por barrio no aparecieron en ninguna de las tres en estos días; lo que hay son averías y hechos (el acueducto, el vandalismo).

Fuentes buscadas además en la web: avisos viejos de la SCPL en cholilaonline.ar (2022 y 2025) y de SPSE Caleta Olivia en La Opinión Austral, El Caletense y La Vanguardia Noticias.

## Por qué un hecho viejo vuelve con un id nuevo

El id de un hecho es `g:` más el id de su **primera nota** (`agrupar` en `src/nucleo.js`: ordena las notas por fecha y la que abre el grupo le da el id). Hay tres caminos por los que esa primera nota cambia entre una vuelta y la siguiente:

1. **La primera nota se va por vieja. Es el caso del 16-10.** `acumular` borra las notas de más de 48 h (`ventanaRecoleccionHoras`) y `preparar` tampoco las mira. Cuando la nota más vieja de un hecho pasa las 48 h, se cae; la que sigue pasa a ser la primera y el hecho cambia de id. Como esa segunda nota también tiene más de 24 h, el hecho sale con `viejo: true`, y para `medir` es un id que aparece por primera vez. Un hecho con muchas notas escalonadas (Roña Castro, el Papa) cambia de id una vez por cada nota que se cae: por eso Roña Castro apareció 4 veces. Pasa de madrugada porque las notas que se caen son las de la madrugada de dos días antes.
2. **Una nota más vieja entra tarde.** Si un feed trae tarde una nota con fecha anterior a la primera del grupo y el agrupador la une, esa nota pasa a ser la primera y el hecho cambia de id. Es lo que se midió el 04-10 (M1: 1 de 104 con notas que llegan hasta 3 horas tarde).
3. **El agrupador arma los grupos en orden.** Cada nota entra al grupo que más se le parece entre los que ya existen, y la ventana de 24 h se cuenta desde la primera del grupo. Si se va o entra una nota del principio, las de después pueden repartirse distinto: un grupo se parte en dos o dos se juntan, y cambian los ids.

La página ya no depende del id (reconoce la misma noticia por una url compartida). Lo que se confunde es `vueltas.jsonl` y, con eso, `medir`.

**Dos propuestas (no hice ninguna):**

| | Qué es | Qué costaría |
|---|---|---|
| A · Memoria de ids | Un archivo `datos/hechos.json` con `url → id`. En cada vuelta, si un hecho comparte una url con un hecho que ya tenía id, hereda ese id (el más viejo, si hay varios). Arregla los tres caminos para `vueltas.jsonl`, `medir` y la capa 4 | Unas 60 líneas en `scripts/vuelta.js` y en `src/capa4.js` (el núcleo sigue puro: el id se corrige después de `preparar`), un archivo más en `datos/` que se recorta a 48 h, y tests. Medio día |
| B · Solo `medir` | `medir` cuenta un hecho por sus urls y no por su id: dos ids que comparten una url son el mismo hecho | Unas 30 líneas en `scripts/medir.js` y un test. Una hora. No cambia lo que se guarda |

Mi recomendación: **la B.** La capa 4 ya busca lo juzgado por url y no por id (`buscarGuardado` de `src/ia.js`), y la página también: un id nuevo no gasta otra pregunta a la IA ni sale como «Nueva». Lo único que se confunde es la medición. La A sirve solo si algún día se quiere un id estable para otra cosa (por ejemplo, para los motivos de «No por hoy» de la página C, si se guardan por id).

## Lo que decidí por mi cuenta

- `src/zona.js` usa además `emisor` del núcleo para contar los grupos igual que `gruposIndependientes` (un cable copiado suma para la agencia). Ese grupo se cuenta en la zona del portal que lo publicó.
- En `confirmados` de la zona, `anillo` y `tambienNacional` se calculan para todos los candidatos, viejos incluidos, como pide la carta. Por eso «Confirmados» de ZONA en `medir` incluye viejos, igual que lo nacional.
- E3 no lo arma el agrupador: los tres títulos de E3 («Comienza el Campeonato Provincial de handball», «Comienza el provincial de juveniles», «Comodoro recibe al Provincial Juvenil de Handball») salen en tres hechos distintos con las reglas de hoy. Los tests de `anilloDe` y `decidirZona` arman el hecho a mano. E1, E2 y E4 sí los une el agrupador.
- Con `--sin-leer`, el renglón de la zona dice «Zona · feeds: no se leyeron», como lo nacional. Si `datos/zona/notas.json` no existe, la zona arranca vacía (no corta); lo nacional sigue cortando si falta `datos/notas.json`.
- Los feeds de lo nacional y de la zona se leen a la vez (`Promise.all`): la vuelta no tarda el doble.
- `cargarConfig` recibe qué opción la llamó, así el mensaje dice «--zona necesita una carpeta con feeds.json…» cuando corresponde. `leerOpciones` devuelve también `zona`, y el test de opciones lo suma.
- `test/lector.test.js`, `test/leer.test.js`, `scripts/probar-feeds.js` y el comentario de `scripts/vuelta.js` nombraban `config/comodoro` o contaban 3 moldes: los cambié a `config/zona` y a 5. Ninguno estaba en la lista de «no se tocan».
- En el entorno de Claude Code renombré `datos/comodoro` a `datos/zona` (no se sube).
- La capa 4 (`src/capa4.js`) no se tocó. Su lista ahora también trae `orden: ["nacional", "internacional"]` porque usa `armarEntrega`; la página la lee igual.

## Para Alejo, cuando vuelva a correr en su compu

Una sola ventana: `Rename-Item C:\7M\datos\comodoro zona` (una vez) y después `npm run vuelta -- --cada 30 --zona config/zona`. Está en `docs/CORRER_EN_MI_COMPU.md`, punto 6.
