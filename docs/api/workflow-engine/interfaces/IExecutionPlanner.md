[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / IExecutionPlanner

# Interface: IExecutionPlanner

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:163](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L163)

## Description

Execution planner interface

## Methods

### calculateCriticalPath()

> **calculateCriticalPath**(`workflow`): `string`[]

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L165)

#### Parameters

##### workflow

[`WorkflowDefinition`](WorkflowDefinition.md)

#### Returns

`string`[]

---

### estimateParallelism()

> **estimateParallelism**(`workflow`): `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:166](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L166)

#### Parameters

##### workflow

[`WorkflowDefinition`](WorkflowDefinition.md)

#### Returns

`number`

---

### plan()

> **plan**(`workflow`): [`ExecutionPlan`](ExecutionPlan.md)

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:164](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L164)

#### Parameters

##### workflow

[`WorkflowDefinition`](WorkflowDefinition.md)

#### Returns

[`ExecutionPlan`](ExecutionPlan.md)
