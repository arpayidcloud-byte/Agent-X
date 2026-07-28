[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [native-providers](../README.md) / OllamaProvider

# ~~Class: OllamaProvider~~

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L16)

## Implements

- [`INativeProvider`](../interfaces/INativeProvider.md)

## Constructors

### Constructor

> **new OllamaProvider**(): `OllamaProvider`

#### Returns

`OllamaProvider`

## Properties

### ~~id~~

> **id**: `string` = `'ollama'`

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L17)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`id`](../interfaces/INativeProvider.md#id)

---

### ~~name~~

> **name**: `string` = `'Ollama Local Provider'`

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L18)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`name`](../interfaces/INativeProvider.md#name)

## Methods

### ~~complete()~~

> **complete**(`options`): `Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)>>>>\>

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L49)

#### Parameters

##### options

[`CompletionOptions`](../interfaces/CompletionOptions.md)

#### Returns

`Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)\>

---

### ~~connect()~~

> **connect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L29)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`connect`](../interfaces/INativeProvider.md#connect)

---

### ~~disconnect()~~

> **disconnect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L33)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`disconnect`](../interfaces/INativeProvider.md#disconnect)

---

### ~~embed()~~

> **embed**(`request`): `Promise`\<[`EmbeddingResponse`](../interfaces/EmbeddingResponse.md)>>>>\>

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L59)

#### Parameters

##### request

[`EmbeddingRequest`](../interfaces/EmbeddingRequest.md)

#### Returns

`Promise`\<[`EmbeddingResponse`](../interfaces/EmbeddingResponse.md)\>

---

### ~~getHealth()~~

> **getHealth**(): `Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L41)

#### Returns

`Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`getHealth`](../interfaces/INativeProvider.md#gethealth)

---

### ~~getMetadata()~~

> **getMetadata**(): `object`

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L45)

#### Returns

`object`

##### ~~id~~

> **id**: `string`

##### ~~name~~

> **name**: `string`

##### ~~type~~

> **type**: `"llm"`

##### ~~version~~

> **version**: `string` = `'1.0.0'`

---

### ~~initialize()~~

> **initialize**(`config`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L22)

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

Defined in: [packages/provider/native-providers/src/providers/ollama-provider.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/ollama-provider.ts#L37)

#### Returns

`boolean`

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`isConnected`](../interfaces/INativeProvider.md#isconnected)
