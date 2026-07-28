/**
 * @module workflow-hardening/snapshot-diff
 * @description Compares workflow snapshots for changes.
 */

import type { SnapshotDiffResult } from './interfaces.js';
import { createHash } from 'crypto';

export class WorkflowSnapshotDiff {
  diff(
    checkpointA: Record<string, unknown>,
    checkpointB: Record<string, unknown>,
  ): SnapshotDiffResult {
    const keysA = Object.keys(checkpointA);
    const keysB = Object.keys(checkpointB);

    const added = keysB.filter((k) => !keysA.includes(k));
    const removed = keysA.filter((k) => !keysB.includes(k));
    const modified = keysA.filter(
      (k) => keysB.includes(k) && JSON.stringify(checkpointA[k]) !== JSON.stringify(checkpointB[k]),
    );

    const hashA = createHash('sha256').update(JSON.stringify(checkpointA)).digest('hex');
    const hashB = createHash('sha256').update(JSON.stringify(checkpointB)).digest('hex');

    return {
      checkpointAId: `cp-a-${Date.now()}`,
      checkpointBId: `cp-b-${Date.now()}`,
      added,
      removed,
      modified,
      executionDelta: added.length + removed.length + modified.length,
      stateDelta: {
        keysAdded: added.length,
        keysRemoved: removed.length,
        keysModified: modified.length,
      },
      decisionDelta: [],
      resourceDelta: {},
      metricDelta: {},
      checksumDelta: hashA !== hashB ? `${hashA} -> ${hashB}` : 'identical',
    };
  }
}
