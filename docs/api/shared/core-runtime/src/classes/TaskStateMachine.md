[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / TaskStateMachine

# Class: TaskStateMachine

Defined in: [packages/shared/core-runtime/src/state-machine/index.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/state-machine/index.ts#L5)

## Constructors

### Constructor

> **new TaskStateMachine**(): `TaskStateMachine`

#### Returns

`TaskStateMachine`

## Methods

### canTransition()

> `static` **canTransition**(`current`, `next`): `boolean`

Defined in: [packages/shared/core-runtime/src/state-machine/index.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/state-machine/index.ts#L56)

#### Parameters

##### current

[`TaskStatus`](../enumerations/TaskStatus.md)

##### next

[`TaskStatus`](../enumerations/TaskStatus.md)

#### Returns

`boolean`

---

### transition()

> `static` **transition**(`task`, `next`): [`TaskModel`](../interfaces/TaskModel.md)

Defined in: [packages/shared/core-runtime/src/state-machine/index.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/state-machine/index.ts#L61)

#### Parameters

##### task

[`TaskModel`](../interfaces/TaskModel.md)

##### next

[`TaskStatus`](../enumerations/TaskStatus.md)

#### Returns

[`TaskModel`](../interfaces/TaskModel.md)
