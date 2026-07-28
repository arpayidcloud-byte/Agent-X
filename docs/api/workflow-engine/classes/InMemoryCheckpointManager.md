[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / InMemoryCheckpointManager

# Class: InMemoryCheckpointManager

Defined in: [packages/workflow/workflow-engine/src/checkpoint.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/checkpoint.ts#L12)

In-memory checkpoint manager

## Implements

- [`ICheckpointManager`](../interfaces/ICheckpointManager.md)

## Constructors

### Constructor

> **new InMemoryCheckpointManager**(): `InMemoryCheckpointManager`

#### Returns

`InMemoryCheckpointManager`

## Methods

### delete()

> **delete**(`checkpointId`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/checkpoint.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/checkpoint.ts#L44)

#### Parameters

##### checkpointId

`string`

#### Returns

`Promise`\<`void`\>

#### Inherit Doc

#### Implementation of

[`ICheckpointManager`](../interfaces/ICheckpointManager.md).[`delete`](../interfaces/ICheckpointManager.md#delete)

---

### list()

> **list**(`workflowId`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)[]\>

Defined in: [packages/workflow/workflow-engine/src/checkpoint.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/checkpoint.ts#L39)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)[]\>

#### Inherit Doc

#### Implementation of

[`ICheckpointManager`](../interfaces/ICheckpointManager.md).[`list`](../interfaces/ICheckpointManager.md#list)

---

### load()

> **load**(`workflowId`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `undefined`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/checkpoint.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/checkpoint.ts#L32)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `undefined`\>

#### Inherit Doc

#### Implementation of

[`ICheckpointManager`](../interfaces/ICheckpointManager.md).[`load`](../interfaces/ICheckpointManager.md#load)

---

### save()

> **save**(`snapshot`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/checkpoint.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/checkpoint.ts#L16)

#### Parameters

##### snapshot

[`ExecutionSnapshot`](../interfaces/ExecutionSnapshot.md)

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)\>

#### Inherit Doc

#### Implementation of

[`ICheckpointManager`](../interfaces/ICheckpointManager.md).[`save`](../interfaces/ICheckpointManager.md#save)
