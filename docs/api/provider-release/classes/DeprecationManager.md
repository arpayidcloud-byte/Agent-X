[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-release](../README.md) / DeprecationManager

# Class: DeprecationManager

Defined in: [packages/provider/provider-release/src/deprecation-manager.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/deprecation-manager.ts#L13)

## Constructors

### Constructor

> **new DeprecationManager**(): `DeprecationManager`

#### Returns

`DeprecationManager`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/provider/provider-release/src/deprecation-manager.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/deprecation-manager.ts#L32)

#### Returns

`void`

---

### deprecate()

> **deprecate**(`version`, `replacement?`): `void`

Defined in: [packages/provider/provider-release/src/deprecation-manager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/deprecation-manager.ts#L16)

#### Parameters

##### version

`string`

##### replacement?

`string`

#### Returns

`void`

---

### getDeprecation()

> **getDeprecation**(`version`): [`Deprecation`](../interfaces/Deprecation.md) \| `undefined`

Defined in: [packages/provider/provider-release/src/deprecation-manager.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/deprecation-manager.ts#L24)

#### Parameters

##### version

`string`

#### Returns

[`Deprecation`](../interfaces/Deprecation.md) \| `undefined`

---

### isDeprecated()

> **isDeprecated**(`version`): `boolean`

Defined in: [packages/provider/provider-release/src/deprecation-manager.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/deprecation-manager.ts#L28)

#### Parameters

##### version

`string`

#### Returns

`boolean`
