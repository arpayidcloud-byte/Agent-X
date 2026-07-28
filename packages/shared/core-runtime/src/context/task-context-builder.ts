import type { TaskContext, TaskId } from '../interfaces/task.js';

export interface TaskContextBuilderConfig {
  maxHistoryItems?: number;
}

export interface MemoryReference {
  search(
    query: string,
    options?: { limit?: number },
  ): Promise<Array<{ content: string; type: string }>>;
}

export class TaskContextBuilder {
  private readonly maxHistoryItems: number;

  constructor(
    private readonly memory: MemoryReference,
    config?: TaskContextBuilderConfig,
  ) {
    this.maxHistoryItems = config?.maxHistoryItems ?? 10;
  }

  async build(taskId: TaskId): Promise<TaskContext> {
    const memories = await this.memory.search(taskId, { limit: this.maxHistoryItems });
    const history = memories.map((m) => ({
      role: m.type,
      content: m.content,
    }));

    return {
      variables: {},
      history,
    };
  }
}
