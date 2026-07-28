import type { IContextWindowManager, ITokenEstimator } from './interfaces.js';

export class ContextWindowManager implements IContextWindowManager {
  constructor(private estimator: ITokenEstimator) {}

  public trim(data: Record<string, unknown>, maxTokens: number): Record<string, unknown> {
    const tokens = this.estimator.estimate(data);
    if (tokens <= maxTokens) return { ...data };

    const result: Record<string, unknown> = {};
    let currentTokens = 0;

    // Simple trim: keep scalar values, drop large objects/arrays if they exceed budget
    for (const [key, value] of Object.entries(data)) {
      const itemTokens = this.estimator.estimate({ [key]: value });
      if (currentTokens + itemTokens <= maxTokens) {
        result[key] = value;
        currentTokens += itemTokens;
      }
    }

    return result;
  }

  public slideWindow(history: unknown[], maxTokens: number): unknown[] {
    const result: unknown[] = [];
    let currentTokens = 0;

    // Keep most recent items (end of array)
    for (let i = history.length - 1; i >= 0; i--) {
      const itemTokens = this.estimator.estimate(history[i]);
      if (currentTokens + itemTokens <= maxTokens) {
        result.unshift(history[i]);
        currentTokens += itemTokens;
      } else {
        break;
      }
    }

    return result;
  }
}
