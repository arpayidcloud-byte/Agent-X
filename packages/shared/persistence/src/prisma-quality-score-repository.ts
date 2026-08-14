import type { PrismaClient } from '@prisma/client';

export interface QualityScoreRecord {
  id: string;
  orgId?: string;
  taskId?: string;
  prompt: string;
  response: string;
  provider?: string;
  model?: string;
  dimensions: Record<string, unknown>;
  overall: number;
  grade: string;
  evaluator: string;
  createdAt: string;
}

export interface QualityScoreStats {
  total: number;
  avgOverall: number;
  byGrade: Record<string, number>;
  byProvider: Record<string, number>;
  byEvaluator: Record<string, number>;
}

function toRecord(row: {
  id: string;
  orgId: string | null;
  taskId: string | null;
  prompt: string;
  response: string;
  provider: string | null;
  model: string | null;
  dimensions: unknown;
  overall: number;
  grade: string;
  evaluator: string;
  createdAt: Date;
}): QualityScoreRecord {
  return {
    id: row.id,
    orgId: row.orgId ?? undefined,
    taskId: row.taskId ?? undefined,
    prompt: row.prompt,
    response: row.response,
    provider: row.provider ?? undefined,
    model: row.model ?? undefined,
    dimensions: (row.dimensions ?? {}) as Record<string, unknown>,
    overall: row.overall,
    grade: row.grade,
    evaluator: row.evaluator,
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaQualityScoreRepository {
  constructor(private prisma: PrismaClient) {}

  async create(record: QualityScoreRecord): Promise<QualityScoreRecord> {
    if (!record.orgId?.trim())
      throw new Error('Organization context required for quality score persistence');
    const row = await this.prisma.qualityScore.create({
      data: {
        id: record.id,
        orgId: record.orgId,
        taskId: record.taskId ?? null,
        prompt: record.prompt,
        response: record.response,
        provider: record.provider ?? null,
        model: record.model ?? null,
        dimensions: record.dimensions as unknown as object,
        overall: record.overall,
        grade: record.grade,
        evaluator: record.evaluator,
      },
    });
    return toRecord(row);
  }

  async findAll(orgId: string, limit: number): Promise<QualityScoreRecord[]> {
    if (!orgId.trim())
      throw new Error('Organization context required for quality score persistence');
    const rows = await this.prisma.qualityScore.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map(toRecord);
  }

  async stats(orgId: string): Promise<QualityScoreStats> {
    if (!orgId.trim())
      throw new Error('Organization context required for quality score persistence');
    const rows = await this.prisma.qualityScore.findMany({
      where: { orgId },
      select: { overall: true, grade: true, provider: true, evaluator: true },
    });
    const byGrade: Record<string, number> = {};
    const byProvider: Record<string, number> = {};
    const byEvaluator: Record<string, number> = {};
    let sum = 0;
    for (const r of rows) {
      sum += r.overall;
      byGrade[r.grade] = (byGrade[r.grade] ?? 0) + 1;
      byProvider[r.provider ?? 'unknown'] = (byProvider[r.provider ?? 'unknown'] ?? 0) + 1;
      byEvaluator[r.evaluator] = (byEvaluator[r.evaluator] ?? 0) + 1;
    }
    return {
      total: rows.length,
      avgOverall: rows.length > 0 ? Math.round(sum / rows.length) : 0,
      byGrade,
      byProvider,
      byEvaluator,
    };
  }
}
