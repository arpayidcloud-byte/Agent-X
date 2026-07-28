import { getRuntime } from '../lib/runtime.js';

export async function status(args: string[]): Promise<void> {
  const taskId = args[0];
  const { scheduler, taskRepo } = getRuntime();

  if (!taskId) {
    const tasks = await taskRepo.getAll();
    if (tasks.length === 0) {
      console.log('No tasks found');
      return;
    }
    console.log('Tasks:');
    for (const task of tasks) {
      console.log(`  ${task.id} - ${task.status} - ${task.goal}`);
    }
    return;
  }

  const task = await scheduler.getTask(taskId);
  if (!task) {
    console.error(`Task ${taskId} not found`);
    process.exit(1);
  }

  console.log(`Task: ${task.id}`);
  console.log(`Status: ${task.status}`);
  console.log(`Goal: ${task.goal}`);
}
