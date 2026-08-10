/**
 * Phase 3 billing API routes (PLAN-FIX §4).
 * Plans public; checkout/portal/me/invoices requireAuth; MRR admin.
 * Gateway stubs throw when keys missing — surface 503, not 500 bare.
 */
import type { Express, Request, Response } from 'express';
import { getPrisma } from '@agent-xai/persistence';
import {
  createCheckoutSession,
  createPortalSession,
  createSnapTransaction,
  canConsume,
  getEntitlement,
  verifyStripeWebhook,
  verifyMidtransWebhook,
} from '@agent-xai/billing';
import { requireAuth, maybeRequireAdmin, type AuthenticatedRequest } from './auth.js';

/** Static fallback when Plan table empty / no DB (matches PLAN seed cents). */
const FALLBACK_PLANS = [
  {
    slug: 'free',
    name: 'Free',
    priceUsd: 0,
    interval: 'month',
    maxTasksPerMonth: 100,
    maxMembers: 1,
    features: { tasks: 100, analytics: false },
  },
  {
    slug: 'pro',
    name: 'Pro',
    priceUsd: 2900,
    interval: 'month',
    maxTasksPerMonth: 1000,
    maxMembers: 1,
    features: { tasks: 1000, analytics: true },
  },
  {
    slug: 'team',
    name: 'Team',
    priceUsd: 9900,
    interval: 'month',
    maxTasksPerMonth: 5000,
    maxMembers: 5,
    features: { tasks: 5000, analytics: true },
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    priceUsd: 49900,
    interval: 'month',
    maxTasksPerMonth: 999999,
    maxMembers: 50,
    features: { tasks: 999999, analytics: true },
  },
  {
    slug: 'flex',
    name: 'Flex',
    priceUsd: 0,
    interval: 'month',
    maxTasksPerMonth: 100,
    maxMembers: 1,
    features: { tasks: 100, analytics: false },
  },
];

async function resolvePrimaryOrgId(userId: string): Promise<string | null> {
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

export function registerBillingRoutes(app: Express): void {
  // ─── GET /v1/billing/plans (public) ──────────────────────────────────────
  app.get('/v1/billing/plans', async (_req: Request, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      if (prisma) {
        const rows = await prisma.plan.findMany({
          where: { isActive: true },
          orderBy: { priceUsd: 'asc' },
        });
        if (rows.length > 0) {
          res.json({ plans: rows });
          return;
        }
      }
      res.json({ plans: FALLBACK_PLANS });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── POST /v1/billing/checkout ───────────────────────────────────────────
  app.post(
    '/v1/billing/checkout',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        const { planSlug, gateway } = req.body ?? {};
        if (!planSlug || typeof planSlug !== 'string') {
          res.status(400).json({ error: 'Missing field: planSlug' });
          return;
        }
        const gw = (gateway as string) || process.env.BILLING_GATEWAY || 'stripe';
        const userId = req.auth?.sub;
        if (!userId) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        const orgId = (await resolvePrimaryOrgId(userId)) ?? `pending-${userId}`;
        if (gw === 'midtrans') {
          const snap = await createSnapTransaction(orgId, planSlug);
          res.json({ gateway: 'midtrans', token: snap.token, redirectUrl: snap.redirectUrl });
          return;
        }
        const session = await createCheckoutSession(orgId, planSlug);
        res.json({ gateway: 'stripe', url: session.url });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const status = /not configured|not yet wired/i.test(msg) ? 503 : 500;
        res.status(status).json({ error: msg });
      }
    },
  );

  // ─── POST /v1/billing/webhook (Stripe) ───────────────────────────────────
  app.post('/v1/billing/webhook', async (req: Request, res: Response): Promise<void> => {
    try {
      const sig = req.headers['stripe-signature'];
      const raw =
        typeof req.body === 'string' || Buffer.isBuffer(req.body)
          ? String(req.body)
          : JSON.stringify(req.body ?? {});
      if (!sig || typeof sig !== 'string' || !verifyStripeWebhook(raw, sig)) {
        res.status(400).json({ error: 'Invalid stripe signature' });
        return;
      }
      // Idempotent handlers land with real Stripe events; ack for now
      res.json({ received: true });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── POST /v1/billing/midtrans/webhook ───────────────────────────────────
  app.post('/v1/billing/midtrans/webhook', async (req: Request, res: Response): Promise<void> => {
    try {
      const { order_id, status_code, gross_amount, signature_key } = req.body ?? {};
      if (
        !verifyMidtransWebhook(
          String(order_id ?? ''),
          String(status_code ?? ''),
          String(gross_amount ?? ''),
          String(signature_key ?? ''),
        )
      ) {
        res.status(400).json({ error: 'Invalid midtrans signature' });
        return;
      }
      res.json({ received: true });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── GET /v1/billing/me ──────────────────────────────────────────────────
  app.get(
    '/v1/billing/me',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        const userId = req.auth?.sub;
        if (!userId) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        const orgId = await resolvePrimaryOrgId(userId);
        if (!orgId) {
          res.json({
            orgId: null,
            subscription: null,
            entitlement: null,
            trialEndsAt: null,
            daysLeft: null,
          });
          return;
        }
        const prisma = getPrisma();
        let subscription = null;
        let invoices: unknown[] = [];
        if (prisma) {
          subscription = await prisma.subscription.findFirst({
            where: { orgId, status: { in: ['active', 'trialing', 'past_due'] } },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
          });
          invoices = await prisma.invoice.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
            take: 20,
          });
        }
        const entitlement = await getEntitlement(orgId);
        const trialEndsAt = subscription?.trialEndsAt ?? null;
        const daysLeft =
          trialEndsAt != null
            ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / 86_400_000))
            : null;
        res.json({
          orgId,
          subscription,
          entitlement,
          invoices,
          trialEndsAt,
          daysLeft,
          canConsume: await canConsume(orgId),
        });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── POST /v1/billing/portal ─────────────────────────────────────────────
  app.post(
    '/v1/billing/portal',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        const userId = req.auth?.sub;
        if (!userId) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        const prisma = getPrisma();
        const user = prisma ? await prisma.user.findUnique({ where: { id: userId } }) : null;
        const customerId = user?.stripeCustomerId;
        if (!customerId) {
          res.status(400).json({ error: 'No Stripe customer on file' });
          return;
        }
        const session = await createPortalSession(customerId);
        res.json({ url: session.url });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const status = /not configured|not yet wired/i.test(msg) ? 503 : 500;
        res.status(status).json({ error: msg });
      }
    },
  );

  // ─── POST /v1/billing/cancel ─────────────────────────────────────────────
  app.post(
    '/v1/billing/cancel',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        const userId = req.auth?.sub;
        if (!userId) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        const orgId = await resolvePrimaryOrgId(userId);
        if (!orgId) {
          res.status(400).json({ error: 'No organization' });
          return;
        }
        const prisma = getPrisma();
        if (!prisma) {
          res.status(503).json({ error: 'Database unavailable' });
          return;
        }
        const sub = await prisma.subscription.findFirst({
          where: { orgId, status: { in: ['active', 'trialing'] } },
          orderBy: { createdAt: 'desc' },
        });
        if (!sub) {
          res.status(404).json({ error: 'No active subscription' });
          return;
        }
        const updated = await prisma.subscription.update({
          where: { id: sub.id },
          data: { cancelAtPeriodEnd: true },
        });
        res.json({ ok: true, subscription: updated });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── GET /v1/billing/invoices ────────────────────────────────────────────
  app.get(
    '/v1/billing/invoices',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        const userId = req.auth?.sub;
        if (!userId) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        const orgId = await resolvePrimaryOrgId(userId);
        if (!orgId) {
          res.json({ invoices: [] });
          return;
        }
        const prisma = getPrisma();
        if (!prisma) {
          res.json({ invoices: [] });
          return;
        }
        const invoices = await prisma.invoice.findMany({
          where: { orgId },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
        res.json({ invoices });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── GET /v1/billing/metrics/mrr (admin) ─────────────────────────────────
  app.get(
    '/v1/billing/metrics/mrr',
    maybeRequireAdmin,
    async (_req: Request, res: Response): Promise<void> => {
      try {
        const prisma = getPrisma();
        if (!prisma) {
          res.json({
            mrr: 0,
            arr: 0,
            activeSubscriptions: 0,
            churnRate: 0,
            arpu: 0,
            newMrr30d: 0,
          });
          return;
        }
        const active = await prisma.subscription.findMany({
          where: { status: { in: ['active', 'trialing'] } },
          include: { plan: true },
        });
        const mrrCents = active.reduce((sum, s) => sum + (s.plan?.priceUsd ?? 0), 0);
        const mrr = mrrCents / 100;
        const activeSubscriptions = active.length;
        const arpu = activeSubscriptions > 0 ? mrr / activeSubscriptions : 0;

        const since = new Date(Date.now() - 30 * 86_400_000);
        const canceled = await prisma.subscription.count({
          where: { status: 'canceled', updatedAt: { gte: since } },
        });
        const activeStartApprox = activeSubscriptions + canceled;
        const churnRate = activeStartApprox > 0 ? canceled / activeStartApprox : 0;

        const newSubs = await prisma.subscription.findMany({
          where: { createdAt: { gte: since }, status: { in: ['active', 'trialing'] } },
          include: { plan: true },
        });
        const newMrr30d = newSubs.reduce((sum, s) => sum + (s.plan?.priceUsd ?? 0), 0) / 100;

        res.json({
          mrr,
          arr: mrr * 12,
          activeSubscriptions,
          churnRate,
          arpu,
          newMrr30d,
        });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );
}
