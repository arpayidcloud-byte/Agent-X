/** Knowledge domain interfaces. */

export interface KnowledgeEntry {
  readonly entryId: string;
  readonly key: string;
  readonly value: Record<string, unknown>;
  readonly sourceNode: string;
  readonly version: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export interface KnowledgeReplica {
  readonly entryId: string;
  readonly nodeId: string;
  readonly version: number;
  readonly checksum: string;
  readonly syncedAt: Date;
}

export interface SyncResult {
  readonly entryId: string;
  readonly status: 'SYNCED' | 'CONFLICT' | 'MERGED';
  readonly winningVersion: number;
}
