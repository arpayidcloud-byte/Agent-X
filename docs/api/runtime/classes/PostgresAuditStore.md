[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / PostgresAuditStore

# Class: PostgresAuditStore

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L8)

## Implements

- [`IAuditStore`](../interfaces/IAuditStore.md)

## Constructors

### Constructor

> **new PostgresAuditStore**(`connectionString`): `PostgresAuditStore`

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L11)

#### Parameters

##### connectionString

`string`

#### Returns

`PostgresAuditStore`

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L40)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`delete`](../interfaces/IAuditStore.md#delete)

---

### getAll()

> **getAll**(): `Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L24)

#### Returns

`Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`getAll`](../interfaces/IAuditStore.md#getall)

---

### getBySessionId()

> **getBySessionId**(`sessionId`): `Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L32)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`getBySessionId`](../interfaces/IAuditStore.md#getbysessionid)

---

### getByTraceId()

> **getByTraceId**(`traceId`): `Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L28)

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`getByTraceId`](../interfaces/IAuditStore.md#getbytraceid)

---

### getByWorkflowId()

> **getByWorkflowId**(`workflowId`): `Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L36)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`getByWorkflowId`](../interfaces/IAuditStore.md#getbyworkflowid)

---

### getConnectionString()

> **getConnectionString**(): `string`

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L15)

#### Returns

`string`

---

### record()

> **record**(`audit`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/audit-postgres.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-postgres.ts#L19)

#### Parameters

##### audit

[`AuditRecord`](../interfaces/AuditRecord.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`record`](../interfaces/IAuditStore.md#record)
