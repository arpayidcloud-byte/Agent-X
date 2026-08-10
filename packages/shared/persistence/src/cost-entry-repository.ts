/**
 * CostEntry repository — persistent cost tracking.
 *
 * Records every LLM request with token usage and cost for historical
 * analytics, per-provider breakdowns, and per-user cost allocation.
 */
import type { PrismaClient } from '@prisma/client';
import { getPrisma } from './client.js';

export interface CostEntryRecord {
  id: string;
  taskId: string | null;
  userId: string | null;
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
  private prisma: PrismaClient | null;

  constructor() {
    this.prisma = getPrisma();
  }

  private requireDb(): PrismaClient {
    if (!this.prisma) throw new Error('DATABASE_URL not configured');
    return this.prisma;
  }

  async create(input: CreateCostEntryInput): Promise<CostEntryRecord> {
    return this.requireDb().costEntry.create({
      data: {
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

  async list(limit = 100, offset = 0): Promise<CostEntryRecord[]> {
    return this.requireDb().costEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }) as Promise<CostEntryRecord[]>;
  }

  async getSummary(days = 30): Promise<CostSummary> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const entries = (await this.requireDb().costEntry.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    })) as CostEntryRecord[];

    const totalCostUsd = entries.reduce((sum, e) => sum + e.costUsd, 0);
    const totalRequests = entries.length;
    const totalTokens = entries.reduce((sum, e) => sum + e.totalTokens, 0);
    const inputTokens = entries.reduce((sum, e) => sum + e.inputTokens, 0);
    const outputTokens = entries.reduce((sum, e) => sum + e.outputTokens, 0);
    const avgLatencyMs =
      totalRequests > 0 ? entries.reduce((sum, e) => sum + e.latencyMs, 0) / totalRequests : 0;

    // By provider
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

    // By model
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

    // By day
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
