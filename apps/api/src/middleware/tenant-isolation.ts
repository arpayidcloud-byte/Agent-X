/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Prisma client extension for tenant isolation (PLAN Phase4 §3 — RLS app-level).
 * Auto-injects `orgId` filter for Task/CostEntry/Workflow/LlmProvider.
 */
import { currentTenant } from '@agent-xai/tenant';

const TENANT_SCOPED_MODELS = new Set(['Task', 'CostEntry', 'Workflow', 'LlmProvider']);

function injectOrgWhere(
  params: { where?: Record<string, unknown> } | undefined,
  orgId: string,
): void {
  if (!params) params = {};
  const w = params.where ?? {};
  if ('orgId' in w) {
    (w as Record<string, unknown>).orgId = {
      AND: [{ orgId }, (w as Record<string, unknown>).orgId as Record<string, unknown>],
    };
  } else {
    (w as Record<string, unknown>).orgId = orgId;
  }
  params.where = w;
}

export function wrapWithTenantIsolation(prisma: any): any {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async findFirst({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async findFirstOrThrow({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async findUnique({
          args,
          query,
        }: {
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          return query(args) as Promise<unknown>;
        },
        async count({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async aggregate({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async update({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async updateMany({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async delete({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
        async deleteMany({
          model,
          args,
          query,
        }: {
          model: string;
          args: unknown;
          query: (a: unknown) => Promise<unknown>;
        }) {
          const ctx = currentTenant();
          if (ctx && TENANT_SCOPED_MODELS.has(model) && !ctx.isAdmin) {
            injectOrgWhere(args as { where?: Record<string, unknown> }, ctx.orgId);
          }
          return query(args) as Promise<unknown>;
        },
      },
    },
  }) as any;
}

export function assertOrgOwned<T extends { orgId?: string | null }>(row: T, orgId: string): T {
  if (!row.orgId) throw new Error('Resource has no orgId');
  if (row.orgId !== orgId) throw new Error('Cross-tenant access denied');
  return row;
}
