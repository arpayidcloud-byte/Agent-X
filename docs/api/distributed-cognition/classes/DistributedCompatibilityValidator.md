[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedCompatibilityValidator

# Class: DistributedCompatibilityValidator

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts#L10)

## Constructors

### Constructor

> **new DistributedCompatibilityValidator**(`versionManager`): `DistributedCompatibilityValidator`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts#L13)

#### Parameters

##### versionManager

[`DistributedVersionManager`](DistributedVersionManager.md)

#### Returns

`DistributedCompatibilityValidator`

## Methods

### getChecks()

> **getChecks**(): [`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts#L34)

#### Returns

[`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)[]

---

### getFailures()

> **getFailures**(): [`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts#L38)

#### Returns

[`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)[]

---

### validate()

> **validate**(`packageName`, `version`): [`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts#L15)

#### Parameters

##### packageName

`string`

##### version

`string`

#### Returns

[`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)

---

### validateAll()

> **validateAll**(): [`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedCompatibilityValidator.ts#L27)

#### Returns

[`CompatibilityCheck`](../interfaces/CompatibilityCheck.md)[]
