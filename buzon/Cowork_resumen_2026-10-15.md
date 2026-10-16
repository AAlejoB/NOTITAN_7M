# Cowork · resumen del 15-10-2026 (chat de la madrugada; reabierto el 16-10 a las 04:55 para charlar)

Para el próximo chat de Cowork. La memoria es el repo (`buzon/pendientes.md`, `CLAUDE.md`); esto es la foto de qué quedó dónde. **Lo de la sección «Charla del 16-10» todavía no está en el repo: el próximo chat lo pasa a `pendientes.md` por la carta que escriba.**

## Qué hizo este chat

- Escribió `buzon/Cowork_para_ClaudeCode_2026-10-15_a.md` (00:27): sitemaps en el lector, `--config` en la vuelta, el bloque local de prueba `config/comodoro/` (ADNSUR, El Comodorense, Crónica ×4, El Patagónico, El Chubut; 2 medios para confirmar, sin 1/2 a mano), y una medición local de un día desde el entorno de Claude Code. Claude Code hizo la Fase A (reporte `ClaudeCode_para_Cowork_2026-10-15_a.md`, 01:09): 248 tests, 8 de 8 feeds OK, 23 hechos locales con 2 medios en la primera media hora (Crónica en 20 de 23).
- La medición en la nube se cortó a las 3 vueltas (el contenedor se apaga). Alejo la arrancó en su compu el 15-10 a las 09:45, en paralelo con la nacional. Las dos cortan el 16-10 después de las 00:30 (a las 04:55 del 16 seguían corriendo).
- Escribió `buzon/Cowork_para_ClaudeCode_2026-10-15_c.md` (10:55): cancela la Fase B de la carta `a` (ya no hay nada en el contenedor) y pasa la revisión de lo local a Cowork. Solo toca `pendientes.md`. Alejo se la pegó a Claude Code el 15-10 a las 11:14.
- Otro chat de Cowork escribió la carta `b` (10:20, la capa 4: `src/capa4.js`, workflows de n8n, página con login, guía de instalación). Claude Code la hizo el 15-10.

## Charla del 16-10 (04:55 en adelante): lo que Alejo vio usando la página

Cuatro temas. Dos ya estaban decididos; dos son nuevos.

1. **Quitar con motivo, archivar para combinar, menos scroll, colores:** ya decidido el 14-10 (Opción C). Alejo suma el porqué: el motivo guardado sirve para estudiar «a dónde quiere llegar quien hace las noticias». Con el login de la capa 4 los motivos se guardan en el servidor por persona (valor por defecto ya anotado). Va en la carta de la página C.
2. **«En revisión» (las 4/5) desordenadas, y una noticia publicada hoy que habla de ayer (el dólar blue del 14, visto el 15 a las 12:15):** el desorden lo resuelve el pivote de la página C (una sola tarjeta abierta). Lo de «publicada hoy, habla de ayer» es el criterio 2 (dato nuevo), que hoy va forzado a «sí» sin IA; la capa 4 se lo pregunta a la IA y se cae sola. Para mirar en la medición: cuántas «dólar blue» se escapan del molde `^dolar (blue )?hoy` (por ejemplo «El dólar blue cerró…») antes de proponer un molde nuevo.
3. **X / Twitter como fuente:** idea de Alejo: cuentas verificadas/oficiales como segunda confirmación, con aviso en la página («compilado de N tuits de cuentas verificadas»), 3 internacionales y unos 10 que hablen de Argentina. Cowork: nunca como medio que suma a los 5 (la tilde se compra); como mucho una señal aparte, tipo vía B («además lo publicaron N cuentas oficiales en X»). **Bloqueo antes de diseñar:** la API de X es paga y cambió de precio y reglas; hay que averiguar costo y qué permite con datos frescos. **Valor por defecto: «Más adelante»**, con esa averiguación primero; si es caro, no.
4. **Cortes de agua, luz y gas por barrio (Comodoro y Caleta). Decidió Alejo (16-10, 04:57): opción B, un bloque «Avisos» aparte,** leído directo de quien corta (la cooperativa de luz y agua de Comodoro, la de gas, la de Caleta) como fuente primaria, sin verificación por medios; barrio, día y horario salen del aviso mismo; los portales solo como respaldo. No toca el motor ni la regla de notas de servicio (que hoy descartaría «corte programado en Km 3» como plantilla). **Primer paso, para la carta de los bloques por zona:** Claude Code prueba qué publican esas cooperativas y por dónde (página, feed, o solo redes), antes de diseñar la lista. Descartada la A (como noticia local verificada por 2 medios): un corte lo publica un portal solo y nunca llega a 2.

## Qué le llega al próximo chat de Cowork (16-10)

De la compu de Alejo, cinco cosas: la salida de `npm run medir` (nacional), `datos/vueltas.jsonl`, la salida de `npm run medir -- --carpeta datos/comodoro`, `datos/comodoro/vueltas.jsonl` y `datos/comodoro/notas.json`. Más lo que Don Julio haya contestado por WhatsApp (versión de n8n, Docker o npm, cómo se entra, cuántas personas de Canal 2 y desde qué aparato).

## Qué hace ese chat con eso

1. **Lo nacional:** cruzar el día entero con la tabla parcial de la carta `b` («Qué dejó la medición», 38 vueltas hasta las 09:44) y con las notas de Alejo del 14-10 (`Alejo_para_Cowork_2026-10-14_a.md` y `_b.md`) y las de la charla del 16-10 (arriba).
2. **Lo local (era la Fase B de la carta `a`):** Tabla A (hechos distintos que llegaron a 2 medios: primera hora, medios, título; cuántos con 2 de Comodoro y cuántos con El Chubut), Tabla B (de qué notas se arma cada uno, con `preparar` sobre `notas.json` y `cargarConfig('config/comodoro')`; «misma noticia a ojo»: sí / no / dudoso) y los números del día (notas por portal, sin bajada por portal, si El Patagónico trae hora o solo día). Cowork puede correr eso clonando el repo y usando `node`.
3. Con esos dos cruces: la carta de los bloques por zona (local, Chubut, Región), con los números medidos y no a ojo, **más el bloque «Avisos» de cortes (punto 4 de la charla), que empieza por probar las fuentes**. Va después de la capa 4 (carta `b`), antes de la página C.
4. Anotar en `pendientes.md` los puntos 2 y 3 de la charla (molde del dólar; X en «Más adelante» con la averiguación del costo).

## Lo que sigue abierto

- Don Julio: datos del servidor y de Canal 2 (preguntados por WhatsApp el 15-10 a las 10:14). La carta `b` asume Docker, 3 personas, celular.
- Crónica aparece en casi todas las locales: ver en la Tabla B si son noticias de verdad o relleno nacional (el Papa, River) antes de fijar «2 medios locales».
- El Patagónico fecha sus notas a las 00:00Z: si no trae hora, el orden «más nuevo» dentro del bloque local se apoya en los otros medios.
- X: costo y reglas de su API, sin averiguar.
- Cortes: por dónde publican las cooperativas, sin probar.
