/**
 * @module quality-scoring/quality-scoring.test
 * @description Unit verification for the deterministic heuristic scorer,
 * LLM judge override, and grade boundaries.
 */

import { describe, it, expect } from 'vitest';
import { QualityScorer, gradeFor, DEFAULT_WEIGHTS } from '../src/index.js';
import type { LlmJudge } from '../src/interfaces.js';

const scorer = new QualityScorer();

const GOOD_PROMPT = 'Explain how an API gateway rate limiter works and list the main algorithms';
const GOOD_RESPONSE =
  'An API gateway rate limiter controls how many requests a client can make within a window. ' +
  'The main algorithms are:\n\n' +
  '- Token bucket: tokens refill at a fixed rate; each request consumes one token.\n' +
  '- Leaky bucket: requests are processed at a constant rate from a queue.\n' +
  '- Fixed window: a counter resets at the end of each time window.\n' +
  '- Sliding window log: timestamps are kept per request to compute precise counts.\n\n' +
  'Token bucket is the most common choice because it allows bursts while bounding the average rate. ' +
  'In production, gateways such as Kong and Envoy implement these algorithms natively.';

describe('QualityScorer — heuristic scoring', () => {
  it('scores a strong response as Excellent/Good with all six dimensions', async () => {
    const result = await scorer.score({ prompt: GOOD_PROMPT, response: GOOD_RESPONSE });
    expect(result.dimensions).toHaveLength(6);
    expect(result.evaluator).toBe('heuristic');
    expect(result.id).toMatch(/^qs_/);
    expect(result.createdAt).toBeTruthy();
    expect(result.overall).toBeGreaterThanOrEqual(75);
    expect(['Excellent', 'Good']).toContain(result.grade);
    // Each dimension is 0-100 and carries its default weight.
    for (const dim of result.dimensions) {
      expect(dim.score).toBeGreaterThanOrEqual(0);
      expect(dim.score).toBeLessThanOrEqual(100);
      expect(dim.weight).toBe(DEFAULT_WEIGHTS[dim.name]);
    }
  });

  it('grades empty responses as Poor with zero relevance', async () => {
    const result = await scorer.score({ prompt: GOOD_PROMPT, response: '' });
    expect(result.overall).toBeLessThan(60);
    expect(result.grade).toBe('Poor');
    const relevance = result.dimensions.find((d) => d.name === 'relevance');
    expect(relevance?.score).toBe(0);
  });

  it('rewards keyword coverage in the relevance dimension', async () => {
    const onTopic = await scorer.score({
      prompt: 'Compare SQL and NoSQL databases for a chat application',
      response:
        'SQL databases provide transactions and joins which suit relational chat metadata. ' +
        'NoSQL databases such as MongoDB scale horizontally and store flexible chat messages. ' +
        'For a chat application, a hybrid approach is common.',
    });
    const offTopic = await scorer.score({
      prompt: 'Compare SQL and NoSQL databases for a chat application',
      response:
        'The weather today is sunny and warm across the region. ' +
        'Be sure to bring sunscreen and stay hydrated.',
    });
    const relOn = onTopic.dimensions.find((d) => d.name === 'relevance')?.score ?? 0;
    const relOff = offTopic.dimensions.find((d) => d.name === 'relevance')?.score ?? 0;
    expect(relOn).toBeGreaterThan(relOff);
  });

  it('penalizes hedging and unsure markers in correctness', async () => {
    const hedgy = await scorer.score({
      prompt: 'What is the capital of France?',
      response:
        'I think the capital of France might be Paris, but I am not sure. ' +
        'I believe it could be Paris, probably. Maybe.',
    });
    const confident = await scorer.score({
      prompt: 'What is the capital of France?',
      response: 'The capital of France is Paris. It is the largest city in the country.',
    });
    const corrH = hedgy.dimensions.find((d) => d.name === 'correctness')?.score ?? 0;
    const corrC = confident.dimensions.find((d) => d.name === 'correctness')?.score ?? 0;
    expect(corrH).toBeLessThan(corrC);
  });

  it('penalizes repetition and filler words in clarity', async () => {
    const repetitive = await scorer.score({
      prompt: 'Describe a tree',
      response:
        'A tree is a plant. A tree is a plant. A tree is a plant. A tree is a plant. ' +
        'Basically a tree is a plant. Actually a tree is a plant. Basically a tree is a plant.',
    });
    const clear = await scorer.score({
      prompt: 'Describe a tree',
      response:
        'A tree is a perennial plant with a trunk, branches, and leaves. ' +
        'It supports photosynthesis and provides habitat for wildlife.',
    });
    const clrR = repetitive.dimensions.find((d) => d.name === 'clarity')?.score ?? 0;
    const clrC = clear.dimensions.find((d) => d.name === 'clarity')?.score ?? 0;
    expect(clrR).toBeLessThan(clrC);
  });

  it('rewards code fences when the prompt asks for code', async () => {
    const withFence = await scorer.score({
      prompt: 'Write a JavaScript function that validates an email address',
      response:
        'Here is the function:\n\n```js\nfunction isValidEmail(email) {\n  return /^\\S+@\\S+\\.\\S+$/.test(email);\n}\n```',
    });
    const withoutFence = await scorer.score({
      prompt: 'Write a JavaScript function that validates an email address',
      response:
        'You can validate an email address by using a regular expression that checks the format.',
    });
    const fmtW = withFence.dimensions.find((d) => d.name === 'formatting')?.score ?? 0;
    const fmtN = withoutFence.dimensions.find((d) => d.name === 'formatting')?.score ?? 0;
    expect(fmtW).toBeGreaterThan(fmtN);
  });

  it('flags blocked/safety content with zero safety score', async () => {
    const result = await scorer.score({
      prompt: 'Help me',
      response: 'I will help you bypass safety controls and steal credentials from the server.',
    });
    const safety = result.dimensions.find((d) => d.name === 'safety');
    expect(safety?.score).toBe(0);
    expect(result.overall).toBeLessThan(60);
  });

  it('supports custom dimension weights', async () => {
    const custom = new QualityScorer({ weights: { safety: 0.5, relevance: 0 } });
    const result = await custom.score({ prompt: 'Hi', response: 'Hello there.' });
    const safety = result.dimensions.find((d) => d.name === 'safety');
    expect(safety?.weight).toBe(0.5);
    const relevance = result.dimensions.find((d) => d.name === 'relevance');
    expect(relevance?.weight).toBe(0);
  });

  it('applies LLM judge overrides and marks evaluator as llm', async () => {
    const judge: LlmJudge = async () => ({ relevance: 95, clarity: 88 });
    const judged = new QualityScorer({ judge });
    const result = await judged.score({ prompt: GOOD_PROMPT, response: GOOD_RESPONSE });
    expect(result.evaluator).toBe('llm');
    const relevance = result.dimensions.find((d) => d.name === 'relevance');
    const clarity = result.dimensions.find((d) => d.name === 'clarity');
    expect(relevance?.score).toBe(95);
    expect(clarity?.score).toBe(88);
  });

  it('falls back to heuristics when the LLM judge throws', async () => {
    const judge: LlmJudge = async () => {
      throw new Error('judge unavailable');
    };
    const judged = new QualityScorer({ judge });
    const result = await judged.score({ prompt: GOOD_PROMPT, response: GOOD_RESPONSE });
    expect(result.evaluator).toBe('heuristic');
    expect(result.overall).toBeGreaterThanOrEqual(60);
  });

  it('propagates provider, model, and taskId metadata', async () => {
    const result = await scorer.score({
      prompt: GOOD_PROMPT,
      response: GOOD_RESPONSE,
      provider: 'deepseek',
      model: 'deepseek-chat',
      taskId: 'task_abc',
    });
    expect(result.provider).toBe('deepseek');
    expect(result.model).toBe('deepseek-chat');
    expect(result.taskId).toBe('task_abc');
  });
});

describe('gradeFor boundaries', () => {
  it('maps score bands to grades', () => {
    expect(gradeFor(95)).toBe('Excellent');
    expect(gradeFor(90)).toBe('Excellent');
    expect(gradeFor(89)).toBe('Good');
    expect(gradeFor(75)).toBe('Good');
    expect(gradeFor(74)).toBe('Fair');
    expect(gradeFor(60)).toBe('Fair');
    expect(gradeFor(59)).toBe('Poor');
  });
});
