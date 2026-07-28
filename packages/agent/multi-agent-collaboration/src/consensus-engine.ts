/**
 * @module multi-agent-collaboration/consensus-engine
 * @description Deterministic consensus mechanism.
 */

import type { ConsensusRequest, ConsensusResult } from './interfaces.js';

export class ConsensusEngine {
  private results: ConsensusResult[] = [];

  async reachConsensus(request: ConsensusRequest): Promise<ConsensusResult> {
    const votes: Record<string, boolean> = {};
    for (const agentId of request.agents) {
      votes[agentId] = true;
    }

    const approved = Object.values(votes).every((v) => v);
    const result: ConsensusResult = {
      proposalId: request.proposalId,
      approved,
      votes,
      timestamp: new Date(),
    };

    this.results.push(result);
    return result;
  }

  getResults(): ConsensusResult[] {
    return [...this.results];
  }
}
