[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [native-providers](../README.md) / BullMQQueueProvider

# ~~Class: BullMQQueueProvider~~

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L16)

## Implements

- `IQueueProvider`
- [`INativeProvider`](../interfaces/INativeProvider.md)

## Constructors

### Constructor

> **new BullMQQueueProvider**(): `BullMQQueueProvider`

#### Returns

`BullMQQueueProvider`

## Properties

### ~~id~~

> **id**: `string` = `'bullmq-queue'`

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L17)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`id`](../interfaces/INativeProvider.md#id)

---

### ~~name~~

> **name**: `string` = `'BullMQ Queue Provider'`

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L18)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`name`](../interfaces/INativeProvider.md#name)

## Methods

### ~~ack()~~

> **ack**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L80)

#### Parameters

##### \_topic

`string`

##### \_messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IQueueProvider.ack`

---

### ~~connect()~~

> **connect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L29)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`connect`](../interfaces/INativeProvider.md#connect)

---

### ~~deadLetter()~~

> **deadLetter**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L84)

#### Parameters

##### \_topic

`string`

##### \_messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IQueueProvider.deadLetter`

---

### ~~dequeue()~~

> **dequeue**(`_topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L70)

#### Parameters

##### \_topic

`string`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

`IQueueProvider.dequeue`

---

### ~~disconnect()~~

> **disconnect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L33)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`disconnect`](../interfaces/INativeProvider.md#disconnect)

---

### ~~enqueue()~~

> **enqueue**(`_topic`, `_message`, `_priority?`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L66)

#### Parameters

##### \_topic

`string`

##### \_message

`unknown`

##### \_priority?

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IQueueProvider.enqueue`

---

### ~~getCapabilities()~~

> **getCapabilities**(): `ProviderCapabilities`

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L49)

#### Returns

`ProviderCapabilities`

#### Implementation of

`IQueueProvider.getCapabilities`

---

### ~~getDepth()~~

> **getDepth**(`_topic`): `Promise`\<`number`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L86)

#### Parameters

##### \_topic

`string`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`IQueueProvider.getDepth`

---

### ~~getHealth()~~

> **getHealth**(): `Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L41)

#### Returns

`Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`getHealth`](../interfaces/INativeProvider.md#gethealth)

---

### ~~getMetadata()~~

> **getMetadata**(): `ProviderMetadata`

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L45)

#### Returns

`ProviderMetadata`

#### Implementation of

`IQueueProvider.getMetadata`

---

### ~~getMetrics()~~

> **getMetrics**(): `ProviderMetrics`

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L62)

#### Returns

`ProviderMetrics`

#### Implementation of

`IQueueProvider.getMetrics`

---

### ~~healthCheck()~~

> **healthCheck**(): `Promise`\<`ProviderHealth`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L53)

#### Returns

`Promise`\<`ProviderHealth`\>

#### Implementation of

`IQueueProvider.healthCheck`

---

### ~~initialize()~~

> **initialize**(`config`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L22)

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

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L37)

#### Returns

`boolean`

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`isConnected`](../interfaces/INativeProvider.md#isconnected)

---

### ~~peek()~~

> **peek**(`_topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L75)

#### Parameters

##### \_topic

`string`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

`IQueueProvider.peek`

---

### ~~purge()~~

> **purge**(`_topic`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L90)

#### Parameters

##### \_topic

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IQueueProvider.purge`

---

### ~~retry()~~

> **retry**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/bullmq-queue.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/bullmq-queue.ts#L82)

#### Parameters

##### \_topic

`string`

##### \_messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IQueueProvider.retry`
