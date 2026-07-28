[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedAuditManager

# Class: DistributedAuditManager

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts#L14)

## Constructors

### Constructor

> **new DistributedAuditManager**(): `DistributedAuditManager`

#### Returns

`DistributedAuditManager`

## Methods

### getEntries()

> **getEntries**(`sessionId?`): [`AuditEntry`](../interfaces/AuditEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts#L60)

#### Parameters

##### sessionId?

`string`

#### Returns

[`AuditEntry`](../interfaces/AuditEntry.md)[]

---

### log()

> **log**(`traceId`, `nodeId`, `sessionId`, `action`, `metadata`): [`AuditEntry`](../interfaces/AuditEntry.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts#L17)

#### Parameters

##### traceId

`string`

##### nodeId

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

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedAuditManager.ts#L42)

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`
