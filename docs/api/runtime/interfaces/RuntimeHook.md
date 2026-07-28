[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeHook

# Interface: RuntimeHook

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L8)

## Properties

### afterComplete?

> `optional` **afterComplete?**: (`session`, `metrics`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L13)

#### Parameters

##### session

[`RuntimeSession`](RuntimeSession.md)

##### metrics

[`RuntimeMetrics`](RuntimeMetrics.md)

#### Returns

`Promise`\<`void`\>

---

### afterStart?

> `optional` **afterStart?**: (`session`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L11)

#### Parameters

##### session

[`RuntimeSession`](RuntimeSession.md)

#### Returns

`Promise`\<`void`\>

---

### beforeComplete?

> `optional` **beforeComplete?**: (`session`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L12)

#### Parameters

##### session

[`RuntimeSession`](RuntimeSession.md)

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### beforeStart?

> `optional` **beforeStart?**: (`session`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L10)

#### Parameters

##### session

[`RuntimeSession`](RuntimeSession.md)

#### Returns

`Promise`\<`void`\>

---

### name

> **name**: `string`

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L9)

---

### onError?

> `optional` **onError?**: (`session`, `error`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L14)

#### Parameters

##### session

[`RuntimeSession`](RuntimeSession.md)

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### onStateChange?

> `optional` **onStateChange?**: (`session`, `from`, `to`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L15)

#### Parameters

##### session

[`RuntimeSession`](RuntimeSession.md)

##### from

[`RuntimeState`](../type-aliases/RuntimeState.md)

##### to

[`RuntimeState`](../type-aliases/RuntimeState.md)

#### Returns

`Promise`\<`void`\>
