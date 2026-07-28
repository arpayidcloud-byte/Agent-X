/** Memory domain interfaces. */

export interface MemoryEntry {
  readonly key: string;
  readonly value: unknown;
  readonly nodeId: string;
  readonly timestamp: Date;
  readonly ttlMs: number;
  readonly checksum: string;
}

export interface MemorySnapshot {
  readonly snapshotId: string;
  readonly nodeId: string;
  readonly entries: ReadonlyArray<MemoryEntry>;
  readonly version: number;
  readonly timestamp: Date;
  readonly checksum: string;
}
