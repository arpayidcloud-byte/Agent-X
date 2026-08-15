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
  orgId?: string;
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
  orgId: string | null;
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
    orgId: row.orgId ?? undefined,
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
    orgId?: string;
  }): Promise<PromptTemplateRecord> {
    const row = await this.prisma.promptTemplate.create({
      data: { ...data, orgId: data.orgId ?? null },
    });
    return toRecord(row);
  }

  async findAll(orgId?: string): Promise<PromptTemplateRecord[]> {
    const rows = await this.prisma.promptTemplate.findMany({
      where: orgId ? { orgId } : undefined,
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(toRecord);
  }

  async findById(id: string, orgId?: string): Promise<PromptTemplateRecord | undefined> {
    const row = await this.prisma.promptTemplate.findFirst({
      where: { id, ...(orgId ? { orgId } : {}) },
    });
    return row ? toRecord(row) : undefined;
  }

  async findByName(name: string, orgId?: string): Promise<PromptTemplateRecord | undefined> {
    const row = await this.prisma.promptTemplate.findFirst({
      where: { name, ...(orgId ? { orgId } : {}) },
    });
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
    orgId?: string,
  ): Promise<PromptTemplateRecord | undefined> {
    const existing = await this.prisma.promptTemplate.findFirst({
      where: { id, ...(orgId ? { orgId } : {}) },
      select: { id: true },
    });
    if (!existing) return undefined;
    const row = await this.prisma.promptTemplate.update({
      where: { id: existing.id },
      data: { ...data, version: { increment: 1 } },
    });
    return toRecord(row);
  }

  async incrementUsage(id: string, orgId?: string): Promise<void> {
    const row = await this.prisma.promptTemplate.findFirst({
      where: { id, ...(orgId ? { orgId } : {}) },
      select: { id: true },
    });
    if (!row) return;
    await this.prisma.promptTemplate.update({
      where: { id: row.id },
      data: { usageCount: { increment: 1 } },
    });
  }

  async delete(id: string, orgId?: string): Promise<boolean> {
    try {
      const row = await this.prisma.promptTemplate.findFirst({
        where: { id, ...(orgId ? { orgId } : {}) },
        select: { id: true },
      });
      if (!row) return false;
      await this.prisma.promptTemplate.delete({ where: { id: row.id } });
      return true;
    } catch {
      return false;
    }
  }
}
