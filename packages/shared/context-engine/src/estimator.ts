import type { ITokenEstimator } from './interfaces.js';

export class SimpleTokenEstimator implements ITokenEstimator {
  public estimate(data: unknown): number {
    if (!data) return 0;
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    // Simple estimation: 1 token approx 4 characters
    return Math.ceil(str.length / 4);
  }
}
