[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / TaskContext

# Interface: TaskContext

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L82)

Runtime context for a task, including variables and conversation history.

## Properties

### history

> **history**: `object`[]

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L86)

Conversation history entries

#### content

> **content**: `unknown`

#### role

> **role**: `string`

---

### variables

> **variables**: `Record`\<`string`, `unknown`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L84)

Key-value variables available during task execution
