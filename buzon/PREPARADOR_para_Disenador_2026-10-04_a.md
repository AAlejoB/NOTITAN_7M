# PREPARADOR → DISEÑADOR · 04-10-2026 · 14:46 (hora de Argentina) · letra a

Es la primera carta. Todavía no hay `Disenador_para_PREPARADOR_*`.

**Veredicto:** le pedí a Claude Code tres cosas que no tocan ninguna decisión de Alejo, más una medición con datos reales. Hay tres temas que piden diseño con Alejo. Cada uno tiene un valor por defecto, así que nada se frena mientras tanto.

## 1 · Lo que viene de Claude Code (`PREPARADOR_para_ClaudeCode_2026-10-04_a.md`)

| Paso | Qué cambia para quien usa el programa |
|---|---|
| 1 | Se apaga el aviso "¿feed roto?" de los 6 portales sin feed: Reuters, AP, AFP, EFE, La Voz y LN+. Eran 6, no 4 como decía el pendiente. |
| 2 | Lo leído se puede guardar entre lecturas y verificar sobre 48 h juntas, no sobre una sola foto. |
| 3 | Una regla nueva del agrupador, y una tabla que mide tres variantes con datos reales. |

## 2 · Para decidir con Alejo

### 2.1 · Umbral del agrupador: más noticias contra el riesgo de juntar dos hechos distintos

Hoy el umbral es 0,5 y con datos reales casi no se junta nada: 0 verificados. Bajarlo a 0,3 junta más, pero también une dos etapas distintas de un mismo tema. Encontré que eso rompe un test que existe justamente para cuidar ese caso. Propuse una regla intermedia: con un umbral bajo, una nota se suma a un hecho solo si además comparte al menos 3 palabras con otra nota del grupo.

| Ejemplo | Hoy (0,5) | 0,3 sola | 0,3 con 3 palabras en común |
|---|---|---|---|
| "Brasil: Lula y Bolsonaro definirán la presidencia en un balotaje" / "Elecciones en Brasil: Lula ganó la primera vuelta pero habrá balotaje con Bolsonaro" | Separadas (mal) | Juntas (bien) | Juntas (bien) |
| "Diputados aprobó el Presupuesto" / "Diputados empezó a debatir el Presupuesto" | Separadas (bien) | Juntas (**mal**: 3 medios del debate más 2 de la aprobación darían "Confirmada por 5") | Separadas (bien) |

Hay un límite conocido que ninguna variante arregla: "Boca le ganó a Racing…" y "River le ganó a Racing…" se juntan aun con 0,5.

**Lo que hace falta decidir:** ¿cuántas uniones falsas se aceptan entre las noticias que salen como "Confirmada por N medios"? **Valor por defecto: cero.** Claude Code baja a 0,3 con la regla nueva solo si en la medición no aparece ninguna. Para decidir conviene esperar su tabla, que te paso apenas llegue.

### 2.2 · Memoria de lo ya entregado (va junto con el diseño de la entrega cada 4 h)

No la mandé a construir porque primero hay que diseñar qué ve quien usa el programa. Estas son las preguntas, con su valor por defecto:

| Pregunta | Valor por defecto |
|---|---|
| Lo ya entregado, ¿se oculta o se muestra marcado ("enviada a las 10:00")? | Se oculta 24 h y queda en la Reserva con el motivo "ya entregada" |
| ¿La lista es por persona? La hermana de Alejo y un cliente no deberían compartirla | Sí, una lista por persona |
| ¿Cuánto dura? | 24 h |
| ¿"Entregada" quiere decir "publicada"? La hermana pudo no usarla | No. Por ahora no hay botón de "volver a ver" |

Dos ejemplos de novedades:

1. A las 10:00 sale "Diputados empezó a debatir el Presupuesto" y a las 14:00 aparece "Diputados aprobó el Presupuesto". **Valor por defecto: sale como nueva**, porque con la regla nueva el agrupador las separa.
2. A las 10:00 sale "Brasil va a balotaje" y a las 14:00 más medios confirman lo mismo. **Valor por defecto: no vuelve a salir.**

### 2.3 · Dos relojes: leer seguido y entregar cada 4 h (capa 4, con Don Julio)

Con los datos de Claude Code, el feed de Clarín abarca 0,5 h e Infobae 1,2 h. Si el programa lee solo cuando entrega, cada 4 h, se pierde la mayor parte de lo que publican. Por eso son dos relojes distintos:

| Reloj | Para qué | Valor por defecto |
|---|---|---|
| Lectura | Juntar notas sin perder las de los feeds cortos | Cada 30 minutos |
| Entrega | Lo que recibe quien aprieta el botón | Cada 4 h, o cuando lo aprietan |

Esto también toca tu pendiente de las ventanas (48 h de recolección y 24 h de frescura). Hasta que lo decidas, lo acumulado usa 48 h.

### 2.4 · Solo para que lo sepas: opción C en el día de ejemplo

El día de ejemplo ahora dice explícitamente que una noticia internacional se confirma también con medios argentinos (la opción C, que es el valor por defecto hasta que Alejo decida). Si Alejo elige "argentinos afuera", ese ejemplo se tiene que rehacer, y va a quedar a la vista.

## 3 · Qué necesito de vos

Un `Disenador_para_PREPARADOR_*` con lo que decidan sobre 2.1, 2.2 y 2.3. Si Alejo dice "dejalo pendiente", alcanza con anotarlo: quedan los valores por defecto. Para 2.1, esperá la tabla de la medición.
