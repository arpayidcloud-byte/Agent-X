[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / NodeDiscoveryEngine

# Class: NodeDiscoveryEngine

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts#L4)

## Constructors

### Constructor

> **new NodeDiscoveryEngine**(`registry`): `NodeDiscoveryEngine`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts#L7)

#### Parameters

##### registry

[`NodeRegistry`](NodeRegistry.md)

#### Returns

`NodeDiscoveryEngine`

## Methods

### discover()

> **discover**(`region`): [`NodeMetadata`](../interfaces/NodeMetadata.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts#L9)

#### Parameters

##### region

`string`

#### Returns

[`NodeMetadata`](../interfaces/NodeMetadata.md)[]

---

### discoverByCapability()

> **discoverByCapability**(`capability`): [`NodeMetadata`](../interfaces/NodeMetadata.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts#L16)

#### Parameters

##### capability

`string`

#### Returns

[`NodeMetadata`](../interfaces/NodeMetadata.md)[]

---

### getKnownNodes()

> **getKnownNodes**(): [`NodeRegistration`](../interfaces/NodeRegistration.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts#L41)

#### Returns

[`NodeRegistration`](../interfaces/NodeRegistration.md)[]

---

### pruneStale()

> **pruneStale**(`thresholdMs`): `string`[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts#L45)

#### Parameters

##### thresholdMs

`number`

#### Returns

`string`[]

---

### registerDiscovered()

> **registerDiscovered**(`metadata`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeDiscoveryEngine.ts#L20)

#### Parameters

##### metadata

[`NodeMetadata`](../interfaces/NodeMetadata.md)

#### Returns

`void`
