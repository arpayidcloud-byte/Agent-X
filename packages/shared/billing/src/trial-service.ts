/**
 * Trial onboarding service (PLAN Phase3 §6).
 * Creates org + free subscription + entitlement on first register.
 */
import { getPrisma } from '@agent-xai/persistence';

const TRIAL_DAYS = parseInt(process.env.BILLING_TRIAL_DAYS ?? '14', 10);

/**
 * Create organization + trial subscription + entitlement for a newly registered user.
 * Safe to call multiple times (idempotent via userId check).
 */
export async function createTrialOnRegister(
  userId: string,
  email: string,
  name?: string,
): Promise<{ orgId: string } | null> {
  const prisma = getPrisma();
  if (!prisma) return null; // memory / no-db — skip

  // Idempotent: check if user already has an org
  const existing = await prisma.organizationMember.findFirst({ where: { userId } });
  if (existing) return { orgId: existing.orgId };

  // Resolve free plan
  const freePlan = await prisma.plan.findUnique({ where: { slug: 'free' } });
  if (!freePlan) {
    // Seed not run — skip trial, register proceeds without org
    return null;
  }

  const orgName = name ?? email.split('@')[0] ?? 'My Org';
  const slug = `${
    email
      .split('@')[0]
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-') ?? 'org'
  }-${Date.now().toString(36)}`;
  const now = new Date();
  const trialEnd = new Date(now.getTime() + TRIAL_DAYS * 86400 * 1000);

  const org = await prisma.organization.create({
    data: {
      name: orgName,
      slug,
      planId: freePlan.id,
      status: 'active',
      members: {
        create: { userId, role: 'owner' },
      },
      subscriptions: {
        create: {
          userId,
          planId: freePlan.id,
          status: 'trialing',
          gateway: 'none',
          trialEndsAt: trialEnd,
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + 30 * 86400 * 1000),
        },
      },
    },
  });

  // Create entitlement row
  await prisma.entitlement.create({
    data: {
      orgId: org.id,
      tasksUsed: 0,
      periodStart: now,
      periodEnd: new Date(now.getTime() + 30 * 86400 * 1000),
    },
  });

  // Update user orgId
  await prisma.user.update({ where: { id: userId }, data: { orgId: org.id } });

  return { orgId: org.id };
}

/**
 * Check expiring trials (for cron). Returns orgs whose trial ends within `days` days.
 */
export async function findTrialsEndingWithin(days: number) {
  const prisma = getPrisma();
  if (!prisma) return [];
  const cutoff = new Date(Date.now() + days * 86400 * 1000);
  return prisma.subscription.findMany({
    where: { status: 'trialing', trialEndsAt: { lte: cutoff, gte: new Date() } },
    include: { org: true },
  });
}

/**
 * Auto-downgrade expired trials to free (no gateway subscription).
 */
export async function downgradeExpiredTrials(): Promise<number> {
  const prisma = getPrisma();
  if (!prisma) return 0;
  const now = new Date();
  const freePlan = await prisma.plan.findUnique({ where: { slug: 'free' } });
  const freePlanId = freePlan?.id;

  const expired = await prisma.subscription.findMany({
    where: { status: 'trialing', trialEndsAt: { lte: now }, gatewaySubscriptionId: null },
  });

  for (const sub of expired) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: 'active',
        planId: freePlanId ?? sub.planId,
        currentPeriodStart: now,
        currentPeriodEnd: new Date(now.getTime() + 30 * 86400 * 1000),
      },
    });
  }
  return expired.length;
}
