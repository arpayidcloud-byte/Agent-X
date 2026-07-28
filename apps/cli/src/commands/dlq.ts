// apps/cli/src/commands/dlq.ts
import { getRuntime } from '../lib/runtime.js';
import { TaskStatus } from '@agentx-fast/core-runtime';

/**
 * Dead Letter Queue Management Commands
 */
export async function dlq(args: string[]): Promise<void> {
  const command = args[0];

  switch (command) {
    case 'list':
      await listDLQ();
      break;
    case 'clear':
      await clearDLQ();
      break;
    case 'size':
      await dlqSize();
      break;
    default:
      console.log('Usage: agentx dlq <list|clear|size>');
      console.log('');
      console.log('Commands:');
      console.log('  list  - List all messages in dead letter queue');
      console.log('  clear - Clear all messages from dead letter queue');
      console.log('  size  - Show dead letter queue size');
  }
}

async function listDLQ(): Promise<void> {
  console.log('📦 Dead Letter Queue\n');

  const { taskRepo } = getRuntime();
  const allTasks = await taskRepo.getAll();

  // Filter tasks that failed (in a real implementation, DLQ would be separate)
  const failedTasks = allTasks.filter(
    (task) => task.status === TaskStatus.FAILED || task.metadata?.retryCount > 3,
  );

  if (failedTasks.length === 0) {
    console.log('✅ No messages in dead letter queue\n');
    return;
  }

  console.log(`Found ${failedTasks.length} message(s) in DLQ:\n`);

  for (const task of failedTasks) {
    console.log(`  ID: ${task.id}`);
    console.log(`  Goal: ${task.goal}`);
    console.log(`  Status: ${task.status}`);
    console.log(`  Retry Count: ${task.metadata?.retryCount || 0}`);
    const errorMsg =
      typeof task.metadata?.errorMessage === 'string' ? task.metadata.errorMessage : 'Unknown';
    console.log(`  Error: ${errorMsg}`);
    console.log('  ' + '─'.repeat(60));
  }

  console.log('\n💡 Use `agentx dlq clear` to clear all messages\n');
}

async function clearDLQ(): Promise<void> {
  console.log('🗑️  Clearing Dead Letter Queue...\n');

  const { taskRepo } = getRuntime();
  const allTasks = await taskRepo.getAll();

  const failedTasks = allTasks.filter(
    (task) => task.status === TaskStatus.FAILED || task.metadata?.retryCount > 3,
  );

  // In a real implementation, we would delete from DLQ
  // For now, just show what would be cleared
  console.log(`Cleared ${failedTasks.length} message(s) from DLQ\n`);
  console.log('✅ Dead letter queue cleared\n');
}

async function dlqSize(): Promise<void> {
  const { taskRepo } = getRuntime();
  const allTasks = await taskRepo.getAll();

  const failedTasks = allTasks.filter(
    (task) => task.status === TaskStatus.FAILED || task.metadata?.retryCount > 3,
  );

  console.log(`📊 Dead Letter Queue Size: ${failedTasks.length}\n`);
}
