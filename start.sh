#!/bin/bash
set -e

# Activar el entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

cd backend

# Aplicar migraciones
echo "Aplicando migraciones de base de datos..."
python manage.py migrate

# Iniciar servidor
echo "Iniciando servidor Gunicorn..."
gunicorn core.wsgi:application --bind 0.0.0.0:$PORT 