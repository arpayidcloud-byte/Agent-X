/**
 * agentx status — Check task status.
 *
 * Cloud-first: when authenticated, fetches from cloud API.
 * Falls back to local runtime when no cloud token is set.
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

  // ── Cloud mode ──
  if (isCloudAuthed()) {
    try {
      if (taskId) {
        // Get single task — we'll use the tasks list and filter
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
        // List all tasks
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
          const statusColor = task.status === 'success' ? '✓' : task.status === 'error' ? '✗' : '○';
          const prompt = (task.prompt ?? task.description ?? '').slice(0, 60);
          console.log(
            `  ${statusColor} ${task.id.slice(0, 12)} ${task.status.padEnd(8)} ${prompt}`,
          );
        }
      }
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 401 || status === 403) {
        throw new Error('Not authenticated. Run: agentx login');
      }
      throw new Error(`Cloud status failed: ${(err as Error).message}`);
    }
    return;
  }

  // ── Local fallback ──
  const { getRuntime } = await import('../lib/runtime.js');
  const { scheduler, taskRepo } = getRuntime();

  if (!taskId) {
    const tasks = await taskRepo.getAll();
    if (tasks.length === 0) {
      console.log('No tasks found (local).');
      console.log('Run "agentx login" to connect to the cloud.');
      return;
    }
    console.log('Tasks (local):');
    for (const task of tasks) {
      console.log(`  ${task.id} - ${task.status} - ${task.goal}`);
    }
    return;
  }

  const task = await scheduler.getTask(taskId);
  if (!task) {
    console.error(`Task ${taskId} not found (local).`);
    process.exit(1);
  }

  console.log(`Task: ${task.id}`);
  console.log(`Status: ${task.status}`);
  console.log(`Goal: ${task.goal}`);
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
