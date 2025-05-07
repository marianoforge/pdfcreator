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

# Configurar collectstatic y media
RUN mkdir -p staticfiles media
RUN if [ "$DJANGO_SETTINGS_MODULE" != "core.settings.dev" ]; then python manage.py collectstatic --noinput; fi

# Configurar puerto
EXPOSE 8000

# Railway automáticamente asigna a PORT la variable con el puerto expuesto
CMD gunicorn core.wsgi:application --bind 0.0.0.0:${PORT:-8000} 