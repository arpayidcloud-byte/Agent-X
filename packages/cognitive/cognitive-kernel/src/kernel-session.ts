/**
 * @module cognitive-kernel/kernel-session
 * @description Manages isolation of cognitive thinking sessions.
 */

import type { SessionMetadata } from './interfaces.js';
import { SessionError } from './errors.js';

export class KernelSession {
  private metadata: SessionMetadata;
  private status: 'ACTIVE' | 'CLOSED' = 'ACTIVE';

  constructor(metadata: SessionMetadata) {
    this.metadata = metadata;
  }

  getMetadata(): SessionMetadata {
    return { ...this.metadata };
  }

  getStatus() {
    return this.status;
  }

  close(): void {
    if (this.status === 'CLOSED') {
      throw new SessionError('Session already closed', 'kernel-session');
    }
    this.status = 'CLOSED';
  }
}
