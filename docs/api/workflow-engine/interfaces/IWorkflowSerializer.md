[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / IWorkflowSerializer

# Interface: IWorkflowSerializer

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:181](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L181)

## Description

Workflow serializer

## Methods

### deserialize()

> **deserialize**(`data`): [`WorkflowDefinition`](WorkflowDefinition.md)

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:183](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L183)

#### Parameters

##### data

`string`

#### Returns

[`WorkflowDefinition`](WorkflowDefinition.md)

---

### serialize()

> **serialize**(`definition`): `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:182](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L182)

#### Parameters

##### definition

[`WorkflowDefinition`](WorkflowDefinition.md)

#### Returns

`string`
