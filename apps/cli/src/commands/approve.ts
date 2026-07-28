import { getRuntime } from '../lib/runtime.js';
import { TaskStatus } from '@agentx-fast/core-runtime';

export async function approve(args: string[]): Promise<void> {
  const taskId = args[0];
  const reason = args.slice(1).join(' ') || 'Approved';

  if (!taskId) {
    throw new Error('Usage: agentx approve <taskId> [reason]');
  }

  const { scheduler, taskRepo } = getRuntime();

  const task = await taskRepo.findById(taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  if (task.status !== TaskStatus.WAITING_APPROVAL) {
    throw new Error(`Task ${task.id} is not waiting for approval (status: ${task.status})`);
  }

  await scheduler.resume(taskId);
  console.log(`Task ${taskId} approved`);
  console.log(`  Reason: ${reason}`);
}

export async function reject(args: string[]): Promise<void> {
  const taskId = args[0];
  const reason = args.slice(1).join(' ') || 'Rejected';

  if (!taskId) {
    throw new Error('Usage: agentx reject <taskId> [reason]');
  }

  const { scheduler, taskRepo } = getRuntime();

  const task = await taskRepo.findById(taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  if (task.status !== TaskStatus.WAITING_APPROVAL) {
    throw new Error(`Task ${task.id} is not waiting for approval (status: ${task.status})`);
  }

  await scheduler.cancel(taskId, reason);
  console.log(`Task ${taskId} rejected`);
  console.log(`  Reason: ${reason}`);
}
