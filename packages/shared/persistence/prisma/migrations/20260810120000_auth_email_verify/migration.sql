-- Phase 0+2: RefreshToken persist + User emailVerified + EmailVerificationToken
CREATE TABLE IF NOT EXISTS "RefreshToken" ("id" TEXT NOT NULL, "token" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX IF NOT EXISTS "RefreshToken_token_key" ON "RefreshToken"("token");
CREATE INDEX IF NOT EXISTS "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE INDEX IF NOT EXISTS "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;
CREATE TABLE IF NOT EXISTS "EmailVerificationToken" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "token" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX IF NOT EXISTS "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");
CREATE INDEX IF NOT EXISTS "EmailVerificationToken_email_idx" ON "EmailVerificationToken"("email");
CREATE INDEX IF NOT EXISTS "EmailVerificationToken_expiresAt_idx" ON "EmailVerificationToken"("expiresAt");
