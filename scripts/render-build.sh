#!/bin/bash
# Render Build Script — Trust Layer (dwtl.io)
# Pre-built dist is committed to the repo. Only install deps.
set -e

echo "📦 [Render] Trust Layer deploy starting..."

# Install production deps only (dist is pre-built)
echo "📚 Installing production dependencies..."
npm install --production --legacy-peer-deps || npm install --production --force

echo "✅ [Render] Ready to start!"
