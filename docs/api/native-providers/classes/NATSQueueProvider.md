[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [native-providers](../README.md) / NATSQueueProvider

# ~~Class: NATSQueueProvider~~

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L16)

## Implements

- `IQueueProvider`
- [`INativeProvider`](../interfaces/INativeProvider.md)

## Constructors

### Constructor

> **new NATSQueueProvider**(): `NATSQueueProvider`

#### Returns

`NATSQueueProvider`

## Properties

### ~~id~~

> **id**: `string` = `'nats-queue'`

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L17)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`id`](../interfaces/INativeProvider.md#id)

---

### ~~name~~

> **name**: `string` = `'NATS Queue Provider'`

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L18)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`name`](../interfaces/INativeProvider.md#name)

## Methods

### ~~ack()~~

> **ack**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L73)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L29)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`connect`](../interfaces/INativeProvider.md#connect)

---

### ~~deadLetter()~~

> **deadLetter**(`_topic`, `_messageId`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L75)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L67)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L33)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`disconnect`](../interfaces/INativeProvider.md#disconnect)

---

### ~~enqueue()~~

> **enqueue**(`_topic`, `_message`, `_priority?`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L66)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L49)

#### Returns

`ProviderCapabilities`

#### Implementation of

`IQueueProvider.getCapabilities`

---

### ~~getDepth()~~

> **getDepth**(`_topic`): `Promise`\<`number`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L76)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L41)

#### Returns

`Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`getHealth`](../interfaces/INativeProvider.md#gethealth)

---

### ~~getMetadata()~~

> **getMetadata**(): `ProviderMetadata`

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L45)

#### Returns

`ProviderMetadata`

#### Implementation of

`IQueueProvider.getMetadata`

---

### ~~getMetrics()~~

> **getMetrics**(): `ProviderMetrics`

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L62)

#### Returns

`ProviderMetrics`

#### Implementation of

`IQueueProvider.getMetrics`

---

### ~~healthCheck()~~

> **healthCheck**(): `Promise`\<`ProviderHealth`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L53)

#### Returns

`Promise`\<`ProviderHealth`\>

#### Implementation of

`IQueueProvider.healthCheck`

---

### ~~initialize()~~

> **initialize**(`config`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L22)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L37)

#### Returns

`boolean`

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`isConnected`](../interfaces/INativeProvider.md#isconnected)

---

### ~~peek()~~

> **peek**(`_topic`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L70)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L79)

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

Defined in: [packages/provider/native-providers/src/providers/nats-queue.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/nats-queue.ts#L74)

#### Parameters

##### \_topic

`string`

##### \_messageId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IQueueProvider.retry`
