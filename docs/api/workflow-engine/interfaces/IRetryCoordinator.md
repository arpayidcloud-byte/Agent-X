[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / IRetryCoordinator

# Interface: IRetryCoordinator

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:170](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L170)

## Description

Retry coordinator interface

## Methods

### getRetryBudget()

> **getRetryBudget**(`nodeId`): [`RetryBudget`](RetryBudget.md)

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:172](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L172)

#### Parameters

##### nodeId

`string`

#### Returns

[`RetryBudget`](RetryBudget.md)

---

### recordAttempt()

> **recordAttempt**(`nodeId`): `void`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:173](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L173)

#### Parameters

##### nodeId

`string`

#### Returns

`void`

---

### resetBudgets()

> **resetBudgets**(): `void`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:174](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L174)

#### Returns

`void`

---

### shouldRetry()

> **shouldRetry**(`nodeId`, `error`, `attempt`): [`RetryDecision`](RetryDecision.md)

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:171](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L171)

#### Parameters

##### nodeId

`string`

##### error

`Error`

##### attempt

`number`

#### Returns

[`RetryDecision`](RetryDecision.md)
