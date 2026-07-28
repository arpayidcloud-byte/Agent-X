[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / EventTopic

# Enumeration: EventTopic

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L56)

Well-known event topics in the AgentX system.

## Example

```ts
await eventBus.publish(EventTopic.TASK_CREATED, taskData, traceId);
```

## Enumeration Members

### PROVIDER\_CALL\_COMPLETED

> **PROVIDER\_CALL\_COMPLETED**: `"provider.call_completed"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L86)

A provider call has completed

---

### TASK\_APPROVAL\_REQUIRED

> **TASK\_APPROVAL\_REQUIRED**: `"task.approval_required"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L70)

A task requires approval before proceeding

---

### TASK\_APPROVAL\_RESOLVED

> **TASK\_APPROVAL\_RESOLVED**: `"task.approval_resolved"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L72)

An approval decision has been made

---

### TASK\_CANCELLED

> **TASK\_CANCELLED**: `"task.cancelled"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L82)

A task was cancelled

---

### TASK\_COMPLETED

> **TASK\_COMPLETED**: `"task.completed"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L78)

A task has completed successfully

---

### TASK\_CREATED

> **TASK\_CREATED**: `"task.created"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L58)

A new task has been created

---

### TASK\_FAILED

> **TASK\_FAILED**: `"task.failed"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L80)

A task has failed

---

### TASK\_QUEUED

> **TASK\_QUEUED**: `"task.queued"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L60)

A task has been added to the queue

---

### TASK\_RETRYING

> **TASK\_RETRYING**: `"task.retrying"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L66)

A task is retrying after a failure

---

### TASK\_STARTED

> **TASK\_STARTED**: `"task.started"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L62)

A task has started execution

---

### TASK\_STATE\_CHANGED

> **TASK\_STATE\_CHANGED**: `"task.state_changed"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L64)

A task has changed its lifecycle state

---

### TASK\_WAITING\_APPROVAL

> **TASK\_WAITING\_APPROVAL**: `"task.waiting_approval"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L68)

A task is waiting for user approval

---

### TASK\_WAITING\_PROVIDER

> **TASK\_WAITING\_PROVIDER**: `"task.waiting_provider"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L74)

A task is waiting for an external provider

---

### TASK\_WAITING\_TOOL

> **TASK\_WAITING\_TOOL**: `"task.waiting_tool"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L76)

A task is waiting for a tool response

---

### TOOL\_INVOKED

> **TOOL\_INVOKED**: `"tool.invoked"`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L84)

A tool has been invoked
