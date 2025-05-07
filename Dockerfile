FROM node:18 as frontend-build

WORKDIR /app

# Increase memory limit for Node.js
ENV NODE_OPTIONS=--max_old_space_size=2048

# Install frontend dependencies and build
COPY frontend/package*.json frontend/
RUN cd frontend && npm install
COPY frontend/ frontend/
RUN cd frontend && npm run build

# Set up Python environment
FROM python:3.9-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Avoid Nix-related issues
ENV PATH="/app/.local/bin:${PATH}"
ENV HOME="/app"
ENV PIP_USER=1
ENV PYTHONPATH="/app"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-openbsd \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first
COPY backend/requirements.txt backend/requirements.txt

# Install Python dependencies from backend
RUN pip install --no-cache-dir -r backend/requirements.txt 

# Copy other requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir gunicorn==21.2.0 whitenoise==6.5.0 psycopg2-binary==2.9.8 dj-database-url==2.1.0 python-decouple==3.8
RUN mkdir -p .local/bin

# Copy backend code
COPY backend/ backend/

# Copy frontend build from the previous stage
COPY --from=frontend-build /app/frontend/dist frontend/build/

# Collect static files
RUN cd backend && python manage.py collectstatic --noinput

# Copy startup script
COPY run.sh .
RUN chmod +x run.sh

# Expose port for Railway
EXPOSE 8000

# Start the application
CMD ["./run.sh"] 