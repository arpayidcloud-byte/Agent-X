import type {
  ITaskRepository,
  TaskModel,
  TaskStatus,
  TaskPriority,
  TaskMetadata,
  TaskContext,
  TaskResult,
  TaskError,
} from '@agent-xai/core-runtime';
import type { Prisma, PrismaClient } from '@prisma/client';

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaClient) {}

  async save(orgId: string, task: TaskModel): Promise<void> {
    if (!orgId?.trim()) throw new Error('Organization context required for task persistence');
    if (task.orgId && task.orgId !== orgId) throw new Error('Task organization mismatch');

    const existing = await this.prisma.task.findUnique({
      where: { id: task.id },
      select: { orgId: true },
    });
    if (existing && existing.orgId !== orgId) {
      throw new Error('Task organization mismatch');
    }

    const data: Prisma.TaskUncheckedCreateInput = {
      id: task.id,
      goal: task.goal,
      status: task.status as string,
      priority: String(task.priority),
      parentTaskId: task.parentTaskId ?? null,
      rootTaskId: task.rootTaskId,
      assignedAgentRole: task.assignedAgentRole,
      dependsOn: task.dependsOn,
      traceId: task.traceId,
      metadata: task.metadata as unknown as Prisma.InputJsonValue,
      context: task.context as unknown as Prisma.InputJsonValue,
      result: (task.result ?? null) as unknown as Prisma.InputJsonValue,
      error: (task.error ?? null) as unknown as Prisma.InputJsonValue,
      orgId: orgId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    await this.prisma.task.upsert({
      where: { id: task.id },
      update: data,
      create: data,
    });
  }

  async findById(orgId: string, id: string): Promise<TaskModel | undefined> {
    if (!orgId.trim()) return undefined;
    const task = await this.prisma.task.findUnique({
      where: { id, orgId },
      include: { events: true },
    });
    return task ? this.toTaskModel(task) : undefined;
  }

  async findByRootId(orgId: string, rootId: string): Promise<TaskModel[]> {
    if (!orgId.trim()) return [];
    const tasks = await this.prisma.task.findMany({
      where: { rootTaskId: rootId, orgId },
      orderBy: { createdAt: 'asc' },
    });
    return tasks.map((t: Record<string, unknown>) => this.toTaskModel(t));
  }

  async getAll(orgId: string): Promise<TaskModel[]> {
    if (!orgId.trim()) return [];
    const tasks = await this.prisma.task.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map((t: Record<string, unknown>) => this.toTaskModel(t));
  }

  private toTaskModel(prismaTask: Record<string, unknown>): TaskModel {
    return {
      orgId: prismaTask.orgId as string | undefined,
      id: prismaTask.id as string,
      goal: prismaTask.goal as string,
      status: prismaTask.status as TaskStatus,
      priority: Number(prismaTask.priority) as TaskPriority,
      parentTaskId: prismaTask.parentTaskId as string | undefined,
      rootTaskId: prismaTask.rootTaskId as string,
      assignedAgentRole: prismaTask.assignedAgentRole as string | undefined,
      dependsOn: prismaTask.dependsOn as string[],
      traceId: prismaTask.traceId as string,
      metadata: prismaTask.metadata as unknown as TaskMetadata,
      context: prismaTask.context as unknown as TaskContext,
      result: prismaTask.result as unknown as TaskResult,
      error: prismaTask.error as unknown as TaskError,
      createdAt: prismaTask.createdAt as Date,
      updatedAt: prismaTask.updatedAt as Date,
    };
  }
}
