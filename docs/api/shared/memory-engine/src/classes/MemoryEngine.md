[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/memory-engine/src](../README.md) / MemoryEngine

# Class: MemoryEngine

Defined in: [packages/shared/memory-engine/src/engine.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L18)

## Implements

- [`IMemoryEngine`](../interfaces/IMemoryEngine.md)

## Constructors

### Constructor

> **new MemoryEngine**(`memoryStore`, `eventBus`, `maxCacheSize?`): `MemoryEngine`

Defined in: [packages/shared/memory-engine/src/engine.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L31)

#### Parameters

##### memoryStore

[`IMemoryStore`](../interfaces/IMemoryStore.md)

##### eventBus

`IEventBus`

##### maxCacheSize?

`number` = `100`

#### Returns

`MemoryEngine`

## Methods

### compact()

> **compact**(): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/engine.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L89)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryEngine`](../interfaces/IMemoryEngine.md).[`compact`](../interfaces/IMemoryEngine.md#compact)

---

### forget()

> **forget**(`memoryId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/engine.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L79)

#### Parameters

##### memoryId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryEngine`](../interfaces/IMemoryEngine.md).[`forget`](../interfaces/IMemoryEngine.md#forget)

---

### getLongTermMemories()

> **getLongTermMemories**(`minImportance?`, `limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L114)

#### Parameters

##### minImportance?

`number` = `7`

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### getMetrics()

> **getMetrics**(): [`MemoryMetrics`](../interfaces/MemoryMetrics.md)

Defined in: [packages/shared/memory-engine/src/engine.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L103)

#### Returns

[`MemoryMetrics`](../interfaces/MemoryMetrics.md)

#### Implementation of

[`IMemoryEngine`](../interfaces/IMemoryEngine.md).[`getMetrics`](../interfaces/IMemoryEngine.md#getmetrics)

---

### getShortTermMemories()

> **getShortTermMemories**(`limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L107)

#### Parameters

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### retrieve()

> **retrieve**(`query`, `options?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L63)

#### Parameters

##### query

`string`

##### options?

[`MemorySearchOptions`](../interfaces/MemorySearchOptions.md)

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

#### Implementation of

[`IMemoryEngine`](../interfaces/IMemoryEngine.md).[`retrieve`](../interfaces/IMemoryEngine.md#retrieve)

---

### retrieveByImportance()

> **retrieveByImportance**(`minImportance?`, `limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L137)

#### Parameters

##### minImportance?

`number`

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### retrieveByRecency()

> **retrieveByRecency**(`limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:130](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L130)

#### Parameters

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### retrieveByRelevance()

> **retrieveByRelevance**(`query`, `limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:145](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L145)

#### Parameters

##### query

`string`

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### retrieveBySession()

> **retrieveBySession**(`sessionId`, `limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:161](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L161)

#### Parameters

##### sessionId

`string`

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### retrieveByTask()

> **retrieveByTask**(`taskId`, `limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L165)

#### Parameters

##### taskId

`string`

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### retrieveByType()

> **retrieveByType**(`type`, `limit?`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/engine.ts:118](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L118)

#### Parameters

##### type

[`MemoryType`](../type-aliases/MemoryType.md)

##### limit?

`number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

---

### store()

> **store**(`data`): `Promise`\<[`Memory`](../interfaces/Memory.md)>>>>\>

Defined in: [packages/shared/memory-engine/src/engine.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/engine.ts#L39)

#### Parameters

##### data

`Partial`\<[`Memory`](../interfaces/Memory.md)\>

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)\>

#### Implementation of

[`IMemoryEngine`](../interfaces/IMemoryEngine.md).[`store`](../interfaces/IMemoryEngine.md#store)
