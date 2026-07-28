export type ConsensusStrategy = 'majority' | 'weighted' | 'reviewerOverride';

export class ConsensusEngine {
  constructor(private strategy: ConsensusStrategy) {}

  public computeConsensus(
    votes: Array<{ agentRole: string; value: string; weight?: number }>,
  ): string {
    if (votes.length === 0) return '';

    if (this.strategy === 'reviewerOverride') {
      const reviewerVote = votes.find((v) => v.agentRole === 'reviewer');
      if (reviewerVote) return reviewerVote.value;
    }

    const voteCounts = new Map<string, number>();

    for (const vote of votes) {
      const weight = this.strategy === 'weighted' ? (vote.weight ?? 1) : 1;
      const current = voteCounts.get(vote.value) || 0;
      voteCounts.set(vote.value, current + weight);
    }

    let bestValue = '';
    let maxVotes = -1;

    // Deterministic tie breaker based on string localeCompare
    const sortedKeys = Array.from(voteCounts.keys()).sort();

    for (const key of sortedKeys) {
      const count = voteCounts.get(key) ?? 0;
      if (count > maxVotes) {
        maxVotes = count;
        bestValue = key;
      }
    }

    return bestValue;
  }
}
