import type { IRetryPolicy } from '../interfaces/scheduler.js';
import type { CancellationToken } from '../cancellation/index.js';

export class RetryPolicy implements IRetryPolicy {
  public readonly type: 'exponential' | 'linear' | 'constant';
  public readonly maxAttempts: number;
  public readonly initialDelayMs: number;
  public readonly backoffMultiplier: number;
  public readonly maxDelayMs?: number;

  private retryableErrors: string[];

  constructor(
    config: {
      type?: 'exponential' | 'linear' | 'constant';
      maxAttempts?: number;
      initialDelayMs?: number;
      backoffMultiplier?: number;
      maxDelayMs?: number;
      retryableErrors?: string[];
    } = {},
  ) {
    this.type = config.type || 'exponential';
    this.maxAttempts = config.maxAttempts ?? 3;
    this.initialDelayMs = config.initialDelayMs ?? 1000;
    this.backoffMultiplier = config.backoffMultiplier ?? 2.0;
    this.maxDelayMs = config.maxDelayMs;
    this.retryableErrors = config.retryableErrors || [
      'ECONNRESET',
      'ETIMEDOUT',
      'EAI_AGAIN',
      '429',
      '500',
      '502',
      '503',
    ];
  }

  public calculateDelay(attempt: number): number {
    let delay = this.initialDelayMs;

    switch (this.type) {
      case 'linear':
        delay = this.initialDelayMs + this.initialDelayMs * attempt;
        break;
      case 'constant':
        delay = this.initialDelayMs;
        break;
      case 'exponential':
      default:
        delay = this.initialDelayMs * Math.pow(this.backoffMultiplier, attempt);
        break;
    }

    if (this.maxDelayMs) {
      delay = Math.min(delay, this.maxDelayMs);
    }

    // Add jitter (±20%)
    const jitter = delay * 0.2 * (Math.random() * 2 - 1);
    return Math.max(0, Math.round(delay + jitter));
  }

  public isRetryable(error: Error): boolean {
    const msg = error.message.toUpperCase();
    return this.retryableErrors.some((code) => msg.includes(code));
  }

  public async execute<T>(
    operation: () => Promise<T>,
    cancellationToken?: CancellationToken,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxAttempts; attempt++) {
      if (cancellationToken?.isCancelled) {
        throw new Error(`Operation cancelled: ${cancellationToken.reason}`);
      }

      try {
        return await operation();
      } catch (e: unknown) {
        lastError = e instanceof Error ? e : new Error(String(e));

        if (attempt >= this.maxAttempts || !this.isRetryable(lastError)) {
          throw lastError;
        }

        const delay = this.calculateDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
