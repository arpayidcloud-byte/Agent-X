[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / CreateApprovalRequestParams

# Interface: CreateApprovalRequestParams

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:143](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L143)

## Description

Parameters for creating an approval request

## Properties

### agentRole

> **agentRole**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:157](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L157)

Agent role

---

### category

> **category**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:145](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L145)

Tool category

---

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:161](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L161)

Additional metadata

---

### operation

> **operation**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:147](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L147)

Operation to approve

---

### riskLevel

> **riskLevel**: [`RiskLevel`](../type-aliases/RiskLevel.md)

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:151](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L151)

Risk level

---

### riskScore

> **riskScore**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:149](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L149)

Risk score (0-100)

---

### taskId

> **taskId**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L153)

Task ID

---

### traceId

> **traceId**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:155](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L155)

Trace ID

---

### ttlMs?

> `optional` **ttlMs?**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:159](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L159)

TTL override in milliseconds
