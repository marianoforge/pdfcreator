# Despliegue en Railway

Este documento contiene instrucciones detalladas sobre cómo desplegar la aplicación PDF Creator en Railway.

## Prerequisitos

- Cuenta en [Railway](https://railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli) instalado
- Git instalado y configurado

## Método de despliegue

Hay dos scripts disponibles para facilitar el despliegue:

- `deploy.sh` - Script simplificado para despliegues rápidos
- `deploy-simple.sh` - Script interactivo con más opciones de configuración

### Usando deploy.sh

1. Abre una terminal en la raíz del proyecto
2. Ejecuta: `./deploy.sh`
3. El script te preguntará si deseas hacer commit de los cambios
4. Te guiará a través del proceso de login y despliegue en Railway

### Usando deploy-simple.sh

1. Abre una terminal en la raíz del proyecto
2. Ejecuta: `./deploy-simple.sh`
3. Sigue las instrucciones interactivas para:
   - Hacer commit de los cambios
   - Iniciar sesión en Railway
   - Crear un nuevo proyecto o enlazar uno existente
   - Configurar variables de entorno
   - Añadir PostgreSQL (solo para nuevos proyectos)
   - Desplegar la aplicación

## Variables de entorno requeridas

Para el correcto funcionamiento de la aplicación, configura estas variables de entorno en Railway:

- `SECRET_KEY` - Clave secreta para Django
- `DEBUG` - Establecer en "False" para producción
- `PDFMONKEY_API_KEY` - Tu clave API de PDFMonkey
- `PDFMONKEY_PREVENTION_TEMPLATE_ID` - ID de tu plantilla de PDFMonkey
- `ALLOWED_HOSTS` - Configura a "*.up.railway.app" para Railway
- `CORS_ALLOWED_ORIGINS` - Configura a "https://*.up.railway.app" para Railway

## Solución de problemas

Si encuentras errores durante el despliegue:

1. Verifica que todas las variables de entorno estén configuradas correctamente
2. Asegúrate de que la base de datos PostgreSQL está correctamente añadida al proyecto
3. Revisa los logs de Railway para identificar problemas específicos

## Estructura de archivos de despliegue

- `Dockerfile` - Contiene la configuración para construir la imagen de Docker
- `run.sh` - Script que se ejecuta cuando inicia el contenedor
- `railway.toml` - Configuración para Railway
- `.railwayignore` - Lista de archivos que no se incluyen en el despliegue 