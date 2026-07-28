[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / TaskError

# Interface: TaskError

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:102](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L102)

Error information when a task fails.

## Properties

### code

> **code**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L104)

Machine-readable error code

---

### isRetryable

> **isRetryable**: `boolean`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L110)

Whether the task can be retried after this error

---

### message

> **message**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L106)

Human-readable error message

---

### stack?

> `optional` **stack?**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:108](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L108)

Optional stack trace
