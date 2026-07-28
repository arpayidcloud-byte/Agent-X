[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / ICheckpointManager

# Interface: ICheckpointManager

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:187](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L187)

## Description

Checkpoint manager

## Methods

### delete()

> **delete**(`checkpointId`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:191](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L191)

#### Parameters

##### checkpointId

`string`

#### Returns

`Promise`\<`void`\>

---

### list()

> **list**(`workflowId`): `Promise`\<[`Checkpoint`](Checkpoint.md)[]\>

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:190](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L190)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md)[]\>

---

### load()

> **load**(`workflowId`): `Promise`\<[`Checkpoint`](Checkpoint.md) \| `undefined`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:189](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L189)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md) \| `undefined`\>

---

### save()

> **save**(`snapshot`): `Promise`\<[`Checkpoint`](Checkpoint.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:188](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L188)

#### Parameters

##### snapshot

[`ExecutionSnapshot`](ExecutionSnapshot.md)

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md)\>
