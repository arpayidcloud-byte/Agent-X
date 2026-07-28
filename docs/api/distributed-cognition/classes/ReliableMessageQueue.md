[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / ReliableMessageQueue

# Class: ReliableMessageQueue

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L10)

## Constructors

### Constructor

> **new ReliableMessageQueue**(`maxAttempts?`): `ReliableMessageQueue`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L15)

#### Parameters

##### maxAttempts?

`number` = `3`

#### Returns

`ReliableMessageQueue`

## Methods

### acknowledge()

> **acknowledge**(`messageId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L35)

#### Parameters

##### messageId

`string`

#### Returns

`void`

---

### dequeue()

> **dequeue**(): [`QueuedMessage`](../interfaces/QueuedMessage.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L31)

#### Returns

[`QueuedMessage`](../interfaces/QueuedMessage.md) \| `undefined`

---

### enqueue()

> **enqueue**(`message`): [`QueuedMessage`](../interfaces/QueuedMessage.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L19)

#### Parameters

##### message

[`CollaborationMessage`](../interfaces/CollaborationMessage.md)

#### Returns

[`QueuedMessage`](../interfaces/QueuedMessage.md)

---

### getAll()

> **getAll**(): [`QueuedMessage`](../interfaces/QueuedMessage.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L69)

#### Returns

[`QueuedMessage`](../interfaces/QueuedMessage.md)[]

---

### getProcessed()

> **getProcessed**(): [`QueuedMessage`](../interfaces/QueuedMessage.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L65)

#### Returns

[`QueuedMessage`](../interfaces/QueuedMessage.md)[]

---

### requeue()

> **requeue**(`messageId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L43)

#### Parameters

##### messageId

`string`

#### Returns

`boolean`

---

### size()

> **size**(): `number`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/ReliableMessageQueue.ts#L61)

#### Returns

`number`
