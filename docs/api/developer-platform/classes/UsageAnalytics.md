[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / UsageAnalytics

# Class: UsageAnalytics

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:247](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L247)

## Constructors

### Constructor

> **new UsageAnalytics**(): `UsageAnalytics`

#### Returns

`UsageAnalytics`

## Methods

### getAll()

> **getAll**(): `Record`\<`string`, `number`>>>>\>

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:258](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L258)

#### Returns

`Record`\<`string`, `number`\>

---

### getCount()

> **getCount**(`action`): `number`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:254](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L254)

#### Parameters

##### action

`string`

#### Returns

`number`

---

### record()

> **record**(`action`, `count?`): `void`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:250](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L250)

#### Parameters

##### action

`string`

##### count?

`number` = `1`

#### Returns

`void`
