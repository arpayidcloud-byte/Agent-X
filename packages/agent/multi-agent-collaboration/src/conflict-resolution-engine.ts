/**
 * @module multi-agent-collaboration/conflict-resolution-engine
 * @description Deterministic conflict resolution.
 */

import type { ConflictResolution } from './interfaces.js';
import { createHash } from 'crypto';

export class ConflictResolutionEngine {
  private resolutions: ConflictResolution[] = [];

  resolve(agentIds: string[], conflictType: string, resolution: string): ConflictResolution {
    const payload = JSON.stringify({ agentIds, conflictType, resolution });
    const res: ConflictResolution = {
      id: `conflict-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      agents: agentIds,
      conflictType,
      resolution,
      timestamp: new Date(),
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.resolutions.push(res);
    return res;
  }

  getResolutions(): ConflictResolution[] {
    return [...this.resolutions];
  }
}
