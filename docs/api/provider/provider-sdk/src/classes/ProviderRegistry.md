[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / ProviderRegistry

# Class: ProviderRegistry

Defined in: [packages/provider/provider-sdk/src/registry.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/registry.ts#L14)

## Constructors

### Constructor

> **new ProviderRegistry**(): `ProviderRegistry`

#### Returns

`ProviderRegistry`

## Methods

### complete()

> **complete**(`providerId`, `req`): `Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)>>>>\>

Defined in: [packages/provider/provider-sdk/src/registry.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/registry.ts#L34)

#### Parameters

##### providerId

`string`

##### req

[`CompletionRequest`](../interfaces/CompletionRequest.md)

#### Returns

`Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)\>

---

### get()

> **get**(`providerId`): [`Provider`](../interfaces/Provider.md) \| `undefined`

Defined in: [packages/provider/provider-sdk/src/registry.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/registry.ts#L26)

#### Parameters

##### providerId

`string`

#### Returns

[`Provider`](../interfaces/Provider.md) \| `undefined`

---

### list()

> **list**(): [`Provider`](../interfaces/Provider.md)[]

Defined in: [packages/provider/provider-sdk/src/registry.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/registry.ts#L30)

#### Returns

[`Provider`](../interfaces/Provider.md)[]

---

### register()

> **register**(`provider`): `void`

Defined in: [packages/provider/provider-sdk/src/registry.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/registry.ts#L18)

#### Parameters

##### provider

[`Provider`](../interfaces/Provider.md)

#### Returns

`void`

---

### registerFailoverPolicy()

> **registerFailoverPolicy**(`policy`): `void`

Defined in: [packages/provider/provider-sdk/src/registry.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/registry.ts#L22)

#### Parameters

##### policy

`ProviderFailoverPolicy`

#### Returns

`void`
