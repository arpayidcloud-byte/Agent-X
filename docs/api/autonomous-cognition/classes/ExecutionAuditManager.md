[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ExecutionAuditManager

# Class: ExecutionAuditManager

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L61)

## Constructors

### Constructor

> **new ExecutionAuditManager**(): `ExecutionAuditManager`

#### Returns

`ExecutionAuditManager`

## Methods

### getEntries()

> **getEntries**(`goalId?`): [`AuditEntry`](../interfaces/AuditEntry.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L104)

#### Parameters

##### goalId?

`string`

#### Returns

[`AuditEntry`](../interfaces/AuditEntry.md)[]

---

### log()

> **log**(`traceId`, `goalId`, `action`, `metadata`): [`AuditEntry`](../interfaces/AuditEntry.md)

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L64)

#### Parameters

##### traceId

`string`

##### goalId

`string`

##### action

`string`

##### metadata

`Record`\<`string`, `unknown`\>

#### Returns

[`AuditEntry`](../interfaces/AuditEntry.md)

---

### verifyIntegrity()

> **verifyIntegrity**(`goalId`): `boolean`

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:87](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L87)

#### Parameters

##### goalId

`string`

#### Returns

`boolean`
