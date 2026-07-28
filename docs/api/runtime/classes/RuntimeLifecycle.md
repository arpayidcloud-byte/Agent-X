[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeLifecycle

# Class: RuntimeLifecycle

Defined in: [packages/runtime/runtime/src/runtime-lifecycle.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-lifecycle.ts#L9)

## Constructors

### Constructor

> **new RuntimeLifecycle**(): `RuntimeLifecycle`

#### Returns

`RuntimeLifecycle`

## Methods

### getHistory()

> **getHistory**(): `object`[]

Defined in: [packages/runtime/runtime/src/runtime-lifecycle.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-lifecycle.ts#L25)

#### Returns

`object`[]

---

### getState()

> **getState**(): [`RuntimeState`](../type-aliases/RuntimeState.md)

Defined in: [packages/runtime/runtime/src/runtime-lifecycle.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-lifecycle.ts#L13)

#### Returns

[`RuntimeState`](../type-aliases/RuntimeState.md)

---

### isTerminal()

> **isTerminal**(): `boolean`

Defined in: [packages/runtime/runtime/src/runtime-lifecycle.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-lifecycle.ts#L29)

#### Returns

`boolean`

---

### transition()

> **transition**(`next`): `void`

Defined in: [packages/runtime/runtime/src/runtime-lifecycle.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-lifecycle.ts#L17)

#### Parameters

##### next

[`RuntimeState`](../type-aliases/RuntimeState.md)

#### Returns

`void`
