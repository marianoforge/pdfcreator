#!/bin/bash

# Verificar si railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "Railway CLI no está instalado. Instalando..."
    npm install -g @railway/cli
fi

# Verificar si el usuario está logueado en Railway
railway login

# Enlazar a un proyecto existente o crear uno nuevo
echo "¿Desea crear un nuevo proyecto en Railway? (s/n)"
read crear_proyecto

if [ "$crear_proyecto" = "s" ] || [ "$crear_proyecto" = "S" ]; then
    echo "Creando un nuevo proyecto en Railway..."
    railway init
else
    echo "Seleccionando un proyecto existente..."
    railway link
fi

# Configurar variables de entorno
echo "Configurando variables de entorno en Railway..."
echo "Añade las siguientes variables de entorno manualmente en la interfaz interactiva:"
echo "- SECRET_KEY (una clave secreta para Django)"
echo "- DEBUG=False"
echo "- PDFMONKEY_API_KEY (tu clave API de PDFMonkey)"
echo "- PDFMONKEY_PREVENTION_TEMPLATE_ID (el ID de tu plantilla de PDFMonkey)"
echo "- ALLOWED_HOSTS=*.up.railway.app"
echo "- CORS_ALLOWED_ORIGINS=https://*.up.railway.app"

railway variables

# Agregar plugin de PostgreSQL
echo "Añadiendo plugin de PostgreSQL..."
echo "Selecciona PostgreSQL de la lista de plugins"
railway add

# Desplegar la aplicación
echo "Desplegando la aplicación en Railway..."
railway up

echo "Despliegue iniciado. Verifica el estado en el dashboard de Railway"
railway open 