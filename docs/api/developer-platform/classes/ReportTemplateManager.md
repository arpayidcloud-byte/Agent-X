[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ReportTemplateManager

# Class: ReportTemplateManager

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L46)

## Constructors

### Constructor

> **new ReportTemplateManager**(): `ReportTemplateManager`

#### Returns

`ReportTemplateManager`

## Methods

### create()

> **create**(`name`, `format`): [`ReportTemplate`](../interfaces/ReportTemplate.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L49)

#### Parameters

##### name

`string`

##### format

`string`

#### Returns

[`ReportTemplate`](../interfaces/ReportTemplate.md)

---

### get()

> **get**(`templateId`): [`ReportTemplate`](../interfaces/ReportTemplate.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L59)

#### Parameters

##### templateId

`string`

#### Returns

[`ReportTemplate`](../interfaces/ReportTemplate.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ReportTemplate`](../interfaces/ReportTemplate.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L63)

#### Returns

[`ReportTemplate`](../interfaces/ReportTemplate.md)[]
