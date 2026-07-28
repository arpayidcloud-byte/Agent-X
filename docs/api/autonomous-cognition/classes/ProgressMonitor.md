[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ProgressMonitor

# Class: ProgressMonitor

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts#L95)

## Constructors

### Constructor

> **new ProgressMonitor**(): `ProgressMonitor`

#### Returns

`ProgressMonitor`

## Methods

### get()

> **get**(`goalId`): [`ProgressSnapshot`](../interfaces/ProgressSnapshot.md) \| `undefined`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts#L114)

#### Parameters

##### goalId

`string`

#### Returns

[`ProgressSnapshot`](../interfaces/ProgressSnapshot.md) \| `undefined`

---

### record()

> **record**(`goalId`, `totalSteps`, `completedSteps`): [`ProgressSnapshot`](../interfaces/ProgressSnapshot.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/ExecutionEngine.ts#L98)

#### Parameters

##### goalId

`string`

##### totalSteps

`number`

##### completedSteps

`number`

#### Returns

[`ProgressSnapshot`](../interfaces/ProgressSnapshot.md)
