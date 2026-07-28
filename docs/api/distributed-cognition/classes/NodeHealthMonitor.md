[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / NodeHealthMonitor

# Class: NodeHealthMonitor

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts#L3)

## Constructors

### Constructor

> **new NodeHealthMonitor**(): `NodeHealthMonitor`

#### Returns

`NodeHealthMonitor`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts#L43)

#### Returns

`void`

---

### evaluateStatus()

> **evaluateStatus**(`nodeId`, `cpuThreshold?`, `memoryThreshold?`, `latencyThreshold?`): [`NodeStatus`](../type-aliases/NodeStatus.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts#L26)

#### Parameters

##### nodeId

`string`

##### cpuThreshold?

`number` = `0.9`

##### memoryThreshold?

`number` = `0.9`

##### latencyThreshold?

`number` = `1000`

#### Returns

[`NodeStatus`](../type-aliases/NodeStatus.md)

---

### getHealthHistory()

> **getHealthHistory**(`nodeId`): [`NodeHealth`](../interfaces/NodeHealth.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts#L22)

#### Parameters

##### nodeId

`string`

#### Returns

[`NodeHealth`](../interfaces/NodeHealth.md)[]

---

### getLatestHealth()

> **getLatestHealth**(`nodeId`): [`NodeHealth`](../interfaces/NodeHealth.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts#L16)

#### Parameters

##### nodeId

`string`

#### Returns

[`NodeHealth`](../interfaces/NodeHealth.md) \| `undefined`

---

### recordHealth()

> **recordHealth**(`health`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts#L7)

#### Parameters

##### health

[`NodeHealth`](../interfaces/NodeHealth.md)

#### Returns

`void`

---

### removeNode()

> **removeNode**(`nodeId`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/node/NodeHealthMonitor.ts#L39)

#### Parameters

##### nodeId

`string`

#### Returns

`void`
