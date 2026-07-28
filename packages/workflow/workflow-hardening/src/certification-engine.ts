/**
 * @module workflow-hardening/certification-engine
 * @description Validates workflow for production certification.
 */

import type { WorkflowCertificate, WorkflowState } from './interfaces.js';
import { createHash } from 'crypto';

export class WorkflowCertificationEngine {
  async certify(
    workflowId: string,
    state: WorkflowState,
    version: string,
  ): Promise<WorkflowCertificate> {
    const issues: string[] = [];

    if (!state.taskStates || Object.keys(state.taskStates).length === 0) {
      issues.push('Empty task states');
    }

    const allPassed = issues.length === 0;
    const score = allPassed ? 100 : Math.max(0, 100 - issues.length * 10);

    const cert: WorkflowCertificate = {
      id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      workflowId,
      version,
      score,
      status: allPassed ? 'CERTIFIED' : 'REJECTED',
      issues,
      checksum: createHash('sha256')
        .update(JSON.stringify({ workflowId, version, score }))
        .digest('hex'),
      issuedAt: new Date(),
    };

    return cert;
  }
}
