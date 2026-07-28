[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [production-quality](../README.md) / QualityMetricsCollector

# Class: QualityMetricsCollector

Defined in: [packages/quality/production-quality/src/metrics.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/metrics.ts#L6)

## Constructors

### Constructor

> **new QualityMetricsCollector**(): `QualityMetricsCollector`

#### Returns

`QualityMetricsCollector`

## Properties

### overallScoreSum

> **overallScoreSum**: `number` = `0`

Defined in: [packages/quality/production-quality/src/metrics.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/metrics.ts#L9)

---

### totalFailures

> **totalFailures**: `number` = `0`

Defined in: [packages/quality/production-quality/src/metrics.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/metrics.ts#L8)

---

### totalValidations

> **totalValidations**: `number` = `0`

Defined in: [packages/quality/production-quality/src/metrics.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/metrics.ts#L7)

## Methods

### getMetrics()

> **getMetrics**(): `Record`\<`string`, `number`>>>>\>

Defined in: [packages/quality/production-quality/src/metrics.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/metrics.ts#L19)

#### Returns

`Record`\<`string`, `number`\>

---

### recordValidation()

> **recordValidation**(`score`, `passed`): `void`

Defined in: [packages/quality/production-quality/src/metrics.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/metrics.ts#L11)

#### Parameters

##### score

`number`

##### passed

`boolean`

#### Returns

`void`

---

### reset()

> **reset**(): `void`

Defined in: [packages/quality/production-quality/src/metrics.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/metrics.ts#L27)

#### Returns

`void`
