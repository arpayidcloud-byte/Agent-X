[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ExecutionMetricsCollector

# Class: ExecutionMetricsCollector

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L10)

## Constructors

### Constructor

> **new ExecutionMetricsCollector**(): `ExecutionMetricsCollector`

#### Returns

`ExecutionMetricsCollector`

## Methods

### aggregate()

> **aggregate**(`name`): `object`

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L28)

#### Parameters

##### name

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

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L46)

#### Returns

`void`

---

### getAll()

> **getAll**(): [`MetricPoint`](../interfaces/MetricPoint.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L42)

#### Returns

[`MetricPoint`](../interfaces/MetricPoint.md)[]

---

### query()

> **query**(`name`): [`MetricPoint`](../interfaces/MetricPoint.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L24)

#### Parameters

##### name

`string`

#### Returns

[`MetricPoint`](../interfaces/MetricPoint.md)[]

---

### record()

> **record**(`name`, `value`, `tags?`): [`MetricPoint`](../interfaces/MetricPoint.md)

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L13)

#### Parameters

##### name

`string`

##### value

`number`

##### tags?

`Record`\<`string`, `string`\> = `{}`

#### Returns

[`MetricPoint`](../interfaces/MetricPoint.md)
