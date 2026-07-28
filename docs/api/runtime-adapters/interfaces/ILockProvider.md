[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / ILockProvider

# Interface: ILockProvider

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L73)

## Extends

- [`IProvider`](IProvider.md)

## Methods

### acquire()

> **acquire**(`key`, `ttlMs`): `Promise`\<`string`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L74)

#### Parameters

##### key

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`string`\>

---

### expire()

> **expire**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L77)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L57)

#### Returns

[`ProviderCapabilities`](ProviderCapabilities.md)

#### Inherited from

[`IProvider`](IProvider.md).[`getCapabilities`](IProvider.md#getcapabilities)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L56)

#### Returns

[`ProviderMetadata`](ProviderMetadata.md)

#### Inherited from

[`IProvider`](IProvider.md).[`getMetadata`](IProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L59)

#### Returns

[`ProviderMetrics`](ProviderMetrics.md)

#### Inherited from

[`IProvider`](IProvider.md).[`getMetrics`](IProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L58)

#### Returns

`Promise`\<[`ProviderHealth`](ProviderHealth.md)\>

#### Inherited from

[`IProvider`](IProvider.md).[`healthCheck`](IProvider.md#healthcheck)

---

### isLocked()

> **isLocked**(`key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L78)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

---

### release()

> **release**(`key`, `lockId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L75)

#### Parameters

##### key

`string`

##### lockId

`string`

#### Returns

`Promise`\<`void`\>

---

### renew()

> **renew**(`key`, `lockId`, `ttlMs`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L76)

#### Parameters

##### key

`string`

##### lockId

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>
