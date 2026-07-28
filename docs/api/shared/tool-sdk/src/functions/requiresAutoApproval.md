[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / requiresAutoApproval

# Function: requiresAutoApproval()

> **requiresAutoApproval**(`riskScore`, `policy`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-policy.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-policy.ts#L35)

Determines if a risk score requires auto-approval

## Parameters

### riskScore

`number`

Risk score (0-100)

### policy

[`ApprovalPolicyConfig`](../interfaces/ApprovalPolicyConfig.md)

Policy configuration

## Returns

`boolean`

true if auto-approval is sufficient
