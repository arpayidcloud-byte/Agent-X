[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowSession

# Class: WorkflowSession

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L8)

## Constructors

### Constructor

> **new WorkflowSession**(`traceId`): `WorkflowSession`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L15)

#### Parameters

##### traceId

`string`

#### Returns

`WorkflowSession`

## Properties

### checksum

> `readonly` **checksum**: `string`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L13)

---

### id

> `readonly` **id**: `string`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L9)

---

### startedAt

> `readonly` **startedAt**: `Date`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L12)

---

### status

> **status**: `"COMPLETED"` \| `"FAILED"` \| `"PAUSED"` \| `"CANCELLED"` \| `"ACTIVE"` = `'ACTIVE'`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L11)

---

### traceId

> `readonly` **traceId**: `string`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L10)

## Methods

### markCancelled()

> **markCancelled**(): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L29)

#### Returns

`void`

---

### markComplete()

> **markComplete**(): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L23)

#### Returns

`void`

---

### markFailed()

> **markFailed**(): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L26)

#### Returns

`void`

---

### markPaused()

> **markPaused**(): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-session.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-session.ts#L32)

#### Returns

`void`
