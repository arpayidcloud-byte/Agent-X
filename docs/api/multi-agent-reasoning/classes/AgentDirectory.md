[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / AgentDirectory

# Class: AgentDirectory

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts#L11)

## Constructors

### Constructor

> **new AgentDirectory**(): `AgentDirectory`

#### Returns

`AgentDirectory`

## Methods

### allocate()

> **allocate**(`agentId`): `boolean`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts#L28)

#### Parameters

##### agentId

`string`

#### Returns

`boolean`

---

### discover()

> **discover**(`requiredCapabilities`): [`CapabilityMatch`](../interfaces/CapabilityMatch.md)

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts#L40)

#### Parameters

##### requiredCapabilities

`string`[]

#### Returns

[`CapabilityMatch`](../interfaces/CapabilityMatch.md)

---

### getAllCapabilities()

> **getAllCapabilities**(): `string`[]

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts#L59)

#### Returns

`string`[]

---

### register()

> **register**(`agentId`, `capabilities`, `priority`, `slots`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts#L14)

#### Parameters

##### agentId

`string`

##### capabilities

`string`[]

##### priority

`number`

##### slots

`number`

#### Returns

`void`

---

### release()

> **release**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts#L35)

#### Parameters

##### agentId

`string`

#### Returns

`void`

---

### unregister()

> **unregister**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentDirectory.ts#L24)

#### Parameters

##### agentId

`string`

#### Returns

`void`
