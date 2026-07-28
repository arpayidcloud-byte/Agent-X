/**
 * @module runtime-production/idempotency-manager
 * @description Prevents duplicate execution of requests.
 */

import { IdempotencyError } from './errors.js';

export class IdempotencyManager {
  private executed = new Set<string>();

  generateKey(traceId: string, workflowId: string, requestId: string, goalHash: string): string {
    return `${traceId}:${workflowId}:${requestId}:${goalHash}`;
  }

  checkAndStore(key: string): void {
    if (this.executed.has(key)) {
      throw new IdempotencyError(`Request already executed: ${key}`, 'idempotency-manager');
    }
    this.executed.add(key);
  }

  isExecuted(key: string): boolean {
    return this.executed.has(key);
  }

  clear(): void {
    this.executed.clear();
  }
}
