[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / CoordinatorHook

# Interface: CoordinatorHook

Defined in: [packages/runtime/runtime/src/coordinator/interfaces.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/interfaces.ts#L93)

## Properties

### afterExecution?

> `optional` **afterExecution?**: (`session`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/interfaces.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/interfaces.ts#L96)

#### Parameters

##### session

[`CoordinatorSession`](CoordinatorSession.md)

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### beforeExecution?

> `optional` **beforeExecution?**: (`session`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/interfaces.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/interfaces.ts#L95)

#### Parameters

##### session

[`CoordinatorSession`](CoordinatorSession.md)

#### Returns

`Promise`\<`void`\>

---

### name

> **name**: `string`

Defined in: [packages/runtime/runtime/src/coordinator/interfaces.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/interfaces.ts#L94)

---

### onDispatch?

> `optional` **onDispatch?**: (`session`, `phase`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/interfaces.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/interfaces.ts#L97)

#### Parameters

##### session

[`CoordinatorSession`](CoordinatorSession.md)

##### phase

[`ExecutionPhase`](../type-aliases/ExecutionPhase.md)

#### Returns

`Promise`\<`void`\>

---

### onRetry?

> `optional` **onRetry?**: (`session`, `phase`, `attempt`) => `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/interfaces.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/interfaces.ts#L98)

#### Parameters

##### session

[`CoordinatorSession`](CoordinatorSession.md)

##### phase

[`ExecutionPhase`](../type-aliases/ExecutionPhase.md)

##### attempt

`number`

#### Returns

`Promise`\<`void`\>
