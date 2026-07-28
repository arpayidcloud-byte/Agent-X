[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / TaskModel

# Interface: TaskModel

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:145](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L145)

Represents a task in the AgentX system.

## Example

```ts
const task: TaskModel = {
  id: 'task-123',
  goal: 'Analyze code',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  rootTaskId: 'task-123',
  dependsOn: [],
  traceId: 'trace-abc',
  metadata: { retryCount: 0 },
  context: { variables: {}, history: [] },
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Properties

### assignedAgentRole?

> `optional` **assignedAgentRole?**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:159](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L159)

Role of the agent assigned to this task

---

### cancellation?

> `optional` **cancellation?**: [`TaskCancellation`](TaskCancellation.md)

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:173](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L173)

Cancellation details if the task was cancelled

---

### context

> **context**: [`TaskContext`](TaskContext.md)

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:167](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L167)

Runtime context with variables and history

---

### createdAt

> **createdAt**: `Date`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:175](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L175)

Timestamp when the task was created

---

### dependsOn

> **dependsOn**: `string`[]

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:161](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L161)

IDs of tasks that must complete before this one

---

### error?

> `optional` **error?**: [`TaskError`](TaskError.md)

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:171](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L171)

Error information if the task failed

---

### goal

> **goal**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:149](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L149)

The goal or objective of the task

---

### id

> **id**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:147](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L147)

Unique identifier for the task

---

### metadata

> **metadata**: [`TaskMetadata`](TaskMetadata.md)

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L165)

Task metadata for tracking

---

### parentTaskId?

> `optional` **parentTaskId?**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:155](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L155)

ID of the parent task (if this is a subtask)

---

### priority

> **priority**: [`TaskPriority`](../enumerations/TaskPriority.md)

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L153)

Priority level for scheduling

---

### result?

> `optional` **result?**: [`TaskResult`](TaskResult.md)

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:169](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L169)

Result produced upon completion

---

### rootTaskId

> **rootTaskId**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:157](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L157)

ID of the root task in the hierarchy

---

### status

> **status**: [`TaskStatus`](../enumerations/TaskStatus.md)

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:151](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L151)

Current lifecycle status

---

### traceId

> **traceId**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:163](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L163)

Distributed tracing identifier

---

### updatedAt

> **updatedAt**: `Date`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:177](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L177)

Timestamp when the task was last updated
