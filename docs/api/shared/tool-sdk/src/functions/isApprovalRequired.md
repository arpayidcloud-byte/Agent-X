[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / isApprovalRequired

# Function: isApprovalRequired()

> **isApprovalRequired**(`riskScore`, `policy`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-policy.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-policy.ts#L79)

Determines if an approval is required for a risk score

## Parameters

### riskScore

`number`

Risk score (0-100)

### policy

[`ApprovalPolicyConfig`](../interfaces/ApprovalPolicyConfig.md)

Policy configuration

## Returns

`boolean`

true if approval is required
