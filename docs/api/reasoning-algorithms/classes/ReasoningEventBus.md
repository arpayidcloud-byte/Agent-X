[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-algorithms](../README.md) / ReasoningEventBus

# Class: ReasoningEventBus

Defined in: [packages/reasoning/reasoning-algorithms/src/events.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/events.ts#L6)

## Constructors

### Constructor

> **new ReasoningEventBus**(): `ReasoningEventBus`

#### Returns

`ReasoningEventBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/reasoning/reasoning-algorithms/src/events.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/events.ts#L21)

#### Returns

`void`

---

### publish()

> **publish**(`type`, `payload`): `void`

Defined in: [packages/reasoning/reasoning-algorithms/src/events.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/events.ts#L9)

#### Parameters

##### type

`string`

##### payload

`unknown`

#### Returns

`void`

---

### subscribe()

> **subscribe**(`type`, `listener`): `void`

Defined in: [packages/reasoning/reasoning-algorithms/src/events.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/events.ts#L16)

#### Parameters

##### type

`string`

##### listener

`Function`

#### Returns

`void`
