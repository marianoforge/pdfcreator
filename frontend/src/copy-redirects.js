// Script para asegurar el correcto manejo de rutas en Netlify
const fs = require("fs");
const path = require("path");

// Contenido del archivo de redirección
const redirectsContent = `
# Redirecciones para SPA
/*    /index.html   200
`;

// Ruta al directorio de construcción
const buildDir = path.join(__dirname, "../dist");

// Asegúrate de que el directorio de construcción existe
if (!fs.existsSync(buildDir)) {
  console.error("Error: El directorio de construcción no existe");
  process.exit(1);
}

// Escribe el archivo _redirects
fs.writeFileSync(path.join(buildDir, "_redirects"), redirectsContent);
console.log("Archivo _redirects creado correctamente en el directorio dist.");

// También asegúrate de que tengamos un documento 404.html que redireccione al index.html
const notFoundContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redireccionando...</title>
  <script>
    // Redirige a la página principal
    window.location.href = '/';
  </script>
</head>
<body>
  <p>Redireccionando...</p>
</body>
</html>
`;

fs.writeFileSync(path.join(buildDir, "404.html"), notFoundContent);
console.log("Archivo 404.html creado correctamente en el directorio dist.");
