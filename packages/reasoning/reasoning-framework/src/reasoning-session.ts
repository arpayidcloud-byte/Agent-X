/**
 * @module reasoning-framework/reasoning-session
 * @description Session isolation for reasoning state.
 */

import type { ReasoningSession } from './interfaces.js';

export class ReasoningSessionManager {
  private session: ReasoningSession;

  constructor(session: ReasoningSession) {
    this.session = session;
  }

  getSession(): ReasoningSession {
    return { ...this.session };
  }
}
