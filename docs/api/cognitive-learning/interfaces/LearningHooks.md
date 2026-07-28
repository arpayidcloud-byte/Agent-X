[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / LearningHooks

# Interface: LearningHooks

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L6)

## Properties

### afterAdaptation?

> `optional` **afterAdaptation?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L12)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### afterLearning?

> `optional` **afterLearning?**: (`sessionId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L8)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterReflection?

> `optional` **afterReflection?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L10)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeAdaptation?

> `optional` **beforeAdaptation?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L11)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeLearning?

> `optional` **beforeLearning?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L7)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeReflection?

> `optional` **beforeReflection?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-learning/src/hooks.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/hooks.ts#L9)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
