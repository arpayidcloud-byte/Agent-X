[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / TaskMetadata

# Interface: TaskMetadata

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L68)

Metadata associated with a task for tracking retries, providers, and tools.

## Indexable

> \[`key`: `string`\]: `unknown`

Additional arbitrary metadata

## Properties

### providerId?

> `optional` **providerId?**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L72)

ID of the provider handling this task

---

### retryCount

> **retryCount**: `number`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L70)

Number of retry attempts made

---

### toolName?

> `optional` **toolName?**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L74)

Name of the tool being used
