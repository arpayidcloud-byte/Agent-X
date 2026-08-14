import type { ITaskRepository, TaskModel } from '@agent-xai/core-runtime';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, TaskModel>();

  async save(task: TaskModel): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async findById(orgId: string, id: string): Promise<TaskModel | undefined> {
    if (!orgId.trim()) return undefined;
    const task = this.tasks.get(id);
    return task?.orgId === orgId ? task : undefined;
  }

  async findByRootId(orgId: string, rootId: string): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter(
      (t) => t.orgId === orgId && t.rootTaskId === rootId,
    );
  }

  async getAll(orgId: string): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter((t) => t.orgId === orgId);
  }
}
