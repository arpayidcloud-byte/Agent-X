/**
 * withOrg middleware (PLAN Phase4 §2 — multi-tenant RLS).
 * Requires valid Bearer token. Extracts user → resolves Organization (primary orgId or member) →
 * populates req.auth.orgId + runs request inside AsyncLocalStorage tenant context.
 */
import type { Response, NextFunction } from 'express';
import { verifyToken, AuthError, getUserById } from '../auth.js';
import { getPrisma } from '@agent-xai/persistence';
import { runWithTenant } from '@agent-xai/tenant';
import type { AuthenticatedRequest } from '../auth.js';

async function resolveOrgId(userId: string): Promise<string | null> {
  const prisma = getPrisma();
  if (!prisma) {
    const user = await getUserById(userId);
    return user?.orgId ?? null;
  }
  const member = await prisma.organizationMember.findFirst({ where: { userId } });
  if (member) return member.orgId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.orgId ?? null;
}

export async function withOrg(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/, '');
    if (!token) {
      res.status(401).json({ error: 'Missing Bearer token' });
      return;
    }
    const payload = verifyToken(token);
    const userId = payload.sub;
    if (!userId) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }
    const orgId = await resolveOrgId(userId);
    if (!orgId) {
      res.status(403).json({ error: 'No organization assigned. Please join or create an org.' });
      return;
    }
    // Enrich payload with orgId + roles (admin/user)
    const roles = payload.roles ?? (payload.sub ? ['user'] : []);
    const isAdmin = roles.includes('admin');
    const enriched = { ...payload, orgId, isAdmin };
    req.auth = enriched;

    // Set AsyncLocalStorage tenant context
    void runWithTenant(
      {
        orgId,
        userId,
        roles,
        isAdmin,
      },
      () => next(),
    );
  } catch (e) {
    const status = e instanceof AuthError ? e.status : 401;
    res.status(status).json({ error: e instanceof Error ? e.message : 'Unauthorized' });
  }
}
