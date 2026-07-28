[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / NodeCapabilityRegistry

# Class: NodeCapabilityRegistry

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts#L10)

## Constructors

### Constructor

> **new NodeCapabilityRegistry**(): `NodeCapabilityRegistry`

#### Returns

`NodeCapabilityRegistry`

## Methods

### findNodesWithCapability()

> **findNodesWithCapability**(`capName`): `string`[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts#L30)

#### Parameters

##### capName

`string`

#### Returns

`string`[]

---

### getAll()

> **getAll**(): [`NodeCapabilityEntry`](../interfaces/NodeCapabilityEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts#L40)

#### Returns

[`NodeCapabilityEntry`](../interfaces/NodeCapabilityEntry.md)[]

---

### getCapabilities()

> **getCapabilities**(`nodeId`): [`NodeCapabilityEntry`](../interfaces/NodeCapabilityEntry.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts#L26)

#### Parameters

##### nodeId

`string`

#### Returns

[`NodeCapabilityEntry`](../interfaces/NodeCapabilityEntry.md) \| `undefined`

---

### register()

> **register**(`nodeId`, `capabilities`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts#L13)

#### Parameters

##### nodeId

`string`

##### capabilities

[`NodeCapability`](../interfaces/NodeCapability.md)[]

#### Returns

`void`

---

### unregister()

> **unregister**(`nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeCapabilityRegistry.ts#L22)

#### Parameters

##### nodeId

`string`

#### Returns

`void`
