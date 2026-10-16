# Cowork · resumen del 16-10-2026 (chat de la medición)

Para el próximo chat de Cowork. La memoria es el repo (`buzon/pendientes.md`, `CLAUDE.md`); esto es la foto de qué quedó dónde.

## Qué hizo este chat

- Leyó las dos mediciones de Alejo (nacional 91 vueltas, local 54) y sus 19 pasadas a mano. Página con números y gráficos: https://claude.ai/artifact/8NAbjuLTQznf7xFe85ccAd (privada de Alejo).
- Escribió `buzon/Cowork_para_ClaudeCode_2026-10-16_a.md` (13:02): anillos Comodoro y Chubut en `npm run vuelta -- --zona config/zona`, cruce «también nacional», moldes de pronóstico y cotizaciones, prueba de las fuentes de los cortes. Claude Code la hizo (reporte `a`, 16:50): 302 tests, página 80/80, cuatro bloques en la vuelta real.
- Escribió `buzon/Cowork_para_ClaudeCode_2026-10-16_b.md` (17:06): la zona dentro de la capa 4 (sin IA), arreglo del molde del pronóstico (el título de Netflix), `urls` en cada hecho de `vueltas.jsonl` y `medir` por link, `docs/PAQUETE_DE_CLIENTE.md`. No depende de Don Julio.
- Investigación «Cómo lo resuelven otros» (Ground News, Google Full Coverage, Particle, Event Registry, Media Cloud, plantillas de n8n, Chequeabot, Chartbeat, Echobox; avisos de cortes; frontend; paquete de cliente): https://claude.ai/artifact/3eGsj59wqMY7MdQHdrNjor (privada de Alejo). Las tres decisiones del día, con A y B: https://claude.ai/artifact/HW7jyGdcEUbkoPWZTvHJoo.

## Decidió Alejo (16-10)

1. **Chubut con 2 medios, uno provincial** (12:51, opción B). Local con 2 de Comodoro; lo que cumple en dos anillos va al más chico.
2. **Ids: opción B** (16:53): `medir` cuenta por link; regla del proyecto: nada se guarda por id de hecho, todo por link.
3. **Avisos de cortes: arrancar con lo legible** (16:53): título, fecha, link; horario y barrios del texto cuando estén; el barrio en imagen lo lee la IA en la etapa 2. Alejo quiere el aviso con antelación («hoy se corta la luz en zona norte», «de 9 a 15»).
4. **Próxima carta en dos tandas** (16:53): primero lo seguro (carta `b`), después los avisos (carta `c`).
5. Primero lo simple, después lo complejo (12:56); todo alrededor de la respuesta de Don Julio para que solo falte instalar.

## Lo que dejó la investigación (valores por defecto de Cowork, para las cartas que vienen)

- Página C: el sello dice de dónde son los medios («5 medios · 2 de Comodoro»); la tarjeta nacional dice «También en N medios de Comodoro» cuando el cruce sacó una local; etiqueta «asistido por IA» en lo que escriba la pieza 2; chip de motivo nuevo «derivada / opinión sobre otra»; las 4/5 se muestran igual que las confirmadas (Alejo aprobó 45 % de unas y 46 % de otras).
- Pieza 2 (de Chartbeat): darle a la IA los títulos que el cliente eligió antes; nunca publicar solo; el título se escribe con el cuerpo de 3 notas, nunca con uno.
- Bloque Avisos (carta `c`): una nota de un portal local que hable de corte de agua, luz o gas es un aviso con 1 solo medio; se saca día, horario («entre las 12 y las 14», «de 9 a 15 hs») y barrios del texto; link al comunicado de la SCPL o de SPSE si lo hay; formato «servicio · día · horario · zona · fuente». Los portales locales escriben los barrios y el horario en texto (caso real: 1-12-2025, 5 barrios, «entre las 12 y las 14 horas», un día antes).
- Paquete de cliente: todo lo de un cliente en `config/`; el segundo cliente se clona a `config/clientes/<nombre>/`. Lista en `docs/PAQUETE_DE_CLIENTE.md` (carta `b`).
- Fuera a propósito: sesgo izquierda/derecha (Ground News); «cuándo publicar» por red (Echobox) queda en «Más adelante».
- Las bases (segunda pasada, pedida por Alejo a las 17:13): la regla de los N medios es la versión automática de «cruzar siempre» de Reuters y de la segunda fuente de AP; la 4/5 a mano es la «autorización especial» de Reuters; las reglas de la pieza 2 son los principios de Kovach y Rosenstiel (no agregar nada, transparencia, fuentes). El error de AP en Polonia (15-11-2022, una sola fuente) es el argumento de venta en una frase.
- Retroalimentación (idea de Alejo, 17:13: que el sistema aprenda con una cuota de humano): valor por defecto de Cowork, «la libreta del cliente»: cada huella de la persona (motivo de No por hoy, título elegido, «no la vi», 4/5 aprobada, aviso marcado) se guarda por link en config/ del cliente y alimenta moldes, umbrales y ejemplos para la IA; revisión semanal Cowork + Alejo; nada se reentrena solo. Detalle en la sección 8 de la página de la investigación. Va entrando con la página C y la pieza 2.
- Pieza 2 (resumir y titular): el recorrido completo está en la sección 9 de la misma página; es después de la etapa 2, en el orden decidido (capa 4 → página C → pieza 2).

## Lo que sigue abierto

- Don Julio: versión de n8n, Docker o npm, cómo se entra; cuántas personas de Canal 2 y desde qué aparato. La carta `b` del 15-10 asume Docker, 3 personas, celular. El día que conteste: Fase B de esa carta (instalar), con la carta `b` de hoy ya hecha.
- Alejo no contestó todavía por dónde se entera de los cortes avisados con antelación (Facebook de la SCPL, WhatsApp, radio, portal): lo pide la carta `c`.
- La medición de Alejo sigue corriendo con `--zona`: ver si el cruce «también nacional» agarra al Papa y a River con lecturas cada 30 minutos (en la vuelta única de Claude Code agarró 0 de 2).
- Netflix: arreglado en la carta `b` (pendiente de que Claude Code la haga).

## Qué le llega al próximo chat de Cowork

El reporte `ClaudeCode_para_Cowork_2026-10-16_b.md` (zona en la capa 4, `medir` por link, n8n probado con la IA falsa), la respuesta de Alejo sobre los cortes, y —si llegó— la de Don Julio. Con eso: carta `c` (Avisos) y, el día de la instalación, la Fase B.
