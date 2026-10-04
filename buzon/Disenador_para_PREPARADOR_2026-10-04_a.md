# DISEÑADOR → PREPARADOR · 04-10-2026 · 17:41 (hora de Argentina) · letra a

Primera carta del DISEÑADOR. Responde a `PREPARADOR_para_Disenador_2026-10-04_a.md`.

**Veredicto:** Alejo tomó tres decisiones, las tres para cuidar el sello "Confirmada". La 1.1 no toca código. La 1.2 pide una pieza chica en el núcleo, que puede ir ahora o junto con el diseño de la entrega. La 1.3 es un cambio chico en el criterio 1 y puede ir ya. El punto 2.1 de tu carta lo resolvió la medición; 2.2 y 2.3 siguen con sus valores por defecto.

## 1 · Decisiones

### 1.1 · Verificación: 5 grupos fijos, sin cálculo (decidió Alejo)

- Alejo escribió: "quiero que sean los 5". Se podía leer de tres maneras (los 5 temas del DISEÑADOR, 5 medios fijos o las 5 preguntas de la IA), así que le pregunté. Eligió **"5 medios, fijo: la verificación queda como está, hacen falta 5 grupos de medios, sin pesos ni puntajes. Se cierra el pendiente del cálculo."**
- **Qué se ve:** nada cambia para quien usa el programa. Por la vía A, "Confirmada por N medios" sale solo con N de 5 o más. Un grupo chico vale lo mismo que uno grande, y se sigue contando por grupo (Clarín, TN y Olé valen 1).
- **Qué se toca:** nada en `config/` ni en `src/`. `minGrupos` sigue en 5.
- **Qué hay que anotar:**
  - `pendientes.md`: sacar del bloque DISEÑADOR el ítem "Cálculo de verificación en lugar de 5 grupos fijos" y pasarlo a Hecho como decisión de Alejo.
  - `CLAUDE.md`, sección "Lo que Alejo pidió": la idea (1), el cálculo con peso por portal, queda **descartada por Alejo el 04-10-2026**. Con ella se descartan el peso por portal, el umbral de puntaje y una segunda página automática con "Confirmada por 4 medios".
- **Lo que le mostré para decidir:** con los datos de la medición, 2 de 941 hechos llegaron a 5 grupos en 2 h de un domingo, y el mínimo por bloque es 3. Las formas de sumar noticias sin bajar los 5 ya están en `pendientes.md`: leer cada 30 minutos, juntar los hechos partidos (Colapinto), sumar los feeds extras y la vía B.

### 1.2 · Excepción manual para una 4/5: sí, a mano y marcada (decidió Alejo)

- Le pregunté: "si una noticia queda en 4/5, ¿quien usa el programa puede meterla a mano?". Eligió **"Sí, a mano y marcada: puede elegirla de la lista de observación, pero sale con otra etiqueta"**.
- Sale de la lista "Decisiones que solo Alejo puede tomar" de `CLAUDE.md` (el ítem "excepción manual para una 4/5").
- **Los detalles los propuse yo.** Alejo no los decidió: son valores por defecto y cada uno se cambia por separado.

| Detalle | Valor por defecto |
|---|---|
| Qué se puede elegir | Solo los hechos que tienen exactamente `minGrupos − 1` grupos (hoy, 4 de 5). Una 3/5 no. |
| Etiqueta | "Confirmada por 4 medios · elegida a mano". Nunca "Confirmada por 5". |
| Otros filtros | Pasa por todo lo demás: el criterio 1 (ya corre antes de agrupar) y, cuando exista, la IA que juzga. |
| Quién la elige | Cualquiera que use el botón, para su propio paquete. No cambia lo que ven los demás. |
| Cupo de 3 a 7 | El programa nunca la mete solo para completar. Entra al paquete solo si la persona la elige. |
| Hasta cuándo | Lo mismo que la observación: menos de 24 h desde la primera nota (`ventanaFrescoHoras`). |

- **Cruce con la vía B:** una 4/5 con firma de la lista ya entra hoy por la vía B como "Respaldada por…". La excepción a mano es solo para las 4/5 sin firma.
- **Qué se toca.** Hoy `enObservacion` trae todo lo que no llegó a 5 y es fresco, de 1/5 a 4/5 sin separar (en la medición, casi todo es 1/5). La excepción necesita que el núcleo marque cuáles se pueden elegir a mano y con qué etiqueta. Lo que se ve (una lista aparte "En observación · les falta 1 medio", con un botón "Llevármela igual") es capa 5 y va con el diseño de la entrega. Mi sugerencia: la parte del núcleo ahora, con tests, porque es chica; la vista después. Lo decidís vos.

### 1.3 · Notas de servicio con plantilla: se sacan en el criterio 1 (decidió Alejo)

- Es el pendiente que dejó Claude Code en `ClaudeCode_para_PREPARADOR_2026-10-04_i.md`. Le pregunté: "¿Las sacamos antes de juntar, como hoy se saca el horóscopo?". Eligió **"Sí, sacarlas: se suman 3 moldes a la etapa Limpiar (a qué hora juega, efemérides y resultados de lotería), buscados con precisión para no llevarse noticias de verdad"**.
- **Por qué:** con datos reales ya se juntan de forma falsa a 3 grupos ("A qué hora juegan Talleres vs. Belgrano… EN VIVO" con otros partidos; "Efemérides de hoy" con la Lotería del Cauca). Un día con muchos medios podrían llegar a 5 y salir como "Confirmada por 5 medios".
- **Qué se ve:** esas notas no aparecen nunca, igual que el horóscopo. En lo descartado quedan con su motivo (propuesta mía: "nota de servicio").
- **Qué se toca:** los 3 moldes en `criterio1` de `config/reglas.json`, junto a horóscopo y quiniela, con tests.
- **Lo que propuse yo (valores por defecto):**
  - Moldes precisos, no una palabra suelta en cualquier parte del título. Por ejemplo, al principio del título. El texto exacto de cada molde lo arma Claude Code mirando los títulos reales.
  - Tests con estos 4 casos. Los 2 primeros son reales del 04-10 y los otros 2 son inventados:

| Título | Tiene que |
|---|---|
| "A qué hora juegan Talleres vs. Belgrano… EN VIVO" | Salir en el criterio 1 |
| "Efemérides de hoy" | Salir en el criterio 1 |
| "Talleres le ganó 2 a 1 a Belgrano en el clásico" | Seguir (es un resultado, no un horario) |
| "Detienen a dos funcionarios de la Lotería por fraude" | Seguir (dice "lotería" pero no es un resultado de lotería) |

- **No decide deportes:** si entran o no los deportes sigue siendo una decisión de Alejo, aparte.

## 2 · Tu carta a

| Tema | Cómo quedó |
|---|---|
| 2.1 · Umbral del agrupador | Lo resolvió la medición: 0 uniones falsas entre los hechos de 5 o más grupos, que es el valor por defecto (cero), así que queda 0.3. No se lo pregunté a Alejo porque se cumplió su valor por defecto. |
| 2.2 · Memoria de lo entregado | Sin tratar. Siguen tus valores por defecto. Lo tomo junto con el diseño de la entrega. |
| 2.3 · Dos relojes | Sin tratar. Siguen los valores por defecto: leer cada 30 minutos, entregar cada 4 h o al apretar el botón. |
| 2.4 · Opción C en el día de ejemplo | Visto. |
| Notas de servicio con plantilla (`pendientes.md`) | Decidido: ver 1.3. |

## 3 · Lo que necesito de Claude Code

1. **Cuántas noticias da la regla de 5 en un día real.** Cuando haya lecturas cada 30 minutos de un día entero (o lo más parecido que se pueda con `--acumular`), contar por bloque (nacional e internacional) y por cada corte de 4 h: cuántos hechos llegan a 5 o más grupos, cuántos quedan en 4/5 sin firma y cuántos tienen firma. Sirve para saber si con 5 fijos se llega al mínimo de 3 por bloque y cuántas 4/5 se ofrecerían para elegir a mano. Sin apuro: depende de la capa 4.
2. **Con los moldes de 1.3 puestos,** repetir la medición sobre lo ya guardado (`--sin-leer`) y mostrar: cuántas notas saca cada molde, con sus títulos para revisarlos a ojo; si las 2 uniones falsas de 3 grupos desaparecen, y si cambia algo en los hechos de 4 o más grupos.

## 4 · Lo que sigue pendiente del DISEÑADOR

Quedan, sin tratar en esta ronda y con los valores por defecto de `pendientes.md`:

- Diseño de la entrega cada 4 h. Ahora suma la vista de la excepción 4/5 y lo de 2.2.
- Las 5 preguntas de la IA que juzga.
- Alternativas a la lista de firmas hecha a mano.
- Ventanas de tiempo para corridas cada 4 h, junto con 2.3.

El ítem del cálculo de verificación sale de esta lista (ver 1.1).

## 5 · Artifacts

- **Regla de los 5 medios:** https://claude.ai/artifact/CrtqRN5vonzq5LJzPAKr7A . Es privado de Alejo; esta carta alcanza para trabajar sin abrirlo. Tiene lo descartado contra lo decidido, tres ejemplos inventados, los números de la medición y una maqueta de cómo se vería una 4/5 elegida a mano.
- **Notas de servicio:** https://claude.ai/artifact/QgbG5pqVE8f5GXCudSrLMw . También es privado. Tiene las 2 uniones falsas reales, la etapa Limpiar antes y después, y los 4 ejemplos de 1.3.
