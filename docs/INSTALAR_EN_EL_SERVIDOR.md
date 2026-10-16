# Instalar 7M en el servidor de Don Julio

Para Alejo, en la compu de Don Julio, con Don Julio al lado y con Claude Code abierto en una tanda («Fase B de la capa 4»). Cada comando va en su renglón: se copia y se pega en la terminal del servidor (Linux). Donde dice `<algo>`, se cambia por el valor de verdad, sin los signos `<` y `>`.

Al terminar, 7M corre solo cada 30 minutos adentro del n8n de Don Julio, y la gente de Canal 2 entra a una dirección con su mail y su contraseña.

Lo que vamos a usar en toda la guía (si Don Julio prefiere otras carpetas, se cambian acá y en todos lados):

| Nombre | Qué es | Valor que se asume |
|---|---|---|
| carpeta del repo | donde vive el código de 7M en el servidor | `/opt/7m` |
| carpeta de datos | donde 7M guarda la lista, la medición y los usuarios | `/opt/7m-datos` |
| dirección de la página | lo que la gente de Canal 2 escribe en el navegador | `https://7m.<dominio de Don Julio>` |

## 1. Lo que Don Julio tiene que confirmar antes de empezar

| Pregunta | Si no contesta, se asume | Por qué importa |
|---|---|---|
| ¿Qué versión de n8n tiene? (en n8n: menú de abajo a la izquierda → «About n8n», o `docker exec <contenedor> n8n --version`) | 2.x (la última es la 2.43; 7M se probó con la 2.43.6) | Desde la 2.0 los nodos «Code» corren en un proceso aparte («task runner»). Si usa **runners externos** (un segundo contenedor `n8nio/runners`), las dos carpetas y las variables del paso 2 van en **ese** contenedor, no en el de n8n. Desde la 3.0 los runners internos quedan viejos y conviene el externo: ahí también va todo en el contenedor de runners. Con la 1.x vieja (antes de la 1.111) va todo en el contenedor de n8n. |
| ¿Corre con Docker o instalado con npm? | Docker | Con Docker hay que «montar» las carpetas en el contenedor. Con npm, n8n 2.x pide Node 24. |
| ¿Cómo se entra al servidor? (SSH con un usuario para Alejo, o tipea Don Julio) | Tipea Don Julio | Quién pega los comandos. |
| ¿Tiene un servidor web con HTTPS delante (nginx, Apache, Caddy)? ¿Cuál? | Sí, nginx | El login escucha solo adentro del servidor (`127.0.0.1:7000`); el servidor web lo publica con HTTPS. Si no tiene ninguno, se instala Caddy (paso 5). |
| La casilla de correo para 7M: servidor SMTP, puerto, usuario y contraseña | — (hace falta sí o sí) | Manda los avisos y los mails de «olvidé mi clave». Se carga **solo en n8n** (paso 3), nunca en un archivo. |
| La clave de la API de Anthropic | — (la crea Alejo en su cuenta, en console.anthropic.com → API Keys) | La IA que juzga. Se carga **solo en n8n** (paso 3). |
| ¿Tiene Node 20 o más en el servidor, afuera de Docker? (`node -v`) | No | El login (`scripts/servir.js`) corre afuera de n8n y necesita Node 20 o más. |

## 2. Bajar el código

En la terminal del servidor:

```
sudo git clone -b claude/trusting-knuth-brmpsy https://github.com/AAlejoB/NOTITAN_7M.git /opt/7m
```

```
sudo mkdir -p /opt/7m-datos
```

El usuario de n8n adentro del contenedor es el número 1000: tiene que poder escribir en la carpeta de datos.

```
sudo chown -R 1000:1000 /opt/7m-datos
```

Si no hay Node 20 o más afuera de Docker (para el login), se instala:

```
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
```

```
sudo apt-get install -y nodejs
```

### Con Docker: montar las carpetas y dos variables

El contenedor de n8n tiene que «ver» las dos carpetas y dejar que el nodo «Code» use nuestro código. Hay que agregar dos carpetas y dos variables a cómo se arranca n8n.

**Si n8n se arranca con `docker-compose.yml`**, en el servicio de n8n se suman estos renglones (Don Julio sabe dónde está el archivo):

```
    volumes:
      - /opt/7m:/home/node/7m:ro
      - /opt/7m-datos:/home/node/7m-datos
    environment:
      - NODE_FUNCTION_ALLOW_EXTERNAL=*
      - NODE_FUNCTION_ALLOW_BUILTIN=*
```

(Si ya hay un `volumes:` o un `environment:`, se agregan los renglones adentro del que ya está, no un segundo.)

**Si se arranca con `docker run`**, se suman estas cuatro partes al comando:

```
-v /opt/7m:/home/node/7m:ro -v /opt/7m-datos:/home/node/7m-datos -e NODE_FUNCTION_ALLOW_EXTERNAL=* -e NODE_FUNCTION_ALLOW_BUILTIN=*
```

Qué es cada cosa:

- `/opt/7m:/home/node/7m:ro`: el código de 7M aparece adentro de n8n en `/home/node/7m`, solo para leer.
- `/opt/7m-datos:/home/node/7m-datos`: la carpeta de datos aparece adentro de n8n en `/home/node/7m-datos`; ahí n8n escribe la lista.
- `NODE_FUNCTION_ALLOW_EXTERNAL=*`: deja que el nodo «Code» cargue nuestro código del disco (`src/capa4.js`).
- `NODE_FUNCTION_ALLOW_BUILTIN=*`: deja que el nodo «Code» lea archivos (`config/*.json`).

Son variables **del contenedor de n8n** (o del de runners, si usa runners externos: ver el cuadro 1), no de la compu.

Después, reiniciar n8n:

```
docker compose up -d
```

(o, con `docker run`, borrar el contenedor y volver a crearlo con el comando nuevo: los datos de n8n no se pierden si están en su volumen de siempre).

### Con npm (sin Docker)

Las variables van en el lugar donde se arranca n8n (por ejemplo, su unidad de systemd: `Environment=NODE_FUNCTION_ALLOW_EXTERNAL=*` y `Environment=NODE_FUNCTION_ALLOW_BUILTIN=*`). No hace falta montar nada: en el nodo «Rutas» se escriben `/opt/7m` y `/opt/7m-datos` en vez de `/home/node/...`.

## 3. Las tres credenciales en n8n

En n8n: **Overview → Create → Credential** (o «Credentials» en el menú de la izquierda → «Add credential»). Se crean tres, con estos nombres exactos:

| Nombre | Tipo | Qué va |
|---|---|---|
| `7M Anthropic` | Header Auth | Name: `x-api-key` · Value: la clave de la API de Anthropic |
| `7M Correo` | SMTP | Los datos de la casilla: User, Password, Host, Port y SSL/TLS como diga el proveedor |
| `7M Webhook` | Header Auth | Name: `x-7m-clave` · Value: una clave inventada (por ejemplo, 30 letras y números al azar). Anotarla: va también en el paso 5 |

## 4. Importar los cuatro workflows

En n8n, para cada archivo: **Create → Workflow**, menú **⋯** arriba a la derecha → **Import from File…**, y elegir el archivo de la carpeta `n8n/` del repo (Alejo los baja de GitHub a su compu, o se usa `n8n import:workflow --input=/home/node/7m/n8n/<archivo>` adentro del contenedor). Guardar cada uno.

1. `vuelta.json` → «7M · vuelta cada 30 minutos».
2. `correo.json` → «7M · correo».
3. `error.json` → «7M · si la vuelta se rompe».
4. `prueba-union.json` → «7M · prueba de la unión (3 veces)».

Después de importar, en cada uno:

- **Nodo «Rutas»** (doble clic): `carpetaRepo` = `/home/node/7m` y `carpetaDatos` = `/home/node/7m-datos` (ya vienen así; con npm, `/opt/7m` y `/opt/7m-datos`). En la vuelta y en el error, `correoAvisos` = los mails de Alejo y de Don Julio, separados por coma, y `correoDesde` = la casilla de 7M. En la vuelta, también `configZona` = `config/zona` (ya viene así): con eso la vuelta baja además los 8 feeds de Comodoro y Chubut y la página muestra los cuatro bloques; vacío, corre solo lo nacional e internacional.
- **El bloque «Avisos»** (cortes de agua, luz y gas de Comodoro) no necesita configurar nada: si `configZona` está puesto, la vuelta baja sola la página de comunicados de la SCPL (la dirección está en `config/zona/avisos.json`) y las notas nuevas. El cronograma de verano de cortes de agua lo actualiza Alejo en `config/zona/cronograma-agua.json` cuando la SCPL publica el cuadro nuevo.
- **Nodos con credencial**: abrir «IA» y elegir `7M Anthropic`; «Avisar» y «Mandar», `7M Correo`; «Webhook», `7M Webhook`. En «Mandar» (correo), «From Email» = la casilla de 7M.
- En la vuelta: **⋯ → Settings → Error Workflow** = «7M · si la vuelta se rompe». Guardar.

Activar la vuelta y el correo (el interruptor «Active»; en n8n 2.x, el botón «Publish»). El error y la prueba no se activan.

## 5. El login

El archivo del servidor para el login (cambiar los dos valores):

```
sudo nano /opt/7m-datos/servidor.json
```

Adentro, esto (con la clave inventada del paso 3 y la dirección de la página):

```
{ "clave": "<la misma clave inventada de 7M Webhook>", "direccion": "https://7m.<dominio de Don Julio>" }
```

Guardar con Ctrl+O, Enter, Ctrl+X.

Una persona por cada una de Canal 2 (3, por ahora; Alejo pide los mails en ese momento). Cada vez muestra una contraseña temporal **una sola vez**: anotarla y pasársela a esa persona por un canal privado.

```
cd /opt/7m
```

```
sudo -u '#1000' node scripts/usuario.js --carpeta /opt/7m-datos agregar <mail de la persona>
```

Para ver quiénes están: `node scripts/usuario.js --carpeta /opt/7m-datos listar`. Para sacar a alguien: `... sacar <mail>`. Si a alguien no le llega el mail de «olvidé mi clave»: `... nueva-clave <mail>`.

### Dejar el login corriendo siempre (systemd)

```
sudo nano /etc/systemd/system/7m-login.service
```

Adentro, esto entero:

```
[Unit]
Description=7M · pagina con login
After=network.target

[Service]
WorkingDirectory=/opt/7m
ExecStart=/usr/bin/node scripts/servir.js --carpeta /opt/7m-datos --puerto 7000 --escucha 127.0.0.1 --n8n http://127.0.0.1:5678
Restart=always
RestartSec=5
User=1000

[Install]
WantedBy=multi-user.target
```

(Si `node` no está en `/usr/bin/node`, poner lo que diga `which node`. Si n8n escucha en otro puerto, cambiar el `5678`.)

```
sudo systemctl daemon-reload
```

```
sudo systemctl enable --now 7m-login
```

```
sudo systemctl status 7m-login
```

Tiene que decir `active (running)`.

### El servidor web con HTTPS delante

El login escucha solo adentro del servidor. El servidor web de Don Julio lo publica con HTTPS. Don Julio adapta uno de estos dos ejemplos.

**nginx** (un bloque nuevo; el certificado, con el certbot que ya use Don Julio):

```
server {
    server_name 7m.<dominio de Don Julio>;
    location / {
        proxy_pass http://127.0.0.1:7000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    listen 443 ssl;
}
```

**Caddy** (si no tiene ninguno; Caddy saca el certificado solo):

```
7m.<dominio de Don Julio> {
    reverse_proxy 127.0.0.1:7000
}
```

## 6. Probar

1. **La prueba de la unión.** Abrir «7M · prueba de la unión (3 veces)» → «Execute workflow». Tarda unos segundos. Clic en el nodo «Resultado»: un renglón por caso (con sus 3 intentos) y el último dice `"resumen": "pasa"` o `"no pasa"`. Se anota en el reporte. **La unión no se prende en esta tanda**, pase o no pase.
2. **Una vuelta.** En la vuelta, nodo «Cada 30 minutos» → poner 1 minuto, guardar, esperar 2 minutos. En **Executions** (arriba) tienen que aparecer dos vueltas en verde. Abrir la primera, nodo «Decidir»: dice cuántas preguntas hizo la IA (`ia`), cuántas noticias salieron con bloque provisorio (`provisorias`) y cuánto tardó (`tardoMs`). En la segunda vuelta, `ia.preguntadas` tiene que ser 0 o casi 0 (ya juzgó). En `resumen` (también en «Decidir») tienen que estar los dos renglones de la zona: «Zona · feeds: 8 OK…» y «Zona · lista: N Comodoro + N Chubut…», y el de los avisos: «Avisos: N vigentes … · SCPL OK · … comunicados en el listado · N bajados» (en la segunda vuelta, «0 bajados»: lo ya bajado no se vuelve a pedir). **Volver a poner 30 minutos y guardar.** Ojo: apretar «Execute workflow» a mano no guarda lo acumulado; solo las vueltas del reloj lo guardan. Lo que n8n guarda entre vueltas (en los datos estáticos del workflow) son las notas de 48 h, los juicios de la IA, la hora del último aviso, las notas de 48 h de la zona y las notas de la SCPL de los últimos 30 días.
3. **La página desde el celular.** Entrar a la dirección de la página: pide mail y contraseña. Entrar con la temporal, ver la lista (arriba dice «Canal 2 · 7M»), probar «Olvidé mi clave» (tiene que llegar el mail, y la contraseña nueva entra), y «Salir».
4. **La medición**, en la terminal:

```
node /opt/7m/scripts/medir.js --carpeta /opt/7m-datos
```

## 7. Si algo falla

| Qué pasa | Qué mirar |
|---|---|
| La vuelta se pone roja en «Feeds» o «Preparar» con un error de `require` o «Cannot find module» | Faltan las variables del paso 2, o las carpetas no están montadas, o (con runners externos) están en el contenedor equivocado. Probar: `docker exec <contenedor> ls /home/node/7m/src` tiene que mostrar `capa4.js`. |
| La vuelta se rompe con «EACCES» o «permission denied» | La carpeta de datos no es del usuario 1000: repetir el `chown` del paso 2. |
| La IA contesta 401 (en la ejecución, nodo «IA») | La credencial `7M Anthropic`: el nombre tiene que ser `x-api-key` y el valor la clave entera. Si contesta 404 con «model», el modelo de `config/reglas.json` (`ia.modelo`) ya no existe: avisar a Cowork. |
| No llega el mail (aviso u «olvidé mi clave») | La credencial `7M Correo`, y en n8n → Executions → «7M · correo»: ¿hay una ejecución roja? ¿Está activo? Para «olvidé mi clave», `sudo journalctl -u 7m-login -n 50` dice si n8n no contestó. |
| La página no carga | `sudo systemctl status 7m-login` (¿corre?) y el bloque del servidor web (¿apunta a `127.0.0.1:7000`?). |
| La página dice «No se actualiza desde las HH:MM · contactá al administrador» | La vuelta no corre: ¿está activa? ¿La última ejecución es roja? |

Un cambio de código: `cd /opt/7m` y `sudo git pull`. Lo de `config/` vale desde la vuelta siguiente; lo de `src/` y `scripts/`, después de reiniciar n8n (`docker compose restart`) y el login (`sudo systemctl restart 7m-login`).

## La IA falsa (solo para probar)

`scripts/ia-falsa.js` es una IA de mentira que contesta siempre lo mismo. Sirve para probar la vuelta si la clave de Anthropic todavía no llegó: se arranca con `node scripts/ia-falsa.js` y en el nodo «IA» se pone su dirección (escucha solo en `127.0.0.1:7100`: con Docker hay que correrla adentro del contenedor de n8n; Claude Code te guía en la tanda). **No sirve para la prueba de la unión** (siempre dice «no son la misma») y no se deja puesta.
