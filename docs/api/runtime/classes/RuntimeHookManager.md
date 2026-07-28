[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeHookManager

# Class: RuntimeHookManager

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L18)

## Constructors

### Constructor

> **new RuntimeHookManager**(): `RuntimeHookManager`

#### Returns

`RuntimeHookManager`

## Methods

### executeAfterComplete()

> **executeAfterComplete**(`session`, `metrics`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L47)

#### Parameters

##### session

[`RuntimeSession`](../interfaces/RuntimeSession.md)

##### metrics

[`RuntimeMetrics`](../interfaces/RuntimeMetrics.md)

#### Returns

`Promise`\<`void`\>

---

### executeAfterStart()

> **executeAfterStart**(`session`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L35)

#### Parameters

##### session

[`RuntimeSession`](../interfaces/RuntimeSession.md)

#### Returns

`Promise`\<`void`\>

---

### executeBeforeComplete()

> **executeBeforeComplete**(`session`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L41)

#### Parameters

##### session

[`RuntimeSession`](../interfaces/RuntimeSession.md)

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### executeBeforeStart()

> **executeBeforeStart**(`session`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L29)

#### Parameters

##### session

[`RuntimeSession`](../interfaces/RuntimeSession.md)

#### Returns

`Promise`\<`void`\>

---

### executeOnError()

> **executeOnError**(`session`, `error`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L63)

#### Parameters

##### session

[`RuntimeSession`](../interfaces/RuntimeSession.md)

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### executeOnStateChange()

> **executeOnStateChange**(`session`, `from`, `to`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L53)

#### Parameters

##### session

[`RuntimeSession`](../interfaces/RuntimeSession.md)

##### from

[`RuntimeState`](../type-aliases/RuntimeState.md)

##### to

[`RuntimeState`](../type-aliases/RuntimeState.md)

#### Returns

`Promise`\<`void`\>

---

### register()

> **register**(`hook`): `void`

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L21)

#### Parameters

##### hook

[`RuntimeHook`](../interfaces/RuntimeHook.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`hookName`): `void`

Defined in: [packages/runtime/runtime/src/runtime-hooks.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-hooks.ts#L25)

#### Parameters

##### hookName

`string`

#### Returns

`void`
