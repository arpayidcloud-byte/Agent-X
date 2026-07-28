[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / VersionedExecutionSnapshot

# Interface: VersionedExecutionSnapshot

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:124](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L124)

## Description

Extended execution snapshot with versioning

## Extends

- [`ExecutionSnapshot`](ExecutionSnapshot.md)

## Properties

### checksum

> **checksum**: `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:130](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L130)

---

### createdBy

> **createdBy**: `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L129)

---

### engineVersion

> **engineVersion**: `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L127)

---

### nodeStates

> **nodeStates**: `Map`\<`string`, [`NodeState`](../type-aliases/NodeState.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L153)

#### Inherited from

[`ExecutionSnapshot`](ExecutionSnapshot.md).[`nodeStates`](ExecutionSnapshot.md#nodestates)

---

### results

> **results**: `Map`\<`string`, `unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:154](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L154)

#### Inherited from

[`ExecutionSnapshot`](ExecutionSnapshot.md).[`results`](ExecutionSnapshot.md#results)

---

### schemaVersion

> **schemaVersion**: `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L125)

---

### snapshotVersion

> **snapshotVersion**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L128)

---

### timestamp

> **timestamp**: `Date`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:155](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L155)

#### Inherited from

[`ExecutionSnapshot`](ExecutionSnapshot.md).[`timestamp`](ExecutionSnapshot.md#timestamp)

---

### version

> **version**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:156](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L156)

#### Inherited from

[`ExecutionSnapshot`](ExecutionSnapshot.md).[`version`](ExecutionSnapshot.md#version)

---

### workflowId

> **workflowId**: `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:152](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L152)

#### Inherited from

[`ExecutionSnapshot`](ExecutionSnapshot.md).[`workflowId`](ExecutionSnapshot.md#workflowid)

---

### workflowVersion

> **workflowVersion**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L126)
