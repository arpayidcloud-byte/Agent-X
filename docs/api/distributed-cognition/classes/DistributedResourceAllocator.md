[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedResourceAllocator

# Class: DistributedResourceAllocator

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts#L13)

## Constructors

### Constructor

> **new DistributedResourceAllocator**(`nodeRegistry`): `DistributedResourceAllocator`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts#L16)

#### Parameters

##### nodeRegistry

[`NodeRegistry`](NodeRegistry.md)

#### Returns

`DistributedResourceAllocator`

## Methods

### allocate()

> **allocate**(`nodeId`, `resourceType`, `amount`): [`ResourceAllocation`](../interfaces/ResourceAllocation.md)

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts#L18)

#### Parameters

##### nodeId

`string`

##### resourceType

`string`

##### amount

`number`

#### Returns

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)

---

### getAllocations()

> **getAllocations**(`nodeId`): [`ResourceAllocation`](../interfaces/ResourceAllocation.md)[]

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts#L41)

#### Parameters

##### nodeId

`string`

#### Returns

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)[]

---

### getTotalAllocated()

> **getTotalAllocated**(`nodeId`, `resourceType`): `number`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts#L56)

#### Parameters

##### nodeId

`string`

##### resourceType

`string`

#### Returns

`number`

---

### release()

> **release**(`allocationId`, `nodeId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedResourceAllocator.ts#L45)

#### Parameters

##### allocationId

`string`

##### nodeId

`string`

#### Returns

`boolean`
