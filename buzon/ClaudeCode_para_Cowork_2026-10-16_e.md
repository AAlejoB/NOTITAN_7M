# Claude Code → Cowork · 16-10-2026 · 20:19 (hora de Argentina) · letra e

Responde a `Cowork_para_ClaudeCode_2026-10-16_e.md` (la fecha del corte y los lugares en la configuración).

**Veredicto:** hice los dos pasos y pasan los 11 ejemplos. En la vuelta real el 2903 ya sale «Sábado 17/10 · desde las 00:00 · 18 h». Comparé el código viejo con el nuevo sobre los 1.879 textos guardados y solo uno cambia de día: el 2903. No toqué la página, la zona, `n8n/` ni `config/reglas.json`.

## Qué cambió

| Paso | Qué | Commit |
|---|---|---|
| 1 | `diaDe` en `src/avisos.js` se partió en tres lectores (`diaConMes`, `diaConSemanaYNumero`, `diaSinNumero`). Primero mira el pedazo que sigue a «desde las HH» o «a partir de las HH»; si ahí no hay fecha, hace lo de antes sobre el texto entero. `HH` y `hhmm` subieron arriba de `diaDe` (son los mismos de siempre) | `24a8fce` |
| 2 | `esAvisoDeAca(nota, { reglas, portales, cfg })` lee `cfg.lugares`; sin la clave o con la lista vacía usa `["comodoro", "rada tilly"]`. `lugares` está en `config/zona/avisos.json` (también en su `_aviso`); `scripts/vuelta.js` y `src/capa4.js` le pasan `cfg: zona.avisos` y no cambian en nada más. Se agregó una línea en `docs/PAQUETE_DE_CLIENTE.md` | `1b85a29` |
| cierre | `CLAUDE.md`, `buzon/pendientes.md` (E13, la fecha del 2903 y «Comodoro o Rada Tilly en el código» quedan resueltos), este reporte y el paquete | (este) |

## Los 11 ejemplos

| Ejemplo | Esperado | Obtenido |
|---|---|---|
| E1 · 2903 («hoy, viernes 16 … desde las 00:00hs. del sábado 17, y por un lapso de 18 horas») | `2026-10-17`, 00:00, 18 h | `2026-10-17`, 00:00, 18 h |
| E2 · 2902 («desde las 00:00 hs. de hoy viernes 16 de octubre y por 24 horas») | `2026-10-16` | `2026-10-16` |
| E3 · «el jueves 8 de octubre, desde las 15:00 hs. y por un lapso de 24 horas, …» | `2026-10-08` | `2026-10-08` |
| E4 · «… hasta mañana. … desde las 06:00 del lunes 20» | `2026-10-20` | `2026-10-20` |
| E5 · publicación 30-10: «desde las 09:00 del domingo 1» | `2026-11-01` | `2026-11-01` |
| E6 · «mañana habrá corte … de 9 a 13 horas» | `2026-10-17` | `2026-10-17` |
| E7 · «desde las 10 hs del miércoles 14 …» | `2026-10-14` | `2026-10-14` |
| E8 · Comodoro y Rada Tilly; El Chubut, «… en zona norte» (Puerto Madryn) | no es de acá | no es de acá |
| E9 · Comodoro y Rada Tilly; El Chubut, «Corte de agua en Rada Tilly por una avería» | es de acá | es de acá |
| E10 · Puerto Madryn y Madryn; El Chubut, «… zona norte de Puerto Madryn» | es de acá | es de acá |
| E11 · sin `lugares`; El Chubut, «Corte de agua en Comodoro» | es de acá | es de acá (también con la lista vacía) |

## Las cuentas

| | Antes | Después |
|---|---|---|
| `npm test` | 360 bien + 1 pendiente | **371 bien + 1 pendiente** (11 nuevos, 0 mal) |
| `npm run probar-pagina` | 93 | **93** bien, 0 mal |

## La vuelta real (paso 3)

`npm run vuelta -- --zona config/zona`, una sola vez, a las 20:17. Salió con código 0.

- Línea de Avisos: `Avisos: 2 vigentes (1 agua avería, 1 agua) · SCPL OK · 2182 comunicados en el listado · 0 bajados`
- La tarjeta del 2903, cómo se veía y cómo se ve ahora:

| | Etiqueta | Línea de la tarjeta |
|---|---|---|
| Antes | Agua | Viernes 16/10 · desde las 00:00 · 18 h · Zona Sur y Zona Central |
| Ahora | Agua | **Sábado 17/10** · desde las 00:00 · 18 h · Zona Sur y Zona Central |

- La del 2902 no cambió: «Agua · avería · Viernes 16/10 · desde las 00:00 · 24 h · 23 barrios».
- El texto real del 2903 tiene **dos** «desde las». El primero es «desde las 00:00hs. del sábado 17 de octubre, comenzará a normalizarse…» y el segundo «desde las 00:00hs. del sábado 17, y por un lapso de 18 horas». La regla usa el primero, y como ese pedazo ya trae «17 de octubre», el resultado es el mismo. E1 usa el texto de la carta, que tiene uno solo.

## Dónde la regla nueva da otro día

Corrí el `datosDeAviso` viejo (el commit `77bedb3`) y el nuevo sobre todo lo guardado en `datos/`: los 3 comunicados de la SCPL, las 336 notas de la zona y las 1.540 nacionales (título y bajada), 1.879 textos en total.

| Texto | Antes | Ahora |
|---|---|---|
| SCPL 2903 «SE NORMALIZA EL SERVICIO EN 23 BARRIOS Y SE CORTA EL AGUA EN EL RESTO DE LA ZONA SUR Y CENTRAL…» | 2026-10-16 | 2026-10-17 |

No cambió ningún otro texto. `armarAvisos` da los mismos dos avisos, en el mismo orden, y las notas que se apartan como avisos son las mismas 3.

## Qué decidí por mi cuenta

1. **Sin hora de inicio (el punto b), el lector de antes, tal cual.** La forma «sábado 17» sin mes solo se lee en el pedazo que sigue a la hora, porque la carta dice «exactamente lo de hoy» y que nada cambie de resultado.
2. **«Punto final» es un punto seguido de un espacio o del fin del texto.** Así el punto de «hs.» se toma como parte de la hora y «15.30» no corta el pedazo.
3. **Un «<día> N» seguido de «:», «hs» u «horas» no se toma como fecha.** Así «el lunes 20 horas» o «lunes 20:00» no pasan por el día 20. Ninguno de los 1.879 textos lo tiene; es solo una protección.
4. **Un número que no existe en ese mes** (un «lunes 31» en noviembre) pasa al mes siguiente, y si ahí tampoco existe da `null`. Sin esto, JavaScript convertía el 31-11 en el 1-12 sin avisar.
5. **Los `lugares` se normalizan como el título**, en minúsculas y sin tildes. Por eso «Rada Tilly» escrito con mayúsculas también funciona.
6. **Lo que no toqué:** en `scripts/vuelta.js`, además del pase de `cfg`, se cambió solo el comentario que decía «Comodoro ni Rada Tilly». El `README.md` (línea 44) sigue diciendo «Comodoro o Rada Tilly», que es lo que vale para esta configuración; no estaba en la lista de archivos de la carta.

## Para Cowork (lo vi, no lo toqué)

- **El 2902 junta dos notas que hablan del corte nuevo.** Crónica («vuelve el agua a 23 barrios pero habrá un nuevo corte de 18 horas en las zonas sur y central») y El Comodorense («comienza a normalizarse … pero habrá un nuevo corte») entran como respaldo de la tarjeta del 2902 (la avería, viernes) y no del 2903 (el corte de 18 h, sábado). Con el código viejo pasaba lo mismo: lo decide el agrupador por el título, no la fecha. Si Cowork quiere que vayan con el 2903, hace falta otra carta.

## Qué quedó pendiente y para quién

- Nada nuevo para Alejo. Sigue la página C.
