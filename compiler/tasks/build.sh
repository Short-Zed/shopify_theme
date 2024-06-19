#!/bin/bash

echo "Building scripts..."
# Add commands to transpile TypeScript, if needed

echo "Building styles..."
# Compile Sass to CSS
sass src/styles/main.scss dist/styles/main.css --style compressed

# Copy or move compiled files to destination
cp src/scripts/component/byob.js theme/assets/src/scripts/component/byob.js

echo "Build complete."
