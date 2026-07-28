/**
 * @module multi-agent-reasoning/domain/consensus/interfaces
 * @description Consensus domain interfaces.
 */

export interface ConsensusResult {
  proposalId: string;
  approved: boolean;
  votes: Record<string, boolean>;
  timestamp: Date;
}
