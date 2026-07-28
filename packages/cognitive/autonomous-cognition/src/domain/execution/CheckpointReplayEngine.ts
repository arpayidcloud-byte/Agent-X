import { createHash } from 'crypto';

export interface Checkpoint {
  readonly checkpointId: string;
  readonly goalId: string;
  readonly state: Record<string, unknown>;
  readonly version: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class ExecutionCheckpointManager {
  private checkpoints = new Map<string, Checkpoint[]>();

  save(goalId: string, state: Record<string, unknown>, version: number): Checkpoint {
    const checkpointId = `cp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, state, version }))
      .digest('hex');
    const cp: Checkpoint = Object.freeze({
      checkpointId,
      goalId,
      state: JSON.parse(JSON.stringify(state)) as Record<string, unknown>,
      version,
      timestamp: new Date(),
      checksum,
    });
    const existing = this.checkpoints.get(goalId) ?? [];
    existing.push(cp);
    this.checkpoints.set(goalId, existing);
    return cp;
  }

  load(goalId: string): Checkpoint | undefined {
    const all = this.checkpoints.get(goalId);
    if (!all) return undefined;
    return all[all.length - 1];
  }

  validate(cp: Checkpoint): boolean {
    const computed = createHash('sha256')
      .update(JSON.stringify({ goalId: cp.goalId, state: cp.state, version: cp.version }))
      .digest('hex');
    return computed === cp.checksum;
  }

  list(goalId: string): Checkpoint[] {
    const all = this.checkpoints.get(goalId);
    if (!all) return [];
    return [...all];
  }
}

export interface ReplayEntry {
  readonly entryId: string;
  readonly goalId: string;
  readonly action: string;
  readonly state: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class ExecutionReplayEngine {
  private entries = new Map<string, ReplayEntry[]>();

  record(goalId: string, action: string, state: Record<string, unknown>): ReplayEntry {
    const entryId = `re-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, action, state }))
      .digest('hex');
    const entry: ReplayEntry = Object.freeze({
      entryId,
      goalId,
      action,
      state: JSON.parse(JSON.stringify(state)) as Record<string, unknown>,
      timestamp: new Date(),
      checksum,
    });
    const existing = this.entries.get(goalId) ?? [];
    existing.push(entry);
    this.entries.set(goalId, existing);
    return entry;
  }

  getEntries(goalId: string): ReplayEntry[] {
    const all = this.entries.get(goalId);
    if (!all) return [];
    return [...all];
  }

  validate(goalId: string): boolean {
    const all = this.entries.get(goalId);
    if (!all) return true;
    return all.every((e) => {
      const computed = createHash('sha256')
        .update(JSON.stringify({ goalId: e.goalId, action: e.action, state: e.state }))
        .digest('hex');
      return computed === e.checksum;
    });
  }
}
