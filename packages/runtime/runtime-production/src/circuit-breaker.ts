/**
 * @module runtime-production/circuit-breaker
 * @description Circuit breaker pattern implementation for fault tolerance.
 */

import type { CircuitBreakerConfig, CircuitBreakerMetrics } from './interfaces.js';
import { CircuitOpenError } from './errors.js';

export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: Date | null = null;
  private config: CircuitBreakerConfig;
  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.checkState();
    this.totalRequests++;
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private checkState(): void {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (
        this.lastFailureTime &&
        now - this.lastFailureTime.getTime() > this.config.recoveryTimeoutMs
      ) {
        this.state = 'HALF_OPEN';
      } else {
        throw new CircuitOpenError('Circuit breaker is open', 'circuit-breaker');
      }
    }
  }

  private onSuccess(): void {
    this.successfulRequests++;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failedRequests++;
    this.failureCount++;
    this.lastFailureTime = new Date();
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getMetrics(): CircuitBreakerMetrics {
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      state: this.state,
      lastFailureTime: this.lastFailureTime || undefined,
    };
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
  }
}
