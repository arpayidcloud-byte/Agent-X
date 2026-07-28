[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/memory-engine/src](../README.md) / IMemoryStore

# Interface: IMemoryStore

Defined in: [packages/shared/memory-engine/src/interfaces.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L40)

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L44)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### find()

> **find**(`id`): `Promise`\<[`Memory`](Memory.md) \| `undefined`>>>>\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L42)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`Memory`](Memory.md) \| `undefined`\>

---

### list()

> **list**(): `Promise`\<[`Memory`](Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L45)

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

---

### save()

> **save**(`memory`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L41)

#### Parameters

##### memory

[`Memory`](Memory.md)

#### Returns

`Promise`\<`void`\>

---

### search()

> **search**(`query`, `options?`): `Promise`\<[`Memory`](Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L43)

#### Parameters

##### query

`string`

##### options?

[`MemorySearchOptions`](MemorySearchOptions.md)

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>
