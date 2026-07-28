/**
 * @module multi-agent-collaboration/shared-context-manager
 * @description Manages shared context between agents.
 */

import type { SharedContext } from './interfaces.js';
import { createHash } from 'crypto';

export class SharedContextManager {
  private contexts = new Map<string, SharedContext>();

  create(sessionId: string, data: Record<string, unknown>): SharedContext {
    const payload = JSON.stringify(data);
    const ctx: SharedContext = {
      sessionId,
      data: { ...data },
      version: 1,
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.contexts.set(sessionId, ctx);
    return ctx;
  }

  update(sessionId: string, data: Record<string, unknown>): SharedContext {
    const ctx = this.contexts.get(sessionId);
    if (!ctx) throw new Error('Context not found');
    const payload = JSON.stringify(data);
    ctx.data = { ...ctx.data, ...data };
    ctx.version++;
    ctx.checksum = createHash('sha256').update(payload).digest('hex');
    return ctx;
  }

  get(sessionId: string): SharedContext | undefined {
    return this.contexts.get(sessionId);
  }
}
