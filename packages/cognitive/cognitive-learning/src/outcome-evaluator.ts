/**
 * @module cognitive-learning/outcome-evaluator
 * @description Compares expected vs actual outcomes.
 */

export class OutcomeEvaluator {
  evaluate(
    expected: string,
    actual: string,
  ): { successScore: number; qualityScore: number; confidenceDelta: number } {
    const match = expected === actual;
    return {
      successScore: match ? 100 : 0,
      qualityScore: match ? 95 : 20,
      confidenceDelta: match ? 5 : -10,
    };
  }
}
