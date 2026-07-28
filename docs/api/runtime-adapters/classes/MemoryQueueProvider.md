[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / MemoryQueueProvider

# Class: MemoryQueueProvider

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L14)

## Implements

- [`IQueueProvider`](../interfaces/IQueueProvider.md)

## Constructors

### Constructor

> **new MemoryQueueProvider**(): `MemoryQueueProvider`

#### Returns

`MemoryQueueProvider`

## Methods

### ack()

> **ack**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L67)

#### Parameters

##### \_topic

`string`

##### \_messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`ack`](../interfaces/IQueueProvider.md#ack)

---

### deadLetter()

> **deadLetter**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L75)

#### Parameters

##### \_topic

`string`

##### \_messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`deadLetter`](../interfaces/IQueueProvider.md#deadletter)

---

### dequeue()

> **dequeue**(`topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L55)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`dequeue`](../interfaces/IQueueProvider.md#dequeue)

---

### enqueue()

> **enqueue**(`topic`, `message`, `priority?`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L46)

#### Parameters

##### topic

`string`

##### message

`unknown`

##### priority?

`number` = `0`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`enqueue`](../interfaces/IQueueProvider.md#enqueue)

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L29)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`getCapabilities`](../interfaces/IQueueProvider.md#getcapabilities)

---

### getDepth()

> **getDepth**(`topic`): `Promise`\<`number`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L79)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`getDepth`](../interfaces/IQueueProvider.md#getdepth)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L20)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`getMetadata`](../interfaces/IQueueProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L37)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`getMetrics`](../interfaces/IQueueProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L33)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`healthCheck`](../interfaces/IQueueProvider.md#healthcheck)

---

### peek()

> **peek**(`topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L62)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`peek`](../interfaces/IQueueProvider.md#peek)

---

### purge()

> **purge**(`topic`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L83)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`purge`](../interfaces/IQueueProvider.md#purge)

---

### retry()

> **retry**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-queue.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-queue.ts#L71)

#### Parameters

##### \_topic

`string`

##### \_messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`retry`](../interfaces/IQueueProvider.md#retry)
