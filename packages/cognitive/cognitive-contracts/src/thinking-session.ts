/**
 * @module cognitive-contracts/thinking-session
 * @description Thinking session contract base implementation.
 */

import type { ThinkingSession } from './interfaces.js';

export class ThinkingSessionBase {
  private session: ThinkingSession;

  constructor(session: ThinkingSession) {
    this.session = session;
  }

  getSession(): ThinkingSession {
    return { ...this.session };
  }
}
