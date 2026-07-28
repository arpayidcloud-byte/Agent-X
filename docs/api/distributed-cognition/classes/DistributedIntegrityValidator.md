[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedIntegrityValidator

# Class: DistributedIntegrityValidator

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts#L11)

## Constructors

### Constructor

> **new DistributedIntegrityValidator**(): `DistributedIntegrityValidator`

#### Returns

`DistributedIntegrityValidator`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts#L42)

#### Returns

`void`

---

### getRecords()

> **getRecords**(`entityType`): [`IntegrityRecord`](../interfaces/IntegrityRecord.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts#L38)

#### Parameters

##### entityType

`string`

#### Returns

[`IntegrityRecord`](../interfaces/IntegrityRecord.md)[]

---

### validate()

> **validate**(`entityType`, `entityId`, `data`): [`IntegrityRecord`](../interfaces/IntegrityRecord.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts#L14)

#### Parameters

##### entityType

`string`

##### entityId

`string`

##### data

`unknown`

#### Returns

[`IntegrityRecord`](../interfaces/IntegrityRecord.md)

---

### verify()

> **verify**(`entityType`, `entityId`, `data`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedIntegrityValidator.ts#L30)

#### Parameters

##### entityType

`string`

##### entityId

`string`

##### data

`unknown`

#### Returns

`boolean`
