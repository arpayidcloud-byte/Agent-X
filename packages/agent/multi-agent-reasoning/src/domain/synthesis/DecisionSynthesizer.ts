/**
 * @module multi-agent-reasoning/domain/synthesis/DecisionSynthesizer
 * @description Combines multiple agent decisions.
 */

export interface DecisionInput {
  agentId: string;
  decision: string;
  confidence: number;
}

export interface DecisionOutput {
  synthesizedDecision: string;
  inputs: DecisionInput[];
  averageConfidence: number;
}

export class DecisionSynthesizer {
  synthesize(decisions: DecisionInput[]): DecisionOutput {
    if (decisions.length === 0) {
      return { synthesizedDecision: '', inputs: [], averageConfidence: 0 };
    }

    const avgConf = decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
    const synthesized = decisions.map((d) => d.decision).join(' ');

    return {
      synthesizedDecision: synthesized,
      inputs: decisions.map((d) => ({ ...d })),
      averageConfidence: Math.round(avgConf * 100) / 100,
    };
  }

  resolveConflicts(decisions: DecisionInput[]): DecisionInput[] {
    const sorted = [...decisions].sort((a, b) => b.confidence - a.confidence);
    return sorted;
  }
}
