[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / IAuditStore

# Interface: IAuditStore

Defined in: [packages/runtime/runtime/src/audit-store.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L21)

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L27)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### getAll()

> **getAll**(): `Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L23)

#### Returns

`Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

---

### getBySessionId()

> **getBySessionId**(`sessionId`): `Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L25)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

---

### getByTraceId()

> **getByTraceId**(`traceId`): `Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L24)

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

---

### getByWorkflowId()

> **getByWorkflowId**(`workflowId`): `Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L26)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`AuditRecord`](AuditRecord.md)[]\>

---

### record()

> **record**(`audit`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/audit-store.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/audit-store.ts#L22)

#### Parameters

##### audit

[`AuditRecord`](AuditRecord.md)

#### Returns

`Promise`\<`void`\>
