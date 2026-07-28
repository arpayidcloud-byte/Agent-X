[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-release](../README.md) / CompatibilityMatrix

# Class: CompatibilityMatrix

Defined in: [packages/provider/provider-release/src/compatibility-matrix.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-matrix.ts#L6)

## Constructors

### Constructor

> **new CompatibilityMatrix**(): `CompatibilityMatrix`

#### Returns

`CompatibilityMatrix`

## Methods

### getMatrix()

> **getMatrix**(): `Record`\<`string`, `Record`\<`string`, `boolean`>>>>>>>>\>\>

Defined in: [packages/provider/provider-release/src/compatibility-matrix.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-matrix.ts#L23)

#### Returns

`Record`\<`string`, `Record`\<`string`, `boolean`\>\>

---

### isCompatible()

> **isCompatible**(`provider`, `runtime`): `boolean`

Defined in: [packages/provider/provider-release/src/compatibility-matrix.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-matrix.ts#L16)

#### Parameters

##### provider

`string`

##### runtime

`string`

#### Returns

`boolean`

---

### setCompatibility()

> **setCompatibility**(`provider`, `runtime`, `compatible`): `void`

Defined in: [packages/provider/provider-release/src/compatibility-matrix.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-matrix.ts#L9)

#### Parameters

##### provider

`string`

##### runtime

`string`

##### compatible

`boolean`

#### Returns

`void`
