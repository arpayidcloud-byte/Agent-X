/** Consensus domain interfaces. */

export type ConsensusState = 'PROPOSED' | 'VOTING' | 'ACCEPTED' | 'REJECTED' | 'FAILED';

export interface DistributedProposal {
  readonly proposalId: string;
  readonly proposerNode: string;
  readonly content: Record<string, unknown>;
  readonly state: ConsensusState;
  readonly createdAt: Date;
  readonly checksum: string;
}

export interface ConsensusVote {
  readonly proposalId: string;
  readonly nodeId: string;
  readonly vote: boolean;
  readonly reason: string;
  readonly timestamp: Date;
}

export interface ConsensusResult {
  readonly proposalId: string;
  readonly accepted: boolean;
  readonly votes: ReadonlyMap<string, boolean>;
  readonly finalizedAt: Date;
}
