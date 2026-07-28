[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / DashboardBuilder

# Class: DashboardBuilder

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:147](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L147)

## Constructors

### Constructor

> **new DashboardBuilder**(): `DashboardBuilder`

#### Returns

`DashboardBuilder`

## Methods

### addWidget()

> **addWidget**(`title`, `type`, `config`): [`DashboardWidget`](../interfaces/DashboardWidget.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:150](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L150)

#### Parameters

##### title

`string`

##### type

`string`

##### config

`Record`\<`string`, `unknown`\>

#### Returns

[`DashboardWidget`](../interfaces/DashboardWidget.md)

---

### getAll()

> **getAll**(): [`DashboardWidget`](../interfaces/DashboardWidget.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:170](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L170)

#### Returns

[`DashboardWidget`](../interfaces/DashboardWidget.md)[]

---

### getWidget()

> **getWidget**(`widgetId`): [`DashboardWidget`](../interfaces/DashboardWidget.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:166](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L166)

#### Parameters

##### widgetId

`string`

#### Returns

[`DashboardWidget`](../interfaces/DashboardWidget.md) \| `undefined`
