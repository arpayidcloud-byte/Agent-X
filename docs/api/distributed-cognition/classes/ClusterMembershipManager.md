[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / ClusterMembershipManager

# Class: ClusterMembershipManager

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts#L8)

Invariant: createCluster() always initializes both this.configs
and this.memberships for the same clusterId.

## Constructors

### Constructor

> **new ClusterMembershipManager**(): `ClusterMembershipManager`

#### Returns

`ClusterMembershipManager`

## Methods

### createCluster()

> **createCluster**(`config`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts#L27)

#### Parameters

##### config

[`ClusterConfig`](../interfaces/ClusterConfig.md)

#### Returns

`void`

---

### getConfig()

> **getConfig**(`clusterId`): [`ClusterConfig`](../interfaces/ClusterConfig.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts#L66)

#### Parameters

##### clusterId

`string`

#### Returns

[`ClusterConfig`](../interfaces/ClusterConfig.md) \| `undefined`

---

### getMembers()

> **getMembers**(`clusterId`): [`ClusterMembership`](../interfaces/ClusterMembership.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts#L62)

#### Parameters

##### clusterId

`string`

#### Returns

[`ClusterMembership`](../interfaces/ClusterMembership.md)[]

---

### joinCluster()

> **joinCluster**(`clusterId`, `nodeId`): [`ClusterMembership`](../interfaces/ClusterMembership.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts#L35)

#### Parameters

##### clusterId

`string`

##### nodeId

`string`

#### Returns

[`ClusterMembership`](../interfaces/ClusterMembership.md)

---

### leaveCluster()

> **leaveCluster**(`clusterId`, `nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts#L55)

#### Parameters

##### clusterId

`string`

##### nodeId

`string`

#### Returns

`void`

---

### listClusters()

> **listClusters**(): `string`[]

Defined in: [packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/cluster/ClusterMembershipManager.ts#L70)

#### Returns

`string`[]
