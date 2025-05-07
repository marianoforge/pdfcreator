#!/bin/bash

echo "==== Asistente de despliegue de PDF Creator en Railway ===="

# Verify if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "🔄 Railway CLI no está instalado. Instalando..."
    npm install -g @railway/cli
fi

# Ask to commit and push changes
echo "💾 ¿Deseas hacer commit y subir los cambios al repositorio Git? (y/n)"
read commit_changes

if [ "$commit_changes" = "y" ] || [ "$commit_changes" = "Y" ]; then
    echo "📝 Escribe el mensaje de commit:"
    read commit_message
    
    echo "🔄 Agregando cambios al repositorio..."
    git add .
    
    echo "🔄 Haciendo commit de los cambios..."
    git commit -m "$commit_message"
    
    echo "🔄 Subiendo cambios al repositorio..."
    git push
    
    echo "✅ Cambios subidos correctamente!"
fi

# Check if user is logged in to Railway
echo "🔑 Iniciando sesión en Railway..."
railway login

# Link to an existing project or create a new one
echo "🔄 ¿Deseas crear un nuevo proyecto en Railway? (y/n)"
read create_project

if [ "$create_project" = "y" ] || [ "$create_project" = "Y" ]; then
    echo "🏗️ Creando un nuevo proyecto en Railway..."
    railway init
    
    # Ask if PostgreSQL plugin should be added
    echo "🗄️ ¿Deseas añadir el plugin de PostgreSQL al proyecto? (y/n)"
    read add_postgres
    
    if [ "$add_postgres" = "y" ] || [ "$add_postgres" = "Y" ]; then
        echo "🔄 Añadiendo plugin de PostgreSQL..."
        railway add --plugin postgresql
    fi
    
    # Configure environment variables
    echo "⚙️ Configurando variables de entorno en Railway..."
    echo "Añade las siguientes variables de entorno manualmente en la interfaz interactiva:"
    echo "- SECRET_KEY (una clave secreta para Django)"
    echo "- DEBUG=False"
    echo "- PDFMONKEY_API_KEY (tu clave API de PDFMonkey)"
    echo "- PDFMONKEY_PREVENTION_TEMPLATE_ID (el ID de tu plantilla de PDFMonkey)"
    echo "- ALLOWED_HOSTS=*.up.railway.app"
    echo "- CORS_ALLOWED_ORIGINS=https://*.up.railway.app"
    
    railway variables
else
    echo "🔗 Seleccionando un proyecto existente..."
    railway link
fi

# Deploy the application using our Dockerfile
echo "🚀 Desplegando la aplicación en Railway..."
railway up

# Check deployment status
echo "🔍 Verificando estado del despliegue..."
railway status

echo "📋 Mostrando logs (presiona Ctrl+C para salir)..."
railway logs 