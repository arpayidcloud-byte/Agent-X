[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / PluginMarketplace

# Class: PluginMarketplace

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L12)

## Constructors

### Constructor

> **new PluginMarketplace**(): `PluginMarketplace`

#### Returns

`PluginMarketplace`

## Methods

### get()

> **get**(`listingId`): [`MarketplaceListing`](../interfaces/MarketplaceListing.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L32)

#### Parameters

##### listingId

`string`

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md) \| `undefined`

---

### getAll()

> **getAll**(): [`MarketplaceListing`](../interfaces/MarketplaceListing.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L36)

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md)[]

---

### list()

> **list**(`name`, `version`, `author`): [`MarketplaceListing`](../interfaces/MarketplaceListing.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L15)

#### Parameters

##### name

`string`

##### version

`string`

##### author

`string`

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md)
