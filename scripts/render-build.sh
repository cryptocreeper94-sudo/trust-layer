#!/bin/bash
# Render Build Script — Trust Layer (dwtl.io)
set -e

echo "📦 [Render] Trust Layer build starting..."

# Increase Node.js heap for large Vite builds
export NODE_OPTIONS="--max-old-space-size=2048"

# Install ALL deps (devDependencies needed for tsx, vite, etc.)
echo "📚 Installing dependencies..."
NODE_ENV=development npm install --legacy-peer-deps || npm install --force

# Build (tsx script/build.ts — bundles server + client)
echo "🔧 Building application with ${NODE_OPTIONS}..."
npm run build || {
  echo "⚠️ Build failed, retrying with cleared cache..."
  npm cache clean --force
  npm run build
}

echo "✅ [Render] Trust Layer build complete!"
