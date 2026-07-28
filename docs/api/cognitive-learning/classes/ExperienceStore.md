[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / ExperienceStore

# Class: ExperienceStore

Defined in: [packages/cognitive/cognitive-learning/src/experience-store.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/experience-store.ts#L10)

## Constructors

### Constructor

> **new ExperienceStore**(): `ExperienceStore`

#### Returns

`ExperienceStore`

## Methods

### count()

> **count**(): `number`

Defined in: [packages/cognitive/cognitive-learning/src/experience-store.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/experience-store.ts#L33)

#### Returns

`number`

---

### getAll()

> **getAll**(): [`Experience`](../interfaces/Experience.md)[]

Defined in: [packages/cognitive/cognitive-learning/src/experience-store.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/experience-store.ts#L25)

#### Returns

[`Experience`](../interfaces/Experience.md)[]

---

### getByOutcome()

> **getByOutcome**(`outcome`): [`Experience`](../interfaces/Experience.md)[]

Defined in: [packages/cognitive/cognitive-learning/src/experience-store.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/experience-store.ts#L29)

#### Parameters

##### outcome

`"success"` \| `"failure"` \| `"partial"`

#### Returns

[`Experience`](../interfaces/Experience.md)[]

---

### store()

> **store**(`exp`): `void`

Defined in: [packages/cognitive/cognitive-learning/src/experience-store.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/experience-store.ts#L13)

#### Parameters

##### exp

[`Experience`](../interfaces/Experience.md)

#### Returns

`void`
