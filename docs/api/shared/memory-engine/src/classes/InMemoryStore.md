[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/memory-engine/src](../README.md) / InMemoryStore

# Class: InMemoryStore

Defined in: [packages/shared/memory-engine/src/engine.ts:245](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L245)

## Implements

- [`IMemoryStore`](../interfaces/IMemoryStore.md)

## Constructors

### Constructor

> **new InMemoryStore**(): `InMemoryStore`

#### Returns

`InMemoryStore`

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/engine.ts:277](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L277)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`delete`](../interfaces/IMemoryStore.md#delete)

---

### find()

> **find**(`id`): `Promise`\<[`Memory`](../interfaces/Memory.md) \| `undefined`>>>>\>

Defined in: [packages/shared/memory-engine/src/engine.ts:252](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L252)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md) \| `undefined`\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`find`](../interfaces/IMemoryStore.md#find)

---

### list()

> **list**(): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:281](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L281)

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`list`](../interfaces/IMemoryStore.md#list)

---

### save()

> **save**(`memory`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/engine.ts:248](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L248)

#### Parameters

##### memory

[`Memory`](../interfaces/Memory.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`save`](../interfaces/IMemoryStore.md#save)

---

### search()

> **search**(`query`, `options?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:256](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L256)

#### Parameters

##### query

`string`

##### options?

[`MemorySearchOptions`](../interfaces/MemorySearchOptions.md)

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`search`](../interfaces/IMemoryStore.md#search)
