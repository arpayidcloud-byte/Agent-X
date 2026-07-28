import type { IMemoryStore, Memory, MemorySearchOptions, MemoryType } from './interfaces.js';
import { PrismaClient, type Prisma } from '@prisma/client';

type PrismaMemoryRecord = {
  id: string;
  type: string;
  content: string;
  importance: number;
  sessionId: string | null;
  taskId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaMemoryStore implements IMemoryStore {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async save(memory: Memory): Promise<void> {
    await this.prisma.memory.create({
      data: {
        id: memory.id,
        type: memory.type,
        content: memory.content,
        importance: memory.importance,
        sessionId: memory.sessionId || null,
        taskId: memory.taskId || null,
        metadata: (memory.metadata || {}) as Prisma.InputJsonValue,
      },
    });
  }

  async find(id: string): Promise<Memory | undefined> {
    const record = (await this.prisma.memory.findUnique({
      where: { id },
    })) as PrismaMemoryRecord | null;

    if (!record) return undefined;

    return this.prismaToMemory(record);
  }

  async search(query: string, options?: MemorySearchOptions): Promise<Memory[]> {
    const where: Record<string, unknown> = {};

    if (query) {
      where.content = { contains: query };
    }

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.minImportance) {
      where.importance = { gte: options.minImportance };
    }

    if (options?.sessionId) {
      where.sessionId = options.sessionId;
    }

    if (options?.taskId) {
      where.taskId = options.taskId;
    }

    const records = (await this.prisma.memory.findMany({
      where,
      orderBy: options?.orderByImportance ? { importance: 'desc' } : { createdAt: 'desc' },
      take: options?.limit,
    })) as PrismaMemoryRecord[];

    return records.map((record) => this.prismaToMemory(record));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.memory.delete({
      where: { id },
    });
  }

  async list(): Promise<Memory[]> {
    const records = (await this.prisma.memory.findMany({
      orderBy: { createdAt: 'desc' },
    })) as PrismaMemoryRecord[];

    return records.map((record) => this.prismaToMemory(record));
  }

  async clear(): Promise<void> {
    await this.prisma.memory.deleteMany();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  private prismaToMemory(record: PrismaMemoryRecord): Memory {
    return {
      id: record.id,
      type: record.type as MemoryType,
      content: record.content,
      importance: record.importance,
      sessionId: record.sessionId || undefined,
      taskId: record.taskId || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      metadata: record.metadata as Record<string, unknown>,
    };
  }
}
