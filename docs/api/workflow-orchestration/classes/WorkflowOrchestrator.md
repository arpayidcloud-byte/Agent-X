[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowOrchestrator

# Class: WorkflowOrchestrator

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L31)

## Constructors

### Constructor

> **new WorkflowOrchestrator**(): `WorkflowOrchestrator`

#### Returns

`WorkflowOrchestrator`

## Properties

### builder

> **builder**: [`WorkflowBuilder`](WorkflowBuilder.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L33)

---

### checkpointManager

> **checkpointManager**: [`WorkflowCheckpointManager`](WorkflowCheckpointManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L36)

---

### conflictDetector

> **conflictDetector**: [`GoalConflictDetector`](GoalConflictDetector.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L42)

---

### decisionLog

> **decisionLog**: [`DecisionLog`](DecisionLog.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L49)

---

### dependencyManager

> **dependencyManager**: [`WorkflowDependencyManager`](WorkflowDependencyManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L51)

---

### engine

> **engine**: [`WorkflowEngine`](WorkflowEngine.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L39)

---

### events

> **events**: [`WorkflowEventBus`](WorkflowEventBus.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L52)

---

### executionValidator

> **executionValidator**: [`ExecutionValidator`](ExecutionValidator.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L46)

---

### goalManager

> **goalManager**: [`MultiGoalManager`](MultiGoalManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L41)

---

### graphManager

> **graphManager**: [`WorkflowGraphManager`](WorkflowGraphManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L35)

---

### history

> **history**: [`WorkflowHistory`](WorkflowHistory.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L38)

---

### hooks

> **hooks**: [`WorkflowHookManager`](WorkflowHookManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L53)

---

### metadataManager

> **metadataManager**: [`WorkflowMetadataManager`](WorkflowMetadataManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L50)

---

### monitor

> **monitor**: [`WorkflowMonitor`](WorkflowMonitor.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L40)

---

### progressTracker

> **progressTracker**: [`ProgressTracker`](ProgressTracker.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L48)

---

### recoveryManager

> **recoveryManager**: [`WorkflowRecoveryManager`](WorkflowRecoveryManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L37)

---

### replanningEngine

> **replanningEngine**: [`ReplanningEngine`](ReplanningEngine.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L47)

---

### resourceAllocator

> **resourceAllocator**: [`ResourceAllocator`](ResourceAllocator.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L43)

---

### resourceBudget

> **resourceBudget**: [`ResourceBudgetManager`](ResourceBudgetManager.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L45)

---

### resourceValidator

> **resourceValidator**: [`ResourceValidator`](ResourceValidator.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L44)

---

### stateMachine

> **stateMachine**: [`WorkflowStateMachine`](WorkflowStateMachine.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L32)

---

### statisticsCollector

> **statisticsCollector**: [`WorkflowStatisticsCollector`](WorkflowStatisticsCollector.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L54)

---

### validator

> **validator**: [`WorkflowValidator`](WorkflowValidator.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L34)

## Methods

### cancel()

> **cancel**(`_workflowId`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L127)

#### Parameters

##### \_workflowId

`string`

#### Returns

`void`

---

### executeWorkflow()

> **executeWorkflow**(`goalId`, `subgoalCount`): `Promise`\<\{ `completed`: `boolean`; `results`: `unknown`[]; \}\>

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L56)

#### Parameters

##### goalId

`string`

##### subgoalCount

`number`

#### Returns

`Promise`\<\{ `completed`: `boolean`; `results`: `unknown`[]; \}\>

---

### pause()

> **pause**(`_workflowId`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L119)

#### Parameters

##### \_workflowId

`string`

#### Returns

`void`

---

### recover()

> **recover**(`workflowId`): `boolean`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L132)

#### Parameters

##### workflowId

`string`

#### Returns

`boolean`

---

### resume()

> **resume**(`_workflowId`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-orchestrator.ts#L123)

#### Parameters

##### \_workflowId

`string`

#### Returns

`void`
