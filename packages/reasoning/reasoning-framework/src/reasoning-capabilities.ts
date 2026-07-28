/**
 * @module reasoning-framework/reasoning-capabilities
 * @description Framework supported capabilities.
 */

export class ReasoningCapabilities {
  getCapabilities(): string[] {
    return ['Pipeline', 'Graph', 'Tree', 'Strategy', 'Validation'];
  }
}
