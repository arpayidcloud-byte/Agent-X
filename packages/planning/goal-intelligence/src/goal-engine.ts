/**
 * @module goal-intelligence/goal-engine
 * @description Master orchestrator for goal decomposition and planning.
 */

import type { PlanningPlan, PlanningBudget } from './interfaces.js';
import { GoalStateMachine } from './goal-state.js';
import { GoalSession } from './goal-session.js';
import { GoalParser } from './goal-parser.js';
import { GoalValidator } from './goal-validator.js';
import { GoalDecomposer } from './goal-decomposer.js';
import { SubGoalManager } from './subgoal-manager.js';
import { ObjectiveTree } from './objective-tree.js';
import { DependencyGraph } from './dependency-graph.js';
import { TaskOrderingEngine } from './task-ordering.js';
import { TaskPriorityEngine } from './task-priority.js';
import { PlanningEngine } from './planning-engine.js';
import { PlanningValidator } from './planning-validator.js';
import { PlanningCheckpointManager } from './planning-checkpoint.js';
import { PlanningRecoveryManager } from './planning-recovery.js';
import { GoalEventBus } from './events.js';
import { GoalHookManager } from './hooks.js';
import { GoalIntelligenceMetricsCollector } from './metrics.js';

export class GoalEngine {
  public stateMachine = new GoalStateMachine();
  public parser = new GoalParser();
  public validator = new GoalValidator();
  public decomposer = new GoalDecomposer();
  public subgoalManager = new SubGoalManager();
  public objectiveTree = new ObjectiveTree();
  public dependencyGraph = new DependencyGraph();
  public taskOrdering = new TaskOrderingEngine();
  public taskPriority = new TaskPriorityEngine();
  public planningEngine = new PlanningEngine();
  public planningValidator = new PlanningValidator();
  public checkpointManager = new PlanningCheckpointManager();
  public recoveryManager = new PlanningRecoveryManager(this.checkpointManager);
  public events = new GoalEventBus();
  public hooks = new GoalHookManager();
  public metrics = new GoalIntelligenceMetricsCollector();

  async processGoal(
    title: string,
    description: string,
    objectiveCount: number = 2,
    _policy: 'safe' | 'balanced' | 'aggressive' = 'balanced',
  ): Promise<{ plan: PlanningPlan; subgoals: number }> {
    const goal = this.parser.parse(title, description);
    this.validator.validate(goal);

    const session = new GoalSession(`trace-${Date.now()}`, goal);
    await this.hooks.runBeforeGoal(session.goal.id);
    this.events.publish('goal.created', { goalId: session.goal.id });

    try {
      this.stateMachine.transition('VALIDATING');
      this.events.publish('goal.validated', { goalId: session.goal.id });

      this.stateMachine.transition('DECOMPOSING');
      const subgoals = this.decomposer.decompose(goal, objectiveCount);
      for (const sg of subgoals) {
        this.subgoalManager.register(sg);
      }
      this.metrics.recordSubgoals(subgoals.length, objectiveCount, 1);
      this.events.publish('goal.decomposed', { goalId: session.goal.id, count: subgoals.length });

      this.stateMachine.transition('GRAPH_BUILDING');
      for (const sg of subgoals) {
        for (const dep of sg.dependencies) {
          this.dependencyGraph.addEdge(dep, sg.id, 1);
        }
      }
      if (this.dependencyGraph.detectCycle()) {
        throw new Error('Cycle detected in objective dependencies');
      }

      this.stateMachine.transition('PLANNING');
      await this.hooks.runBeforePlanning(session.goal.id);
      const ordered = this.taskOrdering.order(subgoals);
      const orderedWithPriority = ordered.map((sg) => ({
        ...sg,
        priority: this.taskPriority.assignPriority(sg, sg.priority),
      }));
      const budget: PlanningBudget = { tokens: 1000, timeMs: 10000, cost: 5 };
      const plan = this.planningEngine.generatePlan(session.goal.id, orderedWithPriority, budget);

      this.stateMachine.transition('DECISION');
      this.metrics.recordDecision(85);
      this.events.publish('decision.selected', { goalId: session.goal.id });

      this.stateMachine.transition('VALIDATION');
      this.planningValidator.validatePlan(plan, this.dependencyGraph.getEdges());
      this.planningValidator.validateBudget(plan, { tokens: 2000, timeMs: 20000, cost: 10 });

      this.stateMachine.transition('CHECKPOINTING');
      this.checkpointManager.save(session.goal.id, plan);

      this.stateMachine.transition('READY');
      this.stateMachine.transition('COMPLETED');

      this.metrics.recordGoal(true);
      this.metrics.recordPlanning(Date.now() - session.startedAt.getTime());
      session.markComplete();

      await this.hooks.runAfterGoal(session.goal.id, plan);
      await this.hooks.runAfterPlanning(session.goal.id, plan.id);
      this.events.publish('planning.completed', { goalId: session.goal.id, planId: plan.id });

      return { plan, subgoals: subgoals.length };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.metrics.recordFailure();
      this.events.publish('planning.failed', { goalId: session.goal.id, error: message });
      throw err;
    }
  }

  recoverPlanning(goalId: string): { restored: boolean; goalId: string } {
    return this.recoveryManager.recover(goalId);
  }
}
