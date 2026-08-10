/**
 * Entitlement / quota service (PLAN Phase3 §5).
 * canConsume → 429 when tasksUsed >= plan.maxTasksPerMonth.
 */
import { getPrisma } from '@agent-xai/persistence';

const FREE_TASK_LIMIT = 100;

export async function canConsume(orgId: string): Promise<boolean> {
  const prisma = getPrisma();
  if (!prisma) return true; // memory / no-db — allow (dev)

  const ent = await prisma.entitlement.findUnique({ where: { orgId } });
  if (!ent) return true; // no entitlement row → free trial path

  // Resolve plan limit via active/trialing subscription
  const sub = await prisma.subscription.findFirst({
    where: { orgId, status: { in: ['active', 'trialing'] } },
    include: { plan: true },
  });
  const limit = sub?.plan?.maxTasksPerMonth ?? FREE_TASK_LIMIT;
  if (ent.periodEnd < new Date()) {
    // Period rolled — reset allowed (caller may upsert)
    return true;
  }
  return ent.tasksUsed < limit;
}

export async function recordUsage(orgId: string, tasks = 1): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  await prisma.entitlement.upsert({
    where: { orgId },
    update: { tasksUsed: { increment: tasks }, updatedAt: now },
    create: {
      orgId,
      tasksUsed: tasks,
      periodStart: now,
      periodEnd,
    },
  });
}

export async function getEntitlement(orgId: string) {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.entitlement.findUnique({ where: { orgId } });
}
