[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedRecoveryManager

# Class: DistributedRecoveryManager

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts#L11)

## Constructors

### Constructor

> **new DistributedRecoveryManager**(`checkpointManager`): `DistributedRecoveryManager`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts#L14)

#### Parameters

##### checkpointManager

[`DistributedCheckpointManager`](DistributedCheckpointManager.md)

#### Returns

`DistributedRecoveryManager`

## Methods

### cancelRecovery()

> **cancelRecovery**(`sessionId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts#L40)

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`

---

### executeRecovery()

> **executeRecovery**(`sessionId`): `Record`\<`string`, `unknown`> > > > \> \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts#L30)

#### Parameters

##### sessionId

`string`

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

---

### getPlan()

> **getPlan**(`sessionId`): [`RecoveryPlan`](../interfaces/RecoveryPlan.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts#L36)

#### Parameters

##### sessionId

`string`

#### Returns

[`RecoveryPlan`](../interfaces/RecoveryPlan.md) \| `undefined`

---

### planRecovery()

> **planRecovery**(`sessionId`, `targetNodeId`): [`RecoveryPlan`](../interfaces/RecoveryPlan.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedRecoveryManager.ts#L16)

#### Parameters

##### sessionId

`string`

##### targetNodeId

`string`

#### Returns

[`RecoveryPlan`](../interfaces/RecoveryPlan.md)
