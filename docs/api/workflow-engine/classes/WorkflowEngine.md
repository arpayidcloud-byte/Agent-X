[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / WorkflowEngine

# Class: WorkflowEngine

Defined in: [packages/workflow/workflow-engine/src/engine.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L33)

## Constructors

### Constructor

> **new WorkflowEngine**(): `WorkflowEngine`

#### Returns

`WorkflowEngine`

## Methods

### cancel()

> **cancel**(): `void`

Defined in: [packages/workflow/workflow-engine/src/engine.ts:120](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L120)

#### Returns

`void`

---

### compile()

> **compile**(`_workflow`): `void`

Defined in: [packages/workflow/workflow-engine/src/engine.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L40)

#### Parameters

##### \_workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

`void`

---

### execute()

> **execute**(`workflow`): `Promise`\<[`WorkflowMetrics`](../interfaces/WorkflowMetrics.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/engine.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L48)

#### Parameters

##### workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

`Promise`\<[`WorkflowMetrics`](../interfaces/WorkflowMetrics.md)\>

---

### getHistory()

> **getHistory**(): [`ExecutionHistoryEntry`](../interfaces/ExecutionHistoryEntry.md)[]

Defined in: [packages/workflow/workflow-engine/src/engine.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L129)

#### Returns

[`ExecutionHistoryEntry`](../interfaces/ExecutionHistoryEntry.md)[]

---

### getNodeState()

> **getNodeState**(`nodeId`): [`NodeState`](../type-aliases/NodeState.md) \| `undefined`

Defined in: [packages/workflow/workflow-engine/src/engine.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L126)

#### Parameters

##### nodeId

`string`

#### Returns

[`NodeState`](../type-aliases/NodeState.md) \| `undefined`

---

### getState()

> **getState**(): [`WorkflowState`](../type-aliases/WorkflowState.md)

Defined in: [packages/workflow/workflow-engine/src/engine.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L123)

#### Returns

[`WorkflowState`](../type-aliases/WorkflowState.md)

---

### pause()

> **pause**(): `void`

Defined in: [packages/workflow/workflow-engine/src/engine.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L114)

#### Returns

`void`

---

### resume()

> **resume**(): `void`

Defined in: [packages/workflow/workflow-engine/src/engine.ts:117](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/engine.ts#L117)

#### Returns

`void`
