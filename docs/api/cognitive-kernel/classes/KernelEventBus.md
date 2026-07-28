[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelEventBus

# Class: KernelEventBus

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-events.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-events.ts#L6)

## Constructors

### Constructor

> **new KernelEventBus**(): `KernelEventBus`

#### Returns

`KernelEventBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-events.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-events.ts#L21)

#### Returns

`void`

---

### publish()

> **publish**(`type`, `payload`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-events.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-events.ts#L9)

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

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-events.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-events.ts#L16)

#### Parameters

##### type

`string`

##### listener

`Function`

#### Returns

`void`
