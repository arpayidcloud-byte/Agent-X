[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / ITaskRepository

# Interface: ITaskRepository

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L105)

Repository interface for persisting and retrieving tasks.

## Example

```ts
await repo.save(task);
const found = await repo.findById('task-123');
const children = await repo.findByRootId('task-root');
```

## Methods

### findById()

> **findById**(`id`): `Promise`\<[`TaskModel`](TaskModel.md) \| `undefined`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L119)

Find a task by its unique identifier.

#### Parameters

##### id

`string`

The task ID to look up

#### Returns

`Promise`\<[`TaskModel`](TaskModel.md) \| `undefined`\>

The task if found, otherwise `undefined`

---

### findByRootId()

> **findByRootId**(`rootId`): `Promise`\<[`TaskModel`](TaskModel.md)[]\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L127)

Find all tasks belonging to a root task.

#### Parameters

##### rootId

`string`

The root task ID

#### Returns

`Promise`\<[`TaskModel`](TaskModel.md)[]\>

Array of matching tasks

---

### getAll()

> **getAll**(): `Promise`\<[`TaskModel`](TaskModel.md)[]\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:134](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L134)

Retrieve all tasks.

#### Returns

`Promise`\<[`TaskModel`](TaskModel.md)[]\>

Array of all tasks

---

### save()

> **save**(`task`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L111)

Persist a task (create or update).

#### Parameters

##### task

[`TaskModel`](TaskModel.md)

The task to save

#### Returns

`Promise`\<`void`\>
