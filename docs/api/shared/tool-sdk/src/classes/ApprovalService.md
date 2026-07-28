[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalService

# Class: ApprovalService

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L21)

Approval service providing high-level API

## Constructors

### Constructor

> **new ApprovalService**(`store?`): `ApprovalService`

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L25)

#### Parameters

##### store?

[`IApprovalStore`](../interfaces/IApprovalStore.md)

#### Returns

`ApprovalService`

## Methods

### approve()

> **approve**(`requestId`, `operatorId`, `confirmed?`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L56)

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

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L81)

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

### createRequest()

> **createRequest**(`params`): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L45)

Creates an approval request

#### Parameters

##### params

[`CreateApprovalRequestParams`](../interfaces/CreateApprovalRequestParams.md)

Creation parameters

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)\>

ApprovalRequest

---

### execute()

> **execute**(`requestId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L98)

Executes an approved request

#### Parameters

##### requestId

`string`

Request ID

#### Returns

`Promise`\<`void`\>

---

### getEngine()

> **getEngine**(): [`IApprovalEngine`](../interfaces/IApprovalEngine.md)

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L106)

Gets the underlying engine

#### Returns

[`IApprovalEngine`](../interfaces/IApprovalEngine.md)

IApprovalEngine

---

### getRequest()

> **getRequest**(`requestId`): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md) \| `undefined`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L90)

Gets a request by ID

#### Parameters

##### requestId

`string`

Request ID

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md) \| `undefined`\>

ApprovalRequest or undefined

---

### isApprovalRequired()

> **isApprovalRequired**(`riskScore`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L35)

Checks if approval is required for an operation

#### Parameters

##### riskScore

`number`

Risk score (0-100)

#### Returns

`boolean`

true if approval is required

---

### reject()

> **reject**(`requestId`, `operatorId`, `reason?`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-service.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-service.ts#L71)

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
