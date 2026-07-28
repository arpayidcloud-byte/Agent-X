import { describe, it, expect } from 'vitest';
import { InMemoryTenantManager } from '../src/tenant-manager.js';

describe('InMemoryTenantManager', () => {
  it('creates and retrieves tenants', async () => {
    const mgr = new InMemoryTenantManager();
    const tenant = await mgr.create('Acme Corp', {
      maxTasksPerDay: 100,
      maxCostPerMonthUsd: 500,
      maxConcurrentAgents: 5,
    });

    expect(tenant.name).toBe('Acme Corp');
    expect(tenant.status).toBe('active');
    expect(tenant.quotas.maxTasksPerDay).toBe(100);

    const found = await mgr.getById(tenant.id);
    expect(found?.name).toBe('Acme Corp');
  });

  it('lists all tenants', async () => {
    const mgr = new InMemoryTenantManager();
    await mgr.create('Tenant A', {
      maxTasksPerDay: 10,
      maxCostPerMonthUsd: 10,
      maxConcurrentAgents: 1,
    });
    await mgr.create('Tenant B', {
      maxTasksPerDay: 20,
      maxCostPerMonthUsd: 20,
      maxConcurrentAgents: 2,
    });

    const list = await mgr.list();
    expect(list).toHaveLength(2);
  });

  it('updates tenant', async () => {
    const mgr = new InMemoryTenantManager();
    const tenant = await mgr.create('Test', {
      maxTasksPerDay: 10,
      maxCostPerMonthUsd: 10,
      maxConcurrentAgents: 1,
    });

    const updated = await mgr.update(tenant.id, { name: 'Updated' });
    expect(updated.name).toBe('Updated');
  });

  it('deletes tenant', async () => {
    const mgr = new InMemoryTenantManager();
    const tenant = await mgr.create('Delete Me', {
      maxTasksPerDay: 10,
      maxCostPerMonthUsd: 10,
      maxConcurrentAgents: 1,
    });
    await mgr.delete(tenant.id);
    expect(await mgr.getById(tenant.id)).toBeNull();
  });

  it('checks quota correctly', async () => {
    const mgr = new InMemoryTenantManager();
    const tenant = await mgr.create('Quota Test', {
      maxTasksPerDay: 2,
      maxCostPerMonthUsd: 10,
      maxConcurrentAgents: 1,
    });

    expect(await mgr.checkQuota(tenant.id, 'maxTasksPerDay')).toBe(true);
    mgr.recordTask(tenant.id, 0.01);
    expect(await mgr.checkQuota(tenant.id, 'maxTasksPerDay')).toBe(true);
    mgr.recordTask(tenant.id, 0.01);
    expect(await mgr.checkQuota(tenant.id, 'maxTasksPerDay')).toBe(false);
  });

  it('returns false for nonexistent tenant', async () => {
    const mgr = new InMemoryTenantManager();
    expect(await mgr.checkQuota('missing', 'maxTasksPerDay')).toBe(false);
  });
});
