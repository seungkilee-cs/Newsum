#!/bin/bash

# Stop the frontend (assuming it's running in the foreground)
# Check if "yarn start" is running
if pgrep -f "yarn start" > /dev/null; then
    # If it's running, kill it
    pkill -f "yarn start"
    echo "Stopped frontend process"
else
    echo "No frontend process found running"
fi