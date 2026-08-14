import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import {
  PrismaAgentFeedbackRepository,
  type AgentFeedbackRecord,
} from './prisma-agent-feedback-repository.js';

const record: AgentFeedbackRecord = {
  id: 'feedback-1',
  scoreId: 'score-1',
  orgId: 'org-a',
  taskId: 'task-1',
  prompt: 'p',
  response: 'r',
  overall: 40,
  grade: 'D',
  weakDimensions: [],
  priorityAdvice: [],
  improvementPrompt: 'improve',
  createdAt: new Date().toISOString(),
};

function db() {
  const agentFeedback = {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
  };
  return { prisma: { agentFeedback } as unknown as PrismaClient, agentFeedback };
}

describe('PrismaAgentFeedbackRepository tenant boundary', () => {
  it('rejects feedback without organization before database access', async () => {
    const { prisma, agentFeedback } = db();
    await expect(
      new PrismaAgentFeedbackRepository(prisma).create({ ...record, orgId: '' }),
    ).rejects.toThrow('Organization context required');
    expect(agentFeedback.create).not.toHaveBeenCalled();
  });

  it('scopes score lookup by organization', async () => {
    const { prisma, agentFeedback } = db();
    agentFeedback.findFirst.mockResolvedValue(null);
    await new PrismaAgentFeedbackRepository(prisma).findByScoreId('org-a', 'score-1');
    expect(agentFeedback.findFirst).toHaveBeenCalledWith({
      where: { scoreId: 'score-1', orgId: 'org-a' },
    });
  });
});
