# El paquete de cliente

Qué cosas son de un cliente (hoy, Canal 2), dónde vive cada una y en qué estado está. La regla del proyecto es que todo lo que es de un cliente viva en `config/` (o, si es privado, en la carpeta de datos del servidor), para que sumar otro cliente sea copiar una carpeta y no tocar código.

| Qué es del cliente | Dónde vive hoy | Estado |
|---|---|---|
| Nombre del cliente (sale arriba en la página) | `config/reglas.json` → `cliente` (hoy «Canal 2») | Hecho |
| Cuántas noticias por bloque | `config/reglas.json` → `cupoPorBloque` (hoy 7) y `cupoMinimo` (hoy 3) | Hecho |
| Anillos de zona (Comodoro y Chubut) | `config/zona/` (feeds, portales y reglas de los anillos) | Hecho; en el servidor corre si el nodo Rutas trae `configZona` |
| Usuarios que entran a la página | `datos/usuarios.json` en el servidor, se cargan con `scripts/usuario.js`; nunca en el repo | Hecho |
| Portales y feeds nacionales e internacionales | `config/portales.json` y `config/feeds.json` | Hecho, pero hoy es una sola lista para todos los clientes |
| Escalón Normal o Plus | todavía no existe (irá en `config/`, campo `escalon`) | Espera la página C |
| Temas (cómo arranca cada botón) | todavía no existe (irá en `config/`) | Espera la página C |
| Largos de la pieza 2 (título, portal, Facebook, Instagram) | todavía no existe (irá en `config/`) | Espera la pieza 2 |
| Avisos de cortes (agua, luz, gas) | `config/zona/avisos.json` (fuentes: hoy la SCPL) y `config/zona/cronograma-agua.json` (el cronograma de verano, lo actualiza Alejo) | Hecho en `npm run vuelta -- --zona config/zona`; en el servidor (capa 4), la Fase B de la carta `c` |

**Cómo se clonaría hoy para un segundo cliente.** Se copia `config/` a una carpeta propia del cliente nuevo (por ejemplo `clientes/<nombre>/config/`) y se cambian ahí el nombre, los cupos, los portales y, si tiene zona, su carpeta de zona. La vuelta corre con esa carpeta, y sus datos y su página van a otra carpeta de datos (por ejemplo `datos/<nombre>/`, con sus propios usuarios). El código es el mismo para los dos; lo único distinto son las carpetas.

**Lo que decidió Alejo el 14-10:** una sola empresa ahora; multi-empresa después, por clonado o por licencia por empresa. Este documento sirve para el día que eso se decida: dice qué hay que copiar y qué todavía falta.
