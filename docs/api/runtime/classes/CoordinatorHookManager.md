[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / CoordinatorHookManager

# Class: CoordinatorHookManager

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L8)

## Constructors

### Constructor

> **new CoordinatorHookManager**(): `CoordinatorHookManager`

#### Returns

`CoordinatorHookManager`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L47)

#### Returns

`void`

---

### executeAfterExecution()

> **executeAfterExecution**(`session`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L25)

#### Parameters

##### session

[`CoordinatorSession`](../interfaces/CoordinatorSession.md)

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### executeBeforeExecution()

> **executeBeforeExecution**(`session`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L19)

#### Parameters

##### session

[`CoordinatorSession`](../interfaces/CoordinatorSession.md)

#### Returns

`Promise`\<`void`\>

---

### executeOnDispatch()

> **executeOnDispatch**(`session`, `phase`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L31)

#### Parameters

##### session

[`CoordinatorSession`](../interfaces/CoordinatorSession.md)

##### phase

[`ExecutionPhase`](../type-aliases/ExecutionPhase.md)

#### Returns

`Promise`\<`void`\>

---

### executeOnRetry()

> **executeOnRetry**(`session`, `phase`, `attempt`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L37)

#### Parameters

##### session

[`CoordinatorSession`](../interfaces/CoordinatorSession.md)

##### phase

[`ExecutionPhase`](../type-aliases/ExecutionPhase.md)

##### attempt

`number`

#### Returns

`Promise`\<`void`\>

---

### register()

> **register**(`hook`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L11)

#### Parameters

##### hook

[`CoordinatorHook`](../interfaces/CoordinatorHook.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`name`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-hooks.ts#L15)

#### Parameters

##### name

`string`

#### Returns

`void`
