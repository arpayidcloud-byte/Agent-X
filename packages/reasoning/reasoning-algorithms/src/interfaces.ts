/**
 * @module reasoning-algorithms/interfaces
 * @description Interfaces for symbolic and deterministic reasoning models.
 */

export interface Rule {
  id: string;
  antecedents: string[];
  consequent: string;
  priority: number;
  weight: number;
}

export interface FactBase {
  facts: Set<string>;
}

export interface DecisionNode {
  id: string;
  label: string;
  type: 'decision' | 'chance' | 'leaf';
  branches: DecisionBranch[];
}

export interface DecisionBranch {
  condition: string;
  targetNodeId: string;
}

export interface DecisionTree {
  rootNodeId: string;
  nodes: Map<string, DecisionNode>;
}

export interface Hypothesis {
  id: string;
  label: string;
  evidence: string[];
  confidence: number;
}

export interface ReasoningMetrics {
  reasoningRuns: number;
  avgDepth: number;
  avgConfidence: number;
  graphNodes: number;
  graphEdges: number;
  decisionCount: number;
  conflictCount: number;
  rollbackCount: number;
}
