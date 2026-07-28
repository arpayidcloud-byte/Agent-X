/**
 * @module multi-agent-reasoning/infrastructure/registry/AgentSelectionEngine
 * @description Selects optimal agent for task delegation.
 */

import type { AgentDirectoryEntry } from '../../domain/collaboration/interfaces.js';

export class AgentSelectionEngine {
  selectBestCandidate(
    entries: AgentDirectoryEntry[],
    requiredCapabilities: string[],
  ): AgentDirectoryEntry | null {
    const candidates = entries.filter((e) =>
      requiredCapabilities.every((cap) => e.capabilities.includes(cap)),
    );
    if (candidates.length === 0) return null;

    let best: AgentDirectoryEntry = candidates[0] as AgentDirectoryEntry;
    for (let i = 1; i < candidates.length; i++) {
      const c: AgentDirectoryEntry = candidates[i] as AgentDirectoryEntry;
      const bestFree = best.availableSlots - best.currentLoad;
      const cFree = c.availableSlots - c.currentLoad;
      if (cFree > bestFree || (cFree === bestFree && c.priority > best.priority)) {
        best = c;
      }
    }
    return best;
  }
}
