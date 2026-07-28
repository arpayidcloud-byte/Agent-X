[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowQueue

# Class: WorkflowQueue

Defined in: [packages/workflow/workflow-orchestration/src/workflow-queue.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-queue.ts#L8)

## Constructors

### Constructor

> **new WorkflowQueue**(): `WorkflowQueue`

#### Returns

`WorkflowQueue`

## Methods

### cancel()

> **cancel**(`taskId`): `boolean`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-queue.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-queue.ts#L24)

#### Parameters

##### taskId

`string`

#### Returns

`boolean`

---

### dequeue()

> **dequeue**(): [`WorkflowTask`](../interfaces/WorkflowTask.md) \| `undefined`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-queue.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-queue.ts#L16)

#### Returns

[`WorkflowTask`](../interfaces/WorkflowTask.md) \| `undefined`

---

### enqueue()

> **enqueue**(`task`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-queue.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-queue.ts#L11)

#### Parameters

##### task

[`WorkflowTask`](../interfaces/WorkflowTask.md)

#### Returns

`void`

---

### size()

> **size**(): `number`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-queue.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-queue.ts#L20)

#### Returns

`number`
