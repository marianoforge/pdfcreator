#!/bin/bash
set -e

echo "==== Despliegue de PDF Creator en Railway ===="

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "🔄 Instalando Railway CLI..."
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

# Login to Railway
echo "🔑 Iniciando sesión en Railway..."
railway login

# Link to an existing project or create a new one
if railway link &> /dev/null; then
    echo "🔗 Usando proyecto existente de Railway"
else
    echo "🏗️ Creando un nuevo proyecto en Railway..."
    railway init
    
    # Ask if PostgreSQL plugin should be added
    echo "🗄️ ¿Deseas añadir el plugin de PostgreSQL al proyecto? (y/n)"
    read add_postgres
    
    if [ "$add_postgres" = "y" ] || [ "$add_postgres" = "Y" ]; then
        echo "🔄 Añadiendo plugin de PostgreSQL..."
        railway add --plugin postgresql
    fi
fi

# Deploy using Dockerfile
echo "🚀 Desplegando aplicación en Railway..."
railway up

# Check deployment status
echo "🔍 Verificando estado del despliegue..."
railway status

echo "📋 Mostrando logs (presiona Ctrl+C para salir)..."
railway logs 