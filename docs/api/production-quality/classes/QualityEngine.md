[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [production-quality](../README.md) / QualityEngine

# Class: QualityEngine

Defined in: [packages/quality/production-quality/src/quality-engine.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/quality-engine.ts#L29)

## Constructors

### Constructor

> **new QualityEngine**(): `QualityEngine`

#### Returns

`QualityEngine`

## Properties

### metrics

> **metrics**: [`QualityMetricsCollector`](QualityMetricsCollector.md)

Defined in: [packages/quality/production-quality/src/quality-engine.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/quality-engine.ts#L30)

## Methods

### validatePackage()

> **validatePackage**(`context`, `coverage`, `extra`): `Promise`\<[`ProductionQualityReport`](../interfaces/ProductionQualityReport.md)>>>>\>

Defined in: [packages/quality/production-quality/src/quality-engine.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/quality-engine.ts#L50)

#### Parameters

##### context

[`ValidationContext`](../interfaces/ValidationContext.md)

##### coverage

[`CoverageReport`](../interfaces/CoverageReport.md)

##### extra

###### auditLogs

[`AuditLog`](../interfaces/AuditLog.md)[]

###### checksumData

`string`

###### dependencies

`Record`\<`string`, `string`[]\>

###### deterministicOutputs

`unknown`[]

###### edgeCases

`string`[]

###### events

[`EventEnvelope`](../interfaces/EventEnvelope.md)[]

###### expectedChecksum

`string`

###### failures

`string`[]

###### mutantsKilled

`number`

###### raceResults

`boolean`[]

###### resourceCeilings

[`ResourceCeilings`](../interfaces/ResourceCeilings.md)

###### resourceUsage

[`ResourceUsage`](../interfaces/ResourceUsage.md)

###### retries

\{ `count`: `number`; `exhausted`: `boolean`; `maxRetries`: `number`; \}

###### retries.count

`number`

###### retries.exhausted

`boolean`

###### retries.maxRetries

`number`

###### snapshot

`unknown`

###### timeoutRuns

`object`[]

###### totalMutants

`number`

###### uncoveredBranches

`string`[]

#### Returns

`Promise`\<[`ProductionQualityReport`](../interfaces/ProductionQualityReport.md)\>
