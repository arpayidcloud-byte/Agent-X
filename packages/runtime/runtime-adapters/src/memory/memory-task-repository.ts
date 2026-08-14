import type { ITaskRepository, TaskModel } from '@agent-xai/core-runtime';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, TaskModel>();

  async save(orgId: string, task: TaskModel): Promise<void> {
    if (!orgId.trim()) throw new Error('Organization context required for task persistence');
    const existing = this.tasks.get(task.id);
    if (existing && existing.orgId !== orgId) throw new Error('Task organization mismatch');
    this.tasks.set(task.id, { ...task, orgId });
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
