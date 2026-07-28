[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / IScheduler

# Interface: IScheduler

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L64)

Scheduler interface for managing the task execution queue.

## Example

```ts
await scheduler.enqueue(task);
await scheduler.pause('task-123');
await scheduler.resume('task-123');
await scheduler.cancel('task-123', 'User requested cancellation');
```

## Methods

### cancel()

> **cancel**(`taskId`, `reason`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L92)

Cancel a task.

#### Parameters

##### taskId

`string`

ID of the task to cancel

##### reason

`string`

Reason for cancellation

#### Returns

`Promise`\<`void`\>

---

### enqueue()

> **enqueue**(`task`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L70)

Add a task to the execution queue.

#### Parameters

##### task

[`TaskModel`](TaskModel.md)

The task to enqueue

#### Returns

`Promise`\<`void`\>

---

### pause()

> **pause**(`taskId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L77)

Pause a running or queued task.

#### Parameters

##### taskId

`string`

ID of the task to pause

#### Returns

`Promise`\<`void`\>

---

### resume()

> **resume**(`taskId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L84)

Resume a paused task.

#### Parameters

##### taskId

`string`

ID of the task to resume

#### Returns

`Promise`\<`void`\>
