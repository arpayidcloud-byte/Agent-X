[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-release](../README.md) / MigrationAnalyzer

# Class: MigrationAnalyzer

Defined in: [packages/provider/provider-release/src/migration-analyzer.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/migration-analyzer.ts#L8)

## Constructors

### Constructor

> **new MigrationAnalyzer**(): `MigrationAnalyzer`

#### Returns

`MigrationAnalyzer`

## Methods

### analyze()

> **analyze**(`providerId`, `currentVersion`, `targetVersion`, `breaking`): [`UpgradePlan`](../interfaces/UpgradePlan.md)

Defined in: [packages/provider/provider-release/src/migration-analyzer.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/migration-analyzer.ts#L9)

#### Parameters

##### providerId

`string`

##### currentVersion

`string`

##### targetVersion

`string`

##### breaking

`string`[]

#### Returns

[`UpgradePlan`](../interfaces/UpgradePlan.md)
