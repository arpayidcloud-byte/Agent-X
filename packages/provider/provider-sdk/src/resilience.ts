import {
  ProviderRateLimitError,
  ProviderTimeoutError,
  ProviderUnavailableError,
  CircuitBreakerOpenError,
} from './errors.js';
import type { CircuitBreakerConfig, RetryPolicy } from './interfaces.js';

export class CircuitBreaker {
  private failures = 0;
  private nextAttemptAt = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  public isOpen(): boolean {
    if (this.failures >= this.config.failureThreshold) {
      if (Date.now() > this.nextAttemptAt) {
        // Half-open state
        return false;
      }
      return true;
    }
    return false;
  }

  public recordSuccess(): void {
    this.failures = 0;
  }

  public recordFailure(): void {
    this.failures++;
    if (this.failures >= this.config.failureThreshold) {
      this.nextAttemptAt = Date.now() + this.config.resetTimeoutMs;
    }
  }
}

export const executeWithRetry = async <T>(
  action: () => Promise<T>,
  policy: RetryPolicy,
  providerId: string,
  circuitBreaker?: CircuitBreaker,
): Promise<T> => {
  let attempt = 0;
  let lastError: Error | undefined;

  while (attempt <= policy.maxAttempts) {
    if (circuitBreaker && circuitBreaker.isOpen()) {
      throw new CircuitBreakerOpenError(providerId);
    }

    try {
      const result = await action();
      if (circuitBreaker) circuitBreaker.recordSuccess();
      return result;
    } catch (e: unknown) {
      lastError = e instanceof Error ? e : new Error(String(e));

      const isRetryable =
        e instanceof ProviderRateLimitError ||
        e instanceof ProviderTimeoutError ||
        e instanceof ProviderUnavailableError;

      if (!isRetryable) {
        throw lastError; // Do not retry non-transient errors
      }

      if (circuitBreaker) circuitBreaker.recordFailure();

      if (attempt >= policy.maxAttempts) {
        throw lastError;
      }

      // Exponential backoff
      const delay = Math.min(
        policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attempt),
        policy.maxDelayMs || Infinity,
      );

      // Add jitter (±10%)
      const jitter = delay * 0.1 * (Math.random() * 2 - 1);
      const actualDelay = Math.max(0, delay + jitter);

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
      attempt++;
    }
  }

  throw lastError;
};
