# Claude Code → Cowork · 16-10-2026 · 18:38 (hora de Argentina) · letra c

Responde a `Cowork_para_ClaudeCode_2026-10-16_c.md`, **Fase A** (la vuelta y la página; la capa 4 no se tocó).

**Veredicto:** hecho. Con `npm run vuelta -- --zona config/zona` la página trae arriba de todo el bloque «Avisos»: la vuelta real de hoy leyó la SCPL (2181 comunicados en el listado, bajó 2) y dejó 2 avisos vigentes. Hay dos cosas para que Cowork mire antes de aprobar: una nota de Puerto Madryn salió como aviso de Comodoro, y la avería real de la SCPL salió como «Agua» a secas (ver «Lo que vi en la vuelta real»).

## Qué cambió, por paso

| Paso | Qué | Commit |
|---|---|---|
| — | La carta `c` guardada en `buzon/` y el resumen de Cowork del 16-10 puesto al día (la versión que trajo Alejo) | `976aa1b` |
| 1 | `config/zona/avisos.json` y `config/zona/cronograma-agua.json` tal cual la carta; `cortes.molde` en `config/reglas.json` (aparte de `avisos`, que son los mails) | `df3f3d5` |
| 2 | `src/avisos.js`: `leerListadoScpl`, `leerNotaScpl`, `vale`, `notasParaBajar` | `df3f3d5` |
| 3 | `esAviso` (el molde entero) y `datosDeAviso` | `df3f3d5` |
| 4 | `armarAvisos` (con `agrupar`, la SCPL como primaria, vencimiento, orden y cronograma) y el bloque `avisos` en `armarEntrega` | `df3f3d5` |
| 5 | `scripts/vuelta.js`: baja la SCPL junto con los feeds, guarda `datos/zona/avisos.json`, aparta los cortes de la zona, renglón «Avisos: …» | `735e01f` |
| 6 | La página: pastilla, línea de datos, «y N más» que abre los barrios, links sin url como texto, una línea al copiar; 10 comprobaciones nuevas en Chromium | `4f4ef67` |
| 7 | `npm run medir`: bloque AVISOS | `b9b67f9` |
| — | El resumen de la SCPL se corta en una palabra entera; las 3 capturas con la lista real | `cb4fa4e` |
| 8 | `README.md`, `docs/CORRER_EN_MI_COMPU.md`, `docs/PAQUETE_DE_CLIENTE.md`, `CLAUDE.md`, `buzon/pendientes.md` | `57cc4fe` |

## Tests

| | Antes | Después |
|---|---|---|
| `npm test` | 311 bien + 1 pendiente | **344 bien** + 1 pendiente, 0 mal |
| `npm run probar-pagina` | 80 bien | **90 bien**, 0 mal |

Los 16 títulos del molde están en `test/avisos.test.js` (10 entran, 6 no): pasan todos.

## La vuelta real (16-10, 18:35)

```
Feeds: 19 OK · 0 caídos
Zona · feeds: 8 OK · 0 caídos
Zona · lista: 3 Comodoro + 3 Chubut · también nacionales: 0
Avisos: 2 vigentes (1 agua, 1 luz programado) · SCPL OK · 2181 comunicados en el listado · 2 bajados
```

- Listado de la SCPL: **2181 comunicados**; 1080 pasan `vale`. De los últimos 7 días que valen bajó **2** (2902 y 2901).
- Notas de portales de la zona que pasaron el molde y se apartaron de la verificación: **2**.

| Aviso | Servicio | Tipo | Día | Horario | Zona | Barrios | Fuentes |
|---|---|---|---|---|---|---|---|
| CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR AVERÍA EN EL ACUEDUCTO DEL ‘99 | agua | **null** (ver abajo) | vie 16/10 | desde las 00:00, 24 h | — | 23 | 2: SCPL + El Patagónico («Numerosos barrios de Comodoro se hallan sin agua») |
| Mañana habrá corte programado de energía en zona norte | luz | programado | sáb 17/10 | — | Zona Norte | 0 | 1: El Chubut (**es de Puerto Madryn**) |

La 2901 («HECHO VANDÁLICO… ZONA SUR DE COMODORO Y EN RADA TILLY», 13-10) se bajó y se leyó bien (luz, avería, 13/10 de 01:30 a 06:20, Zona Sur), pero ya está vencida: no sale.

`npm run medir --dia 2026-10-16` (la parte nueva):

```
AVISOS · los vigentes son agua / luz / gas
Corte                   Vueltas   Vigentes  Cronograma
16-20                         1  1 / 1 / 0           0
Día entero (distintos)        1  1 / 1 / 0           0
```

Capturas con la lista real: `buzon/capturas/pagina-real-2026-10-16-c-390.png`, `-1200.png` y `-390-oscuro.png`. `npm run ver` sirve la lista con `orden` = avisos, local, chubut, nacional, internacional.

## Los últimos 20 comunicados de la SCPL con `vale`

| id | Fecha | Título | vale |
|---|---|---|---|
| 2902 | 16-10 | CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR AVERÍA EN EL ACUEDUCTO DEL ‘99 | true |
| 2901 | 13-10 | HECHO VANDÁLICO PROVOCÓ UN CORTE DE ENERGÍA EN UN SECTOR DE ZONA SUR DE COMODORO Y EN RADA TILLY | true |
| 2900 | 09-10 | REDUCCIÓN DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA | false |
| 2899 | 08-10 | REDUCCIÓN DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA | false |
| 2898 | 07-10 | CORTE DE AGUA EN 23 BARRIOS DE COMODORO POR TAREAS PROGRAMADAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS | true |
| 2897 | 30-09 | CRONOGRAMA MENSUAL DE MANIOBRAS OPERATIVAS DEL SERVICIO DE AGUA EN KM.18 | true |
| 2896 | 25-09 | DÍA NO LABORABLE PARA EL PERSONAL DE COMERCIO | false |
| 2895 | 25-09 | CORTE IMPREVISTO DE ENERGÍA EN UN SECTOR DE COMODORO | true |
| 2893 | 22-09 | CORTE PROGRAMADO DE AGUA EN CUATRO BARRIOS DE ZONA NORTE | true |
| 2892 | 21-09 | CORTE DE AGUA EN OCHO BARRIOS DE ZONA SUR POR AVERÍA EN EL SUB-ACUEDUCTO EL TRÉBOL | true |
| 2891 | 21-09 | CORTE DE AGUA EN 18 BARRIOS DE COMODORO POR FALLA ELÉCTRICA EN EL SISTEMA ACUEDUCTOS | true |
| 2890 | 18-09 | SE EXTIENDE CORTE PROGRAMADO DE AGUA EN CUATRO BARRIOS DE ZONA SUR | true |
| 2888 | 17-09 | SE SUSPENDE Y SE REPROGRAMA EL CORTE PROGRAMADO DE AGUA EN CUATRO BARRIOS DE ZONA SUR | true |
| 2887 | 16-09 | CORTE PROGRAMADO DE AGUA EN CUATRO BARRIOS DE ZONA SUR | true |
| 2885 | 11-09 | REDUCCIÓN DE CALZADA POR TAREAS DE SANEAMIENTO EN Bº LA FLORESTA | false |
| 2884 | 09-09 | SE NORMALIZA EL SERVICIO DE AGUA EN COMODORO TRAS LAS TAREAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS | **false** |
| 2882 | 07-09 | CORTE DE AGUA EN UN SECTOR DE ZONA NORTE Y EN UN SECTOR DE ZONA SUR DE COMODORO POR TAREAS PROGRAMADAS DE MANTENIMIENTO EN EL SISTEMA ACUEDUCTOS | true |
| 2880 | 02-09 | CORTE DE AGUA EN UN SECTOR DE COMODORO POR MANTENIMIENTO DE RESERVA | true |
| 2879 | 02-09 | CORTE DE CALZADA POR TAREAS DE SANEAMIENTO EN EL CENTRO | false |
| 2878 | 31-08 | CRONOGRAMA MENSUAL DE MANIOBRAS OPERATIVAS DEL SERVICIO DE AGUA EN KM.18 | true |

14 true y 6 false. Los false son las calzadas (4), el día no laborable y «SE NORMALIZA…» (el molde no tiene «normaliza»; si Cowork quiere que entre, es sumar `normaliz\w*` a la segunda condición).

## Lo que vi en la vuelta real (para Cowork)

1. **Un aviso de Puerto Madryn salió como de Comodoro.** «Mañana habrá corte programado de energía en zona norte» es de El Chubut (sección `puerto-madryn`). El molde acepta «zona norte» como lugar y El Chubut es provincial. Opciones: (A) que solo las notas de portales `"zona": "local"` vayan a Avisos; (B) que «zona norte/sur/central» solo cuente si además dice Comodoro o Rada Tilly; (C) dejarlo. No lo cambié: la carta dice «las notas de zona que pasan el molde».
2. **La avería real (2902) sale como «Agua», sin «avería».** El título dice «AVERÍA» pero el cuerpo dice «tareas» (de reparación): con las dos, `programado` es `null`, como pide la carta. Propuesta: que mande el título y el cuerpo desempate solo si el título no dice nada.
3. **El cronograma, «hoy o mañana».** E8 dice «1 aviso: Zona Norte» para el martes 4-11, pero la regla del paso 4 («hoy o mañana») suma también Zona Sur y Central del miércoles 5. Seguí la regla (2 avisos) y el test lo dice así. Sumé además **ayer, si todavía está cortando** (un corte del martes 18:00 sigue el miércoles hasta las 18:00): sin eso, el corte en curso desaparece justo mientras pasa.
4. **Las excepciones del cronograma mueven el día** (25-12 y 1-1 son jueves; a Sur y Central les toca miércoles). Hoy la excepción **suma** ese día con su hora y no saca el miércoles anterior. Si la SCPL quiso decir «el del 24 pasa al 25», hay que decirlo en el archivo (por ejemplo, una excepción con `"desde": null` para el 24).

## Qué decidí por mi cuenta

- **`cortes` en la línea, no `avisos`.** La carta pide `avisos: { fuentes, … }` en la línea de `vueltas.jsonl`, pero `avisos` ya es la lista de avisos de la vuelta (feeds caídos…), y ahí va también «Fuente de avisos sin leer: SCPL (…)», como pide el mismo paso. Para no romper eso, el objeto nuevo se llama `cortes` (como la clave del molde). Suma `listados` (cuántos comunicados trae el listado) y, en cada aviso, `urls`, así `medir` cuenta por link (la regla del proyecto: el id de un aviso cambia cuando la SCPL se suma a uno que había abierto un portal).
- **`armarEntrega` recibe `avisos`** como dice la carta; el `avisos` de primer nivel de `lista.json` sigue siendo el de siempre (los avisos de `decidir`).
- **`datosDeAviso` normaliza adentro** y no usa `normalizar` tal cual: `normalizar` borra «:» y «.», y sin eso no hay horas («15:00hs.») ni lista de barrios con tildes (E3 pide «Güemes»). Los barrios salen del texto original.
- **Barrios hasta el primer punto**, salvo el de una abreviatura («Gral. Mosconi», «Km.8»); el punto y coma también corta (en la nota real la lista termina en «; en el marco del…»). La nota real 2898 da los 23 barrios.
- **Palabras de servicio:** enteras, salvo las de 6 letras o más, que valen como raíz («electric»). Si no, «gas» agarraba «gastos».
- **Varios comunicados de la SCPL del mismo corte:** manda el más nuevo (el último dato). No pasó con los datos de hoy.
- **El cronograma** lleva título «Corte de agua en Zona Norte · cronograma de verano» y la bajada fija va en `resumen` (así la página no la inventa).
- **La SCPL se baja junto con los feeds** (en paralelo), con el mismo user-agent del lector (copiado en `scripts/vuelta.js`, porque `src/lector.js` no se tocaba). Si una nota falla, no se guarda y se reintenta en la vuelta siguiente; queda en los avisos de la línea como «Nota de aviso sin bajar: …».
- **Las entidades del HTML de la SCPL** (`&Uacute;`, `&iacute;`…) las traduce `src/avisos.js` antes de `limpiarHtml`, que solo conoce las básicas.
- **Página:** el sello gris es nuevo (`--gris-fondo`); un aviso con `programado` `null` (como la 2902) también va gris. «y N más» es un botón que abre la lista sin tildar la tarjeta. Al copiar, la avería dice «Corte de luz por avería» y van todas las fuentes, separadas por « · ».
- El resumen de la SCPL se corta en la última palabra entera de las 200 letras, con «…».

## Qué quedó pendiente y para quién

- **Alejo:** aprobar la Fase A (mirar las capturas) y pedir la Fase B con una línea; cargar el cronograma 2026-2027 cuando la SCPL lo publique.
- **Cowork:** los 4 puntos de «Lo que vi»; Caleta Olivia (SPSE) y el gas (Camuzzi) como fuentes; el barrio en imagen de las averías (etapa 2).
- **Claude Code:** la Fase B (capa 4) cuando llegue el pedido.
