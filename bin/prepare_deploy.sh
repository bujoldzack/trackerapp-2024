#!/bin/bash
set -e

cd ../frontend

npm install

echo "Building frontend..."
npm run build

rm -rf ../backend/react_build || true

cp -r build/ ../backend/react_build/

rm -rf build/

cd ../backend

rm full.zip || true

zip -r full.zip . -x "node_modules/*" -x ".env/*"

echo "Zip creation complete."