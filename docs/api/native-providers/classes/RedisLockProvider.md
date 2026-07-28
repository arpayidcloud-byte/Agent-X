[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [native-providers](../README.md) / RedisLockProvider

# ~~Class: RedisLockProvider~~

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L16)

## Implements

- `ILockProvider`
- [`INativeProvider`](../interfaces/INativeProvider.md)

## Constructors

### Constructor

> **new RedisLockProvider**(): `RedisLockProvider`

#### Returns

`RedisLockProvider`

## Properties

### ~~id~~

> **id**: `string` = `'redis-lock'`

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L17)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`id`](../interfaces/INativeProvider.md#id)

---

### ~~name~~

> **name**: `string` = `'Redis Lock Provider'`

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L18)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`name`](../interfaces/INativeProvider.md#name)

## Methods

### ~~acquire()~~

> **acquire**(`key`, `_ttlMs`): `Promise`\<`string`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L67)

#### Parameters

##### key

`string`

##### \_ttlMs

`number`

#### Returns

`Promise`\<`string`\>

#### Implementation of

`ILockProvider.acquire`

---

### ~~connect()~~

> **connect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L30)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`connect`](../interfaces/INativeProvider.md#connect)

---

### ~~disconnect()~~

> **disconnect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L34)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`disconnect`](../interfaces/INativeProvider.md#disconnect)

---

### ~~expire()~~

> **expire**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L83)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ILockProvider.expire`

---

### ~~getCapabilities()~~

> **getCapabilities**(): `ProviderCapabilities`

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L50)

#### Returns

`ProviderCapabilities`

#### Implementation of

`ILockProvider.getCapabilities`

---

### ~~getHealth()~~

> **getHealth**(): `Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L42)

#### Returns

`Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`getHealth`](../interfaces/INativeProvider.md#gethealth)

---

### ~~getMetadata()~~

> **getMetadata**(): `ProviderMetadata`

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L46)

#### Returns

`ProviderMetadata`

#### Implementation of

`ILockProvider.getMetadata`

---

### ~~getMetrics()~~

> **getMetrics**(): `ProviderMetrics`

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L63)

#### Returns

`ProviderMetrics`

#### Implementation of

`ILockProvider.getMetrics`

---

### ~~healthCheck()~~

> **healthCheck**(): `Promise`\<`ProviderHealth`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L54)

#### Returns

`Promise`\<`ProviderHealth`\>

#### Implementation of

`ILockProvider.healthCheck`

---

### ~~initialize()~~

> **initialize**(`config`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L23)

#### Parameters

##### config

[`IConfigurationProvider`](../interfaces/IConfigurationProvider.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`initialize`](../interfaces/INativeProvider.md#initialize)

---

### ~~isConnected()~~

> **isConnected**(): `boolean`

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L38)

#### Returns

`boolean`

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`isConnected`](../interfaces/INativeProvider.md#isconnected)

---

### ~~isLocked()~~

> **isLocked**(`key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:87](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L87)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`ILockProvider.isLocked`

---

### ~~release()~~

> **release**(`key`, `lockId`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L75)

#### Parameters

##### key

`string`

##### lockId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ILockProvider.release`

---

### ~~renew()~~

> **renew**(`_key`, `_lockId`, `_ttlMs`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/redis-lock.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/redis-lock.ts#L81)

#### Parameters

##### \_key

`string`

##### \_lockId

`string`

##### \_ttlMs

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ILockProvider.renew`
