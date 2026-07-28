[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalManager

# Class: ApprovalManager

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L24)

Approval manager coordinating the full approval workflow

## Constructors

### Constructor

> **new ApprovalManager**(): `ApprovalManager`

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L28)

#### Returns

`ApprovalManager`

## Methods

### approve()

> **approve**(`requestId`, `operatorId`, `confirmed?`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L66)

Approves a request

#### Parameters

##### requestId

`string`

Request ID

##### operatorId

`string`

Operator ID

##### confirmed?

`boolean`

Whether double confirmation is given

#### Returns

`Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)\>

ApprovalResult

---

### cancel()

> **cancel**(`requestId`, `operatorId`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L91)

Cancels a request

#### Parameters

##### requestId

`string`

Request ID

##### operatorId

`string`

Operator ID

#### Returns

`Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)\>

ApprovalResult

---

### checkExpirations()

> **checkExpirations**(): `Promise`\<`string`[]\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L99)

Checks for expired requests

#### Returns

`Promise`\<`string`[]\>

Array of expired request IDs

---

### createRequest()

> **createRequest**(`params`, `operatorId`): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L38)

Creates an approval request within a session

#### Parameters

##### params

[`CreateApprovalRequestParams`](../interfaces/CreateApprovalRequestParams.md)

Creation parameters

##### operatorId

`string`

Operator ID for the session

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)\>

ApprovalRequest

---

### getService()

> **getService**(): [`ApprovalService`](ApprovalService.md)

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L135)

Gets the underlying service

#### Returns

[`ApprovalService`](ApprovalService.md)

ApprovalService

---

### reject()

> **reject**(`requestId`, `operatorId`, `reason?`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-manager.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-manager.ts#L81)

Rejects a request

#### Parameters

##### requestId

`string`

Request ID

##### operatorId

`string`

Operator ID

##### reason?

`string`

Rejection reason

#### Returns

`Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)\>

ApprovalResult
