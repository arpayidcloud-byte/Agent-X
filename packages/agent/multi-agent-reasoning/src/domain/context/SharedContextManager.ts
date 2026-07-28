/**
 * @module multi-agent-reasoning/domain/context/SharedContextManager
 * @description Manages shared reasoning context.
 */

import type { SharedContext } from './interfaces.js';
import { createHash } from 'crypto';

export class SharedContextManager {
  private contexts = new Map<string, SharedContext>();

  createContext(sessionId: string, data: Record<string, unknown>): SharedContext {
    const payload = JSON.stringify(data);
    const ctx: SharedContext = {
      sessionId,
      data: JSON.parse(payload) as Record<string, unknown>,
      version: 1,
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.contexts.set(sessionId, ctx);
    return ctx;
  }

  updateContext(sessionId: string, data: Record<string, unknown>): SharedContext {
    const ctx = this.contexts.get(sessionId);
    if (!ctx) throw new Error('Context not found');
    const payload = JSON.stringify(data);
    ctx.data = {
      ...(JSON.parse(JSON.stringify(ctx.data)) as Record<string, unknown>),
      ...(JSON.parse(payload) as Record<string, unknown>),
    };
    ctx.version++;
    ctx.checksum = createHash('sha256').update(payload).digest('hex');
    return ctx;
  }

  getContext(sessionId: string): SharedContext | undefined {
    return this.contexts.get(sessionId);
  }
}
