[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / DashboardManager

# Class: DashboardManager

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L11)

## Constructors

### Constructor

> **new DashboardManager**(): `DashboardManager`

#### Returns

`DashboardManager`

## Methods

### create()

> **create**(`name`, `type`, `widgets?`): [`DashboardEntry`](../interfaces/DashboardEntry.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L14)

#### Parameters

##### name

`string`

##### type

`string`

##### widgets?

`string`[] = `[]`

#### Returns

[`DashboardEntry`](../interfaces/DashboardEntry.md)

---

### get()

> **get**(`dashboardId`): [`DashboardEntry`](../interfaces/DashboardEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L30)

#### Parameters

##### dashboardId

`string`

#### Returns

[`DashboardEntry`](../interfaces/DashboardEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`DashboardEntry`](../interfaces/DashboardEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/observability/Observability.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/observability/Observability.ts#L34)

#### Returns

[`DashboardEntry`](../interfaces/DashboardEntry.md)[]
