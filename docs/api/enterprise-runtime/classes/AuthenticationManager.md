[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / AuthenticationManager

# Class: AuthenticationManager

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L11)

## Constructors

### Constructor

> **new AuthenticationManager**(): `AuthenticationManager`

#### Returns

`AuthenticationManager`

## Methods

### get()

> **get**(`tokenId`): [`AuthToken`](../interfaces/AuthToken.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L41)

#### Parameters

##### tokenId

`string`

#### Returns

[`AuthToken`](../interfaces/AuthToken.md) \| `undefined`

---

### getAll()

> **getAll**(): [`AuthToken`](../interfaces/AuthToken.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L45)

#### Returns

[`AuthToken`](../interfaces/AuthToken.md)[]

---

### issue()

> **issue**(`subject`, `roles`, `ttlMs?`): [`AuthToken`](../interfaces/AuthToken.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L14)

#### Parameters

##### subject

`string`

##### roles

`string`[]

##### ttlMs?

`number` = `3600000`

#### Returns

[`AuthToken`](../interfaces/AuthToken.md)

---

### revoke()

> **revoke**(`tokenId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L37)

#### Parameters

##### tokenId

`string`

#### Returns

`boolean`

---

### validate()

> **validate**(`tokenId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L31)

#### Parameters

##### tokenId

`string`

#### Returns

`boolean`
