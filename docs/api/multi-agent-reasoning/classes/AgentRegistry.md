[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / AgentRegistry

# Class: AgentRegistry

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts#L9)

## Constructors

### Constructor

> **new AgentRegistry**(): `AgentRegistry`

#### Returns

`AgentRegistry`

## Methods

### get()

> **get**(`agentId`): [`AgentRegistration`](../interfaces/AgentRegistration.md) \| `undefined`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts#L37)

#### Parameters

##### agentId

`string`

#### Returns

[`AgentRegistration`](../interfaces/AgentRegistration.md) \| `undefined`

---

### heartbeat()

> **heartbeat**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts#L30)

#### Parameters

##### agentId

`string`

#### Returns

`void`

---

### list()

> **list**(): [`AgentRegistration`](../interfaces/AgentRegistration.md)[]

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts#L41)

#### Returns

[`AgentRegistration`](../interfaces/AgentRegistration.md)[]

---

### register()

> **register**(`metadata`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts#L12)

#### Parameters

##### metadata

[`AgentMetadata`](../interfaces/AgentMetadata.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/infrastructure/registry/AgentRegistry.ts#L26)

#### Parameters

##### agentId

`string`

#### Returns

`void`
