# Cowork → Claude Code · 16-10-2026 · 20:15 (hora de Argentina) · letra e

Responde al reporte `ClaudeCode_para_Cowork_2026-10-16_d.md`. Carta chica: dos cambios en los avisos y el cierre del reporte `d`. No toca la capa 4, ni la página, ni la zona.

## Lo que se cierra del reporte `d` (sin trabajo)

- Las 9 decisiones de «Qué decidí por mi cuenta» quedan aceptadas tal cual, incluida la línea de `src/entrega.js`. No se deshace nada.
- E13 («vecinos reclaman que se normalice el agua») se queda como está: el molde sigue con `normaliz\w*` (con z). Un reclamo no es un aviso y la SCPL escribe «se normaliza» con z. Sacalo de `pendientes.md` como resuelto.

## Qué cambia, como lo ve quien usa la página

1. **La fecha de un corte sale del día que acompaña a la hora de inicio.** Hoy el comunicado 2903 («Hoy, viernes 16 de octubre … finalizaron … desde las 00:00hs. del sábado 17, y por un lapso de 18 horas») dibuja la tarjeta «Viernes 16/10 · desde las 00:00 · 18 h». Después del cambio dibuja «Sábado 17/10 · desde las 00:00 · 18 h».
2. **Las palabras que dicen «es de acá» salen de la configuración, no del código.** Hoy `esAvisoDeAca` tiene escrito «Comodoro» y «Rada Tilly» en `src/avisos.js`. Pasan a `config/zona/avisos.json`. Para quien usa la página no cambia nada; para otro cliente es editar una lista.

## Decidió Alejo / valores por defecto

- Decidió Alejo (16-10, 20:10): hacer esta carta chica antes de la página C.
- Valor por defecto de Cowork: la regla de la fecha de abajo, con su orden de prioridad; y que la lista de lugares viva en `config/zona/avisos.json` con la clave `lugares`.

## Paso 1 · la fecha del corte (`diaDe` en `src/avisos.js`)

Hoy `diaDe(t, fechaPublicacion)` toma la primera fecha con número («N de <mes>») y, si no hay, el primero de «hoy», «mañana», «el/este <día de la semana>».

Regla nueva, en este orden:

a) **Primero se busca la fecha pegada a la hora de inicio.** Se busca en `t` la primera aparición de «desde las HH» o «a partir de las HH» (la misma HH que ya usa `horarioDe`, con o sin minutos, con o sin «hs», «hs.» u «horas» después). Se toma el pedazo de texto que sigue a esa hora hasta la primera coma, punto y coma, punto final o fin de texto, con un tope de 60 caracteres. A ese pedazo se le aplica el lector de fechas del punto c). Si devuelve un día, ese es el día del corte y no se mira nada más.

b) **Si no hay hora de inicio, o el pedazo no trae fecha**, se hace exactamente lo de hoy sobre el texto entero (primero «N de <mes>», después hoy / mañana / el <día de la semana>). Nada de lo que hoy anda tiene que cambiar de resultado.

c) **El lector de fechas entiende una forma más: «<día de la semana> N» sin mes** («sábado 17», «del lunes 20», «el miércoles 1»). Se resuelve así: el mes y el año son los de la publicación; si ese día queda más de 7 días antes de la publicación, es el mes siguiente. El día de la semana escrito no se usa para calcular, solo el número (si no coincide con el calendario, manda el número). Las formas que ya existen («N de <mes>», «hoy», «mañana», «el/este <día>») siguen igual. Orden dentro del lector: «N de <mes>» primero, después «<día de la semana> N», después hoy / mañana / el <día>.

Lo que NO cambia: `horarioDe` (la hora y la duración ya salen bien del 2903), `programadoDe`, `barriosDe`, `zonaDe`, el cálculo de `hasta`, el cronograma.

Ejemplos (publicación = 16-10-2026, salvo que diga otra cosa; el resultado es el `dia` de `datosDeAviso`):

- E1 · 2903: «hoy, viernes 16 de octubre … finalizaron … desde las 00:00hs. del sabado 17, y por un lapso de 18 horas» → `2026-10-17`, desde 00:00, 18 h. Hoy da `2026-10-16`: es el caso que motiva la carta.
- E2 · 2902: «corte de agua en 23 barrios … desde las 00:00 hs. de hoy viernes 16 de octubre y por 24 horas» → `2026-10-16`. Igual que hoy (el pedazo trae «16 de octubre»).
- E3 · «corte programado de agua el jueves 8 de octubre, desde las 15:00 hs. y por un lapso de 24 horas, en los siguientes barrios: …» → `2026-10-08`. El pedazo después de «desde las 15:00 hs.» es « y por un lapso de 24 horas» y no trae fecha: se cae al punto b) y gana «8 de octubre», como hoy.
- E4 · «se extiende el corte hasta mañana. el servicio se reanuda desde las 06:00 del lunes 20» → `2026-10-20` («lunes 20», mes de la publicación).
- E5 · publicación 30-10-2026: «corte de energía desde las 09:00 del domingo 1 en zona norte» → `2026-11-01` (el 1 de octubre queda 29 días antes: mes siguiente).
- E6 · «mañana habrá corte programado de energía en zona norte de 9 a 13 horas» → `2026-10-17`, igual que hoy (no hay «desde las»; manda «mañana»).
- E7 · «desde las 10 hs del miércoles 14 … tareas de mantenimiento» con publicación 16-10 → `2026-10-14` (2 días antes, dentro de los 7: mismo mes; es un corte que ya empezó o terminó).

Tests: agregá E1 a E7 a `test/avisos.test.js` con nombre `fecha pegada a la hora de inicio · E<n>`. Los tests de fechas que ya existen no se tocan y tienen que seguir pasando.

## Paso 2 · «Comodoro o Rada Tilly» a la configuración

- En `config/zona/avisos.json` agregá la clave `lugares` con el valor `["comodoro", "rada tilly"]` (en minúsculas y sin tildes, como queda el texto normalizado). Si la lista ya se guarda en otro lugar con otro nombre, respetalo y decilo en el reporte.
- `esAvisoDeAca` recibe la configuración (como ya la reciben `vale` y `datosDeAviso` con `cfg`) y mira si el título normalizado contiene alguno de los `lugares` como palabra entera. Sin la clave, o con la lista vacía, se porta como hoy (Comodoro y Rada Tilly), así nada se rompe en una configuración vieja.
- Lo que la llama (`vuelta.js` y `capa4.js`) le pasa la configuración de avisos que ya tiene cargada. No se cambia ninguna regla: lo local entra siempre; lo provincial solo si el título nombra un lugar de la lista.

Ejemplos (tests en `test/avisos.test.js`, nombre `lugares desde config · E<n>`):

- E8 · `lugares: ["comodoro", "rada tilly"]`, El Chubut, título «Mañana habrá corte programado de energía en zona norte» (la de Puerto Madryn) → no es de acá (igual que hoy).
- E9 · `lugares: ["comodoro", "rada tilly"]`, El Chubut, título «Corte de agua en Rada Tilly por una avería» → es de acá.
- E10 · `lugares: ["puerto madryn", "madryn"]`, El Chubut, título «Mañana habrá corte programado de energía en zona norte de Puerto Madryn» → es de acá (es lo que haría un cliente de Madryn con su propia carpeta).
- E11 · sin la clave `lugares`, El Chubut, título «Corte de agua en Comodoro» → es de acá (compatibilidad).

Documentación: una línea en `docs/PAQUETE_DE_CLIENTE.md` que diga que `lugares` es de cada cliente, y la clave en el `_aviso` o el comentario de `config/zona/avisos.json` si ya hay uno.

## Archivos

- Se tocan: `src/avisos.js`, `config/zona/avisos.json`, `test/avisos.test.js`, `docs/PAQUETE_DE_CLIENTE.md`, `CLAUDE.md`, `buzon/pendientes.md`, y `scripts/vuelta.js` y `src/capa4.js` solo si hace falta pasar la configuración a `esAvisoDeAca`.
- NO se tocan: `pagina/`, `src/entrega.js`, `src/zona.js`, `src/capa4.js` fuera de ese pase, `n8n/`, `config/zona/cronograma-agua.json`, `config/reglas.json`.

## Pasos, en orden

1. Paso 1 (la fecha), con E1 a E7. Commit.
2. Paso 2 (los lugares), con E8 a E11. Commit.
3. Una vuelta real: `npm run vuelta -- --zona config/zona` una sola vez (sin `--cada`), y copiar al reporte la línea de Avisos y la tarjeta del 2903 como sale ahora (día, hora, duración). Si el 2903 ya se cayó de la ventana, decirlo y mostrar en su lugar el resultado de E1 corrido con `--sin-leer` o con el test.
4. `npm test` y `npm run probar-pagina`. Anotar en el reporte las cuentas: tests antes y después (hoy 360 + 1 pendiente), comprobaciones de página antes y después (hoy 93; no tendrían que cambiar).
5. Actualizar `CLAUDE.md` (una línea en el ítem de los avisos: la regla de la fecha y `lugares` en config) y `buzon/pendientes.md` (E13 resuelto, fecha del 2903 resuelta, «Comodoro o Rada Tilly en el código» resuelto). Reporte `ClaudeCode_para_Cowork_2026-10-16_e.md`, `npm run paquete`, commit y push.

## Qué tiene que traer el reporte

- Los 11 ejemplos con su resultado (una tabla: ejemplo, esperado, obtenido).
- Las cuentas del paso 4.
- La tarjeta del 2903 después del cambio (o lo que diga el paso 3).
- Cualquier texto real de la SCPL o de los portales de las últimas vueltas donde la regla nueva dé un día distinto al de antes, con los dos días: es la lista que Cowork mira para confirmar que no empeoró nada.
- Si algo de esta carta se pudo entender de dos maneras, cuál elegiste y por qué.
