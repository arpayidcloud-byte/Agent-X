-- Enterprise tenant expand migration.
-- This migration is intentionally additive and safe to run before the
-- tenant backfill/constraint migration. It does not rewrite historical rows.

-- CostEntry was added to the Prisma schema without a corresponding migration.
-- Create the complete table for fresh databases; existing databases retain
-- their rows and receive missing columns below.
CREATE TABLE IF NOT EXISTS "CostEntry" (
    "id" TEXT NOT NULL,
    "taskId" TEXT,
    "userId" TEXT,
    "orgId" TEXT,
    "subscriptionId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "costUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'api',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CostEntry_pkey" PRIMARY KEY ("id")
);

-- Existing installations may have a partially-created CostEntry table.
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "taskId" TEXT;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "model" TEXT;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "inputTokens" INTEGER DEFAULT 0;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "outputTokens" INTEGER DEFAULT 0;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "totalTokens" INTEGER DEFAULT 0;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "costUsd" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "latencyMs" INTEGER DEFAULT 0;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "cached" BOOLEAN DEFAULT false;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "source" TEXT DEFAULT 'api';
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "CostEntry_taskId_idx" ON "CostEntry"("taskId");
CREATE INDEX IF NOT EXISTS "CostEntry_userId_idx" ON "CostEntry"("userId");
CREATE INDEX IF NOT EXISTS "CostEntry_provider_idx" ON "CostEntry"("provider");
CREATE INDEX IF NOT EXISTS "CostEntry_createdAt_idx" ON "CostEntry"("createdAt");
CREATE INDEX IF NOT EXISTS "CostEntry_orgId_idx" ON "CostEntry"("orgId");
CREATE INDEX IF NOT EXISTS "Workflow_orgId_idx" ON "Workflow"("orgId");
CREATE INDEX IF NOT EXISTS "User_orgId_idx" ON "User"("orgId");
