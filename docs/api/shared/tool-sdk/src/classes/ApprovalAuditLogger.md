[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalAuditLogger

# Class: ApprovalAuditLogger

Defined in: [packages/shared/tool-sdk/src/approval/approval-audit.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-audit.ts#L12)

Approval audit logger

## Constructors

### Constructor

> **new ApprovalAuditLogger**(): `ApprovalAuditLogger`

#### Returns

`ApprovalAuditLogger`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/shared/tool-sdk/src/approval/approval-audit.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-audit.ts#L64)

Clears all events

#### Returns

`void`

---

### getEvents()

> **getEvents**(): [`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Defined in: [packages/shared/tool-sdk/src/approval/approval-audit.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-audit.ts#L30)

Gets all logged events

#### Returns

[`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Array of audit events

---

### getEventsByRequest()

> **getEventsByRequest**(`requestId`): [`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Defined in: [packages/shared/tool-sdk/src/approval/approval-audit.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-audit.ts#L48)

Gets events for a specific request

#### Parameters

##### requestId

`string`

Request ID to filter

#### Returns

[`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Filtered events

---

### getEventsByTask()

> **getEventsByTask**(`taskId`): [`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Defined in: [packages/shared/tool-sdk/src/approval/approval-audit.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-audit.ts#L57)

Gets events for a specific task

#### Parameters

##### taskId

`string`

Task ID to filter

#### Returns

[`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Filtered events

---

### getEventsByType()

> **getEventsByType**(`eventType`): [`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Defined in: [packages/shared/tool-sdk/src/approval/approval-audit.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-audit.ts#L39)

Gets events filtered by type

#### Parameters

##### eventType

`string`

Event type to filter

#### Returns

[`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)[]

Filtered events

---

### log()

> **log**(`event`): `void`

Defined in: [packages/shared/tool-sdk/src/approval/approval-audit.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-audit.ts#L19)

Logs an approval audit event

#### Parameters

##### event

[`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)

The audit event to log

#### Returns

`void`
