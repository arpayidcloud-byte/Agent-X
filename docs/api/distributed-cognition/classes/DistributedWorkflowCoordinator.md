[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedWorkflowCoordinator

# Class: DistributedWorkflowCoordinator

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts#L15)

## Constructors

### Constructor

> **new DistributedWorkflowCoordinator**(`scheduler`, `dispatcher`, `nodeRegistry`): `DistributedWorkflowCoordinator`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts#L16)

#### Parameters

##### scheduler

[`DistributedScheduler`](DistributedScheduler.md)

##### dispatcher

[`DistributedTaskDispatcher`](DistributedTaskDispatcher.md)

##### nodeRegistry

[`NodeRegistry`](NodeRegistry.md)

#### Returns

`DistributedWorkflowCoordinator`

## Methods

### assignTasks()

> **assignTasks**(`taskIds`, `nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts#L45)

#### Parameters

##### taskIds

`string`[]

##### nodeId

`string`

#### Returns

`void`

---

### completeTasks()

> **completeTasks**(`taskIds`): `void`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts#L51)

#### Parameters

##### taskIds

`string`[]

#### Returns

`void`

---

### failTasks()

> **failTasks**(`taskIds`): `void`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts#L57)

#### Parameters

##### taskIds

`string`[]

#### Returns

`void`

---

### plan()

> **plan**(`goalId`, `taskCount`): [`WorkflowPlan`](../interfaces/WorkflowPlan.md)

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts#L22)

#### Parameters

##### goalId

`string`

##### taskCount

`number`

#### Returns

[`WorkflowPlan`](../interfaces/WorkflowPlan.md)

---

### scheduleTasks()

> **scheduleTasks**(`goalId`, `taskCount`): [`DistributedTask`](../interfaces/DistributedTask.md)[]

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedWorkflowCoordinator.ts#L37)

#### Parameters

##### goalId

`string`

##### taskCount

`number`

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md)[]
