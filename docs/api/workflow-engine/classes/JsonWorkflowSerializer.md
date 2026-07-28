[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / JsonWorkflowSerializer

# Class: JsonWorkflowSerializer

Defined in: [packages/workflow/workflow-engine/src/serializer.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/serializer.ts#L11)

JSON serializer for workflow definitions

## Implements

- [`IWorkflowSerializer`](../interfaces/IWorkflowSerializer.md)

## Constructors

### Constructor

> **new JsonWorkflowSerializer**(): `JsonWorkflowSerializer`

#### Returns

`JsonWorkflowSerializer`

## Methods

### deserialize()

> **deserialize**(`data`): [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

Defined in: [packages/workflow/workflow-engine/src/serializer.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/serializer.ts#L18)

#### Parameters

##### data

`string`

#### Returns

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Inherit Doc

#### Implementation of

[`IWorkflowSerializer`](../interfaces/IWorkflowSerializer.md).[`deserialize`](../interfaces/IWorkflowSerializer.md#deserialize)

---

### serialize()

> **serialize**(`definition`): `string`

Defined in: [packages/workflow/workflow-engine/src/serializer.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/serializer.ts#L13)

#### Parameters

##### definition

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

`string`

#### Inherit Doc

#### Implementation of

[`IWorkflowSerializer`](../interfaces/IWorkflowSerializer.md).[`serialize`](../interfaces/IWorkflowSerializer.md#serialize)
