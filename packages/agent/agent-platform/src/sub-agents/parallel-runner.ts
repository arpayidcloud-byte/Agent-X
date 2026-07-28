import type { AgentRole } from './interfaces.js';
import type { TaskModel } from '@agentx-fast/core-runtime';
import type { AgentPool } from './agent-pool.js';
import type { MessageBus } from './message-bus.js';

export interface ParallelExecutionResult {
  taskId: string;
  results: Record<string, unknown>;
  errors: Record<string, Error>;
}

export class ParallelRunner {
  constructor(
    private pool: AgentPool,
    private bus: MessageBus,
  ) {}

  public async runParallel(
    task: TaskModel,
    roles: AgentRole[],
    context: unknown,
  ): Promise<ParallelExecutionResult> {
    const promises: Promise<void>[] = [];
    const results: Record<string, unknown> = {};
    const errors: Record<string, Error> = {};

    for (const role of roles) {
      promises.push(this.runSingleAgent(role, task, context, results, errors));
    }

    await Promise.all(promises);

    return {
      taskId: task.id,
      results,
      errors,
    };
  }

  private async runSingleAgent(
    role: AgentRole,
    task: TaskModel,
    context: unknown,
    results: Record<string, unknown>,
    errors: Record<string, Error>,
  ): Promise<void> {
    const agent = this.pool.acquire(role);
    try {
      this.bus.publish({
        id: `msg-${Date.now()}-${agent.id}`,
        topic: 'TaskAssigned',
        senderId: 'orchestrator',
        receiverId: agent.id,
        taskId: task.id,
        payload: { role },
        timestamp: new Date(),
      });

      const result = await agent.execute(task, context);
      results[agent.id] = result;

      this.bus.publish({
        id: `msg-${Date.now()}-${agent.id}-done`,
        topic: 'TaskCompleted',
        senderId: agent.id,
        taskId: task.id,
        payload: { result },
        timestamp: new Date(),
      });
    } catch (e: unknown) {
      errors[agent.id] = e instanceof Error ? e : new Error(String(e));

      this.bus.publish({
        id: `msg-${Date.now()}-${agent.id}-err`,
        topic: 'TaskFailed',
        senderId: agent.id,
        taskId: task.id,
        payload: { error: String(e) },
        timestamp: new Date(),
      });
    } finally {
      this.pool.release(agent.id);
    }
  }
}
