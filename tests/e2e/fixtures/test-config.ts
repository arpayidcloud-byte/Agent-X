import type { TaskModel, ITaskRepository } from '@agentx/core-runtime';
import { TaskStatus, TaskPriority, InMemoryEventBus, Scheduler } from '@agentx/core-runtime';

export const TEST_ORG_ID = 'org-test';

export function createTestTask(id: string, goal: string, status = TaskStatus.CREATED): TaskModel {
  return {
    id,
    orgId: TEST_ORG_ID,
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
    save: async (orgId: string, task: TaskModel) => {
      const existing = tasks.get(task.id);
      if (existing && existing.orgId !== orgId) throw new Error('Task organization mismatch');
      tasks.set(task.id, { ...task, orgId });
    },
    findById: async (orgId: string, id: string) => {
      const task = tasks.get(id);
      return task?.orgId === orgId ? task : undefined;
    },
    findByRootId: async (orgId: string, rootId: string) =>
      Array.from(tasks.values()).filter((t) => t.orgId === orgId && t.rootTaskId === rootId),
    getAll: async (orgId: string) => Array.from(tasks.values()).filter((t) => t.orgId === orgId),
  };
}

export function createTestScheduler(repo: ITaskRepository) {
  const bus = new InMemoryEventBus();
  return { bus, scheduler: new Scheduler(bus, repo, { maxParallelAgents: 3 }) };
}
