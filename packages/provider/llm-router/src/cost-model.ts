/**
 * @module cost-model
 * @description Cost-aware model selection for the LLM router (roadmap OKR:
 * "Achieve 70% cost reduction" — baseline mean $0.003162/req, target
 * ≤$0.000949/req). Instead of hard-coded provider:model strings, candidates
 * are ranked by estimated USD cost per request and the CHEAPEST ADEQUATE model
 * is chosen: adequate = meets the complexity floor + required capabilities.
 */

import type { ModelMetadata, ModelPricing, RouteRequest } from './types.js';

/** Complexity floor ranking: a model may serve a request only if its rating >= floor. */
export const COMPLEXITY_RANK: Record<string, number> = {
  simple: 1,
  medium: 2,
  complex: 3,
  expert: 4,
};

/** Assumed typical token mix per request when the caller does not know tokens yet. */
export const DEFAULT_INPUT_TOKENS = 2000;
export const DEFAULT_OUTPUT_TOKENS = 500;

/** Deterministic USD estimate for a prompt+completion at a given token mix. */
export function estimateCostUsd(
  pricing: ModelPricing,
  inputTokens: number = DEFAULT_INPUT_TOKENS,
  outputTokens: number = DEFAULT_OUTPUT_TOKENS,
): number {
  return (
    (inputTokens / 1_000_000) * pricing.inputCostPerMillion +
    (outputTokens / 1_000_000) * pricing.outputCostPerMillion
  );
}

/**
 * Capabilities a request type requires. Creative work accepts any model;
 * code and reasoning/analysis are picky.
 */
export function requiredCapabilities(type?: string): string[] {
  switch (type) {
    case 'code':
      return ['code'];
    case 'reasoning':
    case 'analysis':
      return ['reasoning'];
    default:
      return [];
  }
}

export interface ModelCandidate {
  provider: string;
  model: string;
  meta: ModelMetadata;
  estimatedCost: number;
}

export interface AdequateOptions {
  /** Minimum complexity rank a model must have (default: 1 — any). */
  complexityFloor?: number;
  /** Capabilities every candidate must provide (default: none). */
  capabilities?: string[];
  inputTokens?: number;
  outputTokens?: number;
  /**
   * Exclude models whose price is unknown (sum == 0) from cost ranking —
   * their cost cannot be estimated, so treat them as a last resort only.
   * Default: true.
   */
  excludeZeroPrice?: boolean;
}

/** Filter + rank models map (key `provider:model`) by adequacy, cheapest first. */
export function rankAdequateModels(
  models: Map<string, ModelMetadata>,
  opts: AdequateOptions = {},
): ModelCandidate[] {
  const floor = opts.complexityFloor ?? 1;
  const caps = opts.capabilities ?? [];
  const excludeZero = opts.excludeZeroPrice ?? true;
  const inputTokens = opts.inputTokens ?? DEFAULT_INPUT_TOKENS;
  const outputTokens = opts.outputTokens ?? DEFAULT_OUTPUT_TOKENS;

  const candidates: ModelCandidate[] = [];
  for (const [key, meta] of models) {
    const rank = COMPLEXITY_RANK[meta.complexityRating] ?? 1;
    if (rank < floor) continue;
    if (caps.length > 0 && !caps.every((c) => meta.capabilities.includes(c as never))) continue;
    if (excludeZero && meta.pricing.inputCostPerMillion + meta.pricing.outputCostPerMillion === 0) {
      continue;
    }
    const sep = key.indexOf(':');
    const provider = sep === -1 ? key : key.slice(0, sep);
    const model = sep === -1 ? key : key.slice(sep + 1);
    candidates.push({
      provider,
      model,
      meta,
      estimatedCost: estimateCostUsd(meta.pricing, inputTokens, outputTokens),
    });
  }

  candidates.sort(
    (a, b) =>
      a.estimatedCost - b.estimatedCost ||
      a.meta.pricing.outputCostPerMillion - b.meta.pricing.outputCostPerMillion ||
      a.model.localeCompare(b.model),
  );
  return candidates;
}

/** Cheapest model that satisfies the adequacy constraints, or null. */
export function pickCheapestAdequate(
  models: Map<string, ModelMetadata>,
  opts: AdequateOptions = {},
): ModelCandidate | null {
  return rankAdequateModels(models, opts)[0] ?? null;
}

/** Cheapest registered model overall (complexity floor 1, any capability). */
export function pickCheapestOverall(models: Map<string, ModelMetadata>): ModelCandidate | null {
  return pickCheapestAdequate(models, { complexityFloor: 1 });
}

/**
 * Resolve the complexity floor for a request. `expert` has no dedicated tier
 * in the registry, so it maps to the strongest tier that exists (complex);
 * a high/unlimited budget also demands the strongest tier (quality), but
 * still the cheapest model within it.
 */
export function resolveComplexityFloor(req: RouteRequest): number {
  const complexity = req.complexity ?? 'medium';
  const base =
    complexity === 'expert' ? (COMPLEXITY_RANK.complex ?? 3) : (COMPLEXITY_RANK[complexity] ?? 2);
  if (req.budget === 'high' || req.budget === 'unlimited') {
    return Math.max(base, COMPLEXITY_RANK.complex ?? 3);
  }
  return base;
}
