# El paquete de cliente

Qué cosas son de un cliente (hoy, Canal 2), dónde vive cada una y en qué estado está. La regla del proyecto es que todo lo que es de un cliente viva en `config/` (o, si es privado, en la carpeta de datos del servidor), para que sumar otro cliente sea copiar una carpeta y no tocar código.

| Qué es del cliente | Dónde vive hoy | Estado |
|---|---|---|
| Nombre del cliente (sale arriba en la página) | `config/reglas.json` → `cliente` (hoy «Canal 2») | Hecho |
| Cuántas noticias por bloque | `config/reglas.json` → `cupoPorBloque` (hoy 7) y `cupoMinimo` (hoy 3) | Hecho |
| Anillos de zona (Comodoro y Chubut) | `config/zona/` (feeds, portales y reglas de los anillos) | Hecho; en el servidor corre si el nodo Rutas trae `configZona` |
| Usuarios que entran a la página | `datos/usuarios.json` en el servidor, se cargan con `scripts/usuario.js`; nunca en el repo | Hecho |
| Portales y feeds nacionales e internacionales | `config/portales.json` y `config/feeds.json` | Hecho, pero hoy es una sola lista para todos los clientes |
| Escalón Normal o Plus | `config/reglas.json` → `pagina.escalon` (`"normal"` o `"plus"`; hoy `"plus"`) | Hecho (página C, 17-10) |
| Temas (cómo arranca cada botón) | `config/reglas.json` → `pagina.temas`: hasta 10, cada uno con `nombre`, `prendido`, `secciones` (las de los portales que le ponen ese tema) y `palabras` (del título, en minúsculas y sin tildes, para que un cliente arme el suyo, por ejemplo «Petróleo»). Vale también para la zona | Hecho (página C, 17-10) |
| Nombre del producto y motivos de «No por hoy» | `config/reglas.json` → `pagina.nombre` (hoy «7M») y `pagina.motivos` (los siete) | Hecho (página C, 17-10) |
| Las decisiones de cada persona en la página | `<datos>/personas/<mail>.json` en el servidor (las escribe `scripts/servir.js`); sin login, en el navegador. Nunca en el repo | Hecho (página C, Fase B) |
| Largos de la pieza 2 (título, portal, Facebook, Instagram) | todavía no existe (irá en `config/`) | Espera la pieza 2 |
| Avisos de cortes (agua, luz, gas) | `config/zona/avisos.json` (fuentes: hoy la SCPL) y `config/zona/cronograma-agua.json` (el cronograma de verano, lo actualiza Alejo) | Hecho en `npm run vuelta -- --zona config/zona` y en el servidor (capa 4, la vuelta de n8n; carta `d`). Qué portal es de la ciudad y cuál provincial sale de `config/zona/portales.json` (`zona`): lo provincial entra a Avisos solo si el título nombra uno de los `lugares` de `config/zona/avisos.json` (es de cada cliente; hoy `["comodoro", "rada tilly"]`, en minúsculas y sin tildes; sin la clave valen esos dos) |

**Cómo se clonaría hoy para un segundo cliente.** Se copia `config/` a una carpeta propia del cliente nuevo (por ejemplo `clientes/<nombre>/config/`) y se cambian ahí el nombre, los cupos, los portales y, si tiene zona, su carpeta de zona. La vuelta corre con esa carpeta, y sus datos y su página van a otra carpeta de datos (por ejemplo `datos/<nombre>/`, con sus propios usuarios). El código es el mismo para los dos; lo único distinto son las carpetas.

**Lo que decidió Alejo el 14-10:** una sola empresa ahora; multi-empresa después, por clonado o por licencia por empresa. Este documento sirve para el día que eso se decida: dice qué hay que copiar y qué todavía falta.
