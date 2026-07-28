[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / RetryCoordinator

# Class: RetryCoordinator

Defined in: [packages/workflow/workflow-engine/src/retry.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/retry.ts#L8)

## Constructors

### Constructor

> **new RetryCoordinator**(): `RetryCoordinator`

#### Returns

`RetryCoordinator`

## Methods

### getRetryBudget()

> **getRetryBudget**(`nodeId`): [`RetryBudget`](../interfaces/RetryBudget.md)

Defined in: [packages/workflow/workflow-engine/src/retry.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/retry.ts#L51)

#### Parameters

##### nodeId

`string`

#### Returns

[`RetryBudget`](../interfaces/RetryBudget.md)

---

### recordAttempt()

> **recordAttempt**(`nodeId`): `void`

Defined in: [packages/workflow/workflow-engine/src/retry.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/retry.ts#L62)

#### Parameters

##### nodeId

`string`

#### Returns

`void`

---

### resetBudgets()

> **resetBudgets**(): `void`

Defined in: [packages/workflow/workflow-engine/src/retry.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/retry.ts#L70)

#### Returns

`void`

---

### shouldRetry()

> **shouldRetry**(`nodeId`, `error`, `attempt`): [`RetryDecision`](../interfaces/RetryDecision.md)

Defined in: [packages/workflow/workflow-engine/src/retry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/retry.ts#L19)

#### Parameters

##### nodeId

`string`

##### error

`Error`

##### attempt

`number`

#### Returns

[`RetryDecision`](../interfaces/RetryDecision.md)
