export interface Tenant {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  quotas: TenantQuotas;
  status: 'active' | 'suspended' | 'deleted';
}

export interface TenantQuotas {
  maxTasksPerDay: number;
  maxCostPerMonthUsd: number;
  maxConcurrentAgents: number;
}

export interface TenantUsage {
  tenantId: string;
  tasksToday: number;
  costThisMonthUsd: number;
  activeAgents: number;
}

export interface TenantManager {
  create(name: string, quotas: TenantQuotas): Promise<Tenant>;
  getById(id: string): Promise<Tenant | null>;
  list(): Promise<Tenant[]>;
  update(id: string, updates: Partial<Tenant>): Promise<Tenant>;
  delete(id: string): Promise<void>;
  checkQuota(tenantId: string, resource: keyof TenantQuotas): Promise<boolean>;
}

export interface TenantContext {
  tenantId: string;
}
