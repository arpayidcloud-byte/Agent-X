-- Enterprise tenant bootstrap migration.
-- Must remain before 20260810150000_billing_tenant_v1: that legacy migration
-- alters CostEntry before declaring/creating it. This additive predecessor makes
-- fresh databases and databases with the old migration history converge.

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

CREATE INDEX IF NOT EXISTS "CostEntry_taskId_idx" ON "CostEntry"("taskId");
CREATE INDEX IF NOT EXISTS "CostEntry_userId_idx" ON "CostEntry"("userId");
CREATE INDEX IF NOT EXISTS "CostEntry_provider_idx" ON "CostEntry"("provider");
CREATE INDEX IF NOT EXISTS "CostEntry_createdAt_idx" ON "CostEntry"("createdAt");
CREATE INDEX IF NOT EXISTS "CostEntry_orgId_idx" ON "CostEntry"("orgId");
