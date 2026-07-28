[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / AgentPool

# Class: AgentPool

Defined in: [packages/agent/agent-platform/src/sub-agents/agent-pool.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/agent-pool.ts#L4)

## Constructors

### Constructor

> **new AgentPool**(`config`, `factory`): `AgentPool`

Defined in: [packages/agent/agent-platform/src/sub-agents/agent-pool.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/agent-pool.ts#L11)

#### Parameters

##### config

[`AgentPoolConfig`](../interfaces/AgentPoolConfig.md)

##### factory

[`SubAgentFactory`](SubAgentFactory.md)

#### Returns

`AgentPool`

## Methods

### acquire()

> **acquire**(`role`): [`SubAgent`](../interfaces/SubAgent.md)

Defined in: [packages/agent/agent-platform/src/sub-agents/agent-pool.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/agent-pool.ts#L16)

#### Parameters

##### role

`AgentRole`

#### Returns

[`SubAgent`](../interfaces/SubAgent.md)

---

### getTotalAgentsCount()

> **getTotalAgentsCount**(): `number`

Defined in: [packages/agent/agent-platform/src/sub-agents/agent-pool.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/agent-pool.ts#L61)

#### Returns

`number`

---

### prewarm()

> **prewarm**(`role`, `count`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/agent-pool.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/agent-pool.ts#L52)

#### Parameters

##### role

`AgentRole`

##### count

`number`

#### Returns

`void`

---

### release()

> **release**(`agentId`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/agent-pool.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/agent-pool.ts#L38)

#### Parameters

##### agentId

`string`

#### Returns

`void`
