# Cowork → Claude Code · 09-10-2026 · 22:51 (hora de Argentina) · letra b

Responde al reporte `ClaudeCode_para_Cowork_2026-10-09_a.md` (aprobado: lo revisó Cowork y corrió `npm test` en una copia del repo, 231 bien y 1 pendiente). Base: commit `ac8b9a2` de la rama `claude/trusting-knuth-brmpsy`.

**Antes de empezar:** `git pull`. Guardá esta carta como `buzon/Cowork_para_ClaudeCode_2026-10-09_b.md`. Tu reporte va en `buzon/ClaudeCode_para_Cowork_<AAAA-MM-DD del día en que lo escribas>_<letra>.md` (si ese día ya hay uno, la letra que siga).

**Qué pasó:** **Alejo decidió el 09-10 que el día de medición lo corre él, en su compu** (Windows, PowerShell), con la compu prendida 24 horas o más: `npm run vuelta -- --cada 30` y después `npm run medir`. Dónde corre de verdad cada 30 minutos (preguntas 1 y 2 de la capa 4) sigue siendo de Alejo con Don Julio: en esta ronda no se toca n8n ni ningún servidor. Además, Cowork revisó la lista real de tu captura `pagina-real-2026-10-09-390.png` y vio que un mismo medio sale dos o tres veces en la fila de links de una tarjeta («Perfil Perfil Perfil», «Infobae Infobae Infobae»): cada medio va a aparecer una sola vez. Del bloque provisorio (el Nobel en Nacionales) no se toca nada: va a `pendientes.md` con un valor por defecto.

| Paso | Qué cambia para Alejo | Archivos que se tocan |
|---|---|---|
| 1 | En la página, cada medio aparece una sola vez en la fila de links de cada tarjeta | `pagina/index.html`, `scripts/probar-pagina.js` |
| 2 | Un comando para ver la lista real en la compu: `npm run ver` | `scripts/ver.js` (nuevo), `package.json`, `test/ver.test.js` (nuevo) |
| 3 | La guía, paso a paso, para correr el día de medición en la compu de Alejo | `docs/CORRER_EN_MI_COMPU.md` (nuevo) |
| 4 | Capturas, documentos y cierre | `CLAUDE.md`, `buzon/pendientes.md`, `README.md`, reporte, paquete, `buzon/capturas/` |

**No se tocan:** nada de `src/` (ni `entrega.js`), `pagina/logica.js`, `pagina/lista.json`, `scripts/vuelta.js`, `scripts/medir.js`, `scripts/leer.js`, `scripts/armar-pagina.js`, `scripts/armar-paquete.js`, `scripts/probar-feeds.js`, nada de `config/`, `ejemplos/`, los tests que ya existen, `.gitignore`, `.github/`, los `buzon/LEEME*.md` y las cartas y reportes viejos.

**Regla de toda la ronda:** nada de lo que sale de los portales entra al repo. Lo real vive en `datos/` (ya está en `.gitignore`). Al repo van el código, los tests, los documentos, el reporte y 3 capturas de pantalla.

## Qué decidió Alejo y qué es valor por defecto

| Tema | Quién | Valor en esta ronda |
|---|---|---|
| El día de medición lo corre Alejo en su compu, prendida 24 horas o más | Alejo (09-10) | sí; paso 3 |
| Dónde corre de verdad cada 30 minutos (preguntas 1 y 2) | Alejo, con Don Julio, después | en esta ronda no se decide ni se arma |
| Cada medio una sola vez en la fila de links, con su primera nota, sin cambiar el orden | Cowork (valor por defecto; variante A del artifact «Links por medio») | paso 1 |
| Lo que se copia no cambia: sigue con un renglón por nota, todos los links | Cowork (valor por defecto) | paso 1 |
| El bloque provisorio no se toca (el Nobel de la Paz salió en Nacionales) | Cowork (valor por defecto) | nada en el código; va a `pendientes.md` (paso 4) |
| `npm run ver` escucha solo en esa compu (`127.0.0.1`), puerto 7000 | Cowork (valor por defecto) | paso 2 |

## Paso 1 · Cada medio una sola vez en la fila de links

Hoy `links(t)` en `pagina/index.html` dibuja un link por cada elemento de `t.links`, y `t.links` trae una nota por cada nota del hecho. En la lista real un medio suele tener 2 o 3 notas de la misma noticia, y el nombre se repite. La regla nueva: **se dibuja el primer link de cada `medio` y se saltean los siguientes del mismo `medio`**. El orden no cambia (cada medio queda en el lugar de su primera nota).

### 1a · `pagina/index.html`

Reemplazá la función `links` por esta, tal cual (es la única función que cambia):

~~~~
function links(t) {
  var vistos = {};
  var unaPorMedio = t.links.filter(function (l) { if (vistos[l.medio]) return false; vistos[l.medio] = true; return true; });
  return h('p', { clase: 'links' }, unaPorMedio.map(function (l) {
    return h('a', { href: l.url, target: '_blank', rel: 'noopener noreferrer', texto: l.medio });
  }));
}
~~~~

Lo que **no** cambia, para que no te lo lleves puesto: `t.links` en `lista.json` sigue trayendo todas las notas (no se toca `src/entrega.js`); la clave `'k:' + t.links[0].url` sigue siendo la primera nota; las marcas («Nueva», «Recién confirmada», «Te la llevaste») se siguen reconociendo por cualquiera de las urls (`pagina/logica.js` no se toca); y **lo que se copia sigue igual**: `textoParaCopiar` pone un renglón por nota, con todos los links, aunque en la pantalla se vea uno por medio. Como `cuatroDeCinco(t)` y `noticia(t, …)` usan la misma `links(t)`, la regla vale también para las 4/5 y para lo llevado, sin tocar nada más.

### 1b · Ejemplos (entrada → salida)

**E1.** La tarjeta del Nobel de tu captura: `t.links` con los medios, en este orden, `La Gaceta, elDiarioAR, La Capital, El País, BBC, DW, Perfil, Perfil, Perfil` (9 links) → en la pantalla, 7 links: `La Gaceta, elDiarioAR, La Capital, El País, BBC, DW, Perfil`; el link «Perfil» lleva a la url del primer Perfil de los tres.

**E2.** La tarjeta del terremoto: `La Gaceta, La Gaceta, France 24, TN, Al Jazeera, El Cronista, France 24, TN, Página/12, El País, Perfil, Perfil, La Nación, Infobae, Página/12, Ámbito, BBC, Infobae, Infobae` (19 links) → 12 links: `La Gaceta, France 24, TN, Al Jazeera, El Cronista, Página/12, El País, Perfil, La Nación, Infobae, Ámbito, BBC`.

**E3.** Una 4/5 con `TN, TN, Infobae` → 2 links: `TN, Infobae`. La línea «4 de 5 medios» no cambia.

**E4.** Una tarjeta con todos los medios distintos (las del día de ejemplo) → igual que hoy.

### 1c · Comprobaciones en `scripts/probar-pagina.js`

En un contexto nuevo (`nuevoCtx`, con permisos de portapapeles como en la parte 1) y con el mismo mecanismo de `p.route('**/lista.json', …)` que ya usa la parte de la franja «sin IA»: serví la lista del día de ejemplo con la **primera noticia de `bloques.nacional.noticias`** cambiada para que sus `links` sean exactamente `[{ medio: 'Perfil', url: 'https://www.perfil.com/a' }, { medio: 'Perfil', url: 'https://www.perfil.com/b' }, { medio: 'BBC', url: 'https://www.bbc.com/c' }, { medio: 'Perfil', url: 'https://www.perfil.com/d' }]` (lo demás de esa tarjeta queda como está) y la **primera 4/5 de `bloques.nacional.aMano`** con `links` `[{ medio: 'TN', url: 'https://tn.com.ar/a' }, { medio: 'TN', url: 'https://tn.com.ar/b' }, { medio: 'Infobae', url: 'https://www.infobae.com/c' }]`. Cinco comprobaciones, como mínimo:

1. En esa primera noticia, `.links a` son 2.
2. Sus textos, en orden, son `Perfil` y `BBC`.
3. El `href` del primero es `https://www.perfil.com/a`.
4. Tildada esa noticia sola y apretado «Copiar», lo que queda en el portapapeles trae las 4 urls (`/a`, `/b`, `/c` y `/d`), cada una en su renglón, como `Perfil: https://www.perfil.com/a`, etc.
5. En esa 4/5, `.links a` son 2, con textos `TN` e `Infobae`.

Las 68 de hoy quedan como están.

## Paso 2 · Ver la lista real en la compu: `npm run ver`

`scripts/ver.js`, con `"ver": "node scripts/ver.js"` en `package.json`. Sirve la carpeta `<carpeta>/pagina/` (la que escribe `npm run vuelta`) para abrirla en el navegador de esa misma compu. Sin dependencias.

### 2a · Opciones

`node scripts/ver.js [--carpeta datos] [--puerto 7000]`

- `--carpeta <dir>`: la misma que en `npm run vuelta`; por defecto `datos`. Lo que se sirve es `<carpeta>/pagina`.
- `--puerto <n>`: entero de 1 a 65535; por defecto `7000`.
- Si no existe `<carpeta>/pagina/index.html`: mostrá «No existe <carpeta>/pagina/index.html. Corré primero npm run vuelta.» y terminá con código 1.
- Si el puerto está ocupado (`EADDRINUSE`): «El puerto <n> está ocupado. Probá con --puerto <n+1>.» y código 1.
- Un valor que falta o que no es un número entero corta con un mensaje y código 1, sin servir nada.

### 2b · El servidor

Copiá la función `servir(dir)` de `scripts/probar-pagina.js` (los tipos `.html`, `.js` y `.json`, el `404` con `no`, `cache-control: no-store` y la limpieza de `..` en la ruta) y cambiá solo esto: exportá `servir(carpeta, puerto)` → `Promise<{ servidor, url }>`, donde la carpeta que se sirve es `join(carpeta, 'pagina')` (o sea, `carpeta` es la misma de `--carpeta`, no la de la página), y escucha en `127.0.0.1` en ese puerto (`0` = uno libre, para los tests). Al arrancar desde la línea de comandos imprimí una sola línea: «Viendo <carpeta>/pagina en http://127.0.0.1:<puerto>/ (Ctrl+C para cortar)». Nunca escucha en otra dirección que `127.0.0.1`.

### 2c · Ejemplos (entrada → salida)

**E5.** `npm run ver` con `datos/pagina/` armada por una vuelta → imprime «Viendo datos/pagina en http://127.0.0.1:7000/ (Ctrl+C para cortar)»; en el navegador, `http://127.0.0.1:7000/` muestra la página con la lista real y la franja «Sin el juicio de la IA…»; «Traer noticias» vuelve a leer `lista.json`.

**E6.** `npm run ver` sin haber corrido nunca una vuelta → «No existe datos/pagina/index.html. Corré primero npm run vuelta.», código 1.

**E7.** `http://127.0.0.1:7000/../package.json` → 404, aunque `package.json` exista en la raíz del repo.

### 2d · Tests (`test/ver.test.js`), con `node --test`, una carpeta temporal con `pagina/index.html`, `pagina/logica.js` y `pagina/lista.json` inventados, y `servir(carpeta, 0)`; como mínimo:

1. `GET /` → 200, `content-type` empieza con `text/html`, el cuerpo es el `index.html` de la carpeta.
2. `GET /lista.json` → 200, `content-type` empieza con `application/json`, el cuerpo se parsea y es el de la carpeta.
3. `GET /nada.js` → 404.
4. E7: `GET /../package.json` → 404.
5. E6: `spawnSync(process.execPath, ['scripts/ver.js', '--carpeta', <carpeta temporal sin pagina/>])` → `status` 1 y la salida contiene «No existe».

Cerrá el servidor al final de cada test (`servidor.close()`), si no `node --test` no termina.

## Paso 3 · La guía para correr el día de medición en la compu de Alejo

`docs/CORRER_EN_MI_COMPU.md` (la carpeta `docs/` es nueva). La lee Alejo, que no programa, en **Windows 10 u 11 con PowerShell**. Español rioplatense, frases cortas, cada comando en su renglón para copiar, y nada que no esté acá. Estas son las secciones, en este orden, con lo que tiene que decir cada una:

1. **Qué vas a hacer.** Dejar la compu leyendo los portales cada 30 minutos durante un día entero, para medir cuántas noticias llegan a 5 medios. Hace falta: la compu prendida y con internet 24 horas o más, y unos 10 minutos para instalar. Todo lo que se baja queda en una carpeta `datos\` de esa compu y no se sube a ningún lado.
2. **Instalar Node.** En `https://nodejs.org` bajar la versión «LTS» para Windows (el instalador `.msi`) y aceptar todo. Comprobar: abrir PowerShell (tecla Windows, escribir `PowerShell`, Enter), escribir `node -v` y Enter: tiene que decir `v20` o un número mayor. Si dice que `node` no se reconoce, cerrar PowerShell y abrirlo de nuevo.
3. **Bajar el repo.** Dos formas; con una alcanza. Con Git: `git clone -b claude/trusting-knuth-brmpsy https://github.com/AAlejoB/NOTITAN_7M.git C:\7M`. Sin Git: en `https://github.com/AAlejoB/NOTITAN_7M`, botón verde «Code» → «Download ZIP», descomprimir, y renombrar la carpeta que sale (se llama `NOTITAN_7M-claude-trusting-knuth-brmpsy`) a `C:\7M`. Después, en PowerShell: `cd C:\7M`. No hace falta `npm install`: el programa no tiene dependencias.
4. **Probar una vuelta.** `npm run vuelta`. Tarda unos segundos y tiene que terminar con `Feeds: 19 OK · 0 caídos` (o casi) y `Código de salida: 0`. Si las tildes o el punto del medio se ven como caracteres raros, no importa. Si PowerShell dice que no puede cargar `npm.ps1` porque la ejecución de scripts está deshabilitada, usar `npm.cmd` en vez de `npm` en todos los comandos de esta guía.
5. **Que la compu no se duerma.** Configuración → Sistema → Energía (o «Energía y batería») → Pantalla y suspensión: en «suspender» poner «Nunca» cuando está enchufada. Si es una notebook: dejarla enchufada y no cerrar la tapa (o en las opciones de energía, «Al cerrar la tapa: no hacer nada»). La pantalla sí se puede apagar.
6. **Dejarlo corriendo.** `npm run vuelta -- --cada 30`. No cerrar esa ventana de PowerShell. Cada 30 minutos escribe un resumen. Lo ideal: arrancar antes de la medianoche y cortar después de la medianoche siguiente, así queda un día calendario entero; como mínimo, 24 horas. Si la compu se apagó o la ventana se cerró, volver a correr el mismo comando: sigue con lo que ya había guardado. Si dice «Hay otra vuelta corriendo … (vuelta.lock)», esperar 25 minutos o borrar el archivo `C:\7M\datos\vuelta.lock`.
7. **Mientras corre, ver la lista.** Abrir otra ventana de PowerShell, `cd C:\7M`, `npm run ver`, y en el navegador entrar a `http://127.0.0.1:7000/`. «Traer noticias» trae lo último que armó la vuelta. Se ve solo en esa compu.
8. **Al terminar.** En la ventana de la vuelta, Ctrl+C. Después `npm run medir` y copiar todo lo que imprime. Lo que hay que mandarle al chat de Cowork: ese texto, pegado, y el archivo `C:\7M\datos\vueltas.jsonl`, adjunto. Nada de esto se sube a GitHub.
9. **Si algo falla.** Una tabla de 4 filas (qué dice, qué hacer): `node` no se reconoce → cerrar y abrir PowerShell, o reinstalar Node; no puede cargar `npm.ps1` → usar `npm.cmd`; `Feeds: 0 OK` o `Código de salida: 2` → no hay internet, revisar la conexión y volver a correr; `Código de salida: 3` → el candado del punto 6.

Poné un link a la guía en el `README.md` (ver 4b). La guía no lleva molde ni nada para Cowork: es solo para Alejo.

## Paso 4 · Capturas, documentos y cierre

### 4a · Las capturas con la lista real

`npm run vuelta` (una sola vuelta real, con `NODE_USE_ENV_PROXY=1` si hace falta, como `npm run leer`; si todavía está `datos/notas.json` de la ronda anterior, la vuelta lo usa y lo sigue acumulando). Eso deja en `datos/pagina/` la copia fresca de `index.html` con el paso 1. Después `npm run probar-pagina -- --solo-capturas datos/pagina --capturas real-2026-10-09-b` → 3 archivos nuevos en `buzon/capturas/`. Mirá a ojo la de 390: **ningún medio aparece dos veces en una misma tarjeta**. Como las noticias cambian de una vuelta a otra, no importa cuáles salgan; importa que no haya repetidos. Anotá en el reporte el resumen de pantalla de esa vuelta, tal cual.

### 4b · Documentos

- **`CLAUDE.md`, «Estado»:** un renglón nuevo, después del de la etapa 1: «**Links por medio y la medición en la compu de Alejo (2026-10-09):** en la página cada medio aparece una sola vez en la fila de links, con su primera nota (`links(t)` en `pagina/index.html`; `lista.json` y lo que se copia siguen trayendo todas las notas; valor por defecto de Cowork). `npm run ver` (`scripts/ver.js`) sirve `datos/pagina/` en `http://127.0.0.1:7000/` para verla en esa compu. **El día de medición lo corre Alejo en su compu** (decidió el 09-10): la guía es `docs/CORRER_EN_MI_COMPU.md`; al terminar manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`.» **«Siguiente paso»:** en el párrafo, reemplazá la oración «Falta dónde corre cada 30 minutos (preguntas 1 y 2 de la capa 4: Alejo con Don Julio; un cron, n8n o una computadora prendida); con eso se mide un día real con `npm run medir`.» por «El día de medición lo corre Alejo en su compu (decidió el 09-10; guía en `docs/CORRER_EN_MI_COMPU.md`) y le manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`; con eso Cowork revisa a ojo los bloques por los títulos. Dónde corre de verdad cada 30 minutos (preguntas 1 y 2 de la capa 4) sigue siendo de Alejo con Don Julio.» Lo demás del párrafo queda igual.
- **`buzon/pendientes.md`:**
  - En el ítem «Cuántas noticias da la regla de 5 en un día real», reemplazá la última oración «Falta una máquina que lo corra: espera las preguntas 1 y 2.» por «**Decidió Alejo (09-10): el día de medición lo corre él en su compu**, con la guía `docs/CORRER_EN_MI_COMPU.md`; al terminar le manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`, y Cowork revisa a ojo los bloques por los títulos (ver el ítem del bloque provisorio).» El resto del ítem queda igual.
  - En «Cowork (diseño y decisiones; antes DISEÑADOR)», un ítem nuevo, el primero: «- [ ] **El bloque provisorio falla con una internacional que los medios argentinos ponen en secciones genéricas** (medido el 09-10: el Nobel de la Paz a Navi Pillay, 7 grupos, 3 de 9 notas «parecen» internacionales, salió en Nacionales; las otras 3 confirmadas salieron bien). **Valor por defecto: no se toca**; lo arregla la IA en la etapa 2 y la página ya dice «provisorio». Parche posible si molesta en la medición: que un hecho vaya a internacional también cuando lo publican 3 o más medios de `ambito: internacional` distintos (riesgo: una nacional muy grande con cobertura de afuera iría a internacional). Mientras tanto, al revisar el día medido, Cowork mira los bloques a ojo por los títulos de `vueltas.jsonl`.»
  - En «Cowork → Claude Code»: lo que te haya quedado para la próxima carta, o «Nada pendiente por ahora. Lo que sigue: el día de medición en la compu de Alejo; después, la etapa 2 (la IA que juzga).»
  - En «Hecho», primer renglón debajo de `## Hecho`: «- [x] 09-10-2026 · **Links por medio** (Cowork, valor por defecto, variante A): en la página cada medio aparece una sola vez en la fila de links, con su primera nota; lo que se copia sigue con todos. `npm run ver` para ver `datos/pagina/` en la compu. **El día de medición lo corre Alejo en su compu** (decidió Alejo): guía `docs/CORRER_EN_MI_COMPU.md`.»
- **`README.md`:** en la lista de comandos, después de `npm run medir`, una línea para `npm run ver` («sirve datos/pagina/ en http://127.0.0.1:7000/ para ver la lista real en esa compu; --carpeta y --puerto»). Y debajo de «Requiere Node 20 o más. No tiene dependencias.», un renglón: «Para correr el día de medición en una compu con Windows: `docs/CORRER_EN_MI_COMPU.md`.»

### 4c · Cuándo está listo (comprobalo y ponelo en el reporte)

| # | Comprobación | Tiene que dar |
|---|---|---|
| C1 | `npm test` antes y después | antes 231 bien y 1 pendiente; después todos bien, al menos 5 más que antes, y sigue 1 pendiente |
| C2 | `npm run probar-pagina` (con `npm i --no-save playwright`) | 0 MAL y al menos 73 comprobaciones |
| C3 | `npm run ver` con `datos/pagina/` armada, desde otra terminal `curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://127.0.0.1:7000/` y lo mismo para `/lista.json` y para `/../package.json`; después cortalo | la línea «Viendo datos/pagina en http://127.0.0.1:7000/ (Ctrl+C para cortar)»; `200 text/html…`, `200 application/json…` y `404` |
| C4 | `npm run ver` con `--carpeta /tmp/vacia` (una carpeta sin `pagina/`) | el mensaje de 2a y código 1 |
| C5 | Las 3 capturas de 4a | 3 archivos nuevos en `buzon/capturas/`, y en la de 390 ningún medio repetido en una misma tarjeta |
| C6 | `git ls-files datos` | nada: lo real no entra al repo |
| C7 | Con el reporte ya escrito y antes de `npm run paquete`: `git add -A` y `git diff --cached --stat ac8b9a2` | solo estos archivos: `pagina/index.html`, `scripts/probar-pagina.js`, `scripts/ver.js`, `package.json`, `test/ver.test.js`, `docs/CORRER_EN_MI_COMPU.md`, `README.md`, `CLAUDE.md`, `buzon/pendientes.md`, esta carta, tu reporte y las 3 capturas (los números de líneas no importan) |
| C8 | La hora del encabezado de tu reporte | la que da `TZ=America/Argentina/Buenos_Aires date` justo antes de escribirlo; pegá esa salida en esta fila |

## Qué NO se hace en esta ronda

- Llamar a ningún modelo de IA, ni armar nada en n8n, GitHub Actions, Vercel, Supabase ni ningún servidor: dónde corre de verdad lo decide Alejo con Don Julio.
- Dejar `npm run vuelta -- --cada 30` corriendo en tu sesión: una vuelta suelta para las capturas y listo.
- Tocar la regla del bloque provisorio (`src/provisorio.js`, `config/reglas.json`): va a `pendientes.md` y nada más.
- Cambiar `src/entrega.js` ni `pagina/logica.js`: la fila de links se filtra solo al dibujar.
- Commitear nada de `datos/`, ni listas reales, ni notas de los portales. Las 3 capturas sí.

## Pasos, en orden

1. `git pull`. Guardar esta carta. Commit.
2. Paso 1 (1a, comprobaciones 1c), `npm run probar-pagina`, C2. Commit.
3. Paso 2 (2a, 2b, tests 2d), `npm test`, C3, C4. Commit.
4. Paso 3 (la guía). Commit.
5. Paso 4a (la vuelta y las capturas), C5. Commit.
6. Paso 4b (documentos), el reporte con C1 a C8 (C6 y C7 se corren en ese momento), `npm run paquete`, commit y push.
7. Tu mensaje final en el chat, como dice «El molde» de `buzon/LEEME_COWORK.md`, con dos apartados: primero uno para Alejo mismo (A QUIÉN: vos mismo; QUÉ LE PASÁS: nada; QUÉ ESPERÁS: la salida de `npm run medir` y `datos/vueltas.jsonl` después de un día entero; SE APLICA: cuando el reporte esté pusheado, siguiendo `docs/CORRER_EN_MI_COMPU.md`; A EJECUTAR: Alejo, en su compu), y después uno para Cowork con la línea de arranque de `buzon/LEEME.md` (QUÉ ESPERÁS: la revisión del reporte, del día medido y la próxima carta; SE APLICA: cuando termine el día de medición, pegando además la salida de `npm run medir` y adjuntando `datos/vueltas.jsonl`). Al final, la línea «SIGUE TRABADO» con: dónde corre de verdad cada 30 minutos, que espera a Alejo con Don Julio.
