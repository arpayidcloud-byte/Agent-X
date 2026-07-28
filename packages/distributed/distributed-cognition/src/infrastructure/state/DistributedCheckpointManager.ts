import { createHash } from 'crypto';

export interface DistributedCheckpoint {
  readonly checkpointId: string;
  readonly nodeId: string;
  readonly sessionId: string;
  readonly state: Record<string, unknown>;
  readonly version: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class DistributedCheckpointManager {
  private checkpoints = new Map<string, DistributedCheckpoint[]>();

  save(
    nodeId: string,
    sessionId: string,
    state: Record<string, unknown>,
    version: number,
  ): DistributedCheckpoint {
    const checkpointId = `dcp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ nodeId, sessionId, state, version }))
      .digest('hex');
    const checkpoint: DistributedCheckpoint = Object.freeze({
      checkpointId,
      nodeId,
      sessionId,
      state: JSON.parse(JSON.stringify(state)) as Record<string, unknown>,
      version,
      timestamp: new Date(),
      checksum,
    });
    const existing = this.checkpoints.get(sessionId) || [];
    existing.push(checkpoint);
    this.checkpoints.set(sessionId, existing);
    return checkpoint;
  }

  load(sessionId: string, nodeId?: string): DistributedCheckpoint | undefined {
    const all = this.checkpoints.get(sessionId) || [];
    const filtered = nodeId ? all.filter((c) => c.nodeId === nodeId) : all;
    if (filtered.length === 0) return undefined;
    return filtered[filtered.length - 1];
  }

  validate(checkpoint: DistributedCheckpoint): boolean {
    const computed = createHash('sha256')
      .update(
        JSON.stringify({
          nodeId: checkpoint.nodeId,
          sessionId: checkpoint.sessionId,
          state: checkpoint.state,
          version: checkpoint.version,
        }),
      )
      .digest('hex');
    return computed === checkpoint.checksum;
  }

  list(sessionId: string): DistributedCheckpoint[] {
    return [...(this.checkpoints.get(sessionId) || [])];
  }

  remove(sessionId: string, checkpointId: string): boolean {
    const all = this.checkpoints.get(sessionId) || [];
    const idx = all.findIndex((c) => c.checkpointId === checkpointId);
    if (idx >= 0) {
      all.splice(idx, 1);
      return true;
    }
    return false;
  }
}
