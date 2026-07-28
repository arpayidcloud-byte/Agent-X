[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedConfigurationManager

# Class: DistributedConfigurationManager

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L12)

## Constructors

### Constructor

> **new DistributedConfigurationManager**(): `DistributedConfigurationManager`

#### Returns

`DistributedConfigurationManager`

## Methods

### delete()

> **delete**(`key`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L54)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### get()

> **get**(`key`): [`ConfigEntry`](../interfaces/ConfigEntry.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L33)

#### Parameters

##### key

`string`

#### Returns

[`ConfigEntry`](../interfaces/ConfigEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ConfigEntry`](../interfaces/ConfigEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L50)

#### Returns

[`ConfigEntry`](../interfaces/ConfigEntry.md)[]

---

### getValue()

> **getValue**(`key`): `unknown`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L37)

#### Parameters

##### key

`string`

#### Returns

`unknown`

---

### set()

> **set**(`key`, `value`, `sourceNode`): [`ConfigEntry`](../interfaces/ConfigEntry.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L15)

#### Parameters

##### key

`string`

##### value

`unknown`

##### sourceNode

`string`

#### Returns

[`ConfigEntry`](../interfaces/ConfigEntry.md)

---

### sync()

> **sync**(`entries`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L41)

#### Parameters

##### entries

[`ConfigEntry`](../interfaces/ConfigEntry.md)[]

#### Returns

`void`

---

### validate()

> **validate**(`key`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedConfigurationManager.ts#L58)

#### Parameters

##### key

`string`

#### Returns

`boolean`
