[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / updateApprovalRequest

# Function: updateApprovalRequest()

> **updateApprovalRequest**(`request`, `newState`, `updates?`): [`ApprovalRequest`](../interfaces/ApprovalRequest.md)

Defined in: [packages/shared/tool-sdk/src/approval/approval-request.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-request.ts#L59)

Updates an approval request state

## Parameters

### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

Current request

### newState

[`ApprovalState`](../type-aliases/ApprovalState.md)

New state

### updates?

`Partial`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)\> = `{}`

Additional updates

## Returns

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

Updated request
