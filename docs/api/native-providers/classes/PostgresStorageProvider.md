[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [native-providers](../README.md) / PostgresStorageProvider

# ~~Class: PostgresStorageProvider~~

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L16)

## Implements

- `IStorageProvider`
- [`INativeProvider`](../interfaces/INativeProvider.md)

## Constructors

### Constructor

> **new PostgresStorageProvider**(): `PostgresStorageProvider`

#### Returns

`PostgresStorageProvider`

## Properties

### ~~id~~

> **id**: `string` = `'postgres-storage'`

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L17)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`id`](../interfaces/INativeProvider.md#id)

---

### ~~name~~

> **name**: `string` = `'PostgreSQL Storage Provider'`

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L18)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`name`](../interfaces/INativeProvider.md#name)

## Methods

### ~~connect()~~

> **connect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L29)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`connect`](../interfaces/INativeProvider.md#connect)

---

### ~~delete()~~

> **delete**(`_bucket`, `_key`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L70)

#### Parameters

##### \_bucket

`string`

##### \_key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IStorageProvider.delete`

---

### ~~disconnect()~~

> **disconnect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L33)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`disconnect`](../interfaces/INativeProvider.md#disconnect)

---

### ~~exists()~~

> **exists**(`_bucket`, `_key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L74)

#### Parameters

##### \_bucket

`string`

##### \_key

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`IStorageProvider.exists`

---

### ~~get()~~

> **get**(`_bucket`, `_key`): `Promise`\<`string` \| `undefined`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L67)

#### Parameters

##### \_bucket

`string`

##### \_key

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

#### Implementation of

`IStorageProvider.get`

---

### ~~getCapabilities()~~

> **getCapabilities**(): `ProviderCapabilities`

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L49)

#### Returns

`ProviderCapabilities`

#### Implementation of

`IStorageProvider.getCapabilities`

---

### ~~getHealth()~~

> **getHealth**(): `Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L41)

#### Returns

`Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`getHealth`](../interfaces/INativeProvider.md#gethealth)

---

### ~~getMetadata()~~

> **getMetadata**(): `ProviderMetadata`

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L45)

#### Returns

`ProviderMetadata`

#### Implementation of

`IStorageProvider.getMetadata`

---

### ~~getMetrics()~~

> **getMetrics**(): `ProviderMetrics`

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L62)

#### Returns

`ProviderMetrics`

#### Implementation of

`IStorageProvider.getMetrics`

---

### ~~healthCheck()~~

> **healthCheck**(): `Promise`\<`ProviderHealth`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L53)

#### Returns

`Promise`\<`ProviderHealth`\>

#### Implementation of

`IStorageProvider.healthCheck`

---

### ~~initialize()~~

> **initialize**(`config`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L22)

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

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L37)

#### Returns

`boolean`

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`isConnected`](../interfaces/INativeProvider.md#isconnected)

---

### ~~list()~~

> **list**(`_bucket`, `_prefix?`): `Promise`\<`string`[]\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L71)

#### Parameters

##### \_bucket

`string`

##### \_prefix?

`string`

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

`IStorageProvider.list`

---

### ~~put()~~

> **put**(`_bucket`, `_key`, `_value`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L66)

#### Parameters

##### \_bucket

`string`

##### \_key

`string`

##### \_value

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IStorageProvider.put`

---

### ~~transaction()~~

> **transaction**(`operations`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/postgres-storage.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/postgres-storage.ts#L78)

#### Parameters

##### operations

() => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IStorageProvider.transaction`
