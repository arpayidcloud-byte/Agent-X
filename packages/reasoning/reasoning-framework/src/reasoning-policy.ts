/**
 * @module reasoning-framework/reasoning-policy
 * @description Operational safety policies.
 */

import type { ReasoningContext } from './interfaces.js';

export class ReasoningPolicy {
  validate(context: ReasoningContext): boolean {
    return context.depth <= context.maxDepth;
  }
}
