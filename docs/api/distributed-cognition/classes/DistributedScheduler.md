[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedScheduler

# Class: DistributedScheduler

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L4)

## Constructors

### Constructor

> **new DistributedScheduler**(`policy?`): `DistributedScheduler`

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L8)

#### Parameters

##### policy?

[`SchedulePolicy`](../interfaces/SchedulePolicy.md) = `...`

#### Returns

`DistributedScheduler`

## Methods

### assign()

> **assign**(`taskId`, `nodeId`): [`DistributedTask`](../interfaces/DistributedTask.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L38)

#### Parameters

##### taskId

`string`

##### nodeId

`string`

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md)

---

### enqueue()

> **enqueue**(`goalId`, `priority`, `metadata?`): [`DistributedTask`](../interfaces/DistributedTask.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L14)

#### Parameters

##### goalId

`string`

##### priority

`number`

##### metadata?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md)

---

### getAll()

> **getAll**(): [`DistributedTask`](../interfaces/DistributedTask.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L73)

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md)[]

---

### getPendingTasks()

> **getPendingTasks**(): [`DistributedTask`](../interfaces/DistributedTask.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L65)

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md)[]

---

### getPolicy()

> **getPolicy**(): [`SchedulePolicy`](../interfaces/SchedulePolicy.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L77)

#### Returns

[`SchedulePolicy`](../interfaces/SchedulePolicy.md)

---

### getTask()

> **getTask**(`taskId`): [`DistributedTask`](../interfaces/DistributedTask.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L61)

#### Parameters

##### taskId

`string`

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md) \| `undefined`

---

### getTasksByNode()

> **getTasksByNode**(`nodeId`): [`DistributedTask`](../interfaces/DistributedTask.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L69)

#### Parameters

##### nodeId

`string`

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md)[]

---

### transition()

> **transition**(`taskId`, `newState`): [`DistributedTask`](../interfaces/DistributedTask.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/scheduler/DistributedScheduler.ts#L53)

#### Parameters

##### taskId

`string`

##### newState

[`TaskState`](../type-aliases/TaskState.md)

#### Returns

[`DistributedTask`](../interfaces/DistributedTask.md)
