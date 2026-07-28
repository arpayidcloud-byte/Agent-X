[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/secrets/src](../README.md) / EnvVarSecretStore

# Class: EnvVarSecretStore

Defined in: [packages/shared/secrets/src/env-backend.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L4)

## Implements

- [`SecretStore`](../interfaces/SecretStore.md)

## Constructors

### Constructor

> **new EnvVarSecretStore**(`env?`): `EnvVarSecretStore`

Defined in: [packages/shared/secrets/src/env-backend.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L8)

#### Parameters

##### env?

`Record`\<`string`, `string` \| `undefined`\> = `process.env`

#### Returns

`EnvVarSecretStore`

## Properties

### backendId

> `readonly` **backendId**: `"env"` = `'env'`

Defined in: [packages/shared/secrets/src/env-backend.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L5)

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`backendId`](../interfaces/SecretStore.md#backendid)

## Methods

### delete()

> **delete**(`_key`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/env-backend.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L34)

#### Parameters

##### \_key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`delete`](../interfaces/SecretStore.md#delete)

---

### get()

> **get**(`key`): `Promise`\<[`SecretEntry`](../interfaces/SecretEntry.md)>>>>\>

Defined in: [packages/shared/secrets/src/env-backend.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L12)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<[`SecretEntry`](../interfaces/SecretEntry.md)\>

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`get`](../interfaces/SecretStore.md#get)

---

### has()

> **has**(`key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/shared/secrets/src/env-backend.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L42)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`has`](../interfaces/SecretStore.md#has)

---

### list()

> **list**(): `Promise`\<`string`[]\>

Defined in: [packages/shared/secrets/src/env-backend.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L38)

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`list`](../interfaces/SecretStore.md#list)

---

### rotate()

> **rotate**(`_key`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/env-backend.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L46)

#### Parameters

##### \_key

`string`

#### Returns

`Promise`\<`void`\>

---

### set()

> **set**(`_key`, `_value`, `_metadata?`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/env-backend.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/env-backend.ts#L30)

#### Parameters

##### \_key

`string`

##### \_value

`string`

##### \_metadata?

[`SecretMetadata`](../interfaces/SecretMetadata.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SecretStore`](../interfaces/SecretStore.md).[`set`](../interfaces/SecretStore.md#set)
