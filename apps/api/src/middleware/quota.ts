/**
 * Quota middleware (PLAN Phase3 §5).
 * requireAuth → resolve orgId → canConsume → 429 if over limit.
 */
import type { Response, NextFunction } from 'express';
import { canConsume } from '@agent-xai/billing';
import { getPrisma } from '@agent-xai/persistence';
import type { AuthenticatedRequest } from '../auth.js';

async function resolveOrgId(userId: string | undefined): Promise<string | null> {
  if (!userId) return null;
  const prisma = getPrisma();
  if (!prisma) return null;
  const member = await prisma.organizationMember.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
  if (member) return member.orgId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.orgId ?? null;
}

export async function quotaMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orgId = await resolveOrgId(req.auth?.sub);
    if (!orgId) {
      // No org yet (free anonymous / pre-onboarding) — allow; rate-limit elsewhere
      next();
      return;
    }
    const ok = await canConsume(orgId);
    if (!ok) {
      res.status(429).json({
        error: 'quota_exceeded',
        message: 'Monthly task limit reached. Upgrade plan.',
      });
      return;
    }
    // Stash for recordUsage after handler
    (req as AuthenticatedRequest & { orgId?: string }).orgId = orgId;
    next();
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
