export const REQUIRED_TENANT_MIGRATIONS = [
  '20260810140000_tenant_bootstrap_cost_entry',
  '20260810150000_billing_tenant_v1',
  '20260813190000_tenant_expand_cost_workflow_indexes',
] as const;

export type TenantMigrationPreflightSnapshot = {
  appliedMigrations: readonly string[];
  tables: Record<string, boolean>;
  nullableCounts: Record<'User' | 'Task' | 'Workflow' | 'CostEntry' | 'OrganizationMember', number>;
  orphanCounts: Record<
    'organizationMembers' | 'subscriptions' | 'invoices' | 'entitlements',
    number
  >;
  indexes: readonly string[];
};

export type TenantMigrationPreflightReport = {
  ready: boolean;
  blockers: string[];
};

export function assessTenantMigrationPreflight(
  snapshot: TenantMigrationPreflightSnapshot,
): TenantMigrationPreflightReport {
  const blockers: string[] = [];
  if (
    !REQUIRED_TENANT_MIGRATIONS.every((migration) => snapshot.appliedMigrations.includes(migration))
  ) {
    blockers.push('required migrations are not all recorded as applied');
  }
  if (Object.values(snapshot.nullableCounts).some((count) => count > 0)) {
    blockers.push('tenant-owned rows still have NULL orgId values');
  }
  if (snapshot.orphanCounts.organizationMembers > 0) {
    blockers.push('organization membership rows reference missing organizations');
  }
  if (
    snapshot.orphanCounts.subscriptions > 0 ||
    snapshot.orphanCounts.invoices > 0 ||
    snapshot.orphanCounts.entitlements > 0
  ) {
    blockers.push('billing rows reference missing organizations');
  }
  if (
    !snapshot.tables.Organization ||
    !snapshot.tables.OrganizationMember ||
    !snapshot.tables.CostEntry
  ) {
    blockers.push('required tenant tables are missing');
  }
  if (
    !['CostEntry_orgId_idx', 'Workflow_orgId_idx', 'User_orgId_idx'].every((index) =>
      snapshot.indexes.includes(index),
    )
  ) {
    blockers.push('required tenant indexes are missing');
  }
  return { ready: blockers.length === 0, blockers };
}
