[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelHookManager

# Class: KernelHookManager

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L8)

## Constructors

### Constructor

> **new KernelHookManager**(): `KernelHookManager`

#### Returns

`KernelHookManager`

## Methods

### register()

> **register**(`hook`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L11)

#### Parameters

##### hook

[`KernelHook`](../interfaces/KernelHook.md)

#### Returns

`void`

---

### runAfterCheckpoint()

> **runAfterCheckpoint**(`sessionId`, `checkpoint`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L33)

#### Parameters

##### sessionId

`string`

##### checkpoint

[`SessionCheckpoint`](../interfaces/SessionCheckpoint.md)

#### Returns

`Promise`\<`void`\>

---

### runAfterThinking()

> **runAfterThinking**(`sessionId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L21)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runBeforeCheckpoint()

> **runBeforeCheckpoint**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L27)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeThinking()

> **runBeforeThinking**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L15)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runOnFailure()

> **runOnFailure**(`sessionId`, `error`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L39)

#### Parameters

##### sessionId

`string`

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### runOnRecovery()

> **runOnRecovery**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-hooks.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-hooks.ts#L45)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
