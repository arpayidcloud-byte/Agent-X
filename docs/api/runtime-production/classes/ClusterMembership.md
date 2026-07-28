[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / ClusterMembership

# Class: ClusterMembership

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L9)

## Constructors

### Constructor

> **new ClusterMembership**(): `ClusterMembership`

#### Returns

`ClusterMembership`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L65)

#### Returns

`void`

---

### electLeader()

> **electLeader**(): `string`

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L36)

#### Returns

`string`

---

### getLeader()

> **getLeader**(): `string` \| `null`

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L50)

#### Returns

`string` \| `null`

---

### heartbeat()

> **heartbeat**(`nodeId`): `void`

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L28)

#### Parameters

##### nodeId

`string`

#### Returns

`void`

---

### join()

> **join**(`node`): `void`

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L13)

#### Parameters

##### node

[`ClusterNode`](../interfaces/ClusterNode.md)

#### Returns

`void`

---

### leave()

> **leave**(`nodeId`): `void`

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L20)

#### Parameters

##### nodeId

`string`

#### Returns

`void`

---

### listNodes()

> **listNodes**(): [`ClusterNode`](../interfaces/ClusterNode.md)[]

Defined in: [packages/runtime/runtime-production/src/cluster-membership.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/cluster-membership.ts#L54)

#### Returns

[`ClusterNode`](../interfaces/ClusterNode.md)[]
