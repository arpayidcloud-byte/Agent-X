[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / SecretRotation

# Class: SecretRotation

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:226](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L226)

## Constructors

### Constructor

> **new SecretRotation**(): `SecretRotation`

#### Returns

`SecretRotation`

## Methods

### getAll()

> **getAll**(): [`RotationEntry`](../interfaces/RotationEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:248](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L248)

#### Returns

[`RotationEntry`](../interfaces/RotationEntry.md)[]

---

### getRotations()

> **getRotations**(`secretKey`): [`RotationEntry`](../interfaces/RotationEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:244](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L244)

#### Parameters

##### secretKey

`string`

#### Returns

[`RotationEntry`](../interfaces/RotationEntry.md)[]

---

### rotate()

> **rotate**(`secretKey`): [`RotationEntry`](../interfaces/RotationEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts:229](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/security/Security.ts#L229)

#### Parameters

##### secretKey

`string`

#### Returns

[`RotationEntry`](../interfaces/RotationEntry.md)
