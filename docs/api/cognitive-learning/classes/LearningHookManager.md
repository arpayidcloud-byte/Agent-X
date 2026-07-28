[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / LearningHookManager

# Class: LearningHookManager

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L15)

## Constructors

### Constructor

> **new LearningHookManager**(): `LearningHookManager`

#### Returns

`LearningHookManager`

## Methods

### register()

> **register**(`hooks`): `void`

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L18)

#### Parameters

##### hooks

[`LearningHooks`](../interfaces/LearningHooks.md)

#### Returns

`void`

---

### runAfterAdaptation()

> **runAfterAdaptation**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L47)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runAfterLearning()

> **runAfterLearning**(`sessionId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L27)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterReflection()

> **runAfterReflection**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L37)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeAdaptation()

> **runBeforeAdaptation**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L42)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeLearning()

> **runBeforeLearning**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L22)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeReflection()

> **runBeforeReflection**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L32)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
