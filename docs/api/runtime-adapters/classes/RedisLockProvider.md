[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / RedisLockProvider

# Class: RedisLockProvider

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L10)

## Implements

- [`ILockProvider`](../interfaces/ILockProvider.md)

## Constructors

### Constructor

> **new RedisLockProvider**(`redisUrl?`): `RedisLockProvider`

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L16)

#### Parameters

##### redisUrl?

`string` = `'redis://localhost:6379'`

#### Returns

`RedisLockProvider`

## Methods

### acquire()

> **acquire**(`key`, `ttlMs`): `Promise`\<`string`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L51)

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

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L91)

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

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L29)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`getCapabilities`](../interfaces/ILockProvider.md#getcapabilities)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L20)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`getMetadata`](../interfaces/ILockProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L42)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`getMetrics`](../interfaces/ILockProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L33)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`ILockProvider`](../interfaces/ILockProvider.md).[`healthCheck`](../interfaces/ILockProvider.md#healthcheck)

---

### isLocked()

> **isLocked**(`key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L95)

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

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L67)

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

Defined in: [packages/runtime/runtime-adapters/src/redis/redis-lock.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/redis/redis-lock.ts#L79)

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
