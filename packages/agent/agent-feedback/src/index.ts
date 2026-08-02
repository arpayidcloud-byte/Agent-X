/**
 * @module agent-feedback/index
 * @description Closed-loop feedback for agent outputs (roadmap: "Agent feedback
 * system"): quality scores -> actionable revision guidance -> improvement prompt.
 */

export type {
  AgentFeedback,
  WeakDimension,
  FeedbackOptions,
  FeedbackSource,
} from './interfaces.js';
export {
  generateFeedback,
  buildImprovementPrompt,
  DIMENSION_ADVICE,
  DEFAULT_WEAK_THRESHOLD,
  DEFAULT_MAX_ADVICE,
} from './generator.js';
export { buildRevisionPrompt } from './applier.js';
