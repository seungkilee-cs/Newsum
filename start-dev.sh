#!/bin/bash

# Start MongoDB
brew services start mongodb-community

# Wait for MongoDB to start
sleep 5

# Start the backend
cd backend
npm start
