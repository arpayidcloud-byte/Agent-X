[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / SecretManager

# Class: SecretManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L69)

## Constructors

### Constructor

> **new SecretManager**(): `SecretManager`

#### Returns

`SecretManager`

## Methods

### delete()

> **delete**(`key`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L97)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### get()

> **get**(`key`): [`SecretEntry`](../interfaces/SecretEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L89)

#### Parameters

##### key

`string`

#### Returns

[`SecretEntry`](../interfaces/SecretEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SecretEntry`](../interfaces/SecretEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L101)

#### Returns

[`SecretEntry`](../interfaces/SecretEntry.md)[]

---

### rotate()

> **rotate**(`key`, `newEncryptedValue`): [`SecretEntry`](../interfaces/SecretEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L93)

#### Parameters

##### key

`string`

##### newEncryptedValue

`string`

#### Returns

[`SecretEntry`](../interfaces/SecretEntry.md)

---

### set()

> **set**(`key`, `encryptedValue`): [`SecretEntry`](../interfaces/SecretEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L72)

#### Parameters

##### key

`string`

##### encryptedValue

`string`

#### Returns

[`SecretEntry`](../interfaces/SecretEntry.md)
