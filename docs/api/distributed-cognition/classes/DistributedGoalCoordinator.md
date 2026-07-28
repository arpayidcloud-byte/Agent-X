[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedGoalCoordinator

# Class: DistributedGoalCoordinator

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts#L11)

## Constructors

### Constructor

> **new DistributedGoalCoordinator**(`nodeRegistry`): `DistributedGoalCoordinator`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts#L14)

#### Parameters

##### nodeRegistry

[`NodeRegistry`](NodeRegistry.md)

#### Returns

`DistributedGoalCoordinator`

## Methods

### assignGoal()

> **assignGoal**(`goalId`, `priority`, `preferredNodes?`): [`GoalPlan`](../interfaces/GoalPlan.md)

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts#L16)

#### Parameters

##### goalId

`string`

##### priority

`number`

##### preferredNodes?

`string`[] = `[]`

#### Returns

[`GoalPlan`](../interfaces/GoalPlan.md)

---

### completeGoal()

> **completeGoal**(`goalId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts#L43)

#### Parameters

##### goalId

`string`

#### Returns

`void`

---

### getAllPlans()

> **getAllPlans**(): [`GoalPlan`](../interfaces/GoalPlan.md)[]

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts#L39)

#### Returns

[`GoalPlan`](../interfaces/GoalPlan.md)[]

---

### getPlan()

> **getPlan**(`goalId`): [`GoalPlan`](../interfaces/GoalPlan.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedGoalCoordinator.ts#L35)

#### Parameters

##### goalId

`string`

#### Returns

[`GoalPlan`](../interfaces/GoalPlan.md) \| `undefined`
