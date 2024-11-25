#!/bin/bash
set -e

cd ../frontend/
npm install
npm run build
rm -rf ../backend/react-build || true
cp -r build/ ../backend/react-build
rm -rf build/
cd ../backend
rm full.zip || true
7z a -tzip full.zip . -xr!node_modules -x!.env