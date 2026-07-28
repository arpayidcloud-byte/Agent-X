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
   * Saves a task to the repository.
   * @param task - Task model to save
   */
  async save(task: TaskModel): Promise<void> {
    this.tasks.set(task.id, task);
  }

  /**
   * Finds a task by its ID.
   * @param id - Task ID to search for
   * @returns Task model if found, undefined otherwise
   */
  async findById(id: string): Promise<TaskModel | undefined> {
    return this.tasks.get(id);
  }

  /**
   * Finds all tasks with the given root task ID.
   * @param rootId - Root task ID to filter by
   * @returns Array of matching task models
   */
  async findByRootId(rootId: string): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter((t) => t.rootTaskId === rootId);
  }

  /**
   * Retrieves all tasks from the repository.
   * @returns Array of all task models
   */
  async getAll(): Promise<TaskModel[]> {
    return Array.from(this.tasks.values());
  }
}
