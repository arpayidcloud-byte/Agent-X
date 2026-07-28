import type { DistributedProposal, ConsensusVote, ConsensusResult } from './interfaces.js';
import { InvariantViolationError } from '../shared/errors.js';
import { createHash } from 'crypto';

/**
 * Invariant: propose() always initializes both this.proposals
 * and this.votes for the same proposalId.
 */
export class DistributedConsensusEngine {
  private proposals = new Map<string, DistributedProposal>();
  private votes = new Map<string, ConsensusVote[]>();
  private results: ConsensusResult[] = [];

  /**
   * Invariant: If proposal exists, votes[proposalId] is always initialized.
   */
  private getVotesInvariant(proposalId: string): ConsensusVote[] {
    const votes = this.votes.get(proposalId);
    if (!votes) {
      throw new InvariantViolationError(
        `Invariant violated: votes not initialized for proposal ${proposalId}`,
        'VOTES_NOT_INITIALIZED',
        'DistributedConsensusEngine',
      );
    }
    return votes;
  }

  propose(proposerNode: string, content: Record<string, unknown>): DistributedProposal {
    const proposalId = `dp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ proposalId, proposerNode, content }))
      .digest('hex');
    const proposal: DistributedProposal = Object.freeze({
      proposalId,
      proposerNode,
      content: { ...content },
      state: 'PROPOSED',
      createdAt: new Date(),
      checksum,
    });
    this.proposals.set(proposalId, proposal);
    this.votes.set(proposalId, []);
    return proposal;
  }

  castVote(proposalId: string, nodeId: string, vote: boolean, reason: string): ConsensusVote {
    if (!this.proposals.has(proposalId)) throw new Error(`Proposal not found: ${proposalId}`);
    const existingVotes = this.getVotesInvariant(proposalId);
    if (existingVotes.some((v) => v.nodeId === nodeId))
      throw new Error(`Node already voted: ${nodeId}`);
    const voteEntry: ConsensusVote = Object.freeze({
      proposalId,
      nodeId,
      vote,
      reason,
      timestamp: new Date(),
    });
    existingVotes.push(voteEntry);
    return voteEntry;
  }

  resolve(proposalId: string, quorum: number): ConsensusResult {
    if (!this.proposals.has(proposalId)) throw new Error(`Proposal not found: ${proposalId}`);
    const allVotes = this.getVotesInvariant(proposalId);
    if (allVotes.length < quorum) throw new Error(`Quorum not met: ${allVotes.length}/${quorum}`);
    const voteMap = new Map<string, boolean>();
    allVotes.forEach((v) => voteMap.set(v.nodeId, v.vote));
    const accepted = allVotes.filter((v) => v.vote).length > allVotes.length / 2;
    const result: ConsensusResult = Object.freeze({
      proposalId,
      accepted,
      votes: voteMap,
      finalizedAt: new Date(),
    });
    this.results.push(result);
    return result;
  }

  getProposal(proposalId: string): DistributedProposal | undefined {
    return this.proposals.get(proposalId);
  }

  getVotes(proposalId: string): ConsensusVote[] {
    return [...this.getVotesInvariant(proposalId)];
  }

  getResults(): ConsensusResult[] {
    return [...this.results];
  }
}
