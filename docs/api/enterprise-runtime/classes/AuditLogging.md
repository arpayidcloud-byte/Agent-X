[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / AuditLogging

# Class: AuditLogging

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:262](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L262)

## Constructors

### Constructor

> **new AuditLogging**(): `AuditLogging`

#### Returns

`AuditLogging`

## Methods

### getAll()

> **getAll**(): [`AuditLogEntry`](../interfaces/AuditLogEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:288](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L288)

#### Returns

[`AuditLogEntry`](../interfaces/AuditLogEntry.md)[]

---

### log()

> **log**(`actor`, `action`, `resource`): [`AuditLogEntry`](../interfaces/AuditLogEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:265](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L265)

#### Parameters

##### actor

`string`

##### action

`string`

##### resource

`string`

#### Returns

[`AuditLogEntry`](../interfaces/AuditLogEntry.md)

---

### query()

> **query**(`actor?`, `action?`): [`AuditLogEntry`](../interfaces/AuditLogEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:282](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L282)

#### Parameters

##### actor?

`string`

##### action?

`string`

#### Returns

[`AuditLogEntry`](../interfaces/AuditLogEntry.md)[]
