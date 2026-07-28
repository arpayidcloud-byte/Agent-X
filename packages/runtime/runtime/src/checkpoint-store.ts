/**
 * @module runtime/checkpoint-store
 * @description Abstract checkpoint store interface and memory implementation.
 */

export interface Checkpoint {
  id: string;
  workflowId: string;
  snapshot: Record<string, unknown>;
  createdAt: Date;
  version: number;
  checksum: string;
  metadata: Record<string, unknown>;
}

export interface ICheckpointStore {
  save(checkpoint: Checkpoint): Promise<Checkpoint>;
  load(workflowId: string): Promise<Checkpoint | undefined>;
  list(workflowId: string): Promise<Checkpoint[]>;
  delete(checkpointId: string): Promise<void>;
}

export class MemoryCheckpointStore implements ICheckpointStore {
  private checkpoints = new Map<string, Checkpoint[]>();

  async save(checkpoint: Checkpoint): Promise<Checkpoint> {
    const existing = this.checkpoints.get(checkpoint.workflowId) || [];
    existing.push(checkpoint);
    this.checkpoints.set(checkpoint.workflowId, existing);
    return checkpoint;
  }

  async load(workflowId: string): Promise<Checkpoint | undefined> {
    const list = this.checkpoints.get(workflowId);
    if (!list || list.length === 0) return undefined;
    return list[list.length - 1];
  }

  async list(workflowId: string): Promise<Checkpoint[]> {
    return this.checkpoints.get(workflowId) || [];
  }

  async delete(checkpointId: string): Promise<void> {
    for (const [wfId, list] of this.checkpoints.entries() as IterableIterator<
      [string, Checkpoint[]]
    >) {
      const filtered = list.filter((cp) => cp.id !== checkpointId);
      if (filtered.length < list.length) {
        this.checkpoints.set(wfId, filtered);
        return;
      }
    }
  }
}
