#!/bin/bash

# Verificar si railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "Railway CLI no está instalado. Instalando..."
    npm install -g @railway/cli
fi

# Verificar si el usuario está logueado en Railway
railway whoami || railway login

# Crear un nuevo proyecto en Railway (o usar uno existente)
echo "¿Desea crear un nuevo proyecto en Railway? (s/n)"
read crear_proyecto

if [ "$crear_proyecto" = "s" ] || [ "$crear_proyecto" = "S" ]; then
    echo "Creando un nuevo proyecto en Railway..."
    railway init
else
    echo "Por favor, seleccione el proyecto a utilizar:"
    railway link
fi

# Configurar variables de entorno
echo "Configurando variables de entorno en Railway..."

# Variables obligatorias
echo "Ingrese la clave API de PDFMonkey:"
read pdfmonkey_api_key

echo "Ingrese el ID de la plantilla PDFMonkey:"
read pdfmonkey_template_id

# Generar una clave secreta para Django
DJANGO_SECRET_KEY=$(openssl rand -base64 32)

# Configurar variables de entorno en Railway
railway variables set \
    SECRET_KEY="$DJANGO_SECRET_KEY" \
    DEBUG="False" \
    PDFMONKEY_API_KEY="$pdfmonkey_api_key" \
    PDFMONKEY_PREVENTION_TEMPLATE_ID="$pdfmonkey_template_id" \
    ALLOWED_HOSTS="*.up.railway.app" \
    CORS_ALLOWED_ORIGINS="https://*.up.railway.app" \
    NODE_VERSION="18.17.1" \
    NPM_VERSION="9.6.7"

# Agregar Plugin de PostgreSQL
echo "Agregando plugin de PostgreSQL..."
railway add --plugin postgresql

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté lista..."
sleep 10

# Obtener la variable DATABASE_URL generada automáticamente por Railway
DATABASE_URL=$(railway variables get DATABASE_URL)

if [ -z "$DATABASE_URL" ]; then
    echo "No se pudo obtener la URL de la base de datos. Asegúrese de agregar el plugin de PostgreSQL manualmente."
else
    echo "Base de datos configurada correctamente."
fi

# Desplegar la aplicación
echo "Desplegando la aplicación en Railway..."
railway up

echo "¡Despliegue completado!"
echo "La URL de su aplicación será proporcionada por Railway en el dashboard."
echo "Puede acceder al dashboard con: railway open" 