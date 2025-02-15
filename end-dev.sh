#!/bin/bash

# Stop the backend (assuming it's running in the foreground)
# Check if "npm start" is running
if pgrep -f "npm start" > /dev/null; then
    # If it's running, kill it
    pkill -f "npm start"
    echo "Stopped npm start process"
else
    echo "No npm start process found running"
fi


# Stop MongoDB
brew services stop mongodb-community
