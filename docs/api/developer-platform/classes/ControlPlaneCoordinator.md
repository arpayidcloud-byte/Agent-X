[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ControlPlaneCoordinator

# Class: ControlPlaneCoordinator

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L122)

## Constructors

### Constructor

> **new ControlPlaneCoordinator**(): `ControlPlaneCoordinator`

#### Returns

`ControlPlaneCoordinator`

## Methods

### createDashboard()

> **createDashboard**(`name`, `type`): `string`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L128)

#### Parameters

##### name

`string`

##### type

`string`

#### Returns

`string`

---

### get()

> **get**(`dashboardId`): \{ `checksum`: `string`; `dashboardId`: `string`; `name`: `string`; `type`: `string`; \} \| `undefined`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:138](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L138)

#### Parameters

##### dashboardId

`string`

#### Returns

\{ `checksum`: `string`; `dashboardId`: `string`; `name`: `string`; `type`: `string`; \} \| `undefined`

---

### getAll()

> **getAll**(): `object`[]

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:142](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L142)

#### Returns

`object`[]
