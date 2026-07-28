[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:146](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L146)

## Constructors

### Constructor

> **new ResourceManager**(): `ResourceManager`

#### Returns

`ResourceManager`

## Methods

### checkQuota()

> **checkQuota**(`tenantId`): `object`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:185](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L185)

#### Parameters

##### tenantId

`string`

#### Returns

`object`

##### violations

> **violations**: `string`[]

##### withinQuota

> **withinQuota**: `boolean`

---

### getAll()

> **getAll**(): [`ResourceQuota`](../interfaces/ResourceQuota.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:199](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L199)

#### Returns

[`ResourceQuota`](../interfaces/ResourceQuota.md)[]

---

### getQuota()

> **getQuota**(`resourceId`): [`ResourceQuota`](../interfaces/ResourceQuota.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:172](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L172)

#### Parameters

##### resourceId

`string`

#### Returns

[`ResourceQuota`](../interfaces/ResourceQuota.md) \| `undefined`

---

### getUsage()

> **getUsage**(`tenantId`): \{ `cpu`: `number`; `memoryMb`: `number`; `storageMb`: `number`; \} \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:180](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L180)

#### Parameters

##### tenantId

`string`

#### Returns

\{ `cpu`: `number`; `memoryMb`: `number`; `storageMb`: `number`; \} \| `undefined`

---

### recordUsage()

> **recordUsage**(`tenantId`, `cpu`, `memoryMb`, `storageMb`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:176](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L176)

#### Parameters

##### tenantId

`string`

##### cpu

`number`

##### memoryMb

`number`

##### storageMb

`number`

#### Returns

`void`

---

### setQuota()

> **setQuota**(`tenantId`, `maxCpu`, `maxMemoryMb`, `maxStorageMb`): [`ResourceQuota`](../interfaces/ResourceQuota.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:150](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L150)

#### Parameters

##### tenantId

`string`

##### maxCpu

`number`

##### maxMemoryMb

`number`

##### maxStorageMb

`number`

#### Returns

[`ResourceQuota`](../interfaces/ResourceQuota.md)
