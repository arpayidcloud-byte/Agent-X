[**agentx-workspace**](../README.md)

---

[agentx-workspace](../README.md) / goal-intelligence

# goal-intelligence

## Description

Goal Decomposition & Autonomous Decision Intelligence barrel exports.

## Classes

- [BudgetExceededError](classes/BudgetExceededError.md)
- [CriticalPathAnalyzer](classes/CriticalPathAnalyzer.md)
- [CycleDetectedError](classes/CycleDetectedError.md)
- [DecisionEngine](classes/DecisionEngine.md)
- [DecisionError](classes/DecisionError.md)
- [DecisionExplainer](classes/DecisionExplainer.md)
- [DecisionHistory](classes/DecisionHistory.md)
- [DecisionPolicyManager](classes/DecisionPolicyManager.md)
- [DecisionValidator](classes/DecisionValidator.md)
- [DecompositionError](classes/DecompositionError.md)
- [DependencyGraph](classes/DependencyGraph.md)
- [GoalConstraintValidator](classes/GoalConstraintValidator.md)
- [GoalCostEstimator](classes/GoalCostEstimator.md)
- [GoalDecomposer](classes/GoalDecomposer.md)
- [GoalEngine](classes/GoalEngine.md)
- [GoalError](classes/GoalError.md)
- [GoalEventBus](classes/GoalEventBus.md)
- [GoalHookManager](classes/GoalHookManager.md)
- [GoalIntegrityValidator](classes/GoalIntegrityValidator.md)
- [GoalIntelligenceMetricsCollector](classes/GoalIntelligenceMetricsCollector.md)
- [GoalParser](classes/GoalParser.md)
- [GoalProvenanceManager](classes/GoalProvenanceManager.md)
- [GoalSession](classes/GoalSession.md)
- [GoalStateMachine](classes/GoalStateMachine.md)
- [GoalStatisticsCollector](classes/GoalStatisticsCollector.md)
- [GoalValidationError](classes/GoalValidationError.md)
- [GoalValidator](classes/GoalValidator.md)
- [ObjectiveTree](classes/ObjectiveTree.md)
- [PlanningCheckpointManager](classes/PlanningCheckpointManager.md)
- [PlanningEngine](classes/PlanningEngine.md)
- [PlanningError](classes/PlanningError.md)
- [PlanningRecoveryManager](classes/PlanningRecoveryManager.md)
- [PlanningScorer](classes/PlanningScorer.md)
- [PlanningValidator](classes/PlanningValidator.md)
- [StrategyScorer](classes/StrategyScorer.md)
- [StrategySelector](classes/StrategySelector.md)
- [SubGoalManager](classes/SubGoalManager.md)
- [TaskOrderingEngine](classes/TaskOrderingEngine.md)
- [TaskPriorityEngine](classes/TaskPriorityEngine.md)

## Interfaces

- [CognitiveEvent](interfaces/CognitiveEvent.md)
- [CognitiveHook](interfaces/CognitiveHook.md)
- [CostEstimate](interfaces/CostEstimate.md)
- [CriticalPathResult](interfaces/CriticalPathResult.md)
- [DecisionChoice](interfaces/DecisionChoice.md)
- [DependencyEdge](interfaces/DependencyEdge.md)
- [Goal](interfaces/Goal.md)
- [GoalConstraints](interfaces/GoalConstraints.md)
- [GoalIntelligenceMetrics](interfaces/GoalIntelligenceMetrics.md)
- [GoalProvenance](interfaces/GoalProvenance.md)
- [GoalStatistics](interfaces/GoalStatistics.md)
- [ObjectiveNode](interfaces/ObjectiveNode.md)
- [PlanningBudget](interfaces/PlanningBudget.md)
- [PlanningCheckpoint](interfaces/PlanningCheckpoint.md)
- [PlanningPlan](interfaces/PlanningPlan.md)
- [PlanningScoreData](interfaces/PlanningScoreData.md)
- [PlanningStep](interfaces/PlanningStep.md)
- [StrategyOption](interfaces/StrategyOption.md)
- [SubGoal](interfaces/SubGoal.md)

## Type Aliases

- [DecisionPolicy](type-aliases/DecisionPolicy.md)
- [GoalState](type-aliases/GoalState.md)

## Variables

- [CRITICAL\_PATH\_GENERATED](variables/CRITICAL_PATH_GENERATED.md)
- [DECISION\_SELECTED](variables/DECISION_SELECTED.md)
- [GOAL\_CONSTRAINT\_VALIDATED](variables/GOAL_CONSTRAINT_VALIDATED.md)
- [GOAL\_COST\_ESTIMATED](variables/GOAL_COST_ESTIMATED.md)
- [GOAL\_CREATED](variables/GOAL_CREATED.md)
- [GOAL\_DECOMPOSED](variables/GOAL_DECOMPOSED.md)
- [GOAL\_PROVENANCE\_CREATED](variables/GOAL_PROVENANCE_CREATED.md)
- [GOAL\_VALIDATED](variables/GOAL_VALIDATED.md)
- [PLAN\_GENERATED](variables/PLAN_GENERATED.md)
- [PLAN\_INTEGRITY\_VALIDATED](variables/PLAN_INTEGRITY_VALIDATED.md)
- [PLAN\_SCORE\_CALCULATED](variables/PLAN_SCORE_CALCULATED.md)
- [PLANNING\_COMPLETED](variables/PLANNING_COMPLETED.md)
- [PLANNING\_FAILED](variables/PLANNING_FAILED.md)
- [PLANNING\_METADATA\_CREATED](variables/PLANNING_METADATA_CREATED.md)
- [PLANNING\_RECOVERED](variables/PLANNING_RECOVERED.md)
- [STRATEGY\_SELECTED](variables/STRATEGY_SELECTED.md)
