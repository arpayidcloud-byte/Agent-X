[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [production-quality](../README.md) / ReportGenerator

# Class: ReportGenerator

Defined in: [packages/quality/production-quality/src/report.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/report.ts#L9)

## Constructors

### Constructor

> **new ReportGenerator**(): `ReportGenerator`

#### Returns

`ReportGenerator`

## Methods

### generate()

> **generate**(`traceId`, `packageId`, `score`, `grade`, `failures`, `edgeCases`): [`ProductionQualityReport`](../interfaces/ProductionQualityReport.md)

Defined in: [packages/quality/production-quality/src/report.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/production-quality/src/report.ts#L10)

#### Parameters

##### traceId

`string`

##### packageId

`string`

##### score

[`ValidationScore`](../interfaces/ValidationScore.md)

##### grade

[`QualityGrade`](../type-aliases/QualityGrade.md)

##### failures

`number`

##### edgeCases

`number`

#### Returns

[`ProductionQualityReport`](../interfaces/ProductionQualityReport.md)
