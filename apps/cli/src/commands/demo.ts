// apps/cli/src/commands/demo.ts
import { getRuntime } from '../lib/runtime.js';
import { TaskStatus, TaskPriority } from '@agentx-fast/core-runtime';
import { randomUUID } from 'crypto';
import { callLLM } from '@agentx-fast/agent-platform';

/**
 * E2E Demo Command - Demonstrates full AgentX flow
 * CLI → Runtime → Agent → LLM → Response
 */
export async function demo(args: string[]): Promise<void> {
  const goal = args.join(' ') || 'Explain what is AgentX';

  console.log('🚀 AgentX E2E Demo\n');
  console.log(`Goal: ${goal}\n`);

  // Step 1: Initialize Runtime
  console.log('📦 Step 1: Initializing Runtime...');
  const { scheduler } = getRuntime();
  console.log('✅ Runtime initialized\n');

  // Step 2: Create Task
  console.log('📝 Step 2: Creating Task...');
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
    assignedAgentRole: 'coder' as const,
    metadata: {
      retryCount: 0,
      demo: true,
    },
    context: {
      variables: {},
      history: [],
    },
    createdAt: now,
    updatedAt: now,
  };

  console.log(`   Task ID: ${taskId}`);
  console.log(`   Graph ID: ${graphId}`);
  console.log(`   Status: ${TaskStatus.CREATED}\n`);

  // Step 3: Enqueue Task
  console.log('⏳ Step 3: Enqueueing Task...');
  await scheduler.enqueue(task);
  console.log('✅ Task enqueued\n');

  // Step 4: Call LLM directly (demonstrating provider integration)
  console.log('🤖 Step 4: Calling LLM Provider...');
  try {
    const llmPrompt = `You are demonstrating AgentX capabilities. ${goal}

Please provide a concise, informative response.`;

    const llmResponse = await callLLM(llmPrompt);

    console.log('✅ LLM Response received\n');
    console.log('━'.repeat(60));
    console.log(llmResponse);
    console.log('━'.repeat(60));
  } catch (error) {
    console.log('❌ LLM call failed (this is expected if API keys are not configured)');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}\n`);
    console.log('💡 Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your .env file\n');
  }

  // Step 5: Check Task Status
  console.log('\n📊 Step 5: Checking Task Status...');
  const { taskRepo } = getRuntime();
  const updatedTask = await taskRepo.findById(taskId);

  if (updatedTask) {
    console.log(`   Task ID: ${updatedTask.id}`);
    console.log(`   Status: ${updatedTask.status}`);
    console.log(`   Goal: ${updatedTask.goal}`);
  }

  console.log('\n✅ E2E Demo Complete!\n');
  console.log('Next steps:');
  console.log('  - Run `agentx submit "<goal>"` to submit a real task');
  console.log('  - Run `agentx status` to check task status');
  console.log('  - Run `agentx approve <task-id>` to approve pending tasks');
}
