[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / AgentRegistry

# Class: AgentRegistry

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L10)

## Constructors

### Constructor

> **new AgentRegistry**(): `AgentRegistry`

#### Returns

`AgentRegistry`

## Methods

### get()

> **get**(`agentId`): [`AgentRegistration`](../interfaces/AgentRegistration.md) \| `undefined`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L39)

#### Parameters

##### agentId

`string`

#### Returns

[`AgentRegistration`](../interfaces/AgentRegistration.md) \| `undefined`

---

### heartbeat()

> **heartbeat**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L32)

#### Parameters

##### agentId

`string`

#### Returns

`void`

---

### list()

> **list**(): [`AgentRegistration`](../interfaces/AgentRegistration.md)[]

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L43)

#### Returns

[`AgentRegistration`](../interfaces/AgentRegistration.md)[]

---

### register()

> **register**(`metadata`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L13)

#### Parameters

##### metadata

[`AgentMetadata`](../interfaces/AgentMetadata.md)

#### Returns

`void`

---

### setBusy()

> **setBusy**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L47)

#### Parameters

##### agentId

`string`

#### Returns

`void`

---

### setIdle()

> **setIdle**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L52)

#### Parameters

##### agentId

`string`

#### Returns

`void`

---

### unregister()

> **unregister**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-registry.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-registry.ts#L28)

#### Parameters

##### agentId

`string`

#### Returns

`void`
