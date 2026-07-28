[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowHistory

# Class: WorkflowHistory

Defined in: [packages/workflow/workflow-orchestration/src/workflow-history.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-history.ts#L16)

## Constructors

### Constructor

> **new WorkflowHistory**(): `WorkflowHistory`

#### Returns

`WorkflowHistory`

## Methods

### getAll()

> **getAll**(): [`ExecutionRecord`](../interfaces/ExecutionRecord.md)[]

Defined in: [packages/workflow/workflow-orchestration/src/workflow-history.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-history.ts#L31)

#### Returns

[`ExecutionRecord`](../interfaces/ExecutionRecord.md)[]

---

### record()

> **record**(`workflowId`, `taskId`, `status`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-history.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-history.ts#L19)

#### Parameters

##### workflowId

`string`

##### taskId

`string`

##### status

`string`

#### Returns

`void`
