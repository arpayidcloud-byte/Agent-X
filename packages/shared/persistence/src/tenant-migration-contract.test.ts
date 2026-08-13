import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migrationDir = resolve(process.cwd(), 'prisma/migrations');
const bootstrap = readFileSync(
  resolve(migrationDir, '20260810140000_tenant_bootstrap_cost_entry/migration.sql'),
  'utf8',
);
const repair = readFileSync(
  resolve(migrationDir, '20260813190000_tenant_expand_cost_workflow_indexes/migration.sql'),
  'utf8',
);

describe('tenant migration contracts', () => {
  it('bootstraps CostEntry before the legacy billing migration alters it', () => {
    expect(bootstrap).toContain('CREATE TABLE IF NOT EXISTS "CostEntry"');
    expect(bootstrap).toContain('"CostEntry_orgId_idx"');
    expect(repair).toContain('"Workflow_orgId_idx"');
    expect(repair).toContain('"User_orgId_idx"');
  });

  it('is additive and does not silently rewrite historical tenant data', () => {
    for (const migration of [bootstrap, repair]) {
      expect(migration).not.toMatch(/\b(DROP|DELETE|TRUNCATE)\b/i);
      expect(migration).not.toMatch(/SET\s+NOT\s+NULL/i);
      expect(migration).not.toMatch(/UPDATE\s+"?(User|Workflow|CostEntry)/i);
    }
  });
});
