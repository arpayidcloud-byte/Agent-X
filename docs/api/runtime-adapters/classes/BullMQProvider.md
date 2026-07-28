[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / BullMQProvider

# Class: BullMQProvider

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L11)

## Implements

- [`IQueueProvider`](../interfaces/IQueueProvider.md)

## Constructors

### Constructor

> **new BullMQProvider**(`redisUrl?`): `BullMQProvider`

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L18)

#### Parameters

##### redisUrl?

`string` = `'redis://localhost:6379'`

#### Returns

`BullMQProvider`

## Methods

### ack()

> **ack**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L96)

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

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L106)

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

> **dequeue**(`_topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L86)

#### Parameters

##### \_topic

`string`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`dequeue`](../interfaces/IQueueProvider.md#dequeue)

---

### enqueue()

> **enqueue**(`topic`, `message`, `priority?`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L69)

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

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L31)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`getCapabilities`](../interfaces/IQueueProvider.md#getcapabilities)

---

### getDepth()

> **getDepth**(`topic`): `Promise`\<`number`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L110)

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

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L22)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`getMetadata`](../interfaces/IQueueProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L50)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`getMetrics`](../interfaces/IQueueProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L35)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`healthCheck`](../interfaces/IQueueProvider.md#healthcheck)

---

### peek()

> **peek**(`topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L90)

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

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:115](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L115)

#### Parameters

##### topic

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`purge`](../interfaces/IQueueProvider.md#purge)

---

### retry()

> **retry**(`topic`, `messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/bullmq/bullmq-queue.ts#L100)

#### Parameters

##### topic

`string`

##### messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IQueueProvider`](../interfaces/IQueueProvider.md).[`retry`](../interfaces/IQueueProvider.md#retry)
