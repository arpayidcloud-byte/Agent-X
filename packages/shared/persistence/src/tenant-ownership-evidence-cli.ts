import { disconnectDb, getPrisma } from './client.js';
import {
  buildTenantOwnershipEvidenceInventory,
  type CostEvidenceRow,
  type UserEvidenceRow,
} from './tenant-ownership-evidence.js';

const prisma = getPrisma();
if (!prisma) throw new Error('DATABASE_URL is required for tenant ownership evidence inventory');
const db = prisma;

async function main(): Promise<void> {
  const users = await db.$queryRawUnsafe<UserEvidenceRow[]>(`
    SELECT
      u.id,
      u.email,
      u."orgId",
      COALESCE(
        array_agg(DISTINCT m."orgId") FILTER (WHERE m."orgId" IS NOT NULL),
        ARRAY[]::text[]
      ) AS "memberOrgIds",
      COALESCE(
        array_agg(DISTINCT c.id) FILTER (WHERE c.id IS NOT NULL),
        ARRAY[]::text[]
      ) AS "historicalCostEntryIds"
    FROM "User" u
    LEFT JOIN "OrganizationMember" m ON m."userId" = u.id
    LEFT JOIN "CostEntry" c ON c."userId" = u.id
    WHERE u."orgId" IS NULL
    GROUP BY u.id, u.email, u."orgId", u."createdAt"
    ORDER BY u."createdAt", u.id
  `);

  const costEntries = await db.$queryRawUnsafe<CostEvidenceRow[]>(`
    SELECT
      c.id,
      c."orgId",
      c."userId",
      c."taskId",
      t."orgId" AS "taskOrgId",
      u."orgId" AS "userOrgId",
      (t.id IS NOT NULL) AS "taskExists",
      (u.id IS NOT NULL) AS "userExists",
      COALESCE(
        ARRAY(
          SELECT DISTINCT related_task_id
          FROM (
            SELECT qs."taskId" AS related_task_id
            FROM "QualityScore" qs
            WHERE qs."taskId" = c."taskId"
            UNION
            SELECT af."taskId" AS related_task_id
            FROM "AgentFeedback" af
            WHERE af."taskId" = c."taskId"
          ) related
          WHERE related_task_id IS NOT NULL
        ),
        ARRAY[]::text[]
      ) AS "corroboratingTaskIds"
    FROM "CostEntry" c
    LEFT JOIN "Task" t ON t.id = c."taskId"
    LEFT JOIN "User" u ON u.id = c."userId"
    WHERE c."orgId" IS NULL
    ORDER BY c."createdAt", c.id
  `);

  const report = buildTenantOwnershipEvidenceInventory({ users, costEntries });
  console.log(JSON.stringify(report, null, 2));
  if (!report.readyForBackfill) process.exitCode = 2;
}

async function run(): Promise<void> {
  try {
    await main();
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    await disconnectDb();
  }
}

void run();
