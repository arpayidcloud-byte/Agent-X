import type { PrismaClient, Prisma } from '@prisma/client';

export interface EventModel {
  id: string;
  topic: string;
  payload: Record<string, unknown>;
  taskId?: string;
  createdAt: Date;
}

export interface IEventRepository {
  save(orgId: string, event: EventModel): Promise<void>;
  findByTaskId(orgId: string, taskId: string): Promise<EventModel[]>;
  findByTopic(orgId: string, topic: string, limit?: number): Promise<EventModel[]>;
}

export class PrismaEventRepository implements IEventRepository {
  constructor(private prisma: PrismaClient) {}

  async save(orgId: string, event: EventModel): Promise<void> {
    if (!orgId.trim()) throw new Error('Organization context required for event persistence');
    if (!event.taskId?.trim()) throw new Error('Task context required for event persistence');
    const task = await this.prisma.task.findFirst({
      where: { id: event.taskId, orgId },
      select: { id: true },
    });
    if (!task) throw new Error('Task does not belong to organization');
    await this.prisma.event.create({
      data: {
        id: event.id,
        topic: event.topic,
        payload: event.payload as Prisma.InputJsonValue,
        taskId: event.taskId,
        createdAt: event.createdAt || new Date(),
      },
    });
  }

  async findByTaskId(orgId: string, taskId: string): Promise<EventModel[]> {
    const events = await this.prisma.event.findMany({
      where: { taskId, task: { orgId } },
      orderBy: { createdAt: 'asc' },
    });
    return events.map((e: Record<string, unknown>) => this.toEventModel(e));
  }

  async findByTopic(orgId: string, topic: string, limit?: number): Promise<EventModel[]> {
    const events = await this.prisma.event.findMany({
      where: { topic, task: { orgId } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return events.map((e: Record<string, unknown>) => this.toEventModel(e));
  }

  private toEventModel(prismaEvent: Record<string, unknown>): EventModel {
    return {
      id: prismaEvent.id as string,
      topic: prismaEvent.topic as string,
      payload: prismaEvent.payload as Record<string, unknown>,
      taskId: prismaEvent.taskId as string | undefined,
      createdAt: prismaEvent.createdAt as Date,
    };
  }
}
