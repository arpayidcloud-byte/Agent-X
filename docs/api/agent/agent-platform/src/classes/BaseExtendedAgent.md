[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / BaseExtendedAgent

# Abstract Class: BaseExtendedAgent

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L18)

## Extended by

- [`DocumentationAgent`](DocumentationAgent.md)
- [`QAAgent`](QAAgent.md)

## Constructors

### Constructor

> **new BaseExtendedAgent**(`id`, `role`, `config?`, `providerRegistry?`): `BaseExtendedAgent`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L25)

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

`BaseExtendedAgent`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L19)

---

### promptTemplate?

> `protected` `readonly` `optional` **promptTemplate?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L22)

---

### providerId?

> `protected` `readonly` `optional` **providerId?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L21)

---

### providerRegistry

> `protected` `readonly` **providerRegistry**: `ProviderRegistry`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L23)

---

### role

> `readonly` **role**: `AgentRole`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L20)

## Methods

### callLLM()

> `protected` **callLLM**(`prompt`, `systemPrompt?`, `modelId?`): `Promise`\<`CompletionResponse`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L38)

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

> `abstract` **execute**(`task`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L58)

#### Parameters

##### task

`TaskModel`

##### \_context

`unknown`

#### Returns

`Promise`\<`unknown`\>
