import { disconnectDb, getPrisma } from './client.js';
import {
  buildTenantOwnershipReconciliation,
  type CostOwnershipRow,
  type UserOwnershipRow,
} from './tenant-ownership-reconciliation.js';

const prisma = getPrisma();
if (!prisma) throw new Error('DATABASE_URL is required for tenant ownership reconciliation');
const db = prisma;

async function main(): Promise<void> {
  const users = await db.$queryRawUnsafe<UserOwnershipRow[]>(`
    SELECT
      u.id,
      u.email,
      u."orgId",
      COALESCE(
        array_agg(m."orgId") FILTER (WHERE m."orgId" IS NOT NULL),
        ARRAY[]::text[]
      ) AS "memberOrgIds"
    FROM "User" u
    LEFT JOIN "OrganizationMember" m ON m."userId" = u.id
    GROUP BY u.id, u.email, u."orgId"
    ORDER BY u."createdAt", u.id
  `);
  const costEntries = await db.$queryRawUnsafe<CostOwnershipRow[]>(`
    SELECT
      c.id,
      c."orgId",
      c."userId",
      c."taskId",
      t."orgId" AS "taskOrgId",
      u."orgId" AS "userOrgId"
    FROM "CostEntry" c
    LEFT JOIN "Task" t ON t.id = c."taskId"
    LEFT JOIN "User" u ON u.id = c."userId"
    ORDER BY c."createdAt", c.id
  `);

  const report = buildTenantOwnershipReconciliation({ users, costEntries });
  console.log(JSON.stringify(report, null, 2));
  if (!report.readyForBackfill) process.exitCode = 2;
}

void main().finally(() => {
  void disconnectDb();
});
