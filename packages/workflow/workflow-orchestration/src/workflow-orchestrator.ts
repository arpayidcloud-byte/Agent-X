/**
 * @module workflow-orchestration/workflow-orchestrator
 * @description Master orchestrator for autonomous workflow execution.
 */

import { WorkflowStateMachine } from './workflow-state.js';
import { WorkflowSession } from './workflow-session.js';
import { WorkflowBuilder } from './workflow-builder.js';
import { WorkflowValidator } from './workflow-validator.js';
import { WorkflowGraphManager } from './workflow-graph.js';
import { WorkflowCheckpointManager } from './workflow-checkpoint.js';
import { WorkflowRecoveryManager } from './workflow-recovery.js';
import { WorkflowHistory } from './workflow-history.js';
import { WorkflowEngine } from './workflow-engine.js';
import { WorkflowMonitor } from './workflow-monitor.js';
import { MultiGoalManager } from './multi-goal-manager.js';
import { GoalConflictDetector } from './goal-conflict-detector.js';
import { ResourceAllocator } from './resource-allocator.js';
import { ResourceValidator } from './resource-validator.js';
import { ResourceBudgetManager } from './resource-budget.js';
import { ExecutionValidator } from './execution-validator.js';
import { ReplanningEngine } from './replanning-engine.js';
import { ProgressTracker } from './progress-tracker.js';
import { DecisionLog } from './decision-log.js';
import { WorkflowMetadataManager } from './workflow-metadata.js';
import { WorkflowDependencyManager } from './workflow-dependency.js';
import { WorkflowEventBus } from './events.js';
import { WorkflowHookManager } from './hooks.js';
import { WorkflowStatisticsCollector } from './workflow-statistics.js';

export class WorkflowOrchestrator {
  public stateMachine = new WorkflowStateMachine();
  public builder = new WorkflowBuilder();
  public validator = new WorkflowValidator();
  public graphManager = new WorkflowGraphManager();
  public checkpointManager = new WorkflowCheckpointManager();
  public recoveryManager = new WorkflowRecoveryManager(this.checkpointManager);
  public history = new WorkflowHistory();
  public engine = new WorkflowEngine();
  public monitor = new WorkflowMonitor();
  public goalManager = new MultiGoalManager();
  public conflictDetector = new GoalConflictDetector();
  public resourceAllocator = new ResourceAllocator();
  public resourceValidator = new ResourceValidator();
  public resourceBudget = new ResourceBudgetManager();
  public executionValidator = new ExecutionValidator();
  public replanningEngine = new ReplanningEngine();
  public progressTracker = new ProgressTracker();
  public decisionLog = new DecisionLog();
  public metadataManager = new WorkflowMetadataManager();
  public dependencyManager = new WorkflowDependencyManager();
  public events = new WorkflowEventBus();
  public hooks = new WorkflowHookManager();
  public statisticsCollector = new WorkflowStatisticsCollector();

  async executeWorkflow(
    goalId: string,
    subgoalCount: number,
  ): Promise<{ results: unknown[]; completed: boolean }> {
    const session = new WorkflowSession(`trace-${Date.now()}`);
    await this.hooks.runBeforeWorkflow(session.id);
    this.events.publish('workflow.created', { workflowId: session.id, goalId });
    this.statisticsCollector.recordWorkflow(false);

    try {
      this.stateMachine.transition('BUILDING');
      const graph = this.builder.build(goalId, subgoalCount);

      this.stateMachine.transition('VALIDATING');
      this.validator.validateGraph(graph);
      if (this.graphManager.detectCycles(graph.nodes, graph.edges)) {
        throw new Error('Cycle detected in workflow graph');
      }

      this.stateMachine.transition('READY');
      this.stateMachine.transition('SCHEDULING');
      this.decisionLog.log(session.id, 'graph_validated');
      this.events.publish('workflow.started', { workflowId: session.id, goalId });

      this.stateMachine.transition('DISPATCHING');
      await this.hooks.runBeforeDispatch(session.id);

      this.stateMachine.transition('EXECUTING');
      this.executionValidator.validatePlan(graph.nodes.length, 1000);

      const results = await this.engine.executeGraph(graph, (nodeId) => ({
        id: `task-${nodeId}`,
        goalId,
        workflowId: session.id,
        type: 'execution',
        payload: { nodeId },
        priority: 5,
        timeout: 5000,
        status: 'PENDING' as const,
        retries: 0,
        maxRetries: 3,
        timestamp: new Date(),
      }));

      this.stateMachine.transition('MONITORING');
      await this.hooks.runAfterDispatch(session.id, results);

      this.stateMachine.transition('COMPLETED');
      this.statisticsCollector.workflowsCompleted++;
      this.progressTracker.updateProgress(session.id, 100);
      this.history.record(session.id, 'complete', 'SUCCESS');
      this.events.publish('workflow.completed', { workflowId: session.id });

      await this.hooks.runAfterWorkflow(session.id, results);
      return { results, completed: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.statisticsCollector.recordFailure();
      this.events.publish('workflow.failed', { workflowId: session.id, error: message });
      throw err;
    }
  }

  pause(_workflowId: string): void {
    this.stateMachine.transition('PAUSED');
  }

  resume(_workflowId: string): void {
    this.stateMachine.transition('SCHEDULING');
  }

  cancel(_workflowId: string): void {
    this.stateMachine.transition('CANCELLED');
    this.statisticsCollector.goalsCancelled++;
  }

  recover(workflowId: string): boolean {
    return this.recoveryManager.recover(workflowId).restored;
  }
}
