[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / NATSAdapter

# Class: NATSAdapter

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L106)

## Implements

- [`IExecutionQueue`](../interfaces/IExecutionQueue.md)

## Constructors

### Constructor

> **new NATSAdapter**(): `NATSAdapter`

#### Returns

`NATSAdapter`

## Methods

### ack()

> **ack**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:142](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L142)

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

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L119)

#### Returns

`Promise`\<[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\> \| `undefined`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`dequeue`](../interfaces/IExecutionQueue.md#dequeue)

---

### enqueue()

> **enqueue**(`msg`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L111)

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

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:169](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L169)

#### Returns

[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\>[]

---

### retry()

> **retry**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:150](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L150)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IExecutionQueue`](../interfaces/IExecutionQueue.md).[`retry`](../interfaces/IExecutionQueue.md#retry)
