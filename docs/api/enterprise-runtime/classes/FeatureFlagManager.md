[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / FeatureFlagManager

# Class: FeatureFlagManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L114)

## Constructors

### Constructor

> **new FeatureFlagManager**(): `FeatureFlagManager`

#### Returns

`FeatureFlagManager`

## Methods

### delete()

> **delete**(`flagId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L136)

#### Parameters

##### flagId

`string`

#### Returns

`boolean`

---

### get()

> **get**(`flagId`): [`FeatureFlag`](../interfaces/FeatureFlag.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L132)

#### Parameters

##### flagId

`string`

#### Returns

[`FeatureFlag`](../interfaces/FeatureFlag.md) \| `undefined`

---

### getAll()

> **getAll**(): [`FeatureFlag`](../interfaces/FeatureFlag.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:140](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L140)

#### Returns

[`FeatureFlag`](../interfaces/FeatureFlag.md)[]

---

### isEnabled()

> **isEnabled**(`flagId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L127)

#### Parameters

##### flagId

`string`

#### Returns

`boolean`

---

### set()

> **set**(`name`, `enabled`, `rolloutPercentage?`): [`FeatureFlag`](../interfaces/FeatureFlag.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:117](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L117)

#### Parameters

##### name

`string`

##### enabled

`boolean`

##### rolloutPercentage?

`number` = `100`

#### Returns

[`FeatureFlag`](../interfaces/FeatureFlag.md)
