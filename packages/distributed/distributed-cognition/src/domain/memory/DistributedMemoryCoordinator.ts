import { createHash } from 'crypto';
import type { MemoryEntry, MemorySnapshot } from './interfaces.js';

export class DistributedMemoryCoordinator {
  private entries = new Map<string, MemoryEntry>();

  set(key: string, value: unknown, nodeId: string, ttlMs: number = 600000): MemoryEntry {
    const checksum = createHash('sha256')
      .update(JSON.stringify({ key, value, nodeId }))
      .digest('hex');
    const entry: MemoryEntry = Object.freeze({
      key,
      value: typeof value === 'object' ? (JSON.parse(JSON.stringify(value)) as unknown) : value,
      nodeId,
      timestamp: new Date(),
      ttlMs,
      checksum,
    });
    this.entries.set(key, entry);
    return entry;
  }

  get(key: string): MemoryEntry | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.ttlMs >= 0 && Date.now() - entry.timestamp.getTime() >= entry.ttlMs) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  snapshot(nodeId: string): MemorySnapshot {
    const entries = Array.from(this.entries.values()).filter((e) => e.nodeId === nodeId);
    const checksum = createHash('sha256')
      .update(JSON.stringify(entries.map((e) => ({ key: e.key, version: e.checksum }))))
      .digest('hex');
    return Object.freeze({
      snapshotId: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      nodeId,
      entries,
      version: entries.length,
      timestamp: new Date(),
      checksum,
    });
  }

  restore(snapshot: MemorySnapshot): void {
    for (const entry of snapshot.entries) {
      this.entries.set(entry.key, entry);
    }
  }

  getAll(): MemoryEntry[] {
    return Array.from(this.entries.values());
  }
}
