import { createHash } from 'crypto';

export interface ConflictEntry {
  readonly conflictId: string;
  readonly resourceKey: string;
  readonly nodeA: string;
  readonly nodeB: string;
  readonly valueA: unknown;
  readonly valueB: unknown;
  readonly resolution: 'NODE_A_WINS' | 'NODE_B_WINS' | 'MERGED' | 'REJECTED';
  readonly timestamp: Date;
  readonly checksum: string;
}

export class DistributedConflictResolver {
  private conflicts: ConflictEntry[] = [];

  detect(
    _resourceKey: string,
    _nodeA: string,
    valueA: unknown,
    _nodeB: string,
    valueB: unknown,
  ): boolean {
    return JSON.stringify(valueA) !== JSON.stringify(valueB);
  }

  resolve(
    resourceKey: string,
    nodeA: string,
    valueA: unknown,
    nodeB: string,
    valueB: unknown,
    resolution: ConflictEntry['resolution'],
  ): ConflictEntry {
    const conflictId = `dc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ resourceKey, nodeA, nodeB, valueA, valueB, resolution }))
      .digest('hex');
    const entry: ConflictEntry = Object.freeze({
      conflictId,
      resourceKey,
      nodeA,
      nodeB,
      valueA,
      valueB,
      resolution,
      timestamp: new Date(),
      checksum,
    });
    this.conflicts.push(entry);
    return entry;
  }

  getConflicts(): ConflictEntry[] {
    return [...this.conflicts];
  }

  getConflictsByNode(nodeId: string): ConflictEntry[] {
    return this.conflicts.filter((c) => c.nodeA === nodeId || c.nodeB === nodeId);
  }
}
