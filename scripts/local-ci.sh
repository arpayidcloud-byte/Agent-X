#!/bin/bash
# scripts/local-ci.sh
# Local CI pipeline - WAJIB dijalankan sebelum push ke PR

set -e

echo "🚀 Starting local CI pipeline..."

# 1. Start dependencies
echo "📦 Starting Redis and PostgreSQL..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services..."
sleep 5

# 2. Generate Prisma
echo "🔧 Generating Prisma client..."
pnpm prisma generate

# 3. Run CI pipeline
echo "🔍 Running typecheck..."
pnpm typecheck

echo "🎨 Running lint..."
pnpm lint

echo "🔗 Running lint deps..."
pnpm lint:deps

echo "🏗️  Running build..."
pnpm build

echo "🧪 Running tests..."
pnpm test

echo "📊 Running coverage..."
pnpm test:coverage

# 4. Cleanup
echo "🧹 Cleaning up..."
docker-compose -f docker-compose.test.yml down

echo "✅ Local CI pipeline complete! Safe to push."
