-- Tenant orgId backfill: additive, idempotent migration
-- Closes drift for orgId columns that were never captured in a migration
-- and creates the two template tables that were only ever created via db push.
-- Scope is intentionally additive only (no NOT NULL, no DROP INDEX, no FK,
-- no data-type changes) so it is safe to apply on tables that already hold data.

-- AlterTable: add missing orgId columns (IF NOT EXISTS: some envs already have them via db push)
ALTER TABLE "EmailVerificationToken" ADD COLUMN IF NOT EXISTS "orgId" TEXT;

ALTER TABLE "FeedbackEntry" ADD COLUMN IF NOT EXISTS "orgId" TEXT;

ALTER TABLE "RefreshToken" ADD COLUMN IF NOT EXISTS "orgId" TEXT;

ALTER TABLE "WaitlistEntry" ADD COLUMN IF NOT EXISTS "orgId" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PromptTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "orgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AgentTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "systemPrompt" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "priceUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "orgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PromptTemplate_name_idx" ON "PromptTemplate"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PromptTemplate_tags_idx" ON "PromptTemplate"("tags");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PromptTemplate_createdAt_idx" ON "PromptTemplate"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AgentTemplate_authorId_idx" ON "AgentTemplate"("authorId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AgentTemplate_category_idx" ON "AgentTemplate"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AgentTemplate_isPublished_idx" ON "AgentTemplate"("isPublished");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AgentTemplate_installCount_idx" ON "AgentTemplate"("installCount");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AgentTemplate_rating_idx" ON "AgentTemplate"("rating");
