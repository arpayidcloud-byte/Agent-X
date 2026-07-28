#!/bin/bash
set -e

echo "🚀 Setting up Agent-X Development Environment..."

# 1. Environment variables
echo "📝 Configuring environment variables..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
  echo "⚠️ Please fill in your API keys in the .env file"
else
  echo "✅ .env file already exists"
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
pnpm install --no-frozen-lockfile

# 3. Generate Prisma client
echo "🗄️ Generating Prisma Client..."
pnpm --filter @agentx-fast/persistence db:generate

# 4. Build projects
echo "🔨 Building workspace..."
pnpm run build

echo ""
echo "✅ Setup Complete!"
echo "To start the web dashboard: pnpm --filter @agentx-fast/web run dev"
echo "To use the CLI locally: pnpm run demo 'Task here'"
