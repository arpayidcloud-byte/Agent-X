import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import {
  PrismaQualityScoreRepository,
  type QualityScoreRecord,
} from './prisma-quality-score-repository.js';

const record: QualityScoreRecord = {
  id: 'score-1',
  orgId: 'org-a',
  prompt: 'p',
  response: 'r',
  dimensions: {},
  overall: 80,
  grade: 'B',
  evaluator: 'heuristic',
  createdAt: new Date().toISOString(),
};

function db() {
  const qualityScore = { create: vi.fn(), findMany: vi.fn() };
  return { prisma: { qualityScore } as unknown as PrismaClient, qualityScore };
}

describe('PrismaQualityScoreRepository tenant boundary', () => {
  it('rejects a score without organization before database access', async () => {
    const { prisma, qualityScore } = db();
    const repo = new PrismaQualityScoreRepository(prisma);
    await expect(repo.create({ ...record, orgId: '' })).rejects.toThrow(
      'Organization context required',
    );
    expect(qualityScore.create).not.toHaveBeenCalled();
  });

  it('scopes reads by organization', async () => {
    const { prisma, qualityScore } = db();
    qualityScore.findMany.mockResolvedValue([]);
    await new PrismaQualityScoreRepository(prisma).findAll('org-a', 10);
    expect(qualityScore.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { orgId: 'org-a' } }),
    );
  });
});
