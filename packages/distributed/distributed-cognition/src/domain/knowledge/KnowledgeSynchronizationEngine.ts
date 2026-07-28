import type { KnowledgeEntry, SyncResult } from './interfaces.js';

export class KnowledgeSynchronizationEngine {
  private syncHistory: SyncResult[] = [];

  synchronize(localEntry: KnowledgeEntry, remoteEntry: KnowledgeEntry): SyncResult {
    if (localEntry.version > remoteEntry.version) {
      return Object.freeze({
        entryId: localEntry.entryId,
        status: 'SYNCED',
        winningVersion: localEntry.version,
      });
    }
    if (remoteEntry.version > localEntry.version) {
      return Object.freeze({
        entryId: localEntry.entryId,
        status: 'SYNCED',
        winningVersion: remoteEntry.version,
      });
    }
    const result: SyncResult = Object.freeze({
      entryId: localEntry.entryId,
      status: 'MERGED',
      winningVersion: localEntry.version,
    });
    this.syncHistory.push(result);
    return result;
  }

  detectConflict(localEntry: KnowledgeEntry, remoteEntry: KnowledgeEntry): boolean {
    return (
      localEntry.version === remoteEntry.version && localEntry.checksum !== remoteEntry.checksum
    );
  }

  merge(localEntry: KnowledgeEntry, remoteEntry: KnowledgeEntry): KnowledgeEntry {
    const winning = localEntry.version >= remoteEntry.version ? localEntry : remoteEntry;
    const result: SyncResult = Object.freeze({
      entryId: winning.entryId,
      status: 'MERGED',
      winningVersion: winning.version,
    });
    this.syncHistory.push(result);
    return winning;
  }

  getSyncHistory(): SyncResult[] {
    return [...this.syncHistory];
  }
}
