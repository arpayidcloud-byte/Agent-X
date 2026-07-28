[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / InMemoryAuditStore

# Class: InMemoryAuditStore

Defined in: [packages/runtime/runtime/src/audit-store.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L30)

## Implements

- [`IAuditStore`](../interfaces/IAuditStore.md)

## Constructors

### Constructor

> **new InMemoryAuditStore**(): `InMemoryAuditStore`

#### Returns

`InMemoryAuditStore`

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L53)

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

Defined in: [packages/runtime/runtime/src/audit-store.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L37)

#### Returns

`Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`getAll`](../interfaces/IAuditStore.md#getall)

---

### getBySessionId()

> **getBySessionId**(`sessionId`): `Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L45)

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

Defined in: [packages/runtime/runtime/src/audit-store.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L41)

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

Defined in: [packages/runtime/runtime/src/audit-store.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L49)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`AuditRecord`](../interfaces/AuditRecord.md)[]\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`getByWorkflowId`](../interfaces/IAuditStore.md#getbyworkflowid)

---

### record()

> **record**(`audit`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L33)

#### Parameters

##### audit

[`AuditRecord`](../interfaces/AuditRecord.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAuditStore`](../interfaces/IAuditStore.md).[`record`](../interfaces/IAuditStore.md#record)
