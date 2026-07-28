/**
 * @module reasoning-algorithms/reasoning-engine
 * @description Master orchestrator for all symbolic reasoning algorithms.
 */

import type { Rule, DecisionTree, DecisionNode, ReasoningMetrics } from './interfaces.js';
import { ForwardChaining } from './forward-chaining.js';
import { BackwardChaining } from './backward-chaining.js';
import { DecisionTreeEngine } from './decision-tree.js';
import { ReasoningGraphEngine } from './reasoning-graph-engine.js';
import { HypothesisEngine } from './hypothesis-engine.js';
import { ConfidenceCalculator } from './confidence-calculator.js';
import { ConflictResolver } from './conflict-resolver.js';
import { ExplanationEngine } from './explanation-engine.js';
import { ReasoningValidator } from './reasoning-validator.js';
import { CheckpointManager } from './checkpoint.js';
import { RecoveryManager } from './recovery.js';
import { ReasoningHookManager } from './hooks.js';
import { ReasoningEventBus } from './events.js';
import { IntegrityError } from './errors.js';

export class ReasoningEngine {
  public forwardChaining = new ForwardChaining();
  public backwardChaining = new BackwardChaining();
  public decisionTree = new DecisionTreeEngine();
  public graphEngine = new ReasoningGraphEngine();
  public hypothesisEngine = new HypothesisEngine();
  public confidenceCalculator = new ConfidenceCalculator();
  public conflictResolver = new ConflictResolver();
  public explanationEngine = new ExplanationEngine();
  public validator = new ReasoningValidator();
  public checkpointManager = new CheckpointManager();
  public recoveryManager = new RecoveryManager(this.checkpointManager);
  public hooks = new ReasoningHookManager();
  public events = new ReasoningEventBus();

  private metrics: ReasoningMetrics = {
    reasoningRuns: 0,
    avgDepth: 0,
    avgConfidence: 0,
    graphNodes: 0,
    graphEdges: 0,
    decisionCount: 0,
    conflictCount: 0,
    rollbackCount: 0,
  };

  async execute(
    sessionId: string,
    goal: string,
    facts: Set<string>,
    rules: Rule[],
  ): Promise<Set<string>> {
    await this.hooks.runBeforeReasoning(sessionId);
    this.events.publish('reasoning.started', { sessionId, goal });
    this.validator.validateRules(rules);

    try {
      const result = this.forwardChaining.execute(facts, rules);
      const depth = result.size;

      this.metrics.reasoningRuns++;
      this.metrics.avgDepth = (this.metrics.avgDepth + depth) / this.metrics.reasoningRuns;

      await this.hooks.runAfterReasoning(sessionId, result);
      this.events.publish('reasoning.completed', { sessionId, goal });
      this.checkpointManager.save(sessionId, { facts: Array.from(result), goal });

      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.events.publish('reasoning.failed', { sessionId, error: message });
      throw err;
    }
  }

  async executeGoalDriven(
    sessionId: string,
    goal: string,
    facts: Set<string>,
    rules: Rule[],
  ): Promise<boolean> {
    await this.hooks.runBeforeReasoning(sessionId);
    this.validator.validateRules(rules);

    try {
      const result = this.backwardChaining.execute(goal, facts, rules);
      this.metrics.reasoningRuns++;

      if (!result) {
        this.events.publish('reasoning.failed', { sessionId, error: 'Goal unreachable' });
      } else {
        this.events.publish('reasoning.completed', { sessionId, goal });
        this.checkpointManager.save(sessionId, { facts: Array.from(facts), goal });
      }

      await this.hooks.runAfterReasoning(sessionId, result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.events.publish('reasoning.failed', { sessionId, error: message });
      throw err;
    }
  }

  validate(tree: DecisionTree): void {
    if (tree.nodes.size === 0) {
      throw new IntegrityError('Empty decision tree', 'reasoning-engine');
    }

    for (const node of tree.nodes.values() as Iterable<DecisionNode>) {
      if (node.type === 'decision' && node.branches.length === 0) {
        throw new IntegrityError(`Decision node ${node.id} has no branches`, 'reasoning-engine');
      }

      for (const branch of node.branches) {
        if (!tree.nodes.has(branch.targetNodeId)) {
          throw new IntegrityError(`Node ${node.id} points to missing target`, 'reasoning-engine');
        }
      }
    }
  }

  async checkpoint(sessionId: string, snapshot: Record<string, unknown>): Promise<void> {
    this.checkpointManager.save(sessionId, snapshot);
    await this.hooks.runOnRollback(sessionId); // simulate checkpoint/hook
  }

  async recover(sessionId: string): Promise<Record<string, unknown>> {
    const state = this.recoveryManager.recover(sessionId);
    await this.hooks.runOnRecover(sessionId);
    return state || {};
  }

  explain(trace: string[], evidence: string[]): string {
    return this.explanationEngine.explain(trace, [], evidence);
  }
}
