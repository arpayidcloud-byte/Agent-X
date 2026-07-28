[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / AuditStore

# Class: AuditStore

Defined in: [packages/runtime/runtime/src/runtime-audit.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-audit.ts#L11)

In-memory audit store

## Constructors

### Constructor

> **new AuditStore**(): `AuditStore`

#### Returns

`AuditStore`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-audit.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-audit.ts#L63)

Clears all records

#### Returns

`void`

---

### getAll()

> **getAll**(): [`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Defined in: [packages/runtime/runtime/src/runtime-audit.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-audit.ts#L29)

Gets all records

#### Returns

[`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Array of audit records

---

### getBySessionId()

> **getBySessionId**(`sessionId`): [`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Defined in: [packages/runtime/runtime/src/runtime-audit.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-audit.ts#L47)

Gets records by session ID

#### Parameters

##### sessionId

`string`

Session ID

#### Returns

[`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Filtered records

---

### getByTraceId()

> **getByTraceId**(`traceId`): [`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Defined in: [packages/runtime/runtime/src/runtime-audit.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-audit.ts#L38)

Gets records by trace ID

#### Parameters

##### traceId

`string`

Trace ID

#### Returns

[`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Filtered records

---

### getByWorkflowId()

> **getByWorkflowId**(`workflowId`): [`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Defined in: [packages/runtime/runtime/src/runtime-audit.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-audit.ts#L56)

Gets records by workflow ID

#### Parameters

##### workflowId

`string`

Workflow ID

#### Returns

[`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Filtered records

---

### record()

> **record**(`record`): `void`

Defined in: [packages/runtime/runtime/src/runtime-audit.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-audit.ts#L18)

Records an audit entry

#### Parameters

##### record

[`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)

The audit record

#### Returns

`void`
