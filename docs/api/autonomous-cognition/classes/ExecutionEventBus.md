[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ExecutionEventBus

# Class: ExecutionEventBus

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:193](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L193)

## Constructors

### Constructor

> **new ExecutionEventBus**(): `ExecutionEventBus`

#### Returns

`ExecutionEventBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:216](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L216)

#### Returns

`void`

---

### getLog()

> **getLog**(): [`ExecutionEvent`](../interfaces/ExecutionEvent.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:212](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L212)

#### Returns

[`ExecutionEvent`](../interfaces/ExecutionEvent.md)[]

---

### publish()

> **publish**(`event`): `void`

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:197](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L197)

#### Parameters

##### event

[`ExecutionEvent`](../interfaces/ExecutionEvent.md)

#### Returns

`void`

---

### subscribe()

> **subscribe**(`eventType`, `listener`): `void`

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:203](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L203)

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

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:208](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L208)

#### Parameters

##### eventType

`string`

#### Returns

`void`
