/**
 * @module agent-feedback/applier
 * @description Builds a revision prompt for a follow-up agent run so the
 * feedback loop is executable: score -> feedback -> revision prompt -> rerun.
 */

import type { AgentFeedback } from './interfaces.js';
import { buildImprovementPrompt } from './generator.js';

export function buildRevisionPrompt(
  originalPrompt: string,
  feedback: Pick<AgentFeedback, 'priorityAdvice' | 'weakDimensions'>,
): string {
  return buildImprovementPrompt(originalPrompt, feedback.priorityAdvice, feedback.weakDimensions);
}
