/**
 * @module workflow-engine/checkpoint
 * @description Checkpoint management for workflow state persistence.
 */

import type { ExecutionSnapshot, Checkpoint, ICheckpointManager, NodeState } from './interfaces.js';
import { SnapshotError } from './errors.js';

/**
 * In-memory checkpoint manager
 */
export class InMemoryCheckpointManager implements ICheckpointManager {
  private checkpoints = new Map<string, Checkpoint[]>();

  /** @inheritdoc */
  async save(snapshot: ExecutionSnapshot): Promise<Checkpoint> {
    const checkpoint: Checkpoint = {
      id: `cp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      workflowId: snapshot.workflowId,
      snapshot: { ...snapshot },
      createdAt: new Date(),
    };

    const existing = this.checkpoints.get(snapshot.workflowId) || [];
    existing.push(checkpoint);
    this.checkpoints.set(snapshot.workflowId, existing);

    return checkpoint;
  }

  /** @inheritdoc */
  async load(workflowId: string): Promise<Checkpoint | undefined> {
    const list = this.checkpoints.get(workflowId);
    if (!list || list.length === 0) return undefined;
    return list[list.length - 1];
  }

  /** @inheritdoc */
  async list(workflowId: string): Promise<Checkpoint[]> {
    return this.checkpoints.get(workflowId) || [];
  }

  /** @inheritdoc */
  async delete(checkpointId: string): Promise<void> {
    for (const [workflowId, list] of this.checkpoints.entries() as IterableIterator<
      [string, Checkpoint[]]
    >) {
      const filtered = list.filter((cp: Checkpoint) => cp.id !== checkpointId);
      if (filtered.length < list.length) {
        this.checkpoints.set(workflowId, filtered);
        return;
      }
    }
    throw new SnapshotError(`Checkpoint not found: ${checkpointId}`);
  }
}

/**
 * Creates an execution snapshot
 */
export function createSnapshot(
  workflowId: string,
  nodeStates: Map<string, NodeState>,
  results: Map<string, unknown>,
  version: number,
): ExecutionSnapshot {
  return {
    workflowId,
    nodeStates: new Map(nodeStates),
    results: new Map(results),
    timestamp: new Date(),
    version,
  };
}

/**
 * Restores state from snapshot
 */
export function restoreFromSnapshot(snapshot: ExecutionSnapshot): {
  nodeStates: Map<string, NodeState>;
  results: Map<string, unknown>;
} {
  return {
    nodeStates: new Map(snapshot.nodeStates),
    results: new Map(snapshot.results),
  };
}
