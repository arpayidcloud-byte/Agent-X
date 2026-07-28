[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [vendor-certification](../README.md) / ReportGenerator

# Class: ReportGenerator

Defined in: [packages/provider/vendor-certification/src/report-generator.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/report-generator.ts#L14)

## Constructors

### Constructor

> **new ReportGenerator**(): `ReportGenerator`

#### Returns

`ReportGenerator`

## Methods

### generate()

> **generate**(`provider`, `score`, `grade`, `runtimeVersion`, `platformVersion`): [`CertificationReport`](../interfaces/CertificationReport.md)

Defined in: [packages/provider/vendor-certification/src/report-generator.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/report-generator.ts#L15)

#### Parameters

##### provider

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

##### score

[`ReadinessScore`](../interfaces/ReadinessScore.md)

##### grade

[`ProviderGrade`](../type-aliases/ProviderGrade.md)

##### runtimeVersion

`string`

##### platformVersion

`string`

#### Returns

[`CertificationReport`](../interfaces/CertificationReport.md)
