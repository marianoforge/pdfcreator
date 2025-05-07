#!/bin/bash
set -e

# Activar el entorno virtual si existe
if [ -d "venv" ]; then
  echo "Activando entorno virtual..."
  source venv/bin/activate
fi

cd backend

# Aplicar migraciones
echo "Aplicando migraciones de base de datos..."
python manage.py migrate

# Iniciar servidor
echo "Iniciando servidor Gunicorn..."
exec gunicorn core.wsgi:application --bind 0.0.0.0:$PORT 