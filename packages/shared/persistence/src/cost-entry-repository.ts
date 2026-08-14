/**
 * CostEntry repository — persistent cost tracking.
 *
 * Every read and write is explicitly organization-scoped. Cost data is a
 * tenant security boundary, not merely an analytics convenience.
 */
import type { PrismaClient } from '@prisma/client';
import { getPrisma } from './client.js';

export interface CostEntryRecord {
  id: string;
  taskId: string | null;
  userId: string | null;
  orgId: string | null;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  cached: boolean;
  source: string;
  createdAt: Date;
}

export interface CreateCostEntryInput {
  taskId?: string;
  userId?: string;
  provider: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  costUsd: number;
  latencyMs?: number;
  cached?: boolean;
  source?: string;
}

export interface CostSummary {
  totalCostUsd: number;
  totalRequests: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  avgLatencyMs: number;
  byProvider: Array<{
    provider: string;
    requests: number;
    costUsd: number;
    tokens: number;
  }>;
  byModel: Array<{
    model: string;
    requests: number;
    costUsd: number;
  }>;
  byDay: Array<{
    date: string;
    costUsd: number;
    requests: number;
  }>;
}

export class CostEntryRepository {
  private readonly prisma: PrismaClient | null;

  constructor(prisma: PrismaClient | null = getPrisma()) {
    this.prisma = prisma;
  }

  private requireDb(): PrismaClient {
    if (!this.prisma) throw new Error('DATABASE_URL not configured');
    return this.prisma;
  }

  async create(orgId: string, input: CreateCostEntryInput): Promise<CostEntryRecord> {
    if (!orgId || !orgId.trim()) throw new Error('Organization context required');

    const db = this.requireDb();
    if (input.taskId !== undefined && input.taskId !== null) {
      const task = await db.task.findUnique({
        where: { id: input.taskId },
        select: { orgId: true },
      });
      if (!task || !task.orgId?.trim()) {
        throw new Error('Task ownership could not be verified');
      }
      if (task.orgId !== orgId) {
        throw new Error('Task organization mismatch');
      }
    }

    if (input.userId !== undefined && input.userId !== null) {
      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: { orgId: true },
      });
      if (!user || !user.orgId?.trim()) {
        throw new Error('User ownership could not be verified');
      }
      if (user.orgId !== orgId) {
        throw new Error('User organization mismatch');
      }
    }

    return db.costEntry.create({
      data: {
        orgId,
        taskId: input.taskId ?? null,
        userId: input.userId ?? null,
        provider: input.provider,
        model: input.model,
        inputTokens: input.inputTokens ?? 0,
        outputTokens: input.outputTokens ?? 0,
        totalTokens: input.totalTokens ?? 0,
        costUsd: input.costUsd,
        latencyMs: input.latencyMs ?? 0,
        cached: input.cached ?? false,
        source: input.source ?? 'api',
      },
    }) as Promise<CostEntryRecord>;
  }

  async list(orgId: string, limit = 100, offset = 0): Promise<CostEntryRecord[]> {
    if (!orgId || !orgId.trim()) throw new Error('Organization context required');
    return this.requireDb().costEntry.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }) as Promise<CostEntryRecord[]>;
  }

  async getSummary(orgId: string, days = 30): Promise<CostSummary> {
    if (!orgId || !orgId.trim()) throw new Error('Organization context required');
    const since = new Date();
    since.setDate(since.getDate() - days);

    const entries = (await this.requireDb().costEntry.findMany({
      where: { orgId, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    })) as CostEntryRecord[];

    const totalCostUsd = entries.reduce((sum, e) => sum + e.costUsd, 0);
    const totalRequests = entries.length;
    const totalTokens = entries.reduce((sum, e) => sum + e.totalTokens, 0);
    const inputTokens = entries.reduce((sum, e) => sum + e.inputTokens, 0);
    const outputTokens = entries.reduce((sum, e) => sum + e.outputTokens, 0);
    const avgLatencyMs =
      totalRequests > 0 ? entries.reduce((sum, e) => sum + e.latencyMs, 0) / totalRequests : 0;

    const providerMap = new Map<string, { requests: number; costUsd: number; tokens: number }>();
    for (const e of entries) {
      const existing = providerMap.get(e.provider) ?? { requests: 0, costUsd: 0, tokens: 0 };
      existing.requests++;
      existing.costUsd += e.costUsd;
      existing.tokens += e.totalTokens;
      providerMap.set(e.provider, existing);
    }
    const byProvider = Array.from(providerMap.entries()).map(([provider, data]) => ({
      provider,
      ...data,
    }));

    const modelMap = new Map<string, { requests: number; costUsd: number }>();
    for (const e of entries) {
      const key = `${e.provider}/${e.model}`;
      const existing = modelMap.get(key) ?? { requests: 0, costUsd: 0 };
      existing.requests++;
      existing.costUsd += e.costUsd;
      modelMap.set(key, existing);
    }
    const byModel = Array.from(modelMap.entries()).map(([model, data]) => ({
      model,
      ...data,
    }));

    const dayMap = new Map<string, { costUsd: number; requests: number }>();
    for (const e of entries) {
      const day = e.createdAt.toISOString().slice(0, 10);
      const existing = dayMap.get(day) ?? { costUsd: 0, requests: 0 };
      existing.costUsd += e.costUsd;
      existing.requests++;
      dayMap.set(day, existing);
    }
    const byDay = Array.from(dayMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalCostUsd,
      totalRequests,
      totalTokens,
      inputTokens,
      outputTokens,
      avgLatencyMs,
      byProvider,
      byModel,
      byDay,
    };
  }
}
