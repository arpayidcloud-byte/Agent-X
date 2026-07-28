/**
 * @module workflow-engine/retry
 * @description RetryCoordinator for managing retry logic with backoff policies.
 */

import type { RetryBudget, RetryDecision, BackoffPolicy } from './interfaces-v2.js';

export class RetryCoordinator {
  private budgets = new Map<string, RetryBudget>();
  private attempts = new Map<string, number>();

  private defaultPolicy: BackoffPolicy = {
    type: 'exponential',
    baseDelayMs: 1000,
    multiplier: 2,
    maxDelayMs: 30000,
  };

  public shouldRetry(nodeId: string, error: Error, attempt: number): RetryDecision {
    const budget = this.getRetryBudget(nodeId);
    if (budget.usedRetries >= budget.maxRetries) {
      return {
        shouldRetry: false,
        attempt,
        delayMs: 0,
        reason: 'Retry budget exhausted',
      };
    }

    const retryableErrors = ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', '429', '500', '502', '503'];
    const isRetryable = retryableErrors.some((code) => error.message.includes(code));

    if (!isRetryable) {
      return {
        shouldRetry: false,
        attempt,
        delayMs: 0,
        reason: `Non-retryable error: ${error.message}`,
      };
    }

    const delayMs = this.calculateDelay(attempt);
    return {
      shouldRetry: true,
      attempt: attempt + 1,
      delayMs,
      reason: `Retryable error: ${error.message}`,
    };
  }

  public getRetryBudget(nodeId: string): RetryBudget {
    if (!this.budgets.has(nodeId)) {
      this.budgets.set(nodeId, {
        maxRetries: 3,
        usedRetries: 0,
        remainingRetries: 3,
      });
    }
    return this.budgets.get(nodeId) as RetryBudget;
  }

  public recordAttempt(nodeId: string): void {
    const current = this.attempts.get(nodeId) || 0;
    this.attempts.set(nodeId, current + 1);
    const budget = this.getRetryBudget(nodeId);
    budget.usedRetries++;
    budget.remainingRetries = budget.maxRetries - budget.usedRetries;
  }

  public resetBudgets(): void {
    this.budgets.clear();
    this.attempts.clear();
  }

  private calculateDelay(attempt: number): number {
    const delay = this.defaultPolicy.baseDelayMs * Math.pow(this.defaultPolicy.multiplier, attempt);
    return Math.min(delay, this.defaultPolicy.maxDelayMs);
  }
}
