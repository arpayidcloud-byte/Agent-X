[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / createApprovalAuditEvent

# Function: createApprovalAuditEvent()

> **createApprovalAuditEvent**(`eventType`, `request`, `durationMs?`): [`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)

Defined in: [packages/shared/tool-sdk/src/approval/approval-events.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-events.ts#L16)

Creates an approval audit event

## Parameters

### eventType

[`ApprovalEventType`](../type-aliases/ApprovalEventType.md)

The event type

### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

The approval request

### durationMs?

`number`

Optional duration

## Returns

[`ApprovalAuditEvent`](../interfaces/ApprovalAuditEvent.md)

ApprovalAuditEvent
