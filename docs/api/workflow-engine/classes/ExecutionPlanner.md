[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / ExecutionPlanner

# Class: ExecutionPlanner

Defined in: [packages/workflow/workflow-engine/src/planner.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/planner.ts#L10)

## Constructors

### Constructor

> **new ExecutionPlanner**(): `ExecutionPlanner`

#### Returns

`ExecutionPlanner`

## Methods

### calculateCriticalPath()

> **calculateCriticalPath**(`workflow`): `string`[]

Defined in: [packages/workflow/workflow-engine/src/planner.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/planner.ts#L57)

#### Parameters

##### workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

`string`[]

---

### estimateParallelism()

> **estimateParallelism**(`workflow`): `number`

Defined in: [packages/workflow/workflow-engine/src/planner.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/planner.ts#L62)

#### Parameters

##### workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

`number`

---

### plan()

> **plan**(`workflow`): [`ExecutionPlan`](../interfaces/ExecutionPlan.md)

Defined in: [packages/workflow/workflow-engine/src/planner.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/planner.ts#L11)

#### Parameters

##### workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)
