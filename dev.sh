#!/bin/bash

# Start the backend server
cd backend
python manage.py runserver 8001 &
BACKEND_PID=$!

# Start the frontend server
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to kill both processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Register the cleanup function for these signals
trap cleanup SIGINT SIGTERM

echo "Servers are running. Press Ctrl+C to stop."
wait 