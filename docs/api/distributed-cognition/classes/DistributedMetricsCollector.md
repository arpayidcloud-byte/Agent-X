[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedMetricsCollector

# Class: DistributedMetricsCollector

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts#L9)

## Constructors

### Constructor

> **new DistributedMetricsCollector**(): `DistributedMetricsCollector`

#### Returns

`DistributedMetricsCollector`

## Methods

### aggregate()

> **aggregate**(`name`, `nodeId`): `object`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts#L33)

#### Parameters

##### name

`string`

##### nodeId

`string`

#### Returns

`object`

##### avg

> **avg**: `number`

##### count

> **count**: `number`

##### max

> **max**: `number`

##### min

> **min**: `number`

##### sum

> **sum**: `number`

---

### clear()

> **clear**(): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts#L54)

#### Returns

`void`

---

### getAll()

> **getAll**(): [`MetricPoint`](../interfaces/MetricPoint.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts#L50)

#### Returns

[`MetricPoint`](../interfaces/MetricPoint.md)[]

---

### query()

> **query**(`name`, `nodeId?`): [`MetricPoint`](../interfaces/MetricPoint.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts#L29)

#### Parameters

##### name

`string`

##### nodeId?

`string`

#### Returns

[`MetricPoint`](../interfaces/MetricPoint.md)[]

---

### record()

> **record**(`name`, `value`, `nodeId`, `tags?`): [`MetricPoint`](../interfaces/MetricPoint.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedMetricsCollector.ts#L12)

#### Parameters

##### name

`string`

##### value

`number`

##### nodeId

`string`

##### tags?

`Record`\<`string`, `string`\> = `{}`

#### Returns

[`MetricPoint`](../interfaces/MetricPoint.md)
