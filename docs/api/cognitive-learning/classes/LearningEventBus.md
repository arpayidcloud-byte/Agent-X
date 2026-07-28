[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / LearningEventBus

# Class: LearningEventBus

Defined in: [packages/cognitive/cognitive-learning/src/events.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/events.ts#L6)

## Constructors

### Constructor

> **new LearningEventBus**(): `LearningEventBus`

#### Returns

`LearningEventBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/cognitive/cognitive-learning/src/events.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/events.ts#L19)

#### Returns

`void`

---

### publish()

> **publish**(`type`, `payload`): `void`

Defined in: [packages/cognitive/cognitive-learning/src/events.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/events.ts#L9)

#### Parameters

##### type

`string`

##### payload

`unknown`

#### Returns

`void`

---

### subscribe()

> **subscribe**(`type`, `fn`): `void`

Defined in: [packages/cognitive/cognitive-learning/src/events.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/events.ts#L14)

#### Parameters

##### type

`string`

##### fn

(...`args`) => `void`

#### Returns

`void`
