import type { TaskModel } from '../interfaces/task.js';
import type { ITaskRepository } from '../interfaces/scheduler.js';

/**
 * In-memory implementation of ITaskRepository for testing and development.
 * Stores tasks in a Map with no persistence.
 * @example
 * ```ts
 * const repo = new InMemoryTaskRepository();
 * await repo.save(task);
 * const found = await repo.findById(task.id);
 * ```
 */
export class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, TaskModel>();

  /**
   * Saves a task to the repository within an organization scope.
   * @param orgId - Authenticated organization context
   * @param task - Task model to save
   */
  async save(orgId: string, task: TaskModel): Promise<void> {
    if (!orgId.trim()) throw new Error('Organization context required for task persistence');
    const existing = this.tasks.get(task.id);
    if (existing && existing.orgId !== orgId) throw new Error('Task organization mismatch');
    this.tasks.set(task.id, { ...task, orgId });
  }

  /**
   * Finds a task by its ID.
   * @param id - Task ID to search for
   * @returns Task model if found, undefined otherwise
   */
  async findById(orgId: string, id: string): Promise<TaskModel | undefined> {
    if (!orgId.trim()) return undefined;
    const task = this.tasks.get(id);
    return task?.orgId === orgId ? task : undefined;
  }

  /**
   * Finds all tasks with the given root task ID.
   * @param rootId - Root task ID to filter by
   * @returns Array of matching task models
   */
  async findByRootId(orgId: string, rootId: string): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter(
      (t) => t.orgId === orgId && t.rootTaskId === rootId,
    );
  }

  /**
   * Retrieves all tasks from the repository.
   * @returns Array of all task models
   */
  async getAll(orgId: string): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter((t) => t.orgId === orgId);
  }
}
