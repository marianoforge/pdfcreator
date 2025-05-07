#!/bin/bash
set -e

# Navigate to the backend directory
cd backend

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Start the server
echo "Starting Gunicorn server..."
exec gunicorn core.wsgi:application --bind 0.0.0.0:${PORT:-8000} --log-file - 