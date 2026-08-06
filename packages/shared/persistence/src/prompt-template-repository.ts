import type { PrismaClient } from '@prisma/client';

export interface PromptTemplateRecord {
  id: string;
  name: string;
  description: string | null;
  content: string;
  tags: string[];
  version: number;
  usageCount: number;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function toRecord(row: {
  id: string;
  name: string;
  description: string | null;
  content: string;
  tags: string[];
  version: number;
  usageCount: number;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}): PromptTemplateRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    content: row.content,
    tags: row.tags,
    version: row.version,
    usageCount: row.usageCount,
    createdBy: row.createdBy,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PromptTemplateRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    name: string;
    description?: string;
    content: string;
    tags?: string[];
    createdBy?: string;
  }): Promise<PromptTemplateRecord> {
    const row = await this.prisma.promptTemplate.create({ data });
    return toRecord(row);
  }

  async findAll(): Promise<PromptTemplateRecord[]> {
    const rows = await this.prisma.promptTemplate.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(toRecord);
  }

  async findById(id: string): Promise<PromptTemplateRecord | undefined> {
    const row = await this.prisma.promptTemplate.findUnique({ where: { id } });
    return row ? toRecord(row) : undefined;
  }

  async findByName(name: string): Promise<PromptTemplateRecord | undefined> {
    const row = await this.prisma.promptTemplate.findFirst({ where: { name } });
    return row ? toRecord(row) : undefined;
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      content?: string;
      tags?: string[];
    },
  ): Promise<PromptTemplateRecord> {
    const row = await this.prisma.promptTemplate.update({
      where: { id },
      data: { ...data, version: { increment: 1 } },
    });
    return toRecord(row);
  }

  async incrementUsage(id: string): Promise<void> {
    await this.prisma.promptTemplate.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.promptTemplate.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
