#!/bin/bash
set -e

echo "🚀 Setting up Agent-X Development Environment..."

# 1. Environment variables
echo "📝 Configuring environment variables..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
  echo "⚠️  Please update your DATABASE_URL and API Keys in the .env file!"
else
  echo "✅ .env file already exists"
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
pnpm install --no-frozen-lockfile --ignore-scripts

# 3. Generate Prisma client & Setup Database
echo "🗄️ Preparing Database (Prisma Client & Migration)..."
pnpm --filter @agent-xai/persistence db:generate

echo ""
echo "⚠️  NOTE: Run 'pnpm --filter @agent-xai/persistence prisma db push' to apply schemas when your DATABASE_URL is ready."
echo ""

# 4. Build projects
echo "🔨 Building workspace..."
pnpm run build

echo ""
echo "✅ Setup Complete!"
echo "To start the web dashboard: pnpm --filter @agent-xai/web run dev"
echo "To use the CLI locally: pnpm run demo 'Task here'"
