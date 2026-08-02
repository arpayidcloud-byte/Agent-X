/**
 * @module agent-feedback/generator
 * @description Deterministic feedback generator: turns a quality score into
 * actionable, agent-ready revision guidance. No LLM involved — the platform's
 * heuristic scorer already produced per-dimension notes; this layer packages
 * them into advice + a ready-to-use improvement prompt.
 */

import type { QualityDimensionName } from '@agent-xai/quality-scoring';
import type {
  AgentFeedback,
  FeedbackOptions,
  FeedbackSource,
  WeakDimension,
} from './interfaces.js';

export const DEFAULT_WEAK_THRESHOLD = 70;
export const DEFAULT_MAX_ADVICE = 3;

/** Actionable template advice per dimension (English — agent-facing). */
export const DIMENSION_ADVICE: Record<QualityDimensionName, string[]> = {
  relevance: [
    'Re-read the original request and confirm every part of it is addressed.',
    'Anchor the answer to the user’s explicit intent; avoid drifting into tangents.',
  ],
  completeness: [
    'Cover all sub-parts of the request: add concrete details, examples, and edge cases.',
    'List what was requested vs what was delivered to spot gaps.',
  ],
  clarity: [
    'Simplify long sentences and define technical terms on first use.',
    'Structure the answer with a short intro, main body, and a closing summary.',
  ],
  correctness: [
    'Verify factual claims, code snippets, and terminology before finalizing.',
    'Flag uncertainty explicitly instead of stating guesses as facts.',
  ],
  formatting: [
    'Use consistent structure: headings, bullet lists, and code blocks where appropriate.',
    'Keep paragraphs short and scannable.',
  ],
  safety: [
    'Remove harmful, misleading, or unsafe content.',
    'Add guardrails and limitations where the topic could be misused.',
  ],
};

function buildWeakDimensions(score: FeedbackSource, threshold: number): WeakDimension[] {
  return score.dimensions
    .filter((d) => d.score < threshold)
    .map((d) => ({
      name: d.name,
      score: d.score,
      weight: d.weight,
      suggestions: DIMENSION_ADVICE[d.name] ?? [],
      notes: d.notes ?? [],
    }))
    .sort((a, b) => a.score - b.score); // weakest first
}

function buildPriorityAdvice(weak: WeakDimension[], maxAdvice: number): string[] {
  const advice: string[] = [];
  for (const dim of weak) {
    for (const suggestion of dim.suggestions) {
      advice.push(`[${dim.name}] ${suggestion}`);
      if (advice.length >= maxAdvice) return advice;
    }
  }
  return advice;
}

export function buildImprovementPrompt(
  originalPrompt: string,
  priorityAdvice: string[],
  weakDimensions: WeakDimension[],
): string {
  const sections = [`# Task\n\n${originalPrompt}`, '# Previous attempt — improve on these points'];
  if (priorityAdvice.length === 0) {
    sections.push(
      'The previous output was already strong. Keep the same quality while addressing the task.',
    );
  } else {
    for (const advice of priorityAdvice) sections.push(`- ${advice}`);
  }
  if (weakDimensions.length > 0) {
    sections.push(
      `# Weak areas (score / 100)\n${weakDimensions
        .map((d) => `- ${d.name}: ${d.score} (weight ${d.weight.toFixed(2)})`)
        .join('\n')}`,
    );
  }
  return sections.join('\n\n');
}

let seq = 0;

export function generateFeedback(
  score: FeedbackSource,
  options: FeedbackOptions = {},
): AgentFeedback {
  const threshold = options.weakThreshold ?? DEFAULT_WEAK_THRESHOLD;
  const maxAdvice = options.maxAdvice ?? DEFAULT_MAX_ADVICE;
  const weak = buildWeakDimensions(score, threshold);
  let priorityAdvice = buildPriorityAdvice(weak, maxAdvice);
  if (priorityAdvice.length === 0) {
    // Strong output: still give the agent a directive so the loop stays actionable.
    priorityAdvice = [
      'The previous output was already strong. Keep the same quality while addressing the task.',
    ];
  }

  return {
    id: `af_${Date.now().toString(36)}_${(seq++).toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    scoreId: score.id,
    taskId: score.taskId,
    prompt: score.prompt,
    response: score.response,
    overall: score.overall,
    grade: score.grade,
    weakDimensions: weak,
    priorityAdvice,
    improvementPrompt: buildImprovementPrompt(score.prompt, priorityAdvice, weak),
    createdAt: new Date().toISOString(),
  };
}
