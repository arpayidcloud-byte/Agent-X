[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / BullMQAdapter

# Class: BullMQAdapter

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L58)

## Implements

- [`IExecutionQueue`](../interfaces/IExecutionQueue.md)

## Constructors

### Constructor

> **new BullMQAdapter**(): `BullMQAdapter`

#### Returns

`BullMQAdapter`

## Methods

### ack()

> **ack**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L77)

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

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L68)

#### Returns

`Promise`\<[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\> \| `undefined`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`dequeue`](../interfaces/IExecutionQueue.md#dequeue)

---

### enqueue()

> **enqueue**(`msg`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L63)

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

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L101)

#### Returns

[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\>[]

---

### retry()

> **retry**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L85)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`retry`](../interfaces/IExecutionQueue.md#retry)
