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
    PORT="80"

# Mostrar la base de datos
echo "Railway creará automáticamente una base de datos PostgreSQL."
echo "Asegúrese de agregar el plugin de PostgreSQL en el dashboard de Railway."

# Desplegar la aplicación
echo "Desplegando la aplicación en Railway..."
railway up

echo "¡Despliegue completado!"
echo "La URL de su aplicación será proporcionada por Railway en el dashboard."
echo "Puede acceder al dashboard con: railway open" 