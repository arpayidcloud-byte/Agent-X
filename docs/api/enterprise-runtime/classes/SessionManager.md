[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / SessionManager

# Class: SessionManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L122)

## Constructors

### Constructor

> **new SessionManager**(): `SessionManager`

#### Returns

`SessionManager`

## Methods

### create()

> **create**(`tenantId`, `userId`, `ttlMs?`): [`SessionEntry`](../interfaces/SessionEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L125)

#### Parameters

##### tenantId

`string`

##### userId

`string`

##### ttlMs?

`number` = `3600000`

#### Returns

[`SessionEntry`](../interfaces/SessionEntry.md)

---

### get()

> **get**(`sessionId`): [`SessionEntry`](../interfaces/SessionEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:144](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L144)

#### Parameters

##### sessionId

`string`

#### Returns

[`SessionEntry`](../interfaces/SessionEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SessionEntry`](../interfaces/SessionEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:158](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L158)

#### Returns

[`SessionEntry`](../interfaces/SessionEntry.md)[]

---

### invalidate()

> **invalidate**(`sessionId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts:154](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/multitenant/TenantManager.ts#L154)

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`
