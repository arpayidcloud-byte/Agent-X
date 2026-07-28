[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / LocalIdentityProvider

# Class: LocalIdentityProvider

Defined in: [packages/shared/shared/src/identity/local-provider.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L15)

## Implements

- [`IdentityProvider`](../interfaces/IdentityProvider.md)

## Constructors

### Constructor

> **new LocalIdentityProvider**(`opts?`): `LocalIdentityProvider`

Defined in: [packages/shared/shared/src/identity/local-provider.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L22)

#### Parameters

##### opts?

###### sessionTtlMs?

`number`

#### Returns

`LocalIdentityProvider`

## Properties

### authMode

> `readonly` **authMode**: `"local"`

Defined in: [packages/shared/shared/src/identity/local-provider.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L16)

#### Implementation of

[`IdentityProvider`](../interfaces/IdentityProvider.md).[`authMode`](../interfaces/IdentityProvider.md#authmode)

## Methods

### authenticate()

> **authenticate**(`credentials`): `Promise`\<[`Identity`](../interfaces/Identity.md)>>>>\>

Defined in: [packages/shared/shared/src/identity/local-provider.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L26)

#### Parameters

##### credentials

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`Identity`](../interfaces/Identity.md)\>

#### Implementation of

[`IdentityProvider`](../interfaces/IdentityProvider.md).[`authenticate`](../interfaces/IdentityProvider.md#authenticate)

---

### refresh()

> **refresh**(`identityId`): `Promise`\<[`Session`](../interfaces/Session.md)>>>>\>

Defined in: [packages/shared/shared/src/identity/local-provider.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L81)

#### Parameters

##### identityId

`string`

#### Returns

`Promise`\<[`Session`](../interfaces/Session.md)\>

#### Implementation of

[`IdentityProvider`](../interfaces/IdentityProvider.md).[`refresh`](../interfaces/IdentityProvider.md#refresh)

---

### registerUser()

> **registerUser**(`email`, `password`, `displayName`, `roles?`): [`Identity`](../interfaces/Identity.md)

Defined in: [packages/shared/shared/src/identity/local-provider.ts:102](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L102)

#### Parameters

##### email

`string`

##### password

`string`

##### displayName

`string`

##### roles?

`string`[] = `...`

#### Returns

[`Identity`](../interfaces/Identity.md)

---

### revoke()

> **revoke**(`identityId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/shared/src/identity/local-provider.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L66)

#### Parameters

##### identityId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IdentityProvider`](../interfaces/IdentityProvider.md).[`revoke`](../interfaces/IdentityProvider.md#revoke)

---

### validateToken()

> **validateToken**(`token`): `Promise`\<[`Identity`](../interfaces/Identity.md) \| `null`>>>>\>

Defined in: [packages/shared/shared/src/identity/local-provider.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/local-provider.ts#L51)

#### Parameters

##### token

`string`

#### Returns

`Promise`\<[`Identity`](../interfaces/Identity.md) \| `null`\>

#### Implementation of

[`IdentityProvider`](../interfaces/IdentityProvider.md).[`validateToken`](../interfaces/IdentityProvider.md#validatetoken)
