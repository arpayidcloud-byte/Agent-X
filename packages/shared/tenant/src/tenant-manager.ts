import type { Tenant, TenantManager, TenantQuotas, TenantUsage } from './interfaces.js';

export class InMemoryTenantManager implements TenantManager {
  private tenants = new Map<string, Tenant>();
  private usage = new Map<string, TenantUsage>();

  async create(name: string, quotas: TenantQuotas): Promise<Tenant> {
    const id = `tenant-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const tenant: Tenant = {
      id,
      name,
      quotas,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tenants.set(id, tenant);
    this.usage.set(id, { tenantId: id, tasksToday: 0, costThisMonthUsd: 0, activeAgents: 0 });
    return tenant;
  }

  async getById(id: string): Promise<Tenant | null> {
    return this.tenants.get(id) ?? null;
  }

  async list(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async update(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenants.get(id);
    if (!tenant) throw new Error(`Tenant ${id} not found`);
    const updated = { ...tenant, ...updates, updatedAt: new Date() };
    this.tenants.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.tenants.delete(id);
    this.usage.delete(id);
  }

  async checkQuota(tenantId: string, resource: keyof TenantQuotas): Promise<boolean> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;

    const usage = this.usage.get(tenantId);
    if (!usage) return false;

    switch (resource) {
      case 'maxTasksPerDay':
        return usage.tasksToday < tenant.quotas.maxTasksPerDay;
      case 'maxCostPerMonthUsd':
        return usage.costThisMonthUsd < tenant.quotas.maxCostPerMonthUsd;
      case 'maxConcurrentAgents':
        return usage.activeAgents < tenant.quotas.maxConcurrentAgents;
      default:
        return false;
    }
  }

  recordTask(tenantId: string, costUsd: number): void {
    const usage = this.usage.get(tenantId);
    if (usage) {
      usage.tasksToday++;
      usage.costThisMonthUsd += costUsd;
    }
  }

  getUsage(tenantId: string): TenantUsage | undefined {
    return this.usage.get(tenantId);
  }
}
