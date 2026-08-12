/**
 * analytics — AgentX CLI analytics command (§6.1).
 *  agentx analytics
 */
import { cloudFetch, isCloudAuthed } from '../lib/cloud-api.js';

export async function analyticsCmd(_args: string[]): Promise<void> {
  if (!isCloudAuthed()) throw new Error('Not authenticated. Run: agentx login');

  const data = await cloudFetch<{
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    totalCostUsd: number;
    activeUsers: number;
    period: string;
  }>('/v1/analytics/summary');

  console.log(`Analytics (${data.period}):`);
  console.log(
    `  Tasks:       ${data.totalTasks} total, ${data.completedTasks} completed, ${data.failedTasks} failed`,
  );
  console.log(`  Total cost:  $${data.totalCostUsd.toFixed(4)}`);
  console.log(`  Active users: ${data.activeUsers}`);
}
