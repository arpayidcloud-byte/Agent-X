[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-release](../README.md) / SemanticVersion

# Class: SemanticVersion

Defined in: [packages/provider/provider-release/src/semantic-version.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/semantic-version.ts#L6)

## Constructors

### Constructor

> **new SemanticVersion**(): `SemanticVersion`

#### Returns

`SemanticVersion`

## Methods

### isCompatible()

> **isCompatible**(`v1`, `v2`): `boolean`

Defined in: [packages/provider/provider-release/src/semantic-version.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/semantic-version.ts#L15)

#### Parameters

##### v1

`string`

##### v2

`string`

#### Returns

`boolean`

---

### parse()

> **parse**(`v`): `object`

Defined in: [packages/provider/provider-release/src/semantic-version.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/semantic-version.ts#L7)

#### Parameters

##### v

`string`

#### Returns

`object`

##### major

> **major**: `number`

##### minor

> **minor**: `number`

##### patch

> **patch**: `number`
