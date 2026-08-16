-- Repair historical drift: User.verificationToken / stripeCustomerId / midtransCustomerId
-- are declared in schema.prisma but never created by any existing migration chain.
-- Idempotent and additive so it is safe on both fresh and already-migrated DBs.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "midtransCustomerId" TEXT;
