[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedEventBus

# Class: DistributedEventBus

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts#L11)

## Constructors

### Constructor

> **new DistributedEventBus**(): `DistributedEventBus`

#### Returns

`DistributedEventBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts#L40)

#### Returns

`void`

---

### getEventLog()

> **getEventLog**(): [`DistributedEvent`](../interfaces/DistributedEvent.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts#L32)

#### Returns

[`DistributedEvent`](../interfaces/DistributedEvent.md)[]

---

### getListeners()

> **getListeners**(`eventType`): [`EventListener`](../type-aliases/EventListener.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts#L36)

#### Parameters

##### eventType

`string`

#### Returns

[`EventListener`](../type-aliases/EventListener.md)[]

---

### publish()

> **publish**(`event`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts#L15)

#### Parameters

##### event

[`DistributedEvent`](../interfaces/DistributedEvent.md)

#### Returns

`void`

---

### subscribe()

> **subscribe**(`eventType`, `listener`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts#L23)

#### Parameters

##### eventType

`string`

##### listener

[`EventListener`](../type-aliases/EventListener.md)

#### Returns

`void`

---

### unsubscribe()

> **unsubscribe**(`eventType`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/messaging/DistributedEventBus.ts#L28)

#### Parameters

##### eventType

`string`

#### Returns

`void`
