/**
 * AsyncLocalStorage for current request tenant context.
 * Populated by `withOrg` middleware, read by Prisma middleware.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantCtx {
  orgId: string;
  userId: string;
  roles: string[];
  isAdmin: boolean;
}

const storage = new AsyncLocalStorage<TenantCtx>();

export function runWithTenant<T>(ctx: TenantCtx, fn: () => Promise<T> | T): Promise<T> | T {
  return storage.run(ctx, fn);
}

export function currentTenant(): TenantCtx | null {
  return storage.getStore() ?? null;
}

export function requireTenant(): TenantCtx {
  const ctx = storage.getStore();
  if (!ctx) throw new Error('No tenant context for current request');
  return ctx;
}
