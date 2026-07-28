[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [packages/agent/agent-platform/src/sub-agents/resource-manager.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/resource-manager.ts#L4)

## Constructors

### Constructor

> **new ResourceManager**(`globalLimits`): `ResourceManager`

Defined in: [packages/agent/agent-platform/src/sub-agents/resource-manager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/resource-manager.ts#L9)

#### Parameters

##### globalLimits

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)

#### Returns

`ResourceManager`

## Methods

### getBusyAgentsCount()

> **getBusyAgentsCount**(): `number`

Defined in: [packages/agent/agent-platform/src/sub-agents/resource-manager.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/resource-manager.ts#L61)

#### Returns

`number`

---

### getIdleAgentsCount()

> **getIdleAgentsCount**(`poolTotal`): `number`

Defined in: [packages/agent/agent-platform/src/sub-agents/resource-manager.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/resource-manager.ts#L57)

#### Parameters

##### poolTotal

`number`

#### Returns

`number`

---

### recordUsage()

> **recordUsage**(`usage`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/resource-manager.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/resource-manager.ts#L44)

#### Parameters

##### usage

`Partial`\<[`ResourceUsage`](../interfaces/ResourceUsage.md)\>

#### Returns

`void`

---

### registerAgent()

> **registerAgent**(`agentId`, `requestedAllocation`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/resource-manager.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/resource-manager.ts#L21)

#### Parameters

##### agentId

`string`

##### requestedAllocation

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)

#### Returns

`void`

---

### unregisterAgent()

> **unregisterAgent**(`agentId`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/resource-manager.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/resource-manager.ts#L40)

#### Parameters

##### agentId

`string`

#### Returns

`void`
