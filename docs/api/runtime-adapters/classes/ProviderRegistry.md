[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / ProviderRegistry

# Class: ProviderRegistry

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L10)

## Constructors

### Constructor

> **new ProviderRegistry**(): `ProviderRegistry`

#### Returns

`ProviderRegistry`

## Methods

### healthCheck()

> **healthCheck**(): `Promise`\<`boolean`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L60)

#### Returns

`Promise`\<`boolean`\>

---

### listProviders()

> **listProviders**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)[]

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L56)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)[]

---

### registerProvider()

> **registerProvider**(`id`, `provider`): `void`

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L14)

#### Parameters

##### id

`string`

##### provider

[`IProvider`](../interfaces/IProvider.md)

#### Returns

`void`

---

### resolve()

> **resolve**\<`T`>>>>\>(`id`): `T`

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L22)

#### Type Parameters

##### T

`T` _extends_ [`IProvider`](../interfaces/IProvider.md)

#### Parameters

##### id

`string`

#### Returns

`T`

---

### resolveByCapability()

> **resolveByCapability**\<`T`>>>>\>(`requiredCapabilities`): `T`[]

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L40)

#### Type Parameters

##### T

`T` _extends_ [`IProvider`](../interfaces/IProvider.md)

#### Parameters

##### requiredCapabilities

`Partial`\<[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)\>

#### Returns

`T`[]

---

### resolveByType()

> **resolveByType**\<`T`>>>>\>(`type`): `T`

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L30)

#### Type Parameters

##### T

`T` _extends_ [`IProvider`](../interfaces/IProvider.md)

#### Parameters

##### type

`string`

#### Returns

`T`

---

### unregisterProvider()

> **unregisterProvider**(`id`): `void`

Defined in: [packages/runtime/runtime-adapters/src/provider-registry.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-registry.ts#L18)

#### Parameters

##### id

`string`

#### Returns

`void`
