[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / Provider

# Interface: Provider

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L126)

## Properties

### capabilities

> `readonly` **capabilities**: `ProviderCapabilities`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L128)

---

### id

> `readonly` **id**: `string`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L127)

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<`ProviderStatus`>>>>\>

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L132)

#### Returns

`Promise`\<`ProviderStatus`\>

---

### complete()

> **complete**(`req`): `Promise`\<[`CompletionResponse`](CompletionResponse.md)>>>>\>

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:130](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L130)

#### Parameters

##### req

[`CompletionRequest`](CompletionRequest.md)

#### Returns

`Promise`\<[`CompletionResponse`](CompletionResponse.md)\>

---

### stream()?

> `optional` **stream**(`req`): `Promise`\<`StreamingResponse`>>>>\>

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:131](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L131)

#### Parameters

##### req

[`CompletionRequest`](CompletionRequest.md)

#### Returns

`Promise`\<`StreamingResponse`\>
