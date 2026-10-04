# Arranque de cada tanda

Borrador armado por Claude Code el 04-10-2026 con lo que Alejo contó de su método en ST. Claude Code no tiene el `ESTANDAR_CHAT_POR_TANDA.md` de ST (vive en la PC de Alejo): si difiere, manda el de ST y se corrige acá.

## Qué es una tanda

Una vuelta completa: el DISEÑADOR decide, el PREPARADOR arma el pedido, Claude Code ejecuta y reporta. Cuando la tanda cierra, todo vuelve a empezar desde cero.

## El ciclo

1. **Se cierra la tanda.** Claude Code deja su reporte, actualiza `buzon/pendientes.md` y `CLAUDE.md`, y pushea.
2. **Alejo hace `/clear` en Claude Code.**
3. **Alejo borra los chats de Cowork** del DISEÑADOR y del PREPARADOR.
4. **Abre chats nuevos** y los arranca con una línea que apunta a un archivo (los textos están abajo).

La memoria es el repo, no el chat. Lo que no quedó escrito en un archivo se pierde con el `/clear`. Por eso cada tanda termina con `pendientes.md` al día.

## Antes de cerrar una tanda, tiene que estar escrito

- `buzon/pendientes.md`: lo hecho tachado, lo nuevo anotado con a quién le toca.
- `CLAUDE.md`: estado y decisiones nuevas de Alejo.
- Un reporte `ClaudeCode_para_PREPARADOR_<fecha>_<letra>.md`.
- Todo pusheado a la rama.

## Qué pegar en cada chat nuevo

Si el chat de Cowork no puede leer el repo, pegarle además el contenido de los archivos que nombra.

Para el DISEÑADOR:

```
DESDE ACÁ
Chat nuevo. Sos el DISEÑADOR de NOTITAN_7M. Leé buzon/LEEME.md (tu rol), CLAUDE.md y la sección DISEÑADOR de buzon/pendientes.md. Trabajamos un tema por vez. No escribís código: me ayudás a decidir y a dibujar, y lo que decidimos va al PREPARADOR en un archivo Disenador_para_PREPARADOR_<fecha>_<letra>.md.
HASTA ACÁ
```

Para el PREPARADOR:

```
DESDE ACÁ
Chat nuevo. Sos el PREPARADOR de NOTITAN_7M. Leé buzon/LEEME.md (tu rol), CLAUDE.md, buzon/pendientes.md y los archivos Disenador_para_PREPARADOR_* y ClaudeCode_para_PREPARADOR_* más nuevos. Armá el pedido para Claude Code en PREPARADOR_para_ClaudeCode_<fecha>_<letra>.md.
HASTA ACÁ
```

Para Claude Code, después del `/clear`:

```
DESDE ACÁ
Leé buzon/LEEME.md, buzon/pendientes.md y el PREPARADOR_para_ClaudeCode_* más nuevo, y hacelo. Al terminar, dejá tu reporte en buzon/ y actualizá pendientes.md.
HASTA ACÁ
```

Claude Code ya lee `CLAUDE.md` solo al abrir la sesión.
