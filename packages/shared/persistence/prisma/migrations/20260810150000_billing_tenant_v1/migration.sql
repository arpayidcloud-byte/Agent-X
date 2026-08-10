-- Phase 3 billing-tenant-v1 (manual deploy — no npx in api image)
CREATE TABLE IF NOT EXISTS "Organization" ("id" TEXT PRIMARY KEY,"name" TEXT,"slug" TEXT UNIQUE,"planId" TEXT,"status" TEXT DEFAULT 'active',"createdAt" TIMESTAMP(3) DEFAULT now(),"updatedAt" TIMESTAMP(3));
CREATE INDEX IF NOT EXISTS "Organization_planId_idx" ON "Organization"("planId");
CREATE INDEX IF NOT EXISTS "Organization_slug_idx" ON "Organization"("slug");

CREATE TABLE IF NOT EXISTS "OrganizationMember" ("id" TEXT PRIMARY KEY,"orgId" TEXT,"userId" TEXT,"role" TEXT DEFAULT 'member',"createdAt" TIMESTAMP(3) DEFAULT now());
CREATE UNIQUE INDEX IF NOT EXISTS "OrganizationMember_orgId_userId_key" ON "OrganizationMember"("orgId","userId");
CREATE INDEX IF NOT EXISTS "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");
CREATE INDEX IF NOT EXISTS "OrganizationMember_orgId_idx" ON "OrganizationMember"("orgId");

CREATE TABLE IF NOT EXISTS "Plan" ("id" TEXT PRIMARY KEY,"slug" TEXT UNIQUE,"name" TEXT,"priceUsd" INTEGER,"interval" TEXT DEFAULT 'month',"maxTasksPerMonth" INTEGER,"maxMembers" INTEGER DEFAULT 1,"features" JSON,"isActive" BOOLEAN DEFAULT true,"createdAt" TIMESTAMP(3) DEFAULT now(),"updatedAt" TIMESTAMP(3));

CREATE TABLE IF NOT EXISTS "Subscription" ("id" TEXT PRIMARY KEY,"orgId" TEXT,"userId" TEXT,"planId" TEXT,"status" TEXT,"gateway" TEXT,"gatewayCustomerId" TEXT,"gatewaySubscriptionId" TEXT,"currentPeriodStart" TIMESTAMP(3),"currentPeriodEnd" TIMESTAMP(3),"trialEndsAt" TIMESTAMP(3),"cancelAtPeriodEnd" BOOLEAN DEFAULT false,"createdAt" TIMESTAMP(3) DEFAULT now(),"updatedAt" TIMESTAMP(3));
CREATE INDEX IF NOT EXISTS "Subscription_orgId_status_idx" ON "Subscription"("orgId","status");
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_gatewaySubscriptionId_key" ON "Subscription"("gatewaySubscriptionId");
CREATE INDEX IF NOT EXISTS "Subscription_planId_idx" ON "Subscription"("planId");

CREATE TABLE IF NOT EXISTS "Invoice" ("id" TEXT PRIMARY KEY,"orgId" TEXT,"subscriptionId" TEXT,"gateway" TEXT,"gatewayInvoiceId" TEXT,"amountCents" INTEGER,"currency" TEXT DEFAULT 'usd',"status" TEXT,"hostedInvoiceUrl" TEXT,"pdfUrl" TEXT,"periodStart" TIMESTAMP(3),"periodEnd" TIMESTAMP(3),"paidAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) DEFAULT now());
CREATE INDEX IF NOT EXISTS "Invoice_orgId_createdAt_idx" ON "Invoice"("orgId","createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_gatewayInvoiceId_key" ON "Invoice"("gatewayInvoiceId");

CREATE TABLE IF NOT EXISTS "Entitlement" ("id" TEXT PRIMARY KEY,"orgId" TEXT UNIQUE,"tasksUsed" INTEGER DEFAULT 0,"periodStart" TIMESTAMP(3),"periodEnd" TIMESTAMP(3),"updatedAt" TIMESTAMP(3) DEFAULT now());
CREATE INDEX IF NOT EXISTS "Entitlement_periodEnd_idx" ON "Entitlement"("periodEnd");

-- Alter existing (nullable FK, safe with IF NOT EXISTS)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
ALTER TABLE "CostEntry" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
ALTER TABLE "Workflow" ADD COLUMN IF NOT EXISTS "orgId" TEXT;
