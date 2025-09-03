# Decisiones

_Este documento resume qué hicimos, por qué y cómo en cada etapa del trabajo práctico. La idea fue optimizar el tiempo para enfocarnos en Docker (imágenes, redes, variables de entorno, volúmenes, orquestación con Compose) manteniendo una app simple pero realista_

## _**1. Elegir y preparar tu aplicación**_
**Qué elegimos?:** Optamos por una aplicación web mínima en Node.js + Express con dos endpoints: un “ping” para verificar que el servicio está vivo y un endpoint "items" que consulta datos en PostgreSQL.
**Por qué así?:**. Node + Express es un stack liviano, conocido y bien documentado, ideal para practicar containerización sin distraernos con lógica de negocio compleja.

**Generación con IA:** La aplicación fue generada con inteligencia artificial a propósito, para ahorrar tiempo y centrar el esfuerzo en los aprendizajes de Docker. Ajustamos lo mínimo necesario (por ejemplo, variables de entorno y conexión a DB) para que sirviera al objetivo del TP.


## _**2. Construir una imagen personalizada**_
**Imagen base elegida:** Usamos node:20-alpine. La elegimos por ser oficial y LTS, y por su base Alpine, que la hace ligera (descarga/build rápidos) y con menor superficie de ataque.
**Construimos la imagen con nuestro namespace de Docker Hub y un tag claro:**
`docker build -t imadecara/compose-app:0.1.0 -t imadecara/compose-app:latest`
La primera etiqueta _(0.1.0)_ nos sirve como versión fija; _latest_ lo usamos solo como puntero de conveniencia en pruebas.

**Para verificar que la imagen corría bien, hicimos una prueba local rápida:**
`docker run -p 3000:3000 imadecara/compose-app:0.1.0 y abrimos http://localhost:3000/` para chequear la respuesta de salud.

## _**3. Publicar la imagen en Docker Hub**_
Repositorio, Publicamos en Docker Hub bajo _imadecara/compose-app_

**Cómo la publicamos (breve):**
_**1. Login en Docker Hub desde la terminal:**_ `docker login`  
_**2. Etiquetamos la imagen local con nuestro namespace y un tag claro (p. ej. 0.1.0):**_  `docker build -t imadecara/compose-app:0.1.0`  
_**3. Publicamos ese tag (y el alias de conveniencia latest):**_  
```
docker push imadecara/compose-app:0.1.0
docker push imadecara/compose-app:latest
```

Verificamos en Docker Hub que los tags aparezcan en el repositorio.

**Estrategia de versionado:** Adoptamos _**SemVer**_ (MAJOR.MINOR.PATCH) para versiones inmutables (por ejemplo 1.0.0) y mantuvimos un alias _latest_ para conveniencia. Más adelante, para cumplir con la consigna, creamos el alias _v1.0_ y lo usamos como referencia estable en Compose.

## _**4. Integrar una base de datos en contenedor**_
**DB elegida:** _PostgreSQL_ (imagen postgres:16-alpine). Utilizamos esta, ya que traemos conocimientos previos sobre SQL y muy utilizada en la actualidad, brindadno la posibilidad de correccion de errores de manera eficiente
Definimos volúmenes nombrados para los datos de Postgres, separados por entorno (QA y PROD) para evitar mezclar información.
**Conexión:** La app se conecta mediante la variable _DATABASE_URL_ (formato `postgres://usuario:password@host:5432/base`). En Compose, el host es el nombre del servicio (db-qa / db-prod), lo que simplifica redes y evita exponer puertos innecesariamente entre contenedores.
**Esquema y datos iniciales:** Incluimos un _init.sql_ que crea la tabla items y carga tres filas de ejemplo. Aclaramos que Postgres ejecuta automáticamente los scripts de _/docker-entrypoint-initdb.d/_ solo en la primera inicialización del volumen; si el volumen ya existía, aplicamos el SQL manualmente para dejar ambos entornos parejos.

## _**5. Configurar QA y PROD con la misma imagen**_
**Misma imagen, distinta configuración:** la misma imagen de la aplicación corre en QA y PROD; lo que cambia es solo la configuración, provista por variables de entorno.
Definimos dos archivos al lado del compose: _env.qa_ y _env.prod_, cada uno con su _DATABASE_URL_ apuntando a su base correspondiente. Compose los inyecta con _env_file_, y la app lee esos valores en tiempo de ejecución
**Para correr ambas instancias simultáneamente:**
* **QA** se expone en _localhost:3001_
* **PROD** se expone en _localhost:3002_
Dentro del contenedor la app sigue escuchando en el mismo puerto interno. Además, cada entorno usa su propio volumen de Postgres, manteniendo datos completamente separados.

## _**6. Preparar un entorno con docker-compose**_
**Compose unificado:** Creamos un _docker-compose.yml_ que levanta:
* **_api-qa + db-qa_**
* **_api-prod + db-prod_**
Ambas APIs usan la misma imagen de la app (tag v1.0)
_Con Docker instalado, basta con traer las imágenes y levantar el compose; al estar todo versionado y etiquetado, el resultado es consistente en distintos equipos_
_**Codigos para replicar en cualquier maquina:**_
```
git clone <URL_DEL_REPO> ; cd compose-app ;
"DATABASE_URL=postgres://appuserqa:secretqa@db-qa:5432/appdbqa"     | Out-File -Encoding UTF8 .\env.qa ;
"DATABASE_URL=postgres://appuserprod:secretprod@db-prod:5432/appdbprod" | Out-File -Encoding UTF8 .\env.prod ;
docker compose pull ; docker compose up -d ;
curl http://localhost:3001/ ; curl http://localhost:3001/items ;
curl http://localhost:3002/ ; curl http://localhost:3002/items
```

## _**7. Preparar un entorno con docker-compose**_
Creamos el _tag v1.0_ de la aplicación y actualizamos _docker-compose.yml_ para que apunte a esa versión.
Convención de versionado.

* _v1.0_ como alias corto solicitado en la consigna.
* _latest_ solo como puntero de conveniencia para pruebas, no para producción.
```
docker tag  imadecara/compose-app:0.1.0  imadecara/compose-app:v1.0
docker push imadecara/compose-app:v1.0
```
