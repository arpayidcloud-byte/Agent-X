[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / NodeRegistry

# Class: NodeRegistry

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L3)

## Constructors

### Constructor

> **new NodeRegistry**(): `NodeRegistry`

#### Returns

`NodeRegistry`

## Methods

### findNodesByCapability()

> **findNodesByCapability**(`capability`): [`NodeRegistration`](../interfaces/NodeRegistration.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L46)

#### Parameters

##### capability

`string`

#### Returns

[`NodeRegistration`](../interfaces/NodeRegistration.md)[]

---

### get()

> **get**(`nodeId`): [`NodeRegistration`](../interfaces/NodeRegistration.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L24)

#### Parameters

##### nodeId

`string`

#### Returns

[`NodeRegistration`](../interfaces/NodeRegistration.md) \| `undefined`

---

### getAll()

> **getAll**(): [`NodeRegistration`](../interfaces/NodeRegistration.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L28)

#### Returns

[`NodeRegistration`](../interfaces/NodeRegistration.md)[]

---

### register()

> **register**(`metadata`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L6)

#### Parameters

##### metadata

[`NodeMetadata`](../interfaces/NodeMetadata.md)

#### Returns

`void`

---

### setStatus()

> **setStatus**(`nodeId`, `status`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L32)

#### Parameters

##### nodeId

`string`

##### status

[`NodeStatus`](../type-aliases/NodeStatus.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L20)

#### Parameters

##### nodeId

`string`

#### Returns

`void`

---

### updateHeartbeat()

> **updateHeartbeat**(`nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeRegistry.ts#L39)

#### Parameters

##### nodeId

`string`

#### Returns

`void`
