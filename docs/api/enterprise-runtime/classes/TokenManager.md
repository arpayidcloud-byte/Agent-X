[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / TokenManager

# Class: TokenManager

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:182](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L182)

## Constructors

### Constructor

> **new TokenManager**(): `TokenManager`

#### Returns

`TokenManager`

## Methods

### getAll()

> **getAll**(): [`TokenEntry`](../interfaces/TokenEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:214](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L214)

#### Returns

[`TokenEntry`](../interfaces/TokenEntry.md)[]

---

### issue()

> **issue**(`type`, `subject`, `ttlMs?`): [`TokenEntry`](../interfaces/TokenEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:185](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L185)

#### Parameters

##### type

`string`

##### subject

`string`

##### ttlMs?

`number` = `3600000`

#### Returns

[`TokenEntry`](../interfaces/TokenEntry.md)

---

### revoke()

> **revoke**(`tokenId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:210](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L210)

#### Parameters

##### tokenId

`string`

#### Returns

`boolean`

---

### validate()

> **validate**(`tokenId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:204](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L204)

#### Parameters

##### tokenId

`string`

#### Returns

`boolean`
