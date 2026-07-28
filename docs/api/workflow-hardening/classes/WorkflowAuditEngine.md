[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-hardening](../README.md) / WorkflowAuditEngine

# Class: WorkflowAuditEngine

Defined in: [packages/workflow/workflow-hardening/src/audit-engine.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/audit-engine.ts#L19)

## Constructors

### Constructor

> **new WorkflowAuditEngine**(): `WorkflowAuditEngine`

#### Returns

`WorkflowAuditEngine`

## Methods

### getEntries()

> **getEntries**(): [`AuditEntry`](../interfaces/AuditEntry.md)[]

Defined in: [packages/workflow/workflow-hardening/src/audit-engine.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/audit-engine.ts#L44)

#### Returns

[`AuditEntry`](../interfaces/AuditEntry.md)[]

---

### log()

> **log**(`type`, `workflowId`, `sessionId`, `action`, `metadata`): [`AuditEntry`](../interfaces/AuditEntry.md)

Defined in: [packages/workflow/workflow-hardening/src/audit-engine.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/audit-engine.ts#L22)

#### Parameters

##### type

`string`

##### workflowId

`string`

##### sessionId

`string`

##### action

`string`

##### metadata

`Record`\<`string`, `unknown`\>

#### Returns

[`AuditEntry`](../interfaces/AuditEntry.md)
