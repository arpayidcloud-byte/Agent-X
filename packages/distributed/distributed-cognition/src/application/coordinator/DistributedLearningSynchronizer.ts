import { createHash } from 'crypto';
import type { KnowledgeEntry } from '../../domain/knowledge/interfaces.js';
import type { KnowledgeReplicationManager } from '../../domain/knowledge/KnowledgeReplicationManager.js';

export interface LearningSyncResult {
  readonly sessionId: string;
  readonly syncedEntries: number;
  readonly conflictsResolved: number;
  readonly checksum: string;
}

export class DistributedLearningSynchronizer {
  private syncResults: LearningSyncResult[] = [];

  constructor(private knowledgeReplication: KnowledgeReplicationManager) {}

  synchronize(sessionId: string, remoteEntries: KnowledgeEntry[]): LearningSyncResult {
    let syncedEntries = 0;
    let conflictsResolved = 0;

    for (const remote of remoteEntries) {
      const local = this.knowledgeReplication.get(remote.entryId);
      if (!local) {
        this.knowledgeReplication.store(remote);
        syncedEntries++;
      } else if (local.version < remote.version) {
        this.knowledgeReplication.store(remote);
        syncedEntries++;
        conflictsResolved++;
      }
    }

    const checksum = createHash('sha256')
      .update(JSON.stringify({ sessionId, syncedEntries, conflictsResolved }))
      .digest('hex');
    const result: LearningSyncResult = Object.freeze({
      sessionId,
      syncedEntries,
      conflictsResolved,
      checksum,
    });
    this.syncResults.push(result);
    return result;
  }

  getResults(): LearningSyncResult[] {
    return [...this.syncResults];
  }
}
