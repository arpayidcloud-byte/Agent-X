[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / CognitiveHooks

# Interface: CognitiveHooks

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L8)

## Properties

### afterDecision?

> `optional` **afterDecision?**: (`options`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L16)

#### Parameters

##### options

`string`[]

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterReasoning?

> `optional` **afterReasoning?**: (`traceId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L12)

#### Parameters

##### traceId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterReflection?

> `optional` **afterReflection?**: (`thought`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L14)

#### Parameters

##### thought

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterThinking?

> `optional` **afterThinking?**: (`session`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L10)

#### Parameters

##### session

[`ThinkingSession`](ThinkingSession.md)

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### beforeDecision?

> `optional` **beforeDecision?**: (`options`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L15)

#### Parameters

##### options

`string`[]

#### Returns

`Promise`\<`void`\>

---

### beforeReasoning?

> `optional` **beforeReasoning?**: (`traceId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L11)

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeReflection?

> `optional` **beforeReflection?**: (`thought`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L13)

#### Parameters

##### thought

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeThinking?

> `optional` **beforeThinking?**: (`session`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L9)

#### Parameters

##### session

[`ThinkingSession`](ThinkingSession.md)

#### Returns

`Promise`\<`void`\>

---

### onFailure?

> `optional` **onFailure?**: (`session`, `error`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L17)

#### Parameters

##### session

[`ThinkingSession`](ThinkingSession.md)

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### onRecovery?

> `optional` **onRecovery?**: (`session`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-hooks.ts#L18)

#### Parameters

##### session

[`ThinkingSession`](ThinkingSession.md)

#### Returns

`Promise`\<`void`\>
