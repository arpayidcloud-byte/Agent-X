[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / TemporalAdapter

# Class: TemporalAdapter

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:174](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L174)

## Implements

- [`IExecutionQueue`](../interfaces/IExecutionQueue.md)

## Constructors

### Constructor

> **new TemporalAdapter**(): `TemporalAdapter`

#### Returns

`TemporalAdapter`

## Methods

### ack()

> **ack**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:201](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L201)

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

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:188](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L188)

#### Returns

`Promise`\<[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\> \| `undefined`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`dequeue`](../interfaces/IExecutionQueue.md#dequeue)

---

### enqueue()

> **enqueue**(`msg`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:180](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L180)

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

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:228](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L228)

#### Returns

[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\>[]

---

### isWorkflowCompleted()

> **isWorkflowCompleted**(`workflowId`): `boolean`

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:232](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L232)

#### Parameters

##### workflowId

`string`

#### Returns

`boolean`

---

### retry()

> **retry**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:210](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L210)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`retry`](../interfaces/IExecutionQueue.md#retry)
