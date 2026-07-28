[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / PermissionResolver

# Class: PermissionResolver

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L12)

## Implements

- [`IPermissionResolver`](../interfaces/IPermissionResolver.md)

## Constructors

### Constructor

> **new PermissionResolver**(): `PermissionResolver`

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L15)

#### Returns

`PermissionResolver`

## Methods

### addPolicy()

> **addPolicy**(`agentRole`, `policy`): `void`

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L46)

#### Parameters

##### agentRole

`string`

##### policy

[`PermissionPolicy`](../interfaces/PermissionPolicy.md)

#### Returns

`void`

---

### resolvePolicyForAgent()

> **resolvePolicyForAgent**(`agentRole`): [`PermissionPolicy`](../interfaces/PermissionPolicy.md)

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L42)

#### Parameters

##### agentRole

`string`

#### Returns

[`PermissionPolicy`](../interfaces/PermissionPolicy.md)

#### Implementation of

[`IPermissionResolver`](../interfaces/IPermissionResolver.md).[`resolvePolicyForAgent`](../interfaces/IPermissionResolver.md#resolvepolicyforagent)
