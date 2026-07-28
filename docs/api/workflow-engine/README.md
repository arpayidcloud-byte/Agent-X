[**agentx-workspace**](../README.md)

---

[agentx-workspace](../README.md) / workflow-engine

# workflow-engine

## Description

Workflow Engine for DAG execution, approval gates, and dependency scheduling.
Extended with hardening components for production readiness.

## Classes

- [CriticalPathAnalyzer](classes/CriticalPathAnalyzer.md)
- [CycleDetectedError](classes/CycleDetectedError.md)
- [DeadlockDetectedError](classes/DeadlockDetectedError.md)
- [DefaultWorkflowPolicy](classes/DefaultWorkflowPolicy.md)
- [ExecutionPlanner](classes/ExecutionPlanner.md)
- [ExecutionReplay](classes/ExecutionReplay.md)
- [ExecutionTimeline](classes/ExecutionTimeline.md)
- [InMemoryCheckpointManager](classes/InMemoryCheckpointManager.md)
- [JsonWorkflowSerializer](classes/JsonWorkflowSerializer.md)
- [NodeExecutor](classes/NodeExecutor.md)
- [NodeNotFoundError](classes/NodeNotFoundError.md)
- [ResumeError](classes/ResumeError.md)
- [RetryCoordinator](classes/RetryCoordinator.md)
- [SnapshotError](classes/SnapshotError.md)
- [WorkflowCompilationError](classes/WorkflowCompilationError.md)
- [WorkflowEngine](classes/WorkflowEngine.md)
- [WorkflowError](classes/WorkflowError.md)
- [WorkflowExecutionError](classes/WorkflowExecutionError.md)
- [WorkflowExecutor](classes/WorkflowExecutor.md)
- [WorkflowHookManager](classes/WorkflowHookManager.md)
- [WorkflowStateMachine](classes/WorkflowStateMachine.md)
- [WorkflowTimeoutError](classes/WorkflowTimeoutError.md)
- [WorkflowValidationError](classes/WorkflowValidationError.md)

## Interfaces

- [AgentNodeConfig](interfaces/AgentNodeConfig.md)
- [ApprovalNodeConfig](interfaces/ApprovalNodeConfig.md)
- [BackoffPolicy](interfaces/BackoffPolicy.md)
- [Checkpoint](interfaces/Checkpoint.md)
- [ConditionalNodeConfig](interfaces/ConditionalNodeConfig.md)
- [CriticalPathAnalysis](interfaces/CriticalPathAnalysis.md)
- [ExecutionBatch](interfaces/ExecutionBatch.md)
- [ExecutionHistoryEntry](interfaces/ExecutionHistoryEntry.md)
- [ExecutionPlan](interfaces/ExecutionPlan.md)
- [ExecutionSnapshot](interfaces/ExecutionSnapshot.md)
- [ExecutionTimelineEntry](interfaces/ExecutionTimelineEntry.md)
- [ExtendedWorkflowMetrics](interfaces/ExtendedWorkflowMetrics.md)
- [ICheckpointManager](interfaces/ICheckpointManager.md)
- [ICriticalPathAnalyzer](interfaces/ICriticalPathAnalyzer.md)
- [IExecutionPlanner](interfaces/IExecutionPlanner.md)
- [IExecutionReplay](interfaces/IExecutionReplay.md)
- [INodeExecutor](interfaces/INodeExecutor.md)
- [IRetryCoordinator](interfaces/IRetryCoordinator.md)
- [IWorkflowSerializer](interfaces/IWorkflowSerializer.md)
- [LoopNodeConfig](interfaces/LoopNodeConfig.md)
- [ParallelNodeConfig](interfaces/ParallelNodeConfig.md)
- [ReplayHistory](interfaces/ReplayHistory.md)
- [ReplaySnapshot](interfaces/ReplaySnapshot.md)
- [ResourceAllocationPlan](interfaces/ResourceAllocationPlan.md)
- [RetryBudget](interfaces/RetryBudget.md)
- [RetryDecision](interfaces/RetryDecision.md)
- [RetryNodeConfig](interfaces/RetryNodeConfig.md)
- [RetryPolicy](interfaces/RetryPolicy.md)
- [TaskNodeConfig](interfaces/TaskNodeConfig.md)
- [ToolNodeConfig](interfaces/ToolNodeConfig.md)
- [VersionedExecutionSnapshot](interfaces/VersionedExecutionSnapshot.md)
- [WorkflowDefinition](interfaces/WorkflowDefinition.md)
- [WorkflowEdge](interfaces/WorkflowEdge.md)
- [WorkflowHook](interfaces/WorkflowHook.md)
- [WorkflowMetadata](interfaces/WorkflowMetadata.md)
- [WorkflowMetrics](interfaces/WorkflowMetrics.md)
- [WorkflowNode](interfaces/WorkflowNode.md)
- [WorkflowPolicy](interfaces/WorkflowPolicy.md)

## Type Aliases

- [EdgeType](type-aliases/EdgeType.md)
- [NodeConfig](type-aliases/NodeConfig.md)
- [NodeState](type-aliases/NodeState.md)
- [NodeType](type-aliases/NodeType.md)
- [ReplayMode](type-aliases/ReplayMode.md)
- [WorkflowState](type-aliases/WorkflowState.md)

## Functions

- [compileWorkflow](functions/compileWorkflow.md)
- [computeChecksum](functions/computeChecksum.md)
- [createEdge](functions/createEdge.md)
- [createNode](functions/createNode.md)
- [createSnapshot](functions/createSnapshot.md)
- [createVersionedSnapshot](functions/createVersionedSnapshot.md)
- [createWorkflow](functions/createWorkflow.md)
- [detectCycle](functions/detectCycle.md)
- [findReadyNodes](functions/findReadyNodes.md)
- [getPredecessors](functions/getPredecessors.md)
- [getSuccessors](functions/getSuccessors.md)
- [isNodeReady](functions/isNodeReady.md)
- [restoreFromSnapshot](functions/restoreFromSnapshot.md)
- [topologicalSort](functions/topologicalSort.md)
- [validateEdges](functions/validateEdges.md)
- [validateNodeConfig](functions/validateNodeConfig.md)
- [validateSnapshotChecksum](functions/validateSnapshotChecksum.md)
- [validateWorkflow](functions/validateWorkflow.md)
