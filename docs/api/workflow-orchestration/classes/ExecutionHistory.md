[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / ExecutionHistory

# Class: ExecutionHistory

Defined in: [packages/workflow/workflow-orchestration/src/execution-history.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/execution-history.ts#L16)

## Constructors

### Constructor

> **new ExecutionHistory**(): `ExecutionHistory`

#### Returns

`ExecutionHistory`

## Methods

### getAll()

> **getAll**(): [`ExecutionHistoryRecord`](../interfaces/ExecutionHistoryRecord.md)[]

Defined in: [packages/workflow/workflow-orchestration/src/execution-history.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/execution-history.ts#L31)

#### Returns

[`ExecutionHistoryRecord`](../interfaces/ExecutionHistoryRecord.md)[]

---

### record()

> **record**(`workflowId`, `goalId`, `status`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/execution-history.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/execution-history.ts#L19)

#### Parameters

##### workflowId

`string`

##### goalId

`string`

##### status

`string`

#### Returns

`void`
