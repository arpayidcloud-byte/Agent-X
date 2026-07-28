import { createHash } from 'crypto';

export interface ReplayEntry {
  readonly entryId: string;
  readonly sessionId: string;
  readonly nodeId: string;
  readonly action: string;
  readonly state: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class DistributedReplayEngine {
  private entries = new Map<string, ReplayEntry[]>();

  record(
    sessionId: string,
    nodeId: string,
    action: string,
    state: Record<string, unknown>,
  ): ReplayEntry {
    const entryId = `re-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ sessionId, nodeId, action, state }))
      .digest('hex');
    const entry: ReplayEntry = Object.freeze({
      entryId,
      sessionId,
      nodeId,
      action,
      state: JSON.parse(JSON.stringify(state)) as Record<string, unknown>,
      timestamp: new Date(),
      checksum,
    });
    const existing = this.entries.get(sessionId) || [];
    existing.push(entry);
    this.entries.set(sessionId, existing);
    return entry;
  }

  getEntries(sessionId: string): ReplayEntry[] {
    return [...(this.entries.get(sessionId) || [])];
  }

  validate(sessionId: string): boolean {
    const entries = this.entries.get(sessionId) || [];
    return entries.every((entry) => {
      const computed = createHash('sha256')
        .update(
          JSON.stringify({
            sessionId: entry.sessionId,
            nodeId: entry.nodeId,
            action: entry.action,
            state: entry.state,
          }),
        )
        .digest('hex');
      return computed === entry.checksum;
    });
  }

  replay(sessionId: string): ReplayEntry[] {
    return [...(this.entries.get(sessionId) || [])];
  }

  getSessions(): string[] {
    return Array.from(this.entries.keys());
  }
}
