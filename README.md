# NOTITAN_7M

Al apretar un botón: las 7 noticias NACIONALES de Argentina + las 7 INTERNACIONALES, cada una verificada en al menos 5 portales, filtradas por las reglas de "entra o no" para facilitarle la tarea a quien publica.

## Estado

Se construye **de adentro hacia afuera**. Hecho: el núcleo (reglas) y el motor (agrupar y ordenar), con tests.
Hecho a medias: leer los portales (ya están probados los feeds, falta el lector). Falta la IA que juzga, el botón y la entrega.

```
5 · Botón y entrega            (falta)
4 · Orquestación               (falta)  ← pensado para n8n
3 · Leer los portales          (feeds probados en config/feeds.json; falta src/lector.js)
2 · Motor: agrupar y ordenar   ✔ src/nucleo.js
1 · Núcleo: las reglas         ✔ config/reglas.json + src/nucleo.js
```

## Cómo se prueba

```
npm test       # 44 tests + 1 pendiente a propósito (sinónimos)
npm run feeds  # prueba por internet cada feed de config/feeds.json
npm run demo   # corre un día inventado y dibuja el embudo
```

Requiere Node 20 o más. No tiene dependencias.

## Cómo funciona

Dos pasos, porque en el medio va una IA para lo que no se puede medir con un conteo:

1. `preparar(notas, ctx)` saca lo barato (opinión, servicio, notas viejas), junta las notas que cuentan **el mismo hecho** y cuenta en cuántos **grupos de medios** salió. Clarín + TN + Olé valen 1. Un cable copiado de agencia vale 1. Con menos de 5 grupos va a *En observación*. Hay una **segunda línea (vía B)**: si un hecho no llega a 5 grupos pero lo firman al menos 2 autores distintos de `config/firmas.json`, también pasa a candidato. Sale con otra etiqueta ("Respaldada por …" en vez de "Confirmada por N medios") y va después de todo lo confirmado por la vía A.
2. `decidir(candidatos, juicios, ctx)` recibe el juicio de la IA por cada hecho (¿hay fuente con nombre?, ¿es de interés público?, ¿a qué bloque va?, ¿impacto de 0 a 3?, ¿está desmentido?) y arma las dos listas. Todo lo que queda afuera lleva su motivo.

El 7 es un tope, no una cuota: si pasan menos, se entregan menos y se avisa.

## Dónde se cambian las reglas

- `config/reglas.json`: los números (5 grupos, 24 h, cupo de 7, tope de 3 por sección y 2 por país) y los filtros de nota informativa. Las expresiones de `titulosExcluidos` se aplican sobre el título en minúsculas y sin tildes.
- `config/firmas.json`: los autores reconocidos de la vía B. **La arma Alejo; hoy está vacía y la vía B no hace nada.** Cada uno puede valer para nacional, internacional o los dos. El mínimo (`minFirmas`, hoy 2) y el interruptor están en `viaB` de `config/reglas.json`.
- `config/portales.json`: la lista blanca. **Hoy es provisoria**: los feeds ya se probaron (`config/feeds.json`), pero qué medios entran lo decide Alejo.

Los 8 criterios, con ejemplos, están en la página de borrador. Los valores actuales son la propuesta por defecto, no una decisión tomada.

## En n8n

`src/nucleo.js` está escrito para pegarse en un Code node (se borra la última línea, `module.exports`). El código vive acá, con tests; n8n solo lo ejecuta. El flujo se exporta a este repo en cada cambio.

## Límites conocidos

- **Sinónimos e idiomas**: "Suben las naftas" y "YPF aumentó los combustibles" no se juntan. Hace falta una IA o embeddings que confirmen los grupos dudosos. Hay un test marcado como pendiente.
- **Cifras en disputa**: dos notas con cifras distintas se juntan, pero todavía no se marca el aviso.
- **El umbral de similitud (0,5)** se calibró con un día inventado. Hay que ajustarlo con noticias reales.
- Todo el conteo por portal depende de que la lista blanca esté bien armada.
