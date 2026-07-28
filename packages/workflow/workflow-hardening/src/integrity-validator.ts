/**
 * @module workflow-hardening/integrity-validator
 * @description Validates all workflow integrity checksums.
 */

import type { WorkflowState } from './interfaces.js';
import { IntegrityError } from './errors.js';
import { createHash } from 'crypto';

export class WorkflowIntegrityValidator {
  validateChecksum(data: string, expectedChecksum: string): void {
    const computed = createHash('sha256').update(data).digest('hex');
    if (computed !== expectedChecksum) {
      throw new IntegrityError(
        `Checksum mismatch: expected ${expectedChecksum}, got ${computed}`,
        'integrity-validator',
      );
    }
  }

  validateStateIntegrity(state: WorkflowState): void {
    if (!state.taskStates) throw new IntegrityError('Missing task states', 'integrity-validator');
    if (!state.decisions) throw new IntegrityError('Missing decisions', 'integrity-validator');
    if (!state.resources) throw new IntegrityError('Missing resources', 'integrity-validator');
    if (!state.metrics) throw new IntegrityError('Missing metrics', 'integrity-validator');
  }

  validateGraphIntegrity(nodes: string[], edges: [string, string][]): void {
    const nodeSet = new Set(nodes);
    for (const [src, tgt] of edges) {
      if (!nodeSet.has(src) || !nodeSet.has(tgt)) {
        throw new IntegrityError(
          `Edge references missing node: ${src} -> ${tgt}`,
          'integrity-validator',
        );
      }
    }
  }
}
