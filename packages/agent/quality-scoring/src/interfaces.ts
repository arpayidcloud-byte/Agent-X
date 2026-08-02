/**
 * @module quality-scoring/interfaces
 * @description Quality scoring of LLM agent outputs (roadmap: "Quality scoring").
 */

export type QualityDimensionName =
  'relevance' | 'completeness' | 'clarity' | 'correctness' | 'formatting' | 'safety';

export interface QualityDimension {
  name: QualityDimensionName;
  /** 0-100 per-dimension score. */
  score: number;
  /** Weight used in the overall computation (0-1). */
  weight: number;
  /** Human-readable notes explaining the score. */
  notes: string[];
}

export type QualityGrade = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface QualityScore {
  id: string;
  prompt: string;
  response: string;
  provider?: string;
  model?: string;
  taskId?: string;
  dimensions: QualityDimension[];
  /** Weighted overall score, 0-100. */
  overall: number;
  grade: QualityGrade;
  evaluator: 'heuristic' | 'llm';
  createdAt: string;
}

export interface ScoredInput {
  prompt: string;
  response: string;
  provider?: string;
  model?: string;
  taskId?: string;
}

/**
 * Optional provider-agnostic LLM judge. When supplied, its per-dimension
 * scores override the deterministic heuristics (the platform stays
 * provider-agnostic: any model/router can back the judge).
 */
export type LlmJudge = (
  input: ScoredInput,
) => Promise<Partial<Record<QualityDimensionName, number>>>;

export interface QualityScoringOptions {
  judge?: LlmJudge;
  /** Override dimension weights (defaults applied for missing entries). */
  weights?: Partial<Record<QualityDimensionName, number>>;
}
