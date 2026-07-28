[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / PackageMarketplace

# Class: PackageMarketplace

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L70)

## Constructors

### Constructor

> **new PackageMarketplace**(): `PackageMarketplace`

#### Returns

`PackageMarketplace`

## Methods

### get()

> **get**(`listingId`): [`MarketplaceListing`](../interfaces/MarketplaceListing.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L90)

#### Parameters

##### listingId

`string`

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md) \| `undefined`

---

### getAll()

> **getAll**(): [`MarketplaceListing`](../interfaces/MarketplaceListing.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L94)

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md)[]

---

### list()

> **list**(`name`, `version`, `author`): [`MarketplaceListing`](../interfaces/MarketplaceListing.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L73)

#### Parameters

##### name

`string`

##### version

`string`

##### author

`string`

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md)
