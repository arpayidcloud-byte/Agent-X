[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / BaseSubAgent

# Class: BaseSubAgent

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L6)

## Extended by

- [`PlannerAgent`](PlannerAgent.md)
- [`ArchitectAgent`](ArchitectAgent.md)
- [`CoderAgent`](CoderAgent.md)
- [`ReviewerAgent`](ReviewerAgent.md)
- [`TesterAgent`](TesterAgent.md)
- [`SecurityAgent`](SecurityAgent.md)

## Implements

- [`SubAgent`](../interfaces/SubAgent.md)

## Constructors

### Constructor

> **new BaseSubAgent**(`id`, `role`, `config?`, `providerRegistry?`): `BaseSubAgent`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L13)

#### Parameters

##### id

`string`

##### role

`AgentRole`

##### config?

[`AgentConfig`](../interfaces/AgentConfig.md)

##### providerRegistry?

`ProviderRegistry`

#### Returns

`BaseSubAgent`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L7)

#### Implementation of

[`SubAgent`](../interfaces/SubAgent.md).[`id`](../interfaces/SubAgent.md#id)

---

### promptTemplate?

> `protected` `readonly` `optional` **promptTemplate?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L10)

---

### providerId?

> `protected` `readonly` `optional` **providerId?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L9)

---

### providerRegistry

> `protected` `readonly` **providerRegistry**: `ProviderRegistry`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L11)

---

### role

> `readonly` **role**: `AgentRole`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L8)

#### Implementation of

[`SubAgent`](../interfaces/SubAgent.md).[`role`](../interfaces/SubAgent.md#role)

## Methods

### buildPrompt()

> **buildPrompt**(`task`): `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L21)

#### Parameters

##### task

`TaskModel`

#### Returns

`string`

---

### callLLM()

> `protected` **callLLM**(`prompt`, `systemPrompt?`, `modelId?`): `Promise`\<`CompletionResponse`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L31)

#### Parameters

##### prompt

`string`

##### systemPrompt?

`string`

##### modelId?

`string`

#### Returns

`Promise`\<`CompletionResponse`\>

---

### execute()

> **execute**(`task`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L47)

#### Parameters

##### task

`TaskModel`

##### \_context

`unknown`

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`SubAgent`](../interfaces/SubAgent.md).[`execute`](../interfaces/SubAgent.md#execute)
