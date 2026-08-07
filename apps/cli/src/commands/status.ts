/**
 * agentx status — Check task status.
 *
 * Cloud-only: requires authentication. Login first with: agentx login
 */
import { isCloudAuthed, cloudFetch } from '../lib/cloud-api.js';

interface CloudTask {
  id: string;
  prompt?: string;
  description?: string;
  status: string;
  provider?: string;
  model?: string;
  response?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export async function status(args: string[]): Promise<void> {
  const taskId = args[0];

  // ── Auth guard ──
  if (!isCloudAuthed()) {
    throw new Error('Not authenticated. Run: agentx login --email <email> --password <password>');
  }

  try {
    if (taskId) {
      const res = await cloudFetch<{ tasks: CloudTask[]; total: number }>(
        `/v1/agentx/tasks?limit=200`,
      );
      const task = res.tasks.find((t) => t.id === taskId);
      if (!task) {
        console.error(`Task ${taskId} not found.`);
        process.exit(1);
      }
      printTask(task);
    } else {
      const res = await cloudFetch<{ tasks: CloudTask[]; total: number }>(
        '/v1/agentx/tasks?limit=50',
      );
      if (res.tasks.length === 0) {
        console.log('No tasks found.');
        return;
      }
      console.log(`Tasks (${res.total} total):`);
      console.log('');
      for (const task of res.tasks) {
        const statusIcon = task.status === 'success' ? '✓' : task.status === 'error' ? '✗' : '○';
        const prompt = (task.prompt ?? task.description ?? '').slice(0, 60);
        console.log(`  ${statusIcon} ${task.id.slice(0, 12)} ${task.status.padEnd(8)} ${prompt}`);
      }
    }
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 401 || status === 403) {
      throw new Error('Session expired. Run: agentx login');
    }
    throw new Error(`Cloud status failed: ${(err as Error).message}`);
  }
}

function printTask(task: CloudTask): void {
  console.log(`Task:    ${task.id}`);
  console.log(`Status:  ${task.status}`);
  console.log(`Prompt:  ${(task.prompt ?? '').slice(0, 120)}`);
  if (task.description) console.log(`Desc:    ${task.description}`);
  if (task.provider) console.log(`Provider: ${task.provider}`);
  if (task.model) console.log(`Model:   ${task.model}`);
  if (task.response) console.log(`Response: ${task.response.slice(0, 500)}`);
  if (task.error) console.log(`Error:   ${task.error}`);
  console.log(`Created: ${task.createdAt}`);
  if (task.completedAt) console.log(`Done:    ${task.completedAt}`);
}
