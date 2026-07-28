[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ICheckpointStore

# Interface: ICheckpointStore

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L16)

## Methods

### delete()

> **delete**(`checkpointId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L20)

#### Parameters

##### checkpointId

`string`

#### Returns

`Promise`\<`void`\>

---

### list()

> **list**(`workflowId`): `Promise`\<[`Checkpoint`](Checkpoint.md)[]\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L19)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md)[]\>

---

### load()

> **load**(`workflowId`): `Promise`\<[`Checkpoint`](Checkpoint.md) \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L18)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md) \| `undefined`\>

---

### save()

> **save**(`checkpoint`): `Promise`\<[`Checkpoint`](Checkpoint.md)>>>>\>

Defined in: [packages/runtime/runtime/src/checkpoint-store.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/checkpoint-store.ts#L17)

#### Parameters

##### checkpoint

[`Checkpoint`](Checkpoint.md)

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md)\>
