/**
 * Prisma client extension for tenant isolation (PLAN Phase4 §3 — RLS app-level).
 * Reads current TenantCtx from AsyncLocalStorage; auto-injects `orgId` filter
 * on models with orgId field (Task, CostEntry, Workflow, LlmProvider).
 *
 * Models excluded from filter:
 *  - User, Organization, OrganizationMember, Plan, Subscription, Invoice, Entitlement
 *    (org/identity/subscription tables — either org-scoped differently or
 *    intentionally cross-tenant for billing admin).
 *  - AdminAuditLog (admin-only).
 *
 * Admin bypass: if `ctx.isAdmin === true`, the filter is NOT applied
 * (admin sees all tenants via /v1/billing/metrics or /admin routes).
 */
import type { PrismaClient } from '@prisma/client';
import { currentTenant } from '@agent-xai/tenant';

const TENANT_SCOPED_MODELS = new Set(['Task', 'CostEntry', 'Workflow', 'LlmProvider']);

function injectOrgWhere(
  params: { where?: Record<string, unknown> } | undefined,
  orgId: string,
): void {
  if (!params) params = {};
  const w = params.where ?? {};
  if ('orgId' in w) {
    // Already specified — merge AND clause
    w.orgId = { AND: [{ orgId }, w.orgId as Record<string, unknown>] };
  } else {
    w.orgId = orgId;
  }
  params.where = w;
}

export function tenantIsolation(prisma: PrismaClient): PrismaClient {
  const models = TENANT_SCOPED_MODELS;
  // Prisma 5.x $extends: build a model-level wrapper.
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async findFirstOrThrow({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async findUnique({ model: _model, args, query }) {
          // findUnique uses unique constraint; cannot inject orgId where.
          // Caller must verify orgId manually after fetch.
          return query(args);
        },
        async count({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async aggregate({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async update({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async updateMany({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async delete({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          const ctx = currentTenant();
          if (ctx && models.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args);
        },
      },
    },
  }) as unknown as PrismaClient;
}

/**
 * Verify org ownership after findUnique (findUnique bypasses filter — caller must check).
 */
export function assertOrgOwned<T extends { orgId?: string | null }>(row: T, orgId: string): T {
  if (!row.orgId) throw new Error('Resource has no orgId');
  if (row.orgId !== orgId) throw new Error('Cross-tenant access denied');
  return row;
}
