[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / CoordinatorAuditLogger

# Class: CoordinatorAuditLogger

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-audit.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-audit.ts#L8)

## Constructors

### Constructor

> **new CoordinatorAuditLogger**(): `CoordinatorAuditLogger`

#### Returns

`CoordinatorAuditLogger`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-audit.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-audit.ts#L37)

#### Returns

`void`

---

### getRecords()

> **getRecords**(): [`CoordinatorAuditRecord`](../interfaces/CoordinatorAuditRecord.md)[]

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-audit.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-audit.ts#L33)

#### Returns

[`CoordinatorAuditRecord`](../interfaces/CoordinatorAuditRecord.md)[]

---

### log()

> **log**(`sessionId`, `traceId`, `action`, `phase`, `result`, `metadata?`): [`CoordinatorAuditRecord`](../interfaces/CoordinatorAuditRecord.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-audit.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-audit.ts#L11)

#### Parameters

##### sessionId

`string`

##### traceId

`string`

##### action

`string`

##### phase

[`ExecutionPhase`](../type-aliases/ExecutionPhase.md)

##### result

`"success"` \| `"failure"` \| `"cancelled"`

##### metadata?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

[`CoordinatorAuditRecord`](../interfaces/CoordinatorAuditRecord.md)
