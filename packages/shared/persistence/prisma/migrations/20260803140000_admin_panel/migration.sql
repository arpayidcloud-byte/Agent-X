-- Admin panel (panel.id-tech.cloud): native preset slug + auth method metadata
ALTER TABLE "LlmProvider" ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'custom';
ALTER TABLE "LlmProvider" ADD COLUMN "authMethod" TEXT NOT NULL DEFAULT 'api-key';
ALTER TABLE "LlmProvider" ADD COLUMN "accountRef" TEXT;
ALTER TABLE "LlmProvider" ADD COLUMN "lastTestAt" TIMESTAMP(3);
ALTER TABLE "LlmProvider" ADD COLUMN "lastTestOk" BOOLEAN;

-- Admin action audit trail
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminAuditLog_email_createdAt_idx" ON "AdminAuditLog"("email", "createdAt");
CREATE INDEX "AdminAuditLog_target_createdAt_idx" ON "AdminAuditLog"("target", "createdAt");
