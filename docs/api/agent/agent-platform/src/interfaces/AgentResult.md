[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / AgentResult

# Interface: AgentResult

Defined in: [packages/agent/agent-platform/src/agent.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/agent.ts#L14)

## Properties

### output

> **output**: `string`

Defined in: [packages/agent/agent-platform/src/agent.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/agent.ts#L16)

---

### success

> **success**: `boolean`

Defined in: [packages/agent/agent-platform/src/agent.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/agent.ts#L15)

---

### toolCalls?

> `optional` **toolCalls?**: `object`[]

Defined in: [packages/agent/agent-platform/src/agent.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/agent.ts#L17)

#### args

> **args**: `Record`\<`string`, `unknown`>>>>\>

#### tool

> **tool**: `string`

---

### usage?

> `optional` **usage?**: `object`

Defined in: [packages/agent/agent-platform/src/agent.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/agent.ts#L18)

#### costUsd

> **costUsd**: `number`

#### inputTokens

> **inputTokens**: `number`

#### outputTokens

> **outputTokens**: `number`
