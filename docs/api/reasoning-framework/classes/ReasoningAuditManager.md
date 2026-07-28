[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / ReasoningAuditManager

# Class: ReasoningAuditManager

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-audit.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-audit.ts#L9)

## Constructors

### Constructor

> **new ReasoningAuditManager**(): `ReasoningAuditManager`

#### Returns

`ReasoningAuditManager`

## Methods

### getRecords()

> **getRecords**(): [`ReasoningAuditRecord`](../interfaces/ReasoningAuditRecord.md)[]

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-audit.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-audit.ts#L29)

#### Returns

[`ReasoningAuditRecord`](../interfaces/ReasoningAuditRecord.md)[]

---

### log()

> **log**(`traceId`, `sessionId`, `action`, `metadata`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-audit.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-audit.ts#L12)

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
