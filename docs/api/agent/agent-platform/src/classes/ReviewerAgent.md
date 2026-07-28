[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / ReviewerAgent

# Class: ReviewerAgent

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:131](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L131)

## Extends

- [`BaseSubAgent`](BaseSubAgent.md)

## Constructors

### Constructor

> **new ReviewerAgent**(`id`, `config?`, `providerRegistry?`): `ReviewerAgent`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L132)

#### Parameters

##### id

`string`

##### config?

[`AgentConfig`](../interfaces/AgentConfig.md)

##### providerRegistry?

`ProviderRegistry`

#### Returns

`ReviewerAgent`

#### Overrides

[`BaseSubAgent`](BaseSubAgent.md).[`constructor`](BaseSubAgent.md#constructor)

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L7)

#### Inherited from

[`BaseSubAgent`](BaseSubAgent.md).[`id`](BaseSubAgent.md#id)

---

### promptTemplate?

> `protected` `readonly` `optional` **promptTemplate?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L10)

#### Inherited from

[`BaseSubAgent`](BaseSubAgent.md).[`promptTemplate`](BaseSubAgent.md#prompttemplate)

---

### providerId?

> `protected` `readonly` `optional` **providerId?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L9)

#### Inherited from

[`BaseSubAgent`](BaseSubAgent.md).[`providerId`](BaseSubAgent.md#providerid)

---

### providerRegistry

> `protected` `readonly` **providerRegistry**: `ProviderRegistry`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L11)

#### Inherited from

[`BaseSubAgent`](BaseSubAgent.md).[`providerRegistry`](BaseSubAgent.md#providerregistry)

---

### role

> `readonly` **role**: `AgentRole`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L8)

#### Inherited from

[`BaseSubAgent`](BaseSubAgent.md).[`role`](BaseSubAgent.md#role)

## Methods

### buildPrompt()

> **buildPrompt**(`task`): `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/sub-agent.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/sub-agent.ts#L136)

#### Parameters

##### task

`TaskModel`

#### Returns

`string`

#### Overrides

[`BaseSubAgent`](BaseSubAgent.md).[`buildPrompt`](BaseSubAgent.md#buildprompt)

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

#### Inherited from

[`BaseSubAgent`](BaseSubAgent.md).[`callLLM`](BaseSubAgent.md#callllm)

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

#### Inherited from

[`BaseSubAgent`](BaseSubAgent.md).[`execute`](BaseSubAgent.md#execute)
