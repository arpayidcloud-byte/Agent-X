import type { PrismaClient } from '@prisma/client';
import type { AgentFeedback } from '@agent-xai/agent-feedback';

export interface AgentFeedbackRecord {
  id: string;
  scoreId: string;
  taskId?: string | null;
  prompt: string;
  response: string;
  overall: number;
  grade: string;
  weakDimensions: AgentFeedback['weakDimensions'];
  priorityAdvice: AgentFeedback['priorityAdvice'];
  improvementPrompt: string;
  createdAt: string;
}

export interface AgentFeedbackRepository {
  create(record: AgentFeedbackRecord): Promise<AgentFeedbackRecord>;
  findMany(limit?: number): Promise<AgentFeedbackRecord[]>;
  findByScoreId(scoreId: string): Promise<AgentFeedbackRecord | null>;
  stats(): Promise<{ total: number; byGrade: Record<string, number> }>;
}

export class PrismaAgentFeedbackRepository implements AgentFeedbackRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(record: AgentFeedbackRecord): Promise<AgentFeedbackRecord> {
    const row = await this.prisma.agentFeedback.create({
      data: {
        id: record.id,
        scoreId: record.scoreId,
        taskId: record.taskId ?? null,
        prompt: record.prompt,
        response: record.response,
        overall: record.overall,
        grade: record.grade,
        weakDimensions: record.weakDimensions as unknown as object,
        priorityAdvice: record.priorityAdvice as unknown as object,
        improvementPrompt: record.improvementPrompt,
      },
    });
    return this.toRecord(row);
  }

  async findMany(limit = 20): Promise<AgentFeedbackRecord[]> {
    const rows = await this.prisma.agentFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map((r) => this.toRecord(r));
  }

  async findByScoreId(scoreId: string): Promise<AgentFeedbackRecord | null> {
    const row = await this.prisma.agentFeedback.findUnique({ where: { scoreId } });
    return row ? this.toRecord(row) : null;
  }

  async stats(): Promise<{ total: number; byGrade: Record<string, number> }> {
    const [total, grouped] = await Promise.all([
      this.prisma.agentFeedback.count(),
      this.prisma.agentFeedback.groupBy({ by: ['grade'], _count: { grade: true } }),
    ]);
    const byGrade: Record<string, number> = {};
    for (const g of grouped) byGrade[g.grade] = g._count.grade;
    return { total, byGrade };
  }

  private toRecord(row: {
    id: string;
    scoreId: string;
    taskId: string | null;
    prompt: string;
    response: string;
    overall: number;
    grade: string;
    weakDimensions: unknown;
    priorityAdvice: unknown;
    improvementPrompt: string;
    createdAt: Date;
  }): AgentFeedbackRecord {
    return {
      id: row.id,
      scoreId: row.scoreId,
      taskId: row.taskId ?? undefined,
      prompt: row.prompt,
      response: row.response,
      overall: row.overall,
      grade: row.grade,
      weakDimensions: row.weakDimensions as AgentFeedback['weakDimensions'],
      priorityAdvice: row.priorityAdvice as AgentFeedback['priorityAdvice'],
      improvementPrompt: row.improvementPrompt,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
