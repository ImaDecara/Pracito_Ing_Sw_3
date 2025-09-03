## Creamos el archivo decisiones.md

Mediante el seiguiente linea de codigo creamos el archivos por consola:

```bash
touch decisiones.md

```


## 1. Configurar tu entorno y preparar tu repositorio

Se configuro Git localmente con los siguientes comandos:

```bash

git config user.name "Imanol Decara"
git config user.email "2203858@ucc.edu.ar"

```
## 2. Desarrollar una funcionalidad

Creamos una nueva branch (rama) reflejando un modo de trabajo "Feature Branch Workflow". En este caso es una sola rama ya que tenemos una sola funcionalidad
pero en caso de tener mas de 1 creamos una rama por funcionalidad, teniendo asi una organizacion mas clara:

```bash
git checkout -b feature/funcionalidad
```

Realizamos cambios en "app.js" para realizazr los commits atomicos. Nos paramos en el archivo ya modificado.
Tambien se realizo el commit del archivo "decisiones.md"

IA: Los cambios realizamos en el archivo app.js fueron realizados por la IA ChatGPT

```bash
//Commit 1
git add src/app.js decisiones.md
git commit -m "feat: agregamos función saludarPersona y documentamos decisión"

//Commit 2
git add src/app.js
git commit -m " agregamos parametros a la  función saludarPersona"
```

Los commits realizados reflejan especificamente las acciones realizadas sobre el repo y archivos involucrados.

## ERROR
Notamos que habiamos realizo el "git clone" del repositorio, pero no se habia relizado el FORK corresponiente
Realizamos el FORK del repositorio y cambiamos la URL por consola para poder realizar los PUSH:

```bash

$ git remote -v
origin  https://github.com/ingsoft3ucc/2025_TP01_RepoBase (fetch)
origin  https://github.com/ingsoft3ucc/2025_TP01_RepoBase (push)

$ git remote set-url origin https://github.com/ImaDecara/2025_TP01_RepoBase.git

$ git remote -v
origin  https://github.com/ImaDecara/2025_TP01_RepoBase.git (fetch)
origin  https://github.com/ImaDecara/2025_TP01_RepoBase.git (push)

$ git push origin feature/funcionalidad
Everything up-to-date
```

## 3. Corregir un error (simulado) y aplicar el fix

Nos movemos a Main:

```bash
git checkout main
```
IA: Agrego una llamda a una funcion inexistente para simular el error solicitado

Realizamos Commit con el error:

```bash
$ git add src/app.js
$ git commit -m "simula error crítico en main con función inexistente"
```

Abrimos la rama para el FIX:
```bash
git checkout -b hotfix/fix-llamada-inexistente
```

Eliminamos el error y realizamos el Commit correspondiente:
```bash
$ git add src/app.js
$ git commit -m "fix: elimina llamada a función inexistente para restaurar ejecución"
```

Ahora vamos vamos a aplicar el arrelgo (FIX) al main mediante Merge:

```bash
$ git checkout main
$ git merge hotfix/fix-llamada-inexistente
```

Ahora vamos vamos a aplicar el arrelgo (FIX) a nuestra rama (Usamos Cherry-Pick):

```bash
git log --oneline //Buscamos el HASH del Commit (9040578)
git checkout feature/funcionalidad //Nos paramos en nuestra rama
git cherry-pick 9040578 //Aplicamos
```

        ## ERROR
        Como el archivo App.js ya fue modificado en nuestra rama "feature/funcionalidad" github no sabe como combinar
        los cambios. Ingresamos al archivo app.js y eliminamos los "comentarios" generados para asi dejarlo como estaba 
        en la rama "feature/funcionalidad". Gaurdamos el archivo:

        ```bash
        $ git add src/app.js
        ```

En la pantalla de VIM confirmamos los cambios:
```bash
    :wq
```

Controlamos que el FIX este presente:

```bash
$ git log --oneline
cbdb74d (HEAD -> feature/funcionalidad) A fix: elimina llamada a función inexistente para restaurar ejecución
```

## 4. Hace un PR y aceptalo

Primero controlamos que este todo Pusheado:

```bash
git push origin feature/funcionalidad
```

Se abrio un Pull Request desde `feature/funcionalidad` hacia `main`. GitHub confirmo que no habia conflictos y permitio el merge automatico.

Se acepto el PR haciendo clic en "Merge pull request", integrando:

- La funcionalidad `saludarPersona()`
- El fix aplicado previamente via `cherry-pick`

Esto asegura un historial limpio y controlado, respetando buenas practicas de colaboracion.

## 5.  Crear una versión etiquetada

Controlamos que estemos parados en main y añadimos el tag:

```bash
git checkout main
git tag -a v1.0 -m "Versión estable 1.0"
git push origin v1.0
```

## 5.1 Convecniones 


`feature/funcionalidad` --> Aísla el trabajo en curso, facilita colaboración y revisión
`hotfix/fix-llamada-inexistente` --> Separa correcciones críticas del desarrollo general

`feat:` Indica claramente una adición al sistema
`fix:` Facilita rastreo de errores

`merge`: para integrar ramas enteras, preservando el historial completo
`cherry-pick`: para aplicar un fix puntual sin traer commits no deseados

