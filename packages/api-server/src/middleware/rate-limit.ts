import type { FastifyRequest, FastifyReply } from 'fastify';
import { RBACRole, getRoleLimit } from './rbac.js';
import type { Role } from './rbac.js';

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000;

class PerKeyRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupTimer: ReturnType<typeof setTimeout> | null = null;

  check(
    key: string,
    maxRequests: number,
  ): {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
    retryAfter: number | undefined;
  } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now - entry.windowStart > WINDOW_MS) {
      this.store.set(key, { count: 1, windowStart: now });
      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        resetAt: now + WINDOW_MS,
        retryAfter: undefined,
      };
    }

    entry.count++;

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000);
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetAt: entry.windowStart + WINDOW_MS,
        retryAfter,
      };
    }

    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - entry.count,
      resetAt: entry.windowStart + WINDOW_MS,
      retryAfter: undefined,
    };
  }

  startCleanup(): void {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const entries = Array.from(this.store.entries());
      for (const [key, entry] of entries) {
        if (now - entry.windowStart > WINDOW_MS) {
          this.store.delete(key);
        }
      }
    }, WINDOW_MS * 2);
    this.cleanupTimer.unref();
  }
}

const limiter = new PerKeyRateLimiter();
limiter.startCleanup();

export function createRateLimitMiddleware(_defaultRole?: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userMetadata = request.userMetadata as
      { role: string; sub?: string; [key: string]: unknown } | undefined;
    const role = (userMetadata?.role ?? RBACRole.VIEWER) as Role;
    const sub = userMetadata?.sub as string | undefined;
    const maxRequests = getRoleLimit(role);

    let rateLimitKey: string;

    if (sub) {
      rateLimitKey = `user:${sub}:${role}`;
    } else {
      rateLimitKey = `apikey:${request.ip}`;
    }

    const result = limiter.check(rateLimitKey, maxRequests);

    void reply.header('X-RateLimit-Limit', String(result.limit));
    void reply.header('X-RateLimit-Remaining', String(result.remaining));
    void reply.header('X-RateLimit-Reset', String(result.resetAt));

    if (!result.allowed && result.retryAfter) {
      void reply.header('Retry-After', String(result.retryAfter));
      void reply.code(429).send({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
        retryAfter: result.retryAfter,
        limit: result.limit,
      });
      return;
    }
  };
}
