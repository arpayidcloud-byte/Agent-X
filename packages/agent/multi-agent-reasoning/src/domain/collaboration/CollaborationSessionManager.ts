/**
 * @module multi-agent-reasoning/domain/collaboration/CollaborationSessionManager
 * @description Manages collaboration session lifecycle.
 */

import type { CollaborationSession } from './interfaces.js';
import { createHash } from 'crypto';

export class CollaborationSessionManager {
  private sessions = new Map<string, CollaborationSession>();

  createSession(goalId: string, agentIds: string[]): CollaborationSession {
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, agentIds }))
      .digest('hex');
    const session: CollaborationSession = {
      id: `collab-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      traceId: `trace-${Date.now()}`,
      goalId,
      participants: [...agentIds],
      status: 'ACTIVE',
      startedAt: new Date(),
      checksum,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  completeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) session.status = 'COMPLETED';
  }

  failSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) session.status = 'FAILED';
  }

  listSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values());
  }
}
