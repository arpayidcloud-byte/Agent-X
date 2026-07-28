/**
 * @module reasoning-framework/reasoning-registry
 * @description Strategy registry manager.
 */

import type { IReasoningStrategy } from './interfaces.js';

export class ReasoningRegistry {
  private strategies = new Map<string, IReasoningStrategy>();

  register(id: string, strategy: IReasoningStrategy): void {
    this.strategies.set(id, strategy);
  }

  resolve(id: string): IReasoningStrategy | undefined {
    return this.strategies.get(id);
  }
}
