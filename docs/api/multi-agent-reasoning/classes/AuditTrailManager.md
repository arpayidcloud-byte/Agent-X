[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / AuditTrailManager

# Class: AuditTrailManager

Defined in: [packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts#L18)

## Constructors

### Constructor

> **new AuditTrailManager**(): `AuditTrailManager`

#### Returns

`AuditTrailManager`

## Methods

### getEntries()

> **getEntries**(): [`AuditEntry`](../interfaces/AuditEntry.md)[]

Defined in: [packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts#L56)

#### Returns

[`AuditEntry`](../interfaces/AuditEntry.md)[]

---

### log()

> **log**(`traceId`, `sessionId`, `action`, `metadata`): [`AuditEntry`](../interfaces/AuditEntry.md)

Defined in: [packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts#L21)

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

[`AuditEntry`](../interfaces/AuditEntry.md)

---

### verifyIntegrity()

> **verifyIntegrity**(`sessionId`): `boolean`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/audit/AuditTrailManager.ts#L42)

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`
