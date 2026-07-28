import type { TaskModel, ITaskRepository } from '@agentx/core-runtime';
import { TaskStatus, TaskPriority, InMemoryEventBus, Scheduler } from '@agentx/core-runtime';

export function createTestTask(id: string, goal: string, status = TaskStatus.CREATED): TaskModel {
  return {
    id,
    goal,
    status,
    priority: TaskPriority.NORMAL,
    rootTaskId: id,
    dependsOn: [],
    traceId: `tr-${id}`,
    metadata: { retryCount: 0 },
    context: { variables: {}, history: [] },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createTestRepo(): ITaskRepository & { tasks: Map<string, TaskModel> } {
  const tasks = new Map<string, TaskModel>();
  return {
    tasks,
    save: async (task: TaskModel) => {
      tasks.set(task.id, task);
    },
    findById: async (id: string) => tasks.get(id),
    findByRootId: (rootId: string) =>
      Promise.resolve(Array.from(tasks.values()).filter((t) => t.rootTaskId === rootId)),
  };
}

export function createTestScheduler(repo: ITaskRepository) {
  const bus = new InMemoryEventBus();
  return { bus, scheduler: new Scheduler(bus, repo, { maxParallelAgents: 3 }) };
}
