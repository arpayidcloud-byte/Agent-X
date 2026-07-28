[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / MultiAgentOrchestrator

# Class: MultiAgentOrchestrator

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L19)

## Implements

- [`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md)

## Constructors

### Constructor

> **new MultiAgentOrchestrator**(`globalEventBus`): `MultiAgentOrchestrator`

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L41)

#### Parameters

##### globalEventBus

`IEventBus`

#### Returns

`MultiAgentOrchestrator`

## Methods

### allocateAgents()

> **allocateAgents**(`workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L100)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`allocateAgents`](../interfaces/IMultiAgentOrchestrator.md#allocateagents)

---

### createWorkflow()

> **createWorkflow**(`goal`, `budget`): `Promise`\<`string`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L73)

#### Parameters

##### goal

`string`

##### budget

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`createWorkflow`](../interfaces/IMultiAgentOrchestrator.md#createworkflow)

---

### decomposeTask()

> **decomposeTask**(`_workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L96)

#### Parameters

##### \_workflowId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`decomposeTask`](../interfaces/IMultiAgentOrchestrator.md#decomposetask)

---

### execute()

> **execute**(`workflowId`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L111)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`execute`](../interfaces/IMultiAgentOrchestrator.md#execute)

---

### merge()

> **merge**(`workflowId`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:174](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L174)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`merge`](../interfaces/IMultiAgentOrchestrator.md#merge)

---

### recover()

> **recover**(`workflowId`, `_failedAgentId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:191](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L191)

#### Parameters

##### workflowId

`string`

##### \_failedAgentId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`recover`](../interfaces/IMultiAgentOrchestrator.md#recover)

---

### shutdown()

> **shutdown**(`workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:209](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L209)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`shutdown`](../interfaces/IMultiAgentOrchestrator.md#shutdown)

---

### supervise()

> **supervise**(`_workflowId`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/orchestrator.ts:187](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/orchestrator.ts#L187)

#### Parameters

##### \_workflowId

`string`

#### Returns

`void`

#### Implementation of

[`IMultiAgentOrchestrator`](../interfaces/IMultiAgentOrchestrator.md).[`supervise`](../interfaces/IMultiAgentOrchestrator.md#supervise)
