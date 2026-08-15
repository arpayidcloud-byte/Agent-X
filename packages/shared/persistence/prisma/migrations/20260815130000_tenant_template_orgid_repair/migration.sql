-- Repair columns omitted when template tables already existed via db push.
ALTER TABLE "AgentTemplate" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
ALTER TABLE "PromptTemplate" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
