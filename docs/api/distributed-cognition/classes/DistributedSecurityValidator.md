[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedSecurityValidator

# Class: DistributedSecurityValidator

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts#L12)

## Constructors

### Constructor

> **new DistributedSecurityValidator**(): `DistributedSecurityValidator`

#### Returns

`DistributedSecurityValidator`

## Methods

### getToken()

> **getToken**(`tokenId`): [`SecurityToken`](../interfaces/SecurityToken.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts#L61)

#### Parameters

##### tokenId

`string`

#### Returns

[`SecurityToken`](../interfaces/SecurityToken.md) \| `undefined`

---

### getTokensByNode()

> **getTokensByNode**(`nodeId`): [`SecurityToken`](../interfaces/SecurityToken.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts#L65)

#### Parameters

##### nodeId

`string`

#### Returns

[`SecurityToken`](../interfaces/SecurityToken.md)[]

---

### hasPermission()

> **hasPermission**(`tokenId`, `permission`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts#L51)

#### Parameters

##### tokenId

`string`

##### permission

`string`

#### Returns

`boolean`

---

### issueToken()

> **issueToken**(`nodeId`, `permissions`, `ttlMs?`): [`SecurityToken`](../interfaces/SecurityToken.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts#L15)

#### Parameters

##### nodeId

`string`

##### permissions

`string`[]

##### ttlMs?

`number` = `3600000`

#### Returns

[`SecurityToken`](../interfaces/SecurityToken.md)

---

### revokeToken()

> **revokeToken**(`tokenId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts#L57)

#### Parameters

##### tokenId

`string`

#### Returns

`boolean`

---

### validateToken()

> **validateToken**(`tokenId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedSecurityValidator.ts#L34)

#### Parameters

##### tokenId

`string`

#### Returns

`boolean`
