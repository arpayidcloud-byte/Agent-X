-- CreateTable
CREATE TABLE "QualityScore" (
    "id" TEXT NOT NULL,
    "taskId" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "provider" TEXT,
    "model" TEXT,
    "dimensions" JSONB NOT NULL,
    "overall" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "evaluator" TEXT NOT NULL DEFAULT 'heuristic',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QualityScore_createdAt_idx" ON "QualityScore"("createdAt");

-- CreateIndex
CREATE INDEX "QualityScore_provider_createdAt_idx" ON "QualityScore"("provider", "createdAt");
