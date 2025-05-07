FROM python:3.9-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar dependencias necesarias para PostgreSQL y otras libs
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    musl-dev \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Actualizar requirements si es necesario para producción
RUN pip install --no-cache-dir gunicorn psycopg2-binary dj-database-url python-decouple whitenoise

# Copiar proyecto
COPY . .

# Crear directorios para archivos estáticos y media
RUN mkdir -p /app/staticfiles /app/media

# Script para esperar a que PostgreSQL esté listo
COPY ./wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# Ejecutar collectstatic
RUN python manage.py collectstatic --noinput

# Configurar puerto
EXPOSE 8000

# Comando para iniciar la aplicación usando gunicorn
CMD ["/bin/sh", "-c", "/wait-for-postgres.sh db && gunicorn core.wsgi:application --bind 0.0.0.0:8000"] 