[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedTaskDispatcher

# Class: DistributedTaskDispatcher

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L4)

## Constructors

### Constructor

> **new DistributedTaskDispatcher**(`scheduler`): `DistributedTaskDispatcher`

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L7)

#### Parameters

##### scheduler

[`DistributedScheduler`](DistributedScheduler.md)

#### Returns

`DistributedTaskDispatcher`

## Methods

### cancel()

> **cancel**(`taskId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L38)

#### Parameters

##### taskId

`string`

#### Returns

`void`

---

### complete()

> **complete**(`taskId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L30)

#### Parameters

##### taskId

`string`

#### Returns

`void`

---

### dispatch()

> **dispatch**(`taskId`, `nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L9)

#### Parameters

##### taskId

`string`

##### nodeId

`string`

#### Returns

`void`

---

### fail()

> **fail**(`taskId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L34)

#### Parameters

##### taskId

`string`

#### Returns

`void`

---

### getMigrations()

> **getMigrations**(): [`TaskMigration`](../interfaces/TaskMigration.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L42)

#### Returns

[`TaskMigration`](../interfaces/TaskMigration.md)[]

---

### migrate()

> **migrate**(`taskId`, `fromNode`, `toNode`, `reason`): [`TaskMigration`](../interfaces/TaskMigration.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/task/DistributedTaskDispatcher.ts#L14)

#### Parameters

##### taskId

`string`

##### fromNode

`string`

##### toNode

`string`

##### reason

`string`

#### Returns

[`TaskMigration`](../interfaces/TaskMigration.md)
