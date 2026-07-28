[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / TaskCoordinator

# Class: TaskCoordinator

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts#L68)

## Constructors

### Constructor

> **new TaskCoordinator**(): `TaskCoordinator`

#### Returns

`TaskCoordinator`

## Methods

### assign()

> **assign**(`planId`, `stepIds`): `void`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts#L71)

#### Parameters

##### planId

`string`

##### stepIds

`string`[]

#### Returns

`void`

---

### complete()

> **complete**(`planId`, `stepId`): `void`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts#L79)

#### Parameters

##### planId

`string`

##### stepId

`string`

#### Returns

`void`

---

### getAssignments()

> **getAssignments**(`planId`): `string`[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts#L75)

#### Parameters

##### planId

`string`

#### Returns

`string`[]
