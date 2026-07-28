[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / WorkspaceManager

# Class: WorkspaceManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L77)

## Constructors

### Constructor

> **new WorkspaceManager**(): `WorkspaceManager`

#### Returns

`WorkspaceManager`

## Methods

### create()

> **create**(`tenantId`, `name`): [`WorkspaceEntry`](../interfaces/WorkspaceEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L80)

#### Parameters

##### tenantId

`string`

##### name

`string`

#### Returns

[`WorkspaceEntry`](../interfaces/WorkspaceEntry.md)

---

### delete()

> **delete**(`workspaceId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L104)

#### Parameters

##### workspaceId

`string`

#### Returns

`boolean`

---

### get()

> **get**(`workspaceId`): [`WorkspaceEntry`](../interfaces/WorkspaceEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L96)

#### Parameters

##### workspaceId

`string`

#### Returns

[`WorkspaceEntry`](../interfaces/WorkspaceEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`WorkspaceEntry`](../interfaces/WorkspaceEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:108](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L108)

#### Returns

[`WorkspaceEntry`](../interfaces/WorkspaceEntry.md)[]

---

### getByTenant()

> **getByTenant**(`tenantId`): [`WorkspaceEntry`](../interfaces/WorkspaceEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L100)

#### Parameters

##### tenantId

`string`

#### Returns

[`WorkspaceEntry`](../interfaces/WorkspaceEntry.md)[]
