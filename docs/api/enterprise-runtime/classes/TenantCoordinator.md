[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / TenantCoordinator

# Class: TenantCoordinator

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L103)

## Constructors

### Constructor

> **new TenantCoordinator**(`tenantManager`): `TenantCoordinator`

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L104)

#### Parameters

##### tenantManager

[`MultiTenantManager`](MultiTenantManager.md)

#### Returns

`TenantCoordinator`

## Methods

### deprovision()

> **deprovision**(`tenantId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:116](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L116)

#### Parameters

##### tenantId

`string`

#### Returns

`boolean`

---

### provision()

> **provision**(`name`, `plan`, `maxServices`): `string`

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L106)

#### Parameters

##### name

`string`

##### plan

`string`

##### maxServices

`number`

#### Returns

`string`
