import { createHash } from 'crypto';
import { InvariantViolationError } from '../shared/errors.js';

export interface TenantEntry {
  readonly tenantId: string;
  readonly name: string;
  readonly plan: string;
  readonly quota: TenantQuota;
  readonly createdAt: Date;
  readonly checksum: string;
}

export interface TenantQuota {
  readonly maxServices: number;
  readonly maxPlugins: number;
  readonly maxRequestsPerSecond: number;
  readonly storageMb: number;
}

export class MultiTenantManager {
  private tenants = new Map<string, TenantEntry>();

  create(name: string, plan: string, quota: TenantQuota): TenantEntry {
    const tenantId = `tenant-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ tenantId, name, plan, quota }))
      .digest('hex');
    const entry: TenantEntry = Object.freeze({
      tenantId,
      name,
      plan,
      quota: { ...quota },
      createdAt: new Date(),
      checksum,
    });
    this.tenants.set(tenantId, entry);
    return entry;
  }

  get(tenantId: string): TenantEntry | undefined {
    return this.tenants.get(tenantId);
  }

  updateQuota(tenantId: string, quota: TenantQuota): TenantEntry {
    const existing = this.tenants.get(tenantId);
    if (!existing)
      throw new InvariantViolationError(
        `Tenant not found: ${tenantId}`,
        'TENANT_NOT_FOUND',
        'MultiTenantManager',
      );
    const checksum = createHash('sha256')
      .update(JSON.stringify({ ...existing, quota }))
      .digest('hex');
    const updated: TenantEntry = Object.freeze({ ...existing, quota: { ...quota }, checksum });
    this.tenants.set(tenantId, updated);
    return updated;
  }

  delete(tenantId: string): boolean {
    return this.tenants.delete(tenantId);
  }

  getAll(): TenantEntry[] {
    return Array.from(this.tenants.values());
  }
}

export interface WorkspaceEntry {
  readonly workspaceId: string;
  readonly tenantId: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly checksum: string;
}

export class WorkspaceManager {
  private workspaces = new Map<string, WorkspaceEntry>();

  create(tenantId: string, name: string): WorkspaceEntry {
    const workspaceId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ workspaceId, tenantId, name }))
      .digest('hex');
    const entry: WorkspaceEntry = Object.freeze({
      workspaceId,
      tenantId,
      name,
      createdAt: new Date(),
      checksum,
    });
    this.workspaces.set(workspaceId, entry);
    return entry;
  }

  get(workspaceId: string): WorkspaceEntry | undefined {
    return this.workspaces.get(workspaceId);
  }

  getByTenant(tenantId: string): WorkspaceEntry[] {
    return Array.from(this.workspaces.values()).filter((w) => w.tenantId === tenantId);
  }

  delete(workspaceId: string): boolean {
    return this.workspaces.delete(workspaceId);
  }

  getAll(): WorkspaceEntry[] {
    return Array.from(this.workspaces.values());
  }
}

export interface SessionEntry {
  readonly sessionId: string;
  readonly tenantId: string;
  readonly userId: string;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  readonly checksum: string;
}

export class SessionManager {
  private sessions = new Map<string, SessionEntry>();

  create(tenantId: string, userId: string, ttlMs: number = 3600000): SessionEntry {
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ sessionId, tenantId, userId }))
      .digest('hex');
    const entry: SessionEntry = Object.freeze({
      sessionId,
      tenantId,
      userId,
      createdAt: now,
      expiresAt,
      checksum,
    });
    this.sessions.set(sessionId, entry);
    return entry;
  }

  get(sessionId: string): SessionEntry | undefined {
    const entry = this.sessions.get(sessionId);
    if (!entry) return undefined;
    if (new Date() > entry.expiresAt) {
      this.sessions.delete(sessionId);
      return undefined;
    }
    return entry;
  }

  invalidate(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getAll(): SessionEntry[] {
    return Array.from(this.sessions.values());
  }
}
