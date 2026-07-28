/**
 * @module reasoning-algorithms/explanation-engine
 * @description Renders human-readable explanation trace from symbolic results.
 */

export class ExplanationEngine {
  explain(trace: string[], path: string[], evidence: string[]): string {
    return [
      '### Reasoning Explanation',
      `Trace Steps: ${trace.join(' -> ')}`,
      `Decision Path: ${path.join(' -> ')}`,
      `Evidence Used: ${evidence.join(', ')}`,
    ].join('\n');
  }
}
