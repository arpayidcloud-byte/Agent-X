[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RuntimeSecurityEngine

# Class: RuntimeSecurityEngine

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L55)

## Constructors

### Constructor

> **new RuntimeSecurityEngine**(): `RuntimeSecurityEngine`

#### Returns

`RuntimeSecurityEngine`

## Methods

### blockSource()

> **blockSource**(`source`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L76)

#### Parameters

##### source

`string`

#### Returns

`void`

---

### getBlockedSources()

> **getBlockedSources**(): `string`[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L92)

#### Returns

`string`[]

---

### getEvents()

> **getEvents**(): [`SecurityEvent`](../interfaces/SecurityEvent.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:88](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L88)

#### Returns

[`SecurityEvent`](../interfaces/SecurityEvent.md)[]

---

### isBlocked()

> **isBlocked**(`source`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L84)

#### Parameters

##### source

`string`

#### Returns

`boolean`

---

### recordEvent()

> **recordEvent**(`type`, `source`, `details`): [`SecurityEvent`](../interfaces/SecurityEvent.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L59)

#### Parameters

##### type

`string`

##### source

`string`

##### details

`Record`\<`string`, `unknown`\>

#### Returns

[`SecurityEvent`](../interfaces/SecurityEvent.md)

---

### unblockSource()

> **unblockSource**(`source`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L80)

#### Parameters

##### source

`string`

#### Returns

`void`
