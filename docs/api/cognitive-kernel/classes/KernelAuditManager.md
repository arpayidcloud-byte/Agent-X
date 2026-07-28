[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelAuditManager

# Class: KernelAuditManager

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-audit.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-audit.ts#L9)

## Constructors

### Constructor

> **new KernelAuditManager**(): `KernelAuditManager`

#### Returns

`KernelAuditManager`

## Methods

### getRecords()

> **getRecords**(): [`AuditRecord`](../interfaces/AuditRecord.md)[]

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-audit.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-audit.ts#L29)

#### Returns

[`AuditRecord`](../interfaces/AuditRecord.md)[]

---

### log()

> **log**(`traceId`, `sessionId`, `action`, `metadata`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-audit.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-audit.ts#L12)

#### Parameters

##### traceId

`string`

##### sessionId

`string`

##### action

`string`

##### metadata

`Record`\<`string`, `unknown`\>

#### Returns

`void`
