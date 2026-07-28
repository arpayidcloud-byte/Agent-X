[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / IQueueProvider

# Interface: IQueueProvider

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L62)

## Extends

- [`IProvider`](IProvider.md)

## Methods

### ack()

> **ack**(`topic`, `messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L66)

#### Parameters

##### topic

`string`

##### messageId

`string`

#### Returns

`Promise`\<`void`\>

---

### deadLetter()

> **deadLetter**(`topic`, `messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L68)

#### Parameters

##### topic

`string`

##### messageId

`string`

#### Returns

`Promise`\<`void`\>

---

### dequeue()

> **dequeue**(`topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L64)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`unknown`\>

---

### enqueue()

> **enqueue**(`topic`, `message`, `priority?`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L63)

#### Parameters

##### topic

`string`

##### message

`unknown`

##### priority?

`number`

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

### getDepth()

> **getDepth**(`topic`): `Promise`\<`number`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L69)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`number`\>

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

### peek()

> **peek**(`topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L65)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`unknown`\>

---

### purge()

> **purge**(`topic`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L70)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`void`\>

---

### retry()

> **retry**(`topic`, `messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L67)

#### Parameters

##### topic

`string`

##### messageId

`string`

#### Returns

`Promise`\<`void`\>
