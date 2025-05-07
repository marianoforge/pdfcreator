#!/bin/bash

# Comprobar si git está instalado
if ! command -v git &> /dev/null; then
  echo "Git no está instalado. Instalando Git..."
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo apt-get install -y git
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    brew install git
  else
    echo "No se pudo instalar Git automáticamente. Por favor, instálelo manualmente."
    exit 1
  fi
fi

# Inicializar repositorio git si no existe
if [ ! -d .git ]; then
  echo "Inicializando repositorio Git..."
  git init
fi

# Añadir todos los archivos al repositorio
git add .

# Excluir archivos sensibles
echo "Excluyendo archivos sensibles..."
git reset -- backend/.env
git reset -- backend/db.sqlite3
git reset -- backend/venv/
git reset -- frontend/node_modules/

# Crear el primer commit
git commit -m "Configuración inicial del proyecto PDF Creator"

# Preguntar si desea agregar un repositorio remoto
read -p "¿Desea agregar un repositorio remoto? (s/n): " ADD_REMOTE
if [ "$ADD_REMOTE" = "s" ] || [ "$ADD_REMOTE" = "S" ]; then
  read -p "Introduzca la URL del repositorio remoto (ej: https://github.com/usuario/repo.git): " REMOTE_URL
  if [ ! -z "$REMOTE_URL" ]; then
    git remote add origin "$REMOTE_URL"
    
    # Preguntar si desea hacer push
    read -p "¿Desea hacer push al repositorio remoto ahora? (s/n): " DO_PUSH
    if [ "$DO_PUSH" = "s" ] || [ "$DO_PUSH" = "S" ]; then
      git push -u origin master || git push -u origin main
    else
      echo "Puede hacer push más tarde con: git push -u origin master"
    fi
  fi
fi

echo ""
echo "Repositorio Git inicializado correctamente."
echo "Archivos sensibles como .env y archivos generados han sido excluidos del control de versiones."
echo ""
echo "Comandos útiles:"
echo "- git status: Ver estado del repositorio"
echo "- git add . : Añadir cambios"
echo "- git commit -m \"Mensaje\": Guardar cambios"
echo "- git push: Subir cambios al repositorio remoto" 