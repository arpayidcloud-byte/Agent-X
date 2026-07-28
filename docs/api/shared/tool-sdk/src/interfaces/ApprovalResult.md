[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalResult

# Interface: ApprovalResult

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L71)

## Description

Approval result

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L73)

Whether the operation was approved

---

### doubleConfirmationRequired

> **doubleConfirmationRequired**: `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L77)

Whether double confirmation was required

---

### message

> **message**: `string`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L83)

Message for the result

---

### request

> **request**: [`ApprovalRequest`](ApprovalRequest.md)

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L75)

The approval request

---

### wasCancelled

> **wasCancelled**: `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L81)

Whether the request was cancelled

---

### wasExpired

> **wasExpired**: `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L79)

Whether the request was expired
