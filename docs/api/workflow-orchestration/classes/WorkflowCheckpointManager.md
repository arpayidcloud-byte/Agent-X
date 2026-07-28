[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowCheckpointManager

# Class: WorkflowCheckpointManager

Defined in: [packages/workflow/workflow-orchestration/src/workflow-checkpoint.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-checkpoint.ts#L9)

## Constructors

### Constructor

> **new WorkflowCheckpointManager**(): `WorkflowCheckpointManager`

#### Returns

`WorkflowCheckpointManager`

## Methods

### load()

> **load**(`workflowId`): [`WorkflowCheckpoint`](../interfaces/WorkflowCheckpoint.md) \| `undefined`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-checkpoint.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-checkpoint.ts#L25)

#### Parameters

##### workflowId

`string`

#### Returns

[`WorkflowCheckpoint`](../interfaces/WorkflowCheckpoint.md) \| `undefined`

---

### save()

> **save**(`workflowId`, `taskStates`): [`WorkflowCheckpoint`](../interfaces/WorkflowCheckpoint.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-checkpoint.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-checkpoint.ts#L12)

#### Parameters

##### workflowId

`string`

##### taskStates

`Record`\<`string`, `string`\>

#### Returns

[`WorkflowCheckpoint`](../interfaces/WorkflowCheckpoint.md)
