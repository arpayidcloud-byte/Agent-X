[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / createApprovalSession

# Function: createApprovalSession()

> **createApprovalSession**(`operatorId`, `ttlMs?`): [`ApprovalSession`](../interfaces/ApprovalSession.md)

Defined in: [packages/shared/tool-sdk/src/approval/approval-session.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-session.ts#L25)

Creates a new approval session

## Parameters

### operatorId

`string`

Operator who created the session

### ttlMs?

`number` = `...`

Session TTL in milliseconds (default: 30 minutes)

## Returns

[`ApprovalSession`](../interfaces/ApprovalSession.md)

New ApprovalSession
