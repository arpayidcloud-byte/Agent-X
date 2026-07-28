[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/memory-engine/src](../README.md) / IMemoryEngine

# Interface: IMemoryEngine

Defined in: [packages/shared/memory-engine/src/interfaces.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L6)

## Methods

### compact()

> **compact**(): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L10)

#### Returns

`Promise`\<`void`\>

---

### forget()

> **forget**(`memoryId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L9)

#### Parameters

##### memoryId

`string`

#### Returns

`Promise`\<`void`\>

---

### getMetrics()

> **getMetrics**(): [`MemoryMetrics`](MemoryMetrics.md)

Defined in: [packages/shared/memory-engine/src/interfaces.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L11)

#### Returns

[`MemoryMetrics`](MemoryMetrics.md)

---

### retrieve()

> **retrieve**(`query`, `options?`): `Promise`\<[`Memory`](Memory.md)[]\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L8)

#### Parameters

##### query

`string`

##### options?

[`MemorySearchOptions`](MemorySearchOptions.md)

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

---

### store()

> **store**(`memory`): `Promise`\<[`Memory`](Memory.md)>>>>\>

Defined in: [packages/shared/memory-engine/src/interfaces.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/memory-engine/src/interfaces.ts#L7)

#### Parameters

##### memory

`Partial`\<[`Memory`](Memory.md)\>

#### Returns

`Promise`\<[`Memory`](Memory.md)\>
