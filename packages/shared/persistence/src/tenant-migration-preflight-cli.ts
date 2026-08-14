import { getPrisma, disconnectDb } from './client.js';

const prisma = getPrisma();
if (!prisma) throw new Error('DATABASE_URL is required for migration preflight');
const db = prisma;
import {
  assessTenantMigrationPreflight,
  REQUIRED_TENANT_MIGRATIONS,
  type TenantMigrationPreflightSnapshot,
} from './tenant-migration-preflight.js';

async function count(query: string): Promise<number> {
  const rows = await db.$queryRawUnsafe<Array<{ count: bigint }>>(query);
  return Number(rows[0]?.count ?? 0);
}

async function main(): Promise<void> {
  const applied = await db.$queryRawUnsafe<Array<{ migration_name: string }>>(
    'SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL ORDER BY started_at',
  );
  const tables = await db.$queryRawUnsafe<Array<{ table_name: string }>>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
  );
  const indexes = await db.$queryRawUnsafe<Array<{ indexname: string }>>(
    `SELECT indexname FROM pg_indexes WHERE schemaname = 'public'`,
  );
  const snapshot: TenantMigrationPreflightSnapshot = {
    appliedMigrations: applied.map((row) => row.migration_name),
    tables: Object.fromEntries(
      ['Organization', 'OrganizationMember', 'CostEntry'].map((name) => [
        name,
        tables.some((row) => row.table_name === name),
      ]),
    ),
    nullableCounts: {
      User: await count(`SELECT count(*) FROM "User" WHERE "orgId" IS NULL`),
      Task: await count(`SELECT count(*) FROM "Task" WHERE "orgId" IS NULL`),
      Workflow: await count(`SELECT count(*) FROM "Workflow" WHERE "orgId" IS NULL`),
      CostEntry: await count(`SELECT count(*) FROM "CostEntry" WHERE "orgId" IS NULL`),
      OrganizationMember: await count(
        `SELECT count(*) FROM "OrganizationMember" WHERE "orgId" IS NULL`,
      ),
    },
    orphanCounts: {
      organizationMembers: await count(
        `SELECT count(*) FROM "OrganizationMember" m LEFT JOIN "Organization" o ON o.id = m."orgId" WHERE o.id IS NULL`,
      ),
      subscriptions: await count(
        `SELECT count(*) FROM "Subscription" s LEFT JOIN "Organization" o ON o.id = s."orgId" WHERE s."orgId" IS NOT NULL AND o.id IS NULL`,
      ),
      invoices: await count(
        `SELECT count(*) FROM "Invoice" i LEFT JOIN "Organization" o ON o.id = i."orgId" WHERE i."orgId" IS NOT NULL AND o.id IS NULL`,
      ),
      entitlements: await count(
        `SELECT count(*) FROM "Entitlement" e LEFT JOIN "Organization" o ON o.id = e."orgId" WHERE e."orgId" IS NOT NULL AND o.id IS NULL`,
      ),
    },
    indexes: indexes.map((row) => row.indexname),
  };
  const report = assessTenantMigrationPreflight(snapshot);
  console.log(
    JSON.stringify(
      { requiredMigrations: REQUIRED_TENANT_MIGRATIONS, snapshot, ...report },
      null,
      2,
    ),
  );
  if (!report.ready) process.exitCode = 2;
}

void main().finally(() => {
  void disconnectDb();
});
