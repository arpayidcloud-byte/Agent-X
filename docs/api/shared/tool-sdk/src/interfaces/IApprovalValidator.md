[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IApprovalValidator

# Interface: IApprovalValidator

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L119)

## Description

Approval validator interface

## Methods

### validateAction()

> **validateAction**(`request`, `action`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L123)

Validate an approval action

#### Parameters

##### request

[`ApprovalRequest`](ApprovalRequest.md)

##### action

`"approve"` \| `"reject"` \| `"cancel"`

#### Returns

`boolean`

---

### validateCreation()

> **validateCreation**(`request`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:121](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L121)

Validate an approval request before creation

#### Parameters

##### request

`Partial`\<[`ApprovalRequest`](ApprovalRequest.md)\>

#### Returns

`boolean`
