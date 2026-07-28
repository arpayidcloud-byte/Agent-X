[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / RemoteUpgrade

# Class: RemoteUpgrade

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:113](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L113)

## Constructors

### Constructor

> **new RemoteUpgrade**(): `RemoteUpgrade`

#### Returns

`RemoteUpgrade`

## Methods

### getUpgrades()

> **getUpgrades**(): [`UpgradeEntry`](../interfaces/UpgradeEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L132)

#### Returns

[`UpgradeEntry`](../interfaces/UpgradeEntry.md)[]

---

### upgrade()

> **upgrade**(`fromVersion`, `toVersion`): [`UpgradeEntry`](../interfaces/UpgradeEntry.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:116](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L116)

#### Parameters

##### fromVersion

`string`

##### toVersion

`string`

#### Returns

[`UpgradeEntry`](../interfaces/UpgradeEntry.md)
