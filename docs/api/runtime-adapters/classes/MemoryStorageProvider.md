[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / MemoryStorageProvider

# Class: MemoryStorageProvider

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L14)

## Implements

- [`IStorageProvider`](../interfaces/IStorageProvider.md)

## Constructors

### Constructor

> **new MemoryStorageProvider**(): `MemoryStorageProvider`

#### Returns

`MemoryStorageProvider`

## Methods

### delete()

> **delete**(`bucket`, `key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L57)

#### Parameters

##### bucket

`string`

##### key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`delete`](../interfaces/IStorageProvider.md#delete)

---

### exists()

> **exists**(`bucket`, `key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L69)

#### Parameters

##### bucket

`string`

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`exists`](../interfaces/IStorageProvider.md#exists)

---

### get()

> **get**(`bucket`, `key`): `Promise`\<`string` \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L53)

#### Parameters

##### bucket

`string`

##### key

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`get`](../interfaces/IStorageProvider.md#get)

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L28)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`getCapabilities`](../interfaces/IStorageProvider.md#getcapabilities)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L19)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`getMetadata`](../interfaces/IStorageProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L36)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`getMetrics`](../interfaces/IStorageProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L32)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`healthCheck`](../interfaces/IStorageProvider.md#healthcheck)

---

### list()

> **list**(`bucket`, `prefix?`): `Promise`\<`string`[]\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L61)

#### Parameters

##### bucket

`string`

##### prefix?

`string`

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`list`](../interfaces/IStorageProvider.md#list)

---

### put()

> **put**(`bucket`, `key`, `value`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L45)

#### Parameters

##### bucket

`string`

##### key

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`put`](../interfaces/IStorageProvider.md#put)

---

### transaction()

> **transaction**(`operations`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-storage.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-storage.ts#L73)

#### Parameters

##### operations

() => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IStorageProvider`](../interfaces/IStorageProvider.md).[`transaction`](../interfaces/IStorageProvider.md#transaction)
