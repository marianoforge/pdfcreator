#!/bin/bash
set -e

# Instalar dependencias del frontend y construir
echo "Instalando dependencias del frontend..."
cd frontend
npm install
npm run build

# Volver al directorio raíz e instalar dependencias del backend
echo "Instalando dependencias del backend..."
cd ..

# Crear un entorno virtual para Python
echo "Creando entorno virtual..."
python -m venv venv
source venv/bin/activate

# Instalar dependencias en el entorno virtual
pip install -r requirements.txt

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
cd backend
python manage.py collectstatic --noinput

# Desactivar el entorno virtual al finalizar
deactivate 