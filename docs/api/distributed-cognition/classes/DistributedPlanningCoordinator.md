[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedPlanningCoordinator

# Class: DistributedPlanningCoordinator

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts#L18)

## Constructors

### Constructor

> **new DistributedPlanningCoordinator**(`nodeRegistry`): `DistributedPlanningCoordinator`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts#L21)

#### Parameters

##### nodeRegistry

[`NodeRegistry`](NodeRegistry.md)

#### Returns

`DistributedPlanningCoordinator`

## Methods

### createPlan()

> **createPlan**(`goalId`, `requiredCapabilities`): [`PlanningResult`](../interfaces/PlanningResult.md)

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts#L23)

#### Parameters

##### goalId

`string`

##### requiredCapabilities

`string`[]

#### Returns

[`PlanningResult`](../interfaces/PlanningResult.md)

---

### getPlans()

> **getPlans**(): [`PlanningResult`](../interfaces/PlanningResult.md)[]

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedPlanningCoordinator.ts#L55)

#### Returns

[`PlanningResult`](../interfaces/PlanningResult.md)[]
