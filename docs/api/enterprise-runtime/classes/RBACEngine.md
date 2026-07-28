[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RBACEngine

# Class: RBACEngine

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L94)

## Constructors

### Constructor

> **new RBACEngine**(): `RBACEngine`

#### Returns

`RBACEngine`

## Methods

### addRole()

> **addRole**(`role`, `permissions`): [`RBACRule`](../interfaces/RBACRule.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L97)

#### Parameters

##### role

`string`

##### permissions

`string`[]

#### Returns

[`RBACRule`](../interfaces/RBACRule.md)

---

### getAll()

> **getAll**(): [`RBACRule`](../interfaces/RBACRule.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:118](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L118)

#### Returns

[`RBACRule`](../interfaces/RBACRule.md)[]

---

### getRoles()

> **getRoles**(): `string`[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L114)

#### Returns

`string`[]

---

### hasPermission()

> **hasPermission**(`role`, `permission`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L107)

#### Parameters

##### role

`string`

##### permission

`string`

#### Returns

`boolean`
