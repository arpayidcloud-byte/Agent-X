[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / MemoryLockProvider

# Class: MemoryLockProvider

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L14)

## Implements

- [`ILockProvider`](../interfaces/ILockProvider.md)

## Constructors

### Constructor

> **new MemoryLockProvider**(): `MemoryLockProvider`

#### Returns

`MemoryLockProvider`

## Methods

### acquire()

> **acquire**(`key`, `ttlMs`): `Promise`\<`string`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L45)

#### Parameters

##### key

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`acquire`](../interfaces/ILockProvider.md#acquire)

---

### expire()

> **expire**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L71)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`expire`](../interfaces/ILockProvider.md#expire)

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L28)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`getCapabilities`](../interfaces/ILockProvider.md#getcapabilities)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L19)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`getMetadata`](../interfaces/ILockProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L36)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`getMetrics`](../interfaces/ILockProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L32)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`healthCheck`](../interfaces/ILockProvider.md#healthcheck)

---

### isLocked()

> **isLocked**(`key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L75)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`isLocked`](../interfaces/ILockProvider.md#islocked)

---

### release()

> **release**(`key`, `lockId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L57)

#### Parameters

##### key

`string`

##### lockId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`release`](../interfaces/ILockProvider.md#release)

---

### renew()

> **renew**(`key`, `lockId`, `ttlMs`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-lock.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-lock.ts#L64)

#### Parameters

##### key

`string`

##### lockId

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`renew`](../interfaces/ILockProvider.md#renew)
