[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / QAAgent

# Class: QAAgent

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:109](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L109)

## Extends

- [`BaseExtendedAgent`](BaseExtendedAgent.md)

## Constructors

### Constructor

> **new QAAgent**(`id`, `config?`, `providerRegistry?`): `QAAgent`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L110)

#### Parameters

##### id

`string`

##### config?

[`AgentConfig`](../interfaces/AgentConfig.md)

##### providerRegistry?

`ProviderRegistry`

#### Returns

`QAAgent`

#### Overrides

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`constructor`](BaseExtendedAgent.md#constructor)

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L19)

#### Inherited from

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`id`](BaseExtendedAgent.md#id)

---

### promptTemplate?

> `protected` `readonly` `optional` **promptTemplate?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L22)

#### Inherited from

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`promptTemplate`](BaseExtendedAgent.md#prompttemplate)

---

### providerId?

> `protected` `readonly` `optional` **providerId?**: `string`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L21)

#### Inherited from

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`providerId`](BaseExtendedAgent.md#providerid)

---

### providerRegistry

> `protected` `readonly` **providerRegistry**: `ProviderRegistry`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L23)

#### Inherited from

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`providerRegistry`](BaseExtendedAgent.md#providerregistry)

---

### role

> `readonly` **role**: `AgentRole`

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L20)

#### Inherited from

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`role`](BaseExtendedAgent.md#role)

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

#### Inherited from

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`callLLM`](BaseExtendedAgent.md#callllm)

---

### execute()

> **execute**(`task`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/extended-agents.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/extended-agents.ts#L114)

#### Parameters

##### task

`TaskModel`

##### \_context

`unknown`

#### Returns

`Promise`\<`unknown`\>

#### Overrides

[`BaseExtendedAgent`](BaseExtendedAgent.md).[`execute`](BaseExtendedAgent.md#execute)
