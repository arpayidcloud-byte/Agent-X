[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalPolicyConfig

# Interface: ApprovalPolicyConfig

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L17)

## Description

Approval policy configuration

## Properties

### autoApproveThreshold

> **autoApproveThreshold**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L19)

Risk score threshold for auto-approval (default: 39)

---

### defaultTtlMs

> **defaultTtlMs**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L25)

Default TTL in milliseconds (default: 15 minutes = 900000ms)

---

### doubleConfirmationThreshold

> **doubleConfirmationThreshold**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L23)

Risk score threshold for double confirmation (default: 90)

---

### manualApprovalThreshold

> **manualApprovalThreshold**: `number`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L21)

Risk score threshold for manual approval (default: 40)

---

### requireDoubleConfirmation

> **requireDoubleConfirmation**: `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L27)

Whether to require double confirmation for high-risk operations
