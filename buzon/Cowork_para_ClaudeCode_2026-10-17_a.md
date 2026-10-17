# Cowork → Claude Code · 17-10-2026 · 00:25 (hora de Argentina) · letra a

Responde al reporte `ClaudeCode_para_Cowork_2026-10-16_e.md` (los avisos quedaron cerrados; no hay nada pendiente de esa carta). Esta es **la carta de la página C**: la página nueva de 7M, con el flujo por noticia que decidió Alejo. Es una carta grande. Tiene dos fases que se hacen en esta misma tanda, en orden: **Fase A, la página** (archivos en `pagina/`, más `src/entrega.js`, `src/nucleo.js`, `src/zona.js` y `config/reglas.json`) y **Fase B, el guardado por persona** (`scripts/servir.js`). Lo que dice «carta C» en esta carta **no se hace** ahora: «Falta una noticia» y «Combinar» van en otra carta.

El dibujo de todo esto es un artifact privado de Alejo («7M · Página C final»); no hace falta verlo: esta carta lo cuenta entero.

## 0. En una frase

Hoy la página es una lista larga de tarjetas con casillas y «Copiar las N» como paso principal. La página nueva muestra **una sola tarjeta abierta arriba (el pivote)** con botones grandes para decidir qué hacer con esa noticia (me interesa / no por hoy con motivo / archivar), el resto son renglones, lo decidido va a pestañas con número, y copiar es el último paso: se lleva solo lo que está en «Me interesa». Las decisiones se guardan por persona en el servidor cuando hay login, y en el navegador cuando no.

## 1. Qué cambia para quien usa la página

Al abrir la página, de arriba hacia abajo:

1. **Encabezado**: «Canal 2 · 7M» (como hoy), la hora de la última vuelta («última vuelta 15:10», en vez de «Actualizada hace N min») y el botón «↻ Actualizar» (en vez de «Traer noticias»). «Salir» sigue igual donde está.
2. **Avisos** (solo si la lista trae el bloque `avisos`): una franja propia, siempre arriba, un renglón por aviso con su pastilla (la misma de hoy: programado verde, avería naranja, cronograma gris, «se normalizó» verde lleno), la línea de datos de hoy («Sábado 17/10 · desde las 00:00 · 18 h · Zona Sur y Central») y **un solo botón «Me interesa»**. Un aviso no pasa por el pivote ni por «No por hoy».
3. **Temas**: botones que prenden y apagan (solo en el escalón Plus; ver §3). Lo apagado se oculta y se cuenta.
4. **Pestañas** con número: «Por decidir · Me interesa · Archivo · No por hoy» (en Plus) o «Por decidir · Me interesa · Pasadas» (en Normal).
5. **Avance**: «1 de 3 · Comodoro»: en qué posición está la abierta dentro de su bloque y cuántas quedan por decidir en ese bloque.
6. **El pivote**: la tarjeta abierta, siempre en el mismo lugar, con sello (como hoy: «Confirmada por 2 medios de Comodoro», «Confirmada por 7 medios», «Respaldada por…», «Confirmada por 4 medios · elegida a mano»), pastilla gris de tema, pastilla gris de hora, título, bajada (o «Sin bajada…» como hoy) y un link por medio.
7. **Los botones** de la abierta: tres en Plus («Me interesa» · «No por hoy…» · «Archivar»), dos en Normal («Me interesa» · «Siguiente»).
8. **Los renglones**: el resto de lo que hay por decidir, un renglón por noticia (pastilla con la cantidad de medios + título), agrupados por bloque con el título del bloque en el orden de `lista.orden`. Tocar un renglón lo sube al pivote.
9. Al pie de los renglones: «N ocultas por tema (Espectáculos) · ver» si hay temas apagados que ocultan algo; y «N que mandaste a No por hoy subieron a confirmada · ver» cuando pasa la mezcla (§6).
10. **Barra de abajo** fija: «Me interesa: N» y el botón «Copiar las N» (apagado con 0).

Desaparecen: las casillas, la pastilla «Nueva», la pastilla «Recién confirmada», el menú «En observación · les falta 1 medio» con «Llevármela igual» y el texto «Actualizada hace…».

## 2. Decidió Alejo y valores por defecto

| Qué | Quién |
|---|---|
| El flujo: mirar, decidir con tres botones, copiar al final solo lo que interesa; pivote fijo arriba; renglones para el resto; cuatro pestañas con número (Opción C, 14-10) | Alejo |
| Dos escalones en la misma página, Normal y Plus, fijados por cliente en `config/`; «ya fue» es lo que la persona tocó, nunca lo que miró; siempre Deshacer y Volver; sin marca visto/no visto (14-10) | Alejo |
| Temas: el motor no descarta por tema; en la página son botones que se prenden y apagan; lo apagado se oculta pero se cuenta y nunca se pierde; sin buscador (14-10) | Alejo |
| La mezcla: qué pasa con una noticia ya decidida que después sube a confirmada (14-10, §6) | Alejo |
| Avisos en franja propia arriba con un solo «Me interesa» (16-10) | Alejo |
| Las palabras de los siete motivos de «No por hoy» (16-10, §5) | Alejo |
| «Para llevar» y lo copiado van en el orden en que la persona eligió (16-10) | Alejo |
| Fases A y B en esta carta; «Falta una noticia» y «Combinar» en la carta C; los colores de hoy se quedan (16-10) | Alejo |
| Canal 2 arranca en Plus; los seis temas prendidos; el tema sale de la sección del portal (y de la IA cuando conteste); «Sin tema» se muestra siempre | Cowork, por defecto |
| Orden dentro de cada bloque: las confirmadas (`noticias`) en el orden de la lista y después las «le falta 1» (`aMano`); el pivote no se mueve al actualizar; franja «N nuevas» cada 5 minutos | Cowork, por defecto |
| Deshacer 6 segundos; «Otro motivo…» guarda lo escrito; 4/5 y 1/2 pasan por los mismos botones y «Me interesa» ahí es «elegida a mano» | Cowork, por defecto |
| Servidor si hay login, navegador si no; todo por link; un archivo por persona en la carpeta de datos | Cowork, por defecto |

## 3. La configuración nueva: `pagina` en `config/reglas.json`

Agregar a `config/reglas.json` (al lado de `cliente`) esta sección. Vale para todos los bloques, también los de la zona: `config/zona/reglas.json` **no** la lleva.

```json
"pagina": {
  "nombre": "7M",
  "escalon": "plus",
  "temas": [
    { "nombre": "Política", "prendido": true, "secciones": ["politica", "política", "el-pais", "elecciones"], "palabras": [] },
    { "nombre": "Economía", "prendido": true, "secciones": ["economia", "economía", "negocios", "finanzas", "dolar", "mercados"], "palabras": [] },
    { "nombre": "Sociedad", "prendido": true, "secciones": ["sociedad", "informacion-general", "salud", "educacion", "ciencia", "tecnologia", "tecnología"], "palabras": [] },
    { "nombre": "Policiales", "prendido": true, "secciones": ["policiales", "judiciales", "seguridad", "inseguridad"], "palabras": [] },
    { "nombre": "Deportes", "prendido": true, "secciones": ["deportes", "deporte", "futbol", "fútbol", "ole"], "palabras": [] },
    { "nombre": "Espectáculos", "prendido": true, "secciones": ["espectaculos", "espectáculos", "farandula", "farándula", "cultura", "musica", "cine", "series"], "palabras": [] }
  ],
  "motivos": [
    { "clave": "dato", "texto": "Es un dato, no una noticia" },
    { "clave": "tengo", "texto": "Ya la tengo" },
    { "clave": "opinion", "texto": "Opinión o reacción a otra" },
    { "clave": "bloque", "texto": "Está en el bloque equivocado" },
    { "clave": "vieja", "texto": "Ya pasó, llegó tarde" },
    { "clave": "publico", "texto": "No va con nuestro público" },
    { "clave": "otro", "texto": "Otro motivo…" }
  ]
}
```

- `nombre`: el nombre del producto que se ve en el encabezado (hoy «7M»; Alejo está pensando otro, y así cambiarlo es tocar esta línea). Si falta, vale `"7M"`.
- `escalon`: `"normal"` o `"plus"`. Cualquier otro valor, o si falta, vale `"plus"`.
- `temas`: hasta 10. Las `secciones` de arriba son un punto de partida: **el paso 1 de esta carta las ajusta con los datos reales** (ver §11, paso 1). `palabras` son palabras del título, en minúsculas y sin tildes, que también le ponen ese tema a una noticia (para que un cliente cree «Petróleo» con `["petroleo", "ypf", "vaca muerta"]` sin tocar código). Hoy todas vacías.
- `motivos`: siempre los siete, en ese orden; `otro` es el único que abre un renglón para escribir. Si `motivos` falta en la config, valen estos siete.
- Agregar a `docs/PAQUETE_DE_CLIENTE.md` las filas de escalón y temas como «Hecho», con dónde viven.

## 4. Lo que trae `lista.json` de nuevo (`src/entrega.js`, `src/nucleo.js`, `src/zona.js`)

Todo lo de hoy sigue igual (`generadaEn`, `ejemplo`, `sinIA`, `provisorias`, `cliente`, `paginaViejaMinutos`, `cupoMinimo`, `minGrupos`, `bloques`, `orden`, `avisos`). Se suma:

1. **`lista.pagina`**: `{ nombre, escalon, temas: [{ nombre, prendido }], motivos: [{ clave, texto }] }`, copiado de `reglas.pagina` (sin `secciones` ni `palabras`: la página no las necesita). `armarEntrega` recibe `reglas` ya, así que sale de ahí; si `reglas.pagina` no existe, se arma con los valores por defecto de §3. `scripts/vuelta.js`, `src/capa4.js` y `scripts/armar-pagina.js` no cambian para esto.
2. **En cada tarjeta de noticia** (no en los avisos): `tema` (texto: el `nombre` de un tema de la config, o `"Sin tema"`) y `hora` (ISO: `primera` del hecho, la fecha de su primera nota; es lo que el núcleo ya guarda en cada candidato como `primera`).
3. Para poder calcular `tema`, **cada salida de `decidir`** (las de `nacionales`, `internacionales` y las de `aMano`) y **cada noticia de `decidirZona`** suma dos campos: `primera` (el ISO que ya tiene el candidato) y `secciones` (la lista de `seccion` de sus notas, tal cual están en la ficha, sin repetir, sin las vacías). Son solo campos más: nada de lo que hoy devuelven cambia de valor ni de orden.
4. `temaDe({ seccionIA, secciones, titulo }, temas)` en `src/entrega.js` (pura, exportada), en este orden: (a) si `seccionIA` (el `seccion` que puso la IA, `j.seccion`) normalizada coincide con una `seccion` de algún tema, ese tema; (b) si no, de las `secciones` de las notas, la que más se repite que coincida con algún tema (empate: la primera en el orden de `temas` de la config); (c) si no, si el título normalizado contiene alguna palabra de `palabras` de algún tema, ese tema (el primero en el orden de la config); (d) si no, `"Sin tema"`. «Normalizada» es `normalizar` de `src/nucleo.js` (minúsculas, sin tildes) aplicada también a las `secciones` de la config.

## 5. La página, pantalla por pantalla

Todo lo que sigue es `pagina/index.html` (lo visual) y `pagina/logica.js` (las reglas, puras). Sigue sin librerías, un solo archivo HTML, pensada primero para celular, ancho máximo 760 px como hoy, y los mismos colores y pastillas de hoy (Alejo decidió no tocar la pinta en esta carta).

### 5.1 Encabezado y franjas

- Título: `lista.cliente + ' · ' + lista.pagina.nombre`, o solo `lista.pagina.nombre` si no hay cliente (hoy da «Canal 2 · 7M», igual que ahora). También en el `<title>` de la pestaña del navegador.
- A la derecha del título: «última vuelta HH:MM» (`horaAR(lista.generadaEn)`). Ya no se muestra «hace N min».
- Botón «↻ Actualizar»: trae `lista.json` de nuevo (`cache: 'no-store'`, 401 → `/entrar`, como hoy) y aplica la lista nueva (ver 5.9).
- Franjas que siguen igual que hoy, con los mismos textos: «Datos de ejemplo, inventados», «Sin el juicio de la IA: el bloque de cada noticia es provisorio», «N noticias con bloque provisorio…», la ámbar «No se actualiza desde las HH:MM · contactá al administrador» y la de error con «Reintentar».
- Franja nueva «N nuevas desde las HH:MM · Ver» (5.9).
- Al pie de la página, una línea chica gris: «Tus decisiones se guardan en tu usuario» o «Tus decisiones se guardan en este navegador» (Fase B, §8).

### 5.2 Avisos

Si `lista.bloques.avisos` existe y tiene `noticias`, debajo de las franjas va la franja «Avisos»: título «Avisos · N», y por cada aviso: la pastilla de hoy (`claseSelloDe`), la línea de hoy (`lineaDeAviso`, con «y N más» para los barrios) y a la derecha:

- si no está decidido: botón «Me interesa» (lo manda a la pestaña Me interesa con `sello: 'aviso'`);
- si está en Me interesa: el texto «En Me interesa» sin botón;
- si ya se llevó: «Te lo llevaste · HH:MM» sin botón.

Los avisos nunca aparecen en Por decidir, no cuentan en el número de esa pestaña y no tienen «No por hoy» ni «Archivar». Sí tienen Deshacer (5.7).

### 5.3 Temas (solo Plus)

Una fila de botones con los `lista.pagina.temas`, en ese orden, más «Sin tema» que no es un botón (siempre se ve). Prendido: borde y texto azul; apagado: tachado y al 50 %. Cómo arranca cada uno: `prendido` de la config, **salvo** que la persona lo haya cambiado: lo que tocó queda en `temasApagados` del estado (§7) y manda sobre la config. En Normal la fila no se muestra y `temasApagados` no se usa, pero la config sí se aplica: lo que el cliente apagó en config no se ve en Normal, y la línea «N ocultas por tema · ver» sí aparece.

Una noticia oculta por tema no aparece en los renglones ni sube sola al pivote. La línea «N ocultas por tema (Espectáculos, Deportes) · ver» al pie de los renglones nombra los temas apagados que ocultan algo; «ver» muestra las ocultas como renglones (con su pastilla de tema) hasta que se cierre o recargue la página (no se guarda).

### 5.4 Pestañas y avance

Pestañas con su número en una pastilla al lado del nombre: en Plus «Por decidir · Me interesa · Archivo · No por hoy», en Normal «Por decidir · Me interesa · Pasadas». El número de Por decidir **no** cuenta las ocultas por tema ni los avisos; el de Me interesa cuenta noticias y avisos de «Para llevar» (no las llevadas). La pestaña activa se recuerda solo en memoria; al abrir la página siempre arranca en Por decidir.

Avance, solo en Por decidir y solo si hay pivote: «k de N · <nombre del bloque>» donde N es cuántas quedan por decidir (visibles) en el bloque de la abierta y k su posición ahí. A la derecha, N puntos (hasta 10; con más de 10 no se dibujan puntos): los anteriores al pivote verdes, el pivote azul, el resto grises.

### 5.5 Por decidir: el pivote y los renglones

**Qué hay por decidir**: de cada bloque de `lista.orden` salvo `avisos`, en ese orden, primero `noticias` y después `aMano`, en el orden en que vienen en la lista, las tarjetas que **no tienen decisión** (§7) y **no están llevadas** y **no están ocultas por tema**. Las que volvieron de Archivo por la mezcla (§6) van primero de todo, antes del primer bloque, bajo el título «Subieron a confirmada».

**El pivote**: una de esas tarjetas, abierta, en un lugar fijo arriba de los renglones. Reglas:

- Al abrir la página: la primera de Por decidir.
- Al decidir la abierta: la **siguiente** en el orden de Por decidir (la que estaba justo después de la decidida); si la decidida era la última, la primera de todas; si no queda ninguna, no hay pivote.
- Al tocar un renglón: ese pasa a ser el pivote y el anterior vuelve a ser un renglón en su lugar.
- Al actualizar la lista (botón, «Ver» o la lista que entra en Fase B): **el pivote no cambia** mientras la tarjeta siga existiendo en la lista nueva (se reconoce por url compartida); si ya no está, la primera de Por decidir.
- Al cambiar de pestaña y volver: el mismo pivote.

El pivote se dibuja con: la fila de pastillas (sello como hoy con su color por vía; tema en gris; `horaAR(t.hora)` en gris), título (h3), bajada (o «Sin bajada: este medio no la publica en su listado.»), los links (un link por medio, como hoy) y los botones. Si la tarjeta volvió de Archivo por la mezcla, entre la bajada y los links va la línea «↳ Subió a confirmada. A las HH:MM la habías archivado», en gris, corrida a la derecha.

**Los renglones**: por cada bloque con algo por decidir, un título de bloque «<nombre> · N por decidir» y debajo un renglón por tarjeta: pastilla con `t.grupos` (verde si `t.via === 'A'`, naranja si `'mano'`, violeta si `'B'`; cuando la tarjeta viene de `aMano` el texto es `t.grupos + '/' + lista.minGrupos`, por ejemplo «4/5»; cuando viene de `noticias`, solo `t.grupos`; hoy `aMano` solo existe en nacional e internacional, la zona no tiene), el título y un «›». Todo el renglón es un botón (`type="button"`, con `aria-label` que diga el título). El pivote no se repite como renglón.

Si no hay nada por decidir: en lugar de pivote y renglones, una sola línea centrada: «Decidiste las N. Nada nuevo desde las HH:MM» (N = cuántas decisiones hiciste en esta visita y siguen vigentes; si es 0, «Nada por decidir. Nada nuevo desde las HH:MM»; HH:MM = `horaAR(lista.generadaEn)`).

### 5.6 Los botones y los motivos

**Plus**, tres botones en columna, grandes (mínimo 44 px de alto), siempre en el mismo orden: «Me interesa» (verde lleno), «No por hoy…» y «Archivar».

**Normal**, dos botones: «Me interesa» y «Siguiente». «Siguiente» equivale a «No por hoy» sin motivo (`que: 'siguiente'`).

- **Me interesa**: guarda la decisión `{ que: 'interesa' }`; la tarjeta se va a Me interesa; sube el pivote siguiente. En una 4/5 o una 1/2 es exactamente lo mismo (la lista ya la trae con `via: 'mano'` y su etiqueta «… · elegida a mano»).
- **No por hoy…**: los tres botones se reemplazan, adentro de la misma tarjeta, por el texto «No por hoy. ¿Por qué?» y los siete motivos de `lista.pagina.motivos` como chips, en dos columnas en el celular, más «‹ Volver» abajo. Un toque en un motivo guarda `{ que: 'nopor', motivo: <clave> }` y la tarjeta se va a No por hoy. «Otro motivo…» muestra un renglón de texto (una línea, máximo 120 letras) con un botón «Listo»; se guarda `{ que: 'nopor', motivo: 'otro', texto }`; con el renglón vacío, «Listo» no hace nada. «‹ Volver» cierra los chips y vuelven los tres botones, sin decidir.
- **Archivar**: guarda `{ que: 'archivo' }`; la tarjeta se va a Archivo.
- **Siguiente** (Normal): guarda `{ que: 'siguiente' }`; la tarjeta se va a Pasadas.

Toda decisión guarda además `urls` (las de la tarjeta, `urlsDe`), `hora` (ahora, ISO) y `sello` (`t.via`: `'A'`, `'B'`, `'mano'` o `'aviso'`).

### 5.7 Deshacer y Volver

Después de cualquier decisión (las de 5.6 y el «Me interesa» de un aviso) aparece arriba de la barra de abajo, 6 segundos, una franja azul: «Mandada a “No por hoy” · Deshacer» (o «Mandada a “Me interesa” · Deshacer», «Archivada · Deshacer», «Pasada · Deshacer»). «Deshacer» borra esa decisión; la tarjeta vuelve a Por decidir y a ser el pivote. Una decisión nueva reemplaza la franja anterior (solo se puede deshacer la última). A los 6 segundos la franja se va sola.

«Volver» (en Archivo, No por hoy y Pasadas) y «Sacar» (en Me interesa) borran la decisión en cualquier momento: la tarjeta vuelve a Por decidir en su lugar por orden, sin volverse pivote.

### 5.8 Las otras pestañas

**Me interesa**: arriba el título «Para llevar · N» y las tarjetas (noticias y avisos) con decisión `interesa`, **en el orden de `hora` de la decisión, de la más vieja a la más nueva**. Cada tarjeta: sello, título, un botón «Sacar». Si la decisión tiene `subio: true` (§6), debajo del título la línea «↳ Era N de M cuando la elegiste; ahora confirmada» (N y M de la decisión: se guardan `grupos` y `minimo` de la tarjeta al decidir). Debajo, «Llevadas hoy» (si hay): las de `llevadas` que siguen en la lista, apagadas como hoy, con «Te la llevaste a las HH:MM» (en los avisos, «Te lo llevaste a las HH:MM»), sin botones.

**Copiar** (la barra de abajo, en cualquier pestaña): arma el texto con `textoParaCopiar` de hoy (sin cambios: noticia = título, bajada si hay, un renglón `medio: url` por link, línea en blanco entre noticias; aviso = `lineaParaCopiar`), en el orden de «Para llevar», lo copia (con el cuadro manual de hoy si el portapapeles falla), borra las decisiones `interesa` de esas tarjetas y las agrega a `llevadas` con la hora. Mensaje «Copiadas. Ya podés pegarlas.» como hoy. Con 0 en «Para llevar» el botón está apagado.

**Archivo** (Plus): tarjetas cortas con el sello, «archivada HH:MM» en gris, el título y dos botones: «Me interesa» (cambia la decisión a `interesa`, con la hora de ahora) y «Volver». Orden: de la más nueva a la más vieja.

**No por hoy** (Plus) / **Pasadas** (Normal): renglones con el título y, en Plus, una pastilla gris con el texto del motivo (en `otro`: «Otro: <texto>»); si la decisión tiene `subio: true`, el sello de la tarjeta se dibuja con la lista de ahora (verde) y una pastilla verde «Subió a confirmada». Botón «Volver». Orden: de la más nueva a la más vieja.

### 5.9 Actualizar, «hay nuevas» y lo que se cae

- La página pide `lista.json` sola **cada 5 minutos** (`setInterval`). Si `generadaEn` es la misma, nada. Si es otra: guarda la lista nueva aparte (no la aplica) y cuenta cuántas tarjetas de noticia de la lista nueva (a) no tienen decisión ni están llevadas y (b) ninguna de sus urls está en la lista que se está mostrando. Si son 1 o más: franja azul «N nuevas desde las HH:MM · Ver» (HH:MM = `generadaEn` de la lista que se está mostrando). Si son 0, la lista nueva se aplica en silencio (puede traer una bajada nueva o un sello que subió; eso no mueve nada).
- «Ver» y «↻ Actualizar» aplican la lista nueva: se redibuja todo con la regla del pivote de 5.5. «↻ Actualizar» además pide la lista en ese momento.
- `hayNuevas(listaVieja, listaNueva, estado)` es una función pura de `logica.js` que devuelve ese número.
- Cuando una noticia se cae de la lista (24 h), su decisión y sus pastillas desaparecen con ella: `repartir` solo mira tarjetas que están en la lista de ahora. Las decisiones de más de 24 h se borran con `limpiar` al cargar (como hoy las marcas).

## 6. La mezcla: una decidida que después sube a confirmada

Una tarjeta «sube» cuando la lista de ahora la trae con `via: 'A'` y la decisión que le corresponde (por url compartida) tiene `sello: 'mano'`. Se aplica con `aplicarMezcla(lista, estado, ahora)` (pura, en `logica.js`, devuelve un estado nuevo) cada vez que se aplica una lista:

| La decisión era | Qué hace `aplicarMezcla` | Qué ve la persona |
|---|---|---|
| `archivo` | Borra la decisión y agrega a `subidas` un `{ urls, de: 'archivo', hora: <hora de la decisión borrada> }` | La tarjeta vuelve a Por decidir, primera de todas, bajo «Subieron a confirmada», con el sello verde de la lista y la línea «↳ Subió a confirmada. A las HH:MM la habías archivado» mientras no se decida de nuevo |
| `nopor` o `siguiente` | Le pone `subio: true` a la decisión (una sola vez) | Se queda en su pestaña con su motivo; el sello se dibuja verde con la lista de ahora y lleva la pastilla «Subió a confirmada»; Por decidir muestra al pie «N que mandaste a No por hoy subieron a confirmada · ver» («ver» abre esa pestaña). N cuenta las decisiones `nopor`/`siguiente` con `subio: true` cuyas tarjetas siguen en la lista |
| `interesa` | Le pone `subio: true` | Sigue en Me interesa; el sello se dibuja con la lista de ahora (verde) y la línea «↳ Era 4 de 5 cuando la elegiste; ahora confirmada» |
| ya está en `llevadas` | Nada | Nada |

Una entrada de `subidas` dura 24 h como todo, y se borra antes si la persona decide de nuevo esa tarjeta. Una decisión con `sello: 'A'`, `'B'` o `'aviso'` nunca «sube». La pastilla «Recién confirmada» y `vistasConfirmadas` desaparecen del todo.

## 7. El estado: qué se guarda y cómo

Clave nueva en el navegador: `7m-decisiones-v2`. Forma:

```json
{
  "version": 2,
  "decisiones": [
    { "urls": ["https://…", "https://…"], "que": "nopor", "motivo": "opinion", "hora": "2026-10-16T18:40:00.000Z", "sello": "A", "grupos": 5, "minimo": 5 },
    { "urls": ["https://…"], "que": "nopor", "motivo": "otro", "texto": "hay cosas más importantes", "hora": "2026-10-16T18:41:00.000Z", "sello": "A", "grupos": 7, "minimo": 5 },
    { "urls": ["https://…"], "que": "interesa", "hora": "2026-10-16T18:42:00.000Z", "sello": "mano", "grupos": 4, "minimo": 5, "subio": true },
    { "urls": ["https://…"], "que": "archivo", "hora": "2026-10-16T18:43:00.000Z", "sello": "A", "grupos": 6, "minimo": 5 },
    { "urls": ["id:scpl-2903"], "que": "interesa", "hora": "2026-10-16T18:44:00.000Z", "sello": "aviso", "grupos": 1, "minimo": 1 }
  ],
  "llevadas": [ { "urls": ["https://…"], "hora": "2026-10-16T14:20:00.000Z" } ],
  "subidas": [ { "urls": ["https://…"], "de": "archivo", "hora": "2026-10-16T14:20:00.000Z" } ],
  "temasApagados": ["Espectáculos"]
}
```

- `que` es uno de `interesa`, `nopor`, `archivo`, `siguiente`. `motivo` solo con `nopor`; `texto` solo con `motivo: 'otro'`. `grupos` es `t.grupos` al decidir y `minimo` es `lista.minGrupos` (para la línea «Era 4 de 5…»); en un aviso valen 1 y 1.
- Una tarjeta tiene **a lo sumo una** decisión: decidir de nuevo reemplaza la anterior (por url compartida).
- Una tarjeta se reconoce **siempre por una url compartida** (`urlsDe`, con `id:<id>` para lo que no tiene link), nunca por `id`.
- `normalizarEstado` acepta: un estado v2 (lo acomoda campo por campo, tirando lo que no tenga la forma); un estado viejo de `7m-marcas-v1` (se lee **una sola vez** si no hay v2: se conservan solo sus `llevadas`; `vistas` y `vistasConfirmadas` se descartan; después se escribe v2 y la clave v1 se borra); cualquier otra cosa → estado vacío.
- `limpiar(estado, ahora)` saca decisiones, llevadas y subidas de más de 24 h; `temasApagados` no vence.
- El estado se guarda después de cada cambio (decidir, deshacer, volver, sacar, copiar, prender o apagar un tema).

Funciones puras que tiene que exportar `pagina/logica.js` (además de las de hoy que siguen: `haceCuanto`, `horaAR`, `urlsDe`, `textoParaCopiar`, `diaCorto`, `cuandoDeAviso`, `lineaDeAviso`, `lineaParaCopiar`, `etiquetaMedios`, `textoBarra`, `bloquesADibujar`, `tituloBloque`, `avisoBloque`, `textoAfuera`, `cargarEstado`, `guardarEstado`; se borran `estaTildada`, `alternarTilde`, `esNueva`, `marcarVistas`, `nuevasDeLaVisita`, `esNuevaEnVisita`, `esRecienConfirmada`, `recienConfirmadasDeLaVisita`, `pastillaDe`, `repartirBloque`):

- `estadoVacio()`, `normalizarEstado(e)`, `limpiar(estado, ahora)`.
- `decisionDe(t, estado)` → la decisión que comparte url con `t`, o `null`.
- `decidirTarjeta(t, { que, motivo, texto }, estado, ahora)` → estado nuevo (se llama así para no confundirla con `decidir` del núcleo) (reemplaza la decisión anterior si había; borra la entrada de `subidas` de esa tarjeta).
- `borrarDecision(t, estado)` → estado nuevo (sirve para Deshacer, Volver y Sacar).
- `marcarLlevadas(tarjetas, estado, ahora)` → estado nuevo: borra sus decisiones `interesa` y agrega a `llevadas`.
- `llevadaA(t, estado)` como hoy.
- `alternarTema(nombre, estado)` → estado nuevo.
- `temaOculto(t, lista, estado)` → `true` si el tema de `t` está apagado (por `temasApagados`, o por `prendido: false` en `lista.pagina.temas` sin que la persona lo haya prendido; para registrar «la persona lo prendió» `temasApagados` puede llevar una entrada negativa: resolvelo como quieras, pero documentalo en el archivo).
- `aplicarMezcla(lista, estado, ahora)` → estado nuevo (§6).
- `repartir(lista, estado, { verOcultas })` → `{ porDecidir: [ { clave, nombre, tarjetas: [...] } ] (el primer grupo es 'subieron' si hay), meInteresa: [...], llevadas: [ { tarjeta, hora } ], archivo: [...], noPorHoy: [...], ocultas: { total, temas: [...] }, subieronNoPorHoy: N, avisos: [ { tarjeta, estado: 'libre' | 'interesa' | 'llevado', hora } ] }`. `porDecidir` respeta el orden de 5.5; `meInteresa` el de 5.8.
- `pivoteSiguiente(porDecidir, pivoteActual, decidida)` → la tarjeta que corresponde según 5.5 (o `null`).
- `hayNuevas(listaVieja, listaNueva, estado)` → número.
- `textoAvance(porDecidir, pivote)` → `{ texto: '1 de 3 · Comodoro', k, n }` o `null`.
- `textoDeshacer(que)` → el texto de la franja.

`index.html` no decide nada por su cuenta: dibuja lo que devuelve `repartir` y llama a estas funciones.

## 8. Fase B: guardado por persona en `scripts/servir.js`

Dos rutas nuevas, solo con sesión (sin sesión, 401 con el mismo JSON de hoy `{ "error": "sin sesión" }`):

- `GET /decisiones` → 200, `application/json`, el estado guardado de esa persona, o `{"version":2,"decisiones":[],"llevadas":[],"subidas":[],"temasApagados":[]}` si nunca guardó.
- `PUT /decisiones` con cuerpo JSON (tope 256 KB; más grande → 413) → pasa por `normalizarEstado` **en el servidor** (hacé `pagina/logica.js` requerible desde Node: ya lo es) y se escribe entero en `<carpeta>/personas/<nombre>.json`, con `nombre` = el mail normalizado (`U.normalizarMail`) con todo lo que no sea `a-z`, `0-9`, `@`, `.`, `_`, `-` cambiado por `_`. Responde 204. Se escribe primero en un archivo temporal y después se renombra, para no dejar un JSON a medias si se corta la luz.
- La carpeta `personas/` se crea si no existe. Nunca va al repo (está bajo `datos/`, ya ignorada).

La página, al cargar, hace `GET /decisiones`:

- 200 → **modo servidor**: ese es el estado (lo del navegador se ignora); cada guardado es un `PUT` (junta los cambios de 500 ms en uno solo). Si un `PUT` falla (red o 5xx), la página guarda igual en memoria y en `localStorage` como respaldo, muestra la franja ámbar «No pude guardar en tu usuario. Lo reintento solo.» y reintenta con el próximo cambio y al minuto; cuando un `PUT` anda, la franja se va y el respaldo del navegador se borra.
- 401 → `/entrar` (como ya hace con `lista.json`).
- 404 (lo que contesta `scripts/ver.js`, que no conoce la ruta) o cualquier otra cosa, o error de red → **modo navegador**: `localStorage`, como hoy.
- La línea al pie dice en cuál de los dos está (5.1).

`scripts/ver.js` no cambia. `pagina/entrar.html` no cambia. `n8n/` no cambia.

## 9. Lo que se toca y lo que NO

Se tocan: `pagina/index.html`, `pagina/logica.js`, `src/entrega.js`, `src/nucleo.js` (solo sumar `primera` y `secciones` a las salidas de `decidir`), `src/zona.js` (solo sumar `primera` y `secciones`), `config/reglas.json` (sumar `pagina`), `scripts/servir.js` (las dos rutas), `scripts/probar-pagina.js` (se reescribe), `test/logica.test.js` (se reescribe), `test/entrega.test.js`, `test/nucleo.test.js`, `test/zona.test.js`, `test/servir.test.js` (sumar casos), `docs/PAQUETE_DE_CLIENTE.md`, `docs/CORRER_EN_MI_COMPU.md` (si nombra «Traer noticias» o las casillas), `CLAUDE.md`, `buzon/pendientes.md`, `buzon/capturas/`, el paquete.

**No se tocan**: `src/lector.js`, `src/avisos.js`, `src/ia.js`, `src/provisorio.js`, `src/capa4.js`, `scripts/vuelta.js`, `scripts/ver.js`, `scripts/armar-pagina.js` (no se edita; sí se corre `npm run pagina` para regenerar `pagina/lista.json` de ejemplo con los campos nuevos), `n8n/*`, `config/zona/*`, `config/feeds.json`, `config/portales.json`, `pagina/entrar.html`, nada del criterio 1 ni de los moldes. **Nada de «Falta una noticia» ni de «Combinar / Llevar juntas»**: ni el renglón, ni `paresParaUnir` en la página, ni lo descartado en `lista.json`.

## 10. Ejemplos de entrada y salida

Los ejemplos usan tarjetas con una sola url para abreviar; en los tests usá dos o tres urls por tarjeta como vienen en la lista real.

- **E1 · `temaDe`.** `{ seccionIA: '', secciones: ['policiales', 'sociedad', 'policiales'], titulo: 'Detienen a dos hombres…' }` con los temas de §3 → `"Policiales"`. Con `seccionIA: 'economía'` y las mismas secciones → `"Economía"` (la IA manda). Con `secciones: ['opinion', 'ultimas-noticias']` y título «YPF anunció inversiones en Vaca Muerta» y un tema `{ nombre: 'Petróleo', secciones: [], palabras: ['vaca muerta'] }` agregado al final → `"Petróleo"`. Con `secciones: []`, título «Qué dijo el Papa» y sin palabras → `"Sin tema"`.
- **E2 · `lista.pagina`.** `armarEntrega` con `reglas.pagina.escalon = 'normal'` → `lista.pagina.escalon === 'normal'`, `lista.pagina.temas.length === 6`, cada uno solo con `nombre` y `prendido`, `lista.pagina.motivos.length === 7`. Con `reglas` sin `pagina` → `escalon: 'plus'` y los mismos seis y siete por defecto. Cada tarjeta de noticia trae `tema` (texto) y `hora` (ISO válido); las de avisos no traen `tema`.
- **E3 · Orden de Por decidir.** Lista con `orden: ['avisos', 'local', 'nacional', 'internacional']`, `local.noticias = [L1, L2]`, `nacional.noticias = [N1, N2, N3]`, `nacional.aMano = [N4]`, `internacional.noticias = [I1]`; estado vacío → `repartir(...).porDecidir` = `[ { clave: 'local', tarjetas: [L1, L2] }, { clave: 'nacional', tarjetas: [N1, N2, N3, N4] }, { clave: 'internacional', tarjetas: [I1] } ]`; los avisos no están ahí y sí en `avisos` con `estado: 'libre'`. Pivote inicial: `L1`.
- **E4 · Decidir y el pivote siguiente.** Sobre E3, `decidirTarjeta(N2, { que: 'archivo' })` → `pivoteSiguiente` devuelve `N3`. Después `decidirTarjeta(I1, { que: 'interesa' })` (I1 es la última) → el siguiente es `L1`. Si se deciden todas, `pivoteSiguiente` → `null` y la página muestra «Decidiste las 7. Nada nuevo desde las 15:10».
- **E5 · No por hoy con «otro».** `decidirTarjeta(N1, { que: 'nopor', motivo: 'otro', texto: 'hay cosas más importantes' })` → `decisionDe(N1)` tiene `motivo: 'otro'`, `texto: 'hay cosas más importantes'`, `sello: 'A'`, `grupos: N1.grupos`; `repartir(...).noPorHoy[0]` es N1 y el número de la pestaña «No por hoy» es 1; Por decidir baja de 7 a 6.
- **E6 · Deshacer y Volver.** Después de E5, `borrarDecision(N1)` → `decisionDe(N1) === null`, N1 vuelve a `porDecidir` en su lugar: primero de `nacional`, antes de N2. En la página: Deshacer dentro de los 6 segundos lo vuelve pivote; «Volver» desde la pestaña lo deja como renglón, con el pivote que estaba.
- **E7 · Copiar.** Con decisiones `interesa` sobre N3 (hora 18:40), un aviso A1 (18:41) y L2 (18:42), `repartir(...).meInteresa` = `[N3, A1, L2]` (por hora de decisión); `textoParaCopiar([N3, A1, L2])` da N3 con título, bajada y sus links, una línea en blanco, la línea del aviso, una línea en blanco, L2. Después de copiar: las tres están en `llevadas` con la misma hora, `meInteresa` queda `[]`, «Llevadas hoy» las muestra apagadas y el aviso dice «Te lo llevaste · HH:MM» en su franja.
- **E8 · Temas.** Lista donde N2 tiene `tema: 'Espectáculos'` y N4 `tema: 'Sin tema'`; `alternarTema('Espectáculos', estado)` → `temasApagados: ['Espectáculos']`; `repartir` no trae a N2 en `porDecidir`, `ocultas = { total: 1, temas: ['Espectáculos'] }`, N4 sí está (Sin tema siempre se ve); con `{ verOcultas: true }` N2 vuelve a aparecer como renglón. El número de Por decidir baja en 1. En una lista con `pagina.escalon: 'normal'` la fila de temas no se dibuja, pero si la config trae `{ nombre: 'Espectáculos', prendido: false }` N2 tampoco aparece y la línea «1 oculta por tema (Espectáculos) · ver» sí.
- **E9 · La mezcla desde Archivo.** Estado con `{ urls: [u], que: 'archivo', sello: 'mano', hora: '…14:20' }`; llega una lista donde la tarjeta con url `u` está en `nacional.noticias` con `via: 'A'` → `aplicarMezcla` devuelve un estado sin esa decisión y con `subidas: [{ urls: [u], de: 'archivo', hora: '…14:20' }]`; `repartir(...).porDecidir[0]` es `{ clave: 'subieron', tarjetas: [esa] }`; el pivote (si no había otro abierto) es esa tarjeta y muestra «↳ Subió a confirmada. A las 14:20 la habías archivado». Si la persona la decide, la entrada de `subidas` se borra.
- **E10 · La mezcla desde No por hoy y desde Me interesa.** Dos decisiones con `sello: 'mano'`: una `nopor` (motivo `vieja`) y una `interesa` (`grupos: 4, minimo: 5`); llega la lista con las dos en `noticias` con `via: 'A'` → las dos quedan con `subio: true`; `repartir(...).subieronNoPorHoy === 1`; en Me interesa la segunda muestra «↳ Era 4 de 5 cuando la elegiste; ahora confirmada»; en No por hoy la primera lleva la pastilla «Subió a confirmada». Una tercera decisión con `sello: 'A'` sobre una tarjeta que sigue `via: 'A'` no cambia.
- **E11 · Hay nuevas.** Lista vieja con N1, N2, N3; lista nueva (otra `generadaEn`) con N1, N2, N3, N5, N6, donde N5 comparte una url con N1 (es la misma con una nota más) y N6 es nueva; estado con N3 decidida → `hayNuevas(vieja, nueva, estado) === 1` (solo N6). Con la lista nueva igual a la vieja salvo la bajada de N2 → `0` y la página la aplica en silencio.
- **E12 · El pivote no se mueve al actualizar.** Pivote N2; llega una lista nueva con N0 (más medios) antes de N2 → después de «Ver», el pivote sigue siendo N2, N0 es el primer renglón de `nacional`, y el avance pasa de «2 de 3» a «3 de 4». Si la lista nueva ya no trae N2 → el pivote es el primero de `porDecidir`.
- **E13 · Estado viejo.** `normalizarEstado` sobre un v1 `{ vistas: {…}, llevadas: [{ urls: [u], hora }], vistasConfirmadas: {…} }` → `{ version: 2, decisiones: [], llevadas: [{ urls: [u], hora }], subidas: [], temasApagados: [] }`. Sobre `null`, `"basura"` o `{ decisiones: 'x' }` → estado vacío. Sobre un v2 con una decisión sin `que` → esa decisión se descarta y las demás quedan.
- **E14 · Fase B.** En `test/servir.test.js`: `GET /decisiones` sin cookie → 401; con sesión y sin archivo → 200 con el estado vacío de §8; `PUT` con el estado de §7 → 204 y existe `<carpeta>/personas/<nombre>.json` con ese contenido normalizado; un `PUT` con `"decisiones": "x"` → 204 y el archivo guarda `decisiones: []` (lo normalizó); un `PUT` de 300 KB → 413; el mail `Ana.Pérez+7m@canal2.com` da el nombre `ana.p_rez_7m@canal2.com.json` (porque `normalizarMail` lo pasa a minúsculas antes; si tu `normalizarMail` conserva la tilde, cambiala por `_` igual).
- **E15 · Avisos.** Un aviso A1 en `lista.bloques.avisos.noticias`; `decidirTarjeta(A1, { que: 'interesa' })` → `sello: 'aviso'`, `grupos: 1`, `minimo: 1`; `repartir(...).avisos[0].estado === 'interesa'`; A1 nunca está en `porDecidir`; después de copiar, `estado === 'llevado'` con su `hora`.

## 11. Pasos, en orden

1. **Medir las secciones reales antes de tocar nada.** Con lo que hay en `datos/notas.json` y `datos/zona/notas.json` de tu entorno (las 1.540 nacionales y 336 de la zona del reporte `e`, o lo que haya hoy): contá cuántas notas hay por `seccion` distinta (normalizada) y ajustá las `secciones` de los seis temas de §3 para cubrir las más frecuentes; lo que no encaje en ningún tema queda «Sin tema». Reportá la tabla sección → cantidad → tema (las 25 secciones más frecuentes al menos) y **qué porcentaje de notas queda con tema y cuál «Sin tema»**, para lo nacional y para la zona por separado. No inventes secciones que no estén en los datos.
2. `config/reglas.json`: sumar `pagina` (§3) con las secciones del paso 1. `src/nucleo.js` y `src/zona.js`: sumar `primera` y `secciones` a las salidas. `src/entrega.js`: `temaDe`, `tema`, `hora`, `lista.pagina`. Tests nuevos en `test/entrega.test.js`, `test/nucleo.test.js` y `test/zona.test.js` (E1, E2, y que lo de hoy no cambie de valor). `npm run pagina` para regenerar `pagina/lista.json` de ejemplo con los campos nuevos. Commit.
3. `pagina/logica.js` nuevo, con las funciones de §7, y `test/logica.test.js` reescrito con E3 a E13 (un `test` por ejemplo, con los números de ejemplo en el nombre). Commit.
4. `pagina/index.html` nuevo según §5 y §6, en modo navegador (sin Fase B todavía): probalo a mano con `npm run ver` sobre una carpeta con una lista real de tu entorno (`npm run vuelta -- --zona config/zona` una vez, si hace falta) y con `pagina/lista.json` de ejemplo. Commit.
5. `scripts/probar-pagina.js` reescrito: las mismas tres capturas (`390`, `1200`, `390-oscuro`) más una cuarta **`normal-390`** (la misma lista con `pagina.escalon: 'normal'`, forzado en la copia que usa el script), con nombre `pagina-c-<nombre>-<sufijo>.png`, y las comprobaciones de la lista de §12. La opción `--solo-capturas` sigue igual. Correrlo; las capturas van a `buzon/capturas/` con nombre `pagina-c-2026-10-17`. Commit.
6. Fase B: `scripts/servir.js` (§8), `test/servir.test.js` (E14), y la parte de `index.html` que elige modo. Probar a mano con `npm run servir` y un usuario de prueba (`scripts/usuario.js`), decidir tres cosas, recargar y ver que siguen; cerrar sesión, entrar con otro usuario y ver que no las ve. Commit.
7. `docs/PAQUETE_DE_CLIENTE.md`, `docs/CORRER_EN_MI_COMPU.md` (si nombra lo viejo), `CLAUDE.md` (estado: la página C hecha; qué desaparece; dónde vive la config), `buzon/pendientes.md` (la sección de esta carta y lo resuelto), el reporte `ClaudeCode_para_Cowork_2026-10-17_a.md` y el paquete (`npm run paquete`). Commit y push.

Si en el paso 1 ves que **menos del 60 %** de las notas nacionales queda con tema con las secciones reales, seguí igual (el valor por defecto es «Sin tema» y se muestra siempre) y decilo arriba de todo en el reporte: esa decisión es de Alejo (sumar palabras clave o esperar a la IA).

## 12. Qué comprobar y qué medir (para el reporte)

`npm test`: decí cuántos pasan antes (hoy 371 + 1 pendiente) y después, cuántos nuevos y cuántos borrados (los de `estaTildada`, `pastillaDe`, etc. se van).

`npm run probar-pagina`: decí el total nuevo de comprobaciones. Tiene que cubrir, como mínimo, con la lista de ejemplo y un estado armado por el script:

1. El encabezado dice «última vuelta HH:MM» y el botón «↻ Actualizar».
2. Hay un pivote y es la primera de Por decidir; el avance dice «1 de N · <bloque>».
3. Las pestañas dicen Por decidir · Me interesa · Archivo · No por hoy con los números correctos (y en la copia `normal`, Por decidir · Me interesa · Pasadas, con dos botones).
4. Tocar «Me interesa» en el pivote: baja Por decidir en 1, sube Me interesa en 1, sube el siguiente, aparece la franja «Mandada a “Me interesa” · Deshacer».
5. Tocar «Deshacer» antes de 6 segundos deshace (números vuelven, el pivote vuelve a ser la misma).
6. Tocar «No por hoy…»: aparecen los siete chips con los textos exactos de §3; tocar «Opinión o reacción a otra» la manda a No por hoy con esa pastilla; «Otro motivo…» muestra el renglón y «Listo» con texto la manda con «Otro: …»; «‹ Volver» cierra sin decidir.
7. «Archivar» la manda a Archivo con «archivada HH:MM»; desde Archivo «Me interesa» la pasa a Me interesa y «Volver» a Por decidir.
8. Tocar un renglón lo sube al pivote.
9. Apagar «Espectáculos» oculta las de ese tema y muestra «N ocultas por tema (Espectáculos) · ver»; «ver» las muestra; «Sin tema» siempre se ve.
10. Me interesa muestra «Para llevar · N» en orden de decisión; «Copiar las N» copia (el texto empieza por el título de la primera elegida), las pasa a «Llevadas hoy» y deja «Para llevar» vacío; el botón queda apagado.
11. El aviso tiene «Me interesa» en su franja; tocado dice «En Me interesa»; nunca aparece en Por decidir.
12. La mezcla, E9 y E10, con un estado previo armado por el script y una lista modificada en la copia.
13. Con un estado v1 guardado en `7m-marcas-v1`, al abrir queda v2 con sus llevadas y la clave v1 ya no existe.
14. La línea al pie dice «Tus decisiones se guardan en este navegador» (en `npm run ver`).
15. Al recargar la página, el pivote vuelve a ser la primera de Por decidir y todas las decisiones siguen (números de pestañas iguales).
16. La captura `1200` no tiene scroll horizontal; en `390` ningún botón de la abierta mide menos de 44 px de alto.

Medí también: **cuánto tarda `repartir`** con una lista de 60 tarjetas y un estado de 200 decisiones (tiene que ser menos de 50 ms en Node); y **cuánto pesa** el estado de §7 con 200 decisiones (en KB).

## 13. Qué podés decidir por tu cuenta y qué no

Por tu cuenta: nombres de clases CSS, cómo partís `index.html` por dentro, el `aria-label` exacto de cada botón, cómo guardás «la persona lo prendió» en `temasApagados`, si los chips van en `<button>` o en `<label>`, cómo haces debounce del `PUT`, y cualquier detalle que no cambie lo que la persona ve ni lo que se guarda. Anotalo en «Qué decidí por mi cuenta» del reporte.

No por tu cuenta: ningún texto que ve la persona (los de esta carta son exactos, con sus comillas « » y su «…»), el orden de nada, los 6 segundos, los 5 minutos, los siete motivos, las claves y la forma del estado, las rutas y códigos de Fase B, ni sumar nada de la carta C. Si algo de la carta se puede entender de dos maneras, elegí la que menos cambie lo que ya anda, hacelo, y ponelo arriba de todo en el reporte con las dos lecturas.

## 14. Qué tiene que volver

`ClaudeCode_para_Cowork_2026-10-17_a.md` con: veredicto; la tabla del paso 1 (secciones → tema, porcentajes); los commits por paso; `npm test` antes/después; el total de `npm run probar-pagina` y la lista de las 16 comprobaciones de §12 con «pasa» al lado; las cuatro capturas; los tiempos y pesos de §12; qué decidiste por tu cuenta; qué viste y no tocaste (para Cowork); y si quedó algo para Alejo.

## 15. Para pegar arriba de todo en `buzon/pendientes.md` (tal cual, en el paso 7)

### Cowork → pendientes · 17-10-2026 · 00:25 · la página C (carta `Cowork_para_ClaudeCode_2026-10-17_a.md`)

Carta de la página C, Fases A (la página) y B (guardado por persona). Alejo la revisó paso a paso la noche del 16-10 sobre el dibujo «7M · Página C final» (artifact privado https://claude.ai/artifact/JbSrztzZDxHhUUpdmMUh8G).

**Decidió Alejo (16-10, 22:50 a 00:20):**

| Qué | Decidió | Porqué (en sus palabras o la analogía que aceptó) |
|---|---|---|
| Qué entra en esta carta | A+B ahora; C («Falta una noticia» y «Combinar») aparte, «hasta que esté comprobado al 100 % que funciona y no contamina nada» | «La bici primero, después el canasto»; quiere hacerlo una sola vez y bien |
| Avisos de cortes en la página nueva | Franja propia arriba, siempre visible, un solo botón «Me interesa» (opción A) | Un corte no se «decide»: alerta; mandarlo a «No por hoy con motivo» no tiene sentido |
| La pinta (colores, bordes) | No en esta carta; carta chica aparte cuando pase su galería | «Es elegir la pintura después de levantar la pared» |
| Los siete motivos de «No por hoy» | Con palabras que se entiendan la primera vez: *Es un dato, no una noticia · Ya la tengo · Opinión o reacción a otra · Está en el bloque equivocado · Ya pasó, llegó tarde · No va con nuestro público · Otro motivo…* | «Si entro por primera vez, “Vieja” y “No es noticia” me parecen el mismo chip» |
| Orden de «Para llevar» y de lo copiado | El orden en que fue eligiendo | Es lo que después pega en ese orden |
| Temas | Por cliente en `config/` (seis de arranque, tope 10, palabras clave opcionales para que un cliente cree el suyo) | Quiere que la persona pueda crear temas propios; crearlos desde la página queda para cuando las decisiones vivan por persona |

**Valores por defecto de Cowork (se cambian):** Canal 2 arranca en Plus; el tema sale de la sección del portal (la IA manda cuando conteste); «Sin tema» se muestra siempre; dentro de cada bloque primero las confirmadas y después las «le falta 1»; el pivote no se mueve al actualizar; la página mira cada 5 minutos y avisa «N nuevas · Ver» sin redibujar; Deshacer 6 segundos; servidor si hay login y navegador si no, un archivo por persona en `<datos>/personas/`; todo por link.

**Abierto (nuevo, de Alejo, sin apuro):**

- **Nombre del producto:** Alejo quiere cambiarlo por algo más original alrededor de la luz que entra chica y sale alumbrando grande (linterna, cono, anillos). Candidatos de Cowork del 14-10: FOCO, HAZ, VÉRTICE; se charla el 17-10. Mientras tanto «7M», y ya es una línea de config (`pagina.nombre`).
- **Nombre de los escalones:** «Plus» suena a pago extra. Candidatos de Cowork: «Rápida / Completa», «Simple / A fondo». En la página no aparece el nombre; no frena nada.
- **Temas creados por la persona desde la página** (botón «+ tema»): después de la Fase B.
- **Pestañas más prácticas:** las pestañas chicas («Por decidir», etc.) buscarles una forma mejor, inspirada en las páginas más visitadas; va con la carta de la pinta.
- **Tour con globitos** que flotan y se desvanecen al toque, para quien entra por primera vez, y **diapositivas comerciales** (qué hace cada cosa, qué da cada escalón, con parla de venta y sin lo técnico; para su tío o una empresa). Lo pidió el 16-10; se hace cuando la página C esté andando. Es la misma idea del «un solo artifact con todo para mostrar a clientes» del 14-10.
- **Servidor de Don Julio:** el 16-10 avisó por WhatsApp que ya tiene todo listo y está con la seguridad, para que la compu de Alejo entre por SSH y a la web de n8n; «hoy o mañana termino». Cuando mande los datos, es la tanda de instalar (Fase B de la carta del 15-10, `docs/INSTALAR_EN_EL_SERVIDOR.md`). Se puede instalar antes de que termine la página C: la página nueva llega después con un `git pull`.

**Qué viene después:** 1) Claude Code hace esta carta y reporta. 2) Alejo prueba la página nueva en su compu con `npm run ver`. 3) La tanda de instalar en lo de Don Julio, cuando mande los datos. 4) La carta C. 5) La carta de la pinta.
