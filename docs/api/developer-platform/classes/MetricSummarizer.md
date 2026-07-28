[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / MetricSummarizer

# Class: MetricSummarizer

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L76)

## Constructors

### Constructor

> **new MetricSummarizer**(): `MetricSummarizer`

#### Returns

`MetricSummarizer`

## Methods

### getAll()

> **getAll**(): [`MetricSummary`](../interfaces/MetricSummary.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L99)

#### Returns

[`MetricSummary`](../interfaces/MetricSummary.md)[]

---

### query()

> **query**(`metric`): [`MetricSummary`](../interfaces/MetricSummary.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L95)

#### Parameters

##### metric

`string`

#### Returns

[`MetricSummary`](../interfaces/MetricSummary.md)[]

---

### record()

> **record**(`metric`, `value`): [`MetricSummary`](../interfaces/MetricSummary.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L79)

#### Parameters

##### metric

`string`

##### value

`number`

#### Returns

[`MetricSummary`](../interfaces/MetricSummary.md)
