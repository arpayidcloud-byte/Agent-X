[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RuntimeCompatibilityEngine

# Class: RuntimeCompatibilityEngine

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L104)

## Constructors

### Constructor

> **new RuntimeCompatibilityEngine**(): `RuntimeCompatibilityEngine`

#### Returns

`RuntimeCompatibilityEngine`

## Methods

### get()

> **get**(`packageName`): [`CompatibilityEntry`](../interfaces/CompatibilityEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L128)

#### Parameters

##### packageName

`string`

#### Returns

[`CompatibilityEntry`](../interfaces/CompatibilityEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`CompatibilityEntry`](../interfaces/CompatibilityEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L132)

#### Returns

[`CompatibilityEntry`](../interfaces/CompatibilityEntry.md)[]

---

### isCompatible()

> **isCompatible**(`packageName`, `version`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:121](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L121)

#### Parameters

##### packageName

`string`

##### version

`string`

#### Returns

`boolean`

---

### register()

> **register**(`packageName`, `version`, `compatibleVersions`): [`CompatibilityEntry`](../interfaces/CompatibilityEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L107)

#### Parameters

##### packageName

`string`

##### version

`string`

##### compatibleVersions

`string`[]

#### Returns

[`CompatibilityEntry`](../interfaces/CompatibilityEntry.md)
