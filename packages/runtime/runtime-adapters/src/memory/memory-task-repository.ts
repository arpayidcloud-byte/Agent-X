import type { ITaskRepository, TaskModel } from '@agentx-fast/core-runtime';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, TaskModel>();

  async save(task: TaskModel): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async findById(id: string): Promise<TaskModel | undefined> {
    return this.tasks.get(id);
  }

  async findByRootId(rootId: string): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter((t) => t.rootTaskId === rootId);
  }

  async getAll(): Promise<TaskModel[]> {
    return Array.from(this.tasks.values());
  }
}