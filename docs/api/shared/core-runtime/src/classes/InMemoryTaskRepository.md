[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / InMemoryTaskRepository

# Class: InMemoryTaskRepository

Defined in: [packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts#L14)

In-memory implementation of ITaskRepository for testing and development.
Stores tasks in a Map with no persistence.

## Example

```ts
const repo = new InMemoryTaskRepository();
await repo.save(task);
const found = await repo.findById(task.id);
```

## Implements

- [`ITaskRepository`](../interfaces/ITaskRepository.md)

## Constructors

### Constructor

> **new InMemoryTaskRepository**(): `InMemoryTaskRepository`

#### Returns

`InMemoryTaskRepository`

## Methods

### findById()

> **findById**(`id`): `Promise`\<[`TaskModel`](../interfaces/TaskModel.md) \| `undefined`>>>>\>

Defined in: [packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts#L30)

Finds a task by its ID.

#### Parameters

##### id

`string`

Task ID to search for

#### Returns

`Promise`\<[`TaskModel`](../interfaces/TaskModel.md) \| `undefined`\>

Task model if found, undefined otherwise

#### Implementation of

[`ITaskRepository`](../interfaces/ITaskRepository.md).[`findById`](../interfaces/ITaskRepository.md#findbyid)

---

### findByRootId()

> **findByRootId**(`rootId`): `Promise`\<[`TaskModel`](../interfaces/TaskModel.md)[]\>

Defined in: [packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts#L39)

Finds all tasks with the given root task ID.

#### Parameters

##### rootId

`string`

Root task ID to filter by

#### Returns

`Promise`\<[`TaskModel`](../interfaces/TaskModel.md)[]\>

Array of matching task models

#### Implementation of

[`ITaskRepository`](../interfaces/ITaskRepository.md).[`findByRootId`](../interfaces/ITaskRepository.md#findbyrootid)

---

### getAll()

> **getAll**(): `Promise`\<[`TaskModel`](../interfaces/TaskModel.md)[]\>

Defined in: [packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts#L47)

Retrieves all tasks from the repository.

#### Returns

`Promise`\<[`TaskModel`](../interfaces/TaskModel.md)[]\>

Array of all task models

#### Implementation of

[`ITaskRepository`](../interfaces/ITaskRepository.md).[`getAll`](../interfaces/ITaskRepository.md#getall)

---

### save()

> **save**(`task`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/repositories/in-memory-task-repository.ts#L21)

Saves a task to the repository.

#### Parameters

##### task

[`TaskModel`](../interfaces/TaskModel.md)

Task model to save

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITaskRepository`](../interfaces/ITaskRepository.md).[`save`](../interfaces/ITaskRepository.md#save)
