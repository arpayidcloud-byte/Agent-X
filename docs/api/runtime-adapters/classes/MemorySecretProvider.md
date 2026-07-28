[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / MemorySecretProvider

# Class: MemorySecretProvider

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L14)

## Implements

- [`ISecretProvider`](../interfaces/ISecretProvider.md)

## Constructors

### Constructor

> **new MemorySecretProvider**(): `MemorySecretProvider`

#### Returns

`MemorySecretProvider`

## Methods

### deleteSecret()

> **deleteSecret**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L57)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`deleteSecret`](../interfaces/ISecretProvider.md#deletesecret)

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L28)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`getCapabilities`](../interfaces/ISecretProvider.md#getcapabilities)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L19)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`getMetadata`](../interfaces/ISecretProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L36)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`getMetrics`](../interfaces/ISecretProvider.md#getmetrics)

---

### getSecret()

> **getSecret**(`key`): `Promise`\<`string` \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L45)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`getSecret`](../interfaces/ISecretProvider.md#getsecret)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L32)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`healthCheck`](../interfaces/ISecretProvider.md#healthcheck)

---

### listSecrets()

> **listSecrets**(): `Promise`\<`string`[]\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L61)

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`listSecrets`](../interfaces/ISecretProvider.md#listsecrets)

---

### putSecret()

> **putSecret**(`key`, `value`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L51)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`putSecret`](../interfaces/ISecretProvider.md#putsecret)

---

### rotateSecret()

> **rotateSecret**(`key`, `newValue`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-secret.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-secret.ts#L65)

#### Parameters

##### key

`string`

##### newValue

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISecretProvider`](../interfaces/ISecretProvider.md).[`rotateSecret`](../interfaces/ISecretProvider.md#rotatesecret)
