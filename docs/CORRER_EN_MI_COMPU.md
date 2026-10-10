# Correr el día de medición en tu compu

Para Windows 10 u 11, con PowerShell. Cada comando va en su renglón: lo copiás y lo pegás.

## 1. Qué vas a hacer

Dejar la compu leyendo los portales cada 30 minutos durante un día entero, para medir cuántas noticias llegan a 5 medios.

Hace falta:

- La compu prendida y con internet, 24 horas o más.
- Unos 10 minutos para instalar.

Todo lo que se baja queda en una carpeta `datos\` de esa compu. No se sube a ningún lado.

## 2. Instalar Node

1. Entrá a https://nodejs.org y bajá la versión «LTS» para Windows (el instalador `.msi`).
2. Abrilo y aceptá todo.
3. Abrí PowerShell: tecla Windows, escribí `PowerShell`, Enter.
4. Escribí esto y Enter:

```
node -v
```

Tiene que decir `v20` o un número mayor. Si dice que `node` no se reconoce, cerrá PowerShell y abrilo de nuevo.

## 3. Bajar el repo

Hay dos formas. Con una alcanza.

**Con Git:**

```
git clone -b claude/trusting-knuth-brmpsy https://github.com/AAlejoB/NOTITAN_7M.git C:\7M
```

**Sin Git:**

1. Entrá a https://github.com/AAlejoB/NOTITAN_7M.
2. Botón verde «Code» → «Download ZIP».
3. Descomprimí.
4. La carpeta que sale se llama `NOTITAN_7M-claude-trusting-knuth-brmpsy`. Renombrala a `C:\7M`.

Después, en PowerShell:

```
cd C:\7M
```

No hace falta `npm install`: el programa no tiene dependencias.

## 4. Probar una vuelta

```
npm run vuelta
```

Tarda unos segundos. Tiene que terminar con estas dos líneas (o casi):

- `Feeds: 19 OK · 0 caídos`
- `Código de salida: 0`

Si las tildes o el punto del medio se ven como caracteres raros, no importa.

Si PowerShell dice que no puede cargar `npm.ps1` porque la ejecución de scripts está deshabilitada, usá `npm.cmd` en vez de `npm` en todos los comandos de esta guía.

## 5. Que la compu no se duerma

1. Configuración → Sistema → Energía (o «Energía y batería») → Pantalla y suspensión.
2. En «suspender», poné «Nunca» cuando está enchufada.

Si es una notebook: dejala enchufada y no cierres la tapa (o, en las opciones de energía, «Al cerrar la tapa: no hacer nada»).

La pantalla sí se puede apagar.

## 6. Dejarlo corriendo

```
npm run vuelta -- --cada 30
```

- No cierres esa ventana de PowerShell.
- Cada 30 minutos escribe un resumen.
- Lo ideal: arrancar antes de la medianoche y cortar después de la medianoche siguiente, así queda un día calendario entero. Como mínimo, 24 horas.
- Si la compu se apagó o la ventana se cerró, volvé a correr el mismo comando: sigue con lo que ya había guardado.
- Si dice «Hay otra vuelta corriendo … (vuelta.lock)», esperá 25 minutos o borrá el archivo `C:\7M\datos\vuelta.lock`.

## 7. Mientras corre, ver la lista

1. Abrí otra ventana de PowerShell.
2. Escribí:

```
cd C:\7M
```

```
npm run ver
```

3. En el navegador entrá a http://127.0.0.1:7000/

«Traer noticias» trae lo último que armó la vuelta. Se ve solo en esa compu.

## 8. Al terminar

1. En la ventana de la vuelta, Ctrl+C.
2. Escribí:

```
npm run medir
```

3. Copiá todo lo que imprime.

Lo que hay que mandarle al chat de Cowork:

- Ese texto, pegado.
- El archivo `C:\7M\datos\vueltas.jsonl`, adjunto.

Nada de esto se sube a GitHub.

## 9. Si algo falla

| Qué dice | Qué hacer |
|---|---|
| `node` no se reconoce | Cerrá PowerShell y abrilo de nuevo. Si sigue, reinstalá Node. |
| No puede cargar `npm.ps1` | Usá `npm.cmd` en vez de `npm`. |
| `Feeds: 0 OK` o `Código de salida: 2` | No hay internet. Revisá la conexión y volvé a correr. |
| `Código de salida: 3` | Hay un candado: mirá el punto 6 («Hay otra vuelta corriendo»). |
