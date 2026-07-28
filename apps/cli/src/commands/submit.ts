import { randomUUID } from 'crypto';
import { getRuntime } from '../lib/runtime.js';
import { TaskStatus, TaskPriority } from '@agentx-fast/core-runtime';

export async function submit(args: string[]): Promise<string> {
  // Parse --role flag
  const roleIndex = args.findIndex((a) => a === '--role');
  const assignedRole = roleIndex >= 0 ? args[roleIndex + 1] : 'coder';
  const goal = args.filter((a) => !a.startsWith('--') && a !== '--role').join(' ');
  
  if (!goal) {
    throw new Error('Usage: agentx submit "<goal>" [--role <agent-role>]');
  }

  const { scheduler } = getRuntime();

  const taskId = randomUUID();
  const graphId = `graph-${randomUUID().slice(0, 8)}`;
  const now = new Date();

  const task = {
    id: taskId,
    goal,
    status: TaskStatus.CREATED,
    priority: TaskPriority.NORMAL,
    rootTaskId: taskId,
    dependsOn: [],
    traceId: graphId,
    assignedAgentRole: assignedRole,
    metadata: {
      retryCount: 0,
    },
    context: {
      variables: {},
      history: [],
    },
    createdAt: now,
    updatedAt: now,
  };

  await scheduler.enqueue(task);

  console.log(`Task created: ${taskId}`);
  console.log(`  Goal: ${goal}`);
  console.log(`  Graph: ${graphId}`);
  console.log(`  Status: ${TaskStatus.CREATED}`);
  console.log(`\nRun "agentx status ${taskId}" to check progress.`);
  console.log(`Run "agentx watch ${graphId}" to stream execution.`);

  return taskId;
}
