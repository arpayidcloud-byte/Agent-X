[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IApprovalMiddleware

# Interface: IApprovalMiddleware

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L165)

## Description

Approval middleware interface

## Methods

### getApprovalStatus()

> **getApprovalStatus**(`requestId`): `Promise`\<[`ApprovalState`](../type-aliases/ApprovalState.md) \| `undefined`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:169](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L169)

Get approval request if exists

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<[`ApprovalState`](../type-aliases/ApprovalState.md) \| `undefined`\>

---

### isApprovalRequired()

> **isApprovalRequired**(`category`, `riskScore`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:167](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L167)

Check if approval is required for an operation

#### Parameters

##### category

`string`

##### riskScore

`number`

#### Returns

`boolean`
