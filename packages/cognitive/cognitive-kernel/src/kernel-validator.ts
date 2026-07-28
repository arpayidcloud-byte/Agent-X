/**
 * @module cognitive-kernel/kernel-validator
 * @description Input and state verification.
 */

import type { SessionMetadata } from './interfaces.js';
import { SessionError } from './errors.js';

export class KernelValidator {
  validateSession(metadata: SessionMetadata): void {
    if (!metadata.traceId || !metadata.sessionId) {
      throw new SessionError('Session missing critical metadata IDs', 'validator');
    }
  }
}
