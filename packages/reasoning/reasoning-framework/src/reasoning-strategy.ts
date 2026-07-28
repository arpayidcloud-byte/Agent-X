/**
 * @module reasoning-framework/reasoning-strategy
 * @description Strategy interface definitions.
 */

import type { IReasoningStrategy, ReasoningContext, ReasoningGraph } from './interfaces.js';

export class ReasoningStrategyBase implements IReasoningStrategy {
  async initialize(_context: ReasoningContext): Promise<void> {}
  async prepare(_graph: ReasoningGraph): Promise<void> {}
  async execute(graph: ReasoningGraph): Promise<ReasoningGraph> {
    return graph;
  }
  async validate(_graph: ReasoningGraph): Promise<boolean> {
    return true;
  }
  async checkpoint(_sessionId: string, _snapshot: Record<string, unknown>): Promise<void> {}
  async recover(_sessionId: string): Promise<Record<string, unknown>> {
    return {};
  }
  async cleanup(): Promise<void> {}
}
