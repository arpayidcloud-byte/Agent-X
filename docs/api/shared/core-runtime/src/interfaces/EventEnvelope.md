[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / EventEnvelope

# Interface: EventEnvelope\<T\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L27)

Envelope wrapping all events with metadata for tracing and idempotency.

## Example

```ts
const envelope: EventEnvelope<{ status: string }> = {
  id: 'evt-001',
  topic: 'task.state_changed',
  traceId: 'trace-abc',
  taskId: 'task-123',
  timestamp: new Date(),
  version: '1.0',
  sourceModule: 'scheduler',
  payload: { status: 'RUNNING' },
};
```

## Type Parameters

### T

`T` = `unknown`

The shape of the event payload

## Properties

### id

> **id**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L29)

Unique event identifier for idempotency and deduplication

---

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L45)

Optional additional metadata

---

### payload

> **payload**: `T`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L43)

The event payload data

---

### sourceModule

> **sourceModule**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L41)

Module that produced this event

---

### taskId?

> `optional` **taskId?**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L35)

Associated task identifier (if applicable)

---

### timestamp

> **timestamp**: `Date`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L37)

Timestamp when the event was created

---

### topic

> **topic**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L31)

The topic this event belongs to

---

### traceId

> **traceId**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L33)

Distributed tracing identifier

---

### version

> **version**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L39)

Event schema version
