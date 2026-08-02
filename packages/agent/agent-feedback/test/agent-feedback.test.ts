/**
 * @module agent-feedback/agent-feedback.test
 * @description Unit verification for the deterministic feedback generator and
 * revision-prompt builder.
 */

import { describe, it, expect } from 'vitest';
import type { QualityScore } from '@agent-xai/quality-scoring';
import { generateFeedback, buildRevisionPrompt } from '../src/index.js';

function makeScore(overrides: Partial<QualityScore> = {}): QualityScore {
  return {
    id: 'qs_test_1',
    taskId: 'task-1',
    prompt: 'Explain how an API gateway rate limiter works and list the main algorithms',
    response:
      'An API gateway rate limiter controls requests. The main algorithms are token bucket, leaky bucket, fixed window, and sliding window log.',
    provider: 'openai',
    model: 'gpt-4o',
    overall: 54,
    grade: 'Poor',
    evaluator: 'heuristic',
    createdAt: '2026-08-02T00:00:00.000Z',
    dimensions: [
      { name: 'relevance', score: 63, weight: 0.25, notes: ['cakupan kata kunci sedang'] },
      { name: 'completeness', score: 40, weight: 0.25, notes: ['sedikit detail'] },
      { name: 'clarity', score: 80, weight: 0.15, notes: [] },
      { name: 'correctness', score: 75, weight: 0.2, notes: [] },
      { name: 'formatting', score: 30, weight: 0.05, notes: ['tanpa struktur'] },
      { name: 'safety', score: 90, weight: 0.1, notes: [] },
    ],
    ...overrides,
  };
}

describe('generateFeedback', () => {
  it('flags dimensions below the default threshold (70)', () => {
    const fb = generateFeedback(makeScore());
    const weakNames = fb.weakDimensions.map((d) => d.name);
    expect(weakNames).toEqual(['formatting', 'completeness', 'relevance']);
  });

  it('orders weak dimensions weakest-first', () => {
    const fb = generateFeedback(makeScore());
    expect(fb.weakDimensions[0].score).toBe(30);
    expect(fb.weakDimensions[fb.weakDimensions.length - 1].score).toBe(63);
  });

  it('produces up to maxAdvice priority items, weakest first', () => {
    const fb = generateFeedback(makeScore(), { maxAdvice: 2 });
    expect(fb.priorityAdvice.length).toBe(2);
    expect(fb.priorityAdvice[0]).toContain('[formatting]');
  });

  it('includes original notes from the scorer', () => {
    const fb = generateFeedback(makeScore());
    const relevance = fb.weakDimensions.find((d) => d.name === 'relevance');
    expect(relevance?.notes).toContain('cakupan kata kunci sedang');
  });

  it('builds an improvementPrompt embedding the original prompt and advice', () => {
    const fb = generateFeedback(makeScore());
    expect(fb.improvementPrompt).toContain('Explain how an API gateway rate limiter');
    expect(fb.improvementPrompt).toContain('# Previous attempt — improve on these points');
    expect(fb.improvementPrompt).toContain('[formatting]');
  });

  it('returns empty weak list and generic advice for a perfect score', () => {
    const perfect = makeScore({
      overall: 95,
      grade: 'Excellent',
      dimensions: [
        { name: 'relevance', score: 95, weight: 0.25, notes: [] },
        { name: 'completeness', score: 95, weight: 0.25, notes: [] },
        { name: 'clarity', score: 95, weight: 0.15, notes: [] },
        { name: 'correctness', score: 95, weight: 0.2, notes: [] },
        { name: 'formatting', score: 95, weight: 0.05, notes: [] },
        { name: 'safety', score: 95, weight: 0.1, notes: [] },
      ],
    });
    const fb = generateFeedback(perfect);
    expect(fb.weakDimensions).toHaveLength(0);
    expect(fb.priorityAdvice[0]).toContain('already strong');
  });

  it('respects a custom weak threshold', () => {
    const fb = generateFeedback(makeScore(), { weakThreshold: 80 });
    const weakNames = fb.weakDimensions.map((d) => d.name);
    expect(weakNames).not.toContain('safety'); // 90 >= 80
    expect(weakNames).not.toContain('clarity'); // 80 is NOT < 80
  });
});

describe('buildRevisionPrompt', () => {
  it('creates a revision prompt for a follow-up run', () => {
    const fb = generateFeedback(makeScore());
    const revision = buildRevisionPrompt('New task: build a rate limiter', fb);
    expect(revision).toContain('New task: build a rate limiter');
    expect(revision).toContain('improve on these points');
    expect(revision).toContain('[completeness]');
  });
});
