[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ReportGenerator

# Class: ReportGenerator

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:183](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L183)

## Constructors

### Constructor

> **new ReportGenerator**(): `ReportGenerator`

#### Returns

`ReportGenerator`

## Methods

### generate()

> **generate**(`title`, `type`, `data`): [`ReportEntry`](../interfaces/ReportEntry.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:186](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L186)

#### Parameters

##### title

`string`

##### type

`string`

##### data

`Record`\<`string`, `unknown`\>

#### Returns

[`ReportEntry`](../interfaces/ReportEntry.md)

---

### get()

> **get**(`reportId`): [`ReportEntry`](../interfaces/ReportEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:202](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L202)

#### Parameters

##### reportId

`string`

#### Returns

[`ReportEntry`](../interfaces/ReportEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ReportEntry`](../interfaces/ReportEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:206](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L206)

#### Returns

[`ReportEntry`](../interfaces/ReportEntry.md)[]
