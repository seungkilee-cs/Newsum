#!/bin/bash

# Stop the backend (assuming it's running in the foreground)
# Check if "npm start" is running
if pgrep -f "npm start" > /dev/null; then
    # If it's running, kill it
    pkill -f "npm start"
    echo "Stopped npm start process"
else
    echo "No backend process found running"
fi

# Stop the frontend (assuming it's running in the foreground)
# Check if "yarn start" is running
if pgrep -f "yarn start" > /dev/null; then
    # If it's running, kill it
    pkill -f "yarn start"
    echo "Stopped frontend process"
else
    echo "No frontend process found running"
fi

# Stop MongoDB
if pgrep mongod > /dev/null; then
    brew services stop mongodb-community
    echo "Mongo DB service stopped"
else
    echo "Mongo DB is not running"
fi
