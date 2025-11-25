## Objetivo
Publicar el proyecto React (Create React App) en GitHub Pages bajo `https://ahuertam.github.io/three_roads`.

## Preparativos
- Confirmar acceso al repo `ahuertam/three_roads` y tener Node/npm instalados.
- Asegurar que la rama `main` esté actualizada localmente.

## Configurar `package.json`
- Añadir el campo `homepage`: `"homepage": "https://ahuertam.github.io/three_roads"`.
- Instalar la herramienta de publicación: ejecutar `npm i -D gh-pages`.
- Agregar scripts:
  - `predeploy`: `npm run build`
  - `deploy`: `gh-pages -d build`

## Despliegue
- Ejecutar `npm install` para asegurar dependencias.
- Ejecutar `npm run deploy` para construir y publicar en la rama `gh-pages`.

## Configurar GitHub Pages
- En Settings → Pages: seleccionar fuente `gh-pages` (Deploy from a branch) y carpeta `/`.
- Activar HTTPS.

## Verificación
- Abrir `https://ahuertam.github.io/three_roads` y comprobar carga de assets y funcionamiento.
- Si hubiera rutas SPA en el futuro, usar `HashRouter` o añadir `404.html` que redirija a `index.html`.

## Opcional
- Configurar un workflow de GitHub Actions para auto-despliegue en cada push a `main`.
- Configurar dominio personalizado si se requiere posteriormente.