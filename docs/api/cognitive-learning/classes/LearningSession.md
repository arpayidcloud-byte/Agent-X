[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / LearningSession

# Class: LearningSession

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L9)

## Constructors

### Constructor

> **new LearningSession**(`traceId`): `LearningSession`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L16)

#### Parameters

##### traceId

`string`

#### Returns

`LearningSession`

## Properties

### checksum

> `readonly` **checksum**: `string`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L14)

---

### id

> `readonly` **id**: `string`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L10)

---

### startedAt

> `readonly` **startedAt**: `Date`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L13)

---

### status

> **status**: [`LearningState`](../type-aliases/LearningState.md) = `'CREATED'`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L12)

---

### traceId

> `readonly` **traceId**: `string`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L11)

## Methods

### getDurationMs()

> **getDurationMs**(): `number`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L28)

#### Returns

`number`

---

### markComplete()

> **markComplete**(): `void`

Defined in: [packages/cognitive/cognitive-learning/src/learning-session.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/learning-session.ts#L24)

#### Returns

`void`
