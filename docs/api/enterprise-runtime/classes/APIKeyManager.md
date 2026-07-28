[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / APIKeyManager

# Class: APIKeyManager

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L132)

## Constructors

### Constructor

> **new APIKeyManager**(): `APIKeyManager`

#### Returns

`APIKeyManager`

## Methods

### create()

> **create**(`tenantId`, `ttlMs?`): [`APIKey`](../interfaces/APIKey.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L135)

#### Parameters

##### tenantId

`string`

##### ttlMs?

`number` = `86400000`

#### Returns

[`APIKey`](../interfaces/APIKey.md)

---

### getAll()

> **getAll**(): [`APIKey`](../interfaces/APIKey.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:168](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L168)

#### Returns

[`APIKey`](../interfaces/APIKey.md)[]

---

### getByTenant()

> **getByTenant**(`tenantId`): [`APIKey`](../interfaces/APIKey.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:164](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L164)

#### Parameters

##### tenantId

`string`

#### Returns

[`APIKey`](../interfaces/APIKey.md)[]

---

### revoke()

> **revoke**(`keyId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:160](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L160)

#### Parameters

##### keyId

`string`

#### Returns

`boolean`

---

### validate()

> **validate**(`keyId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:154](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L154)

#### Parameters

##### keyId

`string`

#### Returns

`boolean`
