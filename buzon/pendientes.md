# Pendientes

# Cowork → pendientes · 14-10-2026 · 23:30 (hora de Argentina) · las 14 respuestas de Don Julio

No es una carta de cambios. Don Julio contestó las 14 preguntas de la capa 4 por WhatsApp (la colección «respuestas» de la página quedó vacía). Alejo las cruzó con Cowork una por una. Regla que puso Alejo para leerlas: lo que sienta bases (dónde corre, dónde se guarda, dónde vive la página, cómo se entra, quién paga, el orden) va como lo dijo Don Julio; lo interno lo acomoda Cowork. Esta sección es la base de la carta de la capa 4, que se escribe después de la medición y ANTES que la carta de la página C.

## Decidió Alejo (14-10-2026, 22:45 a 23:28)

1. Todo corre en el servidor de Don Julio: su n8n ya instalado, accesible desde internet (pregunta 1, opción B). Se cae n8n Cloud y los €20 por mes.
2. El código entra por carpeta en ese servidor y n8n lo lee del disco (pregunta 2, opción B); hace falta habilitar NODE_FUNCTION_ALLOW_EXTERNAL (con Docker, montar la carpeta en el contenedor). Un cambio es un git pull. Don Julio no entendió la pregunta (la leyó como «dónde se guardan los datos»); en el WhatsApp se le vuelve a explicar.
3. Los feeds los baja n8n y nuestro código los interpreta (pregunta 3, opción A, como estaba).
4. Lo acumulado, lo juzgado por la IA y la última lista se guardan adentro de n8n si no lo enlentece; plan B, una base de datos en el mismo Linux (pregunta 4, opción A). Supabase sale de la lista. Dato para la carta: hoy ya anda con archivos (datos/) en la compu de Alejo; se nombra, no se propone.
5. La página vive en el mismo servidor que n8n (pregunta 5, opción B; Alejo eligió el mismo servidor y no InMotion). Nada que subir: la lista se escribe en la carpeta que sirve el servidor web.
6. Se entra con mail y contraseña, con «olvidé mi clave» por mail (pregunta 6, opción C). Una sola empresa al principio. El login lo arma Claude Code (pieza chica en Node, sin librerías, en el mismo servidor); a Don Julio se le pide solo una casilla de correo para mandar esos mails.
7. La IA la pagan Alejo y Don Julio con su propia cuenta y el cliente paga un cargo mensual (pregunta 7). El proveedor no cambia: Claude Haiku 4.5. Los planes de servicio (cuántas por día, qué temas, Normal o Plus) son negocio de Alejo y Don Julio y se arman con las perillas que ya existen en config/; para el motor no cambia nada: sigue mirando los portales cada 30 minutos y la página muestra siempre lo último.
8. Cómo avisa si falla: como estaba (pregunta 9, opción C) más lo que sumó Don Julio: la página dice «contactá al administrador» y el aviso llega con el detalle del error. Destinatarios: Alejo y Don Julio.
9. Pruebas contra lo real: un solo workflow hasta que esté fino; después dos, real y pruebas, y lo que anda se clona al real (pregunta 10, termina en A).
10. Primer cliente: Canal 2 (pregunta 11). Canal 2 o Don Julio paga el desarrollo a medida; terminado (versión 1.0), paga un valor mensual con precio preferencial por primer cliente; los demás, otro precio.
11. Orden (pregunta 12): capa 4 primero (poner lo de hoy en el servidor de Julio y conectar la IA), página C después, pieza 2 al final. Da vuelta el orden escrito en la sección de las 22:30.
12. Repo: sigue público (pregunta 13). A Don Julio no le molesta mientras sea seguro.
13. Una sola empresa ahora (pregunta 14); multi-empresa después, por clonado o por licencia por empresa.
14. Las analogías de Alejo y Cowork (anillos, linterna, cono) son solo para entenderse entre ellos: en cartas a Claude Code y mensajes a Don Julio van con nombre real (bloque regional, filtro por tema, portales locales).

## Valores por defecto de Cowork (no son decisiones de Alejo; se cambian)

- Recursos del servidor: con el mínimo de n8n (1 vCPU, 2 GB de RAM) alcanza; 2 vCPU y 4 GB si el equipo comparte; 10 GB libres de disco sobran. 7M hace 48 vueltas por día de menos de 1 segundo y guarda ~0,5 MB.
- Acceso: la gente de Canal 2 entra a la página, nunca a n8n. A n8n entran Alejo y Don Julio; Claude Code necesita un usuario de n8n o SSH para dejar el código.
- Con login, las decisiones de la página C (me interesa, no por hoy con motivo, archivo, «no la vi») pasan a guardarse en el servidor por persona, en vez de localStorage. Esto destraba dos pendientes: «que las personas del mismo canal vean lo que se llevó cada una» y «dónde viajan los motivos de No por hoy».
- Aviso de falla por mail, con la misma casilla que usa el login; tope 1 mail por hora. La página agrega «contactá al administrador» si la última vuelta tiene más de 1 hora.
- El workflow de pruebas escribe en otra carpeta y otra página, nunca en lo que ve Canal 2.
- La prueba de la unión (pregunta 8) la escribe Claude Code como workflow aparte en el n8n de Don Julio, con la misma configuración que lo real; temperatura y tope de tokens los fija Claude Code en la carta. Don Julio no la entendió y no hace falta que la entienda: es interna.
- Seguridad en el servidor: en el repo nunca hay claves ni texto de los portales; la clave de la IA y la casilla de correo viven en las credenciales de n8n y en un archivo de configuración del servidor que no se sube. Como el repo es público, el servidor lo baja con git clone sin permisos.
- Regla para Claude Code: todo lo que es de un cliente vive en config/ (cupo, temas, escalón, usuarios). Así clonar para otra empresa es copiar una carpeta.

## Abierto (sin resolver, con valor por defecto mientras tanto)

- Datos del servidor de Don Julio que faltan para la carta: versión de n8n, si corre con Docker o npm (por el cambio de la 3.0), y cómo se entra (SSH o lo sube él). Se piden en el WhatsApp. Mientras tanto: se asume Docker. **Están en el cuadro 1 de `docs/INSTALAR_EN_EL_SERVIDOR.md`.**
- Canal 2: cuántas personas lo usan y si entran desde el celular o la compu. Entra en el login (usuarios) y en la página C (versión ancha si es compu). Mientras tanto: 3 personas, celular.
- Cuántas horas por semana tiene Don Julio. Mientras tanto: sin plazo.
- Cuánto esperar a un feed lento antes de seguir sin él. Mientras tanto: lo que ya hace el lector.
- Precios de los planes y del mensual de Canal 2: de Alejo y Don Julio.
- Nombre del producto: sigue 7M hasta que Alejo decida.

## Qué viene después

1. Alejo manda el WhatsApp a Don Julio (o lo charla en persona) y pega acá las respuestas a lo abierto.
2. Al terminar la medición (16/10 después de las 00:30), Alejo manda a Cowork, de su compu, cinco cosas: la salida de `npm run medir` (nacional), `datos/vueltas.jsonl`, la salida de `npm run medir -- --carpeta datos/comodoro`, `datos/comodoro/vueltas.jsonl` y `datos/comodoro/notas.json` (este último para ver de qué notas se arma cada hecho local; es una foto, no se sube al repo). Cowork revisa a ojo las dos.
3. Cowork escribe la carta de la capa 4 (etapas 1 y 2 en el servidor de Don Julio: vuelta cada 30 minutos, IA que juzga, página de hoy con login, aviso por mail). Después, la carta de la página C.
4. Lo local (reporte ClaudeCode_para_Cowork_2026-10-14_a.md), decidió Alejo el 14-10 a las 23:51: cuando termine la medición (16/10), Cowork escribe una carta chica aparte para Claude Code: sumar al lector la lectura de sitemaps de noticias (título, link y fecha, sin bajada; la página lo dice cuando falta la bajada) y correr desde el entorno de Claude Code un día de medición local con los 3 feeds de Comodoro (ADNSUR, El Comodorense, Crónica sin «energía») más los sitemaps de El Patagónico y El Chubut, para saber cuántas locales llegan a 2 medios por día. Va en paralelo con la carta de la capa 4 y antes de la carta de los anillos, que así se escribe con datos. Correcciones a la lista de candidatos: El Patagónico es de Comodoro (local, no provincial) y La Opinión Austral es de Santa Cruz (cuenta para la Región). ADNSUR y Crónica no traen autor (no sirven para la vía B); El Comodorense sí. **Adelantado el 15-10 (decidió Alejo a las 00:15):** carta `Cowork_para_ClaudeCode_2026-10-15_a.md`, Fase A hecha; la Fase B se pide 24 h después del arranque.

# Cowork → pendientes · 14-10-2026 · 22:30 (hora de Argentina) · el después (audio de Don Julio)

No es una carta de cambios. La medición sigue corriendo en la compu de Alejo hasta el 16/10 después de las 00:30; hasta entonces no se toca la página ni se escribe carta para Claude Code. Esta sección se guarda en buzon/pendientes.md tal cual, arriba de la de las 20:15, y las dos juntas son la base de las cartas de la página nueva.

Dibujo de todo esto (artifact privado de Alejo): https://claude.ai/artifact/LmLyF2NgRYmv73sA5qgkUZ («El después de una noticia»). El tablero «La vida de una noticia» sigue siendo https://claude.ai/artifact/4U1sirot5pTVdMp2jJB6qd y la Opción C https://claude.ai/artifact/477KpBW4ZuXPAPuR8eDv6G.

## Lo que dijo Don Julio (audio del 14-10, transcripto por Alejo)

- La pieza 1 le alcanza tal como está: «con que encuentre la noticia, la compruebe contra los sitios importantes, descarte lo que no va y diga: esta noticia es real, comprobada contra estos medios, listo, con eso ya está».
- El después: tener el texto completo («me imagino que baja el artículo»), pedirle a la IA «re-redactame este texto con otras palabras y en otro orden, y re-redactame un título». De ahí sale una re-redacción «de X cantidad de líneas» con otro título.
- «El mismo título se puede usar para el Facebook un poquito más ampliado, y el mismo título con otro texto para Instagram; para el resto lo vamos reutilizando».
- «En la próxima búsqueda, si encontré una misma noticia, ya fue, no va. Buscate otras, más actuales».
- «El resto es que una IA haga algo y no haga cagada, pero eso se ve después».
- No nombró fotos ni voz.

## Decidió Alejo (14-10-2026, entre las 21:52 y las 22:23)

1. **«Ya fue» = lo que tocaste.** Nada se va de Por decidir por haberla mirado; se va cuando se toca un botón, y siempre con «Deshacer» unos segundos y «Volver» en cada pestaña. Lo que todavía no pasó por el pivote se queda hasta caerse a las 24 h. La marca «visto / no visto» no existe.
2. **Una página, dos escalones.** Normal y Plus en la misma página, elegido por cliente en config/ (campo `escalon`, valores `normal` o `plus`), cambiable después sin tocar código; más adelante, un botón en la página. Igual en los dos: una tarjeta abierta arriba (pivote), sube sola la siguiente, Deshacer, Volver, ningún menú. **Normal:** dos botones, «Me interesa» y «Siguiente» («Siguiente» es «no por hoy» sin preguntar el motivo); pestañas Por decidir / Me interesa / Pasadas; sin motivo, sin Archivo, sin Combinar, sin temas. **Plus:** todo lo de la Opción C (tres botones, motivo, Archivo, Combinar cuando hay una parecida, temas). Esto refina el punto 2 de la sección de las 20:15, no lo reemplaza: la Opción C es el escalón Plus.
3. **Botones con palabras cortas:** «Traer noticias» pasa a «↻ Actualizar» (valor por defecto de Cowork; se cierra con los colores).
4. **Pieza 2, títulos: un título para todo** (opción A). Corto y con gancho, hasta 60 letras, el mismo para Instagram, Facebook y el portal. Se descartó un título por red (B) porque la IA tiene tres chances de errarle. La variante corta derivada del título (C, dibujada con «↳») se agrega solo si Instagram la pide, nunca de entrada. Destinos por ahora: Instagram, Facebook y el portal. La voz y lo demás, después.
5. **«Armar» vive en la misma página.** En Me interesa, cada noticia tiene un botón «Armar»; lo que devuelve la IA (la bandeja) se abre debajo de la misma tarjeta, pieza por pieza, con un «Copiar» por pieza. «Copiar todo» sigue existiendo para quien no arma. La comodidad de la persona se revisa cuando se diseñe la pantalla.
6. **La puerta: la IA lee el artículo completo.** Al tocar «Armar», el sistema baja el cuerpo de hasta 3 notas de los medios que confirmaron la noticia. Si un portal bloquea, sigue con el siguiente de la lista; con 0 cuerpos, la IA escribe con títulos y bajadas y la bandeja lo dice. Reglas: el texto original nunca se muestra ni se copia, solo lo re-escrito; lo bajado se guarda 48 h como todo lo demás y después se borra; las fuentes van siempre al pie.
7. **Plan B por casillero**, con una regla: cuando entra el plan B, la página lo dice, nunca se queda muda. Los casilleros de hoy ya lo tienen (feed roto, 4/5 a mano, sin IA → provisorio, Deshacer/Volver). Los dos nuevos son los de la pieza 2 (punto 6 y valores por defecto).
8. **Largos, como valor límite:** título hasta 60 letras; portal (texto base) 8 a 12 líneas (~150 palabras); Facebook 10 a 15 líneas (~200 palabras); Instagram 4 a 6 líneas (~70 palabras); fuentes 1 renglón, siempre. Una línea son unas 15 palabras en el celular. Se cambian por cliente en config/, como el escalón.
9. **Crédito a los medios:** cada pieza que escribe la IA termina con «Fuentes: …» y sus links, sin opción de sacarlo. La pieza 1 ya copia los links de todos los medios.
10. **Estándar de dibujo y de página:** la flechita «↳» corrida a la derecha quiere decir «de ahí sale» (un derivado).

## Valores por defecto de Cowork (no son decisiones de Alejo; se cambian)

- Entra al quinchito una noticia por vez, la que la persona toca; no todas las de Me interesa juntas.
- El canal de Don Julio arranca en Plus; «normal» queda para quien diga «es mucho bardo».
- Si la IA no contesta o contesta cualquier cosa (sin título, sin fuentes, o texto fuera de largo), se reintenta 1 vez; si falla, «No pude armarla, probá de nuevo» y la tarjeta queda como estaba. Nunca sale una pieza sin título o sin fuentes.
- La bandeja dice con cuántas notas se escribió («escrita con 2 de 3 notas»).
- Sin hashtags ni emojis, salvo que el cliente lo pida.
- Quién publica: la persona copia y pega, como hoy. Que el sistema publique solo no se diseña.
- La pieza 2 usa la misma IA de la etapa 2 (la que juzga), en el mismo lugar donde corra (n8n, capa 4). Por eso va después de la etapa 2, nunca antes.

## Abierto (sin resolver, con valor por defecto mientras tanto)

- **Fotos:** Don Julio no las nombró; Alejo sí. Sigue como ítem de «Más adelante» (derechos de las imágenes). Mientras tanto: la pieza 2 sale sin fotos.
- **Cómo se baja el cuerpo de cada portal:** cada uno arma su página distinto y alguno bloquea. Trabajo para Claude Code después de la medición: probar con los 19 portales de la lista qué cuerpo se puede sacar y anotar los que bloquean. Mientras tanto: nada.
- **Costo de IA por armado:** medir cuántas palabras entran (3 cuerpos) y salen (3 textos) y cuánto cuesta cada «Armar» con el modelo de la capa 4. Mientras tanto: la cuenta de la capa 4 (US$1 a 5 por mes) no lo incluye.
- Respuestas de Don Julio: llegaron el 14-10 por WhatsApp; ver la sección de las 23:30.
- **Un solo artifact con todo, paso a paso** (idea de Alejo, 22:23): al final, juntar tablero, Opción C y «El después» en un solo lugar para mostrar a clientes. Se hace cuando la página nueva esté decidida del todo, no antes.

## Qué cambia respecto de lo ya anotado

- El ítem «Más adelante · la visión a largo plazo» (pieza 2) ahora tiene diseño: puntos 4 a 9 de arriba. La pieza 3 (voz) sigue sin diseñar.
- En Normal no hay motivo de «No por hoy»: los seis chips de motivo son solo del escalón Plus.
- «Traer noticias» (decidido el 04-10) pasa a «↻ Actualizar».

## Qué viene después

1. Al terminar la medición, lo mismo que decía la sección de las 20:15: Alejo manda la salida de npm run medir y datos/vueltas.jsonl; Cowork revisa a ojo.
2. Carta de la página C, en este orden: flujo (con el escalón Normal/Plus), temas, anillos.
3. La pieza 2 (quinchito) va en una carta aparte, después de la etapa 2 (la IA que juzga), con la prueba de bajar cuerpos de los 19 portales adelante de todo.

# Cowork → pendientes · 14-10-2026 · 20:15 (hora de Argentina) · charla de diseño

No es una carta de cambios. La medición corre en la compu de Alejo desde el 14/10 a las 14:15 y se corta el 16/10 después de las 00:30. Hasta entonces no se toca la página ni se escribe carta para Claude Code. Esto se guarda en buzon/pendientes.md tal cual, para que después de la medición se convierta en la carta de la página nueva.

Dibujo de todo esto (artifact privado de Alejo, él lo tiene): https://claude.ai/artifact/477KpBW4ZuXPAPuR8eDv6G

## Decidió Alejo (14-10-2026)

1. Flujo por noticia: primero mirar, después decidir con tres botones (me interesa / no por hoy diciendo el motivo / archivar), y recién al final copiar, solo lo que le interesa. Copiar deja de ser el paso principal.
2. La página es la Opción C: cuatro pestañas con número (Por decidir, Me interesa, Archivo, No por hoy). En Por decidir hay una sola tarjeta abierta, siempre arriba, en un lugar fijo (pivote), con sello de medios, hora, título, bajada, un link por medio y los tres botones grandes. Las demás son renglones de un título con la cantidad de medios. Al decidir la abierta, se va a su pestaña y sube sola la siguiente; tocar un renglón lo sube al pivote. Los bloques siguen como títulos en la lista y en el avance («1 de 5 · Nacionales»). La pastilla «Nueva» desaparece: lo nuevo es lo que está en Por decidir.
3. Combinar dos noticias: la página combina, pero solo noticias del mismo tema (nunca cualquier cosa con cualquier cosa). La página propone y la persona decide: acepta, corrige el texto o las deja separadas. La última palabra es siempre de quien publica.
4. Temas: el motor NO descarta ninguna noticia por su tema; si está verificada, pasó. Esto cambia el valor por defecto de hoy en ia de config/reglas.json (farandula: no dejaba afuera la farándula): la IA no bloquea por tema. Los temas son un filtro en la página, con botones que se prenden y apagan; cómo arranca cada botón se fija por cliente en config/; la persona los cambia en la página cuando quiere. Lo apagado se oculta pero se cuenta («2 ocultas por tema · ver») y nunca se pierde. Sin buscador por ahora.
5. Anillos: la noticia vive en anillos, del más chico al más grande, y son 5: Local (ciudad) → Provincial (Chubut) → Región (Patagonia) → Nacional → Internacional. «Región» es la palabra. Cada anillo es un bloque con su propio número de medios para confirmar, su propia lista de portales que cuentan y su propio cupo. El «5» de hoy es el número del anillo nacional y del internacional, no una regla general. La Región va prendida desde el principio, no después. Portales locales a sumar: Comodoro Rivadavia, Caleta Olivia, Chubut.
6. Región, qué cuenta y cuánto hace falta: en la lista blanca entran solo 2 portales por provincia de la región (Neuquén, Río Negro, Santa Cruz, Tierra del Fuego) más los que ya tenga Chubut. Una noticia es regional cuando la cubren 2 medios de 2 provincias distintas; Chubut cuenta como una provincia más (un portal de Trelew y uno de Neuquén la hacen regional; tres portales de Chubut no). Cupo 3. La etiqueta dice «Confirmada por 2 medios de 2 provincias».
7. El apartado humano «Falta una noticia»: abajo de Por decidir hay un renglón para escribir la noticia que la persona vio en otro lado y acá no está. El sistema contesta siempre, con su motivo. Es el campo «qué noticia importante vi en otro lado y acá no estaba» de la planilla de medición, puesto en la página.
8. El norte del proyecto (no cambia nada ahora): tocar el botón, ver la noticia ya verificada, y que el paso siguiente sea título para Instagram, título para Facebook y dos o tres fotos para elegir. La página C es el primer escalón de ese agente: hoy decide qué noticia; el armado viene después, sobre lo ya elegido.
9. Una noticia que la persona ya decidió y después sube a confirmada (una 4/5 que llega a 5 medios): «la mezcla» (decidió Alejo el 14-10-2026 a las 21:00, con el tablero «La vida de una noticia», artifact privado https://claude.ai/artifact/4U1sirot5pTVdMp2jJB6qd). Lo que manda es por qué la sacó, no que llegó a 5. Si estaba en Archivo: vuelve sola a Por decidir, arriba, con el sello verde y una línea adentro de la tarjeta «Subió a confirmada. A las HH:MM la habías archivado». Si estaba en No por hoy: se queda ahí con su motivo, el sello pasa de 4/5 naranja a verde, y Por decidir muestra abajo una línea contable como la de los temas ocultos: «1 que mandaste a No por hoy subió a confirmada · ver». Si estaba en Me interesa (elegida a mano): sigue ahí y el sello naranja pasa a verde «Confirmada por N medios». Reemplaza a la pastilla «Recién confirmada» de la página de hoy. Anotado por Cowork para después de la medición (no son decisiones): sumar un molde de nota de servicio para «Horarios y cómo ver los Martín Fierro»; el caso «obispos y el Papa» lo resuelve la etapa 4 (unión de hechos partidos) antes de llegar a la página.

## Valores por defecto de Cowork (no son decisiones de Alejo; se cambian)

- Los motivos de «No por hoy» son seis chips fijos, sacados de la planilla de medición de Alejo: no es noticia · repetida · va en el otro bloque · vieja · no me interesa el tema · otro (abre un renglón para escribir). Un toque en un motivo alcanza, sin botón «Listo». Los motivos aparecen adentro de la misma tarjeta, sin ventana aparte, con «Volver». Al decidir aparece unos segundos «Mandada a No por hoy · Deshacer».
- Las decisiones (me interesa, no por hoy con su motivo, archivada) viven en el navegador de cada persona, como las marcas de hoy (localStorage), y se borran solas cuando la noticia se cae de la lista (24 h).
- La 4/5 («en observación») pasa por los mismos tres botones; «Me interesa» ahí equivale a «la elijo a mano» y sale con el sello naranja de hoy. Desaparece el menú «Llevármela igual».
- Pestaña Me interesa: lo que se va a llevar, con «Sacar» en cada una. «Copiar» se lleva todo lo de esa pestaña, sin tildes. Lo copiado baja a «Llevadas hoy», apagado y con la hora, como hoy.
- Pestaña Archivo: tarjetas cortas con la hora en que se archivó y dos botones: «Me interesa» (va directo a llevar) y «Volver» (a Por decidir).
- Pestaña No por hoy: renglones con el motivo en una pastilla gris y «Volver».
- Combinar: cuando llega una noticia parecida a una archivada, la abierta muestra el aviso «Parecida a una que archivaste a las HH:MM: «título»» y un botón más, «Combinar con la archivada». La propuesta combinada la escribe la IA: un título y una bajada con las dos, y los links de ambas; abajo dice de qué dos noticias sale. Tres botones: «Me interesa así», «Corregir el texto», «Dejarlas separadas». Mientras no haya IA (etapa 2), el botón dice «Llevar juntas» y las dos van a Me interesa tal cual, una debajo de la otra. «Parecida» se detecta con lo que ya hay (paresParaUnir en src/ia.js: persona o lugar en común), sin llamar a ningún modelo.
- Temas: seis, cada noticia lleva uno solo como pastilla gris: Política · Economía · Sociedad · Policiales · Deportes · Espectáculos. Internacional no es un tema, es el bloque. Mientras no haya IA, el tema sale de la sección del portal donde salió la nota (seccion, que el lector ya guarda); si ninguna nota del hecho trae sección, va «Sin tema» y se muestra siempre. Con la IA, lo pone ella (clasificarHecho).
- Anillos, números: Local cuenta solo los portales locales de la lista, 2 medios para confirmar, cupo 3. Chubut cuenta los provinciales y los locales, 3 para confirmar, cupo 3. Región como dice el punto 6. Nacional e Internacional como hoy (5 y 7). La etiqueta de los anillos chicos dice siempre de dónde son los medios («Confirmada por 2 medios locales», «Confirmada por 2 medios de 2 provincias»), nunca «Confirmada» a secas; una 1/2 local es la «en observación» de ese anillo. El anillo de una noticia se decide por lugar (donde pasó), como ya está decidido para nacional/internacional; sin IA, por el portal y su sección, como hoy el bloque provisorio.
- Una noticia que cumple en dos anillos a la vez (por ejemplo, 3 portales de Chubut y 1 de Neuquén) va al anillo más chico donde pasó (Chubut).
- Orden de construcción de los anillos: primero los feeds de Comodoro y Chubut, después los de las otras provincias. La Región existe en config/ desde el primer día y aparece en la página en cuanto tenga noticias (un anillo sin noticias no se muestra).
- «Falta una noticia»: se busca por palabras del título contra todo lo acumulado de 48 h (verificado, en observación, descartado con su motivo, caído por viejo). Cuatro respuestas: «la tengo pero no llegó» (muestra la noticia con sus medios y deja llevarla a mano), «la saqué» (con el motivo del criterio 1 y «ver igual»), «vieja» (se cayó por las 24 h) y «no la vi en ningún portal de la lista». Las «no la vi» quedan anotadas con la hora: es la lista de lo que se escapó, para revisar portales y moldes. Para que la página pueda contestar, lista.json tiene que traer también lo descartado (título, motivo, medios); hoy trae solo lo que entra.
- En el encabezado, la hora de la última vuelta en vez de «Actualizada recién».
- El pivote es un lugar fijo arriba (no un acordeón que se expande donde está la fila).

## Abierto (sin resolver, con valor por defecto mientras tanto)

- Dónde viajan los motivos de «No por hoy» y las respuestas «no la vi» para que el sistema aprenda de ellos. Hoy quedarían en el navegador de cada persona y nadie los vería. Es capa 4 (lo de Don Julio). Mientras tanto: navegador.
- Qué portales locales y regionales tienen feed. Candidatos sin verificar: ADNSUR, El Patagónico, Crónica, El Comodorense (Comodoro); La Opinión Austral (Caleta Olivia); Diario Jornada, El Chubut, Rawson Digital (provincia). De Neuquén, Río Negro, Santa Cruz y Tierra del Fuego no hay candidatos todavía. Trabajo para Claude Code después de la medición, con npm run feeds. Después de ver qué traen, moldes de notas de servicio propios de lo local (clima, cortes de luz, horarios), sumados a los 3 que ya hay en el criterio 1.
- Noticias que tocan dos o más anillos (un hecho de Comodoro que también sale en medios nacionales): cómo se combinan los anillos. Idea de Alejo, sin diseñar.
- Los números por anillo (2 local, 3 Chubut, 2 de 2 provincias en Región) y los cupos (3) hay que medirlos con feeds reales antes de fijarlos.
- Cuántas noticias quedan «Sin tema» usando la sección del portal: medirlo sobre lo acumulado en la medición.
- Colores y bordes redondeados de la página: Alejo tiene una galería de conceptos; se ve después, cuando se diseñe la página nueva. Alejo dijo que lo dibujado «se ve demasiado IA» en colores.
- Nombre del producto: idea de Alejo del cono de luz de una linterna (el vértice chico que se expande; las secciones cónicas). Candidatos de Cowork: FOCO (el punto de la cónica, la linterna, «poner el foco»), HAZ, VÉRTICE. 7M sigue siendo el nombre hasta que Alejo decida.
- Pendiente ya existente que esto resuelve en parte: «deportes y espectáculos» (por defecto deportes sí, farándula no) pasa a «el motor no descarta por tema; filtro en la página».

## Lo que dejó la medición hasta ahora (notas de Alejo del 14-10, letras a y b), para cruzar al terminar

- Faltaron: Caputo negociando más financiamiento; PSG 4-2 Manchester City (Champions). Ver si no llegaron a 5 medios o si se partieron en varios hechos.
- Repetidos: varios obispos hablando de la operación del Papa León XIV (unión de hechos, etapa 4).
- Nota de servicio que el molde no agarró: horarios del Martín Fierro.
- Sobran por poco interés: Tucumán y el clima; testimonios de familiares (Roña Castro); bonos y riesgo país (juicio de la IA, etapa 2).
- De 4 a 5 nuevas por mirada, elegiría entre 0 y 3. Cruzar con npm run medir.
- «Más noticias al descartar» (bajar de 5 portales): Alejo dijo «por ahora dejalo así», lo habla con Don Julio. La regla de 5 sigue fija.

**Parcial, hasta las 09:44 del 15-10 (38 vueltas desde el 14-10 13:18), revisado por Cowork el 15-10; el día completo se cruza cuando termine la medición (16/10):**

| Qué | Número |
|---|---|
| Noticias distintas que llegaron a 5 medios en el día | 32 (22 nacionales + 10 internacionales) |
| Noticias distintas que pasaron por 4/5 | 46; 23 de ellas llegaron después a 5, 23 nunca |
| Confirmadas que estuvieron antes en 4/5 | 23 de 32 (entre 1 y 7 horas antes) |
| Vueltas con la lista de nacionales llena (7) | desde las 18:43 en adelante, todas |
| Internacionales en la lista | 1 hasta las 19:13, 3 o 4 después |
| Confirmadas nuevas de madrugada (23:43 a 07:13) | 0 |
| Bloque provisorio equivocado (internacionales que salieron nacionales) | 4 de 22 confirmadas y 3 de las 4/5 |
| La misma noticia partida en varios hechos | el Papa en 6 hechos; Martín Fierro en 3; riesgo país en 2; Caputo en 2; Roña Castro en 2 |
| Notas de servicio que los moldes no agarran y llegaron a 5 | horario del Martín Fierro, el clima de Tucumán, «Anses: quiénes cobran», «Precio del euro hoy en Chile», «Cuánto cobran los empleados de McDonald's» |
| Feeds caídos | Al Jazeera, 1 vuelta de 38 |

## Qué viene después

1. Antes de la carta, en el mismo chat de Cowork: Alejo pidió estudiar «el comportamiento de una noticia», qué le pasa desde que sucede hasta que se publica y qué le pasa cuando la toma el agente. Cowork lo dibuja como un tablero interactivo (la noticia es una ficha que avanza por etapas, con un control de tiempo). No es carta ni cambio: es para entendernos.
2. Al terminar la medición, Alejo manda a Cowork la salida de npm run medir y datos/vueltas.jsonl. Cowork revisa a ojo los bloques por los títulos y cruza con las notas de arriba.
3. Cowork escribe la carta Cowork_para_ClaudeCode_<fecha>_<letra>.md con la página C (esta charla es su base), en este orden: primero el flujo (pestañas, pivote, tres botones, motivos, archivo, me interesa, copiar, falta una noticia); después los temas como filtro; después los anillos y los portales locales y regionales (que empiezan por probar feeds). Combinar con IA espera a la etapa 2.

## ▶ PRÓXIMA RONDA

Cada cosa lleva a quién le toca. Se tacha cuando sale en un paquete.

**Desde el 04-10-2026 hay un solo chat de Cowork** (antes DISEÑADOR y PREPARADOR). Donde un ítem dice DISEÑADOR o PREPARADOR, es Cowork. Lo que sigue (es una sugerencia, no una decisión de Alejo): la capa 4 con Don Julio, que es lo que hoy frena tener algo que apretar con noticias reales. La revisión de la página y de lo medido en el reporte `a` del 04-10 quedó aprobada (ver «Hecho»).

**Capa 4 y calidad del agrupador** (medido con datos reales el 04-10, ver `CLAUDE.md`)
- [x] ~~Umbral del agrupador.~~ Hecho: `umbralSimilitud` 0.3 con `umbralSeguro` 0.5 y `minPalabrasComunes` 3. Sobre lo acumulado (1.150 notas) con 0.5 hay 0 verificados y con 0.3 hay 2, sin uniones falsas entre los hechos de 5 o más grupos.
- [ ] **Cuántas noticias da la regla de 5 en un día real** (pide el DISEÑADOR): con lecturas cada 30 minutos de un día entero, por bloque y por corte de 4 h, cuántos hechos llegan a 5 o más grupos, cuántos quedan en 4/5 sin firma y cuántos tienen firma. Las 4/5 que se ofrecerían salen de `resumen.elegiblesAMano` (con lo guardado el 04-10 a las 18:02 son 4, todas frescas). Sin apuro: depende de la capa 4. **Herramienta lista (09-10):** `npm run vuelta -- --cada 30` un día entero y después `npm run medir`. **Decidió Alejo (09-10): el día de medición lo corre él en su compu**, con la guía `docs/CORRER_EN_MI_COMPU.md`; al terminar le manda a Cowork la salida de `npm run medir` y `datos/vueltas.jsonl`, y Cowork revisa a ojo los bloques por los títulos (ver el ítem del bloque provisorio).
- [ ] **Hechos partidos: decidido por Alejo (opción A): la IA los une y se cuentan juntos; espera la IA.** «La misma noticia» es **el mismo hecho: la misma gente, lo mismo que pasó, el mismo día**; no alcanza con el mismo tema. Es la sexta pregunta de la IA. Hecho en el repo, sin llamar a ningún modelo: `paresParaUnir`, `unirHechos`, `preguntaUnion` y `leerUnion` de `src/ia.js`. **Corrección:** el par «EN VIVO | Elecciones en Brasil: comienza el escrutinio…» + «…Milei sigue con optimismo la elección en Brasil…» es **no** (uno es el conteo de votos, el otro lo que hace Milei); antes figuraba como «sí». Medido el 04-10 con la regla nueva (lo guardado hasta el 5/10 00:01, con el filtro de Infobae): entran 11 hechos (5 de 3 grupos, 4 de 4 y 2 candidatos de vía A) y salen **5 pares**: 2 entre hechos de 3 o 4 grupos (Colapinto, unión de 5 grupos, sí; escrutinio + Milei, unión de 7, no) y 3 con un candidato (escrutinio + «voto a voto», unión de 8, sí; Milei + «voto a voto», unión de 9, dudoso; Milei + García Cuerva, unión de 9, no). Los 5 llegan a 5 grupos: por eso la pregunta tiene que ser estricta. Detalle en `ClaudeCode_para_Cowork_2026-10-04_a.md`.
- [ ] **Capa 4 (Alejo con Don Julio): reemplaza «Guardar lo leído entre corridas».** Cada cosa lleva un valor por defecto que se puede cambiar:
  - Dónde corre n8n. Por defecto: n8n Cloud Starter, €20 por mes con 2.500 ejecuciones; leer cada 30 minutos son 1.440 por mes. Ojo: n8n 3.0 sale en octubre de 2026 y en servidor propio exige Docker. (Datos de n8n y de la IA consultados por Cowork el 04-10 en sus páginas oficiales.)
  - Dónde se guarda lo acumulado, la última lista (`pagina/lista.json` en su versión real) y lo juzgado por la IA (los guardados de `src/ia.js`).
  - Dónde vive la página, para que verla no gaste ejecuciones de n8n, y con un link secreto por cliente.
  - Qué cuenta de IA. Por defecto Claude Haiku 4.5, entre US$1 y 5 por mes. Quién la paga.
  - Cómo avisa si una lectura falla, y cómo se separan las pruebas de lo real.
  - **Antes de prender la unión con un modelo real (valor por defecto de Cowork, 05-10):** se le hace a ese modelo, con la misma configuración que va a usar n8n, cada caso de unión de `test/casos-ia.json` que no es `dudoso`, **3 veces**. Tiene que acertar las 3 veces en todos. Una respuesta que `leerUnion` no puede leer (`null`) cuenta como error. Si erra una, la unión queda apagada hasta que se arregle la pregunta o se cambie de modelo. Los casos `true` también cuentan, para que «Si dudás, contestá false» no lo vuelva tan desconfiado que no una nada.
  - La pieza para acumular ya está hecha (`acumular` y `npm run leer -- --acumular datos/notas.json`, 48 h, `datos/` no se sube al repo), y también las piezas de la IA (`src/ia.js`); lo que falta es el pegamento.
  - **Las preguntas para Don Julio (Cowork, 05-10):** 14 preguntas en 6 bloques, cada una con lo que proponemos mientras tanto y un globo para que conteste, en la página https://claude.ai/artifact/DMmuJhsmvGLWBCxxcJc4yq (es privada de Alejo: él se la comparte). Si Don Julio la abre como Editor, lo que escribe queda guardado en la página y el próximo chat de Cowork lo lee de ahí. Si no, toca «Copiar todas», se lo manda a Alejo por WhatsApp y Alejo lo pega en Cowork. Con sus respuestas, Cowork escribe la carta de la capa 4.
  - **Orden por etapas (valor por defecto de Cowork; se le pregunta a Don Julio en la pregunta 12):** 1) leer y guardar cada 30 minutos, sin IA, que ya sirve para medir un día real; 2) la IA que juzga; 3) la página con la lista real; 4) la unión, después de la prueba de 3 veces.
  - **Datos consultados por Cowork el 05-10 en las páginas oficiales:** n8n 3.0 todavía no salió (está anunciado para octubre de 2026); con esa versión el servidor propio va solo con Docker y el tiempo máximo de un nodo Code baja de 5 minutos a 1. n8n Cloud Starter sigue en €20 por mes con pago anual y 2.500 ejecuciones. Claude Haiku 4.5 sigue en US$1 por millón de tokens de entrada y US$5 de salida. `preparar` tarda menos de 1 segundo con 1.300 notas inventadas (medido por Cowork).
  - **09-10 (Alejo):** Don Julio no contestó la página; Alejo contestó las 14 preguntas con los valores por defecto. Dónde corre cada 30 minutos (preguntas 1 y 2) lo habla con Don Julio después. Lo demás vale hasta que Don Julio diga otra cosa.
  - 14-10 23:30: Don Julio contestó por WhatsApp; ver la sección de las 23:30 arriba.

**Alejo**
- [ ] **Deportes y espectáculos: pendiente** (Alejo: «dejalo como pendiente»). Por defecto: **deportes sí, farándula no** (`config/reglas.json`, sección `ia`: `deportes` y `farandula`). Esos dos valores entran en el texto de la pregunta de juicio de la IA.
- [ ] Nombres para la lista de firmas (`config/firmas.json`): nombre y si vale para nacional, internacional o los dos. **Sin apuro**: Alejo no los tiene a mano. Mientras esté vacía, la vía B no hace nada. Hay alternativas para Cowork (abajo).
- [ ] Opcional: borrar la rama vieja `claude/quirky-bell-pkumz7`, que ya no se usa. Se hace desde GitHub; Claude Code no la toca.
- [ ] **El repo es público.** Alejo decide si pasa a privado. Revisado el 04-10-2026: no hay claves ni tokens; el historial solo tiene como autor a "Claude <noreply@anthropic.com>" (ningún correo personal); los correos de los tests son inventados; el único workflow de GitHub solo corre `npm test`. Sí se ve: la lógica de verificación y las reglas (lo que se piensa vender), las decisiones de Alejo, y menciones a su hermana, a Don Julio y al plan de vender el programa. La lista de firmas, cuando se llene, también sería pública. Si pasa a privado, confirmar que la app de Claude en GitHub y los chats de Cowork sigan teniendo acceso. **Valor por defecto:** sigue público hasta que Alejo decida. Si pasa a privado, la línea de arranque con el link deja de andar y se vuelve al paquete.
- [ ] Decidir si los 10 feeds internacionales extra entran a la lista blanca (`config/feeds.json`, sección `extras`). Va junto con el riesgo de abajo.
- [ ] **Riesgo en INTERNACIONAL: margen e idioma.** Con solo medios internacionales hay 6 grupos con feed y se exigen 5. Dos de esos 6 (The Guardian y Al Jazeera) publican en inglés y el agrupador compara palabras: sin ellos quedan 4 en español. El motor cuenta hoy cualquier medio de la lista para cualquier noticia (verificado: 3 internacionales + 2 argentinos dan 5 de 5), así que una internacional puede sumar los 11 grupos argentinos. Opciones:
  - A: sumar a la lista blanca los 7 extras en español (Euronews, RFI, Europa Press, El Mundo, La Vanguardia, ABC, 20minutos). Cuesta poco, los feeds ya andan. Ojo: 5 son de España.
  - B: agrupado multilengua, comparar significado y no palabras. Resuelve también The Guardian, Al Jazeera y los extras en inglés (NYT, Sky News, NPR). Más caro: hace falta embeddings o una IA. Es el pendiente de los sinónimos.
  - C: que cuenten los medios argentinos para una internacional, como está hoy, o decidir que no. Es la decisión "argentinos afuera / qué es INTERNACIONAL" de `CLAUDE.md`.
  - Primera medición con datos reales: en las notas leídas, la noticia de Brasil la cubren 10 grupos argentinos y 4 internacionales (2 en inglés, The Guardian y Al Jazeera). Sin contar a los argentinos no se verifica: quedan 2 internacionales en español. Se verifica porque cuentan los medios argentinos.
  - **Valor por defecto si Alejo no decide:** C como está hoy, sin extras, y medir con datos reales cuando exista el lector cuántas internacionales llegan a 5 por corrida. Si son menos de 3 (el mínimo que se puede elegir), pasar a A; B queda para más adelante.

**Cowork (diseño y decisiones; antes DISEÑADOR)**
- [ ] **La medición local en la nube se cortó (15-10):** la compu de Claude Code se apaga cuando la sesión queda quieta; hizo solo 3 vueltas (desde las 00:38). Un día entero no se puede correr desde ahí. Alejo la arranca en su compu el 15-10, en paralelo con la nacional (`--config config/comodoro --carpeta datos/comodoro`); al terminar manda también `npm run medir -- --carpeta datos/comodoro` y `datos/comodoro/vueltas.jsonl`. **Cowork (carta `c`): la Fase B de la carta `a` queda cancelada; la revisión la hace Cowork con esos archivos.**
  - **Hueco en la medición nacional:** la ventana de la vuelta se cerró en la compu de Alejo cerca de las 07:43 del 15-10 y se rearrancó a las 09:45 (unas 2 horas sin vueltas). La local arrancó a la misma hora, en su compu, con `Feeds: 8 OK`. Las dos iban a cortar el 16-10 después de las 00:30; **Alejo las estiró hasta el 16-10 a las 12:05** (decidió a las 06:46 del 16-10): así la mañana, que el 15 quedó con hueco, se mide entera. Donde las secciones de Cowork dicen «después de las 00:30», hoy es 12:05.
- [x] **Feeds de portales locales, probados el 14-10** (`buzon/ClaudeCode_para_Cowork_2026-10-14_a.md`): Comodoro tiene 3 con feed al día (ADNSUR, El Comodorense, Crónica por secciones); lo provincial no tiene feeds, solo sitemaps de noticias (El Chubut, El Patagónico). Decidir si el lector suma sitemaps. Nada sumado a `config/`. **Hecho el 15-10:** el lector lee sitemaps y el bloque local de prueba está en `config/comodoro/` (carta 2026-10-15_a).
- [ ] **Las notas de Alejo usando la página durante la medición** (14-10-2026, 5 miradas): están en `buzon/Alejo_para_Cowork_2026-10-14_a.md`, tal cual y con un resumen. Pide para la página: menos scroll, más legible, **quitar** una noticia «por hoy» con el motivo (para aprender qué busca quien publica) y **archivar** una para combinarla después. De las noticias: sobran locales y de poco interés, un molde de servicio no agarra «horarios del Martín Fierro», hechos repetidos (obispos y el Papa), faltaron Caputo y PSG-Manchester City. Va con la salida de `npm run medir` cuando termine la medición; la modificación de la página, **después** de la prueba (decidió Alejo).
- [ ] **El flujo que quiere Alejo con cada noticia** (14-10-2026, `buzon/Alejo_para_Cowork_2026-10-14_b.md`): primero discriminar (me interesa / no por hoy con motivo / archivar) y después copiar solo lo elegido. Ideas para pensar: gustos por persona (chimento sí o no), más noticias al descartar (la regla de 5 queda fija: «por ahora dejalo así»), portales locales de Chubut. Se diseña después de la prueba.
- [ ] **El bloque provisorio falla con una internacional que los medios argentinos ponen en secciones genéricas** (medido el 09-10: el Nobel de la Paz a Navi Pillay, 7 grupos, 3 de 9 notas «parecen» internacionales, salió en Nacionales; las otras 3 confirmadas salieron bien). **Valor por defecto: no se toca**; lo arregla la IA en la etapa 2 y la página ya dice «provisorio». Parche posible si molesta en la medición: que un hecho vaya a internacional también cuando lo publican 3 o más medios de `ambito: internacional` distintos (riesgo: una nacional muy grande con cobertura de afuera iría a internacional). Mientras tanto, al revisar el día medido, Cowork mira los bloques a ojo por los títulos de `vueltas.jsonl`.
- [ ] **El juicio de un hecho mezclado:** el hecho «A la espera de los primeros resultados, Milei sigue con optimismo…» (4 grupos) tiene un título de Milei pero 4 de sus 5 notas son del conteo de votos. La pregunta de la IA se arma con todas las notas, no solo con el título, pero conviene mirarlo cuando se pruebe el modelo (`test/casos-ia.json`). **Su caso de bloque queda nacional** (Cowork, por la regla «por lugar» de Alejo: lo que hace Milei pasa en Argentina).
- [ ] **Caso borde de la vía B con la 4/5:** una 4/5 que entra por la vía B pero cuya firma no vale para su bloque (un autor solo nacional en una noticia internacional) se descarta y no se ofrece a mano. Solo pasa con `firmas.json` llena. **Valor por defecto:** así.
- [ ] **Alternativas a la lista de firmas hecha a mano.** Opciones para pensar:
  - A: la lista manual de hoy.
  - B: reputación por trayectoria. Una firma sería reconocida si aparece firmando en varios portales de la lista blanca durante un período. Se arma sola con el campo `firma` que va a traer el lector y Alejo solo aprueba o descarta. Cuidado: popularidad no es confiabilidad, y habría que sacar firmas genéricas ("Redacción", "Agencias").
  - C: fuentes externas (premios, bases de datos de autores). Sin investigar ni probar.

**Cowork → Claude Code (antes PREPARADOR → Claude Code)**
- ~~Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_a.md`~~: **cancelada el 15-10 (carta `c`)**: la medición local corre en la compu de Alejo y la revisa Cowork con los archivos que él mande. Claude Code no tiene nada que hacer con lo local hasta la carta de los bloques por zona.
- Fase B de la carta `Cowork_para_ClaudeCode_2026-10-15_b.md`: instalar la capa 4 en el servidor de Don Julio el día que Alejo vaya, en una tanda.

**Más adelante**
- [ ] Portales y firmas por país, para vender a otros países (Uruguay, por ejemplo).
- [ ] Fotos y armado de publicaciones (hoy se hace a mano en Canva). Las fotos de los portales tienen derechos: antes de automatizar hay que definir de dónde salen las imágenes.
- [ ] **La visión a largo plazo de Alejo (contada el 14-10-2026, sin diseñar todavía):** piezas que se enchufan una detrás de otra, cada una con su tarea, y todas toman de entrada la lista de noticias confirmadas (`lista.json`). 1) La de hoy: noticias chequeadas a mano para quien publica. 2) Armado para publicar: título con gancho, resumen chiquito, foto bien centrada y personalizada, miniaturas para Facebook, YouTube, un portal o un canal de WhatsApp. 3) Voz: leer la noticia con una voz generada, por una API. Alejo quiere ir paso a paso: primero que la pieza 1 ande sola. Antes de la 2 hay que resolver los derechos de las fotos (ítem de arriba); la 3 suma un costo de API.
- [ ] Mejorar el agrupador para notas en otro idioma (hoy compara palabras).
- [ ] Que las personas de un mismo canal vean lo que se llevó cada una (hoy cada una ve lo suyo; hace falta saber quién es quién).
- [ ] Un aviso de «hay nuevas».
- [ ] Noticias reales en la página con el juicio de la IA (hoy la lista real sale sin IA, con la franja que lo dice; es la etapa 2).

## Hecho

- [x] 15-10-2026 · **Capa 4 escrita** (carta `b`): `src/capa4.js`, los cuatro workflows en `n8n/`, la página con login (`scripts/servir.js`, `scripts/usuario.js`), la IA falsa y la guía de instalación. Falta instalar (Fase B).
- [x] 15-10-2026 · **Sitemaps en el lector y `--config` en la vuelta** (decidió Alejo adelantarlo el 15-10): El Patagónico y El Chubut se leen por su sitemap de noticias (sin bajada; la página lo dice); `config/comodoro/` es el bloque local de prueba (5 portales, 2 medios para confirmar); la medición local corre en el entorno de Claude Code.
- [x] 09-10-2026 · **Links por medio** (Cowork, valor por defecto, variante A): en la página cada medio aparece una sola vez en la fila de links, con su primera nota; lo que se copia sigue con todos. `npm run ver` para ver `datos/pagina/` en la compu. **El día de medición lo corre Alejo en su compu** (decidió Alejo): guía `docs/CORRER_EN_MI_COMPU.md`.
- [x] 09-10-2026 · **Etapa 1 en el repo** (decidió Alejo): `npm run vuelta` hace una vuelta completa sin IA y deja la lista real en `datos/pagina/`; `npm run medir` resume las vueltas por corte de 4 h; la página avisa «Sin el juicio de la IA». Dónde corre, con Don Julio.
- [x] 05-10-2026 · **Cerrado por Cowork al aprobar el reporte `c`:** `scripts/armar-paquete.js` sigue trayendo solo el reporte más nuevo (valor por defecto de Cowork). Si un día hay dos reportes sin carta de Cowork en el medio y el chat de Cowork no puede clonar el repo, Alejo le pega también el reporte anterior. No se toca hasta que pase.
- [x] 05-10-2026 · **El molde «▶ QUÉ HACÉS AHORA»**, decidido por Alejo: toda entrega de Cowork y de Claude Code termina, en el mensaje del chat, con «ESTO mandale a …:» por cada destinatario, un recuadro con exactamente lo que se pega y el molde afuera, como cita; nunca una tabla, y nunca recuadros ni moldes de ejemplo adentro de lo que se pega. Escrito en `LEEME_COWORK.md` («El molde»), `LEEME_CLAUDECODE.md` y `CLAUDE.md`. Cowork lee todos los reportes nuevos, no solo el último. La hora del encabezado sale del comando, corrida en el momento.
- [x] 05-10-2026 · **Cerrado por Cowork al aprobar el reporte `b`:** las 66 comprobaciones de `npm run probar-pagina` quedan agrupadas como están; la captura del celular de Alejo con la versión vieja era una imagen de antes del 05-10 `a` (la página no está publicada en ningún lado).
- [x] 05-10-2026 · **El sello de lo llevado a color pleno** (Cowork): en una tarjeta llevada se apagan solo la casilla, el título, la bajada y los links (0,6; 0,9 si se la vuelve a tildar); el sello y «Te la llevaste a las…» quedan sin apagar. Contraste del naranja en claro de 2,6 a 5,8 (oscuro 3,8 a 8,0; verde 2,5 a 5,1 y 3,8 a 7,7). **El script de Chromium en el repo:** `npm run probar-pagina` (Cowork; fuera de `npm test`, sin Playwright en `package.json`, con `--capturas <nombre>`).
- [x] 05-10-2026 · **Cerrado por Cowork:** el número del bloque («Nacionales · 7») cuenta la lista (vía A y vía B, llevadas incluidas); una 4/5 llevada no suma aunque se vea en el bloque.
- [x] 05-10-2026 · **«Recién confirmada»** (decidió Alejo, opción C): una 4/5 que ya vio y sube a confirmada lleva una pastilla propia que dura la visita (`vistasConfirmadas` en el estado; un estado viejo arranca como copia de `vistas`). Descartado: sin marca; «Nueva» otra vez. También de Cowork, valores por defecto: la vía B en violeta y la 4/5 llevada en naranja (ya no se confunden con «Confirmada por N medios»), «4 de 5 medios» en las 4/5, y la pregunta de unión más estricta con 2 casos de prueba más (`union[4]` dudoso y `union[5]`). Capturas `buzon/capturas/pagina-2026-10-05-*.png`.
- [x] 05-10-2026 · **Cerrados por Cowork al aprobar el reporte `a` del 04-10:** revisar la página y lo medido (aprobado; M1 cerrado); Chequeado como fuente de desmentidos (no se suma); la pastilla «Nueva» en las 4/5 (no); «Detalle conocido de la página» (ya no aplica: la línea de las 4/5 no nombra medios).
- [x] 04-10-2026 · **La página (capa 5) sobre el día de ejemplo.** `pagina/index.html` con `pagina/logica.js` (funciones puras que se prueban con `node --test`) y `src/entrega.js`; `npm run pagina` arma `pagina/lista.json` (de ejemplo, inventado, se commitea). Lo decidió Alejo: una página con «Traer noticias», siempre lo último (se rehace cada 30 minutos), «Nueva» y «Te la llevaste» (se marca, no se oculta), hasta 7 y ella tilda, las 4/5 abiertas debajo de cada bloque con «Llevármela igual». Capturas en `buzon/capturas/`.
- [x] 04-10-2026 · **Memoria de lo ya entregado:** se resolvió en la página (marcas por persona en su navegador, 24 h, `localStorage`), no en el motor. Se reconoce la misma noticia por una url compartida, no por el id.
- [x] 04-10-2026 · **Orden por cantidad de medios** (decidió Alejo): primero lo que más medios publicaron; si empatan, lo más nuevo; la vía B después de toda la vía A. La IA ya no da importancia (`impacto` no se usa y no sale). Con el orden nuevo cambia cuáles entran por los topes (en el día de ejemplo, E3 y E4 entran y E1 y E2 salen por el tope de economía; I3 entra e I2 sale por el de EEUU).
- [x] 04-10-2026 · **«Argentinos afuera» por lugar** (decidió Alejo): el hecho va donde pasó, no según quién lo protagoniza. Entra en la pregunta 4 de la IA.
- [x] 04-10-2026 · Cada noticia de `decidir` trae la `bajada` del medio.
- [x] 04-10-2026 · **Diseñar las 6 preguntas de la IA** (decisiones 2.1, 2.3 y 2.4 de Alejo) y **las piezas alrededor, sin llamar a ningún modelo** (`src/ia.js`): pares de hechos para unir, `unirHechos` (reclasifica con la misma función que `preparar`), el texto exacto de las preguntas de unión y de juicio, cómo se lee lo que contesta, posibles desmentidos y cómo se reconoce lo ya juzgado. La llamada al modelo la arma Don Julio en n8n (capa 4).
- [x] 04-10-2026 · **Ventanas de tiempo para corridas cada 4 horas:** no hay corridas cada 4 horas; la lista se rehace cada 30 minutos. Quedan 48 h de recolección y 24 h de frescura.
- [x] 04-10-2026 · **Decidió Alejo: «dejalas con el valor por defecto»** (los cuatro quedan como están): feeds por sección de Infobae (no se suman; medidos: 100 notas argentinas cada uno y 76 a 112 horas de cobertura); las 14 notas de otras ediciones de Infobae (no se tocan); reglas viejas `quiniela` y `horoscopo` (quedan sueltas; en 1.277 notas sacaron 0 y 2 y ninguna era noticia); variantes de servicio (no se suma ningún molde nuevo).
- [x] 04-10-2026 · **Alejo pasó de tres bloques a dos: un solo chat de Cowork y Claude Code.** Se juntaron DISEÑADOR y PREPARADOR en `buzon/LEEME_COWORK.md`; las cartas se llaman `Cowork_para_ClaudeCode_*` y `ClaudeCode_para_Cowork_*`; hay un solo paquete (`buzon/paquetes/PEGAR_COWORK.md`); `LEEME.md`, `LEEME_CLAUDECODE.md` y `CLAUDE.md` están al día. `LEEME_DISENADOR.md` y `LEEME_PREPARADOR.md` quedan como avisos que apuntan al nuevo, y las cartas viejas quedan como historia. El motivo: llevar archivos entre tres chats lo mareaba.
- [x] 04-10-2026 · **Infobae sin las ediciones de España, Perú, México y Colombia** (decidió Alejo). `excluirRutas` en su feed, con la regla "la dirección **empieza con** la ruta" (así `/america/mexico/` no se cae por `/mexico/`), y lo ya guardado se filtra al cargarlo (`filtrarRutas` en `scripts/leer.js`; en n8n, el mismo paso al cargar lo acumulado). `npm run leer -- --acumular datos/notas.json --sin-leer --sin-excluir-rutas` da el "antes". Sobre lo guardado: 213 notas sacadas (`/espana/` 76, `/peru/` 72, `/mexico/` 38, `/colombia/` 27), hechos 1.031 → 865, los 2 confirmados y las 4 de "les falta 1 medio" siguen igual, y de los hechos de 3 o más grupos solo uno pierde a Infobae (El Comidista, de 3 a 2 grupos: era una unión con la edición de España). Ver `ClaudeCode_para_PREPARADOR_2026-10-04_k.md`.
- [x] 04-10-2026 · LN+ no anda con la red completa: el portal corta la conexión en las 8 direcciones probadas, mientras La Nación responde en 1 s por el mismo camino. Queda `activo: false` y en `sinFeed`, con el motivo. Se reintenta solo si Alejo lo pide.
- [x] 04-10-2026 · Notas con fecha futura. **Decidido por el PREPARADOR: no se toca.** El lector ya descarta lo que viene con más de 12 h de adelanto (`FECHA_FUTURA_HORAS`); lo de menos de 12 h (Página/12 fecha la edición del lunes a las 00:01) cuenta como fresco un rato más, sin daño visto.
- [x] 04-10-2026 · **Decisión de Alejo (carta del DISEÑADOR `a`, 1.1): la verificación queda en 5 grupos fijos, sin cálculo.** Se cierra el pendiente del cálculo: no hay peso por portal, ni umbral de puntaje, ni segunda página automática con "Confirmada por 4 medios". `minGrupos` sigue en 5. Anotado en `CLAUDE.md`.
- [x] 04-10-2026 · Notas de servicio con plantilla afuera del criterio 1: 3 moldes en `criterio1.notasDeServicio` (horario de partido, efemérides, resultados de lotería), con motivo `nota_de_servicio (<nombre>)`. Medido con los moldes puestos: sacan 7 notas (3, 3 y 1), ninguna era noticia, y las 2 uniones falsas de 3 grupos desaparecen (hechos de 3 grupos: 10 → 8). Ver `ClaudeCode_para_PREPARADOR_2026-10-04_j.md`.
- [x] 04-10-2026 · Excepción a mano para una 4/5, pieza del núcleo: `elegiblesAMano` en `preparar` y `aMano` en `decidir`, con la etiqueta "Confirmada por N medios · elegida a mano". Sin cupo ni topes; nunca entra sola. La vista espera el diseño de la entrega.
- [x] 04-10-2026 · `npm run leer` muestra qué sacó el criterio 1 por motivo y tiene `--sin-notas-de-servicio`; con `--detalle` lista los títulos sacados por una regla de título.
- [x] 04-10-2026 · Perilla del agrupador (`umbralSeguro`, `minPalabrasComunes`) y `--min-comunes`/`--detalle` en `npm run leer`; `umbralSimilitud` baja de 0.5 a 0.3 con el resultado de la medición (V1, V2 y V3; ver `ClaudeCode_para_PREPARADOR_2026-10-04_i.md`).
- [x] 04-10-2026 · Los 6 portales sin feed (Reuters, AP, AFP, EFE, La Voz y LN+) quedan `activo: false`: el aviso de "¿feed roto?" ya no los nombra. El día de ejemplo usa medios argentinos para lo internacional (opción C).
- [x] 04-10-2026 · `acumular` y `npm run leer -- --acumular datos/notas.json`: lo leído se junta entre lecturas y se verifica sobre 48 h.
- [x] 04-10-2026 · Paquetes para pegar en Cowork (`npm run paquete`): un archivo por rol en `buzon/paquetes/`, para cuando el chat no tiene el repo conectado.
- [x] 04-10-2026 · Feeds probados y lista real en `config/feeds.json`.
- [x] 04-10-2026 · Vía B (firma reconocida) en el núcleo, con `config/firmas.json` vacía.
- [x] 04-10-2026 · Cantidad de noticias por bloque elegible de 3 a 7.
- [x] 04-10-2026 · Segunda página confirmada por Alejo: alcanza con 1 autor de la lista, y se nombran hasta 2 (ver `ClaudeCode_para_PREPARADOR_2026-10-04_b.md`).
- [x] 04-10-2026 · Los chats de Cowork ven `buzon/`: `claude/trusting-knuth-brmpsy` es la rama principal del repo en GitHub (Alejo la configuró y se verificó), con una sola sesión de Claude Code.
- [x] 04-10-2026 · Lector `src/lector.js` y `npm run leer`: 19 de 19 feeds leen bien con datos reales (1.018 notas).
- [x] 04-10-2026 · Buzón armado en el repo: `LEEME.md` (reglas, ciclo de cada tanda) y un `LEEME_` por bloque. Todo pasa por el PREPARADOR.
