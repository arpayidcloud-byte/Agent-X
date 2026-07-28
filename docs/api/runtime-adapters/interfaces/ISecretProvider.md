[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / ISecretProvider

# Interface: ISecretProvider

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L99)

## Extends

- [`IProvider`](IProvider.md)

## Methods

### deleteSecret()

> **deleteSecret**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:102](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L102)

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

### getSecret()

> **getSecret**(`key`): `Promise`\<`string` \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L100)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L58)

#### Returns

`Promise`\<[`ProviderHealth`](ProviderHealth.md)\>

#### Inherited from

[`IProvider`](IProvider.md).[`healthCheck`](IProvider.md#healthcheck)

---

### listSecrets()

> **listSecrets**(): `Promise`\<`string`[]\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L103)

#### Returns

`Promise`\<`string`[]\>

---

### putSecret()

> **putSecret**(`key`, `value`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L101)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>

---

### rotateSecret()

> **rotateSecret**(`key`, `newValue`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L104)

#### Parameters

##### key

`string`

##### newValue

`string`

#### Returns

`Promise`\<`void`\>
