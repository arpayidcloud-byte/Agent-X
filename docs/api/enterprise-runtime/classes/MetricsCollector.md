[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / MetricsCollector

# Class: MetricsCollector

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L47)

## Constructors

### Constructor

> **new MetricsCollector**(): `MetricsCollector`

#### Returns

`MetricsCollector`

## Methods

### aggregate()

> **aggregate**(`name`): `object`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L65)

#### Parameters

##### name

`string`

#### Returns

`object`

##### avg

> **avg**: `number`

##### count

> **count**: `number`

##### sum

> **sum**: `number`

---

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L76)

#### Returns

`void`

---

### getAll()

> **getAll**(): [`MetricEntry`](../interfaces/MetricEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L72)

#### Returns

[`MetricEntry`](../interfaces/MetricEntry.md)[]

---

### query()

> **query**(`name`): [`MetricEntry`](../interfaces/MetricEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L61)

#### Parameters

##### name

`string`

#### Returns

[`MetricEntry`](../interfaces/MetricEntry.md)[]

---

### record()

> **record**(`name`, `value`, `tags?`): [`MetricEntry`](../interfaces/MetricEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L50)

#### Parameters

##### name

`string`

##### value

`number`

##### tags?

`Record`\<`string`, `string`\> = `{}`

#### Returns

[`MetricEntry`](../interfaces/MetricEntry.md)
