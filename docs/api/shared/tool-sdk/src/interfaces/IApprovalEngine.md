[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IApprovalEngine

# Interface: IApprovalEngine

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L127)

## Description

Approval engine interface

## Methods

### approve()

> **approve**(`requestId`, `operatorId`, `confirmed?`): `Promise`\<[`ApprovalResult`](ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:131](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L131)

Approve a request

#### Parameters

##### requestId

`string`

##### operatorId

`string`

##### confirmed?

`boolean`

#### Returns

`Promise`\<[`ApprovalResult`](ApprovalResult.md)\>

---

### cancel()

> **cancel**(`requestId`, `operatorId`): `Promise`\<[`ApprovalResult`](ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L135)

Cancel a request

#### Parameters

##### requestId

`string`

##### operatorId

`string`

#### Returns

`Promise`\<[`ApprovalResult`](ApprovalResult.md)\>

---

### createRequest()

> **createRequest**(`params`): `Promise`\<[`ApprovalRequest`](ApprovalRequest.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L129)

Create an approval request

#### Parameters

##### params

[`CreateApprovalRequestParams`](CreateApprovalRequestParams.md)

#### Returns

`Promise`\<[`ApprovalRequest`](ApprovalRequest.md)\>

---

### execute()

> **execute**(`requestId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:139](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L139)

Execute approved operation

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<`void`\>

---

### getRequest()

> **getRequest**(`requestId`): `Promise`\<[`ApprovalRequest`](ApprovalRequest.md) \| `undefined`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L137)

Get request status

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<[`ApprovalRequest`](ApprovalRequest.md) \| `undefined`\>

---

### reject()

> **reject**(`requestId`, `operatorId`, `reason?`): `Promise`\<[`ApprovalResult`](ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:133](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L133)

Reject a request

#### Parameters

##### requestId

`string`

##### operatorId

`string`

##### reason?

`string`

#### Returns

`Promise`\<[`ApprovalResult`](ApprovalResult.md)\>
