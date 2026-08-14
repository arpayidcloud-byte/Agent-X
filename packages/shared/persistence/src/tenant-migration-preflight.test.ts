import { describe, expect, it } from 'vitest';
import {
  assessTenantMigrationPreflight,
  REQUIRED_TENANT_MIGRATIONS,
  type TenantMigrationPreflightSnapshot,
} from './tenant-migration-preflight.js';

const healthySnapshot: TenantMigrationPreflightSnapshot = {
  appliedMigrations: REQUIRED_TENANT_MIGRATIONS,
  tables: { Organization: true, OrganizationMember: true, CostEntry: true },
  nullableCounts: { User: 0, Task: 0, Workflow: 0, CostEntry: 0, OrganizationMember: 0 },
  orphanCounts: { organizationMembers: 0, subscriptions: 0, invoices: 0, entitlements: 0 },
  indexes: ['CostEntry_orgId_idx', 'Workflow_orgId_idx', 'User_orgId_idx'],
};

describe('tenant migration preflight assessment', () => {
  it('passes only when migrations and tenant ownership are ready', () => {
    const report = assessTenantMigrationPreflight(healthySnapshot);
    expect(report.ready).toBe(true);
    expect(report.blockers).toEqual([]);
  });

  it('fails closed on missing migrations, null ownership, or orphan rows', () => {
    const report = assessTenantMigrationPreflight({
      ...healthySnapshot,
      appliedMigrations: [],
      nullableCounts: { ...healthySnapshot.nullableCounts, Task: 3 },
      orphanCounts: { ...healthySnapshot.orphanCounts, organizationMembers: 2 },
      indexes: [],
    });
    expect(report.ready).toBe(false);
    expect(report.blockers).toEqual([
      'required migrations are not all recorded as applied',
      'tenant-owned rows still have NULL orgId values',
      'organization membership rows reference missing organizations',
      'required tenant indexes are missing',
    ]);
  });
});
