import { createHash } from 'node:crypto';
import type { AuditEntry, AuditLog } from './interfaces.js';

export class HashChainedAuditLog implements AuditLog {
  private entries: AuditEntry[] = [];

  constructor(private genesisHash = '0'.repeat(64)) {}

  append(actor: string, action: string, resource: string): AuditEntry {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const previousHash =
      this.entries.length > 0 ? this.entries[this.entries.length - 1]!.hash : this.genesisHash;

    const data = `${id}|${actor}|${action}|${resource}|${previousHash}`;
    const hash = createHash('sha256').update(data).digest('hex');

    const entry: AuditEntry = {
      id,
      timestamp: new Date(),
      actor,
      action,
      resource,
      previousHash,
      hash,
    };

    this.entries.push(entry);
    return entry;
  }

  verify(): boolean {
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i]!;
      const expectedPrevHash = i === 0 ? this.genesisHash : this.entries[i - 1]!.hash;

      if (entry.previousHash !== expectedPrevHash) {
        return false;
      }

      const data = `${entry.id}|${entry.actor}|${entry.action}|${entry.resource}|${entry.previousHash}`;
      const expectedHash = createHash('sha256').update(data).digest('hex');

      if (entry.hash !== expectedHash) {
        return false;
      }
    }

    return true;
  }

  getEntries(limit: number): AuditEntry[] {
    return this.entries.slice(-limit);
  }

  getSize(): number {
    return this.entries.length;
  }
}
