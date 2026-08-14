import type { RouteRequest, LLMResponse } from './types.js';
import crypto from 'crypto';

export class LLMCacheManager {
  private cache: Map<string, { response: LLMResponse; expiresAt: number }> = new Map();
  private ttlMs: number;

  constructor(ttlMs: number = 1000 * 60 * 60 * 24) {
    // Default 24 hours
    this.ttlMs = ttlMs;
  }

  private hashRequest(req: RouteRequest, prompt: string): string {
    const payload = JSON.stringify({
      orgId: req.context?.orgId,
      taskId: req.taskId, // Often task is isolated, but let's hash prompt + complexity
      complexity: req.complexity,
      type: req.type,
      prompt,
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  async getCached(req: RouteRequest, prompt: string): Promise<LLMResponse | null> {
    // Requests without authenticated tenant context must never read a cache
    // entry, including entries created by older versions with shared keys.
    if (!req.context?.orgId) return null;
    const key = this.hashRequest(req, prompt);
    const entry = this.cache.get(key);

    if (entry) {
      if (Date.now() < entry.expiresAt) {
        // Return cloned response flagged as cached
        return { ...entry.response, cached: true, cost: 0, latencyMs: 0 };
      } else {
        this.cache.delete(key);
      }
    }
    return null;
  }

  async setCache(req: RouteRequest, prompt: string, response: LLMResponse): Promise<void> {
    // Fail closed: do not create an unscoped/shared cache entry.
    if (!req.context?.orgId) return;
    const key = this.hashRequest(req, prompt);
    this.cache.set(key, {
      response,
      expiresAt: Date.now() + this.ttlMs,
    });
  }
}
