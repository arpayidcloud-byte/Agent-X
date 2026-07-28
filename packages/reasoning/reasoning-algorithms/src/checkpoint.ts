/**
 * @module reasoning-algorithms/checkpoint
 * @description In-memory checkpoint wrappers.
 */

export class CheckpointManager {
  private checkpoints = new Map<string, Record<string, unknown>>();

  save(sessionId: string, snapshot: Record<string, unknown>): void {
    this.checkpoints.set(sessionId, snapshot);
  }

  load(sessionId: string): Record<string, unknown> | undefined {
    return this.checkpoints.get(sessionId);
  }
}
