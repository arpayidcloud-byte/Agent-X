/**
 * @module multi-agent-reasoning/domain/consensus/ConsensusManager
 * @description Deterministic consensus mechanism.
 */

import type { ConsensusResult } from './interfaces.js';
import { ConsensusProtocolError } from './errors.js';

export interface ConsensusRound {
  id: string;
  proposalId: string;
  votes: Record<string, boolean>;
  status: 'PENDING' | 'RESOLVED';
}

export class ConsensusManager {
  private rounds = new Map<string, ConsensusRound>();
  private results: ConsensusResult[] = [];

  startRound(proposalId: string, agents: string[]): ConsensusRound {
    const round: ConsensusRound = {
      id: `round-${Date.now()}`,
      proposalId,
      votes: {},
      status: 'PENDING',
    };
    agents.forEach((a) => (round.votes[a] = false));
    this.rounds.set(round.id, round);
    return round;
  }

  castVote(roundId: string, agentId: string, vote: boolean): void {
    const round = this.rounds.get(roundId);
    if (!round)
      throw new ConsensusProtocolError(
        `Round not found: ${roundId}`,
        'ROUND_NOT_FOUND',
        'consensus-manager',
      );
    if (!(agentId in round.votes))
      throw new ConsensusProtocolError(
        `Agent not in round: ${agentId}`,
        'AGENT_NOT_IN_ROUND',
        'consensus-manager',
      );
    round.votes[agentId] = vote;
  }

  resolveRound(roundId: string): ConsensusResult {
    const round = this.rounds.get(roundId);
    if (!round)
      throw new ConsensusProtocolError(
        `Round not found: ${roundId}`,
        'ROUND_NOT_FOUND',
        'consensus-manager',
      );

    const approved =
      Object.values(round.votes).filter((v) => v).length > Object.values(round.votes).length / 2;
    round.status = 'RESOLVED';

    const result: ConsensusResult = {
      proposalId: round.proposalId,
      approved,
      votes: round.votes,
      timestamp: new Date(),
    };
    this.results.push(result);
    return result;
  }

  getRound(roundId: string): ConsensusRound | undefined {
    return this.rounds.get(roundId);
  }

  getResults(): ConsensusResult[] {
    return [...this.results];
  }
}
