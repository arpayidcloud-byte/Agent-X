[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / InMemoryTaskRepository

# Class: InMemoryTaskRepository

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts#L3)

## Implements

- `ITaskRepository`

## Constructors

### Constructor

> **new InMemoryTaskRepository**(): `InMemoryTaskRepository`

#### Returns

`InMemoryTaskRepository`

## Methods

### findById()

> **findById**(`id`): `Promise`\<`TaskModel` \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts#L10)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`TaskModel` \| `undefined`\>

#### Implementation of

`ITaskRepository.findById`

---

### findByRootId()

> **findByRootId**(`rootId`): `Promise`\<`TaskModel`[]\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts#L14)

#### Parameters

##### rootId

`string`

#### Returns

`Promise`\<`TaskModel`[]\>

#### Implementation of

`ITaskRepository.findByRootId`

---

### getAll()

> **getAll**(): `Promise`\<`TaskModel`[]\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts#L18)

#### Returns

`Promise`\<`TaskModel`[]\>

#### Implementation of

`ITaskRepository.getAll`

---

### save()

> **save**(`task`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-task-repository.ts#L6)

#### Parameters

##### task

`TaskModel`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ITaskRepository.save`
