[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelHook

# Interface: KernelHook

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L75)

## Properties

### afterCheckpoint?

> `optional` **afterCheckpoint?**: (`sessionId`, `checkpoint`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L81)

#### Parameters

##### sessionId

`string`

##### checkpoint

[`SessionCheckpoint`](SessionCheckpoint.md)

#### Returns

`Promise`\<`void`\>

---

### afterKernelStart?

> `optional` **afterKernelStart?**: () => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L77)

#### Returns

`Promise`\<`void`\>

---

### afterThinking?

> `optional` **afterThinking?**: (`sessionId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L79)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### beforeCheckpoint?

> `optional` **beforeCheckpoint?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L80)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeKernelStart?

> `optional` **beforeKernelStart?**: () => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L76)

#### Returns

`Promise`\<`void`\>

---

### beforeThinking?

> `optional` **beforeThinking?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L78)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### onFailure?

> `optional` **onFailure?**: (`sessionId`, `error`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L83)

#### Parameters

##### sessionId

`string`

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### onRecovery?

> `optional` **onRecovery?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/interfaces.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/interfaces.ts#L82)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
