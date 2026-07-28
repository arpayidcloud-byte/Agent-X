[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / TaskContextBuilder

# Class: TaskContextBuilder

Defined in: [packages/shared/core-runtime/src/context/task-context-builder.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/task-context-builder.ts#L14)

## Constructors

### Constructor

> **new TaskContextBuilder**(`memory`, `config?`): `TaskContextBuilder`

Defined in: [packages/shared/core-runtime/src/context/task-context-builder.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/task-context-builder.ts#L17)

#### Parameters

##### memory

[`MemoryReference`](../interfaces/MemoryReference.md)

##### config?

[`TaskContextBuilderConfig`](../interfaces/TaskContextBuilderConfig.md)

#### Returns

`TaskContextBuilder`

## Methods

### build()

> **build**(`taskId`): `Promise`\<[`TaskContext`](../interfaces/TaskContext.md)>>>>\>

Defined in: [packages/shared/core-runtime/src/context/task-context-builder.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/task-context-builder.ts#L24)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<[`TaskContext`](../interfaces/TaskContext.md)\>
