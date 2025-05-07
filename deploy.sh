#!/bin/bash
set -e

echo "Deploying to Railway..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
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

# Login to Railway
echo "Logging in to Railway..."
railway login

# Link to an existing project or create a new one
if railway link &> /dev/null; then
    echo "Using existing Railway project"
else
    echo "Creating a new Railway project..."
    railway init
    
    # Ask if PostgreSQL plugin should be added
    echo "Do you want to add PostgreSQL plugin to the project? (y/n)"
    read add_postgres
    
    if [ "$add_postgres" = "y" ] || [ "$add_postgres" = "Y" ]; then
        echo "Adding PostgreSQL plugin..."
        railway add --plugin postgresql
    fi
fi

# Deploy using Dockerfile
echo "Deploying application to Railway..."
railway up

echo "Deployment complete! Opening Railway dashboard..."
railway open 