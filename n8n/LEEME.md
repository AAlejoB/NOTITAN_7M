# n8n · los workflows de 7M

Cuatro archivos para importar en el n8n del servidor (en n8n: menú **⋯** del workflow → **Import from File**, o `n8n import:workflow --input=<archivo>`). El código no vive acá: los nodos «Code» leen `config/` y `src/capa4.js` desde la carpeta del repo en el disco. La guía completa, paso por paso, es `docs/INSTALAR_EN_EL_SERVIDOR.md`.

| Archivo | Nombre en n8n | Qué hace | Se activa |
|---|---|---|---|
| `vuelta.json` | 7M · vuelta cada 30 minutos | Baja los 19 feeds, junta las notas de 48 h, le pregunta a la IA por los hechos sin juicio, decide, escribe `lista.json` y anota la vuelta. Si ningún portal contesta o la IA no contesta, manda un mail (como mucho uno por hora). | Sí |
| `correo.json` | 7M · correo | Recibe del login (`scripts/servir.js`) el pedido de «olvidé mi clave» y manda el mail. | Sí |
| `error.json` | 7M · si la vuelta se rompe | Si la vuelta explota (un nodo falla del todo), manda un mail con el error. Sin tope. | No hace falta: se elige como «Error Workflow» de la vuelta |
| `prueba-union.json` | 7M · prueba de la unión (3 veces) | Le hace a la IA cada caso de unión de `test/casos-ia.json` que no es «dudoso», 3 veces. Al final dice «pasa» o «no pasa». | No: se ejecuta a mano |

## Lo que hay que editar después de importar

| Dónde | Qué |
|---|---|
| Nodo **Rutas** de la vuelta, del error y de la prueba | `carpetaRepo` (la carpeta del repo vista desde n8n; con Docker, `/home/node/7m`) y, en la vuelta, `carpetaDatos` (`/home/node/7m-datos`). En la vuelta y en el error también `correoAvisos` (los mails de Alejo y Don Julio, separados por coma) y `correoDesde` (la casilla de 7M). |
| Nodo **Mandar** del correo | «From Email»: la casilla de 7M. |
| Nodos **IA**, **Avisar**, **Mandar** y **Webhook** | Elegir la credencial: `7M Anthropic` (IA), `7M Correo` (Avisar y Mandar), `7M Webhook` (Webhook). Los archivos traen solo el nombre, nunca la clave. |
| Settings de la vuelta | «Error Workflow» → «7M · si la vuelta se rompe». |

## Lo que conviene saber

- **Los datos estáticos solo se guardan en las vueltas disparadas por el reloj** («Cada 30 minutos»), no al apretar «Execute workflow» en el editor. Ahí viven las notas acumuladas, los juicios de la IA y la hora del último aviso. Para probar: activar la vuelta y esperar el disparo, o poner el reloj en 1 minuto un rato y después volverlo a 30.
- Un cambio en `config/` (después de `git pull`) vale desde la vuelta siguiente: los nodos leen esos archivos del disco cada vez. Un cambio en `src/` vale **después de reiniciar n8n** (el código queda en memoria).
- Los nodos «Code» necesitan `NODE_FUNCTION_ALLOW_EXTERNAL=*` y `NODE_FUNCTION_ALLOW_BUILTIN=*` en el contenedor (o el proceso) de n8n. Sin eso, Feeds falla con un error de `require`.
- Nodo **Bajar**: «Never Error» prendido (un 404 llega como `statusCode` y se cuenta como feed caído) y «On Error: Continue» (un feed que no contesta no corta la vuelta).
- Nodo **IA**: de a 5 preguntas por segundo («Batching»), para no pasar el límite de pedidos por minuto de la cuenta. Si una falla, sigue: ese hecho sale con el bloque provisorio y la página lo dice.
- Probado el 15-10-2026 con n8n 2.43.6 instalado con npm (Node 24) y la IA falsa (`scripts/ia-falsa.js`): dos vueltas seguidas disparadas por el reloj, 19 feeds bien, 5 preguntas en la primera y 0 en la segunda.

## Versiones de los nodos

| Nodo | Tipo | typeVersion |
|---|---|---|
| Cada 30 minutos | Schedule Trigger | 1.4 |
| Rutas | Edit Fields (Set) | 3.5 |
| Feeds, Preparar, Decidir, Casos, Resultado | Code | 2 |
| Bajar, IA | HTTP Request | 4.5 |
| ¿Hay preguntas?, ¿Avisar? | If | 2.3 |
| Avisar, Mandar | Send Email | 2.1 |
| Webhook | Webhook | 2.2 |
| Contestar | Respond to Webhook | 1.5 |
| Si se rompe | Error Trigger | 1 |
| Probar | Manual Trigger | 1 |
