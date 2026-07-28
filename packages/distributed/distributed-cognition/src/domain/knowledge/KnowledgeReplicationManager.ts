import type { KnowledgeEntry } from './interfaces.js';

export interface KnowledgeReplica {
  readonly entryId: string;
  readonly nodeId: string;
  readonly version: number;
  readonly checksum: string;
  readonly syncedAt: Date;
}

export class KnowledgeReplicationManager {
  private entries = new Map<string, KnowledgeEntry>();
  private replicas = new Map<string, KnowledgeReplica[]>();

  store(entry: KnowledgeEntry): KnowledgeEntry {
    this.entries.set(entry.entryId, Object.freeze({ ...entry }));
    return entry;
  }

  get(entryId: string): KnowledgeEntry | undefined {
    return this.entries.get(entryId);
  }

  getByKey(key: string): KnowledgeEntry | undefined {
    for (const entry of this.entries.values() as Iterable<KnowledgeEntry>) {
      if (entry.key === key) return entry;
    }
    return undefined;
  }

  replicate(entryId: string, nodeId: string): KnowledgeReplica {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error(`Entry not found: ${entryId}`);
    const existing = this.replicas.get(entryId) || [];
    const idx = existing.findIndex((r) => r.nodeId === nodeId);
    const replica: KnowledgeReplica = Object.freeze({
      entryId,
      nodeId,
      version: entry.version,
      checksum: entry.checksum,
      syncedAt: new Date(),
    });
    if (idx >= 0) {
      existing[idx] = replica;
    } else {
      existing.push(replica);
    }
    this.replicas.set(entryId, existing);
    return replica;
  }

  getReplicas(entryId: string): KnowledgeReplica[] {
    return [...(this.replicas.get(entryId) || [])];
  }

  getAll(): KnowledgeEntry[] {
    return Array.from(this.entries.values());
  }
}
