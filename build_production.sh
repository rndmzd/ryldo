#!/bin/bash

# Build the production version of the app
npm run build

# Fix permissions
chown -Rv ubuntu:www-data ./build

# Set correct permissions
find ./build -type d -exec chmod 755 {} \;
find ./build -type f -exec chmod 644 {} \;