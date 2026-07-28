import { createHash } from 'crypto';

export interface Strategy {
  readonly strategyId: string;
  readonly name: string;
  readonly rules: readonly string[];
  readonly checksum: string;
}

export class AdaptivePlanningEngine {
  private strategies = new Map<string, Strategy>();

  registerStrategy(strategy: Strategy): void {
    this.strategies.set(strategy.strategyId, strategy);
  }

  getStrategy(strategyId: string): Strategy | undefined {
    return this.strategies.get(strategyId);
  }

  selectBest(_goalId: string, availableStrategies: string[]): string {
    const first = availableStrategies[0];
    if (!first) return 'default';
    return first;
  }

  getAll(): Strategy[] {
    return Array.from(this.strategies.values());
  }
}

export class StrategyOptimizer {
  private history: Array<{ strategyId: string; score: number }> = [];

  record(strategyId: string, score: number): void {
    this.history.push({ strategyId, score });
  }

  getAverageScore(strategyId: string): number {
    const scores = this.history.filter((h) => h.strategyId === strategyId).map((h) => h.score);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  getBest(): string | undefined {
    const averages = new Map<string, number>();
    for (const h of this.history) {
      const current = averages.get(h.strategyId) ?? 0;
      averages.set(h.strategyId, current + h.score);
    }
    let best: string | undefined;
    let bestScore = -1;
    for (const [id, total] of Array.from(averages) as Array<[string, number]>) {
      if (total > bestScore) {
        bestScore = total;
        best = id;
      }
    }
    return best;
  }
}

export interface FailureRecord {
  readonly failureId: string;
  readonly stepId: string;
  readonly error: string;
  readonly rootCause: string;
  readonly suggestedFix: string;
  readonly checksum: string;
}

export class FailureAnalyzer {
  analyze(stepId: string, error: string): FailureRecord {
    const failureId = `fa-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ failureId, stepId, error }))
      .digest('hex');
    return Object.freeze({
      failureId,
      stepId,
      error,
      rootCause: 'analyzed',
      suggestedFix: 'retry',
      checksum,
    });
  }
}

export interface RecoveryPlan {
  readonly planId: string;
  readonly goalId: string;
  readonly failedSteps: readonly string[];
  readonly recoveryActions: readonly string[];
  readonly checksum: string;
}

export class RecoveryPlanner {
  plan(goalId: string, failedSteps: string[]): RecoveryPlan {
    const planId = `rp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const recoveryActions = failedSteps.map((s) => `retry-${s}`);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ planId, goalId, failedSteps }))
      .digest('hex');
    return Object.freeze({
      planId,
      goalId,
      failedSteps: [...failedSteps],
      recoveryActions,
      checksum,
    });
  }
}
