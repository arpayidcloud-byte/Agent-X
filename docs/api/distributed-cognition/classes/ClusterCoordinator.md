[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / ClusterCoordinator

# Class: ClusterCoordinator

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts#L4)

## Constructors

### Constructor

> **new ClusterCoordinator**(): `ClusterCoordinator`

#### Returns

`ClusterCoordinator`

## Methods

### electLeader()

> **electLeader**(`clusterId`, `nodeId`): [`ClusterState`](../interfaces/ClusterState.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts#L23)

#### Parameters

##### clusterId

`string`

##### nodeId

`string`

#### Returns

[`ClusterState`](../interfaces/ClusterState.md)

---

### getState()

> **getState**(`clusterId`): [`ClusterState`](../interfaces/ClusterState.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts#L56)

#### Parameters

##### clusterId

`string`

#### Returns

[`ClusterState`](../interfaces/ClusterState.md) \| `undefined`

---

### initialize()

> **initialize**(`clusterId`, `members`): [`ClusterState`](../interfaces/ClusterState.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts#L7)

#### Parameters

##### clusterId

`string`

##### members

`string`[]

#### Returns

[`ClusterState`](../interfaces/ClusterState.md)

---

### removeNode()

> **removeNode**(`clusterId`, `nodeId`): [`ClusterState`](../interfaces/ClusterState.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts#L60)

#### Parameters

##### clusterId

`string`

##### nodeId

`string`

#### Returns

[`ClusterState`](../interfaces/ClusterState.md)

---

### transition()

> **transition**(`clusterId`, `newStatus`): [`ClusterState`](../interfaces/ClusterState.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterCoordinator.ts#L40)

#### Parameters

##### clusterId

`string`

##### newStatus

[`ClusterStatus`](../type-aliases/ClusterStatus.md)

#### Returns

[`ClusterState`](../interfaces/ClusterState.md)
