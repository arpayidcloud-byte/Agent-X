[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / Scheduler

# Class: Scheduler

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L31)

Scheduler manages task execution lifecycle and agent dispatch.
Handles task queuing, state transitions, and concurrent execution limits.

## Example

```ts
const scheduler = new Scheduler(eventBus, taskRepo, { maxParallelAgents: 10 });
await scheduler.enqueue(task);
```

## Implements

- [`IScheduler`](../interfaces/IScheduler.md)

## Constructors

### Constructor

> **new Scheduler**(`eventBus`, `taskRepo`, `config?`, `agentRegistry?`): `Scheduler`

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L48)

Creates a new Scheduler instance.

#### Parameters

##### eventBus

[`IEventBus`](../interfaces/IEventBus.md)

Event bus for async communication and event publishing

##### taskRepo

[`ITaskRepository`](../interfaces/ITaskRepository.md)

Task repository for persistence

##### config?

[`SchedulerConfig`](../interfaces/SchedulerConfig.md) = `{}`

Optional scheduler configuration

##### agentRegistry?

[`AgentRegistry`](AgentRegistry.md)

Optional agent registry for task execution

#### Returns

`Scheduler`

## Methods

### cancel()

> **cancel**(`taskId`, `reason`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:169](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L169)

Cancels a task with the given reason.

#### Parameters

##### taskId

`string`

ID of the task to cancel

##### reason

`string`

Reason for cancellation

#### Returns

`Promise`\<`void`\>

#### Throws

TaskNotFoundError if task doesn't exist

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`cancel`](../interfaces/IScheduler.md#cancel)

---

### completeTask()

> **completeTask**(`taskId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:260](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L260)

Marks a task as completed with the given result.

#### Parameters

##### taskId

`string`

ID of the completed task

##### result

`unknown`

Task execution result

#### Returns

`Promise`\<`void`\>

---

### enqueue()

> **enqueue**(`task`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L76)

Enqueues a task for execution if it's in a valid initial state.
Transitions task to QUEUED status and triggers dispatch.

#### Parameters

##### task

[`TaskModel`](../interfaces/TaskModel.md)

Task to enqueue

#### Returns

`Promise`\<`void`\>

#### Throws

Error if task save or event publishing fails

#### Example

```ts
await scheduler.enqueue({ id: 'task-1', status: TaskStatus.CREATED, ... });
```

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`enqueue`](../interfaces/IScheduler.md#enqueue)

---

### failTask()

> **failTask**(`taskId`, `error`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:291](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L291)

Marks a task as failed with the given error.

#### Parameters

##### taskId

`string`

ID of the failed task

##### error

`unknown`

Error that caused the failure

#### Returns

`Promise`\<`void`\>

---

### getTask()

> **getTask**(`taskId`): `Promise`\<[`TaskModel`](../interfaces/TaskModel.md) \| `undefined`>>>>\>

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:322](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L322)

Retrieves a task by ID from in-flight tasks or repository.

#### Parameters

##### taskId

`string`

ID of the task to retrieve

#### Returns

`Promise`\<[`TaskModel`](../interfaces/TaskModel.md) \| `undefined`\>

Task model if found, undefined otherwise

---

### pause()

> **pause**(`taskId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:109](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L109)

Pauses a running task, transitioning it to WAITING_APPROVAL status.

#### Parameters

##### taskId

`string`

ID of the task to pause

#### Returns

`Promise`\<`void`\>

#### Throws

TaskNotFoundError if task doesn't exist

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`pause`](../interfaces/IScheduler.md#pause)

---

### resume()

> **resume**(`taskId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L137)

Resumes a paused task, transitioning it back to RUNNING status.

#### Parameters

##### taskId

`string`

ID of the task to resume

#### Returns

`Promise`\<`void`\>

#### Throws

TaskNotFoundError if task doesn't exist

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`resume`](../interfaces/IScheduler.md#resume)

---

### setAgentRegistry()

> **setAgentRegistry**(`registry`): `void`

Defined in: [packages/shared/core-runtime/src/scheduler/index.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/scheduler/index.ts#L62)

Sets the agent registry for task execution.

#### Parameters

##### registry

[`AgentRegistry`](AgentRegistry.md)

Agent registry to use for executing tasks

#### Returns

`void`
