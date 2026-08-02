/**
 * @module llm-router/cost-model.test
 * @description Cost-aware routing (roadmap OKR "Achieve 70% cost reduction" —
 * baseline mean $0.003162/req from PR #14, target ≤$0.000949/req):
 *   1. Unit tests for the cost-model helpers (estimate, rank, floor).
 *   2. Router selection assertions with production-shaped model sets.
 *   3. Regression guard: 21 representative requests must average
 *      ≤ $0.000949/req — fails if routing regresses to expensive models.
 */

import { describe, it, expect } from 'vitest';
import {
  LLMRouter,
  MockProvider,
  estimateCostUsd,
  rankAdequateModels,
  pickCheapestAdequate,
  requiredCapabilities,
  resolveComplexityFloor,
  COMPLEXITY_RANK,
} from '../index.js';
import type { ModelMetadata, RouteRequest } from '../types.js';

// Production-shaped model sets (pricing mirrors openai-compatible.ts).
const DEEPSEEK: Record<string, ModelMetadata> = {
  'deepseek-v3': {
    name: 'DeepSeek-V3',
    provider: 'deepseek',
    pricing: { inputCostPerMillion: 0.1, outputCostPerMillion: 0.1 },
    capabilities: ['code', 'reasoning', 'fast'],
    complexityRating: 'medium',
  },
};

const OPENAI: Record<string, ModelMetadata> = {
  'gpt-4o': {
    name: 'GPT-4 Omni',
    provider: 'openai',
    pricing: { inputCostPerMillion: 5.0, outputCostPerMillion: 15.0 },
    capabilities: ['code', 'reasoning', 'vision'],
    complexityRating: 'complex',
  },
  'gpt-4o-mini': {
    name: 'GPT-4 Omni Mini',
    provider: 'openai',
    pricing: { inputCostPerMillion: 0.15, outputCostPerMillion: 0.6 },
    capabilities: ['reasoning', 'fast'],
    complexityRating: 'simple',
  },
};

const ANTHROPIC: Record<string, ModelMetadata> = {
  'claude-3-7-sonnet-20250219': {
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    pricing: { inputCostPerMillion: 3.0, outputCostPerMillion: 15.0 },
    capabilities: ['code', 'reasoning', 'vision'],
    complexityRating: 'complex',
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    pricing: { inputCostPerMillion: 0.25, outputCostPerMillion: 1.25 },
    capabilities: ['code', 'reasoning', 'fast'],
    complexityRating: 'simple',
  },
};

const QWEN: Record<string, ModelMetadata> = {
  'qwen-max': {
    name: 'Qwen Max',
    provider: 'qwen',
    pricing: { inputCostPerMillion: 0.5, outputCostPerMillion: 1.0 },
    capabilities: ['code', 'reasoning'],
    complexityRating: 'complex',
  },
  'qwen-plus': {
    name: 'Qwen Plus',
    provider: 'qwen',
    pricing: { inputCostPerMillion: 0.2, outputCostPerMillion: 0.8 },
    capabilities: ['reasoning', 'fast'],
    complexityRating: 'medium',
  },
};

function prodRouter(): LLMRouter {
  const router = new LLMRouter();
  router.registerProvider(new MockProvider('deepseek', DEEPSEEK));
  router.registerProvider(new MockProvider('openai', OPENAI));
  router.registerProvider(new MockProvider('anthropic', ANTHROPIC));
  router.registerProvider(new MockProvider('qwen', QWEN));
  return router;
}

const PROMPT =
  'Write a production-grade TypeScript function to parse and validate CSV input. '.repeat(40);

// ─── 1. cost-model helpers ────
describe('cost-model: estimateCostUsd', () => {
  it('computes input+output cost from per-million pricing', () => {
    const pricing = { inputCostPerMillion: 5.0, outputCostPerMillion: 15.0 };
    // 2000 in * 5/1M + 500 out * 15/1M
    expect(estimateCostUsd(pricing, 2000, 500)).toBeCloseTo(0.0175, 10);
  });

  it('uses default token mix when omitted', () => {
    expect(estimateCostUsd({ inputCostPerMillion: 0.1, outputCostPerMillion: 0.1 })).toBeCloseTo(
      0.00025,
      10,
    );
  });
});

describe('cost-model: requiredCapabilities', () => {
  it('maps types to capability requirements', () => {
    expect(requiredCapabilities('code')).toEqual(['code']);
    expect(requiredCapabilities('reasoning')).toEqual(['reasoning']);
    expect(requiredCapabilities('analysis')).toEqual(['reasoning']);
    expect(requiredCapabilities('creative')).toEqual([]);
    expect(requiredCapabilities(undefined)).toEqual([]);
  });
});

describe('cost-model: resolveComplexityFloor', () => {
  it('maps complexity to rank', () => {
    const req = (c?: RouteRequest['complexity'], b?: RouteRequest['budget']): RouteRequest => ({
      taskId: 't',
      description: 'x',
      complexity: c,
      budget: b,
    });
    expect(resolveComplexityFloor(req('simple'))).toBe(COMPLEXITY_RANK.simple);
    expect(resolveComplexityFloor(req(undefined))).toBe(COMPLEXITY_RANK.medium);
    expect(resolveComplexityFloor(req('complex'))).toBe(COMPLEXITY_RANK.complex);
  });

  it('maps expert to the strongest existing tier (complex), not a phantom tier', () => {
    const req: RouteRequest = { taskId: 't', description: 'x', complexity: 'expert' };
    expect(resolveComplexityFloor(req)).toBe(COMPLEXITY_RANK.complex);
  });

  it('high/unlimited budget demands the strongest tier', () => {
    const req: RouteRequest = { taskId: 't', description: 'x', budget: 'high' };
    expect(resolveComplexityFloor(req)).toBe(COMPLEXITY_RANK.complex);
  });
});

describe('cost-model: rankAdequateModels', () => {
  const models = new Map<string, ModelMetadata>();
  models.set('deepseek:deepseek-v3', DEEPSEEK['deepseek-v3']!);
  models.set('openai:gpt-4o', OPENAI['gpt-4o']!);
  models.set('openai:gpt-4o-mini', OPENAI['gpt-4o-mini']!);
  models.set('qwen:qwen-max', QWEN['qwen-max']!);
  models.set('qwen:qwen-plus', QWEN['qwen-plus']!);
  models.set('anthropic:claude-3-haiku-20240307', ANTHROPIC['claude-3-haiku-20240307']!);

  it('ranks cheapest-first', () => {
    const ranked = rankAdequateModels(models);
    expect(ranked[0]!.provider).toBe('deepseek'); // 0.1/0.1 cheapest
    expect(ranked[ranked.length - 1]!.model).toBe('gpt-4o'); // 5/15 priciest
  });

  it('filters by complexity floor', () => {
    const ranked = rankAdequateModels(models, { complexityFloor: 3 });
    expect(ranked.map((c) => c.model)).toEqual(['qwen-max', 'gpt-4o']);
  });

  it('filters by capability', () => {
    const ranked = rankAdequateModels(models, { capabilities: ['code'] });
    // gpt-4o-mini & qwen-plus have no 'code' capability → excluded
    expect(ranked.some((c) => c.model === 'gpt-4o-mini')).toBe(false);
    expect(ranked.some((c) => c.model === 'qwen-plus')).toBe(false);
    expect(ranked[0]!.model).toBe('deepseek-v3');
  });

  it('picks cheapest adequate across providers', () => {
    const picked = pickCheapestAdequate(models, { complexityFloor: 3, capabilities: ['code'] });
    expect(picked).not.toBeNull();
    expect(picked!.provider).toBe('qwen');
    expect(picked!.model).toBe('qwen-max');
  });
});

// ─── 2. Router selection (production-shaped providers) ────
describe('LLMRouter cost-aware selection', () => {
  const req = (over: Partial<RouteRequest>): RouteRequest => ({
    taskId: 'sel',
    description: 'x',
    ...over,
  });

  it('routes simple reasoning to the cheapest model (deepseek-v3)', () => {
    expect(prodRouter().selectBestModel(req({ complexity: 'simple', type: 'reasoning' }))).toBe(
      'deepseek:deepseek-v3',
    );
  });

  it('routes medium reasoning (default) to deepseek-v3', () => {
    expect(prodRouter().selectBestModel(req({}))).toBe('deepseek:deepseek-v3');
  });

  it('routes complex reasoning to the cheapest complex model (qwen-max)', () => {
    expect(prodRouter().selectBestModel(req({ complexity: 'complex', type: 'reasoning' }))).toBe(
      'qwen:qwen-max',
    );
  });

  it('routes expert to qwen-max (no phantom o1-preview routing)', () => {
    expect(prodRouter().selectBestModel(req({ complexity: 'expert', type: 'reasoning' }))).toBe(
      'qwen:qwen-max',
    );
  });

  it('routes code simple/medium to deepseek-v3', () => {
    const router = prodRouter();
    expect(router.selectBestModel(req({ type: 'code', complexity: 'simple' }))).toBe(
      'deepseek:deepseek-v3',
    );
    expect(router.selectBestModel(req({ type: 'code', complexity: 'medium' }))).toBe(
      'deepseek:deepseek-v3',
    );
  });

  it('routes code complex to qwen-max (cheapest complex with code)', () => {
    expect(prodRouter().selectBestModel(req({ type: 'code', complexity: 'complex' }))).toBe(
      'qwen:qwen-max',
    );
  });

  it('routes budget low to the cheapest overall (deepseek-v3)', () => {
    expect(prodRouter().selectBestModel(req({ budget: 'low' }))).toBe('deepseek:deepseek-v3');
  });

  it('routes budget high to the strongest tier, cheapest within it (qwen-max)', () => {
    expect(prodRouter().selectBestModel(req({ budget: 'high', complexity: 'medium' }))).toBe(
      'qwen:qwen-max',
    );
  });

  it('never selects gpt-4o / sonnet / o1-preview for any common request shape', () => {
    const router = prodRouter();
    const shapes: RouteRequest[] = [
      req({}),
      req({ complexity: 'simple' }),
      req({ complexity: 'complex' }),
      req({ complexity: 'expert' }),
      req({ type: 'code' }),
      req({ type: 'code', complexity: 'complex' }),
      req({ type: 'analysis' }),
      req({ budget: 'low' }),
      req({ budget: 'high' }),
      req({ type: 'creative' }),
    ];
    for (const shape of shapes) {
      const picked = router.selectBestModel(shape);
      expect([
        'openai:gpt-4o',
        'anthropic:claude-3-7-sonnet-20250219',
        'openai:o1-preview',
      ]).not.toContain(picked);
    }
  });

  it('confidential without a local provider falls back to the cheapest registered model', () => {
    expect(prodRouter().selectBestModel(req({ security: 'confidential' }))).toBe(
      'deepseek:deepseek-v3',
    );
  });

  it('confidential with a local provider stays on-device', () => {
    const router = prodRouter();
    router.registerProvider(
      new MockProvider('local', {
        'llama-3-8b': {
          name: 'Llama 3 8B (local)',
          provider: 'local',
          pricing: { inputCostPerMillion: 0, outputCostPerMillion: 0 },
          capabilities: ['code', 'reasoning'],
          complexityRating: 'medium',
        },
      }),
    );
    expect(router.selectBestModel(req({ security: 'confidential' }))).toBe('local:llama-3-8b');
  });
});

// ─── 3. Cost-target regression guard ────
describe('Cost OKR regression guard (baseline $0.003162 → target ≤$0.000949/req)', () => {
  it('averages under the target across 21 representative requests', async () => {
    const router = prodRouter();

    // 21 scenarios mirroring the PR #14 baseline benchmark distribution.
    const scenarios: RouteRequest[] = [
      // 7 × simple reasoning
      ...[1, 2, 3, 4, 5, 6, 7].map((i) => ({
        taskId: `okr-simple-${i}`,
        description: 'x',
        complexity: 'simple' as const,
        type: 'reasoning' as const,
      })),
      // 5 × medium reasoning (default)
      ...[1, 2, 3, 4, 5].map((i) => ({
        taskId: `okr-medium-${i}`,
        description: 'x',
      })),
      // 3 × complex reasoning
      ...[1, 2, 3].map((i) => ({
        taskId: `okr-complex-${i}`,
        description: 'x',
        complexity: 'complex' as const,
        type: 'reasoning' as const,
      })),
      // 2 × expert
      ...[1, 2].map((i) => ({
        taskId: `okr-expert-${i}`,
        description: 'x',
        complexity: 'expert' as const,
        type: 'reasoning' as const,
      })),
      // 2 × code simple
      ...[1, 2].map((i) => ({
        taskId: `okr-code-${i}`,
        description: 'x',
        type: 'code' as const,
        complexity: 'simple' as const,
      })),
      // 1 × code complex
      {
        taskId: 'okr-code-complex',
        description: 'x',
        type: 'code' as const,
        complexity: 'complex' as const,
      },
      // 1 × budget low
      { taskId: 'okr-low', description: 'x', budget: 'low' as const },
    ];
    expect(scenarios).toHaveLength(21);

    let totalCost = 0;
    for (const s of scenarios) {
      const res = await router.execute(s, PROMPT);
      expect(res.cost).toBeGreaterThanOrEqual(0);
      totalCost += res.cost;
    }

    const mean = totalCost / scenarios.length;
    // eslint-disable-next-line no-console
    console.log(`[cost OKR] mean cost/req = $${mean.toFixed(6)} (target ≤ $0.000949)`);
    expect(mean).toBeLessThanOrEqual(0.000949);
  });

  it('cache hits cost $0 (identical request within TTL)', async () => {
    const router = prodRouter();
    const s: RouteRequest = { taskId: 'okr-cache', description: 'x', complexity: 'simple' };
    const cold = await router.execute(s, PROMPT);
    expect(cold.cost).toBeGreaterThan(0);
    const warm = await router.execute(s, PROMPT);
    expect(warm.cached).toBe(true);
    expect(warm.cost).toBe(0);
  });
});
