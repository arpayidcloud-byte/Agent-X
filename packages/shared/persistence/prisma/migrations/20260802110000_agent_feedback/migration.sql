-- CreateTable
CREATE TABLE "AgentFeedback" (
    "id" TEXT NOT NULL,
    "scoreId" TEXT NOT NULL,
    "taskId" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "weakDimensions" JSONB NOT NULL,
    "priorityAdvice" JSONB NOT NULL,
    "improvementPrompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentFeedback_scoreId_key" ON "AgentFeedback"("scoreId");

-- CreateIndex
CREATE INDEX "AgentFeedback_createdAt_idx" ON "AgentFeedback"("createdAt");

-- CreateIndex
CREATE INDEX "AgentFeedback_grade_createdAt_idx" ON "AgentFeedback"("grade", "createdAt");
