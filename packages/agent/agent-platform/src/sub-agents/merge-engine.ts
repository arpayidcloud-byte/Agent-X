import { MergeConflictError } from './errors.js';

export class MergeEngine {
  public merge(outputs: unknown[]): Record<string, unknown> {
    const merged: Record<string, unknown> = {};

    for (const output of outputs) {
      if (typeof output !== 'object' || output === null) continue;

      const record = output as Record<string, unknown>;
      for (const [key, val] of Object.entries(record)) {
        if (merged[key] !== undefined && JSON.stringify(merged[key]) !== JSON.stringify(val)) {
          throw new MergeConflictError(`Conflict detected for key: ${key}`);
        }
        merged[key] = val;
      }
    }

    return merged;
  }
}

export class ConflictResolver {
  public resolveConflict(
    _key: string,
    val1: unknown,
    val2: unknown,
    criteria: {
      architectOverride?: boolean;
      coverageScore1?: number;
      coverageScore2?: number;
    },
  ): unknown {
    if (criteria.architectOverride) {
      return val1; // Assume val1 is from architect
    }

    if (criteria.coverageScore1 !== undefined && criteria.coverageScore2 !== undefined) {
      return criteria.coverageScore1 >= criteria.coverageScore2 ? val1 : val2;
    }

    return val1;
  }
}
