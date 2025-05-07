# PDF Creator

Sistema para generar documentos PDF personalizados con formularios dinámicos.

## Estructura del Proyecto

El proyecto está dividido en tres componentes principales:

- **Frontend**: Aplicación React con TypeScript y Tailwind CSS
- **Backend**: API REST con Django y Django REST Framework
- **CMS**: Strapi (Sistema de Gestión de Contenido)

## Requisitos

- Node.js 16+
- Python 3.8+
- NPM o Yarn
- Cuenta en PDFMonkey para la generación de PDF

## Configuración del Entorno

### Variables de Entorno

Para el backend, crea un archivo `.env` en la carpeta `/backend` con:

```
PDFMONKEY_API_KEY=tu_api_key
PDFMONKEY_PREVENTION_TEMPLATE_ID=tu_id_de_template
DEBUG=True # Solo en desarrollo
```

### Instalación

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

**Frontend:**
```bash
cd frontend
npm install
```

**CMS (opcional):**
```bash
cd cms
npm install
```

## Ejecución en Desarrollo

Puedes usar el script de desarrollo que inicia tanto el backend como el frontend:

```bash
chmod +x dev.sh
./dev.sh
```

O ejecutar cada componente por separado:

**Backend:**
```bash
cd backend
source venv/bin/activate  # En Windows: venv\Scripts\activate
python manage.py runserver 8001
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Preparar para Producción

### Backend

```bash
cd backend
pip install gunicorn
python manage.py collectstatic
```

### Frontend

```bash
cd frontend
npm run build
```

## Despliegue

### Usando Docker (recomendado)

Se incluye un `docker-compose.yml` para facilitar el despliegue.

```bash
docker-compose up -d
```

### Despliegues Alternativos

- **Backend**: Puede desplegarse en Render, Heroku, o servicios similares.
- **Frontend**: Puede servirse desde Vercel, Netlify o cualquier hosting estático.

## Licencia

[MIT](LICENSE) 