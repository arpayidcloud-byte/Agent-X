[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalRequest

# Interface: ApprovalRequest

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L31)

## Description

Approval request

## Properties

### agentRole

> **agentRole**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L53)

Agent role requesting the operation

---

### approvedAt?

> `optional` **approvedAt?**: `Date`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L57)

Approval timestamp

---

### approvedBy?

> `optional` **approvedBy?**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L55)

Operator who approved (if approved)

---

### category

> **category**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L35)

Tool category

---

### createdAt

> **createdAt**: `Date`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L61)

Creation timestamp

---

### expiresAt

> **expiresAt**: `Date`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L63)

Expiration timestamp

---

### firstConfirmationGiven

> **firstConfirmationGiven**: `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L47)

Whether first confirmation has been given

---

### id

> **id**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L33)

Unique request ID

---

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L67)

Metadata for the request

---

### operation

> **operation**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L37)

Operation to approve

---

### rejectionReason?

> `optional` **rejectionReason?**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L59)

Rejection reason (if rejected)

---

### requiresDoubleConfirmation

> **requiresDoubleConfirmation**: `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L45)

Whether double confirmation is required

---

### riskLevel

> **riskLevel**: [`RiskLevel`](../type-aliases/RiskLevel.md)

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L41)

Risk level classification

---

### riskScore

> **riskScore**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L39)

Risk score (0-100)

---

### state

> **state**: [`ApprovalState`](../type-aliases/ApprovalState.md)

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L43)

Current state

---

### taskId

> **taskId**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L49)

Task ID for correlation

---

### traceId

> **traceId**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L51)

Trace ID for correlation

---

### ttlMs

> **ttlMs**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L65)

TTL in milliseconds
