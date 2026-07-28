[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / MemoryQueue

# Class: MemoryQueue

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L15)

## Implements

- [`IExecutionQueue`](../interfaces/IExecutionQueue.md)

## Constructors

### Constructor

> **new MemoryQueue**(): `MemoryQueue`

#### Returns

`MemoryQueue`

## Methods

### ack()

> **ack**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L32)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`ack`](../interfaces/IExecutionQueue.md#ack)

---

### dequeue()

> **dequeue**(): `Promise`\<[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`> > > > \> \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L24)

#### Returns

`Promise`\<[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\> \| `undefined`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`dequeue`](../interfaces/IExecutionQueue.md#dequeue)

---

### enqueue()

> **enqueue**(`msg`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L19)

#### Parameters

##### msg

[`QueueMessage`](../interfaces/QueueMessage.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`enqueue`](../interfaces/IExecutionQueue.md#enqueue)

---

### getDlq()

> **getDlq**(): [`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`>>>>\>[]

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L53)

#### Returns

[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\>[]

---

### retry()

> **retry**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L39)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`retry`](../interfaces/IExecutionQueue.md#retry)
