/**
 * @module workflow-engine/snapshot-v2
 * @description Extended snapshot with versioning.
 */

import type { NodeState } from './interfaces.js';
import type { VersionedExecutionSnapshot } from './interfaces-v2.js';

export function createVersionedSnapshot(
  workflowId: string,
  nodeStates: Map<string, NodeState>,
  results: Map<string, unknown>,
  version: number,
  createdBy: string,
): VersionedExecutionSnapshot {
  const snapshot: VersionedExecutionSnapshot = {
    workflowId,
    nodeStates: new Map(nodeStates),
    results: new Map(results),
    timestamp: new Date(),
    version,
    schemaVersion: '2.0',
    workflowVersion: 1,
    engineVersion: '1.0.0',
    snapshotVersion: version,
    createdBy,
    checksum: '',
  };

  snapshot.checksum = computeChecksum(snapshot);
  return snapshot;
}

export function computeChecksum(snapshot: VersionedExecutionSnapshot): string {
  const data = JSON.stringify({
    workflowId: snapshot.workflowId,
    nodeStates: Object.fromEntries(snapshot.nodeStates),
    results: Object.fromEntries(snapshot.results),
    timestamp: snapshot.timestamp,
  });
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

export function validateSnapshotChecksum(snapshot: VersionedExecutionSnapshot): boolean {
  const computed = computeChecksum(snapshot);
  return computed === snapshot.checksum;
}
