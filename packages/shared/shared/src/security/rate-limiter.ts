export interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
  readonly keyGenerator?: (request: unknown) => string;
}

export interface RateLimitInfo {
  readonly key: string;
  readonly remaining: number;
  readonly limit: number;
  readonly resetAt: Date;
  readonly retryAfter?: number;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly info: RateLimitInfo;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

export class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      ...config,
      keyGenerator: config.keyGenerator || (() => 'default'),
    };
  }

  async check(request: unknown): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(request);
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now - entry.windowStart > this.config.windowMs) {
      this.limits.set(key, { count: 1, windowStart: now });
      return {
        allowed: true,
        info: {
          key,
          remaining: this.config.maxRequests - 1,
          limit: this.config.maxRequests,
          resetAt: new Date(now + this.config.windowMs),
        },
      };
    }

    entry.count++;

    if (entry.count > this.config.maxRequests) {
      const retryAfter = Math.ceil((this.config.windowMs - (now - entry.windowStart)) / 1000);
      return {
        allowed: false,
        info: {
          key,
          remaining: 0,
          limit: this.config.maxRequests,
          resetAt: new Date(entry.windowStart + this.config.windowMs),
          retryAfter,
        },
      };
    }

    return {
      allowed: true,
      info: {
        key,
        remaining: this.config.maxRequests - entry.count,
        limit: this.config.maxRequests,
        resetAt: new Date(entry.windowStart + this.config.windowMs),
      },
    };
  }

  reset(key: string): void {
    this.limits.delete(key);
  }

  resetAll(): void {
    this.limits.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now - entry.windowStart > this.config.windowMs) {
        this.limits.delete(key);
      }
    }
  }
}
