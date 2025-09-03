# 2025_TP02_Docker

**_Imagen en Docker Hub:_** https://hub.docker.com/r/imadecara/compose-app

## _1. Construir las imágenes_

<ins>**Opción A** — Usar la imagen publicada (recomendado)</ins>

`_docker compose pull_`

Imágenes usadas:
* **App:** imadecara/compose-app:v1.0.
* **DB:** postgres:16-alpine.


<ins>**Opción B** — Construir (y opcionalmente publicar) la imagen localmente</ins>

Preparamos la carpeta del Dockerfile  
`docker build -t imadecara/compose-app:1.0.0 -t imadecara/compose-app:v1.0 -t imadecara/compose-app:latest`

Publicar en Docker Hub
```
docker login
docker push imadecara/compose-app:1.0.0  
docker push imadecara/compose-app:v1.0  
docker push imadecara/compose-app:latest
```

## _2. Ejecutar los contenedores_

<ins>**Creamos los archivos del entorno**</ins>  

**QA:** `echo 'DATABASE_URL=postgres://appuserqa:secretqa@db-qa:5432/appdbqa' > env.qa`  
**PROD:**`echo 'DATABASE_URL=postgres://appuserprod:secretprod@db-prod:5432/appdbprod' > env.prod`

<ins>**Damos de alta todo**</ins>  
```
docker compose up -d
docker compose ps
```

## _3. Acceder a la aplicación (URLs, puertos)_
La app escucha en _3000_ dentro del contenedor; 
Compose mapea _3001_ (QA) y _3002_ (PROD) en tu nuestra maquina

**QA**  
*Raíz: `http://localhost:3001/`  
*Items: `http://localhost:3001/items`

**PROD**  
*Raíz: `http://localhost:3002/`  
*Items: `http://localhost:3002/items`

## _4. Conectarse a la base de datos_
Abrir psql dentro de cada contenedor:  
**QA:** `docker compose exec db-qa psql -U appuserqa -d appdbqa`
**PROD:** `docker compose exec db-prod psql -U appuserprod -d appdbprod`

Consultas útiles en psql: `SELECT * FROM items;`

## _5. Verificar que todo funciona correctamente_

```
curl http://localhost:3001/
curl http://localhost:3002/
```
**Deberían responder JSON con:** _[{"id":1,"name":"Primero"},{"id":2,"name":"Segundo"},{"id":3,"name":"Tercero"}]_

**_Si /items dice que la relación no existe, ejecutar el script de inicialización_**
**QA:** `docker compose exec -T db-qa   psql -U appuserqa   -d appdbqa   -f /docker-entrypoint-initdb.d/init.sql`
**PROD:** `docker compose exec -T db-prod psql -U appuserprod -d appdbprod -f /docker-entrypoint-initdb.d/init.sql`
