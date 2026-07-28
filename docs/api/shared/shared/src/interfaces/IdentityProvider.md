[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / IdentityProvider

# Interface: IdentityProvider

Defined in: [packages/shared/shared/src/identity/interfaces.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/interfaces.ts#L26)

## Properties

### authMode

> `readonly` **authMode**: [`AuthMode`](../type-aliases/AuthMode.md)

Defined in: [packages/shared/shared/src/identity/interfaces.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/interfaces.ts#L27)

## Methods

### authenticate()

> **authenticate**(`credentials`): `Promise`\<[`Identity`](Identity.md)>>>>\>

Defined in: [packages/shared/shared/src/identity/interfaces.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/interfaces.ts#L28)

#### Parameters

##### credentials

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`Identity`](Identity.md)\>

---

### refresh()

> **refresh**(`identityId`): `Promise`\<[`Session`](Session.md)>>>>\>

Defined in: [packages/shared/shared/src/identity/interfaces.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/interfaces.ts#L31)

#### Parameters

##### identityId

`string`

#### Returns

`Promise`\<[`Session`](Session.md)\>

---

### revoke()

> **revoke**(`identityId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/shared/src/identity/interfaces.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/interfaces.ts#L30)

#### Parameters

##### identityId

`string`

#### Returns

`Promise`\<`void`\>

---

### validateToken()

> **validateToken**(`token`): `Promise`\<[`Identity`](Identity.md) \| `null`>>>>\>

Defined in: [packages/shared/shared/src/identity/interfaces.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/identity/interfaces.ts#L29)

#### Parameters

##### token

`string`

#### Returns

`Promise`\<[`Identity`](Identity.md) \| `null`\>
