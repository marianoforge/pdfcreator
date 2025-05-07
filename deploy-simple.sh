#!/bin/bash

# Verify if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Railway CLI is not installed. Installing..."
    npm install -g @railway/cli
fi

# Ask to commit and push changes
echo "Do you want to commit and push changes to Git repository? (y/n)"
read commit_changes

if [ "$commit_changes" = "y" ] || [ "$commit_changes" = "Y" ]; then
    echo "Enter commit message:"
    read commit_message
    
    # Add all changes
    git add .
    
    # Commit changes
    git commit -m "$commit_message"
    
    # Push to repository
    echo "Pushing changes to repository..."
    git push
    
    echo "Changes pushed successfully!"
fi

# Check if user is logged in to Railway
railway login

# Link to an existing project or create a new one
echo "Do you want to create a new project in Railway? (y/n)"
read create_project

if [ "$create_project" = "y" ] || [ "$create_project" = "Y" ]; then
    echo "Creating a new project in Railway..."
    railway init
    
    # Ask if PostgreSQL plugin should be added
    echo "Do you want to add PostgreSQL plugin to the project? (y/n)"
    read add_postgres
    
    if [ "$add_postgres" = "y" ] || [ "$add_postgres" = "Y" ]; then
        echo "Adding PostgreSQL plugin..."
        railway add --plugin postgresql
    fi
    
    # Configure environment variables
    echo "Configuring environment variables in Railway..."
    echo "Add the following environment variables manually in the interactive interface:"
    echo "- SECRET_KEY (a secret key for Django)"
    echo "- DEBUG=False"
    echo "- PDFMONKEY_API_KEY (your PDFMonkey API key)"
    echo "- PDFMONKEY_PREVENTION_TEMPLATE_ID (your PDFMonkey template ID)"
    echo "- ALLOWED_HOSTS=*.up.railway.app"
    echo "- CORS_ALLOWED_ORIGINS=https://*.up.railway.app"
    
    railway variables
else
    echo "Selecting an existing project..."
    railway link
fi

# Deploy the application using our Dockerfile
echo "Deploying the application to Railway..."
railway up

echo "Deployment started. Check status on Railway dashboard"
railway open 