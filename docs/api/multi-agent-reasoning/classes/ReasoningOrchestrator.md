[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / ReasoningOrchestrator

# Class: ReasoningOrchestrator

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts#L24)

## Constructors

### Constructor

> **new ReasoningOrchestrator**(): `ReasoningOrchestrator`

#### Returns

`ReasoningOrchestrator`

## Methods

### executeReasoning()

> **executeReasoning**(`session`): `Promise`\<[`CollaborationResult`](../interfaces/CollaborationResult.md)>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts#L57)

#### Parameters

##### session

[`CollaborationSession`](../interfaces/CollaborationSession.md)

#### Returns

`Promise`\<[`CollaborationResult`](../interfaces/CollaborationResult.md)\>

---

### recoverSession()

> **recoverSession**(`sessionId`): `boolean`

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts#L81)

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`

---

### startCollaboration()

> **startCollaboration**(`goalId`, `agentIds`): `Promise`\<[`CollaborationSession`](../interfaces/CollaborationSession.md)>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/ReasoningOrchestrator.ts#L36)

#### Parameters

##### goalId

`string`

##### agentIds

`string`[]

#### Returns

`Promise`\<[`CollaborationSession`](../interfaces/CollaborationSession.md)\>
