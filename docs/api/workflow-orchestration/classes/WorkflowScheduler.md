[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowScheduler

# Class: WorkflowScheduler

Defined in: [packages/workflow/workflow-orchestration/src/workflow-scheduler.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-scheduler.ts#L8)

## Constructors

### Constructor

> **new WorkflowScheduler**(): `WorkflowScheduler`

#### Returns

`WorkflowScheduler`

## Methods

### dequeue()

> **dequeue**(): [`WorkflowTask`](../interfaces/WorkflowTask.md) \| `undefined`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-scheduler.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-scheduler.ts#L16)

#### Returns

[`WorkflowTask`](../interfaces/WorkflowTask.md) \| `undefined`

---

### getQueueSize()

> **getQueueSize**(): `number`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-scheduler.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-scheduler.ts#L20)

#### Returns

`number`

---

### schedule()

> **schedule**(`task`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-scheduler.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-scheduler.ts#L11)

#### Parameters

##### task

[`WorkflowTask`](../interfaces/WorkflowTask.md)

#### Returns

`void`
