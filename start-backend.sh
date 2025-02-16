#!/bin/bash

# Function to check if MongoDB is running
is_mongodb_running() {
    pgrep mongod > /dev/null
    return $?
}

# Check if MongoDB is already running
if is_mongodb_running; then
    echo "MongoDB is already running."
else
    echo "Starting MongoDB..."
    brew services start mongodb-community

    # Wait for MongoDB to start
    sleep 5
    echo "MongoDB started."
fi

echo "Running Backend"

cd backend && npm start