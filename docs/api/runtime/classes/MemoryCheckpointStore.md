[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / MemoryCheckpointStore

# Class: MemoryCheckpointStore

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L23)

## Implements

- [`ICheckpointStore`](../interfaces/ICheckpointStore.md)

## Constructors

### Constructor

> **new MemoryCheckpointStore**(): `MemoryCheckpointStore`

#### Returns

`MemoryCheckpointStore`

## Methods

### delete()

> **delete**(`checkpointId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L43)

#### Parameters

##### checkpointId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`delete`](../interfaces/ICheckpointStore.md#delete)

---

### list()

> **list**(`workflowId`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)[]\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L39)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)[]\>

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`list`](../interfaces/ICheckpointStore.md#list)

---

### load()

> **load**(`workflowId`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L33)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `undefined`\>

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`load`](../interfaces/ICheckpointStore.md#load)

---

### save()

> **save**(`checkpoint`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)>>>>\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L26)

#### Parameters

##### checkpoint

[`Checkpoint`](../interfaces/Checkpoint.md)

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md)\>

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`save`](../interfaces/ICheckpointStore.md#save)
