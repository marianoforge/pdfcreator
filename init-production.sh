#!/bin/bash

# Comprobar si el usuario es root
if [ "$EUID" -ne 0 ]; then
  echo "Este script debe ejecutarse como root o con sudo"
  exit 1
fi

# Configuración inicial
echo "Configurando proyecto en producción..."

# Crear directorios para Certbot
mkdir -p ./certbot/conf ./certbot/www

# Copiar el archivo .env de ejemplo si no existe
if [ ! -f ./backend/.env ]; then
  echo "Creando archivo .env para el backend..."
  cp ./backend/.env-example ./backend/.env
  echo "IMPORTANTE: Edite el archivo ./backend/.env con sus valores reales"
fi

# Verificar instalación de Docker y Docker Compose
if ! command -v docker &> /dev/null; then
  echo "Docker no está instalado. Instalando Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose no está instalado. Instalando Docker Compose..."
  curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

# Generar una clave secreta para Django
DJANGO_SECRET_KEY=$(openssl rand -base64 32)
sed -i "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=$DJANGO_SECRET_KEY/" ./backend/.env

# Pedir información para configurar el dominio
read -p "Introduzca su dominio (por ejemplo, example.com): " DOMAIN_NAME
if [ ! -z "$DOMAIN_NAME" ]; then
  echo "Configurando dominio: $DOMAIN_NAME"
  sed -i "s/your-domain.com/$DOMAIN_NAME/g" ./backend/.env
  sed -i "s/your-domain.com/$DOMAIN_NAME/g" ./docker-compose.yml
  sed -i "s/localhost/$DOMAIN_NAME/g" ./frontend/nginx/conf.d/default.conf
  
  # Configurar HTTPS en Nginx
  sed -i "s/# listen 443/listen 443/g" ./frontend/nginx/nginx.conf
  sed -i "s/# ssl_certificate/ssl_certificate/g" ./frontend/nginx/nginx.conf
  sed -i "s/your-domain.com/$DOMAIN_NAME/g" ./frontend/nginx/nginx.conf
fi

# Preguntar si desea generar certificados SSL con Let's Encrypt
read -p "¿Desea configurar HTTPS con Let's Encrypt? (s/n): " SETUP_SSL
if [ "$SETUP_SSL" = "s" ] || [ "$SETUP_SSL" = "S" ]; then
  echo "Configurando Let's Encrypt para HTTPS..."
  docker-compose up -d frontend
  
  # Obtener certificados SSL con Certbot
  docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
    --email admin@$DOMAIN_NAME --agree-tos --no-eff-email \
    -d $DOMAIN_NAME -d www.$DOMAIN_NAME
  
  # Detener contenedores
  docker-compose down
  
  # Habilitar la redirección de HTTP a HTTPS
  sed -i 's/# location \/ {/location \/ {/g' ./frontend/nginx/conf.d/default.conf
  sed -i 's/#     return 301 https:\/\/$host$request_uri;/    return 301 https:\/\/$host$request_uri;/g' ./frontend/nginx/conf.d/default.conf
  sed -i 's/# }/}/g' ./frontend/nginx/conf.d/default.conf
fi

# Iniciar los servicios
echo "Iniciando servicios..."
docker-compose up -d

echo "Configuración completada. El sistema está en funcionamiento."
echo "Puede acceder a su aplicación en: http://$DOMAIN_NAME"
if [ "$SETUP_SSL" = "s" ] || [ "$SETUP_SSL" = "S" ]; then
  echo "También disponible en: https://$DOMAIN_NAME"
fi

echo ""
echo "RECUERDE: Debe configurar las variables de entorno correctamente en ./backend/.env"
echo "Especialmente las claves de PDFMonkey para la generación de PDF."
echo ""
echo "Para detener los servicios: docker-compose down"
echo "Para ver logs: docker-compose logs -f" 