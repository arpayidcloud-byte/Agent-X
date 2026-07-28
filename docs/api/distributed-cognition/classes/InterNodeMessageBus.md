[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / InterNodeMessageBus

# Class: InterNodeMessageBus

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts#L5)

## Constructors

### Constructor

> **new InterNodeMessageBus**(): `InterNodeMessageBus`

#### Returns

`InterNodeMessageBus`

## Methods

### clearDeadLetterQueue()

> **clearDeadLetterQueue**(): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts#L33)

#### Returns

`void`

---

### getDeadLetterQueue()

> **getDeadLetterQueue**(): [`CollaborationMessage`](../interfaces/CollaborationMessage.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts#L29)

#### Returns

[`CollaborationMessage`](../interfaces/CollaborationMessage.md)[]

---

### getSubscribers()

> **getSubscribers**(`nodeId`): `number`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts#L37)

#### Parameters

##### nodeId

`string`

#### Returns

`number`

---

### publish()

> **publish**(`message`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts#L9)

#### Parameters

##### message

[`CollaborationMessage`](../interfaces/CollaborationMessage.md)

#### Returns

`void`

---

### subscribe()

> **subscribe**(`nodeId`, `handler`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts#L20)

#### Parameters

##### nodeId

`string`

##### handler

[`MessageHandler`](../type-aliases/MessageHandler.md)

#### Returns

`void`

---

### unsubscribe()

> **unsubscribe**(`nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/InterNodeMessageBus.ts#L25)

#### Parameters

##### nodeId

`string`

#### Returns

`void`
