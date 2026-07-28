[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / ExecutionLeaseManager

# Class: ExecutionLeaseManager

Defined in: [packages/runtime/runtime-production/src/lease-manager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lease-manager.ts#L9)

## Constructors

### Constructor

> **new ExecutionLeaseManager**(): `ExecutionLeaseManager`

#### Returns

`ExecutionLeaseManager`

## Methods

### acquireLease()

> **acquireLease**(`workerId`, `resourceType`, `resourceId`, `ttlMs`): [`LeaseInfo`](../interfaces/LeaseInfo.md)

Defined in: [packages/runtime/runtime-production/src/lease-manager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lease-manager.ts#L12)

#### Parameters

##### workerId

`string`

##### resourceType

`string`

##### resourceId

`string`

##### ttlMs

`number`

#### Returns

[`LeaseInfo`](../interfaces/LeaseInfo.md)

---

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/lease-manager.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lease-manager.ts#L86)

#### Returns

`void`

---

### isLeased()

> **isLeased**(`resourceType`, `resourceId`): `boolean`

Defined in: [packages/runtime/runtime-production/src/lease-manager.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lease-manager.ts#L80)

#### Parameters

##### resourceType

`string`

##### resourceId

`string`

#### Returns

`boolean`

---

### releaseLease()

> **releaseLease**(`workerId`, `resourceType`, `resourceId`): `void`

Defined in: [packages/runtime/runtime-production/src/lease-manager.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lease-manager.ts#L55)

#### Parameters

##### workerId

`string`

##### resourceType

`string`

##### resourceId

`string`

#### Returns

`void`

---

### renewLease()

> **renewLease**(`workerId`, `resourceType`, `resourceId`): `void`

Defined in: [packages/runtime/runtime-production/src/lease-manager.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lease-manager.ts#L38)

#### Parameters

##### workerId

`string`

##### resourceType

`string`

##### resourceId

`string`

#### Returns

`void`

---

### takeoverLease()

> **takeoverLease**(`newWorkerId`, `resourceType`, `resourceId`, `ttlMs`): [`LeaseInfo`](../interfaces/LeaseInfo.md)

Defined in: [packages/runtime/runtime-production/src/lease-manager.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lease-manager.ts#L64)

#### Parameters

##### newWorkerId

`string`

##### resourceType

`string`

##### resourceId

`string`

##### ttlMs

`number`

#### Returns

[`LeaseInfo`](../interfaces/LeaseInfo.md)
