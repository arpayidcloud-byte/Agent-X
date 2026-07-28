[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/memory-engine/src](../README.md) / PrismaMemoryStore

# Class: PrismaMemoryStore

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L16)

## Implements

- [`IMemoryStore`](../interfaces/IMemoryStore.md)

## Constructors

### Constructor

> **new PrismaMemoryStore**(`prisma?`): `PrismaMemoryStore`

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L19)

#### Parameters

##### prisma?

`any`

#### Returns

`PrismaMemoryStore`

## Methods

### clear()

> **clear**(): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L93)

#### Returns

`Promise`\<`void`\>

---

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L79)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`delete`](../interfaces/IMemoryStore.md#delete)

---

### disconnect()

> **disconnect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L97)

#### Returns

`Promise`\<`void`\>

---

### find()

> **find**(`id`): `Promise`\<[`Memory`](../interfaces/Memory.md) \| `undefined`>>>>\>

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L37)

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

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L85)

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`list`](../interfaces/IMemoryStore.md#list)

---

### save()

> **save**(`memory`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L23)

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

Defined in: [packages/shared/memory-engine/src/prisma-store.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/prisma-store.ts#L47)

#### Parameters

##### query

`string`

##### options?

[`MemorySearchOptions`](../interfaces/MemorySearchOptions.md)

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

#### Implementation of

[`IMemoryStore`](../interfaces/IMemoryStore.md).[`search`](../interfaces/IMemoryStore.md#search)
