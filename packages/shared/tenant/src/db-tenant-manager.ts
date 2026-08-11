/**
 * DB-backed TenantManager (Prisma).
 * Replaces in-memory map with real `Organization`/`OrganizationMember`/`Entitlement`.
 * Used by Phase 4 multi-tenant isolation.
 */
import { getPrisma } from '@agent-xai/persistence';
import type { TenantManager, Tenant, TenantQuotas, TenantUsage } from './interfaces.js';

const DEFAULT_QUOTAS: TenantQuotas = {
  maxTasksPerDay: 1000,
  maxCostPerMonthUsd: 100,
  maxConcurrentAgents: 5,
};

function tenantFromRow(row: {
  id: string;
  name: string;
  slug: string;
  planId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): Tenant {
  const status: Tenant['status'] =
    row.status === 'active' ? 'active' : row.status === 'suspended' ? 'suspended' : 'deleted';
  return {
    id: row.id,
    name: row.name,
    quotas: DEFAULT_QUOTAS,
    status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DbTenantManager implements TenantManager {
  async create(name: string, _quotas: TenantQuotas): Promise<Tenant> {
    const prisma = getPrisma();
    if (!prisma) throw new Error('DB unavailable');
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString(36);
    const row = await prisma.organization.create({
      data: { name, slug, status: 'active' },
    });
    return tenantFromRow(row);
  }

  async getById(id: string): Promise<Tenant | null> {
    const prisma = getPrisma();
    if (!prisma) return null;
    const row = await prisma.organization.findUnique({ where: { id } });
    return row ? tenantFromRow(row) : null;
  }

  async getBySlug(slug: string): Promise<Tenant | null> {
    const prisma = getPrisma();
    if (!prisma) return null;
    const row = await prisma.organization.findUnique({ where: { slug } });
    return row ? tenantFromRow(row) : null;
  }

  async list(): Promise<Tenant[]> {
    const prisma = getPrisma();
    if (!prisma) return [];
    const rows = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map(tenantFromRow);
  }

  async update(
    id: string,
    updates: Partial<{ name: string; status: string; planId: string | null }>,
  ): Promise<Tenant> {
    const prisma = getPrisma();
    if (!prisma) throw new Error('DB unavailable');
    const row = await prisma.organization.update({
      where: { id },
      data: { ...updates, updatedAt: new Date() },
    });
    return tenantFromRow(row);
  }

  async delete(id: string): Promise<void> {
    const prisma = getPrisma();
    if (!prisma) throw new Error('DB unavailable');
    await prisma.organization.delete({ where: { id } });
  }

  async checkQuota(tenantId: string, resource: keyof TenantQuotas): Promise<boolean> {
    const usage = await this.getUsage(tenantId);
    const tenant = await this.getById(tenantId);
    if (!tenant) return false;
    const quotas = tenant.quotas;
    switch (resource) {
      case 'maxTasksPerDay':
        return usage.tasksToday < quotas.maxTasksPerDay;
      case 'maxCostPerMonthUsd':
        return usage.costThisMonthUsd < quotas.maxCostPerMonthUsd;
      case 'maxConcurrentAgents':
        return usage.activeAgents < quotas.maxConcurrentAgents;
      default:
        return false;
    }
  }

  async addMember(orgId: string, userId: string, role = 'member'): Promise<void> {
    const prisma = getPrisma();
    if (!prisma) throw new Error('DB unavailable');
    await prisma.organizationMember.upsert({
      where: { orgId_userId: { orgId, userId } },
      update: { role },
      create: { orgId, userId, role },
    });
  }

  async removeMember(orgId: string, userId: string): Promise<void> {
    const prisma = getPrisma();
    if (!prisma) throw new Error('DB unavailable');
    await prisma.organizationMember.deleteMany({ where: { orgId, userId } });
  }

  async listMembers(
    orgId: string,
  ): Promise<Array<{ userId: string; role: string; createdAt: Date }>> {
    const prisma = getPrisma();
    if (!prisma) return [];
    const rows = await prisma.organizationMember.findMany({
      where: { orgId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r: { userId: string; role: string; createdAt: Date }) => ({
      userId: r.userId,
      role: r.role,
      createdAt: r.createdAt,
    }));
  }

  async getUserOrgId(userId: string): Promise<string | null> {
    const prisma = getPrisma();
    if (!prisma) return null;
    const u = await prisma.user.findUnique({ where: { id: userId } });
    if (u?.orgId) return u.orgId;
    const m = await prisma.organizationMember.findFirst({ where: { userId } });
    return m?.orgId ?? null;
  }

  async getUsage(orgId: string): Promise<TenantUsage> {
    const prisma = getPrisma();
    if (!prisma) {
      return { tenantId: orgId, tasksToday: 0, costThisMonthUsd: 0, activeAgents: 0 };
    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const [tasks, cost, agents] = await Promise.all([
      prisma.task.count({ where: { orgId, createdAt: { gte: startOfDay } } }),
      prisma.costEntry.aggregate({
        where: { orgId, createdAt: { gte: startOfMonth } },
        _sum: { costUsd: true },
      }),
      prisma.workflow.count({ where: { orgId } }),
    ]);
    return {
      tenantId: orgId,
      tasksToday: tasks,
      costThisMonthUsd: cost._sum.costUsd ?? 0,
      activeAgents: agents,
    };
  }
}
