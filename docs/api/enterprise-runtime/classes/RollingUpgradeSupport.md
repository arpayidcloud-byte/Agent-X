[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RollingUpgradeSupport

# Class: RollingUpgradeSupport

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:212](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L212)

## Constructors

### Constructor

> **new RollingUpgradeSupport**(): `RollingUpgradeSupport`

#### Returns

`RollingUpgradeSupport`

## Methods

### plan()

> **plan**(`fromVersion`, `toVersion`, `batchSize`): [`RollingUpgradePlan`](../interfaces/RollingUpgradePlan.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:213](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L213)

#### Parameters

##### fromVersion

`string`

##### toVersion

`string`

##### batchSize

`number`

#### Returns

[`RollingUpgradePlan`](../interfaces/RollingUpgradePlan.md)
