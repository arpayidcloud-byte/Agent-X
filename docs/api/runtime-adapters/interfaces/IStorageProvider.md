[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / IStorageProvider

# Interface: IStorageProvider

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L81)

## Extends

- [`IProvider`](IProvider.md)

## Methods

### delete()

> **delete**(`bucket`, `key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L84)

#### Parameters

##### bucket

`string`

##### key

`string`

#### Returns

`Promise`\<`void`\>

---

### exists()

> **exists**(`bucket`, `key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L86)

#### Parameters

##### bucket

`string`

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

---

### get()

> **get**(`bucket`, `key`): `Promise`\<`string` \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L83)

#### Parameters

##### bucket

`string`

##### key

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

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

### list()

> **list**(`bucket`, `prefix?`): `Promise`\<`string`[]\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L85)

#### Parameters

##### bucket

`string`

##### prefix?

`string`

#### Returns

`Promise`\<`string`[]\>

---

### put()

> **put**(`bucket`, `key`, `value`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L82)

#### Parameters

##### bucket

`string`

##### key

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>

---

### transaction()

> **transaction**(`operations`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:87](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L87)

#### Parameters

##### operations

() => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>
