[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / TaskStatus

# Enumeration: TaskStatus

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L19)

Represents the lifecycle status of a task.

## Example

```ts
const status: TaskStatus = TaskStatus.RUNNING;
```

## Enumeration Members

### CANCELLED

> **CANCELLED**: `"CANCELLED"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L43)

Task was cancelled

---

### COMPLETED

> **COMPLETED**: `"COMPLETED"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L39)

Task has completed successfully

---

### CREATED

> **CREATED**: `"CREATED"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L21)

Task has been created but not yet queued

---

### DECOMPOSING

> **DECOMPOSING**: `"DECOMPOSING"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L25)

Task is being decomposed into subtasks

---

### FAILED

> **FAILED**: `"FAILED"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L41)

Task has failed

---

### PLANNING

> **PLANNING**: `"PLANNING"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L27)

Task is in the planning phase

---

### QUEUED

> **QUEUED**: `"QUEUED"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L23)

Task is queued and waiting to be processed

---

### RETRYING

> **RETRYING**: `"RETRYING"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L37)

Task is retrying after a failure

---

### RUNNING

> **RUNNING**: `"RUNNING"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L29)

Task is currently being executed

---

### WAITING\_APPROVAL

> **WAITING\_APPROVAL**: `"WAITING_APPROVAL"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L31)

Task is waiting for user approval

---

### WAITING\_PROVIDER

> **WAITING\_PROVIDER**: `"WAITING_PROVIDER"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L33)

Task is waiting for an external provider

---

### WAITING\_TOOL

> **WAITING\_TOOL**: `"WAITING_TOOL"`

Defined in: [packages/shared/core-runtime/src/interfaces/task.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/task.ts#L35)

Task is waiting for a tool response
