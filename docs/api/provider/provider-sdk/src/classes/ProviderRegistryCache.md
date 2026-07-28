[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / ProviderRegistryCache

# Class: ProviderRegistryCache

Defined in: [packages/provider/provider-sdk/src/factory.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/factory.ts#L51)

## Constructors

### Constructor

> **new ProviderRegistryCache**(): `ProviderRegistryCache`

#### Returns

`ProviderRegistryCache`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/provider/provider-sdk/src/factory.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/factory.ts#L71)

#### Returns

`void`

---

### get()

> **get**(`providerId`): `ProviderStatus` \| `undefined`

Defined in: [packages/provider/provider-sdk/src/factory.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/factory.ts#L55)

#### Parameters

##### providerId

`string`

#### Returns

`ProviderStatus` \| `undefined`

---

### invalidate()

> **invalidate**(`providerId`): `void`

Defined in: [packages/provider/provider-sdk/src/factory.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/factory.ts#L67)

#### Parameters

##### providerId

`string`

#### Returns

`void`

---

### set()

> **set**(`providerId`, `status`): `void`

Defined in: [packages/provider/provider-sdk/src/factory.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/factory.ts#L63)

#### Parameters

##### providerId

`string`

##### status

`ProviderStatus`

#### Returns

`void`
