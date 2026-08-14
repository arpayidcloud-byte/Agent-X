ALTER TABLE "QualityScore" ADD COLUMN "orgId" TEXT;

CREATE INDEX "QualityScore_orgId_createdAt_idx" ON "QualityScore"("orgId", "createdAt");

ALTER TABLE "AgentFeedback" ADD COLUMN "orgId" TEXT;

CREATE INDEX "AgentFeedback_orgId_createdAt_idx" ON "AgentFeedback"("orgId", "createdAt");
