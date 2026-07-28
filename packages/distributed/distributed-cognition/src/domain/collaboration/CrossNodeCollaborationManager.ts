import { createHash } from 'crypto';
import type { CrossNodeSession, CollaborationMessage, CollaborationState } from './interfaces.js';

export class CrossNodeCollaborationManager {
  private sessions = new Map<string, CrossNodeSession>();
  private messages: CollaborationMessage[] = [];

  initiate(initiatorNode: string, goalId: string, participants: string[]): CrossNodeSession {
    const sessionId = `cn-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const allParticipants = [initiatorNode, ...participants.filter((p) => p !== initiatorNode)];
    const checksum = createHash('sha256')
      .update(JSON.stringify({ sessionId, initiatorNode, goalId, participants: allParticipants }))
      .digest('hex');
    const session: CrossNodeSession = Object.freeze({
      sessionId,
      initiatorNode,
      participants: [...allParticipants],
      state: 'INITIATED',
      goalId,
      checksum,
      createdAt: new Date(),
    });
    this.sessions.set(sessionId, session);
    return session;
  }

  transition(sessionId: string, newState: CollaborationState): CrossNodeSession {
    const current = this.sessions.get(sessionId);
    if (!current) throw new Error(`Session not found: ${sessionId}`);
    const updated: CrossNodeSession = Object.freeze({ ...current, state: newState });
    this.sessions.set(sessionId, updated);
    return updated;
  }

  sendMessage(message: CollaborationMessage): void {
    this.messages.push(Object.freeze({ ...message }));
  }

  getMessages(fromNode?: string, toNode?: string): CollaborationMessage[] {
    return this.messages.filter(
      (m) => (!fromNode || m.fromNode === fromNode) && (!toNode || m.toNode === toNode),
    );
  }

  getSession(sessionId: string): CrossNodeSession | undefined {
    return this.sessions.get(sessionId);
  }

  getSessionsByNode(nodeId: string): CrossNodeSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.participants.includes(nodeId));
  }
}
