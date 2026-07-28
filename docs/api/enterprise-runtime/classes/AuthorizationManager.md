[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / AuthorizationManager

# Class: AuthorizationManager

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L58)

## Constructors

### Constructor

> **new AuthorizationManager**(): `AuthorizationManager`

#### Returns

`AuthorizationManager`

## Methods

### check()

> **check**(`role`, `resource`, `action`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L71)

#### Parameters

##### role

`string`

##### resource

`string`

##### action

`string`

#### Returns

`boolean`

---

### getAll()

> **getAll**(): [`Permission`](../interfaces/Permission.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L82)

#### Returns

[`Permission`](../interfaces/Permission.md)[]

---

### grant()

> **grant**(`role`, `resource`, `action`): [`Permission`](../interfaces/Permission.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L61)

#### Parameters

##### role

`string`

##### resource

`string`

##### action

`string`

#### Returns

[`Permission`](../interfaces/Permission.md)

---

### revoke()

> **revoke**(`permissionId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L78)

#### Parameters

##### permissionId

`string`

#### Returns

`boolean`
