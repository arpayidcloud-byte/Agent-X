[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / MultiTenantManager

# Class: MultiTenantManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L20)

## Constructors

### Constructor

> **new MultiTenantManager**(): `MultiTenantManager`

#### Returns

`MultiTenantManager`

## Methods

### create()

> **create**(`name`, `plan`, `quota`): [`TenantEntry`](../interfaces/TenantEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L23)

#### Parameters

##### name

`string`

##### plan

`string`

##### quota

[`TenantQuota`](../interfaces/TenantQuota.md)

#### Returns

[`TenantEntry`](../interfaces/TenantEntry.md)

---

### delete()

> **delete**(`tenantId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L60)

#### Parameters

##### tenantId

`string`

#### Returns

`boolean`

---

### get()

> **get**(`tenantId`): [`TenantEntry`](../interfaces/TenantEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L40)

#### Parameters

##### tenantId

`string`

#### Returns

[`TenantEntry`](../interfaces/TenantEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`TenantEntry`](../interfaces/TenantEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L64)

#### Returns

[`TenantEntry`](../interfaces/TenantEntry.md)[]

---

### updateQuota()

> **updateQuota**(`tenantId`, `quota`): [`TenantEntry`](../interfaces/TenantEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L44)

#### Parameters

##### tenantId

`string`

##### quota

[`TenantQuota`](../interfaces/TenantQuota.md)

#### Returns

[`TenantEntry`](../interfaces/TenantEntry.md)
