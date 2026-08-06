/**
 * AgentTemplate repository — agent marketplace CRUD.
 *
 * Stores publishable agent templates that can be browsed, installed,
 * rated, and used by other users.
 */
import type { PrismaClient } from '@prisma/client';
import { getPrisma } from './client.js';

export interface AgentTemplateRecord {
  id: string;
  name: string;
  description: string | null;
  authorId: string;
  authorName: string;
  systemPrompt: string | null;
  tags: string[];
  category: string | null;
  priceUsd: number;
  installCount: number;
  rating: number;
  ratingCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  config: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAgentTemplateInput {
  name: string;
  description?: string;
  authorId: string;
  authorName: string;
  systemPrompt?: string;
  tags?: string[];
  category?: string;
  priceUsd?: number;
  isPublished?: boolean;
  config?: unknown;
}

export interface UpdateAgentTemplateInput {
  name?: string;
  description?: string;
  systemPrompt?: string;
  tags?: string[];
  category?: string;
  priceUsd?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  config?: unknown;
}

export interface MarketplaceQuery {
  category?: string;
  search?: string;
  sortBy?: 'popular' | 'rating' | 'newest' | 'price';
  limit?: number;
  offset?: number;
}

export class AgentTemplateRepository {
  private prisma: PrismaClient | null;

  constructor() {
    this.prisma = getPrisma();
  }

  private requireDb(): PrismaClient {
    if (!this.prisma) throw new Error('DATABASE_URL not configured');
    return this.prisma;
  }

  async create(input: CreateAgentTemplateInput): Promise<AgentTemplateRecord> {
    return this.requireDb().agentTemplate.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        authorId: input.authorId,
        authorName: input.authorName,
        systemPrompt: input.systemPrompt ?? null,
        tags: input.tags ?? [],
        category: input.category ?? null,
        priceUsd: input.priceUsd ?? 0,
        isPublished: input.isPublished ?? false,
        config: input.config ?? undefined,
      },
    }) as Promise<AgentTemplateRecord>;
  }

  async getById(id: string): Promise<AgentTemplateRecord | null> {
    return this.requireDb().agentTemplate.findUnique({
      where: { id },
    }) as Promise<AgentTemplateRecord | null>;
  }

  async update(id: string, input: UpdateAgentTemplateInput): Promise<AgentTemplateRecord> {
    return this.requireDb().agentTemplate.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.systemPrompt !== undefined && { systemPrompt: input.systemPrompt }),
        ...(input.tags !== undefined && { tags: input.tags }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.priceUsd !== undefined && { priceUsd: input.priceUsd }),
        ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
        ...(input.config !== undefined && { config: input.config as Record<string, unknown> }),
      },
    }) as Promise<AgentTemplateRecord>;
  }

  async delete(id: string): Promise<void> {
    await this.requireDb().agentTemplate.delete({ where: { id } });
  }

  async listPublished(query: MarketplaceQuery = {}): Promise<AgentTemplateRecord[]> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;

    const where: Record<string, unknown> = { isPublished: true };
    if (query.category) where.category = query.category;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { tags: { has: query.search } },
      ];
    }

    const orderBy: Record<string, string> = (() => {
      switch (query.sortBy) {
        case 'popular':
          return { installCount: 'desc' as const };
        case 'rating':
          return { rating: 'desc' as const };
        case 'price':
          return { priceUsd: 'asc' as const };
        case 'newest':
        default:
          return { createdAt: 'desc' as const };
      }
    })();

    return this.requireDb().agentTemplate.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    }) as Promise<AgentTemplateRecord[]>;
  }

  async listByAuthor(authorId: string): Promise<AgentTemplateRecord[]> {
    return this.requireDb().agentTemplate.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<AgentTemplateRecord[]>;
  }

  async incrementInstall(id: string): Promise<void> {
    await this.requireDb().agentTemplate.update({
      where: { id },
      data: { installCount: { increment: 1 } },
    });
  }

  async rate(id: string, rating: number): Promise<void> {
    const template = await this.requireDb().agentTemplate.findUnique({ where: { id } });
    if (!template) throw new Error('Template not found');

    const newCount = template.ratingCount + 1;
    const newRating = (template.rating * template.ratingCount + rating) / newCount;

    await this.requireDb().agentTemplate.update({
      where: { id },
      data: { rating: newRating, ratingCount: newCount },
    });
  }

  async getFeatured(): Promise<AgentTemplateRecord[]> {
    return this.requireDb().agentTemplate.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { installCount: 'desc' },
      take: 10,
    }) as Promise<AgentTemplateRecord[]>;
  }

  async getCategories(): Promise<Array<{ category: string; count: number }>> {
    const results = await this.requireDb().agentTemplate.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: { id: true },
    });
    return results
      .filter((r) => r.category !== null)
      .map((r) => ({ category: r.category!, count: r._count.id }));
  }
}
