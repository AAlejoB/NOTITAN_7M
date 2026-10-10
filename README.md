# NOTITAN_7M

Al apretar un botón: las 7 noticias NACIONALES de Argentina + las 7 INTERNACIONALES, cada una verificada en al menos 5 portales, filtradas por las reglas de "entra o no" para facilitarle la tarea a quien publica.

## Estado

Se construye **de adentro hacia afuera**. Hecho: el núcleo (reglas) y el motor (agrupar y ordenar), con tests.
Hecho: leer los portales (feeds probados y lector), juntar lo leído en un archivo (`--acumular`), la página de entrega (sobre un día inventado) y las piezas que van alrededor de la IA (sin llamar a ningún modelo). Falta cuándo leer y dónde guardar (capa 4, con Don Julio), llamar a la IA y que la página muestre noticias reales.

```
5 · Botón y entrega            ✔ pagina/ (sobre el día de ejemplo; falta darle noticias reales)
4 · Orquestación               (falta)  ← pensado para n8n; la IA todavía no se llama (src/ia.js tiene las piezas)
3 · Leer los portales          ✔ src/lector.js + config/feeds.json (falta cuándo leer y dónde guardar)
2 · Motor: agrupar y ordenar   ✔ src/nucleo.js
1 · Núcleo: las reglas         ✔ config/reglas.json + src/nucleo.js
```

## Cómo se prueba

```
npm test       # 231 tests + 1 pendiente a propósito (sinónimos)
npm run feeds  # prueba por internet cada feed de config/feeds.json
npm run leer    # lee los 19 feeds y dibuja el embudo con datos reales (sin la IA)
               #   --json notas.json    guarda las notas leídas
               #   --umbral 0.3         prueba otro umbral de similitud, sin tocar config/
               #   --acumular datos/notas.json   guarda lo leído y verifica sobre las últimas 48 h juntadas (datos/ no se sube al repo)
               #   --sin-leer           con --acumular: no lee los feeds, usa lo que ya está en el archivo
               #   --sin-excluir-rutas  con --sin-leer: no saca de lo guardado las rutas que cada feed excluye (Infobae: /espana/, /peru/, /mexico/, /colombia/; para el "antes" de una medición)
               #   --min-comunes 0      prueba otro mínimo de palabras en común del agrupador (0 = el umbral solo)
               #   --detalle            lista cada hecho con 3 o más grupos y las notas que sacó una regla de título del criterio 1
               #   --sin-notas-de-servicio   para esa corrida, el criterio 1 no usa los moldes de notas de servicio (para medir antes y después)
npm run demo   # corre un día inventado y dibuja el embudo
npm run pagina # arma pagina/lista.json con el día inventado; la página es pagina/index.html (servir la carpeta pagina/ con cualquier servidor estático)
npm run vuelta # una vuelta completa sin IA: lee los feeds, acumula, arma la lista real en datos/pagina/ y anota la vuelta en datos/vueltas.jsonl
               #   --cada 30            repite cada 30 minutos (Ctrl+C corta)
               #   --sin-leer           rehace la lista con lo ya guardado, sin salir a internet
               #   --carpeta datos      dónde vive todo lo real (no se sube al repo)
npm run medir  # resume datos/vueltas.jsonl por día y por corte de 4 horas: confirmadas y 4/5, por bloque (--dia AAAA-MM-DD)
npm run ver    # sirve datos/pagina/ en http://127.0.0.1:7000/ para ver la lista real en esa compu; --carpeta y --puerto
npm run paquete # rearma buzon/paquetes/PEGAR_COWORK.md
```

Requiere Node 20 o más. No tiene dependencias.
Para correr el día de medición en una compu con Windows: [`docs/CORRER_EN_MI_COMPU.md`](docs/CORRER_EN_MI_COMPU.md).

## Cómo funciona

Dos pasos, porque en el medio va una IA para lo que no se puede medir con un conteo:

1. `preparar(notas, ctx)` saca lo barato (opinión, servicio, notas viejas), junta las notas que cuentan **el mismo hecho** y cuenta en cuántos **grupos de medios** salió. Clarín + TN + Olé valen 1. Un cable copiado de agencia vale 1. Con menos de 5 grupos va a *En observación*. Hay una **segunda línea (vía B)**: si un hecho no llega a 5 grupos pero lo firma al menos 1 autor de `config/firmas.json`, también pasa a candidato. Sale con otra etiqueta ("Respaldada por …" en vez de "Confirmada por N medios") y va después de todo lo confirmado por la vía A. Nombra hasta 2 autores.
2. `decidir(candidatos, juicios, ctx)` recibe el juicio de la IA por cada hecho (¿hay fuente con nombre?, ¿es de interés público?, ¿a qué bloque va?, ¿está desmentido?) y arma las dos listas. Dentro de cada bloque va primero lo que más medios publicaron y, si empatan, lo más nuevo; cada noticia trae la bajada del medio. Todo lo que queda afuera lleva su motivo. Devuelve también `aMano` (ver abajo).

**La página.** `src/entrega.js` toma lo que devuelve `decidir` y arma lo que muestra `pagina/index.html`: un botón «Traer noticias», las noticias de cada bloque para tildar y copiar, las 4/5 abiertas debajo con «Llevármela igual», «Nueva» en lo que no se vio y «Te la llevaste» en lo que ya se copió (cada persona lo ve en su navegador, 24 h). Hoy se arma con el día de ejemplo y lo dice arriba.

**La IA (todavía no se llama).** `src/ia.js` tiene las piezas: qué pares de hechos se le preguntan («¿son la misma noticia?»: el mismo hecho, la misma gente, lo mismo que pasó, el mismo día), cómo se unen, el texto exacto de las preguntas de unión y de juicio, cómo se lee lo que contesta, qué posibles desmentidos se le muestran y cómo se reconoce lo ya juzgado. La llamada al modelo la arma Don Julio en n8n.

**Excepción a mano.** A un hecho al que le falta 1 medio (4 de 5) y no tiene firma, `preparar` lo marca en `elegiblesAMano`. La IA lo juzga igual que a un candidato y `decidir` (con `elegiblesAMano` en el contexto) lo devuelve en `aMano`, por bloque, con la etiqueta "Confirmada por 4 medios · elegida a mano". Es un menú para que la persona elija: nunca entra solo a las listas ni completa el mínimo, y no tiene cupo ni topes.

La cantidad de noticias por bloque se elige entre 3 y 7 (`cupo`; sin elegir, 7). Es un tope, no una cuota: si pasan menos, se entregan menos y se avisa; nunca se baja el estándar para completar.

## Dónde se cambian las reglas

- `config/reglas.json`: los números (5 grupos, 24 h, cupo de 3 a 7, tope de 3 por sección y 2 por país, la vía B, `aMano`: `activa` y `faltanMedios` (hoy 1), y `ia`: deportes sí y farándula no, las palabras de desmentido y cuántos desmentidos se muestran) y los filtros de nota informativa. Las expresiones de `titulosExcluidos` y los moldes de `notasDeServicio` (horario de partido, efemérides, resultados de lotería) se aplican sobre el título en minúsculas y sin tildes.
- `config/firmas.json`: los autores reconocidos de la vía B. **La arma Alejo; hoy está vacía y la vía B no hace nada.** Cada uno puede valer para nacional, internacional o los dos. El mínimo (`minFirmas`, hoy 1), cuántos nombres se muestran (`maxFirmasEnEtiqueta`, hoy 2) y el interruptor están en `viaB` de `config/reglas.json`. Se puede agregar un tope de noticias de segunda página con `maxNoticiasPorBloque`.
- `config/portales.json`: la lista blanca. **Hoy es provisoria**: los feeds ya se probaron (`config/feeds.json`), pero qué medios entran lo decide Alejo.

Los 8 criterios, con ejemplos, están en la página de borrador. Los valores actuales son la propuesta por defecto, no una decisión tomada.

## En n8n

`src/nucleo.js` está escrito para pegarse en un Code node (se borra la última línea, `module.exports`). El código vive acá, con tests; n8n solo lo ejecuta. El flujo se exporta a este repo en cada cambio.

## Límites conocidos

- **Sinónimos e idiomas**: "Suben las naftas" y "YPF aumentó los combustibles" no se juntan. Hace falta una IA o embeddings que confirmen los grupos dudosos. Hay un test marcado como pendiente.
- **Cifras en disputa**: dos notas con cifras distintas se juntan, pero todavía no se marca el aviso.
- **El umbral de similitud (0,3)** ya se midió con noticias reales (1.277 notas acumuladas): con 0,5 no se verificaba nada y con 0,3 se verifican 2 hechos, sin uniones falsas entre los de 5 o más grupos. Todavía hay hechos partidos (la misma carrera sale en dos) y falta ajustarlo con más días.
- Todo el conteo por portal depende de que la lista blanca esté bien armada.
