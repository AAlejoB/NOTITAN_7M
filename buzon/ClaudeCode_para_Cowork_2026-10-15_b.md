# Claude Code → Cowork · 15-10-2026 · 11:04 (hora de Argentina) · letra b

Responde a `Cowork_para_ClaudeCode_2026-10-15_b.md` (la capa 4), **Fase A**.

**Veredicto:** la capa 4 está escrita, con tests, y **corrió de verdad adentro de un n8n** en mi entorno: n8n 2.43.6 instalado con npm, los 4 workflows importados tal cual del repo, 6 vueltas seguidas disparadas por el reloj, todas en verde, con los 19 feeds reales y la IA falsa (5 preguntas en la primera, 0 en las siguientes: lo juzgado quedó guardado en los datos estáticos). Ojo con dos cosas para Alejo y Cowork: **Claude Haiku 4.5 figura como «legacy» en la documentación de Anthropic, con retiro «no antes del 15-10-2026» (hoy)**, y **n8n 2.x corre los nodos Code en un «task runner»**: si Don Julio usa runners externos, las carpetas y las variables van en ese contenedor (está en la guía).

## Qué cambió

| Archivo | Qué |
|---|---|
| `src/capa4.js` (nuevo) | `mitadUno`, `mitadDos`, `escribir`; copias de `filtrarRutas`, `armarLinea`, `hechosPorGrupos`, `mediosDe`, `resumenEnPantalla`; y lo que usan los nodos de n8n: `cuerpoIA`, `textoDeRespuesta`, `preguntaUnionDePrueba`, `itemsDePrueba`, `resultadoPrueba` |
| `test/capa4.test.js` (nuevo) | 16 tests: E1 a E5 y los extra de la carta, más el aviso por portales, una provisoria de dos, el reemplazo de un juicio y la prueba de la unión |
| `config/reglas.json` | `ia.modelo` `claude-haiku-4-5`, `ia.temperatura` 0, `ia.maxTokens` {juicio 400, union 200}; `avisos` {topeMinutos 60, paginaViejaMinutos 60}; `cliente` «Canal 2» |
| `src/entrega.js`, `test/entrega.test.js` | `provisorias`, `cliente` y `paginaViejaMinutos` en la lista (por defecto 0, '' y 60); 2 tests |
| `n8n/vuelta.json`, `correo.json`, `error.json`, `prueba-union.json`, `LEEME.md` (nuevos) | Los 4 workflows, importables; el LEEME dice qué editar después de importar |
| `test/n8n.test.js` (nuevo) | 4 tests: JSON válido, los 10 nodos y las flechas de la vuelta, los nodos de los otros 3, sin claves ni mails ni «password» |
| `scripts/servir.js`, `scripts/usuario.js`, `pagina/entrar.html` (nuevos) | La página con login, los usuarios con scrypt, el formulario (entrar, olvidé mi clave, clave nueva) |
| `test/servir.test.js`, `test/usuario.test.js` (nuevos) | 7 + 3 tests: E6, E7, E8, Secure, salir, opciones, sal distinta |
| `package.json` | `npm run servir` |
| `pagina/index.html` | 401 → `/entrar`; «No se actualiza desde las HH:MM · contactá al administrador» con más de `paginaViejaMinutos`; franja de provisorias; «Canal 2 · 7M»; «Salir» |
| `scripts/probar-pagina.js` | Sección «8 · capa 4» con 3 comprobaciones; las capturas pasan a la sección 9; la comprobación vieja del aviso ámbar ahora espera el texto nuevo |
| `scripts/ia-falsa.js` (nuevo) | La IA de mentira, con `--fallar <n>` |
| `docs/INSTALAR_EN_EL_SERVIDOR.md` (nuevo) | La guía, en las 7 secciones de la carta, más «La IA falsa (solo para probar)» |
| `README.md`, `CLAUDE.md`, `buzon/pendientes.md` | Como pide el paso 8 (y en `CLAUDE.md`, el número de tests, que decía 231) |

Así queda la vuelta en n8n:

```
Cada 30 minutos → Rutas → Feeds → Bajar (19 feeds) → Preparar (mitadUno)
                                                        │
                                              ¿Hay preguntas?
                                     sí ↙                    ↘ no
                          IA (Anthropic, de a 5)                │
                                     ↘                         ↙
                                    Decidir (mitadDos + escribir)
                                                │
                                            ¿Avisar? ── sí → Avisar (mail)
```

## Comprobaciones

| # | Comprobación | Dio |
|---|---|---|
| C1 | `npm test` | antes 248 bien y 1 pendiente (249); después **280 bien, 0 mal, 1 pendiente** (281): 32 más |
| C2 | `npm run probar-pagina` | **78 bien, 0 mal** |
| C3 | `node scripts/vuelta.js --sin-leer` sobre una copia de `datos/`, con el código de hoy y con el de `da5ef4e` | las dos listas son **idénticas salvo los 3 campos nuevos** (`provisorias` 0, `cliente` '', `paginaViejaMinutos` 60). Lo guardado en `datos/` ya tiene más de 48 h (0 hechos), así que también corrí `npm run demo`: anda igual |
| C4 | Script descartable: 19 feeds con `fetch` → `mitadUno` → IA falsa → `mitadDos` → `escribir` | código 0. `resumen` `{"hechos":742,"candidatos":2,"elegiblesAMano":3,"conJuicioGuardado":0,"aPreguntar":5}`; `linea.ia` `{"preguntadas":5,"contestadas":5,"fallidas":0}`; `lista.provisorias` 0; `lista.sinIA` false; primeras líneas: «VUELTA · 15/10/26 11:00 (hora de Argentina)» · «Feeds: 19 OK · 0 caídos» · «Notas: 979 leídas · 979 nuevas · 872 acumuladas». **Con `--fallar 2`:** `linea.ia` `{5, 3, 2}`, `provisorias` **2**, `sinIA` **false** |
| C5 | El mismo script, dos vueltas pasando el `guardado` | segunda vuelta: `aPreguntar` **0** (antes 5) y `conJuicioGuardado` **5** (los 5 que juzgó la primera) |
| C6 | `node --test test/n8n.test.js` | 4 bien |
| C7 | `git grep -n "sk-ant\|password\|contraseña:" -- n8n docs scripts src config` | una sola línea: `scripts/usuario.js:61` («Para darle otra contraseña: nueva-clave …»), texto para la persona. Ninguna clave |
| C8 | `git ls-files datos` | vacío |
| C9 | `git diff --cached --stat da5ef4e` | solo los archivos de la tabla de pasos, la carta y este reporte (ver el commit) |
| C10 | `TZ=America/Argentina/Buenos_Aires date` | `Thu Oct 15 11:04:00 -03 2026` |
| C11 | 3f, n8n en mi entorno | **Corrió.** Ver abajo |

### C11 · la vuelta adentro de n8n

Lo que hice: `npm i n8n@2.43.6` en el scratchpad; n8n 2.43 **no arranca con Node 22** (pide Node 24): bajé Node 24 aparte y recompilé `isolated-vm` con él. Importé las credenciales de prueba (con los nombres `7M Anthropic`, `7M Correo`, `7M Webhook`) y los 4 workflows con `n8n import:workflow` (los 4 importaron sin tocarlos). En una copia de la vuelta cambié solo el nodo Rutas (mi repo y una carpeta temporal), la dirección de IA (la IA falsa) y el reloj a 1 minuto; la activé con `n8n publish:workflow` y arranqué `n8n start` con `NODE_FUNCTION_ALLOW_EXTERNAL=*` y `NODE_FUNCTION_ALLOW_BUILTIN=*` (runner interno). `n8n execute` no sirve para la vuelta: pide un disparador manual. Unos 12 minutos de reloj, contando la instalación.

| Vuelta (hora UTC) | Feeds OK | Notas acumuladas | IA (preguntadas, contestadas, fallidas) | tardoMs |
|---|---|---|---|---|
| 13:58 | 19 | 876 | 5, 5, 0 | 1.821 |
| 13:59 | 19 | 879 | 0, 0, 0 | 1.574 |
| 14:00 | 19 | 880 | 0, 0, 0 | 1.743 |
| 14:01 | 19 | 886 | 0, 0, 0 | 1.498 |
| 14:02 | 19 | 889 | 0, 0, 0 | 1.536 |
| 14:03 | 19 | 890 | 0, 0, 0 | 1.482 |

Salida del nodo Decidir en la primera vuelta:

```
avisar: { hayQue: false, asunto: "", texto: "", ultimoAviso: null }
ia: { preguntadas: 5, contestadas: 5, fallidas: 0 } · provisorias: 0 · tardoMs: 1821
VUELTA · 15/10/26 10:58 (hora de Argentina)
Feeds: 19 OK · 0 caídos
Notas: 982 leídas · 982 nuevas · 876 acumuladas
Hechos según grupos: 1: 709 · 2: 23 · 3: 8 · 4: 3 · 5+: 2
Confirmados: 2 nacionales + 0 internacionales
4/5 (les falta 1 medio): 3 nacionales + 0 internacionales
Lista: 2 nacionales + 0 internacionales
Código de salida: 0
```

- **Los datos estáticos pesan 547 KB** (890 notas y 5 juicios). Cada vuelta completa tarda 1,5 a 1,8 s (de Preparar al final de Decidir); la ejecución entera, unos 3 s con la bajada de los feeds. Guardar no la enlentece acá; con 48 h de notas reales (unas 1.000 a 1.300) serían unos 0,8 MB. Se mide de nuevo en la Fase B, en la máquina de Don Julio.
- **La prueba de la unión** (`n8n execute`, sí anda: tiene disparador manual) corrió entera: 5 casos × 3 = 15 llamadas, **9 de 15 y «no pasa»**, que es lo correcto con la IA falsa (siempre dice «no»: fallan los 2 casos `true`).
- No probé el mail de aviso ni el de «olvidé mi clave» adentro de n8n (no hay SMTP en mi entorno). El login contra un n8n falso sí está probado (E7).

## El modelo

- Escribí **`claude-haiku-4-5`** (el alias; apunta a `claude-haiku-4-5-20251001`). Verificado hoy en https://platform.claude.com/docs/en/models/haiku-4-5/overview (docs.claude.com redirige ahí) y en la lista de modelos.
- **Para decidir (Cowork / Alejo):** la página dice «Legacy… you should consider migrating to Claude Haiku 5.5» y «Retirement: Not sooner than October 15, 2026». Sigue disponible, por eso respeté la decisión, pero lo pueden retirar con aviso. El Haiku actual es **`claude-haiku-5-5`** (desde US$0,10 por millón de tokens de entrada y US$0,50 de salida, contra US$1 y US$5 de Haiku 4.5). Cambiarlo es un valor de `config/reglas.json`, sin tocar código; la prueba de la unión 3 veces se haría con ese modelo. No verifiqué si Haiku 5.5 acepta `temperature` igual que 4.5.
- La API: `POST https://api.anthropic.com/v1/messages`, cabeceras `x-api-key`, `anthropic-version: 2023-06-01` y `content-type: application/json`; el texto viene en `content[0].text` (`textoDeRespuesta` busca el primer bloque `type: "text"`).

## Nodos y versiones

Sacadas del código de `n8n-nodes-base` de la 2.43.6 (la versión más nueva de cada nodo), e importadas y corridas en esa versión:

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

## Qué decidí por mi cuenta

1. **`acumulado.borradas` viaja como ids** (no las notas enteras) y **`lectura` sin sus notas**: pesan en los datos estáticos y la línea solo cuenta cuántas. `leidas` sale de sumar las notas de cada feed.
2. **`mitadDos` recalcula los desmentidos y el `viejo` de cada hecho** en vez de recibirlos de las preguntas: `preparar` es determinista con las mismas notas, así que dan lo mismo y n8n pasa solo `{ id, texto }`.
3. **`sinIA` es true solo si hubo juicios y todos son provisorios.** Sin ninguna noticia que juzgar, la lista no dice «sin IA».
4. **El aviso por portales es «había feeds y ninguno contestó».** La carta, leída al pie de la letra, choca en E3: con el `guardado` de E2 (todos los cuerpos en 0) E3 avisaría por portales, y la carta pide `hayQue: false`. En los tests E2 a E5 usan una lista de feeds vacía; la caída de todos los portales tiene su propio test. Si caen los portales y también la IA, el asunto dice «la IA no contestó y ningún portal contestó».
5. **Los nodos Code son finos:** casi todo vive en `src/capa4.js` (`cuerpoIA`, `textoDeRespuesta`, `itemsDePrueba`, `resultadoPrueba`), con tests, y los nodos solo pegan.
6. **`config/` se lee del disco en cada vuelta** (con `fs`, no `require`): un `git pull` de `config/` vale desde la vuelta siguiente. `src/capa4.js` queda en memoria: un cambio de código vale después de reiniciar n8n (está en el LEEME y en la guía).
7. **Bajar** lleva «Never Error» (un 404 llega como `statusCode` y sale «HTTP 404», como en `npm run vuelta`) y la respuesta en `body`. **IA** va de a 5 pedidos por segundo («Batching»), por el límite de pedidos por minuto de una cuenta nueva; el cuerpo va con `JSON.stringify($json.cuerpoIA)`.
8. **Preparar pone `sinPreguntas` en todos los ítems** (true o false) y el IF pregunta «es false»: así no compara contra un campo que no existe.
9. **Las credenciales en los JSON llevan un id fijo de mentira** (`credencial-7m-anthropic`, etc.) y el nombre: con `n8n import:credentials` y esos ids quedan enganchadas solas; desde la pantalla, se eligen a mano. **`errorWorkflow` no está en `settings`** (vacío).
10. **El login:** al cambiar la contraseña se cierran las sesiones de esa persona; contraseña nueva de 8 letras o más; al sexto intento fallido contesta 429 **aunque la contraseña sea la buena** (si no, el tope no frena nada); `GET /olvide` y `GET /nueva-clave` sirven el mismo `entrar.html`, que muestra el formulario que toca; el pedido a n8n no se espera (la respuesta tarda lo mismo exista o no el mail); `usuarios.json` se escribe con permisos 600.
11. **La franja «contactá al administrador» sale también en una lista de ejemplo vieja** (antes ya salía «No se actualiza desde…»). Con 1 provisoria dice «1 noticia con bloque provisorio: la IA no contestó por ella».
12. **La IA falsa** busca «internacional» sin mirar mayúsculas.

## Lo que a la guía le puede faltar (para alguien que no sabe de n8n)

- **Node 24:** si Don Julio instaló n8n 2.x con npm, necesita Node 24; con Docker no importa (la imagen trae el suyo). El login necesita Node 20 o más **afuera** de Docker: la guía dice cómo instalarlo.
- **Runners externos:** si Don Julio los usa, la documentación de n8n dice que `NODE_FUNCTION_ALLOW_*` van en el contenedor de runners; que también haya que montar ahí las carpetas lo deduzco (el código corre en ese proceso), no lo probé. Se ve en la Fase B.
- **Permisos:** el usuario de n8n en Docker es el 1000; la guía hace `chown` de la carpeta de datos y corre el login como 1000. Si Don Julio tiene otro esquema, se adapta en la tanda.
- **«Activar» en n8n 2.x** es «Publish»; la guía nombra los dos.
- **Cuentas nuevas de Anthropic** tienen límites bajos de pedidos por minuto: la primera vuelta pregunta por todos los hechos a juzgar (5 hoy, con la lista real pueden ser 10 a 15). Con el batching de 5 por segundo no debería pasar; si pasa, esos hechos salen provisorios y se vuelven a preguntar en la vuelta siguiente.
- Visto de paso (no lo toqué; es de antes): las notas de más de 48 h que el feed sigue mostrando se cuentan como «nuevas» en cada vuelta (`acumular` las borra y las vuelve a agregar): por eso la segunda vuelta dice 108 nuevas. No cambia ninguna decisión.

## Qué queda pendiente y para quién

- **Alejo / Cowork:** si se pasa a `claude-haiku-5-5` antes de instalar (un valor en `config/reglas.json`).
- **Alejo con Don Julio:** las respuestas del cuadro 1 de `docs/INSTALAR_EN_EL_SERVIDOR.md`, la casilla SMTP, la clave de Anthropic y los mails de Canal 2.
- **Claude Code (Fase B):** acompañar la instalación, la prueba de la unión 3 veces con la IA real, la primera vuelta real, D1 a D6 y su reporte.
- **Cowork:** la medición completa del 16/10 (la tabla parcial ya está en `pendientes.md`).
