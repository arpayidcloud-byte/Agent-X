[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / WorkflowExecutor

# Class: WorkflowExecutor

Defined in: [packages/workflow/workflow-engine/src/executor.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/executor.ts#L17)

## Constructors

### Constructor

> **new WorkflowExecutor**(): `WorkflowExecutor`

Defined in: [packages/workflow/workflow-engine/src/executor.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/executor.ts#L24)

#### Returns

`WorkflowExecutor`

## Methods

### addHook()

> **addHook**(`hook`): `void`

Defined in: [packages/workflow/workflow-engine/src/executor.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/executor.ts#L31)

#### Parameters

##### hook

[`WorkflowHook`](../interfaces/WorkflowHook.md)

#### Returns

`void`

---

### executeWorkflow()

> **executeWorkflow**(`workflow`, `onStateChange`): `Promise`\<[`ExtendedWorkflowMetrics`](../interfaces/ExtendedWorkflowMetrics.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/executor.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/executor.ts#L35)

#### Parameters

##### workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

##### onStateChange

(`state`) => `void`

#### Returns

`Promise`\<[`ExtendedWorkflowMetrics`](../interfaces/ExtendedWorkflowMetrics.md)\>

---

### getTimeline()

> **getTimeline**(): [`ExecutionTimelineEntry`](../interfaces/ExecutionTimelineEntry.md)[]

Defined in: [packages/workflow/workflow-engine/src/executor.ts:192](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/executor.ts#L192)

#### Returns

[`ExecutionTimelineEntry`](../interfaces/ExecutionTimelineEntry.md)[]
