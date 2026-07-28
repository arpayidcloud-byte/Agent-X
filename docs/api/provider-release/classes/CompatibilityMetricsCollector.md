[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-release](../README.md) / CompatibilityMetricsCollector

# Class: CompatibilityMetricsCollector

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L6)

## Constructors

### Constructor

> **new CompatibilityMetricsCollector**(): `CompatibilityMetricsCollector`

#### Returns

`CompatibilityMetricsCollector`

## Properties

### breakingChangesDetected

> **breakingChangesDetected**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L12)

---

### compatibleProviders

> **compatibleProviders**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L7)

---

### deprecatedProviders

> **deprecatedProviders**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L9)

---

### ltsReleases

> **ltsReleases**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L11)

---

### migrationPlansGenerated

> **migrationPlansGenerated**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L13)

---

### rejectedProviders

> **rejectedProviders**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L8)

---

### scoreCount

> **scoreCount**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L15)

---

### stableReleases

> **stableReleases**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L10)

---

### totalScoreSum

> **totalScoreSum**: `number` = `0`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L14)

## Methods

### getMetrics()

> **getMetrics**(): `Record`\<`string`, `number`>>>>\>

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L17)

#### Returns

`Record`\<`string`, `number`\>

---

### recordScore()

> **recordScore**(`score`): `void`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L30)

#### Parameters

##### score

`number`

#### Returns

`void`

---

### reset()

> **reset**(): `void`

Defined in: [packages/provider/provider-release/src/compatibility-metrics.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-metrics.ts#L35)

#### Returns

`void`
