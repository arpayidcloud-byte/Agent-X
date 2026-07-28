[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / CoordinatorStateMachine

# Class: CoordinatorStateMachine

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L24)

## Constructors

### Constructor

> **new CoordinatorStateMachine**(): `CoordinatorStateMachine`

#### Returns

`CoordinatorStateMachine`

## Methods

### canTransition()

> **canTransition**(`next`): `boolean`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L48)

#### Parameters

##### next

[`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)

#### Returns

`boolean`

---

### getHistory()

> **getHistory**(): `object`[]

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L64)

#### Returns

`object`[]

---

### getState()

> **getState**(): [`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L32)

#### Returns

[`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)

---

### getValidTransitions()

> **getValidTransitions**(): [`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)[]

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L52)

#### Returns

[`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)[]

---

### isTerminal()

> **isTerminal**(): `boolean`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L56)

#### Returns

`boolean`

---

### reset()

> **reset**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L72)

#### Returns

`void`

---

### transition()

> **transition**(`next`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-state.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-state.ts#L36)

#### Parameters

##### next

[`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)

#### Returns

`void`
