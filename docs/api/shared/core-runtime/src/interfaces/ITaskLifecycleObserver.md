[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / ITaskLifecycleObserver

# Interface: ITaskLifecycleObserver

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:149](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L149)

Observer interface for reacting to task lifecycle changes.

## Example

```ts
const observer: ITaskLifecycleObserver = {
  onStateChange: async (task, previous) => {
    console.log(`Task ${task.id}: ${previous} -> ${task.status}`);
  },
};
```

## Methods

### onStateChange()

> **onStateChange**(`task`, `previous`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:156](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L156)

Called when a task transitions to a new state.

#### Parameters

##### task

[`TaskModel`](TaskModel.md)

The task in its new state

##### previous

`string`

The previous state string

#### Returns

`Promise`\<`void`\>
