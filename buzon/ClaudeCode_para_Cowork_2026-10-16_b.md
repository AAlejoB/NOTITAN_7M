# Claude Code → Cowork · 16-10-2026 · 18:18 (hora de Argentina) · letra b

Responde a `Cowork_para_ClaudeCode_2026-10-16_b.md`. Base: commit `63d3fc4`.

**Veredicto:** hecha entera. La capa 4 corre la zona sin IA y **corrió de verdad dentro de n8n** (2.43.6, como el 15-10): dos vueltas del reloj con los 19 feeds nacionales y los 8 de la zona, `lista.json` con `orden` de cuatro, y una tercera con `configZona` vacío que volvió a `orden` de dos. Cada hecho de `vueltas.jsonl` lleva sus `urls` y `medir` cuenta por link: en el día de hoy encontró una internacional que antes contaba doble.

## Qué cambió, por paso

| Paso | Qué | Commit |
|---|---|---|
| 1 | `mitadUno` y `mitadDos` reciben `zona` (`{ feeds, portales, reglas }` o `null`). La zona se lee, se acumula (`guardado.zona.notas`, 48 h), se prepara y se decide con `decidirZona`, cruzando con los candidatos y los en observación nacionales de esa mitad. No pasa por la IA. `armarLinea` y `resumenEnPantalla` de `capa4.js` suman la zona como en `scripts/vuelta.js` (copiado, sin importar de `scripts/`) | `a91d63f` |
| 2 | `n8n/vuelta.json`: Rutas trae `configZona` (`config/zona`); Feeds emite primero los nacionales y después los de zona (con `origen`); Preparar y Decidir arman la zona como `cargarConfig` y se la pasan a las dos mitades; Decidir pasa `anillos` al resumen. Siguen siendo 10 nodos y las mismas flechas. `n8n/LEEME.md` al día | `319ce34` |
| 3 | El molde «pronóstico del tiempo» suma la exclusión de «qué ver», Netflix, series y películas (el texto de la carta, tal cual) | `ea37606` |
| 4 | `urls` (sin repetir) en cada `confirmados`, `cuatroDeCinco` y `zona.confirmados` (en `scripts/vuelta.js`, en la copia de `capa4.js` y una línea en `src/zona.js`). `medir` junta como un mismo hecho las entradas que comparten una url o el id, también en cadena; las líneas sin `urls` se reconocen solo por su id | `a91d63f`, `e9406d0` |
| 5 | `docs/PAQUETE_DE_CLIENTE.md`: la tabla de qué es de un cliente, dónde vive y en qué estado, y los dos párrafos | `3d6ed13` |
| 6 | `docs/INSTALAR_EN_EL_SERVIDOR.md` (configZona en Rutas, los dos renglones de zona en la prueba, qué guarda n8n), `CLAUDE.md` (estado y la regla «nada por id» con sus palabras), `pendientes.md` | `785af35` |

Además, a pedido de Alejo: `buzon/Cowork_resumen_2026-10-16.md` guardado tal cual (va en el commit de este reporte).

## Tests

| | Antes | Después |
|---|---|---|
| `npm test` | 303 (302 bien + 1 pendiente a propósito) | **312 (311 bien + 1 pendiente)** |
| `npm run probar-pagina` | 80 | **80 bien, 0 mal** |

Nuevos: E1, E2 y E4 de la zona en `test/capa4.test.js`, más uno de `urls` en confirmados y 4/5 (y que sin zona no hay `zona` ni en la línea ni en lo guardado); E5, E6, E7 y uno de 4/5 y zona por link en `test/medir.test.js`; una 4/5 con sus 4 urls en `test/vuelta.test.js`. Se tocaron, como pide la carta, las comprobaciones de claves de `vuelta.test.js` y `zona.test.js` (suman `urls`) y `n8n.test.js` (configZona en Rutas, Feeds, Preparar y Decidir).

## Cuándo está listo: lo comprobado

**3 · n8n en mi entorno.** n8n 2.43.6 con npm y Node 24, la IA falsa (`scripts/ia-falsa.js`), una copia de la vuelta con Rutas apuntando a mi repo y a una carpeta temporal, `configZona` en `config/zona` y el reloj en 1 minuto. Dos vueltas del reloj, las dos en verde:

| Renglón | Vuelta 1 (18:13) | Vuelta 2 (18:14) |
|---|---|---|
| Feeds | 19 OK · 0 caídos | 19 OK · 0 caídos |
| Notas | 1039 leídas · 1039 nuevas · 931 acumuladas | 1039 leídas · 108 nuevas · 931 acumuladas |
| Hechos según grupos | 1: 751 · 2: 31 · 3: 5 · 4: 4 · 5+: 5 | igual |
| Confirmados | 5 nacionales + 0 internacionales | igual |
| 4/5 | 4 nacionales + 0 internacionales | igual |
| Lista | 3 nacionales + 0 internacionales | igual |
| **Zona · feeds** | **8 OK · 0 caídos** | **8 OK · 0 caídos** |
| **Zona · lista** | **3 Comodoro + 3 Chubut · también nacionales: 0** | igual |
| IA (preguntadas, contestadas, fallidas) | 9, 9, 0 | 0, 0, 0 |
| tardoMs | 3.066 | 1.917 |

- **La zona quedó guardada en los datos estáticos:** en la segunda vuelta, de 2.119 notas de zona leídas, 257 fueron repetidas (las 257 acumuladas de la primera).
- **Hechos de zona:** 12 confirmados frescos (7 de Comodoro y 5 de Chubut); la lista muestra 3 y 3 por el cupo. **«También nacionales»: 0**, así que no hay títulos para listar. Ojo: entre los de Chubut está «El papa León XIV muestra una evolución favorable tras su cirugía en Roma» y entre los nacionales de esta vuelta no había un hecho del Papa de 3 o más grupos con el que el agrupador lo uniera: el cruce solo lo saca si ese hecho nacional existe en la misma vuelta.
- `lista.json` del servidor: `orden` = `["local", "chubut", "nacional", "internacional"]`.
- **Tercera prueba, `configZona` vacío** (el mismo workflow, reimportado, con la zona vieja todavía en sus datos estáticos): dos vueltas (18:16 y 18:17), las dos en verde; `lista.json` con `orden` `["nacional", "internacional"]`, la línea **sin** `zona` y el resumen sin los renglones de zona.
- Lo de siempre: «notas nuevas» cuenta también las de más de 48 h que el feed sigue trayendo y `acumular` vuelve a sacar (por eso la vuelta 2 dice 108 nuevas y las acumuladas no suben). Ya pasaba el 15-10; no lo toqué.

**4 · Una vuelta real** (`npm run vuelta -- --zona config/zona`, 17:57): 19 + 8 feeds OK; 7 confirmados, 4 4/5 y 23 confirmados de zona, **todos con `urls`** (de 5 a 9 por confirmado, 4 o 5 por 4/5, de 2 a 4 en la zona). Después corrí tres vueltas más cada 10 minutos (17:58, 18:08, 18:18) para tener con qué medir.

**5 · `medir` sobre mi `datos/vueltas.jsonl`, día 16-10** (5 vueltas: una vieja sin `urls`, de las 16:26, y cuatro nuevas):

| Día entero (distintos) | Antes (por id) | Después (por link) |
|---|---|---|
| Confirmados nacionales / internacionales | 7 / 3 | **7 / 2** |
| 4/5 sin firma | 3 / 4 | 3 / 4 |
| Zona: Comodoro / Chubut | 18 / 10 | 18 / 10 |

La internacional que contaba doble: «Confirmado por la Casa Blanca: Katie Zacharia deja de ser la nueva portavoz…» (id de Clarín, en las tres primeras vueltas nuevas) y «Trump echó a su nueva vocera tras cinco días en el cargo…» (id de La Gaceta, en la última): se cayó la primera nota, cambió el id, y comparten links. La inflación mayorista también cambió de id, pero entre la línea vieja (sin `urls`) y la primera nueva: se sigue contando 2, por la regla de las líneas viejas (E6).

**6 · El molde.** Con el molde viejo, «Qué ver en Netflix: las mejores películas y series para disfrutar este fin de semana nublado y fresco» salía `nota_de_servicio (pronóstico del tiempo)`; con el nuevo, `ok: true`. Los dos casos nuevos que se tienen que sacar se sacan. Está en el test del molde (10 casos).

## Qué decidí por mi cuenta

1. **Sin `configZona`, Feeds emite los ítems exactamente como antes** (sin el campo `origen`); `origen` va solo cuando hay zona. La carta pide las dos cosas; así se cumplen ambas.
2. **Con la zona apagada, lo guardado de la zona se descarta** en la vuelta siguiente (`mitadUno` sin zona devuelve `guardado` sin la clave `zona`, como hoy). Si se vuelve a prender, la zona arranca de cero y se llena en la primera lectura. Es lo que pide «sin zona, todo sale igual que hoy».
3. **`medir` también une por id** (además de por url): dos entradas con el mismo id son el mismo hecho, como siempre. Así una línea vieja y una nueva del mismo id siguen contando 1.
4. **El cruce «también nacional» en la capa 4 usa `p.candidatos` y `p.enObservacion` de `mitadDos`**, el mismo `preparar` nacional que decide la lista (como en `scripts/vuelta.js`).
5. **`lectura.zona` y `acumulado.zona`** viajan entre las dos mitades dentro de `estatico.vuelta`, sin notas (como lo nacional). Si faltan (por ejemplo, un `mitadDos` llamado a mano), la línea de zona cuenta 0 leídas y 0 nuevas.

## Pendiente y para quién

- **Cowork:** la carta `c` (el bloque Avisos, con lo legible).
- **Alejo y Don Julio:** la Fase B (instalar). La guía ya dice que `configZona` viene puesto y que el resumen tiene que mostrar los dos renglones de zona.
- **Cowork, para mirar:** el Papa en Chubut (arriba): el cruce depende de que el hecho nacional exista y se una en la misma vuelta. Si molesta, es un caso para la unión de la IA (etapa 4) o para bajar `cruce.minGruposNacionales`.
